<script setup lang="ts">
const props = defineProps(['cardTitle'])
</script>

<template>
  <div class="rounded-2xl bg-white shadow-xl dark:bg-gray-800">
    <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div class="flex items-center gap-3">
        <slot name="button" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ props.cardTitle }}
        </h3>
      </div>
      <slot name="header" class="w-full" />
    </div>
    <div class="p-4">
      <slot />
    </div>
    <slot name="footer">

    </slot>
  </div>
</template>
