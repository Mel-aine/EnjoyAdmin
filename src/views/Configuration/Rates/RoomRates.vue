<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Room Rates</h1>
        <p class="text-gray-600 mt-1">
          Define the room rates for all the room types you have created. You can also define the rates for extra adult/child if allowed to stay in a room.
        </p>
      </div>

      <!-- Room Rates Table using ReusableTable -->
      <ReusableTable
        title="Room Rates List"
        :columns="columns"
        :data="roomRates"
        :actions="actions"
        search-placeholder="Search room rates..."
        :selectable="true"
        empty-state-title="No room rates found"
        empty-state-message="Click 'Add Room Rate' to create your first room rate."
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Room Rate"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedRoomRates.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for rate info -->
        <template #column-rateInfo="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900">${{ item.baseRate }}</div>
            <div class="text-xs text-gray-500">Base Rate</div>
          </div>
        </template>

        <!-- Custom column for extra rates -->
        <template #column-extraRates="{ item }">
          <div>
            <div class="text-xs text-gray-600">Extra Adult: ${{ item.extraAdultRate }}</div>
            <div class="text-xs text-gray-600">Extra Child: ${{ item.extraChildRate }}</div>
          </div>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add Room Rate' : 'Edit Room Rate' }}
          </h3>
          
          <form @submit.prevent="saveRoomRate" class="space-y-4">
            <!-- Room Type and Rate Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Room Type *
                </label>
                <Select 
                  v-model="formData.roomType"
                  :options="roomTypeOptions"
                  placeholder="Select room type"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rate Type *
                </label>
                <Select 
                  v-model="formData.rateType"
                  :options="rateTypeOptions"
                  placeholder="Select rate type"
                  required
                />
              </div>
            </div>

            <!-- Season and Source Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Season *
                </label>
                <Select 
                  v-model="formData.season"
                  :options="seasonOptions"
                  placeholder="Select season"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Source Name
                </label>
                <Select 
                  v-model="formData.sourceName"
                  :options="sourceOptions"
                  placeholder="Select source"
                />
              </div>
            </div>

            <!-- Base Rate -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Base Rate *
              </label>
              <Input 
                v-model="formData.baseRate"
                type="number"
                step="0.01"
                placeholder="Enter base rate amount"
                required
              />
            </div>

            <!-- Extra Adult and Child Rates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rate for Extra Adult
                </label>
                <Input 
                  v-model="formData.extraAdultRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate for extra adult"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rate for Extra Child
                </label>
                <Input 
                  v-model="formData.extraChildRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate for extra child"
                />
              </div>
            </div>

            <!-- Effective Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Effective From *
                </label>
                <InputDatePicker 
                  v-model="formData.effectiveFrom"
                  placeholder="Select effective from date"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Effective To *
                </label>
                <InputDatePicker 
                  v-model="formData.effectiveTo"
                  placeholder="Select effective to date"
                  required
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select 
                v-model="formData.status"
                :options="statusOptions"
                placeholder="Select status"
              />
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
                {{ showAddModal ? 'Add Room Rate' : 'Update Room Rate' }}
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
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRoomRate = ref(null)
const selectedRoomRates = ref([])

// Form data
const formData = ref({
  roomType: '',
  rateType: '',
  season: '',
  sourceName: '',
  baseRate: '',
  extraAdultRate: '',
  extraChildRate: '',
  effectiveFrom: '',
  effectiveTo: '',
  status: 'Active'
})

// Table columns
const columns = ref([
  {
    key: 'roomType',
    label: 'Room Type',
    sortable: true
  },
  {
    key: 'rateType',
    label: 'Rate Type',
    sortable: true
  },
  {
    key: 'season',
    label: 'Season',
    sortable: true
  },
  {
    key: 'sourceName',
    label: 'Source Name',
    sortable: true
  },
  {
    key: 'rateInfo',
    label: 'Rate',
    sortable: false
  },
  {
    key: 'extraRates',
    label: 'Extra Rates',
    sortable: false
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true
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

// Sample data
const roomRates = ref([
  {
    id: 1,
    roomType: 'Deluxe Room',
    rateType: 'Standard',
    season: 'Summer',
    sourceName: 'Direct',
    baseRate: '150.00',
    extraAdultRate: '25.00',
    extraChildRate: '15.00',
    effectiveFrom: '2024-06-01',
    effectiveTo: '2024-08-31',
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-15 10:30 AM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-20 02:15 PM'
  },
  {
    id: 2,
    roomType: 'Suite',
    rateType: 'Premium',
    season: 'Winter',
    sourceName: 'Online',
    baseRate: '200.00',
    extraAdultRate: '35.00',
    extraChildRate: '20.00',
    effectiveFrom: '2024-12-01',
    effectiveTo: '2025-02-28',
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-18 09:15 AM',
    modifiedBy: 'Admin',
    modifiedDate: '2024-01-18 09:15 AM'
  }
])

// Options for dropdowns
const roomTypeOptions = ref([
  { value: 'Standard Room', label: 'Standard Room' },
  { value: 'Deluxe Room', label: 'Deluxe Room' },
  { value: 'Suite', label: 'Suite' },
  { value: 'Executive Suite', label: 'Executive Suite' }
])

const rateTypeOptions = ref([
  { value: 'Standard', label: 'Standard' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Group', label: 'Group' }
])

const seasonOptions = ref([
  { value: 'Summer', label: 'Summer' },
  { value: 'Winter', label: 'Winter' },
  { value: 'Spring', label: 'Spring' },
  { value: 'Fall', label: 'Fall' }
])

const sourceOptions = ref([
  { value: 'Direct', label: 'Direct' },
  { value: 'Online', label: 'Online' },
  { value: 'Travel Agent', label: 'Travel Agent' },
  { value: 'Corporate', label: 'Corporate' }
])

const statusOptions = ref([
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
])

// Methods
const editRoomRate = (roomRate) => {
  editingRoomRate.value = roomRate
  formData.value = { ...roomRate }
  showEditModal.value = true
}

const deleteRoomRate = (roomRate) => {
  if (confirm(`Are you sure you want to delete room rate for "${roomRate.roomType} - ${roomRate.rateType}"?`)) {
    const index = roomRates.value.findIndex(r => r.id === roomRate.id)
    if (index > -1) {
      roomRates.value.splice(index, 1)
    }
  }
}

// Actions configuration
const actions = ref([
  {
    label: 'Edit',
    handler: editRoomRate,
    icon: Edit
  },
  {
    label: 'Delete',
    handler: deleteRoomRate,
    icon: Trash,
    variant: 'danger'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomRate(item)
  } else if (action === 'delete') {
    deleteRoomRate(item)
  }
}

const onSelectionChange = (selected) => {
  selectedRoomRates.value = selected
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedRoomRates.value.length} selected room rate(s)?`)) {
    selectedRoomRates.value.forEach(roomRate => {
      const index = roomRates.value.findIndex(r => r.id === roomRate.id)
      if (index > -1) {
        roomRates.value.splice(index, 1)
      }
    })
    selectedRoomRates.value = []
  }
}

const saveRoomRate = () => {
  if (showAddModal.value) {
    // Add new room rate
    const newRoomRate = {
      id: Date.now(),
      ...formData.value,
      createdBy: 'Current User',
      createdDate: new Date().toLocaleString(),
      modifiedBy: 'Current User',
      modifiedDate: new Date().toLocaleString()
    }
    roomRates.value.push(newRoomRate)
  } else {
    // Update existing room rate
    const index = roomRates.value.findIndex(r => r.id === editingRoomRate.value.id)
    if (index > -1) {
      roomRates.value[index] = {
        ...roomRates.value[index],
        ...formData.value,
        modifiedBy: 'Current User',
        modifiedDate: new Date().toLocaleString()
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoomRate.value = null
  formData.value = {
    roomType: '',
    rateType: '',
    season: '',
    sourceName: '',
    baseRate: '',
    extraAdultRate: '',
    extraChildRate: '',
    effectiveFrom: '',
    effectiveTo: '',
    status: 'Active'
  }
}
</script>
