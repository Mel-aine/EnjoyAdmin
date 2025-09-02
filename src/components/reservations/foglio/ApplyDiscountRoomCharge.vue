<template>
    <!-- Apply Discount Room Charge Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-visible h-full w-full z-50">
        <div
            class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-visible">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ $t('applyDiscount') }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <X class="w-5 h-5" />
                    </button>
                </div>

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
                    <!-- Discount Selection -->
                    <div class="mb-4">
                        <InputDiscountSelect 
                            v-model="formData.discountId" 
                            :lb="$t('discount')" 
                            :is-required="true"
                            @select="handleDiscountSelect"
                        />
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
                                <input 
                                    v-model="formData.discountRule" 
                                    type="radio" 
                                    value="all_nights" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('allNights') }}</span>
                            </label>
                            <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                                :class="formData.discountRule === 'first_night' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                                <input 
                                    v-model="formData.discountRule" 
                                    type="radio" 
                                    value="first_night" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('firstNight') }}</span>
                            </label>
                            <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                                :class="formData.discountRule === 'last_night' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                                <input 
                                    v-model="formData.discountRule" 
                                    type="radio" 
                                    value="last_night" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('lastNight') }}</span>
                            </label>
                            <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                                :class="formData.discountRule === 'select_nights' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                                <input 
                                    v-model="formData.discountRule" 
                                    type="radio" 
                                    value="select_nights" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('selectNights') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Night Selection (only for select_nights rule) -->
                    <div v-if="formData.discountRule === 'select_nights'" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('selectNightsToApplyDiscount') }}
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                            <label 
                                v-for="(night, index) in availableNights" 
                                :key="index" 
                                class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                :class="formData.selectedNights.includes(night.date) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
                            >
                                <input 
                                    v-model="formData.selectedNights" 
                                    type="checkbox" 
                                    :value="night.date" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">
                                    {{ formatDate(night.date) }} 
                                    <span class="text-gray-500">({{ night.isAudited ? $t('audited') : $t('notAudited') }})</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Apply For Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('applyFor') }}
                        </label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input 
                                    v-model="formData.applyFor" 
                                    type="radio" 
                                    value="all_rooms" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('allRooms') }}</span>
                            </label>
                            <label class="flex items-center" v-if="isGroupReservation">
                                <input 
                                    v-model="formData.applyFor" 
                                    type="radio" 
                                    value="selected_transaction" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700">{{ $t('applyToSelectedTransaction') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Transaction Selection (only for group reservations and selected_transaction) -->
                    <div v-if="isGroupReservation && formData.applyFor === 'selected_transaction'" class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('selectTransactions') }}
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="space-y-2 max-h-60 overflow-y-auto border rounded p-3">
                            <div v-if="loadingTransactions" class="text-center py-4">
                                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                <span class="text-sm text-gray-500 mt-2">{{ $t('loadingTransactions') }}</span>
                            </div>
                            <label 
                                v-else
                                v-for="transaction in availableTransactions" 
                                :key="transaction.id" 
                                class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                                :class="formData.selectedTransactions.includes(transaction.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
                            >
                                <input 
                                    v-model="formData.selectedTransactions" 
                                    type="checkbox" 
                                    :value="transaction.id" 
                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <div class="ml-3 flex-1">
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ transaction.particular || transaction.description }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ formatDate(transaction.postingDate) }} - 
                                        {{ formatCurrency(transaction.amount) }} - 
                                        {{ transaction.guest?.displayName || 'N/A' }}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Discount Amount (if open discount) -->
                    <div v-if="selectedDiscount?.open_discount" class="mb-4">
                        <InputCurrency 
                            v-model="formData.discountAmount" 
                            :lb="$t('discountAmount')" 
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
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            :placeholder="$t('enterAdditionalNotes')"
                        ></textarea>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3">
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
                            :label="$t('applyDiscount')"
                            :loading="loading" 
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
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
import { getReservationFolios } from '../../../services/foglioApi'
import { formatCurrency } from '../../utilities/UtilitiesFunction'

interface Props {
    isOpen: boolean
    reservationId?: string | number
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
const availableNights = ref<NightInfo[]>([])
const availableTransactions = ref<TransactionInfo[]>([])

const formData = ref({
    discountId: 0 as number ,
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
    if (!props.reservationId) return
    
    loadingTransactions.value = true
    try {
        const response = await getReservationFolios(Number(props.reservationId))
        console.log('Folio response:', response)
        
        // Extract all transactions from all folios
        const transactions: TransactionInfo[] = []
        if (response.data && Array.isArray(response.data)) {
            response.data.forEach((folio: any) => {
                if (folio.transactions && Array.isArray(folio.transactions)) {
                    folio.transactions.forEach((transaction: any) => {
                        // Only include room charge transactions
                        if (transaction.category === 'room' || transaction.particular?.toLowerCase().includes('room')) {
                            transactions.push({
                                id: transaction.id,
                                particular: transaction.particular || transaction.description || 'Room Charge',
                                description: transaction.description || transaction.particular || 'Room Charge',
                                amount: transaction.grossAmount || transaction.amount || 0,
                                postingDate: transaction.postingDate || transaction.day,
                                guest: folio.guest
                            })
                        }
                    })
                }
            })
        }
        
        availableTransactions.value = transactions
        console.log('Available transactions:', availableTransactions.value)
    } catch (error) {
        console.error('Error loading transactions:', error)
        toast.error(t('errorLoadingTransactions'))
    } finally {
        loadingTransactions.value = false
    }
}

const handleDiscountSelect = (discount: DiscountOption) => {
    selectedDiscount.value = discount
    console.log('Selected discount:', discount)
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
        notes: ''
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

        // Prepare data for emission
        const discountData: ApplyDiscountData = {
            discountId: formData.value.discountId!,
            discountRule: formData.value.discountRule,
            selectedNights: formData.value.discountRule === 'select_nights' ? formData.value.selectedNights : undefined,
            applyFor: formData.value.applyFor,
            selectedTransactions: formData.value.applyFor === 'selected_transaction' ? formData.value.selectedTransactions : undefined,
            discountAmount: selectedDiscount.value?.open_discount ? formData.value.discountAmount : undefined,
            notes: formData.value.notes || undefined,
            reservationId: props.reservationId,
            reservationNumber: props.reservationNumber
        }

        console.log('Discount data:', discountData)

        // TODO: Implement API call to apply discount
        // const response = await applyDiscountToRoomCharge(discountData)

        // Emit the discount applied event
        emit('discount-applied', discountData)

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