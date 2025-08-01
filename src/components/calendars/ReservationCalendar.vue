<template>
  <div class="reservation-calendar font-sans h-screen flex flex-col ">
    <div class="flex items-center justify-between mb-4 me-5 ms-5 sticky top-0 mt-5  bg-white z-20 pb-2">
      <div class="flex items-center gap-2">
        <button @click="router.back()" class="bg-red-900 text-white rounded-full flex px-2 text-sm py-1">
          <X class="w-4"></X> {{ $t('Close') }}
        </button>
        <h2 class="text-2xl font-bold">{{ $t('Reservations Calendar') }}</h2>
      </div>
      <div class="flex gap-2 flex-wrap ">
        <button @click="addReservation" class="btn bg-primary text-white rounded-full px-2 text-sm">
          {{ $t('Add reservation') }}</button>
        <input type="date" v-model="selectedDate" class="border rounded px-2 py-1" />
        <button class="btn" @click="prevDay">&lt;</button>
        <button class="btn btn-default" @click="nextDay">&gt;</button>
        <button class="btn rounded-full px-3 text-sm"
          :class="selectedDate === new Date().toISOString().split('T')[0] ? 'bg-primary text-white' : 'btn-default'"
          @click="setToday">{{ $t('Today') }}</button>
        <button class="btn rounded-full px-2 text-sm"
          :class="daysToShow === 7 ? 'bg-primary text-white' : 'btn-default'" @click="setDays(7)">7 {{ $t('Days')
          }}</button>
        <button class="btn rounded-full px-2 text-sm"
          :class="daysToShow === 15 ? 'bg-primary text-white' : 'btn-default'" @click="setDays(15)">15 {{ $t('Days')
          }}</button>
        <button class="btn rounded-full px-2 text-sm"
          :class="daysToShow === 30 ? 'bg-primary text-white' : 'btn-default'" @click="setDays(30)">30 {{ $t('Days')
          }}</button>
      </div>
    </div>
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-y-auto">
        <table class="min-w-full border border-gray-300 rounded overflow-hidden text-xs">
          <thead>
            <tr>
              <th class="bg-gray-100 px-2 py-1 border border-gray-300 w-24 min-w-[6rem]">{{ $t('Room') }}</th>
              <th v-for="(date, idx) in visibleDates" :key="idx"
                class="bg-gray-50 px-2 py-1 text-center border border-gray-300">
                <div>{{ formatDate(date) }}</div>
                <div class="text-xs text-gray-400">{{ formatDay(date) }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
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
                    class="font-bold bg-green-100 px-2 py-1 border border-gray-300">
                    {{ group.room_type }}
                    <span class="text-xs text-gray-500 font-normal">({{ group.room_details.length }})</span>
                  </td>
                </tr>
                <tr v-for="room in group.room_details" :key="room.room_number || room.room_status + Math.random()">
                  <td class="font-semibold px-2 py-1 border border-gray-300">{{ room.room_number || '-' }}</td>
                  <template v-for="cell in getRoomRowCellsApi(group, room)" :key="cell.key">
                    <td v-if="cell.type === 'reservation'" :colspan="cell.colspan"
                      class="relative px-0 py-0 h-12 border border-gray-300">
                      <div :class="[
                        'cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white flex items-center gap-1 w-[95%]',
                        getReservationColor(cell.reservation.reservation_status)
                      ]" @click="showReservationModal(cell.reservation)">
                        <span>
                          {{ cell.reservation.guest_name }}
                          <br>
                        </span>
                      </div>
                    </td>
                    <td v-else-if="cell.type === 'room'" class="px-0 py-0 h-12 border border-gray-300">
                      <div
                        :class="['flex items-center justify-center h-full w-full', getRoomStatusColor(room.room_status)]">
                        <component :is="getRoomStatusIcon(room.room_status)"
                          :class="['w-5 h-5 mr-1', getRoomStatusColor(room.room_status)]" />
                        <span class="text-xs font-semibold">{{ $t(room.room_status || '-') }}</span>
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
        <table class="min-w-full border-t border border-gray-300 text-xs">
          <tfoot>
            <tr class="text-md">
              <td colspan="1" class="bg-gray-100 font-bold border border-gray-300 w-24 min-w-[6rem]">
                {{ $t('Room Legend') }}
              </td>
              <td colspan="99" class="bg-gray-50 border border-gray-300">
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
  <!-- Reservation Modal -->
  <div v-if="modalReservation" class="fixed inset-0 z-50 flex items-center justify-center bg-black/2 bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg w-[400px] max-w-full relative">
      <button @click="closeReservationModal" class="absolute top-2 right-2 text-gray-500 hover:text-red-500">
        <X class="w-5 h-5 text-white" />
      </button>
      <div class="bg-primary text-white rounded-t-lg px-4 py-2">
        <div class="font-bold">{{ $t('guests') }}: {{ modalReservation.guests }} {{ $t('guests') }}</div>
        <div>{{ $t('Guest name') }}: <span class="font-bold">{{ modalReservation.guest_name }}</span></div>
        <div>{{ $t('reservation_id') }}: <span class="font-bold">{{ modalReservation.reservation_id }}</span></div>
        <div>{{ $t('reservation_code') }}: <span class="font-bold">{{ modalReservation.reservation_code }}</span></div>
        <div class="flex gap-3 mt-2">
          <span class="flex items-center gap-1">
            <component :is="getReservationTypeIcon(modalReservation.reservation_type)" class="w-4 h-4" />
            <span class="text-xs">{{ $t(modalReservation.reservation_type || '-') }}</span>
          </span>
          <span class="flex items-center gap-1">
            <component :is="getCustomerTypeIcon(modalReservation.customer_type)" class="w-4 h-4" />
            <span class="text-xs">{{ $t(modalReservation.customer_type || '-') }}</span>
          </span>
        </div>
      </div>

      <div class="">
        <ChevronInfo>
          <template #left>
            <div class="text-center">
              <div class="font-bold text-xl">{{ formatDate(new Date(modalReservation.check_in_date)) }}</div>
              <div class="text-md text-black">{{ formatDay(new Date(modalReservation.check_in_date)) }}</div>
            </div>
          </template>
          <template #right>
            <div class="text-center">
              <div class="font-bold text-xl">{{ formatDate(new Date(modalReservation.check_out_date)) }}</div>
              <div class="text-md text-black">{{ formatDay(new Date(modalReservation.check_out_date)) }}</div>
            </div>
          </template>
        </ChevronInfo>
      </div>
      <div class="flex justify-between items-center mb-2 mt-2 px-2">
        <div class="flex gap-2">
          <div class="text-md text-gray-500">{{ $t('Comment') }}:</div>
          <div>{{ modalReservation.comment || 'none' }}</div>
        </div>
      </div>
      <div class="">
        <ChevronInfo>
          <template #left>
            <div class="text-center">
              <div class="font-bold text-sm ">{{ $t('Amount Due') }}</div>
              <div class="font-bold text-xl">{{ formatCurrency(modalReservation.remaining_amount ?? 0) }}</div>
            </div>
          </template>
          <template #right>
            <div class="text-center">
              <div class="font-bold text-sm">{{ $t('paid') }}</div>
              <div class="font-bold text-xl">{{ formatCurrency(modalReservation.total_amount ?? 0) }}</div>
            </div>
          </template>
        </ChevronInfo>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HotelIcon, GlobeIcon, UserIcon, UsersIcon, BookIcon } from 'lucide-vue-next'

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
import { CheckIcon, ErrorIcon, WarningIcon, UserCircleIcon, GridIcon } from '@/icons'

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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { getDailyOccupancyAndReservations } from "@/services/api"
import router from '@/router'
import { isLoading } from '@/composables/spinner'

const serviceStore = useServiceStore()
const { t, locale } = useI18n()
const serviceResponse = ref<any>({})

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
  modalReservation.value = reservation
}
function closeReservationModal() {
  modalReservation.value = null
}
const selectedDate = ref((new Date()).toISOString().split('T')[0])
const daysToShow = ref(15)

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
    (r:any) => r.assigned_room_number === room.room_number || room.room_number === null
  )
  while (i < visibleDates.value.length) {
    const date = visibleDates.value[i]
    const dStr = date.toISOString().split('T')[0]

    // Find reservation starting on this date
    let reservation = reservations.find((r:any) => {
      // If reservation starts today
      return r.check_in_date.startsWith(dStr)
    })

    // If no reservation starts today, check if a reservation started before and is still ongoing
    if (!reservation) {
      reservation = reservations.find((r:any) => {
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

      cells.push({
        type: 'reservation',
        reservation,
        colspan,
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

import { watch } from 'vue'
import { CheckCheckIcon, CheckCircle, X } from 'lucide-vue-next'
import ChevronInfo from '../common/ChevronInfo.vue'
import { formatCurrency } from '../utilities/UtilitiesFunction'
watch([selectedDate, daysToShow], () => {
  getLocaleDailyOccupancyAndReservations()
})

const addReservation = () => {
  router.push({ name: "Add Booking" })
}
</script>