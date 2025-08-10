<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Pay Method</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          You may offer different payment options to your guests. Define all such Payment Types and you can use it when you settle your guest folio.
        </p>
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <BasicButton variant="primary" @click="openAddModal">
              <Plus class="w-4 h-4 mr-2" />
              Add Payment Method
            </BasicButton>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short Code
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Processing
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified By
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="method in payMethods" :key="method.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ method.shortCode }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ method.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ method.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="method.cardProcessing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                    {{ method.cardProcessing ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ method.createdBy }}<br>
                  <span class="text-xs text-gray-400">{{ method.createdDate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ method.modifiedBy }}<br>
                  <span class="text-xs text-gray-400">{{ method.modifiedDate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="method.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ method.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="editPayMethod(method)" class="text-blue-600 hover:text-blue-900">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button @click="deletePayMethod(method.id)" class="text-red-600 hover:text-red-900">
                      <Trash class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Payment Method' : 'Add Payment Method' }}
          </h3>
          
          <form @submit.prevent="savePayMethod">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Short Code *
                </label>
                <input 
                  v-model="formData.shortCode" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter short code"
                />
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Cash, VISA, MASTERCARD"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select 
                  v-model="formData.type" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="CASH">CASH</option>
                  <option value="BANK">BANK</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="flex items-center">
                  <input 
                    v-model="formData.cardProcessing" 
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">Card Processing</span>
                </label>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="flex items-center">
                <input 
                  v-model="formData.surchargeSetting" 
                  type="checkbox" 
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Surcharge Setting</span>
              </label>
            </div>
            
            <div v-if="formData.surchargeSetting" class="border border-gray-200 rounded-md p-4 mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Surcharge Configuration</h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Amount/Percent
                  </label>
                  <select 
                    v-model="formData.surchargeType" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="amount">Amount</option>
                    <option value="percent">Percentage</option>
                  </select>
                </div>
                
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <input 
                    v-model="formData.surchargeValue" 
                    type="number" 
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter value"
                  />
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Extra Charge
                </label>
                <select 
                  v-model="formData.extraCharge" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Extra Charge</option>
                  <option value="service_charge">Service Charge</option>
                  <option value="processing_fee">Processing Fee</option>
                  <option value="convenience_fee">Convenience Fee</option>
                </select>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Receipt No. Setting
              </label>
              <select 
                v-model="formData.receiptNoSetting" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto_general">Auto General</option>
                <option value="auto_private">Auto Private</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton type="button" variant="outline" @click="closeModal">
                Cancel
              </BasicButton>
              <BasicButton type="submit" variant="primary">
                {{ isEditing ? 'Update' : 'Save' }}
              </BasicButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/ui/BasicButton.vue'
import { Plus, Edit, Trash } from 'lucide-vue-next'

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
  shortCode: '',
  name: '',
  type: '',
  cardProcessing: false,
  surchargeSetting: false,
  surchargeType: 'amount',
  surchargeValue: '',
  extraCharge: '',
  receiptNoSetting: 'auto_general'
})

const payMethods = ref([
  { 
    id: 1, 
    shortCode: 'CASH', 
    name: 'Cash', 
    type: 'CASH', 
    cardProcessing: false,
    surchargeSetting: false,
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 2, 
    shortCode: 'VISA', 
    name: 'VISA Card', 
    type: 'BANK', 
    cardProcessing: true,
    surchargeSetting: true,
    surchargeType: 'percent',
    surchargeValue: 2.5,
    extraCharge: 'processing_fee',
    receiptNoSetting: 'auto_general',
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 3, 
    shortCode: 'MC', 
    name: 'MASTERCARD', 
    type: 'BANK', 
    cardProcessing: true,
    surchargeSetting: false,
    receiptNoSetting: 'auto_private',
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 4, 
    shortCode: 'CHQ', 
    name: 'Cheque', 
    type: 'BANK', 
    cardProcessing: false,
    surchargeSetting: false,
    receiptNoSetting: 'manual',
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  }
])

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    shortCode: '',
    name: '',
    type: '',
    cardProcessing: false,
    surchargeSetting: false,
    surchargeType: 'amount',
    surchargeValue: '',
    extraCharge: '',
    receiptNoSetting: 'auto_general'
  }
  showModal.value = true
}

const editPayMethod = (method) => {
  isEditing.value = true
  editingId.value = method.id
  formData.value = { ...method }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    shortCode: '',
    name: '',
    type: '',
    cardProcessing: false,
    surchargeSetting: false,
    surchargeType: 'amount',
    surchargeValue: '',
    extraCharge: '',
    receiptNoSetting: 'auto_general'
  }
}

const savePayMethod = () => {
  if (isEditing.value) {
    const index = payMethods.value.findIndex(m => m.id === editingId.value)
    if (index !== -1) {
      payMethods.value[index] = {
        ...formData.value,
        id: editingId.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...payMethods.value.map(m => m.id)) + 1
    payMethods.value.push({
      ...formData.value,
      id: newId,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    })
  }
  closeModal()
}

const deletePayMethod = (id) => {
  if (confirm('Are you sure you want to delete this payment method?')) {
    const index = payMethods.value.findIndex(m => m.id === id)
    if (index !== -1) {
      payMethods.value.splice(index, 1)
    }
  }
}
</script>
