<template>
  <div class="flex items-center gap-2">

    <!-- Assign Room Button -->
    <button @click.stop="handleAssignRoom" :disabled="isAssigning || !canAssignRoom"
      class=" underline hover:text-primary/25 text-primary text-sm dark:text-purple-300 dark:hover:text-purple-200 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
      {{ $t('AssignRoom')}}
    </button>
  </div>
  <template v-if="isOpen">
    <RoomSelectionModal :is-open="isOpen" ref="roomSelectionModal" :reservation-id="reservation.id" @close="handleClose"
    @refresh="handleRefresh"
    />
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import RoomSelectionModal from '../modal/RoomSelectionModal.vue'
import { useAuthStore } from '@/composables/user'

const authStore = useAuthStore()

interface Props {
  reservation: any
}

interface Emits {
  (e: 'close'): void
  (e: 'assigned', data: any): void
   (e: 'refresh'): void
}
const emit = defineEmits<Emits>()

const props = defineProps<Props>()
const canAssignRoom = computed(() => {
  return authStore.hasPermission('assign_room')
})
const isOpen = ref(false);
const isAssigning = ref(false)

const handleAssignRoom = async () => {
  isOpen.value = true;
}

const handleClose = () => {
  isOpen.value = false;
  emit('close')
}

const handleRefresh =()=>{
  isOpen.value = false;
  emit('assigned',{})
    emit('refresh')
}

</script>

<style scoped>
/* Add any component-specific styles here */
</style>
