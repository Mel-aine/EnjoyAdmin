<template>
<IframeView page="/bookings" /> 
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const IframeView = defineAsyncComponent(() => import('./IframeView.vue'))

</script>

<style scoped>
/* Add any custom styles here */
</style>
