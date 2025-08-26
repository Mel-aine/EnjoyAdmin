<template>
  <div>
    <label
      :for="inputId"
      class="flex items-center justify-between text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400"
    >
      <span>{{ title }}</span>
      <div class="relative">
        <input 
          :id="inputId" 
          type="checkbox" 
          :checked="modelValue" 
          @change="handleChange"
          class="sr-only" 
        />
        <div
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
            modelValue
              ? 'bg-brand-500 border-brand-500'
              : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              modelValue ? 'translate-x-6' : 'translate-x-1'
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
  title: string
  modelValue: boolean
  id?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined
})

const emit = defineEmits<Emits>()

const inputId = computed(() => props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>