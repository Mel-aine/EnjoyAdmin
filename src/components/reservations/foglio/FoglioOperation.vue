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
      <div class="bg-white border-t-1 shadow-sm">
        <!-- Header with action buttons -->
        <div class="flex flex-wrap gap-2 p-4 border-b border-gray-200">
          <BasicButton :label="$t('Add Payment')" @click="openAddPaymentModal" />
          <BasicButton :label="$t('Add Charges')" @click="openAddChargeModal" />
          <BasicButton :label="$t('Apply Discount')" />
          <BasicButton :label="$t('Folio Operations')" />
          <BasicButton :label="$t('Print Invoice')" />
          <BasicButton :label="$t('More')" />
          <!-- Status indicators -->
          <div class="ml-auto flex items-center gap-2">
            <span class="flex items-center gap-1 text-sm">
              <div class="w-3 h-3 bg-orange-400 rounded"></div>
              {{ $t('Unposted') }}
            </span>
            <span class="flex items-center gap-1 text-sm">
              <div class="w-3 h-3 bg-gray-600 rounded"></div>
              {{ $t('Posted') }}
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
        <ReusableTable :columns="columns" :data="foglioData" :loading="loading" :show-header="false" :selectable="false"
          :searchable="false">
          <!-- Custom column templates -->
          <template #column-day="{ item }">
            <div class="text-sm text-gray-900">
              {{ formatDate(item.day) }}
            </div>
          </template>

          <template #column-amount="{ item }">
            <div class="text-sm font-medium" :class="getAmountColor(item.amount)">
              {{ formatAmount(item.amount) }}
            </div>
          </template>

          <template #column-user="{ item }">
            <div class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
              {{ item.user }}
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
            <span class="text-sm text-gray-600">{{ $t('End Of Data') }}</span>
            <div class="text-right">
              <div class="text-sm font-medium text-red-600">
                {{ $t('Balance') }}: {{ formatAmount(balance) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Add Charge Modal -->
        <AddChargeModal :is-open="isAddChargeModalOpen" @close="closeAddChargeModal" @save="handleSaveCharge" />

        <!-- Add Payment Modal -->
        <AddPaymentModal :is-open="isAddPaymentModalOpen" @close="closeAddPaymentModal" @save="handleSavePayment" />
      </div>
    </div>
  </div>





</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AddChargeModal from './AddChargeModal.vue'
import AddPaymentModal from './AddPaymentModal.vue'
import { PencilIcon, TrashIcon, RefreshCwIcon, SettingsIcon, ChevronDown, ChevronUp } from 'lucide-vue-next'
import ReusableTable from '../../tables/ReusableTable.vue'
import BasicButton from '../../buttons/BasicButton.vue'

const { t } = useI18n()
const isOpen= ref(false)
// Modal state
const isAddChargeModalOpen = ref(false)
const isAddPaymentModalOpen = ref(false)

interface FoglioItem {
  id: number
  day: string
  refNo: string
  particulars: string
  description: string
  user: string
  amount: number
  status: 'unposted' | 'posted'
}

const loading = ref(false)
const balance = ref(2000.00)

// Sample data based on the image
const foglioData = ref<FoglioItem[]>([
  {
    id: 1,
    day: '13/08/2022 Saturday',
    refNo: '',
    particulars: 'Room Charges',
    description: '',
    user: 'helpdesksupport',
    amount: 2400.00,
    status: 'unposted'
  },
  {
    id: 2,
    day: '14/08/2022 Sunday',
    refNo: '',
    particulars: 'Room Charges',
    description: '',
    user: 'helpdesksupport',
    amount: 2400.00,
    status: 'unposted'
  },
  {
    id: 3,
    day: '15/08/2022 Monday',
    refNo: '',
    particulars: 'Room Charges',
    description: '',
    user: 'helpdesksupport',
    amount: 2400.00,
    status: 'unposted'
  },
  {
    id: 4,
    day: '16/08/2022 Tuesday',
    refNo: '',
    particulars: 'Room Charges',
    description: '',
    user: 'helpdesksupport',
    amount: 2400.00,
    status: 'unposted'
  }
])

// Table columns configuration
const columns = computed(() => [
  { key: 'day', label: t('Day'), type: 'custom' },
  { key: 'refNo', label: t('Ref No.'), type: 'text' },
  { key: 'particulars', label: t('Particulars'), type: 'text' },
  { key: 'description', label: t('Description'), type: 'text' },
  { key: 'user', label: t('User'), type: 'custom' },
  { key: 'amount', label: t('Amount'), type: 'custom' },
  { key: 'actions', label: '', type: 'custom' }
])

// Helper functions
const formatDate = (dateStr: string) => {
  return dateStr
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2)
}

const getAmountColor = (amount: number) => {
  return amount >= 0 ? 'text-blue-600' : 'text-red-600'
}

const editItem = (item: FoglioItem) => {
  console.log('Edit item:', item)
  // Add edit logic here
}

const deleteItem = (item: FoglioItem) => {
  console.log('Delete item:', item)
  // Add delete logic here
}

// Modal handlers
const openAddChargeModal = () => {
  isAddChargeModalOpen.value = true
}

const closeAddChargeModal = () => {
  isAddChargeModalOpen.value = false
}

const handleSaveCharge = (chargeData: any) => {
  console.log('Saving charge:', chargeData)
  // Here you would typically send the data to your API
  // For now, we'll just add it to our local data
  const newCharge = {
    id: foglioData.value.length + 1,
    day: chargeData.date,
    refNo: chargeData.recVouNumber || `REF${Date.now()}`,
    particulars: chargeData.charge,
    description: chargeData.comment || chargeData.charge,
    user: 'current_user',
    amount: parseFloat(chargeData.amount) || 0,
    status: 'unposted' as const
  }

  foglioData.value.push(newCharge)
  closeAddChargeModal()
}

// Payment modal handlers
const openAddPaymentModal = () => {
  isAddPaymentModalOpen.value = true
}

const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
}

const handleSavePayment = (paymentData: any) => {
  console.log('Saving payment:', paymentData)
  // Here you would typically send the data to your API
  // For now, we'll just add it to our local data
  const newPayment = {
    id: foglioData.value.length + 1,
    day: paymentData.date,
    refNo: paymentData.recVouNumber || `PAY${Date.now()}`,
    particulars: `${paymentData.type} Payment - ${paymentData.method}`,
    description: paymentData.comment || `Payment via ${paymentData.method}`,
    user: 'current_user',
    amount: -parseFloat(paymentData.amount) || 0, // Negative for payments
    status: 'unposted' as const
  }

  foglioData.value.push(newPayment)
  closeAddPaymentModal()
}
</script>