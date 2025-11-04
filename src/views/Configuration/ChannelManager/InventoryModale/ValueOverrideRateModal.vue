<template>
  <div v-if="show" class="fixed inset-0 z-99999 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50" @click="handleCancel"></div>

    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
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
        <!-- Room Type -->
        <div class="flex items-center">
          <span class="w-36 text-sm text-gray-700"> Room Type: </span>
          <span class="text-sm text-gray-900 font-medium">{{ roomType }}</span>
        </div>

        <!-- Rate Plan -->
        <div class="flex items-center">
          <span class="w-36 text-sm text-gray-700"> Rate Plan: </span>
          <span class="text-sm text-gray-900">{{ ratePlan }}</span>
        </div>

        <!-- Date Range -->
        <div class="flex items-start">
          <label class="w-36 text-sm text-gray-700 pt-2"> Date Range: </label>
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
          <label class="w-40 text-sm text-gray-700"> Restriction: </label>
          <div class="w-[350px]">
            <Select v-model="restriction" :options="Restrictions" />
          </div>
        </div>

        <!-- Current Price -->
        <div class="flex items-center">
          <span class="w-36 text-sm text-gray-700"> Current Price: </span>
          <span class="text-sm text-gray-900 font-medium">{{ currentPrice }}</span>
        </div>

        <!-- Dynamic Input Field -->
        <div v-if="restriction" class="flex items-center">
          <span class="w-40 text-sm text-gray-700"> {{ InputLabel }}: </span>
          <Toggle
            v-if="InputComponent === 'InputToggle'"
            v-model="value"
            :id="'toggle-input'"
          />
          <Input
            v-else-if="InputComponent === 'Input'"
            v-model="value"
            :placeholder="InputLabel"
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

interface Props {
  show: boolean
  title?: string
  roomType?: string
  ratePlan?: string
  currentPrice?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm', data: ConfirmData): void
  (e: 'cancel'): void
}

interface ConfirmData {
  dateFrom: string
  dateTo: string
  restriction: string
  value: any
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Value Override',
  roomType: 'Lifestyle Suite',
  ratePlan: 'Rate Plan for Lifestyle Suite A2',
  currentPrice: '200000',
  loading: false,
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// State
const dateFrom = ref('2025-11-05')
const dateTo = ref('2025-11-05')
const restriction = ref('')
const value = ref<any>('')

// Computed date range for the picker
const dateRange = computed(() => ({
  start: dateFrom.value,
  end: dateTo.value
}))

// Update dates from picker
const updateDateRange = (range: { start: string; end: string }) => {
  dateFrom.value = range.start
  dateTo.value = range.end
}

// Restriction options
const Restrictions = computed(() => [
  { label: t('Closed To Departure'), value: 'closed_departure' },
  { label: t('Stop Sell'), value: 'stop' },
  { label: t('Closed To Arrival'), value: 'closed_arrival' },
  { label: t('Rate'), value: 'rate' },
  { label: t('Min Stay Arrival'), value: 'min_stay' },
  { label: t('Min Stay Through'), value: 'min_stay_through' },
  { label: t('Max Stay'), value: 'max_stay' },
])

// Determine input component type
const InputComponent = computed(() => {
  if (!restriction.value) return null

  switch (restriction.value) {
    case 'closed_arrival':
    case 'closed_departure':
    case 'stop':
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

// Input label
const InputLabel = computed(() => {
  const type = restriction.value
  if (!type) return ''

  switch (type) {
    case 'closed_arrival':
    case 'closed_departure':
    case 'stop':
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

// Form validation
const isFormValid = computed(() => {
  return dateFrom.value && dateTo.value && restriction.value && value.value !== ''
})

// Reset value when restriction changes
watch(restriction, (newVal) => {
  if (newVal === 'closed_arrival' || newVal === 'closed_departure' || newVal === 'stop') {
    value.value = false
  } else {
    value.value = ''
  }
})

// Handlers
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
  emit('cancel')
  emit('update:show', false)
}

// Escape key handling
watch(
  () => props.show,
  (newVal) => {
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
  },
)
</script>

<style scoped>
/* Smooth transitions */
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
