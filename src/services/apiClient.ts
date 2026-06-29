import axios from 'axios'
import { useServiceStore } from '../composables/serviceStore'
import { useAuthStore } from '../composables/user'

const API_URL = import.meta.env.VITE_API_URL as string

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Inject auth token + X-Hotel-Code on every apiClient request
apiClient.interceptors.request.use((config) => {
  try {
    const authStore = useAuthStore()
    const serviceStore = useServiceStore()

    config.headers = config.headers ?? {}

    // Bearer token for authentication
    if (authStore.token) {
      ;(config.headers as any)['Authorization'] = `Bearer ${authStore.token}`
    }

    // Hotel context header
    const hotelId = serviceStore?.serviceId
    if (hotelId) {
      ;(config.headers as any)['X-Hotel-Code'] = String(hotelId)
    }
  } catch (e) {
    // non-fatal: if store not available, skip header injection
  }
  return config
})

// Inject auth token + X-Hotel-Code for direct axios calls (not using apiClient)
axios.interceptors.request.use((config) => {
  try {
    const authStore = useAuthStore()
    const serviceStore = useServiceStore()

    config.headers = config.headers ?? {}

    // Bearer token for authentication
    if (authStore.token) {
      ;(config.headers as any)['Authorization'] = `Bearer ${authStore.token}`
    }

    // Hotel context header
    const hotelId = serviceStore?.serviceId
    if (hotelId) {
      ;(config.headers as any)['X-Hotel-Code'] = String(hotelId)
    }
  } catch (e) {
    // non-fatal: if store not available, skip header injection
  }
  return config
})


// Offline response interceptor: catch network errors
import { useOfflineStore } from './offline/offlineStore.js'

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If network error (no response from server), update offline store
    if (!error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      try {
        const offlineStore = useOfflineStore()
        offlineStore.setOnline(false)
      } catch {
        // Store not available yet
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
