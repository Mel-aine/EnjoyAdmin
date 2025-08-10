<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Sort Room Types</h1>
        <p class="text-gray-600 mt-1">
          Enter the number against the room types you have created to list them in a particular order that you will want to see them in.
        </p>
      </div>

      <!-- Sort Room Types Table using ReusableTable -->
      <ReusableTable
        title="Room Type Sorting"
        :columns="columns"
        :data="roomTypes"
        :actions="actions"
        search-placeholder="Search room types..."
        :selectable="false"
        empty-state-title="No room types found"
        empty-state-message="Create room types first to sort them."
        @action="onAction"
      >
        <template #header-actions>
          <BasicButton 
            @click="saveOrder"
            label="Save Order"
            :icon="Save"
          >
          </BasicButton>
        </template>

        <!-- Custom column for sort order input -->
        <template #column-sortOrder="{ item }">
          <input 
            v-model.number="item.sortOrder"
            type="number" 
            min="1"
            class="w-16 border border-gray-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
            @input="updateSortOrder(item)"
            @blur="saveOrderChange(item)"
            @keyup.enter="$event.target.blur()"
            title="Click to edit sort order"
          >
        </template>

        <template #column-roomType="{ item }">
          <div class="flex items-center space-x-3">
            <div 
              class="w-4 h-4 rounded-full border-2 border-gray-300"
              :style="{ backgroundColor: item.color }"
            ></div>
            <span class="font-medium">{{ item.roomType }}</span>
          </div>
        </template>

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

      <!-- Edit Sort Order Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            Edit Sort Order
          </h3>
          
          <form @submit.prevent="saveSortOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <input 
                :value="editingRoomType?.roomType"
                type="text" 
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Sort Order *
              </label>
              <input 
                v-model.number="formData.sortOrder"
                type="number" 
                min="1"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter sort order number"
              >
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
                Update Order
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
import { Save, Edit } from 'lucide-vue-next'

// Reactive data
const showEditModal = ref(false)
const editingRoomType = ref(null)

// Form data
const formData = ref({
  sortOrder: 1
})

// Table configuration
const columns = ref([
  {
    key: 'sortOrder',
    label: 'Sort Order',
    sortable: true,
    width: '100px'
  },
  {
    key: 'shortCode',
    label: 'Short Code',
    sortable: true,
    searchable: true
  },
  {
    key: 'roomType',
    label: 'Room Type',
    sortable: true,
    searchable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    component: 'badge'
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
  }
])

const actions = ref([
  {
    label: 'Edit Order',
    icon: 'edit',
    variant: 'primary',
    action: 'edit'
  }
])

// Sample data with sort orders
const roomTypes = ref([
  {
    id: 1,
    shortCode: 'DLX',
    roomType: 'One Bed Room Deluxe Suite',
    color: '#10B981',
    sortOrder: 1,
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 2,
    shortCode: '2BDS',
    roomType: 'Two Bed Room Deluxe Suite',
    color: '#3B82F6',
    sortOrder: 2,
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 3,
    shortCode: 'PS',
    roomType: 'Panoramic Suite',
    color: '#8B5CF6',
    sortOrder: 3,
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 4,
    shortCode: 'CS',
    roomType: 'Club Suite',
    color: '#F59E0B',
    sortOrder: 4,
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 5,
    shortCode: 'DS',
    roomType: 'Diplomatic Suite',
    color: '#EF4444',
    sortOrder: 5,
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  },
  {
    id: 6,
    shortCode: 'PS2',
    roomType: 'Presidential Suite',
    color: '#6366F1',
    sortOrder: 6,
    status: 'Available',
    createdBy: 'admin',
    createdDate: 'on 2012-10-30',
    modifiedBy: 'admin',
    modifiedDate: 'on 2012-10-30'
  }
])

// Computed property to sort room types by sort order
const sortedRoomTypes = computed(() => {
  return [...roomTypes.value].sort((a, b) => a.sortOrder - b.sortOrder)
})

// Methods
const onAction = (action, item) => {
  if (action === 'edit') {
    editSortOrder(item)
  }
}

const editSortOrder = (roomType) => {
  editingRoomType.value = roomType
  formData.value = {
    sortOrder: roomType.sortOrder
  }
  showEditModal.value = true
}

const updateSortOrder = (item) => {
  // Update the sort order in real-time
  const index = roomTypes.value.findIndex(rt => rt.id === item.id)
  if (index !== -1) {
    roomTypes.value[index].sortOrder = item.sortOrder
  }
}

const saveOrderChange = (item) => {
  // Auto-save when user finishes editing
  updateSortOrder(item)
  // Optional: Show a brief success indicator
  console.log(`Sort order updated for ${item.roomType}: ${item.sortOrder}`)
}

const saveSortOrder = () => {
  if (editingRoomType.value) {
    const index = roomTypes.value.findIndex(rt => rt.id === editingRoomType.value.id)
    if (index !== -1) {
      roomTypes.value[index].sortOrder = formData.value.sortOrder
    }
  }
  closeModal()
}

const saveOrder = () => {
  // Sort the array by sort order and reassign
  roomTypes.value.sort((a, b) => a.sortOrder - b.sortOrder)
  alert('Room type order saved successfully!')
}

const closeModal = () => {
  showEditModal.value = false
  editingRoomType.value = null
  formData.value = {
    sortOrder: 1
  }
}
</script>