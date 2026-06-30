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
import { isOnline as connectionIsOnline, connectionQuality } from './connectionState.js'
import { fetchConflicts, resolveConflict as resolveConflictApi } from './syncApi.js'
import type { SyncConflict, ConflictResolution } from './syncApi.js'

/** Type partiel des conflits retournés par le push (sans id/hotelId/resolution/dates) */
export interface PushConflict {
  operationId: string
  resourceType: string
  resourceId: number
  clientVersion: number
  serverVersion: number
  clientData: Record<string, any>
  serverData: Record<string, any>
}

export const useOfflineStore = defineStore('offline', () => {
  // ── State ────────────────────────────────────────────────────
  const isOnline = ref(navigator.onLine)
  const isSyncing = ref(false)
  const lastSyncAt = ref<string | null>(localStorage.getItem('offline_lastSyncAt'))
  const pendingCount = ref(0)
  const failedCount = ref(0)
  const conflictsCount = ref(0)
  const conflicts = ref<SyncConflict[]>([])
  const isConflictModalVisible = ref(false)
  const isInitialLoading = ref(false)
  const initialLoadProgress = ref(0)

  /** Conflits reçus du push (pour préserver resourceType que le GET pourrait omettre) */
  const pushConflicts = ref<PushConflict[]>([])

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

  // ── Debounce pour éviter les faux positifs ────────────────────
  const OFFLINE_DEBOUNCE_MS = 4000
  let _pendingOfflineTimer: ReturnType<typeof setTimeout> | null = null

  function cancelPendingOffline() {
    if (_pendingOfflineTimer) {
      clearTimeout(_pendingOfflineTimer)
      _pendingOfflineTimer = null
    }
  }

  // ── Actions ───────────────────────────────────────────────────
  async function refreshPendingCount() {
    try {
      const all = await db.syncQueue.toArray()
      pendingCount.value = all.filter(o => o.status === 'pending' || o.status === 'processing').length
      failedCount.value = all.filter(o => o.status === 'failed').length
    } catch {
      // DB might not be initialized yet
    }
  }

  /**
   * Récupérer les conflits depuis le backend et mettre à jour le store
   */
  async function refreshConflicts(hotelId?: number): Promise<void> {
    if (!hotelId) return

    const conflictList = await fetchConflicts(hotelId)

    // Enrichir les conflits GET avec les resourceType du push (qui sont toujours complets)
    if (pushConflicts.value.length > 0) {
      for (const conflict of conflictList) {
        if (!conflict.resourceType) {
          const pushEntry = pushConflicts.value.find(
            (pc) => pc.operationId === conflict.operationId
          )
          if (pushEntry?.resourceType) {
            conflict.resourceType = pushEntry.resourceType
          }
        }
      }
      pushConflicts.value = []
    }

    conflicts.value = conflictList
    conflictsCount.value = conflictList.length

    // Si des conflits existent, ouvrir la modale
    if (conflictList.length > 0 && !isConflictModalVisible.value) {
      isConflictModalVisible.value = true
    }
  }

  /**
   * Résoudre un conflit
   */
  async function resolveConflictAction(
    conflictId: number,
    resolution: ConflictResolution
  ): Promise<boolean> {
    const ok = await resolveConflictApi(conflictId, resolution)
    if (ok) {
      // Retirer le conflit résolu de la liste
      conflicts.value = conflicts.value.filter(c => c.id !== conflictId)
      conflictsCount.value = conflicts.value.length

      // Fermer la modale si plus de conflits
      if (conflicts.value.length === 0) {
        isConflictModalVisible.value = false
      }
    }
    return ok
  }

  /**
   * Fermer la modale de conflit
   */
  function closeConflictModal(): void {
    isConflictModalVisible.value = false
  }

  function setOnline(value: boolean) {
    if (value) {
      // Retour en ligne → annuler tout debounce et remettre online
      cancelPendingOffline()
      isOnline.value = true
      connectionIsOnline.value = true
      connectionQuality.value = 'online'
    } else {
      // Perte de connexion détectée → debounce pour éviter les faux positifs
      // Ne pas relancer le timer s'il est déjà en cours
      if (_pendingOfflineTimer) return

      // Passer immédiatement en 'instable' pour le feedback UI
      connectionQuality.value = 'unstable'

      // Confirmer hors ligne seulement après le délai de debounce
      _pendingOfflineTimer = setTimeout(() => {
        isOnline.value = false
        connectionIsOnline.value = false
        connectionQuality.value = 'offline'
        _pendingOfflineTimer = null
      }, OFFLINE_DEBOUNCE_MS)
    }
  }

  /**
   * Passage immédiat en mode hors ligne (pour les événements navigateur 'offline',
   * qui sont plus fiables et ne nécessitent pas de debounce)
   */
  function setOfflineImmediate() {
    cancelPendingOffline()
    isOnline.value = false
    connectionIsOnline.value = false
    connectionQuality.value = 'offline'
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
    conflicts,
    isConflictModalVisible,
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
    refreshConflicts,
    resolveConflictAction,
    closeConflictModal,
    pushConflicts,
    setOnline,
    setOfflineImmediate,
    setSyncing,
    setLastSync,
    setInitialLoading,
    setInitialLoadProgress,
  }
})
