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
    withCredentials: true,
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
  return data?.notifications ?? []
}

export async function markNotificationRead(id: number): Promise<void> {
  await axios.post(`/notifications/${id}/read`, undefined, getHeaders())
}
