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
              placeholder="All Companies"
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
              placeholder="All Room Types"
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
              placeholder="All Travel Agents"
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
              placeholder="All Rate Types"
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
              :options="businessSourceOptions"
              placeholder="All Sources"
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
              :options="marketOptions"
              placeholder="All Markets"
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
              placeholder="All Users"
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
              placeholder="Rent Per Night"
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
              :options="reservationTypeOptions"
              placeholder="--Select--"
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
          <!-- Boutons d'export avec icônes et couleurs distinctes -->
          <ButtonComponent 
            @click="exportCSV"
            variant="secondary"
            class="min-w-24 bg-green-600 hover:bg-green-700 border-green-600"
            :loading="loading"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </template>
            CSV
          </ButtonComponent>
          
          <ButtonComponent 
            @click="exportPDF"
            variant="secondary"
            class="min-w-24 bg-red-600 hover:bg-red-700 border-red-600"
            :loading="loading"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </template>
            PDF
          </ButtonComponent>
          
          <ButtonComponent 
            @click="exportExcel"
            variant="secondary"
            class="min-w-24 bg-blue-600 hover:bg-blue-700 border-blue-600"
            :loading="loading"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </template>
            Excel
          </ButtonComponent>
          
          <ButtonComponent 
            @click="generateArrivalReport"
            variant="primary"
            class="min-w-24"
            :loading="loading"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </template>
            Report
          </ButtonComponent>
          
          <ButtonComponent 
            @click="resetForm"
            variant="outline"
            class="min-w-24"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </template>
            Reset
          </ButtonComponent>
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

      <!-- Indicateur de chargement -->
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-center mt-2 text-gray-700 dark:text-gray-300">Generating report...</p>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generateArrivalList, type ReportFilters, exportArrivalList } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'

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
const serviceStore = useServiceStore()
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
const companyOptions = ref<FilterOptions[]>([
  { value: 'company1', label: 'Company 1' },
  { value: 'company2', label: 'Company 2' }
])

const roomTypeOptions = ref<FilterOptions[]>([
  { value: '1', label: 'Suite Room' },
  { value: '2', label: 'Standard Room' },
  { value: '3', label: 'Deluxe Room' }
])

const rateTypeOptions = ref<FilterOptions[]>([
  { value: '1', label: 'Standard Rate' },
  { value: '2', label: 'Corporate Rate' },
  { value: '3', label: 'Promotional Rate' }
])

const showAmountOptions = ref<FilterOptions[]>([
  { value: 'rent_per_night', label: 'Rent Per Night' },
  { value: 'total_amount', label: 'Total Amount' }
])

const travelAgentOptions = ref<FilterOptions[]>([
  { value: 'agent1', label: 'Travel Agent 1' },
  { value: 'agent2', label: 'Travel Agent 2' }
])

const businessSourceOptions = ref<FilterOptions[]>([
  { value: '1', label: 'Online' },
  { value: '2', label: 'Phone' },
  { value: '3', label: 'Walk-in' }
])

const marketOptions = ref<FilterOptions[]>([
  { value: 'domestic', label: 'Domestic' },
  { value: 'international', label: 'International' }
])

const userOptions = ref<FilterOptions[]>([
  { value: 'helpdesksupport', label: 'helpdesksupport' },
  { value: 'admin', label: 'Admin' }
])

const reservationTypeOptions = ref<FilterOptions[]>([
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Tentative', label: 'Tentative' },
  { value: 'Cancelled', label: 'Cancelled' }
])

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
    loading.value = true
    console.log('Export CSV avec filtres:', apiFilters.value)
    const result = await exportArrivalList('csv', apiFilters.value)
    console.log('Résultat export CSV:', result)
  } catch (error) {
    console.error('Erreur détaillée CSV:', error)
  } finally {
    loading.value = false
  }
}

const exportPDF = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('Export PDF avec filtres:', apiFilters.value)
    const result = await exportArrivalList('pdf', apiFilters.value)
    console.log('Résultat export PDF:', result)
  } catch (error) {
    console.error('Erreur détaillée PDF:', error)
  } finally {
    loading.value = false
  }
}

const exportExcel = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('Export Excel avec filtres:', apiFilters.value)
    const result = await exportArrivalList('excel', apiFilters.value)
    console.log('Résultat export Excel:', result)
  } catch (error) {
    console.error('Erreur détaillée Excel:', error)
  } finally {
    loading.value = false
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
</style>