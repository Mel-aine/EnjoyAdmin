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

/**
 * get Room Detail
 */
export const getRoomsWithDetails = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms/${hotelId}/details`, headers)
}

/**
 * update status
 */
export const updateRoomStatus = (
  roomId: number,
  status: string,
  force = false,
  maintenanceData?: { reason: string; startDate: string; endDate: string; notes: string },
): Promise<AxiosResponse<any>> => {
  const payload: any = { status, force }

  if (status === 'maintenance' && maintenanceData) {
    Object.assign(payload, maintenanceData)
  }

  return axios.patch(`${API_URL}/rooms/${roomId}/status`, payload, headers)
}

/**
 * get housekeeping status
 *
 */
export const getHouseStatus = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms/houseview/${hotelId}`, headers)
}

/**
 * bulkUpdate
 */
export const bulkUpdateRooms = (data:any): Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/rooms/bulk-update`, data , headers)
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


// this section is for PayoutReason

/**
 * Get all payout reasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPayoutReasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payout_reasons`, headers)
}

/**
 * Post a new payout reason
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPayoutReason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/payout_reasons`, data, headers)
}

/**
 * Get a payout reason by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPayoutReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payout_reasons/${id}`, headers)
}

/**
 * Update a payout reason
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePayoutReasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/payout_reasons/${id}`, data, headers)
}

/**
 * Delete a payout reason
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePayoutReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/payout_reasons/${id}`, headers)
}


// this section is for Template Category

/**
 * Get all template categories
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTemplateCategories = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/template_categories`, headers)
}

/**
 * Post a new template category
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postTemplateCategory = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/template_categories`, data, headers)
}

/**
 * Get a template category by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTemplateCategoryById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/template_categories/${id}`, headers)
}

/**
 * Update a template category
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateTemplateCategoryById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/template_categories/${id}`, data, headers)
}

/**
 * Delete a template category
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteTemplateCategoryById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/template_categories/${id}`, headers)
}


// this section is for Black List Reason

/**
 * Get all black list reasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBlackListReasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/black_list_reasons`, headers)
}

/**
 * Post a new black list reason
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postBlackListReason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/black_list_reasons`, data, headers)
}

/**
 * Get a black list reason by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBlackListReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/black_list_reasons/${id}`, headers)
}

/**
 * Update a black list reason
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateBlackListReasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/black_list_reasons/${id}`, data, headers)
}

/**
 * Delete a black list reason
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteBlackListReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/black_list_reasons/${id}`, headers)
}


// this section is for Market Code

/**
 * Get all market codes
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getMarketCodes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/market_codes`, headers)
}

/**
 * Post a new market code
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postMarketCode = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/market_codes`, data, headers)
}

/**
 * Get a market code by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getMarketCodeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/market_codes/${id}`, headers)
}

/**
 * Update a market code
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateMarketCodeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/market_codes/${id}`, data, headers)
}

/**
 * Delete a market code
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteMarketCodeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/market_codes/${id}`, headers)
}


// this section is for Reservation Type

/**
 * Get all reservation types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReservationTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservation_types`, headers)
}

/**
 * Post a new reservation type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postReservationType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservation_types`, data, headers)
}

/**
 * Get a reservation type by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReservationTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservation_types/${id}`, headers)
}

/**
 * Update a reservation type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateReservationTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/reservation_types/${id}`, data, headers)
}

/**
 * Delete a reservation type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteReservationTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/reservation_types/${id}`, headers)
}


// this section is for Preference Type

/**
 * Get all preference types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferenceTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preference_types`, headers)
}

/**
 * Post a new preference type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPreferenceType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/preference_types`, data, headers)
}

/**
 * Get a preference type by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferenceTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preference_types/${id}`, headers)
}

/**
 * Update a preference type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePreferenceTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/preference_types/${id}`, data, headers)
}

/**
 * Delete a preference type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePreferenceTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/preference_types/${id}`, headers)
}


// this section is for Preference

/**
 * Get all preferences
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferences = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preferences`, headers)
}

/**
 * Post a new preference
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPreference = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/preferences`, data, headers)
}

/**
 * Get a preference by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferenceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preferences/${id}`, headers)
}

/**
 * Update a preference
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePreferenceById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/preferences/${id}`, data, headers)
}

/**
 * Delete a preference
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePreferenceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/preferences/${id}`, headers)
}


// this section is for Business Source

/**
 * Get all business sources
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBusinessSources = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/business_sources`, headers)
}

/**
 * Post a new business source
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postBusinessSource = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/business_sources`, data, headers)
}

/**
 * Get a business source by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBusinessSourceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/business_sources/${id}`, headers)
}

/**
 * Update a business source
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateBusinessSourceById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/business_sources/${id}`, data, headers)
}

/**
 * Delete a business source
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteBusinessSourceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/business_sources/${id}`, headers)
}

// this section is for Extra Charge

/**
 * Get all extra charges
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getExtraCharges = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/extra_charges`, headers)
}

/**
 * Post a new extra charge
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postExtraCharge = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/extra_charges`, data, headers)
}

/**
 * Get an extra charge by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getExtraChargeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/extra_charges/${id}`, headers)
}

/**
 * Update an extra charge
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateExtraChargeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/extra_charges/${id}`, data, headers)
}

/**
 * Delete an extra charge
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteExtraChargeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/extra_charges/${id}`, headers)
}


// this section is for Tax

/**
 * Get all taxes
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTaxes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/taxes`, headers)
}

/**
 * Post a new tax
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postTax = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/taxes`, data, headers)
}

/**
 * Get a tax by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTaxById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/taxes/${id}`, headers)
}

/**
 * Update a tax
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateTaxById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/taxes/${id}`, data, headers)
}

/**
 * Delete a tax
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteTaxById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/taxes/${id}`, headers)
}

/**
 * get Reasons by category
 * @param category - The category to filter reasons by
 */
export const getByCategory = (hotelId: number | string,  category: string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reasons/${hotelId}/${category}`, headers)
}
