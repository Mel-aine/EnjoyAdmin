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
  </div>
  </template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent} from 'ag-grid-community';




const currentPageTitle = ref("Stock Details");
const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

const columnDefs = ref<ColDef[]>([
  { headerName: 'Room ID', field: 'id' ,
    checkboxSelection: true,
    headerCheckboxSelection: true
  },
  {
    headerName: 'Room Type',
    field: 'type',
  },
  { headerName: 'From', field: 'date' },
  { headerName: 'To', field: 'dateTo' },
  { headerName: 'Total Amount', field: 'amount' },
  {
            headerName: 'Actions',
            cellRenderer: () => `
                <div>
                    <button class="mt-3 px-8" data-action="download">
                        <svg class="h-6 w-6 text-slate-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
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
    "type": "Single",
    "amount": "205000",
    "date" : "01 Jan 2021",
    "dateTo" : "31 Jan 2021",
  },
  {
    "id": "#658742",
    "name": "Connect Fast",
    "type": "Super Delux",
    "amount": "15000 FCFA",
    "date" : "01 Jan 2021",
    "dateTo" : "31 Jan 2021",
  },
  {
    "id": "#658882",
    "name": "Easy Shop",
    "type": "Single",
    "amount": "25000 FCFA",
    "date" : "01 Jan 2021",
    "dateTo" : "31 Jan 2021",
  },
  {
    "id": "#659982",
    "name": "Fast Delivery",
    "type": "Single",
    "amount": "80000 FCFA",
    "date" : "01 Jan 2021",
    "dateTo" : "31 Jan 2021",
  },
  {
    "id": "#657782",
    "name": "Buy Best",
    "type": "Suit",
    "amount": "20000 FCFA",
    "date" : "01 Jan 2021",
    "dateTo" : "31 Jan 2021",
  },
  {
    "id": "#653482",
    "name": "Connect Fast",
    "type": "Double",
    "date" : "01 Jan 2021",
    "amount": "12000 FCFA",
    "dateTo" : "31 Jan 2021",

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
