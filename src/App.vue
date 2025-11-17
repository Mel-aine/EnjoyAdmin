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
import {
  startAuthAutoRefresh,
  stopAuthAutoRefresh,
  performTokenRefresh,
  getTokenExpiryTime
} from '@/services/api'
const useLanguage = useLanguageStore();
const t = useI18n({ useScope: "global" });
if (useLanguage.language) {
  t.locale.value = useLanguage.language;
} else {
  useLanguage.set(t.locale.value)
}



const TOKEN_DURATION_MS = 15 * 60 * 1000  // 15 minutes (doit correspondre au backend)
const IDLE_TIMEOUT_MS = 20 * 60 * 1000

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
  console.log(' Écouteurs d\'activité ajoutés')
}

const removeActivityListeners = () => {
  activityEvents.forEach((evt) => window.removeEventListener(evt, resetOnActivity))
  console.log(' Écouteurs d\'activité retirés')
}

const refreshOnPageLoad = async () => {
  console.log(' Vérification du token au chargement de la page...')

  const tokenExpiry = getTokenExpiryTime(authStore.tokenData)

  if (!tokenExpiry) {
    console.warn('⚠️ Impossible de déterminer l\'expiration du token')
    return
  }

  const now = Date.now()
  const timeUntilExpiry = tokenExpiry - now
  const minutesLeft = Math.floor(timeUntilExpiry / 60000)

  console.log(`Token expire dans ${minutesLeft} minutes`)

  // Si le token expire dans moins de 5 minutes OU est déjà expiré
  if (timeUntilExpiry < 5 * 60 * 1000) {
    console.log('Token proche de l\'expiration, refresh automatique...')

    try {
      await performTokenRefresh()
      console.log(' Token rafraîchi avec succès au chargement')

      // Démarrer le refresh automatique après succès
      startAuthAutoRefresh()
    } catch (error: any) {
      console.error('❌ Échec du refresh au chargement:', error?.message)

      // Si le refresh échoue, ouvrir la modale sauf si on est sur la page de login
      if (!isLoginRoute.value) {
        console.warn(' Ouverture de la modale de réauth')
        authStore.setReauthRequired(true)
        isReAuthOpen.value = true
      }
      return
    }
  } else {
    console.log('Token encore valide, pas de refresh nécessaire')
    // Démarrer le refresh automatique normalement
    startAuthAutoRefresh()
  }
}

// onMounted avec le nouveau système
onMounted(async () => {

  if (authStore.isFullyAuthenticated && !isLoginRoute.value) {
    // Tenter le refresh au chargement
    await refreshOnPageLoad()

    // Ajouter les écouteurs d'activité
    addActivityListeners()

    // Si réauth était requis avant le refresh de la page
    if (authStore.reauthRequired) {
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
  stopAuthAutoRefresh()
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
    clearIdleTimer()
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
        startAuthAutoRefresh()
      }
    } else {
      removeActivityListeners()
      clearIdleTimer()
      stopAuthAutoRefresh()
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
  startAuthAutoRefresh()
}


</script>
<style>
@reference "tailwindcss";
</style>
