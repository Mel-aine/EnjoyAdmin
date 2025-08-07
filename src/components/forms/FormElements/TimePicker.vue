<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ label }}</label>
    <div class="flex space-x-2 items-center">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('hour') }}</label>
        <select
          v-model="hour"
          @change="emitTime"
          class="flex justify-between dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
        >
          <option v-for="opt in hours" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <span class="text-lg">:</span>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('minute') }}</label>
        <select
          v-model="minute"
          @change="emitTime"
          class="flex justify-between dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-none"
        >
          <option v-for="opt in minutes" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  label: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Extract hour and minute from modelValue
const hour = computed({
  get: () => props.modelValue.split(':')[0] || '00',
  set: (val) => emit('update:modelValue', `${val}:${minute.value}`)
})

const minute = computed({
  get: () => props.modelValue.split(':')[1] || '00',
  set: (val) => emit('update:modelValue', `${hour.value}:${val}`)
})

const generateOptions = (max: number): Option[] =>
  Array.from({ length: max }, (_, i) => {
    const val = String(i).padStart(2, '0')
    return { label: val, value: val }
  })

const hours = generateOptions(24)
const minutes = generateOptions(60)

function emitTime() {
  emit('update:modelValue', `${hour.value}:${minute.value}`)
}
</script>
