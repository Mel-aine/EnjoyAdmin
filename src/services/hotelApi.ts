/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type { FitlterItem } from '../utils/models'
import { useServiceStore } from '../composables/serviceStore'
import { db } from './offline/db.js'
const axios = apiClient

const API_URL = `${import.meta.env.VITE_API_URL as string}/hotels`


const getHeaders = () => {
  const authStore = useAuthStore()
  const serviceStore = useServiceStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'X-Hotel-Code': String(serviceStore?.serviceId ?? ''),
    },
    withCredentials: true,
  }
}

export const getHotelById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}/details`, getHeaders())
}

export const getById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}`, getHeaders())
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



/**
 * Toggle offline mode for a hotel
 * @param id - Hotel ID
 * @param enabled - Whether to enable (true) or disable (false) offline mode
 * @returns {Promise<AxiosResponse<any>>}
 */
export const toggleOfflineMode = (id: number, enabled: boolean): Promise<AxiosResponse<any>> => {
  return axios.patch(`${API_URL}/${id}/toggle-offline-mode`, { enabled }, getHeaders())
}

/**
 * Get offline mode status for a hotel
 * @param id - Hotel ID
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getOfflineModeStatus = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/${id}/offline-mode-status`, getHeaders())
}

/**
 * Search/filter reservations with offline cache fallback.
 */
export const filterReservation = async (id: number, filter: FitlterItem): Promise<AxiosResponse<any>> => {
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
  const url = `${API_URL}/${id}/reservation/search${qs ? '?' + qs : ''}`
  const cacheKey = `filter-reservation:${id}:${qs}`

  try {
    const response = await axios.get(url, getHeaders())
    // Mettre en cache la réponse
    try {
      await db.apiCache.where('key').equals(cacheKey).delete()
      await db.apiCache.add({ key: cacheKey, data: response.data, cachedAt: Date.now(), ttl: 10 * 60 * 1000 })
    } catch {}
    return response
  } catch (error: any) {
    // En cas d'erreur réseau, essayer le cache local
    if (!error?.response || error?.code === 'ECONNABORTED' || error?.message === 'Network Error') {
      try {
        // Essayer d'abord le cache spécifique de cette recherche
        const cached = await db.apiCache.where('key').equals(cacheKey).first()
        if (cached) {
          return { data: cached.data, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse
        }
        // Fallback: chercher toutes les réservations en cache et filtrer localement
        const allEntry = await db.apiCache.where('key').equals(`sync:reservation:${id}`).first()
        if (allEntry && Array.isArray(allEntry.data)) {
          const searchTerm = (filter.searchText || '').toLowerCase()
          const today = new Date().toISOString().split('T')[0]
          const filtered = allEntry.data.filter((r: any) => {
            if (!searchTerm) return true
            const name = (r.guest?.displayName || r.guest?.firstName || '').toLowerCase()
            const num = String(r.reservationNumber || '').toLowerCase()
            return name.includes(searchTerm) || num.includes(searchTerm)
          })
          // Calculer les statistiques de base
          const arrivals = filtered.filter((r: any) => (r.arrivedDate || '').startsWith(today)).length
          const departures = filtered.filter((r: any) => (r.departDate || '').startsWith(today)).length
          const inHouse = filtered.filter((r: any) =>
            r.status === 'checked_in' &&
            (r.arrivedDate || '') <= today &&
            (r.departDate || '') > today
          ).length

          return {
            data: {
              reservations: filtered,
              statistics: {
                totalReservations: filtered.length,
                arrivals,
                departures,
                inHouse,
              },
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          } as AxiosResponse
        }
      } catch {}
    }
    throw error
  }
}
