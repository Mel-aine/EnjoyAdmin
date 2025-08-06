<template>
  <transition name="fade">
    <!-- <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative"> -->

        <!-- Bouton fermer -->
        <!-- <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-orange-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button> -->
    <div class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
            <div
              class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[10px]"
              aria-hidden="true"
              @click="$emit('close')"
        ></div>
        <!-- Contenu -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <div class="text-center">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100">
            <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
          </div>

          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {{ title || $t('confirmDelete') }}
          </h2>

          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ message || ($t('youaresure') + '? ' + $t('thisAction') + '.') }}
          </p>


          <!-- Boutons -->
          <div class="flex justify-center gap-4">
            <button @click="$emit('delete')" :disabled="isLoading"
              class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition">
              <span v-if="!isLoading">{{ $t('yesDelete') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </button>
            <button @click="$emit('close')"
              class="bg-lavender-100 hover:bg-lavender-200 text-orange-600 font-semibold py-2 px-6 rounded-lg border border-orange-200 transition">
              {{ $t('Cancel') }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import Spinner from '@/components/spinner/Spinner.vue';

defineProps({
  isOpen: Boolean,
  isLoading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  }
})

defineEmits(['close', 'delete'])
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
