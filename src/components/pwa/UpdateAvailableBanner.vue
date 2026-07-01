<template>
  <Transition name="banner-slide">
    <div
      v-if="visible"
      class="fixed top-0 left-0 right-0 z-[9999]"
    >
      <!-- Bannière Nouvelle version disponible -->
      <div
        v-if="variant === 'update'"
        class="mx-auto flex items-center justify-between gap-4 bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 px-4 py-3 text-white shadow-lg dark:from-purple-800 dark:via-violet-700 dark:to-indigo-700"
      >
        <div class="flex items-center gap-3">
          <svg
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <!-- Icône mise à jour -->
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div>
            <p class="text-sm font-semibold">
              {{ t('pwa.updateAvailable') || '✨ Nouvelle version disponible' }}
            </p>
            <p class="text-xs text-white/80">
              {{ t('pwa.updateDescription') || 'Une mise à jour est prête à être installée.' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="$emit('refresh')"
            class="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {{ t('pwa.refresh') || 'Actualiser' }}
          </button>
          <button
            @click="$emit('dismiss')"
            class="rounded-lg p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Bannière Prêt hors-ligne (auto-disparaît) -->
      <div
        v-else-if="variant === 'offline-ready'"
        class="mx-auto flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white shadow-lg dark:from-emerald-700 dark:to-teal-700"
      >
        <div class="flex items-center gap-3">
          <svg
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2a10 10 0 0 1 10 10" />
            <path d="M2 12a10 10 0 0 1 10-10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
            <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
          </svg>
          <p class="text-sm font-medium">
            {{ t('pwa.offlineReady') || '✅ Application prête à fonctionner hors-ligne' }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  visible: boolean
  variant: 'update' | 'offline-ready'
}>()

defineEmits<{
  refresh: []
  dismiss: []
}>()
</script>

<style scoped>
.banner-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.banner-slide-leave-active {
  transition: all 0.3s ease-in;
}
.banner-slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.banner-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
