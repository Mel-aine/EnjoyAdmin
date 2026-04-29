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


export const getCreditBalance = (guestId: number, hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/credit_ledgers/hotels/${hotelId}/guests/${guestId}/credit-balance`, getAuthHeaders())
}

export const applyCredit = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/credit_ledgers/hotels/${data.hotelId}/guests/${data.guestId}/apply-credit`, data, getAuthHeaders())
}






