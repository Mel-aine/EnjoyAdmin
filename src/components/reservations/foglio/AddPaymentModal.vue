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
        <Select v-model="formData.folio" :options="folioOptions" :lb="$t('Folio')" />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="formData.recVouNumber" type="text" :lb="$t('Rec/Vou #')"
          placeholder="Enter receipt/voucher number" />
      </div>

      <!-- Type -->
      <div>
        <Select v-model="formData.type" :options="typeOptions" :lb="$t('Type')" />
      </div>

      <!-- Method -->
      <div>
        <Select v-model="formData.method" :options="methodOptions" :lb="$t('Method')" />
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <div class="flex space-x-2">
          <div class="flex-1">
            <Select v-model="formData.currency" :options="currencyOptions" />
          </div>
          <div class="flex-2">
            <Input v-model="formData.amount" input-type="number" min="0" step="0.01" />
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
        <BasicButton variant="primary" @click="savePayment" :label="'Save Payment'"></BasicButton>
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
import { getCurrencies, getPaymentMethods, getReservationTypes, getDiscounts, getTaxes, getExtraCharges } from '@/services/configrationApi'
import { getReservation } from '../../../services/api'
import { useServiceStore } from '../../../composables/serviceStore'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const serviceStore = useServiceStore()

// Options for dropdowns
const folioOptions = ref([
  { value: '', label: '-Select-' }
])

const typeOptions = ref([
  { value: '', label: '-Select-' }
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

const savePayment = () => {
  // Validate required fields
  if (!formData.folio || !formData.type || !formData.method || !formData.amount) {
    alert('Please fill in all required fields')
    return
  }

  if (formData.amount <= 0) {
    alert('Amount must be greater than 0')
    return
  }

  // Emit the form data
  emit('save', { ...formData })
  closeModal()
}

// Fetch currencies from API
const fetchCurrencies = async () => {
  try {
    const response = await getCurrencies()
    currencyOptions.value = currencyOptions.value.concat((response.data.data.data || []).map((currency: any) => {
      return { ...currency, label: `${currency.name} (${currency.symbol})`, value: currency.code }
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
      return { ...method, label: method.name, value: method.id }
    }))
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

// Fetch folios from API
const fetchFolios = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getReservation(serviceId)
    folioOptions.value = folioOptions.value.concat((response.data || [])?.map((folio: any) => {
      const guestName = folio.guest_name || `${folio.first_name || ''} ${folio.last_name || ''}`.trim() || 'Guest'
      return { ...folio, label: `${folio.id} - ${guestName}`, value: folio.id }
    }))
  } catch (error) {
    console.error('Error fetching folios:', error)
  }
}

// Fetch reservation types from API
const fetchReservationTypes = async () => {
  try {
    const response = await getReservationTypes()
    typeOptions.value = typeOptions.value.concat((response.data.data.data || [])?.map((type: any) => {
      return { ...type, label: type.name || type.type_name, value: type.id }
    }))
  } catch (error) {
    console.error('Error fetching reservation types:', error)
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
  fetchReservationTypes()
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