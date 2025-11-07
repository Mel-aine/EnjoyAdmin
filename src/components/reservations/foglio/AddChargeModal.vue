<template>
  <RightSideModal :is-open="isOpen" :title="props.isEditMode ? $t('Edit Charge') : $t('Add Charge')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ props.isEditMode ? $t('Edit Charge') : $t('Add Charge') }}</h3>
    </template>
    <!-- Form -->
    <div class="px-2 space-y-4 text-gray-900 dark:text-gray-100">
      <!-- Date -->
      <div>
        <InputDatePicker v-model="formData.date" :title="$t('Date')" :disabled="isEditMode" />

      </div>

      <!-- Folio -->
      <div>
        <InputFolioSelect :title="$t('folio')" v-model="formData.folio" :reservation-id="reservationId" :disabled="isEditMode"
          :is-required="true" />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="formData.recVouNumber" type="text" :lb="$t('Rec/Vou #')" :disabled="true"
          placeholder="Enter receipt/voucher number" />
      </div>


      <!-- Charge -->
      <div>
        <InputExtractChargeSelect :disabled="isEditMode" v-model="formData.charge" :lb="$t('Charge')" @select="chargeSelected" />
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
        <InputCurrency v-model="formData.amount" :lb="$t('amount')" :show-currency-selector="false" />
      </div>

      <!-- Discount -->
      <div>
        <InputDiscountSelect v-model="formData.discount" />
      </div>

      <!-- Comment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment</label>
        <textarea v-model="formData.comment" rows="3"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Enter any additional comments..."></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3 dark:bg-gray-800">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('cancel')" :disabled="isLoading"></BasicButton>
        <BasicButton variant="primary" @click="saveCharge"  :label="isLoading ? (props.isEditMode ? $t('Updating...') : $t('Adding...')) : (props.isEditMode ? $t('Update') : $t('Add'))"  :disabled="isLoading"></BasicButton>
      </div>
    </template>
  </RightSideModal>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch,nextTick } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import InputExtractChargeSelect from './InputExtractChargeSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import InputDiscountSelect from './InputDiscountSelect.vue'
import { postTransaction ,updateTransaction } from '@/services/foglioApi'
import { prepareFolioAmount, safeParseFloat, isValidMonetaryAmount } from '@/utils/numericUtils'
import { useToast } from 'vue-toastification'


interface Props {
  isOpen: boolean
  reservationId: number
  folioId?: number | string
  isEditMode?: boolean
  transactionData?: any
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  transactionData: null
})
const emit = defineEmits<Emits>()
const selectedCharge = ref<any>(null)
const isLoading = ref(false)
const toast = useToast()
const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  folio: props.folioId as any,
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
    if (!formData.folio || !formData.charge || !formData.amount ||( !selectedCharge.value && !formData.charge)) {
      toast.error('Please fill in all required fields (Folio, Charge, and Amount)')
      return
    }

    if (!isValidMonetaryAmount(formData.amount)) {
      toast.error('Please enter a valid amount')
      return
    }

    if (formData.quantity < 1) {
      toast.error('Quantity must be at least 1')
      return
    }

    const chargeData :any = {
      folioId: Number(formData.folio),
      transactionType: 'charge',
      category: 'extract_charge',
      description: `${selectedCharge.value?.name || selectedCharge.value?.charge_name} Qt[${formData.quantity}]`,
      amount: prepareFolioAmount(formData.amount),
      quantity: safeParseFloat(formData.quantity, 1),
      unitPrice: safeParseFloat(selectedCharge.value?.rateInclusiveTax, 0),
      taxAmount: safeParseFloat(selectedCharge.value?.taxAmount, 0),
      departmentId: selectedCharge.value?.departmentId || '',
      reference: `${formData.recVouNumber}` || '',
      notes: formData.comment || '',
      extraChargeId: formData.charge,
      discountId: formData.discount ? Number(formData.discount) : undefined
    }

    // Si mode édition, ajouter l'ID de la transaction
    if (props.isEditMode && props.transactionData?.id) {
      chargeData.id = props.transactionData.id
    }

    console.log('Sending charge data:', chargeData )

    const responseCharges = props.isEditMode
      ? await updateTransaction(props.transactionData.id,chargeData)
      : await postTransaction(chargeData)

    if (responseCharges && responseCharges.success !== false) {
      emit('refresh')
      toast.success(props.isEditMode ? 'Charge updated successfully!' : 'Charge added successfully!')
      closeModal()
    } else {
      const errorMessage = responseCharges?.message || `Failed to ${props.isEditMode ? 'update' : 'add'} charge. Please try again.`
      toast.error(errorMessage)
    }
  } catch (error: any) {
    console.error('Error saving charge:', error)
    const errorMessage = error?.response?.data?.message || error?.message || `An error occurred while ${props.isEditMode ? 'updating' : 'adding'} the charge. Please try again.`
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const loadTransactionData = () => {
  if (props.isEditMode && props.transactionData) {
    const tx = props.transactionData
    formData.date = tx.postingDate || new Date().toISOString().split('T')[0]
    formData.folio = tx.folioId || props.folioId
    formData.recVouNumber = tx.transactionNumber || ''
    formData.quantity = tx.quantity || 1
    formData.amount = tx.grossAmount || tx.amount || 0
    formData.discount = tx.discountId || ''
    formData.comment = tx.notes || tx.description || ''
    formData.charge = tx.extraChargeId || tx.chargeId || tx.particular_id || ''
  }
}

// Watch for quantity changes to update amount
watch(() => formData.quantity, (newQuantity) => {
  if (selectedCharge.value && selectedCharge.value.rateInclusiveTax && newQuantity > 0) {
    formData.amount = selectedCharge.value.rateInclusiveTax * newQuantity
  }
})

// Reset form when modal opens
watch(() => props.isOpen, async(newVal) => {
  if (newVal) {
      console.log('Watch open triggered:', { isEditMode: props.isEditMode, tx: props.transactionData })
    if (props.isEditMode && props.transactionData) {
      console.log('props.isEditMode',props.isEditMode)
      loadTransactionData()
      await nextTick()

    } else {
      // Mode création : réinitialiser
      formData.date = new Date().toISOString().split('T')[0]
      formData.folio = props.folioId
      formData.recVouNumber = ''
      formData.charge = ''
      formData.addAsInclusion = false
      formData.quantity = 1
      formData.amount = 0
      formData.currency = 'Xaf'
      formData.discount = ''
      formData.comment = ''
      selectedCharge.value = null
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

// Keep formData.folio in sync if folioId prop changes while modal is open
watch(() => props.folioId, (newVal) => {
  if (newVal && props.isOpen) {
    formData.folio = Number(newVal)
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
