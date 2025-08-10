<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.reservation.noShowReservations') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.reservation.noShowReservationsDescription') }}
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
            {{ $t('common.arrivalDateFrom') }}
          </label>
          <input
            v-model="filters.arrivalDateFrom"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.arrivalDateTo') }}
          </label>
          <input
            v-model="filters.arrivalDateTo"
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
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadNoShowReservations"
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.totalNoShows') }}</h3>
        <p class="text-2xl font-bold text-red-600">{{ summary.totalNoShows }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.lostRevenue') }}</h3>
        <p class="text-2xl font-bold text-red-600">${{ summary.lostRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.noShowFees') }}</h3>
        <p class="text-2xl font-bold text-green-600">${{ summary.noShowFees.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('reports.reservation.noShowReservationsResults') }}
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
                {{ $t('common.roomNumber') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.roomType') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.arrivalDate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.originalAmount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.noShowFee') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.contactAttempts') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="reservation in noShowReservations" :key="reservation.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ reservation.reservationId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ reservation.guestName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ reservation.roomNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ reservation.roomType }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(reservation.arrivalDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ reservation.originalAmount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ reservation.noShowFee.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ reservation.contactAttempts }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewDetails(reservation.id)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                >
                  {{ $t('common.view') }}
                </button>
                <button
                  @click="markAsNoShow(reservation.id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  {{ $t('common.markNoShow') }}
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

interface NoShowReservation {
  id: string
  reservationId: string
  guestName: string
  roomNumber: string
  roomType: string
  arrivalDate: string
  originalAmount: number
  noShowFee: number
  contactAttempts: number
}

const filters = ref({
  arrivalDateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  arrivalDateTo: new Date().toISOString().split('T')[0],
  roomType: ''
})

const noShowReservations = ref<NoShowReservation[]>([])

const summary = computed(() => {
  const totalNoShows = noShowReservations.value.length
  const lostRevenue = noShowReservations.value.reduce((sum, res) => sum + res.originalAmount, 0)
  const noShowFees = noShowReservations.value.reduce((sum, res) => sum + res.noShowFee, 0)
  
  return {
    totalNoShows,
    lostRevenue,
    noShowFees
  }
})

const loadNoShowReservations = async () => {
  // Mock data for demonstration
  noShowReservations.value = [
    {
      id: '1',
      reservationId: 'RES006',
      guestName: 'David Wilson',
      roomNumber: '203',
      roomType: 'Standard',
      arrivalDate: '2024-01-13',
      originalAmount: 200.00,
      noShowFee: 100.00,
      contactAttempts: 3
    },
    {
      id: '2',
      reservationId: 'RES007',
      guestName: 'Emma Thompson',
      roomNumber: '405',
      roomType: 'Deluxe',
      arrivalDate: '2024-01-14',
      originalAmount: 350.00,
      noShowFee: 175.00,
      contactAttempts: 2
    }
  ]
}

const exportReport = () => {
  console.log('Exporting no-show reservations report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const viewDetails = (id: string) => {
  console.log('Viewing details for no-show reservation:', id)
}

const markAsNoShow = (id: string) => {
  console.log('Marking reservation as no-show:', id)
}

onMounted(() => {
  loadNoShowReservations()
})
</script>