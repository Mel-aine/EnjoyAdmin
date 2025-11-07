<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.guestCheckedIn') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('reports.frontOffice.guestCheckedInDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Check-in Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.dateFrom') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="t('common.from')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.dateTo') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              :placeholder="t('common.to')"
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
              :placeholder="t('common.select')"
              :loading="loadingRoomTypes"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Show Options -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.show') }}
            </label>
            <SelectComponent 
              v-model="filters.showAmount"
              :options="showAmountOptions"
              :placeholder="t('common.select')"
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
              :placeholder="t('common.select')"
              :loading="loadingRateTypes"
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
              :options="BusinessSource"
              :placeholder="t('common.select')"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4 justify-end">
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
                  {{ t('common.csv') }}
                </button>
                <button 
                  @click="exportPDF" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  :disabled="exportLoading"
                >
                  <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {{ t('common.pdf') }}
                </button>
                <button 
                  @click="exportExcel" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  :disabled="exportLoading"
                >
                  <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ t('common.excel') }}
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
        <!-- En-tête du rapport -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ reportTitle }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ t('reports.generatedAt') }}: {{ formatDate(new Date()) }}</span>
          </div>
        </div>
        
        <!-- Contenu HTML du rapport -->
        <div v-if="reportHtml" v-html="reportHtml" class="report-html-container p-6"></div>
        
        <!-- Fallback si pas de HTML (affichage normal du tableau) -->
        <div v-else>
          <div class="overflow-x-auto">
            <ResultTable 
              :title="t('reports.frontOffice.guestCheckedIn')"
              :data="reservationData"
              :columns="selectedTableColumns"
              class="w-full"
            />
          </div>
          
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>{{ t('reports.reservation.totalReservations') }}: #{{ totalReservations }}</span> • 
            <span>{{ t('reports.reservation.totalPax') }}: {{ totalPax }}</span>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import { generateGuestCheckedIn, exportData } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useRouter } from 'vue-router'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getRateTypes } from '@/services/rateTypeApi'
import { useBooking } from '@/composables/useBooking2'

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
  checkin: boolean;
  selectedColumns: string[];
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)
const loading = ref<boolean>(false)
const exportMenuOpen = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const loadingRoomTypes = ref<boolean>(false)
const loadingRateTypes = ref<boolean>(false)
const serviceStore = useServiceStore()
const idHotel = serviceStore.serviceId
const pdfUrl = ref('')
const router = useRouter()
const reportHtml = ref<string>('')
const reportTitle = ref<string>(t('reports.frontOffice.guestCheckedIn'))

const {
  // Options
  BookingSource,
  BusinessSource,
  BookingType,
  creditTypes,
  billToOptions,
  MarketCode,
  reservationId,
} = useBooking()

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
  checkin: false,
  selectedColumns: [],
  reportTemplate: 'default'
})

// Options for selects
const roomTypeOptions = ref<FilterOptions[]>([])
const rateTypeOptions = ref<FilterOptions[]>([])
const travelAgentOptions = ref<FilterOptions[]>([
  { value: 'agent1', label: t('travelAgents.agent1') },
  { value: 'agent2', label: t('travelAgents.agent2') }
])

const showAmountOptions = ref<FilterOptions[]>([
  { value: 'rent_per_night', label: t('reports.reservation.rentPerNight') },
  { value: 'total_amount', label: t('reports.reservation.totalAmount') }
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
const generateReport = async (): Promise<void> => {
  loading.value = true
  showResults.value = false
  
  try {
    console.log('Generating guest checked-in report with filters:', filters.value)
    // Appel API pour générer le rapport
    const response = await generateGuestCheckedIn({
      ...filters.value,
      rateFrom: filters.value.rateFrom ? Number(filters.value.rateFrom) : undefined,
      rateTo: filters.value.rateTo ? Number(filters.value.rateTo) : undefined,
      hotelId: idHotel !== null ? idHotel : undefined,
    })
    console.log('Report generation response:', response)
    
    if (response && response.success && response.data) {
      // Si l'API retourne du HTML, l'utiliser
      if (response.data.html) {
        reportHtml.value = response.data.html
        if (response.data.title) {
          reportTitle.value = response.data.title
        }
      }
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating report:', error)
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV avec filtres:', filters.value)
    const result = await exportData('csv', 'guestCheckedIn', 'guest-checked-in', {
      ...filters.value,
      rateFrom: filters.value.rateFrom ? Number(filters.value.rateFrom) : undefined,
      rateTo: filters.value.rateTo ? Number(filters.value.rateTo) : undefined,
      hotelId: idHotel !== null ? idHotel : undefined
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
    const result = await exportData('pdf', 'guestCheckedIn', 'guest-checked-in', {
      ...filters.value,
      rateFrom: filters.value.rateFrom ? Number(filters.value.rateFrom) : undefined,
      rateTo: filters.value.rateTo ? Number(filters.value.rateTo) : undefined,
      hotelId: idHotel !== null ? idHotel : undefined
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
    const result = await exportData('excel', 'guestCheckedIn', 'guest-checked-in', {
      ...filters.value,
      rateFrom: filters.value.rateFrom ? Number(filters.value.rateFrom) : undefined,
      rateTo: filters.value.rateTo ? Number(filters.value.rateTo) : undefined,
      hotelId: idHotel !== null ? idHotel : undefined
    })
    console.log('Résultat export Excel:', result)
  } catch (error) {
    console.error('Erreur détaillée Excel:', error)
  } finally {
    exportLoading.value = false
  }
}

const openPDFInNewPage = () => {
  if (pdfUrl.value) {
    const encodedUrl = btoa(encodeURIComponent(pdfUrl.value))
    const routeData = router.resolve({
      name: 'PDFViewer',
      query: {
        url: encodedUrl,
        title: t('reports.frontOffice.guestCheckedIn')
      }
    })
    window.open(routeData.href, '_blank')
  }
}

const formatDate = (date: Date): string => {
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
    checkin: false,
    selectedColumns: [],
    reportTemplate: 'default'
  }
  showResults.value = false
  reportHtml.value = ''
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
}

const editTemplate = (): void => {
  console.log('Editing template...')
}

// Récupérer les room types
const fetchRoomTypes = async () => {
  if (!idHotel) return;
  
  loadingRoomTypes.value = true;
  try {
    const response = await getRoomTypes(idHotel);
    console.log('Room types response:', response);
    
    if (response.data && response.data.data && response.data.data.data) {
      roomTypeOptions.value = response.data.data.data.map((roomType: any) => ({
        value: roomType.id.toString(),
        label: roomType.roomTypeName
      }));
    }
  } catch (error) {
    console.error('Error fetching room types:', error);
  } finally {
    loadingRoomTypes.value = false;
  }
}

// Récupérer les rate types
const fetchRateTypes = async () => {
  if (!idHotel) return;
  
  loadingRateTypes.value = true;
  try {
    const response = await getRateTypes(idHotel);
    console.log('Rate types response:', response);
    
    if (response.data && response.data.data) {
      rateTypeOptions.value = response.data.data.map((rateType: any) => ({
        value: rateType.id.toString(),
        label: rateType.rateTypeName
      }));
    }
  } catch (error) {
    console.error('Error fetching rate types:', error);
  } finally {
    loadingRateTypes.value = false;
  }
}

// Fermer le menu d'export en cliquant à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    exportMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchRoomTypes();
  fetchRateTypes();
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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

/* Animation pour le menu déroulant */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Styles pour le conteneur du rapport */
.report-html-container {
  width: 100%;
}

.report-html-container table {
  width: 100%;
  border-collapse: collapse;
}

.report-html-container th,
.report-html-container td {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
}

/* Adaptation pour le mode sombre */
.dark .report-html-container {
  color: #e5e7eb;
}

.dark .report-html-container th,
.dark .report-html-container td {
  border-color: #4b5563;
  color: #e5e7eb;
}
</style>