<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('Room Sale Statistics Report') }}
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <!-- First Row: Date Range and Room Type -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <!-- Transaction Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('From') }}
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
              {{ t('to') }}
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
              :placeholder="'--Select--'"
              class="w-full"
            />
          </div>

          <!-- Show Inactive Rooms Checkbox -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.showInactiveRooms" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              {{ t('Show Inactive Rooms') }}
            </label>
          </div>
        </div>

        <!-- Second Row: Sort By -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('Sort By') }}
            </label>
            <SelectComponent 
              v-model="filters.sortBy"
              :options="sortByOptions"
              :placeholder="t('--select Type--')"
              class="w-full"
            />
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
              {{ t('Aasc') }}
            </label>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.sortOrder" 
                type="radio"
                value="desc"
                name="sortOrder"
                class="text-blue-600"
              />
              {{ t('Desc') }}
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
              variant="primary"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
            >
              {{ t('common.report') }}
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-sm font-medium"
            >
              {{ t('common.reset') }}
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('Room sales statistics') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ t('Period') }}: {{ filters.transactionFrom }} {{ t('to') }} {{ filters.transactionTo }}</span> • 
            <span>{{ t('sort By') }}: {{ selectedSortByLabel }}</span> • 
            <span>{{ t('RoomSales Inactive Rooms') }}: {{ filters.showInactiveRooms ? t('Included') : t('Excluded') }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            :title="t('reports.roomSales.analysis')"
            :data="roomSalesData"
            :columns="selectedTableColumns"
            :show-header=false
            class="w-full mb-4 min-w-max"
          />
        </div>

        <!-- Statistics Summary -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ t('TotalRooms') }}: {{ totalRooms }}</div>
            <div>{{ t('OccupiedRooms') }}: {{ occupiedRooms }}</div>
            <div>{{ t('occupancyRate') }}: {{ occupancyRate }}%</div>
            <div>{{ t('TotalRevenue') }}: {{ totalRevenue }}</div>
            <div>{{ t('RevPAR') }}: {{ revPAR }}</div>
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

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
const roomTypeOptions = ref<FilterOptions[]>([
  { value: 'all', label: t('All') },
  { value: 'suite', label: t('Suite') },
  { value: 'deluxe', label: t('Deluxe') },
  { value: 'standard', label: t('Standard') },
  { value: 'executive', label: t('Executive') }
])

const sortByOptions = ref<FilterOptions[]>([
  { value: 'room', label: t('Room') },
  { value: 'roomType', label: t('RoomType') },
  { value: 'occupancyRate', label: t('OccupancyRate') },
  { value: 'revenue', label: t('Revenue') },
  { value: 'revPAR', label: t('RevPAR') }
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
  { key: 'roomNo', label: t('RoomNumber') },
  { key: 'roomType', label: t('RoomType') },
  { key: 'status', label: t('Status') },
  { key: 'occupancyDays', label: t('OccupiedDays') },
  { key: 'totalNights', label: t('TotalNights') },
  { key: 'occupancyRate', label: t('OccupancyRate') + ' (%)' },
  { key: 'averageRate', label: t('Avg Daily Rate') },
  { key: 'totalRevenue', label: t('Total Revenue') },
  { key: 'revPAR', label: t('RevPAR') },
  { key: 'lastOccupied', label: t('Last Occupied') }
])

const selectedSortByLabel = computed(() => {
  const selected = sortByOptions.value.find(option => option.value === filters.value.sortBy)
  return selected ? selected.label : t('Room')
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