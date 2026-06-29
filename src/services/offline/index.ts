/**
 * Offline Module — Barrel Export
 */
export { db, cacheApiResponse, getCachedResponse, clearExpiredCache, queueOperation } from './db.js'
export type { CachedResponse, SyncOperation, Draft, SyncCheckpoint } from './db.js'
export { offlineQueue } from './queue.js'
export type { QueueInput, QueueResult } from './queue.js'
export { syncManager } from './syncManager.js'
export { OfflineCacheService, TTL } from './cacheService.js'
export { offlineAwareApiCall } from './apiProxy.js'
export type { ApiProxyOptions, ApiProxyResult } from './apiProxy.js'
export { DraftService } from './draftService.js'
export { useOfflineStore } from './offlineStore.js'
export { isOnline, connectionQuality, pendingOperations, isSyncing } from './connectionState.js'
