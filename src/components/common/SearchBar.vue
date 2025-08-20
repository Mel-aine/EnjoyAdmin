<template>
  <div class="relative w-full max-w-md">
    <div class="relative">
      <button class="absolute -translate-y-1/2 left-4 top-1/2">
        <svg class="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
            fill="" />
        </svg>
      </button>

      <input v-model="searchQuery" type="text" :placeholder="t('Searchortypecommand')"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900  dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
        @input="handleInput" @focus="showDropdown = true" @blur="handleBlur" @keydown="handleKeydown" />

      <!-- Loading Spinner -->
      <div v-if="isLoading"
        class="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
        </svg>
      </div>

      <!-- Command Key Button -->
      <button v-else
        class="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
        <span>⌘</span>
        <span>K</span>
      </button>
    </div>

    <!-- Autocomplete Dropdown -->
    <div v-if="showDropdown && (searchResults.length > 0 || (searchQuery && !isLoading && searchResults.length === 0))"
      class="fixed z-999 min-w-4xl mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
      <!-- Search Results -->
      <div v-if="searchResults.length > 0">
        <div v-for="(result, index) in searchResults" :key="result.id" :class="[
          'px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0',
          { 'bg-gray-50 dark:bg-gray-700': index === selectedIndex }
        ]" @click="selectResult(result)">
          <div class="flex justify-between items-center">
            <!-- Left side: Guest info and details -->
            <div class="flex-3 flex">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span class="text-purple-600 capitalize dark:text-purple-400 font-semibold text-sm">
                    {{ (result.guest?.firstName || 'G').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ result.guest?.displayName }} {{ result.guest?.lastName || t('guest') }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ result.reservationNumber || `#${result.id}` }}
                  </div>
                </div>
              </div>

              <!-- Dates and room info -->
              <div class="grid grid-cols-8 px-4">
                <div class="flex col-span-3 items-center p-2 flex-col bg-gray-100">
                  <span>{{ formatDate(result.arrivedDate) }}</span>
                  <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {{ formatTime(result.arrivedDate) }}
                  </span>
                </div>
                <div class="flex col-span-2 items-center p-2 flex-col bg-gray-300">
                  <span>{{ result.nights ?? result.numberOfNights }}</span>
                  <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {{ t('nights') }}
                  </span>
                </div>
                <div class="flex items-center col-span-3 p-2 flex-col bg-gray-100">
                  <span>{{ formatDate(result.departDate) }}</span>
                  <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {{ formatTime(result.departDate) }}
                  </span>
                </div>

              </div>
              <div class="flex gap-2">
                <div class="flex items-center">
                  <Adult class="w-6 h-10" /><span class="pt-2 text-sm">{{ result.adults }}</span>
                </div>
                <div class="flex items-center">
                  <Child class="w-5 h-10" /><span class="pt-2 text-sm">{{ result.child ?? 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Right side: Status and reservation number -->
            <div class="flex-1 text-right flex items-end gap-1">
              <div :class="[
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                getStatusColor(result.status)
              ]">
                {{ t(result.status) }}
              </div>
              <div class="text-sm font-medium flex flex-col text-gray-900 dark:text-white">
                <span>{{ t('resNo') }}</span>
                <span class="text-xs">#{{ result.reservationNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && !isLoading" class="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
        {{ t('noReservationsFound') }}
      </div>
    </div>
  </div>

  <!-- Reservation Modal -->
  <template v-if="isModalOpen && selectedReservation">
    <ReservationRigthModal :is-open="isModalOpen" :title="selectedReservation.reservationNumber!"
      :reservation-data="selectedReservation" @close="closeModal" />
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { filterReservation } from '@/services/hotelApi'
import type { FitlterItem, ReservationDetails } from '@/utils/models'
import ReservationRigthModal from '@/components/reservations/ReservationRigthModal.vue'
import { formatTime } from '../utilities/UtilitiesFunction'
import Adult from '../../icons/Adult.vue'
import Child from '../../icons/Child.vue'

interface Props {
  placeholder?: string
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'select', reservation: ReservationDetails): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: ''
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const serviceStore = useServiceStore()
const searchQuery = ref(props.modelValue || '')
const searchResults = ref<ReservationDetails[]>([])
const isLoading = ref(false)
const showDropdown = ref(false)
const isModalOpen = ref(false)
const selectedReservation = ref<ReservationDetails | null>(null)
const selectedIndex = ref(-1)
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue || ''
})

// Watch searchQuery and emit updates
watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = () => {
  selectedIndex.value = -1

  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Debounce search
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim().length >= 2) {
      performSearch()
    } else {
      searchResults.value = []
      showDropdown.value = false
    }
  }, 300)
}

const performSearch = async () => {
  if (!serviceStore.serviceId) {
    console.warn('No service ID available for search')
    return
  }

  isLoading.value = true

  try {
    const filter: FitlterItem = {
      searchText: searchQuery.value.trim(),
      status: '',
      roomType: '',
      checkInDate: '',
      checkOutDate: ''
    }

    const response = await filterReservation(serviceStore.serviceId, filter)
    searchResults.value = response.data.reservations || []
    showDropdown.value = true
  } catch (error) {
    console.error('Error searching reservations:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const selectResult = (result: ReservationDetails) => {
  //searchQuery.value = result.reservationNumber || `#${result.id}`
  showDropdown.value = false
  selectedIndex.value = -1
  selectedReservation.value = {...result, reservation_id:result.id}
  isModalOpen.value = true,

    console.log('open reservation', result)
  emit('select', result)
}

const closeModal = () => {
  isModalOpen.value = false
  selectedReservation.value = null
}

const handleModalSave = (data: any) => {
  // Handle save action here
  console.log('Modal save:', data)
  closeModal()
}

const handleBlur = () => {
  // Delay hiding dropdown to allow click events
  setTimeout(() => {
    showDropdown.value = false
    selectedIndex.value = -1
  }, 150)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value || searchResults.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < searchResults.value.length) {
        selectResult(searchResults.value[selectedIndex.value])
      }
      break
    case 'Escape':
      showDropdown.value = false
      selectedIndex.value = -1
      break
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'checked-in': 'bg-blue-100 text-blue-800',
    'checked-out': 'bg-gray-100 text-gray-800',
    'no-show': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

// Cleanup timeout on unmount
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>