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

export default apiClient
