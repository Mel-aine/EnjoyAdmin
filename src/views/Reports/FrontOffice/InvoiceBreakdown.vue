<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.invoiceBreakdown') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.invoiceBreakdownDescription') }}
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
              {{ $t('common.invoiceStatus') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="paid">{{ $t('invoices.status.paid') }}</option>
              <option value="pending">{{ $t('invoices.status.pending') }}</option>
              <option value="overdue">{{ $t('invoices.status.overdue') }}</option>
              <option value="cancelled">{{ $t('invoices.status.cancelled') }}</option>
            </select>
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
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadInvoiceBreakdown"
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalInvoices') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalInvoices }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalRevenue') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.totalRevenue.toFixed(2) }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.pendingAmount') }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgInvoiceValue') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.avgInvoiceValue.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.frontOffice.invoiceBreakdown') }} ({{ filteredInvoices.length }})
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.invoiceNumber') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.date') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.guestName') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.roomCharges') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.serviceCharges') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.taxes') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.totalAmount') }}
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
              <tr v-for="invoice in filteredInvoices" :key="invoice.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ invoice.invoiceNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDate(invoice.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ invoice.guestName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ invoice.roomCharges.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ invoice.serviceCharges.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ invoice.taxes.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  ${{ invoice.totalAmount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(invoice.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ $t(`invoices.status.${invoice.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewInvoice(invoice.id)"
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

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  guestName: string
  roomCharges: number
  serviceCharges: number
  taxes: number
  totalAmount: number
  status: string
  paymentMethod: string
}

const filters = ref({
  dateFrom: '',
  dateTo: '',
  status: '',
  paymentMethod: ''
})

const invoices = ref<Invoice[]>([])
const loading = ref(false)

const summary = ref({
  totalInvoices: 0,
  totalRevenue: 0,
  pendingAmount: 0,
  avgInvoiceValue: 0
})

const filteredInvoices = computed(() => {
  return invoices.value.filter(invoice => {
    if (filters.value.status && invoice.status !== filters.value.status) {
      return false
    }
    if (filters.value.paymentMethod && invoice.paymentMethod !== filters.value.paymentMethod) {
      return false
    }
    return true
  })
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  }
}

const loadInvoiceBreakdown = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    invoices.value = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        date: '2024-01-15',
        guestName: 'John Doe',
        roomCharges: 200.00,
        serviceCharges: 50.00,
        taxes: 25.00,
        totalAmount: 275.00,
        status: 'paid',
        paymentMethod: 'card'
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        date: '2024-01-14',
        guestName: 'Jane Smith',
        roomCharges: 150.00,
        serviceCharges: 30.00,
        taxes: 18.00,
        totalAmount: 198.00,
        status: 'pending',
        paymentMethod: 'cash'
      }
    ]
    
    // Calculate summary
    summary.value = {
      totalInvoices: invoices.value.length,
      totalRevenue: invoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0),
      pendingAmount: invoices.value.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0),
      avgInvoiceValue: invoices.value.length > 0 ? invoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0) / invoices.value.length : 0
    }
  } catch (error) {
    console.error('Error loading invoice breakdown:', error)
  } finally {
    loading.value = false
  }
}

const viewInvoice = (invoiceId: string) => {
  router.push(`/invoice/${invoiceId}`)
}

onMounted(() => {
  loadInvoiceBreakdown()
})
</script>