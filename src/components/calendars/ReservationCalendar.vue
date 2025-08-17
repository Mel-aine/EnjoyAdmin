<template>
 <FullScreenLayout>
   <AppHeader/>
  <div class="reservation-calendar font-sans h-screen flex flex-col ">

    <div
      class="mb-4 bg-white px-6 py-1 flex items-center justify-between rounded-b-lg border-b">
      <div class="flex gap-2">
         <InputDatePicker class="bg-white rounded-lg w-40 h-full" v-model="selectedDate" />
        <div
          class="flex rounded-lg px-2 text-sm font-semibold transition align-middle py-3 bg-white text-primary shadow border border-gray-300 focus:ring focus:ring-primary/30">
          <label>{{ $t('show') }}</label>
          <select v-model="daysToShow" @change="setDays(Number(daysToShow))" class="outline-0">
            <option :value="7">7 {{ $t('days') }}</option>
            <option :value="15">15 {{ $t('days') }}</option>
            <option :value="30">30 {{ $t('days') }}</option>
          </select>
        </div>
     
      <div class="flex gap-5 text-sm item-center self-center align-middle">
          <div v-for="(item,index) in statusElements" :key="index" class="flex gap-2">
            <span>{{ $t(item) }}</span>
            <span class="rounded-full bg-gray-200 px-2">{{ getRoomStatusCount(item) }}</span>
          </div>
      </div>
       </div>
      <div class="flex gap-2 flex-wrap items-center">
        <div
          class="flex rounded-lg px-2 text-sm font-semibold transition align-middle py-2 bg-white text-primary  border border-gray-300 focus:ring focus:ring-primary/30">
          <select  class="outline-0">
            <option value="BB">BB</option>
            <option value="BO">BO</option>
            <option value="PC">PC</option>
          </select>
        </div>
       
      </div>
    </div>
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Fixed Header -->
       <div class="border border-gray-300 border-b-0">
         <table class="min-w-full text-sm table-fixed">
           <thead>
             <tr>
               <th class="bg-gray-100 px-2 py-1 border-r border-gray-300 w-24 min-w-[6rem]">{{ $t('Room') }}</th>
               <th v-for="(date, idx) in visibleDates" :key="idx"
                 class="bg-gray-50 px-2 py-1 text-center border-r border-gray-300 relative"
                 :style="`width: calc((100% - 6rem) / ${visibleDates.length})`">
                <button v-if="idx === 0" @click="prevDay" 
                  class="absolute left-1 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>{{ formatDate(date) }}</div>
                <div class="text-xs text-gray-400">{{ formatDay(date) }}</div>
                <button v-if="idx === visibleDates.length - 1" @click="nextDay" 
                  class="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <!-- Scrollable Content -->
       <div class="flex-1 overflow-y-auto border border-gray-300">
         <table class="min-w-full text-sm table-fixed">
           <colgroup>
             <col class="w-24 min-w-[6rem]">
             <col v-for="(date,ind) in visibleDates" :key="ind" :style="`width: calc((100% - 6rem) / ${visibleDates.length})`">
           </colgroup>
          <tbody>
            <template v-if="isLoading || !apiRoomGroups || !apiOccupancyMetrics">
              <tr v-for="i in 8" :key="i">
                <td class="px-2 py-1">
                  <div class="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td v-for="j in visibleDates.length" :key="j" class="px-0 py-0 h-12">
                  <div class="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                </td>
              </tr>
            </template>
            <template v-else>
              <template v-for="group in apiRoomGroups" :key="group.room_type">
                <tr>
                  <td :colspan="visibleDates.length + 1"
                    class="font-bold bg-green-100 px-2 py-1 border border-gray-300 cursor-pointer hover:bg-green-200 transition-colors"
                    @click="toggleRoomType(group.room_type)">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <svg 
                          :class="['w-4 h-4 transition-transform', collapsedRoomTypes[group.room_type] ? 'rotate-0' : 'rotate-90']"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span>{{ group.room_type }}</span>
                        <span class="text-xs text-gray-500 font-normal">({{ group.room_details.length }})</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-for="room in group.room_details" 
                    :key="room.room_number || room.room_status + Math.random()"
                    v-show="!collapsedRoomTypes[group.room_type]"
                    class="transition-all duration-200 ease-in-out">
                  <td class="font-semibold px-2 py-1 border border-gray-300">{{ room.room_number || '-' }}</td>
                  <template v-for="cell in getRoomRowCellsApi(group, room)" :key="cell.key">
                    <td v-if="cell.type === 'reservation'" :colspan="cell.colspan"
                      class="relative px-0 py-0 h-12 border border-gray-300">

                      <div :class="[
                        'cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white flex items-center gap-1 w-[80%] ',
                        getReservationColor(cell.reservation.reservation_status),
                      ]" 
                      
                      :style="getReservationStyle(cell)"
                      @click="showReservationModal(cell.reservation)"
                        @mouseenter="showReservationTooltip(cell.reservation, $event)"
                        @mouseleave="hideReservationTooltip">
                        <span>
                          {{ cell.reservation.guest_name }}
                          <br>
                        </span>

                      </div>

                    </td>
                    <td
                      v-else-if="cell.type === 'room' && ['maintenance', 'out_of_service', 'cleaning'].includes(room.room_status)"
                      class="px-0 py-0 h-12 border border-gray-300">
                      <div
                        :class="['flex items-center justify-center h-full w-full', getRoomStatusColor(room.room_status)]">
                        <component :is="getRoomStatusIcon(room.room_status)"
                          :class="['w-5 h-5 mr-1', getRoomStatusColor(room.room_status)]" />
                      </div>
                    </td>
                    <td v-else class="px-0 py-0 h-12 border border-gray-300"></td>
                  </template>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
      <div class="sticky bottom-0 bg-white shadow z-10">
        <table class="min-w-full border-t border border-gray-300 text-xs table-fixed">
          <colgroup>
            <col class="w-24 min-w-[6rem]">
            <col v-for="(date,ind) in visibleDates" :key="ind" :style="`width: calc((100% - 6rem) / ${visibleDates.length})`">
          </colgroup>
          <tfoot>
            <tr class="text-md">
              <td colspan="1" class="bg-gray-100 font-bold border border-gray-300 w-24 min-w-[6rem]">
                {{ $t('Room Legend') }}
              </td>
              <td colspan="99" class="bg-gray-50 border border-gray-300 p-3">
                <span v-for="legend in legends" :key="legend.type" class="inline-flex items-center gap-1 mr-4">
                  <span :class="['inline-block w-4 h-4 rounded', getReservationColor(legend.type)]"></span>
                  <span class="text-xs">{{ $t(legend.label) }}</span>
                </span>
              </td>
            </tr>
            <tr>
              <td class="bg-gray-100 border border-gray-300">{{ $t('Unassigned reservations') }}</td>
              <td v-for="(date, idx) in visibleDates" :key="idx" class="text-center border border-gray-300"
                v-html="getUnassignedApi(date)">
              </td>
            </tr>
            <tr>
              <td class="bg-gray-100 border border-gray-300">{{ $t('Allocations') }}</td>
              <td v-for="(date, idx) in visibleDates" :key="idx" class="text-center border border-gray-300">{{
                getAllocatedRoomsApi(date) }}
              </td>
            </tr>
            <tr>
              <td class="bg-gray-100 border border-gray-300">% {{ $t('Occupancy') }}</td>
              <td v-for="(date, idx) in visibleDates" :key="idx" class="text-center border border-gray-300">{{
                getOccupancyApi(date) }} %</td>
            </tr>
            <tr>
              <td class="bg-gray-100 border border-gray-300">{{ $t('Available Rooms') }}</td>
              <td v-for="(date, idx) in visibleDates" :key="idx" class="text-center border border-gray-300">{{
                getAvailableRoomsApi(date) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
  <!--tooltip-->
  <div v-if="tooltipReservation && tooltipPosition"
    :style="`position:fixed;left:${tooltipPosition.x + 12}px;top:${tooltipPosition.y + 12}px;z-index:1000;`"
    class="rounded-lg bg-white w-90 max-w-fulltext-sm pointer-events-none">
    <div class="bg-primary shadow-lg border text-white rounded-t-lg px-4 py-2 mb-2">
      <div class="font-bold">{{ $t('guests') }}: {{ tooltipReservation.guests }} {{ $t('guests') }}</div>
      <div>{{ $t('Guest name') }}: <span class="font-bold">{{ tooltipReservation.guest_name }}</span></div>
      <div>{{ $t('reservation_id') }}: <span class="font-bold">{{ tooltipReservation.reservation_id }}</span></div>
      <div>{{ $t('reservation_code') }}: <span class="font-bold">{{ tooltipReservation.reservation_number }}</span>
      </div>
      <div class="flex gap-3 mt-2">
        <span class="flex items-center gap-1">
          <component :is="getReservationTypeIcon(tooltipReservation.reservation_type)" class="w-4 h-4" />
          <span class="text-xs">{{ $t(tooltipReservation.reservation_type || '-') }}</span>
        </span>
        <span class="flex items-center gap-1">
          <component :is="getCustomerTypeIcon(tooltipReservation.customer_type)" class="w-4 h-4" />
          <span class="text-xs">{{ $t(tooltipReservation.customer_type || '-') }}</span>
        </span>
      </div>
    </div>
    <ChevronInfo>
      <template #left>
        <div class="text-center">
          <div class="font-bold text-xl">{{ formatDate(new Date(tooltipReservation.check_in_date)) }}</div>
          <div class="text-md text-black">{{ formatDay(new Date(tooltipReservation.check_in_date)) }}</div>
        </div>
      </template>
      <template #right>
        <div class="text-center">
          <div class="font-bold text-xl">{{ formatDate(new Date(tooltipReservation.check_out_date)) }}</div>
          <div class="text-md text-black">{{ formatDay(new Date(tooltipReservation.check_out_date)) }}</div>
        </div>
      </template>
    </ChevronInfo>
    <div class="flex gap-2 mt-2 mb-2">
      <div class="text-md text-gray-500">{{ $t('Comment') }}:</div>
      <div>{{ tooltipReservation.comment || $t('none') }}</div>
    </div>
    <ChevronInfo>
      <template #left>
        <div class="text-center">
          <div class="font-bold text-sm ">{{ $t('Amount Due') }}</div>
          <div class="font-bold text-lg">{{ formatCurrency(tooltipReservation.remaining_amount ?? 0) }}</div>
        </div>
      </template>
      <template #right>
        <div class="text-center">
          <div class="font-bold text-sm">{{ $t('paid') }}</div>
          <div class="font-bold text-lg">{{ formatCurrency(tooltipReservation.total_amount ?? 0) }}</div>
        </div>
      </template>
    </ChevronInfo>
  </div>
  <AddBookingModal v-if="showModalAddingModal" @close="showModalAddingModal = false" @refresh="refresh" />
  <template v-if="modalReservation && showDetail">
    <ReservationRigthModal
      :is-open="showDetail"
      @close="closeReservationModal"
      :reservation-data="modalReservation"
    />
  </template>
 </FullScreenLayout>
</template>

<script setup lang="ts">
import { HotelIcon, GlobeIcon, UserIcon, UsersIcon, BookIcon } from 'lucide-vue-next'

import { watch } from 'vue'
import { CheckCircle, X } from 'lucide-vue-next'
import ChevronInfo from '../common/ChevronInfo.vue'
import { formatCurrency } from '../utilities/UtilitiesFunction'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue';
import AddBookingModal from '../modal/AddBookingModal.vue';
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { getDailyOccupancyAndReservations } from "@/services/api"

const isLoading = ref(false);
function getReservationTypeIcon(type: string) {
  switch (type) {
    case 'Direct Booking': return BookIcon;
    case 'Hotel': return HotelIcon;
    case 'Online': return GlobeIcon;
    default: return BookIcon;
  }
}

function getCustomerTypeIcon(type: string) {
  switch (type) {
    case 'Individual': return UserIcon;
    case 'Group': return UsersIcon;
    default: return UserIcon;
  }
}
// --- ROOM STATUS COLOR & ICON ---
import { ErrorIcon, WarningIcon, UserCircleIcon, GridIcon } from '@/icons'
import AppHeader from '../layout/AppHeader.vue'
import FullScreenLayout from '../layout/FullScreenLayout.vue'
import ReservationRigthModal from '../reservations/ReservationRigthModal.vue'

function getRoomStatusColor(status: string): string {
  switch (status) {
    case 'available': return 'text-green-400';
    case 'occupied': return 'text-red-400';
    case 'maintenance': return 'text-yellow-400';
    case 'out_of_service': return 'text-red-400';
    case 'cleaning': return 'text-purple-400';
    default: return 'text-gray-300';
  }
}

function getRoomStatusIcon(status: string) {
  switch (status) {
    case 'available': return CheckCircle;
    case 'occupied': return UserCircleIcon;
    case 'maintenance': return WarningIcon;
    case 'out_of_service': return ErrorIcon;
    case 'cleaning': return GridIcon;
    default: return GridIcon;
  }
}

const serviceStore = useServiceStore()
const { t, locale } = useI18n()
const serviceResponse = ref<any>({})
const showModalAddingModal = ref<boolean>(false);
const showDetail = ref<boolean>(false)
const legends = [
  { type: 'confirmed', label: t('Confirmed reservation') },
  { type: 'request', label: t('Reservation Request') },
  { type: 'complimentary', label: 'Complimentary' },
  { type: 'blocked', label: 'Blocked Room' },
  { type: 'checkout', label: 'Check Out' },
  { type: 'departure', label: 'Departures today' },
  { type: 'inhouse', label: 'In House' }
]
const modalReservation = ref<any | null>(null)
function showReservationModal(reservation: any) {
  showDetail.value = true
  modalReservation.value = reservation
}
function closeReservationModal() {
  modalReservation.value = null;
  showDetail.value = false
}
const selectedDate = ref((new Date()).toISOString().split('T')[0])
const daysToShow = ref(15)

// Collapsible room types state
const collapsedRoomTypes = ref<Record<string, boolean>>({})

// Toggle room type collapse state
function toggleRoomType(roomType: string) {
  collapsedRoomTypes.value[roomType] = !collapsedRoomTypes.value[roomType]
}

const visibleDates = computed(() => {
  const start = new Date(selectedDate.value)
  return Array.from({ length: daysToShow.value }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
})
const start_date = computed(() => visibleDates.value[0].toISOString().split('T')[0])
const end_date = computed(() => visibleDates.value[visibleDates.value.length - 1].toISOString().split('T')[0])

// --- API DATA ADAPTERS ---
const apiRoomGroups = computed(() => {
  return serviceResponse.value.grouped_reservation_details || []
})
const apiOccupancyMetrics = computed(() => {
  return serviceResponse.value.daily_occupancy_metrics || []
})

// --- API TABLE ROWS ---
function getRoomRowCellsApi(group: any, room: any) {
  const cells = []
  let i = 0
  const reservations = (group.reservations || []).filter(
    (r: any) => r.assigned_room_number === room.room_number || room.room_number === null
  )
  while (i < visibleDates.value.length) {
    const date = visibleDates.value[i]
    const dStr = date.toISOString().split('T')[0]

    // Find reservation starting on this date
    let reservation = reservations.find((r: any) => {
      // If reservation starts today
      return r.check_in_date.startsWith(dStr)
    })

    // If no reservation starts today, check if a reservation started before and is still ongoing
    if (!reservation) {
      reservation = reservations.find((r: any) => {
        const start = new Date(r.check_in_date)
        const end = new Date(r.check_out_date)
        return start < date && end >= date
      })
    }

    if (reservation) {
      // Calculate colspan: from current date to min(end date, last visible date)
      const start = new Date(reservation.check_in_date)
      const end = new Date(reservation.check_out_date)
      const lastVisible = visibleDates.value[visibleDates.value.length - 1]
      const colspan = visibleDates.value.filter(d => d >= date && d <= end && d <= lastVisible).length



      const is_check_in = reservation.check_in_date.startsWith(dStr);

      const reservationDates = visibleDates.value.filter(d => d >= date && d <= end && d <= lastVisible);
      const lastVisibleDateOfReservation = reservationDates.length > 0 ? reservationDates[reservationDates.length - 1] : null;
      const checkOutDate = new Date(reservation.check_out_date);

      const is_check_out = lastVisibleDateOfReservation && (lastVisibleDateOfReservation.getFullYear() === checkOutDate.getFullYear() && lastVisibleDateOfReservation.getMonth() === checkOutDate.getMonth() && lastVisibleDateOfReservation.getDate() === checkOutDate.getDate());





      cells.push({
        type: 'reservation',
        reservation,
        middle: reservation.check_in_date.startsWith(dStr),
        colspan,
        is_check_in,
        is_check_out,
        date,
        key: i
      })
      i += colspan
    } else {
      cells.push({
        type: 'room',
        key: i
      })
      i += 1
    }
  }
  return cells
}

// --- API FOOTER ---
function getUnassignedApi(date: Date) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)
  return metric ? `<span class='${metric.unassigned_reservations > 0 ? 'text-red-400' : ''}'>${metric.unassigned_reservations}</span>` : '0'
}
function getAllocatedRoomsApi(date: Date) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)
  return metric ? metric.allocated_rooms : '0'
}
function getOccupancyApi(date: Date) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)
  return metric ? metric.occupancy_rate : '0.00'
}
function getAvailableRoomsApi(date: Date) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)
  return metric ? metric.total_available_rooms : '0'
}

// --- UTILS ---
function formatDate(date: Date) {
  return date.toLocaleDateString(locale.value, { day: '2-digit', month: 'short' })
}
function formatDay(date: Date) {
  return date.toLocaleDateString(locale.value, { weekday: 'short' })
}
function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getReservationStyle(cell: any) {
  const { is_check_in, is_check_out, colspan } = cell;



  let width = 'calc(100% - 4px)';
  let left = '2px';

  if (colspan > 0) {
    if (is_check_in && is_check_out) {
      if (colspan === 1) {
        width = 'calc(50% - 4px)';
        left = 'calc(25% + 2px)';
      } else {
        width = `calc(${(colspan - 1) / colspan * 100}% - 4px)`;
        left = `calc(${0.5 / colspan * 100}% + 2px)`;
      }
    } else if (is_check_in) {
      width = `calc(${(colspan - 0.5) / colspan * 100}% - 4px)`;
      left = `calc(${0.5 / colspan * 100}% + 2px)`;
    }  else if (is_check_out) {
        width = `calc(${(colspan - 0.5) / colspan * 100}% - 4px)`;
    }
  }

  return { width, left };
}
function getReservationColor(type: string) {
  switch (type) {
    case 'confirmed': return 'bg-green-500'
    case 'request': return 'bg-orange-500'
    case 'complimentary': return 'bg-blue-500'
    case 'blocked': return 'bg-purple-500'
    case 'checkout': return 'bg-gray-700'
    case 'departure': return 'bg-red-500'
    case 'inhouse': return 'bg-teal-500'
    case 'checked_in': return 'bg-green-700'
    case 'occupied': return 'bg-green-700'
    default: return 'bg-gray-400'
  }
}


// --- API CALL ---
const getLocaleDailyOccupancyAndReservations = async () => {
  isLoading.value = true;
  const serviceId = serviceStore.serviceId!
  const response = await getDailyOccupancyAndReservations(serviceId, start_date.value, end_date.value)
  serviceResponse.value = response.data
  console.log('this is the response', response)
  isLoading.value = false;
}
const refresh =async ()=>{
  showModalAddingModal.value = false;
  const serviceId = serviceStore.serviceId!
  const response = await getDailyOccupancyAndReservations(serviceId, start_date.value, end_date.value)
  serviceResponse.value = response.data
}
function prevDay() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 1)
  selectedDate.value = d.toISOString().split('T')[0]
}
function nextDay() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 1)
  selectedDate.value = d.toISOString().split('T')[0]
}
function setToday() {
  selectedDate.value = new Date().toISOString().split('T')[0]
}
function setDays(n: number) {
  daysToShow.value = n
}

onMounted(() => {
  getLocaleDailyOccupancyAndReservations()
})

watch([selectedDate, daysToShow], () => {
  getLocaleDailyOccupancyAndReservations()
})

const addReservation = () => {
  showModalAddingModal.value = true;
}


const tooltipReservation = ref<any | null>(null)
const tooltipPosition = ref<{ x: number, y: number } | null>(null)

function showReservationTooltip(reservation: any, event: MouseEvent) {
  tooltipReservation.value = reservation
  tooltipPosition.value = { x: event.clientX, y: event.clientY }
}
function hideReservationTooltip() {
  tooltipReservation.value = null
  tooltipPosition.value = null
}

const statusElements = ref([
  'all',
  "vacant",
  "occupied",
  "reserved",
  "blocked",
  "dueOut",
  "dirty"
])

// Function to get room status count from API response
function getRoomStatusCount(status: string): number {
  if (!serviceResponse.value?.global_room_status_stats) {
    return 0
  }
  return serviceResponse.value.global_room_status_stats[status] || 0
}
</script>