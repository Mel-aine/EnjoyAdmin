<template>
  <div ref="selectWrapper" class="w-full">
    <label v-if="!hideLabel" for="extract_charge_select" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="isDropdownOpen ? 'text-brand-500' : 'text-gray-500'">
      {{ lb || $t('Particular') }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div :class="['relative font-sans', (disabled || isLoading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
      <!-- Input field for autocomplete -->
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder || $t('Search extra charges...')"
        :disabled="disabled || isLoading"
        class="flex justify-between dark:bg-dark-900 h-11 w-full truncate rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
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
      <input type="hidden" :required="isRequired" :value="selectedCharge?.id || ''" />

      <!-- Dropdown list -->
      <ul v-if="isDropdownOpen && !isLoading"
        class="custom-scrollbar  absolute top-full left-0  z-999 mt-1 rounded-b-lg max-h-60 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        role="listbox" :aria-expanded="isDropdownOpen" aria-hidden="false">

        <!-- No results message -->
        <li v-if="chargeOptions.length === 0 && searchQuery.length > 0"
          class="px-5 py-3 text-gray-500 dark:text-gray-400 text-center italic">
          {{ $t('No extra charges found') }}
        </li>

        <!-- Initial message when no search -->
        <li v-else-if="chargeOptions.length === 0 && searchQuery.length === 0"
          class="px-5 py-3 text-gray-500 dark:text-gray-400 text-center italic">
          {{ $t('Start typing to search extra charges...') }}
        </li>

        <!-- Extra charge options -->
        <li v-for="charge in chargeOptions"
          :key="charge.id"
          @click="selectCharge(charge)"
          :class="[
            'px-5 py-3 cursor-pointer hover:bg-brand-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0',
            disabled ? 'cursor-not-allowed text-gray-400' : '',
            selectedCharge?.id === charge.id ? 'bg-brand-50 text-brand-700 dark:bg-blue-900 dark:text-blue-200' : ''
          ]"
          role="option"
          :aria-selected="selectedCharge?.id === charge.id">
          <div class="flex flex-col">
            <div class="font-medium text-sm">
              {{ charge.name || charge.charge_name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('Type') }}: {{ charge.type === 'percentage' ? $t('Percentage') : $t('Flat Amount') }} |
              {{ $t('Value') }}: {{ formatCurrency(charge.rateInclusiveTax) }} |
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
import { getExtraCharges } from '@/services/configrationApi'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash'
import { formatCurrency } from '../../../utils/numericUtils'

interface ExtraChargeOption {
  id: number
  name?: string
  charge_name?: string
  type: 'percentage' | 'flat'
  value: number
  status: 'active' | 'inactive'
  short_code?: string
  apply_on?: string
  description?: string
  rateInclusiveTax: number
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
const chargeOptions = ref<ExtraChargeOption[]>([])
const selectedCharge = ref<ExtraChargeOption | null>(null)
const allCharges = ref<ExtraChargeOption[]>([])

// Computed
const formatChargeValue = computed(() => {
  return (charge: ExtraChargeOption) => {
    if (charge.type === 'percentage') {
      return `${charge.value}%`
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(charge.value || 0)
    }
  }
})

// Watch for modelValue changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== selectedCharge.value?.id) {
      // Find the charge in current options or all charges
      const found = chargeOptions.value.find(charge => charge.id === Number(newVal)) ||
                   allCharges.value.find(charge => charge.id === Number(newVal))
      if (found) {
        selectedCharge.value = found
        searchQuery.value = found.name || found.charge_name || ''
      }
    } else if (!newVal) {
      selectedCharge.value = null
      searchQuery.value = ''
    }
  },
  { immediate: true }
)

// Filter charges based on search query
const filterCharges = (query: string) => {
  if (!query.trim()) {
    chargeOptions.value = allCharges.value
    return
  }

  const searchTerm = query.toLowerCase()
  chargeOptions.value = allCharges.value.filter(charge => {
    const name = (charge.name || charge.charge_name || '').toLowerCase()
    const shortCode = (charge.short_code || '').toLowerCase()
    const type = charge.type.toLowerCase()
    const description = (charge.description || '').toLowerCase()

    return name.includes(searchTerm) ||
           shortCode.includes(searchTerm) ||
           type.includes(searchTerm) ||
           description.includes(searchTerm)
  })
}

// Debounced search function
const debouncedSearch = debounce((query: string) => {
  filterCharges(query)
}, 300)

// Load all extra charges
const loadExtraCharges = async () => {
  try {
    isLoading.value = true
    const response = await getExtraCharges()
    console.log('response.data',response.data)
    // Transform the response data
    const charges = (response.data?.data?.data || response.data?.data || response.data || []).map((charge: any) => {
      return {
        id: charge.id,
        name: charge.name,
        type: charge.type || 'flat',
        value: charge.rate || 0,
        rateInclusiveTax: charge.rateInclusiveTax,
        status: charge.status || 'active',
        shortCode: charge.shortCode,
        chargeAppliesOn: charge.chargeAppliesOn,
        description: charge.description
      }
    })

    allCharges.value = charges
    chargeOptions.value = charges

    // Preselect the charge if a modelValue was passed before data loaded
    const initialId = props.modelValue != null ? Number(props.modelValue) : null
    if (initialId && !selectedCharge.value) {
      const initial = charges.find((c: ExtraChargeOption) => c.id === initialId)
      if (initial) {
        selectedCharge.value = initial
        searchQuery.value = initial.name || initial.charge_name || '';
        selectCharge(selectedCharge.value!)
      }
    }
  } catch (error) {
    console.error('Error loading extra charges:', error)
    allCharges.value = []
    chargeOptions.value = []
  } finally {
    isLoading.value = false
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value

  // Clear selection if user is typing
  if (selectedCharge.value && searchQuery.value !== (selectedCharge.value.name || selectedCharge.value.charge_name)) {
    selectedCharge.value = null
  }

  // Open dropdown and search
  isDropdownOpen.value = true
  debouncedSearch(searchQuery.value)
}

const handleFocus = () => {
  if (!props.disabled && !isLoading.value) {
    isDropdownOpen.value = true
    // Load charges if not already loaded
    if (allCharges.value.length === 0) {
      loadExtraCharges()
    }
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isDropdownOpen.value = false
    inputRef.value?.blur()
  }
}

const selectCharge = (charge: ExtraChargeOption) => {
    selectedCharge.value = charge
    searchQuery.value = charge.name || charge.charge_name || ''
    isDropdownOpen.value = false

    emit('update:modelValue', charge.id)
    emit('select', charge)
    emit('change', charge.id)
  
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
  // Load all charges on mount
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
 loadExtraCharges()
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
