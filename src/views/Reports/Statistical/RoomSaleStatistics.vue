<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.statistical.roomSaleStatistics') }}
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <!-- First Row: Date Range and Room Type -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <!-- Transaction Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.from') }}
            </label>
            <InputDatepicker 
              v-model="filters.transactionFrom" 
              :placeholder="'20/09/2021'"
              class="w-full"
            />
          </div>
          
          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.to') }}
            </label>
            <InputDatepicker 
              v-model="filters.transactionTo" 
              :placeholder="'20/09/2021'"
              class="w-full"
            />
          </div>

          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.roomType') }}
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              :placeholder="t('common.selectPlaceholder')"
              class="w-full"
            />
          </div>
                 <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.sortBy') }}
            </label>
            <SelectComponent 
              v-model="filters.sortBy"
              :options="sortByOptions"
              :placeholder="t('common.selectPlaceholder')"
              class="w-full"
            />
          </div>


        </div>

        <!-- Second Row: Sort By -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <!-- Show Inactive Rooms Checkbox -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.showInactiveRooms" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ t('reports.statistical.showInactiveRooms') }}
            </label>
          </div>
          <!-- Sort Order -->
          <div class="flex items-end gap-4">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.sortOrder" 
                type="radio"
                value="asc"
                name="sortOrder"
                class="text-blue-600"
              />
              {{ t('common.ascending') }}
            </label>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.sortOrder" 
                type="radio"
                value="desc"
                name="sortOrder"
                class="text-blue-600"
              />
              {{ t('common.descending') }}
            </label>
          </div>
        </div>

        <!-- Third Row: Report Template and Actions -->
        <div class="flex flex-col sm:flex-row items-end justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <!-- Report Template -->
<!--           <div class="flex items-end gap-3 w-full sm:w-auto">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('reports.reportTemplate') }}
              </label>
              <div class="flex items-center gap-2">
                <SelectComponent 
                  v-model="filters.reportTemplate"
                  :options="reportTemplateOptions"
                  :placeholder="t('reportTemplates.default')"
                  class="min-w-32"
                />
                <button 
                  @click="editTemplate"
                  class="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :title="t('common.editTemplate')"
                >
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div> -->

          <!-- Action Buttons -->
          <div class="flex gap-2 w-full sm:w-auto">
            <ButtonComponent 
              @click="generateReport"
              variant=""
               class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            ><svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('common.report') }}
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
            ><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
              {{ t('common.reset') }}
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }} 
            </h2>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
                {{ t('reports.statistical.roomSaleStatistics') }}
            </h2>
          </div>

          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ t('common.from') }}: {{ filters.transactionFrom }}  {{ t('common.to') }} {{ filters.transactionTo }}</span> • 
            <span>{{ t('common.sortBy') }}: {{ selectedSortByLabel }}</span> • 
            <span>{{ t('reports.statistical.showInactiveRooms') }}: {{ filters.showInactiveRooms ? t('common.included') : t('common.excluded') }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            :title="t('reports.statistical.roomSaleStatistics')"
            :data="roomSalesData"
            :columns="selectedTableColumns"
            :show-header=false
            class="w-full mb-4 min-w-max"
          />
        </div>

        <!-- Statistics Summary -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ t('common.totalRooms') }}: {{ totalRooms }}</div>
            <div>{{ t('common.occupiedRooms') }}: {{ occupiedRooms }}</div>
            <div>{{ t('common.occupancyRate') }}: {{ occupancyRate }}%</div>
            <div>{{ t('common.totalRevenue') }}: {{ totalRevenue }}</div>
            <div>{{ t('common.revpar') }}: {{ revPAR }}</div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import { defineAsyncComponent } from 'vue'
const ReportsLayout = defineAsyncComponent(() => import('@/components/layout/ReportsLayout.vue'))
import { useServiceStore } from '../../../composables/serviceStore'


const { t } = useI18n()
const loading = ref<boolean>(false)
const hotelName = computed(() => {
  return useServiceStore().getCurrentService?.hotelName
})

interface FilterOptions {
  value: string;
  label: string;
}

interface RoomSalesData {
  roomNo: string;
  roomType: string;
  status: string;
  occupancyDays: number;
  totalNights: number;
  occupancyRate: number;
  averageRate: number;
  totalRevenue: number;
  revPAR: number;
  lastOccupied: string;
}

interface Filters {
  transactionFrom: string;
  transactionTo: string;
  roomType: string;
  showInactiveRooms: boolean;
  sortBy: string;
  sortOrder: string;
  reportTemplate: string;
}

//const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  transactionFrom: '20/09/2021',
  transactionTo: '20/09/2021',
  roomType: '',
  showInactiveRooms: false,
  sortBy: 'room',
  sortOrder: 'asc',
  reportTemplate: 'default'
})

// Options for selects
const roomTypeOptions = computed<FilterOptions[]>(() => [
  { value: 'all', label: t('common.all') },
  { value: 'suite', label: t('common.suite') },
  { value: 'deluxe', label: t('common.deluxe') },
  { value: 'standard', label: t('common.standard') },
  { value: 'executive', label: t('common.executive') }
])

const sortByOptions = computed<FilterOptions[]>(() => [
  { value: 'room', label: t('common.room') },
  { value: 'roomType', label: t('common.roomType') },
  { value: 'occupancyRate', label: t('common.occupancyRate') },
  { value: 'revenue', label: t('common.revenue') },
  { value: 'revPAR', label: t('common.revpar') }
])

/* const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: t('reportTemplates.default') },
  { value: 'detailed', label: t('reportTemplates.detailed') },
  { value: 'summary', label: t('reportTemplates.summary') },
  { value: 'performance', label: t('reportTemplates.performance') },
  { value: 'custom', label: t('reportTemplates.custom') }
])
 */
// Sample room sales data
const roomSalesData = ref<RoomSalesData[]>([
  {
    roomNo: '101',
    roomType: 'Deluxe',
    status: 'Active',
    occupancyDays: 25,
    totalNights: 30,
    occupancyRate: 83.3,
    averageRate: 150.00,
    totalRevenue: 3750.00,
    revPAR: 125.00,
    lastOccupied: '19/09/2021'
  },
  {
    roomNo: '102',
    roomType: 'Standard',
    status: 'Active',
    occupancyDays: 20,
    totalNights: 30,
    occupancyRate: 66.7,
    averageRate: 100.00,
    totalRevenue: 2000.00,
    revPAR: 66.67,
    lastOccupied: '18/09/2021'
  },
  {
    roomNo: '201',
    roomType: 'Suite',
    status: 'Active',
    occupancyDays: 28,
    totalNights: 30,
    occupancyRate: 93.3,
    averageRate: 250.00,
    totalRevenue: 7000.00,
    revPAR: 233.33,
    lastOccupied: '20/09/2021'
  },
  {
    roomNo: '202',
    roomType: 'Standard',
    status: 'Inactive',
    occupancyDays: 0,
    totalNights: 30,
    occupancyRate: 0,
    averageRate: 0,
    totalRevenue: 0,
    revPAR: 0,
    lastOccupied: '15/08/2021'
  }
])

// Computed properties
const selectedTableColumns = computed(() => [
  { key: 'roomNo', label: t('common.roomNumber') },
  { key: 'roomType', label: t('common.roomType') },
  { key: 'status', label: t('common.status') },
  { key: 'occupancyDays', label: t('reports.statistical.occupiedDays') },
  { key: 'totalNights', label: t('common.totalNights') },
  { key: 'occupancyRate', label: t('common.occupancyRate') + ' (%)' },
  { key: 'averageRate', label: t('common.adr') },
  { key: 'totalRevenue', label: t('common.totalRevenue') },
  { key: 'revPAR', label: t('common.revpar') },
  { key: 'lastOccupied', label: t('reports.statistical.lastOccupied') }
])

const selectedSortByLabel = computed(() => {
  const selected = sortByOptions.value.find(option => option.value === filters.value.sortBy)
  return selected ? selected.label : t('common.room')
})

const filteredRoomSalesData = computed(() => {
  let data = roomSalesData.value
  
  // Filter out inactive rooms if not selected
  if (!filters.value.showInactiveRooms) {
    data = data.filter(room => room.status === 'Active')
  }
  
  // Filter by room type
  if (filters.value.roomType && filters.value.roomType !== 'all') {
    data = data.filter(room => room.roomType.toLowerCase() === filters.value.roomType)
  }
  
  return data
})

const totalRooms = computed(() => {
  return filteredRoomSalesData.value.length
})

const occupiedRooms = computed(() => {
  return filteredRoomSalesData.value.filter(room => room.occupancyDays > 0).length
})

const occupancyRate = computed(() => {
  if (filteredRoomSalesData.value.length === 0) return '0.0'
  const totalOccupancyDays = filteredRoomSalesData.value.reduce((sum, room) => sum + room.occupancyDays, 0)
  const totalAvailableDays = filteredRoomSalesData.value.reduce((sum, room) => sum + room.totalNights, 0)
  return totalAvailableDays > 0 ? ((totalOccupancyDays / totalAvailableDays) * 100).toFixed(1) : '0.0'
})

const totalRevenue = computed(() => {
  const total = filteredRoomSalesData.value.reduce((sum, room) => sum + room.totalRevenue, 0)
  return total.toFixed(2)
})

const revPAR = computed(() => {
  if (filteredRoomSalesData.value.length === 0) return '0.00'
  const totalRevenue = filteredRoomSalesData.value.reduce((sum, room) => sum + room.totalRevenue, 0)
  const totalRoomsAvailable = filteredRoomSalesData.value.reduce((sum, room) => sum + room.totalNights, 0)
  return totalRoomsAvailable > 0 ? (totalRevenue / totalRoomsAvailable).toFixed(2) : '0.00'
})

const averageDailyRate = computed(() => {
  const activeRooms = filteredRoomSalesData.value.filter(room => room.occupancyDays > 0)
  if (activeRooms.length === 0) return '0.00'
  const totalRate = activeRooms.reduce((sum, room) => sum + room.averageRate, 0)
  return (totalRate / activeRooms.length).toFixed(2)
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating room sales statistics report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    transactionFrom: '',
    transactionTo: '',
    roomType: '',
    showInactiveRooms: false,
    sortBy: 'room',
    sortOrder: 'asc',
    reportTemplate: 'default'
  }
  showResults.value = false
}

const editTemplate = (): void => {
  console.log('Editing room sales report template...')
}
</script>

<style scoped>
/* Room Sales Statistics specific styles */
.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 1rem;
}

.revenue-highlight {
  color: #10b981;
  font-weight: 600;
}

.occupancy-rate {
  color: #3b82f6;
  font-weight: 600;
}

.inactive-room {
  background-color: #fee2e2;
  color: #991b1b;
}

.active-room {
  background-color: #dcfce7;
  color: #166534;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1 {
    gap: 1rem;
  }
  
  .flex-col > div {
    width: 100%;
  }
  
  .items-end {
    align-items: stretch;
  }
}

/* Print styles for room sales reports */
@media print {
  .no-print {
    display: none !important;
  }
  
  .room-sales-table {
    break-inside: avoid;
  }
  
  .stats-summary {
    page-break-inside: avoid;
  }
}
</style>