<script setup lang="ts">
import { ref, watch } from 'vue';

const emits = defineEmits(['close', 'open']);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
});

const isVisible = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    isVisible.value = true;
    emits('open');
  } else {
    setTimeout(() => {
      isVisible.value = false;
    }, 300); // Wait for animation to complete
  }
}, { immediate: true });

const close = () => {
  emits('close');
};
</script>

<template>
  <!-- Backdrop -->
  <div
    v-if="isVisible"
    class="absolute inset-0 z-999 overflow-hidden"
    :class="{
      'opacity-100': isOpen,
      'opacity-0': !isOpen
    }"
  >
    <!-- Background overlay -->
    <div
      class="absolute inset-0 bg-transparent bg-opacity-50 transition-opacity duration-300"
      :class="{
        'opacity-100': isOpen,
        'opacity-0': !isOpen
      }"
      @click="close"
    ></div>

    <!-- Modal panel -->
    <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
      <div
        class="pointer-events-auto relative w-screen max-w-md transform transition-transform duration-300 ease-in-out"
        :class="{
          'translate-x-0': isOpen,
          'translate-x-full': !isOpen
        }"
      >
        <!-- Modal content -->
        <div class="flex h-full flex-col bg-white shadow-xl">
          <!-- Header -->
          <div class="bg-white px-4 py-3 sm:px- border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900" v-if="title">
                {{$t (title) }}
              </h2>
              <div class="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="close"
                >
                  <span class="sr-only">Close panel</span>
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>