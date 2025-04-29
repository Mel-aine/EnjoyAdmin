<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="'Mouvements de Stock'" />
      <div class="py-5">
        <ag-grid-vue
          class="ag-theme-quartz"
          :rowData="movements"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          rowSelection="single"
          :pagination="true"
          :domLayout="'autoHeight'"
          @gridReady="onGridReady"
        />
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import type { GridReadyEvent, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Exemple de données mockées
const movements = ref([
  {
    date: "2025-04-27",
    product: "Savon",
    type: "Entrée",
    quantity: 100,
    source: "Fournisseur - UNILEVER",
    destination: "Entrepôt Central",
    user: "Admin",
  },
  {
    date: "2025-04-28",
    product: "Shampoing",
    type: "Sortie",
    quantity: 30,
    source: "Entrepôt Central",
    destination: "Chambre 205",
    user: "Marie Dupont",
  },
]);

const columnDefs = ref<ColDef[]>([
  { headerName: "Date", field: "date", filter: true, sortable: true },
  { headerName: "Produit", field: "product" },
  {
    headerName: "Type",
    field: "type",
    cellRenderer: ({ value }) => {
      const color = value === "Entrée" ? "green" : "red";
      return `<span class="text-${color}-600 font-semibold">${value}</span>`;
    },
  },
  { headerName: "Quantité", field: "quantity" },
  { headerName: "Source", field: "source" },
  { headerName: "Destination", field: "destination" },
  { headerName: "Utilisateur", field: "user" },
]);

const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true,
  floatingFilter: true,
};

const onGridReady = (params: GridReadyEvent) => {
  console.log("Grid ready:", params);
};
</script>
