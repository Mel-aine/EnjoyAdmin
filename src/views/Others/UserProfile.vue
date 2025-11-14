<template>
  <admin-layout>
    <StaffDetailsPage v-if="authStore.user" :user="authStore.user" />
  </admin-layout>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'
import { useAuthStore } from '@/composables/user'

import StaffDetailsPage from '../StaffManagement/StaffDetailsPage.vue'

const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'))

const authStore = useAuthStore()
const userId = computed(() => authStore.user?.id)

</script>
