<template>
  <AdminLayout>
    <FullScreenLayout>
      <PageBreadcrumb :pageTitle="$t('maintenance_block')" :breadcrumb="breadcrumb" />

      <div class="space-y-6 mt-10">
        <!-- Table des blocs de maintenance -->
        <ReusableTable
          :title="$t('maintenance_block')"
          :columns="columns"
          :data="filteredBlocks"
          :actions="actions"
          :loading="loading"
          :searchable="true"
          :selectable="true"
          :empty-state-title="$t('maintenanceBlocks.noBlocksFound')"
          :empty-state-message="$t('maintenanceBlocks.noBlocksMessage')"
          v-model:searchQuery="searchQuery"
          @selection-change="onSelectionChange"
          @search-change="onSearchChange"
        >
          <template #header-actions>
            <BasicButton
              :label="$t('BlockRoom')"
              variant="primary"
              :icon="KeyRound"
              @click="openCreateBlockModal"
            />
            <BasicButton
              :label="$t('export')"
              variant="secondary"
              :icon="FileDown"
              @click="exportBlocks"
              :disabled="loading || blocks.length === 0"
              :loading="exportLoading"
            />
          </template>

          <!-- Custom column templates -->
          <template #column-room_number="{ item }">
            <div class="font-medium text-gray-900">
              {{ item.room.roomNumber }}
            </div>
          </template>

          <template #column-room_type="{ item }">
            <div class="text-sm text-gray-600">
              {{$t (item.roomType.roomTypeName) }}
            </div>
          </template>

          <template #column-block_dates="{ item }">
            <div class="text-sm">
              <div class="font-medium">{{ formatDate(item.blockFromDate) }}</div>
              <div class="text-gray-500">{{ $t('to') }} {{ formatDate(item.blockToDate) }}</div>
            </div>
          </template>

          <template #column-blocked_by="{ item }">
            <div class="text-sm text-gray-600">
              {{ item.blockedBy.firstName }} {{ item.blockedBy.lastName }}
            </div>
          </template>

          <template #column-created_at="{ item }">
            <div class="text-sm text-gray-500">
              {{ formatDate(item.createdAt) }}
            </div>
          </template>

          <template #column-reason="{ item }">
            <div class="max-w-xs">
              <p class="text-sm text-gray-600 truncate" :title="item.reason">
                {{ $t(`statuses.${item.reason}`) }}
              </p>
            </div>
          </template>

          <template #column-status="{ item }">
            <div class="flex items-center space-x-2">
            <span :class="getStatusClass(item.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ $t(`statuses.${item.status}`) }}
            </span>
              <!-- <button
                @click="openStatusModal(item)"
                class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                :title="$t('changeStatus')"
              >
                <Edit class="w-4 h-4" />
              </button> -->
              </div>
          </template>
        </ReusableTable>
      </div>



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
      <!-- Modal de confirmation de suppression -->
      <ConfirmationModal
        v-model:show="showDeleteConfirmation"
        :title="$t('confirmDelete')"
        :message="$t('deleteBlockConfirmMessage')"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        variant="danger"
        :loading="deleteLoading"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />

      <!-- Modal de création/modification de bloc -->
      <CreateBlockModal
        :is-open="isBlockModalOpen"
        :block-data="selectedBlock"
        :is-editing="isEditing"
        @close="handleBlockClose"
        @save="handleBlockSave"
      />
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import CreateBlockModal from '@/components/Housekeeping/CreateBlockModal.vue'
import { KeyRound, FileDown, Edit, Trash2,Play,CheckCircle } from 'lucide-vue-next'
import { createRoomBlock, getRoomBlocks, deleteBlock, updateRoomBlock } from '@/services/roomBlockApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { useToast } from 'vue-toastification';
import Modal from '@/components/profile/Modal.vue'
import Select from '@/components/forms/FormElements/Select.vue'

const { t } = useI18n()

// Define interfaces
interface RoomType {
  id: string
  roomTypeName: string
}

interface Room {
  id: string
  roomNumber: string
  roomType?: RoomType
}

interface BlockedByUser {
  id: string
  firstName: string
  lastName: string
}

interface MaintenanceBlock {
  id: string
  room: Room
  roomType: RoomType
  blockFromDate: string
  blockToDate: string
  blockedBy: BlockedByUser
  createdAt: string
  reason: string
  description: string
  status: string
}

// Reactive data
const loading = ref(false)
const deleteLoading = ref(false)
const exportLoading = ref(false)
const searchQuery = ref('')
const selectedBlocks = ref<MaintenanceBlock[]>([])
const showDeleteConfirmation = ref(false)
const selectedBlock = ref<MaintenanceBlock | null>(null)
const blockToDelete = ref<MaintenanceBlock | null>(null)
const isEditing = ref(false)
const isBlockModalOpen = ref(false)
const blocks = ref<MaintenanceBlock[]>([])
const serviceStore = useServiceStore()
const showStatusModal = ref(false)
const loadingStatusUpdate = ref(false)
const blockToUpdateStatus = ref<any>(null)
const newStatusToUpdate = ref('')
const statusUpdateNotes = ref('')
const toast = useToast()

// Breadcrumb
const breadcrumb = [
  { label: t('navigation.housekeeping'), href: '#' },
  { label: t('maintenance_block'), href: '#' }
]

// Table columns configuration
const columns = computed(() => [
  {
    key: 'room_number',
    label: t('maintenanceBlocks.columns.roomNumber'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'room_type',
    label: t('maintenanceBlocks.columns.roomType'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'block_dates',
    label: t('maintenanceBlocks.columns.blockDates'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'blocked_by',
    label: t('maintenanceBlocks.columns.blockedBy'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'created_at',
    label: t('maintenanceBlocks.columns.createdAt'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'reason',
    label: t('maintenanceBlocks.columns.reason'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'description',
    label: t('description'),
    type: 'custom' as const,
    sortable: true
  },
  {
    key: 'status',
    label: t('maintenanceBlocks.columns.status'),
    type: 'custom' as const,
    sortable: true
  },
])

// Computed properties
const filteredBlocks = computed(() => {
  let filtered = blocks.value

  // Apply search filter
  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase().trim()

    if (searchTerm) {
      filtered = filtered.filter(block => {
        // Recherche dans le numéro de chambre
        const roomNumber = block.room?.roomNumber?.toLowerCase() || ''

        // Recherche dans le type de chambre
        const roomType = block.roomType?.roomTypeName?.toLowerCase() ||
                         block.room?.roomType?.roomTypeName?.toLowerCase() || ''

        // Recherche dans le nom de l'utilisateur qui a bloqué
        const blockedByName = `${block.blockedBy?.firstName || ''} ${block.blockedBy?.lastName || ''}`.toLowerCase()

        // Recherche dans la raison
        const reason = block.reason?.toLowerCase() || ''

        // Recherche dans le statut
        const status = block.status?.toLowerCase() || ''

        // Recherche dans les dates (format lisible)
        const fromDate = formatDate(block.blockFromDate).toLowerCase()
        const toDate = formatDate(block.blockToDate).toLowerCase()

        return roomNumber.includes(searchTerm) ||
               roomType.includes(searchTerm) ||
               blockedByName.includes(searchTerm) ||
               reason.includes(searchTerm) ||
               status.includes(searchTerm) ||
               fromDate.includes(searchTerm) ||
               toDate.includes(searchTerm)
      })
    }
  }

  return filtered
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'inProgress':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}



// Computed properties for status modal
const statusUpdateTitle = computed(() => {
  if (!blockToUpdateStatus.value || !newStatusToUpdate.value) return ''

  switch (newStatusToUpdate.value) {
    case 'inProgress':
      return t('Mark as In Progress')
    case 'completed':
      return t('Mark as Completed')
    default:
      return t('Update Status')
  }
})

const statusUpdateMessage = computed(() => {
  if (!blockToUpdateStatus.value || !newStatusToUpdate.value) return ''

  const roomNumber = blockToUpdateStatus.value.roomNumber
  switch (newStatusToUpdate.value) {
    case 'inProgress':
      return t('statusUpdate.confirmInProgressBlock', { roomNumber })
    case 'completed':
      return t('statusUpdate.confirmCompletedBlock', { roomNumber })
    default:
      return t('statusUpdate.confirmDefaultBlock', { roomNumber })
  }
})

// Actions configuration
const actions = computed(() => [
  {
    label: t('common.edit'),
    action: 'edit',
    icon: Edit,
    variant: 'primary',
    handler: (item: MaintenanceBlock) => editBlock(item)
  },
   {
    label: t('Mark as In Progress'),
    icon: Play,
    handler: (item: any) => handleStatusUpdate(item, 'inProgress')
  },
  {
    label: t('Mark as Completed'),
    icon: CheckCircle,
    handler: (item: any) => handleStatusUpdate(item, 'completed')
  },
  {
    label: t('common.delete'),
    action: 'delete',
    icon: Trash2,
    variant: 'danger',
    handler: (item: MaintenanceBlock) => deleteBlockAction(item)
  }
])


// Status update handlers
const handleStatusUpdate = (block: any, newStatus: string) => {
  // Validate status transition
  if (newStatus === 'inProgress' && block.status !== 'pending') {
    toast.error(t('Can only mark pending block as in progress'))
    return
  }

  if (newStatus === 'completed' && block.status !== 'inProgress') {
    toast.error(t('Can only mark in progress block as completed'))
    return
  }

  blockToUpdateStatus.value = block
  newStatusToUpdate.value = newStatus
  statusUpdateNotes.value = ''
  showStatusModal.value = true
}
// Utility functions
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

// Status change functions
const confirmStatusUpdate = async () => {
  if (!blockToUpdateStatus.value || !newStatusToUpdate.value) return

  try {
    loadingStatusUpdate.value = true

    const payload = {
      status: newStatusToUpdate.value,
      notes: statusUpdateNotes.value.trim() || undefined
    }

    await updateRoomBlock(blockToUpdateStatus.value.id, payload)

    toast.success(t('Block status updated successfully'))
    await fetchBlocks()

  } catch (error: any) {
    console.error('Error updating work order status:', error)
    toast.error(error.message || t('Error updating block status'))
  } finally {
    loadingStatusUpdate.value = false
    showStatusModal.value = false
    blockToUpdateStatus.value = null
    newStatusToUpdate.value = ''
    statusUpdateNotes.value = ''
  }
}

const cancelStatusUpdate = () => {
  showStatusModal.value = false
  blockToUpdateStatus.value = null
  newStatusToUpdate.value = ''
  statusUpdateNotes.value = ''
}




// Event handlers
const onSelectionChange = (selected: MaintenanceBlock[]) => {
  selectedBlocks.value = selected
}

const onSearchChange = (query: string) => {
  searchQuery.value = query
}

// Modal handlers
const openCreateBlockModal = () => {
  selectedBlock.value = null
  isEditing.value = false
  isBlockModalOpen.value = true
}

const editBlock = (block: MaintenanceBlock) => {
  console.log('Editing block:', block)
  selectedBlock.value = { ...block }
  isEditing.value = true
  isBlockModalOpen.value = true
}

const deleteBlockAction = (block: MaintenanceBlock) => {
  blockToDelete.value = block
  showDeleteConfirmation.value = true
}

const confirmDelete = async () => {
  if (!blockToDelete.value) return

  deleteLoading.value = true

  try {
    await deleteBlock(blockToDelete.value.id)
    fetchBlocks()
    toast.success(t('successBlockDeleted'))

  } catch (error: any) {
    console.error('Error deleting block:', error)
    const errorMsg = error.response?.data?.message || error.message || t('errorDeletingBlock')
    console.log('errorMsg',errorMsg)
    toast.error(t('errorDeleteBlock'))
    // showMessage(errorMsg, 'error')
  } finally {
    deleteLoading.value = false
    showDeleteConfirmation.value = false
    blockToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirmation.value = false
  blockToDelete.value = null
}


const handleBlockSave = async (eventData: any) => {

  if (eventData.isEditing && eventData.updated) {
    await fetchBlocks()
  } else if (!eventData.isEditing && eventData.successCount > 0) {
    await fetchBlocks()
  }
  handleBlockClose()
}
const handleBlockClose = () => {
  isBlockModalOpen.value = false
  selectedBlock.value = null
  isEditing.value = false
}

const exportBlocks = async () => {
  if (blocks.value.length === 0) {
    toast.error(t('noDataToExport'))
    return
  }

  exportLoading.value = true

  try {
    // Create CSV data
    const csvData = blocks.value.map(block => ({
      'Room Number': block.room?.roomNumber || '',
      'Room Type': block.roomType?.roomTypeName || block.room?.roomType?.roomTypeName || '',
      'Start Date': formatDate(block.blockFromDate),
      'End Date': formatDate(block.blockToDate),
      'Blocked By': `${block.blockedBy?.firstName || ''} ${block.blockedBy?.lastName || ''}`.trim(),
      'Reason': block.reason || '',
      'Status': block.status || '',
      'Created At': formatDate(block.createdAt)
    }))

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(header => {
          const value = row[header as keyof typeof row] || ''
          // Escape quotes and wrap in quotes if contains comma or quote
          const escapedValue = value.toString().replace(/"/g, '""')
          return escapedValue.includes(',') || escapedValue.includes('"')
            ? `"${escapedValue}"`
            : escapedValue
        }).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `maintenance_blocks_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(t('blocksExportedSuccessfully'))
  } catch (error: any) {
    console.error('Error exporting blocks:', error)
    toast.error(t('errorExportingBlocks'))
  } finally {
    exportLoading.value = false
  }
}

// Data fetching
const fetchBlocks = async () => {
  if (!serviceStore.serviceId) {
    toast.error(t('serviceIdRequired'))
    return
  }

  loading.value = true

  try {
    const response = await getRoomBlocks(serviceStore.serviceId)
    console.log('API Response:', response.data)

    // Handle different response structures
    if (response.data?.data) {
      blocks.value = response.data.data
    } else if (Array.isArray(response.data)) {
      blocks.value = response.data
    } else {
      blocks.value = []
    }

    console.log('Fetched blocks:', blocks.value)
  } catch (error: any) {
    console.error('Error loading blocks:', error)
    const errorMsg = error.response?.data?.message || error.message || t('errorLoadingBlocks')
    console.log('errorMsg',errorMsg)
    // toast.error( t('errorLoadingBlocks'))
    blocks.value = []
  } finally {
    loading.value = false
  }
}


onMounted(async () => {
  await fetchBlocks()
})

// Watch for service changes
watch(() => serviceStore.serviceId, async (newServiceId) => {
  if (newServiceId) {
    await fetchBlocks()
  }
}, { immediate: false })

// Debounce search to improve performance
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    // The search is reactive through filteredBlocks computed
    console.log('Search query changed to:', searchQuery.value)
  }, 300)
})
</script>

<style scoped>
/* Custom styles if needed */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Fade in/out animations for messages */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
}

.fixed > div {
  animation: fadeIn 0.3s ease-out;
}

/* Loading spinner styles */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
