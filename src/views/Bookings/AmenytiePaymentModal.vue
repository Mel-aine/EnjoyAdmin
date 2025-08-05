<template>
    <div v-if="isOpen" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 bg-opacity-50"
        @click.self="closeModal">
        <div
            class="relative w-full max-w-3xl  max-h-11/12 overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 shadow-xl slide-in">
            <!-- Close button -->
            <button @click="closeModal"
                class="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>

            <div class="bg-white dark:bg-gray-900 p-6 rounded-xl">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Wallet class="mr-2 text-blue-600" :size="24" />
                    {{ $t('ConfirmPayment') }}
                </h2>

                <!-- Financial Summary for Main Reservation -->
                <div
                    class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-2">
                        <DollarSign class="mr-2 text-blue-700 dark:text-blue-400" :size="20" />
                        {{ $t('ReservationTotal') }}: <span class="ml-2 font-bold">{{
                            formatCurrency(reservation.finalAmount) }}</span>
                    </p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-2">
                        <CreditCard class="mr-2 text-green-700 dark:text-green-400" :size="20" />
                        {{ $t('ReservationPaid') }}: <span class="ml-2 font-bold text-green-700 dark:text-green-400">{{
                            formatCurrency(reservation.paidAmount) }}</span>
                    </p>
                    <p
                        :class="['text-xl font-bold flex items-center', reservationRemainingBalance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
                        <Banknote class="mr-2" :size="24" />
                        {{ $t('ReservationRemaining') }}: <span class="ml-2">{{
                            formatCurrency(reservationRemainingBalance) }}</span>
                    </p>
                </div>
                <!-- Overall Payment Status -->
                <div v-if="overallPaymentStatus === 'fully_paid'"
                    class="bg-green-100 text-green-800 p-4 rounded-md text-center font-semibold text-lg flex items-center justify-center">
                    <CheckCircle class="mr-2" :size="24" />
                    {{ $t('AllPaidInFull') }}
                </div>
                <div v-else-if="overallPaymentStatus === 'overpaid'"
                    class="bg-purple-100 text-purple-800 p-4 rounded-md text-center font-semibold text-lg flex items-center justify-center">
                    <AlertCircle class="mr-2" :size="24" />
                    {{ $t('RefundDue') }}: {{ formatCurrency(Math.abs(totalAmountDue)) }}
                </div>
                <!-- Payment Form -->
                <form v-else @submit.prevent="handlePaymentSubmit" class="space-y-4">
                    <div>
                        <label for="paymentAmount"
                            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
                                $t('Amount') }}:</label>
                        <input type="number" id="paymentAmount" v-model="paymentAmount" min="0.01" step="0.01"
                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :placeholder="`Ex: ${totalAmountDue.toFixed(2)}`" required />
                    </div>
                    <div>
                        <label for="paymentMethod"
                            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
                                $t('PaymentMethod') }}:</label>
                        <select id="paymentMethod" v-model="paymentMethod"
                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            required>
                            <option v-for="method in availablePaymentMethods" :key="method" :value="method">{{
                                $t(method) }}</option>
                        </select>
                    </div>
                    <div>
                        <label for="transactionRef"
                            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{{
                                $t('TransactionRef') }} ({{ $t('Optional') }}):</label>
                        <input type="text" id="transactionRef" v-model="transactionRef"
                            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :placeholder="$t('TransactionRefPlaceholder')" />
                    </div>
                    <button type="submit" :disabled="isLoading"
                        class="mt-4 w-full flex items-center justify-center rounded-md bg-primary px-4 py-2 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-primary/50 transform hover:scale-105">
                        <DotSpinner v-if="isLoading" />
                        <DollarSign v-else class="mr-2" :size="18" />
                        {{ $t('RecordPayment') }}
                    </button>
                </form>
                <!-- Unpaid Amenity Bookings Section -->
                <div v-if="unPaidDetails.unpaidAmenityBookings && unPaidDetails.unpaidAmenityBookings.length > 0"
                    class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-5">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                        <ShoppingCart class="mr-2 text-yellow-700 dark:text-yellow-400" :size="22" />
                        {{ $t('UnpaidAmenities') }}
                    </h3>
                    <div class="space-y-3 grid grid-cols-1">
                        <div v-for="booking in unPaidDetails.unpaidAmenityBookings" :key="booking.id"
                            class="bg-white dark:bg-gray-800 p-3  rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <label class="flex items-center justify-between cursor-pointer">
                                <div class="flex items-center">
                                    <input type="checkbox" :value="booking.id" v-model="selectedAmenityBookingIds"
                                        class="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:focus:ring-blue-600">
                                    <span class="ml-3 text-base font-medium text-gray-800 dark:text-gray-200">
                                        {{ $t('Order') }} #{{ booking.amenityOrderNumber }}:
                                    </span>
                                </div>
                                <span class="text-lg font-bold text-blue-700 dark:text-blue-400">
                                    {{ formatCurrency(booking.totalAmount) }}
                                </span>
                            </label>
                            <!-- Collapsible Amenity Items -->
                            <details class="mt-2 text-gray-600 dark:text-gray-400">
                                <summary
                                    class="cursor-pointer text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400">
                                    {{ $t('ViewDetails') }} ({{ booking.items.length }} {{ $t('items') }})
                                </summary>
                                <ul class="list-disc list-inside ml-4 mt-2 text-sm">
                                    <li v-for="item in booking.items" :key="item.id">
                                        {{ item.amenityProduct.name }} ({{ item.quantity }} x {{
                                            formatCurrency(item.pricePerUnit) }}) =
                                        {{ formatCurrency(item.subtotal) }}
                                    </li>
                                </ul>
                            </details>
                        </div>
                    </div>
                    <p class="mt-4 text-lg font-bold text-gray-800 dark:text-white flex items-center justify-between">
                        <span>{{ $t('SelectedAmenitiesTotal') }}:</span>
                        <span class="text-blue-700 dark:text-blue-400">{{ formatCurrency(totalSelectedAmenitiesAmount)
                        }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { ReservationDetails } from '@/utils/models'; // Assuming this interface exists
import { formatCurrency, generateTransactionId } from '@/components/utilities/UtilitiesFunction';
import { Wallet, DollarSign, CreditCard, Banknote, CheckCircle, AlertCircle, ShoppingCart } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/composables/user';
import { amenitiesPaymentByReservationId } from '@/services/api'; // Assuming this API call exists
import { useRouter } from 'vue-router';
import DotSpinner from '@/components/spinner/DotSpinner.vue';

// Define the new interfaces based on the provided data structure
interface AmenityProduct {
    id: number;
    name: string;
    price: string;
    description: string | null;
    status: string;
    amenitiesCategoryId: number;
    serviceId: number;
    createdBy: number;
    lastModifiedBy: number;
    createdAt: string;
    updatedAt: string;
    pricingModel: string;
    timeUnit: string | null;
}

interface AmenityBookingItem {
    id: number;
    amenityBookingId: number;
    amenityProductId: number;
    quantity: number;
    pricePerUnit: string;
    subtotal: string;
    createdAt: string;
    updatedAt: string;
    amenityProduct: AmenityProduct;
}

interface UnpaidAmenityBooking {
    id: number;
    reservationId: number;
    amenityOrderNumber: string;
    totalAmount: string; // This is a string, convert to number for calculations
    status: string;
    bookedAt: string;
    createdBy: number;
    lastModifiedBy: number;
    createdAt: string;
    updatedAt: string;
    items: AmenityBookingItem[];
}

interface UnpaidDetails {
    unpaidAmenityBookings: UnpaidAmenityBooking[];
    totalUnpaidAmenitiesAmount: number; // This is a number
    totalRemainingPrice: number; // This is a number, likely for the main reservation
}

const { t } = useI18n();
const toast = useToast();

// Props
const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    reservation: {
        type: Object as PropType<ReservationDetails>,
        required: true,
    },
    unPaidDetails: {
        type: Object as PropType<UnpaidDetails>, // Use the new interface
        required: true,
    },
});

// Emits
const emit = defineEmits(['close', 'payment-recorded']);

// State
const paymentAmount = ref<string>(''); // Amount entered by user or calculated default
const paymentMethod = ref('');
const transactionRef = ref(generateTransactionId());
const selectedAmenityBookingIds = ref<number[]>([]); // To store IDs of selected amenity bookings
const router = useRouter();
const isLoading = ref(false);

// Computed Properties
const reservationRemainingBalance = computed(() => {
    if (!props.reservation) return 0;
    const finalAmount = parseFloat(props.reservation.finalAmount) || 0;
    const paidAmount = parseFloat(`${props.reservation.paidAmount}`) || 0;
    return finalAmount - paidAmount;
});

const totalSelectedAmenitiesAmount = computed(() => {
    let total = 0;
    if (props.unPaidDetails.unpaidAmenityBookings && selectedAmenityBookingIds.value.length > 0) {
        props.unPaidDetails.unpaidAmenityBookings.forEach(booking => {
            if (selectedAmenityBookingIds.value.includes(booking.id)) {
                total += parseFloat(booking.totalAmount);
            }
        });
    }
    return total;
});

const totalAmountDue = computed(() => {
    // This is the total amount that *could* be paid (reservation balance + all selected amenities)
    return reservationRemainingBalance.value + totalSelectedAmenitiesAmount.value;
});

const overallPaymentStatus = computed(() => {
    // Check if main reservation is paid
    const isReservationPaid = reservationRemainingBalance.value <= 0;

    // Check if all unpaid amenities are selected (meaning they are about to be paid)
    const allUnpaidAmenitiesSelected = props.unPaidDetails.unpaidAmenityBookings.every(booking =>
        selectedAmenityBookingIds.value.includes(booking.id)
    );

    // If reservation is paid and all unpaid amenities are selected, then overall it's fully paid
    if (isReservationPaid && props.unPaidDetails.unpaidAmenityBookings.length > 0 && allUnpaidAmenitiesSelected && totalAmountDue.value <= 0) {
        return 'fully_paid';
    } else if (isReservationPaid && props.unPaidDetails.unpaidAmenityBookings.length === 0) {
        return 'fully_paid'; // No amenities and reservation paid
    } else if (totalAmountDue.value < 0) {
        return 'overpaid';
    }
    return 'pending'; // Still amounts due
});


const availablePaymentMethods = computed(() => {
    const serviceMethods = props.reservation?.service?.paymentMethods || [];
    const allMethods = new Set([...serviceMethods, 'Cash', 'Bank Transfer', 'Credit Card']);
    return Array.from(allMethods);
});

// Watcher to set defaults when modal opens
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        // Set default payment method
        if (availablePaymentMethods.value.length > 0) {
            paymentMethod.value = availablePaymentMethods.value.includes('Credit Card')
                ? 'Credit Card'
                : availablePaymentMethods.value[0];
        }

        // Default payment amount to reservation remaining balance + all unpaid amenities
        // User can then deselect amenities or adjust the amount
        let initialPaymentSum = reservationRemainingBalance.value;
        selectedAmenityBookingIds.value = []; // Clear previous selections

        if (props.unPaidDetails.unpaidAmenityBookings && props.unPaidDetails.unpaidAmenityBookings.length > 0) {
            props.unPaidDetails.unpaidAmenityBookings.forEach(booking => {
                initialPaymentSum += parseFloat(booking.totalAmount);
                selectedAmenityBookingIds.value.push(booking.id); // Select all by default
            });
        }
        paymentAmount.value = initialPaymentSum.toFixed(2);
        transactionRef.value = generateTransactionId(); // Generate a new ref each time modal opens
    }
}, { immediate: true });

// Watcher to update paymentAmount when selected amenities change, if paymentAmount is not manually edited
// This is tricky. If the user types a custom amount, we don't want to override it.
// For simplicity, let's just make sure the `paymentAmount` input reflects `totalAmountDue`
// when the modal *first opens* or when amenities are selected/deselected.
// If the user manually changes `paymentAmount`, we assume they know what they're doing.
watch(totalAmountDue, (newTotal) => {
    // Only update paymentAmount if it hasn't been manually overridden
    // A more robust solution might involve another ref `isPaymentAmountManuallySet`
    // For now, let's keep it simple and just update it when totalAmountDue changes.
    paymentAmount.value = newTotal.toFixed(2);
});


// Methods
function closeModal() {
    emit('close');
}

async function handlePaymentSubmit() {
    const amount = parseFloat(paymentAmount.value);

    if (isNaN(amount) || amount <= 0) {
        toast.error(t('alert.invalid_payment_amount'));
        return;
    }

    // If the amount entered is greater than the calculated total amount due
    if (amount > totalAmountDue.value && totalAmountDue.value > 0) {
        if (!confirm(t('alert.overpayment_confirmation', {
            paymentAmount: formatCurrency(amount),
            remainingBalance: formatCurrency(totalAmountDue.value)
        }))) {
            return;
        }
    } else if (amount < totalAmountDue.value && reservationRemainingBalance.value > 0 && selectedAmenityBookingIds.value.length === 0) {
        // If user is paying less than reservation balance and no amenities are selected
        if (!confirm(t('alert.partial_payment_confirmation', {
            paymentAmount: formatCurrency(amount),
            remainingBalance: formatCurrency(totalAmountDue.value)
        }))) {
            return;
        }
    }


    await savePayment();
}
const savePayment = async () => {
    isLoading.value = true;
    try {
        const payload = {
            payment_method: paymentMethod.value,
            transaction_id: transactionRef.value,
            amenity_booking_ids: selectedAmenityBookingIds.value,
        };

        const response = await amenitiesPaymentByReservationId(props.reservation.id, payload);
        console.log('Payment response:', response);
        if (response.status === 201 || response.status === 200) {
            toast.success(t('toast.paymentSucess'));
            emit('payment-recorded');
        } else {
            toast.error(t('toast.paymentError'));
        }
    } catch (error: unknown) {
        console.log('Payment response:', error);

        const message = 'An error occurred during payment.';
        if (error instanceof Object && 'response' in error && error.response) {
            const axiosError = error as { response: { data: { message: string } } };
            toast.error(axiosError.response.data.message || message);
        } else {
            toast.error(message);
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.slide-in {
    animation: slide-in-from-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-in-from-bottom {
    0% {
        transform: translateY(50px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
