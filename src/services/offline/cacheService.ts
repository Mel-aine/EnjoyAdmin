/**
 * OfflineCacheService
 *
 * Service avancé de cache local via IndexedDB.
 * Gère le stockage structuré, l'invalidation, la synchronisation
 * et les éléments en attente.
 */
import { db, type CachedResponse, cacheApiResponse, getCachedResponse } from './db.js'

// Durées de vie par type de ressource (en ms)
export const TTL = {
  CONFIG: 7 * 24 * 60 * 60 * 1000,       // 7 jours (tarifs, types chambres, taxes)
  DATA: 24 * 60 * 60 * 1000,              // 1 jour (réservations, clients)
  TRANSACTION: 7 * 24 * 60 * 60 * 1000,   // 7 jours (transactions financières)
  TEMP: 5 * 60 * 1000,                    // 5 minutes (disponibilités)
  REFERENCE: 30 * 24 * 60 * 60 * 1000,    // 30 jours (méthodes paiement, suppléments)
} as const

const DEFAULT_TTL = TTL.DATA

export class OfflineCacheService {
  /**
   * Mettre en cache une entrée
   */
  static async set<T>(
    resourceType: string,
    resourceId: number | string,
    data: T,
    options?: { ttlMs?: number; version?: number; pending?: boolean }
  ): Promise<void> {
    const key = `${resourceType}:${resourceId}`
    const ttl = options?.ttlMs ?? DEFAULT_TTL
    const version = options?.version ?? (data as any)?.version ?? 1

    await cacheApiResponse(key, {
      id: key,
      resourceType,
      resourceId,
      data,
      version,
      pending: options?.pending ?? false,
    }, ttl)
  }

  /**
   * Récupérer une entrée du cache
   */
  static async get<T = any>(
    resourceType: string,
    resourceId: number | string
  ): Promise<{ data: T; version: number; pending: boolean } | null> {
    const key = `${resourceType}:${resourceId}`
    const entry = await getCachedResponse<{
      id: string
      resourceType: string
      resourceId: number | string
      data: T
      version: number
      pending: boolean
    }>(key)

    if (!entry) return null

    return {
      data: entry.data.data,
      version: entry.data.version,
      pending: entry.data.pending,
    }
  }

  /**
   * Récupérer toutes les ressources d'un type
   */
  static async getAll<T = any>(
    resourceType: string,
    filter?: (item: T) => boolean
  ): Promise<T[]> {
    const entries = await db.apiCache
      .filter(e => {
        const meta = e.data as any
        return meta?.resourceType === resourceType && !meta?.pending
      })
      .toArray()

    let data = entries.map(e => (e.data as any).data as T)

    if (filter) {
      data = data.filter(filter)
    }

    return data
  }

  /**
   * Invalider le cache pour une ressource ou un type entier
   */
  static async invalidate(resourceType: string, resourceId?: number | string): Promise<void> {
    if (resourceId !== undefined) {
      const key = `${resourceType}:${resourceId}`
      await db.apiCache.where('key').equals(key).delete()
    } else {
      const all = await db.apiCache.toArray()
      const toDelete = all.filter(e => {
        const meta = e.data as any
        return meta?.resourceType === resourceType
      })
      for (const entry of toDelete) {
        if (entry.id !== undefined) {
          await db.apiCache.delete(entry.id)
        }
      }
    }
  }

  /**
   * Récupérer les éléments en attente de synchronisation
   */
  static async getPendingItems<T = any>(resourceType?: string): Promise<T[]> {
    let entries = await db.apiCache.toArray()

    entries = entries.filter(e => {
      const meta = e.data as any
      if (!meta?.pending) return false
      if (resourceType && meta.resourceType !== resourceType) return false
      return true
    })

    return entries.map(e => (e.data as any).data as T)
  }

  /**
   * Mettre à jour le cache avec des données fraîches du serveur
   */
  static async syncFromServer<T>(
    resourceType: string,
    resourceId: number | string,
    data: T,
    version: number
  ): Promise<void> {
    const key = `${resourceType}:${resourceId}`
    const existing = await getCachedResponse<Record<string, any>>(key)

    if (existing) {
      // Merge plutôt que remplacer pour préserver les métadonnées
      const meta = { ...existing.data }
      meta.data = data
      meta.version = version
      meta.pending = false
      await cacheApiResponse(key, meta, TTL.DATA)
    } else {
      await this.set(resourceType, resourceId, data, { version })
    }
  }

  /**
   * Vider toutes les données métier (quand l'utilisateur change d'hôtel)
   */
  static async clearHotelData(): Promise<void> {
    const businessTypes = [
      'reservation', 'reservation_room', 'guest',
      'folio', 'folio_transaction', 'room'
    ]
    const all = await db.apiCache.toArray()
    for (const entry of all) {
      const meta = entry.data as any
      if (meta?.resourceType && businessTypes.includes(meta.resourceType)) {
        if (entry.id !== undefined) {
          await db.apiCache.delete(entry.id)
        }
      }
    }
    await db.checkpoints.clear()
  }

  /**
   * Compter les éléments en cache par type
   */
  static async countByType(): Promise<Record<string, number>> {
    const all = await db.apiCache.toArray()
    const counts: Record<string, number> = {}
    for (const entry of all) {
      const meta = entry.data as any
      const type = meta?.resourceType ?? 'unknown'
      counts[type] = (counts[type] || 0) + 1
    }
    return counts
  }

  /**
   * Vérifier si un type de ressource est disponible offline
   */
  static async isAvailable(resourceType: string, minCount: number = 1): Promise<boolean> {
    const items = await this.getAll(resourceType)
    return items.length >= minCount
  }
}
