<template>
  <div class="spinner" />
</template>

<script setup lang="ts">
</script>

<style scoped>
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid white;
  border-top: 2px solid gray;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
<!-- <template>
  <div v-if="loading" class="flex justify-center items-center">
    <div
      :class="[
        'border-4 border-blue-500 border-t-transparent rounded-full animate-spin',
        sizeClass
      ]"
      role="status"
      aria-label="Loading"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'

const props = defineProps<{
  loading: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-5 h-5'
    case 'lg':
      return 'w-16 h-16'
    case 'md':
    default:
      return 'w-10 h-10'
  }
})
</script> -->



