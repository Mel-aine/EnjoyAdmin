<template>
  <ChannelManagerLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('channelManager.ratesInventory.title') }}</h1>
          <p class="text-gray-600 mt-1">
            {{ t('channelManager.ratesInventory.subtitle') }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <BasicButton 
            variant="outline" 
            :icon="RefreshCw" 
            :label="t('channelManager.ratesInventory.syncNow')" 
            @click="syncAllChannels"
            :disabled="isSyncing"
          />
          <BasicButton 
            variant="primary" 
            :icon="Save" 
            :label="isLoading ? t('Processing') + '...' : t('channelManager.ratesInventory.saveSettings')" 
            @click="saveSettings" 
            :disabled="isLoading"
          />
        </div>
      </div>
      
      <!-- Sync Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.ratesInventory.totalRooms') }}</h3>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ syncStats.totalRooms }}</p>
            </div>
            <Home class="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.ratesInventory.availableRooms') }}</h3>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ syncStats.availableRooms }}</p>
            </div>
            <CheckCircle class="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.ratesInventory.averageRate') }}</h3>
              <p class="text-2xl font-bold text-blue-600 mt-1">${{ syncStats.averageRate }}</p>
            </div>
            <DollarSign class="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ t('channelManager.ratesInventory.lastSync') }}</h3>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(syncStats.lastSync) }}</p>
            </div>
            <Clock class="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Channel Sync Settings -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.ratesInventory.channelSettings') }}</h2>
        </div>
        
        <div class="p-6">
          <div class="space-y-6">
            <div v-for="channel in channels" :key="channel.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <img :src="channel.logo" :alt="channel.name" class="h-8 w-8 rounded" />
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ channel.name }}</h3>
                    <p class="text-sm text-gray-500">{{ channel.description }}</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <div class="flex h-2 w-2 rounded-full" :class="channel.connected ? 'bg-green-400' : 'bg-red-400'"></div>
                  <span class="text-sm font-medium" :class="channel.connected ? 'text-green-600' : 'text-red-600'">
                    {{ channel.connected ? t('channelManager.ratesInventory.connected') : t('channelManager.ratesInventory.disconnected') }}
                  </span>
                </div>
              </div>
              
              <div v-if="channel.connected" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Rate Sync Settings -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('channelManager.ratesInventory.rateSync') }}</h4>
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input
                        v-model="channel.settings.autoSyncRates"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.ratesInventory.autoSyncRates') }}</span>
                    </label>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('channelManager.ratesInventory.rateSyncFrequency') }}
                      </label>
                      <Select
                        v-model="channel.settings.rateSyncFrequency"
                        :options="syncFrequencyOptions"
                        :disabled="!channel.settings.autoSyncRates"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('channelManager.ratesInventory.rateMarkup') }} (%)
                      </label>
                      <Input
                        v-model="channel.settings.rateMarkup"
                        type="number"
                        step="0.01"
                        :placeholder="t('channelManager.ratesInventory.rateMarkupPlaceholder')"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Inventory Sync Settings -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">{{ t('channelManager.ratesInventory.inventorySync') }}</h4>
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input
                        v-model="channel.settings.autoSyncInventory"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.ratesInventory.autoSyncInventory') }}</span>
                    </label>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('channelManager.ratesInventory.inventorySyncFrequency') }}
                      </label>
                      <Select
                        v-model="channel.settings.inventorySyncFrequency"
                        :options="syncFrequencyOptions"
                        :disabled="!channel.settings.autoSyncInventory"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('channelManager.ratesInventory.inventoryBuffer') }}
                      </label>
                      <Input
                        v-model="channel.settings.inventoryBuffer"
                        type="number"
                        min="0"
                        :placeholder="t('channelManager.ratesInventory.inventoryBufferPlaceholder')"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="channel.connected" class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-600">
                    {{ t('channelManager.ratesInventory.lastSyncTime') }}: {{ formatDate(channel.lastSync) }}
                  </div>
                  <BasicButton 
                    variant="outline" 
                    size="sm" 
                    :icon="RefreshCw" 
                    :label="t('channelManager.ratesInventory.syncChannel')" 
                    @click="syncChannel(channel)"
                    :disabled="isSyncing"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rate Calendar -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.ratesInventory.rateCalendar') }}</h2>
            <div class="flex items-center space-x-3">
              <Select
                v-model="selectedRoomType"
                :options="roomTypeOptions"
                :placeholder="t('channelManager.ratesInventory.selectRoomType')"
              />
              <Select
                v-model="selectedChannel"
                :options="channelFilterOptions"
                :placeholder="t('channelManager.ratesInventory.selectChannel')"
              />
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('channelManager.ratesInventory.date') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('channelManager.ratesInventory.pmsRate') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('channelManager.ratesInventory.channelRate') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('channelManager.ratesInventory.availability') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('channelManager.ratesInventory.status') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="rate in rateCalendar" :key="rate.date" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ formatDate(rate.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ rate.pmsRate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ rate.channelRate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ rate.availability }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(rate.syncStatus)">
                      {{ t(`channelManager.ratesInventory.${rate.syncStatus}`) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </ChannelManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '@/components/layout/ChannelManagerLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import {
  Save,
  RefreshCw,
  Home,
  CheckCircle,
  DollarSign,
  Clock
} from 'lucide-vue-next'

const { t } = useI18n()

// Reactive data
const isLoading = ref(false)
const isSyncing = ref(false)
const selectedRoomType = ref('')
const selectedChannel = ref('')

const syncStats = ref({
  totalRooms: 45,
  availableRooms: 32,
  averageRate: 125.50,
  lastSync: new Date()
})

const channels = ref([
  {
    id: 1,
    name: 'Booking.com',
    description: 'Leading online travel agency',
    logo: '/images/channels/booking-com.png',
    connected: true,
    lastSync: new Date(),
    settings: {
      autoSyncRates: true,
      rateSyncFrequency: 'hourly',
      rateMarkup: 5.0,
      autoSyncInventory: true,
      inventorySyncFrequency: 'real-time',
      inventoryBuffer: 2
    }
  },
  {
    id: 2,
    name: 'Expedia',
    description: 'Global travel technology company',
    logo: '/images/channels/expedia.png',
    connected: true,
    lastSync: new Date(Date.now() - 3600000), // 1 hour ago
    settings: {
      autoSyncRates: false,
      rateSyncFrequency: 'daily',
      rateMarkup: 3.0,
      autoSyncInventory: true,
      inventorySyncFrequency: 'hourly',
      inventoryBuffer: 1
    }
  }
])

const rateCalendar = ref([
  {
    date: new Date(),
    pmsRate: 120.00,
    channelRate: 126.00,
    availability: 5,
    syncStatus: 'synced'
  },
  {
    date: new Date(Date.now() + 86400000),
    pmsRate: 135.00,
    channelRate: 141.75,
    availability: 3,
    syncStatus: 'pending'
  },
  {
    date: new Date(Date.now() + 172800000),
    pmsRate: 150.00,
    channelRate: 157.50,
    availability: 0,
    syncStatus: 'error'
  }
])

// Options
const syncFrequencyOptions = ref([
  { value: 'real-time', label: 'Real-time' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'manual', label: 'Manual' }
])

const roomTypeOptions = ref([
  { value: 'all', label: 'All Room Types' },
  { value: 'standard-single', label: 'Standard Single' },
  { value: 'standard-double', label: 'Standard Double' },
  { value: 'deluxe-suite', label: 'Deluxe Suite' }
])

const channelFilterOptions = ref([
  { value: 'all', label: 'All Channels' },
  { value: 'booking-com', label: 'Booking.com' },
  { value: 'expedia', label: 'Expedia' }
])

// Methods
const syncAllChannels = async () => {
  isSyncing.value = true
  try {
    // TODO: Implement sync all channels
    await new Promise(resolve => setTimeout(resolve, 2000))
    syncStats.value.lastSync = new Date()
  } catch (error) {
    console.error('Error syncing channels:', error)
  } finally {
    isSyncing.value = false
  }
}

const syncChannel = async (channel) => {
  isSyncing.value = true
  try {
    // TODO: Implement single channel sync
    await new Promise(resolve => setTimeout(resolve, 1000))
    channel.lastSync = new Date()
  } catch (error) {
    console.error('Error syncing channel:', error)
  } finally {
    isSyncing.value = false
  }
}

const saveSettings = async () => {
  isLoading.value = true
  try {
    // TODO: Implement save settings API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Show success message
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    isLoading.value = false
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'synced':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

// Lifecycle
onMounted(() => {
  // Load initial data
})
</script>