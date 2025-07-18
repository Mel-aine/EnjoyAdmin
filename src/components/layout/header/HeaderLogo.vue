<template>
  <router-link to="/" class="lg:hidden flex items-center gap-2">
  <!-- Logo en mode clair -->
  <img class="dark:hidden rounded-full w-10" src="/src/assets/images/header/logo2.png" alt="Logo" />



  <!-- Logo en mode sombre -->
  <img class="hidden dark:block rounded-full w-10" src="/src/assets/images/header/logo2.png" alt="Logo" />
    <!-- Texte -->
    <span class="inline-flex text-xl text-purple-500 font-bold">{{ serviceName }}</span>
</router-link>

</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useServiceStore } from '@/composables/serviceStore';
import {computed} from 'vue'

const serviceStore = useServiceStore();
const serviceName = computed(() => {
  return JSON.parse(serviceStore.currentService).name
})
</script>
