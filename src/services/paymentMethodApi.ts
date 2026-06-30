/**
 * Payment Method API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Get Payment Methods
 */
export const getPaymentMethods = async (hotelId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/payment_method/${hotelId}`, {
      resourceType: 'payment_method',
    })
    return result.data
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    throw error
  }
}
