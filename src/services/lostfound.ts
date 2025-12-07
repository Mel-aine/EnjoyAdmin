import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

//const API_URL = import.meta.env.VITE_API_URL as string;

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: false,
  }
}

export interface CheckInPayload {
  reservationId: number
}

export interface CheckOutPayload {
  reservationId: number
}

export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
}

/* const handleApiError = (error: any): never => {
  console.error('Erreur API:', error)
  throw {
    message: error.response?.data?.message || 'Erreur API',
    error: error.response?.data?.error || error.message,
  }
} */

//ajouter un objet perdu/trouvé
export const addLostFound = async (data: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      '/lost-found', data, getHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Erreur ajout objet perdu/trouvé:', error)
  }
}

// recuperer la liste des objets perdus/trouvés
export const getLostFound = async (params:any={}): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `/lost-found`, {...getHeaders(),params}
    )
    return response.data
  } catch (error) {
    console.error('Erreur récupération objets perdus/trouvés:', error)
    return []
  }
}

//update un objet perdu/trouvé

export const updateLostFoundItem = async (itemId: number, data: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.put(
      `/lost-found/${itemId}`, data, getHeaders()
    )
    return response.data
  }
    catch (error) {
        console.error('Erreur mise à jour objet perdu/trouvé:', error)
        return undefined
    }
}

//recuperer un objet perdu/trouvé

export const getLostFoundItem = async (itemId: number): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `/lost-found/${itemId}`, getHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Erreur récupération objet perdu/trouvé:', error)
    return undefined
    }
}

//supprimer un objet perdu/trouvé
export const deleteLostFoundItem = async (itemId: number): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.delete(
      `/lost-found/${itemId}`, getHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Erreur suppression objet perdu/trouvé:', error)
    return undefined
  }
}
