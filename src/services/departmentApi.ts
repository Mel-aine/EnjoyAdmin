/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
const axios = apiClient

const API_URL = `${import.meta.env.VITE_API_URL as string}`

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
 * Create departement
 */
export const createDepartment = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/department`, data, getAuthHeaders())
}

/**
 * get departement
 */
export const getDepartment = (hotelId: any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/department?hotelId=${hotelId}`, getAuthHeaders())
}

/**
 * update
 */
export const updateDpt = (
  id: number,
  data: any
): Promise<AxiosResponse<any>> => {
  return axios.put(
    `${API_URL}/department/${id}`,
    data,
    getAuthHeaders()
  )
}

export const deleteDpt = ( id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/department/${id}`, getAuthHeaders())
}




