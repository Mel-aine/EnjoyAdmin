/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
const axios = apiClient



// Folio-related TypeScript interfaces
export interface CreateFolioData {
  hotelId: number
  guestId: number
  reservationId?: number
  folioType: string
  creditLimit?: number
  notes?: string
}

export interface UpdateFolioData {
  credit_limit?: number
  notes?: string
  guest_name?: string
}

export interface TransactionData {
  folioId: number
  transactionType: string
  category: string
  description: string
  amount: number
  quantity?: number
  unitPrice?: number
  taxAmount?: number
  departmentId?: number
  reference?: string
  notes?: string
  discountId?: number,

}

export interface SettlementData {
  folioId: number
  paymentMethodId: number
  amount: number
  reference?: string
  notes?: string
}

export interface TransferChargesData {
  fromFolioId: number
  toFolioId: number
  amount: number
  description: string
  reference?: string
}

export interface CheckoutData {
  folioId: number
  paymentMethodId: number
  paymentAmount: number
  paymentReference?: string
  notes?: string
}

export interface ReservationCheckoutData {
  reservationId: number
  payments: Array<{
    paymentMethodId: number
    paymentAmount: number
    paymentReference?: string
  }>
}

export interface ForceCloseData {
  folioId: number
  reason: string
  authorizedBy: number
}

export interface GroupFolioData {
  reservationId: number
  guestIds: number[]
}

export interface SearchParams {
  query?: string
  hotel_id?: number
  date_from?: string
  date_to?: string
  status?: string
  folio_type?: string
  has_balance?: boolean
  guest_name?: string
  folio_number?: string
}

export interface TransactionSearchParams {
  folio_id?: number
  transaction_type?: string
  category?: string
  date_from?: string
  date_to?: string
  amount_min?: number
  amount_max?: number
}

const API_URL = `${import.meta.env.VITE_API_URL as string}/folios`

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
 * get All Foglio
 */
export const getAllFoglio = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(API_URL, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error fetching foglio:', error)
    throw error
  }
}

/**
 * get Foglio with query parameters
 */
export const getFoglioWithParams = async (params: {
  page?: number
  limit?: number
  search?: string
  hotel_id?: number
  guest_id?: number
  reservation_id?: number
  folio_type?: string
  status?: string
  has_balance?: boolean
  is_overdue?: boolean
  date_from?: string
  date_to?: string
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()

    // Add parameters to query string if they exist
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.hotel_id) queryParams.append('hotel_id', params.hotel_id.toString())
    if (params.guest_id) queryParams.append('guest_id', params.guest_id.toString())
    if (params.reservation_id) queryParams.append('reservation_id', params.reservation_id.toString())
    if (params.folio_type) queryParams.append('folio_type', params.folio_type)
    if (params.status) queryParams.append('status', params.status)
    if (params.has_balance !== undefined) queryParams.append('has_balance', params.has_balance.toString())
    if (params.is_overdue !== undefined) queryParams.append('is_overdue', params.is_overdue.toString())
    if (params.date_from) queryParams.append('date_from', params.date_from)
    if (params.date_to) queryParams.append('date_to', params.date_to)

    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL
    const response: AxiosResponse = await axios.get(url, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error fetching foglio with params:', error)
    throw error
  }
}

/**
 * get Foglio by id
 */
export const getFoglioById = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error fetching foglio:', error)
    throw error
  }
}

/**
 * create Foglio
 */
export const createFoglio = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/reservation`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error creating foglio:', error)
    throw error
  }
}

/**
 * update Foglio
 */
export const updateFoglio = async (id: number, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${API_URL}/${id}`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error updating foglio:', error)
    throw error
  }
}

/**
 * delete Foglio
 */
export const deleteFoglio = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.delete(`${API_URL}/${id}`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error deleting foglio:', error)
    throw error
  }
}

// ===== FOLIO OPERATIONS =====

/**
 * Close Folio
 */
export const closeFolio = async (id: number, data: { notes?: string }): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/${id}/close`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error closing folio:', error)
    throw error
  }
}

/**
 * Reopen Folio
 */
export const reopenFolio = async (id: number, data: { reason?: string }): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/${id}/reopen`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error reopening folio:', error)
    throw error
  }
}

/**
 * Transfer Charges
 */
export const transferCharges = async (id: number, data: {
  to_folio_id: number
  amount: number
  description: string
}): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/${id}/transfer`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error transferring charges:', error)
    throw error
  }
}

// ===== SERVICE-BASED OPERATIONS =====

/**
 * Post Transaction
 */
export const postTransaction = async (data: TransactionData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/transactions`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error posting transaction:', error)
    throw error
  }
}

/**
 * Post Transaction
 */
export const updateTransaction = async (transactionId:any,data: TransactionData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${API_URL}/transactions/${transactionId}`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error posting transaction:', error)
    throw error
  }
}

/**
 * Settle Folio
 */
export const settleFolio = async (data: SettlementData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/settle`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error settling folio:', error)
    throw error
  }
}

/**
 * Transfer Charges Between Folios
 */
export const transferChargesBetweenFolios = async (data: TransferChargesData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/transfer-charges`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error transferring charges between folios:', error)
    throw error
  }
}

/**
 * Close Folio with Service
 */
export const closeFolioWithService = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/${id}/close-service`, {}, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error closing folio with service:', error)
    throw error
  }
}

/**
 * Reopen Folio with Service
 */
export const reopenFolioWithService = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/${id}/reopen-service`, {}, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error reopening folio with service:', error)
    throw error
  }
}

/**
 * Get Statement with Service
 */
export const getStatementWithService = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/statement-service`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting statement with service:', error)
    throw error
  }
}

// ===== FOLIO CREATION FOR DIFFERENT SCENARIOS =====

/**
 * Create Folio for Reservation
 */
export const createFolioForReservation = async (data: {
  reservationId: number
  folioType: string
  creditLimit?: number
  notes?: string
}): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/reservation`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error creating folio for reservation:', error)
    throw error
  }
}

/**
 * Create Folio for Walk-in Guest
 */
export const createFolioForWalkIn = async (data: {
  hotelId: number
  guestId: number
  folioType: string
  creditLimit?: number
  notes?: string
}): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/walk-in`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error creating folio for walk-in guest:', error)
    throw error
  }
}

/**
 * Create Folios for Group
 */
export const createFoliosForGroup = async (data: GroupFolioData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/group`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error creating folios for group:', error)
    throw error
  }
}

// ===== AUTOMATED POSTING =====

/**
 * Post Room Charges
 */
export const postRoomCharges = async (data: { reservationId: number }): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/post-room-charges`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error posting room charges:', error)
    throw error
  }
}

/**
 * Post Taxes and Fees
 */
export const postTaxesAndFees = async (data: { reservationId: number }): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/post-taxes-fees`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error posting taxes and fees:', error)
    throw error
  }
}

// ===== RESERVATION FOLIO MANAGEMENT =====

/**
 * Get Reservation Folios
 */
export const getReservationFolios = async (reservationId: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/reservation/${reservationId}`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting reservation folios:', error)
    throw error
  }
}

// ===== CHECKOUT AND SETTLEMENT =====

/**
 * Get Settlement Summary
 */
export const getSettlementSummary = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/settlement-summary`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting settlement summary:', error)
    throw error
  }
}

/**
 * Get Checkout Summary
 */
export const getCheckoutSummary = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/checkout-summary`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting checkout summary:', error)
    throw error
  }
}

/**
 * Process Checkout
 */
export const processCheckout = async (data: CheckoutData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/checkout`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error processing checkout:', error)
    throw error
  }
}

/**
 * Process Reservation Checkout
 */
export const processReservationCheckout = async (data: ReservationCheckoutData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/reservation-checkout`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error processing reservation checkout:', error)
    throw error
  }
}

/**
 * Force Close Folio
 */
export const forceCloseFolio = async (data: ForceCloseData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_URL}/force-close`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error force closing folio:', error)
    throw error
  }
}

/**
 * Validate Checkout
 */
export const validateCheckout = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/validate-checkout`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error validating checkout:', error)
    throw error
  }
}

// ===== FOLIO INQUIRY AND VIEWS =====

/**
 * Get Guest View
 */
export const getGuestView = async (id: number, includeSensitive?: boolean): Promise<any> => {
  try {
    const queryParams = includeSensitive ? '?include_sensitive=true' : ''
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/guest-view${queryParams}`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting guest view:', error)
    throw error
  }
}

/**
 * Get Staff View
 */
export const getStaffView = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/staff-view`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting staff view:', error)
    throw error
  }
}

/**
 * Search Folios
 */
export const searchFolios = async (params: SearchParams): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()

    if (params.query) queryParams.append('query', params.query)
    if (params.hotel_id) queryParams.append('hotel_id', params.hotel_id.toString())
    if (params.date_from) queryParams.append('date_from', params.date_from)
    if (params.date_to) queryParams.append('date_to', params.date_to)
    if (params.status) queryParams.append('status', params.status)
    if (params.folio_type) queryParams.append('folio_type', params.folio_type)
    if (params.has_balance !== undefined) queryParams.append('has_balance', params.has_balance.toString())
    if (params.guest_name) queryParams.append('guest_name', params.guest_name)
    if (params.folio_number) queryParams.append('folio_number', params.folio_number)

    const url = `${API_URL}/search/details?${queryParams.toString()}`
    const response: AxiosResponse = await axios.get(url, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error searching folios:', error)
    throw error
  }
}

/**
 * Search Transactions
 */
export const searchTransactions = async (params: TransactionSearchParams): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()

    if (params.folio_id) queryParams.append('folio_id', params.folio_id.toString())
    if (params.transaction_type) queryParams.append('transaction_type', params.transaction_type)
    if (params.category) queryParams.append('category', params.category)
    if (params.date_from) queryParams.append('date_from', params.date_from)
    if (params.date_to) queryParams.append('date_to', params.date_to)
    if (params.amount_min) queryParams.append('amount_min', params.amount_min.toString())
    if (params.amount_max) queryParams.append('amount_max', params.amount_max.toString())

    const url = `${API_URL}/transactions/search?${queryParams.toString()}`
    const response: AxiosResponse = await axios.get(url, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error searching transactions:', error)
    throw error
  }
}

/**
 * Get Timeline
 */
export const getTimeline = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/timeline`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting timeline:', error)
    throw error
  }
}

/**
 * Get Advanced Statistics
 */
export const getAdvancedStatistics = async (params: {
  hotel_id?: number
  date_from?: string
  date_to?: string
  group_by?: string
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()

    if (params.hotel_id) queryParams.append('hotel_id', params.hotel_id.toString())
    if (params.date_from) queryParams.append('date_from', params.date_from)
    if (params.date_to) queryParams.append('date_to', params.date_to)
    if (params.group_by) queryParams.append('group_by', params.group_by)

    const url = `${API_URL}/statistics-advanced?${queryParams.toString()}`
    const response: AxiosResponse = await axios.get(url, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting advanced statistics:', error)
    throw error
  }
}

// ===== REPORTS =====

/**
 * Get Folio Balance
 */
export const getFolioBalance = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/balance`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting folio balance:', error)
    throw error
  }
}

/**
 * Get Folio Statement
 */
export const getFolioStatement = async (id: number): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/${id}/statement-service`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting folio statement:', error)
    throw error
  }
}

/**
 * Get Statistics
 */
export const getStatistics = async (params: {
  hotel_id?: number
  date_from?: string
  date_to?: string
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()

    if (params.hotel_id) queryParams.append('hotel_id', params.hotel_id.toString())
    if (params.date_from) queryParams.append('date_from', params.date_from)
    if (params.date_to) queryParams.append('date_to', params.date_to)

    const url = `${API_URL}/statistics?${queryParams.toString()}`
    const response: AxiosResponse = await axios.get(url, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting statistics:', error)
    throw error
  }
}

// ===== FOLIO TRANSACTION MANAGEMENT =====

/**
 * Get All Folio Transactions
 */
export const getAllFolioTransactions = async (params: {
  page?: number
  limit?: number
  folio_id?: number
  transaction_type?: string
  category?: string
  date_from?: string
  date_to?: string
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.folio_id) queryParams.append('folio_id', params.folio_id.toString())
    if (params.transaction_type) queryParams.append('transaction_type', params.transaction_type)
    if (params.category) queryParams.append('category', params.category)
    if (params.date_from) queryParams.append('date_from', params.date_from)
    if (params.date_to) queryParams.append('date_to', params.date_to)

    const transactionApiUrl = `${import.meta.env.VITE_API_URL as string}/folio-transactions`
    const url = queryParams.toString() ? `${transactionApiUrl}?${queryParams.toString()}` : transactionApiUrl
    const response: AxiosResponse = await axios.get(url, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting folio transactions:', error)
    throw error
  }
}

/**
 * Get Folio Transaction by ID
 */
export const getFolioTransactionById = async (id: number): Promise<any> => {
  try {
    const transactionApiUrl = `${import.meta.env.VITE_API_URL as string}/folio-transactions`
    const response: AxiosResponse = await axios.get(`${transactionApiUrl}/${id}`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error getting folio transaction:', error)
    throw error
  }
}

/**
 * Create Folio Transaction
 */
export const createFolioTransaction = async (data: any): Promise<any> => {
  try {
    const transactionApiUrl = `${import.meta.env.VITE_API_URL as string}/folio-transactions`
    const response: AxiosResponse = await axios.post(transactionApiUrl, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error creating folio transaction:', error)
    throw error
  }
}

/**
 * Update Folio Transaction
 */
export const updateFolioTransaction = async (id: number, data: any): Promise<any> => {
  try {
    const transactionApiUrl = `${import.meta.env.VITE_API_URL as string}/folio-transactions`
    const response: AxiosResponse = await axios.put(`${transactionApiUrl}/${id}`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error updating folio transaction:', error)
    throw error
  }
}

/**
 * Delete Folio Transaction
 */
export const deleteFolioTransaction = async (id: number): Promise<any> => {
  try {
    const transactionApiUrl = `${import.meta.env.VITE_API_URL as string}/folio-transactions`
    const response: AxiosResponse = await axios.delete(`${transactionApiUrl}/${id}`, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error deleting folio transaction:', error)
    throw error
  }
}

/**
 * Void Folio Transaction
 */
export const voidFolioTransaction = async (id: number, data: { reason: string }): Promise<any> => {
  try {
    const transactionApiUrl = `${import.meta.env.VITE_API_URL as string}/folio-transactions`
    const response: AxiosResponse = await axios.post(`${transactionApiUrl}/${id}/void`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error voiding folio transaction:', error)
    throw error
  }
}

/**
 * Reverse Folio Transaction
 */
export const reverseFolioTransaction = async (id: number, data: { reason: string }): Promise<any> => {
  try {
    const transactionApiUrl = `${import.meta.env.VITE_API_URL as string}/folio-transactions`
    const response: AxiosResponse = await axios.post(`${transactionApiUrl}/${id}/reverse`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error reversing folio transaction:', error)
    throw error
  }
}

/**
 * folio printer
 * @param data
 * @returns
 */
export const printFolio = async (data: {
  folioId: number
  reservationId?: number
  currencyId?: number
}): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folio-transactions/print`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error printing folio:', error)
    throw error
  }
}


/**
 * folio printer
 * @param data
 * @returns
 */
export const printFolioPdf = async (data: {
  folioId: number
  reservationId?: number
  currencyId?: number
}): Promise<any> => {

  const headersWithBlob = { ...getHeaders(), responseType: 'blob' as const }
  try {
    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folio-print/print-pdf`, data, headersWithBlob)
    return response.data
  } catch (error) {
    console.error('Error printing folio:', error)
    throw error
  }
}
export const printConfirmBookingPdf = async (data: {
  reservationId?: number
  language?: string
}): Promise<any> => {
  try {
    const headersWithBlob = { ...getHeaders(), responseType: 'blob' as const }

    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folio-print/print_confirm_booking-pdf`, data, headersWithBlob)
    return response.data
  } catch (error) {
    console.error('Error printing confirmBooking:', error)
    throw error
  }
}
export const printHotelPdf = async (data: {
  reservationId?: number
  language?: string
}): Promise<any> => {
  try {
    const headersWithBlob = { ...getHeaders(), responseType: 'blob' as const }

    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folio-print/print_hotel-pdf`, data, headersWithBlob)
    return response.data
  } catch (error) {
    console.error('Error printing confirmBooking:', error)
    throw error
  }
}

export const getUnsetteledFolio = async (hotelId: number,params:any={}): Promise<any> => {

  try {
    const response: AxiosResponse = await axios.get(`${import.meta.env.VITE_API_URL as string}/folios/unsettled/${hotelId}`, {...getHeaders(),params})
    return response.data
  } catch (error) {
    console.error('Error fetching folio:', error)
    throw error
  }
}



/**
 * get Foglio with query parameters
 */
export const findFolio = async (params: {
  page?: number
  limit?: number
  hotelId?: number
  searchText?: string
  inhouse?: boolean
  reservation?: boolean
  dateFrom?: string
  dateTo?: string
}): Promise<any> => {
  try {
    const queryParams = new URLSearchParams()

    // Add parameters to query string if they exist
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.searchText) queryParams.append('searchText', params.searchText.toString())
    if (params.hotelId) queryParams.append('hotelId', params.hotelId.toString())
    if (params.inhouse) queryParams.append('inhouse', params.inhouse.toString())
    if (params.reservation) queryParams.append('reservation', params.reservation.toString())
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
    if (params.dateTo) queryParams.append('dateTo', params.dateTo)
    const url = queryParams.toString() ? `${API_URL}/comprehensive/search?${queryParams.toString()}` : API_URL
    const response: AxiosResponse = await axios.get(url, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error fetching foglio with params:', error)
    throw error
  }
}


/**
 * split folio
 * @param data
 * @returns
 */
export const splitFolioHandler = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folios/split`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error splitting folio:', error)
    throw error
  }
}

/**
 * cut folio
 * @param data
 * @returns
 */
export const cutFolioHandler = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folios/cut`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error cutting folio:', error)
    throw error
  }
}

/**
 * add room charge
 * @param data
 * @returns   room charge
 */
export const addRoomChargeHandler = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folios/room-charge/add`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error adding room charge:', error)
    throw error
  }
}

/**
 * update room charge
 * @param data
 * @returns   room charge
 */
export const updateRoomChargeHandler = async (transactionId:any,data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${import.meta.env.VITE_API_URL as string}/folios/room-charge/${transactionId}`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error update room charge:', error)
    throw error
  }
}

/**
 * add adjustment
 * @param data
 * @returns   adjustment
 */
export const addAdjustmentHandler = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folios/adjustment/add`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error adding adjustment:', error)
    throw error
  }
}


/**
 * update adjustement
 */
export const updateAdjustmentHandler = async (transactionId:any,data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${import.meta.env.VITE_API_URL as string}/folios/adjustment/${transactionId}`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error update adjustment:', error)
    throw error
  }
}

/**
 * apply discount
 * @param data
 * @returns   discount
 */
export const applyDiscountHandler = async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_API_URL as string}/folios/apply/discount`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error applying discount:', error)
    throw error
  }
}

/**
 * update Discount
 */
export const updateDiscountHandler = async (transactionId:any,data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${import.meta.env.VITE_API_URL as string}/folios/update/discount/${transactionId}`, data, getHeaders())
    return response.data
  } catch (error) {
    console.error('Error updating discount:', error)
    throw error
  }
}
