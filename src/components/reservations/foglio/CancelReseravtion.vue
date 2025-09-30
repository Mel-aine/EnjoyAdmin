<template>
    <!-- Cancel Reservation Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-visible h-full w-full z-50">
        <div
            class="relative top-10  mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-visible">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ $t('cancel_reservation') }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Loading Skeleton -->
                <div v-if="isLoading" class="space-y-4">
                    <div class="animate-pulse">
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="flex space-x-4 mb-4">
                            <div class="h-4 bg-gray-200 rounded w-16"></div>
                            <div class="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 rounded mb-4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 rounded mb-4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 rounded mb-4"></div>
                    </div>
                </div>

                <!-- Modal Form -->
                <form v-else @submit.prevent="handleSubmit">
                    <!-- Apply For Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('Apply For') }}
                        </label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input
                                    v-model="formData.cancelType"
                                    type="radio"
                                    value="group"
                                    :disabled="reservationRooms.length === 1"
                                    class="w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span class="ml-2 text-sm" :class="reservationRooms.length === 1 ? 'text-gray-400' : 'text-gray-700'">{{ $t('Group') }}</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="formData.cancelType"
                                    type="radio"
                                    value="individual"
                                    class="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('Individual Reservation') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Room Selection -->

                    <div v-if="formData.cancelType === 'individual' && reservationRooms.length > 0" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('Select Rooms') }}
                        </label>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                            <label
                                v-for="room in reservationRooms"
                                :key="room.id"
                                class="flex items-center p-2 border rounded"
                                :class="{
                                    'hover:bg-gray-50 cursor-pointer': room.status !== 'cancelled',
                                    'bg-gray-100 cursor-not-allowed opacity-60': room.status === 'cancelled'
                                }"
                            >
                                <input
                                    v-model="formData.selectedRooms"
                                    type="checkbox"
                                    :value="room.id"
                                    :disabled="room.status === 'cancelled'"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <div class="ml-2 flex-1">
                                    <span class="text-sm" :class="room.status === 'no_show' ? 'text-gray-500' : 'text-gray-700'">
                                        {{ room.room?.roomNumber }} - {{ room.guest?.displayName || room.guestName }}
                                    </span>
                                    <span v-if="room.status === 'cancelled'" class="ml-2 text-xs text-red-600 font-medium">
                                        ({{ $t('Already marked as cancelled') }})
                                    </span>
                                </div>
                            </label>
                        </div>

                    </div>


                    <!-- Cancellation Fee -->
                    <div class="mb-4">
                        <InputCurrency v-model="formData.cancellationFee" :lb="$t('cancellation_fee')"
                            :placeholder="$t('enter_cancellation_fee')" />
                    </div>

                    <!-- Reason Selection -->
                    <div class="mb-4 relative">
                        <Select :lb="$t('reason')" :is-loading="isloadingReason" v-model="formData.reason" :options="reasonOptions"
                            :is-required="true" />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
                        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                            :disabled="loading" />
                        <BasicButton type="submit" variant="danger" :label="$t('cancel_reservation')"
                            :loading="loading" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted,computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import Select from '../../forms/FormElements/Select.vue'
import { getByCategory } from '../../../services/configrationApi'
import { cancelReservation, getReservationDetailsById } from '../../../services/reservation'
import { useServiceStore } from '@/composables/serviceStore'

interface Props {
    isOpen: boolean
    reservationId?: string | number
    reservationNumber?: string
}

interface Emits {
    (e: 'close'): void
    (e: 'cancel-confirmed', data: CancelReservationData): void
}

interface CancelReservationData {
    cancellationFee: number
    reason: string
    notes?: string
    reservationId?: string | number
    reservationNumber?: string
    cancelType?: string
    selectedRooms?: number[]
    updatedStatus?: any
    updatedActions?: any[]
}

const isloadingReason = ref(false)
const isLoading = ref(false)
const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const reservation = ref<any>()
const reservationRooms = ref<any>([])

const formData = ref({
    cancellationFee: 0,
    reason: '',
    notes: '',
    cancelType: 'individual',
    selectedRooms: [] as number[]
})
const reasonOptions = ref([{ label: "select", value: '' }])

const availableRooms = computed(() => {
    return reservationRooms.value.filter((room: any) => room.status !== 'cancelled')
})

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
    if (newValue && props.reservationId) {
        resetForm()
        getBookingDetailsById()
    }
})

// Watch for reservationId changes
watch(() => props.reservationId, (newVal) => {
    if (newVal) {
        getBookingDetailsById()
    }
})

// Watch for cancelType changes
watch(() => formData.value.cancelType, (newType) => {
    if (newType === 'group') {

        formData.value.selectedRooms = availableRooms.value.map((room: any) => room.id)
    } else {
        formData.value.selectedRooms = []
    }
})

// Watch for reservationRooms changes to handle single room auto-selection
watch(() => reservationRooms.value, (newRooms) => {
    const available = newRooms.filter((room: any) => room.status !== 'cancelled')

    if (available.length === 0) {
        formData.value.selectedRooms = []
        return
    }

    if (available.length === 1) {
        formData.value.cancelType = 'individual'
        formData.value.selectedRooms = [available[0].id]
    } else if (newRooms.length > 1 && formData.value.cancelType === 'group') {
        formData.value.selectedRooms = available.map((room: any) => room.id)
    }
}, { deep: true })



const getBookingDetailsById = async () => {
    if (!props.reservationId) return

    isLoading.value = true
    try {
        const response = await getReservationDetailsById(Number(props.reservationId))
        console.log('Reservation response:', response)
        reservation.value = response
        reservationRooms.value = response.reservationRooms.map((e: any) => {
            return { ...e, guest: reservation.value.guest }
        })
        console.log('Reservation data fetched:', reservation.value)
    } catch (error) {
        console.error('Error fetching reservation details:', error)
        toast.error(t('error_fetching_reservation_details'))
    } finally {
        isLoading.value = false
    }
}

const resetForm = () => {
    formData.value = {
        cancellationFee: 0,
        reason: '',
        notes: '',
        cancelType: 'individual',
        selectedRooms: []
    }
}

const closeModal = () => {
    emit('close')
}
const laodReason = async () => {
    isloadingReason.value = true;
    try {
        const hotel_id = useServiceStore().serviceId;
        const res = await getByCategory(hotel_id!, 'Cancel Reservation');
        console.log('data', res)
        reasonOptions.value = res.data.map((item: any) => {
            return {
                label: item.reasonName,
                value: item.reasonName
            }
        })
        reasonOptions.value.unshift({ label: "select", value: '' })
        console.log(reasonOptions.value)
    } catch (e) {

    } finally {
        isloadingReason.value = false;
    }

}
const handleSubmit = async () => {
    try {
        loading.value = true

        // Validate form
        if (!formData.value.reason) {
            toast.error(t('please_select_reason'))
            return
        }

        if (formData.value.cancellationFee < 0) {
            toast.error(t('cancellation_fee_must_be_positive'))
            return
        }

        // Validate room selection for individual cancellation
        if (formData.value.cancelType === 'individual' && formData.value.selectedRooms.length === 0) {
            toast.error(t('please_select_at_least_one_room'))
            return
        }

        // Prepare data for emission
        const cancelData: CancelReservationData = {
            cancellationFee: formData.value.cancellationFee,
            reason: formData.value.reason,
            notes: formData.value.notes || undefined,
            reservationId: props.reservationId,
            reservationNumber: props.reservationNumber,
            cancelType: formData.value.cancelType,
            selectedRooms: formData.value.cancelType === 'group'
                ? reservationRooms.value.map((room: any) => room.id)
                : formData.value.selectedRooms
        }
        console.log('cancelData', cancelData)

        const resp = await cancelReservation(cancelData);
        // Emit the cancel confirmation event
        emit('cancel-confirmed', {
        ...cancelData,
        updatedStatus: 'cancelled',
        updatedActions: []
        })

        // Show success message
        toast.success(t('reservation_cancellation_initiated'))

        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error cancelling reservation:', error)
        toast.error(t('error_cancelling_reservation'))
    } finally {
        loading.value = false
    }
}
laodReason()

onMounted(() => {
    if (props.reservationId) {
        getBookingDetailsById()
    }
})
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Focus styles for better accessibility */
input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state styles */
.error {
    border-color: #ef4444;
}

.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
