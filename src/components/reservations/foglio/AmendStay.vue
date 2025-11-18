<template>
    <!-- Cancel Reservation Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-gray-900/25">
        <div
            class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-800">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('amen_stay') }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200">
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

                <!-- Modal Form -->
                <form @submit.prevent="handleSubmit" v-else>
                    <!-- Amend Type Selection (only show if multiple rooms) -->
                    <div v-if="isGroupAmend" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ $t('Perform Amend on') }}
                        </label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input
                                    v-model="formData.amendType"
                                    type="radio"
                                    value="group"
                                    class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary"
                                />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('Group') }}</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="formData.amendType"
                                    type="radio"
                                    value="individual"
                                    class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 focus:ring-primary"
                                />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('IndividualReservation') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Room Selection (only show for individual amend with multiple rooms) -->
                    <div v-if="isGroupAmend && formData.amendType === 'individual' && reservationRooms.length > 0" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ $t('Select Rooms') }}
                        </label>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            <label v-for="room in reservationRooms" :key="room.id" class="flex items-center">
                                <input
                                    v-model="formData.selectedRooms"
                                    type="checkbox"
                                    :value="room.room.id"
                                    class="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-primary"
                                />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    {{ room.room.roomNumber }} - {{ room.roomType?.roomTypeName }}
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Date and Nights Fields -->
                    <div class="mb-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputDatePicker :title="$t('arrivalDate')" v-model="formData.newArrivalDate"
                            :is-required="true" :disabled="true"/>
                        <InputDatePicker :title="$t('departureDate')" v-model="formData.newDepartureDate"
                            :is-required="true" />
                        <Input input-type="number" :lb="$t('nights')" :title="$t('nights')" v-model="formData.nights"
                            :is-required="true" />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
                        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                            :disabled="loading" />
                        <BasicButton type="submit" variant="primary" :label="$t('save')" :loading="loading" :disabled="!canAmend" />
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
import { X } from 'lucide-vue-next'
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

const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const isLoading = ref(false)
const reservation = ref<any>()
const reservationRooms = ref<any>([])

const formData = ref<AmendReservationData>({
    newArrivalDate: '',
    newDepartureDate: '',
    nights: 0,
    amendType: 'group',
    selectedRooms: []
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
    emit('close')
}



// Fetch booking details using getReservationDetailsById
const getBookingDetailsById = async () => {
    if (!props.reservationId) return

    isLoading.value = true
    try {
        const response = await getReservationDetailsById(Number(props.reservationId))
        console.log('Reservation details:', response)
        reservation.value = response
        reservationRooms.value = response.reservationRooms || []

        // Populate form data with reservation details
        if (response) {
            formData.value.newArrivalDate = new Date(response.arrivedDate).toISOString().split('T')[0]
            formData.value.newDepartureDate = new Date(response.departDate).toISOString().split('T')[0]
            formData.value.nights = response.nights ?? response.numberOfNights

            // Set amend type based on number of rooms
            if (reservationRooms.value.length > 1) {
                formData.value.amendType = 'group'
                formData.value.selectedRooms = reservationRooms.value.map((room: any) => room.room.id)
            } else {
                formData.value.amendType = 'individual'
                formData.value.selectedRooms = reservationRooms.value.map((room: any) => room.room.id)
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

        const resp = await amendReservation(amendData);
        console.log("resp",resp)
        // Emit the cancel confirmation event
        emit('amend-confirmed', {
            ...amendData,
            updatedReservation: {
                arrivedDate: amendData.newArrivalDate,
                departDate: amendData.newDepartureDate,
                nights: amendData.nights
            }
        })
        // emit('amend-confirmed', amendData)


        // Show success message
        toast.success(t('reservation_amended_successfully'))


        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error cancelling reservation:', error)
        toast.error(t('error_amended_reservation'))
    } finally {
        loading.value = false
    }
}
// Watch for modal open/close
watch(() => props.isOpen, (newVal) => {
    if (newVal && props.reservationId) {
        getBookingDetailsById()
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
        // Auto-select the single room and set to individual amend
        formData.value.amendType = 'individual'
        formData.value.selectedRooms = [newRooms[0].room.id]
    } else if (newRooms.length > 1) {
        // Auto-select all rooms for group amend
        if (formData.value.amendType === 'group') {
            formData.value.selectedRooms = newRooms.map((room: any) => room.room.id)
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

        if (daysDiff > 0) {
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
    if (props.isOpen && props.reservationId) {
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
