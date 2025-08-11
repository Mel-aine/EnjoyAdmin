<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="mb-6">
        <p class="text-gray-600">
          Define all the housekeeping status for the rooms from here. You can assign colors to each status for easy identification.
        </p>
      </div>
      
      <ReusableTable
        title="Housekeeping Status Management"
        :columns="columns"
        :data="statuses"
        :actions="actions"
        search-placeholder="Search housekeeping status..."
        :selectable="false"
        empty-state-title="No housekeeping status found"
        empty-state-message="Get started by adding a new housekeeping status."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            :label="'Add Housekeeping Status'"
            :icon="'Plus'"
            @click="openAddModal"
          />
        </template>
        
        <template #column-color="{ item }">
          <div class="flex items-center">
            <div class="w-6 h-6 rounded-full border border-gray-300" :style="{ backgroundColor: item.color }"></div>
            <span class="text-sm text-gray-600">{{ item.color }}</span>
          </div>
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
            {{ isEditing ? 'Edit Housekeeping Status' : 'Add New Housekeeping Status' }}
          </h3>
          
          <form @submit.prevent="saveStatus" class="space-y-4">
            <Input 
              :lb="'Status Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter status name'"
            />
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Color *
              </label>
              <div class="flex items-center space-x-3">
                <input 
                  v-model="formData.color" 
                  type="color" 
                  required
                  class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <Input 
                  :lb="''"
                  :inputType="'text'"
                  :isRequired="true"
                  v-model="formData.color"
                  :placeholder="'#000000'"
                  class="flex-1"
                />
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                :label="'Cancel'"
                variant="secondary" 
                @click="closeModal"
                type="button"
              />
              <BasicButton 
                :label="isEditing ? 'Update' : 'Save'"
                variant="primary" 
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
import { Plus } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  name: '',
  color: '#3B82F6'
})

// Table configuration
const columns:Column[] = [
  { key: 'name', label: 'Status Name', type: 'text' },
  { key: 'color', label: 'Color', type: 'custom' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions: Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editStatus(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteStatus(item.id),
    variant: 'danger'
  }
]

const statuses = ref([
  { 
    id: 1, 
    name: 'Clean', 
    color: '#10B981', 
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Dirty', 
    color: '#EF4444', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 3, 
    name: 'Out of Order', 
    color: '#F59E0B', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 4, 
    name: 'Maintenance', 
    color: '#8B5CF6', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  }
])

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.color = '#3B82F6'
  showModal.value = true
}

const editStatus = (status: any) => {
  isEditing.value = true
  editingId.value = status.id
  formData.name = status.name
  formData.color = status.color
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.color = '#3B82F6'
}

const saveStatus = () => {
  if (isEditing.value && editingId.value) {
    // Update existing status
    const index = statuses.value.findIndex(s => s.id === editingId.value)
    if (index !== -1) {
      statuses.value[index] = {
        ...statuses.value[index],
        name: formData.name,
        color: formData.color,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new status
    const newStatus = {
      id: Math.max(...statuses.value.map(s => s.id)) + 1,
      name: formData.name,
      color: formData.color,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    statuses.value.push(newStatus)
  }
  closeModal()
}

const deleteStatus = (id: number) => {
  if (confirm('Are you sure you want to delete this housekeeping status?')) {
    const index = statuses.value.findIndex(s => s.id === id)
    if (index !== -1) {
      statuses.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
