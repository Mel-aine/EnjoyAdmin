<template>
  <div class="flex h-[calc(100vh-250px)]  mx-4 mt-2 shadow-lg">
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50">
      <div class="h-full flex flex-col justify-between">
        <div class="bg-white h-full">
          <div class="flex justify-between pt-2 px-2 pb-2">
            <span>Room/Folios</span>
            <PlusCircle class="text-primary cursor-pointer" @click="openCreateFolioModal" />
          </div>
          <!-- Show All Transactions Button -->
          <div class="px-2 pb-2">
            <button 
              class="w-full text-sm px-2 py-2 rounded cursor-pointer transition-colors"
              :class="!selectedFolio ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
              @click="showAllTransactions">
              {{ $t('Show All Transactions') }}
            </button>
          </div>
          <Accordion v-for="(re, ind) in reservation.reservationRooms" :key="ind" :title="re.room.roomNumber">
            <div v-for="(fo, index) in folioList" :key="index">
              <div class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 my-1" 
                   :class="selectedFolio?.id === fo.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-100'"
                   @click="selectFolio(fo)">
                <span class="capitalize">{{ fo.folioName }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </Accordion>
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
      <div class="bg-white border-t-1 shadow-sm flex flex-col h-full justify-between">
        <div>
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
          <div class="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-700">
                {{ selectedFolio ? `${$t('Transactions for')}: ${selectedFolio.folioName}` : $t('All Transactions') }}
              </h3>
              <span class="text-xs text-gray-500">
                {{ $t('Total') }}: {{ foglioData.length }} {{ $t('transactions') }}
              </span>
            </div>
          </div>
          <ReusableTable :columns="columns" :data="foglioData" :loading="loading" :show-header="false"
            :selectable="false" :searchable="false" :title="$t('Foglio')">
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
        </div>
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
        <template v-if="isAddChargeModalOpen">
          <AddChargeModal :is-open="isAddChargeModalOpen" @close="closeAddChargeModal" @save="handleSaveCharge" />
        </template>

        <!-- Add Payment Modal -->
        <template v-if="isAddPaymentModalOpen">
          <AddPaymentModal :reservation-id="reservationId" :is-open="isAddPaymentModalOpen"
            @close="closeAddPaymentModal" @save="handleSavePayment" />
        </template>
        <!-- Create Folio Modal -->
        <template v-if="isCreateFolioModalOpen">
          <CreateFolioModal :reservation-id="reservationId" :is-open="isCreateFolioModalOpen"
            @close="closeCreateFolioModal" @save="handleSaveFolio" :reservation="reservation" />

        </template>
      </div>
    </div>
  </div>





</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AddChargeModal from './AddChargeModal.vue'
import AddPaymentModal from './AddPaymentModal.vue'
import CreateFolioModal from './CreateFolioModal.vue'
import { PencilIcon, TrashIcon, RefreshCwIcon, SettingsIcon, ChevronDown, ChevronUp, PlusCircle, ChevronRight } from 'lucide-vue-next'
import ReusableTable from '../../tables/ReusableTable.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import type { Column } from '../../../utils/models'
import { getReservationFolios } from '../../../services/foglioApi'
import Accordion from '../../common/Accordion.vue'
const { t } = useI18n()
const isOpen = ref(false)
// Modal state
const isAddChargeModalOpen = ref(false)
const isAddPaymentModalOpen = ref(false)
const isCreateFolioModalOpen = ref(false)
const props = defineProps({
  reservationId: {
    type: Number,
    required: true
  },
  reservation: {
    type: Object,
    default: () => ({})
  }
})
interface FoglioItem {
  id: number
  day: string
  refNo: string
  particulars: string
  description: string
  user: string
  amount: number
  status: 'unposted' | 'posted'
  folioId?: number // Add folioId to link transactions to folios
}

const loading = ref(false)
const balance = ref(2000.00)
const selectedFolio = ref<any>(null)
const allTransactions = ref<FoglioItem[]>([])
const folioList = ref<any[]>([])

// Computed property to filter transactions based on selected folio
const foglioData = computed(() => {
  if (!selectedFolio.value) {
    return allTransactions.value // Show all transactions when no folio is selected
  }
  return allTransactions.value.filter(transaction => 
    transaction.folioId === selectedFolio.value.id
  )
})

// Table columns configuration
const columns = computed<Column[]>(() => [
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
  return amount
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
    id: allTransactions.value.length + 1,
    day: chargeData.date,
    refNo: chargeData.recVouNumber || `REF${Date.now()}`,
    particulars: chargeData.charge,
    description: chargeData.comment || chargeData.charge,
    user: 'current_user',
    amount: parseFloat(chargeData.amount) || 0,
    status: 'unposted' as const,
    folioId: selectedFolio.value?.id || folioList.value[0]?.id // Assign to selected folio or first folio
  }

  allTransactions.value.push(newCharge)
  closeAddChargeModal()
}

// Payment modal handlers
const openAddPaymentModal = () => {
  isAddPaymentModalOpen.value = true
}

const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
}
// Function to select a folio
const selectFolio = (folio: any) => {
  selectedFolio.value = selectedFolio.value?.id === folio.id ? null : folio
}

// Function to show all transactions (clear selection)
const showAllTransactions = () => {
  selectedFolio.value = null
}

const getFolosReservations = async () => {
  loading.value = true
  try {
    const resp = await getReservationFolios(props.reservationId)
    console.log(resp)
    
    // Handle the case where folios contain their transactions
    if (resp.data && Array.isArray(resp.data)) {
      folioList.value = resp.data
      
      // Extract all transactions from all folios
      allTransactions.value = []
      resp.data.forEach((folio: any) => {
        if (folio.transactions && Array.isArray(folio.transactions)) {
          // Add folioId to each transaction and add to allTransactions
          folio.transactions.forEach((transaction: any) => {
            allTransactions.value.push({
              ...transaction,
              folioId: folio.id
            })
          })
        }
      })
    } else if (resp.data.folios) {
      // Alternative structure where folios and transactions are separate
      folioList.value = resp.data.folios
      allTransactions.value = resp.data.transactions || []
    } else {
      // Fallback: treat response as direct folio array
      folioList.value = resp.data || []
      allTransactions.value = []
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
getFolosReservations()
const handleSavePayment = (paymentData: any) => {
  console.log('Saving payment:', paymentData)
  // Here you would typically send the data to your API
  // For now, we'll just add it to our local data
  const newPayment = {
    id: allTransactions.value.length + 1,
    day: paymentData.date,
    refNo: paymentData.recVouNumber || `PAY${Date.now()}`,
    particulars: `${paymentData.type} Payment - ${paymentData.method}`,
    description: paymentData.comment || `Payment via ${paymentData.method}`,
    user: 'current_user',
    amount: -parseFloat(paymentData.amount) || 0, // Negative for payments
    status: 'unposted' as const,
    folioId: selectedFolio.value?.id || folioList.value[0]?.id // Assign to selected folio or first folio
  }

  allTransactions.value.push(newPayment)
  closeAddPaymentModal()
}

// Create Folio modal handlers
const openCreateFolioModal = () => {
  isCreateFolioModalOpen.value = true
}

const closeCreateFolioModal = () => {
  isCreateFolioModalOpen.value = false
}

const handleSaveFolio = (folioData: any) => {
  console.log('Saving folio:', folioData)
  // Here you would typically update the UI or refresh the folio list
  getFolosReservations() // Refresh the folio list
  closeCreateFolioModal()
}
</script>