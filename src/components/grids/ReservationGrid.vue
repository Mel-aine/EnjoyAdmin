<template>
  <div>
    <!-- Grid Header with Controls -->
    <div class="bg-gray-50 mt-2 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ $t('Reservations') }}</h2>
        <span class="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {{ filteredReservations.length }} {{ $t('reservations') }}
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

        <!-- Sort Dropdown -->
        <select v-model="sortBy"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="date">{{ $t('Sort by Check-in') }}</option>
          <option value="dateD">{{ $t('Sort by Check-out') }}</option>
          <option value="userFullName">{{ $t('Sort by Name') }}</option>
          <option value="totalAmount">{{ $t('Sort by Amount') }}</option>
          <option value="status">{{ $t('Sort by Status') }}</option>
        </select>

        <!-- Add Booking Button -->
        <BasicButton :label="$t('AddBooking')" @click="openBookingModal"  variant="primary"
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
      <div v-for="reservation in paginatedReservations" :key="reservation.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
        <!-- Card Header -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate">
              {{ reservation.userFullName }}
            </h3>
            <div class="flex gap-1">
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                reservation.statusColor.bg,
                reservation.statusColor.text
              ]">
                {{ reservation.statusColor.label }}
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">
            #{{ reservation.reservationNumber }}
          </p>
        </div>

        <!-- Card Body -->
        <div class="p-4 space-y-3">
          <!-- Dates -->
          <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(reservation.date) }}</span>
            <span class="mx-2">→</span>
            <span>{{ formatDate(reservation.dateD) }}</span>
          </div>

          <!-- Contact Info -->
          <div v-if="reservation.email" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="truncate">{{ reservation.email }}</span>
          </div>

          <div v-if="reservation.phone" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{{ reservation.phone }}</span>
          </div>

          <!-- Amount and Payment Status -->
          <div class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(reservation.totalAmount) }}
            </div>
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              reservation.paymentStatusColor.bg,
              reservation.paymentStatusColor.text
            ]">
              {{ reservation.paymentStatusColor.label }}
            </span>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
          <button @click="handleBookingAction('view', reservation)"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ $t('View') }}
          </button>
          <button @click="handleBookingAction('edit', reservation)"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ $t('Edit') }}
          </button>
        </div>
      </div>
    </div>

    <!-- List View (ReusableTable) -->
    <div v-else-if="viewMode === 'list'">
      <ReusableTable :showHeader="false" :columns="tableColumns" :data="paginatedReservations" :actions="tableActions"
        :searchable="false" :empty-state-title="$t('No reservations')"
        :empty-state-message="$t('Get started by creating a new reservation.')" @action="onTableAction">
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
              {{ item.userFullName }}
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
import { filterReservation, deleteReservation } from '@/services/api'
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
      reservations.value = res.data.map((res: any) => {
        const user = res.user
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
      })
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
      await deleteReservation(selectedReservationId.value)
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
  await applyFilter({
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    searchText: '',
    status: '',
  })
})

const openBookingModal =()=>{
  // showBookingModal.value = true
  router.push({ name: 'New Booking' })
}
const refresh =()=>{
 applyFilter(filter)
}
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
