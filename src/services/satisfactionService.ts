/**
 * Satisfaction Stats API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

export const getSatisfactionStats = async (hotelId: number, period: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/hotels/${hotelId}/satisfaction-stats`, {
      resourceType: 'satisfaction',
      params: { period },
    })
    return result.data
  } catch (error) {
    console.error('Error fetching satisfaction stats:', error)
    throw error
  }
}
