<template>
  <ChannelManagerLayout>
    <div class="bg-gray-50">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">{{ t('loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('error') }}</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button @click="fetchData"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {{ t('retry') }}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="p-6 min-h-screen">
        <div class="max-w-full mx-auto">
          <!-- Header Controls -->
          <div class="flex flex-wrap gap-4 items-center justify-between">
            <!-- Filters -->
            <div class="flex gap-3 items-center">
              <div class="w-full">
                <SelectChannel />
              </div>

              <div class="w-full">
                <AutoCompleteSelect :options="roomTypesOptions" :defaultValue="t('room_filter')" :is-required="false"
                  :use-dropdown="true" @update:modelValue="handleRoomTypeChange" />
              </div>

              <div class="w-full">
                <AutoCompleteSelect :options="rateTypesOptions" :defaultValue="t('rate_filter')" :is-required="false"
                  :use-dropdown="true" @update:modelValue="handleRateTypeChange" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <BasicButton :label="t('saveChanges')" variant="light" :disabled="!hasChanges" :icon="CloudUpload"
                @click="saveChanges" />

              <BasicButton :label="t('resetChanges')" variant="light" :disabled="!hasChanges" :icon="RotateCw"
                @click="resetChanges" />

              <BasicButton :label="t('bulkUpdate')" variant="light" :icon="PenLine"
                @click="showBulkUpdateModal = true" />


            </div>
          </div>

          <!-- Calendar Grid -->
        </div>
      </div>
    </div>

    <!-- bulk Update -->
    <BulkUpdateModal :is-open="showBulkUpdateModal" :roomTypes="roomTypes" :rateTypes="rateTypes"
      @close="showBulkUpdateModal = false" @save="handleBulkUpdateSave" />

    <!--Override Modal-->
    <OverrideModal :show="showModal" @update:show="showModal = $event" @confirm="handleConfirm"
      @cancel="showModal = false" title="Value Override" room-type="SUita" />

    <ValueOverrideRateModal :show="showModals" room-type="Lifestyle Suite" rate-plan="Rate Plan for Lifestyle Suite A2"
      current-price="200000" :loading="isProcessing" @update:show="showModals = $event" @confirm="handleConfirm"
      @cancel="handleCancel" />
    <div class="p-4 bg-white rounded-2xl shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="p-2 text-left align-top">
                <div class="flex items-center gap-2">
                  <button @click="prevRange" class="p-2 hover:bg-gray-100 rounded" aria-label="Previous">
                    <span class="text-xl">←</span>
                  </button>
                  <InputDoubleDatePicker v-model="dateRange" :title="$t('selected_period')" :allowPastDates="false" />
                  <button @click="nextRange" class="p-2 hover:bg-gray-100 rounded" aria-label="Next">
                    <span class="text-xl">→</span>
                  </button>
                </div>
              </th>
              <th v-for="date in visibleDates" :key="date" class="p-2 text-center font-medium border-l">
                {{ formatDate(date, true) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(days, roomId) in data" :key="roomId" class="border-t hover:bg-gray-50">
              <td class="p-2 font-medium">{{ roomId.slice(0, 8) }}...</td>
              <td v-for="date in visibleDates" :key="date" class="p-2 text-center border-l">
                <div v-if="days[date]">
                  <div :class="rateColor(days[date].stop_sell)">{{ days[date].rate }}</div>
                  <div class="text-xs text-gray-500">A: {{ days[date].availability }}</div>
                </div>
                <div v-else class="text-gray-300">–</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ChannelManagerLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ChannelManagerLayout from '../../../components/layout/ChannelManagerLayout.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import SelectChannel from '@/components/forms/FormElements/SelectChannel.vue'
import { CloudUpload, RotateCw, PenLine, Settings, Copy } from 'lucide-vue-next'
import BulkUpdateModal from './InventoryModale/BulkUpdateModal.vue'
import OverrideModal from './InventoryModale/OverrideModal.vue'
import ValueOverrideRateModal from './InventoryModale/ValueOverrideRateModal.vue'

import InputDoubleDatePicker from '@/components/forms/FormElements/InputDoubleDatePicker.vue'
import { getRestriction } from '@/services/channelManagerApi'
import { watch } from 'vue'

// Types
interface RoomType {
  id: string
  name: string
}

interface RateType {
  id: string
  name: string
  code: string
  roomId: string // Lien avec le room
}

// Composables
const { t } = useI18n()
const toast = useToast()

// Refs
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedRoom = ref<string>('all')
const selectedRate = ref<string>('all')
const roomTypes = ref<RoomType[]>([])
const rateTypes = ref<RateType[]>([])
const showBulkUpdateModal = ref(false)
const hasChanges = ref(false)
const showModal = ref(false)
const showModals = ref(false)



// Computed
const roomTypesOptions = computed(() => {
  return [
    { label: t('allRooms'), value: 'all' },
    ...roomTypes.value.map((rt) => ({ label: rt.name, value: rt.id })),
  ]
})

const rateTypesOptions = computed(() => {
  return [
    { label: t('allRates'), value: 'all' },
    ...rateTypes.value.map((rt) => ({ label: rt.name, value: rt.id })),
  ]
})

// Methods
const handleRoomTypeChange = (value: string) => {
  selectedRoom.value = value
}

const handleRateTypeChange = (value: string) => {
  selectedRate.value = value
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null

  try {
    // TODO: Remplacer par vos appels API réels
    // const roomTypesResponse = await api.get('/room-types')
    // const rateTypesResponse = await api.get('/rate-types')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Données simulées - à remplacer par votre API
    roomTypes.value = [
      { id: 'standard', name: 'Standard Room' },
      { id: 'deluxe', name: 'Deluxe Room' },
      { id: 'suite', name: 'Suite' },
    ]

    rateTypes.value = [
      { id: 'a2-standard', name: 'Rate A2', code: 'A2', roomId: 'standard' },
      { id: 'a3-standard', name: 'Rate A3', code: 'A3', roomId: 'standard' },
      { id: 'a4-standard', name: 'Rate A4', code: 'A4', roomId: 'standard' },
      { id: 'a2-deluxe', name: 'Rate A2', code: 'A2', roomId: 'deluxe' },
      { id: 'a3-deluxe', name: 'Rate A3', code: 'A3', roomId: 'deluxe' },
      { id: 'a2-suite', name: 'Rate A2', code: 'A2', roomId: 'suite' },
      { id: 'a4-suite', name: 'Rate A4', code: 'A4', roomId: 'suite' },
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    toast.error(error.value)
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(t('changesSaved'))
    hasChanges.value = false
  } catch (err) {
    toast.error(t('errorSaving'))
  } finally {
    isLoading.value = false
  }
}

const resetChanges = () => {
  hasChanges.value = false
  toast.info(t('changesReset'))
}

const handleOptionSelected = (option: any) => {
  switch (option.id) {
    case 'bulk':
      showBulkUpdateModal.value = true
      break
    case 'availabilityRules':
      showModal.value = true
      break
    case 'settings':
      showModals.value = true
      break
  }
}

const handleBulkUpdateSave = (data: any) => {
  console.log('Bulk update data:', data)
  toast.success('Bulk update applied successfully')
  hasChanges.value = true
}

// Lifecycle
onMounted(() => {
  fetchData()
})

const rangeSize = 14
const restrictions = 'rate,availability,min_stay_arrival,min_stay_through,min_stay,closed_to_arrival,closed_to_departure,stop_sell,max_stay,availability_offset,max_availability'

const data = ref<Record<string, any>>({})
const useMock = true

type DayInfo = { rate: number; availability: number; stop_sell: boolean }
type RoomData = Record<string, DayInfo>
type GridData = Record<string, RoomData>

const format = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const today = new Date()
const initialEnd = new Date(today)
initialEnd.setDate(initialEnd.getDate() + (rangeSize - 1))

const dateRange = ref<{ start: string | null; end: string | null }>({
  start: format(today),
  end: format(initialEnd)
})

const date_from = computed(() => dateRange.value.start || '')
const date_to = computed(() => dateRange.value.end || '')

const visibleDates = computed(() => {
  const out: string[] = []
  if (!date_from.value || !date_to.value) return out
  const start = new Date(date_from.value)
  const end = new Date(date_to.value)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().split('T')[0])
  }
  return out
})

const buildMockData = (dates: string[]): GridData => {
  const rooms = [
    'Twin Room Bed & Breakfast Rate',
    'Twin Room Best Available Rate',
    'Double Room Bed & Breakfast Rate',
    'Double Room Best Available Rate'
  ]
  const out: GridData = {}
  rooms.forEach((room, idx) => {
    const roomDays: RoomData = {}
    dates.forEach((d, di) => {
      const stop = di % 7 === 5 || di % 11 === 3
      const rateBase = idx % 2 === 0 ? 2000 : 120
      const rate = rateBase
      const availability = idx < 2 ? 1 : 10
      roomDays[d] = { rate, availability, stop_sell: stop }
    })
    out[room] = roomDays
  })
  return out
}

// Populate mock grid data whenever date range changes
const fetchGridData = async () => {
  data.value = buildMockData(visibleDates.value)
}

/*const fetchData = async () => {
  if (!date_from.value || !date_to.value) return
  if (useMock) {
    data.value = buildMockData(visibleDates.value)
    return
  }
  try {
    const res = await getRestriction({
      date_from: date_from.value,
      date_to: date_to.value,
      restrictions
    })
    data.value = res.data?.data || buildMockData(visibleDates.value)
  } catch (e) {
    data.value = buildMockData(visibleDates.value)
  }
}*/

onMounted(fetchGridData)
watch(dateRange, fetchGridData, { deep: true })

const shiftRange = (days: number) => {
  const start = new Date(date_from.value)
  const end = new Date(date_to.value)
  start.setDate(start.getDate() + days)
  end.setDate(end.getDate() + days)
  dateRange.value = { start: format(start), end: format(end) }
}

const nextRange = () => shiftRange(rangeSize)
const prevRange = () => shiftRange(-rangeSize)

const formatDate = (dateStr: string, short = false) => {
  const date = new Date(dateStr)
  const options = short
    ? { day: '2-digit', month: 'short' }
    : { day: '2-digit', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}

const rateColor = (stopSell: boolean) => (stopSell ? 'text-red-500 font-bold' : 'text-green-600')
</script>
