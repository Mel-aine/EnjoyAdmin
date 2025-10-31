<template>
  <div class="bg-white shadow-sm dark:bg-gray-800">
    <div class="mb-0 p-3 flex justify-between items-center border-b border-gray-200">
      <div class="flex gap-5 align-middle items-center dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('cashiering_center') }}</h2>
        <Input v-model="searchQuery" :placeholder="$t('cashiering_searchPlaceholder', '')" />
      </div>
      <div class="flex space-x-2">
        <BasicButton :icon="PlusIcon" :label="$t('new_payment')" @click="openNewPaymentModal" />
        <BasicButton :label="$t('print')" variant="secondary" :icon="PrinterIcon" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <!-- City Ledger Selection -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <div class="mr-4 w-52" v-if="props.isCashering">
            <InputSelectCityLeger v-model="selectCityLedger" @select="handChangeCityLedger" />
          </div>
          <div class="flex flex-col gap-2">
            <div>
              <RadioGroup v-model="activeTab" class="flex space-x-4" :options="[
                { label: 'Posting date', value: 'posting' },
                { label: 'Departure date', value: 'departure' },
              ]" />
            </div>
            <div class="mr-4">
              <InputDoubleDatePicker lb="Posting Date" :allow-past-dates="true" v-model="dateRange" />
            </div>
          </div>

          <div class="flex justify-start gap-6">
            <InputCheckBox v-model="displayVoid" label="Display Void" id="display-void" />
          </div>

        </div>
        <div class="flex gap-5 ms-4 justify-between self-center items-center align-top pe-3">
          <div class="flex flex-col gap-2 items-center self-start justify-between content-start align-top h-full">
            <span>{{ formatCurrency(totals.cityLedgerTotal) }}</span>
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">
              {{ $t('City Ledger Total') }}</span>
          </div>
          <div class="flex flex-col gap-2 items-center justify-start align-top ">
            <span>{{ formatCurrency(totals.unpaidInvoice) }}</span>
            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ $t('Unpaid Invoice') }}</span>
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
      <ReusableTable :columns="columns" :data="transactions" :actions="actions" :loading="loading" :searchable="false" :meta="paginationMeta" @page-change="handlePageChange"
        :show-header="false" :selectable="true" @selection-change="handleSelectionChange">
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
        :selectedCompanyId="selectCityLedger?.id || props.selectedCompanyId || null" :dateRange="dateRange"
        :activeTab="activeTab" @close="newPaymentVisible = false" @payment-saved="onPaymentSaved" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
import NewPaymentCityLedger from './NewPaymentCityLedger.vue'
import InputSelectCityLeger from '../../components/reservations/foglio/InputSelectCityLeger.vue'
import { type Action, type Column } from '../../utils/models'
import { formatCurrency } from '../../utils/numericUtils'
import { getCityLedgerDetails } from '../../services/companyApi'
import { useServiceStore } from '../../composables/serviceStore'
import { voidFolioTransaction } from '../../services/foglioApi'
import { generateReceiptPdfUrl } from '../../services/reportsApi'

const props = defineProps<{ selectedCompanyId?: number | null; isCashering?: boolean }>()

const { t } = useI18n()
const serviceStore = useServiceStore()
const router = useRouter()
const toast = useToast()
const searchQuery = ref('')
const paginationMeta = ref<any>(null)

// State
const activeTab = ref('posting')
const totals = ref<any>({})
const loading = ref(false)
const newPaymentVisible = ref(false)
const displayVoid = ref(false)

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
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'description', label: 'Description', type: 'custom' },
  { key: 'paymentType', label: 'Payment Type', type: 'custom' },
  { key: 'user', label: 'User', type: 'custom' },
  { key: 'credit', label: 'Credit', type: 'custom' },
  { key: 'debit', label: 'Debit', type: 'custom' },
  { key: 'assigned', label: 'Assigned', type: 'custom' },
  { key: 'unassigned', label: 'Unassigned', type: 'custom' },
  { key: 'balance', label: 'Balance', type: 'custom' },
])

// Sample data
const transactions = ref<any[]>([])
const handChangeCityLedger = (item: any) => {
  selectCityLedger.value = item;
  loadCityLedgerData(1)
}

// Load city ledger data function
const loadCityLedgerData = async (pageNumber = 1) => {
  const companyId = selectCityLedger.value?.id ?? props.selectedCompanyId
  if (!companyId) {
    transactions.value = []
    return
  }

  loading.value = true
  try {
    const params = {
      companyAccountId: companyId,
      hotelId: serviceStore.serviceId!,
      dateFrom: dateRange.value.start,
      dateTo: dateRange.value.end,
      usePostingDate: activeTab.value === 'posting',
      searchText: searchQuery.value || '',
      showVoided: displayVoid.value,
      page: pageNumber,
      limit: 100
    }

    const response = await getCityLedgerDetails(params)
    console.log('response search', response)

    if (response?.data) {
      cityLedgerData.value = response.companyAccount
      totals.value = response.totals
      transactions.value = response.data || []
      paginationMeta.value = response.meta
      originalTransactions.value = [...transactions.value]
    }
  } catch (error) {
    console.error('Error loading city ledger data:', error)
    transactions.value = []
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  loadCityLedgerData(newPage);
};


// Actions
const actions = ref([
  {
    name: 'void', label: 'Void', icon: 'ban', danger: true,
    handler: (item :any) => onAction('void', item),
  },
  {
    name: 'print', label: 'Print Receipt', icon: 'printer',
    handler: (item :any) => onAction('printReceipt', item),
    condition: (item: any) => item.transactionType === 'payment',
  },
  {
    name: 'map', label: 'Map Payment', icon: 'map', handler: (item :any) => onAction('printReceipt', item),
    condition: (item: any) => item.transactionType === 'payment',
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
  loadCityLedgerData(1)
}

// Watchers
watch(() => props.selectedCompanyId, (newId) => {
  if (newId) {
    selectCityLedger.value = { id: newId }
    loadCityLedgerData(1)
  }
})

watch([() => dateRange.value.start, () => dateRange.value.end], () => {
  loadCityLedgerData(1)
})

// Handle actions from the table
async function onAction(action: string, item: any) {
  try {
    // Defensive: derive a transaction ID
    const transactionId = item?.id ?? item?.transactionId ?? item?.folioTransactionId ?? item?.folio_transaction_id

    switch (action) {
      case 'void': {
        if (!transactionId) {
          toast.error('Missing transaction ID')
          return
        }

        // Simple confirmation; could be replaced by a modal for reason input
        const confirmed = window.confirm('Are you sure you want to void this transaction?')
        if (!confirmed) return

        await voidFolioTransaction(Number(transactionId), { reason: 'Voided from Cashiering Center' })
        toast.success('Transaction voided')
        await loadCityLedgerData()
        break
      }
      case 'printReceipt': {
        if (!transactionId) {
          toast.error('Missing transaction ID')
          return
        }

        // Generate receipt PDF URL and open in PDF viewer route
        const url = await generateReceiptPdfUrl(String(transactionId))
        if (!url) {
          toast.error('Failed to generate receipt')
          return
        }
        const encodedUrl = btoa(encodeURIComponent(url))
        const routeData = router.resolve({ name: 'PDFViewer', query: { url: encodedUrl } })
        window.open(routeData.href, '_blank')
        break
      }
      case 'map': {
        // Open mapping modal; prefilled with current filters via props
        openNewPaymentModal()
        break
      }
      default:
        console.warn('Unknown action:', action)
    }
  } catch (error) {
    console.error('Action handling error:', error)
    toast.error('Action failed')
  }
}

watch(activeTab, () => {
  loadCityLedgerData(1)
})

watch(displayVoid, () => {
  loadCityLedgerData(1)
})

watch(searchQuery, () => {
  loadCityLedgerData(1)
})

// Lifecycle hooks
onMounted(() => {
  if (props.selectedCompanyId) {
    selectCityLedger.value = { id: props.selectedCompanyId }
  }
  loadCityLedgerData(1)
})
</script>
