<template>
  <!-- <AdminLayout> -->
  <FullScreenLayout>
    <div class="flex flex-col overflow-hidden" style="height: calc(100vh / 0.93)">
      <OverLoading v-if="isRefreshing" />
      <AppHeader :show-sidebar="true" />
      <div class="reservation-calendar font-sans flex-1 flex flex-col min-h-0">
      <div
        class="bg-white dark:bg-gray-900 px-6 py-1 flex items-center justify-between rounded-b-lg border-b dark:border-gray-700"
      >
        <div class="flex gap-2">
          <InputDatePicker
            class="bg-white dark:bg-gray-800 rounded-lg w-40 h-full"
            v-model="selectedDate"
          />
          <div
            class="flex rounded-lg px-2 text-sm font-semibold transition align-middle py-3 bg-white dark:bg-gray-800 text-primary shadow border border-gray-400 dark:border-gray-700 focus:ring focus:ring-primary/30"
          >
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
              <span class="rounded-full bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-2">{{
                getRoomStatusCount(item)
              }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <Select
            :options="rateTypeOptions"
            v-model="selectRateType"
            class="min-w-[12rem]"
            :is-loading="loadingRates"
          />
          <StatusLegend :sections="legendSections" />
        </div>
      </div>
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Fixed Header -->
        <div class="border border-gray-400 dark:border-gray-700 border-b-0 pr-[11px]">
          <table class="w-full text-sm table-fixed">
            <thead>
              <tr>
                <th
                  class="bg-gray-100 dark:bg-gray-800 px-2 py-1 border-r border-gray-400 dark:border-gray-700"
                  :style="`width: calc(200px)`"
                >
                  <div class="flex justify-between items-center">
                    <div class="max-w-md">
                      <SelectDropdown
                        v-model="selectedRoomTypes"
                        :options="roomTypeOptions"
                        :placeholder="$t('roomType')"
                        button-class="bg-white dark:bg-gray-800 text-primary border border-blue-200 dark:border-gray-700  w-42"
                        dropdown-class="w-full"
                        :select-all-text="$t('bookings.calendar.labels.selectAll')"
                        :max-display-items="3"
                      />
                    </div>
                  </div>
                </th>
                <th
                  v-for="(date, idx) in visibleDates"
                  :key="idx"
                  :class="[
                    'px-2 py-1 text-center border-r border-gray-400 dark:border-gray-700 relative',
                    isWeekend(date)
                      ? 'bg-orange-200/25 dark:bg-orange-900/20'
                      : 'bg-gray-50 dark:bg-gray-800',
                  ]"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`"
                >
                  <button
                    v-if="idx === 0"
                    @click="prevDay"
                    class="absolute left-1 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div class="dark:text-gray-300">{{ formatDate(date) }}</div>
                  <div class="text-xs text-gray-400 dark:text-gray-300">{{ formatDay(date) }}</div>
                  <button
                    v-if="idx === visibleDates.length - 1"
                    @click="nextDay"
                    class="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <!-- Scrollable Content -->
        <div
          class="flex-1 overflow-y-auto border border-gray-400 dark:border-gray-700 scrollbar"
        >
          <table class="w-full text-sm table-fixed">
            <colgroup>
              <col :style="`width: 200px`" />
              <col
                v-for="(date, ind) in visibleDates"
                :key="ind"
                :style="`width: calc((100% - 200px) / ${visibleDates.length})`"
              />
            </colgroup>
            <tbody>
              <template v-if="isLoading || !apiRoomGroups || !apiOccupancyMetrics">
                <tr v-for="i in 8" :key="i">
                  <td class="px-2 py-1">
                    <div class="h-4 w-50 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  </td>
                  <td v-for="j in visibleDates.length" :key="j" class="px-0 py-2 h-4">
                    <div
                      class="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                    ></div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <template v-for="group in apiRoomGroups" :key="group.room_type">
                  <template v-if="selectedRoomTypes.includes(group.room_type_id)">
                    <tr>
                      <td
                        class="h-8 min-w-50 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 border border-gray-400 dark:border-gray-700 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors dark:text-gray-200 z-40"
                        @click="toggleRoomType(group.room_type)"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <svg
                              :class="[
                                'w-4 h-4 transition-transform',
                                collapsedRoomTypes[group.room_type] ? 'rotate-0' : 'rotate-90',
                              ]"
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
                            <span>{{ group.room_type }}</span>
                          </div>
                        </div>
                      </td>
                      <td
                        v-for="(date, j) in visibleDates"
                        :key="j"
                        class="bg-green-100 dark:bg-green-900/30 px-2 py-1 border border-gray-400 dark:border-gray-700 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 text-center dark:text-gray-200 z-30"
                      >
                        <div
                          class="flex flex-col gap-1 justify-center align-middle self-center items-center"
                        >
                          <div class="flex gap-1">
                            <span
                              class="text-xs font-medium text-red-200 dark:text-red-300 border border-orange-300 dark:border-orange-700 bg-white dark:bg-gray-800 px-1 py-0 rounded"
                            >
                              {{ getAvailableRoomsByType(date, group.room_type_id) }}
                            </span>
                            <span
                              v-if="getUnassignedRoomsByType(date, group.room_type_id)"
                              class="text-xs font-medium text-blue-500 dark:text-blue-300 border border-blue-500 bg-white dark:bg-gray-800 px-1 py-0 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              @click="handleUnassignedRoomClick(date, group.room_type_id)"
                            >
                              {{ getUnassignedRoomsByType(date, group.room_type_id) }}
                            </span>
                          </div>
                          <span class="text-xs">{{
                            roomRateForDate[group.room_type_id] ?? t('N/A')
                          }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr
                      v-for="room in group.room_details"
                      :key="room.room_number || room.room_status + Math.random()"
                      v-show="!collapsedRoomTypes[group.room_type]"
                      class="transition-all duration-200 ease-in-out"
                    >
                      <td
                        class="text-sm uppercase px-2 py-1 border border-gray-400 dark:border-gray-700 dark:text-gray-300"
                      >
                        <div class="flex justify-between">
                          <span>{{ room.room_number || '-' }}</span>
                          <div class="flex gap-1 text-gray-500 dark:text-gray-400">
                            <span class="text-xs" v-if="room.room_housekeeping_status === 'clean'">
                              <Bed class="w-4 h-4" />
                            </span>
                            <span v-else>
                              <BroomIcons class="w-4 h-4 text-gray-500" />
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
                        <!-- Chambres avec statut spécial (maintenance, out_of_service, cleaning) -->
                        <td
                          v-if="
                            cell.type === 'room' &&
                            ['maintenance', 'out_of_service', 'cleaning'].includes(room.room_status)
                          "
                          class="px-[1px] py-[1px] h-8 border border-gray-400"
                        >
                          <div
                            :class="[
                              'flex items-center justify-center h-full w-full',
                              getRoomStatusColor(room.room_status),
                            ]"
                          >
                            <component
                              :is="getRoomStatusIcon(room.room_status)"
                              :class="['w-5 h-5 mr-1', getRoomStatusColor(room.room_status)]"
                            />
                          </div>
                        </td>

                        <!-- Cellules vides/sélectionnables -->
                        <td
                          v-else-if="shouldShowCell(group, room, cell)"
                          :class="[
                            'px-[1px] py-[1px] h-8 border dark:bg-black border-gray-400 cell-transition cell-selectable cell-hoverable relative ',
                            getUnifiedCellClass(group, room, cell),
                          ]"
                          @mousedown="
                            startCellSelection(
                              group.room_type,
                              group.room_type_id,
                              room.room_number,
                              cell.date,
                              $event,
                            )
                          "
                          @mouseenter="
                            updateCellSelection(
                              group.room_type,
                              group.room_type_id,
                              room.room_number,
                              cell.date,
                              $event,
                            )
                          "
                          @mouseup="endCellSelection($event)"
                        >
                          <!-- Room block overlay spanning across cells (full widths, no halves) -->
                          <div
                            v-if="cell.roomBlock && isRoomBlockAnchor(cell)"
                            :class="[
                              'group cursor-pointer absolute top-1/2 -translate-y-1/2 px-[1px] py-[1px] text-sm uppercase font-bold text-white flex items-center gap-1 min-w-0 z-20',
                              getRoomBlockColor(cell.roomBlock.status),
                            ]"
                            :style="getRowBlockOverlayStyle(cell)"
                            @mouseenter="showRoomBlockTooltip(cell.roomBlock, $event)"
                            @mouseleave="hideRoomBlockTooltip"
                          >
                            <span class="truncate">{{ $t('Maintenance Block') }}</span>
                          </div>

                          <!-- Single-day reservations rendered by hours within the cell -->
                          <div
                            v-for="(res, idx) in cell.singleDayReservations"
                            :key="`${res.reservation_id}-${idx}`"
                            class="group cursor-pointer absolute top-1/2 -translate-y-1/2 px-[1px] py-[1px] text-sm uppercase font-bold text-white flex items-center gap-1 min-w-0 z-20"
                            :style="getSingleDaySegmentStyle(res)"
                            @mousedown.stop
                            @mouseup.stop
                            @click.stop="showReservationModal(res)"
                            @mouseenter="showReservationTooltip(res, $event)"
                            @mouseleave="hideReservationTooltip"
                          >
                            <img
                              v-if="getOtaIconSrcForReservation(res)"
                              :src="getOtaIconSrcForReservation(res) ?? ''"
                              alt="OTA"
                              class="w-3 h-3 flex-shrink-0"
                            />
                            <Building2Icon v-else class="w-3 h-3 flex-shrink-0 text-white" />
                            <span class="truncate">{{ getReservationText(res) }}</span>

                            <!-- Status icons (match normal reservation overlay) -->
                            <div class="absolute -top-2 flex items-center gap-1">
                              <Crown
                                v-if="res?.is_master"
                                class="bg-white dark:bg-gray-800 w-3 h-3 text-yellow-400 flex-shrink-0"
                                :title="$t('Primary')"
                              />
                              <DollarSignIcon
                                v-if="res?.is_balance"
                                class="bg-red-400 w-3 h-3 text-yellow-400 flex-shrink-0"
                              />
                              <User2
                                v-if="res?.isWomen"
                                class="bg-pink-400 w-3 h-3 text-white flex-shrink-0"
                                :title="$t('Female Guest')"
                              />

                              <SplitIcon
                                v-if="res?.isSplitedOrigin || res?.isSplitedDestination"
                                class="bg-pink-400 w-3 h-3 text-white flex-shrink-0"
                                :title="$t('Female Guest')"
                              />
                            </div>
                          </div>

                          <!-- Middle-day reservation segment (full width) -->
                          <!-- Single reservation overlay starting in this cell and spanning across cells -->
                          <div
                            v-if="cell.reservationStart || cell.reservationCarryOver"
                            class="group cursor-pointer absolute top-1/2 -translate-y-1/2 px-[1px] py-[1px] text-sm uppercase font-bold text-white flex items-center gap-1 min-w-0 z-20"
                            :style="getRowOverlayStyle(cell)"
                            @mousedown.stop
                            @mouseup.stop
                            @click.stop="showReservationModal(cell.reservationStart || cell.reservationCarryOver)"
                            @mouseenter="
                              showReservationTooltip(
                                cell.reservationStart || cell.reservationCarryOver,
                                $event,
                              )
                            "
                            @mouseleave="hideReservationTooltip"
                          >
                            <img
                              v-if="
                                getOtaIconSrcForReservation(
                                  cell.reservationStart || cell.reservationCarryOver,
                                )
                              "
                              :src="
                                getOtaIconSrcForReservation(
                                  cell.reservationStart || cell.reservationCarryOver,
                                ) ?? ''
                              "
                              alt="OTA"
                              class="w-3 h-3 flex-shrink-0"
                            />
                            <Building2Icon v-else class="w-3 h-3 flex-shrink-0 text-white" />
                            <span class="truncate">{{
                              getReservationText(cell.reservationStart || cell.reservationCarryOver)
                            }}</span>


                            <!-- Status icons -->
                            <div class="absolute -top-2 flex items-center gap-1">
                              <Crown
                                v-if="
                                  (cell.reservationStart || cell.reservationCarryOver)?.is_master
                                "
                                class="bg-white dark:bg-gray-800 w-3 h-3 text-yellow-400 flex-shrink-0"
                                :title="$t('Primary')"
                              />
                              <DollarSignIcon
                                v-if="
                                  (cell.reservationStart || cell.reservationCarryOver)?.is_balance
                                "
                                class="bg-red-400 w-3 h-3 text-yellow-400 flex-shrink-0"
                              />
                              <User2
                                v-if="(cell.reservationStart || cell.reservationCarryOver)?.isWomen"
                                class="bg-pink-400 w-3 h-3 text-white flex-shrink-0"
                                :title="$t('Female Guest')"
                              />
                              <SplitIcon
                                v-if="
                                  (cell.reservationStart || cell.reservationCarryOver)
                                    ?.isSplitedOrigin ||
                                  (cell.reservationStart || cell.reservationCarryOver)
                                    ?.isSplitedDestination
                                "
                                class="w-3 h-3 text-white flex-shrink-0"
                                :title="$t('Female Guest')"
                              />
                            </div>
                          </div>

                          <div
                            v-if="isCellSelected(group.room_type, room.room_number, cell.date)"
                            class="absolute h-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-600 border-l-2 border-r-2 border-blue-700 rounded-sm"
                            :style="getSelectionStyle(group.room_type, room.room_number, cell.date)"
                          ></div>
                        </td>
                      </template>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <div
          class="sticky bottom-0 bg-white dark:bg-gray-900 shadow-lg z-40 border-t border-gray-400 dark:border-gray-700 pr-[11px]"
        >
          <table class="w-full border-t border border-gray-400 text-sm table-fixed">
            <tfoot>
              <tr>
                <td
                  class="bg-gray-100 dark:bg-black dark:text-white border h-7 border-gray-400 text-center"
                  :style="`width: 200px`"
                >
                  {{ $t('Unassigned reservations') }}
                </td>
                <td
                  v-for="(date, idx) in visibleDates"
                  :key="idx"
                  :class="[
                    'text-center border border-gray-400 dark:bg-black dark:text-white',
                    isWeekend(date) ? 'bg-gray-100' : '',
                  ]"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`"
                  v-html="getUnassignedApi(date)"
                ></td>
              </tr>
              <tr>
                <td
                  class="bg-gray-100 dark:bg-black dark:text-white h-7 border border-gray-400 text-center"
                  :style="`width: 200px`"
                >
                  % {{ $t('Occupancy') }}
                </td>
                <td
                  v-for="(date, idx) in visibleDates"
                  :key="idx"
                  :class="[
                    'text-center border border-gray-400 dark:bg-black dark:text-white',
                    isWeekend(date) ? 'bg-gray-100' : '',
                  ]"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`"
                >
                  {{ getOccupancyApi(date) }} %
                </td>
              </tr>
              <tr>
                <td
                  class="bg-gray-100 dark:bg-black dark:text-white h-7 border border-gray-400 text-center"
                  :style="`width: 200px`"
                >
                  {{ $t('Available Rooms') }}
                </td>
                <td
                  v-for="(date, idx) in visibleDates"
                  :key="idx"
                  :class="[
                    'text-center border border-gray-400 dark:bg-black dark:text-white',
                    isWeekend(date) ? 'bg-gray-100' : '',
                  ]"
                  :style="`width: calc((100% - 200px) / ${visibleDates.length})`"
                >
                  {{ getAvailableRoomsApi(date) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    </div>
    <!-- Date Selection Tooltip -->
    <div
      v-if="dateSelection.isSelecting && dateSelection.startDate && dateSelection.endDate"
      :style="
        tooltipPosition
          ? `position:fixed;left:${tooltipPosition.x + 12}px;top:${tooltipPosition.y - 60}px;z-index:1000;`
          : ''
      "
      class="rounded-lg bg-white dark:bg-gray-900 shadow-lg border dark:border-gray-700 text-sm pointer-events-none px-4 py-2"
    >
      <div class="font-medium text-gray-800 dark:text-gray-200 mb-1">
        {{ $t('Selected Dates') }}
      </div>
      <div class="text-gray-600 dark:text-gray-300">
        {{ formatDate(dateSelection.startDate) }} - {{ formatDate(dateSelection.endDate) }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ getSelectionNights() }} {{ getSelectionNights() > 1 ? $t('nights') : $t('night') }}
      </div>
    </div>

    <!-- Confirmed Selection Tooltip with Action -->
    <div
      v-if="getSelectionInfo()"
      class="fixed inset-0 bg-black/40 z-[999]"
      @wheel.prevent
      @touchmove.prevent
    ></div>
    <div
      v-if="getSelectionInfo()"
      :style="tooltipStyle"
      class="relative w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm mt-5"
    >
      <div
        class="absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
        :class="isTooltipAbove ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'"
      ></div>
      <div
        class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg px-4 py-2 flex justify-between"
      >
        <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ $t('SelectionDetails') }}</h3>
        <XIcon class="w-5 h-5 text-red-600 dark:text-red-300 cursor-pointer" @click="clearCellSelection" />

      </div>

      <div class="p-4">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 dark:text-gray-300">
          <div>
            <strong>{{ $t('Room') }}:</strong>
          </div>
          <div>{{ getSelectionInfo()?.roomNumber }}</div>

          <div>
            <strong>{{ $t('roomType') }}:</strong>
          </div>
          <div>{{ getSelectionInfo()?.roomType }}</div>

          <div>
            <strong>{{ $t('common.from') }}:</strong>
          </div>
          <div>
            {{ formatDate(getSelectionInfo()?.startDate ?? new Date()) }}
            {{ getSelectionTimes().checkinTime }}
          </div>

          <div class="capitalize">
            <strong>{{ $t('to') }}:</strong>
          </div>
          <div>
            {{ formatDate(getSelectionInfo()?.endDate ?? new Date()) }}
            {{ getSelectionTimes().checkoutTime }}
          </div>
        </div>
      </div>

      <div
        class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg px-4 py-3 flex justify-end gap-2"
      >

        <button
          v-if="canAddBooking"
          @click="navigateToAddReservationFromCells"
          class="bg-transparent text-blue-600 px-3 py-1 rounded text-smtransition"
        >
          {{ $t('walkin_reservation') }}
        </button>

        <button
          v-if="BlockRoomPermission"
          @click="handleCreateRoomBlock"
          class="bg-transparent text-blue-600 px-3 py-1 rounded text-smtransition"
        >
          {{ $t('maintenance_block') }}
        </button>
      </div>
    </div>
    <!--tooltip-->

    <template v-if="modalReservation && showDetail">
      <ReservationRigthModal
        :is-open="showDetail"
        :title="$t('reservationDetails')"
        :reservation-data="modalReservation"
        @close="closeReservationModal"
        @save="handleReservationSave"
      />
    </template>

    <!-- Unassigned Reservations Modal -->
    <UnassignedReservationsModal
      v-if="showUnassignedModal"
      :is-open="showUnassignedModal"
      :room-type-id="selectedRoomTypeId"
      :date="selectedUnassignedDate"
      :reservations="unassignedReservations"
      @close="closeUnassignedModal"
      @room-assigned="handleRoomAssigned"
      :room-type-data="currentRoomTypeData"
    />

    <!-- Assign Room Reservation Modal -->
    <template v-if="selectedReservationForAssignment">
      <RoomSelectionModal
        :is-open="showAssignRoomModal"
        :reservation-id="selectedReservationForAssignment.id"
        @close="closeAssignRoomModal"
        @refresh="refresh"
      />
    </template>
  </FullScreenLayout>
  <!-- </AdminLayout> -->
  <!-- Tooltip Portal Container -->
  <Teleport to="body">
    <div
      v-if="tooltipReservation && tooltipPosition"
      class="fixed z-[9999] pointer-events-none"
      :style="{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        transform:
          tooltipPosition.placement === 'below' ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
      }"
    >
      <div
        class="relative rounded-md p-4 text-sm leading-none text-white whitespace-nowrap bg-blue-950 shadow-2xl min-w-[18rem] border border-blue-800"
      >
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="text-gray-300">{{ $t('Name') }}:</span>
            <span class="flex items-center gap-2 font-semibold">
              <img
                v-if="getOtaIconSrcForReservation(tooltipReservation)"
                :src="getOtaIconSrcForReservation(tooltipReservation) ?? ''"
                alt="OTA"
                class="w-4 h-4"
              />
              <Building2Icon v-else class="w-4 h-4 text-white" />
              <span class="truncate w-[350px]">{{ tooltipReservation?.guest_name }}</span>
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">{{ $t('Check-in Date') }}:</span>
            <span class="font-medium"
              >{{ formatDateLocal(tooltipReservation?.check_in_date) }}
              {{ tooltipReservation?.check_in_time }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">{{ $t('Check-out Date') }}:</span>
            <span class="font-medium"
              >{{ formatDateLocal(tooltipReservation?.check_out_date) }}
              {{ tooltipReservation?.check_out_time }}</span
            >
          </div>
          <div class="h-px bg-blue-800 my-1"></div>
          <div class="flex justify-between text-blue-400">
            <span class="font-medium">{{ $t('Total') }}:</span>
            <span class="font-bold">{{
              formatCurrency(tooltipReservation?.balance_summary?.totalChargesWithTaxes)
            }}</span>
          </div>
          <div class="flex justify-between text-green-400">
            <span class="font-medium">{{ $t('paid') }}:</span>
            <span class="font-bold">{{
              formatCurrency(tooltipReservation?.balance_summary?.totalPayments)
            }}</span>
          </div>
          <div class="flex justify-between text-red-400">
            <span class="font-medium">{{ $t('balance') }}:</span>
            <span class="font-bold">{{
              formatCurrency(tooltipReservation?.balance_summary?.outstandingBalance)
            }}</span>
          </div>
        </div>
      </div>
      <!-- Flèche -->
      <div
        :class="
          tooltipPosition.placement === 'below'
            ? 'absolute left-1/2 -translate-x-1/2 -top-1'
            : 'absolute left-1/2 -translate-x-1/2 -bottom-1'
        "
      >
        <div class="w-3 h-3 rotate-45 bg-blue-950 border-r border-b border-blue-800"></div>
      </div>
    </div>
  </Teleport>

  <!--tooltip room block-->
  <Teleport to="body">
    <div
      v-if="tooltipRoomBlock && tooltipRoomBlockPosition"
      class="fixed z-[999]"
      :style="getTooltipPosition()"
      @mouseenter="keepRoomBlockTooltipOpen"
      @mouseleave="hideRoomBlockTooltip"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-600 p-4 min-w-[280px] max-w-[400px]"
      >

        <!-- Contenu -->
        <div class="space-y-2 mb-2">
          <div class="flex justify-start items-start">
            <span class="text-sm text-gray-900 dark:text-white">
              {{ tooltipRoomBlock?.reason || '-' }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="BlockRoomPermission" class="flex gap-2 border-t border-gray-200 dark:border-gray-700">
          <button
            @click.stop="handleEditRoomBlock(tooltipRoomBlock)"
            class="flex-1 px-3 py-2 text-blue-600 bg-transparent text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            {{ $t('EditBlockRoom') }}
          </button>
        </div>
        <div v-if="UnblockRoomPermission" class="flex gap-2 border-t border-gray-200 dark:border-gray-700">
          <button
            @click.stop="handleUnblockRoom(tooltipRoomBlock)"
            class="flex-1 px-3 py-2 text-blue-600 bg-transparent text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-1.5"
          >

            {{ $t('UnblockRoom') }}
          </button>
        </div>
      </div>

      <!-- Flèche (position dynamique) -->
      <div :class="getArrowClass()">
        <div
          class="w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          :class="getArrowBorderClass()"
        ></div>
      </div>
    </div>
  </Teleport>

  <CreateBlockModal
    :is-open="isBlockModalOpen"
    :block-data="selectedBlock"
    :is-editing="isEditing"
    :pre-selected-room="preSelectedRoomData"
    :pre-selected-date-range="preSelectedDateRange"
    @close="handleBlockClose"
    @save="handleBlockSave"
  />
  <template  v-if="showUnlockModal">
    <UnlockModal
    v-if="showUnlockModal"
    :is-open="showUnlockModal"
    :block-data="unlockBlockData"
    @close="closeUnlockModal"
    @save="handleUnlockSaved"
  />
  </template>

</template>

<script setup lang="ts">
import {
  HotelIcon,
  GlobeIcon,
  UserIcon,
  UsersIcon,
  BookIcon,
  Cigarette,
  CigaretteOff,
  LucideBrush,
  Crown,
  DollarSignIcon,
  User2,
  CheckCircleIcon,
  LinkIcon,
  CheckCircle,
  Building2Icon,
  Bed,
  XIcon,
} from 'lucide-vue-next'

import { watch, onUnmounted } from 'vue'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from '@/composables/serviceStore'
import { useBookingStore } from '@/composables/booking'
import { getDailyOccupancyAndReservations } from '@/services/api'
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
import CreateBlockModal from '@/components/Housekeeping/CreateBlockModal.vue'
import ConfirmationModal from '@/components/Housekeeping/ConfirmationModal.vue'
import UnlockModal from '@/components/Housekeeping/UnlockModal.vue'

const isLoading = ref(false)
const isRefreshing = ref(false)
const laoded = ref(false)
const currentHoveredReservation = ref<string | null>(null)
const statusColorStore = useStatusColor()
function getReservationTypeIcon(type: string) {
  switch (type) {
    case 'Direct Booking':
      return BookIcon
    case 'Hotel':
      return HotelIcon
    case 'Online':
      return GlobeIcon
    default:
      return BookIcon
  }
}
const rateTypeOptions = ref<any>([])
function getCustomerTypeIcon(type: string) {
  switch (type) {
    case 'Individual':
      return UserIcon
    case 'Group':
      return UsersIcon
    default:
      return UserIcon
  }
}
// --- ROOM STATUS COLOR & ICON ---
import { ErrorIcon, WarningIcon, UserCircleIcon, GridIcon } from '@/icons'
import AppHeader from '../layout/AppHeader.vue'
import FullScreenLayout from '../layout/FullScreenLayout.vue'
import OverLoading from '../spinner/OverLoading.vue'
import ReservationRigthModal from '../reservations/ReservationRigthModal.vue'
import Select from '../forms/FormElements/Select.vue'
import SelectDropdown from '../common/SelectDropdown.vue'
import StatusLegend from '../common/StatusLegend.vue'
import { getOtaIconSrc } from '@/utils/otaIcons'
import UnassignedReservationsModal from '../modal/UnassignedReservationsModal.vue'
import { useRouter } from 'vue-router'
import RoomSelectionModal from '../modal/RoomSelectionModal.vue'
import { formatCurrency, formatDateLocal } from '../utilities/UtilitiesFunction'
import SplitIcon from '@/icons/BookingStatus/splitIcon.vue'
import { getHotelById } from '../../services/hotelApi'
import { useAuthStore } from '../../composables/user'


const router = useRouter()
const bookingStore = useBookingStore()
const selectionTooltipPosition = ref({ x: 0, y: 0 })
const isTooltipAbove = ref(false)
const selectedRoomTypeId = ref<number | null>(null)
const tooltipRoomBlock = ref<any | null>(null)
const tooltipRoomBlockPosition = ref<{ x: number; y: number } | null>(null)
const currentHoveredRoomBlock = ref<string | null>(null)
let closeTooltipTimer: NodeJS.Timeout | null = null
const isBlockModalOpen = ref(false)
const isEditing = ref(false)
const selectedBlock = ref<any | null>(null)
const preSelectedRoomData = ref<{
  roomId: any
  roomNumber: string
  roomTypeId?: any
  roomTypeName?: string
} | null>(null)
const preSelectedDateRange = ref<{ start: string | null; end: string | null } | null>(null)
const showUnblockModal = ref(false) // deprecated by UnlockModal
const blockToUnblockId = ref<number | null>(null) // deprecated by UnlockModal
const deleting = ref(false) // deprecated by UnlockModal
const showUnlockModal = ref(false)
const unlockBlockData = ref<any | null>(null)

const openCreateBlockModal = (
  isEdit: boolean,
  blockData: any = null,
  preSelectedRoom: {
    roomId: any
    roomNumber: string
    roomTypeId?: any
    roomTypeName?: string
  } | null = null,
  dateRange: { start: string | null; end: string | null } | null = null,
) => {
  isEditing.value = isEdit
  selectedBlock.value = blockData
  preSelectedRoomData.value = preSelectedRoom
  preSelectedDateRange.value = dateRange
  isBlockModalOpen.value = true
}

const handleBlockClose = () => {
  isBlockModalOpen.value = false
  selectedBlock.value = null
  preSelectedRoomData.value = null
  preSelectedDateRange.value = null
}

const tooltipStyle = computed((): Record<string, string | number> => {
  const pos = selectionTooltipPosition.value
  if (!pos) return {}
  const x = pos.x - 150

  if (isTooltipAbove.value) {
    const bottom = window.innerHeight - pos.y + 20
    return {
      position: 'fixed',
      left: `${x}px`,
      bottom: `${bottom}px`,
      zIndex: 1000,
    }
  } else {
    const top = pos.y + 20
    return {
      position: 'fixed',
      left: `${x}px`,
      top: `${top}px`,
      zIndex: 1000,
    }
  }
})
// Date selection state
const dateSelection = ref({
  isSelecting: false,
  startDate: null as Date | null,
  endDate: null as Date | null,
  confirmedStart: null as Date | null,
  confirmedEnd: null as Date | null,
})

const loadingRates = ref(false)
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
    case 'available':
      return 'text-green-400'
    case 'occupied':
      return 'text-red-400'
    case 'maintenance':
      return 'text-yellow-400'
    case 'out_of_service':
      return 'text-red-400'
    case 'cleaning':
      return 'text-purple-400'
    default:
      return 'text-gray-300'
  }
}

function getRoomStatusIcon(status: string) {
  switch (status) {
    case 'available':
      return CheckCircle
    case 'occupied':
      return UserCircleIcon
    case 'maintenance':
      return WarningIcon
    case 'out_of_service':
      return ErrorIcon
    case 'cleaning':
      return GridIcon
    default:
      return GridIcon
  }
}

const serviceStore = useServiceStore()
const { t, locale } = useI18n()
const serviceResponse = ref<any>({})
const showModalAddingModal = ref<boolean>(false)
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
  { type: 'inhouse', label: t('In House') },
]
const selectRateType = ref(0)
const modalReservation = ref<any | null>(null)
function showReservationModal(reservation: any) {
  if (!useAuthStore().hasPermission('edit_reservation')) {
    return
  }
  // Clear any active cell selection to avoid opening the selection details panel
  clearCellSelection()
  showDetail.value = true
  modalReservation.value = reservation
}
function closeReservationModal() {
  modalReservation.value = null
  showDetail.value = false
}

function handleReservationSave(data?: any) {
  console.log('Reservation saved:', data)
  // Refresh the calendar data when reservation is saved/updated
  refresh()
  if (data?.action) {
    console.log('✅ Action completed:', data.action)
    if (data.action === 'checkout' || data.action === 'void' || data.action === 'cancel') {
      closeReservationModal()
    }
  }
}

// Fonction simplifiée pour afficher la tooltip
function showRoomBlockTooltip(roomBlock: any, event: MouseEvent) {
  // Annuler le timer de fermeture si existe
  if (closeTooltipTimer) {
    clearTimeout(closeTooltipTimer)
    closeTooltipTimer = null
  }

  const blockId = roomBlock?.id || roomBlock?.block_id

  // Si c'est déjà le bon block, ne rien faire
  if (currentHoveredRoomBlock.value === blockId) {
    return
  }

  currentHoveredRoomBlock.value = blockId
  tooltipRoomBlock.value = roomBlock

  // Calculer position simple et stable
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top

  tooltipRoomBlockPosition.value = { x, y }
}

// Fonction pour cacher la tooltip avec délai
function hideRoomBlockTooltip() {
  // Délai de 200ms avant fermeture
  closeTooltipTimer = setTimeout(() => {
    currentHoveredRoomBlock.value = null
    tooltipRoomBlock.value = null
    tooltipRoomBlockPosition.value = null
  }, 200)
}

// Fonction pour garder la tooltip ouverte
function keepRoomBlockTooltipOpen() {
  if (closeTooltipTimer) {
    clearTimeout(closeTooltipTimer)
    closeTooltipTimer = null
  }
}

// Fonction pour fermer immédiatement
function closeRoomBlockTooltipNow() {
  if (closeTooltipTimer) {
    clearTimeout(closeTooltipTimer)
    closeTooltipTimer = null
  }
  currentHoveredRoomBlock.value = null
  tooltipRoomBlock.value = null
  tooltipRoomBlockPosition.value = null
}

async function handleUnblockRoom(roomBlock: any) {
  closeRoomBlockTooltipNow()

  if (!roomBlock) return
  // Build block data for UnlockModal (edit mode clone)
  unlockBlockData.value ={
    id: roomBlock.id,
    blockFromDate: roomBlock.block_from_date,
    blockToDate: roomBlock.block_to_date,
    reason: roomBlock.reason,
    status: roomBlock.status,
    description: roomBlock.description || '',
    room: {
      id: roomBlock.room?.id,
      roomNumber: roomBlock.room?.room_number,
    },
    roomType: {
      id: roomBlock.room_type?.id,
      roomTypeName: roomBlock.room_type?.name,
    },
    createdAt: roomBlock.created_at,
    updatedAt: roomBlock.updated_at,
  }
  console.log('unlockBlockData',unlockBlockData.value);
  showUnlockModal.value = true
}

function closeUnlockModal() {
  showUnlockModal.value = false
  unlockBlockData.value = null
}
async function handleUnlockSaved(data: any) {
  closeUnlockModal()
  await refresh()
}

function handleEditRoomBlock(roomBlock: any) {
  closeRoomBlockTooltipNow()

  const blockData = {
    id: roomBlock.id,
    blockFromDate: roomBlock.block_from_date,
    blockToDate: roomBlock.block_to_date,
    reason: roomBlock.reason,
    status: roomBlock.status,
    description: roomBlock.description || '',
    room: {
      id: roomBlock.room?.id,
      roomNumber: roomBlock.room?.room_number,
    },
    roomType: {
      id: roomBlock.room_type?.id,
      roomTypeName: roomBlock.room_type?.name,
    },
    createdAt: roomBlock.created_at,
    updatedAt: roomBlock.updated_at,
  }

  openCreateBlockModal(true, blockData, null)
}

const handleBlockSave = async (data: any) => {
  handleBlockClose()

  // Rafraîchir le calendrier pour afficher les changements
  await refresh()

  // Afficher un message de succès (optionnel)
  if (data.isEditing) {
    console.log(' Block updated successfully')
  } else {
    console.log(' Block(s) created successfully')
  }
}

// Fonction pour calculer la position de la tooltip (en haut ou en bas)
function getTooltipPosition() {
  if (!tooltipRoomBlockPosition.value) return {}

  const { x, y } = tooltipRoomBlockPosition.value
  const tooltipHeight = 250 // Hauteur estimée de la tooltip
  const spaceAbove = y
  const spaceBelow = window.innerHeight - y

  // Si plus d'espace en bas, afficher en bas
  if (spaceBelow > tooltipHeight || spaceBelow > spaceAbove) {
    return {
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-50%, 0)',
      marginTop: '25px',
    }
  }

  // Sinon afficher en haut
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -100%)',
    marginTop: '-25px',
  }
}

// Fonction pour la classe CSS de la flèche
function getArrowClass() {
  if (!tooltipRoomBlockPosition.value) return ''

  const { y } = tooltipRoomBlockPosition.value
  const tooltipHeight = 250
  const spaceBelow = window.innerHeight - y
  const spaceAbove = y

  if (spaceBelow > tooltipHeight || spaceBelow > spaceAbove) {
    return 'pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2'
  }

  return 'pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2'
}

// Fonction pour les bordures de la flèche
function getArrowBorderClass() {
  if (!tooltipRoomBlockPosition.value) return ''

  const { y } = tooltipRoomBlockPosition.value
  const tooltipHeight = 250
  const spaceBelow = window.innerHeight - y
  const spaceAbove = y

  if (spaceBelow > tooltipHeight || spaceBelow > spaceAbove) {
    return 'border-b border-r'
  }

  return 'border-t border-l'
}

// Unassigned reservations modal handlers
const currentRoomTypeData = computed(() => {
  const dStr = selectedUnassignedDate.value
  if (!dStr) return []

  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)
  return metric?.unassigned_room_reservations_by_type || []
})

// function openUnassignedModal(date: string) {
//   selectedUnassignedDate.value = date

//   // Récupérer toutes les réservations pour cette date
//   const metric = apiOccupancyMetrics.value.find((m: any) => m.date === date)
//   console.log('Metric for date', date, metric)

//   if (metric && metric.unassigned_room_reservations_by_type) {
//     // Utiliser les détails complets des réservations non assignées
//     unassignedReservations.value = metric.unassigned_room_reservations_by_type
//   } else {
//     // Alternative : filtrer depuis toutes les réservations
//     const allReservations = apiRoomGroups.value.flatMap((group: any) => group.reservations || [])
//     unassignedReservations.value = allReservations.filter((res: any) => {
//       const hasUnassignedRooms = res.reservationRooms?.some((room: any) => !room.roomId)
//       const matchesDate =
//         res.checkInDate === date || (res.checkInDate <= date && res.checkOutDate > date)
//       return hasUnassignedRooms && matchesDate
//     })
//   }

//   console.log('Opening unassigned modal with:', unassignedReservations.value)
//   showUnassignedModal.value = true
// }
function openUnassignedModal(date: string) {
  selectedUnassignedDate.value = date

  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === date)
  console.log('Metric for date', date, metric)

  if (metric && metric.unassigned_room_reservations_by_type) {

    const allUnassignedReservations = metric.unassigned_room_reservations_by_type.flatMap(
      (roomType: any) => roomType.unassigned_reservations || []
    )
    unassignedReservations.value = allUnassignedReservations
  } else {
    // Fallback
    const allReservations = apiRoomGroups.value.flatMap((group: any) => group.reservations || [])
    unassignedReservations.value = allReservations.filter((res: any) => {
      const hasUnassignedRooms = res.reservationRooms?.some((room: any) => !room.roomId)
      const matchesDate =
        res.checkInDate === date || (res.checkInDate <= date && res.checkOutDate > date)
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
;(window as any).handleUnassignedClick = (date: string) => {
  openUnassignedModal(date)
}

// Handle unassigned room click with room type filtering
function handleUnassignedRoomClick(date: Date, roomTypeId: number) {
  const dStr = date.toISOString().split('T')[0]
  selectedUnassignedDate.value = dStr

  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)

  if (metric && metric.unassigned_room_reservations_by_type) {
    const roomTypeData = metric.unassigned_room_reservations_by_type.find(
      (rt: any) => rt.room_type_id === roomTypeId,
    )

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
      }
    }
  }
}
const selectedDate = ref(new Date().toISOString().split('T')[0])
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

  // --- Récupération des réservations ---
  const allReservations = group.reservations || []
  const reservations = allReservations.filter((r: any) => {
    return (
      r.assigned_room_number === room.room_number ||
      r.room_number === room.room_number ||
      (room.room_number === null && !r.assigned_room_number)
    )
  })

  // --- Récupération des room blocks ---
  const roomBlocks = apiRoomBlocks.value.filter(
    (b: any) => b.room && b.room.room_number === room.room_number,
  )

  for (let i = 0; i < visibleDates.value.length; i++) {
    const date = visibleDates.value[i]
    const dStr = date.toISOString().split('T')[0]

    // Room block covering this day
    const roomBlock = roomBlocks.find((b: any) => {
      const startDate = new Date(b.block_from_date)
      const endDate = new Date(b.block_to_date)
      return startDate <= date && endDate >= date
    })

    // Identify reservations that start on this day
    const reservationsStartingToday = reservations.filter((r: any) =>
      r.check_in_date.startsWith(dStr),
    )

    // Identify reservations that end on this day
    const reservationsEndingToday = reservations.filter((r: any) => {
      const end = new Date(r.check_out_date)
      return (
        end.getFullYear() === date.getFullYear() &&
        end.getMonth() === date.getMonth() &&
        end.getDate() === date.getDate()
      )
    })

    // Single-day reservations that both start and end on this same day
    const singleDayReservations = reservationsStartingToday.filter((r: any) => {
      const end = new Date(r.check_out_date)
      return (
        end.getFullYear() === date.getFullYear() &&
        end.getMonth() === date.getMonth() &&
        end.getDate() === date.getDate()
      )
    })

    // Use the existing single-day segment renderer to also show the departure half
    // when a spanning reservation ends today. This avoids adding new template blocks.
    const hourSegments: any[] = [...singleDayReservations]

    // Start and End segments for this day (spanning reservations only)
    const reservationStart = reservationsStartingToday.find((r: any) => {
      const end = new Date(r.check_out_date)
      // Exclude single-day reservations; only include spans
      return !(
        end.getFullYear() === date.getFullYear() &&
        end.getMonth() === date.getMonth() &&
        end.getDate() === date.getDate()
      )
    })
    const reservationEnd = reservationsEndingToday.find((r: any) => {
      const start = new Date(r.check_in_date)
      // Exclude single-day reservations; only include spans
      return !(
        start.getFullYear() === date.getFullYear() &&
        start.getMonth() === date.getMonth() &&
        start.getDate() === date.getDate()
      )
    })

    // If a spanning reservation ends today, add a left-half hour segment
    // from 00:00 to actual checkout time (defaulting to 12:00 when missing).
    const isFirstVisibleDay = i === 0
    if (isFirstVisibleDay && reservationEnd && reservationsStartingToday.length > 0) {
      const endSeg: any = { ...reservationEnd }
      endSeg.check_in_time = '00:00:00'
      endSeg.check_out_time = endSeg.check_out_time || endSeg.checkOutTime || '12:00:00'
      hourSegments.push(endSeg)
    }

    // Middle segment (strictly inside the range)
    const reservationMiddle = reservations.find((r: any) => {
      const start = new Date(r.check_in_date)
      const end = new Date(r.check_out_date)
      return start < date && end > date
    })

    // Carry-over anchor on first visible day when reservation started before range
    let reservationCarryOver: any = null
    if (i === 0) {
      reservationCarryOver =
        reservations.find((r: any) => {
          const start = new Date(r.check_in_date)
          const end = new Date(r.check_out_date)
          const firstVisible = visibleDates.value[0]

          return start < firstVisible && end >= firstVisible
        }) || null
    }

    cells.push({
      type: 'room',
      date,
      key: i,
      roomBlock: roomBlock || null,
      reservationStart: reservationStart || null,
      reservationEnd: reservationEnd || null,
      reservationMiddle: reservationMiddle || null,
      reservationCarryOver,
      singleDayReservations: hourSegments,
    })
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
  return metric ? metric.occupancy_rate : '0'
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
    const roomTypeData = metric.available_rooms_by_type.find(
      (rt: any) => rt.room_type_id === roomTypeId,
    )
    return roomTypeData ? roomTypeData.available_count : '0'
  }

  return '0'
}

function getUnassignedRoomsByType(date: Date, roomTypeId: number) {
  const dStr = date.toISOString().split('T')[0]
  const metric = apiOccupancyMetrics.value.find((m: any) => m.date === dStr)

  if (metric && metric.unassigned_room_reservations_by_type) {
    const roomTypeData = metric.unassigned_room_reservations_by_type.find(
      (rt: any) => rt.room_type_id === roomTypeId,
    )
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
  const { is_check_in, is_check_out } = cell

  // Per-cell segment rendering without colspan/rowspan.
  // - Middle days: full width
  // - Start day: right half
  // - End day: left half
  // - Single-day (start & end): centered half
  let width = 'calc(100% - 4px)'
  let left = '2px'

  if (is_check_in && is_check_out) {
    width = 'calc(50% - 4px)'
    left = 'calc(25% + 2px)'
  } else if (is_check_in) {
    width = 'calc(50% - 4px)'
    left = 'calc(50% + 2px)'
  } else if (is_check_out) {
    width = 'calc(50% - 4px)'
    left = '2px'
  }

  if (cell.reservation && cell.reservation.reservation_status) {
    const backgroundColor = getReservationColor(cell.reservation.reservation_status)
    return { width, left, backgroundColor }
  } else {
    const backgroundColor = getReservationColor('blocked')
    return { width, left, backgroundColor }
  }
}
const getReservationColor = statusColorStore.getReservationColor
function getReservationText(reservation: any): string {

  return reservation?.guest_name ?? reservation?.title ?? ''
}
function getOtaIconSrcForReservation(reservation: any): string | null {
  if (!reservation) return null
  const name =
    reservation?.otaName ||
    reservation?.bookingSourceName ||
    reservation?.bookingSource?.name ||
    reservation?.source ||
    null
  return getOtaIconSrc(name)
}

// Room block overlay helpers: anchor and style (full cell widths, no half-day logic)
function isRoomBlockAnchor(cell: any): boolean {
  if (!cell?.roomBlock) return false
  const block = cell.roomBlock
  const startDate = new Date(block.block_from_date)
  const endDate = new Date(block.block_to_date)
  const current = cell.date
  const firstVisible = visibleDates.value[0]

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  // Anchor when block starts on this visible day
  if (sameDay(startDate, current)) return true
  // Or when block started before the visible range and continues into it → anchor on first visible day
  if (sameDay(current, firstVisible) && startDate < firstVisible && endDate >= firstVisible)
    return true
  return false
}

function getRowBlockOverlayStyle(cell: any) {
  const block = cell.roomBlock
  if (!block) return {}

  const startDate = new Date(block.block_from_date)
  const endDate = new Date(block.block_to_date)
  const firstVisible = visibleDates.value[0]
  const lastVisible = visibleDates.value[visibleDates.value.length - 1]

  // Find start index within visible range (or clamp to 0 if before)
  let startIndex = 0
  for (let i = 0; i < visibleDates.value.length; i++) {
    const d = visibleDates.value[i]
    if (
      d.getFullYear() === startDate.getFullYear() &&
      d.getMonth() === startDate.getMonth() &&
      d.getDate() === startDate.getDate()
    ) {
      startIndex = i
      break
    }
    if (startDate < firstVisible) {
      startIndex = 0
    }
  }

  // Find end index within visible range (or clamp to last if after)
  let endIndex = visibleDates.value.length - 1
  for (let i = 0; i < visibleDates.value.length; i++) {
    const d = visibleDates.value[i]
    if (
      d.getFullYear() === endDate.getFullYear() &&
      d.getMonth() === endDate.getMonth() &&
      d.getDate() === endDate.getDate()
    ) {
      endIndex = i
      break
    }
    if (endDate > lastVisible) {
      endIndex = visibleDates.value.length - 1
    }
  }

  // Full cell widths across the span (inclusive)
  const spanCells = Math.max(1, endIndex - startIndex + 1)
  const widthPercent = spanCells * 100 // no half-day logic for blocks
  const left = '0%'
  const width = `${widthPercent}%`
  const backgroundColor = getRoomBlockColor(block.status)
  return { left, width, backgroundColor }
}

function getRowOverlayStyle(cell: any) {
  const res = cell.reservationStart || cell.reservationCarryOver
  if (!res) return {}

  // Compute start anchor
  const startHalf = !!cell.reservationStart // true if start is visible
  const startIndex = cell.key

  // Compute end anchor
  const endDate = new Date(res.check_out_date)
  const firstVisible = visibleDates.value[0]
  const lastVisible = visibleDates.value[visibleDates.value.length - 1]
  let endIndex = -1
  let endHalf = false
  for (let i = 0; i < visibleDates.value.length; i++) {
    const d = visibleDates.value[i]
    if (
      d.getFullYear() === endDate.getFullYear() &&
      d.getMonth() === endDate.getMonth() &&
      d.getDate() === endDate.getDate()
    ) {
      endIndex = i
      endHalf = true // end within visible → end at mid-cell
      break
    }
  }
  if (endIndex < 0 && endDate > lastVisible) {
    endIndex = visibleDates.value.length - 1
    endHalf = false // end after visible → end at right edge
  }

  // Calculate start/end fractions by time within the day
  const startFrac = startHalf
    ? parseTimeToFraction(res?.check_in_time || res?.checkInTime || '14:00:00')
    : 0
  const endFrac = endHalf
    ? parseTimeToFraction(res?.check_out_time || res?.checkOutTime || '12:00:00')
    : 1

  // Width calculation in % of cell width, relative to start cell:
  // base cells: (endIndex - startIndex) * 100
  // add end contribution: +endFrac*100 if endHalf else +100
  // subtract start contribution: -startFrac*100 if startHalf else -0
  const base = Math.max(0, endIndex - startIndex) * 100
  const endContribution = endHalf ? endFrac * 100 : 100
  const startContribution = startHalf ? startFrac * 100 : 0
  const widthPercent = base + endContribution - startContribution

  const backgroundColor = getReservationColor(res.reservation_status)
  let left = startHalf ? `${startFrac * 100}%` : '0%'
  let width = `${widthPercent}%`
  // Add a 1px visual gap when both end and start occur on the same day
  if (startHalf && cell?.reservationEnd) {
    left = `calc(${startFrac * 100}% + 1px)`
    width = `calc(${widthPercent}% - 1px)`
  }
  return { left, width, backgroundColor }
}

// Single-day segment style: position by hour within a 24-hour cell
function parseTimeToFraction(timeStr: string | null | undefined): number {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  const h = parseInt(parts[0] || '0', 10)
  const m = parseInt(parts[1] || '0', 10)
  const s = parseInt(parts[2] || '0', 10)
  const totalHours = h + m / 60 + s / 3600
  return Math.min(1, Math.max(0, totalHours / 24))
}

function getSingleDaySegmentStyle(reservation: any) {
  const startFrac = parseTimeToFraction(
    reservation?.check_in_time || reservation?.checkInTime || '14:00:00',
  )
  const endFrac = parseTimeToFraction(
    reservation?.check_out_time || reservation?.checkOutTime || '12:00:00',
  )
  const start = Math.min(startFrac, endFrac)
  const end = Math.max(startFrac, endFrac)

  const left = `${start * 100}%`
  const width = `${Math.max(0.03, end - start) * 100}%` // minimum 3% width
  const backgroundColor = getReservationColor(reservation?.reservation_status || 'blocked')
  return { left, width, backgroundColor }
}

// Determine occupancy type for a given room/date
// Returns: 'free' | 'occupied_full' | 'occupied_left' | 'occupied_right' | 'occupied_center'
function getCellOccupancyType(roomType: string, roomNumber: string, date: Date): string {
  // First, treat room blocks as fully occupied for selection purposes
  const blocksForRoom = (apiRoomBlocks.value || []).filter(
    (b: any) => b.room && b.room.room_number === roomNumber,
  )
  const isBlocked = blocksForRoom.some((b: any) => {
    const start = new Date(b.block_from_date)
    const end = new Date(b.block_to_date)
    return start <= date && end >= date
  })
  if (isBlocked) return 'occupied_full'

  const group = (apiRoomGroups.value || []).find((g: any) => g.room_type === roomType)
  if (!group) return 'free'
  const allReservations = group.reservations || []
  const reservations = allReservations.filter((r: any) => {
    return (
      r.assigned_room_number === roomNumber ||
      r.room_number === roomNumber ||
      (roomNumber === null && !r.assigned_room_number)
    )
  })

  const dStr = date.toISOString().split('T')[0]
  const hasStart = reservations.some((r: any) => (r.check_in_date || '').startsWith(dStr))
  const hasEnd = reservations.some((r: any) => {
    const end = new Date(r.check_out_date)
    return (
      end.getFullYear() === date.getFullYear() &&
      end.getMonth() === date.getMonth() &&
      end.getDate() === date.getDate()
    )
  })
  const hasMiddle = reservations.some((r: any) => {
    const start = new Date(r.check_in_date)
    const end = new Date(r.check_out_date)
    return start < date && end > date
  })

  if (hasMiddle) return 'occupied_full'
  if (hasStart && hasEnd) return 'occupied_center'
  if (hasStart) return 'occupied_right'
  if (hasEnd) return 'occupied_left'
  return 'free'
}

function getRoomBlockColor(status: string) {
  return getReservationColor('blocked')
}

// --- API CALL ---
const getLocaleDailyOccupancyAndReservations = async () => {
  isLoading.value = !laoded.value
  isRefreshing.value = laoded.value
  const serviceId = serviceStore.serviceId!
  const response = await getDailyOccupancyAndReservations(
    serviceId,
    start_date.value,
    end_date.value,
  )
  serviceResponse.value = response.data
  console.log('this is the response', response)
  isLoading.value = false
  isRefreshing.value = false
  laoded.value = true
}
// const refresh = async () => {
//   isRefreshing.value = true
//   try {
//     showModalAddingModal.value = false;
//     closeAssignRoomModal();
//     const serviceId = serviceStore.serviceId!
//     const response = await getDailyOccupancyAndReservations(serviceId, start_date.value, end_date.value)
//     serviceResponse.value = response.data
//     console.log('this is the response', serviceResponse.value)
//   } finally {
//     isRefreshing.value = false
//   }
// }

const refresh = async () => {
  console.log('🔄 REFRESH TRIGGERED')
  isRefreshing.value = true
  try {
    showModalAddingModal.value = false
    closeAssignRoomModal()
    const serviceId = serviceStore.serviceId!
    const response = await getDailyOccupancyAndReservations(
      serviceId,
      start_date.value,
      end_date.value,
    )
    serviceResponse.value = response.data
    console.log('✅ REFRESH COMPLETED:', serviceResponse.value)
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
  },
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
        id: item.room_type_id,
      }
    })
    if (selectedRoomTypes.value.length === 0) {
      selectedRoomTypes.value = serviceResponse.value?.grouped_reservation_details.map(
        (item: any) => {
          return item.room_type_id
        },
      )
    }
    return res
  }
  return []
})
onMounted(async () => {
  const hotelId = serviceStore.serviceId
  let hotel = serviceStore.getCurrentService

  if (!hotel) {
     const res = await getHotelById(hotelId!)
     hotel = res.data?.data ?? res.data
  }

  selectedDate.value = hotel?.currentWorkingDate
  getLocaleDailyOccupancyAndReservations()
})

watch([selectedDate, daysToShow], () => {
  getLocaleDailyOccupancyAndReservations()
})

const tooltipReservation = ref<any | null>(null)
const tooltipPosition = ref<{ x: number; y: number; placement?: 'above' | 'below' } | null>(null)

function showReservationTooltip(reservation: any, event: MouseEvent) {
  const reservationId = reservation?.reservation_id || reservation?.id

  // Éviter les tooltips multiples
  if (currentHoveredReservation.value && currentHoveredReservation.value !== reservationId) {
    hideReservationTooltip()
  }

  currentHoveredReservation.value = reservationId
  tooltipReservation.value = reservation

  // Positionnement centré sur l'élément survolé
  // Utiliser currentTarget pour cibler l'élément sur lequel le listener est attaché
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const tooltipEstimatedHeight = 300 // Hauteur estimée de la tooltip
  const margin = 8

  const x = rect.left + rect.width / 2

  // Placer au-dessus si possible, sinon en dessous
  if (rect.top >= tooltipEstimatedHeight + margin) {
    // placer au-dessus : y correspond au bas de la tooltip (coordonnée de référence)
    tooltipPosition.value = { x, y: rect.top - margin, placement: 'above' }
  } else {
    // placer en dessous : y correspond au sommet de la tooltip
    tooltipPosition.value = { x, y: rect.bottom + margin, placement: 'below' }
  }
}

function hideReservationTooltip() {
  currentHoveredReservation.value = null
  tooltipReservation.value = null
  tooltipPosition.value = null
}

// function showReservationTooltip(reservation: any, event: MouseEvent) {
//   tooltipReservation.value = reservation
//   tooltipPosition.value = { x: event.clientX, y: event.clientY }
// }
// function hideReservationTooltip() {
//   tooltipReservation.value = null
//   tooltipPosition.value = null
// }

const statusElements = ref(['all', 'blocked', 'occupied', 'reserved', 'dueOut', 'dirty']) // 'vacant',

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

// const fectRateTypes = async () => {
//   loadingRates.value = true
//   const data = serviceStore.rateTypes || []
//   console.log('rateTypeOptions', data)

//   currentRateTypeData.value = data
//   rateTypeOptions.value = data.map((item: any) => {
//     return {
//       label: item.rateTypeName,
//       value: item.rateTypeId,
//     }
//   })
//   selectRateType.value = rateTypeOptions.value[0]?.value
//   console.log('✅ Initialized selectRateType:', selectRateType.value)
//   loadingRates.value = false
//   return data
// }

const fectRateTypes = async () => {
  loadingRates.value = true

  try {
    const data = serviceStore.rateTypes || []

    if (data.length === 0) {
      console.warn(' No rate types in serviceStore')
      loadingRates.value = false
      return []
    }

    currentRateTypeData.value = data

    // Mapper avec gestion flexible des noms de propriétés
    rateTypeOptions.value = data.map((item: any, index: number) => {
      const value = item.rateTypeId ?? item.id ?? item.rate_type_id
      const label = item.rateTypeName ?? item.name ?? item.label ?? `Rate ${index + 1}`

      return { label, value }
    }).filter(opt => opt.value != null)


    // Initialiser avec la première option valide
    if (rateTypeOptions.value.length > 0) {
      selectRateType.value = rateTypeOptions.value[0].value
    } else {
      console.error(' No valid options created!')
    }

  } catch (error) {
    console.error(' Error in fectRateTypes:', error)
  } finally {
    loadingRates.value = false
  }

  return currentRateTypeData.value
}


fectRateTypes()
//Function to get room rate for a specific room type and date
// const roomRateForDate = computed(() => {
//   console.log('rumm', selectRateType.value)
//   console.log('currentRateTypeData.value', currentRateTypeData.value)
//   if (!selectRateType.value || !currentRateTypeData.value.length) {
//     return []
//   }

//   // Find the selected rate type in the current data
//   const selectedRateTypes = currentRateTypeData.value.find(
//     (rateType: any) => rateType.rateTypeId === selectRateType.value,
//   )
//   console.log('selected rates', selectedRateTypes)
//   if (!selectedRateTypes || !selectedRateTypes.roomTypes) {
//     return []
//   }
//   const result = {} as any
//   selectedRateTypes.roomTypes.forEach((roomType: any) => {
//     result[roomType.roomTypeId] = roomType.roomRate
//   })
//   console.log('result', result)
//   return result
// })

const roomRateForDate = computed(() => {

  if (!selectRateType.value || !currentRateTypeData.value?.length) {
    return {}
  }

  const selectedRateTypes = currentRateTypeData.value.find((rateType: any) => {
    const id = rateType.rateTypeId ?? rateType.id
    return Number(id) === Number(selectRateType.value)
  })

  if (!selectedRateTypes?.roomTypes) {
    return {}
  }

  const result = {} as Record<number, string>

  selectedRateTypes.roomTypes.forEach((roomType: any) => {
    const roomTypeId = Number(roomType.id)

    if (Array.isArray(roomType.roomRates) && roomType.roomRates.length > 0) {
      const matchingRate = roomType.roomRates.find((r: any) => {
        const rateId = Number(r.rateTypeId ?? r.rate_type_id ?? r.rateType?.id)
        return rateId === Number(selectRateType.value)
      })

      if (matchingRate) {
        const rate = matchingRate.baseRate
        if (rate != null && !isNaN(Number(rate))) {
          //  Formater sans décimales
          const numRate = Number(rate)
          result[roomTypeId] = new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(numRate)

        } else {
          console.warn(` Invalid rate: ${rate}`)
          result[roomTypeId] = 'N/A'
        }
      } else {
        console.warn(` No rate found for rateTypeId ${selectRateType.value}`)
        result[roomTypeId] = 'N/A'
      }
    }
  })
  return result
})

const legendSections = computed(() => {
  const colorGetter = statusColorStore.getReservationColor

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
        { label: t('Dayuse Reservation'), color: colorGetter('confirmed') },
      ],
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
        { label: t('bookings.calendar.labels.splitReservation'), icon: SplitIcons },
      ],
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
        { label: t('bookings.calendar.labels.unconfirmedBookings'), color: '#f87171' },
      ],
    },
  ]
})
// État de sélection modifié pour les cellules individuelles
const cellSelection = ref({
  selectedCells: new Set<string>(), // Format: "roomType_roomNumber_date"
  isSelecting: false,
  inprogress: false,
  startCell: null as {
    roomType: string
    roomTypeId: number
    roomNumber: string
    date: Date
    offsetX: number
    cellWidth: number
  } | null,
  currentCell: null as {
    roomType: string
    roomTypeId: number
    roomNumber: string
    date: Date
    offsetX: number
    cellWidth: number
  } | null,
})
const MIN_CELL_SELECTION_HOURS = 1

// Fonction pour créer une clé unique pour une cellule
function getCellKey(roomType: string, roomNumber: string, date: Date): string {
  const dateStr = date.toISOString().split('T')[0]
  return `${roomType}_${roomNumber}_${dateStr}`
}

// Fonction pour démarrer la sélection de cellules
function startCellSelection(
  roomType: string,
  roomTypeId: number,
  roomNumber: string,
  date: Date,
  event: MouseEvent,
) {
  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  const cellWidth = target.offsetWidth

  const occupancy = getCellOccupancyType(roomType, roomNumber, new Date(date))
  const clickRatio = cellWidth > 0 ? event.offsetX / cellWidth : 0
  if (occupancy === 'occupied_full') {
    return
  }
  if (occupancy === 'occupied_right' && clickRatio >= 0.5) {
    return
  }
  if (occupancy === 'occupied_left' && clickRatio < 0.5) {
    return
  }
  if (occupancy === 'occupied_center' && clickRatio >= 0.25 && clickRatio <= 0.75) {
    return
  }

  cellSelection.value.isSelecting = true
  cellSelection.value.inprogress = true
  cellSelection.value.startCell = {
    roomType,
    roomTypeId,
    roomNumber,
    date: new Date(date),
    offsetX: event.offsetX,
    cellWidth,
  }
  cellSelection.value.currentCell = {
    roomType,
    roomTypeId,
    roomNumber,
    date: new Date(date),
    offsetX: event.offsetX,
    cellWidth,
  }

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
function updateCellSelection(
  roomType: string,
  roomTypeId: number,
  roomNumber: string,
  date: Date,
  event: MouseEvent,
) {
  if (!cellSelection.value.isSelecting || !cellSelection.value.startCell) return

  // Autoriser uniquement la sélection sur la même chambre
  if (
    cellSelection.value.startCell.roomType !== roomType ||
    cellSelection.value.startCell.roomTypeId !== roomTypeId ||
    cellSelection.value.startCell.roomNumber !== roomNumber
  ) {
    return
  }

  const occupancy = getCellOccupancyType(roomType, roomNumber, new Date(date))
  if (occupancy === 'occupied_full') return

  const target = event.currentTarget as HTMLElement
  const cellWidth = target.offsetWidth

  cellSelection.value.currentCell = {
    roomType,
    roomTypeId,
    roomNumber,
    date: new Date(date),
    offsetX: event.offsetX,
    cellWidth,
  }

  // Recalculer les cellules sélectionnées
  calculateSelectedCells()
}

// Fonction pour calculer toutes les cellules sélectionnées dans la plage
function calculateSelectedCells() {
  if (!cellSelection.value.startCell || !cellSelection.value.currentCell) return

  cellSelection.value.selectedCells.clear()

  const startDate = new Date(cellSelection.value.startCell.date)
  const targetDate = new Date(cellSelection.value.currentCell.date)
  const roomType = cellSelection.value.startCell.roomType
  const roomNumber = cellSelection.value.startCell.roomNumber

  const forward = targetDate.getTime() >= startDate.getTime()
  let current = new Date(startDate)
  // Always include the starting day
  cellSelection.value.selectedCells.add(getCellKey(roomType, roomNumber, current))

  // Step toward target date, stopping at first occupied day
  while (true) {
    // If we have reached the target date, stop
    if (current.getTime() === targetDate.getTime()) break

    // Compute next day in the drag direction
    const next = new Date(current)
    next.setDate(current.getDate() + (forward ? 1 : -1))

    // Check occupancy for the next date
    const occupancy = getCellOccupancyType(roomType, roomNumber, next)

    if (occupancy === 'free') {
      cellSelection.value.selectedCells.add(getCellKey(roomType, roomNumber, next))
      current = next
      continue
    }

    if (occupancy === 'occupied_left' || occupancy === 'occupied_right') {
      cellSelection.value.selectedCells.add(getCellKey(roomType, roomNumber, next))
      current = next
    }

    break
  }
  if (cellSelection.value.currentCell) {
    const currentCellInfo = cellSelection.value.currentCell
    const currentDateStr = current.toISOString().split('T')[0]
    const currentCellDateStr = currentCellInfo.date.toISOString().split('T')[0]
    if (currentCellDateStr !== currentDateStr) {
      const w = currentCellInfo.cellWidth || cellSelection.value.startCell?.cellWidth || 0
      if (w > 0) {
        currentCellInfo.cellWidth = w
        currentCellInfo.offsetX = forward ? w : 0
      }
      currentCellInfo.date = new Date(current)
    }
  }
}

// Fonction pour terminer la sélection de cellules
function endCellSelection(event?: MouseEvent) {
  if (!cellSelection.value.isSelecting) return
  cellSelection.value.isSelecting = false

  if (event) {
    const elements = document.elementsFromPoint(event.clientX, event.clientY)
    const cellElement = elements.find(
      (el) => el.tagName === 'TD' && el.classList.contains('cell-selectable'),
    )
    if (cellElement) {
      const rect = cellElement.getBoundingClientRect()
      const tooltipHeight = 180 // Estimated height in pixels
      const spaceBelow = window.innerHeight - rect.bottom

      isTooltipAbove.value = spaceBelow < tooltipHeight
      selectionTooltipPosition.value = {
        x: rect.left + rect.width / 2,
        y: isTooltipAbove.value ? rect.top : rect.bottom,
      }
    } else {
      selectionTooltipPosition.value = { x: event.clientX, y: event.clientY }
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
    const currentCellInfo = cellSelection.value.currentCell
    if (currentCellInfo) {
      const elements = document.elementsFromPoint(event.clientX, event.clientY)
      const cellElement = elements.find(
        (el) => el.tagName === 'TD' && el.classList.contains('cell-selectable'),
      )
      if (cellElement) {
        const rect = cellElement.getBoundingClientRect()
        const offsetX = event.clientX - rect.left
        currentCellInfo.cellWidth = rect.width
        let adjustedOffsetX = offsetX

        // Clamp offset into free portion of the cell when hovering over reserved halves
        const occupancy = getCellOccupancyType(
          currentCellInfo.roomType,
          currentCellInfo.roomNumber,
          new Date(currentCellInfo.date),
        )
        const halfWidth = rect.width / 2
        const quarterWidth = rect.width / 4

        if (occupancy === 'occupied_full') {
          // Prevent extending into fully occupied cell: snap to nearest free boundary
          adjustedOffsetX = offsetX < halfWidth ? 0 : rect.width // show zero-width on this cell
        } else if (occupancy === 'occupied_right') {
          // Right half occupied: clamp to left half
          adjustedOffsetX = Math.min(offsetX, halfWidth - 0.5)
        } else if (occupancy === 'occupied_left') {
          // Left half occupied: clamp to right half
          adjustedOffsetX = Math.max(offsetX, halfWidth + 0.5)
        } else if (occupancy === 'occupied_center') {
          // Center 50% occupied: allow only outer quarters
          if (offsetX > quarterWidth && offsetX < rect.width - quarterWidth) {
            // Snap to nearest allowed quarter boundary
            adjustedOffsetX = offsetX <= halfWidth ? quarterWidth : rect.width - quarterWidth
          }
        }

        currentCellInfo.offsetX = adjustedOffsetX
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
  const selection = cellSelection.value
  if (!selection.startCell || !selection.currentCell) return {}

  const startCellInfo =
    selection.startCell.date.getTime() < selection.currentCell.date.getTime()
      ? selection.startCell
      : selection.currentCell
  const endCellInfo =
    selection.startCell.date.getTime() < selection.currentCell.date.getTime()
      ? selection.currentCell
      : selection.startCell

  if (selection.isSelecting) {
    // Case 1: During selection, individual cells
    const selectionStartDate = new Date(
      Math.min(selection.startCell.date.getTime(), selection.currentCell.date.getTime()),
    )
    const selectionEndDate = new Date(
      Math.max(selection.startCell.date.getTime(), selection.currentCell.date.getTime()),
    )

    const isStart = date.getTime() === selectionStartDate.getTime()
    const isEnd = date.getTime() === selectionEndDate.getTime()

    let width = '100%'
    let left = '0'

    if (isStart && isEnd) {
      const startOffset = Math.min(startCellInfo.offsetX, endCellInfo.offsetX)
      const endOffset = Math.max(startCellInfo.offsetX, endCellInfo.offsetX)
      const cellWidth = startCellInfo.cellWidth
      if (cellWidth > 0) {
        left = `${(startOffset / cellWidth) * 100}%`
        width = `${((endOffset - startOffset) / cellWidth) * 100}%`
      }
    } else if (isStart) {
      const cellWidth = startCellInfo.cellWidth
      if (cellWidth > 0) {
        left = `${(startCellInfo.offsetX / cellWidth) * 100}%`
        width = `${100 - (startCellInfo.offsetX / cellWidth) * 100}%`
      }
    } else if (isEnd) {
      const cellWidth = endCellInfo.cellWidth
      if (cellWidth > 0) {
        width = `${(endCellInfo.offsetX / cellWidth) * 100}%`
      }
    }
    return { width, left }
  } else {
    // Case 2: After selection, render per-cell segments (no merged cells)
    const selectionInfo = getSelectionInfo()
    if (!selectionInfo) return {}

    const selectionStartDate = selectionInfo.startDate
    const selectionEndDate = selectionInfo.endDate

    const isStart = date.getTime() === selectionStartDate.getTime()
    const isEnd = date.getTime() === selectionEndDate.getTime()

    let width = '100%'
    let left = '0'

    if (isStart && isEnd) {
      const startOffset = Math.min(startCellInfo.offsetX, endCellInfo.offsetX)
      const endOffset = Math.max(startCellInfo.offsetX, endCellInfo.offsetX)
      const cellWidth = startCellInfo.cellWidth
      if (cellWidth > 0) {
        left = `${(startOffset / cellWidth) * 100}%`
        width = `${((endOffset - startOffset) / cellWidth) * 100}%`
      }
    } else if (isStart) {
      const cellWidth = startCellInfo.cellWidth
      if (cellWidth > 0) {
        left = `${(startCellInfo.offsetX / cellWidth) * 100}%`
        width = `${100 - (startCellInfo.offsetX / cellWidth) * 100}%`
      }
    } else if (isEnd) {
      const cellWidth = endCellInfo.cellWidth
      if (cellWidth > 0) {
        width = `${(endCellInfo.offsetX / cellWidth) * 100}%`
      }
    }
    return { width, left }
  }
}

function getSelectionTimes() {
  const selectionInfo = getSelectionInfo()
  if (selectionInfo?.startHour != null && selectionInfo?.endHour != null) {
    const checkinTime = `${String(selectionInfo.startHour).padStart(2, '0')}:00`
    const checkoutTime =
      selectionInfo.endHour === 24
        ? '00:00'
        : `${String(selectionInfo.endHour).padStart(2, '0')}:00`
    return { checkinTime, checkoutTime }
  }

  const startCellInfo = cellSelection.value.startCell
  const endCellInfo = cellSelection.value.currentCell

  let checkinTime = '14:00'
  let checkoutTime = '12:00'

  if (startCellInfo && startCellInfo.cellWidth > 0) {
    const checkinPercentage = startCellInfo.offsetX / startCellInfo.cellWidth
    const checkinHour = Math.floor(checkinPercentage * 24)
    checkinTime = `${String(checkinHour).padStart(2, '0')}:00`
  }
  if (endCellInfo && endCellInfo.cellWidth > 0) {
    const checkoutPercentage = endCellInfo.offsetX / endCellInfo.cellWidth
    const checkoutHour = Math.floor(checkoutPercentage * 24)
    checkoutTime = `${String(checkoutHour).padStart(2, '0')}:00`
  }

  return { checkinTime, checkoutTime }
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

  const startCellInfo = cellSelection.value.startCell
  const endCellInfo = cellSelection.value.currentCell

  // Analyser les cellules sélectionnées pour extraire les informations
  const cells: any[] = Array.from(cellSelection.value.selectedCells)
  const firstCell = cells[0].split('_')
  const roomType = startCellInfo?.roomType ?? firstCell[0]
  const roomTypeId = startCellInfo?.roomTypeId
  const roomNumber = startCellInfo?.roomNumber ?? firstCell[1]

  // Extraire toutes les dates
  const dates = cells
    .map((cell: any) => new Date(cell.split('_')[2]))
    .sort((a: any, b: any) => a.getTime() - b.getTime())

  const sameDay = dates[0].getTime() === dates[dates.length - 1].getTime()
  if (sameDay) {
    if (
      !startCellInfo ||
      !endCellInfo ||
      startCellInfo.cellWidth <= 0 ||
      endCellInfo.cellWidth <= 0
    )
      return null
    if (
      startCellInfo.date.toISOString().split('T')[0] !==
      endCellInfo.date.toISOString().split('T')[0]
    )
      return null

    const startOffset = Math.min(startCellInfo.offsetX, endCellInfo.offsetX)
    const endOffset = Math.max(startCellInfo.offsetX, endCellInfo.offsetX)
    const cellWidth = startCellInfo.cellWidth

    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
    const startHour = clamp(Math.floor((startOffset / cellWidth) * 24), 0, 23)
    const endHourRaw = clamp(Math.ceil((endOffset / cellWidth) * 24), 0, 24)
    const endHour = Math.max(endHourRaw, startHour + MIN_CELL_SELECTION_HOURS)
    if (endHour > 24) return null
    if (endHour - startHour < MIN_CELL_SELECTION_HOURS) return null

    const startDate = dates[0]
    const endDate = new Date(startDate)
    if (endHour === 24) {
      endDate.setDate(endDate.getDate() + 1)
    }

    return {
      roomType,
      roomTypeId,
      roomNumber,
      startDate,
      endDate,
      totalNights: 0,
      cellCount: 1,
      startHour,
      endHour,
    } as any
  }

  return {
    roomType,
    roomTypeId,
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
  const checkoutDateStr = selectionInfo.endDate.toISOString().split('T')[0]
  //const { checkinTime, checkoutTime } = getSelectionTimes()

  const selectedRateTypeId = selectRateType.value
  const selectedRateTypeName = (rateTypeOptions.value || []).find(
    (rt: any) => String(rt?.value) === String(selectedRateTypeId),
  )?.label

  const group = (apiRoomGroups.value || []).find((g: any) => {
    if (selectionInfo.roomTypeId != null && g?.room_type_id != null) {
      return Number(g.room_type_id) === Number(selectionInfo.roomTypeId)
    }
    return g?.room_type === selectionInfo.roomType
  })

  const room = group?.room_details?.find((r: any) => {
    return (r?.room_number ?? r?.roomNumber) === selectionInfo.roomNumber
  })
   const isDayUse = checkinDate === checkoutDateStr

  // Obtenir l'heure actuelle pour le check-in
    // const now = new Date()
  // const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // Gérer les heures selon le type de réservation
  const finalCheckinTime = '12:00'
  const finalCheckoutTime = isDayUse ? '20:00' : '12:00'

  const roomId = room?.id ?? room?.room_id ?? room?.roomId
  const roomRate = selectionInfo.roomTypeId != null ? (roomRateForDate.value as any)?.[selectionInfo.roomTypeId] : undefined

  router.push({
    name: 'New Booking',
    query: {
      checkin: checkinDate,
      checkout: checkoutDateStr,
      roomType: selectionInfo.roomType,
      roomTypeId: selectionInfo.roomTypeId,
      roomNumber: selectionInfo.roomNumber,
      checkInTime: finalCheckinTime,
      checkOutTime: finalCheckoutTime,
      rateTypeId: selectedRateTypeId,
      rateTypeName: selectedRateTypeName,
      roomId,
      roomRate,
      totalNights: selectionInfo.totalNights,
      startHour: selectionInfo.startHour,
      endHour: selectionInfo.endHour,
      isDayUse: isDayUse ? '20:00' : '12:00',
    },
  })
}

function handleCreateRoomBlock() {
  const selectionInfo = getSelectionInfo()
  if (!selectionInfo) return

  const startStr = selectionInfo.startDate.toISOString().split('T')[0]
  let endStr = selectionInfo.endDate.toISOString().split('T')[0]
  if (new Date(endStr) <= new Date(startStr)) {
    const tmp = new Date(selectionInfo.startDate)
    tmp.setDate(tmp.getDate() + 1)
    endStr = tmp.toISOString().split('T')[0]
  }
  const dateRange = { start: startStr, end: endStr }

  const group = (apiRoomGroups.value || []).find((g: any) => {
    if (selectionInfo.roomTypeId != null && g?.room_type_id != null) {
      return Number(g.room_type_id) === Number(selectionInfo.roomTypeId)
    }
    return g?.room_type === selectionInfo.roomType
  })

  const room = group?.room_details?.find((r: any) => {
    return (r?.room_number ?? r?.roomNumber) === selectionInfo.roomNumber
  })

  const roomId = room?.id ?? room?.room_id ?? room?.roomId

  clearCellSelection()

  if (roomId == null) {
    openCreateBlockModal(false, null, null, dateRange)
    return
  }

  openCreateBlockModal(false, null, {
    roomId,
    roomNumber: selectionInfo.roomNumber,
    roomTypeId: selectionInfo.roomTypeId,
    roomTypeName: selectionInfo.roomType,
  }, dateRange)
}

// Fonction pour déterminer si la cellule doit être affichée
function shouldShowCell(group: any, room: any, cell: any) {
  // Always render all cells; no merged cells
  return true
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



const BlockRoomPermission = computed(() => {
  return useAuthStore().hasPermission('access_to_block')
})

const UnblockRoomPermission = computed(() => {
  return useAuthStore().hasPermission('access_to_unblock')
})

const canAddBooking = computed(() => {
  return useAuthStore().hasPermission("add_reservation")
})

// Cleanup des event listeners
onUnmounted(() => {
  document.removeEventListener('mouseup', endCellSelection)
  document.removeEventListener('mousemove', handleCellMouseMove)
})
</script>
<style scoped>
@reference "tailwindcss";

/* Custom thin scrollbar */
.scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
  scrollbar-gutter: stable;
}

.scrollbar::-webkit-scrollbar {
  width: 6px;
}

.scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.dark .scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.dark .scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

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
    display: block;
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
