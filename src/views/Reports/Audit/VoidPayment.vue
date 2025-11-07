<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.audit.voidPayment') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.audit.voidPaymentDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Void From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.audit.voidFrom') }}
            </label>
            <InputDatepicker v-model="filters.voidFrom" :placeholder="$t('common.dateFrom')" class="w-full" />
          </div>

          <!-- Void To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <InputDatepicker v-model="filters.voidTo" :placeholder="$t('common.dateTo')" class="w-full" />
          </div>

          <!-- Void By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.audit.voidBy') }}
            </label>
            <SelectComponent v-model="filters.voidBy" :options="voidByOptions" :placeholder="$t('common.select')" class="w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 items-end">
            <ButtonComponent 
              @click="generateReport" 
              :disabled="isLoading"
              variant="" 
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ $t('common.report') }}</span>
            </ButtonComponent>

            <ButtonComponent 
              @click="resetForm" 
              variant="outline" 
              class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('common.reset') }}
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Report -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
              {{ $t('reports.audit.voidPayment') }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>{{ $t('common.dateFrom') }}:</strong> {{ filters.voidFrom }} <strong>{{ $t('common.to') }}:</strong> {{ filters.voidTo }}</span>
          </div>
        </div>

        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable 
            :title="$t('reports.audit.voidPaymentDetails')" 
            :data="voidPaymentData" 
            :columns="voidPaymentColumns" 
            :show-header="false"
            class="w-full mb-4 min-w-max" 
          />
          
          <!-- Summary -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center text-sm font-semibold">
              <span class="text-gray-700 dark:text-gray-300">{{ $t('reports.totalRecords') }}: {{ totalRecords }}</span>
              <span class="text-gray-900 dark:text-white">{{ $t('reports.totalAmount') }}: {{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import { getEmployeesForService } from '../../../services/userApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { getVoidTransactionReport } from '../../../services/reportsApi'

const { t } = useI18n()

// ============================================================================
// INTERFACES
// ============================================================================
interface FilterOptions {
  value: string;
  label: string;
}

interface VoidPaymentItem {
  date: string;
  voucher: string;
  payment: string;
  reference: string;
  amount: string;
  voidByDateTime: string;
}

interface Filters {
  voidFrom: string;
  voidTo: string;
  voidBy: string;
}

interface ApiVoidTransaction {
  voidedAt: string;
  folioNo: string;
  transactionType: string;
  resNo: string;
  amount: string;
  voidedBy: string;
  guestName: string;
  description: string;
  reason: string;
  transactionNumber: string;
  invoiceNo: string;
}

const isLoading = ref<boolean>(false)
const showResults = ref<boolean>(false)
const loading = ref<boolean>(false)

const totalRecords = ref<number>(0)
const totalAmount = ref<number>(0)

const voidPaymentDataRaw = ref<VoidPaymentItem[]>([])
const voidByOptionsRaw = ref<FilterOptions[]>([])

const voidByOptions = computed<FilterOptions[]>(() => [
  { value: '', label: t('common.all') },
  ...voidByOptionsRaw.value
])
const users = ref<any>([])

// Set default dates to today
const today = new Date().toISOString().split('T')[0]

const filters = ref<Filters>({
  voidFrom: today,
  voidTo: today,
  voidBy: '',
})

const serviceStore = useServiceStore()
const hotelName = computed(() => {
  return serviceStore.getCurrentService?.hotelName || 'Hotel Name'
})

const voidPaymentColumns = computed(() => [
  { key: 'date', label: t('common.date') },
  { key: 'voucher', label: t('common.voucherNumber') },
  { key: 'payment', label: t('common.payment') },
  { key: 'reference', label: t('common.reference') },
  { key: 'amount', label: t('common.amount') },
  { key: 'voidByDateTime', label: t('reports.audit.voidByDateTime') }
])

const voidPaymentData = computed(() => {
  return voidPaymentDataRaw.value
})


/**
 * Format currency value
 */
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })
}

/**
 * Map API data to table format
 */
const mapApiDataToTableFormat = (apiData: ApiVoidTransaction[]): VoidPaymentItem[] => {
  return apiData.map((item) => ({
    date: item.voidedAt || '',
    voucher: item.folioNo || '',
    payment: item.transactionType || '',
    reference: item.resNo || '',
    amount: item.amount || '0.00',
    voidByDateTime: item.voidedBy || t('common.na')
  }))
}

/**
 * Generate void payment report
 */
const generateReport = async (): Promise<void> => {
  isLoading.value = true
  showResults.value = false
  
  try {
    const data = {
      from: filters.value.voidFrom,
      to: filters.value.voidTo,
      by: filters.value.voidBy,
      hotelId: serviceStore.serviceId!
    }
    
    const response = await getVoidTransactionReport(data)
    console.log('API Response:', response)
    
    // Map API data to table format
    const apiTransactions = response?.data?.voidTransactions || []
    voidPaymentDataRaw.value = mapApiDataToTableFormat(apiTransactions)
    
    // Set totals
    totalRecords.value = response?.data?.totalRecords || 0
    totalAmount.value = parseFloat(response?.data?.totalAmount || '0')
    
    // Show results only after data is loaded
    showResults.value = true
    
  } catch (error) {
    console.error('Error generating report:', error)
    voidPaymentDataRaw.value = []
    totalRecords.value = 0
    totalAmount.value = 0
    showResults.value = false
  } finally {
    isLoading.value = false
  }
}

/**
 * Reset form to default values
 */
const resetForm = (): void => {
  filters.value = {
    voidFrom: today,
    voidTo: today,
    voidBy: '',
  }
  voidPaymentDataRaw.value = []
  totalRecords.value = 0
  totalAmount.value = 0
  showResults.value = false
}

/**
 * Fetch employees for void by dropdown
 */
const fetchUser = async (): Promise<void> => {
  loading.value = true
  
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) throw new Error('hotelId is not defined')
    
    const response = await getEmployeesForService(hotelId)
    console.log('Employees response:', response)

    const employeeOptions = response.data.data.map((user: any) => ({
      value: user.id,
      label: user.lastName
    }))
    
    voidByOptionsRaw.value = employeeOptions
    
    users.value = employeeOptions
    console.log('Filtered users:', users.value)
    
  } catch (error) {
    console.error('Fetch users failed:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchUser()
})
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>