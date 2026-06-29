/**
 * useConnection
 *
 * Composable for detecting online/offline connectivity status.
 * Uses navigator.onLine + online/offline events.
 * Provides reactive state and auto-start sync on reconnect.
 *
 * State is shared via the connectionState.ts module so that
 * ConnectionStatus.vue can read it without re-registering listeners.
 */
import { computed, onMounted, onUnmounted } from 'vue'
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

let unstableTimeout: ReturnType<typeof setTimeout> | null = null

function handleOnline() {
  isOnline.value = true
  connectionQuality.value = 'online'
  lastOnlineAt.value = new Date()

  if (unstableTimeout) {
    clearTimeout(unstableTimeout)
    unstableTimeout = null
  }

  triggerSync()
}

function handleOffline() {
  isOnline.value = false
  connectionQuality.value = 'offline'
  lastOfflineAt.value = new Date()
  isSyncing.value = false
  syncManager.stopPeriodicSync()
}

let disconnectCount = 0
let disconnectWindow: ReturnType<typeof setTimeout> | null = null

function trackDisconnect() {
  disconnectCount++
  if (disconnectCount >= 2) {
    connectionQuality.value = 'unstable'
  }
  if (disconnectWindow) clearTimeout(disconnectWindow)
  disconnectWindow = setTimeout(() => { disconnectCount = 0 }, 30_000)
}

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

let pendingRefreshTimer: ReturnType<typeof setInterval> | null = null

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

export function useConnection() {
  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    startPendingRefresh()
    offlineQueue.pendingCount().then((count) => { pendingOperations.value = count })
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
