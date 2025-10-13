 <template>
  <SpeedInsights />
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
      <ReAuthModal :is-open="isReAuthOpen && authStore.isFullyAuthenticated" @close="handleClose"
        @success="handleSuccess" />
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
import { useRoute } from 'vue-router'
import ReAuthModal from '@/components/auth/ReAuthModal.vue'
import { useAuthStore } from '@/composables/user'
const useLanguage = useLanguageStore();
const t = useI18n({ useScope: "global" });
if (useLanguage.language) {
  t.locale.value = useLanguage.language;
} else {
  useLanguage.set(t.locale.value)
}

// Inactivity tracking (5 minutes)
const IDLE_TIMEOUT_MS = 10 * 60 * 1000
const isReAuthOpen = ref(false)
let idleTimer: number | null = null
const authStore = useAuthStore()

// Prevent showing the re-auth modal on the login page
const route = useRoute()
const isLoginRoute = computed(() => {
  const path = route.path as string
  const name = route.name as string | undefined
  return path === '/' || (name && name.toLowerCase() === 'login') || path.includes('/login')
})

watch(() => [route.name, route.path], () => {
  if (isLoginRoute.value && isReAuthOpen.value) {
    isReAuthOpen.value = false
  }
})

const startIdleTimer = () => {
  clearIdleTimer()
  idleTimer = window.setTimeout(() => {
    // Ouvrir le modal seulement si l’utilisateur est connecté
    if (authStore.isFullyAuthenticated && !isLoginRoute.value) {
      isReAuthOpen.value = true
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
const resetOnActivity = () => {
  // Ne pas réinitialiser pendant que le modal est ouvert
  if (isReAuthOpen.value) return
  startIdleTimer()
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
    // If re-auth was required before refresh, reopen the modal immediately
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

watch(
  () => authStore.isFullyAuthenticated,
  (isAuth) => {
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
  isReAuthOpen.value = false
  startIdleTimer()
}
const handleSuccess = () => {
  isReAuthOpen.value = false
  startIdleTimer()
  // Clear persisted re-auth requirement on successful re-login
  authStore.setReauthRequired(false)
}
</script>
<style>
@reference "tailwindcss";
</style>
