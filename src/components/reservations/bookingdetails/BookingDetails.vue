<template>
  <div class="bg-white rounded-lg shadow-md p-4 md:p-6 mx-2 md:mx-4 mt-4">
    <!-- Status Bar -->
    <div class="flex flex-wrap gap-3 md:gap-6 mb-4 md:mb-6 text-xs md:text-sm">
      <span class="text-gray-600">{{ $t('All') }} {{ totalRooms }}</span>
      <span class="text-gray-600">{{ $t('Reserved') }} {{ statusCounts.reserved }}</span>
      <span class="text-gray-600">{{ $t('DueOut') }} {{ statusCounts.dueOut }}</span>
      <span class="text-gray-600">{{ $t('Departed') }} {{ statusCounts.departed }}</span>
      <span class="text-gray-600">{{ $t('Void') }} {{ statusCounts.void }}</span>
      <span class="text-gray-600">{{ $t('NoShow') }} {{ statusCounts.noShow }}</span>
      <span class="text-gray-600">{{ $t('InHouse') }} {{ statusCounts.inHouse }}</span>
      <span class="text-gray-600">{{ $t('Cancel') }} {{ statusCounts.cancel }}</span>
      <div class="ml-auto flex flex-wrap gap-3 md:gap-6">
        <span class="text-gray-600">{{ $t('Remark') }} {{ remarkCount }}</span>
        <span class="text-gray-600">{{ $t('Task') }} {{ taskCount }}</span>
        <span class="text-gray-600">{{ $t('Message') }} {{ messageCount }}</span>
        <span class="text-gray-600">{{ $t('Preference') }} {{ preferenceCount }}</span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <!-- Left Section - Room Details -->
      <div class="lg:col-span-2 border-r-0 lg:border-r-2 border-gray-100 bg-gray-50 rounded-lg">
        <div class="h-full flex flex-col">
          <div class="bg-white h-full rounded-lg">
            <div class="flex justify-between pt-2 px-2 pb-2">
              <span>{{ $t('Room') }}</span>
            </div>
            <div class="text-sm text-gray-600 mb-2 px-2">♦ {{ roomTypeSummary }}</div>
            
            <div class="space-y-2 px-2">
              <div 
                v-for="room in reservationRooms" 
                :key="room.id"
                class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 my-1 rounded"
                :class="
                  selectedRoom?.id === room.id
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'bg-gray-100'
                "
                @click="selectRoom(room)"
              >
                <span>{{ room.room?.roomNumber }} - {{ getGuestName(room) }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section - Billing Information -->
      <div class="lg:col-span-5">
        <div class="bg-gray-50 rounded-lg p-3 md:p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-900 flex items-center text-lg md:text-xl">
              {{ $t('BillingInformation') }}
            </h3>
          </div>
          
          <div class="space-y-4">
            <!-- Bill To and Type Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="$t('BillTo')"
                  v-model="billingData.billTo"
                  :options="billToOptions"
                  :placeholder="$t('Company')"
                  :disabled="!editMode"
                />
              </div>
              
              <!-- Type Section -->
              <div>
                <div class="flex flex-col md:flex-row md:space-x-4">
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="$t('PaymentMode')"
                  v-model="billingData.paymentMode"
                  :options="paymentModeOptions"
                  :placeholder="$t('Cash')"
                  :disabled="!editMode"
                />
              </div>
              
              <div>
                <Input
                  :lb="$t('GSTINNo')"
                  v-model="billingData.gstinNo"
                  type="text"
                  :placeholder="$t('GSTNumber')"
                  :disabled="!editMode"
                />
              </div>
            </div>

            <!-- Reservation Type -->
            <div>
              <Select
                :lb="$t('ReservationType')"
                v-model="billingData.reservationType"
                :options="reservationTypeOptions"
                :placeholder="$t('ConfirmBooking')"
                :disabled="!editMode"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section - Source Information -->
      <div class="lg:col-span-5">
        <div class="bg-gray-50 rounded-lg p-3 md:p-4">
          <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-lg md:text-xl text-gray-900 mb-4">{{ $t('SourceInformation') }}</h3>
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  :lb="$t('MarketCode')"
                  v-model="sourceData.marketCode"
                  :options="marketCodeOptions"
                  :placeholder="$t('-Select-')"
                  :disabled="!editMode"
                />
              </div>
              
              <div>
                <Select
                  :lb="$t('BusinessSource')"
                  v-model="sourceData.businessSource"
                  :options="BusinessSource"
                  :placeholder="$t('-Select-')"
                  :disabled="!editMode"
                />
              </div>
            </div>

            <!-- Travel agent and Voucher No -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  :lb="$t('VoucherNo')"
                  v-model="sourceData.voucherNo"
                  type="text"
                  :placeholder="$t('VoucherNo')"
                  :disabled="!editMode"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('Company') }}</label>
                  <div class="flex">
                    <div class="flex-1">
                      <Select
                        v-model="sourceData.company"
                        :options="companyOptions"
                        :placeholder="$t('-Select-')"
                        :disabled="!editMode"
                        customClass="rounded-r-none h-11"
                      />
                    </div>
                    <button 
                      class=" w-11 flex items-center justify-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-300 transition-colors"
                      :disabled="!editMode"
                    >
                      <Building class="w-4 h-4" />
                    </button>
              </div>
            </div> 
              <!-- travel agent -->
<!--               <div>
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
              </div> -->
<!--               <div>
                <div class="flex">
                  <InputCurrency
                    v-model="sourceData.planValue"
                    :lb="$t('PlanValue')"
                    id="plan-value"
                    :disabled="!editMode"
                    :show-currency-selector="true"
                    placeholder="Entrez la valeur du plan"
                    input-type="number"
                    :is-required="false"
                    :min="0"
                  currency="XAF"/>
                </div>
              </div> -->
              
              <!-- Commission -->
<!--               <div>
                <Select
                  :lb="$t('Commission Plan')"
                  v-model="sourceData.commissionPlan"
                  :options="commissionPlanOptions"
                  :placeholder="$t('--Select--')"
                  :disabled="!editMode"
                />
              </div> -->
            </div>

            <!-- Company and Sales Person -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">             
<!--               <div>
                <Select
                  :lb="$t('SalesPerson')"
                  v-model="sourceData.salesPerson"
                  :options="salesPersonOptions"
                  :placeholder="$t('-Select-')"
                  :disabled="!editMode"
                />
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="mt-6 bg-gray-50 p-3 md:p-4 rounded-lg">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Left side - Financial Summary -->
        <div class="flex text-sm">
          <div class="flex flex-col space-y-1">
            <div class="text-gray-700 font-medium">{{ $t('Total') }}</div>
            <div class="font-medium text-orange-600">{{ $t('Balance') }}</div>
          </div>
          <div class="flex flex-col space-y-1 ml-8">
            <div class="font-medium text-gray-700">{{ formatCurrency(totalAmount) }}</div>
            <div class="font-medium text-orange-600">{{ formatCurrency(balanceAmount) }}</div>
          </div>
        </div>

        <!-- Center - Checkboxes -->
        <div class="flex flex-col md:flex-row md:items-center md:space-x-6 gap-2 md:gap-0 text-sm">
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.sendMail" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('SendMail') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.checkOutMail" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('CheckOutMail') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.thankYouEmail" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('ThankYouemailToGuest') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              type="checkbox" 
              v-model="options.suppressRate" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('SupressRateOnGRCard') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox 
              type="checkbox" 
              v-model="options.accessGuestPortal" 
              :disabled="!editMode" 
              class="mr-2"
            />
            {{ $t('AccessGuestPortal') }}
          </label>
        </div>
        
        <!-- Right side - Action Buttons -->
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
          <BasicButton variant="secondary" :label="$t('ApplyToGroup')" @click="applyToGroup" :disabled="!editMode" class="w-full md:w-auto" />
          <BasicButton 
            v-if="editMode"
            variant="primary" 
            :label="$t('SaveChanges')" 
            @click="saveChanges"
            :disabled="isSaving"
            :loading="isSaving" 
            class="w-full md:w-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BasicButton from '../../buttons/BasicButton.vue'
import Input from '../../forms/FormElements/Input.vue'
import InputCheckbox from '../../forms/FormElements/InputCheckBox.vue'
import Radio from '@/components/forms/FormElements/RadioGroup .vue'
import Select from '../../forms/FormElements/Select.vue'
import { ChevronRight, Building } from 'lucide-vue-next'
import InputCurrency from '../../forms/FormElements/InputCurrency.vue'
import { formatCurrency } from '../../utilities/UtilitiesFunction'
import { useBooking } from '@/composables/useBooking2'

interface Props {
  booking?: any
  guest?: any
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

const props = withDefaults(defineProps<Props>(), {
  booking: () => ({}),
  guest: () => ({})
})

const { t, locale } = useI18n()
const toast = useToast()
const editMode = ref(false)
const isSaving = ref(false)
const selectedRoom = ref<any>(null)

// Computed properties for booking data
const bookingData = computed(() => props.booking || {})
const guestData = computed(() => props.guest || {})

// Computed properties for room data
const reservationRooms = computed(() => {
  return bookingData.value.reservationRooms || []
})

const selectedRoomId = computed(() => {
  return selectedRoom.value?.id || ''
})

const totalRooms = computed(() => reservationRooms.value.length)

const roomTypeSummary = computed(() => {
  if (reservationRooms.value.length === 0) return 'N/A'
  
  const roomTypes = [...new Set(reservationRooms.value.map((room:any) => room.roomType?.roomTypeName || 'N/A'))]
  return roomTypes.join(', ')
})

const statusCounts = computed(() => {
  const counts = {
    reserved: 0,
    dueOut: 0,
    departed: 0,
    void: 0,
    noShow: 0,
    inHouse: 0,
    cancel: 0
  }
  
  if (!reservationRooms.value.length) return counts
  
  reservationRooms.value.forEach((room:any) => {
    const status = room.status?.toLowerCase() || ''
    if (status.includes('reserved')) counts.reserved++
    if (status.includes('due_out')) counts.dueOut++
    if (status.includes('departed')) counts.departed++
    if (status.includes('void')) counts.void++
    if (status.includes('no_show')) counts.noShow++
    if (status.includes('in_house')) counts.inHouse++
    if (status.includes('cancel')) counts.cancel++
  })
  
  return counts
})

const totalAmount = computed(() => bookingData.value.totalAmount || bookingData.value.total || 0)
const balanceAmount = computed(() => bookingData.value.remainingAmount || bookingData.value.balance || 0)

const remarkCount = computed(() => bookingData.value.remarks?.length || 0)
const taskCount = computed(() => bookingData.value.tasks?.length || 0)
const messageCount = computed(() => bookingData.value.messages?.length || 0)
const preferenceCount = computed(() => guestData.value.preferences?.length || 0)

// Reactive data - Initialiser avec des valeurs vides
const billingData = reactive<BillingData>({
  billTo: '',
  paymentMode: '',
  type: 'cash',
  gstinNo: '',
  reservationType: ''
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


const paymentModeOptions = computed(() => [
  { label: t('Cash'), value: 'cash' },
  { label: t('Credit Card'), value: 'credit_card' },
  { label: t('Bank Transfer'), value: 'bank_transfer' },
  { label: t('Check'), value: 'check' }
])
const {
  // Options
  BookingSource,
  BusinessSource,
  BookingType,
  creditTypes,
  billToOptions,
  emailTemplates,
  reservationId,
} = useBooking()
const reservationTypeOptions = computed(() => [
  { label: t('Confirm Booking'), value: 'confirm_booking' },
  { label: t('Tentative Booking'), value: 'tentative_booking' },
  { label: t('Waitlist'), value: 'waitlist' },
  { label: t('Booking inquiry'), value: 'Booking inquiry' }
])

const marketCodeOptions = computed(() => [
  { label: t('-Select-'), value: '' },
  { label: t('Corporate'), value: 'corporate' },
  { label: t('Leisure'), value: 'leisure' },
  { label: t('Group'), value: 'group' }
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

// Methods
const getGuestName = (room: any) => {
  if (room.guest) {
    return room.guest.displayName || `${room.guest.firstName} ${room.guest.lastName}`
  }
  return guestData.value.displayName || `${guestData.value.firstName} ${guestData.value.lastName}` || t('Guest')
}

const selectRoom = (room: any) => {
  selectedRoom.value = room
  // Mettre à jour les données de source avec les informations de la chambre sélectionnée
  if (room) {
    sourceData.voucherNo = bookingData.value.reservationNumber || ''
    sourceData.planValue = room.roomRate || ''
    // Autres mises à jour si nécessaire
  }
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (!editMode.value) {
    // Reset data when canceling edit
    initBillingData()
    initSourceData()
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

// Initialize billing data from booking
const initBillingData = () => {
  if (bookingData.value) {
    // Set billTo based on guest type
    if (guestData.value.guestType === 'corporate') {
      billingData.billTo = 'company'
    } else if (guestData.value.guestType === 'travel_agent') {
      billingData.billTo = 'agent'
    } else {
      billingData.billTo = 'individual'
    }
    
    // Set payment type based on VIP status
    billingData.type = guestData.value.vipStatus && guestData.value.vipStatus !== 'none' ? 'credit' : 'cash'
    
    // Set GSTIN from company registration if available
    if (guestData.value.company && guestData.value.registrationNo) {
      billingData.gstinNo = guestData.value.registrationNo
    }
    
    // Set reservation type from booking data
    if (bookingData.value.reservationType) {
      billingData.reservationType = bookingData.value.reservationType
    }
  }
}

// Initialize source data from booking
const initSourceData = () => {
  if (bookingData.value) {
    // Set market code and business source if available in booking data
    if (bookingData.value.sourceOfBusiness) {
      sourceData.businessSource = bookingData.value.sourceOfBusiness
    }
    
    // Set voucher number from booking data - CORRECTION ICI
    if (bookingData.value.reservationNumber) {
      sourceData.voucherNo = bookingData.value.reservationNumber
    }
    
    // Set company if available
    if (bookingData.value.companyName) {
      sourceData.company = bookingData.value.companyName
    }
    
    // Set plan value from selected room or first room
    if (selectedRoom.value && selectedRoom.value.roomRate) {
      sourceData.planValue = selectedRoom.value.roomRate
    } else if (reservationRooms.value.length > 0 && reservationRooms.value[0].roomRate) {
      sourceData.planValue = reservationRooms.value[0].roomRate
    }
  }
}

// Initialize data when component is mounted or props change
onMounted(() => {
  // Sélectionner la première chambre par défaut
  if (reservationRooms.value.length > 0) {
    selectedRoom.value = reservationRooms.value[0]
  }
  
  // Initialiser les données après avoir sélectionné la chambre
  initBillingData()
  initSourceData()
  
  console.log('BookingDetails mounted with booking:', bookingData.value)
})

// Watch for changes in booking data
watch(() => props.booking, (newBooking) => {
  if (newBooking) {
    // Sélectionner la première chambre si aucune n'est sélectionnée
    if (!selectedRoom.value && reservationRooms.value.length > 0) {
      selectedRoom.value = reservationRooms.value[0]
    }
    
    initBillingData()
    initSourceData()
  }
}, { deep: true })

// Watch for changes in guest data
watch(() => props.guest, (newGuest) => {
  if (newGuest) {
    initBillingData()
  }
}, { deep: true })

// Watch for changes in selected room
watch(selectedRoom, (newRoom) => {
  if (newRoom) {
    // Mettre à jour les données spécifiques à la chambre
    if (newRoom.roomRate) {
      sourceData.planValue = newRoom.roomRate
    }
  }
})
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

@media (max-width: 768px) {
  .grid > div {
    margin-bottom: 1rem;
  }
}
</style>