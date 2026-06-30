/**
 * Rate Type API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'
import { useServiceStore } from '../composables/serviceStore'

/**
 * Get Rate Types by hotel ID
 */
export const getRateTypes = async (hotelId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/configuration/hotels/${hotelId}/rate_types/hotel/${hotelId}`, {
      resourceType: 'rate_type',
    })
    return result.data
  } catch (error) {
    console.error('Error fetching rate types:', error)
    throw error
  }
}

/**
 * Get Rate Types by room type ID
 */
export const getRateTypesByRoomTypes = async (roomTypeId: number, hotelId?: number): Promise<any> => {
  const id = hotelId ?? useServiceStore().serviceId ?? 0
  try {
    const result = await offlineAwareApiCall('GET', `/configuration/hotels/${id}/rate_types/roomType/${roomTypeId}`, {
      resourceType: 'rate_type',
      resourceId: roomTypeId,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching rate types by room type:', error)
    throw error
  }
}
