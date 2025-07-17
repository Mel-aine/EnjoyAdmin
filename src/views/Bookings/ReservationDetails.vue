<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-100 lg:p-2 font-inter" v-if="selectBooking">
      <div class="max-w-5xl mx-auto bg-white rounded-xl overflow-hidden">

        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-2 text-white text-center rounded-t-xl">
          <h1 class="text-2xl font-bold mb-2">{{ $t('hotel_reservation_details') }}</h1>
          <p class="text-lg">{{ $t('reservation_id') }}: <span class="font-semibold">{{ selectBooking?.reservationNumber
          }}</span></p>
        </div>

        <div class="p-6 space-y-8">
          <!-- 1. General Reservation Information -->
          <section class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
            <SectionHeader :icon="Hotel" :title="$t('general_reservation_information')" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem :icon="User" :label="$t('guest_name')" :value="selectBooking?.user.firstName" />
              <div class="flex items-center text-gray-700 mb-2">
                <img v-if="selectBooking.user?.profilePhoto" :src="selectBooking.user?.profilePhoto"
                  :alt="$t('profile')" class="w-8 h-8 rounded-full mr-2" />
                <Mail class="mr-2 text-gray-500" :size="18" />
                <span class="font-medium">{{ $t('email') }}:</span> <span class="ml-1">{{ selectBooking.user?.email
                }}</span>
              </div>
              <DetailItem :icon="Phone" :label="$t('phone')" :value="selectBooking.user?.phoneNumber" />
              <DetailItem :icon="Tag" :label="$t('booking_source')" :value="selectBooking.bookingSource" />
              <DetailItem :icon="Calendar" :label="$t('reservation_date')"
                :value="formatDate(selectBooking.createdAt)" />
              <DetailItem :icon="Clock" :label="$t('expected_arrive_date')"
                :value="formatDate(selectBooking.arrivedDate)" />
              <DetailItem :icon="Clock" :label="$t('expected_departure_date')"
                :value="formatDate(selectBooking.departDate)" />

              <DetailItem :icon="Clock" :label="$t('check_in')"
                :value="`${selectBooking.checkInDate ? formatDate(selectBooking.checkInDate) : ''}`" />
              <DetailItem :icon="Clock" :label="$t('check_out')"
                :value="`${selectBooking.checkOutDate ? formatDate(selectBooking.checkOutDate) : ''}`" />

              <DetailItem :icon="Bed" :label="$t('total_nights')"
                :value="`${selectBooking.numberOfNights} ${$t('nights')}`" />
              <div class="flex items-center text-gray-700">
                <RefreshCcw class="mr-2 text-gray-500" :size="18" />
                <span class="font-medium">{{ $t('status') }}:</span>
                <span class="ml-2 px-3 py-1 rounded-full text-sm font-semibold"
                  :class="statusClass(selectBooking.status)">
                  {{ $t(selectBooking.status.toLowerCase()) }}
                </span>
              </div>
            </div>
          </section>

          <!-- 2. Room Breakdown -->
          <section class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
            <SectionHeader :icon="Bed" :title="$t('room_breakdown')" />
            <div v-for="(room, index) in selectBooking?.reservationServiceProducts" :key="room.id"
              class="mb-6 p-4 rounded-lg border"
              :class="index % 2 === 0 ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'">
              <h3 class="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <Hotel class="mr-2 text-blue-700" :size="18" />
                {{ room.serviceProduct.productName }}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                <DetailItem :icon="Users" :label="$t('guests')"
                  :value="`${room.totalAdult} ${$t('adults')}, ${room.totalChildren} ${$t('children')}`" />
                <div class="flex items-center">
                  <RefreshCcw class="mr-2 text-gray-500" :size="18" />
                  <span class="font-medium">{{ $t('status') }}:</span>
                  <span class="ml-2 px-3 py-1 rounded-full text-sm font-semibold"
                    :class="statusClass(room.status ?? '')">
                    {{ room.status ? $t(room.status?.toLowerCase().replace(' ', '_')) : '' }}
                  </span>
                </div>
                <DetailItem :icon="DollarSign" :label="$t('rate_per_night')"
                  :value="formatCurrency(room.ratePerNight)" />
                <DetailItem :icon="Tag" :label="$t('taxes')" :value="formatCurrency(room.taxes)" />
                <DetailItem v-if="room.extraGuest" :icon="User2Icon" :label="$t('ExtraGuest')"
                  :value="`${room.extraGuest}`" />
                <DetailItem v-if="room.extraGuest" :icon="User2Icon" :label="$t('ExtraGuestFee')"
                  :value="`${formatCurrency(room.totalExtraGuestPrice ?? 0)}`" />
                <DetailItem :icon="Clock" :label="$t('check_in')"
                  :value="`${room.checkInDate ? formatDateT(room.checkInDate) : ''}`" />
                <DetailItem :icon="Clock" :label="$t('check_out')"
                  :value="`${room.checkOutDate ? formatDateT(room.checkOutDate) : ''}`" />

                <DetailItem :icon="Tag" :label="$t('discounts')" :value="`-${formatCurrency(room.discounts)}`" />
                <DetailItem :icon="CreditCard" :label="$t('total_room_price')"
                  :value="formatCurrency(room.totalAmount)" />
              </div>
            </div>
          </section>

          <!-- 3. Payment Section -->
          <section class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
            <SectionHeader :icon="DollarSign" :title="$t('payment_details')" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 font-semibold text-lg mb-4">
              <div class="flex items-center">
                <DollarSign class="mr-2 text-green-600" :size="20" />
                <span>{{ $t('total_amount') }}: {{ formatCurrency(selectBooking?.finalAmount) }}</span>
              </div>
              <div class="flex items-center">
                <CreditCard class="mr-2 text-blue-600" :size="20" />
                <span>{{ $t('amount_paid') }}: {{ formatCurrency(selectBooking?.paidAmount) }}</span>
              </div>
            </div>
            <div class="mb-4">
              <div v-if="paymentStatus === 'Unpaid'"
                class="bg-red-100 text-red-800 p-3 rounded-md flex items-center justify-between">
                <span class="font-bold flex items-center">
                  <AlertCircle :size="20" class="mr-2" />{{ $t('remaining_balance') }}: {{
                    formatCurrency(selectBooking.remainingAmount) }}
                </span>
                <button @click="handleAction('payNow')"
                  class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-red-600 hover:bg-red-700 text-white">
                  {{ $t('pay_now') }}
                </button>
              </div>
              <div v-if="paymentStatus === 'Partially Paid'"
                class="bg-yellow-100 text-yellow-800 p-3 rounded-md flex items-center justify-between">
                <span class="font-bold flex items-center">
                  <AlertCircle :size="20" class="mr-2" />{{ $t('remaining_balance') }}: {{
                    formatCurrency(selectBooking.remainingAmount) }}
                </span>
                <button @click="handleAction('payRemaining')"
                  class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-yellow-600 hover:bg-yellow-700 text-white">
                  {{ $t('pay_remaining') }}
                </button>
              </div>
              <div v-if="paymentStatus === 'Fully Paid'"
                class="bg-green-100 text-green-800 p-3 rounded-md font-bold flex items-center">
                <CheckCircle :size="20" class="mr-2" />{{ $t('paid_in_full') }}
              </div>
              <div v-if="paymentStatus === 'Overpaid'"
                class="bg-purple-100 text-purple-800 p-3 rounded-md font-bold flex items-center">
                <AlertCircle :size="20" class="mr-2" />{{ $t('refund_due') }}: {{
                  formatCurrency(selectBooking.paidAmount - selectBooking.totalAmount) }}
              </div>
            </div>

            <div class="text-gray-700">
              <p class="font-medium flex items-center mb-2">
                <CreditCard :size="16" class="mr-2 text-gray-600" />{{ $t('payment_methods_used') }}:
              </p>
              <ul class="list-disc list-inside ml-2">
                <li v-for="(pm, i) in selectBooking.payments" :key="i">{{ pm.transactionId }} - {{ pm.paymentMethod }} -
                  {{
                    formatCurrency(pm.amountPaid) }} on {{ formatDate(pm.paymentDate) }}</li>
              </ul>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200 flex gap-2.5">
              <button v-if="selectBooking?.invoiceAvailable" @click="downloadReceipt"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md inline-flex items-center shadow-sm transition duration-300 ease-in-out transform hover:scale-105">
                <Download :size="18" class="mr-2" /> {{ $t('download_invoice_receipt') }}
              </button>
            </div>

            <div v-if="selectBooking.status === 'Cancelled' && selectBooking?.paidAmount > 0"
              class="mt-4 pt-4 border-t border-gray-200 bg-red-50 p-3 rounded-md text-red-800">
              <p class="font-bold flex items-center">
                <XCircle :size="18" class="mr-2" /> {{ $t('reservation_cancelled_refund') }} ({{
                  formatCurrency(selectBooking.paidAmount) }})
              </p>
              <button @click="showToast('Simulating refund process...')"
                class="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                {{ $t('process_refund_admin') }}
              </button>
            </div>
          </section>

          <!-- 4. Actions Section -->
          <section class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
            <SectionHeader :icon="PlusCircle" :title="$t('actions')" />
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <!-- Edit Reservation Button -->
              <button v-if="canEditOrCancel" @click="editReservation"
                class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-purple-600 hover:bg-purple-700 text-white"
                :disabled="!canEditOrCancel">
                <Edit :size="18" class="mr-2" /> {{ $t('edit_reservation') }}
              </button>

              <!-- Cancel Reservation Button -->
              <button v-if="canEditOrCancel" @click="isCancel = true"
                class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-red-500 hover:bg-red-600 text-white"
                :disabled="!canEditOrCancel">
                <Trash2 :size="18" class="mr-2" /> {{ $t('cancel_reservation') }}
              </button>

              <!-- Check-in All Rooms Button -->
              <template v-if="selectBooking.reservationServiceProducts.length > 0">
                <button v-if="canCheckInAll" @click="handleAction('checkInAll')"
                  class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-green-500 hover:bg-green-600 text-white"
                  :disabled="!canCheckInAll">
                  <LogIn :size="18" class="mr-2" /> {{ $t('check_in_all_rooms') }}
                </button>
              </template>

              <!-- Check-out All Rooms Button -->
              <template v-if="selectBooking.reservationServiceProducts.length > 0">
                <button v-if="canCheckOutAll" @click="handleAction('checkOutAll')"
                  class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-orange-500 hover:bg-orange-600 text-white"
                  :disabled="!canCheckOutAll">
                  <LogOut :size="18" class="mr-2" /> {{ $t('check_out_all_rooms') }}
                </button>
              </template>

              <!-- Individual Room Actions -->
              <template v-for="room in selectBooking.reservationServiceProducts"
                :key="`room-actions-${room.serviceProduct.id}`">
                <!-- Check-in Room Button -->
                <button v-if="canCheckInRoom(room)" @click="handleAction('checkInRoom', room.id)"
                  class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-green-500 hover:bg-green-600 text-white"
                  :disabled="!canCheckInRoom(room)">
                  <LogIn :size="18" class="mr-2" /> {{ $t('check_in_room') }} {{ room.serviceProduct.productName }}
                </button>

                <!-- Check-out Room Button -->
                <button v-if="canCheckOutRoom(room)" @click="handleAction('checkOutRoom', room.id)"
                  class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-orange-500 hover:bg-orange-600 text-white"
                  :disabled="!canCheckOutRoom(room)">
                  <LogOut :size="18" class="mr-2" /> {{ $t('check_out_room') }} {{ room.serviceProduct.productName }}
                </button>
              </template>

              <!-- Add Notes/Comments Button (always visible for now) -->
              <button @click="showToast('Simulating Add Notes...')"
                class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-600 hover:bg-gray-700 text-white">
                <MessageSquare :size="18" class="mr-2" /> {{ $t('add_notes_comments') }}
              </button>

              <!-- Extend Stay Button -->
              <button v-if="canExtendStay" @click="isExtendStay = true"
                class="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-indigo-500 hover:bg-indigo-600 text-white"
                :disabled="!canExtendStay">
                <Calendar :size="18" class="mr-2" /> {{ $t('extend_stay') }}
              </button>
            </div>
          </section>
          <!-- 7. Activity Logs / Audit Trail -->

          <template v-if="activitiesLogs && activitiesLogs.length > 0">
            <ActivitiesLogs :activity-logs="activitiesLogs" />
          </template>


        </div>
      </div>
    </div>
    <OverLoading v-if="isLoading" />
    <template v-if="isCancel">
      <CancelBookingDetails :show-modal="isCancel" @close="isCancel = false" />
    </template>
    <template v-if="isExtendStay">
      <ExtendStay :show-modal="isExtendStay" @close="isExtendStay = false" :reservation="selectBooking"
        @extend-stay="refrechPage" />
    </template>
    <template v-if="selectBooking">
      <PaymentModal :reservation="selectBooking" :is-open="openPayment" @close="openPayment = false"
        @payment-recorded="getPaymentDetails" />
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import DetailItem from '@/components/common/DetailItem.vue';
import {
  User, Mail, Phone, Calendar, Hotel, DollarSign, CreditCard, CheckCircle, XCircle,
  Clock, Tag, Bed, Users, Download, Edit, Trash2, Key, LogIn, LogOut,
  MessageSquare, PlusCircle, AlertCircle, RefreshCcw, User2Icon
} from 'lucide-vue-next';
import type { ActivityLog, ReservationDetails } from '@/utils/models';
import router from '@/router';
import { getReservationDetailsById, getReservationHistoryById } from '@/services/api';
import OverLoading from '@/components/spinner/OverLoading.vue';
import { formatCurrency, formatDateT } from '@/components/utilities/UtilitiesFunction';
import PaymentModal from './PaymentModal.vue';
import ActivitiesLogs from '../Setting/ActivitiesLogs.vue';
import { isBefore, isToday, parseISO } from 'date-fns'; // Import date-fns utilities
import { checkInReservation, checkOutReservation } from '@/services/reservation';
import CancelBookingDetails from './CancelBookingDetails.vue';
import ExtendStay from './ExtendStay.vue';

const reservation_id = router.currentRoute.value.params.id as string;
const isLoading = ref(false);
const activitiesLogs = ref<ActivityLog[]>([]);
const getBookingDetails = async () => {
  isLoading.value = true;
  const response = await getReservationDetailsById(parseInt(reservation_id))
  activitiesLogs.value = await (await getReservationHistoryById(parseInt(reservation_id))).data
  if (response.status === 200) {
    selectBooking.value = response.data;
  }
  isLoading.value = false;

}
const openPayment = ref(false);
const selectBooking = ref<ReservationDetails | null>(null)
// Methods
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const refrechPage = () => {
  getBookingDetails();
  isExtendStay.value=false;
}
const isCancel = ref(false);
const isExtendStay = ref(false);

const getPaymentStatus = () => {
  const payment = {
    totalAmount: parseFloat(`${selectBooking.value?.finalAmount ?? 0}`),
    paidAmount: parseFloat(`${selectBooking.value?.paidAmount ?? 0}`),
    remainingBalance: parseFloat(`${selectBooking.value?.remainingAmount ?? 0}`),
  };
  if (payment.remainingBalance <= 0 && payment.paidAmount >= payment.totalAmount) {
    if (payment.paidAmount > payment.totalAmount) return 'Overpaid';
    return 'Fully Paid';
  } else if (payment.paidAmount > 0 && payment.remainingBalance > 0) {
    return 'Partially Paid';
  } else if (payment.paidAmount === 0) {
    return 'Unpaid';
  }
  return 'Unknown';
};

const paymentStatus = computed(getPaymentStatus);
console.log('paymentStatus', paymentStatus.value);
const allRoomsCheckedIn = computed(() => selectBooking.value?.reservationServiceProducts.every(room => room.serviceProduct.status === 'Checked-in'));
const allRoomsCheckedOut = computed(() => selectBooking.value?.reservationServiceProducts.every(room => room.serviceProduct.status === 'Checked-out'));
const anyRoomCheckedIn = computed(() => selectBooking.value?.reservationServiceProducts.some(room => room.serviceProduct.status === 'Checked-in'));
const anyRoomCheckedOut = computed(() => selectBooking.value?.reservationServiceProducts.some(room => room.serviceProduct.status === 'Checked-out'));

// New computed properties for date and status checks
const isArrivalDateInFuture = computed(() => {
  if (!selectBooking.value?.arrivedDate) return false;
  // This checks if the arrival date is *after* the current date.
  // If you want "not yet arrived", it means the arrival date is in the future.
  // So, isBefore(currentDate, arrivalDate)
  return isBefore(new Date(), parseISO(selectBooking.value.arrivedDate));
});

const isArrivalDateTodayOrPast = computed(() => {
  if (!selectBooking.value?.arrivedDate) return false;
  const arrivalDate = parseISO(selectBooking.value.arrivedDate);
  // This checks if the arrival date is today or has already passed.
  return isToday(arrivalDate) || isBefore(arrivalDate, new Date());
});

const isReservationConfirmOrPending = computed(() => {
  if (!selectBooking.value?.status) return false;
  const status = selectBooking.value.status.toLowerCase();
  return status === 'confirmed' || status === 'en attente';
});

const isReservationCheckedIn = computed(() => {
  return selectBooking.value?.status.toLowerCase() === 'checked-in';
});

// Computed properties for button visibility/disability
const canEditOrCancel = computed(() => {
  if (!selectBooking.value) return false;
  return isArrivalDateInFuture.value && isReservationConfirmOrPending.value;
});

const canCheckInAll = computed(() => {
  if (!selectBooking.value) return false;
  return (selectBooking.value.status.toLowerCase() === 'confirmed' || selectBooking.value.status.toLowerCase() === 'en attente') &&
    isArrivalDateTodayOrPast.value &&
    !allRoomsCheckedIn.value &&
    selectBooking.value.status.toLowerCase() !== 'cancelled' &&
    selectBooking.value.status.toLowerCase() !== 'no-show' &&
    paymentStatus.value === 'Fully Paid';
});

const canCheckOutAll = computed(() => {
  if (!selectBooking.value) return false;
  return allRoomsCheckedIn.value &&
    !allRoomsCheckedOut.value &&
    selectBooking.value.status.toLowerCase() !== 'cancelled' &&
    selectBooking.value.status.toLowerCase() !== 'no-show' &&
    selectBooking.value.status.toLowerCase() !== 'checked-out';
});

const canCheckInRoom = (room: any) => {
  if (!selectBooking.value) return false;
  return room.status.toLowerCase() === 'pending' &&
    isArrivalDateTodayOrPast.value &&
    paymentStatus.value === 'Fully Paid';
};

const canCheckOutRoom = (room: any) => {
  if (!selectBooking.value) return false;
  return room.status.toLowerCase() === 'checked-in';
};

const canExtendStay = computed(() => {
  if (!selectBooking.value) return false;
  return isReservationCheckedIn.value &&
    !anyRoomCheckedOut.value &&
    selectBooking.value.status.toLowerCase() !== 'cancelled' &&
    selectBooking.value.status.toLowerCase() !== 'no-show';
});
const handleAction = async (actionType: string, roomId: number | null = null) => {
  console.log(`Action: ${actionType} for Room ID: ${roomId || 'All Rooms'}`);
  const rooms = selectBooking.value?.reservationServiceProducts.map((e) => {
    const room = e.serviceProduct;
    return room;
  })

  if (actionType === 'checkInAll') {
    isLoading.value = true;
    const requestBody = {
      reservationServiceProducts: selectBooking.value?.reservationServiceProducts.map((e) => e.id)
    };
    if (selectBooking.value?.id) {
      const response = await checkInReservation(selectBooking.value?.id, requestBody);
      if (response.status === 200) {
        //Success Message
      } else {
        //TODO Error Message
      }
    }
    isLoading.value = false;
  } else if (actionType === 'checkOutAll') {
    isLoading.value = true;
    const requestBody = {
      reservationServiceProducts: selectBooking.value?.reservationServiceProducts.map((e) => e.id)
    };
    if (selectBooking.value?.id) {
      const response = await checkOutReservation(selectBooking.value?.id, requestBody);
      if (response.status === 200) {
        //Success Message
      } else {
        //TODO Error Message
      }
    }
    isLoading.value = false;
  } else if (actionType === 'checkInRoom' && roomId) {
    isLoading.value = true;
    const requestBody = {
      reservationServiceProducts: [roomId]
    };
    if (selectBooking.value?.id) {
      const response = await checkInReservation(selectBooking.value?.id, requestBody);
      if (response.status === 200) {
        //Success Message
      } else {
        //TODO Error Message
      }
    }
    isLoading.value = false
  } else if (actionType === 'checkOutRoom' && roomId) {
    isLoading.value = true;
    const requestBody = {
      reservationServiceProducts: [roomId]
    };
    if (selectBooking.value?.id) {
      const response = await checkOutReservation(selectBooking.value?.id, requestBody);
      if (response.status === 200) {
        //Success Message
      } else {
        //TODO Error Message
      }
    }
    isLoading.value = false;
  } else if (actionType === 'cancelReservation') {
    if (selectBooking.value) {
      const updatedReservation = selectBooking.value;
      updatedReservation.status = 'Cancelled';
      const roomsUpdate = rooms?.map((e) => {
        e.status = 'available';
        return e;
      });
      console.log('roomsUpdate', roomsUpdate)
      //Todo Update the data

    }

    //updatedReservation.activityLog.push({ timestamp: new Date().toISOString(), description: 'Reservation cancelled.', by: 'User' });
  } else if (actionType === 'payNow' || actionType === 'payRemaining') {
    openPayment.value = true;
  }
};

const toast = useToast();
const showToast = (message: string) => {
  toast.info(message);
};

const statusClass = (status: string) => {
  // Explicitly list the status values for clarity, matching the proposed enum/union type
  switch (status.toLowerCase()) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'confirmedd': return 'bg-green-100 text-green-800';
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'en attente': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'no-show': return 'bg-red-100 text-red-800';
    case 'checked_in': return 'bg-blue-100 text-blue-800';
    case 'checked-out': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const downloadReceipt = async () => {
  if (!selectBooking.value?.payments || selectBooking.value?.payments.length < 1) return;
  router.push({ name: 'ViewInvoice', params: { id: selectBooking.value?.payments[0].id } });
}
onMounted(() => {
  getBookingDetails();
});
const getPaymentDetails = async (pay: any) => {
}
const editReservation = async () => {
  router.push({ name: 'EditBooking', params: { id: selectBooking.value?.id } })
}
</script>
