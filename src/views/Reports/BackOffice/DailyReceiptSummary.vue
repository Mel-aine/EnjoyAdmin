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
          <!-- Payment From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment From
            </label>
            <InputDatepicker 
              v-model="filters.paymentFrom" 
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
              v-model="filters.paymentTo" 
              :placeholder="'DD/MM/YYYY'"
              class="w-full"
            ></InputDatepicker>
          </div>
          
          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
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
              <span class="font-semibold">Daily Receipt - Summary</span>
            </div>
            <div class="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span class="inline-block bg-red-200 dark:bg-red-800 px-3 py-1 rounded">
                Date From {{ filters.paymentFrom }} To {{ filters.paymentTo }}
              </span>
            </div>
          </div>
        </div>

        <!-- Receipt Summary Table -->
        <div class="px-6 py-4">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Pay Method
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Tran. Count
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Amount
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Void Count
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600">
                    Void Amount
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Total(Rs.)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800">
                <!-- User: admin section -->
                <tr class="bg-gray-100 dark:bg-gray-700">
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600" colspan="6">
                    User: admin
                  </td>
                </tr>
                
                <tr v-for="(item, index) in adminData" :key="`admin-${index}`" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.payMethod }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.tranCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.amount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.voidCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.voidAmount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                    {{ item.total }}
                  </td>
                </tr>
                
                <!-- User Total for admin -->
                <tr class="bg-gray-100 dark:bg-gray-700 border-t border-dotted border-gray-400">
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    User Total
                  </td>
                  <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ adminTotals.tranCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ adminTotals.voidCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white">
                    {{ adminTotals.total }}
                  </td>
                </tr>

                <!-- User: helpdesksupport section -->
                <tr class="bg-gray-100 dark:bg-gray-700 border-t-2 border-gray-300 dark:border-gray-500">
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600" colspan="6">
                    User: helpdesksupport
                  </td>
                </tr>
                
                <tr v-for="(item, index) in helpdeskData" :key="`helpdesk-${index}`" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.payMethod }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.tranCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.amount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.voidCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ item.voidAmount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                    {{ item.total }}
                  </td>
                </tr>
                
                <!-- User Total for helpdesksupport -->
                <tr class="bg-gray-100 dark:bg-gray-700 border-t border-dotted border-gray-400">
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    User Total
                  </td>
                  <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ helpdeskTotals.tranCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ helpdeskTotals.voidCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white">
                    {{ helpdeskTotals.total }}
                  </td>
                </tr>

                <!-- Grand Total -->
                <tr class="bg-gray-200 dark:bg-gray-600 font-bold border-t-2 border-gray-400 dark:border-gray-500">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    Grand Total
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ grandTotals.tranCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    {{ grandTotals.voidCount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                    -
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-blue-600 dark:text-blue-400 font-bold">
                    {{ grandTotals.total }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    User
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    Amount ( Rs )
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    Pay Method
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 border border-red-300 dark:border-red-700">
                    Amount ( Rs )
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800">
                <tr v-for="(item, index) in summaryData" :key="index" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    {{ item.user }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    {{ item.userAmount }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    {{ item.payMethod }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    {{ item.methodAmount }}
                  </td>
                </tr>
                
                <!-- Grand Total Row -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-400 dark:border-gray-500">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    Grand Total
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600">
                    {{ summaryGrandTotal }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    Grand Total
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600">
                    {{ summaryGrandTotal }}
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
  paymentFrom: string;
  paymentTo: string;
  user: string;
  paymentFor: string;
}

interface PaymentItem {
  payMethod: string;
  tranCount: number;
  amount: string;
  voidCount: number;
  voidAmount: string;
  total: string;
}

interface SummaryItem {
  user: string;
  userAmount: string;
  payMethod: string;
  methodAmount: string;
}

const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  paymentFrom: '24/04/2019',
  paymentTo: '27/04/2019',
  user: '',
  paymentFor: ''
})

// Sample data for admin user
const adminData = ref<PaymentItem[]>([
  { payMethod: 'AirPay(Rs)', tranCount: 1, amount: '200.00', voidCount: 1, voidAmount: '200.00', total: '0.00' },
  { payMethod: 'Cash(Rs)', tranCount: 2, amount: '7,072.72', voidCount: 0, voidAmount: '0.00', total: '7,072.72' },
  { payMethod: 'Credit(Rs)', tranCount: 5, amount: '1,277.27', voidCount: 3, voidAmount: '300.00', total: '977.27' },
  { payMethod: 'ICIC Bank Or ICIC Swip(Rs)', tranCount: 1, amount: '200.00', voidCount: 0, voidAmount: '0.00', total: '200.00' }
])

// Sample data for helpdesk user
const helpdeskData = ref<PaymentItem[]>([
  { payMethod: 'ABC(Rs)', tranCount: 1, amount: '539.50', voidCount: 0, voidAmount: '0.00', total: '539.50' },
  { payMethod: 'Cash(Rs)', tranCount: 2, amount: '6,977.03', voidCount: 0, voidAmount: '0.00', total: '6,977.03' },
  { payMethod: 'Credit(Rs)', tranCount: 1, amount: '980.90', voidCount: 1, voidAmount: '980.50', total: '0.00' },
  { payMethod: 'ABC(Rs)', tranCount: 4, amount: '650.00', voidCount: 3, voidAmount: '350.00', total: '300.00' },
  { payMethod: 'Cash(Rs)', tranCount: 10, amount: '1,011.71', voidCount: 7, voidAmount: '1,260.50', total: '268.79' }
])

// Summary data
const summaryData = ref<SummaryItem[]>([
  { user: 'admin', userAmount: '7,849.99', payMethod: 'ABC', methodAmount: '639.50' },
  { user: 'admin', userAmount: '7,516.53', payMethod: 'Cash', methodAmount: '13,780.96' },
  { user: 'helpdesksupport', userAmount: '31.21', payMethod: 'Credit', methodAmount: '977.27' },
  { user: '', userAmount: '', payMethod: 'ICIC Bank Or ICIC Swip', methodAmount: '200.00' }
])

// Computed totals
const adminTotals = computed(() => {
  return {
    tranCount: adminData.value.reduce((sum, item) => sum + item.tranCount, 0),
    voidCount: adminData.value.reduce((sum, item) => sum + item.voidCount, 0),
    total: '7,849.99'
  }
})

const helpdeskTotals = computed(() => {
  return {
    tranCount: helpdeskData.value.reduce((sum, item) => sum + item.tranCount, 0),
    voidCount: helpdeskData.value.reduce((sum, item) => sum + item.voidCount, 0),
    total: '7,516.53'
  }
})

const grandTotals = computed(() => {
  return {
    tranCount: adminTotals.value.tranCount + helpdeskTotals.value.tranCount,
    voidCount: adminTotals.value.voidCount + helpdeskTotals.value.voidCount,
    total: '15,397.73'
  }
})

const summaryGrandTotal = computed(() => '15,397.73')

// Options for selects
const userOptions = ref<FilterOptions[]>([
  { value: 'admin', label: 'admin' },
  { value: 'helpdesksupport', label: 'helpdesksupport' }
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
  console.log('Generating daily receipt summary with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    paymentFrom: '',
    paymentTo: '',
    user: '',
    paymentFor: ''
  }
  showResults.value = false
}
</script>

<style scoped>
/* Table styling */
.border-dotted {
  border-style: dotted;
}

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
</style>