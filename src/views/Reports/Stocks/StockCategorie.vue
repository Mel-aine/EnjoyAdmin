<template>
  <div >
    <AdminLayout>
      <PageBreadcrumb :pageTitle="'Catégories de Stock'" />

      <div class="flex justify-end my-10">
        <button
          class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          @click="modalOpen = true"
        >
          Ajouter une catégorie
        </button>
      </div>
      <div class="h-screen mt-10">
        <ComponentCard title="">
      <div class="ag-theme-quartz">
        <ag-grid-vue
          :rowData="categories"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          rowSelection="single"
          :pagination="true"
          :domLayout="'autoHeight'"
          :autoSizeStrategy="autoSizeStrategy"
          @gridReady="onGridReady"
        />
      </div>
    </ComponentCard>

    </div>

      <Modal v-if="modalOpen" @close="modalOpen = false">
        <template #body>
          <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
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
            <h2 class="text-lg font-semibold mb-4">Nouvelle Catégorie</h2>
            <form @submit.prevent="addCategory">
              <Input
                :lb="'Nom de la catégorie'"
                v-model="newCategoryName"
                :id="'categoryName'"
                :forLabel="'categoryName'"
              />
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
import ComponentCard from "@/components/common/ComponentCard.vue";
import Modal from "@/components/profile/Modal.vue";
import Input from "@/components/forms/FormElements/Input.vue";

import type { ColDef, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Données simulées
const categories = ref([
  { id: 1, name: "Cuisine" },
  { id: 2, name: "Minibar" },
  { id: 3, name: "Lingerie" },
]);

const columnDefs = ref<ColDef[]>([
  { headerName: "ID", field: "id", width: 90 },
  { headerName: "Nom de la Catégorie", field: "name" },
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
const newCategoryName = ref("");

const addCategory = () => {
  if (newCategoryName.value.trim()) {
    categories.value.push({
      id: categories.value.length + 1,
      name: newCategoryName.value,
    });
    newCategoryName.value = "";
    modalOpen.value = false;
  }
};

const onGridReady = (params: GridReadyEvent) => {
  console.log("Categories grid ready");
};
const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}
</script>
