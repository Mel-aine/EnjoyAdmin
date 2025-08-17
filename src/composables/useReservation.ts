import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { 
  checkInReservation, 
  checkOutReservation,
  getReservationDetailsById 
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
  notes: string
  finalBill: number
  depositRefund: number
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

export function useReservation() {
  const toast = useToast()
  const { t } = useI18n()
  
  // Loading states for each operation
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
  const isUnassigningRoom = ref(false)
  const isExchangingRoom = ref(false)

  // Check-in reservation
  const performCheckIn = async (reservationId: number, payload: CheckInReservationPayload, refreshCallback?: () => Promise<void>) => {
    isCheckingIn.value = true
    
    try {
      const response = await checkInReservation(reservationId, payload)
      console.log('Check-in response:', response)
      
      toast.success(t('toast.checkInSuccess') || 'Check-in completed successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      return response
    } catch (error) {
      console.error('Check-in error:', error)
      toast.error(t('toast.checkInError') || 'Failed to complete check-in. Please try again.')
      throw error
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
      
      toast.success(t('toast.checkOutSuccess') || 'Check-out completed successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      return response
    } catch (error) {
      console.error('Check-out error:', error)
      toast.error(t('toast.checkOutError') || 'Failed to complete check-out. Please try again.')
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
      
      toast.success(t('toast.addPaymentSuccess') || 'Payment added successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Add payment error:', error)
      toast.error(t('toast.addPaymentError') || 'Failed to add payment. Please try again.')
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
      
      toast.success(t('toast.amendStaySuccess') || 'Stay amended successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Amend stay error:', error)
      toast.error(t('toast.amendStayError') || 'Failed to amend stay. Please try again.')
      throw error
    } finally {
      isAmendingStay.value = false
    }
  }

  // Room move
  const moveRoom = async (payload: RoomMovePayload, refreshCallback?: () => Promise<void>) => {
    isMovingRoom.value = true
    
    try {
      // TODO: Implement room move API call
      // const response = await moveReservationRoom(payload)
      console.log('Moving room:', payload)
      
      toast.success(t('toast.roomMoveSuccess') || 'Room moved successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Room move error:', error)
      toast.error(t('toast.roomMoveError') || 'Failed to move room. Please try again.')
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
      
      toast.success(t('toast.exchangeRoomSuccess') || 'Room exchanged successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Room exchange error:', error)
      toast.error(t('toast.exchangeRoomError') || 'Failed to exchange room. Please try again.')
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
      
      toast.success(t('toast.stopRoomMoveSuccess') || 'Room move stopped successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Stop room move error:', error)
      toast.error(t('toast.stopRoomMoveError') || 'Failed to stop room move. Please try again.')
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
      
      toast.success(t('toast.inclusionListSuccess') || 'Inclusion list updated successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Update inclusion list error:', error)
      toast.error(t('toast.inclusionListError') || 'Failed to update inclusion list. Please try again.')
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
      
      toast.success(t('toast.cancelReservationSuccess') || 'Reservation cancelled successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Cancel reservation error:', error)
      toast.error(t('toast.cancelReservationError') || 'Failed to cancel reservation. Please try again.')
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
      
      toast.success(t('toast.noShowSuccess') || 'Reservation marked as no show successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Mark no show error:', error)
      toast.error(t('toast.noShowError') || 'Failed to mark reservation as no show. Please try again.')
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
      
      toast.success(t('toast.voidReservationSuccess') || 'Reservation voided successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Void reservation error:', error)
      toast.error(t('toast.voidReservationError') || 'Failed to void reservation. Please try again.')
      throw error
    } finally {
      isVoidingReservation.value = false
    }
  }

  // Unassign room
  const unassignRoom = async (reservationId: number, roomId: number, refreshCallback?: () => Promise<void>) => {
    isUnassigningRoom.value = true
    
    try {
      // TODO: Implement unassign room API call
      // const response = await unassignReservationRoom(reservationId, roomId)
      console.log('Unassigning room for reservation:', reservationId, roomId)
      
      toast.success(t('toast.unassignRoomSuccess') || 'Room unassigned successfully!')
      
      if (refreshCallback) {
        await refreshCallback()
      }
      
      // return response
    } catch (error) {
      console.error('Unassign room error:', error)
      toast.error(t('toast.unassignRoomError') || 'Failed to unassign room. Please try again.')
      throw error
    } finally {
      isUnassigningRoom.value = false
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
    isUnassigningRoom,
    isExchangingRoom,
    
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
    unassignRoom
  }
}