<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">{{ $t('add') }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Contact Information -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <span class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                <label class="text-sm font-medium text-gray-700">{{ $t('contact_type') }}</label>
              </div>
              <Select 
                v-model="form.contactType" 
                :options="contactTypeOptions"
                :placeholder="$t('guest')"
              />
            </div>

            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <span class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</span>
                <label class="text-sm font-medium text-gray-700">{{ $t('name') }}</label>
              </div>
              <div class="relative">
                <Input 
                  v-model="form.customerName" 
                  :placeholder="$t('full_name')"
                  class="pr-10"
                />
                <button 
                  @click="searchGuest" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
                <div class="absolute right-12 top-1/2 transform -translate-y-1/2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  {{ $t('if_guest_vendor_ta_owner_already_added_then_you_can_search_guest_with_this_icon') }}
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <span class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">7</span>
                <label class="text-sm font-medium text-gray-700">{{ $t('payment_type') }}</label>
              </div>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="form.paymentType" 
                    value="debit" 
                    class="mr-2"
                  />
                  {{ $t('debit') }}
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="form.paymentType" 
                    value="credit" 
                    class="mr-2"
                  />
                  {{ $t('credit') }}
                </label>
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-sm font-medium text-gray-700">{{ $t('payment_method') }}</label>
              <Select 
                v-model="form.paymentMethod" 
                :options="paymentMethodOptions"
                :placeholder="$t('select')"
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Invoice Details -->
            <div class="space-y-4">
              <label class="text-sm font-medium text-gray-700">{{ $t('voucher_number') }}</label>
              <Input v-model="form.voucherNumber" :placeholder="$t('auto_generated')" disabled />
            </div>

            <div class="space-y-4">
              <label class="text-sm font-medium text-gray-700">{{ $t('voucher_date') }}</label>
              <Input 
                type="date" 
                v-model="form.voucherDate" 
              />
            </div>

            <div class="space-y-4">
              <label class="text-sm font-medium text-gray-700">{{ $t('prepared_by') }}</label>
              <Input v-model="form.preparedBy" :placeholder="$t('helpdesksupport')" />
            </div>
          </div>
        </div>

        <!-- Charges Section -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('charges') }}</h3>
            <div class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              {{ $t('you_need_to_add_guest_first_with_help_of_this_icon') }}
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('sr_no') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('ref_no') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('particular') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('quantity') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('discount') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('discount_price') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('comments') }}</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('amount_rs') }}</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('action') }}</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(charge, index) in form.charges" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Input v-model="charge.refNo" class="w-20" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Select 
                      v-model="charge.particular" 
                      :options="particularOptions"
                      :placeholder="$t('select')"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Input 
                      type="number" 
                      v-model="charge.quantity" 
                      class="w-20 text-center"
                      min="1"
                      step="1"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Input 
                      type="number" 
                      v-model="charge.discount" 
                      class="w-20 text-center"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="%"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="mr-2">Rs</span>
                      <Input 
                        type="number" 
                        v-model="charge.discountPrice" 
                        class="w-24 text-right"
                        step="0.01"
                      />
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Input v-model="charge.comments" :placeholder="$t('comments')" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end">
                      <span class="mr-2">Rs</span>
                      <Input 
                        type="number" 
                        v-model="charge.amount" 
                        class="w-24 text-right"
                        step="0.01"
                      />
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <BasicButton 
                      :label="$t('add')"
                      variant="primary"
                      size="sm"
                      @click="addCharge"
                      v-if="index === form.charges.length - 1"
                    />
                    <button 
                      v-else
                      @click="removeCharge(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-2 text-sm text-gray-600">
            {{ $t('select_the_charges_you_want_to_add') }}
          </div>
        </div>

        <!-- Payments Section -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('payments') }}</h3>
          
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('sr_no') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('ref_no') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('type') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('comments') }}</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('amount_rs') }}</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('action') }}</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(payment, index) in form.payments" :key="index">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-4 py-3">
                    <Input v-model="payment.refNo" class="w-20" />
                  </td>
                  <td class="px-4 py-3">
                    <Select 
                      v-model="payment.type" 
                      :options="paymentTypeOptions"
                      :placeholder="$t('select')"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <Input v-model="payment.comments" :placeholder="$t('comments')" />
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <span class="mr-2">Rs</span>
                      <Input 
                        type="number" 
                        v-model="payment.amount" 
                        class="w-24 text-right"
                        step="0.01"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <BasicButton 
                      :label="$t('add')"
                      variant="primary"
                      size="sm"
                      @click="addPayment"
                      v-if="index === form.payments.length - 1"
                    />
                    <button 
                      v-else
                      @click="removePayment(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
        <div class="text-sm text-gray-600">
          {{ $t('balance') }}: {{ balance }}
        </div>
        <div class="flex space-x-3">
          <BasicButton 
            :label="$t('cancel')"
            variant="secondary"
            @click="$emit('close')"
          />
          <BasicButton 
            :label="$t('save')"
            variant="primary"
            @click="saveInvoice"
            :disabled="!isFormValid"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '../../components/forms/FormElements/Input.vue'
import Select from '../../components/forms/FormElements/Select.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'

const { t } = useI18n()

// Emits
const emit = defineEmits(['close', 'invoice-created'])

// Form data
const form = ref({
  contactType: 'guest',
  customerName: '',
  paymentType: 'debit',
  paymentMethod: '',
  voucherNumber: '',
  voucherDate: new Date().toISOString().split('T')[0],
  preparedBy: 'helpdesksupport',
  charges: [
    {
      refNo: '',
      particular: '',
      comments: '',
      amount: 0
    }
  ],
  payments: [
    {
      refNo: '',
      type: '',
      comments: '',
      amount: 0
    }
  ]
})

// Options
const contactTypeOptions = ref([
  { label: 'Guest', value: 'guest' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Company', value: 'company' }
])

const paymentMethodOptions = ref([
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Bank Transfer', value: 'bank_transfer' }
])

const particularOptions = ref([
  { label: 'JUICE', value: 'juice' },
  { label: 'FOOD', value: 'food' },
  { label: 'SERVICE', value: 'service' },
  { label: 'LAUNDRY', value: 'laundry' }
])

const paymentTypeOptions = ref([
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Cheque', value: 'cheque' }
])

// Computed
const totalCharges = computed(() => {
  return form.value.charges.reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0)
})

const totalPayments = computed(() => {
  return form.value.payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0)
})

const balance = computed(() => {
  return (totalCharges.value - totalPayments.value).toFixed(2)
})

const isFormValid = computed(() => {
  return form.value.customerName && form.value.charges.some(c => c.particular && c.amount > 0)
})

// Methods
function searchGuest() {
  console.log('Searching for guest...')
  // Implement guest search functionality
}

function addCharge() {
  form.value.charges.push({
    refNo: '',
    particular: '',
    comments: '',
    amount: 0
  })
}

function removeCharge(index) {
  form.value.charges.splice(index, 1)
}

function addPayment() {
  form.value.payments.push({
    refNo: '',
    type: '',
    comments: '',
    amount: 0
  })
}

function removePayment(index) {
  form.value.payments.splice(index, 1)
}

function saveInvoice() {
  // Generate invoice number
  const invoiceNumber = Math.floor(Math.random() * 1000).toString()
  
  const newInvoice = {
    id: Date.now(),
    invoiceNumber,
    customerName: form.value.customerName,
    date: form.value.voucherDate,
    preparedBy: form.value.preparedBy,
    totalCharges: totalCharges.value,
    charges: form.value.charges.filter(c => c.particular && c.amount > 0).map((c, index) => ({
      id: index + 1,
      srNo: index + 1,
      refNo: c.refNo || (index + 20),
      particular: c.particular.toUpperCase(),
      comments: c.comments,
      amount: parseFloat(c.amount)
    })),
    payments: form.value.payments.filter(p => p.type && p.amount > 0).map((p, index) => ({
      id: index + 1,
      srNo: index + 1,
      refNo: p.refNo || (index + 30),
      type: p.type,
      comments: p.comments,
      amount: parseFloat(p.amount)
    }))
  }
  
  emit('invoice-created', newInvoice)
}
</script>