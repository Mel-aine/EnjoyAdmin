<template>
  <ReportsLayout>
    <div class="p-6 h-screen">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.roomAvailability') }}
        </h1>
        <!-- <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.roomAvailabilityDescription') }}
        </p> -->
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <InputDatepicker
              v-model="filters.dateFrom"
              placeholder="From"
              class="w-full"
              @update:modelValue="updateDateFilter('startDate', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <InputDatepicker
              v-model="filters.dateTo"
              placeholder="To"
              class="w-full"
              @update:modelValue="updateDateFilter('endDate', $event)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <SelectComponent
              v-model="filters.roomTypeId"
              :options="roomTypeOptions"
              placeholder="-- select Room Types --"
              class="w-full"
              @update:modelValue="onRoomTypeChange"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="generatePDF"
            :disabled="isGeneratingPDF || !isDateRangeValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="isGeneratingPDF" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            {{ isGeneratingPDF ? $t('common.generating') : $t('generatePdf') }}
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="error = ''" class="text-red-400 hover:text-red-600">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { type Action, type Column } from '../../../utils/models'
import roomAvailabilityService from '@/services/frontOfficeReport'
import { getRoomTypes } from '@/services/roomTypeApi'
import { useServiceStore } from '@/composables/serviceStore'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

// Types
interface FilterOptions {
  value: string;
  label: string;
}

// État réactif
const filters = ref({
  hotelId: serviceStore.serviceId,
  dateFrom: new Date().toISOString().split('T')[0],
  dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  roomTypeId: '',
  floor: ''
})

const roomTypeOptions = ref<FilterOptions[]>([])

const loading = ref({
  report: false,
  pdf: false
})

const error = ref('')
const successMessage = ref('')
const pdfUrl = ref('')

// Auto-clear des messages
watch([error, successMessage], () => {
  if (error.value) {
    setTimeout(() => { error.value = '' }, 5000)
  }
  if (successMessage.value) {
    setTimeout(() => { successMessage.value = '' }, 3000)
  }
})

// Propriétés calculées
const isLoadingReport = computed(() => loading.value.report)
const isGeneratingPDF = computed(() => loading.value.pdf)

const isDateRangeValid = computed(() => {
  return filters.value.dateFrom &&
         filters.value.dateTo &&
         new Date(filters.value.dateFrom) <= new Date(filters.value.dateTo)
})

const reportTitle = computed(() => {
  const from = formatDate(filters.value.dateFrom)
  const to = formatDate(filters.value.dateTo)
  return `Rapport Disponibilité - ${from} à ${to}`
})

// Méthodes
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

// Nouvelle méthode pour gérer les changements de date
const updateDateFilter = (type: 'startDate' | 'endDate', value: any) => {
  console.log('updateDateFilter called with:', type, value)
  if (type === 'startDate') {
    filters.value.dateFrom = value
  } else if (type === 'endDate') {
    filters.value.dateTo = value
  }
}

// Nouvelle méthode pour gérer le changement de room type
const onRoomTypeChange = (value: any) => {
  console.log('Room type changed to:', value)
  filters.value.roomTypeId = value
}

const generatePDF = async () => {
  console.log('generatePDF called, setting loading to true')
  loading.value.pdf = true
  error.value = ''
  successMessage.value = ''

  try {
    console.log('Génération PDF avec les filtres:', filters.value)

    // Nettoyer l'URL précédente
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    // Construire les paramètres avec tous les filtres appliqués
    const params : any = {
      hotelId: serviceStore.serviceId,
      dateFrom: filters.value.dateFrom,
      dateTo: filters.value.dateTo,
      ...(filters.value.roomTypeId && { roomTypeId: filters.value.roomTypeId }),
      ...(filters.value.floor && { floor: filters.value.floor })
    }

    // Générer le PDF avec les filtres
    const newPdfUrl = await roomAvailabilityService.generatePDFUrl(params)
    pdfUrl.value = newPdfUrl

    console.log('PDF généré avec succès, URL:', pdfUrl.value)
    openPDFInNewPage()

    successMessage.value = 'PDF généré avec succès'

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du PDF'
    error.value = errorMessage
    console.error('Erreur PDF:', err)

    // Fallback: essayer de télécharger directement
    try {
      console.log('Tentative de téléchargement direct...')
      const params : any = {
        hotelId: serviceStore.serviceId,
        dateFrom: filters.value.dateFrom,
        dateTo: filters.value.dateTo,
        ...(filters.value.roomTypeId && { roomTypeId: filters.value.roomTypeId }),
        ...(filters.value.floor && { floor: filters.value.floor })
      }
      await roomAvailabilityService.downloadPDF(params)
      successMessage.value = 'PDF téléchargé'
    } catch (downloadErr) {
      console.error('Échec du téléchargement direct:', downloadErr)
    }
  } finally {
    console.log('generatePDF finally block, setting loading to false')
    loading.value.pdf = false
  }
}

const openPDFInNewPage = () => {
  if (pdfUrl.value) {
    console.log('Ouverture PDF dans une nouvelle page:', pdfUrl.value)
    const routeData = router.resolve({
      name: 'PDFViewer',
      query: {
        url: btoa(encodeURIComponent(pdfUrl.value)),
        title: reportTitle.value
      }
    })
    window.open(routeData.href, '_blank')
  } else {
    console.error('Aucune URL PDF disponible')
    error.value = 'Impossible d\'ouvrir le PDF - URL manquante'
  }
}

const fetchRoomtype = async () => {
  try {
    const idHotel = serviceStore.serviceId
    const resp = await getRoomTypes(idHotel!)
    console.log('Room Type:', resp)
    roomTypeOptions.value = resp.data.data.data.map((c: any) => ({
      label: c.roomTypeName,
      value: c.id.toString() // Convertir en string pour éviter les problèmes de type
    }))
  } catch (error) {
    console.error('Error fetching roomType:', error)
  }
}

const cleanup = () => {
  if (pdfUrl.value) {
    console.log('Nettoyage URL PDF:', pdfUrl.value)
    URL.revokeObjectURL(pdfUrl.value)
  }
}

// Lifecycle hooks
onMounted(async () => {
  console.log('Composant monté - Initialisation...')
  await fetchRoomtype()
})

onUnmounted(() => {
  console.log('Composant démonté - Nettoyage...')
  cleanup()
})
</script>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
