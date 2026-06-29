<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
    <div class="w-full max-w-md text-center">
      <!-- Icone hors ligne animée -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <svg
            class="h-24 w-24 text-gray-300 dark:text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          <span class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
            !
          </span>
        </div>
      </div>

      <!-- Titre -->
      <h1 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
        Vous êtes hors ligne
      </h1>

      <!-- Description -->
      <p class="mb-2 text-gray-600 dark:text-gray-300">
        La connexion Internet a été perdue. Vous pouvez continuer à utiliser
        l'application avec les données déjà chargées.
      </p>
      <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Les modifications que vous apportez seront synchronisées automatiquement
        lorsque la connexion sera rétablie.
      </p>

      <!-- Statut -->
      <div class="mb-8 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Statut</span>
          <span class="flex items-center gap-2 font-medium text-red-600 dark:text-red-400">
            <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Hors ligne
          </span>
        </div>
        <div class="mt-3 flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Opérations en attente</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ pendingCount }}</span>
        </div>
        <div class="mt-3 flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Dernière synchronisation</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ lastSyncLabel }}</span>
        </div>
      </div>

      <!-- Bouton de reconnexion -->
      <button
        @click="retryConnection"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95"
        :disabled="checking"
      >
        <svg
          :class="{ 'animate-spin': checking }"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
        {{ checking ? 'Vérification...' : 'Vérifier la connexion' }}
      </button>

      <!-- Message d'erreur -->
      <p v-if="errorMessage" class="mt-4 text-sm text-red-500">
        {{ errorMessage }}
      </p>

      <!-- Lien vers le dashboard -->
      <p class="mt-6 text-sm text-gray-400 dark:text-gray-500">
        <router-link to="/reports/dashboard" class="underline hover:text-gray-600 dark:hover:text-gray-300">
          Retourner au tableau de bord
        </router-link>
      </p>
    </div>

    <!-- Bannière de connexion rétablie -->
    <Transition name="fade">
      <div
        v-if="showReconnected"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-green-600 px-6 py-3 text-white shadow-xl"
      >
        <div class="flex items-center gap-3">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span class="font-medium">Connexion rétablie ! Redirection...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOfflineStore } from '@/services/offline/offlineStore'

const router = useRouter()
const offlineStore = useOfflineStore()
const checking = ref(false)
const errorMessage = ref('')
const showReconnected = ref(false)

const pendingCount = computed(() => offlineStore.pendingCount)

const lastSyncLabel = computed(() => {
  if (!offlineStore.lastSyncAt) return 'Jamais'
  try {
    const date = new Date(offlineStore.lastSyncAt)
    return date.toLocaleString()
  } catch {
    return offlineStore.lastSyncAt
  }
})

async function retryConnection() {
  checking.value = true
  errorMessage.value = ''

  try {
    // Test simple de connexion
    const response = await fetch(window.location.origin + '/favicon.ico', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })

    if (response.ok || response.status < 500) {
      showReconnected.value = true
      offlineStore.setOnline(true)
      setTimeout(() => {
        router.push('/reports/dashboard')
      }, 1500)
    } else {
      errorMessage.value = 'Le serveur ne répond pas. Réessayez plus tard.'
    }
  } catch {
    errorMessage.value = 'Toujours hors ligne. La synchronisation se fera automatiquement.'
  } finally {
    checking.value = false
  }
}

// Auto-détection de reconnexion
onMounted(() => {
  const handler = () => {
    offlineStore.setOnline(true)
    router.push('/reports/dashboard')
  }
  window.addEventListener('online', handler, { once: true })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
