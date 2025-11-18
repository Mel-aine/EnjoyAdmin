/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../composables/serviceStore'
const axios = apiClient


const URL = `${import.meta.env.VITE_API_URL as string}`
const API_URL = () => {
  const hotelId = useServiceStore().serviceId
  return `${URL}/configuration/hotels/${hotelId}/rate_types`
}
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

export const getRateTypes = (id:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL()}/hotel/${id}`, getHeaders())
}

export const getRateTypesByRoomTypes = (id:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL()}/roomType/${id}`, getHeaders())
}
