/**
 * SyncApi — Service dédié aux endpoints de synchronisation
 *
 * ⚠️ Les conflits sont des données temps réel côté serveur.
 * Les GET (fetchConflicts) utilisent apiClient DIRECTEMENT (pas offlineAwareApiCall)
 * car les conflits ne doivent JAMAIS venir du cache offline.
 * Si l'utilisateur est hors ligne → fetchConflicts retourne [] (pas de conflits affichables).
 *
 * Les POST (resolveConflict) utilisent offlineAwareApiCall pour la file d'attente,
 * car la résolution mise en attente sera jouée à la reconnexion.
 *
 * Endpoints backend :
 *   GET  /api/sync/conflicts              → liste des conflits non résolus
 *   POST /api/sync/conflicts/:id/resolve  → résoudre un conflit
 *   GET  /api/sync/status                 → statut de la sync
 */
import { offlineAwareApiCall } from './apiProxy.js'
import apiClient from '../apiClient'

const SYNC_API_BASE = ''

// ── Types ──────────────────────────────────────────────────────────────

export interface SyncConflict {
  id: number
  hotelId: number
  operationId: string
  resourceType: string
  resourceId: number
  clientVersion: number
  serverVersion: number
  clientData: Record<string, any>
  serverData: Record<string, any>
  resolution: 'pending' | 'client_wins' | 'server_wins' | 'merged'
  created_at: string
  updated_at: string
}

export interface SyncStatus {
  pending: number
  conflicts: number
  lastSyncAt: string | null
  lastVersion: number
  serverTime: string
}

export type ConflictResolution = 'client_wins' | 'server_wins' | 'merged'

// ── Functions ──────────────────────────────────────────────────────────

/**
 * Récupérer la liste des conflits non résolus depuis le backend.
 * Utilise apiClient directement (pas de cache offline).
 * Hors ligne → retourne [] immédiatement sans appel réseau.
 */
export async function fetchConflicts(hotelId: number): Promise<SyncConflict[]> {
  // Vérifier le statut offline avant tout appel réseau
  if (!navigator.onLine) {
    console.log('[SyncApi] Hors ligne, pas de conflits à récupérer')
    return []
  }

  try {
    // Vérifier aussi le store offline
    const { useOfflineStore } = await import('./offlineStore.js')
    const offlineStore = useOfflineStore()
    if (!offlineStore.isOnline) {
      return []
    }
  } catch {
    // Store pas encore disponible
  }

  try {
    const response = await apiClient.get('/sync/conflicts', { params: { hotelId } })
    const conflicts = response.data?.data ?? response.data ?? []
    return Array.isArray(conflicts) ? conflicts : []
  } catch (error: any) {
    // Erreur réseau (pas de réponse serveur) → silencieux, on retourne []
    if (!error?.response) {
      return []
    }
    console.warn('[SyncApi] Failed to fetch conflicts:', error?.response?.status, error?.response?.data)
    return []
  }
}

/**
 * Résoudre un conflit spécifique.
 * Utilise offlineAwareApiCall pour la file d'attente (écriture).
 * Si hors ligne, la résolution sera mise en attente et jouée à la reconnexion.
 */
export async function resolveConflict(
  conflictId: number,
  resolution: ConflictResolution
): Promise<boolean> {
  try {
    await offlineAwareApiCall(
      'POST',
      `/sync/conflicts/${conflictId}/resolve`,
      {
        data: { resolution },
        resourceType: 'sync_conflict',
        resourceId: conflictId,
        queuePriority: 7,
      }
    )
    return true
  } catch (error) {
    console.error(`[SyncApi] Failed to resolve conflict #${conflictId}:`, error)
    return false
  }
}

/**
 * Récupérer le statut de synchronisation
 */
export async function fetchSyncStatus(hotelId: number): Promise<SyncStatus | null> {
  try {
    const result = await offlineAwareApiCall<SyncStatus>(
      'GET',
      `${SYNC_API_BASE}/sync/status`,
      {
        params: { hotelId },
        resourceType: 'sync_status',
      }
    )
    return result.data ?? null
  } catch (error) {
    console.warn('[SyncApi] Failed to fetch sync status:', error)
    return null
  }
}
