<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.reservation.cancelledReservations') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.reservation.cancelledReservationsDescription') }}
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
            {{ $t('common.cancellationDateFrom') }}
          </label>
          <input
            v-model="filters.cancellationDateFrom"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.cancellationDateTo') }}
          </label>
          <input
            v-model="filters.cancellationDateTo"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.cancellationReason') }}
          </label>
          <select
            v-model="filters.cancellationReason"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="guest-request">{{ $t('cancellation.reasons.guestRequest') }}</option>
            <option value="no-payment">{{ $t('cancellation.reasons.noPayment') }}</option>
            <option value="overbooking">{{ $t('cancellation.reasons.overbooking') }}</option>
            <option value="other">{{ $t('cancellation.reasons.other') }}</option>
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
            <option value="">{{ $t('common.all') }}</option>
            <option value="direct">{{ $t('bookings.sources.direct') }}</option>
            <option value="online">{{ $t('bookings.sources.online') }}</option>
            <option value="agent">{{ $t('bookings.sources.agent') }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadCancelledReservations"
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
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.totalCancelled') }}</h3>
        <p class="text-2xl font-bold text-red-600">{{ summary.totalCancelled }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.lostRevenue') }}</h3>
        <p class="text-2xl font-bold text-red-600">${{ summary.lostRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.cancellationFees') }}</h3>
        <p class="text-2xl font-bold text-green-600">${{ summary.cancellationFees.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('reports.reservation.cancelledReservationsResults') }}
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
                {{ $t('common.cancellationDate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.cancellationReason') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.originalAmount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.cancellationFee') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.refundAmount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="reservation in cancelledReservations" :key="reservation.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ reservation.reservationId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ reservation.guestName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(reservation.cancellationDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ $t(`cancellation.reasons.${reservation.cancellationReason}`) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ reservation.originalAmount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ reservation.cancellationFee.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ reservation.refundAmount.toFixed(2) }}
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

interface CancelledReservation {
  id: string
  reservationId: string
  guestName: string
  cancellationDate: string
  cancellationReason: string
  originalAmount: number
  cancellationFee: number
  refundAmount: number
}

const filters = ref({
  cancellationDateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  cancellationDateTo: new Date().toISOString().split('T')[0],
  cancellationReason: '',
  bookingSource: ''
})

const cancelledReservations = ref<CancelledReservation[]>([])

const summary = computed(() => {
  const totalCancelled = cancelledReservations.value.length
  const lostRevenue = cancelledReservations.value.reduce((sum, res) => sum + res.originalAmount, 0)
  const cancellationFees = cancelledReservations.value.reduce((sum, res) => sum + res.cancellationFee, 0)
  
  return {
    totalCancelled,
    lostRevenue,
    cancellationFees
  }
})

const loadCancelledReservations = async () => {
  // Mock data for demonstration
  cancelledReservations.value = [
    {
      id: '1',
      reservationId: 'RES004',
      guestName: 'Alice Brown',
      cancellationDate: '2024-01-10',
      cancellationReason: 'guest-request',
      originalAmount: 600.00,
      cancellationFee: 50.00,
      refundAmount: 550.00
    },
    {
      id: '2',
      reservationId: 'RES005',
      guestName: 'Charlie Davis',
      cancellationDate: '2024-01-12',
      cancellationReason: 'no-payment',
      originalAmount: 300.00,
      cancellationFee: 0.00,
      refundAmount: 0.00
    }
  ]
}

const exportReport = () => {
  console.log('Exporting cancelled reservations report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const viewDetails = (id: string) => {
  console.log('Viewing details for cancelled reservation:', id)
}

onMounted(() => {
  loadCancelledReservations()
})
</script>