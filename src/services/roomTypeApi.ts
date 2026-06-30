/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../composables/serviceStore'
import { db } from './offline/db.js'
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
 * get Room Types (avec cache offline)
 */
export const getRoomTypes = async (id: number): Promise<AxiosResponse<any>> => {
  const cacheKey = `room-types:${id}`

  try {
    const response = await axios.get(`${API_URL()}`, getHeaders())
    // Mettre en cache
    try {
      await db.apiCache.where('key').equals(cacheKey).delete()
      await db.apiCache.add({ key: cacheKey, data: response.data, cachedAt: Date.now(), ttl: 30 * 60 * 1000 })
    } catch {}
    return response
  } catch (error: any) {
    // En cas d'erreur réseau, essayer le cache
    if (!error?.response || error?.code === 'ECONNABORTED' || error?.message === 'Network Error') {
      try {
        const cached = await db.apiCache.where('key').equals(cacheKey).first()
        if (cached) {
          return { data: cached.data, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse
        }
      } catch {}
    }
    throw error
  }
}

export const getRoomTypesIndex = (id:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL()}/index`, getHeaders())
}
