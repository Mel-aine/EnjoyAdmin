<!-- RefundsList.vue -->
<template>
  <AdminLayout>
    <FullScreenLayout>
      <div class="p-4 sm:p-6 lg:p-8">
        <div class="w-full max-w-7xl space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ $t('refundsList.headerTitle') }}</h2>
            <p class="text-gray-600 mt-1">{{ $t('refundsList.headerSubtitle') }}</p>
          </div>
          <!-- Header Section -->
          <!-- <div class="relative overflow-hidden bg-white rounded-3xl border border-gray-200/60">
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
        </div> -->

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
                  <p class="text-3xl font-bold text-green-600 flex justify-center">
                    {{ completedRefunds }}
                  </p>
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
                  <p class="text-3xl font-bold text-yellow-600 flex justify-center">
                    {{ pendingRefunds }}
                  </p>
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
                  <p class="text-3xl font-bold text-red-600 flex justify-center">
                    {{ failedRefunds }}
                  </p>
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
              v-if="!showFilter"
              @click="filterShow"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-md w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <FilterIcon class="w-6 h-6 text-white" />
            </button>
          </div>

          <!-- Filters Section -->
          <div
            v-if="showFilter"
            class="bg-white rounded-3xl border border-gray-100 overflow-hidden"
          >
            <div class="bg-gradient-to-r from-white to-indigo-50 px-8 py-3 border-b border-gray-100">
              <div
                class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
              >
                <div class="flex justify-between items-center w-full">
                  <h2 class="text-xl font-semibold text-gray-800 flex items-center">
                    <FilterIcon class="mr-2 text-primary" :size="20" />
                    {{ $t('refundsList.filterSectionTitle') }}
                  </h2>
                  <button @click="showFilter = false">
                    <XCircleIcon class="mr-2 text-primary" :size="20" />
                  </button>
                </div>
              </div>
            </div>

            <div class="p-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <!-- Date Start -->
                  <div>
                    <label for="checkInDate" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('refundsList.filterStartDate') }}:</label>
                    <div class="relative">
                      <flat-pickr v-model="filters.startDate" :config="flatpickrConfig"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                        :placeholder="$t('Selectdate')" />
                      <span
                        class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <CalendarIcon />
                      </span>
                    </div>
                  </div>

                <!-- Date End -->

                  <div>
                    <label for="checkOutDate" class="block text-gray-700 text-sm font-bold mb-2">{{
                         $t('refundsList.filterEndDate') }}:</label>
                    <div class="relative">
                      <flat-pickr  v-model="filters.endDate" :config="flatpickrConfig"
                        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                        :placeholder="$t('Selectdate')" />
                      <span
                        class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <CalendarIcon />
                      </span>
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
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  >
                    <option value="">{{ $t('refundsList.filterAll') }}</option>
                    <option v-for="type in uniqueRoomTypes" :key="type" :value="type.id">
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
                   class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
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
                  class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <SearchIcon class="w-5 h-5 mr-2" />
                  {{ $t('refundsList.applyFilters') }}
                </button>
                <button
                  @click="clearFilters"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <XCircleIcon class="mr-2" :size="18" />
                  {{ $t('refundsList.clearFilters') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Refunds Table Section -->
           <div>
          <TableComponent
            :items="titles"
            :datas="filteredRefunds"
            :filterable="true"
            :pagination="true"
            :loading="loading"
            :showHeader="true"
            :title="$t('refundsList.listSectionTitle')"
            :pageSize="15"
            :showButtonAllElement="true"
            class="modern-table"
          />
          </div>
        </div>
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { FilterIcon, XIcon } from 'lucide-vue-next'
import { SearchIcon } from 'lucide-vue-next'
import { RefreshCwIcon } from 'lucide-vue-next'
import { ListIcon } from 'lucide-vue-next'
import { CreditCardIcon } from 'lucide-vue-next'
import { CheckCircleIcon } from 'lucide-vue-next'
import { ClockIcon } from 'lucide-vue-next'
import { XCircleIcon } from 'lucide-vue-next'
import { SearchX } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { getRefunds ,filterRefund} from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import TableComponent from '@/components/tables/TableComponent.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import flatPickr from 'vue-flatpickr-component'

import 'flatpickr/dist/flatpickr.css'
import CalendarIcon from '@/icons/CalendarIcon.vue';

const { t } = useI18n()
const showFilter = ref(false)
const serviceStore = useServiceStore()
const allRefunds = ref<any[]>([])
const filteredRefunds = ref<any[]>([])
const currentPage = ref(1)
const loading = ref(false)

// Filter state
const filters = ref({
  startDate: '',
  endDate: '',
  roomType: null,
  specificRoomId: null,
})

const titles = computed(() => [
  {
    name: 'refundId',
    label: t('refundsList.tableRefundId'),
    type: 'text',
    filterable: false,
    width: 'min-w-[10px]'
  },
  {
    name: 'reservationId',
    label: t('refundsList.tableReservationId'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'client',
    label: t('refundsList.tableGuestName'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'room',
    label: t('refundsList.tableRoom'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'roomType',
    label: t('refundsList.tableRoomType'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'amount',
    label: t('refundsList.tableAmount'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'method',
    label: t('refundsList.tableMethod'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'date',
    label: t('refundsList.tableDate'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'reason',
    label: t('refundsList.tableReason'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'statusColor',
    label: t('refundsList.tableStatus'),
    type: 'badge',
    filterable: true,
  },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'View',
        event: 'view',
        icone: `<svg class="h-6 w-6 text-orange-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><circle cx="12" cy="12" r="2" /><path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" /><path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>`,
      },
    ],
  },
])

const filterShow = () => {
  showFilter.value = !showFilter.value
}


const completedRefunds = computed(() => {
  return allRefunds.value.filter((refund) => refund.refund.status === 'processed').length
})

const pendingRefunds = computed(() => {
  return allRefunds.value.filter((refund) => refund.refund.status === 'pending').length
})

const failedRefunds = computed(() => {
  return allRefunds.value.filter((refund:any) => refund.refund.status === 'failed').length
})

const uniqueRoomTypes = computed<any[]>(() => {
  const types = new Set<string>()
  allRefunds.value.forEach((refund:any) => {
    const type = refund.reservation.products[0]?.room_type
    if (type) {
      types.add(type)
    }
  })
  return Array.from(types)
})

const uniqueRooms = computed(() => {
  const rooms = new Map()
  allRefunds.value.forEach((refund) => {
    if (refund.reservation.products[0]) {
      const product = refund.reservation.products[0]
      rooms.set(product.id, {
        id: product.id,
        productName: product.name,
      })
    }
  })
  return Array.from(rooms.values())
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



const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(t('locale'), { style: 'currency', currency: 'XAF' }).format(amount)
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
      return 'bg-green-100 text-green-800'
  }
}

const fetchRefunds = async () => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId
    const response = await getRefunds(serviceId)

    allRefunds.value = response.data.map((r: any) => {
      const statusClasses = getStatusClass(r.refund.status).split(' ')

      const product = r.reservation.products[0] || {}
      return {
        ...r,
        refundId: r.refund.id,
        reservationId: r.reservation.id,
        client: r.reservation.client?.name || 'N/A',
        room: product.name || 'N/A',
        roomType: product.room_type || 'N/A',
        amount: formatCurrency(parseFloat(r.refund.amount)),
        method: r.refund.method || 'N/A',
        date: formatDate(r.refund.date),
        reason: r.refund.reason || '',
        statusColor: {
          label: r.refund.status,
          bg: statusClasses[0],
          text: statusClasses[1],
        },
      }
    })

    applyFilters()
  } catch (error) {
    console.error('error fetchRefund', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId
    const response = await filterRefund(serviceId, filters.value)
    console.log('Filtered Refunds:', response.data)
     console.log("filters",filters.value)

    filteredRefunds.value = response.data.map((r: any) => {
      const statusClasses = getStatusClass(r.refund.status).split(' ')

      const product = r.reservation.products[0] || {}
      return {
        ...r,
        refundId: r.refund.id,
        reservationId: r.reservation.id,
        client: r.reservation.client?.name || 'N/A',
        room: product.name || 'N/A',
        roomType: product.room_type || 'N/A',
        amount: formatCurrency(parseFloat(r.refund.amount)),
        method: r.refund.method || 'N/A',
        date: formatDate(r.refund.date),
        reason: r.refund.reason || '',
        statusColor: {
          label: r.refund.status,
          bg: statusClasses[0],
          text: statusClasses[1],
        },
      }
    })
  } catch (error) {
    console.error('Error applying filters:', error)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  filters.value.roomType = null
  filters.value.specificRoomId = null
  applyFilters()
}

onMounted(() => {
  fetchRefunds()

})

const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}
</script>
