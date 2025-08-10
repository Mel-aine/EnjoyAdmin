<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.cashierReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.cashierReportDescription') }}
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
              {{ $t('common.cashier') }}
            </label>
            <select
              v-model="filters.cashierId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option v-for="cashier in cashiers" :key="cashier.id" :value="cashier.id">
                {{ cashier.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.shift') }}
            </label>
            <select
              v-model="filters.shift"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="morning">{{ $t('shifts.morning') }}</option>
              <option value="afternoon">{{ $t('shifts.afternoon') }}</option>
              <option value="evening">{{ $t('shifts.evening') }}</option>
              <option value="night">{{ $t('shifts.night') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadCashierReport"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {{ $t('common.generateReport') }}
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalTransactions') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalTransactions }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalCashHandled') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.totalCashHandled.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.cardPayments') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.cardPayments.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgTransactionValue') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.avgTransactionValue.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cashier Performance -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.cashierPerformance') }}
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.cashier') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.shift') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.transactions') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.cashHandled') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.cardPayments') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.discrepancies') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="performance in filteredPerformance" :key="performance.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ performance.cashierName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ $t(`shifts.${performance.shift}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ performance.transactionCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ performance.cashHandled.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ performance.cardPayments.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="performance.discrepancies > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="text-sm font-medium">
                    ${{ performance.discrepancies.toFixed(2) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewCashierDetails(performance.cashierId)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {{ $t('common.viewDetails') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.recentTransactions') }} ({{ filteredTransactions.length }})
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.transactionId') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.time') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.cashier') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.type') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.amount') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.paymentMethod') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="transaction in filteredTransactions.slice(0, 20)" :key="transaction.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ transaction.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDateTime(transaction.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ transaction.cashierName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ $t(`transactions.${transaction.type}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ transaction.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ $t(`payments.methods.${transaction.paymentMethod}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewTransaction(transaction.id)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {{ $t('common.view') }}
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

interface Cashier {
  id: string
  name: string
}

interface CashierPerformance {
  id: string
  cashierId: string
  cashierName: string
  shift: string
  transactionCount: number
  cashHandled: number
  cardPayments: number
  discrepancies: number
}

interface Transaction {
  id: string
  timestamp: string
  cashierId: string
  cashierName: string
  type: string
  amount: number
  paymentMethod: string
}

const filters = ref({
  dateFrom: '',
  dateTo: '',
  cashierId: '',
  shift: ''
})

const cashiers = ref<Cashier[]>([])
const performance = ref<CashierPerformance[]>([])
const transactions = ref<Transaction[]>([])
const loading = ref(false)

const summary = ref({
  totalTransactions: 0,
  totalCashHandled: 0,
  cardPayments: 0,
  avgTransactionValue: 0
})

const filteredPerformance = computed(() => {
  return performance.value.filter(perf => {
    if (filters.value.cashierId && perf.cashierId !== filters.value.cashierId) {
      return false
    }
    if (filters.value.shift && perf.shift !== filters.value.shift) {
      return false
    }
    return true
  })
})

const filteredTransactions = computed(() => {
  return transactions.value.filter(transaction => {
    if (filters.value.cashierId && transaction.cashierId !== filters.value.cashierId) {
      return false
    }
    return true
  })
})

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const loadCashierReport = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API calls
    cashiers.value = [
      { id: '1', name: 'Alice Johnson' },
      { id: '2', name: 'Bob Smith' },
      { id: '3', name: 'Carol Davis' }
    ]
    
    performance.value = [
      {
        id: '1',
        cashierId: '1',
        cashierName: 'Alice Johnson',
        shift: 'morning',
        transactionCount: 45,
        cashHandled: 1250.00,
        cardPayments: 2100.00,
        discrepancies: 0.00
      },
      {
        id: '2',
        cashierId: '2',
        cashierName: 'Bob Smith',
        shift: 'afternoon',
        transactionCount: 38,
        cashHandled: 980.00,
        cardPayments: 1850.00,
        discrepancies: -5.50
      }
    ]
    
    transactions.value = [
      {
        id: 'TXN-001',
        timestamp: '2024-01-15T14:30:00',
        cashierId: '1',
        cashierName: 'Alice Johnson',
        type: 'payment',
        amount: 125.50,
        paymentMethod: 'card'
      },
      {
        id: 'TXN-002',
        timestamp: '2024-01-15T14:25:00',
        cashierId: '1',
        cashierName: 'Alice Johnson',
        type: 'refund',
        amount: 45.00,
        paymentMethod: 'cash'
      }
    ]
    
    // Calculate summary
    const totalAmount = transactions.value.reduce((sum, txn) => sum + txn.amount, 0)
    summary.value = {
      totalTransactions: transactions.value.length,
      totalCashHandled: transactions.value.filter(txn => txn.paymentMethod === 'cash').reduce((sum, txn) => sum + txn.amount, 0),
      cardPayments: transactions.value.filter(txn => txn.paymentMethod === 'card').reduce((sum, txn) => sum + txn.amount, 0),
      avgTransactionValue: transactions.value.length > 0 ? totalAmount / transactions.value.length : 0
    }
  } catch (error) {
    console.error('Error loading cashier report:', error)
  } finally {
    loading.value = false
  }
}

const viewCashierDetails = (cashierId: string) => {
  router.push(`/cashier/${cashierId}/details`)
}

const viewTransaction = (transactionId: string) => {
  router.push(`/transaction/${transactionId}`)
}

onMounted(() => {
  loadCashierReport()
})
</script>