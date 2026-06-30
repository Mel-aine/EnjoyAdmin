<template>
  <SpeedInsights />
  <ThemeProvider>
    <SidebarProvider>
      <template v-if="authStore.isFullyAuthenticated && authStore.isPmsSubscriptionBlocked">
        <SubscriptionBlockedModal :isOpen="true" :supportMailtoUrl="supportMailtoUrl"
          @renew="openSubscriptionRenewal" />
      </template>
      <template v-else>
        <InitialLoadProgress />
        <ConflictResolutionModal
          :visible="offlineStore.isConflictModalVisible"
          :conflict="currentConflict"
          @close="offlineStore.closeConflictModal()"
          @resolved="onConflictResolved"
        />
        <MaintenanceBanner :visible="authStore.isFullyAuthenticated && !isLoginRoute && !!maintenanceAnnouncement"
          :typeLabel="maintenanceTypeLabel" :windowText="maintenanceAnnouncementWindowText"
          :title="maintenanceAnnouncementTitle" :content="maintenanceAnnouncementContent"
          @dismiss="dismissMaintenanceAnnouncement" />
        <TopProgressBar />
        <OverLoading v-if="isCheckoutOverlay" />
        <RouterView />
        <ReAuthModal :is-open="isReAuthOpen && authStore.isFullyAuthenticated && !isLoginRoute" @close="handleClose"
          @success="handleSuccess" />
        <UpdateAnnouncementModal :isOpen="isUpdateModalOpen" :title="currentUpdateTitle" :content="currentUpdateContent"
          :okText="$t('announcements.ok')" @ack="ackUpdate" />
        <SubscriptionExpiringSoonModal :isOpen="isExpiringSoonModalOpen" :days="daysUntilExpiry"
          :countdownText="countdownText" @ack="ackExpiringSoon" />
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
import { useRoute, useRouter } from 'vue-router'
import ReAuthModal from '@/components/auth/ReAuthModal.vue'
import MaintenanceBanner from '@/components/announcements/MaintenanceBanner.vue'
import UpdateAnnouncementModal from '@/components/announcements/UpdateAnnouncementModal.vue'
import SubscriptionBlockedModal from '@/components/subscription/SubscriptionBlockedModal.vue'
import SubscriptionExpiringSoonModal from '@/components/subscription/SubscriptionExpiringSoonModal.vue'
import InitialLoadProgress from '@/components/offline/InitialLoadProgress.vue'
import ConflictResolutionModal from '@/components/offline/ConflictResolutionModal.vue'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import OverLoading from '@/components/spinner/OverLoading.vue'
import TopProgressBar from '@/components/spinner/TopProgressBar.vue'
import { isCheckoutOverlay } from '@/composables/spinner'
import { stopAuthAutoRefresh, startAuthAutoRefresh, getActiveAnnouncements } from '@/services/api'
import { usePwaUpdate } from '@/composables/usePwaUpdate'
import { syncManager } from '@/services/offline/syncManager'
import { useConnection } from '@/composables/useConnection'
import { useOfflineStore } from '@/services/offline/offlineStore'
const offlineStore = useOfflineStore()
import { useToast } from 'vue-toastification'
const toast = useToast()
const useLanguage = useLanguageStore();
const t = useI18n({ useScope: "global" });



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
  () => authStore.isPmsSubscriptionBlocked,
  (isBlocked) => {
    if (!isInitialLoad.value) return
    if (isBlocked) {
      authStore.forceLogout()
      if (route.path !== '/') {
        router.replace('/')
      }
    }
  },
  { immediate: true },
)

usePwaUpdate()

// Initialiser la détection de connexion avec synchronisation automatique
const { manualSync } = useConnection()

type Announcement = {
  id?: number | string
  type?: string
  content?: string
  title?: string
  isActive?: boolean
  [key: string]: unknown
}

const announcements = ref<Announcement[]>([])
const announcementsLoaded = ref(false)

const announcementsNowMs = ref(Date.now())
let announcementsIntervalId: number | null = null
const stopAnnouncementsTicker = () => {
  if (announcementsIntervalId) {
    clearInterval(announcementsIntervalId)
    announcementsIntervalId = null
  }
}
const startAnnouncementsTicker = () => {
  stopAnnouncementsTicker()
  announcementsNowMs.value = Date.now()
  announcementsIntervalId = window.setInterval(() => {
    announcementsNowMs.value = Date.now()
  }, 60_000)
}

const parseMs = (value: unknown): number | null => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(String(value))
  const ms = date.getTime()
  return Number.isNaN(ms) ? null : ms
}

const isAnnouncementActiveNow = (a: Announcement, nowMs = announcementsNowMs.value): boolean => {
  if ((a?.isActive ?? true) !== true) return false
  const anyA = a as any
  const startsMs = parseMs(anyA?.startsAt ?? anyA?.starts_at ?? null)
  const endsMs = parseMs(anyA?.endsAt ?? anyA?.ends_at ?? null)
  if (startsMs !== null && nowMs < startsMs) return false
  if (endsMs !== null && nowMs > endsMs) return false
  return true
}

const MAINTENANCE_LEAD_MS = 5 * 24 * 60 * 60 * 1000
const isMaintenanceVisibleNow = (a: Announcement, nowMs = announcementsNowMs.value): boolean => {
  if ((a?.isActive ?? true) !== true) return false
  const anyA = a as any
  const startsMs = parseMs(anyA?.startsAt ?? anyA?.starts_at ?? null)
  const endsMs = parseMs(anyA?.endsAt ?? anyA?.ends_at ?? null)
  if (startsMs === null) {
    return isAnnouncementActiveNow(a, nowMs)
  }
  const visibleFromMs = startsMs - MAINTENANCE_LEAD_MS
  if (nowMs < visibleFromMs) return false
  if (endsMs !== null && nowMs > endsMs) return false
  return true
}

const loadAnnouncements = async () => {
  try {
    const res = await getActiveAnnouncements()
    const raw = (res as any)?.data?.data ?? (res as any)?.data
    const list = raw?.data ?? raw?.announcements ?? raw
    announcements.value = Array.isArray(list) ? list : []
    announcementsLoaded.value = true
  } catch {
    announcements.value = []
  }
}

watch(
  () => authStore.isAuthenticated,
  () => {
    if (announcementsLoaded.value) return
    loadAnnouncements()
  },
  { immediate: true },
)

watch(
  () => [authStore.isFullyAuthenticated, isLoginRoute.value, authStore.isPmsSubscriptionBlocked] as const,
  ([isAuth, login, blocked]) => {
    if (!isAuth || login || blocked) {
      stopAnnouncementsTicker()
      return
    }
    startAnnouncementsTicker()
  },
  { immediate: true },
)

const DISMISSED_MAINTENANCE_SESSION_KEY = 'dismissedMaintenanceAnnouncementId'
const dismissedMaintenanceAnnouncementId = ref<string | null>(sessionStorage.getItem(DISMISSED_MAINTENANCE_SESSION_KEY))

const maintenanceAnnouncement = computed<Announcement | null>(() => {
  const found = announcements.value.find((a) => {
    if (a?.type !== 'maintenance') return false
    const id = (a as any)?.id
    if (id !== undefined && id !== null && dismissedMaintenanceAnnouncementId.value === String(id).trim()) return false
    return isMaintenanceVisibleNow(a)
  })
  return found ?? null
})

const maintenanceAnnouncementContent = computed(() => {
  const a = maintenanceAnnouncement.value as any
  return String(a?.content ?? a?.message ?? a?.title ?? '')
})

const maintenanceAnnouncementTitle = computed(() => {
  const a = maintenanceAnnouncement.value as any
  const title = String(a?.title ?? '').trim()
  if (title) return title
  return 'Maintenance'
})

const maintenanceTypeLabel = computed(() => {
  return 'Maintenance'
})

const maintenanceAnnouncementWindowText = computed(() => {
  const a = maintenanceAnnouncement.value as any
  const startsMs = parseMs(a?.startsAt ?? a?.starts_at ?? null)
  const endsMs = parseMs(a?.endsAt ?? a?.ends_at ?? null)
  if (startsMs === null && endsMs === null) return ''

  const locale = (t.locale.value as string) || undefined
  const fmt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const startText = startsMs !== null ? fmt.format(new Date(startsMs)) : ''
  const endText = endsMs !== null ? fmt.format(new Date(endsMs)) : ''

  if (startText && endText) return `${startText} → ${endText}`
  return startText || endText
})

const dismissMaintenanceAnnouncement = () => {
  const id = (maintenanceAnnouncement.value as any)?.id
  if (id === undefined || id === null) return
  const key = String(id).trim()
  dismissedMaintenanceAnnouncementId.value = key
  sessionStorage.setItem(DISMISSED_MAINTENANCE_SESSION_KEY, key)
}

const updateAnnouncements = computed<Announcement[]>(() => {
  return announcements.value.filter((a) => a?.type === 'update' && isAnnouncementActiveNow(a))
})

const isUpdateModalOpen = ref(false)
const currentUpdate = ref<Announcement | null>(null)

const currentUpdateContent = computed(() => {
  const a = currentUpdate.value as any
  return String(a?.content ?? a?.message ?? '')
})

const currentUpdateTitle = computed(() => {
  const a = currentUpdate.value as any
  const title = String(a?.title ?? '').trim()
  if (title) return title
  return t.t('announcements.updateTitle')
})

const pickNextUpdate = () => {
  const next = updateAnnouncements.value.find((u) => {
    const id = (u as any)?.id
    if (id === undefined || id === null) return false
    const key = String(id).trim()
    return !localStorage.getItem(`seen_update_${key}`)
  })
  if (!next) return
  currentUpdate.value = next
  isUpdateModalOpen.value = true
}

const ackUpdate = () => {
  const id = (currentUpdate.value as any)?.id
  if (id !== undefined && id !== null) {
    localStorage.setItem(`seen_update_${String(id).trim()}`, 'true')
  }
  isUpdateModalOpen.value = false
  currentUpdate.value = null
  setTimeout(() => {
    pickNextUpdate()
  }, 0)
}

watch(
  () => [updateAnnouncements.value.length, authStore.isFullyAuthenticated, isLoginRoute.value, authStore.isPmsSubscriptionBlocked] as const,
  ([len, isAuth, login, blocked]) => {
    if (blocked) return
    if (!isAuth || login) return
    if (isUpdateModalOpen.value) return
    if (len <= 0) return
    pickNextUpdate()
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
  if (isUpdateModalOpen.value) return false
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

  // Vérifier les conflits existants au chargement
  const hotelIdOnMount = useServiceStore()?.serviceId
  if (hotelIdOnMount) {
    offlineStore.refreshConflicts(hotelIdOnMount)
  }

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

  if (localStorage.getItem('pwa-updated') === 'true') {
    localStorage.removeItem('pwa-updated')
    toast.success(t.t('common.appUpdated'))
  }

  // Écouteur de reconnexion toast
  window.addEventListener('app:online', async () => {
    const hotelId = useServiceStore()?.getCurrentService?.id
    if (hotelId) {
      toast.info(t.t('common.syncing'), { timeout: 3000 })
      try {
        await syncManager.sync()
        toast.success(t.t('common.syncComplete'))
      } catch {
        toast.error(t.t('common.syncError'))
      }
    }
  })

  // Écouteur de perte de connexion
  window.addEventListener('app:offline', () => {
    toast.warning(t.t('common.offlineMode'), { timeout: 4000 })
  })

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
      // Initialiser le mode offline
      try {
        const hotelId = useServiceStore()?.getCurrentService?.id
        if (hotelId) {
          syncManager.init(hotelId)
          syncManager.checkOfflineModeStatus().then((enabled) => {
            if (enabled) {
              syncManager.startPeriodicSync()
              // Rafraîchir le compteur d'opérations en attente
              useOfflineStore().refreshPendingCount()
            }
          })
        }
      } catch (e) {
        console.debug('[Sync] Init failed:', e)
      }

      startAuthAutoRefresh()

      if (authStore.reauthRequired && !isLoginRoute.value) {
        isReAuthOpen.value = true
      } else {
        startIdleTimer()
      }
    } else {
      removeActivityListeners()
      clearIdleTimer()
      syncManager.stopPeriodicSync()
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

// ── Gestion des conflits de synchronisation ────────────────────────────

/** Conflit actuellement affiché dans la modale */
const currentConflict = computed(() => {
  const list = offlineStore.conflicts
  return list.length > 0 ? list[0] : null
})

/** Après résolution d'un conflit, passer au suivant ou fermer */
function onConflictResolved() {
  // Le store a déjà retiré le conflit résolu de la liste
  // et ferme automatiquement la modale si plus de conflits
  if (offlineStore.conflicts.length > 0) {
    // La modale reste ouverte avec le conflit suivant (currentConflict change)
  }
}

/** Rafraîchir les conflits depuis le backend après la sync */
watch(
  () => offlineStore.isSyncing,
  async (syncing) => {
    if (!syncing && offlineStore.isOnline) {
      const hotelId = useServiceStore()?.serviceId
      if (hotelId) {
        await offlineStore.refreshConflicts(hotelId)
      }
    }
  }
)

</script>
<style>
@reference "tailwindcss";
</style>
