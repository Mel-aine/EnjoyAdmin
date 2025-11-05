<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('configuration.settings.check_in_reservation_settings.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            {{ $t('configuration.settings.check_in_reservation_settings.description') }}
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" :label="$t('configuration.settings.check_in_reservation_settings.save_changes')" @click="saveSettings" :loading="isLoading" />
      </div>
      
      <div class="space-y-6">
        <!-- Check In and Check Out Time Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.check_in_check_out_time_settings') }}</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="twentyFourHourCheckout"
                  v-model="timeSettings.twentyFourHourCheckout"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                >
                <label for="twentyFourHourCheckout" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {{ $t('configuration.settings.check_in_reservation_settings.twenty_four_hours_check_out') }}
                </label>
              </div>
              
              <div v-if="!timeSettings.twentyFourHourCheckout" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    v-model="timeSettings.checkInTime"
                    type="time"
                    :lb="$t('configuration.settings.check_in_reservation_settings.check_in_time')"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.select_check_in_time')"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="timeSettings.checkOutTime"
                    type="time"
                    :lb="$t('configuration.settings.check_in_reservation_settings.check_out_time')"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.select_check_out_time')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Day Use Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.day_use_options') }}</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="autoPostDayUse"
                  v-model="dayUseSettings.autoPost"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                >
                <label for="autoPostDayUse" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {{ $t('configuration.settings.check_in_reservation_settings.auto_post_for_day_use') }}
                </label>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    v-model="dayUseSettings.gracePeriodHours"
                    type="number"
                    :lb="$t('configuration.settings.check_in_reservation_settings.grace_period_hours')"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_grace_period_in_hours')"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="dayUseSettings.roomChargePercentage"
                    type="number"
                    :lb="$t('configuration.settings.check_in_reservation_settings.percent_of_room_charge')"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_percentage')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Late Check Out Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.late_check_out_options') }}</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="autoPostLateCheckout"
                  v-model="lateCheckoutSettings.autoPost"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                >
                <label for="autoPostLateCheckout" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {{ $t('configuration.settings.check_in_reservation_settings.auto_post_for_late_checkout') }}
                </label>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    v-model="lateCheckoutSettings.gracePeriodHours"
                    type="number"
                    :lb="$t('configuration.settings.check_in_reservation_settings.grace_period_hours')"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_grace_period_in_hours')"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="lateCheckoutSettings.roomChargePercentage"
                    type="number"
                    :lb="$t('configuration.settings.check_in_reservation_settings.percent_of_room_charge')"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_percentage')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cancellation Fee Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.cancellation_fee_options') }}</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="postCancellationFee"
                  v-model="cancellationSettings.postFee"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                >
                <label for="postCancellationFee" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {{ $t('configuration.settings.check_in_reservation_settings.post_cancellation_fee') }}
                </label>
              </div>
              
              <div v-if="cancellationSettings.postFee" class="space-y-6">
                <div>
                  <Select
                    v-model="cancellationSettings.feeType"
                    :lb="$t('configuration.settings.check_in_reservation_settings.cancellation_fee_type')"
                    :options="feeTypeOptions"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.select_fee_type')"
                  />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="cancellationSettings.feeType === 'percentage'">
                    <Input
                      v-model="cancellationSettings.percentage"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.percentage')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_percentage')"
                    />
                  </div>
                  
                  <div v-if="cancellationSettings.feeType === 'fixed'">
                    <Input
                      v-model="cancellationSettings.fixedAmount"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.fixed_amount')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_fixed_amount')"
                    />
                  </div>
                  
                  <div v-if="cancellationSettings.feeType === 'nights'">
                    <Input
                      v-model="cancellationSettings.numberOfNights"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.number_of_nights')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_number_of_nights')"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      v-model="cancellationSettings.daysBeforeReservation"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.days_before_reservation')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_days')"
                    />
                  </div>
                  
                  <div>
                    <Input
                      v-model="cancellationSettings.daysBeforeArrival"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.days_before_arrival')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_days')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Show Fee Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.no_show_fee_options') }}</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="postNoShowFee"
                  v-model="noShowSettings.postFee"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="postNoShowFee" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {{ $t('configuration.settings.check_in_reservation_settings.post_no_show_fee') }}
                </label>
              </div>
              
              <div v-if="noShowSettings.postFee" class="space-y-6">
                <div>
                  <Select
                    v-model="noShowSettings.feeType"
                    :lb="$t('configuration.settings.check_in_reservation_settings.no_show_fee_type')"
                    :options="feeTypeOptions"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.select_fee_type')"
                  />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="noShowSettings.feeType === 'percentage'">
                    <Input
                      v-model="noShowSettings.percentage"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.percentage')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_percentage')"
                    />
                  </div>
                  
                  <div v-if="noShowSettings.feeType === 'fixed'">
                    <Input
                      v-model="noShowSettings.fixedAmount"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.fixed_amount')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_fixed_amount')"
                    />
                  </div>
                  
                  <div v-if="noShowSettings.feeType === 'nights'">
                    <Input
                      v-model="noShowSettings.numberOfNights"
                      type="number"
                      :lb="$t('configuration.settings.check_in_reservation_settings.number_of_nights')"
                      :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_number_of_nights')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Financial Year Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.financial_year_settings') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  v-model="financialSettings.startMonth"
                  :lb="$t('configuration.settings.check_in_reservation_settings.financial_year_start_month')"
                  :options="monthOptions"
                  :placeholder="$t('configuration.settings.check_in_reservation_settings.select_start_month')"
                />
              </div>
              
              <div>
                <Input
                  v-model="financialSettings.startDay"
                  type="number"
                  min="1"
                  max="31"
                  :lb="$t('configuration.settings.check_in_reservation_settings.financial_year_start_day')"
                  :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_start_day')"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mandatory Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.mandatory_information') }}</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.mandatory_information_description') }}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="field in mandatoryFields" :key="field.key" class="flex items-center">
                <input
                  :id="field.key"
                  v-model="field.required"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label :for="field.key" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {{ $t(`configuration.settings.check_in_reservation_settings.${field.key}`) }}
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Other Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.check_in_reservation_settings.other_settings') }}</h2>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-center">
                  <input
                    id="emailReservationVoucher"
                    v-model="otherSettings.emailReservationVoucher"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label for="emailReservationVoucher" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    {{ $t('configuration.settings.check_in_reservation_settings.email_reservation_voucher') }}
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="allowOverbooking"
                    v-model="otherSettings.allowOverbooking"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label for="allowOverbooking" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    {{ $t('configuration.settings.check_in_reservation_settings.allow_overbooking') }}
                  </label>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    v-model="otherSettings.baseOccupancy"
                    type="number"
                    :lb="$t('configuration.settings.check_in_reservation_settings.base_occupancy')"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.enter_base_occupancy')"
                  />
                </div>
                
                <div>
                  <Select
                    v-model="otherSettings.frontRateMode"
                    :lb="$t('configuration.settings.check_in_reservation_settings.front_rate_mode')"
                    :options="frontRateModeOptions"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.select_rate_mode')"
                  />
                </div>
                
                <div>
                  <Select
                    v-model="otherSettings.sendReviewEmailTo"
                    :lb="$t('configuration.settings.check_in_reservation_settings.send_review_email_link_to')"
                    :options="reviewEmailOptions"
                    :placeholder="$t('configuration.settings.check_in_reservation_settings.select_target')"
                  />
                </div>
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
import { updateHotelCheckinReservationSettings } from '../../../services/hotelApi'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

const timeSettings = ref({
  twentyFourHourCheckout: false,
  checkInTime: '15:00',
  checkOutTime: '11:00'
})

const dayUseSettings = ref({
  autoPost: true,
  gracePeriodHours: 2,
  roomChargePercentage: 50
})

const lateCheckoutSettings = ref({
  autoPost: true,
  gracePeriodHours: 1,
  roomChargePercentage: 25
})

const cancellationSettings = ref({
  postFee: true,
  feeType: 'percentage',
  percentage: 10,
  fixedAmount: 0,
  numberOfNights: 1,
  daysBeforeReservation: 7,
  daysBeforeArrival: 1
})

const noShowSettings = ref({
  postFee: true,
  feeType: 'nights',
  percentage: 0,
  fixedAmount: 0,
  numberOfNights: 1
})

const financialSettings = ref({
  startMonth: 'january',
  startDay: 1
})

const mandatoryFields = ref([
  { key: 'guestName', required: true },
  { key: 'guestIdentity', required: true },
  { key: 'marketCode', required: false },
  { key: 'holdType', required: false },
  { key: 'travelAgent', required: false },
  { key: 'company', required: false },
  { key: 'businessSource', required: false },
  { key: 'nationality', required: true },
  { key: 'guestAddress', required: true }
])

const otherSettings = ref({
  emailReservationVoucher: true,
  allowOverbooking: false,
  baseOccupancy: 2,
  frontRateMode: 'inclusive',
  sendReviewEmailTo: 'all'
})

const feeTypeOptions = computed(() => [
  { label: t('configuration.settings.check_in_reservation_settings.percent_of_total_charges'), value: 'percentage' },
  { label: t('configuration.settings.check_in_reservation_settings.fixed_amount'), value: 'fixed' },
  { label: t('configuration.settings.check_in_reservation_settings.first_nights_charge'), value: 'nights' }
])

const monthOptions = computed(() => [
  { label: t('january'), value: 'january' },
  { label: t('february'), value: 'february' },
  { label: t('march'), value: 'march' },
  { label: t('april'), value: 'april' },
  { label: t('may'), value: 'may' },
  { label: t('june'), value: 'june' },
  { label: t('july'), value: 'july' },
  { label: t('august'), value: 'august' },
  { label: t('september'), value: 'september' },
  { label: t('october'), value: 'october' },
  { label: t('november'), value: 'november' },
  { label: t('december'), value: 'december' }
])

const frontRateModeOptions = computed(() => [
  { label: t('configuration.settings.check_in_reservation_settings.inclusive'), value: 'inclusive' },
  { label: t('configuration.settings.check_in_reservation_settings.exclusive'), value: 'exclusive' },
  { label: t('configuration.settings.check_in_reservation_settings.regular'), value: 'regular' },
  { label: t('configuration.settings.check_in_reservation_settings.advanced'), value: 'advanced' }
])

const reviewEmailOptions = computed(() => [
  { label: t('configuration.settings.check_in_reservation_settings.web_booker'), value: 'web_booker' },
  { label: t('configuration.settings.check_in_reservation_settings.all_guests'), value: 'all' }
])

// Load checkin reservation settings from current service
const loadCheckinReservationSettingsFromService = () => {
  if (currentService.value && currentService.value.checkinReservationSettings) {
    const serviceSettings = currentService.value.checkinReservationSettings
    
    if (serviceSettings.timeSettings) {
      timeSettings.value = { ...timeSettings.value, ...serviceSettings.timeSettings }
    }
    if (serviceSettings.dayUseSettings) {
      dayUseSettings.value = { ...dayUseSettings.value, ...serviceSettings.dayUseSettings }
    }
    if (serviceSettings.lateCheckoutSettings) {
      lateCheckoutSettings.value = { ...lateCheckoutSettings.value, ...serviceSettings.lateCheckoutSettings }
    }
    if (serviceSettings.cancellationSettings) {
      cancellationSettings.value = { ...cancellationSettings.value, ...serviceSettings.cancellationSettings }
    }
    if (serviceSettings.noShowSettings) {
      noShowSettings.value = { ...noShowSettings.value, ...serviceSettings.noShowSettings }
    }
    if (serviceSettings.financialSettings) {
      financialSettings.value = { ...financialSettings.value, ...serviceSettings.financialSettings }
    }
    if (serviceSettings.mandatoryFields) {
      mandatoryFields.value = { ...mandatoryFields.value, ...serviceSettings.mandatoryFields }
    }
    if (serviceSettings.otherSettings) {
      otherSettings.value = { ...otherSettings.value, ...serviceSettings.otherSettings }
    }
  }
}

const saveSettings = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.checkinReservationSettingsUpdateError'))
    return
  }

  isLoading.value = true
  
  try {
    const settings = {
      timeSettings: timeSettings.value,
      dayUseSettings: dayUseSettings.value,
      lateCheckoutSettings: lateCheckoutSettings.value,
      cancellationSettings: cancellationSettings.value,
      noShowSettings: noShowSettings.value,
      financialSettings: financialSettings.value,
      mandatoryFields: mandatoryFields.value,
      otherSettings: otherSettings.value
    }
    
    // Call API to update checkin reservation settings
    await updateHotelCheckinReservationSettings(currentService.value.id, { checkinReservationSettings: settings })
    
    // Update the service store with new checkin reservation settings
    const updatedService = {
      ...currentService.value,
      checkinReservationSettings: settings
    }
    serviceStore.setCurrentService(updatedService)
    
    // Show success toast
    toast.success(t('toast.checkinReservationSettingsUpdated'))
  } catch (error) {
    console.error('Error saving checkin reservation settings:', error)
    toast.error(t('toast.checkinReservationSettingsUpdateError'))
  } finally {
    isLoading.value = false
  }
}

// Load checkin reservation settings when component mounts
onMounted(() => {
  loadCheckinReservationSettingsFromService()
})
</script>
