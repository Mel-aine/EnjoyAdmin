<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 h-screen overflow-hidden" @click="closeModal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/25 bg-opacity-50 transition-opacity"></div>

        <!-- Modal Container -->
        <div class="fixed inset-y-0 top-0 h-screen right-0 flex max-w-full pl-10">
            <div class="relative  max-w-7xl transform transition-transform duration-300 ease-in-out" @click.stop>
                <!-- Modal Content -->
                <div class="flex h-full flex-col bg-white shadow-xl dark:bg-gray-900">
                    <!-- Header -->
                    <div
                        class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <HouseIcon class="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <div v-if="isLoading" class="animate-pulse">
                                    <div class="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                                <div v-else-if="reservation">
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {{ reservation.guest?.firstName }} {{ reservation.guest?.lastName }}
                                    </h2>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        {{ reservation?.reservationNumber }}
                                    </p>
                                </div>
                                <div v-else>
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {{ t('noData') }}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <button @click="closeModal"
                            class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto">
                        <div class="px-6 py-6">
                            <slot>
                                <!-- Default content -->
                                <div class="space-y-6 max-w-2xl">
                                    <!-- Loading skeleton for buttons -->
                                    <div v-if="isLoading" class="grid grid-cols-3 gap-4">
                                        <div class="animate-pulse h-10 bg-gray-200 rounded"></div>
                                        <div class="animate-pulse h-10 bg-gray-200 rounded"></div>
                                        <div class="animate-pulse h-10 bg-gray-200 rounded"></div>
                                    </div>
                                    
                                    <!-- Actual buttons -->
                                    <div v-else class="grid grid-cols-3 gap-4">
                                        <BasicButton :label="$t('edit')" variant="primary" />
                                        <ButtonDropdown :options="dropdownOptions" :button-text="t('options')" @option-selected="handleOptionSelected" />
                                        <ButtonDropdown :options="dropdownOptions" :button-text="t('print')" />
                                    </div>

                                    <!-- Reservation Info -->
                                    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <!-- Loading skeleton for left column -->
                                        <div class="space-y-4">
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                <div class="h-5 bg-gray-200 rounded w-32"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                                                <div class="h-6 bg-gray-200 rounded w-20"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                                <div class="h-5 bg-gray-200 rounded w-28"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                <div class="h-5 bg-gray-200 rounded w-28"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-4">
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('reservationNumber') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservation?.reservationNumber || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('status') }}
                                                </label>
                                                <span
                                                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    {{ reservation?.status || $t('confirmed') }}
                                                </span>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('arrivalDate') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(reservation?.checkInDate) }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('departureDate') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(reservation?.checkOutDate) }}</p>
                                            </div>
                                        </div>

                                        <div v-if="isLoading" class="space-y-4">
                                            <!-- Loading skeleton for right column -->
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                                <div class="h-5 bg-gray-200 rounded w-24"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                <div class="h-5 bg-gray-200 rounded w-16"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-18 mb-2"></div>
                                                <div class="h-5 bg-gray-200 rounded w-28"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                <div class="h-5 bg-gray-200 rounded w-20"></div>
                                            </div>
                                        </div>
                                        
                                        <div v-else class="space-y-4">
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('roomType') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservation?.roomType || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('roomNumber') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservation?.roomNumber || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('ratePlan') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservation?.ratePlan || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('avgDailyRate') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{
                                                    formatCurrency(reservation?.avgDailyRate) }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Financial Information -->
                                    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            {{ $t('financialInformation') }}
                                        </h4>
                                        
                                        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <!-- Loading skeleton for financial info -->
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                <div class="h-6 bg-gray-200 rounded w-20"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                                <div class="h-6 bg-gray-200 rounded w-20"></div>
                                            </div>
                                            <div class="animate-pulse">
                                                <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                <div class="h-6 bg-gray-200 rounded w-20"></div>
                                            </div>
                                        </div>
                                        
                                        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('totalAmount') }}
                                                </label>
                                                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {{ formatCurrency(reservation?.totalAmount) }}
                                                </p>
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('paidAmount') }}
                                                </label>
                                                <p class="text-lg font-semibold text-green-600">
                                                    {{ formatCurrency(reservation?.paidAmount) }}
                                                </p>
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('remainingBalance') }}
                                                </label>
                                                <p class="text-lg font-semibold text-red-600">
                                                    {{ formatCurrency(reservation?.remainingBalance) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </slot>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div class="flex justify-end space-x-3">
                            <slot name="footer">
                                <!-- Amount and Payment Status -->
                                <div v-if="isLoading"
                                    class=" w-full flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <div class="flex justify-between animate-pulse">
                                        <div class="h-4 bg-gray-200 rounded w-12"></div>
                                        <div class="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div class="flex justify-between animate-pulse">
                                        <div class="h-4 bg-gray-200 rounded w-10"></div>
                                        <div class="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div class="flex justify-between animate-pulse">
                                        <div class="h-4 bg-gray-200 rounded w-14"></div>
                                        <div class="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </div>
                                
                                <div v-else
                                    class=" w-full flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <div class="flex justify-between">
                                        <span class=" font-medium">{{ $t('total') }}</span>
                                        <span class="text-sm">{{ formatCurrency(reservation?.totalAmount ?? 0) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class=" font-medium">{{ $t('paid') }}</span>
                                        <span class="text-sm">{{ formatCurrency(reservation?.paidAmount ?? 0) }}</span>
                                    </div>
                                    <div class="flex justify-between text-primary">
                                        <span class=" font-medium">{{ $t('balance') }}</span>
                                        <span class="text-sm">{{ formatCurrency(reservation?.remainingAmount ?? 0) }}</span>
                                    </div>
                                </div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { ReservationDetails } from '@/utils/models'
import BasicButton from '../buttons/BasicButton.vue'
import ButtonDropdown from '../common/ButtonDropdown.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, HouseIcon, List, StopCircle, Trash2, UserMinus, X } from 'lucide-vue-next'
import { formatCurrency } from '../utilities/UtilitiesFunction'
import { useReservation } from '../../composables/useReservation'
import { getReservationDetailsById } from '../../services/reservation'

const { t } = useI18n()
const router = useRouter()

// Loading state
const isLoading = ref(false)
const reservation = ref<ReservationDetails | null>(null)

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
interface Props {
    isOpen: boolean
    title?: string
    subtitle?: string
    reservationData?: ReservationDetails
}

interface Emits {
    (e: 'close'): void
    (e: 'save', data?: any): void
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    title: '',
    subtitle: ''
})

const emit = defineEmits<Emits>()

const closeModal = () => {
    emit('close')
}

const handleSave = () => {
    emit('save', props.reservationData)
}

// Function to load booking details by ID
const getBookingDetailsById = async (reservationId?: number) => {
    if (!reservationId) return
    
    isLoading.value = true
    try {
        const response = await getReservationDetailsById(reservationId)
        console.log('reservation result', response)
        if (response.status === 200 || response.data) {
            reservation.value = response.data || response
        }
    } catch (error) {
        console.error('Error loading reservation details:', error)
    } finally {
        isLoading.value = false
    }
}

// Watch for changes in props or route params to load data
watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        // If reservationData is provided as prop, use it
        if (props.reservationData) {
            reservation.value = props.reservationData
        } else {
            // Otherwise, try to get ID from route params
            const id = router.currentRoute.value.params.id
            if (id) {
                getBookingDetailsById(Number(id))
            }
        }
    }
})

// Watch for changes in reservationData prop
watch(() => props.reservationData, (newData) => {
    if (newData) {
        reservation.value = newData
        isLoading.value = false
    }
})

// Load data on mount if modal is already open
onMounted(() => {
    if (props.isOpen) {
        if (props.reservationData) {
            reservation.value = props.reservationData
        } else {
            const id = router.currentRoute.value.params.id
            if (id) {
                getBookingDetailsById(Number(id))
            }
        }
    }
})

const formatDate = (dateString?: string) => {
    if (!dateString) return t('notAvailable')
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateString
    }
}


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
    if (!props.reservationData?.availableActions) {
        return [];
    }
    
    return props.reservationData.availableActions
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

const handleOptionSelected = async (option: any) => {
    // Handle routing for available actions
    if (option.route) {
        router.push(option.route);
        return;
    }
    
    if (!props.reservationData?.reservationNumber) {
        console.error('No reservation data available');
        return;
    }
    
    // Handle specific actions using the composable
    switch (option.id) {
        case 'add_payment':
            // Handle add payment - might need custom routing or modal
            console.log('Add payment action triggered');
            break;
        case 'amend_stay':
            await performAmendStay(props.reservationData.reservationNumber);
            break;
        case 'cancel_reservation':
            await performCancelReservation(props.reservationData.reservationNumber);
            break;
        case 'void_reservation':
            await performVoidReservation(props.reservationData.reservationNumber);
            break;
        case 'unassign_room':
            await performUnassignRoom(props.reservationData.reservationNumber);
            break;
        case 'inclusion_list':
            await performUpdateInclusionList(props.reservationData.reservationNumber);
            break;
        case 'check_in':
             await performCheckIn(props.reservationData.reservationNumber);
             break;
         case 'check_out':
             await performCheckOut(props.reservationData.reservationNumber);
             break;
         case 'room_move':
            await performRoomMove(props.reservationData.reservationNumber);
            break;
        case 'exchange_room':
            await performExchangeRoom(props.reservationData.reservationNumber);
            break;
        case 'stop_room_move':
            await performStopRoomMove(props.reservationData.reservationNumber);
            break;
        case 'no_show':
            await performMarkNoShow(props.reservationData.reservationNumber);
            break;
        default:
            console.log(`Action ${option.id} not handled`);
    }
};
</script>