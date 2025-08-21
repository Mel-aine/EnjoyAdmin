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
import { ref, watch, nextTick } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import type { BaseOptions } from 'flatpickr/dist/types/options'

type DateRange = { start: string|null, end: string|null }

const props = defineProps({
  modelValue: { type: Object as () => DateRange, default: () => ({ start: null, end: null }) },
  isRequired: { type: Boolean, default: false },
  title: { type: String, default: '' },
  errorMsg: { type: String, default: '' }
})

const emits = defineEmits(['update:modelValue', 'clear-error'])

// Flatpickr attend un tableau de dates [start, end]
const localValue = ref<Date[]>([])
const isUpdatingFromParent = ref(false)

const rangeConfig: Partial<BaseOptions> = {
  mode: 'range',
  dateFormat: 'Y-m-d',      // format envoyé dans v-model
  altInput: true,
  altFormat: 'd/m/Y',       // affichage lisible
  conjunction: ' --> ',
  locale: {
    rangeSeparator: ' -> '
  }
}

// Mise à jour : Flatpickr -> Parent
const updateValue = async (selectedDates: Date[]) => {
  // Éviter la mise à jour si elle vient du parent
  if (isUpdatingFromParent.value) {
    return
  }

  emits('clear-error')

  const [start, end] = selectedDates

  // Convertir en strings pour éviter les problèmes de référence
  const startStr = start ? start.toISOString().split('T')[0] : null
  const endStr = end ? end.toISOString().split('T')[0] : null

  console.log('📅 Date picker update:', { startStr, endStr })

  emits('update:modelValue', {
    start: startStr,
    end: endStr
  })
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
        // Convertir les strings en dates
        const startDate = new Date(newVal.start)
        const endDate = new Date(newVal.end)

        // Vérifier que les dates sont valides
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          localValue.value = [startDate, endDate]
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
</script>
