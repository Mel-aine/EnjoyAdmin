/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/guests`
const API_URL1 = `${import.meta.env.VITE_API_URL as string}`

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

// Interface for Guest data
export interface GuestPayload {
  hotelId?:number
  title?: string
  firstName?: string
  lastName?: string
  name?: string
  phonePrimary?: string
  mobileNumber?: string
  guestType?: string
  email?: string
  gender?: string
  addressLine?: string
  stateProvince?:string
  postalCode?:string
  city?: string
  management?: string
  country?: string
  nationality?: string
  companyName?: string
  fax?: string
  registrationNumber?: string
  profilePhoto?: string
  idPhoto?: string
  idExpiryDate?: string
  issuingCountry?: string
  issuingCity?: string
  vipStatusId?: any
  idType?: string
  idNumber?: string
  dateOfBirth?: string
  placeOfBirth?: string
  profession?: string
  maidenName?: string
  contactType?: string
  reservationId?: number
  preferences?: any;
  contactTypeValue?:string
}

/**
 * Create a new guest
 */
export const createGuest = (guestData: GuestPayload): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}`, guestData, getHeaders())
}

/**
 * Update existing guest
 */
export const updateGuest = (id: number, guestData: GuestPayload): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}`, guestData, getHeaders())
}

/**
 * Get guest by ID
 */
export const getGuestById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}`, getHeaders())
}



/**
 * Delete guest
 */
export const deleteGuest = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/${id}`, getHeaders())
}

/**
 * guest detail
 */
export const getCustomerProfile = (
  id: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}/profile`, getHeaders())
}

/**
 * Blacklist a guest
 */
export const toggleGuestBlacklist = (id: number, reason: string): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/${id}/toggle-blacklist`, { reason }, getHeaders())
}

/**
 * Fetch guests with optional filters
 */
export const getGuests = (params: any = {}): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}`, { ...getHeaders(), params })
}

/**
 * get Activitylog
 */
export const getGuestsActivityLogs = (hotelId: number ,guestId:number,params: any = {}): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL1}/activity-log/${hotelId}/guests/${guestId}/activity-logs`, { ...getHeaders(), params })
}
