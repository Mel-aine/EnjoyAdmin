<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.business.hotelBusinessReport') }}
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <!-- Date Range Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <!-- Arrival Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.arrivalDateFrom') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="t('common.selectDate')"
              class="w-full"
            />
          </div>
          
          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.to') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              :placeholder="t('common.selectDate')"
              class="w-full"
            />
          </div>

          <!-- By (Business Source) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.by') }}
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="businessSourceOptions"
              :placeholder="t('common.businessSource')"
              class="w-full"
            />
          </div>

          <!-- Select dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.select') }}
            </label>
            <SelectComponent 
              v-model="filters.additionalFilter"
              :options="additionalFilterOptions"
              :placeholder="'--Select--'"
              class="w-full"
            />
          </div>
        </div>

        <!-- Note -->
        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            <strong>{{ t('common.note') }}:</strong> {{ t('reports.nightsCalculationNote') }}
          </p>
        </div>

        <!-- Report Template and Actions -->
        <div class="flex flex-col sm:flex-row items-end justify-between gap-4">
          <!-- Report Template -->
          <div class="flex items-end gap-3 w-full sm:w-auto">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('reports.reportTemplate') }}
              </label>
              <div class="flex items-center gap-2">
                <SelectComponent 
                  v-model="filters.reportTemplate"
                  :options="reportTemplateOptions"
                  :placeholder="t('reportTemplates.default')"
                  class="min-w-32"
                />
                <button 
                  @click="editTemplate"
                  class="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :title="t('common.editTemplate')"
                >
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 w-full sm:w-auto">
            <ButtonComponent 
              @click="exportData"
              variant="secondary"
              class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              {{ t('common.export') }}
            </ButtonComponent>
            
            <ButtonComponent 
              @click="generateReport"
              variant="primary"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {{ t('common.report') }}
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded"
            >
              {{ t('common.reset') }}
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('reports.business.reservationSummary') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> • 
            <span>{{ t('reports.dateRange') }}: {{ filters.arrivalFrom }} {{ t('common.to') }} {{ filters.arrivalTo }}</span> • 
            <span>{{ t('reports.businessSource') }}: {{ selectedBusinessSourceLabel }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            :title="t('reports.business.reservationAnalysis')"
            :data="reservationData"
            :columns="selectedTableColumns"
            class="w-full mb-4 min-w-max"
          />
        </div>

        <!-- Summary Row -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ t('reports.summary.totalReservations') }}: {{ totalReservations }}</div>
            <div>{{ t('reports.summary.totalGuests') }}: {{ totalGuests }}</div>
            <div>{{ t('reports.summary.totalRevenue') }}: {{ totalRevenue }}</div>
            <div>{{ t('reports.summary.avgRate') }}: {{ averageRate }}</div>
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
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface Reservation {
  resNo: string;
  guest: string;
  room: string;
  roomType: string;
  rate: string;
  arrival: string;
  departure: string;
  nights: number;
  pax: string;
  businessSource: string;
  reservationType: string;
  user: string;
  totalAmount: number;
}

interface Filters {
  arrivalFrom: string;
  arrivalTo: string;
  businessSource: string;
  additionalFilter: string;
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  arrivalFrom: '01/04/20',
  arrivalTo: '18/04/20',
  businessSource: '',
  additionalFilter: '',
  reportTemplate: 'default'
})

// Options for selects
const businessSourceOptions = ref<FilterOptions[]>([
  { value: 'all', label: t('businessSources.all') },
  { value: 'direct', label: t('businessSources.direct') },
  { value: 'online', label: t('businessSources.online') },
  { value: 'travel_agent', label: t('businessSources.travelAgent') },
  { value: 'corporate', label: t('businessSources.corporate') },
  { value: 'walk_in', label: t('businessSources.walkIn') }
])

const additionalFilterOptions = ref<FilterOptions[]>([
  { value: 'room_type', label: t('filters.roomType') },
  { value: 'rate_type', label: t('filters.rateType') },
  { value: 'guest_type', label: t('filters.guestType') },
  { value: 'package', label: t('filters.package') }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: t('reportTemplates.default') },
  { value: 'detailed', label: t('reportTemplates.detailed') },
  { value: 'summary', label: t('reportTemplates.summary') },
  { value: 'financial', label: t('reportTemplates.financial') },
  { value: 'custom', label: t('reportTemplates.custom') }
])

// Sample data for business report
const reservationData = ref<Reservation[]>([
  {
    resNo: 'RES001',
    guest: 'John Smith',
    room: '101',
    roomType: 'Deluxe',
    rate: '150.00',
    arrival: '02/04/20 14:00',
    departure: '05/04/20 11:00',
    nights: 3,
    pax: '2/0',
    businessSource: 'Direct Booking',
    reservationType: 'Confirmed',
    user: 'Reception',
    totalAmount: 450.00
  },
  {
    resNo: 'RES002',
    guest: 'Maria Garcia',
    room: '205',
    roomType: 'Suite',
    rate: '200.00',
    arrival: '03/04/20 16:30',
    departure: '07/04/20 12:00',
    nights: 4,
    pax: '2/1',
    businessSource: 'Online Booking',
    reservationType: 'Confirmed',
    user: 'Manager',
    totalAmount: 800.00
  },
  {
    resNo: 'RES003',
    guest: 'David Johnson',
    room: '310',
    roomType: 'Standard',
    rate: '100.00',
    arrival: '04/04/20 13:15',
    departure: '06/04/20 10:00',
    nights: 2,
    pax: '1/0',
    businessSource: 'Travel Agent',
    reservationType: 'Confirmed',
    user: 'Reception',
    totalAmount: 200.00
  }
])

// Computed properties
const selectedTableColumns = computed(() => [
  { key: 'resNo', label: t('tableColumns.reservationNo') },
  { key: 'guest', label: t('tableColumns.guestName') },
  { key: 'room', label: t('tableColumns.roomNo') },
  { key: 'roomType', label: t('tableColumns.roomType') },
  { key: 'rate', label: t('tableColumns.dailyRate') },
  { key: 'arrival', label: t('tableColumns.checkInDate') },
  { key: 'departure', label: t('tableColumns.checkOutDate') },
  { key: 'nights', label: t('tableColumns.nights') },
  { key: 'pax', label: t('tableColumns.guests') },
  { key: 'businessSource', label: t('tableColumns.businessSource') },
  { key: 'totalAmount', label: t('tableColumns.totalRevenue') },
  { key: 'user', label: t('tableColumns.bookedBy') }
])

const selectedBusinessSourceLabel = computed(() => {
  const selected = businessSourceOptions.value.find(option => option.value === filters.value.businessSource)
  return selected ? selected.label : t('businessSources.all')
})

const totalReservations = computed(() => {
  return reservationData.value.length
})

const totalGuests = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    const [adults, children] = reservation.pax.split('/').map(p => parseInt(p || '0'))
    return total + adults + children
  }, 0)
})

const totalRevenue = computed(() => {
  const total = reservationData.value.reduce((sum, reservation) => {
    return sum + reservation.totalAmount
  }, 0)
  return total.toFixed(2)
})

const averageRate = computed(() => {
  if (reservationData.value.length === 0) return '0.00'
  const total = reservationData.value.reduce((sum, reservation) => {
    return sum + parseFloat(reservation.rate)
  }, 0)
  return (total / reservationData.value.length).toFixed(2)
})

const totalNights = computed(() => {
  return reservationData.value.reduce((total, reservation) => {
    return total + reservation.nights
  }, 0)
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating business report with filters:', filters.value)
  // Ici vous pourriez faire un appel API pour récupérer les données réelles
}

const exportData = (): void => {
  console.log('Exporting business report data...')
  // Logique d'export (Excel, PDF, etc.)
}

const resetForm = (): void => {
  filters.value = {
    arrivalFrom: '',
    arrivalTo: '',
    businessSource: '',
    additionalFilter: '',
    reportTemplate: 'default'
  }
  showResults.value = false
}

const editTemplate = (): void => {
  console.log('Editing report template...')
  // Ouvrir un modal pour éditer le template
}
</script>

<style scoped>
/* Business report specific styles */
.business-report-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.revenue-highlight {
  color: #10b981;
  font-weight: 600;
}

.summary-card {
  transition: transform 0.2s ease-in-out;
}

.summary-card:hover {
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1 {
    gap: 1rem;
  }
  
  .flex-col > div {
    width: 100%;
  }
  
  .items-end {
    align-items: stretch;
  }
}

/* Print styles for business reports */
@media print {
  .no-print {
    display: none !important;
  }
  
  .business-report-table {
    break-inside: avoid;
  }
}
</style>