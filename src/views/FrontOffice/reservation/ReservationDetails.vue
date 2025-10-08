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
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'

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
import { formatTimeFromTimeString } from '../../../components/utilities/UtilitiesFunction'
import GuestDetails from '../../../components/reservations/GuestDetails.vue'
import ReservationDetailsSkeleton from '../../../components/skeletons/ReservationDetailsSkeleton.vue'
import {
  useReservation,
  type CheckInReservationPayload,
  type CheckOutReservationPayload,
} from '../../../composables/useReservation'

const AddPaymentModal = defineAsyncComponent(() => import('../../../components/reservations/foglio/AddPaymentModal.vue'))
const CancelReservation = defineAsyncComponent(() => import('../../../components/reservations/foglio/CancelReseravtion.vue'))
import PrintModal from '../../../components/common/PrintModal.vue'
const BookingConfirmationTemplate = defineAsyncComponent(() => import('../../../components/common/templates/BookingConfirmationTemplate.vue'))
const NoShowReservation = defineAsyncComponent(() => import('../../../components/reservations/foglio/NoShowReservation.vue'))
import AuditTrail from '../../../components/audit/AuditTrail.vue'
import ReservationStatus from '../../../components/common/ReservationStatus.vue'
import AssignRoomReservation from '../../../components/reservations/AssignRoomReservation.vue'
const VoidReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/VoidReservation.vue'))
const AmendStay = defineAsyncComponent(() => import('@/components/reservations/foglio/AmendStay.vue'))
const CheckInReservation = defineAsyncComponent(() => import('@/components/reservations/CheckInReservation.vue'))
const CheckOutReservation = defineAsyncComponent(() => import('@/components/reservations/CheckOutReservation.vue'))
const UnAssignRoomReservation = defineAsyncComponent(() => import('@/components/reservations/UnAssignRoomReservation.vue'))
const ExchangeRoomModal = defineAsyncComponent(() => import('@/components/reservations/ExchangeRoomModal.vue'))
const RoomMoveModal = defineAsyncComponent(() => import('@/components/modal/RoomMoveModal.vue'))
import { useToast } from 'vue-toastification'
import { confirmBooking } from '@/services/reservation';

// États des modals
const isAddPaymentModalOpen = ref(false)
const showCancelModal = ref(false)
const showNoShowModal = ref(false)
const showPrintModal = ref(false)
const showAmendModal = ref(false)
const showVoidModal = ref(false)
const isCkeckOutModalOpen = ref(false)
const isCkeckInModalOpen = ref(false)
const isExchangeRoomModalOpen = ref(false)
const isRoomMoveModalOpen = ref(false)
const isUnAssignModalOpen = ref(false)
const isPending = ref(false)

const { t } = useI18n()
const toast = useToast()

// ====== NOUVELLE APPROCHE : État local réactif ======
const localReservation = ref<any>({})
const isLoading = ref(false)

// Use the reservation composable
const {
  isCheckingIn,
  isCheckingOut,
  performCheckIn,
  performCheckOut,
} = useReservation()
 const { performAvhe: avheReservation } = useReservation()

const tabs = computed(() => [
  { id: 'folio_operations', label: t('Folio Operations') },
  { id: 'booking_details', label: t('Booking Details') },
  { id: 'guest_details', label: t('Guest Details') },
  { id: 'room_charges', label: t('Room Charges') },
  { id: 'audit_trial', label: t('Audit Trail') },
])
const activeTab = ref<string>('folio_operations')

// ====== FONCTION CLÉ : Mise à jour locale ======
const updateLocalReservation = (updates: any) => {
  console.log('Updating reservation with:', updates)
  localReservation.value = {
    ...localReservation.value,
    ...updates
  }
  console.log('Updated reservation:', localReservation.value)
}

// ====== FONCTION : Rafraîchir uniquement les actions disponibles ======
const refreshAvailableActions = async () => {
  try {
    const response = await getReservationDetailsById(Number(props.id))
    if (response.status === 200) {
      updateLocalReservation({
        availableActions: response.data.availableActions,
        status: response.data.status,
        balanceSummary: response.data.balanceSummary
      })
    }
  } catch (error) {
    console.error('Error refreshing available actions:', error)
    toast.error(t('Error refreshing reservation data'))
  }
}

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
  if (localReservation.value?.status === 'voided') {
    return []
  }

  if (!localReservation.value?.availableActions) {
    return []
  }

  return localReservation.value.availableActions
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

// ====== GESTION DES ACTIONS ======
const currentAction = ref<string | null>(null)
const isPerformingAction = computed(() => currentAction.value !== null)

const executeAction = async (
  actionId: string,
  actionFn: () => Promise<void>,
  loadingMessage?: string,
  successMessage?: string
) => {
  if (isPerformingAction.value) return

  try {
    currentAction.value = actionId
    if (loadingMessage) {
      toast.info(loadingMessage, { timeout: 2000, hideProgressBar: false })
    }

    await actionFn()
    currentAction.value = null

    if (successMessage) {
      toast.success(successMessage)
    }
  } catch (error: any) {
    console.error(`${actionId} error:`, error)
    const errorMessage = error.response?.data?.message || error.message || t(`Failed to ${actionId.replace('_', ' ')}`)
    toast.error(errorMessage)
    currentAction.value = null
  } finally {
    if (currentAction.value === actionId) {
      currentAction.value = null
    }
  }
}

// ====== UnAssign ======
const performAutoUnassign = async (availableRoom: any) => {
  try {
    const unassignDateTime = new Date().toISOString()
    const unassignPayload = {
      reservationRooms: [availableRoom.id],
      actualCheckInTime: unassignDateTime,
      notes: ''
    }


    await avheReservation(localReservation.value.id, unassignPayload)

    // Mettre à jour les données locales après le unassign
    const updatedRooms = localReservation.value.reservationRooms.map((room: any) => {
      if (room.id === availableRoom.id) {
        return {
          ...room,
          roomId: null,
          room: null,
          status: 'reserved'
        }
      }
      return room
    })

    updateLocalReservation({
      reservationRooms: updatedRooms
    })



    await refreshAvailableActions()


  } catch (error) {
    console.error('Unassign error:', error)
  }
}

// ====== CHECK-IN ======

const performAutoCheckIn = async (availableRoom: any) => {
  const checkInDateTime = new Date().toISOString()
  const checkInPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckInTime: checkInDateTime,
    notes: '',
    keyCardsIssued: 2,
    depositAmount: 0
  }

  await performCheckIn(localReservation.value.id, checkInPayload)

  // Mettre à jour les données locales après le check-in
  const updatedRooms = localReservation.value.reservationRooms.map((room: any) => {
    if (room.id === availableRoom.id) {
      return {
        ...room,
        status: 'checked_in',
        actualCheckInTime: checkInDateTime,
        checkedIn: true
      }
    }
    return room
  })

  // Vérifier si toutes les chambres sont check-in pour mettre à jour le statut de la réservation
  const allRoomsCheckedIn = updatedRooms.every((room: any) => room.status === 'checked_in')
  const reservationStatus = allRoomsCheckedIn ? 'checked_in' : localReservation.value.status

  updateLocalReservation({
    reservationRooms: updatedRooms,
    status: reservationStatus
  })

    await refreshAvailableActions()
}

const handleCheckInSuccess = async (data: any) => {
  const updatedRooms = localReservation.value.reservationRooms.map((room: any) => {
    if (data.updatedRooms.includes(room.id)) {
      return {
        ...room,
        status: 'checked_in',
        actualCheckInTime: data.checkInDateTime,
        checkedIn: true
      }
    }
    return room
  })

  const allRoomsCheckedIn = updatedRooms.every((room: any) => room.status === 'checked_in')

  updateLocalReservation({
    reservationRooms: updatedRooms,
    status: allRoomsCheckedIn ? 'checked_in' : localReservation.value.status
  })

  isCkeckInModalOpen.value = false
  await refreshAvailableActions()
}

// ====== CHECK-OUT ======

const performAutoCheckOut = async (availableRoom: any) => {
  const checkOutDateTime = new Date().toISOString()
  const checkOutPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckOutTime: checkOutDateTime,
    notes: '',
  }

  await performCheckOut(localReservation.value.id, checkOutPayload)

  // Mettre à jour les données locales après le check-out
  const updatedRooms = localReservation.value.reservationRooms.map((room: any) => {
    if (room.id === availableRoom.id) {
      return {
        ...room,
        status: 'checked_out',
        actualCheckOutTime: checkOutDateTime
      }
    }
    return room
  })

  // Vérifier si toutes les chambres sont check-out pour mettre à jour le statut de la réservation
  const allRoomsCheckedOut = updatedRooms.every((room: any) => room.status === 'checked_out')
  const reservationStatus = allRoomsCheckedOut ? 'checked_out' : localReservation.value.status

  updateLocalReservation({
    reservationRooms: updatedRooms,
    status: reservationStatus
  })

   await refreshAvailableActions()
}


const handleCheckOutSuccess = async (data: any) => {
  const updatedRooms = localReservation.value.reservationRooms.map((room: any) => {
    if (data.updatedRooms.includes(room.id)) {
      return {
        ...room,
        status: 'checked_out',
        actualCheckOutTime: data.checkOutDateTime,
        checkedOut: true
      }
    }
    return room
  })

  const allRoomsCheckedOut = updatedRooms.every((room: any) => room.status === 'checked_out')

  updateLocalReservation({
    reservationRooms: updatedRooms,
    status: allRoomsCheckedOut ? 'checked_out' : localReservation.value.status
  })

  isCkeckOutModalOpen.value = false
  await refreshAvailableActions()
}

// ====== PAYMENT ======
const handleSavePayment = async (data: any) => {
  closeAddPaymentModal()

  try {
    let updates: any = {}

    if (data.reservation && data.reservation.balanceSummary) {
      updates = {
        balanceSummary: data.reservation.balanceSummary,
        totalAmount: data.reservation.totalAmount,
        paidAmount: data.reservation.paidAmount,
        remainingAmount: data.reservation.remainingAmount
      }
    } else if (data.balanceSummary) {
      updates.balanceSummary = data.balanceSummary
    } else if (data.payment && data.payment.amount) {
      const currentBalance = localReservation.value.balanceSummary || {
        totalChargesWithTaxes: 0,
        totalPayments: 0,
        outstandingBalance: 0
      }

      const paymentAmount = parseFloat(data.payment.amount.toString())
      const newTotalPayments = (currentBalance.totalPayments || 0) + paymentAmount
      const newOutstandingBalance = (currentBalance.totalChargesWithTaxes || 0) - newTotalPayments

      updates.balanceSummary = {
        ...currentBalance,
        totalPayments: newTotalPayments,
        outstandingBalance: Math.max(0, newOutstandingBalance)
      }
    }

    if (Object.keys(updates).length > 0) {
      updateLocalReservation(updates)
      await refreshAvailableActions()
    }
  } catch (error) {
    console.error('Error updating payment display:', error)
    toast.error(t('Error updating payment display'))
  }
}

// ====== CANCEL ======
const handleCancelConfirmed = async (cancelData: any) => {
  showCancelModal.value = false
  updateLocalReservation({
    status: 'confirmed',
    availableActions: []
  })
  await refreshAvailableActions()
}

// ====== VOID ======
const handleVoidConfirmed = async (voidData: any) => {
  showVoidModal.value = false
  updateLocalReservation({
    status: 'voided',
    availableActions: []
  })
  await refreshAvailableActions()
}

// ====== AMEND ======
const handleAmendConfirmed = async (amendData: any) => {
  showAmendModal.value = false

  if (amendData.reservationRoomId) {
    const updatedRooms = localReservation.value.reservationRooms.map((room: any) => {
      if (room.id === amendData.reservationRoomId) {
        return {
          ...room,
          checkInDate: amendData.newArrivalDate,
          checkOutDate: amendData.newDepartureDate,
          nights: amendData.nights
        }
      }
      return room
    })

    updateLocalReservation({ reservationRooms: updatedRooms })
  } else {
    updateLocalReservation({
      arrivedDate: amendData.newArrivalDate,
      departDate: amendData.newDepartureDate,
      nights: amendData.nights,
      numberOfNights: amendData.nights
    })
  }

  await refreshAvailableActions()
}

// ====== NO SHOW ======
const handleNoShowConfirmed = async (noshowData: any) => {
  showNoShowModal.value = false
  updateLocalReservation({
    status: 'no_show',
    availableActions: []
  })
  await refreshAvailableActions()
}

// ====== UNASSIGN ======
const handleUnassignSuccess = async (data: any) => {
  const updatedRooms = localReservation.value.reservationRooms.map((room: any) => {
    if (data.reservationRooms.includes(room.id)) {
      return {
        ...room,
        roomId: null,
        room: null,
        status: 'reserved'
      }
    }
    return room
  })

  updateLocalReservation({ reservationRooms: updatedRooms })
  isUnAssignModalOpen.value = false
  await refreshAvailableActions()
}

// ====== ROOM ASSIGNMENT ======
const handleRoomAssignmentRefresh = async () => {

  await getBookingDetailsById()
}
const closeRoomMoveModal = async()=>{
isRoomMoveModalOpen.value = false
  await getBookingDetailsById()
}
const handleRoomMoveSuccess = ()=>{

}
const closeExchangeRoomModal = async()=>{
  isExchangeRoomModalOpen.value = false
  await getBookingDetailsById()

}
const handleExchangeSuccess = ()=>{

}
// ====== GESTION DES OPTIONS ======
const handleOptionSelected = async(option: any) => {
  console.log('Selected option:', option)

  switch (option.id) {
    case 'check_in':
     const availableRoomsForCheckin = localReservation.value.reservationRooms?.filter((room: any) =>
        !room.actualCheckInTime &&
        room.status !== 'checked_in' &&
        room.status !== 'occupied' &&
        !room.checkedIn
      ) || []

      if (availableRoomsForCheckin.length === 0) {
        toast.info(t('All rooms have already been checked in'))
        return
      } else if (availableRoomsForCheckin.length === 1) {
        // Check-in automatique avec feedback
        const roomNumber = availableRoomsForCheckin[0].room?.roomNumber || availableRoomsForCheckin[0].id
        console.log("roomNumber", roomNumber)
        await executeAction(
          'check_in',
          () => performAutoCheckIn(availableRoomsForCheckin[0])
        )
      } else {
              isCkeckInModalOpen.value = true
      }
      break
   case 'check_out':
      const availableRoomsForCheckout = localReservation.value.reservationRooms?.filter((room: any) =>
        room.status === 'checked_in'
      ) || []

      console.log('Available rooms for check-out:', availableRoomsForCheckout)

      if (availableRoomsForCheckout.length === 0) {
        toast.info(t('No rooms available for check-out'))
        return
      } else if (availableRoomsForCheckout.length === 1) {
        // Check-out automatique avec feedback pour une seule chambre
        const roomNumber = availableRoomsForCheckout[0].room?.roomNumber || availableRoomsForCheckout[0].id
        console.log("roomNumber checkout", roomNumber)

        await executeAction(
          'check_out',
          () => performAutoCheckOut(availableRoomsForCheckout[0])
        )
      } else {
        isCkeckOutModalOpen.value = true
      }
      break
    case 'add_payment':
      isAddPaymentModalOpen.value = true
      break
    case 'amend_stay':
      showAmendModal.value = true
      break
    case 'cancel_reservation':
      showCancelModal.value = true
      break
    case 'no_show':
      showNoShowModal.value = true
      break
    case 'void_reservation':
      showVoidModal.value = true
      break
    case 'unassign_room':
      const availableRoomsForUnassign = localReservation.value.reservationRooms?.filter((room: any) =>
        room.roomId && room.room?.roomNumber
      ) || []

      console.log('Available rooms for unassign:', availableRoomsForUnassign)

      if (availableRoomsForUnassign.length === 0) {
        toast.info(t('No rooms available for unassignment'))
        return
      } else if (availableRoomsForUnassign.length === 1) {
        // Unassign automatique pour une seule chambre
        const roomNumber = availableRoomsForUnassign[0].room?.roomNumber || availableRoomsForUnassign[0].id
        console.log("roomNumber unassign", roomNumber)

        await executeAction(
          'unassign_room',
          () => performAutoUnassign(availableRoomsForUnassign[0])
        )
      } else {

       isUnAssignModalOpen.value = true
      }
      break
    case 'print':
      showPrintModal.value = true
      break
    case 'room_move':
      isRoomMoveModalOpen.value = true
      break

    case 'exchange_room':
      isExchangeRoomModalOpen.value = true
      break
    default:
      console.log('Action not implemented:', option.id)
  }
}

// ====== CHARGEMENT INITIAL ======
const getBookingDetailsById = async () => {
  isLoading.value = true
  const response = await getReservationDetailsById(Number(props.id))
  console.log('reservation',response)
  if (response.status === 200) {
    localReservation.value = response.data
    if(response.data.status === 'pending'){
      isPending.value = true
    }
  }
  isLoading.value = false
}

// ====== COMPUTED PROPERTIES ======
const roomRateTypeSummary = computed(() => {
  if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
    return 'N/A'
  }

  const reservationRooms = localReservation.value.reservationRooms
  const roomNumbers = reservationRooms.map((room: any) => {
    return `${room.room?.roomNumber} -${room?.roomType?.roomTypeName} / ${room?.roomRates?.rateType?.rateTypeName} `
  })

  return roomNumbers[0]
})

const nightsSummary = computed(() => {
  if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
    return 0
  }

  const rooms = localReservation.value.reservationRooms

  if (rooms.length === 1) {
    return rooms[0].nights
  }

  const firstNights = rooms[0].nights
  const allSameNights = rooms.every((room: any) => room.nights === firstNights)

  if (allSameNights) {
    return firstNights
  }

  const nightsArray = rooms.map((room: any) => room.nights)
  const minNights = Math.min(...nightsArray)
  const maxNights = Math.max(...nightsArray)

  return `${minNights}-${maxNights}`
})

const printDocumentData = computed(() => {
  if (!localReservation.value) return null

  return {
    type: 'reservation',
    reservation: {
      id: localReservation.value.id,
      reservationNumber: localReservation.value.reservationNumber,
      status: localReservation.value.status,
      arrivalDate: localReservation.value.arrivalDate,
      departureDate: localReservation.value.departureDate,
      nights: localReservation.value.nights,
      adults: localReservation.value.adults,
      children: localReservation.value.children,
    },
    guest: {
      firstName: localReservation.value.guest?.firstName,
      lastName: localReservation.value.guest?.lastName,
      email: localReservation.value.guest?.email,
      phone: localReservation.value.guest?.phone,
    },
    rooms:
      localReservation.value.reservationRooms?.map((room: any) => ({
        roomNumber: room.room?.roomNumber,
        roomType: room.room?.roomType?.name,
        rate: room.rate,
      })) || [],
    financial: {
      totalAmount: localReservation.value.totalAmount,
      paidAmount: localReservation.value.paidAmount,
      balance: localReservation.value.balance,
    },
  }
})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('en', options)
}

const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
}

const handlePrintClose = () => {
  showPrintModal.value = false
}

const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

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

// Fonction pour rafraîchir une réservation spécifique (appelée depuis les composants enfants)
const refresReservation = async () => {
  await refreshAvailableActions()
}

// Fonction pour obtenir le texte de chargement selon l'action
const getActionLoadingText = (action: string | null) => {
  const loadingTexts: Record<string, string> = {
    'check_in': t('Checking in...'),
    'check_out': t('Checking out...'),
    'cancel_reservation': t('Cancelling...'),
    'void_reservation': t('Voiding...'),
    'add_payment': t('Processing payment...'),
    'unassign_room': t('Unassigning room...'),
    // Ajoutez d'autres actions selon vos besoins
  }

  return loadingTexts[action || ''] || t('Processing...')
}
//fonction to confirm reservation
const isConfirming = ref(false)

const ReservationConfirm = async () => {
  try {
    isConfirming.value = true

    const data = {
      status: 'confirmed'
    }

    const res = await confirmBooking(localReservation.value.id, data)
    console.log("res", res)

    if (res.status === 200 || res.data) {
      updateLocalReservation({
        status: 'confirmed'
      })

      isPending.value = false

      toast.success(t('Reservation confirmed successfully'))

      await getBookingDetailsById()
    }

  } catch (error: any) {
    console.error('Error confirming reservation:', error)
    const errorMessage = error.response?.data?.message || error.message || t('Failed to confirm reservation')
    toast.error(errorMessage)
  } finally {
    isConfirming.value = false
  }
}

onMounted(() => {
  getBookingDetailsById()
})
</script>

<template>
  <AdminLayout>
    <ReservationDetailsSkeleton v-if="isLoading" />

    <div class="h-full" v-else-if="localReservation && localReservation.id"
      :class="{ 'void-status': localReservation.status === 'voided' }">
      <!--Header-->
      <div class="shadow-sm px-4 py-2 mx-4 bg-white flex justify-between">
        <div class="flex gap-2 align-middle self-center items-center">
          <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
          <Building2Icon class="text-primary"></Building2Icon>
          <Users v-if="localReservation.reservationRooms.length > 1" />
          <span class="font-bold">{{ localReservation.guest?.displayName }}</span>
          <div class="flex">
            <Adult class="w-5" />
            <span class="text-sm items-end align-center self-center pt-2">{{
              localReservation.adults ?? 0
            }}</span>
          </div>
          <div class="flex">
            <Child class="w-4" />
            <span class="text-sm items-end align-bottom self-center pt-2">{{
              localReservation.child ?? 0
            }}</span>
          </div>
          <div class="flex gap-8 ms-10">
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('booking.arrival') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ formatDate(localReservation.arrivedDate) }}, {{ formatTimeFromTimeString(localReservation.checkInTime) }}</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('booking.departure') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ formatDate(localReservation.departDate) }}, {{ formatTimeFromTimeString(localReservation.checkOutTime) }}</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('nights') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ nightsSummary }}</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('Room/Rate types') }}</span>
              <span class="text-xs flex gap-2 flex-col"
                v-if="localReservation.reservationRooms.length > 0 && localReservation.reservationRooms.every((room: any) => room.room?.id)">
                <span>{{ roomRateTypeSummary }}</span>
              </span>
              <AssignRoomReservation :reservation="localReservation"
                v-if="localReservation.reservationRooms.length === 0 || localReservation.reservationRooms.some((room: any) => !room.room?.id)"
                @refresh="handleRoomAssignmentRefresh" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('res.no') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ localReservation.reservationNumber }}</span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="isPending" class="flex gap-x-2 h-full align-middle self-center items-center justify-center">
          <button
            type="button"
            @click="ReservationConfirm"
            :disabled="isConfirming"
            class="bg-green-500 rounded-lg px-4 py-2 text-sm flex gap-2 items-center text-white shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <svg
              v-if="isConfirming"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isConfirming ? $t('processing') || 'Processing...' : $t('confirm booking') }}</span>
          </button>
        </div>
        <div v-else class="flex gap-x-2 h-full align-middle self-center items-center justify-center">
          <ReservationStatus :status="localReservation.status" />
        </div>


      </div>

      <!--main-->
      <div class="shadow-sm px-2 pt-1 mx-4 bg-white mt-5 flex justify-between">
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
              <div v-if="isPerformingAction" class="flex items-center px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ getActionLoadingText(currentAction) }}
            </div>
            <ButtonDropdown v-else :options="dropdownOptions" :button-text="$t('Options')"
              button-class="bg-white text-primary border-primary hover:bg-primary/25" dropdown-class="w-64"
              @option-selected="handleOptionSelected" />
          </div>
        </div>
      </div>

      <!--tab content-->
      <div v-if="activeTab === 'room_charges'">
        <RoomCharge :reservation-id="localReservation.id" :reservation="localReservation"></RoomCharge>
      </div>
      <div v-if="activeTab === 'folio_operations' && localReservation && localReservation.id">
        <FoglioOperation :reservation-id="localReservation.id" :reservation="localReservation" @refresh="refresReservation">
        </FoglioOperation>
      </div>
      <div v-if="activeTab === 'booking_details'">
        <BookingDetails :booking="localReservation" :guest="localReservation.guest"></BookingDetails>
      </div>
      <div v-if="activeTab === 'guest_details'">
        <GuestDetails :reservation="localReservation" :guest="localReservation.guest" :reservationId="localReservation.id" />
      </div>
      <div v-if="activeTab === 'audit_trial'">
        <AuditTrail :entity-ids="[localReservation.id]" />
      </div>
    </div>

    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center">
        <p class="text-gray-500 text-lg">{{ $t('No reservation found') }}</p>
      </div>
    </div>
  </AdminLayout>

  <!-- Modals -->
  <template v-if="isAddPaymentModalOpen">
    <AddPaymentModal :reservation-id="localReservation.id" :is-open="isAddPaymentModalOpen" @close="closeAddPaymentModal"
      @save="handleSavePayment" />
  </template>
  <template v-if="showCancelModal">
    <CancelReservation :is-open="showCancelModal" :reservation-data="localReservation" @close="showCancelModal = false" :reservation-id="localReservation.id"
      @cancel-confirmed="handleCancelConfirmed" />
  </template>
  <template v-if="showVoidModal">
    <VoidReservation :is-open="showVoidModal" :reservation-data="localReservation" @close="showVoidModal = false"
      :reservation-id="localReservation.id" :reservation-number="localReservation.reservationNumber"
      @void-confirmed="handleVoidConfirmed" />
  </template>
  <template v-if="showAmendModal">
    <AmendStay :is-open="showAmendModal" :reservation-data="localReservation" @close="showAmendModal = false"
      :reservation-id="localReservation.id" :reservation-number="localReservation.reservationNumber"
      @amend-confirmed="handleAmendConfirmed" :reservation="localReservation" />
  </template>
  <template v-if="showNoShowModal">
    <NoShowReservation :is-open="showNoShowModal" :reservation-id="localReservation.id" @close="showNoShowModal = false"
      @noshow-confirmed="handleNoShowConfirmed" />
  </template>
  <template v-if="isCkeckOutModalOpen">
    <CheckOutReservation :reservation-id="localReservation.id" :is-open="isCkeckOutModalOpen"
      @close="isCkeckOutModalOpen = false" @success="handleCheckOutSuccess" />
  </template>
  <template v-if="isCkeckInModalOpen">
    <CheckInReservation :reservation-id="localReservation.id" :is-open="isCkeckInModalOpen"
      @success="handleCheckInSuccess" @close="isCkeckInModalOpen = false" />
  </template>
  <template v-if="isUnAssignModalOpen">
    <UnAssignRoomReservation :reservation-id="localReservation.id" :is-open="isUnAssignModalOpen"
      @close="isUnAssignModalOpen = false" @success="handleUnassignSuccess" />
  </template>
  <!-- Room Move Modal -->
  <template v-if="isRoomMoveModalOpen">
    <RoomMoveModal :reservation-id="localReservation.id" :is-open="isRoomMoveModalOpen" @close="isRoomMoveModalOpen = false" @success="handleRoomMoveSuccess" />
  </template>
  <!-- Exchange Room Modal -->
  <template v-if="isExchangeRoomModalOpen">
    <ExchangeRoomModal :reservation-id="localReservation.id" :is-open="isExchangeRoomModalOpen" @close="isExchangeRoomModalOpen = false" @success="handleExchangeSuccess" />
  </template>
  <!-- Print Modal -->
  <template v-if="showPrintModal">
    <PrintModal :is-open="showPrintModal" :document-data="printDocumentData" @close="handlePrintClose"
      :reservation-id="localReservation.id" @print-success="handlePrintSuccess" @print-error="handlePrintError"
      :templates="templates" />
  </template>
</template>

<style></style>
