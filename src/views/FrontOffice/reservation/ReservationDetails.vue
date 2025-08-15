<script setup lang="ts">
import { ArrowLeft, Building2Icon, PencilIcon,  User2Icon, CheckCircle, CreditCard, Calendar, ArrowUpDown, StopCircle, List, X, Eye, Trash2, UserMinus, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
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

// Simple Button component
const Button = {
    template: '<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"><slot /></button>'
};
const { t } = useI18n();
const reservation =ref<any>({})
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

const dropdownOptions = computed(() => [
    { id: 'check-in', label: t('Check-in'), icon: CheckCircle, color: 'text-blue-600' },
    { id: 'add-payment', label: t('Add Payment'), icon: CreditCard, color: 'text-green-600' },
    { id: 'amend-stay', label: t('Amend Stay'), icon: Calendar, color: 'text-purple-600' },
    { id: 'room-move', label: t('Room Move'), icon: ArrowUpDown, color: 'text-orange-600' },
    { id: 'exchange-room', label: t('Exchange Room'), icon: ArrowUpDown, color: 'text-indigo-600' },
    { id: 'stop-room-move', label: t('Stop Room Move'), icon: StopCircle, color: 'text-red-600' },
    { id: 'inclusion-list', label: t('Inclusion List'), icon: List, color: 'text-gray-600' },
    { id: 'cancel-reservation', label: t('Cancel Reservation'), icon: X, color: 'text-red-600' },
    { id: 'no-show', label: t('No Show'), icon: Eye, color: 'text-yellow-600' },
    { id: 'void-reservation', label: t('Void Reservation'), icon: Trash2, color: 'text-red-700' },
    { id: 'unassign-room', label: t('Unassign Room'), icon: UserMinus, color: 'text-gray-600' },
]);

const handleOptionSelected = (option: any) => {
    console.log('Selected option:', option);
    // Add your logic here for each option
};
const getBookingDetailsById = async () => {
    isLoading.value = true;
    const id = router.currentRoute.value.params.id;
    const response = await getReservationDetailsById(Number(id));
    console.log('reservation resuolt',reservation)
    if (response.status === 200) {
        reservation.value = response.data;
    }
    isLoading.value = false;
};
onMounted(()=>{
    getBookingDetailsById();
})
</script>

<template>
   <AdminLayout>
     <div class="h-full" v-if="reservation && reservation.id">
        <!--Header-->
        <div class="shadow-sm px-4 py-2 mx-4 bg-white  flex justify-between">
            <div class="flex gap-2 align-middle self-center items-center">
                <ArrowLeft></ArrowLeft>
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
                        <span>{{formatDateT(reservation.departDate)}}</span>
                        <span @click="">
                            <PencilIcon class="w-3" />
                        </span>
                    </span>
                </div>
                <!--Nigth-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold capitalize">{{ $t('nights') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>{{ reservation.nights }}</span>
                    </span>
                </div>
                <!--room/roomtype-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold">{{ $t('Room/Room types') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>14/Single</span>
                    </span>
                </div>
                <!--depature-->
                <div class="flex flex-col">
                    <span class="text-sm font-bold capitalize">{{ $t('res.no') }}</span>
                    <span class="text-xs flex gap-2">
                        <span>{{reservation.reservationNumber}}</span>
                    </span>
                </div>
            </div>
            <div class="flex gap-x-2">
                <span
                    class="border align-middle p-1 text-sm items-center self-center border-amber-600 text-amber-500">{{ $t(reservation.status) }}</span>
                <button class="bg-primary px-4 py-1 align-middle p-1 text-sm items-center self-center">{{ $t('check in')
                }}</button>
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
                    <ButtonDropdown
                        :options="dropdownOptions"
                        :button-text="$t('Options')"
                        button-class="bg-primary text-white hover:bg-primary/25"
                        dropdown-class="w-64"
                        @option-selected="handleOptionSelected"
                    />
                </div>
            </div>
        </div>
       <!--tab content-->
       <div v-if="activeTab === 'room_charges'">
            <RoomCharge :reservation-id="reservation.id"></RoomCharge>
       </div>
       <div v-if="activeTab === 'folio_operations'&&reservation && reservation.id" >
            <FoglioOperation :reservation-id="reservation.id" :reservation="reservation"></FoglioOperation>
       </div>
       <div v-if="activeTab === 'booking_details'">
            <BookingDetails :booking="reservation" ></BookingDetails>
       </div>
       <div v-if="activeTab === 'guest_details'">
        <GuestDetails :reservation="reservation" :guest="reservation.guest" />
       </div>
    </div>
   </AdminLayout>
</template>

<style></style>
