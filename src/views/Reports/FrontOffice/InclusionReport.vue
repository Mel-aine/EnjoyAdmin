<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.inclusionReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.inclusionReportDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.inclusionType') }}
            </label>
            <select
              v-model="filters.inclusionType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="breakfast">{{ $t('inclusions.breakfast') }}</option>
              <option value="lunch">{{ $t('inclusions.lunch') }}</option>
              <option value="dinner">{{ $t('inclusions.dinner') }}</option>
              <option value="spa">{{ $t('inclusions.spa') }}</option>
              <option value="wifi">{{ $t('inclusions.wifi') }}</option>
              <option value="parking">{{ $t('inclusions.parking') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadInclusionReport"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {{ $t('common.generateReport') }}
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalInclusions') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalInclusions }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalValue') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.totalValue }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.uniqueGuests') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.uniqueGuests }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.avgPerGuest') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ summary.avgPerGuest }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <ReusableTable
        :title="`${$t('reports.frontOffice.inclusionReport')} (${filteredInclusions.length})`"
        :columns="tableColumns"
        :data="filteredInclusions"
        :searchable="true"
        :search-placeholder="$t('common.searchInclusions')"
        :selectable="false"
        :loading="loading"
        :empty-state-title="$t('common.noDataFound')"
        :empty-state-message="$t('reports.noInclusionsFound')"
      >
        <template #column-value="{ item }">
          <span class="text-sm text-gray-900 dark:text-white">
            ${{ item.value.toFixed(2) }}
          </span>
        </template>
      </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Column } from '../../../utils/models'

const { t } = useI18n()

interface Inclusion {
  id: string
  date: string
  guestName: string
  roomNumber: string
  type: string
  quantity: number
  value: number
  status: string
}

const filters = ref({
  dateFrom: '',
  dateTo: '',
  inclusionType: ''
})

const inclusions = ref<Inclusion[]>([])
const loading = ref(false)

const summary = ref({
  totalInclusions: 0,
  totalValue: 0,
  uniqueGuests: 0,
  avgPerGuest: 0
})

const filteredInclusions = computed(() => {
  return inclusions.value.filter(inclusion => {
    if (filters.value.inclusionType && inclusion.type !== filters.value.inclusionType) {
      return false
    }
    return true
  })
})

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'date', label: t('common.date'), type: 'date' },
  { key: 'guestName', label: t('common.guestName'), type: 'text' },
  { key: 'roomNumber', label: t('common.roomNumber'), type: 'text' },
  { 
    key: 'type', 
    label: t('common.inclusionType'), 
    type: 'text',
    translatable: true,
    translatePrefix: 'inclusions'
  },
  { key: 'quantity', label: t('common.quantity'), type: 'text' },
  { key: 'value', label: t('common.value'), type: 'custom' },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    translatePrefix: 'inclusions.status',
    badgeColors: {
      'used': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'expired': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    }
  }
])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'used':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    case 'expired':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  }
}

const loadInclusionReport = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    inclusions.value = [
      {
        id: '1',
        date: '2024-01-15',
        guestName: 'John Doe',
        roomNumber: '101',
        type: 'breakfast',
        quantity: 2,
        value: 25.00,
        status: 'used'
      },
      {
        id: '2',
        date: '2024-01-15',
        guestName: 'Jane Smith',
        roomNumber: '102',
        type: 'spa',
        quantity: 1,
        value: 80.00,
        status: 'pending'
      }
    ]
    
    // Calculate summary
    summary.value = {
      totalInclusions: inclusions.value.length,
      totalValue: inclusions.value.reduce((sum, inc) => sum + inc.value, 0),
      uniqueGuests: new Set(inclusions.value.map(inc => inc.guestName)).size,
      avgPerGuest: inclusions.value.length > 0 ? 
        inclusions.value.reduce((sum, inc) => sum + inc.value, 0) / new Set(inclusions.value.map(inc => inc.guestName)).size : 0
    }
  } catch (error) {
    console.error('Error loading inclusion report:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInclusionReport()
})
</script>