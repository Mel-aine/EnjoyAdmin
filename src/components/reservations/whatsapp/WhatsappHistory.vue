<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getWhatsappLogs } from '@/services/whatsapp'
import { useServiceStore } from '@/composables/serviceStore'
import {
  MessageCircle, Check, CheckCheck, AlertCircle, Clock,
  RefreshCw, Smartphone, Send, Mailbox, Eye, X, AlertTriangle
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ reservationId: number }>()

const { t } = useI18n()
const serviceStore = useServiceStore()
const logs = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const expandedErrors = ref<Set<number>>(new Set())

const fetchLogs = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await getWhatsappLogs(props.reservationId, serviceStore.serviceId!)
    logs.value = res.data?.data || res.data || []
  } catch (err: any) {
    error.value = err?.response?.data?.message || t('whatsapp.error.load_failed')
  } finally {
    isLoading.value = false
  }
}

const toggleError = (id: number) => {
  if (expandedErrors.value.has(id)) expandedErrors.value.delete(id)
  else expandedErrors.value.add(id)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat(t('locale'), {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString))
}

const getStatusConfig = (status: string) => {
  const map: Record<string, { labelKey: string; component: any; iconClass: string; wrapClass: string; badgeClass: string }> = {
    sent: {
      labelKey: 'whatsapp.status.sent',
      component: Check,
      iconClass: 'text-gray-400',
      wrapClass: 'bg-gray-100 dark:bg-gray-700 text-gray-400',
      badgeClass: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600',
    },
    delivered: {
      labelKey: 'whatsapp.status.delivered',
      component: CheckCheck,
      iconClass: 'text-blue-400',
      wrapClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-400',
      badgeClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800',
    },
    read: {
      labelKey: 'whatsapp.status.read',
      component: CheckCheck,
      iconClass: 'text-blue-600',
      wrapClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
      badgeClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 border-blue-300 dark:border-blue-700',
    },
    failed: {
      labelKey: 'whatsapp.status.failed',
      component: AlertCircle,
      iconClass: 'text-red-500',
      wrapClass: 'bg-red-50 dark:bg-red-900/20 text-red-500',
      badgeClass: 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-800',
    },
    received: {
      labelKey: 'whatsapp.status.received',
      component: Check,
      iconClass: 'text-green-500',
      wrapClass: 'bg-green-50 dark:bg-green-900/20 text-green-500',
      badgeClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-800',
    },
  }
  return map[status] ?? {
    labelKey: 'whatsapp.status.unknown',
    component: Clock,
    iconClass: 'text-gray-300',
    wrapClass: 'bg-gray-50 dark:bg-gray-800 text-gray-300',
    badgeClass: 'bg-gray-50 text-gray-400 border-gray-100',
  }
}

const templateLabel = (name: string | null) => {
  if (!name) return null
  const key = `whatsapp.templates.${name}`
  const translated = t(key)
  return translated !== key ? translated : name
}

const parseProviderError = (log: any): { message: string; detail: string | null; traceId: string | null } | null => {
  const err = log.providerResponse?.error
  if (!err) return null
  return {
    message: err.message || t('whatsapp.error.unknown'),
    detail: err.error_data?.details || null,
    traceId: err.fbtrace_id || null,
  }
}

const stats = computed(() => ({
  total:     logs.value.length,
  sent:      logs.value.filter(l => l.status === 'sent').length,
  delivered: logs.value.filter(l => l.status === 'delivered').length,
  read:      logs.value.filter(l => l.status === 'read').length,
  failed:    logs.value.filter(l => l.status === 'failed').length,
}))

onMounted(fetchLogs)
</script>

<template>
  <div class="p-4 space-y-4">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <MessageCircle class="w-5 h-5 text-green-500" />
        <h3 class="font-medium text-[15px] text-gray-800 dark:text-gray-100">
          {{ t('whatsapp.history.title') }}
        </h3>
        <span class="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
          {{ t('whatsapp.history.message_count', { count: stats.total }) }}
        </span>
      </div>
      <button
        @click="fetchLogs"
        :disabled="isLoading"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        :aria-label="t('whatsapp.history.refresh')"
      >
        <RefreshCw class="w-4 h-4 text-gray-500" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

    <!-- Stats -->
    <div v-if="stats.total > 0" class="grid grid-cols-4 gap-2">
      <div class="text-center p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
        <div class="text-xl font-medium text-gray-500 dark:text-gray-400">{{ stats.sent }}</div>
        <div class="text-[11px] text-gray-400 mt-0.5">{{ t('whatsapp.status.sent') }}</div>
      </div>
      <div class="text-center p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/40">
        <div class="text-xl font-medium text-blue-500">{{ stats.delivered }}</div>
        <div class="text-[11px] text-gray-400 mt-0.5">{{ t('whatsapp.status.delivered') }}</div>
      </div>
      <div class="text-center p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/40">
        <div class="text-xl font-medium text-blue-600">{{ stats.read }}</div>
        <div class="text-[11px] text-gray-400 mt-0.5">{{ t('whatsapp.status.read') }}</div>
      </div>
      <div class="text-center p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/40">
        <div class="text-xl font-medium text-red-500">{{ stats.failed }}</div>
        <div class="text-[11px] text-gray-400 mt-0.5">{{ t('whatsapp.status.failed') }}</div>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="space-y-2">
      <div v-for="i in 3" :key="i" class="animate-pulse flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
        <div class="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/5" />
          <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full" />
          <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
        </div>
      </div>
    </div>

    <!-- Error global -->
    <div v-else-if="error" class="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40">
      <AlertCircle class="w-5 h-5 flex-shrink-0" />
      <span class="text-sm">{{ error }}</span>
    </div>

    <!-- Empty -->
    <div v-else-if="logs.length === 0" class="text-center py-12 text-gray-400">
      <MessageCircle class="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p class="text-sm">{{ t('whatsapp.history.empty') }}</p>
    </div>

    <!-- Liste -->
    <div v-else class="space-y-2">
      <div
        v-for="log in logs"
        :key="log.id"
        class="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <!-- Icône statut -->
        <div
          class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
          :class="getStatusConfig(log.status).wrapClass"
        >
          <component :is="getStatusConfig(log.status).component" class="w-4 h-4" />
        </div>

        <!-- Contenu -->
        <div class="flex-1 min-w-0">

          <!-- Badges -->
          <div class="flex items-center gap-1.5 flex-wrap mb-1.5">
            <span
              v-if="log.templateName"
              class="text-[11px] font-medium px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800"
            >
              {{ templateLabel(log.templateName) }}
            </span>
            <span
              class="text-[11px] font-medium px-2 py-0.5 rounded-full border"
              :class="getStatusConfig(log.status).badgeClass"
            >
              {{ t(getStatusConfig(log.status).labelKey) }}
            </span>
            <span class="text-[11px] text-gray-400 dark:text-gray-500">
              {{ t('whatsapp.history.via', { provider: log.provider || 'meta' }) }}
            </span>
          </div>

          <!-- Téléphone -->
          <div class="flex items-center gap-1 text-[12px] text-gray-500 dark:text-gray-400 mb-1.5 font-mono">
            <Smartphone class="w-3.5 h-3.5" />
            {{ log.recipientPhone || '—' }}
          </div>

          <!-- Corps message -->
          <p
            v-if="log.messageBody"
            class="text-[12px] text-gray-600 dark:text-gray-300 line-clamp-2 bg-gray-50 dark:bg-gray-700/40 rounded-lg px-2.5 py-1.5 mb-1.5 leading-relaxed"
          >
            {{ log.messageBody }}
          </p>

          <!-- Bloc erreur provider -->
          <template v-if="log.status === 'failed'">
            <div
              v-if="parseProviderError(log)"
              class="mb-1.5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 overflow-hidden"
            >
              <div class="flex items-start gap-2 px-3 py-2">
                <AlertTriangle class="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-medium text-red-700 dark:text-red-400">
                    {{ parseProviderError(log)!.message }}
                  </p>
                  <p
                    v-if="parseProviderError(log)!.detail"
                    class="text-[11px] text-red-500 dark:text-red-400 mt-0.5 font-mono"
                  >
                    {{ parseProviderError(log)!.detail }}
                  </p>
                </div>
                <button
                  v-if="parseProviderError(log)!.traceId"
                  class="text-[10px] text-red-400 hover:text-red-600 flex-shrink-0 underline underline-offset-2 transition-colors"
                  @click="toggleError(log.id)"
                >
                  {{ expandedErrors.has(log.id) ? t('whatsapp.error.hide_trace') : t('whatsapp.error.show_trace') }}
                </button>
              </div>
              <div
                v-if="expandedErrors.has(log.id) && parseProviderError(log)!.traceId"
                class="border-t border-red-200 dark:border-red-800 px-3 py-1.5"
              >
                <span class="text-[10px] text-red-400 font-mono">
                  fbtrace_id: {{ parseProviderError(log)!.traceId }}
                </span>
              </div>
            </div>
            <!-- Fallback si pas de providerResponse -->
            <div
              v-else-if="log.failureReason"
              class="mb-1.5 flex items-center gap-1.5 text-[12px] text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-2.5 py-1.5 border border-red-100 dark:border-red-900"
            >
              <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
              {{ log.failureReason }}
            </div>
          </template>

          <!-- Dates -->
          <div class="flex gap-3 flex-wrap">
            <span v-if="log.sentAt" class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
              <Send class="w-3 h-3" /> {{ formatDate(log.sentAt) }}
            </span>
            <span v-if="log.deliveredAt" class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
              <Mailbox class="w-3 h-3" /> {{ formatDate(log.deliveredAt) }}
            </span>
            <span v-if="log.readAt" class="flex items-center gap-1 text-[11px] text-blue-400">
              <Eye class="w-3 h-3" /> {{ formatDate(log.readAt) }}
            </span>
            <span v-if="log.failedAt && log.status === 'failed'" class="flex items-center gap-1 text-[11px] text-red-400">
              <X class="w-3 h-3" /> {{ formatDate(log.failedAt) }}
            </span>
            <span v-if="!log.sentAt && !log.failedAt" class="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock class="w-3 h-3" /> {{ formatDate(log.createdAt) }}
            </span>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>