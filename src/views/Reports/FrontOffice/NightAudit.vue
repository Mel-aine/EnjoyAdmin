<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.nightAudit') }}
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <InputDatepicker 
              v-model="filters.arrivalFrom" 
              :placeholder="t('common.from')"
              class="w-full"
            ></InputDatepicker>
          </div>
          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <SelectComponent 
              v-model="filters.currency"
              :options="currencyOptions"
              :placeholder="'Rs'"
              class="w-full"
            ></SelectComponent>
          </div>
        </div>
                  <!-- Buttons -->
          <div class="flex items-end justify-end">
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
                Report
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
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
        <!-- Report Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <span>As On Date: {{ filters.arrivalFrom }} Currency: {{ filters.currency }}</span>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              Night Audit
            </div>
          </div>
        </div>

        <!-- Room Charges Section -->
        <div class="px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Charges</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th v-for="header in roomChargesHeaders" :key="header.key" 
                      :class="['px-6 py-3 text-xs font-medium uppercase tracking-wider', 
                              header.align === 'right' ? 'text-right' : 'text-left',
                              'text-gray-500 dark:text-gray-300']">
                    {{ header.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                <tr v-for="(item, index) in roomChargesData" :key="index" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.room }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.folioNo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.guest }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ item.source }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ item.company }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.rentDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.rateType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.normalTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.offeredTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.totalTax }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-white">
                    {{ item.totalRent }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.variation }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.checkinBy }}
                  </td>
                </tr>
                <!-- Total Row -->
                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold border-t-2 border-gray-300 dark:border-gray-500">
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white" colspan="7">
                    Total ({{ filters.currency }})
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ roomChargesTotal.normalTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ roomChargesTotal.offeredTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ roomChargesTotal.totalTax }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 dark:text-white">
                    {{ roomChargesTotal.totalRent }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ roomChargesTotal.variation }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    Total : {{ roomChargesData.length }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Complimentary Section -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Complimentary</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th v-for="header in roomChargesHeaders" :key="header.key" 
                      :class="['px-6 py-3 text-xs font-medium uppercase tracking-wider', 
                              header.align === 'right' ? 'text-right' : 'text-left',
                              'text-gray-500 dark:text-gray-300']">
                    {{ header.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                <tr v-for="(item, index) in complimentaryData" :key="index" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.room }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.folioNo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.guest }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ item.source }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ item.company }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.rentDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.rateType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.normalTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.offeredTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.totalTax }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-white">
                    {{ item.totalRent }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.variation }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.checkinBy }}
                  </td>
                </tr>
                <!-- Total Row -->
                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold border-t-2 border-gray-300 dark:border-gray-500">
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white" colspan="7">
                    Total ({{ filters.currency }})
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ complimentaryTotal.normalTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ complimentaryTotal.offeredTariff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ complimentaryTotal.totalTax }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 dark:text-white">
                    {{ complimentaryTotal.totalRent }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ complimentaryTotal.variation }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    Total : {{ complimentaryData.length }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Daily Sales Summary -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Sales</div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th v-for="header in dailySalesHeaders" :key="header.key" 
                      :class="['px-6 py-3 text-xs font-medium uppercase tracking-wider', 
                              header.align === 'right' ? 'text-right' : 'text-left',
                              'text-gray-500 dark:text-gray-300']">
                    {{ header.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800">
                <tr v-for="(item, index) in dailySalesData" :key="index" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.salesType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.roomCharges }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.extraCharges }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.roomTax }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.extraTax }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.discount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {{ item.adjustment }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-blue-600 dark:text-blue-400">
                    {{ item.totalSales }}
                  </td>
                </tr>
              </tbody>
            </table>
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
  arrivalFrom: string;
  currency: string;
}

interface TableHeader {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

interface RoomChargeItem {
  room: string;
  folioNo: string;
  guest: string;
  source: string;
  company: string;
  rentDate: string;
  rateType: string;
  normalTariff: string;
  offeredTariff: string;
  totalTax: string;
  totalRent: string;
  variation: string;
  checkinBy: string;
}

interface DailySalesItem {
  salesType: string;
  roomCharges: string;
  extraCharges: string;
  roomTax: string;
  extraTax: string;
  discount: string;
  adjustment: string;
  totalSales: string;
}

const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  arrivalFrom: '27/04/2019',
  currency: 'Rs'
})

// Headers for tables
const roomChargesHeaders = ref<TableHeader[]>([
  { key: 'room', label: 'Room', align: 'left' },
  { key: 'folioNo', label: 'Folio No.', align: 'left' },
  { key: 'guest', label: 'Guest', align: 'left' },
  { key: 'source', label: 'Source', align: 'left' },
  { key: 'company', label: 'Company', align: 'left' },
  { key: 'rentDate', label: 'Rent Date', align: 'left' },
  { key: 'rateType', label: 'Rate Type', align: 'left' },
  { key: 'normalTariff', label: 'Ntml. Tariff ', align: 'right' },
  { key: 'offeredTariff', label: 'Ofrd.Tariff ', align: 'right' },
  { key: 'totalTax', label: 'Total Tax ', align: 'right' },
  { key: 'totalRent', label: 'Total Rent ', align: 'right' },
  { key: 'variation', label: 'Var %', align: 'right' },
  { key: 'checkinBy', label: 'Checkin By', align: 'left' }
])

const dailySalesHeaders = ref<TableHeader[]>([
  { key: 'salesType', label: 'Sales Type', align: 'left' },
  { key: 'roomCharges', label: 'Room Charges ', align: 'right' },
  { key: 'extraCharges', label: 'Extra Charges ', align: 'right' },
  { key: 'roomTax', label: 'Room Tax ', align: 'right' },
  { key: 'extraTax', label: 'Extra Tax ', align: 'right' },
  { key: 'discount', label: 'Discount ', align: 'right' },
  { key: 'adjustment', label: 'Adjustment ', align: 'right' },
  { key: 'totalSales', label: 'Total Sales ', align: 'right' }
])

// Data for tables
const roomChargesData = ref<RoomChargeItem[]>([
  {
    room: '102 - SR',
    folioNo: 'FNH565',
    guest: 'Daman',
    source: '-',
    company: '-',
    rentDate: '27/04/2019',
    rateType: 'European Plan 01',
    normalTariff: '490.45',
    offeredTariff: '490.45',
    totalTax: '49.05',
    totalRent: '539.50',
    variation: '0.00',
    checkinBy: 'helpdesksupport'
  },
  {
    room: '201 - DR',
    folioNo: 'FNH569',
    guest: 'Group Test test 2',
    source: '-',
    company: 'COMPANY TEST',
    rentDate: '27/04/2019',
    rateType: 'European Plan 01',
    normalTariff: '90.91',
    offeredTariff: '363.64',
    totalTax: '36.36',
    totalRent: '400.00',
    variation: '300.00',
    checkinBy: 'helpdesksupport'
  },
  {
    room: '202 - DR',
    folioNo: 'FNH550',
    guest: 'Group Test test 2',
    source: '-',
    company: 'COMPANY TEST',
    rentDate: '27/04/2019',
    rateType: 'European Plan 01',
    normalTariff: '90.91',
    offeredTariff: '90.91',
    totalTax: '9.09',
    totalRent: '100.00',
    variation: '0.00',
    checkinBy: 'helpdesksupport'
  },
  {
    room: '203 - DR',
    folioNo: 'FNH591',
    guest: 'Group Test test 2',
    source: '-',
    company: 'COMPANY TEST',
    rentDate: '27/04/2019',
    rateType: 'European Plan 01',
    normalTariff: '90.91',
    offeredTariff: '181.82',
    totalTax: '18.18',
    totalRent: '200.00',
    variation: '100.00',
    checkinBy: 'helpdesksupport'
  },
  {
    room: '204 - DR',
    folioNo: 'FNH592',
    guest: 'Group Test test 2',
    source: '-',
    company: 'COMPANY TEST',
    rentDate: '27/04/2019',
    rateType: 'European Plan 01',
    normalTariff: '100.00',
    offeredTariff: '363.64',
    totalTax: '36.36',
    totalRent: '400.00',
    variation: '263.64',
    checkinBy: 'helpdesksupport'
  },
  {
    room: '207 - DR',
    folioNo: 'FNH596',
    guest: 'test 00001',
    source: '-',
    company: 'COMPANY TEST',
    rentDate: '27/04/2019',
    rateType: 'European Plan 01',
    normalTariff: '90.91',
    offeredTariff: '90.91',
    totalTax: '9.09',
    totalRent: '100.00',
    variation: '0.00',
    checkinBy: 'helpdesksupport'
  }
])

const complimentaryData = ref<RoomChargeItem[]>([
  {
    room: '001 - SR',
    folioNo: 'FNH599',
    guest: 'sravenvnar',
    source: '-',
    company: '-',
    rentDate: '27/04/2019',
    rateType: 'Breakfast',
    normalTariff: '0.00',
    offeredTariff: '0.00',
    totalTax: '0.00',
    totalRent: '0.00',
    variation: '0.00',
    checkinBy: 'helpdesksupport'
  }
])

const dailySalesData = ref<DailySalesItem[]>([
  {
    salesType: 'Room Sales',
    roomCharges: '1,581.37',
    extraCharges: '0.00',
    roomTax: '158.13',
    extraTax: '0.00',
    discount: '0.00',
    adjustment: '0.00',
    totalSales: '1,739.50'
  }
])

// Computed properties for totals
const roomChargesTotal = computed(() => {
  return {
    normalTariff: roomChargesData.value.reduce((sum, item) => sum + parseFloat(item.normalTariff), 0).toFixed(2),
    offeredTariff: roomChargesData.value.reduce((sum, item) => sum + parseFloat(item.offeredTariff), 0).toFixed(2),
    totalTax: roomChargesData.value.reduce((sum, item) => sum + parseFloat(item.totalTax), 0).toFixed(2),
    totalRent: roomChargesData.value.reduce((sum, item) => sum + parseFloat(item.totalRent), 0).toFixed(2),
    variation: roomChargesData.value.reduce((sum, item) => sum + parseFloat(item.variation), 0).toFixed(2)
  }
})

const complimentaryTotal = computed(() => {
  return {
    normalTariff: complimentaryData.value.reduce((sum, item) => sum + parseFloat(item.normalTariff), 0).toFixed(2),
    offeredTariff: complimentaryData.value.reduce((sum, item) => sum + parseFloat(item.offeredTariff), 0).toFixed(2),
    totalTax: complimentaryData.value.reduce((sum, item) => sum + parseFloat(item.totalTax), 0).toFixed(2),
    totalRent: complimentaryData.value.reduce((sum, item) => sum + parseFloat(item.totalRent), 0).toFixed(2),
    variation: complimentaryData.value.reduce((sum, item) => sum + parseFloat(item.variation), 0).toFixed(2)
  }
})

// Options for selects
const currencyOptions = ref<FilterOptions[]>([
  { value: 'Rs', label: 'Rs' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
])

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating report with filters:', filters.value)
}

const exportData = (): void => {
  console.log('Exporting data...')
}

const resetForm = (): void => {
  filters.value = {
    arrivalFrom: '',
    currency: 'Rs'
  }
  showResults.value = false
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
}
</style>