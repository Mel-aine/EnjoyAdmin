<template>
  <ChannelManagerLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('channelManager.syncSettings.title') }}</h1>
          <p class="text-gray-600 mt-1">
            {{ t('channelManager.syncSettings.subtitle') }}
          </p>
        </div>
        <BasicButton 
          variant="primary" 
          :icon="Save" 
          :label="isLoading ? t('Processing') + '...' : t('channelManager.syncSettings.saveSettings')" 
          @click="saveSettings" 
          :disabled="isLoading"
        />
      </div>
      
      <!-- Global Sync Settings -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.syncSettings.globalSettings') }}</h2>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sync Mode -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.syncMode') }}
              </label>
              <Select
                v-model="globalSettings.syncMode"
                :options="syncModeOptions"
                :placeholder="t('channelManager.syncSettings.selectSyncMode')"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ t('channelManager.syncSettings.syncModeDescription') }}
              </p>
            </div>
            
            <!-- Default Sync Frequency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.defaultSyncFrequency') }}
              </label>
              <Select
                v-model="globalSettings.defaultSyncFrequency"
                :options="syncFrequencyOptions"
                :placeholder="t('channelManager.syncSettings.selectFrequency')"
              />
            </div>
            
            <!-- Sync Window -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.syncWindow') }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <Input
                  v-model="globalSettings.syncWindowStart"
                  type="time"
                  :placeholder="t('channelManager.syncSettings.startTime')"
                />
                <Input
                  v-model="globalSettings.syncWindowEnd"
                  type="time"
                  :placeholder="t('channelManager.syncSettings.endTime')"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ t('channelManager.syncSettings.syncWindowDescription') }}
              </p>
            </div>
            
            <!-- Retry Settings -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.retryAttempts') }}
              </label>
              <Input
                v-model="globalSettings.retryAttempts"
                type="number"
                min="1"
                max="10"
                :placeholder="t('channelManager.syncSettings.retryAttemptsPlaceholder')"
              />
            </div>
          </div>
          
          <!-- Global Toggles -->
          <div class="mt-6 space-y-4">
            <label class="flex items-center">
              <input
                v-model="globalSettings.enableAutoSync"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.syncSettings.enableAutoSync') }}</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="globalSettings.enableNotifications"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.syncSettings.enableNotifications') }}</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="globalSettings.enableErrorAlerts"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.syncSettings.enableErrorAlerts') }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Channel-Specific Settings -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.syncSettings.channelSpecificSettings') }}</h2>
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
                
                <label class="flex items-center">
                  <input
                    v-model="channel.settings.enabled"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.syncSettings.enableSync') }}</span>
                </label>
              </div>
              
              <div v-if="channel.settings.enabled" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Rates Sync -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">{{ t('channelManager.syncSettings.ratesSync') }}</h4>
                  <div class="space-y-2">
                    <Select
                      v-model="channel.settings.ratesSyncFrequency"
                      :options="syncFrequencyOptions"
                      size="sm"
                    />
                    <label class="flex items-center">
                      <input
                        v-model="channel.settings.bidirectionalRates"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-xs text-gray-700">{{ t('channelManager.syncSettings.bidirectional') }}</span>
                    </label>
                  </div>
                </div>
                
                <!-- Inventory Sync -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">{{ t('channelManager.syncSettings.inventorySync') }}</h4>
                  <div class="space-y-2">
                    <Select
                      v-model="channel.settings.inventorySyncFrequency"
                      :options="syncFrequencyOptions"
                      size="sm"
                    />
                    <label class="flex items-center">
                      <input
                        v-model="channel.settings.bidirectionalInventory"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-xs text-gray-700">{{ t('channelManager.syncSettings.bidirectional') }}</span>
                    </label>
                  </div>
                </div>
                
                <!-- Reservations Sync -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-2">{{ t('channelManager.syncSettings.reservationsSync') }}</h4>
                  <div class="space-y-2">
                    <Select
                      v-model="channel.settings.reservationsSyncFrequency"
                      :options="syncFrequencyOptions"
                      size="sm"
                    />
                    <label class="flex items-center">
                      <input
                        v-model="channel.settings.autoConfirmReservations"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-xs text-gray-700">{{ t('channelManager.syncSettings.autoConfirm') }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sync Schedule -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.syncSettings.syncSchedule') }}</h2>
            <BasicButton 
              variant="outline" 
              :icon="Plus" 
              :label="t('channelManager.syncSettings.addSchedule')" 
              @click="addSchedule"
            />
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="schedules.length === 0" class="text-center py-8">
            <Calendar class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('channelManager.syncSettings.noSchedules') }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ t('channelManager.syncSettings.noSchedulesDescription') }}</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="(schedule, index) in schedules" :key="index" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ t('channelManager.syncSettings.scheduleName') }}
                    </label>
                    <Input
                      v-model="schedule.name"
                      size="sm"
                      :placeholder="t('channelManager.syncSettings.scheduleNamePlaceholder')"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ t('channelManager.syncSettings.frequency') }}
                    </label>
                    <Select
                      v-model="schedule.frequency"
                      :options="scheduleFrequencyOptions"
                      size="sm"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ t('channelManager.syncSettings.time') }}
                    </label>
                    <Input
                      v-model="schedule.time"
                      type="time"
                      size="sm"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ t('channelManager.syncSettings.channels') }}
                    </label>
                    <Select
                      v-model="schedule.channels"
                      :options="channelOptions"
                      multiple
                      size="sm"
                    />
                  </div>
                </div>
                
                <div class="ml-4 flex items-center space-x-2">
                  <label class="flex items-center">
                    <input
                      v-model="schedule.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-1 text-xs text-gray-700">{{ t('channelManager.syncSettings.enabled') }}</span>
                  </label>
                  <button
                    @click="removeSchedule(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conflict Resolution -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.syncSettings.conflictResolution') }}</h2>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.rateConflictResolution') }}
              </label>
              <Select
                v-model="conflictSettings.rateConflictResolution"
                :options="conflictResolutionOptions"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.inventoryConflictResolution') }}
              </label>
              <Select
                v-model="conflictSettings.inventoryConflictResolution"
                :options="conflictResolutionOptions"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.reservationConflictResolution') }}
              </label>
              <Select
                v-model="conflictSettings.reservationConflictResolution"
                :options="reservationConflictOptions"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('channelManager.syncSettings.overbookingPolicy') }}
              </label>
              <Select
                v-model="conflictSettings.overbookingPolicy"
                :options="overbookingPolicyOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ChannelManagerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '@/components/layout/ChannelManagerLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import {
  Save,
  Plus,
  Calendar,
  Trash2
} from 'lucide-vue-next'

const { t } = useI18n()

// Reactive data
const isLoading = ref(false)

const globalSettings = ref({
  syncMode: 'automatic',
  defaultSyncFrequency: 'hourly',
  syncWindowStart: '06:00',
  syncWindowEnd: '23:00',
  retryAttempts: 3,
  enableAutoSync: true,
  enableNotifications: true,
  enableErrorAlerts: true
})

const channels = ref([
  {
    id: 1,
    name: 'Booking.com',
    description: 'Leading online travel agency',
    logo: '/images/channels/booking-com.png',
    settings: {
      enabled: true,
      ratesSyncFrequency: 'hourly',
      inventorySyncFrequency: 'real-time',
      reservationsSyncFrequency: 'real-time',
      bidirectionalRates: true,
      bidirectionalInventory: true,
      autoConfirmReservations: true
    }
  },
  {
    id: 2,
    name: 'Expedia',
    description: 'Global travel technology company',
    logo: '/images/channels/expedia.png',
    settings: {
      enabled: true,
      ratesSyncFrequency: 'daily',
      inventorySyncFrequency: 'hourly',
      reservationsSyncFrequency: 'hourly',
      bidirectionalRates: false,
      bidirectionalInventory: true,
      autoConfirmReservations: false
    }
  }
])

const schedules = ref([
  {
    name: 'Morning Sync',
    frequency: 'daily',
    time: '08:00',
    channels: ['booking-com', 'expedia'],
    enabled: true
  }
])

const conflictSettings = ref({
  rateConflictResolution: 'pms-priority',
  inventoryConflictResolution: 'lowest-value',
  reservationConflictResolution: 'manual-review',
  overbookingPolicy: 'prevent'
})

// Options
const syncModeOptions = ref([
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'scheduled', label: 'Scheduled Only' }
])

const syncFrequencyOptions = ref([
  { value: 'real-time', label: 'Real-time' },
  { value: 'every-15-minutes', label: 'Every 15 minutes' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'manual', label: 'Manual' }
])

const scheduleFrequencyOptions = ref([
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
])

const channelOptions = ref([
  { value: 'booking-com', label: 'Booking.com' },
  { value: 'expedia', label: 'Expedia' },
  { value: 'airbnb', label: 'Airbnb' }
])

const conflictResolutionOptions = ref([
  { value: 'pms-priority', label: 'PMS Priority' },
  { value: 'channel-priority', label: 'Channel Priority' },
  { value: 'highest-value', label: 'Highest Value' },
  { value: 'lowest-value', label: 'Lowest Value' },
  { value: 'manual-review', label: 'Manual Review' }
])

const reservationConflictOptions = ref([
  { value: 'accept-all', label: 'Accept All' },
  { value: 'first-come-first-served', label: 'First Come, First Served' },
  { value: 'manual-review', label: 'Manual Review' },
  { value: 'reject-duplicates', label: 'Reject Duplicates' }
])

const overbookingPolicyOptions = ref([
  { value: 'prevent', label: 'Prevent Overbooking' },
  { value: 'allow-1', label: 'Allow 1 Overbooking' },
  { value: 'allow-2', label: 'Allow 2 Overbookings' },
  { value: 'unlimited', label: 'Unlimited' }
])

// Methods
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

const addSchedule = () => {
  schedules.value.push({
    name: '',
    frequency: 'daily',
    time: '08:00',
    channels: [],
    enabled: true
  })
}

const removeSchedule = (index) => {
  schedules.value.splice(index, 1)
}

// Lifecycle
onMounted(() => {
  // Load initial data
})
</script>