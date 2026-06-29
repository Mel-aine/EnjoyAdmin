/**
 * useOfflineReady
 *
 * Composable pour vérifier si les données d'un type de ressource
 * sont disponibles dans le cache local pour une utilisation offline.
 *
 * Usage :
 *   const { isReady, progress, loadedCount, check } = useOfflineReady('reservation', 50)
 *   await check()
 *   if (isReady.value) { /* OK, on peut travailler offline *\/ }
 */
import { ref, computed } from 'vue'
import { OfflineCacheService } from '../services/offline/cacheService.js'

export function useOfflineReady(resourceType: string, minCount: number = 1) {
  const isReady = ref(false)
  const loadedCount = ref(0)
  const lastChecked = ref<Date | null>(null)

  const progress = computed(() =>
    minCount > 0 ? Math.min(100, Math.round((loadedCount.value / minCount) * 100)) : 0
  )

  const isSufficient = computed(() => loadedCount.value >= minCount)

  /**
   * Vérifier la disponibilité offline
   */
  async function check(): Promise<boolean> {
    const items = await OfflineCacheService.getAll(resourceType)
    loadedCount.value = items.length
    isReady.value = items.length >= minCount
    lastChecked.value = new Date()
    return isReady.value
  }

  /**
   * Vérifier la disponibilité d'une ressource spécifique par ID
   */
  async function checkById(resourceId: number | string): Promise<boolean> {
    const item = await OfflineCacheService.get(resourceType, resourceId)
    return item !== null
  }

  return {
    isReady,
    progress,
    loadedCount,
    minCount,
    lastChecked,
    isSufficient,
    check,
    checkById,
  }
}
