<template>
  <ReportsLayout>
    <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('reports.frontOffice.guestCheckedIn') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('reports.frontOffice.guestCheckedInDescription') }}
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
            {{ $t('common.roomNumber') }}
          </label>
          <input
            v-model="filters.roomNumber"
            type="text"
            placeholder="{{ $t('common.enterRoomNumber') }}"
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
            {{ $t('common.guestName') }}
          </label>
          <input
            v-model="filters.guestName"
            type="text"
            placeholder="{{ $t('common.enterGuestName') }}"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.checkInDate') }}
          </label>
          <input
            v-model="filters.checkInDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="loadCheckedInGuests"
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
          @click="refreshData"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {{ $t('common.refresh') }}
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.totalCheckedIn') }}</h3>
        <p class="text-2xl font-bold text-blue-600">{{ summary.totalCheckedIn }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.occupancyRate') }}</h3>
        <p class="text-2xl font-bold text-green-600">{{ summary.occupancyRate }}%</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.averageStayLength') }}</h3>
        <p class="text-2xl font-bold text-purple-600">{{ summary.averageStayLength }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('reports.frontOffice.totalRevenue') }}</h3>
        <p class="text-2xl font-bold text-orange-600">${{ summary.totalRevenue.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Results Table -->
    <ReusableTable
      :title="$t('reports.frontOffice.checkedInGuestsResults')"
      :columns="tableColumns"
      :data="checkedInGuests"
      :actions="tableActions"
      :searchable="true"
      :search-placeholder="$t('common.searchGuests')"
      :selectable="false"
      :empty-state-title="$t('common.noDataFound')"
      :empty-state-message="$t('reports.noGuestsFound')"
      @action="handleTableAction"
    >
      <template #column-totalAmount="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">
          ${{ item.totalAmount.toFixed(2) }}
        </span>
      </template>
    </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface CheckedInGuest {
  id: string
  guestName: string
  roomNumber: string
  roomType: string
  checkInDate: string
  expectedCheckOut: string
  nights: number
  totalAmount: number
  paymentStatus: string
}

const filters = ref({
  roomNumber: '',
  roomType: '',
  guestName: '',
  checkInDate: ''
})

const checkedInGuests = ref<CheckedInGuest[]>([])

const summary = computed(() => {
  const totalCheckedIn = checkedInGuests.value.length
  const totalRevenue = checkedInGuests.value.reduce((sum, guest) => sum + guest.totalAmount, 0)
  const averageStayLength = totalCheckedIn > 0 
    ? checkedInGuests.value.reduce((sum, guest) => sum + guest.nights, 0) / totalCheckedIn 
    : 0
  const occupancyRate = Math.round((totalCheckedIn / 100) * 100) // Assuming 100 total rooms
  
  return {
    totalCheckedIn,
    occupancyRate,
    averageStayLength: averageStayLength.toFixed(1),
    totalRevenue
  }
})

// Table configuration
const tableColumns = computed(() => [
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { key: 'roomType', label: t('common.roomType'), type: 'text' },
  { key: 'checkInDate', label: t('common.checkInDate'), type: 'date' },
  { key: 'expectedCheckOut', label: t('common.expectedCheckOut'), type: 'date' },
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
  }
])

const tableActions = [
  {
    label: t('common.view'),
    handler: (item: CheckedInGuest) => viewGuestDetails(item.id),
    variant: 'primary'
  },
  {
    label: t('common.checkout'),
    handler: (item: CheckedInGuest) => processCheckOut(item.id),
    variant: 'success'
  }
]

const loadCheckedInGuests = async () => {
  // Mock data for demonstration
  checkedInGuests.value = [
    {
      id: '1',
      guestName: 'John Smith',
      roomNumber: '101',
      roomType: 'Standard',
      checkInDate: '2024-01-14',
      expectedCheckOut: '2024-01-17',
      nights: 3,
      totalAmount: 450.00,
      paymentStatus: 'paid'
    },
    {
      id: '2',
      guestName: 'Sarah Johnson',
      roomNumber: '205',
      roomType: 'Deluxe',
      checkInDate: '2024-01-13',
      expectedCheckOut: '2024-01-18',
      nights: 5,
      totalAmount: 750.00,
      paymentStatus: 'partial'
    },
    {
      id: '3',
      guestName: 'Michael Brown',
      roomNumber: '301',
      roomType: 'Suite',
      checkInDate: '2024-01-15',
      expectedCheckOut: '2024-01-20',
      nights: 5,
      totalAmount: 1250.00,
      paymentStatus: 'pending'
    }
  ]
}

const exportReport = () => {
  console.log('Exporting checked-in guests report...')
}

const refreshData = () => {
  loadCheckedInGuests()
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

const processCheckOut = (id: string) => {
  console.log('Processing checkout for guest:', id)
}

const handleTableAction = (action: string, item: CheckedInGuest) => {
  console.log('Table action:', action, 'on item:', item)
}

onMounted(() => {
  loadCheckedInGuests()
})
</script>