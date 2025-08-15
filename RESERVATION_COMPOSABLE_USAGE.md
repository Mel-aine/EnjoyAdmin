# useReservation Composable Usage Guide

The `useReservation` composable provides a centralized way to handle all reservation operations with built-in loading states and toast notifications.

## Import

```typescript
import { useReservation } from '@/composables/useReservation'
```

## Basic Usage

```vue
<script setup lang="ts">
import { useReservation } from '@/composables/useReservation'

const {
  // Loading states
  isCheckingIn,
  isCheckingOut,
  isAddingPayment,
  isAmendingStay,
  isMovingRoom,
  isExchangingRoom,
  isStoppingRoomMove,
  isUpdatingInclusionList,
  isCancellingReservation,
  isMarkingNoShow,
  isVoidingReservation,
  isUnassigningRoom,
  
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
} = useReservation()

// Example: Check-in function
const handleCheckIn = async () => {
  const payload = {
    reservationRooms: [1, 2, 3],
    actualCheckInTime: new Date().toISOString(),
    notes: "Guest arrived early",
    keyCardsIssued: 2,
    depositAmount: 100
  }
  
  await performCheckIn(reservationId, payload, refreshReservationData)
}
</script>

<template>
  <div>
    <!-- Check-in button with loading state -->
    <button 
      @click="handleCheckIn" 
      :disabled="isCheckingIn"
      class="btn btn-primary"
    >
      <Spinner v-if="isCheckingIn" class="w-4 h-4 mr-2" />
      {{ isCheckingIn ? $t('processing') : $t('check in') }}
    </button>
    
    <!-- Other operation buttons -->
    <button 
      @click="handleCheckOut" 
      :disabled="isCheckingOut"
      class="btn btn-secondary"
    >
      <Spinner v-if="isCheckingOut" class="w-4 h-4 mr-2" />
      {{ isCheckingOut ? $t('processing') : $t('check out') }}
    </button>
  </div>
</template>
```

## Available Operations

### 1. Check-in (`performCheckIn`)
```typescript
const payload: CheckInReservationPayload = {
  reservationRooms: number[],
  actualCheckInTime: string,
  notes: string,
  keyCardsIssued: number,
  depositAmount: number
}

await performCheckIn(reservationId, payload, refreshCallback?)
```

### 2. Check-out (`performCheckOut`)
```typescript
const payload: CheckOutReservationPayload = {
  reservationRooms: number[],
  actualCheckOutTime: string,
  notes: string,
  finalBill: number,
  depositRefund: number
}

await performCheckOut(reservationId, payload, refreshCallback?)
```

### 3. Add Payment (`addPayment`)
```typescript
const payload: PaymentPayload = {
  reservationId: number,
  amount: number,
  paymentMethod: string,
  notes?: string
}

await addPayment(payload, refreshCallback?)
```

### 4. Amend Stay (`amendStay`)
```typescript
const payload: AmendStayPayload = {
  reservationId: number,
  newCheckInDate?: string,
  newCheckOutDate?: string,
  newRoomType?: number,
  notes?: string
}

await amendStay(payload, refreshCallback?)
```

### 5. Room Move (`moveRoom`)
```typescript
const payload: RoomMovePayload = {
  reservationId: number,
  fromRoomId: number,
  toRoomId: number,
  moveDate: string,
  reason: string
}

await moveRoom(payload, refreshCallback?)
```

### 6. Exchange Room (`exchangeRoom`)
```typescript
const payload: RoomMovePayload = {
  reservationId: number,
  fromRoomId: number,
  toRoomId: number,
  moveDate: string,
  reason: string
}

await exchangeRoom(payload, refreshCallback?)
```

### 7. Stop Room Move (`stopRoomMove`)
```typescript
await stopRoomMove(reservationId, refreshCallback?)
```

### 8. Update Inclusion List (`updateInclusionList`)
```typescript
await updateInclusionList(reservationId, inclusions: string[], refreshCallback?)
```

### 9. Cancel Reservation (`cancelReservation`)
```typescript
const payload: CancelReservationPayload = {
  reservationId: number,
  reason: string,
  refundAmount?: number,
  notes?: string
}

await cancelReservation(payload, refreshCallback?)
```

### 10. Mark No Show (`markNoShow`)
```typescript
await markNoShow(reservationId, reason: string, refreshCallback?)
```

### 11. Void Reservation (`voidReservation`)
```typescript
await voidReservation(reservationId, reason: string, refreshCallback?)
```

### 12. Unassign Room (`unassignRoom`)
```typescript
await unassignRoom(reservationId, roomId: number, refreshCallback?)
```

## Features

- **Automatic Loading States**: Each operation has its own loading state
- **Toast Notifications**: Success and error messages are automatically displayed
- **Internationalization**: All messages support i18n with fallback text
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Refresh Callbacks**: Optional callbacks to refresh data after operations
- **TypeScript Support**: Full TypeScript interfaces for all payloads

## Icon Mapping

The composable works with the following icon mapping for UI components:

```typescript
const actionIconMap = {
  'check_in': CheckCircle,
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
}
```

## Translation Keys

All toast messages use the following translation keys:

- `toast.checkInSuccess` / `toast.checkInError`
- `toast.checkOutSuccess` / `toast.checkOutError`
- `toast.addPaymentSuccess` / `toast.addPaymentError`
- `toast.amendStaySuccess` / `toast.amendStayError`
- `toast.roomMoveSuccess` / `toast.roomMoveError`
- `toast.exchangeRoomSuccess` / `toast.exchangeRoomError`
- `toast.stopRoomMoveSuccess` / `toast.stopRoomMoveError`
- `toast.inclusionListSuccess` / `toast.inclusionListError`
- `toast.cancelReservationSuccess` / `toast.cancelReservationError`
- `toast.noShowSuccess` / `toast.noShowError`
- `toast.voidReservationSuccess` / `toast.voidReservationError`
- `toast.unassignRoomSuccess` / `toast.unassignRoomError`

These keys are available in both English (`en.json`) and French (`fr.json`) translation files.