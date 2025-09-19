<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtomDropdownAction from '../common/ButtomDropdownAction.vue';
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, HouseIcon, List, StopCircle, Trash2, UserMinus, Users, X } from 'lucide-vue-next';
import { computed, ref, defineAsyncComponent } from 'vue';
import { formatCurrency, formatTime } from '../utilities/UtilitiesFunction';
import router from '../../router';
import Child from '../../icons/Child.vue';
import Adult from '../../icons/Adult.vue';
import { useReservation } from '../../composables/useReservation';
import { useToast } from 'vue-toastification';
// Lazy load modal components for better code splitting
const CancelReservation = defineAsyncComponent(() => import('./foglio/CancelReseravtion.vue'));
import PrintModal from '../common/PrintModal.vue';
const VoidReservation = defineAsyncComponent(() => import('./foglio/VoidReservation.vue'));
const AmendStay = defineAsyncComponent(() => import('./foglio/AmendStay.vue'));
const AddPaymentModal = defineAsyncComponent(() => import('./foglio/AddPaymentModal.vue'));
const NoShowReservation = defineAsyncComponent(() => import('./foglio/NoShowReservation.vue'));
import AssignRoomReservation from './AssignRoomReservation.vue';
import ReservationStatus from '../common/ReservationStatus.vue';
const CheckOutReservation = defineAsyncComponent(() => import('./CheckOutReservation.vue'));
const CheckInReservation = defineAsyncComponent(() => import('./CheckInReservation.vue'));
const UnAssignRoomReservation = defineAsyncComponent(() => import('./UnAssignRoomReservation.vue'));
const { t, locale } = useI18n({ useScope: 'global' })

// Initialize the reservation composable
const {
  isCheckingIn,
  isCheckingOut,
  isAmendingStay,
  isMovingRoom,
  isExchangingRoom,
  isStoppingRoomMove,
  isUpdatingInclusionList,
  isMarkingNoShow,
  isVoidingReservation,
  performCheckIn,
  performCheckOut,
  showNoShowModal,
  handleNoShowConfirmed
} = useReservation();
const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})

interface Emits {
  (e: 'close'): void
  (e: 'save', data?: any): void
}



const emit = defineEmits<Emits>()

// Cancel modal state
const showCancelModal = ref(false)
const showPrintModal = ref(false)
const showVoidModal = ref(false)
const showAmendModal = ref(false)
const isAddPaymentModalOpen = ref(false)
const isCkeckOutModalOpen = ref(false)
const isCkeckInModalOpen = ref(false)
const toast = useToast()
const handleCancelConfirmed = async (cancelData: any) => {
  showCancelModal.value = false
}

// Print modal handlers
const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}
const handleVoidConfirmed = () => {
  showVoidModal.value = false
  // Emit save event to notify parent components
  emit('save', { action: 'void', reservationId: props.reservation.value?.id })
}
const handleAmendConfirmed = () => {
  showAmendModal.value = false
  // Emit save event to notify parent components
  emit('save', { action: 'amend', reservationId: props.reservation.value?.id })
}

const openAddPaymentModal = () => {
  isAddPaymentModalOpen.value = true
}

const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
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

const isUnAssignModalOpen = ref(false)

const openUnAssignReservationModal = () => {
    isUnAssignModalOpen.value = true
}

const closeUnAssignReservationModal = () => {
    isUnAssignModalOpen.value = false
}

const handleRoomAssigned = (data: any) => {
  console.log('Room assigned:', data)
  // Emit save event to notify parent components to refresh
  emit('save', { action: 'roomAssigned', reservationId: props.reservation.id, data })
}

const handleSavePayment = (data: any) => {
  console.log('Add payment data:', data)
  // Emit save event to notify parent components
  emit('save', { action: 'addPayment', reservationId: props.reservation.value?.id, data })

}
// Document data for printing
const printDocumentData = computed(() => ({
  reservation: props.reservation,
  guest: props.reservation.guest,
  rooms: props.reservation.reservationRooms,
  totalAmount: props.reservation.totalAmount,
  paidAmount: props.reservation.paidAmount,
  remainingAmount: props.reservation.remainingAmount
}))

const roomRateTypeSummary = computed(() => {
  if (!props.reservation?.reservationRooms || props.reservation.reservationRooms.length === 0) {
    return 'N/A';
  }
  const filterReservationRoom = props.reservation.reservationRooms.filter((room: any) => room.isOwner)
  const reservationRoom = filterReservationRoom &&filterReservationRoom.length >0  ? filterReservationRoom[0] : props.reservation.reservationRooms[0];
  return  reservationRoom.room?.roomNumber?`${reservationRoom.room?.roomNumber}`:null
});
// Icon mapping for different actions
const actionIconMap = {
  'view': Eye,
  'check_in': CheckCircle,
  'check_out': CheckCircle,
  'add_payment': CreditCard,
  'amend_stay': Calendar,
  'room_move': ArrowUpDown,
  'exchange_room': ArrowUpDown,
  'stop_room_move': StopCircle,
  'inclusion_list': List,
  'cancel_reservation': X,
  'no_show': Eye,
  'void_reservation': Trash2,
  'unassign_room': UserMinus,
};

// Color mapping for different actions
const actionColorMap = {
  'view': 'text-blue-600',
  'check_in': 'text-blue-600',
  'check_out': 'text-green-600',
  'add_payment': 'text-green-600',
  'amend_stay': 'text-purple-600',
  'room_move': 'text-orange-600',
  'exchange_room': 'text-indigo-600',
  'stop_room_move': 'text-red-600',
  'inclusion_list': 'text-gray-600',
  'cancel_reservation': 'text-red-600',
  'no_show': 'text-yellow-600',
  'void_reservation': 'text-red-700',
  'unassign_room': 'text-gray-600',
};


// Ajoutez ces variables réactives au début de votre script setup
const currentAction = ref<string | null>(null)
const isPerformingAction = computed(() => currentAction.value !== null)

// Fonction générique pour exécuter une action avec feedback
const executeAction = async (actionId: string, actionFn: () => Promise<void>, loadingMessage?: string, successMessage?: string) => {
  if (isPerformingAction.value) {
    return // Empêcher les actions multiples
  }

  try {
    currentAction.value = actionId

    // Toast d'information si fourni
    if (loadingMessage) {
      toast.info(loadingMessage, {
        timeout: 2000,
        hideProgressBar: false
      })
    }

    // Exécuter l'action
    await actionFn()

    // Message de succès si fourni
    if (successMessage) {
      toast.success(successMessage)
    }

  } catch (error: any) {
    console.error(`${actionId} error:`, error)
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        t(`Failed to ${actionId.replace('_', ' ')}`)
    toast.error(errorMessage)
  } finally {
    currentAction.value = null
  }
}

// Fonction pour le check-in automatique
const performAutoCheckIn = async (availableRoom: any) => {
  const checkInDateTime = new Date().toISOString()
  const checkInPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckInTime: checkInDateTime,
    notes: '',
    keyCardsIssued: 2,
    depositAmount: 0
  }

  await performCheckIn(props.reservation.id, checkInPayload)

  emit('save', {
    action: 'checkIn',
    reservationId: props.reservation.id,
    data: checkInPayload
  })
}

// Fonction pour le check-out
const performAutoCheckOut = async (availableRoom: any) => {
  const checkOutDateTime = new Date().toISOString()
  const checkOutPayload = {
    reservationRooms: [availableRoom.id],
    actualCheckOutTime: checkOutDateTime,
    notes: '',
  }

  await performCheckOut(props.reservation.id, checkOutPayload)

  emit('save', {
    action: 'checkOut',
    reservationId: props.reservation.id,
    data: checkOutPayload
  })
}

// Votre handleOptionSelected modifié
const handleOptionSelected = async (option: any) => {
  console.log('Selected option:', option)

  if (option.id === 'view') {
    router.push({
      name: 'ReservationDetails',
      params: { id: props.reservation.id }
    })
    return
  }

  if (!props.reservation?.reservationNumber) {
    console.error('No reservation number available')
    return
  }

  // Handle specific actions
  switch (option.id) {
    case 'add_payment':
      openAddPaymentModal()
      break

    case 'amend_stay':
      showAmendModal.value = true
      break

    case 'cancel_reservation':
      showCancelModal.value = true
      break

    case 'void_reservation':
      showVoidModal.value = true
      break

    case 'check_in':
      const availableRoomsForCheckin = props.reservation.reservationRooms?.filter((room: any) =>
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
        console.log("roomNumber",roomNumber)
        await executeAction(
          'check_in',
          () => performAutoCheckIn(availableRoomsForCheckin[0]),
          t('Checking in room {roomNumber}...', { roomNumber }),
          t('Room {roomNumber} checked in successfully', { roomNumber })
        )
      } else {
        openCheckInReservationModal()
      }
      break

    case 'check_out':
      const availableRoomsForCheckout = props.reservation.reservationRooms?.filter((room: any) =>
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
          () => performAutoCheckOut(availableRoomsForCheckout[0]),
          t('Checking out room {roomNumber}...', { roomNumber }),
          t('Room {roomNumber} checked out successfully', { roomNumber })
        )
      } else {
        // Plusieurs chambres : ouvrir le modal de groupe
        openCheckOutReservationModal()
      }
      break

    case 'unassign_room':
      openUnAssignReservationModal()
      break

    case 'no_show':
      showNoShowModal.value = true
      break

    case 'print':
      showPrintModal.value = true
      break

    default:
      console.log(`Action ${option.id} not handled`)
  }
}

// Modifier le computed dropdownOptions pour désactiver pendant les actions
const dropdownOptions = computed(() => {
  // If reservation is voided, disable all actions
  if (props.reservation?.status === 'voided') {
    return []
  }
  
  const options = [{
    id: 'view',
    label: t('view'),
    icon: Eye,
    color: 'text-blue-600'
  }]

  if (props.reservation?.availableActions) {
    const availableOptions = props.reservation.availableActions
      .filter((action: any) => action.available)
      .map((action: any) => ({
        id: action.action,
        label: action.label,
        description: action.description,
        route: action.route,
        icon: actionIconMap[action.action as keyof typeof actionIconMap] || List,
        color: actionColorMap[action.action as keyof typeof actionColorMap] || 'text-gray-600'
      }))

    options.push(...availableOptions)
  }

  return options
})

// Fonction pour obtenir le texte de chargement selon l'action
const getActionLoadingText = (action: string | null) => {
  const loadingTexts: Record<string, string> = {
    'check_in': t('Checking in...'),
    'check_out': t('Checking out...'),
    'cancel_reservation': t('Cancelling...'),
    'void_reservation': t('Voiding...'),
    'add_payment': t('Processing payment...'),
    // Ajoutez d'autres actions selon vos besoins
  }

  return loadingTexts[action || ''] || t('Processing...')
}
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('en', options)
}
</script>

<template>
  <div class="z-10">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-visible group"
      :class="{ 'void-status': reservation.status === 'voided' }">
      <!-- Card Header -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center align-middle self-center gap-2">
            <HouseIcon class="w-8 h-8 text-primary" />
            <Users v-if="reservation.reservationRooms.length > 1" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate capitalize">
                {{ reservation.guest?.displayName }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                #{{ reservation.reservationNumber }}
              </p>
            </div>
          </div>
          <!-- <div class="flex gap-1">
            <ButtomDropdownAction :id="`${reservation.id}`" :options="dropdownOptions"
              @option-selected="handleOptionSelected" />

          </div> -->
          <div class="flex gap-1">
            <!-- Indicateur de chargement générique -->
            <div v-if="isPerformingAction" class="flex items-center px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ getActionLoadingText(currentAction) }}
            </div>

            <!-- Dropdown normal -->
            <ButtomDropdownAction
              v-else
              :id="`${reservation.id}`"
              :options="dropdownOptions"
              @option-selected="handleOptionSelected"
            />
          </div>
        </div>

      </div>
      <div class="grid grid-cols-8 px-4">
        <div class="flex col-span-3 items-center p-2 flex-col bg-gray-100">
          <span>{{ formatDate(reservation.date) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTime(reservation.date) }}
          </span>
        </div>
        <div class="flex col-span-2 items-center p-2 flex-col bg-gray-300">
          <span>{{ reservation.nights ?? reservation.numberOfNights }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ $t('nights') }}
          </span>
        </div>
        <div class="flex items-center col-span-3 p-2 flex-col bg-gray-100">
          <span>{{ formatDate(reservation.departDate) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTime(reservation.departDate) }}
          </span>
        </div>

      </div>
      <!-- Card Body -->
      <div class="p-4 space-y-3">
        <!-- Dates -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">{{ $t('booking_date') }}</span>
            <span class="text-xs">{{ formatDate(reservation.date) }}</span>
          </div>
          <div class="flex gap-2">
            <div class="flex items-center">
              <Adult class="w-6 h-10" /><span class="pt-2 text-sm">{{ reservation.adults }}</span>
            </div>
            <div class="flex items-center">
              <Child class="w-5 h-10" /><span class="pt-2 text-sm">{{ reservation.child ?? 0 }}</span>
            </div>
          </div>

        </div>

        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">{{ $t('Room') }}</span> <!--/Rate type-->
            <span v-if="reservation.reservationRooms && reservation.reservationRooms.length>0 && reservation.reservationRooms.every((room:any) => room.roomId)">
              {{ roomRateTypeSummary }}
            </span>
            <AssignRoomReservation v-else
              :reservation="reservation"
              @refresh="$emit('save')"
              @assigned="handleRoomAssigned"
            />
          </div>
          <div class="flex gap-1">
            <ReservationStatus :status="reservation.status" />
          </div>
        </div>

        <!-- Amount and Payment Status -->
        <div class=" flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
          <div class="flex justify-between">
            <span class=" font-medium">{{ $t('Total') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.balanceSummary?.totalChargesWithTaxes) }}</span>
          </div>
          <div class="flex justify-between">
            <span class=" font-medium">{{ $t('paid') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.balanceSummary?.totalPayments) }}</span>
          </div>
          <div class="flex justify-between text-primary">
            <span class=" font-medium">{{ $t('balance') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.balanceSummary?.outstandingBalance) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cancel Reservation Modal -->
  <template v-if="showCancelModal">
    <CancelReservation :is-open="showCancelModal" :reservation-id="reservation.id" :reservation-data="reservation" @close="showCancelModal = false"
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
  <!-- Add Payment Modal -->
  <template v-if="isAddPaymentModalOpen">
    <AddPaymentModal :reservation-id="reservation.id" :is-open="isAddPaymentModalOpen" @close="closeAddPaymentModal"
      @save="handleSavePayment" />
  </template>
  <!--check out template-->
  <template v-if="isCkeckOutModalOpen">
    <CheckOutReservation :reservation-id="reservation.id" :is-open="isCkeckOutModalOpen"
       @close="closeCheckOutReservationModal" />
  </template>

   <!--check in template-->
  <template v-if="isCkeckInModalOpen">
            <CheckInReservation :reservation-id="reservation.id" :is-open="isCkeckInModalOpen"
                @close="closeCheckInReservationModal" />
  </template>

   <!--unassign template-->
  <template v-if="isUnAssignModalOpen">
            <UnAssignRoomReservation :reservation-id="reservation.id" :is-open="isUnAssignModalOpen"
                @close="closeUnAssignReservationModal" />
  </template>

  <!-- Print Modal -->
  <template v-if="showPrintModal">
    <PrintModal :is-open="showPrintModal" :document-data="printDocumentData" @close="showPrintModal = false"
      @print-success="handlePrintSuccess" @print-error="handlePrintError" :reservation-id="reservation.id" />
  </template>
</template>

<style></style>
