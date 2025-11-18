/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/composables/user'
import type {
  ReservationType,
  userDataType,
} from '@/types/option'
import type {
  AmenityCategoryPayload,
  AmenityProductPayload,
  CreateAmenityBookingPayload,
  FitlterItem,
  UpdateAmenityBookingPayload,
} from '@/utils/models'
import type { IPayroll } from '@/types/type'

const API_URL = import.meta.env.VITE_API_URL as string

// --- Token Refresh  ---
let refreshIntervalId: number | null = null
const REFRESH_ADVANCE_MS = 2 * 60 * 1000 // Refresh 2 minutes avant expiration
const CHECK_INTERVAL_MS = 2 * 60 * 1000

const getHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    withCredentials: true,
  }
}
const getRefreshHeaders = () => {
  const authStore = useAuthStore()
  return {
    headers: {
      Authorization: `Bearer ${authStore.refreshToken ?? ''}`,
    },
    withCredentials: true,
  }
}
const getRefreshRequestOptions = () => {
  return {
    withCredentials: true,
  }
}
// --- Types ---
export interface Option {
  id?: number
  name: string
  description?: string

  // ajoute d'autres champs selon ton modèle
}

export interface CreateRoomData {
  service_id: number
  product_name: string
  product_type: string
  description: string
  // availability:boolean
  status: string
  price: string
}

export interface RoomOptionData {
  service_product_id: number
  option_id: number
  option_type: string
  value: string
}

// --- Services API get --- //

//get lees actions
export const getStocksHistories = (id?: number | null): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/activity-logs/user/${id}`, getHeaders())
}


export const getReservationDetailsById = (reservationId: number): Promise<AxiosResponse<any>> => {
  console.log('-->Header:', getHeaders())
  return axios.get(`${API_URL}/reservations/${reservationId}/details`, getHeaders())
}
export const getReservationHistoryById = (reservationId: number): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/activity-logs/by-entity?entityType=Reservation&entityId=${reservationId}`,
    getHeaders(),
  )
}


export const finAvailableHome = (
  serviceId: number,
  roomTypeId: number,
  arrivalDate: string,
  departureDate: string,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/service-products/available?serviceId=${serviceId}&roomTypeId=${roomTypeId}&arrivalDate=${arrivalDate}&departureDate=${departureDate}`,
    getHeaders(),
  )
}
export const getPermission = (): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/permission`, getHeaders())
}

export const dashboard = (serviceId: any): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/staff_management/dashboard/${serviceId}`, getHeaders())
}



// Support

export const createSupportTicket = (
  payload: any,
  attachment?: File,
): Promise<AxiosResponse<any>> => {
  const form = new FormData()

  form.append('title', payload.title)
  form.append('category', payload.category)
  form.append('module', payload.module)
  form.append('impact', payload.impact)
  form.append('severity', payload.severity)
  form.append('description', JSON.stringify(payload.description))
  form.append('context', JSON.stringify(payload.context))

  if (payload.callbackPhone) {
    form.append('callbackPhone', payload.callbackPhone)
  }

  if (payload.status) {
    form.append('status', payload.status)
  }

  // Ajouter le fichier
  if (attachment) {
    form.append('attachment', attachment)
  }

  return axios.post(`${API_URL}/support/tickets`, form, getHeaders())
}


// services/authService.ts

let isRefreshing = false

// Arrêter le refresh automatique
export const stopAuthAutoRefresh = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
  }
}

// Fonction centralisée pour rafraîchir le token
const performTokenRefresh = async (): Promise<boolean> => {
  if (isRefreshing) {
    console.log('🔄 Refresh déjà en cours...')
    return false
  }

  isRefreshing = true
  const authStore = useAuthStore()

  try {
    const resp = await axios.post(`${API_URL}/refresh-token`, {}, getRefreshRequestOptions())

    const newToken = resp.data?.data?.access_token?.token || resp.data?.data?.access_token
    const newTokenData = resp.data?.data?.access_token

    if (newToken) {
      authStore.updateToken(newToken, newTokenData)
       authStore.setReauthRequired(false)
    } else {
      console.warn('⚠️ Pas de nouveau token dans la réponse')
    }

    // Mettre à jour le refresh token si présent
    const newRefresh = resp.data?.data?.refresh_token?.token || resp.data?.data?.refresh_token
    const newRefreshData = resp.data?.data?.refresh_token

    if (newRefresh) {
      authStore.updateRefreshToken(newRefresh, newRefreshData)
    }

    authStore.setReauthRequired(false)
    return true

  } catch (err: any) {
    console.error('❌ Erreur lors du refresh automatique:', {
      status: err?.response?.status,
      message: err?.message,
      data: err?.response?.data
    })

    // Si erreur d'authentification, demander réauthentification
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      console.warn('🔒 Réauthentification requise - arrêt du refresh automatique')
      authStore.setReauthRequired(true)
      stopAuthAutoRefresh()
    }
    return false
  } finally {
    isRefreshing = false
  }
}

// // Fonction pour calculer le temps avant expiration
const getTokenExpiryTime = (tokenData: any): number | null => {
  try {
    const expiresAt = tokenData?.expiresAt
    if (!expiresAt) return null

    const expiryDate = new Date(expiresAt)
    return expiryDate.getTime()
  } catch {
    return null
  }
}





// Fonction pour vérifier si le token va expirer bientôt
const shouldRefreshToken = (expiryTime: number | null): boolean => {
  if (!expiryTime) {
    return true
  }

  const now = Date.now()
  const timeUntilExpiry = expiryTime - now

  // Rafraîchir 2 minutes avant expiration
  const shouldRefresh = timeUntilExpiry < REFRESH_ADVANCE_MS

  return shouldRefresh
}

// Démarrer le refresh automatique
export const startAuthAutoRefresh = () => {
  stopAuthAutoRefresh()

  refreshIntervalId = setInterval(async () => {
    // Ne pas refresh si déjà en cours ou si réauth requise
    if (isRefreshing || useAuthStore().reauthRequired) {
      return
    }

    const authStore = useAuthStore()

    // Vérifier si l'utilisateur est connecté
    if (!authStore.isFullyAuthenticated) {
      stopAuthAutoRefresh()
      return
    }

    const tokenExpiry = getTokenExpiryTime(authStore.tokenData)

    if (shouldRefreshToken(tokenExpiry)) {
      await performTokenRefresh()
    }

  }, CHECK_INTERVAL_MS) as unknown as number
}


// Intercepteur pour rafraîchir automatiquement sur 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    const isAuthenticated = authStore.token && authStore.token !== 'null'

    if (error.response?.status === 401 && !originalRequest._retry && isAuthenticated) {
      originalRequest._retry = true

      try {
        const refreshSuccess = await performTokenRefresh()

        if (refreshSuccess) {
          // Rejouer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${authStore.token}`
          return axios(originalRequest)
        } else {
          authStore.setReauthRequired(true)
        }
      } catch (refreshError) {
        console.error('❌ Échec du refresh dans l\'intercepteur')
        authStore.setReauthRequired(true)
      }
    }

    return Promise.reject(error)
  }
)

// Fonction de login mise à jour
export function auth(credentials: { email: string; password: string; keepLoggedIn?: boolean }) {
  return axios
    .post(`${API_URL}/authLogin`, credentials, { withCredentials: true })
    .then((resp) => {
      const authStore = useAuthStore()

      // Stocker le token avec ses métadonnées
      const token = resp.data.data?.access_token?.token
      const tokenData = resp.data.data?.access_token
      if (token && tokenData) {
        authStore.updateToken(token, tokenData)
      }

      // Stocker le refresh token avec ses métadonnées
      const refresh = resp.data?.data?.refresh_token?.token
      const refreshData = resp.data?.data?.refresh_token
      if (refresh && refreshData) {
        authStore.updateRefreshToken(refresh, refreshData)
      }

      // Démarrer le refresh automatique
      startAuthAutoRefresh()

      return resp
    })
}

export const refreshToken = async (): Promise<AxiosResponse<any>> => {
  const authStore = useAuthStore()
  const currentRefresh = authStore.refreshToken

  const payload = currentRefresh ? { refresh_token: currentRefresh } : {}

  const resp = await axios.post(`${API_URL}/refresh-token`, payload, getRefreshHeaders())

  const newToken = resp.data?.data?.access_token?.token
  const newTokenData = resp.data?.data?.access_token
  if (newToken && newTokenData) {
    authStore.updateToken(newToken, newTokenData)
  }

  const newRefresh = resp.data?.data?.refresh_token?.token || null
  const newRefreshData = resp.data?.data?.refresh_token
  if (newRefresh && newRefreshData) {
    authStore.updateRefreshToken(newRefresh, newRefreshData)
  }

  return resp
}


export function initSpace(credentials: { userId: number }) {
  return axios.post(`${API_URL}/initSpace`, credentials, getHeaders())
}

export function logout() {
  const authStore = useAuthStore()
  const currentToken = authStore.token


  // Arrêter le refresh automatique IMMÉDIATEMENT
  stopAuthAutoRefresh()

  // Si pas de token, déconnexion locale uniquement
  if (!currentToken) {
    console.log('🔐 Aucun token - déconnexion locale')
    authStore.logout()
    return Promise.resolve({ data: { message: 'Local logout only' } })
  }

  return axios.post(
    `${API_URL}/authLogout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      withCredentials: true,
    },
  ).then(response => {
    return response
  }).catch(error => {
    console.warn('⚠️ Logout API échoué (continuer avec déconnexion locale):', error.message)
    throw error // Relancer l'erreur pour la gestion dans userApi
  }).finally(() => {
    // TOUJOURS vider le store
    authStore.logout()
  })
}

export function validateEmail(email: string) {
  return axios.post(`${API_URL}/validateEmail`, { email })
}

export function validatePassword(email: string, password: string) {
  return axios.post(`${API_URL}/validatePassword`, { email, password })
}

// Request a password reset link via email
export function requestPasswordReset(payload: { email: string; hotelId: number | string }) {
  return axios.post(`${API_URL}/auth/forgot-password`, payload)
}


// --- Services API put --- //



export function user_update(
  userId: number | null,
  data: { password: string; password_confirmation: string },
  token: string | null,
) {
  return axios.put(`${API_URL}/auth/${userId}`, data, {
    ...getHeaders(),
  })
}

export const getCancellationSummary = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations/${id}/cancellation-summary`, getHeaders())
}
export const cancelReservation = (id: number, data: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservations/${id}/cancel`, data, getHeaders())
}

//----- SERVICE API Delete ----//


/// This is to manae cancel

export const deleteCancellationPolicy = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/cancellation-policies/${id}`, getHeaders())
}
export const getCancellationPolicyById = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/cancellation-policies/${id}`, getHeaders())
}
export const getCancellationPolicyByHotelId = (id: number | null): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/cancellation-policies/hotel/${id}`, getHeaders())
}

export const insertCancellationPolicy = (datas: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/cancellation-policies `, datas, getHeaders())
}
export const updateCancellationPolicy = (id: number, datas: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/cancellation-policies/${id}`, datas, getHeaders())
}

// --- API Functions ---

/**
 * Fetches all amenity categories for a specific service.
 * @param serviceId The ID of the service.
 * @returns A promise that resolves to an array of amenity categories.
 */
export const getAmenitiesByServiceId = (
  serviceId: number | string,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities-categories/service/${serviceId}`, getHeaders())
}

/**
 * Fetches a single amenity category by its ID.
 * @param id The ID of the amenity category.
 * @returns A promise that resolves to the amenity category.
 */
export const getAmenityCategoryById = (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenities-categories/${id}`, getHeaders())
}

/**
 * Creates a new amenity category.
 * @param data The data for the new amenity category.
 * @returns A promise that resolves to the newly created amenity category.
 */
export const createAmenityCategory = async (
  data: AmenityCategoryPayload,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenities-categories`, data, getHeaders())
}

/**
 * Updates an existing amenity category.
 * @param id The ID of the amenity category to update.
 * @param data The new data for the amenity category.
 * @returns A promise that resolves to the updated amenity category.
 */
export const updateAmenityCategory = async (
  id: number | string,
  data: AmenityCategoryPayload,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenities-categories/${id}`, data, getHeaders())
}

/**
 * Deletes an amenity category.
 * @param id The ID of the amenity category to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteAmenityCategory = async (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenities-categories/${id}`, getHeaders())
}

/*

 * Fetches all amenity categories for a specific service.
 * @param serviceId The ID of the service.
 * @returns A promise that resolves to an array of amenity categories.
 */
export const getAmenitiesProductByServiceId = (
  serviceId: number | string,
  categoryId: number | string,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/amenity-products/service/${serviceId}/category/${categoryId}`,
    getHeaders(),
  )
}

/**
 * Fetches a single amenity product by its ID.
 * @param id The ID of the amenity product.
 * @returns A promise that resolves to the amenity product.
 */
export const getAmenityProductById = (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenity-products/${id}`, getHeaders())
}

/**
 * Creates a new amenity product.
 * @param data The data for the new amenity product.
 * @returns A promise that resolves to the newly created amenity product.
 */
export const createAmenityProduct = async (
  data: AmenityProductPayload,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenity-products`, data, getHeaders())
}

/**
 * Updates an existing amenity product.
 * @param id The ID of the amenity product to update.
 * @param data The new data for the amenity product.
 * @returns A promise that resolves to the updated amenity product.
 */
export const updateAmenityProduct = async (
  id: number | string,
  data: AmenityProductPayload,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenity-products/${id}`, data, getHeaders())
}

/**
 * Deletes an amenity product.
 * @param id The ID of the amenity category to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteAmenityProduct = async (id: number | string): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenity-products/${id}`, getHeaders())
}

export const getAmenityBookingByReservationIdAndServiceId = (
  reservationId: number,
  serviceId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/reservations/${reservationId}/services/${serviceId}/amenity-bookings`,
    getHeaders(),
  )
}
export const getUnPaidAmenityBookingByReservationId = (
  reservationId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/reservations/${reservationId}/unpaid-amenities`, getHeaders())
}
export const amenitiesPaymentByReservationId = (
  reservationId: number,
  data: any,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/reservations/${reservationId}/pay-amenities`, data, getHeaders())
}

export const getByAmenityBookingByCategoryId = (
  categoryId: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenity-categories/${categoryId}/amenity-bookings`, getHeaders())
}

export const getAmenityBookingById = (id: number): Promise<AxiosResponse<any>> => {
  return axios.get(`${API_URL}/amenity-bookings/${id}`, getHeaders())
}

export const createAmenityBooking = (
  data: CreateAmenityBookingPayload,
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/amenity-bookings`, data, getHeaders())
}

export const updateAmenityBooking = (
  id: number,
  data: UpdateAmenityBookingPayload,
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/amenity-bookings/${id}`, data, getHeaders())
}

export const deleteAmenityBooking = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_URL}/amenity-bookings/${id}`, getHeaders())
}

/**
 * Fetches tasks from the API based on a set of filter criteria.
 * @param {int} [serviceId] -
 * @param {string} [start_date] - (format: 'YYYY-MM-DD').
 * @param {string} [end_date] - (format: 'YYYY-MM-DD').
 * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 */
export const getDailyOccupancyAndReservations = (
  serviceId: number,
  start_date: string,
  end_date: string,
): Promise<AxiosResponse<any>> => {
  return axios.get(
    `${API_URL}/dashboard/service/${serviceId}/daily-occupancy?start_date=${start_date}&end_date=${end_date}`,
    getHeaders(),
  )
}

export const getReservationInvoice = (
  reservationId: string,
): Promise<AxiosResponse<IPayroll[]>> => {
  return axios.get(`${API_URL}/reservations/${reservationId}/invoice`, getHeaders())
}

//create payment
export const createPayment = (paymentData: any): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_URL}/paymentConfirm`, paymentData, getHeaders())
}
//confirm Payment
export const confirmPayment = (id: number | null, Payload: any): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_URL}/payment/${id}/confirm`, Payload, getHeaders())
}
