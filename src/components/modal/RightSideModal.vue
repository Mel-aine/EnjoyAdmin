<script setup lang="ts">
import { ref, watch, computed } from 'vue';

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
  size: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full',
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  }
});

const isVisible = ref(false);

// Computed property pour la classe de largeur
const widthClass = computed(() => {
  const widthMap = {
    'sm': 'max-w-sm',    // ~384px
    'md': 'max-w-md',    // ~448px
    'lg': 'max-w-lg',    // ~512px
    'xl': 'max-w-xl',    // ~576px
    '2xl': 'max-w-2xl',  // ~672px
    'full': 'max-w-full' // 100%
  };
  return widthMap[props.size];
});

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
      class="absolute inset-0 bg-transparent bg-opacity-50 transition-opacity duration-300 dark:bg-black/50"
      :class="{
        'opacity-100': isOpen,
        'opacity-0': !isOpen
      }"
      @click="close"
    ></div>

    <!-- Modal panel -->
    <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
      <div
        class="pointer-events-auto relative w-screen transform transition-transform duration-300 ease-in-out"
        :class="[
          widthClass,
          {
            'translate-x-0': isOpen,
            'translate-x-full': !isOpen
          }
        ]"
      >
        <!-- Modal content -->
        <div class="flex h-full flex-col bg-white shadow-xl dark:bg-gray-800 dark:shadow-black/30">
          <!-- Header -->
          <div class="bg-white px-4 py-3 sm:px-6 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <slot name="header">
                  <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100" v-if="title">
                    {{ title }}
                  </h2>
                </slot>
              </div>
              <div class="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
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
          <div class="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 sm:px-6">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 dark:border-gray-700 dark:bg-gray-800" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
@layer utilities {

  /* Chrome, Safari, Edge, Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* IE, Edge, Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
  }
}
</style>
