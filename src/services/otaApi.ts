import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

const API_URL = `${import.meta.env.VITE_API_URL as string}/ota`

// Helper function to get headers with token
const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

/**
 * Get Hotel Info
 */
export const getHotelInfo = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/hotels/${hotelId}/info`, getHeaders())
}

/**
 * Room Availability Interfaces
 */

export interface RoomAvailability {
  id: number
  name: string
  shortCode: string
  description: string
  images: string[]
  roomsLeft: number
  rooms?: any[]
  open?: boolean
  capacity: {
    base?: number
    max?: number
    children?: number
    adults?: number
  }
  amenities?: any[]
  ratePlans: Array<{
    id: number
    rateTypeId: number
    name: string
    shortCode: string
    features?: any[]
    policies: any[]
    price?: number
    pricePerNight?: number
    breakdown?: any
    currency?: string
    minNights?: number
    maxNights?: number
  }>
}

export interface AvailabilityResponse {
  message: string
  meta: {
    hotelId: number
    startDate: string
    endDate: string
    adults: number | null
    children: number | null
    hotelName: string | null
  }
  data: RoomAvailability[]
}

export interface AvailabilityParams {
  hotelId: number | null
  startDate: string
  endDate: string
  adults?: number
  children?: number
}

/**
 * Get Room Availability for a hotel
 */
export const getAvailability = async (
  params: AvailabilityParams
): Promise<AvailabilityResponse> => {
  try {
    const { hotelId, ...queryParams } = params

    const response = await axios.get<AvailabilityResponse>(
      `${API_URL}/hotels/${hotelId}/availability`,
      {
        params: queryParams,
        ...getHeaders(),
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        (error.response?.data as any)?.message || 'Erreur lors de la récupération de la disponibilité'
      )
    }
    throw error
  }
}






