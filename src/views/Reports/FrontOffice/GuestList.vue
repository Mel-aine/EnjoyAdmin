<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.guestList') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400"> 
          {{ $t('reports.frontOffice.guestListDescription') }}
        </p> 
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Start Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <InputDatepicker v-model="filters.startDate" :placeholder="$t('common.dateFrom')" class="w-full" />
          </div>

          <!-- End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <InputDatepicker v-model="filters.endDate" :placeholder="$t('common.dateTo')" class="w-full" />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <SelectComponent v-model="filters.status" :options="statusOptions" :placeholder="$t('common.status')" class="w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 items-end">
            <button 
              @click="generateReport"
              :disabled="!filters.startDate || !filters.endDate || loading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Spinner v-if="loading" class="w-4 h-4 mr-1" />
              <span class="flex items-center">
                {{ loading ? $t('common.generating') : $t('common.report') }}
                <svg v-if="!loading" class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <button 
              @click="resetForm"
              class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('common.reset') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Results -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h2 class="text-lg font-semibold text-green-600 dark:text-green-400">
              {{ $t('reports.frontOffice.guestList') }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>{{ $t('common.startDate') }}:</strong> {{ filters.startDate }} <strong>{{ $t('common.endDate') }}:</strong> {{ filters.endDate }}</span>
          </div>
        </div>

        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable
            :title="$t('reports.frontOffice.guestList')"
            :columns="tableColumns"
            :data="displayGuests"
            :actions="tableActions"
            :searchable="true"
            :loading="loading"
            :empty-message="guests.length === 0 && !loading ? $t('reports.noDataAvailable') : ''"
            class="w-full mb-4 min-w-max"
          />
        </div>
      </div>

      <!-- Summary -->
      <div v-if="guests.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.frontOffice.guestListSummary') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalGuests }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.totalGuests') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ checkedInGuests }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.checkedInGuests') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-600">{{ checkedOutGuests }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.checkedOutGuests') }}</div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import Spinner from '../../../components/spinner/Spinner.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { getGuestListReport } from '@/services/reportsApi'
import type { Action, Column } from '../../../utils/models'

const { t } = useI18n()
const router = useRouter()

interface FilterOptions {
  value: string;
  label: string;
}

interface Guest {
  guestName: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  status: string
}

interface Filters {
  startDate: string;
  endDate: string;
  status: string;
}

// Set default dates to today
const today = new Date().toISOString().split('T')[0]

const filters = ref<Filters>({
  startDate: today,
  endDate: today,
  status: ''
})

// State
const guests = ref<Guest[]>([])
// Fonction pour normaliser et traduire le statut
const translateStatus = (status: string): string => {
  if (!status) return status
  
  // Normaliser le statut (supprimer espaces, uniformiser la casse)
  const normalized = status.trim().replace(/\s+/g, '-')
  
  // Mapper les différentes variantes vers les clés de traduction
  const statusMap: Record<string, string> = {
    'checked-in': 'reservationStatus.Checked-in',
    'checked_in': 'reservationStatus.checked_in',
    'checkedin': 'reservationStatus.Checked-in',
    'Checked-In': 'reservationStatus.Checked-in',
    'CHECKED-IN': 'reservationStatus.Checked-in',
    'checked-out': 'reservationStatus.Checked-out',
    'checked_out': 'reservationStatus.checked_out',
    'checkedout': 'reservationStatus.Checked-out',
    'Checked-Out': 'reservationStatus.Checked-out',
    'CHECKED-OUT': 'reservationStatus.Checked-out',
    'pending': 'reservationStatus.Pending',
    'Pending': 'reservationStatus.Pending',
    'PENDING': 'reservationStatus.Pending',
    'confirmed': 'reservationStatus.confirmed',
    'Confirmed': 'reservationStatus.Confirmed',
    'cancelled': 'reservationStatus.Cancelled',
    'Cancelled': 'reservationStatus.Cancelled',
    'no-show': 'reservationStatus.No-show',
    'no_show': 'reservationStatus.no_show',
    'No-show': 'reservationStatus.No-show',
    'voided': 'reservationStatus.Voided',
    'Voided': 'reservationStatus.Voided',
  }
  
  // Chercher une correspondance exacte
  if (statusMap[normalized]) {
    const translated = t(statusMap[normalized])
    return translated !== statusMap[normalized] ? translated : status
  }
  
  // Chercher une correspondance insensible à la casse
  const lowerNormalized = normalized.toLowerCase()
  for (const [key, translationKey] of Object.entries(statusMap)) {
    if (key.toLowerCase() === lowerNormalized) {
      const translated = t(translationKey)
      return translated !== translationKey ? translated : status
    }
  }
  
  // Si aucune correspondance, essayer directement avec le statut normalisé
  const directKey = `reservationStatus.${normalized}`
  const directTranslation = t(directKey)
  if (directTranslation !== directKey) {
    return directTranslation
  }
  
  // Fallback : retourner le statut original
  return status
}

const displayGuests = computed(() =>
  guests.value.map(guest => ({
    ...guest,
    statusKey: guest.status,
    statusLabel: translateStatus(guest.status),
  }))
)

const statusBadgeColors = computed(() => ({
  [t('reservationStatus.Checked-in')]: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  [t('reservationStatus.checked_in')]: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  [t('reservationStatus.Checked-out')]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  [t('reservationStatus.checked_out')]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  [t('reservationStatus.Pending')]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
}))

const loading = ref(false)
const error = ref('')
const showResults = ref<boolean>(false)

// Options for selects
const statusOptions = computed<FilterOptions[]>(() => [
  { value: '', label: t('common.all') },
  { value: 'check_in', label: t('reservationStatus.Checked-in') },
  { value: 'check_out', label: t('reservationStatus.Checked-out') }
])

// Computed properties
const hotelName = computed(() => {
  return useServiceStore().getCurrentService?.hotelName
})

const totalGuests = computed(() => guests.value.length)

const checkedInGuests = computed(() => 
  guests.value.filter(guest => {
    const status = guest.status?.toLowerCase().replace(/[_\s-]/g, '')
    return status === 'checkedin' || status === 'checked-in' || status === 'checked_in'
  }).length
)

const checkedOutGuests = computed(() => 
  guests.value.filter(guest => {
    const status = guest.status?.toLowerCase().replace(/[_\s-]/g, '')
    return status === 'checkedout' || status === 'checked-out' || status === 'checked_out'
  }).length
)

// Methods
const generateReport = async () => {
  if (!filters.value.startDate || !filters.value.endDate) {
    error.value = t('validation.dateRangeRequired')
    return
  }

  loading.value = true
  error.value = ''
  showResults.value = false
  
  try {
    console.log('Generating guest list report with filters:', filters.value)
    const response = await getGuestListReport(filters.value)
    console.log('Guest list report response:', response)
    // Certaines API ne renvoient pas de drapeau "success"; on lit directement guestList
    const payload = response?.data?.data ?? response?.data ?? {}
    const list = payload?.guestList
    guests.value = Array.isArray(list) ? list : []
    showResults.value = true
  } catch (err) {
    console.error('Error fetching guest list:', err)
    error.value = t('anErrorOcurr')
    guests.value = []
    showResults.value = false
  } finally {
    loading.value = false
  }
}

const resetForm = (): void => {
  const todayDate = new Date()
  const weekAgo = new Date(todayDate)
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  filters.value = {
    startDate: weekAgo.toISOString().split('T')[0],
    endDate: todayDate.toISOString().split('T')[0],
    status: ''
  }
  showResults.value = false
  guests.value = []
  error.value = ''
}

const viewDetails = (guest: Guest) => {
  console.log('View details for:', guest.guestName)
  // Navigate to guest details if available
}

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { key: 'checkInDate', label: t('common.checkInDate'), type: 'text' },
  { key: 'checkOutDate', label: t('common.checkOutDate'), type: 'text' },
  { 
    key: 'statusLabel', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: statusBadgeColors.value,
  }
])

const tableActions = computed<Action[]>(() => [
  {
    label: t('common.view'),
    handler: (item: Guest) => viewDetails(item),
    variant: 'primary'
  }
])

// Initialize default dates (7 days ago to today)
onMounted(() => {
  const todayDate = new Date()
  const weekAgo = new Date(todayDate)
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  filters.value.endDate = todayDate.toISOString().split('T')[0]
  filters.value.startDate = weekAgo.toISOString().split('T')[0]
})
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>