<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Identity Type</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          In recent times it is very important (compulsory in most of the countries) to record guest identification. Define all such Identification Types you may record.
        </p>
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <BasicButton 
              variant="primary" 
              :icon="Plus"
              label="Add Identity Type"
              @click="openAddModal"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identity Type Name
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
              <tr v-for="identityType in identityTypes" :key="identityType.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ identityType.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ identityType.createdBy }}<br>
                  <span class="text-xs text-gray-400">{{ identityType.createdDate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ identityType.modifiedBy }}<br>
                  <span class="text-xs text-gray-400">{{ identityType.modifiedDate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="identityType.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ identityType.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="editIdentityType(identityType)" class="text-blue-600 hover:text-blue-900">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button @click="deleteIdentityType(identityType.id)" class="text-red-600 hover:text-red-900">
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
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Identity Type' : 'Add Identity Type' }}
          </h3>
          
          <form @submit.prevent="saveIdentityType">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Identity Type Name *
              </label>
              <input 
                v-model="formData.name" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Passport, Driver's License, National ID"
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
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { Plus, Edit, Trash } from 'lucide-vue-next'

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
  name: ''
})

const identityTypes = ref([
  { 
    id: 1, 
    name: 'Passport', 
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Driver\'s License', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 3, 
    name: 'National ID Card', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 4, 
    name: 'Voter ID', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 5, 
    name: 'Social Security Card', 
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
    name: ''
  }
  showModal.value = true
}

const editIdentityType = (identityType) => {
  isEditing.value = true
  editingId.value = identityType.id
  formData.value = { ...identityType }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    name: ''
  }
}

const saveIdentityType = () => {
  if (isEditing.value) {
    const index = identityTypes.value.findIndex(it => it.id === editingId.value)
    if (index !== -1) {
      identityTypes.value[index] = {
        ...formData.value,
        id: editingId.value,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...identityTypes.value.map(it => it.id)) + 1
    identityTypes.value.push({
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

const deleteIdentityType = (id) => {
  if (confirm('Are you sure you want to delete this identity type?')) {
    const index = identityTypes.value.findIndex(it => it.id === id)
    if (index !== -1) {
      identityTypes.value.splice(index, 1)
    }
  }
}
</script>
