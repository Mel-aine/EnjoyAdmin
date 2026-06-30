/**
 * Notification API Service — Offline-Aware
 *
 * Utilise offlineAwareApiCall pour fonctionner en mode hors ligne.
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'

export type NotificationItem = {
  id: number
  title?: string
  body?: string
  isRead?: boolean
  createdAt?: string
  template?: { id: number; name?: string; title?: string }
  hotel?: { id: number; name?: string }
  recipientUser?: { id: number; fullName?: string; avatarUrl?: string }
  relatedEntityType?: string
  relatedEntityId?: number
}

export async function fetchMyNotifications(): Promise<NotificationItem[]> {
  try {
    const result = await offlineAwareApiCall('GET', '/notifications/me', {
      resourceType: 'notification',
    })

    const rawNotifications = result.data?.notifications ?? result.data ?? []

    return rawNotifications.map((raw: any) => ({
      id: raw.id,
      title: raw.subject,
      body: raw.content,
      isRead: !!raw.isRead,
      createdAt: raw.createdAt,
      template: raw.template ? {
        id: raw.template.id,
        name: raw.template.code,
        title: raw.subject,
      } : undefined,
      hotel: raw.hotel ? {
        id: raw.hotel.id,
        name: raw.hotel.hotelName,
      } : undefined,
      recipientUser: raw.recipientUser ? {
        id: raw.recipientUser.id,
        fullName: raw.recipientUser.fullName,
        avatarUrl: raw.recipientUser.avatarUrl,
      } : undefined,
      relatedEntityType: raw.relatedEntityType,
      relatedEntityId: raw.relatedEntityId,
    }))
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

export async function markNotificationRead(id: number): Promise<void> {
  try {
    await offlineAwareApiCall('POST', `/notifications/${id}/read`, {
      resourceType: 'notification',
      resourceId: id,
      queuePriority: 5,
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}
