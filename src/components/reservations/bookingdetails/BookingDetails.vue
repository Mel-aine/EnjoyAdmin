<template>
  <div class="bg-white rounded-lg shadow-md p-6 mx-4 mt-4">
    <!-- Status Bar -->
    <div class="flex space-x-6 mb-6 text-sm">
      <span class="text-gray-600">{{ $t('All') }} 3</span>
      <span class="text-gray-600">{{ $t('Reserved') }} 0</span>
      <span class="text-gray-600">{{ $t('Due Out') }} 0</span>
      <span class="text-gray-600">{{ $t('Departed') }} 1</span>
      <span class="text-gray-600">{{ $t('Void') }} 1</span>
      <span class="text-gray-600">{{ $t('No Show') }} 0</span>
      <span class="text-gray-600">{{ $t('In House') }} 0</span>
      <span class="text-gray-600">{{ $t('Cancel') }} 0</span>
      <div class="ml-auto flex space-x-6">
        <span class="text-gray-600">{{ $t('Remark') }} 0</span>
        <span class="text-gray-600">{{ $t('Task') }} 0</span>
        <span class="text-gray-600">{{ $t('Message') }} 0</span>
        <span class="text-gray-600">{{ $t('Preference') }} 0</span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Left Section - Room Details (style Room/Guest appliqué) -->
      <div class="col-span-2 border-r-2 border-gray-100 bg-gray-50 rounded-lg">
        <div class="h-full flex flex-col justify-between">
          <div class="bg-white h-full rounded-lg">
            <div class="flex justify-between pt-2 px-2 pb-2">
              <span>{{ $t('Room') }}</span>
            </div>
            <div class="text-sm text-gray-600 mb-2 px-2">♦ {{ $t('Single') }}</div>
            
            <div class="space-y-2 px-2">
              <div 
                v-for="room in rooms" 
                :key="room.number"
                class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 my-1 rounded"
                :class="
                  selectedRoom?.number === room.number
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'bg-gray-100'
                "
                @click="selectRoom(room)"
              >
                <span>{{ room.number }} - {{ room.guest }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <!-- Financial Summary -->
          <div class="mt-6 space-y-4 px-4">
            <div class="text-center">
              <div class="text-sm font-medium text-gray-700 mb-1">{{ $t('Total') }}</div>
              <div class="text-base font-semibold text-gray-900">Rs 600.00</div>
            </div>
            <div class="text-center">
              <div class="text-sm font-medium text-gray-700 mb-1">{{ $t('Balance') }}</div>
              <div class="text-base font-semibold text-red-600">Rs 600.00</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section - Billing Information -->
      <div class="col-span-5">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-900 flex items-center text-xl">
              {{ $t('Billing Information') }}
            </h3>
          </div>
          
          <div class="space-y-4">
            <!-- Bill To and Type Section -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="$t('Bill To')"
                  v-model="billingData.billTo"
                  :options="billToOptions"
                  :placeholder="$t('Company')"
                  :disabled="!editMode"
                />
              </div>
              
              <!-- Type Section -->
              <div>
                <div class="flex space-x-4">
                    <Radio
                      :label="$t('type')"
                      :options="[
                        { value: 'cash', label: $t('Cash') },
                        { value: 'credit', label: $t('Credit') }
                      ]"
                      v-model="billingData.type"
                      :disabled="!editMode"
                    />
                </div>
              </div>
            </div>

            <!-- Payment Mode and GSTIN -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="$t('Payment Mode')"
                  v-model="billingData.paymentMode"
                  :options="paymentModeOptions"
                  :placeholder="$t('Cash')"
                  :disabled="!editMode"
                />
              </div>
              
              <div>
                <Input
                  :lb="$t('GSTIN No')"
                  v-model="billingData.gstinNo"
                  type="text"
                  :placeholder="$t('GST Number')"
                  :disabled="!editMode"
                />
              </div>
            </div>

            <!-- Reservation Type -->
            <div>
              <Select
                :lb="$t('Reservation Type')"
                v-model="billingData.reservationType"
                :options="reservationTypeOptions"
                :placeholder="$t('Confirm Booking')"
                :disabled="!editMode"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section - Source Information -->
      <div class="col-span-5">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-xl text-gray-900 mb-4">{{ $t('Source Information') }}</h3>
            <button
              class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              @click="toggleEditMode"
            >
              <svg
                v-if="!editMode"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>{{ editMode ? $t('Cancel') : $t('Edit') }}</span>
            </button>
          </div>
          <div class="space-y-4">
            <!-- Market Code and Business Source -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="$t('Market Code')"
                  v-model="sourceData.marketCode"
                  :options="marketCodeOptions"
                  :placeholder="$t('-Select-')"
                  :disabled="!editMode"
                />
              </div>
              
              <div>
                <Select
                  :lb="$t('Business Source')"
                  v-model="sourceData.businessSource"
                  :options="businessSourceOptions"
                  :placeholder="$t('-Select-')"
                  :disabled="!editMode"
                />
              </div>
            </div>

            <!-- Travel agent and Voucher No -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('Travelagent') }}</label>
                <div class="flex">
                  <div class="flex-1">
                    <Select
                      v-model="sourceData.travelAgent"
                      :options="travelAgentOptions"
                      :placeholder="$t('-Select-')"
                      :disabled="!editMode"
                      customClass="rounded-r-none"
                    />
                  </div>
                  <button 
                    class="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-300 transition-colors"
                    :disabled="!editMode"
                  >
                    <UserCircleIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <Input
                  :lb="$t('Voucher No.')"
                  v-model="sourceData.voucherNo"
                  type="text"
                  :placeholder="$t('Voucher No')"
                  :disabled="!editMode"
                />
              </div>
            </div>

            <!-- Commission Plan and Plan Value -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="$t('Commission Plan')"
                  v-model="sourceData.commissionPlan"
                  :options="commissionPlanOptions"
                  :placeholder="$t('--Select--')"
                  :disabled="!editMode"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('Plan Value') }}</label>
                <div class="flex">
                  <input 
                    type="text" 
                    v-model="sourceData.planValue"
                    :placeholder="$t('Plan Value')" 
                    :disabled="!editMode"
                    class="h-11 flex-1 rounded-lg rounded-r-none border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800 disabled:bg-gray-50"
                  >
                  <span class="h-11 px-3 py-2.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600 flex items-center">Rs</span>
                </div>
              </div>
            </div>

            <!-- Company and Sales Person -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('Company') }}</label>
                <div class="flex">
                  <div class="flex-1">
                    <Select
                      v-model="sourceData.company"
                      :options="companyOptions"
                      :placeholder="$t('-Select-')"
                      :disabled="!editMode"
                      customClass="rounded-r-none"
                    />
                  </div>
                    <button 
                      class="px-3 py-2.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600 flex items-center hover:bg-gray-300 transition-colors"
                      :disabled="!editMode"
                    >
                      <Building class="w-4 h-4" />
                    </button>
                </div>

              </div>
              
              <div>
                <Select
                  :lb="$t('Sales Person')"
                  v-model="sourceData.salesPerson"
                  :options="salesPersonOptions"
                  :placeholder="$t('-Select-')"
                  :disabled="!editMode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="mt-6 bg-gray-50 p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6 flex-wrap text-sm">
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.sendMail" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('Send Mail') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.checkOutMail" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('Check Out Mail') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.thankYouEmail" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('Thank You email to Guest') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.suppressRate" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('Supress Rate on GR Card') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox 
              type="checkbox" 
              v-model="options.accessGuestPortal" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('Access Guest Portal') }}
          </label>
        </div>
        
        <div class="flex items-center space-x-3">
          <BasicButton variant="secondary" :label="$t('Apply To Group')" @click="applyToGroup" :disabled="!editMode" />
          <BasicButton 
            v-if="editMode"
            variant="primary" 
            :label="$t('Save Changes')" 
            @click="saveChanges"
            :disabled="isSaving"
            :loading="isSaving" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BasicButton from '../../buttons/BasicButton.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputCheckbox from '../../forms/FormElements/InputCheckBox.vue'
import Radio from '@/components/forms/FormElements/RadioGroup .vue'
import Select from '../../forms/FormElements/Select.vue'
import { ChevronRight, Building } from 'lucide-vue-next'
import UserCircleIcon from '@/icons/UserCircleIcon.vue'
import { formatCurrency } from '../../utilities/UtilitiesFunction'

interface Props {
  booking?: any
}

interface BillingData {
  billTo: string
  paymentMode: string
  type: string
  gstinNo: string
  reservationType: string
}

interface SourceData {
  marketCode: string
  businessSource: string
  travelAgent: string
  voucherNo: string
  commissionPlan: string
  planValue: string
  company: string
  salesPerson: string
}

interface Options {
  sendMail: boolean
  checkOutMail: boolean
  thankYouEmail: boolean
  suppressRate: boolean
  accessGuestPortal: boolean
}

interface Room {
  number: string
  guest: string
  type: string
  rate: string
  status: string
  checkIn: string
  checkOut: string
  nights: number
}

const props = withDefaults(defineProps<Props>(), {
  booking: () => ({})
})

const { t, locale } = useI18n()
const toast = useToast()
const editMode = ref(false)
const isSaving = ref(false)
const selectedRoom = ref<Room | null>(null)

// Données des chambres
const rooms = ref<Room[]>([
  { number: '132', guest: 'Mr. Ashu', type: 'Single', rate: 'Rs 200.00', status: 'Reserved', checkIn: '2023-10-15', checkOut: '2023-10-17', nights: 2 },
  { number: '133', guest: 'Mr. Ashu', type: 'Single', rate: 'Rs 200.00', status: 'In House', checkIn: '2023-10-15', checkOut: '2023-10-18', nights: 3 },
  { number: '131', guest: 'Mr. Ashu', type: 'Single', rate: 'Rs 200.00', status: 'Void', checkIn: '2023-10-16', checkOut: '2023-10-19', nights: 3 }
])

// Reactive data
const billingData = reactive<BillingData>({
  billTo: 'company',
  paymentMode: 'cash',
  type: 'cash',
  gstinNo: '',
  reservationType: 'confirm_booking'
})

const sourceData = reactive<SourceData>({
  marketCode: '',
  businessSource: '',
  travelAgent: '',
  voucherNo: '',
  commissionPlan: '',
  planValue: '',
  company: '',
  salesPerson: ''
})

const options = reactive<Options>({
  sendMail: false,
  checkOutMail: false,
  thankYouEmail: false,
  suppressRate: false,
  accessGuestPortal: false
})

// Options for select fields
const billToOptions = computed(() => [
  { label: t('Company'), value: 'company' },
  { label: t('Individual'), value: 'individual' },
  { label: t('Agent'), value: 'agent' }
])

const paymentModeOptions = computed(() => [
  { label: t('Cash'), value: 'cash' },
  { label: t('Credit Card'), value: 'credit_card' },
  { label: t('Bank Transfer'), value: 'bank_transfer' },
  { label: t('Check'), value: 'check' }
])

const reservationTypeOptions = computed(() => [
  { label: t('Confirm Booking'), value: 'confirm_booking' },
  { label: t('Tentative Booking'), value: 'tentative_booking' },
  { label: t('Waitlist'), value: 'waitlist' }
])

const marketCodeOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('Corporate'), value: 'corporate' },
  { label: t('Leisure'), value: 'leisure' },
  { label: t('Group'), value: 'group' }
])

const businessSourceOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('Walk-in'), value: 'walk_in' },
  { label: t('Online'), value: 'online' },
  { label: t('Phone'), value: 'phone' },
  { label: t('Agent'), value: 'agent' }
])

const travelAgentOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('Agent 1'), value: 'agent_1' },
  { label: t('Agent 2'), value: 'agent_2' }
])

const commissionPlanOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('Standard 10%'), value: 'standard_10' },
  { label: t('Premium 15%'), value: 'premium_15' }
])

const companyOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('Company A'), value: 'company_a' },
  { label: t('Company B'), value: 'company_b' }
])

const salesPersonOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('Sales Rep 1'), value: 'sales_1' },
  { label: t('Sales Rep 2'), value: 'sales_2' }
])

const bookingData = computed(() => props.booking)

// Methods
const selectRoom = (room: Room) => {
  selectedRoom.value = room
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (!editMode.value) {
    // Reset data when canceling edit
  }
}

const saveChanges = async () => {
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Saving billing data:', billingData)
    console.log('Saving source data:', sourceData)
    console.log('Saving options:', options)
    
    toast.success(t('Changes saved successfully'))
    editMode.value = false
  } catch (error) {
    console.error('Error saving changes:', error)
    toast.error(t('Error saving changes'))
  } finally {
    isSaving.value = false
  }
}

const applyToGroup = () => {
  console.log('Applying to group...')
  toast.info(t('Applied to group'))
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(locale.value, options)
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    checked_in: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    checked_out: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

console.log('booking', props.booking)
</script>

<style scoped>
.border-l-4 {
  border-left-width: 4px;
}

input[type="radio"]:disabled + span {
  opacity: 0.6;
  cursor: not-allowed;
}

input[type="checkbox"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.transition-colors {
  transition: background-color 0.2s, color 0.2s;
}
</style>