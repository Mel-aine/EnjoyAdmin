<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.accountsPayable') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.accountsPayableDescription') }}
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
              <option value="pending">{{ $t('common.pending') }}</option>
              <option value="overdue">{{ $t('common.overdue') }}</option>
              <option value="paid">{{ $t('common.paid') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.supplier') }}
            </label>
            <select
              v-model="filters.supplier"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option v-for="supplier in uniqueSuppliers" :key="supplier" :value="supplier">
                {{ supplier }}
              </option>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalPayables') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.totalPayables.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.pendingPayables') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.pendingPayables.toLocaleString() }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.overduePayables') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.overduePayables.toLocaleString() }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.paidThisMonth') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ summary.paidThisMonth.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.payablesByStatus') }}
          </h3>
          <div class="space-y-4">
            <div v-for="status in statusBreakdown" :key="status.status" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: status.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${status.status}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">${{ status.amount.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ status.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.topSuppliers') }}
          </h3>
          <div class="space-y-3">
            <div v-for="supplier in topSuppliers" :key="supplier.name" class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ supplier.name }}</span>
              <div class="flex items-center">
                <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div class="bg-blue-600 h-2 rounded-full" :style="{ width: supplier.percentage + '%' }"></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">${{ supplier.amount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payables Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.payablesList') }}
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
                  {{ $t('common.supplier') }}
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
                  {{ $t('common.category') }}
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
              <tr v-for="payable in filteredPayables" :key="payable.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ payable.invoiceNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ payable.supplier }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(payable.invoiceDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(payable.dueDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ payable.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ payable.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(payable.status)">
                    {{ $t(`common.${payable.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <button
                    @click="viewInvoice(payable)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    {{ $t('common.view') }}
                  </button>
                  <button
                    v-if="payable.status === 'pending'"
                    @click="markAsPaid(payable)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    {{ $t('common.markPaid') }}
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  status: '',
  supplier: ''
})

// Mock data
const payables = ref([
  {
    id: 1,
    invoiceNumber: 'BILL-2024-001',
    supplier: 'Office Supplies Co',
    invoiceDate: '2024-01-05',
    dueDate: '2024-02-04',
    amount: 1250.00,
    category: 'Office Supplies',
    status: 'pending'
  },
  {
    id: 2,
    invoiceNumber: 'BILL-2024-002',
    supplier: 'Utilities Corp',
    invoiceDate: '2024-01-01',
    dueDate: '2024-01-31',
    amount: 850.00,
    category: 'Utilities',
    status: 'overdue'
  },
  {
    id: 3,
    invoiceNumber: 'BILL-2024-003',
    supplier: 'Cleaning Services Ltd',
    invoiceDate: '2024-01-10',
    dueDate: '2024-02-09',
    amount: 2100.00,
    category: 'Services',
    status: 'pending'
  },
  {
    id: 4,
    invoiceNumber: 'BILL-2024-004',
    supplier: 'Food Distributor Inc',
    invoiceDate: '2023-12-20',
    dueDate: '2024-01-19',
    amount: 3500.00,
    category: 'Food & Beverage',
    status: 'paid'
  },
  {
    id: 5,
    invoiceNumber: 'BILL-2024-005',
    supplier: 'Maintenance Co',
    invoiceDate: '2024-01-15',
    dueDate: '2024-02-14',
    amount: 750.00,
    category: 'Maintenance',
    status: 'pending'
  },
  {
    id: 6,
    invoiceNumber: 'BILL-2024-006',
    supplier: 'IT Solutions',
    invoiceDate: '2023-12-15',
    dueDate: '2024-01-14',
    amount: 4200.00,
    category: 'Technology',
    status: 'overdue'
  }
])

// Computed properties
const filteredPayables = computed(() => {
  return payables.value.filter(payable => {
    const matchesDateFrom = !filters.value.dateFrom || payable.invoiceDate >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || payable.invoiceDate <= filters.value.dateTo
    const matchesStatus = !filters.value.status || payable.status === filters.value.status
    const matchesSupplier = !filters.value.supplier || payable.supplier === filters.value.supplier
    
    return matchesDateFrom && matchesDateTo && matchesStatus && matchesSupplier
  })
})

const uniqueSuppliers = computed(() => {
  return [...new Set(payables.value.map(p => p.supplier))].sort()
})

const summary = computed(() => {
  const filtered = filteredPayables.value
  const total = filtered.reduce((sum, p) => sum + p.amount, 0)
  const pending = filtered.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const overdue = filtered.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const paidThisMonth = payables.value
    .filter(p => {
      const payDate = new Date(p.invoiceDate)
      return p.status === 'paid' && payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear
    })
    .reduce((sum, p) => sum + p.amount, 0)
  
  return {
    totalPayables: total,
    pendingPayables: pending,
    overduePayables: overdue,
    paidThisMonth
  }
})

const statusBreakdown = computed(() => {
  const statuses = [
    { status: 'pending', color: '#F59E0B' },
    { status: 'overdue', color: '#EF4444' },
    { status: 'paid', color: '#10B981' }
  ]
  const total = summary.value.totalPayables
  
  return statuses.map(status => {
    const amount = filteredPayables.value
      .filter(p => p.status === status.status)
      .reduce((sum, p) => sum + p.amount, 0)
    return {
      ...status,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }
  })
})

const topSuppliers = computed(() => {
  const supplierTotals = new Map()
  filteredPayables.value.forEach(p => {
    const current = supplierTotals.get(p.supplier) || 0
    supplierTotals.set(p.supplier, current + p.amount)
  })
  
  const sorted = Array.from(supplierTotals.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
  
  const maxAmount = sorted[0]?.amount || 1
  return sorted.map(supplier => ({
    ...supplier,
    percentage: (supplier.amount / maxAmount) * 100
  }))
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const viewInvoice = (payable: any) => {
  console.log('Viewing invoice:', payable)
}

const markAsPaid = (payable: any) => {
  payable.status = 'paid'
  console.log('Marked as paid:', payable)
}
</script>