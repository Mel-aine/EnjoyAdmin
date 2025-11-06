<!-- ValueOverrideModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 z-99999 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50" @click="handleCancel"></div>

    <!-- Modal -->
    <div class="relative bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-xl w-full max-w-lg mx-4" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h2>
        <button @click="handleCancel" class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200 transition-colors" type="button">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-5 space-y-4">
        <!-- -->
        <div class="flex items-center">
          <span class="w-36 text-sm text-gray-700 dark:text-gray-400">{{ $t('RoomTypes') }}:</span>
          <span class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ selectedRange?.row?.roomTypeName }}</span>
        </div>

        <div v-if="modalType === 'RATE' && restriction === 'rate'" class="flex items-center">
          <span class="w-36 text-sm text-gray-700 dark:text-gray-400">{{ $t('RatePlan') }}:</span>
          <span class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ selectedRange?.row?.name }}</span>
        </div>

        <!-- Date Range -->
        <div class="flex items-start">
          <label class="w-36 text-sm text-gray-700 dark:text-gray-400 pt-2">Date Range:</label>
          <div class="flex-1 flex items-center gap-2">
            <InputDoubleDatePicker class="flex-1" :modelValue="dateRange" @update:modelValue="updateDateRange"
              :allowPastDates="false" :is-required="false" />
          </div>
        </div>

        <!-- Restriction -->
        <div class="flex items-center">
          <label class="w-40 text-sm text-gray-700 dark:text-gray-400">Restriction:</label>
          <div class="w-[350px]">
            <Input v-if="modalType === 'AVL'" :modelValue="'Availability'" disabled class="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300" />
            <Select v-else v-model="restriction" :options="rateRestrictions" />
          </div>
        </div>

        <!-- Current Price (only when selecting Rate restriction) -->
        <div v-if="modalType === 'RATE' && restriction === 'rate'" class="flex items-center">
          <span class="w-36 text-sm text-gray-700 dark:text-gray-400">Current Price:</span>
          <span class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ formattedCurrentPrice }}</span>
        </div>

        <!-- Dynamic Input Field -->
        <div v-if="modalType === 'AVL' || restriction" class="flex items-center">
          <span class="w-40 text-sm text-gray-700 dark:text-gray-400">{{ inputLabel }}:</span>
          <Toggle v-if="inputComponent === 'InputToggle'" v-model="value" :id="'toggle-input'" />
          <Input v-else-if="inputComponent === 'Input'" v-model="value" :placeholder="inputLabel" type="number" min="0"
            class="w-[350px]" />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <button @click="handleCancel" type="button"
          class="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          :disabled="loading">
          Cancel
        </button>
        <button @click="handleConfirm" type="button" :disabled="loading || !isFormValid"
          class="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Processing...' : 'OK' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Toggle from '@/components/forms/FormElements/Toggle.vue'
import { useI18n } from 'vue-i18n'

interface RoomRow {
  id: string
  name: string
  roomTypeName: string
  type?: 'AVL' | 'RATE'
  label: string
  values: Record<string, number>
}

interface SelectedRange {
  row: RoomRow
  startDate: string
  endDate: string
}

interface RateRestriction {
  label: string
  value: string
}

interface ConfirmData {
  dateFrom: string
  dateTo: string
  restriction: string
  value: any
}

interface Props {
  isOpen: boolean
  selectedRange: SelectedRange | null
  modalType: 'AVL' | 'RATE'
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  confirm: [data: ConfirmData]
}>()

const { t } = useI18n()

// State
const dateFrom = ref('')
const dateTo = ref('')
const restriction = ref('')
const value = ref<any>('')

// Computed
const title = computed(() => {
  return 'Value Override'
})

const dateRange = computed(() => ({
  start: dateFrom.value,
  end: dateTo.value
}))

const rateRestrictions = computed(() => [
  { label: t('Closed To Arrival'), value: 'closed_arrival' },
  { label: t('Closed To Departure'), value: 'closed_departure' },
  { label: t('Min Stay Arrival'), value: 'min_stay_arrival' },
  { label: t('Max Stay'), value: 'max_stay' },
  { label: t('Min Stay Through'), value: 'min_stay_through' },
  { label: t('Rate'), value: 'rate' },
  { label: t('Stop Sell'), value: 'stop' },
])

const currentPrice = computed(() => {
  if (props.modalType !== 'RATE') return null
  const date = props.selectedRange?.startDate
  const row = props.selectedRange?.row
  if (!date || !row) return null
  return row.values?.[date] ?? null
})

const formattedCurrentPrice = computed(() => {
  if (currentPrice.value === null || currentPrice.value === undefined) return '-'
  try {
    return new Intl.NumberFormat('en-US').format(Number(currentPrice.value))
  } catch {
    return String(currentPrice.value)
  }
})

const mapLabelToRestriction = (label: string): string => {
  switch (label) {
    case 'Closed To Arrival':
      return 'closed_arrival'
    case 'Closed To Departure':
      return 'closed_departure'
    case 'Stop Sell':
      return 'stop'
    case 'Rate':
    case 'RATE':
      return 'rate'
    case 'Min Stay Arrival':
      return 'min_stay_arrival'
    case 'Min Stay Through':
      return 'min_stay_through'
    case 'Max Stay':
      return 'max_stay'
    case 'Availability':
    case 'AVL':
      return 'availability'
    default:
      return ''
  }
}

const inputComponent = computed(() => {
  if (props.modalType === 'AVL') return 'Input'
  if (!restriction.value) return null

  switch (restriction.value) {
    case 'closed_arrival':
    case 'closed_departure':
    case 'stop':
      return 'InputToggle'
    case 'rate':
    case 'max_stay':
    case 'min_stay_arrival':
    case 'min_stay_through':
      return 'Input'
    default:
      return null
  }
})

const inputLabel = computed(() => {
  if (props.modalType === 'AVL') return t('Value')

  const type = restriction.value
  if (!type) return ''

  switch (type) {
    case 'closed_arrival':
    case 'closed_departure':
    case 'stop':
    case 'closed':
      return t('Is Active')
    case 'rate':
    case 'max_stay':
    case 'min_stay_arrival':
    case 'min_stay_through':
      return t('Value')
    default:
      return type
  }
})

const isFormValid = computed(() => {
  if (props.modalType === 'AVL') {
    return dateFrom.value && dateTo.value && value.value !== ''
  }

  const isToggleType = ['closed_arrival', 'closed_departure', 'stop', 'closed'].includes(restriction.value)
  return dateFrom.value && dateTo.value && restriction.value && (isToggleType || value.value !== '')
})

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Initialize dates from selectedRange
    dateFrom.value = props.selectedRange?.startDate || ''
    dateTo.value = props.selectedRange?.endDate || ''
    console.log('selectedRange', props.selectedRange)

    // Initialize restriction and value
    const clickedLabel = props.selectedRange?.row?.label || ''
    if (props.modalType === 'AVL') {
      restriction.value = 'availability'
      // Prefill availability value for the start date if present
      const start = props.selectedRange?.startDate
      const v = start ? props.selectedRange?.row?.values?.[start] : ''
      value.value = v ?? ''
    } else {
      // Preselect restriction based on the clicked row label
      restriction.value = mapLabelToRestriction(clickedLabel)
      const start = props.selectedRange?.startDate
      const rawVal = start ? props.selectedRange?.row?.values?.[start] : ''
      // Prefill value based on type
      if (['closed_arrival', 'closed_departure', 'stop', 'closed'].includes(restriction.value)) {
        value.value = rawVal === 1 || rawVal === true || rawVal === '1'
      } else {
        value.value = rawVal ?? ''
      }
    }
  }
})

watch(restriction, (newVal) => {
  if (newVal === 'closed_arrival' || newVal === 'closed_departure' || newVal === 'stop' || newVal === 'closed') {
    value.value = false
  } else {
    value.value = ''
  }
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})

// Methods
const updateDateRange = (range: { start: string; end: string }) => {
  dateFrom.value = range.start
  dateTo.value = range.end
}

const handleConfirm = () => {
  if (!isFormValid.value) return

  emit('confirm', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    restriction: restriction.value,
    value: value.value,
  })
}

const handleCancel = () => {
  emit('close')
}
</script>

<style scoped>
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
