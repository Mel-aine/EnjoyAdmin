<template>
  <div ref="selectWrapper" class="w-full">
    <label v-if="!hideLabel" for="payment_method_select" 
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="showDropdown ? 'text-brand-500' : 'text-gray-500'">
      {{$t(label || 'Payment Method' )}}
    </label>

    <div class="relative font-sans cursor-pointer" @click="handleFocus">
      <div
        class="flex justify-between dark:bg-dark-900 h-11 w-full truncate rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        :class="showDropdown ? 'border-purple-500 text-gray-900' : 'border-gray-300'">
        <input ref="inputRef" type="text" :value="displayValue" @input="handleInput" @focus="handleFocus"
          @keydown="handleKeydown" :placeholder="placeholder || 'Search payment methods...'"
          class="w-full bg-transparent outline-none border-none p-0 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30" />
        
        <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
        <span v-else :class="showDropdown ? 'text-purple-500' : 'text-gray-500'">▼</span>
      </div>

      <!-- Dropdown -->
      <ul v-if="showDropdown && (filteredPaymentMethods.length > 0 || isLoading)"
        class="custom-scrollbar absolute top-full left-0 right-0 z-999 mt-1 rounded-b-lg max-h-40 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100"
        role="listbox" :aria-expanded="showDropdown" aria-hidden="false">
        <li v-if="isLoading" class="px-5 py-2 text-sm text-gray-500">
          Loading payment methods...
        </li>
        <li v-else v-for="(paymentMethod, index) in filteredPaymentMethods" :key="paymentMethod.id"
          @click="selectPaymentMethod(paymentMethod)" 
          class="px-5 py-2 cursor-pointer hover:bg-brand-100 transition-colors duration-150"
          :class="{
            'bg-blue-50': index === selectedIndex,
            'bg-purple-100 border-l-4 border-purple-500 font-semibold text-purple-800': props.modelValue === paymentMethod.id,
            'text-gray-700': props.modelValue !== paymentMethod.id
          }"
          role="option" :aria-selected="props.modelValue === paymentMethod.id">
          <div class="font-medium flex items-center justify-between">
            <span>{{ paymentMethod.name }}</span>
            <span v-if="props.modelValue === paymentMethod.id" class="text-purple-600 text-sm">✓</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getPaymentMethods } from '@/services/paymentMethodApi'
import { useAuthStore } from '@/composables/user'
import { useServiceStore } from '../../../composables/serviceStore'

interface PaymentMethod {
  id: number
  name: string
  description?: string
  type?: string
  [key: string]: any
}

interface Props {
  modelValue?: number | null // Changed to number (ID)
  label?: string
  placeholder?: string
  hideLabel?: boolean
  paymentType?: string // Filter parameter
  disabled?:boolean
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void // Changed to number (ID)
  (e: 'select', method: PaymentMethod): void // Emit selected method object
  (e: 'change', methodId: number | null): void // Emit method ID on change
}

const props = withDefaults(defineProps<Props>(), {
  hideLabel: false,
  hotelId: 1
})

const emit = defineEmits<Emits>()

const authStore = useAuthStore()

// Reactive state
const inputRef = ref<HTMLInputElement>()
const selectWrapper = ref<HTMLElement | null>(null)
const showDropdown = ref(false)
const isLoading = ref(false)
const searchQuery = ref('')
const paymentMethods = ref<PaymentMethod[]>([])
const selectedIndex = ref(-1)
const isUserTyping = ref(false) // Track if user is actively typing

// Computed properties
const displayValue = computed(() => {
  if (props.modelValue) {
    const selectedMethod = paymentMethods.value.find(method => method.id === props.modelValue)
    return selectedMethod ? selectedMethod.name : ''
  }
  return searchQuery.value
})

const filteredPaymentMethods = computed(() => {
  let filtered = paymentMethods.value

  // Filter by payment type if provided
  if (props.paymentType) {
    filtered = filtered.filter(method =>
      (method.methodType?.toLowerCase() === props.paymentType?.toLowerCase()) || (
      method.methodType !== 'city_ledger' && method.type?.toLowerCase() === props.paymentType?.toLowerCase()
    )
    )
  }

  // Only apply search filter if user is actively typing and has entered text
  if (isUserTyping.value && searchQuery.value.trim()) {
    filtered = filtered.filter(method =>
      method.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (method.description && method.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  return filtered
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const selectedMethod = paymentMethods.value.find(method => method.id === newValue)
    searchQuery.value = selectedMethod ? selectedMethod.name : ''
  } else {
    searchQuery.value = ''
  }
})

watch(() => props.paymentType, () => {
  // Reset selected value when payment type changes
  emit('update:modelValue', null)
  emit('change', null)
  searchQuery.value = ''
  
  // Reload payment methods when payment type changes
  loadPaymentMethods()
})

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  selectedIndex.value = -1
  isUserTyping.value = true // Mark that user is actively typing

  if (!target.value && props.modelValue) {
    emit('update:modelValue', null)
    emit('change', null) // Emit change event when cleared
  }

  showDropdown.value = true
}

const handleFocus = () => {
  showDropdown.value = true
  isUserTyping.value = false // Reset typing state on focus to show all options
  
  // Clear search query when focusing to show all available options
  if (props.modelValue) {
    const selectedMethod = paymentMethods.value.find(method => method.id === props.modelValue)
    searchQuery.value = selectedMethod ? selectedMethod.name : ''
  } else {
    searchQuery.value = ''
  }
  
  if (paymentMethods.value.length === 0) {
    loadPaymentMethods()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredPaymentMethods.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && filteredPaymentMethods.value[selectedIndex.value]) {
        selectPaymentMethod(filteredPaymentMethods.value[selectedIndex.value])
      }
      break
    case 'Escape':
      showDropdown.value = false
      selectedIndex.value = -1
      break
  }
}

const selectPaymentMethod = (paymentMethod: PaymentMethod) => {
  emit('update:modelValue', paymentMethod.id) // Emit only the ID
  emit('select', paymentMethod) // Emit the selected method object
  emit('change', paymentMethod.id) // Emit the method ID on change
  searchQuery.value = paymentMethod.name
  showDropdown.value = false
  selectedIndex.value = -1
  inputRef.value?.blur()
}

const loadPaymentMethods = async () => {
  try {
    isLoading.value = true
    const hotelId = useServiceStore().serviceId!
    const response = await getPaymentMethods(hotelId)
    console.log('city test', response)

    if (response.data && Array.isArray(response.data.data)) {
      paymentMethods.value = response.data.data.map((method: any) => ({
        id: method.id,
        name: method.methodName,
        description: method.description,
        type: method.methodType,
        ...method
      }))
    } else if (response.data && Array.isArray(response.data)) {
      paymentMethods.value = response.data.map((method: any) => ({
        id: method.id,
        name: method.methodName,
        description: method.description,
        type: method.methodType,
        ...method
      }))
    }
  } catch (error) {
    console.error('Error loading payment methods:', error)
    paymentMethods.value = []
  } finally {
    isLoading.value = false
  }
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (selectWrapper.value && !selectWrapper.value.contains(target)) {
    showDropdown.value = false
    selectedIndex.value = -1
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadPaymentMethods()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #b654c7e2 #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #25ebe5;
}
</style>