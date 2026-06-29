<template>
  <Transition name="fade">
    <div
      v-if="offlineStore.isInitialLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <!-- Icone sync animée -->
        <div class="mb-6 flex justify-center">
          <svg class="h-12 w-12 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <h3 class="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
          Chargement initial des données
        </h3>
        <p class="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Synchronisation des réservations, clients et données de l'hôtel pour le mode hors-ligne...
        </p>

        <!-- Barre de progression -->
        <div class="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            :style="{ width: offlineStore.initialLoadProgress + '%' }"
          />
        </div>

        <div class="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{{ offlineStore.initialLoadProgress }}%</span>
          <span v-if="offlineStore.initialLoadProgress < 100">Veuillez patienter...</span>
          <span v-else class="text-green-500">Terminé</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useOfflineStore } from '@/services/offline/offlineStore'

const offlineStore = useOfflineStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
