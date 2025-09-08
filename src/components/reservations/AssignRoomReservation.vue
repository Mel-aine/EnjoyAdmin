<template>
  <div class="flex items-center gap-2">

    <!-- Assign Room Button -->
    <button @click.stop="handleAssignRoom" :disabled="isAssigning"
      class="px-3 py-1 bg-purple-900 hover:bg-purple-900 text-white text-xs rounded-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
      {{ $t('assignRoom')}}
    </button>
  </div>
  <template v-if="isOpen">
    <RoomSelectionModal :is-open="isOpen" ref="roomSelectionModal" :reservation-id="reservation.id" />
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue' 
import RoomSelectionModal from '../modal/RoomSelectionModal.vue'

interface Props {
  reservation: any
}

interface Emits {
  (e: 'refresh'): void
  (e: 'assigned', data: any): void
}

const props = defineProps<Props>()

const isOpen = ref(false);
const isAssigning = ref(false)

const handleAssignRoom = async () => {
  isOpen.value = true;
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>