<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center space-x-2">
        <Filter class="w-4 h-4 text-gray-500" />
        <span class="text-sm font-medium text-gray-700">{{ $t('Filters') }}:</span>
      </div>

      <!-- Action Filter -->
      <select
        v-model="selectedAction"
        @change="applyFilters"
        class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">{{ $t('All Actions') }}</option>
        <option value="create">{{ $t('Create') }}</option>
        <option value="update">{{ $t('Update') }}</option>
        <option value="delete">{{ $t('Delete') }}</option>
        <option value="login">{{ $t('Login') }}</option>
        <option value="logout">{{ $t('Logout') }}</option>
        <option value="check-in">{{ $t('Check In') }}</option>
        <option value="check-out">{{ $t('Check Out') }}</option>
        <option value="payment">{{ $t('Payment') }}</option>
      </select>

      <!-- Date Filter -->
      <input
        v-model="selectedDate"
        @change="applyFilters"
        type="date"
        class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <!-- User Filter -->
      <select
        v-model="selectedUser"
        @change="applyFilters"
        class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">{{ $t('All Users') }}</option>
        <option v-for="user in uniqueUsers" :key="user" :value="user">
          {{ user }}
        </option>
      </select>

      <!-- Clear Filters -->
      <button
        @click="clearFilters"
        class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition"
      >
        {{ $t('Clear') }}
      </button>
    </div>

    <!-- Audit Logs Timeline -->
    <div class="overflow-hidden">
      <div class="space-y-4">
        <div
          v-for="(log, index) in filteredLogs"
          :key="log.id"
          class="relative flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <!-- Timeline Line -->
          <div v-if="index < filteredLogs.length - 1" class="absolute left-8 top-16 w-0.5 h-full bg-gray-200"></div>

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
                    class="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ChevronDown
                      :class="[
                        'w-4 h-4 transition-transform',
                        expandedChanges.includes(log.id) ? 'rotate-180' : ''
                      ]"
                    />
                    <span>{{ $t('View Changes') }} ({{ Object.keys(log.changes).length }})</span>
                  </button>

                  <div
                    v-if="expandedChanges.includes(log.id)"
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
                          <code class="bg-red-50 text-red-700 px-2 py-1 rounded">{{ change.from || 'null' }}</code>
                        </div>
                        <ArrowRight class="w-3 h-3 text-gray-400" />
                        <div class="flex items-center space-x-1">
                          <span class="text-green-600">{{ $t('To') }}:</span>
                          <code class="bg-green-50 text-green-700 px-2 py-1 rounded">{{ change.to || 'null' }}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Metadata -->
                <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div class="flex items-center space-x-1">
                    <User class="w-3 h-3" />
                    <span>{{ log.userName || log.userId }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <Monitor class="w-3 h-3" />
                    <span>{{ log.ipAddress || 'Unknown IP' }}</span>
                  </div>
                  <div v-if="log.userAgent" class="flex items-center space-x-1">
                    <Smartphone class="w-3 h-3" />
                    <span>{{ getBrowserInfo(log.userAgent) }}</span>
                  </div>
                  <div v-if="log.sessionId" class="flex items-center space-x-1">
                    <Key class="w-3 h-3" />
                    <span>{{ log.sessionId.substring(0, 8) }}...</span>
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
                <div class="text-xs text-gray-400 mt-1">
                  {{ getRelativeTime(log.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredLogs.length === 0" class="text-center py-12">
        <FileSearch class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('No Audit Logs Found') }}</h3>
        <p class="text-gray-500">
          {{ selectedAction || selectedDate || selectedUser
            ? $t('No logs match the selected filters.')
            : $t('No audit trail available for this guest.')
          }}
        </p>
      </div>

      <!-- Load More -->
      <div v-if="hasMore && filteredLogs.length > 0" class="text-center py-4">
        <button
          @click="loadMore"
          :disabled="loading"
          class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <span v-if="loading">{{ $t('Loading...') }}</span>
          <span v-else>{{ $t('Load More') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue'
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
  Settings
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
interface AuditLog {
  id: string
  action: string
  description: string
  changes?: Record<string, { from: any; to: any }>
  timestamp: string
  userId: string
  userName?: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  entityId?: string
  entityType?: string
}

interface Props {
  auditLogs: AuditLog[]
  loading?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: false
})

// Reactive references
const selectedAction = ref('')
const selectedDate = ref('')
const selectedUser = ref('')
const expandedChanges = ref<string[]>([])

// Computed properties
const uniqueUsers = computed(() => {
  const users = new Set<string>()
  props.auditLogs.forEach(log => {
    if (log.userName) users.add(log.userName)
    else if (log.userId) users.add(log.userId)
  })
  return Array.from(users).sort()
})

const filteredLogs = computed(() => {
  let filtered = [...props.auditLogs]

  if (selectedAction.value) {
    filtered = filtered.filter(log => log.action === selectedAction.value)
  }

  if (selectedDate.value) {
    const selectedDateObj = new Date(selectedDate.value)
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate.toDateString() === selectedDateObj.toDateString()
    })
  }

  if (selectedUser.value) {
    filtered = filtered.filter(log =>
      log.userName === selectedUser.value || log.userId === selectedUser.value
    )
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// Methods
const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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

const getRelativeTime = (timestamp: string): string => {
  const now = new Date()
  const logTime = new Date(timestamp)
  const diffMs = now.getTime() - logTime.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) {
    return t('Just now')
  } else if (diffMins < 60) {
    return t('{minutes} minutes ago', { minutes: diffMins })
  } else if (diffHours < 24) {
    return t('{hours} hours ago', { hours: diffHours })
  } else {
    return t('{days} days ago', { days: diffDays })
  }
}

const formatDescription = (log: AuditLog): string => {
  const baseDescription = log.description || t(`auditDescriptions.${log.action}`)

  // Add context if available
  if (log.entityType && log.entityId) {
    return `${baseDescription} (${log.entityType} ID: ${log.entityId})`
  }

  return baseDescription
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'create':
      return Plus
    case 'update':
      return Edit
    case 'delete':
      return Trash2
    case 'login':
      return LogIn
    case 'logout':
      return LogOut
    case 'check-in':
      return UserCheck
    case 'check-out':
      return UserX
    case 'payment':
      return CreditCard
    case 'access':
      return Shield
    default:
      return Settings
  }
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'create':
      return 'bg-green-500'
    case 'update':
      return 'bg-blue-500'
    case 'delete':
      return 'bg-red-500'
    case 'login':
      return 'bg-emerald-500'
    case 'logout':
      return 'bg-orange-500'
    case 'check-in':
      return 'bg-teal-500'
    case 'check-out':
      return 'bg-purple-500'
    case 'payment':
      return 'bg-yellow-500'
    case 'access':
      return 'bg-indigo-500'
    default:
      return 'bg-gray-500'
  }
}

const getActionBadgeColor = (action: string): string => {
  switch (action) {
    case 'create':
      return 'bg-green-100 text-green-800'
    case 'update':
      return 'bg-blue-100 text-blue-800'
    case 'delete':
      return 'bg-red-100 text-red-800'
    case 'login':
      return 'bg-emerald-100 text-emerald-800'
    case 'logout':
      return 'bg-orange-100 text-orange-800'
    case 'check-in':
      return 'bg-teal-100 text-teal-800'
    case 'check-out':
      return 'bg-purple-100 text-purple-800'
    case 'payment':
      return 'bg-yellow-100 text-yellow-800'
    case 'access':
      return 'bg-indigo-100 text-indigo-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getBrowserInfo = (userAgent: string): string => {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown Browser'
}

const toggleChanges = (logId: string) => {
  const index = expandedChanges.value.indexOf(logId)
  if (index > -1) {
    expandedChanges.value.splice(index, 1)
  } else {
    expandedChanges.value.push(logId)
  }
}

const applyFilters = () => {
  // Filters are applied automatically through computed property
  console.log('Filters applied')
}

const clearFilters = () => {
  selectedAction.value = ''
  selectedDate.value = ''
  selectedUser.value = ''
}

const loadMore = () => {
  // Emit event to parent to load more logs
  console.log('Load more logs')
}
</script>
