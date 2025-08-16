<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtomDropdownAction from '../common/ButtomDropdownAction.vue';
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, HouseIcon, List, StopCircle, Trash2, UserMinus, X } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { formatCurrency, formatTime } from '../utilities/UtilitiesFunction';
import router from '../../router';
import Child from '../../icons/Child.vue';
import Adult from '../../icons/Adult.vue';
import { useReservation } from '../../composables/useReservation';
import CancelReservation from './foglio/CancelReseravtion.vue';
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
    isCancelingReservation,
    isMarkingNoShow,
    isVoidingReservation,
    isUnassigningRoom,
    performCheckIn,
    performCheckOut,
    performAmendStay,
    performRoomMove,
    performExchangeRoom,
    performStopRoomMove,
    performUpdateInclusionList,
    performCancelReservation,
    performMarkNoShow,
    performVoidReservation,
    performUnassignRoom
} = useReservation();
const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})

// Cancel modal state
const showCancelModal = ref(false)

const handleCancelConfirmed = async (cancelData: any) => {
  showCancelModal.value = false
  if (props.reservation?.reservationNumber) {
    await performCancelReservation(props.reservation.reservationNumber, cancelData)
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

const dropdownOptions = computed(() => {
  // Always include the view option as first item
  const options = [{
    id: 'view',
    label: t('view'),
    icon: Eye,
    color: 'text-blue-600'
  }];
  console.log(props.reservation)
  // Add available actions from reservation data
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
      }));
    
    options.push(...availableOptions);
  }
  
  return options;
});

const handleOptionSelected = async (option: any) => {
  console.log('Selected option:', option);
  if (option.id === 'view') {
    router.push({
      name: 'ReservationDetails',
      params: { id: props.reservation.id }
    });
    return;
  }
  
  if (!props.reservation?.reservationNumber) {
    console.error('No reservation number available');
    return;
  }
  
  // Handle specific actions using the composable
  switch (option.id) {
    case 'add_payment':
      // Handle add payment - might need custom routing or modal
      console.log('Add payment action triggered');
      break;
    case 'check_in':
      await performCheckIn(props.reservation.reservationNumber);
      break;
    case 'check_out':
      await performCheckOut(props.reservation.reservationNumber);
      break;
    case 'amend_stay':
      await performAmendStay(props.reservation.reservationNumber);
      break;
    case 'room_move':
      await performRoomMove(props.reservation.reservationNumber);
      break;
    case 'exchange_room':
      await performExchangeRoom(props.reservation.reservationNumber);
      break;
    case 'stop_room_move':
      await performStopRoomMove(props.reservation.reservationNumber);
      break;
    case 'cancel_reservation':
      showCancelModal.value = true;
      break;
    case 'void_reservation':
      await performVoidReservation(props.reservation.reservationNumber);
      break;
    case 'unassign_room':
      await performUnassignRoom(props.reservation.reservationNumber);
      break;
    case 'inclusion_list':
      await performUpdateInclusionList(props.reservation.reservationNumber);
      break;
    case 'no_show':
      await performMarkNoShow(props.reservation.reservationNumber);
      break;
    default:
      console.log(`Action ${option.id} not handled`);
  }
};
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}
</script>

<template>
  <div class="z-10">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-visible group">
      <!-- Card Header -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center align-middle self-center gap-2">
            <HouseIcon class="w-8 h-8 text-primary" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate capitalize">
                {{ reservation.guest.displayName }}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                #{{ reservation.reservationNumber }}
              </p>
            </div>
          </div>
          <div class="flex gap-1">
            <ButtomDropdownAction :id="reservation.id" :options="dropdownOptions"
              @option-selected="handleOptionSelected" />

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
          <span>{{ reservation.nights??reservation.numberOfNights }}</span>
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
              <Child class="w-5 h-10" /><span class="pt-2 text-sm">{{ reservation.child??0 }}</span>
            </div>
          </div>

        </div>

        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class=" font-semibold">{{ $t('Room/Rate type') }}</span>
            <span class="text-xs">{{ reservation.roomType ?? $t('N/A') }}/{{ reservation.roomType ?? $t('N/A') }}</span>
          </div>
          <div class="flex gap-1">
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              reservation.statusColor.bg,
              reservation.statusColor.text
            ]">
              {{ reservation.statusColor.label }}
            </span>
          </div>
        </div>

        <!-- Amount and Payment Status -->
        <div class=" flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
          <div class="flex justify-between">
            <span class=" font-medium">{{ $t('Total') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.totalAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class=" font-medium">{{ $t('paid') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.paidAmount) }}</span>
          </div>
          <div class="flex justify-between text-primary">
            <span class=" font-medium">{{ $t('balance') }}</span>
            <span class="text-sm">{{ formatCurrency(reservation.remainingAmount) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Cancel Reservation Modal -->
  <CancelReservation 
    :is-open="showCancelModal" 
    :reservation-data="reservation"
    @close="showCancelModal = false"
    @cancel-confirmed="handleCancelConfirmed"
  />
</template>

<style></style>