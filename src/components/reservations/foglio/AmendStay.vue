<template>
    <!-- Cancel Reservation Modal -->
    <div v-if="isOpen"
        class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-gray-900/25">
        <div
            class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-800">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('amen_stay') }}
                    </h3>
                    <button @click="closeModal"
                        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Loading Skeleton -->
                <div v-if="isLoading" class="space-y-4">
                    <div class="animate-pulse">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div class="flex space-x-4 mb-4">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div class="flex justify-end space-x-3">
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                    </div>
                </div>

                <!-- Conflict Error Alert -->
                <div v-if="conflictError" class="mb-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div class="flex items-start">
                        <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div class="flex-1">
                            <h4 class="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                                {{ $t('Date Conflict') }}
                            </h4>
                            <p class="text-sm text-red-700 dark:text-red-400 mb-3">
                                {{ conflictError.message }}
                            </p>
                            <div v-if="conflictError.conflicts && conflictError.conflicts.length > 0"
                                class="space-y-2">
                                <p class="text-xs font-medium text-gray-800 dark:text-gray-300 mb-1">
                                    {{ $t('Conflicting Reservations:') }}
                                </p>
                                <div v-for="conflict in conflictError.conflicts" :key="conflict.reservationId"
                                    class="text-xs text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 p-2 rounded border border-red-200 dark:border-red-700">
                                    <div class="font-medium">{{ conflict.reservationNumber || conflict.reservationId }}</div>
                                    <div>{{ $t('Room') }}: {{ conflict.roomNumber }}</div>
                                    <div>{{ formatDate(conflict.checkIn) }} - {{ formatDate(conflict.checkOut) }}</div>
                                </div>
                            </div>
                            <button @click="conflictError = null"
                                class="mt-3 text-xs  border border-red-500 rounded-lg px-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                                {{ $t('Dismiss') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal Form -->
                <form @submit.prevent="handleSubmit" v-else-if="!isLoading">
                    <!-- Amend Type Selection (only show if multiple rooms) -->
                    <div v-if="isGroupAmend" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ $t('Perform Amend on') }}
                        </label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input v-model="formData.amendType" type="radio" value="group"
                                    class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary" />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Group') }}</span>
                            </label>
                            <label class="flex items-center">
                                <input v-model="formData.amendType" type="radio" value="individual"
                                    class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary" />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{
                                    $t('IndividualReservation') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Room Selection (only show for individual amend with multiple rooms) -->
                    <div v-if="isGroupAmend && formData.amendType === 'individual' && reservationRooms.length > 0"
                        class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ $t('Select Rooms') }}
                        </label>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            <label v-for="room in reservationRooms" :key="room.id" class="flex items-center">
                                <input v-model="formData.selectedRooms" type="checkbox" :value="room.room.id"
                                    class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-primary" />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    {{ room.room.roomNumber }} - {{ room.roomType?.roomTypeName }}
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Date and Nights Fields -->
                    <div class="mb-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputDatePicker :title="$t('arrivalDate')" v-model="formData.newArrivalDate"
                            :is-required="true" :disabled="isCheckedIn" />
                        <InputDatePicker :title="$t('departureDate')" v-model="formData.newDepartureDate"
                            :is-required="true" />
                        <Input input-type="number" :lb="$t('nights')" :title="$t('nights')" v-model="formData.nights"
                            :is-required="true" />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
                        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                            :disabled="loading" />
                        <BasicButton type="submit" variant="primary" :label="$t('save')" :loading="loading"
                            :disabled="!canAmend" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X, AlertCircle } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import { amendReservation, getReservationDetailsById } from '../../../services/reservation'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Input from '../../forms/FormElements/Input.vue'

interface Props {
    isOpen: boolean
    reservationId?: string | number
    reservationNumber?: string,
    reservation?: any
}

interface Emits {
    (e: 'close'): void
    (e: 'amend-confirmed', data: AmendReservationData): void
}

interface AmendReservationData {
    newArrivalDate: string
    newDepartureDate: string
    nights: number,
    reservationId?: string | number
    reservationNumber?: string
    amendType?: 'individual' | 'group'
    selectedRooms?: number[]
    updatedReservation?: {}
}

interface ConflictError {
    message: string
    details?: string
    conflicts?: Array<{
        reservationId: number
        reservationNumber?: string
        checkIn: string
        checkOut: string
        roomId: number
        roomNumber: string
        status?: string
    }>
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const toast = useToast()

const loading = ref(false)
const isLoading = ref(false)
const reservation = ref<any>()
const reservationRooms = ref<any>([])
const conflictError = ref<ConflictError | null>(null)
const { t, locale } = useI18n({ useScope: 'global' })

const formData = ref<AmendReservationData>({
    newArrivalDate: '',
    newDepartureDate: '',
    nights: 0,
    amendType: 'group',
    selectedRooms: []
})

// Disable arrival date if reservation is checked-in
const isCheckedIn = computed(() => {
    const s: any = props.reservation?.status || props.reservation?.reservationStatus || props.reservation?.reservation_status
    if (!s || typeof s !== 'string') return false
    const norm = String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-')
    return norm === 'checked-in' || norm === 'check-in' || norm === 'checkedin'
})

// Computed property to check if group amend should be applied
const isGroupAmend = computed(() => {
    return reservationRooms.value.length > 1
})

// Computed property to check if amend can be performed
const canAmend = computed(() => {
    if (isGroupAmend.value && formData.value.amendType === 'group') {
        return reservationRooms.value.length > 0
    } else {
        return formData.value.selectedRooms && formData.value.selectedRooms.length > 0
    }
})

const closeModal = () => {
    conflictError.value = null
    emit('close')
}

// Format date helper


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

// Fetch booking details using getReservationDetailsById
const getBookingDetailsById = async () => {
    if (!props.reservationId) return

    isLoading.value = true
    conflictError.value = null
    try {
        const response = await getReservationDetailsById(Number(props.reservationId))
        console.log('Reservation details:', response)
        reservation.value = response
        reservationRooms.value = (response.reservationRooms || []).filter((room: any) =>
          !room.isSplitedOrigin &&
          !['checked_out', 'checked-out'].includes(String(room.status ?? '').toLowerCase())
        )
        const activeRooms = reservationRooms.value.filter((room: any) =>
          !room.isSplitedOrigin &&
          !['checked_out', 'checked-out'].includes(String(room.status ?? '').toLowerCase())
        )

        // Populate form data with reservation details
        if (response) {
            formData.value.newArrivalDate = new Date(response.arrivedDate).toISOString().split('T')[0]
            formData.value.newDepartureDate = new Date(response.departDate).toISOString().split('T')[0]
            formData.value.nights = response.nights ?? response.numberOfNights

            // Set amend type based on number of rooms
            if (reservationRooms.value.length > 1) {
                formData.value.amendType = 'group'
                formData.value.selectedRooms = activeRooms.map((room: any) => room.room.id)
            } else {
                formData.value.amendType = 'individual'
                formData.value.selectedRooms = activeRooms.map((room: any) => room.room.id)
            }
        }
    } catch (error) {
        console.error('Error fetching reservation details:', error)
        toast.error(t('error_fetching_reservation_details'))
    } finally {
        isLoading.value = false
    }
}



const handleSubmit = async () => {
    try {
        loading.value = true
        conflictError.value = null

        if (!formData.value.newArrivalDate) {
            toast.error(t('please_select_arrival_date'))
            return
        }
        if (!formData.value.newDepartureDate) {
            toast.error(t('please_select_departure_date'))
            return
        }

        // Prepare data for emission
        const amendData: AmendReservationData = {
            newArrivalDate: formData.value.newArrivalDate,
            newDepartureDate: formData.value.newDepartureDate,
            nights: formData.value.nights,
            reservationId: props.reservationId,
            reservationNumber: props.reservationNumber,
            amendType: formData.value.amendType,
            selectedRooms: formData.value.selectedRooms
        }
        console.log('amendData', amendData)

        const resp = await amendReservation(amendData)
        console.log("resp", resp)

        // Emit the amend confirmation event
        emit('amend-confirmed', {
            ...amendData,
            updatedReservation: {
                arrivedDate: amendData.newArrivalDate,
                departDate: amendData.newDepartureDate,
                nights: amendData.nights
            }
        })

        // Show success message
        toast.success(t('reservation_amended_successfully'))

        // Close modal
        closeModal()
    } catch (error: any) {
        console.error('Error amending reservation:', error)

        if (error.response?.status === 409) {
            // Handle conflict error (409)
            const errorData = error.response.data
            conflictError.value = {
                message: errorData?.message || t('cannot_amend_conflicting_dates'),
                details: errorData?.details,
                conflicts: errorData?.conflicts || []
            }

            // Scroll to top to show error
            const modalContent = document.querySelector('.overflow-y-auto')
            if (modalContent) {
                modalContent.scrollTop = 0
            }
        } else {
            // Handle other errors
            toast.error(error.response?.data?.message || t('error_amended_reservation'))
        }
    } finally {
        loading.value = false
    }
}

// Watch for modal open/close
watch(() => props.isOpen, (newVal) => {
    if (newVal && props.reservationId) {
        getBookingDetailsById()
    } else if (!newVal) {
        // Reset conflict error when modal closes
        conflictError.value = null
    }
})

// Watch for reservationId changes
watch(() => props.reservationId, (newVal) => {
    if (newVal && props.isOpen) {
        getBookingDetailsById()
    }
})

// Watch for amend type changes
watch(() => formData.value.amendType, (newType) => {
    if (newType === 'group') {
        formData.value.selectedRooms = reservationRooms.value.map((room: any) => room.room.id)
    }
})

// Watch for reservationRooms changes to handle single room auto-selection
watch(() => reservationRooms.value, (newRooms) => {
    if (newRooms.length === 1) {
        formData.value.amendType = 'individual'
        formData.value.selectedRooms = [newRooms[0].room.id]
    } else if (newRooms.length > 1) {
        if (formData.value.amendType === 'group') {
            formData.value.selectedRooms = newRooms.map((room: any) => room.room?.id)
        }
    }
}, { deep: true })

// Watch for changes in arrival and departure dates to calculate nights
watch([() => formData.value.newArrivalDate, () => formData.value.newDepartureDate], ([newArrival, newDeparture]) => {
    if (newArrival && newDeparture) {
        const arrivalDate = new Date(newArrival)
        const departureDate = new Date(newDeparture)
        const timeDiff = departureDate.getTime() - arrivalDate.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

        if (daysDiff >= 0) {
            formData.value.nights = daysDiff
        }
    }
})

// Watch for changes in arrival date and nights to calculate departure date
watch([() => formData.value.newArrivalDate, () => formData.value.nights], ([newArrival, nights]) => {
    if (newArrival && nights && nights > 0) {
        const arrivalDate = new Date(newArrival)
        const departureDate = new Date(arrivalDate)
        departureDate.setDate(arrivalDate.getDate() + nights)

        formData.value.newDepartureDate = departureDate.toISOString().split('T')[0]
    }
})

onMounted(() => {
    if (props.reservation && props.reservation.id) {
        const response = props.reservation
          reservationRooms.value = (response.reservationRooms || []).filter((room: any) =>
          !room.isSplitedOrigin &&
          !['checked_out', 'checked-out'].includes(String(room.status ?? '').toLowerCase())
        )
        if (response) {
            formData.value.newArrivalDate = new Date(response.arrivedDate).toISOString().split('T')[0]
            formData.value.newDepartureDate = new Date(response.departDate).toISOString().split('T')[0]
            formData.value.nights = response.nights ?? response.numberOfNights

            // Set amend type based on number of rooms
            if (reservationRooms.value.length > 1) {
                formData.value.amendType = 'group'
                formData.value.selectedRooms = reservationRooms.value.map((room: any) => room.room?.id)
            } else {
                formData.value.amendType = 'individual'
                formData.value.selectedRooms = reservationRooms.value.map((room: any) => room.room?.id)
            }
        }
    } else if (props.isOpen && props.reservationId) {
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
