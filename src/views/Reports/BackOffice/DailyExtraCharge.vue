<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Extra Charge - Detail
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage daily extra charge details
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div class="flex items-center gap-2">
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="filters.dateType"
                  value="charge"
                  class="mr-1 text-blue-600"
                />
                <span class="text-sm">Charge/Posting</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="radio" 
                  v-model="filters.dateType"
                  value="departure"
                  class="mr-1 text-blue-600"
                />
                <span class="text-sm">Departure</span>
              </label>
            </div>
          </div>

          <!-- Transaction Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction Date From
            </label>
            <InputDatepicker 
              v-model="filters.transactionFrom" 
              placeholder="2018-09-01"
              class="w-full"
            />
          </div>

          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.transactionTo" 
              placeholder="2018-09-25"
              class="w-full"
            />
          </div>

          <!-- Received By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Received By
            </label>
            <SelectComponent 
              v-model="filters.receivedBy"
              :options="receivedByOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <!-- Extra Charge -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Extra Charge
            </label>
            <SelectComponent 
              v-model="filters.extraCharge"
              :options="extraChargeOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <SelectComponent 
              v-model="filters.sortBy"
              :options="sortByOptions"
              placeholder="Date"
              class="w-full"
            />
          </div>

          <!-- Room -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room
            </label>
            <SelectComponent 
              v-model="filters.room"
              :options="roomOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>
        </div>

        <!-- Include Options -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Include
          </label>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.includeAll"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">All</span>
            </label>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.includeConfirmReserved"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Confirm Reserved</span>
            </label>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.includeCancelled"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Cancelled</span>
            </label>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.includeNoShow"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">No Show</span>
            </label>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.includeInhouse"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Inhouse</span>
            </label>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.includeCheckedOut"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Checked Out</span>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 mt-6">
          <!-- Bouton Export -->
          <div class="relative">
            <button 
              @click="exportReport"
              :disabled="isLoading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <span v-if="!isLoading">{{ t('common.export') }}</span>
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          
          <!-- Bouton Report -->
          <div class="relative">
            <button
              @click="generateReport"
              :disabled="isLoading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <span v-if="!isLoading">{{ t('common.report') }}</span>
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          
          <!-- Bouton Reset -->
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

      <!-- Results Report -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Karma
            </h2>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded border-2 border-red-600">
              Daily Extra Charge - Detail
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>Transaction Date From</strong> {{ filters.transactionFrom }} <strong>To</strong> {{ filters.transactionTo }} <strong>Include</strong> Confirm Reserved Cancelled No Show Inhouse Checked Out</span>
          </div>
        </div>
        
        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable 
            title="Daily Extra Charge Details"
            :data="extraChargeData"
            :columns="extraChargeColumns"
            class="w-full mb-4 min-w-max"
          />
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

interface FilterOptions {
  value: string;
  label: string;
}

interface ExtraChargeItem {
  date: string;
  voucherNo: string;
  reference: string;
  quantity: string;
  amount: string;
  discount: string;
  tax: string;
  total: string;
  user: string;
  enteredOn?: string;
}

interface Filters {
  dateType: string;
  transactionFrom: string;
  transactionTo: string;
  receivedBy: string;
  extraCharge: string;
  sortBy: string;
  room: string;
  includeAll: boolean;
  includeConfirmReserved: boolean;
  includeCancelled: boolean;
  includeNoShow: boolean;
  includeInhouse: boolean;
  includeCheckedOut: boolean;
}

const { t } = useI18n()
const showResults = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const filters = ref<Filters>({
  dateType: 'charge',
  transactionFrom: '2018-09-01',
  transactionTo: '2018-09-25',
  receivedBy: '',
  extraCharge: '',
  sortBy: 'Date',
  room: '',
  includeAll: true,
  includeConfirmReserved: true,
  includeCancelled: true,
  includeNoShow: true,
  includeInhouse: true,
  includeCheckedOut: true
})

// Options for selects
const receivedByOptions = ref<FilterOptions[]>([
  { value: '', label: '--Select--' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' }
])

const extraChargeOptions = ref<FilterOptions[]>([
  { value: '', label: '--Select--' },
  { value: 'birthday_cake', label: 'Birthday Cake' },
  { value: 'room_service', label: 'Room Service' },
  { value: 'laundry', label: 'Laundry' }
])

const sortByOptions = ref<FilterOptions[]>([
  { value: 'Date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'guest', label: 'Guest Name' }
])

const roomOptions = ref<FilterOptions[]>([
  { value: '', label: '--Select--' },
  { value: '201', label: 'Room 201' },
  { value: '202', label: 'Room 202' },
  { value: '203', label: 'Room 203' }
])

// Sample extra charge data based on the image
const extraChargeDataRaw = ref<ExtraChargeItem[]>([
  {
    date: '2018-09-07',
    voucherNo: 'Ext145',
    reference: 'Front Desk Folio- Folio257 Room : Hawai Couple',
    quantity: '1',
    amount: '100.00',
    discount: '0.00',
    tax: '15.00',
    total: '115.00',
    user: 'helpdesksupport',
    enteredOn: 'Entered On 2018-12-03 07:44:04 AM'
  },
  {
    date: '2018-09-17',
    voucherNo: 'Ext132',
    reference: 'Front Desk Folio- Folio171 Room : Super Deluxe 2',
    quantity: '1',
    amount: '100.00',
    discount: '0.00',
    tax: '15.00',
    total: '115.00',
    user: 'helpdesksupport',
    enteredOn: 'Entered On 2018-12-05 03:00:23 PM'
  },
  {
    date: '2018-09-18',
    voucherNo: 'Ext125',
    reference: 'Incidental Invoice : Invoice -',
    quantity: '1',
    amount: '100.00',
    discount: '0.00',
    tax: '18.00',
    total: '118.00',
    user: 'helpdesksupport',
    enteredOn: 'Entered On 2018-11-13 11:45:10 PM'
  }
])

// Computed properties for ResultTable
const extraChargeColumns = computed(() => [
  { key: 'date', label: 'Date' },
  { key: 'voucherNo', label: 'Voucher No' },
  { key: 'reference', label: 'Reference' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'amount', label: 'Amount' },
  { key: 'discount', label: 'Discount' },
  { key: 'tax', label: 'Tax' },
  { key: 'total', label: 'Total' },
  { key: 'user', label: 'User' }
])

const extraChargeData = computed(() => {
  return extraChargeDataRaw.value
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating daily extra charge report with filters:', filters.value)
}

const exportReport = (): void => {
  console.log('Exporting report...')
}

const resetForm = (): void => {
  filters.value = {
    dateType: 'charge',
    transactionFrom: '',
    transactionTo: '',
    receivedBy: '',
    extraCharge: '',
    sortBy: 'Date',
    room: '',
    includeAll: false,
    includeConfirmReserved: false,
    includeCancelled: false,
    includeNoShow: false,
    includeInhouse: false,
    includeCheckedOut: false
  }
  showResults.value = false
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>