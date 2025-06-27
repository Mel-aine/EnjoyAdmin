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
import { getServices} from '@/services/api'
import {ref , onMounted} from 'vue'

const serviceStore = useServiceStore();
const serviceName = ref('');

const fetchService = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    console.log("id",serviceId)
    const response = await getServices();

    const foundService = response.data.data.find(
      (service) => service.id === serviceId
    );

    if (foundService) {
      serviceName.value = foundService.name;
    } else {
      serviceName.value = 'Unknown Service';
    }

    console.log("service", foundService);
  } catch (error) {
    console.error('fetch failed:', error);
  }
};


onMounted(() => {
  fetchService();
});
</script>
