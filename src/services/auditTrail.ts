import apiClient from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'

// Types
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

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}


// Error handling
const handleApiError = (error: any) => {
  console.error('API Error:', error)
  if (error.response) {
    console.error('Response data:', error.response.data)
    console.error('Response status:', error.response.status)
  }
  throw error
}

// Get audit trail entries
export const getAuditTrail = async (params: AuditTrailQueryParams): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(
      '/audit-trail',
      {
        ...getHeaders(),
        params,
      }
    )
    console.log('response',response)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Export audit trail
export const exportAuditTrail = async (params: AuditTrailQueryParams): Promise<Blob | undefined> => {
  try {
    const response: AxiosResponse<Blob> = await apiClient.get(
      '/audit-trail/export',
      {
        ...getHeaders(),
        params,
        responseType: 'blob',
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Get audit trail for a specific entity
export const getEntityAuditTrail = async (entityType: string, entityId: number, hotelId: number): Promise<AuditTrailEntry[] | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<AuditTrailEntry[]>> = await apiClient.get(
      `/audit-trail/${entityType}/${entityId}`,
      {
        ...getHeaders(),
        params: { hotelId },
      }
    )
    return response.data.data
  } catch (error) {
    handleApiError(error)
  }
}
