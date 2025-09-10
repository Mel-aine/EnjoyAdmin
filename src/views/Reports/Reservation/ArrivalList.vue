<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Arrival List
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage upcoming guest arrivals
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Arrival Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Arrival From
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
              Arrival To
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              placeholder="To"
              class="w-full"
              @update:modelValue="updateDateFilter('endDate', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company
            </label>
            <SelectComponent 
              v-model="filters.company"
              :options="companyOptions"
              placeholder="-- select Company --"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              placeholder="-- select Room Types --"
              class="w-full"
            />
          </div>
          
          <!-- Travel Agent -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Travel Agent
            </label>
            <SelectComponent 
              v-model="filters.travelAgent"
              :options="travelAgentOptions"
              placeholder="-- select Travel Agent --"
              class="w-full"
            />
          </div>
          
          <!-- Rate Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rate Type
            </label>
            <SelectComponent 
              v-model="filters.rateType"
              :options="rateTypeOptions"
              placeholder="-- select Rate Types --"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Source
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="BusinessSource"
              placeholder="-- Select Business Source --"
              class="w-full"
            />
          </div>
          
          <!-- Market -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Market
            </label>
            <SelectComponent 
              v-model="filters.market"
              :options="MarketCode"
              placeholder="--Select Market --"
              class="w-full"
            />
          </div>
          
          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
              placeholder="-- select User --"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Rate Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rate From
            </label>
            <input 
              v-model="filters.rateFrom" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="From"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rate To
            </label>
            <input 
              v-model="filters.rateTo" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="To"
            />
          </div>
          
          <!-- Show Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Show Amount
            </label>
            <SelectComponent 
              v-model="filters.showAmount"
              :options="showAmountOptions"
              placeholder=" -- Select Amount Type --"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Reservation Type -->
          <div>
            <label class="font-medium mb-1 text-gray-600">Reservation Type</label>
            <SelectComponent 
              v-model="filters.reservationType"
              :options="BookingType"
              placeholder="--Select Reservation Type --"
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
              Tax Inclusive Rates (Disc./Adj. included, if applied)
            </label>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>When checked, tax will be included in rates</span>
            </div>
          </div>
        </div>

        <!-- Select Columns -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Columns (Any 5)
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label 
              class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              v-for="column in availableColumns" 
              :key="column.value"
            >
              <input 
                v-model="filters.selectedColumns" 
                :value="column.value"
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                :disabled="filters.selectedColumns.length >= 5 && !filters.selectedColumns.includes(column.value)"
              />
              {{ column.label }}
            </label>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Selected: {{ filters.selectedColumns.length }}/5 columns
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200">
          <!-- Bouton d'export avec menu déroulant - Style modifié pour correspondre à l'exemple -->
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
            
            <!-- Menu déroulant Export -->
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
          
          <!-- Bouton Report avec le style de l'exemple -->
          <button 
            @click="generateArrivalReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
                   <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Report
          </button>
          
          <!-- Bouton Reset avec style secondaire -->
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

      <!-- Results Table ou Rapport HTML -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- En-tête du rapport -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ reportData?.title || 'Arrival List Results' }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>Generated: {{ reportData?.generatedAt ? formatDate(reportData.generatedAt) : '' }}</span>
          </div>
        </div>
        
        <!-- Contenu HTML du rapport -->
        <div v-if="reportData?.html" v-html="reportData.html" class="report-html-container"></div>
        
        <!-- Fallback si pas de HTML (affichage normal du tableau) -->
        <div v-else>
          <div class="overflow-x-auto">
            <ResultTable 
              title="Arrival List Results"
              :data="reservationData"
              :columns="selectedTableColumns"
              class="w-full"
            />
          </div>
          
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Total Reservation: #{{ totalReservations }}</span> • 
            <span>Total Pax: {{ totalPax }}</span>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generateArrivalList, type ReportFilters, exportData } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useBooking } from '@/composables/useBooking2'
import { getCompanies } from '@/services/companyApi'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getRateTypes } from '@/services/rateTypeApi'
import { getEmployeesForService } from '@/services/userApi'

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

interface Filters {
  arrivalFrom: string;
  arrivalTo: string;
  roomType: string;
  rateType: string;
  showAmount: string;
  rateFrom: string;
  rateTo: string;
  reservationType: string;
  company: string;
  travelAgent: string;
  businessSource: string;
  market: string;
  user: string;
  taxInclusive: boolean;
  selectedColumns: string[];
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
const serviceStore = useServiceStore()
const companyOptions = ref<FilterOptions[]>([])
const roomTypeOptions = ref<FilterOptions[]>([])
const rateTypeOptions = ref<FilterOptions[]>([])
const userOptions = ref<FilterOptions[]>([])
const idHotel = serviceStore.serviceId

// Filtres pour l'API
const apiFilters = ref<ReportFilters>({
  startDate: '',
  endDate: '',
  hotelId: idHotel !== null ? idHotel : undefined
})

// Filtres pour l'interface utilisateur
const filters = ref<Filters>({
  arrivalFrom: '',
  arrivalTo: '',
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
  taxInclusive: false,
  selectedColumns: []
})

// Options for selects
const getCompaniesList = async () => {
  try {
    const resp = await getCompanies()
    console.log('Companies response:', resp)
    companyOptions.value = resp.map((c: any) => ({
      label: c.companyName,
      value: c.companyCode
    }))
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
}
const fetchRoomtype = async () => {
  try {
    const resp = await getRoomTypes(idHotel!)
    console.log('Room Type:', resp)
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
    console.log('Rate Type:', resp)
    rateTypeOptions.value = resp.data.data.map((c: any) => ({
      label: c.rateTypeName,
      value: c.id
    }))
  } catch (error) {
    console.error('Error fetching roomType:', error)
  }
}

const fetchUsers = async () => {
  try {
    const resp = await getEmployeesForService(idHotel!)
    console.log('Users:', resp)
    userOptions.value = resp.data.data.map((u: any) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.user_id
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
} 

const showAmountOptions = ref<FilterOptions[]>([
  { value: 'rent_per_night', label: 'Rent Per Night' },
  { value: 'total_amount', label: 'Total Amount' }
])

const travelAgentOptions = ref<FilterOptions[]>([
  { value: 'agent1', label: 'Travel Agent 1' },
  { value: 'agent2', label: 'Travel Agent 2' }
])

const {
  // Options
  BookingSource,
  BusinessSource,
  BookingType,
  creditTypes,
  billToOptions,
  MarketCode,
  emailTemplates,
  reservationId,
} = useBooking()


const availableColumns = ref<FilterOptions[]>([
  { value: 'pickUp', label: 'Pick Up' },
  { value: 'dropOff', label: 'Drop Off' },
  { value: 'resType', label: 'Res.Type' },
  { value: 'company', label: 'Company' },
  { value: 'user', label: 'User' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'balanceDue', label: 'Balance Due' },
  { value: 'marketCode', label: 'Market Code' },
  { value: 'businessSource', label: 'Business Source' },
  { value: 'mealPlan', label: 'Meal Plan' },
  { value: 'rateType', label: 'Rate Type' }
])

// Sample data for the table
const reservationData = ref<Reservation[]>([
  {
    resNo: 'BE306',
    guest: 'Mr.eZee Test 03',
    room: '101 - Suite Room',
    rate: '100.00',
    arrival: '28/04/2019 11:30:00 AM',
    departure: '01/05/2019',
    pax: '1/0',
    pickUp: '',
    dropOff: '',
    resType: 'Confirm Booking',
    company: '',
    user: 'helpdesksupport'
  }
])

// Mettre à jour les filtres API quand les filtres UI changent
watch(filters, (newFilters) => {
  // Mapper les filtres UI vers les filtres API
  apiFilters.value = {
    ...apiFilters.value,
    arrivalFrom: newFilters.arrivalFrom,
    arrivalTo: newFilters.arrivalTo,
    roomTypeId: newFilters.roomType ? parseInt(newFilters.roomType) : undefined,
    ratePlanId: newFilters.rateType ? parseInt(newFilters.rateType) : undefined,
    company: newFilters.company,
    travelAgent: newFilters.travelAgent,
    businessSource: newFilters.businessSource,
    market: newFilters.market,
    user: newFilters.user,
    rateFrom: newFilters.rateFrom ? parseFloat(newFilters.rateFrom) : undefined,
    rateTo: newFilters.rateTo ? parseFloat(newFilters.rateTo) : undefined,
    reservationType: newFilters.reservationType,
    showAmount: newFilters.showAmount,
    taxInclusive: newFilters.taxInclusive,
    selectedColumns: newFilters.selectedColumns
  }
}, { deep: true })

// Computed properties
const selectedTableColumns = computed(() => {
  const baseColumns = [
    { key: 'resNo', label: 'Res. No' },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'rate', label: 'Rate ' },
    { key: 'arrival', label: 'Arrival' },
    { key: 'departure', label: 'Departure' },
    { key: 'pax', label: 'Pax' }
  ]
  
  // Add selected columns
  filters.value.selectedColumns.forEach(col => {
    baseColumns.push({
      key: col,
      label: availableColumns.value.find(c => c.value === col)?.label || col
    })
  })

  // Add tax inclusive if selected
  if (filters.value.taxInclusive) {
    baseColumns.push({
      key: 'taxInclusive',
      label: 'Tax Inclusive'
    })
  }
  
  return baseColumns
})

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
const generateArrivalReport = async () => {
  loading.value = true
  showResults.value = false
  
  try {
    console.log('Generating report with filters:', apiFilters.value)
    const response = await generateArrivalList(apiFilters.value)
    console.log('Report Data:', response)
    
    if (response.success && response.data) {
      reportData.value = response.data
      showResults.value = true
    }
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV avec filtres:', apiFilters.value)
    const result = await exportData('csv','arrivalList','arrival-list', apiFilters.value)
    console.log('Résultat export CSV:', result)
  } catch (error) {
    console.error('Erreur détaillée CSV:', error)
  } finally {
    exportLoading.value = false
  }
}

const exportPDF = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export PDF avec filtres:', apiFilters.value)
    const result = await exportData('pdf', 'arrivalList','arrival-list',apiFilters.value)
    console.log('Résultat export PDF:', result)
  } catch (error) {
    console.error('Erreur détaillée PDF:', error)
  } finally {
    exportLoading.value = false
  }
}

const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel avec filtres:', apiFilters.value)
    const result = await exportData('excel', 'arrivalList','arrival-list', apiFilters.value)
    console.log('Résultat export Excel:', result)
  } catch (error) {
    console.error('Erreur détaillée Excel:', error)
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
    arrivalTo: '',
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
    taxInclusive: false,
    selectedColumns: []
  }
  showResults.value = false
  reportData.value = null
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
}

// Fermer le menu d'export en cliquant à l'extérieur
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

/* Styles pour le contenu HTML du rapport */
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

/* Adaptation pour le mode sombre */
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

/* Styles pour les boutons d'export */
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

/* Animation pour le menu déroulant */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>