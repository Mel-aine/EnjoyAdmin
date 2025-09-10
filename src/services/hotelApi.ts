/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type { FitlterItem } from '../utils/models'

const API_URL = `${import.meta.env.VITE_API_URL as string}/hotels`


const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}


///// this is the amenities sections
/**
 * Get all amenities
 * @returns {Promise<AxiosResponse<any>>}
 */

export const updateStatusColors = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/${id}/status-colors`, data, headers)
}

/**
 * update hotel information
 * @param id
 * @param data
 * @returns
 */
export const updateHotelInformation = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/information`, data, headers)
}


/**
 * update hotel notices
 * @param id
 * @param data
 * @returns
 */
export const updateHotelNotices = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/notices`, data, headers)
}

/**
 * update hotel formula setting
 * @param id
 * @param data
 * @returns
 */
export const updateHotelFormulaSetting = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/formula-setting`, data, headers)
}

/**
 * update hotel document numbering setting
 * @param id
 * @param data
 * @returns
 */
export const updateHotelDocumentNumberingSetting = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/document-numbering-setting`, data, headers)
}

/**
 * update hotel print email settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelPrintEmailSettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/print-email-settings`, data, headers)
}

/**
 * update hotel checkin reservation settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelCheckinReservationSettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/checkin-reservation-settings`, data, headers)
}

/**
 * update hotel display settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelDisplaySettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/display-settings`, data, headers)
}

/**
 * update hotel registration settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelRegistrationSettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/registration-settings`, data, headers)
}



// Find reservation
export const filterReservation = (id: number, filter: FitlterItem): Promise<AxiosResponse<any>> => {
  let qs = ``
  if (filter.checkInDate) {
    if (qs) qs += `&checkInDate=${filter.checkInDate}`
    else qs += `?checkInDate=${filter.checkInDate}`
  }
  if (filter.checkOutDate) {
    if (qs) qs += `&checkOutDate=${filter.checkOutDate}`
    else qs += `?checkOutDate=${filter.checkOutDate}`
  }
  if (filter.roomType) {
    if (qs) qs += `&roomType=${filter.roomType}`
    else qs += `?roomType=${filter.roomType}`
  }
  if (filter.searchText) {
    if (qs) qs += `&searchText=${filter.searchText}`
    else qs += `?searchText=${filter.searchText}`
  }
  if (filter.status) {
    if (qs) qs += `&status=${filter.status}`
    else qs += `?status=${filter.status}`
  }
  return axios.get(`${API_URL}/${id}/reservation/search${qs}`, headers)
}