/**
 * SyncManager
 *
 * Orchestrates synchronisation between the local IndexedDB store and the
 * backend sync API (push / pull / initial-load).
 *
 * Flow:
 *   1. Pull changes from server (since last checkpoint)
 *   2. Push local pending operations in priority order
 *   3. Update local cache with server response
 *   4. Update checkpoint version
 */
import { v4 as uuidv4 } from 'uuid'
import apiClient from '../apiClient.js'
import { offlineQueue } from './queue.js'
import {
  db,
  cacheApiResponse,
  getCachedResponse,
  updateCheckpoint,
  getCheckpoint,
  clearExpiredCache,
  type SyncOperation,
} from './db.js'

// ── Configuration ──────────────────────────────────────────────────────

const SYNC_API_BASE = '/api'
const PULL_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
const INITIAL_LOAD_RESOURCES = [
  'room_type',
  'room',
  'rate_type',
  'room_rate',
  'booking_source',
  'payment_method',
  'tax_rate',
  'extra_charge',
  'discount',
]

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

// ── SyncManager ────────────────────────────────────────────────────────

class SyncManager {
  private hotelId: number | null = null
  private deviceId: string
  private pullTimer: ReturnType<typeof setInterval> | null = null
  private syncing = false

  constructor() {
    // Generate a stable device ID (persisted in localStorage)
    let deviceId = localStorage.getItem('offline_device_id')
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('offline_device_id', deviceId)
    }
    this.deviceId = deviceId
  }

  /**
   * Initialise the sync manager with the current hotel
   */
  init(hotelId: number): void {
    this.hotelId = hotelId
  }

  /**
   * Check if offline mode is enabled for the current hotel
   */
  async checkOfflineModeStatus(): Promise<boolean> {
    if (!this.hotelId) return false
    try {
      // Try cached first
      const cacheKey = `sync:status:${this.hotelId}`
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
      // If we can't reach the server, assume offline mode based on last known state
      const lastKnown = localStorage.getItem('offline_mode_enabled')
      return lastKnown === 'true'
    }
  }

  /**
   * Perform initial load of reference data
   */
  async initialLoad(): Promise<void> {
    if (!this.hotelId) throw new Error('SyncManager not initialised')

    try {
      const response = await apiClient.post(`${SYNC_API_BASE}/sync/initial-load`, {
        hotelId: this.hotelId,
        resourceTypes: INITIAL_LOAD_RESOURCES,
      })

      const result = response.data as InitialLoadResponse

      // Cache all reference data locally
      for (const [resourceType, records] of Object.entries(result.data)) {
        await cacheApiResponse(
          `sync:${resourceType}:${this.hotelId}`,
          records,
          7 * 24 * 60 * 60 * 1000 // 7 days TTL for reference data
        )
      }

      // Update checkpoint
      await updateCheckpoint(this.hotelId, '*', result.version)
      localStorage.setItem('offline_mode_enabled', 'true')

      console.log(`[SyncManager] Initial load complete (version ${result.version})`)
    } catch (err: any) {
      console.error('[SyncManager] Initial load failed:', err.message)
      throw err
    }
  }

  /**
   * Pull changes from the server
   */
  async pull(): Promise<SyncPullResponse | null> {
    if (!this.hotelId) return null

    const lastVersion = await getCheckpoint(this.hotelId, '*')

    try {
      const response = await apiClient.post(`${SYNC_API_BASE}/sync/pull`, {
        hotelId: this.hotelId,
        deviceId: this.deviceId,
        lastSyncVersion: lastVersion,
        resourceTypes: [...INITIAL_LOAD_RESOURCES, 'reservation', 'guest', 'folio', 'folio_transaction'],
      })

      const result = response.data as SyncPullResponse

      // Update local cache with pulled changes
      for (const [resourceType, changes] of Object.entries(result.changes)) {
        const cacheKey = `sync:${resourceType}:${this.hotelId}`
        const existing = await getCachedResponse<any[]>(cacheKey)

        if (existing) {
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

          await cacheApiResponse(cacheKey, merged, 7 * 24 * 60 * 60 * 1000)
        }
      }

      // Update checkpoint
      await updateCheckpoint(this.hotelId, '*', result.checkpoint)

      return result
    } catch (err: any) {
      console.warn('[SyncManager] Pull failed:', err.message)
      return null
    }
  }

  /**
   * Push pending local operations to the server
   */
  async push(): Promise<{ pushed: number; conflicts: number; errors: number }> {
    if (!this.hotelId) return { pushed: 0, conflicts: 0, errors: 0 }

    const lastVersion = await getCheckpoint(this.hotelId, '*')
    const pending = await offlineQueue.getPending()

    if (pending.length === 0) return { pushed: 0, conflicts: 0, errors: 0 }

    try {
      const response = await apiClient.post(`${SYNC_API_BASE}/sync/push`, {
        hotelId: this.hotelId,
        deviceId: this.deviceId,
        lastSyncVersion: lastVersion,
        operations: pending.map((op) => ({
          operationId: op.operationId,
          operationType: op.operationType,
          resourceType: op.resourceType,
          resourceId: op.resourceId,
          payload: op.payload,
          clientTimestamp: op.clientTimestamp,
          priority: op.priority,
        })),
      })

      const result = response.data as SyncPushResponse

      // Mark processed operations
      for (const processed of result.processed) {
        await offlineQueue.markCompleted(processed.operationId)
      }

      // Handle conflicts (server wins by default)
      for (const conflict of result.conflicts) {
        // Update local cache with server data
        const cacheKey = `sync:${conflict.resourceType}:${this.hotelId}`
        const cached = await getCachedResponse<any[]>(cacheKey)
        if (cached) {
          const idx = cached.data.findIndex((r: any) => r.id === conflict.resourceId)
          if (idx >= 0) {
            cached.data[idx] = conflict.serverData
            await cacheApiResponse(cacheKey, cached.data, 7 * 24 * 60 * 60 * 1000)
          }
        }
        await offlineQueue.markCompleted(conflict.operationId)
      }

      // Mark errors
      for (const err of result.errors) {
        await offlineQueue.markFailed(e
