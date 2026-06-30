/**
 * Transportation Request API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Create Transportation Request
 */
export const createTransportationRequest = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/transportation-requests', {
      data,
      resourceType: 'transportation',
      queuePriority: 5,
    })
    return result.data
  } catch (error) {
    console.error('Error creating transportation request:', error)
    throw error
  }
}
