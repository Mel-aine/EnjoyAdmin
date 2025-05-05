
<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end items-center pb-5">


        <!-- Bouton qui ouvre/ferme le dropdown -->
        <div class="relative">

            <button
              class="border border-gray-300 bg-purple-600 rounded-lg text-white px-4 py-2 flex items-center gap-2"
              @click="toggleDropdown"
            >
              <span>{{ $t('Actions') }}</span>
              <svg class="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z"/>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>

          <!-- Dropdown menu -->
          <div v-if="isDropdownOpen" class="z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-56 absolute right-0">
            <ul class="py-2 text-sm text-gray-700">
              <li>
                <button @click="openAddExpenseModal" class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                 {{ $t('addExpense') }}
                </button>
              </li>
              <li>
                <button @click="openImportModal" class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {{ $t('importExpense') }}
                </button>
              </li>
              <!-- <li>
                <button @click="openBudgetModal" class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Gérer les Budgets
                </button>
              </li> -->
              <!-- <li>
                <button @click="generateReport" class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Rapport Mensuel
                </button>
              </li> -->
            </ul>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="w-64">
            <!-- <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select v-model="filters.category" class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Toutes les catégories</option>
              <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select> -->
            
                <Select :lb="$t('category')" :options="expenseCategories"  v-model="filters.category"/>
              
          </div>

          <div class="w-64">
            <!-- <label class="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <select v-model="filters.department" class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Tous les départements</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select> -->
          
                <Select :lb="$t('department')" :options="departments"  v-model="filters.department"/>
              
          </div>

          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('period') }}</label>
            <div class="relative">
              <flat-pickr
                v-model="filters.dateRange"

                class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                :placeholder="$t('selectDate')"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
          </div>

          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Amount') }}</label>
            <div class="flex items-center gap-2">
              <input
                v-model="filters.minAmount"
                type="number"
                placeholder="Min"
                class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span>-</span>
              <input
                v-model="filters.maxAmount"
                type="number"
                placeholder="Max"
                class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div> 

          <div class="flex gap-2 ">
            <button class="h-10 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
              {{ $t('filter') }}
            </button>
            <button class="h-10 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
              {{ $t('reset') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Onglets pour différentes vues -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-3 px-4 font-medium text-sm inline-flex items-center',
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-2" />
              {{ tab.name }}
              <span v-if="tab.count" class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Table principale -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <ag-grid-vue
          class="ag-theme-quartz h-[600px]"
          :rowData="filteredExpenses"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          rowHeight="60"
          :rowSelection="'multiple'"
          :pagination="true"
          :paginationPageSize="10"
          @cellClicked="onCellClick"
          :autoSizeStrategy="autoSizeStrategy"

        />
      </div>
    </AdminLayout>

    <!-- Modal d'ajout de dépenses -->
    <Modal v-if="addExpenseModalOpen" @close="closeModal">
      <template #body>
        <div class="relative w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
          <!-- close btn -->
          <button
            @click.prevent="closeModal"
            class="absolute right-5 top-5 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div class="mb-6">
            <h4 class="text-2xl font-semibold text-gray-800">
              {{ isEditing ? $t('update') : $t('addExpense') }}
            </h4>
          </div>

          <form @submit.prevent="addExpense"  class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Select :lb="$t('supplier')" :options="Suppliers"  v-model="newExpense.supplierName"/>
              </div>

              <div>
                <Input :lb="$t('invoiceNumber')" :id="'number'" :forLabel="'number'" v-model="newExpense.invoiceNumber"/>
              </div>

              <div>
                <Select :lb="$t('category')" :options="expenseCategories"  v-model="newExpense.category"/>
              </div>

              <div>
                <Select :lb="$t('department')" :options="departments"  v-model="newExpense.department"/>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('invoiceDate') }}</label>
                <div class="relative">
                  <flat-pickr
                    v-model="newExpense.date"
                    :config="datePickerConfig"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                    :placeholder="$t('selectDate')"
                    required
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('expiryDate') }}</label>
                <div class="relative">
                  <flat-pickr
                    v-model="newExpense.dueDate"
                    :config="datePickerConfig"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                    :placeholder="$t('selectDate')"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('amountHT') }}</label>
                <div class="relative">
                  <input
                    v-model="newExpense.amountBeforeTax"
                    type="number"
                    step="0.01"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                    :placeholder="$t('amount...')"
                    required
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">FCFA</span>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">TVA (%)</label>
                <input
                  v-model="newExpense.taxRate"
                  type="number"
                  step="0.01"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('VATrate')"
                />
              </div>
              <div>
                <Select :lb="$t('Status')" :options="Status"  v-model="newExpense.status"/>
              </div>
              <div class="col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ $t('Description') }}</label>
                <textarea
                  v-model="newExpense.description"
                  class="w-full dark:bg-dark-900 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                  :placeholder="$t('description...')"
                  rows="3"
                ></textarea>
              </div>

              <!-- <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Pièce jointe</label>
                <div class="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <div class="flex flex-col items-center justify-center space-y-2">
                    <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-sm text-gray-500">Glissez-déposez un fichier ici ou <span class="text-purple-600">parcourir</span></p>
                    <input type="file" class="hidden" />
                  </div>
                </div>
              </div> -->
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click.prevent="closeModal"
                class="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
               {{ $t('Cancel') }}
              </button>
              <button
                type="submit"
                class="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <span v-if="!isLoading"> {{ isEditing ? $t('update') : $t('saveExpense') }}</span>
                  <span v-else class="flex items-center gap-2">
                    <Spinner class="w-4 h-4" />
                    {{ $t('Processing') }}...
                  </span>
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- Modal d'import de dépenses -->
    <Modal v-if="importModalOpen" @close="importModalOpen = false">
      <template #body>
        <div class="relative w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
          <button
            @click="importModalOpen = false"
            class="absolute right-5 top-5 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div class="mb-6">
            <h4 class="text-2xl font-semibold text-gray-800">
              {{ $t('importExpense') }}
            </h4>
            <p class="text-gray-500 mt-1">{{ $t('import...') }}</p>
          </div>

          <div class="space-y-6">
            <div class="border-2 border-dashed border-gray-300 rounded-md p-8">
              <div class="flex flex-col items-center justify-center space-y-3">
                <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-center text-gray-500">{{ $t('drag...') }} <span class="text-purple-600 cursor-pointer">{{ $t('run') }}</span> {{ $t('yourFile') }}</p>
                <p class="text-xs text-gray-400">{{ $t('acceptedFormat') }}: .csv, .xlsx, .xls</p>
                <input type="file" class="hidden" />
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-100 rounded-md p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm text-yellow-700">{{ $t('please...') }} :</p>
                  <ul class="text-xs text-yellow-600 mt-1 list-disc pl-5">
                    <li>{{ $t('supplier') }}</li>
                    <li>{{ $t('Amount') }}</li>
                    <li>{{ $t('Date') }}</li>
                    <li>{{ $t('category') }}</li>
                    <li>{{ $t('Description') }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <a href="#" class="text-sm text-purple-600 hover:text-purple-700">{{ $t('dowloadFile') }}</a>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="importModalOpen = false"
                class="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
               {{ $t('Cancel') }}
              </button>
              <button
                type="button"
                class="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {{ $t('import') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <ModalDelete v-if="show" @close="show = false"
      @delete="confirmDelete"
      :isLoading="loadingDelete"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted ,defineAsyncComponent,watch} from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useI18n } from "vue-i18n";
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { getDepartment,getSupplier,getCategory,getExpense,createExpense,deleteExpense,updateExpense} from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import { useToast } from 'vue-toastification';



// État de la page
const PageBreadcrumb = defineAsyncComponent(() => import('@/components/common/PageBreadcrumb.vue'));
const AdminLayout = defineAsyncComponent(() => import('@/components/layout/AdminLayout.vue'));
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'));
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'));
const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'));
const ModalDelete = defineAsyncComponent(() => import('@/components/modal/ModalDelete.vue'));
const currentPageTitle = computed(()=>t('expenseManagement'));
const isDropdownOpen = ref(false);
const addExpenseModalOpen = ref(false);
const { t, locale } = useI18n({ useScope: "global" });
const serviceStore = useServiceStore();
const importModalOpen = ref(false);
const expenseCategories =ref<any[]>([])
const departments = ref<any[]>([])
const Suppliers = ref<any[]>([])
const activeTab = ref('all');
const expenses = ref<any[]>([])
const toast = useToast()
const isLoading = ref(false)
const isEditing = ref(false)
const show = ref(false)
const loadingDelete = ref(false)
const selectedId = ref<number | null>(null)
const selected = ref<any>(null);
const Status = computed(() => [
  { label: t('paid'), value: 'paid' },
  { label: t('unpaid'), value: 'unpaid' },
  { label: t('pending'), value: 'pending' },
  { label: t('overdue'), value: 'overdue' }
]);


const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const openAddExpenseModal = () =>{
  addExpenseModalOpen.value = !addExpenseModalOpen.value
}

const openImportModal = () =>{
  importModalOpen.value = !importModalOpen.value
}

// const openBudgetModal = () =>{
//   budgetModalOpen.value = !budgetModalOpen.value
//}
// Configuration AG-Grid
const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}

// Données des dépenses
// const expenses = ref([
//   {
//     id: "#EXP001",
//     supplierName: "Connect Fast",
//     description: "Facture Internet et Téléphone",
//     category: "utilities",
//     categoryName: "Services Publics",
//     department: "administration",
//     departmentName: "Administration",
//     amount: 205000,
//     date: "2023-05-01",
//     dueDate: "2023-05-15",
//     status: "paid",
//     paymentMethod: "virement",
//     invoiceNumber: "INV-2023-001",
//     taxRate: 18,
//     amountBeforeTax: 173728,
//   },
//   {
//     id: "#EXP002",
//     supplierName: "Fresh Foods",
//     description: "Approvisionnement Cuisine - Fruits et Légumes",
//     category: "food",
//     categoryName: "Alimentation",
//     department: "kitchen",
//     departmentName: "Cuisine",
//     amount: 345000,
//     date: "2023-05-02",
//     dueDate: "2023-05-09",
//     status: "paid",
//     paymentMethod: "espèces",
//     invoiceNumber: "INV-2023-045",
//     taxRate: 0,
//     amountBeforeTax: 345000,
//   },
//   {
//     id: "#EXP003",
//     supplierName: "CleanPro Services",
//     description: "Services de Nettoyage - Avril 2023",
//     category: "cleaning",
//     categoryName: "Nettoyage",
//     department: "housekeeping",
//     departmentName: "Entretien",
//     amount: 450000,
//     date: "2023-05-03",
//     dueDate: "2023-05-17",
//     status: "pending",
//     paymentMethod: "chèque",
//     invoiceNumber: "INV-2023-078",
//     taxRate: 18,
//     amountBeforeTax: 381356,
//   },
//   {
//     id: "#EXP004",
//     supplierName: "Électricité du Cameroun",
//     description: "Facture Électricité - Avril 2023",
//     category: "utilities",
//     categoryName: "Services Publics",
//     department: "maintenance",
//     departmentName: "Maintenance",
//     amount: 780000,
//     date: "2023-05-04",
//     dueDate: "2023-05-20",
//     status: "paid",
//     paymentMethod: "virement",
//     invoiceNumber: "ELEC-2023-456",
//     taxRate: 5,
//     amountBeforeTax: 742857,
//   },
//   {
//     id: "#EXP005",
//     supplierName: "AquaPure",
//     description: "Approvisionnement en Eau Minérale",
//     category: "food",
//     categoryName: "Alimentation",
//     department: "kitchen",
//     departmentName: "Cuisine",
//     amount: 86000,
//     date: "2023-05-05",
//     dueDate: "2023-05-12",
//     status: "paid",
//     paymentMethod: "espèces",
//     invoiceNumber: "INV-2023-112",
//     taxRate: 0,
//     amountBeforeTax: 86000,
//   },
//   {
//     id: "#EXP006",
//     supplierName: "SécuriTech",
//     description: "Services de Sécurité - Avril 2023",
//     category: "security",
//     categoryName: "Sécurité",
//     department: "administration",
//     departmentName: "Administration",
//     amount: 520000,
//     date: "2023-05-06",
//     dueDate: "2023-05-21",
//     status: "overdue",
//     paymentMethod: "virement",
//     invoiceNumber: "SEC-2023-089",
//     taxRate: 18,
//     amountBeforeTax: 440678,
//   },
//   {
//     id: "#EXP007",
//     supplierName: "Tech Solutions",
//     description: "Maintenance Système de Réservation",
//     category: "tech",
//     categoryName: "Technologie",
//     department: "reception",
//     departmentName: "Réception",
//     amount: 175000,
//     date: "2023-05-07",
//     dueDate: "2023-05-22",
//     status: "pending",
//     paymentMethod: "chèque",
//     invoiceNumber: "TS-2023-345",
//     taxRate: 18,
//     amountBeforeTax: 148305,
//   },
//   {
//     id: "#EXP008",
//     supplierName: "Linge Luxe",
//     description: "Approvisionnement en Draps et Serviettes",
//     category: "supplies",
//     categoryName: "Fournitures",
//     department: "housekeeping",
//     departmentName: "Entretien",
//     amount: 630000,
//     date: "2023-05-08",
//     dueDate: "2023-05-23",
//     status: "pending",
//     paymentMethod: "virement",
//     invoiceNumber: "LL-2023-456",
//     taxRate: 18,
//     amountBeforeTax: 533898,
//   },
//   {
//     id: "#EXP009",
//     supplierName: "Décor Élégance",
//     description: "Rénovation Hall d'Entrée",
//     category: "renovation",
//     categoryName: "Rénovation",
//     department: "maintenance",
//     departmentName: "Maintenance",
//     amount: 1250000,
//     date: "2023-05-09",
//     dueDate: "2023-05-24",
//     status: "paid",
//     paymentMethod: "virement",
//     invoiceNumber: "DE-2023-789",
//     taxRate: 18,
//     amountBeforeTax: 1059322,
//   },
//   {
//     id: "#EXP010",
//     supplierName: "FoodSupply Pro",
//     description: "Approvisionnement Cuisine - Viandes et Poissons",
//     category: "food",
//     categoryName: "Alimentation",
//     department: "kitchen",
//     departmentName: "Cuisine",
//     amount: 890000,
//     date: "2023-05-10",
//     dueDate: "2023-05-17",
//     status: "pending",
//     paymentMethod: "chèque",
//     invoiceNumber: "FSP-2023-567",
//     taxRate: 0,
//     amountBeforeTax: 890000,
//   },
//   {
//     id: "#EXP011",
//     supplierName: "PubliMarket",
//     description: "Campagne Marketing Mai 2023",
//     category: "marketing",
//     categoryName: "Marketing",
//     department: "sales",
//     departmentName: "Ventes & Marketing",
//     amount: 480000,
//     date: "2023-05-11",
//     dueDate: "2023-05-26",
//     status: "pending",
//     paymentMethod: "virement",
//     invoiceNumber: "PM-2023-234",
//     taxRate: 18,
//     amountBeforeTax: 406780,
//   },
//   {
//     id: "#EXP012",
//     supplierName: "GasMaster",
//     description: "Approvisionnement en Gaz - Cuisine",
//     category: "utilities",
//     categoryName: "Services Publics",
//     department: "kitchen",
//     departmentName: "Cuisine",
//     amount: 120000,
//     date: "2023-05-12",
//     dueDate: "2023-05-19",
//     status: "paid",
//     paymentMethod: "espèces",
//     invoiceNumber: "GM-2023-123",
//     taxRate: 18,
//     amountBeforeTax: 101695,
//   },
// ]);

// Catégories de dépenses
// const expenseCategories = ref([
//   { id: 'utilities', name: 'Services Publics', icon: 'LightBulbIcon', color: 'bg-yellow-500' },
//   { id: 'food', name: 'Alimentation', icon: 'ShoppingBagIcon', color: 'bg-green-500' },
//   { id: 'cleaning', name: 'Nettoyage', icon: 'SparklesIcon', color: 'bg-blue-500' },
//   { id: 'security', name: 'Sécurité', icon: 'ShieldCheckIcon', color: 'bg-red-500' },
//   { id: 'tech', name: 'Technologie', icon: 'DesktopComputerIcon', color: 'bg-indigo-500' },
//   { id: 'supplies', name: 'Fournitures', icon: 'ArchiveIcon', color: 'bg-gray-500' },
//   { id: 'renovation', name: 'Rénovation', icon: 'HomeIcon', color: 'bg-purple-500' },
//   { id: 'marketing', name: 'Marketing', icon: 'SpeakerphoneIcon', color: 'bg-pink-500' },
//   { id: 'maintenance', name: 'Maintenance', icon: 'WrenchIcon', color: 'bg-orange-500' },
//   { id: 'others', name: 'Autres', icon: 'DotsHorizontalIcon', color: 'bg-gray-400' },
// ]);

// Départements de l'hôtel
// const departments = ref([
//   { id: 'administration', name: 'Administration', icon: 'OfficeBuildingIcon' },
//   { id: 'reception', name: 'Réception', icon: 'UserGroupIcon' },
//   { id: 'housekeeping', name: 'Entretien', icon: 'SparklesIcon' },
//   { id: 'kitchen', name: 'Cuisine', icon: 'CakeIcon' },
//   { id: 'restaurant', name: 'Restaurant', icon: 'CoffeeIcon' },
//   { id: 'maintenance', name: 'Maintenance', icon: 'WrenchIcon' },
//   { id: 'sales', name: 'Ventes & Marketing', icon: 'CurrencyDollarIcon' },
// ]);

// Onglets
const tabs = computed(()=>[
  { id: 'all', name: t('all'), icon: 'ViewListIcon', count: expenses.value.length },
  { id: 'pending', name: t('pending'), icon: 'ClockIcon', count: expenses.value.filter((e:any) => e.status === 'pending').length },
  { id: 'paid', name: t('paid'), icon: 'CheckCircleIcon', count: expenses.value.filter((e:any)=> e.status === 'paid').length },
  { id: 'overdue', name: t('overdue'), icon: 'ExclamationCircleIcon', count: expenses.value.filter((e:any) => e.status === 'overdue').length },
]);

// Filtres
const filters = ref({
  category: '',
  department: '',
  dateRange: '',
  minAmount: '',
  maxAmount: '',
  status: '',
  searchTerm: '',
});

// Nouvelle dépense
const newExpense = ref({
  supplierName: '',
  invoiceNumber: '',
  category: '',
  department: '',
  date: '',
  dueDate: '',
  description: '',
  amountBeforeTax: '',
  taxRate: 18,
  status: 'pending',
  paymentMethod: 'virement',
});



// Configuration Flatpickr
const datePickerConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'j F Y',
  locale: { firstDayOfWeek: 1 }
};



// Colonnes AG-Grid
const columnDefs = ref<ColDef[]>([

  {
    headerName: t('ID'),
    field: 'id',
    width: 120,
  },
  {
    headerName: t('supplier'),
    field: 'supplierName',
    width: 150,
  },
  {
    headerName: t('Description'),
    field: 'description',
    width: 200,
  },
  {
    headerName: t('category'),
    field: 'category',
    width: 140,
  },
  {
    headerName: t('department'),
    field: 'department',
    width: 150,
  },
  {
    headerName: t('Amount'),
    field: 'amountBeforeTax',
    width: 140,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return `<div class="font-medium">${formatCurrency(params.value)}</div>`;
    // },
  },
  {
    headerName: t('Date'),
    field: 'date',
    width: 120,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return formatDate(params.value);
    // },
  },
  {
    headerName: t('Duedate'),
    field: 'dueDate',
    width: 120,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return formatDate(params.value);
    // },
  },
  {
    headerName: t('Status'),
    field: 'status',
    width: 120,
    cellRenderer: (params: ICellRendererParams) => {
      const status = params.value;
      let statusClass = '';
      let statusText = '';

      if (status === 'paid') {
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'Payée';
      } else if (status === 'pending') {
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'En attente';
      } else if (status === 'overdue') {
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'En retard';
      }

      return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>`;
    },
  },
  {
    headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id),
    width: 120,
  },
]);

watch(() => locale.value, () => {
  columnDefs.value = [
  {
    headerName: t('ID'),
    field: 'id',
    width: 120,
  },
  {
    headerName: t('supplier'),
    field: 'supplierName',
    width: 150,
  },
  {
    headerName: t('Description'),
    field: 'description',
    width: 200,
  },
  {
    headerName: t('category'),
    field: 'category',
    width: 140,
  },
  {
    headerName: t('department'),
    field: 'department',
    width: 150,
  },
  {
    headerName: t('Amount'),
    field: 'amountBeforeTax',
    width: 140,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return `<div class="font-medium">${formatCurrency(params.value)}</div>`;
    // },
  },
  {
    headerName: t('Date'),
    field: 'date',
    width: 120,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return formatDate(params.value);
    // },
  },
  {
    headerName: t('Duedate'),
    field: 'dueDate',
    width: 120,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return formatDate(params.value);
    // },
  },
  {
    headerName: t('Status'),
    field: 'status',
    width: 120,
    cellRenderer: (params: ICellRendererParams) => {
      const status = params.value;
      let statusClass = '';
      let statusText = '';

      if (status === 'paid') {
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'Payée';
      } else if (status === 'pending') {
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'En attente';
      } else if (status === 'overdue') {
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'En retard';
      }

      return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>`;
    },
  },
  {
    headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id),
    width: 120,
  },

  ]})


function getActionButtons(id: number): string {
  return `
    <div class="flex space-x-2 mt-2">
        <button class="p-1" data-action="edit" data-id="${id}">
          <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
            <line x1="16" y1="5" x2="19" y2="8" />
          </svg>
        </button>
        <button class="p-1" data-action="delete" data-id="${id}">
          <svg class="h-5 w-5 text-red-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </button>
      </div>
  `;
}

const onCellClick = (event: any) => {
  console.log('Cell clicked:', event.data);
  const button = event.event.target.closest('button');
  console.log('Button clicked:', button);

  // Gestion des actions (édition, suppression, affichage)
  if (event.colDef.headerName === 'Actions') {
    // const action = (event.event as MouseEvent).target?.closest('button')?.getAttribute('data-action');
    if (!button) {
    console.error('No button found');
    return;
  }

  const action = button.dataset.action;
  const id = button.dataset.id;
  console.log('Button clickedid:', id);

    if (action === 'edit') {
      const expensetEdit = expenses.value.find((r: any) => r.id == id);
      console.log("expensetEdit",expensetEdit)
      if(expensetEdit){
        selected.value = expensetEdit;
        newExpense.value.supplierName = expensetEdit.supplierName;
        newExpense.value.invoiceNumber = expensetEdit.invoiceNumber;
        newExpense.value.category = expensetEdit.category;
        newExpense.value.department = expensetEdit.department;
        newExpense.value.date = expensetEdit.date;
        newExpense.value.dueDate = expensetEdit.dueDate;
        newExpense.value.description = expensetEdit.description;
        newExpense.value.amountBeforeTax = expensetEdit.amountBeforeTax;
        newExpense.value.taxRate = expensetEdit.taxRate ?? 18;
        newExpense.value.status = expensetEdit.status ?? 'pending';
        // newExpense.value.paymentMethod = expensetEdit.payment_method ?? 'virement';

      }
      addExpenseModalOpen.value = true
      isEditing.value = true
    }else if (action === 'delete'){
      selectedId.value = id
      show.value = true
    }
  }
};

const updateData = async () => {
  isLoading.value = true;

  try {
    const serviceId = serviceStore.serviceId;
    const id = selected.value?.id;

    if (!id) {
      toast.error(t('toast.selectError'));
      return;
    }

    const Payload = {
      service_id: serviceId,
      supplier_name:newExpense.value.supplierName,
      invoice_number:newExpense.value.invoiceNumber,
      category:newExpense.value.category,
      department:newExpense.value.department,
      date:newExpense.value.date,
      due_date : newExpense.value.dueDate,
      description:newExpense.value.description,
      amount_before_tax : newExpense.value.amountBeforeTax,
      tax_rate : newExpense.value.taxRate,
      payment_method: 'virement',
      status : newExpense.value.status,


    };

    await updateExpense(id, Payload);

     newExpense.value = {
      supplierName: '',
      invoiceNumber: '',
      category: '',
      department: '',
      date: '',
      dueDate: '',
      description: '',
      amountBeforeTax: '',
      taxRate: 18,
      status: '',
      paymentMethod: 'virement',
    };

    selected.value = null;
    isEditing.value = false;
    addExpenseModalOpen.value = false;

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);

  } finally {
    isLoading.value = false;
  }
};



// Dépenses filtrées en fonction de l'onglet actif
const filteredExpenses = computed(() => {
  let result = [...expenses.value];

  if (activeTab.value === 'pending') {
    result = result.filter(expense => expense.status === 'pending');
  } else if (activeTab.value === 'paid') {
    result = result.filter(expense => expense.status === 'paid');
  } else if (activeTab.value === 'overdue') {
    result = result.filter(expense => expense.status === 'overdue');
  }

  // Appliquer les filtres supplémentaires
  if (filters.value.category) {
    result = result.filter(expense => expense.category === filters.value.category);
  }

  if (filters.value.department) {
    result = result.filter(expense => expense.department === filters.value.department);
  }

  if (filters.value.minAmount) {
    result = result.filter(expense => expense.amountBeforeTax >= Number(filters.value.minAmount));
  }

  if (filters.value.maxAmount) {
    result = result.filter(expense => expense.amountBeforeTax <= Number(filters.value.maxAmount));
  }

  if (filters.value.dateRange) {
    result = result.filter(expense => expense.date <= Number(filters.value.dateRange));
  }

  return result;
});

onMounted(async() => {
  const serviceId = serviceStore.serviceId;
  try {

     const response = await getDepartment(serviceId);
     departments.value = response.data.map((d:any)=>({
      label:d.name,
      value:d.name
     }));
     console.log('dpt',departments.value)

     const responseData = await getCategory(serviceId);
     expenseCategories.value = responseData.data.map((c:any)=>({
      label:c.name,
      value:c.name
     }));

     const responseDatas = await getSupplier(serviceId);
     Suppliers.value = responseDatas.data.map((s:any)=>({
      label:s.name,
      value:s.name
     }));

     const responseExpense = await getExpense(serviceId);
     expenses.value = responseExpense.data
     

  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
});

const addExpense = async () => {
  isLoading.value=true
  const serviceId = serviceStore.serviceId;
  try {
  
    if (isEditing.value) {
       await updateData()
       toast.success(t('toast.SucessUpdate'));

    } else {
    const payload = {
      supplier_name: newExpense.value.supplierName,
      invoice_number: newExpense.value.invoiceNumber,
      category: newExpense.value.category,
      department: newExpense.value.department,
      date: newExpense.value.date,
      due_date: newExpense.value.dueDate,
      description: newExpense.value.description,
      amount_before_tax: parseFloat(newExpense.value.amountBeforeTax), 
      tax_rate: newExpense.value.taxRate,
      status: newExpense.value.status,
      payment_method: newExpense.value.paymentMethod,
      service_id : serviceId
    };
    console.log("bbb",payload)
    await createExpense(payload); 
    closeModal()
    toast.success(t('toast.Sucess'));
    // Optionnel : toast, reset form, fermeture modale, etc.
  }
} catch (error) {
    console.error('Erreur lors de l’ajout de la dépense :', error);
    toast.error(t('toast.error'));
  }finally{
    isLoading.value=false
  }
};

const closeModal = () => {
  addExpenseModalOpen.value = false;
  isEditing.value=false
  newExpense.value ={
  supplierName: '',
  invoiceNumber: '',
  category: '',
  department: '',
  date: '',
  dueDate: '',
  description: '',
  amountBeforeTax: '',
  taxRate: 18,
  status: '',
  paymentMethod: 'virement',
};
};


const confirmDelete = async () => {
  if (selectedId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteExpense(selectedId.value)
      toast.success(t('toast.DeletedSuccess'))
      expenses.value = expenses.value.filter((r: any) => r.id !== selectedId.value);
      console.log(`Suppression du room type ID: ${selectedId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(t('toast.userDeleteError'))
    } finally {
      loadingDelete.value = false
      show.value = false
      selectedId.value = null
    }
  }
}
</script>
