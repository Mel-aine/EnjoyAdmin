<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.dailyReceipt') }}
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Receipt From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Receipt From
            </label>
            <InputDatepicker 
              v-model="filters.receiptFrom" 
              :placeholder="'DD/MM/YYYY'"
              class="w-full"
            ></InputDatepicker>
          </div>
          
          <!-- To Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.receiptTo" 
              :placeholder="'DD/MM/YYYY'"
              class="w-full"
            ></InputDatepicker>
          </div>
          
          <!-- Received By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Received By
            </label>
            <SelectComponent 
              v-model="filters.receivedBy"
              :options="receivedByOptions"
              :placeholder="'--Select--'"
              class="w-full"
            ></SelectComponent>
          </div>
          
          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <SelectComponent 
              v-model="filters.paymentMethod"
              :options="paymentMethodOptions"
              :placeholder="'--Select--'"
              class="w-full"
            ></SelectComponent>
          </div>
          
          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <SelectComponent 
              v-model="filters.currency"
              :options="currencyOptions"
              :placeholder="'--Select--'"
              class="w-full"
            ></SelectComponent>
          </div>
          
          <!-- Payment For -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment For
            </label>
            <SelectComponent 
              v-model="filters.paymentFor"
              :options="paymentForOptions"
              :placeholder="'--Select--'"
              class="w-full"
            ></SelectComponent>
          </div>
        </div>
        
        <!-- Buttons -->
        <div class="flex items-center justify-end mt-6">
          <div class="flex gap-2">
            <ButtonComponent 
              @click="exportData"
              variant="secondary"
              class="px-6 py-2"
            >
              Export
            </ButtonComponent>
            
            <ButtonComponent 
              @click="generateReport"
              variant="primary"
              class="px-6 py-2"
            >
              Report
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="px-6 py-2"
            >
              Reset
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
        <!-- Report Header with Hotel Name and Title -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Hotel Nihal</h2>
            <div class="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700">
              <span class="font-semibold">Daily Receipt - Detail</span>
            </div>
            <div class="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span class="inline-block bg-red-200 dark:bg-red-800 px-3 py-1 rounded">
                Date From {{ filters.receiptFrom }} To {{ filters.receiptTo }}
              </span>
            </div>
          </div>
        </div>

        <!-- Receipt Details Table -->
        <div class="px-6 py-4">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th v-for="header in receiptHeaders" :key="header.key" 
                      :class="['px-4 py-3 text-xs font-medium uppercase tracking-wider', 
                              header.align === 'right' ? 'text-right' : 'text-left',
                              header.align === 'center' ? 'text-center' : '',
                              'text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 last:border-r-0']">
                    {{ header.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                <tr v-for="(item, index) in receiptData" :key="index" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.date }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.receipt }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.reference }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.amount }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.user }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.enteredOn }}
                  </td>
                </tr>
                
                <!-- Payment Mode Row -->
                <tr class="bg-gray-100 dark:bg-gray-700 border-t-2 border-gray-400 dark:border-gray-500">
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600" colspan="2">
                    Payment Mode
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    Cash 
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ paymentModeTotal }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ totalEntries }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  </td>
                </tr>
                
                <!-- Total Row -->
                <tr class="bg-gray-50 dark:bg-gray-600 font-semibold">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600" colspan="3">
                    Total
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ grandTotal }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  </td>
                </tr>
                
                <!-- Grand Total Row -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-400 dark:border-gray-500">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600" colspan="3">
                    Grand Total 
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-bold text-blue-600 dark:text-blue-400 border-r border-gray-200 dark:border-gray-600">
                    {{ grandTotal }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  </td>
                </tr>
              </tbody>
            </table>
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface Filters {
  receiptFrom: string;
  receiptTo: string;
  receivedBy: string;
  paymentMethod: string;
  currency: string;
  paymentFor: string;
}

interface TableHeader {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

interface ReceiptItem {
  date: string;
  receipt: string;
  reference: string;
  amount: string;
  user: string;
  enteredOn: string;
}

const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  receiptFrom: '25/04/2019',
  receiptTo: '27/04/2019',
  receivedBy: '',
  paymentMethod: '',
  currency: '',
  paymentFor: ''
})

// Headers for receipt table
const receiptHeaders = ref<TableHeader[]>([
  { key: 'date', label: 'Date', align: 'left' },
  { key: 'receipt', label: 'Receipt', align: 'left' },
  { key: 'reference', label: 'Reference', align: 'left' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'user', label: 'User', align: 'left' },
  { key: 'enteredOn', label: 'Entered On', align: 'left' }
])

// Sample receipt data
const receiptData = ref<ReceiptItem[]>([
  {
    date: '2019-04-27',
    receipt: 'retente',
    reference: 'Front Desk Folio : FNH598, Room : 207, Guest : Mr. test 00001',
    amount: '873.00',
    user: 'helpdesksupport',
    enteredOn: '2020-04-16 01:11:36 PM'
  }
])

// Computed values for totals
const paymentModeTotal = computed(() => {
  return receiptData.value.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)
})

const grandTotal = computed(() => {
  return receiptData.value.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)
})

const totalEntries = computed(() => {
  return receiptData.value.length.toString()
})

// Options for selects
const receivedByOptions = ref<FilterOptions[]>([
  { value: 'helpdesksupport', label: 'helpdesksupport' },
  { value: 'admin', label: 'admin' },
  { value: 'manager', label: 'manager' }
])

const paymentMethodOptions = ref<FilterOptions[]>([
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' }
])

const currencyOptions = ref<FilterOptions[]>([
  { value: 'Rs', label: 'Rs' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
])

const paymentForOptions = ref<FilterOptions[]>([
  { value: 'room_rent', label: 'Room Rent' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'other', label: 'Other' }
])

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating daily receipt report with filters:', filters.value)
}

const exportData = (): void => {
  console.log('Exporting daily receipt data...')
}

const resetForm = (): void => {
  filters.value = {
    receiptFrom: '',
    receiptTo: '',
    receivedBy: '',
    paymentMethod: '',
    currency: '',
    paymentFor: ''
  }
  showResults.value = false
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Table styling improvements */
.table-auto {
  table-layout: auto;
}

.border-collapse {
  border-collapse: collapse;
}
</style>