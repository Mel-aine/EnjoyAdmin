<template>
  <div v-if="visible" class="fixed top-0 left-0 right-0 z-[100001]">
    <div class="h-[2px] overflow-hidden">
      <div class="bg-purple-600 h-[2px] animate-indeterminate"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { routeProgressVisible } from '@/composables/routeProgress'

const visible = computed(() => routeProgressVisible.value)
</script>

<style scoped>
@keyframes indeterminateBar {
  0% {
    left: -30%;
    width: 30%;
  }
  50% {
    left: 25%;
    width: 50%;
  }
  100% {
    left: 100%;
    width: 20%;
  }
}
.animate-indeterminate {
  position: relative;
  animation: indeterminateBar 1.2s ease-in-out infinite;
}
</style>
