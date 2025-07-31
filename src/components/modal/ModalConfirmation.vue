<template>
  <transition name="fade">
    <div
      class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999"
      aria-modal="true"
      role="dialog"
    >
      <!-- Overlay -->
      <div
        class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[10px]"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Contenu -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative"
      >
        <div class="text-center">
          <!-- Icône dynamique -->
          <div
            :class="[
              'flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full',
              action === 'DANGER' ? 'bg-red-100' : 'bg-blue-100'
            ]"
          >
            <svg
              v-if="action === 'DANGER'"
              class="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
            <svg
              v-else
              class="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
              />
            </svg>
          </div>

          <!-- Titre et message -->
          <h2
            :class="[
              'text-2xl font-semibold mb-2',
              action === 'DANGER'
                ? 'text-red-700 dark:text-red-400'
                : 'text-blue-800 dark:text-blue-300'
            ]"
          >
            {{ title }}
          </h2>
          <p
            :class="[
              'text-sm mb-6',
              action === 'DANGER'
                ? 'text-red-600 dark:text-red-500'
                : 'text-blue-600 dark:text-blue-400'
            ]"
          >
            {{ message }}
          </p>

          <!-- Boutons -->
          <div class="flex justify-center gap-4">
            <button
              @click="$emit('confirm')"
              :disabled="isLoading"
              :class="[
                'font-semibold py-2 px-6 rounded-lg transition',
                action === 'DANGER'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              ]"
            >
              <span v-if="!isLoading">{{ $t('Confirm') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </button>
            <button
              @click="$emit('close')"
              :class="[
                'font-semibold py-2 px-6 rounded-lg border transition',
                action === 'DANGER'
                  ? 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300'
              ]"
            >
              {{ $t('Cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Spinner from '@/components/spinner/Spinner.vue'

defineProps({
  isOpen: Boolean,
  isLoading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    default: 'INFO', // 'DANGER' ou 'INFO'
    validator: (value) => ['DANGER', 'INFO'].includes(value)
  }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>