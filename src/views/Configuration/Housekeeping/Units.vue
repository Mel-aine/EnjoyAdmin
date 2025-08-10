<template>
  <ConfigurationLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Units</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-6">
          Units here refer to the different areas in the hotel premises which need to be attended by the housekeepers. 
          It can be anything like – visitors lobby, Reception area, Recreation area, etc.
        </p>
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <BasicButton 
              variant="primary" 
              @click="openAddModal"
              icon="Plus"
              label="Add Unit"
            />
          </div>
        </div>

        <ReusableTable
          title="Units"
          :columns="columns"
          :data="units"
          :actions="actions"
          search-placeholder="Search units..."
          empty-state-title="No units found"
          empty-state-description="Get started by adding your first unit."
          @action="onAction"
        >
          <template #status="{ item }">
            <span 
              :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                item.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ item.status }}
            </span>
          </template>
        </ReusableTable>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Unit' : 'Add Unit' }}
          </h3>
          
          <form @submit.prevent="saveUnit">
            <div class="mb-4">
              <Input
                v-model="formData.name"
                label="Unit Name"
                type="text"
                placeholder="Enter unit name"
                required
              />
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <BasicButton 
                type="button" 
                variant="outline" 
                @click="closeModal"
                label="Cancel"
              />
              <BasicButton 
                type="submit" 
                variant="primary"
                :label="isEditing ? 'Update' : 'Save'"
              />
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
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import { Plus } from 'lucide-vue-next'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  name: ''
})

// Table configuration
const columns = [
  { key: 'name', label: 'Unit Name', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item: any) => editUnit(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteUnit(item.id),
    variant: 'danger'
  }
]

const units = ref([
  { 
    id: 1, 
    name: 'Visitors Lobby', 
    createdBy: 'admin', 
    createdDate: '2013-05-13', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Reception Area', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  },
  { 
    id: 3, 
    name: 'Recreation Area', 
    createdBy: 'admin', 
    createdDate: '2013-08-03', 
    modifiedBy: 'admin', 
    modifiedDate: '2013-08-03', 
    status: 'Active' 
  }
])

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  showModal.value = true
}

const editUnit = (unit: any) => {
  isEditing.value = true
  editingId.value = unit.id
  formData.name = unit.name
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
}

const saveUnit = () => {
  if (isEditing.value && editingId.value) {
    // Update existing unit
    const index = units.value.findIndex(u => u.id === editingId.value)
    if (index !== -1) {
      units.value[index] = {
        ...units.value[index],
        name: formData.name,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new unit
    const newUnit = {
      id: Math.max(...units.value.map(u => u.id)) + 1,
      name: formData.name,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    units.value.push(newUnit)
  }
  closeModal()
}

const deleteUnit = (id: number) => {
  if (confirm('Are you sure you want to delete this unit?')) {
    const index = units.value.findIndex(u => u.id === id)
    if (index !== -1) {
      units.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
