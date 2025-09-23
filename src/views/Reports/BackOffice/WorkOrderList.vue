<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('reports.backOffice.workOfficeReport') }}
        </h1>
        <!-- <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.workOfficeReportDescription') }}
        </p> -->
      </div>

      <!-- Filtres et Type de rapport combinés -->
      <div class="p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <!-- Date de début -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('common.startDate') }}
            </label>
            <InputDatepicker 
              v-model="filters.startDate"
              :placeholder="$t('selectDate')"
              class="w-full"
            />
          </div>
          
          <!-- Date de fin -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('common.endDate') }}
            </label>
            <InputDatepicker 
              v-model="filters.endDate"
              :placeholder="$t('selectDate')"
              class="w-full"
            />
          </div>
          
          <!-- Statut -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('status') }}
            </label>
            <select 
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('select') }}</option>
              <option value="pending">{{ $t('pending') }}</option>
              <option value="in_progress">{{ $t('in Progress') }}</option>
              <option value="on_hold">{{ $t('on Hold') }}</option>
              <option value="completed">{{ $t('completed') }}</option>
              <option value="cancelled">{{ $t('cancelled') }}</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
          <!-- Priorité -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('common.priority') }}
            </label>
            <select 
              v-model="filters.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option value="low">{{ $t('low') }}</option>
              <option value="medium">{{ $t('medium') }}</option>
              <option value="high">{{ $t('high') }}</option>
              <option value="urgent">{{ $t('urgent') }}</option>
            </select>
          </div>
          
          <!-- Département -->
   <!--        <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('common.department') }}
            </label>
            <select 
              v-model="filters.departmentId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
          </div> -->
          
          <!-- Assigné à -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('common.assignedTo') }}
            </label>
            <select 
              v-model="filters.assignedTo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="user in userOptions" :key="user.id" :value="user.id">
                {{ user.label }}
              </option>
            </select>
          </div>
          
          <!-- Chambre -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('common.room') }}
            </label>
            <select 
              v-model="filters.roomId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="room in roomOptions" :key="room.id" :value="room.id">
                {{ room.label }} - {{ room.type }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <!-- Catégorie -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('common.category') }}
            </label>
            <select 
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option value="maintenance">{{ $t('wmaintenance') }}</option>
              <option value="cleaning">{{ $t('cleaning') }}</option>
              <option value="repair">{{ $t('repair') }}</option>
              <option value="inspection">{{ $t('inspection') }}</option>
            </select>
          </div>
          
          <!-- Créé par -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('User') }}
            </label>
            <select 
              v-model="filters.createdBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="user in userOptions" :key="user.id" :value="user.id">
                {{ user.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Type de rapport - Version simplifiée -->
        <div class="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('common.reportType') }}
          </h2>
          
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div v-for="report in availableReports" :key="report.id" class="flex items-start">
              <input 
                type="radio" 
                :id="report.id"
                :value="report.id"
                v-model="selectedReportType"
                class="w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              >
              <label :for="report.id" class="ml-2 text-sm text-gray-900 cursor-pointer dark:text-white">
                <span class="font-medium">{{ report.name }}</span>
            
              </label>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col items-center justify-end gap-4 pt-5 mt-5 border-t border-gray-200 sm:flex-row dark:border-gray-700">
          <!-- Bouton Réinitialiser -->
          <button 
            @click="resetFilters"
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
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
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
          >
            <svg v-if="loading" class="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      <div v-if="showResults" class="mb-6 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <!-- En-tête du rapport -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ reportData?.data?.title || $t('Work Order Report') }}
          </h2>
          <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ $t('common.generated') }}: {{ formatDate(new Date()) }}</span>
            <span v-if="reportData?.data?.summary" class="ml-4">
              {{ $t('common.total') }}: {{ getTotalCount() }}
            </span>
          </div>
        </div>
        
        <!-- Contenu HTML du rapport ou tableau -->
        <div v-if="reportData?.data?.html" v-html="reportData.data.html" class="p-6 report-html-container"></div>
        
        <!-- Affichage du rapport en fonction du type -->
        <div v-else class="p-6">
          <!-- Rapport de synthèse -->
          <div v-if="selectedReportType === 'workOrdersSummary' && reportData?.data">
            <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
              <!-- Résumé par statut -->
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <h3 class="mb-3 font-semibold text-gray-900 text-md dark:text-white">
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
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <h3 class="mb-3 font-semibold text-gray-900 text-md dark:text-white">
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
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
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

// Données disponibles
const availableReports = ref<AvailableReport[]>([]);

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
    name: t('By Status'),
    description: t('By StatusDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersByPriority',
    name: t('By Priority'),
    description: t('workOrder.reports.byPriorityDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersByDepartment',
    name: t('By Department'),
    description: t('workOrder.reports.byDepartmentDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersByAssignee',
    name: t('By Assignee'),
    description: t('workOrder.reports.byAssigneeDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersOverdue',
    name: t('Overdue'),
    description: t('workOrder.reports.overdueDesc'),
    category: 'Operations'
  },
  {
    id: 'workOrdersCompleted',
    name: t('Completed'),
    description: t('workOrder.reports.completedDesc'),
    category: 'Analytics'
  },
  {
    id: 'workOrdersSummary',
    name: t('Summary'),
    description: t('workOrder.reports.summaryDesc'),
    category: 'Analytics'
  }
];

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
});
</script>

<style scoped>
/* Add styles here when needed */
</style>
