<template>
  <ConfigurationLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Room Owner</h1>
        <p class="text-gray-600 mt-1">
          When Management Company manages condominiums and apartments, they would like to enter information of the owner of condominium/apartment.
        </p>
      </div>

      <!-- Room Owners Table using ReusableTable -->
      <ReusableTable
        title="Room Owners List"
        :columns="columns"
        :data="roomOwners"
        :actions="actions"
        search-placeholder="Search room owners..."
        :selectable="true"
        empty-state-title="No room owners found"
        empty-state-message="Click 'Add Room Owner' to create your first room owner."
        @action="onAction"
        @selection-change="onSelectionChange"
      >
        <template #header-actions>
          <BasicButton 
            @click="showAddModal = true"
            label="Add Room Owner"
            :icon="Plus"
          > 
          </BasicButton>
          
          <BasicButton 
            v-if="selectedOwners.length > 0"
            @click="deleteSelected"
            label="Delete Selected"
            :icon="Trash2"
          >
          </BasicButton>
        </template>

        <!-- Custom column for owner info -->
        <template #column-ownerInfo="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.businessName || 'No business name' }}</div>
          </div>
        </template>

        <!-- Custom column for contact info -->
        <template #column-contactInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.email }}</div>
            <div class="text-xs text-gray-500">{{ item.phone }}</div>
          </div>
        </template>

        <!-- Custom column for commission info -->
        <template #column-commissionInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.commissionPlan }}</div>
            <div class="text-xs text-gray-500">{{ item.commissionValue }}</div>
          </div>
        </template>

        <!-- Custom column for balance -->
        <template #column-balance="{ item }">
          <div class="text-sm font-medium" :class="item.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'">
            ${{ Math.abs(item.openingBalance).toFixed(2) }}
          </div>
        </template>

        <!-- Custom column for room count -->
        <template #column-roomCount="{ item }">
          <div class="text-sm text-gray-900">
            {{ item.assignedRooms.length }} room{{ item.assignedRooms.length !== 1 ? 's' : '' }}
          </div>
        </template>

        <!-- Custom column for created info -->
        <template #column-createdInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.createdBy }}</div>
            <div class="text-xs text-gray-400">{{ item.createdDate }}</div>
          </div>
        </template>

        <!-- Custom column for modified info -->
        <template #column-modifiedInfo="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.modifiedBy }}</div>
            <div class="text-xs text-gray-400">{{ item.modifiedDate }}</div>
          </div>
        </template>
      </ReusableTable>

      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ showAddModal ? 'Add Room Owner' : 'Edit Room Owner' }}
          </h3>
          
          <form @submit.prevent="saveRoomOwner" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the name of the room owner"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input 
                  v-model="formData.businessName"
                  type="text" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the business name (if any)"
                >
              </div>
            </div>

            <!-- Address Information -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">Address Information</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea 
                  v-model="formData.address"
                  required
                  rows="2"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the address of the room owner"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select 
                    v-model="formData.country"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select country</option>
                    <option v-for="country in availableCountries" :key="country" :value="country">
                      {{ country }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input 
                    v-model="formData.state"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter state"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input 
                    v-model="formData.city"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <input 
                  v-model="formData.zipCode"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter zip code or pin code"
                >
              </div>
            </div>

            <!-- Contact Information -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">Contact Information</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input 
                    v-model="formData.phone"
                    type="tel" 
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Fax
                  </label>
                  <input 
                    v-model="formData.fax"
                    type="tel" 
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fax number (if any)"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Mobile *
                  </label>
                  <input 
                    v-model="formData.mobile"
                    type="tel" 
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mobile number"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email address"
                >
              </div>
            </div>

            <!-- Commission & Rate Information -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">Commission & Rate Information</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Commission Plan *
                  </label>
                  <select 
                    v-model="formData.commissionPlan"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select commission plan</option>
                    <option value="% on all nights">% on all nights</option>
                    <option value="Fixed amount per night">Fixed amount per night</option>
                    <option value="Fixed amount per stay">Fixed amount per stay</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Commission Value *
                  </label>
                  <input 
                    v-model="formData.commissionValue"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter commission value"
                  >
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Rate *
                  </label>
                  <select 
                    v-model="formData.rate"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select rate</option>
                    <option value="Regular">Regular</option>
                    <option value="Special">Special</option>
                    <option value="Allocated">Allocated</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Room Inventory *
                  </label>
                  <select 
                    v-model="formData.roomInventory"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select inventory type</option>
                    <option value="Regular">Regular</option>
                    <option value="Allocated">Allocated</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Opening Balance
                </label>
                <input 
                  v-model.number="formData.openingBalance"
                  type="number" 
                  step="0.01"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opening balance (if any)"
                >
                <p class="text-xs text-gray-500 mt-1">Previous balance from manual system or previous software</p>
              </div>
            </div>

            <!-- User Creation -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">User Access</h4>
              
              <div class="flex items-center space-x-2">
                <input 
                  v-model="formData.createUser"
                  type="checkbox" 
                  id="createUser"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <label for="createUser" class="text-sm text-gray-700">
                  Create User - Create a username and password for this room owner to login and check room details
                </label>
              </div>
            </div>

            <!-- Room Assignment -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900">Room Assignment</h4>
              <p class="text-sm text-gray-600">Select all the rooms that are owned by this room owner.</p>
              
              <div class="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div v-for="room in availableRooms" :key="room.id" class="flex items-center space-x-2">
                    <input 
                      v-model="formData.assignedRooms"
                      :value="room.id"
                      type="checkbox" 
                      :id="`room-${room.id}`"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <label :for="`room-${room.id}`" class="text-sm text-gray-700">
                      {{ room.name }} ({{ room.type }})
                    </label>
                  </div>
                </div>
              </div>
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
                {{ showEditModal ? 'Update Room Owner' : 'Add Room Owner' }}
              </button>
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
import BasicButton from '@/components/buttons/BasicButton.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { Plus, Trash2, Edit, Trash, User } from 'lucide-vue-next'

// Reactive data
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedOwners = ref([])
const editingOwner = ref(null)

// Form data
const formData = ref({
  name: '',
  businessName: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  phone: '',
  fax: '',
  mobile: '',
  email: '',
  commissionPlan: '',
  commissionValue: '',
  rate: '',
  roomInventory: '',
  openingBalance: 0,
  createUser: false,
  assignedRooms: []
})

// Available options
const availableCountries = ref([
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Italy', 'Spain', 'Japan', 'India', 'China', 'Brazil'
])

const availableRooms = ref([
  { id: 101, name: '101', type: 'One Bed Room Deluxe Suite' },
  { id: 102, name: '102', type: 'Club Suite' },
  { id: 103, name: '103', type: 'Two Bed Room Deluxe Suite' },
  { id: 201, name: '201', type: 'Diplomatic Suite' },
  { id: 202, name: '202', type: 'Diplomatic Suite' },
  { id: 203, name: '203', type: 'Presidential Suite' },
  { id: 301, name: '301', type: 'One Bed Room Deluxe Suite' },
  { id: 302, name: '302', type: 'One Bed Room Deluxe Suite' },
  { id: 303, name: '303', type: 'Panoramic Suite' }
])

// Table configuration
const columns = ref([
  {
    key: 'ownerInfo',
    label: 'Owner Name',
    sortable: true,
    searchable: true
  },
  {
    key: 'contactInfo',
    label: 'Contact Info',
    sortable: true
  },
  {
    key: 'address',
    label: 'Location',
    sortable: true,
    searchable: true
  },
  {
    key: 'commissionInfo',
    label: 'Commission',
    sortable: true
  },
  {
    key: 'rate',
    label: 'Rate',
    sortable: true
  },
  {
    key: 'roomInventory',
    label: 'Inventory',
    sortable: true
  },
  {
    key: 'balance',
    label: 'Balance',
    sortable: true
  },
  {
    key: 'roomCount',
    label: 'Rooms',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
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
  }
])

// Sample data
const roomOwners = ref([
  {
    id: 1,
    name: 'John Smith',
    businessName: 'Smith Properties LLC',
    address: '123 Main Street, New York, NY 10001',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    zipCode: '10001',
    phone: '+1-555-0123',
    fax: '+1-555-0124',
    mobile: '+1-555-0125',
    email: 'john.smith@smithproperties.com',
    commissionPlan: '% on all nights',
    commissionValue: '15%',
    rate: 'Regular',
    roomInventory: 'Regular',
    openingBalance: 2500.00,
    createUser: true,
    assignedRooms: [101, 102, 103],
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-15 10:30 AM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-20 02:15 PM'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    businessName: 'Garcia Investments',
    address: '456 Ocean Drive, Miami, FL 33139',
    country: 'United States',
    state: 'Florida',
    city: 'Miami',
    zipCode: '33139',
    phone: '+1-305-555-0234',
    fax: '',
    mobile: '+1-305-555-0235',
    email: 'maria@garciainvestments.com',
    commissionPlan: 'Fixed amount per night',
    commissionValue: '$50',
    rate: 'Special',
    roomInventory: 'Allocated',
    openingBalance: -750.00,
    createUser: true,
    assignedRooms: [201, 202],
    status: 'Active',
    createdBy: 'Admin',
    createdDate: '2024-01-18 09:15 AM',
    modifiedBy: 'Admin',
    modifiedDate: '2024-01-18 09:15 AM'
  },
  {
    id: 3,
    name: 'David Chen',
    businessName: '',
    address: '789 Sunset Boulevard, Los Angeles, CA 90028',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipCode: '90028',
    phone: '+1-323-555-0345',
    fax: '+1-323-555-0346',
    mobile: '+1-323-555-0347',
    email: 'david.chen@email.com',
    commissionPlan: 'Fixed amount per stay',
    commissionValue: '$200',
    rate: 'Allocated',
    roomInventory: 'Regular',
    openingBalance: 1200.00,
    createUser: false,
    assignedRooms: [301, 302, 303],
    status: 'Active',
    createdBy: 'Manager',
    createdDate: '2024-01-22 03:45 PM',
    modifiedBy: 'Manager',
    modifiedDate: '2024-01-22 03:45 PM'
  }
])

// Methods
const editRoomOwner = (owner) => {
  editingOwner.value = owner
  formData.value = { ...owner }
  showEditModal.value = true
}

const deleteRoomOwner = (owner) => {
  if (confirm(`Are you sure you want to delete room owner "${owner.name}"?`)) {
    const index = roomOwners.value.findIndex(o => o.id === owner.id)
    if (index > -1) {
      roomOwners.value.splice(index, 1)
    }
  }
}

// Actions configuration
const actions = ref([
  {
    label: 'Edit',
    handler: editRoomOwner,
    icon: Edit
  },
  {
    label: 'Delete',
    handler: deleteRoomOwner,
    icon: Trash,
    variant: 'danger'
  }
])

const onAction = (action, item) => {
  if (action === 'edit') {
    editRoomOwner(item)
  } else if (action === 'delete') {
    deleteRoomOwner(item)
  }
}

const onSelectionChange = (selected) => {
  selectedOwners.value = selected
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedOwners.value.length} selected room owner(s)?`)) {
    selectedOwners.value.forEach(owner => {
      const index = roomOwners.value.findIndex(o => o.id === owner.id)
      if (index > -1) {
        roomOwners.value.splice(index, 1)
      }
    })
    selectedOwners.value = []
  }
}

const saveRoomOwner = () => {
  if (showEditModal.value) {
    // Update existing room owner
    const index = roomOwners.value.findIndex(o => o.id === editingOwner.value.id)
    if (index > -1) {
      roomOwners.value[index] = { ...formData.value, id: editingOwner.value.id }
    }
  } else {
    // Add new room owner
    const newOwner = {
      ...formData.value,
      id: Date.now(),
      status: 'Active'
    }
    roomOwners.value.push(newOwner)
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingOwner.value = null
  
  // Reset form
  formData.value = {
    name: '',
    businessName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    phone: '',
    fax: '',
    mobile: '',
    email: '',
    commissionPlan: '',
    commissionValue: '',
    rate: '',
    roomInventory: '',
    openingBalance: 0,
    createUser: false,
    assignedRooms: []
  }
}
</script>
