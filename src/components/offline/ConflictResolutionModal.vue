<template>
  <div
    v-if="visible && conflict"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div class="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
      <!-- Header -->
      <div class="mb-4 flex items-center gap-2">
        <svg class="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('offlineConflict.title') }}
        </h3>
      </div>

      <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {{ t('offlineConflict.description') }}
      </p>

      <div class="mb-1 rounded-lg bg-gray-50 p-2 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
        {{ conflictLabel }}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Version locale -->
        <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
          <div class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300">
            <span>📱</span>
            <span>{{ t('offlineConflict.localVersion') }}</span>
          </div>
          <pre class="max-h-32 overflow-auto rounded bg-white/80 p-2 text-xs dark:bg-gray-900/50">{{ formatJSON(conflict.clientData) }}</pre>
          <button
            @click="resolve('client_wins')"
            class="mt-2 w-full rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            {{ t('offlineConflict.keepLocal') }}
          </button>
        </div>

        <!-- Version serveur -->
        <div class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
          <div class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-300">
            <span>☁️</span>
            <span>{{ t('offlineConflict.serverVersion') }}</span>
          </div>
          <pre class="max-h-32 overflow-auto rounded bg-white/80 p-2 text-xs dark:bg-gray-900/50">{{ formatJSON(conflict.serverData) }}</pre>
          <button
            @click="resolve('server_wins')"
            class="mt-2 w-full rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
          >
            {{ t('offlineConflict.keepServer') }}
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-4 flex justify-end">
        <button
          @click="$emit('close')"
          class="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {{ t('offlineConflict.cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import apiClient from '@/services/apiClient'
import { useOfflineStore } from '@/services/offline/offlineStore'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  visible: boolean
  conflict: {
    id?: number
    operationId?: string
    resourceType: string
    resourceId: number
    clientData: Record<string, any>
    serverData: Record<string, any>
  } | null
}>()

const emit = defineEmits<{
  close: []
  resolved: []
}>()

const { t } = useI18n()
const store = useOfflineStore()

const conflictLabel = computed(() => {
  if (!props.conflict) return ''
  const type = props.conflict.resourceType
  const key = 'offlineConflict.resourceLabels.' + type
  const translated = t(key)
  const label = translated !== key ? translated : type
  return label + ' #' + props.conflict.resourceId
})

function formatJSON(data: any): string {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

async function resolve(resolution: 'client_wins' | 'server_wins') {
  if (!props.conflict?.id) return
  try {
    await apiClient.post('/api/sync/conflicts/' + props.conflict.id + '/resolve', { resolution })
    await store.refreshPendingCount()
    emit('resolved')
  } catch (error) {
    console.error('Erreur résolution conflit:', error)
  }
}
</script>
