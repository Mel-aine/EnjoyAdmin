<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Audit Trails
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
             View and manage Audit Trails
        </p>  
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <InputDatepicker v-model="filters.from" placeholder="2020-05-11" class="w-full" />
          </div>

          <!-- To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <InputDatepicker v-model="filters.to" placeholder="2020-05-11" class="w-full" />
          </div>

          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User
            </label>
            <SelectComponent v-model="filters.user" :options="userOptions" placeholder="--Select--" class="w-full" />
          </div>

          <!-- Operation -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Operation
            </label>
            <SelectComponent v-model="filters.operation" :options="operationOptions" placeholder="Roomrate Change"
              class="w-full" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <!--     <ButtonComponent 
            @click="exportData"
            variant="secondary"
            class="min-w-24 bg-gray-600 text-white"
          >
            Export
          </ButtonComponent>
          -->
          <ButtonComponent @click="generateReport" variant="" class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24">
           <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span >Report</span>
          </ButtonComponent>

          <ButtonComponent @click="resetForm" variant="outline"  class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </ButtonComponent>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ hotelName }}
            </h2>
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mt-2">
              Audit Trails
            </h3>

          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <div><strong>Date From:</strong> {{ filters.from }}</div>
            <div><strong>To:</strong> {{ filters.to }}</div>
            <div><strong>Operation:</strong> {{ $t(filters.operation) }}</div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  Res. No</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  Folio No</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  Guest</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  User</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  Date</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border">
                  Time</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr class="bg-gray-100 dark:bg-gray-700">
                <td colspan="6" class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white border">
                  Operation : {{ $t(filters.operation) }}
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
import { useServiceStore } from '../../../composables/serviceStore'
import { getEmployeesForService } from '../../../services/userApi'
import Spinner from '../../../components/spinner/Spinner.vue'
import { getAuditReport } from '../../../services/reportsApi'

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
const serviceStore: any = useServiceStore()

interface Filters {
  from: string;
  to: string;
  user: string;
  operation: string;
}

const showResults = ref<boolean>(false)
const today = new Date().toISOString().split('T')[0]
const hotelName = computed(() => {
  return useServiceStore().getCurrentService?.hotelName
})
const filters = ref<Filters>({
  from: today,
  to: today,
  user: '',
  operation: 'roomrate_change'
})

// Options for selects
const userOptions = ref<FilterOptions[]>([
  { value: '', label: 'All' },
])

const operationOptions = ref<FilterOptions[]>([
  { value: '', label: 'All' },
  { value: 'roomrate_change', label: 'Roomrate Change' },
  { value: 'check_in', label: 'Check In' },
  { value: 'check_out', label: 'Check Out' },
  { value: 'room_assignment', label: 'Room Assignment' },
  { value: 'payment', label: 'Payment' }
])

// Sample audit trail data exactly as shown in the image
const auditTrailsData = ref<AuditTrailData[]>([
])
const isLoading = ref(false);
// Methods
const generateReport = async() => {
  isLoading.value = true
  console.log('Generating void charge report with filters:', filters.value)
  const data = {
    from: filters.value.from,
    to: filters.value.to,
    user: filters.value.user,
    operation:filters.value.operation,
    hotelId: serviceStore.serviceId
  }
  const response = await getAuditReport(data);
  console.log('response', response)
 // voidChargeDataRaw.value = response?.data?.voidCharges || [];
  //totalRecords.value = response?.data?.totalRecords || 0;
  //totalAmount.value = response?.data?.totalAmount || 0;
  showResults.value = true
  isLoading.value = false
  
}
const fetchUser = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) throw new Error('hotelId is not defined')
    const response = await getEmployeesForService(hotelId)
    console.log('response', response)

    const assignmentsWithNames = await Promise.all(
      response.data.data.map(async (user: any) => {
        return {
          value: user.id,
          label: user.lastName
        }
      }),
    )
    userOptions.value.push(...assignmentsWithNames)
  } catch (error) {
    console.error('fetch failed:', error)

  } finally {
  }
}
fetchUser();
const resetForm = (): void => {
  filters.value = {
    from: '',
    to: '',
    user: '',
    operation: ''
  }
  showResults.value = false
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