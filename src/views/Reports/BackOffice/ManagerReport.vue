<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Manager Report
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Daily financial summary and revenue breakdown
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Report Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Date
            </label>
            <InputDatepicker 
              v-model="filters.reportDate" 
              placeholder="Select date"
              class="w-full"
            />
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <SelectComponent 
              v-model="filters.currency"
              :options="currencyOptions"
              placeholder="Select currency"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 mt-6">
          <ButtonComponent 
            @click="generateReport"
            variant="primary"
            class="min-w-20"
          >
            Report
          </ButtonComponent>
          
          <ButtonComponent 
            @click="resetForm"
            variant="outline"
            class="min-w-20"
          >
            Reset
          </ButtonComponent>
        </div>
      </div>

      <!-- Results Report -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
              Manager Report
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <span><strong>As on Date:</strong> {{ filters.reportDate }}</span>
            <span><strong>PTD:</strong> {{ reportPeriods.ptd }}</span>
            <span><strong>YTD:</strong> {{ reportPeriods.ytd }}</span>
            <span><strong>Currency:</strong> {{ filters.currency }}</span>
          </div>
        </div>
        
        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable 
            title="Manager Report Details"
            :data="managerReportData"
            :columns="tableColumns"
            class="w-full mb-4 min-w-max"
          />
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

interface FilterOptions {
  value: string;
  label: string;
}

interface ReportItem {
  particular: string;
  today: number;
  ptd: number;
  ytd: number;
  isSubTotal?: boolean;
  isTotal?: boolean;
  isSection?: boolean;
  indent?: boolean;
}

interface Filters {
  reportDate: string;
  currency: string;
}

const hotelName = ref<string>('Hotel HuzzR')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  reportDate: '15/01/2025',
  currency: 'Rs'
})

const reportPeriods = ref({
  ptd: '01/01/2025',
  ytd: '25/04/2024'
})

// Currency options
const currencyOptions = ref<FilterOptions[]>([
  { value: 'Rs', label: 'Rs' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' }
])

// Report data structure matching the image
const reportData = ref<ReportItem[]>([
  // Room Charges
  { particular: 'Room Charges', today: 4600, ptd: 26333, ytd: 39335, isSection: true },
  { particular: 'Room Rates', today: 4600, ptd: 26333, ytd: 39335, indent: true },
  { particular: 'No Show Revenue', today: 5000, ptd: 10100, ytd: 12300, indent: true },
  { particular: 'Late Check-out Charges', today: 0, ptd: 500, ytd: 693, indent: true },
  { particular: 'Cancellation Premium', today: 399, ptd: 399, ytd: 1455, indent: true },
  { particular: 'Day Use Charges', today: 2250, ptd: 2250, ytd: 2333, indent: true },
  { particular: 'Total', today: 12249, ptd: 39622, ytd: 56116, isSubTotal: true },
  
  // Extra Charges
  { particular: 'Extra Charges', today: 0, ptd: 0, ytd: 0, isSection: true },
  { particular: 'Free Extra Bed', today: 132, ptd: 185, ytd: 0, indent: true },
  { particular: 'Banquet Sale', today: 0, ptd: 0, ytd: 10000, indent: true },
  { particular: 'Total', today: 132, ptd: 185, ytd: 10338, isSubTotal: true },
  
  // Adjustments
  { particular: 'Adjustments', today: 0, ptd: 0, ytd: 0, isSection: true },
  { particular: 'Adjustment', today: 0, ptd: 15, ytd: 15, indent: true },
  { particular: 'Total', today: 0, ptd: 15, ytd: 15, isSubTotal: true },
  
  // Tax
  { particular: 'Tax', today: 0, ptd: 0, ytd: 0, isSection: true },
  { particular: 'CGST', today: 1140, ptd: 1536, ytd: 2583, indent: true },
  { particular: 'SGST', today: 1140, ptd: 1536, ytd: 2583, indent: true },
  { particular: 'SST', today: 0, ptd: 7, ytd: 17, indent: true },
  { particular: 'Luxury Tax', today: 0, ptd: 3346, ytd: 4901, indent: true },
  { particular: 'CGST@2.5', today: 0, ptd: 0, ytd: 24, indent: true },
  { particular: 'SGST@2.5', today: 0, ptd: 0, ytd: 24, indent: true },
  { particular: 'Total', today: 2280, ptd: 6425, ytd: 10132, isSubTotal: true },
  
  // Summary Totals
  { particular: 'Total Revenue without Tax', today: 15381, ptd: 39762, ytd: 66391, isTotal: true },
  { particular: 'Total Revenue with Tax', today: 17667, ptd: 46187, ytd: 76483, isTotal: true },
  { particular: 'POS Net Tax Position', today: 0, ptd: 0, ytd: 0, isTotal: true },
  { particular: 'Transfer Charges to Guest Ledger', today: 17667, ptd: 46187, ytd: 76483, isTotal: true },
  
  // Payment
  { particular: 'Payment', today: 0, ptd: 0, ytd: 0, isSection: true },
  { particular: 'Cash', today: 0, ptd: 1495, ytd: 46516, indent: true },
  { particular: 'Total Payment', today: 0, ptd: 1495, ytd: 46516, isSubTotal: true }
])

// Computed properties for ResultTable
const tableColumns = computed(() => [
  { key: 'particular', label: 'Particulars' },
  { key: 'today', label: `Today (${filters.value.currency})` },
  { key: 'ptd', label: `PTD (${filters.value.currency})` },
  { key: 'ytd', label: `YTD (${filters.value.currency})` }
])

const managerReportData = computed(() => {
  return reportData.value.map(item => ({
    particular: item.indent ? `    ${item.particular}` : item.particular,
    today: formatAmount(item.today),
    ptd: formatAmount(item.ptd),
    ytd: formatAmount(item.ytd),
    _rowClass: item.isSection ? 'font-medium bg-gray-100 dark:bg-gray-600' : 
               item.isSubTotal ? 'font-semibold bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-500' :
               item.isTotal ? 'font-bold bg-blue-50 dark:bg-blue-900 border-t border-b border-blue-300 dark:border-blue-600' : ''
  }))
})

// Computed properties for ResultTable
const reportColumns = computed(() => [
  { key: 'particular', label: 'Particulars' },
  { key: 'today', label: `Today (${filters.value.currency})` },
  { key: 'ptd', label: `PTD (${filters.value.currency})` },
  { key: 'ytd', label: `YTD (${filters.value.currency})` }
])

const formattedReportData = computed(() => {
  return reportData.value.map(item => ({
    particular: item.indent ? `    ${item.particular}` : item.particular,
    today: formatAmount(item.today),
    ptd: formatAmount(item.ptd),
    ytd: formatAmount(item.ytd),
    _rowClass: item.isSection ? 'font-medium bg-gray-100 dark:bg-gray-600' : 
               item.isSubTotal ? 'font-semibold bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-500' :
               item.isTotal ? 'font-bold bg-blue-50 dark:bg-blue-900 border-t border-b border-blue-300 dark:border-blue-600' : ''
  }))
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating manager report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    reportDate: '',
    currency: 'Rs'
  }
  showResults.value = false
}

const formatAmount = (amount: number): string => {
  if (amount === 0) return '0'
  return amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  })
}
</script>

<style scoped>
/* Custom styles for the report table */
.table-row-border {
  border-top: 1px solid #e5e7eb;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .overflow-x-auto table {
    font-size: 0.75rem;
  }
  
  .px-4 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .py-3 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>