
<template>
  <div class="flex items-center justify-center">
    <div class="flex space-x-2 ">
      <div class="w-2 h-2 bg-blue-500 rounded-full spinner-dot-animation spinner-dot-1"></div>
      <div class="w-2 h-2 bg-blue-500 rounded-full spinner-dot-animation spinner-dot-2"></div>
      <div class="w-2 h-2 bg-blue-500 rounded-full spinner-dot-animation spinner-dot-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No specific script logic is needed for this simple presentation component.
// If you were to add props for customization (e.g., color, size),
// they would be defined here using `defineProps`.
</script>

<style scoped>
/* Custom CSS for the bouncing animation, scoped to this component */
@keyframes bounce-delay {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}

.spinner-dot-animation {
  animation: bounce-delay 1.4s infinite ease-in-out both;
}

.spinner-dot-1 {
  animation-delay: -0.32s;
}

.spinner-dot-2 {
  animation-delay: -0.16s;
}

.spinner-dot-3 {
  animation-delay: 0s;
}
</style>