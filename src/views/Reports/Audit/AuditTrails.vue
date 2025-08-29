<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Audit Trails
        </h1>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <InputDatepicker 
              v-model="filters.from" 
              placeholder="2020-05-11"
              class="w-full"
            />
          </div>

          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker 
              v-model="filters.to" 
              placeholder="2020-05-11"
              class="w-full"
            />
          </div>

          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User
            </label>
            <SelectComponent 
              v-model="filters.user"
              :options="userOptions"
              placeholder="--Select--"
              class="w-full"
            />
          </div>

          <!-- Operation -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Operation
            </label>
            <SelectComponent 
              v-model="filters.operation"
              :options="operationOptions"
              placeholder="Roomrate Change"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <ButtonComponent 
            @click="exportData"
            variant="secondary"
            class="min-w-24 bg-gray-600 text-white"
          >
            Export
          </ButtonComponent>
          
          <ButtonComponent 
            @click="generateReport"
            variant="primary"
            class="min-w-24"
          >
            Report
          </ButtonComponent>
          
          <ButtonComponent 
            @click="resetForm"
            variant="outline"
            class="min-w-24"
          >
            Reset
          </ButtonComponent>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ hotelName }}
              </h2>
              <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mt-2">
                Audit Trails
              </h3>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <div><strong>Date From:</strong> {{ filters.from }}</div>
                <div><strong>To:</strong> {{ filters.to }}</div>
                <div><strong>Operation:</strong> {{ filters.operation || 'Roomrate Change' }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">Res. No</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">Folio No</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">Guest</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">User</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">Time</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr class="bg-gray-100 dark:bg-gray-700">
                <td colspan="6" class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white border">
                  Operation : {{ filters.operation || 'Roomrate Change' }}
                </td>
              </tr>
              <tr v-for="item in auditTrailsData" :key="item.resNo" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.resNo }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.folioNo }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.guest }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.user }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.date }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white border">{{ item.time }}</td>
              </tr>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <td colspan="6" class="px-4 py-3 text-sm text-gray-900 dark:text-white border">
                  <div class="space-y-1">
                    <div v-for="item in auditTrailsData" :key="'particulars-' + item.resNo">
                      <strong>Particular :</strong> {{ item.particulars }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

interface FilterOptions {
  value: string;
  label: string;
}

interface AuditTrailData {
  resNo: string;
  folioNo: string;
  guest: string;
  user: string;
  date: string;
  time: string;
  particulars: string;
}

interface Filters {
  from: string;
  to: string;
  user: string;
  operation: string;
}

const hotelName = ref<string>('Karma')
const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  from: '2020-05-11',
  to: '2020-05-11',
  user: '',
  operation: 'Roomrate Change'
})

// Options for selects
const userOptions = ref<FilterOptions[]>([
  { value: 'helpdesksupport', label: 'helpdesksupport' },
  { value: 'manager', label: 'Manager' },
  { value: 'front_desk', label: 'Front Desk' },
  { value: 'admin', label: 'Admin' }
])

const operationOptions = ref<FilterOptions[]>([
  { value: 'Roomrate Change', label: 'Roomrate Change' },
  { value: 'Check In', label: 'Check In' },
  { value: 'Check Out', label: 'Check Out' },
  { value: 'Room Assignment', label: 'Room Assignment' },
  { value: 'Payment', label: 'Payment' }
])

// Sample audit trail data exactly as shown in the image
const auditTrailsData = ref<AuditTrailData[]>([
  {
    resNo: '',
    folioNo: 'Folio313',
    guest: 'Mr Roy',
    user: 'helpdesksupport',
    date: '2020-05-11',
    time: '03:13:29 PM',
    particulars: 'Old Rate : 5000.00 New Rate : 5500 , Apply To : Whole Stay , Rate Inclusive Tax : No'
  }
])

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating audit trails report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    from: '',
    to: '',
    user: '',
    operation: ''
  }
  showResults.value = false
}

const exportData = (): void => {
  console.log('Exporting audit trails data...')
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

.border {
  border: 1px solid #d1d5db;
}

.dark .border {
  border-color: #4b5563;
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>