<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Discount Management"
        :columns="columns"
        :data="discounts"
        :actions="actions"
        search-placeholder="Search discounts..."
        :selectable="false"
        empty-state-title="No discounts found"
        empty-state-message="Get started by adding a new discount."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Discount"
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

        <template #column-openDiscount="{ item }">
          <span 
            :class="item.openDiscount ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.openDiscount ? 'Yes' : 'No' }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Discount' : 'Add New Discount' }}
          </h3>
          
          <form @submit.prevent="saveDiscount" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                :lb="'Short Code'"
                :inputType="'text'"
                :isRequired="true"
                v-model="formData.shortCode"
                :placeholder="'Enter short code'"
              />
              
              <Input 
                :lb="'Discount Name'"
                :inputType="'text'"
                :isRequired="true"
                v-model="formData.name"
                :placeholder="'Enter discount name'"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                :lb="'Type'"
                :isRequired="true"
                v-model="formData.type"
                :options="typeOptions"
                :defaultValue="'Select type'"
              />
              
              <Input 
                :lb="'Value'"
                :inputType="'number'"
                :isRequired="true"
                v-model="formData.value"
                :placeholder="'Enter value'"
                :min="0"
                :max="formData.type === 'percentage' ? 100 : undefined"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                :lb="'Apply On'"
                :isRequired="true"
                v-model="formData.applyOn"
                :options="applyOnOptions"
                :defaultValue="'Select application'"
              />
              
              <div class="flex items-center space-x-2 pt-6">
                <input 
                  type="checkbox" 
                  id="openDiscount" 
                  v-model="formData.openDiscount"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="openDiscount" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Open Discount (Allow value change in Front Desk)
                </label>
              </div>
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
  shortCode: '',
  name: '',
  type: '',
  value: '',
  applyOn: '',
  openDiscount: false
})

// Sample data
const discounts = ref([
  {
    id: 1,
    shortCode: 'EARLY10',
    name: 'Early Bird Discount',
    type: 'percentage',
    value: 10,
    applyOn: 'room_charge',
    openDiscount: false,
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    shortCode: 'FLAT50',
    name: 'Flat 50 Off',
    type: 'flat',
    value: 50,
    applyOn: 'extra_charge',
    openDiscount: true,
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    shortCode: 'SENIOR15',
    name: 'Senior Citizen Discount',
    type: 'percentage',
    value: 15,
    applyOn: 'room_charge',
    openDiscount: false,
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Inactive'
  }
])

// Options
const typeOptions = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Flat Amount', value: 'flat' }
]

const applyOnOptions = [
  { label: 'Room Charge', value: 'room_charge' },
  { label: 'Extra Charge', value: 'extra_charge' }
]

// Table configuration
const columns :Column[] = [
  { key: 'shortCode', label: 'Short Code', type: 'text' },
  { key: 'name', label: 'Discount Name', type: 'text' },
  { key: 'type', label: 'Type', type: 'text' },
  { key: 'value', label: 'Value', type: 'text' },
  { key: 'applyOn', label: 'Apply On', type: 'text' },
  { key: 'openDiscount', label: 'Open Discount', type: 'custom' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions:Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editDiscount(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteDiscount(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.shortCode = ''
  formData.name = ''
  formData.type = ''
  formData.value = ''
  formData.applyOn = ''
  formData.openDiscount = false
  showModal.value = true
}

const editDiscount = (discount: any) => {
  isEditing.value = true
  editingId.value = discount.id
  formData.shortCode = discount.shortCode
  formData.name = discount.name
  formData.type = discount.type
  formData.value = discount.value.toString()
  formData.applyOn = discount.applyOn
  formData.openDiscount = discount.openDiscount
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.shortCode = ''
  formData.name = ''
  formData.type = ''
  formData.value = ''
  formData.applyOn = ''
  formData.openDiscount = false
}

const saveDiscount = () => {
  if (isEditing.value && editingId.value) {
    // Update existing discount
    const index = discounts.value.findIndex(d => d.id === editingId.value)
    if (index !== -1) {
      discounts.value[index] = {
        ...discounts.value[index],
        shortCode: formData.shortCode,
        name: formData.name,
        type: formData.type,
        value: parseFloat(formData.value),
        applyOn: formData.applyOn,
        openDiscount: formData.openDiscount,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new discount
    const newDiscount = {
      id: Math.max(...discounts.value.map(d => d.id)) + 1,
      shortCode: formData.shortCode,
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value),
      applyOn: formData.applyOn,
      openDiscount: formData.openDiscount,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    discounts.value.push(newDiscount)
  }
  closeModal()
}

const deleteDiscount = (id: number) => {
  if (confirm('Are you sure you want to delete this discount?')) {
    const index = discounts.value.findIndex(d => d.id === id)
    if (index !== -1) {
      discounts.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
