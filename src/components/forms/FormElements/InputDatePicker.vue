<template>
  <div>
    <label
      for="consentDate"
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      v-if="title"
    >
      {{ title }}
      <span class="text-red-500" v-if="isRequired">*</span>
    </label>

    <div class="relative">
      <flat-pickr
        v-model="localValue"
        :config="flatpickrConfig"
        @on-change="updateValue"
        :class="[
          'h-11 w-full rounded-lg border border-black/50 bg-white px-2 py-2.5 pl-2 pr-6 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-500 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-dark-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 dark:disabled:border-gray-700',
          props.customClass
        ]"
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <span
        class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-2 top-1/2 dark:text-gray-400"
      >
        <CalendarIcon />
      </span>
    </div>

    <div v-if="errorMsg.length > 0" class="text-red-500 text-sm font-light italic">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarIcon from '@/icons/CalendarIcon.vue'
import { computed, ref, watch } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxDate: {
    type: String,
    default: ''
  },
  minDate: {
    type: String,
    default: ''
  },
  errorMsg: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
   allowPastDates: {
    type: Boolean,
    default: true
  },
  customClass:{
     type: String,
    default: ''
  }
})

const emits = defineEmits(['update:modelValue', 'clear-error'])

const localValue = ref(props.modelValue)

const flatpickrConfig = computed(() => {
  const config: any = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'd/m/Y',
    wrap: true,
    disableMobile: true,
  }

  if (!props.allowPastDates) {
    config.minDate = "today"
  }

  if (props.maxDate) config.maxDate = props.maxDate
  if (props.minDate) config.minDate = props.minDate
    config.clickOpens = !props.disabled

  return config
})

const updateValue = () => {
  if (props.disabled) return
  emits('clear-error')
  emits('update:modelValue', localValue.value)
}

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})
</script>

<style scoped>
/* Dark theme overrides for flatpickr calendar */
:deep(.dark) .flatpickr-calendar {
  background: #1f2937; /* gray-800 */
  box-shadow: 0 10px 15px -3px rgba(0,0,0,.4), 0 4px 6px -2px rgba(0,0,0,.3);
  border-color: #374151; /* gray-700 */
}

:deep(.dark) .flatpickr-months,
:deep(.dark) .flatpickr-days,
:deep(.dark) .flatpickr-weekdays {
  background: #1f2937; /* gray-800 */
}

:deep(.dark) .flatpickr-day {
  color: #e5e7eb; /* gray-200 */
}

:deep(.dark) .flatpickr-day.today {
  border-color: #6366f1; /* indigo-500 */
}

:deep(.dark) .flatpickr-day.selected,
:deep(.dark) .flatpickr-day.startRange,
:deep(.dark) .flatpickr-day.endRange,
:deep(.dark) .flatpickr-day.inRange {
  background: #4f46e5; /* indigo-600 */
  border-color: #4f46e5;
  color: #ffffff;
}

:deep(.dark) .flatpickr-time .numInputWrapper input,
:deep(.dark) .flatpickr-months .cur-month,
:deep(.dark) .flatpickr-weekday {
  color: #d1d5db; /* gray-300 */
}
</style>
