<template>
  <div>
    <label v-if="title" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ title }} <span class="text-red-500" v-if="isRequired">*</span>
    </label>

    <div class="flex w-full">
      <!-- Input Date -->
      <div class="relative flex-1">
        <flat-pickr
          v-model="localDate"
          :config="dateConfig"
          @on-change="updateValue"
          class="dark:bg-dark-900 h-11 w-full appearance-none border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800
                 rounded-l-lg rounded-r-none"
          placeholder="Date"
        />
        <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalendarIcon />
        </span>
      </div>

      <!-- Input Time -->
      <div class="relative w-36">
        <flat-pickr
          v-model="localTime"
          :config="timeConfig"
          @on-change="updateValue"
          class="dark:bg-dark-900 h-11 w-full appearance-none border border-l-0 border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800
                 rounded-r-lg rounded-l-none"
          placeholder="Heure"
        />
        <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <Clock :size="20"/>
        </span>
      </div>
    </div>

    <div v-if="errorMsg.length > 0" class="text-red-500 text-sm font-light italic mt-1">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarIcon from '@/icons/CalendarIcon.vue';
import { Clock } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const props = defineProps({
  modelValue: { type: String, default: '' },
  isRequired: { type: Boolean, default: false },
  title: { type: String, default: '' },
  errorMsg: { type: String, default: '' }
})

const emits = defineEmits(['update:modelValue', 'clear-error'])

const localDate = ref('')
const localTime = ref('')

// Config date picker
const dateConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y'
}

// Config time picker
const timeConfig = {
  enableTime: true,
  noCalendar: true,
  time_24hr: true,
  dateFormat: 'H:i',
  altInput: true,
  altFormat: 'H:i'
}

const updateValue = () => {
  emits('clear-error')
  if (localDate.value && localTime.value) {
    emits('update:modelValue', `${localDate.value} ${localTime.value}`)
  } else {
    emits('update:modelValue', '')
  }
}

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    localDate.value = ''
    localTime.value = ''
    return
  }
  const [datePart, timePart] = newVal.split(' ')
  localDate.value = datePart || ''
  localTime.value = timePart || ''
})
</script>
