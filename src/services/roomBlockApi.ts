/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/room-blocks`

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

/**
 * Create Room Block
 */
export const createRoomBlock = (data: any): Promise<AxiosResponse<any>> => {
  console.log('Creating room block with data:', data)
  return apiClient.post(API_URL, data, getAuthHeaders())
}

/**
 * Get Room Blocks by Hotel ID
 */
export const getRoomBlocks = (hotelId: any,params:any={}): Promise<AxiosResponse<any>> => {
  console.log('Fetching room blocks for hotel ID:', hotelId)
  return apiClient.get(`${API_URL}/${hotelId}`, {...getAuthHeaders(),params})
}

/**
 * Update Room Block
 */
export const updateRoomBlock = (blockId: string, data: any): Promise<AxiosResponse<any>> => {
  console.log('Updating room block:', blockId, 'with data:', data)
  return apiClient.put(`${API_URL}/${blockId}`, data, getAuthHeaders())
}

/**
 * Delete Room Block
 */
export const deleteBlock = (blockId: string): Promise<AxiosResponse<any>> => {
  console.log('Deleting room block:', blockId)
  return apiClient.delete(`${API_URL}/${blockId}`, getAuthHeaders())
}

/**
 * Get Room Block by ID
 */
export const getRoomBlockById = (blockId: string): Promise<AxiosResponse<any>> => {
  console.log('Fetching room block by ID:', blockId)
  return apiClient.get(`${API_URL}/single/${blockId}`, getAuthHeaders())
}

/**
 * Get Room Blocks with filters
 */
export const getRoomBlocksWithFilters = (
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
  console.log('Fetching room blocks with filters:', url)

  return apiClient.get(url, getAuthHeaders())
}

/**
 * Bulk delete Room Blocks
 */
export const bulkDeleteBlocks = (blockIds: string[]): Promise<AxiosResponse<any>> => {
  console.log('Bulk deleting room blocks:', blockIds)
  return apiClient.delete(`${API_URL}/bulk`, {
    ...getAuthHeaders(),
    data: { blockIds }
  })
}
