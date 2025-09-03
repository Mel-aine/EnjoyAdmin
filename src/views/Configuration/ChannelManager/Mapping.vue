<template>
  <ChannelManagerLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('channelManager.mapping.title') }}</h1>
          <p class="text-gray-600 mt-1">
            {{ t('channelManager.mapping.subtitle') }}
          </p>
        </div>
        <BasicButton 
          variant="primary" 
          :icon="Save" 
          :label="isLoading ? t('Processing') + '...' : t('channelManager.mapping.saveChanges')" 
          @click="saveMappings" 
          :disabled="isLoading"
        />
      </div>
      
      <!-- Channel Selection -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.mapping.selectChannel') }}</h2>
        </div>
        <div class="p-6">
          <Select
            v-model="selectedChannel"
            :options="channelOptions"
            :placeholder="t('channelManager.mapping.selectChannelPlaceholder')"
            @change="loadChannelMappings"
          />
        </div>
      </div>

      <div v-if="selectedChannel">
        <!-- Room Type Mapping -->
        <div class="bg-white rounded-lg shadow mb-6">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.mapping.roomTypeMapping') }}</h2>
              <BasicButton 
                variant="outline" 
                size="sm" 
                :icon="Plus" 
                :label="t('channelManager.mapping.addMapping')" 
                @click="addRoomMapping"
              />
            </div>
          </div>
          
          <div class="p-6">
            <div v-if="roomMappings.length === 0" class="text-center py-8">
              <Home class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('channelManager.mapping.noRoomMappings') }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ t('channelManager.mapping.noRoomMappingsDescription') }}</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="(mapping, index) in roomMappings" :key="index" class="border border-gray-200 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('channelManager.mapping.pmsRoomType') }}
                    </label>
                    <Select
                      v-model="mapping.pmsRoomType"
                      :options="pmsRoomTypes"
                      :placeholder="t('channelManager.mapping.selectPmsRoomType')"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('channelManager.mapping.channelRoomType') }}
                    </label>
                    <Select
                      v-model="mapping.channelRoomType"
                      :options="channelRoomTypes"
                      :placeholder="t('channelManager.mapping.selectChannelRoomType')"
                    />
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <BasicButton 
                      variant="outline" 
                      size="sm" 
                      :icon="RefreshCw" 
                      :label="t('channelManager.mapping.sync')" 
                      @click="syncRoomMapping(mapping)"
                    />
                    <BasicButton 
                      variant="danger" 
                      size="sm" 
                      :icon="Trash2" 
                      @click="removeRoomMapping(index)"
                    />
                  </div>
                </div>
                
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('channelManager.mapping.maxOccupancy') }}
                    </label>
                    <Input
                      v-model="mapping.maxOccupancy"
                      type="number"
                      :placeholder="t('channelManager.mapping.maxOccupancyPlaceholder')"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('channelManager.mapping.bedConfiguration') }}
                    </label>
                    <Input
                      v-model="mapping.bedConfiguration"
                      :placeholder="t('channelManager.mapping.bedConfigurationPlaceholder')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rate Plan Mapping -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">{{ t('channelManager.mapping.ratePlanMapping') }}</h2>
              <BasicButton 
                variant="outline" 
                size="sm" 
                :icon="Plus" 
                :label="t('channelManager.mapping.addMapping')" 
                @click="addRateMapping"
              />
            </div>
          </div>
          
          <div class="p-6">
            <div v-if="rateMappings.length === 0" class="text-center py-8">
              <DollarSign class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('channelManager.mapping.noRateMappings') }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ t('channelManager.mapping.noRateMappingsDescription') }}</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="(mapping, index) in rateMappings" :key="index" class="border border-gray-200 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('channelManager.mapping.pmsRatePlan') }}
                    </label>
                    <Select
                      v-model="mapping.pmsRatePlan"
                      :options="pmsRatePlans"
                      :placeholder="t('channelManager.mapping.selectPmsRatePlan')"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('channelManager.mapping.channelRatePlan') }}
                    </label>
                    <Select
                      v-model="mapping.channelRatePlan"
                      :options="channelRatePlans"
                      :placeholder="t('channelManager.mapping.selectChannelRatePlan')"
                    />
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <BasicButton 
                      variant="outline" 
                      size="sm" 
                      :icon="RefreshCw" 
                      :label="t('channelManager.mapping.sync')" 
                      @click="syncRateMapping(mapping)"
                    />
                    <BasicButton 
                      variant="danger" 
                      size="sm" 
                      :icon="Trash2" 
                      @click="removeRateMapping(index)"
                    />
                  </div>
                </div>
                
                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="flex items-center">
                      <input
                        v-model="mapping.includeBreakfast"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.mapping.includeBreakfast') }}</span>
                    </label>
                  </div>
                  
                  <div>
                    <label class="flex items-center">
                      <input
                        v-model="mapping.refundable"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ t('channelManager.mapping.refundable') }}</span>
                    </label>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('channelManager.mapping.cancellationPolicy') }}
                    </label>
                    <Select
                      v-model="mapping.cancellationPolicy"
                      :options="cancellationPolicies"
                      :placeholder="t('channelManager.mapping.selectCancellationPolicy')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ChannelManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ChannelManagerLayout from '@/components/layout/ChannelManagerLayout.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import {
  Save,
  Plus,
  Home,
  DollarSign,
  RefreshCw,
  Trash2
} from 'lucide-vue-next'

const { t } = useI18n()

// Reactive data
const isLoading = ref(false)
const selectedChannel = ref('')
const roomMappings = ref([])
const rateMappings = ref([])

// Options
const channelOptions = ref([
  { value: 'booking-com', label: 'Booking.com' },
  { value: 'expedia', label: 'Expedia' },
  { value: 'airbnb', label: 'Airbnb' }
])

const pmsRoomTypes = ref([
  { value: 'standard-single', label: 'Standard Single Room' },
  { value: 'standard-double', label: 'Standard Double Room' },
  { value: 'deluxe-suite', label: 'Deluxe Suite' },
  { value: 'family-room', label: 'Family Room' }
])

const channelRoomTypes = ref([])

const pmsRatePlans = ref([
  { value: 'standard-rate', label: 'Standard Rate' },
  { value: 'advance-purchase', label: 'Advance Purchase' },
  { value: 'corporate-rate', label: 'Corporate Rate' },
  { value: 'weekend-special', label: 'Weekend Special' }
])

const channelRatePlans = ref([])

const cancellationPolicies = ref([
  { value: 'flexible', label: 'Flexible' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strict', label: 'Strict' },
  { value: 'non-refundable', label: 'Non-refundable' }
])

// Methods
const loadChannelMappings = async () => {
  if (!selectedChannel.value) return
  
  // TODO: Load channel-specific room types and rate plans
  // Mock data for now
  if (selectedChannel.value === 'booking-com') {
    channelRoomTypes.value = [
      { value: 'single', label: 'Single Room' },
      { value: 'double', label: 'Double Room' },
      { value: 'suite', label: 'Suite' },
      { value: 'apartment', label: 'Apartment' }
    ]
    
    channelRatePlans.value = [
      { value: 'room-only', label: 'Room Only' },
      { value: 'bed-breakfast', label: 'Bed & Breakfast' },
      { value: 'half-board', label: 'Half Board' },
      { value: 'full-board', label: 'Full Board' }
    ]
  }
  
  // Load existing mappings
  // TODO: Implement API call
}

const addRoomMapping = () => {
  roomMappings.value.push({
    pmsRoomType: '',
    channelRoomType: '',
    maxOccupancy: '',
    bedConfiguration: ''
  })
}

const removeRoomMapping = (index) => {
  roomMappings.value.splice(index, 1)
}

const addRateMapping = () => {
  rateMappings.value.push({
    pmsRatePlan: '',
    channelRatePlan: '',
    includeBreakfast: false,
    refundable: true,
    cancellationPolicy: ''
  })
}

const removeRateMapping = (index) => {
  rateMappings.value.splice(index, 1)
}

const syncRoomMapping = async (mapping) => {
  // TODO: Implement room mapping sync
  console.log('Sync room mapping:', mapping)
}

const syncRateMapping = async (mapping) => {
  // TODO: Implement rate mapping sync
  console.log('Sync rate mapping:', mapping)
}

const saveMappings = async () => {
  isLoading.value = true
  try {
    // TODO: Implement API call to save mappings
    console.log('Saving mappings:', {
      channel: selectedChannel.value,
      roomMappings: roomMappings.value,
      rateMappings: rateMappings.value
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    // TODO: Implement toast notification
  } catch (error) {
    console.error('Error saving mappings:', error)
    // TODO: Implement error handling
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch(selectedChannel, () => {
  roomMappings.value = []
  rateMappings.value = []
  loadChannelMappings()
})

// Lifecycle
onMounted(() => {
  // Load initial data
})
</script>