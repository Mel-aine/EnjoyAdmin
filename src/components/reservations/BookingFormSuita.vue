<template>
  <RightSideModal :is-open="isOpen" width="900px" @close="$emit('close')">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Quick Reservation</h2>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <button class="btn btn-ghost" @click="showMoreOptions = !showMoreOptions">More Options</button>
        <div class="flex items-center gap-2">
          <BaseButton class="btn" @click="handleConfirm">Confirm</BaseButton>
        </div>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RightSideModal from '@/components/modal/RightSideModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
// We alias to avoid name collision with other useBooking composable
import { useBooking as useBooking2 } from '@/composables/useBooking2'

defineEmits<{ (e: 'close'): void }>()
defineProps<{ isOpen: boolean }>()

const showMoreOptions = ref(false)

const {
  reservation,
  billing,
  numberOfNights,
  reservationTypes,
  businessSources,
  roomTypes,
  getRoomsForRoom,
  getRateTypesForRoom,
  onRoomTypeChange,
  onRateTypeChange,
  onRoomNumberChange,
  onOccupancyChange,
  addRoom,
  formatCurrency,
  saveReservation,
  initialize,
} = useBooking2()

onMounted(() => {
  initialize()
})

function handleRoomTypeChange(room: any, ev: Event) {
  const target = ev.target as HTMLSelectElement
  room.roomType = target.value
  onRoomTypeChange(room.id, target.value)
}

function handleRateTypeChange(room: any, ev: Event) {
  const target = ev.target as HTMLSelectElement
  room.rateType = target.value
  onRateTypeChange(room.id, target.value)
}

function handleRoomNumberChange(room: any, ev: Event) {
  const target = ev.target as HTMLSelectElement
  room.roomNumber = target.value
  onRoomNumberChange(room)
}

async function handleConfirm() {
  await saveReservation()
}
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-2;
}

.btn {
  @apply h-9 px-4 rounded bg-primary text-white;
}

.btn-ghost {
  @apply h-9 px-3 rounded text-gray-700;
}

.btn-outline {
  @apply h-8 px-3 rounded border border-gray-300;
}

.btn-sm {
  @apply h-8 text-sm;
}
</style>