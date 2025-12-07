import apiClient from './apiClient'
import { useAuthStore } from '@/composables/user'
import type { AxiosRequestConfig } from 'axios'

const axios = apiClient

const getHeaders = (): AxiosRequestConfig => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token ?? ''}`,
    },
    withCredentials: false,
  }
}

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
  const { data } = await axios.get('/notifications/me', getHeaders())
  // return data?.notifications ?? []
   const rawNotifications = data?.notifications ?? []

  return rawNotifications.map((raw: any) => ({
    id: raw.id,
    title: raw.subject,
    body: raw.content,
    isRead: !!raw.isRead,
    createdAt: raw.createdAt,

    template: raw.template ? {
      id: raw.template.id,
      name: raw.template.code,
      title: raw.subject
    } : undefined,

    hotel: raw.hotel ? {
      id: raw.hotel.id,
      name: raw.hotel.hotelName
    } : undefined,

    recipientUser: raw.recipientUser ? {
      id: raw.recipientUser.id,
      fullName: raw.recipientUser.fullName,
      avatarUrl: raw.recipientUser.avatarUrl
    } : undefined,

    relatedEntityType: raw.relatedEntityType,
    relatedEntityId: raw.relatedEntityId,
  }))
}

export async function markNotificationRead(id: number): Promise<void> {
  await axios.post(`/notifications/${id}/read`, undefined, getHeaders())
}
