/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type {
  RoomTypeData,
} from '@/types/option'

const API_URL = `${import.meta.env.VITE_API_URL as string}/configuration`
const URL = `${import.meta.env.VITE_API_URL as string}`

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}


///// this is the amenities sections
/**
 * Get all amenities
 * @returns {Promise<AxiosResponse<any>>}
 */

export const getAmenities = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities`, getHeaders())
}
/**
 * Post a new amenity
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */

export const postAmenity = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenities`, data, getHeaders())
}
/**
 * Get an amenity
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAmenity = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities/${id}`, getHeaders())
}
/**
 * Update an amenity
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */

export const updateAmenity = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenities/${id}`, data, getHeaders())
}
/**
 * Delete an amenity
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteAmenity = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenities/${id}`, getHeaders())
}


////// this is the room type sections
/**
 * Get all room types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_types`, getHeaders())
}

/**
 * update sortOrder roomtype
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomTypeSortOrder = (data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room_types/sort-order`, data, getHeaders())
}

/**
 * Post a new room type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomType = (data: RoomTypeData): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room_types`, data, getHeaders())
}
/**
 * Get a room type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_types/${id}`, getHeaders())
}
/**
 * Update a room type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomTypeById = (id: number, data: RoomTypeData): Promise<AxiosResponse<any>> => {

  return axios.put(`${API_URL}/room_types/${id}`, data, getHeaders())
}
/**
 * Delete a room type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomType = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room_types/${id}`, getHeaders())
}


////// this is the Room sections
/**
 * Get all rooms
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRooms = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms`, getHeaders())
}
/**
 * Post a new room
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoom = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/rooms`, data, getHeaders())
}
/**
 * Get a room
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms/${id}`, getHeaders())
}
/**
 * Update a room
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/rooms/${id}`, data, getHeaders())
}
/**
 * Update a reservation-room
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateReservationRoomById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${URL}/reservation-rooms/${id}`, data, getHeaders())
}
/**
 * Delete a room
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/rooms/${id}`, getHeaders())
}

/**
 * get Room Detail
 */
export const getRoomsWithDetails = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms/${hotelId}/details`, getHeaders())
}

/***
 * get availiabele room by typeId
 */
export const getAvailableRoomsByTypeId = (
  roomTypeId: number,
  startDate?: string,
  endDate?: string
): Promise<AxiosResponse<any>> => {
  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate })
  }

  return axios.get(
    `${API_URL}/rooms/available-by-room-type/${roomTypeId}`,
    {
      ...getHeaders(),
      params
    }
  )
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

  return axios.patch(`${API_URL}/rooms/${roomId}/status`, payload, getHeaders())
}

/**
 * get housekeeping status
 *
 */
export const getHouseStatus = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rooms/houseview/${hotelId}`, getHeaders())
}

/**
 * bulkUpdate
 */
export const bulkUpdateRooms = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/rooms/bulk-update`, data, getHeaders())
}


////// this is the Room Owner sections
/**
 * Get all room owners
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomOwners = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room-owners`, getHeaders())
}
/**
 * Post a new room owner
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomOwner = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room-owners`, data, getHeaders())
}
/**
 * Get a room owner
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomOwnerById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room-owners/${id}`, getHeaders())
}
/**
 * Update a room owner
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomOwnerById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room-owners/${id}`, data, getHeaders())
}
/**
 * Delete a room owner
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomOwnerById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room-owners/${id}`, getHeaders())
}




////// this is the bed type sections
/**
 * Get all bed types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBedTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/bed_types`, getHeaders())
}
/**
 * Post a new bed type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postBedType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/bed_types`, data, getHeaders())
}
/**
 * Get a bed type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBedTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/bed_types/${id}`, getHeaders())
}
/**
 * Update a bed type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateBedTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/bed_types/${id}`, data, getHeaders())
}
/**
 * Delete a bed type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteBedTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/bed_types/${id}`, getHeaders())
}


// this section is for rate type
/**
 * Get all rate types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types`, getHeaders())
}
/**
 * Post a new rate type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRateType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/rate_types`, data, getHeaders())
}
/**
 * Get a rate type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types/${id}`, getHeaders())
}
/**
 * Update a rate type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRateTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/rate_types/${id}`, data, getHeaders())
}


/***
 * get rate type by hotel id
 * @param hotelId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateTypeByHotelId = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types/hotel/${hotelId}`, getHeaders())
}
/***
 * get rate type by hotel id
 * @param hotelId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRateStayViewTypeByHotelId = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/rate_types/hotel/${hotelId}/stay_view`, getHeaders())
}
/**
 * Delete a rate type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRateTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/rate_types/${id}`, getHeaders())
}

// this section is for season
/**
 * Get all seasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSeasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/seasons`, getHeaders())
}
/**
 * Post a new season
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postSeason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/seasons`, data, getHeaders())
}
/**
 * Get a season
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSeasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/seasons/${id}`, getHeaders())
}
/**
 * Update a season
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateSeasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/seasons/${id}`, data, getHeaders())
}
/**
 * Delete a season
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteSeasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/seasons/${id}`, getHeaders())
}



///this section is for room rate
/**
 * Get all room rates
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomRates = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_rates`, getHeaders())
}
/**
 * Post a new room rate
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postRoomRate = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/room_rates`, data, getHeaders())
}
/**
 * Get a room rate
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoomRateById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/room_rates/${id}`, getHeaders())
}
/**
 * Update a room rate
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRoomRateById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/room_rates/${id}`, data, getHeaders())
}
/**
 * Delete a room rate
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRoomRateById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/room_rates/${id}`, getHeaders())
}
///this section is for room rate end

// this section is for currency

/**
 * Get all currencies
 * @returns {Promise<AxiosResponse<any>>}
 */

export const getCurrencies = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/currencies`, getHeaders())
}
/**
 * Post a new currency
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postCurrency = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/currencies`, data, getHeaders())
}
/**
 * Get a currency
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getCurrencyById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/currencies/${id}`, getHeaders())
}
/**
 * Update a currency

 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateCurrencyById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/currencies/${id}`, data, getHeaders())
}
/**
 * Delete a currency
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteCurrencyById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/currencies/${id}`, getHeaders())
}
// this section is for currency end


// this section is for the payment method

/**
 * Get all payment methods
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPaymentMethods = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payment_methods`, getHeaders())
}
/**
 * Post a new payment method
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPaymentMethod = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/payment_methods`, data, getHeaders())
}
/**
 * Get a payment method
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPaymentMethodById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payment_methods/${id}`, getHeaders())
}
/**
 * Update a payment method
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePaymentMethodById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/payment_methods/${id}`, data, getHeaders())
}
/**
 * Delete a payment method
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePaymentMethodById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/payment_methods/${id}`, getHeaders())
}



/// this section is for the identity type
/**
 * Get all identity types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getIdentityTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/identity_types`, getHeaders())
}
/**
 * Post a new identity type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postIdentityType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/identity_types`, data, getHeaders())
}
/**
 * Get an identity type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getIdentityTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/identity_types/${id}`, getHeaders())
}
/**
 * Update an identity type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateIdentityTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/identity_types/${id}`, data, getHeaders())
}
/**
 * Delete an identity type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteIdentityTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/identity_types/${id}`, getHeaders())
}
/**
 * get identity type by hotel Id
 */
export const getIdentityTypesByHotelId = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/identity_types`, {
    params: { hotelId },
    ...getHeaders()
  })
}

///  this is the reason section
/**
 * Get all reasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reasons`, getHeaders())
}
/**
 * Post a new reason
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postReason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reasons`, data, getHeaders())
}
/**
 * Get a reason
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reasons/${id}`, getHeaders())
}
/**
 * Update a reason
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateReasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/reasons/${id}`, data, getHeaders())
}
/**
 * Delete a reason
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/reasons/${id}`, getHeaders())
}


// this the discount section
/**
 * Get all discounts
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDiscounts = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/discounts`, getHeaders())
}
/**
 * Post a new discount
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postDiscount = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/discounts`, data, getHeaders())
}
/**
 * Get a discount
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDiscountById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/discounts/${id}`, getHeaders())
}
/**
 * Update a discount
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateDiscountById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/discounts/${id}`, data, getHeaders())
}
/**
 * Delete a discount
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteDiscountById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/discounts/${id}`, getHeaders())
}

/// this section is for the transportation modes
/**
 * Get all transportation modes
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTransportationModes = (hotelId:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/transportation_modes?hotelId=${hotelId}`, getHeaders())
}
/**
 * Post a new transportation mode
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postTransportationMode = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/transportation_modes`, data, getHeaders())
}
/**
 * Get a transportation mode
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTransportationModeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/transportation_modes/${id}`, getHeaders())
}
/**
 * Update a transportation mode
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateTransportationModeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/transportation_modes/${id}`, data, getHeaders())
}
/**
 * Delete a transportation mode
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteTransportationModeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/transportation_modes/${id}`, getHeaders())
}


// this section is for PayoutReason

/**
 * Get all payout reasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPayoutReasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payout_reasons`, getHeaders())
}

/**
 * Post a new payout reason
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPayoutReason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/payout_reasons`, data, getHeaders())
}

/**
 * Get a payout reason by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPayoutReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/payout_reasons/${id}`, getHeaders())
}

/**
 * Update a payout reason
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePayoutReasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/payout_reasons/${id}`, data, getHeaders())
}

/**
 * Delete a payout reason
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePayoutReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/payout_reasons/${id}`, getHeaders())
}


// this section is for Template Category

/**
 * Get all template categories
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTemplateCategories = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/template_categories`, getHeaders())
}

/**
 * Post a new template category
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postTemplateCategory = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/template_categories`, data, getHeaders())
}

/**
 * Get a template category by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTemplateCategoryById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/template_categories/${id}`, getHeaders())
}

/**
 * Update a template category
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateTemplateCategoryById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/template_categories/${id}`, data, getHeaders())
}

/**
 * Delete a template category
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteTemplateCategoryById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/template_categories/${id}`, getHeaders())
}


// this section is for Black List Reason

/**
 * Get all black list reasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBlackListReasons = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/black_list_reasons`, getHeaders())
}

/**
 * Get all black list reasons
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBlackListReasonsByHotel = (hotelId:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/black_list_reasons?hotelId=${hotelId}`, getHeaders())
}

/**
 * Post a new black list reason
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postBlackListReason = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/black_list_reasons`, data, getHeaders())
}

/**
 * Get a black list reason by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBlackListReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/black_list_reasons/${id}`, getHeaders())
}

/**
 * Update a black list reason
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateBlackListReasonById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/black_list_reasons/${id}`, data, getHeaders())
}

/**
 * Delete a black list reason
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteBlackListReasonById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/black_list_reasons/${id}`, getHeaders())
}


// this section is for Market Code

/**
 * Get all market codes
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getMarketCodes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/market_codes`, getHeaders())
}

/**
 * get code by hotelId
 */
export const getMarketCodesByHotelId = (hotelId:number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/market_codes?hotelId=${hotelId}`, getHeaders())
}

/**
 * Post a new market code
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postMarketCode = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/market_codes`, data, getHeaders())
}

/**
 * Get a market code by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getMarketCodeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/market_codes/${id}`, getHeaders())
}

/**
 * Update a market code
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateMarketCodeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/market_codes/${id}`, data, getHeaders())
}

/**
 * Delete a market code
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteMarketCodeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/market_codes/${id}`, getHeaders())
}


// this section is for Reservation Type

/**
 * Get all reservation types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReservationTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservation_types`, getHeaders())
}

/**
 * Get all reservation types by hotel Id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReservationTypesByHotelId = (hotelId:any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservation_types?hotelId=${hotelId}`, getHeaders())
}

/**
 * Post a new reservation type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postReservationType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservation_types`, data, getHeaders())
}

/**
 * Get a reservation type by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReservationTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservation_types/${id}`, getHeaders())
}

/**
 * Update a reservation type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateReservationTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/reservation_types/${id}`, data, getHeaders())
}

/**
 * Delete a reservation type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteReservationTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/reservation_types/${id}`, getHeaders())
}


// this section is for Preference Type

/**
 * Get all preference types
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferenceTypes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preference_types`, getHeaders())
}

/**
 * Post a new preference type
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPreferenceType = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/preference_types`, data, getHeaders())
}

/**
 * Get a preference type by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferenceTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preference_types/${id}`, getHeaders())
}

/**
 * Update a preference type
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePreferenceTypeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/preference_types/${id}`, data, getHeaders())
}

/**
 * Delete a preference type
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePreferenceTypeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/preference_types/${id}`, getHeaders())
}


// this section is for Preference

/**
 * Get all preferences
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferences = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preferences`, getHeaders())
}

/**
 * Post a new preference
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postPreference = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/preferences`, data, getHeaders())
}

/**
 * Get a preference by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPreferenceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preferences/${id}`, getHeaders())
}

/**
 * Update a preference
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updatePreferenceById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/preferences/${id}`, data, getHeaders())
}

/**
 * Delete a preference
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deletePreferenceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/preferences/${id}`, getHeaders())
}

/**
 * get by hotel Id
 */
export const getPreferencesByHotelId = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/preferences?hotelId=${hotelId}`, getHeaders())
}


// this section is for Business Source

/**
 * Get all business sources
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBusinessSources = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/business_sources`, getHeaders())
}

/**
 * Get all business sources by hotel
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBusinessSourcesByHotelId = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/business_sources?hotelId=${hotelId}`, getHeaders())
}

/**
 * Post a new business source
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postBusinessSource = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/business_sources`, data, getHeaders())
}

/**
 * Get a business source by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBusinessSourceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/business_sources/${id}`, getHeaders())
}

/**
 * Update a business source
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateBusinessSourceById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/business_sources/${id}`, data, getHeaders())
}

/**
 * Delete a business source
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteBusinessSourceById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/business_sources/${id}`, getHeaders())
}

// this section is for booking source

/**
 * Get all booking source
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBookingSources = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/booking_sources`, getHeaders())
}

/**
 * Get all booking source by hotel
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getBookingSourcesByHotelId = (hotelId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/booking_sources?hotelId=${hotelId}`, getHeaders())
}
// this section is for Extra Charge

/**
 * Get all extra charges
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getExtraCharges = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/extra_charges`, getHeaders())
}

/**
 * Post a new extra charge
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postExtraCharge = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/extra_charges`, data, getHeaders())
}

/**
 * Get an extra charge by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getExtraChargeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/extra_charges/${id}`, getHeaders())
}

/**
 * Update an extra charge
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateExtraChargeById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/extra_charges/${id}`, data, getHeaders())
}

/**
 * Delete an extra charge
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteExtraChargeById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/extra_charges/${id}`, getHeaders())
}


// this section is for Tax

/**
 * Get all taxes
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTaxes = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/taxes`, getHeaders())
}

/**
 * Post a new tax
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const postTax = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/taxes`, data, getHeaders())
}

/**
 * Get a tax by ID
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTaxById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/taxes/${id}`, getHeaders())
}

/**
 * Update a tax
 * @param id
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateTaxById = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/taxes/${id}`, data, getHeaders())
}

/**
 * Delete a tax
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteTaxById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/taxes/${id}`, getHeaders())
}

/**
 * get Reasons by category
 * @param category - The category to filter reasons by
 */
export const getByCategory = (hotelId: number | string, category: string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reasons/${hotelId}/${category}`, getHeaders())
}

// this section is for email Account

// Email Accounts CRUD Operations
export const emailAccountsApi = {
  // Get all email accounts with pagination
  async getEmailAccounts(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/email-accounts`, {
        params,
        ...getHeaders()
      })
      return response.data
    } catch (error) {
      console.error('Error fetching email accounts:', error)
      throw error
    }
  },

  // Create new email account
  async createEmailAccount(data: {
    hotelId: number
    title: string
    emailAddress: string
    displayName: string
    signature?: string
    isActive?: boolean
  }) {
    try {
      // Input validation
      if (!data.hotelId || data.hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }
      if (!data.title || data.title.trim().length === 0 || data.title.length > 255) {
        throw new Error('Title is required and must be between 1-255 characters')
      }
      if (!data.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress) || data.emailAddress.length > 255) {
        throw new Error('Valid email address is required (max 255 characters)')
      }
      if (!data.displayName || data.displayName.trim().length === 0 || data.displayName.length > 255) {
        throw new Error('Display name is required and must be between 1-255 characters')
      }

      const response = await axios.post(`${API_URL}/email-accounts`, data, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error creating email account:', error)
      throw error
    }
  },

  // Get active email accounts for a hotel
  async getActiveEmailAccounts(hotelId: number) {
    try {
      if (!hotelId || hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }

      const response = await axios.get(`${API_URL}/email-accounts/active/${hotelId}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error fetching active email accounts:', error)
      throw error
    }
  },

  // Get single email account by ID
  async getEmailAccount(id: number) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid account ID is required')
      }

      const response = await axios.get(`${API_URL}/email-accounts/${id}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error fetching email account:', error)
      throw error
    }
  },

  // Update email account
  async updateEmailAccount(id: number, data: {
    hotelId?: number
    title?: string
    emailAddress?: string
    displayName?: string
    signature?: string
    isActive?: boolean
  }) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid account ID is required')
      }

      // Input validation for provided fields
      if (data.hotelId !== undefined && data.hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }
      if (data.title !== undefined && (data.title.trim().length === 0 || data.title.length > 255)) {
        throw new Error('Title must be between 1-255 characters')
      }
      if (data.emailAddress && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress) || data.emailAddress.length > 255)) {
        throw new Error('Valid email address is required (max 255 characters)')
      }
      if (data.displayName !== undefined && (data.displayName.trim().length === 0 || data.displayName.length > 255)) {
        throw new Error('Display name must be between 1-255 characters')
      }

      const response = await axios.put(`${API_URL}/email-accounts/${id}`, data, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error updating email account:', error)
      throw error
    }
  },

  // Delete email account
  async deleteEmailAccount(id: number) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid account ID is required')
      }

      const response = await axios.delete(`${API_URL}/email-accounts/${id}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error deleting email account:', error)
      throw error
    }
  },

  // Toggle active status
  async toggleActiveStatus(id: number, data?: { isActive?: boolean }) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid account ID is required')
      }

      const response = await axios.patch(`${API_URL}/email-accounts/${id}/toggle-active`, data || {}, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error toggling email account status:', error)
      throw error
    }
  }
}

// this section is for email Templates

// Email Templates CRUD Operations
export const emailTemplatesApi = {
  // Get all email templates with pagination
  async getEmailTemplates(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/email-templates`, {
        params,
        ...getHeaders()
      })
      return response.data
    } catch (error) {
      console.error('Error fetching email templates:', error)
      throw error
    }
  },

  // Create new email template
  async createEmailTemplate(data: {
    hotelId: number
    name: string
    category: string
    subject: string
    messageBody: string
    autoSend?: string
    attachment?: string
    emailAccount?: string
    scheduleDate?: string
    isActive?: boolean
  }) {
    try {
      // Input validation
      if (!data.hotelId || data.hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }
      if (!data.name || data.name.trim().length === 0 || data.name.length > 255) {
        throw new Error('Template name is required and must be between 1-255 characters')
      }
      if (!data.category || data.category.trim().length === 0) {
        throw new Error('Category is required')
      }
      if (!data.subject || data.subject.trim().length === 0 || data.subject.length > 500) {
        throw new Error('Subject is required and must be between 1-500 characters')
      }
      if (!data.messageBody || data.messageBody.trim().length === 0) {
        throw new Error('Message body is required')
      }

      const response = await axios.post(`${API_URL}/email-templates`, data, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error creating email template:', error)
      throw error
    }
  },

  // Get active email templates for a hotel
  async getActiveEmailTemplates(hotelId: number) {
    try {
      if (!hotelId || hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }

      const response = await axios.get(`${API_URL}/email-templates/active/${hotelId}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error fetching active email templates:', error)
      throw error
    }
  },

  // Get email templates by category
  async getEmailTemplatesByCategory(hotelId: number, category: string) {
    try {
      if (!hotelId || hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }
      if (!category || category.trim().length === 0) {
        throw new Error('Category is required')
      }

      const response = await axios.get(`${API_URL}/email-templates/category/${hotelId}/${category}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error fetching email templates by category:', error)
      throw error
    }
  },

  // Get single email template by ID
  async getEmailTemplate(id: number) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid template ID is required')
      }

      const response = await axios.get(`${API_URL}/email-templates/${id}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error fetching email template:', error)
      throw error
    }
  },

  // Update email template
  async updateEmailTemplate(id: number, data: {
    hotelId?: number
    name?: string
    category?: string
    subject?: string
    messageBody?: string
    autoSend?: string
    attachment?: string
    emailAccount?: string
    scheduleDate?: string
    isActive?: boolean
  }) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid template ID is required')
      }

      // Input validation for provided fields
      if (data.hotelId !== undefined && data.hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }
      if (data.name !== undefined && (data.name.trim().length === 0 || data.name.length > 255)) {
        throw new Error('Template name must be between 1-255 characters')
      }
      if (data.category !== undefined && data.category.trim().length === 0) {
        throw new Error('Category is required')
      }
      if (data.subject !== undefined && (data.subject.trim().length === 0 || data.subject.length > 500)) {
        throw new Error('Subject must be between 1-500 characters')
      }
      if (data.messageBody !== undefined && data.messageBody.trim().length === 0) {
        throw new Error('Message body is required')
      }

      const response = await axios.put(`${API_URL}/email-templates/${id}`, data, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error updating email template:', error)
      throw error
    }
  },

  // Delete email template
  async deleteEmailTemplate(id: number) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid template ID is required')
      }

      const response = await axios.delete(`${API_URL}/email-templates/${id}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error deleting email template:', error)
      throw error
    }
  },

  // Toggle active status
  async toggleActiveStatus(id: number, data?: { isActive?: boolean }) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid template ID is required')
      }

      const response = await axios.patch(`${API_URL}/email-templates/${id}/toggle-active`, data || {}, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error toggling email template status:', error)
      throw error
    }
  },

  // Duplicate email template
  async duplicateEmailTemplate(id: number, newName?: string) {
    try {
      if (!id || id <= 0) {
        throw new Error('Valid template ID is required')
      }

      const response = await axios.post(`${API_URL}/email-templates/${id}/duplicate`, {
        newName: newName || undefined
      }, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error duplicating email template:', error)
      throw error
    }
  }
}

// VIP Status CRUD Operations
export const vipStatusApi = {
  // Get all VIP statuses for a hotel
  async getVipStatuses(hotelId: number, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/vip_statuses`, {
        params: {
          hotel_id:hotelId,
          ...params
        },
        ...getHeaders()}
      )
      return response.data
    } catch (error) {
      console.error('Error fetching VIP statuses:', error)
      throw error
    }
  },

  // Get single VIP status by ID
  async getVipStatus(id: number, hotelId: number) {
    try {
      const response = await axios.get(`${API_URL}/vip_statuses/${id}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error fetching VIP status:', error)
      throw error
    }
  },

  // Create new VIP status
  async createVipStatus(data: {
    name: string
    color: string
    icon: string
    hotelId: number
  }) {
    try {
      // Input validation
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('VIP status name is required')
      }
      if (!data.color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(data.color)) {
        throw new Error('Valid hex color is required (#RRGGBB or #RGB)')
      }
      if (!data.icon || data.icon.trim().length === 0) {
        throw new Error('Icon is required')
      }
      if (!data.hotelId || data.hotelId <= 0) {
        throw new Error('Valid hotel ID is required')
      }

      const response = await axios.post(`${API_URL}/vip_statuses`, data, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error creating VIP status:', error)
      throw error
    }
  },

  // Update VIP status
  async updateVipStatus(id: number, data: {
    name?: string
    color?: string
    icon?: string
    hotelId: number
  }) {
    try {
      // Input validation
      if (data.name !== undefined && data.name.trim().length === 0) {
        throw new Error('VIP status name cannot be empty')
      }
      if (data.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(data.color)) {
        throw new Error('Valid hex color is required (#RRGGBB or #RGB)')
      }
      if (data.icon !== undefined && data.icon.trim().length === 0) {
        throw new Error('Icon cannot be empty')
      }

      const response = await axios.put(`${API_URL}/vip_statuses/${id}`, data, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error updating VIP status:', error)
      throw error
    }
  },

  // Delete VIP status
  async deleteVipStatus(id: number, hotelId: number) {
    try {
      const response = await axios.delete(`${API_URL}/vip_statuses/${id}`, getHeaders())
      return response.data
    } catch (error) {
      console.error('Error deleting VIP status:', error)
      throw error
    }
  }
}

/**
 * Get incidental invoices with filter support
 * @param params - Filter parameters
 * @param params.hotelId - Hotel ID filter
 * @param params.guestId - Guest ID filter
 * @param params.folioId - Folio ID filter
 * @param params.invoiceNumber - Invoice number filter
 * @param params.status - Invoice status filter
 * @param params.dateFrom - Start date filter (YYYY-MM-DD)
 * @param params.dateTo - End date filter (YYYY-MM-DD)
 * @param params.guestName - Guest name filter
 * @param params.folioNumber - Folio number filter
 * @param params.type - Invoice type filter
 * @param params.amountMin - Minimum amount filter
 * @param params.amountMax - Maximum amount filter
 * @param params.createdBy - Created by user filter
 * @param params.page - Page number for pagination
 * @param params.limit - Number of items per page
 * @returns {Promise<AxiosResponse<any>>} incidental_invoices
 */
export const getIncidentalInvoices = (params?: {
  hotelId?: string | number;
  guestId?: string | number;
  folioId?: string | number;
  invoiceNumber?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  guestName?: string;
  folioNumber?: string;
  type?: string;
  amountMin?: number;
  amountMax?: number;
  createdBy?: string | number;
  page?: number;
  limit?: number;
  hideVoided?: boolean;
}): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/incidental_invoices`, {
    params,
    ...getHeaders()
  })
}

/**
 *
 * post incidental invoices
 */
export const postIncidentalInvoices = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/incidental_invoices`, data, getHeaders())
}


/**
 * void incidental invoices
 * @param id - incidental invoice id
 * @param data - incidental invoice data
 */

export const voidIncidentalInvoices = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/incidental_invoices/${id}/void`, data, getHeaders())
}

/**
 * Permission
 */
export const getConfiguration = (hotelId:number) :Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/permissions?hotelId=${hotelId}`, getHeaders())
}

