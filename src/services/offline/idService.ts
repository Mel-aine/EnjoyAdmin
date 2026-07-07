/**
 * TemporaryIdService
 *
 * Gestion des identifiants temporaires pour les créations hors ligne.
 *
 * Quand une entité est créée hors ligne (ex: réservation, client), elle reçoit
 * un ID temporaire au format `tmp-{uuid}`. Lors de la synchronisation, le serveur
 * attribue un vrai ID et le service remplace les références dans toutes les tables.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PRINCIPE :
 * - Création offline → ID temporaire (ex: "tmp-a1b2c3d4")
 * - Stockage dans la table dédiée avec l'ID temporaire comme clé primaire
 * - Toutes les entités liées référencent cet ID temporaire
 * - Sync → le serveur retourne l'ID définitif → mise à jour de toutes les références
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { v4 as uuidv4 } from 'uuid'

const TEMP_ID_PREFIX = 'tmp-'

export class TemporaryIdService {
  /**
   * Génère un ID temporaire unique
   */
  static generate(): string {
    return `${TEMP_ID_PREFIX}${uuidv4()}`
  }

  /**
   * Vérifie si un ID est temporaire
   */
  static isTemporary(id: number | string | null | undefined): boolean {
    if (id === null || id === undefined) return false
    return String(id).startsWith(TEMP_ID_PREFIX)
  }

  /**
   * Résout les IDs temporaires après une synchronisation réussie.
   *
   * Cette méthode doit être appelée après chaque opération de création
   * synchronisée avec le serveur.
   *
   * @param serverResponse - Réponse du serveur contenant le nouvel ID
   * @param localOperationType - Type de ressource local
   * @param localId - Ancien ID temporaire
   */
  static async resolveId(
    serverResponse: { serverId?: number; id?: number; data?: { id?: number } },
    localOperationType: string,
    localId: number | string | null | undefined
  ): Promise<void> {
    if (!localId || !this.isTemporary(localId)) return

    // Extraire le nouvel ID serveur
    const newId = serverResponse.serverId ?? serverResponse.id ?? serverResponse.data?.id
    if (!newId || newId === localId) return

    // Importer db dynamiquement pour éviter les dépendances circulaires
    const { db, getTableForResource } = await import('./db.js')

    // 1. Migrer l'entrée dans sa table dédiée
    const table = getTableForResource(localOperationType)
    if (table) {
      const entry = await (db as any)[table].get(localId)
      if (entry) {
        await (db as any)[table].delete(localId)
        entry.id = newId
        entry._tempId = false
        entry._pending = false
        delete entry._operationId
        await (db as any)[table].put(entry)
      }
    }

    // 2. Mettre à jour toutes les références vers cet ID dans les autres tables
    await this.updateReferences(localOperationType, localId, newId)

    // 3. Mettre à jour aussi les entrées dans l'apiCache (rétrocompatibilité)
    const oldKey = `${localOperationType}:${localId}`
    const newKey = `${localOperationType}:${newId}`
    const cacheEntry = await db.apiCache.where('key').equals(oldKey).first()
    if (cacheEntry) {
      await db.apiCache.delete(cacheEntry.id!)
      const data = cacheEntry.data
      data.id = newKey
      data.resourceId = newId
      await db.apiCache.add({ ...cacheEntry, key: newKey, data })
    }
  }

  /**
   * Met à jour les références aux IDs temporaires dans les tables liées.
   *
   * Exemple : si une réservation (tmp-123) a été créée hors ligne et que des
   * folios ou transactions la référencent, on met à jour ces références.
   */
  private static async updateReferences(
    resourceType: string,
    oldId: number | string,
    newId: number | string
  ): Promise<void> {
    const { db } = await import('./db.js')

    // Mapping des types de ressources et des champs de référence à mettre à jour
    const refMap: Record<string, { table: string; field: string }[]> = {
      reservation: [
        { table: 'folios', field: 'reservationId' },
        { table: 'folioTransactions', field: 'reservationId' },
        { table: 'reservationRooms', field: 'reservationId' },
      ],
      guest: [
        { table: 'reservations', field: 'guestId' },
        { table: 'folios', field: 'guestId' },
      ],
      folio: [
        { table: 'folioTransactions', field: 'folioId' },
      ],
      room: [
        { table: 'reservationRooms', field: 'roomId' },
        { table: 'roomBlocks', field: 'roomId' },
        { table: 'workOrders', field: 'roomId' },
      ],
    }

    const refs = refMap[resourceType] || []
    for (const ref of refs) {
      try {
        const items = await (db as any)[ref.table]
          .where(ref.field)
          .equals(oldId)
          .toArray()

        for (const item of items) {
          await (db as any)[ref.table].update(item.id, {
            [ref.field]: newId,
          })
        }
      } catch {
        // La table peut ne pas exister (ex: pas encore migrée)
      }
    }
  }

  /**
   * Nettoie les IDs temporaires qui n'ont jamais été synchronisés
   * (plus de 7 jours). Appelé périodiquement.
   */
  static async cleanOrphanedTempIds(): Promise<number> {
    const { db, getTableForResource } = await import('./db.js')
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    let cleaned = 0

    const tablesToCheck = [
      'reservations', 'reservationRooms', 'guests',
      'folios', 'folioTransactions', 'rooms',
    ]

    for (const tableName of tablesToCheck) {
      try {
        const items = await (db as any)[tableName]
          .filter((item: any) => {
            if (!item._tempId) return false
            const createdAt = item.createdAt ? new Date(item.createdAt).getTime() : 0
            return createdAt > 0 && createdAt < sevenDaysAgo
          })
          .toArray()

        for (const item of items) {
          await (db as any)[tableName].delete(item.id)
          cleaned++
        }
      } catch {
        // Table peut ne pas exister
      }
    }

    return cleaned
  }
}
