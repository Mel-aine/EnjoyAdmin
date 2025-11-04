<template>
  <div v-if="show" class="fixed inset-0 z-999999 flex items-center justify-center">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/50"
      @click="handleCancel"
    ></div>

    <!-- Modal -->
    <div
      class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        <button
          @click="handleCancel"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 space-y-4">
        <!-- Room Type -->
        <div class="flex items-center">
          <span class="w-32 text-sm font-medium text-gray-700">
            Room Type :
          </span>
          <span>{{ roomType }}</span>

        </div>

        <!-- Date Range -->
        <div class="flex items-center">
          <label class="w-32 text-sm font-medium text-gray-700">
            Date Range:
          </label>
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
          <label class="w-32 text-sm font-medium text-gray-700">
            Restriction:
          </label>
          <div class="w-2/3">
          <Select v-model="restriction" :options="[{label:'Availability',value:'availability'}]" />
          </div>

        </div>

        <!-- Value -->
        <div class="flex items-center">
          <label class="w-32 text-sm font-medium text-gray-700">
            Value:
          </label>
          <Input
            :input-type="'number'"
            v-model="value"
            class="w-2/3"
            min=0

          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-3 ">
        <button
          @click="handleCancel"
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'Processing...' : 'OK' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch,computed } from 'vue'
import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import Input from '@/components/forms/FormElements/Input.vue'

interface Props {
  show: boolean
  title?: string
  roomType?: string
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
  value: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Value Override',
  roomType: 'SUita',
  loading: false,
})

const emit = defineEmits<Emits>()

const dateFrom = ref('2025-11-06')
const dateTo = ref('2025-11-07')
const restriction = ref('availability')
const value = ref('')



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

const handleConfirm = () => {
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

// Handle escape key
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
