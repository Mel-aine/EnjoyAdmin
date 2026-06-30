/**
 * Department API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Create department
 */
export const createDepartment = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', '/department', {
      data,
      resourceType: 'department',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error creating department:', error)
    throw error
  }
}

/**
 * Get departments
 */
export const getDepartment = async (hotelId: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `/department`, {
      resourceType: 'department',
      params: { hotelId },
    })
    return result.data
  } catch (error) {
    console.error('Error fetching departments:', error)
    throw error
  }
}

/**
 * Update department
 */
export const updateDpt = async (id: number, data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `/department/${id}`, {
      data,
      resourceType: 'department',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating department:', error)
    throw error
  }
}

/**
 * Delete department
 */
export const deleteDpt = async (id: number): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('DELETE', `/department/${id}`, {
      resourceType: 'department',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error deleting department:', error)
    throw error
  }
}
