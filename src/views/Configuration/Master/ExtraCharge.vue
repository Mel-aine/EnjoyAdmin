<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Extra Charge</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          Add all the extra charges for the services you offer in your hotel from this screen.
        </p>
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <BasicButton variant="primary" @click="openAddModal" icon="Plus" label="Add Charge" />
          </div>
        </div>

        <ReusableTable
          title="Extra Charges Management"
          :columns="columns"
          :data="extraCharges"
          :actions="actions"
          search-placeholder="Search extra charges..."
          empty-title="No extra charges found"
          empty-description="Start by adding your first extra charge."
          @action="onAction"
        >
          <template #fixedPrice="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                  :class="item.fixedPrice ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
              {{ item.fixedPrice ? 'Yes' : 'No' }}
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
            {{ isEditing ? 'Edit Extra Charge' : 'Add Extra Charge' }}
          </h3>
          
          <form @submit.prevent="saveExtraCharge">
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
                  label="Name *"
                  type="text" 
                  required
                  placeholder="Enter charge name"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <Input 
                  v-model="formData.rate" 
                  label="Rate *"
                  type="number" 
                  step="0.01"
                  required
                  @input="calculateRateInclusiveTax"
                  placeholder="Enter rate amount"
                />
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tax (%)
                </label>
                <select 
                  v-model="formData.tax" 
                  @change="calculateRateInclusiveTax"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="0">No Tax</option>
                  <option value="5">5% GST</option>
                  <option value="12">12% GST</option>
                  <option value="18">18% GST</option>
                  <option value="28">28% GST</option>
                </select>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Rate Inclusive Tax
              </label>
              <input 
                v-model="formData.rateInclusiveTax" 
                type="number" 
                step="0.01"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Auto calculated"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="flex items-center">
                  <input 
                    v-model="formData.fixedPrice" 
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">Fixed Price</span>
                </label>
              </div>
              
              <div class="mb-4">
                <Input 
                  v-model="formData.frontDeskSortKey" 
                  label="Front Desk Sort Key"
                  type="number" 
                  placeholder="Enter sort order"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="flex items-center">
                  <input 
                    v-model="formData.publishOnWeb" 
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">Publish on web</span>
                </label>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Voucher No.
                </label>
                <select 
                  v-model="formData.voucherNo" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="auto_general">Auto General</option>
                  <option value="auto_private">Auto Private</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
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
  { key: 'name', label: 'Name' },
  { key: 'rate', label: 'Rate' },
  { key: 'tax', label: 'Tax %' },
  { key: 'rateInclusiveTax', label: 'Rate Inc. Tax' },
  { key: 'fixedPrice', label: 'Fixed Price' },
  { key: 'status', label: 'Status' }
]

const actions = [
  { key: 'edit', label: 'Edit', variant: 'outline' },
  { key: 'delete', label: 'Delete', variant: 'danger' }
]

const formData = reactive({
  shortCode: '',
  name: '',
  rate: 0,
  tax: 0,
  rateInclusiveTax: 0,
  fixedPrice: false,
  frontDeskSortKey: 1,
  publishOnWeb: false,
  voucherNo: 'auto_general'
})

const extraCharges = ref([
  { 
    id: 1, 
    shortCode: 'WIFI', 
    name: 'WiFi Service', 
    rate: 10.00, 
    tax: 18,
    rateInclusiveTax: 11.80,
    fixedPrice: true,
    frontDeskSortKey: 1,
    publishOnWeb: true,
    voucherNo: 'auto_general',
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 2, 
    shortCode: 'LAUNDRY', 
    name: 'Laundry Service', 
    rate: 25.00, 
    tax: 12,
    rateInclusiveTax: 28.00,
    fixedPrice: false,
    frontDeskSortKey: 2,
    publishOnWeb: true,
    voucherNo: 'auto_private',
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 3, 
    shortCode: 'PARKING', 
    name: 'Parking Fee', 
    rate: 15.00, 
    tax: 5,
    rateInclusiveTax: 15.75,
    fixedPrice: true,
    frontDeskSortKey: 3,
    publishOnWeb: false,
    voucherNo: 'manual',
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 4, 
    shortCode: 'MINIBAR', 
    name: 'Mini Bar', 
    rate: 50.00, 
    tax: 28,
    rateInclusiveTax: 64.00,
    fixedPrice: false,
    frontDeskSortKey: 4,
    publishOnWeb: true,
    voucherNo: 'auto_general',
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  }
])

const calculateRateInclusiveTax = () => {
  const rate = parseFloat(formData.rate) || 0
  const tax = parseFloat(formData.tax) || 0
  formData.rateInclusiveTax = rate + (rate * tax / 100)
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(formData, {
    shortCode: '',
    name: '',
    rate: 0,
    tax: 0,
    rateInclusiveTax: 0,
    fixedPrice: false,
    frontDeskSortKey: 1,
    publishOnWeb: false,
    voucherNo: 'auto_general'
  })
  showModal.value = true
}

const editExtraCharge = (charge: any) => {
  isEditing.value = true
  editingId.value = charge.id
  Object.assign(formData, charge)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  Object.assign(formData, {
    shortCode: '',
    name: '',
    rate: 0,
    tax: 0,
    rateInclusiveTax: 0,
    fixedPrice: false,
    frontDeskSortKey: 1,
    publishOnWeb: false,
    voucherNo: 'auto_general'
  })
}

const saveExtraCharge = () => {
  if (isEditing.value) {
    const index = extraCharges.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      extraCharges.value[index] = {
        ...formData,
        id: editingId.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...extraCharges.value.map(c => c.id)) + 1
    extraCharges.value.push({
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

const deleteExtraCharge = (id: number) => {
  if (confirm('Are you sure you want to delete this extra charge?')) {
    const index = extraCharges.value.findIndex(c => c.id === id)
    if (index !== -1) {
      extraCharges.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  if (action === 'edit') {
    editExtraCharge(item)
  } else if (action === 'delete') {
    deleteExtraCharge(item.id)
  }
}
</script>
