<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.nightAudit') }}
        </h1>
      </div>

      <div class=" p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <InputDatepicker v-model="filters.arrivalFrom" :placeholder="t('common.from')" class="w-full">
            </InputDatepicker>
          </div>
          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <Select v-model="filters.currency" :options="currencyOptions" :placeholder="'XAF'" class="w-full">
            </Select>
          </div>
        </div>
        <!-- Buttons -->
        <div class="flex items-end justify-end">
          <div class="flex gap-2">
            <div class="flex items-end">
              <button @click="generateReport" :disabled="isLoading || !filters.arrivalFrom"
                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/25 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Export
              </button>
            </div>

            <ButtonComponent @click="resetForm" variant="outline" class="px-6 py-2">
              Reset
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
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
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/composables/serviceStore'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { getNightAuditReportPdfUrl } from '@/services/occupancyReportsApi'
import { useCurrencyStore } from '../../../composables/currencyStore'
import Select from '@/components/forms/FormElements/Select.vue'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()
const isLoading = ref(false)
const errorMessage = ref('')
const pdfUrl = ref('')

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

interface FilterOptions {
  value: string;
  label: string;
}

interface Filters {
  arrivalFrom: string;
  currency: string;
}

interface TableHeader {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

interface RoomChargeItem {
  room: string;
  folioNo: string;
  guest: string;
  source: string;
  company: string;
  rentDate: string;
  rateType: string;
  normalTariff: string;
  offeredTariff: string;
  totalTax: string;
  totalRent: string;
  variation: string;
  checkinBy: string;
}

interface DailySalesItem {
  salesType: string;
  roomCharges: string;
  extraCharges: string;
  roomTax: string;
  extraTax: string;
  discount: string;
  adjustment: string;
  totalSales: string;
}

const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  arrivalFrom: new Date().toISOString().split('T')[0],
  currency: 'XAF'
})

const currencyStore = useCurrencyStore()

// Options for selects
const currencyOptions = computed<FilterOptions[]>(() => {
  return currencyStore.getCurrencyOptions
})

// Computed properties for PDF generation
const currentParams = computed(() => ({
  hotelId: serviceStore.serviceId!,
  asOnDate: filters.value.arrivalFrom,
  currency: filters.value.currency
}))

const reportTitle = computed(() => {
  return `Night_Audit_Report_${filters.value.arrivalFrom}`
})

const generateReport = async (): Promise<void> => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Clear previous PDF URL
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    // Generate new PDF URL
    const newPdfUrl = await getNightAuditReportPdfUrl(currentParams.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Night audit report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating night audit report:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to generate report'
  } finally {
    isLoading.value = false
  }
}

// Methods for PDF actions
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

const resetForm = (): void => {
  filters.value = {
    arrivalFrom: new Date().toISOString().split('T')[0],
    currency: 'XAF'
  }
  showResults.value = false
}

// Cleanup
const cleanup = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
}

// Cleanup on unmount
onUnmounted(cleanup)
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-col>div {
    width: 100%;
  }

  .flex-col>div+div {
    margin-top: 1rem;
  }

  .items-end {
    align-items: stretch;
  }
}
</style>