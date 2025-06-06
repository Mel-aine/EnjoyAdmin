<template>
  <div class="spinner" />
</template>

<script setup>
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

