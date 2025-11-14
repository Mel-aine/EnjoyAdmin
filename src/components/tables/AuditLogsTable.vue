<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('Action') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('User') }}

            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('Description') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('Timestamp') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('IPAddress') }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('Details') }}
            </th>

          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="log in logs"
            :key="log.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"

          >
            <!-- Action Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm',
                    getActionColor(log.action)
                  ]"
                >
                  <component :is="getActionIcon(log.action)" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {{ $t(`auditActions.${log.action}`) }}
                  </div>
                  <div class="flex items-center space-x-2 mt-1">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium dark:bg-gray-800 dark:text-gray-300',
                        getActionBadgeColor(log.action)
                      ]"
                    >
                      {{  $t(`${log.action}`) }}
                    </span>

                  </div>
                </div>
              </div>
            </td>

            <!-- User Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 w-8 h-8">
                  <div class="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {{ log.userName || log.username || log.userId }}
                  </div>

                </div>
              </div>
            </td>

            <!-- Description Column -->
            <td class="px-6 py-4 max-w-xs">
              <div class="text-sm text-gray-900 dark:text-gray-200 truncate" :title="formatDescription(log)">
                {{ formatDescription(log) }}
              </div>
              <div v-if="log.entityType" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ log.entityType }}
                <span v-if="log.entityId" class="font-mono">#{{ log.entityId }}</span>
              </div>
            </td>

            <!-- Timestamp Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-200">
                {{ formatDate(log.timestamp || log.createdAt) }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTime(log.timestamp || log.createdAt!) }}
              </div>
            </td>

            <!-- IP Address Column -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-2">
                <Globe class="w-4 h-4 text-gray-400 dark:text-gray-300" />
                <span class="text-sm text-gray-900 dark:text-gray-200 font-mono">
                  {{ log.ipAddress || $t('Unknown') }}
                </span>
              </div>
              <div v-if="log.userAgent" class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-1">
                <Monitor class="w-3 h-3" />
                <span>{{ getBrowserInfo(log.userAgent) }}</span>
              </div>
            </td>

            <!-- Details Column -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  v-if="log.changes && Object.keys(log.changes).length > 0"
                  @click="$emit('toggle-changes', log.id)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-150"
                >
                  <div class="flex items-center space-x-1">
                    <span>{{ $t('Changes') }}</span>
                    <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded-full text-xs">
                      {{ Object.keys(log.changes).length }}
                    </span>
                  </div>
                </button>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Expanded Changes Section -->
    <div
      v-for="log in logs"
      :key="`changes-${log.id}`"
    >
      <Transition name="slide-down">
        <div
          v-if="expandedChanges?.includes(String(log.id)) && log.changes && Object.keys(log.changes).length > 0"
          class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="px-6 py-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {{ $t('Changesfor{action}', { action: $t(`auditActions.${log.action}`) }) }}
              </h4>
              <button
                @click="$emit('toggle-changes', log.id)"
                class="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
              <div
                v-for="(change, field) in log.changes"
                :key="field"
                class="bg-white dark:bg-gray-900 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 shadow-sm"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {{ formatFieldName(field) }}
                  </span>
                  <div class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock class="w-3 h-3" />
                    <span>{{ formatTime(log.timestamp) }}</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <!-- Before Value -->
                  <div>
                    <div class="text-xs text-red-600 font-medium mb-1 flex items-center space-x-1">
                      <Minus class="w-3 h-3" />
                      <span>{{ $t('Before') }}</span>
                    </div>
                    <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
                      <code class="text-red-800 dark:text-red-300 text-sm break-all">
                        {{ formatValue(change.old) }}
                      </code>
                    </div>
                  </div>

                  <!-- After Value -->
                  <div>
                    <div class="text-xs text-green-600 font-medium mb-1 flex items-center space-x-1">
                      <Plus class="w-3 h-3" />
                      <span>{{ $t('After') }}</span>
                    </div>
                    <div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                      <code class="text-green-800 dark:text-green-300 text-sm break-all">
                        {{ formatValue(change.new) }}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Empty State -->
    <div v-if="logs.length === 0" class="text-center py-12">
      <FileSearch class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">{{ $t('No Logs Found') }}</h3>
      <p class="text-gray-500 dark:text-gray-400">{{ $t('No audit logs match your current filters.') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CalendarCheck,
  User,
  Globe,
  Monitor,
  CalendarX,
  ShieldOff,
  ShieldCheck,
  FileSearch,
  Clock,
  Plus,
  Minus,
  X,
  // Action icons
  Edit,
  Trash2,
  LogIn,
  LogOut,
  CreditCard,
  UserCheck,
  UserX,
  Shield,
  Settings
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { AuditLog } from '../../utils/models'

const { t,locale } = useI18n()



interface Props {
  logs: AuditLog[]
  expandedChanges: (string | number)[]
}

const props = defineProps<Props>()

const emit = defineEmits([
  'sort',
  'toggle-changes',
  'view-details',
  'export-single',
  'copy-log-id',
  'filter-by-user'
])

// Local state
const activeActionMenu = ref<string | null>(null)

// Methods
const toggleActionMenu = (logId: string) => {
  activeActionMenu.value = activeActionMenu.value === logId ? null : logId
}



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
  let description = log.description || t(`auditDescriptions.${log.action}`)

  if (log.entityType && log.entityId) {
    description += ` (${log.entityType} ID: ${log.entityId})`
  }

  return description
}

const formatFieldName = (field: string): string => {
  const fieldNames: Record<string, string> = {
    'first_name': t('First Name'),
    'last_name': t('Last Name'),
    'email': t('Email'),
    'phone': t('Phone'),
    'status': t('Status'),
    'role': t('Role'),
    'created_at': t('Created At'),
    'updated_at': t('Updated At')
  }

  return fieldNames[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

const getBrowserInfo = (userAgent: string): string => {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown Browser'
}


// watch(() => props.expandedChanges, (newVal) => {
//   console.log('=== DEBUG AuditLogsTable Props ===')
//   console.log('expandedChanges received:', newVal)
//   console.log('Type:', typeof newVal, 'Length:', newVal?.length)
// }, { immediate: true, deep: true })
</script>

<style scoped>
/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Scrollbar styles */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
