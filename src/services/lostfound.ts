/**
 * Lost & Found API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Add lost/found item
 */
export const addLostFound = async (data: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', '/lost-found', {
      data,
      resourceType: 'lost_found',
      queuePriority: 5,
    })
    return result.data
  } catch (error) {
    console.error('Erreur ajout objet perdu/trouvé:', error)
  }
}

/**
 * Get list of lost/found items
 */
export const getLostFound = async (params: any = {}): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', '/lost-found', {
      resourceType: 'lost_found',
      params,
    })
    return result.data
  } catch (error) {
    console.error('Erreur récupération objets perdus/trouvés:', error)
    return []
  }
}

/**
 * Update a lost/found item
 */
export const updateLostFoundItem = async (itemId: number, data: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/lost-found/${itemId}`, {
      data,
      resourceType: 'lost_found',
      resourceId: itemId,
      queuePriority: 5,
    })
    return result.data
  } catch (error) {
    console.error('Erreur mise à jour objet perdu/trouvé:', error)
    return undefined
  }
}

/**
 * Get a single lost/found item
 */
export const getLostFoundItem = async (itemId: number): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('GET', `/lost-found/${itemId}`, {
      resourceType: 'lost_found',
      resourceId: itemId,
    })
    return result.data
  } catch (error) {
    console.error('Erreur récupération objet perdu/trouvé:', error)
    return undefined
  }
}

/**
 * Delete a lost/found item
 */
export const deleteLostFoundItem = async (itemId: number): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('DELETE', `/lost-found/${itemId}`, {
      resourceType: 'lost_found',
      resourceId: itemId,
      queuePriority: 5,
    })
    return result.data
  } catch (error) {
    console.error('Erreur suppression objet perdu/trouvé:', error)
    return undefined
  }
}
