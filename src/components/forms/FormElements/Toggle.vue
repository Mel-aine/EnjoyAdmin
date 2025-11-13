<template>
  <div>
    <label
      :for="inputId"
      class="flex items-center justify-between text-sm font-medium text-gray-700 select-none dark:text-gray-400 gap-1"
      :class="{ 'opacity-50 cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
    >
      <span>{{ title }}</span>

      <div class="relative">
        <input
          :id="inputId"
          type="checkbox"
          :checked="modelValue"
          @change="handleChange"
          class="sr-only"
          :disabled="disabled"
        />

        <div
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 ease-in-out',
            disabled
              ? (modelValue
                  ? 'bg-primary/50 border-brand-400 cursor-not-allowed'
                  : 'bg-gray-200/60 border-gray-300 dark:bg-gray-700/60 dark:border-gray-600 cursor-not-allowed')
              : (modelValue
                  ? 'bg-primary border-brand-500'
                  : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600')
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              modelValue ? 'translate-x-6' : 'translate-x-1',
              disabled ? 'opacity-70' : ''
            ]"
          />
        </div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  modelValue: boolean
  id?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  disabled: false
})

const emit = defineEmits<Emits>()

const inputId = computed(() => props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`)

const handleChange = (event: Event) => {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
