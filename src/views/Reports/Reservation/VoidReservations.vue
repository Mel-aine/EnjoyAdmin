<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Void Reservations
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Cancellation Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Void From
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              placeholder="From"
              class="w-full"
              @update:modelValue="updateDateFilter('startDate', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Void To
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              placeholder="To"
              class="w-full"
              @update:modelValue="updateDateFilter('endDate', $event)"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
          <!-- Export Button with dropdown -->
          <div class="relative">
            <button
              @click="toggleExportMenu"
              :disabled="exportLoading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <svg v-if="exportLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!exportLoading">Export</span>
              <svg v-if="!exportLoading" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Export Dropdown Menu -->
            <div v-if="exportMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <button 
                @click="exportCSV" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                CSV
              </button>
              <button 
                @click="exportPDF" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button 
                @click="exportExcel" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
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
            @click="generateVoidReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Report
          </button>
          
          <!-- Reset Button -->
          <button 
            @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      <!-- Results Table or HTML Report -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Report header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ reportData?.title || 'Void Reservations Results' }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>Generated: {{ reportData?.generatedAt ? formatDate(reportData.generatedAt) : '' }}</span>
          </div>
        </div>
        
        <!-- HTML Report Content -->
        <div v-if="reportData?.html" v-html="reportData.html" class="report-html-container"></div>
        
        <!-- Fallback if no HTML (normal table display) -->
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th v-for="column in tableColumns" :key="column.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in tableDataWithRemarks" :key="index" :class="{'bg-gray-50 dark:bg-gray-700': item.isRemarkRow}">
                  <td v-for="column in tableColumns" :key="column.key" class="px-6 py-4 whitespace-nowrap text-sm" :class="{'font-medium text-gray-700 dark:text-gray-300': item.isRemarkRow, 'text-gray-900 dark:text-white': !item.isRemarkRow}">
                    <template v-if="column.key === 'resNo'">
                      <div :class="{'italic': item.isRemarkRow}">
                        {{ item[column.key] }}
                      </div>
                    </template>
                    <template v-else-if="column.key === 'bookingDate'">
                      <div v-if="item.isRemarkRow" class="text-gray-600 dark:text-gray-400 italic">
                        {{ item[column.key] }}
                      </div>
                      <div v-else>
                        {{ item[column.key] }}
                      </div>
                    </template>
                    <template v-else>
                      {{ item[column.key] }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Total Row -->
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
              <div>Total Cancelled Reservations: {{ totalReservations }}</div>
              <div class="flex gap-4">
                <div>ADR: {{ totalADR }}</div>
                <div>Car Revenue: {{ totalCarRevenue }}</div>
                <div>Charges: {{ totalCharges }}</div>
                <div>Paid: {{ totalPaid }}</div>
                <div>Balance: {{ totalBalance }}</div>
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
import { generateVoidList, type ReportFilters, exportData } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const serviceStore = useServiceStore()
const router = useRouter()
const idHotel = serviceStore.serviceId

interface FilterOptions {
  value: string;
  label: string;
}

interface Reservation {
  resNo: string;
  bookingDate: string;
  guest: string;
  rateType: string;
  arrival: string;
  departure: string;
  folioNo: string;
  adr: string;
  carRevenue: string;
  charges: string;
  paid: string;
  balance: string;
  source: string;
  cancelledBy: string;
  cancelledDate: string;
  remarks?: string;
}

interface TableRow {
  id: string;
  resNo: string;
  bookingDate: string;
  guest: string;
  rateType: string;
  arrival: string;
  departure: string;
  folioNo: string;
  adr: string;
  carRevenue: string;
  charges: string;
  paid: string;
  balance: string;
  source: string;
  cancelledBy: string;
  cancelledDate: string;
  isRemarkRow?: boolean;
  [key: string]: string | boolean | undefined;
}

interface ReportData {
  title: string;
  html: string;
  generatedAt: string;
  filters: any;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)
const reportData = ref<ReportData | null>(null)
const loading = ref<boolean>(false)
const exportMenuOpen = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const pdfUrl = ref('')

// API Filters
const apiFilters = ref<ReportFilters>({
  startDate: '',
  endDate: '',
  hotelId: idHotel !== null ? idHotel : undefined
})

// UI Filters (only the two date fields from the original code)
const filters = ref({
  arrivalFrom: '',
  arrivalTo: ''
})

// Table columns configuration
type ColumnType = "custom" | "image" | "text" | "date" | "email" | "badge" | undefined;

interface TableColumn {
  key: string;
  label: string;
  type?: ColumnType;
}

const tableColumns = computed<TableColumn[]>(() => [
  { key: 'resNo', label: t('reports.reservation.columns.resNo'), type: 'custom' },
  { key: 'bookingDate', label: t('reports.reservation.columns.bookingDate'), type: 'custom' },
  { key: 'guest', label: t('reports.reservation.columns.guest'), type: 'custom' },
  { key: 'rateType', label: t('reports.reservation.columns.rateType'), type: 'custom' },
  { key: 'arrival', label: t('reports.reservation.columns.arrival'), type: 'custom' },
  { key: 'departure', label: t('reports.reservation.columns.departure'), type: 'custom' },
  { key: 'folioNo', label: t('reports.reservation.columns.folioNo'), type: 'custom' },
  { key: 'adr', label: t('reports.reservation.columns.adr'), type: 'custom' },
  { key: 'carRevenue', label: t('reports.reservation.columns.carRevenue'), type: 'custom' },
  { key: 'charges', label: t('reports.reservation.columns.charges'), type: 'custom' },
  { key: 'paid', label: t('reports.reservation.columns.paid'), type: 'custom' },
  { key: 'balance', label: t('reports.reservation.columns.balance'), type: 'custom' },
  { key: 'source', label: t('reports.reservation.columns.source'), type: 'custom' },
  { key: 'cancelledBy', label: t('reports.reservation.columns.cancelledBy'), type: 'custom' },
  { key: 'cancelledDate', label: t('reports.reservation.columns.cancelledDate'), type: 'custom' }
])

// Sample data for the table
const reservationData = ref<Reservation[]>([
  {
    resNo: 'BE205',
    bookingDate: '28/05/2019',
    guest: 'manual reservation',
    rateType: 'Continental Plan',
    arrival: '28/05',
    departure: '29/05',
    folioNo: 'FNH357',
    adr: '400.00',
    carRevenue: '0.00',
    charges: '0.00',
    paid: '0.00',
    balance: '0.00',
    source: 'Expedia',
    cancelledBy: 'admin',
    cancelledDate: '10/04/2020',
    remarks: t('reports.reservation.remarks.noArrival')
  },
  {
    resNo: 'BE306',
    bookingDate: '12/02/2020',
    guest: 'Mr. Danish Bhai',
    rateType: 'Breakfast',
    arrival: '24/04',
    departure: '26/04',
    folioNo: 'FNH554',
    adr: '593.25',
    carRevenue: '0.00',
    charges: '0.00',
    paid: '0.00',
    balance: '0.00',
    source: '',
    cancelledBy: 'admin',
    cancelledDate: '14/04/2020',
    remarks: t('reports.reservation.remarks.cancelTest')
  },
  {
    resNo: 'BE307',
    bookingDate: '06/04/2020',
    guest: 'Mr. BE Cancel Booking',
    rateType: 'European Plan 01',
    arrival: '06/04',
    departure: '07/04',
    folioNo: 'FNH570',
    adr: '1,096.90',
    carRevenue: '0.00',
    charges: '0.00',
    paid: '0.00',
    balance: '0.00',
    source: 'Internet Booking Engine',
    cancelledBy: 'nihal.shaikh@eze etechnologies.com',
    cancelledDate: '06/04/2020'
  },
  {
    resNo: 'BE312',
    bookingDate: '13/04/2020',
    guest: 'Mr. Inclusion Test',
    rateType: 'European Plan 01',
    arrival: '24/04',
    departure: '25/04',
    folioNo: 'FNH554',
    adr: '200.00',
    carRevenue: '0.00',
    charges: '0.00',
    paid: '0.00',
    balance: '0.00',
    source: '',
    cancelledBy: 'admin',
    cancelledDate: '14/04/2020',
    remarks: t('reports.reservation.remarks.cancelTest')
  }
])

// Table data with integrated remarks rows
const tableDataWithRemarks = computed(() => {
  const result: TableRow[] = []
  
  reservationData.value.forEach((reservation, index) => {
    // Add main reservation row
    result.push({
      id: `reservation-${index}`,
      resNo: reservation.resNo,
      bookingDate: reservation.bookingDate,
      guest: reservation.guest,
      rateType: reservation.rateType,
      arrival: reservation.arrival,
      departure: reservation.departure,
      folioNo: reservation.folioNo,
      adr: reservation.adr,
      carRevenue: reservation.carRevenue,
      charges: reservation.charges,
      paid: reservation.paid,
      balance: reservation.balance,
      source: reservation.source,
      cancelledBy: reservation.cancelledBy,
      cancelledDate: reservation.cancelledDate,
      isRemarkRow: false
    })
    
    // Add remarks row if exists
    if (reservation.remarks) {
      result.push({
        id: `remarks-${index}`,
        resNo: t('reports.reservation.remarks.label'),
        bookingDate: reservation.remarks,
        guest: '',
        rateType: '',
        arrival: '',
        departure: '',
        folioNo: '',
        adr: '',
        carRevenue: '',
        charges: '',
        paid: '',
        balance: '',
        source: '',
        cancelledBy: '',
        cancelledDate: '',
        isRemarkRow: true
      })
    }
  })
  
  return result
})

// Computed properties for totals
const totalReservations = computed(() => {
  return reservationData.value.length
})

const totalADR = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    return total + parseFloat(reservation.adr.replace(',', '') || '0')
  }, 0).toFixed(2)
})

const totalCarRevenue = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    return total + parseFloat(reservation.carRevenue || '0')
  }, 0).toFixed(2)
})

const totalCharges = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    return total + parseFloat(reservation.charges || '0')
  }, 0).toFixed(2)
})

const totalPaid = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    return total + parseFloat(reservation.paid || '0')
  }, 0).toFixed(2)
})

const totalBalance = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    return total + parseFloat(reservation.balance || '0')
  }, 0).toFixed(2)
})

const reportTitle = computed(() => {
  return reportData.value?.title || 'Void Reservations Report'
})

// Watch for filter changes
watch(filters, (newFilters) => {
  apiFilters.value = {
    ...apiFilters.value,
    startDate: newFilters.arrivalFrom,
    endDate: newFilters.arrivalTo
  }
}, { deep: true })

// Methods
const generateVoidReport = async () => {
  loading.value = true
  showResults.value = false
  
  try {
    console.log('Generating void report with filters:', apiFilters.value)
    const response = await generateVoidList(apiFilters.value)
    console.log('Report Data:', response)
    
    if (response && response.success && response.data) {
      reportData.value = response.data
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating void report:', error)
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV with filters:', apiFilters.value)
    const result = await exportData('csv', 'voidReservations', 'void', apiFilters.value)
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
    const result = await exportData('pdf', 'voidReservations', 'void', apiFilters.value)
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
    const result = await exportData('excel', 'voidReservations', 'void', apiFilters.value)
    console.log('Excel export result:', result)
  } catch (error) {
    console.error('Excel export error:', error)
  } finally {
    exportLoading.value = false
  }
}

const updateDateFilter = (field: 'startDate' | 'endDate', value: string) => {
  if (value) {
    const date = new Date(value)
    apiFilters.value[field] = date.toISOString().split('T')[0]
  } else {
    apiFilters.value[field] = ''
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

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
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

const resetForm = (): void => {
  filters.value = {
    arrivalFrom: '',
    arrivalTo: ''
  }
  showResults.value = false
  reportData.value = null
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom styling for remark rows */
:deep(.bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #f9fafb;
}

:deep(.dark .bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #374151;
}

/* Styles for HTML report content */
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

/* Dark mode adaptation */
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

/* Export button styles */
.export-button {
  transition: all 0.2s ease-in-out;
}

.export-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.export-button:active {
  transform: translateY(0);
}

/* Dropdown menu animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>