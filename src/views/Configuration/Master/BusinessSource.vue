<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Business Source</h1>
          <p class="text-gray-600 mt-1">
            Sales and Marketing department would like to do sales analysis of the source of the business. Such information and analysis would be helpful to design promotion campaign, marketing budget or even helpful to determine what rate to offer to which travel agent. You can define your entire business source here and associate this business source with Check In/Reservation.
          </p>
        </div>
        <BasicButton 
          variant="primary"
          icon="Plus"
          label="Add Business Source"
          @click="openAddModal"
        />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow">
        <ReusableTable
          :columns="columns"
          :data="businessSources"
          :actions="actions"
          :loading="false"
          searchPlaceholder="Search business sources..."
        />
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEditing ? 'Edit Business Source' : 'Add Business Source' }}
          </h3>
          
          <form @submit.prevent="saveBusinessSource">
            <!-- Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Business Source Name *
              </label>
              <Input 
                v-model="formData.name"
                placeholder="Enter business source name"
                required
              />
            </div>

            <!-- Short Code -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Short Code *
              </label>
              <Input 
                v-model="formData.shortCode"
                placeholder="Enter short code"
                maxlength="10"
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

            <!-- Category -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select 
                v-model="formData.category"
                :options="categoryOptions"
                placeholder="Select category"
              />
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
                {{ isEditing ? 'Update Business Source' : 'Add Business Source' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'
import type { Action, Column } from '../../../utils/models'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Form data
const formData = ref({
  name: '',
  shortCode: '',
  description: '',
  category: '',
  status: 'Active'
})

// Sample data
const businessSources = ref([
  {
    id: 1,
    name: 'Travel Agent',
    shortCode: 'TA',
    description: 'Bookings through travel agents',
    category: 'Agent',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Online Booking',
    shortCode: 'OB',
    description: 'Direct online bookings from website',
    category: 'Direct',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Corporate Contract',
    shortCode: 'CC',
    description: 'Corporate bookings under contract',
    category: 'Corporate',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Walk-in',
    shortCode: 'WI',
    description: 'Walk-in guests without prior booking',
    category: 'Direct',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Inactive'
  }
])

// Options
const categoryOptions = [
  { label: 'Direct', value: 'Direct' },
  { label: 'Agent', value: 'Agent' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'OTA', value: 'OTA' },
  { label: 'Group', value: 'Group' },
  { label: 'Other', value: 'Other' }
]

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

// Table configuration
const columns: Column[] = [
  { key: 'shortCode', label: 'Short Code', type: 'text' },
  { key: 'name', label: 'Business Source Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions: Action[] = [
  {
    label: 'Edit',
    handler: (item) => editBusinessSource(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item) => deleteBusinessSource(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    shortCode: '',
    description: '',
    category: '',
    status: 'Active'
  }
  showModal.value = true
}

const editBusinessSource = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    name: item.name,
    shortCode: item.shortCode,
    description: item.description,
    category: item.category,
    status: item.status
  }
  showModal.value = true
}

const saveBusinessSource = () => {
  if (isEditing.value) {
    // Update existing business source
    const index = businessSources.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      businessSources.value[index] = {
        ...businessSources.value[index],
        ...formData.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new business source
    const newBusinessSource = {
      id: Date.now(),
      ...formData.value,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0]
    }
    businessSources.value.unshift(newBusinessSource)
  }
  closeModal()
}

const deleteBusinessSource = (id) => {
  if (confirm('Are you sure you want to delete this business source?')) {
    const index = businessSources.value.findIndex(item => item.id === id)
    if (index !== -1) {
      businessSources.value.splice(index, 1)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    shortCode: '',
    description: '',
    category: '',
    status: 'Active'
  }
}
</script>
