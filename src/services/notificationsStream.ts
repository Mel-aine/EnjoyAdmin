import { type NotificationItem } from './notificationsApi'
import { useAuthStore } from '@/composables/user'

const API_URL = import.meta.env.VITE_API_URL as string

export type Unsubscribe = () => void

// export function subscribeNotifications(
//   onNotification: (item: NotificationItem) => void,
//   onError?: (err: any) => void,
// ): Unsubscribe {
//   const authStore = useAuthStore()
//   const token = authStore?.token ?? ''

//   // Note: EventSource cannot send custom headers. We append the token
//   // directly in the URL query to satisfy backend auth requirements.
//   // Backend should accept `access_token` via query string.
//   const params = new URLSearchParams()
//   if (token) params.set('token', token)

//   const url = `${API_URL}/notifications/stream${params.toString() ? `?${params.toString()}` : ''}`
//   const es = new EventSource(url, { withCredentials: true })

//   const handleNotification = (e: MessageEvent) => {
//     try {
//       const raw = JSON.parse(e.data)
//       const item: NotificationItem = {
//         id: raw.id,
//         title: raw.subject,
//         body: raw.content,
//         isRead: !!raw.isRead,
//         createdAt: raw.createdAt,
//         template: raw.template ? { id: raw.template.id, name: raw.template.code } : undefined,
//         hotel: raw.hotel ? { id: raw.hotel.id, name: raw.hotel.name } : undefined,
//         recipientUser: raw.recipientUser
//           ? { id: raw.recipientUser.id, fullName: raw.recipientUser.name }
//           : undefined,
//       }
//       onNotification(item)
//     } catch (err) {
//       onError?.(err)
//     }
//   }

//   es.addEventListener('notification', handleNotification)
//   es.addEventListener('ping', () => {})
//   es.onerror = (err) => onError?.(err)

//   return () => es.close()
// }
export function subscribeNotifications(
  onNotification: (item: NotificationItem) => void,
  onError?: (err: any) => void,
): Unsubscribe {
  const authStore = useAuthStore()
  const token = authStore?.token ?? ''

  const params = new URLSearchParams()
  if (token) params.set('token', token)

  const url = `${API_URL}/notifications/stream${params.toString() ? `?${params.toString()}` : ''}`
  const es = new EventSource(url, { withCredentials: true })

  const handleNotification = (e: MessageEvent) => {
    try {
      const raw = JSON.parse(e.data)
      const item: NotificationItem = {
        id: raw.id,
        title: raw.subject || raw.title, // Ajout de fallback
        body: raw.content || raw.body,
        isRead: !!raw.isRead,
        createdAt: raw.createdAt,

        // Template avec title ET name
        template: raw.template ? {
          id: raw.template.id,
          name: raw.template.code || raw.template.name,
          title: raw.template.title // AJOUT DU TITLE
        } : undefined,

        hotel: raw.hotel ? {
          id: raw.hotel.id,
          name: raw.hotel.hotelName || raw.hotel.name
        } : undefined,

        // RecipientUser avec avatarUrl
        recipientUser: raw.recipientUser ? {
          id: raw.recipientUser.id,
          fullName: raw.recipientUser.fullName || raw.recipientUser.name,
          avatarUrl: raw.recipientUser.avatarUrl // AJOUT DE L'AVATAR
        } : undefined,

        // AJOUT DES CHAMPS MANQUANTS
        relatedEntityType: raw.relatedEntityType || raw.entityType,
        relatedEntityId: raw.relatedEntityId || raw.entityId,
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
