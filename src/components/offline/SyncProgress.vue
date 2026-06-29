<template>
  <Transition name="fade-slide">
    <div
      v-if="visible"
      class="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm"
      :class="variantStyles"
    >
      <!-- Spinner -->
      <svg
        class="h-5 w-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>

      <!-- Message -->
      <div class="flex-1 text-sm font-medium">
        <p>{{ title }}</p>
        <p v-if="subtitle" class="mt-0.5 text-xs opacity-80">{{ subtitle }}</p>
      </div>

      <!-- Progress bar -->
      <div
        v-if="showProgress"
        class="h-2 w-24 overflow-hidden rounded-full bg-white/30"
      >
        <div
          class="h-full rounded-full bg-white transition-all duration-500 ease-out"
          :style="{ width: progress + '%' }"
        />
      </div>

      <!-- Close button -->
      <button
        v-if="dismissible"
        @click="$emit('dismiss')"
        class="rounded-md p-1 transition-colors hover:bg-white/20"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  visible: boolean
  title: string
  subtitle?: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  showProgress?: boolean
  progress?: number
  dismissible?: boolean
}>(), {
  variant: 'info',
  showProgress: false,
  progress: 0,
  dismissible: false,
})

defineEmits<{
  dismiss: []
}>()

const variantStyles = computed(() => {
  const styles: Record<string, string> = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-600 text-white',
  }
  return styles[props.variant] || styles.info
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
