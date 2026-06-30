/**
 * useConnection
 *
 * Composable for detecting online/offline connectivity status.
 * Uses navigator.onLine + online/offline events.
 * Provides reactive state and auto-start sync on reconnect.
 *
 * State is shared via the connectionState.ts module so that
 * ConnectionStatus.vue can read it without re-registering listeners.
 *
 * NOTE: Les toasts de connexion sont affichés en bas à gauche (style Facebook/YouTube)
 * via handleOnline/handleOffline. Ils utilisent useI18n() et useToast() qui sont
 * appelés DANS le contexte setup() (pas depuis les event listeners bruts).
 */
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast, POSITION } from 'vue-toastification'
import { syncManager } from '../services/offline/syncManager.js'
import { offlineQueue } from '../services/offline/queue.js'
import {
  isOnline,
  connectionQuality,
  lastOnlineAt,
  lastOfflineAt,
  pendingOperations,
  isSyncing,
} from '../services/offline/connectionState.js'
import type { ConnectionQuality } from '../services/offline/connectionState.js'
import { useOfflineStore } from '../services/offline/offlineStore.js'
import { useServiceStore } from '../composables/serviceStore'

const TOAST_OPTIONS = {
  position: POSITION.BOTTOM_LEFT,
  timeout: 4000,
  toastClassName: 'connection-toast',
} as const

export function useConnection() {
  const { t } = useI18n()
  const toast = useToast()

  let unstableTimeout: ReturnType<typeof setTimeout> | null = null
  let disconnectCount = 0
  let disconnectWindow: ReturnType<typeof setTimeout> | null = null
  let pendingRefreshTimer: ReturnType<typeof setInterval> | null = null

  // ── Event handlers (ouverts sur t / toast depuis le contexte setup) ──

  async function triggerSync() {
    if (isSyncing.value) return
    isSyncing.value = true
    try {
      const offlineEnabled = await syncManager.checkOfflineModeStatus()
      if (offlineEnabled) {
        await syncManager.sync()
        syncManager.startPeriodicSync()
      }
      pendingOperations.value = await offlineQueue.pendingCount()
    } catch {
      // Silent fail
    } finally {
      isSyncing.value = false
    }
  }

  async function handleOnline() {
    isOnline.value = true
    connectionQuality.value = 'online'
    lastOnlineAt.value = new Date()

    const offlineStore = useOfflineStore()
    offlineStore.setOnline(true)

    if (unstableTimeout) {
      clearTimeout(unstableTimeout)
      unstableTimeout = null
    }

    await triggerSync()

    // Rafraîchir les conflits après la synchronisation
    const hotelId = useServiceStore()?.serviceId
    if (hotelId) {
      await offlineStore.refreshConflicts(hotelId)
    }

    // Toast reconnecté (bas-gauche, style Facebook/YouTube)
    toast(t('connection.backOnline'), {
      ...TOAST_OPTIONS,
      type: 'success',
    })
  }

  function handleOffline() {
    const offlineStore = useOfflineStore()
    offlineStore.setOfflineImmediate()

    lastOfflineAt.value = new Date()
    isSyncing.value = false

    syncManager.stopPeriodicSync()

    // Toast hors-ligne (bas-gauche, style Facebook/YouTube)
    toast(t('connection.offline'), {
      ...TOAST_OPTIONS,
      type: 'warning',
    })
  }

  function trackDisconnect() {
    disconnectCount++
    if (disconnectCount >= 2) {
      connectionQuality.value = 'unstable'
    }
    if (disconnectWindow) clearTimeout(disconnectWindow)
    disconnectWindow = setTimeout(() => { disconnectCount = 0 }, 30_000)
  }

  // ── Pending refresh ──────────────────────────────────────────

  function startPendingRefresh() {
    stopPendingRefresh()
    pendingRefreshTimer = setInterval(async () => {
      pendingOperations.value = await offlineQueue.pendingCount()
    }, 10_000)
  }

  function stopPendingRefresh() {
    if (pendingRefreshTimer) {
      clearInterval(pendingRefreshTimer)
      pendingRefreshTimer = null
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    startPendingRefresh()
    offlineQueue.pendingCount().then((count) => { pendingOperations.value = count })

    const offlineStore = useOfflineStore()
    offlineStore.setOnline(navigator.onLine)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    stopPendingRefresh()
  })

  async function manualSync(): Promise<void> {
    await triggerSync()
  }

  return {
    isOnline: computed(() => isOnline.value),
    connectionQuality: computed(() => connectionQuality.value),
    lastOnlineAt: computed(() => lastOnlineAt.value),
    lastOfflineAt: computed(() => lastOfflineAt.value),
    pendingOperations: computed(() => pendingOperations.value),
    isSyncing: computed(() => isSyncing.value),
    manualSync,
  }
}
