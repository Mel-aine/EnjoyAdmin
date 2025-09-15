
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/payment_method`

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
 * get Payment Methodes
 */

export const getPaymentMethods = (hotelId:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}`, getHeaders())
}



