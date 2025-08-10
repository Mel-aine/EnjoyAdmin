<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.roomServiceReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.roomServiceReportDescription') }}
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
              {{ $t('common.serviceType') }}
            </label>
            <select
              v-model="filters.serviceType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="food">{{ $t('services.food') }}</option>
              <option value="beverage">{{ $t('services.beverage') }}</option>
              <option value="laundry">{{ $t('services.laundry') }}</option>
              <option value="housekeeping">{{ $t('services.housekeeping') }}</option>
              <option value="spa">{{ $t('services.spa') }}</option>
              <option value="other">{{ $t('services.other') }}</option>
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
              <option value="pending">{{ $t('services.status.pending') }}</option>
              <option value="in-progress">{{ $t('services.status.inProgress') }}</option>
              <option value="completed">{{ $t('services.status.completed') }}</option>
              <option value="cancelled">{{ $t('services.status.cancelled') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadRoomServiceReport"
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalOrders') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalOrders }}</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgOrderValue') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.avgOrderValue.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.completedOrders') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.completedOrders }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('reports.frontOffice.roomServiceReport') }} ({{ filteredOrders.length }})
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.orderNumber') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.room') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.guestName') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.serviceType') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.orderTime') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.amount') }}
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
              <tr v-for="order in filteredOrders" :key="order.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ order.orderNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ order.roomNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ order.guestName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ $t(`services.${order.serviceType}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDateTime(order.orderTime) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  ${{ order.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ $t(`services.status.${order.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewOrder(order.id)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    {{ $t('common.view') }}
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    @click="updateOrderStatus(order.id, 'in-progress')"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    {{ $t('common.start') }}
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

interface RoomServiceOrder {
  id: string
  orderNumber: string
  roomNumber: string
  guestName: string
  serviceType: string
  orderTime: string
  amount: number
  status: string
  items: string[]
}

const filters = ref({
  dateFrom: '',
  dateTo: '',
  serviceType: '',
  status: ''
})

const orders = ref<RoomServiceOrder[]>([])
const loading = ref(false)

const summary = ref({
  totalOrders: 0,
  totalRevenue: 0,
  avgOrderValue: 0,
  completedOrders: 0
})

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (filters.value.serviceType && order.serviceType !== filters.value.serviceType) {
      return false
    }
    if (filters.value.status && order.status !== filters.value.status) {
      return false
    }
    return true
  })
})

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const loadRoomServiceReport = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    orders.value = [
      {
        id: '1',
        orderNumber: 'RS-2024-001',
        roomNumber: '101',
        guestName: 'John Doe',
        serviceType: 'food',
        orderTime: '2024-01-15T14:30:00',
        amount: 45.50,
        status: 'completed',
        items: ['Chicken Sandwich', 'French Fries', 'Coca Cola']
      },
      {
        id: '2',
        orderNumber: 'RS-2024-002',
        roomNumber: '205',
        guestName: 'Jane Smith',
        serviceType: 'laundry',
        orderTime: '2024-01-15T10:15:00',
        amount: 25.00,
        status: 'in-progress',
        items: ['Dry Cleaning - 3 items']
      },
      {
        id: '3',
        orderNumber: 'RS-2024-003',
        roomNumber: '312',
        guestName: 'Bob Johnson',
        serviceType: 'spa',
        orderTime: '2024-01-15T16:00:00',
        amount: 120.00,
        status: 'pending',
        items: ['Full Body Massage', 'Facial Treatment']
      }
    ]
    
    // Calculate summary
    summary.value = {
      totalOrders: orders.value.length,
      totalRevenue: orders.value.reduce((sum, order) => sum + order.amount, 0),
      avgOrderValue: orders.value.length > 0 ? orders.value.reduce((sum, order) => sum + order.amount, 0) / orders.value.length : 0,
      completedOrders: orders.value.filter(order => order.status === 'completed').length
    }
  } catch (error) {
    console.error('Error loading room service report:', error)
  } finally {
    loading.value = false
  }
}

const viewOrder = (orderId: string) => {
  router.push(`/room-service/${orderId}`)
}

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    // Mock API call - replace with actual API call
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus
    }
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

onMounted(() => {
  loadRoomServiceReport()
})
</script>