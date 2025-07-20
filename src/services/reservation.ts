import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

//const API_URL = import.meta.env.VITE_API_URL as string;

const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}

export interface CheckInPayload {
  reservationId: number
}

export interface CheckOutPayload {
  reservationId: number
}

export interface ApiResponse<T = any> {
  message: string
  data?: T
  error?: string
}

export interface Reservation {
  id: number
  status: 'confirmed' | 'checked_in' | 'checked_out' | string
  guestName: string
  roomId: number
  checkInDate: string
  checkOutDate: string
  // Ajoutez d'autres champs selon les besoins
}

const handleApiError = (error: any): never => {
  console.error('Erreur API:', error)
  throw {
    message: error.response?.data?.message || 'Erreur API',
    error: error.response?.data?.error || error.message,
  }
}

// Check-in d'une réservation
export const checkInReservation = async (reservationId: number,datas:any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservations/${reservationId}/check-in`,datas,headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const checkInReservations = async (
  reservationId: number,
  reservationServiceProductIds: number[]
): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservations/${reservationId}/check-in`,
      { reservationServiceProducts: reservationServiceProductIds },headers
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


// Check-out d'une réservation
export const checkOutReservation = async (reservationId: number,datas:any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservations/${reservationId}/check-out`,datas,headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const checkOutReservations = async (reservationId: number,reservationServiceProductIds: number[]): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservations/${reservationId}/check-out`,{ reservationServiceProducts: reservationServiceProductIds },headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const setAvailable = async (id: number): Promise<any| undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/service_product/${id}/available`,headers
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}


// Récupérer les réservations pour une chambre
export const getRoomReservations = async (serviceProductId: number): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Reservation[]>> = await apiClient.get(
      `/reservations/service-product/${serviceProductId}`,headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}

