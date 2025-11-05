<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="overflow-hidden">
      <!-- Mini Calendar Date Picker -->
      <div
        v-if="showDatePicker"
        class="absolute z-50 mt-2 ml-4 bg-white border rounded-lg shadow-lg p-4"
      >
        <div class="text-sm font-semibold text-gray-900 mb-3 text-center">
          {{ miniCalendarMonth }}
        </div>
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
            :key="day"
            class="text-xs text-gray-600 text-center font-medium p-1"
          >
            {{ day }}
          </div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="day in miniCalendarDays"
            :key="day.date"
            @click="!isPastDate(day.date) && selectDate(day)"
            :disabled="isPastDate(day.date)"
            :class="[
              'text-sm p-2 rounded hover:bg-gray-100 transition-colors',
              day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
              day.isToday ? 'bg-purple-500 text-white hover:bg-purple-600' : '',
              !day.isCurrentMonth ? 'opacity-50' : '',
              isPastDate(day.date) ? 'opacity-30 cursor-not-allowed' : '',
            ]"
          >
            {{ day.day }}
          </button>
        </div>
      </div>

      <!-- Main Calendar Table -->
      <div class="overflow-x-auto" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading restrictions...</p>
          </div>
        </div>

        <!-- Calendar Table -->
        <table v-else class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th>
                <div class="flex items-center justify-between p-4">
                  <button
                    @click="previousMonth"
                    :disabled="isPreviousDisabled"
                    :class="[
                      'p-2 rounded transition-colors',
                      isPreviousDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100',
                    ]"
                  >
                    <svg
                      class="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div class="flex items-center gap-3">
                    <h2 class="text-lg font-semibold text-gray-900">
                      {{ currentMonthDisplay }}
                    </h2>
                    <button
                      ref="selectWrapper"
                      @click="showDatePicker = !showDatePicker"
                      class="p-2 hover:bg-gray-100 rounded transition-colors select-none"
                    >
                      <svg
                        class="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  <button
                    @click="nextMonth"
                    class="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <svg
                      class="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </th>
              <th></th>
              <th
                v-for="date in visibleDates"
                :key="date.date"
                class="px-2 py-3 text-center min-w-[80px]"
              >
                <div class="text-xs text-gray-600">{{ date.dayName }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ date.dayNum }}</div>
                <div class="text-xs text-gray-500">{{ date.month }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Boucle sur chaque groupe de RoomType -->
            <template v-for="group in groupedRoomRows" :key="group.roomTypeId">
              <!-- Ligne du ROOM TYPE (AVL uniquement) -->
              <tr class="border-b border-gray-300 hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-bold text-gray-900 sticky left-0 bg-white z-10">
                  {{ group.roomTypeName }}
                </td>

                <!-- Label AVL -->
                <td class="px-4 py-3 text-sm font-medium text-gray-900 bg-white">AVL</td>

                <!-- Valeurs AVL -->
                <td
                  v-for="date in visibleDates"
                  :key="date.date"
                  :class="[
                    'px-2 py-3 text-center cursor-pointer select-none transition-colors hover:bg-orange-100',
                    isCellSelected(group.roomTypeRow.id, date.date) ? 'bg-purple-100 border-2 border-purple-400' : '',
                    isPastDate(date.date) ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
                  ]"
                  @mousedown="!isPastDate(date.date) && handleCellMouseDown(group.roomTypeRow, date.date)"
                  @mouseenter="!isPastDate(date.date) && handleCellMouseEnter(group.roomTypeRow, date.date)"
                >
                  <div class="inline-flex items-center justify-center min-w-[50px] px-3 py-1.5 text-sm font-medium rounded bg-red-500 text-white">
                    {{ group.roomTypeRow.values?.[date.date] || 0 }}
                  </div>
                </td>
              </tr>

              <!-- Lignes des RATE PLANS -->
              <template v-for="ratePlan in group.ratePlans" :key="ratePlan.id">
                <tr
                  v-for="(row, index) in ratePlan.restrictions"
                  :key="row.id"
                  class="hover:bg-gray-50 border-b border-gray-200"
                >
                  <!-- Nom du Rate Plan affiché une seule fois -->
                  <td
                    v-if="index === 0"
                    :rowspan="ratePlan.restrictions.length"
                    class="px-4 py-3 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10 align-top"
                  >
                    {{ ratePlan.name }}
                  </td>

                  <!-- Label de restriction + icône si RATE -->
                  <td
                    class="px-4 py-3 text-sm font-medium text-gray-900 bg-white"
                  >
                    <div class="flex items-center space-x-2 relative">
                      <div v-if="row.label === 'RATE'" class="relative group">
                        <UserRound class="w-4 h-4 inline-flex cursor-pointer text-gray-600" />
                        <!-- Tooltip Occupancy -->
                        <div
                          class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max max-w-xs px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                        >
                          Occupancy
                        </div>
                      </div>
                      <span>{{ row.label }}</span>
                    </div>
                  </td>

                  <!-- Valeurs de la restriction -->
                  <td
                    v-for="date in visibleDates"
                    :key="date.date"
                    :class="[
                      'px-2 py-3 text-center cursor-pointer select-none transition-colors hover:bg-orange-100',
                      isCellSelected(row.id, date.date)
                        ? 'bg-purple-100 border-2 border-purple-400'
                        : '',
                      isPastDate(date.date)
                        ? 'opacity-40 cursor-not-allowed pointer-events-none'
                        : '',
                    ]"
                    @mousedown="!isPastDate(date.date) && handleCellMouseDown(row, date.date)"
                    @mouseenter="!isPastDate(date.date) && handleCellMouseEnter(row, date.date)"
                  >
                    <div
                      :class="[
                        'inline-flex items-center justify-center min-w-[50px] px-3 py-1.5 text-sm font-medium rounded',
                        row.label === 'RATE' ? 'bg-pink-100 text-gray-900' : 'bg-white text-gray-900',
                      ]"
                    >
                      {{ formatCellValue(row.values[date.date], row.label) }}
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Value Override Modal -->
    <ValueOverrideRateModal
      :is-open="showModal"
      :selected-range="selectedRange"
      :modal-type="modalType"
      :loading="loading"
      @close="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { UserRound } from 'lucide-vue-next'
import ValueOverrideRateModal from './InventoryModale/ValueOverrideRateModal.vue'
import { getRestrictions } from '@/services/channelManagerApi'
import { useServiceStore } from '@/composables/serviceStore'

interface RoomRow {
  id: string
  name: string
  type: 'AVL' | 'RATE'
  label: string
  values: Record<string, number>
  roomTypeId: string
  roomTypeName: string
  ratePlanId?: string
  ratePlanName?: string
  occupancy?: number
}

interface VisibleDate {
  date: string
  dayName: string
  dayNum: string
  month: string
}

interface SelectedRange {
  row: RoomRow
  startDate: string
  endDate: string
  roomType: {
    id: string
    name: string
  }
}

interface ConfirmData {
  dateFrom: string | undefined
  dateTo: string | undefined
  restriction: string
  value: boolean | string
}

interface MiniCalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

interface RatePlan {
  id: string
  name: string
  restrictions: RoomRow[]
}

interface GroupedRoom {
  roomTypeId: string
  roomTypeName: string
  roomTypeRow: RoomRow
  ratePlans: RatePlan[]
}

interface RoomType {
  id: string
  name: string
}

interface RateType {
  id: string
  name: string
  roomId: string
}

/* --- REFS --- */
const selectWrapper = ref<HTMLElement | null>(null)
const currentDate = ref(new Date(2025, 10, 5))
const currentService = useServiceStore().getCurrentService
const today = new Date()
today.setHours(0, 0, 0, 0)

const showDatePicker = ref(false)
const selectedRange = ref<SelectedRange | null>(null)
const isSelecting = ref(false)
const showModal = ref(false)
const modalType = ref<'AVL' | 'RATE'>('AVL')
const loading = ref(false)
const allRoomRows = ref<RoomRow[]>([])

const selectedRestrictions = ref<string[]>(['Rate And Availability'])
const roomTypes = ref<RoomType[]>([])
const rateTypes = ref<RateType[]>([])

/* --- MAPPINGS --- */
const restrictionMapping: Record<string, string> = {
  'Availability Offset': 'AVO',
  'Availability Per Rate': 'AVL',
  'Closed To Arrival': 'CTA',
  'Closed To Departure': 'CTD',
  'Max Availability': 'MAL',
  'Max Stay': 'MXS',
  'Min Stay Arrival': 'MSA',
  'Min Stay Through': 'MST',
  Rate: 'rate',
  'Stop Sell': 'SS',
  Availability: 'AVL',
}

const restrictionApiMapping: Record<string, string> = {
  'Rate And Availability': 'rate',
  'Only Availability': 'availability',
  'All Restrictions': 'availability_offset,max_availability,max_stay,min_stay_arrival,min_stay_through,closed_to_arrival,closed_to_departure,stop_sell,rate',
  'Availability Offset': 'availability_offset',
  'Availability Per Rate': 'availability',
  'Closed To Arrival': 'closed_to_arrival',
  'Closed To Departure': 'closed_to_departure',
  'Max Availability': 'max_availability',
  'Max Stay': 'max_stay',
  'Min Stay Arrival': 'min_stay_arrival',
  'Min Stay Through': 'min_stay_through',
  'Rate': 'rate',
  'Stop Sell': 'stop_sell',
  'Availability': 'availability',
}

/* --- TRANSFORMATION DES DONNÉES API --- */
const transformApiDataToRoomRows = (apiData: any): RoomRow[] => {
  const rows: RoomRow[] = []
    console.log('transformApiDataToRoomRows - apiData:', apiData)
  console.log('transformApiDataToRoomRows - roomTypes:', roomTypes.value)
  console.log('transformApiDataToRoomRows - rateTypes:', rateTypes.value)


  // Parcourir chaque rate plan ID
  Object.keys(apiData).forEach((ratePlanId) => {
    const ratePlan = rateTypes.value.find(rt => rt.id === ratePlanId)
    if (!ratePlan) return

    const roomType = roomTypes.value.find(rm => rm.id === ratePlan.roomId)
    if (!roomType) return

    const ratePlanData = apiData[ratePlanId]

    // Créer la ligne RATE avec les valeurs de l'API
    const rateValues: Record<string, number> = {}
    Object.keys(ratePlanData).forEach(date => {
      rateValues[date] = parseInt(ratePlanData[date].rate) || 0
    })

    rows.push({
      id: `${ratePlanId}-rate`,
      name: ratePlan.name,
      type: 'RATE',
      label: 'RATE',
      values: rateValues,
      roomTypeId: roomType.id,
      roomTypeName: roomType.name,
      ratePlanId: ratePlanId,
      ratePlanName: ratePlan.name,
    })

    // Ajouter d'autres restrictions si nécessaire
    // Pour l'instant, on ne gère que le rate
  })

  return rows
}

/* --- FETCH RESTRICTIONS --- */
const fetchRestrictions = async () => {
  console.log('🔵 fetchRestrictions STARTED')
  console.log('roomTypes:', roomTypes.value)
  console.log('rateTypes:', rateTypes.value)

  loading.value = true

  try {
    const propertyId = currentService.channexPropertyId
    console.log('propertyId:', propertyId)

    if (!visibleDates.value.length) {
      console.log('❌ No visible dates')
      return
    }

    const restrictionsParam = selectedRestrictions.value
      .map(filter => restrictionApiMapping[filter])
      .filter(Boolean)
      .join(',')

    const params = {
      date_from: visibleDates.value[0].date,
      date_to: visibleDates.value[visibleDates.value.length - 1].date,
      restrictions: restrictionsParam || 'rate',
    }

    console.log('📤 Fetching with params:', params)

    const response = await getRestrictions(propertyId, params)

    console.log('📥 API response:', response)
    console.log('📥 API response.data:', response.data)

    if (response.data) {
      console.log('✅ Calling transformApiDataToRoomRows')
      allRoomRows.value = transformApiDataToRoomRows(response.data)
      console.log('✅ allRoomRows:', allRoomRows.value)
    } else {
      console.log('❌ response.data is empty')
    }
  } catch (err: any) {
    console.error('❌ Fetch error:', err.response?.data || err.message)
  } finally {
    loading.value = false
    console.log('🔵 fetchRestrictions FINISHED')
  }
}

/* --- FILTRAGE --- */
const roomRows = computed(() => {
  if (selectedRestrictions.value.length === 0) return allRoomRows.value

  const allowedLabels = selectedRestrictions.value.map((r) => restrictionMapping[r]).filter(Boolean)

  // Si "Rate And Availability" ou les deux sont sélectionnés
  if (
    selectedRestrictions.value.includes('Rate And Availability') ||
    (selectedRestrictions.value.includes('Rate') && selectedRestrictions.value.includes('Availability'))
  ) {
    return allRoomRows.value
  }

  // Si seulement "Only Availability"
  if (selectedRestrictions.value.includes('Only Availability') || selectedRestrictions.value.includes('Availability')) {
    return allRoomRows.value.filter((row) => row.label === 'AVL')
  }

  // Si "All Restrictions"
  if (selectedRestrictions.value.includes('All Restrictions')) {
    return allRoomRows.value
  }

  // Si seulement "Rate"
  if (selectedRestrictions.value.includes('Rate') && !selectedRestrictions.value.includes('Availability')) {
    return allRoomRows.value.filter((row) => row.type === 'RATE' || row.label === 'AVL')
  }

  // Filtrage par labels individuels
  return allRoomRows.value.filter((row) => allowedLabels.includes(row.label))
})

/* --- GROUPEMENT PAR ROOMTYPE ET RATEPLAN --- */
const groupedRoomRows = computed(() => {
  const groups: Record<string, GroupedRoom> = {}

  roomRows.value.forEach((row) => {
    // Initialiser le groupe du RoomType si nécessaire
    if (!groups[row.roomTypeId]) {
      groups[row.roomTypeId] = {
        roomTypeId: row.roomTypeId,
        roomTypeName: row.roomTypeName,
        roomTypeRow: {
          id: `${row.roomTypeId}-avl`,
          name: row.roomTypeName,
          type: 'AVL',
          label: 'AVL',
          values: {},
          roomTypeId: row.roomTypeId,
          roomTypeName: row.roomTypeName,
        },
        ratePlans: [],
      }
    }

    // Si c'est la ligne AVL du RoomType
    if (row.type === 'AVL') {
      groups[row.roomTypeId].roomTypeRow = row
    }

    // Si c'est une restriction d'un RatePlan
    if (row.type === 'RATE' && row.ratePlanId) {
      // Chercher si le RatePlan existe déjà dans le groupe
      let ratePlan = groups[row.roomTypeId].ratePlans.find((rp) => rp.id === row.ratePlanId)

      // Si le RatePlan n'existe pas, le créer
      if (!ratePlan) {
        ratePlan = {
          id: row.ratePlanId,
          name: row.ratePlanName || 'Unknown Rate Plan',
          restrictions: [],
        }
        groups[row.roomTypeId].ratePlans.push(ratePlan)
      }

      // Ajouter la restriction au RatePlan
      ratePlan.restrictions.push(row)
    }
  })

  return Object.values(groups)
})

/* --- DATES VISIBLES --- */
function toLocalDateString(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const visibleDates = computed(() => {
  const dates: VisibleDate[] = []
  const startDate = new Date(currentDate.value)

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push({
      date: toLocalDateString(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    })
  }

  return dates
})

/* --- FORMAT CELL VALUE --- */
const formatCellValue = (value: any, label: string): string => {
  if (value === undefined || value === null) return '0'

  // Pour les rates, formater avec séparateur de milliers
  if (label === 'RATE') {
    return new Intl.NumberFormat('en-US').format(value)
  }

  // Pour les autres valeurs
  return String(value)
}

/* --- SÉLECTION --- */
function isPastDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return date < now
}

const handleCellMouseDown = (row: RoomRow, date: string) => {
  isSelecting.value = true
  selectedRange.value = {
    row,
    startDate: date,
    endDate: date,
    roomType: { id: row.roomTypeId, name: row.roomTypeName },
  }
}

const handleCellMouseEnter = (row: RoomRow, date: string) => {
  if (isSelecting.value && selectedRange.value && selectedRange.value.row.id === row.id) {
    selectedRange.value.endDate = date
  }
}

const handleMouseUp = () => {
  if (isSelecting.value && selectedRange.value) {
    isSelecting.value = false
    modalType.value = selectedRange.value.row.type
    showModal.value = true
  }
}

const isCellSelected = (rowId: string, date: string): boolean => {
  if (!selectedRange.value || selectedRange.value.row.id !== rowId) return false

  const dateIndex = visibleDates.value.findIndex((d) => d.date === date)
  const startIndex = visibleDates.value.findIndex((d) => d.date === selectedRange.value!.startDate)
  const endIndex = visibleDates.value.findIndex((d) => d.date === selectedRange.value!.endDate)

  const min = Math.min(startIndex, endIndex)
  const max = Math.max(startIndex, endIndex)
  return dateIndex >= min && dateIndex <= max
}

/* --- MODALE --- */
const handleConfirm = (data: ConfirmData) => {
  console.log('Confirmed:', data)
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showModal.value = false
    selectedRange.value = null
    alert('Values updated successfully!')
  }, 1000)
}

const handleCancel = () => {
  showModal.value = false
  selectedRange.value = null
}

const handleRestrictionChange = (restrictions: string[]) => {
  selectedRestrictions.value = restrictions
}


const setRoomAndRateTypes = (rooms: RoomType[], rates: RateType[]) => {
  console.log('setRoomAndRateTypes called with:', { rooms, rates })
  roomTypes.value = rooms
  rateTypes.value = rates


  if (rooms.length > 0 && rates.length > 0) {
    console.log('Calling fetchRestrictions...')
    fetchRestrictions()
  }
}

// Remplacez le watcher à la fin
watch(currentDate, () => {
  if (roomTypes.value.length > 0 && rateTypes.value.length > 0) {
    fetchRestrictions()
  }
})

watch(selectedRestrictions, () => {
  if (roomTypes.value.length > 0 && rateTypes.value.length > 0) {
    fetchRestrictions()
  }
}, { deep: true })

const currentMonthDisplay = computed(() => {
  const date = currentDate.value
  return `${String(date.getDate()).padStart(2, '0')} ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}`
})

const miniCalendarMonth = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const miniCalendarDays = computed(() => {
  const days: MiniCalendarDay[] = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDay.getDay()

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    days.push({
      date: date.toISOString().split('T')[0],
      day,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  const todayStr = new Date().toISOString().split('T')[0]
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    const dateStr = toLocalDateString(date)
    days.push({
      date: dateStr,
      day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    })
  }

  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      date: toLocalDateString(date),
      day,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  return days
})

const selectDate = (day: MiniCalendarDay) => {
  const selectedDate = new Date(day.date)
  currentDate.value = selectedDate
  showDatePicker.value = false
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 14)

  if (newDate < today) {
    return
  }

  currentDate.value = newDate
}

const isPreviousDisabled = computed(() => {
  const firstVisibleDate = new Date(currentDate.value)
  firstVisibleDate.setHours(0, 0, 0, 0)
  return firstVisibleDate <= today
})

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 14)
  currentDate.value = newDate
}

// Exposer les méthodes
defineExpose({
  handleRestrictionChange,
  setRoomAndRateTypes
})


const handleClickOutside = (event: MouseEvent) => {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target as Node)) {
    showDatePicker.value = false
  }
}




onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
