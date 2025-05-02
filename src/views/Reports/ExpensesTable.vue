<!-- <template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5">

        <button
        class="border border-gray-300 bg-purple-400 rounded-lg relative"
        @click="toggleDropdown"
        >
        <svg class="h-8 w-8 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div v-if="isDropdownOpen" class="z-10 mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <button @click="modalOpen=true" class="block px-4 py-2  hover:text-purple-600 dark:hover:text-white">Add Expense </button>
          </li>
          <li>
            <button class="block px-4 py-2 hover:text-purple-600 dark:hover:text-white">Import</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="space-y-5 sm:space-y-6 h-screen">
      <ag-grid-vue class="ag-theme-quartz" :rowData="roomTypeData" :columnDefs="columnDefs" rowHeight="50"
      :rowSelection="'single'"  :domLayout="'autoHeight'"
      :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady" :autoSizeStrategy="autoSizeStrategy"
      @selectionChanged="getSelectedRows" :defaultColDef="defaultColDef"></ag-grid-vue>
    </div>
  </AdminLayout>
  <Modal v-if="modalOpen" @close="modalOpen = false">
    <template #body>
      <div
      class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >

      <button
      @click="modalOpen = false"
      class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
      >
      <svg
      class="fill-current"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      >
      <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
      fill=""
      />
    </svg>
  </button>
  <div class="px-2 pr-14">
    <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
      Add Expenses
    </h4>

  </div>
  <form class="flex flex-col">
    <div class="custom-scrollbar h-[200px] overflow-y-auto p-2">
      <div>
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div>
            <Input :lb="'Supplier Name'"  :placeholder="'Supplier Name'" :id="'name'" :forLabel="'name'" />
          </div>

          <div>
            <Input :lb="'Description'"  :placeholder="'Description'" :id="'rent'" :forLabel="'rent'" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Date
            </label>
            <div class="relative">
              <flat-pickr
              v-model="date"
              :config="flatpickrConfig"
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              placeholder="Select date"
              />
              <span
              class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
              >
              <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              >
              <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
              fill=""
              />
            </svg>
          </span>
        </div>
      </div>
      <div>
        <Input :lb="'Amount'"  :placeholder="'100000 FCFA'" :id="'code'" :forLabel="'code'" />
      </div>

    </div>
  </div>

</div>
<div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
  <button
  @click="modalOpen = false"
  type="button"
  class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
  >
  Cancel
</button>
<button

type="button"
class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
>
Add Expenses
</button>
</div>
</form>
</div>
</template>
</Modal>
</div>
</template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';



const modalOpen = ref(false)
const currentPageTitle = ref("Expenses Details");
const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};


const columnDefs = ref<ColDef[]>([
{ headerName: 'ID', field: 'id' ,
checkboxSelection: true,
headerCheckboxSelection: true
},
{
  headerName: 'Supplier Name',
  field: 'name',
},
{ headerName: 'Description', field: 'description' },
{ headerName: 'Date', field: 'date' },
{ headerName: 'Amount', field: 'amount' },
{
  headerName: 'Actions',
  cellRenderer: () => `
                <div>
                    <button class="bg-purple-500 text-white px-2 rounded mt-1 mx-1 action-btn" data-action="download">
                        Edit
                    </button>
                    <button class="bg-orange-500 text-white px-2 rounded mt-1 mx-1 action-btn" data-action="delete">
                        Delete
                    </button>
                </div>
            `,
},

]);



const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};

const onCellClick = (event: CellClickedEvent) => {
  console.log('Cell clicked:', event.data);
};

const getSelectedRows = (event: SelectionChangedEvent) => {
  const selected = event.api.getSelectedRows();
  console.log('Selected row:', selected);
};

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}
const roomTypeData = [
{
  "id": "#565601",
  "name": "Connect Fast",
  "description": "Telephone Bill",
  "amount": "205000",
  "date" : "01 Jan 2021",
},
{
  "id": "#658742",
  "name": "Connect Fast",
  "description": "Telephone Bill",
  "amount": "15000 FCFA",
  "date" : "01 Jan 2021",
},
{
  "id": "#658882",
  "name": "Easy Shop",
  "description": "Food Transport Bill",
  "amount": "25000 FCFA",
  "date" : "01 Jan 2021",
},
{
  "id": "#659982",
  "name": "Fast Delivery",
  "description": "Food Delivery",
  "amount": "80000 FCFA",
  "date" : "01 Jan 2021",
},
{
  "id": "#657782",
  "name": "Buy Best",
  "description": "Kitchen Furniture Bill",
  "amount": "20000 FCFA",
  "date" : "01 Jan 2021",
},
{
  "id": "#653482",
  "name": "Connect Fast",
  "description": "Telephone Bill",
  "date" : "01 Jan 2021",
  "amount": "12000 FCFA",

},
];

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
const date =ref('')
const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

</script>

<style scoped>
/* Add any additional styles here if needed */
</style> -->
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
              <span>Actions</span>
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
                  Ajouter une Dépense
                </button>
              </li>
              <li>
                <button @click="openImportModal" class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-purple-50 hover:text-purple-600">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Importer des Dépenses
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select v-model="filters.category" class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Toutes les catégories</option>
              <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <select v-model="filters.department" class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Tous les départements</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <div class="relative">
              <flat-pickr
                v-model="filters.dateRange"

                class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Sélectionner une période"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
          </div>

          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Montant</label>
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

          <div class="flex gap-2">
            <button class="h-10 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
              Filtrer
            </button>
            <button class="h-10 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Réinitialiser
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


        />
      </div>

      <!-- Récapitulatif en bas de la page
      <div class="mt-6 grid grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Dépenses par Catégorie</h3>
          <div class="h-64">
             Ici, on mettrait un composant de chart
            <div class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
               Placeholder pour le graphique
              <span class="text-gray-400">Graphique des dépenses par catégorie</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Évolution Mensuelle</h3>
          <div class="h-64">
            Ici, on mettrait un composant de chart
            <div class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
             Placeholder pour le graphique
              <span class="text-gray-400">Graphique de l'évolution des dépenses</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Dépenses Récentes</h3>
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="expense in recentExpenses" :key="expense.id" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div>
                <p class="font-medium text-gray-800">{{ expense.name }}</p>
                <p class="text-sm text-gray-500">{{ expense.date }}</p>
              </div>
              <div>
                <p class="text-right font-medium" >
                   {{ formatCurrency(expense.amount) }}:class="getAmountColorClass(expense.amount)"
                </p>
                <p class="text-sm text-gray-500">{{ expense.category }}</p>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </AdminLayout>

    <!-- Modal d'ajout de dépenses -->
    <Modal v-if="addExpenseModalOpen" @close="addExpenseModalOpen = false">
      <template #body>
        <div class="relative w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
          <!-- close btn -->
          <button
            @click="addExpenseModalOpen = false"
            class="absolute right-5 top-5 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div class="mb-6">
            <h4 class="text-2xl font-semibold text-gray-800">
              Ajouter une Dépense
            </h4>
          </div>

          <form  class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <input
                  v-model="newExpense.supplierName"
                  type="text"
                  class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nom du fournisseur"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de Facture</label>
                <input
                  v-model="newExpense.invoiceNumber"
                  type="text"
                  class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Numéro de facture"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  v-model="newExpense.category"
                  class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="" disabled>Sélectionner une catégorie</option>
                  <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Département</label>
                <select
                  v-model="newExpense.department"
                  class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="" disabled>Sélectionner un département</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date de Facture</label>
                <div class="relative">
                  <flat-pickr
                    v-model="newExpense.date"
                    :config="datePickerConfig"
                    class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Sélectionner une date"
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Date d'Échéance</label>
                <div class="relative">
                  <flat-pickr
                    v-model="newExpense.dueDate"
                    :config="datePickerConfig"
                    class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Sélectionner une date"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Montant HT</label>
                <div class="relative">
                  <input
                    v-model="newExpense.amountBeforeTax"
                    type="number"
                    step="0.01"
                    class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Montant hors taxes"
                    required
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">FCFA</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">TVA (%)</label>
                <input
                  v-model="newExpense.taxRate"
                  type="number"
                  step="0.01"
                  class="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Taux de TVA"
                />
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="newExpense.description"
                  class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Description détaillée de la dépense"
                  rows="3"
                ></textarea>
              </div>

              <div class="col-span-2">
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
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="addExpenseModalOpen = false"
                class="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Enregistrer la Dépense
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
              Importer des Dépenses
            </h4>
            <p class="text-gray-500 mt-1">Importez un fichier CSV ou Excel contenant vos dépenses</p>
          </div>

          <div class="space-y-6">
            <div class="border-2 border-dashed border-gray-300 rounded-md p-8">
              <div class="flex flex-col items-center justify-center space-y-3">
                <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-center text-gray-500">Glissez-déposez votre fichier ici ou <span class="text-purple-600 cursor-pointer">parcourir</span> vos fichiers</p>
                <p class="text-xs text-gray-400">Formats acceptés: .csv, .xlsx, .xls</p>
                <input type="file" class="hidden" />
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-100 rounded-md p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm text-yellow-700">Veuillez vous assurer que votre fichier contient les colonnes suivantes :</p>
                  <ul class="text-xs text-yellow-600 mt-1 list-disc pl-5">
                    <li>Fournisseur</li>
                    <li>Montant</li>
                    <li>Date</li>
                    <li>Catégorie</li>
                    <li>Description</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <a href="#" class="text-sm text-purple-600 hover:text-purple-700">Télécharger un modèle de fichier</a>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="importModalOpen = false"
                class="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                class="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Modal de gestion des budgets
    <Modal v-if="budgetModalOpen" @close="budgetModalOpen = false">
      <template #body>
        <div class="relative w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
          <button
            @click="budgetModalOpen = false"
            class="absolute right-5 top-5 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div class="mb-6">
            <h4 class="text-2xl font-semibold text-gray-800">
              Gestion des Budgets
            </h4>
            <p class="text-gray-500 mt-1">Configurez les budgets par département et par catégorie</p>
          </div>

          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h5 class="font-medium text-gray-700">Budgets par Catégorie</h5>
              <button class="text-sm text-purple-600 hover:text-purple-700">+ Ajouter une catégorie</button>
            </div>

            <div class="space-y-4 max-h-64 overflow-y-auto">
              <div v-for="(budget, index) in categoryBudgets" :key="index" class="bg-gray-50 p-3 rounded-md">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium">{{ budget.name }}</span>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="budget.amount"
                      type="number"
                      class="w-32 h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span class="text-sm text-gray-500">FCFA</span>
                  </div>
                </div>
                <div class="relative pt-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-xs font-semibold inline-block text-purple-600">
                        {{ budget.used }} / {{ budget.amount }} FCFA
                      </span>
                    </div>
                    <div class="text-right">
                      <span class="text-xs font-semibold inline-block text-purple-600">
                        {{ Math.round((budget.used / budget.amount) * 100) }}%
                      </span>
                    </div>
                  </div>
                  <div class="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                    <div :style="{ width: `${Math.min(100, Math.round((budget.used / budget.amount) * 100))}%` }"
                      :class="[
                        'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center',
                        // getBudgetProgressClass(budget.used, budget.amount)
                      ]">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6 mt-6">
              <div class="flex justify-between items-center">
                <h5 class="font-medium text-gray-700">Budgets par Département</h5>
                <button class="text-sm text-purple-600 hover:text-purple-700">+ Ajouter un département</button>
              </div>

              <div class="space-y-4 mt-4 max-h-64 overflow-y-auto">
                <div v-for="(budget, index) in departmentBudgets" :key="index" class="bg-gray-50 p-3 rounded-md">
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-medium">{{ budget.name }}</span>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="budget.amount"
                        type="number"
                        class="w-32 h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-500">FCFA</span>
                    </div>
                  </div>
                  <div class="relative pt-1">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="text-xs font-semibold inline-block text-purple-600">
                          {{ budget.used }} / {{ budget.amount }} FCFA
                        </span>
                      </div>
                      <div class="text-right">
                        <span class="text-xs font-semibold inline-block text-purple-600">
                          {{ Math.round((budget.used / budget.amount) * 100) }}%
                        </span>
                      </div>
                    </div>
                    <div class="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                      <div :style="{ width: `${Math.min(100, Math.round((budget.used / budget.amount) * 100))}%` }"
                        :class="[
                          'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center',
                          // getBudgetProgressClass(budget.used, budget.amount)
                        ]">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="budgetModalOpen = false"
                class="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                class="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Enregistrer les Budgets
              </button>
            </div>
          </div>
        </div>
      </template>
    </Modal>-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from '@/components/profile/Modal.vue';
import Input from "@/components/forms/FormElements/Input.vue";
// import ExpensesSummaryCard from "@/components/expense/ExpensesSummaryCard.vue";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent, ICellRendererParams } from 'ag-grid-community';

// État de la page
const currentPageTitle = ref("Gestion des Dépenses");
const isDropdownOpen = ref(false);
const addExpenseModalOpen = ref(false);
const importModalOpen = ref(false);
const budgetModalOpen = ref(false);
const activeTab = ref('all');
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const openAddExpenseModal = () =>{
  addExpenseModalOpen.value = !addExpenseModalOpen.value
}

const openImportModal = () =>{
  importModalOpen.value = !importModalOpen.value
}

const openBudgetModal = () =>{
  budgetModalOpen.value = !budgetModalOpen.value
}
// Configuration AG-Grid
const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

// Données des dépenses
const expenses = ref([
  {
    id: "#EXP001",
    supplierName: "Connect Fast",
    description: "Facture Internet et Téléphone",
    category: "utilities",
    categoryName: "Services Publics",
    department: "administration",
    departmentName: "Administration",
    amount: 205000,
    date: "2023-05-01",
    dueDate: "2023-05-15",
    status: "paid",
    paymentMethod: "virement",
    invoiceNumber: "INV-2023-001",
    taxRate: 18,
    amountBeforeTax: 173728,
  },
  {
    id: "#EXP002",
    supplierName: "Fresh Foods",
    description: "Approvisionnement Cuisine - Fruits et Légumes",
    category: "food",
    categoryName: "Alimentation",
    department: "kitchen",
    departmentName: "Cuisine",
    amount: 345000,
    date: "2023-05-02",
    dueDate: "2023-05-09",
    status: "paid",
    paymentMethod: "espèces",
    invoiceNumber: "INV-2023-045",
    taxRate: 0,
    amountBeforeTax: 345000,
  },
  {
    id: "#EXP003",
    supplierName: "CleanPro Services",
    description: "Services de Nettoyage - Avril 2023",
    category: "cleaning",
    categoryName: "Nettoyage",
    department: "housekeeping",
    departmentName: "Entretien",
    amount: 450000,
    date: "2023-05-03",
    dueDate: "2023-05-17",
    status: "pending",
    paymentMethod: "chèque",
    invoiceNumber: "INV-2023-078",
    taxRate: 18,
    amountBeforeTax: 381356,
  },
  {
    id: "#EXP004",
    supplierName: "Électricité du Cameroun",
    description: "Facture Électricité - Avril 2023",
    category: "utilities",
    categoryName: "Services Publics",
    department: "maintenance",
    departmentName: "Maintenance",
    amount: 780000,
    date: "2023-05-04",
    dueDate: "2023-05-20",
    status: "paid",
    paymentMethod: "virement",
    invoiceNumber: "ELEC-2023-456",
    taxRate: 5,
    amountBeforeTax: 742857,
  },
  {
    id: "#EXP005",
    supplierName: "AquaPure",
    description: "Approvisionnement en Eau Minérale",
    category: "food",
    categoryName: "Alimentation",
    department: "kitchen",
    departmentName: "Cuisine",
    amount: 86000,
    date: "2023-05-05",
    dueDate: "2023-05-12",
    status: "paid",
    paymentMethod: "espèces",
    invoiceNumber: "INV-2023-112",
    taxRate: 0,
    amountBeforeTax: 86000,
  },
  {
    id: "#EXP006",
    supplierName: "SécuriTech",
    description: "Services de Sécurité - Avril 2023",
    category: "security",
    categoryName: "Sécurité",
    department: "administration",
    departmentName: "Administration",
    amount: 520000,
    date: "2023-05-06",
    dueDate: "2023-05-21",
    status: "overdue",
    paymentMethod: "virement",
    invoiceNumber: "SEC-2023-089",
    taxRate: 18,
    amountBeforeTax: 440678,
  },
  {
    id: "#EXP007",
    supplierName: "Tech Solutions",
    description: "Maintenance Système de Réservation",
    category: "tech",
    categoryName: "Technologie",
    department: "reception",
    departmentName: "Réception",
    amount: 175000,
    date: "2023-05-07",
    dueDate: "2023-05-22",
    status: "pending",
    paymentMethod: "chèque",
    invoiceNumber: "TS-2023-345",
    taxRate: 18,
    amountBeforeTax: 148305,
  },
  {
    id: "#EXP008",
    supplierName: "Linge Luxe",
    description: "Approvisionnement en Draps et Serviettes",
    category: "supplies",
    categoryName: "Fournitures",
    department: "housekeeping",
    departmentName: "Entretien",
    amount: 630000,
    date: "2023-05-08",
    dueDate: "2023-05-23",
    status: "pending",
    paymentMethod: "virement",
    invoiceNumber: "LL-2023-456",
    taxRate: 18,
    amountBeforeTax: 533898,
  },
  {
    id: "#EXP009",
    supplierName: "Décor Élégance",
    description: "Rénovation Hall d'Entrée",
    category: "renovation",
    categoryName: "Rénovation",
    department: "maintenance",
    departmentName: "Maintenance",
    amount: 1250000,
    date: "2023-05-09",
    dueDate: "2023-05-24",
    status: "paid",
    paymentMethod: "virement",
    invoiceNumber: "DE-2023-789",
    taxRate: 18,
    amountBeforeTax: 1059322,
  },
  {
    id: "#EXP010",
    supplierName: "FoodSupply Pro",
    description: "Approvisionnement Cuisine - Viandes et Poissons",
    category: "food",
    categoryName: "Alimentation",
    department: "kitchen",
    departmentName: "Cuisine",
    amount: 890000,
    date: "2023-05-10",
    dueDate: "2023-05-17",
    status: "pending",
    paymentMethod: "chèque",
    invoiceNumber: "FSP-2023-567",
    taxRate: 0,
    amountBeforeTax: 890000,
  },
  {
    id: "#EXP011",
    supplierName: "PubliMarket",
    description: "Campagne Marketing Mai 2023",
    category: "marketing",
    categoryName: "Marketing",
    department: "sales",
    departmentName: "Ventes & Marketing",
    amount: 480000,
    date: "2023-05-11",
    dueDate: "2023-05-26",
    status: "pending",
    paymentMethod: "virement",
    invoiceNumber: "PM-2023-234",
    taxRate: 18,
    amountBeforeTax: 406780,
  },
  {
    id: "#EXP012",
    supplierName: "GasMaster",
    description: "Approvisionnement en Gaz - Cuisine",
    category: "utilities",
    categoryName: "Services Publics",
    department: "kitchen",
    departmentName: "Cuisine",
    amount: 120000,
    date: "2023-05-12",
    dueDate: "2023-05-19",
    status: "paid",
    paymentMethod: "espèces",
    invoiceNumber: "GM-2023-123",
    taxRate: 18,
    amountBeforeTax: 101695,
  },
]);

// Catégories de dépenses
const expenseCategories = ref([
  { id: 'utilities', name: 'Services Publics', icon: 'LightBulbIcon', color: 'bg-yellow-500' },
  { id: 'food', name: 'Alimentation', icon: 'ShoppingBagIcon', color: 'bg-green-500' },
  { id: 'cleaning', name: 'Nettoyage', icon: 'SparklesIcon', color: 'bg-blue-500' },
  { id: 'security', name: 'Sécurité', icon: 'ShieldCheckIcon', color: 'bg-red-500' },
  { id: 'tech', name: 'Technologie', icon: 'DesktopComputerIcon', color: 'bg-indigo-500' },
  { id: 'supplies', name: 'Fournitures', icon: 'ArchiveIcon', color: 'bg-gray-500' },
  { id: 'renovation', name: 'Rénovation', icon: 'HomeIcon', color: 'bg-purple-500' },
  { id: 'marketing', name: 'Marketing', icon: 'SpeakerphoneIcon', color: 'bg-pink-500' },
  { id: 'maintenance', name: 'Maintenance', icon: 'WrenchIcon', color: 'bg-orange-500' },
  { id: 'others', name: 'Autres', icon: 'DotsHorizontalIcon', color: 'bg-gray-400' },
]);

// Départements de l'hôtel
const departments = ref([
  { id: 'administration', name: 'Administration', icon: 'OfficeBuildingIcon' },
  { id: 'reception', name: 'Réception', icon: 'UserGroupIcon' },
  { id: 'housekeeping', name: 'Entretien', icon: 'SparklesIcon' },
  { id: 'kitchen', name: 'Cuisine', icon: 'CakeIcon' },
  { id: 'restaurant', name: 'Restaurant', icon: 'CoffeeIcon' },
  { id: 'maintenance', name: 'Maintenance', icon: 'WrenchIcon' },
  { id: 'sales', name: 'Ventes & Marketing', icon: 'CurrencyDollarIcon' },
]);

// Onglets
const tabs = ref([
  { id: 'all', name: 'Toutes les Dépenses', icon: 'ViewListIcon', count: expenses.value.length },
  { id: 'pending', name: 'En Attente', icon: 'ClockIcon', count: expenses.value.filter((e:any) => e.status === 'pending').length },
  { id: 'paid', name: 'Payées', icon: 'CheckCircleIcon', count: expenses.value.filter((e:any)=> e.status === 'paid').length },
  { id: 'overdue', name: 'En Retard', icon: 'ExclamationCircleIcon', count: expenses.value.filter((e:any) => e.status === 'overdue').length },
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

// Budgets par catégorie
const categoryBudgets = ref([
  { id: 'utilities', name: 'Services Publics', amount: 1500000, used: 1105000 },
  { id: 'food', name: 'Alimentation', amount: 2000000, used: 1321000 },
  { id: 'cleaning', name: 'Nettoyage', amount: 800000, used: 450000 },
  { id: 'security', name: 'Sécurité', amount: 600000, used: 520000 },
  { id: 'tech', name: 'Technologie', amount: 500000, used: 175000 },
  { id: 'supplies', name: 'Fournitures', amount: 900000, used: 630000 },
  { id: 'renovation', name: 'Rénovation', amount: 1500000, used: 1250000 },
  { id: 'marketing', name: 'Marketing', amount: 700000, used: 480000 },
]);

// Budgets par département
const departmentBudgets = ref([
  { id: 'administration', name: 'Administration', amount: 1200000, used: 725000 },
  { id: 'reception', name: 'Réception', amount: 500000, used: 175000 },
  { id: 'housekeeping', name: 'Entretien', amount: 1300000, used: 1080000 },
  { id: 'kitchen', name: 'Cuisine', amount: 3500000, used: 1441000 },
  { id: 'restaurant', name: 'Restaurant', amount: 800000, used: 0 },
  { id: 'maintenance', name: 'Maintenance', amount: 2500000, used: 2030000 },
  { id: 'sales', name: 'Ventes & Marketing', amount: 1000000, used: 480000 },
]);

// Configuration Flatpickr
const datePickerConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'j F Y',
  locale: { firstDayOfWeek: 1 }
};

const dateRangeConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'j F Y',
  mode: 'range',
  locale: { firstDayOfWeek: 1 }
};

// Colonnes AG-Grid
const columnDefs = ref<ColDef[]>([
  {
    headerName: '',
    field: 'statusIcon',
    width: 60,
    cellRenderer: (params: ICellRendererParams) => {
      const status = params.data.status;
      if (status === 'paid') {
        return `<div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>`;
      } else if (status === 'pending') {
        return `<div class="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>`;
      } else if (status === 'overdue') {
        return `<div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>`;
      }
      return '';
    },
    sortable: false,
    filter: false,
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  {
    headerName: 'Référence',
    field: 'id',
    width: 120,
  },
  {
    headerName: 'Fournisseur',
    field: 'supplierName',
    width: 150,
  },
  {
    headerName: 'Description',
    field: 'description',
    width: 200,
  },
  {
    headerName: 'Catégorie',
    field: 'categoryName',
    width: 140,
    cellRenderer: (params: ICellRendererParams) => {
      const category = expenseCategories.value.find((c:any) => c.id === params.data.category);
      if (category) {
        return `<div class="flex items-center">
                  <span class="w-3 h-3 rounded-full ${category.color} mr-2"></span>
                  <span>${category.name}</span>
                </div>`;
      }
      return params.value;
    },
  },
  {
    headerName: 'Département',
    field: 'departmentName',
    width: 150,
  },
  {
    headerName: 'Montant',
    field: 'amount',
    width: 140,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return `<div class="font-medium">${formatCurrency(params.value)}</div>`;
    // },
  },
  {
    headerName: 'Date',
    field: 'date',
    width: 120,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return formatDate(params.value);
    // },
  },
  {
    headerName: 'Échéance',
    field: 'dueDate',
    width: 120,
    // cellRenderer: (params: ICellRendererParams) => {
    //   return formatDate(params.value);
    // },
  },
  {
    headerName: 'Statut',
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
    headerName: 'Actions',
    width: 120,
    cellRenderer: () => `
      <div class="flex space-x-1 mt-2">
        <button class="p-1 text-purple-600 hover:text-purple-900" data-action="edit">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button class="p-1 text-red-600 hover:text-red-900" data-action="delete">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    `,
  },
]);

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
    result = result.filter(expense => expense.amount >= Number(filters.value.minAmount));
  }

  if (filters.value.maxAmount) {
    result = result.filter(expense => expense.amount <= Number(filters.value.maxAmount));
  }

  return result;
});

// Dépenses récentes pour le widget
const recentExpenses = computed(() => {
  return [...expenses.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(expense => ({
      id: expense.id,
      name: expense.supplierName,
      description: expense.description,
      amount: expense.amount,
      // date: formatDate(expense.date),
      category: expenseCategories.value.find((c:any) => c.id === expense.category)?.name || '',
    }));
});

// Calculs des totaux
// const currentMonthTotal = computed(() => {
//   return expenses.value.reduce((total, expense) => total + expense.amount, 0);
// });

// const foodExpensesTotal = computed(() => {
//   return expenses.value
//     .filter(expense => expense.category === 'food')
//     .reduce((total, expense) => total + expense.amount, 0);
// });

// const technicalExpensesTotal = computed(() => {
//   return expenses.value
//     .filter(expense => ['tech', 'maintenance'].includes(expense.category)
</script>
