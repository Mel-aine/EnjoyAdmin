<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.folio.folioList') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage guest folio information
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Date Type Selection -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.folio.dateType') }}
            </label>
            <div class="flex gap-4 flex-wrap">
              <label class="flex items-center gap-2">
                <input v-model="filters.dateType" type="radio" value="transaction" class="text-blue-600" />
                {{ t('reports.folio.transaction') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.dateType" type="radio" value="arrival" class="text-blue-600" />
                {{ t('reports.folio.arrival') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.dateType" type="radio" value="departure" class="text-blue-600" />
                {{ t('reports.folio.departure') }}
              </label>
            </div>
          </div>

          <!-- Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.from') }}
            </label>
            <InputDatepicker v-model="filters.dateFrom" placeholder="From" class="w-full" />
          </div>

          <!-- Date To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.to') }}
            </label>
            <InputDatepicker v-model="filters.dateTo" placeholder="To" class="w-full" />
          </div>

          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('business_source') }}
            </label>
            <SelectComponent v-model="filters.businessSource" :options="businessSourceOptions" placeholder="Select Business Source..." class="w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.status') }}
            </label>
            <div class="flex gap-4 flex-wrap">
              <label class="flex items-center gap-2">
                <input v-model="filters.status.paid" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.paid') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.status.unpaid" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.unpaid') }}
              </label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <!-- Include Options -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.folio.include') }}
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              <label class="flex items-center gap-2">
                <input v-model="filters.include.reserved" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.reserved') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.cancelled" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.cancelled') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.noShow" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.noShow') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.checkedIn" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.checkedIn') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.checkedOut" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.checkedOut') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.void" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.void') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.unconfirmedReservation" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.unconfirmedReservation') }}
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 items-end mt-4">
            <div class="relative">
              <button
                @click="exportData"
                :disabled="!showResults || exportLoading"
                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
              >
                <span v-if="!exportLoading">{{ t('common.export') }}</span>
                <svg v-if="exportLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>

            <div class="relative">
              <button
                @click="generateReport"
                :disabled="loading || !filters.dateFrom || !filters.dateTo"
                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
              >
                <span v-if="!loading">{{ t('common.report') }}</span>
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>

            <div class="relative">
              <button
                @click="resetForm"
                class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
              >
                {{ t('common.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {{ t('reports.folio.folioListResults') }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>{{ t('common.dateFrom') }}:</strong> {{ filters.dateFrom }} <strong>{{ t('common.to') }}:</strong> {{ filters.dateTo }}</span>
          </div>
        </div>

        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable 
            :title="t('reports.folio.folioListResults')" 
            :data="folioData" 
            :columns="selectedTableColumns"
            :loading="loading"
            :empty-message="folioData?.length === 0 && !loading ? t('reports.noDataAvailable') : ''"
            :show-header="false"
            class="w-full mb-4 min-w-max" 
          />
        </div>

        <!-- Total Row -->
        <div v-if="reportTotals && folioData?.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-medium text-gray-900 dark:text-white">
            <div>{{ t('reports.folio.totalFolios') }}: {{ reportTotals?.totalFolios || 0 }}</div>
            <div>{{ t('reports.folio.totalCharges') }}: {{ reportTotals?.totalChargeAmount || 0 }} {{'XAF' }}</div>
            <div>{{ t('reports.folio.totalTax') }}: {{ reportTotals?.totalTaxAmount || 0 }} {{  'XAF' }}</div>
            <div>{{ t('reports.folio.totalCredit') }}: {{ reportTotals?.totalCreditAmount || 0 }} {{  'XAF' }}</div>
            <div>{{ t('reports.folio.totalBalance') }}: {{ reportTotals?.totalBalance || 0 }} {{  'XAF' }}</div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import Spinner from '../../../components/spinner/Spinner.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { getFolioListReport } from '@/services/reportsApi'
import type { Column } from '../../../utils/models'

const { t } = useI18n();
const serviceStore = useServiceStore()

interface FilterOptions {
  value: string;
  label: string;
}

interface FolioData {
  folioNo: string;
  invoiceNo: string;
  date: string;
  pax: number;
  name: string;
  status: string;
  chargeAmount: string;
  taxAmount: string;
  creditAmount: string;
  balanceAmount: string;
}

interface ReportTotals {
  totalFolios: number;
  totalChargeAmount: string;
  totalTaxAmount: string;
  totalCreditAmount: string;
  totalBalance: string;
}

interface Filters {
  dateType: string;
  dateFrom: string;
  dateTo: string;
  status: {
    paid: boolean;
    unpaid: boolean;
  };
  businessSource: string;
  include: {
    reserved: boolean;
    cancelled: boolean;
    noShow: boolean;
    checkedIn: boolean;
    checkedOut: boolean;
    void: boolean;
    unconfirmedReservation: boolean;
  };
}

// Set default dates to today
const today = new Date().toISOString().split('T')[0]

const filters = ref<Filters>({
  dateType: 'transaction',
  dateFrom: today,
  dateTo: today,
  status: {
    paid: true,
    unpaid: true
  },
  businessSource: '',
  include: {
    reserved: true,
    cancelled: true,
    noShow: true,
    checkedIn: true,
    checkedOut: true,
    void: true,
    unconfirmedReservation: true
  },
})

// State
const loading = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
const showResults = ref<boolean>(false)
const error = ref<string>('')
const currency = ref<string>('USD')
const folioData = ref<FolioData[]>([])
const reportTotals = ref<ReportTotals | null>(null)

// Options for selects
const businessSourceOptions = computed(() => {
  const options = [{ value: '', label: 'All' }]
  const sources = serviceStore.businessSources || []
  if (Array.isArray(sources)) {
    sources.forEach((source: any) => {
      if (source && source.name) {
        options.push({ value: source.name, label: source.name })
      }
    })
  }
  return options
})

// Computed properties
const hotelName = computed(() => {
  return useServiceStore().getCurrentService?.hotelName || 'Hotel'
})

const selectedTableColumns = computed<Column[]>(() => [
  { key: 'folioNo', label: t('reports.folio.folioNo'), type: 'text' },
  { key: 'invoiceNo', label: t('reports.folio.invoiceNo'), type: 'text' },
  { key: 'date', label: t('common.date'), type: 'date' },
  { key: 'pax', label: t('reports.folio.pax'), type: 'text' },
  { key: 'name', label: t('common.name'), type: 'text' },
  { key: 'status', label: t('common.status'), type: 'badge' },
  { key: 'chargeAmount', label: t('reports.folio.chargeAmount'), type: 'text' },
  { key: 'taxAmount', label: t('reports.folio.taxAmount'), type: 'text' },
  { key: 'creditAmount', label: t('reports.folio.creditAmount'), type: 'text' },
  { key: 'balanceAmount', label: t('reports.folio.balanceAmount'), type: 'text' }
])

// Methods
const generateReport = async (): Promise<void> => {
  if (!filters.value.dateFrom || !filters.value.dateTo) {
    error.value = t('validation.dateRangeRequired')
    return
  }

  loading.value = true
  error.value = ''
  showResults.value = false
  
  try {
    const params = {
      dateType: filters.value.dateType,
      dateFrom: filters.value.dateFrom,
      dateTo: filters.value.dateTo,
      status: filters.value.status,
      businessSource: filters.value.businessSource,
      include: filters.value.include,
      hotelId: useServiceStore().serviceId
    }

    console.log('Generating folio list report with params:', params)

    const response = await getFolioListReport(params)
    console.log('Folio list report response:', response)
    
    if (response && response.data && response.success) {
      const folios = response.data.folios || []
      folioData.value = folios.map((folio: any) => ({
        folioNo: folio.folioNo,
        invoiceNo: folio.invoiceNo || 'N/A',
        date: folio.date,
        pax: folio.pax,
        name: folio.name,
        status: folio.status,
        chargeAmount: folio.chargeAmount,
        taxAmount: folio.taxAmount,
        creditAmount: folio.creditAmount,
        balanceAmount: folio.balanceAmount
      }))

      reportTotals.value = response.data.totals
      showResults.value = true
      
    } else if (response && response.data) {
      if (response.data.message && !response.data.message.includes('no data') && !response.data.message.includes('aucune donnée')) {
        error.value = response.data.message
      }
      folioData.value = []
      reportTotals.value = null
      showResults.value = true
    }
  } catch (err) {
    console.error('Error fetching folio list:', err)
    error.value = t('anErrorOcurr')
    folioData.value = []
    reportTotals.value = null
    showResults.value = false
  } finally {
    loading.value = false
  }
}

const exportData = async (): Promise<void> => {
  if (!folioData.value || folioData.value.length === 0) return
  exportLoading.value = true
  error.value = ''
  try {
    const headers = selectedTableColumns.value.map(col => col.label).join(',')
    const rows = folioData.value.map(folio => 
      selectedTableColumns.value.map(col => {
        const value = folio[col.key as keyof FolioData]
        return `"${value || ''}"`
      }).join(',')
    ).join('\n')
    
    const csvContent = `${headers}\n${rows}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `folio-list-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('CSV exported successfully')
  } catch (error) {
    console.error('Error exporting CSV:', error)
  } finally {
    exportLoading.value = false
  }
}

const resetForm = (): void => {
  filters.value = {
    dateType: 'transaction',
    dateFrom: today,
    dateTo: today,
    status: {
      paid: true,
      unpaid: true
    },
    businessSource: '',
    include: {
      reserved: true,
      cancelled: true,
      noShow: true,
      checkedIn: true,
      checkedOut: true,
      void: true,
      unconfirmedReservation: true
    },
  }
  showResults.value = false
  folioData.value = []
  reportTotals.value = null
  error.value = ''
}

// Initialize default dates
onMounted(() => {
  const todayDate = new Date()
  const weekAgo = new Date(todayDate)
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  filters.value.dateTo = todayDate.toISOString().split('T')[0]
  filters.value.dateFrom = weekAgo.toISOString().split('T')[0]
})
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .grid-cols-2.md\:grid-cols-4.lg\:grid-cols-7 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .grid-cols-2.md\:grid-cols-4.lg\:grid-cols-7 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .grid-cols-2.md\:grid-cols-4.lg\:grid-cols-7 {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}
</style>