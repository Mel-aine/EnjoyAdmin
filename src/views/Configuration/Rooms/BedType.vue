<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Bed Type</h1>
        <p class="text-gray-600 mt-1">
          Enter the bed types that you offer in your hotel. To add a bed type, click on 'Add Bed Type' button and fill in the required information.
        </p>
      </div>

      <!-- Bed Types Table using ReusableTable -->
      <ReusableTable
        title="Bed Types"
        :columns="columns"
        :data="bedTypes"
        :actions="actions"
        search-placeholder="Search bed types..."
        :selectable="true"
        empty-state-title="No bed types found"
        empty-state-message="Click 'Add Bed Type' to create your first bed type."
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Bed Type"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedBedTypes.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <template #column-status="{ item }">
          <span 
            :class="{
              'bg-green-100 text-green-800': item.status === 'Active',
              'bg-red-100 text-red-800': item.status === 'Inactive'
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

      <!-- Add/Edit Bed Type Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? 'Edit Bed Type' : 'Add Bed Type' }}
          </h3>
          
          <form @submit.prevent="saveBedType" class="space-y-4">
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
                placeholder="e.g., KB, QB, DB"
              >
              <p class="text-xs text-gray-500 mt-1">Short name for the bed type you will define</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bed Type Name *
              </label>
              <input 
                v-model="formData.bedTypeName"
                type="text" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., King Bed, Queen Bed, Double Bed"
              >
              <p class="text-xs text-gray-500 mt-1">The name of the bed type you offer in your hotel</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                v-model="formData.status"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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
                {{ showEditModal ? 'Update Bed Type' : 'Add Bed Type' }}
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
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Trash2, Edit, Trash } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedBedTypes = ref<any[]>([])
const editingBedType = ref<any>(null) 

// Form data
const formData = ref({
  shortCode: '',
  bedTypeName: '',
  status: 'Active'
})

// Table configuration
const columns: Column[] = [
  {
    key: 'shortCode',
    label: 'Short Code',
    type: 'text'
  },
  {
    key: 'bedTypeName',
    label: 'Bed Type Name',
    type: 'text'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'custom'
  },
  {
    key: 'createdInfo',
    label: 'Created By',
    type: 'custom'
  },
  {
    key: 'modifiedInfo',
    label: 'Modified By',
    type: 'custom'
  }
]

const actions: Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editBedType(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteBedType(item.id),
    variant: 'danger'
  }
]

// Sample data
const bedTypes = ref<any[]>([
  {
    id: 1,
    shortCode: 'KB',
    bedTypeName: 'King Bed',
    status: 'Active',
    createdBy: 'admin',
    createdDate: 'on 2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: 'on 2024-01-15'
  },
  {
    id: 2,
    shortCode: 'QB',
    bedTypeName: 'Queen Bed',
    status: 'Active',
    createdBy: 'admin',
    createdDate: 'on 2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: 'on 2024-01-15'
  },
  {
    id: 3,
    shortCode: 'DB',
    bedTypeName: 'Double Bed',
    status: 'Active',
    createdBy: 'admin',
    createdDate: 'on 2024-01-16',
    modifiedBy: 'admin',
    modifiedDate: 'on 2024-01-16'
  },
  {
    id: 4,
    shortCode: 'SB',
    bedTypeName: 'Single Bed',
    status: 'Active',
    createdBy: 'admin',
    createdDate: 'on 2024-01-16',
    modifiedBy: 'admin',
    modifiedDate: 'on 2024-01-16'
  },
  {
    id: 5,
    shortCode: 'TB',
    bedTypeName: 'Twin Bed',
    status: 'Inactive',
    createdBy: 'admin',
    createdDate: 'on 2024-01-17',
    modifiedBy: 'admin',
    modifiedDate: 'on 2024-01-17'
  }
])

// Methods
const onSelectionChange = (selected:any) => {
  selectedBedTypes.value = selected
}

const onAction = (action:string, item:any) => {
  if (action === 'edit') {
    editBedType(item)
  } else if (action === 'delete') {
    deleteBedType(item)
  }
}

const editBedType = (bedType:any) => {
  editingBedType.value = bedType
  formData.value = {
    shortCode: bedType.shortCode,
    bedTypeName: bedType.bedTypeName,
    status: bedType.status
  }
  showEditModal.value = true
}

const deleteBedType = (bedType:any) => {
  if (confirm(`Are you sure you want to delete the bed type "${bedType.bedTypeName}"?`)) {
    bedTypes.value = bedTypes.value.filter(bt => bt.id !== bedType.id)
  }
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedBedTypes.value.length} selected bed type(s)?`)) {
    const selectedIds = selectedBedTypes.value.map(bt => bt.id)
    bedTypes.value = bedTypes.value.filter(bt => !selectedIds.includes(bt.id))
    selectedBedTypes.value = []
  }
}

const saveBedType = () => {
  if (showEditModal.value && editingBedType.value) {
    // Update existing bed type
    const index = bedTypes.value.findIndex(bt => bt.id === editingBedType.value.id)
    if (index !== -1) {
      bedTypes.value[index] = {
        ...bedTypes.value[index],
        shortCode: formData.value.shortCode,
        bedTypeName: formData.value.bedTypeName,
        status: formData.value.status
      }
    }
  } else {
    // Add new bed type
    const newBedType = {
      id: Date.now(),
      shortCode: formData.value.shortCode,
      bedTypeName: formData.value.bedTypeName,
      status: formData.value.status,
      createdAt: new Date().toISOString().split('T')[0]
    }
    bedTypes.value.push(newBedType)
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingBedType.value = null
  formData.value = {
    shortCode: '',
    bedTypeName: '',
    status: 'Active'
  }
}
</script>