<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('Daily Receipt Detail Reports') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('viewAndManageDailyReceiptDetails') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Receipt From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('receiptFrom') }}
            </label>
            <InputDatepicker v-model="filters.receiptFrom" :placeholder="$t('dateFormat')" class="w-full"
              @update:modelValue="updateDateFilter('fromDate', $event)"></InputDatepicker>
          </div>

          <!-- To Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.to') }}
            </label>
            <InputDatepicker v-model="filters.receiptTo" :placeholder="$t('dateFormat')" class="w-full"
              @update:modelValue="updateDateFilter('toDate', $event)"></InputDatepicker>
          </div>

          <!-- Received By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('receivedBy') }}
            </label>
            <SelectComponent v-model="filters.receivedBy" :options="receivedByOptions"
              :placeholder="$t('select')" class="w-full"></SelectComponent>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Payment Method') }}
            </label>
            <SelectComponent v-model="filters.paymentMethod" :options="paymentMethodOptions"
              :placeholder="$t('select')" class="w-full"></SelectComponent>
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Currency') }}
            </label>
            <SelectComponent v-model="filters.currency" :options="currencyOptions"
              :placeholder="$t('select')" class="w-full"></SelectComponent>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <!-- Export Button with Dropdown -->
          <div class="relative">
            <button @click="toggleExportMenu" :disabled="exportLoading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24 transition-all duration-200 hover:shadow-md">
              <svg v-if="exportLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span v-if="!exportLoading">{{ $t('export') }}</span>
              <svg v-if="!exportLoading" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Export Dropdown Menu -->
            <div v-if="exportMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
  <!--             <button @click="exportCSV"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                :disabled="exportLoading">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                CSV
              </button> -->
              <button @click="exportPDF"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                :disabled="exportLoading">
                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
<!--               <button @click="exportExcel"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                :disabled="exportLoading">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button> -->
            </div>
          </div>

          <!-- Report Button -->
          <button @click="generateReport" :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24 transition-all duration-200 hover:shadow-md">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ $t('Report') }}
          </button>

          <!-- Reset Button -->
          <button @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24 transition-all duration-200 hover:shadow-md">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('Reset') }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700 px-4 py-3">
        
        <!-- Report Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-800 dark:border-gray-400 pb-1 mb-1">
          <div class="text-base font-bold text-blue-800 dark:text-blue-300 uppercase">
            {{ reportData?.hotelInformation?.hotelName }}
          </div>
          <div class="text-base text-red-800 dark:text-red-400 font-bold">
            {{ $t('dailyReceiptDetail') }}
          </div>
        </div>

        <!-- Date Range -->
        <div class="text-sm mb-2 space-x-3 text-gray-900 dark:text-gray-100 border-b border-gray-800 dark:border-gray-400 py-1">
          <span><strong class="font-semibold">{{ $t('common.dateFrom') }}:</strong> {{ reportData?.dateRange?.fromDate || filters.receiptFrom }}</span>
          <span><strong class="font-semibold">{{ $t('common.to') }}:</strong> {{ reportData?.dateRange?.toDate || filters.receiptTo }}</span>
        </div>

        <!-- Report Content HTML -->
        <div v-if="reportData?.html" v-html="reportData.html" class="w-full"></div>

        <!-- Fallback: Receipt Details Table if no HTML -->
        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-white dark:bg-gray-800">
                <th class="px-3 py-2 text-left border-b border-gray-800 dark:border-gray-300 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {{ $t('Date') }}
                </th>
                <th class="px-3 py-2 text-left border-b border-gray-800 dark:border-gray-300 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {{ $t('receipt') }}
                </th>
                <th class="px-3 py-2 text-left border-b border-gray-800 dark:border-gray-300 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {{ $t('reference') }}
                </th>
                <th class="px-3 py-2 text-right border-b border-gray-800 dark:border-gray-300 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {{ $t('Amount') }}
                </th>
                <th class="px-3 py-2 text-left border-b border-gray-800 dark:border-gray-300 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {{ $t('user') }}
                </th>
                <th class="px-3 py-2 text-left border-b border-gray-800 dark:border-gray-300 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {{ $t('enteredOn') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800" v-if="reportData">
              <!-- Receipt Data from API -->
              <template v-for="(item, index) in reportData.paymentMethodTotals" :key="index">
                <!-- En-tête de la méthode de paiement -->
                <tr class="bg-white dark:bg-gray-800">
                  <td class="px-3 py-2 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100" colspan="6">
                    {{ item.methodName }}
                  </td>
                </tr>
                
                <!-- Lignes des reçus -->
                <tr v-for="(it, idx) in item.receipts" :key="idx" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-3 py-1 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {{ formatDate(it.date) }}
                  </td>
                  <td class="px-3 py-1 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {{ it.receiptNumber }}
                  </td>
                  <td class="px-3 py-1 text-gray-900 dark:text-gray-100">
                    {{ it.summary || it.description }}
                  </td>
                  <td class="px-3 py-1 whitespace-nowrap text-right font-mono text-gray-900 dark:text-gray-100">
                    {{ formatCurrency(it.amount) }}
                  </td>
                  <td class="px-3 py-1 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {{ it.user }}
                  </td>
                  <td class="px-3 py-1 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {{ formatDate(it.enteredOn) }}
                  </td>
                </tr>
                
                <!-- Ligne de séparation pointillée avant le total par méthode - UNIQUEMENT sur Amount -->
                <tr class="bg-white dark:bg-gray-800">
                  <td colspan="3" class="px-3 py-0"></td>
                  <td class="border-b border-dotted border-gray-400 dark:border-gray-500 px-3 py-0"></td>
                  <td colspan="2" class="px-3 py-0"></td>
                </tr>
                
                <!-- Ligne de Total par méthode de paiement -->
                <tr class="bg-white dark:bg-gray-800 font-bold">
                  <td class="px-3 py-1 text-gray-900 dark:text-gray-100" colspan="2">
                    <!-- Vide pour Date et Receipt -->
                  </td>
                  <td class="px-3 py-1 text-gray-900 dark:text-gray-100">
                    {{ $t('Total') }} {{ item.methodName }}
                  </td>
                  <td class="px-3 py-1 text-right font-mono text-gray-900 dark:text-gray-100">
                    {{ formatCurrency(calculateMethodTotal(item.receipts)) }}
                  </td>
                  <td colspan="2" class="px-3 py-1"></td>
                </tr>
                
                <!-- Ligne de séparation pointillée après le total par méthode - UNIQUEMENT sur Amount -->
                <tr class="bg-white dark:bg-gray-800">
                  <td colspan="3" class="px-3 py-0"></td>
                  <td class="border-b border-dotted border-gray-400 dark:border-gray-500 px-3 py-0"></td>
                  <td colspan="2" class="px-3 py-0"></td>
                </tr>
                
                <!-- Ligne vide pour l'espacement -->
                <tr class="bg-white dark:bg-gray-800">
                  <td colspan="6" class="py-2"></td>
                </tr>
              </template>
              
              <!-- Grand Total Row -->
              <tr class="bg-white dark:bg-gray-800 font-bold">
                <td class="px-3 py-2 text-gray-900 dark:text-gray-100" colspan="2">
                  <!-- Vide pour Date et Receipt -->
                </td>
                <td class="px-3 py-2 text-gray-900 dark:text-gray-100">
                  {{ $t('grandTotal') }}
                </td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(reportData?.grandTotalAmount) }}
                </td>
                <td colspan="2" class="px-3 py-2"></td>
              </tr>
              
              <!-- Ligne de séparation pointillée après le Grand Total - UNIQUEMENT sur Amount -->
              <tr class="bg-white dark:bg-gray-800">
                <td colspan="3" class="px-3 py-0"></td>
                <td class="border-b border-dotted border-gray-400 dark:border-gray-500 px-3 py-0"></td>
                <td colspan="2" class="px-3 py-0"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generateDailyReceiptDetail, exportData, generateDailyReceiptPdf, type DailyReceipt } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { getEmployeesForService } from '@/services/userApi'
import { getPaymentMethods } from '@/services/paymentMethodApi'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

interface FilterOptions {
  value: string | number;
  label: string;
}

interface Filters {
  receiptFrom: string;
  receiptTo: string;
  receivedBy: string;
  paymentMethod: string;
  currency: string;
}

interface TableHeader {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

interface ReportData {
  hotelDetails: {
    hotelId: number;
    hotelName: string;
  };
  dateRange: {
    fromDate: string;
    toDate: string;
  };
  userSummaries: any[];
  grandTotals: {
    totalTransactions: number;
    totalAmount: number;
    totalVoid: number;
    voidAmount: number;
    netTotal: number;
  };
  html?: string;
  title?: string;
  generatedAt?: string;
  paymentMethodTotals: any,
  grandTotalAmount: any
  hotelInformation: any
}

const showResults = ref<boolean>(false)
const reportData = ref<ReportData | null>(null)
const loading = ref<boolean>(false)
const exportMenuOpen = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const pdfUrl = ref('')
const errorMessage = ref('')
const idHotel = serviceStore.serviceId

// Filters for UI
const filters = ref<Filters>({
  receiptFrom: (() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })(),
  receiptTo: (() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })(),
  receivedBy: '',
  paymentMethod: '',
  currency: ''
})

// API Filters
const apiFilters = ref<DailyReceipt>({
  fromDate: filters.value.receiptFrom,
  toDate: filters.value.receiptTo,
  hotelId: idHotel !== null ? idHotel : 0,
  receiptByUserId: 0,
  currencyId: 0,
  paymentMethodId: 0
})

// Options for selects
const receivedByOptions = ref<FilterOptions[]>([])
const paymentMethodOptions = ref<FilterOptions[]>([])
const currencyOptions = ref<FilterOptions[]>([])

// Headers for receipt table
const receiptHeaders = ref<TableHeader[]>([
  { key: 'date', label: 'Date', align: 'left' },
  { key: 'receipt', label: 'Receipt', align: 'left' },
  { key: 'reference', label: 'Reference', align: 'left' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'user', label: 'User', align: 'left' },
  { key: 'enteredOn', label: 'Entered On', align: 'left' }
])

// Sample receipt data (will be replaced with API data)
const receiptData = ref<any[]>([])

// Computed values for totals
const grandTotal = computed(() => {
  return receiptData.value.reduce((sum, item) => sum + parseFloat(item.totalAmount || '0'), 0)
})

const totalEntries = computed(() => {
  if (!reportData.value?.paymentMethodTotals) return 0
  return reportData.value.paymentMethodTotals.reduce((total: number, method: any) => {
    return total + (method.receipts?.length || 0)
  }, 0)
})

const reportTitle = computed(() => {
  return reportData.value?.title || t('dailyReceiptReport')
})

// Fonction pour calculer le total par méthode de paiement
const calculateMethodTotal = (receipts: any[]): number => {
  if (!receipts || !Array.isArray(receipts)) return 0
  return receipts.reduce((sum, receipt) => sum + (parseFloat(receipt.amount) || 0), 0)
}

// Fetch options from API
const fetchUsers = async () => {
  try {
    const resp = await getEmployeesForService(idHotel!)
    receivedByOptions.value = resp.data.data.map((u: any) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.user_id
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const fetchPaymentMethods = async () => {
  try {
    const resp = await getPaymentMethods(idHotel!)
    paymentMethodOptions.value = resp.data.data.map((pm: any) => ({
      label: pm.methodName,
      value: pm.id
    }))
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

// Watch filters and update API filters
watch(filters, (newFilters) => {
  apiFilters.value = {
    ...apiFilters.value,
    fromDate: newFilters.receiptFrom,
    toDate: newFilters.receiptTo,
    receiptByUserId: newFilters.receivedBy ? parseInt(newFilters.receivedBy) : 0,
    paymentMethodId: newFilters.paymentMethod ? parseInt(newFilters.paymentMethod) : 0,
    currencyId: newFilters.currency ? parseInt(newFilters.currency) : 0,
  }
}, { deep: true })

// Methods
const updateDateFilter = (field: 'fromDate' | 'toDate', value: string) => {
  if (value) {
    const date = new Date(value)
    apiFilters.value[field] = date.toISOString().split('T')[0]
  } else {
    apiFilters.value[field] = ''
  }
}

const generateReport = async (): Promise<void> => {
  loading.value = true
  showResults.value = false

  try {
    console.log('Generating daily receipt report with filters:', apiFilters.value)
    const response = await generateDailyReceiptDetail(apiFilters.value)
    console.log('API Response:', response)

    if (response && response.success && response.data) {
      reportData.value = response.data
      receiptData.value = response.data.receiptList || []
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating report:', error)
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV with filters:', apiFilters.value)
    const result = await exportData('csv', 'dailyReceiptDetail', 'daily-receipt', apiFilters.value)
    console.log('CSV export result:', result)
  } catch (error) {
    console.error('CSV export error:', error)
  } finally {
    exportLoading.value = false
  }
}

const exportPDF = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false

    // Clear previous PDF URL
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    // Generate new PDF URL
    const newPdfUrl = await generateDailyReceiptPdf(apiFilters.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Daily receipt report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating daily receipt report:', error)
    errorMessage.value = error instanceof Error ? error.message : t('failedToGeneratePDF')
  } finally {
    exportLoading.value = false
  }
}

const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel with filters:', apiFilters.value)
    const result = await exportData('excel', 'dailyReceiptDetail', 'daily-receipt', apiFilters.value)
    console.log('Excel export result:', result)
  } catch (error) {
    console.error('Excel export error:', error)
  } finally {
    exportLoading.value = false
  }
}

const openPDFInNewPage = () => {
  if (pdfUrl.value) {
    const encodedUrl = btoa(encodeURIComponent(pdfUrl.value))
    const routeData = router.resolve({
      name: 'PDFViewer',
      query: {
        url: encodedUrl,
        title: reportTitle.value
      }
    })
    window.open(routeData.href, '_blank')
  }
}

const resetForm = (): void => {
  filters.value = {
    receiptFrom: '',
    receiptTo: '',
    receivedBy: '',
    paymentMethod: '',
    currency: ''
  }
  showResults.value = false
  reportData.value = null
  receiptData.value = []
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

// Close export menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    exportMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchUsers()
  fetchPaymentMethods()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<!-- <style scoped>
/* Button hover effects */
.transition-all {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Export menu animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .flex-col>div {
    width: 100%;
  }

  .flex-col>div+div {
    margin-top: 1rem;
  }
}

/* Table styling improvements */
.table-auto {
  table-layout: auto;
}

.border-collapse {
  border-collapse: collapse;
}

/* Styles for report HTML content */
:deep(.report-html-container) {
  width: 100%;
}

:deep(.report-html-container table) {
  width: 100%;
  border-collapse: collapse;
}

:deep(.report-html-container th),
:deep(.report-html-container td) {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
}

:deep(.report-html-container .report-container) {
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}

:deep(.report-html-container .results-table) {
  font-size: 12px;
}

/* Dark mode adaptations */
.dark :deep(.report-html-container) {
  color: #e5e7eb;
}

.dark :deep(.report-html-container .report-container) {
  background-color: transparent;
}

.dark :deep(.report-html-container th),
.dark :deep(.report-html-container td) {
  border-color: #4b5563;
  color: #e5e7eb;
}

/* Button group styling */
.button-group {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .button-group {
    flex-direction: column;
  }
}

/* Loading animation improvements */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Export dropdown shadow */
.export-dropdown {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark .export-dropdown {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

/* Success/Error notifications */
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  z-index: 50;
  max-width: 400px;
}

.notification-success {
  background-color: #10b981;
  color: white;
}

.notification-error {
  background-color: #ef4444;
  color: white;
}

.notification-info {
  background-color: #3b82f6;
  color: white;
}

/* Styles pour les bordures en pointillés */
.border-dashed {
  border-style: dashed;
}

/* Styles spécifiques pour l'alignement des totaux */
.total-row {
  border-top: 2px dashed #6b7280;
}

.grand-total-row {
  border-top: 2px solid #374151;
  background-color: #f3f4f6;
}

.dark .grand-total-row {
  background-color: #374151;
}

/* Styles spécifiques pour les bordures du tableau */
:deep(.report-html-container table) {
  border-collapse: collapse;
  width: 100%;
}

:deep(.report-html-container th),
:deep(.report-html-container td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
}
</sty -->le>