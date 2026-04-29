<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.creditLedgerPayments') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.creditLedgerPaymentsDescription') }}
        </p>
      </div>

   

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('fromDate') }}
            </label>
            <InputDatepicker v-model="filters.startDate" :placeholder="$t('dateFormat')" class="w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('To') }}
            </label>
            <InputDatepicker v-model="filters.endDate" :placeholder="$t('dateFormat')" class="w-full" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <!-- Export PDF -->
          <button
            @click="exportPDF"
            :disabled="exportLoading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-24 transition-all"
          >
            <svg v-if="exportLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-2 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            PDF
          </button>

          <!-- Report Button -->
          <button
            @click="generateReport"
            :disabled="loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-24 transition-all"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {{ $t('Report') }}
          </button>

          <!-- Reset -->
          <button
            @click="resetForm"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 min-w-24 transition-all"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ $t('Reset') }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <!-- <div v-if="showResults && reportData" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700 px-4 py-3">

   
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-800 dark:border-gray-400 pb-1 mb-2">
          <div class="text-base font-bold text-blue-800 dark:text-blue-300">
            {{ serviceStore.userService[0]?.hotelName }}
          </div>
          <div class="text-base text-red-800 dark:text-red-400 font-bold">
            {{ $t('reports.backOffice.creditLedgerPayments') }}
          </div>
        </div>

        <div class="text-sm mb-3 space-x-3 text-gray-700 dark:text-gray-300">
          <span><strong>{{ $t('fromDate') }}:</strong> {{ filters.startDate }}</span>
          <span><strong>{{ $t('To') }}:</strong> {{ filters.endDate }}</span>
        </div>

   

        <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th class="text-left border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('Date') }}</th>
                <th class="text-left border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('transactionNumber') }}</th>
                <th class="text-left border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('res.no') }}</th>
                <th class="text-left border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('folio') }}</th>
                <th class="text-left border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('guest') }}</th>
                <th class="text-left border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('Description') }}</th>
                <th class="text-right border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('Amount') }} (FCFA)</th>
                <th class="text-left border-b border-gray-800 dark:border-gray-400 px-2 py-2 font-bold text-gray-900 dark:text-gray-100">{{ $t('Comment') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in reportData.rows"
                :key="index"
                :class="index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'"
              >
                <td class="px-2 py-1.5 text-gray-900 dark:text-gray-100">{{ row.date }}</td>
                <td class="px-2 py-1.5 text-gray-900 dark:text-gray-100 font-mono text-xs">{{ row.transactionNumber }}</td>
                <td class="px-2 py-1.5 text-gray-900 dark:text-gray-100">{{ row.reservationNumber }}</td>
                <td class="px-2 py-1.5 text-gray-900 dark:text-gray-100">{{ row.folioNumber }}</td>
                <td class="px-2 py-1.5 text-gray-900 dark:text-gray-100">{{ row.guestName }}</td>
                <td class="px-2 py-1.5 text-gray-500 dark:text-gray-400 text-xs">{{ row.description }}</td>
                <td class="px-2 py-1.5 text-right font-mono font-semibold text-green-700 dark:text-green-400">{{ formatCurrency(row.amount) }}</td>
                <td class="px-2 py-1.5 text-gray-500 dark:text-gray-400 text-xs">{{ row.notes }}</td>
              </tr>

            
              <tr v-if="reportData.rows.length === 0">
                <td colspan="8" class="text-center py-10 text-gray-400">{{ $t('No reservation found') }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="font-bold">
                <td colspan="6" class="px-2 py-2 border-t-2 border-gray-800 dark:border-gray-300 text-gray-900 dark:text-gray-100">TOTAL</td>
                <td class="px-2 py-2 border-t-2 border-gray-800 dark:border-gray-300 text-right font-mono text-green-700 dark:text-green-400">{{ formatCurrency(reportData.total) }}</td>
                <td class="border-t-2 border-gray-800 dark:border-gray-300"></td>
              </tr>
            </tfoot>
          </table>
        </div>

       
      </div> -->
        <div v-if="showResults && reportData" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ serviceStore.userService[0]?.hotelName }}
            </h2>
            <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {{ $t('reports.backOffice.creditLedgerPayments') }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span><strong>{{ $t('common.dateFrom') }}:</strong> {{ filters.startDate }} <strong>{{ $t('common.to') }}:</strong> {{ filters.endDate }}</span>
          </div>
        </div>

        <!-- Report Table -->
        <div class="overflow-x-auto">
          <ReusableTable 
            :title="t('reports.backOffice.creditLedgerPayments')" 
            :data="reportData.rows" 
            :columns="selectedTableColumns"
            :loading="loading"
            :empty-message="reportData.rows?.length === 0 && !loading ? t('reports.noDataAvailable') : ''"
            :show-header="false"
            class="w-full mb-4 min-w-max" 
          >
          <template #column-amount="{item}">
            <div class="px-2 py-1.5 text-gray-900 dark:text-gray-100 font-semibold">{{ formatCurrency(item.amount || 0) }}</div>
          </template>
          </ReusableTable>
        </div>

        <!-- Total Row -->
        <div v-if="reportData.total" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
            <div> {{ $t('Total') }} </div>
            <div class="text-right font-mono text-green-700 dark:text-green-400"> {{ formatCurrency(reportData.total || 0) }} </div>
           
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted,computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue'
import ReportsLayout from '@/components/layout/ReportsLayout.vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useRouter } from 'vue-router'
import { getCreditLedgerPaymentsReport, getCreditLedgerPaymentsPdf } from '@/services/reportsApi'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import type { Column } from '@/utils/models'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'




const { t } = useI18n()
const router = useRouter()
const serviceStore = useServiceStore()

const today = new Date().toISOString().split('T')[0]

const filters = ref({
  startDate: today,
  endDate: today,
})

const loading = ref(false)
const exportLoading = ref(false)
const showResults = ref(false)
const reportData = ref<any>(null)
const pdfUrl = ref('')


const selectedTableColumns = computed<Column[]>(() => [
  { key: 'date', label: t('Date'), type: 'text' },
  { key: 'transactionNumber', label: t('transactionNumber'), type: 'text' },
  { key: 'type', label: t('Type'), type: 'text' },
  { key: 'reservationNumber', label: t('res.No'), type: 'text' },
  { key: 'folioNumber', label: t('folio'), type: 'text' },
  { key: 'guestName', label: t('guest'), type: 'text' },
  { key: 'description', label: t('Description'), type: 'text' },
  { key: 'amount', label: t('Amount'), type: 'custom' },
  { key: 'notes', label: t('Comment'), type: 'text' },


])

const generateReport = async () => {
  loading.value = true
  showResults.value = false
  try {
    const response = await getCreditLedgerPaymentsReport({
      hotelId: serviceStore.serviceId!,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
    })
    if (response?.success) {
      reportData.value = response.data
      showResults.value = true
    }
  } catch (error) {
    console.error('Error generating credit ledger report:', error)
  } finally {
    loading.value = false
  }
}

const exportPDF = async () => {
  exportLoading.value = true
  try {
    if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value)

    const blob = await getCreditLedgerPaymentsPdf({
      hotelId: serviceStore.serviceId!,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
    })

    pdfUrl.value = URL.createObjectURL(blob)
    const routeData = router.resolve({
      name: 'PDFViewer',
      query: {
        url: btoa(encodeURIComponent(pdfUrl.value)),
        title: t('reports.backOffice.creditLedgerPayments'),
      },
    })
    window.open(routeData.href, '_blank')
  } catch (error) {
    console.error('Error exporting PDF:', error)
  } finally {
    exportLoading.value = false
  }
}

const resetForm = () => {
  filters.value = { startDate: today, endDate: today }
  showResults.value = false
  reportData.value = null
}

</script>