<template>
  <ReportsLayout>
    <div class="bg-white rounded-lg p-5 shadow-sm">
      <div class="p-5 max-w-6xl mx-auto">
        <h2 class="text-2xl font-semibold mb-5 text-gray-800">{{ t('reports.reservation.cancelledReservations') }}</h2>
        
        <!-- Search Form -->
        <div class="bg-gray-50 p-5 rounded-lg mb-5">
          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Cancellation Dates -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('reports.reservation.cancelledReservationsResults') }}</label>
              <div class="flex flex-col sm:flex-row items-center gap-2 w-full">
                <InputDatepicker 
                  v-model="filters.arrivalFrom" 
                  :placeholder="t('common.from')"
                  class="flex-1 w-full"
                />
                <span class="font-medium text-gray-500">{{ t('common.to') }}</span>
                <InputDatepicker 
                  v-model="filters.arrivalTo" 
                  :placeholder="t('common.to')"
                  class="flex-1 w-full"
                />
              </div>
            </div>
            
            <!-- Room Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.roomType') }}</label>
              <SelectComponent 
                v-model="filters.roomType"
                :options="roomTypeOptions"
                :placeholder="t('common.select')"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Rate Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.rateType') }}</label>
              <SelectComponent 
                v-model="filters.rateType"
                :options="rateTypeOptions"
                :placeholder="t('common.select')"
              />
            </div>
            
            <!-- Cancelled By -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('reports.reservation.cancelledBy') }}</label>
              <SelectComponent 
                v-model="filters.company"
                :options="companyOptions"
                :placeholder="t('common.select')"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Business Source -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.businessSource') }}</label>
              <SelectComponent 
                v-model="filters.businessSource"
                :options="businessSourceOptions"
                :placeholder="t('common.select')"
              />
            </div>
            
            <!-- Travel Agent -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.travelAgent') }}</label>
              <SelectComponent 
                v-model="filters.travelAgent"
                :options="travelAgentOptions"
                :placeholder="t('common.select')"
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
                <span class="text-sm sm:text-base">{{ t('reports.reservation.taxInclusive') }}</span>
              </label>
            </div>
          </div>

          <!-- Report Template and Action Buttons -->
          <div class="flex flex-col sm:flex-row items-end justify-between mt-5 pt-5 border-t border-gray-200 gap-4">
            <!-- Report Template -->
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <label class="font-medium text-gray-600 whitespace-nowrap">{{ t('reports.reportTemplate') }}</label>
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <SelectComponent 
                  v-model="filters.reportTemplate"
                  :options="reportTemplateOptions"
                  :placeholder="t('common.default')"
                  class="min-w-32 w-full sm:w-auto"
                />
                <button 
                  @click="editTemplate"
                  class="p-1.5 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :title="t('common.editTemplate')"
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
                {{ t('common.export') }}
              </ButtonComponent>
              
              <ButtonComponent 
                @click="generateReport"
                variant="primary"
                class="min-w-24 w-full sm:w-auto"
              >
                {{ t('common.report') }}
              </ButtonComponent>
              
              <ButtonComponent 
                @click="resetForm"
                variant="outline"
                class="min-w-24 w-full sm:w-auto"
              >
                {{ t('common.reset') }}
              </ButtonComponent>
            </div>
          </div>
        </div>

        <!-- Results Table -->
        <div class="bg-white rounded-lg p-5 shadow-sm" v-if="showResults">
          <h3 class="text-blue-700 mb-2">{{ hotelName }}</h3>
          <div class="flex flex-col sm:flex-row sm:gap-5 mb-4 text-sm text-gray-600">
            <span>{{ t('common.dateFrom') }}: {{ filters.arrivalFrom }} {{ t('common.to') }} {{ filters.arrivalTo }}</span>
            <span>{{ t('common.orderBy') }}: {{ t('common.room') }}</span>
            <span>{{ t('reports.reservation.taxInclusive') }}: {{ filters.taxInclusive ? t('common.yes') : t('common.no') }}</span>
          </div>
          
          <ReusableTable 
            :title="t('reports.reservation.cancelledReservations')"
            :columns="tableColumns"
            :data="tableDataWithRemarks"
            :searchable="false"
            :show-header="true"
            :selectable="false"
            :actions="[]"
            :empty-state-title="t('reports.reservation.emptyStateTitle')"
            :empty-state-message="t('reports.reservation.emptyStateMessage')"
            class="w-full"
          >
            <!-- Custom slot for remarks display -->
            <template #column-resNo="{ item, value }">
              <div :class="{ 'font-medium text-gray-700': item.isRemarkRow, 'text-gray-900': !item.isRemarkRow }">
                {{ value }}
              </div>
            </template>

            <template #column-bookingDate="{ item, value }">
              <div v-if="item.isRemarkRow" class="text-gray-600 italic">
                {{ value }}
              </div>
              <div v-else class="text-gray-900">
                {{ value }}
              </div>
            </template>

          </ReusableTable>

          <!-- Total Row (outside the table) -->
          <div class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mt-4 p-4">
            <div class="grid grid-cols-15 gap-4 text-sm font-semibold items-center" style="grid-template-columns: repeat(15, minmax(0, 1fr));">
              <div class="text-left">{{ t('common.total') }}</div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div class="text-right">{{ totalADR }}</div>
              <div class="text-right">{{ totalCarRevenue }}</div>
              <div class="text-right">{{ totalCharges }}</div>
              <div class="text-right">{{ totalPaid }}</div>
              <div class="text-right">{{ totalBalance }}</div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row justify-between font-medium pt-4 mt-4 border-t border-gray-200 gap-2">
            <span>{{ t('reports.reservation.totalCancelled') }}: #({{ totalReservations }})</span>
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
import ReusableTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

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
const companyOptions = ref<FilterOptions[]>([
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
])

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