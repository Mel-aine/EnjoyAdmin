<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold">BookingFormSuita Demo</h1>
      <button class="btn" @click="modalOpen = true">Open Booking Modal</button>
    </div>
    <BookingFormSuita :is-open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BookingFormSuita from '@/components/reservations/BookingFormSuita.vue'

const modalOpen = ref(true)
</script>

<style scoped>
.btn { @apply h-9 px-4 rounded bg-primary text-white; }
</style>