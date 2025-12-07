/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/work_orders`

// Function to get headers with current token
const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: false,
  }
}

export interface WorkOrderFilters {
  search?: string
  status?: string
  priority?: string
  category?: string
  assigned_to?: number
  room_id?: number
  date_from?: string
  date_to?: string
  per_page?: number
  page?: number
}

/**
 * Create Work Order
 */
export const createWorkOrder = (data: any): Promise<AxiosResponse<any>> => {
  console.log('Creating work order with data:', data)
  return axios.post(API_URL, data, getAuthHeaders())
}

/**
 * Get Work Order by Hotel ID
 */
export const getWorkOrder = (hotelId: any,params:any={}): Promise<AxiosResponse<any>> => {
  console.log('Fetching work Order for hotel ID:', hotelId)
  return axios.get(`${API_URL}?hotelId=${hotelId}`, {...getAuthHeaders(),params})
}

/**
 * Update work order
 */
export const updateWorkOrder = (orderId: number, data: any): Promise<AxiosResponse<any>> => {
  console.log('Updating work order:', orderId, 'with data:', data)
  return axios.put(`${API_URL}/${orderId}`, data, getAuthHeaders())
}

/**
 * Delete work order
 */
export const deleteWorkOrder = (orderId: number): Promise<AxiosResponse<any>> => {
  console.log('Deleting work order:', orderId)
  return axios.delete(`${API_URL}/${orderId}`, getAuthHeaders())
}



/**
 * Get work order with filters
 */
export const getWorkOrderWithFilters = (
  hotelId: string,
  filters?: {
    start_date?: string
    end_date?: string
    room_id?: string
    status?: string
  }
): Promise<AxiosResponse<any>> => {
  const params = new URLSearchParams()

  if (filters?.start_date) params.append('start_date', filters.start_date)
  if (filters?.end_date) params.append('end_date', filters.end_date)
  if (filters?.room_id) params.append('room_id', filters.room_id)
  if (filters?.status) params.append('status', filters.status)

  const url = `${API_URL}/${hotelId}${params.toString() ? `?${params.toString()}` : ''}`
  console.log('Fetching work order with filters:', url)

  return axios.get(url, getAuthHeaders())
}

/**
 * Update Status
 */
export const updateStatusWorkOrder = (oderId: number ,data:any): Promise<AxiosResponse<any>> => {
  console.log('status:', oderId)
  return axios.put(`${API_URL}/${oderId}/status`, data, getAuthHeaders())
}
