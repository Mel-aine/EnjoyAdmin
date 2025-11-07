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

        <!-- Actions: Export -->
        <div class="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <div class="relative">
            <button
              @click="exportMenuOpen = !exportMenuOpen"
              :disabled="exportLoading"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              <svg v-if="exportLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!exportLoading">{{ $t('common.export') }}</span>
              <svg v-if="!exportLoading" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Export menu -->
            <div v-if="exportMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <button @click="exportCSV" :disabled="exportLoading" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ $t('common.csv') }}
              </button>
              <button @click="exportPDF" :disabled="exportLoading" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {{ $t('common.pdf') }}
              </button>
              <button @click="exportExcel" :disabled="exportLoading" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ $t('common.excel') }}
              </button>
            </div>
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
        :data="displayedTasks"
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import ReusableTable from '@/components/tables/ReusableTable.vue'
import type { Column } from '../../../utils/models'

const { t } = useI18n()
const router = useRouter()

// Export state
const exportMenuOpen = ref(false)
const exportLoading = ref(false)

const exportCSV = async () => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export CSV: Task list', filteredTasks.value)
    // TODO: implémenter l’export réel côté API si disponible
  } finally {
    exportLoading.value = false
  }
}

const exportPDF = async () => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export PDF: Task list', filteredTasks.value)
  } finally {
    exportLoading.value = false
  }
}

const exportExcel = async () => {
  try {
    exportLoading.value = true
    exportMenuOpen.value = false
    console.log('Export Excel: Task list', filteredTasks.value)
  } finally {
    exportLoading.value = false
  }
}

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

// Traduction de la colonne Département uniquement; on conserve les valeurs brutes pour "status"
// afin que le mapping des couleurs fonctionne.
const translateDepartment = (dept: string) => {
  switch (dept) {
    case 'housekeeping': return t('common.housekeeping')
    case 'maintenance': return t('common.maintenance')
    case 'front-desk': return t('common.front-desk')
    case 'concierge': return t('common.concierge')
    default: return dept
  }
}

const displayedTasks = computed(() => {
  return filteredTasks.value.map(task => ({
    ...task,
    department: translateDepartment(task.department),
    title: translateTitle(task.title),
    priority: translatePriority(task.priority),
    // status reste brut pour les couleurs
  }))
})

// Traduction simple des titres courants (mock) et quelques motifs
function translateTitle(title: string): string {
  if (!title) return ''
  const tLower = title.toLowerCase()
  // Cas exacts
  if (tLower === 'guest welcome package') return 'Pack de bienvenue client'
  if (tLower === 'check-in assistance') return "Assistance à l'enregistrement"
  // Motifs
  const roomNumMatch = title.match(/room\s*(\d+)/i)
  if (/^clean\s+room/i.test(title) && roomNumMatch) {
    return `Nettoyer la chambre ${roomNumMatch[1]}`
  }
  if (/^fix\s*ac\s*in\s*room/i.test(title) && roomNumMatch) {
    return `Réparer la climatisation dans la chambre ${roomNumMatch[1]}`
  }
  if (/^restock\s*minibar\s*room/i.test(title) && roomNumMatch) {
    return `Réapprovisionner le minibar chambre ${roomNumMatch[1]}`
  }
  return title
}

function translatePriority(p: string): string {
  switch ((p || '').toLowerCase()) {
    case 'urgent': return t('common.urgent')
    case 'high': return t('high')
    case 'medium': return t('medium')
    case 'low': return t('low')
    default: return p
  }
}

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
    badgeColors: {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
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