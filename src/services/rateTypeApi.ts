/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/configuration/rate_types`


const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}


/**
 * get Room Types
 */

export const getRateTypes = (id:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}/hotel`, headers)
}
