<template>
  <ChannelManagerLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('channelManager.connections.title') }}</h1>
          <p class="text-gray-600 mt-1">
            {{ t('channelManager.connections.subtitle') }}
          </p>
        </div>
        <BasicButton 
          variant="primary" 
          :icon="Plus" 
          :label="t('channelManager.connections.addConnection')" 
          @click="showAddConnectionModal = true"
        />
      </div>
      
      <!-- Connection Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ t('channelManager.connections.totalConnections') }}</h3>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{ connections.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Globe class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ t('channelManager.connections.activeConnections') }}</h3>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ activeConnections }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ t('channelManager.connections.syncStatus') }}</h3>
              <p class="text-sm font-medium mt-2" :class="lastSyncStatus === 'success' ? 'text-green-600' : 'text-red-600'">
                {{ t(`channelManager.connections.${lastSyncStatus}`) }}
              </p>
            </div>
            <div class="p-3 rounded-full" :class="lastSyncStatus === 'success' ? 'bg-green-100' : 'bg-red-100'">
              <RefreshCw class="h-6 w-6" :class="lastSyncStatus === 'success' ? 'text-green-600' : 'text-red-600'" />
            </div>
          </div>
        </div>
      </div>

      <!-- Connections List -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.connections.connectedChannels') }}</h2>
        </div>
        
        <div class="p-6" v-if="connections.length === 0">
          <div class="text-center py-12">
            <Globe class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('channelManager.connections.noConnections') }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ t('channelManager.connections.noConnectionsDescription') }}</p>
            <div class="mt-6">
              <BasicButton 
                variant="primary" 
                :icon="Plus" 
                :label="t('channelManager.connections.addFirstConnection')" 
                @click="showAddConnectionModal = true"
              />
            </div>
          </div>
        </div>
        
        <div v-else>
          <div class="divide-y divide-gray-200">
            <div v-for="connection in connections" :key="connection.id" class="p-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img :src="connection.logo" :alt="connection.name" class="h-10 w-10 rounded-lg" />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ connection.name }}</h3>
                    <p class="text-sm text-gray-500">{{ connection.description }}</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <div class="flex h-2 w-2 rounded-full" :class="connection.status === 'connected' ? 'bg-green-400' : 'bg-red-400'"></div>
                    <span class="text-sm font-medium" :class="connection.status === 'connected' ? 'text-green-600' : 'text-red-600'">
                      {{ t(`channelManager.connections.${connection.status}`) }}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <BasicButton 
                      variant="outline" 
                      size="sm" 
                      :icon="Settings" 
                      :label="t('channelManager.connections.configure')" 
                      @click="configureConnection(connection)"
                    />
                    <BasicButton 
                      variant="outline" 
                      size="sm" 
                      :icon="RefreshCw" 
                      :label="t('channelManager.connections.sync')" 
                      @click="syncConnection(connection)"
                      :disabled="connection.status !== 'connected'"
                    />
                    <BasicButton 
                      variant="danger" 
                      size="sm" 
                      :icon="Trash2" 
                      :label="t('channelManager.connections.disconnect')" 
                      @click="disconnectConnection(connection)"
                    />
                  </div>
                </div>
              </div>
              
              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">{{ t('channelManager.connections.lastSync') }}:</span>
                  <span class="ml-1 text-gray-900">{{ formatDate(connection.lastSync) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">{{ t('channelManager.connections.roomsSynced') }}:</span>
                  <span class="ml-1 text-gray-900">{{ connection.roomsSynced }}</span>
                </div>
                <div>
                  <span class="text-gray-500">{{ t('channelManager.connections.ratesSynced') }}:</span>
                  <span class="ml-1 text-gray-900">{{ connection.ratesSynced }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Connection Modal -->
    <AddConnectionModal 
      v-if="showAddConnectionModal" 
      @close="showAddConnectionModal = false" 
      @connection-added="handleConnectionAdded"
    />
  </ChannelManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '@/components/layout/ChannelManagerLayout.vue'

import {
  Plus,
  Globe,
  CheckCircle,
  RefreshCw,
  Settings,
  Trash2
} from 'lucide-vue-next'
import BasicButton from '../../../components/buttons/BasicButton.vue'

const { t } = useI18n()

// Reactive data
const showAddConnectionModal = ref(false)
const connections = ref([])
const lastSyncStatus = ref('success')

// Computed properties
const activeConnections = computed(() => {
  return connections.value.filter(conn => conn.status === 'connected').length
})

// Methods
const loadConnections = async () => {
  // TODO: Implement API call to load connections
  // For now, using mock data
  connections.value = [
    {
      id: 1,
      name: 'Booking.com',
      description: 'Connect to Booking.com to sync rates and availability',
      logo: '/images/channels/booking-com.png',
      status: 'connected',
      lastSync: new Date(),
      roomsSynced: 25,
      ratesSynced: 12
    },
    {
      id: 2,
      name: 'Expedia',
      description: 'Connect to Expedia to manage your property listings',
      logo: '/images/channels/expedia.png',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 86400000), // 1 day ago
      roomsSynced: 0,
      ratesSynced: 0
    }
  ]
}

const configureConnection = (connection) => {
  // TODO: Implement connection configuration
  console.log('Configure connection:', connection)
}

const syncConnection = async (connection) => {
  // TODO: Implement connection sync
  console.log('Sync connection:', connection)
}

const disconnectConnection = async (connection) => {
  // TODO: Implement connection disconnect
  if (confirm(t('channelManager.connections.confirmDisconnect', { name: connection.name }))) {
    console.log('Disconnect connection:', connection)
  }
}

const handleConnectionAdded = (newConnection) => {
  connections.value.push(newConnection)
  showAddConnectionModal.value = false
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Lifecycle
onMounted(() => {
  loadConnections()
})
</script>