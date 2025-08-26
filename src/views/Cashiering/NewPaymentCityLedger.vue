<template>
  <div class="fixed inset-0 overflow-hidden z-999999" aria-labelledby="slide-over-title" role="dialog"
    aria-modal="true">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-gray-500/25 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="relative w-screen max-w-6xl">

          <!-- Slide-over panel -->
          <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <!-- Header -->
            <div class="px-4 py-2 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-start justify-between">
                <h2 class="text-sm font-medium text-gray-900 dark:text-white" id="slide-over-title">{{
                  $t('New Payment') }}</h2>
                <XIcon @click="closeModal" class="text-gray-300 hover:text-white" aria-label="Close panel" />
              </div>
            </div>

            <!-- Main content -->
            <div class="flex-1 overflow-y-auto">
              <div class="px-4 py-5 sm:p-6">
                <!-- Payment Form -->
                <div class="space-y-4">
                  <!-- Section Header
                  <div class="bg-blue-50 dark:bg-blue-900 rounded-md p-3">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">{{
                      $t('cashiering.paymentFromCityLedger', 'Payment from City Ledger') }}</h3>
                  </div> -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <!-- City Ledger Account -->
                    <Select lb="City Ledger" v-model="formData.cityLedgerAccount" :options="[
                      { label: 'Select', value: '' },
                      { label: 'AGODA TRAVELERS', value: 'AGODA TRAVELERS' },
                      { label: 'BOOKING.COM', value: 'BOOKING.COM' },
                      { label: 'EXPEDIA', value: 'EXPEDIA' }
                    ]" :isRequired="true" />

                    <!-- Date -->
                    <InputDatePicker :title="'Date'" v-model="formData.date" :isRequired="true" />

                    <!-- Payment Type -->
                    <Select lb="Payment Type" v-model="formData.paymentType" :options="[
                      { label: 'Select', value: '' },
                      { label: 'Cash', value: 'cash' },
                      { label: 'Credit Card', value: 'credit' },
                      { label: 'Bank Transfer', value: 'bank' }
                    ]" :isRequired="true" />

                    <!-- Payment method -->
                    <Select lb="Payment Method" v-model="formData.paymentMethod" :options="[
                      { label: 'Select', value: '' },
                      { label: 'Cash', value: 'cash' },
                      { label: 'Credit Card', value: 'credit' },
                      { label: 'Bank Transfer', value: 'bank' }
                    ]" :isRequired="true" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <!--amount-->
                    <div class="col-span-2">
                      <InputCurrency lb="Amount" v-model="formData.amount" :isRequired="true" placeholder="0.00"
                        step="0.01" />

                    </div>
                    <div class="col-span-3">
                      <Input :lb="$t('comment')" v-model="formData.comment" />
                    </div>
                  </div>
                  <!-- Map Payment Section -->
                  <h4 class="text-md mt-2 font-medium text-gray-900 dark:text-white mb-4">{{ $t('cashiering.mapPayment',
                    'Map Payment') }}</h4>

                  <div class="mt-2 grid grid-cols-12 align-middle items-center gap-3">

                    <!-- Select Options -->
                    <div class="col-span-2">
                      <Select lb="Options" :options="[{ label: 'Select', value: '' }]" />
                    </div>
                    <!-- Date Range -->
                    <div class="flex flex-col gap-2 col-span-4">
                      <div>
                        <RadioGroup class="flex space-x-4" :options="[
                          { label: 'Posting date', value: 'posting' },
                          { label: 'Departure date', value: 'departure' },
                        ]" />

                      </div>
                      <div class="mr-4">
                        <InputDoubleDatePicker lb="Posting Date" v-model:startDate="formData.startDate"
                          v-model:endDate="formData.endDate" />
                      </div>
                    </div>
                    <div class="col-span-5">
                      <Input :lb="$t('res.no')" v-model="formData.resNo" />
                    </div>
                    <div class="justify-center align-middle pt-6">
                      <BasicButton :label="t('Search')" :icon="SearchCodeIcon"></BasicButton>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Guest Data Table -->
              <ReusableTable :columns="guestColumns" :data="guestData" :selectable="true" :loading="loading"
                @selection-change="handleGuestSelectionChange" :searchable="false" :show-header="false">
                <!-- Custom cell for Date column -->
                <template #column-date="{ item }">
                  <span class="text-xs text-gray-900 dark:text-white">{{ formatDate(item.date) }}</span>
                </template>

                <!-- Custom cell for Name column -->
                <template #cell-name="{ item }">
                  <span class="text-xs font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
                </template>

                <!-- Custom cell for Amount column -->
                <template #cell-amount="{ item }">
                  <span class="text-xs font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.amount)
                  }}</span>
                </template>

                <!-- Custom cell for Assigned column -->
                <template #cell-assigned="{ item }">
                  <span class="text-xs text-gray-900 dark:text-white">{{ formatCurrency(item.assigned) }}</span>
                </template>
                <template #column-assign="{ item }">
                  <Input v-model="item.assign" />
                </template>

                <!-- Custom cell for Open column -->
                <template #cell-open="{ item }">
                  <span class="text-xs text-gray-900 dark:text-white">{{ formatCurrency(item.open) }}</span>
                </template>


              </ReusableTable>
            </div>


            <!-- Footer -->
            <div class="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200 dark:border-gray-700">

              <div class="flex space-x-3">
                <span class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t('Balance') }}: {{ formatCurrency(33000.00) }}
                </span>
                <BasicButton :label="$t('Close')" variant="secondary" @click="closeModal" />
                <BasicButton :label="$t('Save')" variant="primary" @click="savePayment" :icon="Save" />
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
import Select from '../../components/forms/FormElements/Select.vue'
import Input from '../../components/forms/FormElements/Input.vue'
import InputDatePicker from '../../components/forms/FormElements/InputDatePicker.vue'
import { Save, Search, SearchCodeIcon, SearchIcon, SearchSlash, XIcon } from 'lucide-vue-next'
import InputCurrency from '../../components/forms/FormElements/InputCurrency.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import { formatCurrency } from '../../utils/numericUtils'
import RadioGroup from '../../components/forms/FormElements/RadioGroup .vue'

const router = useRouter()
const { t } = useI18n()

// Loading state
const loading = ref(false)
const emit = defineEmits(['close'])
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
  { key: 'assign', label: 'Assign', sortable: false, type: 'custom' }
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
  emit('close')
}

onMounted(() => {
  // Simulate loading data
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>