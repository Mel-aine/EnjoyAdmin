<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Audit Trail</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Track all system activities and changes</p>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
          <input 
            type="date" 
            v-model="filters.dateFrom"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
          <input 
            type="date" 
            v-model="filters.dateTo"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
          <select 
            v-model="filters.user"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Users</option>
            <option value="admin">Admin</option>
            <option value="helpdesk">Helpdesk/Support</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="applyFilters"
            class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Audit Trail Table -->
    <ReusableTable
      :columns="columns"
      :data="filteredAuditData"
      :loading="loading"
      :searchable="true"
      :searchPlaceholder="'Search audit logs...'"
    >
      <!-- Custom column templates -->
      <template #column-date="{ item }">
        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(item.date) }}</span>
      </template>

      <template #column-time="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">{{ item.time }}</span>
      </template>

      <template #column-user="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">{{ item.user }}</span>
      </template>

      <template #column-ip="{ item }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ item.ip }}</span>
      </template>

      <template #column-action="{ item }">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="{
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': item.action === 'Create',
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': item.action === 'Update',
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': item.action === 'Delete',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': item.action === 'Login',
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': item.action === 'Logout',
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': !['Create', 'Update', 'Delete', 'Login', 'Logout'].includes(item.action)
          }"
        >
          {{ item.action }}
        </span>
      </template>

      <template #column-description="{ item }">
        <div>
          <span class="text-sm text-gray-900 dark:text-white">{{ item.description }}</span>
          <p v-if="item.details" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.details }}</p>
        </div>
      </template>

      <!-- Header actions -->
      <template #header-actions>
        <button 
          @click="exportAuditTrail"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </template>
    </ReusableTable>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ totalItems }}</span> results
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage"
          :disabled="currentPage === 1"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === 1,
            'hover:bg-gray-50 dark:hover:bg-gray-600': currentPage !== 1
          }"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        >
          Previous
        </button>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === totalPages,
            'hover:bg-gray-50 dark:hover:bg-gray-600': currentPage !== totalPages
          }"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'

// State
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  user: ''
})

// Table columns
const columns = ref([
  { key: 'date', label: 'Date', type: 'custom' },
  { key: 'time', label: 'Time', type: 'custom' },
  { key: 'user', label: 'User', type: 'custom' },
  { key: 'ip', label: 'IP Address', type: 'custom' },
  { key: 'action', label: 'Action', type: 'custom' },
  { key: 'description', label: 'Description', type: 'custom' }
])

// Sample audit data
const auditData = ref([
  {
    id: 1,
    date: '2023-10-15',
    time: '08:45:22',
    user: 'admin',
    ip: '192.168.1.100',
    action: 'Login',
    description: 'User logged in successfully',
    details: null
  },
  {
    id: 2,
    date: '2023-10-15',
    time: '09:12:05',
    user: 'admin',
    ip: '192.168.1.100',
    action: 'Create',
    description: 'Created new reservation',
    details: 'Reservation #12345 for John Smith'
  },
  {
    id: 3,
    date: '2023-10-15',
    time: '10:30:18',
    user: 'helpdesk/support',
    ip: '192.168.1.101',
    action: 'Update',
    description: 'Updated guest information',
    details: 'Guest ID: 5678, Name: Sarah Johnson'
  },
  {
    id: 4,
    date: '2023-10-16',
    time: '11:45:30',
    user: 'manager',
    ip: '192.168.1.102',
    action: 'Delete',
    description: 'Deleted reservation',
    details: 'Reservation #98765 for Michael Brown'
  },
  {
    id: 5,
    date: '2023-10-16',
    time: '14:22:10',
    user: 'helpdesk/support',
    ip: '192.168.1.101',
    action: 'Update',
    description: 'Modified room assignment',
    details: 'Room changed from 301 to 405 for reservation #54321'
  },
  {
    id: 6,
    date: '2023-10-17',
    time: '09:05:45',
    user: 'admin',
    ip: '192.168.1.100',
    action: 'Create',
    description: 'Added new payment',
    details: 'Payment of $250.00 for reservation #12345'
  },
  {
    id: 7,
    date: '2023-10-17',
    time: '16:30:22',
    user: 'manager',
    ip: '192.168.1.102',
    action: 'Logout',
    description: 'User logged out',
    details: null
  },
  {
    id: 8,
    date: '2023-10-18',
    time: '10:15:33',
    user: 'helpdesk/support',
    ip: '192.168.1.101',
    action: 'Update',
    description: 'Updated room status',
    details: 'Room 205 marked as Out of Order'
  },
  {
    id: 9,
    date: '2023-10-18',
    time: '11:20:45',
    user: 'admin',
    ip: '192.168.1.100',
    action: 'Create',
    description: 'Created new user account',
    details: 'Username: jdoe, Role: Front Desk'
  },
  {
    id: 10,
    date: '2023-10-19',
    time: '14:05:12',
    user: 'manager',
    ip: '192.168.1.102',
    action: 'Update',
    description: 'Modified system settings',
    details: 'Changed default currency from USD to EUR'
  },
  {
    id: 11,
    date: '2023-10-19',
    time: '15:45:30',
    user: 'helpdesk/support',
    ip: '192.168.1.101',
    action: 'Delete',
    description: 'Removed guest profile',
    details: 'Guest ID: 7890, Name: Robert Wilson'
  },
  {
    id: 12,
    date: '2023-10-20',
    time: '09:30:15',
    user: 'admin',
    ip: '192.168.1.100',
    action: 'Login',
    description: 'User logged in successfully',
    details: null
  }
])

// Computed
const filteredAuditData = computed(() => {
  let filtered = [...auditData.value]
  
  // Apply filters
  if (filters.value.dateFrom) {
    filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.value.dateFrom))
  }
  
  if (filters.value.dateTo) {
    filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.value.dateTo))
  }
  
  if (filters.value.user) {
    filtered = filtered.filter(item => item.user === filters.value.user)
  }
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  
  return filtered.slice(start, end)
})

const totalItems = computed(() => {
  let filtered = [...auditData.value]
  
  // Apply filters for counting total items
  if (filters.value.dateFrom) {
    filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.value.dateFrom))
  }
  
  if (filters.value.dateTo) {
    filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.value.dateTo))
  }
  
  if (filters.value.user) {
    filtered = filtered.filter(item => item.user === filters.value.user)
  }
  
  return filtered.length
})

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value)
})

const paginationStart = computed(() => {
  return ((currentPage.value - 1) * itemsPerPage.value) + 1
})

const paginationEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > totalItems.value ? totalItems.value : end
})

// Methods
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const applyFilters = () => {
  currentPage.value = 1 // Reset to first page when applying filters
  // Filters are automatically applied via computed properties
}

const exportAuditTrail = () => {
  console.log('Exporting audit trail')
  // Implement export logic
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Lifecycle hooks
onMounted(() => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>