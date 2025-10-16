<template>
  <div class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-end z-50">
    <div class="bg-white rounded-l-lg shadow-xl w-full max-w-7xl max-h-[100vh] overflow-hidden h-full flex flex-col">
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
      <div class="p-6 overflow-y-scroll max-h-[calc(100vh-140px)] flex-1">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Left Column -->
          <!-- Contact Information -->
          <div class="space-y-4">
            <Select v-model="form.contactType" :options="contactTypeOptions" :placeholder="$t('guest')"
              :lb="$t('contact_type')" />
          </div>

          <div class="space-y-4">
            <InputAddNameSearch v-model="form.customerName" :placeholder="$t('Name')" :lb="$t('Name')"
              @search="searchGuest" @customerSelected="handleCustomerSelected" />
          </div>





          <div class="space-y-4">
            <InputDatePicker v-model="form.voucherDate" :title="$t('date')"></InputDatePicker>
          </div>

        </div>
        <!-- payment -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-5">

          <!-- Payment Information -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">{{ $t('payment_type') }}</label>
            </div>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.paymentType" value="cash" class="mr-2" />
                {{ $t('cash') }}
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.paymentType" value="city_ledger" class="mr-2" />
                {{ $t('city_ledger')}}
              </label>
            </div>
          </div>

          <div class="space-y-4">
            <InputPaymentMethodSelect :paymentType="form.paymentType" v-model="form.paymentMethod" custom-class="rounded-none" />
          </div>
        </div>
        <!-- Charges Section -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('charges') }}</h3>

          </div>

          <div class="overflow-visible">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('sr_no') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('ref_no') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('particular') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('Qty') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('discount') }}</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('comments') }}</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('amount') }}</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 capitalize tracking-wider">{{
                    $t('action') }}</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(charge, index) in form.charges" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ charge.refNo }}
                  </td>
                  <td class=" w-50 px-6 py-4 whitespace-nowrap">
                    <InputExtractChargeSelect v-model="charge.particular" :hide-label="true" @select="(selectedCharge) => handleChargeChange(selectedCharge, index)" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Input type="number" v-model="charge.quantity" class="w-20 text-center" min="1" step="1" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <InputDiscountSelect v-model="charge.discount" hide-label />
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <Input v-model="charge.comments" :placeholder="$t('comments')" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <InputCurrency v-model="charge.amount" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <BasicButton :label="$t('add')" variant="primary" size="sm" @click="addCharge"
                      v-if="index === form.charges.length - 1" />
                    <button v-else @click="removeCharge(index)" class="text-red-600 hover:text-red-800">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
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
          <BasicButton :label="$t('cancel')" variant="secondary" @click="$emit('close')" />
          <BasicButton :label="$t('pay')" variant="primary" @click="saveInvoice" :disabled="!isFormValid || isLoading" :loading="isLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '../../components/forms/FormElements/Input.vue'
import InputAddNameSearch from '../../components/forms/FormElements/InputAddNameSearch.vue'
import Select from '../../components/forms/FormElements/Select.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import InputDiscountSelect from '../../components/reservations/foglio/InputDiscountSelect.vue'
import InputExtractChargeSelect from '../../components/reservations/foglio/InputExtractChargeSelect.vue'
import InputCurrency from '../../components/forms/FormElements/InputCurrency.vue'
import InputDatePicker from '../../components/forms/FormElements/InputDatePicker.vue'
import InputPaymentMethodSelect from '../../components/reservations/foglio/InputPaymentMethodSelect.vue'
import { useServiceStore } from '../../composables/serviceStore'
import { postIncidentalInvoices } from '../../services/configrationApi'
import { prepareFolioAmount, safeParseFloat } from '../../utils/numericUtils'
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const toast = useToast()

// Emits
const emit = defineEmits(['close', 'invoice-created'])

// Loading state
const isLoading = ref(false)

// Form data
const form = ref({
  contactType: 'guest',
  guestId: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  selectedCustomer: null,
  paymentType: 'cash',
  paymentMethod: 0,
  voucherNumber: '',
  voucherDate: new Date().toISOString().split('T')[0],
  charges: <any[]>[
    {
      refNo: '',
      particular: '',
      quantity: 1,
      discount: '',
      comments: '',
      amount: 0
    }
  ],
})

// Options
const contactTypeOptions = ref([
  { label: 'Guest', value: 'guest' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Company', value: 'company' }
])


// Computed
const totalCharges = computed(() => {
  return form.value.charges.reduce((sum, charge) => sum + (parseFloat(`${charge.amount}`) || 0), 0)
})


const balance = computed(() => {
  return (totalCharges.value).toFixed(2)
})

const isFormValid = computed(() => {
  return form.value.customerName && form.value.charges.some(c => c.particular && c.amount > 0)
})

// Methods
function searchGuest() {
  console.log('Searching for guest...')
  // Implement guest search functionality
}

function handleCustomerSelected(customer: any) {
  if (customer) {
    // Update form data with selected customer information
    form.value.customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
    form.value.customerPhone = customer.phoneNumber || customer.phonePrimary || '';
    form.value.customerEmail = customer.email || '';
    form.value.guestId = customer.id

    // Store full customer data for invoice creation
    form.value.selectedCustomer = customer;

    console.log('Customer selected:', customer);
  } else {
    // Clear customer data if no customer selected
    form.value.selectedCustomer = null;
  }
}

function addCharge() {
  form.value.charges.push({
    refNo: '',
    particular: '',
    quantity: 1,
    discount: '',
    comments: '',
    amount: 0,
    rateInclusiveTax: 0,
    taxAmount: 0,
  })
}

function removeCharge(index: number) {
  form.value.charges.splice(index, 1)
}

function handleChargeChange(selectedCharge: any, chargeIndex: number) {
  if (selectedCharge && selectedCharge.rateInclusiveTax && chargeIndex !== undefined) {
    const charge = form.value.charges[chargeIndex]
    if (charge) {
      // Calculate amount based on quantity
      const quantity = charge.quantity || 1
      charge.amount = selectedCharge.rateInclusiveTax * quantity
      // Store additional charge data for invoice creation
      charge.name = selectedCharge.name || selectedCharge.charge_name
      charge.rateInclusiveTax = selectedCharge.rateInclusiveTax
      charge.taxAmount = selectedCharge.taxAmount || 0

      console.log('Charge selected:', selectedCharge)
      console.log('Updated charge amount to:', charge.amount, 'for quantity:', quantity)
    }
  }
}

// Watch for quantity changes to recalculate amounts
watch(
  () => form.value.charges.map(charge => charge.quantity),
  (newQuantities, oldQuantities) => {
    if (oldQuantities) {
      newQuantities.forEach((newQty, index) => {
        const oldQty = oldQuantities[index]
        if (newQty !== oldQty && form.value.charges[index].rateInclusiveTax) {
          const charge = form.value.charges[index]
          charge.amount = charge.rateInclusiveTax * (newQty || 1)
          console.log('Quantity changed for charge', index, 'new amount:', charge.amount)
        }
      })
    }
  },
  { deep: true }
)

async function saveInvoice() {
  if (isLoading.value) return
  if (!form.value.paymentMethod) {
    toast.error(t('Please select a payment method'))
    return
  }
  if(!form.value.guestId) {
    toast.error(t('Please select a guest'))
    return
  }
  if (!form.value.charges.some(c => c.particular && c.amount > 0)) {
    toast.error(t('Please add at least one charge with a valid amount'))
    return
  }
  try {
    isLoading.value = true

    // Map form data to API structure
    const invoiceData = {
      hotelId: useServiceStore().serviceId,
      guestId: parseInt(form.value.guestId),
      date: new Date(form.value.voucherDate).toISOString(),
      charges: form.value.charges.filter(c => c.particular && c.amount > 0).map(charge => ({
        transactionType: 'charge',
        category: 'extract_charge',
        description: charge?.name,
        amount: prepareFolioAmount(charge.amount),
        quantity: safeParseFloat(charge.quantity, 1),
        unitPrice: safeParseFloat(charge?.rateInclusiveTax, 0),
        taxAmount: safeParseFloat(charge?.taxAmount, 0),
        departmentId: '',
        reference: '',
        extraChargeId:charge?.particular,
        notes: charge.comments || '',
        discountId: Number(charge.discount),
      })),
      paymentType:  form.value.paymentType,
      paymentMethodId: form.value.paymentMethod,
      description: `Voice Incidence - ${form.value.contactType} Services`,
      notes: form.value.charges.map(c => c.comments).filter(Boolean).join('; ') || 'Invoice created from POS system'
    }

    // Call the API
    const response = await postIncidentalInvoices(invoiceData)

    if (response.data) {
      // Show success toast
      toast.success(t('Invoice created successfully!'))

      // Emit success event with the created invoice
      emit('invoice-created', response.data)
    } else {
      toast.error(t('Failed to create invoice. Please try again.'))
    }
  } catch (error:any) {
    console.error('Error creating invoice:', error)
    const errorMessage = error?.response?.data?.message || error?.message || t('An error occurred while creating the invoice.')
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>
