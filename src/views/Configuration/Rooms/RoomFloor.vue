<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Room</h1>
        <p class="text-gray-600 mt-1">
          Enter all the room name/number you have in your hotel. To add a Room, click on 'Add Room' button and fill in the required information.
        </p>
      </div>

      <!-- Rooms Table using ReusableTable -->
      <ReusableTable
        title="Rooms List"
        :columns="columns"
        :data="rooms"
        :actions="actions"
        search-placeholder="Search rooms..."
        :selectable="true"
        empty-state-title="No rooms found"
        empty-state-message="Click 'Add Room' to create your first room."
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Room"
            :icon="Plus"
          >
          </BasicButton>
          
          <BasicButton 
            v-if="selectedRooms.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <template #column-roomInfo="{ item }">
          <div class="flex items-center space-x-3">
            <div class="text-sm font-medium text-gray-900">{{ item.roomName }}</div>
            <div class="text-xs text-gray-500">({{ item.shortCode }})</div>
          </div>
        </template>

        <template #column-roomType="{ item }">
          <div class="flex items-center space-x-2">
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: item.roomTypeColor }"
            ></div>
            <span class="text-sm">{{ item.roomType }}</span>
          </div>
        </template>

        <template #column-nonSmoking="{ item }">
          <span 
            :class="{
              'bg-green-100 text-green-800': item.nonSmoking,
              'bg-gray-100 text-gray-800': !item.nonSmoking
            }"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ item.nonSmoking ? 'Non-Smoking' : 'Smoking Allowed' }}
          </span>
        </template>

        <template #column-status="{ item }">
          <span 
            :class="{
              'bg-green-100 text-green-800': item.status === 'Available',
              'bg-red-100 text-red-800': item.status === 'Maintenance',
              'bg-yellow-100 text-yellow-800': item.status === 'Occupied'
            }"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ item.status }}
          </span>
        </template>

        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Room Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? 'Edit Room' : 'Add Room' }}
          </h3>
          
          <form @submit.prevent="saveRoom" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Short Code *
                </label>
                <input 
                  v-model="formData.shortCode"
                  type="text" 
                  required
                  maxlength="10"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 101, A1"
                >
                <p class="text-xs text-gray-500 mt-1">Short name for the room name you will define</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Room Name *
                </label>
                <input 
                  v-model="formData.roomName"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 101, Room A1"
                >
                <p class="text-xs text-gray-500 mt-1">The name or number of the room you have in your property</p>
              </div>
            </div>

            <!-- Room Type and Bed Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Room Type *
                </label>
                <select 
                  v-model="formData.roomType"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Room Type</option>
                  <option v-for="roomType in availableRoomTypes" :key="roomType.id" :value="roomType.name">
                    {{ roomType.name }}
                  </option>
                </select>
                <p class="text-xs text-gray-500 mt-1">Select the room type that this room belongs to</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bed Type *
                </label>
                <select 
                  v-model="formData.bedType"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Bed Type</option>
                  <option v-for="bedType in availableBedTypes" :key="bedType.id" :value="bedType.name">
                    {{ bedType.name }}
                  </option>
                </select>
                <p class="text-xs text-gray-500 mt-1">Select the bed type you have for this room</p>
              </div>
            </div>

            <!-- Phone Extension and Key Card -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Extension
                </label>
                <input 
                  v-model="formData.phoneExtension"
                  type="text" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 110"
                >
                <p class="text-xs text-gray-500 mt-1">Enter the phone extension that is used for this room</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Key Card Alias
                </label>
                <input 
                  v-model="formData.keyCardAlias"
                  type="text" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Key card number"
                >
                <p class="text-xs text-gray-500 mt-1">Enter the key card no. which is generated from the software of Door lock</p>
              </div>
            </div>

            <!-- Sort Key and Non-Smoking -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sort Key
                </label>
                <input 
                  v-model.number="formData.sortKey"
                  type="number" 
                  min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                >
                <p class="text-xs text-gray-500 mt-1">Enter the number the way you want to sort this room in the room list</p>
              </div>
              
              <div class="flex items-center space-x-2 pt-6">
                <input 
                  v-model="formData.nonSmoking"
                  type="checkbox"
                  id="nonSmoking"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <label for="nonSmoking" class="text-sm font-medium text-gray-700">
                  Non-Smoking
                </label>
                <p class="text-xs text-gray-500">Check-mark if this room is a non-smoking room</p>
              </div>
            </div>

            <!-- Room Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Room Image
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(image, index) in formData.roomImages" :key="index" class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div class="text-gray-400 mb-2">
                    <Camera class="w-8 h-8 mx-auto" />
                  </div>
                  <p class="text-xs text-gray-500 mb-2">Image {{ index + 1 }}</p>
                  <input 
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload($event, index)"
                    class="hidden"
                    :id="`image-${index}`"
                  >
                  <label 
                    :for="`image-${index}`"
                    class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <div v-if="image" class="mt-2 text-xs text-green-600">Image uploaded</div>
                  <div v-else class="mt-2 text-xs text-gray-400">No Image Available</div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">This option allows you to upload images of the room. Click on choose file and select the images stored on your local machine.</p>
            </div>

            <!-- Connect Rooms -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Connect Rooms
              </label>
              <div class="border border-gray-300 rounded-md p-4 max-h-40 overflow-y-auto">
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="room in availableConnectRooms" :key="room.id" class="flex items-center space-x-2">
                    <input 
                      v-model="formData.connectedRooms"
                      :value="room.id"
                      type="checkbox"
                      :id="`connect-${room.id}`"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <label :for="`connect-${room.id}`" class="text-sm text-gray-700">
                      {{ room.name }} ({{ room.type }})
                    </label>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">If there are any connecting rooms then this can be assigned from this option.</p>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ showEditModal ? 'Update Room' : 'Add Room' }}
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
import { Plus, Trash2, Edit, Trash, Camera } from 'lucide-vue-next'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedRooms = ref([])
const editingRoom = ref(null)

// Form data
const formData = ref({
  shortCode: '',
  roomName: '',
  roomType: '',
  bedType: '',
  phoneExtension: '',
  keyCardAlias: '',
  sortKey: 0,
  nonSmoking: false,
  roomImages: [null, null, null, null],
  connectedRooms: []
})

// Available options
const availableRoomTypes = ref([
  { id: 1, name: 'One Bed Room Deluxe Suite', color: '#10B981' },
  { id: 2, name: 'Two Bed Room Deluxe Suite', color: '#3B82F6' },
  { id: 3, name: 'Panoramic Suite', color: '#8B5CF6' },
  { id: 4, name: 'Club Suite', color: '#F59E0B' },
  { id: 5, name: 'Diplomatic Suite', color: '#EF4444' },
  { id: 6, name: 'Presidential Suite', color: '#6366F1' }
])

const availableBedTypes = ref([
  { id: 1, name: 'King Bed' },
  { id: 2, name: 'Queen Bed' },
  { id: 3, name: 'Double Bed' },
  { id: 4, name: 'Single Bed' },
  { id: 5, name: 'Twin Bed' }
])

const availableConnectRooms = ref([
  { id: 102, name: '102', type: 'Club Suite' },
  { id: 201, name: '201', type: 'Diplomatic Suite' },
  { id: 202, name: '202', type: 'Diplomatic Suite' },
  { id: 301, name: '301', type: 'One Bed Room Deluxe Suite' },
  { id: 302, name: '302', type: 'One Bed Room Deluxe Suite' }
])

// Table configuration
const columns = ref([
  {
    key: 'roomInfo',
    label: 'Room Name',
    sortable: true,
    searchable: true
  },
  {
    key: 'roomType',
    label: 'Room Type',
    sortable: true,
    searchable: true
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
    key: 'nonSmoking',
    label: 'Smoking',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    component: 'badge'
  },
  {
    key: 'createdInfo',
    label: 'Created By',
    sortable: false
  },
  {
    key: 'modifiedInfo',
    label: 'Modified By',
    sortable: false
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
  {
    id: 1,
    shortCode: '101',
    roomName: '101',
    roomType: 'One Bed Room Deluxe Suite',
    roomTypeColor: '#10B981',
    bedType: 'King Bed',
    phoneExtension: '110',
    keyCardAlias: 'KC101',
    sortKey: 1,
    nonSmoking: true,
    roomImages: [null, null, null, null],
    connectedRooms: [102],
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 2,
    shortCode: '102',
    roomName: '102',
    roomType: 'Club Suite',
    roomTypeColor: '#F59E0B',
    bedType: 'Queen Bed',
    phoneExtension: '111',
    keyCardAlias: 'KC102',
    sortKey: 2,
    nonSmoking: true,
    roomImages: [null, null, null, null],
    connectedRooms: [101],
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 3,
    shortCode: '201',
    roomName: '201',
    roomType: 'Diplomatic Suite',
    roomTypeColor: '#EF4444',
    bedType: 'King Bed',
    phoneExtension: '210',
    keyCardAlias: 'KC201',
    sortKey: 3,
    nonSmoking: false,
    roomImages: [null, null, null, null],
    connectedRooms: [202],
    status: 'Occupied',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 4,
    shortCode: '202',
    roomName: '202',
    roomType: 'Diplomatic Suite',
    roomTypeColor: '#EF4444',
    bedType: 'Double Bed',
    phoneExtension: '211',
    keyCardAlias: 'KC202',
    sortKey: 4,
    nonSmoking: true,
    roomImages: [null, null, null, null],
    connectedRooms: [201],
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 5,
    shortCode: '301',
    roomName: '301',
    roomType: 'One Bed Room Deluxe Suite',
    roomTypeColor: '#10B981',
    bedType: 'King Bed',
    phoneExtension: '310',
    keyCardAlias: 'KC301',
    sortKey: 5,
    nonSmoking: true,
    roomImages: [null, null, null, null],
    connectedRooms: [302],
    status: 'Maintenance',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 6,
    shortCode: '302',
    roomName: '302',
    roomType: 'One Bed Room Deluxe Suite',
    roomTypeColor: '#10B981',
    bedType: 'Queen Bed',
    phoneExtension: '311',
    keyCardAlias: 'KC302',
    sortKey: 6,
    nonSmoking: false,
    roomImages: [null, null, null, null],
    connectedRooms: [301],
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  }
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
    roomType: room.roomType,
    bedType: room.bedType,
    phoneExtension: room.phoneExtension,
    keyCardAlias: room.keyCardAlias,
    sortKey: room.sortKey,
    nonSmoking: room.nonSmoking,
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

const saveRoom = () => {
  const roomTypeObj = availableRoomTypes.value.find(rt => rt.name === formData.value.roomType)
  
  if (showEditModal.value && editingRoom.value) {
    // Update existing room
    const index = rooms.value.findIndex(r => r.id === editingRoom.value.id)
    if (index !== -1) {
      rooms.value[index] = {
        ...rooms.value[index],
        shortCode: formData.value.shortCode,
        roomName: formData.value.roomName,
        roomType: formData.value.roomType,
        roomTypeColor: roomTypeObj?.color || '#3B82F6',
        bedType: formData.value.bedType,
        phoneExtension: formData.value.phoneExtension,
        keyCardAlias: formData.value.keyCardAlias,
        sortKey: formData.value.sortKey,
        nonSmoking: formData.value.nonSmoking,
        roomImages: [...formData.value.roomImages],
        connectedRooms: [...formData.value.connectedRooms]
      }
    }
  } else {
    // Add new room
    const newRoom = {
      id: Date.now(),
      shortCode: formData.value.shortCode,
      roomName: formData.value.roomName,
      roomType: formData.value.roomType,
      roomTypeColor: roomTypeObj?.color || '#3B82F6',
      bedType: formData.value.bedType,
      phoneExtension: formData.value.phoneExtension,
      keyCardAlias: formData.value.keyCardAlias,
      sortKey: formData.value.sortKey,
      nonSmoking: formData.value.nonSmoking,
      roomImages: [...formData.value.roomImages],
      connectedRooms: [...formData.value.connectedRooms],
      status: 'Available'
    }
    rooms.value.push(newRoom)
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoom.value = null
  formData.value = {
    shortCode: '',
    roomName: '',
    roomType: '',
    bedType: '',
    phoneExtension: '',
    keyCardAlias: '',
    sortKey: 0,
    nonSmoking: false,
    roomImages: [null, null, null, null],
    connectedRooms: []
  }
}
</script>
