<template>
  <div>
    <label
      for="timePicker"
      class="block text-gray-700 text-sm font-medium mb-1.5"
      v-if="title"
    >
      {{ title }}
      <span class="text-red-500" v-if="isRequired">*</span>
    </label>

    <div class="relative">
      <flat-pickr
        v-model="localValue"
        :config="flatpickrConfig"
        @on-change="handleChange"
        @on-close="handleClose"
        class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
        :placeholder="placeholderText"
      />
      <span
        class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
      >
        <Clock :size="20"/>
      </span>
    </div>

    <div
      v-if="errorMsg.length > 0"
      class="text-red-500 text-sm font-light italic"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = withDefaults(defineProps<{
  modelValue?: string
  isRequired?: boolean
  title?: string
  placeholder?: string
  errorMsg?: string
  minTime?: string
  maxTime?: string
}>(), {
  modelValue: '',
  isRequired: false,
  title: '',
  placeholder: '',
  errorMsg: '',
  minTime: '',
  maxTime: ''
})

const placeholderText = computed(() => props.placeholder || t('select_time'))
const emits = defineEmits(['update:modelValue', 'clear-error'])
const localValue = ref(props.modelValue)

const flatpickrConfig = computed(() => {
  const config: any = {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i', // Format 24h
    time_24hr: true,

  }

  if (props.minTime) {
    config.minTime = props.minTime
  }
  if (props.maxTime) {
    config.maxTime = props.maxTime
  }

  return config
})

// Méthode pour gérer le changement
const handleChange = (selectedDates: Date[], dateStr: string) => {
  console.log('Time changed:', dateStr) // Pour déboguer
  emits('clear-error')
  emits('update:modelValue', dateStr)
}

// Méthode pour gérer la fermeture du picker
const handleClose = (selectedDates: Date[], dateStr: string) => {
  console.log('Picker closed with:', dateStr) // Pour déboguer
  emits('update:modelValue', dateStr)
}

// Watcher pour synchroniser avec le parent
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localValue.value) {
      localValue.value = newVal
      console.log('Updated from parent:', newVal) // Pour déboguer
    }
  }
)
</script>
