<template>
  <div class="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-md p-4 md:p-6 mx-2 md:mx-4 mt-4">
 
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <!-- Left Section - Room Details -->
      <div class="lg:col-span-2 border-r-0 lg:border-r-2 border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 r">
        <div class="h-full flex flex-col">
          <div class="bg-white dark:bg-gray-800 h-full rounded-lg">
            <div class="flex justify-between pt-2 px-2 pb-2">
              <span class="dark:text-gray-100">{{ $t('Room') }}</span>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2 px-2">♦ {{ roomTypeSummary }}</div>

            <div class="space-y-2 px-2">
              <div v-for="room in reservationRooms" :key="room.id"
                class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 my-1 rounded"
                :class="selectedRoom?.id === room.id
                    ? ['bg-blue-100','border-l-4','border-blue-500','dark:bg-blue-900','dark:border-blue-400']
                    : ['bg-gray-100','dark:bg-gray-800']
                  "
                @click="selectRoom(room)">
                <span>{{ room.room?.roomNumber }} - {{ getGuestName(room) }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section - Billing Information -->
      <div class="lg:col-span-5">
        <div class="rounded-lg p-3 md:p-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h3 class="font-medium text-gray-900 dark:text-gray-100 flex items-center text-lg md:text-xl mb-2 md:mb-0">
              {{ $t('BillingInformation') }}
            </h3>
            <!-- Edit button visible on mobile and small screens -->
            <button
              class="flex lg:hidden items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start"
              @click="toggleEditMode">
              <svg v-if="!editMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{{ editMode ? $t('Cancel') : $t('Edit') }}</span>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Bill To Section -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <Select :lb="$t('BillTo')" v-model="billingData.billTo" :options="billToOptions"
                  :placeholder="$t('Company')" :disabled="!editMode" />
              </div>
            </div>

            <!-- Payment Type (Radio buttons) -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('paymentType') }}</label>
                <div class="flex space-x-4">
                  <label class="flex items-center" :class="{ 'opacity-50 cursor-not-allowed': !editMode }">
                    <input type="radio" v-model="billingData.paymentType" value="cash" class="mr-2" :disabled="!editMode" />
                    <span :class="{ 'text-gray-400': !editMode }">{{ $t('cash') }}</span>
                  </label>
                  <label v-if="canCityLedgerPay" class="flex items-center"
                    :class="{ 'opacity-50 cursor-not-allowed': !editMode }">
                    <input type="radio" v-model="billingData.paymentType" value="city_ledger" class="mr-2"
                      :disabled="!editMode" />
                    <span :class="{ 'text-gray-400': !editMode }">{{ $t('city_ledger') }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Payment Mode and GSTIN -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputPaymentMethodSelect v-if="billingData.paymentType" :label="$t('PaymentMode')" :paymentType="billingData.paymentType"
                  v-model="billingData.paymentMode" :hide-label="false" :disabled="!editMode"  />
              </div>

              <div>
                <Input :lb="$t('GSTINNo')" v-model="billingData.gstinNo" type="text" :placeholder="$t('GSTNumber')"
                  :disabled="!editMode" />
              </div>
            </div>

            <!-- Reservation Type -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <AutoCompleteSelect v-model="billingData.reservationType" :options="BookingType"
                  :defaultValue="$t('SelectReservationType')" :lb="$t('ReservationType')" :is-required="false"
                  :use-dropdown="useDropdownBooking" :disabled="!editMode" @clear-error="emit('clear-error')" />
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Right Section - Source Information -->
      <div class="lg:col-span-5">
        <div class=" rounded-lg p-3 md:p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-lg md:text-xl text-gray-900 dark:text-gray-100 mb-4">{{ $t('SourceInformation') }}</h3>
            <!-- Edit Button for Desktop -->
            <button
              class="hidden lg:flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="toggleEditMode">
              <svg v-if="!editMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{{ editMode ? $t('Cancel') : $t('Edit') }}</span>
            </button>
          </div>
          <div class="space-y-4">
            <!-- Market Code and Business Source -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <AutoCompleteSelect
                  v-model="sourceData.marketCode"
                  :options="marketCodeOptions"
                  :defaultValue="$t('SelectMarketCode')"
                  :lb="$t('MarketCode')"
                  :is-required="false"
                  :use-dropdown="useDropdownBooking"
                  :disabled="!editMode"
                  @clear-error="emit('clear-error')"
                />
              </div>

              <div>
                <AutoCompleteSelect
                  v-model="sourceData.sourceOfBusiness"
                  :options="businessSourceOptions"
                  :defaultValue="$t('SelectBusinessSource')"
                  :lb="$t('BusinessSource')"
                  :is-required="false"
                  :use-dropdown="useDropdownBooking"
                  :disabled="!editMode"
                  @clear-error="emit('clear-error')"
                />
              </div>
            </div>

            <!-- Travel agent and Voucher No -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input :lb="$t('VoucherNo')" v-model="sourceData.voucherNo" type="text" :placeholder="$t('VoucherNo')"
                  :disabled="!editMode" />
              </div>
              <div>
                <AutoCompleteSelect
                  v-model="sourceData.company"
                  :options="companySelectOptions"
                  :defaultValue="$t('-Select-')"
                  :lb="$t('Company')"
                  :is-required="false"
                  :use-dropdown="useDropdownBooking"
                  :disabled="!editMode"
                  @clear-error="emit('clear-error')"
                />
              </div>
              
            <!-- Booking Source -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <AutoCompleteSelect v-model="sourceData.bookingSource" :options="BookingSource"
                  :defaultValue="$t('SelectBookingSource')" :lb="$t('booking_source')" :is-required="false"
                  :use-dropdown="useDropdownBooking" :disabled="!editMode" @clear-error="emit('clear-error')" />
              </div>
            </div>
<!-- Means of Transportation -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <AutoCompleteSelect v-model="sourceData.meansOfTransport" :options="TransportationModes"
                  :defaultValue="$t('MeansOfTransportation')" :lb="$t('MeansOfTransportation')" :is-required="false"
                  :use-dropdown="useDropdownBooking" :disabled="!editMode" @clear-error="emit('clear-error')" />
              </div>
            </div>
            <!-- Arriving To -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <Input :lb="$t('ArrivingTo')" :id="'arriving'" :forLabel="'arriving'" :placeholder="$t('ArrivingTo')"
                  v-model="sourceData.arrivingTo" :disabled="!editMode" />
              </div>
            </div>

            <!-- Going To -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <Input :lb="$t('GoingTo')" :id="'going'" :forLabel="'going'" :placeholder="$t('GoingTo')"
                  v-model="sourceData.goingTo" :disabled="!editMode" />
              </div>
            </div>

            
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="mt-6 p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
      <div class="bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Left side - Financial Summary -->
        <div class="flex text-sm">
          <div class="flex flex-col space-y-1">
            <div class="text-blue-600 dark:text-blue-400 font-medium">{{ $t('Total') }}</div>
            <div class="text-green-600 dark:text-green-400 font-medium">{{ $t('paid') }}</div>
            <div class="font-medium text-red-600 dark:text-red-400">{{ $t('Balance') }}</div>
          </div>
          <div class="flex flex-col space-y-1 ml-8">
            <div class="font-medium text-blue-600 dark:text-blue-400">{{ formatCurrency(totalAmount) }}</div>
            <span class="text-green-600 dark:text-green-400">{{ formatCurrency(totalPayments) }}</span>
            <div class="font-medium text-red-600 dark:text-red-400">{{ formatCurrency(balanceAmount) }}</div>
          </div>
        </div>

        <!-- Center - Checkboxes with unique keys -->
        <div class="flex flex-col md:flex-row md:items-center md:space-x-6 gap-2 md:gap-0 text-sm">
          <!--    <label class="flex items-center">
            <InputCheckbox
              :key="`sendMail-${selectedRoom?.id}-${roomOptions.sendMail}`"
              type="checkbox"
              v-model="roomOptions.sendMail"
              :disabled="!editMode"
              class="mr-2"
            />
            {{ $t('SendMail') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              :key="`checkOutMail-${selectedRoom?.id}-${roomOptions.checkOutMail}`"
              type="checkbox"
              v-model="roomOptions.checkOutMail"
              :disabled="!editMode"
              class="mr-2"
            />
            {{ $t('CheckOutMail') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              :key="`thankYouEmail-${selectedRoom?.id}-${roomOptions.thankYouEmail}`"
              type="checkbox"
              v-model="roomOptions.thankYouEmail"
              :disabled="!editMode"
              class="mr-2"
            />
            {{ $t('thankYouEmail') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              :key="`suppressRate-${selectedRoom?.id}-${roomOptions.suppressRate}`"
              type="checkbox"
              v-model="roomOptions.suppressRate"
              :disabled="!editMode"
              class="mr-2"
            />
            {{ $t('SupressRateOnGRCard') }}
          </label>
          <label class="flex items-center">
            <InputCheckbox
              :key="`accessGuestPortal-${selectedRoom?.id}-${roomOptions.accessGuestPortal}`"
              type="checkbox"
              v-model="roomOptions.accessGuestPortal"
              :disabled="!editMode"
              class="mr-2"
            />
            {{ $t('AccessGuestPortal') }}
          </label>-->
        </div>

        <!-- Right side - Action Buttons -->
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
          <!--<BasicButton variant="secondary" :label="$t('ApplyToGroup')" @click="applyToGroup" :disabled="!editMode" class="w-full md:w-auto" />-->
          <BasicButton v-if="editMode" variant="primary" :label="$t('SaveChanges')" @click="saveChanges"
            :disabled="isSaving" :loading="isSaving" class="w-full md:w-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BasicButton from '../../buttons/BasicButton.vue'
import Input from '../../forms/FormElements/Input.vue'
import Select from '../../forms/FormElements/Select.vue'
import { ChevronRight } from 'lucide-vue-next'
import { formatCurrency } from '../../utilities/UtilitiesFunction'
import { useBooking } from '@/composables/useBooking2'
import { getCompanies } from '@/services/companyApi'
import InputPaymentMethodSelect from '../foglio/InputPaymentMethodSelect.vue'
import AutoCompleteSelect from '@/components/forms/FormElements/AutoCompleteSelect.vue'
import { updateBookingDetail } from '@/services/reservation'

interface Props {
  booking?: any
  guest?: any
}

interface BillingData {
  billTo: string
  paymentMode: number | null
  paymentType: string
  gstinNo: string
  reservationType: number | null
}

interface SourceData {
  marketCode: string
  sourceOfBusiness: number | null
  travelAgent: string
  voucherNo: string
  commissionPlan: string
  planValue: string
  company: string
  salesPerson: string
  bookingSource: number | null
  arrivingTo: string
  goingTo: string
  meansOfTransport: string
}

interface RoomOptions {
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
interface Emits {
  (e: 'clear-error'): void
  (e: 'refresh-booking-data'): void
}

const emit = defineEmits<Emits>()
const { t, locale } = useI18n()
const toast = useToast()
const editMode = ref(false)
const isSaving = ref(false)
const selectedRoom = ref<any>(null)
const companyOptions = ref<Array<{ label: string; value: string }>>([])
const useDropdownBooking = ref(true)
const bookingData = computed(() => props.booking || {})
const guestData = computed(() => props.guest || {})
const {
  //Data
  billing,

  // Options
  BookingSource,
  BusinessSource,
  BookingType,
  creditTypes,
  billToOptions,
  MarketCode,
  reservationId,
  TransportationModes,

  //customer methods
  canCityLedgerPay
} = useBooking()

const businessSourceOptions = computed(() => {
  return [
    { label: t('None'), value: null },
    ...(BusinessSource.value || [])
  ]
})

const marketCodeOptions = computed(() => {
  return [
    { label: t('None'), value: null },
    ...(MarketCode.value || [])
  ]
})

const companySelectOptions = computed(() => {
  return [
    { label: t('None'), value: null },
    ...(companyOptions.value || [])
  ]
})

const sourceData = reactive<any>({
  marketCode: '',
  sourceOfBusiness: null,
  travelAgent: '',
  voucherNo: '',
  commissionPlan: '',
  planValue: '',
  company: '',
  salesPerson: '',
  bookingSource: null,
  arrivingTo: '',
  goingTo: '',
  meansOfTransport: ''
})

// CHANGEMENT PRINCIPAL : Utiliser ref au lieu de reactive pour roomOptions
const roomOptions = ref<RoomOptions>({
  sendMail: false,
  checkOutMail: false,
  thankYouEmail: false,
  suppressRate: false,
  accessGuestPortal: false
})

// Computed properties for booking data

// Computed properties for room data
const getCompaniesList = async () => {
  try {
    const resp: any = await getCompanies()
    console.log('Companies response:', resp)
    companyOptions.value = resp.data.map((c: any) => ({
      label: c.companyName,
      value: c.companyCode
    }))
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
}

const reservationRooms = computed(() => {
  return bookingData.value.reservationRooms || []
})

const selectedRoomId = computed(() => {
  return selectedRoom.value?.id || ''
})

const UpdateReservationRoom = async () => {
  try {
    if (!selectedRoomId.value) {
      throw new Error('No room selected')
    }
    const updateData = {
      billTo: billingData.billTo,
      paymentMethodId: billingData.paymentMode,
      paymentType: billingData.paymentType,
      reservationTypeId: billingData.reservationType,
      bookingSourceId: sourceData.bookingSource,
      arrivingTo: sourceData.arrivingTo,
      goingTo: sourceData.goingTo,
      meansOfTransport: sourceData.meansOfTransport,
      marketCodeId: sourceData.marketCode,
      businessSourceId: sourceData.sourceOfBusiness,
      companyName: sourceData.company
    }

    console.log('Updating reservation with ID:', props.booking.id)
    console.log('Update data:', updateData)

    const response = await updateBookingDetail(props.booking.id, updateData)
     emit('refresh-booking-data')

    console.log('Response from API:', response)

    // Mettre à jour selectedRoom avec les nouvelles valeurs
    if (selectedRoom.value) {
      Object.assign(selectedRoom.value, updateData)
    }

    return response.data
  } catch (error) {
    console.error('Error updating reservation room:', error)
    throw error
  }
}

const totalRooms = computed(() => reservationRooms.value.length)

const roomTypeSummary = computed(() => {
  if (reservationRooms.value.length === 0) return 'N/A'

  const roomTypes = [...new Set(reservationRooms.value.map((room: any) => room.roomType?.roomTypeName || 'N/A'))]
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

  reservationRooms.value.forEach((room: any) => {
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

const totalAmount = computed(() => bookingData.value.balanceSummary?.totalChargesWithTaxes || 0)
const balanceAmount = computed(() => bookingData.value.balanceSummary?.outstandingBalance || 0)
const totalPayments = computed(() => bookingData.value.balanceSummary?.totalPayments || 0)

const remarkCount = computed(() => bookingData.value.remarks?.length || 0)
const taskCount = computed(() => bookingData.value.tasks?.length || 0)
const messageCount = computed(() => bookingData.value.messages?.length || 0)
const preferenceCount = computed(() => guestData.value.preferences?.length || 0)

// Reactive data - Initialiser avec des valeurs vides
const billingData = reactive<any>({
  billTo: '',
  paymentMode: null,
  paymentType: '',
  gstinNo: '',
  reservationType: null
})





// Methods
const getGuestName = (room: any) => {
  if (room.guest) {
    return room.guest.displayName || `${room.guest.firstName} ${room.guest.lastName}`
  }
  return guestData.value.displayName || `${guestData.value.firstName} ${guestData.value.lastName}` || t('Guest')
}

// CHANGEMENT PRINCIPAL : Fonction modifiée pour utiliser ref
const updateRoomOptions = (room: any) => {
  // Créer un nouvel objet pour forcer la réactivité
  roomOptions.value = {
    sendMail: room?.sendMail || false,
    checkOutMail: room?.checkOutMail || false,
    thankYouEmail: room?.thankYouEmail || false,
    suppressRate: room?.supressRate || false,
    accessGuestPortal: room?.accessGuestPortal || false
  }

  console.log('Room options updated:', roomOptions.value)
  console.log('Room data received:', {
    sendMail: room?.sendMail,
    checkOutMail: room?.checkOutMail,
    thankYouEmail: room?.thankYouEmail,
    supressRate: room?.supressRate,
    accessGuestPortal: room?.accessGuestPortal
  })
}

const selectRoom = (room: any) => {
  console.log('Selecting room:', room)
  selectedRoom.value = room

  // Forcer la mise à jour des options de la chambre
  nextTick(() => {
    updateRoomOptions(room)
    updateBillingDataFromRoom(room)
    updateSourceDataFromRoom(room)
  })
}

const updateBillingDataFromRoom = (room: any) => {
  if (room) {
    billingData.billTo = room.billTo || ''
    billingData.paymentMode = room.paymentMode || null
    billingData.paymentType = room.paymentType || ''
    billingData.gstinNo = room.gstinNo || ''
    billingData.reservationType = room.reservationType || null
  }
}

const updateSourceDataFromRoom = (room: any) => {
  if (room) {
    sourceData.marketCode = room.marketCode || ''
    sourceData.sourceOfBusiness = room.sourceOfBusiness || null
    sourceData.voucherNo = room.voucherNo || bookingData.value.reservationNumber || ''
    sourceData.company = room.company || ''
    sourceData.planValue = room.roomRate || ''
    sourceData.bookingSource = room.bookingSource || null
    sourceData.arrivingTo = room.arrivingTo || ''
    sourceData.goingTo = room.goingTo || ''
    sourceData.meansOfTransport = room.meansOfTransport || ''
  }
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (!editMode.value) {
    // Reset data when canceling edit - remettre les valeurs originales de la chambre
    updateRoomOptions(selectedRoom.value)
    updateBillingDataFromRoom(selectedRoom.value)
    updateSourceDataFromRoom(selectedRoom.value)
  }
}

const saveChanges = async () => {
  isSaving.value = true
  try {
    await UpdateReservationRoom()
    console.log('Saving billing data:', billingData)
    console.log('Saving source data:', sourceData)
    console.log('Saving options:', roomOptions.value)

    toast.success(t('Changes saved successfully'))
    editMode.value = false
  } catch (error) {
    console.error('Error saving changes:', error)
    toast.error(t('Error saving changes'))
  } finally {
    isSaving.value = false
  }
}

// Initialize source data from booking
const initSourceData = () => {
  if (bookingData.value) {
    console.log(bookingData.value)
    // Set market code and business source if available in booking data
    if (bookingData.value.businessSourceId) {
      sourceData.sourceOfBusiness = bookingData.value.businessSourceId
    }

    if (bookingData.value.bookingSourceId) {
      sourceData.bookingSource = bookingData.value.bookingSourceId
    }
    if (bookingData.value.arrivingTo) {
      sourceData.arrivingTo = bookingData.value.arrivingTo
    }
    if (bookingData.value.goingTo) {
      sourceData.goingTo = bookingData.value.goingTo
    }
    if (bookingData.value.meansOfTransportation) {
      sourceData.meansOfTransport = bookingData.value.meansOfTransportation
    }

     if (bookingData.value.paymentType) {
       billingData.paymentType = bookingData.value.paymentType
    }

      if (bookingData.value.paymentMethodId) {
       billingData.paymentMode = bookingData.value.paymentMethodId
    }

      if (bookingData.value.reservationTypeId) {
       billingData.reservationType = bookingData.value.reservationTypeId
    }

     if (bookingData.value.reservationTypeId) {
       billingData.reservationType = bookingData.value.reservationTypeId
    }
    // Set voucher number from booking data
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
onMounted(async () => {
  await nextTick()

  // Sélectionner la première chambre par défaut
  if (reservationRooms.value.length > 0) {
    selectedRoom.value = reservationRooms.value[0]
    updateRoomOptions(selectedRoom.value)
    updateBillingDataFromRoom(selectedRoom.value)
    updateSourceDataFromRoom(selectedRoom.value)
    console.log('Initial room selected:', selectedRoom.value)
  }

  // Initialiser les données après avoir sélectionné la chambre
  // initBillingData()
  initSourceData()
  getCompaniesList()

  console.log('BookingDetails mounted with booking:', bookingData.value)
})

// Watch for changes in booking data
watch(() => props.booking, (newBooking) => {
  if (newBooking) {
    // If rooms exist
    if (reservationRooms.value.length > 0) {
      // If we already had a selected room, try to maintain selection
      if (selectedRoom.value) {
        const currentId = selectedRoom.value.id
        const foundRoom = reservationRooms.value.find((r: any) => r.id === currentId)
        if (foundRoom) {
          selectedRoom.value = foundRoom
        } else {
          // If previous room not found (e.g. deleted), select first
          selectedRoom.value = reservationRooms.value[0]
        }
      } else {
        // No previous selection, select first
        selectedRoom.value = reservationRooms.value[0]
      }

      // Update local state from the selected room (whether maintained or new)
      if (selectedRoom.value) {
        updateRoomOptions(selectedRoom.value)
        updateBillingDataFromRoom(selectedRoom.value)
        updateSourceDataFromRoom(selectedRoom.value)
      }
    }

    // initBillingData()
    initSourceData()
  }
}, { deep: true, immediate: true })

// Watch for changes in selected room avec deep watching
watch(selectedRoom, (newRoom, oldRoom) => {
  console.log('Room changed from:', oldRoom?.id, 'to:', newRoom?.id)
  if (newRoom && newRoom.id !== oldRoom?.id) {
    // Forcer la mise à jour des options avec les valeurs de la nouvelle chambre
    nextTick(() => {
      updateRoomOptions(newRoom)
      updateBillingDataFromRoom(newRoom)
      updateSourceDataFromRoom(newRoom)
    })
  }
}, { deep: true, immediate: false })

// Watch for changes in guest data
// watch(() => props.guest, (newGuest) => {
//   if (newGuest) {
//     initBillingData()
//   }
// }, { deep: true })
</script>

<style scoped>
.border-l-4 {
  border-left-width: 4px;
}

input[type="radio"]:disabled+span {
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
  .grid>div {
    margin-bottom: 1rem;
  }
}
</style>
