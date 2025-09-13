import type { AxiosResponse } from 'axios'
import axios from 'axios'
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
export const checkInReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/checkin`, datas, headers
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
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/checkin`,
      { reservationServiceProducts: reservationServiceProductIds }, headers
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


// Check-out d'une réservation
export const checkOutReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/check-out`, datas, headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const checkOutReservations = async (reservationId: number, reservationServiceProductIds: number[]): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservations/${reservationId}/check-out`, { reservationServiceProducts: reservationServiceProductIds }, headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const setAvailable = async (id: number): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/service_product/${id}/available`, headers
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
      `/reservations/service-product/${serviceProductId}`, headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}


// Check-in d'une réservation
export const unAssignRoomReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/unassign-room`, datas, headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const assignRoomReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/assign-room`, datas, headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}


/**
 * create Reservation
 */

export const createReservation = async (data: any) => {
  try {
    console.log('Sending reservation data to backend:', data)

    const response = await apiClient.post('/reservation/create', data, headers)

    console.log('Backend response:', response.data)

    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })

    throw error
  }
}
/**
 * get Reservation details by Id
 */
export const getReservationDetailsById = async (reservationId: number): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Reservation[]>> = await apiClient.get(
      `/reservation/${reservationId}/details`, headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }



}

/**
 *
 * @param hotel_id
 * @returns
 */
export const getCustomer = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<Reservation[]>> = await apiClient.get(
      `/guests/${id}/customer`, headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}


// recuperer la liste des clients
export const getReservatonCustomers = async (serviceProductId: number): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.get(
      `/guests/${serviceProductId}/customer`, headers
    )
    return response.data || []
  } catch (error) {
    console.error('Erreur récupération clients:', error)
    return []
  }
}

/**
 * cancel reservation
 * @param data
 * @returns
 */
export const cancelReservation = async (data: any) => {
  try {
    const response = await apiClient.post(`/reservation/${data.reservationId}/cancel`, data, headers)
    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    throw error
  }
}

/**
 * void reservation
 * @param data
 * @returns
 */
export const voidReservation = async (data: any) => {
  try {
    const response = await apiClient.post(`/reservation/${data.reservationId}/void`, data, headers)
    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    throw error
  }
}

/**
 * amend reservation
 * @param data
 * @returns
 */
export const amendReservation = async (data: any) => {
  try {
    const response = await apiClient.put(`/reservation/${data.reservationId}/amend-stay`, data, headers)
    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    throw error
  }
}

/***
 * mark no show
 */

export const markNoShow = async (data: any) => {
  try {
    const response = await apiClient.post(`/reservation/${data.reservationId}/no-show`, data, headers)
    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    throw error
  }
}
/***
 *
 * get Room charges
 */
export const getRoomCharges = async (reservationId: any) => {
  try {
    const response = await apiClient.get(`/reservation/${reservationId}/room-charges`, headers)
    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    throw error
  }
}

/***
 *
 * get release reservations
 */
export const getReleaseReservations = async (data: any) => {
  const params = new URLSearchParams({
    date: data.data,
  })
  try {
    const response = await apiClient.get(`/reservation/hotel/${data.hotelId}/released?${params}`, { params: params, ...headers })
    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    throw error
  }
}

export const stopRoomMoveReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/stop-room-move`, datas, headers
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}