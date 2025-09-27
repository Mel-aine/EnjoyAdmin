<template>
  <div ref="selectWrapper" class="w-full">
    <label for="folio_select" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="isDropdownOpen ? 'text-brand-500' : 'text-gray-500'">
      {{ lb || $t('Folio') }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div :class="['relative font-sans', (disabled || isLoading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
      <!-- Input field for autocomplete -->
      <input ref="inputRef" v-model="searchQuery" type="text" :placeholder="placeholder || $t('Search folios...')"
        :disabled="disabled || isLoading"
        class="flex justify-between dark:bg-dark-900 h-11 w-full truncate rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        :class="[isDropdownOpen ? 'border-purple-500 text-gray-900' : 'border-gray-300', customClass]"
        @input="handleInput" @keydown="handleKeydown" @focus="handleFocus" />

      <!-- Loading spinner -->
      <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <DotSpinner></DotSpinner>
      </div>

      <!-- Search icon when typing, dropdown arrow otherwise -->
      <div v-else class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg v-if="searchQuery.length > 0" class="w-4 h-4" :class="isDropdownOpen ? 'text-purple-500' : 'text-gray-500'"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <span v-else :class="isDropdownOpen ? 'text-purple-500' : 'text-gray-500'">▼</span>
      </div>

      <!-- Hidden input for form validation -->
      <input type="hidden" :required="isRequired" :value="selectedFolio?.id || ''" />

      <!-- Dropdown list -->
      <ul v-if="isDropdownOpen && !isLoading"
        class="custom-scrollbar absolute top-full left-0 right-0 z-999 mt-1 rounded-b-lg max-h-60 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100 shadow-lg"
        role="listbox" :aria-expanded="isDropdownOpen" aria-hidden="false">

        <!-- No results message -->
        <li v-if="folioOptions.length === 0 && searchQuery.length > 0"
          class="px-5 py-3 text-gray-500 text-center italic">
          {{ $t('No folios found') }}
        </li>

        <!-- Initial message when no search -->
        <li v-else-if="folioOptions.length === 0 && searchQuery.length === 0"
          class="px-5 py-3 text-gray-500 text-center italic">
          {{ $t('Start typing to search folios...') }}
        </li>

        <!-- Folio options -->
        <li v-for="folio in folioOptions" :key="folio.id" @click="selectFolio(folio)" :class="[
          'px-5 py-3 cursor-pointer hover:bg-brand-100 border-b border-gray-100 last:border-b-0',
          disabled ? 'cursor-not-allowed text-gray-400' : '',
          selectedFolio?.id === folio.id ? 'bg-brand-50 text-brand-700' : ''
        ]" role="option" :aria-selected="selectedFolio?.id === folio.id">
          <div class="flex flex-col">
            <div class="font-medium text-sm">
              {{ $t('Folio') }} #{{ folio.id }} - {{ folio.guestName }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ $t('Balance') }}: {{ formatCurrency(folio.balance) }} |
              {{ $t('Status') }}: {{ folio.status }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import DotSpinner from '@/components/spinner/DotSpinner.vue'
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import { searchFolios, getReservationFolios } from '@/services/foglioApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash'

interface FolioOption {
  id: number
  folioNumber: string
  guestName: string
  balance: number
  status: string
  guest?: {
    displayName?: string
    first_name?: string
    last_name?: string
  }
}

interface Props {
  lb?: string
  isRequired?: boolean
  modelValue?: number | string
  placeholder?: string
  disabled?: boolean
  customClass?: string
  reservationId?: number
  hotelId?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'select', 'change'])

const { t } = useI18n()
const serviceStore = useServiceStore()

// Refs
const selectWrapper = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isDropdownOpen = ref(false)
const isLoading = ref(false)
const searchQuery = ref('')
const folioOptions = ref<FolioOption[]>([])
const selectedFolio = ref<FolioOption | null>(null)

// Computed
const formatCurrency = computed(() => {
  return (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }
})

// Watch for modelValue changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== selectedFolio.value?.id) {
      // Find the folio in current options or fetch it
      const found = folioOptions.value.find(folio => folio.id === Number(newVal))
      if (found) {
        selectedFolio.value = found
        searchQuery.value = `${t('Folio')} #${found.id} - ${found.guestName}`
      }
    } else if (!newVal) {
      selectedFolio.value = null
      searchQuery.value = ''
    }
  },
  { immediate: true }
)
watch(
  () => folioOptions.value,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      // Find the folio in current options or fetch it
      if (props.modelValue) {
        const found = folioOptions.value.find(folio => folio.id === Number(props.modelValue))
        if (found) {
          selectedFolio.value = found
          searchQuery.value = `${t('Folio')} #${found.folioNumber} - ${found.guestName}`
        }
      }
    } else if (!newVal) {
      selectedFolio.value = null
      searchQuery.value = ''
    }
  },
  { immediate: true }
)
// Debounced search function
const debouncedSearch = debounce(async (query: string) => {
  if (query.length < 2) {
    folioOptions.value = []
    return
  }

  try {
    isLoading.value = true

    const searchParams = {
      query: query,
      hotel_id: serviceStore.serviceId!,
      reservation_id: props.reservationId
    }

    const response = await searchFolios(searchParams)

    // Transform the response data
    folioOptions.value = (response.data || []).map((folio: any) => {
      const guestName = folio.guest?.displayName ||
        `${folio.guest?.first_name || ''} ${folio.guest?.last_name || ''}`.trim() ||
        'Guest'

      return {
        id: folio.id,
        folioNumber:folio.folioNumber,
        guestName,
        balance: folio.balance || 0,
        status: folio.status || 'active',
        guest: folio.guest
      }
    })


  } catch (error) {
    console.error('Error searching folios:', error)
    folioOptions.value = []
  } finally {
    isLoading.value = false
  }
}, 300)


// Load folios for specific reservation
const loadReservationFolios = async () => {
  if (!props.reservationId) return

  try {
    isLoading.value = true
    const response = await getReservationFolios(props.reservationId)
    folioOptions.value = (response.data || []).map((folio: any) => {
      const guestName = folio.guest?.displayName ||
        `${folio.guest?.displayName}`.trim() ||
        'Guest'

      return {
        id: folio.id,
        folioNumber:folio.folioNumber,
        guestName,
        balance: folio.balance || 0,
        status: folio.status || 'active',
        guest: folio.guest
      }
    })
  } catch (error) {
    console.error('Error loading reservation folios:', error)
    folioOptions.value = []
  } finally {
    isLoading.value = false
  }
}

// Load initial folios for general search
const loadInitialFolios = async () => {
  try {
    isLoading.value = true

    const searchParams = {
      hotel_id: serviceStore.serviceId!,
      query: '',// Empty query to get recent/default folios
      reservation_id: props.reservationId
    }

    const response = await searchFolios(searchParams)

    folioOptions.value = (response.data || []).map((folio: any) => {
      const guestName = folio.guest?.displayName ||
        `${folio.guest?.first_name || ''} ${folio.guest?.last_name || ''}`.trim() ||
        'Guest'

      return {
        id: folio.id,
        guestName,
        balance: folio.balance || 0,
        status: folio.status || 'active',
        guest: folio.guest
      }
    })
  } catch (error) {
    console.error('Error loading initial folios:', error)
    folioOptions.value = []
  } finally {
    isLoading.value = false
  }
}


const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value

  // Clear selection if user is typing
  if (selectedFolio.value && searchQuery.value !== `${t('Folio')} #${selectedFolio.value.id} - ${selectedFolio.value.guestName}`) {
    selectedFolio.value = null
    //emit('update:modelValue', null)
  }

  // Open dropdown and search
  isDropdownOpen.value = true
  debouncedSearch(searchQuery.value)
}

const handleFocus = () => {
  if (!props.disabled && !isLoading.value) {
    isDropdownOpen.value = true
    // Load folios if not already loaded
    if (folioOptions.value.length === 0) {
      if (props.reservationId) {
        loadReservationFolios()
      } else {
        loadInitialFolios()
      }
    }
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isDropdownOpen.value = false
    inputRef.value?.blur()
  }
}

const selectFolio = (folio: FolioOption) => {
  if (!props.disabled && !isLoading.value) {
    selectedFolio.value = folio
    searchQuery.value = `${t('Folio')} #${folio.id} - ${folio.guestName}`
    isDropdownOpen.value = false

    emit('update:modelValue', folio.id)
    emit('select', folio)
    emit('change', folio.id)
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
  // Load folios based on context
  if (props.reservationId) {
    loadReservationFolios()
  } else {
    loadInitialFolios()
  }
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