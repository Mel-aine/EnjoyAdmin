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
          <div class=" mt-12">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.taxInclusive" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              Tax Inclusive Rates (Disc./Adj. included, if applied)
            </label>
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
        </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200">
            <ButtonComponent 
              @click="exportData"
              variant="secondary"
              class="min-w-24"
            >
              Export
            </ButtonComponent>
            
            <ButtonComponent 
              @click="generateArrivalReport"
              variant="primary"
              class="min-w-24"
            >
              Report
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="min-w-24"
            >
              Reset
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Arrival List Results
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> • 
            <span>Date From: {{ filters.arrivalFrom }} To {{ filters.arrivalTo }}</span> • 
            <span>Order By: Room</span> • 
            <span>Tax Inclusive: {{ filters.taxInclusive ? 'Yes' : 'No' }}</span>
          </div>
        </div>
        
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

  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generateArrivalList, type ReportFilters } from '@/services/reportsApi'
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

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)
const reportData = ref<any>(null)
const loading = ref<boolean>(false)
const serviceStore = useServiceStore()
const idHotel = serviceStore.serviceId

const filter = ref<ReportFilters>({
  startDate: '2025-09-07',
  endDate: '2025-09-10',
  hotelId: idHotel !== null ? idHotel : undefined
}
)

const filters = ref<Filters>({
  arrivalFrom: '27/04/2019',
  arrivalTo: '30/04/2019',
  roomType: '',
  rateType: '',
  showAmount: 'Rent Per Night',
  rateFrom: '',
  rateTo: '',
  reservationType: '',
  company: '',
  travelAgent: '',
  businessSource: '',
  market: '',
  user: '',
  taxInclusive: true,
  selectedColumns: ['Pick Up', 'Drop Off', 'Res.Type', 'Company', 'User']
})

// Options for selects
const companyOptions = ref<FilterOptions[]>([
  { value: 'company1', label: 'Company 1' },
  { value: 'company2', label: 'Company 2' }
])

const roomTypeOptions = ref<FilterOptions[]>([
  { value: 'suite', label: 'Suite Room' },
  { value: 'standard', label: 'Standard Room' },
  { value: 'deluxe', label: 'Deluxe Room' }
])

const rateTypeOptions = ref<FilterOptions[]>([
  { value: 'standard', label: 'Standard Rate' },
  { value: 'corporate', label: 'Corporate Rate' },
  { value: 'promotional', label: 'Promotional Rate' }
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
  { value: 'online', label: 'Online' },
  { value: 'phone', label: 'Phone' },
  { value: 'walk_in', label: 'Walk-in' }
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
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'tentative', label: 'Tentative' },
  { value: 'cancelled', label: 'Cancelled' }
])

const availableColumns = ref<FilterOptions[]>([
  { value: 'Pick Up', label: 'Pick Up' },
  { value: 'Drop Off', label: 'Drop Off' },
  { value: 'Res.Type', label: 'Res.Type' },
  { value: 'Company', label: 'Company' },
  { value: 'User', label: 'User' },
  { value: 'Deposit', label: 'Deposit' },
  { value: 'Balance Due', label: 'Balance Due' },
  { value: 'Market Code', label: 'Market Code' },
  { value: 'Business Source', label: 'Business Source' },
  { value: 'Meal Plan', label: 'Meal Plan' },
  { value: 'Rate Type', label: 'Rate Type' }
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
    const columnKey = col.toLowerCase().replace(/\s+/g, '').replace('.', '')
    baseColumns.push({
      key: columnKey,
      label: col
    })
  })
  
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
  try {
    console.log('Generating report with filters:', filter.value)
    const response = await generateArrivalList( filter.value)
    console.log('Report Data:', response)
    if (response.success && response.data) {
      reportData.value = response.data
    }
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const exportData = (): void => {
  console.log('Exporting data...')
  // Export logic
}

const resetForm = (): void => {
  filters.value = {
    arrivalFrom: '',
    arrivalTo: '',
    roomType: '',
    rateType: '',
    showAmount: 'Rent Per Night',
    rateFrom: '',
    rateTo: '',
    reservationType: '',
    company: '',
    travelAgent: '',
    businessSource: '',
    market: '',
    user: '',
    taxInclusive: true,
    selectedColumns: []
  }
  showResults.value = false
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
</style>