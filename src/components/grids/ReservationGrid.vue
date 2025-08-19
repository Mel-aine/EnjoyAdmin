<template>
  <div>
    <!-- Grid Header with Controls -->
    <div class="bg-gray-50 mt-2 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ $t('Reservations') }}</h2>
        <span class="cursor-pointer text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
          @click="handleFilterClick('totalReservations')">
          {{ statistics.totalReservations }} {{ $t('reservations') }}
        </span>
        <span class="cursor-pointer text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
          @click="handleFilterClick('arrivals')">
          {{ statistics.arrivals }} {{ $t('arrivals') }}
        </span>
        <span class="cursor-pointer text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
          @click="handleFilterClick('departures')">
          {{ statistics.departures }} {{ $t('departures') }}
        </span>
        <span class="cursor-pointer text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
          @click="handleFilterClick('inHouse')">
          {{ statistics.inHouse }} {{ $t('in house') }}
        </span>
      </div>

      <div class="flex items-center gap-3">
        <!-- View Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button @click="viewMode = 'grid'" :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            viewMode === 'grid'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          ]">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button @click="viewMode = 'list'" :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            viewMode === 'list'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          ]">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Add Booking Button -->
        <BasicButton :label="$t('AddBooking')" @click="openBookingModal" variant="primary"
          class="transform hover:scale-105">
        </BasicButton>
        <BookingFilter @filter="applyFilter" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="reservation in paginatedReservations" :key="reservation.id">
        <ReservationCardItem :reservation="reservation" />
      </div>
    </div>

    <!-- List View (ReusableTable) -->
    <div v-else-if="viewMode === 'list'">
      <ReusableTable :showHeader="false" :columns="tableColumns" :data="paginatedReservations" :actions="tableActions"
        :searchable="false" :empty-state-title="$t('No reservations')"
        :empty-state-description="$t('Get started by creating a new reservation.')" @action="onTableAction"
        :title="$t('Reservations')">
        <!-- Custom column for reservation number -->
        <template #column-reservationNumber="{ item }">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            #{{ item.reservationNumber }}
          </div>
        </template>

        <!-- Custom column for guest info -->
        <template #column-guest="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ item.guest.displayName }}
            </div>
            <div v-if="item.email" class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.email }}
            </div>
          </div>
        </template>

        <!-- Custom column for dates -->
        <template #column-dates="{ item }">
          <div class="text-sm">
            <div class="text-gray-900 dark:text-white">{{ formatDate(item.date) }}</div>
            <div class="text-gray-500 dark:text-gray-400">{{ formatDate(item.dateD) }}</div>
          </div>
        </template>

        <!-- Custom column for amount -->
        <template #column-totalAmount="{ item }">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(item.totalAmount) }}
          </div>
        </template>

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <div class="flex flex-col gap-1">
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              item.statusColor.bg,
              item.statusColor.text
            ]">
              {{ item.statusColor.label }}
            </span>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              item.paymentStatusColor.bg,
              item.paymentStatusColor.text
            ]">
              {{ item.paymentStatusColor.label }}
            </span>
          </div>
        </template>
      </ReusableTable>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredReservations.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('No reservations') }}</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('Get started by creating a new reservation.') }}
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && filteredReservations.length > 0" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        {{ $t('Showing') }} {{ (currentPage - 1) * pageSize + 1 }} {{ $t('to') }}
        {{ Math.min(currentPage * pageSize, filteredReservations.length) }} {{ $t('of') }}
        {{ filteredReservations.length }} {{ $t('results') }}
      </div>
      <div class="flex gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          {{ $t('Previous') }}
        </button>
        <span class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          {{ $t('Next') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <ModalDelete v-if="modalShow" @close="modalShow = false" @delete="confirmDelete" :isLoading="loadingDelete" />
  <AddBookingModal v-if="showBookingModal" @close="showBookingModal = false" @refresh="refresh" />

  <!-- booking form view  -->

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useServiceStore } from '@/composables/serviceStore'
import type { ReservationType } from '@/types/option'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ModalDelete from '@/components/modal/ModalDelete.vue'
import { useBookingStore } from '@/composables/booking'
import BookingFilter from '@/views/Bookings/BookingFilter.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import type { FitlterItem } from '@/utils/models'
import BasicButton from '../buttons/BasicButton.vue'
import AddBookingModal from '../modal/AddBookingModal.vue'
import BookingForm from '@/views/Bookings/BookingForm.vue'
import { filterReservation } from '../../services/hotelApi'
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, HouseIcon, List, StopCircle, Trash2, User2Icon, UserCircle2Icon, UserMinus, X } from 'lucide-vue-next'
import { formatTime } from '../utilities/UtilitiesFunction'
import Adult from '../../icons/Adult.vue'
import Child from '../../icons/Child.vue'
import ButtomDropdownAction from '../common/ButtomDropdownAction.vue'
import ReservationCardItem from '../reservations/ReservationCardItem.vue'

const showBookingModal = ref(false)
const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
const serviceStore = useServiceStore()
const toast = useToast()
const store = useBookingStore()

// Reactive data
const modalShow = ref(false)
const selectedReservationId = ref<number | null>(null)
const loadingDelete = ref(false)
const loading = ref(true)
const reservations = ref<ReservationType[]>([])
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('date')
const currentPage = ref(1)
const pageSize = ref(12)
const filter =ref<FitlterItem>()

// Utility functions
const safeTranslate = (key: string) => {
  try {
    return t?.(key) || key
  } catch (e) {
    console.warn('Translation error:', e)
    return key
  }
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'XOF' // or your preferred currency
  }).format(amount)
}

// Table configuration for ReusableTable
const tableColumns = computed(() => [
  {
    key: 'reservationNumber',
    label: t('Reservation'),
    type: 'custom' as const
  },
  {
    key: 'guest',
    label: t('Guest'),
    type: 'custom' as const
  },
  {
    key: 'dates',
    label: t('Dates'),
    type: 'custom' as const
  },
  {
    key: 'totalAmount',
    label: t('Amount'),
    type: 'custom' as const
  },
  {
    key: 'status',
    label: t('Status'),
    type: 'custom' as const
  }
])
const statistics = ref({
  totalReservations: 0,
  arrivals: 0,
  departures: 0,
  inHouse: 0
})
const tableActions = [
  {
    label: t('View'),
    handler: (item: any) => handleBookingAction('view', item),
    variant: 'primary' as const
  },
  {
    label: t('Edit'),
    handler: (item: any) => handleBookingAction('edit', item),
    variant: 'secondary' as const
  },
  {
    label: t('Delete'),
    handler: (item: any) => handleBookingAction('delete', item),
    variant: 'danger' as const
  }
]

// Computed properties
const filteredReservations = computed(() => {
  let filtered = [...reservations.value]

  // Sort reservations
  filtered.sort((a, b) => {
    const aValue = a[sortBy.value as keyof ReservationType]
    const bValue = b[sortBy.value as keyof ReservationType]

    if (sortBy.value === 'date' || sortBy.value === 'dateD') {
      return new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue
    }

    return 0
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredReservations.value.length / pageSize.value)
})

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredReservations.value.slice(start, end)
})

// Methods
const applyFilter = async (filter: FitlterItem) => {
  loading.value = true
  console.log('filter:', filter)

  try {
    const res = await filterReservation(serviceStore.serviceId!, filter)

    reservations.value = []
    if (res.status === 200 || res.status === 201) {
      console.log(res.data)

      reservations.value = res.data?.reservations.map((res: any) => {
        const user = res.guest
        const statusClasses = getStatusColor(res.status).split(' ')
        const paymentClasses = getPaymentColor(res.paymentStatus).split(' ')

        return {
          ...res,
          date: res.arrivedDate,
          dateD: res.departDate,
          email: user?.email || '',
          phone: user?.phoneNumber || '',
          userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
          statusColor: {
            label: safeTranslate(res.status),
            bg: statusClasses[0],
            text: statusClasses[1],
          },
          paymentStatusColor: {
            label: safeTranslate(res.paymentStatus),
            bg: paymentClasses[0],
            text: paymentClasses[1],
          },
        }
      });

      statistics.value = res.data.statistics
    }
  } catch (error) {
    console.error('Error filtering reservations:', error)
    toast.error(t('Error loading reservations'))
  } finally {
    loading.value = false
    currentPage.value = 1 // Reset to first page after filtering
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    case 'checked-in':
      return 'bg-purple-100 text-purple-700'
    case 'checked-out':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getPaymentColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700'
    case 'unpaid':
      return 'bg-red-100 text-red-700'
    case 'refunded':
      return 'bg-blue-100 text-blue-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const handleBookingAction = (action: string, booking: any) => {
  if (action === 'edit') {
    router.push({ name: 'EditBooking', params: { id: booking.id } })
  } else if (action === 'delete') {
    selectedReservationId.value = booking.id
    modalShow.value = true
  } else if (action === 'view') {
    router.push({ name: 'reservationDetails', params: { id: booking.id } })
    store.setBooking(booking)
  }
}

const onTableAction = (action: string, item: any) => {
  handleBookingAction(action.toLowerCase(), item)
}

const confirmDelete = async () => {
  if (selectedReservationId.value !== null) {
    loadingDelete.value = true
    try {
      //await deleteReservation(selectedReservationId.value)
      toast.success(t('toast.reservationDelete'))
      reservations.value = reservations.value.filter(
        (r: any) => r.id !== selectedReservationId.value,
      )
    } catch (error) {
      console.error('Error deleting reservation:', error)
      toast.error(t('Error deleting reservation'))
    } finally {
      loadingDelete.value = false
      modalShow.value = false
      selectedReservationId.value = null
    }
  }
}

// Lifecycle
onMounted(async () => {
   filter.value = {
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    searchText: '',
    status: '',
  };
  await applyFilter({
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    searchText: '',
    status: '',
  })
})

const openBookingModal = () => {
  // showBookingModal.value = true
  router.push({ name: 'New Booking' })
}
const refresh = () => {
  if(filter.value)
  applyFilter(filter.value)
}

const handleFilterClick = (filter: string) => {
  // Create filter object based on the clicked statistic
  const filterObj: FitlterItem = {
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    searchText: '',
    status: '',
  }

  // Set specific filter based on the clicked statistic
  switch (filter) {
    case 'arrivals':
      // Filter for today's arrivals
      const today = new Date().toISOString().split('T')[0]
      filterObj.checkInDate = today
      break
    case 'departures':
      // Filter for today's departures
      const todayDeparture = new Date().toISOString().split('T')[0]
      filterObj.checkOutDate = todayDeparture
      break
    case 'inHouse':
      // Filter for checked-in guests
      filterObj.status = 'checked_in'
      break
    case 'totalReservations':
    default:
      // Show all reservations (no specific filter)
      break
  }

  // Store the current filter for refresh functionality
  filter.value = filterObj
  
  // Reset to first page when applying new filter
  currentPage.value = 1
  
  // Apply the filter
  applyFilter(filterObj)
}

</script>

<style scoped>
.grid_a {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .grid_a {
    grid-template-columns: 1fr;
  }
}
</style>
