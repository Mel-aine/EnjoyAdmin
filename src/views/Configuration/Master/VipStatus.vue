<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">VIP Status</h1>
          <p class="text-gray-600 mt-1">
            Define VIP status for use when creating guest profile.
          </p>
        </div>
        <BasicButton 
          variant="primary"
          icon="Plus"
          label="Add VIP Status"
          @click="openAddModal"
        />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow">
        <ReusableTable
          :columns="columns"
          :data="vipStatuses"
          :actions="actions"
          :loading="false"
          searchPlaceholder="Search VIP status..."
        />
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEditing ? 'Edit VIP Status' : 'Add VIP Status' }}
          </h3>
          
          <form @submit.prevent="saveVipStatus">
            <!-- Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                VIP Status Name *
              </label>
              <Input 
                v-model="formData.name"
                placeholder="Enter VIP status name"
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

            <!-- Priority Level -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <Select 
                v-model="formData.priority"
                :options="priorityOptions"
                placeholder="Select priority level"
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
                {{ isEditing ? 'Update VIP Status' : 'Add VIP Status' }}
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
  name: '',
  description: '',
  priority: '',
  status: 'Active'
})

// Sample data
const vipStatuses = ref([
  {
    id: 1,
    name: 'Gold',
    description: 'Premium VIP status with exclusive benefits',
    priority: 'High',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Platinum',
    description: 'Highest tier VIP status with all premium services',
    priority: 'Highest',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Silver',
    description: 'Standard VIP status with basic benefits',
    priority: 'Medium',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Bronze',
    description: 'Entry level VIP status',
    priority: 'Low',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Inactive'
  }
])

// Options
const priorityOptions = [
  { label: 'Highest', value: 'Highest' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' }
]

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

// Table configuration
const columns = [
  { key: 'name', label: 'VIP Status Name', type: 'text' },
  { key: 'priority', label: 'Priority Level', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item) => editVipStatus(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item) => deleteVipStatus(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    description: '',
    priority: '',
    status: 'Active'
  }
  showModal.value = true
}

const editVipStatus = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    name: item.name,
    description: item.description,
    priority: item.priority,
    status: item.status
  }
  showModal.value = true
}

const saveVipStatus = () => {
  if (isEditing.value) {
    // Update existing VIP status
    const index = vipStatuses.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      vipStatuses.value[index] = {
        ...vipStatuses.value[index],
        ...formData.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new VIP status
    const newVipStatus = {
      id: Date.now(),
      ...formData.value,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0]
    }
    vipStatuses.value.unshift(newVipStatus)
  }
  closeModal()
}

const deleteVipStatus = (id) => {
  if (confirm('Are you sure you want to delete this VIP status?')) {
    const index = vipStatuses.value.findIndex(item => item.id === id)
    if (index !== -1) {
      vipStatuses.value.splice(index, 1)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    description: '',
    priority: '',
    status: 'Active'
  }
}
</script>