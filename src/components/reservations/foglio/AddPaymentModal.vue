<template>
  <RightSideModal :is-open="isOpen" :title="props.isEditMode ? $t('EditPayment') : $t('AddPayment')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ props.isEditMode ? $t('EditPayment') : $t('AddPayment') }}</h3>
    </template>
    <!-- Form -->
    <div class="px-2 space-y-4 text-gray-900 dark:text-gray-100">
      <!-- Date -->
      <div>
        <InputDatePicker v-model="formData.date" :title="$t('Date')" :disabled="isEditMode" />
      </div>

      <!-- Folio -->
      <div>
        <InputFolioSelect :disabled="isEditMode" :title="$t('folio')" v-model="formData.folio" @select="folioSelected"
          :reservation-id="reservationId" :is-required="true"  />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="formData.recVouNumber" type="text" :lb="$t('Rec/Vou #')"
          :placeholder="$t('Enter receipt/voucher number')" :disabled="true" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Type -->
        <div>
          <Select v-model="formData.type" :options="typeOptions" :lb="$t('Type')" />
        </div>

        <!-- Method -->
        <div>
          <InputPaymentMethodSelect v-model="formData.method" :payment-type="formData.type" @select="onMethodSelect"  />
        </div>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('Amount') }}</label>
        <div class="flex space-x-2">
          <div class="flex-2">
            <InputCurrency
              v-model="formData.amount"
              v-model:currency="formData.currency"
            />
          </div>
        </div>
      </div>

      <!-- Comment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('Comment') }}</label>
        <textarea v-model="formData.comment" rows="3"
          class="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          :placeholder="$t('Enter any additional comments...')"></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2 dark:bg-gray-800">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"></BasicButton>
        <BasicButton variant="primary" @click="savePayment" :label="isSaving ? (props.isEditMode ? $t('Updating...') : $t('Processing...')) : (props.isEditMode ? $t('Update') : $t('Save Payment'))" :loading="isSaving"
          :disabled="isSaving"></BasicButton>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed,nextTick } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { createFolioTransaction, updateFolioTransaction } from '../../../services/foglioApi'
import { useToast } from 'vue-toastification'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { safeParseInt, prepareFolioAmount } from '../../../utils/numericUtils'
import { useI18n } from 'vue-i18n'
import InputPaymentMethodSelect from './InputPaymentMethodSelect.vue'
import { useAuthStore } from '../../../composables/user'

interface Props {
  isOpen: boolean
  reservationId: number
  reservationData?: any
  folioId?: number | string
  isEditMode?: boolean
  transactionData?: any
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}


const props = withDefaults(defineProps<Props>(), {
    isEditMode: false,
    transactionData: null
})
const emit = defineEmits<Emits>()
const isSaving = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const { t } = useI18n()


const typeOptions = computed(() => {
  const canCityLedgerPay = useAuthStore().hasPermission('access_to_transfer_charges_to_city_ledger')
  return [
    { value: 'cash', label: t('cash') },
    ...(canCityLedgerPay ? [{ value: 'city_ledger', label: t('city_ledger') }] : [])
  ]
})

// Form data
const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  folio: 0 as any,
  recVouNumber: '',
  type: 'cash',
  method: null as number | null,
  amount: 0,
  currency: 'XAF',
  comment: ''
})

// Methods
const initializeFormData = () => {
  Object.assign(formData, {
    date: new Date().toISOString().split('T')[0],
    folio: props.folioId,
    recVouNumber: '',
    type: 'cash',
    method: null,
    amount: 0,
    currency: 'XAF',
    comment: ''
  })
  methodeSelected.value = null

  if (props.reservationData) {
    if (props.reservationData.payment_type) {
      formData.type = props.reservationData.payment_type
    }

    if (props.reservationData.payment_method) {
      formData.type = props.reservationData.payment_method
    }

    formData.comment = `Payment for reservation #${props.reservationId}`
  }
}

const loadPaymentData = () => {
  if (props.isEditMode && props.transactionData) {
    const payment = props.transactionData
    console.log("payment",props.transactionData)

    formData.date = new Date(payment.postingDate).toISOString().split('T')[0]
    const methodType = payment.paymentMethod?.type?.toLowerCase() || payment.transactionCategory || 'cash'
    formData.type = methodType === 'city_ledger' ? 'city_ledger' : 'cash'
    formData.folio = payment.folioId
    formData.amount = Math.abs(payment.grossAmount || payment.amount || payment.totalAmount || 0)
    formData.method = payment.paymentMethodId || 0
    formData.currency = payment.currencyCode 
    formData.comment = payment.notes || payment.description || ''

    if (payment.paymentMethod) {
      methodeSelected.value = {
        id: payment.paymentMethodId,
        methodName: payment.paymentMethod.name || payment.paymentMethod.methodName || 'Unknown',
        ...payment.paymentMethod
      }
    }

  }
}

const closeModal = () => {
  initializeFormData()
  emit('close')
}

watch(() => props.reservationData, (newData) => {
  if (newData && props.isOpen) {
    initializeFormData()
  }
}, { deep: true })

// Keep formData.folio in sync if folioId prop changes while modal is open
watch(() => props.folioId, (newVal) => {
  if (newVal && props.isOpen) {
    formData.folio = Number(newVal)
  }
})

const folioSelected = (item: any) => {
  formData.amount = item.balance;
}

const methodeSelected = ref<any>(null)

const savePayment = async () => {
  // Validate required fields
  if (!formData.folio || !formData.type || formData.method === null || !formData.amount) {
    toast.error('Please fill in all required fields')
    return
  }

  if (formData.amount <= 0) {
    toast.error('Amount must be greater than 0')
    return
  }

  try {
    isSaving.value = true
     const methodName = methodeSelected.value?.methodName || methodeSelected.value?.name || 'Payment'
    // Prepare transaction data for API with safe numeric conversion
    const transactionData:any = {
      folioId: safeParseInt(formData.folio),
      transactionType: 'payment',
      //transactionCategory: formData.type,
      category: 'payment',
      description: `Payment - ${methodName}`,
      amount: prepareFolioAmount(formData.amount),
      reference: formData.recVouNumber,
      notes: formData.comment,
      paymentMethodId: safeParseInt(formData.method),
      currency: formData.currency,
      transactionDate: formData.date,
      status: "posted",
      hotelId: serviceStore.serviceId,
      reservationId: props.reservationId
    }

    console.log('Transaction data being sent:', transactionData)

       if (props.isEditMode && props.transactionData?.id) {
            transactionData.transactionId = props.transactionData.id
        }

        console.log('transactionData:', transactionData)
        const response = props.isEditMode
          ? await updateFolioTransaction(props.transactionData.id,transactionData)
          : await createFolioTransaction(transactionData)

         if (response && response.success !== false) {
          // emit('refresh')
           toast.success(props.isEditMode ? t('UpdateSuccessfully') : t('Payment saved successfully'))
          closeModal()
        } else {
          const errorMessage = response?.message || t('payments.error.generic', {
            action: props.isEditMode ? t('commons.update') : t('commons.add')
          })
          toast.error(errorMessage)
        }


    console.log('Payment API response:', response)


    // Émettre les données nécessaires pour la mise à jour
    const paymentData = {
      payment: {
        amount: formData.amount,
        method: methodeSelected.value?.name || 'Unknown',
        type: formData.type,
        transactionId: response.id,
        date: formData.date
      },
      // Si la réponse contient les données mises à jour de la réservation
      reservation: response.reservation || null,
      balanceSummary: response.balanceSummary || response.reservation?.balanceSummary || null,
      // Données calculées pour la mise à jour locale
      calculatedUpdate: {
        paymentAmount: formData.amount
      }
    }

    console.log('Emitting payment data:', paymentData)

    emit('save', paymentData)
    closeModal()
  } catch (error) {
    console.error('Error saving payment:', error)
    toast.error(t('Failed to save payment. Please try again.'))
  } finally {
    isSaving.value = false
  }
}

const onMethodSelect = (item: any) => {
  methodeSelected.value = item;
}

// Close modal on escape key
// watch(() => props.isOpen, (newVal) => {
//   if (newVal) {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         closeModal()
//       }
//     }
//     document.addEventListener('keydown', handleEscape)

//     return () => {
//       document.removeEventListener('keydown', handleEscape)
//     }
//   }
// })

watch(() => props.isOpen, async(newVal) => {
  if (newVal) {
      console.log('Watch open triggered:', { isEditMode: props.isEditMode, tx: props.transactionData })
    if (props.isEditMode && props.transactionData) {
      console.log('props.isEditMode',props.isEditMode)
      // Mode édition : charger les données
      loadPaymentData()
      await nextTick()

    } else {

      formData.date = new Date().toISOString().split('T')[0]
      formData.currency = 'XAF'
      formData.folio = props.folioId
      formData.amount =  0
      formData.comment = ''
      formData.type = 'cash'
      formData.method = 0


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

onMounted(() => {
  if (props.folioId)
    formData.folio = props.folioId
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
</style>
