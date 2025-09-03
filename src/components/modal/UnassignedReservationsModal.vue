<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold">
          {{ $t('unassigned_reservations') }} - {{ formatDate(date) }}
        </h2>
        <button @click="$emit('close')" class="text-white hover:text-gray-200 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div v-if="reservations.length === 0" class="text-center py-8">
          <div class="text-gray-500 text-lg">{{ $t('no_unassigned_reservations') }}</div>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="reservation in reservations" 
            :key="reservation.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <!-- Reservation Details -->
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-3">
                  <div class="flex items-center gap-2">
                    <User class="w-5 h-5 text-blue-600" />
                    <span class="font-semibold text-lg">{{ reservation.guest_name }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatDateRange(reservation.check_in, reservation.check_out) }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">{{ $t('reservation_id') }}:</span>
                    <div class="font-medium">{{ reservation.reservation_number }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500">{{ $t('room_type') }}:</span>
                    <div class="font-medium">{{ reservation.room_type }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500">{{ $t('guests') }}:</span>
                    <div class="font-medium">{{ reservation.guests }} {{ $t('guests') }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500">{{ $t('nights') }}:</span>
                    <div class="font-medium">{{ reservation.nights }} {{ $t('nights') }}</div>
                  </div>
                </div>

                <div v-if="reservation.special_requests" class="mt-3">
                  <span class="text-gray-500 text-sm">{{ $t('special_requests') }}:</span>
                  <div class="text-sm text-gray-700 mt-1">{{ reservation.special_requests }}</div>
                </div>
              </div>

              <!-- Assign Room Button -->
              <div class="ml-4">
                <button 
                  @click="openRoomSelection(reservation)"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Home class="w-4 h-4" />
                  {{ $t('assign_room') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Selection Modal -->
    <RoomSelectionModal
      v-if="showRoomSelection"
      :is-open="showRoomSelection"
      :reservation="selectedReservation"
      :available-rooms="availableRooms"
      @close="closeRoomSelection"
      @room-selected="handleRoomSelection"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { X, User, Calendar, Home } from 'lucide-vue-next'
import RoomSelectionModal from './RoomSelectionModal.vue'
//import { getAvailableRoomsForDate } from '@/services/api'

interface Props {
  isOpen: boolean
  date: string
  reservations: any[]
}

interface Emits {
  (e: 'close'): void
  (e: 'room-assigned', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const showRoomSelection = ref(false)
const selectedReservation = ref<any>(null)
const availableRooms = ref<any[]>([])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateRange = (checkIn: string, checkOut: string) => {
  const checkInDate = new Date(checkIn).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  return `${checkInDate} - ${checkOutDate}`
}

const openRoomSelection = async (reservation: any) => {
  selectedReservation.value = reservation
  
  try {
    // Fetch available rooms for the reservation's room type and dates
  /*  const response = await getAvailableRoomsForDate({
      roomType: reservation.room_type_id,
      checkIn: reservation.check_in,
      checkOut: reservation.check_out
    })
    availableRooms.value = response.data || []*/
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    availableRooms.value = []
  }
  
  showRoomSelection.value = true
}

const closeRoomSelection = () => {
  showRoomSelection.value = false
  selectedReservation.value = null
  availableRooms.value = []
}

const handleRoomSelection = (roomData: any) => {
  emit('room-assigned', {
    reservationId: selectedReservation.value.id,
    roomId: roomData.roomId,
    roomNumber: roomData.roomNumber
  })
  closeRoomSelection()
}
</script>

<style scoped>
/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>