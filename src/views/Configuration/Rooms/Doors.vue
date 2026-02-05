<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Doors Table using ReusableTable -->
      <ReusableTable
        :title="$t('Access Control Terminals')"
        :columns="columns"
        :data="doors"
        :actions="actions"
        :loading="loading"
        :search-placeholder="$t('Search terminals...')"
        :selectable="false"
        :meta="metaData"
        @page-change="handlePageChange"
        :empty-state-title="$t('No terminals found')"
        :empty-state-message="$t('Click \'Add Terminal\' to create your first access control terminal.')"
        @action="onAction"
        @selection-change="onSelectionChange">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" :label="$t('Add Terminal')" :icon="Plus" />
          <BasicButton
            v-if="selectedDoors.length > 0"
            @click="deleteSelected"
            :label="$t('Delete Selected')"
            :icon="Trash2"
            variant="danger"
          />
        </template>

        <template #column-name="{ item }">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DoorOpen class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
              <div class="text-xs text-gray-500">{{ item.ipAddress }}:{{ item.port }}</div>
            </div>
          </div>
        </template>

        <template #column-room="{ item }">
          <div v-if="item.room">
            <div class="text-sm text-gray-900">{{ item.room.roomNumber }}</div>
            <div class="text-xs text-gray-500">{{ item.room.roomType?.roomTypeName }}</div>
          </div>
          <span v-else class="text-xs text-gray-400">{{ $t('Not assigned') }}</span>
        </template>

        <template #column-status="{ item }">
          <span
            :class="{
              'bg-green-100 text-green-800': item.isActive,
              'bg-red-100 text-red-800': !item.isActive
            }"
            class="px-2 py-1 text-xs font-medium rounded-full">
            {{ item.isActive ? $t('Active') : $t('Inactive') }}
          </span>
        </template>



        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.creator?.fullName || 'N/A' }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.createdAt) }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifier?.fullName || 'N/A' }}</div>
            <div class="text-xs text-gray-400">{{ formatDateT(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Door Modal -->
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('Edit Terminal') : t('Add Terminal') }}
          </h3>

          <form @submit.prevent="saveDoor" class="space-y-6">
            <!-- Terminal Name -->
            <div>
              <Input
                :lb="t('Terminal Name')"
                v-model="formData.name"
                :placeholder="t('Enter terminal name')"
                :is-required="true"
                customClass="w-full"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('Unique name to identify this terminal') }}</p>
            </div>

            <!-- Network Configuration -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  :lb="t('IP Address')"
                  v-model="formData.ip_address"
                  :placeholder="t('192.168.1.100')"
                  :is-required="true"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('Terminal IP address on network') }}</p>
              </div>

              <div>
                <Input
                  :lb="t('Port')"
                  v-model.number="formData.port"
                  type="number"
                  :placeholder="t('4370')"
                  :is-required="true"
                  customClass="w-full"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('Communication port (default: 4370)') }}</p>
              </div>
            </div>

            <!-- Room Assignment -->
            <div>
              <Select
                :lb="t('Assigned Room')"
                :modelValue="formData.room_id"
                @update:modelValue="handleRoomChange"
                :options="roomOptions"
                :placeholder="t('Select a room')"
                customClass="w-full"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('Optional: Link this terminal to a specific room') }}</p>
            </div>

            <!-- Active Status -->
            <div class="pt-2">
              <label
                class="flex items-start text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
                <div class="relative mr-3 mt-0.5">
                  <input type="checkbox" v-model="formData.is_active" class="sr-only" />
                  <div
                    :class="formData.is_active
                      ? 'border-brand-500 bg-brand-500'
                      : 'bg-transparent border-gray-300 dark:border-gray-700'
                    "
                    class="flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500">
                    <span :class="formData.is_active ? '' : 'opacity-0'">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437"
                          stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <div>{{ t('Active Terminal') }}</div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('Enable or disable this terminal') }}</p>
                </div>
              </label>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton
                type="button"
                variant="outline"
                :label="$t('Cancel')"
                @click="closeModal"
                :disabled="saving"
              />
              <BasicButton
                type="submit"
                variant="primary"
                :icon="showEditModal ? Edit : Plus"
                :label="saving ? t('Saving') + '...' : showEditModal ? $t('Update') : $t('Add Terminal')"
                :loading="saving"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Device Info Modal -->
      <div
        v-if="showInfoModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">{{ t('Terminal Information') }}</h3>
            <button @click="showInfoModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="!deviceInfo" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-sm text-gray-600">{{ t('Loading device information...') }}</span>
          </div>

          <div v-else class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500">{{ t('Serial Number') }}</p>
                <p class="text-sm font-medium">{{ deviceInfo.serialNumber || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ t('Firmware Version') }}</p>
                <p class="text-sm font-medium">{{ deviceInfo.firmwareVersion || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ t('Users Count') }}</p>
                <p class="text-sm font-medium">{{ deviceInfo.userCount || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ t('Logs Count') }}</p>
                <p class="text-sm font-medium">{{ deviceInfo.logCount || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <BasicButton
              variant="outline"
              :label="$t('Close')"
              @click="showInfoModal = false"
            />
          </div>
        </div>
      </div>



      <!-- Confirmation Modal -->
      <ConfirmationModal
        v-model:show="showConfirmModal"
        :is-open="showConfirmModal"
        :loading="isDeletingLoading"
        :title="t('Confirm Delete')"
        :message="t('Are you sure you want to delete terminal {name}?', { name: deleteItem?.name })"
        action="DANGER"
        :confirm-text="$t('Confirm')"
        :cancel-text="$t('Cancel')"
        @close="showConfirmModal = false; deleteItem = null"
        @confirm="confirmDelete"
      />
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import { Plus, Trash2, Edit, DoorOpen, Wifi, Unlock, X, RefreshCw, Info } from 'lucide-vue-next'
import {
  getDoors,
  createDoor,
  updateDoor,
  deleteDoor,
} from '../../../services/configrationApi'
import {
  testDoorConnection,
  unlockDoorRemote,
  syncDoorLogs,
  getDoorLogs,
  syncDoorTime,
  getInfo
} from '../../../services/doors'
import { getRooms } from '../../../services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'
import { formatDateT } from '../../../components/utilities/UtilitiesFunction'

// Types
interface Door {
  id: number
  name: string
  ipAddress: string
  port: number
  roomId: number | null
  isActive: boolean
  room?: {
    roomNumber: string
    roomType?: {
      roomTypeName: string
    }
  }
  creator?: { fullName: string }
  modifier?: { fullName: string }
  createdAt: string
  updatedAt: string
}

interface DoorFormData {
  name: string
  ip_address: string
  port: number
  room_id: number | null
  is_active: boolean
}

interface Room {
  id: number
  roomNumber: string
  roomType: {
    roomTypeName: string
  }
}

interface AccessLog {
  id: number
  doorId: number
  userIdOnDevice: string
  accessTime: string
  accessType: string
  status: string
}

interface Option {
  value: string | number
  label: string
}

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const showInfoModal = ref(false)
const showLogsModal = ref(false)
const showConfirmModal = ref(false)
const selectedDoors = ref<Door[]>([])
const editingDoor = ref<Door | null>(null)
const deleteItem = ref<Door | null>(null)
const selectedDoorForLogs = ref<Door | null>(null)
const loading = ref(false)
const saving = ref(false)
const syncing = ref(false)
const isDeletingLoading = ref(false)
const currentPage = ref(1)
const metaData = ref<any>(null)
const testingConnection = ref<Record<number, boolean>>({})
const unlocking = ref<Record<number, boolean>>({})
const deviceInfo = ref<any>(null)
const accessLogs = ref<AccessLog[]>([])
const loadingInfo = ref<Record<number, boolean>>({})      // Pour "View Info"
const loadingLogs = ref<Record<number, boolean>>({})
const syncingTime = ref<Record<number, boolean>>({})
const loadingLogsData = ref(false)

// Form data
const formData = ref<DoorFormData>({
  name: '',
  ip_address: '',
  port: 4370,
  room_id: null,
  is_active: true
})

// Available options
const availableRooms = ref<Room[]>([])
const doors = ref<Door[]>([])

// Computed options
const roomOptions = computed<Option[]>(() => {
  return [
    { value: '', label: t('Not assigned') },
    ...availableRooms.value.map(room => ({
      value: room.id,
      label: `${room.roomNumber} - ${room.roomType?.roomTypeName || ''}`
    }))
  ]
})

// Handler for room selection
const handleRoomChange = (value: string | number | undefined) => {
  if (value === undefined || value === '') {
    formData.value.room_id = null
  } else {
    formData.value.room_id = typeof value === 'string' ? Number(value) : value
  }
}

// Table configuration
const columns = computed(() => [
  {
    key: 'name',
    label: t('Terminal Name'),
    sortable: true,
    searchable: true,
    type: 'custom' as const
  },
  {
    key: 'room',
    label: t('Room'),
    sortable: false,
    type: 'custom' as const
  },
  {
    key: 'status',
    label: t('Status'),
    sortable: true,
    type: 'custom' as const
  },
  {
    key: 'createdInfo',
    label: t('Created By'),
    sortable: false,
    type: 'custom' as const
  },
  {
    key: 'modifiedInfo',
    label: t('Modified By'),
    sortable: false,
    type: 'custom' as const
  }
])

const actions = computed(() => [
  {
    label: t('View Info'),
    variant: 'outline',
    handler: (item: Door) => onAction('info', item),
    icon: Info,
    loading: (item: Door) => loadingInfo.value[item.id] || false
  },

  {
    label: t('Edit'),
    variant: 'primary',
    handler: (item: Door) => onAction('edit', item),
    icon: Edit
  },
  {
    label: t('Delete'),
    icon: Trash2,
    variant: 'danger',
    handler: (item: Door) => onAction('delete', item)
  }
])

// Methods
const onSelectionChange = (selected: Door[]) => {
  selectedDoors.value = selected
}

const onAction = async (action: string, item: Door) => {
  switch (action) {
    case 'edit':
      editDoor(item)
      break
    case 'delete':
      deleteDoorItem(item)
      break
    case 'info':
      await getDeviceInfo(item)
      break

  }
}

const editDoor = (door: Door) => {
  editingDoor.value = door
  formData.value = {
    name: door.name,
    ip_address: door.ipAddress,
    port: door.port,
    room_id: door.roomId,
    is_active: door.isActive
  }
  showEditModal.value = true
}

const deleteDoorItem = (door: Door) => {
  deleteItem.value = door
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!deleteItem.value) return

  try {
    isDeletingLoading.value = true
    await deleteDoor(deleteItem.value.id)
    deleteItem.value = null
    showConfirmModal.value = false
    toast.success(t('Terminal deleted successfully'))
    loadData(1)
  } catch (error) {
    console.error(error)
    toast.error(t('Error deleting terminal'))
  } finally {
    isDeletingLoading.value = false
  }
}

const deleteSelected = async () => {
  if (confirm(`${t('Are you sure you want to delete')} ${selectedDoors.value.length} ${t('selected terminal(s)?')}`)) {
    // Implementation for bulk delete
    toast.info(t('Bulk delete not yet implemented'))
  }
}

// const testConnection = async (door: Door) => {
//   testingConnection.value[door.id] = true
//   try {
//     const response = await testDoorConnection(door.id)
//     if (response.data.success) {
//       toast.success(t('Connection successful'))
//     } else {
//       toast.error(t('Connection failed'))
//     }
//   } catch (error) {
//     console.error(error)
//     toast.error(t('Error testing connection'))
//   } finally {
//     testingConnection.value[door.id] = false
//   }
// }

// const unlockDoor = async (door: Door) => {
//   unlocking.value[door.id] = true
//   try {
//     const response = await unlockDoorRemote(door.id, 5)
//     if (response.data.success) {
//       toast.success(t('Door unlocked successfully'))
//     } else {
//       toast.error(t('Failed to unlock door'))
//     }
//   } catch (error) {
//     console.error(error)
//     toast.error(t('Error unlocking door'))
//   } finally {
//     unlocking.value[door.id] = false
//   }
// }

const getDeviceInfo = async (door: Door) => {
   loadingInfo.value[door.id] = true
    deviceInfo.value = null
    showInfoModal.value = true
  try {
    const response = await getInfo(door.id)

    console.log('Device Info response:', response)
    if (response.data.success) {
      deviceInfo.value = response.data.data
      showInfoModal.value = true
    } else {
      toast.error(t('Failed to retrieve device information'))
    }
  } catch (error) {
    console.error(error)
    toast.error(t('Error retrieving device information'))
  }finally {
    loadingInfo.value[door.id] = false
  }
}



const saveDoor = async () => {
  // Validation
  if (!formData.value.name || !formData.value.ip_address || !formData.value.port) {
    toast.error(t('Please complete all required fields'))
    return
  }

  saving.value = true

  try {
    const doorData = {
      name: formData.value.name,
      ip_address: formData.value.ip_address,
      port: formData.value.port,
      room_id: formData.value.room_id,
      is_active: formData.value.is_active
    }

    if (showEditModal.value && editingDoor.value) {
      await updateDoor(editingDoor.value.id, doorData)
      toast.success(t('Terminal updated successfully'))
    } else {
      await createDoor(doorData)
      toast.success(t('Terminal added successfully'))
    }

    closeModal()
    await loadData(1)
  } catch (error) {
    console.error('Error saving terminal:', error)
    toast.error(showEditModal.value ? t('Error updating terminal') : t('Error adding terminal'))
  } finally {
    saving.value = false
  }
}

const loadData = async (pageNumber: number = 1) => {
  loading.value = true

  try {
    const params = {
      page: pageNumber,
      per_page: 10
    }

    const resp = await getDoors(params)
    const newDoors = resp.data.data?.data || resp.data.data || resp.data || []
    const meta = resp.data.data?.meta || resp.data.meta || { total: 0, perPage: params.per_page, currentPage: pageNumber, lastPage: pageNumber }

    doors.value = newDoors
    metaData.value = meta
    currentPage.value = pageNumber
  } catch (error) {
    console.error('Error loading terminals:', error)
    toast.error(t('Error loading terminals'))
    doors.value = []
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  loadData(page)
}

const loadRooms = async () => {
  try {
    const resp = await getRooms()
    availableRooms.value = resp.data.data?.data || resp.data.data || resp.data || []
  } catch (error) {
    console.error('Error loading rooms:', error)
    // toast.error(t('Error loading rooms'))
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingDoor.value = null
  formData.value = {
    name: '',
    ip_address: '',
    port: 4370,
    room_id: null,
    is_active: true
  }
}

// Initialize data
loadData(1)
loadRooms()
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
