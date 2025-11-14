<template>
  <div class="bg-white shadow-sm dark:bg-gray-800">
    <div class="mb-0 p-3 flex justify-between items-center border-b border-gray-200">
      <div class="flex gap-5 align-middle items-center dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('cashiering_center') }}</h2>
        <Input v-model="searchQuery" :placeholder="$t('cashiering_searchPlaceholder', '')" />
      </div>
      <div class="flex space-x-2">
        <BasicButton :icon="PlusIcon" :label="$t('new_payment')" @click="openNewPaymentModal" />
        <BasicButton
          :label="$t('print')"
          variant="secondary"
          :icon="PrinterIcon"
          :disabled="!selectedCityLedgerId"
          @click="printVoucher"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <!-- City Ledger Selection -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <div class="mr-4 w-52" v-if="props.isCashering">
            <InputSelectCityLeger v-model="selectedCityLedgerId" @select="handChangeCityLedger" />
          </div>
          <div class="flex flex-col gap-2">
            <div>
              <RadioGroup v-model="activeTab" class="flex space-x-4" :options="[
                { label: t('Posting date'), value: 'posting' },
                { label: t('Departure date'), value: 'departure' }
              ]" />
            </div>
            <div class="mr-4">
              <InputDoubleDatePicker :lb="t('Posting Date')" :allow-past-dates="true" v-model="dateRange" />
            </div>
          </div>

          <div class="flex justify-start gap-6">
            <InputCheckBox v-model="displayVoid" :label="$t('Display Void')" id="display-void" />
          </div>

        </div>
        <div class="flex gap-5 ms-4 justify-between self-center items-center align-top pe-3">
          <div class="flex flex-col gap-2 items-center self-start justify-between content-start align-top h-full">
            <span>{{ formatCurrency(totals.totalCredit) }}</span>
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
              {{ $t('City Ledger Total') }}</span>
          </div>
          <div class="flex flex-col gap-2 items-center justify-start align-top ">
            <span>{{ formatCurrency(totals.unpaidInvoices) }}</span>
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
              {{ $t('Unpaid Invoice') }}</span>
          </div>
          <div class="flex flex-col gap-2 items-center justify-start align-top ">
            <span>{{ formatCurrency(totals.unassignedPayments) }}</span>
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{
              $t('Unassigned Payments') }}</span>
          </div>
          <div class="flex flex-col gap-2 items-center justify-start align-top ">
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{
              formatCurrency(totals.assignedPayments) }}</span>
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{
              $t('Assigned Payments') }}</span>
          </div>
          <!-- <div class="flex flex-col gap-2 items-center justify-start align-top ">
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ $t('Opening Balance') }}</span>
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ formatCurrency(totals.openingBalance) }}</span>
          </div>-->

        </div>
      </div>


      <!-- Table Content -->
      <ReusableTable :columns="columns" :data="transactions" :actions="actions" :loading="loading" :searchable="false"
        :show-header="false" :selectable="false" @selection-change="handleSelectionChange">
        <!-- Custom cell for Description column -->
        <template #column-description="{ item }">
          <div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.description }}</span>
            <p v-if="item.details" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.details }}</p>
          </div>
        </template>

        <!-- Custom cell for Credit column -->
        <template #column-credit="{ item }">
          <span class="text-sm"
            :class="item.credit > 0 ? 'font-medium text-green-600 dark:text-green-400' : '  dark:text-white'">{{
              -formatCurrency(item.credit) }}</span>
        </template>

        <!-- Custom cell for Debit column -->
        <template #column-debit="{ item }">
          <span class="text-sm"
            :class="item.debit > 0 ? 'font-medium text-red-600 dark:text-red-400' : ' dark:text-white'">{{
              formatCurrency(item.debit) }}</span>
        </template>
        <template #column-unassigned="{ item }">
          <span class="text-sm">{{ formatCurrency(item.open) }}</span>
        </template>
        <!-- Custom cell for Balance column -->
        <template #column-balance="{ item }">
          <span class="text-sm font-medium">{{ formatCurrency(item.balance) }}</span>
        </template>
      </ReusableTable>
    </div>

    <template v-if="newPaymentVisible">
      <NewPaymentCityLedger v-if="newPaymentVisible"
        :selectedCompanyId="selectedCityLedgerId || props.selectedCompanyId || null" :dateRange="dateRange"
        :activeTab="activeTab" :mappingMode="!!mapPaymentContext" :mapPaymentContext="mapPaymentContext"
        @close="onModalClosed" @payment-saved="onPaymentSaved" />
    </template>

    <!-- Void Transaction Modal -->
    <template v-if="showVoidModal && voidTransactionDetails">
      <VoidTransactionModal
        :is-open="showVoidModal"
        :transactionDetails="voidTransactionDetails"
        :is-company-payment="true"
        @close="handleVoidClose"
        @success="handleVoidSuccess"
        @error="handleVoidError"
      />
    </template>
    <!-- Global overlay spinner shown on refresh (not first load) -->
    <OverLoading v-if="isLoading" />
    <!-- Direct PDF Preview (same viewer as PrintInvoice) -->
    <div v-if="showPdfExporter">
      <PdfExporterNode
        @close="showPdfExporter = false"
        :is-modal-open="showPdfExporter"
        :title="$t(documentTitle)"
        :is-generating="printLoading"
        :pdf-url="pdfurl"
        :pdf-theme="pdfTheme"
        @pdf-generated="handlePdfGenerated"
        @error="handlePdfError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import PlusIcon from '../../icons/PlusIcon.vue'
import { PrinterIcon } from 'lucide-vue-next'
import Input from '../../components/forms/FormElements/Input.vue'
import RadioGroup from '../../components/forms/FormElements/RadioGroup .vue'
import InputCheckBox from '../../components/forms/FormElements/InputCheckBox.vue'
// Lazy-load NewPaymentCityLedger to avoid mixed dynamic/static import warning
const NewPaymentCityLedger = defineAsyncComponent(() => import('./NewPaymentCityLedger.vue'))
import InputSelectCityLeger from '../../components/reservations/foglio/InputSelectCityLeger.vue'
import { type Action, type Column } from '../../utils/models'
import { formatCurrency } from '../../utils/numericUtils'
import { getCityLedgerDetails } from '../../services/companyApi'
import { useServiceStore } from '../../composables/serviceStore'
import { generateReceiptPdfUrl, generateCompanyReceiptPdfUrl, generateCompanyVoucherPdfUrl } from '../../services/reportsApi'
import VoidTransactionModal from '../../components/modals/VoidTransactionModal.vue'
import OverLoading from '@/components/spinner/OverLoading.vue'
import { isLoading } from '@/composables/spinner'
import PdfExporterNode from '../../components/common/PdfExporterNode.vue'

const props = defineProps<{ selectedCompanyId?: number | null; isCashering?: boolean }>()
const emit = defineEmits(['refreshed'])

const { t } = useI18n()
const serviceStore = useServiceStore()
const router = useRouter()
const toast = useToast()
const searchQuery = ref('')

// State
const activeTab = ref('posting')
const totals = ref<any>({})
const loading = ref(false)
const hasLoadedOnce = ref(false)
const newPaymentVisible = ref(false)
const displayVoid = ref(false)
const showVoidModal = ref(false)
const voidTransactionDetails = ref<any | null>(null)
// Print overlay state (aligns with FoglioOperation.vue)
const showPdfExporter = ref(false)
const printLoading = ref(false)
const pdfurl = ref<string>('')
const pdfTheme = ref<Record<string, any>>({})
const documentTitle = ref('printReceipt')

// Initialize date range with yesterday and today
const getYesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

const getToday = () => {
  const date = new Date()
  return date.toISOString().split('T')[0]
}
const dateRange = ref({
  start: getYesterday(),
  end: getToday(),
})

// City Ledger data
const selectCityLedger = ref<any>(null)
const selectedCityLedgerId = ref<number | null>(null)
const cityLedgerData = ref<any>({
  transactions: [],
  totals: {
    cityLedgerTotal: 0,
    unpaidInvoice: 0,
    unassignedPayments: 0,
    assignedPayments: 0,
    openingBalance: 0
  }
})

// Original data backup for filtering
const originalTransactions = ref<any>([])
// Table columns
const columns = ref<Column[]>([
  { key: 'date', label: t('Date'), type: 'date' },
  { key: 'description', label: t('Description'), type: 'custom' },
  { key: 'paymentType', label: t('Payment Type'), type: 'custom' },
  { key: 'user', label: t('User'), type: 'custom' },
  { key: 'credit', label: t('Credit'), type: 'custom' },
  { key: 'debit', label: t('Debit'), type: 'custom' },
  { key: 'assigned', label: t('Assigned'), type: 'custom' },
  { key: 'unassigned', label: t('Unassigned'), type: 'custom' },
  { key: 'balance', label: t('Balance'), type: 'custom' },
])

// Sample data
const transactions = ref<any[]>([])
const handChangeCityLedger = (item: any) => {
  selectCityLedger.value = item;
  selectedCityLedgerId.value = Number(item?.id) || null
  loadCityLedgerData()
}

// Load city ledger data function
const loadCityLedgerData = async () => {
  const companyId = selectedCityLedgerId.value ?? props.selectedCompanyId
  if (!companyId) {
    transactions.value = []
    return
  }

  // Ensure full date range is selected before fetching
  const { start, end } = dateRange.value
  if (!start || !end) {
    return
  }

  // Use skeleton only on first load; use global overlay spinner for refresh
  const wasLoaded = hasLoadedOnce.value
  if (!hasLoadedOnce.value) {
    loading.value = true
  } else {
    isLoading.value = true
  }
  try {
    const params = {
      companyAccountId: companyId,
      hotelId: serviceStore.serviceId!,
      dateFrom: dateRange.value.start,
      dateTo: dateRange.value.end,
      usePostingDate: activeTab.value === 'posting',
      searchText: searchQuery.value || '',
      showVoided: displayVoid.value,
      page: 1,
      limit: 100
    }

    const response = await getCityLedgerDetails(params)
    console.log('response search', response)

    if (response?.data) {
      cityLedgerData.value = response.companyAccount
      totals.value = response.totals
      transactions.value = (response.data || []).map((e: any) => {
        return { ...e, noaction: e.transactionType === 'transfer' }
      })
      originalTransactions.value = [...transactions.value]
    }
  } catch (error) {
    console.error('Error loading city ledger data:', error)
    transactions.value = []
  } finally {
    loading.value = false
    isLoading.value = false
    // Emit refreshed to parent only on subsequent loads (avoid initial load)
    if (wasLoaded) emit('refreshed')
    hasLoadedOnce.value = true
  }
}


// Actions
const actions = computed(() => [
  {
    name: 'void', label: t('Void'), icon: 'ban', danger: true,
    handler: (item: any) => onAction('void', item),
    condition: (item: any) => (item.transactionType === 'payment' && item.assigned <= 0),
  },
  {
    name: 'print', label: t('Print Receipt'), icon: 'printer',
    handler: (item: any) => onAction('printReceipt', item),
  },
  {
    name: 'map', label: t('Map Payment'), icon: 'map', handler: (item: any) => onAction('map', item),
    condition: (item: any) => (item.transactionType === 'payment' && item.open > 0),
  }
])

// Selected items
const selectedItems = ref([])

function handleSelectionChange(items: any) {
  selectedItems.value = items
  console.log('Selected items:', items)
}

function openNewPaymentModal() {
  newPaymentVisible.value = true
}

function onPaymentSaved() {
  newPaymentVisible.value = false
  loadCityLedgerData()
  mapPaymentContext.value = null
}

function onModalClosed() {
  newPaymentVisible.value = false
  mapPaymentContext.value = null
}

// Watchers
watch(() => props.selectedCompanyId, (newId) => {
  if (newId) {
    selectedCityLedgerId.value = newId
    loadCityLedgerData()
  }
})

watch([() => dateRange.value.start, () => dateRange.value.end], () => {
  const { start, end } = dateRange.value
  if (start && end) {
    loadCityLedgerData()
  }
})

// Handle actions from the table
async function onAction(action: string, item: any) {
  try {
    // Defensive: derive a transaction ID
    const transactionId = item?.id;

    switch (action) {
      case 'void':
        openVoidModal(item)
        break
      case 'printReceipt': {
        documentTitle.value = 'printReceipt'
        await printReceipt(item)
        break
      }
      case 'map': {
        // Open mapping modal; pass mapping context with selected payment transaction
        mapPaymentContext.value = {
          ...item,
          transactionId: Number(transactionId),
        }
        openNewPaymentModal()
        break
      }
      default:
        console.warn('Unknown action:', action)
    }
  } catch (error) {
    console.error('Action handling error:', error)
    toast.error(t('Action failed'))
  }
}

// Print receipt (Company Receipt): show in PdfExporterNode
const printReceipt = async (item: any) => {
  try {
    documentTitle.value = 'printReceipt'
    printLoading.value = true
    showPdfExporter.value = true
    const url = await generateCompanyReceiptPdfUrl(String(item?.id))
    pdfurl.value = url
  } catch (error) {
    console.error('Error printing company receipt:', error)
    toast.error(t('errorGeneratingReceipt') || 'Failed to print company receipt')
  } finally {
    printLoading.value = false
  }
}

// Print voucher for selected City Ledger and date range via PdfExporterNode
const printVoucher = async () => {
  try {
    const companyId = selectedCityLedgerId.value || props.selectedCompanyId
    if (!companyId) {
      toast.error(t('pleaseSelectCityLedger') || 'Please select a City Ledger')
      return
    }
    const { start, end } = dateRange.value
    if (!start || !end) {
      toast.error(t('pleaseSelectDateRange') || 'Please select a date range')
      return
    }
    documentTitle.value = 'printVoucher'
    printLoading.value = true
    showPdfExporter.value = true
    const url = await generateCompanyVoucherPdfUrl(companyId, start, end)
    pdfurl.value = url
  } catch (error) {
    console.error('Error printing company voucher:', error)
    toast.error(t('errorGeneratingReceipt') || 'Failed to print company voucher')
  } finally {
    printLoading.value = false
  }
}

function handlePdfGenerated(_blob: Blob) {
  // No-op for now; hook available for future enhancements
}

function handlePdfError(err: any) {
  console.error('PDF viewer error:', err)
  toast.error(t('errorGeneratingReceipt') || 'Failed to render PDF')
}

watch(activeTab, () => {
  loadCityLedgerData()
})

watch(displayVoid, () => {
  loadCityLedgerData()
})

watch(searchQuery, () => {
  loadCityLedgerData()
})

// Lifecycle hooks
onMounted(() => {
  if (props.selectedCompanyId) {
    selectedCityLedgerId.value = props.selectedCompanyId
  }
  loadCityLedgerData()
})

// Mapping context for New Payment modal invoked via 'map' action
const mapPaymentContext = ref<{ transactionId: number; openAmount: number } | null>(null)

// Void modal handlers
function openVoidModal(item: any) {
  voidTransactionDetails.value = {
    id: Number(item?.id),
    date: item?.date || item?.postingDate || '',
    reference: item?.transactionNumber || item?.reference || '',
    description: item?.description || '',
    amount: item?.totalAmount ?? item?.amount ?? 0,
  }
  showVoidModal.value = true
}

function handleVoidClose() {
  showVoidModal.value = false
  voidTransactionDetails.value = null
}

async function handleVoidSuccess() {
  try {
    toast.success(t('transactionVoidedSuccessfully'))
    const txnId = voidTransactionDetails.value?.id
    showVoidModal.value = false
    voidTransactionDetails.value = null
    await loadCityLedgerData()
    // Auto print receipt for the voided transaction
    if (txnId) {
      const url = await generateReceiptPdfUrl(String(txnId))
      const encodedUrl = btoa(encodeURIComponent(url))
      const routeData = router.resolve({ name: 'PDFViewer', query: { url: encodedUrl } })
      window.open(routeData.href, '_blank')
    }
  } catch (err) {
    console.error('Error after voiding transaction:', err)
    toast.error(t('errorGeneratingReceipt') || 'Failed to generate receipt')
  }
}

function handleVoidError(error: any) {
  console.error('Void transaction error:', error)
  toast.error(error?.message || t('errorVoidingTransaction'))
}
</script>
