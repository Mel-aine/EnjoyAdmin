<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">New Payment</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <!-- Top Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- City Ledger Account -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City Ledger Account</label>
            <div class="relative">
              <select 
                v-model="formData.cityLedgerAccount"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select account</option>
                <option value="adonis">ADONIS TRAVELS&TOURS</option>
                <option value="other">Other accounts...</option>
              </select>
            </div>
          </div>

          <!-- Paid by Travel Agent -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paid by Travel Agent</label>
            <div class="relative">
              <select 
                v-model="formData.travelAgent"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select agent</option>
                <option value="adonis">ADONIS TRAVELS&TOURS</option>
                <option value="other">Other agents...</option>
              </select>
            </div>
          </div>

          <!-- Payment Type -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Type</label>
            <div class="relative">
              <select 
                v-model="formData.paymentType"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select type</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="check">Check</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Middle Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Reference -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference</label>
            <input 
              type="text" 
              v-model="formData.reference"
              placeholder="Enter reference number"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <!-- Date -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input 
              type="date" 
              v-model="formData.date"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <!-- Amount -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
            <input 
              type="number" 
              v-model="formData.amount"
              placeholder="0.00"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <!-- New Payment Section -->
        <div class="mb-6">
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">New Payment</h3>
          
          <!-- Table Header -->
          <div class="grid grid-cols-6 gap-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-t-md border border-gray-200 dark:border-gray-600">
            <div class="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">Date</div>
            <div class="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">Guest Name</div>
            <div class="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">Folio No</div>
            <div class="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">Inv No</div>
            <div class="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</div>
            <div class="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</div>
          </div>
          
          <!-- Table Body -->
          <div class="border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-md">
            <div v-for="(guest, index) in guestData" :key="index" class="grid grid-cols-6 gap-4 p-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
              <div class="col-span-1 text-sm text-gray-900 dark:text-white">{{ formatDate(guest.date) }}</div>
              <div class="col-span-1 text-sm text-gray-900 dark:text-white">{{ guest.name }}</div>
              <div class="col-span-1 text-sm text-gray-900 dark:text-white">{{ guest.folioNo }}</div>
              <div class="col-span-1 text-sm text-gray-900 dark:text-white">{{ guest.invNo }}</div>
              <div class="col-span-1 text-sm text-gray-900 dark:text-white">{{ guest.description }}</div>
              <div class="col-span-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(guest.amount) }}</div>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
          <p class="text-sm text-blue-700 dark:text-blue-300">
            Here we can see the guest which are settled in the city ledger so we can map the payment according to the booking
          </p>
        </div>

        <!-- Bottom Buttons -->
        <div class="flex justify-between items-center">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">With selected:</span>
            <button class="ml-2 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              Manual
            </button>
          </div>
          
          <div class="flex items-center">
            <div class="mr-4 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">Balance:</p>
              <p class="text-md font-semibold text-gray-900 dark:text-white">{{ formatCurrency(36000.00) }}</p>
            </div>
            
            <button 
              @click="savePayment"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
            
            <button 
              @click="closeModal"
              class="ml-3 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const formData = ref({
  cityLedgerAccount: '',
  travelAgent: '',
  paymentType: 'cash',
  reference: '',
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  amount: null
})

// Sample guest data
const guestData = ref([
  {
    date: '2023-01-01',
    name: 'Emile Simalundu',
    folioNo: '295',
    invNo: '',
    description: '',
    amount: 12720.00,
    selected: false
  },
  {
    date: '2023-01-05',
    name: 'Emma Chen',
    folioNo: '296',
    invNo: '',
    description: '',
    amount: 8500.00,
    selected: false
  },
  {
    date: '2023-01-10',
    name: 'John Smith',
    folioNo: '297',
    invNo: '',
    description: '',
    amount: 14780.00,
    selected: false
  }
])

// Methods
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

const savePayment = () => {
  // Validate form
  if (!formData.value.cityLedgerAccount) {
    alert('Please select a city ledger account')
    return
  }

  if (!formData.value.amount) {
    alert('Please enter an amount')
    return
  }

  // Process payment logic here
  console.log('Saving payment:', formData.value)
  console.log('Selected guests:', guestData.value.filter(g => g.selected))
  
  // Close modal after saving
  closeModal()
}

const closeModal = () => {
  // Navigate back to the cashiering center
  router.push('/cashiering/center')
}

onMounted(() => {
  // Any initialization logic
})
</script>