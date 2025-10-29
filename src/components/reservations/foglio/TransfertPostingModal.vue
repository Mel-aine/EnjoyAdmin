<template>
  <RightSideModal :is-open="isOpen" :title="$t('Transfer Posting')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('Transfer Posting') }}</h3>
    </template>

    <!-- Form -->
    <div class="px-2 space-y-4 text-gray-900 dark:text-gray-100">
      <!-- Date -->
      <div>
        <InputDatePicker v-model="form.date" :title="$t('Date')" />
      </div>

      <!-- Folio (destination, locked) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('folio') }}</label>
        <input :value="destinationFolioLabel" type="text" class="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" disabled />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input v-model="form.recVouNumber" type="text" :lb="$t('Rec/Vou #')" :disabled="true" placeholder="Enter receipt/voucher number" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Type (locked) -->
        <div>
          <Select v-model="form.type" :options="typeOptions" :lb="$t('Type')" :disabled="true" />
        </div>
        <!-- Spacer to mirror AddPayment layout -->
        <div></div>
      </div>

      <!-- Amount (locked to source folio balance) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('Amount') }}</label>
        <div class="flex space-x-2">
          <div class="flex-2">
            <InputCurrency v-model="form.amount" :currency="form.currency" :disabled="true" />
          </div>
        </div>
      </div>

      <!-- Comment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('Comment') }}</label>
        <textarea v-model="form.comment" rows="3" class="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" placeholder="Enter any additional comments..."></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2 dark:bg-gray-800">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"></BasicButton>
        <BasicButton variant="primary" @click="onAdd" :label="isLoading ? $t('Processing...') : $t('Add')" :loading="isLoading" :disabled="isLoading || !canAdd"></BasicButton>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { transferChargesBetweenFolios } from '../../../services/foglioApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ isOpen: boolean; sourceFolio: any; destinationFolio: any }>()
const emit = defineEmits(['close', 'success'])
const toast = useToast()
const { t } = useI18n()

const isLoading = ref(false)

const form = reactive({
  date: new Date().toISOString().split('T')[0],
  recVouNumber: '',
  type: 'balance_transfer',
  amount: 0,
  currency: 'XAF',
  comment: ''
})

const typeOptions = computed(() => [{ value: 'balance_transfer', label: t('Balance Transfer') }])

const destinationFolioLabel = computed(() => {
  const f = props.destinationFolio
  if (!f) return ''
  const guest = f.guest || f.guestName || ''
  return `${f.folioNumber ?? f.folio ?? ''} - ${guest}`
})

const initializeDefaults = () => {
  form.date = new Date().toISOString().split('T')[0]
  // Default amount equals source folio balance (locked)
  const srcBalance = Number(props.sourceFolio?.balance ?? 0)
  form.amount = Math.abs(srcBalance)
}

onMounted(() => {
  initializeDefaults()
})

watch(() => props.isOpen, (open) => {
  if (open) initializeDefaults()
})

const canAdd = computed(() => {
  return !!props.sourceFolio && !!props.destinationFolio && form.amount > 0 && !isLoading.value
})

const closeModal = () => emit('close')

const onAdd = async () => {
  if (!canAdd.value) return
  isLoading.value = true
  try {
    await transferChargesBetweenFolios({
      fromFolioId: props.sourceFolio.id,
      toFolioId: props.destinationFolio.id,
      amount: form.amount,
      description: form.comment,
      reference: form.recVouNumber,
    })
    toast.success(t('Transfer posted'))
    emit('success')
  } catch (e) {
    console.error('transfer posting error', e)
    toast.error(t('Failed to post transfer'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>