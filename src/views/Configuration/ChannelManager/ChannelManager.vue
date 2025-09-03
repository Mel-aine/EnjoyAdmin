<template>
  <ChannelManagerLayout>
    <div class="p-6">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ t('configuration.channelManager.title') }}</h1>
          <p class="text-gray-600 mt-2">
            {{ t('configuration.channelManager.subtitle') }}
          </p>
        </div>
        <div class="flex gap-3">
          <BasicButton 
            variant="secondary" 
            :icon="RefreshCw" 
            :label="t('configuration.channelManager.common.refresh')" 
            @click="refreshData" 
            :disabled="isLoading"
          />
          <BasicButton 
            variant="primary" 
            :icon="Database" 
            :label="isMigrating ? t('configuration.channelManager.common.migrating') + '...' : t('configuration.channelManager.migrateHotelData')" 
            @click="migrateHotelData" 
            :disabled="isMigrating || isLoading"
            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <Globe class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ t('configuration.channelManager.connections.activeConnections') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeConnections }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ t('configuration.channelManager.mapping.roomsMapped') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.roomsMapped }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100">
              <Clock class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ t('configuration.channelManager.syncSettings.lastSync') }}</p>
              <p class="text-sm font-bold text-gray-900">{{ formatDate(stats.lastSync) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <TrendingUp class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ t('configuration.channelManager.ratesInventory.syncStatus') }}</p>
              <p class="text-sm font-bold text-gray-900">{{ stats.syncStatus }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">{{ t('configuration.channelManager.quickActions') }}</h2>
          <p class="text-gray-600 mt-1">{{ t('configuration.channelManager.quickActionsSubtitle') }}</p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <router-link 
              to="/configuration/channel-manager/connections" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <Globe class="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ t('configuration.channelManager.connections.title') }}</h3>
                <p class="text-sm text-gray-600">{{ t('configuration.channelManager.connections.subtitle') }}</p>
              </div>
            </router-link>
            
            <router-link 
              to="/configuration/channel-manager/mapping" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <MapPin class="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ t('configuration.channelManager.mapping.title') }}</h3>
                <p class="text-sm text-gray-600">{{ t('configuration.channelManager.mapping.subtitle') }}</p>
              </div>
            </router-link>
            
            <router-link 
              to="/configuration/channel-manager/rates-inventory" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <DollarSign class="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ t('configuration.channelManager.ratesInventory.title') }}</h3>
                <p class="text-sm text-gray-600">{{ t('configuration.channelManager.ratesInventory.subtitle') }}</p>
              </div>
            </router-link>
            
            <router-link 
              to="/configuration/channel-manager/sync-settings" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <Settings class="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ t('configuration.channelManager.syncSettings.title') }}</h3>
                <p class="text-sm text-gray-600">{{ t('configuration.channelManager.syncSettings.subtitle') }}</p>
              </div>
            </router-link>
            
            <router-link 
              to="/configuration/channel-manager/logs" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <FileText class="h-8 w-8 text-gray-600 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ t('configuration.channelManager.logs.title') }}</h3>
                <p class="text-sm text-gray-600">{{ t('configuration.channelManager.logs.subtitle') }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">{{ t('configuration.channelManager.recentActivity') }}</h2>
        </div>
        <div class="p-6">
          <div v-if="recentActivity.length === 0" class="text-center py-8">
            <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600">{{ t('configuration.channelManager.noRecentActivity') }}</p>
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id" 
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center">
                <div class="p-2 rounded-full" :class="getActivityIconClass(activity.type)">
                  <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
                </div>
                <div class="ml-4">
                  <p class="font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-600">{{ activity.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">{{ formatDate(activity.timestamp) }}</p>
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(activity.status)"
                >
                  {{ activity.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ChannelManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ChannelManagerLayout from '@/components/layout/ChannelManagerLayout.vue'
import { 
  Globe, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Settings, 
  FileText, 
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle2
} from 'lucide-vue-next'
import * as channelManagerApi from '@/services/channelManagerApi'
import BasicButton from '../../../components/buttons/BasicButton.vue'

const { t } = useI18n()
const toast = useToast()

// Reactive data
const isLoading = ref(false)
const isMigrating = ref(false)
const stats = ref({
  activeConnections: 0,
  roomsMapped: 0,
  lastSync: null,
  syncStatus: 'Idle'
})
const recentActivity = ref([])

// Methods
const refreshData = async () => {
  isLoading.value = true
  try {
    // Load dashboard stats
    const [connectionsData, mappingData, logsData] = await Promise.all([
      channelManagerApi.getConnections(),
      channelManagerApi.getMappings(),
      channelManagerApi.getLogs({ limit: 5 })
    ])
    
    stats.value = {
      activeConnections: connectionsData.filter(c => c.status === 'active').length,
      roomsMapped: mappingData.roomMappings?.length || 0,
      lastSync: connectionsData[0]?.lastSync || null,
      syncStatus: connectionsData.some(c => c.syncing) ? 'Syncing' : 'Idle'
    }
    
    recentActivity.value = logsData.map(log => ({
      id: log.id,
      title: log.action,
      description: log.message,
      timestamp: log.timestamp,
      status: log.status,
      type: log.type
    }))
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    toast.error(t('configuration.channelManager.common.error'))
  } finally {
    isLoading.value = false
  }
}

const migrateHotelData = async () => {
  isMigrating.value = true
  try {
    await channelManagerApi.migrateCompleteHotel()
    toast.success(t('configuration.channelManager.migrationSuccess'))
    // Refresh data after migration
    await refreshData()
  } catch (error) {
    console.error('Error migrating hotel data:', error)
    toast.error(t('configuration.channelManager.migrationError'))
  } finally {
    isMigrating.value = false
  }
}

const formatDate = (date) => {
  if (!date) return t('configuration.channelManager.common.never')
  return new Date(date).toLocaleDateString()
}

const getActivityIcon = (type) => {
  const icons = {
    sync: RefreshCw,
    connection: Globe,
    mapping: MapPin,
    error: AlertCircle,
    success: CheckCircle2
  }
  return icons[type] || FileText
}

const getActivityIconClass = (type) => {
  const classes = {
    sync: 'bg-blue-100 text-blue-600',
    connection: 'bg-green-100 text-green-600',
    mapping: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    success: 'bg-green-100 text-green-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getStatusClass = (status) => {
  const classes = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>