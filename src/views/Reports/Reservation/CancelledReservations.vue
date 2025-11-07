<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.reservation.cancelledReservations') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.reservation.cancelledReservationsDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Cancellation Dates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.reservation.cancellationFrom') }}
            </label>
            <InputDatepicker
              v-model="filters.cancellationFrom"
              :placeholder="$t('common.from')"
              class="w-full"
              @update:modelValue="updateDateFilter('startDate', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.reservation.cancellationTo') }}
            </label>
            <InputDatepicker
              v-model="filters.cancellationTo"
              :placeholder="$t('common.to')"
              class="w-full"
              @update:modelValue="updateDateFilter('endDate', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <SelectComponent
              v-model="filters.roomType"
              :options="roomTypeOptions"
              :placeholder="$t('common.allRoomTypes')"
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
              :placeholder="$t('common.allRateTypes')"
              class="w-full"
            />
          </div>

          <!-- Company -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.company') }}
            </label>
            <SelectComponent
              v-model="filters.company"
              :options="companyOptions"
              :placeholder="$t('common.allCompanies')"
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
              :options="businessSourceOptions"
              :placeholder="$t('common.allSources')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Market -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.market') }}
            </label>
            <SelectComponent
              v-model="filters.market"
              :options="marketOptions"
              :placeholder="$t('common.allMarkets')"
              class="w-full"
            />
          </div>

          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.user') }}
            </label>
            <SelectComponent
              v-model="filters.user"
              :options="userOptions"
              :placeholder="$t('common.allUsers')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Rate Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.rateFrom') }}
            </label>
            <input
              v-model="filters.rateFrom"
              type="number"
              class="w-full px-3 py-2 border border-black/50 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
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
              class="w-full px-3 py-2 border border-black/50 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              :placeholder="$t('common.to')"
            />
          </div>

          <!-- Tax Inclusive -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                v-model="filters.taxInclusive"
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ $t('reports.reservation.taxInclusiveRates') }}
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
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
                {{ $t('common.csv') }}
              </button>
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
           <!--    <button
                @click="exportExcel"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button> -->
            </div>
          </div>

          <!-- Bouton Report -->
          <button
            @click="generateCancelledReport"
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
            {{ $t('reports.reservation.cancelledReservationsResults') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ $t('common.generated') }}: {{ new Date().toLocaleString('fr-FR') }}</span>
            <span class="ml-4">{{ $t('reports.reservation.totalRecords') }}: {{ reservationData.length }}</span>
          </div>
        </div>

        <!-- Message si aucune donnée -->
        <div v-if="reservationData.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          {{ $t('reports.reservation.noCancelledReservationsFound') }}
        </div>

        <!-- Tableau des résultats -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th v-for="column in tableColumns" :key="column.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <template v-for="(item, index) in tableDataWithRemarks" :key="item.id || index">
                <tr :class="{'bg-gray-50 dark:bg-gray-700': item.isRemarkRow}">
                  <td v-for="column in tableColumns" :key="column.key"
                      class="px-6 py-4 whitespace-nowrap text-sm"
                      :class="{'font-medium text-gray-700 dark:text-gray-300 italic': item.isRemarkRow,
                              'text-gray-900 dark:text-white': !item.isRemarkRow}">
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
              </template>
            </tbody>
          </table>
        </div>

        <!-- Total Row -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ $t('reports.reservation.totalCancelledReservations') }}: {{ totalReservations }}</div>
            <div class="flex gap-4">
              <div>{{ $t('reports.reservation.columns.adr') }}: {{ totalADR }}</div>
              <div>{{ $t('reports.reservation.columns.carRevenue') }}: {{ totalCarRevenue }}</div>
              <div>{{ $t('reports.reservation.columns.charges') }}: {{ totalCharges }}</div>
              <div>{{ $t('reports.reservation.columns.paid') }}: {{ totalPaid }}</div>
              <div>{{ $t('reports.reservation.columns.balance') }}: {{ totalBalance }}</div>
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
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import { generateCancelledList, type ReportFilters, exportData } from '@/services/reportsApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useBooking } from '@/composables/useBooking2'
import { getCompanies } from '@/services/companyApi'
import { getRoomTypes } from '@/services/roomTypeApi'
import { getRateTypes } from '@/services/rateTypeApi'
import { getEmployeesForService } from '@/services/userApi'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface CancelledReservationData {
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
  cancellationFrom: string;
  cancellationTo: string;
  roomType: string;
  rateType: string;
  company: string;
  travelAgent: string;
  businessSource: string;
  market: string;
  user: string;
  rateFrom: string;
  rateTo: string;
  taxInclusive: boolean;
}

interface ReportData {
  title: string;
  html: string;
  generatedAt: string;
  filters: any;
  data?: CancelledReservationData[];
  summary?: any;
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

// Données des réservations annulées (maintenant dynamiques)
const reservationData = ref<CancelledReservationData[]>([])

// Filtres pour l'API
const apiFilters = ref<ReportFilters>({
  startDate: '',
  endDate: '',
  hotelId: idHotel !== null ? idHotel : undefined
})

// Filtres pour l'interface utilisateur
const filters = ref<Filters>({
  cancellationFrom: '',
  cancellationTo: '',
  roomType: '',
  rateType: '',
  company: '',
  travelAgent: '',
  businessSource: '',
  market: '',
  user: '',
  rateFrom: '',
  rateTo: '',
  taxInclusive: true
})

// Options for selects
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
      value: c.id
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
      value: c.id
    }))
  } catch (error) {
    console.error('Error fetching roomType:', error)
  }
}

const fetchUsers = async () => {
  try {
    const resp = await getEmployeesForService(idHotel!)
    console.log('Users:', resp)
    userOptions.value = resp.data.data.map((u: any) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.user_id
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

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

const marketOptions = ref<FilterOptions[]>([
  { value: 'domestic', label: t('common.markets.domestic') },
  { value: 'international', label: t('common.markets.international') }
])

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
        resNo: t('reports.reservation.columns.remarks'),
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

// Mettre à jour les filtres API quand les filtres UI changent
watch(filters, (newFilters) => {
  // Mapper les filtres UI vers les filtres API avec une meilleure gestion des types
  apiFilters.value = {
    ...apiFilters.value,
    startDate: newFilters.cancellationFrom,
    endDate: newFilters.cancellationTo,
    roomTypeId: newFilters.roomType && !isNaN(parseInt(newFilters.roomType))
      ? parseInt(newFilters.roomType) : undefined,
    ratePlanId: newFilters.rateType && !isNaN(parseInt(newFilters.rateType))
      ? parseInt(newFilters.rateType) : undefined,
    company: newFilters.company || undefined,
    travelAgent: newFilters.travelAgent || undefined,
    businessSource: newFilters.businessSource || undefined,
    market: newFilters.market || undefined,
    user: newFilters.user || undefined,
    rateFrom: newFilters.rateFrom && !isNaN(parseFloat(newFilters.rateFrom))
      ? parseFloat(newFilters.rateFrom) : undefined,
    rateTo: newFilters.rateTo && !isNaN(parseFloat(newFilters.rateTo))
      ? parseFloat(newFilters.rateTo) : undefined,
    taxInclusive: newFilters.taxInclusive
  }
}, { deep: true })

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
const generateCancelledReport = async () => {
  loading.value = true
  showResults.value = false

  try {
    console.log('Generating report with filters:', apiFilters.value)
    const response = await generateCancelledList(apiFilters.value)
    console.log('Report Data:', response)

    if (response && response.success && response.data) {
      // Récupérer les données brutes au lieu du HTML
      if (response.data.datas && response.data.datas.data) {
        // Mapper les données du backend vers le format attendu par le frontend
        reservationData.value = response.data.datas.data.map((item: any) => ({
          resNo: item.resNo || t('common.na'),
          bookingDate: item.bookingDate || t('common.na'),
          guest: item.guest || t('common.na'),
          rateType: item.rateType || t('common.na'),
          arrival: item.arrival || t('common.na'),
          departure: item.departure || t('common.na'),
          folioNo: item.folioNo || t('common.na'),
          adr: item.adr || '0.00',
          carRevenue: item.carRevenue || '0.00',
          charges: item.charges || '0.00',
          paid: item.paid || '0.00',
          balance: item.balance || '0.00',
          source: item.source || t('common.na'),
          cancelledBy: item.cancelledBy || t('common.na'),
          cancelledDate: item.cancelledDate || t('common.na'),
          remarks: item.remarks || ''
        }))

        // Stocker aussi les données pour les exports
        reportData.value = {
          title: response.data.title || t('reports.reservation.cancelledReservationsReport'),
          html: response.data.html, // Garder le HTML pour l'export PDF
          generatedAt: response.data.generatedAt,
          filters: response.data.filters,
          data: reservationData.value, // Ajouter les données formatées
          summary: response.data.datas?.summary
        }

        showResults.value = true
      } else {
        console.warn('Aucune donnée trouvée dans la réponse')
        reservationData.value = []
        showResults.value = true
      }
    } else {
      console.error('Réponse invalide du serveur:', response)
    }
  } catch (error) {
    console.error('Erreur:', error)
    reservationData.value = []
  } finally {
    loading.value = false
  }
}

// Fonctions d'export côté frontend
const exportToCSV = () => {
  if (!reservationData.value || reservationData.value.length === 0) {
    console.warn('Aucune donnée à exporter')
    return
  }

  // En-têtes CSV
  const headers = [
    t('reports.reservation.columns.resNo'),
    t('reports.reservation.columns.bookingDate'),
    t('reports.reservation.columns.guest'),
    t('reports.reservation.columns.rateType'),
    t('reports.reservation.columns.arrival'),
    t('reports.reservation.columns.departure'),
    t('reports.reservation.columns.folioNo'),
    t('reports.reservation.columns.adr'),
    t('reports.reservation.columns.carRevenue'),
    t('reports.reservation.columns.charges'),
    t('reports.reservation.columns.paid'),
    t('reports.reservation.columns.balance'),
    t('reports.reservation.columns.source'),
    t('reports.reservation.columns.cancelledBy'),
    t('reports.reservation.columns.cancelledDate'),
    t('reports.reservation.columns.remarks')
  ]

  // Convertir les données en CSV
  const csvContent = [
    headers.join(','),
    ...reservationData.value.map(row => [
      `"${row.resNo}"`,
      `"${row.bookingDate}"`,
      `"${row.guest}"`,
      `"${row.rateType}"`,
      `"${row.arrival}"`,
      `"${row.departure}"`,
      `"${row.folioNo}"`,
      `"${row.adr}"`,
      `"${row.carRevenue}"`,
      `"${row.charges}"`,
      `"${row.paid}"`,
      `"${row.balance}"`,
      `"${row.source}"`,
      `"${row.cancelledBy}"`,
      `"${row.cancelledDate}"`,
      `"${row.remarks || ''}"`
    ].join(','))
  ].join('\n')

  // Télécharger le fichier
  downloadFile(csvContent, 'cancelled-reservations.csv', 'text/csv')
}

/* const exportToExcel = () => {
  if (!reservationData.value || reservationData.value.length === 0) {
    console.warn('Aucune donnée à exporter')
    return
  }

  // Créer les données pour Excel
  const worksheetData = [
    // En-têtes
    ['Res No', 'Booking Date', 'Guest', 'Rate Type', 'Arrival', 'Departure',
     'Folio No', 'ADR', 'Car Revenue', 'Charges', 'Paid', 'Balance',
     'Source', 'Cancelled By', 'Cancelled Date', 'Remarks'],
    // Données
    ...reservationData.value.map(row => [
      row.resNo, row.bookingDate, row.guest, row.rateType, row.arrival, row.departure,
      row.folioNo, row.adr, row.carRevenue, row.charges, row.paid, row.balance,
      row.source, row.cancelledBy, row.cancelledDate, row.remarks || ''
    ])
  ]

  // Ajouter une ligne de totaux
  const totalRow = [
    'TOTAL', '', '', '', '', '',
    '', totalADR.value, totalCarRevenue.value, totalCharges.value,
    totalPaid.value, totalBalance.value, '', '', '', ''
  ]
  worksheetData.push(totalRow)

  // Créer le classeur Excel
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(worksheetData)

  // Ajuster la largeur des colonnes
  const columnWidths = [
    { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 10 },
    { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 30 }
  ]
  ws['!cols'] = columnWidths

  // Styliser la ligne de totaux
  const totalRowIndex = worksheetData.length
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex - 1, c: col })
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "FFDDDDDD" } }
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Cancelled Reservations')

  // Ajouter les métadonnées
  const timestamp = new Date().toLocaleString('fr-FR')
  const fileName = `cancelled-reservations-${new Date().toISOString().split('T')[0]}.xlsx`

  XLSX.writeFile(wb, fileName)
}
 */
// Fonction utilitaire pour télécharger les fichiers
const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Modifier les fonctions d'export existantes
const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    exportToCSV()
  } catch (error) {
    console.error('Erreur export CSV:', error)
  } finally {
    exportLoading.value = false
  }
}
/*
const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    exportToExcel()
  } finally {
    exportLoading.value = false
  }
} */

// Garder l'export PDF via le backend car il utilise le template HTML
const exportPDF = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export PDF avec filtres:', apiFilters.value)
    const result = await exportData('pdf', 'cancelledReservations','cancelled', apiFilters.value)
    console.log('Résultat export PDF:', result)
  } catch (error) {
    console.error('Erreur détaillée PDF:', error)
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
    cancellationFrom: '',
    cancellationTo: '',
    roomType: '',
    rateType: '',
    company: '',
    travelAgent: '',
    businessSource: '',
    market: '',
    user: '',
    rateFrom: '',
    rateTo: '',
    taxInclusive: true
  }
  reservationData.value = []
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

/* Styles pour le contenu HTML du rapport */
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

/* Adaptation pour le mode sombre */
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

/* Custom styling for remark rows */
:deep(.bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #f9fafb;
}

:deep(.dark .bg-white.dark\:bg-gray-800.divide-y.divide-gray-200.dark\:divide-gray-600 tr:has([data-remark-row])) {
  background-color: #374151;
}
</style>
