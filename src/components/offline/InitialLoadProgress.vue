<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[999999999999999999] flex items-start justify-center pt-[15vh] bg-black/30 backdrop-blur-sm"
      @click.self="dismiss"
    >
      <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <!-- Header avec bouton fermer -->
        <div class="mb-4 flex items-start justify-between">
          <div class="flex items-center gap-3">
            <svg class="h-8 w-8 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Préparation mode hors-ligne
            </h3>
          </div>
          <button
            v-if="offlineStore.initialLoadProgress > 0"
            @click="dismiss"
            class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
            title="Continuer en arrière-plan"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
          {{ dismissible
            ? 'Les données se chargent en arrière-plan. Vous pouvez continuer à utiliser l\'application.'
            : 'Synchronisation des réservations, clients et données de l\'hôtel pour le mode hors-ligne...'
          }}
        </p>

        <!-- Barre de progression -->
        <div class="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            :style="{ width: offlineStore.initialLoadProgress + '%' }"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>{{ offlineStore.initialLoadProgress }}%</span>
            <span v-if="offlineStore.initialLoadProgress < 100" class="text-gray-400">
              {{ dismissible ? '— synchro en cours' : 'Veuillez patienter...' }}
            </span>
            <span v-else class="text-green-500">Terminé ✓</span>
          </div>

          <button
            v-if="dismissible && offlineStore.initialLoadProgress < 100"
            @click="dismiss"
            class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Continuer en arrière-plan →
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOfflineStore } from '@/services/offline/offlineStore'

const offlineStore = useOfflineStore()

// Permet à l'utilisateur de fermer la modale après le début du chargement
const dismissible = ref(false)

// Rendre dismissible après 1 seconde (laisse le temps d'afficher la progression)
setTimeout(() => {
  dismissible.value = true
}, 1000)

const visible = computed(() => offlineStore.isInitialLoading)

function dismiss() {
  if (!dismissible.value) return
  offlineStore.setInitialLoading(false)
}
</script>

<style scoped>
@reference "tailwindcss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
