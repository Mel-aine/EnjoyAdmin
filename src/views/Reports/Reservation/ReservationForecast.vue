<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.reservation.reservationForecast') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.reservation.reservationForecastDescription') }}
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
            {{ $t('common.forecastPeriod') }}
          </label>
          <select
            v-model="filters.forecastPeriod"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="7">{{ $t('common.next7Days') }}</option>
            <option value="30">{{ $t('common.next30Days') }}</option>
            <option value="90">{{ $t('common.next90Days') }}</option>
            <option value="365">{{ $t('common.nextYear') }}</option>
          </select>
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
            {{ $t('common.viewType') }}
          </label>
          <select
            v-model="filters.viewType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="daily">{{ $t('common.daily') }}</option>
            <option value="weekly">{{ $t('common.weekly') }}</option>
            <option value="monthly">{{ $t('common.monthly') }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadForecast"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ $t('common.generateForecast') }}
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
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.projectedOccupancy') }}</h3>
        <p class="text-2xl font-bold text-blue-600">{{ summary.projectedOccupancy }}%</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.projectedRevenue') }}</h3>
        <p class="text-2xl font-bold text-green-600">${{ summary.projectedRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.totalReservations') }}</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalReservations }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.reservation.averageADR') }}</h3>
        <p class="text-2xl font-bold text-purple-600">${{ summary.averageADR.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Forecast Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('reports.reservation.occupancyForecastChart') }}
      </h2>
      <div class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('common.chartPlaceholder') }}</p>
      </div>
    </div>

    <!-- Forecast Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('reports.reservation.forecastDetails') }}
        </h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.date') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.arrivals') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.departures') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.occupiedRooms') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.occupancyRate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.projectedRevenue') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.adr') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="forecast in forecastData" :key="forecast.date">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatDate(forecast.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ forecast.arrivals }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ forecast.departures }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ forecast.occupiedRooms }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <span :class="getOccupancyClass(forecast.occupancyRate)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ forecast.occupancyRate }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ forecast.projectedRevenue.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ forecast.adr.toFixed(2) }}
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

interface ForecastData {
  date: string
  arrivals: number
  departures: number
  occupiedRooms: number
  occupancyRate: number
  projectedRevenue: number
  adr: number
}

const filters = ref({
  forecastPeriod: '30',
  roomType: '',
  viewType: 'daily'
})

const forecastData = ref<ForecastData[]>([])

const summary = computed(() => {
  const totalReservations = forecastData.value.reduce((sum, day) => sum + day.arrivals, 0)
  const projectedRevenue = forecastData.value.reduce((sum, day) => sum + day.projectedRevenue, 0)
  const averageOccupancy = forecastData.value.length > 0 
    ? forecastData.value.reduce((sum, day) => sum + day.occupancyRate, 0) / forecastData.value.length 
    : 0
  const averageADR = forecastData.value.length > 0 
    ? forecastData.value.reduce((sum, day) => sum + day.adr, 0) / forecastData.value.length 
    : 0
  
  return {
    projectedOccupancy: Math.round(averageOccupancy),
    projectedRevenue,
    totalReservations,
    averageADR
  }
})

const loadForecast = async () => {
  // Mock data for demonstration
  const days = parseInt(filters.value.forecastPeriod)
  const data: ForecastData[] = []
  
  for (let i = 0; i < Math.min(days, 30); i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      arrivals: Math.floor(Math.random() * 20) + 5,
      departures: Math.floor(Math.random() * 15) + 3,
      occupiedRooms: Math.floor(Math.random() * 80) + 20,
      occupancyRate: Math.floor(Math.random() * 40) + 60,
      projectedRevenue: Math.random() * 5000 + 2000,
      adr: Math.random() * 100 + 150
    })
  }
  
  forecastData.value = data
}

const exportReport = () => {
  console.log('Exporting reservation forecast report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getOccupancyClass = (rate: number) => {
  if (rate >= 90) return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
  if (rate >= 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
  return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
}

onMounted(() => {
  loadForecast()
})
</script>