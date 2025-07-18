<template>
    <!-- Modale de prolongation de séjour -->
    <div v-if="showModal" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/25 bg-opacity-50">
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('extend_stay_title') }}</h3>
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
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    {{ $t('extend_stay_message') }}
                </p>

                <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        {{ $t('new_departure_date_label') }}
                    </label>
                    <div class="relative">
                        <flat-pickr v-model="newDepartureDate" :config="flatpickrConfig"
                            class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-300 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :placeholder="$t('Selectdate')" />
                        <span
                            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <CalendarIcon />
                        </span>
                    </div>
                </div>

                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {{ $t('extend_stay_admin_note') }}
                </p>

                <!-- Message de statut / erreur -->
                <p v-if="statusMessage"
                    :class="['mt-4 text-sm font-medium', { 'text-red-600': isError, 'text-green-600': !isError }]">
                    {{ statusMessage }}
                </p>
            </div>

            <div class="flex justify-end space-x-3">
                <button @click="closeModal"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                    {{ $t('cancel_button') }}

                </button>
                <button @click="checkExtendStayLocal" v-if="!canExtendStay"
                    class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors">
                    {{ $t('checkExtendStayBtn') }}
                    <DotSpinner v-if="isLoading" />
                </button>
                <button @click="confirmExtendStayLocal" v-if="canExtendStay"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors">
                    {{ $t('confirm_extension_button') }}
                    <DotSpinner v-if="isLoading" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import flatPickr from 'vue-flatpickr-component'

import 'flatpickr/dist/flatpickr.css'
import CalendarIcon from '@/icons/CalendarIcon.vue';
import { checkExtendStay, confirmExtendStay } from '@/services/api';
import DotSpinner from '@/components/spinner/DotSpinner.vue';
import type { ReservationDetails } from '@/utils/models';

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
    reservation: {
        type: Object as PropType<ReservationDetails>,
        required: true,
    }
})
const emit = defineEmits(['close','extendStay'])
// Initialisation de vue-i18n
const { t } = useI18n();
const flatpickrConfig = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    wrap: true,
    minDate: "today",
}
const isLoading = ref(false)
const newDepartureDate = ref('');
const statusMessage = ref('');
const isError = ref(false);
const canExtendStay = ref(false);

const closeModal = () => {
    newDepartureDate.value = '';
    statusMessage.value = '';
    isError.value = false;
    emit('close');
};

const checkExtendStayLocal = async () => {
    isLoading.value = true;
    try {
        const response = await checkExtendStay(props.reservation.id, { new_depart_date: newDepartureDate.value })
        console.log('response', response.data);

        const scenario = response.data.scenario; // 0, 1 ou 2
        const ms = response.data.messages;

        switch (scenario) {
            case -1: // Cas -1: Chambre actuelle non disponible
                isError.value = true;
                statusMessage.value = ms
                canExtendStay.value = false;
                break;
            case 0: // Cas 1: Chambre actuelle occupée, hôtel complet
                statusMessage.value = t('room_occupied_no_other_available');
                isError.value = true;
                canExtendStay.value = false;
                break;
            case 1: // Cas 2: Chambre actuelle occupée, autres chambres disponibles
                statusMessage.value = t('room_occupied_other_available');
                isError.value = false; // Ce n'est pas une erreur bloquante, mais une information
                canExtendStay.value = false;
                break;
            case 2: // Cas 3: Chambre disponible (ou prolongation simple)
                statusMessage.value = t('extension_successful');
                isError.value = false;
                canExtendStay.value = true;
                break;
        }
    } catch (error) {
        console.log('error', error);
    } finally {
        isLoading.value = false;
    }
}

const confirmExtendStayLocal = async () => {
    isLoading.value = true;
    try {
        const response = await confirmExtendStay(props.reservation.id, { new_depart_date: newDepartureDate.value })
        console.log('response', response.data);
        emit('extendStay')
    } catch (error) {
        console.log('error', error);
    } finally {
        isLoading.value = false;
    }

}
onMounted(()=>{
    console.log(props.reservation)
    newDepartureDate.value = new Date(props.reservation.departDate).toISOString().split('T')[0];
})
</script>

<style scoped>
/* Aucun style spécifique supplémentaire n'est nécessaire ici car Tailwind CSS est utilisé */
</style>
