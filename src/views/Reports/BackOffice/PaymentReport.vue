<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.paymentReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.paymentReportDescription') }}
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
              {{ $t('common.paymentMethod') }}
            </label>
            <select
              v-model="filters.paymentMethod"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="cash">{{ $t('payments.methods.cash') }}</option>
              <option value="card">{{ $t('payments.methods.card') }}</option>
              <option value="bank-transfer">{{ $t('payments.methods.bankTransfer') }}</option>
              <option value="mobile-payment">{{ $t('payments.methods.mobilePayment') }}</option>
              <option value="check">{{ $t('payments.methods.check') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="completed">{{ $t('payments.status.completed') }}</option>
              <option value="pending">{{ $t('payments.status.pending') }}</option>
              <option value="failed">{{ $t('payments.status.failed') }}</option>
              <option value="refunded">{{ $t('payments.status.refunded') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadPaymentReport"
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalPayments') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalPayments }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalAmount') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.totalAmount.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.pendingPayments') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.pendingAmount.toFixed(2) }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgPaymentValue') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.avgPaymentValue.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.paymentMethodBreakdown') }}
          </h3>
          <div class="space-y-4">
            <div v-for="method in paymentMethodBreakdown" :key="method.method" class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: method.color }"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`payments.methods.${method.method}`) }}</span>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">${{ method.amount.toFixed(2) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ method.percentage.toFixed(1) }}% ({{ method.count }})</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.paymentStatusBreakdown') }}
          </h3>
          <div class="space-y-4">
            <div v-for="status in paymentStatusBreakdown" :key="status.status" class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: status.color }"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`payments.status.${status.status}`) }}</span>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">${{ status.amount.toFixed(2) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ status.percentage.toFixed(1) }}% ({{ status.count }})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Transactions -->
      <ReusableTable
        :title="`${$t('reports.paymentTransactions')} (${filteredPayments.length})`"
        :columns="tableColumns"
        :data="filteredPayments"
        :actions="tableActions"
        :searchable="true"
        :search-placeholder="$t('common.searchPayments')"
        :selectable="false"
        :empty-state-title="$t('common.noDataFound')"
        :empty-state-message="$t('reports.noPaymentsFound')"
      >
        <template #column-amount="{ item }">
          <span class="text-sm text-gray-900 dark:text-white">
            ${{ item.amount.toFixed(2) }}
          </span>
        </template>
      </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Action, Column } from '../../../utils/models'

const { t } = useI18n()
const router = useRouter()

interface Payment {
  id: string
  date: string
  guestName: string
  amount: number
  paymentMethod: string
  status: string
  reference: string
  invoiceId?: string
}

interface BreakdownItem {
  method?: string
  status?: string
  amount: number
  percentage: number
  count: number
  color: string
}

const filters = ref({
  dateFrom: '',
  dateTo: '',
  paymentMethod: '',
  status: ''
})

const payments = ref<Payment[]>([])
const loading = ref(false)

const summary = ref({
  totalPayments: 0,
  totalAmount: 0,
  pendingAmount: 0,
  avgPaymentValue: 0
})

const paymentMethodBreakdown = ref<BreakdownItem[]>([])
const paymentStatusBreakdown = ref<BreakdownItem[]>([])

const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    if (filters.value.paymentMethod && payment.paymentMethod !== filters.value.paymentMethod) {
      return false
    }
    if (filters.value.status && payment.status !== filters.value.status) {
      return false
    }
    return true
  })
})

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'id', label: t('common.paymentId'), type: 'text' },
  { key: 'date', label: t('common.date'), type: 'date' },
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'amount', label: t('common.amount'), type: 'custom' },
  { key: 'paymentMethod', label: t('common.paymentMethod'), type: 'text', translatable: true },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  },
  { key: 'reference', label: t('common.reference'), type: 'text' }
])

const tableActions = computed<Action[]>(() => [
  {
    label: t('common.view'),
    handler: (item: Payment) => viewPayment(item.id),
    variant: 'primary'
  },
  {
    label: t('common.process'),
    handler: (item: Payment) => processPayment(item.id),
    variant: 'success',
    condition: (item: Payment) => item.status === 'pending'
  }
])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    case 'refunded':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  }
}

const loadPaymentReport = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    payments.value = [
      {
        id: 'PAY-2024-001',
        date: '2024-01-15',
        guestName: 'John Doe',
        amount: 275.00,
        paymentMethod: 'card',
        status: 'completed',
        reference: 'TXN123456789',
        invoiceId: 'INV-2024-001'
      },
      {
        id: 'PAY-2024-002',
        date: '2024-01-14',
        guestName: 'Jane Smith',
        amount: 198.00,
        paymentMethod: 'cash',
        status: 'completed',
        reference: 'CASH001',
        invoiceId: 'INV-2024-002'
      },
      {
        id: 'PAY-2024-003',
        date: '2024-01-13',
        guestName: 'Bob Johnson',
        amount: 450.00,
        paymentMethod: 'bank-transfer',
        status: 'pending',
        reference: 'BT789012345',
        invoiceId: 'INV-2024-003'
      }
    ]
    
    // Calculate summary
    const totalAmount = payments.value.reduce((sum, payment) => sum + payment.amount, 0)
    const pendingPayments = payments.value.filter(payment => payment.status === 'pending')
    
    summary.value = {
      totalPayments: payments.value.length,
      totalAmount: totalAmount,
      pendingAmount: pendingPayments.reduce((sum, payment) => sum + payment.amount, 0),
      avgPaymentValue: payments.value.length > 0 ? totalAmount / payments.value.length : 0
    }
    
    // Calculate payment method breakdown
    const methodGroups = payments.value.reduce((acc, payment) => {
      if (!acc[payment.paymentMethod]) {
        acc[payment.paymentMethod] = { amount: 0, count: 0 }
      }
      acc[payment.paymentMethod].amount += payment.amount
      acc[payment.paymentMethod].count += 1
      return acc
    }, {} as Record<string, { amount: number; count: number }>)
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
    paymentMethodBreakdown.value = Object.entries(methodGroups).map(([method, data], index) => ({
      method,
      amount: data.amount,
      percentage: (data.amount / totalAmount) * 100,
      count: data.count,
      color: colors[index % colors.length]
    }))
    
    // Calculate status breakdown
    const statusGroups = payments.value.reduce((acc, payment) => {
      if (!acc[payment.status]) {
        acc[payment.status] = { amount: 0, count: 0 }
      }
      acc[payment.status].amount += payment.amount
      acc[payment.status].count += 1
      return acc
    }, {} as Record<string, { amount: number; count: number }>)
    
    paymentStatusBreakdown.value = Object.entries(statusGroups).map(([status, data], index) => ({
      status,
      amount: data.amount,
      percentage: (data.amount / totalAmount) * 100,
      count: data.count,
      color: colors[index % colors.length]
    }))
  } catch (error) {
    console.error('Error loading payment report:', error)
  } finally {
    loading.value = false
  }
}

const viewPayment = (paymentId: string) => {
  // Navigate to payment details or open modal
  router.push(`/reports/payments/${paymentId}`)
}

const processPayment = async (paymentId: string) => {
  try {
    // Mock API call - replace with actual API call
    const paymentIndex = payments.value.findIndex(payment => payment.id === paymentId)
    if (paymentIndex !== -1) {
      payments.value[paymentIndex].status = 'completed'
    }
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}

const handleTableAction = (action: Action, item: Payment) => {
  if (action.handler) {
    action.handler(item)
  }
}

onMounted(() => {
  loadPaymentReport()
})
</script>