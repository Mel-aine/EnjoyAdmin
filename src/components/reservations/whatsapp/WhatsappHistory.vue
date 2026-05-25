<template>
  <div class="p-4 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
           <svg class="w-5 h-5 text-green-500" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.655 4.83 1.8 6.856L2 30l7.344-1.776A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 0 1-5.888-1.608l-.42-.252-4.356 1.056 1.1-4.236-.276-.436A11.52 11.52 0 0 1 4.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.344-8.62c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.364-.204.232-.406.26-.754.086-.348-.174-1.47-.542-2.8-1.726-1.034-.922-1.732-2.06-1.936-2.408-.204-.348-.022-.536.152-.708.158-.156.348-.406.522-.61.174-.204.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.89-1.074-2.59-.282-.68-.57-.588-.784-.598l-.668-.012c-.232 0-.61.086-.928.434-.32.348-1.22 1.19-1.22 2.902s1.248 3.366 1.422 3.598c.174.232 2.456 3.748 5.952 5.256.832.36 1.482.574 1.988.734.836.266 1.596.228 2.198.138.67-.1 2.06-.842 2.35-1.656.29-.814.29-1.512.204-1.658-.086-.146-.32-.232-.668-.406z"/>
            </svg>
        <h3 class="font-medium text-[15px] text-gray-800 dark:text-gray-100">
          {{ t('whatsapp.history.title') }}
        </h3>
        <span class="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
          {{ t('whatsapp.history.message_count', { count: logs.length }) }}
        </span>
      </div>
      <button
        @click="fetchLogs(1)"
        :disabled="isLoading"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <RefreshCw class="w-4 h-4 text-gray-500" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

 

    <ReusableTable
    
      :columns="columns"
      :data="mappedLogs"
      :loading="isLoading"
      :searchable="false"
      :show-header="false"
      :expandable="true"
      :meta="meta"
      @page-change="handlePageChange"
      item-key="id"
      empty-state-title="whatsapp.history.empty"
    >
      <!-- Statut -->
      <template #column-status="{ item }">
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            :class="getStatusConfig(item.status).wrapClass"
          >
            <component :is="getStatusConfig(item.status).component" class="w-3.5 h-3.5" />
          </div>
          <span
            class="text-[11px] font-medium px-2 py-0.5 rounded-full border"
            :class="getStatusConfig(item.status).badgeClass"
          >
            {{ t(getStatusConfig(item.status).labelKey) }}
          </span>
        </div>
      </template>

      <!-- Template -->
      <template #column-templateName="{ item }">
        <span
          v-if="item.templateName"
          class="text-[11px] font-medium px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800"
        >
          {{ templateLabel(item.templateName) }}
        </span>
        <span v-else class="text-gray-400">—</span>
      </template>

      <!-- Téléphone -->
      <template #column-recipientPhone="{ item }">
        <div class="flex items-center gap-1 font-mono text-[12px] text-gray-600 dark:text-gray-300">
          <Smartphone class="w-3.5 h-3.5 text-gray-400" />
          {{ item.recipientPhone || '—' }}
        </div>
      </template>

      <!-- Corps message -->
      <template #column-messageBody="{ item }">
        <p
          v-if="item.messageBody"
          class="text-[12px] text-gray-600 dark:text-gray-300 line-clamp-1 max-w-xs"
          :title="item.messageBody"
        >
          {{ item.messageBody }}
        </p>
        <span v-else class="text-gray-400">—</span>
      </template>

      <!-- Date envoi -->
      <template #column-sentAt="{ item }">
        <div class="flex flex-col gap-0.5">
          <span v-if="item.sentAt" class="flex items-center gap-1 text-[11px] text-gray-400">
            <Send class="w-3 h-3" /> {{ formatDate(item.sentAt) }}
          </span>
          <span v-if="item.deliveredAt" class="flex items-center gap-1 text-[11px] text-gray-400">
            <Mailbox class="w-3 h-3" /> {{ formatDate(item.deliveredAt) }}
          </span>
          <span v-if="item.readAt" class="flex items-center gap-1 text-[11px] text-blue-400">
            <Eye class="w-3 h-3" /> {{ formatDate(item.readAt) }}
          </span>
          <span v-if="item.failedAt && item.status === 'failed'" class="flex items-center gap-1 text-[11px] text-red-400">
            <X class="w-3 h-3" /> {{ formatDate(item.failedAt) }}
          </span>
        </div>
      </template>

      <!-- Expanded : erreur provider -->
      <template #expanded-content="{ item }">
        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
          <!-- Erreur provider -->
          <template v-if="item.status === 'failed'">
            <div
              v-if="parseProviderError(item)"
              class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 overflow-hidden"
            >
              <div class="flex items-start gap-2 px-3 py-2">
                <AlertTriangle class="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-medium text-red-700 dark:text-red-400">
                    {{ parseProviderError(item)!.message }}
                  </p>
                  <p v-if="parseProviderError(item)!.detail" class="text-[11px] text-red-500 mt-0.5 font-mono">
                    {{ parseProviderError(item)!.detail }}
                  </p>
                  <p v-if="parseProviderError(item)!.traceId" class="text-[10px] text-red-400 font-mono mt-1">
                    fbtrace_id: {{ parseProviderError(item)!.traceId }}
                  </p>
                </div>
              </div>
            </div>
            <div
              v-else-if="item.failureReason"
              class="flex items-center gap-1.5 text-[12px] text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-2.5 py-1.5 border border-red-100 dark:border-red-900"
            >
              <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
              {{ item.failureReason }}
            </div>
            <p v-else class="text-[12px] text-gray-400">{{ t('whatsapp.error.unknown') }}</p>
          </template>

          <!-- Corps complet si pas d'erreur -->
          <p
            v-else-if="item.messageBody"
            class="text-[12px] text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700/40 rounded-lg px-2.5 py-1.5 leading-relaxed"
          >
            {{ item.messageBody }}
          </p>

          <p v-else class="text-[12px] text-gray-400">—</p>
        </div>
      </template>
    </ReusableTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getWhatsappLogs } from '@/services/whatsapp'
import { useServiceStore } from '@/composables/serviceStore'
import {
  Check, CheckCheck, AlertCircle, Clock,
  RefreshCw, Smartphone, Send, Mailbox, Eye, X, AlertTriangle
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import type { Column } from '@/utils/models'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps<{ reservationId: number }>()

const { t } = useI18n()
const serviceStore = useServiceStore()
const logs = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const meta = ref<any>({})

const columns: Column[] = [
  { key: 'status',         label: t('whatsapp.columns.status'),    type: 'custom' },
  { key: 'templateName',   label: t('whatsapp.columns.template'),  type: 'custom' },
  { key: 'recipientPhone', label: t('whatsapp.columns.phone'),     type: 'custom' },
  { key: 'messageBody',    label: t('whatsapp.columns.message'),   type: 'custom' },
  { key: 'sentAt',         label: t('whatsapp.columns.dates'),     type: 'custom' },
]

// Les logs sont utilisés tels quels — la table accepte any[]
const mappedLogs = computed(() => logs.value)

const fetchLogs = async (page: number = 1) => {
  isLoading.value = true
  error.value = null
  try {
    const res = await getWhatsappLogs(props.reservationId, serviceStore.serviceId!, page) 
    logs.value = res.data?.data || res.data || []
    meta.value = res.data?.meta || res.data?.meta || {}
    
  } catch (err: any) {
    console.error(err)
    toast.error(t('whatsapp.error.load_failed'))
    error.value = err?.response?.data?.message || t('whatsapp.error.load_failed')
  } finally {
    isLoading.value = false
  }
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

const parseProviderError = (log: any) => {
  const err = log.providerResponse?.error
  if (!err) return null
  return {
    message: err.message || t('whatsapp.error.unknown'),
    detail: err.error_data?.details || null,
    traceId: err.fbtrace_id || null,
  }
}

const handlePageChange = (page: number) => {
  fetchLogs(page)
}

onMounted(() => fetchLogs(1))
</script>