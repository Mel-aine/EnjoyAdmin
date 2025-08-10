<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.frontOffice.nightAudit') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.frontOffice.nightAuditDescription') }}
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
            {{ $t('common.auditDate') }}
          </label>
          <input
            v-model="filters.auditDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.shift') }}
          </label>
          <select
            v-model="filters.shift"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="night">{{ $t('common.nightShift') }}</option>
            <option value="day">{{ $t('common.dayShift') }}</option>
            <option value="evening">{{ $t('common.eveningShift') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.auditor') }}
          </label>
          <select
            v-model="filters.auditor"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="john_doe">John Doe</option>
            <option value="jane_smith">Jane Smith</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadNightAudit"
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
        <button
          @click="runAudit"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          {{ $t('reports.frontOffice.runAudit') }}
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.totalRevenue') }}</h3>
        <p class="text-2xl font-bold text-green-600">${{ summary.totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.roomRevenue') }}</h3>
        <p class="text-2xl font-bold text-blue-600">${{ summary.roomRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.occupancyRate') }}</h3>
        <p class="text-2xl font-bold text-purple-600">{{ summary.occupancyRate }}%</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.averageADR') }}</h3>
        <p class="text-2xl font-bold text-orange-600">${{ summary.averageADR.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Revenue Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.frontOffice.revenueBreakdown') }}
        </h2>
        <div class="space-y-3">
          <div v-for="item in revenueBreakdown" :key="item.category" class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">{{ $t(`revenue.${item.category}`) }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">${{ item.amount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('reports.frontOffice.operationalSummary') }}
        </h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.checkIns') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ operationalSummary.checkIns }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.checkOuts') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ operationalSummary.checkOuts }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.noShows') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ operationalSummary.noShows }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.cancellations') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ operationalSummary.cancellations }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">{{ $t('reports.frontOffice.walkIns') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ operationalSummary.walkIns }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Summary -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ $t('reports.frontOffice.paymentSummary') }}
      </h2>
      <ReusableTable
        :title="t('reports.frontOffice.paymentSummary')"
        :columns="paymentTableColumns"
        :data="paymentSummary"
        :searchable="false"
        :empty-message="t('common.noDataAvailable')"
      >
        <template #amount="{ item }">
          <span class="font-medium text-green-600">${{ item.amount.toFixed(2) }}</span>
        </template>
        <template #percentage="{ item }">
          <span class="text-blue-600">{{ item.percentage.toFixed(1) }}%</span>
        </template>
      </ReusableTable>
    </div>

    <!-- Audit Trail -->
    <ReusableTable
      :title="t('reports.frontOffice.auditTrail')"
      :columns="auditTableColumns"
      :data="auditTrail"
      :searchable="true"
      :empty-message="t('common.noDataAvailable')"
    >
      <template #amount="{ item }">
        <span v-if="item.amount" :class="item.amount > 0 ? 'text-green-600' : 'text-red-600'">
          ${{ item.amount.toFixed(2) }}
        </span>
        <span v-else class="text-gray-400">-</span>
      </template>
    </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/common/ReusableTable.vue'

const { t } = useI18n()

interface RevenueItem {
  category: string
  amount: number
}

interface PaymentSummaryItem {
  method: string
  transactions: number
  amount: number
  percentage: number
}

interface AuditEntry {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
  amount?: number
}

const filters = ref({
  auditDate: new Date().toISOString().split('T')[0],
  shift: 'night',
  auditor: ''
})

const revenueBreakdown = ref<RevenueItem[]>([])
const paymentSummary = ref<PaymentSummaryItem[]>([])
const auditTrail = ref<AuditEntry[]>([])

const operationalSummary = ref({
  checkIns: 0,
  checkOuts: 0,
  noShows: 0,
  cancellations: 0,
  walkIns: 0
})

const summary = computed(() => {
  const totalRevenue = revenueBreakdown.value.reduce((sum, item) => sum + item.amount, 0)
  const roomRevenue = revenueBreakdown.value.find(item => item.category === 'rooms')?.amount || 0
  const occupancyRate = 85 // Mock data
  const averageADR = roomRevenue / (operationalSummary.value.checkIns || 1)
  
  return {
    totalRevenue,
    roomRevenue,
    occupancyRate,
    averageADR
  }
})

// Table configurations
const paymentTableColumns = computed(() => [
  { 
    key: 'method', 
    label: t('common.paymentMethod'), 
    type: 'text',
    translatable: true,
    translatePrefix: 'payments.methods'
  },
  { key: 'transactions', label: t('common.transactions'), type: 'text' },
  { key: 'amount', label: t('common.amount'), type: 'custom' },
  { key: 'percentage', label: t('common.percentage'), type: 'custom' }
])

const auditTableColumns = computed(() => [
  { 
    key: 'timestamp', 
    label: t('common.time'), 
    type: 'datetime',
    format: 'time'
  },
  { 
    key: 'action', 
    label: t('common.action'), 
    type: 'text',
    translatable: true,
    translatePrefix: 'audit.actions'
  },
  { key: 'user', label: t('common.user'), type: 'text' },
  { key: 'details', label: t('common.details'), type: 'text' },
  { key: 'amount', label: t('common.amount'), type: 'custom' }
])

const loadNightAudit = async () => {
  // Mock data for demonstration
  revenueBreakdown.value = [
    { category: 'rooms', amount: 2450.00 },
    { category: 'food', amount: 680.50 },
    { category: 'beverage', amount: 320.75 },
    { category: 'spa', amount: 150.00 },
    { category: 'laundry', amount: 45.25 },
    { category: 'telephone', amount: 12.50 },
    { category: 'minibar', amount: 89.00 }
  ]
  
  const totalAmount = revenueBreakdown.value.reduce((sum, item) => sum + item.amount, 0)
  
  paymentSummary.value = [
    { method: 'cash', transactions: 15, amount: 850.00, percentage: (850 / totalAmount) * 100 },
    { method: 'credit_card', transactions: 32, amount: 2100.00, percentage: (2100 / totalAmount) * 100 },
    { method: 'debit_card', transactions: 8, amount: 450.00, percentage: (450 / totalAmount) * 100 },
    { method: 'bank_transfer', transactions: 5, amount: 348.00, percentage: (348 / totalAmount) * 100 }
  ]
  
  operationalSummary.value = {
    checkIns: 18,
    checkOuts: 22,
    noShows: 2,
    cancellations: 3,
    walkIns: 4
  }
  
  auditTrail.value = [
    {
      id: '1',
      timestamp: '2024-01-14T23:45:00',
      action: 'check_in',
      user: 'John Doe',
      details: 'Guest check-in - Room 205',
      amount: 150.00
    },
    {
      id: '2',
      timestamp: '2024-01-14T23:30:00',
      action: 'payment_received',
      user: 'Jane Smith',
      details: 'Cash payment for Room 301',
      amount: 200.00
    },
    {
      id: '3',
      timestamp: '2024-01-14T23:15:00',
      action: 'no_show',
      user: 'System',
      details: 'No-show marked for reservation #12345'
    },
    {
      id: '4',
      timestamp: '2024-01-14T23:00:00',
      action: 'rate_adjustment',
      user: 'John Doe',
      details: 'Rate adjusted for Room 102 - Corporate discount',
      amount: -25.00
    }
  ]
}

const exportReport = () => {
  console.log('Exporting night audit report...')
}

const runAudit = () => {
  console.log('Running night audit process...')
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString()
}

onMounted(() => {
  loadNightAudit()
})
</script>