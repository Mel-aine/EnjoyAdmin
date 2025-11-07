<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.audit.voidCharge') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.audit.voidChargeDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Void From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.audit.voidFrom') }}
            </label>
            <InputDatepicker v-model="filters.voidFrom" :placeholder="$t('common.dateFrom')" class="w-full" />
          </div>

          <!-- Void To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <InputDatepicker v-model="filters.voidTo" :placeholder="$t('common.dateTo')" class="w-full" />
          </div>

          <!-- Void By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.audit.voidBy') }}
            </label>
            <SelectComponent v-model="filters.voidBy" :options="voidByOptions" :placeholder="$t('common.select')" class="w-full" />
          </div>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 items-end">
            <ButtonComponent @click="generateReport" variant="" class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ $t('common.report') }}</span>
            </ButtonComponent>

            <ButtonComponent @click="resetForm" variant="outline" class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
              {{ $t('common.reset') }}
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
              {{ $t('reports.audit.voidCharge') }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>{{ $t('common.dateFrom') }}:</strong> {{ filters.voidFrom }} <strong>{{ $t('common.to') }}:</strong> {{ filters.voidTo }}</span>
          </div>
        </div>

        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable :title="$t('reports.audit.voidChargeDetails')" :data="voidChargeData" :columns="voidChargeColumns" :show-header=false
            class="w-full mb-4 min-w-max" />
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
import { getEmployeesForService } from '../../../services/userApi'
import { useServiceStore } from '../../../composables/serviceStore'
import { onMounted } from 'vue'
import { getVoidChargeReport } from '../../../services/reportsApi'
import Spinner from '../../../components/spinner/Spinner.vue'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface VoidChargeItem {
  voidedAt: string;
  folioNo: string;
  chargeDescription: string;
  resNo: string;
  amount: string;
  voidedBy: string;
}

interface Filters {
  voidFrom: string;
  voidTo: string;
  voidBy: string;
}
// Set default dates to today
const today = new Date().toISOString().split('T')[0]
const hotelName = computed(()=>{
  return useServiceStore().getCurrentService?.hotelName
})
const showResults = ref<boolean>(false)
const totalRecords = ref(0);
const totalAmount = ref(0);
const filters = ref<Filters>({
  voidFrom: today,
  voidTo: today,
  voidBy: '',
})
const isLoading = ref(false)
// Options for selects
const voidByOptions = computed<FilterOptions[]>(() => [
  { value: '', label: t('common.all') },
  ...voidByOptionsRaw.value
])

const voidByOptionsRaw = ref<FilterOptions[]>([])



// Sample void charge data based on the image
const voidChargeDataRaw = ref<VoidChargeItem[]>([])

// Computed properties for ResultTable
const voidChargeColumns = computed(() => [
  { key: 'date', label: t('common.date') },
  { key: 'voucher', label: t('common.voucherNumber') },
  { key: 'charge', label: t('common.charge') },
  { key: 'reference', label: t('common.reference') },
  { key: 'amount', label: t('common.amount') },
  { key: 'voidByDateTime', label: t('reports.audit.voidByDateTime') }
])

const voidChargeData = computed(() => {
  return voidChargeDataRaw.value.map(item => ({
    date: item.voidedAt,
    voucher: item.folioNo,
    charge: item.chargeDescription,
    reference: item.resNo,
    amount: item.amount,
    voidByDateTime: item.voidedBy
  }))
})

// Methods
const generateReport = async (): Promise<void> => {
  isLoading.value = true
  console.log('Generating void charge report with filters:', filters.value)
  const data = {
    from: filters.value.voidFrom,
    to: filters.value.voidTo,
    by: filters.value.voidBy,
    hotelId: useServiceStore().serviceId!
  }
  const response = await getVoidChargeReport(data);
  voidChargeDataRaw.value = response?.data?.voidCharges || [];
  totalRecords.value = response?.data?.totalRecords || 0;
  totalAmount.value = response?.data?.totalAmount || 0;
  showResults.value = true
  isLoading.value = false
  console.log('response', response)
}

const resetForm = (): void => {
  filters.value = {
    voidFrom: '',
    voidTo: '',
    voidBy: '',
  }
  showResults.value = false
}
const loading = ref(false)
const users = ref<any>([]);
const serviceStore: any = useServiceStore()
const fetchUser = async () => {
  loading.value = true
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
    voidByOptionsRaw.value.push(...assignmentsWithNames)
    users.value = assignmentsWithNames
    console.log('Filtered users with user info:', users.value)
  } catch (error) {
    console.error('fetch failed:', error)

  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchUser()
})

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