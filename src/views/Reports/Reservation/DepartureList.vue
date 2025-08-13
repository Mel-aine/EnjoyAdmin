<template>
  <ReportsLayout>
    <div class="bg-white rounded-lg p-5 shadow-sm">
      <div class="p-5 max-w-6xl mx-auto">
        <h2 class="text-2xl font-semibold mb-5 text-gray-800">{{ t('reports.reservation.departureList') }}</h2>
        
        <!-- Search Form -->
        <div class="bg-gray-50 p-5 rounded-lg mb-5">
          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Departure Dates -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('reports.reservation.departure') }}</label>
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
            
            <!-- Reservation Type -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('reports.reservation.reservationType') }}</label>
              <SelectComponent 
                v-model="filters.reservationType"
                :options="reservationTypeOptions"
                :placeholder="t('common.select')"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- User -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.user') }}</label>
              <SelectComponent 
                v-model="filters.user"
                :options="userOptions"
                :placeholder="t('common.select')"
              />
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
            
            <!-- Rate Range -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('reports.reservation.rateFrom') }}</label>
              <input 
                v-model="filters.rateFrom" 
                type="number" 
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                :placeholder="t('common.from')"
              />
            </div>
            
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.to') }}</label>
              <input 
                v-model="filters.rateTo" 
                type="number" 
                class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                :placeholder="t('common.to')"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-5 mb-4 items-end">
            <!-- Market -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.market') }}</label>
              <SelectComponent 
                v-model="filters.market"
                :options="marketOptions"
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
            <!-- Business Source -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.businessSource') }}</label>
              <SelectComponent 
                v-model="filters.businessSource"
                :options="businessSourceOptions"
                :placeholder="t('common.select')"
              />
            </div>
            
            <!-- Company -->
            <div class="flex-1 w-full flex flex-col">
              <label class="font-medium mb-1 text-gray-600">{{ t('common.company') }}</label>
              <SelectComponent 
                v-model="filters.company"
                :options="companyOptions"
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
                <span class="text-sm sm:text-base">{{ t('reports.reservation.taxInclusiveRates') }}</span>
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
            <span>{{ t('reports.reservation.taxInclusiveRates') }}: {{ filters.taxInclusive ? t('common.yes') : t('common.no') }}</span>
          </div>
          
          <div class="overflow-x-auto">
            <ResultTable 
              :title="t('reports.reservation.departureResults')"
              :data="reservationData"
              :columns="selectedTableColumns"
              class="w-full mb-4 min-w-max"
            />
          </div>
          
          <div class="flex flex-col sm:flex-row justify-between font-medium pt-2 border-t border-gray-200 gap-2">
            <span>{{ t('reports.reservation.totalReservations') }}: #{{ totalReservations }}</span>
            <span>{{ t('reports.reservation.totalPax') }}: {{ totalPax }}</span>
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
  showAmount: t('reports.reservation.rentPerNight'),
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
  { value: 'agent1', label: t('travelAgents.agent1') },
  { value: 'agent2', label: t('travelAgents.agent2') }
])

const businessSourceOptions = ref<FilterOptions[]>([
  { value: 'online', label: t('businessSources.online') },
  { value: 'phone', label: t('businessSources.phone') },
  { value: 'walk_in', label: t('businessSources.walkIn') }
])

const marketOptions = ref<FilterOptions[]>([
  { value: 'domestic', label: t('markets.domestic') },
  { value: 'international', label: t('markets.international') }
])

const userOptions = ref<FilterOptions[]>([
  { value: 'helpdesksupport', label: t('users.helpdesk') },
  { value: 'admin', label: t('users.admin') }
])

const reservationTypeOptions = ref<FilterOptions[]>([
  { value: 'confirmed', label: t('reservationTypes.confirmed') },
  { value: 'tentative', label: t('reservationTypes.tentative') },
  { value: 'cancelled', label: t('reservationTypes.cancelled') }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: t('reportTemplates.default') },
  { value: 'detailed', label: t('reportTemplates.detailed') },
  { value: 'summary', label: t('reportTemplates.summary') },
  { value: 'financial', label: t('reportTemplates.financial') },
  { value: 'custom', label: t('reportTemplates.custom') }
])

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
    user: t('users.helpdesk'),
    BusiSour: t('businessSources.online'),
    restyp: t('reservationTypes.confirmed')
  }
])

// Computed properties
const selectedTableColumns = computed(() => {
  const baseColumns = [
    { key: 'resNo', label: t('tableColumns.resNo') },
    { key: 'guest', label: t('tableColumns.guest') },
    { key: 'room', label: t('tableColumns.room') },
    { key: 'rate', label: t('tableColumns.rate') },
    { key: 'arrival', label: t('tableColumns.arrival') },
    { key: 'departure', label: t('tableColumns.departure') },
    { key: 'pax', label: t('tableColumns.pax') },
    { key: 'BusiSour', label: t('tableColumns.businessSource') },
    { key: 'restyp', label: t('tableColumns.resType') },
    { key: 'user', label: t('tableColumns.user') }
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
    showAmount: t('reports.reservation.rentPerNight'),
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