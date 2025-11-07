<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          House Status
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View current room status and housekeeping information
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- As On Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              As On Date
            </label>
            <InputDatepicker 
              v-model="filters.asOnDate" 
              placeholder="Select Date"
              class="w-full"
            />
          </div>

          <!-- Room Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <SelectComponent 
              v-model="filters.roomType"
              :options="roomTypeOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>

          <!-- House Keeper -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              House Keeper
            </label>
            <SelectComponent 
              v-model="filters.houseKeeper"
              :options="houseKeeperOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>

          <!-- Show Only Active Rooms -->
          <div class="flex items-end">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input 
                v-model="filters.showOnlyActiveRooms" 
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              Show Only Active Rooms
            </label>
          </div>
        </div>

        <!-- Status Section -->
        <div class="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
          <div class="grid grid-cols-1 gap-4">
            <!-- Status Row -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Status
              </label>
              <div class="flex gap-6 flex-wrap">
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.status.dirty" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Dirty
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.status.fresh" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Fresh
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.status.maintenance" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Maintenance
                </label>
              </div>
            </div>

            <!-- Room Status Row -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Room Status
              </label>
              <div class="flex gap-4 flex-wrap">
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.arrival" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Arrival
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.checkedOut" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Checked Out
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.dueOut" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Due Out
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.confirmedReservation" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Confirmed Reservation
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.maintenanceBlock" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Maintenance Block
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.stayover" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Stayover
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.dayuse" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  Dayuse
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    v-model="filters.roomStatus.toBeCheckedOut" 
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  To Be Checked Out
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <!-- Bouton Report -->
            <div class="relative w-full sm:w-auto">
              <button
                @click="generateReport"
                :disabled="loading"
                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24 w-full sm:w-auto"
              >
                <span v-if="!loading">{{ t('common.report') }}</span>
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="loading" class="ml-2">{{ t('common.generating') }}</span>
              </button>
            </div>
            
            <!-- Bouton Reset -->
            <div class="relative w-full sm:w-auto">
              <button
                @click="resetForm"
                class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24 w-full sm:w-auto"
              >
                {{ t('common.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hotel Nihal
            </h2>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              House Status
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2 flex flex-wrap gap-4">
            <span>As on Date: {{ filters.asOnDate || '27/04/2019' }}</span>
            <span>Room Type: All</span>
            <span>House Keeper: All</span>
            <span>Status: {{ getSelectedStatusText() }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <ResultTable 
            title="House Status"
            :data="formattedHouseStatusData"
            :columns="houseStatusColumns"
            class="w-full mb-4 min-w-max"
          />
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

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface HouseStatusData {
  unitRoom: string;
  roomType: string;
  guest?: string;
  pax?: string;
  status: string;
  availability: string;
  houseKeeper: string;
  checkInDate?: string;
  checkOutDate?: string;
  hkRemarks?: string;
}

interface Filters {
  asOnDate: string;
  roomType: string;
  houseKeeper: string;
  showOnlyActiveRooms: boolean;
  status: {
    dirty: boolean;
    fresh: boolean;
    maintenance: boolean;
  };
  roomStatus: {
    arrival: boolean;
    checkedOut: boolean;
    dueOut: boolean;
    confirmedReservation: boolean;
    maintenanceBlock: boolean;
    stayover: boolean;
    dayuse: boolean;
    toBeCheckedOut: boolean;
  };
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)
const loading = ref<boolean>(false)

const filters = ref<Filters>({
  asOnDate: '27/04/2019',
  roomType: '',
  houseKeeper: '',
  showOnlyActiveRooms: true,
  status: {
    dirty: true,
    fresh: true,
    maintenance: true
  },
  roomStatus: {
    arrival: true,
    checkedOut: true,
    dueOut: true,
    confirmedReservation: true,
    maintenanceBlock: true,
    stayover: true,
    dayuse: true,
    toBeCheckedOut: true
  }
})

// Options for selects
const roomTypeOptions = ref<FilterOptions[]>([
  { value: '', label: '--Select--' },
  { value: 'suite', label: 'Suite Room' },
  { value: 'deluxe', label: 'Deluxe Room' },
  { value: 'standard', label: 'Standard Room' }
])

const houseKeeperOptions = ref<FilterOptions[]>([
  { value: '', label: '--Select--' },
  { value: 'bijou', label: 'Bijou' },
  { value: 'staff1', label: 'Staff 1' },
  { value: 'staff2', label: 'Staff 2' }
])

// Sample data based on the image
const houseStatusData = ref<HouseStatusData[]>([
  {
    unitRoom: '001',
    roomType: 'Suite Room',
    guest: 'Mr Bienvenu',
    pax: '1/1',
    status: 'Dirty',
    availability: 'In-House',
    houseKeeper: 'Bijou',
    checkInDate: '27/04/2019',
    checkOutDate: '28/04/2019',
    hkRemarks: 'clear the room fast as the guest are early check-In'
  },
  {
    unitRoom: '002',
    roomType: 'Deluxe Room',
    guest: '',
    pax: '',
    status: 'Dirty',
    availability: 'Available',
    houseKeeper: 'Bijou',
    checkInDate: '',
    checkOutDate: '',
    hkRemarks: 'clear the room fast as the guest are early check-In'
  }
])

// Colonnes pour le composant ResultTable
const houseStatusColumns = computed(() => [
  { key: 'unitRoom', label: 'Unit/Room' },
  { key: 'roomType', label: 'Room Type' },
  { key: 'guest', label: 'Guest' },
  { key: 'pax', label: 'Pax (A/C)' },
  { key: 'status', label: 'Status' },
  { key: 'availability', label: 'Availability' },
  { key: 'houseKeeper', label: 'House Keeper' },
  { key: 'checkInDate', label: 'Check-In Date' },
  { key: 'checkOutDate', label: 'Check-Out Date' },
  { key: 'hkRemarks', label: 'HK Remarks' }
])

// Données formatées pour le tableau
const formattedHouseStatusData = computed(() => {
  return houseStatusData.value.map(room => ({
    unitRoom: room.unitRoom,
    roomType: room.roomType,
    guest: room.guest || '',
    pax: room.pax || '',
    status: room.status,
    availability: room.availability,
    houseKeeper: room.houseKeeper,
    checkInDate: room.checkInDate || '',
    checkOutDate: room.checkOutDate || '',
    hkRemarks: room.hkRemarks || ''
  }))
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating house status report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    asOnDate: '',
    roomType: '',
    houseKeeper: '',
    showOnlyActiveRooms: false,
    status: {
      dirty: false,
      fresh: false,
      maintenance: false
    },
    roomStatus: {
      arrival: false,
      checkedOut: false,
      dueOut: false,
      confirmedReservation: false,
      maintenanceBlock: false,
      stayover: false,
      dayuse: false,
      toBeCheckedOut: false
    }
  }
  showResults.value = false
}

const getSelectedStatusText = (): string => {
  const selectedStatuses = []
  if (filters.value.status.dirty) selectedStatuses.push('Dirty')
  if (filters.value.status.fresh) selectedStatuses.push('Fresh')
  if (filters.value.status.maintenance) selectedStatuses.push('Maintenance')
  return selectedStatuses.length > 0 ? selectedStatuses.join(', ') : 'None'
}

const getStatusClass = (status: string): string => {
  // Retourne une classe neutre pour tous les statuts
  return 'text-gray-600 dark:text-gray-300'
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-col > div {
    width: 100%;
  }
  
  .flex-col > div + div {
    margin-top: 1rem;
  }
  
  .items-end {
    align-items: stretch;
  }
  
  .gap-6 {
    gap: 1rem;
  }
  
  .gap-4 {
    gap: 0.75rem;
  }
}

/* Table responsive */
@media (max-width: 768px) {
  .overflow-x-auto table {
    min-width: 800px;
  }
}
</style>