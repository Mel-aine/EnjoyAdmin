<template>
  <div class="flex items-center">
    <div
      class="w-4 h-4 border rounded mr-2"
      :class="{
        'bg-blue-100 border-blue-300': color === 'blue',
        'bg-red-50 border-red-300': color === 'red',
        'bg-yellow-50 border-yellow-300': color === 'yellow',
        'bg-gray-50 border-gray-200': color === 'gray',
      }"
    ></div>
    <span class="text-sm text-gray-600">{{ $t(label) }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color: 'blue' | 'red' | 'yellow' | 'gray'
  label: string
}>()
</script>
