<template>
  <AdminLayout>
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

          <template #column-status="{ item }">
            <span :class="getStatusClass(item.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ $t(`statuses.${item.status}`) }}
            </span>
          </template>

          <template #column-priority="{ item }">
            <span :class="getPriorityClass(item.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ $t(`taskManagement.priorities.${item.priority}`) }}
            </span>
          </template>

          <template #column-assignedToUser="{ item }">
            <div class="text-sm text-gray-600">
              {{ item.assignedToUser.firstName }} {{ item.assignedToUser.lastName }}
            </div>
          </template>

          <template #column-dueDateTime="{ item }">
            <div class="text-sm text-gray-500">
              {{ formatDateT(item.dueDateTime) }}
            </div>
          </template>

          <template #column-roomNumber="{ item }">
            <div class="text-sm text-gray-600">
              {{ item.room.roomNumber }}
            </div>
          </template>

          <template #column-block_dates="{ item }">
            <div class="text-sm">
              <div class="font-medium">{{ formatDate(item.blockFromDate) }}</div>
              <div class="text-gray-500">{{ $t('to') }} {{ formatDate(item.blockToDate) }}</div>
            </div>
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
        v-model:show="showDeleteModal"
        :title="$t('DeleteWorkOrder')"
        :message="$t('AreYouSureDeleteWorkOrder')"
        :confirm-text="$t('Delete')"
        :cancel-text="$t('Cancel')"
        variant="danger"
        :loading="loadingDelete"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />

      <!-- Status Update Modal -->
      <ConfirmationModal
        v-model:show="showStatusModal"
        :title="statusUpdateTitle"
        :message="statusUpdateMessage"
        :confirm-text="$t('Confirm')"
        :cancel-text="$t('Cancel')"
        variant="warning"
        :loading="loadingStatusUpdate"
        @confirm="confirmStatusUpdate"
        @cancel="cancelStatusUpdate"
      >
        <template #content>

          <div class="mt-4 mx-8">
            <label for="statusNotes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Notes') }} ({{ $t('Optional') }})
            </label>
            <textarea
           id="statusNotes"
              v-model="statusUpdateNotes"
          :placeholder="$t('Add notes about this status change...')"
          rows="6"
          class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
        ></textarea>

          </div>
        </template>
      </ConfirmationModal>

  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, FileDown, Edit, Trash2, Play, CheckCircle } from 'lucide-vue-next'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import AddWorkOrderModal from '@/components/Housekeeping/AddWorkOrderModal.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import { formatDateT } from '@/components/utilities/UtilitiesFunction'
import {
  getWorkOrder,
  deleteWorkOrder,
  updateStatusWorkOrder
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
const loadingDelete = ref(false)

// Status update modal state
const showStatusModal = ref(false)
const loadingStatusUpdate = ref(false)
const workOrderToUpdateStatus = ref<any>(null)
const newStatusToUpdate = ref('')
const statusUpdateNotes = ref('')

const breadcrumb = [
  { label: t('navigation.housekeeping'), href: '#' },
  { label: t('work_order'), href: '#' }
]

// Computed properties for status modal
const statusUpdateTitle = computed(() => {
  if (!workOrderToUpdateStatus.value || !newStatusToUpdate.value) return ''

  switch (newStatusToUpdate.value) {
    case 'in_progress':
      return t('Mark as In Progress')
    case 'completed':
      return t('Mark as Completed')
    default:
      return t('Update Status')
  }
})

const statusUpdateMessage = computed(() => {
  if (!workOrderToUpdateStatus.value || !newStatusToUpdate.value) return ''

  const orderNumber = workOrderToUpdateStatus.value.orderNumber
  switch (newStatusToUpdate.value) {
    case 'in_progress':
      return t('statusUpdate.confirmInProgress', { orderNumber })
    case 'completed':
      return t('statusUpdate.confirmCompleted', { orderNumber })
    default:
      return t('statusUpdate.confirmDefault', { orderNumber })
  }
})


// Table columns configuration
const columns = computed(() => [
  {
    key: 'orderNumber',
    label: t('Order#'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'roomNumber',
    label: t('Unit/Room'),
    type: 'custom' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'category',
    label: t('Category'),
    type: 'text' as const,
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
    type: 'custom' as const,
    sortable: true,
  },
  {
    key: 'assignedToUser',
    label: t('AssignTo'),
    type: 'custom' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'block_dates',
    label: t('maintenanceBlocks.columns.blockDates'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'dueDateTime',
    label: t('Deadline'),
    type: 'custom' as const,
    sortable: true,
  },
  {
    key: 'status',
    label: t('Status'),
    type: 'custom' as const,
    sortable: true,
    translatable: true,
  }
])

const getStatusClass = (status: string) => {
  switch (status) {
    case 'assigned':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in_progress':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high':
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Simple actions array - all actions are always shown
const actions = computed(() => [
  {
    label: t('EditWorkOrder'),
    icon: Edit,
    handler: (item: any) => handleEdit(item)
  },
  {
    label: t('Mark as In Progress'),
    icon: Play,
    handler: (item: any) => handleStatusUpdate(item, 'in_progress')
  },
  {
    label: t('Mark as Completed'),
    icon: CheckCircle,
    handler: (item: any) => handleStatusUpdate(item, 'completed')
  },
  {
    label: t('DeleteWorkOrder'),
    icon: Trash2,
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

// Status update handlers
const handleStatusUpdate = (workOrder: any, newStatus: string) => {
  // Validate status transition
  if (newStatus === 'in_progress' && workOrder.status !== 'assigned') {
    toast.error(t('Can only mark assigned work orders as in progress'))
    return
  }

  if (newStatus === 'completed' && workOrder.status !== 'in_progress') {
    toast.error(t('Can only mark in progress work orders as completed'))
    return
  }

  workOrderToUpdateStatus.value = workOrder
  newStatusToUpdate.value = newStatus
  statusUpdateNotes.value = ''
  showStatusModal.value = true
}

const confirmStatusUpdate = async () => {
  if (!workOrderToUpdateStatus.value || !newStatusToUpdate.value) return

  try {
    loadingStatusUpdate.value = true

    const payload = {
      status: newStatusToUpdate.value,
      notes: statusUpdateNotes.value.trim() || undefined
    }

    await updateStatusWorkOrder(workOrderToUpdateStatus.value.id, payload)

    toast.success(t('Work order status updated successfully'))
    await fetchWorkOrders()

  } catch (error: any) {
    console.error('Error updating work order status:', error)
    toast.error(error.message || t('Error updating work order status'))
  } finally {
    loadingStatusUpdate.value = false
    showStatusModal.value = false
    workOrderToUpdateStatus.value = null
    newStatusToUpdate.value = ''
    statusUpdateNotes.value = ''
  }
}

const cancelStatusUpdate = () => {
  showStatusModal.value = false
  workOrderToUpdateStatus.value = null
  newStatusToUpdate.value = ''
  statusUpdateNotes.value = ''
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
    console.log('fetchWorkOrders', response)

    workOrders.value = response.data.data.data || []
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
  console.log('Editing workOrder:', workOrder)
  selectedWorkOrder.value = workOrder
  isEditing.value = true
  isAddWorkModalOpen.value = true
}

const handleDelete = (workOrder: any) => {
  workOrderToDelete.value = workOrder
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!workOrderToDelete.value) return

  try {
    loadingDelete.value = true
    await deleteWorkOrder(workOrderToDelete.value.id)
    toast.success(t('WorkOrderDeletedSuccessfully'))
    await fetchWorkOrders()
  } catch (error: any) {
    console.error('Error deleting work order:', error)
    toast.error(error.message || t('ErrorDeletingWorkOrder'))
  } finally {
    loadingDelete.value = false
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

const formatDate = (dateString: string): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
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
