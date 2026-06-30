/**
 * Audit Trail API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * exportAuditTrail conserve un appel axios direct (responseType: 'blob').
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'
import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'

// ── Types ──────────────────────────────────────────────────────────────

export interface AuditTrailEntry {
  id: number
  date: string
  time?: string
  user: string
  username?: string
  action: string
  entityType?: string
  entityId?: number
  description: string
  changes?: any
  ipAddress: string
  userAgent?: string
  createdAt: string
  hotelId: number
}

export interface AuditTrailQueryParams {
  hotelId: number
  entityIds?: number[]
  entityType?: string
  startDate?: string
  endDate?: string
  userId?: number
  action?: string
  page?: number
  perPage?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// ── Error handling ─────────────────────────────────────────────────────

const handleApiError = (error: any) => {
  console.error('API Error:', error)
  if (error.response) {
    console.error('Response data:', error.response.data)
    console.error('Response status:', error.response.status)
  }
  throw error
}

// ── Audit Trail Queries ────────────────────────────────────────────────

/** Get audit trail entries */
export const getAuditTrail = async (params: AuditTrailQueryParams): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', '/audit-trail', {
      resourceType: 'audit_trail',
      params,
    })
    console.log('response', result.data)
    return result.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Export audit trail (blob — conserve axios direct) */
export const exportAuditTrail = async (params: AuditTrailQueryParams): Promise<Blob | undefined> => {
  try {
    const response: AxiosResponse<Blob> = await apiClient.get(
      '/audit-trail/export',
      {
        params,
        responseType: 'blob',
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

/** Get audit trail for a specific entity */
export const getEntityAuditTrail = async (entityType: string, entityId: number, hotelId: number): Promise<AuditTrailEntry[] | undefined> => {
  try {
    const result = await offlineAwareApiCall('GET', `/audit-trail/${entityType}/${entityId}`, {
      resourceType: 'audit_trail',
      resourceId: entityId,
      params: { hotelId },
    })
    return result.data?.data ?? result.data
  } catch (error) {
    handleApiError(error)
  }
}
