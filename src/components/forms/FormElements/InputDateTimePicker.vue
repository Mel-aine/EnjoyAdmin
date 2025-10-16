<template>
  <div>
    <label v-if="title" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ title }} <span class="text-red-500" v-if="isRequired || required">*</span>
    </label>

    <div class="flex w-full">
      <!-- Input Date -->
      <div class="relative flex-1">
        <flat-pickr
          v-model="internalDate"
          :config="dateConfig"
          class="dark:bg-dark-900 h-11 w-full appearance-none border border-black/50 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800  rounded-r-none"
          placeholder="Sélectionner une date"
        />
        <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalendarIcon />
        </span>
      </div>

      <!-- Input Time -->
      <div class="relative w-36">
        <flat-pickr
          v-model="internalTime"
          :config="timeConfig"
          class="dark:bg-dark-900 h-11 w-full appearance-none border border-l-0 border-black/50 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800  rounded-l-none"
          placeholder="Heure"
        />
        <span class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <Clock :size="20"/>
        </span>
      </div>
    </div>

    <!-- Debug -->
    <div v-if="showDebug" class="text-xs text-gray-500 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
      <div><strong>Internal Date:</strong> "{{ internalDate }}"</div>
      <div><strong>Internal Time:</strong> "{{ internalTime }}"</div>
      <div><strong>Combined:</strong> "{{ combinedDateTime }}"</div>
      <div><strong>ModelValue:</strong> "{{ modelValue }}"</div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMsg && errorMsg.length > 0" class="text-red-500 text-sm font-light italic mt-1">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import { Clock } from 'lucide-vue-next'

interface Props {
  modelValue?: string | null
  title?: string
  isRequired?: boolean
  required?: boolean
  errorMsg?: string
  showDebug?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'clear-error'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  title: '',
  isRequired: false,
  required: false,
  errorMsg: '',
  showDebug: false
})

const emit = defineEmits<Emits>()

// États internes
const internalDate = ref('')
const internalTime = ref('')

// Configuration Flatpickr
const dateConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'j F Y',
  allowInput: true,
}

const timeConfig = {
  enableTime: true,
  noCalendar: true,
  time_24hr: true,
  dateFormat: 'H:i',
  allowInput: true,
}

// Valeur combinée
const combinedDateTime = computed(() => {
  if (internalDate.value && internalTime.value) {
    return `${internalDate.value} ${internalTime.value}`
  }
  return ''
})

// Fonction pour parser la valeur d'entrée
const parseInputValue = (value: string | null | undefined) => {
  if (!value || value === '') {
    internalDate.value = ''
    internalTime.value = ''
    return
  }

  if (value.includes('T')) {
    // Format ISO: 2025-09-18T14:30:00 ou 2025-09-18T14:30
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      internalDate.value = date.toISOString().split('T')[0]
      internalTime.value = date.toTimeString().slice(0, 5)
    }
  } else if (value.includes(' ')) {
    // Format: 2025-09-18 14:30
    const [datePart, timePart] = value.split(' ')
    if (datePart && timePart) {
      internalDate.value = datePart
      internalTime.value = timePart
    }
  }
}

// Initialisation depuis modelValue
watch(() => props.modelValue, (newValue) => {
  if (props.showDebug) {
    console.log('📥 ModelValue received:', newValue)
  }
  parseInputValue(newValue)
}, { immediate: true })

// Watcher sur la date interne
watch(internalDate, (newDate) => {
  if (props.showDebug) {
    console.log('📅 Internal date changed:', newDate)
  }

  emit('clear-error')

  // Si on a une date mais pas d'heure, mettre une heure par défaut
  if (newDate && !internalTime.value) {
    internalTime.value = '12:00'
    if (props.showDebug) {
      console.log('⏰ Auto-set time to 12:00')
    }
  }

  // Émettre la nouvelle valeur
  if (combinedDateTime.value) {
    emit('update:modelValue', combinedDateTime.value)
  } else {
    emit('update:modelValue', '')
  }
})

// Watcher sur l'heure interne
watch(internalTime, (newTime) => {
  if (props.showDebug) {
    console.log('⏰ Internal time changed:', newTime)
  }

  emit('clear-error')

  // Émettre la nouvelle valeur
  if (combinedDateTime.value) {
    emit('update:modelValue', combinedDateTime.value)
  } else {
    emit('update:modelValue', '')
  }
})

// Debug du combined value
watch(combinedDateTime, (newValue) => {
  if (props.showDebug) {
    console.log('🔄 Combined DateTime:', newValue)
  }
})
</script>
