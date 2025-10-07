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
                <div class="mb-4">
                    <InputDatePicker v-model="formData.date" :title="$t('Date')" />
                </div>
                <!-- Discount Selection -->
                <div class="mb-4">
                    <InputDiscountSelect v-model="formData.discountId" :lb="$t('discount')" :is-required="true"
                        @select="handleDiscountSelect" />
                </div>

                <!-- Discount Rule Selection -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('discountRule') }}
                        <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                            :class="formData.discountRule === 'all_nights' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                            <input v-model="formData.discountRule" type="radio" value="all_nights"
                                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">{{ $t('allNights') }}</span>
                        </label>
                        <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                            :class="formData.discountRule === 'first_night' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                            <input v-model="formData.discountRule" type="radio" value="first_night"
                                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">{{ $t('firstNight') }}</span>
                        </label>
                        <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                            :class="formData.discountRule === 'last_night' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                            <input v-model="formData.discountRule" type="radio" value="last_night"
                                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">{{ $t('lastNight') }}</span>
                        </label>
                        <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                            :class="formData.discountRule === 'select_nights' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                            <input v-model="formData.discountRule" type="radio" value="select_nights"
                                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">{{ $t('selectNights') }}</span>
                        </label>
                    </div>
                </div>


                <!-- Transaction Selection (only for group reservations and selected_transaction) -->
                <div v-if="formData.discountRule === 'select_nights'" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('selectTransactions') }}
                        <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2 max-h-60 overflow-y-auto border rounded p-3">
                        <div v-if="loadingTransactions" class="text-center py-4">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto">
                            </div>
                            <span class="text-sm text-gray-500 mt-2">{{ $t('loadingTransactions') }}</span>
                        </div>
                        <label v-else v-for="transaction in availableTransactions" :key="transaction.transactionId"
                            class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                            :class="formData.selectedTransactions.includes(transaction.transactionId) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                            <input v-model="formData.selectedTransactions" type="checkbox"
                                :value="transaction.transactionId"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <div class="ml-3 flex-1">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ transaction.description }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ formatDate(transaction.transactionDate) }} -
                                    {{ formatCurrency(transaction.netAmount) }} -
                                </div>
                            </div>
                        </label>
                    </div>
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
import { getReservationDetailsById, applyDiscountReservationDetails } from '../../../services/reservation'
import { getReservationFolios } from '../../../services/foglioApi'
import { formatCurrency } from '../../utilities/UtilitiesFunction'
import RightSideModal from '../../modal/RightSideModal.vue'
import InputDatePicker from '../../forms/FormElements/InputDatePicker.vue'

interface Props {
    isOpen: boolean
    reservationId?: string | number
    reservationNumber?: string
    roomCharges: any
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
const availableNights = ref<NightInfo[]>([])
const availableTransactions = ref<any[]>([])

const formData = ref({
    date: new Date().toISOString().split('T')[0],
    discountId: 0 as number,
    discountRule: 'all_nights',
    selectedNights: [] as string[],
    applyFor: 'all_rooms',
    selectedTransactions: [] as number[],
    discountAmount: 0,
    notes: ''
})

// Computed properties
const isGroupReservation = computed(() => {
    return reservation.value?.reservationRooms?.length > 1
})

// Base amount: total room charges, optionally restricted to selected transactions
const baseRoomChargeAmount = computed(() => {
    const list = Array.isArray(availableTransactions.value) ? availableTransactions.value : []
    // If applying to selected transactions, filter to those
    const ids = formData.value.applyFor === 'selected_transaction' ? formData.value.selectedTransactions : []
    const filtered = ids && ids.length > 0
        ? list.filter((t: any) => ids.includes(t.transactionId))
        : list

    // Use netAmount if present, else amount
    const sum = filtered.reduce((acc: number, t: any) => {
        const val = Number.isFinite(t?.netAmount) ? Number(t.netAmount) : Number(t?.amount ?? 0)
        return acc + (Number.isFinite(val) ? val : 0)
    }, 0)
    return sum
})

// Recalculate discount amount when selection or base changes
const recalcDiscountAmount = () => {
    const discount = selectedDiscount.value
    const base = baseRoomChargeAmount.value
    let computedAmount = 0

    if (!discount) {
        formData.value.discountAmount = 0
        return
    }

    if (discount.type === 'percentage') {
        const pct = Number(discount.value)
        if (Number.isFinite(pct) && pct > 0) {
            computedAmount = (base * pct) / 100
        }
    } else if (discount.type === 'flat') {
        const flat = Number(discount.value)
        if (Number.isFinite(flat) && flat > 0) {
            computedAmount = flat
        }
    } else if (discount.open_discount) {
        // Keep user-entered open discount untouched; do not auto-calc
        computedAmount = formData.value.discountAmount || 0
    }

    formData.value.discountAmount = Math.round(computedAmount * 100) / 100
}

watch(selectedDiscount, () => {
    recalcDiscountAmount()
})

watch(baseRoomChargeAmount, () => {
    recalcDiscountAmount()
})

watch(() => formData.value.selectedTransactions, () => {
    recalcDiscountAmount()
}, { deep: true })

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

// Watch for discount rule changes
watch(() => formData.value.discountRule, (newRule) => {
    if (newRule !== 'select_nights') {
        formData.value.selectedNights = []
    }
})

// Watch for apply for changes
watch(() => formData.value.applyFor, (newApplyFor) => {
    if (newApplyFor === 'selected_transaction' && isGroupReservation.value) {
        loadTransactions()
    } else {
        formData.value.selectedTransactions = []
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

const loadTransactions = async () => {
    if (!props.roomCharges) return

    loadingTransactions.value = true
    try {
        availableTransactions.value = props.roomCharges
        console.log('Available transactions:', availableTransactions.value)
    } catch (error) {
        console.error('Error loading transactions:', error)
        toast.error(t('errorLoadingTransactions'))
    } finally {
        loadingTransactions.value = false
    }
}
loadTransactions();

const handleDiscountSelect = (discount: DiscountOption) => {
    selectedDiscount.value = discount
    console.log('Selected discount:', discount)
    // Immediately recompute after selection
    recalcDiscountAmount()
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
}

const resetForm = () => {
    formData.value = {
        discountId: 0,
        discountRule: 'all_nights',
        selectedNights: [],
        applyFor: 'all_rooms',
        selectedTransactions: [],
        discountAmount: 0,
        notes: '',
        date: new Date().toISOString().split('T')[0],
    }
    selectedDiscount.value = null
    availableNights.value = []
    availableTransactions.value = []
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

        if (!formData.value.discountRule) {
            toast.error(t('pleaseSelectDiscountRule'))
            return
        }

        if (formData.value.discountRule === 'select_nights' && formData.value.selectedNights.length === 0) {
            toast.error(t('pleaseSelectAtLeastOneNight'))
            return
        }

        if (formData.value.applyFor === 'selected_transaction' && formData.value.selectedTransactions.length === 0) {
            toast.error(t('pleaseSelectAtLeastOneTransaction'))
            return
        }

        if (selectedDiscount.value?.open_discount && (!formData.value.discountAmount || formData.value.discountAmount <= 0)) {
            toast.error(t('pleaseEnterValidDiscountAmount'))
            return
        }

        // Map rule to API schema enum names
        const mapRule = (rule: string): 'allNights' | 'firstNight' | 'lastNight' | 'selectNights' => {
            switch (rule) {
                case 'all_nights': return 'allNights'
                case 'first_night': return 'firstNight'
                case 'last_night': return 'lastNight'
                case 'select_nights': return 'selectNights'
                default: return 'allNights'
            }
        }

        // Build payload to match applyDiscountReservationDetails schema
        const payload = {
            discountId: Number(formData.value.discountId),
            discountRule: mapRule(formData.value.discountRule),
            selectedTransactions: formData.value.discountRule === 'select_nights' ? formData.value.selectedTransactions.map(Number).filter(n => Number.isFinite(n) && n > 0) : undefined,
            date: formData.value.date || undefined,
            notes: formData.value.notes?.trim() || undefined
        }

        console.log('Calling applyDiscountReservationDetails with payload:', payload)
        const response = await applyDiscountReservationDetails(Number(props.reservationId), payload)

        // Emit and notify
        emit('discount-applied', response?.data ?? payload)
        toast.success(response?.message || t('discountAppliedSuccessfully'))
        closeModal()
    } catch (error) {
        console.error('Error applying discount:', error)
        toast.error(t('errorApplyingDiscount'))
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (props.reservationId) {
        getReservationDetails()
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