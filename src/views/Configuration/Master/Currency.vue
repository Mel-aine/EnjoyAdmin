<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Currency</h1>
        <BasicButton variant="primary" @click="openAddModal" :icon="PlusIcon" label="Add Currency" />
      </div>
      
      <ReusableTable
        title="Currency Management"
        :columns="columns"
        :data="currencies"
        :actions="actions"
        search-placeholder="Search currencies..."
        empty-title="No currencies found"
        empty-description="Start by adding your first currency."
        @action="onAction"
      >
        <template #isDefault="{ item }">
          <span v-if="item.isDefault" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Default
          </span>
        </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Currency' : 'Add Currency' }}
          </h3>
          
          <form @submit.prevent="saveCurrency">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select 
                v-model="formData.country" 
                required
                @change="onCountryChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">--Select--</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="GB">United Kingdom</option>
                <option value="EU">European Union</option>
                <option value="JP">Japan</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.name" 
                label="Currency *"
                type="text" 
                required
                placeholder="Enter currency name"
              />
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.symbol" 
                label="Sign *"
                type="text" 
                required
                placeholder="Enter currency symbol"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Prefix/Suffix *
              </label>
              <div class="flex space-x-2">
                <label class="flex items-center">
                  <input 
                    v-model="formData.position" 
                    type="radio" 
                    value="prefix"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Prefix</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formData.position" 
                    type="radio" 
                    value="suffix"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Suffix</span>
                </label>
              </div>
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.code" 
                label="Currency Code *"
                type="text" 
                required
                placeholder="Ex: USD (For United States)"
              />
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.decimalPlaces" 
                label="Digits after Decimal *"
                type="number" 
                min="0"
                max="4"
                required
                placeholder="Enter digits after decimal"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Exchange Rate *
              </label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">1</span>
                <span class="text-sm text-gray-600">=</span>
                <input 
                  v-model="formData.exchangeRate" 
                  type="number" 
                  step="0.0001"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter exchange rate"
                />
                <span class="text-sm text-gray-600">Rs</span>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="flex items-center">
                <input 
                  v-model="formData.isDefault" 
                  type="checkbox" 
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Set as default currency</span>
              </label>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal" label="Cancel" />
              <BasicButton type="submit" variant="primary" :label="isEditing ? 'Update' : 'Save'" />
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
import PlusIcon from '@/icons/PlusIcon.vue'

const currencies = ref([
  { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.00, isDefault: true, country: 'US', position: 'prefix', decimalPlaces: 2 },
  { id: 2, code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85, isDefault: false, country: 'EU', position: 'prefix', decimalPlaces: 2 },
  { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73, isDefault: false, country: 'GB', position: 'prefix', decimalPlaces: 2 },
  { id: 4, code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 110.00, isDefault: false, country: 'JP', position: 'prefix', decimalPlaces: 0 },
])

const columns = [
  { key: 'code', label: 'Currency Code', type: 'text' },
  { key: 'name', label: 'Currency Name', type: 'text' },
  { key: 'symbol', label: 'Symbol', type: 'text' },
  { key: 'exchangeRate', label: 'Exchange Rate', type: 'text' },
  { key: 'isDefault', label: 'Default', type: 'custom' }
]
const editCurrency = (currency: any) => {
  isEditing.value = true
  editingId.value = currency.id
  Object.assign(formData, currency)
  showModal.value = true
}
const deleteCurrency = (id: number) => {
  if (confirm('Are you sure you want to delete this currency?')) {
    const index = currencies.value.findIndex(c => c.id === id)
    if (index !== -1) {
      currencies.value.splice(index, 1)
    }
  }
}
const actions = [
  { key: 'edit', label: 'Edit', handler: editCurrency },
  { key: 'delete', label: 'Delete', handler: deleteCurrency }
]

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  country: '',
  name: '',
  symbol: '',
  position: 'prefix',
  code: '',
  decimalPlaces: 2,
  exchangeRate: '',
  isDefault: false
})

const countryToCurrency = {
  'US': { name: 'US Dollar', symbol: '$', code: 'USD' },
  'IN': { name: 'Indian Rupee', symbol: '₹', code: 'INR' },
  'GB': { name: 'British Pound', symbol: '£', code: 'GBP' },
  'EU': { name: 'Euro', symbol: '€', code: 'EUR' },
  'JP': { name: 'Japanese Yen', symbol: '¥', code: 'JPY' },
  'CA': { name: 'Canadian Dollar', symbol: 'C$', code: 'CAD' },
  'AU': { name: 'Australian Dollar', symbol: 'A$', code: 'AUD' }
}

const onCountryChange = () => {
  const currencyInfo = countryToCurrency[formData.country]
  if (currencyInfo) {
    formData.name = currencyInfo.name
    formData.symbol = currencyInfo.symbol
    formData.code = currencyInfo.code
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(formData, {
    country: '',
    name: '',
    symbol: '',
    position: 'prefix',
    code: '',
    decimalPlaces: 2,
    exchangeRate: '',
    isDefault: false
  })
  showModal.value = true
}



const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
}

const saveCurrency = () => {
  if (isEditing.value) {
    // Update existing currency
    const index = currencies.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      currencies.value[index] = { ...formData, id: editingId.value }
    }
  } else {
    // Add new currency
    const newId = Math.max(...currencies.value.map(c => c.id)) + 1
    currencies.value.push({ ...formData, id: newId })
  }
  
  // If setting as default, remove default from others
  if (formData.isDefault) {
    currencies.value.forEach(currency => {
      if (currency.id !== editingId.value) {
        currency.isDefault = false
      }
    })
  }
  closeModal()
}



const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>