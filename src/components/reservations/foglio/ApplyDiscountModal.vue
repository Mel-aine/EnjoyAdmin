<template>
    <!-- Apply Discount Room Charge Modal -->
    <!-- No Show Reservation Modal -->
    <RightSideModal :is-open="isOpen" :title="$t('applyDiscount')" @close="closeModal">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('applyDiscount') }}</h3>
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
            <form v-else @submit.prevent="handleSubmit">
                <!-- Date -->
                <div class="mb-4">
                    <InputDatePicker v-model="formData.date" :title="$t('Date')" />

                </div>
                <!-- Discount Selection -->
                <div class="mb-4">
                    <InputDiscountSelect v-model="formData.discountId" :lb="$t('discount')" :is-required="true"
                        @select="handleDiscountSelect" />
                </div>
                <!-- Folio -->
                <div class="mb-4">
                    <InputFolioSelect :title="$t('folio')" v-model="formData.folio" :reservation-id="reservationId"
                        :is-required="true" @select="handleFolioSelect" />
                </div>

                <!-- Discount Amount (if open discount) -->
                <div class="mb-4">
                    <InputCurrency v-model="formData.discountAmount" :lb="$t('discountAmount')" disabled
                        :placeholder="$t('enterDiscountAmount')" :is-required="true" />
                </div>

                <!-- Notes -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('notes') }}
                    </label>
                    <textarea v-model="formData.notes" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        :placeholder="$t('enterAdditionalNotes')"></textarea>
                </div>
            </form>
        </div>
        <template #footer>
            <div class="flex justify-end space-x-3 bg-gray-50">
                <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                    :disabled="loading" />
                <BasicButton type="submit" variant="primary" @click="handleSubmit" :label="$t('applyDiscount')"
                    :loading="loading" />
            </div>
        </template>
    </RightSideModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../../buttons/BasicButton.vue'
import InputDiscountSelect from './InputDiscountSelect.vue'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { getReservationDetailsById } from '../../../services/reservation'
import { createFolioTransaction, getReservationFolios } from '../../../services/foglioApi'
import { formatCurrency } from '../../utilities/UtilitiesFunction'
import RightSideModal from '../../modal/RightSideModal.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'
import InputFolioSelect from './InputFolioSelect.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { prepareFolioAmount, safeParseInt } from '../../../utils/numericUtils'

interface Props {
    isOpen: boolean
    reservationId: number
    reservationNumber?: string
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

interface TransactionInfo {
    id: number
    particular: string
    description: string
    amount: number
    postingDate: string
    guest?: {
        displayName: string
    }
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const isLoading = ref(false)
const loadingTransactions = ref(false)
const reservation = ref<any>()
const selectedDiscount = ref<DiscountOption | null>(null)
const selectedFolio = ref<any | null>(null)
const availableNights = ref<NightInfo[]>([])
const availableTransactions = ref<TransactionInfo[]>([])
const serviceStore = useServiceStore()
const formData = ref({
    discountId: 0 as number,
    discountAmount: 0,
    date: new Date().toISOString().split('T')[0],
    folio: '',
    notes: ''
})
const isSaving = ref(false);
// Computed properties
const isGroupReservation = computed(() => {
    return reservation.value?.reservationRooms?.length > 1
})

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
    if (newValue && props.reservationId) {
        resetForm()
        getReservationDetails()
    }
})

// Watch for reservationId changes
watch(() => props.reservationId, (newVal) => {
    if (newVal) {
        getReservationDetails()
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

const handleDiscountSelect = (discount: DiscountOption) => {
    selectedDiscount.value = discount
    console.log('Selected discount:', discount)
    // Ensure form data holds the selected discount ID
    formData.value.discountId = discount.id
    // Recompute discount amount when discount changes
    recomputeDiscountAmount()
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
}

const resetForm = () => {
    formData.value = {
        discountId: 0,
        discountAmount: 0,
        notes: '',
        date: new Date().toISOString().split('T')[0],
        folio: ''
    }
    selectedFolio.value = null
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



        if (selectedDiscount.value?.open_discount && (!formData.value.discountAmount || formData.value.discountAmount <= 0)) {
            toast.error(t('pleaseEnterValidDiscountAmount'))
            return
        }

        isSaving.value = true

        // Prepare transaction data for API with safe numeric conversion
        const transactionData = {
            folioId: safeParseInt(formData.value.folio),
            transactionType: 'discount',
            transactionCategory: 'payment',
            category: 'payment',
            description: `Discount - ${selectedDiscount.value?.name}`,
            amount: prepareFolioAmount(formData.value.discountAmount),
           /// reference: formData.recVouNumber,
            notes: formData.value.notes,
            discountId: formData.value.discountId,
            //paymentMethodId: safeParseInt(formData.method),
          //  currency: formData.currency,
            transactionDate: formData.value.date,
            status: "posted",
            hotelId: serviceStore.serviceId,
            reservationId: props.reservationId
        }

        console.log('Transaction data being sent:', transactionData)

        // Call the API to create folio transaction
        const response = await createFolioTransaction(transactionData)


        // Emit the discount applied event
        emit('discount-applied', response)

        // Show success message
        toast.success(t('discountAppliedSuccessfully'))

        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error applying discount:', error)
        toast.error(t('errorApplyingDiscount'))
    } finally {
        loading.value = false
    }
}
const handleFolioSelect = (folio: any) => {
    console.log('folio', folio)
    // Capture selected folio and set its ID
    selectedFolio.value = folio
    formData.value.folio = folio?.id || ''
    // Recompute discount based on folio balance and selected discount
    recomputeDiscountAmount()
}
onMounted(() => {
    if (props.reservationId) {
        getReservationDetails()
    }
})

// Helpers
const roundToTwo = (num: number) => {
    return Number.isFinite(num) ? Math.round(num * 100) / 100 : 0
}

// Compute discount amount based on selected folio balance and discount type
const recomputeDiscountAmount = () => {
    const discount = selectedDiscount.value
    const balance = selectedFolio.value?.balance

    if (!discount) {
        formData.value.discountAmount = 0
        return
    }

    let amount = 0
    if (discount.type === 'percentage') {
        // Percentage of folio balance
        const base = parseFloat(`${balance}`)
        amount = roundToTwo(base * (Number(discount.value) / 100))
    } else if (discount.type === 'flat') {
        // Flat amount
        amount = roundToTwo(Number(discount.value))
    }

    // Optional: prevent discount exceeding current balance
    if (typeof balance === 'number') {
        amount = Math.min(amount, roundToTwo(balance))
    }

    formData.value.discountAmount = amount
}
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