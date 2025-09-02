<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('Booking')" />
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-5">
      <!-- Left Column: Add Reservation Form -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Header -->
        <div class="flex items-center border-b border-gray-200 px-5 py-4">
          <button @click="goBack" class="mr-4 p-2 hover:bg-gray-200 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold">{{ $t('AddBooking') }}</h1>
        </div>

        <!-- Form -->
        <div class="p-5">
          <form class="grid grid-cols-1 xl:grid-cols-1 gap-6 p-6">
            <!-- Left Side: Reservation Form -->
            <div class="space-y-6">
              <!-- Check-in/out dates and time -->
              <div class="md:flex relative items-start gap-2  ">
                <!-- Check-In -->
                <div class="flex flex-col w-full">
                  <label for="checkin" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('check_in') }}
                  </label>
                  <div class="flex gap-0">
                    <InputDatePicker v-model="reservation.checkinDate" class="rounded-r-none"
                      :placeholder="$t('Selectdate')" />
                    <InputTimePicker v-model="reservation.checkinTime" class="rounded-l-none" />
                  </div>
                </div>

                <!-- Nights -->
                <div class="flex flex-col w-full">
                  <Input :lb="$t('nights')" :disabled="true" :modelValue="numberOfNights.toString()" />
                </div>

                <!-- Check-Out -->
                <div class="flex flex-col w-full">
                  <label for="checkout" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('check_out') }}
                  </label>
                  <div class="flex gap-0">
                    <InputDatePicker v-model="reservation.checkoutDate" :placeholder="$t('Selectdate')"
                      class="rounded-r-none" />
                    <InputTimePicker v-model="reservation.checkoutTime" class="rounded-l-none" />
                  </div>
                  <p v-if="dateError" class="text-sm text-red-600">
                    {{ $t(dateError) }}
                  </p>
                </div>
              </div>

              <div class="grid md:grid-cols-4 grid-cols-1 gap-4">
                <div>
                  <Input :inputType="'number'" :lb="$t('Room')" :id="'room-qty'" forLabel="'room-qty'"
                    v-model.number="reservation.rooms" :min="1" :disabled="true" />
                </div>

                <div>
                  <Select :lb="$t('ReservationType')" v-model="reservation.bookingType" :options="BookingType" />
                </div>

                <!-- Booking Source -->
                <div>
                  <Select :lb="$t('booking_source')" v-model="reservation.bookingSource" :options="BookingSource" />
                </div>

                <div>
                  <Select :lb="$t('business_source')" v-model="reservation.businessSource" :options="BusinessSource" />
                </div>
              </div>

              <!-- Room Type -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <!-- Complementary -->
                <div class="md:flex relative justify-between mb-6">
                  <div>
                    <span class="font-normal">{{ $t('RateOffered') }} : </span>
                    <label class="inline-flex items-center cursor-pointer text-sm ml-2">
                      <input type="checkbox" v-model="reservation.isComplementary" class="form-checkbox" :disabled="true" />
                      <span class="ml-2">{{ $t('Contract') }}</span>
                    </label>
                  </div>

                  <div class="space-x-2">
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" :disabled="true" />
                      <span class="ml-2">{{ $t('BookAllAvailableRooms') }}</span>
                    </label>
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" />
                      <span class="ml-2">{{ $t('QuickGroupBooking') }}</span>
                    </label>
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox"  v-model="reservation.isComplementary"/>
                      <span class="ml-2">{{ $t('ComplimentaryRoom') }}</span>
                    </label>
                  </div>
                </div>

                <!-- Room Configurations -->
                <div class="space-y-4">
                  <div v-for="(room, index) in roomConfigurations" :key="room.id"
                    class="border border-gray-200 rounded-lg p-4 bg-white"
                    :class="{ 'border-l-4 border-l-orange-500': index === 0 }">
                    <!-- Room Header -->
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <span
                          class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                          {{ index + 1 }}
                        </span>
                        <h3 class="text-sm font-medium text-gray-800">
                          {{ $t('Room') }} {{ index + 1 }}
                        </h3>
                      </div>

                      <!-- Remove Button (only show if more than 1 room) -->
                      <button v-if="roomConfigurations.length > 1" @click="removeRoom(room.id)" type="button"
                        class="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        :title="$t('RemoveRoom')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <!-- Room Configuration Fields -->
                    <div class="grid md:grid-cols-6 grid-cols-1 gap-4 items-end">
                      <div class="relative">
                        <Select :lb="$t('roomType')" :options="RoomTypes" v-model="room.roomType"
                          @update:modelValue="onRoomTypeChange(room.id, $event)" :disabled="isLoadingRoom" />
                      </div>

                      <div class="relative">
                        <Select :lb="$t('configuration.rates.rateType')" :options="getRateTypesForRoom(room.id)"
                          v-model="room.rateType" @update:modelValue="onRateTypeChange(room.id, $event)"
                          :disabled="!room.roomType" />
                      </div>

                      <div class="relative">
                        <Select :lb="$t('Room')" :options="getRoomsForRoom(room.id)" v-model="room.roomNumber"
                          :disabled="!room.roomType" @update:modelValue="onRoomNumberChange(room)" />
                      </div>

                      <!-- Adult Count avec gestion des changements -->
                      <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          {{ $t('Adult') }}
                        </label>
                        <input type="number" :id="'adult-' + room.id" v-model.number="room.adultCount"
                          @input="onOccupancyChange(room.id, 'adultCount', room.adultCount)" :min="0"  :disabled="!room.roomType"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                      </div>

                      <!-- Child Count avec gestion des changements -->
                      <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          {{ $t('Children') }}
                        </label>
                        <input type="number" :id="'child-' + room.id" v-model.number="room.childCount"
                          @input="onOccupancyChange(room.id, 'childCount', room.childCount)" :min="0"  :disabled="!room.roomType"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                      </div>

                      <!-- Rate Display avec détails -->
                      <div class="relative inline-block">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          {{ $t('rate') }}
                        </label>
                        <div v-if="!isCustomPrize"
                          class="flex items-center border border-gray-300 rounded-lg bg-gray-100 px-4 py-2.5 text-sm"
                          :class="{ 'opacity-50': isLoadingRate }">
                          <span type="button" class="text-gray-500 hover:text-gray-700 mr-3"
                            @click="isCustomPrize = true">
                            <PencilLine :size="18" />
                          </span>

                          <!-- Indicateur de chargement du rate -->
                          <div v-if="isLoadingRate" class="flex-grow flex items-center">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>

                          </div>

                          <!-- Rate avec breakdown -->
                          <div v-else class="flex-grow">
                            <div class="font-medium text-gray-800">
                              {{ room.rate }}
                            </div>
                          </div>

                          <button @click="toggleDropdown(room.id)" type="button"
                            class="text-gray-500 hover:text-gray-700 ml-2" :disabled="isLoadingRate">
                            <CircleChevronDown :class="{
                              'transform rotate-180 transition-transform': room.isOpen,
                              'transition-transform': !room.isOpen,
                            }" :size="20" />
                          </button>

                          <div v-if="room.isOpen"
                            class="absolute left-0 top-full mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:bg-gray-900 z-20 max-h-48 overflow-auto">
                            <ul>
                              <li v-for="option in dropdownOptions" :key="option.value"
                                class="flex items-center gap-3 px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer"
                                @click="selectOption(option, room.id)">
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
                          <input type="number" v-model.number="room.rate"
                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-4">
                  <button @click="addRoom" type="button"
                    class="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 rounded-md text-sm font-normal hover:bg-orange-600 hover:text-white transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ $t('AddRoom') }}
                  </button>
                  <button type="button"
                    class="px-4 py-2 border border-gray-600 text-gray-600 rounded-md text-sm font-normal hover:bg-gray-600 hover:text-white transition">
                    {{ $t('add_discount') }}
                  </button>
                </div>
              </section>

              <!-- Guest Information -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <h2 class="text-sm font-semibold text-gray-800 uppercase">
                  {{ $t('guest_info') }}
                </h2>
                <div>
                  <CustomerCard @customerSelected="onCustomerSelected" v-model="formData" />
                </div>
                <!-- <div>
                  <Input :inputType="'text'" :lb="$t('Address')" :id="'address'" forLabel="'address'"
                    v-model="guest.address" />
                </div>
                <div class="grid md:grid-cols-4 grid-cols-1 gap-6">
                  <div>
                    <InputCountries :lb="'Country'" v-model="guest.country" />
                  </div>
                  <div>
                    <Input :inputType="'text'" :lb="$t('State')" :id="'State'" forLabel="'State'"
                      v-model="guest.state" />
                  </div>
                  <div>
                    <Input :inputType="'text'" :lb="$t('City')" :id="'city'" forLabel="'city'" v-model="guest.city" />
                  </div>
                  <div>
                    <Input :inputType="'text'" :lb="$t('Zipcode')" :id="'zipcode'" forLabel="'zipcode'"
                      v-model="guest.zipcode" />
                  </div>
                </div> -->

                <!-- <div class="pt-1">
                  <button type="button"
                    class="px-4 py-2 text-sm border border-orange-600 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition font-normal">
                    {{ $t('C_Form') }}
                  </button>
                </div>-->
              </section>

              <!-- Other Information -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <h2 class="text-sm font-semibold text-gray-800 uppercase">
                  {{ $t('other_info') }}
                </h2>

                <div class="space-y-3">
                  <div>
                    <label class="inline-flex items-center space-x-2 cursor-pointer text-sm">
                      <input type="checkbox" v-model="otherInfo.emailBookingVouchers" class="form-checkbox" />
                      <span>{{ $t('otherInfo.emailBookingVouchers') }}</span>
                    </label>

                    <div v-if="otherInfo.emailBookingVouchers" class="flex space-x-2 pl-6">
                      <div class="w-[900px]">
                        <InputEmail placeholder="info@gmail.com" v-model="otherInfo.voucherEmail" />
                      </div>
                     <div class="flex flex-col  h-full justify-center align-middle self-center mt-2 ">
                       <BasicButton :label="$t('otherInfo.previewVoucher')" variant="dark"></BasicButton>
                     </div>
                    </div>
                  </div>
 <!--
                  <div>
                    <label class="inline-flex items-center space-x-2 cursor-pointer text-sm">
                      <input type="checkbox" v-model="otherInfo.sendEmailAtCheckout" class="form-checkbox" />
                      <span>{{ $t('otherInfo.sendEmailAtCheckout') }}</span>
                    </label>

                    <div v-if="otherInfo.sendEmailAtCheckout" class="pl-6">
                      <Select :options="emailTemplates" v-model="otherInfo.emailTemplate" />
                    </div>
                  </div>

                  <div>
                    <label class="inline-flex items-center space-x-2 cursor-pointer text-sm">
                      <input type="checkbox" v-model="otherInfo.accessToGuestPortal" class="form-checkbox" />
                      <span>{{ $t('otherInfo.accessToGuestPortal') }}</span>
                    </label>
                  </div> -->

                  <!--  <div>
                    <label class="inline-flex items-center space-x-2 cursor-pointer text-sm">
                      <input type="checkbox" v-model="otherInfo.successRateOnRegistrationCard" class="form-checkbox" />
                      <span>{{ $t('otherInfo.successRateOnRegistrationCard') }}</span>
                    </label>
                  </div>-->
                </div>
              </section>
            </div>
          </form>

          <!-- Form actions -->
          <div class="flex flex-col sm:flex-row  justify-end items-center border-t border-gray-300 px-6 py-4 gap-4">
            <BasicButton type="button" @click.prevent="goBack" :disabled="isLoading" :label="$t('Cancel')">
            </BasicButton>

            <div class="flex space-x-3">
              <BasicButton v-if="showCheckinButton" type="button" @click.prevent="performChecking" :label="$t('Check-In')">
              </BasicButton>
              <BasicButton v-if="!confirmReservation"  variant="info" :loading="isLoading" type="submit" @click="handleSubmit()" :disabled="isLoading" :label="$t('Reserve')">
              </BasicButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Billing Summary -->
      <div class="bg-white rounded-lg shadow p-6 h-fit lg:col-span-1 lg:sticky  ">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-semibold text-lg text-gray-800">{{ $t('BillingSummary') }}</h2>
          <span v-if="confirmReservation"
            class="bg-green-600 text-white text-sm py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center">

            {{ $t('ConfirmBooking') }}
          </span>
        </div>

        <div class="flex justify-between text-sm text-gray-600 mb-4 border-b border-gray-300 pb-3">
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
          <div class="text-sm font-medium text-gray-700 border-b pb-2">
            {{ $t('Rooms') }} ({{ roomConfigurations.length }})
          </div>

          <div v-for="(room, index) in roomConfigurations" :key="room.id"
            class="border-l-2 border-orange-200 pl-3 mb-4">
            <!-- En-tête de la chambre -->
            <div class="flex justify-between items-start text-sm">
              <div class="flex-1">
                <div class="font-medium text-gray-800">
                  {{ $t('Room') }} {{ index + 1 }}
                  <span v-if="room.roomNumber" class="text-gray-600 ml-1">
                    ({{getRoomsForRoom(room.id).find((r) => r.value == room.roomNumber)?.label}})
                  </span>
                </div>

                <!-- Type de chambre et tarif -->
                <div class="text-xs text-gray-600 mt-1">
                  {{RoomTypes.find((rt) => rt.value == room.roomType)?.label || 'N/A'}}
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
                <div class="font-medium text-gray-800">
                  {{ formatCurrency((room.rate || 0) * numberOfNights) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatCurrency(room.rate || 0) }} / {{ $t('night') }}
                </div>
              </div>
            </div>

            <!-- Détails des occupants et extras -->
            <div v-if="getRoomExtraInfo(room.id)" class="mt-2 text-xs text-gray-600">
              <div class="flex items-center justify-between">
                <!-- Informations sur les occupants -->
                <div class="flex items-center space-x-4">
                  <span>
                    <i class="fas fa-user text-blue-500"></i>
                    {{ room.adultCount }} {{ $t('Adults') }}
                  </span>
                  <span v-if="room.childCount > 0">
                    <i class="fas fa-child text-green-500"></i>
                    {{ room.childCount }} {{ $t('Children') }}
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
              <div v-if="getRoomExtraInfo(room.id)?.totalExtraCost > 0"
                class="mt-1 pl-2 border-l border-orange-200 space-y-1">
                <div v-if="getRoomExtraInfo(room.id)?.extraAdults > 0" class="flex justify-between">
                  <span>
                    {{ getRoomExtraInfo(room.id)?.extraAdults }} {{ $t('Extra Adults') }} ({{
                      formatCurrency(getRoomExtraInfo(room.id)?.extraAdultRate || 0)
                    }}
                    {{ $t('each') }})
                  </span>
                  <span>{{ formatCurrency(getRoomExtraInfo(room.id)?.extraAdultCost || 0) }}</span>
                </div>
                <div v-if="getRoomExtraInfo(room.id)?.extraChildren > 0" class="flex justify-between">
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
              <div v-for="tax in room.taxes" :key="tax.id"
                class="flex justify-between font-medium text-gray-800 text-sm">
                <span class="font-medium text-gray-500">{{ tax.taxName }}({{ tax.postingType == "flat_amount" ?
                  formatCurrency(parseFloat(tax.amount)) : `${tax.percentage}%` }})</span>
                <span>{{ formatCurrency(tax.taxAmount) }}</span>
              </div>
            </div>
          </div>

          <!-- Totaux -->
          <div class="border-t pt-3 space-y-2">
            <div class="flex justify-between text-gray-700">
              <span>{{ $t('RoomCharges') }} ({{ numberOfNights }}
                {{ numberOfNights > 1 ? $t('nights') : $t('night') }})</span>
              <span>{{ formatCurrency(totalRoomCharges) }}</span>
            </div>

            <div v-if="!billing.taxExempt" class="flex justify-between text-gray-700">
              <span>{{ $t('Taxes') }}</span>
              <span>{{ formatCurrency(billing.taxes) }}</span>
            </div>
            <div v-else class="flex justify-between text-green-600 text-sm">
              <span>{{ $t('TaxExempt') }}</span>
              <span>{{ $t('Applied') }}</span>
            </div>

            <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-300 pt-3 text-lg">
              <span>{{ $t('DueAmount') }}</span>
              <span>{{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>
        </div>

        <div>
          <Select :lb="$t('BillTo')" :options="billToOptions" v-model="billing.billTo" />
        </div>

        <label class="inline-flex items-center mt-4 cursor-pointer text-sm">
          <input type="checkbox" v-model="billing.taxExempt" class="form-checkbox" />
          <span class="ml-2">{{ $t('TaxExempt') }}</span>
        </label>

        <h3 class="mt-5 mb-2 text-sm font-semibold text-gray-700">{{ $t('PaymentMode') }}</h3>
                <!-- payment -->
        <div class="grid grid-cols-2  gap-6 mt-5">

          <!-- Payment Information -->
          <div class="space-y-4">

            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="billing.paymentType" value="cash" class="mr-2" />
                {{ $t('cash') }}
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="billing.paymentType" value="bank" class="mr-2" />
                {{ $t('bank') }}
              </label>
            </div>
          </div>

          <div class="space-y-4">
            <InputPaymentMethodSelect  :paymentType="billing.paymentType" v-model="billing.paymentMode" :hide-label="true"
              />
          </div>
        </div>

        <div v-if="isPaymentButtonShow" class="mt-4">
          <button type="button" class="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
            @click="openAddPaymentModal">
            {{ $t('AddPayment') }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
  <!-- Add Payment Modal -->
  <template v-if="isAddPaymentModalOpen && reservationId">
    <AddPaymentModal :reservation-id="reservationId" :is-open="isAddPaymentModalOpen" @close="closeAddPaymentModal"
      @save="handleSavePayment" />
  </template>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputTimePicker from '@/components/forms/FormElements/InputTimePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/forms/FormElements/Select.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import {
  PencilLine,
  CircleChevronDown,
  CarFront,
  ClipboardCheck,
  ClipboardList,
} from 'lucide-vue-next'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CustomerCard from '@/components/customers/CustomerCard.vue'
import { useBooking } from '@/composables/useBooking2'
import AddPaymentModal from '../../components/reservations/foglio/AddPaymentModal.vue'
import router from '../../router'
import { useRoute } from 'vue-router'
import BasicButton from '../../components/buttons/BasicButton.vue'
import InputPaymentMethodSelect from '../../components/reservations/foglio/InputPaymentMethodSelect.vue'
const route = useRoute()

const isAddPaymentModalOpen = ref(false)
const performChecking = () => {

}
const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
}

const handleSavePayment = (payment: any) => {
  router.push({
    name: 'ReservationDetails',
    params: { id: reservationId.value }
  });
}
const openAddPaymentModal = () => {
  isAddPaymentModalOpen.value = true
}
const { t } = useI18n()

const {
  // Data
  reservation,
  guest,
  otherInfo,
  billing,
  formData,
  roomConfigurations,
  RoomTypes,
  PaymentMethods,


  // States
  isLoading,
  isLoadingRoom,
  dateError,
  isLoadingRate,
  isPaymentButtonShow,
  confirmReservation,
  isCustomPrize,

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
  // Methods
  initialize,
  saveReservation,
  formatCurrency,
  goBack,


  // Room methods
  addRoom,
  removeRoom,
  toggleDropdown,
  onRoomTypeChange,
  getRateTypesForRoom,
  getRoomsForRoom,
  onRateTypeChange,

  // Customer methods
  onCustomerSelected,
  onOccupancyChange,
  getRoomExtraInfo,
  onRoomNumberChange,

} = useBooking()


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
  try {
    await saveReservation()
  } catch (error) {
    console.error('Error submitting reservation:', error)
  }
}

onMounted(() => {
  initialize()
  initializeForm()
})
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
