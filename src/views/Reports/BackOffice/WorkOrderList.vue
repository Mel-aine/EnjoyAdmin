<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('Work Order List') }}
        </h1>
        <!-- <p class="text-gray-600 dark:text-gray-400">
          {{ $t('reports.backOffice.workOfficeReportDescription') }}
        </p> -->
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('common.filters') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Date de création -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.createdFrom') }}
            </label>
            <InputDatepicker 
              :model-value="filters.createdFrom"
              :placeholder="'From'"
              class="w-full"
              @update:modelValue="updateDateFilter('createdFrom', $event)"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.to') }}
            </label>
            <InputDatepicker 
              :model-value="filters.createdTo"
              :placeholder="'To'"
              class="w-full"
              @update:modelValue="updateDateFilter('createdTo', $event)"
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
              <option value="open">{{ $t('workOrder.status.open') }}</option>
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
          
          <!-- Type de bon de travail -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select 
              v-model="filters.workOrderType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="type in workOrderTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          
          <!-- Unit -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unit
            </label>
            <select 
              v-model="filters.unit"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ $t('common.select') }}</option>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">
                {{ unit.name }}
              </option>
            </select>
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
            class="inline-flex justify-center items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-24"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ $t('common.report') }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('Work Order List') }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{{ $t('common.dateFrom') }}: {{ filters.createdFrom || $t('common.none') }}</span> • 
            <span>{{ $t('common.to') }}: {{ filters.createdTo || $t('common.none') }}</span> • 
            <span>{{ $t('common.status') }}: {{ filters.status ? $t(`workOrder.status.${filters.status}`) : $t('common.all') }}</span>
          </div>
        </div>
        
        <!-- Work Orders Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.id') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.title') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.priority') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.assignedTo') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('common.dueDate') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="order in workOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ order.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ $t(`workOrder.status.${order.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ $t(`common.${order.priority}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ getAssignedToName(order.assignedTo) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(order.dueDate) }}
                </td>
              </tr>
              <tr v-if="workOrders.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {{ $t('common.noDataAvailable') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Row -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>{{ $t('common.total') }}: {{ workOrders.length }} {{ $t('common.workOrders') }}</div>
            <div v-if="filters.status">{{ $t(`workOrder.status.${filters.status}`) }}: {{ getStatusCount(filters.status) }}</div>
          </div>
        </div>
      </div>
    </div>
  </ReportsLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ReportsLayout from '@/components/layout/ReportsLayout.vue';
import InputDatepicker from '@/components/forms/FormElements/InputDatePicker.vue';

const { t } = useI18n();

// Types
interface StaffMember {
  id: string;
  name: string;
}

interface WorkOrderType {
  id: string;
  name: string;
}

interface Unit {
  id: string;
  name: string;
}

interface Filters {
  createdFrom: string;
  createdTo: string;
  status: string;
  priority: string;
  assignedTo: string;
  workOrderType: string;
  unit: string;
  [key: string]: string; // Signature d'index pour permettre l'accès par chaîne de caractères
}

// Reactive data
const showResults = ref(false);
const filters = reactive<Filters>({
  createdFrom: '',
  createdTo: '',
  status: '',
  priority: '',
  assignedTo: '',
  workOrderType: '',
  unit: ''
});

const staffMembers = ref<StaffMember[]>([
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' }
]);

const workOrderTypes = ref<WorkOrderType[]>([
  { id: 'maintenance', name: t('workOrder.types.maintenance') },
  { id: 'cleaning', name: t('workOrder.types.cleaning') },
  { id: 'repair', name: t('workOrder.types.repair') },
  { id: 'inspection', name: t('workOrder.types.inspection') }
]);

const units = ref<Unit[]>([
  { id: '1', name: 'Unit 101' },
  { id: '2', name: 'Unit 102' },
  { id: '3', name: 'Unit 201' },
  { id: '4', name: 'Unit 202' },
  { id: '5', name: 'Reception' },
  { id: '6', name: 'Restaurant' },
  { id: '7', name: 'Spa' },
  { id: '8', name: 'Gym' }
]);

// Sample work orders data - replace with actual API call
const workOrders = ref([
  {
    id: 'WO-001',
    title: 'Leaking faucet in bathroom',
    status: 'open',
    priority: 'medium',
    assignedTo: '1',
    dueDate: '2023-06-15',
    description: 'The faucet in the bathroom is leaking and needs to be fixed.'
  },
  {
    id: 'WO-002',
    title: 'AC not working in room 205',
    status: 'in_progress',
    priority: 'high',
    assignedTo: '2',
    dueDate: '2023-06-10',
    description: 'Guest reported that the AC is not cooling properly.'
  },
  {
    id: 'WO-003',
    title: 'TV remote not working',
    status: 'completed',
    priority: 'low',
    assignedTo: '1',
    dueDate: '2023-06-05',
    description: 'Guest reported that the TV remote is not working.'
  },
  {
    id: 'WO-004',
    title: 'Toilet clogged',
    status: 'open',
    priority: 'high',
    assignedTo: '3',
    dueDate: '2023-06-12',
    description: 'Guest reported that the toilet is clogged.'
  }
]);

// Methods
const resetFilters = () => {
  Object.assign(filters, {
    createdFrom: '',
    createdTo: '',
    status: '',
    priority: '',
    assignedTo: '',
    workOrderType: '',
    unit: ''
  });
  showResults.value = false;
};

const searchWorkOrders = () => {
  // TODO: Implement search functionality
  console.log('Searching work orders with filters:', filters);
  showResults.value = true;
};

const updateDateFilter = (field: string, value: string) => {
  filters[field] = value;
};

const generateReport = () => {
  // TODO: Implement report generation
  console.log('Generating report with filters:', filters);
  showResults.value = true;
};

// Helper methods for the results section
const getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'open': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'on_hold': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getAssignedToName = (userId: string) => {
  const user = staffMembers.value.find(user => user.id === userId);
  return user ? user.name : 'Unassigned';
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const getStatusCount = (status: string) => {
  return workOrders.value.filter(order => order.status === status).length;
};

// Cycle de vie
onMounted(() => {
  console.log('=== WORK OFFICE REPORT COMPONENT MOUNTED ===');
  console.log('Current route:', window.location.pathname);
  console.log('i18n ready:', t('reports.backOffice.workOfficeReport'));
  console.log('==========================================');
});
</script>

<style scoped>
/* Add styles here when needed */
</style>
