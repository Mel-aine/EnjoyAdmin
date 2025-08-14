/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type {
  RoomTypeData,
} from '@/types/option'

const API_URL = `${import.meta.env.VITE_API_URL as string}/foglio`



const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

/**
 * get All Foglio
 */
export const getAllFoglio = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(API_URL, headers)
    return response.data
  } catch (error) {
    console.error('Error fetching foglio:', error)
    throw error
  }
}

/**
 * get Foglio with query parameters
 */
export const getFoglioWithParams = async (params: {
  page?: number
  limit?: number
  search?: string
  hotel_id?: number
  guest_id?: number
  reservation_id?: number
  folio_type?: string
  status?: string
  has_balance?: boolean
  is_overdue?: boolean
  date_from?: string
  date_to?: string
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()
    
    // Add parameters to query string if they exist
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.hotel_id) queryParams.append('hotel_id', params.hotel_id.toString())
    if (params.guest_id) queryParams.append('guest_id', params.guest_id.toString())
    if (params.reservation_id) queryParams.append('reservation_id', params.reservation_id.toString())
    if (params.folio_type) queryParams.append('folio_type', params.folio_type)
    if (params.status) queryParams.append('status', params.status)
    if (params.has_balance !== undefined) queryParams.append('has_balance', params.has_balance.toString())
    if (params.is_overdue !== undefined) queryParams.append('is_overdue', params.is_overdue.toString())
    if (params.date_from) queryParams.append('date_from', params.date_from)
    if (params.date_to) queryParams.append('date_to', params.date_to)
    
    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL
    const response: AxiosResponse = await axios.get(url, headers)
    return response.data
  } catch (error) {
    console.error('Error fetching foglio with params:', error)
    throw error
  }
}

/**
 * get Foglio by id
 */
export const getFoglioById = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}`, headers)
    return response.data
  } catch (error) {
    console.error('Error fetching foglio:', error)
    throw error
  }
}

/**
 * create Foglio
 */
export const createFoglio = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(API_URL, data, headers)
    return response.data
  } catch (error) {
    console.error('Error creating foglio:', error)
    throw error
  }
}

/**
 * update Foglio
 */
export const updateFoglio = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${API_URL}/${id}`, data, headers)
    return response.data
  } catch (error) {
    console.error('Error updating foglio:', error)
    throw error
  }
}

/**
 * delete Foglio
 */
export const deleteFoglio = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.delete(`${API_URL}/${id}`, headers)
    return response.data
  } catch (error) {
    console.error('Error deleting foglio:', error)
    throw error
  }
}


