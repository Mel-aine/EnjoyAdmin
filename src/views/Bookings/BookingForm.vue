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
          <form  class="grid grid-cols-1 xl:grid-cols-1 gap-6 p-6">
            <!-- Left Side: Reservation Form -->
            <div class="space-y-6">
              <!-- Check-in/out dates and time -->
              <div class="md:flex relative items-start gap-2">
                <!-- Check-In -->
                <div class="flex flex-col">
                  <label for="checkin" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('check_in') }}
                  </label>
                  <div class="flex gap-0">
                    <InputDatePicker v-model="reservation.checkinDate" class="rounded-r-none" :placeholder="$t('Selectdate')" />
                    <InputTimePicker v-model="reservation.checkinTime" class="rounded-l-none" />
                  </div>
                </div>

                <!-- Nights -->
                <div class="flex flex-col">
                  <Input :lb="$t('nights')" :disabled="true" :modelValue="numberOfNights.toString()" />
                </div>

                <!-- Check-Out -->
                <div class="flex flex-col">
                  <label for="checkout" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('check_out') }}
                  </label>
                  <div class="flex gap-0">
                    <InputDatePicker v-model="reservation.checkoutDate" :placeholder="$t('Selectdate')" class="rounded-r-none" />
                    <InputTimePicker v-model="reservation.checkoutTime" class="rounded-l-none" />
                  </div>
                  <p v-if="dateError" class="text-sm text-red-600">
                    {{ $t(dateError) }}
                  </p>
                </div>
              </div>

              <div class="grid md:grid-cols-4 grid-cols-1 gap-4">
                <div>
                  <Input :inputType="'number'" :lb="$t('Room')" :id="'room-qty'" forLabel="'room-qty'" v-model.number="reservation.rooms" :min="1" :disabled="true" />
                </div>

                <div>
                  <Select :lb="$t('booking_type')" v-model="reservation.bookingType" :options="BookingType" />
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
                      <input type="checkbox" v-model="reservation.isComplementary" class="form-checkbox" />
                      <span class="ml-2">{{ $t('Contract') }}</span>
                    </label>
                  </div>

                  <div class="space-x-2">
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" />
                      <span class="ml-2">{{ $t('BookAllAvailableRooms') }}</span>
                    </label>
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" />
                      <span class="ml-2">{{ $t('QuickGroupBooking') }}</span>
                    </label>
                    <label class="inline-flex items-center cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" />
                      <span class="ml-2">{{ $t('ComplimentaryRoom') }}</span>
                    </label>
                  </div>
                </div>

                <!-- Room Configurations -->
                <div class="space-y-4">
                  <div v-for="(room, index) in roomConfigurations" :key="room.id" class="border border-gray-200 rounded-lg p-4 bg-white" :class="{ 'border-l-4 border-l-orange-500': index === 0 }">
                    <!-- Room Header -->
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                          {{ index + 1 }}
                        </span>
                        <h3 class="text-sm font-medium text-gray-800">
                          {{ $t('Room') }} {{ index + 1 }}
                        </h3>
                      </div>

                      <!-- Remove Button (only show if more than 1 room) -->
                      <button v-if="roomConfigurations.length > 1" @click="removeRoom(room.id)" type="button" class="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" :title="$t('RemoveRoom')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <!-- Room Configuration Fields -->
                    <div class="grid md:grid-cols-6 grid-cols-1 gap-4 items-end">
                      <div class="relative">
                        <Select :lb="$t('roomType')" :options="RoomTypes" v-model="room.roomType" @update:modelValue="onRoomTypeChange(room.id, $event)" :disabled="isLoadingRoom" />
                      </div>

                      <div class="relative">
                        <Select :lb="$t('configuration.rates.rateType')" :options="getRateTypesForRoom(room.id)" v-model="room.rateType" :disabled="!room.roomType" />
                      </div>

                      <div class="relative">
                        <Select :lb="$t('Room')" :options="getRoomsForRoom(room.id)" v-model="room.roomNumber" :disabled="!room.roomType" />
                      </div>

                      <div>
                        <Input :inputType="'number'" :lb="$t('Adult')" :id="'adult-' + room.id" v-model.number="room.adultCount" :min="0" />
                      </div>

                      <div>
                        <Input :inputType="'number'" :lb="$t('Children')" :id="'child-' + room.id" v-model.number="room.childCount" :min="0" />
                      </div>

                      <div class="relative inline-block">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('rate') }} (XAF)</label>
                        <div class="flex items-center border border-gray-300 rounded-lg bg-gray-100 px-4 py-2.5 text-sm">
                          <span type="button" class="text-gray-500 hover:text-gray-700 mr-6">
                            <PencilLine :size="18" />
                          </span>
                          <span class="flex-grow font-medium">{{ room.rate }}</span>
                          <button @click="toggleDropdown(room.id)" type="button" class="text-gray-500 hover:text-gray-700 ml-2">
                            <CircleChevronDown :class="{
                              'transform rotate-180 transition-transform': room.isOpen,
                              'transition-transform': !room.isOpen,
                            }" :size="20" />
                          </button>

                          <div v-if="room.isOpen" class="absolute left-0 top-full mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:bg-gray-900 z-20 max-h-48 overflow-auto">
                            <ul>
                              <li v-for="option in dropdownOptions" :key="option.value" class="flex items-center gap-3 px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer" @click="selectOption(option, room.id)">
                                <component :is="option.icon" class="text-purple-600" :size="18" />
                                <div class="flex flex-col">
                                  <span class="font-medium text-gray-500 dark:text-gray-200">{{ option.label }}</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-4">
                  <button @click="addRoom" type="button" class="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 rounded-md text-sm font-normal hover:bg-orange-600 hover:text-white transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ $t('AddRoom') }}
                  </button>
                  <button type="button" class="px-4 py-2 border border-gray-600 text-gray-600 rounded-md text-sm font-normal hover:bg-gray-600 hover:text-white transition">
                    {{ $t('add_discount') }}
                  </button>
                </div>
              </section>

              <!-- Guest Information -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <h2 class="text-sm font-semibold text-gray-800 uppercase">{{ $t('guest_info') }}</h2>
                <div>
                  <CustomerCard @customerSelected="onCustomerSelected" v-model="formData" :customerType="reservationCustomerType" />
                </div>
                <div>
                  <Input :inputType="'text'" :lb="$t('Address')" :id="'address'" forLabel="'address'" v-model="guest.address" />
                </div>
                <div class="grid md:grid-cols-4 grid-cols-1 gap-6">
                  <div>
                    <InputCountries :lb="'Country'" v-model="guest.country" />
                  </div>
                  <div>
                    <Input :inputType="'text'" :lb="$t('State')" :id="'State'" forLabel="'State'" v-model="guest.state" />
                  </div>
                  <div>
                    <Input :inputType="'text'" :lb="$t('City')" :id="'city'" forLabel="'city'" v-model="guest.city" />
                  </div>
                  <div>
                    <Input :inputType="'text'" :lb="$t('Zipcode')" :id="'zipcode'" forLabel="'zipcode'" v-model="guest.zipcode" />
                  </div>
                </div>

                <div class="pt-1">
                  <button type="button" class="px-4 py-2 text-sm border border-orange-600 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition font-normal">
                    {{ $t('C_Form') }}
                  </button>
                </div>
              </section>

              <!-- Other Information -->
              <section class="border-t border-gray-300 pt-4 space-y-4">
                <h2 class="text-sm font-semibold text-gray-800 uppercase">{{ $t('other_info') }}</h2>

                <div class="space-y-3">
                  <div>
                    <label class="inline-flex items-center space-x-2 cursor-pointer text-sm">
                      <input type="checkbox" v-model="otherInfo.emailBookingVouchers" class="form-checkbox" />
                      <span>{{ $t('otherInfo.emailBookingVouchers') }}</span>
                    </label>

                    <div v-if="otherInfo.emailBookingVouchers" class="flex space-x-2 items-center pl-6">
                      <div class="w-[900px]">
                        <InputEmail placeholder="info@gmail.com" v-model="otherInfo.voucherEmail" />
                      </div>
                      <button type="button" class="px-3 py-1 border border-purple-600 text-purple-600 rounded text-sm hover:bg-purple-600 hover:text-white transition font-normal">
                        {{ $t('otherInfo.previewVoucher') }}
                      </button>
                    </div>
                  </div>

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
                  </div>

                  <div>
                    <label class="inline-flex items-center space-x-2 cursor-pointer text-sm">
                      <input type="checkbox" v-model="otherInfo.successRateOnRegistrationCard" class="form-checkbox" />
                      <span>{{ $t('otherInfo.successRateOnRegistrationCard') }}</span>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </form>

          <!-- Form actions -->
          <div class="flex flex-col sm:flex-row justify-between items-center border-t border-gray-300 px-6 py-4 gap-4">
            <button type="button" @click.prevent="goBack" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition" :disabled="isLoading">
              {{ $t('Cancel') }}
            </button>

            <div class="flex space-x-3">
              <!-- <button type="button" :disabled="isLoading" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ $t('Check-In') }}
              </button> -->
              <button type="button" @click.prevent="handleSubmit()" :disabled="isLoading" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ $t('Reserve') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Billing Summary -->
      <div class="bg-white rounded-lg shadow p-6 h-fit lg:col-span-1 lg:sticky lg:top-20 self-start">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-semibold text-lg text-gray-800">{{ $t('BillingSummary') }}</h2>
          <button  class="bg-green-600 text-white text-sm py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            <!-- <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> -->
            {{ $t('ConfirmBooking') }}
          </button>
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

        <!-- Room Summary -->
        <div class="space-y-3 mb-6">
          <div class="text-sm font-medium text-gray-700 border-b pb-2">
            {{ $t('Rooms') }} ({{ roomConfigurations.length }})
          </div>

          <div v-for="(room, index) in roomConfigurations" :key="room.id" class="flex justify-between text-sm text-gray-600">
            <span>{{ $t('Room') }} {{ index + 1 }}</span>
            <span>{{ formatCurrency((room.rate || 0) * numberOfNights) }}</span>
          </div>

          <div class="flex justify-between text-gray-700 border-t pt-2">
            <span>{{ $t('RoomCharges') }}</span>
            <span>{{ formatCurrency(totalRoomCharges) }}</span>
          </div>

          <div class="flex justify-between text-gray-700">
            <span>{{ $t('Taxes') }}</span>
            <span>{{ formatCurrency(billing.taxes) }}</span>
          </div>

          <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-300 pt-3">
            <span>{{ $t('DueAmount') }}</span>
            <span>{{ formatCurrency(totalAmount) }}</span>
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

        <div class="space-y-2 space-x-2">
          <label class="inline-flex items-center cursor-pointer text-sm space-x-2">
            <input type="radio" name="paymentMode" value="cash" v-model="billing.paymentMode" class="form-radio" />
            <span>{{ $t('Cash') }}</span>
          </label>

          <label class="inline-flex items-center cursor-pointer text-sm space-x-2">
            <input type="radio" name="paymentMode" value="credit" v-model="billing.paymentMode" class="form-radio" />
            <span>{{ $t('Credit') }}</span>
          </label>

          <div v-if="billing.paymentMode === 'credit'">
            <Select :options="creditTypes" v-model="billing.creditType" />
          </div>
        </div>

        <!-- <div class="mt-4">
          <button type="button" class="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition">
            {{ $t('AddPayment') }}
          </button>
        </div> -->
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputTimePicker from '@/components/forms/FormElements/InputTimePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/forms/FormElements/Select.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import router from '@/router'
import { PencilLine, CircleChevronDown, CarFront, ClipboardCheck, ClipboardList } from 'lucide-vue-next'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CustomerCard from '@/components/customers/CustomerCard.vue'
import { useBooking } from '@/composables/useBooking2'

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

  // States
  isLoading,
  isLoadingRoom,
  dateError,

  // Computed
  numberOfNights,
  totalRoomCharges,
  totalAmount,

  // Options
  BookingSource,
  BusinessSource,
  BookingType,
  creditTypes,
  billToOptions,
  emailTemplates,
  reservationCustomerType,

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

  // Customer methods
  onCustomerSelected,
} = useBooking()

// Dropdown options pour les actions de chambre
const dropdownOptions = computed(() => [
  { value: 'inclusion', label: t('inclusion'), icon: ClipboardList },
  { value: 'remarks', label: t('remarks'), icon: PencilLine },
  { value: 'create_task', label: t('create_task'), icon: ClipboardCheck },
  { value: 'pickup_dropoff', label: t('pickup_dropoff'), icon: CarFront },
])

// Select option for dropdown actions
const selectOption = (option: any, roomId: string) => {
  const room = roomConfigurations.value.find(r => r.id === roomId)
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
})
</script>
