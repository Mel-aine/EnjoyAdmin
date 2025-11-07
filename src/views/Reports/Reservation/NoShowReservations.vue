<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.reservation.noShowReservations') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('reports.reservation.noShowReservationsDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Departure Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.arrivalFrom') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="t('common.from')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.arrivalTo') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              :placeholder="t('common.to')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.reservationType') }}
            </label>
            <SelectComponent 
              v-model="filters.reservationType"
              :options="reservationTypeOptions"
              :placeholder="$t('common.selectReservationType')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.user') }}
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
              :placeholder="$t('common.selectUser')"
              class="w-full"
            />
          </div>
          
          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.roomType') }}
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              :placeholder="$t('common.selectRoomType')"
              class="w-full"
            />
          </div>
          
          <!-- Rate Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.rateType') }}
            </label>
            <SelectComponent 
              v-model="filters.rateType"
              :options="rateTypeOptions"
              :placeholder="$t('common.selectRateType')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Rate Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.rateFrom') }}
            </label>
            <input 
              v-model="filters.rateFrom" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="t('common.from')"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.to') }}
            </label>
            <input 
              v-model="filters.rateTo" 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="t('common.to')"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.market') }}
            </label>
            <SelectComponent 
              v-model="filters.market"
              :options="marketOptions"
              :placeholder="$t('common.selectMarket')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Travel Agent -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.travelAgent') }}
            </label>
            <SelectComponent 
              v-model="filters.travelAgent"
              :options="travelAgentOptions"
              :placeholder="$t('common.selectTravelAgent')"
              class="w-full"
            />
          </div>
          
          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.businessSource') }}
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="businessSourceOptions"
              :placeholder="$t('common.selectBusinessSource')"
              class="w-full"
            />
          </div>
          
          <!-- Company -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.company') }}
            </label>
            <SelectComponent 
              v-model="filters.company"
              :options="companyOptions"
              :placeholder="$t('common.selectCompany')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Tax Inclusive -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.taxInclusive" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ t('reports.reservation.taxInclusiveRates') }}
            </label>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Report Template -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('common.reportTemplate') }}</label>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <SelectComponent 
                v-model="filters.reportTemplate"
                :options="reportTemplateOptions"
                :placeholder="t('common.selectReportTemplate')"
                class="min-w-32 w-full sm:w-auto"
              />
              <button 
                @click="editTemplate"
                class="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :title="t('common.edit')"
              >
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Results Table avec ResultTable -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('reports.reservation.noShowReservationsResults') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> • 
            <span>{{ t('common.dateFrom') }}: {{ filters.arrivalFrom }} {{ t('common.to') }} {{ filters.arrivalTo }}</span> • 
            <span>{{ t('reports.reservation.orderBy') }}: {{ t('common.room') }}</span> • 
            <span>{{ t('reports.reservation.taxInclusiveRates') }}: {{ filters.taxInclusive ? t('common.yes') : t('common.no') }}</span>
          </div>
        </div>
        
        <!-- Utilisation de ResultTable avec les classes de style similaires -->
         <div class="overflow-x-auto">
          <ResultTable 
          :title="t('reports.reservation.noShowReservationsResults')"
          :data="reservationData"
          :columns="selectedTableColumns"
           class="w-full mb-4 min-w-max"
        />
         </div>

        
        <!-- Total Row -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ t('reports.reservation.totalReservations') }}: {{ totalReservations }}</div>
            <div>{{ t('reports.reservation.totalPax') }}: {{ totalPax }}</div>
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
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))

const { t } = useI18n()

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
  showAmount: 'rent_per_night',
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
  { value: 'company1', label: t('common.company1') },
  { value: 'company2', label: t('common.company2') }
])

const roomTypeOptions = ref<FilterOptions[]>([
  { value: 'suite', label: t('roomTypes.suite') },
  { value: 'standard', label: t('roomTypes.standard') },
  { value: 'deluxe', label: t('roomTypes.deluxe') }
])

const rateTypeOptions = ref<FilterOptions[]>([
  { value: 'standard', label: t('rateTypes.standard') },
  { value: 'corporate', label: t('rateTypes.corporate') },
  { value: 'promotional', label: t('rateTypes.promotional') }
])

const travelAgentOptions = ref<FilterOptions[]>([
  { value: 'agent1', label: t('common.travelAgents.agent1') },
  { value: 'agent2', label: t('common.travelAgents.agent2') }
])

const businessSourceOptions = ref<FilterOptions[]>([
  { value: 'online', label: t('common.businessSources.online') },
  { value: 'phone', label: t('common.businessSources.phone') },
  { value: 'walk_in', label: t('common.businessSources.walkIn') }
])

const marketOptions = ref<FilterOptions[]>([
  { value: 'domestic', label: t('common.markets.domestic') },
  { value: 'international', label: t('common.markets.international') }
])

const userOptions = ref<FilterOptions[]>([
  { value: 'helpdesksupport', label: t('users.helpdesk') },
  { value: 'admin', label: t('users.admin') }
])

// Traduction dynamique des types de réservation
const normalizeKey = (name: string): string => {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const reservationTypeOptions = ref<FilterOptions[]>([
  { value: 'confirmed', label: t('reservation.types.confirmed') },
  { value: 'tentative', label: t('reservation.types.tentative') },
  { value: 'cancelled', label: t('reservation.types.cancelled') }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: t('common.reportTemplates.default') },
  { value: 'detailed', label: t('common.reportTemplates.detailed') },
  { value: 'summary', label: t('common.reportTemplates.summary') },
  { value: 'financial', label: t('common.reportTemplates.financial') },
  { value: 'custom', label: t('common.reportTemplates.custom') }
])

// Sample data for the table
const reservationData = ref<Reservation[]>([
  {
    resNo: 'BE306',
    guest: t('common.guest') || 'Guest',
    room: `101 - ${t('common.suite') || 'Suite'}`,
    rate: '100.00',
    arrival: '28/04/2019 11:30:00 AM',
    departure: '01/05/2019',
    pax: '1/0',
    pickUp: '',
    dropOff: '',
    resType: t('reservation.types.confirmed') || 'Confirmed',
    company: '',
    user: t('common.user') || 'User',
    BusiSour: t('common.businessSources.online') || 'Online',
    restyp: t('reservation.types.confirmed') || 'Confirmed'
  }
])

// Computed properties
const selectedTableColumns = computed(() => {
  const baseColumns = [
    { key: 'resNo', label: t('reports.reservation.columns.resNo') },
    { key: 'guest', label: t('common.guest') },
    { key: 'room', label: t('common.room') },
    { key: 'rate', label: t('common.rate') },
    { key: 'arrival', label: t('common.arrival') },
    { key: 'departure', label: t('common.departure') },
    { key: 'pax', label: t('common.pax') },
    { key: 'BusiSour', label: t('common.businessSource') },
    { key: 'restyp', label: t('reports.reservation.columns.reservationTypeShort') },
    { key: 'user', label: t('common.user') }
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
    showAmount: 'rent_per_night',
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