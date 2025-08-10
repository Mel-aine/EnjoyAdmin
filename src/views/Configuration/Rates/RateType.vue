<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Rate Type</h1>
        <p class="text-gray-600 mt-1">
          Define all the rate types that you have in your hotel. Configure rate codes, nights, adult limits, and room type associations.
        </p>
      </div>

      <!-- Rate Types Table using ReusableTable -->
      <ReusableTable
        title="Rate Types List"
        :columns="columns"
        :data="rateTypes"
        :actions="actions"
        search-placeholder="Search rate types..."
        :selectable="true"
        empty-state-title="No rate types found"
        empty-state-message="Click 'Add Rate Type' to create your first rate type."
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Rate Type"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedRateTypes.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for nights info -->
        <template #column-nightsInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.nights }} night{{ item.nights !== 1 ? 's' : '' }}</div>
            <div class="text-xs text-gray-500">Min: {{ item.minNights }} nights</div>
          </div>
        </template>

        <!-- Custom column for capacity info -->
        <template #column-capacityInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">Max {{ item.maxAdults }} adult{{ item.maxAdults !== 1 ? 's' : '' }}</div>
            <div class="text-xs text-gray-500">{{ item.roomType }}</div>
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
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add Rate Type' : 'Edit Rate Type' }}
          </h3>
          
          <form @submit.prevent="saveRateType" class="space-y-4">
            <!-- Short Code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Short Code *
              </label>
              <Input 
                v-model="formData.shortCode"
                placeholder="Enter the short name of the rate type"
                required
              />
            </div>

            <!-- Rate Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Rate Type *
              </label>
              <Input 
                v-model="formData.rateType"
                placeholder="Enter the rate type name"
                required
              />
            </div>

            <!-- Nights -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nights *
              </label>
              <Input 
                v-model="formData.nights"
                type="number"
                min="1"
                placeholder="Enter the number of nights"
                required
              />
            </div>

            <!-- Max Adults -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Max. Adult *
              </label>
              <Input 
                v-model="formData.maxAdults"
                type="number"
                min="1"
                placeholder="Enter the maximum number of adults"
                required
              />
            </div>

            <!-- Min Nights -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Min. Night *
              </label>
              <Input 
                v-model="formData.minNights"
                type="number"
                min="1"
                placeholder="Enter the minimum number of nights"
                required
              />
            </div>

            <!-- Room Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Room Type *
              </label>
              <Select 
                v-model="formData.roomType"
                :options="roomTypeOptions"
                placeholder="Select the room type"
                required
              />
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
                {{ showAddModal ? 'Add Rate Type' : 'Update Rate Type' }}
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
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRateType = ref(null)
const selectedRateTypes = ref([])

// Form data
const formData = ref({
  shortCode: '',
  rateType: '',
  nights: 1,
  maxAdults: 1,
  minNights: 1,
  roomType: '',
  status: 'Active'
})

// Table columns
const columns = ref([
  {
    key: 'shortCode',
    label: 'Short Code',
    sortable: true
  },
  {
    key: 'rateType',
    label: 'Rate Type',
    sortable: true
  },
  {
    key: 'nightsInfo',
    label: 'Nights Info',
    sortable: false
  },
  {
    key: 'capacityInfo',
    label: 'Capacity & Room Type',
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
const rateTypes = ref([
  {
    id: 1,
    shortCode: 'RACK',
    rateType: 'Rack Rate',
    nights: 1,
    maxAdults: 2,
    minNights: 1,
    roomType: 'Standard Room',
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-15 10:30 AM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-20 02:15 PM'
  },
  {
    id: 2,
    shortCode: 'CORP',
    rateType: 'Corporate Rate',
    nights: 2,
    maxAdults: 4,
    minNights: 2,
    roomType: 'Deluxe Room',
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-18 09:15 AM',
    modifiedBy: 'Admin',
    modifiedDate: '2024-01-18 09:15 AM'
  },
  {
    id: 3,
    shortCode: 'GOV',
    rateType: 'Government Rate',
    nights: 1,
    maxAdults: 2,
    minNights: 1,
    roomType: 'Standard Room',
    status: 'Active',
    createdBy: 'Manager',
    createdDate: '2024-01-22 03:45 PM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-22 03:45 PM'
  },
  {
    id: 4,
    shortCode: 'HONEY',
    rateType: 'Honeymoon Package',
    nights: 3,
    maxAdults: 2,
    minNights: 3,
    roomType: 'Suite',
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-25 11:20 AM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-28 04:30 PM'
  }
])

// Options for dropdowns
const roomTypeOptions = ref([
  { value: 'Standard Room', label: 'Standard Room' },
  { value: 'Deluxe Room', label: 'Deluxe Room' },
  { value: 'Suite', label: 'Suite' },
  { value: 'Presidential Suite', label: 'Presidential Suite' }
])

const statusOptions = ref([
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
])

// Methods
const editRateType = (rateType) => {
  editingRateType.value = rateType
  formData.value = { ...rateType }
  showEditModal.value = true
}

const deleteRateType = (rateType) => {
  if (confirm(`Are you sure you want to delete rate type "${rateType.rateType}"?`)) {
    const index = rateTypes.value.findIndex(rt => rt.id === rateType.id)
    if (index > -1) {
      rateTypes.value.splice(index, 1)
    }
  }
}

// Actions configuration
const actions = ref([
  {
    label: 'Edit',
    handler: editRateType,
    icon: Edit
  },
  {
    label: 'Delete',
    handler: deleteRateType,
    icon: Trash,
    variant: 'danger'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editRateType(item)
  } else if (action === 'delete') {
    deleteRateType(item)
  }
}

const onSelectionChange = (selected) => {
  selectedRateTypes.value = selected
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedRateTypes.value.length} selected rate type(s)?`)) {
    selectedRateTypes.value.forEach(rateType => {
      const index = rateTypes.value.findIndex(rt => rt.id === rateType.id)
      if (index > -1) {
        rateTypes.value.splice(index, 1)
      }
    })
    selectedRateTypes.value = []
  }
}

const saveRateType = () => {
  if (showAddModal.value) {
    // Add new rate type
    const newRateType = {
      id: Date.now(),
      ...formData.value,
      createdBy: 'Current User',
      createdDate: new Date().toLocaleString(),
      modifiedBy: 'Current User',
      modifiedDate: new Date().toLocaleString()
    }
    rateTypes.value.push(newRateType)
  } else {
    // Update existing rate type
    const index = rateTypes.value.findIndex(rt => rt.id === editingRateType.value.id)
    if (index > -1) {
      rateTypes.value[index] = {
        ...rateTypes.value[index],
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
  editingRateType.value = null
  formData.value = {
    shortCode: '',
    rateType: '',
    nights: 1,
    maxAdults: 1,
    minNights: 1,
    roomType: '',
    status: 'Active'
  }
}
</script>