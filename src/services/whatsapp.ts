/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/hotels`

const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }
}

/**
 * Test WhatsApp configuration for a hotel
 */
export const testWhatsappConfiguration = (
  hotelId: number,
  payload: {
    recipient_phone_number: string
    message?: string
    providerType?: string
    config?: Record<string, any>
  }
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/${hotelId}/whatsapp/test`, payload, getAuthHeaders())
}

/**
 * WhatsApp Log
 */
export const getWhatsappLogs = (
  reservationId: number,
  hotelId: number,
  page: number = 1,
  perPage: number = 20
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}/whatsapp-logs`, {
    params: { reservationId, page, perPage },
    ...getAuthHeaders()
  })
}