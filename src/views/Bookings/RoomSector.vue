<template>
  <div class="space-y-6">
    <!-- Room selection section -->
    <div v-for="(roomSelection, index) in roomSelections" :key="index">
      <RoomSectorItem :roomSelection="roomSelection" :index="index" :ActiveRoomTypes="ActiveRoomTypes"
        :availableRooms="availableRooms" :takenRoomIds="availableTakens" @room-change="roomChange"
        :remove-available-rooms="roomSelections.length > 1" :selectedRoomType="selectedRoomType" :service-id="serviceId"
        :arrival-date="arrivalDate" :departure-date="departureDate" @update:remove-room="removeRoom"
        @update:change="selectRoomChange" />
    </div>
  </div>

  <!-- Add Room -->
  <div class="flex justify-center mt-6">
    <button @click.prevent="addRoom"
      class="flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
      {{ $t('AddAnotherRoom') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import RoomSectorItem from './RoomSectorItem.vue'
import { type Room, type RoomSelection } from '@/utils/models'

import type { RoomTypeData } from '@/types/option'


const props = defineProps<{
  ActiveRoomTypes: RoomTypeData[]
  availableRooms: Room[]
  currency?: string
  initialRoomSelections?: RoomSelection[]
  selectedRoomType: RoomTypeData | null
  modelValue: RoomSelection[],
  availableTakens: string[],
  numberOfNights: number,
  serviceId: number,
  arrivalDate: string,
  departureDate: string
}>()

const emit = defineEmits(['update:modelValue', "roomChange", 'update:roomSelections', 'update:totalPrice', 'update:selectedRoomType'])



const roomSelections = ref<RoomSelection[]>(
  Array.isArray(props.modelValue) && props.modelValue.length
    ? [...props.modelValue]
    : [createEmptyRoomSelection()],
)
function createEmptyRoomSelection(): RoomSelection {
  return {
    roomType: '',
    arrivalDate: '',
    departureDate: '',
    roomTypeSelect: 0,
    numberOfNights: props.numberOfNights,
    adults: 1,
    children: 0,
    roomPrice: null,
    dateError: '',
    showOccupancyDropdown: false,
    extra_guest: 0,
    default_deposit: 0,
    default_guest: 0,
    total_guests: 0,
    extraGuestPrice: 0,
    totalPrice: 0,
    totalExtraGuestPrice: 0,
    totalAmount: 0
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
  }
}

const selectRoomChange = (roomSelect: RoomSelection, index: number) => {
  roomSelections.value[index] = roomSelect;
  emit('update:roomSelections', roomSelections.value)
}

const roomChange = (room_id: string) => {
  emit('roomChange', room_id)
}
</script>
