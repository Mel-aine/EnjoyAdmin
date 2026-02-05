/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
const axios = apiClient

const API_URL = `${import.meta.env.VITE_API_URL as string}/staff-access-cards`

// Function to get headers with current token
const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  }
}

/**
 * create staff master card
 */

export const createMasterCard = async (payload: {
  userId?: number
  staffFirstName?: string
  staffLastName?: string
  staffPosition?: string
  staffPhoneNumber?: string
  staffEmployeeId?: string
  cardUid: string
  accessType: 'master' | 'limited' | 'temporary'
  notes?: string
  doorIds?: number[]
  validFrom?: string
  validUntil?: string
}): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/`, payload ,getAuthHeaders())
}

/**
 * Récupérer tous les badges
 */
// export const getMasterCards = async (params?: {
//   page?: number
//   perPage?: number
//   status?: 'active' | 'revoked' | 'lost' | 'suspended'
//   accessType?: 'master' | 'limited' | 'temporary'
// }) => {
//   try {
//     const response = await axios.get(`${API_URL}/`, {params} ,getAuthHeaders())
//     return response
//   } catch (error) {
//     console.error('Error fetching master cards:', error)
//     throw error
//   }
// }

export const getMasterCards = (params:any = {}): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/`, getAuthHeaders())
}

/**
 * Récupérer un badge par ID
 */
export const getMasterCard = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching master card:', error)
    throw error
  }
}



/**
 * Révoquer un badge
 */
export const revokeMasterCard = async (id: number, reason?: string) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/revoke`, { reason } ,getAuthHeaders())
    return response
  } catch (error) {
    console.error('Error revoking master card:', error)
    throw error
  }
}

/**
 * Désactiver un badge
 */
export const deactivateMasterCard = async (id: number) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/deactivate`)
    return response
  } catch (error) {
    console.error('Error deactivating master card:', error)
    throw error
  }
}

/**
 * sync
 */
export const syncMasterCardAPI = (cardId: number): Promise<AxiosResponse<any>> =>  {
  return axios.post(`/staff-access-cards/${cardId}/sync`,{},getAuthHeaders())
}
