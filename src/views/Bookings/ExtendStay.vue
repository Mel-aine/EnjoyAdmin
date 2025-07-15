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
                <button @click="confirmExtension"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors">
                    {{ $t('confirm_extension_button') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import flatPickr from 'vue-flatpickr-component'

import 'flatpickr/dist/flatpickr.css'
import CalendarIcon from '@/icons/CalendarIcon.vue';

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits(['close'])
// Initialisation de vue-i18n
const { t } = useI18n();
const flatpickrConfig = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    wrap: true,
}
// État pour contrôler la visibilité de la modale
// État pour stocker la nouvelle date de départ
const newDepartureDate = ref('');
// État pour afficher les messages de statut
const statusMessage = ref('');
// État pour déterminer si le message de statut est une erreur
const isError = ref(false);

// Fonction pour fermer la modale
const closeModal = () => {
    newDepartureDate.value = ''; // Réinitialiser la date
    statusMessage.value = ''; // Réinitialiser le message de statut à la fermeture
    isError.value = false;
    emit('close');
};

// Fonction pour confirmer la prolongation et simuler les scénarios
const confirmExtension = () => {
    if (!newDepartureDate.value) {
        statusMessage.value = t('new_departure_date_label'); // Utiliser le message existant pour la validation simple
        isError.value = true;
        return;
    }

    // Simuler les scénarios de disponibilité
    // Dans une vraie application, cette logique viendrait du backend via un appel API
    const scenario = Math.floor(Math.random() * 3); // 0, 1 ou 2

    switch (scenario) {
        case 0: // Cas 1: Chambre actuelle occupée, hôtel complet
            statusMessage.value = t('room_occupied_no_other_available');
            isError.value = true;
            console.log(t('room_occupied_no_other_available'));
            break;
        case 1: // Cas 2: Chambre actuelle occupée, autres chambres disponibles
            statusMessage.value = t('room_occupied_other_available');
            isError.value = false; // Ce n'est pas une erreur bloquante, mais une information
            console.log(t('room_occupied_other_available'));
            // Ici, vous pourriez envisager de demander à l'utilisateur de confirmer le changement de chambre
            // ou de rediriger vers une page de sélection de chambre.
            break;
        case 2: // Cas 3: Chambre disponible (ou prolongation simple)
            statusMessage.value = t('extension_successful');
            isError.value = false;
            console.log(t('extension_successful') + ` Nouvelle date: ${newDepartureDate.value}`);
            // Dans une vraie application, vous enverriez la demande au backend ici
            // axios.post('/api/extend-stay', { reservationId: 'XYZ123', newDate: newDepartureDate.value })
            //   .then(response => {
            //     statusMessage.value = t('extension_successful');
            //     isError.value = false;
            //     // closeModal(); // Fermer la modale après succès et notification
            //   })
            //   .catch(error => {
            //     statusMessage.value = 'Erreur lors de l\'envoi de la demande.'; // Ou un message d'erreur traduit
            //     isError.value = true;
            //     console.error('Erreur lors de l\'envoi de la prolongation :', error);
            //   });
            break;
    }
};

</script>

<style scoped>
/* Aucun style spécifique supplémentaire n'est nécessaire ici car Tailwind CSS est utilisé */
</style>
