<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold">
          {{ $t('select_room') }} - {{ reservation?.guest_name }}
        </h2>
        <button @click="$emit('close')" class="text-white hover:text-gray-200 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Reservation Summary -->
      <div class="bg-gray-50 px-6 py-3 border-b">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-4">
            <span><strong>{{ $t('room_type') }}:</strong> {{ reservation?.room_type }}</span>
            <span><strong>{{ $t('dates') }}:</strong> {{ formatDateRange(reservation?.check_in, reservation?.check_out) }}</span>
            <span><strong>{{ $t('guests') }}:</strong> {{ reservation?.guests }}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="availableRooms.length === 0" class="text-center py-8">
          <Home class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div class="text-gray-500 text-lg">{{ $t('no_available_rooms') }}</div>
          <div class="text-gray-400 text-sm mt-2">{{ $t('no_rooms_available_message') }}</div>
        </div>

        <div v-else class="space-y-3">
          <div class="text-sm text-gray-600 mb-4">
            {{ $t('available_rooms_count', { count: availableRooms.length }) }}
          </div>

          <div 
            v-for="room in availableRooms" 
            :key="room.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            :class="{
              'border-blue-500 bg-blue-50': selectedRoom?.id === room.id,
              'hover:border-gray-300': selectedRoom?.id !== room.id
            }"
            @click="selectRoom(room)"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <!-- Room Number -->
                <div class="flex items-center gap-2">
                  <Home class="w-5 h-5 text-blue-600" />
                  <span class="font-semibold text-lg">{{ room.room_number }}</span>
                </div>

                <!-- Room Details -->
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <Bed class="w-4 h-4" />
                    <span>{{ room.bed_type || 'Standard' }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Users class="w-4 h-4" />
                    <span>{{ room.max_occupancy || 2 }} {{ $t('guests') }}</span>
                  </div>
                  <div v-if="room.floor" class="flex items-center gap-1">
                    <Building class="w-4 h-4" />
                    <span>{{ $t('floor') }} {{ room.floor }}</span>
                  </div>
                </div>
              </div>

              <!-- Selection Indicator -->
              <div class="flex items-center">
                <div 
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="{
                    'border-blue-500 bg-blue-500': selectedRoom?.id === room.id,
                    'border-gray-300': selectedRoom?.id !== room.id
                  }"
                >
                  <Check v-if="selectedRoom?.id === room.id" class="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <!-- Room Features -->
            <div v-if="room.features && room.features.length > 0" class="mt-3 flex flex-wrap gap-2">
              <span 
                v-for="feature in room.features" 
                :key="feature"
                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {{ feature }}
              </span>
            </div>

            <!-- Room Status -->
            <div class="mt-2 flex items-center gap-2">
              <div 
                class="w-2 h-2 rounded-full"
                :class="{
                  'bg-green-500': room.status === 'available',
                  'bg-yellow-500': room.status === 'cleaning',
                  'bg-red-500': room.status === 'maintenance'
                }"
              ></div>
              <span class="text-xs text-gray-500 capitalize">{{ $t(room.status || 'available') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {{ $t('cancel') }}
        </button>
        <button 
          @click="confirmRoomSelection"
          :disabled="!selectedRoom"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {{ $t('assign_room') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { X, Home, Bed, Users, Building, Check } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  reservation: any
  availableRooms: any[]
}

interface Emits {
  (e: 'close'): void
  (e: 'room-selected', data: { roomId: number; roomNumber: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const loading = ref(false)
const selectedRoom = ref<any>(null)

const formatDateRange = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return ''
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

const selectRoom = (room: any) => {
  selectedRoom.value = room
}

const confirmRoomSelection = () => {
  if (selectedRoom.value) {
    emit('room-selected', {
      roomId: selectedRoom.value.id,
      roomNumber: selectedRoom.value.room_number
    })
  }
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