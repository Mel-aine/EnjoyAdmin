<template>
  <AdminLayout>
    <FullScreenLayout>
      <PageBreadcrumb :pageTitle="$t('work_order')" :breadcrumb="breadcrumb"/>
      
      <div class="mt-10">
        <ReusableTable
          :title="$t('work_order')"
          :columns="columns"
          :data="workOrders"
          :selectable="false"
          :actions="actions"
          :loading="loading"
          :empty-state-title="$t('noWorkFound')"
          :empty-state-message="$t('noWorkMessage')"
          v-model="searchQuery"
          @search-change="onSearchChange"
          class="modern-table"
        >
          <template #header-actions="{ searchQuery }">
            <BasicButton
              :label="$t('AddWorkOrder')"
              variant="primary"
              :icon="Plus"
              @click="openAddWorkModal"
            />
            <!-- <BasicButton
              :label="$t('export')"
              variant="secondary"
              :icon="FileDown"
              @click="exportWorkOrders"
            /> -->
          </template>
        </ReusableTable>
      </div>

      <!-- Add/Edit Work Order Modal -->
      <AddWorkOrderModal 
        v-if="isAddWorkModalOpen"
        :is-open="isAddWorkModalOpen" 
        :work-order-data="selectedWorkOrder"
        :is-editing="isEditing"
        @close="closeAddWorkModal" 
        @save="handleWorkOrderSave" 
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        v-if="showDeleteModal"
        :is-open="showDeleteModal"
        :title="$t('DeleteWorkOrder')"
        :message="$t('AreYouSureDeleteWorkOrder')"
        :confirm-label="$t('Delete')"
        :cancel-label="$t('Cancel')"
        variant="danger"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, FileDown } from 'lucide-vue-next'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import AddWorkOrderModal from '@/components/Housekeeping/AddWorkOrderModal.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import { 
  getWorkOrder, 
  deleteWorkOrder,
} from '@/services/workOrderApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// State management
const loading = ref(false)
const workOrders = ref<any[]>([])
const searchQuery = ref('')
const isAddWorkModalOpen = ref(false)
const isEditing = ref(false)
const selectedWorkOrder = ref<any>(null)
const showDeleteModal = ref(false)
const workOrderToDelete = ref<any>(null)

const breadcrumb = [
  { label: t('navigation.housekeeping'), href: '#' },
  { label: t('work_order'), href: '#' }
]

// Table columns configuration
const columns = computed(() => [
  {
    key: 'rec_vou_number',
    label: t('Order#'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'room_number',
    label: t('Unit/Room'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'category',
    label: t('Category'),
    type: 'badge' as const,
    sortable: true,
    translatable: true
  },
  {
    key: 'description',
    label: t('Description'),
    type: 'text' as const,
    sortable: false,
    translatable: false,
    maxLength: 50
  },
  {
    key: 'priority',
    label: t('Priority'),
    type: 'badge' as const,
    sortable: true,
    translatable: true,
    variant: (value: string) => {
      switch (value) {
        case 'high': case 'urgent': return 'danger'
        case 'medium': return 'warning'
        case 'low': return 'success'
        default: return 'secondary'
      }
    }
  },
  {
    key: 'assigned_user_name',
    label: t('AssignTo'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  
  {
    key: 'due_date',
    label: t('Deadline'),
    type: 'date' as const,
    sortable: true,
    translatable: false,
    dateFormat: 'short'
  },
  {
    key: 'status',
    label: t('Status'),
    type: 'badge' as const,
    sortable: true,
    translatable: true,
    variant: (value: string) => {
      switch (value) {
        case 'completed': return 'success'
        case 'in_progress': return 'warning'
        case 'assigned': return 'info'
      
        default: return 'secondary'
      }
    }
  }
])

// Table actions
const actions = computed(() => [
  {
    label: t('EditWorkOrder'),
    icon: 'Edit',
    handler: (item: any) => handleEdit(item)
  },
  {
    label: t('ViewDetails'),
    icon: 'Eye',
    handler: (item: any) => handleView(item)
  },
  {
    label: t('PrintWorkOrder'),
    icon: 'Printer',
    handler: (item: any) => handlePrint(item)
  },
  {
    label: t('DeleteWorkOrder'),
    icon: 'Trash',
    variant: 'danger',
    handler: (item: any) => handleDelete(item)
  }
])

// Modal management
const openAddWorkModal = () => {
  selectedWorkOrder.value = null
  isEditing.value = false
  isAddWorkModalOpen.value = true
}

const closeAddWorkModal = () => {
  isAddWorkModalOpen.value = false
  selectedWorkOrder.value = null
  isEditing.value = false
}

// CRUD Operations
const fetchWorkOrders = async () => {
  loading.value = true
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) {
      throw new Error('Hotel ID not found')
    }

    const response = await getWorkOrder(hotelId)

    workOrders.value = response.data.data || []
  } catch (error: any) {
    console.error('Error fetching work orders:', error)
    toast.error(error.message || t('ErrorFetchingWorkOrders'))
    workOrders.value = []
  } finally {
    loading.value = false
  }
}

const handleWorkOrderSave = async (eventData: any) => {
  if (eventData.success) {
    await fetchWorkOrders()
    toast.success(
      eventData.isEditing 
        ? t('WorkOrderUpdatedSuccessfully') 
        : t('WorkOrderCreatedSuccessfully')
    )
  }
  closeAddWorkModal()
}

// Action handlers
const handleEdit = (workOrder: any) => {
  selectedWorkOrder.value = workOrder
  isEditing.value = true
  isAddWorkModalOpen.value = true
}

const handleView = (workOrder: any) => {
  // Implement view details functionality
  console.log('View work order:', workOrder)
  // You can open a detailed view modal or navigate to a details page
}

const handlePrint = (workOrder: any) => {
  // Implement print functionality
  console.log('Print work order:', workOrder)
  window.print() // Simple implementation, you might want to create a dedicated print view
}

const handleDelete = (workOrder: any) => {
  workOrderToDelete.value = workOrder
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!workOrderToDelete.value) return

  try {
    await deleteWorkOrder(workOrderToDelete.value.id)
    toast.success(t('WorkOrderDeletedSuccessfully'))
    await fetchWorkOrders()
  } catch (error: any) {
    console.error('Error deleting work order:', error)
    toast.error(error.message || t('ErrorDeletingWorkOrder'))
  } finally {
    showDeleteModal.value = false
    workOrderToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  workOrderToDelete.value = null
}

// Search functionality
const onSearchChange = (query: string) => {
  searchQuery.value = query
  // Debounce the search to avoid too many API calls
  setTimeout(() => {
    fetchWorkOrders()
  }, 500)
}



// Lifecycle
onMounted(() => {
  fetchWorkOrders()
})
</script>

<style scoped>
.modern-table {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm;
}

/* Add any additional custom styles here */
</style>