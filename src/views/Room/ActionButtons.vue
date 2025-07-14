<template>
  <div class="flex items-center space-x-2">
    <!-- Check-in Button -->
    <button
      v-if="canCheckIn"
      @click="$emit('checkin')"
      :disabled="isCheckingIn"
      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <svg v-if="isCheckingIn" class="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg v-else class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      Check-in
    </button>

    <!-- Check-out Button -->
    <button
      v-if="canCheckOut"
      @click="$emit('checkout')"
      :disabled="isCheckingOut"
      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <svg v-if="isCheckingOut" class="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg v-else class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Check-out
    </button>

    <!-- Mark as Cleaned Button -->
    <button
      v-if="room.status === 'cleaning'"
      @click="$emit('cleaned')"
      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Nettoyé
    </button>

    <!-- Room Details Button -->
    <button
      @click="showDetails = !showDetails"
      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Détails
    </button>
  </div>

  <!-- Details Modal -->
  <div v-if="showDetails" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Détails de la chambre
          </h3>
          <button
            @click="showDetails = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Chambre:</span>
            <span class="text-sm text-gray-900">{{ room.productName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Type:</span>
            <span class="text-sm text-gray-900">{{ room.productTypeName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Statut:</span>
            <span class="text-sm text-gray-900">{{ room.status }}</span>
          </div>
          <div v-if="room.guestName" class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Client:</span>
            <span class="text-sm text-gray-900">{{ room.guestName }}</span>
          </div>
          <div v-if="room.nextAvailable" class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Prochaine disponibilité:</span>
            <span class="text-sm text-gray-900">{{ formatDate(room.nextAvailable) }}</span>
          </div>
          <div v-if="room.checkInTime" class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Check-in:</span>
            <span class="text-sm text-gray-900">{{ formatDateTime(room.checkInTime) }}</span>
          </div>
          <div v-if="room.checkOutTime" class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Check-out:</span>
            <span class="text-sm text-gray-900">{{ formatDateTime(room.checkOutTime) }}</span>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="showDetails = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {{ $t('close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  room: any;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
}

interface Emits {
  (e: 'checkin'): void;
  (e: 'checkout'): void;
  (e: 'cleaned'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showDetails = ref(false);

const canCheckIn = computed(() => {
  return props.room.reservations?.some((res: any) => res.reservation.status === 'confirmed');
});

const canCheckOut = computed(() => {
  return props.room.reservations?.some((res: any) => res.reservation.status === 'checked-in');
});

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR');
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
