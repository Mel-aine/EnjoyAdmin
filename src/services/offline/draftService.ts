/**
 * DraftService
 *
 * Service de sauvegarde automatique des formulaires.
 * Utilise IndexedDB plutôt que localStorage pour les gros volumes.
 * Les brouillons survivent aux rechargements de page et au mode offline.
 */
import { db } from './db.js'

interface DraftEntry {
  id?: number
  formKey: string
  data: Record<string, any>
  updatedAt: string
  hotelId?: number
  userId?: number
}

export class DraftService {
  /**
   * Sauvegarder un brouillon
   */
  static async save(
    formKey: string,
    data: Record<string, any>,
    meta?: { hotelId?: number; userId?: number }
  ): Promise<void> {
    const existing = await db.drafts.where('key').equals(formKey).first()
    const payload = {
      key: formKey,
      data,
      updatedAt: Date.now(),
    }

    if (existing) {
      await db.drafts.put({ id: existing.id, ...payload })
    } else {
      await db.drafts.add(payload)
    }
  }

  /**
   * Restaurer un brouillon
   */
  static async restore<T = Record<string, any>>(formKey: string): Promise<T | null> {
    const draft = await db.drafts.where('key').equals(formKey).first()
    if (!draft) return null
    return draft.data as T
  }

  /**
   * Supprimer un brouillon
   */
  static async delete(formKey: string): Promise<void> {
    await db.drafts.where('key').equals(formKey).delete()
  }

  /**
   * Lister tous les brouillons disponibles
   */
  static async list(): Promise<{ formKey: string; updatedAt: Date }[]> {
    const drafts = await db.drafts.toArray()
    return drafts.map(d => ({
      formKey: d.key,
      updatedAt: new Date(d.updatedAt),
    })).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  /**
   * Vérifier si un brouillon existe
   */
  static async exists(formKey: string): Promise<boolean> {
    const draft = await db.drafts.where('key').equals(formKey).first()
    return draft !== undefined
  }

  /**
   * Supprimer tous les brouillons expirés (plus de 7 jours)
   */
  static async cleanExpired(): Promise<number> {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const expired = await db.drafts
      .filter(d => d.updatedAt < sevenDaysAgo)
      .delete()
    return expired
  }

  /**
   * Supprimer tous les brouillons (changement d'hôtel)
   */
  static async clearAll(): Promise<void> {
    await db.drafts.clear()
  }
}
