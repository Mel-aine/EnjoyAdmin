<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.reservation.departureList') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage departing guest reservations
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Departure Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.reservation.departure') }} From
            </label>
            <InputDatepicker 
              v-model="filters.departureFrom" 
              :placeholder="$t('common.from')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.reservation.departure') }} To
            </label>
            <InputDatepicker 
              v-model="filters.departureTo" 
              :placeholder="$t('common.to')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.company') }}
            </label>
            <SelectComponent 
              v-model="filters.company"
              :options="companyOptions"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
          
          <!-- Travel Agent -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.travelAgent') }}
            </label>
            <SelectComponent 
              v-model="filters.travelAgent"
              :options="travelAgentOptions"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
          
          <!-- Rate Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.rateType') }}
            </label>
            <SelectComponent 
              v-model="filters.rateType"
              :options="rateTypeOptions"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.businessSource') }}
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="BusinessSource"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
          
          <!-- Market -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.market') }}
            </label>
            <SelectComponent 
              v-model="filters.market"
              :options="MarketCode"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
          
          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.user') }}
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Rate Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.reservation.rateFrom') }}
            </label>
            <input 
              v-model="filters.rateFrom" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('common.from')"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.to') }}
            </label>
            <input 
              v-model="filters.rateTo" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('common.to')"
            />
          </div>
          
          <!-- Show Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.reservation.showAmount') }}
            </label>
            <SelectComponent 
              v-model="filters.showAmount"
              :options="showAmountOptions"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Reservation Type -->
          <div>
            <label class="font-medium mb-1 text-gray-600">{{ $t('common.reservationType') }}</label>
            <SelectComponent 
              v-model="filters.reservationType"
              :options="BookingType"
              :placeholder="$t('common.select')"
            />
          </div>
          
          <!-- Tax Inclusive -->
          <div class="mt-12">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.taxInclusive" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ $t('reports.reservation.taxInclusiveRates') }}
            </label>
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
              <span v-if="!exportLoading">{{ $t('common.export') }}</span>
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
            @click="generateDepartureReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.report') }}
          </button>
          
          <!-- Reset Button -->
          <button 
            @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('common.reset') }}
          </button>
        </div>
      </div>

      <!-- Results Table or HTML Report -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Report Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ reportData?.title || $t('reports.reservation.departureResults') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ $t('common.generated') }}: {{ reportData?.generatedAt ? formatDate(reportData.generatedAt) : '' }}</span>
          </div>
        </div>
        
        <!-- HTML Report Content -->
        <div v-if="reportData?.html" v-html="reportData.html" class="report-html-container"></div>
        
        <!-- Fallback if no HTML (normal table display) -->
        <div v-else>
          <div class="overflow-x-auto">
            <ResultTable 
              :title="$t('reports.reservation.departureResults')"
              :data="reservationData"
              :columns="tableColumns"
              class="w-full"
            />
          </div>
          
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>{{ $t('reports.reservation.totalReservations') }}: #{{ totalReservations }}</span> • 
            <span>{{ $t('reports.reservation.totalPax') }}: {{ totalPax }}</span>
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
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generateDepatureList, type ReportFilters, exportData } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useBooking } from '@/composables/useBooking2'
import { getCompanies } from '@/services/companyApi'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getRateTypes } from '@/services/rateTypeApi'
import { getEmployeesForService } from '@/services/userApi'

const { t } = useI18n()
const serviceStore = useServiceStore()

interface FilterOptions {
  value: string;
  label: string;
}

interface Reservation {
  resNo: string;
  guest: string;
  room: string;
  rate: string;
  arrival: string;
  departure: string;
  pax: string;
  pickUp: string;
  dropOff: string;
  resType: string;
  company: string;
  user: string;
  taxInclusive?: string;
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
const idHotel = serviceStore.serviceId

// API Filters
const apiFilters = ref<ReportFilters>({
  startDate: '',
  endDate: '',
  hotelId: idHotel !== null ? idHotel : undefined
})

// UI Filters
const filters = ref({
  departureFrom: '',
  departureTo: '', 
  roomType: '',
  rateType: '',
  showAmount: 'rent_per_night',
  rateFrom: '',
  rateTo: '',
  reservationType: '',
  company: '',
  travelAgent: '',
  businessSource: '',
  market: '',
  user: '',
  taxInclusive: false
})

// Options for selects
const companyOptions = ref<FilterOptions[]>([])
const roomTypeOptions = ref<FilterOptions[]>([])
const rateTypeOptions = ref<FilterOptions[]>([])
const userOptions = ref<FilterOptions[]>([])

const showAmountOptions = ref<FilterOptions[]>([
  { value: 'rent_per_night', label: t('reports.reservation.rentPerNight') },
  { value: 'total_amount', label: t('reports.reservation.totalAmount') }
])

const travelAgentOptions = ref<FilterOptions[]>([
  { value: 'agent1', label: t('travelAgents.agent1') },
  { value: 'agent2', label: t('travelAgents.agent2') }
])

const {
  // Options
  BookingSource,
  BusinessSource,
  BookingType,
  MarketCode,
} = useBooking()

// Sample data for the table
const reservationData = ref<Reservation[]>([
  {
    resNo: 'BE306',
    guest: t('sampleData.guest'),
    room: `101 - ${t('roomTypes.suite')}`,
    rate: '100.00',
    arrival: '28/04/2019 11:30:00 AM',
    departure: '01/05/2019',
    pax: '1/0',
    pickUp: '',
    dropOff: '',
    resType: t('reservationTypes.confirmed'),
    company: '',
    user: t('users.helpdesk')
  }
])

// Table columns
const tableColumns = computed(() => {
  return [
    { key: 'resNo', label: t('tableColumns.resNo') },
    { key: 'guest', label: t('tableColumns.guest') },
    { key: 'room', label: t('tableColumns.room') },
    { key: 'rate', label: t('tableColumns.rate') },
    { key: 'arrival', label: t('tableColumns.arrival') },
    { key: 'departure', label: t('tableColumns.departure') },
    { key: 'pax', label: t('tableColumns.pax') },
    { key: 'resType', label: t('tableColumns.resType') },
    { key: 'company', label: t('tableColumns.company') },
    { key: 'user', label: t('tableColumns.user') }
  ]
})

// Fetch data functions
const getCompaniesList = async () => {
  try {
    const resp = await getCompanies()
    companyOptions.value = Array.isArray(resp)
      ? resp.map((c: any) => ({
          label: c.companyName,
          value: c.companyCode
        }))
      : []
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
}

const fetchRoomtype = async () => {
  try {
    const resp = await getRoomTypes(idHotel!)
    roomTypeOptions.value = resp.data.data.data.map((c: any) => ({
      label: c.roomTypeName,
      value: c.id
    }))
  } catch (error) {
    console.error('Error fetching roomType:', error)
  }
}

const fetchRatetype = async () => {
  try {
    const resp = await getRateTypes(idHotel!)
    rateTypeOptions.value = resp.data.data.map((c: any) => ({
      label: c.rateTypeName,
      value: c.id
    }))
  } catch (error) {
    console.error('Error fetching rateType:', error)
  }
}

const fetchUsers = async () => {
  try {
    const resp = await getEmployeesForService(idHotel!)
    userOptions.value = resp.data.data.map((u: any) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.user_id
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
} 

// Mettre à jour les filtres API quand les filtres UI changent
watch(filters, (newFilters) => {
  // Mapper les filtres UI vers les filtres API
  apiFilters.value = {
    ...apiFilters.value,
    startDate: newFilters.departureFrom,
    endDate: newFilters.departureTo,
    roomTypeId: newFilters.roomType ? parseInt(newFilters.roomType) : undefined,
    ratePlanId: newFilters.rateType ? parseInt(newFilters.rateType) : undefined,
    company: newFilters.company ? newFilters.company : undefined,
    travelAgent: newFilters.travelAgent,
    businessSource: newFilters.businessSource,
    market: newFilters.market,
    user: newFilters.user,
    rateFrom: newFilters.rateFrom ? parseFloat(newFilters.rateFrom) : undefined,
    rateTo: newFilters.rateTo ? parseFloat(newFilters.rateTo) : undefined,
    reservationType: newFilters.reservationType,
    showAmount: newFilters.showAmount,
    taxInclusive: newFilters.taxInclusive
  }
}, { deep: true })

// Computed properties
const totalReservations = computed(() => {
  return reservationData.value.length
})

const totalPax = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    const pax = reservation.pax.split('/')[0]
    return total + parseInt(pax || '0')
  }, 0)
})

// Methods
const generateDepartureReport = async () => {
  loading.value = true
  showResults.value = false
  
  try {
    console.log('Generating departure report with filters:', apiFilters.value)
    const response = await generateDepatureList(apiFilters.value)
    console.log('Departure Report Data:', response)
    
    if (response && response.success && response.data) {
      reportData.value = response.data
      showResults.value = true
    } else {
      // For testing purposes, show sample data
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating departure report:', error)
    // For testing purposes, show sample data even if API fails
    showResults.value = true
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV with filters:', apiFilters.value)
    const result = await exportData('csv', 'departureList', 'departure-list', apiFilters.value)
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
    console.log('Export PDF with filters:', apiFilters.value)
    const result = await exportData('pdf', 'departureList', 'departure-list', apiFilters.value)
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
    const result = await exportData('excel', 'departureList', 'departure-list', apiFilters.value)
    console.log('Excel export result:', result)
  } catch (error) {
    console.error('Excel export error:', error)
  } finally {
    exportLoading.value = false
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
    departureFrom: '',
    departureTo: '',
    roomType: '',
    rateType: '',
    showAmount: 'rent_per_night',
    rateFrom: '',
    rateTo: '',
    reservationType: '',
    company: '',
    travelAgent: '',
    businessSource: '',
    market: '',
    user: '',
    taxInclusive: false
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
  getCompaniesList()
  fetchRoomtype()
  fetchRatetype()
  fetchUsers()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Add any additional responsive styles if needed */
@media (max-width: 640px) {
  .flex-col > div {
    width: 100%;
  }
  
  .flex-col > div + div {
    margin-top: 1rem;
  }
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

/* Styles for export buttons */
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

/* Animation for dropdown menu */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>