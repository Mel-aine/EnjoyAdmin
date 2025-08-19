import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

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

const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

export const getGeneralStats = async (serviceId: number | null): Promise<any> => {
  try {
    const _headers = {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      withCredentials: true,
    }
    console.log('-->Header:', _headers)
    if(!authStore.token)
      throw new Error("Token not founded");

    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/availability/${serviceId}`,_headers
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
      `/occupancy/${serviceId}/average-stay`, headers
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
      `/occupancy/${serviceId}/stats?period=${period}`,headers
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
      `/occupancy/${serviceId}/average-rate?period=${period}`,headers
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
      `/adr/${serviceId}/${period}`,headers
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
      `/revenue/${serviceId}/stats?period=${period}`,headers
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
      `/occupancy/${serviceId}/monthly`,headers
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
      `/revenue/${serviceId}/monthly-comparison`,headers
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
      `/stay-duration/${serviceId}`,headers
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
      `/reservation_service_serviceId/${serviceId}`,headers
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
      `/clients/origin-stats/${serviceId}`,headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération de getDemographic:', error)
    return []
  }
}

export const getCustomerType = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/customer-types/${serviceId}`,headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération de getCustomerType:', error)
    return []
  }
}

export const getReservationType = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/reservation/${serviceId}`,headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération de getReservationType:', error)
    return []
  }
}
/**
 * dashboard front office routes
 */

export const getFrontOfficeDashboard = async (serviceId: number | null): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Stats[]>> = await apiClient.get(
      `/dashboard/front-office/${serviceId}`,headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération de getFrontOfficeDashboard:', error)
    return []
  }
}
