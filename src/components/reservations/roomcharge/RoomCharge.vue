<template>

  <div class="bg-white rounded-lg shadow-md  mx-4 mt-4">
    <div class="w-full">


      <!-- Table -->
      <ReusableTable :columns="columns" :data="roomChargeData" :loading="loading" :show-header="true" :selectable="true"
        :searchable="false" :title="$t('Room Charges')">
        <!-- Custom column templates -->
        <template #column-date="{ item }">
          <div class="text-sm text-gray-900">
            {{ formatDate(item.date) }}
          </div>
        </template>
        <template #header-actions>
          <!-- Header with action buttons -->
          <div class="flex flex-wrap justify-end gap-2 pb-2  border-b border-gray-200">
            <BasicButton :label="$t('Update details')" />
            <BasicButton :label="$t('applyDiscount')" />
          </div>
        </template>

        <template #column-amount="{ item }">
          <div class="text-sm font-medium" :class="getAmountColor(item.amount)">
            {{ formatAmount(item.amount) }}
          </div>
        </template>

        <template #column-status="{ item }">
          <div class="text-xs px-2 py-1 rounded-full" :class="getStatusColor(item.status)">
            {{ $t(item.status??'') }}
          </div>
        </template>

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

      <!-- Footer summary -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">{{ $t('Total Room Charges') }}</span>
          <div class="text-right">
            <div class="text-sm font-medium text-blue-600">
              {{ $t('Total Amount') }}: {{ formatAmount(totalAmount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PencilIcon, TrashIcon, RefreshCwIcon, SettingsIcon, ChevronUp, ChevronDown } from 'lucide-vue-next'
import ReusableTable from '../../tables/ReusableTable.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import type { Column } from '../../../utils/models'
import { getRoomCharges } from '../../../services/reservation'

const { t } = useI18n()
const isOpen = ref(false)
const props = defineProps({
  reservationId: {
    type: Number,
    required: true
  }
})
// Modal state
const isAddRoomChargeModalOpen = ref(false)
const isApplyRateModalOpen = ref(false)

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

const loading = ref(false)
const totalAmount = ref(0)

// Sample room charge data
const roomChargeData = ref<RoomChargeItem[]>([
  
])

// Table columns configuration
const columns = computed<Column[]>(() => [
  { key: 'transactionDate', label: t('stay'), type: 'custom' },
  { key: 'room.roomNumber', label: t('Room'), type: 'text' },
  { key: 'rateType.ratePlanName', label: t('Rate Type'), type: 'text' },
  { key: 'pax', label: t('Pax(A/C)'), type: 'text' },
  { key: 'rateType.rateAmount', label: t('Charge'), type: 'text' },
  { key: 'discount', label: t('discount'), type: 'custom' },
  { key: 'tax', label: t('tax'), type: 'custom' },
  { key: 'adjustment', label: t('Adjustement'), type: 'custom' },
  { key: 'netAmount', label: t('net_amount'), type: 'text' }
])

// Utility functions
const formatDate = (dateString: string) => {
  return dateString
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 2
  }).format(amount).replace('XAF', 'XAF')
}

const getAmountColor = (amount: number) => {
  return amount >= 0 ? 'text-green-600' : 'text-red-600'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Action handlers
const editItem = (item: RoomChargeItem) => {
  console.log('Edit item:', item)
  // Add edit logic here
}

const deleteItem = (item: RoomChargeItem) => {
  console.log('Delete item:', item)
  // Add delete logic here
}

// Modal handlers
const openAddRoomChargeModal = () => {
  isAddRoomChargeModalOpen.value = true
}

const closeAddRoomChargeModal = () => {
  isAddRoomChargeModalOpen.value = false
}

const handleSaveRoomCharge = (chargeData: any) => {
  console.log('Saving room charge:', chargeData)
  const newCharge = {
    id: roomChargeData.value.length + 1,
    date: chargeData.date,
    roomNumber: chargeData.roomNumber || 'STE-201',
    rateType: chargeData.rateType || 'Continental Plan (CP)',
    description: chargeData.description || 'Room Charge',
    amount: parseFloat(chargeData.amount) || 0,
    status: 'active' as const,
    nights: parseInt(chargeData.nights) || 1
  }

  roomChargeData.value.push(newCharge)
  closeAddRoomChargeModal()
}

// Apply Rate modal handlers
const openApplyRateModal = () => {
  isApplyRateModalOpen.value = true
}

const closeApplyRateModal = () => {
  isApplyRateModalOpen.value = false
}

const handleApplyRate = (rateData: any) => {
  console.log('Applying rate:', rateData)
  // Here you would typically update room charges with new rates
  closeApplyRateModal()
}
const getTransactionFolio =async()=>{
  loading.value = true;
  const response  = await getRoomCharges(props.reservationId);
  console.log(response.data);
  if(response.data){
    roomChargeData.value = response.data.roomChargesTable;
    totalAmount.value = response.data.summary?.totalNetAmount;
  }
  loading.value = false;
}
getTransactionFolio();
</script>