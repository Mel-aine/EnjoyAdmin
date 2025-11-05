<!-- ValueOverrideModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 z-99999 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50" @click="handleCancel"></div>

    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h2>
        <button
          @click="handleCancel"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-5 space-y-4">
        <!-- -->
        <div class="flex items-center">
          <span class="w-36 text-sm text-gray-700">{{ $t('RoomTypes') }}:</span>
          <span class="text-sm text-gray-900 font-medium">{{ selectedRange?.row?.roomTypeName }}</span>
        </div>

        <div v-if="modalType === 'RATE'" class="flex items-center">
          <span class="w-36 text-sm text-gray-700">{{ $t('RatePlan') }}:</span>
          <span class="text-sm text-gray-900 font-medium">{{ selectedRange?.row?.name }}</span>
        </div>

        <!-- Date Range -->
        <div class="flex items-start">
          <label class="w-36 text-sm text-gray-700 pt-2">Date Range:</label>
          <div class="flex-1 flex items-center gap-2">
            <InputDoubleDatePicker
              class="flex-1"
              :modelValue="dateRange"
              @update:modelValue="updateDateRange"
              :allowPastDates="false"
              :is-required="false"
            />
          </div>
        </div>

        <!-- Restriction -->
        <div class="flex items-center">
          <label class="w-40 text-sm text-gray-700">Restriction:</label>
          <div class="w-[350px]">
            <Input
              v-if="modalType === 'AVL'"
              :modelValue="'Availability'"
              disabled
              class="bg-gray-50 text-gray-600"
            />
            <Select
              v-else
              v-model="restriction"
              :options="rateRestrictions"
            />
          </div>
        </div>

        <!-- Current Price (only for RATE type) -->
        <div v-if="modalType === 'RATE'" class="flex items-center">
          <span class="w-36 text-sm text-gray-700">Current Price:</span>
          <span class="text-sm text-gray-900 font-medium">200000</span>
        </div>

        <!-- Dynamic Input Field -->
        <div v-if="modalType === 'AVL' || restriction" class="flex items-center">
          <span class="w-40 text-sm text-gray-700">{{ inputLabel }}:</span>
          <Toggle
            v-if="inputComponent === 'InputToggle'"
            v-model="value"
            :id="'toggle-input'"
          />
          <Input
            v-else-if="inputComponent === 'Input'"
            v-model="value"
            :placeholder="inputLabel"
            type="number"
            min="0"
            class="w-[350px]"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t">
        <button
          @click="handleCancel"
          type="button"
          class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          type="button"
          :disabled="loading || !isFormValid"
          class="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
  roomTypeName:string
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
  { label: t('Closed To Departure'), value: 'closed_departure' },
  { label: t('Stop Sell'), value: 'stop' },
  { label: t('Closed To Arrival'), value: 'closed_arrival' },
  { label: t('Closed'), value: 'closed' },
  { label: t('Rate'), value: 'rate' },
  { label: t('Min Stay Arrival'), value: 'min_stay' },
  { label: t('Min Stay Through'), value: 'min_stay_through' },
  { label: t('Max Stay'), value: 'max_stay' },
])

const inputComponent = computed(() => {
  if (props.modalType === 'AVL') return 'Input'
  if (!restriction.value) return null

  switch (restriction.value) {
    case 'closed_arrival':
    case 'closed_departure':
    case 'stop':
    case 'closed':
      return 'InputToggle'
    case 'rate':
    case 'max_stay':
    case 'min_stay':
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
    case 'min_stay':
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
    console.log('selectedRange',props.selectedRange)

    // Initialize restriction and value
    if (props.modalType === 'AVL') {
      restriction.value = 'availability'
      value.value = ''
    } else {
      restriction.value = ''
      value.value = ''
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

