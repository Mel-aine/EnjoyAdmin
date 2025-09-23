<template>
  <div>
    <div v-if="!status" class="text-center">
      {{ room }}
    </div>
    <div v-else class="flex items-center justify-center relative">
      <div
        :class="[
          'flex items-center px-2 py-1 rounded w-full',
          getBgColor()
        ]"
      >
        <BedIcon
          :size="14"
          :class="['mr-1', getTextColor()]"
        />
        <span :class="['text-xs font-medium flex-1', getTextColor()]">
          {{ room }}
          <template v-if="status !== room">
            <span class="mx-1 text-xs">·</span>
            <span class="text-xs">{{ status }}</span>
          </template>
          <template v-if="tag">
            <span class="mx-1 text-xs">·</span>
            <span class="text-xs">{{ tag }}</span>
          </template>
        </span>
      </div>

      <button
        @click="openRemarkModal"
        class="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 z-10"
        title="Ajouter une remarque"
      >
        <MessageSquareMore :size="10" class="text-gray-600 hover:text-blue-600" />
      </button>
    </div>

    <!-- Modal de remarque -->
    <RemarkModal
      :is-open="isRemarkModalOpen"
      :room-name="room"
      :room-id="roomId"
      :room-data="roomData"
      :existingRemarkData="existingRemarkData"
      :housekeeperOptions = "HousekeeperOptions"
      @close="closeRemarkModal"
      @saved="onRemarkSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bed as BedIcon, MessageSquareMore } from 'lucide-vue-next'
import RemarkModal from '@/components/Housekeeping/RemarkModal.vue'

interface StatusBadgeProps {
  room: string
  status: string
  tag?: string
  type: 'red' | 'green' | 'gray' | 'yellow'
  roomId?: string
  HousekeeperOptions: Array<{ value: string; label: string }>
  existingRemarkData?: any
  roomData?: {
    id: string
    roomNumber: string
    roomType?: {
      id: any
      roomTypeName: string
    }
  }
}

const props = defineProps<StatusBadgeProps>()

const emit = defineEmits(['remark-updated'])

// État de la modal de remarque
const isRemarkModalOpen = ref(false)

// Détermine la couleur de fond
const getBgColor = () => {
  switch (props.type) {
    case 'red':
      return 'bg-red-100'
    case 'green':
      return 'bg-green-100'
    case 'yellow':
      return 'bg-yellow-100'
    case 'gray':
      return 'bg-gray-400'
    default:
      return 'bg-gray-100'
  }
}

// Détermine la couleur du texte
const getTextColor = () => {
  switch (props.type) {
    case 'red':
      return 'text-red-600'
    case 'green':
      return 'text-green-600'
    case 'yellow':
      return 'text-yellow-600'
    case 'gray':
    default:
      return 'text-gray-600'
  }
}

// Méthodes pour gérer la modal
const openRemarkModal = () => {
  isRemarkModalOpen.value = true
}

const closeRemarkModal = () => {
  isRemarkModalOpen.value = false
}

const onRemarkSaved = (remark: any) => {
  console.log('Remarque sauvegardée:', remark)
  closeRemarkModal()
  emit('remark-updated')
}
</script>
