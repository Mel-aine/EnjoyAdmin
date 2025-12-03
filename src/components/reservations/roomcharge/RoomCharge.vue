<template>
  <div class="flex h-[calc(100vh-250px)] mx-4 mt-2 shadow-lg dark:bg-gray-900 dark:text-gray-100">
    <!-- Left Sidebar - Room Selection -->
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50 dark:bg-gray-900 dark:border-gray-800 max-h-full">
      <div class="h-full flex flex-col">
        <div class="bg-white dark:bg-gray-800 dark:text-gray-100 flex-grow overflow-y-auto ">
          <!-- Room/Group Header -->
          <div class="px-2 pb-2">
            {{ $t('updateDetails') }}
          </div>
          <!-- Single Room Display -->
          <div v-if="singleRoom">
            <div :title="$t('roomNumber')">
              <div>
                <div class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 my-1">
                  <div class="flex flex-col">
                    <span class="capitalize">{{ singleRoom?.roomNumber }}-{{ singleRoom?.guestName }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ }}</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
          <!-- Group Rooms Display -->
          <div v-if="groupRooms.length > 0">
            <div v-for="room in groupRooms" :key="room.id" :class="{ 'bg-gray-200 dark:bg-gray-700': selectedRoomId === room.id }"
              @click="selectRoom(room.id)">
              <div class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 my-1">
                <div class="flex flex-col">
                  <span class="capitalize">{{ room.roomNumber }}-{{ room.guestName }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ room.roomType || '' }}</span>
                </div>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Summary -->
        <div class="px-4 gap-1 py-2 text-sm flex flex-col border-t border-gray-200 dark:border-gray-700">
          <!-- Total Charges -->
          <div class="flex justify-between text-sm text-blue-600">
            <span>{{ $t('Total') }}</span>
            <span>{{ formatCurrency(reservation.balanceSummary.totalChargesWithTaxes) }}</span>
          </div>
          <!-- Total Tax -->
          <div class="flex justify-between text-sm text-green-600">
            <span>{{ $t('paid') }}</span>
            <span>{{ formatCurrency(reservation.balanceSummary.totalPayments) }}</span>
          </div>
          <!-- Total Discounts -->
          <div class="flex justify-between text-xm text-red-600">
            <span>{{ $t('Balance') }}</span>
            <span>{{ formatCurrency(reservation.balanceSummary.outstandingBalance) }}</span>
          </div>

          <!-- Room Info -->
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 pt-1 border-t border-gray-100 dark:border-gray-800">
            <span>{{ summaryData?.totalRooms }} {{ summaryData?.totalRooms === 1 ? $t('Room') : $t('Rooms') }} • {{
              summaryData?.totalTransactions }} {{ $t('transactions') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Content Area -->
    <div class="w-10/12 flex flex-col">
      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100">
        <BasicButton :label="$t('updateDetails')" @click="updateDetails" />
        <BasicButton :label="$t('applyDiscount')" @click="openApplyDiscountModal" />

        <!-- More Actions Dropdown
        <div class="relative">
          <ButtonDropdown
            v-model="selectedMoreAction"
            :options="getMoreActionOptions()"
            :button-text="$t('more')"
            :button-class="'bg-white border border-gray-200'"
            @option-selected="handleMoreAction"
          />
        </div>-->

        <!-- Status Indicators
        <div class="ml-auto flex items-center gap-2">
          <span class="flex items-center gap-1 text-sm">
            <div class="w-3 h-3 bg-orange-400 rounded"></div>
            {{ $t('unposted') }}
          </span>
          <span class="flex items-center gap-1 text-sm">
            <div class="w-3 h-3 bg-gray-600 rounded"></div>
            {{ $t('posted') }}
          </span>
          <div class="flex gap-1">
            <button class="p-1 hover:bg-gray-100 rounded" @click="refreshData">
              <RefreshCcw class="w-4 h-4" />
            </button>
            <button class="p-1 hover:bg-gray-100 rounded">
              <SettingsIcon class="w-4 h-4" />
            </button>
          </div>
        </div>-->
      </div>

      <!-- Room Charges Table -->
      <div class="flex-grow overflow-y-auto custom-scrollbar">
        <ReusableTable :columns="columns" :data="filteredRoomChargeData" :loading="loading" :show-header="true"
          :selectable="false" :searchable="false" :title="getTableTitle()"
          @selection-change="handleTableSelectionChange">
          <!-- Custom Stay Column -->
          <template #column-transactionDate="{ item }">
            <div class="text-sm text-gray-900 dark:text-gray-100">
              <div class="font-medium">{{ formatTransactionDate(item.transactionDate) }}</div>
            </div>
          </template>

          <!-- Custom Room Column -->
          <template #column-room="{ item }">
            <div class="text-sm font-medium">
              {{ item.room?.roomNumber || '---' }}
            </div>
          </template>

          <!-- Custom Rate Type Column -->
          <template #column-rateType="{ item }">
            <div class="text-sm">
              {{ item.rateType?.ratePlanName || '---' }}
            </div>
          </template>

          <!-- Custom Pax Column -->
          <template #column-pax="{ item }">
            <div class="text-sm">
              {{ item.pax || '0/0' }}
            </div>
          </template>

          <!-- Custom Charge Column -->
          <template #column-charge="{ item }">
            <div class="text-sm">
              <div class="font-medium text-black dark:text-gray-100">{{ formatAmount(item.charge || 0) }}</div>
            </div>
          </template>


          <!-- Custom Tax Column -->
          <template #column-tax="{ item }">
            <div class="text-sm text-black dark:text-gray-100">
              {{ formatAmount(item.tax || 0) }}
            </div>
          </template>

          <!-- Custom Adjustment Column -->
          <template #column-adjustment="{ item }">
            <div class="text-sm">
              {{ formatAmount(item.adjustment || 0) }}
            </div>
          </template>

          <!-- Custom Net Amount Column -->
          <template #column-netAmount="{ item }">
            <div class="text-sm font-bold">
              {{ formatAmount(item.netAmount) }}
            </div>
          </template>


        </ReusableTable>
      </div>

      <!-- Footer Summary -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {{ isGroupReservation ? $t('GroupTotalRoomCharges') : $t('TotalRoomCharges') }}
          </span>
          <div class="text-right">
            <div class="text-sm font-medium dark:text-gray-100">
              {{ $t('TotalAmount') }}: {{ formatAmount(calculatedTotalAmount) }}
            </div>
          </div>
        </div>
      </div>

      <!--Modals-->
      <template v-if="isVoidReservationModalOpen">
        <VoidReservation :reservation-id="reservationId" :is-open="isVoidReservationModalOpen"
          @close="closeVoidReservationModal" :selected-items="selectedTableItems" @void-success="handleVoidSuccess"
          :all-room-charges="filteredRoomChargeData" />
      </template>

      <template v-if="isCheckInReservationModalOpen">
        <CheckInReservation :reservation-id="reservationId" :is-open="isCheckInReservationModalOpen"
          @close="closeCheckInReservationModal" />
      </template>

      <template v-if="isUnAssignReservationModalOpen">
        <UnAssignRoomReservation :reservation-id="reservationId" :is-open="isUnAssignReservationModalOpen"
          @close="closeUnAssignReservationModal" />
      </template>
      <template v-if="reservation">
        <AmendStay :is-open="showAmendModal" :reservation-data="reservation" @close="showAmendModal = false"
          :reservation-id="reservation.id" :reservation-number="reservation.reservationNumber"
          @amend-confirmed="handleAmendConfirmed" :reservation="reservation" />

        <CancelReseravtion :is-open="showCancelModal" :reservation-data="reservation" @close="showCancelModal = false"
          :reservation-id="reservation.id" :reservation-number="reservation.reservationNumber"
          @cancel-confirmed="handleCancelConfirmed" />
      </template>
    </div>
    <template v-if="isApplyDiscountModalOpen">
      <!-- Apply Discount Modal -->
      <ApplyDiscountRoomCharge v-if="isApplyDiscountModalOpen" :is-open="isApplyDiscountModalOpen"
        :reservation-id="reservationId" :room-charges="roomChargeData" @close="closeApplyDiscountModal"
        @discount-applied="handleDiscountApplied" />
    </template>
    <template v-if="isUpdateReservationDetailsOpen">
      <UpdateReservationDetails :room-charges="roomChargeData" :is-open="isUpdateReservationDetailsOpen"
        :reservation-id="reservationId" @close="closeUpdateReservationDetailsModal"
        @save="handleUpdateDetailsApplied" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronRight } from 'lucide-vue-next'
import ReusableTable from '../../tables/ReusableTable.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import type { Column } from '../../../utils/models'
import { getRoomCharges } from '../../../services/reservation'
import ApplyDiscountRoomCharge from '../foglio/ApplyDiscountRoomCharge.vue'
import { useToast } from 'vue-toastification';
import AmendStay from '../foglio/AmendStay.vue'
import CancelReseravtion from '../foglio/CancelReseravtion.vue'
const CheckInReservation = defineAsyncComponent(() => import('../CheckInReservation.vue'))
const UnAssignRoomReservation = defineAsyncComponent(() => import('../UnAssignRoomReservation.vue'))
import { formatCurrency } from '../../utilities/UtilitiesFunction'
import VoidReservation from '../foglio/VoidReservation.vue'
import UpdateReservationDetails from '@/views/FrontOffice/reservation/UpdateReservationDetails.vue'

const { t } = useI18n()

// Props
const props = defineProps({
  reservationId: {
    type: Number,
    required: true
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  reservation: {
    type: Object,
    default: () => ({})
  }
})


// Modal state
const isAddRoomChargeModalOpen = ref(false)
const isApplyRateModalOpen = ref(false)
const isApplyDiscountModalOpen = ref(false)
const showCancelModal = ref(false)

interface RoomChargeItem {
  id: number
  date: string
  roomNumber: string
  rateType: string
  description: string
  amount: number
  status: 'active' | 'inactive'
  nights: number
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data?: any): void
  (e: 'refresh'): void
}

const loading = ref(false)
const selectedRoomId = ref<number | null>(null)
const totalAmount = ref(0)
const roomChargeData = ref<any[]>([])
const groupRooms = ref<any[]>([])
const singleRoom = ref<any>(null)
const summaryData = ref<any>(null)
const reservationStatus = ref<string>('')
const checkInDate = ref<string>('')
const isVoidReservationModalOpen = ref(false)
const selectedTableItems = ref<any[]>([])
const toast = useToast()
const isCheckInReservationModalOpen = ref(false)
const isUnAssignReservationModalOpen = ref(false)
const showAmendModal = ref(false)
const isExchangeRoomModalOpen = ref(false)
const isRoomMoveModalOpen = ref(false)
const isUpdateReservationDetailsOpen = ref(false)

const emit = defineEmits<Emits>()

const closeExchangeRoomModal = () => {
  isExchangeRoomModalOpen.value = false
}

const closeRoomMoveModal = () => {
  isRoomMoveModalOpen.value = false
}

// Computed Properties
const isGroupReservation = computed(() => groupRooms.value.length > 1)

const filteredRoomChargeData = computed(() => {
  if (!isGroupReservation.value) {
    return roomChargeData.value
  }

  if (selectedRoomId.value) {
    return roomChargeData.value.filter(charge => charge.room?.roomId === selectedRoomId.value)
  }

  return roomChargeData.value
})

const calculatedTotalAmount = computed(() => {
  return filteredRoomChargeData.value.reduce((sum, item) => sum + (item.netAmount || 0), 0)
})

const selectedRoomTotal = computed(() => {
  if (!selectedRoomId.value) return calculatedTotalAmount.value

  const roomCharges = roomChargeData.value.filter(charge => charge.room?.roomId === selectedRoomId.value)
  return roomCharges.reduce((sum, item) => sum + (item.netAmount || 0), 0)
})

// Fonction pour vérifier si le check-in est possible
const canCheckIn = computed(() => {
  // Vérifier si le statut est "confirmed" (ou équivalent)
  const isConfirmed = reservationStatus.value?.toLowerCase() === 'confirmed' ||
    reservationStatus.value?.toLowerCase() === 'confirmée' ||
    reservationStatus.value?.toLowerCase() === 'confirm'

  // Vérifier si la date de check-in est aujourd'hui ou dans le passé
  const today = new Date()
  const checkIn = new Date(checkInDate.value)

  // Normaliser les dates pour comparer seulement jour/mois/année
  const todayStr = today.toDateString()
  const checkInStr = checkIn.toDateString()

  const isCheckInDateReached = checkIn <= today

  return isConfirmed && isCheckInDateReached
})

const canCancel = computed(() => {
  const isCancel = reservationStatus.value?.toLocaleLowerCase() != 'cancelled'
  return isCancel
})


// Table Columns
const columns = computed<Column[]>(() => [
  { key: 'transactionDate', label: t('Stay'), type: 'custom' },
  { key: 'room', label: t('Room'), type: 'custom' },
  { key: 'rateType', label: t('RateType'), type: 'custom' },
  { key: 'pax', label: t('Pax(A/C)'), type: 'custom' },
  { key: 'charge', label: t('Charge'), type: 'custom' },
  { key: 'discount', label: t('Discount'), type: 'custom' },
  { key: 'tax', label: t('Tax'), type: 'custom' },
  { key: 'adjustment', label: t('Adjustment'), type: 'custom' },
  { key: 'netAmount', label: t('NetAmount'), type: 'custom' },

])

// More Actions Options


const getMoreActionOptions = () => {
  const baseOptions = [
    { label: t('RemoveTransaction'), id: 'removeTransaction' },
  ]

  if (isGroupReservation.value) {
    const groupOptions: any[] = []

    // Récupérer les informations de statut et de dates
    const status = reservationStatus.value?.toLowerCase()
    const currentDate = new Date()
    const arrivalDate = new Date(checkInDate.value)
    // const departureDate = new Date(props.reservation?.departDate || props.reservation?.checkOutDate)

    // Check-in: Available for confirmed reservations on or after arrival date
    if (canCheckIn.value) {
      groupOptions.push({ label: t('groupCheckIn'), id: 'groupCheckIn' })
    }

    // Group Check-out: Available during stay (checked-in status)
    // if (['checked-in', 'checked_in'].includes(status) && currentDate >= departureDate) {
    //   groupOptions.push({ label: t('groupCheckOut'), id: 'groupCheckOut' })
    // }

    // Group Amend Stay: Available before or during stay
    if (['confirmed', 'guaranteed', 'pending', 'checked-in', 'checked_in'].includes(status)) {
      groupOptions.push({ label: t('GroupAmendStay'), id: 'groupAmendStay' })
    }

    // Group Cancellation: Available before check-in
    if (['confirmed', 'guaranteed', 'pending'].includes(status) && currentDate < arrivalDate) {
      groupOptions.push({ label: t('GroupCancellation'), id: 'groupCancellation' })
    }


    // Unassign Rooms: Available for confirmed reservations
    if (['confirmed', 'guaranteed', 'pending'].includes(status)) {
      groupOptions.push({ label: t('UnassignRooms'), id: 'unassignRooms' })
    }

    // Void Group: Available for recent reservations with certain conditions
    const numRooms = groupRooms.value?.length || 0
    if (['confirmed', 'guaranteed', 'pending'].includes(status) && numRooms <= 10) {
      groupOptions.push({ label: t('VoidGroup'), id: 'voidGroup' })
    }



    // Actions disponibles pour tous les statuts actifs
    if (!['cancelled', 'no-show', 'voided'].includes(status)) {
      groupOptions.push(
        { label: t('ChangeOwner'), id: 'changeOwner' },
        { label: t('GroupSettlement'), id: 'groupSettlement' }
      )
    }

    // Actions spéciales pour les groupes confirmés/en attente
    if (['confirmed', 'guaranteed', 'pending', 'checked-in', 'checked_in'].includes(status)) {
      groupOptions.push(
        { label: t('SetReleaseDate'), id: 'setReleaseDate' },
        { label: t('AddBookingToGroup'), id: 'addBookingToGroup' },

      )
    }

    return [...baseOptions, ...groupOptions]
  }

  return baseOptions
}
// Utility Functions
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount || 0).replace('XAF', 'XAF ')
}

const formatDateRange = (checkIn: string, checkOut: string): string => {
  if (!checkIn || !checkOut) return '---'

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  return `${formatDate(checkIn)} - ${formatDate(checkOut)}`
}

// Format transaction date as DD/MM/YYYY Weekday (e.g., 11/10/2022 Tue)
const formatTransactionDate = (dateStr: string): string => {
  if (!dateStr) return '---'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return String(dateStr)

  const datePart = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
  return `${datePart} ${weekday}`
}



// Event Handlers
const selectRoom = (roomId: number) => {
  selectedRoomId.value = selectedRoomId.value === roomId ? null : roomId
}

const handleMoreAction = (action: any) => {
  console.log('More action selected:', action)

  switch (action.id) {
    case 'groupCheckIn':
      if (canCheckIn.value) {
        openCheckInReservationModal()
      } else {
        toast.warning(t('checkInNotAvailable'))
      }
      break

    case 'unassignRooms':
      openUnAssignReservationModal()
      break

    case 'voidGroup':
      if (canVoidGroup.value) {
        openVoidReservationModal()
      }

      break

    case 'groupAmendStay':
      showAmendModal.value = true
      break

    case 'groupCancellation':
      if (canCancel.value) {
        showCancelModal.value = true
      } else {
        toast.warning(t('cancellationNotAvailable'))
      }
      break

    case 'changeOwner':
      openChangeOwnerModal()
      break

    case 'setReleaseDate':
      openSetReleaseDateModal()
      break

    case 'groupSettlement':
      openGroupSettlementModal()
      break

    case 'addBookingToGroup':
      openAddBookingToGroupModal()
      break

    default:
      console.warn('Unknown action:', action.id)
  }
}



const updateDetails = () => {
  console.log('Update details clicked')
  // Open Update Reservation Details modal
  isUpdateReservationDetailsOpen.value = true
}



const refreshData = async () => {
  await loadRoomCharges()
}

const handleTableSelectionChange = (selectedItems: any[]) => {
  selectedTableItems.value = selectedItems
}

// Data Loading
const loadRoomCharges = async () => {
  loading.value = true

  try {
    const response = await getRoomCharges(props.reservationId)
    console.log('Room charges response:', response.data)

    if (response.data) {
      roomChargeData.value = response.data.roomChargesTable || []
      summaryData.value = response.data.summary || {}
      totalAmount.value = response.data.summary?.totalNetAmount || 0
      // balanceAmount.value = response.data.summary?.outstandingBalance || 0

      // Récupérer le statut et la date de check-in depuis la réponse
      reservationStatus.value = response.data.status || response.data.reservationStatus || ''
      checkInDate.value = response.data.checkInDate || response.data.stay?.checkInDate || ''

      // Handle single room reservation
      if (response.data.roomChargesTable && response.data.roomChargesTable.length > 0) {
        // Extract unique rooms from room charges
        const uniqueRooms = response.data.roomChargesTable
          .map((charge: any) => ({
            id: charge.room?.roomId,
            roomNumber: charge.room?.roomNumber,
            roomType: charge.room?.roomType,
            guestName: charge.guestName || response.data.guestName || 'Guest'
          }))
          .filter((room: any, index: number, self: any[]) =>
            room.id && index === self.findIndex(r => r.id === room.id)
          )

        if (uniqueRooms.length > 1) {
          // Multiple rooms - treat as group
          groupRooms.value = uniqueRooms
          console.log("uniqueRooms", uniqueRooms)
          selectedRoomId.value = null
        } else if (uniqueRooms.length === 1) {
          // Single room
          singleRoom.value = uniqueRooms[0]
          groupRooms.value = []
          selectedRoomId.value = null

        }
      }
    }
  } catch (error) {
    console.error('Error loading room charges:', error)
  } finally {
    loading.value = false
  }
}


const getTableTitle = (): string => {
  if (isGroupReservation.value) {
    if (selectedRoomId.value) {
      const room = groupRooms.value.find(r => r.id === selectedRoomId.value)
      return `${t('RoomCharges')} - ${room?.roomNumber || ''}`
    }
    return t('GroupRoomCharges')
  }
  return t('RoomCharges')
}


//handle Modal

const openCheckInReservationModal = () => {
  isCheckInReservationModalOpen.value = true
}

const closeCheckInReservationModal = () => {
  isCheckInReservationModalOpen.value = false
}

const openUnAssignReservationModal = () => {
  isUnAssignReservationModalOpen.value = true
}

const closeUnAssignReservationModal = () => {
  isUnAssignReservationModalOpen.value = false
}

const handleApplyRate = (rateData: any) => {
  console.log('Applying rate:', rateData)
  // Here you would typically update room charges with new rates
  closeApplyRateModal()
}

const handleAmendConfirmed = () => {
  showAmendModal.value = false
  // Emit save event to notify parent components
  emit('save', { action: 'amend', reservationId: props.reservation?.id })
}

const handleCancelConfirmed = () => {
  showCancelModal.value = false
  emit('save', { action: 'cancel', reservationId: props.reservation?.id })
}

// Apply Discount modal handlers
const openApplyDiscountModal = () => {
  isApplyDiscountModalOpen.value = true
}

const closeApplyDiscountModal = () => {
  isApplyDiscountModalOpen.value = false
}

const handleDiscountApplied = (discountData: any) => {
  console.log('Discount applied:', discountData)
  // Refresh room charges data after discount is applied
  getTransactionFolio()
  closeApplyDiscountModal()
}
const getTransactionFolio = async () => {
  loading.value = true;
  const response = await getRoomCharges(props.reservationId);
  console.log(response.data);
  if (response.data) {
    roomChargeData.value = response.data.roomChargesTable;
    totalAmount.value = response.data.summary?.totalNetAmount;
  }
  loading.value = false;
}

const openVoidReservationModal = () => {
  // if (selectedTableItems.value.length === 0) {
  //   toast.warning(t('toast.selectedItems'))
  //   return
  // }
  isVoidReservationModalOpen.value = true
}

const closeVoidReservationModal = () => {
  isVoidReservationModalOpen.value = false
}
const closeUpdateReservationDetailsModal = () => {
  isUpdateReservationDetailsOpen.value = false
}

const handleUpdateDetailsApplied = async (_response: any) => {
  // Refresh data after details update (discount applied)
  // await getTransactionFolio()
  emit('refresh')
  closeUpdateReservationDetailsModal()
}

const canVoidGroup = computed(() => {
  const status = reservationStatus.value?.toLowerCase()
  const numRooms = groupRooms.value?.length || 0

  return ['confirmed', 'guaranteed', 'pending'].includes(status) && numRooms <= 10
})

// Fonctions d'ouverture des modales (à implémenter selon vos besoins)


const openChangeOwnerModal = () => {
  // À implémenter
  console.log('Opening change owner modal')
}

const openSetReleaseDateModal = () => {
  // À implémenter
  console.log('Opening set release date modal')
}

const openGroupSettlementModal = () => {
  // À implémenter
  console.log('Opening group settlement modal')
}

const openAddBookingToGroupModal = () => {
  // À implémenter
  console.log('Opening add booking to group modal')
}



const handleVoidSuccess = async () => {
  try {
    // Recharger les données pour refléter les changements
    await loadRoomCharges()

    // Vider la sélection des éléments
    selectedTableItems.value = []

    console.log('Reservation voided successfully, data refreshed')
  } catch (error) {
    console.error('Error refreshing data after void:', error)
    // Optionnel: afficher un toast d'avertissement si le refresh échoue
    toast.warning(t('data_refresh_failed'))
  }
}

const closeApplyRateModal = () => {
  isApplyRateModalOpen.value = false
}





// Lifecycle


// Watchers
watch(() => props.reservationId, (newId) => {
  if (newId) {
    loadRoomCharges()
  }
}, { immediate: true })
</script>
<style scoped>
/* Scrollbar invisible mais toujours scrollable */
.custom-scrollbar {
  scrollbar-width: none;
  /* Firefox */
}

.custom-scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Edge */
}
</style>
