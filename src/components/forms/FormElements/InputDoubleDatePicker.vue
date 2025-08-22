<template>
  <div>
    <label v-if="title" class="block text-gray-700 text-sm font-bold mb-2">
      {{ title }} <span class="text-red-500" v-if="isRequired">*</span>
    </label>

    <div class="relative">
      <flat-pickr
        v-model="localValue"
        :config="rangeConfig"
        @on-change="updateValue"
        @on-ready="onReady"
        class="dark:bg-dark-900 h-11 w-full appearance-none border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800 rounded-lg"
        :placeholder="$t('selected_period')"
      />
      <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <CalendarIcon />
      </span>
    </div>

    <div v-if="errorMsg.length > 0" class="text-red-500 text-sm font-light italic mt-1">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarIcon from '@/icons/CalendarIcon.vue'
import { ref, watch, nextTick, computed } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import type { BaseOptions } from 'flatpickr/dist/types/options'

type DateRange = { start: string | null, end: string | null }

const props = defineProps({
  modelValue: { type: Object as () => DateRange, default: () => ({ start: null, end: null }) },
  isRequired: { type: Boolean, default: false },
  title: { type: String, default: '' },
  errorMsg: { type: String, default: '' },
  // Nouvelle prop pour permettre ou non les dates passées
  allowPastDates: { type: Boolean, default: false }
})

const emits = defineEmits(['update:modelValue', 'clear-error'])

// Flatpickr attend un tableau de dates [start, end]
const localValue = ref<Date[]>([])
const isUpdatingFromParent = ref(false)
const flatpickrInstance = ref(null)

// Calculer la date minimale (aujourd'hui si allowPastDates est false)
const minDate = computed(() => {
  if (props.allowPastDates) {
    return undefined
  }
  // Retourner la date d'aujourd'hui
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset à minuit pour éviter les problèmes d'heure
  return today
})

const rangeConfig = computed((): Partial<BaseOptions> => ({
  mode: 'range',
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd/m/Y',
  conjunction: ' --> ',
  locale: {
    rangeSeparator: ' -> '
  },
  // Empêcher la sélection des dates passées
  minDate: minDate.value,
  // Améliorer les performances et la réactivité
  clickOpens: true,
  allowInput: false,
  // Empêcher le changement automatique de mois
  static: false,
  // Optimisations pour la performance
  animate: false,
  // Améliorer la navigation dans le calendrier
  disableMobile: false,
  // Utiliser UTC pour éviter les problèmes de timezone
  utc: false, // On garde false mais on gère manuellement les dates
  // Callbacks pour améliorer la réactivité
  onOpen: [(selectedDates, dateStr, instance) => {
    // S'assurer que le calendrier reste sur le bon mois
    if (selectedDates.length > 0) {
      instance.jumpToDate(selectedDates[0])
    } else {
      // Si pas de date sélectionnée, aller au mois courant
      instance.jumpToDate(new Date())
    }
  }],
  onReady: [(selectedDates, dateStr, instance) => {
    flatpickrInstance.value = instance
    // Optimiser l'instance
    instance.config.animate = false
    // Améliorer la performance des clics
    instance.config.clickOpens = true
  }],
  // Parser personnalisé pour éviter les problèmes de timezone
  parseDate: (datestr: string) => {
    if (!datestr) return null

    // Si c'est déjà au format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(datestr)) {
      const parts = datestr.split('-')
      const year = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1
      const day = parseInt(parts[2])
      return new Date(year, month, day)
    }

    // Fallback vers le parser par défaut
    return new Date(datestr)
  },
  formatDate: (date: Date, format: string) => {
    if (format === 'Y-m-d') {
      return formatDateToString(date)
    }
    // Pour l'affichage (d/m/Y)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }
}))

// Callback when flatpickr is ready
const onReady = (selectedDates: Date[], dateStr: string, instance: any) => {
  flatpickrInstance.value = instance
  // Désactiver l'animation pour améliorer les performances
  instance.config.animate = false
}

// Mise à jour : Flatpickr -> Parent
const updateValue = async (selectedDates: Date[]) => {
  // Éviter la mise à jour si elle vient du parent
  if (isUpdatingFromParent.value) {
    return
  }

  emits('clear-error')

  const [start, end] = selectedDates

  // Vérifier que les dates ne sont pas dans le passé (si allowPastDates est false)
  if (!props.allowPastDates) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start && start < today) {
      console.warn('Date de début dans le passé ignorée')
      return
    }
    if (end && end < today) {
      console.warn('Date de fin dans le passé ignorée')
      return
    }
  }

  // Convertir en strings en utilisant la méthode sûre pour éviter les problèmes de timezone
  const startStr = start ? formatDateToString(start) : null
  const endStr = end ? formatDateToString(end) : null

  console.log('📅 Date picker update:', {
    originalDates: selectedDates,
    startStr,
    endStr,
    startDate: start,
    endDate: end
  })

  // Utiliser nextTick pour éviter les conflits
  await nextTick()

  emits('update:modelValue', {
    start: startStr,
    end: endStr
  })
}

// Fonction utilitaire pour convertir string en Date de manière sûre (sans problème de timezone)
const parseDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null

  try {
    // Utiliser la méthode qui évite les problèmes de timezone
    const parts = dateStr.split('-')
    if (parts.length !== 3) return null

    const year = parseInt(parts[0])
    const month = parseInt(parts[1]) - 1 // Les mois sont en base 0
    const day = parseInt(parts[2])

    const date = new Date(year, month, day)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

// Fonction utilitaire pour convertir Date en string sans problème de timezone
const formatDateToString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Sync : Parent -> Flatpickr (avec protection contre les cycles)
watch(
  () => props.modelValue,
  async (newVal, oldVal) => {
    // Éviter les mises à jour inutiles
    if (newVal?.start === oldVal?.start && newVal?.end === oldVal?.end) {
      return
    }

    isUpdatingFromParent.value = true

    try {
      if (newVal?.start && newVal?.end) {
        // Convertir les strings en dates de manière plus robuste
        const startDate = parseDate(newVal.start)
        const endDate = parseDate(newVal.end)

        // Vérifier que les dates sont valides
        if (startDate && endDate) {
          localValue.value = [startDate, endDate]
        } else {
          localValue.value = []
        }
      } else if (newVal?.start) {
        // Si seulement start est défini
        const startDate = parseDate(newVal.start)
        if (startDate) {
          localValue.value = [startDate]
        } else {
          localValue.value = []
        }
      } else {
        localValue.value = []
      }
    } catch (error) {
      console.error('Erreur lors de la conversion des dates:', error)
      localValue.value = []
    }

    // Réinitialiser le flag après la mise à jour
    await nextTick()
    isUpdatingFromParent.value = false
  },
  { immediate: true, deep: true }
)

// Watch pour mettre à jour la configuration si allowPastDates change
watch(
  () => props.allowPastDates,
  () => {
    if (flatpickrInstance.value) {
      // Recréer l'instance avec la nouvelle configuration
      flatpickrInstance.value.destroy()
      nextTick(() => {
        // L'instance sera recréée automatiquement par Vue
      })
    }
  }
)
</script>

<style scoped>
/* Améliorer la réactivité du calendrier */
:deep(.flatpickr-calendar) {
  animation: none !important;
  transition: none !important;
}

/* Désactiver les dates passées visuellement */
:deep(.flatpickr-day.prevMonthDay),
:deep(.flatpickr-day.nextMonthDay) {
  color: #d1d5db;
}

:deep(.flatpickr-day.flatpickr-disabled) {
  color: #9ca3af !important;
  cursor: not-allowed !important;
}

:deep(.flatpickr-day.flatpickr-disabled:hover) {
  background: none !important;
  border-color: transparent !important;
}
</style>
