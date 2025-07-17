<!-- CancellationPolicyConfig.vue -->
<template>
    <div class="mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header of the component -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white text-center rounded-t-xl">
            <h1 class="text-3xl font-bold mb-2">{{ $t('cancellationPolicy.headerTitle') }}</h1>
            <p class="text-lg">{{ $t('cancellationPolicy.headerSubtitle') }}</p>
        </div>
        <div class=" mx-6 p-6 mt-6 bg-yellow-600" v-if="!isConfigure">
            {{ $t('cancellationNotSet') }}
        </div>
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <!-- Section: Free Cancellation Period -->
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 class="flex items-center text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    <CalendarOffIcon class="mr-2 text-purple-600" :size="20" /> {{
                        $t('cancellationPolicy.freeCancellationPeriod.title') }}
                </h2>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                    <label for="freeCancellationPeriodValue" class="block text-gray-700 font-medium">{{
                        $t('cancellationPolicy.freeCancellationPeriod.label') }}</label>
                    <input type="number" id="freeCancellationPeriodValue" name="freeCancellationPeriodValue"
                        v-model.number="policy.freeCancellationPeriodValue" min="0"
                        class="shadow appearance-none border rounded w-full sm:w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                        required />
                    <select id="freeCancellationPeriodUnit" name="freeCancellationPeriodUnit"
                        v-model="policy.freeCancellationPeriodUnit"
                        class="shadow border rounded w-full sm:w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                        required>
                        <option value="hours">{{ $t('cancellationPolicy.freeCancellationPeriod.unitHours') }}</option>
                        <option value="days">{{ $t('cancellationPolicy.freeCancellationPeriod.unitDays') }}</option>
                    </select>
                    <span class="text-gray-700">{{ $t('cancellationPolicy.freeCancellationPeriod.beforeArrival')
                    }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-2 flex items-center">
                    <InfoIcon :size="16" class="mr-1" /> {{ $t('cancellationPolicy.freeCancellationPeriod.info') }}
                </p>
            </div>

            <!-- Section: Cancellation Fees -->
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 class="flex items-center text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    <DollarSignIcon class="mr-2 text-purple-600" :size="20" /> {{
                        $t('cancellationPolicy.cancellationFees.title') }}
                </h2>
                <div class="mb-4">
                    <label for="cancellationFeeType" class="block text-gray-700 font-medium mb-2">{{
                        $t('cancellationPolicy.cancellationFees.typeLabel') }}</label>
                    <select id="cancellationFeeType" name="cancellationFeeType" v-model="policy.cancellationFeeType"
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                        required>
                        <option value="none">{{ $t('cancellationPolicy.cancellationFees.typeNone') }}</option>
                        <option value="fixed">{{ $t('cancellationPolicy.cancellationFees.typeFixed') }}</option>
                        <option value="percentage">{{ $t('cancellationPolicy.cancellationFees.typePercentage') }}
                        </option>
                        <option value="first_night">{{ $t('cancellationPolicy.cancellationFees.typeFirstNight') }}
                        </option>
                    </select>
                </div>

                <div v-if="policy.cancellationFeeType === 'fixed'">
                    <label for="cancellationFeeValue" class="block text-gray-700 font-medium mb-2">{{
                        $t('cancellationPolicy.cancellationFees.fixedAmountLabel') }} (XAF) :</label>
                    <input type="number" id="cancellationFeeValue" name="cancellationFeeValue"
                        v-model.number="policy.cancellationFeeValue" min="0" step="0.01"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                        required />
                </div>

                <div v-if="policy.cancellationFeeType === 'percentage'">
                    <label for="cancellationFeeValue" class="block text-gray-700 font-medium mb-2">{{
                        $t('cancellationPolicy.cancellationFees.percentageAmountLabel') }} (%) :</label>
                    <input type="number" id="cancellationFeeValue" name="cancellationFeeValue"
                        v-model.number="policy.cancellationFeeValue" min="0" max="100" step="1"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                        required />
                </div>

                <p v-if="policy.cancellationFeeType === 'first_night'" class="text-gray-700 flex items-center">
                    <InfoIcon :size="16" class="mr-1" /> {{ $t('cancellationPolicy.cancellationFees.firstNightInfo') }}
                </p>
            </div>

            <!-- Section: Non-Refundable Rates -->
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 class="flex items-center text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    <PercentIcon class="mr-2 text-purple-600" :size="20" /> {{
                        $t('cancellationPolicy.nonRefundableRates.title') }}
                </h2>
                <label for="nonRefundableRateEnabled" class="flex items-center cursor-pointer">
                    <input type="checkbox" id="nonRefundableRateEnabled" name="nonRefundableRateEnabled"
                        v-model="policy.nonRefundableRateEnabled"
                        class="form-checkbox h-5 w-5 text-purple-600 rounded" />
                    <span class="ml-2 text-gray-700 font-medium">{{
                        $t('cancellationPolicy.nonRefundableRates.enableLabel') }}</span>
                </label>
                <p class="text-sm text-gray-500 mt-2 flex items-center">
                    <InfoIcon :size="16" class="mr-1" /> {{ $t('cancellationPolicy.nonRefundableRates.info') }}
                </p>
            </div>

            <!-- Section: Special Conditions -->
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 class="flex items-center text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    <InfoIcon class="mr-2 text-purple-600" :size="20" /> {{
                        $t('cancellationPolicy.specialConditions.title') }}
                </h2>
                <label for="specialConditionsNotes" class="block text-gray-700 font-medium mb-2">{{
                    $t('cancellationPolicy.specialConditions.notesLabel') }} :</label>
                <textarea id="specialConditionsNotes" name="specialConditionsNotes"
                    v-model="policy.specialConditionsNotes" rows="4"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                    :placeholder="$t('cancellationPolicy.specialConditions.notesPlaceholder')"></textarea>
                <p class="text-sm text-gray-500 mt-2">{{ $t('cancellationPolicy.specialConditions.notesInfo') }}</p>
            </div>

            <!-- Save Button -->
            <button type="submit"
                class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                <SaveIcon class="mr-2" :size="20" /><span v-if="!!policy.policyId"> {{
                    $t('cancellationPolicy.updateButton') }}</span>
                <span v-else> {{ $t('cancellationPolicy.saveButton') }}</span>
            </button>

            <div v-if="isSaved"
                class="mt-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center justify-center">
                <CheckCircleIcon class="mr-2" :size="20" /> {{ $t('cancellationPolicy.savedMessage') }}
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
    CalendarOff as CalendarOffIcon, DollarSign as DollarSignIcon, Percent as PercentIcon,
    Info as InfoIcon, Save as SaveIcon, CheckCircle as CheckCircleIcon
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n'; // Import useI18n for accessing translation function
import { getCancellationPolicyByHotelId, updateCancellationPolicy } from '@/services/api';
import { useServiceStore } from '@/composables/serviceStore';
import { isLoading } from '@/composables/spinner';
import { insertCancellationPolicy } from '../../services/api';
import { type CancellationPolicy } from "@/utils/models"
import { useToast } from 'vue-toastification'

const toast = useToast()
const serviceStore = useServiceStore();

// Access i18n instance
const { t } = useI18n();

// Initial state of cancellation policy parameters
// In a production environment, these values would be loaded from a database
const policy = ref<CancellationPolicy>({
    freeCancellationPeriodValue: 24,
    freeCancellationPeriodUnit: 'hours',
    cancellationFeeType: 'first_night',
    cancellationFeeValue: 0,
    nonRefundableRateEnabled: true,
    specialConditionsNotes: t('cancellationPolicy.specialConditions.notesPlaceholderDefault'), // Use i18n for default value
    policyName: 'Cancellation policy'
});

const isSaved = ref(false);
const isConfigure = ref(false);
// Handle form submission
const handleSubmit = async () => {
    isLoading.value = true;
    try {
        policy.value.serviceId = serviceStore.serviceId!;
        let res;
        if (policy.value.policyId) {
            res = await insertCancellationPolicy(policy.value);
        } else {
            res = await updateCancellationPolicy(policy.value.policyId!, policy.value);
        }
        console.log("res", res)
        if (res.status === 200 || res.status === 201   ) {
            toast.success(t('cancellationPolicy.savedMessage'))
        } else {
            toast.error(t('anErrorOccur'))
        }

    } catch (error) {
        console.error(error);
        toast.error(t('anErrorOccur'))
    } finally {
        isLoading.value = false;
    }
};

const getPolicy = async () => {
    isLoading.value = true;
    try {
        const response = await getCancellationPolicyByHotelId(serviceStore.serviceId);
        if (response.status === 200) {
            console.log("response.data", response.data)
            if (response.data.length > 0) {
                policy.value = { ...response.data[0] };
                isConfigure.value = true;
            } else {
                isConfigure.value = false;
            }
            console.log(response.data)

        } else {
            toast.error(t('cancellationPolicy.errorMessage'))
        }

    } catch (error) {
        toast.error(t('anErrorOccur'))
        console.log('error', error)
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    getPolicy();
})
</script>

<style>
/* Tailwind CSS is typically configured via PostCSS in a Vue project.
   The CDN link would be in your public/index.html or similar. */
.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>
