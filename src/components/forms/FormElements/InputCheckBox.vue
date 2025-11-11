<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  lb: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [Boolean, Array],
    default: false,
  },
  value: {
    type: [String, Number],
    default: null,
  },
  id: {
    type: String,
    default: null,
  },
})

const emits = defineEmits(['update:modelValue'])
const isArray = computed(() => Array.isArray(props.modelValue))
const checked = ref(false)

// Synchronisation initiale
watch(
  () => props.modelValue,
  (newValue) => {
    checked.value = isArray.value
      ? newValue.includes(props.value)
      : !!newValue
  },
  { immediate: true }
)

// Quand l’utilisateur coche/décoche
watch(checked, (newVal) => {
  if (isArray.value) {
    const newArray = [...props.modelValue]
    const index = newArray.indexOf(props.value)
    if (newVal && index === -1) newArray.push(props.value)
    else if (!newVal && index !== -1) newArray.splice(index, 1)
    emits('update:modelValue', newArray)
  } else {
    emits('update:modelValue', newVal)
  }
})

// Label final
const labelText = computed(() => props.label || props.lb || '')
</script>

<template>
    <div>
        <div>
            <label :for="id"
                class="flex items-center text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
                <div class="relative">
                    <input type="checkbox" :id="id" v-model="checked" class="sr-only" />
                    <div :class="checked
                            ? 'border-primary bg-primary/40'
                            : 'bg-transparent border-gray-300 dark:border-gray-700'
                        " class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500">
                        <span :class="checked ? '' : 'opacity-0'">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
                {{ labelText }}
            </label>
        </div>
    </div>
</template>

<style></style>