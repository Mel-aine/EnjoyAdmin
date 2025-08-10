<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Check In and Reservation Settings</h1>
          <p class="text-gray-600 mt-1">
            Configure check-in and checkout times, day use options, late checkout policies, cancellation fees, no-show fees, and other reservation settings.
          </p>
        </div>
        <BasicButton variant="primary" icon="Save" label="Save Changes" @click="saveSettings" />
      </div>
      
      <div class="space-y-6">
        <!-- Check In and Check Out Time Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Check In and Check Out Time Settings</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="twentyFourHourCheckout"
                  v-model="timeSettings.twentyFourHourCheckout"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="twentyFourHourCheckout" class="ml-2 block text-sm text-gray-900">
                  24 Hours Check Out
                </label>
              </div>
              
              <div v-if="!timeSettings.twentyFourHourCheckout" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Check In Time
                  </label>
                  <Input
                    v-model="timeSettings.checkInTime"
                    type="time"
                    placeholder="Select check-in time"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Check Out Time
                  </label>
                  <Input
                    v-model="timeSettings.checkOutTime"
                    type="time"
                    placeholder="Select check-out time"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Day Use Options -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Day Use Options</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="autoPostDayUse"
                  v-model="dayUseSettings.autoPost"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="autoPostDayUse" class="ml-2 block text-sm text-gray-900">
                  Auto Post for Day Use
                </label>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Grace Period (Hours)
                  </label>
                  <Input
                    v-model="dayUseSettings.gracePeriodHours"
                    type="number"
                    placeholder="Enter grace period in hours"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    % of Room Charge
                  </label>
                  <Input
                    v-model="dayUseSettings.roomChargePercentage"
                    type="number"
                    placeholder="Enter percentage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Late Check Out Options -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Late Check Out Options</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="autoPostLateCheckout"
                  v-model="lateCheckoutSettings.autoPost"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="autoPostLateCheckout" class="ml-2 block text-sm text-gray-900">
                  Auto Post for Late Checkout
                </label>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Grace Period (Hours)
                  </label>
                  <Input
                    v-model="lateCheckoutSettings.gracePeriodHours"
                    type="number"
                    placeholder="Enter grace period in hours"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    % of Room Charge
                  </label>
                  <Input
                    v-model="lateCheckoutSettings.roomChargePercentage"
                    type="number"
                    placeholder="Enter percentage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cancellation Fee Options -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Cancellation Fee Options</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="postCancellationFee"
                  v-model="cancellationSettings.postFee"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="postCancellationFee" class="ml-2 block text-sm text-gray-900">
                  Post Cancellation Fee
                </label>
              </div>
              
              <div v-if="cancellationSettings.postFee" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Fee Type
                  </label>
                  <Select
                    v-model="cancellationSettings.feeType"
                    :options="feeTypeOptions"
                    placeholder="Select fee type"
                  />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="cancellationSettings.feeType === 'percentage'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Percentage (%)
                    </label>
                    <Input
                      v-model="cancellationSettings.percentage"
                      type="number"
                      placeholder="Enter percentage"
                    />
                  </div>
                  
                  <div v-if="cancellationSettings.feeType === 'fixed'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Fixed Amount
                    </label>
                    <Input
                      v-model="cancellationSettings.fixedAmount"
                      type="number"
                      placeholder="Enter fixed amount"
                    />
                  </div>
                  
                  <div v-if="cancellationSettings.feeType === 'nights'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Number of Nights
                    </label>
                    <Input
                      v-model="cancellationSettings.numberOfNights"
                      type="number"
                      placeholder="Enter number of nights"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Days Before Reservation
                    </label>
                    <Input
                      v-model="cancellationSettings.daysBeforeReservation"
                      type="number"
                      placeholder="Enter days"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Days Before Arrival
                    </label>
                    <Input
                      v-model="cancellationSettings.daysBeforeArrival"
                      type="number"
                      placeholder="Enter days"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Show Fee Options -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">No Show Fee Options</h2>
            
            <div class="space-y-6">
              <div class="flex items-center">
                <input
                  id="postNoShowFee"
                  v-model="noShowSettings.postFee"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="postNoShowFee" class="ml-2 block text-sm text-gray-900">
                  Post No Show Fee
                </label>
              </div>
              
              <div v-if="noShowSettings.postFee" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    No Show Fee Type
                  </label>
                  <Select
                    v-model="noShowSettings.feeType"
                    :options="feeTypeOptions"
                    placeholder="Select fee type"
                  />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="noShowSettings.feeType === 'percentage'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Percentage (%)
                    </label>
                    <Input
                      v-model="noShowSettings.percentage"
                      type="number"
                      placeholder="Enter percentage"
                    />
                  </div>
                  
                  <div v-if="noShowSettings.feeType === 'fixed'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Fixed Amount
                    </label>
                    <Input
                      v-model="noShowSettings.fixedAmount"
                      type="number"
                      placeholder="Enter fixed amount"
                    />
                  </div>
                  
                  <div v-if="noShowSettings.feeType === 'nights'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Number of Nights
                    </label>
                    <Input
                      v-model="noShowSettings.numberOfNights"
                      type="number"
                      placeholder="Enter number of nights"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Financial Year Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Financial Year Settings</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Financial Year Start Month
                </label>
                <Select
                  v-model="financialSettings.startMonth"
                  :options="monthOptions"
                  placeholder="Select start month"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Financial Year Start Day
                </label>
                <Input
                  v-model="financialSettings.startDay"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Enter start day"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mandatory Information -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Mandatory Information</h2>
            <p class="text-gray-600 mb-6">Select information that must be provided during reservation and/or walk-in.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="field in mandatoryFields" :key="field.key" class="flex items-center">
                <input
                  :id="field.key"
                  v-model="field.required"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label :for="field.key" class="ml-2 block text-sm text-gray-900">
                  {{ field.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Other Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Other Settings</h2>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-center">
                  <input
                    id="emailReservationVoucher"
                    v-model="otherSettings.emailReservationVoucher"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label for="emailReservationVoucher" class="ml-2 block text-sm text-gray-900">
                    Email Reservation Voucher
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="allowOverbooking"
                    v-model="otherSettings.allowOverbooking"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <label for="allowOverbooking" class="ml-2 block text-sm text-gray-900">
                    Allow Overbooking
                  </label>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Base Occupancy
                  </label>
                  <Input
                    v-model="otherSettings.baseOccupancy"
                    type="number"
                    placeholder="Enter base occupancy"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Front Rate Mode
                  </label>
                  <Select
                    v-model="otherSettings.frontRateMode"
                    :options="frontRateModeOptions"
                    placeholder="Select rate mode"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Send Review Email Link To
                  </label>
                  <Select
                    v-model="otherSettings.sendReviewEmailTo"
                    :options="reviewEmailOptions"
                    placeholder="Select target"
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
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'

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
  { key: 'guestName', name: 'Guest Name', required: true },
  { key: 'guestIdentity', name: 'Guest Identity', required: true },
  { key: 'marketCode', name: 'Market Code', required: false },
  { key: 'holdType', name: 'Hold Type', required: false },
  { key: 'travelAgent', name: 'Travel Agent', required: false },
  { key: 'company', name: 'Company', required: false },
  { key: 'businessSource', name: 'Business Source', required: false },
  { key: 'nationality', name: 'Nationality', required: true },
  { key: 'guestAddress', name: 'Guest Address', required: true }
])

const otherSettings = ref({
  emailReservationVoucher: true,
  allowOverbooking: false,
  baseOccupancy: 2,
  frontRateMode: 'inclusive',
  sendReviewEmailTo: 'all'
})

const feeTypeOptions = [
  { label: '% of Total Charges', value: 'percentage' },
  { label: 'Fixed Amount', value: 'fixed' },
  { label: 'First Night(s) Charge', value: 'nights' }
]

const monthOptions = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
  { label: 'March', value: 'march' },
  { label: 'April', value: 'april' },
  { label: 'May', value: 'may' },
  { label: 'June', value: 'june' },
  { label: 'July', value: 'july' },
  { label: 'August', value: 'august' },
  { label: 'September', value: 'september' },
  { label: 'October', value: 'october' },
  { label: 'November', value: 'november' },
  { label: 'December', value: 'december' }
]

const frontRateModeOptions = [
  { label: 'Inclusive', value: 'inclusive' },
  { label: 'Exclusive', value: 'exclusive' },
  { label: 'Regular', value: 'regular' },
  { label: 'Advanced', value: 'advanced' }
]

const reviewEmailOptions = [
  { label: 'Web Booker', value: 'web_booker' },
  { label: 'All Guests', value: 'all' }
]

const saveSettings = () => {
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
  
  // TODO: Implement save functionality
  console.log('Save check-in and reservation settings:', settings)
  alert('Check-in and reservation settings saved successfully!')
}
</script>
