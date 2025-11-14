<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.backOffice.workOrderList') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.workOrderListDescription') }}
        </p>
      </div>

      <!-- Filtres et Type de rapport combinés -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date de début -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.startDate') }}
            </label>
            <InputDatepicker
              v-model="filters.startDate"
              :placeholder="$t('common.selectDate')"
              class="w-full"
            />
          </div>

          <!-- Date de fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.endDate') }}
            </label>
            <InputDatepicker
              v-model="filters.endDate"
              :placeholder="$t('common.selectDate')"
              class="w-full"
            />
          </div>

          <!-- Statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option value="pending">{{ $t('taskManagement.filters.todo') }}</option>
              <option value="in_progress">{{ $t('taskManagement.filters.in_progress') }}</option>
              <option value="on_hold">{{ $t('workOrder.status.onHold') }}</option>
              <option value="completed">{{ $t('taskManagement.filters.done') }}</option>
              <option value="cancelled">{{ $t('common.cancelled') }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <!-- Priorité -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.priority') }}
            </label>
            <select
              v-model="filters.priority"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option value="low">{{ $t('taskManagement.priorities.low') }}</option>
              <option value="medium">{{ $t('taskManagement.priorities.medium') }}</option>
              <option value="high">{{ $t('taskManagement.priorities.high') }}</option>
              <option value="urgent">{{ $t('common.urgent') }}</option>
            </select>
          </div>

          <!-- Département -->
   <!--        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.department') }}
            </label>
            <select
              v-model="filters.departmentId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
          </div> -->

          <!-- Assigné à -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.assignedTo') }}
            </label>
            <select
              v-model="filters.assignedTo"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="user in userOptions" :key="user.id" :value="user.id">
                {{ user.label }}
              </option>
            </select>
          </div>

          <!-- Chambre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.room') }}
            </label>
            <select
              v-model="filters.roomId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="room in roomOptions" :key="room.id" :value="room.id">
                {{ room.label }} - {{ room.type }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Catégorie -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.category') }}
            </label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option value="maintenance">{{ $t('taskManagement.types.maintenance') }}</option>
              <option value="cleaning">{{ $t('taskManagement.types.cleaning') }}</option>
              <option value="repair">{{ $t('workOrder.categories.repair') }}</option>
              <option value="inspection">{{ $t('workOrder.categories.inspection') }}</option>
            </select>
          </div>

          <!-- Créé par -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.user') }}
            </label>
            <select
              v-model="filters.createdBy"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="user in userOptions" :key="user.id" :value="user.id">
                {{ user.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Type de rapport - Version simplifiée -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('common.reportType') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="report in availableReports" :key="report.id" class="flex items-start">
              <input
                type="radio"
                :id="report.id"
                :value="report.id"
                v-model="selectedReportType"
                class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              >
              <label :for="report.id" class="ml-2 text-sm text-gray-900 dark:text-white cursor-pointer">
                <span class="font-medium">{{ report.name }}</span>

              </label>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row items-center justify-end mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 gap-4">
          <!-- Bouton Réinitialiser -->
          <button
            @click="resetFilters"
            class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ $t('common.reset') }}
          </button>

          <!-- Bouton Rapport -->
          <button
            @click="generateReport"
            :disabled="!selectedReportType || loading"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ $t('common.report') }}
          </button>
        </div>
      </div>

      <!-- Résultats du rapport -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <!-- En-tête du rapport -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ translatedReportTitle }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ $t('reports.generatedAt') }}: {{ formatDate(new Date()) }}</span>
            <span v-if="reportData?.data?.summary" class="ml-4">
              {{ $t('common.total') }}: {{ getTotalCount() }}
            </span>
          </div>
        </div>

        <!-- Contenu HTML du rapport ou tableau -->
        <div v-if="reportData?.data?.html" v-html="translatedHtml" class="report-html-container p-6"></div>

        <!-- Affichage du rapport en fonction du type -->
        <div v-else class="p-6">
          <!-- Rapport de synthèse -->
          <div v-if="selectedReportType === 'workOrdersSummary' && reportData?.data">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Résumé par statut -->
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  {{ $t('workOrder.statusSummary') }}
                </h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.total') }}:</span>
                    <span class="font-medium">{{ reportData.data.summary?.statusSummary?.total || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('workOrder.status.pending') }}:</span>
                    <span class="font-medium text-yellow-600">{{ reportData.data.summary?.statusSummary?.pending || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('workOrder.status.inProgress') }}:</span>
                    <span class="font-medium text-blue-600">{{ reportData.data.summary?.statusSummary?.inProgress || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('workOrder.status.completed') }}:</span>
                    <span class="font-medium text-green-600">{{ reportData.data.summary?.statusSummary?.completed || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('workOrder.status.overdue') }}:</span>
                    <span class="font-medium text-red-600">{{ reportData.data.summary?.statusSummary?.overdue || 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- Résumé par priorité -->
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  {{ $t('workOrder.prioritySummary') }}
                </h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('taskManagement.priorities.high') }}:</span>
                    <span class="font-medium text-red-600">{{ reportData.data.summary?.prioritySummary?.high || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('taskManagement.priorities.medium') }}:</span>
                    <span class="font-medium text-yellow-600">{{ reportData.data.summary?.prioritySummary?.medium || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('taskManagement.priorities.low') }}:</span>
                    <span class="font-medium text-gray-600">{{ reportData.data.summary?.prioritySummary?.low || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tableau pour les autres types de rapports -->
          <div v-else-if="reportData?.data?.data">
            <ResultTable
              :title="reportData.data?.title || $t('common.report')"
              :data="formatTableData()"
              :columns="getTableColumns()"
              class="w-full"
            />
          </div>
        </div>
      </div>

    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUpdated, computed, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ReportsLayout from '@/components/layout/ReportsLayout.vue';
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue';
import ResultTable from '@/components/tables/ReusableTable.vue';
import {
  getAvailableWorkOrderReports,
  generateWorkOrderReport,
  type WorkOrderFilters,
  type WorkOrderReportResponse,
  type AvailableReport
} from '@/services/workOrderReportsApi.ts';
import { useServiceStore } from '@/composables/serviceStore';
// import { useBooking } from '@/composables/useBooking2'
import { getEmployeesForService } from '@/services/userApi'
import { getRooms } from '@/services/configrationApi'
// import SelectComponent from '@/components/forms/FormElements/Select.vue'

const { t } = useI18n();

// Store
const serviceStore = useServiceStore();
const hotelId = serviceStore.serviceId;

// États réactifs
const loading = ref<boolean>(false);
// const exportLoading = ref<boolean>(false);
const showResults = ref<boolean>(false);
const selectedReportType = ref<string>('');
const reportData = ref<WorkOrderReportResponse | null>(null);
interface UserOption { id: number | string; label: string }
interface RoomOption { id: number | string; label: string; type: string }
const userOptions = ref<UserOption[]>([])
const roomOptions = ref<RoomOption[]>([])

// const {
//   BookingSource,
//   BusinessSource,
//   BookingType,
//   creditTypes,
//   billToOptions,
//   MarketCode,
//   reservationId,
// } = useBooking()

// Fonction pour mapper les rapports de l'API avec les traductions
const mapReportsWithTranslations = (reports: AvailableReport[]): AvailableReport[] => {
  return reports.map(report => {
    // Mapping direct des IDs vers les clés de traduction
    const translationKeys: Record<string, string> = {
      'workOrdersByStatus': 'workOrder.reports.byStatus',
      'workOrdersByPriority': 'workOrder.reports.byPriority',
      'workOrdersByDepartment': 'workOrder.reports.byDepartment',
      'workOrdersByAssignee': 'workOrder.reports.byAssignee',
      'workOrdersOverdue': 'workOrder.reports.overdue',
      'workOrdersCompleted': 'workOrder.reports.completed',
      'workOrdersSummary': 'workOrder.reports.summary'
    }
    
    const nameKey = translationKeys[report.id]
    const descKey = nameKey ? `${nameKey}Desc` : null
    
    return {
      ...report,
      name: nameKey ? t(nameKey) : report.name,
      description: descKey ? t(descKey) : report.description
    }
  })
}

// Données brutes de l'API
const rawAvailableReports = ref<AvailableReport[]>([]);

// Données disponibles avec traductions réactives
const availableReports = computed(() => {
  if (rawAvailableReports.value.length === 0) {
    return getDefaultReports();
  }
  return mapReportsWithTranslations(rawAvailableReports.value);
});

// Déclarations d'exemple non utilisées supprimées pour éviter les erreurs de lint

// Filtres
const filters = reactive<WorkOrderFilters>({
  hotelId: hotelId || undefined,
  startDate: '',
  endDate: '',
  status: '',
  priority: '',
  departmentId: undefined,
  assignedTo: undefined,
  createdBy: undefined,
  roomId: undefined,
  category: ''
});

// Méthodes
// selectReportType supprimée car non utilisée

const resetFilters = () => {
  const todayDate = new Date();
  const weekAgo = new Date(todayDate);
  weekAgo.setDate(weekAgo.getDate() - 7);

  Object.assign(filters, {
    hotelId: hotelId || undefined,
    startDate: weekAgo.toISOString().split('T')[0],
    endDate: todayDate.toISOString().split('T')[0],
    status: '',
    priority: '',
    departmentId: undefined,
    assignedTo: undefined,
    createdBy: undefined,
    roomId: undefined,
    category: ''
  });
  // Réinitialiser l'affichage et le contenu du rapport
  showResults.value = false;
  reportData.value = null;
  // Définir un type de rapport par défaut
  selectedReportType.value = 'workOrdersByStatus';
};

const fetchUsers = async () => {
  try {
    const resp = await getEmployeesForService(hotelId!)
    console.log('Users:', resp)
    userOptions.value = resp.data.data.map((u: { id: number | string; firstName: string; lastName: string }) => ({
      id: u.id,
      label: `${u.firstName} ${u.lastName}`
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}


const fetchRooms = async () => {
  try {
    const resp = await getRooms()
    console.log('Rooms:', resp)
    roomOptions.value = resp.data.data.data.map((r: { id: number | string; roomNumber: string; roomType: { roomTypeName: string } }) => ({
      id: r.id,
      label: r.roomNumber,
      type: r.roomType.roomTypeName
    }))
  } catch (error) {
    console.error('Error fetching rooms:', error)
  }
}

const generateReport = async (): Promise<void> => {
  if (!selectedReportType.value) return;

  loading.value = true;
  showResults.value = false;

  try {
    console.log('Generating work order report:', selectedReportType.value, filters);

    const response = await generateWorkOrderReport(selectedReportType.value, {
      ...filters,
      hotelId: hotelId || undefined
    });

    console.log('Report generation response:', response);

    if (response && response.success) {
      reportData.value = response;
      showResults.value = true;
    }
  } catch (error) {
    console.error('Error generating work order report:', error);
  } finally {
    loading.value = false;
  }
};

// Traduit des fragments HTML renvoyés par l'API (fallback côté client)
const translateReportHtml = (html: string): string => {
  if (!html) return html
  
  // Normaliser les espaces insécables et autres entités HTML
  let out = html.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  
  // REMPLACEMENT ULTRA-AGRESSIF pour "Work Orders by Status" - en premier, avant tout
  const workOrdersByStatus = 'Work Orders by Status'
  const workOrdersByStatusFr = t('workOrder.reports.byStatus')
  
  // Toutes les variations possibles
  const variations = [
    workOrdersByStatus,
    workOrdersByStatus.toUpperCase(),
    workOrdersByStatus.toLowerCase(),
    'Work Orders by Status',
    'WORK ORDERS BY STATUS',
    'work orders by status',
    'Work&nbsp;Orders&nbsp;by&nbsp;Status',
    'Work Orders by Status:',
    'Work Orders by Status :',
  ]
  
  variations.forEach(variation => {
    // Remplacement direct
    if (out.includes(variation)) {
      out = out.split(variation).join(workOrdersByStatusFr)
    }
    
    // Remplacement avec regex très permissive
    const escaped = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped.replace(/\s+/g, '\\s*'), 'gi')
    out = out.replace(regex, workOrdersByStatusFr)
    
    // Remplacement même si entouré de balises HTML
    const inHtmlRegex = new RegExp(`([>\\s])${escaped.replace(/\s+/g, '\\s*')}([<\\s])`, 'gi')
    out = out.replace(inHtmlRegex, `$1${workOrdersByStatusFr}$2`)
  })
  
  // Traduire explicitement les titres de types de rapports (avant les autres remplacements)
  // Utiliser plusieurs approches pour être sûr de capturer tous les cas
  const reportTitleTranslations: Array<[string, string]> = [
    ['Work Orders by Status', t('workOrder.reports.byStatus')],
    ['Work Orders by Priority', t('workOrder.reports.byPriority')],
    ['Work Orders by Department', t('workOrder.reports.byDepartment')],
    ['Work Orders by Assignee', t('workOrder.reports.byAssignee')],
    ['Overdue Work Orders', t('workOrder.reports.overdue')],
    ['Completed Work Orders', t('workOrder.reports.completed')],
    ['Work Orders Summary', t('workOrder.reports.summary')],
  ]
  
  // Approche 1: Remplacement direct (le plus simple et efficace)
  reportTitleTranslations.forEach(([en, fr]) => {
    // Remplacement direct insensible à la casse
    const escapedEn = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escapedEn, 'gi')
    out = out.replace(regex, fr)
    
    // Remplacement avec espaces flexibles (1 ou plusieurs espaces)
    const flexibleEscaped = en.replace(/\s+/g, '\\s+').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const flexibleRegex = new RegExp(flexibleEscaped, 'gi')
    out = out.replace(flexibleRegex, fr)
    
    // Remplacement avec espaces multiples possibles (espaces, newlines, tabs)
    const multiSpaceEscaped = en.replace(/\s+/g, '[\\s\\n\\r\\t]+').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const multiSpaceRegex = new RegExp(multiSpaceEscaped, 'gi')
    out = out.replace(multiSpaceRegex, fr)
    
    // Remplacement direct par split/join (pour cas où regex échoue)
    // Utiliser une boucle pour remplacer toutes les occurrences
    const lowerEn = en.toLowerCase()
    let searchIndex = 0
    while (true) {
      const lowerOut = out.toLowerCase()
      const foundIndex = lowerOut.indexOf(lowerEn, searchIndex)
      if (foundIndex === -1) break
      
      // Remplacer cette occurrence
      const before = out.substring(0, foundIndex)
      const after = out.substring(foundIndex + en.length)
      out = before + fr + after
      
      // Continuer la recherche après le texte remplacé
      searchIndex = foundIndex + fr.length
      if (searchIndex >= out.length) break
    }
  })
  
  // Traduire la ligne de synthèse "Generated on ... | ... records" ou "Generated on ... | ... records | ... columns displayed"
  const summaryPattern = /Generated\s+on\s+([^|]+)\|\s*(\d+)\s+records(\s*\|\s*(\d+)\s+columns\s+displayed)?/gi
  out = out.replace(summaryPattern, (_match, datePart, recordCount, _columnsPart, columnCount) => {
    const dateText = datePart.trim()
    if (columnCount) {
      return `${t('reports.generatedOn')} ${dateText} | ${recordCount} ${t('reports.records')} | ${columnCount} ${t('reports.columnsDisplayed')}`
    }
    return `${t('reports.generatedOn')} ${dateText} | ${recordCount} ${t('reports.records')}`
  })
  
  const replacements: Record<string, string> = {
    // Titres et descriptions
    'Work Order List Report': t('reports.backOffice.workOrderReport'),
    'WORK ORDER LIST REPORT': t('reports.backOffice.workOrderReport').toUpperCase(),
    'Work Order Report': t('reports.backOffice.workOrderReport'),
    'View and manage work orders': t('reports.backOffice.workOrderListDescription'),
    // Types de rapports
    'Work Orders by Status': t('workOrder.reports.byStatus'),
    'Work Orders by Status:': t('workOrder.reports.byStatus') + ':',
    'Work Orders by Priority': t('workOrder.reports.byPriority'),
    'Work Orders by Priority:': t('workOrder.reports.byPriority') + ':',
    'Work Orders by Department': t('workOrder.reports.byDepartment'),
    'Work Orders by Department:': t('workOrder.reports.byDepartment') + ':',
    'Work Orders by Assignee': t('workOrder.reports.byAssignee'),
    'Work Orders by Assignee:': t('workOrder.reports.byAssignee') + ':',
    'Overdue Work Orders': t('workOrder.reports.overdue'),
    'Overdue Work Orders:': t('workOrder.reports.overdue') + ':',
    'Completed Work Orders': t('workOrder.reports.completed'),
    'Completed Work Orders:': t('workOrder.reports.completed') + ':',
    'Work Orders Summary': t('workOrder.reports.summary'),
    'Work Orders Summary:': t('workOrder.reports.summary') + ':',
    'Status Summary': t('workOrder.statusSummary'),
    'Priority Summary': t('workOrder.prioritySummary'),
    // En-têtes avec deux-points
    'Hotel:': t('reports.reservation.hotel') + ':',
    'Date From:': t('common.dateFrom') + ':',
    'Date To:': t('common.dateTo') + ':',
    'From:': t('common.from') + ':',
    'To:': t('common.to') + ':',
    'Status:': t('common.status') + ':',
    'Priority:': t('common.priority') + ':',
    'Department:': t('common.department') + ':',
    'Assigned To:': t('common.assignedTo') + ':',
    'Room:': t('common.room') + ':',
    'Category:': t('common.category') + ':',
    'Created By:': t('common.user') + ':',
    'Order By:': t('reports.reservation.orderBy') + ':',
    'Tax Inclusive:': t('reports.reservation.taxInclusive') + ':',
    'Generated At:': t('reports.generatedAt') + ':',
    'Generated:': t('reports.generatedAt') + ':',
    // Statuts
    'In Progress': t('taskManagement.filters.in_progress'),
    'On Hold': t('workOrder.status.onHold'),
    'Pending': t('taskManagement.filters.todo'),
    'Completed': t('taskManagement.filters.done'),
    'Cancelled': t('common.cancelled'),
    'Overdue': t('workOrder.status.overdue'),
    // Priorités
    'Urgent': t('common.urgent'),
    'High': t('taskManagement.priorities.high'),
    'Medium': t('taskManagement.priorities.medium'),
    'Low': t('taskManagement.priorities.low'),
    // Colonnes du tableau
    'Created At': t('common.createdAt'),
    'Completed At': t('common.completedAt'),
    'Due Date': t('common.dueDate'),
    'Assigned To': t('common.assignedTo'),
    'Description': t('common.description'),
    'Priority': t('common.priority'),
    'Status': t('common.status'),
    'Category': t('common.category'),
    'Department': t('common.department'),
    'Title': t('common.title'),
    'Room': t('common.room'),
    'User': t('common.user'),
    'ID': t('common.id'),
    // Ligne de synthèse
    'Generated on': t('reports.generatedOn'),
    'records': t('reports.records'),
    'columns displayed': t('reports.columnsDisplayed'),
    // Autres
    'Summary': t('workOrder.reports.summary'),
    'Total': t('common.total'),
    'N/A': t('common.na'),
    'Yes': t('common.yes'),
    'No': t('common.no')
  }
  
  // IMPORTANT: Les textes plus longs doivent être remplacés en premier pour éviter les remplacements partiels
  // Convertir en tableau et trier par longueur (plus longs en premier)
  const sortedReplacements = Object.entries(replacements)
    .filter(([en]) => !en.startsWith('>') || !en.endsWith('<'))
    .sort(([a], [b]) => b.length - a.length)
  
  // Traiter d'abord les remplacements avec balises HTML
  for (const [en, fr] of Object.entries(replacements)) {
    if (en.startsWith('>') && en.endsWith('<')) {
      // Remplacement avec contexte HTML
      const regex = new RegExp(en, 'gi')
      out = out.replace(regex, fr)
    }
  }
  
  // Ensuite les remplacements simples (sans balises), dans l'ordre des plus longs aux plus courts
  for (const [en, fr] of sortedReplacements) {
    // Échapper les caractères spéciaux pour les regex
    const escapedEn = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    // Créer plusieurs patterns pour différents cas
    
    // 1. Pattern exact avec espaces normalisés
    const exactPattern = new RegExp(escapedEn.replace(/\s+/g, '\\s+'), 'gi')
    out = out.replace(exactPattern, fr)
    
    // 2. Pattern flexible avec espaces multiples, retours à la ligne, tabs
    const flexiblePattern = new RegExp(escapedEn.replace(/\s+/g, '[\\s\\n\\r\\t]+'), 'gi')
    out = out.replace(flexiblePattern, fr)
    
    // 3. Pattern qui ignore complètement les espaces (pour cas extrêmes)
    const noSpacePattern = new RegExp(escapedEn.replace(/\s+/g, '\\s*'), 'gi')
    out = out.replace(noSpacePattern, fr)
    
    // 4. Pattern pour texte entre balises HTML
    const inTagsPattern = new RegExp(`(>|^)([^<]*?)${escapedEn.replace(/\s+/g, '\\s+')}([^<]*?)(<|$)`, 'gi')
    out = out.replace(inTagsPattern, (match, start, before, after, end) => {
      return `${start}${before}${fr}${after}${end}`
    })
    
    // 5. Pattern pour texte dans les attributs
    const inAttrsPattern = new RegExp(`(["'])([^"']*?)${escapedEn.replace(/\s+/g, '\\s+')}([^"']*?)\\1`, 'gi')
    out = out.replace(inAttrsPattern, (match, quote, before, after) => {
      return `${quote}${before}${fr}${after}${quote}`
    })
    
    // 6. Remplacement direct du texte exact (sans regex, pour cas simples)
    if (out.includes(en)) {
      out = out.split(en).join(fr)
    }
    
    // 7. Remplacement avec variations de casse
    const lowerEn = en.toLowerCase()
    if (out.toLowerCase().includes(lowerEn)) {
      // Trouver toutes les occurrences (insensible à la casse) et les remplacer
      const caseInsensitivePattern = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      out = out.replace(caseInsensitivePattern, fr)
    }
  }
  
  // Remplacement final très agressif pour les titres de rapports (au cas où ils auraient échappé)
  // Cette approche remplace directement le texte même dans des contextes HTML complexes
  reportTitleTranslations.forEach(([en, fr]) => {
    // Remplacer toutes les occurrences possibles, même dans les attributs HTML
    // Utiliser une approche de remplacement global très simple
    const allVariations = [
      en, // Version exacte
      en.toUpperCase(), // Version majuscules
      en.toLowerCase(), // Version minuscules
      en.replace(/\s+/g, ' '), // Version avec espaces simples
      en.replace(/\s+/g, '&nbsp;'), // Version avec &nbsp;
      en.replace(/\s+/g, '\n'), // Version avec newlines
      en.replace(/\s+/g, '\t'), // Version avec tabs
    ]
    
    allVariations.forEach(variation => {
      // Remplacement direct
      if (out.includes(variation)) {
        out = out.split(variation).join(fr)
      }
      
      // Remplacement insensible à la casse - utiliser une approche itérative
      const lowerVariation = variation.toLowerCase()
      let searchIndex = 0
      while (true) {
        const currentLowerOut = out.toLowerCase()
        const foundIndex = currentLowerOut.indexOf(lowerVariation, searchIndex)
        if (foundIndex === -1) break
        
        // Remplacer cette occurrence
        const before = out.substring(0, foundIndex)
        const after = out.substring(foundIndex + variation.length)
        out = before + fr + after
        
        // Continuer la recherche après le texte remplacé
        searchIndex = foundIndex + fr.length
        if (searchIndex >= out.length) break
      }
    })
  })
  
  // DERNIER REMPLACEMENT - Pour être absolument sûr que "Work Orders by Status" est traduit
  // Chercher toutes les occurrences possibles, même dans des contextes HTML complexes
  const finalWorkOrdersByStatus = 'Work Orders by Status'
  const finalWorkOrdersByStatusFr = t('workOrder.reports.byStatus')
  
  // Utiliser une approche de remplacement global très simple et directe
  // Remplacer toutes les occurrences, peu importe le contexte
  const globalPattern = /Work\s+Orders\s+by\s+Status/gi
  out = out.replace(globalPattern, finalWorkOrdersByStatusFr)
  
  // Aussi remplacer avec des espaces insécables
  const nbspPattern = /Work\s*&nbsp;\s*Orders\s*&nbsp;\s*by\s*&nbsp;\s*Status/gi
  out = out.replace(nbspPattern, finalWorkOrdersByStatusFr)
  
  // Remplacer dans les attributs HTML (title, data-title, aria-label, etc.)
  const attrPatterns = [
    /(title\s*=\s*["'])([^"']*?)Work\s+Orders\s+by\s+Status([^"']*?)(["'])/gi,
    /(data-title\s*=\s*["'])([^"']*?)Work\s+Orders\s+by\s+Status([^"']*?)(["'])/gi,
    /(aria-label\s*=\s*["'])([^"']*?)Work\s+Orders\s+by\s+Status([^"']*?)(["'])/gi,
    /(alt\s*=\s*["'])([^"']*?)Work\s+Orders\s+by\s+Status([^"']*?)(["'])/gi,
    /(placeholder\s*=\s*["'])([^"']*?)Work\s+Orders\s+by\s+Status([^"']*?)(["'])/gi,
  ]
  
  attrPatterns.forEach(pattern => {
    out = out.replace(pattern, (match, prefix, before, text, after, suffix) => {
      return prefix + (before || '') + finalWorkOrdersByStatusFr + (after || '') + suffix
    })
  })
  
  // Remplacer même si c'est dans un attribut HTML ou un commentaire
  // Utiliser une approche de remplacement de chaîne directe - itérer jusqu'à ce qu'il n'y ait plus de changements
  let iterations = 0
  const maxIterations = 100 // Sécurité pour éviter les boucles infinies
  while (iterations < maxIterations) {
    const beforeReplace = out
    // Chercher et remplacer toutes les occurrences (insensible à la casse)
    const lowerOut = out.toLowerCase()
    const searchText = 'work orders by status'
    const index = lowerOut.indexOf(searchText)
    
    if (index === -1) {
      break // Plus d'occurrences trouvées
    }
    
    // Trouver la longueur exacte du texte à remplacer (peut varier selon la casse)
    const matchLength = finalWorkOrdersByStatus.length
    // Chercher la correspondance exacte dans le texte original
    const originalText = out.substring(index, index + matchLength)
    
    // Remplacer cette occurrence
    const before = out.substring(0, index)
    const after = out.substring(index + matchLength)
    out = before + finalWorkOrdersByStatusFr + after
    
    // Si rien n'a changé, sortir
    if (beforeReplace === out) {
      break
    }
    
    iterations++
  }
  
  // Dernière tentative : remplacer directement toutes les variations possibles
  const allPossibleVariations = [
    'Work Orders by Status',
    'WORK ORDERS BY STATUS',
    'work orders by status',
    'Work Orders By Status',
    'Work orders by status',
  ]
  
  allPossibleVariations.forEach(variation => {
    if (out.includes(variation)) {
      out = out.split(variation).join(finalWorkOrdersByStatusFr)
    }
  })
  
  // Remplacement final ultra-agressif : utiliser une regex qui capture le texte dans TOUS les contextes
  // Même dans les balises, les attributs, les commentaires, etc.
  const ultraAggressivePattern = /(Work\s+Orders\s+by\s+Status)/gi
  out = out.replace(ultraAggressivePattern, finalWorkOrdersByStatusFr)
  
  // Aussi remplacer avec une approche qui ignore complètement la structure HTML
  // Remplacer toutes les occurrences, peu importe où elles se trouvent
  const words = ['Work', 'Orders', 'by', 'Status']
  const frenchWords = ['Ordres', 'de', 'travail', 'par', 'statut']
  
  // Si on trouve la séquence exacte "Work Orders by Status" (même avec des espaces variables)
  const sequencePattern = new RegExp(
    words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'),
    'gi'
  )
  out = out.replace(sequencePattern, finalWorkOrdersByStatusFr)
  
  // Dernier recours : remplacer mot par mot si la séquence complète est trouvée
  // Mais seulement si on trouve la séquence exacte
  if (out.toLowerCase().includes('work orders by status')) {
    // Remplacer toutes les occurrences de la séquence complète
    const finalPattern = /work\s+orders\s+by\s+status/gi
    out = out.replace(finalPattern, finalWorkOrdersByStatusFr)
  }
  
  return out
}

const translatedHtml = computed(() => translateReportHtml(reportData.value?.data?.html || ''))

const translatedReportTitle = computed(() => {
  const rawTitle = reportData.value?.data?.title
  if (!rawTitle) return t('reports.backOffice.workOrderReport')
  const normalized = translateReportHtml(rawTitle)
  return normalized || t('reports.backOffice.workOrderReport')
})

const formatDate = (date: Date): string => {
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTotalCount = (): number => {
  if (!reportData.value?.data?.summary) return 0;

  if (selectedReportType.value === 'workOrdersSummary') {
    return reportData.value.data.summary.statusSummary?.total || 0;
  }

  // Pour les autres types de rapports, compter les éléments
  if (Array.isArray(reportData.value.data.data)) {
    return reportData.value.data.data.length;
  }

  // Pour les rapports groupés, compter le total d'éléments
  if (typeof reportData.value.data.data === 'object') {
    return Object.values(reportData.value.data.data).reduce((total: number, items) => {
      return total + (Array.isArray(items) ? items.length : 0);
    }, 0);
  }

  return 0;
};

type GenericRow = Record<string, unknown>
const formatTableData = (): GenericRow[] => {
  if (!reportData.value?.data?.data) return [];

  // Si les données sont déjà un tableau
  if (Array.isArray(reportData.value.data.data)) {
    return reportData.value.data.data as GenericRow[];
  }

  // Si les données sont groupées (par statut, priorité, etc.)
  if (typeof reportData.value.data.data === 'object') {
    const flattenedData: GenericRow[] = [];

    Object.entries(reportData.value.data.data).forEach(([groupKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          flattenedData.push({
            ...item,
            groupBy: groupKey // Ajouter le critère de groupement
          });
        });
      }
    });

    return flattenedData;
  }

  return [];
};

interface TableColumn { key: string; label: string }
const getTableColumns = (): TableColumn[] => {
  const baseColumns: TableColumn[] = [
    { key: 'id', label: t('common.id') },
    { key: 'title', label: t('common.title') },
    { key: 'description', label: t('common.description') },
    { key: 'status', label: t('common.status') },
    { key: 'priority', label: t('common.priority') },
    { key: 'createdAt', label: t('common.createdAt') },
    { key: 'dueDate', label: t('common.dueDate') }
  ];

  // Ajouter des colonnes spécifiques selon le type de rapport
  switch (selectedReportType.value) {
    case 'workOrdersByStatus':
    case 'workOrdersByPriority':
      baseColumns.push({ key: 'groupBy', label: t('common.groupedBy') });
      break;
    case 'workOrdersByDepartment':
      baseColumns.push({ key: 'department', label: t('common.department') });
      break;
    case 'workOrdersByAssignee':
      baseColumns.push({ key: 'assignedToUser', label: t('common.assignedTo') });
      break;
    case 'workOrdersOverdue':
      baseColumns.push({ key: 'daysOverdue', label: t('workOrder.daysOverdue') });
      break;
    case 'workOrdersCompleted':
      baseColumns.push({ key: 'completedAt', label: t('common.completedAt') });
      baseColumns.push({ key: 'completionTime', label: t('workOrder.completionTime') });
      break;
  }

  return baseColumns;
};

const loadAvailableReports = async () => {
  try {
    const response = await getAvailableWorkOrderReports();
    if (response && response.success && response.data) {
      // Stocker les données brutes de l'API
      rawAvailableReports.value = response.data;
    } else {
      // Si la réponse n'est pas success, utiliser les données par défaut
      rawAvailableReports.value = getDefaultReports();
    }
  } catch (error) {
    console.error('Error loading available reports:', error);
    // Utiliser des données par défaut en cas d'erreur
    rawAvailableReports.value = getDefaultReports();
  }
};

// Fonction helper pour les rapports par défaut
const getDefaultReports = (): AvailableReport[] => [
  {
    id: 'workOrdersByStatus',
    name: t('workOrder.reports.byStatus'),
    description: t('workOrder.reports.byStatusDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersByPriority',
    name: t('workOrder.reports.byPriority'),
    description: t('workOrder.reports.byPriorityDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersByDepartment',
    name: t('workOrder.reports.byDepartment'),
    description: t('workOrder.reports.byDepartmentDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersByAssignee',
    name: t('workOrder.reports.byAssignee'),
    description: t('workOrder.reports.byAssigneeDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersOverdue',
    name: t('workOrder.reports.overdue'),
    description: t('workOrder.reports.overdueDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersCompleted',
    name: t('workOrder.reports.completed'),
    description: t('workOrder.reports.completedDesc'),
    category: 'Analytics'
  },
  {
    id: 'workOrdersSummary',
    name: t('workOrder.reports.summary'),
    description: t('workOrder.reports.summaryDesc'),
    category: 'Analytics'
  }
];

// Fonction pour traduire le texte directement dans le DOM
const translateDomText = () => {
  nextTick(() => {
    // Utiliser un délai pour s'assurer que le DOM est complètement rendu
    setTimeout(() => {
      const workOrdersByStatus = 'Work Orders by Status'
      const workOrdersByStatusFr = t('workOrder.reports.byStatus')
      
      // Chercher dans le conteneur du rapport
      const container = document.querySelector('.report-html-container')
      if (container) {
        // Parcourir tous les nœuds de texte dans le conteneur
        const walker = document.createTreeWalker(
          container,
          NodeFilter.SHOW_TEXT,
          null
        )
        
        const textNodes: Text[] = []
        let node
        while ((node = walker.nextNode())) {
          if (node.nodeValue && node.nodeValue.toLowerCase().includes(workOrdersByStatus.toLowerCase())) {
            textNodes.push(node as Text)
          }
        }
        
        // Remplacer le texte dans tous les nœuds trouvés
        textNodes.forEach(textNode => {
          if (textNode.nodeValue) {
            textNode.nodeValue = textNode.nodeValue.replace(
              /Work\s+Orders\s+by\s+Status/gi,
              workOrdersByStatusFr
            )
          }
        })
        
        // Aussi remplacer dans les attributs HTML du conteneur
        const allElements = container.querySelectorAll('*')
        allElements.forEach(el => {
          // Vérifier tous les attributs possibles
          const attrsToCheck = ['title', 'data-title', 'aria-label', 'alt', 'placeholder', 'label']
          attrsToCheck.forEach(attr => {
            const value = el.getAttribute(attr)
            if (value && value.toLowerCase().includes(workOrdersByStatus.toLowerCase())) {
              el.setAttribute(attr, value.replace(/Work\s+Orders\s+by\s+Status/gi, workOrdersByStatusFr))
            }
          })
        })
      }
      
      // Chercher aussi dans tout le document (pour les composants de tableau)
      const allTextNodes: Text[] = []
      const bodyWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Ignorer les scripts et styles
            const parent = node.parentElement
            if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
              return NodeFilter.FILTER_REJECT
            }
            return NodeFilter.FILTER_ACCEPT
          }
        }
      )
      
      let bodyNode
      while ((bodyNode = bodyWalker.nextNode())) {
        if (bodyNode.nodeValue && bodyNode.nodeValue.toLowerCase().includes(workOrdersByStatus.toLowerCase())) {
          allTextNodes.push(bodyNode as Text)
        }
      }
      
      // Remplacer le texte dans tous les nœuds trouvés
      allTextNodes.forEach(textNode => {
        if (textNode.nodeValue && textNode.nodeValue.toLowerCase().includes(workOrdersByStatus.toLowerCase())) {
          textNode.nodeValue = textNode.nodeValue.replace(
            /Work\s+Orders\s+by\s+Status/gi,
            workOrdersByStatusFr
          )
        }
      })
      
      // Remplacer dans tous les attributs HTML du document
      const allDocumentElements = document.querySelectorAll('*')
      allDocumentElements.forEach(el => {
        const attrsToCheck = ['title', 'data-title', 'aria-label', 'alt', 'placeholder', 'label']
        attrsToCheck.forEach(attr => {
          const value = el.getAttribute(attr)
          if (value && value.toLowerCase().includes(workOrdersByStatus.toLowerCase())) {
            el.setAttribute(attr, value.replace(/Work\s+Orders\s+by\s+Status/gi, workOrdersByStatusFr))
          }
        })
      })
    }, 100) // Délai de 100ms pour s'assurer que le DOM est rendu
  })
}

// Cycle de vie
onMounted(() => {
  console.log('=== WORK ORDER REPORTS COMPONENT MOUNTED ===');
  console.log('Hotel ID:', hotelId);
  loadAvailableReports();
  fetchUsers();
  fetchRooms();
  // Définir un type de rapport par défaut si disponible après chargement
  setTimeout(() => {
    if (availableReports.value && availableReports.value.length > 0 && !selectedReportType.value) {
      selectedReportType.value = availableReports.value[0].id;
    }
  }, 0);
  
  // Traduire le DOM après le montage
  translateDomText()
});

// Traduire le DOM après chaque mise à jour
onUpdated(() => {
  translateDomText()
});

// Watcher sur reportData pour retraduire quand les données changent
watch(() => reportData.value, () => {
  translateDomText()
}, { deep: true, immediate: false })
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

/* Styles pour les boutons d'action */
.action-button {
  transition: all 0.2s ease-in-out;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.action-button:active {
  transform: translateY(0);
}

/* Styles pour le conteneur du rapport */
.report-html-container {
  width: 100%;
}

.report-html-container table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.report-html-container th,
.report-html-container td {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.report-html-container th {
  background-color: #f9fafb;
  font-weight: 600;
}

.report-html-container tr:nth-child(even) {
  background-color: #f9fafb;
}

/* Adaptation pour le mode sombre */
.dark .report-html-container {
  color: #e5e7eb;
}

.dark .report-html-container th,
.dark .report-html-container td {
  border-color: #4b5563;
  color: #e5e7eb;
}

.dark .report-html-container th {
  background-color: #374151;
}

.dark .report-html-container tr:nth-child(even) {
  background-color: #374151;
}

/* Styles pour les badges de statut */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-in-progress {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-overdue {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Styles pour les badges de priorité */
.priority-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-low {
  background-color: #f3f4f6;
  color: #4b5563;
}

.priority-medium {
  background-color: #fef3c7;
  color: #92400e;
}

.priority-high {
  background-color: #fee2e2;
  color: #991b1b;
}

.priority-urgent {
  background-color: #fecaca;
  color: #7f1d1d;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Animation de chargement */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Styles pour les cartes de résumé */
.summary-card {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
}

.dark .summary-card {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  border: 1px solid #6b7280;
}

/* Responsive grid pour les options de rapport */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
