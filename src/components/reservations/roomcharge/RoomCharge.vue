<template>
  <div class="flex h-[calc(100vh-250px)] mx-4 mt-2 shadow-lg">
    <!-- Left Sidebar - Room Selection -->
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50">
      <div class="h-full flex flex-col justify-between">
        <div class="bg-white h-full">
          <!-- Room/Group Header -->
          <div class="px-2 pb-2">
            <button  class="w-full text-sm px-2 py-2 rounded cursor-pointer transition-colors">
              {{ isGroupReservation ? $t('GroupRooms') : $t('Room') }}
            </button>
          </div>

          <!-- Group Rooms Display -->
          <div v-if="isGroupReservation">
            <Accordion :title="$t('GroupInfo')" :is-open="true">
              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="room in groupRooms"
                  :key="room.id"
                  class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 my-1 transition-colors"
                  :class="{ 'bg-blue-100': selectedRoomId === room.id }"
                  @click="selectRoom(room.id)"
                >
                  <div class="flex flex-col">
                    <span class="capitalize font-medium">{{ room.roomNumber }}</span>
                    <span class="text-xs text-gray-500">{{ room.guestName }}</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </Accordion>
          </div>

          <!-- Single Room Display -->
          <div v-else>
            <Accordion :title="$t('RoomNumber')">
              <div>
                <div class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 my-1">
                  <span class="capitalize">{{ singleRoom?.roomNumber || '---' }}</span>
                  <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </Accordion>
          </div>
        </div>

        <!-- Footer Summary -->
        <div class="px-4 gap-1 py-2 text-sm flex flex-col border-t border-gray-200">
          <!-- Total Charges -->
          <div class="flex justify-between text-xs text-gray-600">
            <span>{{ $t('TotalCharges') }}</span>
            <span>{{ formatAmount(summaryData?.totalCharges || 0) }}</span>
          </div>
          <!-- Total Tax -->
          <div class="flex justify-between text-xs text-gray-600">
            <span>{{ $t('TotalTax') }}</span>
            <span>{{ formatAmount(summaryData?.totalTax || 0) }}</span>
          </div>
          <!-- Total Discounts -->
          <div v-if="summaryData?.totalDiscounts > 0" class="flex justify-between text-xs text-green-600">
            <span>{{ $t('TotalDiscounts') }}</span>
            <span>-{{ formatAmount(summaryData?.totalDiscounts || 0) }}</span>
          </div>
          <!-- Total Adjustments -->
          <div v-if="summaryData?.totalAdjustments !== 0" class="flex justify-between text-xs" :class="summaryData?.totalAdjustments > 0 ? 'text-green-600' : 'text-red-600'">
            <span>{{ $t('TotalAdjustments') }}</span>
            <span>{{ formatAmount(summaryData?.totalAdjustments || 0) }}</span>
          </div>

          <hr class="border-gray-300 my-1">
          <!-- Net Total -->
          <div class="flex justify-between font-medium">
            <span>{{ $t('NetTotal') }}</span>
            <span>{{ formatAmount(summaryData?.totalNetAmount || 0) }}</span>
          </div>
          <!-- Balance Due -->
          <div class="flex justify-between text-red-500 font-medium">
            <span>{{ $t('BalanceDue') }}</span>
            <span>{{ formatAmount(balanceAmount) }}</span>
          </div>
          <!-- Room Info -->
          <div class="flex justify-between text-xs text-gray-500 mt-1 pt-1 border-t border-gray-100">
            <span>{{ summaryData?.totalRooms }} {{ summaryData?.totalRooms === 1 ? $t('Room') : $t('Rooms') }} • {{ summaryData?.totalTransactions }} {{ $t('transactions') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Content Area -->
    <div class="w-10/12">
      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 p-4 border-b border-gray-200">
        <BasicButton :label="$t('updateDetails')" @click="updateDetails" />
        <BasicButton :label="$t('applyDiscount')" @click="applyDiscount" />

        <!-- More Actions Dropdown -->
        <div class="relative">
          <ButtonDropdown
            v-model="selectedMoreAction"
            :options="getMoreActionOptions()"
            :button-text="$t('more')"
            :button-class="'bg-white border border-gray-200'"
            @option-selected="handleMoreAction"
          />
        </div>

        <!-- Status Indicators -->
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
              <RefreshCcw  class="w-4 h-4" />
            </button>
            <button class="p-1 hover:bg-gray-100 rounded">
              <SettingsIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Room Charges Table -->
      <ReusableTable
        :columns="columns"
        :data="filteredRoomChargeData"
        :loading="loading"
        :show-header="true"
        :selectable="true"
        :searchable="false"
        :title="getTableTitle()"
        @selection-change="handleTableSelectionChange"
      >
        <!-- Custom Stay Column -->
        <template #column-transactionDate="{ item }">
          <div class="text-sm text-gray-900">
            <div class="font-medium">{{ formatDateRange(item.stay?.checkInDate, item.stay?.checkOutDate) }}</div>
            <div class="text-xs text-gray-500">
              {{ item.stay?.nights }} {{ item.stay?.nights === 1 ? t('night') : t('nights') }}
            </div>
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
            <div class="font-medium text-blue-600">{{ formatAmount(item.charge || 0) }}</div>
            <div class="text-xs text-gray-500">{{ item.description || '' }}</div>
          </div>
        </template>

        <!-- Custom Discount Column -->
        <template #column-discount="{ item }">
          <div class="text-sm" :class="item.discount > 0 ? 'text-red-600' : 'text-gray-500'">
            {{ item.discount > 0 ? '-' + formatAmount(item.discount) : '0.00' }}
          </div>
        </template>

        <!-- Custom Tax Column -->
        <template #column-tax="{ item }">
          <div class="text-sm text-green-600">
            {{ formatAmount(item.tax || 0) }}
          </div>
        </template>

        <!-- Custom Adjustment Column -->
        <template #column-adjustment="{ item }">
          <div class="text-sm" :class="getAmountColor(item.adjustment || 0)">
            {{ formatAmount(item.adjustment || 0) }}
          </div>
        </template>

        <!-- Custom Net Amount Column -->
        <template #column-netAmount="{ item }">
          <div class="text-sm font-bold" :class="getAmountColor(item.netAmount)">
            {{ formatAmount(item.netAmount) }}
          </div>
        </template>

        <!-- Custom Actions Column -->
        <template #column-actions="{ item }">
          <div class="flex items-center gap-1">
            <button class="p-1 hover:bg-gray-100 rounded" @click="editItem(item)">
              <PencilIcon class="w-4 h-4 text-gray-500" />
            </button>
            <button class="p-1 hover:bg-gray-100 rounded" @click="deleteItem(item)">
              <TrashIcon class="w-4 h-4 text-red-500" />
            </button>
          </div>
        </template>
      </ReusableTable>

      <!-- Footer Summary -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">
            {{ isGroupReservation ? $t('GroupTotalRoomCharges') : $t('TotalRoomCharges') }}
          </span>
          <div class="text-right">
            <div class="text-sm font-medium text-blue-600">
              {{ $t('TotalAmount') }}: {{ formatAmount(calculatedTotalAmount) }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ $t('SelectedRoom') }}: {{ formatAmount(selectedRoomTotal) }}
            </div>
          </div>
        </div>
      </div>

      <!--Modals-->
       <template v-if="isVoidReservationModalOpen">
          <VoidReservation :reservation-id="reservationId" :is-open="isVoidReservationModalOpen"
            @close="closeVoidReservationModal" :selected-items="selectedTableItems"  @void-success="handleVoidSuccess" :all-room-charges="filteredRoomChargeData" />
        </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PencilIcon, TrashIcon, RefreshCcw , SettingsIcon, ChevronRight } from 'lucide-vue-next'
import ReusableTable from '../../tables/ReusableTable.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import Accordion from '../../common/Accordion.vue'
import ButtonDropdown from '../../common/ButtonDropdown.vue'
import type { Column } from '../../../utils/models'
import { getRoomCharges } from '../../../services/reservation'
import VoidReservation from './room-charge-actions/VoidReservationModal.vue'
import { useToast } from 'vue-toastification';
import { voidReservation } from '../../../services/reservation'

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
  }
})

// Reactive Data
const loading = ref(false)
const selectedMoreAction = ref<any>(null)
const selectedRoomId = ref<number | null>(null)
const totalAmount = ref(0)
const balanceAmount = ref(0)
const roomChargeData = ref<any[]>([])
const groupRooms = ref<any[]>([])
const singleRoom = ref<any>(null)
const summaryData = ref<any>(null)
const isVoidReservationModalOpen = ref(false)
const selectedTableItems = ref<any[]>([])
const toast = useToast()

// Computed Properties
const isGroupReservation = computed(() => props.isGroup || groupRooms.value.length > 1)

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
  { key: 'actions', label: t('Actions'), type: 'custom' }
])

// More Actions Options
const getMoreActionOptions = () => {
  const baseOptions = [
    { label: t('updateDetails'), id: 'updateDetails' },
    { label: t('applyDiscount'), id: 'applyDiscount' },
    { label: t('RemoveTransaction'), id: 'removeTransaction' },
  ]

  if (isGroupReservation.value) {
    return [
      ...baseOptions,
      { label: t('groupCheckIn'), id: 'groupCheckIn' },
      { label: t('UnassignRooms'), id: 'unassignRooms' },
      { label: t('VoidGroup'), id: 'voidGroup' },
      { label: t('GroupAmendStay'), id: 'groupAmendStay' },
      { label: t('ChangeOwner'), id: 'changeOwner' },
      { label: t('SetReleaseDate'), id: 'setReleaseDate' },
      { label: t('GroupSettlement'), id: 'groupSettlement' },
      { label: t('AddBookingToGroup'), id: 'addBookingToGroup' },
      { label: t('GroupCancellation'), id: 'groupCancellation' },
    ]
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

const getAmountColor = (amount: number): string => {
  if (amount > 0) return 'text-green-600'
  if (amount < 0) return 'text-red-600'
  return 'text-gray-500'
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

// Event Handlers
const selectRoom = (roomId: number) => {
  selectedRoomId.value = selectedRoomId.value === roomId ? null : roomId
}



const handleMoreAction = (action: any) => {
  console.log('More action selected:', action)
  // Handle different actions based on action.id
  switch (action.id) {
    case 'groupCheckIn':
      // Handle group check-in
      break
    case 'unassignRooms':
      // Handle unassign rooms
      break
    case 'voidGroup':
      openVoidReservationModal()
      break
    // Add more cases as needed
  }
}

const updateDetails = () => {
  console.log('Update details clicked')
  // Implement update details functionality
}

const applyDiscount = () => {
  console.log('Apply discount clicked')
  // Implement apply discount functionality
}

const editItem = (item: any) => {
  console.log('Edit item:', item)
  // Implement edit functionality
}

const deleteItem = (item: any) => {
  console.log('Delete item:', item)
  // Implement delete functionality
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
      balanceAmount.value = response.data.summary?.totalNetAmount || 0


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
          console.log("uniqueRooms",uniqueRooms)
          selectedRoomId.value = uniqueRooms[0]?.id || null
        } else if (uniqueRooms.length === 1) {
          // Single room
          singleRoom.value = uniqueRooms[0]
          groupRooms.value = []
        }
      }
    }
  } catch (error) {
    console.error('Error loading room charges:', error)
  } finally {
    loading.value = false
  }
}

//handle Modal
const openVoidReservationModal = () => {
  if (selectedTableItems.value.length === 0) {
    toast.warning(t('toast.selectedItems'))
    return
  }
  isVoidReservationModalOpen.value = true
}

const closeVoidReservationModal = () => {
  isVoidReservationModalOpen.value = false
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



// Lifecycle
onMounted(() => {
  loadRoomCharges()
})

// Watchers
watch(() => props.reservationId, (newId) => {
  if (newId) {
    loadRoomCharges()
  }
}, { immediate: true })
</script>
