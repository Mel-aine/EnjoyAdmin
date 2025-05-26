import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'

//const API_URL = import.meta.env.VITE_API_URL as string;

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
export const checkInReservation = async (id: number): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservations/${id}/check-in`,
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Check-out d'une réservation
export const checkOutReservation = async (reservationId: number): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservations/${reservationId}/check-out`,
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
      `/reservations/service-product/${serviceProductId}`,
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}

// Récupérer les réservations avec statut "confirmed" pour check-in
// export const getReservationsForCheckIn = async (): Promise<Reservation[]> => {
//   try {
//     const response: AxiosResponse<ApiResponse<Reservation[]>> = await apiClient.get(
//       '/reservations?status=confirmed',
//     )
//     return response.data.data || []
//   } catch (error) {
//     console.error('Erreur récupération réservations confirmées:', error)
//     return []
//   }
// }

// Récupérer les réservations avec statut "checked_in" pour check-out
// export const getReservationsForCheckOut = async (): Promise<Reservation[]> => {
//   try {
//     const response: AxiosResponse<ApiResponse<Reservation[]>> = await apiClient.get(
//       '/reservations?status=checked_in',
//     )
//     return response.data.data || []
//   } catch (error) {
//     console.error('Erreur récupération réservations checked_in:', error)
//     return []
//   }
// }
