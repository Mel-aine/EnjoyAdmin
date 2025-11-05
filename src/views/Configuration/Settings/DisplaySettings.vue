<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('configuration.settings.display_settings.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            {{ $t('configuration.settings.display_settings.description') }}
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" :label="$t('configuration.settings.display_settings.save_changes')" @click="saveDisplaySettings" :loading="isLoading" />
      </div>
      
      <div class="space-y-6">
        <!-- Format Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{{ $t('configuration.settings.display_settings.format_settings') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Select
                  v-model="formatSettings.timeFormat"
                  :lb="$t('configuration.settings.display_settings.time_format')"
                  :options="timeFormatOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_time_format')"
                />
              </div>
              
              <div>
                <Select
                  v-model="formatSettings.dateFormat"
                  :lb="$t('configuration.settings.display_settings.date_format')"
                  :options="dateFormatOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_date_format')"
                />
              </div>
              
              <div>
                <Select
                  v-model="formatSettings.arrivalDepartureDateFormat"
                  :lb="$t('configuration.settings.display_settings.arrival_departure_date_format')"
                  :options="dateFormatOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_arrival_departure_date_format')"
                />
              </div>
              
              <div>
                <Select
                  v-model="formatSettings.timeZone"
                  :lb="$t('configuration.settings.display_settings.time_zone')"
                  :options="timeZoneOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_time_zone')"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Caption Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{{ $t('configuration.settings.display_settings.caption_settings') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  v-model="captionSettings.stateCaption"
                  :lb="$t('configuration.settings.display_settings.state_caption')"
                  :placeholder="$t('configuration.settings.display_settings.enter_caption_for_state_field')"
                />
              </div>
              
              <div>
                <Input
                  v-model="captionSettings.zipCodeCaption"
                  :lb="$t('configuration.settings.display_settings.zip_code_caption')"
                  :placeholder="$t('configuration.settings.display_settings.enter_caption_for_zip_code_field')"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Default Values -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{{ $t('configuration.settings.display_settings.default_values') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Select
                  v-model="defaultValues.selectIdentity"
                  :lb="$t('configuration.settings.display_settings.select_identity')"
                  :options="identityOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_default_identity')"
                />
              </div>
              
              <div>
                <Select
                  v-model="defaultValues.reservationType"
                  :lb="$t('configuration.settings.display_settings.default_reservation_type')"
                  :options="reservationTypeOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_default_reservation_type')"
                />
              </div>
              
              <div>
                <Select
                  v-model="defaultValues.salutation"
                  :lb="$t('configuration.settings.display_settings.salutation')"
                  :options="salutationOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_default_salutation')"
                />
              </div>
              
              <div>
                <Select
                  v-model="defaultValues.billTo"
                  :lb="$t('configuration.settings.display_settings.bill_to')"
                  :options="billToOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_default_bill_to_option')"
                />
              </div>
              
              <div>
                <Select
                  v-model="defaultValues.paymentMode"
                  :lb="$t('configuration.settings.display_settings.payment_mode')"
                  :options="paymentModeOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_default_payment_mode')"
                />
              </div>
              
              <div>
                <Select
                  v-model="defaultValues.paymentGateway"
                  :lb="$t('configuration.settings.display_settings.select_payment_gateway')"
                  :options="paymentGatewayOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_default_payment_gateway')"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Round Off Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{{ $t('configuration.settings.display_settings.round_off_settings') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  v-model="roundOffSettings.type"
                  :lb="$t('configuration.settings.display_settings.round_off_type')"
                  :options="roundOffTypeOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_round_off_type')"
                />
              </div>
              
              <div>
                <Input
                  v-model="roundOffSettings.limit"
                  type="number"
                  step="0.01"
                  :lb="$t('configuration.settings.display_settings.round_off_limit')"
                  :placeholder="$t('configuration.settings.display_settings.enter_round_off_limit')"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Web Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">{{ $t('configuration.settings.display_settings.web_settings') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  v-model="webSettings.rateMode"
                  :lb="$t('configuration.settings.display_settings.web_rate_mode')"
                  :options="webRateModeOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_web_rate_mode')"
                />
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ getWebRateModeDescription(webSettings.rateMode) }}
                </p>
              </div>
              
              <div>
                <Select
                  v-model="webSettings.inventoryMode"
                  :lb="$t('configuration.settings.display_settings.web_inventory_mode')"
                  :options="webInventoryModeOptions"
                  :placeholder="$t('configuration.settings.display_settings.select_web_inventory_mode')"
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

const timeFormatOptions = computed(() => [
  { label: t('configuration.settings.display_settings.twelve_hour_format'), value: '12-hour' },
  { label: t('configuration.settings.display_settings.twenty_four_hour_format'), value: '24-hour' }
])

const dateFormatOptions = computed(() => [
  { label: 'DD/MM/YYYY', value: 'dd/mm/yyyy' },
  { label: 'MM/DD/YYYY', value: 'mm/dd/yyyy' },
  { label: 'YYYY-MM-DD', value: 'yyyy-mm-dd' },
  { label: 'DD-MM-YYYY', value: 'dd-mm-yyyy' },
  { label: 'MM-DD-YYYY', value: 'mm-dd-yyyy' }
])

const timeZoneOptions = computed(() => [
  { label: 'UTC+00:00 (GMT)', value: 'UTC+00:00' },
  { label: 'UTC+01:00 (CET)', value: 'UTC+01:00' },
  { label: 'UTC+02:00 (EET)', value: 'UTC+02:00' },
  { label: 'UTC+05:30 (IST)', value: 'UTC+05:30' },
  { label: 'UTC+08:00 (CST)', value: 'UTC+08:00' },
  { label: 'UTC-05:00 (EST)', value: 'UTC-05:00' },
  { label: 'UTC-08:00 (PST)', value: 'UTC-08:00' }
])

const identityOptions = computed(() => [
  { label: t('configuration.settings.display_settings.passport'), value: 'passport' },
  { label: t('configuration.settings.display_settings.national_id'), value: 'national_id' },
  { label: t('configuration.settings.display_settings.driver_license'), value: 'driver_license' },
  { label: t('configuration.settings.display_settings.voter_id'), value: 'voter_id' },
  { label: t('configuration.settings.display_settings.other'), value: 'other' }
])

const reservationTypeOptions = computed(() => [
  { label: t('configuration.settings.display_settings.confirmed'), value: 'confirmed' },
  { label: t('configuration.settings.display_settings.tentative'), value: 'tentative' },
  { label: t('configuration.settings.display_settings.waitlist'), value: 'waitlist' },
  { label: t('configuration.settings.display_settings.inquiry'), value: 'inquiry' }
])

const salutationOptions = computed(() => [
  { label: t('configuration.settings.display_settings.mr'), value: 'mr' },
  { label: t('configuration.settings.display_settings.mrs'), value: 'mrs' },
  { label: t('configuration.settings.display_settings.ms'), value: 'ms' },
  { label: t('configuration.settings.display_settings.dr'), value: 'dr' },
  { label: t('configuration.settings.display_settings.prof'), value: 'prof' }
])

const billToOptions = computed(() => [
  { label: t('configuration.settings.display_settings.company'), value: 'company' },
  { label: t('configuration.settings.display_settings.group_owner'), value: 'group_owner' },
  { label: t('configuration.settings.display_settings.guest'), value: 'guest' },
  { label: t('configuration.settings.display_settings.room_tax_company_extra_guest'), value: 'room_tax_company_extra_guest' }
])

const paymentModeOptions = computed(() => [
  { label: t('configuration.settings.display_settings.cash'), value: 'cash' },
  { label: t('configuration.settings.display_settings.credit_card'), value: 'credit_card' },
  { label: t('configuration.settings.display_settings.debit_card'), value: 'debit_card' },
  { label: t('configuration.settings.display_settings.bank_transfer'), value: 'bank_transfer' },
  { label: t('configuration.settings.display_settings.check'), value: 'check' }
])

const paymentGatewayOptions = computed(() => [
  { label: 'Stripe', value: 'stripe' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Square', value: 'square' },
  { label: 'Authorize.Net', value: 'authorize_net' },
  { label: 'Razorpay', value: 'razorpay' }
])

const roundOffTypeOptions = computed(() => [
  { label: t('configuration.settings.display_settings.nearest'), value: 'nearest' },
  { label: t('configuration.settings.display_settings.round_up'), value: 'round_up' },
  { label: t('configuration.settings.display_settings.round_down'), value: 'round_down' },
  { label: t('configuration.settings.display_settings.no_rounding'), value: 'no_rounding' }
])

const webRateModeOptions = computed(() => [
  { label: t('configuration.settings.display_settings.regular'), value: 'regular' },
  { label: t('configuration.settings.display_settings.special'), value: 'special' },
  { label: t('configuration.settings.display_settings.allocated'), value: 'allocated' }
])

const webInventoryModeOptions = computed(() => [
  { label: t('configuration.settings.display_settings.regular'), value: 'regular' },
  { label: t('configuration.settings.display_settings.allocated'), value: 'allocated' }
])

const getWebRateModeDescription = (mode) => {
  const descriptions = {
    regular: t('configuration.settings.display_settings.web_rate_mode_regular_description'),
    special: t('configuration.settings.display_settings.web_rate_mode_special_description'),
    allocated: t('configuration.settings.display_settings.web_rate_mode_allocated_description')
  }
  return descriptions[mode] || ''
}

const getWebInventoryModeDescription = (mode) => {
  const descriptions = {
    regular: t('configuration.settings.display_settings.web_inventory_mode_regular_description'),
    allocated: t('configuration.settings.display_settings.web_inventory_mode_allocated_description')
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
