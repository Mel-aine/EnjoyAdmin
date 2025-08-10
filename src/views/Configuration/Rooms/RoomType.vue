<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Room Type</h1>
        <p class="text-gray-600 mt-1">
          Enter all the room types that you have in your hotel like – Deluxe, Standard, Twin, etc.
        </p>
      </div>

      <!-- Room Types Table using ReusableTable -->
      <ReusableTable
        title="Room Type List"
        :columns="columns"
        :data="roomTypes"
        :actions="actions"
        search-placeholder="Search room types..."
        :selectable="true"
        empty-state-title="No room types found"
        empty-state-message="Get started by adding a new room type."
        @selection-change="onSelectionChange"
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Room Type"
            :icon="Plus"
          >
          </BasicButton>
          <button 
            v-if="selectedRoomTypes.length > 0"
            @click="deleteSelected"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <Trash2 class="w-4 h-4" />
            <span>Delete Selected ({{ selectedRoomTypes.length }})</span>
          </button>
        </template>

        <!-- Custom column for capacity info -->
        <template #column-capacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.baseAdult }}/{{ item.baseChild }}</div>
            <div class="text-xs text-gray-400">Base A/C</div>
          </div>
        </template>

        <template #column-maxCapacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.maxAdult }}/{{ item.maxChild }}</div>
            <div class="text-xs text-gray-400">Max A/C</div>
          </div>
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

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add Room Type' : 'Edit Room Type' }}
          </h3>
          
          <form @submit.prevent="saveRoomType" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Short Code *
                </label>
                <input 
                  v-model="formData.shortCode"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DLX"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Room Type *
                </label>
                <input 
                  v-model="formData.roomType"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Deluxe Suite"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Base Adult *
                </label>
                <input 
                  v-model.number="formData.baseAdult"
                  type="number" 
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Base Child
                </label>
                <input 
                  v-model.number="formData.baseChild"
                  type="number" 
                  min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Max Adult *
                </label>
                <input 
                  v-model.number="formData.maxAdult"
                  type="number" 
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Max Child
                </label>
                <input 
                  v-model.number="formData.maxChild"
                  type="number" 
                  min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="flex items-center space-x-2">
                  <input 
                    v-model="formData.publishToWebsite"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="text-sm font-medium text-gray-700">Publish to website</span>
                </label>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Default Web Inventory
                </label>
                <input 
                  v-model.number="formData.defaultWebInventory"
                  type="number" 
                  min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number of rooms"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input 
                v-model="formData.color"
                type="color"
                class="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Select Room Amenities
              </label>
              <div class="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label v-for="amenity in availableAmenities" :key="amenity.id" class="flex items-center space-x-2">
                    <input 
                      v-model="formData.selectedAmenities"
                      :value="amenity.id"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm text-gray-700">{{ amenity.name }}</span>
                  </label>
                </div>
              </div>
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
                {{ showAddModal ? 'Save' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Edit, Trash2, X } from 'lucide-vue-next'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedRoomTypes = ref([])
const editingRoomType = ref(null)

// Form data
const formData = ref({
  shortCode: '',
  roomType: '',
  baseAdult: 2,
  baseChild: 0,
  maxAdult: 2,
  maxChild: 0,
  publishToWebsite: true,
  selectedAmenities: [],
  color: '#3B82F6',
  defaultWebInventory: 0
})

// Available amenities (from Room Amenities)
const availableAmenities = ref([
  { id: 1, name: '100% combed and ring spun cotton terry bath sheets' },
  { id: 2, name: '300-thread-count, 100% cotton bed linens' },
  { id: 3, name: 'Alarm clock' },
  { id: 4, name: 'CD Alarm Clocks' },
  { id: 5, name: 'Coffee maker' },
  { id: 6, name: 'Complimentary in-room laptop safe' },
  { id: 7, name: 'Complimentary newspaper upon request' }
])

// Table configuration
const columns = ref([
  {
    key: 'shortCode',
    label: 'Short Code',
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
    key: 'capacityInfo',
    label: 'Base (A/C)',
    sortable: false
  },
  {
    key: 'maxCapacityInfo',
    label: 'Max (A/C)',
    sortable: false
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
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    component: 'badge'
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
    icon: 'delete',
    variant: 'danger',
    action: 'delete'
  }
])

// Sample data
const roomTypes = ref([
  {
    id: 1,
    shortCode: 'DLX',
    roomType: 'One Bed Room Deluxe Suite',
    baseAdult: 2,
    baseChild: 2,
    maxAdult: 5,
    maxChild: 3,
    publishToWebsite: true,
    selectedAmenities: [1, 2, 3],
    color: '#10B981',
    defaultWebInventory: 25,
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-08-01',
    status: 'Available'
  },
  {
    id: 2,
    shortCode: '2BDS',
    roomType: 'Two Bed Room Deluxe Suite',
    baseAdult: 2,
    baseChild: 2,
    maxAdult: 2,
    maxChild: 2,
    publishToWebsite: true,
    selectedAmenities: [1, 2, 4, 5],
    color: '#3B82F6',
    defaultWebInventory: 15,
    createdBy: 'admin',
    createdDate: 'on 2012-10-31',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-11-01',
    status: 'Available'
  },
  {
    id: 3,
    shortCode: 'PS',
    roomType: 'Panoramic Suite',
    baseAdult: 2,
    baseChild: 2,
    maxAdult: 2,
    maxChild: 2,
    publishToWebsite: true,
    selectedAmenities: [1, 2, 3, 4, 5, 6],
    color: '#8B5CF6',
    defaultWebInventory: 5,
    createdBy: 'admin',
    createdDate: 'on 2012-10-31',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-31',
    status: 'Available'
  },
  {
    id: 4,
    shortCode: 'CS',
    roomType: 'Club Suite',
    baseAdult: 2,
    baseChild: 2,
    maxAdult: 2,
    maxChild: 2,
    publishToWebsite: false,
    selectedAmenities: [1, 2, 3],
    color: '#F59E0B',
    defaultWebInventory: 10,
    createdBy: 'admin',
    createdDate: 'on 2012-10-31',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-11-01',
    status: 'Available'
  },
  {
    id: 5,
    shortCode: 'DS',
    roomType: 'Diplomatic Suite',
    baseAdult: 2,
    baseChild: 2,
    maxAdult: 2,
    maxChild: 2,
    publishToWebsite: true,
    selectedAmenities: [1, 2, 3, 4, 5, 6, 7],
    color: '#EF4444',
    defaultWebInventory: 3,
    createdBy: 'admin',
    createdDate: 'on 2012-10-31',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-31',
    status: 'Available'
  },
  {
    id: 6,
    shortCode: 'PS',
    roomType: 'Presidential Suite',
    baseAdult: 2,
    baseChild: 2,
    maxAdult: 2,
    maxChild: 2,
    publishToWebsite: true,
    selectedAmenities: [1, 2, 3, 4, 5, 6, 7],
    color: '#6366F1',
    defaultWebInventory: 1,
    createdBy: 'admin',
    createdDate: 'on 2012-10-31',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-31',
    status: 'Available'
  }
])

// Methods
const onSelectionChange = (selection) => {
  selectedRoomTypes.value = selection
}

const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomType(item)
  } else if (action === 'delete') {
    deleteRoomType(item.id)
  }
}

const editRoomType = (roomType) => {
  editingRoomType.value = roomType
  formData.value = {
    shortCode: roomType.shortCode,
    roomType: roomType.roomType,
    baseAdult: roomType.baseAdult,
    baseChild: roomType.baseChild,
    maxAdult: roomType.maxAdult,
    maxChild: roomType.maxChild,
    publishToWebsite: roomType.publishToWebsite,
    selectedAmenities: [...roomType.selectedAmenities],
    color: roomType.color,
    defaultWebInventory: roomType.defaultWebInventory
  }
  showEditModal.value = true
}

const deleteRoomType = (id) => {
  if (confirm('Are you sure you want to delete this room type?')) {
    roomTypes.value = roomTypes.value.filter(roomType => roomType.id !== id)
  }
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedRoomTypes.value.length} selected room types?`)) {
    roomTypes.value = roomTypes.value.filter(roomType => !selectedRoomTypes.value.includes(roomType.id))
    selectedRoomTypes.value = []
  }
}

const saveRoomType = () => {
  if (showAddModal.value) {
    // Add new room type
    const newRoomType = {
      id: Date.now(),
      shortCode: formData.value.shortCode,
      roomType: formData.value.roomType,
      baseAdult: formData.value.baseAdult,
      baseChild: formData.value.baseChild,
      maxAdult: formData.value.maxAdult,
      maxChild: formData.value.maxChild,
      publishToWebsite: formData.value.publishToWebsite,
      selectedAmenities: [...formData.value.selectedAmenities],
      color: formData.value.color,
      defaultWebInventory: formData.value.defaultWebInventory,
      createdBy: 'admin',
      createdDate: `on ${new Date().toISOString().split('T')[0]}`,
      modifiedBy: 'admin',
      modifiedDate: `on ${new Date().toISOString().split('T')[0]}`,
      status: 'Available'
    }
    roomTypes.value.push(newRoomType)
  } else {
    // Update existing room type
    const index = roomTypes.value.findIndex(roomType => roomType.id === editingRoomType.value.id)
    if (index !== -1) {
      roomTypes.value[index] = {
        ...roomTypes.value[index],
        shortCode: formData.value.shortCode,
        roomType: formData.value.roomType,
        baseAdult: formData.value.baseAdult,
        baseChild: formData.value.baseChild,
        maxAdult: formData.value.maxAdult,
        maxChild: formData.value.maxChild,
        publishToWebsite: formData.value.publishToWebsite,
        selectedAmenities: [...formData.value.selectedAmenities],
        color: formData.value.color,
        defaultWebInventory: formData.value.defaultWebInventory,
        modifiedBy: 'admin',
        modifiedDate: `on ${new Date().toISOString().split('T')[0]}`
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoomType.value = null
  formData.value = {
    shortCode: '',
    roomType: '',
    baseAdult: 2,
    baseChild: 0,
    maxAdult: 2,
    maxChild: 0,
    publishToWebsite: true,
    selectedAmenities: [],
    color: '#3B82F6',
    defaultWebInventory: 0
  }
}
</script>