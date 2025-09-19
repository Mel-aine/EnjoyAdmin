<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Manager Report
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Daily financial summary and revenue breakdown
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Report Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Date
            </label>
            <InputDatepicker 
              v-model="filters.reportDate" 
              placeholder="Select date"
              class="w-full"
            />
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <Select 
              v-model="filters.currency"
              :options="currencyOptions"
              :placeholder="'XAF'"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 mt-6">
          <!-- Bouton Export -->
          <div class="relative">
            <button 
              @click="generateReport" 
              :disabled="isLoading || !filters.reportDate"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <span v-if="!isLoading">{{ t('common.export') }}</span>
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          
          <!-- Bouton Reset -->
          <div class="relative">
            <button
              @click="resetForm"
              class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
            >
              {{ t('common.reset') }}
            </button>
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
import { useCurrencyStore } from '@/composables/currencyStore'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { getManagerReportPdfUrl } from '@/services/occupancyReportsApi'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()
const currencyStore = useCurrencyStore()

interface FilterOptions {
  value: string;
  label: string;
}


interface Filters {
  reportDate: string;
  currency: string;
}

const showResults = ref<boolean>(false)
const isLoading = ref(false)
const errorMessage = ref('')
const pdfUrl = ref('')

const filters = ref<Filters>({
  reportDate: new Date().toISOString().split('T')[0],
  currency: 'XAF'
})


// Options for selects
const currencyOptions = computed<FilterOptions[]>(() => {
  return currencyStore.getCurrencyOptions
})


// Computed properties for PDF generation
const currentParams = computed(() => ({
  hotelId: serviceStore.serviceId!,
  asOnDate: filters.value.reportDate,
  currency: filters.value.currency
}))

const reportTitle = computed(() => {
  return `Manager_Report_${filters.value.reportDate}`
})
// Methods
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
    const newPdfUrl = await getManagerReportPdfUrl(currentParams.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Manager report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating manager report:', error)
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
    reportDate: new Date().toISOString().split('T')[0],
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
</style>