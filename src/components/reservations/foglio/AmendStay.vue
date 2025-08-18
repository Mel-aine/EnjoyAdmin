<template>
    <!-- Cancel Reservation Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div
            class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ $t('amen_stay') }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Modal Form -->
                <form @submit.prevent="handleSubmit " v-if="props.reservation">
                    <!-- Cancellation Fee -->
                    <div class="mb-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputDatePicker :title="$t('arrivalDate')" v-model="formData.newArrivalDate"
                            :is-required="true" />
                        <InputDatePicker :title="$t('departureDate')" v-model="formData.newDepartureDate"
                            :is-required="true" />
                        <Input input-type="number" :lb="$t('nights')" :title="$t('nights')" v-model="formData.nights"
                            :is-required="true" />
                        <!--<div class="flex items-center justify-center">
                            <input type="checkbox" />
                            <label>{{ $t('overwirte_room_rate') }}</label>

                        </div>-->
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
                        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                            :disabled="loading" />
                        <BasicButton type="submit" variant="primary" :label="$t('save')" :loading="loading" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import { amendReservation } from '../../../services/reservation'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Input from '../../forms/FormElements/Input.vue'

interface Props {
    isOpen: boolean
    reservationId?: string | number
    reservationNumber?: string,
    reservation: any

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
}
const isloadingReason = ref(false)
const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)

const formData = ref<AmendReservationData>({
    newArrivalDate: '',
    newDepartureDate: '',
    nights: 0,
})

const resetForm = () => {
    formData.value = {
        newArrivalDate: '',
        newDepartureDate: '',
        nights: 0

    }
}

const closeModal = () => {
    emit('close')
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
            reservationNumber: props.reservationNumber
        }
        console.log('amendData', amendData)

        const resp = await amendReservation(amendData);
        // Emit the cancel confirmation event
        emit('amend-confirmed', amendData)


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
watch(()=>props.reservation, (newValue) => {
    if (newValue) {
        formData.value.newArrivalDate = newValue.arrivedDate
        formData.value.newDepartureDate = newValue.departDate
        formData.value.nights = newValue.nights ?? newValue.numberOfNights
    }
})

onMounted(() => { 
    if (props.reservation) {
        console.log('props.reservation', props.reservation)
        formData.value.newArrivalDate = new Date(props.reservation.arrivedDate).toISOString().split('T')[0]
        formData.value.newDepartureDate = new Date(props.reservation.departDate).toISOString().split('T')[0]
        formData.value.nights = props.reservation.nights ?? props.reservation.numberOfNights
    }

    console.log('formData', formData.value)
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