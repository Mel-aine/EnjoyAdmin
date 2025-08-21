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
              :disabled="loading"
            />
            <BasicButton
              :label="$t('export')"
              variant="secondary"
              :icon="FileDown"
              @click="exportBlocks"
              :disabled="loading || blocks.length === 0"
            />
          </template>

          <!-- Custom column templates -->
          <template #column-room_number="{ item }">
            <div class="font-medium text-gray-900">
              {{ item.room.room_number }}
            </div>
          </template>

          <template #column-room_type="{ item }">
            <div class="text-sm text-gray-600">
              {{ item.room.id }}
            </div>
          </template>

          <template #column-block_dates="{ item }">
            <div class="text-sm">
              <div class="font-medium">{{ formatDate(item.block_from_date) }}</div>
              <div class="text-gray-500">{{ $t('to') }} {{ formatDate(item.block_to_date) }}</div>
            </div>
          </template>

          <!-- <template #column-blocked_by="{ item }">
            <div class="text-sm text-gray-600">
              {{ item.blocked_by_user.username }}
            </div>
          </template> -->

          <template #column-created_at="{ item }">
            <div class="text-sm text-gray-500">
              {{ formatDate(item.created_at) }}
            </div>
          </template>

          <template #column-reason="{ item }">
            <div class="max-w-xs">
              <p class="text-sm text-gray-600 truncate" :title="item.reason">
                {{ item.reason }}
              </p>
            </div>
          </template>
        </ReusableTable>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="fixed top-4 right-4 z-50">
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ successMessage }}
        </div>
      </div>

      <div v-if="errorMessage" class="fixed top-4 right-4 z-50">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Modal de confirmation de suppression -->
      <ConfirmationModal
        v-model:show="showDeleteConfirmation"
        :title="$t('confirmDelete')"
        :message="$t('deleteBlockConfirmMessage')"
        :confirm-text="$t('delete')"
        :cancel-text="$t('cancel')"
        variant="danger"
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
import { KeyRound, FileDown, Edit, Trash2 } from 'lucide-vue-next'
import { createRoomBlock, getRoomBlocks, deleteBlock } from '@/services/roomBlockApi'
import { useServiceStore } from '../../../composables/serviceStore';

const { t } = useI18n()

// Define interfaces
interface RoomType {
  id: string
  name: string
}

interface Room {
  id: string
  room_number: string
  room_type: RoomType
}

interface BlockedByUser {
  id: string
  username: string
}

interface MaintenanceBlock {
  id: string
  room: Room
  block_from_date: string
  block_to_date: string
  blocked_by_user: BlockedByUser
  created_at: string
  reason: string
}

// Reactive data
const loading = ref(false)
const searchQuery = ref('')
const selectedBlocks = ref<MaintenanceBlock[]>([])
const showDeleteConfirmation = ref(false)
const selectedBlock = ref<MaintenanceBlock | null>(null)
const blockToDelete = ref<MaintenanceBlock | null>(null)
const isEditing = ref(false)
const isBlockModalOpen = ref(false)
const blocks = ref<MaintenanceBlock[]>([])
const successMessage = ref('')
const errorMessage = ref('')
const serviceStore = useServiceStore()

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
    type: 'custom' as const
  },
  {
    key: 'room_type',
    label: t('maintenanceBlocks.columns.roomType'),
    type: 'custom' as const
  },
  {
    key: 'block_dates',
    label: t('maintenanceBlocks.columns.blockDates'),
    type: 'custom' as const
  },
  {
    key: 'blocked_by',
    label: t('maintenanceBlocks.columns.blockedBy'),
    type: 'custom' as const
  },
  {
    key: 'created_at',
    label: t('maintenanceBlocks.columns.createdAt'),
    type: 'custom' as const
  },
  {
    key: 'reason',
    label: t('maintenanceBlocks.columns.reason'),
    type: 'custom' as const
  }
])

// Computed properties
const filteredBlocks = computed(() => {
  let filtered = blocks.value

  // Apply search filter
  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase()
    filtered = filtered.filter(block =>
      block.room.room_number.toLowerCase().includes(searchTerm) ||
      block.room.room_type.name.toLowerCase().includes(searchTerm) ||
      block.blocked_by_user.username.toLowerCase().includes(searchTerm) ||
      block.reason.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
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
    label: t('common.delete'),
    action: 'delete',
    icon: Trash2,
    variant: 'danger',
    handler: (item: MaintenanceBlock) => deleteBlock(item)
  }
])

// Utility functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const showMessage = (message: string, type: 'success' | 'error') => {
  if (type === 'success') {
    successMessage.value = message
    errorMessage.value = ''
  } else {
    errorMessage.value = message
    successMessage.value = ''
  }

  // Clear message after 5 seconds
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 5000)
}

// Event handlers
const onSelectionChange = (selected: MaintenanceBlock[]) => {
  selectedBlocks.value = selected
}

const onSearchChange = (query: string) => {
  // Search is handled reactively through searchQuery
}

// Modal handlers
const openCreateBlockModal = () => {
  selectedBlock.value = null
  isEditing.value = false
  isBlockModalOpen.value = true
}

const editBlock = (block: MaintenanceBlock) => {
  selectedBlock.value = block
  isEditing.value = true
  isBlockModalOpen.value = true
}

const deleteBlock = (block: MaintenanceBlock) => {
  blockToDelete.value = block
  showDeleteConfirmation.value = true
}

const confirmDelete = async () => {
  if (!blockToDelete.value) return

  loading.value = true
  try {
    await deleteBlock(blockToDelete.value.id)

    // Remove from local data
    const index = blocks.value.findIndex(b => b.id === blockToDelete.value!.id)
    if (index !== -1) {
      blocks.value.splice(index, 1)
    }

    showMessage(t('blockDeletedSuccessfully'), 'success')
  } catch (error: any) {
    console.error('Error deleting block:', error)
    showMessage(error.message || t('errorDeletingBlock'), 'error')
  } finally {
    loading.value = false
    showDeleteConfirmation.value = false
    blockToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirmation.value = false
  blockToDelete.value = null
}

const handleBlockSave = async (blockData: any) => {
  try {
    loading.value = true

    if (blockData.isEditing && selectedBlock.value) {
      // Update existing block
      // const updatedBlock = await updateBlock(selectedBlock.value.id, {
      //   room_id: selectedBlock.value.room.id,
      //   block_from_date: blockData.startDate,
      //   block_to_date: blockData.endDate,
      //   reason: blockData.reason
      // })

      // Update local data
      // const index = blocks.value.findIndex(b => b.id === selectedBlock.value!.id)
      // if (index !== -1) {
      //   blocks.value[index] = updatedBlock
      // }

      showMessage(t('blockUpdatedSuccessfully'), 'success')
    } else {

      for (const roomId of blockData.selectedRooms) {
        try {
          const newBlock = await createRoomBlock({
            hotel_id:serviceStore.serviceId,
            room_id: roomId,
            block_from_date: blockData.startDate,
            block_to_date: blockData.endDate,
            reason: blockData.reason
          })
          console.log(`Block created for room ${roomId}:`, newBlock)
        } catch (error: any) {
          console.error(`Error creating block for room ${roomId}:`, error)
          showMessage(error.message || `Failed to create block for room ${roomId}`, 'error')
        }
      }

    }

    // Close modal
    handleBlockClose()
  } catch (error: any) {
    console.error('Error saving block:', error)
    showMessage(error.message || t('errorSavingBlock'), 'error')
  } finally {
    loading.value = false
  }
}

const handleBlockClose = () => {
  isBlockModalOpen.value = false
  selectedBlock.value = null
  isEditing.value = false
}

const exportBlocks = () => {
  try {
    // Create CSV data
    const csvData = blocks.value.map(block => ({
      'Room Number': block.room.room_number,
      'Room Type': block.room.room_type.name,
      'Start Date': block.block_from_date,
      'End Date': block.block_to_date,
      'Blocked By': block.blocked_by_user.username,
      'Reason': block.reason,
      'Created At': block.created_at
    }))

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
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

    showMessage(t('blocksExportedSuccessfully'), 'success')
  } catch (error) {
    console.error('Error exporting blocks:', error)
    showMessage(t('errorExportingBlocks'), 'error')
  }
}

// Data fetching
const fetchBlocks = async () => {
  loading.value = true
  try {
    const response = await getRoomBlocks(serviceStore.serviceId)
    blocks.value = response.data
    console.log('Fetched blocks:', JSON.stringify(blocks.value))
    console.log('Fetched blocks:', blocks.value)
  } catch (error: any) {
    console.error('Error loading blocks:', error)
    showMessage(error.message || t('errorLoadingBlocks'), 'error')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchBlocks()
})

// Watch for route changes or other triggers to refetch data
watch(() => [/* dependencies */], () => {
  // Refetch if needed
}, { deep: true })
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
</style>
