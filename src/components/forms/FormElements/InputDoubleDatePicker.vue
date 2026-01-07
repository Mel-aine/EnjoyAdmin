<template>
  <div>
    <label v-if="title" class="block text-gray-700 text-sm font-medium mb-1.5">
      {{ title }} <span class="text-red-500" v-if="isRequired">*</span>
    </label>

    <div class="relative">
      <flat-pickr
        v-model="localValue"
        :config="rangeConfig"
        @on-change="updateValue"
        @on-ready="onReady"
        :class="[
          'h-11 w-full rounded-lg appearance-none border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-500 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-dark-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800',
          props.customClass
        ]"
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
import type { Instance } from 'flatpickr/dist/types/instance'

type DateRange = { start: string | null, end: string | null }

const props = defineProps({
  modelValue: { type: Object as () => DateRange, default: () => ({ start: null, end: null }) },
  isRequired: { type: Boolean, default: false },
  title: { type: String, default: '' },
  errorMsg: { type: String, default: '' },
  allowPastDates: { type: Boolean, default: false },
  customClass:{ type: String, default: '' },
  minDate: { type: [String, Date], default: null },
  maxDate: { type: [String, Date], default: null },
})

const emits = defineEmits(['update:modelValue', 'clear-error'])

const localValue = ref<Date[]>([])
const isUpdatingFromParent = ref(false)

const flatpickrInstance = ref<Instance | null>(null)

const computedMinDate = computed(() => {
  if (props.minDate) return props.minDate
  if (props.allowPastDates) {
    return undefined
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
})

const computedMaxDate = computed(() => {
  return props.maxDate || undefined
})

const rangeConfig = computed((): Partial<BaseOptions & { utc: boolean }> => ({
  mode: 'range',
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd/m/Y',
  conjunction: ' --> ',
  locale: {
    rangeSeparator: ' -> '
  },
  minDate: computedMinDate.value,
  maxDate: computedMaxDate.value,
  clickOpens: true,
  allowInput: false,
  static: false,
  animate: false,
  disableMobile: false,
  utc: false,
  onOpen: [(selectedDates, dateStr, instance) => {
    if (selectedDates.length > 0) {
      instance.jumpToDate(selectedDates[0])
    } else {
      instance.jumpToDate(new Date())
    }
  }],
  // CORRECTION 2: S'assurer que la signature de la fonction et le type de retour correspondent
  parseDate: (datestr: string, format: string): Date => {
    if (!datestr) return new Date() // Doit retourner une Date, pas null

    if (/^\d{4}-\d{2}-\d{2}$/.test(datestr)) {
      const parts = datestr.split('-')
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      return new Date(year, month, day)
    }

    return new Date(datestr)
  },
  formatDate: (date: Date, format: string) => {
    if (format === 'Y-m-d') {
      return formatDateToString(date)
    }
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }
}))

// Le callback 'onReady' de la config et celui de l'event @on-ready sont redondants.
// On garde celui de l'event @on-ready pour plus de clarté.
const onReady = (selectedDates: Date[], dateStr: string, instance: Instance) => {
  flatpickrInstance.value = instance
  instance.config.animate = false
}

const updateValue = async (selectedDates: Date[]) => {
  if (isUpdatingFromParent.value) {
    return
  }

  const [start, end] = selectedDates

  if (selectedDates.length < 2) {
    return
  }

  emits('clear-error')

  if (!props.allowPastDates) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if ((start && start < today) || (end && end < today)) {
      return
    }
  }

  const startStr = start ? formatDateToString(start) : null
  const endStr = end ? formatDateToString(end) : null

  await nextTick()

  emits('update:modelValue', {
    start: startStr,
    end: endStr
  })
}

watch(
  () => [props.minDate, props.maxDate],
  () => {
    if (flatpickrInstance.value) {
      flatpickrInstance.value.destroy()
    }
  }
)
const parseDateFromString = (dateStr: string | null): Date | null => {
  if (!dateStr) return null
  try {
    const parts = dateStr.split('-')
    if (parts.length !== 3) return null
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const date = new Date(year, month, day)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

watch(
  () => [props.modelValue?.start ?? null, props.modelValue?.end ?? null] as [string | null, string | null],
  async (newVals, oldVals) => {
    const [startStr, endStr] = Array.isArray(newVals) ? newVals : [null, null]
    const [prevStartStr, prevEndStr] = Array.isArray(oldVals) ? oldVals : [null, null]

    if (startStr === prevStartStr && endStr === prevEndStr) {
      return
    }

    isUpdatingFromParent.value = true

    try {
      const startDate = parseDateFromString(startStr)
      const endDate = parseDateFromString(endStr)

      const newDates: Date[] = []
      if (startDate) newDates.push(startDate)
      if (endDate) newDates.push(endDate)

      localValue.value = newDates

    } catch (error) {
      console.error('Erreur lors de la conversion des dates:', error)
      localValue.value = []
    }

    await nextTick()
    isUpdatingFromParent.value = false
  },
  { immediate: true }
)

watch(
  () => props.allowPastDates,
  () => {

    if (flatpickrInstance.value) {
      flatpickrInstance.value.destroy()
      // L'instance sera recréée automatiquement par le composant flat-pickr lors du prochain rendu
    }
  }
)
</script>

<style scoped>
:deep(.flatpickr-calendar) {
  animation: none !important;
  transition: none !important;
}

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
