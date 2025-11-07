<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.statistical.occupancyReports') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.statistical.occupancyReportsDescription') }}
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
            {{ $t('common.groupBy') }}
          </label>
          <select
            v-model="filters.groupBy"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="day">{{ $t('common.daily') }}</option>
            <option value="week">{{ $t('common.weekly') }}</option>
            <option value="month">{{ $t('common.monthly') }}</option>
            <option value="year">{{ $t('common.yearly') }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadOccupancyData"
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
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.statistical.averageOccupancy') }}</h3>
        <p class="text-2xl font-bold text-blue-600">{{ summary.averageOccupancy.toFixed(1) }}%</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span :class="summary.occupancyGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ summary.occupancyGrowth >= 0 ? '+' : '' }}{{ summary.occupancyGrowth.toFixed(1) }}%
          </span>
          {{ $t('common.fromLastPeriod') }}
        </p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.statistical.peakOccupancy') }}</h3>
        <p class="text-2xl font-bold text-green-600">{{ summary.peakOccupancy.toFixed(1) }}%</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ summary.peakDate }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.statistical.lowestOccupancy') }}</h3>
        <p class="text-2xl font-bold text-red-600">{{ summary.lowestOccupancy.toFixed(1) }}%</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ summary.lowestDate }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.statistical.totalRoomNights') }}</h3>
        <p class="text-2xl font-bold text-purple-600">{{ summary.totalRoomNights.toLocaleString() }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('reports.statistical.soldRoomNights') }}</p>
      </div>
    </div>

    <!-- Occupancy Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('reports.statistical.occupancyTrend') }}
      </h2>
      <div class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('common.chartPlaceholder') }}</p>
      </div>
    </div>

    <!-- Occupancy by Room Type -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.statistical.occupancyByRoomType') }}
        </h2>
        <div class="space-y-4">
          <div v-for="roomType in occupancyByRoomType" :key="roomType.type" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="roomType.color" class="w-4 h-4 rounded mr-3"></div>
              <span class="text-gray-700 dark:text-gray-300">{{ $t(`rooms.types.${roomType.type}`) }}</span>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-900 dark:text-white">{{ roomType.occupancy.toFixed(1) }}%</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ roomType.roomsSold }}/{{ roomType.totalRooms }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.statistical.weeklyOccupancyPattern') }}
        </h2>
        <div class="space-y-4">
          <div v-for="day in weeklyPattern" :key="day.day" class="flex items-center justify-between">
            <span class="text-gray-700 dark:text-gray-300">{{ $t(`common.days.${day.day}`) }}</span>
            <div class="flex items-center">
              <div class="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                <div 
                  :style="{ width: day.occupancy + '%' }"
                  :class="getOccupancyColor(day.occupancy)"
                  class="h-2 rounded-full transition-all duration-300"
                ></div>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white w-12 text-right">{{ day.occupancy.toFixed(0) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Occupancy Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('reports.statistical.detailedOccupancy') }}
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
                {{ $t('common.totalRooms') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.occupiedRooms') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.availableRooms') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('reports.statistical.occupancyRate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.revenue') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('reports.statistical.adr') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('reports.statistical.revpar') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="entry in occupancyData" :key="entry.date">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatDate(entry.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ entry.totalRooms }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ entry.occupiedRooms }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ entry.availableRooms }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getOccupancyBadgeClass(entry.occupancyRate)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ entry.occupancyRate.toFixed(1) }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.revenue.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.adr.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.revpar.toFixed(2) }}
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

interface OccupancyEntry {
  date: string
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  occupancyRate: number
  revenue: number
  adr: number
  revpar: number
}

interface RoomTypeOccupancy {
  type: string
  occupancy: number
  roomsSold: number
  totalRooms: number
  color: string
}

interface WeeklyPattern {
  day: string
  occupancy: number
}

const filters = ref({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  roomType: '',
  groupBy: 'day'
})

const occupancyData = ref<OccupancyEntry[]>([])
const occupancyByRoomType = ref<RoomTypeOccupancy[]>([])
const weeklyPattern = ref<WeeklyPattern[]>([])

const summary = computed(() => {
  if (occupancyData.value.length === 0) {
    return {
      averageOccupancy: 0,
      peakOccupancy: 0,
      lowestOccupancy: 0,
      totalRoomNights: 0,
      occupancyGrowth: 0,
      peakDate: '',
      lowestDate: ''
    }
  }
  
  const averageOccupancy = occupancyData.value.reduce((sum, entry) => sum + entry.occupancyRate, 0) / occupancyData.value.length
  const peakEntry = occupancyData.value.reduce((max, entry) => entry.occupancyRate > max.occupancyRate ? entry : max)
  const lowestEntry = occupancyData.value.reduce((min, entry) => entry.occupancyRate < min.occupancyRate ? entry : min)
  const totalRoomNights = occupancyData.value.reduce((sum, entry) => sum + entry.occupiedRooms, 0)
  
  return {
    averageOccupancy,
    peakOccupancy: peakEntry.occupancyRate,
    lowestOccupancy: lowestEntry.occupancyRate,
    totalRoomNights,
    occupancyGrowth: 8.5, // Mock growth percentage
    peakDate: formatDate(peakEntry.date),
    lowestDate: formatDate(lowestEntry.date)
  }
})

const loadOccupancyData = async () => {
  // Mock data for demonstration
  occupancyData.value = [
    {
      date: '2024-01-10',
      totalRooms: 100,
      occupiedRooms: 85,
      availableRooms: 15,
      occupancyRate: 85.0,
      revenue: 12750.00,
      adr: 150.00,
      revpar: 127.50
    },
    {
      date: '2024-01-11',
      totalRooms: 100,
      occupiedRooms: 92,
      availableRooms: 8,
      occupancyRate: 92.0,
      revenue: 14720.00,
      adr: 160.00,
      revpar: 147.20
    },
    {
      date: '2024-01-12',
      totalRooms: 100,
      occupiedRooms: 78,
      availableRooms: 22,
      occupancyRate: 78.0,
      revenue: 11700.00,
      adr: 150.00,
      revpar: 117.00
    },
    {
      date: '2024-01-13',
      totalRooms: 100,
      occupiedRooms: 95,
      availableRooms: 5,
      occupancyRate: 95.0,
      revenue: 15675.00,
      adr: 165.00,
      revpar: 156.75
    }
  ]
  
  occupancyByRoomType.value = [
    {
      type: 'standard',
      occupancy: 88.5,
      roomsSold: 177,
      totalRooms: 200,
      color: 'bg-blue-500'
    },
    {
      type: 'deluxe',
      occupancy: 82.0,
      roomsSold: 82,
      totalRooms: 100,
      color: 'bg-green-500'
    },
    {
      type: 'suite',
      occupancy: 75.0,
      roomsSold: 30,
      totalRooms: 40,
      color: 'bg-purple-500'
    }
  ]
  
  weeklyPattern.value = [
    { day: 'mon', occupancy: 75.5 },
    { day: 'tue', occupancy: 78.2 },
    { day: 'wed', occupancy: 82.1 },
    { day: 'thu', occupancy: 85.7 },
    { day: 'fri', occupancy: 92.3 },
    { day: 'sat', occupancy: 96.8 },
    { day: 'sun', occupancy: 88.4 }
  ]
}

const exportReport = () => {
  console.log('Exporting occupancy report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getOccupancyColor = (occupancy: number) => {
  if (occupancy >= 90) return 'bg-green-500'
  if (occupancy >= 80) return 'bg-blue-500'
  if (occupancy >= 70) return 'bg-yellow-500'
  if (occupancy >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const getOccupancyBadgeClass = (occupancy: number) => {
  if (occupancy >= 90) return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
  if (occupancy >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  if (occupancy >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
  if (occupancy >= 60) return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
  return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
}

onMounted(() => {
  loadOccupancyData()
})
</script>