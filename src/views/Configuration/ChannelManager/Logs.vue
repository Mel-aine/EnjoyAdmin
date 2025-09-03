<template>
  <ChannelManagerLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('channelManager.logs.title') }}</h1>
          <p class="text-gray-600 mt-1">
            {{ t('channelManager.logs.subtitle') }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <BasicButton 
            variant="outline" 
            :icon="Download" 
            :label="t('channelManager.logs.exportLogs')" 
            @click="exportLogs"
          />
          <BasicButton 
            variant="outline" 
            :icon="RefreshCw" 
            :label="t('channelManager.logs.refresh')" 
            @click="refreshLogs"
            :disabled="isLoading"
          />
        </div>
      </div>
      
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('channelManager.logs.dateRange') }}
              </label>
              <Select
                v-model="filters.dateRange"
                :options="dateRangeOptions"
                @change="applyFilters"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('channelManager.logs.channel') }}
              </label>
              <Select
                v-model="filters.channel"
                :options="channelOptions"
                @change="applyFilters"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('channelManager.logs.logLevel') }}
              </label>
              <Select
                v-model="filters.logLevel"
                :options="logLevelOptions"
                @change="applyFilters"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('channelManager.logs.operation') }}
              </label>
              <Select
                v-model="filters.operation"
                :options="operationOptions"
                @change="applyFilters"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('channelManager.logs.search') }}
              </label>
              <Input
                v-model="filters.search"
                :placeholder="t('channelManager.logs.searchPlaceholder')"
                :icon="Search"
                @input="debounceSearch"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Log Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.logs.totalLogs') }}</h3>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ logStats.total }}</p>
            </div>
            <FileText class="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.logs.successfulSyncs') }}</h3>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ logStats.successful }}</p>
            </div>
            <CheckCircle class="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.logs.errors') }}</h3>
              <p class="text-2xl font-bold text-red-600 mt-1">{{ logStats.errors }}</p>
            </div>
            <AlertCircle class="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.logs.warnings') }}</h3>
              <p class="text-2xl font-bold text-yellow-600 mt-1">{{ logStats.warnings }}</p>
            </div>
            <AlertTriangle class="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.logs.recentActivity') }}</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">{{ t('channelManager.logs.autoRefresh') }}</span>
              <label class="flex items-center">
                <input
                  v-model="autoRefresh"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </label>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('channelManager.logs.timestamp') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('channelManager.logs.level') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('channelManager.logs.channel') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('channelManager.logs.operation') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('channelManager.logs.message') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('channelManager.logs.duration') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('channelManager.logs.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading" class="animate-pulse">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  {{ t('channelManager.logs.loading') }}
                </td>
              </tr>
              
              <tr v-else-if="filteredLogs.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <FileText class="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>{{ t('channelManager.logs.noLogs') }}</p>
                </td>
              </tr>
              
              <tr v-else v-for="log in paginatedLogs" :key="log.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatTimestamp(log.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getLevelClass(log.level)">
                    {{ t(`channelManager.logs.${log.level}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <img :src="log.channelLogo" :alt="log.channel" class="h-6 w-6 rounded" />
                    <span class="text-sm text-gray-900">{{ log.channel }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ t(`channelManager.logs.operations.${log.operation}`) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  <span :title="log.message">{{ log.message }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ log.duration ? `${log.duration}ms` : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewLogDetails(log)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    {{ t('channelManager.logs.viewDetails') }}
                  </button>
                  <button
                    v-if="log.level === 'error'"
                    @click="retryOperation(log)"
                    class="text-green-600 hover:text-green-900"
                  >
                    {{ t('channelManager.logs.retry') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              {{ t('channelManager.logs.showing') }} {{ (currentPage - 1) * pageSize + 1 }} {{ t('channelManager.logs.to') }} 
              {{ Math.min(currentPage * pageSize, filteredLogs.length) }} {{ t('channelManager.logs.of') }} 
              {{ filteredLogs.length }} {{ t('channelManager.logs.results') }}
            </div>
            <div class="flex items-center space-x-2">
              <BasicButton
                variant="outline"
                size="sm"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                {{ t('channelManager.logs.previous') }}
              </BasicButton>
              <span class="text-sm text-gray-700">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <BasicButton
                variant="outline"
                size="sm"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                {{ t('channelManager.logs.next') }}
              </BasicButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <Modal v-if="selectedLog" @close="selectedLog = null">
      <template #body>
        <div class="p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ t('channelManager.logs.logDetails') }}</h3>
          <button @click="selectedLog = null" class="text-gray-400 hover:text-gray-600">
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('channelManager.logs.timestamp') }}</label>
              <p class="text-sm text-gray-900">{{ formatTimestamp(selectedLog.timestamp) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('channelManager.logs.level') }}</label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getLevelClass(selectedLog.level)">
                {{ t(`channelManager.logs.${selectedLog.level}`) }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('channelManager.logs.channel') }}</label>
              <p class="text-sm text-gray-900">{{ selectedLog.channel }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('channelManager.logs.operation') }}</label>
              <p class="text-sm text-gray-900">{{ t(`channelManager.logs.operations.${selectedLog.operation}`) }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('channelManager.logs.message') }}</label>
            <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded">{{ selectedLog.message }}</p>
          </div>
          
          <div v-if="selectedLog.details">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('channelManager.logs.details') }}</label>
            <pre class="text-xs text-gray-900 bg-gray-50 p-3 rounded overflow-x-auto">{{ JSON.stringify(selectedLog.details, null, 2) }}</pre>
          </div>
          
          <div v-if="selectedLog.stackTrace">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('channelManager.logs.stackTrace') }}</label>
            <pre class="text-xs text-gray-900 bg-red-50 p-3 rounded overflow-x-auto">{{ selectedLog.stackTrace }}</pre>
          </div>
        </div>
        </div>
      </template>
    </Modal>
  </ChannelManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '@/components/layout/ChannelManagerLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Modal from '@/components/profile/Modal.vue'
import {
  Download,
  RefreshCw,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-vue-next'

const { t } = useI18n()

// Reactive data
const isLoading = ref(false)
const autoRefresh = ref(false)
const selectedLog = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
let refreshInterval = null

const filters = ref({
  dateRange: 'today',
  channel: 'all',
  logLevel: 'all',
  operation: 'all',
  search: ''
})

const logStats = ref({
  total: 1247,
  successful: 1156,
  errors: 23,
  warnings: 68
})

const logs = ref([
  {
    id: 1,
    timestamp: new Date(),
    level: 'info',
    channel: 'Booking.com',
    channelLogo: '/images/channels/booking-com.png',
    operation: 'rate_sync',
    message: 'Successfully synchronized rates for 15 room types',
    duration: 1250,
    details: {
      roomTypes: 15,
      ratesUpdated: 45,
      errors: 0
    }
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 300000),
    level: 'error',
    channel: 'Expedia',
    channelLogo: '/images/channels/expedia.png',
    operation: 'inventory_sync',
    message: 'Failed to update inventory: Connection timeout',
    duration: 30000,
    details: {
      error: 'TIMEOUT',
      retryAttempt: 3
    },
    stackTrace: 'Error: Connection timeout\n    at ChannelManager.syncInventory()\n    at async SyncService.run()'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 600000),
    level: 'warning',
    channel: 'Booking.com',
    channelLogo: '/images/channels/booking-com.png',
    operation: 'reservation_sync',
    message: 'Duplicate reservation detected and skipped',
    duration: 850,
    details: {
      reservationId: 'BK123456',
      guestName: 'John Doe',
      checkIn: '2024-01-15'
    }
  }
])

// Options
const dateRangeOptions = ref([
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'last-30-days', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' }
])

const channelOptions = ref([
  { value: 'all', label: 'All Channels' },
  { value: 'booking-com', label: 'Booking.com' },
  { value: 'expedia', label: 'Expedia' },
  { value: 'airbnb', label: 'Airbnb' }
])

const logLevelOptions = ref([
  { value: 'all', label: 'All Levels' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' }
])

const operationOptions = ref([
  { value: 'all', label: 'All Operations' },
  { value: 'rate_sync', label: 'Rate Sync' },
  { value: 'inventory_sync', label: 'Inventory Sync' },
  { value: 'reservation_sync', label: 'Reservation Sync' },
  { value: 'connection_test', label: 'Connection Test' }
])

// Computed
const filteredLogs = computed(() => {
  let filtered = logs.value
  
  if (filters.value.channel !== 'all') {
    filtered = filtered.filter(log => log.channel.toLowerCase().includes(filters.value.channel.replace('-', '.')))
  }
  
  if (filters.value.logLevel !== 'all') {
    filtered = filtered.filter(log => log.level === filters.value.logLevel)
  }
  
  if (filters.value.operation !== 'all') {
    filtered = filtered.filter(log => log.operation === filters.value.operation)
  }
  
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(log => 
      log.message.toLowerCase().includes(searchTerm) ||
      log.channel.toLowerCase().includes(searchTerm)
    )
  }
  
  return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / pageSize.value))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// Methods
const refreshLogs = async () => {
  isLoading.value = true
  try {
    // TODO: Implement refresh logs API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Error refreshing logs:', error)
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const debounceSearch = (() => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      applyFilters()
    }, 300)
  }
})()

const exportLogs = () => {
  // TODO: Implement export logs functionality
  console.log('Exporting logs...')
}

const viewLogDetails = (log) => {
  selectedLog.value = log
}

const retryOperation = async (log) => {
  try {
    // TODO: Implement retry operation
    console.log('Retrying operation:', log.operation)
  } catch (error) {
    console.error('Error retrying operation:', error)
  }
}

const getLevelClass = (level) => {
  switch (level) {
    case 'info':
      return 'bg-blue-100 text-blue-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatTimestamp = (timestamp) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(timestamp))
}

// Auto-refresh functionality
const startAutoRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval)
  refreshInterval = setInterval(refreshLogs, 30000) // Refresh every 30 seconds
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// Watch auto-refresh toggle
const watchAutoRefresh = () => {
  if (autoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

// Lifecycle
onMounted(() => {
  refreshLogs()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>