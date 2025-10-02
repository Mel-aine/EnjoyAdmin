<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtomDropdownAction from '../common/ButtomDropdownAction.vue';
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, HouseIcon, List, StopCircle, Trash2, UserMinus, Users, X } from 'lucide-vue-next';
import { computed, ref, defineAsyncComponent, watch } from 'vue';
import { formatCurrency, formatTime, formatTimeFromTimeString } from '../utilities/UtilitiesFunction';
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
import { getReservationById } from '@/services/reservation';
const ExchangeRoomModal = defineAsyncComponent(() => import('./ExchangeRoomModal.vue'))
const RoomMoveModal = defineAsyncComponent(() => import('../modal/RoomMoveModal.vue'))

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
  const { performAvhe: avheReservation } = useReservation()

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})

interface Emits {
  (e: 'close'): void
  (e: 'save', data?: any): void
  (e: 'reservation-updated', updatedReservation: any): void
}

const emit = defineEmits<Emits>()

// Créer une copie réactive des données de réservation
const localReservation = ref<any>(null)



// Cancel modal state
const showCancelModal = ref(false)
const showPrintModal = ref(false)
const showVoidModal = ref(false)
const showAmendModal = ref(false)
const isAddPaymentModalOpen = ref(false)
const isCkeckOutModalOpen = ref(false)
const isCkeckInModalOpen = ref(false)
const isExchangeRoomModalOpen = ref(false)
const isRoomMoveModalOpen = ref(false)
const toast = useToast()


watch(() => props.reservation, (newReservation) => {
  if (newReservation) {
    localReservation.value = { ...newReservation }
    console.log('Local reservation updated:', localReservation.value)
  }
}, { deep: true, immediate: true })

const updateLocalReservation = (updates: any) => {
  console.log('Updating reservation with:', updates)
  console.log('Current reservation:', localReservation.value)

  localReservation.value = {
    ...localReservation.value,
    ...updates
  }

  console.log('Updated reservation:', localReservation.value)
  emit('reservation-updated', localReservation.value)
}



const refreshAvailableActions = async (reservationId: number) => {
  try {
    const updatedReservation = await getReservationById(reservationId)

    if (updatedReservation.availableActions) {
      updateLocalReservation({
        availableActions: updatedReservation.availableActions,
        status: updatedReservation.status,
        balanceSummary: updatedReservation.balanceSummary
      })
    }
  } catch (error) {
    console.error('Error refreshing available actions:', error)
    toast.error(t('Error refreshing reservation data'))
  }
}

const handleCancelConfirmed = async (cancelData: any) => {
  showCancelModal.value = false
  // Mettre à jour le statut localement
  updateLocalReservation({
    status: 'confirmed',
    availableActions: []
  })
   await refreshAvailableActions(localReservation.value.id)
}

// Print modal handlers
const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}


const handleVoidConfirmed = async(voidData: any) => {
    console.log('Void confirmed with data:', voidData)

    showVoidModal.value = false

    // Mise à jour immédiate de l'état local
    updateLocalReservation({
        status: 'voided',
        availableActions: []
    })


    // Émettre pour notifier le parent
    emit('save', {
        action: 'void',
        reservationId: localReservation.value?.id,
        data: voidData
    })
     await refreshAvailableActions(localReservation.value.id)
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

const closeExchangeRoomModal = () => {
  isExchangeRoomModalOpen.value = false
}

const closeRoomMoveModal = () => {
  isRoomMoveModalOpen.value = false
}

const handleExchangeSuccess = async () => {
  closeExchangeRoomModal()
  await refreshAvailableActions(localReservation.value.id)
}

const handleRoomMoveSuccess = async () => {
  closeRoomMoveModal()
  await refreshAvailableActions(localReservation.value.id)
}



const handleSavePayment = async (data: any) => {
  console.log('Add payment data received:', data)
  console.log('Current balance summary:', localReservation.value.balanceSummary)

  closeAddPaymentModal()

  try {
    let updates: any = {}

    // Stratégie 1: Utiliser les données complètes de la réservation si disponibles
    if (data.reservation && data.reservation.balanceSummary) {
      console.log('Using complete reservation data from API')
      updates = {
        balanceSummary: data.reservation.balanceSummary,
        totalAmount: data.reservation.totalAmount,
        paidAmount: data.reservation.paidAmount,
        remainingAmount: data.reservation.remainingAmount
      }
    }
    // Stratégie 2: Utiliser balanceSummary direct
    else if (data.balanceSummary) {
      console.log('Using direct balanceSummary')
      updates.balanceSummary = data.balanceSummary
    }
    // Stratégie 3: Calculer localement basé sur le montant du paiement
    else if (data.payment && data.payment.amount) {
      console.log('Calculating balance locally')
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
        outstandingBalance: Math.max(0, newOutstandingBalance) // S'assurer que ce n'est pas négatif
      }

      console.log('New calculated balance:', updates.balanceSummary)
    }
    // Stratégie 4: Utiliser les données calculées si disponibles
    else if (data.calculatedUpdate && data.calculatedUpdate.paymentAmount) {
      console.log('Using calculated update data')
      const currentBalance = localReservation.value.balanceSummary || {
        totalChargesWithTaxes: 0,
        totalPayments: 0,
        outstandingBalance: 0
      }

      const paymentAmount = parseFloat(data.calculatedUpdate.paymentAmount.toString())
      const newTotalPayments = (currentBalance.totalPayments || 0) + paymentAmount
      const newOutstandingBalance = (currentBalance.totalChargesWithTaxes || 0) - newTotalPayments

      updates.balanceSummary = {
        ...currentBalance,
        totalPayments: newTotalPayments,
        outstandingBalance: Math.max(0, newOutstandingBalance)
      }
    }

    // Appliquer les mises à jour
    if (Object.keys(updates).length > 0) {
      console.log('Applying payment updates:', updates)
      updateLocalReservation(updates)

    } else {
      console.warn('No payment updates could be calculated, falling back to parent refresh')
      // Fallback: émettre save pour que le parent gère le refresh
      emit('save', {
        action: 'addPayment',
        reservationId: localReservation.value?.id,
        data,
        needsRefresh: true
      })
      return
    }

    // Émettre l'événement save pour compatibilité (sans needsRefresh car on a mis à jour localement)
    emit('save', { action: 'addPayment', reservationId: localReservation.value?.id, data })

  } catch (error) {
    console.error('Error updating payment display:', error)
    toast.error(t('Error updating payment display'))
    // Fallback: émettre save pour que le parent gère
    emit('save', {
      action: 'addPayment',
      reservationId: localReservation.value?.id,
      data,
      needsRefresh: true
    })
  }
}

// Document data for printing - utiliser les données locales
const printDocumentData = computed(() => ({
  reservation: localReservation.value,
  guest: localReservation.value.guest,
  rooms: localReservation.value.reservationRooms,
  totalAmount: localReservation.value.totalAmount,
  paidAmount: localReservation.value.paidAmount,
  remainingAmount: localReservation.value.remainingAmount
}))

// const roomRateTypeSummary = computed(() => {
//   if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
//     return 'N/A';
//   }
//   const filterReservationRoom = localReservation.value.reservationRooms.filter((room: any) => room.isOwner)
//   const reservationRoom = filterReservationRoom && filterReservationRoom.length > 0 ? filterReservationRoom[0] : localReservation.value.reservationRooms[0];
//   return reservationRoom.room?.roomNumber ? `${reservationRoom.room?.roomNumber}` : null
// });
const roomRateTypeSummary = computed(() => {
  if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
    return 'N/A';
  }

  const assignedRooms = localReservation.value.reservationRooms
    .filter((room: any) => room.roomId && room.room?.roomNumber)

  if (assignedRooms.length === 0) {
    return null;
  }

  const roomNumbers = assignedRooms.map((room: any) => room.room.roomNumber);

  // Si plusieurs chambres, ajouter le compte
  if (roomNumbers.length > 1) {
    return `${roomNumbers.join(', ')} (${roomNumbers.length} rooms)`;
  }

  return roomNumbers[0];
});

const handleRoomAssignmentRefresh = async () => {
  try {
    // Recharger les détails de la réservation
    const updatedReservation = await getReservationById(localReservation.value.id)

    // Mettre à jour localement
    updateLocalReservation({
      reservationRooms: updatedReservation.reservationRooms,
      availableActions: updatedReservation.availableActions,
      status: updatedReservation.status
    })

    // Émettre pour compatibilité
    emit('save', {
      action: 'roomAssigned',
      reservationId: localReservation.value.id
    })


  } catch (error) {
    console.error('Error refreshing after room assignment:', error)
    toast.error(t('Error updating room assignment'))
  }
}
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

// Variables réactives pour gérer l'état des actions
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

    await actionFn()

    // Réinitialiser l'état de chargement AVANT d'afficher le toast
    currentAction.value = null

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
    // S'assurer de réinitialiser aussi en cas d'erreur
    currentAction.value = null

  } finally {
    // Assurer que l'état de chargement est toujours réinitialisé
    if (currentAction.value === actionId) {
        currentAction.value = null
    }
  }
}

// Fonction pour le check-in automatique avec mise à jour locale
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

  emit('save', {
    action: 'checkIn',
    reservationId: localReservation.value.id,
    data: checkInPayload
  })

   await refreshAvailableActions(localReservation.value.id)
}

// Fonction pour le check-out avec mise à jour locale
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

  emit('save', {
    action: 'checkOut',
    reservationId: localReservation.value.id,
    data: checkOutPayload
  })

   await refreshAvailableActions(localReservation.value.id)
}

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

    emit('save', {
      action: 'unassign',
      reservationId: localReservation.value.id,
      data: unassignPayload
    })

    await refreshAvailableActions(localReservation.value.id)


  } catch (error) {
    console.error('Unassign error:', error)
  }
}

// Gestion du NoShow avec mise à jour locale
const handleNoShowConfirmedLocal = async (noShowData: any) => {
  await handleNoShowConfirmed(noShowData)
  // Mettre à jour le statut localement
  updateLocalReservation({
    status: 'confirmed',
    availableActions: [] // Les actions disponibles changent après no-show
  })
    await refreshAvailableActions(localReservation.value.id)
}

const handleOptionSelected = async (option: any) => {
  console.log('Selected option:', option)

  if (option.id === 'view') {
    router.push({
      name: 'ReservationDetails',
      params: { id: localReservation.value.id }
    })
    return
  }

  if (!localReservation.value?.reservationNumber) {
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
        openCheckInReservationModal()
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
        // Plusieurs chambres : ouvrir le modal de groupe
        openCheckOutReservationModal()
      }
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

        openUnAssignReservationModal()
      }
      break


    case 'no_show':
      showNoShowModal.value = true
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
      console.log(`Action ${option.id} not handled`)
  }
}

// Modifier le computed dropdownOptions pour utiliser les données locales
const dropdownOptions = computed(() => {
  // If reservation is voided, disable all actions
  if (localReservation.value?.status === 'voided') {
    return []
  }

  const options = [{
    id: 'view',
    label: t('view'),
    icon: Eye,
    color: 'text-blue-600'
  }]

  if (localReservation.value?.availableActions) {
    const availableOptions = localReservation.value.availableActions
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
    'unassign_room': t('Unassigning room...'),
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

// const handleAmendConfirmed = (amendData: any) => {
//   showAmendModal.value = false

//   // Mettre à jour les données localement avec les nouvelles dates
//   updateLocalReservation({
//     arrivedDate: amendData.newArrivalDate,
//     departDate: amendData.newDepartureDate,
//     nights: amendData.nights,
//     numberOfNights: amendData.nights
//   })

//   // Émettre l'événement pour compatibilité
//   emit('save', { action: 'amend', reservationId: localReservation.value?.id, data: amendData })
// }
const handleAmendConfirmed = (amendData: any) => {
  showAmendModal.value = false

  // Vérifier si c'est un amendement pour une chambre spécifique ou pour toute la réservation
  if (amendData.reservationRoomId) {
    // Amendement pour une chambre spécifique
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

    updateLocalReservation({
      reservationRooms: updatedRooms
    })

    // Recalculer les dates globales si nécessaire
    // (prendre la date d'arrivée la plus tôt et la date de départ la plus tard)
    const earliestCheckIn = updatedRooms.reduce((min: string, room: any) =>
      room.checkInDate < min ? room.checkInDate : min,
      updatedRooms[0].checkInDate
    )

    const latestCheckOut = updatedRooms.reduce((max: string, room: any) =>
      room.checkOutDate > max ? room.checkOutDate : max,
      updatedRooms[0].checkOutDate
    )

    // Calculer le nombre de nuits total basé sur les nouvelles dates globales
    const totalNights = Math.ceil(
      (new Date(latestCheckOut).getTime() - new Date(earliestCheckIn).getTime()) / (1000 * 60 * 60 * 24)
    )

    updateLocalReservation({
      arrivedDate: earliestCheckIn,
      departDate: latestCheckOut,
      numberOfNights: totalNights
    })
  } else {
    // Amendement pour toute la réservation
    updateLocalReservation({
      arrivedDate: amendData.newArrivalDate,
      departDate: amendData.newDepartureDate,
      nights: amendData.nights,
      numberOfNights: amendData.nights
    })

    // Mettre à jour toutes les chambres
    const updatedRooms = localReservation.value.reservationRooms.map((room: any) => ({
      ...room,
      checkInDate: amendData.newArrivalDate,
      checkOutDate: amendData.newDepartureDate,
      nights: amendData.nights
    }))

    updateLocalReservation({
      reservationRooms: updatedRooms
    })
  }

  emit('save', { action: 'amend', reservationId: localReservation.value?.id, data: amendData })
}
// Ajoutez cette méthode pour gérer les événements du modal check-in
const handleCheckInSuccess = (data: any) => {
  console.log('Check-in success data:', data)

  // Mettre à jour les chambres localement
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

  // Vérifier si toutes les chambres sont check-in
  const allRoomsCheckedIn = updatedRooms.every((room: any) =>
    room.status === 'checked_in' || room.checkedIn
  )

  // Mettre à jour le statut de la réservation si nécessaire
  const reservationStatus = allRoomsCheckedIn ? 'checked_in' : localReservation.value.status

  // Mettre à jour localement
  updateLocalReservation({
    reservationRooms: updatedRooms,
    status: reservationStatus
  })

  // Fermer le modal
  closeCheckInReservationModal()

  // Émettre pour compatibilité
  emit('save', {
    action: 'checkIn',
    reservationId: localReservation.value.id,
    data
  })
}

// Nouvelle méthode pour gérer le check-out
const handleCheckOutSuccess = (data: any) => {
  console.log('Check-out success data:', data)

  // Mettre à jour les chambres localement
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

  // Vérifier si toutes les chambres sont check-out
  const allRoomsCheckedOut = updatedRooms.every((room: any) =>
    room.status === 'checked_out' || room.checkedOut
  )

  // Mettre à jour le statut de la réservation si nécessaire
  const reservationStatus = allRoomsCheckedOut ? 'checked_out' : localReservation.value.status

  // Mettre à jour localement
  updateLocalReservation({
    reservationRooms: updatedRooms,
    status: reservationStatus
  })

  // Fermer le modal
  closeCheckOutReservationModal()

  // Émettre pour compatibilité
  emit('save', {
    action: 'checkOut',
    reservationId: localReservation.value.id,
    data
  })
}

const handleUnassignSuccess = async (data: any) => {
  console.log('Unassign success data:', data)

  // Mettre à jour les chambres localement
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

  // Mettre à jour localement
  updateLocalReservation({
    reservationRooms: updatedRooms
  })

  // Rafraîchir les actions disponibles
  await refreshAvailableActions(localReservation.value.id)

  // Fermer le modal
  closeUnAssignReservationModal()

  // Émettre pour compatibilité
  emit('save', {
    action: 'unassign',
    reservationId: localReservation.value.id,
    data
  })


}

// Liste des numéros de chambres assignées
const assignedRoomNumbers = computed(() => {
  return localReservation.value?.reservationRooms
    ?.filter((room: any) => room.roomId && room.room?.roomNumber)
    ?.map((room: any) => room.room.roomNumber) || []
})
</script>

<template>
  <div class="z-10">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-visible group"
      :class="{ 'void-status': localReservation.status === 'voided' }">
      <!-- Card Header -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center align-middle self-center gap-2">
            <HouseIcon class="w-8 h-8 text-primary" />
            <Users v-if="localReservation.reservationRooms.length > 1" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate capitalize">
                {{ localReservation.guest?.displayName }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                #{{ localReservation.reservationNumber }}
              </p>
            </div>
          </div>
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
              v-else-if="dropdownOptions && dropdownOptions.length > 0"
              :id="`${localReservation.id}`"
              :options="dropdownOptions"
              @option-selected="handleOptionSelected"
            />
          </div>
        </div>

      </div>
      <div class="grid grid-cols-8 px-4">
        <div class="flex col-span-3 items-center p-2 flex-col bg-gray-100">
          <span>{{ formatDate(localReservation.date) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTimeFromTimeString(localReservation.checkInTime) }}
          </span>
        </div>
        <div class="flex col-span-2 items-center p-2 flex-col bg-gray-300">
          <span>{{ localReservation.numberOfNights }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ $t('nights') }}
          </span>
        </div>
        <div class="flex items-center col-span-3 p-2 flex-col bg-gray-100">
          <span>{{ formatDate(localReservation.departDate) }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ formatTimeFromTimeString(localReservation.checkOutTime) }}
          </span>
        </div>

      </div>
      <!-- Card Body -->
      <div class="p-4 space-y-3">
        <!-- Dates -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">{{ $t('booking_date') }}</span>
            <span class="text-xs">{{ formatDate(localReservation.date) }}</span>
          </div>
          <div class="flex gap-2">
            <div class="flex items-center">
              <Adult class="w-6 h-10" /><span class="pt-2 text-sm">{{ localReservation.adults }}</span>
            </div>
            <div class="flex items-center">
              <Child class="w-5 h-10" /><span class="pt-2 text-sm">{{ localReservation.child ?? 0 }}</span>
            </div>
          </div>

        </div>

        <!-- <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">{{ $t('Room') }}</span>
            <span v-if="localReservation.reservationRooms && localReservation.reservationRooms.length>0 && localReservation.reservationRooms.every((room:any) => room.roomId)">
              {{ roomRateTypeSummary }}
            </span>
            <AssignRoomReservation v-else
              :reservation="localReservation"
              @refresh="$emit('save')"
              @assigned="handleRoomAssigned"
            />
          </div>
          <div class="flex gap-1">
            <ReservationStatus :status="localReservation.status" />
          </div>
        </div> -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="font-semibold">{{ $t('Room') }}</span>
            <span v-if="localReservation.reservationRooms && localReservation.reservationRooms.length > 0 && localReservation.reservationRooms.every((room:any) => room.roomId)" class="text-sm">
              <span v-if="localReservation.reservationRooms.length > 1" class="inline-flex items-center gap-1">
                <Users class="w-4 h-4" />
                {{ roomRateTypeSummary }}
              </span>
              <span v-else>{{ roomRateTypeSummary }}</span>
            </span>
            <div v-else-if="assignedRoomNumbers.length > 0" class="flex items-center gap-2">
              <span class="text-sm inline-flex items-center gap-1">
                <Users v-if="localReservation.reservationRooms.length > 1" class="w-4 h-4" />
                {{ assignedRoomNumbers.join(', ') }}
              </span>
              <AssignRoomReservation
                :reservation="localReservation"
                @refresh="handleRoomAssignmentRefresh"
              />
            </div>

            <!-- Aucune chambre assignée : uniquement le bouton -->
            <AssignRoomReservation v-else
              :reservation="localReservation"
              @refresh="handleRoomAssignmentRefresh"
            />
          </div>
          <div class="flex gap-1">
            <ReservationStatus :status="localReservation.status" />
          </div>
        </div>

        <!-- Amount and Payment Status -->
        <div class=" flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
          <div class="flex justify-between">
            <span class=" font-medium">{{ $t('Total') }}</span>
            <span class="text-sm">{{ formatCurrency(localReservation.balanceSummary?.totalChargesWithTaxes) }}</span>
          </div>
          <div class="flex justify-between">
            <span class=" font-medium">{{ $t('paid') }}</span>
            <span class="text-sm">{{ formatCurrency(localReservation.balanceSummary?.totalPayments) }}</span>
          </div>
          <div class="flex justify-between text-primary">
            <span class=" font-medium">{{ $t('balance') }}</span>
            <span class="text-sm">{{ formatCurrency(localReservation.balanceSummary?.outstandingBalance) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cancel Reservation Modal -->
  <template v-if="showCancelModal">
    <CancelReservation :is-open="showCancelModal" :reservation-id="localReservation.id" :reservation-data="localReservation" @close="showCancelModal = false"
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
  <!-- NoShow Reservation Modal -->
  <template v-if="showNoShowModal">
    <NoShowReservation :is-open="showNoShowModal" :reservation-id="localReservation.id" @close="showNoShowModal = false"
      @noshow-confirmed="handleNoShowConfirmedLocal" />
  </template>
  <!-- Add Payment Modal -->
  <template v-if="isAddPaymentModalOpen">
    <AddPaymentModal :reservation-id="localReservation.id" :is-open="isAddPaymentModalOpen" @close="closeAddPaymentModal"
      @save="handleSavePayment" />
  </template>
  <!--check out template-->
  <template v-if="isCkeckOutModalOpen">
    <CheckOutReservation :reservation-id="localReservation.id" :is-open="isCkeckOutModalOpen"
       @close="closeCheckOutReservationModal"  @success="handleCheckOutSuccess"/>
  </template>

   <!--check in template-->
  <template v-if="isCkeckInModalOpen">
            <CheckInReservation :reservation-id="localReservation.id" :is-open="isCkeckInModalOpen"
                @close="closeCheckInReservationModal"  @success="handleCheckInSuccess" />
  </template>

   <!--unassign template-->
  <template v-if="isUnAssignModalOpen">
            <UnAssignRoomReservation :reservation-id="localReservation.id" :is-open="isUnAssignModalOpen"
                @close="closeUnAssignReservationModal"  @success="handleUnassignSuccess"/>
  </template>

  <!-- Print Modal -->
  <template v-if="showPrintModal">
    <PrintModal :is-open="showPrintModal" :document-data="printDocumentData" @close="showPrintModal = false"
      @print-success="handlePrintSuccess" @print-error="handlePrintError" :reservation-id="localReservation.id" />
  </template>
  <!-- Room Move Modal -->
  <template v-if="isRoomMoveModalOpen">
    <RoomMoveModal :reservation-id="localReservation.id" :is-open="isRoomMoveModalOpen" @close="closeRoomMoveModal" @success="handleRoomMoveSuccess" />
  </template>
  <!-- Exchange Room Modal -->
  <template v-if="isExchangeRoomModalOpen">
    <ExchangeRoomModal :reservation-id="localReservation.id" :is-open="isExchangeRoomModalOpen" @close="closeExchangeRoomModal" @success="handleExchangeSuccess" />
  </template>
</template>

<style></style>
