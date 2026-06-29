<template>
  <div
    class="connection-status"
    :class="`connection-status--${qualityClass}`"
    :title="tooltip"
  >
    <!-- Icon -->
    <svg
      v-if="quality === 'online'"
      class="connection-status__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
    <svg
      v-else-if="quality === 'unstable'"
      class="connection-status__icon connection-status__icon--pulse"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
    <svg
      v-else
      class="connection-status__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>

    <!-- Text -->
    <span v-if="showLabel" class="connection-status__text">
      <template v-if="quality === 'online'">En ligne</template>
      <template v-else-if="quality === 'unstable'">Instable</template>
      <template v-else>Hors ligne</template>
    </span>

    <!-- Pending count badge -->
    <span
      v-if="pendingCount > 0 && quality !== 'online'"
      class="connection-status__badge"
    >
      {{ pendingCount }}
    </span>

    <!-- Syncing spinner -->
    <svg
      v-if="syncing"
      class="connection-status__spinner"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  connectionQuality,
  pendingOperations,
  isSyncing,
} from '../../services/offline/connectionState.js'

const props = withDefaults(defineProps<{
  showLabel?: boolean
}>(), {
  showLabel: true,
})

const quality = computed(() => connectionQuality.value)
const pendingCount = computed(() => pendingOperations.value)
const syncing = computed(() => isSyncing.value)

const qualityClass = computed(() => {
  switch (quality.value) {
    case 'online': return 'online'
    case 'unstable': return 'unstable'
    default: return 'offline'
  }
})

const tooltip = computed(() => {
  if (syncing.value) return 'Synchronisation en cours...'
  switch (quality.value) {
    case 'online': return 'Connecté — Tout fonctionne normalement'
    case 'unstable': return 'Connexion instable — Les données peuvent ne pas être à jour'
    default: return 'Hors ligne — Les opérations sont mises en file d\'attente'
  }
})
</script>

<style scoped>
.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  cursor: default;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;
}

.connection-status--online {
  color: #16a34a;
  background-color: rgba(22, 163, 74, 0.1);
}

.connection-status--unstable {
  color: #d97706;
  background-color: rgba(217, 119, 6, 0.1);
}

.connection-status--offline {
  color: #dc2626;
  background-color: rgba(220, 38, 38, 0.1);
}

.connection-status__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.connection-status__icon--pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.connection-status__text {
  font-size: 11px;
  line-height: 1;
}

.connection-status__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background-color: currentColor;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.connection-status__spinner {
  width: 12px;
  height: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
