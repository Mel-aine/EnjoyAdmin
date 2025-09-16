
<template>
  <ReportsLayout>
    <div class="occupancy-rate-report">
      <!-- Header Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.roomStatusReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.roomStatusReportDescription') }}
        </p>
      </div>

      <!-- Filter Section -->
      <div class="px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <InputDatePicker :title="$t('asOnDate')" v-model="selectedDate" />
          </div>

          <!-- Generate Button -->
          <div class="flex items-end">
            <button @click="generateReport" :disabled="isLoading || !selectedDate"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/25 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed">
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
              Export
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

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getMonthlyOccupancyPDFUrl,
  downloadMonthlyOccupancyPDF,
  validateMonthlyOccupancyParams,
  getAvailableMonths,
  getAvailableYears,
  type MonthlyOccupancyParams,
  getRoomStatusPdfUrl
} from '@/services/occupancyReportsApi'

// Reactive data
const isLoading = ref(false)
const errorMessage = ref('')
const pdfUrl = ref('')

// Filter selections
const selectedDate = ref( new Date().toISOString().split('T')[0])
// Computed properties
const currentParams = computed((): any => ({
  asOnDate: selectedDate.value,
  hotelId: useServiceStore().serviceId!
}))

const reportTitle = computed(() => {
  return `Room_Status_Report_${selectedDate.value}`
})

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
    const newPdfUrl = await getRoomStatusPdfUrl(currentParams.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Occupancy report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating occupancy report:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to generate report'
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
import InputDatePicker from '../../../components/forms/FormElements/InputDatePicker.vue'
onUnmounted(cleanup)
</script>

<style scoped>
.occupancy-rate-report {
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

/* Custom scrollbar for better UX */
.occupancy-rate-report :deep(.pdf-viewer-container) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.occupancy-rate-report :deep(.pdf-viewer-container::-webkit-scrollbar) {
  width: 8px;
}

.occupancy-rate-report :deep(.pdf-viewer-container::-webkit-scrollbar-track) {
  background: #f1f5f9;
}

.occupancy-rate-report :deep(.pdf-viewer-container::-webkit-scrollbar-thumb) {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.occupancy-rate-report :deep(.pdf-viewer-container::-webkit-scrollbar-thumb:hover) {
  background-color: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .occupancy-rate-report {
    height: 100vh;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>