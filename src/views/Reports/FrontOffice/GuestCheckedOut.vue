<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.guestCheckedOut') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage departing guest reservations
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Departure Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('Date From') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="t('common.from')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('Date To') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              :placeholder="t('common.to')"
              class="w-full"
            />
          </div>
                    <!-- Room Type -->
<!--           <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.roomType') }}
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div> -->

          

        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- User -->
<!--           <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.user') }}
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div> -->
<!--           <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.Show') }}
            </label>
            <SelectComponent 
              v-model="filters.travelAgent"
              :options="travelAgentOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div> -->
          
<!--           <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.rateType') }}
            </label>
            <SelectComponent 
              v-model="filters.rateType"
              :options="rateTypeOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div> -->
<!--       <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.reservationType') }}
            </label>
            <SelectComponent 
              v-model="filters.reservationType"
              :options="reservationTypeOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div> -->
          
          <!-- Rate Type -->

        </div>

<!--         <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          Rate Range
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.reservation.rateFrom') }}
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
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div>
        </div>
 -->
 <!--        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
         Travel Agent
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.travelAgent') }}
            </label>
            <SelectComponent 
              v-model="filters.travelAgent"
              :options="travelAgentOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div>
          
           Business Source
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.businessSource') }}
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="businessSourceOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div>
          
           Company 
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.company') }}
            </label>
            <SelectComponent 
              v-model="filters.company"
              :options="companyOptions"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div>
        </div> -->

        <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"> -->
                      <!-- Tax Inclusive -->
           
<!--           <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.taxInclusive" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ t('reports.reservation.taxInclusiveRates') }}
            </label>
          </div> -->
          
        <!-- </div> -->

        <div class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4 justify-end">
          <!-- Report Template -->
          <!-- <div class="flex items-center gap-3 w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('reports.reportTemplate') }}</label>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <SelectComponent 
                v-model="filters.reportTemplate"
                :options="reportTemplateOptions"
                :placeholder="t('common.default')"
                class="min-w-32 w-full sm:w-auto"
              />
              <button 
                @click="editTemplate"
                class="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :title="t('common.editTemplate')"
              >
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            </div>
          </div> -->

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <!-- Bouton d'export avec menu déroulant -->
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
                <span v-if="!exportLoading">{{ t('common.export') }}</span>
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
            
            <!-- Bouton Report -->
            <button 
              @click="generateReport"
              :disabled="loading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('common.report') }}
            </button>
            
            <!-- Bouton Reset -->
            <button 
              @click="resetForm"
              class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ t('common.reset') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Results Table avec ResultTable -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('reports.frontOffice.guestCheckedOut') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> • 
            <span>{{ t('common.dateFrom') }}: {{ filters.arrivalFrom }} {{ t('common.to') }} {{ filters.arrivalTo }}</span> • 
            <span>{{ t('common.orderBy') }}: {{ t('common.room') }}</span> • 
            <span>{{ t('reports.reservation.taxInclusiveRates') }}: {{ filters.taxInclusive ? t('common.yes') : t('common.no') }}</span>
          </div>
        </div>
        
        <!-- Utilisation de ResultTable avec les classes de style similaires -->
         <div class="overflow-x-auto">
          <ResultTable 
          :title="t('reports.frontOffice.guestCheckedOut')"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/composables/serviceStore'
import type { GuestCheckoutFilters } from '@/services/reportsApi'
import { generateGuestCheckedOut } from '@/services/reportsApi'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const router = useRouter()
const { t } = useI18n()
const serviceStore = useServiceStore()

// Récupérer l'ID de l'hôtel depuis le store
const idHotel = computed(() => serviceStore.serviceId as number)

// Export data function
const exportData = async (
  type: 'csv' | 'pdf' | 'excel',
  reportType: string,
  fileName: string,
  params: any
) => {
  try {
    // TODO: Implement the actual export logic here
    // This is a placeholder that simulates an API call
    console.log(`Exporting ${type} for ${reportType} with params:`, params)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return a mock response
    return {
      success: true,
      message: 'Export completed successfully',
      fileUrl: type === 'pdf' ? 'data:application/pdf;base64,...' : undefined
    }
  } catch (error) {
    console.error('Error during export:', error)
    throw error
  }
}

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
  departureFrom: string;
  departureTo: string;
  roomType: string;
  roomNumber: string;
  rateType: string;
  showAmount: string;
  rateFrom: string;
  rateTo: string;
  reservationType: string;
  reservationNumber: string;
  company: string;
  travelAgent: string;
  businessSource: string;
  market: string;
  user: string;
  taxInclusive: boolean;
  checkin: boolean;
  selectedColumns: string[];
  reportTemplate: string;
  filterBy: string;
}

// États de l'interface
const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)
const exportMenuOpen = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string>('')
const reportData = ref<any>([])
const reservationData = ref<Reservation[]>([])
const pdfUrl = ref<string>('')

const today = new Date().toISOString().split('T')[0]

const filters = ref<Filters>({
  arrivalFrom: today,
  arrivalTo: today,
  departureFrom: '',
  departureTo: '',
  roomType: '',
  roomNumber: '',
  rateType: '',
  showAmount: t('reports.reservation.rentPerNight'),
  rateFrom: '',
  rateTo: '',
  reservationType: '',
  reservationNumber: '',
  company: '',
  travelAgent: '',
  businessSource: '',
  market: '',
  user: '',
  taxInclusive: true,
  checkin: false,
  selectedColumns: [],
  reportTemplate: 'default',
  filterBy: 'booking'
})

// Options for selects
/* const companyOptions = ref<FilterOptions[]>([
  { value: 'company1', label: t('common.company1') },
  { value: 'company2', label: t('common.company2') }
]) */

/* const roomTypeOptions = ref<FilterOptions[]>([
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
]) */

/* const businessSourceOptions = ref<FilterOptions[]>([
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
]) */

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: t('reportTemplates.default') },
  { value: 'detailed', label: t('reportTemplates.detailed') },
  { value: 'summary', label: t('reportTemplates.summary') },
  { value: 'financial', label: t('reportTemplates.financial') },
  { value: 'custom', label: t('reportTemplates.custom') }
])

// Initialisation des données de réservation dans onMounted
onMounted(() => {
  reservationData.value = [
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
  ]
})

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

// Méthode pour générer le rapport des départs de clients
const generateReport = async (): Promise<void> => {
  // Vérifier que les dates sont renseignées
  if (!filters.value.arrivalFrom || !filters.value.arrivalTo) {
    error.value = 'Veuillez sélectionner les dates de début et de fin'
    return
  }

  // Réinitialiser les états
  loading.value = true
  error.value = ''
  showResults.value = false
  
  try {
    console.log('Génération du rapport des départs avec les filtres:', filters.value)
    
    // Préparer les paramètres pour l'API
    const params: GuestCheckoutFilters = {
      fromDate: filters.value.arrivalFrom,
      toDate: filters.value.arrivalTo,
      hotelId: idHotel.value
    }

    // Appeler l'API pour générer le rapport
    const response = await generateGuestCheckedOut(params)
    console.log('Réponse du rapport des départs:', response)

    // Traiter la réponse
    if (response && response.success) {
      // Mettre à jour les données du rapport
      reportData.value = response.data || []
      // Mettre à jour les données de réservation pour l'affichage
      reservationData.value = response.data?.reservations || []
      // Afficher les résultats
      showResults.value = true
    } else {
      error.value = response?.message || 'Erreur lors de la génération du rapport des départs'
      console.error('Erreur du serveur:', error.value)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
    error.value = `Erreur lors de la génération du rapport: ${errorMessage}`
    console.error('Erreur détaillée:', err)
  } finally {
    loading.value = false
  }
}

const toggleExportMenu = (): void => {
  exportMenuOpen.value = !exportMenuOpen.value
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV avec filtres:', filters.value)
    const result = await exportData('csv', 'guestCheckedOut', 'guest-checked-out', {
      ...filters.value,
      hotelId: idHotel.value
    })
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
    // Clear previous PDF URL
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    console.log('Export PDF avec filtres:', filters.value)
    const result = await exportData('pdf', 'guestCheckedOut', 'guest-checked-out', {
      ...filters.value,
      hotelId: idHotel.value
    })
    pdfUrl.value = result?.fileUrl || ''
    openPDFInNewPage()
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
    console.log('Export Excel avec filtres:', filters.value)
    const result = await exportData('excel', 'guestCheckedOut', 'guest-checked-out', {
      ...filters.value,
      hotelId: idHotel.value
    })
    console.log('Résultat export Excel:', result)
  } catch (error) {
    console.error('Erreur détaillée Excel:', error)
  } finally {
    exportLoading.value = false
  }
}

const openPDFInNewPage = (): void => {
  if (pdfUrl.value) {
    const encodedUrl = btoa(encodeURIComponent(pdfUrl.value))
    const routeData = router.resolve({
      name: 'PDFViewer',
      query: {
        url: encodedUrl,
        title: t('reports.frontOffice.guestCheckedOut')
      }
    })
    window.open(routeData.href, '_blank')
  }
}

const resetForm = (): void => {
  // Réinitialiser les filtres aux valeurs par défaut
  filters.value = {
    arrivalFrom: '',
    arrivalTo: '',
    departureFrom: '',
    departureTo: '',
    roomType: '',
    roomNumber: '',
    rateType: '',
    showAmount: 'withoutVat',
    rateFrom: '',
    rateTo: '',
    reservationType: '',
    reservationNumber: '',
    company: '',
    travelAgent: '',
    businessSource: '',
    market: '',
    user: '',
    taxInclusive: false,
    checkin: false,
    selectedColumns: [],
    reportTemplate: '',
    filterBy: 'booking'
  }
  
  // Cacher les résultats
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