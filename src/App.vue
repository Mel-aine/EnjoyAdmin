 <template> 
  <SpeedInsights />     
  <ThemeProvider>         
    <SidebarProvider>       
      <template v-if="authStore.isFullyAuthenticated && authStore.isPmsSubscriptionBlocked">
        <PopupModal
          :isOpen="true"
          :closable="false"
          :title="$t('subscriptionBlocked.title')"
        >
          <div class="space-y-4">
            <p class="text-sm text-slate-500 dark:text-white whitespace-pre-line">
              {{ $t('subscriptionBlocked.intro') }}
            </p>

            <div class="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-900 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-100">
              <div class="text-sm font-semibold">{{ $t('subscriptionBlocked.goodToKnowTitle') }}</div>
              <ul class="mt-2 list-disc pl-5 text-sm space-y-1">
                <li>{{ $t('subscriptionBlocked.dataSafe') }}</li>
                <li>{{ $t('subscriptionBlocked.accessRestricted') }}</li>
              </ul>
            </div>
          </div>
          <template #footer>
            <div class="w-full px-6 pb-4 flex flex-col gap-2">
              <button
                type="button"
                @click="openSubscriptionRenewal"
                class="w-full px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
              >
                {{ $t('subscriptionBlocked.renewCta') }}
              </button>
              <a
                :href="supportMailtoUrl"
                class="w-full text-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:text-black transition"
              >
                {{ $t('subscriptionBlocked.contactSupport') }}
              </a>
            </div>
          </template>
        </PopupModal>
      </template>
      <template v-else>
        <TopProgressBar />     
        <OverLoading v-if="isCheckoutOverlay" />           
        <RouterView />           
        <ReAuthModal          
          :is-open="isReAuthOpen && authStore.isFullyAuthenticated && !isLoginRoute"  
          @close="handleClose"     
          @success="handleSuccess" 
        />
        <PopupModal
          :isOpen="isExpiringSoonModalOpen"
          :closable="false"
          :title="$t('subscriptionExpiringSoon.title')"
        >
          <div class="space-y-4">
            <p class="text-sm text-slate-500 dark:text-white whitespace-pre-line">
              {{ $t('subscriptionExpiringSoon.message', { days: daysUntilExpiry }) }}
            </p>

            <div class="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-900 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-100">
              <div class="text-sm font-semibold">{{ $t('subscriptionExpiringSoon.countdownTitle') }}</div>
              <div class="mt-2 font-mono text-base">{{ countdownText }}</div>
            </div>
          </div>
          <template #footer>
            <div class="w-full px-6 pb-4 flex justify-end">
              <button
                type="button"
                @click="ackExpiringSoon"
                class="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
              >
                {{ $t('subscriptionExpiringSoon.ok') }}
              </button>
            </div>
          </template>
        </PopupModal>
      </template>
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
import PopupModal from '@/components/modal/PopupModal.vue'
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

const isInitialLoad = ref(true)

watch(
  () => [authStore.isPmsSubscriptionBlocked, isLoginRoute.value] as const,
  ([isBlocked, login]) => {
    if (!isInitialLoad.value) return
    if (isBlocked && login) {
      authStore.forceLogout()
      if (route.path !== '/') {
        router.replace('/')
      }
    }
  },
  { immediate: true },
)

const subscriptionRenewalUrl = computed(() => {
  const sub = authStore.pmsSubscription
  return (
    sub?.renewUrl ||
    sub?.renew_url ||
    sub?.paymentUrl ||
    sub?.payment_url ||
    sub?.portalUrl ||
    sub?.portal_url ||
    `${import.meta.env.VITE_API_URL as string}/billing/portal`
  )
})

const openSubscriptionRenewal = () => {
  const url = subscriptionRenewalUrl.value
  if (!url) return
  window.open(url, '_blank')
}

const supportMailtoUrl = computed(() => {
  const sub = authStore.pmsSubscription
  const email = sub?.supportEmail || sub?.support_email || 'support@enjoypms.com'
  return `mailto:${email}?subject=${encodeURIComponent(t.t('subscriptionBlocked.supportSubject'))}`
})

const MS_PER_DAY = 24 * 60 * 60 * 1000

const nowMs = ref(Date.now())
let expiringSoonIntervalId: number | null = null
const stopExpiringSoonTicker = () => {
  if (expiringSoonIntervalId) {
    clearInterval(expiringSoonIntervalId)
    expiringSoonIntervalId = null
  }
}
const startExpiringSoonTicker = () => {
  stopExpiringSoonTicker()
  nowMs.value = Date.now()
  expiringSoonIntervalId = window.setInterval(() => {
    nowMs.value = Date.now()
  }, 1000)
}

const subscriptionExpiryMs = computed<number | null>(() => {
  const sub = authStore.pmsSubscription
  const raw =
    sub?.endsAt ??
    sub?.ends_at ??
    sub?.expiresAt ??
    sub?.expiredAt ??
    sub?.endDate ??
    sub?.end_date ??
    null
  if (!raw) return null
  const date = raw instanceof Date ? raw : new Date(raw)
  const ms = date.getTime()
  return Number.isNaN(ms) ? null : ms
})

const subscriptionExpiryIso = computed<string | null>(() => {
  return subscriptionExpiryMs.value ? new Date(subscriptionExpiryMs.value).toISOString() : null
})

const remainingMs = computed<number | null>(() => {
  if (!subscriptionExpiryMs.value) return null
  return subscriptionExpiryMs.value - nowMs.value
})

const daysUntilExpiry = computed<number>(() => {
  const ms = remainingMs.value
  if (ms === null) return 0
  return Math.max(0, Math.ceil(ms / MS_PER_DAY))
})

const countdownText = computed<string>(() => {
  const ms = remainingMs.value
  if (ms === null || ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const time = `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
  if (days <= 0) return time
  return `${days}${t.t('subscriptionExpiringSoon.daysAbbrev')} ${time}`
})

const EXPIRING_SOON_SESSION_KEY = 'subscriptionExpiringSoonDismissedFor'
const expiringSoonDismissedFor = ref<string | null>(sessionStorage.getItem(EXPIRING_SOON_SESSION_KEY))
const isExpiringSoonModalOpen = ref(false)

const shouldShowExpiringSoonModal = computed(() => {
  if (isLoginRoute.value) return false
  if (!authStore.isFullyAuthenticated) return false
  if (authStore.isPmsSubscriptionBlocked) return false
  if (authStore.hasPmsSubscription !== true) return false
  if (!remainingMs.value || remainingMs.value <= 0) return false
  if (remainingMs.value > 5 * MS_PER_DAY) return false
  if (subscriptionExpiryIso.value && expiringSoonDismissedFor.value === subscriptionExpiryIso.value) return false
  return true
})

const ackExpiringSoon = () => {
  if (subscriptionExpiryIso.value) {
    expiringSoonDismissedFor.value = subscriptionExpiryIso.value
    sessionStorage.setItem(EXPIRING_SOON_SESSION_KEY, subscriptionExpiryIso.value)
  }
  isExpiringSoonModalOpen.value = false
}

watch(shouldShowExpiringSoonModal, (should) => {
  if (should) isExpiringSoonModalOpen.value = true
}, { immediate: true })

watch(isExpiringSoonModalOpen, (open) => {
  if (open) startExpiringSoonTicker()
  else stopExpiringSoonTicker()
}, { immediate: true })

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
  setTimeout(() => {
    isInitialLoad.value = false
  }, 0)
})

onBeforeUnmount(() => {
  removeActivityListeners()
  clearIdleTimer()
  stopExpiringSoonTicker()
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
  router.go(0)
}


</script>
<style>
@reference "tailwindcss";
</style>
