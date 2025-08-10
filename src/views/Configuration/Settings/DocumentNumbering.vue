<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Document Numbering</h1>
          <p class="text-gray-600 mt-1">
            Manage the numbering of different documents generated in the hotel. Set prefixes and reset options for various document types.
          </p>
        </div>
        <BasicButton variant="primary" icon="Save" label="Save Changes" @click="saveDocumentNumbering" />
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="space-y-8">
            <!-- Document Types Configuration -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Document Types</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div v-for="document in documentTypes" :key="document.key" class="border border-gray-200 rounded-lg p-4">
                  <h4 class="text-md font-medium text-gray-900 mb-4">{{ document.name }}</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Prefix
                      </label>
                      <Input
                        v-model="document.prefix"
                        placeholder="Enter prefix"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Next Number
                      </label>
                      <Input
                        v-model="document.nextNumber"
                        type="number"
                        placeholder="Enter next number"
                      />
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Reset Frequency
                    </label>
                    <Select
                      v-model="document.resetFrequency"
                      :options="resetFrequencyOptions"
                      placeholder="Select reset frequency"
                    />
                  </div>
                  
                  <div class="mt-4 p-3 bg-gray-50 rounded-md">
                    <p class="text-sm font-medium text-gray-700">Preview:</p>
                    <p class="text-sm text-gray-600 mt-1">{{ document.prefix }}{{ String(document.nextNumber).padStart(4, '0') }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Reset Options -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Reset Options</h3>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h4 class="text-sm font-medium text-yellow-800">Reset Document Numbers</h4>
                    <p class="text-sm text-yellow-700 mt-1">
                      Use these options to reset document numbers. This action cannot be undone.
                    </p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <BasicButton 
                        variant="outline" 
                        size="sm" 
                        @click="resetNumbers('daily')"
                      >
                        Reset Daily Numbers
                      </BasicButton>
                      <BasicButton 
                        variant="outline" 
                        size="sm" 
                        @click="resetNumbers('monthly')"
                      >
                        Reset Monthly Numbers
                      </BasicButton>
                      <BasicButton 
                        variant="outline" 
                        size="sm" 
                        @click="resetNumbers('yearly')"
                      >
                        Reset Yearly Numbers
                      </BasicButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'

const documentTypes = ref([
  {
    key: 'guestRegistration',
    name: 'Guest Registration',
    prefix: 'GR',
    nextNumber: 1001,
    resetFrequency: 'yearly'
  },
  {
    key: 'guestFolio',
    name: 'Guest Folio',
    prefix: 'GF',
    nextNumber: 2001,
    resetFrequency: 'monthly'
  },
  {
    key: 'reservation',
    name: 'Reservation',
    prefix: 'RES',
    nextNumber: 3001,
    resetFrequency: 'yearly'
  },
  {
    key: 'cancelReservation',
    name: 'Cancel Reservation',
    prefix: 'CR',
    nextNumber: 4001,
    resetFrequency: 'yearly'
  },
  {
    key: 'extraChargeVoucher',
    name: 'Extra Charge Voucher',
    prefix: 'ECV',
    nextNumber: 5001,
    resetFrequency: 'monthly'
  },
  {
    key: 'receipt',
    name: 'Receipt',
    prefix: 'RCP',
    nextNumber: 6001,
    resetFrequency: 'daily'
  },
  {
    key: 'guestInvoice',
    name: 'Guest Invoice',
    prefix: 'INV',
    nextNumber: 7001,
    resetFrequency: 'monthly'
  },
  {
    key: 'workOrder',
    name: 'Work Order',
    prefix: 'WO',
    nextNumber: 8001,
    resetFrequency: 'monthly'
  },
  {
    key: 'incidentalInvoice',
    name: 'Incidental Invoice',
    prefix: 'II',
    nextNumber: 9001,
    resetFrequency: 'monthly'
  }
])

const resetFrequencyOptions = [
  { label: 'Never', value: 'never' },
  { label: 'Daily', value: 'daily' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]

const resetNumbers = (frequency) => {
  const confirmMessage = `Are you sure you want to reset all ${frequency} document numbers? This action cannot be undone.`
  if (confirm(confirmMessage)) {
    documentTypes.value.forEach(doc => {
      if (doc.resetFrequency === frequency) {
        doc.nextNumber = 1
      }
    })
    alert(`${frequency.charAt(0).toUpperCase() + frequency.slice(1)} document numbers have been reset.`)
  }
}

const saveDocumentNumbering = () => {
  // TODO: Implement save functionality
  console.log('Save document numbering configuration:', documentTypes.value)
  alert('Document numbering configuration saved successfully!')
}
</script>
