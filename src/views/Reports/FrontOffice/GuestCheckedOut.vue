<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.frontOffice.guestCheckedOut') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.frontOffice.guestCheckedOutDescription') }}
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
            {{ $t('common.checkOutDateFrom') }}
          </label>
          <input
            v-model="filters.checkOutDateFrom"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.checkOutDateTo') }}
          </label>
          <input
            v-model="filters.checkOutDateTo"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.roomType') }}
          </label>
          <select
            v-model="filters.roomType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="standard">{{ $t('rooms.types.standard') }}</option>
            <option value="deluxe">{{ $t('rooms.types.deluxe') }}</option>
            <option value="suite">{{ $t('rooms.types.suite') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.paymentStatus') }}
          </label>
          <select
            v-model="filters.paymentStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="paid">{{ $t('payments.status.paid') }}</option>
            <option value="partial">{{ $t('payments.status.partial') }}</option>
            <option value="pending">{{ $t('payments.status.pending') }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadCheckedOutGuests"
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
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.totalCheckedOut') }}</h3>
        <p class="text-2xl font-bold text-blue-600">{{ summary.totalCheckedOut }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.totalRevenue') }}</h3>
        <p class="text-2xl font-bold text-green-600">${{ summary.totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.averageStayLength') }}</h3>
        <p class="text-2xl font-bold text-purple-600">{{ summary.averageStayLength }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.averageADR') }}</h3>
        <p class="text-2xl font-bold text-orange-600">${{ summary.averageADR.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Results Table -->
    <ReusableTable
      :title="$t('reports.frontOffice.checkedOutGuestsResults')"
      :columns="tableColumns"
      :data="checkedOutGuests"
      :actions="tableActions"
      :searchable="true"
      :search-placeholder="$t('common.searchGuests')"
      :selectable="false"
      :empty-state-title="$t('common.noDataFound')"
      :empty-state-message="$t('reports.noGuestsFound')"
    >
      <template #column-totalAmount="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">
          ${{ item.totalAmount.toFixed(2) }}
        </span>
      </template>
      <template #column-rating="{ item }">
        <div class="flex items-center">
          <span class="text-yellow-400">★</span>
          <span class="ml-1 text-sm text-gray-900 dark:text-white">{{ item.rating || 'N/A' }}</span>
        </div>
      </template>
    </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'

const { t } = useI18n()

interface CheckedOutGuest {
  id: string
  guestName: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  nights: number
  totalAmount: number
  paymentStatus: string
  rating?: number
}

const filters = ref({
  checkOutDateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  checkOutDateTo: new Date().toISOString().split('T')[0],
  roomType: '',
  paymentStatus: ''
})

const checkedOutGuests = ref<CheckedOutGuest[]>([])

const summary = computed(() => {
  const totalCheckedOut = checkedOutGuests.value.length
  const totalRevenue = checkedOutGuests.value.reduce((sum, guest) => sum + guest.totalAmount, 0)
  const totalNights = checkedOutGuests.value.reduce((sum, guest) => sum + guest.nights, 0)
  const averageStayLength = totalCheckedOut > 0 ? totalNights / totalCheckedOut : 0
  const averageADR = totalNights > 0 ? totalRevenue / totalNights : 0
  
  return {
    totalCheckedOut,
    totalRevenue,
    averageStayLength: averageStayLength.toFixed(1),
    averageADR
  }
})

// Table configuration
const tableColumns = computed(() => [
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { key: 'checkInDate', label: t('common.checkInDate'), type: 'date' },
  { key: 'checkOutDate', label: t('common.checkOutDate'), type: 'date' },
  { key: 'nights', label: t('common.nights'), type: 'text' },
  { key: 'totalAmount', label: t('common.totalAmount'), type: 'custom' },
  { 
    key: 'paymentStatus', 
    label: t('common.paymentStatus'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'paid': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'partial': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'pending': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    }
  },
  { key: 'rating', label: t('common.rating'), type: 'custom' }
])

const tableActions = [
  {
    label: t('common.view'),
    handler: (item: CheckedOutGuest) => viewGuestDetails(item.id),
    variant: 'primary'
  },
  {
    label: t('common.invoice'),
    handler: (item: CheckedOutGuest) => viewInvoice(item.id),
    variant: 'success'
  }
]

const loadCheckedOutGuests = async () => {
  // Mock data for demonstration
  checkedOutGuests.value = [
    {
      id: '1',
      guestName: 'Alice Cooper',
      roomNumber: '102',
      checkInDate: '2024-01-10',
      checkOutDate: '2024-01-13',
      nights: 3,
      totalAmount: 450.00,
      paymentStatus: 'paid',
      rating: 4.5
    },
    {
      id: '2',
      guestName: 'Bob Martin',
      roomNumber: '205',
      checkInDate: '2024-01-08',
      checkOutDate: '2024-01-12',
      nights: 4,
      totalAmount: 600.00,
      paymentStatus: 'paid',
      rating: 5.0
    },
    {
      id: '3',
      guestName: 'Carol Davis',
      roomNumber: '301',
      checkInDate: '2024-01-11',
      checkOutDate: '2024-01-14',
      nights: 3,
      totalAmount: 750.00,
      paymentStatus: 'partial'
    }
  ]
}

const exportReport = () => {
  console.log('Exporting checked-out guests report...')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'partial':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'pending':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const viewGuestDetails = (id: string) => {
  console.log('Viewing guest details:', id)
}

const viewInvoice = (id: string) => {
  console.log('Viewing invoice for guest:', id)
}

onMounted(() => {
  loadCheckedOutGuests()
})
</script>