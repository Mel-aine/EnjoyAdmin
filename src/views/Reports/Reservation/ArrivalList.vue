<template>
  <ReportsLayout>
    <div class="bg-white rounded-lg p-5 shadow-sm">
      <div class="p-5 max-w-6xl mx-auto">
        <h2 class="text-2xl font-semibold mb-5 text-gray-800">Arrival List</h2>
        
        <!-- Search Form -->
        <div class="bg-gray-50 p-5 rounded-lg mb-5">
          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Arrival Dates -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Arrival</label>
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
            <!-- Room Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Room Type</label>
              <SelectComponent 
                v-model="filters.roomType"
                :options="roomTypeOptions"
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
            <!-- Rate Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Rate Type</label>
              <SelectComponent 
                v-model="filters.rateType"
                :options="rateTypeOptions"
                placeholder="--Select--"
              />
            </div>

            <!-- Business Source -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Business Source</label>
              <SelectComponent 
                v-model="filters.businessSource"
                :options="businessSourceOptions"
                placeholder="--Select--"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Show Amount -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Show Amount</label>
              <SelectComponent 
                v-model="filters.showAmount"
                :options="showAmountOptions"
                placeholder="Rent Per Night"
              />
            </div>

            <!-- Market -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Market</label>
              <SelectComponent 
                v-model="filters.market"
                :options="marketOptions"
                placeholder="--Select--"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
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

            <!-- User -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">User</label>
              <SelectComponent 
                v-model="filters.user"
                :options="userOptions"
                placeholder="--Select--"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Reservation Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Reservation Type</label>
              <SelectComponent 
                v-model="filters.reservationType"
                :options="reservationTypeOptions"
                placeholder="--Select--"
              />
            </div>

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

          <!-- Select Columns -->
          <div class="mb-4">
            <div class="w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">Select Column (Any 5)</label>
              <div class="flex flex-wrap gap-4 mt-2">
                <label 
                  class="flex items-center gap-1 text-sm cursor-pointer" 
                  v-for="column in availableColumns" 
                  :key="column.value"
                >
                  <input 
                    v-model="filters.selectedColumns" 
                    :value="column.value"
                    type="checkbox"
                    class="rounded border-gray-300"
                    :disabled="filters.selectedColumns.length >= 5 && !filters.selectedColumns.includes(column.value)"
                    :class="{ 'opacity-50 cursor-not-allowed': filters.selectedColumns.length >= 5 && !filters.selectedColumns.includes(column.value) }"
                  />
                  {{ column.label }}
                </label>
              </div>
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
              @click="generateReport"
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
              title="Arrival List Results"
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
    { key: 'rate', label: 'Rate (Rs)' },
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
const generateReport = (): void => {
  showResults.value = true
  // Here you could make an API call to fetch data
  console.log('Generating report with filters:', filters.value)
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