<template>
  <ReportsLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.roomStatusReport') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.roomStatusReportDescription') }}
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
              {{ $t('common.date') }}
            </label>
            <input
              v-model="filters.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.floor') }}
            </label>
            <select
              v-model="filters.floor"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="1">{{ $t('common.floor') }} 1</option>
              <option value="2">{{ $t('common.floor') }} 2</option>
              <option value="3">{{ $t('common.floor') }} 3</option>
              <option value="4">{{ $t('common.floor') }} 4</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <select
              v-model="filters.roomType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="standard">{{ $t('common.standard') }}</option>
              <option value="deluxe">{{ $t('common.deluxe') }}</option>
              <option value="suite">{{ $t('common.suite') }}</option>
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
              <option value="occupied">{{ $t('common.occupied') }}</option>
              <option value="vacant-clean">{{ $t('common.vacantClean') }}</option>
              <option value="vacant-dirty">{{ $t('common.vacantDirty') }}</option>
              <option value="out-of-order">{{ $t('common.outOfOrder') }}</option>
              <option value="maintenance">{{ $t('common.maintenance') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('common.occupied') }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ summary.occupied }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('common.vacantClean') }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ summary.vacantClean }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('common.vacantDirty') }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ summary.vacantDirty }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('common.outOfOrder') }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ summary.outOfOrder }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('common.maintenance') }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ summary.maintenance }}</p>
          </div>
        </div>
      </div>

      <!-- Rooms Table -->
      <ReusableTable
        :title="$t('reports.roomsList')"
        :columns="tableColumns"
        :data="filteredRooms"
        :searchable="true"
        :empty-message="$t('reports.noDataAvailable')"
      />
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
  date: new Date().toISOString().split('T')[0],
  floor: '',
  roomType: '',
  status: ''
})

// Mock data
const rooms = ref([
  {
    id: 1,
    number: '101',
    floor: 1,
    type: 'standard',
    status: 'occupied',
    guest: 'John Smith',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    lastCleaned: '2024-01-15'
  },
  {
    id: 2,
    number: '102',
    floor: 1,
    type: 'standard',
    status: 'vacant-clean',
    guest: null,
    checkIn: null,
    checkOut: null,
    lastCleaned: '2024-01-16'
  },
  {
    id: 3,
    number: '103',
    floor: 1,
    type: 'deluxe',
    status: 'vacant-dirty',
    guest: null,
    checkIn: null,
    checkOut: null,
    lastCleaned: '2024-01-14'
  },
  {
    id: 4,
    number: '201',
    floor: 2,
    type: 'suite',
    status: 'occupied',
    guest: 'Sarah Johnson',
    checkIn: '2024-01-14',
    checkOut: '2024-01-20',
    lastCleaned: '2024-01-14'
  },
  {
    id: 5,
    number: '202',
    floor: 2,
    type: 'deluxe',
    status: 'maintenance',
    guest: null,
    checkIn: null,
    checkOut: null,
    lastCleaned: '2024-01-13'
  },
  {
    id: 6,
    number: '203',
    floor: 2,
    type: 'standard',
    status: 'out-of-order',
    guest: null,
    checkIn: null,
    checkOut: null,
    lastCleaned: '2024-01-12'
  }
])

// Computed properties
const filteredRooms = computed(() => {
  return rooms.value.filter(room => {
    const matchesFloor = !filters.value.floor || room.floor.toString() === filters.value.floor
    const matchesRoomType = !filters.value.roomType || room.type === filters.value.roomType
    const matchesStatus = !filters.value.status || room.status === filters.value.status
    
    return matchesFloor && matchesRoomType && matchesStatus
  })
})

const summary = computed(() => {
  const filtered = filteredRooms.value
  return {
    occupied: filtered.filter(r => r.status === 'occupied').length,
    vacantClean: filtered.filter(r => r.status === 'vacant-clean').length,
    vacantDirty: filtered.filter(r => r.status === 'vacant-dirty').length,
    outOfOrder: filtered.filter(r => r.status === 'out-of-order').length,
    maintenance: filtered.filter(r => r.status === 'maintenance').length
  }
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { key: 'number', label: t('common.roomNumber'), type: 'text' },
  { key: 'floor', label: t('common.floor'), type: 'text' },
  { key: 'type', label: t('common.roomType'), type: 'text', translatable: true },
  { 
    key: 'status', 
    label: t('common.status'), 
    type: 'badge',
    translatable: true,
    badgeColors: {
      'occupied': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'vacant-clean': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'vacant-dirty': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'out-of-order': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'maintenance': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  },
  { key: 'guest', label: t('common.guest'), type: 'text' },
  { key: 'checkIn', label: t('common.checkIn'), type: 'date' },
  { key: 'checkOut', label: t('common.checkOut'), type: 'date' },
  { key: 'lastCleaned', label: t('common.lastCleaned'), type: 'date' }
])

const getStatusClass = (status: string) => {
  switch (status) {
    case 'occupied':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'vacant-clean':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'vacant-dirty':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'out-of-order':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'maintenance':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>