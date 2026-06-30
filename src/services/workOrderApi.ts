/**
 * Work Order API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

export interface WorkOrderFilters {
  search?: string
  status?: string
  priority?: string
  category?: string
  assigned_to?: number
  room_id?: number
  date_from?: string
  date_to?: string
  per_page?: number
  page?: number
}

/**
 * Create Work Order
 */
export const createWorkOrder = async (data: any): Promise<any> => {
  console.log('Creating work order with data:', data)
  try {
    const result = await offlineAwareApiCall('POST', '/work_orders', {
      data,
      resourceType: 'work_order',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error creating work order:', error)
    throw error
  }
}

/**
 * Get Work Orders by Hotel ID
 */
export const getWorkOrder = async (hotelId: any, params: any = {}): Promise<any> => {
  console.log('Fetching work orders for hotel ID:', hotelId)
  try {
    const result = await offlineAwareApiCall('GET', '/work_orders', {
      resourceType: 'work_order',
      params: { ...params, hotelId },
    })
    return result.data
  } catch (error) {
    console.error('Error fetching work orders:', error)
    throw error
  }
}

/**
 * Update work order
 */
export const updateWorkOrder = async (orderId: number, data: any): Promise<any> => {
  console.log('Updating work order:', orderId, 'with data:', data)
  try {
    const result = await offlineAwareApiCall('PUT', `/work_orders/${orderId}`, {
      data,
      resourceType: 'work_order',
      resourceId: orderId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating work order:', error)
    throw error
  }
}

/**
 * Delete work order
 */
export const deleteWorkOrder = async (orderId: number): Promise<any> => {
  console.log('Deleting work order:', orderId)
  try {
    const result = await offlineAwareApiCall('DELETE', `/work_orders/${orderId}`, {
      resourceType: 'work_order',
      resourceId: orderId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error deleting work order:', error)
    throw error
  }
}

/**
 * Get work orders with filters
 */
export const getWorkOrderWithFilters = async (
  hotelId: string,
  filters?: {
    start_date?: string
    end_date?: string
    room_id?: string
    status?: string
  }
): Promise<any> => {
  const params: Record<string, string> = {}
  if (filters?.start_date) params['start_date'] = filters.start_date
  if (filters?.end_date) params['end_date'] = filters.end_date
  if (filters?.room_id) params['room_id'] = filters.room_id
  if (filters?.status) params['status'] = filters.status

  console.log('Fetching work orders with filters:', hotelId, params)
  try {
    const result = await offlineAwareApiCall('GET', `/work_orders/${hotelId}`, {
      resourceType: 'work_order',
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching work orders with filters:', error)
    throw error
  }
}

/**
 * Update Status
 */
export const updateStatusWorkOrder = async (orderId: number, data: any): Promise<any> => {
  console.log('Updating status for work order:', orderId)
  try {
    const result = await offlineAwareApiCall('PUT', `/work_orders/${orderId}/status`, {
      data,
      resourceType: 'work_order',
      resourceId: orderId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating work order status:', error)
    throw error
  }
}
