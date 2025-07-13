<template>
  <h2 class="flex items-center text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
    <component :is="icon" class="mr-2 text-blue-600" :size="20" />
    {{ title }}
  </h2>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  icon: any;
  title: string;
}>();
</script>