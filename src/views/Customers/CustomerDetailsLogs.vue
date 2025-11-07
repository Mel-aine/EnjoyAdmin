<template>
  <AdminLayout>
    <FullScreenLayout>
  <div class="space-y-4">
    <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <button @click="goBack" class="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors focus:outline-none">
          <ArrowLeft class="w-4 h-4" />
          <span>{{ $t('Back') }}</span>
        </button>
        <span class="text-gray-400">/</span>
        <span>{{ $t('GuestLogs') }}</span>
        <span class="text-gray-400">/</span>
        <span class="font-semibold text-gray-700">{{ GuestName || $t('LoadingGuestName...') }}</span>
      </div>
    </div>
    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
      <div class="flex items-center space-x-2">
        <Filter class="w-4 h-4 text-gray-500" />
        <span class="text-sm font-medium text-gray-700">{{ $t('Filters') }}:</span>
      </div>

      <!-- Action Filter -->

      <div class="w-60">
      <Select :options="Actions" @change="fetchActivityLogs(true)" v-model="selectedAction" :placeholder="$t('selectedAction')"/>
      </div>
      <!-- Date Filter -->
       <InputDatePicker class="bg-white rounded-lg w-60 h-full" v-model="selectedDate" :placeholder="$t('selectDate')" @change="fetchActivityLogs(true)"/>



      <!-- Clear Filters -->
      <button
        @click="clearFilters"
        class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition-colors"
      >
        {{ $t('Clear') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && currentLogs.length === 0" class="text-center py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-8 text-gray-600">{{ $t('Loadingauditlogs...') }}</p>
    </div>

    <!-- Audit Logs Timeline -->
    <div v-else class="overflow-hidden">
      <div class="space-y-4">
        <div
          v-for="(log, index) in currentLogs"
          :key="log.id"
          class="relative flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <!-- Timeline Line -->
          <div v-if="index < currentLogs.length - 1" class="absolute left-8 top-16 w-0.5 h-full bg-gray-200"></div>

          <!-- Action Icon -->
          <div :class="[
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
            getActionColor(log.action)
          ]">
            <component :is="getActionIcon(log.action)" class="w-4 h-4 text-white" />
          </div>

          <!-- Log Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- Action Header -->
                <div class="flex items-center space-x-2 mb-2">
                  <h4 class="text-sm font-semibold text-gray-900">
                    {{ $t(`auditActions.${log.action}`) }}
                  </h4>
                  <span :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    getActionBadgeColor(log.action)
                  ]">
                    {{ log.action.toUpperCase() }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-sm text-gray-600 mb-3">
                  {{ formatDescription(log) }}
                </p>

                <!-- Changes Details -->
                <div v-if="log.changes && Object.keys(log.changes).length > 0" class="mb-3">
                  <button
                    @click="toggleChanges(log.id)"
                    class="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    <ChevronDown
                      :class="[
                        'w-4 h-4 transition-transform',
                        expandedChanges.includes(String(log.id)) ? 'rotate-180' : ''
                      ]"
                    />
                    <span>{{ $t('View Changes') }} ({{ Object.keys(log.changes).length }})</span>
                  </button>

                  <div
                    v-if="expandedChanges.includes(String(log.id))"
                    class="mt-2 p-3 bg-gray-50 rounded border"
                  >
                    <div
                      v-for="(change, field) in log.changes"
                      :key="field"
                      class="mb-2 last:mb-0"
                    >
                      <div class="text-xs font-medium text-gray-700 mb-1">{{ field }}:</div>
                      <div class="flex items-center space-x-4 text-xs">
                        <div class="flex items-center space-x-1">
                          <span class="text-red-600">{{ $t('From') }}:</span>
                          <code class="bg-red-50 text-red-700 px-2 py-1 rounded">{{ change.old !== null ? change.old : 'null' }}</code>
                        </div>
                        <ArrowRight class="w-3 h-3 text-gray-400" />
                        <div class="flex items-center space-x-1">
                          <span class="text-green-600">{{ $t('To') }}:</span>
                          <code class="bg-green-50 text-green-700 px-2 py-1 rounded">{{ change.new !== null ? change.new : 'null' }}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Metadata -->
                <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div class="flex items-center space-x-1">
                    <User class="w-3 h-3" />
                    <span>{{ log.userName || (log.userId ? `ID: ${log.userId}` : $t('UnknownUser')) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <Monitor class="w-3 h-3" />
                    <span>{{ log.ipAddress || $t('UnknownIP') }}</span>
                  </div>
                  <div v-if="log.userAgent" class="flex items-center space-x-1">
                    <Smartphone class="w-3 h-3" />
                    <span>{{ getBrowserInfo(log.userAgent) }}</span>
                  </div>
                  <div v-if="log.meta && log.meta.reason" class="flex items-center space-x-1">
                    <Info class="w-3 h-3" />
                    <span>{{ $t('Reason') }}: {{ log.meta.reason }}</span>
                  </div>
                  <div v-if="log.meta && log.meta.blacklisted !== undefined" class="flex items-center space-x-1">
                    <ShieldOff v-if="log.meta.blacklisted" class="w-3 h-3 text-red-500" />
                    <ShieldCheck v-else class="w-3 h-3 text-green-500" />
                    <span>{{ log.meta.blacklisted ? $t('Blacklisted') : $t('NotBlacklisted') }}</span>
                  </div>
                </div>
              </div>

              <!-- Timestamp -->
              <div class="flex-shrink-0 text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatTime(log.timestamp) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatDate(log.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="currentLogs.length === 0 && !loading" class="text-center py-12">
        <FileSearch class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('NoAuditLogsFound') }}</h3>
        <p class="text-gray-500">
          {{ selectedAction || selectedDate || selectedUser
            ? $t('Nologsmatchtheselectedfilters.')
            : $t('Noaudittrailavailableforthisguest.')
          }}
        </p>
      </div>

      <!-- Load More -->
      <div v-if="hasMorePages" class="text-center py-4">
        <button
          @click="loadMore"
          :disabled="loading"
          class="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <span v-if="loading">{{ $t('Loading...') }}</span>
          <span v-else>{{ $t('LoadMore') }}</span>
        </button>
      </div>
    </div>

  </div>
  </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGuestsActivityLogs ,getGuestById } from '@/services/guestApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { defineAsyncComponent } from 'vue'
const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'))
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'

import {
  Filter,
  ChevronDown,
  ArrowRight,
  User,
  Monitor,
  Smartphone,
  Key,
  FileSearch,
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  CreditCard,
  UserCheck,
  UserX,
  Shield,
  Settings,
  Info,
  ShieldOff,
  ShieldCheck,
  CalendarX,
  CalendarCheck,
  ArrowLeft

} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t,locale } = useI18n()
const route = useRoute()
const router = useRouter()

// Interfaces
interface AuditLog {
  id: string | number
  action: string
  description: string
  changes?: Record<string, { old: any; new: any }> | null
  timestamp: string
  userId: string | number
  userName?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  sessionId?: string | null
  entityId?: string | number | null
  entityType?: string | null
  meta?: Record<string, any> | null
}

interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

// Reactive references pour l'état du composant
const currentLogs = ref<AuditLog[]>([])
const loading = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const selectedAction = ref('')
const selectedDate = ref('')
const selectedUser = ref('')
const expandedChanges = ref<string[]>([])
const serviceStore = useServiceStore()
const guestId = route.params.id as string
const GuestName = ref('')
const Actions = computed(() => [
  { label: t('CREATE'), value: 'CREATE' },
  { label: t('UPDATE'), value: 'UPDATE' },
  { label: t('DELETE'), value: 'DELETE' },
  { label: t('LOGIN'), value: 'LOGIN' },
  { label: t('LOGOUT'), value: 'LOGOUT' },
  { label: t('CHECK_IN'), value: 'CHECK_IN' },
  { label: t('CHECK_OUT'), value: 'CHECK_OUT' },
  { label: t('ADD_PAYMENT'), value: 'ADD_PAYMENT' },
  { label: t('CONFIRM_RESERVATION'), value: 'CONFIRM_RESERVATION' },
  { label: t('RESERVATION_CREATED'), value: 'RESERVATION_CREATED' },
  { label: t('CANCEL_RESERVATION'), value: 'CANCEL_RESERVATION' },
  { label: t('CANCEL'), value: 'CANCEL' },
  { label: t('BLACKLIST'), value: 'BLACKLIST' },
  { label: t('UNBLACKLIST'), value: 'UNBLACKLIST' },
])

// Computed properties
const uniqueUsers = computed(() => {
  const users = new Set<string>()
  currentLogs.value.forEach(log => {
    if (log.userName) users.add(log.userName)
    // Assurez-vous que userId est un string pour l'affichage si userName n'est pas dispo
    else if (log.userId) users.add(String(log.userId))
  })
  return Array.from(users).sort().map(user => ({
      label: user,
      value: user
    }))
})

const hasMorePages = computed(() => currentPage.value < lastPage.value)

// Methods pour l'appel API et la logique de pagination
const fetchActivityLogs = async (reset: boolean = false) => {
  if (loading.value) return

  loading.value = true
  if (reset) {
    currentPage.value = 1
    currentLogs.value = []
    expandedChanges.value = []
  }

  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId || !guestId) {
      console.warn("Missing hotelId or guestId for fetching logs.");
      loading.value = false;
      return;
    }

    const params: Record<string, any> = {
      page: currentPage.value,
      limit: 15,
    }

    // Ajoute les filtres à la requête si définis
    if (selectedAction.value) {
      params.action = selectedAction.value
    }
    console.log("selectedAction.value",selectedAction.value)
    console.log("params.action ",params.action )
    if (selectedDate.value) {
      params.date = selectedDate.value
    }
    if (selectedUser.value) {
        params.user = selectedUser.value
    }

    const res = await getGuestsActivityLogs(hotelId, Number(guestId), params)

    const newLogs: AuditLog[] = res.data.data.map((log: any) => ({
        id: log.id,
        action: log.action,
        description: log.description,
        changes: log.changes || null,
        timestamp: log.timestamp,
        userId: log.userId,
        userName: log.userName || null,
        ipAddress: log.ipAddress || null,
        userAgent: log.userAgent || null,
        sessionId: log.sessionId || null,
        entityId: log.entityId || null,
        entityType: log.entityType || null,
        meta: log.meta || null,
    }));
    console.log("newlog",newLogs)

    if (reset) {
      currentLogs.value = newLogs
    } else {
      currentLogs.value.push(...newLogs)
    }

    lastPage.value = res.data.meta.lastPage
    currentPage.value = res.data.meta.currentPage
    console.log("Logs reçus:", res.data.data)
        console.log("Current logs after update:", currentLogs.value); // Check the final state
    console.log("Total logs fetched:", currentLogs.value.length);

  } catch (err: any) {
    console.error("Erreur récupération logs:", err)

  } finally {
    loading.value = false
  }
}

const getGuestName = async () => {
  if (!guestId) return

  try {
    const res = await getGuestById(Number(guestId))
    const guest = res?.data?.data

    if (guest) {
      GuestName.value = [guest.title, guest.firstName, guest.lastName].filter(Boolean).join(' ')
      console.log("Guest info:", guest)
    } else {
      console.warn("Guest not found")
    }
  } catch (error) {
    console.error("Error fetching guest name:", error)
  }
}

const loadMore = () => {
  if (hasMorePages.value && !loading.value) {
    currentPage.value++
    fetchActivityLogs(false)
  }
}

// Initialisation au montage du composant
onMounted(() => {
  fetchActivityLogs(true)
  getGuestName()
})

// Fonctions de formatage (inchangées, sauf les valeurs null)

const formatDate = (dateStr:any, currentLocale = locale.value) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}



const formatDescription = (log: AuditLog): string => {
  let baseDescription = log.description || t(`auditDescriptions.${log.action}`)

  const divRegex = /<div[^>]*v-if="log\.changes[^>]*>[\s\S]*<\/div>/g;
  baseDescription = baseDescription.replace(divRegex, '');

  // Nettoyer toute balise HTML résiduelle au début ou à la fin si nécessaire
  baseDescription = baseDescription.replace(/<[^>]*>/g, '').trim();

  // Ajout de détails spécifiques pour l'action BLACKLIST
  if (log.action === 'BLACKLIST' && log.meta?.reason) {
    return `${baseDescription} (${t('Reason')}: ${log.meta.reason})`
  }
  // Add context if available
  if (log.entityType && log.entityId) {
    return `${baseDescription} (${log.entityType} ID: ${log.entityId})`
  }

  return baseDescription
}

// Fonctions pour les icônes et couleurs (ajout de BLACKLIST et UNBLACKLIST)
const getActionIcon = (action: string) => {
  switch (action) {
    case 'CREATE': return Plus
    case 'UPDATE': return Edit
    case 'DELETE': return Trash2
    case 'LOGIN': return LogIn
    case 'LOGOUT': return LogOut
    case 'CHECK_IN': return UserCheck
    case 'CHECK_OUT': return UserX
    case 'ADD_PAYMENT': return CreditCard
    case 'CONFIRM_RESERVATION': return Shield
    case 'RESERVATION_CREATED' :return CalendarCheck
    case 'CANCEL_RESERVATION' : return CalendarX
    case 'CANCEL' : return CalendarX
    case 'BLACKLIST': return ShieldOff
    case 'UNBLACKLIST': return ShieldCheck
    default: return Settings
  }
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'CREATE': return 'bg-green-500'
    case 'UPDATE': return 'bg-blue-500'
    case 'DELETE': return 'bg-red-500'
    case 'LOGIN': return 'bg-emerald-500'
    case 'LOGOUT': return 'bg-orange-500'
    case 'CHECK_IN': return 'bg-teal-500'
    case 'CHECK_OUT': return 'bg-purple-500'
    case 'ADD_PAYMENT': return 'bg-yellow-500'
    case 'CONFIRM_RESERVATION': return 'bg-indigo-500'
    case 'RESERVATION_CREATED' :return 'bg-orange-500'
    case 'CANCEL_RESERVATION' : return 'bg-pink-500'
    case 'CANCEL' : return 'bg-pink-500'
    case 'BLACKLIST': return 'bg-red-600'
    case 'UNBLACKLIST': return 'bg-green-600'
    default: return 'bg-gray-500'
  }
}

const getActionBadgeColor = (action: string): string => {
  switch (action) {
    case 'CREATE': return 'bg-green-100 text-green-800'
    case 'UPDATE': return 'bg-blue-100 text-blue-800'
    case 'DELETE': return 'bg-red-100 text-red-800'
    case 'LOGIN': return 'bg-emerald-100 text-emerald-800'
    case 'LOGOUT': return 'bg-orange-100 text-orange-800'
    case 'CHECK_IN': return 'bg-teal-100 text-teal-800'
    case 'CHECK_OUT': return 'bg-purple-100 text-purple-800'
    case 'ADD_PAYMENT': return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRM_RESERVATION': return 'bg-indigo-100 text-indigo-800'
    case 'RESERVATION_CREATED' :return 'bg-orange-100 text-orange-800'
    case 'CANCEL_RESERVATION' : return 'bg-pink-100 text-pink-800'
    case 'CANCEL' : return 'bg-pink-100 text-pink-800'
    case 'BLACKLIST': return 'bg-red-100 text-red-800'
    case 'UNBLACKLIST': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getBrowserInfo = (userAgent: string | null): string => {
  if (!userAgent) return t('Unknown Browser')
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return t('Unknown Browser')
}

const toggleChanges = (logId: string | number) => {
  const idAsString = String(logId);
  const index = expandedChanges.value.indexOf(idAsString)
  if (index > -1) {
    expandedChanges.value.splice(index, 1)
  } else {
    expandedChanges.value.push(idAsString)
  }
}


const clearFilters = () => {
  selectedAction.value = ''
  selectedDate.value = ''
  selectedUser.value = ''
  fetchActivityLogs(true)
}

const goBack = (): void => {
  router.back()
}
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>

