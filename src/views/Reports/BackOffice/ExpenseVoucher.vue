<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Expense Voucher
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage expense voucher transactions
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Transaction Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction Date From
            </label>
            <InputDatepicker 
              v-model="filters.transactionDateFrom" 
              placeholder="From date"
              class="w-full"
            />
          </div>

          <!-- Transaction Date To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.transactionDateTo" 
              placeholder="To date"
              class="w-full"
            />
          </div>

          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>

          <!-- Charges -->
          <div class="md:col-span-2 lg:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Charges
            </label>
            <SelectComponent 
              v-model="filters.charges"
              :options="chargesOptions"
              placeholder="--Select--"
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
      </div>

      <!-- Results -->
      <div v-if="showResults" class="space-y-6">
        <!-- Company Header -->
        <div class="text-center py-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ companyName }}</h2>
        </div>

        <!-- Main Expense Voucher Table -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 bg-pink-500 text-white">
            <h2 class="text-lg font-semibold">Expense Voucher</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Voucher No</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Bill To</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Charge</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Comment</th>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Pay Method</th>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="expense in expenseData" :key="expense.voucherNo" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ expense.date }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ expense.voucherNo }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ expense.billTo }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 text-xs rounded" :class="getChargeClass(expense.charge)">
                      {{ expense.charge }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ expense.comment }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white font-medium">{{ expense.amount.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{{ expense.payMethod }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{{ expense.user }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Grand Total -->
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div class="flex justify-end">
              <div class="text-right">
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                  Grand Total: {{ grandTotal.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Tables -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Pay Method Wise Summary -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pay Method Wise Summary</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Pay Method</th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="method in payMethodSummary" :key="method.payMethod">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ method.payMethod }}</td>
                    <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                      {{ method.amount.toLocaleString() }}
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700 font-bold">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">Grand Total</td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {{ grandTotal.toLocaleString() }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Charge Wise Summary -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Charge wise Summary</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Charge Type</th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="charge in chargeWiseSummary" :key="charge.chargeType">
                    <td class="px-4 py-3 text-sm">
                      <span class="px-2 py-1 text-xs rounded" :class="getChargeClass(charge.chargeType)">
                        {{ charge.chargeType }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                      {{ charge.amount.toLocaleString() }}
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700 font-bold">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">Grand Total</td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {{ grandTotal.toLocaleString() }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

interface FilterOptions {
  value: string;
  label: string;
}

interface ExpenseData {
  date: string;
  voucherNo: string;
  billTo: string;
  charge: string;
  comment: string;
  amount: number;
  payMethod: string;
  user: string;
}

interface Filters {
  transactionDateFrom: string;
  transactionDateTo: string;
  user: string;
  charges: string;
}

const companyName = ref<string>('eZee Technosys')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  transactionDateFrom: '14/04/2020',
  transactionDateTo: '15/04/2020',
  user: '',
  charges: ''
})

// Options for selects
const userOptions = ref<FilterOptions[]>([
  { value: 'admin', label: 'admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'helpdesksupport', label: 'helpdesksupport' }
])

const chargesOptions = ref<FilterOptions[]>([
  { value: 'news_paper', label: 'News Paper' },
  { value: 'electricity_bill', label: 'Electricity Bill' },
  { value: 'water_bill', label: 'Water Bill' },
  { value: 'internet_bill', label: 'Internet Bill' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'travel', label: 'Travel Expense' }
])

// Sample expense data
const expenseData = ref<ExpenseData[]>([
  {
    date: '14/04/2020',
    voucherNo: '15668',
    billTo: 'Mr. Travelguru',
    charge: 'News Paper',
    comment: 'Daily newspaper subscription',
    amount: 1500.00,
    payMethod: 'Cash',
    user: 'admin'
  },
  {
    date: '14/04/2020',
    voucherNo: '15668',
    billTo: 'Mr. Travelguru',
    charge: 'Electricity Bill',
    comment: 'Monthly electricity charges',
    amount: 100.00,
    payMethod: 'Cash',
    user: 'admin'
  },
  {
    date: '15/04/2020',
    voucherNo: '15669',
    billTo: 'Office Supplies Inc',
    charge: 'Office Supplies',
    comment: 'Stationery and printing materials',
    amount: 850.00,
    payMethod: 'Bank Transfer',
    user: 'admin'
  },
  {
    date: '15/04/2020',
    voucherNo: '15670',
    billTo: 'City Water Department',
    charge: 'Water Bill',
    comment: 'Quarterly water charges',
    amount: 750.00,
    payMethod: 'Cheque',
    user: 'accountant'
  },
  {
    date: '15/04/2020',
    voucherNo: '15671',
    billTo: 'Maintenance Services Ltd',
    charge: 'Maintenance',
    comment: 'AC maintenance and repair',
    amount: 2200.00,
    payMethod: 'Cash',
    user: 'manager'
  }
])

// Computed properties
const grandTotal = computed(() => {
  return expenseData.value.reduce((total, expense) => total + expense.amount, 0)
})

const payMethodSummary = computed(() => {
  const summary: { [key: string]: number } = {}
  
  expenseData.value.forEach(expense => {
    if (summary[expense.payMethod]) {
      summary[expense.payMethod] += expense.amount
    } else {
      summary[expense.payMethod] = expense.amount
    }
  })
  
  return Object.entries(summary).map(([payMethod, amount]) => ({
    payMethod,
    amount
  }))
})

const chargeWiseSummary = computed(() => {
  const summary: { [key: string]: number } = {}
  
  expenseData.value.forEach(expense => {
    if (summary[expense.charge]) {
      summary[expense.charge] += expense.amount
    } else {
      summary[expense.charge] = expense.amount
    }
  })
  
  return Object.entries(summary).map(([chargeType, amount]) => ({
    chargeType,
    amount
  }))
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating expense voucher report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    transactionDateFrom: '',
    transactionDateTo: '',
    user: '',
    charges: ''
  }
  showResults.value = false
}

const getChargeClass = (charge: string): string => {
  const chargeClasses: { [key: string]: string } = {
    'News Paper': 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Electricity Bill': 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Water Bill': 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Office Supplies': 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Maintenance': 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Internet Bill': 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Fuel': 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Travel Expense': 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  
  return chargeClasses[charge] || 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>

<style scoped>
/* Custom styles for expense voucher report */
.table-header {
  background-color: #ec4899;
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>