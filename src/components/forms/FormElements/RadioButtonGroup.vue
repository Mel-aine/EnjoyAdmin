<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <div class="inline-flex bg-gray-100 rounded-lg p-1">
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option.value)"
        type="button"
        class="px-10 py-2 text-sm font-medium rounded-md transition-all duration-200"
        :class="{
          'bg-white text-purple-600 shadow-sm': modelValue === option.value,
          'text-gray-600 hover:text-gray-900': modelValue !== option.value
        }"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: Option[]
  label?: string
  isRequired?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectOption = (value: string | number) => {
  emit('update:modelValue', value)
}
</script>
