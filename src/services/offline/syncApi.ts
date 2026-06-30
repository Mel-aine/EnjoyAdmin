/**
 * SyncApi — Service dédié aux endpoints de synchronisation
 *
 * Utilise offlineAwareApiCall pour les appels afin d'être compatible
 * avec le mode hors ligne (les GET en conflit peuvent être prioritaires).
 *
 * Endpoints backend :
 *   GET  /api/sync/conflicts              → liste des conflits non résolus
 *   POST /api/sync/conflicts/:id/resolve  → résoudre un conflit
 *   GET  /api/sync/status                 → statut de la sync
 */
import { offlineAwareApiCall } from './apiProxy.js'

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

// ── Constants ──────────────────────────────────────────────────────────

const SYNC_API_BASE = ''

// ── Functions ──────────────────────────────────────────────────────────

/**
 * Récupérer la liste des conflits non résolus depuis le backend
 */
export async function fetchConflicts(hotelId: number): Promise<SyncConflict[]> {
  try {
    const result = await offlineAwareApiCall<{ data: SyncConflict[] }>(
      'GET',
      `${SYNC_API_BASE}/sync/conflicts`,
      {
        params: { hotelId },
        resourceType: 'sync_conflict',
      }
    )
    // La réponse backend est { data: conflict[] }
    const conflicts = (result.data as any)?.data ?? result.data ?? []
    return Array.isArray(conflicts) ? conflicts : []
  } catch (error) {
    console.warn('[SyncApi] Failed to fetch conflicts:', error)
    return []
  }
}

/**
 * Résoudre un conflit spécifique
 */
export async function resolveConflict(
  conflictId: number,
  resolution: ConflictResolution
): Promise<boolean> {
  try {
    await offlineAwareApiCall(
      'POST',
      `${SYNC_API_BASE}/sync/conflicts/${conflictId}/resolve`,
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
