<template>
  <RightSideModal :is-open="isOpen" :title="'Add Transportation Request'" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('Add Transportation Request') }}</h3>
    </template>

    <!-- Form -->
    <div class="px-2 space-y-4">
      <!--Type of service-->
      <div class="">
        <RadioButtonGroup
          v-model="formData.serviceType"
          :options="serviceType"
          :label="$t('Service Type')"
          :is-required="true"
        />
      </div>
      <!-- Date & Time -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <InputDatePicker v-model="formData.requestDate" :title="$t('Request Date')" />
        </div>
        <div>
          <InputTimePicker v-model="formData.scheduledTime" :title="$t('Scheduled Time')" custom-class="rounded-lg" />
        </div>
      </div>

      <!--  Location Type -->

      <div>
        <Select
          v-model="formData.locationType"
          :options="locationTypeOptions"
          :lb="$t('Location Type')"
        />
      </div>
      <!-- Flight/Train Info (conditional) -->
      <div v-if="showFlightTrainInfo" class="grid grid-cols-2 gap-4">
        <div>
          <Input
            v-model="formData.flightTrainNumber"
            type="text"
            :lb="getFlightTrainLabel()"
            :placeholder="$t('Enter number')"
          />
        </div>
        <div>
          <Input
            v-model="formData.airlineTrainCompany"
            type="text"
            :lb="getCompanyLabel()"
            :placeholder="$t('Enter company name')"
          />
        </div>
      </div>

      <!-- Passengers & Luggage -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Input
            v-model="formData.numberOfPassengers"
            :input-type="'number'"
            :lb="$t('Number of Passengers')"
            min="1"
          />
        </div>
        <div>
          <Input
            v-model="formData.numberOfLuggage"
            :input-type="'number'"
            :lb="$t('Number of Luggage')"
            min="0"
          />
        </div>
      </div>

      <!-- Transportation Mode -->
      <div>
        <InputTransportationModeSelect
          v-model="formData.transportationModeId"
          @select="transportationModeSelected"
          :is-required="true"
        />
      </div>
      <!-- External Service Details (conditional) -->
      <div
        v-if="selectedTransportationMode && selectedTransportationMode.isExternal"
        class="space-y-4"
      >
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">External Service Details</h4>

        <div>
          <Input
            v-model="formData.externalBookingReference"
            type="text"
            :lb="$t('Booking Reference')"
            :placeholder="$t('External booking reference (optional)')"
          />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <Input
              v-model="formData.externalVehicleMatriculation"
              type="text"
              :lb="$t('Vehicle Plate')"
              :placeholder="$t('License plate')"
            />
          </div>
          <div>
            <Input
              v-model="formData.externalDriverName"
              type="text"
              :lb="$t('Driver Name')"
              :placeholder="$t('Driver name')"
            />
          </div>
          <div>
            <Input
              v-model="formData.externalVehicleColor"
              type="text"
              :lb="$t('Vehicle Color')"
              :placeholder="$t('Vehicle color')"
            />
          </div>
        </div>
      </div>

      <!-- Pickup & Dropoff Points -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Input
            v-model="formData.pickupPoint"
            type="text"
            :lb="$t('Pickup Point')"
            :placeholder="$t('Enter pickup location')"
          />
        </div>
        <div>
          <Input
            v-model="formData.dropoffPoint"
            type="text"
            :lb="$t('Dropoff Point')"
            :placeholder="$t('Enter dropoff location')"
          />
        </div>
      </div>

      <!-- Service Fee & Folio -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
            $t('Service Fee')
          }}</label>
          <InputCurrency v-model="formData.serviceFee" :currency="formData.currency" />
        </div>
        <div v-if="formData.serviceFee > 0">
          <InputFolioSelect
            :title="$t('Folio')"
            v-model="formData.folioId"
            @select="folioSelected"
            :reservation-id="formData.reservationId ?? undefined"
          />
        </div>
      </div>

      <!-- Requested By -->
      <div>
        <Input v-model="formData.requestedBy" :lb="$t('Requested By')" />
      </div>

      <!-- Special Requirements -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{
          $t('Special Requirements')
        }}</label>
        <textarea
          v-model="formData.specialRequirements"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-300 resize-none dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:ring-purple-600 dark:focus:border-purple-700"
          :placeholder="$t('Enter any special requirements...')"
        ></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <BasicButton variant="secondary" @click="closeModal" :label="$t('Cancel')"></BasicButton>
        <BasicButton
          variant="primary"
          @click="saveRequest"
          :label="'Save Request'"
          :loading="isSaving"
          :disabled="isSaving"
        ></BasicButton>
      </div>
    </template>
  </RightSideModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import RightSideModal from '../modal/RightSideModal.vue'
import BasicButton from '../buttons/BasicButton.vue'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue'
import Select from '../forms/FormElements/Select.vue'
import Input from '../forms/FormElements/Input.vue'
import InputTimePicker from '../forms/FormElements/InputTimePicker.vue'
import InputFolioSelect from '../reservations/foglio/InputFolioSelect.vue'
// import InputGuestSelect from './InputGuestSelect.vue'
// import InputReservationSelect from './InputReservationSelect.vue'
import InputTransportationModeSelect from '../forms/FormElements/InputTransportationModeSelect.vue'
import InputCurrency from '../forms/FormElements/InputCurrency.vue'
import { useServiceStore } from '@/composables/serviceStore'
// import { createTransportationRequest } from '../../../services/transportationApi'
import { useToast } from 'vue-toastification'
import { safeParseInt, prepareFolioAmount } from '@/utils/numericUtils'
import { useI18n } from 'vue-i18n'
import RadioButtonGroup from '../forms/FormElements/RadioButtonGroup.vue'
import { createTransportationRequest } from '@/services/transportationRequest'

interface Props {
  isOpen: boolean
  guestId?: number
  reservationId?: number
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const isSaving = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const { t } = useI18n()

// Options
const locationTypeOptions = computed(()=>([
  { value: 'Airport', label: t('Airport') },
  { value: 'Train Station', label: t('Train Station') },
  { value: 'Hotel', label: t('Hotel') },
  { value: 'Local Address', label: t('Local Address') },
]))

const requestedByOptions = ref([
  { value: 'Guest', label: t('Guest') },
  { value: 'Front Desk Staff', label: t('Front Desk Staff') },
])

const serviceType = computed(()=>([
  { value: 'Pickup', label: t('pickup') },
  { value: 'Dropoff', label: t('dropoff') },
]))

// Form data
const formData = reactive({
  requestDate: new Date().toISOString().split('T')[0],
  scheduledTime: '12:30',
  guestId: props.guestId || null,
  reservationId: props.reservationId || null,
  transportationModeId: null,
  serviceType: 'Pickup',
  locationType: 'Airport',
  pickupPoint: '',
  dropoffPoint: '',
  flightTrainNumber: '',
  airlineTrainCompany: '',
  numberOfPassengers: 1,
  numberOfLuggage: 0,
  specialRequirements: '',
  requestedBy: 'Front Desk Staff',
  externalBookingReference: '',
  externalVehicleMatriculation: '',
  externalDriverName: '',
  externalVehicleColor: '',
  serviceFee: 0,
  currency: 'XAF',
  folioId: 0,
})

// Selected items tracking
const selectedGuest = ref<any>(null)
const selectedReservation = ref<any>(null)
const selectedTransportationMode = ref<any>(null)
const selectedFolio = ref<any>(null)

// Computed properties
const showFlightTrainInfo = computed(() => {
  return formData.locationType === 'Airport' || formData.locationType === 'Train Station'
})

const getFlightTrainLabel = () => {
  return formData.locationType === 'Airport' ? t('Flight Number') : t('Train Number')
}

const getCompanyLabel = () => {
  return formData.locationType === 'Airport' ? t('Airline') : t('Train Company')
}

// Methods
const closeModal = () => {
  // Reset form data
  Object.assign(formData, {
    requestDate: new Date().toISOString().split('T')[0],
    scheduledTime: '',
    guestId: props.guestId || null,
    reservationId: props.reservationId || null,
    transportationModeId: null,
    serviceType: 'Pickup',
    locationType: 'Airport',
    pickupPoint: '',
    dropoffPoint: '',
    flightTrainNumber: '',
    airlineTrainCompany: '',
    numberOfPassengers: 1,
    numberOfLuggage: 0,
    specialRequirements: '',
    requestedBy: 'Front Desk Staff',
    externalBookingReference: '',
    externalVehicleMatriculation: '',
    externalDriverName: '',
    externalVehicleColor: '',
    serviceFee: 0,
    currency: 'XAF',
    folioId: null,
  })

  // Reset selected items
  selectedGuest.value = null
  selectedReservation.value = null
  selectedTransportationMode.value = null
  selectedFolio.value = null

  emit('close')
}

const transportationModeSelected = (item: any) => {
  selectedTransportationMode.value = item

  // Clear external fields if switching to internal mode
  if (!item.isExternal) {
    formData.externalBookingReference = ''
    formData.externalVehicleMatriculation = ''
    formData.externalDriverName = ''
    formData.externalVehicleColor = ''
  }
}

const folioSelected = (item: any) => {
  selectedFolio.value = item
}

const saveRequest = async () => {
  // Validate required fields
  if (
    !formData.transportationModeId ||
    !formData.pickupPoint ||
    !formData.dropoffPoint ||
    !formData.scheduledTime
  ) {
    toast.error('Please fill in all required fields')
    return
  }

  // Validate external service fields if external mode is selected
  if (selectedTransportationMode.value?.isExternal) {
    if (
      !formData.externalVehicleMatriculation ||
      !formData.externalDriverName ||
      !formData.externalVehicleColor
    ) {
      toast.error('Please fill in all external service details')
      return
    }
  }

  // Validate service fee and folio
  if (formData.serviceFee > 0 && !formData.folioId) {
    toast.error('Please select a folio for the service fee')
    return
  }

  try {
    isSaving.value = true

    // Prepare request data
    const requestData = {
      hotelId: serviceStore.serviceId,
      guestId: formData.guestId,
      reservationId: formData.reservationId ? safeParseInt(formData.reservationId) : null,
      transportationModeId: safeParseInt(formData.transportationModeId),
      scheduledDateTime: `${formData.requestDate}T${formData.scheduledTime}:00`,
      serviceType: formData.serviceType,
      locationType: formData.locationType,
      pickupPoint: formData.pickupPoint,
      dropoffPoint: formData.dropoffPoint,
      flightTrainNumber: formData.flightTrainNumber || null,
      airlineTrainCompany: formData.airlineTrainCompany || null,
      numberOfPassengers: formData.numberOfPassengers,
      numberOfLuggage: formData.numberOfLuggage,
      specialRequirements: formData.specialRequirements || null,
      requestedBy: formData.requestedBy,
      externalBookingReference: formData.externalBookingReference || null,
      externalVehicleMatriculation: formData.externalVehicleMatriculation || null,
      externalDriverName: formData.externalDriverName || null,
      externalVehicleColor: formData.externalVehicleColor || null,
      serviceFee: formData.serviceFee > 0 ? prepareFolioAmount(formData.serviceFee) : null,
      folioId: formData.folioId ? safeParseInt(formData.folioId) : null,
    }

    console.log('Transportation request data being sent:', requestData)

    // Call the API to create transportation request
    const response = await createTransportationRequest(requestData)

    // Show success message
    toast.success('Transportation request created successfully')
    console.log('response', response)

    // // Emit the form data with API response
    // emit('save', { ...formData, requestId: response.id })
    closeModal()
  } catch (error) {
    console.error('Error saving transportation request:', error)
    toast.error('Failed to create transportation request. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Close modal on escape key
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal()
        }
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  },
)

// Clear flight/train info when location type changes
watch(
  () => formData.locationType,
  () => {
    if (!showFlightTrainInfo.value) {
      formData.flightTrainNumber = ''
      formData.airlineTrainCompany = ''
    }
  },
)
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Add visual separator for sections */
h4 {
  color: #374151;
  font-weight: 500;
}
</style>
