
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../composables/serviceStore'
const axios = apiClient

const API_URL = `${import.meta.env.VITE_API_URL as string}/payment_method`

const getHeaders = () => {
  const authStore = useAuthStore()
  const serviceStore = useServiceStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'X-Hotel-Code': String(serviceStore?.serviceId ?? ''),
    },
    withCredentials: false,
  }
}


/**
 * get Payment Methodes
 */

export const getPaymentMethods = (hotelId:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${hotelId}`, getHeaders())
}


