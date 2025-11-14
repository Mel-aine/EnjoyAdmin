<template>
  <div ref="selectWrapper" class="w-full">
    <label v-if="!hideLabel" for="city_ledger_select"
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="isDropdownOpen ? 'text-brand-500' : 'text-gray-500'">
      {{ lb || $t('City Ledger') }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div :class="['relative font-sans', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
      <!-- Input field for autocomplete -->
      <input ref="inputRef" v-model="searchQuery" type="text" :placeholder="placeholder || $t('Search city ledger...')"
        :disabled="disabled"
        class="flex justify-between dark:bg-dark-900 h-11 w-full truncate rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
        :class="[isDropdownOpen ? 'border-purple-500 text-gray-900' : 'border-black/50', customClass]"
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
      <input type="hidden" :required="isRequired" :value="selectedCityLedger?.id || ''" />

      <!-- Dropdown list -->
      <ul v-if="isDropdownOpen" ref="dropdownList" @scroll="onScroll"
        class="custom-scrollbar  absolute top-full left-0  z-999 mt-1 rounded-b-lg max-h-60 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        role="listbox" :aria-expanded="isDropdownOpen" aria-hidden="false">

        <!-- No results message -->
        <li v-if="cityLedgerOptions.length === 0 && searchQuery.length > 0"
          class="px-5 py-3 text-gray-500 dark:text-gray-400 text-center italic">
          {{ $t('No city ledger found') }}
        </li>

        <!-- Initial message when no search -->
        <li v-else-if="cityLedgerOptions.length === 0 && searchQuery.length === 0"
          class="px-5 py-3 text-gray-500 dark:text-gray-400 text-center italic">
          {{ $t('Start typing to search city ledger...') }}
        </li>

        <!-- City ledger options -->
        <li v-for="ledger in cityLedgerOptions" :key="ledger.id" @click="selectCityLedger(ledger)" :class="[
          'px-5 py-3 cursor-pointer hover:bg-brand-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0',
          disabled ? 'cursor-not-allowed text-gray-400' : '',
          selectedCityLedger?.id === ledger.id ? 'bg-brand-50 text-brand-700 dark:bg-blue-900 dark:text-blue-200' : ''
        ]" role="option" :aria-selected="selectedCityLedger?.id === ledger.id">
          <div class="flex flex-col">
            <div class="font-medium text-sm">
              {{ ledger.name }}
            </div>
            <!--  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('Contact') }}: {{ ledger.contactPerson || 'N/A' }} |
            </div>
            <div v-if="ledger.balance !== undefined" class="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {{ $t('Balance') }}: {{ formatBalance(ledger.balance, ledger.currency) }}
            </div>-->
          </div>
        </li>
        <!-- Footer showing loading state and total -->
        <li
          class="px-5 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <span>
            {{ $t('Showing') }} {{ cityLedgerOptions.length }} {{ $t('of') }} {{ totalCount }}
          </span>
          <span v-if="isSearching" class="flex items-center gap-2">
            <DotSpinner size="sm" /> {{ $t('Searching...') }}
          </span>
          <span v-else-if="isLoadingMore" class="flex items-center gap-2">
            <DotSpinner size="sm" /> {{ $t('Loading more...') }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import DotSpinner from '@/components/spinner/DotSpinner.vue'
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { getCityLedger } from '@/services/companyApi'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash'
import { useServiceStore } from '@/composables/serviceStore'

interface CityLedgerOption {
  id: number
  name: string
  contactPerson?: string
  contactTitle?: string
  country?: string
  email?: string
  contact?: string
  status?: string
  balance?: number
  currency?: string
  address?: string
  notes?: string
  registrationNumber?: string
  taxId?: string
  shortCode?: string
}

interface Props {
  lb?: string
  isRequired?: boolean
  modelValue?: number | string | null
  placeholder?: string
  disabled?: boolean
  customClass?: string
  hotelId?: number
  hideLabel?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'select', 'change'])

const { t } = useI18n()
const serviceStore = useServiceStore()

// Refs
const selectWrapper = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const dropdownList = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const isSearching = ref(false)
const searchQuery = ref('')
const cityLedgerOptions = ref<CityLedgerOption[]>([])
const selectedCityLedger = ref<CityLedgerOption | null>(null)
const allCityLedgers = ref<CityLedgerOption[]>([])
const page = ref(1)
const limit = ref(20)
const totalCount = ref(0)
const lastPage = ref(1)

// Computed
const formatBalance = computed(() => {
  return (balance: number, currency: string = 'XAF') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(balance || 0)
  }
})


// Remote search debounce: reset and fetch first page
const debouncedRemoteSearch = debounce(async () => {
  // Only trigger remote search when at least two words are entered
  const words = (searchQuery.value || '').trim().split(/\s+/).filter(Boolean)
  await fetchCityLedgers(true)
}, 300)

// Fetch city ledgers with pagination and remote search
const fetchCityLedgers = async (reset = false) => {
  try {
    if (reset) {
      page.value = 1
      allCityLedgers.value = []
      cityLedgerOptions.value = []
    }

    const words = (searchQuery.value || '').trim().split(/\s+/).filter(Boolean)
    const isSearchReset = reset && words.length >= 2
    const loadingTarget = reset ? (isSearchReset ? isSearching : isLoading) : isLoadingMore
    loadingTarget.value = true
    const hotelId = serviceStore.serviceId!
    const filter :any = {
      page: page.value,
      limit: limit.value,
      searchText: searchQuery.value?.trim() || undefined,
    }
    if (props.modelValue) {
      filter.companyId = props.modelValue
    }
    const response = await getCityLedger(hotelId, filter)

    // Extract data and meta safely
    const payloadData = Array.isArray(response?.data)
      ? response?.data
      : Array.isArray(response?.data?.data)
        ? response?.data?.data
        : Array.isArray(response)
          ? response
          : []
    const meta = response?.meta || response?.data?.meta || null

    // Transform entries
    const ledgers = payloadData.map((ledger: any) => ({
      id: ledger.id,
      name: ledger.companyName,
      contactPerson: ledger.contactPersonName,
      contactTitle: ledger.contactPersonTitle,
      country: ledger.country,
      shortCode: ledger.companyCode,
    }))

    allCityLedgers.value = [...allCityLedgers.value, ...ledgers]
    cityLedgerOptions.value = allCityLedgers.value

    if (meta) {
      totalCount.value = Number(meta.total) || totalCount.value
      lastPage.value = Number(meta.lastPage) || lastPage.value
    } else {
      // Fallback if meta absent
      totalCount.value = allCityLedgers.value.length
      lastPage.value = payloadData.length < limit.value ? page.value : page.value + 1
    }
  } catch (error) {
    console.error('Error loading city ledgers:', error)
    if (reset) {
      allCityLedgers.value = []
      cityLedgerOptions.value = []
      totalCount.value = 0
      lastPage.value = 1
    }
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
    isSearching.value = false
  }
}
// Watch for modelValue changes
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal && newVal !== selectedCityLedger.value?.id) {
      // Ensure ledgers are loaded first
      if (allCityLedgers.value.length === 0) {
        await fetchCityLedgers(true)
      }

      // Find the ledger in current options or all ledgers
      const found = cityLedgerOptions.value.find(ledger => ledger.id === Number(newVal)) ||
        allCityLedgers.value.find(ledger => ledger.id === Number(newVal))
      if (found) {
        selectedCityLedger.value = found
        searchQuery.value = found.name || ''
        // Ensure options reflect current loaded list
        cityLedgerOptions.value = allCityLedgers.value
        // Auto-emit selection so parents relying on @select get the object
        emit('select', found)
        emit('change', found.id)
      }
    } else if (!newVal) {
      selectedCityLedger.value = null
      searchQuery.value = ''
      // Reset to show all options when no selection
      cityLedgerOptions.value = allCityLedgers.value
    }
  },
  { immediate: true }
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value

  // Clear selection if user is typing
  if (selectedCityLedger.value && searchQuery.value !== selectedCityLedger.value.name) {
    selectedCityLedger.value = null
  }

  // Open dropdown and search
  isDropdownOpen.value = true
  debouncedRemoteSearch()
}

const handleFocus = () => {
  if (!props.disabled) {
    isDropdownOpen.value = true
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isDropdownOpen.value = false
    inputRef.value?.blur()
  }
}

const selectCityLedger = (ledger: CityLedgerOption) => {
  if (!props.disabled) {
    selectedCityLedger.value = ledger
    searchQuery.value = ledger.name || ''
    isDropdownOpen.value = false

    emit('update:modelValue', ledger.id)
    emit('select', ledger)
    emit('change', ledger.id)
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

// Infinite scroll handler
const onScroll = (event: Event) => {
  const target = event.target as HTMLElement
  const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10
  const hasMore = page.value < lastPage.value
  if (nearBottom && hasMore && !isLoadingMore.value) {
    page.value += 1
    fetchCityLedgers(false)
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Load all ledgers on mount
  fetchCityLedgers(true)
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
