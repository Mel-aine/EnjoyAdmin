<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Room Amenities</h1>
        <p class="text-gray-600 mt-1">
          Enter all the amenities that you provide in your rooms like – Air conditioner, Television, LCD, 
          Refrigerator, Coffee maker, etc.
        </p>
      </div>

      <!-- Amenities Table using ReusableTable -->
      <ReusableTable
        title="Amenities List"
        :columns="columns"
        :data="amenities"
        :actions="actions"
        search-placeholder="Search amenities..."
        :selectable="true"
        empty-state-title="No amenities found"
        empty-state-message="Get started by adding a new amenity."
        @selection-change="onSelectionChange"
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Amenity"
            :icon="Plus"

          >
          </BasicButton>
          <button 
            v-if="selectedAmenities.length > 0"
            @click="deleteSelected"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <Trash2 class="w-4 h-4" />
            <span>Delete Selected ({{ selectedAmenities.length }})</span>
          </button>
        </template>

        <!-- Custom column for created/modified info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add New Amenity' : 'Edit Amenity' }}
          </h3>
          
          <form @submit.prevent="saveAmenity" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amenity Name *
              </label>
              <input 
                v-model="formData.name"
                type="text" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amenity name"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amenity Type *
              </label>
              <select 
                v-model="formData.type"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">--Select--</option>
                <option value="Room">Room</option>
                <option value="Hotel">Hotel</option>
                <option value="Both">Both</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Sort Key
              </label>
              <input 
                v-model.number="formData.sortKey"
                type="number" 
                min="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter sort order"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                v-model="formData.status"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ showAddModal ? 'Add Amenity' : 'Update Amenity' }}
              </button>
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
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Edit, Trash2, X } from 'lucide-vue-next'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedAmenities = ref([])
const editingAmenity = ref(null)

// Form data
const formData = ref({
  name: '',
  type: '',
  sortKey: 0,
  status: 'Available'
})

// Table configuration
const columns = ref([
  {
    key: 'name',
    label: 'Amenity Name',
    sortable: true,
    searchable: true
  },
  {
    key: 'type',
    label: 'Amenity Type',
    sortable: true
  },
  {
    key: 'sortKey',
    label: 'Sort Key',
    sortable: true
  },
  {
    key: 'createdInfo',
    label: 'Created By',
    sortable: false
  },
  {
    key: 'modifiedInfo',
    label: 'Modified By',
    sortable: false
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    component: 'badge'
  }
])

const actions = ref([
  {
    label: 'Edit',
    icon: 'edit',
    variant: 'primary',
    action: 'edit'
  },
  {
    label: 'Delete',
    icon: 'delete',
    variant: 'danger',
    action: 'delete'
  }
])

// Reactive data
const amenities = ref([
  {
    id: 1,
    name: '100% combed and ring spun cotton terry bath sheets',
    type: 'Room',
    sortKey: 0,
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30',
    status: 'Available'
  },
  {
    id: 2,
    name: '300-thread-count, 100% cotton bed linens',
    type: 'Room',
    sortKey: 0,
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30',
    status: 'Available'
  },
  {
    id: 3,
    name: 'Alarm clock',
    type: 'Room',
    sortKey: 0,
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30',
    status: 'Available'
  },
  {
    id: 4,
    name: 'CD Alarm Clocks',
    type: 'Room',
    sortKey: 0,
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30',
    status: 'Available'
  },
  {
    id: 5,
    name: 'Coffee maker',
    type: 'Room',
    sortKey: 0,
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30',
    status: 'Available'
  },
  {
    id: 6,
    name: 'Complimentary in-room',
    type: 'Room',
    sortKey: 0,
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30',
    status: 'Available'
  }
])

// Methods
const onSelectionChange = (selection) => {
  selectedAmenities.value = selection
}

const onAction = (action, item) => {
  if (action === 'edit') {
    editAmenity(item)
  } else if (action === 'delete') {
    deleteAmenity(item.id)
  }
}

const editAmenity = (amenity) => {
  editingAmenity.value = amenity
  formData.value = {
    name: amenity.name,
    type: amenity.type,
    sortKey: amenity.sortKey,
    status: amenity.status
  }
  showEditModal.value = true
}

const deleteAmenity = (id) => {
  if (confirm('Are you sure you want to delete this amenity?')) {
    amenities.value = amenities.value.filter(amenity => amenity.id !== id)
  }
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedAmenities.value.length} selected amenities?`)) {
    amenities.value = amenities.value.filter(amenity => !selectedAmenities.value.includes(amenity.id))
    selectedAmenities.value = []
  }
}

const saveAmenity = () => {
  if (showAddModal.value) {
    // Add new amenity
    const newAmenity = {
      id: Date.now(),
      name: formData.value.name,
      type: formData.value.type,
      sortKey: formData.value.sortKey,
      createdBy: 'admin',
      createdDate: `on ${new Date().toISOString().split('T')[0]}`,
      modifiedBy: 'admin',
      modifiedDate: `on ${new Date().toISOString().split('T')[0]}`,
      status: formData.value.status
    }
    amenities.value.push(newAmenity)
  } else {
    // Update existing amenity
    const index = amenities.value.findIndex(amenity => amenity.id === editingAmenity.value.id)
    if (index !== -1) {
      amenities.value[index] = {
        ...amenities.value[index],
        name: formData.value.name,
        type: formData.value.type,
        sortKey: formData.value.sortKey,
        status: formData.value.status,
        modifiedBy: 'admin',
        modifiedDate: `on ${new Date().toISOString().split('T')[0]}`
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingAmenity.value = null
  formData.value = {
    name: '',
    type: '',
    sortKey: 0,
    status: 'Available'
  }
}
</script>