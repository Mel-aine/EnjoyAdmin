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
            <BasicButton variant="primary" @click="openAddModal" icon="Plus" label="Add Payment Method" />
          </div>
        </div>

        <ReusableTable
          title="Payment Methods"
          :columns="columns"
          :data="payMethods"
          :actions="actions"
          @action="onAction"
          search-placeholder="Search payment methods..."
          empty-title="No payment methods found"
          empty-description="Get started by adding your first payment method."
        >
          <template #cardProcessing="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                  :class="item.cardProcessing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
              {{ item.cardProcessing ? 'Yes' : 'No' }}
            </span>
          </template>
          
          <template #status="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                  :class="item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ item.status }}
            </span>
          </template>
        </ReusableTable>
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
                <Input 
                  v-model="formData.shortCode" 
                  label="Short Code *"
                  type="text" 
                  required
                  placeholder="Enter short code"
                />
              </div>
              
              <div class="mb-4">
                <Input 
                  v-model="formData.name" 
                  label="Payment Method *"
                  type="text" 
                  required
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
                  <Input 
                    v-model="formData.surchargeValue" 
                    label="Value"
                    type="number" 
                    step="0.01"
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
              <BasicButton type="button" variant="outline" @click="closeModal" label="Cancel" />
              <BasicButton type="submit" variant="primary" :label="isEditing ? 'Update' : 'Save'" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import ReusableTable from '../../../components/tables/ReusableTable.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const columns = [
  { key: 'shortCode', label: 'Short Code' },
  { key: 'name', label: 'Payment Method' },
  { key: 'type', label: 'Type' },
  { key: 'cardProcessing', label: 'Card Processing' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'modifiedBy', label: 'Modified By' },
  { key: 'status', label: 'Status' }
]

const actions = [
  { key: 'edit', label: 'Edit', variant: 'outline' },
  { key: 'delete', label: 'Delete', variant: 'danger' }
]

const formData = reactive({
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
  Object.assign(formData, {
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
  showModal.value = true
}

const editPayMethod = (method: any) => {
  isEditing.value = true
  editingId.value = method.id
  Object.assign(formData, method)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  Object.assign(formData, {
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
}

const savePayMethod = () => {
  if (isEditing.value) {
    const index = payMethods.value.findIndex(m => m.id === editingId.value)
    if (index !== -1) {
      payMethods.value[index] = {
        ...formData,
        id: editingId.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...payMethods.value.map(m => m.id)) + 1
    payMethods.value.push({
      ...formData,
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

const deletePayMethod = (id: number) => {
  if (confirm('Are you sure you want to delete this payment method?')) {
    const index = payMethods.value.findIndex(m => m.id === id)
    if (index !== -1) {
      payMethods.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editPayMethod(item)
  } else if (action === 'delete') {
    deletePayMethod(item.id)
  }
}
</script>
