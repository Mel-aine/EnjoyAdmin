<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('Daily Receipt Summary Reports') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('viewAndManageDailyReceiptSummary') }}
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
            <InputDatepicker 
              v-model="filters.receiptFrom" 
              :placeholder="$t('dateFormat')"
              class="w-full"
              @update:modelValue="updateDateFilter('fromDate', $event)"
            ></InputDatepicker>
          </div>
          
          <!-- To Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('To') }}
            </label>
            <InputDatepicker 
              v-model="filters.receiptTo" 
              :placeholder="$t('dateFormat')"
              class="w-full"
              @update:modelValue="updateDateFilter('toDate', $event)"
            ></InputDatepicker>
          </div>
          
          <!-- Received By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('receivedBy') }}
            </label>
            <SelectComponent 
              v-model="filters.receivedBy"
              :options="receivedByOptions"
              :placeholder="$t('select')"
              class="w-full"
            ></SelectComponent>
          </div>
          
          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Payment Method') }}
            </label>
            <SelectComponent 
              v-model="filters.paymentMethod"
              :options="paymentMethodOptions"
              :placeholder="$t('select')"
              class="w-full"
            ></SelectComponent>
          </div>
          
          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Currency') }}
            </label>
            <SelectComponent 
              v-model="filters.currency"
              :options="currencyOptions"
              :placeholder="$t('select')"
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
              <span v-if="!exportLoading">{{ $t('export') }}</span>
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
            {{ $t('Report') }}
          </button>
          
          <!-- Reset Button -->
          <button 
            @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24 transition-all duration-200 hover:shadow-md"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('Reset') }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700 px-4 py-3">
        
        <!-- Report Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-800 dark:border-gray-400 pb-1 mb-1">
          <div class="text-base font-bold text-blue-800 dark:text-blue-300">
            {{ reportData?.hotelDetails?.hotelName || $t('hotelName') }}
          </div>
          <div class="text-base text-red-800 dark:text-red-400 font-bold">
            {{ $t('dailyReceiptSummary') }}
          </div>
        </div>

        <!-- Date Range -->
        <div class="text-sm mb-2 space-x-3 text-gray-900 dark:text-gray-100">
          <span><strong class="font-semibold">{{ $t('fromDate') }}:</strong> {{ reportData?.dateRange?.fromDate || filters.receiptFrom }}</span>
          <span><strong class="font-semibold">{{ $t('toDate') }}:</strong> {{ reportData?.dateRange?.toDate || filters.receiptTo }}</span>
          <span><strong class="font-semibold">{{ $t('Currency') }}:</strong> {{ currency }}</span>
        </div>

        <div class="border-t border-gray-800 dark:border-gray-400 mb-2"></div>

        <!-- Si le rapport contient du HTML, l'afficher -->
        <div v-if="reportData?.html" v-html="reportData.html" class="w-full"></div>

        <!-- Sinon, afficher les données avec Tailwind -->
        <div v-else class="w-full">
          <!-- User Sections -->
          <div v-for="(userSummary, index) in reportData?.userSummaries" :key="index" class="mb-4">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr class="bg-white dark:bg-gray-800">
                  <th class="w-1/4 text-left border-b border-gray-800 dark:border-gray-300 px-2 py-1 font-bold text-gray-900 dark:text-gray-100">{{ $t('payMethod') }}</th>
                  <th class="w-1/6 text-center border-b border-gray-800 dark:border-gray-300 px-2 py-1 font-bold text-gray-900 dark:text-gray-100">{{ $t('tranCount') }}</th>
                  <th class="w-1/5 text-right border-b border-gray-800 dark:border-gray-300 px-2 py-1 font-bold text-gray-900 dark:text-gray-100">{{ $t('Amount') }}</th>
                  <th class="w-1/6 text-center border-b border-gray-800 dark:border-gray-300 px-2 py-1 font-bold text-gray-900 dark:text-gray-100">{{ $t('voidCount') }}</th>
                  <th class="w-1/5 text-right border-b border-gray-800 dark:border-gray-300 px-2 py-1 font-bold text-gray-900 dark:text-gray-100">{{ $t('voidAmount') }}</th>
                  <th class="w-1/5 text-right border-b border-gray-800 dark:border-gray-300 px-2 py-1 font-bold text-gray-900 dark:text-gray-100">{{ $t('Total') }} ({{ currency }})</th>
                </tr>
              </thead>
              <tbody>
                <!-- User Name Row -->
                <tr class="bg-white dark:bg-gray-800">
                  <td colspan="6" class="px-2 py-1.5 font-bold text-gray-900 dark:text-gray-100">{{ $t('user') }}: {{ userSummary.userName }}</td>
                </tr>
                
                <!-- Payment Methods -->
                <tr v-for="(paymentMethod, pmIndex) in userSummary.paymentMethods" :key="pmIndex" class="bg-white dark:bg-gray-800">
                  <td class="px-2 py-0.5 text-gray-900 dark:text-gray-100">{{ paymentMethod.methodName }}</td>
                  <td class="text-center px-2 py-0.5 text-gray-900 dark:text-gray-100">{{ paymentMethod.totalTransactions }}</td>
                  <td class="text-right px-2 py-0.5 font-mono text-gray-900 dark:text-gray-100">{{ formatCurrency(paymentMethod.amount) }}</td>
                  <td class="text-center px-2 py-0.5 text-gray-900 dark:text-gray-100">{{ paymentMethod.totalVoid }}</td>
                  <td class="text-right px-2 py-0.5 font-mono text-gray-900 dark:text-gray-100">{{ formatCurrency(paymentMethod.voidAmount) }}</td>
                  <td class="text-right px-2 py-0.5 font-mono text-gray-900 dark:text-gray-100">{{ formatCurrency(paymentMethod.total) }}</td>
                </tr>
                
                <!-- User Total -->
                <tr class="bg-white dark:bg-gray-800 font-bold">
                  <td class="px-2 py-0.5 text-gray-900 dark:text-gray-100">{{ $t('userTotal') }}</td>
                  <td class="text-center px-2 py-0.5 border-t border-b border-dotted border-gray-800 dark:border-gray-300 text-gray-900 dark:text-gray-100">{{ userSummary.totalTransactions }}</td>
                  <td class="text-right px-2 py-0.5 font-mono text-gray-900 dark:text-gray-100"></td>
                  <td class="text-center px-2 py-0.5 border-t border-b border-dotted border-gray-800 dark:border-gray-300 text-gray-900 dark:text-gray-100">{{ userSummary.totalVoid }}</td>
                  <td class="text-right px-2 py-0.5 font-mono text-gray-900 dark:text-gray-100"></td>
                  <td class="text-right px-2 py-0.5 font-mono border-t border-b border-dotted border-gray-800 dark:border-gray-300 text-gray-900 dark:text-gray-100">{{ formatCurrency(userSummary.userTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Grand Total -->
          <table class="w-full border-collapse text-sm mt-1">
            <tbody>
              <tr class="bg-white dark:bg-gray-800 font-bold">
                <td class="w-1/4 px-2 py-1 text-gray-900 dark:text-gray-100">{{ $t('grandTotal') }}</td>
                <td class="w-1/6 text-center px-2 py-1  border-b border-dotted border-gray-800 dark:border-gray-300 text-gray-900 dark:text-gray-100">{{ reportData?.grandTotals?.totalTransactions || 0 }}</td>
                <td class="w-1/5 text-right px-2 py-1 font-mono text-gray-900 dark:text-gray-100"></td>
                <td class="w-1/6 text-center px-2 py-1  border-b border-dotted border-gray-800 dark:border-gray-300 text-gray-900 dark:text-gray-100">{{ reportData?.grandTotals?.totalVoid || 0 }}</td>
                <td class="w-1/5 text-right px-2 py-1 font-mono text-gray-900 dark:text-gray-100"></td>
                <td class="w-1/5 text-right px-2 py-1 font-mono border-b border-dotted border-gray-800 dark:border-gray-300 text-gray-900 dark:text-gray-100">{{ formatCurrency(reportData?.grandTotals?.netTotal || 0) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Summary Section -->
          <div class="mt-4 pt-3 w-full flex flex-col items-center">
            <div class="font-bold text-lg mb-4 text-center w-full text-gray-900 dark:text-gray-100">{{ $t('Summary') }}</div>
            
            <div class="flex flex-col md:flex-row gap-12 justify-center mx-auto w-auto">
              <!-- User Summary -->
              <div class="flex-shrink-0">
                <table class="border-collapse text-base border-0 min-w-72">
                  <thead>
                    <tr class="bg-white dark:bg-gray-800">
                      <th colspan="2" class="text-center border-t border-b border-gray-800 dark:border-gray-300 px-4 py-2 font-bold whitespace-nowrap text-gray-900 dark:text-gray-100">{{ $t('user') }}</th>
                      <th class="text-right border-t border-b border-gray-800 dark:border-gray-300 px-4 py-2 font-bold whitespace-nowrap text-gray-900 dark:text-gray-100">{{ $t('Amount') }} ({{ currency }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(userSum, index) in reportData?.summary?.userSummary" :key="index" class="bg-white dark:bg-gray-800">
                      <td colspan="2" class="px-4 py-1.5 whitespace-nowrap text-gray-900 dark:text-gray-100">{{ userSum.userName }}</td>
                      <td class="text-right px-4 py-1.5 font-mono whitespace-nowrap text-gray-900 dark:text-gray-100">{{ formatCurrency(userSum.netTotal) }}</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800 font-bold">
                      <td colspan="2" class="px-4 py-1.5 whitespace-nowrap text-gray-900 dark:text-gray-100">Grand Total</td>
                      <td class="text-right px-4 py-1.5 font-mono border-t border-b border-dotted border-gray-800 dark:border-gray-300 whitespace-nowrap text-gray-900 dark:text-gray-100">{{ formatCurrency(reportData?.summary?.grandTotalUserSummary?.netTotal || 0) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Payment Method Summary -->
              <div class="flex-shrink-0">
                <table class="border-collapse text-base border-0 min-w-72">
                  <thead>
                    <tr class="bg-white dark:bg-gray-800">
                      <th class="text-left border-t border-b border-gray-800 dark:border-gray-300 px-4 py-2 font-bold whitespace-nowrap text-gray-900 dark:text-gray-100">{{ $t('payMethod') }}</th>
                      <th class="text-right border-t border-b border-gray-800 dark:border-gray-300 px-4 py-2 font-bold whitespace-nowrap text-gray-900 dark:text-gray-100">{{ $t('Amount') }} ({{ currency }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(methodSum, index) in reportData?.summary?.paymentMethodSummary" :key="index" class="bg-white dark:bg-gray-800">
                      <td class="px-4 py-1.5 whitespace-nowrap text-gray-900 dark:text-gray-100">{{ methodSum.methodName }}</td>
                      <td class="text-right px-4 py-1.5 font-mono whitespace-nowrap text-gray-900 dark:text-gray-100">{{ formatCurrency(methodSum.total) }}</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800 font-bold">
                      <td class="px-4 py-1.5 whitespace-nowrap text-gray-900 dark:text-gray-100">Grand Total</td>
                      <td class="text-right px-4 py-1.5 font-mono border-t border-b border-dotted border-gray-800 dark:border-gray-300 whitespace-nowrap text-gray-900 dark:text-gray-100">{{ formatCurrency(reportData?.summary?.grandTotalPaymentMethodSummary?.netTotal || 0) }}</td>
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
  return reportData.value?.title || t('dailyReceiptSummaryReport')
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
    errorMessage.value = error instanceof Error ? error.message : t('failedToGenerateReport')
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
    errorMessage.value = error instanceof Error ? error.message : t('failedToExportCSV')
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
    const result = await exportData('excel', 'dailyReceiptSummary', 'daily-receipt-summary', apiFilters.value)
    console.log('Excel export result:', result)
  } catch (error) {
    console.error('Excel export error:', error)
    errorMessage.value = error instanceof Error ? error.message : t('failedToExportExcel')
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