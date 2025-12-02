<template>
    <!-- Apply Discount Room Charge Modal -->
    <!-- No Show Reservation Modal -->
    <RightSideModal :is-open="isOpen" :title="$t('updateDetails')" @close="closeModal">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('updateDetails') }}</h3>
        </template>
        <div>
            <!-- Loading Skeleton -->
            <div v-if="isLoading" class="space-y-4">
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div class="flex space-x-4 mb-4">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
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
                    <!-- Meal Plan Rate Include - Only show if selected rate type has meal plan -->
                    <div v-if="selectedRateHasMealPlan" class="space-x-2">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="form-checkbox" v-model="formData.mealPlanRateInclude" />
                            <span class="ml-2  text-md font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('Meal Plan Rate Include') }}
                            </span>
                        </label>
                    </div>
                </div>

                <!-- Meal Plan Details Warning (if meal plan unchecked but rate includes it) -->
                <div v-if="showMealPlanWarning" class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900 dark:border-amber-700">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-amber-500 dark:text-amber-300 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        <div class="flex-1">
                            <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                {{ $t('Meal Plan will be added ') }}
                            </h4>
                            <div v-if="currentMealPlan" class="text-sm text-amber-700 dark:text-amber-300">
                                <p class="font-medium mb-1">{{ currentMealPlan.name }}</p>
                                <div v-if="currentMealPlan.extraCharges && currentMealPlan.extraCharges.length > 0" class="space-y-1">
                                    <p class="text-xs font-semibold">{{ $t('Includes') }}:</p>
                                    <ul class="list-disc list-inside space-y-0.5 text-xs">
                                        <li v-for="charge in currentMealPlan.extraCharges" :key="charge.id">
                                            {{ charge.name }} - {{ formatCurrency(charge.rate) }}
                                        </li>
                                    </ul>
                                    <p class="font-semibold mt-2 pt-2 border-t border-amber-300 dark:border-amber-600">
                                        {{ $t('Total Meal Plan Cost') }}: {{ formatCurrency(mealPlanTotal) }}
                                    </p>
                                </div>
                            </div>
                        </div>
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
                    <div class="space-y-2 max-h-60 overflow-y-auto border rounded p-3 dark:border-gray-700 dark:bg-gray-800 custom-scrollbar">
                        <div v-if="loadingTransactions" class="text-center py-4">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto">
                            </div>
                            <span class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ $t('loadingTransactions') }}</span>
                        </div>
                        <label v-else v-for="transaction in availableTransactions" :key="transaction.transactionId"
                            class="flex items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            :class="formData.transactionIds.includes(transaction.transactionId) ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800'">
                            <input v-model="formData.transactionIds" type="checkbox" :value="transaction.transactionId"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <div class="ml-3 flex-1">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">
                                    {{transaction.description }}
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">
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
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                        :placeholder="$t('enterAdditionalNotes')"></textarea>
                </div>
            </form>
        </div>
        <template #footer>
            <div class="flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700">
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
import { getRatesByHotelIdAndRoomType } from '../../../services/configrationApi'
import Select from '../../../components/forms/FormElements/Select.vue'
import { formatDate } from '../../../components/utilities/UtilitiesFunction'
import router from '@/router'

interface Props {
    isOpen: boolean
    reservationId: number
    reservationNumber?: string
    roomCharges: any
}

interface Emits {
    (e: 'close'): void
    (e: 'save', data: any): void
}

const rateTypes = ref<any[]>([]);
const rateTypesData = ref<any[]>([]);

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
const availableTransactions = ref<any[]>([])
const loadingTransactions = ref(false)
const taxeAmount = ref(null)
const formData = ref({
    rateType: 0,
    adults: 0,
    children: 0,
    isComplementary: false,
    mealPlanRateInclude: false,
    amount: 0,
    taxInclude: false,
    applyOn: 'stay',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    transactionIds: [] as number[]
})

// Computed: Get selected rate type details
const selectedRateTypeData = computed(() => {
    const found = rateTypesData.value.find(rt => rt.rateTypeId === formData.value.rateType)
    console.log('Computed selectedRateTypeData:', found)
    return found
})

// Computed: Check if selected rate has meal plan
const selectedRateHasMealPlan = computed(() => {
    if (!selectedRateTypeData.value) {
        console.log('selectedRateHasMealPlan: false (no rate data)')
        return false
    }
    const hasMealPlan = selectedRateTypeData.value.mealPlanId !== null &&
                        selectedRateTypeData.value.mealPlanId !== undefined
    console.log('selectedRateHasMealPlan:', hasMealPlan, 'mealPlanId:', selectedRateTypeData.value.mealPlanId)
    return hasMealPlan
})

// Computed: Get current meal plan details
const currentMealPlan = computed(() => {
    if (!selectedRateTypeData.value || !selectedRateTypeData.value.mealPlan) {
        console.log('currentMealPlan: null')
        return null
    }
    console.log('currentMealPlan:', selectedRateTypeData.value.mealPlan)
    return selectedRateTypeData.value.mealPlan
})

const calculatedAmount = computed(() => {
    const selectedRate = rateTypesData.value.find(rt => rt.rateTypeId === formData.value.rateType)

    // Si pas de rate sélectionné, retourner l'amount actuel (pour éviter de réinitialiser à 0)
    if (!selectedRate) {
        return formData.value.amount || 0
    }

    let amount = Number(selectedRate.baseRate || 0)
    console.log('Base Rate:', amount)

    // Add meal plan if NOT included
    if (selectedRate.mealPlanId && !formData.value.mealPlanRateInclude) {
        const mealPlanCost = mealPlanTotal.value
        amount += mealPlanCost
        console.log('Adding Meal Plan (not included):', mealPlanCost, 'New Amount:', amount)
    }

    // Add tax if NOT included
    if (!formData.value.taxInclude) {
        // Calculate tax based on current amount
        const taxRate = Number(taxeAmount.value ) || 1
        // const taxAmount = amount * taxRate
        amount += taxRate
        console.log('Adding Tax (not included):', taxRate, 'New Amount:', amount)
    }

    return roundToTwo(amount)
})

// Computed: Calculate meal plan total
const mealPlanTotal = computed(() => {
    if (!currentMealPlan.value || !currentMealPlan.value.extraCharges) {
        console.log('mealPlanTotal: 0 (no charges)')
        return 0
    }

    const total = currentMealPlan.value.extraCharges.reduce((total: number, charge: any) => {
        return total + Number(charge.rate || 0)
    }, 0)

    console.log('mealPlanTotal:', total, 'from charges:', currentMealPlan.value.extraCharges)
    return total
})

// Computed: Show meal plan warning
const showMealPlanWarning = computed(() => {
    const show = selectedRateHasMealPlan.value && !formData.value.mealPlanRateInclude
    console.log('showMealPlanWarning:', show)
    return show
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



// Watch for rate type changes
watch(() => formData.value.rateType, (newRateTypeId) => {
    console.log('Rate Type Changed to:', newRateTypeId)
    console.log('Available Rate Types:', rateTypesData.value)

    const selectedRate = rateTypesData.value.find(rt => rt.rateTypeId === newRateTypeId)
    console.log('Selected Rate Full Data:', selectedRate)

    if (selectedRate) {
        // Update tax include based on rate settings
        formData.value.taxInclude = selectedRate.taxInclude || false
        console.log('Tax Include:', formData.value.taxInclude)

        // Auto-check meal plan if rate includes it
        if (selectedRate.mealPlanId) {
            formData.value.mealPlanRateInclude = selectedRate.mealPlanRateInclude || false
            console.log('Meal Plan ID:', selectedRate.mealPlanId, 'Include:', formData.value.mealPlanRateInclude)
            console.log('Meal Plan Details:', selectedRate.mealPlan)
        } else {
            formData.value.mealPlanRateInclude = false
            console.log('No Meal Plan for this rate')
        }

        // Update amount with calculated value
        formData.value.amount = calculatedAmount.value
        console.log('Updated Amount:', formData.value.amount)
    } else {
        console.warn('No rate found for ID:', newRateTypeId)
    }
})

// Watch for tax include changes
watch(() => formData.value.taxInclude, () => {
    formData.value.amount = calculatedAmount.value
    console.log('Tax Include Changed - Updated Amount:', formData.value.amount)
})

// Watch for meal plan include changes
watch(() => formData.value.mealPlanRateInclude, () => {
    formData.value.amount = calculatedAmount.value
    console.log('Meal Plan Include Changed - Updated Amount:', formData.value.amount)
})

const getReservationDetails = async () => {
  if (!props.reservationId) return;

  isLoading.value = true;
  try {
    console.log(' getReservationDetails() → fetching reservation', props.reservationId);

    const response = await getReservationDetailsById(Number(props.reservationId));
    reservation.value = response;

    const reservationRoom = response?.reservationRooms?.[0];
    if (!reservationRoom) {
      console.warn(' Aucun room trouvé dans reservationRooms');
      toast.warning(t('noRoomFoundInReservation'));
      return;
    }

    // Remplissage du formulaire
    formData.value.amount = calculatedAmount.value || reservationRoom.roomRate
    formData.value.rateType = reservationRoom.rateTypeId || 0;
    formData.value.adults = reservationRoom.adults;
    formData.value.children = reservationRoom.children;
    formData.value.isComplementary = reservationRoom.isComplementary;
    formData.value.taxInclude = reservationRoom.taxIncludes;
    formData.value.mealPlanRateInclude = reservationRoom.mealPlanRateInclude;
    taxeAmount.value = reservationRoom.taxAmount

    console.log(' Reservation data fetched:', reservation.value);

    //  Maintenant qu'on a le roomTypeId, on peut appeler fectRateTypes
    const roomTypeId = reservationRoom.roomTypeId;
    if (roomTypeId) {
      console.log(' Chargement des rate types pour roomTypeId:', roomTypeId);
      await fectRateTypes(roomTypeId);
    } else {
      console.warn(' roomTypeId introuvable dans reservationRoom');
    }

  } catch (error) {
    console.error(' Erreur lors du chargement des détails de réservation:', error);
    toast.error(t('errorFetchingReservationDetails'));
  } finally {
    isLoading.value = false;
  }
};


const fectRateTypes = async (roomTypeId?: number) => {
  loadingRates.value = true;
  try {
    if (!roomTypeId) {
      console.error(' roomTypeId manquant');
      toast.error(t('errorFetchingRateTypes'));
      return;
    }

    const response = await getRatesByHotelIdAndRoomType(roomTypeId);
    rateTypesData.value = response.data?.data || [];

    console.log(' Rate types chargés:', rateTypesData.value);

    rateTypes.value = rateTypesData.value.map((item: any) => ({
      label: item.rateTypeName,
      value: item.rateTypeId
    }));
  } catch (error) {
    console.error(' Erreur fetching rate types:', error);
    toast.error(t('errorFetchingRateTypes'));
  } finally {
    loadingRates.value = false;
  }
};

const closeModal = () => {
    emit('close')
}

onMounted(async () => {
  try {
    if (props.reservationId) {
      await getReservationDetails();
    } else {
      console.warn(' Aucun reservationId fourni');
    }
  } catch (err) {
    console.error(' Erreur dans onMounted:', err);
  }
});

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
            mealPlanRateInclude: formData.value.mealPlanRateInclude,
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

        console.log('payload', payload)
        const res = await updateReservationDetails(props.reservationId, payload)

        // Handle message and emit save
        if (res?.message) {
            toast.success(res.message)
        } else {
            toast.success(t('reservationUpdated'))
        }

        emit('save', res?.data ?? payload)
        // router.go(0)
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
