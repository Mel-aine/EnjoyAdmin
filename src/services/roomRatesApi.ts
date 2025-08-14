import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/room-rates`

const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

/**
 * Get Base Rate by Room and Rate Type
 */
export const getBaseRateByRoomAndRateType = (
  hotelId: number,
  roomTypeId: number,
  rateTypeId: number,
  date?: string
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/base-rate`, {
    ...headers,
    params: {
      hotel_id: hotelId,
      room_type_id: roomTypeId,
      rate_type_id: rateTypeId,
      date: date || new Date().toISOString().split('T')[0],
    },
  })
}
