/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Folio API Service — Offline-Aware
 *
 * Toutes les fonctions API utilisent offlineAwareApiCall pour
 * fonctionner en mode hors ligne (cache pour les GET, file d'attente
 * pour les écritures).
 *
 * Les fonctions d'impression (printFolioPdf, printConfirmBookingPdf, printHotelPdf)
 * conservent un appel axios direct (responseType: 'blob').
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'

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

/**
 * get All Foglio
 */
export const getAllFoglio = async (): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', '/folios', {
      resourceType: 'folio',
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', '/folios', {
      resourceType: 'folio',
      params,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/reservation', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('PUT', `/folios/${id}`, {
      data,
      resourceType: 'folio',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('DELETE', `/folios/${id}`, {
      resourceType: 'folio',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', `/folios/${id}/close`, {
      data,
      resourceType: 'folio',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', `/folios/${id}/reopen`, {
      data,
      resourceType: 'folio',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', `/folios/${id}/transfer`, {
      data,
      resourceType: 'folio',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/transactions', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error posting transaction:', error)
    throw error
  }
}

/**
 * Update Transaction
 */
export const updateTransaction = async (transactionId: any, data: TransactionData): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/folios/transactions/${transactionId}`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: transactionId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw error
  }
}

/**
 * Settle Folio
 */
export const settleFolio = async (data: SettlementData): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/folios/settle', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/transfer-charges', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', `/folios/${id}/close-service`, {
      resourceType: 'folio',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', `/folios/${id}/reopen-service`, {
      resourceType: 'folio',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/statement-service`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/reservation', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/walk-in', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/group', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/post-room-charges', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/post-taxes-fees', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/reservation/${reservationId}`, {
      resourceType: 'folio',
      resourceId: reservationId,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/settlement-summary`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/checkout-summary`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/checkout', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/reservation-checkout', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folios/force-close', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/validate-checkout`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/guest-view`, {
      resourceType: 'folio',
      resourceId: id,
      params: includeSensitive ? { include_sensitive: 'true' } : undefined,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/staff-view`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', '/folios/search/details', {
      resourceType: 'folio',
      params,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', '/folios/transactions/search', {
      resourceType: 'folio_transaction',
      params,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/timeline`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', '/folios/statistics-advanced', {
      resourceType: 'folio',
      params,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/balance`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folios/${id}/statement-service`, {
      resourceType: 'folio',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', '/folios/statistics', {
      resourceType: 'folio',
      params,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', '/folio-transactions', {
      resourceType: 'folio_transaction',
      params,
    })
    return result.data
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
    const result = await offlineAwareApiCall('GET', `/folio-transactions/${id}`, {
      resourceType: 'folio_transaction',
      resourceId: id,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', '/folio-transactions', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('PUT', `/folio-transactions/${id}`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('DELETE', `/folio-transactions/${id}`, {
      resourceType: 'folio_transaction',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', `/folio-transactions/${id}/void`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
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
    const result = await offlineAwareApiCall('POST', `/folio-transactions/${id}/reverse`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error reversing folio transaction:', error)
    throw error
  }
}

/**
 * folio printer
 */
export const printFolio = async (data: {
  folioId: number
  reservationId?: number
  currencyId?: number
}): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/folio-transactions/print', {
      data,
      resourceType: 'folio',
      queuePriority: 5,
    })
    return result.data
  } catch (error) {
    console.error('Error printing folio:', error)
    throw error
  }
}


/**
 * Print Folio PDF (blob — conserve axios direct)
 */
export const printFolioPdf = async (data: {
  folioId: number
  reservationId?: number
  currencyId?: number
}): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post('/folio-print/print-pdf', data, {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    console.error('Error printing folio:', error)
    throw error
  }
}

/**
 * Print Confirm Booking PDF (blob — conserve axios direct)
 */
export const printConfirmBookingPdf = async (data: {
  reservationId?: number
  language?: string
}): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post('/folio-print/print_confirm_booking-pdf', data, {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    console.error('Error printing confirmBooking:', error)
    throw error
  }
}

/**
 * Print Hotel PDF (blob — conserve axios direct)
 */
export const printHotelPdf = async (data: {
  reservationId?: number
  language?: string
}): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post('/folio-print/print_hotel-pdf', data, {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    console.error('Error printing hotel PDF:', error)
    throw error
  }
}

/**
 * Get unsettled folios
 */
export const getUnsetteledFolio = async (hotelId: number, params: any = {}): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/folios/unsettled/${hotelId}`, {
      resourceType: 'folio',
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching unsettled folios:', error)
    throw error
  }
}

/**
 * Find folio with comprehensive search
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
    const result = await offlineAwareApiCall('GET', '/folios/comprehensive/search', {
      resourceType: 'folio',
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error finding folio:', error)
    throw error
  }
}


/**
 * Split folio
 */
export const splitFolioHandler = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/folios/split', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error splitting folio:', error)
    throw error
  }
}

/**
 * Cut folio
 */
export const cutFolioHandler = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/folios/cut', {
      data,
      resourceType: 'folio',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error cutting folio:', error)
    throw error
  }
}

/**
 * Add room charge
 */
export const addRoomChargeHandler = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/folios/room-charge/add', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error adding room charge:', error)
    throw error
  }
}

/**
 * Update room charge
 */
export const updateRoomChargeHandler = async (transactionId: any, data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/folios/room-charge/${transactionId}`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: transactionId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating room charge:', error)
    throw error
  }
}

/**
 * Add adjustment
 */
export const addAdjustmentHandler = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/folios/adjustment/add', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error adding adjustment:', error)
    throw error
  }
}

/**
 * Update adjustment
 */
export const updateAdjustmentHandler = async (transactionId: any, data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/folios/adjustment/${transactionId}`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: transactionId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating adjustment:', error)
    throw error
  }
}

/**
 * Apply discount
 */
export const applyDiscountHandler = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/folios/apply/discount', {
      data,
      resourceType: 'folio_transaction',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error applying discount:', error)
    throw error
  }
}

/**
 * Update discount
 */
export const updateDiscountHandler = async (transactionId: any, data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/folios/update/discount/${transactionId}`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: transactionId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating discount:', error)
    throw error
  }
}

/**
 * Send invoice by email (EN LIGNE UNIQUEMENT — nécessite connexion réseau)
 */
export const sendInvoiceByEmail = async (data: {
  reservationId: number
  recipientEmail: string
  folioId?: number | null
  language?: 'fr' | 'en'
}): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post('/folio-print/send-invoice-email', data)
    return response.data
  } catch (error) {
    console.error('Error sending invoice by email:', error)
    throw error
  }
}

/**
 * Send voucher by email (EN LIGNE UNIQUEMENT)
 */
export const sendVoucherByEmail = async (data: {
  reservationId: number
  recipientEmail: string
  language?: 'fr' | 'en'
}): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post('/folio-print/send-voucher-email', data)
    return response.data
  } catch (error) {
    console.error('Error sending voucher by email:', error)
    throw error
  }
}

/**
 * Send invoice by WhatsApp (EN LIGNE UNIQUEMENT)
 */
export const sendInvoiceByWhatsapp = async (data: {
  reservationId: number
  recipientPhone?: string | null
  folioId?: number | null
  language?: 'fr' | 'en'
}): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post('/folio-print/send-invoice-whatsapp', data)
    return response.data
  } catch (error) {
    console.error('Error sending invoice by WhatsApp:', error)
    throw error
  }
}

/**
 * Send voucher by WhatsApp (EN LIGNE UNIQUEMENT)
 */
export const sendVoucherByWhatsapp = async (data: {
  reservationId: number
  recipientPhone?: string | null
  language?: 'fr' | 'en'
}): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post('/folio-print/send-voucher-whatsapp', data)
    return response.data
  } catch (error) {
    console.error('Error sending voucher by WhatsApp:', error)
    throw error
  }
}