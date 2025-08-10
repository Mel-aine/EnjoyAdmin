<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.financialSummary') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.financialSummaryDescription') }}
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
              {{ $t('common.reportType') }}
            </label>
            <select
              v-model="filters.reportType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="daily">{{ $t('reports.daily') }}</option>
              <option value="weekly">{{ $t('reports.weekly') }}</option>
              <option value="monthly">{{ $t('reports.monthly') }}</option>
              <option value="yearly">{{ $t('reports.yearly') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadFinancialSummary"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {{ $t('common.generateReport') }}
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalRevenue') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.totalRevenue.toFixed(2) }}</p>
              <p class="text-xs text-green-600 dark:text-green-400">+{{ summary.revenueGrowth.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalExpenses') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.totalExpenses.toFixed(2) }}</p>
              <p class="text-xs text-red-600 dark:text-red-400">+{{ summary.expenseGrowth.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.netProfit') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.netProfit.toFixed(2) }}</p>
              <p class="text-xs" :class="summary.profitGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ summary.profitGrowth >= 0 ? '+' : '' }}{{ summary.profitGrowth.toFixed(1) }}%
              </p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.profitMargin') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.profitMargin.toFixed(1) }}%</p>
              <p class="text-xs" :class="summary.marginChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ summary.marginChange >= 0 ? '+' : '' }}{{ summary.marginChange.toFixed(1) }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.revenueBreakdown') }}
          </h3>
          <div class="space-y-4">
            <div v-for="item in revenueBreakdown" :key="item.category" class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: item.color }"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`revenue.${item.category}`) }}</span>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">${{ item.amount.toFixed(2) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.percentage.toFixed(1) }}%</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.expenseBreakdown') }}
          </h3>
          <div class="space-y-4">
            <div v-for="item in expenseBreakdown" :key="item.category" class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: item.color }"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`expenses.${item.category}`) }}</span>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">${{ item.amount.toFixed(2) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.percentage.toFixed(1) }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trends -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.monthlyTrends') }}
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.month') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.revenue') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.expenses') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.profit') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.margin') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('reports.growth') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="trend in monthlyTrends" :key="trend.month">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ trend.month }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ trend.revenue.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ trend.expenses.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ trend.profit.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ trend.margin.toFixed(1) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="trend.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ trend.growth >= 0 ? '+' : '' }}{{ trend.growth.toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Key Performance Indicators -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.keyPerformanceIndicators') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {{ kpis.averageDailyRevenue.toFixed(0) }}
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('reports.avgDailyRevenue') }}</p>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">
              {{ kpis.revenuePerRoom.toFixed(0) }}
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('reports.revenuePerRoom') }}</p>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {{ kpis.operatingEfficiency.toFixed(1) }}%
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('reports.operatingEfficiency') }}</p>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface BreakdownItem {
  category: string
  amount: number
  percentage: number
  color: string
}

interface MonthlyTrend {
  month: string
  revenue: number
  expenses: number
  profit: number
  margin: number
  growth: number
}

const filters = ref({
  dateFrom: '',
  dateTo: '',
  reportType: 'monthly'
})

const loading = ref(false)

const summary = ref({
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  profitMargin: 0,
  revenueGrowth: 0,
  expenseGrowth: 0,
  profitGrowth: 0,
  marginChange: 0
})

const revenueBreakdown = ref<BreakdownItem[]>([])
const expenseBreakdown = ref<BreakdownItem[]>([])
const monthlyTrends = ref<MonthlyTrend[]>([])

const kpis = ref({
  averageDailyRevenue: 0,
  revenuePerRoom: 0,
  operatingEfficiency: 0
})

const loadFinancialSummary = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    summary.value = {
      totalRevenue: 125000.00,
      totalExpenses: 85000.00,
      netProfit: 40000.00,
      profitMargin: 32.0,
      revenueGrowth: 8.5,
      expenseGrowth: 5.2,
      profitGrowth: 15.3,
      marginChange: 2.1
    }
    
    revenueBreakdown.value = [
      { category: 'rooms', amount: 75000, percentage: 60.0, color: '#3B82F6' },
      { category: 'food', amount: 30000, percentage: 24.0, color: '#10B981' },
      { category: 'services', amount: 15000, percentage: 12.0, color: '#F59E0B' },
      { category: 'other', amount: 5000, percentage: 4.0, color: '#8B5CF6' }
    ]
    
    expenseBreakdown.value = [
      { category: 'staff', amount: 35000, percentage: 41.2, color: '#EF4444' },
      { category: 'utilities', amount: 20000, percentage: 23.5, color: '#F97316' },
      { category: 'maintenance', amount: 15000, percentage: 17.6, color: '#84CC16' },
      { category: 'supplies', amount: 10000, percentage: 11.8, color: '#06B6D4' },
      { category: 'other', amount: 5000, percentage: 5.9, color: '#8B5CF6' }
    ]
    
    monthlyTrends.value = [
      { month: 'Jan 2024', revenue: 120000, expenses: 80000, profit: 40000, margin: 33.3, growth: 8.5 },
      { month: 'Feb 2024', revenue: 115000, expenses: 82000, profit: 33000, margin: 28.7, growth: 5.2 },
      { month: 'Mar 2024', revenue: 130000, expenses: 85000, profit: 45000, margin: 34.6, growth: 12.1 },
      { month: 'Apr 2024', revenue: 125000, expenses: 83000, profit: 42000, margin: 33.6, growth: 9.8 }
    ]
    
    kpis.value = {
      averageDailyRevenue: 4167,
      revenuePerRoom: 2500,
      operatingEfficiency: 85.5
    }
  } catch (error) {
    console.error('Error loading financial summary:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFinancialSummary()
})
</script>