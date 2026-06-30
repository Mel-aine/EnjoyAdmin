/**
 * User API Service — Offline-Aware
 *
 * Les fonctions CRUD utilisent offlineAwareApiCall.
 * signOut() conserve sa logique directe (auth/déconnexion).
 * L'authentification est gérée automatiquement par les intercepteurs d'apiClient.
 */
import { offlineAwareApiCall } from './offline/apiProxy.js'
import axios from './apiClient'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '@/composables/serviceStore'
import { useStatusColor } from '@/composables/statusColorStore'
import { useLanguageStore } from '@/lang/language'
import { useBookingStore } from '@/composables/booking'
import { useCurrencyStore } from '@/composables/currencyStore'
import router from '@/router'
import { nextTick } from 'vue'
import { logout } from '@/services/api'
import { isCheckoutOverlay, isLoading } from '@/composables/spinner'
import type { FitlterItem } from '@/utils/models'

const API_URL = `${import.meta.env.VITE_API_URL as string}`

/**
 * Create User Assignment
 */
export const createUser = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', `${API_URL}/assign-user`, {
      data,
      resourceType: 'user',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

/**
 * Get roles
 */
export const getRoles = async (hotelId: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `${API_URL}/hotel/${hotelId}/roles`, {
      resourceType: 'user',
    })
    return result.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

/**
 * Get user by ID
 */
export const getUserById = async (id: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('GET', `${API_URL}/users/${id}`, {
      resourceType: 'user',
      resourceId: id,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

/**
 * Get employees for service
 */
export const getEmployeesForService = async (
  hotelId: number | null,
  filter?: FitlterItem,
): Promise<any> => {
  const params: Record<string, any> = {}
  if (filter?.department) params.departmentId = filter.department
  if (filter?.roleId) params.roleId = filter.roleId
  if (filter?.searchText) params.search = filter.searchText

  try {
    const result = await offlineAwareApiCall('GET', `${API_URL}/hotel/${hotelId}/employees`, {
      resourceType: 'user',
      params,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

/**
 * Update User
 */
export const updateUser = async (id: any, data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `${API_URL}/assign-user/${id}`, {
      data,
      resourceType: 'user',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

/**
 * Delete User
 */
export const deleteUser = async (id: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('DELETE', `${API_URL}/assign-user/${id}`, {
      resourceType: 'user',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

/**
 * Get employee details
 */
export const getEmployeesDetails = async (id: number | null): Promise<any> => {
  try {
    const url = id !== null ? `${API_URL}/users/${id}/details` : `${API_URL}/users/details`
    const result = await offlineAwareApiCall('GET', url, {
      resourceType: 'user',
      resourceId: id ?? undefined,
    })
    return result.data
  } catch (error) {
    console.error('Error fetching employee details:', error)
    throw error
  }
}

/**
 * Create roles
 */
export const createRoles = async (data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('POST', `${API_URL}/roles`, {
      data,
      resourceType: 'user',
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error creating roles:', error)
    throw error
  }
}

/**
 * Update roles
 */
export const updateRoles = async (id: any, data: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('PUT', `${API_URL}/roles/${id}`, {
      data,
      resourceType: 'user',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error updating roles:', error)
    throw error
  }
}

/**
 * Delete roles
 */
export const deleteRoles = async (id: any): Promise<any> => {
  try {
    const result = await offlineAwareApiCall('DELETE', `${API_URL}/roles/${id}`, {
      resourceType: 'user',
      resourceId: id,
      queuePriority: 7,
    })
    return result.data
  } catch (error) {
    console.error('Error deleting roles:', error)
    throw error
  }
}

/**
 * Centralized Sign Out logic
 * Conserve la logique directe (auth/déconnexion)
 */
export const signOut = async (): Promise<void> => {
  try {
    isCheckoutOverlay.value = true
    await nextTick()

    try {
      await logout()
    } catch (error) {
      console.warn('⚠️ Logout API a échoué, mais déconnexion locale effectuée')
    }

    const authStore = useAuthStore()
    const serviceStore = useServiceStore()
    const statusColor = useStatusColor()
    const languageStore = useLanguageStore()
    const bookingStore = useBookingStore()
    const currencyStore = useCurrencyStore()

    authStore.forceLogout()
    authStore.clearPermissionsReports()
    serviceStore.clearServiceId()
    serviceStore.clearCurrentService()
    serviceStore.clearServiceCategory()
    serviceStore.clearPermissions()
    serviceStore.clearUserService()
    statusColor.clearStatusColors()
    serviceStore.clearCalendarState()

    languageStore.$reset()
    bookingStore.$reset()
    currencyStore.$reset()

    await router.push('/')
  } catch (error) {
    console.error('💥 Erreur critique lors du logout:', error)
    await router.push('/')
  } finally {
    isCheckoutOverlay.value = false
  }
}
