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
            <BasicButton variant="primary" @click="openAddModal">
              <Plus class="w-4 h-4 mr-2" />
              Add Charge
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
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate Inclusive Tax
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fixed Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
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
              <tr v-for="charge in extraCharges" :key="charge.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ charge.shortCode }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ charge.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ charge.rate.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ charge.tax }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ charge.rateInclusiveTax.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="charge.fixedPrice ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                    {{ charge.fixedPrice ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ charge.createdBy }}<br>
                  <span class="text-xs text-gray-400">{{ charge.createdDate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="charge.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ charge.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="editExtraCharge(charge)" class="text-blue-600 hover:text-blue-900">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button @click="deleteExtraCharge(charge.id)" class="text-red-600 hover:text-red-900">
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
            {{ isEditing ? 'Edit Extra Charge' : 'Add Extra Charge' }}
          </h3>
          
          <form @submit.prevent="saveExtraCharge">
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
                  Name *
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter charge name"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rate *
                </label>
                <input 
                  v-model="formData.rate" 
                  type="number" 
                  step="0.01"
                  required
                  @input="calculateRateInclusiveTax"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Front Desk Sort Key
                </label>
                <input 
                  v-model="formData.frontDeskSortKey" 
                  type="number" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
import { ref, computed } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/ui/BasicButton.vue'
import { Plus, Edit, Trash } from 'lucide-vue-next'

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
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
  const rate = parseFloat(formData.value.rate) || 0
  const tax = parseFloat(formData.value.tax) || 0
  formData.value.rateInclusiveTax = rate + (rate * tax / 100)
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    shortCode: '',
    name: '',
    rate: 0,
    tax: 0,
    rateInclusiveTax: 0,
    fixedPrice: false,
    frontDeskSortKey: 1,
    publishOnWeb: false,
    voucherNo: 'auto_general'
  }
  showModal.value = true
}

const editExtraCharge = (charge) => {
  isEditing.value = true
  editingId.value = charge.id
  formData.value = { ...charge }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    shortCode: '',
    name: '',
    rate: 0,
    tax: 0,
    rateInclusiveTax: 0,
    fixedPrice: false,
    frontDeskSortKey: 1,
    publishOnWeb: false,
    voucherNo: 'auto_general'
  }
}

const saveExtraCharge = () => {
  if (isEditing.value) {
    const index = extraCharges.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      extraCharges.value[index] = {
        ...formData.value,
        id: editingId.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...extraCharges.value.map(c => c.id)) + 1
    extraCharges.value.push({
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

const deleteExtraCharge = (id) => {
  if (confirm('Are you sure you want to delete this extra charge?')) {
    const index = extraCharges.value.findIndex(c => c.id === id)
    if (index !== -1) {
      extraCharges.value.splice(index, 1)
    }
  }
}
</script>
