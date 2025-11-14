<template>
  <ReportsLayout>
    <div class="occupancy-rate-report">
      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ $t('monthlyRevenueReport') }}</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-white/80">
              {{ $t('viewDetailedRevenueStatistics') }}
            </p>
          </div>

        </div>
      </div>

      <!-- Filter Section -->
      <div class="bg-white  dark:bg-gray-800 shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Month Selection -->
          <div>
            <label for="month" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('month') }}
            </label>
       <!--      <select id="month" v-model="selectedMonth" @change="onFiltersChange"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select> -->
            <SelectComponent v-model="selectedMonth" @change="onFiltersChange" :options="availableMonths" :placeholder="$t('select')" class="w-full" />
          </div>

          <!-- Year Selection -->
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('year') }}
            </label>
     <!--        <select id="year" v-model="selectedYear" @change="onFiltersChange"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option v-for="year in availableYears" :key="year.value" :value="year.value">
                {{ year.label }}
              </option>
            </select> -->
            <SelectComponent v-model="selectedYear" @change="onFiltersChange" :options="availableYears" :placeholder="$t('select')" class="w-full" />
          </div>

          <!-- Generate Button -->
          <div class="flex items-end">
            <button @click="generateReport" :disabled="isLoading || !selectedMonth"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {{ $t('export') }}
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

<script setup lang="ts">

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import {
  getMonthlyRevenuePDFUrl,
  getAvailableMonths,
  getAvailableYears,
  type MonthlyOccupancyParams
} from '@/services/occupancyReportsApi'
import SelectComponent from '@/components/forms/FormElements/Select.vue'

// Reactive data
const isLoading = ref(false)
const errorMessage = ref('')
const pdfUrl = ref('')

// Filter selections
const selectedMonth = ref(new Date().getMonth() + 1) // Current month (1-12)
const selectedYear = ref(new Date().getFullYear()) // Current year
const selectedHotelId = ref<number | ''>(1) // Default hotel ID or empty for default

// Available options
const availableYears = ref(getAvailableYears())

// Convert months to computed property for i18n reactivity
const availableMonths = computed(() => {
  const months = getAvailableMonths()
  return months.map(month => ({
    value: month.value,
    label: t(`common.months.${month.label.toLowerCase()}`)
  }))
})


// Computed properties
const currentParams = computed((): MonthlyOccupancyParams => ({
  month: selectedMonth.value,
  year: selectedYear.value,
  hotelId: useServiceStore().serviceId!
}))

const reportTitle = computed(() => {return ''
})

const onFiltersChange =()=>{
  generateReport();
}
// Methods
const generateReport = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Clear previous PDF URL
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    // Generate new PDF URL
    const newPdfUrl = await getMonthlyRevenuePDFUrl(currentParams.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Occupancy report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating occupancy report:', error)
    errorMessage.value = error instanceof Error ? error.message : t('failedToGenerateReport')
  } finally {
    isLoading.value = false
  }
}

// Router
const router = useRouter()

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


// Cleanup
const cleanup = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
}

// Cleanup on unmount
import { onUnmounted } from 'vue'
import { useServiceStore } from '../../../composables/serviceStore'
import ReportsLayout from '../../../components/layout/ReportsLayout.vue'
onUnmounted(cleanup)
</script>

<style scoped>
</style>