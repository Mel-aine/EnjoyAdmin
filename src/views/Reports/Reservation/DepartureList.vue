<template>
  <ReportsLayout>
    <div class="bg-white rounded-lg p-5 shadow-sm">
      <div class="p-5 max-w-6xl mx-auto">
        <h2 class="text-2xl font-semibold mb-5 text-gray-800">Arrival List</h2>
        
        <!-- Search Form -->
        <div class="bg-gray-50 p-5 rounded-lg mb-5">
          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Departure Dates -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Departure</label>
              <div class="flex flex-col sm:flex-row items-center gap-2 w-full">
                <InputDatepicker 
                  v-model="filters.arrivalFrom" 
                  placeholder="From"
                  class="flex-1 w-full"
                />
                <span class="font-medium text-gray-500">To</span>
                <InputDatepicker 
                  v-model="filters.arrivalTo" 
                  placeholder="To"
                  class="flex-1 w-full"
                />
              </div>
            </div>
            
            <!-- Reservation Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Reservation Type</label>
              <SelectComponent 
                v-model="filters.reservationType"
                :options="reservationTypeOptions"
                placeholder="--Select--"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- User -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">User</label>
              <SelectComponent 
                v-model="filters.user"
                :options="userOptions"
                placeholder="--Select--"
              />
            </div>
            
            <!-- Room Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Room Type</label>
              <SelectComponent 
                v-model="filters.roomType"
                :options="roomTypeOptions"
                placeholder="--Select--"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Rate Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Rate Type</label>
              <SelectComponent 
                v-model="filters.rateType"
                :options="rateTypeOptions"
                placeholder="--Select--"
              />
            </div>
            
            <!-- Rate Range -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Rate From</label>
              <input 
                v-model="filters.rateFrom" 
                type="number" 
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="From"
              />
            </div>
            
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">To</label>
              <input 
                v-model="filters.rateTo" 
                type="number" 
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="To"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Market -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Market</label>
              <SelectComponent 
                v-model="filters.market"
                :options="marketOptions"
                placeholder="--Select--"
              />
            </div>
            
            <!-- Travel Agent -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Travel Agent</label>
              <SelectComponent 
                v-model="filters.travelAgent"
                :options="travelAgentOptions"
                placeholder="--Select--"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Business Source -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Business Source</label>
              <SelectComponent 
                v-model="filters.businessSource"
                :options="businessSourceOptions"
                placeholder="--Select--"
              />
            </div>
            
            <!-- Company -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Company</label>
              <SelectComponent 
                v-model="filters.company"
                :options="companyOptions"
                placeholder="--Select--"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Tax Inclusive -->
            <div class="flex-1 w-full flex flex-col">
              <label class="flex items-center gap-2 font-normal cursor-pointer">
                <input 
                  v-model="filters.taxInclusive" 
                  type="checkbox"
                  class="rounded border-gray-300"
                />
                <span class="text-sm sm:text-base">Tax Inclusive Rates (Disc./Adj. included, if applied)</span>
              </label>
            </div>
          </div>

          <!-- Report Template and Action Buttons -->
          <div class="flex flex-col sm:flex-row items-end justify-between mt-5 pt-5 border-t border-gray-200 gap-4">
            <!-- Report Template -->
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <label class="font-medium text-gray-600 whitespace-nowrap">Report Template</label>
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <SelectComponent 
                  v-model="filters.reportTemplate"
                  :options="reportTemplateOptions"
                  placeholder="Default"
                  class="min-w-32 w-full sm:w-auto"
                />
                <button 
                  @click="editTemplate"
                  class="p-1.5 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Edit Template"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <ButtonComponent 
                @click="exportData"
                variant="secondary"
                class="min-w-24 w-full sm:w-auto"
              >
                Export
              </ButtonComponent>
              
              <ButtonComponent 
                @click="generateReport"
                variant="primary"
                class="min-w-24 w-full sm:w-auto"
              >
                Report
              </ButtonComponent>
              
              <ButtonComponent 
                @click="resetForm"
                variant="outline"
                class="min-w-24 w-full sm:w-auto"
              >
                Reset
              </ButtonComponent>
            </div>
          </div>
        </div>

        <!-- Results Table -->
        <div class="bg-white rounded-lg p-5 shadow-sm" v-if="showResults">
          <h3 class="text-blue-700 mb-2">{{ hotelName }}</h3>
          <div class="flex flex-col sm:flex-row sm:gap-5 mb-4 text-sm text-gray-600">
            <span>Date From: {{ filters.arrivalFrom }} To {{ filters.arrivalTo }}</span>
            <span>Order By: Room</span>
            <span>Tax Inclusive Rates: {{ filters.taxInclusive ? 'Yes' : 'No' }}</span>
          </div>
          
          <div class="overflow-x-auto">
            <ResultTable 
              title="Departure List Results"
              :data="reservationData"
              :columns="selectedTableColumns"
              class="w-full mb-4 min-w-max"
            />
          </div>
          
          <div class="flex flex-col sm:flex-row justify-between font-medium pt-2 border-t border-gray-200 gap-2">
            <span>Total Reservation: #{{ totalReservations }}</span>
            <span>Total Pax: {{ totalPax }}</span>
          </div>
        </div>
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
  BusiSour: string;
  restyp: string;
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
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

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
  selectedColumns: [],
  reportTemplate: 'default'
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

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: 'Default' },
  { value: 'detailed', label: 'Detailed Report' },
  { value: 'summary', label: 'Summary Report' },
  { value: 'financial', label: 'Financial Report' },
  { value: 'custom', label: 'Custom Template' }
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
    user: 'helpdesksupport',
    BusiSour: 'Online',
    restyp: 'Confirmed'
  }
])

// Computed properties
const selectedTableColumns = computed(() => {
  const baseColumns = [
    { key: 'resNo', label: 'Res. No' },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'rate', label: 'Rate (Rs)' },
    { key: 'arrival', label: 'Arrival' },
    { key: 'departure', label: 'Departure' },
    { key: 'pax', label: 'Pax' },
    { key: 'BusiSour', label: 'Business Source' },
    { key: 'restyp', label: 'Res.Type' },
    { key: 'user', label: 'User' }
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
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating report with filters:', filters.value)
}

const exportData = (): void => {
  console.log('Exporting data...')
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
    selectedColumns: [],
    reportTemplate: 'default'
  }
  showResults.value = false
}

const editTemplate = (): void => {
  console.log('Editing template...')
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-col > div {
    width: 100%;
  }
  
  .flex-col > div + div {
    margin-top: 1rem;
  }
  
  .items-end {
    align-items: stretch;
  }
}
</style>