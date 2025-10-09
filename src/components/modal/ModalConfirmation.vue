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
          <!-- Icône jaune avec l'icône de suppression -->
          <div
            class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100"
          >
            <svg
              class="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </div>

          <!-- Titre et message en noir -->
          <h2 class="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {{ title }}
          </h2>
          <p class="text-sm mb-6 text-gray-700 dark:text-gray-300">
            {{ message }}
          </p>

          <!-- Boutons -->
          <div class="flex justify-center gap-4">
            <button
              @click="$emit('confirm')"
              :disabled="isLoading"
              class="font-semibold py-2 px-6 rounded-lg transition bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <span v-if="!isLoading">{{ $t('Confirm') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </button>
            <button
              @click="$emit('close')"
              class="font-semibold py-2 px-6 rounded-lg border transition bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
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