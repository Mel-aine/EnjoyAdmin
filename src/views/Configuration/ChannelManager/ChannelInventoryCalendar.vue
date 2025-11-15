<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="overflow-hidden">
      <!-- Mini Calendar Date Picker -->
      <div v-if="showDatePicker" class="absolute z-50 mt-2 ml-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
          {{ miniCalendarMonth }}
        </div>
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day"
            class="text-xs text-gray-600 dark:text-gray-300 text-center font-medium p-1">
            {{ day }}
          </div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <button v-for="day in miniCalendarDays" :key="day.date" @click="!isPastDate(day.date) && selectDate(day)"
            :disabled="isPastDate(day.date)" :class="[
              'text-sm p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
              day.isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500',
              day.isToday ? 'bg-purple-500 text-white hover:bg-purple-600' : '',
              !day.isCurrentMonth ? 'opacity-50' : '',
              isPastDate(day.date) ? 'opacity-30 cursor-not-allowed' : '',
            ]">
            {{ day.day }}
          </button>
        </div>
      </div>

      <!-- Main Calendar Table -->
      <div class="overflow-x-auto" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
        <!-- Loading State: Skeleton Grid -->
        <div v-if="loading" class="py-6 px-4">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b animate-pulse">
                  <th class="px-4 py-3">
                    <div class="h-6 w-32 bg-gray-200 rounded"></div>
                  </th>
                  <th class="px-4 py-3">
                    <div class="h-6 w-20 bg-gray-200 rounded"></div>
                  </th>
                  <th v-for="date in visibleDates" :key="date.date" class="px-2 py-3 min-w-[80px]">
                    <div class="space-y-1">
                      <div class="h-3 w-10 bg-gray-200 rounded"></div>
                      <div class="h-4 w-6 bg-gray-200 rounded"></div>
                      <div class="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Room type row skeletons -->
                <tr v-for="n in 3" :key="`room-skel-${n}`" class="border-b border-gray-200 animate-pulse">
                  <td class="px-4 py-3 sticky left-0 bg-white z-10">
                    <div class="h-4 w-40 bg-gray-200 rounded"></div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="h-4 w-10 bg-gray-200 rounded"></div>
                  </td>
                  <td v-for="date in visibleDates" :key="`room-date-${n}-${date.date}`" class="px-2 py-3">
                    <div class="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
                  </td>
                </tr>

                <!-- Rate plan row skeletons -->
                <tr v-for="n in 4" :key="`rate-skel-${n}`" class="border-b border-gray-200 animate-pulse">
                  <td class="px-4 py-3 sticky left-0 bg-white z-10">
                    <div class="h-4 w-36 bg-gray-200 rounded"></div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td v-for="date in visibleDates" :key="`rate-date-${n}-${date.date}`" class="px-2 py-3">
                    <div class="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Calendar Table -->
        <table v-else class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <th>
                <div class="flex items-center justify-between p-4">
                  <button @click="previousMonth" :disabled="isPreviousDisabled" :class="[
                    'p-2 rounded transition-colors',
                    isPreviousDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div class="flex items-center gap-3">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {{ currentMonthDisplay }}
                    </h2>
                    <button ref="selectWrapper" @click="showDatePicker = !showDatePicker"
                      class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors select-none">
                      <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <button @click="nextMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </th>
              <th></th>
              <th v-for="date in visibleDates" :key="date.date" class="px-2 py-3 text-center min-w-[80px]">
                <div class="text-xs text-gray-600 dark:text-gray-300">{{ date.dayName }}</div>
                <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ date.dayNum }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ date.month }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Boucle sur chaque groupe de RoomType -->
            <template v-for="group in groupedRoomRows" :key="group.roomTypeId">
              <!-- Ligne du ROOM TYPE (AVL uniquement) -->
              <tr class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 z-10">
                  {{ group.roomTypeName }}
                </td>

                <!-- Label AVL -->
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">AVL</td>

                <!-- Valeurs AVL -->
                <td v-for="date in visibleDates" :key="date.date" :class="[
                  'px-2 py-3 text-center cursor-pointer select-none transition-colors hover:bg-orange-100',
                  isCellSelected(group.roomTypeRow.id, date.date) ? 'bg-purple-100 border-2 border-purple-400' : '',
                  isPastDate(date.date) ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
                ]" @mousedown="!isPastDate(date.date) && handleCellMouseDown(group.roomTypeRow, date.date)"
                  @mouseenter="!isPastDate(date.date) && handleCellMouseEnter(group.roomTypeRow, date.date)">
                  <div
                    class="inline-flex items-center justify-center min-w-[50px] px-3 py-1.5 text-sm font-medium rounded"
                    :class="group.roomTypeRow.values?.[date.date] <= 0 ? 'bg-red-500 text-white' : 'dark:bg-gray-800 text-gray-900 dark:text-gray-100'">
                    {{ group.roomTypeRow.values?.[date.date] || 0 }}
                  </div>
                </td>
              </tr>

              <!-- Lignes des RATE PLANS -->
              <template v-for="ratePlan in group.ratePlans" :key="ratePlan.id">
                <tr v-for="(row, index) in ratePlan.restrictions" :key="row.id"
                  class="hover:bg-gray-50 border-b border-gray-200">
                  <!-- Nom du Rate Plan affiché une seule fois -->
                  <td v-if="index === 0" :rowspan="ratePlan.restrictions.length"
                    class="px-4 py-3 text-sm font-semibold text-gray-700 sticky left-0 bg-white dark:bg-gray-900 dark:text-white z-10 align-top">
                    {{ ratePlan.name }}
                  </td>

                  <!-- Label de restriction + icône si RATE + tooltips for CTA/CTD/SS -->
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-900">
                    <div class="flex items-center space-x-2 relative">
                      <div v-if="row.label === 'RATE'" class="relative group">
                        <UserRound class="w-4 h-4 inline-flex cursor-pointer text-gray-600 dark:text-gray-300" />
                        <div>
                          {{ row.occupancy }}
                        </div>

                        <!-- Tooltip Occupancy -->
                        <div
                          class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max max-w-xs px-2 py-1 text-xs text-white bg-gray-700 dark:bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          Occupancy
                        </div>
                      </div>

                      <!-- Text with tooltip for CTA/CTD/SS -->
                      <span v-if="!['Closed To Arrival', 'Closed To Departure', 'Stop Sell'].includes(row.label)">
                        {{ labelCode(row.label) }}
                      </span>
                      <span v-else class="relative group">
                        {{ labelCode(row.label) }}
                        <div
                          class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max max-w-xs px-2 py-1 text-xs text-white bg-gray-700 dark:bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {{ labelTooltip(row.label) }}
                        </div>
                      </span>
                    </div>
                  </td>

                  <!-- Valeurs de la restriction -->
                  <td v-for="date in visibleDates" :key="date.date" :class="[
                    'px-2 py-3 text-center cursor-pointer select-none transition-colors hover:bg-orange-100 dark:hover:bg-gray-800',
                    isCellSelected(row.id, date.date)
                      ? 'bg-purple-100 border-2 border-purple-400 dark:bg-purple-900/40 dark:border-purple-500'
                      : '',
                    isPastDate(date.date)
                      ? 'opacity-40 cursor-not-allowed pointer-events-none'
                      : isNonEditable(row.label)
                        ? 'opacity-60 cursor-not-allowed pointer-events-none'
                        : '',
                  ]"
                    @mousedown="!isPastDate(date.date) && !isNonEditable(row.label) && handleCellMouseDown(row, date.date)"
                    @mouseenter="!isPastDate(date.date) && !isNonEditable(row.label) && handleCellMouseEnter(row, date.date)">
                    <div v-if="isBooleanRestriction(row.label)" class="flex items-center justify-center">
                      <input type="checkbox" class="h-4 w-4" :checked="isChecked(row.values[date.date])" />
                    </div>
                    <div v-else :class="[
                      'inline-flex items-center justify-center min-w-[50px] px-3 py-1.5 text-sm font-medium rounded',
                      row.label === 'RATE' ? 'bg-pink-100 text-gray-900 dark:bg-pink-900/40 dark:text-gray-100' : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100',
                    ]">
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
    <ValueOverrideRateModal :is-open="showModal" :selected-range="selectedRange" :modal-type="modalType"
      :loading="loading" @close="handleCancel" @confirm="handleConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { UserRound } from 'lucide-vue-next'
import ValueOverrideRateModal from './InventoryModale/ValueOverrideRateModal.vue'
import { getRestrictions, getAvailability } from '@/services/channelManagerApi'
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
const currentDate = ref(new Date())
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

// Reset local selection state (used by parent reset)
const resetSelection = () => {
  isSelecting.value = false
  selectedRange.value = null
  showModal.value = false
}

const selectedRestrictions = ref<string[]>(['Rate And Availability'])
// Props
interface Props {
  roomTypes?: Array<{ id: string; name: string; filteredRates?: [], occupancy?: number }>;
  rateTypes?: Array<{ id: string; name: string; roomId?: string }>;
}

const props = withDefaults(defineProps<Props>(), {
  roomTypes: () => [],
  rateTypes: () => [],
});
const emit = defineEmits<{ (e: 'value-selected', payload: any): void }>()
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
  console.log('transformApiDataToRoomRows - roomTypes:', props.roomTypes)
  console.log('transformApiDataToRoomRows - rateTypes:', props.rateTypes)

  // Parcourir chaque room type pour créer les lignes AVL
  props.roomTypes.forEach(roomType => {
    const availabilityValues: Record<string, number> = {}
    if (apiData.availability && apiData.availability[roomType.id]) {
      Object.keys(apiData.availability[roomType.id]).forEach(date => {
        availabilityValues[date] = parseInt(apiData.availability[roomType.id][date]) || 0
      })
    }

    rows.push({
      id: `${roomType.id}-avl`,
      name: roomType.name,
      type: 'AVL',
      label: 'AVL',
      values: availabilityValues,
      roomTypeId: roomType.id,
      roomTypeName: roomType.name,
      occupancy: roomType.occupancy,
    })
  })

  // Parcourir chaque rate plan ID pour les autres restrictions
  if (apiData.rates) {
    Object.keys(apiData.rates).forEach((ratePlanId) => {
      const ratePlan = props.rateTypes.find(rt => rt.id === ratePlanId)
      if (!ratePlan) return

      const roomType = props.roomTypes.find(rm => rm.id === ratePlan.roomId)
      if (!roomType) return

      const ratePlanData = apiData.rates[ratePlanId]

      // Préparer toutes les maps de valeurs et les remplir en une seule passe
      const rateValues: Record<string, number> = {}
      const stopSellValues: Record<string, any> = {}
      const ctaValues: Record<string, any> = {}
      const ctdValues: Record<string, any> = {}
      const msaValues: Record<string, number> = {}
      const mstValues: Record<string, number> = {}
      const maxStayValues: Record<string, number> = {}
      const avoValues: Record<string, number> = {}
      const malValues: Record<string, number> = {}
      const avlPerRateValues: Record<string, number> = {}

      Object.keys(ratePlanData).forEach(date => {
        const entry = ratePlanData[date] || {}
        // Numériques
        rateValues[date] = parseInt(entry.rate) || 0
        if (entry.min_stay_arrival !== undefined && entry.min_stay_arrival !== null) {
          msaValues[date] = Number(entry.min_stay_arrival) || 0
        }
        if (entry.min_stay_through !== undefined && entry.min_stay_through !== null) {
          mstValues[date] = Number(entry.min_stay_through) || 0
        }
        if (entry.max_stay !== undefined && entry.max_stay !== null) {
          maxStayValues[date] = Number(entry.max_stay) || 0
        }
        if (entry.availability_offset !== undefined && entry.availability_offset !== null) {
          avoValues[date] = Number(entry.availability_offset) || 0
        }
        if (entry.max_availability !== undefined && entry.max_availability !== null) {
          malValues[date] = Number(entry.max_availability) || 0
        }
        if (entry.availability !== undefined && entry.availability !== null) {
          avlPerRateValues[date] = Number(entry.availability) || 0
        }

        // Booléens
        if (entry.stop_sell !== undefined) {
          stopSellValues[date] = entry.stop_sell ? 'true' : 'false'
        }
        if (entry.closed_to_arrival !== undefined) {
          ctaValues[date] = entry.closed_to_arrival ? 'true' : 'false'
        }
        if (entry.closed_to_departure !== undefined) {
          ctdValues[date] = entry.closed_to_departure ? 'true' : 'false'
        }
      })

      // Pousser chaque ligne restriction construite en une seule passe
      // Order rows as requested:
      // AVO, CTA, CTD, MAL, MXS, MSA, MST, RATE, AVL, SS
      rows.push({ id: `${ratePlanId}-availability-offset`, name: ratePlan.name, type: 'RATE', label: 'Availability Offset', values: avoValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-cta`, name: ratePlan.name, type: 'RATE', label: 'Closed To Arrival', values: ctaValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-ctd`, name: ratePlan.name, type: 'RATE', label: 'Closed To Departure', values: ctdValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-max-availability`, name: ratePlan.name, type: 'RATE', label: 'Max Availability', values: malValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-max-stay`, name: ratePlan.name, type: 'RATE', label: 'Max Stay', values: maxStayValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-msa`, name: ratePlan.name, type: 'RATE', label: 'Min Stay Arrival', values: msaValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-mst`, name: ratePlan.name, type: 'RATE', label: 'Min Stay Through', values: mstValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-rate`, name: ratePlan.name, type: 'RATE', label: 'RATE', values: rateValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-availability-per-rate`, name: ratePlan.name, type: 'RATE', label: 'AVL', values: avlPerRateValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
      rows.push({ id: `${ratePlanId}-stop-sell`, name: ratePlan.name, type: 'RATE', label: 'Stop Sell', values: stopSellValues, roomTypeId: roomType.id, roomTypeName: roomType.name, ratePlanId: ratePlanId, ratePlanName: ratePlan.name })
    })
  }

  return rows
}

/* --- FETCH RESTRICTIONS --- */
const fetchRestrictions = async () => {
  console.log('🔵 fetchRestrictions STARTED')
  console.log('roomTypes:', props.roomTypes)
  console.log('rateTypes:', props.rateTypes)

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

    console.log('📤 Fetching restrictions and availability with params:', params)

    const [restrictionsRes, availabilityRes] = await Promise.all([
      getRestrictions(propertyId, params),
      getAvailability(propertyId, { date_from: params.date_from, date_to: params.date_to }),
    ])

    // --- Restrictions parsing ---
    const restrObj = restrictionsRes?.data?.data?.data || {}
    // --- Availability parsing ---
    const availObj = availabilityRes?.data?.data?.data || {}

    console.log('✅ Restrictions parsed item:', restrObj, availObj)
    // Combine for transformer
    const combinedApiData: any = {
      rates: restrObj,
      availability: availObj,
    }

    allRoomRows.value = transformApiDataToRoomRows(combinedApiData)
    console.log('✅ allRoomRows:', allRoomRows.value)
  } catch (err: any) {
    console.error('❌ Fetch error:', err.response?.data || err.message)
  } finally {
    loading.value = false
    console.log('🔵 fetchRestrictions FINISHED')
  }
}

/* --- FILTRAGE --- */
// Map long labels to short codes for display and filtering
const labelCodeMap: Record<string, string> = {
  'Availability Offset': 'AVO',
  'Availability Per Rate': 'AVL',
  'Closed To Arrival': 'CTA',
  'Closed To Departure': 'CTD',
  'Max Availability': 'MAL',
  'Max Stay': 'MXS',
  'Min Stay Arrival': 'MSA',
  'Min Stay Through': 'MST',
  'Stop Sell': 'SS',
  'RATE': 'RATE',
  'AVL': 'AVL',
}

const normalizeSelectionToCodes = (selection: string[]): string[] => {
  if (!selection || selection.length === 0) return []
  // Expand special combined selections
  if (selection.includes('All Restrictions')) {
    return ['AVO','CTA','CTD','MAL','MXS','MSA','MST','RATE','AVL','SS']
  }
  const codes: string[] = []
  selection.forEach((item) => {
    if (item === 'Rate And Availability') {
      codes.push('RATE','AVL')
    } else if (item === 'Only Availability' || item === 'Availability') {
      codes.push('AVL')
    } else if (item === 'Rate') {
      codes.push('RATE')
    } else if (labelCodeMap[item]) {
      codes.push(labelCodeMap[item])
    } else {
      // Already a code (CTA, CTD, etc.)
      codes.push(item)
    }
  })
  return Array.from(new Set(codes))
}

const roomRows = computed(() => {
  // Only display selected restrictions
  const allowedCodes = normalizeSelectionToCodes(selectedRestrictions.value)
  if (allowedCodes.length === 0) return []

  return allRoomRows.value.filter((row) => {
    const code = labelCodeMap[row.label] || row.label
    return allowedCodes.includes(code)
  })
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
  // Sort restrictions per rate plan to match required order
  const order: Record<string, number> = {
    'Availability Offset': 1,
    'Closed To Arrival': 2,
    'Closed To Departure': 3,
    'Max Availability': 4,
    'Max Stay': 5,
    'Min Stay Arrival': 6,
    'Min Stay Through': 7,
    'RATE': 8,
    'AVL': 9,
    'Stop Sell': 10,
  }

  Object.values(groups).forEach((g) => {
    g.ratePlans.forEach((rp) => {
      rp.restrictions.sort((a, b) => (order[a.label] || 999) - (order[b.label] || 999))
    })
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

  // Max Availability: show X/A when 0
  if (label === 'Max Availability') {
    const n = Number(value) || 0
    return n === 0 ? 'X/A' : String(n)
  }

  // Pour les autres valeurs
  return String(value)
}

// Helpers for UI behavior
const isBooleanRestriction = (label: string) => ['Closed To Arrival', 'Closed To Departure', 'Stop Sell'].includes(label)
const isNonEditable = (label: string) => ['Max Availability', 'Availability Offset', 'AVL'].includes(label)
const isChecked = (val: any) => {
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val === 1
  if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1'
  return false
}
const labelTooltip = (label: string) => {
  if (label === 'Closed To Arrival') return 'Closed to arrival'
  if (label === 'Closed To Departure') return 'Closed to departure'
  if (label === 'Stop Sell') return 'Stop sell'
  return ''
}

// Display short codes for labels (e.g., CTA, CTD, SS, etc.)
const labelCode = (label: string): string => {
  return labelCodeMap[label] || label
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
  const { dateFrom, dateTo, restriction, value } = data
  const row = selectedRange.value?.row
  if (!row) return
  const dates = visibleDates.value
    .map((d) => d.date)
    .filter((d) => {
      const currentDate = new Date(d)
      return currentDate >= new Date(dateFrom!) && currentDate <= new Date(dateTo!)
    })

  if (restriction === 'closed') {
    dates.forEach((date) => {
      row.values[date] = value ? 1 : 0
    })
  } else {
    dates.forEach((date) => {
      row.values[date] = Number(value)
    })
  }
  showModal.value = false
  emit('value-selected', {
    type: row.type,
    room_type_id: row.roomTypeId,
    roomTypeName: row.roomTypeName,
    rate_plan_id: row.ratePlanId,
    ratePlanName: row.ratePlanName,
    date_from: dateFrom,
    date_to: dateTo,
    restriction,
    value,
  })
  showModal.value = false
}

const handleCancel = () => {
  showModal.value = false
  selectedRange.value = null
}

const handleRestrictionChange = (restrictions: string[]) => {
  selectedRestrictions.value = restrictions
}


const setRoomAndRateTypes = (rooms: RoomType[], rates: RateType[]) => {

  if (rooms.length > 0) {
    console.log('Calling fetchRestrictions...')
    fetchRestrictions()
  }
}

// Remplacez le watcher à la fin
watch(currentDate, () => {
  if (props.roomTypes.length > 0 && props.rateTypes.length > 0) {
    fetchRestrictions()
  }
})

watch(selectedRestrictions, () => {
  if (props.roomTypes.length > 0 && props.rateTypes.length > 0) {
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
  setRoomAndRateTypes,
  resetSelection,
  fetchRestrictions
})


const handleClickOutside = (event: MouseEvent) => {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target as Node)) {
    showDatePicker.value = false
  }
}




onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchRestrictions()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
