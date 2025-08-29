<template>
  <div class="relative">
    <label v-if="!hideLabel" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label || 'Payment Method' }}
    </label>
    <div class="relative">
      <input
        ref="inputRef"
        type="text"
        :value="displayValue"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
        :placeholder="placeholder || 'Search payment methods...'"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        :class="{
          'pr-8': isLoading
        }"
      />
      
      <!-- Loading spinner -->
      <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Dropdown -->
      <div
        v-if="showDropdown && (filteredPaymentMethods.length > 0 || isLoading)"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <div v-if="isLoading" class="px-3 py-2 text-sm text-gray-500">
          Loading payment methods...
        </div>
        <div
          v-else
          v-for="(paymentMethod, index) in filteredPaymentMethods"
          :key="paymentMethod.id"
          @click="selectPaymentMethod(paymentMethod)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
          :class="{
            'bg-blue-50': index === selectedIndex
          }"
        >
          <div class="font-medium">{{ paymentMethod.name }}</div>
          <div v-if="paymentMethod.description" class="text-xs text-gray-500">
            {{ paymentMethod.description }}
          </div>
        </div>
      </div>
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
  modelValue?: PaymentMethod | null
  label?: string
  placeholder?: string
  hideLabel?: boolean
  paymentType?: string // Filter parameter
}

interface Emits {
  (e: 'update:modelValue', value: PaymentMethod | null): void
}

const props = withDefaults(defineProps<Props>(), {
  hideLabel: false,
  hotelId: 1
})

const emit = defineEmits<Emits>()

const authStore = useAuthStore()

// Reactive state
const inputRef = ref<HTMLInputElement>()
const showDropdown = ref(false)
const isLoading = ref(false)
const searchQuery = ref('')
const paymentMethods = ref<PaymentMethod[]>([])
const selectedIndex = ref(-1)

// Computed properties
const displayValue = computed(() => {
  if (props.modelValue) {
    return props.modelValue.name
  }
  return searchQuery.value
})

const filteredPaymentMethods = computed(() => {
  if (!searchQuery.value) {
    let filtered = paymentMethods.value
    
    // Filter by payment type if provided
    if (props.paymentType) {
      filtered = filtered.filter(method => 
        method.type?.toLowerCase() === props.paymentType?.toLowerCase()
      )
    }
    
    return filtered
  }
  
  let filtered = paymentMethods.value.filter(method =>
    method.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (method.description && method.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
  
  // Filter by payment type if provided
  if (props.paymentType) {
    filtered = filtered.filter(method => 
      method.type?.toLowerCase() === props.paymentType?.toLowerCase()
    )
  }
  
  return filtered
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    searchQuery.value = newValue.name
  } else {
    searchQuery.value = ''
  }
})

watch(() => props.paymentType, () => {
  // Reload payment methods when payment type changes
  loadPaymentMethods()
})

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  selectedIndex.value = -1
  
  if (!target.value && props.modelValue) {
    emit('update:modelValue', null)
  }
  
  showDropdown.value = true
}

const handleFocus = () => {
  showDropdown.value = true
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
  emit('update:modelValue', paymentMethod)
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
    
    if (response.data && Array.isArray(response.data.data)) {
      paymentMethods.value = response.data.data.map((method: any) => ({
        id: method.id,
        name: method.name || method.method_name || 'Unknown',
        description: method.description,
        type: method.type || method.payment_type,
        ...method
      }))
    } else if (response.data && Array.isArray(response.data)) {
      paymentMethods.value = response.data.map((method: any) => ({
        id: method.id,
        name: method.name || method.method_name || 'Unknown',
        description: method.description,
        type: method.type || method.payment_type,
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
  if (!inputRef.value?.contains(target)) {
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
/* Add any custom styles here */
</style>