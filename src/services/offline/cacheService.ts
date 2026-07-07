/**
 * OfflineCacheService
 *
 * Service de cache local via IndexedDB.
 * Utilise désormais les tables métier dédiées (v2) pour un stockage structuré
 * avec des index optimisés et la sécurité de typage TypeScript.
 *
 * Conserve la rétrocompatibilité avec l'ancien système de cache générique.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MIGRATION DEPUIS L'ANCIEN SYSTÈME (apiCache générique) :
 * - Les opérations de lecture/écriture utilisent maintenant les tables dédiées
 * - L'ancien apiCache est conservé pour les données qui n'ont pas encore migré
 * - Le mapping resourceType → table se fait via getTableForResource()
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { db, getTableForResource, tableSupportsTempIds } from './db.js'
import { cacheApiResponse, getCachedResponse } from './db.js' // rétrocompatibilité

// ── Durées de vie par type de ressource (en ms) ─────────────────────────

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
   * Durée de vie recommandée par type de ressource
   */
  static getTTL(resourceType: string): number {
    if (resourceType === 'folio_transaction' || resourceType === 'folioTransaction') {
      return TTL.TRANSACTION
    }
    const configTypes = [
      'room_type', 'rate_type', 'room_rate', 'booking_source',
      'payment_method', 'tax_rate', 'extra_charge', 'discount',
      'vip_status', 'black_list_reason', 'business_source',
      'market_code', 'reservation_type', 'roomType', 'rateType',
    ]
    if (configTypes.includes(resourceType)) return TTL.CONFIG
    if (resourceType === 'hotel' || resourceType.startsWith('room_')) return TTL.REFERENCE
    return TTL.DATA
  }

  /**
   * Mettre en cache une entrée dans sa table dédiée.
   *
   * Utilise la table métier correspondante (ex: 'reservations' pour 'reservation').
   * Si aucune table dédiée n'existe, tombe dans le cache générique apiCache.
   */
  static async set<T>(
    resourceType: string,
    resourceId: number | string,
    data: T,
    options?: { ttlMs?: number; version?: number; pending?: boolean }
  ): Promise<void> {
    const table = getTableForResource(resourceType)

    if (table) {
      // Stockage dans la table dédiée
      const entry: Record<string, any> = {
        id: resourceId,
        ...(data as Record<string, any>),
        _pending: options?.pending ?? false,
        version: options?.version ?? (data as any)?.version ?? 1,
        _cachedAt: Date.now(),
      }

      // S'assurer que les champs obligatoires sont présents
      if (!entry.createdAt) entry.createdAt = new Date().toISOString()
      if (!entry.updatedAt) entry.updatedAt = new Date().toISOString()

      // Ajouter hotelId si présent dans les données
      if ((data as any)?.hotelId !== undefined) {
        entry.hotelId = (data as any).hotelId
      }

      await (db as any)[table].put(entry)
    } else {
      // Fallback vers l'ancien cache générique
      const key = `${resourceType}:${resourceId}`
      const ttl = options?.ttlMs ?? DEFAULT_TTL
      await cacheApiResponse(key, {
        id: key,
        resourceType,
        resourceId,
        data,
        version: options?.version ?? (data as any)?.version ?? 1,
        pending: options?.pending ?? false,
      }, ttl)
    }
  }

  /**
   * Récupérer une entrée depuis sa table dédiée.
   */
  static async get<T = any>(
    resourceType: string,
    resourceId: number | string
  ): Promise<{ data: T; version: number; pending: boolean } | null> {
    const table = getTableForResource(resourceType)

    if (table) {
      const entry = await (db as any)[table].get(resourceId)
      if (!entry) return null

      return {
        data: entry as unknown as T,
        version: entry.version ?? 1,
        pending: entry._pending ?? false,
      }
    }

    // Fallback vers l'ancien cache générique
    const key = `${resourceType}:${resourceId}`
    const cached = await getCachedResponse<{
      id: string
      resourceType: string
      resourceId: number | string
      data: T
      version: number
      pending: boolean
    }>(key)

    if (!cached) return null

    return {
      data: cached.data.data,
      version: cached.data.version,
      pending: cached.data.pending,
    }
  }

  /**
   * Récupérer toutes les ressources d'un type depuis la table dédiée.
   */
  static async getAll<T = any>(
    resourceType: string,
    filter?: (item: T) => boolean
  ): Promise<T[]> {
    const table = getTableForResource(resourceType)

    if (table) {
      let items = await (db as any)[table].toArray() as T[]
      if (filter) {
        items = items.filter(filter)
      }
      return items
    }

    // Fallback vers l'ancien cache générique
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
   * Invalider le cache pour une ressource ou un type entier.
   */
  static async invalidate(resourceType: string, resourceId?: number | string): Promise<void> {
    const table = getTableForResource(resourceType)

    if (table) {
      if (resourceId !== undefined) {
        await (db as any)[table].delete(resourceId)
      } else {
        await (db as any)[table].clear()
      }
    }

    // Invalider aussi dans l'ancien cache générique
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
   * Récupérer les éléments en attente de synchronisation.
   */
  static async getPendingItems<T = any>(resourceType?: string): Promise<T[]> {
    // Chercher dans les tables dédiées
    const tables = getTableForResource(resourceType || '') ? [getTableForResource(resourceType || '')!] : [
      'reservations', 'guests', 'folios', 'folioTransactions', 'rooms',
    ]

    const results: T[] = []

    for (const tableName of tables) {
      const items = await (db as any)[tableName]
        .filter((item: any) => item._pending === true)
        .toArray()
      results.push(...(items as T[]))
    }

    // Chercher aussi dans l'ancien cache pour les ressources non migrées
    let cacheEntries = await db.apiCache.toArray()
    cacheEntries = cacheEntries.filter(e => {
      const meta = e.data as any
      if (!meta?.pending) return false
      if (resourceType && meta.resourceType !== resourceType) return false
      return true
    })

    results.push(...cacheEntries.map(e => (e.data as any).data as T))

    return results
  }

  /**
   * Mettre à jour le cache avec des données fraîches du serveur.
   * Supprime le flag _pending et met à jour la version.
   */
  static async syncFromServer<T>(
    resourceType: string,
    resourceId: number | string,
    data: T,
    version: number
  ): Promise<void> {
    const table = getTableForResource(resourceType)

    if (table) {
      const existing = await (db as any)[table].get(resourceId)
      if (existing) {
        await (db as any)[table].update(resourceId, {
          ...(data as Record<string, any>),
          _pending: false,
          _version: version,
          updatedAt: new Date().toISOString(),
        })
      } else {
        await this.set(resourceType, resourceId, data, { version })
      }
    }

    // Mettre à jour aussi l'ancien cache
    const key = `${resourceType}:${resourceId}`
    const existing = await getCachedResponse<Record<string, any>>(key)
    if (existing) {
      const meta = { ...existing.data }
      meta.data = data
      meta.version = version
      meta.pending = false
      await cacheApiResponse(key, meta, this.getTTL(resourceType))
    } else {
      await this.set(resourceType, resourceId, data, { version })
    }
  }

  /**
   * Vider toutes les données métier (changement d'hôtel).
   */
  static async clearHotelData(): Promise<void> {
    const tables = [
      'reservations', 'reservationRooms', 'guests',
      'folios', 'folioTransactions', 'rooms',
      'roomBlocks', 'workOrders', 'notifications',
    ]
    for (const table of tables) {
      await (db as any)[table].clear()
    }
    await db.checkpoints.clear()
    await db.conflicts.clear()
    // Ne pas vider la queue (opérations en attente) ni les drafts
  }

  /**
   * Compter les éléments en cache par type de ressource.
   */
  static async countByType(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {}

    // Compter dans les tables dédiées
    const businessTables = [
      { name: 'reservations', key: 'reservation' },
      { name: 'guests', key: 'guest' },
      { name: 'folios', key: 'folio' },
      { name: 'folioTransactions', key: 'folio_transaction' },
      { name: 'rooms', key: 'room' },
      { name: 'roomTypes', key: 'room_type' },
      { name: 'roomRates', key: 'room_rate' },
      { name: 'rateTypes', key: 'rate_type' },
      { name: 'bookingSources', key: 'booking_source' },
      { name: 'paymentMethods', key: 'payment_method' },
      { name: 'taxRates', key: 'tax_rate' },
      { name: 'extraCharges', key: 'extra_charge' },
      { name: 'discounts', key: 'discount' },
      { name: 'workOrders', key: 'work_order' },
      { name: 'roomBlocks', key: 'room_block' },
    ]

    for (const { name, key } of businessTables) {
      try {
        const count = await (db as any)[name].count()
        if (count > 0) counts[key] = count
      } catch {
        // Table peut ne pas exister si la migration n'a pas eu lieu
      }
    }

    // Compter aussi dans l'apiCache pour les données non migrées
    const all = await db.apiCache.toArray()
    for (const entry of all) {
      const meta = entry.data as any
      const type = meta?.resourceType ?? 'unknown'
      if (type !== 'unknown') {
        counts[type] = (counts[type] || 0) + 1
      }
    }

    return counts
  }

  /**
   * Vérifier si un type de ressource est disponible dans le cache local.
   */
  static async isAvailable(resourceType: string, minCount: number = 1): Promise<boolean> {
    const items = await this.getAll(resourceType)
    return items.length >= minCount
  }
}
