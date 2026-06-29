/**
 * useOfflineForm
 *
 * Composable pour la sauvegarde automatique des formulaires.
 * Sauvegarde le formulaire dans IndexedDB après 30 secondes d'inactivité.
 * Permet de restaurer le brouillon au chargement de la page.
 *
 * Usage :
 *   const formData = ref({ name: '', email: '', ... })
 *   const { savedAt, restoreDraft, clearDraft } = useOfflineForm('booking-create', formData)
 *   onMounted(async () => {
 *     const restored = await restoreDraft()
 *     if (restored) toast.info('Brouillon restauré')
 *   })
 */
import { ref, watch, onUnmounted } from 'vue'
import { DraftService } from '../services/offline/draftService.js'

export function useOfflineForm(
  formKey: string,
  formData: Record<string, any> | { value: Record<string, any> },
  options?: {
    debounceMs?: number
    autoSave?: boolean
  }
) {
  const savedAt = ref<Date | null>(null)
  const isSaving = ref(false)
  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

  const debounceMs = options?.debounceMs ?? 30_000
  const autoSave = options?.autoSave ?? true

  /**
   * Récupérer les données du formulaire (supporte ref et reactive)
   */
  function getFormData(): Record<string, any> {
    if (formData && 'value' in formData) {
      return formData.value
    }
    return formData as Record<string, any>
  }

  /**
   * Sauvegarder le brouillon immédiatement
   */
  async function saveNow(): Promise<void> {
    isSaving.value = true
    try {
      await DraftService.save(formKey, JSON.parse(JSON.stringify(getFormData())))
      savedAt.value = new Date()
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Restaurer le brouillon
   */
  async function restoreDraft(): Promise<boolean> {
    const draft = await DraftService.restore<Record<string, any>>(formKey)
    if (draft) {
      const data = getFormData()
      Object.assign(data, draft)
      savedAt.value = new Date()
      return true
    }
    return false
  }

  /**
   * Supprimer le brouillon
   */
  async function clearDraft(): Promise<void> {
    await DraftService.delete(formKey)
    savedAt.value = null
  }

  /**
   * Vérifier si un brouillon existe
   */
  async function hasDraft(): Promise<boolean> {
    return DraftService.exists(formKey)
  }

  // Auto-save avec debounce
  if (autoSave) {
    watch(
      () => JSON.stringify(getFormData()),
      () => {
        if (autoSaveTimer) clearTimeout(autoSaveTimer)
        autoSaveTimer = setTimeout(saveNow, debounceMs)
      }
    )
  }

  // Nettoyage
  onUnmounted(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
      autoSaveTimer = null
    }
  })

  return {
    savedAt,
    isSaving,
    saveNow,
    restoreDraft,
    clearDraft,
    hasDraft,
  }
}
