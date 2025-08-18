<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Room</h1>
        <p class="text-gray-600 mt-1">
          Enter all the room name/number you have in your hotel. To add a Room, click on 'Add Room' button and fill in
          the required information.
        </p>
      </div>

      <!-- Rooms Table using ReusableTable -->
      <ReusableTable title="Rooms List" :columns="columns" :data="rooms" :actions="actions"
        search-placeholder="Search rooms..." :selectable="true" empty-state-title="No rooms found"
        empty-state-message="Click 'Add Room' to create your first room." @action="onAction"
        @selection-change="onSelectionChange">
        <template #header-actions>
          <BasicButton @click="showAddModal = true" label="Add Room" :icon="Plus">
          </BasicButton>

          <BasicButton v-if="selectedRooms.length > 0" @click="deleteSelected" label="Delete Selected" :icon="Trash2">
          </BasicButton>
        </template>

        <template #column-roomInfo="{ item }">
          <div class="flex items-center space-x-3">
            <div class="text-sm font-medium text-gray-900">{{ item.roomNumber }}</div>
            <div class="text-xs text-gray-500">({{ item.shortCode }})</div>
          </div>
        </template>

        <template #column-roomType="{ item }">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.roomTypeColor }"></div>
            <span class="text-sm">{{ item.roomType.roomTypeName }}</span>
          </div>
        </template>

        <template #column-smokingAllowed="{ item }">
          <span :class="{
            'bg-green-100 text-green-800': item.smokingAllowed,
            'bg-gray-100 text-gray-800': !item.smokingAllowed
          }" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ item.smokingAllowed ? 'Non-Smoking' : 'Smoking Allowed' }}
          </span>
        </template>

        <template #column-status="{ item }">
          <span :class="{
            'bg-green-100 text-green-800': item.status === 'Available',
            'bg-red-100 text-red-800': item.status === 'Maintenance',
            'bg-yellow-100 text-yellow-800': item.status === 'Occupied'
          }" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ item.status }}
          </span>
        </template>
        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.creator?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.createdAt }}</div>
          </div>
        </template>
        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifier?.firstName }}</div>
            <div class="text-xs text-gray-400">{{ item.updatedAt }}</div>
          </div>
        </template>

      </ReusableTable>

      <!-- Add/Edit Room Modal -->
      <div v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editRoom') : t('addRoom') }}
          </h3>

          <form @submit.prevent="saveRoom" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="formData.shortCode" :lb="t('shortCode')" inputType="text" :isRequired="true"
                  :placeholder="t('enterShortCode')" maxlength="10" />
                <p class="text-xs text-gray-500 mt-1">{{ t('shortCodeDescription') }}</p>
              </div>

              <div>
                <Input v-model="formData.roomName" :lb="t('roomName')" inputType="text" :isRequired="true"
                  :placeholder="t('enterRoomName')" />
                <p class="text-xs text-gray-500 mt-1">{{ t('roomNameDescription') }}</p>
              </div>
            </div>

            <!-- Room Type and Bed Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select v-model="formData.roomType" :lb="t('roomType')" :isRequired="true"
                  :placeholder="t('selectRoomType')"
                  :options="availableRoomTypes.map(rt => ({ value: rt.id, label: rt.roomTypeName || rt.name }))" />
                <p class="text-xs text-gray-500 mt-1">{{ t('roomTypeDescription') }}</p>
              </div>

              <div>
                <Select v-model="formData.bedType" :lb="t('bedType')" :isRequired="true"
                  :placeholder="t('selectBedType')"
                  :options="availableBedTypes.map(bt => ({ value: bt.id, label: bt.bedTypeName || bt.name }))" />
                <p class="text-xs text-gray-500 mt-1">{{ t('bedTypeDescription') }}</p>
              </div>
            </div>

            <!-- Phone Extension and Key Card -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="formData.phoneExtension" :lb="t('phoneExtension')" inputType="text" :isRequired="false"
                  :placeholder="t('enterPhoneExtension')" />
                <p class="text-xs text-gray-500 mt-1">{{ t('phoneExtensionDescription') }}</p>
              </div>

              <div>
                <Input v-model="formData.keyCardAlias" :lb="t('keyCardAlias')" inputType="text" :isRequired="false"
                  :placeholder="t('enterKeyCardAlias')" />
                <p class="text-xs text-gray-500 mt-1">{{ t('keyCardAliasDescription') }}</p>
              </div>
            </div>

            <!-- Sort Key and Non-Smoking -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="formData.sortKey" :lb="t('sortKey')" inputType="number" :isRequired="false"
                  :placeholder="t('enterSortKey')" min="0" />
                <p class="text-xs text-gray-500 mt-1">{{ t('sortKeyDescription') }}</p>
              </div>

              <div class="pt-6">
                <label
                  class="flex items-start text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
                  <div class="relative mr-3 mt-0.5">
                    <input type="checkbox" v-model="formData.smokingAllowed" class="sr-only" />
                    <div :class="formData.smokingAllowed
                      ? 'border-brand-500 bg-brand-500'
                      : 'bg-transparent border-gray-300 dark:border-gray-700'
                      "
                      class="flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500">
                      <span :class="formData.smokingAllowed ? '' : 'opacity-0'">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437"
                            stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <div>{{ t('nonSmoking') }}</div>
                    <p class="text-xs text-gray-500 mt-1">{{ t('nonSmokingDescription') }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Room Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('roomImage') }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(image, index) in formData.roomImages" :key="index"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div class="text-gray-400 mb-2">
                    <Camera class="w-8 h-8 mx-auto" />
                  </div>
                  <p class="text-xs text-gray-500 mb-2">{{ t('image') }} {{ index + 1 }}</p>
                  <input type="file" accept="image/*" @change="handleImageUpload($event, index)" class="hidden"
                    :id="`image-${index}`">
                  <label :for="`image-${index}`" class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                    {{ t('chooseFile') }}
                  </label>
                  <div v-if="image" class="mt-2 text-xs text-green-600">{{ t('imageUploaded') }}</div>
                  <div v-else class="mt-2 text-xs text-gray-400">{{ t('noImageAvailable') }}</div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ t('roomImageDescription') }}</p>
            </div>

            <!-- Connect Rooms -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('connectRooms') }}
              </label>
              <div class="border border-gray-300 rounded-md p-4 max-h-40 overflow-y-auto">
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="room in availableConnectRooms" :key="room.id" class="flex items-center space-x-2">
                    <input v-model="formData.connectedRooms" :value="room.id" type="checkbox" :id="`connect-${room.id}`"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <label :for="`connect-${room.id}`" class="text-sm text-gray-700">
                      {{ room.name }} ({{ room.type }})
                    </label>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ t('connectRoomsDescription') }}</p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                {{ t('cancel') }}
              </button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <span>{{ saving ? t('saving') : (showEditModal ? t('updateRoom') : t('addRoom')) }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { Plus, Trash2, Edit, Trash, Camera } from 'lucide-vue-next'
import { getRooms, getRoomTypes, getBedTypes, postRoom, updateRoomById } from '../../../services/configrationApi'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '../../../composables/serviceStore'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedRooms = ref([])
const editingRoom = ref(null)
const loading = ref(false)
const saving = ref(false)
const serviceStore = useServiceStore()
// Form data
const formData = ref({
  shortCode: '',
  roomName: '',
  roomType: '',
  bedType: '',
  phoneExtension: '',
  keyCardAlias: '',
  sortKey: 0,
  smokingAllowed: false,
  roomImages: [null, null, null, null],
  connectedRooms: []
})

// Available options
const availableRoomTypes = ref([
])

const availableBedTypes = ref([
])

const availableConnectRooms = ref([
])

// Table configuration
const columns = ref([
  {
    key: 'roomInfo',
    label: 'Room Name',
    sortable: true,
    searchable: true,
    type: 'custom'
  },
  {
    key: 'roomType',
    label: 'Room Type',
    sortable: true,
    searchable: true,
    type: 'custom'
  },
  {
    key: 'bedType',
    label: 'Bed Type',
    sortable: true,
    searchable: true
  },
  {
    key: 'phoneExtension',
    label: 'Phone Extension',
    sortable: true
  },
  {
    key: 'smokingAllowed',
    label: 'Smoking',
    sortable: true,
    type: 'custom'
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    component: 'badge',
    type: 'custom'
  },
  {
    key: 'createdInfo',
    label: 'Created By',
    sortable: false,
    type: 'custom'
  },
  {
    key: 'modifiedInfo',
    label: 'Modified By',
    sortable: false,
    type: 'custom'
  }
])

const actions = ref([
  {
    label: 'Edit',
    icon: 'edit',
    variant: 'primary',
    action: 'edit'
  },
  {
    label: 'Delete',
    icon: 'trash',
    variant: 'danger',
    action: 'delete'
  }
])

// Sample data
const rooms = ref([
])

// Methods
const onSelectionChange = (selected) => {
  selectedRooms.value = selected
}

const onAction = (action, item) => {
  if (action === 'edit') {
    editRoom(item)
  } else if (action === 'delete') {
    deleteRoom(item)
  }
}

const editRoom = (room) => {
  editingRoom.value = room
  const roomTypeObj = availableRoomTypes.value.find(rt => rt.name === room.roomType)
  formData.value = {
    shortCode: room.shortCode,
    roomName: room.roomName,
    roomTypeId: room.roomTypeId,
    bedType: room.bedType,
    phoneExtension: room.phoneExtension,
    keyCardAlias: room.keyCardAlias,
    sortKey: room.sortKey,
    smokingAllowed: room.smokingAllowed,
    roomImages: [...room.roomImages],
    connectedRooms: [...room.connectedRooms]
  }
  showEditModal.value = true
}

const deleteRoom = (room) => {
  if (confirm(`Are you sure you want to delete room "${room.roomName}"?`)) {
    rooms.value = rooms.value.filter(r => r.id !== room.id)
  }
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedRooms.value.length} selected room(s)?`)) {
    const selectedIds = selectedRooms.value.map(r => r.id)
    rooms.value = rooms.value.filter(r => !selectedIds.includes(r.id))
    selectedRooms.value = []
  }
}

const handleImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.roomImages[index] = file
  }
}

const saveRoom = async () => {
  // Validation
  if (!formData.value.shortCode || !formData.value.roomName || !formData.value.roomTypeId || !formData.value.bedType) {
    toast.error(t('pleaseCompleteAllRequiredFields'))
    return
  }

  saving.value = true

  try {
    const roomData = {
      shortCode: formData.value.shortCode,
      roomName: formData.value.roomName,
      roomTypeId: formData.value.roomTypeId,
      bedTypeId: formData.value.bedType,
      phoneExtension: formData.value.phoneExtension,
      keyCardAlias: formData.value.keyCardAlias,
      sortKey: formData.value.sortKey,
      smokingAllowed: formData.value.smokingAllowed,
      roomImages: formData.value.roomImages.filter(img => img !== null),
      connectedRooms: formData.value.connectedRooms,
      hotelId: serviceStore.serviceId,
    }

    if (showEditModal.value && editingRoom.value) {
      // Update existing room
      await updateRoomById(editingRoom.value.id, roomData)
      toast.success(t('roomUpdatedSuccessfully'))
    } else {
      // Add new room
      await postRoom(roomData)
      toast.success(t('roomAddedSuccessfully'))
    }

    // Reload data to reflect changes
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Error saving room:', error)
    toast.error(showEditModal.value ? t('errorUpdatingRoom') : t('errorAddingRoom'))
  } finally {
    saving.value = false
  }
}
const loadData = async () => {
  loading.value = true;
  try {
    const resp = await getRooms();
    console.log('Rooms data:', resp)
    rooms.value = resp.data.data?.data || resp.data.data || resp.data || [];
  } catch (error) {
    console.error('Error loading rooms:', error);
    toast.error(t('errorLoadingRooms'));
    // Use mock data as fallback if API fails
    rooms.value = [];
  } finally {
    loading.value = false;
  }
}

const loadRoomTypes = async () => {
  try {
    const resp = await getRoomTypes();
    console.log('Room types data:', resp)
    availableRoomTypes.value = resp.data.data?.data || resp.data.data || resp.data || [];
  } catch (error) {
    console.error('Error loading room types:', error);
    toast.error(t('errorLoadingRoomTypes'));
    // Keep mock data as fallback if API fails
  }
}

const loadBedTypes = async () => {
  try {
    const resp = await getBedTypes();
    console.log('Bed types data:', resp)
    availableBedTypes.value = resp.data.data?.data || resp.data.data || resp.data || [];
  } catch (error) {
    console.error('Error loading bed types:', error);
    toast.error(t('errorLoadingBedTypes'));
    // Keep mock data as fallback if API fails
  }
}

const loadConnectingRooms = async () => {
  try {
    const resp = await getRooms();
    console.log('Available connecting rooms data:', resp)
    availableConnectRooms.value = resp.data.data?.data || resp.data.data || resp.data || [];
  } catch (error) {
    console.error('Error loading connecting rooms:', error);
    toast.error(t('errorLoadingConnectingRooms'));
    // Keep mock data as fallback if API fails
  }
}
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoom.value = null
  formData.value = {
    shortCode: '',
    roomName: '',
    roomTypeId: '',
    bedType: '',
    phoneExtension: '',
    keyCardAlias: '',
    sortKey: 0,
    smokingAllowed: false,
    roomImages: [null, null, null, null],
    connectedRooms: []
  }
}

loadData();
loadRoomTypes();
loadBedTypes();
loadConnectingRooms();
</script>
