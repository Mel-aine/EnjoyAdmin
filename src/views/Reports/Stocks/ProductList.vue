<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5 relative">
        <!-- Add/Import Dropdown -->
        <button class="border border-gray-300 bg-purple-400 rounded-lg" @click="toggleDropdown">
          <svg class="h-8 w-8 text-white" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div v-if="isDropdownOpen" class="absolute right-0 mt-10 w-44 bg-white rounded-lg shadow z-50">
          <ul class="py-2 text-sm text-gray-700">
            <li><button @click="modalOpen = true" class="block px-4 py-2 hover:text-purple-600">Add Product</button></li>
            <li><button class="block px-4 py-2 hover:text-purple-600">Import</button></li>
          </ul>
        </div>
      </div>

      <!-- Data Table -->
      <div class="space-y-5 sm:space-y-6 h-screen">
        <ag-grid-vue
          class="ag-theme-quartz"
          :rowData="productData"
          :columnDefs="columnDefs"
          rowHeight="50"
          :rowSelection="'single'"
          :pagination="true"
          :domLayout="'autoHeight'"
          @cellClicked="onCellClick"
          @gridReady="onGridReady"
          @selectionChanged="getSelectedRows"
          :defaultColDef="defaultColDef"
          :autoSizeStrategy="autoSizeStrategy"
        />
      </div>
    </AdminLayout>

    <!-- Modal Add Product -->
    <Modal v-if="modalOpen" @close="modalOpen = false">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <!-- Close button -->
          <button
            @click="modalOpen = false"
            class="absolute right-5 top-5 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700"
          >
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M6.04 16.54a1 1 0 1 0 1.42 1.42L12 13.41l4.54 4.55a1 1 0 0 0 1.42-1.42L13.41 12l4.55-4.54a1 1 0 0 0-1.42-1.42L12 10.59 7.46 6.04a1 1 0 0 0-1.42 1.42L10.59 12l-4.55 4.54Z"
              />
            </svg>
          </button>

          <h4 class="text-2xl font-semibold text-gray-800 mb-6">Add Product Details</h4>

          <form class="flex flex-col space-y-4">
            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <Input :lb="'Product Code'" :placeholder="'Code'" :id="'code'" :forLabel="'code'" />
              <Input :lb="'Product Name'" :placeholder="'Name'" :id="'name'" :forLabel="'name'" />
              <Input :lb="'Quantity'" :placeholder="'Quantity'" :id="'quantity'" :forLabel="'quantity'" />
              <Input :lb="'Price'" :placeholder="'1000 FCFA'" :id="'price'" :forLabel="'price'" />
              <Input :lb="'Fournisseur'" :placeholder="'Nom du fournisseur'" :id="'supplier'" :forLabel="'supplier'" />
              <Select :lb="'Category'" :options="categories" />
              <Select :lb="'Status'" :options="statusOptions" />
            </div>

            <div class="flex items-center gap-3 justify-end pt-4">
              <button
                @click="modalOpen = false"
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                class="rounded-lg bg-purple-500 px-4 py-2.5 text-sm text-white hover:bg-purple-600"
              >
                Add Product
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
import Modal from "@/components/profile/Modal.vue";
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";

import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type {
  ColDef,
  GridReadyEvent,
  CellClickedEvent,
  SelectionChangedEvent,
  ICellRendererParams
} from 'ag-grid-community';

const modalOpen = ref(false);
const isDropdownOpen = ref(false);
const currentPageTitle = ref("Product");

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
};

const statusOptions = ref([
  { value: 'En Stock', label: 'En Stock' },
  { value: 'Faible Stock', label: 'Faible Stock' },
  { value: 'Rupture', label: 'En rupture de stock' },
]);

const categories = ref([
  { value: 'Cuisine', label: 'Cuisine' },
  { value: 'Minibar', label: 'Minibar' },
  { value: 'Lingerie', label: 'Lingerie' },
]);

const productData = ref([
  { id: 'P001', code: 'PRD001', name: 'Savon', quantity: 50, price: '100 FCFA', category: 'Chambre', supplier: 'UNILEVER', status: 'En Stock' },
  { id: 'P002', code: 'PRD002', name: 'Shampoing', quantity: 30, price: '200 FCFA', category: 'Chambre', supplier: 'COLGATE', status: 'Faible Stock' },
]);

const columnDefs = ref<ColDef[]>([
  { headerName: 'ID', field: 'id', checkboxSelection: true, headerCheckboxSelection: true },
  { headerName: 'Code', field: 'code' },
  { headerName: 'Nom', field: 'name' },
  { headerName: 'Quantité', field: 'quantity' },
  { headerName: 'Prix (pcs)', field: 'price' },
  { headerName: 'Fournisseur', field: 'supplier' },
  { headerName: 'Catégorie', field: 'category' },
  {
    headerName: 'Statut',
    field: 'status',
    cellRenderer: (params: ICellRendererParams) => {
      const val = params.value;
      const badge = val === 'En Stock' ? 'bg-green-100 text-green-700' :
                    val === 'Faible Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-700';
      return `<span class="px-2 py-1 text-xs rounded-full ${badge}">${val}</span>`;
    }
  },
  {
    headerName: 'Actions',
    cellRenderer: () => `
      <div>
        <button class="bg-purple-500 text-white px-2 rounded mx-1">Edit</button>
        <button class="bg-orange-500 text-white px-2 rounded mx-1">Delete</button>
      </div>
    `,
  },
]);

const onGridReady = (params: GridReadyEvent) => console.log('Grid Ready', params);
const onCellClick = (event: CellClickedEvent) => console.log('Clicked', event.data);
const getSelectedRows = (event: SelectionChangedEvent) => {
  const selected = event.api.getSelectedRows();
  console.log('Selected row:', selected);
};
</script>

<style scoped>
/* Custom styling if needed */
</style>
