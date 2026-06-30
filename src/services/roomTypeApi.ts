/**
 * Room Type API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne
 * (cache pour les GET, file d'attente pour les écritures).
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Get Room Types (avec cache offline via offlineAwareApiCall)
 */
export const getRoomTypes = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/configuration/hotels/${id}/room_types`, {
      resourceType: 'room_type',
    })
    return result.data
  } catch (error) {
    console.error('Erreur récupération des room types:', error)
    throw error
  }
}

export const getRoomTypesIndex = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/configuration/hotels/${id}/room_types/index`, {
      resourceType: 'room_type',
    })
    return result.data
  } catch (error) {
    console.error('Erreur récupération des room types index:', error)
    throw error
  }
}
