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
import { cacheApiResponse, getCachedResponse } from './offline/db.js'

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

// ── Global axios response interceptor: cache + offline fallback ────────
// Intercepte tous les appels axios directs (depuis api.ts) pour :
//   1. Mettre en cache les réponses GET quand on est en ligne
//   2. Servir depuis le cache quand on est hors ligne (fallback transparent)
// Les appels via apiClient (offlineAwareApiCall) ont déjà leur propre logique.
axios.interceptors.response.use(
  async (response) => {
    // Cache successful GET responses for offline use
    if (response.config?.method?.toLowerCase() === 'get' && response.data) {
      try {
        const url = response.config.url || ''
        const path = url.startsWith(API_URL) ? url.substring(API_URL.length) : url
        if (path) {
          await cacheApiResponse(path, response.data, 15 * 60 * 1000)
        }
      } catch {
        // Non-critical: cache failure should not break the response
      }
    }
    return response
  },
  async (error) => {
    // Network error (no response from server) — update offline store + try cache
    if (!error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      try {
        const offlineStore = useOfflineStore()
        offlineStore.setOnline(false)

        // For GET requests, try to serve from cache before rejecting
        if (error.config?.method?.toLowerCase() === 'get') {
          const url = error.config.url || ''
          const path = url.startsWith(API_URL) ? url.substring(API_URL.length) : url
          if (path) {
            const cached = await getCachedResponse(path)
            if (cached) {
              console.log('[Offline] ✅ Serving cached response for:', path)
              return {
                data: cached.data,
                status: 200,
                statusText: 'OK (offline cache)',
                headers: {},
                config: error.config,
              }
            }
            console.log('[Offline] ❌ No cached data for:', path)
          }
        }
      } catch {
        // Store not available yet
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
