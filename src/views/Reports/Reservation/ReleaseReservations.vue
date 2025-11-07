<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Realease Reservations 
        </h1>
       <!--  <p class="text-gray-600 dark:text-gray-400">
          View and manage cancelled guest reservations
        </p> -->
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
              Cancellation From
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              placeholder="From"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cancellation To
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              placeholder="To"
              class="w-full"
            />
          </div>
<!--           <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              placeholder="All Room Types"
              class="w-full"
            />
          </div> -->
        </div>

        <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
           Rate Type
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
          
          Company
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
          
          Business Source 
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
        </div> -->
<!-- 
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
           Travel Agent
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
           Tax Inclusive 
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.taxInclusive" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              Tax Inclusive Rates
            </label>
          </div>
        </div> -->

        <div class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Report Template (déplacé à gauche) -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Template</label>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              
              <SelectComponent 
                v-model="filters.reportTemplate"
                :options="reportTemplateOptions"
                placeholder="Default"
                class="min-w-32 w-full sm:w-auto"
              />
              <button 
                @click="editTemplate"
                class="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Edit Template"
              >
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Action Buttons (restent à droite) -->
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
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Cancelled Reservations Results
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> • 
            <span>Date From: {{ filters.arrivalFrom }} To {{ filters.arrivalTo }}</span> • 
            <span>Order By: Room</span> • 
            <span>Tax Inclusive: {{ filters.taxInclusive ? 'Yes' : 'No' }}</span>
          </div>
        </div>
        
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
  </ReportsLayout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
//import ReusableTable from '@/components/tables/ReusableTable.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))

const { t } = useI18n()

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

interface Filters {
  arrivalFrom: string;
  arrivalTo: string;
  roomType: string;
  rateType: string;
  company: string;
  travelAgent: string;
  businessSource: string;
  taxInclusive: boolean;
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  arrivalFrom: '01/04/2020',
  arrivalTo: '17/04/2020',
  roomType: '',
  rateType: '',
  company: '',
  travelAgent: '',
  businessSource: '',
  taxInclusive: true,
  reportTemplate: 'default'
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

// Options for selects
/* const companyOptions = ref<FilterOptions[]>([
  { value: 'company1', label: t('common.company1') },
  { value: 'company2', label: t('common.company2') }
])

const roomTypeOptions = ref<FilterOptions[]>([
  { value: 'suite', label: t('common.roomTypes.suite') },
  { value: 'standard', label: t('common.roomTypes.standard') },
  { value: 'deluxe', label: t('common.roomTypes.deluxe') }
])

const rateTypeOptions = ref<FilterOptions[]>([
  { value: 'manual', label: t('common.rateTypes.manual') },
  { value: 'breakfast', label: t('common.rateTypes.breakfast') },
  { value: 'european', label: t('common.rateTypes.european') },
  { value: 'continental', label: t('common.rateTypes.continental') }
])

const travelAgentOptions = ref<FilterOptions[]>([
  { value: 'agent1', label: t('common.travelAgents.agent1') },
  { value: 'agent2', label: t('common.travelAgents.agent2') }
])

const businessSourceOptions = ref<FilterOptions[]>([
  { value: 'online', label: t('common.businessSources.online') },
  { value: 'phone', label: t('common.businessSources.phone') },
  { value: 'walk_in', label: t('common.businessSources.walkIn') },
  { value: 'expedia', label: t('common.businessSources.expedia') },
  { value: 'internet', label: t('common.businessSources.internet') }
]) */

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: t('common.default') },
  { value: 'detailed', label: t('common.reportTemplates.detailed') },
  { value: 'summary', label: t('common.reportTemplates.summary') },
  { value: 'financial', label: t('common.reportTemplates.financial') },
  { value: 'custom', label: t('common.reportTemplates.custom') }
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
    company: '',
    travelAgent: '',
    businessSource: '',
    taxInclusive: true,
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

/* Custom styling for remark rows */
:deep(.bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #f9fafb;
}

:deep(.dark .bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #374151;
}
</style>