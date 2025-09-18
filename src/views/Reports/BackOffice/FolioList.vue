<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('reports.folio.folioList') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage guest folio information
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date Type Selection -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.folio.dateType') }}
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input v-model="filters.dateType" type="radio" value="transaction" class="text-blue-600" />
                {{ t('reports.folio.transaction') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.dateType" type="radio" value="arrival" class="text-blue-600" />
                {{ t('reports.folio.arrival') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.dateType" type="radio" value="departure" class="text-blue-600" />
                {{ t('reports.folio.departure') }}
              </label>
            </div>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.from') }}
            </label>
            <InputDatepicker v-model="filters.dateFrom" :placeholder="t('common.from')" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.to') }}
            </label>
            <InputDatepicker v-model="filters.dateTo" :placeholder="t('common.to')" class="w-full" />
          </div>

          <!-- Business Source -->
          <div>
           <div>
                  <AutoCompleteSelect v-model="filters.businessSource" :options="BusinessSource"
                    :defaultValue="$t('SelectBusinessSource')" :lb="$t('business_source')" :is-required="false"
                 />
                </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Status -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('common.status') }}
            </label>
            <div class="flex gap-4 flex-wrap">
              <label class="flex items-center gap-2">
                <input v-model="filters.status.paid" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.paid') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.status.unpaid" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.unpaid') }}
              </label>
            </div>
          </div>


        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <!-- Include Options -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reports.folio.include') }}
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <label class="flex items-center gap-2">
                <input v-model="filters.include.all" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('common.all') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.reserved" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.reserved') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.cancelled" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.cancelled') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.noShow" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.noShow') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.checkedIn" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.checkedIn') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.checkedOut" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.checkedOut') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.void" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.void') }}
              </label>
              <label class="flex items-center gap-2">
                <input v-model="filters.include.unconfirmedReservation" type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                {{ t('reports.folio.unconfirmedReservation') }}
              </label>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Report Template -->
          <div class="flex items-center gap-3 w-full sm:w-auto">

          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ButtonComponent @click="exportData" variant="secondary" class="min-w-24 w-full sm:w-auto">
              {{ t('common.export') }}
            </ButtonComponent>

            <ButtonComponent @click="generateReport" variant="primary" class="min-w-24 w-full sm:w-auto">
              {{ t('common.report') }}
            </ButtonComponent>

            <ButtonComponent @click="resetForm" variant="outline" class="min-w-24 w-full sm:w-auto">
              {{ t('common.reset') }}
            </ButtonComponent>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('reports.folio.folioListResults') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ hotelName }}</span> •
            <span>{{ t('common.dateFrom') }}: {{ filters.dateFrom }} {{ t('common.to') }} {{ filters.dateTo }}</span> •
            <span>{{ t('common.sortBy') }}: {{ filters.sortBy }}</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <ResultTable :title="t('reports.folio.folioListResults')" :data="folioData" :columns="selectedTableColumns"
            class="w-full mb-4 min-w-max" />
        </div>

        <!-- Total Row -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ t('reports.folio.totalFolios') }}: {{ totalFolios }}</div>
            <div>{{ t('reports.folio.totalBalance') }}: {{ totalBalance.toFixed(2) }} {{ currency }}</div>
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
import { useServiceStore } from '../../../composables/serviceStore'
import AutoCompleteSelect from '../../../components/forms/FormElements/AutoCompleteSelect.vue'

const { t } = useI18n();
const serviceStore = useServiceStore()
const businessSourcesLo = ref<any>([...serviceStore.businessSources])
const BusinessSource = computed(() => businessSourcesLo.value || [])

interface FilterOptions {
  value: string;
  label: string;
}

interface FolioData {
  folioNo: string;
  invoiceNo: string;
  date: string;
  pax: number;
  name: string;
  status: string;
  chargeAmt: number;
  taxAmt: number;
  creditAmt: number;
  balanceAmt: number;
}

interface Filters {
  dateType: string;
  dateFrom: string;
  dateTo: string;
  status: {
    paid: boolean;
    unpaid: boolean;
  };
  businessSource: string;
  include: {
    all: boolean;
    reserved: boolean;
    cancelled: boolean;
    noShow: boolean;
    checkedIn: boolean;
    checkedOut: boolean;
    void: boolean;
    unconfirmedReservation: boolean;
  };
}

const hotelName = ref<string>('Karma eZee')
const showResults = ref<boolean>(false)
const currency = ref<string>('RMJ')

const filters = ref<Filters>({
  dateType: 'transaction',
  dateFrom: '01/09/2022',
  dateTo: '13/09/2022',
  status: {
    paid: true,
    unpaid: true
  },
  businessSource: '',
  include: {
    all: true,
    reserved: true,
    cancelled: true,
    noShow: true,
    checkedIn: true,
    checkedOut: true,
    void: true,
    unconfirmedReservation: true
  },
})

// Options for selects
const folioModeOptions = ref<FilterOptions[]>([
  { value: 'both', label: t('reports.folio.both') },
  { value: 'room', label: t('reports.folio.roomOnly') },
  { value: 'pos', label: t('reports.folio.posOnly') }
])

const sortByOptions = ref<FilterOptions[]>([
  { value: 'folioNo', label: t('reports.folio.folioNo') },
  { value: 'date', label: t('common.date') },
  { value: 'name', label: t('common.name') },
  { value: 'balance', label: t('reports.folio.balance') }
])

const businessSourceOptions = ref<FilterOptions[]>([
  { value: '', label: t('common.select') },
  { value: 'online', label: t('businessSources.online') },
  { value: 'phone', label: t('businessSources.phone') },
  { value: 'walk_in', label: t('businessSources.walkIn') }
])

const reportTemplateOptions = ref<FilterOptions[]>([
  { value: 'default', label: t('reportTemplates.default') },
  { value: 'detailed', label: t('reportTemplates.detailed') },
  { value: 'summary', label: t('reportTemplates.summary') }
])

// Sample data for the table based on the image
const folioData = ref<FolioData[]>([
  {
    folioNo: 'Folio388',
    invoiceNo: 'N/A',
    date: '13/09/2022',
    pax: 1.0,
    name: 'Mr Jayant',
    status: 'Confirmed Reservation',
    chargeAmt: 20000.00,
    taxAmt: 2400.00,
    creditAmt: 0.00,
    balanceAmt: 22400.00
  },
  {
    folioNo: 'Folio389',
    invoiceNo: 'N/A',
    date: '13/09/2022',
    pax: 1.0,
    name: 'Mr Jayant',
    status: 'Confirmed Reservation',
    chargeAmt: 20000.00,
    taxAmt: 2400.00,
    creditAmt: 0.00,
    balanceAmt: 22400.00
  },
  {
    folioNo: 'Folio390',
    invoiceNo: 'N/A',
    date: '13/09/2022',
    pax: 1.0,
    name: 'eZee',
    status: 'Confirmed Reservation',
    chargeAmt: 500.00,
    taxAmt: 60.00,
    creditAmt: 0.00,
    balanceAmt: 560.00
  },
  {
    folioNo: 'Folio391',
    invoiceNo: 'N/A',
    date: '13/09/2022',
    pax: 1.0,
    name: 'Mr Jayant',
    status: 'Confirmed Reservation',
    chargeAmt: 834.58,
    taxAmt: 65.42,
    creditAmt: 0.00,
    balanceAmt: 1000.00
  }
])

// Computed properties
const selectedTableColumns = computed(() => [
  { key: 'folioNo', label: t('reports.folio.folioNo') },
  { key: 'invoiceNo', label: t('reports.folio.invoiceNo') },
  { key: 'date', label: t('common.date') },
  { key: 'pax', label: t('reports.folio.pax') },
  { key: 'name', label: t('common.name') },
  { key: 'status', label: t('common.status') },
  { key: 'chargeAmt', label: t('reports.folio.chargeAmount') },
  { key: 'taxAmt', label: t('reports.folio.taxAmount') },
  { key: 'creditAmt', label: t('reports.folio.creditAmount') },
  { key: 'balanceAmt', label: t('reports.folio.balanceAmount') }
])

const totalFolios = computed(() => {
  return folioData.value.length
})

const totalBalance = computed(() => {
  return folioData.value.reduce((total, folio) => {
    return total + folio.balanceAmt
  }, 0)
})

// Methods
const generateReport = (): void => {
  showResults.value = true
  console.log('Generating folio list report with filters:', filters.value)
}

const exportData = (): void => {
  console.log('Exporting folio data...')
}

const resetForm = (): void => {
  filters.value = {
    dateType: 'transaction',
    dateFrom: '',
    dateTo: '',
    status: {
      paid: true,
      unpaid: true
    },
    folioType: {
      roomFolio: true,
      posFolio: false
    },
    folioMode: 'both',
    sortBy: 'folioNo',
    businessSource: '',
    include: {
      all: true,
      reserved: false,
      cancelled: false,
      noShow: false,
      checkedIn: false,
      checkedOut: false,
      void: false,
      unconfirmedReservation: false
    },
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
  .flex-col>div {
    width: 100%;
  }

  .flex-col>div+div {
    margin-top: 1rem;
  }

  .items-end {
    align-items: stretch;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-2.md\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-cols-2.md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>