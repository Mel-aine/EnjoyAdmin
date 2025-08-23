<template>
  <div class="fixed inset-0 overflow-hidden z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="relative w-screen max-w-md">
          <!-- Close button -->
          <div class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
            <ButtonIcon
              icon="XIcon"
              @click="closeModal"
              class="text-gray-300 hover:text-white"
              aria-label="Close panel"
            />
          </div>

          <!-- Slide-over panel -->
          <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <!-- Header -->
            <div class="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-start justify-between">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white" id="slide-over-title">{{ $t('cashiering.newPayment', 'New Payment') }}</h2>
              </div>
            </div>

            <!-- Main content -->
            <div class="flex-1 overflow-y-auto">
              <div class="px-4 py-5 sm:p-6">
                <!-- Cashiering Center Link -->
                <div class="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  <a href="#" @click.prevent="closeModal" class="hover:text-gray-700 dark:hover:text-gray-300">{{ $t('cashiering.center', 'Cashiering Center') }}</a>
                </div>

                <!-- Payment Form -->
                <div class="space-y-4">
                  <!-- Section Header -->
                  <div class="bg-blue-50 dark:bg-blue-900 rounded-md p-3">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">{{ $t('cashiering.paymentFromCityLedger', 'Payment from City Ledger') }}</h3>
                  </div>

                  <!-- City Ledger Account -->
                  <Select
                    lb="City Ledger"
                    v-model="formData.cityLedgerAccount"
                    :options="[
                      { label: 'Select', value: '' },
                      { label: 'AGODA TRAVELERS', value: 'AGODA TRAVELERS' },
                      { label: 'BOOKING.COM', value: 'BOOKING.COM' },
                      { label: 'EXPEDIA', value: 'EXPEDIA' }
                    ]"
                    :isRequired="true"
                  />

                  <!-- Date -->
                  <InputDatePicker
                    lb="Date"
                    v-model="formData.date"
                    :isRequired="true"
                  />

                  <!-- Payment Type -->
                  <Select
                    lb="Payment Type"
                    v-model="formData.paymentType"
                    :options="[
                      { label: 'Select', value: '' },
                      { label: 'Cash', value: 'cash' },
                      { label: 'Credit Card', value: 'credit' },
                      { label: 'Bank Transfer', value: 'bank' }
                    ]"
                    :isRequired="true"
                  />

                  <!-- Reference -->
                  <Input
                    lb="Reference"
                    v-model="formData.reference"
                    inputType="text"
                  />

                  <!-- Comment -->
                  <TextArea
                    lb="Comment"
                    v-model="formData.comment"
                    :rows="2"
                  />

                  <!-- Amount -->
                  <Input
                    lb="Amount"
                    v-model="formData.amount"
                    inputType="number"
                    :isRequired="true"
                    placeholder="0.00"
                    step="0.01"
                    prefix="₹"
                  />

                  <!-- Map Payment Section -->
                  <div class="mt-8">
                    <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">{{ $t('cashiering.mapPayment', 'Map Payment') }}</h4>
                    
                    <!-- Select Options -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <Select
                        lb="Select Options"
                        :options="[{ label: 'Select', value: '' }]"
                      />
                      <Select
                        lb="Select Date Type"
                        :options="[{ label: 'Posting Date', value: 'posting_date' }]"
                      />
                    </div>

                    <!-- Date Range -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <InputDatePicker
                        lb="Start Date"
                        v-model="startDate"
                        defaultValue="2021-12-01"
                      />
                      <InputDatePicker
                        lb="End Date"
                        v-model="endDate"
                        defaultValue="2022-01-01"
                      />
                    </div>

                    <!-- Guest Data Table -->
                    <ReusableTable
                      :columns="guestColumns"
                      :data="guestData"
                      :actions="guestActions"
                      :selectable="true"
                      :loading="loading"
                      @selection-change="handleGuestSelectionChange"
                      @action="handleGuestAction"
                    >
                      <!-- Custom cell for Date column -->
                      <template #cell-date="{ item }">
                        <span class="text-xs text-gray-900 dark:text-white">{{ formatDate(item.date) }}</span>
                      </template>
                      
                      <!-- Custom cell for Name column -->
                      <template #cell-name="{ item }">
                        <span class="text-xs font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
                      </template>
                      
                      <!-- Custom cell for Amount column -->
                      <template #cell-amount="{ item }">
                        <span class="text-xs font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.amount) }}</span>
                      </template>
                      
                      <!-- Custom cell for Assigned column -->
                      <template #cell-assigned="{ item }">
                        <span class="text-xs text-gray-900 dark:text-white">{{ formatCurrency(item.assigned) }}</span>
                      </template>
                      
                      <!-- Custom cell for Open column -->
                      <template #cell-open="{ item }">
                        <span class="text-xs text-gray-900 dark:text-white">{{ formatCurrency(item.open) }}</span>
                      </template>
                      
                      <!-- Custom cell for Assign action -->
                      <template #cell-assign="{ item }">
                        <ButtonDropdown
                          :label="$t('Assign')"
                          :options="[]"
                          variant="primary"
                          size="xs"
                          @click="assignPayment(item)"
                        />
                      </template>
                    </ReusableTable>

                    <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <p>{{ $t('cashiering.mapPaymentDescription', 'Here we can see the guest which are settled in the city ledger so we can map the payment according to the booking') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex-shrink-0 px-4 py-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
              <div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('common.withSelected', 'With selected:') }}</span>
                <ButtonDropdown
                  :label="$t('Manual')"
                  :options="[]"
                  variant="secondary"
                  size="sm"
                  class="ml-2"
                />
              </div>
              <div class="flex space-x-3">
                <span class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t('common.balance', 'Balance') }}: {{ formatCurrency(33000.00) }}
                </span>
                <Button
                  :label="$t('Save')"
                  variant="primary"
                  @click="savePayment"
                />
                <Button
                  :label="$t('Close')"
                  variant="secondary"
                  @click="closeModal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import ButtonIcon from '../../components/common/ButtonIcon.vue'
import ButtonDropdown from '../../components/common/ButtonDropdown.vue'
import Button from '../../components/common/Button.vue'
import Select from '../../components/forms/FormElements/Select.vue'
import Input from '../../components/forms/FormElements/Input.vue'
import TextArea from '../../components/forms/FormElements/TextArea.vue'
import InputDatePicker from '../../components/forms/FormElements/InputDatePicker.vue'

const router = useRouter()
const { t } = useI18n()

// Loading state
const loading = ref(false)

// Form data
const formData = ref({
  cityLedgerAccount: '',
  paymentType: 'cash',
  reference: '',
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  amount: null,
  comment: ''
})

// Date range for map payment
const startDate = ref('2021-12-01')
const endDate = ref('2022-01-01')

// Sample guest data
const guestData = ref([
  {
    date: '2023-01-01',
    name: 'Emile Simalundu',
    folioNo: '295',
    user: 'helpdesk/support',
    amount: 12720.00,
    assigned: 0.00,
    open: 12720.00,
    selected: false
  },
  {
    date: '2023-01-05',
    name: 'Emma Chen',
    folioNo: '296',
    user: 'helpdesk/support',
    amount: 8500.00,
    assigned: 0.00,
    open: 8500.00,
    selected: false
  },
  {
    date: '2023-01-10',
    name: 'John Smith',
    folioNo: '297',
    user: 'helpdesk/support',
    amount: 14780.00,
    assigned: 0.00,
    open: 14780.00,
    selected: false
  }
])

// Selected guests
const selectedGuests = ref([])

// Table columns definition
const guestColumns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'name', label: 'Guest Name', sortable: true },
  { key: 'folioNo', label: 'Folio No.', sortable: true },
  { key: 'user', label: 'User', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
  { key: 'assigned', label: 'Assigned', sortable: true, type: 'currency' },
  { key: 'open', label: 'Open', sortable: true, type: 'currency' },
  { key: 'assign', label: 'Assign', sortable: false }
]

// Table actions
const guestActions = [
  { key: 'assign', label: 'Assign', icon: 'check-circle' }
]

// Methods
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount)
}

const handleGuestSelectionChange = (selected) => {
  selectedGuests.value = selected
  // Update the selected property in guestData
  guestData.value.forEach(guest => {
    guest.selected = selectedGuests.value.some(item => item.folioNo === guest.folioNo)
  })
}

const handleGuestAction = ({ action, item }) => {
  if (action === 'assign') {
    assignPayment(item)
  }
}

const assignPayment = (guest) => {
  // Logic to assign payment to this guest
  console.log('Assigning payment to guest:', guest)
  // Here you would implement the logic to assign the payment
  // For example, updating the assigned and open values
}

const savePayment = () => {
  // Validate form
  if (!formData.value.cityLedgerAccount) {
    alert('Please select a city ledger account')
    return
  }

  if (!formData.value.paymentType) {
    alert('Please select a payment type')
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
  // Simulate loading data
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>