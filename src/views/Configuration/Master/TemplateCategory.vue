<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Template Category Management"
        :columns="columns"
        :data="templateCategories"
        :actions="actions"
        search-placeholder="Search template categories..."
        :selectable="false"
        empty-state-title="No template categories found"
        empty-state-message="Get started by adding a new template category."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Template Category"
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
            {{ isEditing ? 'Edit Template Category' : 'Add New Template Category' }}
          </h3>
          
          <form @submit.prevent="saveTemplateCategory" class="space-y-4">
            <Input 
              :lb="'Category Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter category name (e.g., Welcome, Confirmation, Cancellation)'"
            />
            
            <Input 
              :lb="'Description'"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="'Enter description (optional)'"
            />
            
            <Select 
              :lb="'Usage Type'"
              :isRequired="true"
              v-model="formData.usageType"
              :options="usageTypeOptions"
              :defaultValue="'Select usage type'"
            />
            
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
import { Edit, Save } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  name: '',
  description: '',
  usageType: ''
})

// Sample data
const templateCategories = ref([
  {
    id: 1,
    name: 'Welcome',
    description: 'Welcome email templates for new guests',
    usageType: 'Guest Communication',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Confirmation',
    description: 'Booking confirmation templates',
    usageType: 'Reservation',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Cancellation',
    description: 'Booking cancellation notification templates',
    usageType: 'Reservation',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Marketing',
    description: 'Promotional and marketing email templates',
    usageType: 'Marketing',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Business Partner',
    description: 'Communication templates for business partners',
    usageType: 'Business Communication',
    createdBy: 'admin',
    createdDate: '2024-01-11',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-11',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Feedback',
    description: 'Guest feedback and survey templates',
    usageType: 'Guest Communication',
    createdBy: 'admin',
    createdDate: '2024-01-10',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-10',
    status: 'Inactive'
  }
])

// Usage type options
const usageTypeOptions = [
  { label: 'Guest Communication', value: 'Guest Communication' },
  { label: 'Reservation', value: 'Reservation' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Business Communication', value: 'Business Communication' },
  { label: 'Internal', value: 'Internal' },
  { label: 'Other', value: 'Other' }
]

// Table configuration
const columns:Column[] = [
  { key: 'name', label: 'Category Name', type: 'text' },
  { key: 'usageType', label: 'Usage Type', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions:Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editTemplateCategory(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteTemplateCategory(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
  formData.usageType = ''
  showModal.value = true
}

const editTemplateCategory = (category: any) => {
  isEditing.value = true
  editingId.value = category.id
  formData.name = category.name
  formData.description = category.description
  formData.usageType = category.usageType
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
  formData.usageType = ''
}

const saveTemplateCategory = () => {
  if (isEditing.value && editingId.value) {
    // Update existing template category
    const index = templateCategories.value.findIndex(tc => tc.id === editingId.value)
    if (index !== -1) {
      templateCategories.value[index] = {
        ...templateCategories.value[index],
        name: formData.name,
        description: formData.description,
        usageType: formData.usageType,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new template category
    const newTemplateCategory = {
      id: Math.max(...templateCategories.value.map(tc => tc.id)) + 1,
      name: formData.name,
      description: formData.description,
      usageType: formData.usageType,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    templateCategories.value.push(newTemplateCategory)
  }
  closeModal()
}

const deleteTemplateCategory = (id: number) => {
  if (confirm('Are you sure you want to delete this template category?')) {
    const index = templateCategories.value.findIndex(tc => tc.id === id)
    if (index !== -1) {
      templateCategories.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
