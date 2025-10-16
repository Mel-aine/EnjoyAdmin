<script setup lang="ts">
import { onMounted, computed, ref, defineAsyncComponent, watch } from 'vue'
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
import CustomerCard from '@/components/customers/CustomerCard.vue'
import { useBooking } from '@/composables/useBooking2'
import router from '../../router'
import { useRoute } from 'vue-router'
import BasicButton from '../../components/buttons/BasicButton.vue'
import InputPaymentMethodSelect from '../../components/reservations/foglio/InputPaymentMethodSelect.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import { useReservation } from '@/composables/useReservation'
import { getReservationDetailsById, confirmBooking } from '../../services/reservation'
import { useToast } from 'vue-toastification'
const emits = defineEmits(['close', 'open']);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
});

const isVisible = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    isVisible.value = true;
    emits('open');
  } else {
    setTimeout(() => {
      isVisible.value = false;
    }, 300); // Wait for animation to complete
  }
}, { immediate: true });

const close = () => {
  emits('close');
};

const CheckInReservation = defineAsyncComponent(() => import('@/components/reservations/CheckInReservation.vue'))


interface ReservationDetails {
  payment_method: any
  payment_type: any
}
const route = useRoute()
const isCkeckInModalOpen = ref(false)
const reservationDetails = ref<{ payment_method?: number; payment_type?: string }>({})
const { performCheckIn } = useReservation()

const isAddPaymentModalOpen = ref(false)
const isConfirmingReservation = ref(false)

const performChecking = () => { }
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

const submitted = ref(false);

const isRoomTypeInvalid = (room: any) => {
  if (!submitted.value) return false;
  if (!room.roomType) return true; // Required
  return !RoomTypes.value.some(option => option.value === room.roomType); // Must be in list
};

const isRateTypeInvalid = (room: any) => {
  if (!submitted.value) return false;
  if (!room.rateType) return true; // Required
  return !getRateTypesForRoom(room.id).some(option => option.value === room.rateType); // Must be in list
};

const isRoomNumberInvalid = (room: any) => {
  if (!submitted.value) return false;
  // if (room.roomType && !room.roomNumber) return true; // Required if roomType is selected
  if (!room.roomNumber) return false;
  return !getRoomsForRoom(room.id).some(option => option.value.toString() === room.roomNumber.toString());
};

const {
  // Data
  reservation,
  guest,
  otherInfo,
  billing,
  formData,
  roomConfigurations,
  RoomTypes,
  isLoadingAvailableRooms,

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
  validateRoomNumberOnChange,
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
  // Methods
  initialize,
  saveReservation,
  formatCurrency,
  goBack,
  resetForm,

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
  pendingUploads,
  holdReleaseData,
  canCityLedgerPay,
  isExtraChargesIncluded
} = useBooking()

// Computed pour vérifier s'il y a des uploads en cours
const hasPendingUploads = computed(() => {
  return pendingUploads.value.size > 0
})
const isGroupReservation = computed(() => {
  return roomConfigurations.value.length > 1
})

const checkinButtonLabel = computed(() => {
  if (pendingReservation.value) {
    return t('Confirm Reservation')
  }
  if (isGroupReservation.value) {
    return t('Check-In')
  }
  return t('Quick Check-In')
})


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
        return !resRoom.actualCheckInTime &&
          !resRoom.checkedIn &&
          resRoom.status !== 'checked_in' &&
          resRoom.status !== 'occupied'
      })

      if (!availableReservationRoom) {
        console.error(t('No available rooms for check-in'))
        return
      }

      const checkInDateTime = new Date().toISOString()
      const payload = {
        reservationRooms: [availableReservationRoom.id],
        actualCheckInTime: checkInDateTime,
        notes: '',
        keyCardsIssued: 2,
        depositAmount: 0
      }

      console.log('Quick check-in payload:', payload)
      console.log('ReservationRoom being checked in:', availableReservationRoom)
      const result = await performCheckIn(reservationId.value!, payload)

      if (result) {
        handleCheckInComplete()


        await router.push({
          name: 'ReservationDetails',
          params: { id: reservationId.value },
        })
      }
    }
  } catch (error) {
    console.error('Error during check-in:', error)
  } finally {
    isLoading.value = false
  }
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
      status: 'confirmed'
    }

    const res = await confirmBooking(reservationId.value, data)
    console.log("Confirmation response:", res)

    if (res.status === 200 || res.data) {
      // Mettre à jour l'état de la réservation
      pendingReservation.value = false
      confirmReservation.value = true

      toast.success(t('Reservation confirmed successfully'))

      await router.push({
        name: 'ReservationDetails',
        params: { id: reservationId.value },
      })
    }

  } catch (error: any) {
    console.error('Error confirming reservation:', error)
    const errorMessage = error.response?.data?.message || error.message || t('Failed to confirm reservation')
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
  submitted.value = true;
  try {
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

onMounted(() => {
  initialize()
  initializeForm()
})
</script>
<template>
  <!-- Backdrop -->
  <div v-if="isVisible" class="absolute inset-0 z-999 overflow-hidden" :class="{
    'opacity-100': isOpen,
    'opacity-0': !isOpen
  }">
    <!-- Background overlay -->
    <div class="absolute inset-0 bg-transparent bg-opacity-50 transition-opacity duration-300" :class="{
      'opacity-100': isOpen,
      'opacity-0': !isOpen
    }" @click="close"></div>

    <!-- Modal panel -->
    <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
      <div
        class="pointer-events-auto relative w-screen max-w-4xl transform transition-transform duration-300 ease-in-out"
        :class="{
          'translate-x-0': isOpen,
          'translate-x-full': !isOpen
        }">
        <!-- Modal content -->
        <div class="flex h-full flex-col bg-white shadow-xl">
          <!-- Header -->
          <div class="bg-white px-4 py-3 sm:px- border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">
                {{ $t('QuickBooking') }}
              </h2>
              <div class="ml-3 flex h-7 items-center">
                <button type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="close">
                  <span class="sr-only">Close panel</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div class="">
              <!-- Left Column: Add Reservation Form -->
              <div class="p">
                <form class="grid grid-cols-1 xl:grid-cols-1 gap-6 p-2">
                  <!-- Left Side: Reservation Form -->
                  <div class="space-y-6">
                    <!-- Check-in/out dates and time -->
                    <div class="md:flex relative items-start gap-0">
                      <!-- Check-In -->
                      <div class="flex flex-col w-full">
                        <label for="checkin" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          {{ $t('check_in') }}
                        </label>
                        <div class="flex gap-0">
                          <InputDatePicker v-model="reservation.checkinDate" class="rounded-r-none"
                            :allowPastDates="false" :placeholder="$t('Selectdate')" />
                          <InputTimePicker v-model="reservation.checkinTime" class="rounded-l-none" />
                        </div>
                      </div>

                      <!-- Nights -->
                      <div class="flex flex-col">
                        <Input :lb="$t('nights')" :disabled="true" custom-class="rounded-0"
                          :modelValue="numberOfNights.toString()" />
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
                      <div class="flex-col flex w-full ms-2">
                        <AutoCompleteSelect v-model="reservation.bookingType" :options="BookingType"
                          :defaultValue="$t('SelectReservationType')" :lb="$t('ReservationType')" :is-required="false"
                          :use-dropdown="useDropdownBooking" @clear-error="emit('clear-error')" />
                      </div>
                    </div>

                    <div class="grid md:grid-cols-5 grid-cols-1 gap-2">


                      <!-- Booking Source -->
                      <div>
                        <AutoCompleteSelect v-model="reservation.bookingSource" :options="BookingSource"
                          :defaultValue="$t('SelectBookingSource')" :lb="$t('booking_source')" :is-required="false"
                          :use-dropdown="useDropdownBooking" @clear-error="emit('clear-error')" />
                      </div>

                      <div>
                        <AutoCompleteSelect v-model="reservation.businessSource" :options="BusinessSource"
                          :defaultValue="$t('SelectBusinessSource')" :lb="$t('business_source')" :is-required="false"
                          :use-dropdown="useDropdownBooking" @clear-error="emit('clear-error')" />
                      </div>
                      <div>
                        <Input :lb="$t('arriveFrom')"></Input>
                      </div>
                      <div>
                        <Input :lb="$t('Going to')"></Input>
                      </div>
                      <div>
                        <Input :lb="$t('Transportaion Mode')"></Input>
                      </div>
                    </div>
                    <!-- Room Type -->
                    <section class="border-t border-gray-300 pt-4 space-y-4">
                      <!-- Room Configurations -->
                      <div class="space-y-4">
                        <div class="grid md:grid-cols-12 grid-cols-12 gap-1 py-2 px-3 items-end bg-gray-100">
                          <div class="col-span-3">{{ $t('roomType') }}</div>
                          <div class="col-span-2">{{ $t('configuration.rates.rateType') }}</div>
                          <div class="col-span-2">{{ $t('Room') }}</div>
                          <div class="col-span-1">{{ $t('Adult') }}</div>
                          <div class="col-span-1">{{ $t('child') }}</div>
                          <div class="col-span-2">{{ $t('rate') }} (XAF)</div>
                        </div>
                        <div v-for="(room, index) in roomConfigurations" :key="room.id" class="">
                          <!-- Room Configuration Fields -->
                          <div class="grid md:grid-cols-12 grid-cols-12 gap-1 items-end px-3" >
                            <div class="relative col-span-3">
                              <p v-if="isRoomTypeInvalid(room)" class="text-sm text-red-600 mb-1">
                                {{ $t('validation.invalidRoomType') }}
                              </p>
                              <AutoCompleteSelect v-model="room.roomType" :options="RoomTypes"
                                :defaultValue="$t('SelectRoomType')" :is-required="false"
                                :use-dropdown="useDropdownRoomType" :disabled="isLoadingRoom"
                                @update:modelValue="onRoomTypeChange(room.id, $event)"
                                @clear-error="emit('clear-error')"
                                :class="{ 'border-red-500': isRoomTypeInvalid(room) }" />
                            </div>

                            <div class="relative col-span-2">
                              <p v-if="isRateTypeInvalid(room)" class="text-sm text-red-600 mb-1">
                                {{ $t('validation.invalidRateType') }}
                              </p>
                              <AutoCompleteSelect v-model="room.rateType" :options="getRateTypesForRoom(room.id)"
                                :defaultValue="$t('SelectRateType')" 
                                :is-required="false" :use-dropdown="useDropdownRateType" :disabled="!room.roomType"
                                @update:modelValue="onRateTypeChange(room.id, $event)"
                                @clear-error="emit('clear-error')"
                                :class="{ 'border-red-500': isRateTypeInvalid(room) }" />
                            </div>

                            <div class="relative col-span-2">
                              <p v-if="isRoomNumberInvalid(room)" class="text-sm text-red-600 mb-1">
                                {{ $t('invalidRoomNumber') }}
                              </p>
                              <AutoCompleteSelect v-model="room.roomNumber" :options="getRoomsForRoom(room.id)"
                                :defaultValue="$t('SelectRoom')"  :is-required="false"
                                :use-dropdown="useDropdownRoom" :disabled="!room.roomType"
                                :isLoading="room.isLoadingRooms" @update:modelValue="onRoomNumberChange(room)"
                                @clear-error="emit('clear-error')"
                                :class="{ 'border-red-500': isRoomNumberInvalid(room) }" />
                            </div>

                            <!-- Adult Count avec gestion des changements -->
                            <div class="col-span-1">
                        
                              <input type="number" :id="'adult-' + room.id" v-model.number="room.adultCount"
                                @input="onOccupancyChange(room.id, 'adultCount', room.adultCount)" :min="0"
                                :disabled="!room.roomType"
                                class="dark:bg-dark-900 h-11 w-full border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                            </div>

                            <!-- Child Count avec gestion des changements -->
                            <div class="col-span-1">
                             
                              <input type="number" :id="'child-' + room.id" v-model.number="room.childCount"
                                @input="onOccupancyChange(room.id, 'childCount', room.childCount)" :min="0"
                                :disabled="!room.roomType"
                                class="dark:bg-dark-900 h-11 w-full border border-black/50 bg-transparent  px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                            </div>

                            <!-- Rate Display avec détails -->
                            <div class="flex align-center self-center col-span-2">
                              <div class="relative inline-block w-full">
                               
                                <div v-if="!isCustomPrize"
                                  class="flex items-center border border-gray-300 mt-1.5 h-11  bg-gray-200 px-4 py-2.5 text-sm"
                                  :class="{ 'opacity-50': room.isLoadingRate }">
                                  <span type="button" class="text-gray-500 hover:text-gray-700 mr-3"
                                    @click="isCustomPrize = true">
                                    <PencilLine :size="18" />
                                  </span>

                                  <!-- Indicateur de chargement du rate -->
                                  <div v-if="room.isLoadingRate" class="flex-grow flex items-center">
                                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2">
                                    </div>
                                  </div>

                                  <!-- Rate avec breakdown -->
                                  <div v-else class="flex-grow">
                                    <div class="font-medium text-gray-800">
                                      {{ room.rate }}
                                    </div>
                                  </div>



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
                                    class="dark:bg-dark-900 h-11 w-full  border border-black/50 mt-1.5 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                                </div>
                              </div>
                             
                            </div>
                             <div class=" flex flex-col justify-center">
                                <button v-if="roomConfigurations.length > 1" @click="removeRoom(room.id)" type="button"
                                  class="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                  :title="$t('RemoveRoom')">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                          </div>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex space-x-3">
                        <button @click="addRoom" type="button"
                          class="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 rounded-md text-sm font-normal hover:bg-orange-600 hover:text-white transition-colors">
                          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          {{ $t('AddRoom') }}
                        </button>

                      </div>
                    </section>
                    <section class="border-t border-gray-300 pt-4 space-y-4" v-if="reservation.isHold">
                      <!-- Hold Release Date & Time Section -->
                      <div class="">
                        <h2 class="text-sm font-semibold text-gray-800 uppercase mb-5">{{ $t('hold_release_date_time')
                        }}</h2>

                        <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                          <!-- Date Input -->
                          <div class="col-span-2">
                            <InputDatePicker :title="$t('date')" v-model="holdReleaseData.date"
                              :placeholder="$t('select_date')" />
                          </div>

                          <!-- Time Input -->
                          <div class="col-span-2">
                            <InputTimePicker :title="$t('time')" v-model="holdReleaseData.time"
                              :placeholder="$t('select_time')" />
                          </div>

                          <!-- Release Term -->
                          <div class="col-span-2">
                            <div class="flex">
                              <Input :lb="$t('release_term')" v-model="holdReleaseData.releaseTerm"
                                :placeholder="$t('value')" class="flex-1 rounded-r-none" />
                            </div>
                          </div>

                          <!-- Remind Guest Before -->
                          <div class="col-span-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">{{
                              $t('remind_guest_before') }}</label>
                            <div class="flex items-center space-x-2">
                              <Input :inputType="'number'" v-model="holdReleaseData.remindDays" :placeholder="'0'"
                                class="w-22" />
                              <span class="text-sm text-gray-600">{{ $t('days') }}</span>

                              <!-- Radio buttons -->
                              <div class="flex items-center space-x-4 ml-4">
                                <label class="flex items-center space-x-1 cursor-pointer">
                                  <input type="radio" v-model="holdReleaseData.dateType" value="hold_release_date"
                                    class="form-radio text-blue-600" />
                                  <span class="text-sm text-gray-700">{{ $t('hold_release_date') }}</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer">
                                  <input type="radio" v-model="holdReleaseData.dateType" value="arrival_date"
                                    class="form-radio text-blue-600" />
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
                      <h2 class="text-sm font-semibold text-gray-800 uppercase">
                        {{ $t('guest_info') }}
                      </h2>
                      <div>
                        <CustomerCard @customerSelected="onCustomerSelected" v-model="formData" />
                      </div>
                    </section>

                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
            <div class="flex space-x-3">
              <BasicButton v-if="showCheckinButton && !pendingReservation" type="button" @click="handleCheckIn"
                :loading="isLoading" :disabled="isLoading" variant="info"
                :label="isGroupReservation ? $t('Check-In') : $t('Quick Check-In')">
              </BasicButton>
              <BasicButton v-if="!confirmReservation" variant="info" :loading="isLoading" type="submit"
                @click="handleSubmit()" :disabled="isLoading || hasPendingUploads"
                :label="hasPendingUploads ? $t('UploadingImages') : $t('Reserve')">
              </BasicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
