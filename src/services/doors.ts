/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
const axios = apiClient

const API_URL = `${import.meta.env.VITE_API_URL as string}/access_control`
const API_URL_TERMINAL = `${import.meta.env.VITE_API_URL as string}/terminal`

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
 * Teste la connexion avec un terminal
 */
export const testDoorConnection = (id: number): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/doors/${id}/test-connection`,{}, getAuthHeaders())
}

/**
 * Déverrouille une porte à distance
 */
export const unlockDoorRemote = (id: number, duration?: number): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/doors/${id}/unlock`, { duration }, getAuthHeaders())
}


/**
 * Synchronise les logs d'un terminal
 */
export const syncDoorLogs = (id: number, clearAfterSync: boolean = false): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/doors/${id}/sync-logs`, { clear_after_sync: clearAfterSync }, getAuthHeaders())
}


/**
 * Synchronise l'heure d'un terminal
 */

export const syncDoorTime = (id: number): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/doors/${id}/sync-time`, {}, getAuthHeaders())
}

/**
 * Récupère les informations d'un terminal par son ID
 */
export const getInfo = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/doors/${id}/info`, getAuthHeaders())
}



/**
 * Récupère l'historique d'accès d'un terminal
 */
export const getDoorLogs = (id: number, params?: {
  page?: number
  per_page?: number
  start_date?: string
  end_date?: string
  user_id?: string
}): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/doors/${id}/logs`, {...getAuthHeaders(), params })
}


/**
 *
 * Retry Queue
 */


export const retryTerminalQueue  = (id: number): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL_TERMINAL}/${id}/retry-queue`, {}, getAuthHeaders())
}
