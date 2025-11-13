/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type { FitlterItem } from '../utils/models'

const API_URL = `${import.meta.env.VITE_API_URL as string}/hotels`


const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}


///// this is the amenities sections
/**
 * Get all amenities
 * @returns {Promise<AxiosResponse<any>>}
 */

export const updateStatusColors = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/${id}/status-colors`, data, getHeaders())
}

/**
 * update hotel information
 * @param id
 * @param data
 * @returns
 */
export const updateHotelInformation = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/information`, data, getHeaders())
}


/**
 * update hotel notices
 * @param id
 * @param data
 * @returns
 */
export const updateHotelNotices = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/notices`, data, getHeaders())
}

/**
 * update hotel formula setting
 * @param id
 * @param data
 * @returns
 */
export const updateHotelFormulaSetting = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/formula-setting`, data, getHeaders())
}

/**
 * update hotel document numbering setting
 * @param id
 * @param data
 * @returns
 */
export const updateHotelDocumentNumberingSetting = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/document-numbering-setting`, data, getHeaders())
}

/**
 * update hotel print email settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelPrintEmailSettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/print-email-settings`, data, getHeaders())
}

/**
 * update hotel checkin reservation settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelCheckinReservationSettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/checkin-reservation-settings`, data, getHeaders())
}

/**
 * update hotel display settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelDisplaySettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/display-settings`, data, getHeaders())
}

/**
 * update hotel registration settings
 * @param id
 * @param data
 * @returns
 */
export const updateHotelRegistrationSettings = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/registration-settings`, data, getHeaders())
}

/**
 * update hotel housekeeping-status-colors
 * @param id
 * @param data
 * @returns
 */
export const updateHotelHousekeepingStatusColors = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/housekeeping-status-colors`, data, getHeaders())
}

/***
 * update hotel tax rates validator
 * @param id
 * @param data
 * @returns
 */
export const updateHotelTaxRates = (id:number,data:any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/${id}/tax-rates`, data, getHeaders())
}



// Find reservation
// export const filterReservation = (id: number, filter: FitlterItem): Promise<AxiosResponse<any>> => {
//   let qs = ``
//   if (filter.checkInDate) {
//     if (qs) qs += `&checkInDate=${filter.checkInDate}`
//     else qs += `?checkInDate=${filter.checkInDate}`
//   }
//   if (filter.checkOutDate) {
//     if (qs) qs += `&checkOutDate=${filter.checkOutDate}`
//     else qs += `?checkOutDate=${filter.checkOutDate}`
//   }
//   if (filter.roomType) {
//     if (qs) qs += `&roomType=${filter.roomType}`
//     else qs += `?roomType=${filter.roomType}`
//   }
//   if (filter.searchText) {
//     if (qs) qs += `&searchText=${filter.searchText}`
//     else qs += `?searchText=${filter.searchText}`
//   }
//   if (filter.status) {
//     if (qs) qs += `&status=${filter.status}`
//     else qs += `?status=${filter.status}`
//   }
//   return axios.get(`${API_URL}/${id}/reservation/search${qs}`, getHeaders())
// }
export const filterReservation = (id: number, filter: FitlterItem): Promise<AxiosResponse<any>> => {
  const params = new URLSearchParams()

  if (filter.checkInDate) params.append('checkInDate', filter.checkInDate)
  if (filter.checkOutDate) params.append('checkOutDate', filter.checkOutDate)
  if (filter.roomType) params.append('roomType', filter.roomType.toString())
  if (filter.rateType) params.append('rateType', filter.rateType)
  if (filter.searchText) params.append('searchText', filter.searchText)
  if (filter.status) params.append('status', filter.status)
  if (filter.reservationType) params.append('reservationType', filter.reservationType)
  if (filter.source) params.append('source', filter.source)
  if (filter.dateType) params.append('dateType', filter.dateType)
  if (filter.dateStart) params.append('dateStart', filter.dateStart)
  if (filter.dateEnd) params.append('dateEnd', filter.dateEnd)
  if (filter.stayCheckInDate) params.append('stayCheckInDate', filter.stayCheckInDate)
  if (filter.stayCheckOutDate) params.append('stayCheckOutDate', filter.stayCheckOutDate)
  if (filter.showBookings) params.append('showBookings', filter.showBookings)

  const qs = params.toString()
  return axios.get(`${API_URL}/${id}/reservation/search${qs ? '?' + qs : ''}`, getHeaders())
}
