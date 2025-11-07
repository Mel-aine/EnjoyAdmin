<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.backOffice.revenueReports') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.backOffice.revenueReportsDescription') }}
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
            {{ $t('common.revenueSource') }}
          </label>
          <select
            v-model="filters.revenueSource"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="rooms">{{ $t('revenue.rooms') }}</option>
            <option value="food">{{ $t('revenue.food') }}</option>
            <option value="beverage">{{ $t('revenue.beverage') }}</option>
            <option value="spa">{{ $t('revenue.spa') }}</option>
            <option value="other">{{ $t('revenue.other') }}</option>
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
          @click="loadRevenueData"
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
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.backOffice.totalRevenue') }}</h3>
        <p class="text-2xl font-bold text-green-600">${{ summary.totalRevenue.toFixed(2) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span :class="summary.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ summary.revenueGrowth >= 0 ? '+' : '' }}{{ summary.revenueGrowth.toFixed(1) }}%
          </span>
          {{ $t('common.fromLastPeriod') }}
        </p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.backOffice.roomRevenue') }}</h3>
        <p class="text-2xl font-bold text-blue-600">${{ summary.roomRevenue.toFixed(2) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ summary.roomRevenuePercentage.toFixed(1) }}% {{ $t('common.ofTotal') }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.backOffice.fbRevenue') }}</h3>
        <p class="text-2xl font-bold text-purple-600">${{ summary.fbRevenue.toFixed(2) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ summary.fbRevenuePercentage.toFixed(1) }}% {{ $t('common.ofTotal') }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.backOffice.otherRevenue') }}</h3>
        <p class="text-2xl font-bold text-orange-600">${{ summary.otherRevenue.toFixed(2) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ summary.otherRevenuePercentage.toFixed(1) }}% {{ $t('common.ofTotal') }}</p>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('reports.backOffice.revenueChart') }}
      </h2>
      <div class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('common.chartPlaceholder') }}</p>
      </div>
    </div>

    <!-- Revenue by Source -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.backOffice.revenueBySource') }}
        </h2>
        <div class="space-y-4">
          <div v-for="source in revenueBySource" :key="source.source" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="source.color" class="w-4 h-4 rounded mr-3"></div>
              <span class="text-gray-700 dark:text-gray-300">{{ $t(`revenue.${source.source}`) }}</span>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-900 dark:text-white">${{ source.amount.toFixed(2) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ source.percentage.toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.backOffice.revenueByRoomType') }}
        </h2>
        <div class="space-y-4">
          <div v-for="roomType in revenueByRoomType" :key="roomType.type" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="roomType.color" class="w-4 h-4 rounded mr-3"></div>
              <span class="text-gray-700 dark:text-gray-300">{{ $t(`rooms.types.${roomType.type}`) }}</span>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-900 dark:text-white">${{ roomType.amount.toFixed(2) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ roomType.percentage.toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Revenue Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('reports.backOffice.detailedRevenue') }}
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
                {{ $t('revenue.rooms') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('revenue.food') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('revenue.beverage') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('revenue.spa') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('revenue.other') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ $t('common.total') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="entry in revenueData" :key="entry.date">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatDate(entry.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.rooms.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.food.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.beverage.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.spa.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${{ entry.other.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                ${{ entry.total.toFixed(2) }}
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

interface RevenueEntry {
  date: string
  rooms: number
  food: number
  beverage: number
  spa: number
  other: number
  total: number
}

interface RevenueSource {
  source: string
  amount: number
  percentage: number
  color: string
  type?:string
}

const filters = ref({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  revenueSource: '',
  groupBy: 'day'
})

const revenueData = ref<RevenueEntry[]>([])
const revenueBySource = ref<RevenueSource[]>([])
const revenueByRoomType = ref<RevenueSource[]>([])

const summary = computed(() => {
  const data = revenueData.value || []
  const totalRevenue = data.reduce((sum, entry) => sum + (entry?.total || 0), 0)
  const roomRevenue = data.reduce((sum, entry) => sum + (entry?.rooms || 0), 0)
  const fbRevenue = data.reduce((sum, entry) => sum + (entry?.food || 0) + (entry?.beverage || 0), 0)
  const otherRevenue = data.reduce((sum, entry) => sum + (entry?.spa || 0) + (entry?.other || 0), 0)
  
  return {
    totalRevenue: totalRevenue || 0,
    roomRevenue: roomRevenue || 0,
    fbRevenue: fbRevenue || 0,
    otherRevenue: otherRevenue || 0,
    roomRevenuePercentage: totalRevenue > 0 ? (roomRevenue / totalRevenue) * 100 : 0,
    fbRevenuePercentage: totalRevenue > 0 ? (fbRevenue / totalRevenue) * 100 : 0,
    otherRevenuePercentage: totalRevenue > 0 ? (otherRevenue / totalRevenue) * 100 : 0,
    revenueGrowth: 12.5 // Mock growth percentage
  }
})

const loadRevenueData = async () => {
  // Mock data for demonstration
  revenueData.value = [
    {
      date: '2024-01-10',
      rooms: 2450.00,
      food: 680.50,
      beverage: 320.75,
      spa: 150.00,
      other: 89.25,
      total: 3690.50
    },
    {
      date: '2024-01-11',
      rooms: 2680.00,
      food: 720.25,
      beverage: 380.50,
      spa: 200.00,
      other: 95.75,
      total: 4076.50
    },
    {
      date: '2024-01-12',
      rooms: 2320.00,
      food: 590.75,
      beverage: 290.25,
      spa: 120.00,
      other: 78.50,
      total: 3399.50
    }
  ]
  
  const data = revenueData.value || []
  const totalRevenue = data.reduce((sum, entry) => sum + (entry?.total || 0), 0)
  
  revenueBySource.value = [
    {
      source: 'rooms',
      amount: data.reduce((sum, entry) => sum + (entry?.rooms || 0), 0),
      percentage: 0,
      color: 'bg-blue-500'
    },
    {
      source: 'food',
      amount: data.reduce((sum, entry) => sum + (entry?.food || 0), 0),
      percentage: 0,
      color: 'bg-green-500'
    },
    {
      source: 'beverage',
      amount: data.reduce((sum, entry) => sum + (entry?.beverage || 0), 0),
      percentage: 0,
      color: 'bg-purple-500'
    },
    {
      source: 'spa',
      amount: data.reduce((sum, entry) => sum + (entry?.spa || 0), 0),
      percentage: 0,
      color: 'bg-pink-500'
    },
    {
      source: 'other',
      amount: data.reduce((sum, entry) => sum + (entry?.other || 0), 0),
      percentage: 0,
      color: 'bg-orange-500'
    }
  ]
  
  // Calculate percentages
  revenueBySource.value.forEach(source => {
    source.percentage = totalRevenue > 0 ? (source.amount / totalRevenue) * 100 : 0
  })
  
  revenueByRoomType.value = [
    { source: 'standard', amount: 4200.00, percentage: 60.0, color: 'bg-blue-400', type: 'standard' },
    { source: 'deluxe', amount: 2100.00, percentage: 30.0, color: 'bg-green-400', type: 'deluxe' },
    { source: 'suite', amount: 700.00, percentage: 10.0, color: 'bg-purple-400', type: 'suite' }
  ]
}

const exportReport = () => {
  console.log('Exporting revenue report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadRevenueData()
})
</script>