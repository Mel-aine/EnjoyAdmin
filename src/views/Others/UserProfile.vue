<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="$t('userProfile')" />
    <div class="h-screen">
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {{ $t('profile') }}
        </h3>
        <profile-card :full-name="fullName" :email="email" />
        <personal-info-card
          :user="parsedUser"
          @updateProfile="saveChanges"
        />
        <!-- <address-card /> -->
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, reactive, watch, onMounted } from 'vue'
import { useAuthStore } from '@/composables/user'
import { updateUser, getUserId } from '@/services/api'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

const AdminLayout = defineAsyncComponent(() => import('../../components/layout/AdminLayout.vue'))
const PageBreadcrumb = defineAsyncComponent(() => import('@/components/common/PageBreadcrumb.vue'))
const ProfileCard = defineAsyncComponent(() => import('../../components/profile/ProfileCard.vue'))
const PersonalInfoCard = defineAsyncComponent(() => import('../../components/profile/PersonalInfoCard.vue'))
// const AddressCard = defineAsyncComponent(() => import('../../components/profile/AddressCard.vue'))

const authStore = useAuthStore()
const { t } = useI18n()
const toast = useToast()
const isLoading = ref(false)

// Computed user from store
const parsedUser = computed(() => {
  try {
    return JSON.parse(authStore.user || '{}')
  } catch (e) {
    return {}
  }
})

const fullName = computed(() =>
  `${parsedUser.value.firstName ?? ''} ${parsedUser.value.lastName ?? ''}`.trim()
)
const email = computed(() => parsedUser.value.email ?? '')
const firstname = computed(() => parsedUser.value.firstName ?? '')
const lastname = computed(() => parsedUser.value.lastName ?? '')
const phone = computed(() => parsedUser.value.phoneNumber ?? '')

// Reactive profile form
const profileData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Watch store updates → update profileData
watch(
  () => authStore.user,
  (newUserRaw: any) => {
    const user = JSON.parse(newUserRaw || '{}')
    profileData.firstName = user.firstName || ''
    profileData.lastName = user.lastName || ''
    profileData.email = user.email || ''
    profileData.phone = user.phoneNumber || ''
  },
  { immediate: true }
)

// Watch profileData → update store
watch(
  profileData,
  (newProfile: any) => {
    const user = JSON.parse(authStore.user || '{}')
    user.firstName = newProfile.firstName
    user.lastName = newProfile.lastName
    user.email = newProfile.email
    user.phoneNumber = newProfile.phone
    authStore.user = JSON.stringify(user)
  },
  { deep: true }
)

const saveChanges = async (updatedData: {
  firstname: string
  lastname: string
  email: string
  phone: string
}) => {
  profileData.firstName = updatedData.firstname
  profileData.lastName = updatedData.lastname
  profileData.email = updatedData.email
  profileData.phone = updatedData.phone

  const id = authStore.UserId
  isLoading.value = true

  try {
    const payload = {
      first_name: updatedData.firstname,
      last_name: updatedData.lastname,
      email: updatedData.email,
      phone_number: updatedData.phone
    }

    console.log('payloadUser:', payload)

    const response = await updateUser(id, payload)
    console.log('response:', response)
    authStore.user = JSON.stringify(response.data)

    toast.success(t('toast.userUpdatedSuccess'))
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error(t('toast.updateError'))
  } finally {
    isLoading.value = false
  }
}


// On mount: fetch and update store + profile
onMounted(async () => {
  const id = authStore.UserId
  const response = await getUserId(id)
const userData = response.data
authStore.user = JSON.stringify(userData)

profileData.firstName = userData.firstName || ''
profileData.lastName = userData.lastName || ''
profileData.email = userData.email || ''
profileData.phone = userData.phoneNumber || ''

})



</script>
