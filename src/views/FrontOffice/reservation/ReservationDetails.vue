<script setup lang="ts">
import { ArrowLeft, Building2Icon, PencilIcon, User2Icon, CheckCircle, CreditCard, Calendar, ArrowUpDown, StopCircle, List, X, Eye, Trash2, UserMinus, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import FoglioOperation from '../../../components/reservations/foglio/FoglioOperation.vue';
import RoomCharge from '../../../components/reservations/roomcharge/RoomCharge.vue';
import ButtonDropdown from '../../../components/common/ButtonDropdown.vue';
import BookingDetails from '../../../components/reservations/bookingdetails/BookingDetails.vue';
import { isLoading } from '../../../composables/spinner';
import router from '../../../router';
import { getReservationDetailsById } from '../../../services/api';
import AdminLayout from '../../../components/layout/AdminLayout.vue';
import Adult from '../../../icons/Adult.vue';
import Child from '../../../icons/Child.vue';
import { formatDateT } from '../../../components/utilities/UtilitiesFunction';
import GuestDetails from '../../../components/reservations/GuestDetails.vue';
import Spinner from '../../../components/spinner/Spinner.vue';
import { useReservation, type CheckInReservationPayload } from '../../../composables/useReservation';
import AddPaymentModal from '../../../components/reservations/foglio/AddPaymentModal.vue';

// Simple Button component
const Button = {
    template: '<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"><slot /></button>'
};
const isAddPaymentModalOpen = ref(false);
const { t } = useI18n();
const reservation = ref<any>({});

// Use the reservation composable
const {
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
} = useReservation();
const tabs = computed(() => [
    { id: 'folio_operations', label: t('Folio Operations') },
    { id: 'booking_details', label: t('Booking Details') },
    { id: 'guest_details', label: t('Guest Details') },
    { id: 'room_charges', label: t('Room Charges') },
    // { id: 'credid_card', label: t('Credit Card') },
    { id: 'audit_trial', label: t('Audit Trail') },

]);
const activeTab = ref<string>('folio_operations');
const isOpen = ref(false);

// Icon mapping for different actions
const actionIconMap = {
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
    if (!reservation.value?.availableActions) {
        return [];
    }

    return reservation.value.availableActions
        .filter((action: any) => action.available)
        .map((action: any) => ({
            id: action.action,
            label: action.label,
            description: action.description,
            route: action.route,
            icon: actionIconMap[action.action as keyof typeof actionIconMap] || List,
            color: actionColorMap[action.action as keyof typeof actionColorMap] || 'text-gray-600'
        }));
});
const checkInRerservation = async () => {
    const payload: CheckInReservationPayload = {
        reservationRooms: reservation.value?.reservationRooms.map((e: any) => {
            return e.id
        }),
        actualCheckInTime: (new Date()).toISOString(),
        notes: "",
        keyCardsIssued: 0,
        depositAmount: 0
    }
    
    await performCheckIn(reservation.value.id, payload, getBookingDetailsById);
}
const handleOptionSelected = (option: any) => {
    console.log('Selected option:', option);

    // Handle routing if route is provided
    if (option.route) {
        // You can implement navigation logic here
        // For example: router.push(option.route)
        console.log('Navigate to:', option.route);
    }

    // Add specific logic for different actions
    switch (option.id) {
        case 'check_in':
            checkInRerservation();
            break;
        case 'check_out':
            handleCheckOut();
            break;
        case 'add_payment':
            isAddPaymentModalOpen.value = true;
            break;
        case 'amend_stay':
            handleAmendStay();
            break;
        case 'room_move':
            handleRoomMove();
            break;
        case 'exchange_room':
            handleExchangeRoom();
            break;
        case 'stop_room_move':
            handleStopRoomMove();
            break;
        case 'inclusion_list':
            handleUpdateInclusionList();
            break;
        case 'cancel_reservation':
            handleCancelReservation();
            break;
        case 'no_show':
            handleMarkNoShow();
            break;
        case 'void_reservation':
            handleVoidReservation();
            break;
        case 'unassign_room':
            handleUnassignRoom();
            break;
        default:
            console.log('Action not implemented:', option.id);
    }
};
const getBookingDetailsById = async () => {
    isLoading.value = true;
    const id = router.currentRoute.value.params.id;
    const response = await getReservationDetailsById(Number(id));
    console.log('reservation resuolt', reservation)
    if (response.status === 200) {
        reservation.value = response.data;
    }
    isLoading.value = false;
};
// Computed property to calculate room/rate type summary
const roomRateTypeSummary = computed(() => {
    if (!reservation.value?.reservationRooms || reservation.value.reservationRooms.length === 0) {
        return 'N/A';
    }

    const reservationRooms = reservation.value.reservationRooms;
    const totalRooms = reservationRooms.length;

    // Get room numbers and create summary
    const roomNumbers = reservationRooms.map(room => {
        return `${room.room?.roomNumber}/${room.roomType.roomTypeName}`
    })



    return roomNumbers;
});
const closeAddPaymentModal = () => {
    isAddPaymentModalOpen.value = false;
}
const handleSavePayment = async () => {
    getBookingDetailsById();
    isAddPaymentModalOpen.value = false;
}

// Handler functions for different reservation operations
const handleCheckOut = async () => {
    const payload = {
        reservationRooms: reservation.value?.reservationRooms.map((e: any) => e.id),
        actualCheckOutTime: (new Date()).toISOString(),
        notes: "",
        finalBillAmount: 0,
        outstandingBalance: 0
    };
    
    await performCheckOut(reservation.value.id, payload, getBookingDetailsById);
};

const handleAmendStay = async () => {
    const payload = {
        newCheckInDate: reservation.value.arrivedDate,
        newCheckOutDate: reservation.value.departDate,
        reason: "Guest requested amendment",
        notes: ""
    };
    
    await amendStay(reservation.value.id, payload, getBookingDetailsById);
};

const handleRoomMove = async () => {
    const payload = {
        fromRoomId: reservation.value.reservationRooms[0]?.room?.id,
        toRoomId: null, // This should be selected by user in a modal
        moveDate: (new Date()).toISOString(),
        reason: "Guest requested room change",
        notes: ""
    };
    
    // TODO: Implement room selection modal
    console.log('Room move requires room selection modal');
    // await moveRoom(reservation.value.id, payload, getBookingDetailsById);
};

const handleExchangeRoom = async () => {
    const payload = {
        roomId1: reservation.value.reservationRooms[0]?.room?.id,
        roomId2: null, // This should be selected by user
        exchangeDate: (new Date()).toISOString(),
        reason: "Room exchange requested",
        notes: ""
    };
    
    // TODO: Implement room selection modal
    console.log('Room exchange requires room selection modal');
    // await exchangeRoom(reservation.value.id, payload, getBookingDetailsById);
};

const handleStopRoomMove = async () => {
    const payload = {
        moveId: null, // This should be the active move ID
        reason: "Move cancelled",
        notes: ""
    };
    
    await stopRoomMove(reservation.value.id, payload, getBookingDetailsById);
};

const handleUpdateInclusionList = async () => {
    const payload = {
        inclusions: [], // This should be selected by user
        effectiveDate: (new Date()).toISOString(),
        notes: ""
    };
    
    // TODO: Implement inclusion selection modal
    console.log('Inclusion list update requires selection modal');
    // await updateInclusionList(reservation.value.id, payload, getBookingDetailsById);
};

const handleCancelReservation = async () => {
    // Show confirmation dialog first
    if (confirm(t('toast.cancelReservationConfirm') || 'Are you sure you want to cancel this reservation?')) {
        const payload = {
            cancellationReason: "Guest requested cancellation",
            cancellationDate: (new Date()).toISOString(),
            refundAmount: 0,
            notes: ""
        };
        
        await cancelReservation(reservation.value.id, payload, getBookingDetailsById);
    }
};

const handleMarkNoShow = async () => {
    const payload = {
        noShowDate: (new Date()).toISOString(),
        reason: "Guest did not arrive",
        chargeNoShowFee: false,
        notes: ""
    };
    
    await markNoShow(reservation.value.id, payload, getBookingDetailsById);
};

const handleVoidReservation = async () => {
    // Show confirmation dialog first
    if (confirm(t('toast.voidReservationConfirm') || 'Are you sure you want to void this reservation?')) {
        const payload = {
            voidReason: "Administrative void",
            voidDate: (new Date()).toISOString(),
            notes: ""
        };
        
        await voidReservation(reservation.value.id, payload, getBookingDetailsById);
    }
};

const handleUnassignRoom = async () => {
    const payload = {
        roomIds: reservation.value?.reservationRooms.map((e: any) => e.room?.id).filter(Boolean),
        unassignDate: (new Date()).toISOString(),
        reason: "Room unassignment requested",
        notes: ""
    };
    
    await unassignRoom(reservation.value.id, payload, getBookingDetailsById);
};

onMounted(() => {
    getBookingDetailsById();
})
</script>

<template>
    <AdminLayout>
        <div class="h-full" v-if="reservation && reservation.id">
            <!--Header-->
            <div class="shadow-sm px-4 py-2 mx-4 bg-white  flex justify-between">
                <div class="flex gap-2 align-middle self-center items-center">
                    <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
                    <Building2Icon class="text-primary"></Building2Icon>
                    <span class="font-bold">{{ reservation.guest?.displayName }}</span>
                    <div class="flex">
                        <Adult class="w-5" />
                        <span class="text-sm items-end align-center self-center pt-2">{{ reservation.adults }}</span>
                    </div>
                    <div class="flex">
                        <Child class="w-4" />
                        <span class="text-sm items-end align-bottom self-center pt-2">{{ reservation.child }}</span>
                    </div>
                </div>
                <div class="flex gap-8">
                    <!--arrival Days-->
                    <div class="flex flex-col">
                        <span class="text-sm font-bold">{{ $t('booking.arrival') }}</span>
                        <span class="text-xs flex gap-2">
                            <span>{{ formatDateT(reservation.arrivedDate) }}</span>
                            <span>
                                <PencilIcon class="w-3" />
                            </span>
                        </span>
                    </div>
                    <!--depature-->
                    <div class="flex flex-col">
                        <span class="text-sm font-bold capitalize">{{ $t('booking.departure') }}</span>
                        <span class="text-xs flex gap-2">
                            <span>{{ formatDateT(reservation.departDate) }}</span>
                            <span @click="">
                                <PencilIcon class="w-3" />
                            </span>
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
                        <span class="text-xs flex gap-2 flex-col">
                            <span v-for="(i, ind) in roomRateTypeSummary" :key="ind">{{ i }}</span>
                        </span>
                    </div>
                    <!--depature-->
                    <div class="flex flex-col">
                        <span class="text-sm font-bold capitalize">{{ $t('res.no') }}</span>
                        <span class="text-xs flex gap-2">
                            <span>{{ reservation.reservationNumber }}</span>
                        </span>
                    </div>
                </div>
                <div class="flex gap-x-2">
                    <span
                        class="border align-middle p-1 text-sm items-center self-center border-amber-600 text-amber-500">{{
                            $t(reservation.status) }}</span>
                    <button 
                        @click="checkInRerservation"
                        :disabled="isCheckingIn"
                        class="bg-primary px-4 py-1 align-middle p-1 text-sm items-center self-center flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                        <Spinner v-if="isCheckingIn" class="w-4 h-4" />
                        <span>{{ isCheckingIn ? $t('processing') || 'Processing...' : $t('check in') }}</span>
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
                            button-class="bg-white text-primary border-primary hover:bg-primary/25"
                            dropdown-class="w-64" @option-selected="handleOptionSelected" />
                    </div>
                </div>
            </div>
            <!--tab content-->
            <div v-if="activeTab === 'room_charges'">
                <RoomCharge :reservation-id="reservation.id"></RoomCharge>
            </div>
            <div v-if="activeTab === 'folio_operations' && reservation && reservation.id">
                <FoglioOperation :reservation-id="reservation.id" :reservation="reservation"></FoglioOperation>
            </div>
            <div v-if="activeTab === 'booking_details'">
                <BookingDetails :booking="reservation"></BookingDetails>
            </div>
            <div v-if="activeTab === 'guest_details'">
                <GuestDetails :reservation="reservation" :guest="reservation.guest" />
            </div>
        </div>
    </AdminLayout>
    <template v-if="isAddPaymentModalOpen">
          <AddPaymentModal :reservation-id="reservation.id" :is-open="isAddPaymentModalOpen"
            @close="closeAddPaymentModal" @save="handleSavePayment" />
        </template>
</template>

<style></style>
