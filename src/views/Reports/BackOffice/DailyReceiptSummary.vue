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

      <!-- Results Section -->
      <div v-if="showResults" class="report-container bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
        
        <!-- Report Header - Style du serveur -->
        <div class="report-header">
          <div class="hotel-name">
            {{ reportData?.hotelDetails?.hotelName || 'Suita Hotel' }}
          </div>
          <div class="report-title">
            Daily Receipt - Summary
          </div>
        </div>

        <!-- Date Range - Style du serveur -->
        <div class="date-range">
          <span><strong>From Date:</strong> {{ reportData?.dateRange?.fromDate || filters.receiptFrom }}</span>
          <span><strong>To Date:</strong> {{ reportData?.dateRange?.toDate || filters.receiptTo }}</span>
          <span><strong>Currency:</strong> {{ currency }}</span>
        </div>

        <div class="header-separator"></div>

        <!-- Si le rapport contient du HTML, l'afficher -->
        <div v-if="reportData?.html" v-html="reportData.html" class="report-html-container"></div>

        <!-- Sinon, afficher les données avec le nouveau style -->
        <div v-else class="report-content">
          <!-- User Sections -->
          <div v-for="(userSummary, index) in reportData?.userSummaries" :key="index" class="user-section">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="w-1/4 text-left">Pay Method</th>
                  <th class="w-1/6 text-center">Tran. Count</th>
                  <th class="w-1/5 text-right">Amount</th>
                  <th class="w-1/6 text-center">Void Count</th>
                  <th class="w-1/5 text-right">Void Amount</th>
                  <th class="w-1/5 text-right">Total ({{ currency }})</th>
                </tr>
              </thead>
              <tbody>
                <!-- User Name Row -->
                <tr class="user-name-row">
                  <td colspan="6">User: {{ userSummary.userName }}</td>
                </tr>
                
                <!-- Payment Methods -->
                <tr v-for="(paymentMethod, pmIndex) in userSummary.paymentMethods" :key="pmIndex" class="payment-method-row">
                  <td>{{ paymentMethod.methodName }}</td>
                  <td class="text-center">{{ paymentMethod.totalTransactions }}</td>
                  <td class="text-right amount-column">{{ formatCurrency(paymentMethod.amount) }}</td>
                  <td class="text-center">{{ paymentMethod.totalVoid }}</td>
                  <td class="text-right amount-column">{{ formatCurrency(paymentMethod.voidAmount) }}</td>
                  <td class="text-right amount-column">{{ formatCurrency(paymentMethod.total) }}</td>
                </tr>
                
                <!-- User Total -->
                <tr class="user-total-row">
                  <td><strong>User Total</strong></td>
                  <td class="text-center"><strong>{{ userSummary.totalTransactions }}</strong></td>
                  <td class="text-right amount-column"><strong></strong></td>
                  <td class="text-center"><strong>{{ userSummary.totalVoid }}</strong></td>
                  <td class="text-right amount-column"><strong></strong></td>
                  <td class="text-right amount-column"><strong>{{ formatCurrency(userSummary.userTotal) }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Grand Total -->
          <table class="data-table grand-total-table">
            <tbody>
              <tr class="grand-total-row">
                <td class="w-1/4"><strong>Grand Total</strong></td>
                <td class="w-1/6 text-center"><strong>{{ reportData?.grandTotals?.totalTransactions || 0 }}</strong></td>
                <td class="w-1/5 text-right amount-column"><strong>{{ formatCurrency(reportData?.grandTotals?.totalAmount || 0) }}</strong></td>
                <td class="w-1/6 text-center"><strong>{{ reportData?.grandTotals?.totalVoid || 0 }}</strong></td>
                <td class="w-1/5 text-right amount-column"><strong>{{ formatCurrency(reportData?.grandTotals?.voidAmount || 0) }}</strong></td>
                <td class="w-1/5 text-right amount-column"><strong>{{ formatCurrency(reportData?.grandTotals?.netTotal || 0) }}</strong></td>
              </tr>
            </tbody>
          </table>

          <!-- Summary Section -->
          <div class="summary-section">
            <div class="summary-title">Summary</div>
            
            <div class="summary-tables">
              <!-- User Summary -->
              <div class="summary-table-container">
                <table class="summary-table">
                  <thead>
                    <tr>
                      <th colspan="2" class="text-center">User</th>
                      <th class="text-right">Amount ({{ currency }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(userSum, index) in reportData?.summary?.userSummary" :key="index">
                      <td colspan="2">{{ userSum.userName }}</td>
                      <td class="text-right amount-column">{{ formatCurrency(userSum.netTotal) }}</td>
                    </tr>
                    <tr class="summary-grand-total">
                      <td colspan="2"><strong>Grand Total</strong></td>
                      <td class="text-right amount-column"><strong>{{ formatCurrency(reportData?.summary?.grandTotalUserSummary?.netTotal || 0) }}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Payment Method Summary -->
              <div class="summary-table-container">
                <table class="summary-table">
                  <thead>
                    <tr>
                      <th class="text-left">Pay Method</th>
                      <th class="text-right">Amount ({{ currency }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(methodSum, index) in reportData?.summary?.paymentMethodSummary" :key="index">
                      <td>{{ methodSum.methodName }}</td>
                      <td class="text-right amount-column">{{ formatCurrency(methodSum.total) }}</td>
                    </tr>
                    <tr class="summary-grand-total">
                      <td><strong>Grand Total</strong></td>
                      <td class="text-right amount-column"><strong>{{ formatCurrency(reportData?.summary?.grandTotalPaymentMethodSummary?.netTotal || 0) }}</strong></td>
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
  return 'XAF'
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

    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

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
/* ===== REPORT CONTAINER ===== */
.report-container {
  padding: 0px 15px 15px 15px;
  background-color: white;
  font-size: 11px;
}

.dark .report-container {
  background-color: #1f2937;
}

/* ===== REPORT HEADER - Style du serveur ===== */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  padding-bottom: 2px;
  margin-bottom: 3px;
}

.dark .report-header {
  border-bottom-color: #6b7280;
}

.hotel-name {
  font-weight: bold;
  color: #00008B;
  font-size: 13px;
}

.dark .hotel-name {
  color: #93c5fd;
}

.report-title {
  font-size: 13px;
  color: #8B0000;
  font-weight: bold;
}

.dark .report-title {
  color: #f87171;
}

/* ===== DATE RANGE - Style du serveur ===== */
.date-range {
  font-size: 10px;
  margin-bottom: 8px;
}

.dark .date-range {
  color: #e5e7eb;
}

.date-range span {
  margin-right: 10px;
}

.date-range strong {
  font-weight: bold;
}

.header-separator {
  border-top: 1px solid #333;
  margin: 0 0 8px 0;
}

.dark .header-separator {
  border-color: #6b7280;
}

/* ===== REPORT CONTENT ===== */
.report-content {
  padding: 0;
}

/* ===== USER SECTIONS ===== */
.user-section {
  margin-bottom: 15px;
}

/* ===== DATA TABLES ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 5px;
}

.data-table th {
  background-color: white;
  border-top: none;
  border-bottom: 1px solid #333;
  padding: 4px 8px;
  text-align: left;
  font-weight: bold;
  font-size: 12px;
}

.dark .data-table th {
  background-color: #1f2937;
  border-color: #e5e7eb;
  color: #e5e7eb;
}

.data-table td {
  padding: 3px 8px;
  font-size: 12px;
  border: none;
}

.dark .data-table td {
  color: #e5e7eb;
}

.data-table th.text-right,
.data-table td.text-right {
  text-align: right;
}

.data-table th.text-center,
.data-table td.text-center {
  text-align: center;
}

/* ===== USER NAME ROW ===== */
.user-name-row td {
  padding: 5px 8px;
  font-weight: bold;
  border: none;
}

/* ===== PAYMENT METHOD ROWS ===== */
.payment-method-row td {
  border: none;
}

/* ===== USER TOTAL ROW ===== */
.user-total-row {
  font-weight: bold;
  background-color: white;
}

.dark .user-total-row {
  background-color: #1f2937;
}

.user-total-row td {
  border: none;
  padding: 3px 8px;
}

/* Bordures pointillées sur Tran. Count, Void Count et Total uniquement */
.user-total-row td:nth-child(2),
.user-total-row td:nth-child(4),
.user-total-row td:nth-child(6) {
  border-top: 1px dotted #333;
  border-bottom: 1px dotted #333;
}

.dark .user-total-row td:nth-child(2),
.dark .user-total-row td:nth-child(4),
.dark .user-total-row td:nth-child(6) {
  border-color: #e5e7eb;
}

/* ===== GRAND TOTAL ===== */
.grand-total-table {
  margin-top: 5px;
}

.grand-total-row {
  font-weight: bold;
  background-color: white;
}

.dark .grand-total-row {
  background-color: #1f2937;
}

.grand-total-row td {
  padding: 5px 8px;
  border: none;
}

/* Bordures pointillées sur Tran. Count, Void Count et Total uniquement */
.grand-total-row td:nth-child(2),
.grand-total-row td:nth-child(4),
.grand-total-row td:nth-child(6) {
  border-top: 1px dotted #333;
  border-bottom: 1px dotted #333;
}

.dark .grand-total-row td:nth-child(2),
.dark .grand-total-row td:nth-child(4),
.dark .grand-total-row td:nth-child(6) {
  border-color: #e5e7eb;
}

/* ===== SUMMARY SECTION ===== */
.summary-section {
  margin-top: 15px;
  padding-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-title {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
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
  font-size: 12px;
  border: none;
  min-width: 200px;
}

.summary-table th {
  background-color: white;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  padding: 5px 12px;
  text-align: left;
  font-weight: bold;
  white-space: nowrap;
  font-size: 12px;
}

.dark .summary-table th {
  background-color: #1f2937;
  border-color: #e5e7eb;
  color: #e5e7eb;
}

.summary-table td {
  border: none;
  padding: 4px 12px;
  white-space: nowrap;
  font-size: 12px;
}

.dark .summary-table td {
  color: #e5e7eb;
}

.summary-grand-total {
  font-weight: bold;
  background-color: white;
}

.dark .summary-grand-total {
  background-color: #1f2937;
}

.summary-grand-total td:last-child {
  border-top: 1px dotted #333;
  border-bottom: 1px dotted #333;
}

.dark .summary-grand-total td:last-child {
  border-color: #e5e7eb;
}

/* ===== AMOUNT COLUMN ===== */
.amount-column {
  text-align: right;
  font-family: 'Courier New', monospace;
}

/* ===== RESPONSIVE DESIGN ===== */
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

/* ===== BUTTON STYLES ===== */
.transition-all {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* ===== EXPORT MENU ===== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== REPORT HTML CONTAINER ===== */
:deep(.report-html-container) {
  width: 100%;
  padding: 0;
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

.dark :deep(.report-html-container th),
.dark :deep(.report-html-container td) {
  border-color: #4b5563;
  color: #e5e7eb;
}

:deep(.report-html-container .report-container) {
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}

.dark :deep(.report-html-container .report-container) {
  background-color: transparent;
}

:deep(.report-html-container .results-table) {
  font-size: 12px;
}

.dark :deep(.report-html-container) {
  color: #e5e7eb;
}

/* ===== LOADING ANIMATION ===== */
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

/* ===== EXPORT DROPDOWN ===== */
.export-dropdown {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark .export-dropdown {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

/* ===== NO DATA MESSAGE ===== */
.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.dark .no-data {
  color: #9ca3af;
}

/* ===== SCROLLBAR STYLING ===== */
.report-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.report-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dark .report-container::-webkit-scrollbar-track {
  background: #374151;
}

.report-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.report-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark .report-container::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .report-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ===== PRINT STYLES ===== */
@media print {
  .report-container {
    padding: 0;
    box-shadow: none;
    border: none;
  }
  
  .dark .report-container {
    background-color: white;
    color: black;
  }
  
  .hotel-name {
    color: #00008B !important;
  }
  
  .report-title {
    color: #8B0000 !important;
  }
  
  .data-table th {
    background-color: white !important;
    color: black !important;
  }
  
  .user-total-row,
  .grand-total-row,
  .summary-grand-total {
    background-color: white !important;
    color: black !important;
  }
  
  .summary-table th {
    background-color: white !important;
    color: black !important;
  }
}
</style>