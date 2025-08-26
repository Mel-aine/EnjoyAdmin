<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pickup / Dropoff Guest Report
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <!-- Pick/Drop From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pick/Drop From
            </label>
            <InputDatepicker 
              v-model="filters.dateFrom" 
              placeholder="29/08/2022"
              class="w-full"
            ></InputDatepicker>
          </div>
          
          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.dateTo" 
              placeholder="31/08/2022"
              class="w-full"
            ></InputDatepicker>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <SelectComponent 
              v-model="filters.type"
              :options="typeOptions"
              placeholder="--Select--"
              class="w-full"
            ></SelectComponent>
          </div>

          <!-- Mode -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mode
            </label>
            <SelectComponent 
              v-model="filters.mode"
              :options="modeOptions"
              placeholder="--Select--"
              class="w-full"
            ></SelectComponent>
          </div>
        </div>
        
        <!-- Buttons -->
        <div class="flex items-end justify-end mt-4">
          <div class="flex gap-2">
            <ButtonComponent 
              @click="exportData"
              variant="secondary"
              class="px-6 py-2"
            >
              Export
            </ButtonComponent>
            
            <ButtonComponent 
              @click="generateReport"
              variant="primary"
              class="px-6 py-2"
            >
              Generate Report
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="px-6 py-2"
            >
              Reset
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <!-- Report Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400">CHIRAG DEMO HOTEL</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Pick Drop Date From {{ filters.dateFrom }} To {{ filters.dateTo }}
              </p>
            </div>
            <div class="text-right">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Pickup / Dropoff Guest Report
              </h3>
            </div>
          </div>
        </div>

        <!-- Pickup Section -->
        <div class="px-6 py-4">
          <div class="mb-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Pick Drop Date Time &nbsp;&nbsp;&nbsp;&nbsp; Guest Name &nbsp;&nbsp;&nbsp;&nbsp; Room No. &nbsp;&nbsp;&nbsp;&nbsp; Mode &nbsp;&nbsp;&nbsp;&nbsp; Vehicle &nbsp;&nbsp;&nbsp;&nbsp; Description
            </h3>
          </div>

          <!-- Pickup Data -->
          <div class="mb-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 mb-2">
              <h4 class="font-medium text-blue-800 dark:text-blue-200">Pickup</h4>
            </div>
            <div v-for="(item, index) in pickupData" :key="index" class="border-b border-gray-100 dark:border-gray-700 py-2">
              <div class="flex flex-wrap items-center gap-8 text-sm">
                <div class="min-w-[150px] text-gray-900 dark:text-white">
                  {{ item.dateTime }}
                </div>
                <div class="min-w-[120px] text-gray-900 dark:text-white">
                  {{ item.guestName }}
                </div>
                <div class="min-w-[80px] text-gray-900 dark:text-white">
                  {{ item.roomNo }}
                </div>
                <div class="min-w-[100px] text-gray-900 dark:text-white">
                  {{ item.mode }}
                </div>
                <div class="min-w-[80px] text-gray-900 dark:text-white">
                  {{ item.vehicle }}
                </div>
                <div class="flex-1 text-gray-900 dark:text-white">
                  {{ item.description }}
                </div>
              </div>
            </div>
            <div class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Guest #{{ pickupData.length }}
            </div>
          </div>

          <!-- Dropoff Data -->
          <div class="mb-6">
            <div class="bg-red-50 dark:bg-red-900/20 px-4 py-2 mb-2">
              <h4 class="font-medium text-red-800 dark:text-red-200">Dropoff</h4>
            </div>
            <div v-for="(item, index) in dropoffData" :key="index" class="border-b border-gray-100 dark:border-gray-700 py-2">
              <div class="flex flex-wrap items-center gap-8 text-sm">
                <div class="min-w-[150px] text-gray-900 dark:text-white">
                  {{ item.dateTime }}
                </div>
                <div class="min-w-[120px] text-gray-900 dark:text-white">
                  {{ item.guestName }}
                </div>
                <div class="min-w-[80px] text-gray-900 dark:text-white">
                  {{ item.roomNo }}
                </div>
                <div class="min-w-[100px] text-gray-900 dark:text-white">
                  {{ item.mode }}
                </div>
                <div class="min-w-[80px] text-gray-900 dark:text-white">
                  {{ item.vehicle }}
                </div>
                <div class="flex-1 text-gray-900 dark:text-white">
                  {{ item.description }}
                </div>
              </div>
            </div>
            <div class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Guest #{{ dropoffData.length }}
            </div>
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  type: string;
  mode: string;
}

interface PickupDropoffItem {
  dateTime: string;
  guestName: string;
  roomNo: string;
  mode: string;
  vehicle: string;
  description: string;
}

const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  dateFrom: '29/08/2022',
  dateTo: '31/08/2022',
  type: '',
  mode: ''
})

// Sample data for pickup
const pickupData = ref<PickupDropoffItem[]>([
  {
    dateTime: '29/08/2022 02:48:00 PM',
    guestName: 'Mr Chirag manita',
    roomNo: '202',
    mode: 'receive-drop',
    vehicle: 'Car',
    description: 'Airport'
  }
])

// Sample data for dropoff
const dropoffData = ref<PickupDropoffItem[]>([
  {
    dateTime: '30/08/2022 08:00:00 AM',
    guestName: 'Mr Chirag manita',
    roomNo: '202',
    mode: 'receive-drop',
    vehicle: 'car',
    description: 'Car at hotel'
  }
])

// Options for selects
const typeOptions = ref<FilterOptions[]>([
  { value: 'pickup', label: 'Pickup' },
  { value: 'dropoff', label: 'Dropoff' },
  { value: 'both', label: 'Both' }
])

const modeOptions = ref<FilterOptions[]>([
  { value: 'receive-drop', label: 'Receive-Drop' },
  { value: 'taxi', label: 'Taxi' },
  { value: 'car', label: 'Car' },
  { value: 'bus', label: 'Bus' }
])

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating pickup/dropoff report with filters:', filters.value)
}

const exportData = (): void => {
  console.log('Exporting pickup/dropoff data...')
}

const resetForm = (): void => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    type: '',
    mode: ''
  }
  showResults.value = false
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .flex-wrap {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .min-w-[150px], .min-w-[120px], .min-w-[80px], .min-w-[100px] {
    min-width: auto;
    width: 100%;
  }
}
</style>