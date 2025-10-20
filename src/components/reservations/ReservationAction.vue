<template>
  <div class="flex gap-2">
    <div v-if="isPerformingAction" class="flex items-center px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs">
      <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {{ getActionLoadingText(currentAction) }}
    </div>
    <template v-else>
      <ButtonDropdown v-if="default" :button-class="'bg-white text-sm border border-primary text-primary'"
        :options="dropdownOptions" :button-text="t('Options')" @option-selected="handleOptionSelected" />
      <ButtomDropdownAction v-else :options="dropdownOptions" @option-selected="handleOptionSelected" />
    </template>


  </div>

  <!-- Action Modals -->
  <template v-if="localRes && localRes.id">
    <!-- Cancel / Void / Amend / No Show -->
    <CancelReservation :is-open="showCancelModal" :reservation-data="localRes" :reservation-id="localRes.id"
      :reservation-number="localRes.reservationNumber" @close="showCancelModal = false"
      @cancel-confirmed="handleCancelConfirmed" />

    <VoidReservation :is-open="showVoidModal" :reservation-data="localRes" :reservation-id="localRes.id"
      :reservation-number="localRes.reservationNumber" @close="showVoidModal = false"
      @void-confirmed="handleVoidConfirmed" />

    <AmendStay :is-open="showAmendModal" :reservation-data="localRes" :reservation-id="localRes.id"
      :reservation-number="localRes.reservationNumber" :reservation="localRes" @close="showAmendModal = false"
      @amend-confirmed="handleAmendConfirmed" />

    <NoShowReservation :is-open="showNoShowModal" :reservation-id="localRes.id" @close="showNoShowModal = false"
      @noshow-confirmed="handleNoShowConfirmed" />

    <!-- Add Payment -->
    <template v-if="isAddPaymentModalOpen">
      <AddPaymentModal :reservation-id="localRes.id" :is-open="isAddPaymentModalOpen" @close="closeAddPaymentModal"
        @save="handleSavePayment" />
    </template>

    <!-- Check Out -->
    <template v-if="isCkeckOutModalOpen">
      <CheckOutReservation :reservation-id="localRes.id" :is-open="isCkeckOutModalOpen"
        @close="closeCheckOutReservationModal" @success="handleCheckOutSuccess" />
    </template>

    <!-- Check In -->
    <template v-if="isCkeckInModalOpen">
      <CheckInReservation :reservation-id="localRes.id" :is-open="isCkeckInModalOpen"
        @close="closeCheckInReservationModal" @success="handleCheckInSuccess" />
    </template>

    <!-- Undo Check In -->
    <template v-if="isUndoCheckInModalOpen">
      <UndoCheckInReservation :reservation-id="localRes.id" :is-open="isUndoCheckInModalOpen"
        @close="closeUndoCheckInReservationModal" @success="handleUndoCheckInSuccess" />
    </template>

    <!-- Undo Check Out -->
    <template v-if="isUndoCheckOutModalOpen">
      <UndoCheckOutReservation :reservation-id="localRes.id" :is-open="isUndoCheckOutModalOpen"
        @close="closeUndoCheckOutReservationModal" @success="handleUndoCheckOutSuccess" />
    </template>

    <!-- Unassign Room -->
    <template v-if="isUnAssignModalOpen">
      <UnAssignRoomReservation :reservation-id="localRes.id" :is-open="isUnAssignModalOpen"
        @close="closeUnAssignReservationModal" @success="handleUnAssignConfirmed" />
    </template>

    <!-- Room Move / Exchange Room -->
    <template v-if="isRoomMoveModalOpen">
      <RoomMoveModal :reservation-id="localRes.id" :is-open="isRoomMoveModalOpen" @close="closeRoomMoveModal"
        @success="handleRoomMoveSuccess" />
    </template>

    <template v-if="isExchangeRoomModalOpen">
      <ExchangeRoomModal :reservation-id="localRes.id" :is-open="isExchangeRoomModalOpen"
        @close="closeExchangeRoomModal" @success="handleExchangeSuccess" />
    </template>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ButtonDropdown from '../common/ButtonDropdown.vue'
import { List } from 'lucide-vue-next'
import { ActionIcons } from '@/utils/ActionIcons'
import { useReservation } from '../../composables/useReservation'
import ButtomDropdownAction from '../common/ButtomDropdownAction.vue'

// Lazy-loaded modals
const CancelReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/CancelReseravtion.vue'))
const VoidReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/VoidReservation.vue'))
const AmendStay = defineAsyncComponent(() => import('@/components/reservations/foglio/AmendStay.vue'))
const AddPaymentModal = defineAsyncComponent(() => import('@/components/reservations/foglio/AddPaymentModal.vue'))
const NoShowReservation = defineAsyncComponent(() => import('@/components/reservations/foglio/NoShowReservation.vue'))
const CheckOutReservation = defineAsyncComponent(() => import('@/components/reservations/CheckOutReservation.vue'))
const CheckInReservation = defineAsyncComponent(() => import('@/components/reservations/CheckInReservation.vue'))
const UndoCheckInReservation = defineAsyncComponent(() => import('@/components/reservations/UndoCheckInReservation.vue'))
const UndoCheckOutReservation = defineAsyncComponent(() => import('@/components/reservations/UndoCheckOutReservation.vue'))
const UnAssignRoomReservation = defineAsyncComponent(() => import('@/components/reservations/UnAssignRoomReservation.vue'))
const RoomMoveModal = defineAsyncComponent(() => import('@/components/modal/RoomMoveModal.vue'))
const ExchangeRoomModal = defineAsyncComponent(() => import('@/components/reservations/ExchangeRoomModal.vue'))

interface Props {
  reservation?: any
  localReservation?: any
  default?:boolean
}
const props = withDefaults(defineProps<Props>(), {
  default: true
})

interface Emits {
  (e: 'reservation-updated', updated: any): void
  (e: 'save', payload: any): void
}
const emit = defineEmits<Emits>()

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const {
  performCheckIn,
  performCheckOut,
  performUndoCheckIn,
  performUndoCheckOut,
  showNoShowModal
} = useReservation()

// Local copy synced from props
const localRes = ref<any>(null)
watch(
  [() => props.localReservation, () => props.reservation],
  ([newLocal, newRes]) => {
    const source = newLocal || newRes
    if (source) localRes.value = { ...source }
  },
  { immediate: true, deep: true }
)

// Helper: update local reservation and emit to parent
const updateLocalReservation = (updates: any) => {
  if (!localRes.value) return
  localRes.value = {
    ...localRes.value,
    ...updates
  }
  emit('reservation-updated', localRes.value)
}

// Action icons and colors
const actionIconMap = ActionIcons.getMap()
const actionColorMap = {
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
}

// Dropdown options from availableActions
const dropdownOptions = computed(() => {
  const res = localRes.value
  if (!res?.availableActions) return []
  if (res.status === 'cancelled' || res.status === 'voided') return []
  return res.availableActions
    .filter((action: any) => action.available)
    .map((action: any) => ({
      id: action.action,
      label: action.label,
      description: action.description,
      route: action.route,
      icon: actionIconMap[action.action as keyof typeof actionIconMap] || List,
      color: actionColorMap[action.action as keyof typeof actionColorMap] || 'text-gray-600'
    }))
})

// In-flight action indicator
const currentAction = ref<string | null>(null)
const isPerformingAction = computed(() => currentAction.value !== null)

// Unified executor with feedback
const executeAction = async (actionId: string, actionFn: () => Promise<void>, loadingMessage?: string, successMessage?: string) => {
  if (isPerformingAction.value) return
  try {
    currentAction.value = actionId
    if (loadingMessage) {
      toast.info(loadingMessage, { timeout: 2000, hideProgressBar: false })
    }
    await actionFn()
    if (successMessage) {
      toast.success(successMessage)
    }
  } catch (error: any) {
    console.error(`${actionId} error:`, error)
    const errorMessage = error.response?.data?.message || error.message || t(`Failed to ${actionId.replace('_', ' ')}`)
    toast.error(errorMessage)
  } finally {
    currentAction.value = null
  }
}

// Auto actions
const performAutoCheckIn = async (availableRoom: any) => {
  const checkInDateTime = new Date().toISOString()
  const payload = {
    reservationRooms: [availableRoom.id],
    actualCheckInTime: checkInDateTime,
    notes: '',
    keyCardsIssued: 2,
    depositAmount: 0
  }
  await performCheckIn(localRes.value.id, payload)
  const updatedRooms = localRes.value.reservationRooms.map((room: any) => room.id === availableRoom.id
    ? { ...room, status: 'checked_in', actualCheckInTime: checkInDateTime, checkedIn: true }
    : room
  )
  const allRoomsCheckedIn = updatedRooms.every((room: any) => room.status === 'checked_in')
  const reservationStatus = allRoomsCheckedIn ? 'checked_in' : localRes.value.status
  updateLocalReservation({ reservationRooms: updatedRooms, status: reservationStatus })
  emit('save', { action: 'checkIn', reservationId: localRes.value.id, data: payload })
}

const performAutoCheckOut = async (availableRoom: any) => {
  const checkOutDateTime = new Date().toISOString()
  const payload = { reservationRooms: [availableRoom.id], actualCheckOutTime: checkOutDateTime, notes: '' }
  await performCheckOut(localRes.value.id, payload)
  const updatedRooms = localRes.value.reservationRooms.map((room: any) => room.id === availableRoom.id
    ? { ...room, status: 'checked_out', actualCheckOutTime: checkOutDateTime }
    : room
  )
  const allRoomsCheckedOut = updatedRooms.every((room: any) => room.status === 'checked_out')
  const reservationStatus = allRoomsCheckedOut ? 'checked_out' : localRes.value.status
  updateLocalReservation({ reservationRooms: updatedRooms, status: reservationStatus })
  emit('save', { action: 'checkOut', reservationId: localRes.value.id, data: payload })
}

const performAutoUndoCheckIn = async (roomToUndo: any) => {
  const payload = { reservationRooms: [roomToUndo.id], notes: '' }
  await performUndoCheckIn(localRes.value.id, payload)
  const updatedRooms = localRes.value.reservationRooms.map((room: any) => room.id === roomToUndo.id
    ? { ...room, status: 'pending', actualCheckInTime: null, checkedIn: false }
    : room
  )
  const anyRoomCheckedIn = updatedRooms.some((room: any) => room.status === 'checked_in' || room.checkedIn)
  const reservationStatus = anyRoomCheckedIn ? 'checked_in' : 'confirmed'
  updateLocalReservation({ reservationRooms: updatedRooms, status: reservationStatus })
  emit('save', { action: 'undo_check_in', reservationId: localRes.value.id, data: payload })
}

const performAutoUndoCheckOut = async (roomToUndo: any) => {
  const payload = { reservationRooms: [roomToUndo.id], notes: '' }
  await performUndoCheckOut(localRes.value.id, payload)
  const updatedRooms = localRes.value.reservationRooms.map((room: any) => room.id === roomToUndo.id
    ? { ...room, status: 'checked_in', actualCheckOutTime: null, checkedOut: false }
    : room
  )
  const allRoomsCheckedOut = updatedRooms.every((room: any) => room.status === 'checked_out' || room.checkedOut)
  const reservationStatus = allRoomsCheckedOut ? 'checked_out' : 'checked_in'
  updateLocalReservation({ reservationRooms: updatedRooms, status: reservationStatus })
  emit('save', { action: 'undo_check_out', reservationId: localRes.value.id, data: payload })
}

// Option selection handler
const handleOptionSelected = async (option: any) => {
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
    case 'unassign_room':
      openUnAssignReservationModal()
      break
    case 'inclusion_list':
      break
    case 'check_in': {
      const rooms = localRes.value.reservationRooms?.filter((room: any) =>
        !room.actualCheckInTime && room.status !== 'checked_in' && room.status !== 'occupied' && !room.checkedIn
      ) || []
      if (rooms.length === 0) {
        toast.info(t('All rooms have already been checked in'))
        return
      } else if (rooms.length === 1) {
        await executeAction('check_in', () => performAutoCheckIn(rooms[0]))
      } else {
        openCheckInReservationModal()
      }
      break
    }
    case 'check_out': {
      const rooms = localRes.value.reservationRooms || []
      if (rooms.length === 0) {
        toast.info(t('No rooms available for check-out'))
        return
      } else if (rooms.length === 1) {
        await executeAction('check_out', () => performAutoCheckOut(rooms[0]))
      } else {
        openCheckOutReservationModal()
      }
      break
    }
    case 'undo_check_in': {
      const rooms = localRes.value.reservationRooms?.filter((room: any) =>
        room.status === 'checked_in' || room.checkedIn || !!room.actualCheckInTime
      ) || []
      if (rooms.length === 0) {
        toast.info(t('No rooms eligible for undo check-in'))
        return
      } else if (rooms.length === 1) {
        await executeAction('undo_check_in', () => performAutoUndoCheckIn(rooms[0]))
      } else {
        openUndoCheckInReservationModal()
      }
      break
    }
    case 'undo_check_out': {
      const rooms = localRes.value.reservationRooms?.filter((room: any) =>
        room.status === 'checked_out' || room.checkedOut || !!room.actualCheckOutTime
      ) || []
      if (rooms.length === 0) {
        toast.info(t('No rooms eligible for undo check-out'))
        return
      } else if (rooms.length === 1) {
        await executeAction('undo_check_out', () => performAutoUndoCheckOut(rooms[0]))
      } else {
        openUndoCheckOutReservationModal()
      }
      break
    }
    case 'room_move':
      isRoomMoveModalOpen.value = true
      break
    case 'exchange_room':
      isExchangeRoomModalOpen.value = true
      break
    case 'stop_room_move':
      break
    case 'no_show':
      showNoShowModal.value = true
      break
    default:
      console.log(`Action ${option.id} not handled`)
  }
}

// Loading text
const getActionLoadingText = (action: string | null) => {
  const loadingTexts: Record<string, string> = {
    'check_in': t('Checking in...'),
    'check_out': t('Checking out...'),
    'undo_check_in': t('Undoing check-in...'),
    'undo_check_out': t('Undoing check-out...'),
    'cancel_reservation': t('Cancelling...'),
    'void_reservation': t('Voiding...'),
    'add_payment': t('Processing payment...'),
  }
  return loadingTexts[action || ''] || t('Processing...')
}

// Modal states
const showCancelModal = ref(false)
const showVoidModal = ref(false)
const showAmendModal = ref(false)
const isAddPaymentModalOpen = ref(false)
const isCkeckOutModalOpen = ref(false)
const isCkeckInModalOpen = ref(false)
const isUndoCheckInModalOpen = ref(false)
const isUndoCheckOutModalOpen = ref(false)
const isUnAssignModalOpen = ref(false)
const isRoomMoveModalOpen = ref(false)
const isExchangeRoomModalOpen = ref(false)

// Modal open/close helpers
const openAddPaymentModal = () => { isAddPaymentModalOpen.value = true }
const closeAddPaymentModal = () => { isAddPaymentModalOpen.value = false }
const openCheckOutReservationModal = () => { isCkeckOutModalOpen.value = true }
const closeCheckOutReservationModal = () => { isCkeckOutModalOpen.value = false }
const openCheckInReservationModal = () => { isCkeckInModalOpen.value = true }
const closeCheckInReservationModal = () => { isCkeckInModalOpen.value = false }
const openUnAssignReservationModal = () => { isUnAssignModalOpen.value = true }
const closeUnAssignReservationModal = () => { isUnAssignModalOpen.value = false }
const openUndoCheckInReservationModal = () => { isUndoCheckInModalOpen.value = true }
const closeUndoCheckInReservationModal = () => { isUndoCheckInModalOpen.value = false }
const openUndoCheckOutReservationModal = () => { isUndoCheckOutModalOpen.value = true }
const closeUndoCheckOutReservationModal = () => { isUndoCheckOutModalOpen.value = false }
const closeRoomMoveModal = () => { isRoomMoveModalOpen.value = false }
const closeExchangeRoomModal = () => { isExchangeRoomModalOpen.value = false }

// Success handlers
const handleCheckInSuccess = (data: any) => {
  const updatedRooms = localRes.value.reservationRooms.map((room: any) =>
    data.updatedRooms.includes(room.id)
      ? { ...room, status: 'checked_in', actualCheckInTime: data.checkInDateTime, checkedIn: true }
      : room
  )
  const allRoomsCheckedIn = updatedRooms.every((room: any) => room.status === 'checked_in' || room.checkedIn)
  const reservationStatus = allRoomsCheckedIn ? 'checked_in' : localRes.value.status
  updateLocalReservation({ reservationRooms: updatedRooms, status: reservationStatus })
  closeCheckInReservationModal()
  emit('save', { action: 'checkIn', reservationId: localRes.value.id, data })
}

const handleCheckOutSuccess = (data: any) => {
  const updatedRooms = localRes.value.reservationRooms.map((room: any) =>
    data.updatedRooms.includes(room.id)
      ? { ...room, status: 'checked_out', actualCheckOutTime: data.checkOutDateTime, checkedOut: true }
      : room
  )
  const allRoomsCheckedOut = updatedRooms.every((room: any) => room.status === 'checked_out' || room.checkedOut)
  const reservationStatus = allRoomsCheckedOut ? 'checked_out' : localRes.value.status
  updateLocalReservation({ reservationRooms: updatedRooms, status: reservationStatus })
  closeCheckOutReservationModal()
  emit('save', { action: 'checkOut', reservationId: localRes.value.id, data })
}

const handleUndoCheckInSuccess = (data: any) => {
  const updatedRooms = localRes.value.reservationRooms.map((room: any) =>
    data.updatedRooms.includes(room.id)
      ? { ...room, status: 'pending', actualCheckInTime: null, checkedIn: false }
      : room
  )
  const anyRoomStillCheckedIn = updatedRooms.some((room: any) => room.status === 'checked_in' || room.checkedIn)
  updateLocalReservation({ reservationRooms: updatedRooms, status: anyRoomStillCheckedIn ? 'checked_in' : 'confirmed' })
  closeUndoCheckInReservationModal()
  emit('save', { action: 'undo_check_in', reservationId: localRes.value.id, data })
}

const handleUndoCheckOutSuccess = (data: any) => {
  const updatedRooms = localRes.value.reservationRooms.map((room: any) =>
    data.updatedRooms.includes(room.id)
      ? { ...room, status: 'checked_in', actualCheckOutTime: null, checkedOut: false }
      : room
  )
  const allRoomsStillCheckedOut = updatedRooms.every((room: any) => room.status === 'checked_out' || room.checkedOut)
  updateLocalReservation({ reservationRooms: updatedRooms, status: allRoomsStillCheckedOut ? 'checked_out' : 'checked_in' })
  closeUndoCheckOutReservationModal()
  emit('save', { action: 'undo_check_out', reservationId: localRes.value.id, data })
}

// Other action handlers moved from parent
const handleCancelConfirmed = () => {
  showCancelModal.value = false
  updateLocalReservation({ status: 'cancelled', availableActions: [] })
  emit('save', { action: 'cancel', reservationId: localRes.value?.id })
}

const handleVoidConfirmed = (voidData: any) => {
  showVoidModal.value = false
  updateLocalReservation({ status: 'voided', availableActions: [] })
  emit('save', { action: 'void', reservationId: localRes.value?.id, data: voidData })
}

const handleAmendConfirmed = (amendData: any) => {
  showAmendModal.value = false
  updateLocalReservation({
    arrivedDate: amendData.newArrivalDate,
    departDate: amendData.newDepartureDate,
    nights: amendData.nights,
    numberOfNights: amendData.nights
  })
  emit('save', { action: 'amend', reservationId: localRes.value?.id, data: amendData })
}

const handleNoShowConfirmed = async () => {
  showNoShowModal.value = false
  updateLocalReservation({ status: 'no_show', availableActions: [] })
  emit('save', { action: 'noshow', reservationId: localRes.value?.id })
}

const handleUnAssignConfirmed = () => {
  isUnAssignModalOpen.value = false
  emit('save', { action: 'unassign', reservationId: localRes.value?.id })
}
const handleRoomMoveSuccess = () => {
  isRoomMoveModalOpen.value = false
  emit('save', { action: 'roomMove', reservationId: localRes.value?.id })
}
const handleExchangeSuccess = () => {
  isExchangeRoomModalOpen.value = false
  emit('save', { action: 'exchangeRoom', reservationId: localRes.value?.id })
}
// Add Payment handler moved from parent
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
      updates.totalAmount = data.balanceSummary.totalChargesWithTaxes
      updates.paidAmount = data.balanceSummary.totalPayments
      updates.remainingAmount = data.balanceSummary.outstandingBalance
    } else if (data.calculatedUpdate) {
      const currentBalance = localRes.value.balanceSummary || {}
      const paymentAmount = parseFloat(data.calculatedUpdate.paymentAmount.toString())
      const newTotalPayments = (currentBalance.totalPayments || 0) + paymentAmount
      const newOutstandingBalance = (currentBalance.totalChargesWithTaxes || 0) - newTotalPayments
      updates.balanceSummary = { ...currentBalance, totalPayments: newTotalPayments, outstandingBalance: Math.max(0, newOutstandingBalance) }
      updates.totalAmount = currentBalance.totalChargesWithTaxes
      updates.paidAmount = newTotalPayments
      updates.remainingAmount = Math.max(0, newOutstandingBalance)
    }
    if (Object.keys(updates).length > 0) {
      updateLocalReservation(updates)
    } else {
      emit('save', { action: 'addPayment', reservationId: localRes.value?.id, data, needsRefresh: true })
      return
    }
    emit('save', { action: 'addPayment', reservationId: localRes.value?.id, data })
  } catch (error) {
    console.error('Error updating payment display:', error)
    toast.error(t('Error updating payment display'))
  }
}
</script>