<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t(breadcrumbKey)" />
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-4">
      <!-- Left Column: Add Reservation Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <!-- Header -->
        <div class="flex items-center border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <button @click="goBack" class="mr-4 p-2 hover:bg-gray-200 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 class="text-xl font-semibold">{{ $t(formTitleKey) }}</h1>
        </div>

        <!-- Form -->
        <div class="p-5">
          <form class="grid grid-cols-1 xl:grid-cols-1 gap-6 p-6">
            <!-- Left Side: Reservation Form -->
            <div class="space-y-6" :class="{ 'pointer-events-none opacity-60': confirmReservation }" >
              <div class="flex md:flex-nowrap flex-wrap items-start gap-4">
                <!-- Check-In + Nights + Check-Out  -->
                <div class="flex flex-col flex-1">
                  <div class="flex items-end">
                    <!-- Check-In -->
                    <div class="flex flex-col flex-1">
                      <label
                        for="checkin"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        {{ $t('check_in_date') }}
                      </label>
                      <div class="flex">
                        <InputDatePicker
                          v-model="reservation.checkinDate"
                          :allowPastDates="allowPastDates"
                          :placeholder="$t('Selectdate')"
                          :custom-class="'rounded-r-none'"

                        />
                        <InputTimePicker v-model="reservation.checkinTime" class="rounded-none"  />
                      </div>
                    </div>

                    <!-- Nights -->
                    <div class="flex flex-col w-10">
                      <label
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 text-center"
                      >
                        {{ $t('nights') }}
                      </label>
                      <input
                        type="text"
                        id="id"
                        disabled
                        :value="numberOfNights.toString()"
                        class="dark:bg-dark-900 h-11 w-full rounded-none bg-black text-white px-2 py-2.5 text-sm text-center shadow-theme-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                      />
                    </div>

                    <!-- Check-Out -->
                    <div class="flex flex-col flex-1">
                      <label
                        for="checkout"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 ml-2"
                      >
                        {{ $t('check_out_date') }}
                      </label>
                      <div class="flex">
                        <InputDatePicker
                          v-model="reservation.checkoutDate"
                          :allowPastDates="allowPastDates"
                          :minDate="reservation.checkinDate || ''"
                          :placeholder="$t('Selectdate')"
                          :custom-class="'rounded-none'"

                        />
                        <InputTimePicker
                          v-model="reservation.checkoutTime"
                          customClass="rounded-r-lg"

                        />
                      </div>
                    </div>
                  </div>
                  <p v-if="dateError" class="text-sm text-red-600 mt-1">
                    {{ $t(dateError) }}
                  </p>
                </div>

                <!-- Booking Type -->
                <div class="flex flex-col w-auto min-w-[200px]">
                  <AutoCompleteSelect
                    v-model="reservation.bookingType"
                    :options="BookingType"
                    :defaultValue="$t('SelectReservationType')"
                    :lb="$t('ReservationType')"
                    :is-required="false"
                    :use-dropdown="useDropdownBooking"
                    @clear-error="emit('clear-error')"

                  />
                </div>

                <!-- Booking Source -->
                <div class="flex flex-col w-auto min-w-[200px]">
                  <AutoCompleteSelect
                    v-model="reservation.bookingSource"
                    :options="BookingSource"
                    :defaultValue="$t('SelectBookingSource')"
                    :lb="$t('booking_source')"
                    :is-required="false"
                    :use-dropdown="useDropdownBooking"
                    @clear-error="emit('clear-error')"

                  />
                </div>
              </div>

              <div class="grid md:grid-cols-5 grid-cols-1 gap-4">
                <div>
                  <Select
                    :lb="$t('customType')"
                    :options="CustomTypes"
                    :placeholder="$t('select_custom_type')"
                    v-model="reservation.customType"

                  />
                </div>

                <div>
                  <AutoCompleteSelect
                    v-model="reservation.businessSource"
                    :options="BusinessSource"
                    :defaultValue="$t('SelectBusinessSource')"
                    :lb="$t('business_source')"
                    :is-required="false"
                    :use-dropdown="useDropdownBooking"
                    @clear-error="emit('clear-error')"

                  />
                </div>

                <!--arriving to-->
                <Input
                  :lb="$t('ArrivingTo')"
                  :id="'arriving'"
                  :forLabel="'arriving'"
                  :placeholder="$t('ArrivingTo')"
                  v-model="reservation.arrivingTo"

                />

                <!--going to-->
                <Input
                  :lb="$t('GoingTo')"
                  :id="'going'"
                  :forLabel="'going'"
                  :placeholder="$t('GoingTo')"
                  v-model="reservation.goingTo"

                />
                <!--means of transportation-->
                <AutoCompleteSelect
                  v-model="reservation.meansOfTransport"
                  :options="TransportationModes"
                  :defaultValue="$t('MeansOfTransportation')"
                  :lb="$t('MeansOfTransportation')"
                  :is-required="false"
                  :use-dropdown="useDropdownBooking"
                  @clear-error="emit('clear-error')"

                />
              </div>

              <!-- Room Type -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <!-- Complementary -->
                <div class="md:flex justify-between mb-6">
                  <div>
                    <span class="font-normal">{{ $t('RateOffered') }} : </span>
                    <label class="inline-flex items-center cursor-pointer text-sm ml-2">
                      <input
                        type="checkbox"
                        v-model="reservation.isComplementary"
                        class="form-checkbox"
                        :disabled="true"
                      />
                      <span class="ml-2">{{ $t('Contract') }}</span>
                    </label>
                  </div>

                  <div class="space-x-2">
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" :disabled="true" />
                      <span class="ml-2">{{ $t('BookAllAvailableRooms') }}</span>
                    </label>
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        class="form-checkbox"
                        v-model="quickGroupBooking"
                        @change="onQuickGroupBookingChange"

                      />
                      <span class="ml-2">{{ $t('QuickGroupBooking') }}</span>
                    </label>
                    <!-- <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" v-model="reservation.isComplementary" />
                      <span class="ml-2">{{ $t('ComplimentaryRoom') }}</span>
                    </label> -->
                  </div>
                </div>

                <!-- Room Configurations -->
                <div class="space-y-4">
                  <div
                    v-for="(room, index) in roomConfigurations"
                    :key="room.id"
                    class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                    :class="{ 'border-l-4 border-l-orange-500': index === 0 }"
                  >
                    <!-- Room Header -->
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <span
                          class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-800 text-xs font-medium"
                        >
                          {{ index + 1 }}
                        </span>
                        <h3 class="text-sm font-medium text-gray-800">
                          {{ $t('Room') }} {{ index + 1 }}
                        </h3>
                      </div>

                      <div class="">
                        <button
                          v-if="index === 0 && roomConfigurations.length > 1"
                          @click="copyFirstRoomRate"
                          type="button"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          :title="$t('CopyRate')"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-copy"
                          >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </button>

                        <button
                          v-if="index !== 0 && roomConfigurations.length > 1"
                          @click="removeRoom(room.id)"
                          type="button"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          :title="$t('RemoveRoom')"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <!-- Room Configuration Fields -->
                    <div class="flex flex-wrap items-end gap-4">
                      <div class="flex-1">
                        <p v-if="isRoomTypeInvalid(room)" class="text-sm text-red-600 mb-1">
                          {{ $t('validation.invalidRoomType') }}
                        </p>
                        <AutoCompleteSelect
                          v-model="room.roomType"
                          :options="RoomTypes"
                          :defaultValue="$t('SelectRoomType')"
                          :lb="$t('roomType')"
                          :is-required="false"
                          :use-dropdown="useDropdownRoomType"
                          :disabled="isLoadingRoom"
                          :isLoading="isLoadingRoom"
                          @update:modelValue="onRoomTypeChangeWithValidation(room.id, $event)"
                          @clear-error="emit('clear-error')"
                          :class="{ 'border-red-500': isRoomTypeInvalid(room) }"
                        />
                      </div>

                      <div class="flex-1">
                        <p v-if="isRateTypeInvalid(room)" class="text-sm text-red-600 mb-1">
                          {{ $t('validation.invalidRateType') }}
                        </p>
                        <AutoCompleteSelect
                          v-model="room.rateType"
                          :options="getRateTypesForRoom(room.id)"
                          :defaultValue="$t('SelectRateType')"
                          :lb="$t('configuration.rates.rateType')"
                          :is-required="false"
                          :use-dropdown="useDropdownRateType"
                          :disabled="!room.roomType"
                          @update:modelValue="onRateTypeChange(room.id, $event)"
                          @clear-error="emit('clear-error')"
                          :class="{ 'border-red-500': isRateTypeInvalid(room) }"
                        />
                      </div>

                      <div class="flex-1">
                        <p v-if="isRoomNumberInvalid(room)" class="text-sm text-red-600 mb-1">
                          {{ $t('invalidRoomNumber') }}
                        </p>
                        <AutoCompleteSelect
                          v-model="room.roomNumber"
                          :options="getRoomsForRoom(room.id)"
                          :defaultValue="$t('SelectRoom')"
                          :lb="$t('Room')"
                          :is-required="false"
                          :use-dropdown="useDropdownRoom"
                          :disabled="!room.roomType"
                          :isLoading="room.isLoadingRooms"
                          @update:modelValue="onRoomNumberChange(room)"
                          @clear-error="emit('clear-error')"
                          :class="{ 'border-red-500': isRoomNumberInvalid(room) }"
                        />
                      </div>

                      <!-- Adult Count avec gestion des changements -->
                      <div class="w-20">
                        <Select
                          :lb="$t('Adult')"
                          v-model="room.adultCount"
                          :options="getAdultOptions(room.roomType)"
                          :disabled="!room.roomType"
                          placeholder="1"
                          @change="onOccupancyChange(room.id, 'adultCount', $event)"
                        />
                      </div>

                      <!-- Child Count avec gestion des changements -->
                      <div class="w-20">
                        <Select
                          :lb="$t('Children')"
                          v-model="room.childCount"
                          :options="getChildOptions(room.roomType)"
                          :disabled="!room.roomType"
                          placeholder="0"
                          @change="onOccupancyChange(room.id, 'childCount', $event)"
                        />
                      </div>

                      <!-- Rate Display avec détails -->
                      <div class="flex-1">
                        <label
                          class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          {{ $t('rate') }} (XAF)
                        </label>
                        <div
                          v-if="!isCustomPrize"
                          class="flex items-center rounded-lg border border-black/50 bg-gray-100 dark:bg-black px-4 py-2.5 text-sm"
                          :class="{ 'opacity-50': room.isLoadingRate }"
                        >
                          <span
                            type="button"
                            class="text-gray-500 hover:text-gray-700 mr-3"
                            @click="isCustomPrize = true"
                          >
                            <PencilLine :size="18" />
                          </span>

                          <!-- Indicateur de chargement du rate -->
                          <div
                            v-if="room.isLoadingRate"
                            class="flex-grow flex justify-end items-end"
                          >
                            <div
                              class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"
                            ></div>
                          </div>

                          <!-- Rate avec breakdown -->
                          <div v-else class="flex-grow">
                            <div class="font-medium text-gray-800 justify-end flex">
                              {{ room.rate }}
                            </div>
                          </div>

                          <!--<button @click="toggleDropdown(room.id)" type="button"
                            class="text-gray-500 hover:text-gray-700 ml-2" :disabled="isLoadingRate">
                            <CircleChevronDown :class="{
                              'transform rotate-180 transition-transform': room.isOpen,
                              'transition-transform': !room.isOpen,
                            }" :size="20" />
                          </button>-->

                          <div
                            v-if="room.isOpen"
                            class="absolute left-0 top-full mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:bg-gray-900 z-20 max-h-48 overflow-auto"
                          >
                            <ul>
                              <li
                                v-for="option in dropdownOptions"
                                :key="option.value"
                                class="flex items-center gap-3 px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer"
                                @click="selectOption(option, room.id)"
                              >
                                <component :is="option.icon" class="text-purple-600" :size="18" />
                                <div class="flex flex-col">
                                  <span class="font-medium text-gray-500 dark:text-gray-200">{{
                                    option.label
                                  }}</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div v-else>
                          <input
                            type="number"
                            v-model.number="room.rate"

                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->

                <div class="flex flex-wrap items-end gap-4">
                  <div class="flex-1">
                    <button
                      @click="addRoom"
                      type="button"
                      class="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 rounded-md text-sm font-normal hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {{ $t('AddRoom') }}
                    </button>
                  </div>
                </div>
              </section>
              <section class="border-t border-gray-300 pt-4 space-y-4" v-if="reservation.isHold">
                <!-- Hold Release Date & Time Section -->
                <div class="">
                  <h2 class="text-sm font-semibold text-gray-800 uppercase mb-5">
                    {{ $t('hold_release_date_time') }}
                  </h2>

                  <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                    <!-- Date Input -->
                    <div class="col-span-2">
                      <InputDatePicker
                        :title="$t('date')"
                        v-model="holdReleaseData.date"
                        :placeholder="$t('select_date')"

                      />
                    </div>

                    <!-- Time Input -->
                    <div class="col-span-2">
                      <InputTimePicker
                        :title="$t('time')"
                        v-model="holdReleaseData.time"
                        :placeholder="$t('select_time')"
                        custom-class="rounded-lg"

                      />
                    </div>

                    <!-- Release Term -->
                    <div class="col-span-2">
                      <div class="flex">
                        <Input
                          :lb="$t('release_term')"
                          v-model="holdReleaseData.releaseTerm"
                          :placeholder="$t('value')"
                          class="flex-1 rounded-r-none"

                        />
                      </div>
                    </div>

                    <!-- Remind Guest Before -->
                    <div class="col-span-6">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">{{
                        $t('remind_guest_before')
                      }}</label>
                      <div class="flex items-center space-x-2">
                        <Input
                          :inputType="'number'"
                          v-model="holdReleaseData.remindDays"
                          :placeholder="'0'"
                          class="w-22"

                        />
                        <span class="text-sm text-gray-600">{{ $t('days') }}</span>

                        <!-- Radio buttons -->
                        <div class="flex items-center space-x-4 ml-4">
                          <label class="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="radio"
                              v-model="holdReleaseData.dateType"
                              value="hold_release_date"
                              class="form-radio text-blue-600"

                            />
                            <span class="text-sm text-gray-700">{{ $t('hold_release_date') }}</span>
                          </label>
                          <label class="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="radio"
                              v-model="holdReleaseData.dateType"
                              value="arrival_date"
                              class="form-radio text-blue-600"
                            />
                            <span class="text-sm text-gray-700">{{ $t('arrival_date') }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <!-- Guest Information -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <h2 class="text-sm font-semibold text-gray-800 dark:text-white uppercase">
                  {{ $t('guest_info') }}
                </h2>
                <div>
                  <CustomerCard @customerSelected="onCustomerSelected" v-model="formData" :key="formDataKey"/>
                </div>
              </section>

              <!-- Other Information -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <h2 class="text-sm font-semibold text-gray-800 dark:text-white uppercase">
                  {{ $t('other_info') }}
                </h2>

                <div class="space-y-3">
                  <div>
                    <label class="inline-flex items-center space-x-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        v-model="otherInfo.emailBookingVouchers"
                        class="form-checkbox"
                      />
                      <span>{{ $t('otherInfo.emailBookingVouchers') }}</span>
                    </label>

                    <div v-if="otherInfo.emailBookingVouchers" class="flex space-x-2 pl-6">
                      <div class="w-[900px]">
                        <InputEmail
                          placeholder="info@gmail.com"
                          v-model="otherInfo.voucherEmail"
                          @blur="validateVoucherEmail"
                        />
                        <p v-if="voucherEmailError" class="text-sm text-red-600 mt-1">
                          {{ voucherEmailError }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </form>

          <!-- Form actions -->
          <div
            class="flex flex-col sm:flex-row justify-end items-center border-t border-gray-300 px-6 py-4 gap-4"
          >
            <BasicButton
              v-if="!showCheckinButton && !pendingReservation && !isCheckedIn && !confirmReservation"
              type="button"
              @click="goBack"
              :disabled="isLoading"
              :label="$t('Cancel')"
            >
            </BasicButton>

             <BasicButton
                v-if="confirmReservation"
                type="button"
                @click="handleNewBooking"
                :disabled="isLoading"
                :label="$t('NewBooking')"
                variant="primary-bouton"
              >
              </BasicButton>

              <BasicButton
                v-if="confirmReservation"
                type="button"
                @click="handleViewDetails"
                :disabled="isLoading"
                :label="$t('viewDetails')"
              >
              </BasicButton>

            <div class="flex space-x-3">
              <BasicButton
                v-if="showCheckinButton && !pendingReservation"
                type="button"
                @click="handleCheckIn"
                :loading="isLoading"
                :disabled="isLoading"
                variant="info"
                :label="isGroupReservation ? $t('Check-In') : $t('Quick Check-In')"
              >
              </BasicButton>
              <BasicButton
                v-if="!confirmReservation"
                variant="info"
                :loading="isLoading"
                type="submit"
                @click="handleSubmit()"
                :disabled="isLoading || hasPendingUploads"
                :label="hasPendingUploads ? $t('UploadingImages') : $t('Reserve')"
              >
              </BasicButton>
              <button
                v-if="pendingReservation && reservationId"
                type="button"
                @click="handleConfirmReservation"
                :disabled="isConfirmingReservation"
                class="bg-green-500 text-white text-sm py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  v-if="isConfirmingReservation"
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{{
                  isConfirmingReservation ? $t('Processing...') : $t('ConfirmBooking')
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Billing Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5 h-fit lg:col-span-1 lg:sticky">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-semibold text-lg text-gray-800 dark:text-white">
            {{ $t('BillingSummary') }}
          </h2>
          <span
            v-if="pendingReservation"
            class="bg-yellow-500 text-white text-sm py-2 px-4 rounded hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {{ $t('Unconfirmed Booking Inquiry') }}
          </span>
          <span
            v-else-if="confirmReservation"
            class="bg-green-600 text-white text-sm py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {{ $t('ConfirmBooking') }}
          </span>
        </div>

        <div
          class="flex justify-between text-sm text-gray-600 dark:text-white mb-4 border-b border-gray-300 pb-3"
        >
          <div class="flex flex-col">
            <span>{{ $t('CheckIn') }}</span>
            <span class="font-medium">{{ reservation.checkinDate }}</span>
          </div>
          <div class="text-xl text-gray-400">→</div>
          <div class="flex flex-col text-right">
            <span>{{ $t('CheckOut') }}</span>
            <span class="font-medium">{{ reservation.checkoutDate }}</span>
          </div>
        </div>

        <!-- Room Summary avec détails des extras -->
        <div class="space-y-3 mb-6 overflow-y-auto sidebar-scroll">
          <div class="text-sm font-medium text-gray-700 border-b dark:text-white pb-2">
            {{ $t('Rooms') }} ({{ roomConfigurations.length }})
          </div>

          <div
            v-for="(room, index) in roomConfigurations"
            :key="room.id"
            class="border-l-2 border-orange-200 pl-3 mb-4"
          >
            <!-- En-tête de la chambre -->
            <div class="flex justify-between items-start text-sm">
              <div class="flex-1">
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ $t('Room') }} {{ index + 1 }}
                  <span v-if="room.roomNumber" class="text-gray-600 ml-1">
                    ({{ getRoomsForRoom(room.id).find((r) => r.value == room.roomNumber)?.label }})
                  </span>
                </div>

                <!-- Type de chambre et tarif -->
                <div class="text-xs text-gray-600 dark:text-white mt-1">
                  {{ RoomTypes.find((rt) => rt.value == room.roomType)?.label || t('N/A') }}
                  <span v-if="getRateTypesForRoom(room.id).find((rt) => rt.value == room.rateType)">
                    -
                    {{
                      getRateTypesForRoom(room.id).find((rt) => rt.value == room.rateType)?.label
                    }}
                  </span>
                </div>
              </div>

              <!-- Prix total de la chambre -->
              <div class="text-right">
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ formatCurrency((room.rate || 0) * numberOfNights) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-white/80">
                  {{ formatCurrency(room.rate || 0) }} / {{ $t('night') }}
                </div>
              </div>
            </div>

            <!-- Détails des occupants et extras -->
            <div
              v-if="getRoomExtraInfo(room.id)"
              class="mt-2 text-xs text-gray-600 dark:text-white"
            >
              <div class="flex items-center justify-between">
                <!-- Informations sur les occupants -->
                <div class="flex items-center space-x-4">
                  <span>
                    <i class="fas fa-user text-blue-500 dark:text-white"></i>
                    {{ room.adultCount }} {{ room.adultCount > 1 ? $t('Adults') : $t('Adult') }}
                  </span>
                  <span v-if="room.childCount > 0">
                    <i class="fas fa-child text-green-500 dark:text-white"></i>
                    {{ room.childCount }} {{ room.childCount > 1 ? $t('Children') : $t('Child') }}
                  </span>
                </div>

                <!-- Affichage des extras si il y en a -->
                <div v-if="getRoomExtraInfo(room.id)?.totalExtraCost > 0" class="text-right">
                  <div class="text-orange-600 font-medium">
                    +{{ formatCurrency(getRoomExtraInfo(room.id)?.totalExtraCost || 0) }}
                    {{ $t('extras') }}
                  </div>
                </div>
              </div>

              <!-- Détails des extras (affiché seulement s'il y en a) -->
              <div
                v-if="getRoomExtraInfo(room.id)?.totalExtraCost > 0"
                class="mt-1 pl-2 border-l border-orange-200 space-y-1"
              >
                <div v-if="getRoomExtraInfo(room.id)?.extraAdults > 0" class="flex justify-between">
                  <span>
                    {{ getRoomExtraInfo(room.id)?.extraAdults }} {{ $t('Extra Adults') }} ({{
                      formatCurrency(getRoomExtraInfo(room.id)?.extraAdultRate || 0)
                    }}
                    {{ $t('each') }})
                  </span>
                  <span>{{ formatCurrency(getRoomExtraInfo(room.id)?.extraAdultCost || 0) }}</span>
                </div>
                <div
                  v-if="getRoomExtraInfo(room.id)?.extraChildren > 0"
                  class="flex justify-between"
                >
                  <span>
                    {{ getRoomExtraInfo(room.id)?.extraChildren }} {{ $t('Extra Children') }} ({{
                      formatCurrency(getRoomExtraInfo(room.id)?.extraChildRate || 0)
                    }}
                    {{ $t('each') }})
                  </span>
                  <span>{{ formatCurrency(getRoomExtraInfo(room.id)?.extraChildCost || 0) }}</span>
                </div>
              </div>
            </div>
            <!-- taxes-->
            <div v-if="room.taxes && room.taxes.length > 0" class="flex flex-col mt-3">
              <div
                class="flex items-center justify-between mb-2 cursor-pointer"
                @click="toggleTaxDetails(room.id)"
              >
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-white">{{
                    $t('detailsOfTaxes')
                  }}</span>
                  <svg
                    class="w-4 h-4 ml-2 transform transition-transform duration-200"
                    :class="{ 'rotate-180': showTaxDetails[room.id] }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {{ $t('Included') }}
                </span>
              </div>

              <div v-show="showTaxDetails[room.id]" class="transition-all duration-200">
                <div
                  v-for="tax in room.taxes"
                  :key="tax.id"
                  class="flex justify-between font-medium text-gray-800 text-sm mb-1"
                >
                  <span class="font-medium text-gray-500"
                    >{{ tax.name }}({{
                      tax.postingType == 'flat_amount'
                        ? formatCurrency(parseFloat(tax.amount))
                        : `${tax.percentage}%`
                    }})</span
                  >
                  <span class="text-gray-500">{{ formatCurrency(tax.taxAmount) }}</span>
                </div>
              </div>
            </div>
            <!--etra charges-->
            <div
              v-if="room.extraCharges && room.extraCharges.length > 0"
              class="flex flex-col mt-3"
            >
              <div
                class="flex items-center justify-between mb-2 cursor-pointer"
                @click="toggleExtraChargesDetails(room.id)"
              >
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-700">{{
                    $t('detailsOfExtraCharges')
                  }}</span>
                  <svg
                    class="w-4 h-4 ml-2 transform transition-transform duration-200"
                    :class="{ 'rotate-180': showChargesDetails[room.id] }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="[
                    isExtraChargesIncluded
                      ? 'text-green-700 bg-green-100'
                      : 'text-blue-700 bg-blue-100',
                  ]"
                >
                  {{ isExtraChargesIncluded ? $t('Included') : $t('ExtraServices') }}
                </span>
              </div>

              <div v-show="showChargesDetails[room.id]" class="transition-all duration-200">
                <div
                  v-for="charge in room.extraCharges"
                  :key="charge.id"
                  class="flex justify-between items-center font-medium text-gray-800 text-sm mb-2 p-1 bg-gray-50 rounded"
                >
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-700"
                      >{{ Math.max(1, Number(room.adultCount) + Number(room.childCount)) }} *
                      {{ charge.name }}</span
                    >
                  </div>
                  <span class="text-gray-700 font-semibold">{{
                    formatCurrency(
                      parseFloat(charge.rate) *
                        Math.max(1, Number(room.adultCount) + Number(room.childCount)),
                    )
                  }}</span>
                </div>

                <!-- Total des extra charges si plus d'un élément -->
                <div
                  v-if="room.extraCharges.length > 1"
                  class="flex justify-between items-center font-bold text-gray-900 text-sm mt-2 pt-2 border-t border-gray-300"
                >
                  <span>{{ $t('TotalExtraCharges') }}</span>
                  <span>
                    {{
                      formatCurrency(
                        room.extraCharges.reduce(
                          (sum, charge) =>
                            sum +
                            parseFloat(charge.rate) *
                              Math.max(1, Number(room.adultCount) + Number(room.childCount)),
                          0,
                        ),
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Totaux -->
          <div class="border-t pt-3 space-y-2">
            <div class="flex justify-between text-gray-700">
              <span
                >{{ $t('RoomCharges') }} ({{ numberOfNights }}
                {{ numberOfNights > 1 ? $t('nights') : $t('night') }})</span
              >
              <span>{{ formatCurrency(totalRoomCharges) }}</span>
            </div>

            <div
              class="flex justify-between font-semibold text-gray-900 border-t border-gray-300 dark:text-white pt-3 text-lg"
            >
              <span>{{ $t('DueAmount') }}</span>
              <span>{{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>
        </div>

        <div>
          <Select :lb="$t('BillTo')" :options="billToOptions" v-model="billing.billTo" />
        </div>

        <h3 class="mt-5 mb-2 text-sm font-semibold text-gray-700">{{ $t('PaymentMode') }}</h3>
        <!-- payment -->
        <div class="grid grid-cols-1 gap-2 mt-5">
          <!-- Payment Information -->
          <div class="space-y-4">
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="billing.paymentType" value="cash" class="mr-2" />
                {{ $t('cash') }}
              </label>
              <label class="flex items-center" v-if="canCityLedgerPay">
                <input
                  type="radio"
                  v-model="billing.paymentType"
                  value="city_ledger"
                  class="mr-2"
                />
                {{ $t('city_ledger') }}
              </label>
            </div>
          </div>

          <div class="space-y-4 w-full">
            <InputPaymentMethodSelect
              :paymentType="billing.paymentType"
              v-model="billing.paymentMode"
              :hide-label="true"
            />
          </div>
        </div>

        <div v-if="isPaymentButtonShow" class="mt-4">
          <button
            type="button"
            class="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
            @click="openAddPaymentModal"
          >
            {{ $t('AddPayment') }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
  <!-- Add Payment Modal -->
  <template v-if="isAddPaymentModalOpen && reservationId">
    <AddPaymentModal
      :reservation-id="reservationId"
      :is-open="isAddPaymentModalOpen"
      @close="closeAddPaymentModal"
      :reservation-data="reservationDetails"
      @save="handleSavePayment"
    />
  </template>

  <!--check in template-->
  <template v-if="isCkeckInModalOpen && reservationId">
    <CheckInReservation
      :reservation-id="reservationId"
      :is-open="isCkeckInModalOpen"
      @check-in-complete="handleCheckInGroupComplete"
      @close="closeCheckInReservationModal"

    />
  </template>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, defineAsyncComponent, nextTick, watch } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputTimePicker from '@/components/forms/FormElements/InputTimePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/forms/FormElements/Select.vue'
import {
  PencilLine,
  CarFront,
  ClipboardCheck,
  ClipboardList,
} from 'lucide-vue-next'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CustomerCard from '@/components/customers/CustomerCard.vue'
import { useBooking, setReservationCreator, setAllowPastDates } from '@/composables/useBooking2'
import { insertReservation, createReservation } from '@/services/reservation'
const AddPaymentModal = defineAsyncComponent(
  () => import('../../components/reservations/foglio/AddPaymentModal.vue'),
)
import router from '../../router'
import { useRoute } from 'vue-router'
import BasicButton from '../../components/buttons/BasicButton.vue'
import InputPaymentMethodSelect from '../../components/reservations/foglio/InputPaymentMethodSelect.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import { useReservation } from '@/composables/useReservation'
import { getReservationDetailsById, confirmBooking } from '../../services/reservation'
import { useToast } from 'vue-toastification'
const CheckInReservation = defineAsyncComponent(
  () => import('@/components/reservations/CheckInReservation.vue'),
)
import { useBookingStorage } from '@/composables/useBookingStorage'

interface ReservationDetails {
  payment_method: any
  payment_type: any
}

// Props to control BookingForm behavior
const props = defineProps<{ allowPastDates?: boolean; useInsertReservation?: boolean; formTitleKey?: string; breadcrumbKey?: string }>()
const allowPastDates = computed(() => props.allowPastDates === true)
const useInsertReservation = computed(() => props.useInsertReservation === true)
const formTitleKey = computed(() => props.formTitleKey ?? 'AddBooking')
const breadcrumbKey = computed(() => props.breadcrumbKey ?? 'Booking')

const route = useRoute()
const isCkeckInModalOpen = ref(false)
const reservationDetails = ref<{ payment_method?: number; payment_type?: string }>({})
const { performCheckIn } = useReservation()
const { loadBooking, clearBooking } = useBookingStorage()
const isAddPaymentModalOpen = ref(false)
const isConfirmingReservation = ref(false)

const performChecking = () => {}
const toast = useToast()
const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
}

const showTaxDetails = ref<Record<string, boolean>>({})
const showChargesDetails = ref<Record<string, boolean>>({})

const toggleTaxDetails = (roomId: string) => {
  showTaxDetails.value[roomId] = !showTaxDetails.value[roomId]
}

const toggleExtraChargesDetails = (roomId: string) => {
  showChargesDetails.value[roomId] = !showChargesDetails.value[roomId]
}
const handleSavePayment = (payment: any) => {
  router.push({
    name: 'ReservationDetails',
    params: { id: reservationId.value },
  })
}

const openAddPaymentModal = async () => {
  try {
    if (!reservationDetails.value && reservationId.value) {
      const reponse = await getReservationDetailsById(reservationId.value)
      reservationDetails.value = {
        payment_method: reponse.paymentMode,
        payment_type: reponse.value.paymentType,
      }
    }

    isAddPaymentModalOpen.value = true
  } catch (error) {
    console.error('Error loading reservation details:', error)
    isAddPaymentModalOpen.value = true
  }
}

const openCheckInReservationModal = () => {
  isCkeckInModalOpen.value = true
}

const closeCheckInReservationModal = () => {
  isCkeckInModalOpen.value = false
}

const handleCheckInComplete = () => {
  isCheckedIn.value = true
}
const { t } = useI18n()
const useDropdownRoomType = ref(true)
const useDropdownRateType = ref(true)
const useDropdownRoom = ref(true)
const useDropdownBooking = ref(true)
const submitted = ref(false)

const isRoomTypeInvalid = (room: any) => {
  if (!submitted.value) return false
  if (!room.roomType) return true // Required
  return !RoomTypes.value.some((option) => option.value === room.roomType) // Must be in list
}

const isRateTypeInvalid = (room: any) => {
  if (!submitted.value) return false
  if (!room.rateType) return true // Required
  return !getRateTypesForRoom(room.id).some((option) => option.value === room.rateType) // Must be in list
}

const isRoomNumberInvalid = (room: any) => {
  if (!submitted.value) return false
  // if (room.roomType && !room.roomNumber) return true; // Required if roomType is selected
  if (!room.roomNumber) return false
  return !getRoomsForRoom(room.id).some(
    (option) => option.value.toString() === room.roomNumber.toString(),
  )
}

interface Emits {
  (e: 'clear-error'): void
}

const emit = defineEmits<Emits>()

const {
  // Data
  reservation,
  guest,
  otherInfo,
  billing,
  formData,
  roomConfigurations,
  RoomTypes,
  CustomTypes,

  // States
  isLoading,
  isLoadingRoom,
  dateError,
  isPaymentButtonShow,
  confirmReservation,
  pendingReservation,
  isCustomPrize,
  isCheckedIn,
  voucherEmailError,
  resetForm,
  validateVoucherEmail,
  quickGroupBooking,

  // Computed
  numberOfNights,
  totalRoomCharges,
  totalAmount,
  showCheckinButton,

  // Options
  BookingSource,
  BusinessSource,
  BookingType,
  creditTypes,
  billToOptions,
  reservationId,
  TransportationModes,
  // Methods
  initialize,
  saveReservation,
  formatCurrency,
  goBack,

  // Room methods
  addRoom,
  removeRoom,
  onRoomTypeChange,
  getRateTypesForRoom,
  getRoomsForRoom,
  onRateTypeChange,

  // Customer methods
  onCustomerSelected,
  onOccupancyChange,
  getRoomExtraInfo,
  onRoomNumberChange,
  pendingUploads,
  holdReleaseData,
  canCityLedgerPay,
  isExtraChargesIncluded,
  loadDraftData,
  loadDraftAsyncData,
  getChildOptions,
  getAdultOptions,
  formDataKey,
  onRoomTypeChangeWithValidation,
  validateRoomTypeAvailability
} = useBooking()

// Computed pour vérifier s'il y a des uploads en cours
const hasPendingUploads = computed(() => {
  return pendingUploads.value.size > 0
})
const isGroupReservation = computed(() => {
  return roomConfigurations.value.length > 1
})

const copyFirstRoomRate = () => {
  if (roomConfigurations.value.length > 0) {
    const firstRoomRate = roomConfigurations.value[0].rate

    for (let i = 1; i < roomConfigurations.value.length; i++) {
      roomConfigurations.value[i].rate = firstRoomRate
    }
  }
}

const handleCheckIn = async () => {
  try {
    if (isGroupReservation.value) {
      // Pour les réservations de groupe, ouvrir la modal
      openCheckInReservationModal()

    } else {
      isLoading.value = true

      let currentReservationRooms = []

      try {
        const reservationDetails = await getReservationDetailsById(reservationId.value!)
        currentReservationRooms = reservationDetails.reservationRooms || []
      } catch (error) {
        console.error('Error fetching reservation details:', error)
        return
      }

      // Trouver une reservationRoom disponible
      const availableReservationRoom: any = currentReservationRooms.find((resRoom: any) => {
        return (
          !resRoom.actualCheckInTime &&
          !resRoom.checkedIn &&
          resRoom.status !== 'checked_in' &&
          resRoom.status !== 'occupied'
        )
      })

      if (!availableReservationRoom) {
        console.error(t('bookings.errors.noAvailableRoomsForCheckin'))
        return
      }

      const checkInDateTime = new Date().toISOString()
      const payload = {
        reservationRooms: [availableReservationRoom.id],
        actualCheckInTime: checkInDateTime,
        notes: '',
        keyCardsIssued: 2,
        depositAmount: 0,
      }

      console.log('Quick check-in payload:', payload)
      console.log('ReservationRoom being checked in:', availableReservationRoom)
      const result = await performCheckIn(reservationId.value!, payload)

       if (result) {
        handleCheckInComplete()
        clearBooking()
        await router.push({
          name: 'ReservationDetails',
          params: { id: reservationId.value },
          query: { tab: 'folio_operations' }
        })
      }
    }
  } catch (error) {
    console.error('Error during check-in:', error)
  } finally {
    isLoading.value = false
  }
}


const handleCheckInGroupComplete = async () => {
  handleCheckInComplete()
  clearBooking()
  closeCheckInReservationModal()
  await router.push({
    name: 'ReservationDetails',
    params: { id: reservationId.value },
    query: { tab: 'folio_operations' }
  })
}

// Ajoutez
const handleConfirmReservation = async () => {
  if (!reservationId.value) {
    toast.error(t('No reservation to confirm'))
    return
  }

  try {
    isConfirmingReservation.value = true

    const data = {
      status: 'confirmed',
    }

    const res = await confirmBooking(reservationId.value, data)
    console.log('Confirmation response:', res)

    if (res.status === 200 || res.data) {
      // Mettre à jour l'état de la réservation
      pendingReservation.value = false
      confirmReservation.value = true

      toast.success(t('bookings.success.reservationConfirmed'))

    }
  } catch (error: any) {
    console.error('Error confirming reservation:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      t('bookings.errors.confirmReservationFailed')
    toast.error(errorMessage)
  } finally {
    isConfirmingReservation.value = false
  }
}
const initializeForm = () => {
  // Call the original initialize from useBooking if it sets default values
  initialize()

  // Check for query parameters and update reservation object
  if (route.query.checkin) {
    reservation.value.checkinDate = route.query.checkin as string
  }
  if (route.query.checkout) {
    reservation.value.checkoutDate = route.query.checkout as string
  }
  if (route.query.checkInTime) {
    reservation.value.checkinTime = route.query.checkInTime as string
  }
  if (route.query.checkOutTime) {
    reservation.value.checkoutTime = route.query.checkOutTime as string
  }
}

// Dropdown options pour les actions de chambre
const dropdownOptions = computed(() => [
  { value: 'inclusion', label: t('inclusion'), icon: ClipboardList },
  { value: 'remarks', label: t('remarks'), icon: PencilLine },
  { value: 'create_task', label: t('create_task'), icon: ClipboardCheck },
  { value: 'pickup_dropoff', label: t('pickup_dropoff'), icon: CarFront },
])

// Select option for dropdown actions
const selectOption = (option: any, roomId: string) => {
  const room = roomConfigurations.value.find((r) => r.id === roomId)
  if (room) {
    room.isOpen = false
  }

  console.log('Option selected:', option, 'for room:', roomId)
}

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  submitted.value = true
  try {
     const validation = validateRoomTypeAvailability()

  if (!validation.isValid) {
    validation.errors.forEach(error => toast.error(error))
    return
  }
    await saveReservation()
  } catch (error) {
    console.error('Error submitting reservation:', error)
  }
}



// const quickGroupBooking = ref(false)

// Méthode pour gérer le changement de Quick Group Booking
const onQuickGroupBookingChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    // Mettre le nombre de chambres à 2
    reservation.value.rooms = 2

    // S'assurer qu'on a exactement 2 chambres dans la configuration
    while (roomConfigurations.value.length < 2) {
      addRoom()
    }
    while (roomConfigurations.value.length > 2) {
      removeRoom(roomConfigurations.value[roomConfigurations.value.length - 1].id)
    }
  } else {
    reservation.value.rooms = 1

    while (roomConfigurations.value.length < 1) {
      addRoom()
    }
    while (roomConfigurations.value.length > 1) {
      removeRoom(roomConfigurations.value[roomConfigurations.value.length - 1].id)
    }
  }
}

// Fonction
const loadDraft = async () => {
  const draft = loadBooking()
  console.log('Loading draft from:', draft)

  if (!draft) {
    console.log('No draft found')
    return false
  }

  try {
    const loaded = loadDraftData(draft)

    if (!loaded) {
      console.error('Failed to load draft data')
      return false
    }

    await loadDraftAsyncData()

    console.log('Draft loaded successfully!')
    return true
  } catch (error) {
    console.error('Error loading draft:', error)
    return false
  }
}

const handleNewBooking = () => {
  clearBooking()
  resetForm()
  isCheckedIn.value = false
  confirmReservation.value = false
  pendingReservation.value = false
  reservationId.value = null

  // Réinitialiser le formulaire avec les valeurs par défaut
  initializeForm()

}

const handleViewDetails = () => {
  if (reservationId.value) {
    router.push({
      name: 'ReservationDetails',
      params: { id: reservationId.value },
    })
  }
}
onMounted(async () => {
  // Switch reservation creator if requested
  if (useInsertReservation.value) {
    setReservationCreator(insertReservation)
  }
  if (allowPastDates.value) {
    setAllowPastDates(true)
  }
  const draftLoaded = await loadDraft()

  if (!draftLoaded) {
    initializeForm()
  } else {
    await nextTick()
    console.log('Draft loaded and components updated')
  }
})

onUnmounted(() => {
  if (useInsertReservation.value) {
    setReservationCreator(createReservation)
  }
  setAllowPastDates(false)
})
initialize()

// Ensure checkout date is never before check-in date
watch(
  () => reservation.value.checkinDate,
  (newCheckin) => {
    const ci = newCheckin ? new Date(newCheckin) : null
    const co = reservation.value.checkoutDate
      ? new Date(reservation.value.checkoutDate)
      : null
    if (ci && co && co < ci) {
      reservation.value.checkoutDate = newCheckin
    }
  }
)

</script>

<style scoped>
.sidebar-scroll {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>
