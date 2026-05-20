<template>
  <RightSideModal :is-open="isOpen" :title="props.isEditMode ? $t('EditPayment') : $t('AddPayment')" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ props.isEditMode ? $t('EditPayment') : $t('AddPayment') }}
      </h3>
    </template>

    <div class="px-2 space-y-4 text-gray-900 dark:text-gray-100">

      <!-- Bannière crédit disponible -->
      <transition name="fade">
        <div
          v-if="hasCreditBalance"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-sm text-green-800 dark:text-green-200"
        >
          <span>💳</span>
          <span v-if="isLoadingCredit">{{ $t('loading_credit') }}</span>
          <span v-else>
            {{ $t('this_customer_has') }}
            <strong>{{ creditBalanceFormatted }}</strong>
          </span>
        </div>
      </transition>

      <!-- Date -->
      <div>
        <InputDatePicker v-model="formData.date" :title="$t('Date')" :disabled="isEditMode" />
      </div>

      <!-- Folio -->
      <div>
        <InputFolioSelect
          :disabled="isEditMode"
          :title="$t('folio')"
          v-model="formData.folio"
          @select="folioSelected"
          :reservation-id="reservationId"
          :is-required="true"
        />
      </div>

      <!-- Rec/Vou # -->
      <div>
        <Input
          v-model="formData.recVouNumber"
          type="text"
          :lb="$t('Rec/Vou #')"
          :placeholder="$t('Enter receipt/voucher number')"
          :disabled="true"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Type -->
        <div class="flex flex-col">
          <Select v-model="formData.type" :options="typeOptions" :lb="$t('Type')" />
        </div>

        <!-- Method -->
        <div class="flex flex-col">
          <div
            v-if="isCreditLedgerSelected"
            class="flex items-center h-[45px] mt-6 px-3 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/50 text-purple-800 dark:text-purple-200 text-sm font-medium shadow-sm"
          >
            <span class="mr-2">👤</span>
            <span>{{ creditLedgerDisplayName }}</span>
          </div>

          <InputPaymentMethodSelect
            v-else
            v-model="formData.method"
            :payment-type="formData.type"
            @select="onMethodSelect"
          />
        </div>
      </div>

      <!-- Montant -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('Amount') }}
        </label>
        <InputCurrency
          v-model="formData.amount"
          v-model:currency="formData.currency"
          :disabled="isCreditLedgerSelected"
        />
        <p
          v-if="isCreditLedgerSelected && hasCreditBalance"
          class="mt-1 text-xs text-purple-600 dark:text-purple-400"
        >
          {{ $t('credit_available') }} : {{ creditBalanceFormatted }}
          <span v-if="isAmountExceedingCredit" class="ml-2 text-red-500 font-semibold">
            {{ $t('exceeds_credit_available') }}
          </span>
        </p>
      </div>

      <!-- Commentaire -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('Comment') }}
        </label>
        <textarea
          v-model="formData.comment"
          rows="3"
          class="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          :placeholder="$t('Enter any additional comments...')"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2 dark:bg-gray-800">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')" />
        <BasicButton
          variant="primary"
          @click="savePayment"
          :label="isSaving
            ? (props.isEditMode ? $t('Updating...') : $t('Processing...'))
            : (props.isEditMode ? $t('Update') : $t('Save Payment'))"
          :loading="isSaving"
          :disabled="isSaving || isAmountExceedingCredit"
        />
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue'
import RightSideModal from '../../modal/RightSideModal.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import Select from '../../forms/FormElements/Select.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import InputPaymentMethodSelect from './InputPaymentMethodSelect.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { useAuthStore } from '../../../composables/user'
import { useGuestCreditBalance } from '@/composables/useCreditLedger'
import { createFolioTransaction, updateFolioTransaction } from '../../../services/foglioApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { safeParseInt, prepareFolioAmount } from '../../../utils/numericUtils'
import { toIntegerAmount } from '@/components/utilities/UtilitiesFunction'


interface Props {
  isOpen: boolean
  reservationId: number
  reservationData?: any
  folioId?: number | string
  isEditMode?: boolean
  transactionData?: any
  guestId?: number
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
const { creditBalance: fetchedCreditBalance, isLoading: isLoadingCredit, fetchBalance } = useGuestCreditBalance()
const hasCreditLedger = computed(() => {
  const service = serviceStore.getCurrentService
  return service?.hasCreditLedger ?? false
})

const hasCreditBalance = computed(() => fetchedCreditBalance.value > 0)
const availableCreditAmount = computed(() => fetchedCreditBalance.value)
const creditBalanceFormatted = computed(() =>
  `${Math.round(availableCreditAmount.value).toLocaleString('fr-FR')} FCFA`
)


const typeOptions = computed(() => {
  const canCityLedger = useAuthStore().hasPermission('access_to_transfer_charges_to_city_ledger')
  const canUseCreditLedger = formData.amount < 0 && hasCreditLedger.value 

  const options = [
    { value: 'cash', label: t('cash') },
    ...(canCityLedger ? [{ value: 'city_ledger', label: t('city_ledger') }] : []),
    ...(canUseCreditLedger ? [{ value: 'credit_ledger', label: t('credit_ledger') }] : []),
  ]

  return options
})

const isCreditLedgerSelected = computed(() => formData.type === 'credit_ledger')

const creditLedgerDisplayName = computed(() => {
  const guestName =
    props.reservationData?.guestName ||
    props.reservationData?.guest?.fullName ||
    props.reservationData?.guest?.displayName ||
    t('guest')
  return `${t('credit_balance')}: ${guestName}`
})

const isAmountExceedingCredit = computed(() =>
  isCreditLedgerSelected.value && formData.amount > availableCreditAmount.value
)


const selectedFolioBalance = ref(0)
const methodeSelected = ref<any>(null)

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

const resetForm = () => {
  Object.assign(formData, {
    date: new Date().toISOString().split('T')[0],
    folio: props.folioId || 0,
    recVouNumber: '',
    type: 'cash',
    method: null,
    amount: 0,
    currency: 'XAF',
    comment: ''
  })
  methodeSelected.value = null
  selectedFolioBalance.value = 0
}

const loadEditData = () => {
  if (!props.transactionData) return
  const payment = props.transactionData
 

  formData.date = new Date(payment.postingDate).toISOString().split('T')[0]
  formData.folio = payment.folioId
  formData.currency = payment.currencyCode
  formData.comment = payment.notes || payment.description || ''

  const rawAmount = toIntegerAmount(payment.grossAmount || payment.amount || payment.totalAmount || 0)
  const isRefund = payment.transactionType === 'refund' || payment.category === 'refund'
  formData.amount = isRefund ? -rawAmount : rawAmount

  const methodType = payment.paymentMethod?.methodType?.toLowerCase() || ''
  formData.type = methodType === 'city_ledger' ? 'city_ledger' : 'cash'
  formData.method = payment.paymentMethodId || 0

  if (payment.paymentMethod) {
    methodeSelected.value = {
      id: payment.paymentMethodId,
      methodName: payment.paymentMethod.methodName || payment.paymentMethod.name || 'Unknown',
      ...payment.paymentMethod
    }
  }
}


const applyAmountLogic = () => {
  if (isCreditLedgerSelected.value) {
    formData.amount = Math.min(selectedFolioBalance.value, availableCreditAmount.value)
  } else {
    formData.amount = selectedFolioBalance.value
  }
}

const isInitializing = ref(false)

const folioSelected = (item: any) => {
   console.log('folioSelected triggered', {
    rawBalance: item.balance,
    converted: toIntegerAmount(item.balance || 0),
    isInitializing: isInitializing.value
  })
  if (props.isEditMode) return
  if (isInitializing.value) return  

  const balance = toIntegerAmount(item.balance || 0)
  selectedFolioBalance.value = balance
  applyAmountLogic()
}

watch(() => formData.type, () => {
  if (!props.isEditMode) applyAmountLogic()
})

const onMethodSelect = (item: any) => {
  methodeSelected.value = item
}

watch(() => formData.amount, (newAmount) => {
  if (newAmount >= 0 && formData.type === 'credit_ledger') {
    formData.type = 'cash'
    methodeSelected.value = null
  }
})


const mapTypeToCategory = (type: string): string => {
  switch (type) {
    case 'city_ledger': return 'payment'
    case 'credit_ledger': return 'credit_ledger'
    default: return 'payment'
  }
}

const savePayment = async () => {
  if (!formData.folio || !formData.type || !formData.amount) {
    toast.error(t('Please fill in all required fields'))
    return
  }
  if (!isCreditLedgerSelected.value && !methodeSelected.value) {
    toast.error(t('Please select a payment method'))
    return
  }
  if (formData.amount === 0) {
    toast.error(t('Amount must not be 0'))
    return
  }
  if (isAmountExceedingCredit.value) {
    toast.error(`The amount exceeds the available credit (${creditBalanceFormatted.value})`)
    return
  }

  try {
    isSaving.value = true

    const methodName = methodeSelected.value?.methodName || methodeSelected.value?.name || 'Payment'
    const isRefund = formData.amount < 0

    const transactionData: any = {
      folioId: safeParseInt(formData.folio),
      reservationId: props.reservationId,
      guestId: props.guestId,
      hotelId: serviceStore.serviceId,
      currency: formData.currency,
      transactionDate: formData.date,
      postingDate: formData.date,
      status: 'posted',
      amount: prepareFolioAmount(Math.abs(formData.amount)),
      notes: formData.comment,
      reference: formData.recVouNumber,

      ...(isCreditLedgerSelected.value
        ? {
            transactionType: 'credit_ledger_transfer',
            category: 'credit_ledger',
            description: `Payment by customer credit — ${creditLedgerDisplayName.value}`,
            paymentMethodId: null,
          }
        : isRefund
          ? {
              transactionType: 'refund',
              category: 'refund',
              description: `Refund - ${methodName}`,
              paymentMethodId: safeParseInt(formData.method),
            }
        : {
            transactionType: 'payment',
            category: mapTypeToCategory(formData.type),
            description: `Payment - ${methodName}`,
            paymentMethodId: safeParseInt(formData.method),
          }
      ),
    }

    console.log(transactionData)

    const response = props.isEditMode && props.transactionData?.id
      ? await updateFolioTransaction(props.transactionData.id, transactionData)
      : await createFolioTransaction(transactionData)

    if (response && response.success !== false) {
      toast.success(props.isEditMode ? t('UpdateSuccessfully') : t('Payment saved successfully'))

      if (isCreditLedgerSelected.value && props.guestId) {
        await fetchBalance(props.guestId, serviceStore.serviceId!)
      }

      emit('save', { payment: transactionData, reservation: response.reservation || null })
      closeModal()
    } else {
      toast.error(response?.message || t('Failed to save payment'))
    }
  } catch (error: any) {
    console.error('Error saving payment:', error)
    toast.error(error?.response?.data?.message || t('Failed to save payment. Please try again.'))
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  resetForm()
  emit('close')
}


const initModal = async () => {
  isInitializing.value = true  

  if (props.guestId) {
    await fetchBalance(props.guestId, serviceStore.serviceId!)
  }

  if (props.isEditMode && props.transactionData) {
    loadEditData()
    await nextTick()
  } else {
    resetForm()
    if (props.reservationData && props.folioId) {
      const folio = props.reservationData.folios?.find((f: any) => f.id == props.folioId)
      if (folio) {
        selectedFolioBalance.value = toIntegerAmount(folio.balance)
        formData.amount = selectedFolioBalance.value
      }
    }
  }

  await nextTick()
  isInitializing.value = false  
}


onMounted(async () => {
  if (props.folioId) formData.folio = props.folioId
  if (props.isOpen) {
    await initModal()
  }
  console.log(props.reservationData)
})

watch(() => props.isOpen, async (isOpen) => {
  if (!isOpen) return
  await initModal()

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
  }
  document.addEventListener('keydown', handleEscape)
  return () => document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>