<script setup lang="ts">
import { ref, watch } from 'vue'

const emits = defineEmits(['close', 'open'])
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  maxWidthClass: { type: String, default: 'sm:max-w-md' }
})

const isVisible = ref(false)

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      isVisible.value = true
      emits('open')
    } else {
      setTimeout(() => {
        isVisible.value = false
      }, 300)
    }
  },
  { immediate: true }
)

const close = () => emits('close')
</script>

<template>
  <div v-if="isVisible" class="absolute inset-0 z-999 overflow-hidden">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/30 transition-opacity duration-300"
      :class="{ 'opacity-100': props.isOpen, 'opacity-0': !props.isOpen }"
      @click="close"
    />

    <!-- Drawer -->
    <div class="fixed inset-y-0 right-0 flex max-w-full pl-6">
      <div
        class="pointer-events-auto relative w-screen transform transition-transform duration-300 ease-in-out"
        :class="[props.isOpen ? 'translate-x-0' : 'translate-x-full', props.maxWidthClass]"
      >
        <div class="flex h-full flex-col bg-white shadow-xl dark:bg-gray-800">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 v-if="props.title" class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ props.title }}
            </h2>
            <button
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              @click="close"
            >
              <span class="sr-only">Close panel</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>