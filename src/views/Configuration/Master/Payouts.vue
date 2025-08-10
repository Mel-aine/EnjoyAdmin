<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Payout Reasons Management"
        :columns="columns"
        :data="payouts"
        :actions="actions"
        search-placeholder="Search payout reasons..."
        :selectable="false"
        empty-state-title="No payout reasons found"
        empty-state-message="Get started by adding a new payout reason."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Payout Reason"
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
            {{ isEditing ? 'Edit Payout Reason' : 'Add New Payout Reason' }}
          </h3>
          
          <form @submit.prevent="savePayout" class="space-y-4">
            <Input 
              :lb="'Payout Reason Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter payout reason (e.g., Electric Bills, Travel Agent Commission)'"
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
  category: ''
})

// Sample data
const payouts = ref([
  {
    id: 1,
    name: 'Electric Bills',
    description: 'Monthly electricity bill payments',
    category: 'Utilities',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Travel Agent Commission',
    description: 'Commission payments to travel agents',
    category: 'Commission',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Florist',
    description: 'Flower arrangements and decorations',
    category: 'Services',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Internet Bills',
    description: 'Monthly internet service payments',
    category: 'Utilities',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Laundry Bills',
    description: 'External laundry service payments',
    category: 'Services',
    createdBy: 'admin',
    createdDate: '2024-01-11',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-11',
    status: 'Inactive'
  },
  {
    id: 6,
    name: 'Newspaper Bills',
    description: 'Daily newspaper subscription',
    category: 'Services',
    createdBy: 'admin',
    createdDate: '2024-01-10',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-10',
    status: 'Active'
  }
])

// Category options
const categoryOptions = [
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Commission', value: 'Commission' },
  { label: 'Services', value: 'Services' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Supplies', value: 'Supplies' },
  { label: 'Other', value: 'Other' }
]

// Table configuration
const columns = [
  { key: 'name', label: 'Payout Reason', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item: any) => editPayout(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deletePayout(item.id),
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
  showModal.value = true
}

const editPayout = (payout: any) => {
  isEditing.value = true
  editingId.value = payout.id
  formData.name = payout.name
  formData.description = payout.description
  formData.category = payout.category
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.description = ''
  formData.category = ''
}

const savePayout = () => {
  if (isEditing.value && editingId.value) {
    // Update existing payout
    const index = payouts.value.findIndex(p => p.id === editingId.value)
    if (index !== -1) {
      payouts.value[index] = {
        ...payouts.value[index],
        name: formData.name,
        description: formData.description,
        category: formData.category,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new payout
    const newPayout = {
      id: Math.max(...payouts.value.map(p => p.id)) + 1,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    payouts.value.push(newPayout)
  }
  closeModal()
}

const deletePayout = (id: number) => {
  if (confirm('Are you sure you want to delete this payout reason?')) {
    const index = payouts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      payouts.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
