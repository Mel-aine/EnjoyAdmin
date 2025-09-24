<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.frontOffice.inventoryByRoomType') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.frontOffice.inventoryByRoomTypeDescription') }}
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
              {{ $t('common.date') }}
            </label>
            <input
              v-model="filters.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.roomType') }}
            </label>
            <select
              v-model="filters.roomType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="standard">{{ $t('rooms.types.standard') }}</option>
              <option value="deluxe">{{ $t('rooms.types.deluxe') }}</option>
              <option value="suite">{{ $t('rooms.types.suite') }}</option>
              <option value="presidential">{{ $t('rooms.types.presidential') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="available">{{ $t('rooms.status.available') }}</option>
              <option value="occupied">{{ $t('rooms.status.occupied') }}</option>
              <option value="maintenance">{{ $t('rooms.status.maintenance') }}</option>
              <option value="out-of-order">{{ $t('rooms.status.outOfOrder') }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="loadInventoryReport"
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.totalRooms') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalRooms }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.availableRooms') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.availableRooms }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.occupiedRooms') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.occupiedRooms }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('reports.occupancyRate') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.occupancyRate }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <ReusableTable
        :title="t('reports.frontOffice.inventoryByRoomType')"
        :columns="tableColumns"
        :data="filteredInventory"
        :searchable="true"
        :empty-message="t('common.noDataAvailable')"
      >
        <template #occupancyRate="{ item }">
          <span class="font-medium text-blue-600">
            {{ ((item.occupied / item.total) * 100).toFixed(1) }}%
          </span>
        </template>
      </ReusableTable>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Action, Column } from '../../../utils/models'

const { t } = useI18n()

interface RoomTypeInventory {
  type: string
  total: number
  available: number
  occupied: number
  maintenance: number
}

const filters = ref({
  date: new Date().toISOString().split('T')[0],
  roomType: '',
  status: ''
})

const inventory = ref<RoomTypeInventory[]>([])
const loading = ref(false)

const summary = ref({
  totalRooms: 0,
  availableRooms: 0,
  occupiedRooms: 0,
  occupancyRate: 0
})

const filteredInventory = computed(() => {
  return inventory.value.filter(item => {
    if (filters.value.roomType && item.type !== filters.value.roomType) {
      return false
    }
    return true
  })
})

// Table configuration
const tableColumns = computed<Column[]>(() => [
  { 
    key: 'type', 
    label: t('common.roomType'), 
    type: 'text',
    translatable: true,
    translatePrefix: 'rooms.types'
  },
  { key: 'total', label: t('reports.totalRooms'), type: 'text' },
  { key: 'available', label: t('reports.availableRooms'), type: 'text' },
  { key: 'occupied', label: t('reports.occupiedRooms'), type: 'text' },
  { key: 'maintenance', label: t('reports.maintenanceRooms'), type: 'text' },
  { key: 'occupancyRate', label: t('reports.occupancyRate'), type: 'custom' }
])

const loadInventoryReport = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    inventory.value = [
      {
        type: 'standard',
        total: 50,
        available: 20,
        occupied: 25,
        maintenance: 5
      },
      {
        type: 'deluxe',
        total: 30,
        available: 10,
        occupied: 18,
        maintenance: 2
      },
      {
        type: 'suite',
        total: 15,
        available: 5,
        occupied: 8,
        maintenance: 2
      },
      {
        type: 'presidential',
        total: 5,
        available: 2,
        occupied: 2,
        maintenance: 1
      }
    ]
    
    // Calculate summary
    summary.value = {
      totalRooms: inventory.value.reduce((sum, item) => sum + item.total, 0),
      availableRooms: inventory.value.reduce((sum, item) => sum + item.available, 0),
      occupiedRooms: inventory.value.reduce((sum, item) => sum + item.occupied, 0),
      occupancyRate: 0
    }
    
    summary.value.occupancyRate = summary.value.totalRooms > 0 ? 
      (summary.value.occupiedRooms / summary.value.totalRooms) * 100 : 0
  } catch (error) {
    console.error('Error loading inventory report:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInventoryReport()
})
</script>