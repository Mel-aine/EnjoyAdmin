<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Refund Report
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage daily refund transactions for your hotel
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Receipt From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Receipt From
            </label>
            <InputDatepicker 
              v-model="filters.receiptFrom" 
              placeholder="From date"
              class="w-full"
            />
          </div>

          <!-- Receipt To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.receiptTo" 
              placeholder="To date"
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

          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <SelectComponent 
              v-model="filters.paymentMethod"
              :options="paymentMethodOptions"
              placeholder="--Select--"
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
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Refund Report Results
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> • 
            <span>Period: {{ filters.receiptFrom }} to {{ filters.receiptTo }}</span> • 
            <span>Currency: {{ getCurrencyLabel(filters.currency) }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            title="Daily Refund Report"
            :data="refundData"
            :columns="tableColumns"
            class="w-full"
          />
        </div>
        
        <!-- Summary -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Total Refunds:</span>
              <span class="ml-2 font-bold text-red-600 dark:text-red-400">{{ totalRefundCount }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Cash Refunds:</span>
              <span class="ml-2 font-bold text-green-600 dark:text-green-400">Rs {{ totalCashRefunds.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Card Refunds:</span>
              <span class="ml-2 font-bold text-blue-600 dark:text-blue-400">Rs {{ totalCardRefunds.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Grand Total:</span>
              <span class="ml-2 font-bold text-gray-900 dark:text-white text-lg">Rs {{ grandTotalRefunds.toLocaleString() }}</span>
            </div>
          </div>
          
          <!-- Additional Summary Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Bank Transfer:</span>
              <span class="ml-2 font-bold text-purple-600 dark:text-purple-400">Rs {{ totalBankRefunds.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Other Methods:</span>
              <span class="ml-2 font-bold text-orange-600 dark:text-orange-400">Rs {{ totalOtherRefunds.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700 dark:text-gray-300">Average Refund:</span>
              <span class="ml-2 font-bold text-gray-600 dark:text-gray-400">Rs {{ averageRefund.toLocaleString() }}</span>
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

interface FilterOptions {
  value: string;
  label: string;
}

interface RefundData {
  receiptNo: string;
  refundDate: string;
  refundTime: string;
  reservationNo: string;
  guestName: string;
  roomNo: string;
  refundReason: string;
  paymentMethod: string;
  refundAmount: number;
  currency: string;
  receivedBy: string;
  authorizedBy: string;
  remarks: string;
  status: string;
}

interface Filters {
  receiptFrom: string;
  receiptTo: string;
  receivedBy: string;
  paymentMethod: string;
  currency: string;
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  receiptFrom: '27/04/2019',
  receiptTo: '27/04/2019',
  receivedBy: '',
  paymentMethod: '',
  currency: '',
  reportTemplate: 'default'
})

// Options for selects
const receivedByOptions = ref<FilterOptions[]>([
  { value: 'helpdesksupport', label: 'helpdesksupport' },
  { value: 'front_office', label: 'Front Office Manager' },
  { value: 'cashier1', label: 'Cashier 1' },
  { value: 'cashier2', label: 'Cashier 2' },
  { value: 'admin', label: 'Admin' }
])

const paymentMethodOptions = ref<FilterOptions[]>([
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'mobile_payment', label: 'Mobile Payment' },
  { value: 'other', label: 'Other' }
])

const currencyOptions = ref<FilterOptions[]>([
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: 'Default' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'summary', label: 'Summary' },
  { value: 'custom', label: 'Custom' }
])

// Sample refund data
const refundData = ref<RefundData[]>([
  {
    receiptNo: 'REF-001',
    refundDate: '27/04/2019',
    refundTime: '10:30:00 AM',
    reservationNo: 'BE306',
    guestName: 'Mr. John Smith',
    roomNo: '101',
    refundReason: 'Early Checkout',
    paymentMethod: 'Credit Card',
    refundAmount: 2500,
    currency: 'INR',
    receivedBy: 'helpdesksupport',
    authorizedBy: 'Manager',
    remarks: 'Guest requested early checkout due to emergency',
    status: 'Processed'
  },
  {
    receiptNo: 'REF-002',
    refundDate: '27/04/2019',
    refundTime: '02:15:00 PM',
    reservationNo: 'BE307',
    guestName: 'Mrs. Sarah Johnson',
    roomNo: '205',
    refundReason: 'Room Service Overcharge',
    paymentMethod: 'Cash',
    refundAmount: 450,
    currency: 'INR',
    receivedBy: 'front_office',
    authorizedBy: 'Supervisor',
    remarks: 'Overcharged for room service items',
    status: 'Processed'
  },
  {
    receiptNo: 'REF-003',
    refundDate: '27/04/2019',
    refundTime: '04:45:00 PM',
    reservationNo: 'BE308',
    guestName: 'Mr. David Wilson',
    roomNo: '310',
    refundReason: 'Cancelled Additional Services',
    paymentMethod: 'Debit Card',
    refundAmount: 1200,
    currency: 'INR',
    receivedBy: 'cashier1',
    authorizedBy: 'Manager',
    remarks: 'Spa services cancelled due to illness',
    status: 'Processed'
  },
  {
    receiptNo: 'REF-004',
    refundDate: '27/04/2019',
    refundTime: '06:20:00 PM',
    reservationNo: 'BE309',
    guestName: 'Ms. Emily Davis',
    roomNo: '150',
    refundReason: 'Duplicate Payment',
    paymentMethod: 'Bank Transfer',
    refundAmount: 3500,
    currency: 'INR',
    receivedBy: 'helpdesksupport',
    authorizedBy: 'Manager',
    remarks: 'Guest accidentally paid twice for same services',
    status: 'Pending'
  },
  {
    receiptNo: 'REF-005',
    refundDate: '27/04/2019',
    refundTime: '08:10:00 PM',
    reservationNo: 'BE310',
    guestName: 'Mr. Michael Brown',
    roomNo: '220',
    refundReason: 'Service Not Delivered',
    paymentMethod: 'Cash',
    refundAmount: 800,
    currency: 'INR',
    receivedBy: 'cashier2',
    authorizedBy: 'Supervisor',
    remarks: 'Laundry service not completed on time',
    status: 'Processed'
  }
])

// Table columns
const tableColumns = ref([
  { key: 'receiptNo', label: 'Receipt No.' },
  { key: 'refundDate', label: 'Refund Date' },
  { key: 'refundTime', label: 'Time' },
  { key: 'reservationNo', label: 'Reservation No.' },
  { key: 'guestName', label: 'Guest Name' },
  { key: 'roomNo', label: 'Room No.' },
  { key: 'refundReason', label: 'Refund Reason' },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'refundAmount', label: 'Refund Amount (Rs)', type: 'currency', highlight: true },
  { key: 'currency', label: 'Currency' },
  { key: 'receivedBy', label: 'Received By' },
  { key: 'authorizedBy', label: 'Authorized By' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'remarks', label: 'Remarks' }
])

// Computed properties
const totalRefundCount = computed(() => {
  return refundData.value.length
})

const totalCashRefunds = computed(() => {
  return refundData.value
    .filter(item => item.paymentMethod === 'Cash')
    .reduce((total, item) => total + item.refundAmount, 0)
})

const totalCardRefunds = computed(() => {
  return refundData.value
    .filter(item => ['Credit Card', 'Debit Card'].includes(item.paymentMethod))
    .reduce((total, item) => total + item.refundAmount, 0)
})

const totalBankRefunds = computed(() => {
  return refundData.value
    .filter(item => item.paymentMethod === 'Bank Transfer')
    .reduce((total, item) => total + item.refundAmount, 0)
})

const totalOtherRefunds = computed(() => {
  return refundData.value
    .filter(item => !['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'].includes(item.paymentMethod))
    .reduce((total, item) => total + item.refundAmount, 0)
})

const grandTotalRefunds = computed(() => {
  return refundData.value.reduce((total, item) => total + item.refundAmount, 0)
})

const averageRefund = computed(() => {
  if (refundData.value.length === 0) return 0
  return Math.round(grandTotalRefunds.value / refundData.value.length)
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating daily refund report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    receiptFrom: '',
    receiptTo: '',
    receivedBy: '',
    paymentMethod: '',
    currency: '',
    reportTemplate: 'default'
  }
  showResults.value = false
}

const getCurrencyLabel = (value: string): string => {
  const option = currencyOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'INR (₹)'
}
</script>

<style scoped>
/* Custom styles for refund report */
.status-processed {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}

.status-pending {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200;
}

.status-cancelled {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200;
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>