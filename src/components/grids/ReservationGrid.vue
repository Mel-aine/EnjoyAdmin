<template>
  <div>
    <!-- Grid Header with Controls -->
    <div
      class="bg-white shadow-lg dark:bg-gray-800 mt-2 mb-4 flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 p-3 rounded-lg">
      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ $t('reservations') }}
        </h2>
        <span class="cursor-pointer text-sm px-3 py-2 rounded-full transition-all duration-200 hover:shadow-md"
          :class="getFilterBadgeClass('totalReservations')" @click="handleFilterClick('totalReservations')">
          {{ statistics.totalReservations }} {{ statistics.totalReservations > 1 ? $t('reservations'): $t('notices.fields.reservation') }}
        </span>

        <span class="cursor-pointer text-sm px-3 py-2 rounded-full transition-all duration-200 hover:shadow-md"
          :class="getFilterBadgeClass('arrivals')" @click="handleFilterClick('arrivals')">
          {{ statistics.arrivals }} {{statistics.arrivals > 1 ?  $t('arrivals') : $t('arrival') }}
        </span>

        <span class="cursor-pointer text-sm px-3 py-2 rounded-full transition-all duration-200 hover:shadow-md"
          :class="getFilterBadgeClass('departures')" @click="handleFilterClick('departures')">
          {{ statistics.departures }} {{statistics.departures>1? $t('departures') : $t('departure') }}
        </span>

        <span class="cursor-pointer text-sm px-3 py-2 rounded-full transition-all duration-200 hover:shadow-md"
          :class="getFilterBadgeClass('inHouse')" @click="handleFilterClick('inHouse')">
          {{ statistics.inHouse }} {{ $t('in house') }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <!-- Reservation Mode Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button @click="reservationMode = 'all'" :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            reservationMode === 'all'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
          ]">
            {{ $t('All') }}
          </button>
          <button @click="reservationMode = 'single'" :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            reservationMode === 'single'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
          ]">
            <User class="w-4 h-4" />
          </button>
          <button @click="reservationMode = 'group'" :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            reservationMode === 'group'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
          ]">
            <Users class="w-4 h-4" />
          </button>
        </div>

        <!-- View Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button @click="viewMode = 'grid'" :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            viewMode === 'grid'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
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
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
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
          class="transform hover:scale-105" :disabled="!canAddBooking">
        </BasicButton>
        <BookingFilter @filter="applyFilter" />
      </div>
    </div>

    <div v-if="activeFilter !== 'totalReservations'" class="mb-4 flex items-center gap-2">
      <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('bookings.grid.activeFilter') }}:</span>
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
        {{ getActiveFilterLabel() }}
        <button @click="clearFilter"
          class="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="reservation in paginatedReservations" :key="reservation.id">
        <ReservationCardItem :reservation="reservation" @reservation-updated="handleReservationUpdate"
          @save="handleSave" />
      </div>
    </div>

    <!-- List View (ReusableTable) -->
    <div v-else-if="viewMode === 'list'" >
      <ReusableTable :showHeader="false" :columns="tableColumns" :data="paginatedReservations"
        :get-actions="getTableActionsForReservation" :searchable="false" :empty-state-title="$t('No reservations')"
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
            {{ formatCurrency(item.balanceSummary?.totalChargesWithTaxes) }}
          </div>
        </template>

        <!-- Custom column for status -->
        <template #column-status="{ item }">
          <div class="flex-col gap-1 inline-flex">
            <ReservationStatus :status="item.status" />
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
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ getEmptyStateTitle() }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ getEmptyStateMessage() }}
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && filteredReservations.length > 0 && totalPages > 1"
      class="mt-6 flex items-center justify-between">
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

  <!-- Modals -->
  <ModalDelete v-if="modalShow" @close="modalShow = false" @delete="confirmDelete" :isLoading="loadingDelete" />

  <AddBookingModal v-if="showBookingModal" @close="showBookingModal = false" @refresh="refresh" />

  <!-- Cancel Reservation Modal -->
  <template v-if="showCancelModal && selectedReservation">
    <CancelReservation :is-open="showCancelModal" :reservation-id="selectedReservation.id"
      :reservation-data="selectedReservation" @close="showCancelModal = false"
      @cancel-confirmed="handleCancelConfirmed" />
  </template>

  <!-- Void Reservation Modal -->
  <template v-if="showVoidModal && selectedReservation">
    <VoidReservation :is-open="showVoidModal" :reservation-data="selectedReservation" @close="showVoidModal = false"
      :reservation-id="selectedReservation.id" :reservation-number="selectedReservation.reservationNumber"
      @void-confirmed="handleVoidConfirmed" />
  </template>

  <!-- Amend Stay Modal -->
  <template v-if="showAmendModal && selectedReservation">
    <AmendStay :is-open="showAmendModal" :reservation-data="selectedReservation" @close="showAmendModal = false"
      :reservation-id="selectedReservation.id" :reservation-number="selectedReservation.reservationNumber"
      @amend-confirmed="handleAmendConfirmed" :reservation="selectedReservation" />
  </template>

  <!-- NoShow Reservation Modal -->
  <template v-if="showNoShowModal && selectedReservation">
    <NoShowReservation :is-open="showNoShowModal" :reservation-id="selectedReservation.id"
      @close="showNoShowModal = false" @noshow-confirmed="handleNoShowConfirmed" />
  </template>

  <!-- Add Payment Modal -->
  <template v-if="isAddPaymentModalOpen && selectedReservation">
    <AddPaymentModal :reservation-id="selectedReservation.id" :is-open="isAddPaymentModalOpen"
      @close="closeAddPaymentModal" @save="handleSavePayment" />
  </template>

  <!-- Check Out Modal -->
  <template v-if="isCkeckOutModalOpen && selectedReservation">
    <CheckOutReservation :reservation-id="selectedReservation.id" :is-open="isCkeckOutModalOpen"
      @close="closeCheckOutReservationModal" @success="handleCheckOutSuccess" />
  </template>

  <!-- Check In Modal -->
  <template v-if="isCkeckInModalOpen && selectedReservation">
    <CheckInReservation :reservation-id="selectedReservation.id" :is-open="isCkeckInModalOpen"
      @close="closeCheckInReservationModal" @success="handleCheckInSuccess" />
  </template>

  <!-- Unassign Room Modal -->
  <template v-if="isUnAssignModalOpen && selectedReservation">
    <UnAssignRoomReservation :reservation-id="selectedReservation.id" :is-open="isUnAssignModalOpen"
      @close="closeUnAssignReservationModal" @success="handleUnassignSuccess" />
  </template>

  <!-- Print Modal -->
  <template v-if="showPrintModal && selectedReservation">
    <PrintModal :is-open="showPrintModal" :document-data="printDocumentData" @close="showPrintModal = false"
      @print-success="handlePrintSuccess" @print-error="handlePrintError" :reservation-id="selectedReservation.id" />
  </template>

  <!-- Room Move Modal -->
  <template v-if="isRoomMoveModalOpen && selectedReservation">
    <RoomMoveModal :reservation-id="selectedReservation.id" :is-open="isRoomMoveModalOpen" @close="closeRoomMoveModal"
      @success="handleRoomMoveSuccess" />
  </template>

  <!-- Exchange Room Modal -->
  <template v-if="isExchangeRoomModalOpen && selectedReservation">
    <ExchangeRoomModal :reservation-id="selectedReservation.id" :is-open="isExchangeRoomModalOpen"
      @close="closeExchangeRoomModal" @success="handleExchangeSuccess" />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent, watch } from 'vue'
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
import { filterReservation } from '../../services/hotelApi'
import { getReservationById } from '@/services/reservation';
import ReservationCardItem from '../reservations/ReservationCardItem.vue'
import ReservationStatus from '@/components/common/ReservationStatus.vue'
import { Users, User } from 'lucide-vue-next'
import { Eye, List } from 'lucide-vue-next'
import { useAuthStore } from '../../composables/user'
import { ActionIcons } from '@/utils/ActionIcons'
import { useReservation } from '../../composables/useReservation'

// Lazy load modal components
const CancelReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/CancelReseravtion.vue'))
const VoidReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/VoidReservation.vue'))
const AmendStay = defineAsyncComponent(() => import('@/components/reservations/foglio/AmendStay.vue'))
const AddPaymentModal = defineAsyncComponent(() => import('@/components/reservations/foglio/AddPaymentModal.vue'))
const NoShowReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/NoShowReservation.vue'))
const CheckOutReservation = defineAsyncComponent(() => import('@/components/reservations/CheckOutReservation.vue'))
const CheckInReservation = defineAsyncComponent(() => import('@/components/reservations/CheckInReservation.vue'))
const UnAssignRoomReservation = defineAsyncComponent(() => import('@/components/reservations/UnAssignRoomReservation.vue'))
const PrintModal = defineAsyncComponent(() => import('../common/PrintModal.vue'))
const ExchangeRoomModal = defineAsyncComponent(() => import('@/components/reservations/ExchangeRoomModal.vue'))
const RoomMoveModal = defineAsyncComponent(() => import('../modal/RoomMoveModal.vue'))

const showBookingModal = ref(false)
const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
const serviceStore = useServiceStore()
const toast = useToast()
const store = useBookingStore()
const authStore = useAuthStore()

// Initialize the reservation composable
const {
  isCheckingIn,
  isCheckingOut,
  isAmendingStay,
  isMovingRoom,
  isExchangingRoom,
  isStoppingRoomMove,
  isUpdatingInclusionList,
  isMarkingNoShow,
  isVoidingReservation,
  performCheckIn,
  performCheckOut,
  showNoShowModal,
  handleNoShowConfirmed,
  performAvhe: avheReservation
} = useReservation()

// Reactive data
const modalShow = ref(false)
const selectedReservationId = ref<number | null>(null)
const selectedReservation = ref<any>(null)
const loadingDelete = ref(false)
const loading = ref(true)

const viewMode = ref<'grid' | 'list'>('grid')
const reservationMode = ref<'all' | 'single' | 'group'>('all')
const sortBy = ref('date')
const currentPage = ref(1)
const pageSize = ref(12)
const filter = ref<FitlterItem>()
const allReservations = ref<ReservationType[]>([])
const showCancelModal = ref(false)
const showPrintModal = ref(false)
const showVoidModal = ref(false)
const showAmendModal = ref(false)
const isAddPaymentModalOpen = ref(false)
const isCkeckOutModalOpen = ref(false)
const isCkeckInModalOpen = ref(false)
const isExchangeRoomModalOpen = ref(false)
const isRoomMoveModalOpen = ref(false)
const isUnAssignModalOpen = ref(false)
const currentAction = ref<string | null>(null)

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
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

const handleReservationUpdate = (updatedReservation: any) => {
  const index = allReservations.value.findIndex((r) => r.id === updatedReservation.id)
  if (index !== -1) {
    allReservations.value[index] = updatedReservation
  }

  // Si c'est la réservation sélectionnée, la mettre à jour aussi
  if (selectedReservation.value?.id === updatedReservation.id) {
    selectedReservation.value = updatedReservation
  }
}

const handleSave = (data: any) => {
  console.log('Save event:', data)
  if (data.needsRefresh) {
    refresh()
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'XOF',
  }).format(amount)
}

const canAddBooking = computed(() => {
  return authStore.hasPermission('add_reservation')
})

// Table configuration
const tableColumns = computed(() => [
  {
    key: 'reservationNumber',
    label: t('Reservation'),
    type: 'custom' as const,
  },
  {
    key: 'guest',
    label: t('Guest'),
    type: 'custom' as const,
  },
  {
    key: 'dates',
    label: t('Dates'),
    type: 'custom' as const,
  },
  {
    key: 'totalAmount',
    label: t('Amount'),
    type: 'custom' as const,
  },
  {
    key: 'status',
    label: t('Status'),
    type: 'custom' as const,
  },
])

const statistics = ref({
  totalReservations: 0,
  arrivals: 0,
  departures: 0,
  inHouse: 0,
})

// Computed properties
const filteredReservations = computed(() => {
  let filtered = [...allReservations.value]
  filtered = filtered.filter(reservation => reservation.status !== 'voided')

  switch (activeFilter.value) {
    case 'arrivals':
      filtered = filtered.filter(
        (reservation) =>
          isToday(reservation.arrivedDate) &&
          (reservation.status === 'confirmed' || reservation.status === 'checked_in'),
      )
      break
    case 'departures':
      filtered = filtered.filter(
        (reservation) =>
          isToday(reservation.departDate) &&
          (reservation.status === 'checked_in' || reservation.status === 'checked_out'),
      )
      break
    case 'inHouse':
      filtered = filtered.filter((reservation) => isInHouse(reservation))
      break
  }

  if (reservationMode.value === 'single') {
    filtered = filtered.filter((reservation: any) => {
      return !reservation.reservationRooms || reservation.reservationRooms.length === 1
    })
  } else if (reservationMode.value === 'group') {
    filtered = filtered.filter((reservation: any) => {
      return reservation.reservationRooms && reservation.reservationRooms.length > 1
    })
  }

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

const printDocumentData = computed(() => {
  if (!selectedReservation.value) return null

  return {
    reservation: selectedReservation.value,
    guest: selectedReservation.value.guest,
    rooms: selectedReservation.value.reservationRooms,
    totalAmount: selectedReservation.value.totalAmount,
    paidAmount: selectedReservation.value.paidAmount,
    remainingAmount: selectedReservation.value.remainingAmount
  }
})

// Helper functions
const getEmptyStateTitle = () => {
  if (reservationMode.value === 'single') {
    return t('bookings.grid.empty.single.title')
  } else if (reservationMode.value === 'group') {
    return t('bookings.grid.empty.group.title')
  }
  return t('bookings.grid.empty.all.title')
}

const getEmptyStateMessage = () => {
  if (reservationMode.value === 'single') {
    return t('bookings.grid.empty.single.desc')
  } else if (reservationMode.value === 'group') {
    return t('bookings.grid.empty.group.desc')
  }
  return t('bookings.grid.empty.all.desc')
}

// Refresh reservation data from API
const refreshReservationData = async (reservationId: number) => {
  try {
    const updatedReservation = await getReservationById(reservationId)

    // Update in allReservations array
    const index = allReservations.value.findIndex((r: any) => r.id === reservationId)
    if (index !== -1) {
      allReservations.value[index] = {
        ...updatedReservation,
        date: updatedReservation.arrivedDate,
        dateD: updatedReservation.departDate,
        email: updatedReservation.guest?.email || '',
        phone: updatedReservation.guest?.phoneNumber || '',
        userFullName: updatedReservation.guest ?
          `${updatedReservation.guest.firstName} ${updatedReservation.guest.lastName}` : 'Inconnu',
      }
    }

    // Update selected reservation if it's the current one
    if (selectedReservation.value?.id === reservationId) {
      selectedReservation.value = allReservations.value[index]
    }

    return updatedReservation
  } catch (error) {
    console.error('Error refreshing reservation:', error)
    toast.error(t('Error refreshing reservation data'))
    return null
  }
}

// Generic action executor
const executeAction = async (actionId: string, actionFn: () => Promise<void>, loadingMessage?: string, successMessage?: string) => {
  if (currentAction.value) {
    return
  }

  try {
    currentAction.value = actionId

    if (loadingMessage) {
      toast.info(loadingMessage, {
        timeout: 2000,
        hideProgressBar: false
      })
    }

    await actionFn()

    currentAction.value = null

    if (successMessage) {
      toast.success(successMessage)
    }

  } catch (error: any) {
    console.error(`${actionId} error:`, error)
    const errorMessage = error.response?.data?.message ||
      error.message ||
      t(`Failed to ${actionId.replace('_', ' ')}`)
    toast.error(errorMessage)
    currentAction.value = null
  } finally {
    if (currentAction.value === actionId) {
      currentAction.value = null
    }
  }
}

// Auto check-in handler
const performAutoCheckIn = async (reservation: any, availableRoom: any) => {
  const checkInDateTime = new Date().toISOString()
  const checkInPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckInTime: checkInDateTime,
    notes: '',
    keyCardsIssued: 2,
    depositAmount: 0
  }

  await performCheckIn(reservation.id, checkInPayload)
  await refreshReservationData(reservation.id)
}

// Auto check-out handler
const performAutoCheckOut = async (reservation: any, availableRoom: any) => {
  const checkOutDateTime = new Date().toISOString()
  const checkOutPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckOutTime: checkOutDateTime,
    notes: '',
  }

  await performCheckOut(reservation.id, checkOutPayload)
  await refreshReservationData(reservation.id)
}

// Auto unassign handler
const performAutoUnassign = async (reservation: any, availableRoom: any) => {
  try {
    const unassignDateTime = new Date().toISOString()
    const unassignPayload = {
      reservationRooms: [availableRoom.id],
      actualCheckInTime: unassignDateTime,
      notes: ''
    }

    await avheReservation(reservation.id, unassignPayload)
    await refreshReservationData(reservation.id)
  } catch (error) {
    console.error('Unassign error:', error)
  }
}

// Modal handlers
const openAddPaymentModal = () => {
  isAddPaymentModalOpen.value = true
}

const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
}

const openCheckOutReservationModal = () => {
  isCkeckOutModalOpen.value = true
}

const closeCheckOutReservationModal = () => {
  isCkeckOutModalOpen.value = false
}

const openCheckInReservationModal = () => {
  isCkeckInModalOpen.value = true
}

const closeCheckInReservationModal = () => {
  isCkeckInModalOpen.value = false
}

const openUnAssignReservationModal = () => {
  isUnAssignModalOpen.value = true
}

const closeUnAssignReservationModal = () => {
  isUnAssignModalOpen.value = false
}

const closeExchangeRoomModal = () => {
  isExchangeRoomModalOpen.value = false
}

const closeRoomMoveModal = () => {
  isRoomMoveModalOpen.value = false
}

// Success handlers for modals
const handleCancelConfirmed = async (cancelData: any) => {
  showCancelModal.value = false
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleVoidConfirmed = async (voidData: any) => {
  showVoidModal.value = false
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleAmendConfirmed = async (amendData: any) => {
  showAmendModal.value = false
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleNoShowConfirmedLocal = async (noShowData: any) => {
  await handleNoShowConfirmed(noShowData)
  showNoShowModal.value = false
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleSavePayment = async (data: any) => {
  closeAddPaymentModal()
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleCheckInSuccess = async (data: any) => {
  closeCheckInReservationModal()
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleCheckOutSuccess = async (data: any) => {
  closeCheckOutReservationModal()
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleUnassignSuccess = async (data: any) => {
  closeUnAssignReservationModal()
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleExchangeSuccess = async () => {
  closeExchangeRoomModal()
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handleRoomMoveSuccess = async () => {
  closeRoomMoveModal()
  if (selectedReservation.value) {
    await refreshReservationData(selectedReservation.value.id)
  }
}

const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}

// Action handler for table
const handleReservationAction = async (actionId: string, reservation: any) => {
  selectedReservation.value = reservation

  if (actionId === 'view') {
    router.push({
      name: 'ReservationDetails',
      params: { id: reservation.id }
    })
    return
  }

  switch (actionId) {
    case 'add_payment':
      openAddPaymentModal()
      break

    case 'amend_stay':
      showAmendModal.value = true
      break

    case 'cancel_reservation':
      showCancelModal.value = true
      break

    case 'void_reservation':
      showVoidModal.value = true
      break

    case 'check_in':
      const availableRoomsForCheckin = reservation.reservationRooms?.filter((room: any) =>
        !room.actualCheckInTime &&
        room.status !== 'checked_in' &&
        room.status !== 'occupied' &&
        !room.checkedIn
      ) || []

      if (availableRoomsForCheckin.length === 0) {
        toast.info(t('All rooms have already been checked in'))
        return
      } else if (availableRoomsForCheckin.length === 1) {
        await executeAction(
          'check_in',
          () => performAutoCheckIn(reservation, availableRoomsForCheckin[0])
        )
      } else {
        openCheckInReservationModal()
      }
      break

    case 'check_out':
      const availableRoomsForCheckout = reservation.reservationRooms?.filter((room: any) =>
        room.status === 'checked_in'
      ) || []

      if (availableRoomsForCheckout.length === 0) {
        toast.info(t('No rooms available for check-out'))
        return
      } else if (availableRoomsForCheckout.length === 1) {
        await executeAction(
          'check_out',
          () => performAutoCheckOut(reservation, availableRoomsForCheckout[0])
        )
      } else {
        openCheckOutReservationModal()
      }
      break

    case 'unassign_room':
      const availableRoomsForUnassign = reservation.reservationRooms?.filter((room: any) =>
        room.roomId && room.room?.roomNumber
      ) || []

      if (availableRoomsForUnassign.length === 0) {
        toast.info(t('No rooms available for unassignment'))
        return
      } else if (availableRoomsForUnassign.length === 1) {
        await executeAction(
          'unassign_room',
          () => performAutoUnassign(reservation, availableRoomsForUnassign[0])
        )
      } else {
        openUnAssignReservationModal()
      }
      break

    case 'no_show':
      showNoShowModal.value = true
      break

    case 'print':
      showPrintModal.value = true
      break

    case 'room_move':
      isRoomMoveModalOpen.value = true
      break

    case 'exchange_room':
      isExchangeRoomModalOpen.value = true
      break

    default:
      console.log(`Action ${actionId} not handled`)
  }
}

// Methods
const applyFilter = async (filterItem: FitlterItem) => {
  loading.value = true
  console.log('filter:', filterItem)

  try {
    const res = await filterReservation(serviceStore.serviceId!, filterItem)

    if (res.status === 200 || res.status === 201) {
      console.log(res.data)

      const mappedReservations = res.data?.reservations.map((res: any) => {
        const user = res.guest

        return {
          ...res,
          date: res.arrivedDate,
          dateD: res.departDate,
          email: user?.email || '',
          phone: user?.phoneNumber || '',
          userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
        }
      })

      allReservations.value = mappedReservations
      statistics.value = res.data.statistics
    }
  } catch (error) {
    console.error('Error filtering reservations:', error)
    toast.error(t('Error loading reservations'))
  } finally {
    loading.value = false
    currentPage.value = 1
  }
}

const getFilterBadgeClass = (filterType: string) => {
  const isActive = activeFilter.value === filterType

  if (isActive) {
    return 'bg-gray-500 text-white shadow-lg transform scale-105'
  } else {
    return 'text-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
  }
}

const handleBookingAction = (action: string, booking: any) => {
  if (action === 'edit') {
    router.push({ name: 'EditBooking', params: { id: booking.id } })
  } else if (action === 'delete') {
    selectedReservationId.value = booking.id
    modalShow.value = true
  } else if (action === 'view') {
    router.push({ name: 'ReservationDetails', params: { id: booking.id } })
    store.setBooking(booking)
  }
}

const onTableAction = (actionLabel: string, item: any) => {
  // Find the corresponding action from availableActions
  const action = item.availableActions?.find((a: any) => a.label === actionLabel)

  if (action) {
    handleReservationAction(action.action, item)
  } else if (actionLabel.toLowerCase() === 'view') {
    handleReservationAction('view', item)
  } else {
    // Fallback to old behavior
    handleBookingAction(actionLabel.toLowerCase(), item)
  }
}

const confirmDelete = async () => {
  if (selectedReservationId.value !== null) {
    loadingDelete.value = true
    try {
      toast.success(t('toast.reservationDelete'))
      allReservations.value = allReservations.value.filter(
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
  }
})

const openBookingModal = () => {
  router.push({ name: 'New Booking' })
}

const refresh = () => {
  if (filter.value) applyFilter(filter.value)
}

// Watch for external refresh signals from the booking store
watch(
  () => store.shouldRefreshGrid,
  (shouldRefresh) => {
    if (shouldRefresh) {
      refresh()
      store.clearGridRefresh()
    }
  }
)

const activeFilter = ref<string>('totalReservations')

const getActiveFilterLabel = () => {
  switch (activeFilter.value) {
    case 'arrivals':
      return t('TodaysArrivals')
    case 'departures':
      return t('TodaysDepartures')
    case 'inHouse':
      return t('InHouseGuests')
    case 'totalReservations':
    default:
      return t('AllReservations')
  }
}

const isToday = (dateString: string) => {
  if (!dateString) return false
  const today = new Date()
  const date = new Date(dateString)
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

const isInHouse = (reservation: any) => {
  if (!reservation.arrivedDate || !reservation.departDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkInDate = new Date(reservation.arrivedDate)
  checkInDate.setHours(0, 0, 0, 0)

  const checkOutDate = new Date(reservation.departDate)
  checkOutDate.setHours(0, 0, 0, 0)

  return (
    (reservation.status === 'checked_in' || reservation.status === 'checked-in') &&
    checkInDate.getTime() <= today.getTime() &&
    checkOutDate.getTime() > today.getTime()
  )
}

const handleFilterClick = (filterType: string) => {
  activeFilter.value = filterType
  currentPage.value = 1
}

const clearFilter = () => {
  activeFilter.value = 'totalReservations'
  currentPage.value = 1
}


const actionIconMap = ActionIcons.getMap()
const actionColorMap = {
  'view': 'text-blue-600',
  'check_in': 'text-blue-600',
  'check_out': 'text-green-600',
  'add_payment': 'text-green-600',
  'amend_stay': 'text-purple-600',
  'room_move': 'text-orange-600',
  'exchange_room': 'text-indigo-600',
  'stop_room_move': 'text-red-600',
  'inclusion_list': 'text-gray-600',
  'cancel_reservation': 'text-red-600',
  'no_show': 'text-yellow-600',
  'void_reservation': 'text-red-700',
  'unassign_room': 'text-gray-600',
}

// Dynamic table actions based on reservation's available actions
const getTableActionsForReservation = (reservation: any) => {
  if (reservation?.status === 'voided') {
    return []
  }

  const actions = [{
    label: t('View'),
    handler: (item: any) => handleReservationAction('view', item),
    variant: 'primary' as const,
    icon: Eye,
    color: 'text-blue-600'
  }]

  if (reservation?.availableActions) {
    const dynamicActions = reservation.availableActions
      .filter((action: any) => action.available)
      .map((action: any) => {
        const variantMap: Record<string, 'primary' | 'secondary' | 'danger' | 'success'> = {
          'check_in': 'success',
          'check_out': 'success',
          'add_payment': 'success',
          'cancel_reservation': 'danger',
          'void_reservation': 'danger',
          'no_show': 'danger',
          'amend_stay': 'secondary',
          'room_move': 'secondary',
          'exchange_room': 'secondary',
          'unassign_room': 'secondary',
        }

        return {
          label: t(action.label),
          handler: (item: any) => handleReservationAction(action.action, item),
          variant: variantMap[action.action] || 'secondary' as const,
          description: action.description,
          route: action.route,
          icon: actionIconMap[action.action as keyof typeof actionIconMap] || List,
          color: actionColorMap[action.action as keyof typeof actionColorMap] || 'text-gray-600'
        }
      })

    actions.push(...dynamicActions)
  }

  return actions
}
</script>

<style scoped>
@reference "tailwindcss";

.grid_a {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .grid_a {
    grid-template-columns: 1fr;
  }
}
</style>
