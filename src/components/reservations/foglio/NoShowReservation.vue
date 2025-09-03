<template>
    <!-- No Show Reservation Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div
            class="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ $t('noshow_reservation') }}
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
                                    v-model="formData.noShowType" 
                                    type="radio" 
                                    value="group" 
                                    :disabled="reservationRooms.length === 1"
                                    class="w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span class="ml-2 text-sm" :class="reservationRooms.length === 1 ? 'text-gray-400' : 'text-gray-700'">{{ $t('Group') }}</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    v-model="formData.noShowType" 
                                    type="radio" 
                                    value="individual" 
                                    class="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('Individual Reservation') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Room Selection -->
                    <div v-if="formData.noShowType === 'individual' && reservationRooms.length > 0" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('Select Rooms') }}
                        </label>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                            <label 
                                v-for="room in reservationRooms" 
                                :key="room.id" 
                                class="flex items-center p-2 border rounded hover:bg-gray-50"
                            >
                                <input 
                                    v-model="formData.selectedRooms" 
                                    type="checkbox" 
                                    :value="room.id" 
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span class="ml-2 text-sm text-gray-700">
                                    {{ room.room?.roomNumber }} - {{ room.guest?.displayName || room.guestName }}
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- No Show Fee -->
                    <div class="mb-4">
                        <InputCurrency v-model="formData.noShowFees" :lb="$t('noshow_fee')"
                            :placeholder="$t('enter_noshowFee_fee')" />
                    </div>

                    <!-- Reason Selection -->
                    <div class="mb-4">
                        <Select :lb="$t('reason')" :is-loading="isloadingReason" v-model="formData.reason" :options="reasonOptions"
                            :is-required="true" />
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
                        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                            :disabled="loading" />
                        <BasicButton type="submit" variant="danger" :label="$t('save')"
                            :loading="loading" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import Select from '../../forms/FormElements/Select.vue'
import { getReasons } from '../../../services/configrationApi'
import {  markNoShow, getReservationDetailsById } from '../../../services/reservation'

interface Props {
    isOpen: boolean
    reservationId?: string | number
    reservationNumber?: string
}

interface Emits {
    (e: 'close'): void
    (e: 'noshow-confirmed', data: NoShowReservationData): void
}

interface NoShowReservationData {
    noShowFees: number
    reason: string
    applyTax: boolean
    notes?: string
    reservationId?: string | number
    reservationNumber?: string
    noShowType?: string
    selectedRooms?: number[]
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
    noShowFees: 0,
    reason: '',
    applyTax: false,
    notes: '',
    noShowType: 'individual',
    selectedRooms: [] as number[]
})
const reasonOptions = ref([{ label: "select", value: '' }])

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

// Watch for noShowType changes
watch(() => formData.value.noShowType, (newType) => {
    if (newType === 'group') {
        formData.value.selectedRooms = reservationRooms.value.map((room: any) => room.id)
    } else {
        formData.value.selectedRooms = []
    }
})

// Watch for reservationRooms changes to handle single room auto-selection
watch(() => reservationRooms.value, (newRooms) => {
    if (newRooms.length === 1) {
        // Auto-select individual for single room and select the room
        formData.value.noShowType = 'individual'
        formData.value.selectedRooms = [newRooms[0].id]
    } else if (newRooms.length > 1) {
        // Auto-select all rooms for group no-show
        if (formData.value.noShowType === 'group') {
            formData.value.selectedRooms = newRooms.map((room: any) => room.id)
        }
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
        noShowFees: 0,
        applyTax: false,
        reason: '',
        notes: '',
        noShowType: 'individual',
        selectedRooms: []
    }
}

const closeModal = () => {
    emit('close')
}
const laodReason = async () => {
    isloadingReason.value = true;
    try {
        const res = await getReasons();
        console.log('data', res)
        reasonOptions.value = res.data.data.map((item: any) => {
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

        if (formData.value.noShowFees < 0) {
            toast.error(t('noshow_fee_must_be_positive'))
            return
        }

        // Validate room selection for individual no-show
        if (formData.value.noShowType === 'individual' && formData.value.selectedRooms.length === 0) {
            toast.error(t('please_select_at_least_one_room'))
            return
        }

        // Prepare data for emission
        const noShowData: NoShowReservationData = {
            noShowFees: formData.value.noShowFees,
            applyTax: formData.value.applyTax,
            reason: formData.value.reason,
            notes: formData.value.notes || undefined,
            reservationId: props.reservationId,
            reservationNumber: props.reservationNumber,
            noShowType: formData.value.noShowType,
            selectedRooms: formData.value.noShowType === 'group' 
                ? reservationRooms.value.map((room: any) => room.id)
                : formData.value.selectedRooms
        }
        console.log('noShowData', noShowData)

        const resp = await markNoShow(noShowData);
        // Emit the cancel confirmation event
        emit('noshow-confirmed', noShowData)

        // Show success message
        toast.success(t('reservation_noshow_initiated'))

        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error noshow reservation:', error)
        toast.error(t('error_noshow_reservation'))
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