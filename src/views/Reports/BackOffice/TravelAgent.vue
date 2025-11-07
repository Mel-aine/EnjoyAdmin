<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          House Status
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View current room status and housekeeping information
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <InputDatepicker 
              v-model="filters.fromDate" 
              placeholder="01/03/2020"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.toDate" 
              placeholder="30/03/2020"
              class="w-full"
            />
          </div>
          <div></div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Report Template -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Template</label>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <SelectComponent 
                v-model="filters.reportTemplate"
                :options="reportTemplateOptions"
                placeholder="Default"
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
              variant="secondary"
              class="min-w-24 w-full sm:w-auto"
            >
              Export
            </ButtonComponent>
            
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

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Hotel Nihal
            </h2>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Travel Agent Commission Summary
            </h3>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span>From: {{ filters.fromDate || '01/03/2020' }} To: {{ filters.toDate || '30/03/2020' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Table using ResultTable component -->
        <div class="overflow-x-auto">
          <ResultTable 
            title="Travel Agent Commission Summary"
            :data="formattedCommissionData"
            :columns="commissionColumns"
            class="w-full mb-4 min-w-max"
          />
        </div>

        <!-- Summary Footer with totals -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div class="flex justify-between items-center">
            <div class="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Total Records: {{ commissionData.length }}</span>
              <span>Report Generated: {{ new Date().toLocaleDateString() }}</span>
            </div>
            <div class="flex gap-6 text-sm font-semibold text-gray-900 dark:text-white">
              <span>Total Room Revenue: {{ formatCurrency(totalRoomRevenue) }}</span>
              <span>Total Commission: {{ formatCurrency(totalCommissionAmount) }}</span>
            </div>
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
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface CommissionData {
  travelAgent: string;
  guestName: string;
  roomNo: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomRevenue: number;
  commissionPercent: number;
  commissionAmount: number;
}

interface Filters {
  fromDate: string;
  toDate: string;
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  fromDate: '01/03/2020',
  toDate: '30/03/2020',
  reportTemplate: 'default'
})

// Options for report template
const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: 'Default' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'summary', label: 'Summary' }
])

// Sample commission data
const commissionData = ref<CommissionData[]>([
  {
    travelAgent: 'ABC Travel Agency',
    guestName: 'Mr. John Smith',
    roomNo: '101',
    checkIn: '15/03/2020',
    checkOut: '18/03/2020',
    nights: 3,
    roomRevenue: 15000,
    commissionPercent: 10,
    commissionAmount: 1500
  },
  {
    travelAgent: 'XYZ Tours & Travels',
    guestName: 'Ms. Sarah Johnson',
    roomNo: '205',
    checkIn: '20/03/2020',
    checkOut: '25/03/2020',
    nights: 5,
    roomRevenue: 25000,
    commissionPercent: 12,
    commissionAmount: 3000
  },
  {
    travelAgent: 'Global Travel Solutions',
    guestName: 'Mr. Robert Brown',
    roomNo: '301',
    checkIn: '22/03/2020',
    checkOut: '24/03/2020',
    nights: 2,
    roomRevenue: 12000,
    commissionPercent: 8,
    commissionAmount: 960
  },
  {
    travelAgent: 'Premium Holidays',
    guestName: 'Mrs. Emily Davis',
    roomNo: '150',
    checkIn: '25/03/2020',
    checkOut: '30/03/2020',
    nights: 5,
    roomRevenue: 30000,
    commissionPercent: 15,
    commissionAmount: 4500
  }
])

// Columns definition for ResultTable
const commissionColumns = computed(() => [
  { key: 'serialNumber', label: 'S.N.' },
  { key: 'travelAgent', label: 'Travel Agent' },
  { key: 'guestName', label: 'Guest Name' },
  { key: 'roomNo', label: 'Room No.' },
  { key: 'checkIn', label: 'Check-In' },
  { key: 'checkOut', label: 'Check-Out' },
  { key: 'nights', label: 'Nights' },
  { key: 'roomRevenue', label: 'Room Revenue' },
  { key: 'commissionPercent', label: 'Commission %' },
  { key: 'commissionAmount', label: 'Commission Amount' }
])

// Formatted data for ResultTable
const formattedCommissionData = computed(() => {
  return commissionData.value.map((item, index) => ({
    serialNumber: (index + 1).toString(),
    travelAgent: item.travelAgent,
    guestName: item.guestName,
    roomNo: item.roomNo,
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    nights: item.nights.toString(),
    roomRevenue: formatCurrency(item.roomRevenue),
    commissionPercent: `${item.commissionPercent}%`,
    commissionAmount: formatCurrency(item.commissionAmount)
  }))
})
const totalRoomRevenue = computed(() => {
  return commissionData.value.reduce((sum, item) => sum + item.roomRevenue, 0)
})

const totalCommissionAmount = computed(() => {
  return commissionData.value.reduce((sum, item) => sum + item.commissionAmount, 0)
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating travel agent commission report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    fromDate: '',
    toDate: '',
    reportTemplate: 'default'
  }
  showResults.value = false
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const editTemplate = (): void => {
  console.log('Editing template...')
}
</script>

<style scoped>
/* Custom styles for the commission report */
.border-pink-400 {
  border-color: #f472b6;
}

.border-pink-500 {
  border-color: #ec4899;
}

/* Table styling */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th:last-child,
td:last-child {
  border-right: none;
}

/* Responsive table */
@media (max-width: 768px) {
  .overflow-x-auto table {
    min-width: 1000px;
  }
}

/* Header styling */
.bg-blue-600 th {
  position: relative;
}

.bg-blue-600 th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.3);
}

/* Row hover effects */
tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Total row styling */
.bg-blue-50 {
  background-color: rgba(59, 130, 246, 0.1);
}

.dark .bg-blue-50 {
  background-color: rgba(59, 130, 246, 0.2);
}
</style>