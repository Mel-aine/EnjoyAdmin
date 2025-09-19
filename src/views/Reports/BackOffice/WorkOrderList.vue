<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('Work Order Reports') }}
        </h1>
        <!-- <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.workOfficeReportDescription') }}
        </p> -->
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
              <option value="pending">{{ $t('workOrder.status.pending') }}</option>
              <option value="in_progress">{{ $t('workOrder.status.inProgress') }}</option>
              <option value="on_hold">{{ $t('workOrder.status.onHold') }}</option>
              <option value="completed">{{ $t('workOrder.status.completed') }}</option>
              <option value="cancelled">{{ $t('workOrder.status.cancelled') }}</option>
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
              <option value="low">{{ $t('common.low') }}</option>
              <option value="medium">{{ $t('common.medium') }}</option>
              <option value="high">{{ $t('common.high') }}</option>
              <option value="urgent">{{ $t('common.urgent') }}</option>
            </select>
          </div>
          
          <!-- Département -->
          <div>
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
          </div>
          
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
              <option v-for="user in staffMembers" :key="user.id" :value="user.id">
                {{ user.name }}
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
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.number }} - {{ room.type }}
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
              <option value="maintenance">{{ $t('workOrder.categories.maintenance') }}</option>
              <option value="cleaning">{{ $t('workOrder.categories.cleaning') }}</option>
              <option value="repair">{{ $t('workOrder.categories.repair') }}</option>
              <option value="inspection">{{ $t('workOrder.categories.inspection') }}</option>
            </select>
          </div>
          
          <!-- Créé par -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.createdBy') }}
            </label>
            <select 
              v-model="filters.createdBy"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="user in staffMembers" :key="user.id" :value="user.id">
                {{ user.name }}
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
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ report.description }}
                </p>
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
            {{ reportData?.data?.title || $t('Work Order Report') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ $t('common.generated') }}: {{ formatDate(new Date()) }}</span>
            <span v-if="reportData?.data?.summary" class="ml-4">
              {{ $t('common.total') }}: {{ getTotalCount() }}
            </span>
          </div>
        </div>
        
        <!-- Contenu HTML du rapport ou tableau -->
        <div v-if="reportData?.data?.html" v-html="reportData.data.html" class="report-html-container p-6"></div>
        
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
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.high') }}:</span>
                    <span class="font-medium text-red-600">{{ reportData.data.summary?.prioritySummary?.high || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.medium') }}:</span>
                    <span class="font-medium text-yellow-600">{{ reportData.data.summary?.prioritySummary?.medium || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.low') }}:</span>
                    <span class="font-medium text-gray-600">{{ reportData.data.summary?.prioritySummary?.low || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tableau pour les autres types de rapports -->
          <div v-else-if="reportData?.data?.data">
            <ResultTable 
              :title="reportData.data?.title || 'Rapport'"
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ReportsLayout from '@/components/layout/ReportsLayout.vue';
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue';
import ResultTable from '@/components/tables/ReusableTable.vue';
import { 
  getAvailableWorkOrderReports, 
  generateWorkOrderReport, 
  exportWorkOrderReport,
  type WorkOrderFilters,
  type WorkOrderReportResponse,
  type AvailableReport
} from '@/services/workOrderReportsApi.ts';
import { useServiceStore } from '@/composables/serviceStore';

const { t } = useI18n();

// Store
const serviceStore = useServiceStore();
const hotelId = serviceStore.serviceId;

// États réactifs
const loading = ref<boolean>(false);
const exportLoading = ref<boolean>(false);
const showResults = ref<boolean>(false);
const selectedReportType = ref<string>('');
const reportData = ref<WorkOrderReportResponse | null>(null);

// Données disponibles
const availableReports = ref<AvailableReport[]>([]);

const departments = ref([
  { id: 1, name: 'Maintenance' },
  { id: 2, name: 'Housekeeping' },
  { id: 3, name: 'Front Office' },
  { id: 4, name: 'Food & Beverage' },
  { id: 5, name: 'Security' }
]);

const staffMembers = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Wilson' }
]);

const rooms = ref([
  { id: 1, number: '101', type: 'Standard' },
  { id: 2, number: '102', type: 'Standard' },
  { id: 3, number: '201', type: 'Suite' },
  { id: 4, number: '202', type: 'Suite' },
  { id: 5, number: 'Lobby', type: 'Common Area' },
  { id: 6, number: 'Restaurant', type: 'F&B' }
]);

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
const selectReportType = (reportType: string) => {
  selectedReportType.value = reportType;
  showResults.value = false;
  reportData.value = null;
};

const resetFilters = () => {
  Object.assign(filters, {
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
  showResults.value = false;
  reportData.value = null;
};

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

const formatDate = (date: Date): string => {
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  showResults.value = false;
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

const formatTableData = (): any[] => {
  if (!reportData.value?.data?.data) return [];
  
  // Si les données sont déjà un tableau
  if (Array.isArray(reportData.value.data.data)) {
    return reportData.value.data.data;
  }
  
  // Si les données sont groupées (par statut, priorité, etc.)
  if (typeof reportData.value.data.data === 'object') {
    const flattenedData: any[] = [];
    
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

const getTableColumns = (): any[] => {
  const baseColumns = [
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
    if (response && response.success) {
      // Fournir un tableau vide comme fallback si response.data est undefined
      availableReports.value = response.data || [];
    } else {
      // Si la réponse n'est pas success, utiliser les données par défaut
      availableReports.value = getDefaultReports();
    }
  } catch (error) {
    console.error('Error loading available reports:', error);
    // Utiliser des données par défaut en cas d'erreur
    availableReports.value = getDefaultReports();
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

// Cycle de vie
onMounted(() => {
  console.log('=== WORK ORDER REPORTS COMPONENT MOUNTED ===');
  console.log('Hotel ID:', hotelId);
  loadAvailableReports();
});
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