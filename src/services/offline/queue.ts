/**
 * OfflineQueue
 *
 * Manages a priority-based queue of write operations that need to be
 * synchronised with the backend when connectivity is restored.
 *
 * Priority levels:
 *   10 — Critical (check-in, checkout, payment)
 *    7 — High    (reservation create/update, room status change)
 *    5 — Normal  (guest update, notes)
 *    2 — Low     (preferences, analytics)
 */
import { v4 as uuidv4 } from 'uuid'
import {
  db,
  queueOperation,
  getPendingOperations,
  markOperationCompleted,
  markOperationFailed,
  getQueueStats,
  clearCompletedOperations,
  type SyncOperation,
} from './db.js'

export type { SyncOperation }

export interface QueueInput {
  operationType: 'create' | 'update' | 'delete'
  resourceType: string
  resourceId?: number | null
  payload: Record<string, any>
  priority?: number
  maxRetries?: number
}

export interface QueueResult {
  success: boolean
  operationId: string
  error?: string
}

const DEFAULT_MAX_RETRIES = 3

class OfflineQueue {
  private processing = false

  /**
   * Add an operation to the offline queue
   */
  async enqueue(input: QueueInput): Promise<string> {
    const operationId = uuidv4()

    await queueOperation({
      operationId,
      operationType: input.operationType,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      payload: input.payload,
      priority: input.priority ?? 5,
      maxRetries: input.maxRetries ?? DEFAULT_MAX_RETRIES,
      clientTimestamp: new Date().toISOString(),
    })

    return operationId
  }

  /**
   * Get all pending operations, ordered by priority
   */
  async getPending(): Promise<SyncOperation[]> {
    return getPendingOperations()
  }

  /**
   * Get queue statistics
   */
  async getStats() {
    return getQueueStats()
  }

  /**
   * Mark an operation as successfully synced
   */
  async markCompleted(operationId: string): Promise<void> {
    await markOperationCompleted(operationId)
  }

  /**
   * Mark an operation as failed
   */
  async markFailed(operationId: string, error: string): Promise<void> {
    await markOperationFailed(operationId, error)
  }

  /**
   * Process all pending operations by calling the provided handler
   * Operations are processed in priority order (highest first)
   */
  async processAll(
    handler: (op: SyncOperation) => Promise<boolean>
  ): Promise<{ succeeded: number; failed: number }> {
    if (this.processing) return { succeeded: 0, failed: 0 }
    this.processing = true

    try {
      const pending = await this.getPending()
      let succeeded = 0
      let failed = 0

      for (const op of pending) {
        try {
          const ok = await handler(op)
          if (ok) {
            await this.markCompleted(op.operationId)
            succeeded++
          } else {
            failed++
          }
        } catch (err: any) {
          await this.markFailed(op.operationId, err.message || 'Unknown error')
          failed++
        }
      }

      return { succeeded, failed }
    } finally {
      this.processing = false
    }
  }

  /**
   * Clear successfully completed operations from the queue
   */
  async cleanCompleted(): Promise<void> {
    await clearCompletedOperations()
  }

  /**
   * Get count of pending operations
   */
  async pendingCount(): Promise<number> {
    const stats = await this.getStats()
    return stats.pending + stats.processing
  }

  /**
   * Check if there are any pending operations
   */
  async hasPending(): Promise<boolean> {
    return (await this.pendingCount()) > 0
  }
}

export const offlineQueue = new OfflineQueue()
