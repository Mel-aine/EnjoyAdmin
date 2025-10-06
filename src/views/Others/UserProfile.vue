<template>
  <admin-layout>
    <StaffDetailsPage v-if="userId" :user-id="userId" />
  </admin-layout>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, reactive, watch, onMounted } from 'vue'
import { useAuthStore } from '@/composables/user'

import StaffDetailsPage from '../StaffManagement/StaffDetailsPage.vue'

const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'))

const authStore = useAuthStore()
const userId = computed(() => authStore.UserId)
</script>
