
<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.roomStatusReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.roomStatusReportDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.date') }}
            </label>
            <InputDatePicker 
              v-model="selectedDate" 
              :placeholder="$t('common.date')"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Bouton d'export avec menu déroulant -->
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
                CSV
              </button>
              <button 
                @click="exportPDF" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button 
                @click="exportExcel" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="exportLoading"
              >
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
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

<script setup lang="ts">

import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
// Using inline spinner instead of external component
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
const exportLoading = ref(false)
const exportMenuOpen = ref(false)
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

// Dependencies
const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

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

// Reset form
const resetForm = () => {
  selectedDate.value = new Date().toISOString().split('T')[0]
  errorMessage.value = ''
}

// Export methods
const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV avec date:', selectedDate.value)
    // Implémentez ici la logique d'export CSV
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to export CSV'
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

    // Generate new PDF URL
    const newPdfUrl = await getRoomStatusPdfUrl(currentParams.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()
    
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to export PDF'
  } finally {
    exportLoading.value = false
  }
}

const exportExcel = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel avec date:', selectedDate.value)
    // Implémentez ici la logique d'export Excel
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to export Excel'
  } finally {
    exportLoading.value = false
  }
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
}

// Gestion du clic en dehors du menu
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    exportMenuOpen.value = false
  }
})

// Cleanup
const cleanup = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
  document.removeEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      exportMenuOpen.value = false
    }
  })
}
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