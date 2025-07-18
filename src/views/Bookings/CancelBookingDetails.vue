<template>
    <!-- Modale d'annulation -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/25 bg-opacity-50">
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('confirm_cancellation_title')
                }}</h3>
                <button @click="closeModal"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <div class="mb-6">
                <p class="text-gray-700 dark:text-gray-300">
                    {{ $t('cancellation_confirmation_message') }}
                </p>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {{ $t('cancellation_admin_note') }}
                </p>
            </div>
            <div class="mb-6 bg-amber-600 p-4" v-if="responseWrapper.summaryMessage">
                <p class="text-white dark:text-gray-300">
                    {{ $t(responseWrapper.policyName) }}
                </p>
                <p class="mt-2 text-sm text-white dark:text-gray-400">
                    {{ responseWrapper.summaryMessage }}
                </p>
            </div>

            <div class="flex justify-end space-x-3">
                <button @click="closeModal"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                    {{ $t('cancel_button') }}
                </button>
                <button @click="confirmCancellation" :disabled="isLoading"
                    class="px-4 py-2 bg-red-600 disabled:bg-gray-400 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors">
                    {{ $t('confirm_button') }}
                    <DotSpinner v-if="isLoading" class="ml-2" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DotSpinner from '@/components/spinner/DotSpinner.vue';
import { cancelReservation, getCancellationSummary } from '@/services/api';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification'

const toast = useToast()
const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
    reservation: {
        type: Object,
        required: true,
    },
})
const emit = defineEmits(['close', 'cancelReservation'])
// Initialisation de vue-i18n
const { t } = useI18n();
const isLoading = ref(false);
// Fonction pour fermer la modale
const closeModal = () => {
    emit('close');
};

const responseWrapper = ref({
    cancellationFee: "",
    deadline: "",
    isFreeCancellationPossible: false,
    policyName: "",
    summaryMessage: ''
}

);

// Fonction pour basculer entre les langues
const getLocalSummary = async () => {
    isLoading.value = true;
    try {
        const response = await getCancellationSummary(props.reservation.id);
        if (response.status === 200) {
            console.log("response.data", response.data)
            responseWrapper.value = response.data;

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
const confirmCancellation = async () => {
    isLoading.value = true;
    try {
        const datas = {
            'reason': "Fammilly"
        }
        const res = await cancelReservation(props.reservation.id, datas);
        console.log("res", res)
        emit('cancelReservation')
        if (res.status === 200 || res.status === 201) {
            toast.success(t('cancellation_sent_message'))
        } else {
            toast.error(t('anErrorOccur'))
        }

    } catch (error) {
        console.error(error);
        toast.error(t('anErrorOccur'))
    } finally {
        isLoading.value = false;
    }
}
onMounted(() => {
    getLocalSummary()
})
</script>

<style scoped>
/* Aucun style spécifique supplémentaire n'est nécessaire ici car Tailwind CSS est utilisé */
</style>
