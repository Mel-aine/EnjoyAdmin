<template>
  <div class="accordion-container">
    <div
      class="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-50"
      @click="toggleAccordion"
      :class="{ 'bg-purple-50': isOpen, 'bg-gray-50': !isOpen }"
    >
      <span>{{ title }}</span>
      <ChevronDownIcon
        class="w-5 h-5 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>
    <div v-if="isOpen" class="accordion-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '@/icons'

interface Props {
  title: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

const isOpen = ref(props.defaultOpen)

const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
@reference "tailwindcss";
.accordion-container {
  @apply border border-gray-200 rounded-md;
}

.accordion-content {
  @apply p-4 border-t border-gray-200;
}
</style>
