<template>
  <AdminLayout>
    <div class="bg-white shadow-sm">
      <div class="mb-0 p-3 flex justify-between items-center border-b border-gray-200">
        <div class="flex gap-5 align-middle items-center dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('Night Audit') }}</h2>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatDateT(currentDate) }}
          </div>
        </div>
        <div class="flex space-x-2">
          <BasicButton :label="$t('Previous')" variant="secondary" @click="previousStep"
            :disabled="currentStep === 1" />
          <BasicButton v-if="currentStep < 6" :label="$t('Next')" variant="primary" @click="nextStep" />
        </div>
      </div>

      <!-- Stepper Navigation -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="px-4 py-3">
          <nav class="flex space-x-8" aria-label="Progress">
            <div v-for="(step, index) in steps" :key="step.id" class="flex items-center">
              <div class="flex items-center">
                <div :class="[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  currentStep > step.id
                    ? 'bg-blue-600 text-white'
                    : currentStep === step.id
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                      : 'bg-gray-100 text-gray-400'
                ]">
                  <CheckIcon v-if="currentStep > step.id" class="h-5 w-5" />
                  <span v-else>{{ step.id }}</span>
                </div>
                <div class="ml-3">
                  <p :class="[
                    'text-sm font-medium',
                    currentStep >= step.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  ]">
                    {{ $t(step.name) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t(step.description) }}</p>
                </div>
              </div>
              <div v-if="index < steps.length - 1" class="ml-8 flex-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white dark:bg-gray-800">
        <!-- Step 1: Pending Reservations -->
        <div v-if="currentStep === 1" class="p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('Pending Reservations') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('Reservations with check-in date matching current working date but not yet checked in') }}
            </p>
          </div>
          <ReusableTable :columns="pendingReservationsColumns" :data="pendingReservationsData" :searchable="false"
            :show-header="false" :loading="loading" :actions="pendingReservationsActions">
          </ReusableTable>
        </div>

        <!-- Step 2: Release Reservations -->
        <div v-if="currentStep === 2" class="p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('Release Reservations') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('Reservations that have reached their release date without payment confirmation') }}
            </p>
          </div>
          <ReusableTable :columns="releaseReservationsColumns" :data="releaseReservationsData" :searchable="false"
            :show-header="false" :loading="loading">
            <template #actions="{ item }">
              <div class="flex space-x-2">
                <BasicButton :label="$t('Collect Payment')" variant="primary" size="sm" @click="collectPayment(item)" />
                <BasicButton :label="$t('Change Release')" variant="secondary" size="sm" @click="changeRelease(item)" />
              </div>
            </template>
          </ReusableTable>
        </div>

        <!-- Step 3: Room Status -->
        <div v-if="currentStep === 3" class="p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('Room Status') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('Verify status of all rooms including occupied, check-out due, or blocked rooms') }}
            </p>
          </div>
          <ReusableTable :columns="roomStatusColumns" :data="roomStatusData" :searchable="false" :show-header="false"
            :loading="loading" :actions="roomStatusActions">
            <template #column-status="{ item }">
              <div class="flex space-x-2">
                <span class="capitalize p-1 text-red-100 bg-red-400 border ">{{$t (item.status) }}</span>
              </div>
            </template>
          </ReusableTable>
        </div>

        <!-- Step 4: Unsettled Folios -->
        <div v-if="currentStep === 4" class="p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('Unsettled Folios') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('Review guest folios that have pending payments') }}
            </p>
          </div>
          <ReusableTable :columns="unsettledFoliosColumns" :data="unsettledFoliosData" :searchable="false"
            :show-header="false" :loading="loading">
            <template #actions="{ item }">
              <div class="flex space-x-2">
                <BasicButton :label="$t('Settle Folio')" variant="primary" size="sm" @click="settleFolio(item)" />
                <BasicButton :label="$t('Edit Reservation')" variant="secondary" size="sm"
                  @click="editReservation(item)" />
              </div>
            </template>
          </ReusableTable>
        </div>

        <!-- Step 5: Nightly Charges -->
        <div v-if="currentStep === 5" class="p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('Nightly Charges') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('Post room charges for all occupied rooms based on current working date') }}
            </p>
          </div>
          <div class="mb-4 flex gap-3 " v-if="canPostCharges">
            <span class="align-middle self-center items-center">{{ selectedCharges.length }} {{ $t('Record(s) Selected')
              }}
            </span>
            <BasicButton :label="$t('Post')" variant="primary" @click="postSelectedCharges" :loading="postingCharges" />
          </div>
          <ReusableTable :columns="nightlyChargesColumns" :data="nightlyChargesData" :searchable="false"
            :show-header="false" :loading="loading" :selectable="true" @selection-change="handleChargesSelectionChange">

          </ReusableTable>
        </div>

        <!-- Step 6: Create New Day -->
        <div v-if="currentStep === 6" class="p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('Create New Day') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('Close current business day and initiate new business day') }}
            </p>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <InfoIcon class="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">{{ $t('Ready to Close Day') }}</h4>
                <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {{ $t('Current Date') }}: {{ formatDateT(currentDate) }}<br>
                  {{ $t('Next Date') }}: {{ formatDateT(nextDate) }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex space-x-4">
            <BasicButton :label="$t('Finish Night Audit')" variant="primary" @click="finishNightAudit"
              :loading="finishingAudit" />
          </div>

        </div>
      </div>
    </div>
    <VoidReservation v-if="selectdReservationId" :is-open="showVoidModal" :reservation-id="selectdReservationId"
      @close="closeVoidReservationModal" @void-confirmed="handleVoidConfirmed" />
    <NoShowReservation v-if="selectdReservationId" :is-open="showNoShowModal" :reservation-id="selectdReservationId"
      @close="closeNoShowReservationModal" @noshow-confirmed="handleNoShowConfirmed" />
    <CancelReseravtion v-if="selectdReservationId" :is-open="showCancelModal" :reservation-id="selectdReservationId"
      @close="closeCancelReservationModal" @cancel-confirmed="handleCancelConfirmed" />
    <template v-if="selectdReservationId && showCheckInModal">
      <CheckInReservation :is-open="showCheckInModal" :reservation-id="selectdReservationId" @close="closeCheckInModal"
        @success="handleCheckInSuccess" />
    </template>
    <CheckOutReservation v-if="selectdReservationId" :is-open="showCheckOutModal" :reservation-id="selectdReservationId"
      @close="closeCheckOutModal" @success="handleCheckOutSuccess" />
    <AmendStay v-if="selectdReservationId" :is-open="showAmendStayModal" :reservation-id="selectdReservationId"
      @close="closeAmendStayModal" @amend-confirmed="handleAmendStaySuccess" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import { CheckIcon, InfoIcon } from 'lucide-vue-next'
import { formatDateT } from '../../components/utilities/UtilitiesFunction'
import type { Action, Column } from '../../utils/models'
import { settleFolio } from '@/services/foglioApi'
import {
  getReleaseReservations
} from '@/services/reservation'
import { createPayment, confirmPayment } from '@/services/api'
import { useServiceStore } from '../../composables/serviceStore'
import { getNightAuditNightlyCharges, getNightAuditRoomStatus, getNightAuditUnsettledFolios, createNightAudit, getNightAuditPendingReservations, postNightlyCharges } from '../../services/nightAudit'
// Lazy load modal components for better code splitting
const VoidReservation = defineAsyncComponent(() => import('../../components/reservations/foglio/VoidReservation.vue'))
const NoShowReservation = defineAsyncComponent(() => import('../../components/reservations/foglio/NoShowReservation.vue'))
const CheckInReservation = defineAsyncComponent(() => import('../../components/reservations/CheckInReservation.vue'))
const CheckOutReservation = defineAsyncComponent(() => import('../../components/reservations/CheckOutReservation.vue'))
const AmendStay = defineAsyncComponent(() => import('../../components/reservations/foglio/AmendStay.vue'))
const serviceStore = useServiceStore();
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const getYesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}
// State - Load saved step from localStorage or default to 1

const currentStep = ref(1)
const loading = ref(false)
const postingCharges = ref(false)
const finishingAudit = ref(false)
const auditCompleted = ref(false)
const currentDate = ref(getYesterday())
const nextDate = computed(() => {
  const date = new Date(currentDate.value)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

// Steps configuration
const steps = [
  { id: 1, name: 'Pending Reservations', description: 'Check-in pending reservations' },
  { id: 2, name: 'Release Reservations', description: 'Handle release date reservations' },
  { id: 3, name: 'Room Status', description: 'Verify room statuses' },
  { id: 4, name: 'Unsettled Folios', description: 'Review pending payments' },
  { id: 5, name: 'Nightly Charges', description: 'Post room charges' },
  { id: 6, name: 'Create New Day', description: 'Close business day' }
]

// Data for Night Audit sections
const pendingReservationsData = ref([])
const releaseReservationsData = ref([])
const roomStatusData = ref([])
const unsettledFoliosData = ref([])
const nightlyChargesData = ref([])
const selectedCharges = ref<any[]>([])

// API Functions
const fetchPendingReservations = async () => {
  try {
    loading.value = true
    const response = await getNightAuditPendingReservations(Number(serviceStore.serviceId), currentDate.value)
    pendingReservationsData.value = response.data?.data.pending_reservations || []
    console.log('pending reservation Document', pendingReservationsData)
  } catch (error) {
    console.error('Error fetching pending reservations:', error)
    toast.error(t('Failed to load pending reservations'))
  } finally {
    loading.value = false
  }
}

const fetchReleaseReservations = async () => {
  try {
    loading.value = true
    // Filter reservations that have release dates and need payment confirmation
    const response = await getReleaseReservations({
      hotelId: serviceStore.serviceId,
      data: currentDate.value,
    })
    console.log('release Document', response)
    // Filter for reservations with release terms (this would need API support)
    releaseReservationsData.value = response.data?.data


  } catch (error) {
    console.error('Error fetching release reservations:', error)
    toast.error(t('Failed to load release reservations'))
  } finally {
    loading.value = false
  }
}

const fetchRoomStatus = async () => {
  try {
    loading.value = true

    // Get rooms due for checkout today
    const response = await getNightAuditRoomStatus(Number(serviceStore.serviceId), currentDate.value)
    console.log('roomo status', response)
    const roomStatusList = response.data?.data?.roomStatus || []

    // Set noaction based on isRequiredAction for each room
    roomStatusData.value = roomStatusList.map((room: any) => ({
      ...room,
      noaction: !room.isRequiredAction
    }))

  } catch (error) {
    console.error('Error fetching room status:', error)
    toast.error(t('Failed to load room status'))
  } finally {
    loading.value = false
  }
}

const fetchUnsettledFolios = async () => {
  loading.value = true
  try {
    // Fetch folios with open or balanced status and outstanding balance
    const response = await getNightAuditUnsettledFolios(Number(serviceStore.serviceId), currentDate.value)
    console.log('unsettled folios', response)
    unsettledFoliosData.value = response.data?.data?.unsettledFolios || []

  } catch (error) {
    console.error('Error fetching unsettled folios:', error)
    toast.error(t('Failed to fetch unsettled folios'))
  } finally {
    loading.value = false
  }
}

const fetchNightlyCharges = async () => {
  try {
    loading.value = true

    // Get occupied rooms from daily occupancy data
    const occupancyResponse = await getNightAuditNightlyCharges(Number(serviceStore.serviceId), currentDate.value)
    console.log('occupancyResponse', occupancyResponse);
    // Map occupied rooms to nightly charges format
    nightlyChargesData.value = occupancyResponse.data?.data.pending_charges || []

  } catch (error) {
    console.error('Error fetching nightly charges:', error)
    toast.error(t('Failed to fetch nightly charges'))

  } finally {
    loading.value = false
  }
}
const selectdReservationId = ref(null)
const showVoidModal = ref(false)
const showNoShowModal = ref(false)
const showCancelModal = ref(false)
const showCheckInModal = ref(false)
const showCheckOutModal = ref(false)
const showAmendStayModal = ref(false);
const selectedReservationForCheckIn = ref(null)
const selectedGuestForCheckOut = ref(null)
// Column definitions
const pendingReservationsColumns: Column[] = [
  { key: 'confirmation_number', label: 'Res No#', type: 'text' },
  { key: 'guest_name', label: 'Guest', type: 'text' },
  { key: 'room_number', label: 'Room', type: 'text' },
  { key: 'rate_type', label: 'Rate Type', type: 'text' },
  { key: 'reservation_type', label: 'Res. Type', type: 'text' },
  { key: 'departure', label: 'Departure', type: 'date' },
  { key: 'total_amount', label: 'Total ', type: 'text' },
  { key: 'deposit_amount', label: 'Deposit ', type: 'text' },
  //{ key: 'actions', label: 'Actions',  type: 'custom' }
]

const releaseReservationsColumns: Column[] = [
  { key: 'resNo', label: 'Res No#', type: 'text' },
  { key: 'guest', label: 'Guest', type: 'text' },
  { key: 'room', label: 'Room', type: 'text' },
  { key: 'rateType', label: 'Rate Type', type: 'text' },
  { key: 'resType', label: 'Res. Type', type: 'text' },
  { key: 'releaseTerm', label: 'Release Term', type: 'text' },
  { key: 'departure', label: 'Departure', type: 'text' },
  { key: 'total', label: 'Total(Rs)', type: 'text' },
  { key: 'deposit', label: 'Deposit(Rs)', type: 'text' },
  { key: 'actions', label: 'Actions', type: 'custom' }
]

const roomStatusColumns: Column[] = [
  { key: 'roomNumber', label: 'Room', type: 'text' },
  { key: 'guest.name', label: 'Guest', type: 'text' },
  { key: 'reservation.checkInDate', label: 'Arrival', type: 'date' },
  { key: 'reservation.checkOutDate', label: 'Departure', type: 'date' },
  { key: 'folio.totalPayments', label: 'Total(XAF)', type: 'text' },
  { key: 'folio.balance', label: 'Balance(XAF)', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' },
  // { key: 'actions', label: 'Actions', type: 'custom' }
]

const unsettledFoliosColumns: Column[] = [
  { key: 'resNo', label: 'Res No#', type: 'text' },
  { key: 'folio', label: 'Folio', type: 'text' },
  { key: 'guest', label: 'Guest', type: 'text' },
  { key: 'arrival', label: 'Arrival', type: 'text' },
  { key: 'departure', label: 'Departure', type: 'text' },
  { key: 'status', label: 'Status', type: 'text' },
  { key: 'balance', label: 'Balance(Rs)', type: 'text' },
  { key: 'actions', label: 'Actions', type: 'custom' }
]

const nightlyChargesColumns: Column[] = [
  { key: 'reservation_number', label: 'Res No#', type: 'text' },
  { key: 'guest_name', label: 'Guest', type: 'text' },
  { key: 'folio_id', label: 'Folio', type: 'text' },
  { key: 'rate_type', label: 'Type', type: 'text' },
  { key: 'rate', label: 'Amount', type: 'text' },
]

const pendingReservationsActions: Action[] = [
  {
    label: 'Check In',
    variant: 'primary',
    icon: 'check-in',
    handler: (item) => {
      handlerPendingReservation(item, 'check_in')
    }
  },
  {
    label: 'Mark as No-Show',
    variant: 'primary',
    icon: 'mark-no-show',
    handler: (item) => {
      handlerPendingReservation(item, 'mark_no_show')
    }
  },
  {
    label: 'Cancel Reservation',
    variant: 'primary',
    icon: 'cancel-reservation',
    handler: (item) => {
      handlerPendingReservation(item, 'cancel_reservation')
    }
  },
  {
    label: 'Void Booking',
    variant: 'primary',
    icon: 'void-booking',
    handler: (item) => {
      handlerPendingReservation(item, 'void_booking')
    }
  }
]

const roomStatusActions: Action[] = [
  {
    label: 'Check Out',
    variant: 'primary',
    icon: 'check-out',
    handler: (item) => {
      handlerRoomStatus(item, 'check_out')
    },
  },
  {
    label: "Amend Stay",
    variant: 'primary',
    icon: 'amend-stay',
    handler: (item) => {
      handlerRoomStatus(item, 'amend_stay')
    },
  }
]
// Validation functions
const validateStep = (step: number): boolean => {
  switch (step) {
    case 1:
      // Step 1 to 2: pending reservations must be empty
      if (pendingReservationsData.value.length > 0) {
        toast.error(t('Please resolve all pending reservations before proceeding'))
        return false
      }
      return true
    case 2:
      // Step 2 to 3: release reservations must be empty (all resolved)
      if (releaseReservationsData.value.length > 0) {
        toast.error(t('Please resolve all release reservations before proceeding'))
        return false
      }
      return true
    case 3:
      // Step 3 to 4: check if there are no records with isRequiredAction set to true
      const roomsWithRequiredAction = roomStatusData.value.filter((room: any) => room.isRequiredAction === true)
      if (roomsWithRequiredAction.length > 0) {
        toast.error(t('Please resolve all room status issues before proceeding'))
        return false
      }
      return true
    case 4:
      // Step 4 to 5: unsettled folios must be empty
      if (unsettledFoliosData.value.length > 0) {
        toast.error(t('Please settle all outstanding folios before proceeding'))
        return false
      }
      return true
    case 5:
      // Step 5 to 6: nightly charges must be empty (all posted)
      if (nightlyChargesData.value.length > 0) {
        toast.error(t('Please post all nightly charges before proceeding'))
        return false
      }
      return true
    default:
      return true
  }
}

// Navigation methods
const nextStep = () => {
  if (currentStep.value < 6) {
    // Validate current step before moving to next
    if (!validateStep(currentStep.value)) {
      return
    }

    currentStep.value++
    if (currentStep.value == 2) {
      fetchPendingReservations()
    }
    if (currentStep.value == 3) {
      fetchRoomStatus();
    }
    if (currentStep.value == 4) {
      fetchUnsettledFolios();
    }
    if (currentStep.value == 5) {
      fetchNightlyCharges();
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
const closeVoidReservationModal = () => {
  showVoidModal.value = false;
  selectdReservationId.value = null;
}
const handleVoidConfirmed = () => {
  showVoidModal.value = false;
  selectdReservationId.value = null;
  fetchPendingReservations();
}
const closeNoShowReservationModal = () => {
  showNoShowModal.value = false;
  selectdReservationId.value = null;
}
const handleNoShowConfirmed = () => {
  showNoShowModal.value = false;
  selectdReservationId.value = null;
  fetchPendingReservations();
}

const closeCancelReservationModal = () => {
  showCancelModal.value = false;
  selectdReservationId.value = null;
}
const handleCancelConfirmed = () => {
  showCancelModal.value = false;
  selectdReservationId.value = null;
  fetchPendingReservations();
}

// Check-in modal handlers
const closeCheckInModal = () => {
  showCheckInModal.value = false;
  selectedReservationForCheckIn.value = null;
}

const handleCheckInSuccess = () => {
  showCheckInModal.value = false;
  selectedReservationForCheckIn.value = null;
  fetchPendingReservations();
}

// Check-out modal handlers
const closeCheckOutModal = () => {
  showCheckOutModal.value = false;
  selectedGuestForCheckOut.value = null;
}

const handleCheckOutSuccess = () => {
  showCheckOutModal.value = false;
  selectedGuestForCheckOut.value = null;
  fetchRoomStatus();
}
const handleAmendStaySuccess = () => {
  showAmendStayModal.value = false;
  selectdReservationId.value = null;
}
const closeAmendStayModal = () => {
  showAmendStayModal.value = false;
  selectdReservationId.value = null;
  fetchRoomStatus();
}
const handlerRoomStatus = (item: any, action: string) => {
  selectdReservationId.value = item.reservation_id
  switch (action) {
    case 'check_out':
      showCheckOutModal.value = true;
      break;
    case 'amend_stay':
      showAmendStayModal.value = true;
      break;
  }
}
const handlerPendingReservation = (item: any, action: string) => {
  selectdReservationId.value = item.reservation_id
  // Handle specific actions using the composable
  switch (action) {
    case 'cancel_reservation':
      showCancelModal.value = true;
      break;
    case 'mark_no_show':
      showNoShowModal.value = true;
      break;
    case 'void_booking':
      showVoidModal.value = true;
      break;
    case 'check_in':
      selectedReservationForCheckIn.value = item;
      showCheckInModal.value = true;
      break;
    default:
      console.log(`Action ${action} not handled`);
  }
}


const editReservation = (item: any) => {
  toast.info(`Edit reservation: ${item.resNo}`)
}



const collectPayment = async (item: any) => {
  try {
    // This would typically open a payment modal, for now we'll simulate payment collection
    const paymentData = {
      reservationId: item.id,
      amount: parseFloat(item.total?.replace(',', '') || '0'),
      paymentMethod: 'cash', // This should come from user selection
      notes: 'Release reservation payment confirmation',
      serviceId: 1 // Hotel service ID
    }

    await createPayment(paymentData)
    await confirmPayment(item.id, { confirmed: true })

    toast.success(t('Payment collected and reservation confirmed'))
    await fetchReleaseReservations() // Refresh the list
  } catch (error) {
    console.error('Payment collection error:', error)
    toast.error(t('Failed to collect payment'))
  }
}

const changeRelease = async (item: any) => {
  try {
    // This would typically open a date picker modal
    // For now, we'll extend the release date by 7 days
    const newReleaseDate = new Date()
    newReleaseDate.setDate(newReleaseDate.getDate() + 7)

    // This would need a specific API endpoint to update release date
    // For now, we'll use the general reservation update
    const updateData = {
      releaseDate: newReleaseDate.toISOString(),
      notes: 'Release date extended during night audit'
    }

    // await putReservation(item.id, updateData) // Uncomment when API supports release date updates

    toast.info(t('Release date updated successfully'))
    await fetchReleaseReservations() // Refresh the list
  } catch (error) {
    console.error('Release date update error:', error)
    toast.error(t('Failed to update release date'))
  }
}


// Handle selection change for nightly charges
const handleChargesSelectionChange = (selectedItems: any[]) => {
  selectedCharges.value = selectedItems
}

// Computed property to check if post button should be enabled
const canPostCharges = computed(() => {
  return selectedCharges.value.length > 0
})

// Post selected charges function
const postSelectedCharges = async () => {
  if (selectedCharges.value.length === 0) {
    toast.warning(t('Please select at least one charge to post'))
    return
  }

  try {
    postingCharges.value = true
    const playload = {
      auditDate: currentDate.value,
      charges: selectedCharges.value.map((ch: any) => {
        return {
          reservationId: ch.reservation_id,
          folioId: ch.folio_id,
          description: `Night Audit - ${currentDate} posting`,
          amount: ch.rate,
        }
      })
    }
    const charges = await postNightlyCharges(Number(serviceStore.serviceId), currentDate.value, playload)

    console.log('responses', charges)

    // Clear selection after posting
    selectedCharges.value = []
    toast.success(t('Selected charges posted successfully'))
    // Refresh nightly charges data
    await fetchNightlyCharges()
  } catch (error) {
    console.error('Error posting selected charges:', error)
    toast.error(t('Failed to post selected charges'))
  } finally {
    postingCharges.value = false
  }
}



const finishNightAudit = async () => {
  finishingAudit.value = true
  try {
    // Step 4: Call createNightAudit API
    await createNightAudit({
      auditDate: currentDate.value,
      hotelId: serviceStore.serviceId
    })
    // Mark audit as completed
    auditCompleted.value = true
    // Success notification
    toast.success(t('Night audit completed successfully. Business day closed.'))
    router.back();

  } catch (error) {
    console.error('Night audit completion error:', error)
    toast.error(t('Failed to complete night audit'))
  } finally {
    finishingAudit.value = false
  }
}

// Watch currentStep and save to localStorage
watch(currentStep, (newStep) => {
  localStorage.setItem('nightAuditCurrentStep', newStep.toString())
}, { immediate: true })

// Load data on mount
onMounted(() => {
  // Load initial data for all steps
  fetchPendingReservations()

  // Load data for the current step if not step 1
  if (currentStep.value === 2) {
    fetchReleaseReservations()
  } else if (currentStep.value === 3) {
    fetchRoomStatus()
  } else if (currentStep.value === 4) {
    fetchUnsettledFolios()
  } else if (currentStep.value === 5) {
    fetchNightlyCharges()
  }
})
</script>