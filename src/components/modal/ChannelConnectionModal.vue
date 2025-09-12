<template>
  <div>
    <Modal v-if="isOpen" @close="emit('close')">
      <template #body>
        <div
          class="no-scrollbar h-11/12 relative w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8"
        >
          <button
            @click="emit('close')"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>

          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ isEditMode ? t('configuration.channelManager.connections.editConnection') : t('configuration.channelManager.connections.addConnection') }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {{ t('configuration.channelManager.connections.subtitle') }}
            </p>
          </div>

          <form class="flex flex-col" @submit.prevent="handleSubmit">
            <div class="custom-scrollbar h-[500px] overflow-y-auto p-2">
              
              <!-- Channel Selection -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ t('configuration.channelManager.connections.channelName') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Select
                      :is-required="true"
                      :lb="t('configuration.channelManager.connections.channelName')"
                      v-model="connectionForm.channelType"
                      :options="channelOptions"
                      @change="onChannelTypeChange"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="t('configuration.channelManager.connections.connectionType')"
                      :id="'connection_name'"
                      :forLabel="'connection_name'"
                      v-model="connectionForm.connectionName"
                      :is-required="true"
                      :placeholder="'Enter connection name'"
                    />
                  </div>
                </div>
              </div>

              <!-- Connection Configuration -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ t('configuration.channelManager.common.configure') }}
                </h5>
                
                <!-- Booking.com Configuration -->
                <div v-if="connectionForm.channelType === 'booking'" class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input
                      :lb="'Hotel ID'"
                      :id="'booking_hotel_id'"
                      :forLabel="'booking_hotel_id'"
                      v-model="connectionForm.config.hotelId"
                      :is-required="true"
                      :placeholder="'Enter Booking.com Hotel ID'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'Username'"
                      :id="'booking_username'"
                      :forLabel="'booking_username'"
                      v-model="connectionForm.config.username"
                      :is-required="true"
                      :placeholder="'Enter username'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'Password'"
                      :id="'booking_password'"
                      :forLabel="'booking_password'"
                      :inputType="'password'"
                      v-model="connectionForm.config.password"
                      :is-required="true"
                      :placeholder="'Enter password'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'API Endpoint'"
                      :id="'booking_endpoint'"
                      :forLabel="'booking_endpoint'"
                      v-model="connectionForm.config.apiEndpoint"
                      :is-required="true"
                      :placeholder="'https://supply-xml.booking.com/'"
                    />
                  </div>
                </div>

                <!-- Expedia Configuration -->
                <div v-else-if="connectionForm.channelType === 'expedia'" class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input
                      :lb="'Hotel ID'"
                      :id="'expedia_hotel_id'"
                      :forLabel="'expedia_hotel_id'"
                      v-model="connectionForm.config.hotelId"
                      :is-required="true"
                      :placeholder="'Enter Expedia Hotel ID'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'API Key'"
                      :id="'expedia_api_key'"
                      :forLabel="'expedia_api_key'"
                      v-model="connectionForm.config.apiKey"
                      :is-required="true"
                      :placeholder="'Enter API Key'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'Secret Key'"
                      :id="'expedia_secret_key'"
                      :forLabel="'expedia_secret_key'"
                      :inputType="'password'"
                      v-model="connectionForm.config.secretKey"
                      :is-required="true"
                      :placeholder="'Enter Secret Key'"
                    />
                  </div>
                  <div>
                    <Select
                      :is-required="true"
                      :lb="'Environment'"
                      v-model="connectionForm.config.environment"
                      :options="environmentOptions"
                    />
                  </div>
                </div>

                <!-- Airbnb Configuration -->
                <div v-else-if="connectionForm.channelType === 'airbnb'" class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input
                      :lb="'Client ID'"
                      :id="'airbnb_client_id'"
                      :forLabel="'airbnb_client_id'"
                      v-model="connectionForm.config.clientId"
                      :is-required="true"
                      :placeholder="'Enter Client ID'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'Client Secret'"
                      :id="'airbnb_client_secret'"
                      :forLabel="'airbnb_client_secret'"
                      :inputType="'password'"
                      v-model="connectionForm.config.clientSecret"
                      :is-required="true"
                      :placeholder="'Enter Client Secret'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'Redirect URI'"
                      :id="'airbnb_redirect_uri'"
                      :forLabel="'airbnb_redirect_uri'"
                      v-model="connectionForm.config.redirectUri"
                      :is-required="true"
                      :placeholder="'Enter Redirect URI'"
                    />
                  </div>
                </div>

                <!-- Channex Configuration -->
                <div v-else-if="connectionForm.channelType === 'channex'" class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input
                      :lb="'API Token'"
                      :id="'channex_api_token'"
                      :forLabel="'channex_api_token'"
                      :inputType="'password'"
                      v-model="connectionForm.config.apiToken"
                      :is-required="true"
                      :placeholder="'Enter API Token'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'Property ID'"
                      :id="'channex_property_id'"
                      :forLabel="'channex_property_id'"
                      v-model="connectionForm.config.propertyId"
                      :is-required="true"
                      :placeholder="'Enter Property ID'"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="'API Endpoint'"
                      :id="'channex_endpoint'"
                      :forLabel="'channex_endpoint'"
                      v-model="connectionForm.config.apiEndpoint"
                      :is-required="true"
                      :placeholder="'https://api.channex.io/'"
                    />
                  </div>
                </div>
              </div>

              <!-- Sync Settings -->
              <div class="mb-8">
                <h5
                  class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {{ t('configuration.channelManager.syncSettings.title') }}
                </h5>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="auto_sync_rates"
                      v-model="connectionForm.autoSyncRates"
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    >
                    <label for="auto_sync_rates" class="ml-2 block text-sm text-gray-900 dark:text-white">
                      {{ t('configuration.channelManager.ratesInventory.autoSyncRates') }}
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="auto_sync_inventory"
                      v-model="connectionForm.autoSyncInventory"
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    >
                    <label for="auto_sync_inventory" class="ml-2 block text-sm text-gray-900 dark:text-white">
                      {{ t('configuration.channelManager.ratesInventory.autoSyncInventory') }}
                    </label>
                  </div>
                  <div>
                    <Select
                      :lb="t('configuration.channelManager.ratesInventory.syncFrequency')"
                      v-model="connectionForm.syncFrequency"
                      :options="syncFrequencyOptions"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                type="button"
                @click="testConnection"
                :disabled="loading || testingConnection"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <span v-if="!testingConnection">{{ t('configuration.channelManager.connections.testConnection') }}</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ t('configuration.channelManager.common.test') }}...
                </span>
              </button>
              
              <button
                type="button"
                @click="emit('close')"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {{ t('configuration.channelManager.common.cancel') }}
              </button>
              
              <button
                type="submit"
                :disabled="loading || testingConnection"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">{{ isEditMode ? t('configuration.channelManager.common.update') : t('configuration.channelManager.common.save') }}</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ t('configuration.channelManager.common.loading') }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import * as channelManagerApi from '@/services/channelManagerApi'

const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))

const { t } = useI18n()
const toast = useToast()

interface Props {
  isOpen: boolean
  connection?: any
  isEditMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isEditMode: false
})

const emit = defineEmits<{
  close: []
  save: [connection: any]
}>()

const loading = ref(false)
const testingConnection = ref(false)

const connectionForm = reactive({
  connectionName: '',
  channelType: '',
  autoSyncRates: true,
  autoSyncInventory: true,
  syncFrequency: 'realTime',
  config: {
    hotelId: '',
    username: '',
    password: '',
    apiKey: '',
    secretKey: '',
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    apiToken: '',
    propertyId: '',
    apiEndpoint: '',
    environment: 'production'
  }
})

const channelOptions = [
  { value: 'booking', label: 'Booking.com' },
  { value: 'expedia', label: 'Expedia' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'channex', label: 'Channex' },
  { value: 'agoda', label: 'Agoda' },
  { value: 'hotels', label: 'Hotels.com' }
]

const environmentOptions = [
  { value: 'production', label: 'Production' },
  { value: 'sandbox', label: 'Sandbox' }
]

const syncFrequencyOptions = [
  { value: 'realTime', label: t('configuration.channelManager.ratesInventory.realTime') },
  { value: 'hourly', label: t('configuration.channelManager.ratesInventory.hourly') },
  { value: 'daily', label: t('configuration.channelManager.ratesInventory.daily') },
  { value: 'manual', label: t('configuration.channelManager.ratesInventory.manual') }
]

// Watch for connection prop changes to populate form in edit mode
watch(() => props.connection, (newConnection) => {
  if (newConnection && props.isEditMode) {
    Object.assign(connectionForm, {
      connectionName: newConnection.name || '',
      channelType: newConnection.channelType || '',
      autoSyncRates: newConnection.autoSyncRates ?? true,
      autoSyncInventory: newConnection.autoSyncInventory ?? true,
      syncFrequency: newConnection.syncFrequency || 'realTime',
      config: { ...newConnection.config }
    })
  }
}, { immediate: true })

// Reset form when modal opens in add mode
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && !props.isEditMode) {
    resetForm()
  }
})

const resetForm = () => {
  Object.assign(connectionForm, {
    connectionName: '',
    channelType: '',
    autoSyncRates: true,
    autoSyncInventory: true,
    syncFrequency: 'realTime',
    config: {
      hotelId: '',
      username: '',
      password: '',
      apiKey: '',
      secretKey: '',
      clientId: '',
      clientSecret: '',
      redirectUri: '',
      apiToken: '',
      propertyId: '',
      apiEndpoint: '',
      environment: 'production'
    }
  })
}

const onChannelTypeChange = () => {
  // Reset config when channel type changes
  connectionForm.config = {
    hotelId: '',
    username: '',
    password: '',
    apiKey: '',
    secretKey: '',
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    apiToken: '',
    propertyId: '',
    apiEndpoint: getDefaultEndpoint(connectionForm.channelType),
    environment: 'production'
  }
}

const getDefaultEndpoint = (channelType: string): string => {
  const endpoints: Record<string, string> = {
    booking: 'https://supply-xml.booking.com/',
    expedia: 'https://services.expediapartnercentral.com/',
    channex: 'https://api.channex.io/',
    airbnb: 'https://api.airbnb.com/'
  }
  return endpoints[channelType] || ''
}

const testConnection = async () => {
  if (!connectionForm.channelType) {
    toast.error('Please select a channel type first')
    return
  }

  testingConnection.value = true
  try {
   
  } catch (error: any) {
    toast.error(`Connection test failed: ${error.message}`)
  } finally {
    testingConnection.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const connectionData = {
      name: connectionForm.connectionName,
      channelType: connectionForm.channelType,
      config: connectionForm.config,
      autoSyncRates: connectionForm.autoSyncRates,
      autoSyncInventory: connectionForm.autoSyncInventory,
      syncFrequency: connectionForm.syncFrequency,
      status: 'active'
    }

    let result
    if (props.isEditMode && props.connection?.id) {
      
    } else {
       
    }

    emit('save', result)
    emit('close')
  } catch (error: any) {
    toast.error(`Failed to save connection: ${error.message}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>