<template>
  <RightSideModal :is-open="isOpen" :title="$t('Access Logs')" @close="closeModal">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('Access Logs') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ selectedDoor?.name }} - {{ selectedDoor?.room?.roomNumber }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <BasicButton
            @click="$emit('sync', selectedDoor)"
            :label="$t('Sync Logs')"
            variant="outline"
            size="sm"
            :icon="RefreshCw"
            :loading="syncing"
          />
        </div>
      </div>
    </template>

    <!-- Modal Body -->
    <div class="">
      <!-- Modal Body -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div
          class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-purple-600"
        ></div>
      </div>

      <div v-else-if="logs.length > 0" class="p-6 max-h-[65vh] overflow-y-auto">
        <div class="space-y-2">
          <div
            v-for="log in logs"
            :key="log.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-4 flex-1">
              <!-- Status Icon -->
              <div
                :class="{
                  'bg-green-100 text-green-600 dark:bg-green-900/30': log.accessGranted,
                  'bg-red-100 text-red-600 dark:bg-red-900/30': !log.accessGranted,
                }"
                class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <component :is="log.accessGranted ? CheckCircle : XCircle" class="w-5 h-5" />
              </div>

              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ log.userIdOnDevice }}
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400':
                        log.inOutStatus === 1,
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400':
                        log.inOutStatus === 0,
                    }"
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ log.inOutStatus === 1 ? $t('Entry') : $t('Exit') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Time and Status -->
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatTime(log.accessTime) }}
              </p>
              <span
                :class="{
                  'text-green-600 dark:text-green-400': log.accessGranted,
                  'text-red-600 dark:text-red-400': !log.accessGranted,
                }"
                class="text-xs font-semibold"
              >
                {{ log.accessGranted ? $t('✓ Granted') : $t('✗ Denied') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <FileText class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('No access logs found for this terminal') }}
        </p>
      </div>
    </div>
  </RightSideModal>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { X, CheckCircle, XCircle, FileText, RefreshCw } from 'lucide-vue-next'
import RightSideModal from '@/components/modal/RightSideModal.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'

interface Door {
  id: number
  name: string
  room?: {
    roomNumber: string
  }
}

interface AccessLog {
  id: number
  userIdOnDevice: string
  accessTime: string
  inOutStatus: number
  accessGranted: boolean
}

interface Props {
  isOpen: boolean
  selectedDoor: Door | null
  logs: AccessLog[]
  loading?: boolean
  syncing?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'sync', door: any | null): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  syncing: false,
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const formatTime = (dateString: string) => {
  return DateTime.fromISO(dateString).toLocaleString({
    ...DateTime.DATETIME_MED,
    hour: '2-digit',
    minute: '2-digit',
  })
}

const closeModal = () => {
  emit('close')
}

// Gestion de la touche Escape
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal()
        }
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  },
)
</script>

<style scoped>
.animate-in {
  animation: fadeInZoom 0.2s ease-out;
}

@keyframes fadeInZoom {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
