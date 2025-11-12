<script setup lang="ts">
import { onMounted, computed, ref, defineAsyncComponent, watch } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputTimePicker from '@/components/forms/FormElements/InputTimePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/forms/FormElements/Select.vue'
import CustomerSearch from '../customers/CustomerSarch.vue'
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
import InputPhone from '../forms/FormElements/InputPhone.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import { useReservation } from '@/composables/useReservation'
import { getReservationDetailsById, confirmBooking } from '../../services/reservation'
import { useToast } from 'vue-toastification'
import { useBookingStorage } from '@/composables/useBookingStorage'
const emits = defineEmits(['close', 'open',"clear-error"]);
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
const { saveBooking } = useBookingStorage()

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
const GuestTitles = computed(() => [
  { label: t('guestTitles.mr'), value: 'Mr' },
  { label: t('guestTitles.mrs'), value: 'Mrs' },
  { label: t('guestTitles.miss'), value: 'Miss' },
  { label: t('guestTitles.dr'), value: 'Dr' },
])

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
  CustomTypes,
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
   getChildOptions,
    getAdultOptions,
    TransportationModes,
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


const copyFirstRoomRate = () => {
  if (roomConfigurations.value.length > 0) {
    const firstRoomRate = roomConfigurations.value[0].rate

    for (let i = 1; i < roomConfigurations.value.length; i++) {
      roomConfigurations.value[i].rate = firstRoomRate
    }

  }
}


const gotoNew = () => {
  const draftData:any = {
    reservation: {
      checkinDate: reservation.value.checkinDate,
      checkinTime: reservation.value.checkinTime,
      checkoutDate: reservation.value.checkoutDate,
      checkoutTime: reservation.value.checkoutTime,
      bookingType: reservation.value.bookingType,
      bookingSource: reservation.value.bookingSource,
      businessSource: reservation.value.businessSource,
      isComplementary: reservation.value.isComplementary,
      isHold: reservation.value.isHold,
      rooms: reservation.value.rooms,
      meansOfTransport:reservation.value.meansOfTransport,
      goingTo:reservation.value.goingTo,
      arrivingTo:reservation.value.arrivingTo,
      customType:reservation.value.customType

    },
    roomConfigurations: roomConfigurations.value.map(room => ({
      id: room.id,
      roomType: room.roomType,
      rateType: room.rateType,
      roomNumber: room.roomNumber,
      adultCount: room.adultCount,
      childCount: room.childCount,
      rate: room.rate,
      taxes: room.taxes || [],
      extraCharges: room.extraCharges || []
    })),
    formData: {
      title: formData.value.title,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      phoneNumber: formData.value.phoneNumber,
      address: formData.value.address,
      country: formData.value.country,
      state: formData.value.state,
      zipcode: formData.value.zipcode,
      dateOfBirth: formData.value.dateOfBirth,
      placeOfBirth: formData.value.placeOfBirth,
      profession: formData.value.profession,
      idType: formData.value.idType,
      idNumber: formData.value.idNumber,
      idExpiryDate: formData.value.idExpiryDate,
      issuingCountry: formData.value.issuingCountry,
      issuingCity: formData.value.issuingCity,
      profilePhoto: formData.value.profilePhoto,
      idPhoto: formData.value.idPhoto,
      maidenName: formData.value.maidenName,
      contactType: formData.value.contactType,
      contactValue: formData.value.contactValue,
    },
    otherInfo: {
      emailBookingVouchers: otherInfo.value.emailBookingVouchers,
      voucherEmail: otherInfo.value.voucherEmail
    },
    billing: {
      billTo: billing.value.billTo,
      paymentType: billing.value.paymentType,
      paymentMode: billing.value.paymentMode
    },
    ...(reservation.value.isHold && {
      holdReleaseData: {
        date: holdReleaseData.value.date,
        time: holdReleaseData.value.time,
        releaseTerm: holdReleaseData.value.releaseTerm,
        remindDays: holdReleaseData.value.remindDays,
        dateType: holdReleaseData.value.dateType
      }
    })
  }

  const saved = saveBooking(draftData)

  if (saved) {
    console.log('Draft saved successfully')
  }

  // Fermer la modal et rediriger
  emits('close')
  router.push({ name: 'New Booking' })
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


   const walkInOption = BookingSource.value.find((source: any) =>
    source.label === 'Walk-in')
     console.log('walkInOption:', walkInOption)

  if (walkInOption) {
    reservation.value.bookingSource = walkInOption.id
  }


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

const TypesOfContact = computed(() => [
  { label: t('contactTypes.mobile'), value: 'Mobile' },
  { label: t('contactTypes.fix'), value: 'Fix' },
  { label: t('contactTypes.email'), value: 'Email' },
  { label: t('contactTypes.facebook'), value: 'Facebook' },
  { label: t('contactTypes.whatsapp'), value: 'Whatsapp' },
])

const contactInputComponent = computed(() => {
  if (!formData.value.contactType) return null

  switch (formData.value.contactType) {
    case 'Email':
      return 'InputEmail'
    case 'Mobile':
    case 'Fix':
    case 'Whatsapp':
      return 'InputPhone'
    case 'Facebook':
      return 'Input'
    default:
      return null
  }
})

const contactInputLabel = computed(() => {
  const type = formData.value.contactType
  if (!type) return ''

  switch (type) {
    case 'Mobile':
      return t('contactTypes.mobile')
    case 'Fix':
      return t('contactTypes.fix')
    case 'Email':
      return t('Email')
    case 'Facebook':
      return t('contactTypes.facebook')
    case 'Whatsapp':
      return t('contactTypes.whatsapp')
    default:
      return type
  }
})


watch(() => formData.value.contactType, (newType, oldType) => {
  if (newType !== oldType) {
    formData.value.contactTypeValue = ''
  }
})

// Créer un computed bidirectionnel

const contactValue = computed({
  get: () => formData.value.contactValue,
  set: (value) => {
    formData.value.contactValue = value
  }
})

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
    <div class="absolute inset-0 bg-black/50 dark:bg-black/70 transition-opacity duration-300" :class="{
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
        <div class="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
          <!-- Header -->
          <div class="bg-white dark:bg-gray-800 px-4 py-3 sm:px- border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium dark:text-white text-gray-900">
                {{ $t('QuickBooking') }}
              </h2>
              <div class="ml-3 flex h-7 items-center">
                <button type="button"
                  class="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
                <form class="grid grid-cols-1 xl:grid-cols-1 gap-6 p-2 text-sm">
                  <!-- Left Side: Reservation Form -->
                  <div class="space-y-6">
                    <!-- Check-in/out dates and time -->
                    <div class="md:flex relative items-start gap-0">
                      <!-- Check-In -->
                      <div class="flex flex-col w-full">
                        <label for="checkin" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          {{ $t('check_in_date') }}
                        </label>
                        <div class="flex gap-0 ">
                          <InputDatePicker v-model="reservation.checkinDate" custom-class="rounded-r-none"
                            :allowPastDates="false" :placeholder="$t('Selectdate')" class="w-[110px]" />
                          <InputTimePicker v-model="reservation.checkinTime" class="rounded-l-none w-[100px]" />
                        </div>
                      </div>

                      <!-- Nights -->
                       <div class="flex flex-col w-1/4">
                          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                              {{ $t('nights') }}
                          </label>
                          <span
                              class="flex items-center dark:bg-dark-900 h-11 w-full rounded-none  bg-black text-white px-2 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800">{{ numberOfNights }}</span>
                        </div>

                      <!-- Check-Out -->
                      <div class="flex flex-col w-full">
                        <label for="checkout" class="mb-1.5 ml-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          {{ $t('check_out_date') }}
                        </label>
                        <div class="flex gap-0">
                          <InputDatePicker v-model="reservation.checkoutDate" :placeholder="$t('Selectdate')"
                            custom-class="rounded-none" class="w-[110px]" />
                          <InputTimePicker v-model="reservation.checkoutTime" custom-class="rounded-r-lg" class="w-[100px]"/>
                        </div>

                        <p v-if="dateError" class="text-sm text-red-600">
                          {{ $t(dateError) }}
                        </p>
                      </div>
                      <div class="flex-col flex w-[500px]  ms-2">
                        <AutoCompleteSelect v-model="reservation.bookingType" :options="BookingType"
                          :defaultValue="$t('SelectReservationType')" :lb="$t('ReservationType')" :is-required="false"
                          :use-dropdown="useDropdownBooking" @clear-error="emits('clear-error')" />
                      </div>
                       <!-- Booking Source -->
                      <div class="flex-col flex w-[500px] ms-2">
                        <AutoCompleteSelect v-model="reservation.bookingSource" :options="BookingSource"
                          :defaultValue="$t('SelectBookingSource')" :lb="$t('booking_source')" :is-required="false"
                          :use-dropdown="useDropdownBooking" @clear-error="emits('clear-error')" />
                      </div>
                      <div class="flex-col flex w-[500px] ms-2">
                        <AutoCompleteSelect v-model="reservation.businessSource" :options="BusinessSource"
                          :defaultValue="$t('SelectBusinessSource')" :lb="$t('business_source')" :is-required="false"
                          :use-dropdown="useDropdownBooking" @clear-error="emits('clear-error')" />
                      </div>
                    </div>


                    <!-- Room Type -->
                    <section class="border-t border-gray-300  dark:bg-gray-800 pt-4 space-y-4">
                      <!-- Room Configurations -->
                      <div class="space-y-4">
                        <div class="grid md:grid-cols-12 grid-cols-12 gap-1 py-2 px-3 items-end bg-gray-100  dark:bg-black dark:text-white">
                          <div class="col-span-3">{{ $t('roomType') }}</div>
                          <div class="col-span-2">{{ $t('configuration.rates.rateType') }}</div>
                          <div class="col-span-2">{{ $t('Room') }}</div>
                          <div class="col-span-1">{{ $t('Adult') }}</div>
                          <div class="col-span-1">{{ $t('child') }}</div>
                          <div class="col-span-2">{{ $t('rate') }} (XAF)</div>
                        </div>
                        <div v-for="(room, index) in roomConfigurations" :key="room.id" class="">
                          <!-- Room Configuration Fields -->
                          <div class="grid md:grid-cols-12 grid-cols-12 gap-1 items-end ">
                            <div class="relative col-span-3">
                              <p v-if="isRoomTypeInvalid(room)" class="text-sm text-red-600 mb-1">
                                {{ $t('validation.invalidRoomType') }}
                              </p>
                              <AutoCompleteSelect v-model="room.roomType" :options="RoomTypes"
                                :defaultValue="$t('SelectRoomType')" :is-required="false"
                                :use-dropdown="useDropdownRoomType" :disabled="isLoadingRoom"
                                @update:modelValue="onRoomTypeChange(room.id, $event)"
                                @clear-error="emits('clear-error')"
                                :class="{ 'border-red-500': isRoomTypeInvalid(room) }" />
                            </div>

                            <div class="relative col-span-2">
                              <p v-if="isRateTypeInvalid(room)" class="text-sm text-red-600 mb-1">
                                {{ $t('validation.invalidRateType') }}
                              </p>
                              <AutoCompleteSelect v-model="room.rateType" :options="getRateTypesForRoom(room.id)"
                                :defaultValue="$t('SelectRateType')" :is-required="false"
                                :use-dropdown="useDropdownRateType" :disabled="!room.roomType"
                                @update:modelValue="onRateTypeChange(room.id, $event)"
                                @clear-error="emits('clear-error')"
                                :class="{ 'border-red-500': isRateTypeInvalid(room) }" />
                            </div>

                            <div class="relative col-span-2">
                              <p v-if="isRoomNumberInvalid(room)" class="text-sm text-red-600 mb-1">
                                {{ $t('invalidRoomNumber') }}
                              </p>
                              <AutoCompleteSelect v-model="room.roomNumber" :options="getRoomsForRoom(room.id)"
                                :defaultValue="$t('SelectRoom')" :is-required="false" :use-dropdown="useDropdownRoom"
                                :disabled="!room.roomType" :isLoading="room.isLoadingRooms"
                                @update:modelValue="onRoomNumberChange(room)" @clear-error="emits('clear-error')"
                                :class="{ 'border-red-500': isRoomNumberInvalid(room) }" />
                            </div>

                            <!-- Adult Count avec gestion des changements -->
                            <div class="col-span-1">
                               <Select
                                v-model="room.adultCount"
                                :options="getAdultOptions(room.roomType)"
                                :disabled="!room.roomType"
                                :placeholder="$t('1')"
                                @change="onOccupancyChange(room.id, 'adultCount', $event)"
                                custom-class=""
                              />
                            </div>

                            <!-- Child Count avec gestion des changements -->
                            <div class="col-span-1">

                              <Select
                                v-model="room.childCount"
                                :options="getChildOptions(room.roomType)"
                                :disabled="!room.roomType"
                                :placeholder="$t('0')"
                                @change="onOccupancyChange(room.id, 'childCount', $event)"
                              />
                            </div>

                            <!-- Rate Display avec détails -->
                            <div class="flex align-center self-center col-span-2">
                              <div class="relative inline-block w-full">

                                <div v-if="!isCustomPrize"
                                  class="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 mt-1.5 h-11 bg-gray-200 dark:bg-gray-900 px-4 py-2.5 text-sm dark:text-white/90"
                                  :class="{ 'opacity-50': room.isLoadingRate }">
                                  <span type="button" class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 mr-3"
                                    @click="isCustomPrize = true">
                                    <PencilLine :size="18" />
                                  </span>

                                  <!-- Indicateur de chargement du rate -->
                                  <div v-if="room.isLoadingRate" class="flex-grow flex justify-end items-end">
                                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2">
                                    </div>
                                  </div>

                                  <!-- Rate avec breakdown -->
                                  <div v-else class="flex-grow">
                                    <div class="font-medium text-gray-800 dark:text-gray-200 justify-end flex">
                                      {{ room.rate }}
                                    </div>
                                  </div>



                                  <div v-if="room.isOpen"
                                    class="absolute left-0 top-full mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white shadow-lg dark:bg-gray-900 z-20 max-h-48 overflow-auto">
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
                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-black/50 mt-1.5 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800" />
                                </div>
                              </div>

                            </div>

                              <div class="flex flex-col justify-center">

                                <button
                                  v-if="index === 0 && roomConfigurations.length > 1"
                                  @click="copyFirstRoomRate"
                                  type="button"
                                  class="inline-flex items-center justify-center w-8 h-8 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                  :title="$t('CopyRate')">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                  </svg>
                                </button>


                                <button
                                  v-if="index !== 0 && roomConfigurations.length > 1"
                                  @click="removeRoom(room.id)"
                                  type="button"
                                  class="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                  :title="$t('RemoveRoom')">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                          </div>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                       <div class="flex flex-wrap items-end gap-4">

                          <div class="flex-1">
                            <button @click="addRoom" type="button"
                              class="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 rounded-md text-sm font-normal hover:bg-orange-600 hover:text-white transition-colors">
                              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                              </svg>
                              {{ $t('AddRoom') }}
                            </button>
                          </div>


                          <div class="flex items-center justify-center translate-x-60">
                            <span class="text-md text-gray-950 dark:text-white font-bold">
                              {{ $t('Total') }}
                            </span>
                          </div>

                          <div class="flex-1 flex items-center justify-end mr-20">
                            <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {{ formatCurrency(totalAmount) }}
                            </span>
                          </div>
                        </div>


                    </section>
                    <section class="border-t border-gray-300 dark:border-gray-700 dark:bg-gray-800 pt-4 space-y-4" v-if="reservation.isHold">
                      <!-- Hold Release Date & Time Section -->
                      <div class="">
                        <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase mb-5">{{ $t('hold_release_date_time')
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
                              :placeholder="$t('select_time')" custom-class="rounded-lg"  />
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
                              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('days') }}</span>

                              <!-- Radio buttons -->
                              <div class="flex items-center space-x-4 ml-4">
                                <label class="flex items-center space-x-1 cursor-pointer">
                                  <input type="radio" v-model="holdReleaseData.dateType" value="hold_release_date"
                                    class="form-radio text-blue-600" />
                                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('hold_release_date') }}</span>
                                </label>
                                <label class="flex items-center space-x-1 cursor-pointer">
                                  <input type="radio" v-model="holdReleaseData.dateType" value="arrival_date"
                                    class="form-radio text-blue-600" />
                                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('arrival_date') }}</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <!-- Guest Information -->
                    <section class="border-t border-gray-300 dark:border-gray-700 dark:bg-gray-800 pt-2 space-y-4">

                     <div class="flex items-end w-full space-x-0">
                        <!-- Titre -->
                        <div class="w-20">
                          <Select
                            :lb="$t('Title')"
                            :options="GuestTitles"
                            v-model="formData.title"
                            :default-value="$t('guestTitles.mr')"
                            custom-class="rounded-r-none h-11 w-full"
                          />
                        </div>

                        <!-- Recherche client -->
                        <div class="w-[110px]">
                          <CustomerSearch
                            @customer-selected="onCustomerSelected"
                            v-model="formData"

                          />
                        </div>

                        <!-- Nom -->
                        <div class="w-[110px]">
                          <Input
                            :lb="$t('LastName')"
                            v-model="formData.lastName"
                            :placeholder="$t('LastName')"
                            custom-class="rounded-none h-11 border-l-0 w-full"
                          />
                        </div>

                        <!-- Nom de jeune fille -->
                        <div class="w-[110px]">
                          <Input
                            :lb="$t('MaidenName')"
                            v-model="formData.maidenName"
                            :placeholder="$t('MaidenName')"
                            custom-class="rounded-l-none h-11 border-l-0 w-full"
                          />
                        </div>

                        <!-- Email -->
                        <div class="flex-1 ml-2">
                          <InputEmail
                            v-model="formData.email"
                            placeholder="info@gmail.com"
                            :title="$t('Email')"
                            required
                            custom-class=" h-11  w-full"
                          />
                        </div>

                        <!-- Téléphone -->
                        <div class="flex-1  ml-2">
                          <InputPhone
                            :title="$t('Phone')"
                            v-model="formData.phoneNumber"
                            :id="'phone'"
                            :is-required="false"
                            custom-class="rounded-l-none h-11 border-l-0 w-full"
                          />
                        </div>
                      </div>

                      <div :class="[
                        'grid grid-cols-1 gap-4',
                        formData.contactType ? 'sm:grid-cols-2' : 'sm:grid-cols-2'
                      ]">


                        <AutoCompleteSelect
                            v-model="formData.contactType"
                            :options="TypesOfContact"
                            :defaultValue="$t('contact_type')"
                            :lb="$t('contact_type')"
                            :is-required="false"
                            :use-dropdown="useDropdownBooking"
                            @clear-error="emits('clear-error')"
                            custom-class="h-11"
                          />

                          <div v-if="formData.contactType">
                            <InputPhone
                              v-if="contactInputComponent === 'InputPhone'"
                              :title="contactInputLabel"
                              v-model="contactValue"
                              :id="'contact-input'"
                              :is-required="false"
                              custom-class="h-11"
                            />

                            <InputEmail
                              v-else-if="contactInputComponent === 'InputEmail'"
                              v-model="contactValue"
                              :placeholder="contactInputLabel"
                              :title="contactInputLabel"
                              custom-class="h-11"
                            />

                            <Input
                              v-else-if="contactInputComponent === 'Input'"
                              :lb="contactInputLabel"
                              v-model="contactValue"
                              :placeholder="contactInputLabel"
                              custom-class="h-11"
                            />
                        </div>
                        </div>
                    </section>

                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-4 sm:px-6">
            <div class="flex justify-between  space-x-3">
               <BasicButton  v-if="!showCheckinButton && !pendingReservation" type="button" @click="gotoNew"
                 :disabled="isLoading" variant=""
                :label="$t('more_options')">
              </BasicButton>
              <BasicButton v-if="showCheckinButton && !pendingReservation" type="button" @click="handleCheckIn"
                :loading="isLoading" :disabled="isLoading" variant="info"
                :label="isGroupReservation ? $t('Check-In') : $t('Quick Check-In')">
              </BasicButton>
              <BasicButton v-if="!confirmReservation" variant="success" :loading="isLoading" type="submit"
                @click="handleSubmit()" :disabled="isLoading || hasPendingUploads"
                :label="hasPendingUploads ? $t('UploadingImages') : $t('Confirm')">
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
