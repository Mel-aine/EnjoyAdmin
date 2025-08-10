<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.audit.modificationLog') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.audit.modificationLogDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.user') }}
            </label>
            <select
              v-model="filters.user"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option v-for="user in uniqueUsers" :key="user" :value="user">
                {{ user }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.table') }}
            </label>
            <select
              v-model="filters.table"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="reservations">{{ $t('common.reservations') }}</option>
              <option value="guests">{{ $t('common.guests') }}</option>
              <option value="rooms">{{ $t('common.rooms') }}</option>
              <option value="billing">{{ $t('common.billing') }}</option>
              <option value="users">{{ $t('common.users') }}</option>
              <option value="settings">{{ $t('common.settings') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.operation') }}
            </label>
            <select
              v-model="filters.operation"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="INSERT">{{ $t('common.insert') }}</option>
              <option value="UPDATE">{{ $t('common.update') }}</option>
              <option value="DELETE">{{ $t('common.delete') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalModifications') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalModifications.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.insertOperations') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.insertOperations }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.updateOperations') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.updateOperations }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.deleteOperations') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.deleteOperations }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.modificationsByOperation') }}
          </h3>
          <div class="space-y-4">
            <div v-for="operation in operationBreakdown" :key="operation.operation" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: operation.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t(`common.${operation.operation.toLowerCase()}`) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ operation.count.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ operation.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('reports.modificationsByTable') }}
          </h3>
          <div class="space-y-3">
            <div v-for="table in tableBreakdown" :key="table.table" class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t(`common.${table.table}`) }}</span>
              <div class="flex items-center">
                <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div class="bg-blue-600 h-2 rounded-full" :style="{ width: table.percentage + '%' }"></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ table.count.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modification Log Table -->
      <ReusableTable
        :title="$t('reports.modificationLog')"
        :columns="tableColumns"
        :data="filteredModifications"
        :actions="tableActions"
        :searchable="true"
        :empty-message="$t('reports.noModificationsFound')"
      />
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  user: '',
  table: '',
  operation: ''
})

// Mock data
const modifications = ref([
  {
    id: 1,
    timestamp: '2024-01-15T09:30:00Z',
    user: 'John Smith',
    table: 'reservations',
    operation: 'UPDATE',
    recordId: '12345',
    fieldChanged: 'status',
    oldValue: 'confirmed',
    newValue: 'checked_in'
  },
  {
    id: 2,
    timestamp: '2024-01-15T09:35:00Z',
    user: 'Jane Doe',
    table: 'guests',
    operation: 'INSERT',
    recordId: '67890',
    fieldChanged: 'all',
    oldValue: null,
    newValue: 'New guest record created'
  },
  {
    id: 3,
    timestamp: '2024-01-15T09:40:00Z',
    user: 'Mike Wilson',
    table: 'rooms',
    operation: 'UPDATE',
    recordId: '205',
    fieldChanged: 'status',
    oldValue: 'dirty',
    newValue: 'clean'
  },
  {
    id: 4,
    timestamp: '2024-01-15T09:45:00Z',
    user: 'Sarah Brown',
    table: 'billing',
    operation: 'UPDATE',
    recordId: 'INV-001',
    fieldChanged: 'amount',
    oldValue: '150.00',
    newValue: '175.00'
  },
  {
    id: 5,
    timestamp: '2024-01-15T09:50:00Z',
    user: 'Admin User',
    table: 'users',
    operation: 'UPDATE',
    recordId: 'USR-123',
    fieldChanged: 'role',
    oldValue: 'staff',
    newValue: 'manager'
  },
  {
    id: 6,
    timestamp: '2024-01-15T10:00:00Z',
    user: 'John Smith',
    table: 'reservations',
    operation: 'DELETE',
    recordId: '54321',
    fieldChanged: 'all',
    oldValue: 'Cancelled reservation record',
    newValue: null
  },
  {
    id: 7,
    timestamp: '2024-01-15T10:15:00Z',
    user: 'Jane Doe',
    table: 'settings',
    operation: 'UPDATE',
    recordId: 'SET-001',
    fieldChanged: 'value',
    oldValue: 'false',
    newValue: 'true'
  },
  {
    id: 8,
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Mike Wilson',
    table: 'guests',
    operation: 'UPDATE',
    recordId: '67890',
    fieldChanged: 'email',
    oldValue: 'old@email.com',
    newValue: 'new@email.com'
  }
])

// Computed properties
const filteredModifications = computed(() => {
  return modifications.value.filter(modification => {
    const modificationDate = modification.timestamp.split('T')[0]
    const matchesDateFrom = !filters.value.dateFrom || modificationDate >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || modificationDate <= filters.value.dateTo
    const matchesUser = !filters.value.user || modification.user === filters.value.user
    const matchesTable = !filters.value.table || modification.table === filters.value.table
    const matchesOperation = !filters.value.operation || modification.operation === filters.value.operation
    
    return matchesDateFrom && matchesDateTo && matchesUser && matchesTable && matchesOperation
  })
})

const uniqueUsers = computed(() => {
  return [...new Set(modifications.value.map(m => m.user))].sort()
})

const summary = computed(() => {
  const filtered = filteredModifications.value
  const insertOps = filtered.filter(m => m.operation === 'INSERT').length
  const updateOps = filtered.filter(m => m.operation === 'UPDATE').length
  const deleteOps = filtered.filter(m => m.operation === 'DELETE').length
  
  return {
    totalModifications: filtered.length,
    insertOperations: insertOps,
    updateOperations: updateOps,
    deleteOperations: deleteOps
  }
})

const operationBreakdown = computed(() => {
  const operations = [
    { operation: 'INSERT', color: '#10B981' },
    { operation: 'UPDATE', color: '#F59E0B' },
    { operation: 'DELETE', color: '#EF4444' }
  ]
  const total = filteredModifications.value.length
  
  return operations.map(operation => {
    const count = filteredModifications.value.filter(m => m.operation === operation.operation).length
    return {
      ...operation,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }
  }).filter(operation => operation.count > 0)
})

const tableBreakdown = computed(() => {
  const tables = ['reservations', 'guests', 'rooms', 'billing', 'users', 'settings']
  const tableCounts = tables.map(table => {
    const count = filteredModifications.value.filter(m => m.table === table).length
    return { table, count }
  }).filter(t => t.count > 0).sort((a, b) => b.count - a.count)
  
  const maxCount = tableCounts[0]?.count || 1
  return tableCounts.map(table => ({
    ...table,
    percentage: (table.count / maxCount) * 100
  }))
})

// Methods
const formatDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

const getOperationClass = (operation: string) => {
  switch (operation) {
    case 'INSERT':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'UPDATE':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'DELETE':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Table configuration
const tableColumns = computed(() => [
  { key: 'timestamp', label: t('common.timestamp'), type: 'date' },
  { key: 'user', label: t('common.user'), type: 'text' },
  { key: 'table', label: t('common.table'), type: 'text', translatable: true },
  { 
    key: 'operation', 
    label: t('common.operation'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'INSERT': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'UPDATE': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      'DELETE': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    }
  },
  { key: 'recordId', label: t('common.recordId'), type: 'text' },
  { key: 'fieldChanged', label: t('common.fieldChanged'), type: 'text' },
  { key: 'oldValue', label: t('common.oldValue'), type: 'text' },
  { key: 'newValue', label: t('common.newValue'), type: 'text' }
])

const tableActions = computed(() => [
  {
    label: t('common.viewDetails'),
    handler: (item: any) => viewModificationDetails(item.id),
    variant: 'primary'
  }
])

const viewModificationDetails = (modificationId: string) => {
  // Navigate to modification details or open modal
  console.log('View modification details:', modificationId)
}
</script>