<template>
  <RightSideModal
    :is-open="isOpen"
    :title="`${$t('UnassignedReservations')} - ${formatDate(props.date)}`"
    @close="closeModal"

  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ $t('UnassignedReservations') }} - {{ formatDate(props.date) }}
        </h3>
        <span
          class="px-1 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium"
        >
          {{ unassignedReservations.length }}
          {{ unassignedReservations.length === 1 ? $t('reservationLabel') : $t('reservations') }}
        </span>
      </div>
    </template>

    <!-- Content -->
    <div class="p-5 overflow-y-auto scrollbar-hide max-h-[calc(90vh-120px)]">
      <div v-if="unassignedReservations.length === 0" class="text-center py-8">
        <div class="text-gray-400 dark:text-gray-500 mb-2">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('NoUnassignedReservations') }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
          {{ $t('AllRoomsAssigned') }}
        </p>
      </div>

      <!-- Reservations List -->
      <div v-else class="space-y-3">
        <div
          v-for="reservation in unassignedReservations"
          :key="reservation.id"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
          @click="selectReservation(reservation)"
        >
          <div class="p-4">
            <!-- Header with guest info -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                    {{
                      reservation.guest?.displayName ||
                      reservation.guest?.fullName ||
                      $t('UnknownGuest')
                    }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ reservation.confirmationNumber }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getStatusClass(reservation.status),
                  ]"
                >
                  {{ $t(`${reservation.status}`) }}
                </span>
              </div>
            </div>

            <!-- Reservation Details Grid -->
            <div class="grid grid-cols-2 gap-4 mb-1">
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{{
                    formatDateRange(reservation.checkInDate, reservation.checkOutDate)
                  }}</span>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('Nights') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-gray-100">
                    {{
                      reservation.numberOfNights ||
                      calculateNights(reservation.checkInDate, reservation.checkOutDate)
                    }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span class="text-gray-600 dark:text-gray-400">{{ $t('Guests') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-gray-100">
                    {{ reservation.adults }} {{ $t('adults') }}
                    <template v-if="reservation.children > 0">
                      + {{ reservation.children }} {{ $t('children') }}
                    </template>
                  </span>
                </div>

              </div>
            </div>

            <!-- Room Rooms Info -->
            <div
              v-if="reservation.reservationRooms && reservation.reservationRooms.length > 0"
              class="mb-3"
            >
              <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {{ $t('RequestedRooms') }} ({{ getFilteredRoomsCount(reservation) }})
              </div>
              <div class="space-y-2">
                <div
                  v-for="(room, index) in getFilteredRooms(reservation)"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ getRoomTypeName(room.roomTypeId) }}
                    </span>
                    <span class="text-xs text-orange-600 dark:text-orange-400">
                      ({{ $t('Unassigned') }})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center">
              <button
                @click.stop="assignRoom(reservation)"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ $t('AssignRoom') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Selection Modal -->
    <RoomSelectionModal
      v-if="showRoomSelection"
      :is-open="showRoomSelection"
      :reservation-id="selectedReservation?.id"
      @close="closeRoomSelection"
      @refresh="handleRoomAssigned"
    />

    <template #footer>
      <div class="flex justify-end space-x-2">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {{ $t('Close') }}
        </button>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, computed,onMounted } from 'vue'
import RightSideModal from '../modal/RightSideModal.vue'
import RoomSelectionModal from '../modal/RoomSelectionModal.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { getRoomTypes } from '@/services/roomTypeApi'
import { useI18n } from 'vue-i18n'

interface Props {
  isOpen: boolean
  date: string
  reservations: any[]
  roomTypeId?: number | null
}

interface Emits {
  (e: 'close'): void
  (e: 'room-assigned', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  reservations: () => [],
  roomTypeId: null
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const roomTypes = ref<any[]>([])

// State
const showRoomSelection = ref(false)
const selectedReservation = ref<any>(null)

// Filter to get only unassigned reservations
const unassignedReservations = computed(() => props.reservations)

const closeModal = () => {
  emit('close')
}

const selectReservation = (reservation: any) => {
  console.log('Selected reservation:', reservation)
}

const assignRoom = (reservation: any) => {
  selectedReservation.value = reservation
  showRoomSelection.value = true
}

const closeRoomSelection = () => {
  showRoomSelection.value = false
  selectedReservation.value = null
}

const handleRoomAssigned = () => {
  closeRoomSelection()
  emit('room-assigned', {
    reservation: selectedReservation.value,
    date: props.date,
  })
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatDateLocal = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(num)
}

const formatDateRange = (checkIn: string, checkOut: string) => {
  const checkInDate = new Date(checkIn).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  return `${checkInDate} - ${checkOutDate}`
}

const calculateNights = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getRoomTypeName = (roomTypeId: number) => {
  const roomType = roomTypes.value?.find((rt) => rt.id === roomTypeId)
  return roomType?.roomTypeName || t('UnknownRoomType')
}

const getUnassignedRoomsCount = (reservation: any) => {
  return reservation.reservationRooms?.filter((room: any) => !room.roomId).length || 0
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    inquiry: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    checked_in: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    checked_out: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    no_show: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
  }
  return statusMap[status] || statusMap['inquiry']
}

const fetchRoomTypes = async () => {
  const hotelId = useServiceStore().serviceId
  try {
    const rep = await getRoomTypes(hotelId!)
    roomTypes.value = rep.data.data.data
    console.log('Fetched room types:', roomTypes.value)
  } catch (error) {
    console.error(error)
  }
}
const getFilteredRooms = (reservation: any) => {
  if (!reservation.reservationRooms) return []

  let rooms = reservation.reservationRooms.filter((r: any) => !r.roomId)
  if (props.roomTypeId !== null) {
    rooms = rooms.filter((r: any) => r.roomTypeId === props.roomTypeId)
  }
  console.log('Filtered rooms for reservation', reservation.id, ':', rooms)

  return rooms
}

const getFilteredRoomsCount = (reservation: any) => {
  return getFilteredRooms(reservation).length
}
onMounted(() => {
  fetchRoomTypes()
})

</script>

<style scoped>
/* Custom scrollbar for the modal content */
@layer utilities {

  /* Chrome, Safari, Edge, Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* IE, Edge, Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
  }
}
</style>
