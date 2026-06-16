import { useRegisterSW } from 'virtual:pwa-register/vue'

export function usePwaUpdate() {
  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    immediate: true,
    onNeedRefresh() {
      localStorage.setItem('pwa-updated', 'true')
    },
    onOfflineReady() {},
    onRegisterError(error) {
      console.error('Erreur Service Worker :', error)
    },
  })

  return { needRefresh, offlineReady, updateServiceWorker }
}