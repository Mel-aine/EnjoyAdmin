<template>
  <!-- <AdminLayout> -->
  <FullScreenLayout>
    <OverLoading v-if="isRefreshing" />
  <AppHeader :show-sidebar="true" />
  <div class="reservation-calendar font-sans h-screen flex flex-col ">

      <div class="bg-white dark:bg-gray-900 px-6 py-1 flex items-center justify-between rounded-b-lg border-b dark:border-gray-700">
        <div class="flex gap-2">
          <InputDatePicker class="bg-white dark:bg-gray-800 rounded-lg w-40 h-full" v-model="selectedDate" />
          <div
            class="flex rounded-lg px-2 text-sm font-semibold transition align-middle py-3 bg-white dark:bg-gray-800 text-primary shadow border border-gray-400 dark:border-gray-700 focus:ring focus:ring-primary/30">
            <label>{{ $t('show') }}</label>
            <select v-model="daysToShow" @change="setDays(Number(daysToShow))" class="outline-0">
              <option :value="7">7 {{ $t('days') }}</option>
              <option :value="15">15 {{ $t('days') }}</option>
              <option :value="30">30 {{ $t('days') }}</option>
            </select>
          </div>

          <div class="flex gap-5 dark:text-white text-sm item-center self-center align-middle">
            <div v-for="(item, index) in statusElements" :key="index" class="flex gap-2">
              <span>{{ $t(item) }}</span>
              <span class="rounded-full bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-2">{{ getRoomStatusCount(item) }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2  items-center">
          <Select :options="rateTypeOptions" v-model="selectRateType" class="min-w-[12rem]"
            :is-loading="loadingRates" />
          <StatusLegend :sections="legendSections" />
        </div>
      </div>
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Fixed Header -->
        <div class="border border-gray-400 dark:border-gray-700 border-b-0">
          <table class="w-full text-sm table-fixed">
            <thead>
              <tr>
                <th class="bg-gray-100 dark:bg-gray-800 px-2 py-1 border-r border-gray-400 dark:border-gray-700" :style="`width: calc(200px)`">
                  <div class="flex justify-between items-center">
                    <div class="max-w-md">
                      <SelectDropdown v-model="selectedRoomTypes" :options="roomTypeOptions"
                        :placeholder="$t('roomType')" button-class="bg-white dark:bg-gray-800 text-primary border border-blue-200 dark:border-gray-700  w-42"
                        dropdown-class="w-full" :select-all-text="$t('bookings.calendar.labels.selectAll')" :max-display-items="3" />
                    </div>
                  </div>

                </th>
                <th v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['px-2 py-1 text-center border-r border-gray-400 dark:border-gray-700 relative', isWeekend(date) ? 'bg-orange-200/25 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-800']"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`">
                  <button v-if="idx === 0" @click="prevDay"
                    class="absolute left-1 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div class="dark:text-gray-300">{{ formatDate(date) }}</div>
                  <div class="text-xs text-gray-400 dark:text-gray-300">{{ formatDay(date) }}</div>
                  <button v-if="idx === visibleDates.length - 1" @click="nextDay"
                    class="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
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
        <div class="flex-1 overflow-y-auto border border-gray-400 dark:border-gray-700   scrollbar-hide">
          <table class="w-full text-sm table-fixed">
            <colgroup>
              <col :style="`width: 200px`">
              <col v-for="(date, ind) in visibleDates" :key="ind"
                :style="`width: calc((100% - 200px) / ${visibleDates.length})`">
            </colgroup>
            <tbody>
              <template v-if="isLoading || !apiRoomGroups || !apiOccupancyMetrics">
                <tr v-for="i in 8" :key="i">
                  <td class="px-2 py-1">
                    <div class="h-4  w-50 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  </td>
                  <td v-for="j in visibleDates.length" :key="j" class="px-0 py-2 h-4">
                    <div class="h-4  w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <template v-for="group in apiRoomGroups" :key="group.room_type">
                  <template v-if="selectedRoomTypes.includes(group.room_type_id)">
                    <tr>
                      <td
                        class="h-8 min-w-50 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 border border-gray-400 dark:border-gray-700 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors dark:text-gray-200"
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
                        class="bg-green-100 dark:bg-green-900/30 px-2 py-1 border border-gray-400 dark:border-gray-700 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 text-center dark:text-gray-200">
                        <div class="flex flex-col gap-1 justify-center align-middle self-center items-center">
                          <div class="flex gap-1">
                            <span
                              class="text-xs font-medium text-red-200 dark:text-red-300 border border-orange-300 dark:border-orange-700 bg-white dark:bg-gray-800 px-1 py-0 rounded">
                              {{ getAvailableRoomsByType(date, group.room_type_id) }}
                            </span>
                            <span v-if="getUnassignedRoomsByType(date, group.room_type_id)"
                              class="text-xs font-medium text-blue-500 dark:text-blue-300 border border-blue-500 bg-white dark:bg-gray-800 px-1 py-0 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              @click="handleUnassignedRoomClick(date, group.room_type_id)">
                              {{ getUnassignedRoomsByType(date, group.room_type_id) }}
                            </span>
                          </div>
                          <span class="text-xs">{{ roomRateForDate[group.room_type_id] ?? t('N/A') }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-for="room in group.room_details" :key="room.room_number || room.room_status + Math.random()"
                      v-show="!collapsedRoomTypes[group.room_type]" class="transition-all duration-200 ease-in-out">
                      <td class="text-sm uppercase px-2 py-1 border border-gray-400 dark:border-gray-700 dark:text-gray-300">
                        <div class="flex justify-between">
                          <span>{{ room.room_number || '-' }}</span>
                          <div class="flex gap-1 text-gray-500 dark:text-gray-400">

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
                             <span class="text-xs" v-if="room.is_smoking">
                              <Cigarette class="w-4 h-4" />
                            </span>
                            <span v-else>
                              <CigaretteOff class="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </td>

                      <template v-for="cell in getRoomRowCellsApi(group, room)" :key="cell.key">
                        <!-- Réservation -->
                        <td v-if="cell.type === 'reservation'" :colspan="cell.colspan"
                          class="relative px-[1px] py-[1px] h-8 border border-gray-400 dark:border-gray-700 group">
                          <div :class="[
                            'cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 px-[1px] py-[1px] text-sm uppercase font-bold text-white flex items-center gap-1 w-[80%] min-w-0 ',
                            getReservationColor(cell.reservation.reservation_status),
                          ]" :style="getReservationStyle(cell)" @click="showReservationModal(cell.reservation)"
                            @mouseenter="showReservationTooltip(cell.reservation, $event)"
                            @mouseleave="hideReservationTooltip">
                            <span class="truncate">
                              {{ cell.reservation.guest_name }}
                              <br>
                            </span>

                            <div class="absolute -top-2 flex items-center gap-1">
                              <Crown v-if="cell.reservation.is_master"
                                class="bg-white dark:bg-gray-800 w-3 h-3 text-yellow-400 flex-shrink-0" :title="$t('Primary')" />
                              <DollarSignIcon v-if="cell.reservation?.is_balance"
                                class="bg-red-400 w-3 h-3 text-yellow-400 flex-shrink-0" />
                              <User2 v-if="cell.reservation?.isWomen"
                                class="bg-pink-400 w-3 h-3 text-white flex-shrink-0" :title="$t('Female Guest')" />
                            </div>
                          </div>
                          <div
                            class="absolute bottom-0  z-[99999] over  w-full flex-col items-center hidden mb-5 group-hover:flex">
                            <div
                              class="relative rounded-md  z-[99999] p-4 text-md leading-none text-white whitespace-no-wrap bg-blue-950 shadow-lg">
                              <div class='flex flex-col gap-2'>
                                <div class="flex justify-between">{{ $t('Name') }}: <span class="">{{
                                  cell.reservation.guest_name
                                    }}</span></div>
                                <div class="flex justify-between">{{ $t('Check-in Date') }}: <span class="">{{
                                  formatDateLocal(cell.reservation.check_in_date) }} {{ cell.reservation.check_in_time
                                    }}</span></div>
                                <div class="flex justify-between gap-4">{{ $t('Check-out Date') }}: <span class="">{{
                                  formatDateLocal(cell.reservation.check_out_date) }} {{
                                      cell.reservation.check_out_time
                                    }}</span></div>
                                <div class="flex justify-between text-blue-600">
                                  <span class=" font-medium">{{ $t('Total') }}:</span>
                                  <span class="">{{
                                    formatCurrency(cell.reservation.balance_summary?.totalChargesWithTaxes) }}</span>
                                </div>
                                <div class="flex justify-between text-green-600">
                                  <span class=" font-medium">{{ $t('paid') }}:</span>
                                  <span class="">{{
                                    formatCurrency(cell.reservation.balance_summary?.totalPayments)
                                  }}</span>
                                </div>
                                <div class="flex justify-between text-red-600">
                                  <span class=" font-medium">{{ $t('balance') }}:</span>
                                  <span class="">{{
                                    formatCurrency(cell.reservation.balance_summary?.outstandingBalance) }}</span>
                                </div>
                              </div>
                            </div>
                            <div class="w-3 h-3 -mt-2 rotate-45 bg-blue-light-950"></div>
                          </div>
                        </td>

                        <!-- Room Block -->
                        <td v-else-if="cell.type === 'room_block'" :colspan="cell.colspan"
                          class="relative px-[1px] py-[1px] h-8 border border-gray-400">
                          <div :class="[
                            'absolute left-0 top-1/2 -translate-y-1/2 px-[1px] py-[1px] text-sm uppercase font-bold text-white flex items-center gap-1 w-[80%] min-w-0 ',
                            getRoomBlockColor(cell.roomBlock.status),
                          ]" :style="getReservationStyle(cell)">
                            <span class="truncate">
                              {{ cell.roomBlock.reason }}
                              <br>
                            </span>
                          </div>
                        </td>

                        <!-- Chambres avec statut spécial (maintenance, out_of_service, cleaning) -->
                        <td
                          v-else-if="cell.type === 'room' && ['maintenance', 'out_of_service', 'cleaning'].includes(room.room_status)"
                          class="px-[1px] py-[1px] h-8 border border-gray-400">
                          <div
                            :class="['flex items-center justify-center h-full w-full', getRoomStatusColor(room.room_status)]">
                            <component :is="getRoomStatusIcon(room.room_status)"
                              :class="['w-5 h-5 mr-1', getRoomStatusColor(room.room_status)]" />
                          </div>
                        </td>

                        <!-- Cellules vides/sélectionnables -->
                        <td v-else-if="shouldShowCell(group, room, cell)"
                          :colspan="getUnifiedColspan(group, room, cell)" :class="[
                            'px-[1px] py-[1px] h-8 border dark:bg-black border-gray-400 cell-transition cell-selectable cell-hoverable relative',
                            getUnifiedCellClass(group, room, cell)
                          ]" @mousedown="startCellSelection(group.room_type, room.room_number, cell.date, $event)"
                          @mouseenter="updateCellSelection(group.room_type, room.room_number, cell.date, $event)"
                          @mouseup="endCellSelection($event)">
                          <div v-if="isCellSelected(group.room_type, room.room_number, cell.date)"
                            class="absolute h-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-600 border-l-2 border-r-2 border-blue-700 rounded-sm"
                            :style="getSelectionStyle(group.room_type, room.room_number, cell.date)">
                          </div>
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
          <table class="w-full border-t border border-gray-400 text-sm table-fixed">

            <tfoot>
              <tr>
                <td class="bg-gray-100 dark:bg-black dark:text-white border h-7 border-gray-400 text-center" :style="`width: 200px`">
                  {{ $t('Unassigned reservations') }}</td>
                <td v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['text-center border border-gray-400 dark:bg-black dark:text-white', isWeekend(date) ? 'bg-gray-100' : '']"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`" v-html="getUnassignedApi(date)">
                </td>
              </tr>
              <tr>
                <td class="bg-gray-100 dark:bg-black dark:text-white h-7 border border-gray-400 text-center" :style="`width: 200px`">% {{
                  $t('Occupancy') }}
                </td>
                <td v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['text-center border border-gray-400 dark:bg-black dark:text-white', isWeekend(date) ? 'bg-gray-100' : '']"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`">{{ getOccupancyApi(date) }} %</td>
              </tr>
              <tr>
                <td class="bg-gray-100 dark:bg-black dark:text-white h-7 border border-gray-400 text-center" :style="`width: 200px`">
                  {{ $t('Available Rooms') }}</td>
                <td v-for="(date, idx) in visibleDates" :key="idx"
                  :class="['text-center border border-gray-400 dark:bg-black dark:text-white', isWeekend(date) ? 'bg-gray-100' : '']"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`">{{ getAvailableRoomsApi(date) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    <!-- Date Selection Tooltip -->
    <div v-if="dateSelection.isSelecting && dateSelection.startDate && dateSelection.endDate"
      :style="tooltipPosition ? `position:fixed;left:${tooltipPosition.x + 12}px;top:${tooltipPosition.y - 60}px;z-index:1000;` : ''"
      class="rounded-lg bg-white dark:bg-gray-900 shadow-lg border dark:border-gray-700 text-sm pointer-events-none px-4 py-2">
      <div class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ $t('Selected Dates') }}</div>
      <div class="text-gray-600 dark:text-gray-300">
        {{ formatDate(dateSelection.startDate) }} - {{ formatDate(dateSelection.endDate) }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ getSelectionNights() }} {{ getSelectionNights() > 1 ? $t('nights') : $t('night') }}
      </div>
    </div>

    <!-- Confirmed Selection Tooltip with Action -->
    <div v-if="getSelectionInfo()" :style="tooltipStyle"
      class="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
      <div class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg px-4 py-2">
        <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ $t('SelectionDetails') }}</h3>
      </div>

      <div class="p-4">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 dark:text-gray-300">
          <div><strong>{{ $t('Room') }}:</strong></div>
          <div>{{ getSelectionInfo()?.roomNumber }}</div>

          <div><strong>{{ $t('roomType') }}:</strong></div>
          <div>{{ getSelectionInfo()?.roomType }}</div>

          <div><strong>{{ $t('common.from') }}:</strong></div>
          <div>{{ formatDate(getSelectionInfo()?.startDate ?? new Date()) }} {{ getSelectionTimes().checkinTime }}</div>

          <div class="capitalize"><strong>{{ $t('to') }}:</strong></div>
          <div>{{ formatDate(getSelectionInfo()?.endDate ?? new Date()) }} {{ getSelectionTimes().checkoutTime }}</div>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg px-4 py-3 flex justify-end gap-2">
        <button @click="clearCellSelection"
          class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition">
          {{ $t('Clear') }}
        </button>
        <button @click="navigateToAddReservationFromCells"
          class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition">
          {{ $t('Booking') }}
        </button>
      </div>
    </div>
    <!--tooltip-->

    <template v-if="modalReservation && showDetail">
      <ReservationRigthModal :is-open="showDetail" :title="$t('reservationDetails')"
        :reservation-data="modalReservation" @close="closeReservationModal" @save="handleReservationSave" />
    </template>

    <!-- Unassigned Reservations Modal -->
    <UnassignedReservationsModal v-if="showUnassignedModal" :is-open="showUnassignedModal" :room-type-id="selectedRoomTypeId"
      :date="selectedUnassignedDate" :reservations="unassignedReservations" @close="closeUnassignedModal"
      @room-assigned="handleRoomAssigned" />

    <!-- Assign Room Reservation Modal -->
    <template v-if="selectedReservationForAssignment">
      <RoomSelectionModal :is-open="showAssignRoomModal" :reservation-id="selectedReservationForAssignment.id"
        @close="closeAssignRoomModal" @refresh="refresh" />
    </template>
  </FullScreenLayout>
  <!-- </AdminLayout> -->
</template>

<script setup lang="ts">
import { HotelIcon, GlobeIcon, UserIcon, UsersIcon, BookIcon, Cigarette, CigaretteOff, LucideBrush, Crown, DollarSignIcon, User2, CheckCircleIcon, LinkIcon, CheckCircle } from 'lucide-vue-next'

import { watch, onUnmounted } from 'vue'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue';
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useBookingStore } from '@/composables/booking'
import { getDailyOccupancyAndReservations } from "@/services/api"
//import CrownIcon from '@/icons/CrownIcon.vue'
import DollarsIcons from '@/icons/BookingStatus/dollarsIcone.vue'
import CrownIcons from '@/icons/BookingStatus/CrownIcon.vue'
import UsersIcons from '@/icons/BookingStatus/UserGroupIcon.vue'
import HandIcons from '@/icons/BookingStatus/HandIcon.vue'
import StarIcons from '@/icons/BookingStatus/starIcon.vue'
import SplitIcons from '@/icons/BookingStatus/splitIcon.vue'
import LadyIcons from '@/icons/BookingStatus/ladyIcon.vue'
import BroomIcons from '@/icons/BookingStatus/BroomIcon.vue'
import PetIcons from '@/icons/BookingStatus/petIcon.vue'
import WorkOdersIcons from '@/icons/BookingStatus/WorkOdersIcon.vue'
import AccessibleIcons from '@/icons/BookingStatus/AccessibleIcon.vue'
import { useStatusColor } from '@/composables/statusColorStore'

const isLoading = ref(false);
const isRefreshing = ref(false);
const laoded = ref(false);
const statusColorStore = useStatusColor()
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
import OverLoading from '../spinner/OverLoading.vue'
import ReservationRigthModal from '../reservations/ReservationRigthModal.vue'
import Select from '../forms/FormElements/Select.vue'
import { getRateStayViewTypeByHotelId, } from '../../services/configrationApi';
import SelectDropdown from '../common/SelectDropdown.vue';
import StatusLegend from '../common/StatusLegend.vue';
import UnassignedReservationsModal from '../modal/UnassignedReservationsModal.vue';
import { useRouter } from 'vue-router'
import RoomSelectionModal from '../modal/RoomSelectionModal.vue';
import { formatCurrency, formatDateLocal } from '../utilities/UtilitiesFunction';



const router = useRouter()
const bookingStore = useBookingStore()
const selectionTooltipPosition = ref({ x: 0, y: 0 })
const isTooltipAbove = ref(false)
const selectedRoomTypeId = ref<number | null>(null)

const tooltipStyle = computed((): Record<string, string | number> => {
  const pos = selectionTooltipPosition.value;
  if (!pos) return {};
  const x = pos.x - 150;

  if (isTooltipAbove.value) {
    const bottom = window.innerHeight - pos.y + 20;
    return {
      position: 'fixed',
      left: `${x}px`,
      bottom: `${bottom}px`,
      zIndex: 1000,
    }
  } else {
    const top = pos.y + 20;
    return {
      position: 'fixed',
      left: `${x}px`,
      top: `${top}px`,
      zIndex: 1000,
    }
  }
});
// Date selection state
const dateSelection = ref({
  isSelecting: false,
  startDate: null as Date | null,
  endDate: null as Date | null,
  confirmedStart: null as Date | null,
  confirmedEnd: null as Date | null,
})





const loadingRates = ref(false);
function getSelectionNights(): number {
  if (!dateSelection.value.startDate || !dateSelection.value.endDate) return 0
  const start = Math.min(
    dateSelection.value.startDate.getTime(),
    dateSelection.value.endDate.getTime(),
  )
  const end = Math.max(
    dateSelection.value.startDate.getTime(),
    dateSelection.value.endDate.getTime(),
  )
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}




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
const showUnassignedModal = ref<boolean>(false)
const selectedUnassignedDate = ref<string>('')
const unassignedReservations = ref<any[]>([])
const showAssignRoomModal = ref<boolean>(false)
const selectedReservationForAssignment = ref<any>(null)

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

// Unassigned reservations modal handlers

function openUnassignedModal(date: string) {
  selectedUnassignedDate.value = date

  // Récupérer toutes les réservations pour cette date
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === date)
  console.log("Metric for date", date, metric)

  if (metric && metric.unassigned_reservations_details) {
    // Utiliser les détails complets des réservations non assignées
    unassignedReservations.value = metric.unassigned_reservations_details
  } else {
    // Alternative : filtrer depuis toutes les réservations
    const allReservations = apiRoomGroups.value.flatMap((group: any) => group.reservations || [])
    unassignedReservations.value = allReservations.filter((res: any) => {
      const hasUnassignedRooms = res.reservationRooms?.some((room: any) => !room.roomId)
      const matchesDate = res.checkInDate === date ||
                          (res.checkInDate <= date && res.checkOutDate > date)
      return hasUnassignedRooms && matchesDate
    })
  }

  console.log('Opening unassigned modal with:', unassignedReservations.value)
  showUnassignedModal.value = true
}

function closeUnassignedModal() {
  showUnassignedModal.value = false
  selectedUnassignedDate.value = ''
  unassignedReservations.value = []
}

function handleRoomAssigned(data: any) {
  console.log('Room assigned:', data)
  // Refresh the calendar data when room is assigned
  refresh()
  closeUnassignedModal()
}

// AssignRoomReservation modal handlers
function closeAssignRoomModal() {
  showAssignRoomModal.value = false
  selectedReservationForAssignment.value = null
}

function handleRoomAssignmentComplete(data: any) {
  console.log('Room assignment completed:', data)
  // Refresh the calendar data when room is assigned
  refresh()
  closeAssignRoomModal()
}

// Global function for handling unassigned clicks (called from HTML)
; (window as any).handleUnassignedClick = (date: string) => {
  openUnassignedModal(date)
}

// Handle unassigned room click with room type filtering
function handleUnassignedRoomClick(date: Date, roomTypeId: number) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)

  if (metric && metric.unassigned_room_reservations_by_type) {
    const roomTypeData = metric.unassigned_room_reservations_by_type.find((rt: any) => rt.room_type_id === roomTypeId)

    if (roomTypeData && roomTypeData.unassigned_reservations) {
      const reservations = roomTypeData.unassigned_reservations

      if (reservations.length === 1) {
        selectedReservationForAssignment.value = reservations[0]
        showAssignRoomModal.value = true
      } else if (reservations.length > 1) {
        selectedUnassignedDate.value = dStr
        unassignedReservations.value = reservations
        selectedRoomTypeId.value = roomTypeId
        showUnassignedModal.value = true
        console.log("Opening unassigned modal with filtered reservations:", reservations)
      }
    }
  }
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
const end_date = computed(
  () => visibleDates.value[visibleDates.value.length - 1].toISOString().split('T')[0],
)
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

function getRoomRowCellsApi(group: any, room: any) {
  const cells: any[] = []
  let i = 0

  // --- Récupération des réservations ---
  console.log("group", group)
  const allReservations = group.reservations || []
  const reservations = allReservations.filter((r: any) => {
    return (
      r.assigned_room_number === room.room_number ||
      r.room_number === room.room_number ||
      (room.room_number === null && !r.assigned_room_number)
    )
  })

  // --- Récupération des room blocks ---
  console.log("apiRoomBlocks", apiRoomBlocks.value)
  const roomBlocks = apiRoomBlocks.value.filter(
    (b: any) => b.room && b.room.room_number === room.room_number
  )

  while (i < visibleDates.value.length) {
    const date = visibleDates.value[i]
    const dStr = date.toISOString().split("T")[0]

    // --- Vérifier d'abord les room blocks (priorité plus haute) ---
    const roomBlock = roomBlocks.find((b: any) => {
      const startDate = new Date(b.block_from_date)
      const endDate = new Date(b.block_to_date)
      return startDate <= date && endDate >= date
    })

    if (roomBlock) {
      // const start = new Date(roomBlock.block_from_date)
      const end = new Date(roomBlock.block_to_date)
      const lastVisible = visibleDates.value[visibleDates.value.length - 1]
      const colspan = visibleDates.value.filter(
        (d) => d >= date && d <= end && d <= lastVisible
      ).length

      cells.push({
        type: "room_block",
        roomBlock,
        colspan,
        date,
        key: i,
      })
      i += colspan
      continue
    }

    // --- Sinon, on cherche une réservation ---
    let reservation = reservations.find((r: any) => {
      return r.check_in_date.startsWith(dStr)
    })

    if (!reservation) {
      reservation = reservations.find((r: any) => {
        const start = new Date(r.check_in_date)
        const end = new Date(r.check_out_date)
        return start < date && end >= date
      })
    }

    if (reservation) {
      console.log('Reservation cell:', reservation)
      // const start = new Date(reservation.check_in_date)
      const end = new Date(reservation.check_out_date)
      const lastVisible = visibleDates.value[visibleDates.value.length - 1]

      const colspan = visibleDates.value.filter(
        (d: any) => d >= date && d <= end && d <= lastVisible
      ).length

      const is_check_in = reservation.check_in_date.startsWith(dStr)

      const reservationDates = visibleDates.value.filter(
        (d: any) => d >= date && d <= end && d <= lastVisible
      )
      const lastVisibleDateOfReservation =
        reservationDates.length > 0
          ? reservationDates[reservationDates.length - 1]
          : null
      const checkOutDate = new Date(reservation.check_out_date)

      const is_check_out =
        lastVisibleDateOfReservation &&
        lastVisibleDateOfReservation.getFullYear() ===
        checkOutDate.getFullYear() &&
        lastVisibleDateOfReservation.getMonth() === checkOutDate.getMonth() &&
        lastVisibleDateOfReservation.getDate() === checkOutDate.getDate()

      cells.push({
        type: "reservation",
        reservation,
        middle: reservation.check_in_date.startsWith(dStr),
        colspan,
        is_check_in,
        is_check_out,
        date,
        key: i,
      })
      i += colspan
    } else {
      // Pas de réservation ni de block → cellule libre
      cells.push({
        type: "room",
        date,
        key: i,
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
  if (metric && metric.unassigned_reservations > 0) {
    return `<a href="#" onclick="event.preventDefault(); handleUnassignedClick('${dStr}')" class="text-blue-500 hover:underline">${metric.unassigned_reservations}</a>`
  }
  return '0'
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

function getAvailableRoomsByType(date: Date, roomTypeId: number) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)

  if (metric && metric.available_rooms_by_type) {
    const roomTypeData = metric.available_rooms_by_type.find((rt: any) => rt.room_type_id === roomTypeId)
    return roomTypeData ? roomTypeData.available_count : '0'
  }

  return '0'
}

function getUnassignedRoomsByType(date: Date, roomTypeId: number) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)

  if (metric && metric.unassigned_room_reservations_by_type) {
    const roomTypeData = metric.unassigned_room_reservations_by_type.find((rt: any) => rt.room_type_id === roomTypeId )
    return roomTypeData ? roomTypeData.unassigned_count : '0'
  }

  return '0'
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
  if (cell.reservation && cell.reservation.reservation_status) {
    const backgroundColor = getReservationColor(cell.reservation.reservation_status);
    return { width, left, backgroundColor };
  } else {
    const backgroundColor = getReservationColor('blocked');
    return { width, left, backgroundColor };
  }
}
const getReservationColor = statusColorStore.getReservationColor;


function getRoomBlockColor(status: string) {
  return getReservationColor('blocked');
}


// --- API CALL ---
const getLocaleDailyOccupancyAndReservations = async () => {
  isLoading.value = !laoded.value;
  isRefreshing.value = laoded.value;
  const serviceId = serviceStore.serviceId!
  const response = await getDailyOccupancyAndReservations(serviceId, start_date.value, end_date.value)
  serviceResponse.value = response.data
  console.log('this is the response', response)
  isLoading.value = false;
  isRefreshing.value = false;
  laoded.value = true;
}
const refresh = async () => {
  isRefreshing.value = true
  try {
    showModalAddingModal.value = false;
    closeAssignRoomModal();
    const serviceId = serviceStore.serviceId!
    const response = await getDailyOccupancyAndReservations(serviceId, start_date.value, end_date.value)
    serviceResponse.value = response.data
    console.log('this is the response', serviceResponse.value)
  } finally {
    isRefreshing.value = false
  }
}

// Watch for external refresh signals from the booking store
watch(
  () => bookingStore.shouldRefreshCalendar,
  (shouldRefresh) => {
    if (shouldRefresh) {
      refresh()
      bookingStore.clearCalendarRefresh()
    }
  }
)
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
const todayStats = ref<any>(null);
// onMounted(async () => {
//   const serviceId = serviceStore.serviceId!
//   const today = new Date().toISOString().split('T')[0];
//   try {
//     const response = await getDailyOccupancyAndReservations(serviceId, today, today);
//     if(response.data && response.data.global_room_status_stats){
//       todayStats.value = response.data.global_room_status_stats;
//     }
//   } catch (error) {
//     console.error("Failed to fetch today's stats:", error);
//   }
//   getLocaleDailyOccupancyAndReservations()
// })
onMounted(() => {
  getLocaleDailyOccupancyAndReservations()
})

watch([selectedDate, daysToShow], () => {
  getLocaleDailyOccupancyAndReservations()
})



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
// function getRoomStatusCount(status: string): number {
//   if (!todayStats.value) {
//     return 0
//   }
//   return todayStats.value[status] || 0
// }

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
  loadingRates.value = true;
  const response = await getRateStayViewTypeByHotelId(serviceStore.serviceId!)
  console.log('rateTypeOptions', response.data?.data)
  currentRateTypeData.value = response.data?.data
  rateTypeOptions.value = response.data?.data?.map((item: any) => {
    return {
      label: item.rateTypeName,
      value: item.rateTypeId
    }
  })
  selectRateType.value = rateTypeOptions.value[0]?.value;
  loadingRates.value = false;
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

const legendSections = computed(() => {
  const colorGetter = statusColorStore.getReservationColor;

  return [
    {
      title: t('bookings.calendar.titles.bookingStatus'),
      items: [
        { label: t('Arrived'), color: colorGetter('checked_in') },
        { label: t('Checked Out'), color: colorGetter('checkout') },
        { label: t('Due Out'), color: colorGetter('departure') },
        { label: t('Confirmed Reservation'), color: colorGetter('confirmed') },
        { label: t('Maintenance Block'), color: colorGetter('blocked') },
        { label: t('Stayover'), color: colorGetter('inhouse') },
        { label: t('Dayuse Reservation'), color: colorGetter('dayuse') },
      ]
    },
    {
      title: t('bookings.calendar.titles.bookingIndicators'),
      items: [
        { label: t('bookings.calendar.labels.groupOwner'), icon: CrownIcons },
        { label: t('bookings.calendar.labels.groupBooking'), icon: UsersIcons },
        { label: t('bookings.calendar.labels.paymentPending'), icon: DollarsIcons },
        { label: t('bookings.calendar.labels.stopRoomMove'), icon: HandIcons },
        { label: t('bookings.calendar.labels.singleLady'), icon: LadyIcons },
        { label: t('bookings.calendar.labels.vipGuest'), icon: StarIcons },
        { label: t('bookings.calendar.labels.splitReservation'), icon: SplitIcons }
      ]
    },
    {
      title: t('bookings.calendar.titles.roomIndicators'),
      items: [
        { label: t('bookings.calendar.labels.noSmoking'), icon: CigaretteOff },
        { label: t('bookings.calendar.labels.smoking'), icon: Cigarette },
        { label: t('Dirty'), icon: BroomIcons },
        { label: t('Clean'), icon: CheckCircleIcon },
        { label: t('bookings.calendar.labels.connectedRooms'), icon: LinkIcon },
        { label: t('bookings.calendar.labels.workOrder'), icon: WorkOdersIcons },
        { label: t('bookings.calendar.labels.accessibleRoom'), icon: AccessibleIcons },
        { label: t('bookings.calendar.labels.petFriendly'), icon: PetIcons },
        { label: t('bookings.calendar.labels.unassignedRoom'), color: '#e5e7eb' },
        { label: t('bookings.calendar.labels.inventory'), color: '#fecaca' },
        { label: t('bookings.calendar.labels.unconfirmedBookings'), color: '#f87171' }
      ]
    }
  ]
});
// État de sélection modifié pour les cellules individuelles
const cellSelection = ref({
  selectedCells: new Set<string>(), // Format: "roomType_roomNumber_date"
  isSelecting: false,
  inprogress: false,
  startCell: null as { roomType: string; roomNumber: string; date: Date; offsetX: number; cellWidth: number } | null,
  currentCell: null as { roomType: string; roomNumber: string; date: Date; offsetX: number; cellWidth: number } | null,
})

// Fonction pour créer une clé unique pour une cellule
function getCellKey(roomType: string, roomNumber: string, date: Date): string {
  const dateStr = date.toISOString().split('T')[0]
  return `${roomType}_${roomNumber}_${dateStr}`
}

// Fonction pour démarrer la sélection de cellules
function startCellSelection(roomType: string, roomNumber: string, date: Date, event: MouseEvent) {
  event.preventDefault()
  const target = event.currentTarget as HTMLElement;
  const cellWidth = target.offsetWidth;

  cellSelection.value.isSelecting = true
  cellSelection.value.inprogress = true;
  cellSelection.value.startCell = { roomType, roomNumber, date: new Date(date), offsetX: event.offsetX, cellWidth }
  cellSelection.value.currentCell = { roomType, roomNumber, date: new Date(date), offsetX: event.offsetX, cellWidth }

  // Effacer la sélection précédente
  cellSelection.value.selectedCells.clear()

  // Ajouter la cellule de départ
  const cellKey = getCellKey(roomType, roomNumber, date)
  cellSelection.value.selectedCells.add(cellKey)

  document.addEventListener('mouseup', endCellSelection)
  // We use mousemove on the document to have a smoother experience
  document.addEventListener('mousemove', handleCellMouseMove)
}

// Fonction pour mettre à jour la sélection de cellules lors du survol
function updateCellSelection(roomType: string, roomNumber: string, date: Date, event: MouseEvent) {
  if (!cellSelection.value.isSelecting || !cellSelection.value.startCell) return

  // Autoriser uniquement la sélection sur la même chambre
  if (
    cellSelection.value.startCell.roomType !== roomType ||
    cellSelection.value.startCell.roomNumber !== roomNumber
  ) {
    return
  }
  const target = event.currentTarget as HTMLElement;
  const cellWidth = target.offsetWidth;

  cellSelection.value.currentCell = { roomType, roomNumber, date: new Date(date), offsetX: event.offsetX, cellWidth }

  // Recalculer les cellules sélectionnées
  calculateSelectedCells()
}

// Fonction pour calculer toutes les cellules sélectionnées dans la plage
function calculateSelectedCells() {
  if (!cellSelection.value.startCell || !cellSelection.value.currentCell) return

  cellSelection.value.selectedCells.clear()

  const startDate = cellSelection.value.startCell.date
  const endDate = cellSelection.value.currentCell.date
  const roomType = cellSelection.value.startCell.roomType
  const roomNumber = cellSelection.value.startCell.roomNumber

  // Déterminer la plage de dates (du plus petit au plus grand)
  const minDate = new Date(Math.min(startDate.getTime(), endDate.getTime()))
  const maxDate = new Date(Math.max(startDate.getTime(), endDate.getTime()))

  // Ajouter toutes les dates dans la plage
  const current = new Date(minDate)
  while (current <= maxDate) {
    const cellKey = getCellKey(roomType, roomNumber, current)
    cellSelection.value.selectedCells.add(cellKey)
    current.setDate(current.getDate() + 1)
  }
}

// Fonction pour terminer la sélection de cellules
function endCellSelection(event?: MouseEvent) {
  if (!cellSelection.value.isSelecting) return
  cellSelection.value.isSelecting = false

  if (event) {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const cellElement = elements.find(el => el.tagName === 'TD' && el.classList.contains('cell-selectable'));
    if (cellElement) {
      const rect = cellElement.getBoundingClientRect();
      const tooltipHeight = 180; // Estimated height in pixels
      const spaceBelow = window.innerHeight - rect.bottom;

      isTooltipAbove.value = spaceBelow < tooltipHeight;
      selectionTooltipPosition.value = { x: rect.left + rect.width / 2, y: isTooltipAbove.value ? rect.top : rect.bottom };
    } else {
      selectionTooltipPosition.value = { x: event.clientX, y: event.clientY };
    }
  }

  document.removeEventListener('mouseup', endCellSelection)
  document.removeEventListener('mousemove', handleCellMouseMove)
}

// Gestionnaire de mouvement de souris
function handleCellMouseMove(event: MouseEvent) {
  if (cellSelection.value.isSelecting) {
    // This is a bit of a hack to update the offsetX of the current cell
    // as we are listening on the document, not on the cell itself.
    // A better implementation would use a transparent overlay.
    const currentCellInfo = cellSelection.value.currentCell;
    if (currentCellInfo) {
      const elements = document.elementsFromPoint(event.clientX, event.clientY);
      const cellElement = elements.find(el => el.tagName === 'TD' && el.classList.contains('cell-selectable'));
      if (cellElement) {
        const rect = cellElement.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        currentCellInfo.offsetX = offsetX;
      }
    }
  }
}

// Fonction pour vérifier si une cellule est sélectionnée
function isCellSelected(roomType: string, roomNumber: string, date: Date): boolean {
  const cellKey = getCellKey(roomType, roomNumber, date)
  //if(!getSelectionInfo()) return false
  return cellSelection.value.selectedCells.has(cellKey)
}

function getSelectionStyle(roomType: string, roomNumber: string, date: Date) {
  const selection = cellSelection.value;
  if (!selection.startCell || !selection.currentCell) return {};

  const startCellInfo = selection.startCell.date.getTime() < selection.currentCell.date.getTime() ? selection.startCell : selection.currentCell;
  const endCellInfo = selection.startCell.date.getTime() < selection.currentCell.date.getTime() ? selection.currentCell : selection.startCell;

  if (selection.isSelecting) {
    // Case 1: During selection, individual cells
    const selectionStartDate = new Date(Math.min(selection.startCell.date.getTime(), selection.currentCell.date.getTime()));
    const selectionEndDate = new Date(Math.max(selection.startCell.date.getTime(), selection.currentCell.date.getTime()));

    const isStart = date.getTime() === selectionStartDate.getTime();
    const isEnd = date.getTime() === selectionEndDate.getTime();

    let width = '100%';
    let left = '0';

    if (isStart && isEnd) {
      const startOffset = Math.min(startCellInfo.offsetX, endCellInfo.offsetX);
      const endOffset = Math.max(startCellInfo.offsetX, endCellInfo.offsetX);
      const cellWidth = startCellInfo.cellWidth;
      if (cellWidth > 0) {
        left = `${(startOffset / cellWidth) * 100}%`;
        width = `${((endOffset - startOffset) / cellWidth) * 100}%`;
      }
    } else if (isStart) {
      const cellWidth = startCellInfo.cellWidth;
      if (cellWidth > 0) {
        left = `${(startCellInfo.offsetX / cellWidth) * 100}%`;
        width = `${100 - ((startCellInfo.offsetX / cellWidth) * 100)}%`;
      }
    } else if (isEnd) {
      const cellWidth = endCellInfo.cellWidth;
      if (cellWidth > 0) {
        width = `${(endCellInfo.offsetX / cellWidth) * 100}%`;
      }
    }
    return { width, left };
  } else {
    // Case 2: After selection, merged cell
    const selectionInfo = getSelectionInfo();
    if (!selectionInfo) return {};
    const colspan = selectionInfo.cellCount;
    if (colspan <= 0) return {};

    const startOffset = (startCellInfo.offsetX / startCellInfo.cellWidth);
    const endOffset = (endCellInfo.offsetX / endCellInfo.cellWidth);

    const left = `${startOffset * 100 / colspan}%`;

    const widthInCells = (colspan - 1) + endOffset - startOffset;
    const width = `${widthInCells * 100 / colspan}%`;

    return { width, left };
  }
}


function getSelectionTimes() {
  const startCellInfo = cellSelection.value.startCell;
  const endCellInfo = cellSelection.value.currentCell;

  let checkinTime = '14:00';
  let checkoutTime = '12:00';

  if (startCellInfo && startCellInfo.cellWidth > 0) {
    const checkinPercentage = startCellInfo.offsetX / startCellInfo.cellWidth;
    const checkinHour = Math.floor(checkinPercentage * 24);
    checkinTime = `${String(checkinHour).padStart(2, '0')}:00`;
  }
  if (endCellInfo && endCellInfo.cellWidth > 0) {
    const checkoutPercentage = endCellInfo.offsetX / endCellInfo.cellWidth;
    const checkoutHour = Math.floor(checkoutPercentage * 24);
    checkoutTime = `${String(checkoutHour).padStart(2, '0')}:00`;
  }

  return { checkinTime, checkoutTime };
}

// Fonction pour effacer la sélection de cellules
function clearCellSelection() {
  cellSelection.value.selectedCells.clear()
  cellSelection.value.isSelecting = false
  cellSelection.value.startCell = null
  cellSelection.value.currentCell = null
}

// Fonction pour obtenir les informations de la sélection actuelle
function getSelectionInfo() {
  if (cellSelection.value.selectedCells.size === 0 || cellSelection.value.isSelecting) return null

  // Analyser les cellules sélectionnées pour extraire les informations
  const cells: any[] = Array.from(cellSelection.value.selectedCells)
  const firstCell = cells[0].split('_')
  const roomType = firstCell[0]
  const roomNumber = firstCell[1]

  // Extraire toutes les dates
  const dates = cells
    .map((cell: any) => new Date(cell.split('_')[2]))
    .sort((a: any, b: any) => a.getTime() - b.getTime())
  if (dates[0].getTime() === dates[dates.length - 1].getTime())
    return null
  return {
    roomType,
    roomNumber,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    totalNights: dates.length > 0 ? dates.length - 1 : 0,
    cellCount: dates.length,
  } as any
}

// Helper functions for cell selection merging
function isStartOfSelection(roomType: string, roomNumber: string, date: Date): boolean {
  const selectionInfo = getSelectionInfo()
  if (!selectionInfo) return false

  const selectionStartDate = selectionInfo.startDate
  const cellDate = new Date(date)

  return (
    selectionInfo.roomType === roomType &&
    selectionInfo.roomNumber === roomNumber &&
    cellDate.getTime() === selectionStartDate.getTime()
  )
}

function getSelectionColspan(): number {
  const selectionInfo = getSelectionInfo()
  if (!selectionInfo) return 1
  return selectionInfo.cellCount
}

function isInsideSelection(roomType: string, roomNumber: string, date: Date): boolean {
  const selectionInfo = getSelectionInfo()
  if (!selectionInfo) return false

  const selectionStartDate = selectionInfo.startDate
  const selectionEndDate = selectionInfo.endDate
  const cellDate = new Date(date)

  return (
    selectionInfo.roomType === roomType &&
    selectionInfo.roomNumber === roomNumber &&
    cellDate.getTime() >= selectionStartDate.getTime() &&
    cellDate.getTime() <= selectionEndDate.getTime()
  )
}

// Fonction pour naviguer vers l'ajout de réservation
function navigateToAddReservationFromCells() {
  const selectionInfo = getSelectionInfo()
  if (!selectionInfo) return

  const checkinDate = selectionInfo.startDate.toISOString().split('T')[0]
  const checkoutDate = new Date(selectionInfo.endDate)
  checkoutDate.setDate(checkoutDate.getDate())
  const checkoutDateStr = checkoutDate.toISOString().split('T')[0]

  const startCellInfo = cellSelection.value.startCell;
  const endCellInfo = cellSelection.value.currentCell;

  let checkinTime = '14:00';
  let checkoutTime = '12:00';

  if (startCellInfo && startCellInfo.cellWidth > 0) {
    const checkinPercentage = startCellInfo.offsetX / startCellInfo.cellWidth;
    const checkinHour = Math.floor(checkinPercentage * 24);
    checkinTime = `${String(checkinHour).padStart(2, '0')}:00`;
  }
  if (endCellInfo && endCellInfo.cellWidth > 0) {
    const checkoutPercentage = endCellInfo.offsetX / endCellInfo.cellWidth;
    const checkoutHour = Math.floor(checkoutPercentage * 24);
    checkoutTime = `${String(checkoutHour).padStart(2, '0')}:00`;
  }


  router.push({
    name: 'New Booking',
    query: {
      checkin: checkinDate,
      checkout: checkoutDateStr,
      roomType: selectionInfo.roomType,
      roomNumber: selectionInfo.roomNumber,
      checkInTime: checkinTime,
      checkOutTime: checkoutTime,

    },
  })
}

// Fonction pour déterminer si la cellule doit être affichée
function shouldShowCell(group: any, room: any, cell: any) {
  // En mode sélection, toujours afficher toutes les cellules
  if (cellSelection.value.isSelecting) {
    return true
  }

  // En mode normal, ne pas afficher les cellules qui sont à l'intérieur d'une sélection
  // mais qui ne sont pas le début de cette sélection
  return !isInsideSelection(group.room_type, room.room_number, cell.date) ||
    isStartOfSelection(group.room_type, room.room_number, cell.date)
}

// Fonction pour déterminer le colspan unifié (que ce soit en mode sélection ou non)
function getUnifiedColspan(group: any, room: any, cell: any) {
  // Si on est en mode sélection, toujours colspan = 1
  if (cellSelection.value.isSelecting) {
    return 1
  }

  // Si on n'est pas en mode sélection, vérifier si c'est le début d'une sélection confirmée
  if (isStartOfSelection(group.room_type, room.room_number, cell.date)) {
    return getSelectionColspan()
  }

  // Par défaut, colspan = 1
  return 1
}

// Fonction pour déterminer la classe CSS unifiée
function getUnifiedCellClass(group: any, room: any, cell: any) {
  const baseClasses: any[] = []
  baseClasses.push(isWeekend(cell.date) ? 'dark:bg-black dark:text-white' : 'bg-white')
  return baseClasses.join(' ')
}

// Cleanup des event listeners
onUnmounted(() => {
  document.removeEventListener('mouseup', endCellSelection)
  document.removeEventListener('mousemove', handleCellMouseMove)
})
</script>
<style scoped>
@reference "tailwindcss";



/* Effet de survol uniquement sur les cellules libres */
.cell-hoverable:hover {
  background-color: #dbeafe !important;
  border-color: #60a5fa !important;
}

/* Transition fluide pour les cellules */
.cell-transition {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

/* Style pour indiquer qu'une cellule est sélectionnable */
.cell-selectable {
  cursor: pointer;
}


/* Weekend cells remain subtle */
.weekend-cell {
  background-color: #f9fafb;
}

.weekend-cell.cell-selected {
  background-color: #3b82f6 !important;
}

@layer utilities {

  /* Chrome, Safari, Edge, Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* IE, Edge, Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
  }
}
</style>
