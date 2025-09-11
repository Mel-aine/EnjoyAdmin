/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type {

  FitlterItem

} from '@/utils/models'

const API_URL = `${import.meta.env.VITE_API_URL as string}`

// Function to get headers with current token
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

/**
 * Create User Assignment
 */
export const createTransportationRequest = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/transportation-requests`, data, getAuthHeaders())
}


