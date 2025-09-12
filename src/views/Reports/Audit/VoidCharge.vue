<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Void Charge
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage voided charges
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Void From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Void From
            </label>
            <InputDatepicker 
              v-model="filters.voidFrom" 
              placeholder="From"
              class="w-full"
            />
          </div>

          <!-- Void To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.voidTo" 
              placeholder="To"
              class="w-full"
            />
          </div>

          <!-- Void By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Void By
            </label>
            <SelectComponent 
              v-model="filters.voidBy"
              :options="voidByOptions"
              placeholder="Select..."
              class="w-full"
            />
          </div>

          <!-- Charge -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Charge
            </label>
            <SelectComponent 
              v-model="filters.charge"
              :options="chargeOptions"
              placeholder="Select..."
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Report Template -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Template
            </label>
            <div class="flex items-center gap-2">
              <SelectComponent 
                v-model="filters.reportTemplate"
                :options="reportTemplateOptions"
                placeholder="Default"
                class="flex-1"
              />
              <button 
                @click="editTemplate"
                class="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Edit Template"
              >
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 items-end">
            <ButtonComponent 
              @click="generateReport"
              variant="primary"
              class="min-w-20"
            >
              Report
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="min-w-20"
            >
              Reset
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Report -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
              Void Charge
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>Date From:</strong> {{ filters.voidFrom }} <strong>To:</strong> {{ filters.voidTo }}</span>
          </div>
        </div>
        
        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable 
            title="Void Charge Details"
            :data="voidChargeData"
            :columns="voidChargeColumns"
            class="w-full mb-4 min-w-max"
          />
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import SelectComponent from '@/components/forms/FormElements/Select.vue'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

interface FilterOptions {
  value: string;
  label: string;
}

interface VoidChargeItem {
  date: string;
  voucher: string;
  charge: string;
  reference: string;
  amount: string;
  voidByDateTime: string;
}

interface Filters {
  voidFrom: string;
  voidTo: string;
  voidBy: string;
  charge: string;
  reportTemplate: string;
}

const hotelName = ref<string>('Hotel Nihal')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  voidFrom: '10/04/2020',
  voidTo: '10/04/2020',
  voidBy: '',
  charge: '',
  reportTemplate: 'Default'
})

// Options for selects
const voidByOptions = ref<FilterOptions[]>([
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' }
])

const chargeOptions = ref<FilterOptions[]>([
  { value: 'room_charge', label: 'Room Charge' },
  { value: 'extra_charge', label: 'Extra Charge' },
  { value: 'service_charge', label: 'Service Charge' },
  { value: 'tax', label: 'Tax' }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'Default', label: 'Default' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'summary', label: 'Summary' }
])

// Sample void charge data based on the image
const voidChargeDataRaw = ref<VoidChargeItem[]>([
  {
    date: '2019 06 24 00:00:00',
    voucher: '247530A',
    charge: 'Front Desk Falls PHIG38 Room 201',
    reference: '999999999999999',
    amount: '9.20',
    voidByDateTime: 'hellphilippement On 19/04/2020 19:26:39 AM'
  }
])

// Computed properties for ResultTable
const voidChargeColumns = computed(() => [
  { key: 'date', label: 'Date' },
  { key: 'voucher', label: 'Voucher' },
  { key: 'charge', label: 'Charge' },
  { key: 'reference', label: 'Reference' },
  { key: 'amount', label: 'Amount ' },
  { key: 'voidByDateTime', label: 'Void By/Date/Time' }
])

const voidChargeData = computed(() => {
  return voidChargeDataRaw.value.map(item => ({
    date: item.date,
    voucher: item.voucher,
    charge: item.charge,
    reference: item.reference,
    amount: item.amount,
    voidByDateTime: item.voidByDateTime
  }))
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating void charge report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    voidFrom: '',
    voidTo: '',
    voidBy: '',
    charge: '',
    reportTemplate: 'Default'
  }
  showResults.value = false
}

const editTemplate = (): void => {
  console.log('Editing template...')
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>