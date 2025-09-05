<template>
  <RightSideModal :is-open="isOpen" :title="$t('AssignRoom')" @close="$emit('close')">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('assignRooms') }}</h3>
    </template>

    <!-- Mini Calendar Header -->
    <div class="bg-white border-b mb-4 -mx-4 px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Left Arrow -->
        <button @click="navigateCalendar(-1)" class="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronRight class="w-4 h-4 text-gray-600 transform rotate-180" />
        </button>

        <!-- Date Range Display -->
        <div class="flex items-center gap-2 text-sm">
          <div v-for="(date, index) in getCurrentWeekDates()" :key="index"
            class="flex flex-col items-center px-3 py-2 rounded cursor-pointer transition-colors" :class="{
              'bg-blue-100 text-blue-800': isSelectedDate(date.date),
              'text-gray-600 hover:bg-gray-50': !isSelectedDate(date.date)
            }" @click="selectDate(date.date)">
            <span class="text-xs font-bold">{{ formatDateDisplay(new Date(date.date)).weekday }}</span>
            <span class="text-xs font-medium">{{ formatDateDisplay(new Date(date.date)).day }}</span>
            <span class="text-xs font-semibold">{{ formatDateDisplay(new Date(date.date)).month }}</span>
          </div>
        </div>

        <!-- Right Arrow -->
        <button @click="navigateCalendar(1)" class="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronRight class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-6">
      <div v-if="loading">
        <!-- Skeleton for Room Type Dropdown -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
          </div>
        </div>

        <!-- Skeleton for Guest Card -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <div class="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
                  <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div class="mt-1">
                  <div class="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                </div>
              </div>
              <div class="ml-4">
                <div class="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div class="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
            <div class="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        <!-- Skeleton for Room Type Selection -->
        <div class="mb-4">
          <div class="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
          <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <!-- Skeleton for Room Number Input -->
        <div class="mb-6">
          <div class="h-4 bg-gray-200 rounded w-12 animate-pulse mb-2"></div>
          <div class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <div v-else-if="reservation">
        <div v-for="(res, ind) in reservation.reservationRooms" :key="ind">

          <!-- Guest Card -->
          <div class="border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex  gap-3 justify-start align-top items-start">
                <div class="flex flex-col bg-gray-200 p-2">
                  <div class="gap-1 text-sm text-gray-600 flex flex-col align-middle items-center">
                    <span>{{ formatDateDisplay(new Date(res?.checkInDate)).day }}</span>
                    <span>{{ formatDateDisplay(new Date(res?.checkInDate)).month }}</span>
                  </div>
                  <div class="h-1 bg-gray-300 w-full my-1"></div>
                  <div class="flex items-center justify-between">
                    <div class="text-xs flex flex-col align-middle items-center">
                      <span class="text-gray-600">{{ formatDateDisplay(new Date(res?.checkOutDate)).day }}</span>
                      <span class="text-gray-500 ml-1">{{ formatDateDisplay(new Date(res?.checkOutDate)).month }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-md text-gray-500 flex flex-col justify-between h-full">
                  <span class="text-blue-600 font-medium">{{ res?.guest?.displayName || reservation.guest?.displayName
                  }}</span>
                  <div class="">
                    <div class="text-xs text-gray-500 mb-1 mt-8 ">Room Type</div>
                    <div class="text-sm font-medium">{{ res.roomType?.roomTypeName }}</div>
                  </div>
                </div>

              </div>
            </div>




            <!-- Room Type Selection -->
            <div class="mb-4 mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select :disabled="true"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>{{ res.roomType?.roomTypeName || 'Deluxe Room' }}</option>
              </select>
            </div>

            <!-- Available Rooms Section -->
            <div class="mb-6" v-if="availableRoomsByReservation[ind]?.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
              <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                <button
                  v-for="room in availableRoomsByReservation[ind]"
                  :key="room.id"
                  @click="selectRoom(room, ind)"
                  :class="{
                    'bg-blue-100 border-blue-500 text-blue-700': selectedRoomsByReservation[ind]?.id === room.id,
                    'bg-white border-gray-300 text-gray-700 hover:bg-gray-50': selectedRoomsByReservation[ind]?.id !== room.id
                  }"
                  class="p-3 border rounded-lg text-left transition-colors focus:ring-2 focus:ring-blue-500"
                >
                  <div class="font-medium">{{ room.roomNumber }}</div>
                  <div class="text-xs text-gray-500">{{ room.roomName }}</div>
                  <div class="text-xs" :class="{
                    'text-green-600': room.status === 'available',
                    'text-yellow-600': room.status === 'occupied',
                    'text-red-600': room.status === 'maintenance'
                  }">
                    {{ room.status }}
                  </div>
                </button>
              </div>
            </div>

            <!-- Room Number Input -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('Room') }}</label>
              <input v-model="selectedRoomNumbersByReservation[ind]" type="text" placeholder="201"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-3">
        <button @click="$emit('close')"
          class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
          {{ $t('Cancel') }}
        </button>
        <div class="flex gap-3">

          <button @click="confirmRoomSelection" :disabled="!Object.values(selectedRoomNumbersByReservation).some(roomNumber => roomNumber)"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            {{ $t('Assign Room') }}
          </button>
        </div>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import RightSideModal from './RightSideModal.vue'
import { getReservationDetailsById } from '../../services/reservation'
import { getAvailableRoomsByTypeId } from '../../services/configrationApi'
import { formatDateDisplay } from '@/utils/dateUtils'

interface Props {
  isOpen: boolean
  reservationId: number
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
const selectedRoomNumber = ref<string>('')
const reservation = ref<any>(null)
const currentWeekStart = ref<Date>(new Date())
const selectedDate = ref<string>('')
const availableRoomsByReservation = ref<{[key: number]: any[]}>({}) // Store available rooms per reservation room
const selectedRoomsByReservation = ref<{[key: number]: any}>({}) // Store selected rooms per reservation room
const selectedRoomNumbersByReservation = ref<{[key: number]: string}>({}) // Store room numbers per reservation room

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

// Generate current week dates for mini calendar
const getCurrentWeekDates = () => {
  const dates = []
  const startDate = new Date(currentWeekStart.value)

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push({
      date: date.toISOString().split('T')[0]
    })
  }
  return dates
}

// Navigate calendar by weeks
const navigateCalendar = (direction: number) => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + (direction * 7))
  currentWeekStart.value = newDate
}

// Check if date is selected
const isSelectedDate = (date: string) => {
  return selectedDate.value === date
}

// Select a specific date
const selectDate = (date: string) => {
  selectedDate.value = date
}

// Initialize calendar with check-in date or current date
const initializeCalendar = () => {
  if (reservation.value?.reservationRooms?.length > 0) {
    const checkInDate = new Date(reservation.value.reservationRooms[0].checkInDate)
    // Set to start of week (Monday)
    const dayOfWeek = checkInDate.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    checkInDate.setDate(checkInDate.getDate() + mondayOffset)
    currentWeekStart.value = checkInDate
    selectedDate.value = reservation.value.reservationRooms[0].checkInDate.split('T')[0]
  } else {
    // Default to current week
    const today = new Date()
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    today.setDate(today.getDate() + mondayOffset)
    currentWeekStart.value = today
    selectedDate.value = new Date().toISOString().split('T')[0]
  }
}

const selectRoom = (room: any, reservationRoomIndex: number) => {
  selectedRoomsByReservation.value[reservationRoomIndex] = room
  selectedRoomNumbersByReservation.value[reservationRoomIndex] = room.roomNumber
  
  // Also update the legacy values for backward compatibility
  selectedRoom.value = room
  selectedRoomNumber.value = room.roomNumber
}

const checkIn = () => {
  // Handle check-in logic
  console.log('Check-in clicked')
}

const fetchAvailableRooms = async (reservationRoomIndex: number) => {
  if (!reservation.value || !reservation.value.reservationRooms[reservationRoomIndex]) return
  
  const reservationRoom = reservation.value.reservationRooms[reservationRoomIndex]
  
  try {
    loading.value = true
    const response = await getAvailableRoomsByTypeId(
      reservationRoom.roomType.id,
      reservationRoom.checkInDate,
      reservationRoom.checkOutDate
    )
    availableRoomsByReservation.value[reservationRoomIndex] = response.data.rooms || []
  } catch (error) {
    console.error('Error fetching available rooms:', error)
    availableRoomsByReservation.value[reservationRoomIndex] = []
  } finally {
    loading.value = false
  }
}

const getBookingDetailsById = async () => {
  loading.value = true
  try {
    const id = props.reservationId
    const response = await getReservationDetailsById(Number(id))
    console.log(response)
    reservation.value = response
    
    // Fetch available rooms for each reservation room
    if (response.reservationRooms?.length > 0) {
      for (let i = 0; i < response.reservationRooms.length; i++) {
        await fetchAvailableRooms(i)
      }
    }
  } catch (error) {
    console.error('Error fetching reservation details:', error)
  } finally {
    loading.value = false
  }
}

const confirmRoomSelection = () => {
  // Emit room selection for each reservation room that has a selected room
  const roomSelections = []
  
  if (reservation.value?.reservationRooms) {
    for (let i = 0; i < reservation.value.reservationRooms.length; i++) {
      const selectedRoom = selectedRoomsByReservation.value[i]
      const selectedRoomNumber = selectedRoomNumbersByReservation.value[i]
      
      if (selectedRoom || selectedRoomNumber) {
        roomSelections.push({
          reservationRoomIndex: i,
          reservationRoomId: reservation.value.reservationRooms[i].id,
          roomNumber: selectedRoomNumber || selectedRoom?.roomNumber,
          roomId: selectedRoom?.id || null
        })
      }
    }
  }
  
  emit('room-selected', {
    reservationId: props.reservationId,
    roomSelections: roomSelections
  })
}

// Watch for prop changes
watch(() => props.reservationId, async (newId) => {
  if (newId) {
    await getBookingDetailsById()
    initializeCalendar()
  }
}, { immediate: true })

// Watch for reservation changes to update calendar
watch(() => reservation.value, () => {
  if (reservation.value) {
    initializeCalendar()
  }
})

// Initialize when component mounts
onMounted(() => {
  if (props.reservationId) {
    getBookingDetailsById()
  } else {
    initializeCalendar()
  }
})



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