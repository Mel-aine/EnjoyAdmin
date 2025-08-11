<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.custom.customReportBuilder') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.custom.customReportBuilderDescription') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Report Configuration Panel -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('reports.reportConfiguration') }}
            </h2>
            
            <!-- Report Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('common.reportName') }}
              </label>
              <input
                v-model="reportConfig.name"
                type="text"
                :placeholder="$t('reports.enterReportName')"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- Report Type -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('common.reportType') }}
              </label>
              <select
                v-model="reportConfig.type"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="table">{{ $t('reports.tableReport') }}</option>
                <option value="chart">{{ $t('reports.chartReport') }}</option>
                <option value="summary">{{ $t('reports.summaryReport') }}</option>
                <option value="dashboard">{{ $t('reports.dashboardReport') }}</option>
              </select>
            </div>

            <!-- Data Source -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('reports.dataSource') }}
              </label>
              <select
                v-model="reportConfig.dataSource"
                @change="loadAvailableFields"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{{ $t('reports.selectDataSource') }}</option>
                <option value="reservations">{{ $t('common.reservations') }}</option>
                <option value="guests">{{ $t('common.guests') }}</option>
                <option value="rooms">{{ $t('common.rooms') }}</option>
                <option value="payments">{{ $t('common.payments') }}</option>
                <option value="inventory">{{ $t('common.inventory') }}</option>
                <option value="financial">{{ $t('common.financial') }}</option>
              </select>
            </div>

            <!-- Date Range -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('common.dateRange') }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model="reportConfig.dateFrom"
                  type="date"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  v-model="reportConfig.dateTo"
                  type="date"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <!-- Schedule -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('reports.schedule') }}
              </label>
              <select
                v-model="reportConfig.schedule"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="manual">{{ $t('reports.manual') }}</option>
                <option value="daily">{{ $t('common.daily') }}</option>
                <option value="weekly">{{ $t('common.weekly') }}</option>
                <option value="monthly">{{ $t('common.monthly') }}</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2">
              <button
                @click="generateReport"
                :disabled="!canGenerateReport"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {{ $t('reports.generateReport') }}
              </button>
              <button
                @click="saveReport"
                :disabled="!reportConfig.name"
                class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {{ $t('reports.saveReport') }}
              </button>
              <button
                @click="resetConfiguration"
                class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {{ $t('common.reset') }}
              </button>
            </div>
          </div>

          <!-- Saved Reports -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('reports.savedReports') }}
            </h3>
            <div class="space-y-2">
              <div
                v-for="report in savedReports"
                :key="report.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ report.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ report.type }} • {{ formatDate(report.createdAt) }}</div>
                </div>
                <div class="flex space-x-1">
                  <button
                    @click="loadReport(report)"
                    class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteReport(report.id)"
                    class="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Field Selection and Report Preview -->
        <div class="lg:col-span-2">
          <!-- Available Fields -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('reports.availableFields') }}
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <!-- Available Fields -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('reports.availableFields') }}
                </h3>
                <div class="border border-gray-300 dark:border-gray-600 rounded-md p-3 h-48 overflow-y-auto">
                  <div
                    v-for="field in availableFields"
                    :key="field.name"
                    @click="addField(field)"
                    class="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ field.label }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ field.type }}</div>
                    </div>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Selected Fields -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('reports.selectedFields') }}
                </h3>
                <div class="border border-gray-300 dark:border-gray-600 rounded-md p-3 h-48 overflow-y-auto">
                  <div
                    v-for="(field, index) in selectedFields"
                    :key="field.name"
                    class="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded mb-2"
                  >
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ field.label }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ field.type }}</div>
                    </div>
                    <button
                      @click="removeField(index)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters and Grouping -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('reports.filtersAndGrouping') }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Filters -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('common.filters') }}
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="(filter, index) in reportConfig.filters"
                    :key="index"
                    class="flex items-center space-x-2"
                  >
                    <select
                      v-model="filter.field"
                      class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">{{ $t('reports.selectField') }}</option>
                      <option v-for="field in selectedFields" :key="field.name" :value="field.name">
                        {{ field.label }}
                      </option>
                    </select>
                    <select
                      v-model="filter.operator"
                      class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    >
                      <option value="equals">{{ $t('common.equals') }}</option>
                      <option value="contains">{{ $t('common.contains') }}</option>
                      <option value="greater">{{ $t('common.greater') }}</option>
                      <option value="less">{{ $t('common.less') }}</option>
                    </select>
                    <input
                      v-model="filter.value"
                      type="text"
                      :placeholder="$t('common.value')"
                      class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      @click="removeFilter(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    @click="addFilter"
                    class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    + {{ $t('reports.addFilter') }}
                  </button>
                </div>
              </div>

              <!-- Grouping -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('reports.groupBy') }}
                </h3>
                <select
                  v-model="reportConfig.groupBy"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{{ $t('reports.noGrouping') }}</option>
                  <option v-for="field in selectedFields" :key="field.name" :value="field.name">
                    {{ field.label }}
                  </option>
                </select>

                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">
                  {{ $t('reports.sortBy') }}
                </h3>
                <div class="flex space-x-2">
                  <select
                    v-model="reportConfig.sortBy"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">{{ $t('reports.noSorting') }}</option>
                    <option v-for="field in selectedFields" :key="field.name" :value="field.name">
                      {{ field.label }}
                    </option>
                  </select>
                  <select
                    v-model="reportConfig.sortOrder"
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="asc">{{ $t('common.ascending') }}</option>
                    <option value="desc">{{ $t('common.descending') }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Report Preview -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ $t('reports.reportPreview') }}
              </h2>
            </div>
            <div class="p-6">
              <div v-if="!selectedFields.length" class="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <p>{{ $t('reports.selectFieldsToPreview') }}</p>
              </div>
              
              <div v-else-if="reportConfig.type === 'table'" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        v-for="field in selectedFields"
                        :key="field.name"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {{ field.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="row in previewData" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td
                        v-for="field in selectedFields"
                        :key="field.name"
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                      >
                        {{ row[field.name] || '-' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <p>{{ $t('reports.chartPreviewNotAvailable') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

// Report configuration
const reportConfig = ref<any>({
  name: '',
  type: 'table',
  dataSource: '',
  dateFrom: '',
  dateTo: '',
  schedule: 'manual',
  filters: [],
  groupBy: '',
  sortBy: '',
  sortOrder: 'asc'
})

// Available fields based on data source
const availableFields = ref<any[]>([])
const selectedFields = ref<any[]>([])

// Field definitions for different data sources
const fieldDefinitions = {
  reservations: [
    { name: 'id', label: 'Reservation ID', type: 'number' },
    { name: 'guestName', label: 'Guest Name', type: 'text' },
    { name: 'checkIn', label: 'Check In', type: 'date' },
    { name: 'checkOut', label: 'Check Out', type: 'date' },
    { name: 'roomType', label: 'Room Type', type: 'text' },
    { name: 'rate', label: 'Rate', type: 'currency' },
    { name: 'status', label: 'Status', type: 'text' }
  ],
  guests: [
    { name: 'id', label: 'Guest ID', type: 'number' },
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'nationality', label: 'Nationality', type: 'text' },
    { name: 'totalStays', label: 'Total Stays', type: 'number' }
  ],
  rooms: [
    { name: 'number', label: 'Room Number', type: 'text' },
    { name: 'type', label: 'Room Type', type: 'text' },
    { name: 'status', label: 'Status', type: 'text' },
    { name: 'floor', label: 'Floor', type: 'number' },
    { name: 'rate', label: 'Rate', type: 'currency' }
  ],
  payments: [
    { name: 'id', label: 'Payment ID', type: 'number' },
    { name: 'amount', label: 'Amount', type: 'currency' },
    { name: 'method', label: 'Payment Method', type: 'text' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'text' }
  ],
  inventory: [
    { name: 'item', label: 'Item', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'quantity', label: 'Quantity', type: 'number' },
    { name: 'cost', label: 'Cost', type: 'currency' },
    { name: 'supplier', label: 'Supplier', type: 'text' }
  ],
  financial: [
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'revenue', label: 'Revenue', type: 'currency' },
    { name: 'expenses', label: 'Expenses', type: 'currency' },
    { name: 'profit', label: 'Profit', type: 'currency' },
    { name: 'category', label: 'Category', type: 'text' }
  ]
}

// Mock saved reports
const savedReports = ref([
  {
    id: 1,
    name: 'Monthly Revenue Report',
    type: 'table',
    dataSource: 'financial',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Guest Analysis',
    type: 'chart',
    dataSource: 'guests',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: 'Room Occupancy',
    type: 'dashboard',
    dataSource: 'reservations',
    createdAt: '2024-01-05'
  }
])

// Mock preview data
const previewData = ref([
  { id: 1, guestName: 'John Doe', checkIn: '2024-01-15', checkOut: '2024-01-17', roomType: 'Standard', rate: '$150.00', status: 'Confirmed' },
  { id: 2, guestName: 'Jane Smith', checkIn: '2024-01-16', checkOut: '2024-01-18', roomType: 'Deluxe', rate: '$200.00', status: 'Confirmed' },
  { id: 3, guestName: 'Bob Johnson', checkIn: '2024-01-17', checkOut: '2024-01-20', roomType: 'Suite', rate: '$300.00', status: 'Pending' }
])

// Computed properties
const canGenerateReport = computed(() => {
  return reportConfig.value.dataSource && selectedFields.value.length > 0
})

// Methods
const loadAvailableFields = () => {
  const dataSource = reportConfig.value.dataSource
  if (dataSource && fieldDefinitions[dataSource]) {
    availableFields.value = fieldDefinitions[dataSource]
  } else {
    availableFields.value = []
  }
  selectedFields.value = []
}

const addField = (field) => {
  if (!selectedFields.value.find(f => f.name === field.name)) {
    selectedFields.value.push(field)
  }
}

const removeField = (index) => {
  selectedFields.value.splice(index, 1)
}

const addFilter = () => {
  reportConfig.value.filters.push({
    field: '',
    operator: 'equals',
    value: ''
  })
}

const removeFilter = (index) => {
  reportConfig.value.filters.splice(index, 1)
}

const generateReport = () => {
  // Mock report generation
  console.log('Generating report with config:', reportConfig.value)
  console.log('Selected fields:', selectedFields.value)
  // In a real application, this would make an API call to generate the report
}

const saveReport = () => {
  const newReport = {
    id: Date.now(),
    name: reportConfig.value.name,
    type: reportConfig.value.type,
    dataSource: reportConfig.value.dataSource,
    createdAt: new Date().toISOString().split('T')[0],
    config: { ...reportConfig.value },
    fields: [...selectedFields.value]
  }
  savedReports.value.unshift(newReport)
  console.log('Report saved:', newReport)
}

const loadReport = (report) => {
  reportConfig.value = { ...report.config }
  selectedFields.value = [...report.fields]
  loadAvailableFields()
}

const deleteReport = (reportId) => {
  const index = savedReports.value.findIndex(r => r.id === reportId)
  if (index > -1) {
    savedReports.value.splice(index, 1)
  }
}

const resetConfiguration = () => {
  reportConfig.value = {
    name: '',
    type: 'table',
    dataSource: '',
    dateFrom: '',
    dateTo: '',
    schedule: 'manual',
    filters: [],
    groupBy: '',
    sortBy: '',
    sortOrder: 'asc'
  }
  selectedFields.value = []
  availableFields.value = []
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>