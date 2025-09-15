<template>
  <div ref="selectWrapper" class="w-full">
    <label for="room_type_selector" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
      :class="isDropdownOpen ? 'text-brand-500' : 'text-gray-500'">
      {{ lb }}
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>

    <div :class="['relative font-sans', (disabled || loading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
      <DotSpinner v-if="loading"></DotSpinner>
      <input :disabled="disabled" type="text"
        class="flex justify-between dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
        :class="isDropdownOpen ? 'border-purple-500 text-gray-900' : 'border-gray-300'" :placeholder="defaultValue"
        v-model="search" @focus="openDropdown" @input="onInput" @keydown.down="onArrowDown" @keydown.up="onArrowUp"
        @keydown.enter.prevent="onEnter" />
      <input type="hidden" :required="isRequired" :value="selectedOption?.value || ''" />

      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>

      <ul v-if="isDropdownOpen && filteredOptions.length && !isLoading"
        class="custom-scrollbar absolute top-full left-0 right-0 z-50 mt-1 rounded-b-lg max-h-60 overflow-y-auto text-lg sm:text-base bg-white border-2 border-t-0 border-purple-100"
        role="listbox" :aria-expanded="isDropdownOpen" aria-hidden="false">
        <li v-for="option in filteredOptions" :key="option.value" @click="selectOption(option)" :class="[
          'px-5 py-3 cursor-pointer hover:bg-brand-100 border-b border-gray-100 last:border-b-0',
          disabled ? 'cursor-not-allowed text-gray-400' : ''
        ]" role="option" :aria-selected="selectedOption?.value === option.value">
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ option.roomTypeName }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold" :class="getAvailabilityColor(option.availableRooms)">
                {{ option.availableRooms }} 
              </div>
            </div>
          </div>
        </li>
      </ul>

      <!-- No rooms available message -->
      <div v-if="isDropdownOpen && filteredOptions.length === 0 && !isLoading && roomTypesWithAvailability.length > 0"
        class="absolute top-full left-0 right-0 z-50 mt-1 rounded-b-lg bg-white border-2 border-t-0 border-purple-100 p-4 text-center text-gray-500">
        {{ $t('noRoomsAvailable') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { getRoomTypes } from '@/services/roomTypeApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import DotSpinner from '@/components/spinner/DotSpinner.vue'
import { useServiceStore } from '../../../composables/serviceStore'

interface RoomTypeOption {
  value: string | number
  label: string
  roomTypeName: string
  shortCode: string
  availableRooms: number
  id: number
}

interface RoomType {
  id: number
  name: string
  short_code: string
  label?: string
  value?: number
  availability?: {
    total_rooms: number
    available_rooms: number
    occupied_rooms: number
    blocked_rooms: number
    period: string | null
  }
}

const props = defineProps<{
  lb?: string
  defaultValue?: string
  isRequired?: boolean
  modelValue?: string | number
  disabled?: boolean
  startDate?: string
  endDate?: string
}>()

const emit = defineEmits(['update:modelValue', 'select', 'change'])

const { t } = useI18n()
const toast = useToast()

const isDropdownOpen = ref(false)
const selectWrapper = ref<HTMLElement | null>(null)
const search = ref('')
const roomTypes = ref<RoomType[]>([])
const loading = ref(false)
const isLoading =ref(false);
const selectedOption = ref<any>()
const roomTypesWithAvailability = ref<any>([])
const filteredOptions = computed(() => {
  if (!search.value) {
    return roomTypesWithAvailability.value
  }

  return roomTypesWithAvailability.value.filter((option:any) => {
    const roomType = roomTypes.value.find(rt => rt.id === option.value)
    if (!roomType) return false

    return roomType.name.toLowerCase().includes(search.value.toLowerCase()) ||
      roomType.short_code.toLowerCase().includes(search.value.toLowerCase())
  })
})

const getAvailabilityColor = (availableRooms: number): string => {
  if (availableRooms === 0) return 'text-red-500'
  if (availableRooms <= 3) return 'text-orange-500'
  return 'text-green-500'
}

const fetchRoomTypesWithAvailability = async () => {


  try {
    isLoading.value = true

    const params: any = {}

    if (props.startDate) {
      params.startdate = props.startDate
    }
    if (props.endDate) {
      params.enddate = props.endDate
    }

    const roomTypesResponse = await getRoomTypes(useServiceStore().serviceId!)
    const roomTypes: RoomType[] = roomTypesResponse.data?.data?.data || []

    console.log('roomTypesResponse available',roomTypesResponse)

    // Process room types with availability data already included
    const roomTypesWithAvail: RoomTypeOption[] = roomTypes.map((roomType) => {
      const availableRooms = roomType.availability?.available_rooms || 0

      return {
        value: roomType.id,
        label: ` (${availableRooms} ${t('available')})`,
        roomTypeName: roomType.name,
        shortCode: roomType.short_code,
        availableRooms: availableRooms,
        id: roomType.id
      }
    })

    roomTypesWithAvailability.value = roomTypesWithAvail
  } catch (error) {
    console.error('Error fetching room types with availability:', error)
    toast.error(t('toast.errorLoadingRoomTypes'))
  } finally {
    isLoading.value = false
  }
}



const selectedRoomType = computed(() => {
  return roomTypes.value.find(rt => rt.id === props.modelValue) || null
})

watch(
  () => props.modelValue,
  (newVal) => {
    const roomType = roomTypes.value.find(rt => rt.id === newVal)
    search.value = roomType?.name || ''
  },
  { immediate: true }
)

watch(
  () => [props.startDate, props.endDate],
  () => {
    if (props.startDate && props.endDate) {
      fetchRoomTypesWithAvailability()
    }
  },
  { immediate: true }
)

function openDropdown() {
  if (!props.disabled && !loading.value) {
    isDropdownOpen.value = true
    if (!roomTypes.value.length) {
      fetchRoomTypesWithAvailability()
    }
  }
}

function onInput() {
  isDropdownOpen.value = true
}

function selectOption(option: any) {
  if (!props.disabled && !loading.value) {
    const roomType = roomTypes.value.find(rt => rt.id === option.value)
    if (roomType) {
      search.value = roomType.name
      isDropdownOpen.value = false
      emit('update:modelValue', option.value)
    }
  }
}

function handleClickOutside(event: MouseEvent) {
  if (
    selectWrapper.value &&
    !selectWrapper.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Initial fetch if dates are provided
  if (props.startDate && props.endDate) {
    fetchRoomTypesWithAvailability
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Optional: Keyboard navigation
function onArrowDown() { }
function onArrowUp() { }
function onEnter() { }
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