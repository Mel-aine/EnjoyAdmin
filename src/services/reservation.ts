/**
 * Reservation Service — Offline-Aware
 *
 * Toutes les fonctions API utilisent offlineAwareApiCall pour
 * fonctionner en mode hors ligne (cache pour les GET, file d'attente
 * pour les écritures).
 *
 * Les fonctions d'impression (printGuestReservationCard/Police)
 * conservent un appel axios direct car elles nécessitent responseType: 'blob'.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'
import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'

// ── Types ──────────────────────────────────────────────────────────────

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
}

// ── Helpers d'impression (gardent axios direct pour le blob) ──────────

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}

// ── Priorités offline ──────────────────────────────────────────────────
// 10 — Critique (check-in, checkout)
//  7 — Haute   (création/modif réservation, assignation chambre)
//  5 — Normale (mise à jour, discount)

// ═══════════════════════════════════════════════════════════════════════
//  CHECK-IN / CHECK-OUT
// ═══════════════════════════════════════════════════════════════════════

/** Check-in d'une réservation (critique) */
export const checkInReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/checkin`, {
      data: datas,
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 10,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Check-in avec services (critique) */
export const checkInReservations = async (
  reservationId: number,
  reservationServiceProductIds: number[]
): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/checkin`, {
      data: { reservationServiceProducts: reservationServiceProductIds },
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 10,
    })
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Check-out d'une réservation (critique) */
export const checkOutReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/check-out`, {
      data: datas,
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 10,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Check-out avec services (critique) */
export const checkOutReservations = async (
  reservationId: number,
  reservationServiceProductIds: number[]
): Promise<ApiResponse | undefined> => {
  try {
    const result = await offlineAwareApiCall('PATCH', `/reservations/${reservationId}/check-out`, {
      data: { reservationServiceProducts: reservationServiceProductIds },
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 10,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Undo check-in */
export const undoCheckInReservation = async (reservationId: number, datas: any): Promise<ApiResponse | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/undo-checkin`, {
      data: datas,
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Undo check-out */
export const undoCheckOutReservation = async (reservationId: number, datas: any): Promise<ApiResponse | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/undo-check-out`, {
      data: datas,
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}


// ═══════════════════════════════════════════════════════════════════════
//  CRUD RÉSERVATION
// ═══════════════════════════════════════════════════════════════════════

/** Créer une réservation (haute priorité) */
export const createReservation = async (data: any) => {
  try {
    console.log('Sending reservation data to backend:', data)
    const result = await offlineAwareApiCall('POST', '/reservation/create', {
      data,
      resourceType: 'reservation',
      queuePriority: 7,
    })
    console.log('Backend response:', result.data)
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

/** Insérer une réservation (haute priorité) */
export const insertReservation = async (data: any) => {
  try {
    console.log('Sending reservation data to backend:', data)
    const result = await offlineAwareApiCall('POST', '/reservation/inserttrasaction', {
      data,
      resourceType: 'reservation',
      queuePriority: 7,
    })
    console.log('Backend response:', result.data)
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

/** Annuler une réservation */
export const cancelReservation = async (data: any) => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${data.reservationId}/cancel`, {
      data,
      resourceType: 'reservation',
      resourceId: data.reservationId,
      queuePriority: 7,
    })
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

/** Vider une réservation */
export const voidReservation = async (reservationId: any, data: any) => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/void`, {
      data,
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 7,
    })
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

/** Amender le séjour (PUT) */
export const amendReservation = async (data: any) => {
  try {
    const result = await offlineAwareApiCall('PUT', `/reservation/${data.reservationId}/amend-stay`, {
      data,
      resourceType: 'reservation',
      resourceId: data.reservationId,
      queuePriority: 7,
    })
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

/** Marquer no-show */
export const markNoShow = async (data: any) => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${data.reservationId}/no-show`, {
      data,
      resourceType: 'reservation',
      resourceId: data.reservationId,
      queuePriority: 7,
    })
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

/** Confirmer / mettre à jour le statut */
export const confirmBooking = async (id: number, data: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('PATCH', `/reservation/${id}/update_status`, {
      data,
      resourceType: 'reservation',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}


// ═══════════════════════════════════════════════════════════════════════
//  CHAMBRES — ASSIGN / UNASSIGN / MOVE / EXCHANGE
// ═══════════════════════════════════════════════════════════════════════

/** Désassigner une chambre */
export const unAssignRoomReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/unassign-room`, {
      data: datas,
      resourceType: 'reservation_room',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Assigner une chambre */
export const assignRoomReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/assign-room`, {
      data: datas,
      resourceType: 'reservation_room',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Déplacer une chambre */
export const postRoomMoveReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/room-move`, {
      data: datas,
      resourceType: 'reservation_room',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Échanger une chambre */
export const postExchangeRoomReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/exchange-room`, {
      data: datas,
      resourceType: 'reservation_room',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Arrêter le déplacement de chambre */
export const stopRoomMoveReservation = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservation/${reservationId}/stop-room-move`, {
      data: datas,
      resourceType: 'reservation_room',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Mettre disponible un service produit */
export const setAvailable = async (id: number): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('PATCH', `/service_product/${id}/available`, {
      resourceType: 'room',
      resourceId: id,
      queuePriority: 5,
    })
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}


// ═══════════════════════════════════════════════════════════════════════
//  LECTURE — RÉSERVATIONS
// ═══════════════════════════════════════════════════════════════════════

/** Récupérer les réservations pour une chambre */
export const getRoomReservations = async (serviceProductId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/reservations/service-product/${serviceProductId}`, {
      resourceType: 'reservation',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}

/** Détails complets d'une réservation */
export const getReservationDetailsById = async (reservationId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/reservation/${reservationId}/details`, {
      resourceType: 'reservation',
      resourceId: reservationId,
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}

/** Détails basiques d'une réservation */
export const getReservationBasicDetailsById = async (reservationId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/reservation/${reservationId}/basicdetails`, {
      resourceType: 'reservation',
      resourceId: reservationId,
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}

/** Récupérer une réservation par ID */
export const getReservationById = async (reservationId: number): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('GET', `/reservations/${reservationId}`, {
      resourceType: 'reservation',
      resourceId: reservationId,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching reservation:', error)
    throw error
  }
}

/** Récupérer les réservations relâchées */
export const getReleaseReservations = async (data: any) => {
  try {
    const result = await offlineAwareApiCall('GET', `/reservation/hotel/${data.hotelId}/released`, {
      params: { date: data.data },
      resourceType: 'reservation',
    })
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

/** Récupérer les charges d'une chambre (folio) */
export const getRoomCharges = async (reservationId: any) => {
  try {
    const result = await offlineAwareApiCall('GET', `/reservation/${reservationId}/room-charges`, {
      resourceType: 'folio',
      resourceId: reservationId,
    })
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    })
    throw error
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  LECTURE — CLIENTS
// ═══════════════════════════════════════════════════════════════════════

/** Récupérer un client */
export const getCustomer = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/guests/${id}/customer`, {
      resourceType: 'guest',
      resourceId: id,
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération réservations pour chambre:', error)
    return []
  }
}

/** Récupérer les clients d'une réservation */
export const getReservatonCustomers = async (serviceProductId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/guests/${serviceProductId}/customer`, {
      resourceType: 'guest',
    })
    return result.data || []
  } catch (error) {
    console.error('Erreur récupération clients:', error)
    return []
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  MISE À JOUR
// ═══════════════════════════════════════════════════════════════════════

/** Mettre à jour les détails d'une réservation (PUT) */
export const updateReservationDetails = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/reservations/${reservationId}/update-details`, {
      data: datas,
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 7,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Détails d'une réservation pour édition (retourne ApiProxyResult avec .data) */
export async function getReservationDetailsForUpdate(reservationId: number) {
  const result = await offlineAwareApiCall('GET', `/reservation/${reservationId}/details-for-update`, {
    resourceType: 'reservation',
    resourceId: reservationId,
  })
  return result
}

/** Mettre à jour le booking detail (PUT) */
export const updateBookingDetail = async (reservationId: any, data: any) => {
  try {
    console.log('API Call - URL:', `/reservation/${reservationId}/booking-detail`)
    console.log('API Call - Data:', data)

    const result = await offlineAwareApiCall('PUT', `/reservation/${reservationId}/booking-detail`, {
      data,
      resourceType: 'reservation',
      resourceId: reservationId,
      queuePriority: 7,
    })

    console.log('API Response:', result.data)
    return result.data
  } catch (error: any) {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      requestData: error.config?.data,
    })
    throw error
  }
}

/** Appliquer un discount (POST) */
export const applyDiscountReservationDetails = async (reservationId: number, datas: any): Promise<any | undefined> => {
  try {
    const result = await offlineAwareApiCall('POST', `/reservations/${reservationId}/apply-discount`, {
      data: datas,
      resourceType: 'folio',
      resourceId: reservationId,
      queuePriority: 5,
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}


// ═══════════════════════════════════════════════════════════════════════
//  IMPRESSION — Conservent axios direct (besoin de responseType: 'blob')
// ═══════════════════════════════════════════════════════════════════════

/** Imprimer la carte d'enregistrement du client */
export const printGuestReservationCard = async (data: {
  reservationId: number
  guestId: number
}): Promise<any> => {
  try {
    const headersWithBlob = { ...getHeaders(), responseType: 'blob' as const }
    const response = await apiClient.post(`/reservation/print-guest-card`, data, headersWithBlob)
    return response.data
  } catch (error) {
    console.error('Error printing guest card:', error)
    throw error
  }
}

/** Imprimer la fiche police du client */
export const printGuestReservationPolice = async (data: {
  reservationId: number
  guestId: number
}): Promise<any> => {
  try {
    const headersWithBlob = { ...getHeaders(), responseType: 'blob' as const }
    const response = await apiClient.post(`/reservation/print-guest-police`, data, headersWithBlob)
    return response.data
  } catch (error) {
    console.error('Error printing guest police:', error)
    throw error
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  GESTION DES ERREURS
// ═══════════════════════════════════════════════════════════════════════

const handleApiError = (error: any): never => {
  console.error('Erreur API:', error)
  throw {
    code: error.response?.data?.code,
    message: error.response?.data?.message || 'Erreur API',
    error: error.response?.data?.error || error.message,
  }
}
