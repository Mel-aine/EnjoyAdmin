<template>
  <div class="relative">
    <!-- Input field with loading indicator -->
    <div class="relative">
      <input
        ref="inputRef"
        type="text"
        :value="displayValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'block w-full pl-3 pr-10 py-2 text-base border rounded-md leading-5 focus:outline-none focus:ring-1 sm:text-sm   text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800',
          'dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400',
          'transition duration-150 ease-in-out'
        ]"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="error ? `${id}-error` : undefined"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-owns="isOpen ? `${id}-listbox` : undefined"
        :aria-activedescendant="activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined"
        role="combobox"
        autocomplete="off"
      />
      
      <!-- Loading indicator -->
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <!-- Dropdown arrow -->
      <div v-else class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="error" :id="`${id}-error`" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
    
    <!-- Dropdown menu -->
    <div 
      v-if="isOpen" 
      :id="`${id}-listbox`"
      class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      role="listbox"
    >
      <!-- Loading state -->
      <div v-if="loading && suggestions.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
        Loading...
      </div>
      
      <!-- No results state -->
      <div v-else-if="suggestions.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
        No results found
      </div>
      
      <!-- Suggestions list -->
      <div v-else>
        <div
          v-for="(suggestion, index) in suggestions"
          :key="getSuggestionKey(suggestion, index)"
          :id="`${id}-option-${index}`"
          :class="[
            'cursor-pointer select-none relative py-2 pl-3 pr-9',
            activeIndex === index ? 'text-white bg-purple-600 dark:bg-purple-700' : 'text-gray-900 dark:text-white',
          ]"
          @mousedown.prevent="selectSuggestion(suggestion)"
          @mouseover="activeIndex = index"
          role="option"
          :aria-selected="activeIndex === index ? 'true' : 'false'"
        >
          <!-- Default suggestion rendering -->
          <template v-if="!$slots.suggestion">
            <span :class="['block truncate', activeIndex === index ? 'font-medium' : 'font-normal']">
              {{ getSuggestionLabel(suggestion) }}
            </span>
          </template>
          
          <!-- Custom suggestion rendering -->
          <slot 
            v-else 
            name="suggestion" 
            :suggestion="suggestion" 
            :index="index" 
            :active="activeIndex === index"
          ></slot>
          
          <!-- Selected indicator -->
          <span
            v-if="isSelected(suggestion)"
            :class="[
              'absolute inset-y-0 right-0 flex items-center pr-4',
              activeIndex === index ? 'text-white' : 'text-blue-600 dark:text-blue-400',
            ]"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// Props
const props = defineProps({
  // Value binding
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  
  // Display configuration
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  
  // API configuration
  fetchSuggestions: {
    type: Function,
    required: true
  },
  minChars: {
    type: Number,
    default: 0
  },
  debounceMs: {
    type: Number,
    default: 300
  },
  
  // State
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  
  // Customization
  allowCustomValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'search'])

// Refs
const inputRef = ref(null)
const id = ref(`autocomplete-${uuidv4()}`)

// State
const inputValue = ref('')
const suggestions = ref<any>([])
const isOpen = ref(false)
const loading = ref(false)
const activeIndex = ref <any>(-1)
const debounceTimeout =ref <any>(null)

// Computed
const displayValue = computed(() => {
  if (inputValue.value !== undefined && inputValue.value !== null) {
    return inputValue.value
  }
  
  if (props.modelValue) {
    if (typeof props.modelValue === 'object') {
      return props.modelValue[props.labelKey] || ''
    }
    return String(props.modelValue)
  }
  
  return ''
})

// Methods
function getSuggestionKey(suggestion:any, index:any) {
  if (typeof suggestion === 'object' && suggestion !== null) {
    return suggestion[props.valueKey] || index
  }
  return index
}

function getSuggestionLabel(suggestion:any) {
  if (typeof suggestion === 'object' && suggestion !== null) {
    return suggestion[props.labelKey] || ''
  }
  return String(suggestion)
}

function getSuggestionValue(suggestion:any) {
  if (typeof suggestion === 'object' && suggestion !== null) {
    return suggestion[props.valueKey] || suggestion
  }
  return suggestion
}

function isSelected(suggestion:any) {
  if (!props.modelValue) return false
  
  if (typeof props.modelValue === 'object' && typeof suggestion === 'object') {
    return props.modelValue[props.valueKey] === suggestion[props.valueKey]
  }
  
  return props.modelValue === getSuggestionValue(suggestion)
}

async function fetchData(query:any) {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  
  // Skip fetching if query is too short
  if (query.length < props.minChars) {
    suggestions.value = []
    loading.value = false
    return
  }
  
  debounceTimeout.value = setTimeout(async () => {
    loading.value = true
    emit('search', query)
    
    try {
      const results = await props.fetchSuggestions(query)
      suggestions.value = Array.isArray(results) ? results : []
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      suggestions.value = []
    } finally {
      loading.value = false
    }
  }, props.debounceMs)
}

function handleInput(event:any) {
  const value = event.target.value
  inputValue.value = value
  
  if (value) {
    fetchData(value)
    if (!isOpen.value) {
      isOpen.value = true
    }
  } else {
    suggestions.value = []
    if (props.allowCustomValue) {
      emit('update:modelValue', '')
      emit('change', '')
    }
  }
}

function handleFocus() {
  emit('focus')
  if (!isOpen.value) {
    fetchData(displayValue.value || '')
    isOpen.value = true
  }
}

function handleBlur() {
  emit('blur')
  // Delay closing to allow click events on suggestions
  setTimeout(() => {
    isOpen.value = false
    activeIndex.value = -1
    
    // Reset input value if no selection and custom values not allowed
    if (!props.allowCustomValue && !props.modelValue && inputValue.value) {
      inputValue.value = ''
    }
  }, 150)
}

function handleKeydown(event:any) {
  if (!isOpen.value && (event.key === 'ArrowDown' || event.key === 'Enter')) {
    isOpen.value = true
    fetchData(inputValue.value || '')
    event.preventDefault()
    return
  }
  
  if (!isOpen.value) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
      scrollToActive()
      break
      
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = activeIndex.value <= 0 ? suggestions.value.length - 1 : activeIndex.value - 1
      scrollToActive()
      break
      
    case 'Enter':
      event.preventDefault()
      if (activeIndex.value >= 0 && activeIndex.value < suggestions.value.length) {
        selectSuggestion(suggestions.value[activeIndex.value])
      } else if (props.allowCustomValue && inputValue.value) {
        emit('update:modelValue', inputValue.value)
        emit('change', inputValue.value)
        isOpen.value = false
      }
      break
      
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      activeIndex.value = -1
      break
      
    case 'Tab':
      isOpen.value = false
      activeIndex.value = -1
      break
  }
}

function selectSuggestion(suggestion:any) {
  const value = suggestion
  emit('update:modelValue', value)
  emit('change', value)
  
  inputValue.value = getSuggestionLabel(suggestion)
  isOpen.value = false
  activeIndex.value = -1
}

function scrollToActive() {
  nextTick(() => {
    const activeEl = document.getElementById(`${id.value}-option-${activeIndex.value}`)
    if (activeEl && isOpen.value) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Watch effects
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (typeof newVal === 'object') {
      inputValue.value = newVal[props.labelKey] || ''
    } else {
      inputValue.value = String(newVal)
    }
  } else {
    inputValue.value = ''
  }
}, { immediate: true })

// Lifecycle hooks
onMounted(() => {
  // Initial fetch if value is provided
  if (props.modelValue && typeof props.modelValue === 'object') {
    inputValue.value = props.modelValue[props.labelKey] || ''
  }
})

onUnmounted(() => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
})
</script>