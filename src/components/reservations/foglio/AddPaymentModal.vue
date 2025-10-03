<template>
  <RightSideModal :is-open="isOpen" :title="'Add Payment'" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">Add Payment</h3>
    </template>
    <!-- Form -->
    <div class="px-2 space-y-4">
      <!-- Date -->
      <div>
        <InputDatePicker v-model="formData.date" :title="$t('Date')" />
      </div>

      <!-- Folio -->
      <div>
        <InputFolioSelect :title="$t('folio')" v-model="formData.folio" @select="folioSelected"
          :reservation-id="reservationId" :is-required="true" />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="formData.recVouNumber" type="text" :lb="$t('Rec/Vou #')"
          placeholder="Enter receipt/voucher number" :disabled="true" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Type -->
        <div>
          <Select v-model="formData.type" :options="typeOptions" :lb="$t('Type')" />
        </div>

        <!-- Method -->
        <div>
          <InputPaymentMethodSelect v-model="formData.method" :payment-type="formData.type" @select="onMethodSelect" />
        </div>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{$t('Amount')}}</label>
        <div class="flex space-x-2">
          <div class="flex-2">
            <InputCurrency v-model="formData.amount" :currency="formData.currency" />
          </div>
        </div>
      </div>

      <!-- Comment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{$t('Comment')}}</label>
        <textarea v-model="formData.comment" rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
          placeholder="Enter any additional comments..."></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"></BasicButton>
        <BasicButton variant="primary" @click="savePayment" :label="'Save Payment'" :loading="isSaving"
          :disabled="isSaving"></BasicButton>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { createFolioTransaction } from '../../../services/foglioApi'
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
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = defineProps<Props>()
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
  folio: '',
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
    folio: '',
    recVouNumber: '',
    type: 'cash',
    method: null,
    amount: 0,
    currency: 'XAF',
    comment: ''
  })

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

const closeModal = () => {
  initializeFormData()
  emit('close')
}

watch(() => props.reservationData, (newData) => {
  if (newData && props.isOpen) {
    initializeFormData()
  }
}, { deep: true })

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

    // Prepare transaction data for API with safe numeric conversion
    const transactionData = {
      folioId: safeParseInt(formData.folio),
      transactionType: 'payment',
      transactionCategory: formData.type,
      category: 'room',
      description: `Payment - ${methodeSelected.value?.name || 'Unknown'}`,
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

    // Call the API to create folio transaction
    const response = await createFolioTransaction(transactionData)
    
    console.log('Payment API response:', response)

    // Show success message
    toast.success('Payment saved successfully')

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
    toast.error('Failed to save payment. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const onMethodSelect = (item: any) => {
  methodeSelected.value = item;
}

// Close modal on escape key
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
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