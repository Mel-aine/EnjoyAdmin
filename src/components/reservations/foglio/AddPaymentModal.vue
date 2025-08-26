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
        <InputFolioSelect :title="$t('folio')" v-model="formData.folio"
          :reservation-id="reservationId" :is-required="true" />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="formData.recVouNumber" type="text" :lb="$t('Rec/Vou #')"
          placeholder="Enter receipt/voucher number" />
      </div>

     <div class="grid grid-cols-2 gap-4">
       <!-- Type -->
      <div>
        <Select v-model="formData.type" :options="typeOptions" :lb="$t('Type')" />
      </div>

      <!-- Method -->
      <div>
        <Select v-model="formData.method" :options="methodOptions" :lb="$t('Method')" />
      </div>
     </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <div class="flex space-x-2">
          <div class="flex-2">
            <InputCurrency v-model="formData.amount" :currency="formData.currency" />
          </div>
        </div>
      </div>

      <!-- Comment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Comment</label>
        <textarea v-model="formData.comment" rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Enter any additional comments..."></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"></BasicButton>
        <BasicButton variant="primary" @click="savePayment" :label="'Save Payment'" :loading="isSaving" :disabled="isSaving"></BasicButton>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import { getCurrencies, getPaymentMethods, getReservationTypes, getDiscounts, getTaxes, getExtraCharges } from '@/services/configrationApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { getReservationFolios, createFolioTransaction } from '../../../services/foglioApi'
import { useToast } from 'vue-toastification'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { safeParseFloat, safeParseInt, prepareFolioAmount } from '../../../utils/numericUtils'
import { useI18n } from 'vue-i18n'

interface Props {
  isOpen: boolean
  reservationId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const isLoadingFolios = ref(false)
const isSaving = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const {t} = useI18n()

// Options for dropdowns
const folioOptions = ref([
  { value: '', label: '-Select-' }
])

const typeOptions = ref([
  { value: 'cash', label: t('cash') },
  { value: 'creditCard', label: t('credit_card') },
  { value: 'bankTransfer', label: t('bank_transfer') },
])


const discountOptions = ref([
  { value: '', label: '-Select-' }
])

const taxOptions = ref([
  { value: '', label: '-Select-' }
])

const extraChargeOptions = ref([
  { value: '', label: '-Select-' }
])

const methodOptions = ref([{ value: '', label: '-Select-' }])

const currencyOptions = ref([{ value: '', label: '-Select-' }])

// Form data
const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  folio: '',
  recVouNumber: '',
  type: 'cash',
  method: '',
  amount: 0,
  currency: 'XAF',
  comment: ''
})

// Methods
const closeModal = () => {
  // Reset form data
  Object.assign(formData, {
    date: new Date().toISOString().split('T')[0],
    folio: '',
    recVouNumber: '',
    type: 'cash',
    method: '',
    amount: 0,
    currency: 'XAF',
    comment: ''
  })
  emit('close')
}

const savePayment = async () => {
  // Validate required fields
  if (!formData.folio || !formData.type || !formData.method || !formData.amount) {
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
      description: `Payment - ${formData.type}`,
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

    // Call the API to create folio transaction
    const response = await createFolioTransaction(transactionData)
    
    // Show success message
    toast.success('Payment saved successfully')
    
    // Emit the form data with API response
    emit('save', { ...formData, transactionId: response.id })
    closeModal()
  } catch (error) {
    console.error('Error saving payment:', error)
    toast.error('Failed to save payment. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Fetch currencies from API
const fetchCurrencies = async () => {
  try {
    const response = await getCurrencies()
    currencyOptions.value = currencyOptions.value.concat((response.data.data.data || []).map((currency: any) => {
      return { ...currency, label: `${currency.name} (${currency.code})`, value: currency.code }
    }))
  } catch (error) {
    console.error('Error fetching currencies:', error)
  }
}

// Fetch payment methods from API
const fetchPaymentMethods = async () => {
  try {
    const response = await getPaymentMethods()
    methodOptions.value = methodOptions.value.concat((response.data.data.data || []).map((method: any) => {
      return { ...method, label: method.methodName, value: method.id }
    }))
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

// Fetch folios from API
const fetchFolios = async () => {
  try {
    isLoadingFolios.value = true
    const response = await getReservationFolios(props.reservationId)
    folioOptions.value = folioOptions.value.concat((response.data || [])?.map((folio: any) => {
      const guestName = folio.guest.displayName || `${folio.first_name || ''} ${folio.last_name || ''}`.trim() || 'Guest'
      return { ...folio, label: `${folio.id} - ${guestName}`, value: folio.id }
    }))
  } catch (error) {
    console.error('Error fetching folios:', error)
  } finally {
    isLoadingFolios.value = false
  }
}



// Fetch discounts from API
const fetchDiscounts = async () => {
  try {
    const response = await getDiscounts()
    discountOptions.value = discountOptions.value.concat((response.data.data.data || [])?.map((discount: any) => {
      return { ...discount, label: discount.name || discount.discount_name, value: discount.id }
    }))
  } catch (error) {
    console.error('Error fetching discounts:', error)
  }
}

// Fetch taxes from API
const fetchTaxes = async () => {
  try {
    const response = await getTaxes()
    taxOptions.value = taxOptions.value.concat((response.data.data.data || [])?.map((tax: any) => {
      return { ...tax, label: tax.name || tax.tax_name, value: tax.id }
    }))
  } catch (error) {
    console.error('Error fetching taxes:', error)
  }
}

// Fetch extra charges from API
const fetchExtraCharges = async () => {
  try {
    const response = await getExtraCharges()
    extraChargeOptions.value = extraChargeOptions.value.concat((response.data.data.data || []).map((charge: any) => {
      return { ...charge, label: charge.name || charge.charge_name, value: charge.id }
    }))
  } catch (error) {
    console.error('Error fetching extra charges:', error)
  }
}

// Initialize data on component mount
onMounted(() => {
  fetchCurrencies()
  fetchPaymentMethods()
  fetchFolios()
  fetchDiscounts()
  fetchTaxes()
  fetchExtraCharges()
})

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