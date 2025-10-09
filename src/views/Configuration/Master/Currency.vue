<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('currencyManagement') }}</h1>
        <p class="text-gray-600 mt-1">
          {{ t('currencyManagementDescription') }}
        </p>
      </div>

      <!-- Currencies Table using ReusableTable -->
      <ReusableTable
        :title="t('currenciesList')"
        :columns="columns"
        :data="currencies"
        :actions="actions"
        :search-placeholder="t('searchCurrencies')"
        :selectable="true"
        :empty-state-title="t('noCurrenciesFound')"
        :empty-state-message="t('addCurrencyMessage')"
        @action="onAction"
        @selection-change="onSelectionChange"
        :loading="loading"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            :label="t('addCurrency')"
            :icon="Plus"
          />

          <BasicButton 
            v-if="selectedCurrencies.length > 0"
            @click="showBulkDeleteModal = true"
            variant="danger"
            :label="t('deleteSelected')"
            :icon="Trash2"
          />
        </template>

        <!-- Custom column for default currency -->
        <template #column-isDefault="{ item }">
          <span v-if="item.isDefault" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {{ t('default') }}
          </span>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdByUser?.firstName || 'System' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.updatedByUser?.firstName || 'System' }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(item.updatedAt) }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div 
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showEditModal ? t('editCurrency') : t('addCurrency') }}
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
                  :lb="t('currencyName')"
                  inputType="text" 
                  :isRequired="true"
                  :placeholder="t('enterCurrencyName')"
                />
              </div>
              
              <div class="mb-4">
                <Input 
                  v-model="formData.sign" 
                  :lb="t('currencySymbol')"
                  inputType="text" 
                  :isRequired="true"
                  :placeholder="t('enterCurrencySymbol')"
                />
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('prefixSuffix') }} *
                </label>
                <div class="flex space-x-2">
                  <label class="flex items-center">
                    <input 
                      v-model="formData.prefixSuffix" 
                      type="radio" 
                      value="prefix"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ t('prefix') }}</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="formData.prefixSuffix" 
                      type="radio" 
                      value="suffix"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ t('suffix') }}</span>
                  </label>
                </div>
              </div>
              
              <div class="mb-4">
                <Input 
                  v-model="formData.currencyCode" 
                  :lb="t('currencyCode')"
                  inputType="text" 
                  :isRequired="true"
                  :placeholder="t('currencyCodePlaceholder')"
                />
              </div>
              
              <div class="mb-4">
                <Input 
                  v-model="formData.digitsAfterDecimal" 
                  :lb="t('digitsAfterDecimal')"
                  inputType="number" 
                  :min="0"
                  :max="4"
                  :isRequired="true"
                  :placeholder="t('enterDigitsAfterDecimal')"
                />
              </div>
              
              <div class="mb-4 col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('exchangeRate') }}
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
                    :placeholder="t('enterExchangeRate')"
                  />
                  <span class="text-sm text-gray-600">{{ t('XAF') }}</span>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="flex items-center">
                  <input 
                    v-model="formData.isDefault" 
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('setAsDefaultCurrency') }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal" 
                :label="t('cancel')" 
                :disabled="saving"
              />
              <BasicButton 
                type="submit" 
                variant="primary" 
                :label="saving ? t('saving') + '...' : (showEditModal ? t('update') : t('save'))"
                :loading="saving"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Single Confirmation Modal -->
    <ModalConfirmation 
      v-if="showDeleteModal" 
      v-model="showDeleteModal" 
      :title="t('Delete Curency')" 
      :message="getSingleDeleteMessage()"
      :confirm-text="t('delete')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmDeleteSingleCurrency"
      @close="closeSingleDeleteModal"
      :loading="isDeletingLoading"
      action="DANGER"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <ModalConfirmation 
      v-if="showBulkDeleteModal" 
      v-model="showBulkDeleteModal" 
      :title="t('Delete Selected Currencies')" 
      :message="getBulkDeleteMessage()"
      :confirm-text="t('deleteSelected')" 
      :cancel-text="t('cancel')" 
      @confirm="confirmBulkDeleteCurrencies"
      @close="closeBulkDeleteModal"
      :loading="isBulkDeletingLoading"
      action="DANGER"
    />
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
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
const serviceStore = useServiceStore()

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedCurrencies = ref<any[]>([])
const editingCurrency = ref<any>(null)
const loading = ref(false)
const saving = ref(false)

// Delete modals states
const showDeleteModal = ref(false)
const showBulkDeleteModal = ref(false)
const currencyToDelete = ref<any>(null)
const isDeletingLoading = ref(false)
const isBulkDeletingLoading = ref(false)

// Form data
const formData = ref({
  id: '',
  country: '',
  name: '',
  sign: '',
  prefixSuffix: 'prefix',
  currencyCode: '',
  digitsAfterDecimal: 2,
  exchangeRate: 1.0,
  isDefault: false
})

// Computed properties
const selectedCount = computed(() => selectedCurrencies.value.length)

// Table columns
const columns = computed<Column[]>(() => [
  { 
    key: 'currencyCode', 
    label: t('currencyCode'), 
    type: 'text',
    sortable: true,
    searchable: true
  },
  { 
    key: 'name', 
    label: t('currencyName'), 
    type: 'text',
    sortable: true,
    searchable: true
  },
  { 
    key: 'sign', 
    label: t('currencySymbol'), 
    type: 'text',
    sortable: true
  },
  { 
    key: 'exchangeRate', 
    label: t('exchangeRate'), 
    type: 'text',
    sortable: true
  },
  { 
    key: 'isDefault', 
    label: t('default'), 
    type: 'custom' 
  },
  { 
    key: 'country', 
    label: t('country'), 
    type: 'text',
    sortable: true
  },
  { 
    key: 'prefixSuffix', 
    label: t('prefixSuffix'), 
    type: 'text',
    translatable: true 
  },
  { 
    key: 'digitsAfterDecimal', 
    label: t('decimalPlaces'), 
    type: 'text' 
  },
  { 
    key: 'createdInfo', 
    label: t('createdBy'), 
    type: 'custom' 
  },
  { 
    key: 'modifiedInfo', 
    label: t('modifiedBy'), 
    type: 'custom' 
  }
])

const actions = computed<Action[]>(() => [
  { 
    label: t('edit'), 
    handler: (item: any) => onAction('edit', item), 
    icon: Edit,
    variant: 'primary' 
  },
  { 
    label: t('delete'), 
    handler: (item: any) => onAction('delete', item), 
    icon: Trash2,
    variant: 'danger' 
  }
])

const currencies = ref<any[]>([])

// Country to currency mapping for auto-fill
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

// Methods
const onSelectionChange = (selected: any[]) => {
  selectedCurrencies.value = selected
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editCurrency(item)
  } else if (action === 'delete') {
    handleDeleteCurrency(item)
  }
}

const editCurrency = (currency: any) => {
  editingCurrency.value = currency
  formData.value = { ...currency }
  showEditModal.value = true
}

// Single currency deletion
const handleDeleteCurrency = (currency: any) => {
  currencyToDelete.value = currency
  showDeleteModal.value = true
}

const confirmDeleteSingleCurrency = async () => {
  if (!currencyToDelete.value) return

  isDeletingLoading.value = true
  try {
    await deleteCurrencyById(currencyToDelete.value.id)
    
    // Update local list
    const index = currencies.value.findIndex(c => c.id === currencyToDelete.value.id)
    if (index > -1) {
      currencies.value.splice(index, 1)
    }
    
    toast.success(t('currencyDeletedSuccessfully'))
  } catch (error) {
    console.error('Error deleting currency:', error)
    toast.error(t('errorDeletingCurrency'))
  } finally {
    isDeletingLoading.value = false
    closeSingleDeleteModal()
  }
}

const closeSingleDeleteModal = () => {
  showDeleteModal.value = false
  currencyToDelete.value = null
}

// Multiple currencies deletion
const confirmBulkDeleteCurrencies = async () => {
  if (selectedCurrencies.value.length === 0) return

  isBulkDeletingLoading.value = true
  try {
    const deletePromises = selectedCurrencies.value.map(currency => 
      deleteCurrencyById(currency.id)
    )
    
    await Promise.all(deletePromises)
    
    // Update local list
    const selectedIds = selectedCurrencies.value.map(c => c.id)
    currencies.value = currencies.value.filter(c => !selectedIds.includes(c.id))
    
    const count = selectedCurrencies.value.length
    selectedCurrencies.value = []
    toast.success(t('currenciesDeletedSuccess', { count }))
  } catch (error) {
    console.error('Error deleting currencies:', error)
    toast.error(t('errorDeletingSelectedCurrencies'))
  } finally {
    isBulkDeletingLoading.value = false
    closeBulkDeleteModal()
  }
}

const closeBulkDeleteModal = () => {
  showBulkDeleteModal.value = false
}

// Message methods
const getSingleDeleteMessage = () => {
  if (!currencyToDelete.value) return ''
  const currencyName = currencyToDelete.value.name || currencyToDelete.value.currencyCode
  return `Are you sure you want to delete currency "${currencyName}"? `
}

const getBulkDeleteMessage = () => {
  const count = selectedCurrencies.value.length
  if (count === 0) return ''
  
  if (count === 1) {
    const currencyName = selectedCurrencies.value[0].name || selectedCurrencies.value[0].currencyCode
    return `Are you sure you want to delete the selected currency "${currencyName}"?`
  } else {
    return `Are you sure you want to delete ${count} selected currencies?`
  }
}

// Fetch currencies from API
const fetchCurrencies = async () => {
  try {
    loading.value = true
    const response = await getCurrencies()
    currencies.value = response.data.data || []
    console.log('currencies data:', response)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    toast.error(t('errorLoadingCurrencies'))
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
    
    if (showEditModal.value && editingCurrency.value) {
      // Update existing currency
      await updateCurrencyById(parseInt(editingCurrency.value.id), currencyData)
      toast.success(t('currencyUpdatedSuccessfully'))
    } else {
      // Add new currency
      const newCurrency = {
        ...currencyData,
        hotelId: serviceStore.serviceId
      }
      await postCurrency(newCurrency)
      toast.success(t('currencyAddedSuccessfully'))
    }
    
    await fetchCurrencies()
    closeModal()
  } catch (error) {
    console.error('Error saving currency:', error)
    toast.error(t('errorSavingCurrency'))
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCurrency.value = null
  formData.value = {
    id: '',
    country: '',
    name: '',
    sign: '',
    prefixSuffix: 'prefix',
    currencyCode: '',
    digitsAfterDecimal: 2,
    exchangeRate: 1.0,
    isDefault: false
  }
}

// Format date helper
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Load currencies on component mount
onMounted(() => {
  fetchCurrencies()
})
</script>