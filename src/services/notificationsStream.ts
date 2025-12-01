import { type NotificationItem } from './notificationsApi'
import { useAuthStore } from '@/composables/user'

const API_URL = import.meta.env.VITE_API_URL as string

export type Unsubscribe = () => void

export function subscribeNotifications(
  onNotification: (item: NotificationItem) => void,
  onError?: (err: any) => void,
): Unsubscribe {
  const authStore = useAuthStore()
  const token = authStore?.token ?? ''

  // Note: EventSource cannot send custom headers. We append the token
  // directly in the URL query to satisfy backend auth requirements.
  // Backend should accept `access_token` via query string.
  const params = new URLSearchParams()
  if (token) params.set('token', token)

  const url = `${API_URL}/notifications/stream${params.toString() ? `?${params.toString()}` : ''}`
  const es = new EventSource(url, { withCredentials: true })

  const handleNotification = (e: MessageEvent) => {
    try {
      const raw = JSON.parse(e.data)
      const item: NotificationItem = {
        id: raw.id,
        title: raw.subject,
        body: raw.content,
        isRead: !!raw.isRead,
        createdAt: raw.createdAt,
        template: raw.template ? { id: raw.template.id, name: raw.template.code } : undefined,
        hotel: raw.hotel ? { id: raw.hotel.id, name: raw.hotel.name } : undefined,
        recipientUser: raw.recipientUser
          ? { id: raw.recipientUser.id, fullName: raw.recipientUser.name }
          : undefined,
      }
      onNotification(item)
    } catch (err) {
      onError?.(err)
    }
  }

  es.addEventListener('notification', handleNotification)
  es.addEventListener('ping', () => {})
  es.onerror = (err) => onError?.(err)

  return () => es.close()
}
