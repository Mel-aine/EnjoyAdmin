<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Monthly Statistics
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Select Year -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Year
            </label>
            <SelectComponent 
              v-model="filters.year" 
              :options="yearOptions"
              :placeholder="'Select Year'"
              class="w-full"
            />
          </div>
          
          <!-- Select Month -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Month
            </label>
            <SelectComponent 
              v-model="filters.month" 
              :options="monthOptions"
              :placeholder="'Select Month'"
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
              Show Unposted Inclusions Charges
            </label>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Report Template -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
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

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ButtonComponent 
              @click="generateReport"
              variant="primary"
              class="min-w-24 w-full sm:w-auto"
            >
              Report
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="min-w-24 w-full sm:w-auto"
            >
              Reset
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
              Monthly Statistics
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>Month {{ getMonthName(filters.month) }} {{ filters.year }}</span> • 
            <span>Show Unposted Inclusions Charges: {{ filters.showUnpostedCharges ? 'Yes' : 'No' }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            :title="'Monthly Statistics'"
            :data="monthlyStatsData"
            :columns="monthlyStatsColumns"
            class="w-full mb-4 min-w-max"
          />
        </div>

        <!-- Summary Row -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>Total Days: {{ totalDays }}</div>
            <div>Total Revenue: {{ formatCurrency(totalRevenue) }}</div>
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

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


const hotelName = ref<string>('HOTEL HARDIK')
const showResults = ref<boolean>(false)

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

const monthOptions = ref<FilterOptions[]>([
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: 'Default' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'summary', label: 'Summary' },
  { value: 'financial', label: 'Financial' },
  { value: 'custom', label: 'Custom' }
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
  { key: 'date', label: 'Date' },
  { key: 'availableRooms', label: 'Available Rooms' },
  { key: 'nightSold', label: 'Night Sold' },
  { key: 'complimentary', label: 'Complimentary' },
  { key: 'occ', label: 'Occ %' },
  { key: 'adr', label: 'ADR' },
  { key: 'revPar', label: 'Rev Par' },
  { key: 'pax', label: 'Pax' },
  { key: 'roomCharges', label: 'Room Charges' },
  { key: 'extraCharges', label: 'Extra Charges' },
  { key: 'tax', label: 'Tax' },
  { key: 'receipt', label: 'Receipt' },
  { key: 'expense', label: 'Expense' }
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