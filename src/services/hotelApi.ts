/**
 * Hotel API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 *
 * La fonction filterReservation conserve son cache local avancé car elle
 * filtre sur plusieurs critères complexes (recherche offline locale).
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import type { FitlterItem } from '../utils/models'
import { db } from './offline/db.js'

/**
 * Get hotel details by ID
 */
export const getHotelById = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/hotels/${id}/details`, {
      resourceType: 'hotel',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching hotel details:', error)
    throw error
  }
}

/**
 * Get hotel by ID (basic)
 */
export const getById = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/hotels/${id}`, {
      resourceType: 'hotel',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching hotel:', error)
    throw error
  }
}

/**
 * Update status colors (CONFIGURATION — en ligne uniquement)
 */
export const updateStatusColors = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.patch(`/hotels/${id}/status-colors`, data)
    return response.data
  } catch (error) {
    console.error('Error updating status colors:', error)
    throw error
  }
}

/**
 * Update hotel information (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelInformation = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/information`, data)
    return response.data
  } catch (error) {
    console.error('Error updating hotel information:', error)
    throw error
  }
}

/**
 * Update hotel notices (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelNotices = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/notices`, data)
    return response.data
  } catch (error) {
    console.error('Error updating hotel notices:', error)
    throw error
  }
}

/**
 * Update hotel formula setting (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelFormulaSetting = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/formula-setting`, data)
    return response.data
  } catch (error) {
    console.error('Error updating formula setting:', error)
    throw error
  }
}

/**
 * Update hotel document numbering setting (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelDocumentNumberingSetting = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/document-numbering-setting`, data)
    return response.data
  } catch (error) {
    console.error('Error updating document numbering setting:', error)
    throw error
  }
}

/**
 * Update hotel print email settings (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelPrintEmailSettings = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/print-email-settings`, data)
    return response.data
  } catch (error) {
    console.error('Error updating print email settings:', error)
    throw error
  }
}

/**
 * Update hotel checkin reservation settings (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelCheckinReservationSettings = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/checkin-reservation-settings`, data)
    return response.data
  } catch (error) {
    console.error('Error updating checkin reservation settings:', error)
    throw error
  }
}

/**
 * Update hotel display settings (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelDisplaySettings = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/display-settings`, data)
    return response.data
  } catch (error) {
    console.error('Error updating display settings:', error)
    throw error
  }
}

/**
 * Update hotel registration settings (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelRegistrationSettings = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/registration-settings`, data)
    return response.data
  } catch (error) {
    console.error('Error updating registration settings:', error)
    throw error
  }
}

/**
 * Update hotel housekeeping status colors (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelHousekeepingStatusColors = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/housekeeping-status-colors`, data)
    return response.data
  } catch (error) {
    console.error('Error updating housekeeping status colors:', error)
    throw error
  }
}

/**
 * Update hotel tax rates (CONFIGURATION — en ligne uniquement)
 */
export const updateHotelTaxRates = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.put(`/hotels/${id}/tax-rates`, data)
    return response.data
  } catch (error) {
    console.error('Error updating tax rates:', error)
    throw error
  }
}

/**
 * Toggle offline mode for a hotel
 */
export const toggleOfflineMode = async (id: number, enabled: boolean): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PATCH', `/hotels/${id}/toggle-offline-mode`, {
      data: { enabled },
      resourceType: 'hotel',
      resourceId: id,
      queuePriority: 10,
    })
    return result.data
  } catch (error) {
    console.error('Error toggling offline mode:', error)
    throw error
  }
}

/**
 * Get offline mode status for a hotel
 */
export const getOfflineModeStatus = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/hotels/${id}/offline-mode-status`, {
      resourceType: 'hotel',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching offline mode status:', error)
    throw error
  }
}

/**
 * Search/filter reservations with offline cache fallback.
 * Conserve le cache local avancé car les filtres de recherche sont complexes
 * et nécessitent un filtrage local quand offline.
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
  const url = `/hotels/${id}/reservation/search${qs ? '?' + qs : ''}`
  const cacheKey = `filter-reservation:${id}:${qs}`

  try {
    const result = await offlineAwareApiCall('GET', url, {
      resourceType: 'reservation',
      skipCache: true, // On gère le cache nous-mêmes ci-dessous
    })

    // Mettre en cache la réponse
    try {
      await db.apiCache.where('key').equals(cacheKey).delete()
      await db.apiCache.add({ key: cacheKey, data: result.data, cachedAt: Date.now(), ttl: 10 * 60 * 1000 })
    } catch { /* ignore cache errors */ }

    return { data: result.data, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse
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
              statistics: { totalReservations: filtered.length, arrivals, departures, inHouse },
            },
            status: 200, statusText: 'OK', headers: {}, config: {},
          } as AxiosResponse
        }
      } catch { /* ignore cache errors */ }
    }
    throw error
  }
}
