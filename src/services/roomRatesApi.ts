import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: false,
  }
}

/**
 * Get Base Rate by Room and Rate Type
 */
interface BaseRateParams {
  hotel_id: number
  room_type_id: number
  rate_type_id: number
  date?: string
}

interface BaseRateResponse {
  message: string
  baseRate: number | null
  data:any
}

/**
 * Récupère le base rate pour une combinaison room type + rate type + date
 */


export const getBaseRateByRoomAndRateType = async (params: BaseRateParams) => {
  try {
    const response = await apiClient.get<any>(`/configuration/hotels/${params.hotel_id}/room_rates/base-rate`, {
      ...getHeaders(),
      params: {
        hotel_id: params.hotel_id,
        room_type_id: params.room_type_id,
        rate_type_id: params.rate_type_id,
        date: params.date || new Date().toISOString().split('T')[0],
      },
    })

    return response.data
  } catch (error) {
    console.error('Error fetching base rate:', error)
    throw error
  }
}

