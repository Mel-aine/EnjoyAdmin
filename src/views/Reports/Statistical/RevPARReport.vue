<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.statistical.revparReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.statistical.revparReportDescription') }}
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
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <select
              v-model="filters.roomType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="standard">{{ $t('common.standard') }}</option>
              <option value="deluxe">{{ $t('common.deluxe') }}</option>
              <option value="suite">{{ $t('common.suite') }}</option>
              <option value="presidential">{{ $t('common.presidential') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.period') }}
            </label>
            <select
              v-model="filters.period"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="daily">{{ $t('common.daily') }}</option>
              <option value="weekly">{{ $t('common.weekly') }}</option>
              <option value="monthly">{{ $t('common.monthly') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.currentRevPAR') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.currentRevPAR.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.previousRevPAR') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.previousRevPAR.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.revparChange') }}</p>
              <p class="text-2xl font-bold" :class="summary.revparChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ summary.revparChange >= 0 ? '+' : '' }}{{ summary.revparChange.toFixed(1) }}%
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgOccupancy') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.avgOccupancy.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.revparTrend') }}
          </h3>
          <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <!-- Chart placeholder -->
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p>{{ $t('reports.chartPlaceholder') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.revparByRoomType') }}
          </h3>
          <div class="space-y-4">
            <div v-for="roomType in revparByRoomType" :key="roomType.type" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: roomType.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${roomType.type}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ roomType.revpar.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ roomType.occupancy.toFixed(1) }}% {{ $t('common.occupancy') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.keyMetrics') }}
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.adr') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ metrics.adr.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.occupancyRate') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ metrics.occupancyRate.toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.revpar') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ metrics.revpar.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.totalRooms') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ metrics.totalRooms }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.marketComparison') }}
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.marketRevPAR') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ marketComparison.marketRevPAR.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.revparIndex') }}</span>
              <span class="text-sm font-medium" :class="marketComparison.revparIndex >= 100 ? 'text-green-600' : 'text-red-600'">
                {{ marketComparison.revparIndex.toFixed(1) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.marketShare') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ marketComparison.marketShare.toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.competitorSet') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ marketComparison.competitorSet }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.forecastData') }}
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.nextWeekRevPAR') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ forecast.nextWeekRevPAR.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.nextMonthRevPAR') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ forecast.nextMonthRevPAR.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.forecastAccuracy') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ forecast.accuracy.toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.confidenceLevel') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ forecast.confidence }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RevPAR Details Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.revparDetails') }}
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
                  {{ $t('common.roomType') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.availableRooms') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.roomsSold') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.occupancyRate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.adr') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.revpar') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.totalRevenue') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="record in filteredRevPARData" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(record.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ $t(`common.${record.roomType}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ record.availableRooms }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ record.roomsSold }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ record.occupancyRate.toFixed(1) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ record.adr.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  ${{ record.revpar.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ record.totalRevenue.toFixed(2) }}
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
import { ref, computed } from 'vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  roomType: '',
  period: 'daily'
})

// Mock data
const revparData = ref([
  {
    id: 1,
    date: '2024-01-15',
    roomType: 'standard',
    availableRooms: 30,
    roomsSold: 25,
    occupancyRate: 83.3,
    adr: 150.00,
    revpar: 125.00,
    totalRevenue: 3750.00
  },
  {
    id: 2,
    date: '2024-01-15',
    roomType: 'deluxe',
    availableRooms: 20,
    roomsSold: 15,
    occupancyRate: 75.0,
    adr: 200.00,
    revpar: 150.00,
    totalRevenue: 3000.00
  },
  {
    id: 3,
    date: '2024-01-15',
    roomType: 'suite',
    availableRooms: 10,
    roomsSold: 8,
    occupancyRate: 80.0,
    adr: 300.00,
    revpar: 240.00,
    totalRevenue: 2400.00
  },
  {
    id: 4,
    date: '2024-01-16',
    roomType: 'standard',
    availableRooms: 30,
    roomsSold: 28,
    occupancyRate: 93.3,
    adr: 150.00,
    revpar: 140.00,
    totalRevenue: 4200.00
  },
  {
    id: 5,
    date: '2024-01-16',
    roomType: 'deluxe',
    availableRooms: 20,
    roomsSold: 18,
    occupancyRate: 90.0,
    adr: 200.00,
    revpar: 180.00,
    totalRevenue: 3600.00
  },
  {
    id: 6,
    date: '2024-01-16',
    roomType: 'suite',
    availableRooms: 10,
    roomsSold: 10,
    occupancyRate: 100.0,
    adr: 300.00,
    revpar: 300.00,
    totalRevenue: 3000.00
  },
  {
    id: 7,
    date: '2024-01-17',
    roomType: 'presidential',
    availableRooms: 2,
    roomsSold: 2,
    occupancyRate: 100.0,
    adr: 500.00,
    revpar: 500.00,
    totalRevenue: 1000.00
  }
])

// Computed properties
const filteredRevPARData = computed(() => {
  return revparData.value.filter(record => {
    const matchesDateFrom = !filters.value.dateFrom || record.date >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || record.date <= filters.value.dateTo
    const matchesRoomType = !filters.value.roomType || record.roomType === filters.value.roomType
    
    return matchesDateFrom && matchesDateTo && matchesRoomType
  })
})

const summary = computed(() => {
  const filtered = filteredRevPARData.value
  const totalRevenue = filtered.reduce((sum, r) => sum + r.totalRevenue, 0)
  const totalAvailableRooms = filtered.reduce((sum, r) => sum + r.availableRooms, 0)
  const totalOccupiedRooms = filtered.reduce((sum, r) => sum + r.roomsSold, 0)
  
  const currentRevPAR = totalAvailableRooms > 0 ? totalRevenue / totalAvailableRooms : 0
  const avgOccupancy = totalAvailableRooms > 0 ? (totalOccupiedRooms / totalAvailableRooms) * 100 : 0
  
  // Mock previous period data for comparison
  const previousRevPAR = 145.00
  const revparChange = previousRevPAR > 0 ? ((currentRevPAR - previousRevPAR) / previousRevPAR) * 100 : 0
  
  return {
    currentRevPAR,
    previousRevPAR,
    revparChange,
    avgOccupancy
  }
})

const revparByRoomType = computed(() => {
  const roomTypes = [
    { type: 'standard', color: '#3B82F6' },
    { type: 'deluxe', color: '#10B981' },
    { type: 'suite', color: '#8B5CF6' },
    { type: 'presidential', color: '#F59E0B' }
  ]
  
  return roomTypes.map(roomType => {
    const typeData = filteredRevPARData.value.filter(r => r.roomType === roomType.type)
    const totalRevenue = typeData.reduce((sum, r) => sum + r.totalRevenue, 0)
    const totalAvailableRooms = typeData.reduce((sum, r) => sum + r.availableRooms, 0)
    const totalOccupiedRooms = typeData.reduce((sum, r) => sum + r.roomsSold, 0)
    
    const revpar = totalAvailableRooms > 0 ? totalRevenue / totalAvailableRooms : 0
    const occupancy = totalAvailableRooms > 0 ? (totalOccupiedRooms / totalAvailableRooms) * 100 : 0
    
    return {
      ...roomType,
      revpar,
      occupancy
    }
  }).filter(rt => rt.revpar > 0)
})

const metrics = computed(() => {
  const filtered = filteredRevPARData.value
  const totalRevenue = filtered.reduce((sum, r) => sum + r.totalRevenue, 0)
  const totalRoomsSold = filtered.reduce((sum, r) => sum + r.roomsSold, 0)
  const totalAvailableRooms = filtered.reduce((sum, r) => sum + r.availableRooms, 0)
  
  return {
    adr: totalRoomsSold > 0 ? totalRevenue / totalRoomsSold : 0,
    occupancyRate: totalAvailableRooms > 0 ? (totalRoomsSold / totalAvailableRooms) * 100 : 0,
    revpar: totalAvailableRooms > 0 ? totalRevenue / totalAvailableRooms : 0,
    totalRooms: totalAvailableRooms
  }
})

const marketComparison = ref({
  marketRevPAR: 135.50,
  revparIndex: 112.3,
  marketShare: 18.5,
  competitorSet: 'Luxury Hotels'
})

const forecast = ref({
  nextWeekRevPAR: 165.75,
  nextMonthRevPAR: 158.20,
  accuracy: 87.3,
  confidence: 85
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>