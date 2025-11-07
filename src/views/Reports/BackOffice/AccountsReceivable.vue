<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.accountsReceivable') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.accountsReceivableDescription') }}
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
              {{ $t('common.status') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="current">{{ $t('common.current') }}</option>
              <option value="overdue">{{ $t('common.overdue') }}</option>
              <option value="paid">{{ $t('common.paid') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.agingPeriod') }}
            </label>
            <select
              v-model="filters.agingPeriod"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="0-30">0-30 {{ $t('common.days') }}</option>
              <option value="31-60">31-60 {{ $t('common.days') }}</option>
              <option value="61-90">61-90 {{ $t('common.days') }}</option>
              <option value="90+">90+ {{ $t('common.days') }}</option>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalReceivables') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.totalReceivables.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.currentReceivables') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.currentReceivables.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.overdueReceivables') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.overdueReceivables.toLocaleString() }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.averageDaysOutstanding') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.averageDaysOutstanding }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Aging Analysis -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.agingAnalysis') }}
          </h3>
          <div class="space-y-4">
            <div v-for="aging in agingAnalysis" :key="aging.period" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: aging.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ aging.period }} {{ $t('common.days') }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ aging.amount.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ aging.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.topCustomers') }}
          </h3>
          <div class="space-y-3">
            <div v-for="customer in topCustomers" :key="customer.name" class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ customer.name }}</span>
              <div class="flex items-center">
                <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div class="bg-blue-600 h-2 rounded-full" :style="{ width: customer.percentage + '%' }"></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">${{ customer.amount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Receivables Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.receivablesList') }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.invoiceNumber') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.customer') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.invoiceDate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.dueDate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.amount') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.daysOutstanding') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="receivable in filteredReceivables" :key="receivable.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ receivable.invoiceNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ receivable.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(receivable.invoiceDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(receivable.dueDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ receivable.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ receivable.daysOutstanding }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(receivable.status)">
                    {{ $t(`common.${receivable.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <button
                    @click="viewInvoice(receivable)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    {{ $t('common.view') }}
                  </button>
                  <button
                    v-if="receivable.status !== 'paid'"
                    @click="sendReminder(receivable)"
                    class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    {{ $t('common.remind') }}
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))

const { t } = useI18n()

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  status: '',
  agingPeriod: ''
})

// Mock data
const receivables = ref([
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    customer: 'ABC Corporation',
    invoiceDate: '2024-01-01',
    dueDate: '2024-01-31',
    amount: 5500.00,
    daysOutstanding: 15,
    status: 'current'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    customer: 'XYZ Ltd',
    invoiceDate: '2023-12-15',
    dueDate: '2024-01-14',
    amount: 3200.00,
    daysOutstanding: 32,
    status: 'overdue'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    customer: 'Tech Solutions Inc',
    invoiceDate: '2023-11-20',
    dueDate: '2023-12-20',
    amount: 8750.00,
    daysOutstanding: 67,
    status: 'overdue'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-004',
    customer: 'Global Enterprises',
    invoiceDate: '2024-01-10',
    dueDate: '2024-02-09',
    amount: 4200.00,
    daysOutstanding: 6,
    status: 'current'
  },
  {
    id: 5,
    invoiceNumber: 'INV-2024-005',
    customer: 'StartUp Co',
    invoiceDate: '2023-10-15',
    dueDate: '2023-11-14',
    amount: 2100.00,
    daysOutstanding: 93,
    status: 'overdue'
  }
])

// Computed properties
const filteredReceivables = computed(() => {
  return receivables.value.filter(receivable => {
    const matchesDateFrom = !filters.value.dateFrom || receivable.invoiceDate >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || receivable.invoiceDate <= filters.value.dateTo
    const matchesStatus = !filters.value.status || receivable.status === filters.value.status
    const matchesAging = !filters.value.agingPeriod || checkAgingPeriod(receivable.daysOutstanding, filters.value.agingPeriod)
    
    return matchesDateFrom && matchesDateTo && matchesStatus && matchesAging
  })
})

const summary = computed(() => {
  const filtered = filteredReceivables.value
  const total = filtered.reduce((sum, r) => sum + r.amount, 0)
  const current = filtered.filter(r => r.status === 'current').reduce((sum, r) => sum + r.amount, 0)
  const overdue = filtered.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.amount, 0)
  const avgDays = filtered.length > 0 ? Math.round(filtered.reduce((sum, r) => sum + r.daysOutstanding, 0) / filtered.length) : 0
  
  return {
    totalReceivables: total,
    currentReceivables: current,
    overdueReceivables: overdue,
    averageDaysOutstanding: avgDays
  }
})

const agingAnalysis = computed(() => {
  const periods = [
    { period: '0-30', color: '#10B981' },
    { period: '31-60', color: '#F59E0B' },
    { period: '61-90', color: '#EF4444' },
    { period: '90+', color: '#7C2D12' }
  ]
  const total = summary.value.totalReceivables
  
  return periods.map(period => {
    const amount = filteredReceivables.value
      .filter(r => checkAgingPeriod(r.daysOutstanding, period.period))
      .reduce((sum, r) => sum + r.amount, 0)
    return {
      ...period,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }
  })
})

const topCustomers = computed(() => {
  const customerTotals = new Map()
  filteredReceivables.value.forEach(r => {
    const current = customerTotals.get(r.customer) || 0
    customerTotals.set(r.customer, current + r.amount)
  })
  
  const sorted = Array.from(customerTotals.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
  
  const maxAmount = sorted[0]?.amount || 1
  return sorted.map(customer => ({
    ...customer,
    percentage: (customer.amount / maxAmount) * 100
  }))
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const checkAgingPeriod = (days: number, period: string) => {
  switch (period) {
    case '0-30':
      return days >= 0 && days <= 30
    case '31-60':
      return days >= 31 && days <= 60
    case '61-90':
      return days >= 61 && days <= 90
    case '90+':
      return days > 90
    default:
      return true
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'current':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'paid':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const viewInvoice = (receivable: any) => {
  console.log('Viewing invoice:', receivable)
}

const sendReminder = (receivable: any) => {
  console.log('Sending reminder for:', receivable)
}
</script>