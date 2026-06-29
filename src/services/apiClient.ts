import axios from 'axios'
import { useServiceStore } from '../composables/serviceStore'

const API_URL = import.meta.env.VITE_API_URL as string

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Inject X-Hotel-Code on every request originating from services
apiClient.interceptors.request.use((config) => {
  try {
    const serviceStore = useServiceStore()
    const hotelId = serviceStore?.serviceId
    if (hotelId) {
      config.headers = config.headers ?? {}
      ;(config.headers as any)['X-Hotel-Code'] = String(hotelId)
    }
  } catch (e) {
    // non-fatal: if store not available, skip header injection
  }
  return config
})

// Also inject X-Hotel-Code for direct axios calls (not using apiClient)
axios.interceptors.request.use((config) => {
  try {
    const serviceStore = useServiceStore()
    const hotelId = serviceStore?.serviceId
    if (hotelId) {
      config.headers = config.headers ?? {}
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
