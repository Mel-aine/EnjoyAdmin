/**
 * OfflineStore
 *
 * Pinia store pour gérer l'état de la connexion et de la synchronisation.
 * Utilisé par ConnectionStatus.vue, AppHeader.vue et les composants métier
 * pour afficher le statut et déclencher des actions.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from './db.js'

export const useOfflineStore = defineStore('offline', () => {
  // ── State ────────────────────────────────────────────────────
  const isOnline = ref(navigator.onLine)
  const isSyncing = ref(false)
  const lastSyncAt = ref<string | null>(localStorage.getItem('offline_lastSyncAt'))
  const pendingCount = ref(0)
  const failedCount = ref(0)
  const conflictsCount = ref(0)
  const isInitialLoading = ref(false)
  const initialLoadProgress = ref(0)

  // ── Getters ───────────────────────────────────────────────────
  const syncStatus = computed<'online' | 'offline' | 'syncing' | 'pending' | 'conflict'>(() => {
    if (isSyncing.value) return 'syncing'
    if (!isOnline.value) return 'offline'
    if (conflictsCount.value > 0) return 'conflict'
    if (pendingCount.value > 0) return 'pending'
    return 'online'
  })

  const syncStatusLabel = computed(() => {
    const labels: Record<string, string> = {
      online: 'En ligne',
      offline: 'Hors ligne',
      syncing: 'Synchronisation...',
      pending: `${pendingCount.value} en attente`,
      conflict: `${conflictsCount.value} conflit(s)`,
    }
    return labels[syncStatus.value] || 'En ligne'
  })

  const syncStatusColor = computed(() => {
    const colors: Record<string, string> = {
      online: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
      offline: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
      syncing: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
      pending: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20',
      conflict: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
    }
    return colors[syncStatus.value] || ''
  })

  const dotColor = computed(() => {
    const colors: Record<string, string> = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      syncing: 'bg-yellow-500 animate-pulse',
      pending: 'bg-orange-500',
      conflict: 'bg-red-500 animate-pulse',
    }
    return colors[syncStatus.value] || 'bg-green-500'
  })

  const needsAttention = computed(() =>
    pendingCount.value > 0 || conflictsCount.value > 0 || !isOnline.value
  )

  const hasConflicts = computed(() => conflictsCount.value > 0)
  const isOffline = computed(() => !isOnline.value)

  // ── Actions ───────────────────────────────────────────────────
  async function refreshPendingCount() {
    try {
      const all = await db.syncQueue.toArray()
      pendingCount.value = all.filter(o => o.status === 'pending' || o.status === 'processing').length
      failedCount.value = all.filter(o => o.status === 'failed').length

      const cacheAll = await db.apiCache.toArray()
      conflictsCount.value = cacheAll.filter(e => {
        const meta = e.data as any
        return meta?.resourceType === 'conflict'
      }).length
    } catch {
      // DB might not be initialized yet
    }
  }

  function setOnline(value: boolean) {
    isOnline.value = value
  }

  function setSyncing(value: boolean) {
    isSyncing.value = value
  }

  function setLastSync(date: string) {
    lastSyncAt.value = date
    localStorage.setItem('offline_lastSyncAt', date)
  }

  function setInitialLoading(value: boolean) {
    isInitialLoading.value = value
  }

  function setInitialLoadProgress(value: number) {
    initialLoadProgress.value = Math.min(100, Math.max(0, value))
  }

  return {
    // State
    isOnline,
    isSyncing,
    lastSyncAt,
    pendingCount,
    failedCount,
    conflictsCount,
    isInitialLoading,
    initialLoadProgress,

    // Getters
    syncStatus,
    syncStatusLabel,
    syncStatusColor,
    dotColor,
    needsAttention,
    hasConflicts,
    isOffline,

    // Actions
    refreshPendingCount,
    setOnline,
    setSyncing,
    setLastSync,
    setInitialLoading,
    setInitialLoadProgress,
  }
})
