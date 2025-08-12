<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        :title="$t('Currency Management')"
        :columns="columns"
        :data="currencies"
        :actions="actions"
        :search-placeholder="$t('Search currencies...')"
        :empty-title="$t('No currencies found')"
        :empty-description="$t('Start by adding your first currency.')"
        :loading="loading"
        @action="onAction"
      >
      <template v-slot:header-actions>
        <BasicButton 
          variant="primary" 
          @click="openAddModal" 
          :icon="PlusIcon" 
          :label="$t('Add Currency')"
          :loading="loading"
        />
      </template>
        <template #isDefault="{ item }">
          <span v-if="item.isDefault" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {{ $t('Default') }}
          </span>
        </template>
      </ReusableTable>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? $t('Edit Currency') : $t('Add Currency') }}
          </h3>
          
          <form @submit.prevent="saveCurrency">
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div class="mb-4">
              <InputCountries
                v-model="formData.country"
                :isRequired="true"
                @change="onCountryChange"
              />
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.name" 
                :lb="$t('Currency') "
                inputType="text" 
                :isRequired="true"
                :placeholder="$t('Enter currency name')"
              />
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.sign" 
                :lb="$t('Sign')"
                inputType="text" 
                :isRequired="true"
                :placeholder="$t('Enter currency symbol')"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('Prefix/Suffix') }} *
              </label>
              <div class="flex space-x-2">
                <label class="flex items-center">
                  <input 
                    v-model="formData.prefixSuffix" 
                    type="radio" 
                    value="prefix"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ $t('Prefix') }}</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formData.prefixSuffix" 
                    type="radio" 
                    value="suffix"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ $t('Suffix') }}</span>
                </label>
              </div>
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.currencyCode" 
                :lb="$t('Currency Code') + ' *'"
                inputType="text" 
                :isRequired="true"
                :placeholder="$t('Ex: USD (For United States)')"
              />
            </div>
            
            <div class="mb-4">
              <Input 
                v-model="formData.digitsAfterDecimal" 
                :lb="$t('Digits after Decimal')"
                inputType="number" 
                :min="0"
                :max="4"
                :isRequired="true"
                :placeholder="$t('Enter digits after decimal')"
              />
            </div>
            
            <div class="mb-4 col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('Exchange Rate') }}
              </label>
              <div class="flex items-center space-x-2" >
                <span class="text-sm text-gray-600">1</span>
                <span class="text-sm text-gray-600">=</span>
                <input 
                  v-model="formData.exchangeRate" 
                  type="number" 
                  step="0.0001"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="$t('Enter exchange rate')"
                />
                <span class="text-sm text-gray-600">{{ $t('XAF') }}</span>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="flex items-center">
                <input 
                  v-model="formData.isDefault" 
                  type="checkbox" 
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">{{ $t('Set as default currency') }}</span>
              </label>
            </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                @click="closeModal"
                type="button"
                :label="$t('cancel')"
              />
              <BasicButton 
                variant="primary" 
                type="submit"
                :label="isEditing ? $t('update') : $t('save')"
                :icon="isEditing ? Edit : Save"
                :loading="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import PlusIcon from '@/icons/PlusIcon.vue'
import { Edit, Save } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'
import { 
  getCurrencies, 
  postCurrency, 
  updateCurrencyById, 
  deleteCurrencyById 
} from '@/services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'

const { t } = useI18n()
const toast = useToast()

const currencies = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const serviceStore = useServiceStore();
const columns = computed<Column[]>(() => [
  { key: 'currencyCode', label: t('Currency Code'), type: 'text' },
  { key: 'name', label: t('Currency Name'), type: 'text' },
  { key: 'sign', label: t('Symbol'), type: 'text' },
  { key: 'exchangeRate', label: t('Exchange Rate'), type: 'text' },
  { key: 'isDefault', label: t('Default'), type: 'custom' },
  { key: 'country', label: t('Country'), type: 'text' },
  { key: 'prefixSuffix', label: t('prefixSuffix'), type: 'text', translatable:true },
  { key: 'digitsAfterDecimal', label: t('Decimal Places'), type: 'text' },
])

// Country to currency mapping for auto-fill (using standard country codes)
const countryToCurrency = {
  'US': { name: 'US Dollar', symbol: '$', code: 'USD' },
  'FR': { name: 'Euro', symbol: '€', code: 'EUR' },
  'GB': { name: 'British Pound', symbol: '£', code: 'GBP' },
  'JP': { name: 'Japanese Yen', symbol: '¥', code: 'JPY' },
  'CA': { name: 'Canadian Dollar', symbol: 'C$', code: 'CAD' },
  'AU': { name: 'Australian Dollar', symbol: 'A$', code: 'AUD' },
  'CN': { name: 'Chinese Yuan', symbol: '¥', code: 'CNY' },
  'IN': { name: 'Indian Rupee', symbol: '₹', code: 'INR' },
  'BR': { name: 'Brazilian Real', symbol: 'R$', code: 'BRL' },
  'MX': { name: 'Mexican Peso', symbol: '$', code: 'MXN' },
  'CM': { name: 'Central African CFA Franc', symbol: 'FCFA', code: 'XAF' }
}

const editCurrency = (currency: any) => {
  isEditing.value = true
  formData.value = { ...currency }
  showModal.value = true
}

const deleteCurrency = async (currency: any) => {
  if (confirm(t('Are you sure you want to delete this currency?'))) {
    try {
      loading.value = true
      await deleteCurrencyById(currency.id)
      toast.success(t('Currency deleted successfully'))
      await fetchCurrencies()
    } catch (error) {
      console.error('Error deleting currency:', error)
      toast.error(t('Failed to delete currency'))
    } finally {
      loading.value = false
    }
  }
}

const actions = computed<Action[]>(() => [
  { label: t('Edit'), handler:(item)=> editCurrency(item), variant: 'primary' },
  { label: t('Delete'), handler:(item)=> deleteCurrency(item), variant: 'danger' }
])

const showModal = ref(false)
const isEditing = ref(false)

const formData = ref({
  country: '',
  name: '',
  sign: '',
  prefixSuffix: 'prefix',
  currencyCode: '',
  digitsAfterDecimal: 2,
  exchangeRate: 1.0,
  isDefault: false
})



// Fetch currencies from API
const fetchCurrencies = async () => {
  try {
    loading.value = true
    const response = await getCurrencies()
    currencies.value = response.data.data || []
    console.log('currecy',response)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    toast.error(t('Failed to load currencies'))
  } finally {
    loading.value = false
  }
}

const onCountryChange = (countryCode: string) => {
  const currencyInfo = countryToCurrency[countryCode as keyof typeof countryToCurrency]
  if (currencyInfo) {
    formData.value.name = currencyInfo.name
    formData.value.sign = currencyInfo.symbol
    formData.value.currencyCode = currencyInfo.code
  }
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    country: '',
    name: '',
    sign: '',
    prefixSuffix: 'prefix',
    currencyCode: '',
    digitsAfterDecimal: 2,
    exchangeRate: 1.0,
    isDefault: false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveCurrency = async () => {
  try {
    saving.value = true
    
    const currencyData = {
      country: formData.value.country,
      name: formData.value.name,
      sign: formData.value.sign,
      prefixSuffix: formData.value.prefixSuffix,
      currencyCode: formData.value.currencyCode,
      digitsAfterDecimal: formData.value.digitsAfterDecimal,
      exchangeRate: formData.value.exchangeRate,
      isDefault: formData.value.isDefault
    }
    
    if (isEditing.value && formData.value.id) {
      // Update existing currency
      await updateCurrencyById(formData.value.id, currencyData)
      toast.success(t('Currency updated successfully'))
    } else {
      // Add new currency
      const newCurrency = {
        ...currencyData,
        hotelId : serviceStore.serviceId
      }
      await postCurrency(newCurrency)
      toast.success(t('Currency added successfully'))
    }
    
    await fetchCurrencies()
    closeModal()
  } catch (error) {
    console.error('Error saving currency:', error)
    toast.error(t('Failed to save currency'))
  } finally {
    saving.value = false
  }
}

// Load currencies on component mount
onMounted(() => {
  fetchCurrencies()
})



const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>