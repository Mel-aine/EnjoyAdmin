<template>
    <!-- Apply Discount Room Charge Modal -->
    <!-- No Show Reservation Modal -->
    <RightSideModal :is-open="isOpen" :title="$t('updateDetails')" @close="closeModal">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('updateDetails') }}</h3>
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
                <!-- Rate Types -->
                <div class="mb-4">
                    <div class="relative">
                        <Select :options="rateTypes" v-model="formData.rateType" class="min-w-[12rem]" :lb="$t('rateType')"
                            :is-loading="loadingRates" />
                    </div>
                </div>
                <!-- Pax (A:C) -->
                <div class="mb-4 grid grid-cols-2 gap-4">
                    <Input v-model="formData.adults" :input-type="'number'" :lb="$t('adults')" :is-required="true" />
                    <Input v-model="formData.children" :input-type="'number'" :lb="$t('children')"
                        :is-required="true" />
                </div>
                <!-- Complementary -->
                <div class="md:flex relative justify-between mb-4">
                    <div class="space-x-2">
                        <label class="inline-flex items-center cursor-pointer ">
                            <input type="checkbox" class="form-checkbox" v-model="formData.isComplementary" />
                            <span class="ml-2  text-md font-medium text-gray-700 dark:text-gray-400">{{
                                $t('ComplimentaryRoom')
                                }}</span>
                        </label>
                    </div>
                </div>
                <!-- Discount Amount (if open discount) -->
                <div class="mb-4">
                    <InputCurrency v-model="formData.amount" :lb="$t('amount')" :placeholder="$t('enterAmount')"
                        :is-required="true" />
                </div>
                <!-- Taxes Include -->
                <div class="md:flex relative justify-between mb-4">
                    <div class="space-x-2">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="form-checkbox" v-model="formData.taxInclude" />
                            <span class="ml-2  text-md font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('Rates inclusive Tax.') }}
                            </span>
                        </label>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="md:flex relative justify-between mb-4">
                        <div class="space-x-2">
                            <label class="inline-flex items-center cursor-pointer ">
                                <input type="radio" class="form-checkbox" value="date" v-model="formData.applyOn" />
                                <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                                    {{ $t('Apply on selected dates') }}
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="md:flex relative justify-between mb-4">
                        <div class="space-x-2">
                            <label class="inline-flex items-center cursor-pointer ">
                                <input type="radio" class="form-checkbox" value="stay" v-model="formData.applyOn" />
                                <span class="ml-2 text-sm font-medium text-gray-700  dark:text-gray-400">
                                    {{ $t('Apply on whole stay') }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Transaction Selection (only for group reservations and selected_transaction) -->
                <div v-if="formData.applyOn === 'date'" class="mb-4">
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
                            :class="formData.transactionIds.includes(transaction.transactionId) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                            <input v-model="formData.transactionIds" type="checkbox" :value="transaction.transactionId"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <div class="ml-3 flex-1">
                                <div class="text-sm font-medium text-gray-900">
                                    {{transaction.description }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ formatDate(transaction.transactionDate) }} -
                                    {{ formatCurrency(transaction.amount) }}
                                </div>
                            </div>
                        </label>
                    </div>
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
                <BasicButton type="submit" variant="primary" @click="handleSubmit" :label="$t('save')"
                    :loading="loading" />
            </div>
        </template>
    </RightSideModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { getReservationDetailsById, updateReservationDetails } from '../../../services/reservation'
import { useServiceStore } from '../../../composables/serviceStore'
import { formatCurrency, safeParseInt } from '../../../utils/numericUtils'
import RightSideModal from '../../../components/modal/RightSideModal.vue'
import InputDatePicker from '../../../components/forms/FormElements/InputDatePicker.vue'
import InputCurrency from '../../../components/forms/FormElements/InputCurrency.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { getRateStayViewTypeByHotelId } from '../../../services/configrationApi'
import Select from '../../../components/forms/FormElements/Select.vue'
import { formatDate } from '../../../components/utilities/UtilitiesFunction'

interface Props {
    isOpen: boolean
    reservationId: number
    reservationNumber?: string
    roomCharges:any
}

interface Emits {
    (e: 'close'): void
    (e: 'save', data: any): void
}
const rateTypes = ref<any[]>([]);

const props = withDefaults(defineProps<Props>(), {
    isOpen: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const isLoading = ref(false)
const reservation = ref<any>()
const serviceStore = useServiceStore();
const loadingRates = ref(false);
const availableTransactions =ref<any[]>([])
const loadingTransactions = ref(false)
const formData = ref({
    rateType: 0,
    adults: 0,
    children: 0,
    isComplementary: false,
    amount: 0,
    taxInclude: false,
    applyOn: 'stay',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    transactionIds: [] as Number[]
})

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
    if (newValue && props.reservationId) {
        getReservationDetails()
    }
})

// Watch for reservationId changes
watch(() => props.reservationId, (newVal) => {
    if (newVal) {
        getReservationDetails()
    }
})

const fectRateTypes = async () => {
    loadingRates.value = true;
    const response = await getRateStayViewTypeByHotelId(serviceStore.serviceId!)
    console.log('rateTypeOptions', response.data?.data)

    rateTypes.value = response.data?.data?.map((item: any) => {
        return {
            label: item.rateTypeName,
            value: item.rateTypeId
        }
    })
    loadingRates.value = false;
    return response.data?.data || []
}
const getReservationDetails = async () => {
    if (!props.reservationId) return

    isLoading.value = true
    try {
        const response = await getReservationDetailsById(Number(props.reservationId))
        console.log('Reservation response:', response)
        reservation.value = response;
        const reservationRoom = response.reservationRooms[0];
        console.log('reservationRooms', reservationRoom)
        formData.value.amount = reservationRoom.roomRate;
        formData.value.rateType = reservationRoom.roomRates.rateTypeId;
        formData.value.adults = reservationRoom.adults;
        formData.value.children = reservationRoom.children;
        formData.value.isComplementary = reservationRoom.isComplementary;
        console.log('Reservation data fetched:', reservation.value)
    } catch (error) {
        console.error('Error fetching reservation details:', error)
        toast.error(t('errorFetchingReservationDetails'))
    } finally {
        isLoading.value = false
    }
}


const closeModal = () => {
    emit('close')
}


onMounted(() => {
    if (props.reservationId) {
        getReservationDetails()
    }
    fectRateTypes();
})

// Helpers
const roundToTwo = (num: number) => {
    return Number.isFinite(num) ? Math.round(num * 100) / 100 : 0
}

// Submit handler: call updateReservationDetails with requested payload shape
const handleSubmit = async () => {
    try {
        loading.value = true

        // Build payload following the requested schema
        const payload: any = {
            rateTypeId: safeParseInt(formData.value.rateType),
            adults: safeParseInt(formData.value.adults),
            children: safeParseInt(formData.value.children),
            isComplementary: formData.value.isComplementary,
            amount: roundToTwo(Number(formData.value.amount)),
            taxInclude: formData.value.taxInclude,
            applyOn: formData.value.applyOn === 'date' ? 'date' : 'stay',
        }


        // Optional date
        if (formData.value.date) {
            // Ensure ISO date (YYYY-MM-DD)
            const d = new Date(formData.value.date)
            const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().split('T')[0]
            payload.date = iso
        }

        // Optional notes
        if (formData.value.notes && String(formData.value.notes).trim().length > 0) {
            payload.notes = String(formData.value.notes).trim()
        }

        // Optional transactionIds
        if (Array.isArray(formData.value.transactionIds) && formData.value.transactionIds.length > 0) {
            payload.transactionIds = formData.value.transactionIds.map((id: any) => safeParseInt(id)).filter((n: number) => Number.isFinite(n) && n > 0)
        }
        console.log('payload',payload)
        const res = await updateReservationDetails(props.reservationId, payload)

        // Handle message and emit save
        if (res?.message) {
            toast.success(res.message)
        } else {
            toast.success(t('reservationUpdated'))
        }

        emit('save', res?.data ?? payload)
    } catch (error: any) {
        const msg = error?.message || error?.response?.data?.message || t('updateFailed')
        toast.error(msg)
        console.error('updateReservationDetails error:', error)
    } finally {
        loading.value = false
    }
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