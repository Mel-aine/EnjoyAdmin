/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../composables/serviceStore'
const axios = apiClient

const URL = `${import.meta.env.VITE_API_URL as string}`
const API_URL = () => {
  const hotelId = useServiceStore().serviceId
  return `${URL}/configuration/hotels/${hotelId}/room_types`
}
const getHeaders = () => {
  const authStore = useAuthStore()
  const serviceStore = useServiceStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'X-Hotel-Code': String(serviceStore?.serviceId ?? ''),
    },
    withCredentials: true,
  }
}


/**
 * get Room Types
 */

export const getRoomTypes = (id:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL()}`, getHeaders())
}

export const getRoomTypesIndex = (id:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL()}/index`, getHeaders())
}
