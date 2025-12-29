<template>
  <SpeedInsights /> 
  <ThemeProvider>  
    <SidebarProvider>    
      <TopProgressBar />  
      <OverLoading v-if="isCheckoutOverlay" />    
      <RouterView />       
      <ReAuthModal      
        :is-open="isReAuthOpen && authStore.isFullyAuthenticated && !isLoginRoute"  
        @close="handleClose"     
        @success="handleSuccess" 
      />
    </SidebarProvider>   
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
import TopProgressBar from '@/components/spinner/TopProgressBar.vue'
import { isCheckoutOverlay } from '@/composables/spinner'
import {stopAuthAutoRefresh,startAuthAutoRefresh}  from '@/services/api'
const useLanguage = useLanguageStore();
const t = useI18n({ useScope: "global" });
if (useLanguage.language) {
  t.locale.value = useLanguage.language;
} else {
  useLanguage.set(t.locale.value)
}



const IDLE_TIMEOUT_MS = 30 * 60 * 1000


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
const ACTIVITY_DEBOUNCE_MS = 1000

const resetOnActivity = () => {
  // Ne pas réinitialiser si la modale est ouverte ou si réauth est requis
  if (isReAuthOpen.value || authStore.reauthRequired) return

  if (activityDebounceTimer) {
    clearTimeout(activityDebounceTimer)
  }

  activityDebounceTimer = window.setTimeout(() => {
    startIdleTimer()
  }, ACTIVITY_DEBOUNCE_MS)
}


const addActivityListeners = () => {
  activityEvents.forEach((evt) => window.addEventListener(evt, resetOnActivity, { passive: true }))
}

const removeActivityListeners = () => {
  activityEvents.forEach((evt) => window.removeEventListener(evt, resetOnActivity))
}


onMounted(() => {

  if (authStore.isFullyAuthenticated) {
    addActivityListeners()

    // Si réauth était requis avant le refresh de la page
    if (authStore.reauthRequired && !isLoginRoute.value) {
      isReAuthOpen.value = true
    } else {
      startIdleTimer()
    }
  }
})

onBeforeUnmount(() => {
  removeActivityListeners()
  clearIdleTimer()
})


// Dans le watch de isFullyAuthenticated
watch(
  () => authStore.isFullyAuthenticated,
  (isAuth) => {
    if (isAuth) {
      addActivityListeners()

      // Démarrer le refresh automatique
      startAuthAutoRefresh()

      if (authStore.reauthRequired && !isLoginRoute.value) {
        isReAuthOpen.value = true
      } else {
        startIdleTimer()
      }
    } else {
      removeActivityListeners()
      clearIdleTimer()
      stopAuthAutoRefresh()
      isReAuthOpen.value = false
      authStore.setReauthRequired(false)
    }
  },
  { immediate: true }
)

// Surveiller reauthRequired avec plus de détails
watch(() => authStore.reauthRequired, (required) => {

  if (required && authStore.isFullyAuthenticated && !isLoginRoute.value) {
    isReAuthOpen.value = true
    clearIdleTimer()
    stopAuthAutoRefresh()
  } else if (!required) {
    isReAuthOpen.value = false
  }
})
// Surveiller les changements de route
watch(() => [route.name, route.path], () => {
  if (isLoginRoute.value && isReAuthOpen.value) {
    isReAuthOpen.value = false
    authStore.setReauthRequired(false)
  }
})


const handleClose = () => {
  // Ne pas fermer la modale si réauth est toujours requis
  if (authStore.reauthRequired) {
    return
  }

  console.log('✖️ Fermeture de la modale')
  isReAuthOpen.value = false
  startIdleTimer()
}

const handleSuccess = () => {
  authStore.setReauthRequired(false)
  isReAuthOpen.value = false
  startIdleTimer()
}


</script>
<style>
@reference "tailwindcss";
</style>
