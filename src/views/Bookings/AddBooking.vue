<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <DefaultCard>
        <template v-slot:button v-if="isEditMode">
          <button class="flex items-center" @click="goBack">
            <ChevromLeftIcon />
            <span class="text-nowrap">{{ $t('Goback') }}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </button>
        </template>
        <form class="space-y-6">
          <!-- Personal information section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('ArrivedDate') }}
              </label>
              <div class="relative">
                <flat-pickr v-model="form.arrivalDate" :config="flatpickrConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('Selectdate')" />
                <span
                  class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('DepartDate') }}
              </label>
              <div class="relative">
                <flat-pickr v-model="form.departureDate" :config="flatpickrConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('Selectdate')" />
                <span
                  class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
              <p v-if="dateError" class="text-sm text-red-600">
                {{ dateError }}
              </p>
            </div>
            <div>
              <Input :lb="$t('Numberofnights')" :inputType="'Number'" :placeholder="$t('Numberofnights')" :id="'total1'"
                :forLabel="'total1'" :modelValue="numberOfNights ?? ''" :disabled="true" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('reservationType') }}
              </label>
              <select v-model="reservationCustomerType"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                <option v-for="option in reservationCustomerTypeOptions" :key="option.id" :value="option.id">
                  {{ option.label }}
                </option>
              </select>
            </div>

          </div>
          <div>
            <CustomerCard @customerSelected="onCustomerSelected" v-model="formData"
              :customerType="reservationCustomerType" />
          </div>

          <!-- Room Selection Component -->
          <template v-if="numberOfNights > 0">
            <RoomSector :ActiveRoomTypes="ActiveRoomTypes" :availableRooms="availableRooms" @room-change="roomChange"
              :availableTakens="availableTakens" :selectedRoomType="selectedRoomType" :numberOfNights="numberOfNights"
              @update:selectedRoomType="(val) => (selectedRoomType = val)" @update:roomSelections="updateRoomSelections"
              @update:totalPrice="updateTotalPrice" v-model="fetchData" />
          </template>
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">

            <div>
              <OutputFieldCurrency :lb="$t('DefaultDeposit')" :inputType="'Number'" :placeholder="$t('DefaultDeposit')"
                :id="'defaultDeposit'" :forLabel="'defaultDeposit'" :disabled="true" :value="totalMinimalAmount"
                :min="0" :step="0.01" />
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('DepositNote') }}
              </p>
            </div>

            <!-- Price Summary -->
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-700 dark:text-gray-300">{{ $t('BasePrice') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ formatCurrency(calculateTotalPrice) }}</span>
                </div>

                <div v-if="extraGuestPrice > 0 || isEditMode" class="flex justify-between items-center">
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ $t('ExtraGuestFee') }} ({{ totalExtraGuests }} {{ $t('guests') }})
                  </span>
                  <span class="text-gray-900 dark:text-white">{{ formatCurrency(extraGuestPrice ?? '') }}</span>
                </div>

                <hr class="border-gray-300 dark:border-gray-600" />

                <div class="flex justify-between items-center">
                  <span class="font-medium text-lg text-gray-900 dark:text-white">
                    {{ $t('TotalPrice') }}
                  </span>
                  <span class="font-bold text-xl text-gray-900 dark:text-white">
                    {{ formatCurrency(finalTotalPrice) }}
                  </span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{
                    $t('Remaining')
                    }}</span>
                  <span class="font-bold text-red-600 dark:text-red-400">
                    {{ formatCurrency(remainingAmount) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ $t('special_request') }}
            </label>
            <textarea v-model="form.normalDescription" :placeholder="$t('Largetext')" rows="6"
              class="dark:bg-dark-900 h-40 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"></textarea>
          </div>
        </form>

        <ButtonComponent type="button" :disabled="!!dateError || isLoading" @click="handleSubmit">
          <span v-if="!isLoading"> {{ isEditMode ? $t('update') : $t('SaveBooking') }}</span>
          <span v-else class="flex items-center gap-2">
            <Spinner class="w-4 h-4" />
            {{ $t('Processing') }}...
          </span>
        </ButtonComponent>
      </DefaultCard>
    </div>

    <Modal v-if="isPaymentModalOpen" @close="isPaymentModalOpen = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <!-- Close button -->
          <button @click="isPaymentModalOpen = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.04 16.54a.9.9 0 0 0 1.41 1.42L12 13.41l4.54 4.55a.9.9 0 1 0 1.41-1.42L13.41 12l4.55-4.54a.9.9 0 0 0-1.42-1.41L12 10.59 7.46 6.05a.9.9 0 0 0-1.41 1.42L10.59 12l-4.55 4.54Z"
                fill="" />
            </svg>
          </button>

          <!-- Title -->
          <div class="mb-6 text-center">
            <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ $t('ConfirmBookingPayment') }}
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t('Reviewthereservationdetailsbeforeconfirming.') }}
            </p>
          </div>
          <form class="flex flex-col">
            <div class="custom-scrollbar h-[400px] overflow-y-auto p-2">
              <div class="space-y-8">
                <div class="border rounded-md p-4 text-sm text-gray-700 dark:text-gray-300">
                  <div class="space-y-2">
                    <div>
                      <strong>{{ $t('Customer') }}:</strong> {{ reservationSummary.clientName }}
                    </div>
                    <div>
                      <strong>{{ $t('Total') }}:</strong> {{ formatCurrency(reservationSummary.total) }}
                    </div>
                  </div>
                </div>
                <Select :lb="$t('PaymentMethod')" :options="Payements[0]?.paymentMethods"
                  v-model="selectedPaymentMethod" />
              </div>
            </div>
          </form>

          <!-- Buttons -->
          <div class="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
            <!-- Cancel -->
            <button type="button"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] sm:w-auto"
              @click="isPaymentModalOpen = false">
              {{ $t('Cancel') }}
            </button>

            <!-- Confirm -->
            <ButtonComponent type="button" :disabled="isLoading || !selectedPaymentMethod" @click="savePayment">
              <span v-if="!isLoading">{{ $t('ConfirmPay') }}</span>
              <span v-else class="flex items-center gap-2">
                <Spinner class="w-4 h-4" />
                {{ $t('Processing') }}...
              </span>
            </ButtonComponent>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import flatPickr from 'vue-flatpickr-component'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import 'flatpickr/dist/flatpickr.css'
import Spinner from '@/components/spinner/Spinner.vue'
import Modal from '@/components/profile/Modal.vue'
import RoomSector from './RoomSector.vue'
import CustomerCard from '@/components/customers/CustomerCard.vue'
import DefaultCard from '@/components/common/DefaultCard.vue'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'
import ChevromLeftIcon from '@/icons/ChevromLeftIcon.vue'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import OutputFieldCurrency from '@/components/forms/FormElements/outputFieldCurrency.vue'
import { useBooking } from '@/composables/useBooking'

const {
  isLoading,
  isPaymentModalOpen,
  fetchData,
  isEditMode,
  ActiveRoomTypes,
  selectedRoomType,
  availableTakens,
  updateRoomSelections,
  updateTotalPrice,
  Payements,
  reservationSummary,
  currentPageTitle,
  fetchServiceData,
  fetchServiceProduct,
  reservationCustomerTypeOptions,
  reservationCustomerType,
  flatpickrConfig,
  form,
  selectedPaymentMethod,
  formData,
  savePayment,
  dateError,
  numberOfNights,
  loadReservationData,
  calculateTotalPrice,
  extraGuestPrice,
  totalExtraGuests,
  totalMinimalAmount,
  availableRooms,
  handleSubmit,
  onCustomerSelected,
  goBack,
  fetchRoomType,
  finalTotalPrice,
  remainingAmount,
  roomChange,
} = useBooking()

onMounted(async () => {
  await fetchServiceData()
  await fetchServiceProduct()
  await fetchRoomType()
  await loadReservationData()
})
</script>
