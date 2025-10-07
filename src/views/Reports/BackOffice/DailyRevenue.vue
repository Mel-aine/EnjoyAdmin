<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('Daily Revenue Reports') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage daily revenue
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <!-- Date Selection Radio Buttons -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ t('Date') }}
          </label>
          <div class="flex gap-6">
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="filters.dateType" 
                value="booking"
                class="form-radio h-4 w-4 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Booking') }}</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="filters.dateType" 
                value="stay"
                class="form-radio h-4 w-4 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Stay') }}</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="filters.dateType" 
                value="departure"
                class="form-radio h-4 w-4 text-blue-600"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Departure') }}</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('From') }}
            </label>
            <InputDatepicker 
              v-model="filters.fromDate" 
              placeholder="DD/MM/YYYY"
              class="w-full"
            />
          </div>
          
          <!-- To Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('To') }}
            </label>
            <InputDatepicker 
              v-model="filters.toDate" 
              placeholder="DD/MM/YYYY"
              class="w-full"
            />
          </div>

          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('Business Source') }}
            </label>
            <SelectComponent 
              v-model="filters.businessSource"
              :options="BusinessSource"
              placeholder="--Select--"
              :multiple="false"
              class="w-full"
            />
          </div>

          <!-- Room -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('Room') }}
            </label>
            <SelectComponent 
              v-model="filters.room"
              :options="roomOptions"
              placeholder="--Select--"
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
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Show Only Unassign Rooms') }}</span>
          </label>
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="filters.showUnpostedInclusion"
              class="form-checkbox h-4 w-4 text-blue-600 rounded"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Show Unposted Inclusion') }}</span>
          </label>
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="filters.discardUnconfirmedBookings"
              class="form-checkbox h-4 w-4 text-blue-600 rounded"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Discard Unconfirmed Bookings') }}</span>
          </label>
        </div>

        <!-- Export Settings Section -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {{ t('Below Settings Available only for Export Functionality :') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <!-- Extra Charges -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('Extra Charges') }}
              </label>
              <SelectComponent 
                v-model="filters.extraCharges"
                :options="extraChargesOptions"
                placeholder="Select All"
                :multiple="true"
                class="w-full"
              />
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('Payment Method') }}
              </label>
              <SelectComponent 
                v-model="filters.paymentMethod"
                :options="paymentMethodOptions"
                placeholder="Select All"
                :multiple="true"
                class="w-full"
              />
            </div>

            <!-- Taxes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('Taxes') }}
              </label>
              <SelectComponent 
                v-model="filters.taxes"
                :options="taxesOptions"
                placeholder="Select All"
                :multiple="true"
                class="w-full"
              />
            </div>
          </div>

          <!-- Additional Checkboxes -->
          <div class="flex gap-6 mb-4">
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.showMobileNoField"
                class="form-checkbox h-4 w-4 text-blue-600 rounded"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Show Mobile No. field') }}</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.showEmailField"
                class="form-checkbox h-4 w-4 text-blue-600 rounded"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Show Email field') }}</span>
            </label>
          </div>

          <!-- Note -->
          <div class="p-3 mb-4">
            <p class="text-xs text-gray-900 dark:text-gray-100">
              <strong>{{ t('NOTE :') }}</strong> {{ t("Nights will calculate on Primary(Master) folio. In second folio, Nights will show as '-'") }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2">
          <!-- Export Button -->
          <button 
            @click="exportData" 
            :disabled="isLoading || !filters.fromDate || !filters.toDate"
            class="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <span v-if="!isLoading">{{ t('Export') }}</span>
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
          
          <!-- Report Button -->
          <button
            @click="generateReport"
            :disabled="isLoading || !filters.fromDate || !filters.toDate"
            class="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            {{ t('Report') }}
          </button>
          
          <!-- Reset Button -->
          <button
            @click="resetForm"
            class="inline-flex justify-center items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            {{ t('Reset') }}
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
import { useBooking } from '@/composables/useBooking2'
import {
  getDailyRevenuePDFUrl,
  validateDailyRevenueParams,
  type DailyRevenueParams
} from '@/services/reportsApi'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

interface FilterOptions {
  value: string;
  label: string;
}

interface Filters {
  dateType: string;
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

// Options
const fetchPaymentMethods = async () => {
  try {
    const resp = await getPaymentMethods(serviceStore.serviceId!)
    paymentMethodOptions.value = resp.data.data.map((pm: any) => ({
      label: pm.methodName,
      value: pm.id
    }))
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

const roomOptions = ref<FilterOptions[]>([
  { value: 'all', label: 'All Rooms' },
  { value: '101', label: 'Room 101' },
  { value: '102', label: 'Room 102' },
  { value: '103', label: 'Room 103' }
])

const extraChargesOptions = ref<FilterOptions[]>([
  { value: 'banquet_sale', label: 'Banquet Sale' },
  { value: 'buffet', label: 'Buffet' },
  { value: 'channel', label: 'Channel' },
  { value: 'dabohar', label: 'Dabohar' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'extra_bed', label: 'Extra Bed' }
])

const paymentMethodOptions = ref<FilterOptions[]>([])

const taxesOptions = ref<FilterOptions[]>([
  { value: 'cgst', label: 'CGST' },
  { value: 'cgst_2_5', label: 'CGST@2.5' },
  { value: 'custom_tax', label: 'Custom Tax' },
  { value: 'gst', label: 'GST' },
  { value: 'igst', label: 'IGST' },
  { value: 'luxury_tax', label: 'Luxury Tax' }
])

// Computed properties
const currentParams = computed((): DailyRevenueParams => {
  return {
    hotelId: serviceStore.serviceId!,
    asOnDate: filters.value.fromDate,
    revenueBy: undefined
  }
})

const reportTitle = computed(() => {
  return `Daily Revenue Report - ${filters.value.fromDate} to ${filters.value.toDate}`
})

// Methods
const exportData = async (): Promise<void> => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    validateDailyRevenueParams(currentParams.value)
    const newPdfUrl = await getDailyRevenuePDFUrl(currentParams.value)
    pdfUrl.value = newPdfUrl

    const link = document.createElement('a')
    link.href = pdfUrl.value
    link.download = `daily_revenue_report_${filters.value.fromDate}.pdf`
    link.click()

    console.log('📊 Daily revenue report exported successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error exporting daily revenue report:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to export report'
  } finally {
    isLoading.value = false
  }
}

const generateReport = async (): Promise<void> => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    validateDailyRevenueParams(currentParams.value)
    const newPdfUrl = await getDailyRevenuePDFUrl(currentParams.value)
    pdfUrl.value = newPdfUrl

    openPDFInNewPage()

    console.log('📊 Daily revenue report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating daily revenue report:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to generate report'
  } finally {
    isLoading.value = false
  }
}

const openPDFInNewPage = (): void => {
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

const openTemplateSettings = (): void => {
  console.log('Opening template settings...')
  // Implement template settings modal or navigation
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
  
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = ''
  }
}

const cleanup = (): void => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
}
onMounted(() => {
  fetchPaymentMethods()
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