<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Preference</h1>
          <p class="text-gray-600 mt-1">
            Preference (guest preference) can now be pre-defined to be selected in eZee Absolute front office. The same can also be used in eZee Reservation booking engine page when a guest books his stay online using book now button on your website.
          </p>
        </div>
        <BasicButton 
          variant="primary"
          icon="Plus"
          label="Add Preference"
          @click="openAddModal"
        />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow">
        <ReusableTable
          :columns="columns"
          :data="preferences"
          :actions="actions"
          :loading="false"
          searchPlaceholder="Search preferences..."
        />
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEditing ? 'Edit Preference' : 'Add Preference' }}
          </h3>
          
          <form @submit.prevent="savePreference">
            <!-- Preference Type -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Preference Type *
              </label>
              <Select 
                v-model="formData.preferenceType"
                :options="preferenceTypeOptions"
                placeholder="Select preference type"
                required
              />
            </div>

            <!-- Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Preference Name *
              </label>
              <Input 
                v-model="formData.name"
                placeholder="Enter preference name"
                required
              />
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea 
                v-model="formData.description"
                placeholder="Enter description (optional)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>

            <!-- Available for Online Booking -->
            <div class="mb-4">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="formData.availableOnline"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                <span class="ml-2 text-sm text-gray-700">Available for online booking</span>
              </label>
            </div>

            <!-- Status -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select 
                v-model="formData.status"
                :options="statusOptions"
                placeholder="Select status"
              />
            </div>

            <div class="flex justify-end space-x-3">
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
                {{ isEditing ? 'Update Preference' : 'Add Preference' }}
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
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const formData = ref({
  preferenceType: '',
  name: '',
  description: '',
  availableOnline: false,
  status: 'Active'
})

// Sample data
const preferences = ref([
  {
    id: 1,
    preferenceType: 'Room Location',
    name: 'High Floor',
    description: 'Guest prefers rooms on higher floors',
    availableOnline: true,
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    preferenceType: 'Bed Type',
    name: 'King Size Bed',
    description: 'Guest prefers king size bed',
    availableOnline: true,
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    preferenceType: 'Amenities',
    name: 'Extra Pillows',
    description: 'Guest requests additional pillows',
    availableOnline: false,
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    preferenceType: 'Dietary Requirements',
    name: 'Vegetarian Meals',
    description: 'Guest requires vegetarian meal options',
    availableOnline: true,
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Inactive'
  }
])

// Options
const preferenceTypeOptions = [
  { label: 'Room Location', value: 'Room Location' },
  { label: 'Bed Type', value: 'Bed Type' },
  { label: 'Amenities', value: 'Amenities' },
  { label: 'Dietary Requirements', value: 'Dietary Requirements' }
]

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

// Table configuration
const columns = [
  { key: 'preferenceType', label: 'Preference Type', type: 'text' },
  { key: 'name', label: 'Preference Name', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'availableOnline', label: 'Online Booking', type: 'custom' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item) => editPreference(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item) => deletePreference(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    preferenceType: '',
    name: '',
    description: '',
    availableOnline: false,
    status: 'Active'
  }
  showModal.value = true
}

const editPreference = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    preferenceType: item.preferenceType,
    name: item.name,
    description: item.description,
    availableOnline: item.availableOnline,
    status: item.status
  }
  showModal.value = true
}

const savePreference = () => {
  if (isEditing.value) {
    // Update existing preference
    const index = preferences.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      preferences.value[index] = {
        ...preferences.value[index],
        ...formData.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new preference
    const newPreference = {
      id: Date.now(),
      ...formData.value,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0]
    }
    preferences.value.unshift(newPreference)
  }
  closeModal()
}

const deletePreference = (id) => {
  if (confirm('Are you sure you want to delete this preference?')) {
    const index = preferences.value.findIndex(item => item.id === id)
    if (index !== -1) {
      preferences.value.splice(index, 1)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    preferenceType: '',
    name: '',
    description: '',
    availableOnline: false,
    status: 'Active'
  }
}
</script>
