/**
 * Dashboard API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne
 * (cache pour les GET, file d'attente pour les écritures).
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
}

export interface Stats {
  id: number
  totalRooms: number
  occupiedRooms: number
  occupancyRate: number
  reservedToday: number
  reservationRateToday: number
  reservationRateLastWeek: number
  totalReservationsThisMonth: number
  totalRevenueThisMonth: number
}

export const getGeneralStats = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/availability/${serviceId}`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des stats generaux:', error)
    return []
  }
}

export const getAverageLengthOfStay = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/occupancy/${serviceId}/average-stay`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des etAverageLengthOfStay:', error)
    return []
  }
}

export const getOccupancyRate = async ({
  serviceId,
  period
}: { serviceId: number | null; period: string }): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/occupancy/${serviceId}/stats`, {
      resourceType: 'dashboard',
      params: { period },
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getOccupancyRate:', error)
    return []
  }
}

export const getOccupancyRateTotal = async ({
  serviceId,
  period
}: { serviceId: number | null; period: string }): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/occupancy/${serviceId}/average-rate`, {
      resourceType: 'dashboard',
      params: { period },
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getOccupancyRateTotal:', error)
    return []
  }
}

export const getADR = async ({
  serviceId,
  period
}: { serviceId: number | null; period: string }): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/adr/${serviceId}/${period}`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getADR:', error)
    return []
  }
}

export const getRevenuTotal = async ({
  serviceId,
  period
}: { serviceId: number | null; period: string }): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/revenue/${serviceId}/stats`, {
      resourceType: 'dashboard',
      params: { period },
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getRevenuTotal:', error)
    return []
  }
}

export const getOccupancyRateMonthly = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/occupancy/${serviceId}/monthly`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getOccupancyRateMonthly:', error)
    return []
  }
}

export const getRevenuTotalMonthly = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/revenue/${serviceId}/monthly-comparison`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getRevenuTotalMonthly:', error)
    return []
  }
}

export const getStayDuration = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/stay-duration/${serviceId}`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getStayDuration:', error)
    return []
  }
}

export const getRecentReservation = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/configuration/hotels/${serviceId}/rooms/recent/Booking`, {
      resourceType: 'reservation',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération des getRecentReservation:', error)
    return []
  }
}

export const getDemographic = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/clients/origin-stats/${serviceId}`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération de getDemographic:', error)
    return []
  }
}

export const getCustomerType = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/customer-types/${serviceId}`, {
      resourceType: 'dashboard',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération de getCustomerType:', error)
    return []
  }
}

export const getReservationType = async (serviceId: number | null): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/reservation/${serviceId}`, {
      resourceType: 'reservation',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération de getReservationType:', error)
    return []
  }
}

/**
 * Dashboard front office routes
 */
export const getFrontOfficeDashboard = async (serviceId: number | null, params?: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/dashboard/front-office/${serviceId}`, {
      resourceType: 'dashboard',
      params,
    })
    return result.data || { success: false, data: null }
  } catch (error: any) {
    console.error('Erreur récupération de getFrontOfficeDashboard:', error)
    return { success: false, data: null, error: error.message }
  }
}
