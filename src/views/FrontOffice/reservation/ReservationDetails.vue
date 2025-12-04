<script setup lang="ts">
import {
  ArrowLeft,
  Building2Icon,
  Users,
} from 'lucide-vue-next'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'

const props = defineProps<{
  id: string
}>()

import { useI18n } from 'vue-i18n'
const FoglioOperation = defineAsyncComponent(() => import('../../../components/reservations/foglio/FoglioOperation.vue'))
const RoomCharge = defineAsyncComponent(() => import('../../../components/reservations/roomcharge/RoomCharge.vue'))
const BookingDetails = defineAsyncComponent(() => import('../../../components/reservations/bookingdetails/BookingDetails.vue'))
import router from '../../../router'
import { useRoute } from 'vue-router'
import { getReservationDetailsById } from '../../../services/api'
import AdminLayout from '../../../components/layout/AdminLayout.vue'
import Adult from '../../../icons/Adult.vue'
import Child from '../../../icons/Child.vue'
import { formatTimeFromTimeString } from '../../../components/utilities/UtilitiesFunction'
const GuestDetails = defineAsyncComponent(() => import('../../../components/reservations/GuestDetails.vue'))
import ReservationDetailsSkeleton from '../../../components/skeletons/ReservationDetailsSkeleton.vue'
import ReservationAction from '../../../components/reservations/ReservationAction.vue'

import PrintModal from '../../../components/common/PrintModal.vue'
const BookingConfirmationTemplate = defineAsyncComponent(() => import('../../../components/common/templates/BookingConfirmationTemplate.vue'))
const AuditTrail = defineAsyncComponent(() => import('../../../components/audit/AuditTrail.vue'))
const ReservationStatus = defineAsyncComponent(() => import('../../../components/common/ReservationStatus.vue'))
const AssignRoomReservation = defineAsyncComponent(() => import('../../../components/reservations/AssignRoomReservation.vue'))
import { useToast } from 'vue-toastification'
import { confirmBooking } from '@/services/reservation';
import OverLoading from '../../../components/spinner/OverLoading.vue'
import getOtaIconSrc from '@/utils/otaIcons'

// États des modals
const showPrintModal = ref(false)
const isPending = ref(false)

const { t } = useI18n()
const toast = useToast()

// ====== NOUVELLE APPROCHE : État local réactif ======
const localReservation = ref<any>({})
const isLoading = ref(false)
const isRefreshing = ref(false)


const tabs = computed(() => [
  { id: 'folio_operations', label: t('Folio Operations') },
  { id: 'booking_details', label: t('Booking Details') },
  { id: 'guest_details', label: t('Guest Details') },
  { id: 'room_charges', label: t('Room Charges') },
  { id: 'audit_trial', label: t('Audit Trail') },
])
const VALID_TAB_IDS = new Set<string>([
  'folio_operations',
  'booking_details',
  'guest_details',
  'room_charges',
  'audit_trial',
])

const route = useRoute()

const coerceTab = (value: unknown): string => {
  const str = typeof value === 'string' ? value : ''
  return VALID_TAB_IDS.has(str) ? str : 'folio_operations'
}

const activeTab = ref<string>(coerceTab(route.query.tab))

const onTabClick = (tabId: string) => {
  if (!VALID_TAB_IDS.has(tabId)) return
  activeTab.value = tabId
  router.replace({ query: { ...route.query, tab: tabId } })
}

watch(
  () => route.query.tab,
  (newTab) => {
    const resolved = coerceTab(newTab)
    if (resolved !== activeTab.value) {
      activeTab.value = resolved
    }
  },
)

// ====== FONCTION CLÉ : Mise à jour locale ======
const updateLocalReservation = (updates: any) => {
  console.log('Updating reservation with:', updates)
  localReservation.value = {
    ...localReservation.value,
    ...updates
  }
  console.log('Updated reservation:', localReservation.value)
}

const handleChildReservationUpdated = async (updated: any) => {
  isRefreshing.value = true
  try {
    localReservation.value = { ...updated }
    await refreshAvailableActions()
    foglioRef.value?.refreshFolio?.()
  } finally {
    isRefreshing.value = false
  }
}

const handleChildSave = async (_payload: any) => {
  isRefreshing.value = true
  try {
    await refreshAvailableActions()
    foglioRef.value?.refreshFolio?.()
  } finally {
    isRefreshing.value = false
  }
}

// ====== FONCTION : Rafraîchir uniquement les actions disponibles ======
const refreshAvailableActions = async () => {
  isRefreshing.value = true
  try {
    const response = await getReservationDetailsById(Number(props.id))
    if (response.status === 200) {
      updateLocalReservation({
        availableActions: response.data.availableActions,
        status: response.data.status,
        balanceSummary: response.data.balanceSummary
      })
    }
  } catch (error) {
    console.error('Error refreshing available actions:', error)
    toast.error(t('Error refreshing reservation data'))
  } finally {
    isRefreshing.value = false
  }
}




// ====== CHECK-IN ======


// ====== CHECK-OUT ======










// ====== ROOM ASSIGNMENT ======
const handleRoomAssignmentRefresh = async () => {

  await getBookingDetailsById()
}

const handleRoomChargeRefresh = async () => {

  await getBookingDetailsById()
}
// ====== GESTION DES OPTIONS ======

// ====== CHARGEMENT INITIAL ======
const getBookingDetailsById = async () => {
  isLoading.value = true
  const response = await getReservationDetailsById(Number(props.id))
  console.log('reservation',response)
  if (response.status === 200) {
    localReservation.value = response.data
    if(response.data.status === 'pending'){
      isPending.value = true
    }
  }
  isLoading.value = false
}

// ====== COMPUTED PROPERTIES ======
const roomRateTypeSummary = computed(() => {
  if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
    return 'N/A'
  }

  const reservationRooms = localReservation.value.reservationRooms
  const roomNumbers = reservationRooms.map((room: any) => {
    return `${room.room?.roomNumber} -${room?.roomType?.roomTypeName} / ${room?.roomRates?.rateType?.rateTypeName} `
  })

  return roomNumbers[0]
})

const nightsSummary = computed(() => {
  if (!localReservation.value?.reservationRooms || localReservation.value.reservationRooms.length === 0) {
    return 0
  }

  const rooms = localReservation.value.reservationRooms

  if (rooms.length === 1) {
    return rooms[0].nights
  }

  const firstNights = rooms[0].nights
  const allSameNights = rooms.every((room: any) => room.nights === firstNights)

  if (allSameNights) {
    return firstNights
  }

  const nightsArray = rooms.map((room: any) => room.nights)
  const minNights = Math.min(...nightsArray)
  const maxNights = Math.max(...nightsArray)

  return `${minNights}-${maxNights}`
})

const printDocumentData = computed(() => {
  if (!localReservation.value) return null

  return {
    type: 'reservation',
    reservation: {
      id: localReservation.value.id,
      reservationNumber: localReservation.value.reservationNumber,
      status: localReservation.value.status,
      arrivalDate: localReservation.value.arrivalDate,
      departureDate: localReservation.value.departureDate,
      nights: localReservation.value.nights,
      adults: localReservation.value.adults,
      children: localReservation.value.children,
    },
    guest: {
      firstName: localReservation.value.guest?.firstName,
      lastName: localReservation.value.guest?.lastName,
      email: localReservation.value.guest?.email,
      phone: localReservation.value.guest?.phone,
    },
    rooms:
      localReservation.value.reservationRooms?.map((room: any) => ({
        roomNumber: room.room?.roomNumber,
        roomType: room.room?.roomType?.name,
        rate: room.rate,
      })) || [],
    financial: {
      totalAmount: localReservation.value.totalAmount,
      paidAmount: localReservation.value.paidAmount,
      balance: localReservation.value.balance,
    },
  }
})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('en', options)
}

const otaName = computed(() =>
  localReservation.value?.otaName ||
  localReservation.value?.bookingSourceName ||
  localReservation.value?.bookingSource?.name || null
)
const otaIconSrc = computed(() => getOtaIconSrc(otaName.value))


const handlePrintClose = () => {
  showPrintModal.value = false
}

const handlePrintSuccess = (data: any) => {
  console.log('Print successful:', data)
  showPrintModal.value = false
}

const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}

const foglioRef = ref<any>(null)

const templates = ref([
  {
    id: '1',
    name: 'Reservation',
    description: 'Reservation template',
    component: BookingConfirmationTemplate,
  },
])

// Fonction pour rafraîchir une réservation spécifique (appelée depuis les composants enfants)
const refresReservation = async () => {
  await refreshAvailableActions()
}

//fonction to confirm reservation
const isConfirming = ref(false)

const ReservationConfirm = async () => {
  try {
    isConfirming.value = true

    const data = {
      status: 'confirmed'
    }

    const res = await confirmBooking(localReservation.value.id, data)
    console.log("res", res)

    if (res.status === 200 || res.data) {
      updateLocalReservation({
        status: 'confirmed'
      })

      isPending.value = false

      toast.success(t('Reservation confirmed successfully'))

      isRefreshing.value = true
      try {
        await getBookingDetailsById()
      } finally {
        isRefreshing.value = false
      }
    }

  } catch (error: any) {
    console.error('Error confirming reservation:', error)
    const errorMessage = error.response?.data?.message || error.message || t('Failed to confirm reservation')
    toast.error(errorMessage)
  } finally {
    isConfirming.value = false
  }
}

onMounted(() => {
  // Ensure URL carries the current tab on initial mount
  if (!route.query.tab || !VALID_TAB_IDS.has(String(route.query.tab))) {
    router.replace({ query: { ...route.query, tab: activeTab.value } })
  }
  getBookingDetailsById()
})
</script>

<template>
  <AdminLayout>
    <OverLoading v-if="isRefreshing" />
    <ReservationDetailsSkeleton v-if="isLoading" />

    <div class="h-full" v-else-if="localReservation && localReservation.id"
      :class="{ 'void-status': localReservation.status === 'voided' }">
      <!--Header-->
      <div class="shadow-sm px-4 py-2 mx-4 bg-white dark:bg-gray-800 dark:text-gray-100 flex justify-between">
        <div class="flex gap-2 align-middle self-center items-center">
          <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
          <img v-if="otaIconSrc" :src="otaIconSrc" alt="OTA" class="w-6 h-6"/>
          <Building2Icon v-else class="text-primary"></Building2Icon>
          <Users v-if="localReservation.isGroup" />
          <span class="font-bold">{{ localReservation.guest?.displayName }}</span>
          <div class="flex">
            <Adult class="w-5" />
            <span class="text-sm items-end align-center self-center pt-2">{{
              localReservation.adults ?? 0
            }}</span>
          </div>
          <div class="flex">
            <Child class="w-4" />
            <span class="text-sm items-end align-bottom self-center pt-2">{{
              localReservation.child ?? 0
            }}</span>
          </div>
          <div class="flex gap-8 ms-10">
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('booking.arrival') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ formatDate(localReservation.arrivedDate) }}, {{ formatTimeFromTimeString(localReservation.checkInTime) }}</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('booking.departure') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ formatDate(localReservation.departDate) }}, {{ formatTimeFromTimeString(localReservation.checkOutTime) }}</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('nights') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ nightsSummary }}</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold">{{ $t('Room/Rate types') }}</span>
              <span class="text-xs flex gap-2 flex-col"
                v-if="localReservation.reservationRooms.length > 0 && localReservation.reservationRooms.every((room: any) => room.room?.id)">
                <span>{{ roomRateTypeSummary }}</span>
              </span>
              <AssignRoomReservation :reservation="localReservation"
                v-if="localReservation.reservationRooms.length === 0 || localReservation.reservationRooms.some((room: any) => !room.room?.id)"
                @refresh="handleRoomAssignmentRefresh" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold capitalize">{{ $t('res.no') }}</span>
              <span class="text-xs flex gap-2">
                <span>{{ localReservation.reservationNumber }}</span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="isPending" class="flex gap-x-2 h-full align-middle self-center items-center justify-center">
          <button
            type="button"
            @click="ReservationConfirm"
            :disabled="isConfirming"
            class="bg-green-500 rounded-lg px-4 py-2 text-sm flex gap-2 items-center text-white shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:ring-offset-gray-900"
          >
            <svg
              v-if="isConfirming"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isConfirming ? $t('processing') || 'Processing...' : $t('ConfirmBooking') }}</span>
          </button>
        </div>
        <div v-else class="flex gap-x-2 h-full align-middle self-center items-center justify-center">
          <ReservationStatus :status="localReservation.status" />
        </div>


      </div>

      <!--main-->
      <div class="shadow-sm px-2 pt-1 mx-4 bg-white dark:bg-gray-800 dark:text-gray-100 mt-5 flex justify-between">
        <div class="flex justify-between w-full">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8 px-6">
              <button v-for="tab in tabs" :key="tab.id" @click="onTabClick(tab.id)" :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:border-gray-600',
              ]">
                <div class="flex items-center space-x-2">
                  <span>{{ tab.label }}</span>
                </div>
              </button>
            </nav>
          </div>
          <div class="align-middle self-center items-center">
            <ReservationAction
              :reservation="localReservation"
              :local-reservation="localReservation"
              @reservation-updated="handleChildReservationUpdated"
              @save="handleChildSave"
            />
          </div>
        </div>
      </div>

      <!--tab content-->
      <div v-if="activeTab === 'room_charges'">
        <RoomCharge :reservation-id="localReservation.id" :reservation="localReservation" @refresh="handleRoomChargeRefresh"></RoomCharge>
      </div>
      <div v-if="activeTab === 'folio_operations' && localReservation && localReservation.id">
        <FoglioOperation ref="foglioRef" :reservation-id="localReservation.id" :reservation="localReservation" @refresh="refresReservation">
        </FoglioOperation>
      </div>
      <div v-if="activeTab === 'booking_details'">
        <BookingDetails :booking="localReservation" :guest="localReservation.guest"></BookingDetails>
      </div>
      <div v-if="activeTab === 'guest_details'">
        <GuestDetails :reservation="localReservation" :guest="localReservation.guest" :reservationId="localReservation.id" />
      </div>
      <div v-if="activeTab === 'audit_trial'">
        <AuditTrail :entity-ids="[localReservation.id]" />
      </div>
    </div>

    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center">
        <p class="text-gray-500 dark:text-gray-400 text-lg">{{ $t('No reservation found') }}</p>
      </div>
    </div>
  </AdminLayout>

  <!-- Print Modal -->
  <template v-if="showPrintModal">
    <PrintModal :is-open="showPrintModal" :document-data="printDocumentData" @close="handlePrintClose"
      :reservation-id="localReservation.id" @print-success="handlePrintSuccess" @print-error="handlePrintError"
      :templates="templates" />
  </template>
</template>

<style scoped>
/* View-scoped dark-mode adjustments */
:deep(.dark .btn.btn-primary) {
  color: #f3f4f6 !important; /* keep primary label readable in dark */
}
</style>
