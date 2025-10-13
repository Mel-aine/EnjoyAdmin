<template>
    <!-- Apply Discount Room Charge Modal -->
    <!-- No Show Reservation Modal -->
    <RightSideModal :is-open="isOpen" :title="props.isEditMode ? $t('Edit Discount') : $t('applyDiscount')" @close="closeModal">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900">{{ props.isEditMode ? $t('Edit Discount') : $t('applyDiscount') }}</h3>
        </template>
        <div>
            <!-- Loading Skeleton -->
            <div v-if="isLoading" class="space-y-4">
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div class="flex space-x-4 mb-4">
                        <div class="h-4 bg-gray-200 rounded w-16"></div>
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 rounded mb-4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 rounded mb-4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 rounded mb-4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 rounded mb-4"></div>
                </div>
            </div>

            <!-- Modal Form -->
            <form v-else>
                <!-- Date -->
                <div class="mb-4">
                    <InputDatePicker v-model="formData.date" :title="$t('Date')" />
                </div>

                <!-- Discount Selection -->
                <div class="mb-4">
                    <InputDiscountSelect
                        v-model="formData.discountId"
                        :lb="$t('discount')"
                        :is-required="true"
                        @select="handleDiscountSelect"
                    />
                </div>

                <!-- Folio -->
                <div class="mb-4">
                    <InputFolioSelect
                        :title="$t('folio')"
                        v-model="formData.folio"
                        :reservation-id="reservationId"
                        :is-required="true"
                        @select="handleFolioSelect"
                    />
                </div>

                <!-- Discount Amount (if open discount) -->
                <div class="mb-4">
                    <InputCurrency
                        v-model="formData.discountAmount"
                        :lb="$t('discountAmount')"
                        disabled
                        :placeholder="$t('enterDiscountAmount')"
                        :is-required="true"
                    />
                </div>

                <!-- Notes -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('notes') }}
                    </label>
                    <textarea
                        v-model="formData.notes"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        :placeholder="$t('enterAdditionalNotes')"
                    ></textarea>
                </div>
            </form>
        </div>
        <template #footer>
            <div class="flex justify-end space-x-3 bg-gray-50">
                <BasicButton
                    type="button"
                    variant="outline"
                    @click="closeModal"
                    :label="$t('cancel')"
                    :disabled="loading"
                />
                <BasicButton
                    type="submit"
                    variant="primary"
                    @click="handleSubmit"
                    :label="loading ? (props.isEditMode ? $t('Updating...') : $t('Processing...')) : (props.isEditMode ? $t('Update') : $t('applyDiscount'))"
                    :loading="loading"
                />
            </div>
        </template>
    </RightSideModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDiscountSelect from './InputDiscountSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { getReservationDetailsById } from '../../../services/reservation'
import { applyDiscountHandler ,updateDiscountHandler } from '../../../services/foglioApi'
import RightSideModal from '../../modal/RightSideModal.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { safeParseInt } from '../../../utils/numericUtils'

interface Props {
    isOpen: boolean
    reservationId: number
    reservationNumber?: string
    folioId?: number
    isEditMode?: boolean
    transactionData?: any
}

interface Emits {
    (e: 'close'): void
    (e: 'discount-applied', data: ApplyDiscountData): void
}

interface ApplyDiscountData {
    discountId: number
    discountRule: string
    selectedNights?: string[]
    applyFor: string
    selectedTransactions?: number[]
    discountAmount?: number
    notes?: string
    reservationId?: string | number
    reservationNumber?: string
}

interface DiscountOption {
    id: number
    name?: string
    discount_name?: string
    type: 'percentage' | 'flat'
    value: number
    status: 'active' | 'inactive'
    open_discount?: boolean
}

interface NightInfo {
    date: string
    isAudited: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    folioId: undefined,
    isEditMode: false,
    transactionData: null
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const isLoading = ref(false)
const reservation = ref<any>()
const selectedDiscount = ref<DiscountOption | null>(null)
const selectedFolio = ref<any | null>(null)
const availableNights = ref<NightInfo[]>([])
const serviceStore = useServiceStore()

const formData = ref({
    discountId: 0 as number,
    discountAmount: 0,
    date: new Date().toISOString().split('T')[0],
    folio: '' as any,
    notes: ''
})

const isSaving = ref(false)

const loadTransactionData = () => {
    if (props.isEditMode && props.transactionData) {
        const tx = props.transactionData
        console.log("Loading transaction data:", tx)

        // Extraire la date de transactionDate (format ISO)
        const txDate = tx.transactionDate ? tx.transactionDate.split('T')[0] : new Date().toISOString().split('T')[0]
        formData.value.date = txDate

        // Charger le discountId
        formData.value.discountId = tx.discountId || 0

        // Charger le montant de la remise (convertir en positif car amount est négatif)
        formData.value.discountAmount = tx.discountAmount ? parseFloat(tx.discountAmount) : 0

        // Charger le folioId
        formData.value.folio = tx.folioId || ''

        // Charger les notes ou la description
        formData.value.notes = tx.notes || tx.description || ''
    }
}

// Watch for modal open/close
watch(() => props.isOpen, async(newVal) => {
    if (newVal && props.reservationId) {
        // await getReservationDetails()

        if (props.isEditMode && props.transactionData) {
            console.log('Edit Mode activated')
            // Mode édition : charger les données
            await nextTick()
            loadTransactionData()
        } else {

            if (props.folioId) {
                formData.value.folio = ''
            }
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

// Watch for reservationId changes
watch(() => props.reservationId, (newVal) => {
    if (newVal) {
        getReservationDetails()
        resetForm()
    }
})

// Watch for folioId changes and sync to formData
watch(() => props.folioId, (newVal) => {
    if (newVal) {
        formData.value.folio = newVal
    }
})

const getReservationDetails = async () => {
    if (!props.reservationId) return

    isLoading.value = true
    try {
        const response = await getReservationDetailsById(Number(props.reservationId))
        console.log('Reservation response:', response)
        reservation.value = response

        // Generate available nights based on reservation dates
        generateAvailableNights()

        console.log('Reservation data fetched:', reservation.value)
    } catch (error) {
        console.error('Error fetching reservation details:', error)
        toast.error(t('errorFetchingReservationDetails'))
    } finally {
        isLoading.value = false
    }
}

const generateAvailableNights = () => {
    if (!reservation.value?.arrivalDate || !reservation.value?.departureDate) return

    const startDate = new Date(reservation.value.arrivalDate)
    const endDate = new Date(reservation.value.departureDate)
    const nights: NightInfo[] = []

    const currentDate = new Date(startDate)
    while (currentDate < endDate) {
        nights.push({
            date: currentDate.toISOString().split('T')[0],
            isAudited: currentDate < new Date() // Assume past dates are audited
        })
        currentDate.setDate(currentDate.getDate() + 1)
    }

    availableNights.value = nights
}



const resetForm = () => {
    formData.value = {
        discountId: 0,
        discountAmount: 0,
        notes: '',
        date: new Date().toISOString().split('T')[0],
        folio: props.folioId || ''
    }
    selectedFolio.value = null
    selectedDiscount.value = null
}

const closeModal = () => {
    emit('close')
}

const handleSubmit = async () => {
    try {
        loading.value = true

        // Validate form
        if (!formData.value.discountId) {
            toast.error(t('pleaseSelectDiscount'))
            return
        }

        if (!formData.value.folio) {
            toast.error(t('pleaseSelectFolio'))
            return
        }

        isSaving.value = true

        // Build payload matching applyDiscountHandler schema
        const payload: any = {
            folioId: safeParseInt(formData.value.folio),
            discountId: safeParseInt(formData.value.discountId),
            reservationId: safeParseInt(props.reservationId),
            hotelId: safeParseInt(serviceStore.serviceId),
            transactionDate: formData.value.date,
            notes: formData.value.notes?.trim() || undefined
        }

        // Si mode édition, ajouter l'ID de la transaction
        if (props.isEditMode && props.transactionData?.id) {
            payload.transactionId = props.transactionData.id
        }

        console.log('Calling applyDiscountHandler with payload:', payload)
        const responseDiscount = props.isEditMode
          ? await updateDiscountHandler(props.transactionData.id,payload)
          : await applyDiscountHandler(payload)

         if (responseDiscount && responseDiscount.success !== false) {
          // emit('refresh')
           toast.success(props.isEditMode ? t('discountUpdatedSuccessfully') : t('discountAppliedSuccessfully'))
          closeModal()
        } else {
          const errorMessage = responseDiscount?.message || `Failed to ${props.isEditMode ? 'update' : 'add'} charge. Please try again.`
          toast.error(errorMessage)
        }

        // Emit the discount applied event
        emit('discount-applied', responseDiscount)
        // Close modal
        closeModal()
    } catch (error: any) {
        console.error('Error applying discount:', error)
        const errorMessage = error?.response?.data?.message || error?.message
        toast.error(errorMessage || (props.isEditMode ? t('errorUpdatingDiscount') : t('errorApplyingDiscount')))
    } finally {
        loading.value = false
        isSaving.value = false
    }
}

const handleFolioSelect = (folio: any) => {
  console.log('Selected folio:', folio)
  selectedFolio.value = folio

  if (typeof folio === 'number' || typeof folio === 'string') {
    const found = reservation.value?.folios?.find((f: any) => f.id === Number(folio))
    if (found) {
      selectedFolio.value = found
      console.log('Resolved folio object with balance:', found)
    }
  }

  formData.value.folio = selectedFolio.value?.id || ''
  recomputeDiscountAmount()
}

const handleDiscountSelect = (discount: DiscountOption) => {
  selectedDiscount.value = discount
  console.log('Selected discount:', discount)

  if (formData.value.folio) {
    formData.value.folio = ''
    selectedFolio.value = null
    console.log('Folio reset due to discount change')
  }

  formData.value.discountId = discount.id

  recomputeDiscountAmount()
}



onMounted(() => {

    if (props.reservationId) {
        getReservationDetails()
    }
    // if (props.folioId) {
    //     formData.value.folio = props.folioId
    // }
})

// Helpers
const roundToTwo = (num: number) => {
    return Number.isFinite(num) ? Math.round(num * 100) / 100 : 0
}

// Compute discount amount based on selected folio balance and discount type
const recomputeDiscountAmount = () => {
    const discount = selectedDiscount.value
    let rawBalance = selectedFolio.value?.balance


    if (!discount) {
        formData.value.discountAmount = 0
        return
    }
      if (!discount || !selectedFolio.value) {
        formData.value.discountAmount = 0
        return
      }


    // Normalize values (force number)
    const discountValue = Number(discount.value ?? 0)
    const discountType = discount.type
    let balanceNum = 0

    if (rawBalance == null) {
        balanceNum = 0
    } else {
        // remove spaces, replace commas if they are thousand separators (basic)
        const cleaned = String(rawBalance).trim().replace(/\s+/g, '').replace(/,/g, '.')
        balanceNum = Number(cleaned)
        if (!Number.isFinite(balanceNum)) balanceNum = 0
    }

    let amount = 0
    if (discountType === 'percentage') {
        // Percentage of folio balance (assume percentage is e.g. 10 for 10%)
        const base = balanceNum
        amount = roundToTwo(base * (discountValue / 100))
    } else if (discountType === 'flat') {
        amount = roundToTwo(discountValue)
    } else {
        // fallback
        amount = roundToTwo(discountValue)
    }

    // If balance is positive (guest owes money), do not exceed balance.
    // If balance is negative or zero, keep computed amount (or clamp to 0 if you want)
    if (Number.isFinite(balanceNum) && balanceNum > 0) {
        amount = Math.min(amount, roundToTwo(balanceNum))
    }

    // Guard against negative discount amount
    if (!Number.isFinite(amount) || amount < 0) amount = 0

    console.log('[recompute] computed amount:', amount, 'balanceNum:', balanceNum, 'discountValue:', discountValue)

    formData.value.discountAmount = amount
}

watch(selectedFolio, () => {
    recomputeDiscountAmount()
})

watch(selectedDiscount, () => {
    recomputeDiscountAmount()
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

/* Focus styles for better accessibility */
input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state styles */
.error {
    border-color: #ef4444;
}

.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Custom scrollbar */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: #a0aec0;
}
</style>
