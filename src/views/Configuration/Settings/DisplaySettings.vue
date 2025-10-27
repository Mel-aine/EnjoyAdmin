<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Display Settings</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            Manage different display settings that you want to set by default for various fields in Front Desk operations.
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" label="Save Changes" @click="saveDisplaySettings" :loading="isLoading" />
      </div>
      
      <div class="space-y-6">
        <!-- Format Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Format Settings</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Format
                </label>
                <Select
                  v-model="formatSettings.timeFormat"
                  :options="timeFormatOptions"
                  placeholder="Select time format"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <Select
                  v-model="formatSettings.dateFormat"
                  :options="dateFormatOptions"
                  placeholder="Select date format"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arrival/Departure Date Format
                </label>
                <Select
                  v-model="formatSettings.arrivalDepartureDateFormat"
                  :options="dateFormatOptions"
                  placeholder="Select arrival/departure date format"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Zone
                </label>
                <Select
                  v-model="formatSettings.timeZone"
                  :options="timeZoneOptions"
                  placeholder="Select time zone"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Caption Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Caption Settings</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State Caption
                </label>
                <Input
                  v-model="captionSettings.stateCaption"
                  placeholder="Enter caption for State field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zip Code Caption
                </label>
                <Input
                  v-model="captionSettings.zipCodeCaption"
                  placeholder="Enter caption for Zip Code field"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Default Values -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Default Values</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Identity
                </label>
                <Select
                  v-model="defaultValues.selectIdentity"
                  :options="identityOptions"
                  placeholder="Select default identity"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Reservation Type
                </label>
                <Select
                  v-model="defaultValues.reservationType"
                  :options="reservationTypeOptions"
                  placeholder="Select default reservation type"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salutation
                </label>
                <Select
                  v-model="defaultValues.salutation"
                  :options="salutationOptions"
                  placeholder="Select default salutation"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bill To
                </label>
                <Select
                  v-model="defaultValues.billTo"
                  :options="billToOptions"
                  placeholder="Select default bill to option"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Mode
                </label>
                <Select
                  v-model="defaultValues.paymentMode"
                  :options="paymentModeOptions"
                  placeholder="Select default payment mode"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Payment Gateway
                </label>
                <Select
                  v-model="defaultValues.paymentGateway"
                  :options="paymentGatewayOptions"
                  placeholder="Select default payment gateway"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Round Off Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Round Off Settings</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Round Off Type
                </label>
                <Select
                  v-model="roundOffSettings.type"
                  :options="roundOffTypeOptions"
                  placeholder="Select round off type"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Round Off Limit
                </label>
                <Input
                  v-model="roundOffSettings.limit"
                  type="number"
                  step="0.01"
                  placeholder="Enter round off limit"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Web Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Web Settings</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Web Rate Mode
                </label>
                <Select
                  v-model="webSettings.rateMode"
                  :options="webRateModeOptions"
                  placeholder="Select web rate mode"
                />
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ getWebRateModeDescription(webSettings.rateMode) }}
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Web Inventory Mode
                </label>
                <Select
                  v-model="webSettings.inventoryMode"
                  :options="webInventoryModeOptions"
                  placeholder="Select web inventory mode"
                />
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ getWebInventoryModeDescription(webSettings.inventoryMode) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateHotelDisplaySettings } from '../../../services/hotelApi'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

const formatSettings = ref({
  timeFormat: '24-hour',
  dateFormat: 'dd/mm/yyyy',
  arrivalDepartureDateFormat: 'dd/mm/yyyy',
  timeZone: 'UTC+00:00'
})

const captionSettings = ref({
  stateCaption: 'State',
  zipCodeCaption: 'Zip Code'
})

const defaultValues = ref({
  selectIdentity: 'passport',
  reservationType: 'confirmed',
  salutation: 'mr',
  billTo: 'guest',
  paymentMode: 'cash',
  paymentGateway: 'stripe'
})

const roundOffSettings = ref({
  type: 'nearest',
  limit: 0.50
})

const webSettings = ref({
  rateMode: 'regular',
  inventoryMode: 'regular'
})

const timeFormatOptions = [
  { label: '12-Hour Format (AM/PM)', value: '12-hour' },
  { label: '24-Hour Format', value: '24-hour' }
]

const dateFormatOptions = [
  { label: 'DD/MM/YYYY', value: 'dd/mm/yyyy' },
  { label: 'MM/DD/YYYY', value: 'mm/dd/yyyy' },
  { label: 'YYYY-MM-DD', value: 'yyyy-mm-dd' },
  { label: 'DD-MM-YYYY', value: 'dd-mm-yyyy' },
  { label: 'MM-DD-YYYY', value: 'mm-dd-yyyy' }
]

const timeZoneOptions = [
  { label: 'UTC+00:00 (GMT)', value: 'UTC+00:00' },
  { label: 'UTC+01:00 (CET)', value: 'UTC+01:00' },
  { label: 'UTC+02:00 (EET)', value: 'UTC+02:00' },
  { label: 'UTC+05:30 (IST)', value: 'UTC+05:30' },
  { label: 'UTC+08:00 (CST)', value: 'UTC+08:00' },
  { label: 'UTC-05:00 (EST)', value: 'UTC-05:00' },
  { label: 'UTC-08:00 (PST)', value: 'UTC-08:00' }
]

const identityOptions = [
  { label: 'Passport', value: 'passport' },
  { label: 'National ID', value: 'national_id' },
  { label: 'Driver License', value: 'driver_license' },
  { label: 'Voter ID', value: 'voter_id' },
  { label: 'Other', value: 'other' }
]

const reservationTypeOptions = [
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Tentative', value: 'tentative' },
  { label: 'Waitlist', value: 'waitlist' },
  { label: 'Inquiry', value: 'inquiry' }
]

const salutationOptions = [
  { label: 'Mr.', value: 'mr' },
  { label: 'Mrs.', value: 'mrs' },
  { label: 'Ms.', value: 'ms' },
  { label: 'Dr.', value: 'dr' },
  { label: 'Prof.', value: 'prof' }
]

const billToOptions = [
  { label: 'Company', value: 'company' },
  { label: 'Group Owner', value: 'group_owner' },
  { label: 'Guest', value: 'guest' },
  { label: 'Room and Tax to Company, Extra to Guest', value: 'room_tax_company_extra_guest' }
]

const paymentModeOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Debit Card', value: 'debit_card' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Check', value: 'check' }
]

const paymentGatewayOptions = [
  { label: 'Stripe', value: 'stripe' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Square', value: 'square' },
  { label: 'Authorize.Net', value: 'authorize_net' },
  { label: 'Razorpay', value: 'razorpay' }
]

const roundOffTypeOptions = [
  { label: 'Nearest', value: 'nearest' },
  { label: 'Round Up', value: 'round_up' },
  { label: 'Round Down', value: 'round_down' },
  { label: 'No Rounding', value: 'no_rounding' }
]

const webRateModeOptions = [
  { label: 'Regular', value: 'regular' },
  { label: 'Special', value: 'special' },
  { label: 'Allocated', value: 'allocated' }
]

const webInventoryModeOptions = [
  { label: 'Regular', value: 'regular' },
  { label: 'Allocated', value: 'allocated' }
]

const getWebRateModeDescription = (mode) => {
  const descriptions = {
    regular: 'The rates will be picked from eZee Absolute',
    special: 'The rates for the travel agent will be taken into consideration',
    allocated: 'The rates from eZee Reservation will be picked up'
  }
  return descriptions[mode] || ''
}

const getWebInventoryModeDescription = (mode) => {
  const descriptions = {
    regular: 'This will set the default mode to eZee Absolute inventory',
    allocated: 'This will set the default mode to eZee Reservation inventory'
  }
  return descriptions[mode] || ''
}

// Load display settings from current service
const loadDisplaySettingsFromService = () => {
  if (currentService.value && currentService.value.displaySettings) {
    const serviceDisplaySettings = currentService.value.displaySettings
    
    if (serviceDisplaySettings.formatSettings) {
      formatSettings.value = { ...formatSettings.value, ...serviceDisplaySettings.formatSettings }
    }
    if (serviceDisplaySettings.captionSettings) {
      captionSettings.value = { ...captionSettings.value, ...serviceDisplaySettings.captionSettings }
    }
    if (serviceDisplaySettings.defaultValues) {
      defaultValues.value = { ...defaultValues.value, ...serviceDisplaySettings.defaultValues }
    }
    if (serviceDisplaySettings.roundOffSettings) {
      roundOffSettings.value = { ...roundOffSettings.value, ...serviceDisplaySettings.roundOffSettings }
    }
    if (serviceDisplaySettings.webSettings) {
      webSettings.value = { ...webSettings.value, ...serviceDisplaySettings.webSettings }
    }
  }
}

const saveDisplaySettings = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.displaySettingsUpdateError'))
    return
  }

  isLoading.value = true
  
  try {
    const settings = {
      formatSettings: formatSettings.value,
      captionSettings: captionSettings.value,
      defaultValues: defaultValues.value,
      roundOffSettings: roundOffSettings.value,
      webSettings: webSettings.value
    }
    
    // Call API to update display settings
    await updateHotelDisplaySettings(currentService.value.id, { displaySettings: settings })
    
    // Update the service store with new display settings
    const updatedService = {
      ...currentService.value,
      displaySettings: settings
    }
    serviceStore.setCurrentService(updatedService)
    
    // Show success toast
    toast.success(t('toast.displaySettingsUpdated'))
  } catch (error) {
    console.error('Error saving display settings:', error)
    toast.error(t('toast.displaySettingsUpdateError'))
  } finally {
    isLoading.value = false
  }
}

// Load display settings when component mounts
onMounted(() => {
  loadDisplaySettingsFromService()
})
</script>
