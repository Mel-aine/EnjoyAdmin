<template>
  <ReportsLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('Work Order List') }}
        </h1>
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

// Données réactives
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

// Méthodes
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
};

const searchWorkOrders = () => {
  console.log('Recherche avec les filtres :', filters);
  // TODO: Implémenter la logique de recherche avec les filtres
  // Par exemple : appeler une API ou filtrer des données locales
};

const updateDateFilter = (field: string, value: string) => {
  filters[field] = value;
};

const generateReport = () => {
  console.log('Génération du rapport avec les filtres :', filters);
  // TODO: Implémenter la logique de génération du rapport
  // Par exemple : exporter en PDF, Excel, ou afficher un aperçu
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
