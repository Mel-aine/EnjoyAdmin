<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Currency</h1>
        <BasicButton variant="primary" @click="openAddModal">
          <Plus class="w-4 h-4 mr-2" />
          Add Currency
        </BasicButton>
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency Code
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exchange Rate
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="currency in currencies" :key="currency.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ currency.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ currency.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ currency.symbol }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ currency.exchangeRate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="currency.isDefault" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Default
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <BasicButton variant="outline" size="sm" @click="editCurrency(currency)" class="mr-2">
                      <Edit class="w-4 h-4" />
                    </BasicButton>
                    <BasicButton 
                      variant="danger" 
                      size="sm" 
                      @click="deleteCurrency(currency.id)"
                      :disabled="currency.isDefault"
                    >
                      <Trash class="w-4 h-4" />
                    </BasicButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <input 
                v-model="formData.name" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter currency name"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sign *
              </label>
              <input 
                v-model="formData.symbol" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Currency Code *
              </label>
              <input 
                v-model="formData.code" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: USD (For United States)"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Digits after Decimal *
              </label>
              <input 
                v-model="formData.decimalPlaces" 
                type="number" 
                min="0"
                max="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              <BasicButton type="button" variant="outline" @click="closeModal">
                Cancel
              </BasicButton>
              <BasicButton type="submit" variant="primary">
                {{ isEditing ? 'Update' : 'Save' }}
              </BasicButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/ui/BasicButton.vue'
import { Plus, Edit, Trash } from 'lucide-vue-next'

const currencies = ref([
  { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.00, isDefault: true, country: 'US', position: 'prefix', decimalPlaces: 2 },
  { id: 2, code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85, isDefault: false, country: 'EU', position: 'prefix', decimalPlaces: 2 },
  { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73, isDefault: false, country: 'GB', position: 'prefix', decimalPlaces: 2 },
  { id: 4, code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 110.00, isDefault: false, country: 'JP', position: 'prefix', decimalPlaces: 0 },
])

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
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
  const currencyInfo = countryToCurrency[formData.value.country]
  if (currencyInfo) {
    formData.value.name = currencyInfo.name
    formData.value.symbol = currencyInfo.symbol
    formData.value.code = currencyInfo.code
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    country: '',
    name: '',
    symbol: '',
    position: 'prefix',
    code: '',
    decimalPlaces: 2,
    exchangeRate: '',
    isDefault: false
  }
  showModal.value = true
}

const editCurrency = (currency) => {
  isEditing.value = true
  editingId.value = currency.id
  formData.value = { ...currency }
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
      currencies.value[index] = { ...formData.value, id: editingId.value }
    }
  } else {
    // Add new currency
    const newId = Math.max(...currencies.value.map(c => c.id)) + 1
    currencies.value.push({ ...formData.value, id: newId })
  }
  
  // If setting as default, remove default from others
  if (formData.value.isDefault) {
    currencies.value.forEach(currency => {
      if (currency.id !== editingId.value) {
        currency.isDefault = false
      }
    })
  }
  
  closeModal()
}

const deleteCurrency = (id) => {
  const currency = currencies.value.find(c => c.id === id)
  if (currency && !currency.isDefault) {
    if (confirm('Are you sure you want to delete this currency?')) {
      currencies.value = currencies.value.filter(c => c.id !== id)
    }
  }
}
</script>