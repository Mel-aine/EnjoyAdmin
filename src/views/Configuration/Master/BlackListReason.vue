<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Blacklist Reason Management"
        :columns="columns"
        :data="blacklistReasons"
        :actions="actions"
        search-placeholder="Search blacklist reasons..."
        :selectable="false"
        empty-state-title="No blacklist reasons found"
        empty-state-message="Get started by adding a new blacklist reason."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Blacklist Reason"
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

        <template #column-severity="{ item }">
          <span 
            :class="{
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': item.severity === 'High',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': item.severity === 'Medium',
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': item.severity === 'Low'
            }"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.severity }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Blacklist Reason' : 'Add New Blacklist Reason' }}
          </h3>
          
          <form @submit.prevent="saveBlacklistReason" class="space-y-4">
            <Input 
              :lb="'Reason Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter blacklist reason (e.g., Disruptive Behavior, Property Damage)'"
            />
            
            <Input 
              :lb="'Description'"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="'Enter detailed description (optional)'"
            />
            
            <Select 
              :lb="'Category'"
              :isRequired="true"
              v-model="formData.category"
              :options="categoryOptions"
              :defaultValue="'Select category'"
            />
            
            <Select 
              :lb="'Severity Level'"
              :isRequired="true"
              v-model="formData.severity"
              :options="severityOptions"
              :defaultValue="'Select severity level'"
            />
            
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
  severity: ''
})

// Sample data
const blacklistReasons = ref([
  {
    id: 1,
    name: 'Disruptive Behavior',
    description: 'Guest exhibited disruptive behavior affecting other guests',
    category: 'Behavioral',
    severity: 'High',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Property Damage',
    description: 'Intentional damage to hotel property',
    category: 'Property',
    severity: 'High',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Non-Payment',
    description: 'Failed to pay bills or charges',
    category: 'Financial',
    severity: 'Medium',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Fraudulent Activity',
    description: 'Involved in fraudulent transactions or activities',
    category: 'Financial',
    severity: 'High',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Excessive Complaints',
    description: 'Unreasonable or excessive complaints without valid basis',
    category: 'Behavioral',
    severity: 'Low',
    createdBy: 'admin',
    createdDate: '2024-01-11',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-11',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Policy Violation',
    description: 'Repeated violation of hotel policies',
    category: 'Policy',
    severity: 'Medium',
    createdBy: 'admin',
    createdDate: '2024-01-10',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-10',
    status: 'Inactive'
  }
])

// Options
const categoryOptions = [
  { label: 'Behavioral', value: 'Behavioral' },
  { label: 'Financial', value: 'Financial' },
  { label: 'Property', value: 'Property' },
  { label: 'Policy', value: 'Policy' },
  { label: 'Security', value: 'Security' },
  { label: 'Other', value: 'Other' }
]

const severityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' }
]

// Table configuration
const columns = [
  { key: 'name', label: 'Reason Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'severity', label: 'Severity', type: 'custom' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item: any) => editBlacklistReason(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteBlacklistReason(item.id),
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
  formData.severity = ''
  showModal.value = true
}

const editBlacklistReason = (reason: any) => {
  isEditing.value = true
  editingId.value = reason.id
  formData.name = reason.name
  formData.description = reason.description
  formData.category = reason.category
  formData.severity = reason.severity
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
  formData.category = ''
  formData.severity = ''
}

const saveBlacklistReason = () => {
  if (isEditing.value && editingId.value) {
    // Update existing blacklist reason
    const index = blacklistReasons.value.findIndex(br => br.id === editingId.value)
    if (index !== -1) {
      blacklistReasons.value[index] = {
        ...blacklistReasons.value[index],
        name: formData.name,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new blacklist reason
    const newBlacklistReason = {
      id: Math.max(...blacklistReasons.value.map(br => br.id)) + 1,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      severity: formData.severity,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    blacklistReasons.value.push(newBlacklistReason)
  }
  closeModal()
}

const deleteBlacklistReason = (id: number) => {
  if (confirm('Are you sure you want to delete this blacklist reason?')) {
    const index = blacklistReasons.value.findIndex(br => br.id === id)
    if (index !== -1) {
      blacklistReasons.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
