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

        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-5 pt-5 border-t border-gray-200">
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
              <button 
                @click="generateReport"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                :disabled="isLoading"              
                >
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2"></path>
                </svg>
                {{ $t('common.word') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        {{ successMessage }}
      </div>

      <!-- Report Status (hidden from UI but data available for export) -->
      <div v-if="reportData" class="hidden">
        <!-- Composant d'export Word avec les données transformées -->
        <WordExportButton 
          ref="wordExportRef"
          :api-data="reportData.data"
          :title="`STATUT DES CHAMBRES - ${reportData.data.hotelDetails.hotelName}`"
          :filename="`etat-chambres-${selectedDate}`"
          :auto-export="true"
        />
      </div>

    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted} from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import WordExportButton from '@/components/common/WordExportButton.vue'
import { 
  fetchRoomStatusReport,
  getRoomStatusPdfUrl,
  type RoomStatusReportResponse,
  type RoomStatusWordExportParams 
} from '@/services/roomstatusApi'

// Reactive data
const isLoading = ref(false)
const exportLoading = ref(false)
const exportMenuOpen = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const reportData = ref<RoomStatusReportResponse | null>(null)
const pdfUrl = ref('')
const wordExportRef = ref<InstanceType<typeof WordExportButton> | null>(null)

// Filtres
const selectedDate = ref(new Date().toISOString().split('T')[0])
const currentParams = computed((): any => ({
  date: selectedDate.value,
  hotelId: useServiceStore().serviceId!
}))


const reportTitle = computed(() => {
  return `Room_Status_Report_${selectedDate.value}`
})
// Dependencies
const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

// Computed properties
/* const currentFilters = computed(() => ({
  date: selectedDate.value,
  hotelId: serviceStore.serviceId || 0
})) */

// Données transformées pour l'export
/* const transformedTableData = computed(() => {
  if (!reportData.value) return []
  const transformed = transformReportDataForTable(reportData.value.data)
  return transformed.tableData
})

const transformedLegendData = computed(() => {
  if (!reportData.value) return []
  const transformed = transformReportDataForTable(reportData.value.data)
  return transformed.legendData
}) */

// Génération du rapport
const generateReport = async () => {
  try {
    isLoading.value = true
    exportLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    reportData.value = null

    const params: RoomStatusWordExportParams = {
      date: selectedDate.value,
      hotelId: serviceStore.serviceId!
    }

    const response = await fetchRoomStatusReport(params)
    reportData.value = response
    successMessage.value = 'Rapport généré avec succès. Vous pouvez maintenant l\'exporter.'

    console.log('✅ Rapport généré avec succès:', response)
  } catch (error) {
    console.error('❌ Erreur lors de la génération du rapport:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to generate report'
  } finally {
    isLoading.value = false
    exportLoading.value = false
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
// Export methods
const exportCSV = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV avec les données:', reportData.value)
    // Implémentez ici la logique d'export CSV avec reportData.value
    successMessage.value = 'Export CSV en cours...'
    
    // Simuler un délai d'export
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = 'Export CSV terminé avec succès'
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

/* const exportWord = async (): Promise<void> => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    
    if (!reportData.value) {
      throw new Error('Aucune donnée de rapport disponible')
    }

    // Attendre que le composant soit rendu
    await nextTick()
    
    if (wordExportRef.value) {
      successMessage.value = 'Export Word en cours...'
      // Déclencher l'export via le composant WordExportButton
      await wordExportRef.value.exportToWord()
      successMessage.value = 'Export Word terminé avec succès'
    } else {
      throw new Error('Composant d\'export Word non disponible')
    }
  } catch (error) {
    console.error('Erreur lors de l\'export Word:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to export Word'
  } finally {
    exportLoading.value = false
  }
} */

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

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Cleanup
const cleanup = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
  document.removeEventListener('click', handleClickOutside)
}

onUnmounted(cleanup)
</script>

<style scoped>
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
</style>