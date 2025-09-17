<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.roomAvailability') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.roomAvailabilityDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <select
              v-model="filters.roomType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="standard">{{ $t('rooms.types.standard') }}</option>
              <option value="deluxe">{{ $t('rooms.types.deluxe') }}</option>
              <option value="suite">{{ $t('rooms.types.suite') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.floor') }}
            </label>
            <select
              v-model="filters.floor"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="1">{{ $t('common.floor') }} 1</option>
              <option value="2">{{ $t('common.floor') }} 2</option>
              <option value="3">{{ $t('common.floor') }} 3</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button
            @click="loadRoomAvailability"
            :disabled="isLoadingReport"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoadingReport" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.search') }}
          </button>
          <button
            @click="generatePDF"
            :disabled="isGeneratingPDF || !isDateRangeValid"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="isGeneratingPDF" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            {{ isGeneratingPDF ? $t('common.generating') : 'Generate PDF' }}
          </button>
          <button
            @click="toggleExportSection"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ $t('common.export') }}
            <svg 
              class="w-4 h-4 ml-2 transition-transform duration-200" 
              :class="{ 'rotate-180': showExportSection }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
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

      <!-- Export Section (Collapsible) -->
      <div 
        v-if="showExportSection" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border-l-4 border-green-500"
        :class="{ 'animate-slide-down': showExportSection }"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          {{ $t('common.exportOptions') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Export Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.exportDateFrom') }}
            </label>
            <input
              v-model="exportFilters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.exportDateTo') }}
            </label>
            <input
              v-model="exportFilters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <!-- Export Format -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.exportFormat') }}
            </label>
            <select
              v-model="exportFilters.format"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <!-- Export Options -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ $t('common.exportOptions') }}
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="flex items-center">
              <input
                v-model="exportFilters.includeSummary"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('common.includeSummary') }}</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="exportFilters.includeCharts"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('common.includeCharts') }}</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="exportFilters.includeDetails"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('common.includeDetails') }}</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="exportFilters.groupByFloor"
                type="checkbox"
                class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('common.groupByFloor') }}</span>
            </label>
          </div>
        </div>

        <!-- Export Actions -->
        <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            @click="generateExport"
            :disabled="isExporting || !isExportDateValid"
            class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="isExporting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            {{ isExporting ? $t('common.generating') : $t('common.generateExport') }}
          </button>
          
          <button
            @click="resetExportFilters"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {{ $t('common.reset') }}
          </button>
          
          <button
            @click="showExportSection = false"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {{ $t('common.cancel') }}
          </button>
        </div>

        <!-- Export Status -->
        <div v-if="exportStatus" class="mt-4 p-3 rounded-md" :class="exportStatusClass">
          <div class="flex items-center">
            <svg v-if="exportStatus === 'success'" class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else-if="exportStatus === 'error'" class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium">{{ exportMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.totalRooms') }}</h3>
          <p class="text-2xl font-bold text-blue-600">{{ summary.totalRooms }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.availableRooms') }}</h3>
          <p class="text-2xl font-bold text-green-600">{{ summary.availableRooms }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.occupiedRooms') }}</h3>
          <p class="text-2xl font-bold text-red-600">{{ summary.occupiedRooms }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.occupancyRate') }}</h3>
          <p class="text-2xl font-bold text-purple-600">{{ summary.occupancyRate }}%</p>
        </div>
      </div>

      <!-- Room Details Table -->
      <ReusableTable
        :title="$t('reports.frontOffice.roomDetails')"
        :columns="tableColumns"
        :data="rooms"
        :actions="tableActions"
        :searchable="true"
        :empty-message="$t('reports.noRoomsFound')"
      >
        <template #nextAvailable="{ item }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ item.nextAvailable ? formatDate(item.nextAvailable) : $t('common.today') }}
          </span>
        </template>
      </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { type Action, type Column } from '../../../utils/models'
import roomAvailabilityService from '@/services/frontOfficeReport'

const { t } = useI18n()
const router = useRouter()

// Types (inchangés)
interface Room {
  id: string
  roomNumber: string
  roomType: string
  floor: number
  status: string
  currentGuest?: string
  checkOutDate?: string
  nextAvailable?: string
}

interface ExportFilters {
  dateFrom: string
  dateTo: string
  format: 'pdf' | 'excel' | 'csv'
  includeSummary: boolean
  includeCharts: boolean
  includeDetails: boolean
  groupByFloor: boolean
}

// État réactif - CORRECTIONS
const filters = ref({
  hotelId: 3,
  dateFrom: new Date().toISOString().split('T')[0],
  dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  roomType: '',
  floor: ''
})

const exportFilters = ref<ExportFilters>({
  dateFrom: new Date().toISOString().split('T')[0],
  dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  format: 'pdf',
  includeSummary: true,
  includeCharts: true,
  includeDetails: true,
  groupByFloor: false
})

const rooms = ref<Room[]>([])
const roomTypes = ref<Array<{value: string, label: string}>>([])
const floors = ref<Array<{value: string, label: string}>>([])

// CORRECTION: Simplifier l'objet loading
const loading = ref({
  report: false,
  pdf: false,
  export: false
})

const showExportSection = ref(false)
const exportStatus = ref<{ type: 'success' | 'error' | null, message: string }>({
  type: null,
  message: ''
})
const error = ref('')
const pdfUrl = ref('')

// Propriétés calculées - CORRECTIONS
const isLoadingReport = computed(() => loading.value.report)
const isGeneratingPDF = computed(() => loading.value.pdf)
const isExporting = computed(() => loading.value.export)

const isDateRangeValid = computed(() => {
  return filters.value.dateFrom && 
         filters.value.dateTo && 
         new Date(filters.value.dateFrom) <= new Date(filters.value.dateTo)
})

const isExportDateValid = computed(() => {
  return exportFilters.value.dateFrom && 
         exportFilters.value.dateTo && 
         new Date(exportFilters.value.dateFrom) <= new Date(exportFilters.value.dateTo)
})

const exportStatusClass = computed(() => {
  if (exportStatus.value.type === 'success') {
    return 'bg-green-50 border border-green-200 text-green-800'
  } else if (exportStatus.value.type === 'error') {
    return 'bg-red-50 border border-red-200 text-red-800'
  }
  return ''
})

const summary = computed(() => {
  const totalRooms = rooms.value.length
  const availableRooms = rooms.value.filter(room => room.status === 'available').length
  const occupiedRooms = rooms.value.filter(room => room.status === 'occupied').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  
  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    occupancyRate
  }
})

const reportTitle = computed(() => {
  const from = formatDate(filters.value.dateFrom)
  const to = formatDate(filters.value.dateTo)
  return `Rapport Disponibilité - ${from} à ${to}`
})

// Configuration du tableau (inchangée)
const tableColumns = computed<Column[]>(() => [
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { key: 'roomType', label: t('common.roomType'), type: 'text', translatable: true },
  { key: 'floor', label: t('common.floor'), type: 'text' },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'available': 'bg-green-100 text-green-800',
      'occupied': 'bg-red-100 text-red-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'cleaning': 'bg-blue-100 text-blue-800'
    }
  },
  { key: 'currentGuest', label: t('common.currentGuest'), type: 'text' },
  { key: 'checkOutDate', label: t('common.checkOutDate'), type: 'date' },
  { key: 'nextAvailable', label: t('common.nextAvailable'), type: 'date' }
])

const tableActions = computed<Action[]>(() => [
  {
    label: t('common.view'),
    handler: (item: Room) => viewRoomDetails(item.id),
    variant: 'primary'
  },
  {
    label: t('common.book'),
    handler: (item: Room) => bookRoom(item.id),
    variant: 'success',
    condition: (item: Room) => item.status === 'available'
  }
])

// Méthodes - CORRECTIONS ET AMÉLIORATIONS
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const toggleExportSection = () => {
  showExportSection.value = !showExportSection.value
  if (showExportSection.value) {
    exportStatus.value = { type: null, message: '' }
  }
}

const resetExportFilters = () => {
  exportFilters.value = {
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    format: 'pdf',
    includeSummary: true,
    includeCharts: true,
    includeDetails: true,
    groupByFloor: false
  }
  exportStatus.value = { type: null, message: '' }
}

const loadRoomAvailability = async () => {
  loading.value.report = true
  error.value = ''
  
  try {
    console.log('Chargement des données avec les filtres:', filters.value)
    const response = await roomAvailabilityService.generateReport(filters.value)
    console.log('Réponse API:', response)
    
    rooms.value = response.data.data || []
    console.log('Chambres chargées:', rooms.value.length)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données'
    error.value = errorMessage
    console.error('Erreur chargement:', err)
  } finally {
    loading.value.report = false
  }
}

// CORRECTION MAJEURE: Méthode generatePDF corrigée
const generatePDF = async () => {
  loading.value.pdf = true
  error.value = ''
  
  try {
    console.log('Génération PDF avec les filtres:', filters.value)
    
    // Nettoyer l'URL précédente
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }

    // Vérifier que les données sont chargées
    if (rooms.value.length === 0) {
      console.log('Aucune donnée - chargement en cours...')
      await loadRoomAvailability()
    }

    // Générer le PDF
    const newPdfUrl = await roomAvailabilityService.generatePDFUrl(filters.value)
    pdfUrl.value = newPdfUrl
    
    console.log('PDF généré avec succès, URL:', pdfUrl.value)
    openPDFInNewPage()

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du PDF'
    error.value = errorMessage
    console.error('Erreur PDF:', err)
    
    // Fallback: essayer de télécharger directement
    try {
      console.log('Tentative de téléchargement direct...')
      await roomAvailabilityService.downloadPDF(filters.value)
    } catch (downloadErr) {
      console.error('Échec du téléchargement direct:', downloadErr)
    }
  } finally {
    loading.value.pdf = false
  }
}

// NOUVELLE MÉTHODE: generateExport pour l'export section
const generateExport = async () => {
  await handleExport(exportFilters.value.format)
}

const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
  loading.value.export = true
  exportStatus.value = { type: null, message: '' }
  
  try {
    console.log(`Export ${format} avec les filtres:`, exportFilters.value)
    
    const params = {
      ...filters.value,
      dateFrom: exportFilters.value.dateFrom,
      dateTo: exportFilters.value.dateTo,
      ...exportFilters.value
    }

    if (format === 'pdf') {
      const pdfUrl = await roomAvailabilityService.generatePDFUrl(params)
      const routeData = router.resolve({
        name: 'PDFViewer',
        query: {
          url: btoa(encodeURIComponent(pdfUrl)),
          title: reportTitle.value
        }
      })
      window.open(routeData.href, '_blank')
    } else {
      const blob = await roomAvailabilityService.export(params, format)
      const filename = `room_availability_${exportFilters.value.dateFrom}_${exportFilters.value.dateTo}.${format}`
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    exportStatus.value = {
      type: 'success',
      message: t('common.exportGeneratedSuccessfully')
    }

    // Masquer le message de succès après 3 secondes
    setTimeout(() => {
      exportStatus.value = { type: null, message: '' }
    }, 3000)

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('common.exportGenerationFailed')
    exportStatus.value = {
      type: 'error',
      message: errorMessage
    }
    console.error('Erreur export:', err)
  } finally {
    loading.value.export = false
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

const viewRoomDetails = (id: string) => {
  console.log('Voir détails chambre:', id)
  // TODO: Implémentation navigation vers les détails
}

const bookRoom = (id: string) => {
  console.log('Réserver chambre:', id)
  // TODO: Implémentation de la réservation
}

const loadInitialData = async () => {
  try {
    console.log('Chargement des données initiales pour hôtel:', filters.value.hotelId)
    const [roomTypesData, floorsData] = await Promise.all([
      roomAvailabilityService.getRoomTypes(filters.value.hotelId),
      roomAvailabilityService.getFloors(filters.value.hotelId)
    ])
    
    roomTypes.value = roomTypesData
    floors.value = floorsData
    console.log('Données initiales chargées:', { roomTypes: roomTypesData, floors: floorsData })
  } catch (err) {
    console.warn('Erreur chargement données initiales:', err)
    // Utiliser les valeurs par défaut en cas d'erreur
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
  await loadInitialData()
  await loadRoomAvailability()
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