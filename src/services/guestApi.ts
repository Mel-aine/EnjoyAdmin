/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/guests`

const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

// Interface for Guest data
export interface GuestPayload {
  hotelId?:number
  title?: string
  firstName?: string
  lastName?: string
  name?: string
  phonePrimary?: string
  mobile?: string
  email?: string
  gender?: string
  address?: string
  city?: string
  management?: string
  country?: string
  nationality?: string
  company?: string
  fax?: string
  registrationNo?: string
  vipStatus?: string
  idType?: string
  idNumber?: string
  dateOfBirth?: string
  reservationId?: number
}

/**
 * Create a new guest
 */
export const createGuest = (guestData: GuestPayload): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/`, guestData, headers)
}

/**
 * Update existing guest
 */
export const updateGuest = (id: number, guestData: GuestPayload): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}`, guestData, headers)
}

/**
 * Get guest by ID
 */
export const getGuestById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}`, headers)
}



/**
 * Delete guest
 */
export const deleteGuest = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/${id}`, headers)
}

/**
 * guest detail
 */
export const getCustomerProfile = (
  id: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}/profile`, headers)
}
