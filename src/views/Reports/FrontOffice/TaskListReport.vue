<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.taskListReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.taskListReportDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {{ $t('common.department') }}
            </label>
            <select
              v-model="filters.department"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="housekeeping">{{ $t('common.housekeeping') }}</option>
              <option value="maintenance">{{ $t('common.maintenance') }}</option>
              <option value="front-desk">{{ $t('common.frontDesk') }}</option>
              <option value="concierge">{{ $t('common.concierge') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="pending">{{ $t('common.pending') }}</option>
              <option value="in-progress">{{ $t('common.inProgress') }}</option>
              <option value="completed">{{ $t('common.completed') }}</option>
              <option value="cancelled">{{ $t('common.cancelled') }}</option>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalTasks') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.totalTasks }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.pendingTasks') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.pendingTasks }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.inProgressTasks') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.inProgressTasks }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.completedTasks') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.completedTasks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Table -->
      <ReusableTable
        :title="$t('reports.tasksList')"
        :columns="tableColumns"
        :data="filteredTasks"
        :actions="tableActions"
        :searchable="true"
        :empty-message="$t('reports.noDataAvailable')"
      >
        <template #title="{ item }">
          <div>
            <div class="font-medium">{{ item.title }}</div>
            <div class="text-gray-500 dark:text-gray-400 text-xs">{{ item.description }}</div>
          </div>
        </template>
      </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import type { Column } from '../../../utils/models'

const { t } = useI18n()

// Filters
const filters = ref({
  dateFrom: '',
  dateTo: '',
  department: '',
  status: ''
})

// Mock data
const tasks = ref([
  {
    id: 1001,
    title: 'Clean Room 101',
    description: 'Deep cleaning required after checkout',
    department: 'housekeeping',
    assignedTo: 'Maria Garcia',
    priority: 'high',
    dueDate: '2024-01-16',
    status: 'pending',
    createdDate: '2024-01-15'
  },
  {
    id: 1002,
    title: 'Fix AC in Room 205',
    description: 'Air conditioning not working properly',
    department: 'maintenance',
    assignedTo: 'John Smith',
    priority: 'urgent',
    dueDate: '2024-01-16',
    status: 'in-progress',
    createdDate: '2024-01-15'
  },
  {
    id: 1003,
    title: 'Guest Welcome Package',
    description: 'Prepare welcome package for VIP guest',
    department: 'concierge',
    assignedTo: 'Sarah Johnson',
    priority: 'medium',
    dueDate: '2024-01-17',
    status: 'completed',
    createdDate: '2024-01-15'
  },
  {
    id: 1004,
    title: 'Check-in Assistance',
    description: 'Assist with group check-in at 3 PM',
    department: 'front-desk',
    assignedTo: 'Mike Wilson',
    priority: 'medium',
    dueDate: '2024-01-16',
    status: 'pending',
    createdDate: '2024-01-16'
  },
  {
    id: 1005,
    title: 'Restock Minibar Room 312',
    description: 'Minibar needs restocking',
    department: 'housekeeping',
    assignedTo: 'Lisa Brown',
    priority: 'low',
    dueDate: '2024-01-17',
    status: 'in-progress',
    createdDate: '2024-01-16'
  }
])

// Computed properties
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesDateFrom = !filters.value.dateFrom || task.createdDate >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || task.createdDate <= filters.value.dateTo
    const matchesDepartment = !filters.value.department || task.department === filters.value.department
    const matchesStatus = !filters.value.status || task.status === filters.value.status
    
    return matchesDateFrom && matchesDateTo && matchesDepartment && matchesStatus
  })
})

const summary = computed(() => {
  const filtered = filteredTasks.value
  return {
    totalTasks: filtered.length,
    pendingTasks: filtered.filter(t => t.status === 'pending').length,
    inProgressTasks: filtered.filter(t => t.status === 'in-progress').length,
    completedTasks: filtered.filter(t => t.status === 'completed').length
  }
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'id', label: t('common.taskId'), type: 'text' as const, prefix: '#' },
  { key: 'title', label: t('common.title'), type: 'custom' as const },
  { key: 'department', label: t('common.department'), type: 'text' as const, translatable: true },
  { key: 'assignedTo', label: t('common.assignedTo'), type: 'text' as const },
  { 
    key: 'priority', 
    label: t('common.priority'), 
    type: 'badge' as const,
    translatable: true,
  },
  { key: 'dueDate', label: t('common.dueDate'), type: 'date' as const },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge' as const,
    translatable: true,
  }
])

const tableActions = computed(() => [
  {
    label: t('common.view'),
    handler: (item: any) => viewTask(item),
    variant: 'primary' as const
  },
  {
    label: t('common.update'),
    handler: (item: any) => updateTaskStatus(item),
    variant: 'success' as const,
    condition: (item: any) => item.status !== 'completed'
  }
])

const viewTask = (task: any) => {
  // Implementation for viewing task details
  console.log('Viewing task:', task)
}

const updateTaskStatus = (task: any) => {
  // Implementation for updating task status
  console.log('Updating task status:', task)
}
</script>