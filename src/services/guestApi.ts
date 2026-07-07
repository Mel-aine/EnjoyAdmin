/**
 * Guest API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne
 * (cache pour les GET, file d'attente pour les écritures).
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

// Interface for Guest data
export interface GuestPayload {
  hotelId?: number
  title?: string
  firstName?: string
  lastName?: string
  name?: string
  phonePrimary?: string
  mobileNumber?: string
  guestType?: string
  email?: string
  gender?: string
  addressLine?: string
  stateProvince?: string
  postalCode?: string
  city?: string
  management?: string
  country?: string
  nationality?: string
  companyName?: string
  fax?: string
  registrationNumber?: string
  profilePhoto?: string
  idPhoto?: string
  idExpiryDate?: string
  issuingCountry?: string
  issuingCity?: string
  vipStatusId?: any
  idType?: string
  idNumber?: string
  dateOfBirth?: string
  placeOfBirth?: string
  profession?: string
  maidenName?: string
  contactType?: string
  reservationId?: number
  preferences?: any
  contactTypeValue?: string
}

/** Create a new guest */
export const createGuest = async (guestData: GuestPayload): Promise<any> => {
  try {
    const tempId = `tmp-guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const result = await offlineAwareApiCall('POST', '/guests', {
      data: guestData,
      resourceType: 'guest',
      queuePriority: 7,
      optimisticData: {
        ...guestData,
        id: tempId,
        guestId: tempId,
        _tempId: true,
      },
    })
    return result.data
  } catch (error) {
    console.error('Error creating guest:', error)
    throw error
  }
}

/** Update existing guest */
export const updateGuest = async (id: number, guestData: GuestPayload): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/guests/${id}`, {
      data: guestData,
      resourceType: 'guest',
      resourceId: id,
      queuePriority: 7,
      optimisticData: {
        ...guestData,
        id,
      },
    })
    return result.data
  } catch (error) {
    console.error('Error updating guest:', error)
    throw error
  }
}

/** Get guest by ID */
export const getGuestById = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/guests/${id}`, {
      resourceType: 'guest',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching guest:', error)
    throw error
  }
}

/** Delete guest */
export const deleteGuest = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('DELETE', `/guests/${id}`, {
      resourceType: 'guest',
      resourceId: id,
      queuePriority: 7,
      optimisticData: { id, _deleted: true },
    })
    return result.data
  } catch (error) {
    console.error('Error deleting guest:', error)
    throw error
  }
}

/** Guest detail */
export const getCustomerProfile = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/guests/customers/${id}/details`, {
      resourceType: 'guest',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching customer profile:', error)
    throw error
  }
}

export const getCustomerActivityLogs = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/guests/customers/${id}/activity-logs`, {
      resourceType: 'guest',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching customer activity logs:', error)
    throw error
  }
}

export const getCustomerTransactions = async (id: number, params: any = {}): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/guests/customers/${id}/transactions`, {
      resourceType: 'folio_transaction',
      resourceId: id,
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching customer transactions:', error)
    throw error
  }
}

export const getCustomerReservations = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/guests/customers/${id}/reservations`, {
      resourceType: 'reservation',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching customer reservations:', error)
    throw error
  }
}

/** Blacklist a guest */
export const toggleGuestBlacklist = async (id: number, reason: string): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PATCH', `/guests/${id}/toggle-blacklist`, {
      data: { reason },
      resourceType: 'guest',
      resourceId: id,
      queuePriority: 7,
      optimisticData: {
        id,
        reason,
        blacklisted: true,
      },
    })
    return result.data
  } catch (error) {
    console.error('Error toggling guest blacklist:', error)
    throw error
  }
}

/** Fetch guests with optional filters */
export const getGuests = async (params: any = {}): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', '/guests', {
      resourceType: 'guest',
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching guests:', error)
    throw error
  }
}

/** Get Activity log */
export const getGuestsActivityLogs = async (hotelId: number, guestId: number, params: any = {}): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/activity-log/${hotelId}/guests/${guestId}/activity-logs`, {
      resourceType: 'guest',
      resourceId: guestId,
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching guest activity logs:', error)
    throw error
  }
}
