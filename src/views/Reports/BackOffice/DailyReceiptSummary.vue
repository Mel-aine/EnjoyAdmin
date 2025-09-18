<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.dailyReceiptSummary') }}
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
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
        <!-- Report Header with Hotel Name and Title -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ reportData?.hotelDetails?.hotelName || 'Hotel Nihal' }}
            </h2>
            <div class="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700">
              <span class="font-semibold">Daily Receipt - Summary</span>
            </div>
            <div class="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span class="inline-block bg-red-200 dark:bg-red-800 px-3 py-1 rounded">
                Date From {{ reportData?.dateRange?.fromDate || filters.receiptFrom }} To {{ reportData?.dateRange?.toDate || filters.receiptTo }}
              </span>
            </div>
          </div>
        </div>

        <!-- Report Content HTML -->
        <div v-if="reportData?.html" v-html="reportData.html" class="report-html-container"></div>

        <!-- Fallback: Receipt Summary Table if no HTML -->
        <div v-else class="px-6 py-4">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Pay Method
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Tran. Count
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Amount
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Void Count
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Void Amount
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Total(Rs.)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800">
                <!-- User sections from API data -->
                <template v-for="(userSummary, index) in reportData?.userSummaries" :key="index">
                  <!-- User Header -->
                  <tr class="bg-gray-100 dark:bg-gray-700" :class="{ 'border-t-2 border-gray-300 dark:border-gray-500': index > 0 }">
                    <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600" colspan="6">
                      User: {{ userSummary.userName }}
                    </td>
                  </tr>
                  
                  <!-- Payment Methods for this user -->
                  <tr v-for="(paymentMethod, pmIndex) in userSummary.paymentMethods" :key="`${index}-${pmIndex}`"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {{ paymentMethod.methodName }}
                    </td>
                    <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {{ paymentMethod.totalTransactions }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {{ formatCurrency(paymentMethod.amount) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {{ paymentMethod.totalVoid }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {{ formatCurrency(paymentMethod.voidAmount) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {{ formatCurrency(paymentMethod.total) }}
                    </td>
                  </tr>
                  
                  <!-- User Total -->
                  <tr class="bg-gray-100 dark:bg-gray-700 border-t border-dotted border-gray-400">
                    <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      User Total
                    </td>
                    <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {{ userSummary.totalTransactions }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      -
                    </td>
                    <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      {{ userSummary.totalVoid }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                      -
                    </td>
                    <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white">
                      {{ formatCurrency(userSummary.userTotal) }}
                    </td>
                  </tr>
                </template>

                <!-- Grand Total -->
                <tr class="bg-gray-200 dark:bg-gray-600 font-bold border-t-2 border-gray-400 dark:border-gray-500">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    Grand Total
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ reportData?.grandTotals?.totalTransactions || 0 }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ reportData?.grandTotals?.totalVoid || 0 }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-blue-600 dark:text-blue-400 font-bold">
                    {{ formatCurrency(reportData?.grandTotals?.netTotal || 0) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Section -->
        <div v-if="reportData?.summary" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    User
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    Amount ( Rs )
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    Pay Method
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    Amount ( Rs )
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800">
                <!-- User Summary -->
                <template v-for="(userSum, index) in reportData.summary.userSummary" :key="`user-${index}`">
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      {{ userSum.userName }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      {{ formatCurrency(userSum.netTotal) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      <!-- Payment method data would go here if needed -->
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      <!-- Payment method amount would go here if needed -->
                    </td>
                  </tr>
                </template>

                <!-- Payment Method Summary -->
                <template v-for="(methodSum, index) in reportData.summary.paymentMethodSummary" :key="`method-${index}`">
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      <!-- Empty for payment method rows -->
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      <!-- Empty for payment method rows -->
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      {{ methodSum.methodName }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                      {{ formatCurrency(methodSum.total) }}
                    </td>
                  </tr>
                </template>
                
                <!-- Grand Total Row -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-400 dark:border-gray-500">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    Grand Total
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600">
                    {{ formatCurrency(reportData.summary.grandTotalUserSummary.netTotal) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    Grand Total
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600">
                    {{ formatCurrency(reportData.summary.grandTotalPaymentMethodSummary.netTotal) }}
                  </td>
                </tr>
              </tbody>
            </table>
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
import { generateDailyReceiptSummary, exportData, type DailyReceipt } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { getEmployeesForService } from '@/services/userApi'
import { getPaymentMethods } from '@/services/paymentMethodApi'
//import { getCurrencies } from '@/services/currencyApi'
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
const idHotel = serviceStore.serviceId

// Filters for UI
const filters = ref<Filters>({
  receiptFrom: '',
  receiptTo: '',
  receivedBy: '',
  paymentMethod: '',
  currency: ''
})

// API Filters
const apiFilters = ref<DailyReceipt>({
  fromDate: '',
  toDate: '',
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

/* const fetchCurrencies = async () => {
  try {
    const resp = await getCurrencies()
    currencyOptions.value = resp.data.data.map((c: any) => ({
      label: c.currencyName,
      value: c.id
    }))
  } catch (error) {
    console.error('Error fetching currencies:', error)
  }
} */

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
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV with filters:', apiFilters.value)
    const result = await exportData('csv', 'dailyReceiptSummary', 'daily-receipt-summary', apiFilters.value)
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

    console.log('Export PDF with filters:', apiFilters.value)
    const result = await exportData('pdf', 'dailyReceiptSummary', 'daily-receipt-summary', apiFilters.value)
    pdfUrl.value = result?.fileUrl || ''
    openPDFInNewPage()
    console.log('PDF export result:', result)
  } catch (error) {
    console.error('PDF export error:', error) 
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
  //fetchCurrencies()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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