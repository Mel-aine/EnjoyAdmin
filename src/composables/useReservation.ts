import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import {
  checkInReservation,
  checkOutReservation,
  undoCheckInReservation,
  undoCheckOutReservation,
  getReservationDetailsById,
  unAssignRoomReservation,
  assignRoomReservation
} from '@/services/reservation'

export interface CheckInReservationPayload {
  reservationRooms: number[]
  actualCheckInTime: string
  notes: string
  keyCardsIssued: number
  depositAmount: number
}

export interface CheckOutReservationPayload {
  reservationRooms: number[]
  actualCheckOutTime: string
 // notes: string
 // finalBill: number
  //depositRefund: number
}

export interface PaymentPayload {
  reservationId: number
  amount: number
  paymentMethod: string
  notes?: string
}

export interface AmendStayPayload {
  reservationId: number
  newCheckInDate?: string
  newCheckOutDate?: string
  newRoomType?: number
  notes?: string
}

export interface RoomMovePayload {
  reservationId: number
  fromRoomId: number
  toRoomId: number
  moveDate: string
  reason: string
}

export interface CancelReservationPayload {
  reservationId: number
  reason: string
  refundAmount?: number
  notes?: string
}

export interface AvheReservationPayload {
  reservationRooms: number[]
  actualCheckInTime: string
  notes?: string
}

export function useReservation() {
  const toast = useToast()
  const { t } = useI18n()

  // Loading states for each operation
  const showNoShowModal = ref(false);
  const isCheckingIn = ref(false)
  const isCheckingOut = ref(false)
  const isAddingPayment = ref(false)
  const isAmendingStay = ref(false)
  const isMovingRoom = ref(false)
  const isStoppingRoomMove = ref(false)
  const isUpdatingInclusionList = ref(false)
  const isCancellingReservation = ref(false)
  const isMarkingNoShow = ref(false)
  const isVoidingReservation = ref(false)
  const isAvhe = ref(false)
  const isExchangingRoom = ref(false)
  const isUndoingCheckIn = ref(false)
  const isUndoingCheckOut = ref(false)

  // Check-in reservation
  const performCheckIn = async (reservationId: number, payload: CheckInReservationPayload, refreshCallback?: () => Promise<void>) => {
    isCheckingIn.value = true

    try {
      const response = await checkInReservation(reservationId, payload)
      console.log('Check-in response:', response)

      toast.success(t('toast.checkInSuccess'))

      if (refreshCallback) {
        await refreshCallback()
      }

      return response
    } catch (error:any) {
      console.error('Check-in error:', error)
      if (!error.response || error.response.status !== 400) {
        toast.error(t('toast.checkInError') || t('Failed to complete check-in. Please try again.'))
      } else {
        toast.error(error.response.data?.message || t('toast.checkInError'))
      }
      // throw error
    } finally {
      isCheckingIn.value = false
    }
  }

  // Check-out reservation
  const performCheckOut = async (reservationId: number, payload: CheckOutReservationPayload, refreshCallback?: () => Promise<void>) => {
    isCheckingOut.value = true

    try {
      const response = await checkOutReservation(reservationId, payload)
      console.log('Check-out response:', response)

      toast.success(t('toast.checkOutSuccess') || t('Check-out completed successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      return response
    } catch (error) {
      console.error('Check-out error:', error)
      // toast.error(t('toast.checkOutError') || 'Failed to complete check-out. Please try again.')
      throw error
    } finally {
      isCheckingOut.value = false
    }
  }

  // Add payment
  const addPayment = async (payload: PaymentPayload, refreshCallback?: () => Promise<void>) => {
    isAddingPayment.value = true

    try {
      // TODO: Implement payment API call
      // const response = await addReservationPayment(payload)
      console.log('Adding payment:', payload)

      toast.success(t('toast.addPaymentSuccess') || t('Payment added successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Add payment error:', error)
      toast.error(t('toast.addPaymentError') || t('Failed to add payment. Please try again.'))
      throw error
    } finally {
      isAddingPayment.value = false
    }
  }

  // Amend stay
  const amendStay = async (payload: AmendStayPayload, refreshCallback?: () => Promise<void>) => {
    isAmendingStay.value = true

    try {
      // TODO: Implement amend stay API call
      // const response = await amendReservationStay(payload)
      console.log('Amending stay:', payload)

      toast.success(t('toast.amendStaySuccess') || t('Stay amended successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Amend stay error:', error)
      toast.error(t('toast.amendStayError') || t('Failed to amend stay. Please try again.'))
      throw error
    } finally {
      isAmendingStay.value = false
    }
  }

  // Room move
  const moveRoom = async (payload: RoomMovePayload, refreshCallback?: () => Promise<void>) => {
    isMovingRoom.value = true

    try {
      // Fetch reservation details to locate the reservationRoom to update
      const reservation: any = await getReservationDetailsById(payload.reservationId)
      const reservationRooms = reservation?.reservationRooms || []

      // Find the reservation room corresponding to the source room
      const targetRoom = reservationRooms.find((r: any) => r.roomId === payload.fromRoomId)
      if (!targetRoom) {
        throw new Error(t('Source room not found in reservation'))
      }

      // Build assign-room payload to move to the new room
      const data = {
        reservationRooms: [
          {
            reservationRoomId: targetRoom.id,
            roomId: payload.toRoomId,
            roomNumber: targetRoom.roomNumber,
            roomTypeId: targetRoom.roomTypeId,
            reservationId: payload.reservationId
          }
        ]
      }

      await assignRoomReservation(payload.reservationId, data)

      toast.success(t('toast.roomMoveSuccess') || t('Room moved successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Room move error:', error)
      toast.error(t('toast.roomMoveError') || t('Failed to move room. Please try again.'))
      throw error
    } finally {
      isMovingRoom.value = false
    }
  }

  // Exchange room
  const exchangeRoom = async (payload: RoomMovePayload, refreshCallback?: () => Promise<void>) => {
    isExchangingRoom.value = true

    try {
      // TODO: Implement room exchange API call
      // const response = await exchangeReservationRoom(payload)
      console.log('Exchanging room:', payload)

      toast.success(t('toast.exchangeRoomSuccess') || t('Room exchanged successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Room exchange error:', error)
      toast.error(t('toast.exchangeRoomError') || t('Failed to exchange room. Please try again.'))
      throw error
    } finally {
      isExchangingRoom.value = false
    }
  }

  // Stop room move
  const stopRoomMove = async (reservationId: number, refreshCallback?: () => Promise<void>) => {
    isStoppingRoomMove.value = true

    try {
      // TODO: Implement stop room move API call
      // const response = await stopReservationRoomMove(reservationId)
      console.log('Stopping room move for reservation:', reservationId)

      toast.success(t('toast.stopRoomMoveSuccess') || t('Room move stopped successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Stop room move error:', error)
      toast.error(t('toast.stopRoomMoveError') || t('Failed to stop room move. Please try again.'))
      throw error
    } finally {
      isStoppingRoomMove.value = false
    }
  }

  // Update inclusion list
  const updateInclusionList = async (reservationId: number, inclusions: string[], refreshCallback?: () => Promise<void>) => {
    isUpdatingInclusionList.value = true

    try {
      // TODO: Implement inclusion list update API call
      // const response = await updateReservationInclusions(reservationId, inclusions)
      console.log('Updating inclusion list for reservation:', reservationId, inclusions)

      toast.success(t('toast.inclusionListSuccess') || t('Inclusion list updated successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Update inclusion list error:', error)
      toast.error(t('toast.inclusionListError') || t('Failed to update inclusion list. Please try again.'))
      throw error
    } finally {
      isUpdatingInclusionList.value = false
    }
  }

  // Cancel reservation
  const cancelReservation = async (payload: CancelReservationPayload, refreshCallback?: () => Promise<void>) => {
    isCancellingReservation.value = true

    try {
      // TODO: Implement cancel reservation API call
      // const response = await cancelReservationById(payload)
      console.log('Cancelling reservation:', payload)

      toast.success(t('toast.cancelReservationSuccess') || t('Reservation cancelled successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Cancel reservation error:', error)
      toast.error(t('toast.cancelReservationError') || t('Failed to cancel reservation. Please try again.'))
      throw error
    } finally {
      isCancellingReservation.value = false
    }
  }

  // Mark as no show
  const markNoShow = async (reservationId: number, reason: string, refreshCallback?: () => Promise<void>) => {
    isMarkingNoShow.value = true

    try {
      // TODO: Implement no show API call
      // const response = await markReservationNoShow(reservationId, reason)
      console.log('Marking no show for reservation:', reservationId, reason)

      toast.success(t('toast.noShowSuccess') || t('Reservation marked as no show successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Mark no show error:', error)
      toast.error(t('toast.noShowError') || t('Failed to mark reservation as no show. Please try again.'))
      throw error
    } finally {
      isMarkingNoShow.value = false
    }
  }

  // Void reservation
  const voidReservation = async (reservationId: number, reason: any, refreshCallback?: () => Promise<void>) => {
    isVoidingReservation.value = true

    try {
      // TODO: Implement void reservation API call
      // const response = await voidReservationById(reservationId, reason)
      console.log('Voiding reservation:', reservationId, reason)

      toast.success(t('toast.voidReservationSuccess') || t('Reservation voided successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      // return response
    } catch (error) {
      console.error('Void reservation error:', error)
      toast.error(t('toast.voidReservationError') || t('Failed to void reservation. Please try again.'))
      throw error
    } finally {
      isVoidingReservation.value = false
    }
  }

  // Avhe (Unassign) room reservation
  const performAvhe = async (reservationId: number, payload: AvheReservationPayload, refreshCallback?: () => Promise<void>) => {
    isAvhe.value = true

    try {
      const response = await unAssignRoomReservation(reservationId, payload)
      console.log('Avhe response:', response)

      toast.success(t('toast.avheSuccess') || t('Room unassignment completed successfully!'))

      if (refreshCallback) {
        await refreshCallback()
      }

      return response
    } catch (error) {
      console.error('Avhe error:', error)
      toast.error(t('toast.avheError') || t('Failed to unassign room. Please try again.'))
      throw error
    } finally {
      isAvhe.value = false
    }
  }

  const handleNoShowConfirmed = async (noshowData: any) => {
    showNoShowModal.value = false;
  };

  // Undo Check-in
  const performUndoCheckIn = async (
    reservationId: number,
    payload: { reservationRooms: number[]; notes?: string },
    refreshCallback?: () => Promise<void>
  ) => {
    isUndoingCheckIn.value = true
    try {
      const response = await undoCheckInReservation(reservationId, payload)
      toast.success(t('toast.undoCheckInSuccess') || t('Check-in undone successfully!'))
      if (refreshCallback) { await refreshCallback() }
      return response
    } catch (error) {
      console.error('Undo check-in error:', error)
      toast.error(t('toast.undoCheckInError') || t('Failed to undo check-in. Please try again.'))
      throw error
    } finally {
      isUndoingCheckIn.value = false
    }
  }

  // Undo Check-out
  const performUndoCheckOut = async (
    reservationId: number,
    payload: { reservationRooms: number[]; notes?: string },
    refreshCallback?: () => Promise<void>
  ) => {
    isUndoingCheckOut.value = true
    try {
      const response = await undoCheckOutReservation(reservationId, payload)
      toast.success(t('toast.undoCheckOutSuccess'))
      if (refreshCallback) { await refreshCallback() }
      return response
    } catch (error) {
      console.error('Undo check-out error:', error)
      toast.error(t('toast.undoCheckOutError'))
      throw error
    } finally {
      isUndoingCheckOut.value = false
    }
  }

  return {
    // Loading states
    isCheckingIn,
    isCheckingOut,
    isAddingPayment,
    isAmendingStay,
    isMovingRoom,
    isStoppingRoomMove,
    isUpdatingInclusionList,
    isCancellingReservation,
    isMarkingNoShow,
    isVoidingReservation,
    isAvhe,
    isExchangingRoom,
    isUndoingCheckIn,
    isUndoingCheckOut,
    showNoShowModal,
    // Methods
    performCheckIn,
    performCheckOut,
    addPayment,
    amendStay,
    moveRoom,
    exchangeRoom,
    stopRoomMove,
    updateInclusionList,
    cancelReservation,
    markNoShow,
    voidReservation,
    performAvhe,
    handleNoShowConfirmed,
    performUndoCheckIn,
    performUndoCheckOut,

  }
}
