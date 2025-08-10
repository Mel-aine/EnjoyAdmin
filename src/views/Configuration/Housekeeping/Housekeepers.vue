<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Housekeepers</h1>
        <BasicButton variant="primary" @click="openAddModal">
          <Plus class="w-4 h-4 mr-2" />
          Add Housekeeper
        </BasicButton>
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <p class="text-gray-600 mb-6">
            Enter the name of all the housekeepers from here. To add a new housekeeper, simply click on "Add Housekeeper" button and enter details.
          </p>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Housekeeper
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
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
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="housekeeper in housekeepers" :key="housekeeper.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ housekeeper.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ housekeeper.mobile }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{{ housekeeper.createdBy }}</div>
                    <div class="text-xs text-gray-400">on {{ housekeeper.createdDate }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{{ housekeeper.modifiedBy }}</div>
                    <div class="text-xs text-gray-400">on {{ housekeeper.modifiedDate }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      housekeeper.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ housekeeper.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <BasicButton variant="outline" size="sm" @click="editHousekeeper(housekeeper)" class="mr-2">
                      <Edit class="w-4 h-4" />
                    </BasicButton>
                    <BasicButton variant="danger" size="sm" @click="deleteHousekeeper(housekeeper.id)">
                      <Trash class="w-4 h-4" />
                    </BasicButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Housekeeper' : 'Add Housekeeper' }}
          </h3>
          
          <form @submit.prevent="saveHousekeeper">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Housekeeper Name *
              </label>
              <input 
                v-model="formData.name" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter housekeeper name"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input 
                v-model="formData.mobile" 
                type="tel" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter mobile number"
              />
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
  name: '',
  mobile: ''
})

const housekeepers = ref([
  { 
    id: 1, 
    name: 'Maid 1', 
    mobile: '420', 
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Available' 
  },
  { 
    id: 2, 
    name: 'Maid 2', 
    mobile: '789456', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Available' 
  }
])

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    mobile: ''
  }
  showModal.value = true
}

const editHousekeeper = (housekeeper) => {
  isEditing.value = true
  editingId.value = housekeeper.id
  formData.value = {
    name: housekeeper.name,
    mobile: housekeeper.mobile
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    name: '',
    mobile: ''
  }
}

const saveHousekeeper = () => {
  if (isEditing.value) {
    const index = housekeepers.value.findIndex(h => h.id === editingId.value)
    if (index !== -1) {
      housekeepers.value[index] = {
        ...housekeepers.value[index],
        name: formData.value.name,
        mobile: formData.value.mobile,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...housekeepers.value.map(h => h.id)) + 1
    housekeepers.value.push({
      id: newId,
      name: formData.value.name,
      mobile: formData.value.mobile,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Available'
    })
  }
  closeModal()
}

const deleteHousekeeper = (id) => {
  if (confirm('Are you sure you want to delete this housekeeper?')) {
    const index = housekeepers.value.findIndex(h => h.id === id)
    if (index !== -1) {
      housekeepers.value.splice(index, 1)
    }
  }
}
</script>