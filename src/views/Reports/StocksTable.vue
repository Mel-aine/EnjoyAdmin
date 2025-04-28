<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5">
        <!-- Bouton qui ouvre/ferme le dropdown -->
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

      <!-- Dropdown menu -->
      <div v-if="isDropdownOpen" class="z-10 mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <button @click="modalOpen=true" class="block px-4 py-2  hover:text-purple-600 dark:hover:text-white">Add Stock </button>
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
      <!-- close btn -->
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
      Add Stock Details
    </h4>

  </div>
  <form class="flex flex-col">
    <div class="custom-scrollbar h-[200px] overflow-y-auto p-2">
      <div>
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div>
            <Input :lb="'Product Name'"  :placeholder="'Product Name'" :id="'name'" :forLabel="'name'" />
          </div>

          <div>
            <Input :lb="'Quantity'"  :placeholder="'quantity'" :id="'rent'" :forLabel="'rent'" />
          </div>

          <div>
            <Input :lb="'Price'"  :placeholder="'100000 FCFA'" :id="'code'" :forLabel="'code'" />
          </div>
          <div>
            <Select :lb="'Status'" :options="status"/>
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
    Add Stock
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
import Select from "@/components/forms/FormElements/Select.vue";

import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';



const modalOpen = ref(false)
const currentPageTitle = ref("Booking Details");
const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

const status = ref([
{value: 'Active', label: "Active"},
{value: 'Inactive', label: "Inactive"},

])
const columnDefs = ref<ColDef[]>([
{ headerName: 'ID', field: 'id' ,
checkboxSelection: true,
headerCheckboxSelection: true
},
{
  headerName: 'Product Name',
  field: 'name',
},
{ headerName: 'Quantity', field: 'quantity' },
{ headerName: 'Price(pcs/KG)', field: 'price' },
{
  headerName: 'Status',
  field: 'status',
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'Active') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;

    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Inactive</span>`;
    }
  }
},
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
  "id": "01",
  "name": "Soup spoon",
  "quantity": "70 pcs",
  "price": "205000",
  "status" : "Active",
},
{
  "id": "02",
  "name": "Rocking Chairs",
  "quantity": "00 pcs",
  "price": "15000 FCFA",
  "status" : "Inactive"
},
{
  "id": "03",
  "name": "Bed",
  "quantity": "70 pcs",
  "price": "25000 FCFA",
  "status" : "Active"
},
{
  "id": "04",
  "name": "Door",
  "quantity": "40 pcs",
  "price": "80000 FCFA",
  "status" : "Active"
},
{
  "id": "05",
  "name": "Chicken",
  "quantity": "70 pcs",
  "price": "20000 FCFA",
  "status" : "Inactive"
},
{
  "id": "06",
  "name": "Chairs",
  "quantity": "50 pcs",
  "price": "12000 FCFA",
  "status" : "Active"
},
];

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
