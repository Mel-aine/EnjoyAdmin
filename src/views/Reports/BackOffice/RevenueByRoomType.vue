<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.backOffice.revenueByRoomType') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Revenue breakdown by room type
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

          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <Select 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              :placeholder="'All Room Types'"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 mt-6">
          <button @click="generateReport" :disabled="isLoading || !filters.reportDate"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/25 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
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
          
          <ButtonComponent 
            @click="resetForm"
            variant="outline"
            class="min-w-20"
          >
            Reset
          </ButtonComponent>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/composables/serviceStore'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { getRevenueByRoomTypePdfUrl } from '@/services/occupancyReportsApi'
import { getRoomTypes } from '@/services/configrationApi'

const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

interface FilterOptions {
  value: string;
  label: string;
}

interface ReportItem {
  roomType: string;
  totalRooms: number;
  roomsSold: number;
  revenue: number;
  averageRate: number;
  occupancyRate: number;
  isTotal?: boolean;
}

interface Filters {
  reportDate: string;
  roomType: string;
}

const showResults = ref<boolean>(false)
const isLoading = ref(false)
const errorMessage = ref('')
const pdfUrl = ref('')

// Get current service from store
const filters = ref<Filters>({
  reportDate: new Date().toISOString().split('T')[0],
  roomType: ''
})

// Options for room type selection
const roomTypeOptions = ref<FilterOptions[]>([])

const loadRoomTypes = async () => {
  try {
    const response = await getRoomTypes()
    if (response.data && response.data.data) {
      const apiRoomTypes = response.data.data.map((roomType: any) => ({
        value: roomType.id.toString(),
        label: roomType.name
      }))
      roomTypeOptions.value = apiRoomTypes
    }
  } catch (error) {
    console.error('Error loading room types:', error)
  }
}


// Computed properties for PDF generation
const currentParams = computed(() => ({
  hotelId: serviceStore.serviceId!,
  reportDate: filters.value.reportDate,
  roomType: filters.value.roomType
}))

const reportTitle = computed(() => {
  return `Revenue_By_Room_Type_Report_${filters.value.reportDate}`
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
    const newPdfUrl = await getRevenueByRoomTypePdfUrl(currentParams.value)
    pdfUrl.value = newPdfUrl
    openPDFInNewPage()

    console.log('📊 Revenue by room type report generated successfully:', reportTitle.value)
  } catch (error) {
    console.error('❌ Error generating revenue by room type report:', error)
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
    roomType: ''
  }
  showResults.value = false
}

// Cleanup
const cleanup = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
}

const formatAmount = (amount: number): string => {
  if (amount === 0) return '0'
  return amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  })
}

// Initialize component
onMounted(async () => {
  await loadRoomTypes()
})

// Cleanup on unmount
onUnmounted(cleanup)
</script>

<style scoped>
/* Custom styles for the report table */
.table-row-border {
  border-top: 1px solid #e5e7eb;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .overflow-x-auto table {
    font-size: 0.75rem;
  }
  
  .px-4 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .py-3 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>