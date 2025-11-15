<template>
  <SpeedInsights />
  <ThemeProvider>
    <SidebarProvider>
      <RouterView /> 
      <ReAuthModal
        :is-open="isReAuthOpen && authStore.isFullyAuthenticated && !isLoginRoute"
        @close="handleClose"
        @success="handleSuccess"
      />
    </SidebarProvider>
    <OverLoading v-if="isLoading" /> 
  </ThemeProvider>
</template>
<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import { useI18n } from "vue-i18n";
import { useLanguageStore } from './lang/language';
import { SpeedInsights } from "@vercel/speed-insights/vue"
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute ,useRouter} from 'vue-router'
import ReAuthModal from '@/components/auth/ReAuthModal.vue'
import { useAuthStore } from '@/composables/user'
import OverLoading from '@/components/spinner/OverLoading.vue'
import { isLoading } from '@/composables/spinner'
const useLanguage = useLanguageStore();
const t = useI18n({ useScope: "global" });
if (useLanguage.language) {
  t.locale.value = useLanguage.language;
} else {
  useLanguage.set(t.locale.value)
}



const TOKEN_DURATION_MS = 15 * 60 * 1000  // 15 minutes (doit correspondre au backend)
const IDLE_TIMEOUT_MS = TOKEN_DURATION_MS - (2 * 60 * 1000)  // 13 minutes (15min - 2min de marge)

console.log(`⚙️ Configuration : Token 15min, Inactivité max ${IDLE_TIMEOUT_MS / 60000}min`)

const isReAuthOpen = ref(false)
let idleTimer: number | null = null
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()



// Routes publiques qui ne nécessitent pas d'authentification
const isLoginRoute = computed(() => {
  const path = route.path as string
  const name = route.name as string | undefined
  return path === '/' || (name && name.toLowerCase() === 'login') || path.includes('/login')
})


const startIdleTimer = () => {
  clearIdleTimer()

  // const minutes = Math.floor(IDLE_TIMEOUT_MS / 60000)
  // console.log(`⏰ Timer d'inactivité démarré (${minutes} minutes)`)

  idleTimer = window.setTimeout(() => {
    if (authStore.isFullyAuthenticated && !isLoginRoute.value && !isReAuthOpen.value) {
      console.log('⏰ Timeout d\'inactivité atteint → Demande de réauthentification')
      authStore.setReauthRequired(true)
    }
  }, IDLE_TIMEOUT_MS)
}

const clearIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }
}


const activityEvents = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart', 'wheel']
let activityDebounceTimer: number | null = null
const ACTIVITY_DEBOUNCE_MS = 1000 // Ne redémarrer le timer qu'une fois par seconde

const resetOnActivity = () => {
  // Ne pas réinitialiser si la modale est ouverte ou si réauth est requis
  if (isReAuthOpen.value || authStore.reauthRequired) return

  // Debounce : éviter de redémarrer le timer à chaque mouvement
  if (activityDebounceTimer) {
    clearTimeout(activityDebounceTimer)
  }

  activityDebounceTimer = window.setTimeout(() => {
    startIdleTimer()
  }, ACTIVITY_DEBOUNCE_MS)
}


const addActivityListeners = () => {
  activityEvents.forEach((evt) => window.addEventListener(evt, resetOnActivity, { passive: true }))
  console.log('👂 Écouteurs d\'activité ajoutés')
}

const removeActivityListeners = () => {
  activityEvents.forEach((evt) => window.removeEventListener(evt, resetOnActivity))
  console.log('🔇 Écouteurs d\'activité retirés')
}


onMounted(() => {
  // console.log('🚀 App monté, état auth:', {
  //   isAuth: authStore.isFullyAuthenticated,
  //   reauthRequired: authStore.reauthRequired,
  //   isLoginRoute: isLoginRoute.value
  // })

  if (authStore.isFullyAuthenticated) {
    addActivityListeners()

    // Si réauth était requis avant le refresh de la page
    if (authStore.reauthRequired && !isLoginRoute.value) {
      console.log('🔐 Réauth requis au montage, ouverture de la modale')
      isReAuthOpen.value = true
    } else {
      startIdleTimer()
    }
  }
})

onBeforeUnmount(() => {
  console.log('👋 App unmounting, nettoyage')
  removeActivityListeners()
  clearIdleTimer()
})
// Surveiller les changements de route
watch(() => [route.name, route.path], () => {
  if (isLoginRoute.value && isReAuthOpen.value) {
    console.log('🚪 Page de login détectée, fermeture de la modale')
    isReAuthOpen.value = false
    authStore.setReauthRequired(false)
  }
})

// Surveiller le flag reauthRequired
watch(() => authStore.reauthRequired, (required) => {
  console.log('🔔 reauthRequired changé:', required)

  if (required && authStore.isFullyAuthenticated && !isLoginRoute.value) {
    console.log('🔐 Ouverture de la modale de réauthentification')
    isReAuthOpen.value = true
    clearIdleTimer() // Arrêter le timer pendant la modale
  } else if (!required) {
    isReAuthOpen.value = false
  }
})

// Surveiller l'état d'authentification
watch(
  () => authStore.isFullyAuthenticated,
  (isAuth) => {
    console.log('👤 isFullyAuthenticated changé:', isAuth)

    if (isAuth) {
      addActivityListeners()
      if (authStore.reauthRequired && !isLoginRoute.value) {
        isReAuthOpen.value = true
      } else {
        startIdleTimer()
      }
    } else {
      removeActivityListeners()
      clearIdleTimer()
      isReAuthOpen.value = false
      authStore.setReauthRequired(false)
    }
  }
)

const handleClose = () => {
  // Ne pas fermer la modale si réauth est toujours requis
  if (authStore.reauthRequired) {
    console.log('⚠️ Fermeture refusée, réauth toujours requis')
    return
  }

  console.log('✖️ Fermeture de la modale')
  isReAuthOpen.value = false
  startIdleTimer()
}

const handleSuccess = () => {
  console.log('✅ Réauth réussie, redémarrage du timer')
  authStore.setReauthRequired(false)
  isReAuthOpen.value = false
  startIdleTimer()
}


</script>
<style>
@reference "tailwindcss";
</style>
