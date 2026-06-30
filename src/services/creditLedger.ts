/**
 * Credit Ledger API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

export const getCreditBalance = async (guestId: number, hotelId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/credit_ledgers/hotels/${hotelId}/guests/${guestId}/credit-balance`, {
      resourceType: 'folio',
      resourceId: guestId,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching credit balance:', error)
    throw error
  }
}

export const applyCredit = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', `/credit_ledgers/hotels/${data.hotelId}/guests/${data.guestId}/apply-credit`, {
      data,
      resourceType: 'folio',
      resourceId: data.guestId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error applying credit:', error)
    throw error
  }
}
