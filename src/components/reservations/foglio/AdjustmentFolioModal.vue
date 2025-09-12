<template>
    <div class="fixed inset-0 overflow-hidden z-999" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <!-- Background overlay -->
            <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="relative w-screen max-w-md">
                    <!-- Slide-over panel -->
                    <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                        <!-- Header -->
                        <div class="px-4 py-2 sm:px-4 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{
                                    $t('adjustmentFolio') }}</h2>
                                <XIcon @click="closeModal" class="text-gray-300 hover:text-red-500 cursor-pointer"
                                    aria-label="Close panel" />
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 px-4 py-6 space-y-4">
                            <!-- Adjustment Form Content -->
                            <div class="space-y-4">
                                <div>
                                    <InputDatePicker :title="$t('date')" v-model="formData.date" />
                                </div>
                                
                                <div>
                                    <Select :lb="$t('type')" v-model="formData.type"
                                        :options="adjustmentTypeOptions" />
                                </div>

                                <div>
                                    <InputFolioSelect :title="$t('folio')" v-model="formData.folioId"
                                        :reservationId="props.reservationId!" />
                                </div>

                                <div>
                                    <InputCurrency :lb="$t('amount')" v-model="formData.amount" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {{ $t('comment') }}
                                    </label>
                                    <textarea v-model="formData.comment" rows="3"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        :placeholder="$t('enterComment')"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
                            <div class="flex justify-end space-x-2">
                                <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"
                                    :disabled="isLoading" />
                                <BasicButton variant="primary" @click="saveAdjustment"
                                    :label="isLoading ? $t('Processing') + '...' : $t('save')"
                                    :disabled="isLoading || !isFormValid" :loading="isLoading" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { XIcon } from 'lucide-vue-next'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { addAdjustmentHandler } from '../../../services/foglioApi'

interface Props {
    folioId?: number | string
    reservationId?: number
    isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    folioId: undefined,
    reservationId: undefined,
    isOpen: false
})

const { t } = useI18n()
const toast = useToast()
const emit = defineEmits(['close', 'refresh', 'save'])

const isLoading = ref(false)

// Form data
const formData = reactive({
    date: new Date().toISOString().split('T')[0], // Today's date
    type: '',
    folioId: 0 as number,
    amount: 0 as number,
    comment: ''
})

// Form validation
const isFormValid = computed(() => {
    return formData.type &&
        formData.folioId &&
        formData.amount &&
        formData.amount !== 0 &&
        formData.comment.trim()
})

const closeModal = () => {
    // Reset form
    formData.date = new Date().toISOString().split('T')[0]
    formData.type = ''
    formData.folioId = 0
    formData.amount = 0
    formData.comment = ''

    emit('close')
}

const adjustmentTypeOptions = [
    {
        label: t('roundOff'),
        value: 'round_off'
    },
    {
        label: t('adjustment'),
        value: 'adjustment'
    },
    {
        label: t('correction'),
        value: 'correction'
    }
]

const saveAdjustment = async () => {
    if (!isFormValid.value) {
        toast.error(t('pleaseCompleteAllFields'))
        return
    }

    isLoading.value = true
    try {
        const payload = {
            folioId: formData.folioId,
            reservationId: props.reservationId,
            hotelId: useServiceStore().serviceId,
            type: formData.type,
            amount: Number(formData.amount),
            comment: formData.comment,
            date: formData.date
        }

        // Call the adjustment API function
        const response = await addAdjustmentHandler(payload)

        toast.success(t('adjustmentAddedSuccessfully'))
        emit('save', payload)
        emit('refresh')
        closeModal()

    } catch (error: any) {
        console.error('Error adding adjustment:', error)
        // Display server error message if available
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || t('adjustmentError')
        toast.error(errorMessage)
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
/* Add any specific styles if needed */
</style>