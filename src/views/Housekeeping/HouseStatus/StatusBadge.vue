<template>
  <div v-if="!status" class="text-center">
    {{ room }}
  </div>
  <div v-else class="flex items-center justify-center">
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
      <span :class="['text-xs font-medium', getTextColor()]">
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
  </div>
</template>

<script setup lang="ts">
import { Bed as BedIcon } from 'lucide-vue-next'

interface StatusBadgeProps {
  room: string
  status: string
  tag?: string
  type: 'red' | 'green' | 'gray' | 'yellow'
}

const props = defineProps<StatusBadgeProps>()

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
</script>
