<template>
  <div class="flex h-[calc(100vh-250px)]  mx-4 mt-2 shadow-lg dark:bg-gray-900 dark:text-gray-100"
    :class="{ 'void-status': reservation.status === 'voided' }">
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div class="h-full flex flex-col">
        <div class="bg-white dark:bg-gray-800 dark:text-gray-100 flex-grow overflow-y-auto">
          <div class="flex justify-between pt-2 px-2 pb-2">
            <span>{{ $t('roomFolios') }}</span>
            <PlusCircle class="text-primary cursor-pointer" @click="openCreateFolioModal" v-if="canCreateFolio" />
            <PlusCircle v-else class="text-gray-200 cursor-not-allowed" />

          </div>
          <!-- Show All Transactions Button -->
          <div class="px-2 pb-2">
            <button class="w-full text-sm px-2 py-2 rounded cursor-pointer transition-colors"
              :class="!selectedFolio
                ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'" @click="showAllTransactions">
              {{ $t('showAllTransactions') }}
            </button>
          </div>
          <div v-for="(re, ind) in reservation.reservationRooms" :key="ind" :title="re.room?.roomNumber">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2 px-2">♦ {{ re.room?.roomNumber }}</div>
            <div v-for="(fo, index) in folioList" :key="index">
              <div
                class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 my-1"
                :class="selectedFolio?.id === fo.id
                  ? 'bg-blue-100 border-l-4 border-blue-500 dark:bg-blue-900 dark:border-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800'" @click="selectFolio(fo)">
                <span class="capitalize">#{{ fo.folioNumber }} {{ fo.guest.displayName }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 gap-1 py-2 text-sm flex flex-col">
          <div class="flex justify-between text-blue-600">
            <span>{{ $t('total') }}</span>
            <span>{{ formatCurrency(reservation.balanceSummary.totalChargesWithTaxes) }}</span>
          </div>
          <div class="flex justify-between text-green-600">
            <span>{{ $t('paid') }}</span>
            <span>{{ formatCurrency(reservation.balanceSummary.totalPayments) }}</span>
          </div>
          <div class="flex justify-between text-red-600">
            <span>{{ $t('Balance') }}</span>
            <span>{{ formatCurrency(reservation.balanceSummary.outstandingBalance) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-10/12">
      <div
        class="bg-white dark:bg-gray-800 dark:text-gray-100 border-t-1 dark:border-gray-700 shadow-sm flex flex-col h-full">
        <div class="flex-grow">
          <!-- Header with action buttons -->
          <div class="flex flex-wrap gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <BasicButton :label="$t('AddPayment')" @click="openAddPaymentModal"
              :disabled="!canAddItemInFolio || reservation.status === 'voided'" />
            <BasicButton :label="$t('addCharges')" @click="openAddChargeModal"
              :disabled="!canAddItemInFolio || reservation.status === 'voided'" />
            <BasicButton :label="$t('applyDiscount')" @click="openApplyDiscountModal"
              :disabled="!canAddItemInFolio || reservation.status === 'voided' || !selectedFolio" />
            <!-- <BasicButton :label="$t('folioOperations')" />-->
            <BasicButton :label="$t('printInvoice')" @click="printInvoiceDirect"
              :disabled="!canAddItemInFolio || reservation.status === 'voided' || !selectedFolio" />
            <!-- More Actions Dropdown -->
            <div class="relative" v-if="(canAddItemInFolio || reservation.status !== 'voided') && selectedFolio">
              <ButtonDropdown v-model="selectedMoreAction" :options="moreActionOptions" :button-text="$t('more')"
                :button-class="'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'"
                @option-selected="handleMoreAction" />

            </div>
            <!-- Status indicators
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
                <button class="p-1 hover:bg-gray-100 rounded">
                  <RefreshIcon class="w-4 h-4" />
                </button>
                <button class="p-1 hover:bg-gray-100 rounded">
                  <SettingsIcon class="w-4 h-4" />
                </button>
              </div>
            </div>-->
          </div>

          <!-- Table -->
          <div class="px-4 py-2 bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ selectedFolio ? `${$t('transactionsFor')}: ${selectedFolio.folioName}` : $t('allTransactions') }}
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ $t('total') }}: {{ foglioData.length }} {{ $t('transactions') }}
              </span>
            </div>
          </div>
          <ReusableTable :columns="columns" :data="foglioData" :loading="loading" :show-header="false"
            :actions="actionTransactions" :selectable="false" :searchable="false" :title="$t('folio')"
            max-height="calc(100vh - 420px)" :scrollableBody="true">
            <!-- Custom column templates -->
            <template #column-day="{ item }">
              <div class="text-sm text-gray-900 dark:text-gray-100">
                {{ formatDate(item.day) }}
              </div>
            </template>

            <template #column-amount="{ item }">
              <div class="text-sm font-medium" :class="getAmountColor(item.totalAmount)">
                {{ formatAmount(item.totalAmount) }}
              </div>
            </template>

            <template #column-user="{ item }">
              <div
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                {{ item.user }}
              </div>
            </template>


          </ReusableTable>
        </div>
        <!-- Footer summary -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('endOfData') }}</span>
            <div class="text-right">
              <div class="text-sm font-medium text-red-600 dark:text-red-400">
                {{ $t('balance') }}: {{ formatCurrency(reservation.balanceSummary.outstandingBalance) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Add Charge Modal -->
        <template v-if="isAddChargeModalOpen">
          <AddChargeModal :reservation-id="reservationId" :is-open="isAddChargeModalOpen" :folio-id="selectedFolio?.id"
            @close="closeAddChargeModal" @refresh="refreshFolio" :isEditMode="isEditMode"
            :transactionData="transactionToEdit" />
        </template>

        <!-- Add Payment Modal -->
        <template v-if="isAddPaymentModalOpen">
          <AddPaymentModal :reservation-id="reservationId" :is-open="isAddPaymentModalOpen"
            :folio-id="selectedFolio?.id" @close="closeAddPaymentModal" @save="handleSavePayment"
            :isEditMode="isEditMode" :transactionData="transactionToEdit" />
        </template>
        <!-- Create Folio Modal -->
        <template v-if="isCreateFolioModalOpen">
          <CreateFolioModal :reservation-id="reservationId" :is-open="isCreateFolioModalOpen"
            @close="closeCreateFolioModal" @save="handleSaveFolio" :reservation="reservation" />
        </template>
        <template v-if="isSplitFolioModal">
          <SplitFolioModal :reservation-id="reservationId" :is-open="isSplitFolioModal" :default-folio="selectedFolio"
            @close="closeSplitFolioModal" @save="handleSaveSplitFolio" @refresh="refreshFolio" />
        </template>
        <template v-if="isCutFolioModal">
          <CutFolioModal :reservation-id="reservationId" :folio-id="selectedFolio?.id" :is-open="isCutFolioModal"
            @close="closeCutFolioModal" @save="handleSaveCut" @refresh="refreshFolio" />
        </template>
        <template v-if="isRoomChargesModal">
          <RoomChargeModal :reservation-id="reservationId" :folio-id="selectedFolio?.id" :is-open="isRoomChargesModal"
            @close="closeRoomChargesModal" @save="handleSaveRoomCharges" @refresh="refreshFolio"
            :isEditMode="isEditMode" :transactionData="transactionToEdit" />
        </template>
        <template v-if="isAdjustmentModal">
          <AdjustmentFolioModal :reservation-id="reservationId" :folio-id="selectedFolio?.id"
            :is-open="isAdjustmentModal" @close="closeAdjustmentModal" @save="handleSaveAdjustment"
            @refresh="refreshFolio" :isEditMode="isEditMode" :transactionData="transactionToEdit" />
        </template>
        <!-- Print Modal -->
        <template v-if="isPrintModalOpen">
          <PrintInvoice :is-open="isPrintModalOpen" :document-data="printDocumentData" @close="closePrintModal"
            @print-error="handlePrintError" :reservation-id="reservationId" :folio-id="selectedFolio?.id" />
        </template>
        <!-- Direct PDF Preview (same viewer as PrintInvoice) -->
        <div v-if="showPdfExporter">
          <PdfExporterNode @close="showPdfExporter = false" :is-modal-open="showPdfExporter" :title="$t(documentTitle)"
            :is-generating="printLoading" :pdf-url="pdfurl" :pdf-theme="pdfTheme" @pdf-generated="handlePdfGenerated"
            @error="handlePdfError" />
        </div>
        <!-- Apply Discount Modal -->
        <template v-if="isApplyDiscountModal">
          <ApplyDiscountModal :is-open="isApplyDiscountModal" :reservation-id="reservationId"
            :folio-id="selectedFolio?.id" :isEditMode="isEditMode" :transactionData="transactionToEdit"
            :reservation-number="reservation?.reservationNumber" @close="closeApplyDiscountModal"
            @discount-applied="handleDiscountApplied" />
        </template>
        <template v-if="isVoidTrasaction">
          <VoidTransactionModal :is-open="isVoidTrasaction" :transaction-details="selectedTransaction"
            @close="closeVoidTransactionModal" @success="refreshFolio" />
        </template>
        <!-- Transfer: select destination folio -->
        <template v-if="isTransfertFolioModalOpen">
          <TransfertFolioModal :is-open="isTransfertFolioModalOpen" @close="closeTransfertFolioModal"
            @select="onDestinationFolioSelected" />
        </template>
        <!-- Transfer Posting -->
        <template v-if="isTransfertPostingModalOpen">
          <TransfertPostingModal :is-open="isTransfertPostingModalOpen" :source-folio="selectedFolio"
            :destination-folio="selectedDestinationFolio" @close="closeTransfertPostingModal"
            @success="onTransferSuccess" />
        </template>

        <template v-if="isPickupAndDropoffModal">
          <PickupAndDropModal :isOpen="isPickupAndDropoffModal"  @close="isPickupAndDropoffModal = false"/>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AddChargeModal from './AddChargeModal.vue'
const AddPaymentModal = defineAsyncComponent(() => import('./AddPaymentModal.vue'))
import CreateFolioModal from './CreateFolioModal.vue'
import { PlusCircle, ChevronRight, Edit, Printer, Trash2 } from 'lucide-vue-next'
import ReusableTable from '../../tables/ReusableTable.vue'
import BasicButton from '../../buttons/BasicButton.vue'
import type { Action, Column } from '../../../utils/models'
import { getReservationFolios } from '../../../services/foglioApi'
import { formatCurrency } from '../../utilities/UtilitiesFunction'
import PrintInvoice from '../../invoice/PrintInvoice.vue'
import ButtonDropdown from '../../common/ButtonDropdown.vue'
import PdfExporterNode from '../../common/PdfExporterNode.vue'
import { printFolioPdf } from '@/services/foglioApi'
import SplitFolioModal from './SplitFolioModal.vue'
import CutFolioModal from './CutFolioModal.vue'
import RoomChargeModal from './RoomChargeModal.vue'
import AdjustmentFolioModal from './AdjustmentFolioModal.vue'
import { useAuthStore } from '@/composables/user'
import VoidTransactionModal from '../../modals/VoidTransactionModal.vue'
import { generateInvoicePdfUrl, generatePosReceiptPdfUrl, generateReceiptPdfUrl } from '../../../services/reportsApi'
import ApplyDiscountModal from './ApplyDiscountModal.vue'
import TransfertFolioModal from './TransfertFolioModal.vue'
import TransfertPostingModal from './TransfertPostingModal.vue'
import PickupAndDropModal from '@/components/customers/PickupAndDropModal.vue'

const authStore = useAuthStore()

const canCreateFolio = computed(() => {
  return authStore.hasPermission('creating_new_folio')
})
const canAddItemInFolio = computed(() => {
  return authStore.hasPermission('add_item_to_open_folio')
})
const { t } = useI18n()
// Modal state
const isAddChargeModalOpen = ref(false)
const isAddPaymentModalOpen = ref(false)
const isCreateFolioModalOpen = ref(false)
const isPrintModalOpen = ref(false)
const showPdfExporter = ref(false)
const printLoading = ref(false)
const pdfurl = ref<string>('')
const pdfTheme = ref<Record<string, any>>({})
const selectedMoreAction = ref<any>(null)
const isVoidTrasaction = ref(false);
const documentTitle = ref('');
/// manage more action folio

const isAdjustmentModal = ref(false);
const isRoomChargesModal = ref(false);
const isTransferModal = ref(false);
const isSplitFolioModal = ref(false);
const isCutFolioModal = ref(false);
const isSendFolioModal = ref(false);
const isApplyDiscountModal = ref(false);
const isPickupAndDropoffModal = ref(false)
const selectedTransaction = ref<any>(null)
// Transfer flow state
const isTransfertFolioModalOpen = ref(false)
const isTransfertPostingModalOpen = ref(false)
const selectedDestinationFolio = ref<any>(null)

const closeSplitFolioModal = () => {
  isSplitFolioModal.value = false
}
const handleSaveSplitFolio = (folioData: any) => {
  console.log('Save split folio:', folioData)
  // Add save logic here
}
const emit = defineEmits(['refresh'])
const closeTransferModal = () => {
  isTransferModal.value = false
}
const handleSaveTransfer = (transferData: any) => {
  console.log('Save transfer:', transferData)
  // Add save logic here
}
const closeCutFolioModal = () => {
  isCutFolioModal.value = false
}
const handleSaveCut = (cutData: any) => {
  console.log('Save cut:', cutData)
  // Add save logic here
}
const closeRoomChargesModal = () => {
  isRoomChargesModal.value = false
  isEditMode.value = false
  transactionToEdit.value = null
}
const handleSaveRoomCharges = (roomChargesData: any) => {
  console.log('Save room charges:', roomChargesData)
  // Add save logic here
}
const closeVoidTransactionModal = () => {
  isVoidTrasaction.value = false;
  selectedTransaction.value = null;
}
const closeApplyDiscountModal = () => {
  isApplyDiscountModal.value = false
  selectedTransaction.value = null;
}
const openApplyDiscountModal = () => {
  isApplyDiscountModal.value = true
  isEditMode.value = false
}
const handleDiscountApplied = (discountData: any) => {
  console.log('Discount applied:', discountData)
  // Add discount application logic here
  // Refresh folio data after applying discount
  refreshFolio()
}
const closeAdjustmentModal = () => {
  isAdjustmentModal.value = false
  isEditMode.value = false
  transactionToEdit.value = null
}
const handleSaveAdjustment = (adjustmentData: any) => {
  console.log('Save adjustment:', adjustmentData)
  // Add save logic here
}
const closeSendFolioModal = () => {
  isSendFolioModal.value = false
}
const handleSaveSendFolio = (sendFolioData: any) => {
  console.log('Save send folio:', sendFolioData)
  // Add save logic here
}


// More actions dropdown options
const moreActionOptions = computed(() => {
  const menus = [

  ]
  if (authStore.hasPermission('add_item_to_open_folio')) {
    menus.push({ label: t('adjustment'), id: 'adjustment' })
  }
  if (props.reservation.status === 'checked_in' && authStore.hasPermission('change_room_rate_after_check_in')) {
    menus.push({ label: t('roomCharges'), id: 'roomCharges' })
  } else if (authStore.hasPermission('change_room_rate_before_check_in')) {
    menus.push({ label: t('roomCharges'), id: 'roomCharges' })
  }
   if (authStore.hasPermission('transfer_item_from_folio')) {
    menus.push({ label: t('split_folio'), id: 'split' })
  }
  if (authStore.hasPermission('transfer_item_from_folio')) {
    menus.push({ label: t('transfer'), id: 'transfer' })
  }
  if (authStore.hasPermission('cut_folio')) {
    menus.push({ label: t('cutFolio'), id: 'cut' })
  }
  if (authStore.hasPermission('send_folio')) {
    menus.push({ label: t('sendFolio'), id: 'send' })
  }
  return menus
})
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
  postingDate?: string
  transactionDate?:string
  folioId?: number // Add folioId to link transactions to folios
}

const loading = ref(false)
const balance = ref(0)
const selectedFolio = ref<any>(null)
const allTransactions = ref<FoglioItem[]>([])
const folioList = ref<any[]>([])
const isEditMode = ref(false)
const transactionToEdit = ref<any>(null)

// Computed property to filter transactions based on selected folio
// and order by postingDate ascending
const foglioData = computed(() => {
  const list = !selectedFolio.value
    ? allTransactions.value // Show all transactions when no folio is selected
    : allTransactions.value.filter(transaction => transaction.folioId === selectedFolio.value.id)

  // Return a sorted copy by postingDate ASC
  return [...list].sort((a, b) => {
    const at = a.transactionDate ? new Date(a.transactionDate).getTime() : 0
    const bt = b.transactionDate ? new Date(b.transactionDate).getTime() : 0
    return at - bt
  })
})

// Table columns configuration
const columns = computed<Column[]>(() => [
  { key: 'transactionDate', label: t('Day'), type: 'date' },
  { key: 'transactionNumber', label: t('Ref No.'), type: 'text' },
  { key: 'particular', label: t('Particulars'), type: 'text', translatable: true },
  { key: 'description', label: t('Description'), type: 'text' },
  { key: 'modifier.fullName', label: t('User'), type: 'custom' },
  { key: 'amount', label: t('Amount'), type: 'custom' },
  { key: 'actions', label: '', type: 'custom' }
])
const actionTransactions = computed<Action[]>(() => {
  return [
    {
      label: t('edit'),
      handler: (item) => onAction('edit', item),
      icon: Edit,
    },
    {
      label: t('void'),
      handler: (item) => onAction('void', item),
      icon: Trash2
    },
    {
      label: t('printVoucher'),
      handler: (item) => onAction('printVoucher', item),
      condition: (item) => item.transactionType === 'room_posting' || item.category === 'extract_charge',
      icon: Printer
    },
    {
      label: t('printReceipt'),
      handler: (item) => onAction('printReceipt', item),
      condition: (item) => item.transactionType === 'payment',
      icon: Printer
    }, {
      label: t('printPosReceipt'),
      handler: (item) => onAction('printPosReceipt', item),
      condition: (item) => item.transactionType === 'room_posting',
      icon: Printer
    },
  ]
})


const onAction = (action: any, item: any) => {

  switch (action) {
    case 'void':
      isVoidTrasaction.value = true;
      selectedTransaction.value = item;
      break
    case 'printReceipt':
      documentTitle.value = t('printReceipt')
      printReceipt(item)
      break
    case 'printVoucher':
      documentTitle.value = t('printVoucher')
      printInvoice(item);
      break
    case 'printPosReceipt':
      documentTitle.value = t('printPosReceipt')
      printPosReceipt(item);
      break
    case 'edit':
      EditTransaction(item)
      break
  }

}

const EditTransaction = (item: any) => {
  console.log('EditTransaction', item)
  transactionToEdit.value = item
  isEditMode.value = true

  // Déterminer quel modal ouvrir en fonction du type de transaction
  if (item.category === 'adjustment') {
    isAdjustmentModal.value = true
  } else if (((item.category === 'room' || item.category === 'Room Charges') && item.transactionType === 'charge') || item.transactionType === 'room_posting') {
    isRoomChargesModal.value = true
  } else if (item.category === 'discount') {
    isApplyDiscountModal.value = true
  } else if (item.category === 'extract_charge') {
    isAddChargeModalOpen.value = true
  } else if (item.transactionType === 'payment') {
    isAddPaymentModalOpen.value = true
  }else if (item.category === 'service_charge') {
    isPickupAndDropoffModal.value = true
  }
}

// Helper functions
const formatDate = (dateStr: string) => {
  return dateStr
}
const printReceipt = async (item: any) => {
  console.log('Print receipt:', item)
  // Add print logic here
  try {
    printLoading.value = true
    showPdfExporter.value = true
    const pdfUrl = await generateReceiptPdfUrl(item.id);
    pdfurl.value = pdfUrl;
  } catch (error) {
    console.error('Error printing receipt:', error)
  } finally {
    printLoading.value = false;
  }
}
const printPosReceipt = async (item: any) => {
  console.log('Print pos receipt:', item)
  // Add print logic here
  try {
    printLoading.value = true
    showPdfExporter.value = true
    const pdfUrl = await generatePosReceiptPdfUrl(item.id);
    pdfurl.value = pdfUrl;
  } catch (error) {
    console.error('Error printing pos receipt:', error)
  } finally {
    printLoading.value = false;
  }
}
const printInvoice = async (item: any) => {
  console.log('Print receipt:', item)
  // Add print logic here
  try {
    printLoading.value = true
    showPdfExporter.value = true
    const pdfUrl = await generateInvoicePdfUrl(item.id);
    pdfurl.value = pdfUrl;
  } catch (error) {
    console.error('Error printing receipt:', error)
  } finally {
    printLoading.value = false;
  }
}
const formatAmount = (amount: number) => {
  return formatCurrency(amount)
}

const getAmountColor = (amount: number) => {
  return amount >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
}

// Modal handlers
const openAddChargeModal = () => {
  isAddChargeModalOpen.value = true
  isEditMode.value = false
}

const closeAddChargeModal = () => {
  isAddChargeModalOpen.value = false
  isEditMode.value = false
  transactionToEdit.value = null
}

// Payment modal handlers
const openAddPaymentModal = () => {
  isAddPaymentModalOpen.value = true
  isEditMode.value = false
}

const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
  isEditMode.value = false
  transactionToEdit.value = null

}
// Function to select a folio
const selectFolio = (folio: any) => {
  selectedFolio.value = selectedFolio.value?.id === folio.id ? null : folio
}

// Function to show all transactions (clear selection)
const showAllTransactions = () => {
  selectedFolio.value = null
}
const refreshFolio = async () => {
  try {
    emit('refresh')
    const resp = await getReservationFolios(props.reservationId)
    console.log('getReservationFolios',resp)

    // Handle the case where folios contain their transactions
    if (resp.data && Array.isArray(resp.data)) {
      folioList.value = resp.data

      // Extract all transactions from all folios
      allTransactions.value = []
      resp.data.forEach((folio: any) => {
        if (folio.transactions && Array.isArray(folio.transactions)) {
          // Add folioId to each transaction and add to allTransactions
          folio.transactions.forEach((transaction: any) => {
            transaction.noaction = (transaction.isVoided || transaction.status === "voided") || (transaction.category === "room" && transaction.transactionType === "charge" && transaction.subcategory === null);
            if (transaction.transactionType === 'payment') {
              const baseAmount = transaction.grossAmount || transaction.totalAmount || transaction.amount || 0
              allTransactions.value.push({
                ...transaction,
                totalAmount: (transaction.transactionType === 'payment' || transaction.transactionType === 'discount') ? -Math.abs(baseAmount) : Math.abs(baseAmount),
                // totalAmount: (transaction.transactionType === 'payment' ? -1 : 1) * transaction.
                //   totalAmount,
                category: transaction.category === 'room' ? 'Room Charges' : transaction.category,
                folioId: folio.id,
                guest: folio.guest

              })
            } else {
              allTransactions.value.push({
                ...transaction,
                category: transaction.category === 'room' ? 'Room Charges' : transaction.category,
                folioId: folio.id,
                guest: folio.guest
              })
            }

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
  }
}
defineExpose({ refreshFolio })
const getFolosReservations = async () => {
  loading.value = true
  try {
    const resp = await getReservationFolios(props.reservationId)
    console.log('getReservationFolios',resp)

    // Handle the case where folios contain their transactions
    if (resp.data && Array.isArray(resp.data)) {
      folioList.value = resp.data

      // Extract all transactions from all folios
      allTransactions.value = []
      resp.data.forEach((folio: any) => {
        if (folio.transactions && Array.isArray(folio.transactions)) {
          // Add folioId to each transaction and add to allTransactions
          folio.transactions.forEach((transaction: any) => {
            transaction.noaction = (transaction.isVoided || transaction.status === "voided") || (transaction.category === "room" && transaction.transactionType === "charge" && transaction.subcategory === null);
            if (transaction.transactionType === 'payment') {
              const baseAmount = transaction.grossAmount || transaction.totalAmount || transaction.amount || 0
              allTransactions.value.push({
                ...transaction,
                totalAmount: (transaction.transactionType === 'payment' || transaction.transactionType === 'discount') ? -Math.abs(baseAmount) : Math.abs(baseAmount),
                // totalAmount: (transaction.transactionType === 'payment' ? -1 : 1) * transaction.
                //   totalAmount,
                category: transaction.category === 'room' ? 'Room Charges' : transaction.category,
                folioId: folio.id,
                guest: folio.guest

              })
            } else {
              allTransactions.value.push({
                ...transaction,
                category: transaction.category === 'room' ? 'Room Charges' : transaction.category,
                folioId: folio.id,
                guest: folio.guest
              })
            }

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
  closeAddPaymentModal()
  refreshFolio();
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


const closePrintModal = () => {
  isPrintModalOpen.value = false
}


const handlePrintError = (error: any) => {
  console.error('Print error:', error)
}

// Impression directe comme PrintInvoice
const printInvoiceDirect = async () => {
  try {
    if (!selectedFolio.value?.id) return
    printLoading.value = true
    showPdfExporter.value = true
    documentTitle.value = t('printInvoice')
    const res = await printFolioPdf({ folioId: Number(selectedFolio.value.id), reservationId: props.reservationId })
    pdfurl.value = window.URL.createObjectURL(res)
  } catch (e) {
    console.error(e)
  } finally {
    printLoading.value = false
  }
}

const handlePdfGenerated = (_blob: Blob) => {
  // rien à faire ici pour l'instant
}

const handlePdfError = (err: any) => {
  console.error(err)
}

// Handle more actions dropdown selection
const handleMoreAction = (action: any) => {
  if (!action) return

  console.log('More action selected:', action)

  switch (action.id) {
    case 'split':
      handleSplitFolio()
      break
    case 'transfer':
      openTransfertFolioModal()
      break
    case 'cut':
      handleCutFolio()
      break
    case 'roomCharges':
      handleRoomCharges()
      break
    case 'adjustment':
      handleAdjustTransaction()
      break

    case 'send':
      handleEmailFolio()
      break
    default:
      console.log('Unknown action:', action.api)
  }
}


const handleSplitFolio = () => {
  console.log('Split folio action')
  isSplitFolioModal.value = true
}

const openTransfertFolioModal = () => {
  console.log('Transfer folio action')
  isTransfertFolioModalOpen.value = true
}

const closeTransfertFolioModal = () => {
  isTransfertFolioModalOpen.value = false
}

const onDestinationFolioSelected = (folio: any) => {
  selectedDestinationFolio.value = folio
  isTransfertFolioModalOpen.value = false
  isTransfertPostingModalOpen.value = true
}

const closeTransfertPostingModal = () => {
  isTransfertPostingModalOpen.value = false
}

const onTransferSuccess = () => {
  isTransfertPostingModalOpen.value = false
  selectedDestinationFolio.value = null
  refreshFolio()
}

const handleCutFolio = () => {
  console.log('Cut folio action')
  isCutFolioModal.value = true
}

const handleRoomCharges = () => {
  console.log('Room charges action')
  isRoomChargesModal.value = true
  isEditMode.value = false
}

const handleAdjustTransaction = () => {
  console.log('Adjust transaction action')
  isAdjustmentModal.value = true
  isEditMode.value = false
}


const handleEmailFolio = () => {
  console.log('Email folio action')
  isSendFolioModal.value = true
}

// Document data for printing
const printDocumentData = computed(() => ({
  reservation: props.reservation,
  folios: folioList.value,
  transactions: foglioData.value,
  selectedFolio: selectedFolio.value,
  balance: balance.value,
  reservationId: props.reservationId
}))


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
