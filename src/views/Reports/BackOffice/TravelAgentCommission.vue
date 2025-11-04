<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.travelAgentCommissionDetail') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.travelAgentCommissionDetailDescription') }}
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateFrom') }}
            </label>
            <InputDatepicker 
              v-model="filters.dateFrom" 
              :placeholder="$t('common.dateFrom')"
              class="w-full"
            />
          </div>

          <!-- To Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.dateTo') }}
            </label>
            <InputDatepicker 
              v-model="filters.dateTo" 
              :placeholder="$t('common.dateTo')"
              class="w-full"
            />
          </div>

          <!-- Travel Agent -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.travelAgent') }}
            </label>
            <SelectComponent 
              v-model="filters.travelAgent"
              :options="travelAgentOptions"
              placeholder="Mahendra Travels"
              class="w-full"
            />
          </div>

          <!-- Commission Plan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('reports.backOffice.commissionPlan') }}
            </label>
            <SelectComponent 
              v-model="filters.commissionPlan"
              :options="commissionPlanOptions"
              :placeholder="$t('common.select')"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Tax Inclusive Room Charges -->
          <div>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.taxInclusive"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ $t('reports.backOffice.taxInclusiveRoomCharges') }}
              </span>
            </label>
          </div>

          <!-- Report Template -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.reportTemplate') }}
            </label>
            <div class="flex items-center gap-2">
              <SelectComponent 
                v-model="filters.reportTemplate"
                :options="reportTemplateOptions"
                :placeholder="$t('common.reportTemplates.default')"
                class="flex-1"
              />
              <button 
                @click="editTemplate"
                class="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :title="$t('common.editTemplate')"
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
              {{ $t('common.report') }}
            </ButtonComponent>
            
            <ButtonComponent 
              @click="resetForm"
              variant="outline"
              class="min-w-20"
            >
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
              Karma
            </h2>
            <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {{ $t('reports.backOffice.travelAgentCommissionDetail') }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>{{ $t('common.dateFrom') }}:</strong> {{ filters.dateFrom }} <strong>{{ $t('common.to') }}:</strong> {{ filters.dateTo }}</span>
          </div>
        </div>
        
        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ResultTable 
            :title="$t('reports.backOffice.travelAgentCommissionDetails')"
            :data="commissionData"
            :columns="commissionColumns"
            class="w-full mb-4 min-w-max"
          />
          
          <!-- Total Row -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t">
            <div class="flex justify-between items-center font-semibold">
              <span class="text-gray-900 dark:text-white">{{ $t('reports.backOffice.total') }} (RM)</span>
              <div class="flex gap-8">
                <span class="text-gray-900 dark:text-white">1,500.00</span>
                <span class="text-gray-900 dark:text-white">120.00</span>
              </div>
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
import ResultTable from '@/components/tables/ReusableTable.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'

const { t } = useI18n()

interface FilterOptions {
  value: string;
  label: string;
}

interface CommissionItem {
  travelAgent: string;
  stay: string;
  guestName: string;
  folioNo: string;
  voucherNo: string;
  commissionPlan: string;
  roomCharges: string;
  commission: string;
  checkInBy: string;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  travelAgent: string;
  commissionPlan: string;
  taxInclusive: boolean;
  reportTemplate: string;
}

const showResults = ref<boolean>(false)

const filters = ref<Filters>({
  dateFrom: '01/09/2021',
  dateTo: '20/09/2021',
  travelAgent: 'Mahendra Travels',
  commissionPlan: '',
  taxInclusive: false,
  reportTemplate: 'Default'
})

// Options for selects
const travelAgentOptions = computed<FilterOptions[]>(() => [
  { value: 'mahendra_travels', label: 'Mahendra Travels' },
  { value: 'kumar_tours', label: 'Kumar Tours' },
  { value: 'sunshine_travels', label: 'Sunshine Travels' }
])

const commissionPlanOptions = computed<FilterOptions[]>(() => [
  { value: '', label: t('common.select') },
  { value: 'standard', label: t('reports.backOffice.commissionPlans.standard') },
  { value: 'premium', label: t('reports.backOffice.commissionPlans.premium') },
  { value: 'custom', label: t('reports.backOffice.commissionPlans.custom') }
])

const reportTemplateOptions = computed<FilterOptions[]>(() => [
  { value: 'Default', label: t('common.reportTemplates.default') },
  { value: 'detailed', label: t('common.reportTemplates.detailed') },
  { value: 'summary', label: t('common.reportTemplates.summary') }
])

// Sample commission data based on the image
const commissionDataRaw = ref<CommissionItem[]>([
  {
    travelAgent: 'Mahendra Travels',
    stay: '05-09 - 06-09',
    guestName: 'Help',
    folioNo: 'Folio204',
    voucherNo: '',
    commissionPlan: 'onAllNightsExcluTax',
    roomCharges: '500.00',
    commission: '64.00',
    checkInBy: 'helpdesksupport'
  },
  {
    travelAgent: 'Mahendra Travels',
    stay: '05-09 - 06-09',
    guestName: 'Help',
    folioNo: 'Folio206',
    voucherNo: '',
    commissionPlan: 'onAllNightsExcluTax',
    roomCharges: '0.00',
    commission: '0.00',
    checkInBy: 'helpdesksupport'
  },
  {
    travelAgent: 'Mahendra Travels',
    stay: '05-09 - 06-09',
    guestName: 'Help',
    folioNo: 'Folio205',
    voucherNo: 'N/A',
    commissionPlan: 'onAllNightsExcluTax',
    roomCharges: '500.00',
    commission: '64.00',
    checkInBy: 'helpdesksupport'
  }
])

// Computed properties for ResultTable
const commissionColumns = computed(() => [
  { key: 'travelAgent', label: t('common.travelAgent') },
  { key: 'stay', label: t('common.stay') },
  { key: 'guestName', label: t('common.guestName') },
  { key: 'folioNo', label: t('common.folioNumber') },
  { key: 'voucherNo', label: t('common.voucherNumber') },
  { key: 'commissionPlan', label: t('reports.backOffice.commissionPlan') },
  { key: 'roomCharges', label: t('reports.backOffice.roomChargesTaxExclusive') },
  { key: 'commission', label: t('reports.backOffice.commissionAmount') },
  { key: 'checkInBy', label: t('reports.backOffice.checkInBy') }
])

const commissionData = computed(() => {
  return commissionDataRaw.value.map(item => ({
    travelAgent: item.travelAgent,
    stay: item.stay,
    guestName: item.guestName,
    folioNo: item.folioNo,
    voucherNo: item.voucherNo || t('common.na'),
    commissionPlan: t(`reports.backOffice.commissionPlanTypes.${item.commissionPlan}`),
    roomCharges: item.roomCharges,
    commission: item.commission,
    checkInBy: t(`reports.backOffice.users.${item.checkInBy}`) || item.checkInBy
  }))
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating travel agent commission report with filters:', filters.value)
}

const resetForm = (): void => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    travelAgent: '',
    commissionPlan: '',
    taxInclusive: false,
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