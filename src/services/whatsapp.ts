/**
 * WhatsApp API Service — EN LIGNE UNIQUEMENT
 *
 * WhatsApp nécessite une connexion réseau (API externe Meta).
 * Ces fonctions utilisent apiClient direct, pas offlineAwareApiCall.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'

/**
 * Test WhatsApp configuration for a hotel
 */
export const testWhatsappConfiguration = async (
  hotelId: number,
  payload: {
    recipient_phone_number: string
    message?: string
    providerType?: string
    config?: Record<string, any>
  }
): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post(`/hotels/${hotelId}/whatsapp/test`, payload)
    return response.data
  } catch (error) {
    console.error('Error testing WhatsApp configuration:', error)
    throw error
  }
}

/**
 * Get WhatsApp logs (OK en cache offline, mais nécessite connexion pour des logs frais)
 */
export const getWhatsappLogs = async (
  reservationId: number,
  hotelId: number,
  page: number = 1,
  perPage: number = 20
): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.get(`/hotels/${hotelId}/whatsapp-logs`, {
      params: { reservationId, page, perPage },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching WhatsApp logs:', error)
    throw error
  }
}
