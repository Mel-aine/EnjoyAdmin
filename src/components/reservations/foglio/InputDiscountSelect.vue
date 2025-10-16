<template>
  <div ref="selectWrapper" class="w-full">
    <label v-if="!hideLabel" for="discount_select" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="isDropdownOpen ? 'text-brand-500' : 'text-gray-500'">
      {{ lb || $t('Discount') }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div :class="['relative font-sans', (disabled || isLoading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
      <!-- Input field for autocomplete -->
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder || $t('Search discounts...')"
        :disabled="disabled || isLoading"
        class="flex justify-between dark:bg-dark-900 h-11 w-full truncate  border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        :class="[isDropdownOpen ? 'border-purple-500 text-gray-900' : 'border-black/50', customClass]"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
      />

      <!-- Loading spinner -->
      <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <DotSpinner></DotSpinner>
      </div>

      <!-- Search icon when typing, dropdown arrow otherwise -->
      <div v-else class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg v-if="searchQuery.length > 0" class="w-4 h-4" :class="isDropdownOpen ? 'text-purple-500' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <span v-else :class="isDropdownOpen ? 'text-purple-500' : 'text-gray-500'">▼</span>
      </div>

      <!-- Hidden input for form validation -->
      <input type="hidden" :required="isRequired" :value="selectedDiscount?.id || ''" />

      <!-- Dropdown list -->
      <ul v-if="isDropdownOpen && !isLoading"
        class="custom-scrollbar absolute top-full left-0 z-999999 mt-1 rounded-b-lg max-h-60 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100 shadow-lg"
        role="listbox" :aria-expanded="isDropdownOpen" aria-hidden="false">

        <!-- No results message -->
        <li v-if="discountOptions.length === 0 && searchQuery.length > 0"
          class="px-5 py-3 text-gray-500 text-center italic">
          {{ $t('No discounts found') }}
        </li>

        <!-- Initial message when no search -->
        <li v-else-if="discountOptions.length === 0 && searchQuery.length === 0"
          class="px-5 py-3 text-gray-500 text-center italic">
          {{ $t('Start typing to search discounts...') }}
        </li>

        <!-- Discount options -->
        <li v-for="discount in discountOptions"
          :key="discount.id"
          @click="selectDiscount(discount)"
          :class="[
            'px-5 py-3 cursor-pointer hover:bg-brand-100 border-b border-gray-100 last:border-b-0',
            disabled ? 'cursor-not-allowed text-gray-400' : '',
            selectedDiscount?.id === discount.id ? 'bg-brand-50 text-brand-700' : ''
          ]"
          role="option"
          :aria-selected="selectedDiscount?.id === discount.id">
          <div class="flex flex-col">
            <div class="font-medium text-sm">
              {{ discount.name || discount.discount_name }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ $t('Type') }}: {{ discount.type === 'percentage' ? $t('Percentage') : $t('Flat Amount') }} |
              {{ $t('Value') }}: {{ formatDiscountValue(discount) }} |
              {{ $t('Status') }}: {{ discount.status === 'active' ? $t('Active') : $t('Inactive') }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import DotSpinner from '@/components/spinner/DotSpinner.vue'
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { getDiscounts } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash'

interface DiscountOption {
  id: number
  name?: string
  discount_name?: string
  type: 'percentage' | 'flat'
  value: number
  status: 'active' | 'inactive'
  short_code?: string
  apply_on?: string
  open_discount?: boolean
}

interface Props {
  lb?: string
  isRequired?: boolean
  modelValue?: number | string
  placeholder?: string
  disabled?: boolean
  customClass?: string
  hotelId?: number
  hideLabel?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'select', 'change'])

const { t } = useI18n()

// Refs
const selectWrapper = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isDropdownOpen = ref(false)
const isLoading = ref(false)
const searchQuery = ref('')
const discountOptions = ref<DiscountOption[]>([])
const selectedDiscount = ref<DiscountOption | null>(null)
const allDiscounts = ref<DiscountOption[]>([])

// Computed
const formatDiscountValue = computed(() => {
  return (discount: DiscountOption) => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(discount.value || 0)
    }
  }
})

// Watch for modelValue changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== selectedDiscount.value?.id) {
      // Find the discount in current options or all discounts
      const found = discountOptions.value.find(discount => discount.id === Number(newVal)) ||
                   allDiscounts.value.find(discount => discount.id === Number(newVal))
      if (found) {
        selectedDiscount.value = found
        searchQuery.value = found.name || found.discount_name || ''
      }
    } else if (!newVal) {
      selectedDiscount.value = null
      searchQuery.value = ''
    }
  },
  { immediate: true }
)

// Nouveau watch à ajouter après celui de modelValue
watch(allDiscounts, (newDiscounts) => {
  if (props.modelValue && newDiscounts.length > 0 && !selectedDiscount.value) {
    const found = newDiscounts.find(d => d.id === Number(props.modelValue))
    if (found) {
      selectedDiscount.value = found
      searchQuery.value = found.name || found.discount_name || ''
    }
  }
})

// Filter discounts based on search query
const filterDiscounts = (query: string) => {
  if (!query.trim()) {
    discountOptions.value = allDiscounts.value
    return
  }

  const searchTerm = query.toLowerCase()
  discountOptions.value = allDiscounts.value.filter(discount => {
    const name = (discount.name || discount.discount_name || '').toLowerCase()
    const shortCode = (discount.short_code || '').toLowerCase()
    const type = discount.type.toLowerCase()

    return name.includes(searchTerm) ||
           shortCode.includes(searchTerm) ||
           type.includes(searchTerm)
  })
}

// Debounced search function
const debouncedSearch = debounce((query: string) => {
  filterDiscounts(query)
}, 300)

// Load all discounts
const loadDiscounts = async () => {
  try {
    isLoading.value = true
    const response = await getDiscounts()

    // Transform the response data
    const discounts = (response.data?.data?.data || response.data?.data || response.data || []).map((discount: any) => {
      return {
        id: discount.id,
        name: discount.name,
        discount_name: discount.discount_name,
        type: discount.type || 'percentage',
        value: discount.value || 0,
        status: discount.status || 'active',
        short_code: discount.short_code,
        apply_on: discount.apply_on,
        open_discount: discount.open_discount
      }
    })

    allDiscounts.value = discounts
    discountOptions.value = discounts
  } catch (error) {
    console.error('Error loading discounts:', error)
    allDiscounts.value = []
    discountOptions.value = []
  } finally {
    isLoading.value = false
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value

  // Clear selection if user is typing
  if (selectedDiscount.value && searchQuery.value !== (selectedDiscount.value.name || selectedDiscount.value.discount_name)) {
    selectedDiscount.value = null
  }

  // Open dropdown and search
  isDropdownOpen.value = true
  debouncedSearch(searchQuery.value)
}

const handleFocus = () => {
  if (!props.disabled && !isLoading.value) {
    isDropdownOpen.value = true
    // Load discounts if not already loaded
    if (allDiscounts.value.length === 0) {
      loadDiscounts()
    }
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isDropdownOpen.value = false
    inputRef.value?.blur()
  }
}

const selectDiscount = (discount: DiscountOption) => {
  if (!props.disabled && !isLoading.value) {
    selectedDiscount.value = discount
    searchQuery.value = discount.name || discount.discount_name || ''
    isDropdownOpen.value = false

    emit('update:modelValue', discount.id)
    emit('select', discount)
    emit('change', discount.id)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    selectWrapper.value &&
    !selectWrapper.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Load all discounts on mount
  loadDiscounts()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
}

.opacity-50 {
  opacity: 0.5;
}

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
