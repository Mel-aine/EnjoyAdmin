<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.reservation.confirmedReservations') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.reservation.confirmedReservationsDescription') }}
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
            <option v-for="option in roomTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.bookingSource') }}
          </label>
          <select
            v-model="filters.bookingSource"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option v-for="option in bookingSourceOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadConfirmedReservations"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ $t('common.search') }}
        </button>
        <button
          @click="exportReport"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {{ $t('common.export') }}
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.totalConfirmed') }}</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalConfirmed }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.totalRevenue') }}</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.totalNights') }}</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalNights }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.averageRate') }}</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.averageRate.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('reports.reservation.confirmedReservationsResults') }}
        </h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.reservationId') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.guestName') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.roomType') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.arrivalDate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.departureDate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.nights') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.totalAmount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.bookingSource') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="reservation in confirmedReservations" :key="reservation.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ reservation.reservationId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ reservation.guestName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ translateRoomType(reservation.roomType) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(reservation.arrivalDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(reservation.departureDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ reservation.nights }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ reservation.totalAmount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ translateBookingSource(reservation.bookingSource) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewDetails(reservation.id)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {{ $t('common.view') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))

const { t } = useI18n()

interface ConfirmedReservation {
  id: string
  reservationId: string
  guestName: string
  roomType: string
  arrivalDate: string
  departureDate: string
  nights: number
  totalAmount: number
  bookingSource: string
}

const filters = ref({
  dateFrom: new Date().toISOString().split('T')[0],
  dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  roomType: '',
  bookingSource: ''
})

const confirmedReservations = ref<ConfirmedReservation[]>([])

// Options for room types
const roomTypeOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'standard', label: t('rooms.types.standard') },
  { value: 'deluxe', label: t('rooms.types.deluxe') },
  { value: 'suite', label: t('rooms.types.suite') }
])

// Options for booking sources
const bookingSourceOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'direct', label: t('bookings.sources.direct') },
  { value: 'online', label: t('bookings.sources.online') },
  { value: 'agent', label: t('bookings.sources.agent') }
])

const summary = computed(() => {
  const totalConfirmed = confirmedReservations.value.length
  const totalRevenue = confirmedReservations.value.reduce((sum, res) => sum + res.totalAmount, 0)
  const totalNights = confirmedReservations.value.reduce((sum, res) => sum + res.nights, 0)
  const averageRate = totalNights > 0 ? totalRevenue / totalNights : 0
  
  return {
    totalConfirmed,
    totalRevenue,
    totalNights,
    averageRate
  }
})

const loadConfirmedReservations = async () => {
  // Mock data for demonstration
  confirmedReservations.value = [
    {
      id: '1',
      reservationId: 'RES001',
      guestName: 'John Doe',
      roomType: 'standard',
      arrivalDate: '2024-01-20',
      departureDate: '2024-01-23',
      nights: 3,
      totalAmount: 450.00,
      bookingSource: 'direct'
    },
    {
      id: '2',
      reservationId: 'RES002',
      guestName: 'Jane Smith',
      roomType: 'deluxe',
      arrivalDate: '2024-01-25',
      departureDate: '2024-01-30',
      nights: 5,
      totalAmount: 750.00,
      bookingSource: 'online'
    },
    {
      id: '3',
      reservationId: 'RES003',
      guestName: 'Bob Wilson',
      roomType: 'suite',
      arrivalDate: '2024-02-01',
      departureDate: '2024-02-05',
      nights: 4,
      totalAmount: 1200.00,
      bookingSource: 'agent'
    }
  ]
}

const exportReport = () => {
  // Implementation for exporting report
  console.log('Exporting confirmed reservations report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const viewDetails = (id: string) => {
  // Implementation for viewing reservation details
  console.log('Viewing details for reservation:', id)
}

// Helper functions for translations
const translateRoomType = (roomType: string) => {
  if (!roomType) return ''
  return t(`rooms.types.${roomType.toLowerCase()}`)
}

const translateBookingSource = (bookingSource: string) => {
  if (!bookingSource) return ''
  return t(`bookings.sources.${bookingSource}`)
}

onMounted(() => {
  loadConfirmedReservations()
})
</script>