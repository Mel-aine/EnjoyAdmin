<template>
  <div class="border-b border-gray-200 pb-8">
    <button
      type="button"
      @click="$emit('toggle')"
      class="flex items-center justify-between w-full text-left py-3 focus:outline-none group"
    >
      <h3 class="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
        {{ title }}
      </h3>
      <ChevronDown
        :class="[
          'h-5 w-5 text-gray-500 transition-transform duration-300',
          isOpen ? 'rotate-180' : ''
        ]"
      />
    </button>

    <div
      :class="[
        'transition-all duration-300 ease-in-out overflow-hidden',
        isOpen ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
defineProps<{
  title: string;
  isOpen: boolean;
}>();

defineEmits(['toggle']);
</script>
