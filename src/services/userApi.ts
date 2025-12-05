/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { isLoading } from '@/composables/spinner'
import type {

  FitlterItem

} from '@/utils/models'

const API_URL = `${import.meta.env.VITE_API_URL as string}`

// Function to get headers with current token
const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  }
}

/**
 * Create User Assignment
 */
export const createUser = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/assign-user`, data, getAuthHeaders())
}

/**
 * get roles
 */
export const getRoles = (hotelId: any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/hotel/${hotelId}/roles`, getAuthHeaders())
}

/**
 * get user by Id
 */
export const getUserById = (id: any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/users/${id}`, getAuthHeaders())
}

/**
 * get Users
 */
export const getEmployeesForService = (
  hotelId: number | null,
  filter?: FitlterItem,
): Promise<AxiosResponse<any>> => {
  let qs = ``
  if (filter?.department) {
    if (qs) qs += `&departmentId=${filter.department}`
    else qs += `?departmentId=${filter.department}`
  }
  if (filter?.roleId) {
    if (qs) qs += `&roleId=${filter.roleId}`
    else qs += `?roleId=${filter.roleId}`
  }
  if (filter?.searchText) {
    if (qs) qs += `&search=${filter.searchText}`
    else qs += `?search=${filter.searchText}`
  }
  return axios.get(`${API_URL}/hotel/${hotelId}/employees${qs}`, getAuthHeaders())
}

/**
 * Update User
 */
export const updateUser = (id: any, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/assign-user/${id}`, data, getAuthHeaders())
}

/**
 * delete User
 */
export const deleteUser = (id: any): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/assign-user/${id}`, getAuthHeaders())
}

/**
 *
 */
export const getEmployeesDetails = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/users/${id}/details`, getAuthHeaders())
}

/**
 * Roles Api
 */

//create roles
export const createRoles = (data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/roles`, data, getAuthHeaders())
}

//update roles
export const updateRoles = (id: any, data: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/roles/${id}`, data, getAuthHeaders())
}

//delete roles
export const deleteRoles = (id: any): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/roles/${id}`, getAuthHeaders())
}

/**
 * Centralized Sign Out logic
 * - Calls API logout
 * - Clears Pinia stores and cached state
 * - Removes tokens from localStorage/sessionStorage
 * - Redirects to login
 */
export const signOut = async (): Promise<void> => {
  try {
    // Show full-page overlay during logout
    isLoading.value = true
    await nextTick();

    try {
      await logout();
    } catch (error) {
      console.warn('⚠️ Logout API a échoué, mais déconnexion locale effectuée');
    }

    const authStore = useAuthStore();
    const serviceStore = useServiceStore();
    const statusColor = useStatusColor();
    const languageStore = useLanguageStore();
    const bookingStore = useBookingStore();
    const currencyStore = useCurrencyStore();


    authStore.forceLogout();
    authStore.clearPermissionsReports();
    serviceStore.clearServiceId();
    serviceStore.clearCurrentService();
    serviceStore.clearServiceCategory();
    serviceStore.clearPermissions();
    serviceStore.clearUserService();
    statusColor.clearStatusColors();

    languageStore.$reset();
    bookingStore.$reset();
    currencyStore.$reset();


    await router.push('/');
  } catch (error) {
    console.error('💥 Erreur critique lors du logout:', error);
    // Rediriger quand même vers login
    await router.push('/');
  } finally {
    // Ensure overlay is hidden after navigation completes
    isLoading.value = false
  }
}
