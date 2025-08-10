<template>
  <ConfigurationLayout>
    <div class="p-6">
      <ReusableTable
        title="Market Code Management"
        :columns="columns"
        :data="marketCodes"
        :actions="actions"
        search-placeholder="Search market codes..."
        :selectable="false"
        empty-state-title="No market codes found"
        empty-state-message="Get started by adding a new market code."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            variant="primary" 
            icon="Plus"
            label="Add Market Code"
            @click="openAddModal"
          />
        </template>

        <template #column-status="{ item }">
          <span 
            :class="item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ item.status }}
          </span>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Market Code' : 'Add New Market Code' }}
          </h3>
          
          <form @submit.prevent="saveMarketCode" class="space-y-4">
            <Input 
              :lb="'Market Code'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.code"
              :placeholder="'Enter market code (e.g., CORP, LEISURE, GROUP)'"
            />
            
            <Input 
              :lb="'Market Name'"
              :inputType="'text'"
              :isRequired="true"
              v-model="formData.name"
              :placeholder="'Enter market name (e.g., Corporate, Leisure Travel)'"
            />
            
            <Input 
              :lb="'Description'"
              :inputType="'text'"
              v-model="formData.description"
              :placeholder="'Enter description (optional)'"
            />
            
            <Select 
              :lb="'Market Segment'"
              :isRequired="true"
              v-model="formData.segment"
              :options="segmentOptions"
              :defaultValue="'Select market segment'"
            />
            
            <div class="flex justify-end space-x-3 pt-4">
              <BasicButton 
                variant="secondary" 
                @click="closeModal"
                type="button"
              >
                Cancel
              </BasicButton>
              <BasicButton 
                variant="primary" 
                type="submit"
              >
                {{ isEditing ? 'Update' : 'Save' }}
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
import Select from '@/components/forms/FormElements/Select.vue'

// Reactive data
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formData = reactive({
  code: '',
  name: '',
  description: '',
  segment: ''
})

// Sample data
const marketCodes = ref([
  {
    id: 1,
    code: 'CORP',
    name: 'Corporate',
    description: 'Business travelers and corporate bookings',
    segment: 'Business',
    createdBy: 'admin',
    createdDate: '2024-01-15',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    code: 'LEISURE',
    name: 'Leisure Travel',
    description: 'Individual leisure and vacation travelers',
    segment: 'Leisure',
    createdBy: 'admin',
    createdDate: '2024-01-14',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-14',
    status: 'Active'
  },
  {
    id: 3,
    code: 'GROUP',
    name: 'Group Bookings',
    description: 'Group reservations and events',
    segment: 'Group',
    createdBy: 'admin',
    createdDate: '2024-01-13',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-13',
    status: 'Active'
  },
  {
    id: 4,
    code: 'ONLINE',
    name: 'Online Travel Agency',
    description: 'Bookings from online travel agencies',
    segment: 'OTA',
    createdBy: 'admin',
    createdDate: '2024-01-12',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-12',
    status: 'Active'
  },
  {
    id: 5,
    code: 'GOVT',
    name: 'Government',
    description: 'Government and official bookings',
    segment: 'Government',
    createdBy: 'admin',
    createdDate: '2024-01-11',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-11',
    status: 'Active'
  },
  {
    id: 6,
    code: 'WEDDING',
    name: 'Wedding Events',
    description: 'Wedding ceremonies and related events',
    segment: 'Events',
    createdBy: 'admin',
    createdDate: '2024-01-10',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-10',
    status: 'Inactive'
  }
])

// Segment options
const segmentOptions = [
  { label: 'Business', value: 'Business' },
  { label: 'Leisure', value: 'Leisure' },
  { label: 'Group', value: 'Group' },
  { label: 'OTA', value: 'OTA' },
  { label: 'Government', value: 'Government' },
  { label: 'Events', value: 'Events' },
  { label: 'Other', value: 'Other' }
]

// Table configuration
const columns = [
  { key: 'code', label: 'Market Code', type: 'text' },
  { key: 'name', label: 'Market Name', type: 'text' },
  { key: 'segment', label: 'Segment', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'createdBy', label: 'Created By', type: 'text' },
  { key: 'status', label: 'Status', type: 'custom' }
]

const actions = [
  {
    label: 'Edit',
    handler: (item: any) => editMarketCode(item),
    variant: 'primary'
  },
  {
    label: 'Delete',
    handler: (item: any) => deleteMarketCode(item.id),
    variant: 'danger'
  }
]

// Functions
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.code = ''
  formData.name = ''
  formData.description = ''
  formData.segment = ''
  showModal.value = true
}

const editMarketCode = (marketCode: any) => {
  isEditing.value = true
  editingId.value = marketCode.id
  formData.code = marketCode.code
  formData.name = marketCode.name
  formData.description = marketCode.description
  formData.segment = marketCode.segment
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.code = ''
  formData.name = ''
  formData.description = ''
  formData.segment = ''
}

const saveMarketCode = () => {
  if (isEditing.value && editingId.value) {
    // Update existing market code
    const index = marketCodes.value.findIndex(mc => mc.id === editingId.value)
    if (index !== -1) {
      marketCodes.value[index] = {
        ...marketCodes.value[index],
        code: formData.code,
        name: formData.name,
        description: formData.description,
        segment: formData.segment,
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new market code
    const newMarketCode = {
      id: Math.max(...marketCodes.value.map(mc => mc.id)) + 1,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      segment: formData.segment,
      createdBy: 'admin',
      createdDate: new Date().toISOString().split('T')[0],
      modifiedBy: 'admin',
      modifiedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    marketCodes.value.push(newMarketCode)
  }
  closeModal()
}

const deleteMarketCode = (id: number) => {
  if (confirm('Are you sure you want to delete this market code?')) {
    const index = marketCodes.value.findIndex(mc => mc.id === id)
    if (index !== -1) {
      marketCodes.value.splice(index, 1)
    }
  }
}

const onAction = (action: string, item: any) => {
  console.log('Action:', action, 'Item:', item)
}
</script>
