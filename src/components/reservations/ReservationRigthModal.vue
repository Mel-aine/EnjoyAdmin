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
                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {{ reservationData.guest.firstName }} {{ reservationData.guest.lastName }}

                                </h2>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ reservationData?.reservationNumber }}
                                </p>
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

                                    <div class="grid grid-cols-3 gap-4">

                                        <BasicButton :label="$t('edit')" variant="primary" />
                                        <ButtonDropdown :options="dropdownOptions" :button-text="t('options')" @option-selected="handleOptionSelected" />

                                        <ButtonDropdown :options="dropdownOptions" :button-text="t('print')" />


                                    </div>

                                    <!-- Reservation Info -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-4">
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('reservationNumber') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservationData?.reservationNumber || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('status') }}
                                                </label>
                                                <span
                                                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    {{ reservationData?.status || $t('confirmed') }}
                                                </span>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('arrivalDate') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{
                                                    formatDate(reservationData?.checkInDate) }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('departureDate') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{
                                                    formatDate(reservationData?.checkOutDate) }}</p>
                                            </div>
                                        </div>

                                        <div class="space-y-4">
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('roomType') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservationData?.roomType || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('roomNumber') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservationData?.roomNumber || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('ratePlan') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{ reservationData?.ratePlan || $t('notAvailable') }}</p>
                                            </div>

                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {{ $t('avgDailyRate') }}
                                                </label>
                                                <p class="text-sm text-gray-900 dark:text-white">{{
                                                    formatCurrency(reservationData?.avgDailyRate) }}</p>
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
                                <div
                                    class=" w-full flex flex-col gap-2  pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <div class="flex justify-between">
                                        <span class=" font-medium">{{ $t('total') }}</span>
                                        <span class="text-sm">{{ formatCurrency(reservationData?.totalAmount ?? 0)
                                        }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class=" font-medium">{{ $t('paid') }}</span>
                                        <span class="text-sm">{{ formatCurrency(reservationData?.paidAmount ?? 0)
                                        }}</span>
                                    </div>
                                    <div class="flex justify-between text-primary">
                                        <span class=" font-medium">{{ $t('balance') }}</span>
                                        <span class="text-sm">{{ formatCurrency(reservationData?.remainingAmount ?? 0)
                                            }}</span>
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
import { ref, computed } from 'vue'
import type { ReservationDetails } from '@/utils/models'
import BasicButton from '../buttons/BasicButton.vue'
import ButtonDropdown from '../common/ButtonDropdown.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ArrowUpDown, Calendar, CheckCircle, CreditCard, Eye, HouseIcon, List, StopCircle, Trash2, UserMinus, X } from 'lucide-vue-next'
import { formatCurrency } from '../utilities/UtilitiesFunction'
const { t } = useI18n()
const router = useRouter()
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

const handleOptionSelected = (option: any) => {
    // Handle routing for available actions
    if (option.route) {
        router.push(option.route);
        return;
    }
    
    // Handle specific actions that might need custom logic
    switch (option.id) {
        case 'add_payment':
            // Custom logic for add payment if needed
            console.log('Add payment action triggered');
            break;
        case 'amend_stay':
            // Custom logic for amend stay if needed
            console.log('Amend stay action triggered');
            break;
        case 'cancel_reservation':
            // Custom logic for cancel reservation if needed
            console.log('Cancel reservation action triggered');
            break;
        case 'void_reservation':
            // Custom logic for void reservation if needed
            console.log('Void reservation action triggered');
            break;
        case 'unassign_room':
            // Custom logic for unassign room if needed
            console.log('Unassign room action triggered');
            break;
        case 'inclusion_list':
            // Custom logic for inclusion list if needed
            console.log('Inclusion list action triggered');
            break;
        case 'check_in':
            // Custom logic for check in if needed
            console.log('Check in action triggered');
            break;
        default:
            console.log(`Action ${option.id} not handled`);
    }
};
</script>