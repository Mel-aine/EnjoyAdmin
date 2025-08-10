<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Housekeeping Status</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          Define all the housekeeping status for the rooms from here. You can assign colors to each status for easy identification.
        </p>
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <BasicButton variant="primary" @click="openAddModal">
              <Plus class="w-4 h-4 mr-2" />
              Add Housekeeping Status
            </BasicButton>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
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
              <tr v-for="status in statuses" :key="status.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ status.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 rounded-full border border-gray-300" :style="{ backgroundColor: status.color }"></div>
                    <span class="text-sm text-gray-600">{{ status.color }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ status.createdBy }}<br>
                  <span class="text-xs text-gray-400">{{ status.createdDate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ status.modifiedBy }}<br>
                  <span class="text-xs text-gray-400">{{ status.modifiedDate }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="status.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ status.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="editStatus(status)" class="text-blue-600 hover:text-blue-900">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button @click="deleteStatus(status.id)" class="text-red-600 hover:text-red-900">
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
            {{ isEditing ? 'Edit Housekeeping Status' : 'Add Housekeeping Status' }}
          </h3>
          
          <form @submit.prevent="saveStatus">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Status Name *
              </label>
              <input 
                v-model="formData.name" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter status name"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <div class="flex items-center space-x-3">
                <input 
                  v-model="formData.color" 
                  type="color" 
                  required
                  class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input 
                  v-model="formData.color" 
                  type="text" 
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#000000"
                />
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
import { ref } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/ui/BasicButton.vue'
import { Plus, Edit, Trash } from 'lucide-vue-next'

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
  name: '',
  color: '#3B82F6'
})

const statuses = ref([
  { 
    id: 1, 
    name: 'Clean', 
    color: '#10B981', 
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Dirty', 
    color: '#EF4444', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 3, 
    name: 'Out of Order', 
    color: '#F59E0B', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 4, 
    name: 'Maintenance', 
    color: '#8B5CF6', 
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
    name: '',
    color: '#3B82F6'
  }
  showModal.value = true
}

const editStatus = (status) => {
  isEditing.value = true
  editingId.value = status.id
  formData.value = {
    name: status.name,
    color: status.color
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    name: '',
    color: '#3B82F6'
  }
}

const saveStatus = () => {
  if (isEditing.value) {
    const index = statuses.value.findIndex(s => s.id === editingId.value)
    if (index !== -1) {
      statuses.value[index] = {
        ...statuses.value[index],
        name: formData.value.name,
        color: formData.value.color,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    const newId = Math.max(...statuses.value.map(s => s.id)) + 1
    statuses.value.push({
      id: newId,
      name: formData.value.name,
      color: formData.value.color,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    })
  }
  closeModal()
}

const deleteStatus = (id) => {
  if (confirm('Are you sure you want to delete this status?')) {
    const index = statuses.value.findIndex(s => s.id === id)
    if (index !== -1) {
      statuses.value.splice(index, 1)
    }
  }
}
</script>
