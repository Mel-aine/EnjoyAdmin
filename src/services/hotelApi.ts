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