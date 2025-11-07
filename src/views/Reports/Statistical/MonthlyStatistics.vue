<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.statistical.monthlyStatistics') }}
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Select Year -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.selectYear') }}
            </label>
            <SelectComponent 
              v-model="filters.year" 
              :options="yearOptions"
              :placeholder="t('common.selectYear')"
              class="w-full"
            />
          </div>
          
          <!-- Select Month -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.selectMonth') }}
            </label>
            <SelectComponent 
              v-model="filters.month" 
              :options="monthOptions"
              :placeholder="t('common.selectMonth')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Show Unposted Inclusions Charges -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.showUnpostedCharges" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ t('reports.statistical.showUnpostedInclusionsCharges') }}
            </label>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Report Template -->
<!--           <div class="flex items-center gap-3 w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Template</label>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <SelectComponent 
                v-model="filters.reportTemplate"
                :options="reportTemplateOptions"
                :placeholder="'--Select--'"
                class="min-w-32 w-full sm:w-auto"
              />
              <button 
                @click="editTemplate"
                class="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Edit Template"
              >
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            </div>
          </div>
 -->
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ButtonComponent 
              @click="generateReport"
              variant=""
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
               <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('common.report') }}
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ t('common.reset') }}
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
              {{ t('reports.statistical.monthlyStatistics') }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ t('common.month') }} {{ getMonthName(filters.month) }} {{ filters.year }}</span> • 
            <span>{{ t('reports.statistical.showUnpostedInclusionsCharges') }}: {{ filters.showUnpostedCharges ? t('common.yes') : t('common.no') }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            :title="t('reports.statistical.monthlyStatistics')"
            :data="monthlyStatsData"
            :columns="monthlyStatsColumns"
            :show-header=false
            class="w-full mb-4 min-w-max"
          />
        </div>

        <!-- Summary Row -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ t('reports.statistical.totalDays') }}: {{ totalDays }}</div>
            <div>{{ t('reports.totalRevenue') }}: {{ formatCurrency(totalRevenue) }}</div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import { useServiceStore } from '../../../composables/serviceStore'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface MonthlyStats {
  date: string;
  availableRooms: number;
  nightSold: number;
  complimentary: number;
  occ: number;
  adr: number;
  revPar: number;
  pax: number;
  roomCharges: number;
  extraCharges: number;
  tax: number;
  receipt: number;
  expense: number;
}

interface Filters {
  year: string;
  month: string;
  showUnpostedCharges: boolean;
  reportTemplate: string;
}


const hotelName = computed(() => {
  return useServiceStore().getCurrentService?.hotelName
})
const showResults = ref<boolean>(false)
const loading = ref<boolean>(false)

const filters = ref<Filters>({
  year: '2022',
  month: '01', // January
  showUnpostedCharges: false,
  reportTemplate: ''
})

// Options for selects
const yearOptions = ref<FilterOptions[]>([
  { value: '2020', label: '2020' },
  { value: '2021', label: '2021' },
  { value: '2022', label: '2022' },
  { value: '2023', label: '2023' },
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' }
])

const monthOptions = computed<FilterOptions[]>(() => [
  { value: '01', label: t('common.months.january') },
  { value: '02', label: t('common.months.february') },
  { value: '03', label: t('common.months.march') },
  { value: '04', label: t('common.months.april') },
  { value: '05', label: t('common.months.may') },
  { value: '06', label: t('common.months.june') },
  { value: '07', label: t('common.months.july') },
  { value: '08', label: t('common.months.august') },
  { value: '09', label: t('common.months.september') },
  { value: '10', label: t('common.months.october') },
  { value: '11', label: t('common.months.november') },
  { value: '12', label: t('common.months.december') }
])

const reportTemplateOptions = computed<FilterOptions[]>(() => [
  { value: 'default', label: t('common.reportTemplates.default') },
  { value: 'detailed', label: t('common.reportTemplates.detailed') },
  { value: 'summary', label: t('common.reportTemplates.summary') },
  { value: 'financial', label: t('common.reportTemplates.financial') },
  { value: 'custom', label: t('common.reportTemplates.custom') }
])

// Sample data for monthly statistics (based on the image)
const monthlyStatsData = ref<MonthlyStats[]>([
  {
    date: '1 Sat',
    availableRooms: 47,
    nightSold: 4,
    complimentary: 0,
    occ: 8.51,
    adr: 0.00,
    revPar: 0.00,
    pax: 5,
    roomCharges: 0.00,
    extraCharges: 21750.00,
    tax: 1225.72,
    receipt: 125500.00,
    expense: 0.00
  },
  {
    date: '2 Sun',
    availableRooms: 47,
    nightSold: 4,
    complimentary: 0,
    occ: 8.51,
    adr: 0.00,
    revPar: 0.00,
    pax: 5,
    roomCharges: 0.00,
    extraCharges: 20500.00,
    tax: 1225.72,
    receipt: 1005.00,
    expense: 1000.00
  },
  {
    date: '3 Mon',
    availableRooms: 47,
    nightSold: 5,
    complimentary: 0,
    occ: 10.64,
    adr: 0.00,
    revPar: 0.00,
    pax: 8,
    roomCharges: 0.00,
    extraCharges: 26050.00,
    tax: 1705.72,
    receipt: 13700.00,
    expense: 0.00
  },
  {
    date: '4 Tue',
    availableRooms: 47,
    nightSold: 2,
    complimentary: 0,
    occ: 4.26,
    adr: 0.00,
    revPar: 0.00,
    pax: 4,
    roomCharges: 0.00,
    extraCharges: 6250.00,
    tax: 1045.72,
    receipt: 52490.00,
    expense: 0.00
  },
  {
    date: '5 Wed',
    availableRooms: 47,
    nightSold: 2,
    complimentary: 0,
    occ: 4.26,
    adr: 0.00,
    revPar: 0.00,
    pax: 3,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 715.72,
    receipt: 3180.00,
    expense: 0.00
  },
  {
    date: '6 Thu',
    availableRooms: 48,
    nightSold: 2,
    complimentary: 0,
    occ: 4.17,
    adr: 0.00,
    revPar: 0.00,
    pax: 3,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 715.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '7 Fri',
    availableRooms: 48,
    nightSold: 2,
    complimentary: 0,
    occ: 4.17,
    adr: 0.00,
    revPar: 0.00,
    pax: 3,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 715.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '8 Sat',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '9 Sun',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '10 Mon',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '11 Tue',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '12 Wed',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '13 Thu',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '14 Fri',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '15 Sat',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  },
  {
    date: '16 Sun',
    availableRooms: 48,
    nightSold: 1,
    complimentary: 0,
    occ: 2.08,
    adr: 0.00,
    revPar: 0.00,
    pax: 2,
    roomCharges: 0.00,
    extraCharges: 0.00,
    tax: 535.72,
    receipt: 0.00,
    expense: 0.00
  }
])

// Table columns for monthly statistics
const monthlyStatsColumns = computed(() => [
  { key: 'date', label: t('common.date') },
  { key: 'availableRooms', label: t('common.availableRooms') },
  { key: 'nightSold', label: t('reports.statistical.nightSold') },
  { key: 'complimentary', label: t('reports.statistical.complimentary') },
  { key: 'occ', label: t('common.occupancyRate') + ' %' },
  { key: 'adr', label: t('common.adr') },
  { key: 'revPar', label: t('common.revpar') },
  { key: 'pax', label: t('common.pax') },
  { key: 'roomCharges', label: t('common.roomCharges') },
  { key: 'extraCharges', label: t('reports.statistical.extraCharges') },
  { key: 'tax', label: t('common.tax') },
  { key: 'receipt', label: t('reports.statistical.receipt') },
  { key: 'expense', label: t('common.expenses') }
])

// Computed properties
const totalDays = computed(() => {
  return monthlyStatsData.value.length
})

const totalRevenue = computed(() => {
  return monthlyStatsData.value.reduce((total, day) => {
    return total + day.receipt + day.extraCharges
  }, 0)
})

// Helper methods
const getMonthName = (monthValue: string): string => {
  const month = monthOptions.value.find(m => m.value === monthValue)
  return month ? month.label : ''
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating monthly statistics report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    year: '2022',
    month: '01',
    showUnpostedCharges: false,
    reportTemplate: ''
  }
  showResults.value = false
}

const editTemplate = (): void => {
  console.log('Editing template...')
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-col > div {
    width: 100%;
  }
  
  .flex-col > div + div {
    margin-top: 1rem;
  }
  
  .items-end {
    align-items: stretch;
  }
}

/* Table styling to match the image */
:deep(.table) {
  font-family: 'Arial', sans-serif;
  font-size: 12px;
}

:deep(.table th) {
  background-color: #f8f9fa;
  font-weight: 600;
  text-align: center;
  padding: 8px 4px;
  border: 1px solid #dee2e6;
}

:deep(.table td) {
  text-align: center;
  padding: 6px 4px;
  border: 1px solid #dee2e6;
}

:deep(.table td:first-child) {
  text-align: left;
  font-weight: 500;
}
</style>