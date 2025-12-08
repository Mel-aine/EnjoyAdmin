<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.reservation.noShowReservations') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.reservation.noShowReservationsDescription') }}
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
              {{ $t('common.arrivalFrom') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="$t('common.from')"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.arrivalTo') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              :placeholder="$t('common.to')"
              class="w-full"
            />
          </div>
          
          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              :placeholder="$t('common.selectRoomType')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Rate Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.rateType') }}
            </label>
            <SelectComponent 
              v-model="filters.rateType"
              :options="rateTypeOptions"
              :placeholder="$t('common.selectRateType')"
              class="w-full"
            />
          </div>

          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.businessSource') }}
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="BusinessSource"
              :placeholder="$t('common.selectBusinessSource')"
              class="w-full"
            />
          </div>
          
          <!-- Market -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.market') }}
            </label>
            <SelectComponent 
              v-model="filters.market"
              :options="MarketCode"
              :placeholder="$t('common.selectMarket')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.user') }}
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
              :placeholder="$t('common.selectUser')"
              class="w-full"
            />
          </div>

          <!-- Rate Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.rateFrom') }}
            </label>
            <input 
              v-model="filters.rateFrom" 
              type="number" 
              class="w-full px-3 py-2 border rounded-lg border-black/50 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('common.from')"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.rateTo') }}
            </label>
            <input 
              v-model="filters.rateTo" 
              type="number" 
              class="w-full px-3 rounded-lg py-2 border border-black/50 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('common.to')"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Reservation Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.reservationType') }}
            </label>
            <SelectComponent 
              v-model="filters.reservationType"
              :options="bookingTypeOptions"
              :placeholder="$t('common.selectReservationType')"
              class="w-full"
            />
          </div>

          <!-- Company -->
 <!--          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.company') }}
            </label>
            <SelectComponent 
              v-model="filters.company"
              :options="companyOptions"
              :placeholder="$t('common.selectCompany')"
              class="w-full"
            />
          </div> -->

          <!-- Tax Inclusive -->
          <div class="mt-12">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.taxInclusive" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ $t('reports.reservation.taxInclusiveHint') }}
            </label>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ $t('reports.reservation.taxIncludedInfo') }}</span>
            </div>
          </div>
        </div>



        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200">
          <!-- Bouton d'export avec menu déroulant -->
          <div class="relative">
            <button
              @click="toggleExportMenu"
              :disabled="exportLoading || !showResults"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <svg v-if="exportLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!exportLoading">{{ $t('common.export') }}</span>
              <svg v-if="!exportLoading" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Menu déroulant Export -->
            <div v-if="exportMenuOpen && showResults" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
<!--               <button
                @click="exportCSV"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ $t('common.csv') }}
              </button> -->
              <button
                @click="exportPDF"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {{ $t('common.pdf') }}
              </button>
<!--               <button
                @click="exportExcel"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ $t('common.excel') }}
              </button> -->
            </div>
          </div>

          <!-- Bouton Report -->
          <button
            @click="generateNoShowReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.report') }}
          </button>

          <!-- Bouton Reset -->
          <button
            @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('common.reset') }}
          </button>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- En-tête du rapport -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ reportData?.title || `${$t('reports.reservation.noShowReservations')} ${$t('common.results')}` }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ $t('common.generated') }}: {{ reportData?.generatedAt ? formatDate(reportData.generatedAt) : '' }}</span>
          </div>
        </div>

        <!-- Table des résultats -->
        <div class="overflow-x-auto">
          <ResultTable
            :title="`${$t('reports.reservation.noShowReservations')} ${$t('common.results')}`"
            :data="tableData"
            :columns="selectedTableColumns"
            class="w-full"
          />
        </div>

        <!-- Summary -->
        <div v-if="reportData?.datas?.summary" class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <span>{{ $t('reports.reservation.totalReservations') }}: {{ reportData.datas.summary.totalNoShows }}</span>
            <span>{{ $t('reports.reservation.totalNights') }}: {{ reportData.datas.summary.totalNights }}</span>
            <span>{{ $t('reports.reservation.totalPax') }}: {{ reportData.datas.summary.totalAdults + reportData.datas.summary.totalChildren }}</span>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generateNoShowList, type ReportFilters, exportData } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useBooking } from '@/composables/useBooking2'
import { getCompanies } from '@/services/companyApi'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getRateTypes } from '@/services/rateTypeApi'
import { useRouter } from 'vue-router'
import { getEmployeesForService } from '@/services/userApi'
import { useI18n } from 'vue-i18n'

interface FilterOptions {
  value: string;
  label: string;
}

interface Filters {
  arrivalFrom: string;
  arrivalTo: string;
  roomType: string;
  rateType: string;
  rateFrom: string;
  rateTo: string;
  reservationType: string;
  company: string;
  businessSource: string;
  market: string;
  user: string;
  taxInclusive: boolean;
}

interface ReportData {
  title: string;
  html: string;
  generatedAt: string;
  filters: any;
  datas: {
    data: any[];
    summary: any;
  };
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)
const reportData = ref<ReportData | null>(null)
const loading = ref<boolean>(false)
const exportMenuOpen = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const serviceStore = useServiceStore()
const companyOptions = ref<FilterOptions[]>([])
const roomTypeOptions = ref<FilterOptions[]>([])
const rateTypeOptions = ref<FilterOptions[]>([])
const userOptions = ref<FilterOptions[]>([])
const idHotel = serviceStore.serviceId

const { t } = useI18n()
const router = useRouter()

const getTodayDate = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getYesterdayDate = (): string => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Filtres pour l'interface utilisateur
const filters = ref<Filters>({
  arrivalFrom: getYesterdayDate(),
  arrivalTo: getTodayDate(),
  roomType: '',
  rateType: '',
  rateFrom: '',
  rateTo: '',
  reservationType: '',
  company: '',
  businessSource: '',
  market: '',
  user: '',
  taxInclusive: false
})

const pdfUrl = ref('')

const reportTitle = computed(() => {
  return reportData.value?.title || t('reports.reservation.noShowReservationsReport')
})

// Computed pour les filtres API
const apiFilters = computed<ReportFilters>(() => {
  return {
    startDate: filters.value.arrivalFrom,
    endDate: filters.value.arrivalTo,
    hotelId: idHotel !== null ? idHotel : undefined,
    roomTypeId: filters.value.roomType ? parseInt(filters.value.roomType) : undefined,
    ratePlanId: filters.value.rateType ? parseInt(filters.value.rateType) : undefined,
    company: filters.value.company || undefined,
    businessSource: filters.value.businessSource || undefined,
    market: filters.value.market || undefined,
    userId: filters.value.user ? parseInt(filters.value.user) : undefined,
    rateFrom: filters.value.rateFrom ? parseFloat(filters.value.rateFrom) : undefined,
    rateTo: filters.value.rateTo ? parseFloat(filters.value.rateTo) : undefined,
    reservationType: filters.value.reservationType || undefined,
    taxInclusive: filters.value.taxInclusive
  }
})

// Options for selects - Fetch from API
const getCompaniesList = async () => {
  try {
    const resp = await getCompanies()
    console.log('Companies response:', resp)
    companyOptions.value = Array.isArray(resp)
      ? resp.map((c: any) => ({
          label: c.companyName,
          value: c.companyCode
        }))
      : []
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
}

const fetchRoomtype = async () => {
  try {
    const resp = await getRoomTypes(idHotel!)
    console.log('Room Type:', resp)
    roomTypeOptions.value = resp.data.data.data.map((c: any) => ({
      label: c.roomTypeName,
      value: c.id.toString()
    }))
  } catch (error) {
    console.error('Error fetching roomType:', error)
  }
}

const fetchRatetype = async () => {
  try {
    const resp = await getRateTypes(idHotel!)
    console.log('Rate Type:', resp)
    rateTypeOptions.value = resp.data.data.map((c: any) => ({
      label: c.rateTypeName,
      value: c.id.toString()
    }))
  } catch (error) {
    console.error('Error fetching rateType:', error)
  }
}

const fetchUsers = async () => {
  try {
    const resp = await getEmployeesForService(idHotel!)
    console.log('Users:', resp)
    userOptions.value = resp.data.data.map((u: any) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.user_id.toString()
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const {
  BookingSource,
  BusinessSource,
  BookingType,
  creditTypes,
  billToOptions,
  MarketCode,
  reservationId,
} = useBooking()

// Traduction dynamique des types de réservation provenant de l'API/store
const normalizeKey = (name: string): string => {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const bookingTypeOptions = computed<FilterOptions[]>(() => {
  const list: any[] = (BookingType as any).value || []
  return list.map((opt: any) => {
    const rawLabel = opt.label ?? opt.name ?? ''
    const key = `reservation.types.${normalizeKey(rawLabel)}`
    const translated = t(key)
    const finalLabel = translated === key ? rawLabel : translated
    return { value: opt.value ?? String(opt.id), label: finalLabel }
  })
})

// Computed pour les données du tableau
const tableData = computed(() => {
  if (!reportData.value?.datas?.data) return []

  return reportData.value.datas.data.map((item: any) => ({
    reservationNumber: item.reservationNumber,
    guestName: item.guestName,
    roomType: item.roomType,
    roomNumber: item.roomNumber,
    arrivalDate: item.arrivalDate,
    departureDate: item.departureDate,
    totalPax: item.totalPax,
    businessSource: item.businessSource,
    reservationType: item.reservationType,
    createdBy: item.createdBy,
    status: item.status
  }))
})

// Computed pour les colonnes du tableau
const selectedTableColumns = computed(() => {
  return [
    { key: 'reservationNumber', label: t('reports.reservation.columns.resNo') },
    { key: 'guestName', label: t('common.guest') },
    { key: 'roomType', label: t('common.roomType') },
    { key: 'roomNumber', label: t('common.roomNumber') },
    { key: 'arrivalDate', label: t('common.arrival') },
    { key: 'departureDate', label: t('common.departure') },
    { key: 'totalPax', label: t('common.pax') },
    { key: 'businessSource', label: t('common.businessSource') },
    { key: 'reservationType', label: t('reports.reservation.columns.reservationTypeShort') },
    { key: 'createdBy', label: t('common.user') },
    { key: 'status', label: t('common.status') }
  ]
})

// Methods
const generateNoShowReport = async () => {
  loading.value = true
  showResults.value = false

  try {
    console.log('Generating no-show report with filters:', apiFilters.value)
    const response = await generateNoShowList(apiFilters.value)
    console.log('Report Data:', response)

    if (response && response.success && response.data) {
      reportData.value = response.data
      showResults.value = true
    }
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV avec filtres:', apiFilters.value)
    const result = await exportData('csv', 'noShowList', 'no-show-list', apiFilters.value)
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

    console.log('Export PDF avec filtres:', apiFilters.value)
    
    // Utiliser la même route que generateNoShowReport
    const response = await generateNoShowList(apiFilters.value)
    console.log('PDF Report Data:', response)

    // Vérifier la structure: response.data.html
    if (response && response.data && response.data.html) {
      // Créer un Blob à partir du HTML
      const htmlBlob = new Blob([response.data.html], { type: 'text/html' })
      
      // Créer une URL pour le blob
      pdfUrl.value = URL.createObjectURL(htmlBlob)
      
      // Ouvrir dans une nouvelle page
      openPDFInNewPage()
      
      console.log('PDF généré avec succès')
    } else {
      console.error('Pas de HTML dans la réponse:', response)
    }
  } catch (error) {
    console.error('Erreur détaillée PDF:', error)
  } finally {
    exportLoading.value = false
  }
}

const openPDFInNewPage = () => {
  if (pdfUrl.value) {
    // Ouvrir une nouvelle fenêtre vide
    const newWindow = window.open('', '_blank')
    
    if (newWindow) {
      // Écrire le HTML directement dans la nouvelle fenêtre
      fetch(pdfUrl.value)
        .then(response => response.text())
        .then(htmlContent => {
          newWindow.document.write(htmlContent)
          newWindow.document.close()
          
          // Attendre que le contenu soit chargé pour déclencher l'impression
          setTimeout(() => {
            newWindow.print()
          }, 500)
        })
        .catch(error => {
          console.error('Erreur lors du chargement du HTML:', error)
          newWindow.close()
        })
    } else {
      console.error('Impossible d\'ouvrir la nouvelle fenêtre')
    }
  }
}


const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel avec filtres:', apiFilters.value)
    const result = await exportData('excel', 'noShowList', 'no-show-list', apiFilters.value)
    console.log('Résultat export Excel:', result)
  } catch (error) {
    console.error('Erreur détaillée Excel:', error)
  } finally {
    exportLoading.value = false
  }
}

/* const openPDFInNewPage = () => {
  if (pdfUrl.value) {
    const encodedUrl = btoa(encodeURIComponent(pdfUrl.value))
    const routeData = router.resolve({
      name: 'PDFViewer',
      query: {
        url: encodedUrl,
        title: reportTitle.value
      }
    })
    window.open(routeData.href, '_blank')
  }
} */

const formatDate = (dateString: string): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

const formatCurrency = (amount: number): string => {
  if (!amount && amount !== 0) return t('common.na')
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF'
  }).format(amount)
}

const resetForm = (): void => {
  filters.value = {
    arrivalFrom: getYesterdayDate(),
    arrivalTo: getTodayDate(),
    roomType: '',
    rateType: '',
    rateFrom: '',
    rateTo: '',
    reservationType: '',
    company: '',
    businessSource: '',
    market: '',
    user: '',
    taxInclusive: false
  }
  showResults.value = false
  reportData.value = null
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
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
  getCompaniesList()
  fetchRoomtype()
  fetchRatetype()
  fetchUsers()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
</style>