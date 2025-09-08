<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('unsettledFolios.title')" :breadcrumb="breadcrumb" />
    
    <div class="space-y-6">
      
      <!-- Unsettled Folios Table -->
      <ReusableTable
        :title="'Unsettled Folios'"
        :columns="columns"
        :data="filteredFolios"
        :actions="actions"
        :loading="loading"
        :searchable="false"
        :selectable="true"
        :empty-state-title="$t('unsettledFolios.noFoliosFound')"
        :empty-state-message="$t('unsettledFolios.noFoliosMessage')"
        @selection-change="onSelectionChange"
        @action="onAction"
      >
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
          <span :class="getStatusClass(item.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ $t(`folioStatus.${item.status}`) }}
          </span>
        </template>
        
        <template #column-daysPending="{ item }">
          <span :class="getDaysClass(item.daysPending)" class="text-sm font-medium">
            {{ item.daysPending }} {{ $t('common.days') }}
          </span>
        </template>
      </ReusableTable>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import UnsettledFoliosFilter from '@/components/filters/UnsettledFoliosFilter.vue'
import { FileTextIcon, DollarSignIcon, TrendingUpIcon, ClockIcon, EyeIcon, PrinterIcon, MailIcon } from 'lucide-vue-next'
import { getUnsetteledFolio } from '@/services/foglioApi.ts' // Assume this API exists
import { useServiceStore } from '@/composables/serviceStore'

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
  daysPending: number
}

interface FolioFilterItem {
  searchBy: string
  searchText: string
  status: string
  arrivalEnabled: boolean
  dateFrom: string
  dateTo: string
}

// Reactive data
const loading = ref(false)
const selectedFolios = ref<UnsettledFolio[]>([])
const currentFilters = ref<FolioFilterItem>({
  searchBy: 'all',
  searchText: '',
  status: '',
  arrivalEnabled: false,
  dateFrom: '',
  dateTo: ''
})

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
  { key: 'folioNumber', label: 'Folio#', type: 'text' as const },
  { key: 'reservationNumber', label: 'Reservation#', type: 'text' as const },
  { key: 'guestName', label: 'Guest Name', type: 'text' as const },
  { key: 'checkInDate', label: 'Arrival', type: 'date' as const },
  { key: 'checkOutDate', label: 'Departure', type: 'date' as const },
  { key: 'status', label: 'Status', type: 'custom' as const },
  { key: 'balance', label: 'Balance', type: 'custom' as const }
])

// Table actions
const actions = ref([
  {
    label: t('common.view'),
    action: 'view',
    icon: EyeIcon
  },
  {
    label: t('common.print'),
    action: 'print',
    icon: PrinterIcon
  },
  {
    label: t('common.sendEmail'),
    action: 'email',
    icon: MailIcon
  }
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

const summary = computed(() => {
  const filtered = filteredFolios.value
  const totalBalance = filtered.reduce((sum, folio) => sum + folio.balance, 0)
  const oldestFolio = filtered.reduce((oldest, folio) => 
    folio.daysPending > oldest ? folio.daysPending : oldest, 0
  )
  
  return {
    totalFolios: filtered.length,
    totalBalance,
    avgBalance: filtered.length > 0 ? totalBalance / filtered.length : 0,
    oldestFolioDays: oldestFolio
  }
})
const formatBalance = (balance: string | number) => {
  // Convertir en nombre si c'est une string
  const balanceValue = typeof balance === 'string' ? parseFloat(balance) : balance
  return balanceValue.toFixed(2)
}
// Methods
const handleFilter = (filters: FolioFilterItem) => {
  currentFilters.value = { ...filters }
}

const onSelectionChange = (selected: UnsettledFolio[]) => {
  selectedFolios.value = selected
}

const onAction = (action: any, folio: UnsettledFolio) => {
  switch (action.action) {
    case 'view':
      console.log('View folio:', folio)
      // Navigate to folio details
      break
    case 'print':
      console.log('Print folio:', folio)
      // Print folio
      break
    case 'email':
      console.log('Email folio:', folio)
      // Send email
      break
  }
}
const fetchUnsettledFolios = async () => {
  const serviceId = serviceStore.serviceId
  loading.value = true
  try {
    const data = await getUnsetteledFolio(serviceId!)
    folios.value = data.data.data.map((folio: any) => ({
      ...folio,
      guestName: folio.folioName,
      reservationNumber: folio.reservationId
    }))
    console.log('Fetched unsettled folios:', folios.value)
  } catch (error) {
    console.error('Error fetching unsettled folios:', error)
  } finally {
    loading.value = false
  }
}


// Utility methods for styling
const getBalanceClass = (balance: number) => {
  if (balance > 2000) return 'text-red-600 dark:text-red-400'
  if (balance > 1000) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Checked Out':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Cancel':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    case 'Open':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Disputed':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'Closed':
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
  fetchUnsettledFolios()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>