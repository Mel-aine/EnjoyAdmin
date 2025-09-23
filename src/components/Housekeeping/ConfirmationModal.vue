<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 h-full w-full bg-black/25 bg-opacity-50" @click="handleCancel"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 pt-6 pb-4">
          <div class="flex items-center">
            <!-- Icon based on variant -->
            <div
              :class="[
                'flex h-12 w-12 items-center justify-center rounded-full',
                variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100',
              ]"
            >
              <svg
                v-if="variant === 'danger'"
                class="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <svg
                v-else
                class="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ title }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 pb-4">
          <p class="text-sm text-gray-500">
            {{ message }}
          </p>
        </div>

        <slot name="content"></slot>

        
        <!-- Actions -->
        <div class="flex gap-3 px-6 py-4 bg-gray-50">
          <!-- Bouton Cancel -->
          <button
            type="button"
            class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            @click="handleCancel"
            :disabled="props.loading"
          >
            {{ cancelText }}
          </button>

          <!-- Bouton Confirm -->
          <button
            type="button"
            :disabled="loading"
            :class="[
              'flex-1 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center',
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                props.loading ? 'opacity-70 cursor-not-allowed' : '',
            ]"
            @click="handleConfirm"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span v-if="!props.loading">{{ confirmText }}</span>
            <span v-else>Loading...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger',
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}

// Handle escape key
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCancel()
        }
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  },
)
</script>

<style scoped>
/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
