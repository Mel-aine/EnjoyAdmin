<template>
  <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 shadow-lg relative border-l-4 border-indigo-500 hover:-translate-y-1 transition-all duration-300">
    <h3 class="text-gray-700 font-semibold text-lg flex items-center gap-2 mb-4">
      <span class="text-white bg-gradient-to-r from-indigo-500 to-purple-500 w-6 h-6 flex items-center justify-center rounded-full text-sm">{{ icon }}</span>
      {{ title }}
    </h3>
    <div v-for="(item, index) in items" :key="index" class="flex justify-between py-2 border-b last:border-b-0">
      <span class="text-gray-600 font-medium ">{{ item.label }}</span>
      <span class="text-gray-800 font-semibold ">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  items: { label: string; value: string }[]
}>()
</script>
