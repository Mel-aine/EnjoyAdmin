/**
 * Dexie.js Database for Offline Mode
 *
 * Provides IndexedDB-backed storage for:
 * - apiCache: Cached API responses (GET requests)
 * - syncQueue: Pending write operations to sync later
 * - drafts: Unsaved form drafts
 * - checkpoints: Sync state tracking per device
 */
import Dexie, { type EntityTable } from 'dexie'

// ── Types ──────────────────────────────────────────────────────────────

export interface CachedResponse {
  id?: number
  key: string
  data: any
  cachedAt: number
  ttl: number
}

export interface SyncOperation {
  id?: number
  operationId: string
  operationType: 'create' | 'update' | 'delete'
  resourceType: string
  resourceId?: number | null
  payload: Record<string, any>
  priority: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  clientTimestamp: string
  retryCount: number
  maxRetries: number
  errorMessage?: string | null
  createdAt: number
}

export interface Draft {
  id?: number
  key: string
  data: Record<string, any>
  updatedAt: number
}

export interface SyncCheckpoint {
  id?: number
  hotelId: number
  resourceType: string
  lastSyncVersion: number
  lastSyncAt: number
}

// ── Database ───────────────────────────────────────────────────────────

class OfflineDatabase extends Dexie {
  apiCache!: EntityTable<CachedResponse, 'id'>
  syncQueue!: EntityTable<SyncOperation, 'id'>
  drafts!: EntityTable<Draft, 'id'>
  checkpoints!: EntityTable<SyncCheckpoint, 'id'>

  constructor() {
    super('EnjoyPMSOffline')

    this.version(1).stores({
      apiCache: '++id, key, cachedAt, resourceType',
      syncQueue: '++id, operationId, status, priority, createdAt',
      drafts: '++id, key',
      checkpoints: '++id, [hotelId+resourceType]',
    })
  }
}

export const db = new OfflineDatabase()

// ── API Cache Helpers ──────────────────────────────────────────────────

export async function cacheApiResponse(
  key: string,
  data: any,
  ttl: number = 5 * 60 * 1000
): Promise<void> {
  await db.apiCache.where('key').equals(key).delete()
  await db.apiCache.add({ key, data, cachedAt: Date.now(), ttl })
}

export async function getCachedResponse<T = any>(
  key: string,
  maxStale: number = 0
): Promise<{ data: T; stale: boolean } | null> {
  const entry = await db.apiCache.where('key').equals(key).first()
  if (!entry) return null

  const age = Date.now() - entry.cachedAt
  if (age <= entry.ttl) {
    return { data: entry.data as T, stale: false }
  }
  if (maxStale > 0 && age <= entry.ttl + maxStale) {
    return { data: entry.data as T, stale: true }
  }
  await db.apiCache.where('key').equals(key).delete()
  return null
}

export async function clearExpiredCache(): Promise<number> {
  const now = Date.now()
  return db.apiCache.filter((e) => now > e.cachedAt + e.ttl).delete()
}

// ── Sync Queue Helpers ─────────────────────────────────────────────────

export async function queueOperation(
  op: Omit<SyncOperation, 'id' | 'createdAt' | 'status' | 'retryCount'>
): Promise<number> {
  const id = await db.syncQueue.add({
    ...op,
    status: 'pending',
    retryCount: 0,
    createdAt: Date.now(),
  })
  return id ?? 0
}

export async function getPendingOperations(): Promise<SyncOperation[]> {
  const items = await db.syncQueue
    .where('status').equals('pending')
    .toArray()
  return items.sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt)
}

export async function markOperationCompleted(operationId: string): Promise<void> {
  await db.syncQueue.where('operationId').equals(operationId).modify({ status: 'completed' })
}

export async function markOperationFailed(operationId: string, error: string): Promise<void> {
  const entry = await db.syncQueue.where('operationId').equals(operationId).first()
  if (!entry) return
  const newRetryCount = (entry.retryCount || 0) + 1
  const status = newRetryCount >= entry.maxRetries ? 'failed' : 'pending'
  await db.syncQueue.where('operationId').equals(operationId).modify({
    status,
    retryCount: newRetryCount,
    errorMessage: error,
  })
}

export async function getQueueStats(): Promise<{
  pending: number
  processing: number
  completed: number
  failed: number
}> {
  const all = await db.syncQueue.toArray()
  return {
    pending: all.filter((o) => o.status === 'pending').length,
    processing: all.filter((o) => o.status === 'processing').length,
    completed: all.filter((o) => o.status === 'completed').length,
    failed: all.filter((o) => o.status === 'failed').length,
  }
}

export async function clearCompletedOperations(): Promise<void> {
  await db.syncQueue.where('status').equals('completed').delete()
}

// ── Draft Helpers ──────────────────────────────────────────────────────

export async function saveDraft(key: string, data: Record<string, any>): Promise<void> {
  await db.drafts.put({ key, data, updatedAt: Date.now() })
}

export async function loadDraft<T = Record<string, any>>(key: string): Promise<T | null> {
  const draft = await db.drafts.where('key').equals(key).first()
  return (draft?.data as T) ?? null
}

export async function deleteDraft(key: string): Promise<void> {
  await db.drafts.where('key').equals(key).delete()
}

// ── Checkpoint Helpers ─────────────────────────────────────────────────

export async function updateCheckpoint(
  hotelId: number,
  resourceType: string,
  lastSyncVersion: number
): Promise<void> {
  const existing = await db.checkpoints
    .where(['hotelId+resourceType']).equals([hotelId, resourceType]).first()
  if (existing) {
    await db.checkpoints.update(existing.id!, { lastSyncVersion, lastSyncAt: Date.now() })
  } else {
    await db.checkpoints.add({ hotelId, resourceType, lastSyncVersion, lastSyncAt: Date.now() })
  }
}

export async function getCheckpoint(hotelId: number, resourceType: string): Promise<number> {
  const cp = await db.checkpoints
    .where(['hotelId+resourceType']).equals([hotelId, resourceType]).first()
  return cp?.lastSyncVersion ?? 0
}
