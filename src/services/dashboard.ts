import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'

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
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/availability/${serviceId}`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération des stats generaux:', error)
    return []
  }
}
export const getAverageLengthOfStay = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/occupancy/${serviceId}/average-stay`,
    )
    return response.data || []
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

    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/occupancy/${serviceId}/stats?period=${period}`
    )
    return response.data || []
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

    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/occupancy/${serviceId}/average-rate?period=${period}`
    )
    return response.data || []
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

    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/adr/${serviceId}/${period}`
    )
    return response.data || []
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

    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/revenue/${serviceId}/stats?period=${period}`
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération des getRevenuTotal:', error)
    return []
  }
}

export const getOccupancyRateMonthly = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/occupancy/${serviceId}/monthly`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération des getOccupancyRateMonthly:', error)
    return []
  }
}

export const getRevenuTotalMonthly = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/revenue/${serviceId}/monthly-comparison`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération des getRevenuTotalMonthly:', error)
    return []
  }
}

export const getStayDuration = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/stay-duration/${serviceId}`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération des getStayDuration:', error)
    return []
  }
}
export const getRecentReservation = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/reservation_service_serviceId/${serviceId}`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération des getStayDuration:', error)
    return []
  }
}

export const getDemographic = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/clients/origin-stats/${serviceId}`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération de getDemographic:', error)
    return []
  }
}

export const getReservationType = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/reservation/${serviceId}`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération de getReservationType:', error)
    return []
  }
}
