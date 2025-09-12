<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Revenue
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and analyze daily revenue data for your hotel
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- As On Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              As On Date
            </label>
            <InputDatepicker 
              v-model="filters.asOnDate" 
              placeholder="Select date"
              class="w-full"
            />
          </div>

          <!-- Daily Revenue By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Revenue By
            </label>
            <SelectComponent 
              v-model="filters.dailyRevenueBy"
              :options="revenueByOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>

          <!-- Report Template -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Template
            </label>
            <SelectComponent 
              v-model="filters.reportTemplate"
              :options="reportTemplateOptions"
              placeholder="Default"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <ButtonComponent 
            @click="resetForm"
            variant="outline"
            class="min-w-24"
          >
            Reset
          </ButtonComponent>
          
          <ButtonComponent 
            @click="generateReport"
            variant="primary"
            class="min-w-24"
          >
            Report
          </ButtonComponent>
        </div>

        <!-- Help Guide -->
        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Help Guide</h3>
          <p class="text-blue-800 dark:text-blue-200 text-sm mb-3">
            This report will give you revenue of specific posting date for selected revenue account.
          </p>
          
          <div class="text-sm text-blue-800 dark:text-blue-200">
            <h4 class="font-semibold mb-2">How can you compare the report data with other reports?</h4>
            <div class="space-y-2">
              <p><strong>1)</strong> Daily Revenue pulled out for some specific date. Its Room Charges column total can be matched with Manager or Weekly Manager Report for same date.</p>
              <p><strong>2)</strong> Daily Revenue pulled out for some specific date. Its Room Charges, Discount and Round Off summation can be matched with Monthly Revenue Report.</p>
              <p><strong>3)</strong> Daily Revenue report when pulled out by Cancellation Revenue can be matched with Cancelled Reservation report.</p>
              <p><strong>4)</strong> Daily Revenue report when pulled out by No show Revenue can be matched with No show Reservation report.</p>
              <p><strong>5)</strong> Daily Revenue pulled out for Room Charges summation can be matched with Revenue By Rate Type report.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Revenue Report
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> • 
            <span>Report Date: {{ filters.asOnDate }}</span> • 
            <span>Revenue By: {{ getRevenueByLabel(filters.dailyRevenueBy) }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            title="Daily Revenue Report"
            :data="revenueData"
            :columns="tableColumns"
            class="w-full"
          />
        </div>
        
        <!-- Summary -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Total Room Revenue:</span>
              <span class="ml-2 font-bold text-green-600 dark:text-green-400">Rs {{ totalRoomRevenue.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Total F&B Revenue:</span>
              <span class="ml-2 font-bold text-blue-600 dark:text-blue-400">Rs {{ totalFBRevenue.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Total Other Revenue:</span>
              <span class="ml-2 font-bold text-purple-600 dark:text-purple-400">Rs {{ totalOtherRevenue.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Grand Total:</span>
              <span class="ml-2 font-bold text-gray-900 dark:text-white text-lg">Rs {{ grandTotal.toLocaleString() }}</span>
            </div>
          </div>
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
import type { Column } from '../../../utils/models'

interface FilterOptions {
  value: string;
  label: string;
}

interface RevenueData {
  revenueAccount: string;
  description: string;
  roomCharges: number;
  foodBeverage: number;
  telephone: number;
  laundry: number;
  miscellaneous: number;
  extraBed: number;
  discount: number;
  roundOff: number;
  total: number;
  percentage: number;
}

interface Filters {
  asOnDate: string;
  dailyRevenueBy: string;
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  asOnDate: '20/09/2021',
  dailyRevenueBy: '',
  reportTemplate: 'default'
})

// Options for selects
const revenueByOptions = ref<FilterOptions[]>([
  { value: 'room_type', label: 'Room Type' },
  { value: 'rate_type', label: 'Rate Type' },
  { value: 'market_code', label: 'Market Code' },
  { value: 'business_source', label: 'Business Source' },
  { value: 'company', label: 'Company' },
  { value: 'travel_agent', label: 'Travel Agent' },
  { value: 'user', label: 'User' },
  { value: 'payment_mode', label: 'Payment Mode' }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: 'Default' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'summary', label: 'Summary' },
  { value: 'custom', label: 'Custom' }
])

// Sample revenue data
const revenueData = ref<RevenueData[]>([
  {
    revenueAccount: 'ROOM-STD',
    description: 'Standard Room Revenue',
    roomCharges: 15000,
    foodBeverage: 3500,
    telephone: 250,
    laundry: 400,
    miscellaneous: 150,
    extraBed: 800,
    discount: -500,
    roundOff: 5,
    total: 19605,
    percentage: 45.2
  },
  {
    revenueAccount: 'ROOM-DLX',
    description: 'Deluxe Room Revenue',
    roomCharges: 22000,
    foodBeverage: 5200,
    telephone: 180,
    laundry: 600,
    miscellaneous: 320,
    extraBed: 1200,
    discount: -800,
    roundOff: -8,
    total: 28692,
    percentage: 66.1
  },
  {
    revenueAccount: 'ROOM-STE',
    description: 'Suite Room Revenue',
    roomCharges: 8500,
    foodBeverage: 2100,
    telephone: 120,
    laundry: 350,
    miscellaneous: 180,
    extraBed: 600,
    discount: -300,
    roundOff: 3,
    total: 11553,
    percentage: 26.6
  },
  {
    revenueAccount: 'REST-MAIN',
    description: 'Main Restaurant',
    roomCharges: 0,
    foodBeverage: 12500,
    telephone: 0,
    laundry: 0,
    miscellaneous: 250,
    extraBed: 0,
    discount: -450,
    roundOff: 2,
    total: 12302,
    percentage: 28.4
  },
  {
    revenueAccount: 'BAR-001',
    description: 'Main Bar',
    roomCharges: 0,
    foodBeverage: 6800,
    telephone: 0,
    laundry: 0,
    miscellaneous: 150,
    extraBed: 0,
    discount: -200,
    roundOff: -3,
    total: 6747,
    percentage: 15.5
  },
  {
    revenueAccount: 'SPA-001',
    description: 'Spa Services',
    roomCharges: 0,
    foodBeverage: 0,
    telephone: 0,
    laundry: 0,
    miscellaneous: 4500,
    extraBed: 0,
    discount: -150,
    roundOff: 1,
    total: 4351,
    percentage: 10.0
  }
])

// Table columns
const tableColumns = ref<Column[]>([
  { key: 'revenueAccount', label: 'Revenue Account' },
  { key: 'description', label: 'Description' },
  { key: 'roomCharges', label: 'Room Charges ', type: 'text' },
  { key: 'foodBeverage', label: 'Food & Beverage ', type: 'text' },
  { key: 'telephone', label: 'Telephone ', type: 'text' },
  { key: 'laundry', label: 'Laundry ', type: 'text' },
  { key: 'miscellaneous', label: 'Miscellaneous ', type: 'text' },
  { key: 'extraBed', label: 'Extra Bed ', type: 'text' },
  { key: 'discount', label: 'Discount ', type: 'text' },
  { key: 'roundOff', label: 'Round Off ', type: 'text' },
  { key: 'total', label: 'Total ', type: 'text',   },
  { key: 'percentage', label: 'Percentage (%)', type: 'text' }
])

// Computed properties
const totalRoomRevenue = computed(() => {
  return revenueData.value.reduce((total, item) => total + item.roomCharges, 0)
})

const totalFBRevenue = computed(() => {
  return revenueData.value.reduce((total, item) => total + item.foodBeverage, 0)
})

const totalOtherRevenue = computed(() => {
  return revenueData.value.reduce((total, item) => 
    total + item.telephone + item.laundry + item.miscellaneous + item.extraBed, 0)
})

const grandTotal = computed(() => {
  return revenueData.value.reduce((total, item) => total + item.total, 0)
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating daily revenue report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    asOnDate: '',
    dailyRevenueBy: '',
    reportTemplate: 'default'
  }
  showResults.value = false
}

const getRevenueByLabel = (value: string): string => {
  const option = revenueByOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All'
}
</script>

<style scoped>
/* Custom styles for revenue report */
.highlight-row {
  background-color: #f3f4f6;
}

.dark .highlight-row {
  background-color: #374151;
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>