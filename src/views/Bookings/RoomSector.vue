<template>
  <div class="space-y-6">
    <!-- Room selection section -->
    <div
      v-for="(roomSelection, index) in roomSelections"
      :key="index"
      class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Room Type -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('SelectRoomType') }} {{ roomSelections.length > 1 ? `#${index + 1}` : '' }}
          </label>
          <!-- Room Type Select @change="handleRoomSelection(index)" -->
          <select
            v-model="roomSelections[index].roomTypeSelect"

             @change="emitSelectedRoomType(index)"
            class="h-11 w-full rounded-lg border text-sm"
          >
            <option value="" disabled>{{ $t('PleaseSelectRoomType') }}</option>
            <option v-for="type in ActiveRoomTypes" :key="type.id" :value="type.id">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Room Available -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('SelectRoom') }} {{ roomSelections.length > 1 ? `#${index + 1}` : '' }}
          </label>

          <div>
            <select
              v-model="roomSelections[index].roomType"
              @change="handleRoomSelection(index)"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="" disabled>
                {{
                  getFilteredRooms(index).length
                    ? $t('PleaseSelectRoom')
                    : $t('NoRoomsAvailableForThisType')
                }}
              </option>
              <option v-for="room in getFilteredRooms(index)" :key="room.id" :value="room.id">
                {{ room.label }}
              </option>
            </select>
          </div>


        </div>

        <!-- Occupancy -->
        <!-- <div>
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
              Adults
              <div class="mb-3 flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-white">{{ $t('Adult') }}(s)</span>
                <div class="flex items-center gap-2">
                  <button @click.prevent="decrementAdults(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                  <span class="w-6 text-center">{{ roomSelection.adults }}</span>
                  <button @click.prevent="incrementAdults(index)" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
                </div>
              </div>


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
        </div> -->

        <!-- Room Price -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {{ $t('RoomPrice') }}
          </label>
          <input
            type="text"
            :disabled="true"
            :value="
              roomSelection.roomPrice ??
              availableRooms.find((r) => r.id === roomSelection.roomType)?.price ??
              ''
            "
            readonly
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-white/50"
          />
        </div>
      </div>

      <!-- Remove Room -->
      <div v-if="roomSelections.length > 1" class="mt-4 flex justify-end">
        <button
          @click.prevent="removeRoom(index)"
          class="flex items-center text-red-500 hover:text-red-700 text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-trash2-icon lucide-trash-2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
          {{ $t('RemoveRoom') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Add Room -->
  <div class="flex justify-center mt-6">
    <button
      @click.prevent="addRoom"
      class="flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mr-2"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
      {{ $t('AddAnotherRoom') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

let skipNextUpdate = false

interface Room {
  id: string
  label: string
  price: number
  roomType: number
  roomTypeSelect: number
  maxOccupancy?: number
}

interface RoomSelection {
  roomType: string
  arrivalDate: string
  departureDate: string
  numberOfNights: number | null
  roomTypeSelect: number | null
  adults: number
  children: number
  roomPrice: number | null
  dateError: string
  showOccupancyDropdown: boolean
}

const props = defineProps<{
  ActiveRoomTypes: any[]
  availableRooms: Room[]
  currency?: string
  initialRoomSelections?: RoomSelection[]
  selectedRoomType : number | null
  modelValue: RoomSelection[]
}>()

const emit = defineEmits(['update:modelValue', 'update:roomSelections', 'update:totalPrice','update:selectedRoomType'])



const roomSelections = ref<RoomSelection[]>(
  Array.isArray(props.modelValue) && props.modelValue.length
    ? [...props.modelValue]
    : [createEmptyRoomSelection()],
)
roomSelections.value.forEach((_, index) => {
  calculateRoomPrice(index)
})

console.log('📦 roomSelection :', roomSelections)

function createEmptyRoomSelection(): RoomSelection {
  return {
    roomType: '',
    arrivalDate: '',
    departureDate: '',
    roomTypeSelect: 0,
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



function calculateRoomPrice(index: number) {
  const roomType = roomSelections.value[index].roomType
  const selectedRoom = props.availableRooms.find((room) => room.id === roomType)

  if (selectedRoom) {
    roomSelections.value[index].roomPrice = selectedRoom.price
  } else {
    roomSelections.value[index].roomPrice = null
  }
  updateTotalPrice()
}

function calculateTotalPrice(): number {
  return roomSelections.value.reduce((sum, r) => sum + (r.roomPrice || 0), 0)
}

function updateTotalPrice() {
  emit('update:totalPrice', calculateTotalPrice())
}






watch(
  () => props.modelValue,
  (newVal) => {
    skipNextUpdate = true
    roomSelections.value = [...newVal]
  },
  { deep: true },
)

watch(
  roomSelections,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      emit('update:modelValue', newVal)
      emit('update:roomSelections', newVal)
      updateTotalPrice()
    }
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  (val) => {
    console.log('props.modelValue received in RoomSector:', val)

  },
  { immediate: true, deep: true },
)

watch(
  () => props.modelValue,
  (newVal) => {
    console.log('🔍 modelValue reçu :', JSON.stringify(newVal))
    console.log(
      '📋 availableRooms :',
      props.availableRooms.map((r) => r.id),
    )
  },
  { immediate: true, deep: true },
)

function handleRoomSelection(index: number) {
  const selection = roomSelections.value[index]
  const filteredRooms = getFilteredRooms(index)

  console.log(` handleRoomSelection index ${index}`)
  console.log('roomTypeSelect :', selection.roomTypeSelect)
  console.log('roomType actuel :', selection.roomType)
  console.log('Chambres disponibles pour ce type :', filteredRooms)

  const selectedRoomStillValid = filteredRooms.some((r) => r.id === selection.roomType)
  if (!selectedRoomStillValid) {
    console.log("❌ La chambre sélectionnée n'est plus disponible. Réinitialisation.")
    selection.roomType = ''
    selection.roomPrice = null
  }

  calculateRoomPrice(index)
  emit('update:roomSelections', roomSelections.value)
}

const getFilteredRooms = (index: number) => {
  const selection = roomSelections.value[index]

  console.log(`getFilteredRooms index ${index}`)
  console.log('props.availableRooms:', props.availableRooms)
  console.log('roomSelections[index].roomTypeSelect:', selection.roomTypeSelect)

  const filtered = props.availableRooms.filter((room: any) => {
    const matchesType = Number(room.roomType) === Number(selection.roomTypeSelect)
    const isReserved = room.label?.toLowerCase().includes('réservée')
    return matchesType || isReserved
  })

  console.log('✅ Chambres filtrées :', filtered)

  return filtered
}


function emitSelectedRoomType(index: number) {
  const selectedId = roomSelections.value[index].roomTypeSelect
  const selectedType = props.ActiveRoomTypes.find(t => t.id === selectedId)
    calculateRoomPrice(index)
  console.log('[RoomSector] Emitting selectedRoomType:', selectedType)
  emit('update:selectedRoomType', selectedType)
}
</script>
