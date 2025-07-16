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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
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

                <div class="flex justify-end space-x-3">
                    <button @click="closeModal"
                        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {{ $t('cancel_button') }}
                    </button>
                    <button @click="confirmCancellation"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors">
                        {{ $t('confirm_button') }}
                    </button>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits(['close'])
// Initialisation de vue-i18n
const { t } = useI18n();

// Fonction pour fermer la modale
const closeModal = () => {
    emit('close');
};

// Fonction pour confirmer l'annulation et "rediriger" vers l'administrateur
const confirmCancellation = () => {


    console.log(t('cancellation_sent_message'));
    // Fermer la modale après la "redirection"
    closeModal();
};

// Fonction pour basculer entre les langues

</script>

<style scoped>
/* Aucun style spécifique supplémentaire n'est nécessaire ici car Tailwind CSS est utilisé */
</style>
