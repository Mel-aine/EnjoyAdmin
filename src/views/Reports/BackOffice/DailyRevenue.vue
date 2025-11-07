<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('Daily Revenue Reports') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('viewAndManageDailyRevenue') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <!-- Date Selection Radio Buttons -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ $t('Date') }}
          </label>
          <div class="flex gap-6">
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="filters.dateType" 
                value="booking"
                class="form-radio h-4 w-4 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Booking') }}</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="filters.dateType" 
                value="stay"
                class="form-radio h-4 w-4 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Stay') }}</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="filters.dateType" 
                value="departure"
                class="form-radio h-4 w-4 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Departure') }}</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('From') }}
            </label>
            <InputDatepicker 
              v-model="filters.fromDate" 
              :placeholder="$t('dateFormat')"
              class="w-full"
            />
          </div>
          
          <!-- To Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('To') }}
            </label>
            <InputDatepicker 
              v-model="filters.toDate" 
              :placeholder="$t('dateFormat')"
              class="w-full"
            />
          </div>

          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Business Source') }}
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="BusinessSource"
              :placeholder="$t('select')"
              :multiple="false"
              class="w-full"
            />
          </div>

          <!-- Room -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('Room') }}
            </label>
            <SelectComponent 
              v-model="filters.room"
              :options="roomOptions"
              :placeholder="$t('select')"
              :multiple="false"
              class="w-full"
            />
          </div>
        </div>

        <!-- Checkboxes Row -->
        <div class="flex flex-wrap gap-6 mb-6">
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="filters.showOnlyUnassignRooms"
              class="form-checkbox h-4 w-4 text-blue-600 rounded"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Show Only Unassign Rooms') }}</span>
          </label>
     <!--      <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="filters.showUnpostedInclusion"
              class="form-checkbox h-4 w-4 text-blue-600 rounded"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Show Unposted Inclusion') }}</span>
          </label> -->
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="filters.discardUnconfirmedBookings"
              class="form-checkbox h-4 w-4 text-blue-600 rounded"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Discard Unconfirmed Bookings') }}</span>
          </label>
        </div>

        <!-- Export Settings Section -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {{ $t('belowSettingsAvailableOnlyForExport') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('Payment Method') }}
              </label>
              <div class="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                <div class="p-4 pb-1 border-b border-gray-300 dark:border-gray-600">
                  <label class="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="filters.paymentMethod.length === paymentMethodOptions.length"
                      @change="toggleAllPaymentMethods"
                      class="form-checkbox h-4 w-4 text-blue-600 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">{{ $t('Select All') }}</span>
                  </label>
                </div>
                <div class="max-h-40 overflow-y-auto p-2">
                  <label v-for="option in paymentMethodOptions" :key="option.value" class="flex items-center py-1 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 rounded">
                    <input 
                      type="checkbox" 
                      :value="option.value"
                      v-model="filters.paymentMethod"
                      class="form-checkbox h-4 w-4 text-blue-600 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ option.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Taxes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('Taxes') }}
              </label>
              <div class="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                <div class="p-4 pb-1 border-b border-gray-300 dark:border-gray-600">
                  <label class="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="filters.taxes.length === taxesOptions.length"
                      @change="toggleAllTaxes"
                      class="form-checkbox h-4 w-4 text-blue-600 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">{{ $t('Select All') }}</span>
                  </label>
                </div>
                <div class="max-h-40 overflow-y-auto p-2">
                  <label v-for="option in taxesOptions" :key="option.value" class="flex items-center py-1 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 rounded">
                    <input 
                      type="checkbox" 
                      :value="option.value"
                      v-model="filters.taxes"
                      class="form-checkbox h-4 w-4 text-blue-600 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ option.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Note -->
          <div class="p-3 mb-4">
            <p class="text-xs text-gray-900 dark:text-gray-100">
              <strong>{{ $t('note') }}:</strong> {{ $t('nightsCalculationNote') }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2">
          <!-- Export Button -->
          <button 
            @click="exportData" 
            :disabled="isLoading || !filters.fromDate || !filters.toDate"
            class="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <span v-if="!isLoading">{{ $t('Export') }}</span>
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
          
          <!-- Report Button -->
          <button
            @click="generateReport"
            :disabled="isLoading || !filters.fromDate || !filters.toDate"
            class="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            {{ $t('Report') }}
          </button>
          
          <!-- Reset Button -->
          <button
            @click="resetForm"
            class="inline-flex justify-center items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            {{ $t('Reset') }}
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6 dark:bg-red-900/20">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700 dark:text-red-200">{{ errorMessage }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="errorMessage = ''" class="text-red-400 hover:text-red-600">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Report Display Section -->
      <div v-if="showReport && reportData" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <!-- Report Header -->
        <div class="flex justify-between items-center p-6 border-b-2 border-gray-900 dark:border-gray-700">
          <h1 class="text-lg font-bold text-blue-900 dark:text-blue-400">
            {{ reportData.hotelDetails?.hotelName || $t('hotelName') }}
          </h1>
          <h2 class="text-lg font-bold text-red-700 dark:text-red-400">
            {{ $t('detailRevenueReport') }}
          </h2>
        </div>

        <!-- Filters Info Section -->
        <div class="px-6 py-4 text-xs border-b-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="mb-2">
            <span class="font-semibold">{{ $t('queryFrom') }}:</span> {{ reportData.dateRange?.fromDate }} 
            <span class="font-semibold ml-4">{{ $t('To') }}:</span> {{ reportData.dateRange?.toDate }} 
            <span class="font-semibold ml-4">{{ $t('dateType') }}:</span> {{ formatDateType(reportData.filters?.dateType) }} 
            <span class="font-semibold ml-4">{{ $t('showGuestUnassignedRooms') }}:</span> {{ reportData.filters?.showUnassignRooms ? $t('yes') : $t('no') }} 
            <span class="font-semibold ml-4">{{ $t('Discard Unconfirmed Bookings') }}:</span> {{ reportData.filters?.discardUnconfirmedBookings ? $t('yes') : $t('no') }} 
            <!-- <span class="font-semibold ml-4">Include Unposted Inclusion:</span> {{ reportData.filters?.showUnpostedInclusion ? 'Yes' : 'No' }} -->
          </div>
          <div class="font-semibold mb-1">
            *{{ $t('totalRevenueNote') }}
          </div>
          <div class="font-bold">
            *{{ $t('roomRateNote') }}
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b-2 border-gray-900 dark:border-gray-700">
                <th class="px-2 py-3 text-center font-bold">{{ $t('serialNumber') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('guestName') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('source') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('arrival') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('departure') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('nights') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('Room') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('voucherNumber') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('rateType') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('folioNumber') }}</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('roomRate') }}<br>(XAF)</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('charges') }}<br>(XAF)</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('taxes') }}<br>(XAF)</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('commission') }}<br>(XAF)</th>
                <th class="px-2 py-3 text-center font-bold">{{ $t('revenue') }}<br>(XAF)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!reportData.reportData?.reservations || reportData.reportData.reservations.length === 0">
                <td colspan="15" class="px-2 py-6 text-center text-gray-500 italic">
                  {{ $t('noReservationsFoundForPeriod') }}
                </td>
              </tr>
              <template v-else>
                <tr v-for="reservation in reportData.reportData.reservations" :key="reservation.serialNo" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td class="px-2 py-2 text-center">{{ reservation.serialNo }}</td>
                  <td class="px-2 py-2 text-left">{{ reservation.guestName }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.businessSource }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.arrivalDate }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.departureDate }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.nights }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.room }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.voucherNo }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.rateType }}</td>
                  <td class="px-2 py-2 text-center">{{ reservation.folioNo }}</td>
                  <td class="px-2 py-2 text-right">{{ formatCurrency(reservation.roomRate) }}</td>
                  <td class="px-2 py-2 text-right">-</td>
                  <td class="px-2 py-2 text-right">{{ formatCurrency(reservation.totalTaxes) }}</td>
                  <td class="px-2 py-2 text-right">{{ formatCurrency(reservation.commission) }}</td>
                  <td class="px-2 py-2 text-right">{{ formatCurrency(reservation.totalRevenue - reservation.commission) }}</td>
                </tr>
                
                <!-- Grand Total Row -->
                <tr class="border-t-2 border-b-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold">
                  <td class="px-2 py-3 text-left">{{ $t('grandTotal') }}</td>
                  <td colspan="9" class="px-2 py-3 text-right">{{ formatCurrency(reportData.grandTotals?.totalRoomRate) }}</td>
                  <td class="px-2 py-3 text-right">-</td>
                  <td class="px-2 py-3 text-right">{{ formatCurrency(reportData.grandTotals?.totalTaxes) }}</td>
                  <td class="px-2 py-3 text-right">{{ formatCurrency(reportData.grandTotals?.totalCommission) }}</td>
                  <td class="px-2 py-3 text-right">{{ formatCurrency(reportData.grandTotals?.totalRevenue - reportData.grandTotals?.totalCommission) }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { getPaymentMethods } from '@/services/paymentMethodApi'
import { getExtraCharges, getTaxes, getRooms } from '@/services/configrationApi'
import { useBooking } from '@/composables/useBooking2'
import {
  generateDailyRevenuPdf,
  generateDailyRevenueReport,
  type DailyRevenueReportFilters
} from '@/services/reportsApi'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

interface FilterOptions {
  value: string;
  label: string;
}

interface Filters {
  dateType: 'booking' | 'stay' | 'departure';
  fromDate: string;
  toDate: string;
  businessSource: string;
  room: string;
  showOnlyUnassignRooms: boolean;
  showUnpostedInclusion: boolean;
  discardUnconfirmedBookings: boolean;
  extraCharges: string[];
  paymentMethod: string[];
  taxes: string[];
  showMobileNoField: boolean;
  showEmailField: boolean;
  reportTemplate: string;
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

// Reactive data
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')
const pdfUrl = ref<string>('')
const showReport = ref<boolean>(false)
const reportData = ref<any>(null)
const roomOptions = ref<FilterOptions[]>([])
const extraChargesOptions = ref<FilterOptions[]>([])
const paymentMethodOptions = ref<FilterOptions[]>([])
const taxesOptions = ref<FilterOptions[]>([])

const filters = ref<Filters>({
  dateType: 'booking',
  fromDate: (() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })(),
  toDate: (() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })(),
  businessSource: '',
  room: '',
  showOnlyUnassignRooms: false,
  showUnpostedInclusion: false,
  discardUnconfirmedBookings: false,
  extraCharges: [],
  paymentMethod: [],
  taxes: [],
  showMobileNoField: false,
  showEmailField: false,
  reportTemplate: 'default'
})

// Fetch data functions
const fetchPaymentMethods = async () => {
  try {
    const resp = await getPaymentMethods(serviceStore.serviceId!)
    paymentMethodOptions.value = resp.data.data.map((pm: any) => ({
      label: pm.methodName,
      value: String(pm.id)
    }))
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

const fetchExtraCharges = async () => {
  try {
    const resp = await getExtraCharges()
    console.log('Extra Charges Response:', resp)
    extraChargesOptions.value = resp.data.data.data.map((ec: any) => ({
      label: ec.name,
      value: String(ec.id)
    }))
  } catch (error) {
    console.error('Error fetching extra charges:', error)
  }
}

const fetchTaxes = async () => {
  try {
    const resp = await getTaxes()
    console.log('Taxes Response:', resp)
    taxesOptions.value = resp.data.data.data.map((tax: any) => ({
      label: tax.taxName,
      value: String(tax.taxRateId)
    }))
  } catch (error) {
    console.error('Error fetching taxes:', error)
  }
}

const fetchRoom = async () => {
  try {
    const resp = await getRooms()
    console.log('Room Response:', resp)
    roomOptions.value = resp.data.data.data.map((room: any) => ({
      label: `${room.roomNumber} - ${room.roomType.roomTypeName}`,
      value: String(room.id)
    }))
  } catch (error) {
    console.error('Error fetching room:', error)
  }
}

// Computed properties
const currentParams = computed(():DailyRevenueReportFilters => {
  return {
    hotelId: serviceStore.serviceId!,
    fromDate: filters.value.fromDate,
    toDate: filters.value.toDate,
    dateType: filters.value.dateType,
    roomId: filters.value.room ? Number(filters.value.room) : undefined,
    businessSourceId: filters.value.businessSource ? Number(filters.value.businessSource) : undefined,
    paymentMethodIds: filters.value.paymentMethod.length > 0 
      ? filters.value.paymentMethod.map(id => Number(id)) 
      : undefined,
    taxIds: filters.value.taxes.length > 0 
      ? filters.value.taxes.map(id => Number(id)) 
      : undefined,
    extraChargeIds: filters.value.extraCharges.length > 0 
      ? filters.value.extraCharges.map(id => Number(id)) 
      : undefined,
    showUnassignRooms: filters.value.showOnlyUnassignRooms,
    showUnpostedInclusion: filters.value.showUnpostedInclusion,
    discardUnconfirmedBookings: filters.value.discardUnconfirmedBookings,
    showMobileNoField: filters.value.showMobileNoField,
    showEmailField: filters.value.showEmailField
  }
})

const reportTitle = computed(() => {
  const dateTypeLabel = {
    booking: t('Booking'),
    stay: t('Stay'),
    departure: t('Departure')
  }[filters.value.dateType]
  
  return `${t('Daily Revenue Reports')} (${dateTypeLabel}) - ${filters.value.fromDate} ${t('To')} ${filters.value.toDate}`
})

// Methods
const toggleAllExtraCharges = (event: Event): void => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    filters.value.extraCharges = extraChargesOptions.value.map(option => option.value)
  } else {
    filters.value.extraCharges = []
  }
}

const toggleAllPaymentMethods = (event: Event): void => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    filters.value.paymentMethod = paymentMethodOptions.value.map(option => option.value)
  } else {
    filters.value.paymentMethod = []
  }
}

const toggleAllTaxes = (event: Event): void => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    filters.value.taxes = taxesOptions.value.map(option => option.value)
  } else {
    filters.value.taxes = []
  }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0)
}

const formatDateType = (dateType: string): string => {
  if (!dateType) return t('Stay')
  const dateTypeMap: Record<string, string> = {
    booking: t('Booking'),
    stay: t('Stay'),
    departure: t('Departure')
  }
  return dateTypeMap[dateType] || dateType.charAt(0).toUpperCase() + dateType.slice(1)
}

const exportData = async (): Promise<void> => {
    try {
    isLoading.value = true
    errorMessage.value = ''

    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    const newPdfUrl = await generateDailyRevenuPdf(currentParams.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Daily receipt report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating daily receipt report:', error)
    errorMessage.value = error instanceof Error ? error.message : t('failedToGeneratePDF')
  } finally {
    isLoading.value = false
  }
}

const generateReport = async (): Promise<void> => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    showReport.value = false

    console.log('📊 Generating report with params:', currentParams.value)
    
    // Fetch report data from API
    const response = await generateDailyRevenueReport(currentParams.value)
    console.log('API Response:>>>>>', response)
    reportData.value = response?.data
    showReport.value = true

    console.log('✅ Daily revenue report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating daily revenue report:', error)
    errorMessage.value = error instanceof Error ? error.message : t('failedToGenerateReport')
  } finally {
    isLoading.value = false
  }
}

const resetForm = (): void => {
  const today = new Date().toISOString().split('T')[0]
  filters.value = {
    dateType: 'booking',
    fromDate: today,
    toDate: today,
    businessSource: '',
    room: '',
    showOnlyUnassignRooms: false,
    showUnpostedInclusion: false,
    discardUnconfirmedBookings: false,
    extraCharges: [],
    paymentMethod: [],
    taxes: [],
    showMobileNoField: false,
    showEmailField: false,
    reportTemplate: 'default'
  }
  errorMessage.value = ''
  showReport.value = false
  reportData.value = null
  
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = ''
  }
  
  console.log('🔄 Form reset to default values')
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

const cleanup = (): void => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
}

onMounted(() => {
  console.log('🚀 Component mounted, fetching initial data...')
  fetchPaymentMethods()
  fetchExtraCharges()
  fetchTaxes()
  fetchRoom()
})

onUnmounted(cleanup)
</script>

<style scoped>
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .md\:grid-cols-2,
  .md\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>