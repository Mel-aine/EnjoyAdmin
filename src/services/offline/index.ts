/**
 * Offline Module — Barrel Export
 *
 * Point d'entrée unique pour tous les services offline.
 * Les nouveaux composants doivent importer depuis ce module.
 *
 * Exemple :
 *   import { db, syncManager, OfflineCacheService } from '@/services/offline'
 *   import { TemporaryIdService } from '@/services/offline/idService'
 */
export { db, cacheApiResponse, getCachedResponse, clearExpiredCache, queueOperation } from './db.js'
export type {
  CachedResponse, SyncOperation, Draft, SyncCheckpoint,
  OfflineReservation, OfflineGuest, OfflineFolio, OfflineFolioTransaction,
  OfflineRoom, OfflineRoomType, OfflineRoomRate, OfflineRateType,
  OfflineBookingSource, OfflinePaymentMethod, OfflineTaxRate,
  OfflineExtraCharge, OfflineDiscount, OfflineVipStatus,
  OfflineBlackListReason, OfflineBusinessSource, OfflineMarketCode,
  OfflineReservationType, OfflineRoomBlock, OfflineWorkOrder,
  OfflineAnnouncement, OfflineNotification, OfflineReservationRoom,
  OfflineConflict,
} from './db.js'
export { getTableForResource, tableSupportsTempIds } from './db.js'
export { offlineQueue } from './queue.js'
export type { QueueInput, QueueResult } from './queue.js'
export { syncManager } from './syncManager.js'
export { OfflineCacheService, TTL } from './cacheService.js'
export { offlineAwareApiCall } from './apiProxy.js'
export type { ApiProxyOptions, ApiProxyResult } from './apiProxy.js'
export { DraftService } from './draftService.js'
export { useOfflineStore } from './offlineStore.js'
export { isOnline, connectionQuality, pendingOperations, isSyncing } from './connectionState.js'
export { TemporaryIdService } from './idService.js'
