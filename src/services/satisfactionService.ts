
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const axios = apiClient
const API_URL = `${import.meta.env.VITE_API_URL as string}`

const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  }
}

export const getSatisfactionStats = (hotelId: number, period: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/hotels/${hotelId}/satisfaction-stats?period=${period}`, getAuthHeaders())
}