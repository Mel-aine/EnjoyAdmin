<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="$t('userProfile')" />
<div class="h-screen">
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">{{ $t('profile') }}</h3>
      <profile-card :fullName="fullName"  :Email="Email"/>
      <personal-info-card :email="Email" :firstname="Firstname" :lastname="LastName" :phone="Phone" />
      <!-- <address-card /> -->
    </div>
  </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { defineAsyncComponent,computed} from 'vue'
import { useAuthStore } from '@/composables/user'

const AdminLayout = defineAsyncComponent(() => import('../../components/layout/AdminLayout.vue'))
const PageBreadcrumb = defineAsyncComponent(() => import('@/components/common/PageBreadcrumb.vue'))
const ProfileCard = defineAsyncComponent(() => import('../../components/profile/ProfileCard.vue'))
const PersonalInfoCard = defineAsyncComponent(() => import('../../components/profile/PersonalInfoCard.vue'))
// const AddressCard = defineAsyncComponent(() => import('../../components/profile/AddressCard.vue'))

const authStore = useAuthStore()


const fullName = computed(() => {
  const userData = authStore.user
  const user = JSON.parse(userData);
  return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
})
const Email = computed(() => {
  const userData = authStore.user
  const user = JSON.parse(userData);
  return `${user?.email ?? ''}`
})
const Firstname = computed(() => {
  const userData = authStore.user
  const user = JSON.parse(userData);
  return `${user?.firstName ?? ''}`
})
const LastName = computed(() => {
  const userData = authStore.user
  const user = JSON.parse(userData);
  return `${user?.lastName ?? ''}`
})

const Phone = computed(() => {
  const userData = authStore.user
  const user = JSON.parse(userData);
  return `${user?.phoneNumber ?? ''}`
})

</script>

