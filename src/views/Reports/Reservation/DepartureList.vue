<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.reservation.departureList') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.reservation.departureListDescription') }}
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
            {{ $t('common.departureDate') }}
          </label>
          <input
            v-model="filters.departureDate"
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
            {{ $t('common.checkoutStatus') }}
          </label>
          <select
            v-model="filters.checkoutStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="checked-out">{{ $t('bookings.status.checkedOut') }}</option>
            <option value="pending-checkout">{{ $t('bookings.status.pendingCheckout') }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadDepartures"
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

    <!-- Results Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('reports.reservation.departureResults') }}
        </h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
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
                {{ $t('common.departureDate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.totalAmount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.checkoutStatus') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="departure in departures" :key="departure.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ departure.guestName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ departure.roomNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ departure.roomType }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(departure.arrivalDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(departure.departureDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ departure.totalAmount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(departure.checkoutStatus)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ $t(`bookings.status.${departure.checkoutStatus}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewDetails(departure.id)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                >
                  {{ $t('common.view') }}
                </button>
                <button
                  v-if="departure.checkoutStatus === 'pending-checkout'"
                  @click="processCheckout(departure.id)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                  {{ $t('common.checkout') }}
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

interface Departure {
  id: string
  guestName: string
  roomNumber: string
  roomType: string
  arrivalDate: string
  departureDate: string
  totalAmount: number
  checkoutStatus: string
}

const filters = ref({
  departureDate: new Date().toISOString().split('T')[0],
  roomType: '',
  checkoutStatus: ''
})

const departures = ref<Departure[]>([])

const loadDepartures = async () => {
  // Mock data for demonstration
  departures.value = [
    {
      id: '1',
      guestName: 'Alice Johnson',
      roomNumber: '102',
      roomType: 'Standard',
      arrivalDate: '2024-01-12',
      departureDate: '2024-01-15',
      totalAmount: 450.00,
      checkoutStatus: 'checked-out'
    },
    {
      id: '2',
      guestName: 'Bob Wilson',
      roomNumber: '301',
      roomType: 'Suite',
      arrivalDate: '2024-01-10',
      departureDate: '2024-01-15',
      totalAmount: 850.00,
      checkoutStatus: 'pending-checkout'
    }
  ]
}

const exportReport = () => {
  // Implementation for exporting report
  console.log('Exporting departure list report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'checked-out':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'pending-checkout':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const viewDetails = (id: string) => {
  // Implementation for viewing reservation details
  console.log('Viewing details for reservation:', id)
}

const processCheckout = (id: string) => {
  // Implementation for processing checkout
  console.log('Processing checkout for reservation:', id)
}

onMounted(() => {
  loadDepartures()
})
</script>