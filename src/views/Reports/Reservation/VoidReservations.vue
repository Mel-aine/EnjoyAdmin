<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.reservation.voidReservation') }}
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Cancellation Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.reservation.voidFrom') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="t('common.from')"
              class="w-full"
              @update:modelValue="updateDateFilter('startDate', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.reservation.voidTo') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalTo" 
              :placeholder="t('common.to')"
              class="w-full"
              @update:modelValue="updateDateFilter('endDate', $event)"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
          <!-- Export Button with dropdown -->
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
            
            <!-- Export Dropdown Menu -->
            <div v-if="exportMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
<!--               <button 
                @click="exportCSV" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ t('common.csv') }}
              </button> -->
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
<!--               <button 
                @click="exportExcel" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ t('common.excel') }}
              </button> -->
            </div>
          </div>
          
          <!-- Report Button -->
          <button 
            @click="generateVoidReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ t('common.report') }}
          </button>
          
          <!-- Reset Button -->
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

      <!-- Results Table or HTML Report -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Report header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ translatedReportTitle }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ t('common.generated') }}: {{ reportData?.generatedAt ? formatDate(reportData.generatedAt) : '' }}</span>
          </div>
        </div>
        
        <!-- HTML Report Content -->
        <div v-if="reportData?.html" v-html="translatedHtml" class="report-html-container"></div>
        
        <!-- Fallback if no HTML (normal table display) -->
        <div v-else>
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
              <div>{{ t('reports.reservation.totalVoidReservations') }}: {{ totalReservations }}</div>
              <div class="flex gap-4">
                <div>{{ t('reports.reservation.columns.adr') }}: {{ totalADR }}</div>
                <div>{{ t('reports.reservation.columns.carRevenue') }}: {{ totalCarRevenue }}</div>
                <div>{{ t('reports.reservation.columns.charges') }}: {{ totalCharges }}</div>
                <div>{{ t('reports.reservation.columns.paid') }}: {{ totalPaid }}</div>
                <div>{{ t('reports.reservation.columns.balance') }}: {{ totalBalance }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { generateVoidList, type ReportFilters, exportData } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const serviceStore = useServiceStore()
const router = useRouter()
const idHotel = serviceStore.serviceId

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

interface ReportData {
  title: string;
  html: string;
  generatedAt: string;
  filters: any;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)
const reportData = ref<ReportData | null>(null)
const loading = ref<boolean>(false)
const exportMenuOpen = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const pdfUrl = ref('')

// API Filters
const apiFilters = ref<ReportFilters>({
  startDate: '',
  endDate: '',
  hotelId: idHotel !== null ? idHotel : undefined
})

// UI Filters (only the two date fields from the original code)
const filters = ref({
  arrivalFrom: '',
  arrivalTo: ''
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

const reportTitle = computed(() => {
  return reportData.value?.title || t('reports.reservation.voidReservationResults')
})

// Traduit des fragments HTML renvoyés par l'API (fallback côté client)
const translateReportHtml = (html: string): string => {
  if (!html) return html
  let out = html.replace(/&nbsp;/gi, ' ')
  const replacements: Record<string, string> = {
    // Titres et descriptions
    'Void Reservations Report': t('reports.reservation.voidReservationResults'),
    'VOID RESERVATIONS REPORT': t('reports.reservation.voidReservationResults').toUpperCase(),
    // Entêtes (avec et sans deux-points)
    'Hotel:': t('reports.reservation.hotel') + ':',
    'Hotel': t('reports.reservation.hotel'),
    'Void From:': t('reports.reservation.voidFrom') + ':',
    'Void From': t('reports.reservation.voidFrom'),
    'From:': t('common.from') + ':',
    'From': t('common.from'),
    'To:': t('common.to') + ':',
    'To': t('common.to'),
    'Order By:': t('reports.reservation.orderBy') + ':',
    'Order By': t('reports.reservation.orderBy'),
    'Room': t('common.room'),
    'Tax Inclusive:': t('reports.reservation.taxInclusive') + ':',
    'Tax Inclusive': t('reports.reservation.taxInclusive'),
    'Yes': t('common.yes'),
    'No': t('common.no'),
    // Colonnes - en-têtes de tableau (insensible à la casse et avec variantes)
    '>RES\\. NO<': '>' + t('reports.reservation.columns.resNo').toUpperCase() + '<',
    '>RES\\. NON<': '>' + t('reports.reservation.columns.resNo').toUpperCase() + '<',
    '>BOOKING DATE<': '>' + t('reports.reservation.columns.bookingDate').toUpperCase() + '<',
    '>GUEST<': '>' + t('reports.reservation.columns.guest').toUpperCase() + '<',
    '>RATE TYPE<': '>' + t('reports.reservation.columns.rateType').toUpperCase() + '<',
    '>ARRIVAL<': '>' + t('reports.reservation.columns.arrival').toUpperCase() + '<',
    '>DEPARTURE<': '>' + t('reports.reservation.columns.departure').toUpperCase() + '<',
    '>FOLIO NO<': '>' + t('reports.reservation.columns.folioNo').toUpperCase() + '<',
    '>FOLIO\\. NO<': '>' + t('reports.reservation.columns.folioNo').toUpperCase() + '<',
    '>ADR<': '>' + t('reports.reservation.columns.adr').toUpperCase() + '<',
    '>CAR REVENUE<': '>' + t('reports.reservation.columns.carRevenue').toUpperCase() + '<',
    '>CHARGES<': '>' + t('reports.reservation.columns.charges').toUpperCase() + '<',
    '>PAID<': '>' + t('reports.reservation.columns.paid').toUpperCase() + '<',
    '>BALANCE<': '>' + t('reports.reservation.columns.balance').toUpperCase() + '<',
    '>SOURCE<': '>' + t('reports.reservation.columns.source').toUpperCase() + '<',
    '>SOURCI<': '>' + t('reports.reservation.columns.source').toUpperCase() + '<',
    '>CANCELLED BY<': '>' + t('reports.reservation.columns.cancelledBy').toUpperCase() + '<',
    '>CANCELLED DATE<': '>' + t('reports.reservation.columns.cancelledDate').toUpperCase() + '<',
    // Sans les balises HTML (pour les cas où ils sont dans du texte)
    'RES. NO': t('reports.reservation.columns.resNo').toUpperCase(),
    'RES. NON': t('reports.reservation.columns.resNo').toUpperCase(),
    'BOOKING DATE': t('reports.reservation.columns.bookingDate').toUpperCase(),
    'GUEST': t('reports.reservation.columns.guest').toUpperCase(),
    'RATE TYPE': t('reports.reservation.columns.rateType').toUpperCase(),
    'ARRIVAL': t('reports.reservation.columns.arrival').toUpperCase(),
    'DEPARTURE': t('reports.reservation.columns.departure').toUpperCase(),
    'FOLIO NO': t('reports.reservation.columns.folioNo').toUpperCase(),
    'FOLIO. NO': t('reports.reservation.columns.folioNo').toUpperCase(),
    'ADR': t('reports.reservation.columns.adr').toUpperCase(),
    'CAR REVENUE': t('reports.reservation.columns.carRevenue').toUpperCase(),
    'CHARGES': t('reports.reservation.columns.charges').toUpperCase(),
    'PAID': t('reports.reservation.columns.paid').toUpperCase(),
    'BALANCE': t('reports.reservation.columns.balance').toUpperCase(),
    'SOURCE': t('reports.reservation.columns.source').toUpperCase(),
    'SOURCI': t('reports.reservation.columns.source').toUpperCase(),
    'CANCELLED BY': t('reports.reservation.columns.cancelledBy').toUpperCase(),
    'CANCELLED DATE': t('reports.reservation.columns.cancelledDate').toUpperCase(),
    // Totaux
    'Total Void Reservations:': t('reports.reservation.totalVoidReservations') + ':',
    'Total Void Reservations': t('reports.reservation.totalVoidReservations'),
    'Generated on': t('reports.generatedOn'),
    'records': t('reports.records'),
    'columns displayed': t('reports.columnsDisplayed'),
    'reports.generatedOn': t('reports.generatedOn'),
    'reports.records': t('reports.records'),
    'reports.columnsDisplayed': t('reports.columnsDisplayed'),
    // Valeurs courantes éventuelles
    'Directly': t('bookings.sources.direct'),
    'Direct': t('bookings.sources.direct'),
    'System': t('common.system'),
    // Gérer N/A avec différentes variantes
    ' N/A ': ' ' + t('common.na') + ' ',
    ' N/A': ' ' + t('common.na'),
    'N/A ': t('common.na') + ' ',
    ': N/A': ': ' + t('common.na'),
    'N/A': t('common.na'),
  }

  // Traduire explicitement les titres principaux (avec ou sans espaces)
  const translatedTitle = t('reports.reservation.voidReservationResults')
  out = out.replace(/VOID\s+RESERVATIONS\s+REPORT/gi, () => translatedTitle.toUpperCase())
  out = out.replace(/Void\s+Reservations\s+Report/gi, () => translatedTitle)
  out = out.replace(/>\s*Void\s+Reservations\s+Report\s*</gi, () => `>${translatedTitle}<`)

  // Traiter d'abord les remplacements avec balises HTML
  for (const [en, fr] of Object.entries(replacements)) {
    if (en.startsWith('>') && en.endsWith('<')) {
      // Remplacement avec contexte HTML
      const regex = new RegExp(en, 'gi')
      out = out.replace(regex, fr)
    }
  }
  
  // Traiter ensuite N/A avec différentes variantes (ordre important : les plus spécifiques d'abord)
  const naValue = t('common.na')
  const naReplacements = [
    // Avec espaces et contexte spécifiques
    { pattern: /:\s*N\/A/gi, replacement: `: ${naValue}` },
    { pattern: /\s+N\/A\s+/g, replacement: ` ${naValue} ` },
    { pattern: /\s+N\/A(?=\s|$|:)/gi, replacement: ` ${naValue}` },
    { pattern: /(?<=^|\s|:)N\/A\s+/gi, replacement: `${naValue} ` },
    // Cas général
    { pattern: /N\/A/gi, replacement: naValue }
  ]
  
  for (const { pattern, replacement } of naReplacements) {
    out = out.replace(pattern, replacement)
  }
  
  // Ensuite les remplacements simples (sans balises, sauf N/A déjà traité)
  // Traiter d'abord les variantes avec deux-points pour éviter les remplacements partiels
  const colonReplacements = [
    { pattern: /\bVoid From:\s*/gi, replacement: t('reports.reservation.voidFrom') + ': ' },
    { pattern: /\bOrder By:\s*/gi, replacement: t('reports.reservation.orderBy') + ': ' },
    { pattern: /\bHotel:\s*/gi, replacement: t('reports.reservation.hotel') + ': ' },
    { pattern: /\bFrom:\s*/gi, replacement: t('common.from') + ': ' },
    { pattern: /\bTo:\s*/gi, replacement: t('common.to') + ': ' },
    { pattern: /\bTax Inclusive:\s*/gi, replacement: t('reports.reservation.taxInclusive') + ': ' }
  ]
  
  for (const { pattern, replacement } of colonReplacements) {
    out = out.replace(pattern, replacement)
  }
 
  // Traduire la ligne de synthèse "Generated on ... | ... records | ... columns displayed"
  const summaryPattern = /Generated\s+on\s+([^|]+)\|\s*(\d+)\s+records\s*\|\s*(\d+)\s+columns\s+displayed/gi
  out = out.replace(summaryPattern, (_match, datePart, recordCount, columnCount) => {
    const dateText = datePart.trim()
    return `${t('reports.generatedOn')} ${dateText} | ${recordCount} ${t('reports.records')} | ${columnCount} ${t('reports.columnsDisplayed')}`
  })

  // Ensuite les autres remplacements simples (sans balises, sauf N/A et ceux avec deux-points déjà traités)
  for (const [en, fr] of Object.entries(replacements)) {
    if ((!en.startsWith('>') || !en.endsWith('<')) && !en.includes('N/A') && !en.endsWith(':')) {
      // Remplacement insensible à la casse pour couvrir les variantes
      const escaped = en.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const regex = new RegExp('\\b' + escaped + '\\b', 'gi')
      out = out.replace(regex, fr)
    }
  }
  
  return out
}

const translatedHtml = computed(() => translateReportHtml(reportData.value?.html || ''))

const translatedReportTitle = computed(() => {
  const rawTitle = reportData.value?.title
  if (!rawTitle) return t('reports.reservation.voidReservationResults')
  const normalized = translateReportHtml(rawTitle)
  return normalized || t('reports.reservation.voidReservationResults')
})

// Watch for filter changes
watch(filters, (newFilters) => {
  apiFilters.value = {
    ...apiFilters.value,
    startDate: newFilters.arrivalFrom,
    endDate: newFilters.arrivalTo
  }
}, { deep: true })

// Methods
const generateVoidReport = async () => {
  loading.value = true
  showResults.value = false
  
  try {
    console.log('Generating void report with filters:', apiFilters.value)
    const response = await generateVoidList(apiFilters.value)
    console.log('Report Data:', response)
    
    if (response && response.success && response.data) {
      reportData.value = response.data
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating void report:', error)
  } finally {
    loading.value = false
  }
}

const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV with filters:', apiFilters.value)
    const result = await exportData('csv', 'voidReservations', 'void', apiFilters.value)
    console.log('CSV export result:', result)
  } catch (error) {
    console.error('CSV export error:', error)
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

    console.log('Export PDF with filters:', apiFilters.value)
    const result = await exportData('pdf', 'voidReservations', 'void', apiFilters.value)
    pdfUrl.value = result?.fileUrl || ''
    openPDFInNewPage()
    console.log('PDF export result:', result)
  } catch (error) {
    console.error('PDF export error:', error) 
  } finally {
    exportLoading.value = false
  }
}

const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel with filters:', apiFilters.value)
    const result = await exportData('excel', 'voidReservations', 'void', apiFilters.value)
    console.log('Excel export result:', result)
  } catch (error) {
    console.error('Excel export error:', error)
  } finally {
    exportLoading.value = false
  }
}

const updateDateFilter = (field: 'startDate' | 'endDate', value: string) => {
  if (value) {
    const date = new Date(value)
    apiFilters.value[field] = date.toISOString().split('T')[0]
  } else {
    apiFilters.value[field] = ''
  }
}

const openPDFInNewPage = () => {
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
}

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

const resetForm = (): void => {
  filters.value = {
    arrivalFrom: '',
    arrivalTo: ''
  }
  showResults.value = false
  reportData.value = null
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
}

// Close export menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    exportMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom styling for remark rows */
:deep(.bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #f9fafb;
}

:deep(.dark .bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #374151;
}

/* Styles for HTML report content */
:deep(.report-html-container) {
  width: 100%;
}

:deep(.report-html-container table) {
  width: 100%;
  border-collapse: collapse;
}

:deep(.report-html-container th),
:deep(.report-html-container td) {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
}

:deep(.report-html-container .report-container) {
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}

:deep(.report-html-container .results-table) {
  font-size: 12px;
}

/* Dark mode adaptation */
.dark :deep(.report-html-container) {
  color: #e5e7eb;
}

.dark :deep(.report-html-container .report-container) {
  background-color: transparent;
}

.dark :deep(.report-html-container th),
.dark :deep(.report-html-container td) {
  border-color: #4b5563;
  color: #e5e7eb;
}

/* Export button styles */
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

/* Dropdown menu animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>