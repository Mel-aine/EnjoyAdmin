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
                                    $t('roomCharges') }}</h2>
                                <XIcon @click="closeModal" class="text-gray-300 hover:text-red-500 cursor-pointer"
                                    aria-label="Close panel" />
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 px-4 py-6 space-y-4">
                            <!-- Room Charge Form Content -->
                            <div class="space-y-4">
                                <div>
                                    <InputDatePicker :title="$t('date')" v-model="formData.date" />
                                </div>
                                <div>
                                    <Select :lb="$t('chargeSubType')" :placeholder="$t('selectChargeSubType')" v-model="formData.chargeSubtype"
                                        :options="chargeSubTypeOptions" />
                                </div>

                                <div>
                                    <InputFolioSelect :title="$t('folio')" v-model="formData.folioId"
                                        :reservationId="props.reservationId!" />

                                </div>

                                <Toggle :title="$t('complementaryRoom')" v-model="formData.complementary" />

                                <div>
                                    <InputCurrency :lb="$t('amount')" v-model="formData.amount" />
                                </div>

                                <Toggle :title="$t('taxInclusive')" v-model="formData.taxInclusive" />

                                <InputDiscountSelect v-model="formData.discount" :lb="$t('discount')" />
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {{ $t('comment') }}
                                    </label>
                                    <textarea v-model="formData.description" rows="3"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        :placeholder=" $t('comment')"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
                            <div class="flex justify-end space-x-2">
                                <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"
                                    :disabled="isLoading" />
                                <BasicButton variant="primary" @click="saveRoomCharge"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { XIcon } from 'lucide-vue-next'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Toggle from '../../forms/FormElements/Toggle.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import InputDiscountSelect from './InputDiscountSelect.vue'
import { addRoomChargeHandler } from '../../../services/foglioApi'

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
    amount: 0 as number,
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    taxInclusive: false,
    folioId:0 as number,
    complementary:false,
    discount:0 as number,
    chargeSubtype:'',
})

// Form validation
const isFormValid = computed(() => {
    return formData.chargeSubtype &&
        formData.amount &&
        formData.amount > 0 
})

const closeModal = () => {
    // Reset form
    formData.chargeSubtype = ''
    formData.amount = 0
    formData.description = ''
    formData.date = new Date().toISOString().split('T')[0]
    formData.taxInclusive = false

    emit('close')
}

const chargeSubTypeOptions = [
    {
        label: t('cancellationRevenue'),
        value: 'cancellation_revenue'
    },
    {
        label: t('dayUserCharge'),
        value: 'day_user_charge'
    },
    {
        label: t('lateCheckoutCharge'),
        value: 'late_checkout_charge'
    },
    {
        label: t('noShowRevenue'),
        value: 'no_show_revenue'
    }
    ,
    {
        label: t('roomCharge'),
        value: 'room_charge'
    }

]
const saveRoomCharge = async () => {
    if (!isFormValid.value) {
        toast.error(t('pleaseCompleteAllFields'))
        return
    }

    isLoading.value = true
    try {
        const payload = {
            folioId: props.folioId ? Number(props.folioId) : formData.folioId,
            reservationId: props.reservationId,
            hotelId: useServiceStore().serviceId,
            chargeSubtype: formData.chargeSubtype,
            amount: parseFloat(`${formData.amount}`),
            description: formData.description,
            date: formData.date,
            taxInclusive: formData.taxInclusive,
            complementary:formData.complementary,
            discountId:formData.discount ? Number(formData.discount) : undefined,
        }

        // Here you would call the appropriate API function
        const response = await addRoomChargeHandler(payload)

    

        toast.success(t('roomChargeAddedSuccessfully'))
        emit('save', payload)
        emit('refresh')
        closeModal()

    } catch (error: any) {
        console.error('Error adding room charge:', error)
        // Display server error message if available
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || t('roomChargeError')
        toast.error(errorMessage)
    } finally {
        isLoading.value = false
    }
}
onMounted(()=>{
    if(props.folioId)
    formData.folioId = Number(props.folioId)
})
</script>