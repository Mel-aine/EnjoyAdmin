<!-- RefundsList.vue -->
<template>
  <AdminLayout>
    <div class="min-h-screen p-4 sm:p-6 lg:p-8">
      <div class="w-full md:max-w-6xl  mx-auto space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden bg-white rounded-3xl border border-gray-200/60">
          <div class="absolute inset-0 bg-blue-500 opacity-90"></div>

          <div class="relative z-10 px-8 py-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <CreditCardIcon class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">
                    {{ $t('refundsList.headerTitle') }}
                  </h1>
                  <p class="text-xl text-blue-100 font-medium">
                    {{ $t('refundsList.headerSubtitle') }}
                  </p>
                </div>
              </div>
              <div class="hidden lg:flex items-center space-x-4">
                <div
                  class="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-1 border border-white/20"
                >
                  <div class="text-white text-sm font-medium">
                    {{ $t('refundsList.totalRefunds') }}
                  </div>
                  <div class="text-white text-2xl font-bold flex justify-center">
                    {{ allRefunds.length }}
                  </div>
                </div>
                <div
                  class="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-1 border border-white/20"
                >
                  <div class="text-white text-sm font-medium">
                    {{ $t('refundsList.totalAmount') }}
                  </div>
                  <div class="text-white text-2xl font-bold">
                    {{ formatCurrency(totalRefundAmount) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-white rounded-2xl border border-gray-200/50 p-6 transition-all duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('refundsList.completedRefunds') }}
                </p>
                <p class="text-3xl font-bold text-green-600 flex justify-center">{{ completedRefunds }}</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <CheckCircleIcon class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-2xl border border-gray-200/50 p-6 transition-all duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('refundsList.pendingRefunds') }}
                </p>
                <p class="text-3xl font-bold text-yellow-600 flex justify-center">{{ pendingRefunds }}</p>
              </div>
              <div class="bg-yellow-100 rounded-full p-3">
                <ClockIcon class="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-2xl border border-gray-200/50 p-6 transition-all duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('refundsList.failedRefunds') }}
                </p>
                <p class="text-3xl font-bold text-red-600 flex justify-center">{{ failedRefunds }}</p>
              </div>
              <div class="bg-red-100 rounded-full p-3">
                <XCircleIcon class="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Toggle Button -->
        <div class="flex justify-end">
          <button
            @click="filterShow"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-md w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <FilterIcon v-if="!showFilter" class="w-6 h-6 text-white" />
            <XIcon v-else class="w-6 h-6 text-white" />
          </button>
        </div>

        <!-- Filters Section -->
        <div v-if="showFilter" class="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-white to-blue-50 px-8 py-3 border-b border-gray-100">
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
            >
              <div class="flex items-center space-x-4">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FilterIcon class="mr-2 text-blue-600" :size="20" />
                    {{ $t('refundsList.filterSectionTitle') }}
                  </h2>
              </div>
              <div
                class="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm"
              >
                {{ filteredRefunds.length }}
                <span class="text-gray-500 ml-1">{{ $t('refundsList.results') }}</span>
              </div>
            </div>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <!-- Date Start -->
              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">{{
                  $t('refundsList.filterStartDate')
                }}</label>
                <div class="relative">
                  <input
                    type="date"
                    v-model="filters.startDate"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  />
                  <CalendarIcon class="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <!-- Date End -->
              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">{{
                  $t('refundsList.filterEndDate')
                }}</label>
                <div class="relative">
                  <input
                    type="date"
                    v-model="filters.endDate"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  />
                  <CalendarIcon class="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <!-- Room Type Filter -->
              <div>
                <label for="roomType" class="block text-gray-700 text-sm font-bold mb-2"
                  >{{ $t('refundsList.filterRoomType') }}:</label
                >
                <select
                  id="roomType"
                  v-model="filters.roomType"
                  class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                >
                  <option value="">{{ $t('refundsList.filterAll') }}</option>
                  <option v-for="type in uniqueRoomTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>

              <!-- Specific Room Filter -->
              <div>
                <label for="specificRoom" class="block text-gray-700 text-sm font-bold mb-2"
                  >{{ $t('refundsList.filterSpecificRoom') }}:</label
                >
                <select
                  id="specificRoom"
                  v-model="filters.specificRoomId"
                  class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                >
                  <option value="">{{ $t('refundsList.filterAll') }}</option>
                  <option v-for="room in uniqueRooms" :key="room.id" :value="room.id">
                    {{ room.productName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-10 flex flex-wrap gap-4 justify-end">
              <button
                @click="applyFilters"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <SearchIcon class="w-5 h-5 mr-2" />
                {{ $t('refundsList.applyFilters') }}
              </button>
              <button
                @click="clearFilters"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <RefreshCwIcon class="w-5 h-5 mr-2" />
                {{ $t('refundsList.clearFilters') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Refunds Table Section -->
        <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-white to-brand-50 px-8 py-4 border-b border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center space-x-2">
                  <ListIcon class="w-6 h-6 text-blue-500" />
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ $t('refundsList.listSectionTitle') }}
                  </h2>
              </div>
              <div
                class="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-sm"
              >
                {{ currentPage }} <span class="text-gray-400 mx-1">/</span> {{ totalPages }}
              </div>
            </div>
          </div>

          <!-- Table -->
          <div v-if="paginatedRefunds.length > 0"  class="overflow-x-auto">
            <table class="min-w-full text-sm text-gray-700">
              <thead
                class="bg-gray-50 text-xs font-semibold uppercase text-gray-500 tracking-wider whitespace-nowrap"
              >
                <tr>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableRefundId') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableReservationId') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableGuestName') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableRoom') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableRoomType') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableAmount') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableMethod') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableDate') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableReason') }}</th>
                  <th class="px-6 py-4 text-left">{{ $t('refundsList.tableStatus') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr
                  v-for="refund in paginatedRefunds"
                  :key="refund.refund.id"
                  class="hover:bg-gray-50 transition duration-150"
                >
                  <td class="px-6 py-4 font-medium text-gray-900">
                    {{ refund.refund.id }}
                  </td>
                  <td class="px-6 py-4">
                    {{ refund.reservation.id }}

                  </td>
                  <td class="px-6 py-4 capitalize">
                    {{ refund.reservation.client.name }}
                  </td>
                  <td class="px-6 py-4 font-medium">
                    {{ refund.reservation.products[0]?.name || 'N/A' }}
                  </td>
                  <td class="px-6 py-4">
                    {{ refund.reservation.products[0]?.room_type || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 text-green-600 font-semibold">
                    {{ formatCurrency(parseFloat(refund.refund.amount)) }}
                  </td>
                  <td class="px-6 py-4 capitalize">
                    {{ refund.refund.method }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatDate(refund.refund.date) }}
                  </td>
                  <td class="px-6 py-4 truncate" :title="refund.refund.reason">
                    {{ refund.refund.reason }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      :class="getStatusClass(refund.refund.status)"
                      class="inline-flex items-center text-xs font-bold rounded-full px-3 py-1 shadow-sm"
                    >
                      <span
                        :class="getStatusDotClass(refund.refund.status)"
                        class="w-2 h-2 rounded-full mr-2"
                      ></span>
                      <!-- {{ $t(`refundsList.status${refund.refund.status}`) }} -->
                          {{ refund.refund.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
              <SearchX class="w-12 h-12 text-gray-400" />
              <p class="text-lg font-medium">
                {{ $t('refundsList.noResults') }}
              </p>
              <p class="text-sm text-gray-400">
                {{ $t('refundsList.tryAdjustingFilters') }}
              </p>

              <button
                @click="clearFilters"
                class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 transition"
              >
                {{ $t('refundsList.resetFilters') }}
              </button>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">
                {{ $t('refundsList.showing') }}
                {{ (currentPage - 1) * itemsPerPage + 1 }} –
                {{ Math.min(currentPage * itemsPerPage, filteredRefunds.length) }}
                {{ $t('refundsList.of') }} {{ filteredRefunds.length }}
                {{ $t('refundsList.results') }}
              </p>
              <div class="flex space-x-2">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {{ $t('refundsList.previous') }}
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  "
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {{ $t('refundsList.next') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { FilterIcon, XIcon } from 'lucide-vue-next'
import { SearchIcon } from 'lucide-vue-next'
import { RefreshCwIcon } from 'lucide-vue-next'
import { ListIcon } from 'lucide-vue-next'
import { CalendarIcon } from 'lucide-vue-next'
import { CreditCardIcon } from 'lucide-vue-next'
import { CheckCircleIcon } from 'lucide-vue-next'
import { ClockIcon } from 'lucide-vue-next'
import { XCircleIcon } from 'lucide-vue-next'
import { SearchX } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { getRefunds } from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'

const { t } = useI18n()
const showFilter = ref(false)
const serviceStore = useServiceStore()
const allRefunds = ref<any[]>([])
const filteredRefunds = ref<any[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filter state
const filters = ref({
  startDate: '',
  endDate: '',
  roomType: '',
  specificRoomId: '',
})

const filterShow = () => {
  showFilter.value = !showFilter.value
}

// Computed properties
const totalRefundAmount = computed(() => {
  return allRefunds.value.reduce((sum, refund) => sum + parseFloat(refund.refund.amount), 0)
})

const completedRefunds = computed(() => {
  return allRefunds.value.filter(refund => refund.refund.status === 'processed').length
})

const pendingRefunds = computed(() => {
  return allRefunds.value.filter(refund => refund.refund.status === 'pending').length
})

const failedRefunds = computed(() => {
  return allRefunds.value.filter(refund => refund.refund.status === 'failed').length
})


const uniqueRoomTypes = computed<string[]>(() => {
  const types = new Set<string>()
  allRefunds.value.forEach(refund => {
    const type = refund.reservation.products[0]?.room_type
    if (type) {
      types.add(type)
    }
  })
  return Array.from(types)
})


const uniqueRooms = computed(() => {
  const rooms = new Map()
  allRefunds.value.forEach(refund => {
    if (refund.reservation.products[0]) {
      const product = refund.reservation.products[0]
      rooms.set(product.id, {
        id: product.id,
        productName: product.name
      })
    }
  })
  return Array.from(rooms.values())
})

const totalPages = computed(() => {
  return Math.ceil(filteredRefunds.value.length / itemsPerPage.value)
})

const paginatedRefunds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRefunds.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2)
    }
  }

  return pages
})

// Formatter functions
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(t('locale'), options)
}

const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleTimeString(t('locale'), options)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(t('locale'), { style: 'currency', currency: 'XAF' }).format(amount)
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'processed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'processed':
      return 'bg-green-500'
    case 'pending':
      return 'bg-yellow-500'
    case 'failed':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const fetchRefunds = async () => {
  try {
    const serviceId = serviceStore.serviceId
    allRefunds.value = (await getRefunds(serviceId)).data
    applyFilters()
    console.log('allRefunds.value', allRefunds.value)
  } catch (error) {
    console.error('error fetchRefund', error)
  }
}

const applyFilters = () => {
  filteredRefunds.value = allRefunds.value.filter(refund => {
    // Date filters
    if (filters.value.startDate) {
      const refundDate = new Date(refund.refund.date)
      const startDate = new Date(filters.value.startDate)
      if (refundDate < startDate) return false
    }

    if (filters.value.endDate) {
      const refundDate = new Date(refund.refund.date)
      const endDate = new Date(filters.value.endDate)
      if (refundDate > endDate) return false
    }

    // Room type filter
    if (filters.value.roomType) {
      const roomType = refund.reservation.products[0]?.room_type
      if (roomType !== filters.value.roomType) return false
    }

    // Specific room filter
    if (filters.value.specificRoomId) {
      const roomId = refund.reservation.products[0]?.id
      if (roomId !== parseInt(filters.value.specificRoomId)) return false
    }

    return true
  })

  currentPage.value = 1
}

const clearFilters = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  filters.value.roomType = ''
  filters.value.specificRoomId = ''
  applyFilters()
}

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  fetchRefunds()
  applyFilters()
})
</script>
