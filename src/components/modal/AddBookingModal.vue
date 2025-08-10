<template>
    <div class="fixed inset-0 z-999 flex items-center hide-scrollbar justify-center bg-black/25 bg-opacity-40">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-5xl relative ">

            <!-- Main AddBooking content -->
            <div class="space-y-5 sm:space-y-6">
                <DefaultCard>
                    <template v-slot:header>
                        <div class="w-full flex justify-between items-center">
                            <div class="flex justify-between w-full">
                                <p class="font-bold">
                                    {{ $t('new_reservation') }}
                                </p>
                                <button class=" text-gray-500 hover:text-red-500" @click="$emit('close')">
                                    <span class="sr-only">Close</span>
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>
                        </div>
                    </template>
                    <div class="overflow-y-auto max-h-[70vh] no-scrollbar">
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
                                    <Input :lb="$t('Numberofnights')" :inputType="'Number'"
                                        :placeholder="$t('Numberofnights')" :id="'total1'" :forLabel="'total1'"
                                        :modelValue="numberOfNights ?? ''" :disabled="true" />
                                </div>
                                <div>
                                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        {{ $t('reservationType') }}
                                    </label>
                                    <select v-model="reservationCustomerType"
                                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                        <option v-for="option in reservationCustomerTypeOptions" :key="option.id"
                                            :value="option.id">
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
                            <template
                                v-if="(numberOfNights > 0 && serviceStore.serviceId) && ((isEditMode && fetchData && fetchData.length > 0) || !isEditMode)">
                                <RoomSector :ActiveRoomTypes="ActiveRoomTypes" :availableRooms="availableRooms"
                                    @room-change="roomChange" :availableTakens="availableTakens"
                                    :selectedRoomType="selectedRoomType" :numberOfNights="numberOfNights"
                                    @update:selectedRoomType="(val) => (selectedRoomType = val)"
                                    @update:roomSelections="updateRoomSelections" :arrival-date="form.arrivalDate"
                                    :departure-date="form.departureDate" :service-id="serviceStore.serviceId"
                                    @update:totalPrice="updateTotalPrice" v-model="fetchData" />
                            </template>
                            <div
                                class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div>
                                    <OutputFieldCurrency :lb="$t('DefaultDeposit')" :inputType="'Number'"
                                        :placeholder="$t('DefaultDeposit')" :id="'defaultDeposit'"
                                        :forLabel="'defaultDeposit'" :disabled="true" :value="totalMinimalAmount"
                                        :min="0" :step="0.01" />
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {{ $t('DepositNote') }}
                                    </p>
                                </div>
                                <!-- Price Summary -->
                                <div
                                    class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div class="space-y-2">
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-700 dark:text-gray-300">{{ $t('BasePrice') }}</span>
                                            <span class="text-gray-900 dark:text-white">{{
                                                formatCurrency(calculateTotalPrice) }}</span>
                                        </div>
                                        <div v-if="extraGuestPrice > 0 || isEditMode"
                                            class="flex justify-between items-center">
                                            <span class="text-gray-700 dark:text-gray-300">
                                                {{ $t('ExtraGuestFee') }} ({{ totalExtraGuests }} {{ $t('guests') }})
                                            </span>
                                            <span class="text-gray-900 dark:text-white">{{
                                                formatCurrency(extraGuestPrice ??
                                                    '') }}</span>
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
                    </div>

                    <template v-slot:footer>
                        <div class="p-4 border-t flex justify-end items-center gap-4">
                            <ButtonComponent type="button" :disabled="!canSave || !!dateError || isLoading"
                                @click="handleSubmit">
                                <span v-if="!isLoading"> {{ isEditMode ? $t('update') : $t('SaveBooking') }}</span>
                                <span v-else class="flex items-center gap-2">
                                    <Spinner class="w-4 h-4" />
                                    {{ $t('Processing') }}...
                                </span>
                            </ButtonComponent>
                        </div>
                    </template>
                </DefaultCard>
            </div>
            <template v-if="selectBooking">
                <PaymentModal :reservation="selectBooking" :is-open="isPaymentModalOpen" @close="closeModalPayment" @payment-recorded="closeModalPayment" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Input from '@/components/forms/FormElements/Input.vue'
import flatPickr from 'vue-flatpickr-component'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import 'flatpickr/dist/flatpickr.css'
import Spinner from '@/components/spinner/Spinner.vue'
import RoomSector from '@/views/Bookings/RoomSector.vue'
import CustomerCard from '@/components/customers/CustomerCard.vue'
import DefaultCard from '@/components/common/DefaultCard.vue'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'
import CalendarIcon from '@/icons/CalendarIcon.vue'
import OutputFieldCurrency from '@/components/forms/FormElements/outputFieldCurrency.vue'
import { useBooking } from '@/composables/useBooking'
import PaymentModal from '@/views/Bookings/PaymentModal.vue'

const emit = defineEmits(['refresh','close'])
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
    selectBooking,
    fetchServiceData,
    fetchServiceProduct,
    reservationCustomerTypeOptions,
    reservationCustomerType,
    flatpickrConfig,
    form,
    serviceStore,
    formData,
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
    fetchRoomType,
    finalTotalPrice,
    remainingAmount,
    roomChange,
    canSave,
} = useBooking()

onMounted(async () => {
    await fetchServiceData()
    await fetchServiceProduct()
    await fetchRoomType()
    await loadReservationData()
})
  const closeModalPayment = ()=>{
        isPaymentModalOpen.value = false;
        emit('refresh');
  }
</script><style>

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
