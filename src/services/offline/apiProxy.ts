/**
 * OfflineApiProxy
 *
 * Proxy intelligent qui intercepte les appels API et les route
 * vers Axios (si en ligne) ou vers IndexedDB (si hors ligne).
 *
 * Pour les écritures hors ligne :
 * 1. Met à jour le cache local de manière optimiste
 * 2. Ajoute l'opération à la file d'attente
 * 3. Retourne une réponse simulée à l'appelant
 *
 * Usage :
 *   import { offlineAwareApiCall } from '@/services/offline/apiProxy'
 *   const result = await offlineAwareApiCall('GET', '/api/reservations', {
 *     resourceType: 'reservation',
 *     cacheTTL: TTL.DATA,
 *   })
 */
import apiClient from '../apiClient.js'
import { OfflineCacheService } from './cacheService.js'
import { offlineQueue } from './queue.js'
import { useOfflineStore } from './offlineStore.js'

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiProxyOptions {
  data?: any
  params?: Record<string, any>
  resourceType?: string
  resourceId?: number | string
  queuePriority?: number
  optimisticData?: any
  cacheTTL?: number
  skipCache?: boolean
  maxRetries?: number
}

export interface ApiProxyResult<T = any> {
  data: T
  fromCache?: boolean
  offlineQueued?: boolean
  operationId?: string
  error?: string
}

/**
 * Détecte si une erreur est une erreur réseau (pas de réponse serveur)
 */
function isNetworkError(error: any): boolean {
  return !error?.response
    || error?.code === 'ECONNABORTED'
    || error?.message === 'Network Error'
    || error?.message?.includes('timeout')
    || error?.message?.includes('Failed to fetch')
}

/**
 * Convertit une méthode HTTP en type d'opération pour la queue
 */
function methodToOperationType(method: ApiMethod): 'create' | 'update' | 'delete' {
  switch (method) {
    case 'POST': return 'create'
    case 'PUT':
    case 'PATCH': return 'update'
    case 'DELETE': return 'delete'
    default: return 'update'
  }
}

/**
 * Détermine si une méthode HTTP est une écriture
 */
function isWriteMethod(method: ApiMethod): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
}

/**
 * Appel API offline-aware
 *
 * - En ligne : appelle Axios normalement, met en cache les GET
 * - Hors ligne : retourne le cache pour les GET, met en file d'attente pour les écritures
 * - Erreur réseau : fallback vers le comportement hors ligne
 */
export async function offlineAwareApiCall<T = any>(
  method: ApiMethod,
  url: string,
  options?: ApiProxyOptions
): Promise<ApiProxyResult<T>> {
  const store = useOfflineStore()
  const resourceType = options?.resourceType
  const resourceId = options?.resourceId
  const cacheKey = resourceType && resourceId ? `${resourceType}:${resourceId}` : url

  // ── Si en ligne → appel API normal ────────────────────────────
  if (store.isOnline) {
    try {
      const response = await apiClient.request<T>({
        method,
        url,
        data: options?.data,
        params: options?.params,
      })

      // Mettre en cache les GET
      if (method === 'GET' && resourceType && !options?.skipCache) {
        const id = resourceId ?? url
        await OfflineCacheService.set(resourceType, id, response.data, {
          ttlMs: options?.cacheTTL,
        })
      }

      // Mettre à jour le cache après écriture
      if (isWriteMethod(method) && resourceType && response.data) {
        const serverId = (response.data as any)?.id
          ?? (response.data as any)?.serverId
          ?? resourceId
        if (serverId) {
          await OfflineCacheService.set(resourceType, serverId, response.data, {
            ttlMs: options?.cacheTTL,
          })
        }
      }

      // Rafraîchir le compteur
      await store.refreshPendingCount()

      return { data: response.data }
    } catch (error: any) {
      // Erreur réseau → fallback offline
      if (isNetworkError(error)) {
        store.setOnline(false)
        return handleOfflineFallback(method, url, options, cacheKey)
      }
      // Autre erreur (4xx, 5xx) → la propager
      throw error
    }
  }

  // ── Si hors ligne → comportement offline ──────────────────────
  return handleOfflineFallback(method, url, options, cacheKey)
}

/**
 * Comportement quand on est hors ligne ou que le réseau est injoignable
 */
async function handleOfflineFallback<T>(
  method: ApiMethod,
  url: string,
  options?: ApiProxyOptions,
  cacheKey?: string
): Promise<ApiProxyResult<T>> {
  const resourceType = options?.resourceType
  const resourceId = options?.resourceId

  // ── GET : retourner le cache ──────────────────────────────────
  if (method === 'GET') {
    if (resourceType && resourceId) {
      const cached = await OfflineCacheService.get<T>(resourceType, resourceId)
      if (cached) {
        return { data: cached.data, fromCache: true }
      }
    }

    // GET sans resourceId : retourner tous les éléments du type
    if (method === 'GET' && resourceType && !resourceId) {
      const allData = await OfflineCacheService.getAll<T>(resourceType)
      if (allData.length > 0) {
        return { data: allData as unknown as T, fromCache: true }
      }
    }

    // GET avec URL personnalisée : chercher par clé de cache
    if (cacheKey) {
      const cached = await OfflineCacheService.get<T>(resourceType || 'unknown', cacheKey)
      if (cached) {
        return { data: cached.data, fromCache: true }
      }
    }

    return {
      data: null as unknown as T,
      error: 'Données non disponibles hors ligne',
    }
  }

  // ── Écriture : mise en file d'attente + cache optimiste ───────
  if (isWriteMethod(method)) {
    const opType = methodToOperationType(method)
    const priority = options?.queuePriority ?? 5

    // Stockage optimiste dans le cache local
    if (options?.optimisticData) {
      const localId = resourceId ?? `tmp-${Date.now()}`
      await OfflineCacheService.set(
        resourceType || 'unknown',
        localId,
        options.optimisticData,
        { pending: true, ttlMs: 7 * 24 * 60 * 60 * 1000 }
      )
    }

    // Ajout à la file d'attente
    const operationId = await offlineQueue.enqueue({
      operationType: opType,
      resourceType: resourceType || 'unknown',
      resourceId: typeof resourceId === 'string' ? parseInt(resourceId, 10) || null : resourceId ?? null,
      payload: options?.data || {},
      priority,
      maxRetries: options?.maxRetries ?? 3,
    })

    // Mettre à jour le store
    const store = useOfflineStore()
    await store.refreshPendingCount()

    return {
      data: (options?.optimisticData || {
        _operationId: operationId,
        _offlineQueued: true,
        _message: 'Opération mise en attente de synchronisation',
      }) as unknown as T,
      offlineQueued: true,
      operationId,
    }
  }

  throw new Error(`Opération ${method} non supportée hors ligne`)
}
