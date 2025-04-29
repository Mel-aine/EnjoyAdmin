<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="'Fournisseurs'" />

      <div class="flex justify-end mb-4">
        <button
          class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          @click="modalOpen = true"
        >
          Ajouter un fournisseur
        </button>
      </div>
      <ComponentCard title="">
      <div class="ag-theme-quartz">
        <ag-grid-vue
          :rowData="suppliers"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          rowSelection="single"
          :pagination="true"
          :domLayout="'autoHeight'"
          @gridReady="onGridReady"
        />
      </div>
      </ComponentCard>
      <Modal v-if="modalOpen" @close="modalOpen = false">
        <template #body>
          <div class="p-5">
            <h2 class="text-lg font-semibold mb-4">Nouveau Fournisseur</h2>
            <form @submit.prevent="addSupplier">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input :lb="'Nom du fournisseur'" v-model="newSupplier.name" :id="'name'" :forLabel="'name'" />
                <Input :lb="'Email'" v-model="newSupplier.email" :id="'email'" :forLabel="'email'" />
                <Input :lb="'Téléphone'" v-model="newSupplier.phone" :id="'phone'" :forLabel="'phone'" />
                <Input :lb="'Adresse'" v-model="newSupplier.address" :id="'address'" :forLabel="'address'" />
              </div>
              <div class="flex justify-end mt-4">
                <button
                  type="submit"
                  class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </template>
      </Modal>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import Modal from "@/components/profile/Modal.vue";
import Input from "@/components/forms/FormElements/Input.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";

import type { ColDef, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Fournisseurs simulés
const suppliers = ref([
  { id: 1, name: "AfricFournitures", email: "contact@africfournitures.com", phone: "678900123", address: "Douala, Cameroun" },
  { id: 2, name: "HotelPlus", email: "info@hotelplus.com", phone: "655224466", address: "Yaoundé, Cameroun" },
]);

const columnDefs = ref<ColDef[]>([
  { headerName: "ID", field: "id", width: 80 },
  { headerName: "Nom", field: "name" },
  { headerName: "Email", field: "email" },
  { headerName: "Téléphone", field: "phone" },
  { headerName: "Adresse", field: "address" },
  {
    headerName: "Actions",
    cellRenderer: () => `
      <div>
        <button class="text-blue-500 hover:underline mr-2">Modifier</button>
        <button class="text-red-500 hover:underline">Supprimer</button>
      </div>
    `,
  },
]);

const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true,
  floatingFilter: true,
};

const modalOpen = ref(false);
const newSupplier = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
});

const addSupplier = () => {
  if (newSupplier.value.name.trim()) {
    suppliers.value.push({
      id: suppliers.value.length + 1,
      ...newSupplier.value,
    });
    modalOpen.value = false;
    newSupplier.value = { name: "", email: "", phone: "", address: "" };
  }
};

const onGridReady = (params: GridReadyEvent) => {
  console.log("Suppliers grid ready");
};
</script>
