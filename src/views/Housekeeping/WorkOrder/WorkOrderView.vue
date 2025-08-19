<template>
    <AdminLayout>
       <FullScreenLayout>
        <PageBreadcrumb :pageTitle="$t('work_order')"/>
          <div class="mt-10">
            <ReusableTable
              :title="$t('work_order')"
              :columns="columns"
              :data="WorkOrders"
              :selectable="false"
              :actions="actions"
              :loading="loading"
              v-model="searchQuery"
              @search-change="onSearchChange"
              class="modern-table"
            >
              <template #header-actions="{ searchQuery }">
                <BasicButton
                  :label="$t('AddWorkOrder')"
                  variant="primary"
                  :icon="CirclePlus"
                  @click="openAddWorkModal"
                />
                <BasicButton
                  :label="$t('export')"
                  variant="secondary"
                  :icon="FileDown"
                />

              </template>
            </ReusableTable>
          </div>
          <template v-if="isAddWorkModalOpen">
          <AddWorkOrderModal :is-open="isAddWorkModalOpen" @close="closeAddWorkModal"  />
        </template>
      </FullScreenLayout>
    </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { CirclePlus} from 'lucide-vue-next'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import { useToast } from 'vue-toastification';
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { FileDown } from 'lucide-vue-next';
import AddWorkOrderModal from '@/components/Housekeeping/AddWorkOrderModal.vue'


const { t } = useI18n()
const loading = ref(false)
const isAddWorkModalOpen = ref(false)



const columns = computed(() => [
  {
    key: 'orderNumber',
    label: t('Order#'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'unitRoom',
    label: t('Unit/Room'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'category',
    label: t('Category'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'description',
    label: t('Description'),
    type: 'text' as const,
    sortable: true,
    translatable: true
  },
  {
    key: 'priority',
    label: t('Priority'),
    type: 'text' as const,
    sortable: true,
    translatable: true
  },
  {
    key: 'assignTo',
    label: t('AssignTo'),
    type: 'text' as const,
    sortable: true,
    translatable: true
  },
  {
    key: 'enteredOn',
    label: t('EnteredOn'),
    type: 'date' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'updatedAt',
    label: t('Updated'),
    type: 'date' as const,
    sortable: true,
    dateFormat: 'short',
    translatable: false
  },
  {
    key: 'deadline',
    label: t('Deadline'),
    type: 'date' as const,
    sortable: true,
    translatable: true
  },
  {
    key: 'status',
    label: t('Status'),
    type: 'badge' as const,
    sortable: true,
    translatable: true
  }
])


const WorkOrders = [
  {
    orderNumber: "WO-001",
    unitRoom: "Room 101",
    category: "Plumbing",
    description: "Leaking sink in the bathroom",
    priority: "High",
    assignTo: "John Doe",
    enteredOn: "2025-08-01",
    updatedAt: "2025-08-15",
    deadline: "2025-08-20",
    status: "In Progress"
  },
  {
    orderNumber: "WO-002",
    unitRoom: "Room 205",
    category: "Electrical",
    description: "Light not working",
    priority: "Medium",
    assignTo: "Jane Smith",
    enteredOn: "2025-08-10",
    updatedAt: "2025-08-18",
    deadline: "2025-08-22",
    status: "Pending"
  },
  {
    orderNumber: "WO-003",
    unitRoom: "Room 310",
    category: "Housekeeping",
    description: "Carpet needs cleaning",
    priority: "Low",
    assignTo: "Ali Karim",
    enteredOn: "2025-08-05",
    updatedAt: "2025-08-17",
    deadline: "2025-08-25",
    status: "Completed"
  }
]


const openAddWorkModal = () => {
  isAddWorkModalOpen.value = true
}

const closeAddWorkModal = () => {
  isAddWorkModalOpen.value = false
}


// Header actions are now handled through slots

// Search functionality
const searchQuery = ref('')

const onSearchChange = (query: string) => {
  console.log('Search query changed:', query)
  // Add any additional search logic here if needed
}




const actions = computed(() => [
  {
    label: 'Edit Work Order',
    handler: (item: any) => handleCustomerAction('edit', item)
  },
  {
    label: 'Post Note',
    handler: (item: any) => handleCustomerAction('post', item)
  },
   {
    label: 'Print Work Order',
    handler: (item: any) => handleCustomerAction('print', item)
  }
])

</script>

<style scoped></style>
