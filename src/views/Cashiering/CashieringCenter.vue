<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('cashiering.center') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $t('cashiering.centerDescription') }}</p>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-4 px-4 py-3" aria-label="Tabs">
          <button
            class="px-3 py-2 text-sm font-medium rounded-md"
            :class="{
              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300': activeTab === 'pending',
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'pending'
            }"
            @click="activeTab = 'pending'"
          >
            {{ $t('cashiering.pendingLedgerCommission') }}
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded-md"
            :class="{
              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300': activeTab === 'payments',
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'payments'
            }"
            @click="activeTab = 'payments'"
          >
            {{ $t('cashiering.pendingPayments') }}
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded-md"
            :class="{
              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300': activeTab === 'unpaid',
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'unpaid'
            }"
            @click="activeTab = 'unpaid'"
          >
            {{ $t('cashiering.unpaidInvoice') }}
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded-md"
            :class="{
              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300': activeTab === 'unsettled',
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'unsettled'
            }"
            @click="activeTab = 'unsettled'"
          >
            {{ $t('cashiering.unsettledPayments') }}
          </button>
          <button
            class="px-3 py-2 text-sm font-medium rounded-md"
            :class="{
              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300': activeTab === 'assigned',
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'assigned'
            }"
            @click="activeTab = 'assigned'"
          >
            {{ $t('cashiering.assignedPayments') }}
          </button>
        </nav>
      </div>

      <!-- Table Content -->
      <div class="p-4">
        <ReusableTable
          :columns="columns"
          :data="filteredData"
          :actions="actions"
          :loading="loading"
          :searchable="true"
          :searchPlaceholder="'Search by date, description, or user...'"
        >
          <!-- Custom column templates -->
          <template #column-date="{ item }">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(item.date) }}</span>
          </template>

          <template #column-description="{ item }">
            <div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.description }}</span>
              <p v-if="item.details" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.details }}</p>
            </div>
          </template>

          <template #column-paymentType="{ item }">
            <span class="text-sm text-gray-900 dark:text-white">{{ item.paymentType }}</span>
          </template>

          <template #column-user="{ item }">
            <span class="text-sm text-gray-900 dark:text-white">{{ item.user }}</span>
          </template>

          <template #column-credit="{ item }">
            <span v-if="item.credit > 0" class="text-sm font-medium text-green-600 dark:text-green-400">
              {{ formatCurrency(item.credit) }}
            </span>
            <span v-else class="text-sm text-gray-400 dark:text-gray-500">-</span>
          </template>

          <template #column-debit="{ item }">
            <span v-if="item.debit > 0" class="text-sm font-medium text-red-600 dark:text-red-400">
              {{ formatCurrency(item.debit) }}
            </span>
            <span v-else class="text-sm text-gray-400 dark:text-gray-500">-</span>
          </template>

          <template #column-assigned="{ item }">
            <span v-if="item.assigned" class="text-sm text-gray-900 dark:text-white">
              {{ formatCurrency(item.assigned) }}
            </span>
            <span v-else class="text-sm text-gray-400 dark:text-gray-500">-</span>
          </template>

          <template #column-unassigned="{ item }">
            <span v-if="item.unassigned" class="text-sm text-gray-900 dark:text-white">
              {{ formatCurrency(item.unassigned) }}
            </span>
            <span v-else class="text-sm text-gray-400 dark:text-gray-500">-</span>
          </template>

          <template #column-balance="{ item }">
            <span class="text-sm font-medium" :class="{
              'text-green-600 dark:text-green-400': item.balance > 0,
              'text-red-600 dark:text-red-400': item.balance < 0,
              'text-gray-900 dark:text-white': item.balance === 0
            }">
              {{ formatCurrency(item.balance) }}
            </span>
          </template>

          <!-- Header actions -->
          <template #header-actions>
            <button 
              @click="openNewPaymentModal"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {{ $t('cashiering.addPayment') }}
            </button>
            <button 
              class="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              @click="exportData"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {{ $t('common.export') }}
            </button>
            <button 
              class="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              @click="showFilters = !showFilters"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {{ $t('common.filter') }}
            </button>
          </template>
        </ReusableTable>

        <!-- Payment Entry Button -->
        <div class="mt-4 flex justify-center">
          <button 
            @click="openPaymentEntryModal"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {{ $t('cashiering.paymentEntry') }}
          </button>
        </div>
        
        <!-- Filter Panel -->
        <div v-if="showFilters" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('common.dateRange') }}</label>
              <div class="flex space-x-2">
                <input type="date" v-model="filters.startDate" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                <input type="date" v-model="filters.endDate" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('common.user') }}</label>
              <select v-model="filters.user" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <option value="">{{ $t('common.all') }}</option>
                <option value="helpdesk/support">helpdesk/support</option>
                <!-- Add more users as needed -->
              </select>
            </div>
            <div class="flex items-end">
              <button 
                @click="applyFilters"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {{ $t('common.apply') }}
              </button>
              <button 
                @click="resetFilters"
                class="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {{ $t('common.reset') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Closing Balance -->
        <div class="mt-6 flex justify-end">
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">Closing Balance:</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(closingBalance) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReusableTable from '@/components/tables/ReusableTable.vue'

const router = useRouter()
const { t } = useI18n()

// State
const activeTab = ref('pending')
const loading = ref(false)
const closingBalance = ref(35000)
const showFilters = ref(false)

// Filters
const filters = ref({
  startDate: '',
  endDate: '',
  user: ''
})

// Original data backup for filtering
const originalTransactions = ref([])

// Table columns
const columns = ref([
  { key: 'date', label: 'Date', type: 'custom' },
  { key: 'description', label: 'Description', type: 'custom' },
  { key: 'paymentType', label: 'Payment Type', type: 'custom' },
  { key: 'user', label: 'User', type: 'custom' },
  { key: 'credit', label: 'Credit', type: 'custom' },
  { key: 'debit', label: 'Debit', type: 'custom' },
  { key: 'assigned', label: 'Assigned', type: 'custom' },
  { key: 'unassigned', label: 'Unassigned', type: 'custom' },
  { key: 'balance', label: 'Balance', type: 'custom' },
])

// Sample data
const transactions = ref([
  {
    id: 1,
    date: '2023-11-01',
    description: 'Receipt for TIN',
    details: 'Payments received from cityledger_ref1',
    paymentType: 'cash',
    user: 'helpdesk/support',
    credit: 15.00,
    debit: 0.00,
    assigned: 0.00,
    unassigned: 0.00,
    balance: 15.00
  },
  {
    id: 2,
    date: '2023-10-31',
    description: 'Receipt for 123456',
    details: 'Payments received from cityledger_ref1',
    paymentType: 'cash',
    user: 'helpdesk/support',
    credit: 4.00,
    debit: 0.00,
    assigned: 0.00,
    unassigned: 0.00,
    balance: 4.00
  },
  {
    id: 3,
    date: '2023-01-01',
    description: 'Guest - Emile Simalundu, Room: 8102 #102, 208',
    details: null,
    paymentType: 'ADONIS TRAVELS&TOURS',
    user: 'helpdesk/support',
    credit: 0.00,
    debit: 12,720.00,
    assigned: 0.00,
    unassigned: 0.00,
    balance: -12,720.00
  },
  {
    id: 4,
    date: '2023-01-01',
    description: 'Guest - Emile Simalundu, Room: 8102 #102',
    details: null,
    paymentType: 'ADONIS TRAVELS&TOURS',
    user: 'helpdesk/support',
    credit: 0.00,
    debit: 12,720.00,
    assigned: 12,720.00,
    unassigned: 0.00,
    balance: 0.00
  },
  {
    id: 5,
    date: '2023-01-01',
    description: 'Payments received from cityledger',
    details: null,
    paymentType: 'cash',
    user: 'helpdesk/support',
    credit: 40,000.00,
    debit: 0.00,
    assigned: 0.00,
    unassigned: 40,000.00,
    balance: 40,000.00
  }
])

// Actions
const actions = ref([
  {
    label: 'View Details',
    handler: (item) => viewDetails(item),
    icon: 'eye'
  },
  {
    label: 'Edit',
    handler: (item) => editTransaction(item),
    icon: 'pencil'
  },
  {
    label: 'Delete',
    handler: (item) => deleteTransaction(item),
    icon: 'trash',
    variant: 'danger'
  }
])

// Computed
const filteredData = computed(() => {
  // First filter by tab
  let filtered = [];
  
  switch (activeTab.value) {
    case 'pending':
      filtered = transactions.value.filter(t => t.description.includes('cityledger'))
      break
    case 'payments':
      filtered = transactions.value.filter(t => t.credit > 0)
      break
    case 'unpaid':
      filtered = transactions.value.filter(t => t.debit > 0 && t.assigned === 0)
      break
    case 'unsettled':
      filtered = transactions.value.filter(t => t.balance !== 0)
      break
    case 'assigned':
      filtered = transactions.value.filter(t => t.assigned > 0)
      break
    default:
      filtered = transactions.value
  }
  
  // Then apply user filters
  if (filters.value.startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.value.startDate))
  }
  
  if (filters.value.endDate) {
    filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.value.endDate))
  }
  
  if (filters.value.user) {
    filtered = filtered.filter(t => t.user === filters.value.user)
  }
  
  return filtered
})

// Methods
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

const viewDetails = (item) => {
  console.log('View details for:', item)
  // Implement view details logic
}

const editTransaction = (item) => {
  console.log('Edit transaction:', item)
  // Implement edit logic
}

const deleteTransaction = (item) => {
  console.log('Delete transaction:', item)
  // Implement delete logic
}

const openNewPaymentModal = () => {
  // Navigate to the new payment component
  router.push('/cashiering/new-payment')
}

const openPaymentEntryModal = () => {
  console.log('Open payment entry modal')
  // Implement payment entry modal logic
}

const exportData = () => {
  console.log('Exporting data...')
  // Implement export logic
}

const applyFilters = () => {
  console.log('Applying filters:', filters.value)
  // The computed filteredData will automatically update
}

const resetFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    user: ''
  }
}

// Lifecycle hooks
onMounted(() => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    // Store original data for filtering
    originalTransactions.value = [...transactions.value]
    loading.value = false
  }, 1000)
}
</script>