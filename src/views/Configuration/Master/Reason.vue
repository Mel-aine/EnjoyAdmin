<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Reason Management"
        :columns="columns"
        :data="reasons"
        :actions="actions"
        search-placeholder="Search reasons..."
        :selectable="false"
        empty-state-title="No reasons found"
        empty-state-message="Get started by adding a new reason."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Reason"
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
            {{ isEditing ? 'Edit Reason' : 'Add New Reason' }}
          </h3>
          
          <form @submit.prevent="saveReason" class="space-y-4">
            <Input 
              :lb="'Reason Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter reason name'"
            />
            
            <div>
              <Select 
                :lb="'Category'"
                :isRequired="true"
                v-model="formData.category"
                :options="categoryOptions"
                :defaultValue="'Select category'"
              />
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                @click="closeModal"
                type="button"
                :label="$t('cancel')"
              >
                Cancel
              </BasicButton>
              <BasicButton 
                variant="primary" 
                type="submit"
                :label="isEditing ? $t('update') : $t('save') "
                :icon="isEditing ? Edit : Save"
              >
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
import type { Action, Column } from '../../../utils/models'
import { Edit, Save } from 'lucide-vue-next'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  name: '',
  category: ''
})

// Sample data
const reasons = ref([
  {
    id: 1,
    name: 'Room Change Request',
    category: 'Front Desk',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Billing Adjustment',
    category: 'Accounting',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Service Complaint',
    category: 'Housekeeping',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Inactive'
  }
])

// Category options
const categoryOptions = [
  { label: 'Front Desk', value: 'Front Desk' },
  { label: 'Housekeeping', value: 'Housekeeping' },
  { label: 'Accounting', value: 'Accounting' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Food & Beverage', value: 'Food & Beverage' }
]

// Table configuration
const columns:Column[] = [
  { key: 'name', label: 'Reason Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions:Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editReason(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteReason(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.category = ''
  showModal.value = true
}

const editReason = (reason: any) => {
  isEditing.value = true
  editingId.value = reason.id
  formData.name = reason.name
  formData.category = reason.category
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.category = ''
}

const saveReason = () => {
  if (isEditing.value && editingId.value) {
    // Update existing reason
    const index = reasons.value.findIndex(r => r.id === editingId.value)
    if (index !== -1) {
      reasons.value[index] = {
        ...reasons.value[index],
        name: formData.name,
        category: formData.category,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new reason
    const newReason = {
      id: Math.max(...reasons.value.map(r => r.id)) + 1,
      name: formData.name,
      category: formData.category,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    reasons.value.push(newReason)
  }
  closeModal()
}

const deleteReason = (id: number) => {
  if (confirm('Are you sure you want to delete this reason?')) {
    const index = reasons.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reasons.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
