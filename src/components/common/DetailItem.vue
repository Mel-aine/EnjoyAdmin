<template>
  <div class="flex items-center text-gray-700 mb-2">
    <component :is="icon" class="mr-2 text-gray-500" :size="18" />
    <span class="font-medium">{{ label }}:</span> <span class="ml-1">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  icon: any;
  label: string;
  value: any;
}>();
</script>