<template>
  <div class="space-y-6">
    <!-- Room selection section -->
    <div
      v-for="(roomSelection, index) in roomSelections"
      :key="index"
      class="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Room Type -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('SelectRoom') }} {{ roomSelections.length > 1 ? `#${index + 1}` : '' }}
          </label>
          <select

            v-model="roomSelection.roomType"
            @change="handleRoomSelection(index)"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="" disabled>{{ $t('PleaseSelectRoom') }}</option>
            <option v-for="room in availableRooms" :key="room.id" :value="room.id">
              {{ room.label }}
            </option>
          </select>
        </div>

        <!-- Occupancy -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('occupancy') }}
          </label>
          <div class="relative">
            <input
              type="text"
              readonly
              :value="`${roomSelection.adults} ${$t('Adult')}${roomSelection.adults > 1 ? 's' : ''}, ${roomSelection.children} ${$t('Children')}`"
              @click="showOccupancySelector(index)"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-purple-300  focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />

            <div
              v-if="roomSelection.showOccupancyDropdown"
              class="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4"
            >
              <!-- Adults -->
              <div class="mb-3 flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-white">{{ $t('Adult') }}(s)</span>
                <div class="flex items-center gap-2">
                  <button @click.prevent="decrementAdults(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                  <span class="w-6 text-center">{{ roomSelection.adults }}</span>
                  <button @click.prevent="incrementAdults(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
                </div>
              </div>

              <!-- Children -->
              <div class="mb-4 flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-white">{{ $t('Children') }}</span>
                <div class="flex items-center gap-2">
                  <button @click.prevent="decrementChildren(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                  <span class="w-6 text-center">{{ roomSelection.children }}</span>
                  <button @click.prevent="incrementChildren(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
                </div>
              </div>

              <button
                @click.prevent="hideOccupancySelector(index)"
                class="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                {{ $t('Validate') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Room Price -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('RoomPrice') }}
          </label>
          <input
            type="text"
            :value="roomSelection.roomPrice || ''"
            readonly
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
      </div>

      <!-- Remove Room -->
      <div v-if="roomSelections.length > 1" class="mt-4 flex justify-end">
        <button @click.prevent="removeRoom(index)" class="flex items-center text-red-500 hover:text-red-700 text-sm font-medium">
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          {{ $t('RemoveRoom') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Add Room -->
  <div class="flex justify-center mt-6">
    <button @click.prevent="addRoom" class="flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
      {{ $t('AddAnotherRoom') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

interface Room {
  id: string
  label: string
  price: number
  maxOccupancy?: number
}

interface RoomSelection {
  roomType: string
  arrivalDate: string
  departureDate: string
  numberOfNights: number | null
  adults: number
  children: number
  roomPrice: number | null
  dateError: string
  showOccupancyDropdown: boolean
}

const props = defineProps<{
  availableRooms: any[]
  currency?: string
  initialRoomSelections?: RoomSelection[]
  modelValue: {
    type: any[],
    required: true,
  },
}>()


const emit = defineEmits(['update:modelValue', 'update:roomSelections', 'update:totalPrice'])


// const roomSelections = ref<RoomSelection[]>(
//   props.initialRoomSelections?.length
//     ? [...props.initialRoomSelections]
//     : [createEmptyRoomSelection()],
// )

const roomSelections = ref<RoomSelection[]>(
  Array.isArray(props.modelValue) && props.modelValue.length
    ? [...props.modelValue]
    : [createEmptyRoomSelection()]
)




function createEmptyRoomSelection(): RoomSelection {
  return {
    roomType: '',
    arrivalDate: '',
    departureDate: '',
    numberOfNights: null,
    adults: 1,
    children: 0,
    roomPrice: null,
    dateError: '',
    showOccupancyDropdown: false,
  }
}

function addRoom() {
  roomSelections.value.push(createEmptyRoomSelection())
  emit('update:roomSelections', roomSelections.value)
}

function removeRoom(index: number) {
  if (roomSelections.value.length > 1) {
    roomSelections.value.splice(index, 1)
    emit('update:roomSelections', roomSelections.value)
    updateTotalPrice()
  }
}

function handleRoomSelection(index: number) {
  calculateRoomPrice(index)
  emit('update:roomSelections', roomSelections.value)
}

function calculateRoomPrice(index: number) {
  const { roomType } = roomSelections.value[index]
  const selectedRoom = props.availableRooms.find(room => room.id === roomType)

  if (selectedRoom) {
    roomSelections.value[index].roomPrice = selectedRoom.price
  }

  updateTotalPrice()
}

function calculateTotalPrice(): number {
  return roomSelections.value.reduce((sum, r) => sum + (r.roomPrice || 0), 0)
}

function updateTotalPrice() {
  emit('update:totalPrice', calculateTotalPrice())
}

function showOccupancySelector(index: number) {
  roomSelections.value.forEach((room, i) => {
    room.showOccupancyDropdown = i === index
  })
}

function hideOccupancySelector(index: number) {
  roomSelections.value[index].showOccupancyDropdown = false
  emit('update:roomSelections', roomSelections.value)
}

function incrementAdults(index: number) {
  const room = props.availableRooms.find(r => r.id === roomSelections.value[index].roomType)
  const max = room?.maxOccupancy || 4
  const total = roomSelections.value[index].adults + roomSelections.value[index].children

  if (total < max) roomSelections.value[index].adults++
}

function decrementAdults(index: number) {
  if (roomSelections.value[index].adults > 1) roomSelections.value[index].adults--
}

function incrementChildren(index: number) {
  const room = props.availableRooms.find(r => r.id === roomSelections.value[index].roomType)
  const max = room?.maxOccupancy || 4
  const total = roomSelections.value[index].adults + roomSelections.value[index].children

  if (total < max) roomSelections.value[index].children++
}

function decrementChildren(index: number) {
  if (roomSelections.value[index].children > 0) roomSelections.value[index].children--
}

// watch(
//   roomSelections,
//   () => {
//     emit('update:roomSelections', roomSelections.value)
//       // emit('update:modelValue', value)
//   },
//   { deep: true },
// )

watch(
  roomSelections,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      emit('update:modelValue', newVal);
      emit('update:roomSelections', newVal);
      updateTotalPrice();
    }
  },
  { deep: true }
);

</script>
