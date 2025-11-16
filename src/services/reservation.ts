import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

//const API_URL = import.meta.env.VITE_API_URL as string;

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
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
      `/reservation/${reservationId}/checkin`, datas, getHeaders()
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
      { reservationServiceProducts: reservationServiceProductIds }, getHeaders()
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
      `/reservation/${reservationId}/check-out`, datas, getHeaders()
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
      `/reservations/${reservationId}/check-out`, { reservationServiceProducts: reservationServiceProductIds }, getHeaders()
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const undoCheckInReservation = async (reservationId: number, datas: any): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/undo-checkin`, datas, getHeaders()
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const undoCheckOutReservation = async (reservationId: number, datas: any): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/undo-check-out`, datas, getHeaders()
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
      `/service_product/${id}/available`, getHeaders()
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
      `/reservations/service-product/${serviceProductId}`, getHeaders()
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
      `/reservation/${reservationId}/unassign-room`, datas, getHeaders()
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
      `/reservation/${reservationId}/assign-room`, datas, getHeaders()
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

    const response = await apiClient.post('/reservation/create', data, getHeaders())

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
      `/reservation/${reservationId}/details`, getHeaders()
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
      `/guests/${id}/customer`, getHeaders()
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
      `/guests/${serviceProductId}/customer`, getHeaders()
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
    const response = await apiClient.post(`/reservation/${data.reservationId}/cancel`, data, getHeaders())
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
    const response = await apiClient.post(`/reservation/${data.reservationId}/void`, data, getHeaders())
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
    const response = await apiClient.put(`/reservation/${data.reservationId}/amend-stay`, data, getHeaders())
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
    const response = await apiClient.post(`/reservation/${data.reservationId}/no-show`, data, getHeaders())
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
    const response = await apiClient.get(`/reservation/${reservationId}/room-charges`, getHeaders())
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
    const response = await apiClient.get(`/reservation/hotel/${data.hotelId}/released?${params}`, { params: params, ...getHeaders() })
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
      `/reservation/${reservationId}/stop-room-move`, datas, getHeaders()
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/**
 * get reservation by id
 */

export const getReservationById = async (reservationId: number): Promise<any | undefined>  => {
  try {
    const response: AxiosResponse<ApiResponse>  = await apiClient.get(`/reservations/${reservationId}`,getHeaders())

    return response.data
  } catch (error) {
    console.error('Error fetching reservation:', error)
    throw error
  }
}


/*** build guest regiqstration card */

export const printGuestReservationCard = async (data: {
  reservationId: number
  guestId:number
}): Promise<any> => {
  try {
    const headersWithBlob = { ...getHeaders(), responseType: 'blob' as const }

    const response: AxiosResponse = await apiClient.post(`/reservation/print-guest-card`, data, headersWithBlob)
    return response.data
  } catch (error) {
    console.error('Error printing confirmBooking:', error)
    throw error
  }
}


export const updateBookingDetail = async (reservationId: any, data: any) => {
  try {
    console.log('API Call - URL:', `/reservation/${reservationId}/booking-detail`)
    console.log('API Call - Data:', data)

    const response = await apiClient.put(
      `/reservation/${reservationId}/booking-detail`,
      data,
      getHeaders()
    )

    console.log('API Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      requestData: error.config?.data
    })
    throw error
  }
}


export const postRoomMoveReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/room-move`, datas, getHeaders()
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const postExchangeRoomReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservation/${reservationId}/exchange-room`, datas, getHeaders()
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
/***
 * update reservation details
 */
export const updateReservationDetails = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.put(
      `/reservations/${reservationId}/update-details`, datas, getHeaders()
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/***
 * update reservation details
 */
export const applyDiscountReservationDetails = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      `/reservations/${reservationId}/apply-discount`, datas, getHeaders()
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/**
 * reservation update status
 */
export const confirmBooking = async (id: number,data:any): Promise<any | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/reservation/${id}/update_status`,data, getHeaders()
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

