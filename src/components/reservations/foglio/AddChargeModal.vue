<template>
  <RightSideModal :is-open="isOpen" :title="$t('Add Charge')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">{{ $t('Add Charge') }}</h3>
    </template>
    <!-- Form -->
    <div class="px-2 space-y-4">
      <!-- Date -->
      <div>
        <InputDatePicker v-model="formData.date" :title="$t('Date')" />

      </div>

      <!-- Folio -->
      <div>
        <InputFolioSelect :title="$t('folio')" v-model="formData.folio" :reservation-id="reservationId"
          :is-required="true" />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="formData.recVouNumber" type="text" :lb="$t('Rec/Vou #')" :disabled="true"
          placeholder="Enter receipt/voucher number" />
      </div>


      <!-- Charge -->
      <div>
        <InputExtractChargeSelect v-model="formData.charge" :lb="$t('Charge')" @select="chargeSelected" />
      </div>
      <!-- Add as Inclusion 
      <div class="flex items-center">
        <input v-model="formData.addAsInclusion" type="checkbox" id="addAsInclusion"
          class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
        <label for="addAsInclusion" class="ml-2 text-sm text-gray-700">Add as Inclusion</label>
      </div>-->

      <!-- Quantity -->
      <div>
        <Input v-model="formData.quantity" input-type="number" min="1" class="w-20" :lb="$t('Qty')" />
      </div>

      <!-- Amount -->
      <div>
        <InputCurrency v-model="formData.amount" :lb="$t('amount')" />
      </div>

      <!-- Discount -->
      <div>
        <InputDiscountSelect v-model="formData.discount" />
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
      <div class="flex justify-end space-x-3">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('cancel')" :disabled="isLoading"></BasicButton>
        <BasicButton variant="primary" @click="saveCharge" :label="isLoading ? $t('Adding...') : $t('add')" :disabled="isLoading"></BasicButton>
      </div>
    </template>
  </RightSideModal>

</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import InputExtractChargeSelect from './InputExtractChargeSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import InputDiscountSelect from './InputDiscountSelect.vue'
import { postTransaction } from '@/services/foglioApi'
import { prepareFolioAmount, safeParseFloat, isValidMonetaryAmount } from '@/utils/numericUtils'
import { useToast } from 'vue-toastification'

interface Props {
  isOpen: boolean
  reservationId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const selectedCharge = ref<any>(null)
const isLoading = ref(false)
const toast = useToast()
const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  folio: '',
  recVouNumber: '',
  charge: '',
  addAsInclusion: false,
  quantity: 1,
  amount: 0,
  currency: 'Xaf',
  discount: '',
  comment: ''
})
const chargeSelected = (item: any) => {
  selectedCharge.value = item
  // Auto-populate amount when charge is selected
  if (item && item.rateInclusiveTax) {
    formData.amount = item.rateInclusiveTax * formData.quantity
  }
}
const closeModal = () => {
  emit('close')
}

const saveCharge = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    
    // Validate required fields
    if (!formData.folio || !formData.charge || !formData.amount || !selectedCharge.value) {
      toast.error('Please fill in all required fields (Folio, Charge, and Amount)')
      return
    }

    // Validate amount is a valid monetary value
    if (!isValidMonetaryAmount(formData.amount)) {
      toast.error('Please enter a valid amount')
      return
    }

    // Validate quantity
    if (formData.quantity < 1) {
      toast.error('Quantity must be at least 1')
      return
    }

    // Prepare charge data with proper mapping
    const chargeData = {
      folioId: Number(formData.folio),
      transactionType: 'charge',
      category: 'extract_charge',
      description: selectedCharge.value?.name || selectedCharge.value?.charge_name || 'Extra Charge',
      amount: prepareFolioAmount(formData.amount),
      quantity: safeParseFloat(formData.quantity, 1),
      unitPrice: safeParseFloat(selectedCharge.value?.rateInclusiveTax, 0),
      taxAmount: safeParseFloat(selectedCharge.value?.taxAmount, 0),
      departmentId: selectedCharge.value?.departmentId || '',
      reference: formData.recVouNumber || '',
      notes: formData.comment || '',
      discountId:Number(formData.discount)
    }

    console.log('Sending charge data:', chargeData)

    // Post the transaction
    const responseCharges = await postTransaction(chargeData)
    
    console.log('Response from API:', responseCharges)
    
    // Check if the response indicates success
    if (responseCharges && responseCharges.success !== false) {
      // Emit success event for parent component to refresh
     // emit('save', { ...chargeData, response: responseCharges })
      emit('refresh')
      toast.success('Charge added successfully!')
      closeModal()
    } else {
      const errorMessage = responseCharges?.message || 'Failed to add charge. Please try again.'
      toast.error(errorMessage)
    }
  } catch (error: any) {
    console.error('Error saving charge:', error)
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while adding the charge. Please try again.'
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

// Watch for quantity changes to update amount
watch(() => formData.quantity, (newQuantity) => {
  if (selectedCharge.value && selectedCharge.value.rateInclusiveTax && newQuantity > 0) {
    formData.amount = selectedCharge.value.rateInclusiveTax * newQuantity
  }
})

// Reset form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset form data
    formData.date = new Date().toISOString().split('T')[0]
    formData.folio = ''
    formData.recVouNumber = ''
    formData.charge = ''
    formData.addAsInclusion = false
    formData.quantity = 1
    formData.amount = 0
    formData.currency = 'Xaf'
    formData.discount = ''
    formData.comment = ''
    selectedCharge.value = null
    
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