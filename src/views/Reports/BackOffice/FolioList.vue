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
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date Type Selection -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.folio.dateType') }}
            </label>
            <div class="flex gap-4">
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

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.from') }}
            </label>
            <input 
              v-model="filters.dateFrom" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.to') }}
            </label>
            <input 
              v-model="filters.dateTo" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Business Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('business_source') }}
            </label>
            <select 
              v-model="filters.businessSource"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ t('SelectBusinessSource') }}</option>
              <option v-for="source in BusinessSource" :key="source.id" :value="source.name">
                {{ source.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Status -->
          <div class="md:col-span-3">
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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Include Options -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.folio.include') }}
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
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
        </div>

        <!-- Error Message - Only show for actual errors, not for no data -->
        <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ml-auto">
            <ButtonComponent @click="exportData" variant="secondary" class="min-w-24 w-full sm:w-auto"
              :disabled="!showResults || loading">
              {{ t('common.export') }}
            </ButtonComponent>

            <ButtonComponent @click="generateReport" variant="primary" class="min-w-24 w-full sm:w-auto"
              :disabled="loading || !filters.dateFrom || !filters.dateTo">
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </span>
              {{ loading ? t('common.generating') : t('common.report') }}
            </ButtonComponent>

            <ButtonComponent @click="resetForm" variant="outline" class="min-w-24 w-full sm:w-auto">
              {{ t('common.reset') }}
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('reports.folio.folioListResults') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> •
            <span>{{ t('common.dateFrom') }}: {{ filters.dateFrom }} {{ t('common.to') }} {{ filters.dateTo }}</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <ResultTable 
            :title="t('reports.folio.folioListResults')" 
            :data="folioData" 
            :columns="selectedTableColumns"
            :show-header="false"
            :loading="loading"
            :empty-message="folioData.length === 0 && !loading ? t('reports.noDataAvailable') : ''"
            class="w-full mb-4 min-w-max" 
          />
        </div>

        <!-- Total Row - Only show if there's data -->
        <div v-if="reportTotals && folioData.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ t('reports.folio.totalFolios') }}: {{ reportTotals.totalFolios }}</div>
            <div>{{ t('reports.folio.totalCharges') }}: {{ reportTotals.totalChargeAmount }} {{ currency }}</div>
            <div>{{ t('reports.folio.totalTax') }}: {{ reportTotals.totalTaxAmount }} {{ currency }}</div>
            <div>{{ t('reports.folio.totalCredit') }}: {{ reportTotals.totalCreditAmount }} {{ currency }}</div>
            <div>{{ t('reports.folio.totalBalance') }}: {{ reportTotals.totalBalance }} {{ currency }}</div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { getFolioListReport } from '@/services/reportsApi'

const { t } = useI18n();
const serviceStore = useServiceStore()
const businessSourcesLo = ref<any>([...serviceStore.businessSources])
const BusinessSource = computed(() => businessSourcesLo.value || [])

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
    all: boolean;
    reserved: boolean;
    cancelled: boolean;
    noShow: boolean;
    checkedIn: boolean;
    checkedOut: boolean;
    void: boolean;
    unconfirmedReservation: boolean;
  };
  hotelId?: string;
}

const hotelName = ref<string>('Hotel Name')
const showResults = ref<boolean>(false)
const currency = ref<string>('USD')
const loading = ref<boolean>(false)
const error = ref<string>('')
const exportMenuOpen = ref<boolean>(false)
const exportLoading = ref<boolean>(false)

const filters = ref<Filters>({
  dateType: 'transaction',
  dateFrom: '',
  dateTo: '',
  status: {
    paid: true,
    unpaid: true
  },
  businessSource: '',
  include: {
    all: true,
    reserved: true,
    cancelled: true,
    noShow: true,
    checkedIn: true,
    checkedOut: true,
    void: true,
    unconfirmedReservation: true
  },
})

const folioData = ref<FolioData[]>([])
const reportTotals = ref<ReportTotals | null>(null)

// Computed properties
const selectedTableColumns = computed(() => [
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
  error.value = ''  // Clear any previous errors
  showResults.value = false
  
  try {
    // Préparer les paramètres selon ce que le contrôleur attend
    const params = {
      dateType: filters.value.dateType,
      dateFrom: filters.value.dateFrom,
      dateTo: filters.value.dateTo,
      status: filters.value.status,
      businessSource: filters.value.businessSource,
      include: filters.value.include,
      hotelId: useServiceStore().serviceId // Si vous avez un hotelId
    }

    console.log('Generating folio list report with params:', params)

    const response = await getFolioListReport(params)
    console.log('Folio list report response:', response)
    
    if (response && response.data && response.success) {
      // Mapper les données du backend vers le format attendu par le frontend
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
      
      // Ne pas afficher d'erreur s'il n'y a simplement pas de données
      // Le tableau vide sera affiché avec le message "no data available"
      
    } else if (response && response.data) {
      // Seulement afficher une erreur si c'est une vraie erreur du serveur
      if (response.data.message && !response.data.message.includes('no data') && !response.data.message.includes('aucune donnée')) {
        error.value = response.data.message
      }
      folioData.value = []
      reportTotals.value = null
      showResults.value = true  // Montrer les résultats même si vides
    }
  } catch (err) {
    console.error('Error fetching folio list:', err)
    // Seulement afficher une erreur pour les vraies erreurs réseau/serveur
    error.value = t('errors.failedToLoadData')
    folioData.value = []
    reportTotals.value = null
    showResults.value = false  // Ne pas montrer les résultats en cas d'erreur réseau
  } finally {
    loading.value = false
  }
}

const exportData = async (): Promise<void> => {
  // Implémentation de l'export (CSV par défaut)
  if (folioData.value.length === 0) return
  
  try {
    exportLoading.value = true
    
    // Créer les données CSV
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
    dateFrom: '',
    dateTo: '',
    status: {
      paid: true,
      unpaid: true
    },
    businessSource: '',
    include: {
      reserved: false,
      cancelled: false,
      noShow: false,
      checkedIn: false,
      checkedOut: false,
      void: false,
      unconfirmedReservation: false
    },
  }
  showResults.value = false
  folioData.value = []
  reportTotals.value = null
  error.value = ''
}

const handleAllChange = (): void => {
  if (filters.value.include.all) {
    // Si "All" est coché, cocher toutes les options
    filters.value.include.reserved = true
    filters.value.include.cancelled = true
    filters.value.include.noShow = true
    filters.value.include.checkedIn = true
    filters.value.include.checkedOut = true
    filters.value.include.void = true
    filters.value.include.unconfirmedReservation = true
  }
}

// Initialiser les dates par défaut
onMounted(() => {
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  filters.value.dateTo = today.toISOString().split('T')[0]
  filters.value.dateFrom = weekAgo.toISOString().split('T')[0]
})
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-col>div {
    width: 100%;
  }

  .flex-col>div+div {
    margin-top: 1rem;
  }

  .items-end {
    align-items: stretch;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-2.md\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-cols-2.md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Styles pour les boutons d'export */
.export-button {
  transition: all 0.2s ease-in-out;
}

.export-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.export-button:active {
  transform: translateY(0);
}
</style>