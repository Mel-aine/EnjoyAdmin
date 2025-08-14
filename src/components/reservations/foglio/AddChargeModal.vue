<template>
  <RightSideModal :is-open="isOpen" :title="'Add Charge'" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">Add Charge</h3>
    </template>
    <!-- Form -->
    <div class="px-2 space-y-4">
      <!-- Date -->
      <div>
        <InputDatePicker v-model="formData.date" :title="$t('Date')" />

      </div>

      <!-- Folio -->
      <div>
        <Select v-model="formData.folio" :options="foliosOptions" :lb="$t('Folio')" />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="formData.recVouNumber" type="text" :lb="$t('Rec/Vou #')"
          placeholder="Enter receipt/voucher number" />
      </div>


      <!-- Charge -->
      <div>
        <Select v-model="formData.charge" :options="chargeOptions" :lb="$t('Charge')" />
      </div>
      <!-- Add as Inclusion -->
      <div class="flex items-center">
        <input v-model="formData.addAsInclusion" type="checkbox" id="addAsInclusion"
          class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
        <label for="addAsInclusion" class="ml-2 text-sm text-gray-700">Add as Inclusion</label>
      </div>

      <!-- Quantity -->
      <div>
        <Input v-model="formData.quantity" input-type="number" min="1" class="w-20" :lb="$t('Qty')" />

      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <div class="flex space-x-2">
          <div class="flex-1">
            <Select v-model="formData.currency" :options="currencyOptions"  />
          </div>
          <div class="flex-2">
            <Input v-model="formData.amount" input-type="number" min="1" />
          </div>
        </div>
      </div>

      <!-- Discount -->
      <div>
        <Select v-model="formData.discount" :options="discountsOptions" :lb="$t('Discount')" />
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
import { X, Calendar, ChevronDown } from 'lucide-vue-next'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import { getDiscounts, getExtraCharges } from '../../../services/configrationApi'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const foliosOptions = ref([{ value: '', label: '-select-' }])
const chargeOptions = ref([{ value: '', label: '-select-' }])
const currencyOptions = ref([{ value: '', label: '-select-' }])
const discountsOptions = ref([{ value: '', label: '-select-' }])

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

  // Emit the form data
  emit('save', { ...formData })
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


// Fetch identity types from API
const loadata = async () => {
  try {
    const response = await getExtraCharges()
    console.log('response', response)
    chargeOptions.value = chargeOptions.value.concat((response.data.data.data || []).map((e: any) => {
      return { ...e, label: e.name, value: e.id }
    }))
  } catch (error) {
    console.error('Error fetching identity types:', error)
  } finally {
  }
}
// Fetch discounts from API
const fetchDiscounts = async () => {
  try {
    const response = await getDiscounts()
    discountsOptions.value =discountsOptions.value.concat(( response.data.data.data || []).map((e: any) => {
      return { ...e, label: e.name, value: e.id }
    }))
  } catch (error) {
    console.error('Error fetching discounts:', error)
  } finally {
  }
}

loadata()
fetchDiscounts()
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