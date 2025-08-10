<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.statistical.adrReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.statistical.adrReportDescription') }}
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.currentADR') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.currentADR.toFixed(2) }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.previousPeriodADR') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.previousADR.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.adrChange') }}</p>
              <p class="text-2xl font-bold" :class="summary.adrChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ summary.adrChange >= 0 ? '+' : '' }}{{ summary.adrChange.toFixed(1) }}%
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalRevenue') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.totalRevenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.adrTrend') }}
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
            {{ $t('reports.adrByRoomType') }}
          </h3>
          <div class="space-y-4">
            <div v-for="roomType in adrByRoomType" :key="roomType.type" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: roomType.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${roomType.type}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ roomType.adr.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ roomType.rooms }} {{ $t('common.rooms') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ADR Details Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.adrDetails') }}
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
                  {{ $t('common.roomsSold') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.totalRevenue') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.adr') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.occupancyRate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.revpar') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="record in filteredADRData" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(record.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ $t(`common.${record.roomType}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ record.roomsSold }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ record.totalRevenue.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  ${{ record.adr.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ record.occupancyRate.toFixed(1) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ record.revpar.toFixed(2) }}
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  roomType: '',
  period: 'daily'
})

// Mock data
const adrData = ref([
  {
    id: 1,
    date: '2024-01-15',
    roomType: 'standard',
    roomsSold: 25,
    totalRevenue: 3750.00,
    adr: 150.00,
    occupancyRate: 83.3,
    revpar: 125.00
  },
  {
    id: 2,
    date: '2024-01-15',
    roomType: 'deluxe',
    roomsSold: 15,
    totalRevenue: 3000.00,
    adr: 200.00,
    occupancyRate: 75.0,
    revpar: 150.00
  },
  {
    id: 3,
    date: '2024-01-15',
    roomType: 'suite',
    roomsSold: 8,
    totalRevenue: 2400.00,
    adr: 300.00,
    occupancyRate: 80.0,
    revpar: 240.00
  },
  {
    id: 4,
    date: '2024-01-16',
    roomType: 'standard',
    roomsSold: 28,
    totalRevenue: 4200.00,
    adr: 150.00,
    occupancyRate: 93.3,
    revpar: 140.00
  },
  {
    id: 5,
    date: '2024-01-16',
    roomType: 'deluxe',
    roomsSold: 18,
    totalRevenue: 3600.00,
    adr: 200.00,
    occupancyRate: 90.0,
    revpar: 180.00
  },
  {
    id: 6,
    date: '2024-01-16',
    roomType: 'suite',
    roomsSold: 10,
    totalRevenue: 3000.00,
    adr: 300.00,
    occupancyRate: 100.0,
    revpar: 300.00
  },
  {
    id: 7,
    date: '2024-01-17',
    roomType: 'presidential',
    roomsSold: 2,
    totalRevenue: 1000.00,
    adr: 500.00,
    occupancyRate: 100.0,
    revpar: 500.00
  }
])

// Computed properties
const filteredADRData = computed(() => {
  return adrData.value.filter(record => {
    const matchesDateFrom = !filters.value.dateFrom || record.date >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || record.date <= filters.value.dateTo
    const matchesRoomType = !filters.value.roomType || record.roomType === filters.value.roomType
    
    return matchesDateFrom && matchesDateTo && matchesRoomType
  })
})

const summary = computed(() => {
  const filtered = filteredADRData.value
  const totalRevenue = filtered.reduce((sum, r) => sum + r.totalRevenue, 0)
  const totalRoomsSold = filtered.reduce((sum, r) => sum + r.roomsSold, 0)
  const currentADR = totalRoomsSold > 0 ? totalRevenue / totalRoomsSold : 0
  
  // Mock previous period data for comparison
  const previousADR = 175.00
  const adrChange = previousADR > 0 ? ((currentADR - previousADR) / previousADR) * 100 : 0
  
  return {
    currentADR,
    previousADR,
    adrChange,
    totalRevenue
  }
})

const adrByRoomType = computed(() => {
  const roomTypes = [
    { type: 'standard', color: '#3B82F6' },
    { type: 'deluxe', color: '#10B981' },
    { type: 'suite', color: '#8B5CF6' },
    { type: 'presidential', color: '#F59E0B' }
  ]
  
  return roomTypes.map(roomType => {
    const typeData = filteredADRData.value.filter(r => r.roomType === roomType.type)
    const totalRevenue = typeData.reduce((sum, r) => sum + r.totalRevenue, 0)
    const totalRooms = typeData.reduce((sum, r) => sum + r.roomsSold, 0)
    const adr = totalRooms > 0 ? totalRevenue / totalRooms : 0
    
    return {
      ...roomType,
      adr,
      rooms: totalRooms
    }
  }).filter(rt => rt.rooms > 0)
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>