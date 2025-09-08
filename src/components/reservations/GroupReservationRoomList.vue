<template>
  <div class="space-y-3">
    
    <div class="space-y-2">
      <div 
        v-for="(room, index) in rooms" 
        :key="room.id || index"
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
        @click="$emit('room-selected', room)"
      >
        <!-- Room Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h4 class="font-medium text-blue-900 dark:text-blue-100">
                {{ room.guest?.displayName }}
              </h4>
              <!-- Crown icon for principal room (first room) -->
              <CrownIcon 
                v-if="index === 0" 
                class="w-4 h-4 text-yellow-500 fill-current" 
                :title="$t('Primary')"
              />
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              {{ $t('Room') }} {{ index + 1 }}
            </span>
          </div>
        </div>

        <!-- Room Details Grid -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <!-- Room Type -->
          <div>
            <span class="text-gray-600 dark:text-gray-400">{{ $t('roomType') }}</span>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ room.roomType?.roomTypeName || $t('notAssigned') }}
            </p>
          </div>

          <!-- Room Number / Assign Room -->
          <div>
            <span class="text-gray-600 dark:text-gray-400">{{ $t('Room') }}</span>
            <div v-if="room.room?.roomNumber" class="font-medium text-gray-900 dark:text-white">
              {{ room.room.roomNumber }}
            </div>
            <div v-else class="flex items-center gap-2">
              <!-- Placeholder Image -->
              <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <Home class="w-4 h-4 text-gray-400" />
              </div>
              <!-- Assign Room Button -->
              <button 
                @click.stop="openRoomAssignment(room)"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors flex items-center gap-1"
              >
                <Plus class="w-3 h-3" />
                {{ $t('assignRoom') }}
              </button>
            </div>
          </div>

          <!-- Passengers -->
          <div>
            <span class="text-gray-600 dark:text-gray-400">{{ $t('adult/child') }}</span>
            <div class="flex items-center gap-2">
              <div class="flex items-center">
                <Adult class="w-4 h-4 mr-1" />
                <span class="font-medium text-gray-900 dark:text-white">{{ room.adults || 0 }}</span>
              </div>
              <div class="flex items-center">
                <Child class="w-4 h-4 mr-1" />
                <span class="font-medium text-gray-900 dark:text-white">{{ room.children || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Rate Plan -->
          <div>
            <span class="text-gray-600 dark:text-gray-400">{{ $t('ratePlan') }}</span>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ room.roomRates?.rateType?.rateTypeName || $t('notAvailable') }}
            </p>
          </div>
        </div>

        <!-- Room Rate -->
        <div class="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('roomRate') }}</span>
            <span class="font-semibold text-blue-900 dark:text-blue-100">
              {{ formatCurrency(room.roomRate || 0) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Selection Modal -->
    <RoomSelectionModal
      :is-open="showRoomSelectionModal"
      :reservation="selectedReservationRoom"
      :available-rooms="availableRooms"
      @close="closeRoomSelection"
      @room-selected="handleRoomSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatCurrency } from '../utilities/UtilitiesFunction'
import Adult from '../../icons/Adult.vue'
import Child from '../../icons/Child.vue'
import StaredIcon from '../../icons/StaredIcon.vue'
import { CrownIcon, Home, Plus } from 'lucide-vue-next'
import RoomSelectionModal from '../modal/RoomSelectionModal.vue'

interface Room {
  id?: number
  reservationNumber?: string
  roomType?: {
    roomTypeName: string
  }
  room?: {
    roomNumber: string
  }
  guest?: {
    displayName?: string
    firstName?: string
    lastName?: string
  }
  adults?: number
  children?: number
  roomRates?: {
    rateType?: {
      rateTypeName: string
    }
  }
  roomRate?: number
}

interface Props {
  rooms: Room[]
}

interface Emits {
  (e: 'room-selected', room: Room): void
  (e: 'room-assigned', data: { roomId: number; roomNumber: string; reservationRoom: Room }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

// Room assignment modal state
const showRoomSelectionModal = ref(false)
const selectedReservationRoom = ref<Room | null>(null)
const availableRooms = ref<any[]>([])

// Mock function to get available rooms - replace with actual API call
const getAvailableRoomsForRoomType = async (roomTypeId: string) => {
  // TODO: Replace with actual API call
  return [
    {
      id: 101,
      room_number: '101',
      bed_type: 'King',
      max_occupancy: 2,
      floor: 1,
      status: 'available',
      features: ['WiFi', 'AC', 'TV']
    },
    {
      id: 102,
      room_number: '102',
      bed_type: 'Queen',
      max_occupancy: 2,
      floor: 1,
      status: 'available',
      features: ['WiFi', 'AC', 'TV', 'Balcony']
    },
    {
      id: 201,
      room_number: '201',
      bed_type: 'King',
      max_occupancy: 2,
      floor: 2,
      status: 'available',
      features: ['WiFi', 'AC', 'TV', 'Ocean View']
    }
  ]
}

const openRoomAssignment = async (room: Room) => {
  selectedReservationRoom.value = room
  
  try {
    // Get available rooms for the room type
    availableRooms.value = await getAvailableRoomsForRoomType(room.roomType?.roomTypeName || '')
    showRoomSelectionModal.value = true
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    // Handle error - show toast or notification
  }
}

const closeRoomSelection = () => {
  showRoomSelectionModal.value = false
  selectedReservationRoom.value = null
  availableRooms.value = []
}

const handleRoomSelected = (roomData: { roomId: number; roomNumber: string }) => {
  if (selectedReservationRoom.value) {
    emit('room-assigned', {
      roomId: roomData.roomId,
      roomNumber: roomData.roomNumber,
      reservationRoom: selectedReservationRoom.value
    })
  }
  closeRoomSelection()
}
</script>