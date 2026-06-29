/**
 * usePwaUpdate
 *
 * Enhanced PWA update composable that integrates with the offline sync
 * system. Handles:
 * - Service worker registration & updates
 * - Offline-ready notification
 * - Background sync registration
 * - Periodic sync for cache refresh
 */
import { ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

export function usePwaUpdate() {
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const updateSW = ref<(() => Promise<void>) | null>(null)

  const {
    offlineReady: swOfflineReady,
    needRefresh: swNeedRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onNeedRefresh() {
      needRefresh.value = true
      localStorage.setItem('pwa-updated', 'true')
    },
    onOfflineReady() {
      offlineReady.value = true
      console.log('[PWA] App is ready to work offline')

      // Auto-hide after 5 seconds
      setTimeout(() => {
        offlineReady.value = false
      }, 5000)
    },
    onRegistered(swRegistration) {
      if (swRegistration) {
        // Register periodic background sync if available
        registerPeriodicSync(swRegistration)
        registerBackgroundSync(swRegistration)
      }
    },
    onRegisterError(error) {
      console.error('[PWA] Service worker registration error:', error)
    },
  })

  updateSW.value = updateServiceWorker

  /**
   * Trigger the service worker update and reload the page
   */
  async function refreshApp() {
    if (updateSW.value) {
      await updateSW.value()
      localStorage.removeItem('pwa-updated')
      window.location.reload()
    }
  }

  /**
   * Register for periodic background sync (Chrome 80+)
   * This keeps the cache fresh even when the app is closed
   */
  function registerPeriodicSync(registration: ServiceWorkerRegistration) {
    if ('periodicSync' in registration) {
      try {
        const tags = ['sync-pull', 'sync-cache-cleanup']
        tags.forEach(async (tag) => {
          // @ts-expect-error - periodicSync is not in all TS types yet
          await registration.periodicSync.register(tag, {
            minInterval: 30 * 60 * 1000, // Every 30 minutes
          })
        })
        console.log('[PWA] Periodic sync registered')
      } catch (err) {
        // Periodic sync not supported (may fail on some browsers)
        console.debug('[PWA] Periodic sync not available')
      }
    }
  }

  /**
   * Register for background sync (for when queue has pending items)
   */
  function registerBackgroundSync(registration: ServiceWorkerRegistration) {
    if ('sync' in registration) {
      // Register a 'sync-queue' tag to process pending operations
      navigator.serviceWorker.ready.then((swReg) => {
        // @ts-expect-error - SyncManager is in the SW scope
        swReg.sync?.register('sync-queue')
      }).catch(() => {
        // Background sync not available
      })
    }
  }
}
