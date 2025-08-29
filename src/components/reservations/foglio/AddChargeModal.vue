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
        <InputExtractChargeSelect v-model="formData.charge" :lb="$t('Charge')" />
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
      <div class="flex justify-end ">
        <BasicButton variant="primary" @click="saveCharge" :label="$t('add')"></BasicButton>
      </div>
    </template>
  </RightSideModal>

</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import { getDiscounts, getExtraCharges } from '../../../services/configrationApi'
import { safeParseFloat, prepareFolioAmount, isValidMonetaryAmount } from '../../../utils/numericUtils'
import InputExtractChargeSelect from './InputExtractChargeSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import InputDiscountSelect from './InputDiscountSelect.vue'

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

const closeModal = () => {
  emit('close')
}

const saveCharge = () => {
  // Validate required fields
  if (!formData.charge || !formData.amount) {
    alert('Please fill in all required fields')
    return
  }

  // Validate amount is a valid monetary value
  if (!isValidMonetaryAmount(formData.amount)) {
    alert('Please enter a valid amount')
    return
  }

  // Prepare charge data with safe numeric conversion
  const chargeData = {
    ...formData,
    amount: prepareFolioAmount(formData.amount),
    quantity: safeParseFloat(formData.quantity, 1)
  }

  // Emit the prepared form data
  emit('save', chargeData)
  closeModal()
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