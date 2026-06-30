/**
 * Night Audit API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne
 * (cache pour les GET, file d'attente pour les écritures).
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Calculate and store night audit data
 */
export const createNightAudit = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/night-audit', {
      data,
      resourceType: 'night_audit',
      queuePriority: 10,
    })
    return result.data
  } catch (error) {
    console.error('Error creating night audit:', error)
    throw error
  }
}

/**
 * Get night audit details
 */
export const getNightAuditDetails = async (hotelId: number, auditDate: string): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/night-audit/${hotelId}/${auditDate}`, {
      resourceType: 'night_audit',
      resourceId: `${hotelId}-${auditDate}`,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching night audit details:', error)
    throw error
  }
}

/**
 * Get night audit list
 */
export const getNightAuditList = async (hotelId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/night-audit/${hotelId}`, {
      resourceType: 'night_audit',
    })
    return result.data
  } catch (error) {
    console.error('Error fetching night audit list:', error)
    throw error
  }
}

/**
 * Get night audit summary
 */
export const getNightAuditSummary = async (hotelId: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/night-audit/${hotelId}/summary`, {
      resourceType: 'night_audit',
    })
    return result.data
  } catch (error) {
    console.error('Error fetching night audit summary:', error)
    throw error
  }
}

/**
 * Get night audit room status
 */
export const getNightAuditRoomStatus = async (hotelId: number, auditDate: string): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/night-audit/${hotelId}/${auditDate}/room-status`, {
      resourceType: 'night_audit',
      resourceId: `${hotelId}-${auditDate}`,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching night audit room status:', error)
    throw error
  }
}

/**
 * Get night audit unsettled folios
 */
export const getNightAuditUnsettledFolios = async (hotelId: number, auditDate: string): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/night-audit/${hotelId}/${auditDate}/unsettled-folios`, {
      resourceType: 'folio',
      resourceId: `${hotelId}-${auditDate}`,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching unsettled folios:', error)
    throw error
  }
}

/**
 * Get night audit nightly charges
 */
export const getNightAuditNightlyCharges = async (hotelId: number, auditDate: string): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/night-audit/${hotelId}/${auditDate}/nightly-charges`, {
      resourceType: 'folio_transaction',
      resourceId: `${hotelId}-${auditDate}`,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching nightly charges:', error)
    throw error
  }
}

/**
 * Get night audit pending reservations
 */
export const getNightAuditPendingReservations = async (hotelId: number, auditDate: string): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/night-audit/${hotelId}/${auditDate}/pending-reservations`, {
      resourceType: 'reservation',
      resourceId: `${hotelId}-${auditDate}`,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching pending reservations:', error)
    throw error
  }
}

/**
 * Post nightly charges
 */
export const postNightlyCharges = async (hotelId: number, auditDate: string, data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', `/night-audit/${hotelId}/${auditDate}/nightly-charges`, {
      data,
      resourceType: 'folio_transaction',
      resourceId: `${hotelId}-${auditDate}`,
      queuePriority: 10,
    })
    return result.data
  } catch (error) {
    console.error('Error posting nightly charges:', error)
    throw error
  }
}
