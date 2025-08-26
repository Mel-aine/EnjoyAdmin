<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.frontOffice.guestCheckedIn') }}
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
            />
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
            />
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
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Report Header -->
        <div class="px-6 py-3 bg-blue-600 text-white">
          <div class="text-sm">
            As On Date: {{ filters.arrivalFrom }} Currency: {{ filters.currency }}
          </div>
        </div>

        <!-- Room Charges Section -->
        <div class="px-6 py-4">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Room Charges</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Room</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Folio No.</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Guest</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Source</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Company</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Rent Date</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Rate Type</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Ntml. Tariff (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Offd. Tariff (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Total Tax (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Total Rent (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Var %</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Checkin By</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-xs">
                  <td class="border border-gray-300 p-2">201 - GR</td>
                  <td class="border border-gray-300 p-2">FN1948</td>
                  <td class="border border-gray-300 p-2">Group Test test 2</td>
                  <td class="border border-gray-300 p-2"></td>
                  <td class="border border-gray-300 p-2">COMPANY TEST</td>
                  <td class="border border-gray-300 p-2">27/04/2019</td>
                  <td class="border border-gray-300 p-2">European Plan 01</td>
                  <td class="border border-gray-300 p-2 text-right">90.91</td>
                  <td class="border border-gray-300 p-2 text-right">363.64</td>
                  <td class="border border-gray-300 p-2 text-right">36.36</td>
                  <td class="border border-gray-300 p-2 text-right">400.00</td>
                  <td class="border border-gray-300 p-2 text-right">300.00</td>
                  <td class="border border-gray-300 p-2">helpdesksupport</td>
                </tr>
                <tr class="text-xs">
                  <td class="border border-gray-300 p-2">202 - GR</td>
                  <td class="border border-gray-300 p-2">FN2098</td>
                  <td class="border border-gray-300 p-2">Group Test test 2</td>
                  <td class="border border-gray-300 p-2"></td>
                  <td class="border border-gray-300 p-2">COMPANY TEST</td>
                  <td class="border border-gray-300 p-2">27/04/2019</td>
                  <td class="border border-gray-300 p-2">European Plan 01</td>
                  <td class="border border-gray-300 p-2 text-right">90.91</td>
                  <td class="border border-gray-300 p-2 text-right">90.91</td>
                  <td class="border border-gray-300 p-2 text-right">9.09</td>
                  <td class="border border-gray-300 p-2 text-right">100.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2">helpdesksupport</td>
                </tr>
                <tr class="text-xs">
                  <td class="border border-gray-300 p-2">203 - GR</td>
                  <td class="border border-gray-300 p-2">FN2599</td>
                  <td class="border border-gray-300 p-2">Group Test test 2</td>
                  <td class="border border-gray-300 p-2"></td>
                  <td class="border border-gray-300 p-2">COMPANY TEST</td>
                  <td class="border border-gray-300 p-2">27/04/2019</td>
                  <td class="border border-gray-300 p-2">European Plan 01</td>
                  <td class="border border-gray-300 p-2 text-right">90.91</td>
                  <td class="border border-gray-300 p-2 text-right">181.82</td>
                  <td class="border border-gray-300 p-2 text-right">18.18</td>
                  <td class="border border-gray-300 p-2 text-right">200.00</td>
                  <td class="border border-gray-300 p-2 text-right">100.00</td>
                  <td class="border border-gray-300 p-2">helpdesksupport</td>
                </tr>
                <tr class="text-xs">
                  <td class="border border-gray-300 p-2">304 - GR</td>
                  <td class="border border-gray-300 p-2">FN1692</td>
                  <td class="border border-gray-300 p-2">Group Test test 2</td>
                  <td class="border border-gray-300 p-2"></td>
                  <td class="border border-gray-300 p-2">COMPANY TEST</td>
                  <td class="border border-gray-300 p-2">27/04/2019</td>
                  <td class="border border-gray-300 p-2">European Plan 01</td>
                  <td class="border border-gray-300 p-2 text-right">100.00</td>
                  <td class="border border-gray-300 p-2 text-right">363.64</td>
                  <td class="border border-gray-300 p-2 text-right">36.36</td>
                  <td class="border border-gray-300 p-2 text-right">400.00</td>
                  <td class="border border-gray-300 p-2 text-right">263.64</td>
                  <td class="border border-gray-300 p-2">helpdesksupport</td>
                </tr>
                <tr class="text-xs">
                  <td class="border border-gray-300 p-2">207 - GR</td>
                  <td class="border border-gray-300 p-2">FN1848</td>
                  <td class="border border-gray-300 p-2">test 00001</td>
                  <td class="border border-gray-300 p-2"></td>
                  <td class="border border-gray-300 p-2">COMPANY TEST</td>
                  <td class="border border-gray-300 p-2">27/04/2019</td>
                  <td class="border border-gray-300 p-2">European Plan 01</td>
                  <td class="border border-gray-300 p-2 text-right">90.91</td>
                  <td class="border border-gray-300 p-2 text-right">90.91</td>
                  <td class="border border-gray-300 p-2 text-right">9.09</td>
                  <td class="border border-gray-300 p-2 text-right">100.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2">helpdesksupport</td>
                </tr>
                <tr class="text-xs font-semibold bg-gray-50">
                  <td class="border border-gray-300 p-2" colspan="7">Total (Rs)</td>
                  <td class="border border-gray-300 p-2 text-right">463.64</td>
                  <td class="border border-gray-300 p-2 text-right">1,090.92</td>
                  <td class="border border-gray-300 p-2 text-right">109.08</td>
                  <td class="border border-gray-300 p-2 text-right">1,200.00</td>
                  <td class="border border-gray-300 p-2 text-right">663.64</td>
                  <td class="border border-gray-300 p-2 text-right">Total: 5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Complimentary Section -->
        <div class="px-6 py-4 border-t">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Complimentary</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Room</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Folio No.</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Guest</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Source</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Company</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Rent Date</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Rate Type</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Ntml. Tariff (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Offd. Tariff (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Total Tax (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Total Rent (Rs)</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Var %</th>
                  <th class="border border-gray-300 text-left p-2 font-medium text-xs">Checkin By</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-xs">
                  <td class="border border-gray-300 p-2">801 - SR</td>
                  <td class="border border-gray-300 p-2">FN2519</td>
                  <td class="border border-gray-300 p-2">compliment</td>
                  <td class="border border-gray-300 p-2"></td>
                  <td class="border border-gray-300 p-2"></td>
                  <td class="border border-gray-300 p-2">27/04/2019</td>
                  <td class="border border-gray-300 p-2">Breakfast</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2">helpdesksupport</td>
                </tr>
                <tr class="text-xs font-semibold bg-gray-50">
                  <td class="border border-gray-300 p-2" colspan="7">Total (Rs)</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">0.00</td>
                  <td class="border border-gray-300 p-2 text-right">Total: 1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Daily Sales Summary -->
        <div class="px-6 py-4 border-t bg-blue-500 text-white">
          <div class="text-center font-semibold mb-2">below is the all details</div>
          
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-white">
              <thead>
                <tr>
                  <th class="border border-white text-left p-2 text-xs">Sales Type</th>
                  <th class="border border-white text-right p-2 text-xs">Room Charges (Rs)</th>
                  <th class="border border-white text-right p-2 text-xs">Extra Charges (Rs)</th>
                  <th class="border border-white text-right p-2 text-xs">Room Tax (Rs)</th>
                  <th class="border border-white text-right p-2 text-xs">Extra Tax (Rs)</th>
                  <th class="border border-white text-right p-2 text-xs">Discount (Rs)</th>
                  <th class="border border-white text-right p-2 text-xs">Adjustment (Rs)</th>
                  <th class="border border-white text-right p-2 text-xs">Total Sales (Rs)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-white p-2 text-xs">Room Sales</td>
                  <td class="border border-white p-2 text-right text-xs">1,081.37</td>
                  <td class="border border-white p-2 text-right text-xs">0.00</td>
                  <td class="border border-white p-2 text-right text-xs">108.13</td>
                  <td class="border border-white p-2 text-right text-xs">0.00</td>
                  <td class="border border-white p-2 text-right text-xs">0.00</td>
                  <td class="border border-white p-2 text-right text-xs">0.00</td>
                  <td class="border border-white p-2 text-right text-xs">1,189.50</td>
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

const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  arrivalFrom: '27/04/2019',
  currency: 'Rs'
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

/* Table styling to match the ReusableTable component */
table {
  border-collapse: collapse;
}

th, td {
  border: 1px solid #d1d5db;
  padding: 8px;
  font-size: 12px;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
}

.bg-gray-50 th {
  background-color: #f9fafb;
}
</style>