<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.audit.userActivityLog') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.audit.userActivityLogDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.user') }}
            </label>
            <select
              v-model="filters.user"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option v-for="user in uniqueUsers" :key="user" :value="user">
                {{ user }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.action') }}
            </label>
            <select
              v-model="filters.action"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="login">{{ $t('common.login') }}</option>
              <option value="logout">{{ $t('common.logout') }}</option>
              <option value="create">{{ $t('common.create') }}</option>
              <option value="update">{{ $t('common.update') }}</option>
              <option value="delete">{{ $t('common.delete') }}</option>
              <option value="view">{{ $t('common.view') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.module') }}
            </label>
            <select
              v-model="filters.module"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="reservations">{{ $t('common.reservations') }}</option>
              <option value="guests">{{ $t('common.guests') }}</option>
              <option value="rooms">{{ $t('common.rooms') }}</option>
              <option value="billing">{{ $t('common.billing') }}</option>
              <option value="reports">{{ $t('common.reports') }}</option>
              <option value="settings">{{ $t('common.settings') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalActivities') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalActivities.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.activeUsers') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.activeUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.securityEvents') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.securityEvents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgSessionTime') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.avgSessionTime }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.activityByAction') }}
          </h3>
          <div class="space-y-4">
            <div v-for="action in actionBreakdown" :key="action.action" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: action.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${action.action}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ action.count.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ action.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.activityByModule') }}
          </h3>
          <div class="space-y-3">
            <div v-for="module in moduleBreakdown" :key="module.module" class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`common.${module.module}`) }}</span>
              <div class="flex items-center">
                <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div class="bg-blue-600 h-2 rounded-full" :style="{ width: module.percentage + '%' }"></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ module.count.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Activity Log Table -->
      <ReusableTable
        :title="$t('reports.userActivityLog')"
        :columns="tableColumns"
        :data="filteredActivities"
        :actions="tableActions"
        :searchable="true"
        :empty-message="$t('reports.noActivitiesFound')"
      />
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Action, Column } from '../../../utils/models'

const { t } = useI18n()
const router = useRouter()

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  user: '',
  action: '',
  module: ''
})

// Mock data
const activities = ref([
  {
    id: 1,
    timestamp: '2024-01-15T09:30:00Z',
    user: 'John Smith',
    action: 'login',
    module: 'system',
    description: 'reports.audit.userActivity.loggedIn',
    ipAddress: '192.168.1.100',
    status: 'success'
  },
  {
    id: 2,
    timestamp: '2024-01-15T09:35:00Z',
    user: 'John Smith',
    action: 'view',
    module: 'reservations',
    description: 'reports.audit.userActivity.viewedReservation',
    ipAddress: '192.168.1.100',
    status: 'success'
  },
  {
    id: 3,
    timestamp: '2024-01-15T09:40:00Z',
    user: 'Jane Doe',
    action: 'create',
    module: 'guests',
    description: 'reports.audit.userActivity.createdGuestProfile',
    ipAddress: '192.168.1.101',
    status: 'success'
  },
  {
    id: 4,
    timestamp: '2024-01-15T09:45:00Z',
    user: 'Mike Wilson',
    action: 'update',
    module: 'rooms',
    description: 'reports.audit.userActivity.updatedRoomStatus',
    ipAddress: '192.168.1.102',
    status: 'success'
  },
  {
    id: 5,
    timestamp: '2024-01-15T09:50:00Z',
    user: 'Sarah Brown',
    action: 'delete',
    module: 'billing',
    description: 'reports.audit.userActivity.attemptedDeleteInvoice',
    ipAddress: '192.168.1.103',
    status: 'failed'
  },
  {
    id: 6,
    timestamp: '2024-01-15T10:00:00Z',
    user: 'Admin User',
    action: 'view',
    module: 'reports',
    description: 'reports.audit.userActivity.generatedReport',
    ipAddress: '192.168.1.1',
    status: 'success'
  },
  {
    id: 7,
    timestamp: '2024-01-15T10:15:00Z',
    user: 'John Smith',
    action: 'logout',
    module: 'system',
    description: 'reports.audit.userActivity.loggedOut',
    ipAddress: '192.168.1.100',
    status: 'success'
  },
  {
    id: 8,
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Guest User',
    action: 'login',
    module: 'system',
    description: 'reports.audit.userActivity.failedLogin',
    ipAddress: '192.168.1.200',
    status: 'failed'
  }
])

// Computed properties
const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const activityDate = activity.timestamp.split('T')[0]
    const matchesDateFrom = !filters.value.dateFrom || activityDate >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || activityDate <= filters.value.dateTo
    const matchesUser = !filters.value.user || activity.user === filters.value.user
    const matchesAction = !filters.value.action || activity.action === filters.value.action
    const matchesModule = !filters.value.module || activity.module === filters.value.module
    
    return matchesDateFrom && matchesDateTo && matchesUser && matchesAction && matchesModule
  })
})

const uniqueUsers = computed(() => {
  return [...new Set(activities.value.map(a => a.user))].sort()
})

const summary = computed(() => {
  const filtered = filteredActivities.value
  const uniqueUsersCount = new Set(filtered.map(a => a.user)).size
  const securityEvents = filtered.filter(a => a.status === 'failed' || a.action === 'login' || a.action === 'logout').length
  
  return {
    totalActivities: filtered.length,
    activeUsers: uniqueUsersCount,
    securityEvents,
    avgSessionTime: '2h 15m'
  }
})

const actionBreakdown = computed(() => {
  const actions = [
    { action: 'login', color: '#10B981' },
    { action: 'logout', color: '#6B7280' },
    { action: 'view', color: '#3B82F6' },
    { action: 'create', color: '#8B5CF6' },
    { action: 'update', color: '#F59E0B' },
    { action: 'delete', color: '#EF4444' }
  ]
  const total = filteredActivities.value.length
  
  return actions.map(action => {
    const count = filteredActivities.value.filter(a => a.action === action.action).length
    return {
      ...action,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }
  }).filter(action => action.count > 0)
})

const moduleBreakdown = computed(() => {
  const modules = ['system', 'reservations', 'guests', 'rooms', 'billing', 'reports', 'settings']
  const moduleCounts = modules.map(module => {
    const count = filteredActivities.value.filter(a => a.module === module).length
    return { module, count }
  }).filter(m => m.count > 0).sort((a, b) => b.count - a.count)
  
  const maxCount = moduleCounts[0]?.count || 1
  return moduleCounts.map(module => ({
    ...module,
    percentage: (module.count / maxCount) * 100
  }))
})

// Methods
const formatDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

const getActionClass = (action: string) => {
  switch (action) {
    case 'login':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'logout':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    case 'view':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'create':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'update':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'delete':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'timestamp', label: t('common.timestamp'), type: 'date' },
  { key: 'user', label: t('common.user'), type: 'text' },
  { 
    key: 'action', 
    label: t('common.action'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'login': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'logout': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      'create': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      'update': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'delete': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      'view': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  },
  { key: 'module', label: t('common.module'), type: 'text', translatable: true },
  { key: 'description', label: t('common.description'), type: 'text', translatable: true },
  { key: 'ipAddress', label: t('common.ipAddress'), type: 'text' },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'success': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      'warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    }
  }
])

const tableActions = computed<Action[]>(() => [
  {
    label: t('common.viewDetails'),
    handler: (item: any) => viewActivityDetails(item.id),
    variant: 'primary'
  }
])

const viewActivityDetails = (activityId: string) => {
  // Navigate to activity details or open modal
  console.log('View activity details:', activityId)
}
</script>