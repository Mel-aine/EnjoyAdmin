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
              {{ item.roomType.roomTypeName }}
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
                {{ item.reason }}
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

       <!-- Modal de changement de statut
     <template v-if="showStatusModal">
        <Modal @close="closeStatusModal">
          <template #body>

             <div class="no-scrollbar relative w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">

          <button
            @click="closeStatusModal"
            class="transition-color absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>
            <div class="">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ $t('changeBlockStatus') }}
                  </h3>

                  <div class="space-y-4">

                    <div class="bg-gray-50 p-3 rounded-lg">
                      <p class="text-sm text-gray-600">
                        <strong>{{ $t('room') }}:</strong> {{ selectedStatusBlock?.room?.roomNumber }}
                      </p>
                      <p class="text-sm text-gray-600">
                        <strong>{{ $t('currentStatus') }}:</strong>
                        <span :class="getStatusClass(selectedStatusBlock?.status)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-1">
                          {{ $t(`statuses.${selectedStatusBlock?.status}`) }}
                        </span>
                      </p>
                    </div>


                    <div>
                       <Select
                           v-model="newStatus"
                          :options="statusOptions"
                          :placeholder="$t('selectStatusPlaceholder')"
                          :lb="$t('newStatus')"
                        />

                    </div>


                  </div>
                </div>
              </div>


              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  @click="confirmStatusChange"
                  :disabled="statusUpdateLoading || !newStatus || newStatus === selectedStatusBlock?.status"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <span v-if="statusUpdateLoading" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ $t('updating') }}...
                  </span>
                  <span v-else>{{ $t('updateStatus') }}</span>
                </button>

                <button
                  type="button"
                  @click="closeStatusModal"
                  :disabled="statusUpdateLoading"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  {{ $t('cancel') }}
                </button>
              </div>
            </div>
            </div>
          </template>
        </Modal>
      </template> -->

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
const newStatus = ref('')
const statusChangeComment = ref('')
const statusUpdateLoading = ref(false)
const selectedStatusBlock = ref<any | null>(null)
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

const statusOptions = computed(()=>[
  { value: 'pending', label: t('statuses.pending') },
  { value: 'inProgress', label: t('statuses.in_progress') },
  { value: 'completed', label: t('statuses.completed') },
])

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
