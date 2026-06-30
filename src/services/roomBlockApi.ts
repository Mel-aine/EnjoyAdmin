/**
 * Room Block API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

/**
 * Create Room Block
 */
export const createRoomBlock = async (data: any): Promise<any> => {
  console.log('Creating room block with data:', data)
  try {
    const result = await offlineAwareApiCall('POST', '/room-blocks', {
      data,
      resourceType: 'room_block',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error creating room block:', error)
    throw error
  }
}

/**
 * Get Room Blocks by Hotel ID
 */
export const getRoomBlocks = async (hotelId: any, params: any = {}): Promise<any> => {
  console.log('Fetching room blocks for hotel ID:', hotelId)
  try {
    const result = await offlineAwareApiCall('GET', `/room-blocks/${hotelId}`, {
      resourceType: 'room_block',
      resourceId: hotelId,
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching room blocks:', error)
    throw error
  }
}

/**
 * Update Room Block
 */
export const updateRoomBlock = async (blockId: string, data: any): Promise<any> => {
  console.log('Updating room block:', blockId, 'with data:', data)
  try {
    const result = await offlineAwareApiCall('PUT', `/room-blocks/${blockId}`, {
      data,
      resourceType: 'room_block',
      resourceId: blockId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating room block:', error)
    throw error
  }
}

/**
 * Unlock Room Block
 */
export const unLockRoomBlock = async (blockId: string, data: any): Promise<any> => {
  console.log('Unlocking room block:', blockId, 'with data:', data)
  try {
    const result = await offlineAwareApiCall('POST', `/room-blocks/${blockId}/unblock-range`, {
      data,
      resourceType: 'room_block',
      resourceId: blockId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error unlocking room block:', error)
    throw error
  }
}

/**
 * Delete Room Block
 */
export const deleteBlock = async (blockId: string): Promise<any> => {
  console.log('Deleting room block:', blockId)
  try {
    const result = await offlineAwareApiCall('DELETE', `/room-blocks/${blockId}`, {
      resourceType: 'room_block',
      resourceId: blockId,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error deleting room block:', error)
    throw error
  }
}

/**
 * Get Room Block by ID
 */
export const getRoomBlockById = async (blockId: string): Promise<any> => {
  console.log('Fetching room block by ID:', blockId)
  try {
    const result = await offlineAwareApiCall('GET', `/room-blocks/single/${blockId}`, {
      resourceType: 'room_block',
      resourceId: blockId,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching room block:', error)
    throw error
  }
}

/**
 * Get Room Blocks with filters
 */
export const getRoomBlocksWithFilters = async (
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

  console.log('Fetching room blocks with filters:', hotelId, params)
  try {
    const result = await offlineAwareApiCall('GET', `/room-blocks/${hotelId}`, {
      resourceType: 'room_block',
      resourceId: hotelId,
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching room blocks with filters:', error)
    throw error
  }
}

/**
 * Bulk delete Room Blocks
 */
export const bulkDeleteBlocks = async (blockIds: string[]): Promise<any> => {
  console.log('Bulk deleting room blocks:', blockIds)
  try {
    const result = await offlineAwareApiCall('DELETE', '/room-blocks/bulk', {
      data: { blockIds },
      resourceType: 'room_block',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error bulk deleting room blocks:', error)
    throw error
  }
}
