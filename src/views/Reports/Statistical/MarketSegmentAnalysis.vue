<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.statistical.marketSegmentAnalysis') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.statistical.marketSegmentAnalysisDescription') }}
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
              {{ $t('common.segment') }}
            </label>
            <select
              v-model="filters.segment"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="corporate">{{ $t('common.corporate') }}</option>
              <option value="leisure">{{ $t('common.leisure') }}</option>
              <option value="group">{{ $t('common.group') }}</option>
              <option value="government">{{ $t('common.government') }}</option>
              <option value="online">{{ $t('common.online') }}</option>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalSegments') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalSegments }}</p>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.topSegment') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t(`common.${summary.topSegment}`) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgADR') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.avgADR.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.segmentRevenue') }}
          </h3>
          <div class="space-y-4">
            <div v-for="segment in segmentRevenue" :key="segment.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: segment.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${segment.name}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ segment.revenue.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ segment.percentage.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.segmentBookings') }}
          </h3>
          <div class="space-y-4">
            <div v-for="segment in segmentBookings" :key="segment.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: segment.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${segment.name}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ segment.bookings }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ segment.percentage.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.segmentPerformance') }}
          </h3>
          <div class="space-y-3">
            <div v-for="metric in performanceMetrics" :key="metric.segment" class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`common.${metric.segment}`) }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ metric.adr.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.seasonalTrends') }}
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.peakSeason') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ seasonalTrends.peakSeason }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.lowSeason') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ seasonalTrends.lowSeason }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.growthRate') }}</span>
              <span class="text-sm font-medium" :class="seasonalTrends.growthRate >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ seasonalTrends.growthRate >= 0 ? '+' : '' }}{{ seasonalTrends.growthRate.toFixed(1) }}%
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.volatility') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ seasonalTrends.volatility.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.customerInsights') }}
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.avgStayLength') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ customerInsights.avgStayLength.toFixed(1) }} {{ $t('common.nights') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.repeatCustomers') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ customerInsights.repeatCustomers.toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.avgBookingValue') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ customerInsights.avgBookingValue.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('reports.cancellationRate') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ customerInsights.cancellationRate.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Segment Analysis Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.segmentAnalysisDetails') }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.segment') }}
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
                  {{ $t('common.revpar') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.marketShare') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.avgStayLength') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.cancellationRate') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="segment in filteredSegmentData" :key="segment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: segment.color }"></div>
                    {{ $t(`common.${segment.name}`) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ segment.bookings }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ segment.revenue.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ segment.adr.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ segment.revpar.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ segment.marketShare.toFixed(1) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ segment.avgStayLength.toFixed(1) }} {{ $t('common.nights') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ segment.cancellationRate.toFixed(1) }}%
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
  segment: '',
  period: 'monthly'
})

// Mock data
const segmentData = ref([
  {
    id: 1,
    name: 'corporate',
    bookings: 245,
    revenue: 73500,
    adr: 300.00,
    revpar: 180.00,
    marketShare: 35.2,
    avgStayLength: 2.1,
    cancellationRate: 8.5,
    color: '#3B82F6'
  },
  {
    id: 2,
    name: 'leisure',
    bookings: 189,
    revenue: 47250,
    adr: 250.00,
    revpar: 150.00,
    marketShare: 27.1,
    avgStayLength: 3.2,
    cancellationRate: 12.3,
    color: '#10B981'
  },
  {
    id: 3,
    name: 'group',
    bookings: 156,
    revenue: 39000,
    adr: 250.00,
    revpar: 120.00,
    marketShare: 22.4,
    avgStayLength: 2.8,
    cancellationRate: 6.7,
    color: '#8B5CF6'
  },
  {
    id: 4,
    name: 'online',
    bookings: 98,
    revenue: 19600,
    adr: 200.00,
    revpar: 95.00,
    marketShare: 14.1,
    avgStayLength: 2.5,
    cancellationRate: 15.2,
    color: '#F59E0B'
  },
  {
    id: 5,
    name: 'government',
    bookings: 12,
    revenue: 2400,
    adr: 200.00,
    revpar: 48.00,
    marketShare: 1.2,
    avgStayLength: 1.8,
    cancellationRate: 3.1,
    color: '#EF4444'
  }
])

// Computed properties
const filteredSegmentData = computed(() => {
  return segmentData.value.filter(segment => {
    const matchesSegment = !filters.value.segment || segment.name === filters.value.segment
    return matchesSegment
  })
})

const summary = computed(() => {
  const filtered = filteredSegmentData.value
  const totalRevenue = filtered.reduce((sum, s) => sum + s.revenue, 0)
  const totalBookings = filtered.reduce((sum, s) => sum + s.bookings, 0)
  const avgADR = totalBookings > 0 ? totalRevenue / totalBookings : 0
  
  // Find top segment by revenue
  const topSegment = filtered.reduce((max, segment) => 
    segment.revenue > max.revenue ? segment : max, filtered[0] || { revenue: 0, name: '' }
  )
  
  return {
    totalSegments: filtered.length,
    totalRevenue,
    topSegment: topSegment.name,
    avgADR
  }
})

const segmentRevenue = computed(() => {
  const total = filteredSegmentData.value.reduce((sum, s) => sum + s.revenue, 0)
  return filteredSegmentData.value.map(segment => ({
    ...segment,
    percentage: total > 0 ? (segment.revenue / total) * 100 : 0
  })).sort((a, b) => b.revenue - a.revenue)
})

const segmentBookings = computed(() => {
  const total = filteredSegmentData.value.reduce((sum, s) => sum + s.bookings, 0)
  return filteredSegmentData.value.map(segment => ({
    ...segment,
    percentage: total > 0 ? (segment.bookings / total) * 100 : 0
  })).sort((a, b) => b.bookings - a.bookings)
})

const performanceMetrics = computed(() => {
  return filteredSegmentData.value.map(segment => ({
    segment: segment.name,
    adr: segment.adr
  })).sort((a, b) => b.adr - a.adr)
})

const seasonalTrends = ref({
  peakSeason: 'Summer',
  lowSeason: 'Winter',
  growthRate: 12.5,
  volatility: 18.3
})

const customerInsights = computed(() => {
  const filtered = filteredSegmentData.value
  const totalBookings = filtered.reduce((sum, s) => sum + s.bookings, 0)
  const totalRevenue = filtered.reduce((sum, s) => sum + s.revenue, 0)
  const weightedStayLength = filtered.reduce((sum, s) => sum + (s.avgStayLength * s.bookings), 0)
  const weightedCancellationRate = filtered.reduce((sum, s) => sum + (s.cancellationRate * s.bookings), 0)
  
  return {
    avgStayLength: totalBookings > 0 ? weightedStayLength / totalBookings : 0,
    repeatCustomers: 23.5, // Mock data
    avgBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
    cancellationRate: totalBookings > 0 ? weightedCancellationRate / totalBookings : 0
  }
})
</script>