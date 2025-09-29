<script setup lang="ts">
import {
  ArrowLeft,
  Building2Icon,
  CheckCircle,
  CreditCard,
  Calendar,
  ArrowUpDown,
  StopCircle,
  List,
  X,
  Eye,
  Trash2,
  UserMinus,
  Users,
} from 'lucide-vue-next'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

// Define props to accept the id from the router
const props = defineProps<{
  id: string
}>()

import { useI18n } from 'vue-i18n'
import FoglioOperation from '../../../components/reservations/foglio/FoglioOperation.vue'
import RoomCharge from '../../../components/reservations/roomcharge/RoomCharge.vue'
import ButtonDropdown from '../../../components/common/ButtonDropdown.vue'
import BookingDetails from '../../../components/reservations/bookingdetails/BookingDetails.vue'
import router from '../../../router'
import { getReservationDetailsById } from '../../../services/api'
import AdminLayout from '../../../components/layout/AdminLayout.vue'
import Adult from '../../../icons/Adult.vue'
import Child from '../../../icons/Child.vue'
import {  formatTimeFromTimeString } from '../../../components/utilities/UtilitiesFunction'
import GuestDetails from '../../../components/reservations/GuestDetails.vue'
import Spinner from '../../../components/spinner/Spinner.vue'
import ReservationDetailsSkeleton from '../../../components/skeletons/ReservationDetailsSkeleton.vue'
import {
  useReservation,
  type CheckInReservationPayload,
  type CheckOutReservationPayload,
} from '../../../composables/useReservation'
// Lazy load modal components for better code splitting
const AddPaymentModal = defineAsyncComponent(() => import('../../../components/reservations/foglio/AddPaymentModal.vue'))
const CancelReservation = defineAsyncComponent(() => import('../../../components/reservations/foglio/CancelReseravtion.vue'))
import PrintModal from '../../../components/common/PrintModal.vue'
const BookingConfirmationTemplate = defineAsyncComponent(() => import('../../../components/common/templates/BookingConfirmationTemplate.vue'))
import { useServiceStore } from '../../../composables/serviceStore'
const NoShowReservation = defineAsyncComponent(() => import('../../../components/reservations/foglio/NoShowReservation.vue'))
import AuditTrail from '../../../components/audit/AuditTrail.vue'
import ReservationStatus from '../../../components/common/ReservationStatus.vue'
import AssignRoomReservation from '../../../components/reservations/AssignRoomReservation.vue'
const VoidReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/VoidReservation.vue'))
const AmendStay = defineAsyncComponent(() => import('@/components/reservations/foglio/AmendStay.vue'))
const CheckInReservation = defineAsyncComponent(() => import('@/components/reservations/CheckInReservation.vue'))
const CheckOutReservation = defineAsyncComponent(() => import('@/components/reservations/CheckOutReservation.vue'))
const UnAssignRoomReservation = defineAsyncComponent(() => import('@/components/reservations/UnAssignRoomReservation.vue'))

const isAddPaymentModalOpen = ref(false)
const showCancelModal = ref(false)
const showNoShowModal = ref(false)
const showPrintModal = ref(false)
const { t } = useI18n()
const reservation = ref<any>({})
const isLoading = ref(false)
const showAmendModal = ref(false)
const showVoidModal = ref(false)
const isCkeckOutModalOpen = ref(false)
const isCkeckInModalOpen = ref(false)
// Use the reservation composable
const {
  isCheckingIn,
  isCheckingOut,
  performCheckIn,
  performCheckOut,
} = useReservation()
const tabs = computed(() => [
  { id: 'folio_operations', label: t('Folio Operations') },
  { id: 'booking_details', label: t('Booking Details') },
  { id: 'guest_details', label: t('Guest Details') },
  { id: 'room_charges', label: t('Room Charges') },
  { id: 'audit_trial', label: t('Audit Trail') },
])
const activeTab = ref<string>('folio_operations')
interface Emits {
  (e: 'close'): void
  (e: 'save', data?: any): void
}

const emit = defineEmits<Emits>()

// Icon mapping for different actions
const actionIconMap = {
  check_in: CheckCircle,
  check_out: CheckCircle,
  add_payment: CreditCard,
  amend_stay: Calendar,
  room_move: ArrowUpDown,
  exchange_room: ArrowUpDown,
  stop_room_move: StopCircle,
  inclusion_list: List,
  cancel_reservation: X,
  no_show: Eye,
  void_reservation: Trash2,
  unassign_room: UserMinus,
}

// Color mapping for different actions
const actionColorMap = {
  check_in: 'text-blue-600',
  check_out: 'text-green-600',
  add_payment: 'text-green-600',
  amend_stay: 'text-purple-600',
  room_move: 'text-orange-600',
  exchange_room: 'text-indigo-600',
  stop_room_move: 'text-red-600',
  inclusion_list: 'text-gray-600',
  cancel_reservation: 'text-red-600',
  no_show: 'text-yellow-600',
  void_reservation: 'text-red-700',
  unassign_room: 'text-gray-600',
}

const dropdownOptions = computed(() => {
  // If reservation is voided, disable all actions
  if (reservation.value?.status === 'voided') {
    return []
  }

  if (!reservation.value?.availableActions) {
    return []
  }

  return reservation.value.availableActions
    .filter((action: any) => action.available)
    .map((action: any) => ({
      id: action.action,
      label: action.label,
      description: action.description,
      route: action.route,
      icon: actionIconMap[action.action as keyof typeof actionIconMap] || List,
      color: actionColorMap[action.action as keyof typeof actionColorMap] || 'text-gray-600',
    }))
})
const checkInRerservation = async () => {
  const payload: CheckInReservationPayload = {
    reservationRooms: reservation.value?.reservationRooms.map((e: any) => {
      return e.id
    }),
    actualCheckInTime: new Date().toISOString(),
    notes: '',
    keyCardsIssued: 0,
    depositAmount: 0,
  }

  await performCheckIn(reservation.value.id, payload, getBookingDetailsById)
}
const handleOptionSelected = (option: any) => {
  console.log('Selected option:', option)

  // Handle routing if route is provided
  if (option.route) {
    // You can implement navigation logic here
    // For example: router.push(option.route)
    console.log('Navigate to:', option.route)
  }

  // Add specific logic for different actions
  switch (option.id) {
    case 'check_in':

      if (reservation.value.reservationRooms && reservation.value.reservationRooms.length > 1) {
        openCheckInReservationModal()
      } else {
        checkInRerservation()

      }
      break
    case 'check_out':
      if (reservation.value.reservationRooms && reservation.value.reservationRooms.length > 1) {
        openCheckOutReservationModal()
      } else {
        handleCheckOut()
      }
      break
    case 'add_payment':
      isAddPaymentModalOpen.value = true
      break
    case 'amend_stay':
      showAmendModal.value = true
      break
    case 'room_move':
      handleRoomMove()
      break
    case 'exchange_room':
      handleExchangeRoom()
      break
    case 'stop_room_move':
      handleStopRoomMove()
      break
    case 'inclusion_list':
      handleUpdateInclusionList()
      break
    case 'cancel_reservation':
      handleCancelReservation()
      break
    case 'no_show':
      showNoShowModal.value = true
      break
    case 'void_reservation':
      showVoidModal.value = true
      break
    case 'unassign_room':
      openUnAssignReservationModal()
      break
    case 'print':
      showPrintModal.value = true
      break
    default:
      console.log('Action not implemented:', option.id)
  }
}
const getBookingDetailsById = async () => {
  isLoading.value = true
  const response = await getReservationDetailsById(Number(props.id))
  console.log('reservation resuolt', reservation)
  if (response.status === 200) {
    reservation.value = response.data
  }
  isLoading.value = false
}
// Computed property to calculate room/rate type summary
const roomRateTypeSummary = computed(() => {
  if (!reservation.value?.reservationRooms || reservation.value.reservationRooms.length === 0) {
    return 'N/A'
  }

  const reservationRooms = reservation.value.reservationRooms
  console.log('reservationRooms', reservationRooms)
  // Get room numbers and create summary
  const roomNumbers = reservationRooms.map((room: any) => {
    return `${room.room?.roomNumber} -${room?.roomType?.roomTypeName} / ${room?.roomRates?.rateType?.rateTypeName} `
  })

  return roomNumbers[0]
})
const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
}
const handleSavePayment = async () => {
  getBookingDetailsById()
  isAddPaymentModalOpen.value = false
}

// Handler functions for different reservation operations
const handleCheckOut = async () => {
  const play: CheckOutReservationPayload = {
    reservationRooms: reservation.value?.reservationRooms.map((e: any) => {
      return e.id
    }),
    actualCheckOutTime: new Date().toISOString(),
  }
  performCheckOut(reservation.value.id, play, getBookingDetailsById)
}


const handleAmendConfirmed = () => {
  const id = router.currentRoute.value.params.id
  showAmendModal.value = false
  // Emit save event to notify parent components
  emit('save', { action: 'amend', reservationId: id })
}

const handleRoomMove = async () => {
  const payload = {
    fromRoomId: reservation.value.reservationRooms[0]?.room?.id,
    toRoomId: null, // This should be selected by user in a modal
    moveDate: new Date().toISOString(),
    reason: 'Guest requested room change',
    notes: '',
  }

  // TODO: Implement room selection modal
  console.log('Room move requires room selection modal')
  // await moveRoom(reservation.value.id, payload, getBookingDetailsById);
}
const handleExchangeRoom = async () => {
  const payload = {
    roomId1: reservation.value.reservationRooms[0]?.room?.id,
    roomId2: null, // This should be selected by user
    exchangeDate: new Date().toISOString(),
    reason: 'Room exchange requested',
    notes: '',
  }

  // TODO: Implement room selection modal
  console.log('Room exchange requires room selection modal')
  // await exchangeRoom(reservation.value.id, payload, getBookingDetailsById);
}

const handleStopRoomMove = async () => {
  const payload = {
    moveId: null, // This should be the active move ID
    reason: 'Move cancelled',
    notes: '',
  }
}

const handleUpdateInclusionList = async () => {
  const payload = {
    inclusions: [], // This should be selected by user
    effectiveDate: new Date().toISOString(),
    notes: '',
  }

  // TODO: Implement inclusion selection modal
  console.log('Inclusion list update requires selection modal')
  // await updateInclusionList(reservation.value.id, payload, getBookingDetailsById);
}

const handleCancelReservation = async () => {
  showCancelModal.value = true
}

const handleCancelConfirmed = async (cancelData: any) => {
  showCancelModal.value = false
  const payload = {
    cancellationReason: cancelData.reason || 'Guest requested cancellation',
    cancellationDate: new Date().toISOString(),
    refundAmount: cancelData.cancellationFee || 0,
    notes: cancelData.notes || '',
  }
}

const handleNoShowConfirmed = async (noshowData: any) => {
  showNoShowModal.value = false
}
const handleCheckInSuccess = () => {
  isCkeckInModalOpen.value = false;
  getBookingDetailsById()
}

const isUnAssignModalOpen = ref(false)

const openUnAssignReservationModal = () => {
  isUnAssignModalOpen.value = true
}

const closeUnAssignReservationModal = () => {
  isUnAssignModalOpen.value = false
}

const handleVoidConfirmed = () => {
  const id = router.currentRoute.value.params.id
  showVoidModal.value = false
  // Emit save event to notify parent components
  emit('save', { action: 'void', reservationId: id })
}
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('en', options)
}

const openCheckOutReservationModal = () => {
  isCkeckOutModalOpen.value = true
}

const closeCheckOutReservationModal = () => {
  isCkeckOutModalOpen.value = false
}

const openCheckInReservationModal = () => {
  isCkeckInModalOpen.value = true
}

const closeCheckInReservationModal = () => {
  isCkeckInModalOpen.value = false
}

// Print modal handlers
const handlePrintClose = () => {
  showPrintModal.value = false
}

const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

const canCheckIn = computed(() => {
  const date = new Date()
  const dStr = date.toISOString().split('T')[0]
  return reservation.value.checkInDate.startsWith(dStr) && reservation.value.status === 'confirmed'
})

const canCheckout = computed(() => {
  const date = new Date()
  const dStr = date.toISOString().split('T')[0]
  return (
    reservation.value.departDate <= dStr &&
    (reservation.value.status === 'checked-in' || reservation.value.status === 'checked_in')
  )
})
const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}
const templates = ref([
  {
    id: '1',
    name: 'Reservation',
    description: 'Reservation template',
    component: BookingConfirmationTemplate,
  },
])
// Computed property for print document data
const printDocumentData = computed(() => {
  if (!reservation.value) return null

  return {
    type: 'reservation',
    reservation: {
      id: reservation.value.id,
      reservationNumber: reservation.value.reservationNumber,
      status: reservation.value.status,
      arrivalDate: reservation.value.arrivalDate,
      departureDate: reservation.value.departureDate,
      nights: reservation.value.nights,
      adults: reservation.value.adults,
      children: reservation.value.children,
    },
    guest: {
      firstName: reservation.value.guest?.firstName,
      lastName: reservation.value.guest?.lastName,
      email: reservation.value.guest?.email,
      phone: reservation.value.guest?.phone,
    },
    rooms:
      reservation.value.reservationRooms?.map((room: any) => ({
        roomNumber: room.room?.roomNumber,
        roomType: room.room?.roomType?.name,
        rate: room.rate,
      })) || [],
    financial: {
      totalAmount: reservation.value.totalAmount,
      paidAmount: reservation.value.paidAmount,
      balance: reservation.value.balance,
    },
  }
})
const refresReservation = async () => {
  const response = await getReservationDetailsById(Number(props.id))
  if (response.status === 200) {
    reservation.value = response.data
  }
}
onMounted(() => {
  getBookingDetailsById()
})
</script>

<template>
  <AdminLayout>
    <!-- Show skeleton loading when data is being fetched -->
    <ReservationDetailsSkeleton v-if="isLoading" />

    <!-- Show actual content when data is loaded -->
    <div class="h-full" v-else-if="reservation && reservation.id"
      :class="{ 'void-status': reservation.status === 'voided' }">
      <!--Header-->
      <div class="shadow-sm px-4 py-2 mx-4 bg-white flex justify-between">
        <div class="flex gap-2 align-middle self-center items-center">
          <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
          <Building2Icon class="text-primary"></Building2Icon>
          <Users v-if="reservation.reservationRooms.length > 1" />
          <span class="font-bold">{{ reservation.guest?.displayName }}</span>
          <div class="flex">
            <Adult class="w-5" />
            <span class="text-sm items-end align-center self-center pt-2">{{
              reservation.adults ?? 0
              }}</span>
          </div>
          <div class="flex">
            <Child class="w-4" />
            <span class="text-sm items-end align-bottom self-center pt-2">{{
              reservation.child ?? 0
              }}</span>
          </div>
          <div class="flex gap-8 ms-10">
            <!--arrival Days-->
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('booking.arrival') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ formatDate(reservation.arrivedDate) }}, {{ formatTimeFromTimeString(reservation.checkInTime)
                  }}</span>
                <!--<span>
                  <PencilIcon class="w-3" />
                </span>-->
              </span>
            </div>
            <!--depature-->
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('booking.departure') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ formatDate(reservation.departDate) }}, {{ formatTimeFromTimeString(reservation.checkOutTime)
                  }}</span>
                <!-- <span>
                  <PencilIcon class="w-3" />
                </span>-->
              </span>
            </div>
            <!--Nigth-->
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('nights') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ reservation.nights ?? reservation.numberOfNights }}</span>
              </span>
            </div>
            <!--room/roomtype-->
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('Room/Rate types') }}</span>
              <span class="text-xs flex gap-2 flex-col"
                v-if="reservation.reservationRooms.length > 0 && reservation.reservationRooms.every((room: any) => room.room?.id)">
                <span>{{ roomRateTypeSummary }}</span>
              </span>
              <AssignRoomReservation :reservation="reservation"
                v-if="reservation.reservationRooms.length === 0 || reservation.reservationRooms.some((room: any) => !room.room?.id)" />
            </div>
            <!--depature-->
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('res.no') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ reservation.reservationNumber }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-x-2 h-full align-middle self-center items-center justify-center">
          <ReservationStatus :status="reservation.status" />
          <button @click="checkInRerservation" :disabled="isCheckingIn" v-if="canCheckIn"
            class="bg-green-600 rounded-lg text-white px-4 py-2 align-middle text-sm items-center self-center flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
            <Spinner v-if="isCheckingIn" class="w-4 h-4" />
            <span>{{ isCheckingIn ? $t('processing') || 'Processing...' : $t('check in') }}</span>
          </button>
          <button @click="handleCheckOut" :disabled="isCheckingOut" v-if="canCheckout"
            class="bg-red-600 rounded-lg text-white px-4 py-2 align-middle text-sm items-center self-center flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
            <Spinner v-if="isCheckingOut" class="w-4 h-4" />
            <span>{{ isCheckingOut ? $t('processing') || 'Processing...' : $t('check out') }}</span>
          </button>
        </div>
      </div>
      <!--main-->
      <div class="shadow-sm px-2 pt-1 mx-4 bg-white mt-5 flex justify-between">
        <!-- Tabs Navigation -->
        <div class="flex justify-between w-full">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6">
              <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]">
                <div class="flex items-center space-x-2">
                  <span>{{ tab.label }}</span>
                </div>
              </button>
            </nav>
          </div>
          <div class="align-middle self-center items-center">
            <ButtonDropdown :options="dropdownOptions" :button-text="$t('Options')"
              button-class="bg-white text-primary border-primary hover:bg-primary/25" dropdown-class="w-64"
              @option-selected="handleOptionSelected" />
          </div>
        </div>
      </div>
      <!--tab content-->
      <div v-if="activeTab === 'room_charges'">
        <RoomCharge :reservation-id="reservation.id" :reservation="reservation"></RoomCharge>
      </div>
      <div v-if="activeTab === 'folio_operations' && reservation && reservation.id">
        <FoglioOperation :reservation-id="reservation.id" :reservation="reservation" @refresh="refresReservation">
        </FoglioOperation>
      </div>
      <div v-if="activeTab === 'booking_details'">
        <BookingDetails :booking="reservation" :guest="reservation.guest"></BookingDetails>
      </div>
      <div v-if="activeTab === 'guest_details'">
        <GuestDetails :reservation="reservation" :guest="reservation.guest" :reservationId="reservation.id" />
      </div>
      <div v-if="activeTab === 'audit_trial'">
        <AuditTrail :entity-ids="[reservation.id]" />
      </div>
    </div>

    <!-- Show message when no reservation data is found -->
    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center">
        <p class="text-gray-500 text-lg">{{ $t('No reservation found') }}</p>
      </div>
    </div>
  </AdminLayout>
  <template v-if="isAddPaymentModalOpen">
    <AddPaymentModal :reservation-id="reservation.id" :is-open="isAddPaymentModalOpen" @close="closeAddPaymentModal"
      @save="handleSavePayment" />
  </template>
  <template v-if="showCancelModal">
    <CancelReservation :is-open="showCancelModal" :reservation-data="reservation" @close="showCancelModal = false"
      @cancel-confirmed="handleCancelConfirmed" />
  </template>
  <template v-if="showVoidModal">
    <VoidReservation :is-open="showVoidModal" :reservation-data="reservation" @close="showVoidModal = false"
      :reservation-id="reservation.id" :reservation-number="reservation.reservationNumber"
      @void-confirmed="handleVoidConfirmed" />
  </template>
  <template v-if="showAmendModal">
    <AmendStay :is-open="showAmendModal" :reservation-data="reservation" @close="showAmendModal = false"
      :reservation-id="reservation.id" :reservation-number="reservation.reservationNumber"
      @amend-confirmed="handleAmendConfirmed" :reservation="reservation" />
  </template>
  <!-- NoShow Reservation Modal -->
  <template v-if="showNoShowModal">
    <NoShowReservation :is-open="showNoShowModal" :reservation-id="reservation.id" @close="showNoShowModal = false"
      @noshow-confirmed="handleNoShowConfirmed" />
  </template>

  <!--check out template-->
  <template v-if="isCkeckOutModalOpen">
    <CheckOutReservation :reservation-id="reservation.id" :is-open="isCkeckOutModalOpen"
      @close="closeCheckOutReservationModal" />
  </template>

  <!--check in template-->
  <template v-if="isCkeckInModalOpen">
    <CheckInReservation :reservation-id="reservation.id" :is-open="isCkeckInModalOpen" @success="handleCheckInSuccess"
      @close="closeCheckInReservationModal" />
  </template>

  <!--unassign template-->
  <template v-if="isUnAssignModalOpen">
    <UnAssignRoomReservation :reservation-id="reservation.id" :is-open="isUnAssignModalOpen"
      @close="closeUnAssignReservationModal" />
  </template>
  <!-- Print Modal -->
  <template v-if="showPrintModal">
    <PrintModal :is-open="showPrintModal" :document-data="printDocumentData" @close="handlePrintClose"
      :reservation-id="reservation.id" @print-success="handlePrintSuccess" @print-error="handlePrintError"
      :templates="templates" />
  </template>
</template>

<style></style>
