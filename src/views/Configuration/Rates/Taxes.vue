<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Taxes</h1>
        <p class="text-gray-600 mt-1">
          This screen allows you to define the taxes. Configure tax rates, categories, and application rules for your hotel.
        </p>
      </div>

      <!-- Taxes Table using ReusableTable -->
      <ReusableTable
        title="Taxes List"
        :columns="columns"
        :data="taxes"
        :actions="actions"
        search-placeholder="Search taxes..."
        :selectable="true"
        empty-state-title="No taxes found"
        empty-state-message="Click 'Add Tax' to create your first tax."
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Tax"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedTaxes.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for tax details -->
        <template #column-taxDetails="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900">{{ item.postingType }}</div>
            <div class="text-xs text-gray-500" v-if="item.postingType === 'Flat Amount'">${{ item.amount }}</div>
            <div class="text-xs text-gray-500" v-else-if="item.postingType === 'Flat Percentage'">{{ item.percentage }}%</div>
            <div class="text-xs text-gray-500" v-else>Slab Based</div>
          </div>
        </template>

        <!-- Custom column for application rules -->
        <template #column-applicationRules="{ item }">
          <div>
            <div class="text-xs text-gray-600">{{ item.applyTax }}</div>
            <div class="text-xs text-gray-500" v-if="item.applyTaxOnRackRate">On Rack Rate</div>
          </div>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add Tax' : 'Edit Tax' }}
          </h3>
          
          <form @submit.prevent="saveTax" class="space-y-4">
            <!-- Short Name and Tax Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Short Name *
                </label>
                <Input 
                  v-model="formData.shortName"
                  placeholder="Enter the short name of the tax"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tax Name *
                </label>
                <Input 
                  v-model="formData.taxName"
                  placeholder="Enter the tax name (e.g., VAT, Service Charge)"
                  required
                />
              </div>
            </div>

            <!-- Applies From and Exempt After -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Applies From *
                </label>
                <InputDatePicker 
                  v-model="formData.appliesFrom"
                  placeholder="Select the date from when you want to apply this tax charge"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Exempt After (Days)
                </label>
                <Input 
                  v-model="formData.exemptAfter"
                  type="number"
                  placeholder="Tax will not be charged after mentioned number of days"
                />
              </div>
            </div>

            <!-- Posting Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Posting Type *
              </label>
              <Select 
                v-model="formData.postingType"
                :options="postingTypeOptions"
                placeholder="Select the type of tax calculation"
                required
              />
            </div>

            <!-- Dynamic fields based on posting type -->
            <div v-if="formData.postingType === 'Flat Amount'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <Input 
                v-model="formData.amount"
                type="number"
                step="0.01"
                placeholder="Enter the flat amount to be charged"
                required
              />
            </div>

            <div v-if="formData.postingType === 'Flat Percentage'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Percentage *
              </label>
              <Input 
                v-model="formData.percentage"
                type="number"
                step="0.01"
                placeholder="Enter the percentage to be charged"
                required
              />
            </div>

            <div v-if="formData.postingType === 'Slab'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Slab Information *
              </label>
              <textarea 
                v-model="formData.slabInfo"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter the slab information for the tax (e.g., 0-100: 5%, 101-500: 10%, 501+: 15%)"
                required
              ></textarea>
            </div>

            <!-- Apply Tax and Apply tax on Rack Rate -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Apply Tax *
                </label>
                <Select 
                  v-model="formData.applyTax"
                  :options="applyTaxOptions"
                  placeholder="Select when to apply tax"
                  required
                />
              </div>
              <div class="flex items-center space-x-2 pt-6">
                <input 
                  type="checkbox" 
                  id="applyTaxOnRackRate" 
                  v-model="formData.applyTaxOnRackRate"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="applyTaxOnRackRate" class="text-sm text-gray-700">
                  Apply tax on Rack Rate
                </label>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select 
                v-model="formData.status"
                :options="statusOptions"
                placeholder="Select status"
              />
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
                {{ showAddModal ? 'Add Tax' : 'Update Tax' }}
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
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import { Plus, Edit, Trash, Trash2 } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingTax = ref(null)
const selectedTaxes = ref([])

// Form data
const formData = ref({
  shortName: '',
  taxName: '',
  appliesFrom: '',
  exemptAfter: '',
  postingType: '',
  amount: '',
  percentage: '',
  slabInfo: '',
  applyTax: '',
  applyTaxOnRackRate: false,
  status: 'Active'
})

// Table columns
const columns: Column[] = [
  {
    key: 'shortName',
    label: 'Short Name',
    type: 'text'
  },
  {
    key: 'taxName',
    label: 'Tax Name',
    type: 'text'
  },
  {
    key: 'appliesFrom',
    label: 'Applies From',
    type: 'text'
  },
  {
    key: 'exemptAfter',
    label: 'Exempt After',
    type: 'text'
  },
  {
    key: 'taxDetails',
    label: 'Tax Details',
    type: 'custom'
  },
  {
    key: 'applicationRules',
    label: 'Application Rules',
    type: 'custom'
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

// Sample data
const taxes = ref([
  {
    id: 1,
    shortName: 'VAT',
    taxName: 'Value Added Tax',
    appliesFrom: '2024-01-01',
    exemptAfter: '30',
    postingType: 'Flat Percentage',
    amount: '',
    percentage: '18.00',
    slabInfo: '',
    applyTax: 'After Discount',
    applyTaxOnRackRate: true,
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-15 10:30 AM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-20 02:15 PM'
  },
  {
    id: 2,
    shortName: 'SC',
    taxName: 'Service Charge',
    appliesFrom: '2024-01-01',
    exemptAfter: '',
    postingType: 'Flat Amount',
    amount: '25.00',
    percentage: '',
    slabInfo: '',
    applyTax: 'Before Discount',
    applyTaxOnRackRate: false,
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-18 09:15 AM',
    modifiedBy: 'Admin',
    modifiedDate: '2024-01-18 09:15 AM'
  }
])

// Options for dropdowns
const postingTypeOptions = ref([
  { value: 'Flat Amount', label: 'Flat Amount' },
  { value: 'Flat Percentage', label: 'Flat Percentage' },
  { value: 'Slab', label: 'Slab' }
])

const applyTaxOptions = ref([
  { value: 'Before Discount', label: 'Before Discount' },
  { value: 'After Discount', label: 'After Discount' }
])

const statusOptions = ref([
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
])

// Methods
const editTax = (tax) => {
  editingTax.value = tax
  formData.value = { ...tax }
  showEditModal.value = true
}

const deleteTax = (tax) => {
  if (confirm(`Are you sure you want to delete tax "${tax.taxName}"?`)) {
    const index = taxes.value.findIndex(t => t.id === tax.id)
    if (index > -1) {
      taxes.value.splice(index, 1)
    }
  }
}

// Actions configuration
const actions = ref<Action[]>([
  {
    label: 'Edit',
    handler: editTax,
    icon: Edit
  },
  {
    label: 'Delete',
    handler: deleteTax,
    icon: Trash,
    variant: 'danger'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editTax(item)
  } else if (action === 'delete') {
    deleteTax(item)
  }
}

const onSelectionChange = (selected) => {
  selectedTaxes.value = selected
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedTaxes.value.length} selected tax(es)?`)) {
    selectedTaxes.value.forEach(tax => {
      const index = taxes.value.findIndex(t => t.id === tax.id)
      if (index > -1) {
        taxes.value.splice(index, 1)
      }
    })
    selectedTaxes.value = []
  }
}

const saveTax = () => {
  if (showAddModal.value) {
    // Add new tax
    const newTax = {
      id: Date.now(),
      ...formData.value,
      createdBy: 'Current User',
      createdDate: new Date().toLocaleString(),
      modifiedBy: 'Current User',
      modifiedDate: new Date().toLocaleString()
    }
    taxes.value.push(newTax)
  } else {
    // Update existing tax
    const index = taxes.value.findIndex(t => t.id === editingTax.value.id)
    if (index > -1) {
      taxes.value[index] = {
        ...taxes.value[index],
        ...formData.value,
        modifiedBy: 'Current User',
        modifiedDate: new Date().toLocaleString()
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingTax.value = null
  formData.value = {
    shortName: '',
    taxName: '',
    appliesFrom: '',
    exemptAfter: '',
    postingType: '',
    amount: '',
    percentage: '',
    slabInfo: '',
    applyTax: '',
    applyTaxOnRackRate: false,
    status: 'Active'
  }
}
</script>
