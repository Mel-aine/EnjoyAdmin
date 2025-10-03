<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ label  }}
    </label>
    <div class="flex gap-2">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :value="option.value"
          v-model="localValue"
          class="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-400"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{$t(option.label )}}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'

interface Option {
  value: string
  label: string
}

const props = defineProps<{
  label?: string
  options: Option[]
  modelValue: string
  disabled?:boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})

// Sélectionner la première option par défaut si aucune valeur n'est définie
const ensureDefaultSelected = () => {
  if (!props.modelValue && Array.isArray(props.options) && props.options.length > 0) {
    emit('update:modelValue', props.options[0].value)
  }
}

onMounted(() => {
  ensureDefaultSelected()
})

watch(
  () => props.options,
  () => {
    ensureDefaultSelected()
  },
  { deep: true }
)
</script>
