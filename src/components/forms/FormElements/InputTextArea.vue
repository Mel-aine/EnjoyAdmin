<template>
  <div>
    <label 
      v-if="label" 
      :for="inputId" 
      class="mb-1.5 block text-sm font-medium"
      :class="[
        disabled ? 'text-gray-300 dark:text-white/15' : 'text-gray-700 dark:text-gray-400'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>
    
    <div class="relative">
      <textarea
        :id="inputId"
        v-model="inputValue"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="[
          'w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 resize-none',
          textareaClasses
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      ></textarea>
      
      <!-- Character count -->
      <div 
        v-if="showCharCount && maxlength" 
        class="absolute bottom-2 right-2 text-xs text-gray-400"
      >
        {{ characterCount }}/{{ maxlength }}
      </div>
    </div>
    
    <!-- Help text or error message -->
    <p 
      v-if="helpText || errorMessage" 
      class="mt-1.5 text-xs"
      :class="[
        errorMessage ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'
      ]"
    >
      {{ errorMessage || helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  maxlength?: number
  showCharCount?: boolean
  helpText?: string
  errorMessage?: string
  variant?: 'default' | 'error' | 'success'
  id?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Enter text...',
  rows: 4,
  disabled: false,
  readonly: false,
  required: false,
  showCharCount: false,
  variant: 'default'
})

const emit = defineEmits<Emits>()

// Generate unique ID if not provided
const inputId = computed(() => props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`)

// Two-way binding
const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

// Character count
const characterCount = computed(() => props.modelValue.length)

// Dynamic classes based on state
const textareaClasses = computed(() => {
  const baseClasses = 'text-gray-800 dark:text-white/90 dark:placeholder:text-white/30'
  
  if (props.disabled) {
    return `${baseClasses} border-gray-300 disabled:border-gray-100 disabled:bg-gray-50 disabled:placeholder:text-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:disabled:border-gray-800 dark:disabled:bg-white/[0.03] dark:disabled:placeholder:text-white/15`
  }
  
  if (props.variant === 'error' || props.errorMessage) {
    return `${baseClasses} border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700 dark:bg-gray-900 dark:focus:border-error-800`
  }
  
  if (props.variant === 'success') {
    return `${baseClasses} border-success-300 focus:border-success-300 focus:ring-success-500/10 dark:border-success-700 dark:bg-gray-900 dark:focus:border-success-800`
  }
  
  // Default state
  return `${baseClasses} border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800`
})

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('input', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Dark mode scrollbar */
.dark textarea::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark textarea::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>