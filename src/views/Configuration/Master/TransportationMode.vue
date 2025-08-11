<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Transportation Mode Management"
        :columns="columns"
        :data="transportationModes"
        :actions="actions"
        search-placeholder="Search transportation modes..."
        :selectable="false"
        empty-state-title="No transportation modes found"
        empty-state-message="Get started by adding a new transportation mode."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Transportation Mode"
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
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Transportation Mode' : 'Add New Transportation Mode' }}
          </h3>
          
          <form @submit.prevent="saveTransportationMode" class="space-y-4">
            <Input 
              :lb="'Transportation Mode Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter transportation mode (e.g., Local Taxi, Bus Service)'"
            />
            
            <Input 
              :lb="'Description'"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="'Enter description (optional)'"
            />
            
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                label="Cancel"
                @click="closeModal"
                type="button"
              />
              <BasicButton 
                variant="primary" 
                :label="isEditing ? 'Update' : 'Save'"
                type="submit"
              />
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
import type { Action, Column } from '../../../utils/models'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  name: '',
  description: ''
})

// Sample data
const transportationModes = ref([
  {
    id: 1,
    name: 'Local Taxi',
    description: 'Local taxi service for guest transportation',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Bus Service',
    description: 'Public bus transportation',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Airport Shuttle',
    description: 'Hotel airport shuttle service',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Private Car',
    description: 'Private car rental service',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Inactive'
  }
])

// Table configuration
const columns: Column[] = [
  { key: 'name', label: 'Transportation Mode', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions: Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editTransportationMode(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteTransportationMode(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
  showModal.value = true
}

const editTransportationMode = (mode: any) => {
  isEditing.value = true
  editingId.value = mode.id
  formData.name = mode.name
  formData.description = mode.description
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
}

const saveTransportationMode = () => {
  if (isEditing.value && editingId.value) {
    // Update existing transportation mode
    const index = transportationModes.value.findIndex(m => m.id === editingId.value)
    if (index !== -1) {
      transportationModes.value[index] = {
        ...transportationModes.value[index],
        name: formData.name,
        description: formData.description,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new transportation mode
    const newMode = {
      id: Math.max(...transportationModes.value.map(m => m.id)) + 1,
      name: formData.name,
      description: formData.description,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    transportationModes.value.push(newMode)
  }
  closeModal()
}

const deleteTransportationMode = (id: number) => {
  if (confirm('Are you sure you want to delete this transportation mode?')) {
    const index = transportationModes.value.findIndex(m => m.id === id)
    if (index !== -1) {
      transportationModes.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>