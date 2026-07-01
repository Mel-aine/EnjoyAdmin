/**
 * SyncManager
 *
 * Orchestrates synchronisation between the local IndexedDB store and the
 * backend sync API (push / pull / initial-load).
 *
 * NOTE sur les conventions de nommage :
 * - initialLoad() : le backend retourne des clés camelCase (ex: "folioTransactions")
 * - pull() : le backend utilise les clés snake_case de tableMap (ex: "folio_transaction")
 * - Le frontend normalise tout en snake_case pour le cache local
 */
import { v4 as uuidv4 } from 'uuid'
import { useOfflineStore } from './offlineStore.js'
import type { PushConflict } from './offlineStore.js'
import apiClient from '../apiClient.js'
import { offlineQueue } from './queue.js'
import {
  cacheApiResponse,
  getCachedResponse,
  updateCheckpoint,
  getCheckpoint,
  clearExpiredCache,
} from './db.js'
import type { SyncOperation } from './db.js'
import { OfflineCacheService } from './cacheService.js'

// ── Configuration ──────────────────────────────────────────────────────

const SYNC_API_BASE = ''
const PULL_INTERVAL_MS = 5 * 60 * 1000
const INITIAL_LOAD_DAYS_BACK = 15

// Noms de ressources côté BACKEND (tableMap dans sync_service.ts)
// Utilisés pour PULL et comme clés de cache normalisées
const REFERENCE_RESOURCES = [
  'room_type', 'room', 'rate_type', 'room_rate',
  'booking_source', 'payment_method', 'tax_rate',
  'extra_charge', 'discount',
  'vip_status', 'black_list_reason',
  'notification', 'announcement',
]

const BUSINESS_RESOURCES = [
  'reservation', 'guest', 'folio', 'folio_transaction',
]

const HOUSEKEEPING_RESOURCES = [
  'work_order', 'room_block',
]

// Mapping camelCase (initialLoad backend) → snake_case (cache local)
const INITIAL_LOAD_KEY_MAP: Record<string, string> = {
  hotel: 'hotel',
  roomTypes: 'room_type',
  rooms: 'room',
  rateTypes: 'rate_type',
  rates: 'room_rate',
  bookingSources: 'booking_source',
  paymentMethods: 'payment_method',
  taxRates: 'tax_rate',
  extraCharges: 'extra_charge',
  discounts: 'discount',
  reservations: 'reservation',
  guests: 'guest',
  folios: 'folio',
  folioTransactions: 'folio_transaction',
  workOrders: 'work_order',
  roomBlocks: 'room_block',
  vipStatuses: 'vip_status',
  blackListReasons: 'black_list_reason',
  notifications: 'notification',
  announcements: 'announcement',
}

const TTL = {
  REFERENCE: 7 * 24 * 60 * 60 * 1000,
  DATA: 24 * 60 * 60 * 1000,
  TRANSACTION: 7 * 24 * 60 * 60 * 1000,
} as const

// ── Types ──────────────────────────────────────────────────────────────

interface SyncPushResponse {
  processed: Array<{ operationId: string; serverId: number; version: number }>
  conflicts: Array<{
    operationId: string
    resourceType: string
    resourceId: number
    clientVersion: number
    serverVersion: number
    clientData: Record<string, any>
    serverData: Record<string, any>
  }>
  errors: Array<{ operationId: string; error: string }>
  newCheckpoint: number
}

interface SyncPullResponse {
  changes: Record<string, {
    created: any[]
    updated: any[]
    deleted: Array<{ id: number; deletedAt: string }>
  }>
  serverTime: string
  checkpoint: number
}

interface InitialLoadResponse {
  data: Record<string, any[]>
  version: number
}

interface SyncStatusResponse {
  offlineModeEnabled: boolean
  pendingOperations: number
  lastSyncAt: string | null
}

// Mapping resourceType → chemins d'API pour le cache URL (utilisé par l'intercepteur axios)
// Permet au syncManager de peupler le cache que l'axios interceptor consulte hors-ligne
const RESOURCE_TO_URL_PATTERNS: Record<string, (hotelId: number) => string[]> = {
  room_type: (id) => [`/api/configuration/hotels/${id}/room_types`],
  room: (id) => [`/api/hotels/${id}/rooms`, `/api/configuration/hotels/${id}/rooms/views/details`],
  rate_type: (id) => [`/api/configuration/hotels/${id}/rate_types`],
  room_rate: (id) => [`/api/configuration/hotels/${id}/room_rates`],
  booking_source: (id) => [`/api/configuration/hotels/${id}/booking_sources`],
  payment_method: (id) => [`/api/configuration/hotels/${id}/payment_methods`],
  tax_rate: (id) => [`/api/configuration/hotels/${id}/taxes`],
  extra_charge: (id) => [`/api/configuration/hotels/${id}/extra_charges`],
  discount: (id) => [`/api/configuration/hotels/${id}/discounts`],
  reservation: () => ['/api/reservations'],
  guest: () => ['/api/guests'],
  folio: () => ['/api/folios'],
  folio_transaction: () => ['/api/folios/transactions'],
  work_order: () => ['/api/work_orders'],
  room_block: (id) => [`/api/room-blocks/${id}`],
  vip_status: (id) => [`/api/configuration/hotels/${id}/vip_statuses`],
  black_list_reason: (id) => [`/api/configuration/hotels/${id}/black_list_reasons`],
  notification: () => ['/api/notifications/me'],
  announcement: () => ['/api/announcements/active'],
  dashboard: (id) => [
    `/api/dashboard/front-office/${id}`,
    `/api/availability/${id}`,
    `/api/occupancy/${id}/stats`,
    `/api/revenue/${id}/stats`,
  ],
}

// ── Helpers ────────────────────────────────────────────────────────────

function getTtl(resourceType: string): number {
  if (resourceType === 'folio_transaction') return TTL.TRANSACTION
  if (BUSINESS_RESOURCES.includes(resourceType)) return TTL.DATA
  return TTL.REFERENCE
}

function buildCacheKey(resourceType: string, hotelId: number): string {
  return `sync:${resourceType}:${hotelId}`
}

async function mergeChanges(
  resourceType: string,
  changes: { created: any[]; updated: any[]; deleted: Array<{ id: number; deletedAt: string }> },
  hotelId: number
): Promise<void> {
  const cacheKey = buildCacheKey(resourceType, hotelId)
  const existing = await getCachedResponse<any[]>(cacheKey)
  if (!existing) return

  let merged = [...existing.data]

  for (const created of changes.created) {
    const idx = merged.findIndex((r) => r.id === created.id)
    if (idx >= 0) merged[idx] = created
    else merged.push(created)
  }
  for (const updated of changes.updated) {
    const idx = merged.findIndex((r) => r.id === updated.id)
    if (idx >= 0) merged[idx] = updated
  }
  for (const deleted of changes.deleted) {
    merged = merged.filter((r) => r.id !== deleted.id)
  }

  await cacheApiResponse(cacheKey, merged, getTtl(resourceType))
}

// ── SyncManager ────────────────────────────────────────────────────────

class SyncManager {
  private hotelId: number | null = null
  private deviceId: string
  private pullTimer: ReturnType<typeof setInterval> | null = null
  private syncing = false

  constructor() {
    let deviceId = localStorage.getItem('offline_device_id')
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('offline_device_id', deviceId)
    }
    this.deviceId = deviceId
  }

  init(hotelId: number): void {
    this.hotelId = hotelId
  }

  async checkOfflineModeStatus(): Promise<boolean> {
    if (!this.hotelId) return false
    try {
      const cacheKey = buildCacheKey('status', this.hotelId)
      const cached = await getCachedResponse<SyncStatusResponse>(cacheKey, 60_000)
      if (cached) return cached.data.offlineModeEnabled

      const response = await apiClient.get(
        `${SYNC_API_BASE}/sync/status`,
        { params: { hotelId: this.hotelId } }
      )
      const data = response.data as SyncStatusResponse
      await cacheApiResponse(cacheKey, data, 60_000)
      return data.offlineModeEnabled
    } catch {
      const lastKnown = localStorage.getItem('offline_mode_enabled')
      return lastKnown === 'true'
    }
  }

  /**
   * Perform initial load of all data needed for offline mode.
   *
   * Charge :
   * - Réservations de J-15 jusqu'à l'infini
   * - Clients, folios, transactions
   * - Données de référence (chambres, tarifs, taxes...)
   *
   * Note : le backend retourne des clés camelCase, on les normalise
   * en snake_case pour le cache local (cohérent avec PULL).
   */
  async initialLoad(dateFrom?: string): Promise<void> {
    if (!this.hotelId) throw new Error('SyncManager not initialised')

    const offlineStore = useOfflineStore()
    offlineStore.setInitialLoading(true)
    offlineStore.setInitialLoadProgress(0)

    try {
      const fromDate = dateFrom ?? (() => {
        const d = new Date()
        d.setDate(d.getDate() - INITIAL_LOAD_DAYS_BACK)
        return d.toISOString().split('T')[0]
      })()

      offlineStore.setInitialLoadProgress(5)
      const response = await apiClient.post(`${SYNC_API_BASE}/sync/initial-load`, {
        hotelId: this.hotelId,
        deviceId: this.deviceId,
        dateFrom: fromDate,
      })

      offlineStore.setInitialLoadProgress(15)
      const result = response.data as InitialLoadResponse
      const entries = Object.entries(result.data).filter(
        ([key, val]) => INITIAL_LOAD_KEY_MAP[key] && Array.isArray(val) && val.length > 0
      )
      const total = entries.length

      for (let i = 0; i < entries.length; i++) {
        const [camelKey, records] = entries[i]
        const resourceType = INITIAL_LOAD_KEY_MAP[camelKey]
        if (!resourceType) {
          console.warn(`[SyncManager] Unknown resource key: ${camelKey}`)
          continue
        }

        const cacheKey = buildCacheKey(resourceType, this.hotelId)
        await cacheApiResponse(cacheKey, records, getTtl(resourceType))

        // Peupler le cache sous les clés URL (pour l'intercepteur axios)
        const urlPatterns = RESOURCE_TO_URL_PATTERNS[resourceType]
        if (urlPatterns && this.hotelId) {
          const urlPaths = urlPatterns(this.hotelId)
          for (const urlPath of urlPaths) {
            await cacheApiResponse(urlPath, { data: records }, getTtl(resourceType))
          }
        }

        // Peupler le cache OfflineCacheService (pour offlineAwareApiCall)
        // Stocke chaque enregistrement individuellement sous la clé {resourceType}:{id}
        // Permet à offlineAwareApiCall.get() et getAll() de trouver les données hors-ligne
        if (resourceType && Array.isArray(records)) {
          const ttl = getTtl(resourceType)
          for (const record of records) {
            const recordId = (record as any)?.id ?? (record as any)?.ID
            if (recordId !== undefined && recordId !== null) {
              await OfflineCacheService.set(resourceType, recordId, record, { ttlMs: ttl })
            }
          }
        }

        const progress = 15 + Math.round(((i + 1) / total) * 80)
        offlineStore.setInitialLoadProgress(progress)
      }

      await updateCheckpoint(this.hotelId, '*', result.version)
      localStorage.setItem('offline_mode_enabled', 'true')
      console.log('[SyncManager] Initial load complete')
      offlineStore.setInitialLoadProgress(100)
      offlineStore.setInitialLoading(false)
    } catch (err: any) {
      console.error('[SyncManager] Initial load failed:', err.message)
      offlineStore.setInitialLoading(false)
      offlineStore.setInitialLoadProgress(0)
      throw err
    }
  }

  /**
   * Pull changes from the server (depuis le dernier checkpoint)
   * Les clés sont en snake_case (tableMap côté backend)
   */
  async pull(): Promise<SyncPullResponse | null> {
    if (!this.hotelId) return null

    const lastVersion = await getCheckpoint(this.hotelId, '*')

    try {
      const response = await apiClient.post(`${SYNC_API_BASE}/sync/pull`, {
        hotelId: this.hotelId,
        deviceId: this.deviceId,
        lastSyncVersion: lastVersion,
        resourceTypes: [
          ...REFERENCE_RESOURCES,
          ...BUSINESS_RESOURCES,
          ...HOUSEKEEPING_RESOURCES,
        ],
      })

      const result = response.data as SyncPullResponse

      for (const [resourceType, changes] of Object.entries(result.changes)) {
        await mergeChanges(resourceType, changes, this.hotelId)
      }

      await updateCheckpoint(this.hotelId, '*', result.checkpoint)
      return result
    } catch (err: any) {
      console.warn('[SyncManager] Pull failed:', err.message)
      return null
    }
  }
  async push(): Promise<{ pushed: number; conflicts: number; errors: number } | null> {
    if (!this.hotelId) return null

    const pending = await offlineQueue.getPending()
    if (pending.length === 0) return { pushed: 0, conflicts: 0, errors: 0 }

    try {
      const lastSyncVersion = await getCheckpoint(this.hotelId, '*')

      const response = await apiClient.post(`${SYNC_API_BASE}/sync/push`, {
        hotelId: this.hotelId,
        deviceId: this.deviceId,
        lastSyncVersion,
        operations: pending.map((op: SyncOperation) => ({
          operationId: op.operationId,
          operationType: op.operationType,
          resourceType: op.resourceType,
          resourceId: op.resourceId,
          payload: op.payload,
          priority: op.priority,
          clientTimestamp: op.clientTimestamp,
        })),
      })

      const result = response.data as SyncPushResponse

      for (const opId of result.processed) {
        await offlineQueue.markCompleted(opId.operationId)
      }

      const pushConflicts: PushConflict[] = []
      for (const conflict of result.conflicts) {
        // Ne pas auto-merger — stocker les conflits pour résolution utilisateur
        // via le ConflictResolutionModal
        await offlineQueue.markCompleted(conflict.operationId)
        // Préserver le resourceType (le GET /sync/conflicts pourrait ne pas le retourner)
        pushConflicts.push({
          operationId: conflict.operationId,
          resourceType: conflict.resourceType,
          resourceId: conflict.resourceId,
          clientVersion: conflict.clientVersion,
          serverVersion: conflict.serverVersion,
          clientData: conflict.clientData,
          serverData: conflict.serverData,
        })
      }
      if (pushConflicts.length > 0) {
        const offlineStore = useOfflineStore()
        offlineStore.pushConflicts = pushConflicts
      }

      for (const err of result.errors) {
        await offlineQueue.markFailed(err.operationId, err.error)
      }

      if (result.newCheckpoint) {
        await updateCheckpoint(this.hotelId, '*', result.newCheckpoint)
      }

      return {
        pushed: result.processed.length,
        conflicts: result.conflicts.length,
        errors: result.errors.length,
      }
    } catch (err: any) {
      console.error('[SyncManager] Push failed:', err.message)
      throw err
    }
  }

  async sync(): Promise<void> {
    await this.pull()
    await this.push()
    await clearExpiredCache()
  }

  startPeriodicSync(): void {
    if (this.pullTimer) return

    this.pullTimer = setInterval(async () => {
      if (this.syncing) return
      this.syncing = true
      try {
        await this.sync()
      } finally {
        this.syncing = false
      }
    }, PULL_INTERVAL_MS)
  }

  stopPeriodicSync(): void {
    if (this.pullTimer) {
      clearInterval(this.pullTimer)
      this.pullTimer = null
    }
  }
}

export const syncManager = new SyncManager()
