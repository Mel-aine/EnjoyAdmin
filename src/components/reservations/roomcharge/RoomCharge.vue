<template>

    <div class="flex h-[calc(100vh-160px)]  mx-4">
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50">
      <div class="h-full flex flex-col justify-between">
        <div class="bg-white h-full">
          <div class="flex justify-between pt-2 px-2 pb-2">
            <span>Room/foglo</span>
            <PlusCircle class="text-primary cursor-pointer" />
          </div>
          <div class="flex justify-between  items-center p-2 cursor-pointer hover:bg-gray-50" @click="isOpen = !isOpen"
            :class="{ 'bg-gray-200': isOpen, 'bg-primary/10': !isOpen }">
            <span>Room Details</span>
            <ChevronUp v-if="isOpen" />
            <ChevronDown v-else="isOpen" />
          </div>
          <div v-if="isOpen">
            isOpen
          </div>
        </div>
        <div class="px-4">
          <div class="flex justify-between">
            <span>{{ $t('total') }}</span>
            <span>2000xaf</span>
          </div>
          <div class="flex justify-between  text-yellow-200">
            <span>{{ $t('balence') }}</span>
            <span>2000xaf</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-10/12">
       <!-- Header with action buttons -->
    <div class="flex flex-wrap gap-2 p-4 border-b border-gray-200">
      <BasicButton :label="$t('Update details')" />
      <BasicButton :label="$t('apply discount')"/>
      
      <!-- Status indicators -->
      <div class="ml-auto flex items-center gap-2">
        <span class="flex items-center gap-1 text-sm">
          <div class="w-3 h-3 bg-blue-400 rounded"></div>
          {{ $t('Active') }}
        </span>
        <span class="flex items-center gap-1 text-sm">
          <div class="w-3 h-3 bg-gray-400 rounded"></div>
          {{ $t('Inactive') }}
        </span>
        <div class="flex gap-1">
          <button class="p-1 hover:bg-gray-100 rounded">
            <RefreshIcon class="w-4 h-4" />
          </button>
          <button class="p-1 hover:bg-gray-100 rounded">
            <SettingsIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <ReusableTable
      :columns="columns"
      :data="roomChargeData"
      :loading="loading"
      :show-header="false"
      :selectable="true"
      :searchable="false"
      title=""
    >
      <!-- Custom column templates -->
      <template #column-date="{ item }">
        <div class="text-sm text-gray-900">
          {{ formatDate(item.date) }}
        </div>
      </template>
      
      <template #column-amount="{ item }">
        <div class="text-sm font-medium" :class="getAmountColor(item.amount)">
          {{ formatAmount(item.amount) }}
        </div>
      </template>
      
      <template #column-status="{ item }">
        <div class="text-xs px-2 py-1 rounded-full" :class="getStatusColor(item.status)">
          {{ $t(item.status) }}
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

const { t } = useI18n()
const isOpen = ref(false)

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
const totalAmount = ref(9600.00)

// Sample room charge data
const roomChargeData = ref<RoomChargeItem[]>([
  {
    id: 1,
    date: '13/08/2022',
    roomNumber: 'STE-201',
    rateType: 'Continental Plan (CP)',
    description: 'Room Charge - Standard Rate',
    amount: 2400.00,
    status: 'active',
    nights: 1
  },
  {
    id: 2,
    date: '14/08/2022',
    roomNumber: 'STE-201',
    rateType: 'Continental Plan (CP)',
    description: 'Room Charge - Standard Rate',
    amount: 2400.00,
    status: 'active',
    nights: 1
  },
  {
    id: 3,
    date: '15/08/2022',
    roomNumber: 'STE-201',
    rateType: 'Continental Plan (CP)',
    description: 'Room Charge - Standard Rate',
    amount: 2400.00,
    status: 'active',
    nights: 1
  },
  {
    id: 4,
    date: '16/08/2022',
    roomNumber: 'STE-201',
    rateType: 'Continental Plan (CP)',
    description: 'Room Charge - Standard Rate',
    amount: 2400.00,
    status: 'active',
    nights: 1
  }
])

// Table columns configuration
const columns = computed<Column[]>(() => [
  { key: 'date', label: t('Date'), type: 'custom' },
  { key: 'roomNumber', label: t('Room'), type: 'text' },
  { key: 'rateType', label: t('Rate Type'), type: 'text' },
  { key: 'description', label: t('Description'), type: 'text' },
  { key: 'nights', label: t('Nights'), type: 'text' },
  { key: 'amount', label: t('Amount'), type: 'custom' },
  { key: 'status', label: t('Status'), type: 'custom' },
  { key: 'actions', label: t('Actions'), type: 'custom' }
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
</script>