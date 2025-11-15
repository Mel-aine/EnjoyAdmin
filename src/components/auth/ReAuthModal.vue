<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import PopupModal from '@/components/modal/PopupModal.vue'
import Spinner from '@/components/spinner/Spinner.vue'
import { auth, startAuthAutoRefresh } from '@/services/api'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'

const emits = defineEmits(['close', 'success'])
const props = defineProps<{ isOpen: boolean }>()

const { t } = useI18n()
const toast = useToast()
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

const authStore = useAuthStore()
const serviceStore = useServiceStore()

// Réinitialiser le formulaire quand la modale s'ouvre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    password.value = ''
    error.value = null
    showPassword.value = false
  }
})

const close = () => {
  // Ne pas permettre de fermer si réauth est requis
  if (authStore.reauthRequired) {
    console.log('⚠️ Impossible de fermer: réauth requis')
    return
  }
  password.value = ''
  error.value = null
  emits('close')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleReAuth = async () => {
  if (!authStore.user?.email) {
    error.value = t('reauth.error.missingEmail')
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const res = await auth({
      email: authStore.user.email,
      password: password.value,
      keepLoggedIn: true,
    })

    const data = res?.data?.data ?? res?.data
    const user = data?.user ?? authStore.user

    const userToken = data?.access_token?.token ??
                      data?.user_token?.token ??
                      data?.token

    if (!userToken) {
      throw new Error(t('reauth.error.generic'))
    }

    // Mettre à jour les services et permissions si présents
    if (data?.userServices) {
      serviceStore.setService(data.userServices)
      serviceStore.setPermissions(data.permissions ?? [])
      if (data.bookingSources) serviceStore.setBookingSources(data.bookingSources)
      if (data.businessSources) serviceStore.setBusinessSources(data.businessSources)
      if (data.reservationTypes) serviceStore.setReservationType(data.reservationTypes)
    }

    authStore.login(user, userToken)
    authStore.setRoleId(user.roleId)
    authStore.setUserId(user.id)

    authStore.setReauthRequired(false)

    // Redémarrer le refresh automatique
    startAuthAutoRefresh()
    toast.success(t('reauth.success'))

    // Fermer la modale
    emits('success')

  } catch (e: any) {
    console.error('❌ Erreur réauthentification:', e)
    authStore.setReauthRequired(true)

    // Extraire le message d'erreur
    const msg =  t('reauth.error.generic') || e?.response?.data?.message || e?.message

    // Afficher l'erreur
    error.value = msg
    toast.error(msg)

  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <PopupModal
    :isOpen="props.isOpen"
    :title="t('reauth.title')"
    :message="t('reauth.message')"
    @close="close"
  >
    <template #footer>
      <div class="w-full px-6 pb-4">
        <!-- ✅ Message d'erreur visible -->
        <div class="mb-3" v-if="error">
          <p class="text-red-600 text-sm font-medium">{{ error }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('Password') }}
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              @keyup.enter="handleReAuth"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
              :placeholder="t('Enteryourpassword')"
            />
            <span
              @click="togglePasswordVisibility"
              class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
            >
              <svg
                v-if="!showPassword"
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                  fill="#98A2B3"
                />
              </svg>
              <svg
                v-else
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                  fill="#98A2B3"
                />
              </svg>
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="close"
            :disabled="authStore.reauthRequired"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('cancel') }}
          </button>
          <button
            @click="handleReAuth"
            :disabled="!password || isLoading"
            class="relative flex items-center justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">{{ t('reauth.reauthenticate') }}</span>
            <span v-else class="flex items-center gap-2">
              <Spinner class="w-4 h-4" />
              {{ t('reauth.processing') }}
            </span>
          </button>
        </div>
      </div>
    </template>
  </PopupModal>
</template>

<style scoped>
</style>
