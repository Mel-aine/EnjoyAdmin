<template>
  <div class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full bg-black/25 bg-opacity-50 flex items-center justify-center modal z-99999 ">
    <div class="relative top-5 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Changer le statut de la chambre
          </h3>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">
            Chambre: <span class="font-medium">{{ room?.productName }}</span>
          </p>
          <p class="text-sm text-gray-600 mb-4">
            Statut actuel: <span class="font-medium">{{ statusLabels[currentStatus] || currentStatus }}</span>
          </p>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Nouveau statut:
          </label>
          <div class="space-y-2">
            <label
              v-for="(label, statusKey) in statusLabels"
              :key="statusKey"
              class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              :class="{
                'border-blue-500 bg-blue-50': selectedStatus === statusKey,
                'border-gray-300': selectedStatus !== statusKey
              }"
            >
              <input
                v-model="selectedStatus"
                :value="statusKey"
                type="radio"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span class="ml-3 flex items-center">
                <span class="mr-2 flex-shrink-0">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" :class="statusColors[statusKey]" />
                  </svg>
                </span>
                <span class="text-sm font-medium text-gray-900">{{ label }}</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Conditional warnings -->
        <div
          v-if="selectedStatus === 'maintenance'"
          class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md"
        >
          <div class="flex">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-yellow-800">Attention</p>
              <p class="text-sm text-yellow-700">
                La chambre ne sera plus disponible pour les réservations pendant la maintenance.
              </p>
            </div>
          </div>
        </div>

        <!-- <div
          v-if="selectedStatus === 'occupied'"
          class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
        >
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800">Vérification requise</p>
              <p class="text-sm text-red-700">
                Assurez-vous qu'un client occupe effectivement cette chambre.
              </p>
            </div>
          </div>
        </div> -->

        <div
          v-if="selectedStatus === 'dirty'"
          class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md"
        >
          <div class="flex">
            <svg class="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-orange-800">Nettoyage requis</p>
              <p class="text-sm text-orange-700">
                La chambre devra être nettoyée avant d'être disponible.
              </p>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            @click="updateStatus"
            :disabled="!selectedStatus || selectedStatus === currentStatus || isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mise à jour...
            </span>
            <span v-else>
              Confirmer
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

interface Room {
  id: number | string;
  productName: string;
}

const props = defineProps<{
  room: Room;
  currentStatus: string;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updateStatus', payload: { roomId: number | string; newStatus: string }): void;
}>();

const selectedStatus = ref(props.currentStatus);

const statusLabels: Record<string, string> = {
  available: 'Disponible',
  dirty: 'À nettoyer',
  out_of_order: 'Hors service'
};

const statusColors: Record<string, string> = {
  available: 'text-green-500',
  dirty: 'text-orange-500',
  out_of_order: 'text-gray-500'
};

watch(
  () => props.currentStatus,
  (newVal) => {
    selectedStatus.value = newVal;
  }
);

function updateStatus() {
  if (selectedStatus.value && selectedStatus.value !== props.currentStatus) {
    emit('updateStatus', {
      roomId: props.room.id,
      newStatus: selectedStatus.value
    });
  }
}
</script>
