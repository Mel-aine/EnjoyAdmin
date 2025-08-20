<template>
    <!-- Cancel Reservation Modal -->
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

                <!-- Modal Form -->
                <form @submit.prevent="handleSubmit">
                    <!-- Cancellation Fee -->
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
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import Select from '../../forms/FormElements/Select.vue'
import { getReasons } from '../../../services/configrationApi'
import { cancelReservation, markNoShow } from '../../../services/reservation'

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
}
const isloadingReason = ref(false)
const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)

const formData = ref({
    noShowFees: 0,
    reason: '',
    applyTax:false,
    notes: ''
})
const reasonOptions = ref([{ label: "select", value: '' }])
// Reset form when modal opens
watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        resetForm()
    }
})

const resetForm = () => {
    formData.value = {
        noShowFees: 0,
        applyTax:false,
        reason: '',
        notes: ''
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

        // Prepare data for emission
        const noShowData: NoShowReservationData = {
            noShowFees: formData.value.noShowFees,
            applyTax:formData.value.applyTax,
            reason: formData.value.reason,
            notes: formData.value.notes || undefined,
            reservationId: props.reservationId,
            reservationNumber: props.reservationNumber
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