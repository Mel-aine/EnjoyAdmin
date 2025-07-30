<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { Plus, Minus, X, ShoppingCart, CheckCircle } from 'lucide-vue-next';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { createAmenityBooking, getAmenitiesByServiceId, getAmenitiesProductByServiceId, getReservationDetailsById } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore'
import { isLoading } from '@/composables/spinner';
import { formatCurrency } from '@/components/utilities/UtilitiesFunction';
import { useI18n } from 'vue-i18n';
import type { CreateAmenityBookingPayload, ReservationDetails } from '@/utils/models'; // Import ReservationDetails type
import router from '@/router'; // Import router
import { isAfter } from 'date-fns';
import { useToast } from 'vue-toastification'

const toast = useToast()

// Destructure t for translation
const { t } = useI18n();

// --- Interfaces for Data Structures ---
interface Category {
    id: number | string; // Assuming ID can be number or string based on usage
    name: string;
}

interface AmenityProduct {
    id: number | string;
    name: string;
    description: string;
    price: number;
    quantity?: number; // Quantity for flat_rate, or days/hours for time_based
    pricingModel?: 'time_based' | 'flat_rate' | string;
    timeUnit?: 'hour' | 'day' | string;
    minQuantity?: number; // Minimum quantity allowed for booking
    maxQuantity?: number; // Maximum quantity allowed based on reservation duration
}

// --- Composable Stores ---
const serviceStore = useServiceStore();

// --- Reactive State ---
const categories = ref<Category[]>([]);
const amenityProducts = ref<AmenityProduct[]>([]);
const selectedCategory = ref<string | number>('Spa');
const showDetailsModal = ref<boolean>(false);
const selectedAmenityDetails = ref<AmenityProduct | null>(null);
const bookingCart = ref<AmenityProduct[]>([]);
const selectBooking = ref<ReservationDetails | null>(null);

// Get reservation ID from route parameters
const reservation_id = router.currentRoute.value.params.id as string;

// --- Computed Property for Reservation Duration ---
/**
 * Calculates the total number of days for the current reservation.
 * Assumes `checkInDate` and `checkOutDate` are available in `selectBooking`
 * and can be parsed by `new Date()`.
 * Returns 0 if booking details are not available or dates are invalid.
 */
const reservationDurationDays = computed<number>(() => {
    if (selectBooking.value?.arrivedDate && selectBooking.value?.departDate) {
        let arrivedDate = new Date(selectBooking.value.arrivedDate);
        if (isAfter(new Date(), new Date(selectBooking.value.arrivedDate))) {
            arrivedDate = new Date(); // If today is after arrivedDate, use today
        }
        const checkOut = new Date(selectBooking.value.departDate);

        // Calculate the difference in milliseconds
        const diffTime = Math.abs(checkOut.getTime() - arrivedDate.getTime());

        // Convert milliseconds to days and round up to include partial days
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Ensure at least 1 day for same-day check-in/out scenarios
        return diffDays > 0 ? diffDays : 1;
    }
    return 0;
});

// --- Functions ---

/**
 * Fetches amenity categories from the API.
 * Sets the first category as default selected and then fetches products for it.
 */
const fetchAmenities = async (): Promise<void> => {
    isLoading.value = true;
    try {
        const serviceId = serviceStore.serviceId;
        if (!serviceId) throw new Error('Service ID is not defined');

        const response = await getAmenitiesByServiceId(serviceId);
        console.log('API Response (Categories):', response); // More specific console log
        categories.value = response.data as Category[];

        if (categories.value.length > 0) {
            selectedCategory.value = categories.value[0].id;
            await fetchProducts();
        }
    } catch (error) {
        console.error('Failed to fetch amenities:', error);
    } finally {
        isLoading.value = false;
    }
};

/**
 * Fetches amenity products for the currently selected category.
 * Dynamically sets `maxQuantity` based on the reservation duration.
 */
const fetchProducts = async (): Promise<void> => {
    isLoading.value = true;
    try {
        const serviceId = serviceStore.serviceId;
        if (!serviceId) throw new Error('Service ID is not defined');

        const categoryId = typeof selectedCategory.value === 'string'
            ? parseInt(selectedCategory.value, 10)
            : selectedCategory.value;

        const response = await getAmenitiesProductByServiceId(serviceId, categoryId);
        console.log('API Response (Products):', response); // More specific console log

        amenityProducts.value = response.data.map((product: any) => {
            const amenity: AmenityProduct = {
                ...product,
                price: parseFloat(product.price),
            };

            // Set maxQuantity based on pricing model and reservation duration
            if (amenity.pricingModel === 'time_based') {
                if (amenity.timeUnit === 'day') {
                    amenity.maxQuantity = reservationDurationDays.value;
                } else if (amenity.timeUnit === 'hour') {
                    // Assuming 24 hours per day for max quantity calculation
                    amenity.maxQuantity = reservationDurationDays.value * 24;
                }
                amenity.minQuantity = 1; // Minimum 1 for time-based
            } else {
                // For flat_rate, no specific max quantity based on reservation duration
                amenity.minQuantity = 1;
                amenity.maxQuantity = undefined; // Or a very large number if there's a general max
            }
            return amenity;
        }) as AmenityProduct[];
    } catch (error) {
        console.error('Failed to fetch products:', error);
    } finally {
        isLoading.value = false;
    }
};

/**
 * Fetches details for the current reservation based on the route ID.
 */
const getBookingDetails = async (): Promise<void> => {
    isLoading.value = true;
    try {
        const parsedReservationId = parseInt(reservation_id);
        if (isNaN(parsedReservationId)) {
            console.error('Invalid reservation ID:', reservation_id);
            return;
        }
        const response = await getReservationDetailsById(parsedReservationId);
        console.log('Reservation Details:', response);
        if (response.status === 200) {
            selectBooking.value = response.data as ReservationDetails;
        }
    } catch (error) {
        console.error('Failed to fetch booking details:', error);
    } finally {
        isLoading.value = false;
    }
};


/**
 * Adds an amenity to the booking cart or increments its quantity if already present.
 * Validates against `maxQuantity` for time-based items.
 * @param amenity The amenity product to add to the cart.
 */
const handleAddToCart = (amenity: AmenityProduct): void => {
    const existingItem = bookingCart.value.find((item) => item.id === amenity.id);
    const initialQuantity = 1;

    if (existingItem) {
        const newQuantity = (existingItem.quantity || 0) + 1;
        if (amenity.pricingModel === 'time_based' && amenity.maxQuantity !== undefined && newQuantity > amenity.maxQuantity) {
            console.warn(`Cannot add more. Max quantity for ${amenity.name} is ${amenity.maxQuantity} ${amenity.timeUnit}.`);
            return;
        }
        existingItem.quantity = newQuantity;
    } else {
        if (amenity.pricingModel === 'time_based' && amenity.maxQuantity !== undefined && initialQuantity > amenity.maxQuantity) {
            console.warn(`Cannot add. Max quantity for ${amenity.name} is ${amenity.maxQuantity} ${amenity.timeUnit}.`);
            return;
        }
        bookingCart.value.push({ ...amenity, quantity: initialQuantity });
    }
};

/**
 * Updates the quantity of an amenity in the booking cart.
 * Validates against `maxQuantity` for time-based items.
 * @param amenityId The ID of the amenity to update.
 * @param change The amount to change the quantity by (e.g., 1 for increment, -1 for decrement).
 */
const handleUpdateQuantity = (amenityId: number | string, change: number): void => {
    const itemIndex = bookingCart.value.findIndex((item) => item.id === amenityId);
    if (itemIndex > -1) {
        const item = bookingCart.value[itemIndex];
        const currentQuantity = item.quantity || 0;
        let newQuantity = currentQuantity + change;

        if (newQuantity <= 0) {
            bookingCart.value.splice(itemIndex, 1);
        } else {
            if (item.pricingModel === 'time_based' && item.maxQuantity !== undefined && newQuantity > item.maxQuantity) {
                console.warn(`Quantity capped at maximum allowed: ${item.maxQuantity} ${item.timeUnit} for ${item.name}.`);
                newQuantity = item.maxQuantity; // Cap the quantity at max
            }
            item.quantity = newQuantity;
        }
    }
};

/**
 * Handles direct input for quantity for time-based amenities.
 * Validates and caps the input based on `minQuantity` and `maxQuantity`.
 * @param amenity The amenity product being updated.
 * @param event The input event.
 */
const handleDirectQuantityInput = (amenity: AmenityProduct, event: Event): void => {
    const target = event.target as HTMLInputElement;
    let newQuantity = parseInt(target.value, 10);

    // Ensure quantity is a valid number and at least 0
    if (isNaN(newQuantity) || newQuantity < 0) {
        newQuantity = 0;
    }

    // Apply minQuantity constraint
    if (amenity.minQuantity !== undefined && newQuantity < amenity.minQuantity && newQuantity > 0) {
        newQuantity = amenity.minQuantity;
        console.warn(`Quantity cannot be less than ${amenity.minQuantity} for ${amenity.name}.`);
    }

    // Apply maxQuantity constraint for time-based items
    if (amenity.pricingModel === 'time_based' && amenity.maxQuantity !== undefined && newQuantity > amenity.maxQuantity) {
        newQuantity = amenity.maxQuantity; // Cap at max quantity
        console.warn(`Quantity capped at maximum allowed: ${amenity.maxQuantity} ${amenity.timeUnit} for ${amenity.name}.`);
    }

    const existingItem = bookingCart.value.find((item) => item.id === amenity.id);

    if (existingItem) {
        existingItem.quantity = newQuantity;
    } else if (newQuantity > 0) {
        // If item doesn't exist in cart and newQuantity is > 0, add it
        bookingCart.value.push({ ...amenity, quantity: newQuantity });
    }

    // If newQuantity is 0 and item exists, remove it from the cart
    if (newQuantity === 0 && existingItem) {
        handleRemoveFromCart(amenity.id);
    }
};

/**
 * Removes an amenity completely from the booking cart.
 * @param amenityId The ID of the amenity to remove.
 */
const handleRemoveFromCart = (amenityId: number | string): void => {
    bookingCart.value = bookingCart.value.filter((item) => item.id !== amenityId);
};

/**
 * Handles the selection of an amenity category.
 * @param category The ID of the selected category.
 */
const onSelectedCategory = (category: string | number): void => {
    selectedCategory.value = category;
    fetchProducts(); // Fetch products when category changes
};

// --- Computed Properties ---

/**
 * Calculates the total amount of all items in the booking cart.
 * @returns The total booking amount.
 */
const totalBookingAmount = computed<number>(() => {
    return bookingCart.value.reduce(
        (total, item) => total + (item.price * (item.quantity || 0)),
        0
    );
});

// --- Lifecycle Hooks ---
onBeforeMount(() => {
    // Fetch booking details first, then amenities, as amenity maxQuantity depends on booking duration
    getBookingDetails().then(() => {
        fetchAmenities();
    });
});

const proceedCheckout = async () => {
    isLoading.value = true;
    try {
        if (bookingCart.value.length === 0) {
            console.warn('Booking cart is empty. Cannot proceed to checkout.');
            return;
        }
        const payload: CreateAmenityBookingPayload = {
            reservation_id: parseInt(reservation_id),
            status: 'pending',
            items: bookingCart.value.map(item => ({
                amenity_product_id: parseInt(`${item.id}`),
                quantity: item.quantity || 1, // Default to 1 if quantity is undefined
            })),
        };
        const response = await createAmenityBooking(payload);
        console.log('Booking created successfully:', response);

        if (response.status !== 200 && response.status !== 201) {
            console.error('Failed to create booking:', response);
            toast.error(t('amenities_booking.bookingError'));
            return;
        } else {
            toast.success(t('amenities_booking.bookingSuccess'));
            console.log('Booking created successfully:', response.data);
        }
        // Here you would typically call an API to process the booking
        // For now, we will just log the booking cart
        console.log('Proceeding to checkout with the following items:', bookingCart.value);
        // Redirect to a confirmation page or similar
        router.push({ name: 'reservationDetails', params: { id: reservation_id } });
    } catch (error) {
        console.error('Error during checkout:', error);
        toast.error(t('amenities_booking.bookingError'));
    } finally {
        isLoading.value = false;
    }
    console.log("Proceeding to checkout with the following items:", bookingCart.value);
}
function goBack() {
    router.back()
}
</script>

<template>
    <AdminLayout>
        <div class="min-h-screen p-4 sm:p-8 font-sans text-gray-800">
            <div class="max-w-7xl xl:max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                <div class="lg:col-span-2">
                    <!-- Amenities List (Left/Main Section) -->
                    <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div class="col-span-full mb-4">
                            <h1
                                class="flex text-2xl sm:text-2xl font-extrabold text-gray-900 text-start mb-10 sm:mb-12 leading-tight tracking-tight">

                                {{ t('amenities_booking.title') }}
                                <button @click="goBack"
                                    class=" ms-4 flex items-center text-sm gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow">
                                    ← {{ $t('Back') }}
                                </button>
                            </h1>

                            <!-- Amenity Categories Header -->
                            <div class="flex flex-wrap justify-start gap-3 sm:gap-4 mb-8 sm:mb-4">
                                <button v-for="category in categories" :key="category.id"
                                    @click="onSelectedCategory(category.id)" :class="`flex items-center px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base
          transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${selectedCategory === category.id
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg border-blue-700'
                                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                                        }`">
                                    {{ category.name }}
                                </button>
                            </div>
                        </div>
                        <div v-for="amenity in amenityProducts" :key="amenity.id"
                            class="bg-white rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
                            <div class="p-6 sm:p-8 flex-grow flex flex-col">
                                <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ amenity.name }}</h3>
                                <p
                                    class="text-gray-600 text-sm sm:text-base mb-4 flex-grow leading-relaxed min-w-0 overflow-hidden">
                                    {{ amenity.description }}
                                </p>
                                <div
                                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-4 border-t border-gray-100">
                                    <span class="text-xl sm:text-2xl font-bold text-blue-600 mb-3 sm:mb-0">
                                        {{ formatCurrency(amenity.price) }}
                                        <span v-if="amenity.pricingModel === 'time_based' && amenity.timeUnit"
                                            class="text-base font-normal text-gray-500">
                                            / {{ $t(amenity.timeUnit) }}
                                        </span>
                                    </span>
                                    <div class="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                                        <div v-if="bookingCart.find(item => item.id === amenity.id)"
                                            class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1 shadow-inner">
                                            <button @click="handleUpdateQuantity(amenity.id, -1)"
                                                class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 shadow-sm w-8 h-8 flex items-center justify-center text-lg font-bold"
                                                :aria-label="t('amenities_booking.decreaseQuantity')">
                                                <Minus class="w-4 h-4" />
                                            </button>
                                            <!-- Conditional rendering for quantity input based on pricingModel -->
                                            <template v-if="amenity.pricingModel === 'time_based'">
                                                <input type="number"
                                                    :value="bookingCart.find(item => item.id === amenity.id)?.quantity || 0"
                                                    @input="handleDirectQuantityInput(amenity, $event)"
                                                    :min="amenity.minQuantity || 0" :max="amenity.maxQuantity"
                                                    class="w-16 text-center font-semibold text-gray-800 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                                <span v-if="amenity.maxQuantity !== undefined"
                                                    class="text-sm text-gray-500">
                                                    / {{ amenity.maxQuantity }} {{ $t(amenity.timeUnit ?? "") }}
                                                </span>
                                            </template>
                                            <span v-else class="font-semibold text-gray-800 w-8 text-center text-lg">{{
                                                bookingCart.find(item => item.id === amenity.id)?.quantity}}</span>

                                            <button @click="handleUpdateQuantity(amenity.id, 1)"
                                                class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 shadow-sm w-8 h-8 flex items-center justify-center text-lg font-bold"
                                                :aria-label="t('amenities_booking.increaseQuantity')">
                                                <Plus class="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button v-else @click="handleAddToCart(amenity)"
                                            class="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-md font-medium flex items-center justify-center flex-grow sm:flex-grow-0">
                                            <ShoppingCart class="w-5 h-5 mr-2" /> {{ t('amenities_booking.addToCart') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="amenityProducts?.length === 0"
                            class="col-span-full text-center text-gray-500 p-8 text-lg bg-white rounded-xl shadow-lg">
                            <p class="mb-4">{{ t('amenities_booking.noAmenities') }}</p>
                            <p>{{ t('amenities_booking.checkBack') }}</p>
                        </div>
                    </div>
                </div>
                <!-- Booking Cart (Right Section) -->
                <div
                    class="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 sm:p-8 sticky top-4 h-fit border border-gray-100">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                        <ShoppingCart class="w-7 h-7 mr-3 text-blue-600" /> {{ t('amenities_booking.yourBookingCart') }}
                    </h2>
                    <div v-if="bookingCart.length === 0" class="text-center text-gray-500 text-lg py-8">
                        <ShoppingCart class="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>{{ t('amenities_booking.cartEmpty') }}</p>
                        <p class="text-base">{{ t('amenities_booking.startAdding') }}</p>
                    </div>
                    <ul v-else class="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                        <li v-for="item in bookingCart" :key="item.id"
                            class="flex justify-between items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
                            <div class="flex-grow">
                                <span class="font-semibold text-gray-800 text-base sm:text-lg">{{ item.name }}</span>
                                <span class="text-gray-600 text-sm sm:text-base block">{{ t('amenities_booking.qty') }}
                                    {{
                                        item.quantity }}
                                    <span v-if="item.pricingModel === 'time_based' && item.timeUnit" class="text-xs">
                                        {{ $t(item.timeUnit) }}<span v-if="item.quantity && item.quantity > 1">s</span>
                                    </span>
                                </span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <span class="font-bold text-blue-600 text-lg sm:text-xl">{{ formatCurrency((item.price *
                                    (item.quantity || 0)).toFixed(2)) }}</span>
                                <button @click="handleRemoveFromCart(item.id)"
                                    class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 w-8 h-8 flex items-center justify-center shadow-md"
                                    :aria-label="t('amenities_booking.removeItem')">
                                    <X class="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    </ul>
                    <div class="mt-6 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                        <span class="text-xl sm:text-2xl font-bold text-gray-800">{{ t('amenities_booking.total')
                        }}</span>
                        <span class="text-xl sm:text-2xl font-bold text-blue-600">{{
                            formatCurrency(totalBookingAmount.toFixed(2))
                            }}</span>
                    </div>
                    <button @click="proceedCheckout"
                        class="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition duration-200 shadow-lg text-lg sm:text-xl font-semibold transform hover:scale-105 flex items-center justify-center"
                        :disabled="bookingCart.length === 0">
                        <CheckCircle class="w-6 h-6 mr-3" /> {{ t('amenities_booking.proceedToCheckout') }}
                    </button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
