<template>
    <div class="fixed inset-0 overflow-hidden z-999" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <!-- Background overlay -->
            <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity dark:bg-black/40" aria-hidden="true"></div>

            <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="relative w-screen max-w-md">
                    <!-- Slide-over panel -->
                    <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                        <!-- Header -->
                        <div class="px-4 py-2 sm:px-4 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">
                                    {{ props.isEditMode ? $t('Edit Adjustment Folio') : $t('adjustmentFolio') }}</h2>
                                <XIcon @click="closeModal" class="text-gray-300 hover:text-red-500 cursor-pointer"
                                    aria-label="Close panel" />
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 px-4 py-6 space-y-4 dark:text-gray-100">
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
                                        :reservationId="props.reservationId" />
                                </div>

                                <div>
                                    <InputCurrency :lb="$t('amount')" v-model="formData.amount" :show-currency-selector="false" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {{ $t('comment') }}
                                    </label>
                                    <textarea v-model="formData.comment" rows="3"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        :placeholder="$t('comment')"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 dark:border-gray-700 dark:bg-gray-900">
                            <div class="flex justify-end space-x-2">
                                <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"
                                    :disabled="isLoading" />
                                <BasicButton variant="primary" @click="saveAdjustment"
                                    :label="isLoading ? (props.isEditMode ? $t('Updating...') : $t('Processing...')) : (props.isEditMode ? $t('Update') : $t('save'))"
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
import { ref, reactive, computed ,watch,nextTick} from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { XIcon } from 'lucide-vue-next'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { addAdjustmentHandler,updateAdjustmentHandler } from '../../../services/foglioApi'

interface Props {
    folioId?: number | string
    reservationId?: number
    isOpen?: boolean
    isEditMode?: boolean
    transactionData?: any
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
   isEditMode: false,
   transactionData: null
})

const { t } = useI18n()
const toast = useToast()
const emit = defineEmits(['close', 'refresh', 'save'])

const isLoading = ref(false)

// Form data
const formData = reactive({
    date: new Date().toISOString().split('T')[0], // Today's date
    type: 'round_off',
    folioId: props.folioId,
    amount: 0 as number,
    comment: ''
})

// Form validation
const isFormValid = computed(() => {
    return formData.type &&
        formData.folioId &&
        formData.amount &&
        formData.amount !== 0 //&&
        //formData.comment.trim()
})

const closeModal = () => {
    // Reset form
    formData.date = new Date().toISOString().split('T')[0]
    formData.type = 'round_off'
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
        label: t('correction'),
        value: 'correction'
    }
]


const loadTransactionData = () => {
  if (props.isEditMode && props.transactionData) {
    const tx = props.transactionData
    console.log("tx",props.transactionData)

    formData.date = tx.postingDate || new Date().toISOString().split('T')[0]
    formData.type = tx.particular
    formData.folioId = tx.folioId || ''
    formData.amount = tx.grossAmount || tx.amount || 0
    formData.comment = tx.notes || tx.description || ''


  }
}


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
             date: formData.date,
        }

          console.log('Sending charge data:', payload )
        // Call the adjustment API function
         const responseAdjustment = props.isEditMode
          ? await updateAdjustmentHandler(props.transactionData.id,payload)
          : await addAdjustmentHandler(payload)

         if (responseAdjustment && responseAdjustment.success !== false) {
          emit('refresh')
          toast.success(props.isEditMode ? t('AdjustmentUpdatedSuccessfully') : t('adjustmentAddedSuccessfully'))
          closeModal()
        } else {
          const errorMessage = responseAdjustment?.message || `Failed to ${props.isEditMode ? 'update' : 'add'} charge. Please try again.`
          toast.error(errorMessage)
        }

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

watch(() => props.isOpen, async(newVal) => {
  if (newVal) {
      console.log('Watch open triggered:', { isEditMode: props.isEditMode, tx: props.transactionData })
    if (props.isEditMode && props.transactionData) {
      console.log('props.isEditMode',props.isEditMode)
      // Mode édition : charger les données
      loadTransactionData()
      await nextTick()

    } else {
      // Mode création : réinitialiser
      formData.date = new Date().toISOString().split('T')[0]
      formData.folioId = props.folioId
      formData.type = ''
      formData.amount = 0
      formData.comment = ''

    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
}, { immediate: true })
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
