/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type {
  RoomTypeData,
} from '@/types/option'

const API_URL = `${import.meta.env.VITE_API_URL as string}/configuration`


const authStore = useAuthStore()
const headers = {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  withCredentials: true,
}


///// this is the amenities sections
/**
 * Get all amenities
 * @returns {Promise<AxiosResponse<any>>}
 */

export const getAmenities = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities`, headers)
}
/**
 * Post a new amenity
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */

export const postAmenity = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenities`, data, headers)
}
/**
 * Get an amenity
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAmenity = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities/${id}`, headers)
}
/**
 * Update an amenity
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */

export const updateAmenity = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenities/${id}`, data, headers)
}
/**
 * Delete an amenity
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteAmenity = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenities/${id}`, headers)
}


////// this is the room type sections
/**
 * Get all room types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_types`, headers)
}

/** 
 * update sortOrder roomtype
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomTypeSortOrder = (data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room_types/sort-order`, data, headers)
}

/**
 * Post a new room type
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomType = (data: RoomTypeData): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room_types`, data, headers)
}
/**
 * Get a room type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_types/${id}`, headers)
}
/**
 * Update a room type
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomTypeById = (id: number, data: RoomTypeData): Promise<AxiosResponse<any>> => {

  return axios.put(`${API_URL}/room_types/${id}`, data, headers)
}
/**
 * Delete a room type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomType = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room_types/${id}`, headers)
}


////// this is the Room sections
/**
 * Get all rooms
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRooms = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms`, headers)
}
/**
 * Post a new room
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoom = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/rooms`, data, headers)
}
/**
 * Get a room
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms/${id}`, headers)
}
/**
 * Update a room
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/rooms/${id}`, data, headers)
}
/**
 * Delete a room
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/rooms/${id}`, headers)
}


////// this is the Room Owner sections
/**
 * Get all room owners
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomOwners = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room-owners`, headers)
}
/**
 * Post a new room owner
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomOwner = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room-owners`, data, headers)
}
/**
 * Get a room owner
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomOwnerById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room-owners/${id}`, headers)
}
/**
 * Update a room owner
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomOwnerById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room-owners/${id}`, data, headers)
}
/**
 * Delete a room owner
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomOwnerById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room-owners/${id}`, headers)
}




////// this is the bed type sections
/**
 * Get all bed types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBedTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/bed_types`, headers)
}
/**
 * Post a new bed type
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postBedType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/bed_types`, data, headers)
}
/**
 * Get a bed type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBedTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/bed_types/${id}`, headers)
}
/**
 * Update a bed type
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateBedTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/bed_types/${id}`, data, headers)
}
/**
 * Delete a bed type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteBedTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/bed_types/${id}`, headers)
}


// this section is for rate type
/**
 * Get all rate types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types`, headers)
}
/**
 * Post a new rate type
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRateType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/rate_types`, data, headers)
}
/**
 * Get a rate type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types/${id}`, headers)
}
/**
 * Update a rate type
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRateTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/rate_types/${id}`, data, headers)
}
/**
 * Delete a rate type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRateTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/rate_types/${id}`, headers)
}

// this section is for season
/**
 * Get all seasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSeasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/seasons`, headers)
}
/**
 * Post a new season
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postSeason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/seasons`, data, headers)
}
/**
 * Get a season
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSeasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/seasons/${id}`, headers)
}
/**
 * Update a season
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateSeasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/seasons/${id}`, data, headers)
}
/**
 * Delete a season
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteSeasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/seasons/${id}`, headers)
}



///this section is for room rate
/**
 * Get all room rates
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomRates = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_rates`, headers)
}
/**
 * Post a new room rate
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomRate = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room_rates`, data, headers)
}
/**
 * Get a room rate
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomRateById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_rates/${id}`, headers)
}
/**
 * Update a room rate
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomRateById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room_rates/${id}`, data, headers)
}
/**
 * Delete a room rate
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomRateById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room_rates/${id}`, headers)
}
///this section is for room rate end

// this section is for currency

/**
 * Get all currencies
 * @returns {Promise<AxiosResponse<any>>}
 */

export const getCurrencies = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/currencies`, headers)
}
/**
 * Post a new currency
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postCurrency = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/currencies`, data, headers)
}
/**
 * Get a currency
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getCurrencyById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/currencies/${id}`, headers)
}
/**
 * Update a currency

 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateCurrencyById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/currencies/${id}`, data, headers)
}
/**
 * Delete a currency
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteCurrencyById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/currencies/${id}`, headers)
}
// this section is for currency end


// this section is for the payment method

/**
 * Get all payment methods
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPaymentMethods = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payment_methods`, headers)
}
/**
 * Post a new payment method
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPaymentMethod = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/payment_methods`, data, headers)
}
/**
 * Get a payment method
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPaymentMethodById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payment_methods/${id}`, headers)
}
/**
 * Update a payment method
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePaymentMethodById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/payment_methods/${id}`, data, headers)
}
/**
 * Delete a payment method
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePaymentMethodById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/payment_methods/${id}`, headers)
}



/// this section is for the identity type
/**
 * Get all identity types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getIdentityTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/identity_types`, headers)
}
/**
 * Post a new identity type
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postIdentityType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/identity_types`, data, headers)
}
/**
 * Get an identity type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getIdentityTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/identity_types/${id}`, headers)
}
/**
 * Update an identity type
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateIdentityTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/identity_types/${id}`, data, headers)
}
/**
 * Delete an identity type
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteIdentityTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/identity_types/${id}`, headers)
}



///  this is the reason section
/**
 * Get all reasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reasons`, headers)
}
/**
 * Post a new reason
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postReason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reasons`, data, headers)
}
/**
 * Get a reason
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reasons/${id}`, headers)
}
/**
 * Update a reason
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateReasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/reasons/${id}`, data, headers)
}
/**
 * Delete a reason
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/reasons/${id}`, headers)
}


// this the discount section
/**
 * Get all discounts
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDiscounts = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/discounts`, headers)
}
/**
 * Post a new discount
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postDiscount = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/discounts`, data, headers)
}
/**
 * Get a discount
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDiscountById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/discounts/${id}`, headers)
}
/**
 * Update a discount
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateDiscountById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/discounts/${id}`, data, headers)
}
/**
 * Delete a discount
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteDiscountById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/discounts/${id}`, headers)
}

/// this section is for the transportation modes
/**
 * Get all transportation modes
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTransportationModes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/transportation_modes`, headers)
}
/**
 * Post a new transportation mode
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postTransportationMode = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/transportation_modes`, data, headers)
}
/**
 * Get a transportation mode
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTransportationModeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/transportation_modes/${id}`, headers)
}
/**
 * Update a transportation mode
 * @param id 
 * @param data 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateTransportationModeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/transportation_modes/${id}`, data, headers)
}
/**
 * Delete a transportation mode
 * @param id 
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteTransportationModeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/transportation_modes/${id}`, headers)
}
