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


// ── Offline request interceptor: block requests when offline ─────────
// Bloque les appels API quand on est en mode offline et sert depuis le cache.
// Cela empêche les requêtes d'atteindre le réseau en mode hors ligne.
import { useOfflineStore } from './offline/offlineStore.js'
import { cacheApiResponse, getCachedResponse } from './offline/db.js'

/**
 * Ajoute un interceptor requête offline à une instance axios.
 * Si le store offline indique qu'on est hors ligne :
 * - GET : rejette immédiatement (le response interceptor sert depuis le cache)
 * - Écritures : rejette immédiatement
 */
function addOfflineRequestInterceptor(instance: typeof apiClient | typeof axios): void {
  instance.interceptors.request.use(
    async (config) => {
      try {
        const offlineStore = useOfflineStore()

        // Vérifier le navigateur + le store offline
        // navigator.onLine est immédiat (pas de debounce)
        // offlineStore.isOnline a un debounce de 4s mais est plus fiable pour
        // détecter les timeouts (ex: connexion Wi-Fi sans internet)
        const isBrowserOffline = !navigator.onLine
        const isStoreOffline = !offlineStore.isOnline

        // Si on est en ligne selon les DEUX sources, laisser passer
        if (!isBrowserOffline && !isStoreOffline) return config

        // Hors ligne → bloquer la requête et laisser le response interceptor
        // servir depuis le cache (pour les GET) ou rejeter (pour les écritures)
        const url = config.url || ''
        const path = url.startsWith(API_URL) ? url.substring(API_URL.length) : url

        console.log('[Offline] 🔒 Blocking request, serving from cache:', path,
          isBrowserOffline ? '(navigator)' : '(store)')

        return Promise.reject({
          config,
          message: 'Network Error',
          code: 'ECONNABORTED',
          __offlineRequest: true,
        })
      } catch {
        // Store not available yet, allow request to proceed
        return config
      }
    },
    (error) => Promise.reject(error)
  )
}

// Appliquer l'interceptor offline à apiClient ET au global axios
addOfflineRequestInterceptor(apiClient)
addOfflineRequestInterceptor(axios)

// ── Offline response interceptor: catch network errors + serve cache ─
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If network error (no response from server) OR blocked by offline request interceptor
    if (!error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.__offlineRequest) {
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

// ── Global axios response interceptor: cache on success ────────────────
// Met en cache les réponses GET réussies pour utilisation offline ultérieure.
// Le fallback offline est déjà géré par l'interceptor ci-dessus (appliqué aux deux instances).
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
    // Network error (no response from server) OR blocked by offline request interceptor
    if (!error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.__offlineRequest) {
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
