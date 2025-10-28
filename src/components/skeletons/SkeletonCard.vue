<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100/70 dark:border-gray-700 animate-pulse flex flex-col justify-between',
      heightClass,
    ]"
  >
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center space-x-2 mb-2">
        <div class="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    <!-- Guest Info -->
    <div class="mb-3 p-2 bg-blue-50 dark:bg-blue-900 rounded-lg space-y-2" v-if="showGuestInfo">
      <div class="h-4 w-40 bg-blue-100 dark:bg-blue-800 rounded"></div>
      <div class="h-3 w-24 bg-blue-100 dark:bg-blue-800 rounded"></div>
    </div>

    <!-- Equipment -->
    <div class="mb-4" v-if="showEquipment">
      <div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 mb-3 rounded"></div>
      <div class="flex flex-wrap gap-2">
        <div class="h-6 w-20 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
        <div class="h-6 w-16 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
        <div class="h-6 w-24 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-gray-100/70 dark:border-gray-700 space-y-4">
      <div class="flex items-center justify-between">
        <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div class="">
        <div class="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  height: {
    type: String,
    default: 'min-h-[420px]',
  },
  showGuestInfo: {
    type: Boolean,
    default: true,
  },
  showEquipment: {
    type: Boolean,
    default: true,
  },
});

const heightClass = props.height;
</script>
