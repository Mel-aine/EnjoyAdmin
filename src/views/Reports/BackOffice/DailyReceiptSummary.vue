<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('Daily Receipt Summary Reports') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage daily receipt summary
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Receipt From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Receipt From
            </label>
            <InputDatepicker 
              v-model="filters.receiptFrom" 
              :placeholder="'DD/MM/YYYY'"
              class="w-full"
              @update:modelValue="updateDateFilter('fromDate', $event)"
            ></InputDatepicker>
          </div>
          
          <!-- To Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.receiptTo" 
              :placeholder="'DD/MM/YYYY'"
              class="w-full"
              @update:modelValue="updateDateFilter('toDate', $event)"
            ></InputDatepicker>
          </div>
          
          <!-- Received By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Received By
            </label>
            <SelectComponent 
              v-model="filters.receivedBy"
              :options="receivedByOptions"
              :placeholder="'-- Select User --'"
              class="w-full"
            ></SelectComponent>
          </div>
          
          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <SelectComponent 
              v-model="filters.paymentMethod"
              :options="paymentMethodOptions"
              :placeholder="'-- Select Payment Method --'"
              class="w-full"
            ></SelectComponent>
          </div>
          
          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <SelectComponent 
              v-model="filters.currency"
              :options="currencyOptions"
              :placeholder="'-- Select Currency --'"
              class="w-full"
            ></SelectComponent>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <!-- Export Button with Dropdown -->
          <div class="relative">
            <button
              @click="toggleExportMenu"
              :disabled="exportLoading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24 transition-all duration-200 hover:shadow-md"
            >
              <svg v-if="exportLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!exportLoading">Export</span>
              <svg v-if="!exportLoading" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Export Dropdown Menu -->
            <div v-if="exportMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <button 
                @click="exportCSV" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                CSV
              </button>
              <button 
                @click="exportPDF" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button 
                @click="exportExcel" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
          </div>
          
          <!-- Report Button -->
          <button 
            @click="generateReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24 transition-all duration-200 hover:shadow-md"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Report
          </button>
          
          <!-- Reset Button -->
          <button 
            @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24 transition-all duration-200 hover:shadow-md"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      <!-- Results Section avec le nouveau style -->
      <div v-if="showResults" class="report-container bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
        
        <!-- Report Header avec le style du template -->
        <div class="report-header px-6 py-3 border-b border-gray-300 dark:border-gray-600">
          <div class="hotel-name text-lg font-bold text-darkblue dark:text-blue-300">
            {{ reportData?.hotelDetails?.hotelName || 'Suita Hotel' }}
          </div>
          <div class="report-title text-md font-bold text-dark-red dark:text-red-400">
            Daily Receipt Summary
          </div>
        </div>

        <!-- Date Range avec le style du template -->
        <div class="date-range px-6 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600">
          <strong>Date From:</strong> {{ reportData?.dateRange?.fromDate || filters.receiptFrom }} 
          <strong>To:</strong> {{ reportData?.dateRange?.toDate || filters.receiptTo }}
        </div>

        <!-- Si le rapport contient du HTML, l'afficher -->
        <div v-if="reportData?.html" v-html="reportData.html" class="report-html-container"></div>

        <!-- Sinon, afficher les données avec le nouveau style -->
        <div v-else class="px-6 py-4">
          <!-- User Sections -->
          <div v-for="(userSummary, index) in reportData?.userSummaries" :key="index" class="user-section mb-6">
            <table class="w-full border-collapse text-xs border-t border-gray-300 dark:border-gray-600">
              <thead class="border-b border-t-0 border-black">
              <tr>
                <th class="w-1/4 text-left p-2 bg-gray-50 dark:bg-gray-700">Pay Method</th>
                <th class="w-1/6 text-center p-2 bg-gray-50 dark:bg-gray-700">Tran. Count</th>
                <th class="w-1/5 text-right p-2 bg-gray-50 dark:bg-gray-700">Amount</th>
                <th class="w-1/6 text-center p-2 bg-gray-50 dark:bg-gray-700">Void Count</th>
                <th class="w-1/5 text-right p-2 bg-gray-50 dark:bg-gray-700">Void Amount</th>
                <th class="w-1/5 text-right p-2 bg-gray-50 dark:bg-gray-700">Total ({{ currency }})</th>
              </tr>
              </thead>
              <tbody>
                <!-- User Name Row -->
                <tr class="user-name-row">
                  <td colspan="6" class="p-2 font-bold border-none">User: {{ userSummary.userName }}</td>
                </tr>
                
                <!-- Payment Methods -->
                <tr v-for="(paymentMethod, pmIndex) in userSummary.paymentMethods" :key="pmIndex" class="payment-method-row">
                  <td class="p-2 border-none">{{ paymentMethod.methodName }}</td>
                  <td class="p-2 text-center border-none">{{ paymentMethod.totalTransactions }}</td>
                  <td class="p-2 text-right border-none font-mono">{{ formatCurrency(paymentMethod.amount) }}</td>
                  <td class="p-2 text-center border-none">{{ paymentMethod.totalVoid }}</td>
                  <td class="p-2 text-right border-none font-mono">{{ formatCurrency(paymentMethod.voidAmount) }}</td>
                  <td class="p-2 text-right border-none font-mono">{{ formatCurrency(paymentMethod.total) }}</td>
                </tr>
                
                <!-- User Total -->
                <tr class="user-total-row bg-gray-50 dark:bg-gray-700 font-bold">
                  <td class="p-2 border-none text-sm">User Total</td>
                  <td class="p-2 text-center border-t border-b border-dotted border-gray-400 dark:border-gray-500 text-sm">{{ userSummary.totalTransactions }}</td>
                  <td class="p-2 text-right border-none font-mono text-sm"></td>
                  <td class="p-2 text-center border-t border-b border-dotted border-gray-400 dark:border-gray-500 text-sm">{{ userSummary.totalVoid }}</td>
                  <td class="p-2 text-right border-none font-mono text-sm"></td>
                  <td class="p-2 text-right border-t border-b border-dotted border-gray-400 dark:border-gray-500 font-mono text-sm">{{ formatCurrency(userSummary.userTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Grand Total -->
          <table class="w-full mt-4">
            <tbody>
              <tr class="grand-total-row bg-gray-100 dark:bg-gray-600 font-bold">
                <td class="w-1/4 p-2 border-none text-sm">Grand Total</td>
                <td class="w-1/6 p-2 text-center border-t border-b border-dotted border-gray-400 dark:border-gray-500 text-sm">
                  {{ reportData?.grandTotals?.totalTransactions || 0 }}
                </td>
                <td class="w-1/5 p-2 text-right border-none font-mono text-sm">
                  {{ formatCurrency(reportData?.grandTotals?.totalAmount || 0) }}
                </td>
                <td class="w-1/6 p-2 text-center border-t border-b border-dotted border-gray-400 dark:border-gray-500 text-sm">
                  {{ reportData?.grandTotals?.totalVoid || 0 }}
                </td>
                <td class="w-1/5 p-2 text-right border-none font-mono text-sm">
                  {{ formatCurrency(reportData?.grandTotals?.voidAmount || 0) }}
                </td>
                <td class="w-1/5 p-2 text-right border-t border-b border-dotted border-gray-400 dark:border-gray-500 font-mono text-sm">
                  {{ formatCurrency(reportData?.grandTotals?.netTotal || 0) }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Summary Section avec le nouveau style -->
          <div class="summary-section mt-6 pt-4">
            <div class="summary-title-container flex justify-center">
              <div class="summary-title font-bold text-sm mb-3">Summary</div>
            </div>
            
            <div class="summary-tables flex gap-8 justify-center">
              <!-- User Summary -->
              <div class="summary-table-container">
                <table class="summary-table border-collapse text-xs min-w-[200px]">
                  <thead>
                    <tr>
                      <th colspan="2" class="text-center p-3 bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-600">User</th>
                      <th class="text-right p-3 bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-600">Amount ({{ currency }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(userSum, index) in reportData?.summary?.userSummary" :key="index">
                      <td colspan="2" class="p-2 border-none">{{ userSum.userName }}</td>
                      <td class="p-2 text-right border-none font-mono">{{ formatCurrency(userSum.netTotal) }}</td>
                    </tr>
                    <tr class="summary-grand-total bg-gray-100 dark:bg-gray-600 font-bold">
                      <td colspan="2" class="p-2 border-none">Grand Total</td>
                      <td class="p-2 text-right border-t border-b border-dotted border-gray-400 dark:border-gray-500 font-mono">
                        {{ formatCurrency(reportData?.summary?.grandTotalUserSummary?.netTotal || 0) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Payment Method Summary -->
              <div class="summary-table-container">
                <table class="summary-table border-collapse text-xs min-w-[200px]">
                  <thead>
                    <tr>
                      <th class="text-left p-3 bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-600">Pay Method</th>
                      <th class="text-right p-3 bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-600">Amount ({{ currency }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(methodSum, index) in reportData?.summary?.paymentMethodSummary" :key="index">
                      <td class="p-2 border-none">{{ methodSum.methodName }}</td>
                      <td class="p-2 text-right border-none font-mono">{{ formatCurrency(methodSum.total) }}</td>
                    </tr>
                    <tr class="summary-grand-total bg-gray-100 dark:bg-gray-600 font-bold">
                      <td class="p-2 border-none">Grand Total</td>
                      <td class="p-2 text-right border-t border-b border-dotted border-gray-400 dark:border-gray-500 font-mono">
                        {{ formatCurrency(reportData?.summary?.grandTotalPaymentMethodSummary?.netTotal || 0) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
import { generateDailyReceiptSummary, exportData, generateDailyReceiptSummaryPdf, type DailyReceipt } from '@/services/reportsApi'
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
  summary: {
    userSummary: any[];
    paymentMethodSummary: any[];
    grandTotalUserSummary: any;
    grandTotalPaymentMethodSummary: any;
  };
  html?: string;
  title?: string;
  generatedAt?: string;
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

const reportTitle = computed(() => {
  return reportData.value?.title || 'Daily Receipt Summary Report'
})

const currency = computed(() => {
  return 'XAF' // Vous pouvez le rendre dynamique si nécessaire
})

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
    console.log('Generating daily receipt summary report with filters:', apiFilters.value)
    const response = await generateDailyReceiptSummary(apiFilters.value)
    console.log('API Response:', response)
    
    if (response && response.success && response.data) {
      reportData.value = response.data
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating report:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to generate report'
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    const result = await exportData('csv', 'dailyReceiptSummary', 'daily-receipt-summary', apiFilters.value)
    console.log('CSV export result:', result)
  } catch (error) {
    console.error('CSV export error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to export CSV'
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
    const newPdfUrl = await generateDailyReceiptSummaryPdf(apiFilters.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Daily receipt report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating daily receipt report:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to generate PDF'
  } finally {
    exportLoading.value = false
  }
}

const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel with filters:', apiFilters.value)
    const result = await exportData('excel', 'dailyReceiptSummary', 'daily-receipt-summary', apiFilters.value)
    console.log('Excel export result:', result)
  } catch (error) {
    console.error('Excel export error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to export Excel'
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
  errorMessage.value = ''
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
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

<style scoped>
/* Styles spécifiques pour appliquer le design du template */

.report-container {
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
}

.dark .report-container {
  background-color: #1f2937;
  border-color: #374151;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 12px 24px;
  border-bottom: 1px solid #333;
}

.dark .report-header {
  border-bottom-color: #6b7280;
}

.hotel-name {
  font-size: 18px;
  font-weight: bold;
  color: darkblue;
}

.dark .hotel-name {
  color: #93c5fd;
}

.report-title {
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
  color: #a52a2a; /* Rouge bordeau plus clair */
}

.dark .report-title {
  color: #f87171; /* Rouge plus clair pour le mode sombre */
}

.date-range {
  font-size: 12px;
  margin-top: 0;
  border-top: 1px solid #333;
  padding: 8px 24px;
}

.dark .date-range {
  border-color: #6b7280;
}

.date-range strong {
  font-weight: bold;
}

.user-section {
  margin-bottom: 20px;
}

.user-name-row td {
  padding: 6px 8px;
  font-weight: bold;
  border: none;
}

.payment-method-row td {
  border: none;
}

.user-total-row {
  font-weight: bold;
  background-color: #f9f9f9;
}

.dark .user-total-row {
  background-color: #374151;
}

.user-total-row td {
  border: none;
  font-size: 11px; /* Police réduite pour Grand Total */
}

.grand-total-row {
  font-weight: bold;
  background-color: #f0f0f0;
}

.dark .grand-total-row {
  background-color: #4b5563;
}

.grand-total-row td {
  font-size: 11px; /* Police réduite pour Grand Total */
}

.summary-section {
  margin-top: 20px;
  padding-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-title {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 10px;
  text-align: left;
  padding-left: 0;
  width: fit-content;
}

.summary-tables {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin: 0 auto;
  width: fit-content;
}

.summary-table-container {
  flex: 0 0 auto;
}

.summary-table {
  border-collapse: collapse;
  font-size: 11px;
  border: none;
  min-width: 200px;
}

.summary-table th {
  background-color: #f5f5f5;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  padding: 6px 12px;
  text-align: left;
  font-weight: bold;
  white-space: nowrap;
}

.dark .summary-table th {
  background-color: #374151;
  border-color: #6b7280;
}

.summary-table td {
  border: none;
  padding: 5px 12px;
  white-space: nowrap;
}

.summary-grand-total {
  font-weight: bold;
  background-color: #f0f0f0;
}

.dark .summary-grand-total {
  background-color: #4b5563;
}

/* Styles pour les colonnes de montant avec police monospace */
.amount-column {
  text-align: right;
  font-family: 'Courier New', monospace;
}

/* Couleur rouge bordeau plus clair */
.text-dark-red {
  color: #a52a2a;
}

/* Adaptation responsive */
@media (max-width: 768px) {
  .summary-tables {
    flex-direction: column;
    gap: 15px;
  }
  
  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .report-title {
    margin-left: 0;
  }
}

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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Table styling */
.border-dotted {
  border-style: dotted;
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
  
  .flex-col > div {
    width: 100%;
  }
  
  .flex-col > div + div {
    margin-top: 1rem;
  }
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
  0%, 100% {
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
</style>