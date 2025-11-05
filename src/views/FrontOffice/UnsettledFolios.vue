<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('unsettledFolios.title')" :breadcrumb="breadcrumb" />

    <div class="space-y-6">

      <!-- Unsettled Folios Table -->
      <ReusableTable :title="$t('unsettledFolios.tableTitle')" :columns="columns" :data="filteredFolios" :actions="actions"
        :loading="loading" :searchable="false" :selectable="true" :meta="paginationMeta" @page-change="handlePageChange"
        :empty-state-title="$t('unsettledFolios.noFoliosFound')"
        :empty-state-message="$t('unsettledFolios.noFoliosMessage')" @selection-change="onSelectionChange"
        @action="onAction">
        <!-- Custom header slot for filters -->
        <template #header-actions>
          <UnsettledFoliosFilter @filter="handleFilter" :show-date="true" />
        </template>
        <!-- Custom column templates -->

        <template #column-balance="{ item }">
          <span :class="getBalanceClass(item.balance)" class="text-sm font-semibold">
            {{ formatBalance(item.balance) }}
          </span>
        </template>

        <template #column-status="{ item }">
          <span :class="getStatusClass(item.status)"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ $t(`${item.status}`) }}
          </span>
        </template>

        <template #column-daysPending="{ item }">
          <span :class="getDaysClass(item.daysPending)" class="text-sm font-medium">
            {{ item.daysPending }} {{ $t('common.days') }}
          </span>
        </template>
      </ReusableTable>
    </div>

    <!-- Add Payment Modal -->
    <template v-if="isAddPaymentModalOpen && selectedFolio">
      <AddPaymentModal :reservation-id="selectedFolio.reservationId" :is-open="isAddPaymentModalOpen"
        @close="closeAddPaymentModal" @save="handleSavePayment" />
    </template>

    <!-- PDF Exporter -->
    <template v-if="showPdfExporter">
      <PdfExporterNode :pdf-url="pdfurl" is-modal-open :title="$t('printInvoice')" :is-generating="printLoading"
        :loading="printLoading" @pdf-generated="handlePdfGenerated" @pdf-error="handlePdfError"
        @close="showPdfExporter = false" />
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import UnsettledFoliosFilter from '@/components/filters/UnsettledFoliosFilter.vue'
import { EyeIcon, PrinterIcon, MailIcon } from 'lucide-vue-next'
import { getUnsetteledFolio, printFolioPdf } from '@/services/foglioApi.ts'
import { useServiceStore } from '@/composables/serviceStore'
import PaymentIcon from '../../icons/PaymentIcon.vue'
import PdfExporterNode from '@/components/common/PdfExporterNode.vue'

// Async components
const AddPaymentModal = defineAsyncComponent(() => import('@/components/reservations/foglio/AddPaymentModal.vue'))

const serviceStore = useServiceStore()
const { t } = useI18n()

// Define interfaces
interface UnsettledFolio {
  id: string
  folioNumber: string
  guestName: string
  reservationNumber: string
  roomNumber: string
  roomType: string
  checkInDate: string
  checkOutDate: string
  totalCharges: number
  totalPayments: number
  balance: number
  status: string,
  lastActivity: string
  daysPending: number,
  reservationId: number
}

interface FolioFilterItem {
  searchBy: string
  searchText: string
  status: string
  arrivalEnabled: boolean
  dateFrom: string
  dateTo: string
}

// State management
const loading = ref(false)
const selectedFolios = ref<UnsettledFolio[]>([])
const currentFilters = ref<FolioFilterItem>({
  searchBy: 'all',
  searchText: '',
  status: 'all',
  arrivalEnabled: false,
  dateFrom: '',
  dateTo: ''
})

// Modal states
const isAddPaymentModalOpen = ref(false)
const showPdfExporter = ref(false)
const printLoading = ref(false)
const pdfurl = ref<string>('')
const selectedFolio = ref<UnsettledFolio | null>(null)
const paginationMeta = ref<any>(null)

// Breadcrumb
const breadcrumb = [
  { label: t('navigation.frontOffice'), href: '#' },
  { label: t('unsettledFolios.title'), href: '#' }
]

// Mock data for unsettled folios
const folios = ref<UnsettledFolio[]>([
])

// Table columns configuration
const columns = computed(() => [
  { key: 'folioNumber', label: t('unsettledFolios.columns.folioNumber'), type: 'text' as const },
  { key: 'reservationNumber', label: t('unsettledFolios.columns.reservationNumber'), type: 'text' as const },
  { key: 'guestName', label: t('unsettledFolios.columns.guestName'), type: 'text' as const },
  { key: 'arrival', label: t('arrival'), type: 'date' as const },
  { key: 'departure', label: t('departure'), type: 'date' as const },
  { key: 'status', label: t('unsettledFolios.columns.status'), type: 'custom' as const },
  { key: 'balance', label: t('unsettledFolios.columns.balance'), type: 'custom' as const }
])

// Table actions
const actions = ref([
  {
    label: t('AddPayment'),
    action: 'add',
    icon: PaymentIcon,
    handler: (item: any) => onAction('add', item)
  },
  {
    label: t('printInvoice'),
    action: 'print',
    icon: PrinterIcon,
    handler: (item: any) => onAction('print', item)
  },
  /*{
    label: t('common.sendEmail'),
    action: 'email',
    icon: MailIcon
  }*/
])

// Computed properties
const filteredFolios = computed(() => {
  let filtered = folios.value

  // Apply search filter
  if (currentFilters.value.searchText) {
    const searchTerm = currentFilters.value.searchText.toLowerCase()

    if (currentFilters.value.searchBy === 'all') {
      filtered = filtered.filter(folio =>
        folio.guestName.toLowerCase().includes(searchTerm) ||
        folio.folioNumber.toLowerCase().includes(searchTerm) ||
        folio.reservationNumber.toLowerCase().includes(searchTerm)
      )
    } else if (currentFilters.value.searchBy === 'folio') {
      filtered = filtered.filter(folio => folio.folioNumber.toLowerCase().includes(searchTerm))
    } else if (currentFilters.value.searchBy === 'guest') {
      filtered = filtered.filter(folio => folio.guestName.toLowerCase().includes(searchTerm))
    } else if (currentFilters.value.searchBy === 'reservation') {
      filtered = filtered.filter(folio => folio.reservationNumber.toLowerCase().includes(searchTerm))
    }
  }

  // Apply status filter
  if (currentFilters.value.status) {
    filtered = filtered.filter(folio => folio.status === currentFilters.value.status)
  }

  // Apply arrival date range filter
  if (currentFilters.value.arrivalEnabled) {
    if (currentFilters.value.dateFrom) {
      filtered = filtered.filter(folio => folio.checkInDate >= currentFilters.value.dateFrom)
    }

    if (currentFilters.value.dateTo) {
      filtered = filtered.filter(folio => folio.checkInDate <= currentFilters.value.dateTo)
    }
  }

  return filtered
})

const formatBalance = (balance: string | number) => {
  // Convertir en nombre si c'est une string
  const balanceValue = typeof balance === 'string' ? parseFloat(balance) : balance
  return balanceValue.toFixed(2)
}
// Methods
const handleFilter = (filters: FolioFilterItem) => {
  currentFilters.value = { ...filters }
  fetchUnsettledFolios(1)
}

const onSelectionChange = (selected: UnsettledFolio[]) => {
  selectedFolios.value = selected
}

const onAction = (action: any, folio: UnsettledFolio) => {
  selectedFolio.value = folio
  switch (action) {
    case 'add':
      console.log('Add payment for folio:', folio)
      openAddPaymentModal()
      break
    case 'print':
      console.log('Print folio:', folio)
      printInvoiceDirect()
      break
  }
}

// Payment modal handlers
const openAddPaymentModal = () => {
  isAddPaymentModalOpen.value = true
}

const closeAddPaymentModal = () => {
  isAddPaymentModalOpen.value = false
  selectedFolio.value = null
}

const handleSavePayment = (paymentData: any) => {
  console.log('Payment saved:', paymentData)
  // Refresh the folios list after payment
  fetchUnsettledFolios()
  closeAddPaymentModal()
}

// Print functionality
const printInvoiceDirect = async () => {
  try {
    if (!selectedFolio.value?.id) return
    printLoading.value = true
    showPdfExporter.value = true

    // Use the folio ID and a dummy reservation ID (you might need to adjust this based on your data structure)
    const res = await printFolioPdf({
      folioId: Number(selectedFolio.value.id),
      reservationId: selectedFolio.value.reservationId
    })
    pdfurl.value = window.URL.createObjectURL(res)
    console.log('pdfurl', pdfurl.value)
  } catch (e) {
    console.error('Print error:', e)
  } finally {
    printLoading.value = false
  }
}

const handlePdfGenerated = (_blob: Blob) => {
  // PDF generated successfully
}

const handlePdfError = (err: any) => {
  console.error('PDF generation error:', err)
}
const fetchUnsettledFolios = async (pageNumber=1) => {
  const serviceId = serviceStore.serviceId
  loading.value = true
  try {
    const data = await getUnsetteledFolio(serviceId!,{page : pageNumber , limit : 20})
    console.log('unsettled folios:', data)
    folios.value = data.data.data;
    paginationMeta.value = data.data.meta
    console.log('Fetched unsettled folios:', folios.value)
  } catch (error) {
    console.error('Error fetching unsettled folios:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) =>{
  fetchUnsettledFolios(newPage)
}


// Utility methods for styling
const getBalanceClass = (balance: number) => {
  if (balance > 2000) return 'text-red-600 dark:text-red-400'
  if (balance > 1000) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'checkout':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    case 'noshow':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'inhouse':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

const getDaysClass = (days: number) => {
  if (days > 30) return 'text-red-600 dark:text-red-400'
  if (days > 14) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

// Lifecycle
onMounted(() => {
  // Load initial data
  loading.value = false
  fetchUnsettledFolios(1)
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
