/**
 * Room Rates API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne
 * (cache pour les GET, file d'attente pour les écritures).
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Get Base Rate by Room and Rate Type
 */
interface BaseRateParams {
  hotel_id: number
  room_type_id: number
  rate_type_id: number
  date?: string
}

/**
 * Récupère le base rate pour une combinaison room type + rate type + date
 */
export const getBaseRateByRoomAndRateType = async (params: BaseRateParams) => {
  try {
    const result = await offlineAwareApiCall('GET', `/configuration/hotels/${params.hotel_id}/room_rates/base-rate`, {
      resourceType: 'room_rate',
      params: {
        hotel_id: params.hotel_id,
        room_type_id: params.room_type_id,
        rate_type_id: params.rate_type_id,
        date: params.date || new Date().toISOString().split('T')[0],
      },
    })
    return result.data
  } catch (error) {
    console.error('Error fetching base rate:', error)
    throw error
  }
}
