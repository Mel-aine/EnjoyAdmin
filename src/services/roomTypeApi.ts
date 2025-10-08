/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/configuration`

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}


/**
 * get Room Types
 */

export const getRoomTypes = (id:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/hotels/${id}/room_types`, getHeaders())
}
