<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.statistical.sourceOfBusinessReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.statistical.sourceOfBusinessReportDescription') }}
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
              {{ $t('common.source') }}
            </label>
            <select
              v-model="filters.source"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="direct">{{ $t('common.direct') }}</option>
              <option value="ota">{{ $t('common.ota') }}</option>
              <option value="gds">{{ $t('common.gds') }}</option>
              <option value="corporate">{{ $t('common.corporate') }}</option>
              <option value="travelAgent">{{ $t('common.travelAgent') }}</option>
              <option value="referral">{{ $t('common.referral') }}</option>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalSources') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalSources }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalRevenue') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.totalRevenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.topSource') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t(`common.${summary.topSource}`) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalBookings') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalBookings }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.revenueBySource') }}
          </h3>
          <div class="space-y-4">
            <div v-for="source in revenueBySource" :key="source.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: source.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${source.name}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ source.revenue.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ source.percentage.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.bookingsBySource') }}
          </h3>
          <div class="space-y-4">
            <div v-for="source in bookingsBySource" :key="source.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: source.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${source.name}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ source.bookings }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ source.percentage.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.sourcePerformance') }}
          </h3>
          <div class="space-y-3">
            <div v-for="metric in performanceMetrics" :key="metric.source" class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`common.${metric.source}`) }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ metric.adr.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.conversionRates') }}
          </h3>
          <div class="space-y-3">
            <div v-for="conversion in conversionRates" :key="conversion.source" class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`common.${conversion.source}`) }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ conversion.rate.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.costAnalysis') }}
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.totalCommissions') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ costAnalysis.totalCommissions.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.avgCommissionRate') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ costAnalysis.avgCommissionRate.toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.netRevenue') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ costAnalysis.netRevenue.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.profitMargin') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ costAnalysis.profitMargin.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Channel Performance -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.topPerformingChannels') }}
          </h3>
          <div class="space-y-4">
            <div v-for="(channel, index) in topChannels" :key="channel.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                  <span class="text-sm font-bold text-gray-600 dark:text-gray-300">{{ index + 1 }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${channel.name}`) }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ channel.bookings }} {{ $t('common.bookings') }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ channel.revenue.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${{ channel.adr.toFixed(2) }} {{ $t('common.adr') }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.channelTrends') }}
          </h3>
          <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <!-- Chart placeholder -->
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p>{{ $t('common.chartPlaceholder') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Source Details Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.sourceDetails') }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.source') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.bookings') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.revenue') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.adr') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.marketShare') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.conversionRate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.commissionRate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.netRevenue') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="source in filteredSourceData" :key="source.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: source.color }"></div>
                    {{ $t(`common.${source.name}`) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ source.bookings }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ source.revenue.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ source.adr.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ source.marketShare.toFixed(1) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ source.conversionRate.toFixed(1) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ source.commissionRate.toFixed(1) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ source.netRevenue.toLocaleString() }}
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
  source: '',
  period: 'monthly'
})

// Mock data
const sourceData = ref([
  {
    id: 1,
    name: 'direct',
    bookings: 285,
    revenue: 85500,
    adr: 300.00,
    marketShare: 38.5,
    conversionRate: 12.5,
    commissionRate: 0.0,
    netRevenue: 85500,
    color: '#3B82F6'
  },
  {
    id: 2,
    name: 'ota',
    bookings: 198,
    revenue: 49500,
    adr: 250.00,
    marketShare: 26.8,
    conversionRate: 8.3,
    commissionRate: 15.0,
    netRevenue: 42075,
    color: '#10B981'
  },
  {
    id: 3,
    name: 'corporate',
    bookings: 156,
    revenue: 46800,
    adr: 300.00,
    marketShare: 21.1,
    conversionRate: 18.7,
    commissionRate: 5.0,
    netRevenue: 44460,
    color: '#8B5CF6'
  },
  {
    id: 4,
    name: 'travelAgent',
    bookings: 78,
    revenue: 19500,
    adr: 250.00,
    marketShare: 10.6,
    conversionRate: 15.2,
    commissionRate: 10.0,
    netRevenue: 17550,
    color: '#F59E0B'
  },
  {
    id: 5,
    name: 'gds',
    bookings: 22,
    revenue: 6600,
    adr: 300.00,
    marketShare: 3.0,
    conversionRate: 22.1,
    commissionRate: 12.0,
    netRevenue: 5808,
    color: '#EF4444'
  }
])

// Computed properties
const filteredSourceData = computed(() => {
  return sourceData.value.filter(source => {
    const matchesSource = !filters.value.source || source.name === filters.value.source
    return matchesSource
  })
})

const summary = computed(() => {
  const filtered = filteredSourceData.value
  const totalRevenue = filtered.reduce((sum, s) => sum + s.revenue, 0)
  const totalBookings = filtered.reduce((sum, s) => sum + s.bookings, 0)
  
  // Find top source by revenue
  const topSource = filtered.reduce((max, source) => 
    source.revenue > max.revenue ? source : max, filtered[0] || { revenue: 0, name: '' }
  )
  
  return {
    totalSources: filtered.length,
    totalRevenue,
    topSource: topSource.name,
    totalBookings
  }
})

const revenueBySource = computed(() => {
  const total = filteredSourceData.value.reduce((sum, s) => sum + s.revenue, 0)
  return filteredSourceData.value.map(source => ({
    ...source,
    percentage: total > 0 ? (source.revenue / total) * 100 : 0
  })).sort((a, b) => b.revenue - a.revenue)
})

const bookingsBySource = computed(() => {
  const total = filteredSourceData.value.reduce((sum, s) => sum + s.bookings, 0)
  return filteredSourceData.value.map(source => ({
    ...source,
    percentage: total > 0 ? (source.bookings / total) * 100 : 0
  })).sort((a, b) => b.bookings - a.bookings)
})

const performanceMetrics = computed(() => {
  return filteredSourceData.value.map(source => ({
    source: source.name,
    adr: source.adr
  })).sort((a, b) => b.adr - a.adr)
})

const conversionRates = computed(() => {
  return filteredSourceData.value.map(source => ({
    source: source.name,
    rate: source.conversionRate
  })).sort((a, b) => b.rate - a.rate)
})

const costAnalysis = computed(() => {
  const filtered = filteredSourceData.value
  const totalRevenue = filtered.reduce((sum, s) => sum + s.revenue, 0)
  const totalCommissions = filtered.reduce((sum, s) => sum + (s.revenue * s.commissionRate / 100), 0)
  const netRevenue = filtered.reduce((sum, s) => sum + s.netRevenue, 0)
  const totalBookings = filtered.reduce((sum, s) => sum + s.bookings, 0)
  
  const avgCommissionRate = totalBookings > 0 ? 
    filtered.reduce((sum, s) => sum + (s.commissionRate * s.bookings), 0) / totalBookings : 0
  
  return {
    totalCommissions,
    avgCommissionRate,
    netRevenue,
    profitMargin: totalRevenue > 0 ? (netRevenue / totalRevenue) * 100 : 0
  }
})

const topChannels = computed(() => {
  return filteredSourceData.value
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
})
</script>