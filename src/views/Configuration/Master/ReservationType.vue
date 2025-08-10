<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Reservation Type Management"
        :columns="columns"
        :data="reservationTypes"
        :actions="actions"
        search-placeholder="Search reservation types..."
        :selectable="false"
        empty-state-title="No reservation types found"
        empty-state-message="Get started by adding a new reservation type."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Reservation Type"
            @click="openAddModal"
          />
        </template>

        <template #column-status="{ item }">
          <span 
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.status }}
          </span>
        </template>

        <template #column-isDefault="{ item }">
          <span 
            :class="item.isDefault ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.isDefault ? 'Yes' : 'No' }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Reservation Type' : 'Add New Reservation Type' }}
          </h3>
          
          <form @submit.prevent="saveReservationType" class="space-y-4">
            <Input 
              :lb="'Reservation Type Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter reservation type name'"
            />
            
            <Input 
              :lb="'Description'"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="'Enter description (optional)'"
            />
            
            <Select 
              :lb="'Category'"
              :isRequired="true"
              v-model="formData.category"
              :options="categoryOptions"
              :defaultValue="'Select category'"
            />
            
            <div class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="isDefault" 
                v-model="formData.isDefault"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="isDefault" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Set as Default Reservation Type
              </label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                @click="closeModal"
                type="button"
              >
                Cancel
              </BasicButton>
              <BasicButton 
                variant="primary" 
                type="submit"
              >
                {{ isEditing ? 'Update' : 'Save' }}
              </BasicButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  name: '',
  description: '',
  category: '',
  isDefault: false
})

// Sample data
const reservationTypes = ref([
  {
    id: 1,
    name: 'Confirm Booking',
    description: 'Confirmed reservation with payment',
    category: 'Standard',
    isDefault: true,
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Booking Inquiry',
    description: 'Initial inquiry without confirmation',
    category: 'Standard',
    isDefault: false,
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Tentative Booking',
    description: 'Tentative reservation pending confirmation',
    category: 'Provisional',
    isDefault: false,
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Group Booking',
    description: 'Group reservation for multiple rooms',
    category: 'Group',
    isDefault: false,
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Corporate Booking',
    description: 'Corporate account reservation',
    category: 'Corporate',
    isDefault: false,
    createdBy: 'admin',
    createdDate: '2024-01-11',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-11',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Event Booking',
    description: 'Special event or function booking',
    category: 'Event',
    isDefault: false,
    createdBy: 'admin',
    createdDate: '2024-01-10',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-10',
    status: 'Inactive'
  }
])

// Category options
const categoryOptions = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Provisional', value: 'Provisional' },
  { label: 'Group', value: 'Group' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Event', value: 'Event' },
  { label: 'VIP', value: 'VIP' },
  { label: 'Other', value: 'Other' }
]

// Table configuration
const columns = [
  { key: 'name', label: 'Reservation Type', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'isDefault', label: 'Default', type: 'custom' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item: any) => editReservationType(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteReservationType(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
  formData.category = ''
  formData.isDefault = false
  showModal.value = true
}

const editReservationType = (reservationType: any) => {
  isEditing.value = true
  editingId.value = reservationType.id
  formData.name = reservationType.name
  formData.description = reservationType.description
  formData.category = reservationType.category
  formData.isDefault = reservationType.isDefault
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
  formData.category = ''
  formData.isDefault = false
}

const saveReservationType = () => {
  if (isEditing.value && editingId.value) {
    // Update existing reservation type
    const index = reservationTypes.value.findIndex(rt => rt.id === editingId.value)
    if (index !== -1) {
      // If setting as default, remove default from others
      if (formData.isDefault) {
        reservationTypes.value.forEach(rt => {
          if (rt.id !== editingId.value) {
            rt.isDefault = false
          }
        })
      }
      
      reservationTypes.value[index] = {
        ...reservationTypes.value[index],
        name: formData.name,
        description: formData.description,
        category: formData.category,
        isDefault: formData.isDefault,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // If setting as default, remove default from others
    if (formData.isDefault) {
      reservationTypes.value.forEach(rt => {
        rt.isDefault = false
      })
    }
    
    // Add new reservation type
    const newReservationType = {
      id: Math.max(...reservationTypes.value.map(rt => rt.id)) + 1,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      isDefault: formData.isDefault,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    reservationTypes.value.push(newReservationType)
  }
  closeModal()
}

const deleteReservationType = (id: number) => {
  const reservationType = reservationTypes.value.find(rt => rt.id === id)
  if (reservationType?.isDefault) {
    alert('Cannot delete the default reservation type. Please set another type as default first.')
    return
  }
  
  if (confirm('Are you sure you want to delete this reservation type?')) {
    const index = reservationTypes.value.findIndex(rt => rt.id === id)
    if (index !== -1) {
      reservationTypes.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
