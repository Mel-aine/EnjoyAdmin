<template>
  <FullScreenLayout>
    <AppHeader />
    <div class="reservation-calendar font-sans h-screen flex flex-col ">

      <div class="mb-4 bg-white px-6 py-1 flex items-center justify-between rounded-b-lg border-b">
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
            <div v-for="(item, index) in statusElements" :key="index" class="flex gap-2">
              <span>{{ $t(item) }}</span>
              <span class="rounded-full bg-gray-200 px-2">{{ getRoomStatusCount(item) }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2  items-center">
          <Select :options="rateTypeOptions" v-model="selectRateType" class="min-w-[12rem]" />
          <StatusLegend :sections="legendSections"/>
        </div>
      </div>
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Fixed Header -->
        <div class="border border-gray-300 border-b-0">
          <table class="min-w-full text-sm table-fixed">
            <thead>
              <tr>
                <th class="bg-gray-100 px-2 py-1 border-r border-gray-300  w-50 min-w-[6rem]">
                  <div class="flex justify-between items-center">
                    <div class="max-w-md">
                      <SelectDropdown v-model="selectedRoomTypes" :options="roomTypeOptions"
                        :placeholder="$t('roomType')" button-class="bg-white text-primary border border-blue-200  w-42"
                        dropdown-class="w-full" select-all-text="Select All" :max-display-items="3" />
                    </div>
                  </div>

                </th>
                <th v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['px-2 py-1 text-center border-r border-gray-300 relative', isWeekend(date) ? 'bg-orange-200/25' : 'bg-gray-50']"
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
              <col v-for="(date, ind) in visibleDates" :key="ind"
                :style="`width: calc((100% - 6rem) / ${visibleDates.length})`">
            </colgroup>
            <tbody>
              <template v-if="isLoading || !apiRoomGroups || !apiOccupancyMetrics">
                <tr v-for="i in 8" :key="i">
                  <td class="px-2 py-1">
                    <div class="h-4  w-50 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td v-for="j in visibleDates.length" :key="j" class="px-0 py-0 h-12">
                    <div class="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <template v-for="group in apiRoomGroups" :key="group.room_type">
                  <template v-if="selectedRoomTypes.includes(group.room_type_id)">
                    <tr>
                      <td
                        class="h-4 min-w-50 font-bold bg-green-100 px-2 py-1 border border-gray-300 cursor-pointer hover:bg-green-200 transition-colors"
                        @click="toggleRoomType(group.room_type)">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <svg
                              :class="['w-4 h-4 transition-transform', collapsedRoomTypes[group.room_type] ? 'rotate-0' : 'rotate-90']"
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span>{{ group.room_type }}</span>
                          </div>
                        </div>
                      </td>
                      <td v-for="(date, j) in visibleDates" :key="j"
                        :style="`width: calc((100% - 6rem) / ${visibleDates.length})`"
                        class=" bg-green-100 px-2 py-1 border border-gray-300 cursor-pointer hover:bg-green-200 ">
                        <div class="flex flex-col gap-1 justify-center align-middle self-center items-center">
                          <span class="text-xs">{{ roomRateForDate[group.room_type_id] ?? 'N/A' }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-for="room in group.room_details" :key="room.room_number || room.room_status + Math.random()"
                      v-show="!collapsedRoomTypes[group.room_type]" class="transition-all duration-200 ease-in-out">
                      <td class="font-semibold px-2 py-1 border border-gray-300">
                        <div class="flex justify-between">
                          <span>{{ room.room_number || '-' }}</span>
                          <div class="flex gap-1 text-gray-500">
                            <span class="text-xs" v-if="room.is_smoking">
                              <Cigarette class="w-4 h-4" />
                            </span>
                            <span v-else>
                              <CigaretteOff class="w-4 h-4" />
                            </span>
                            <span class="text-xs" v-if="room.room_housekeeping_status === 'clean'">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-brush-cleaning-icon lucide-brush-cleaning w-4 h-4">
                                <path d="m16 22-1-4" />
                                <path
                                  d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1" />
                                <path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z" />
                                <path d="m8 22 1-4" />
                              </svg>
                              <BrushClea class="w-4 h-4" />
                            </span>
                            <span v-else>
                              <LucideBrush class="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </td>


                      <template v-for="cell in getRoomRowCellsApi(group, room)" :key="cell.key">
                        <td v-if="cell.type === 'reservation'" :colspan="cell.colspan"
                          class="relative px-0 py-0 h-12 border border-gray-300">

                          <div :class="[
                            'cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white flex items-center gap-1 w-[80%] ',
                            getReservationColor(cell.reservation.reservation_status),
                          ]" :style="getReservationStyle(cell)" @click="showReservationModal(cell.reservation)"
                            @mouseenter="showReservationTooltip(cell.reservation, $event)"
                            @mouseleave="hideReservationTooltip">
                            <span class="truncate flex items-center gap-1">
                             
                              {{ cell.reservation.guest_name }}
                              <br>
                            </span>
                            <div class="absolute -top-2 flex items-center gap-1">
                               <Crown v-if="cell.reservation.is_master" 
                                class="bg-white w-3 h-3 text-yellow-400 flex-shrink-0" 
                                :title="$t('Primary')" />
                                <DollarSignIcon v-if="cell.reservation?.is_balance" class="bg-red-400 w-3 h-3 text-yellow-400 flex-shrink-0" />
                                <User2 v-if="cell.reservation?.isWomen" class="bg-pink-400 w-3 h-3 text-white flex-shrink-0" :title="$t('Female Guest')" />
                            </div>
                          </div>

                        </td>
                        <td v-else-if="cell.type === 'room_block'" :colspan="cell.colspan"
                          class="relative px-0 py-0 h-12 border border-gray-300">

                          <div :class="[
                            'absolute left-0 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white flex items-center gap-1 w-[80%] ',
                            getRoomBlockColor(cell.roomBlock.status),
                          ]" :style="getReservationStyle(cell)">
                            <span class="truncate">
                              🚫 {{ cell.roomBlock.reason || 'Room Blocked' }}
                              <br>
                              <small>{{ cell.roomBlock.status }}</small>
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
                        <td v-else
                          :class="['px-0 py-0 h-12 border border-gray-300', cell.date && isWeekend(cell.date) ? 'bg-gray-100' : '']">
                        </td>
                      </template>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <div class="sticky bottom-0 bg-white shadow z-10">
          <table class="min-w-full border-t border border-gray-300 text-xs table-fixed">

            <tfoot>
              <!--<tr class="text-md">
                <td class="bg-gray-100 font-bold border border-gray-300  w-50 min-w-[6rem]">
                  {{ $t('Room Legend') }}
                </td>
                <td :colspan="visibleDates.length" class="bg-gray-50 border border-gray-300 p-3">
                  <span v-for="legend in legends" :key="legend.type" class="inline-flex items-center gap-1 mr-4">
                    <span :class="['inline-block w-4 h-4 rounded', getReservationColor(legend.type)]"></span>
                    <span class="text-xs">{{ $t(legend.label) }}</span>
                  </span>
                </td>
              </tr> -->
              <tr>
                <td class="bg-gray-100 border w-50 h-7 border-gray-300">{{ $t('Unassigned reservations') }}</td>
                <td v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['text-center border border-gray-300', isWeekend(date) ? 'bg-gray-100' : '']"
                  :style="`width: calc((100% - 6rem) / ${visibleDates.length})`" v-html="getUnassignedApi(date)">
                </td>
              </tr>
              <tr>
                <td class="bg-gray-100  w-50 h-7 border border-gray-300">% {{ $t('Occupancy') }}</td>
                <td v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['text-center border border-gray-300', isWeekend(date) ? 'bg-gray-100' : '']">{{
                    getOccupancyApi(date)
                  }} %</td>
              </tr>
              <tr>
                <td class="bg-gray-100 w-50 h-7 border border-gray-300">{{ $t('Available Rooms') }}</td>
                <td v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['text-center border border-gray-300', isWeekend(date) ? 'bg-gray-100' : '']">{{
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
    </div>
    <AddBookingModal v-if="showModalAddingModal" @close="showModalAddingModal = false" @refresh="refresh" />
    <template v-if="modalReservation && showDetail">
      <ReservationRigthModal :is-open="showDetail" :title="$t('reservationDetails')"
        :reservation-data="modalReservation" @close="closeReservationModal" @save="handleReservationSave" />
    </template>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { HotelIcon, GlobeIcon, UserIcon, UsersIcon, BookIcon, Cigarette, CigaretteOff, CigaretteOffIcon, BedSingleIcon, LucideBrush, BrushIcon, Crown, DollarSignIcon, User2 } from 'lucide-vue-next'

import { watch } from 'vue'
import { CheckCircle, X } from 'lucide-vue-next'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue';
import AddBookingModal from '../modal/AddBookingModal.vue';
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { getDailyOccupancyAndReservations } from "@/services/api"
import CrownIcon from '@/icons/CrownIcon.vue'

const isLoading = ref(false);
function getReservationTypeIcon(type: string) {
  switch (type) {
    case 'Direct Booking': return BookIcon;
    case 'Hotel': return HotelIcon;
    case 'Online': return GlobeIcon;
    default: return BookIcon;
  }
}
const rateTypeOptions = ref<any>([])
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
import Select from '../forms/FormElements/Select.vue'
import { getRateTypeByHotelId, getRateTypes } from '../../services/configrationApi';
import SelectDropdown from '../common/SelectDropdown.vue';
import StatusLegend from '../common/StatusLegend.vue';

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
  { type: 'complimentary', label: t('Complimentary') },
  { type: 'blocked', label: t('Blocked Room') },
  { type: 'checkout', label: t('Check Out') },
  { type: 'departure', label: t('Departures today') },
  { type: 'inhouse', label: t('In House') }
]
const selectRateType = ref(0);
const modalReservation = ref<any | null>(null)
function showReservationModal(reservation: any) {
  showDetail.value = true
  modalReservation.value = reservation
}
function closeReservationModal() {
  modalReservation.value = null;
  showDetail.value = false
}

function handleReservationSave(data?: any) {
  console.log('Reservation saved:', data)
  // Refresh the calendar data when reservation is saved/updated
  refresh()
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
const apiRoomBlocks = computed(() => {
  return serviceResponse.value.room_blocks || []
})

// Function to check if a reservation is the first room in a multi-room reservation
function isFirstRoomInMultiRoomReservation(reservation: any): boolean {
  if (!reservation?.reservation_id) return false
  
  // Get all reservations with the same reservation_id across all room groups
  const allReservations: any[] = []
  apiRoomGroups.value.forEach((group: any) => {
    if (group.reservations) {
      allReservations.push(...group.reservations)
    }
  })
  
  // Find all reservations with the same reservation_id
  const sameReservationRooms = allReservations.filter(
    (r: any) => r.reservation_id === reservation.reservation_id
  )
  
  // If there's only one room, it's not a multi-room reservation
  if (sameReservationRooms.length <= 1) return false
  
  // Sort by room number or assigned room number to determine the "first" room
  sameReservationRooms.sort((a: any, b: any) => {
    const roomA = a.assigned_room_number || a.room_number || ''
    const roomB = b.assigned_room_number || b.room_number || ''
    return roomA.localeCompare(roomB)
  })
  
  // Check if this reservation is the first one in the sorted list
  return sameReservationRooms[0] === reservation
}

// --- API TABLE ROWS ---
function getRoomRowCellsApi(group: any, room: any) {
  const cells = []
  let i = 0
  
  // Fixed filtering logic for multi-room reservations
  const allReservations = group.reservations || []
  const reservations = allReservations.filter((r: any) => {
    // Match by assigned room number, room number, or if room number is null (unassigned rooms)
    return r.assigned_room_number === room.room_number || 
           r.room_number === room.room_number || 
           (room.room_number === null && !r.assigned_room_number)
  })
  
  // Filter room blocks for this room
  const roomBlocks = apiRoomBlocks.value.filter(
    (b: any) => b.room && b.room.room_number === room.room_number
  )
  
  while (i < visibleDates.value.length) {
    const date = visibleDates.value[i]
    const dStr = date.toISOString().split('T')[0]

    // Check for room block first (higher priority)
    let roomBlock = roomBlocks.find((b: any) => {
      const startDate = new Date(b.block_from_date)
      const endDate = new Date(b.block_to_date)
      return startDate <= date && endDate >= date
    })

    if (roomBlock) {
      // Calculate colspan for room block
      const start = new Date(roomBlock.block_from_date)
      const end = new Date(roomBlock.block_to_date)
      const lastVisible = visibleDates.value[visibleDates.value.length - 1]
      const colspan = visibleDates.value.filter(d => d >= date && d <= end && d <= lastVisible).length

      cells.push({
        type: 'room_block',
        roomBlock,
        colspan,
        date,
        key: i
      })
      i += colspan
    } else {
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
  }
  return cells
}

// --- API FOOTER ---
function getUnassignedApi(date: Date) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)
  return metric ? `<span class='${metric.unassigned_reservations > 0 ? 'text-red-400' : ''}'>${metric.unassigned_reservations}</span>` : '0'
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
  return date.toLocaleDateString('en', { day: '2-digit', month: 'short' })
}
function formatDay(date: Date) {
  return date.toLocaleDateString('en', { weekday: 'short' })
}

function isWeekend(date: Date): boolean {
  const day = date?.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
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
    } else if (is_check_out) {
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

function getRoomBlockColor(status: string) {
  switch (status) {
    case 'active': return 'bg-red-500'
    case 'pending': return 'bg-yellow-500'
    case 'cancelled': return 'bg-gray-500'
    case 'expired': return 'bg-gray-400'
    default: return 'bg-red-600'
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
const refresh = async () => {
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
const roomTypeOptions = computed(() => {
  if (serviceResponse.value?.grouped_reservation_details) {
    const res = serviceResponse.value?.grouped_reservation_details.map((item: any) => {
      return {
        label: item.room_type,
        id: item.room_type_id
      }
    })
    if (selectedRoomTypes.value.length === 0) {
      selectedRoomTypes.value = serviceResponse.value?.grouped_reservation_details.map((item: any) => {
        return item.room_type_id
      })
    }
    return res;
  }
  return []
})
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
// Store the current rate types data
const currentRateTypeData = ref<any>([])
const selectedRoomTypes = ref<any>([])

const fectRateTypes = async () => {
  const response = await getRateTypeByHotelId(serviceStore.serviceId!)
  console.log('rateTypeOptions', response.data?.data)
  currentRateTypeData.value = response.data?.data
  rateTypeOptions.value = response.data?.data?.map((item: any) => {
    return {
      label: item.rateTypeName,
      value: item.rateTypeId
    }
  })
  selectRateType.value = rateTypeOptions.value[0]?.value;
  console.log('rateTypeOptions.value', rateTypeOptions.value)

  console.log('selectRateType.value', selectRateType.value)
  return response.data?.data || []
}
fectRateTypes()
// Function to get room rate for a specific room type and date
const roomRateForDate = computed(() => {
  console.log('rumm', selectRateType.value)
  console.log('currentRateTypeData.value', currentRateTypeData.value)
  if (!selectRateType.value || !currentRateTypeData.value.length) {
    return []
  }

  // Find the selected rate type in the current data
  const selectedRateTypes = currentRateTypeData.value.find((rateType: any) =>
    rateType.rateTypeId === selectRateType.value
  )
  console.log('selected rates', selectedRateTypes)
  if (!selectedRateTypes || !selectedRateTypes.roomTypes) {
    return []
  }
  const result = {} as any;
  selectedRateTypes.roomTypes.forEach((roomType: any) => {
    result[roomType.roomTypeId] = roomType.roomRate
  })
  console.log('result', result)
  return result;
}
)

const legendSections = [
  {
    title: 'Booking Status',
    items: [
      { label: 'Arrived', color: '#f87171' },
      { label: 'Checked Out', color: '#60a5fa' },
      { label: 'Due Out', color: '#b91c1c' },
      { label: 'Confirmed Reservation', color: '#4ade80' },
      { label: 'Maintenance Block', color: '#1e3a8a' },
      { label: 'Stayover', color: '#f97316' },
      { label: 'Dayuse Reservation', color: '#22c55e' },
      { label: 'Dayuse', color: '#7f1d1d' }
    ]
  },
  {
    title: 'Booking Indicators',
    items: [
      { label: 'Group Owner', icon: 'UserGroupIcon' },
      { label: 'Group Booking', icon: 'UserGroupIcon' },
      { label: 'Payment Pending', icon: 'CreditCardIcon' },
      { label: 'Stop Room Move', icon: 'NoSymbolIcon' },
      { label: 'Single Lady', icon: 'UserIcon' },
      { label: 'VIP Guest', icon: 'StarIcon' },
      { label: 'Split Reservation', icon: 'ScissorsIcon' }
    ]
  },
  {
    title: 'Room Indicators',
    items: [
      { label: 'No Smoking', icon: 'NoSymbolIcon' },
      { label: 'Smoking', icon: 'FireIcon' },
      { label: 'Dirty', icon: 'ExclamationCircleIcon' },
      { label: 'Clean', icon: 'CheckCircleIcon' },
      { label: 'Connected Rooms', icon: 'LinkIcon' },
      { label: 'Work Order', icon: 'WrenchIcon' },
      { label: 'ADA / Accessible Room', icon: 'UserIcon' },
      { label: 'Pet Friendly Room', icon: 'HeartIcon' },
      { label: 'Unassigned Room', color: '#e5e7eb' },
      { label: 'Inventory', color: '#fecaca' },
      { label: 'Unconfirmed Bookings', color: '#f87171' }
    ]
  }
];
</script>