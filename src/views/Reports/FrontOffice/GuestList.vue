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
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.startDate') }}
            </label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.endDate') }}
            </label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="check_in">{{ $t('bookings.status.checked-in') }}</option>
              <option value="check_out">{{ $t('bookings.status.checked-out') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="generateReport"
            :disabled="!filters.startDate || !filters.endDate || loading"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </span>
            {{ loading ? $t('common.generating') : $t('common.generateReport') }}
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Results -->
      <ReusableTable
        :title="$t('reports.frontOffice.guestList')"
        :columns="tableColumns"
        :data="guests"
        :actions="tableActions"
        :searchable="true"
        :loading="loading"
        :empty-message="guests.length === 0 && !loading ? $t('reports.noDataAvailable') : ''"
      />

      <!-- Summary -->
      <div v-if="guests.length > 0" class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.summary') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalGuests }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.totalGuests') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ checkedInGuests }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.checkedIn') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-600">{{ checkedOutGuests }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.checkedOut') }}</div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getGuestListReport } from '@/services/reportsApi'
import type { Action, Column } from '../../../utils/models'

const { t } = useI18n()
const router = useRouter()

interface Guest {
  guestName: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  status: string
}

const filters = ref({
  startDate: '',
  endDate: '',
  status: ''
})

const guests = ref<Guest[]>([])
const loading = ref(false)
const error = ref('')

// Computed properties for summary
const totalGuests = computed(() => guests.value.length)

const checkedInGuests = computed(() => 
  guests.value.filter(guest => guest.status === 'Checked-In').length
)

const checkedOutGuests = computed(() => 
  guests.value.filter(guest => guest.status === 'Checked-Out').length
)

const generateReport = async () => {
  if (!filters.value.startDate || !filters.value.endDate) {
    error.value = t('validation.dateRangeRequired')
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const response = await getGuestListReport(filters.value)
    
    if (response && response.data && response.data.success) {
      // Extraire les données correctement selon la structure du backend
      guests.value = response.data.data.guestList || []
    } else {
      error.value = response && response.data && response.data.message ? response.data.message : t('errors.genericError')
      guests.value = []
    }
  } catch (err) {
    console.error('Error fetching guest list:', err)
    error.value = t('errors.failedToLoadData')
    guests.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Checked-In':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'Checked-Out':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  }
}

const viewDetails = (guest: Guest) => {
  // Naviguer vers les détails du client si disponible
  // Note: Le backend ne retourne pas d'ID client, vous pourriez avoir besoin de l'ajouter
  console.log('View details for:', guest.guestName)
}

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { key: 'checkInDate', label: t('common.checkInDate'), type: 'text' },
  { key: 'checkOutDate', label: t('common.checkOutDate'), type: 'text' },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'Checked-In': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'Checked-Out': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  }
])

const tableActions = computed<Action[]>(() => [
  {
    label: t('common.view'),
    handler: (item: Guest) => viewDetails(item),
    variant: 'primary'
  }
])

// Initialiser les dates par défaut (7 derniers jours)
onMounted(() => {
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  filters.value.endDate = today.toISOString().split('T')[0]
  filters.value.startDate = weekAgo.toISOString().split('T')[0]
})
</script>