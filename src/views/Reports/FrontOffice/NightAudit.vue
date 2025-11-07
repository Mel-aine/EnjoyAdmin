<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.nightAudit') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('reports.frontOffice.nightAuditDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.date') }}
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="t('common.date')"
              class="w-full"
            />
          </div>
          
          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('Common Currency') }}
            </label>
            <Select 
              v-model="filters.currency" 
              :options="currencyOptions" 
              :placeholder="'XAF'" 
              class="w-full"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4 justify-end">
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <!-- Bouton Report -->
            <button 
              @click="generateReport"
              :disabled="isLoading || !filters.arrivalFrom"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
              <span class="flex items-center">
                {{  t('Report') }}
              </span>
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

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
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
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
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