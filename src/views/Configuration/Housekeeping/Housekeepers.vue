<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Housekeepers</h1>
        <BasicButton 
          variant="primary" 
          @click="openAddModal"
          icon="Plus"
          label="Add Housekeeper"
        />
      </div>
      
      <ReusableTable
        title="Housekeepers"
        :columns="columns"
        :data="housekeepers"
        :actions="actions"
        search-placeholder="Search housekeepers..."
        empty-state-title="No housekeepers found"
        empty-state-description="Get started by adding your first housekeeper."
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

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Housekeeper' : 'Add Housekeeper' }}
          </h3>
          
          <form @submit.prevent="saveHousekeeper">
            <div class="mb-4">
              <Input
                v-model="formData.name"
                label="Housekeeper Name"
                type="text"
                placeholder="Enter housekeeper name"
                required
              />
            </div>
            
            <div class="mb-4">
              <Input
                v-model="formData.mobile"
                label="Mobile Number"
                type="tel"
                placeholder="Enter mobile number"
                required
              />
            </div>
            
           <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                @click="closeModal"
                type="button"
                :label="$t('cancel')"
              >
                Cancel
              </BasicButton>
              <BasicButton 
                variant="primary" 
                type="submit"
                :label="isEditing ? $t('update') : $t('save') "
                :icon="isEditing ? Edit : Save"
              >
              </BasicButton>
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
import { Edit, Plus, Save } from 'lucide-vue-next'
import type { Action, Column } from '../../../utils/models'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  name: '',
  mobile: ''
})

// Table configuration
const columns :Column[] = [
  { key: 'name', label: 'Housekeeper', type: 'text' },
  { key: 'mobile', label: 'Mobile', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'modifiedBy', label: 'Modified By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions:Action[] = [
  {
    label: 'Edit',
    handler: (item: any) => editHousekeeper(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteHousekeeper(item.id),
    variant: 'danger'
  }
]

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

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.mobile = ''
  showModal.value = true
}

const editHousekeeper = (housekeeper: any) => {
  isEditing.value = true
  editingId.value = housekeeper.id
  formData.name = housekeeper.name
  formData.mobile = housekeeper.mobile
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.name = ''
  formData.mobile = ''
}

const saveHousekeeper = () => {
  if (isEditing.value && editingId.value) {
    // Update existing housekeeper
    const index = housekeepers.value.findIndex(h => h.id === editingId.value)
    if (index !== -1) {
      housekeepers.value[index] = {
        ...housekeepers.value[index],
        name: formData.name,
        mobile: formData.mobile,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new housekeeper
    const newHousekeeper = {
      id: Math.max(...housekeepers.value.map(h => h.id)) + 1,
      name: formData.name,
      mobile: formData.mobile,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Available'
    }
    housekeepers.value.push(newHousekeeper)
  }
  closeModal()
}

const deleteHousekeeper = (id: number) => {
  if (confirm('Are you sure you want to delete this housekeeper?')) {
    const index = housekeepers.value.findIndex(h => h.id === id)
    if (index !== -1) {
      housekeepers.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>