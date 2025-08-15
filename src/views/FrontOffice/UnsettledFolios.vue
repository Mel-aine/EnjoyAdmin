<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="$t('unsettledFolios.title')" :breadcrumb="breadcrumb" />
    
    <div class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FileTextIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('unsettledFolios.totalFolios') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalFolios }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <DollarSignIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('unsettledFolios.totalBalance') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.totalBalance.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUpIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('unsettledFolios.avgBalance') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.avgBalance.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <ClockIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('unsettledFolios.oldestFolio') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.oldestFolioDays }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Component -->
      <UnsettledFoliosFilter @filter="handleFilter" :show-date="true" />
      
      <!-- Unsettled Folios Table -->
      <ReusableTable
        :title="$t('unsettledFolios.tableTitle')"
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
        <!-- Custom column templates -->
        <template #column-guestName="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.guestName }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.reservationNumber }}</div>
          </div>
        </template>
        
        <template #column-balance="{ item }">
          <span :class="getBalanceClass(item.balance)" class="text-sm font-semibold">
            ${{ item.balance.toFixed(2) }}
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
  status: 'Open' | 'Closed' | 'Pending' | 'Disputed'
  lastActivity: string
  daysPending: number
}

interface FolioFilterItem {
  searchText: string
  status: string
  roomType: string
  minBalance: string
  maxBalance: string
  dateFrom: string
  dateTo: string
}

// Reactive data
const loading = ref(false)
const selectedFolios = ref<UnsettledFolio[]>([])
const currentFilters = ref<FolioFilterItem>({
  searchText: '',
  status: '',
  roomType: '',
  minBalance: '',
  maxBalance: '',
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
  {
    id: '1',
    folioNumber: 'FNH163',
    guestName: 'Mr. Huzaifa Ramalawala',
    reservationNumber: '167',
    roomNumber: '101',
    roomType: 'Deluxe Room',
    checkInDate: '2024-01-15',
    checkOutDate: '2024-01-20',
    totalCharges: 1506.00,
    totalPayments: 0.00,
    balance: 1506.00,
    status: 'Open',
    lastActivity: '2024-01-20',
    daysPending: 15
  },
  {
    id: '2',
    folioNumber: 'FNH165',
    guestName: 'Mr. Bulhanudin',
    reservationNumber: '169',
    roomNumber: '205',
    roomType: 'Standard Room',
    checkInDate: '2024-01-17',
    checkOutDate: '2024-01-18',
    totalCharges: 600.00,
    totalPayments: 0.00,
    balance: 600.00,
    status: 'Open',
    lastActivity: '2024-01-18',
    daysPending: 17
  },
  {
    id: '3',
    folioNumber: 'FNH192',
    guestName: 'Mr. Huzaifa Ramalawala',
    reservationNumber: '192',
    roomNumber: '301',
    roomType: 'Suite',
    checkInDate: '2024-01-15',
    checkOutDate: '2024-01-16',
    totalCharges: 2016.00,
    totalPayments: 0.00,
    balance: 2016.00,
    status: 'Pending',
    lastActivity: '2024-01-16',
    daysPending: 19
  },
  {
    id: '4',
    folioNumber: 'FNH167',
    guestName: 'Mr. Kunal Patil',
    reservationNumber: '171',
    roomNumber: '102',
    roomType: 'Deluxe Room',
    checkInDate: '2024-01-05',
    checkOutDate: '2024-01-06',
    totalCharges: 2016.00,
    totalPayments: 0.00,
    balance: 2016.00,
    status: 'Disputed',
    lastActivity: '2024-01-06',
    daysPending: 29
  }
])

// Table columns configuration
const columns = computed(() => [
  { key: 'folioNumber', label: t('unsettledFolios.columns.folioNumber'), type: 'text' as const },
  { key: 'guestName', label: t('unsettledFolios.columns.guestName'), type: 'custom' as const },
  { key: 'roomNumber', label: t('unsettledFolios.columns.roomNumber'), type: 'text' as const },
  { key: 'roomType', label: t('unsettledFolios.columns.roomType'), type: 'text' as const },
  { key: 'checkOutDate', label: t('unsettledFolios.columns.checkOutDate'), type: 'date' as const },
  { key: 'totalCharges', label: t('unsettledFolios.columns.totalCharges'), type: 'text' as const },
  { key: 'balance', label: t('unsettledFolios.columns.balance'), type: 'custom' as const },
  { key: 'status', label: t('unsettledFolios.columns.status'), type: 'custom' as const },
  { key: 'daysPending', label: t('unsettledFolios.columns.daysPending'), type: 'custom' as const }
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
    filtered = filtered.filter(folio => 
      folio.guestName.toLowerCase().includes(searchTerm) ||
      folio.folioNumber.toLowerCase().includes(searchTerm) ||
      folio.reservationNumber.toLowerCase().includes(searchTerm)
    )
  }
  
  // Apply status filter
  if (currentFilters.value.status) {
    filtered = filtered.filter(folio => folio.status === currentFilters.value.status)
  }
  
  // Apply room type filter
  if (currentFilters.value.roomType) {
    filtered = filtered.filter(folio => folio.roomType === currentFilters.value.roomType)
  }
  
  // Apply balance range filter
  if (currentFilters.value.minBalance) {
    const minBalance = parseFloat(currentFilters.value.minBalance)
    filtered = filtered.filter(folio => folio.balance >= minBalance)
  }
  
  if (currentFilters.value.maxBalance) {
    const maxBalance = parseFloat(currentFilters.value.maxBalance)
    filtered = filtered.filter(folio => folio.balance <= maxBalance)
  }
  
  // Apply date range filter
  if (currentFilters.value.dateFrom) {
    filtered = filtered.filter(folio => folio.checkOutDate >= currentFilters.value.dateFrom)
  }
  
  if (currentFilters.value.dateTo) {
    filtered = filtered.filter(folio => folio.checkOutDate <= currentFilters.value.dateTo)
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

// Utility methods for styling
const getBalanceClass = (balance: number) => {
  if (balance > 2000) return 'text-red-600 dark:text-red-400'
  if (balance > 1000) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

const getStatusClass = (status: string) => {
  switch (status) {
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
})
</script>

<style scoped>
/* Add any custom styles here */
</style>