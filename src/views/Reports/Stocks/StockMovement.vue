
<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="$t('StockMovements')" />
      <div class="py-5 mt-8 h-screen container mx-auto">
        <div class="rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-white/[0.03]">

          <!-- Header -->
          <div class="flex justify-end items-center p-6 border-b border-gray-100 dark:border-gray-800">
            <!-- <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Mouvements de stocks</h2> -->
            <div class="flex gap-3">
              <!-- Nouveau Mouvement -->
              <button
                @click="openModal"
                class="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                {{ $t('addMovement') }}
              </button>

              <!-- Exporter -->
              <button
                @click="exportToExcel"
                class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4 4m0 0l4-4m-4 4V4" /></svg>
                {{ $t('export') }}
              </button>
            </div>
          </div>

          <!-- Tableau -->
          <div class="space-y-5 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
            <ag-grid-vue
              class="ag-theme-quartz"
              :rowData="movements"
              :columnDefs="columnDefs"
              :defaultColDef="defaultColDef"
              rowSelection="single"
              :pagination="true"
              :paginationPageSize="10"
              :domLayout="'autoHeight'"
              @gridReady="onGridReady"
              @cellClicked="onCellClick"
            />
          </div>
        </div>
      </div>


      <!-- Modal pour ajouter/modifier un mouvement -->
      <Modal v-if="showModal" @close="closeModal()">
    <template #body>
        <div
      class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
              <!-- close btn -->
              <button
              @click="closeModal()"
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
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">{{ isEditing ? $t('edit') : $t('new') }} {{ $t('stockMovement') }}</h3>
          </div>

          <form @submit.prevent="saveMovement">
            <div class="grid grid-cols-2 gap-4">
              <div class="mb-4">

                <Input
                  :inputType="'date'"
                  :lb="$t('Date')"
                  :id="'date'"
                  :forLabel="'date'"
                  v-model="currentMovement.date"
                  required
                />
              </div>

              <div class="mb-4">
                <Select
                  v-model="currentMovement.type"
                  :lb="$t('Type')"
                  :options="mouvementTypes"
                  required
                />
              </div>

              <div class="mb-4">
                <Select
                  :lb="$t('product')"
                  :options="productData"
                  v-model="currentMovement.productId"
                />

              </div>

              <div class="mb-4">
                <Input
                  :inputType="'number'"
                  :lb="$t('quantity')"
                  :id="'quantity'"
                  :forLabel="'quantity'"
                  v-model="currentMovement.quantity"
                  required
                  min="1"
                />
              </div>

              <div class="mb-4">
                <Select
                  v-model="currentMovement.source"
                  :lb="$t('source')"
                  :options="sourceOptions"
                  required
                />
                  <!-- <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
                  <option v-if="currentMovement.type === 'Entrée'" value="externe">Fournisseur externe</option>
                </select> -->
              </div>

              <div class="mb-4">
                <Select
                  :lb="$t('destination')"
                  :options="destinationOptions"
                  v-model="currentMovement.destination"
                  required
                />
                  <!-- <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
                  <option v-if="currentMovement.type === 'Sortie'" value="client">Client</option>
                </select> -->
              </div>

              <div class="mb-4 col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Note') }}</label>
                <textarea
                  v-model="currentMovement.notes"
                  class="w-full border rounded-md px-3 py-2 h-20"
                  :placeholder="$t('Largetext')"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
               {{ $t('Cancel') }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
              <span v-if="!isLoading"> {{ isEditing ? $t('update') : $t('Save') }}</span>
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
    </AdminLayout>
  </div>
  <ModalDelete v-if="show" @close="show = false"
      @delete="confirmDelete"
      :isLoading="loadingDelete"/>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { ref, reactive, onMounted,computed,watch } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import type { GridReadyEvent, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useToast } from 'vue-toastification'
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import {getProduct,movementService,getMovementService,updateMovementService,deleteMovement} from "@/services/api";
import Spinner from '@/components/spinner/Spinner.vue';
import { useServiceStore } from '@/composables/serviceStore';
import { useAuthStore } from '@/composables/user';
import { useI18n } from "vue-i18n";
import ModalDelete from "@/components/modal/ModalDelete.vue";

interface StockMovement {
  id?: number;
  date: string;
  productId: number | any  ;
  type: string;
  quantity: number;
  source: string;
  destination: string;
  user: string;
  notes?: string;
}

const isLoading = ref(false)
const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const serviceStore = useServiceStore();
const authStore = useAuthStore();
const showModal = ref(false);
const show=ref(false)
const isEditing = ref(false);
const selectedId = ref<number | null>(null)
const loadingDelete = ref(false)
const mouvementTypes = computed(() => [
  { label: t('movement.entry'), value: 'Entry' },
  { label: t('movement.exit'), value: 'Exit' },
  { label: t('movement.transfer'), value: 'Transfer' },
  { label: t('movement.adjustment'), value: 'Adjustment' }
]);

// const roleId = roleStore.roleId

const userData = authStore.user
const user = JSON.parse(userData);

const currentMovement = reactive<StockMovement>({
  date: new Date().toISOString().split('T')[0],
  productId: null,
  type: "Entrée",
  quantity: 1,
  source: "",
  destination: "",
  user: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
  notes: ""
});


const movements = ref<StockMovement[]>([])

const productData = ref<any[]>([])

const locations = computed(() => [
  t('location.centralWarehouse'),
  t('location.reception'),
  t('location.spa'),
  t('location.restaurant'),
  t('location.bar'),
  t('location.room101'),
  t('location.room102'),
  t('location.room103'),
  t('location.room201'),
  t('location.room202'),
  t('location.room203')
]);


// Configuration de la grille AG Grid
const columnDefs = ref<ColDef[]>([
  { headerName: t('Date'), field: "date", filter: true, sortable: true },
  { headerName: t('product'), field: "productId", filter: true,valueGetter: (params: any) => getProductName(params.data.productId) },
  {
    headerName: t('Type'),
    field: "type",
    filter: true,
    cellRenderer: ({ value }:any) => {
      let color = "gray";
      if (value === "Entry") color = "green";
      else if (value === "Exit") color = "red";
      else if (value === "Transfer") color = "blue";
      else if (value === "Adjustment") color = "orange";

      return `<span class="text-${color}-600 font-semibold">${value}</span>`;
    },
  },
  { headerName: t('quantity'), field: "quantity", filter: true },
  { headerName: t('source'), field: "source", filter: true },
  { headerName: t('destination'), field: "destination", filter: true },
  { headerName: t('user'), field: "user", filter: true },
  {headerName: t('Actions'),width: 120,sortable: false,  filter: false, cellRenderer: (params:any) => getActionButtons(params.data.id) }
]);
function getActionButtons(id: number): string {
  return `
    <div class="mt-2 space-x-4">
      <button class="action-btn" data-action="edit" data-id="${id}">
        <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>
      </button>
      <button class="action-btn" data-action="delete" data-id="${id}">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `;
}

watch(() => locale.value, () => {
  columnDefs.value = [
  { headerName: t('Date'), field: "date", filter: true, sortable: true },
  { headerName: t('product'), field: "productId", filter: true,valueGetter: (params: any) => getProductName(params.data.productId) },
  {
    headerName: t('Type'),
    field: "type",
    filter: true,
    cellRenderer: ({ value }:any) => {
      let color = "gray";
      if (value === "Entry") color = "green";
      else if (value === "Exit") color = "red";
      else if (value === "Transfer") color = "blue";
      else if (value === "Adjustment") color = "orange";

      return `<span class="text-${color}-600 font-semibold">${value}</span>`;
    },
  },
  { headerName: t('quantity'), field: "quantity", filter: true },
  { headerName: t('source'), field: "source", filter: true },
  { headerName: t('destination'), field: "destination", filter: true },
  { headerName: t('user'), field: "user", filter: true },
  {headerName: t('Actions'),width: 120,sortable: false,  filter: false, cellRenderer: (params:any) => getActionButtons(params.data.id) }
  ]})

const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true,
  floatingFilter: true,
};

// Méthodes
const onGridReady = (params: GridReadyEvent) => {
  console.log("Grid ready:", params);
};


const fetchProduct = async() => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getProduct(serviceId);

    productData.value = response.data.map((el:any)=>({
      value:el.id,
      label:el.name
    }));
    console.log('prod:', productData.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  }

}

onMounted(async()=>{
  await fetchProduct()
})

const selected = ref<any>(null);

const onCellClick = (event: any) => {
  const button = event.event.target.closest('button');
  console.log('Button clicked:', button);

  if (!button) {
    console.error('No button found');
    return;
  }

  const action = button.dataset.action;
  const id = button.dataset.id;

  console.log('Action:', action, ' ID:', id);

  if (action === 'edit') {
    const movementEdit = movements.value.find((r: any) => r.id === id);
    console.log("Editing :",  movementEdit);

    if (movementEdit) {
      selected.value = movementEdit;
      currentMovement.date = movementEdit.date
      currentMovement.destination = movementEdit.destination
      currentMovement.notes = movementEdit.notes
      currentMovement.productId = movementEdit.productId
      currentMovement.quantity = movementEdit.quantity
      currentMovement.source = movementEdit.source
      currentMovement.type = movementEdit.type
      isEditing.value = true;
      showModal.value = true;

    }
  } else if (action === 'delete') {
    selectedId.value = id
    show.value = true
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
      date :currentMovement.date,
      destination :currentMovement.destination,
      notes : currentMovement.notes,
      product_id : currentMovement.productId,
      quantity :currentMovement.quantity,
      source : currentMovement.source,
      type : currentMovement.type,



    };

    await updateMovementService(id, Payload);

    resetForm ()
    selected.value = null;
    isEditing.value = false;
    showModal.value = false;

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);

  } finally {
    isLoading.value = false;
  }
};


// Gestion du modal
const openModal = () => {
  isEditing.value = false;
  resetForm();
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const resetForm = () => {
  Object.assign(currentMovement, {
    date: new Date().toISOString().split('T')[0],
    product: "",
    type: "Entrée",
    quantity: 1,
    source: "",
    destination: "",
    user: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
    notes: ""
  });
};

const sourceOptions = computed(() => {
  const options = locations.value.map((l:any) => ({ label: l, value: l }))
  if (currentMovement.type === 'Entry') {
    options.unshift({ label: t('Externalsupplier'), value: 'externe' })
  }
  return options
})

const destinationOptions = computed(() => {
  const options = locations.value.map((l:any) => ({ label: l, value: l }))
  if (currentMovement.type === 'Exit') {
    options.push({ label: t('Customer'), value: 'customer' })
  }
  return options
})



const saveMovement = async() => {
  isLoading.value=true
  const serviceId = serviceStore.serviceId;
  try {
    if (isEditing.value) {
      await updateData ()
      toast.success(t('toast.SucessUpdate'));

    } else {
      // Création d'un nouveau mouvement
      console.log ("........",currentMovement)
      const payload = {
        product_id: currentMovement.productId,
        type: currentMovement.type,
        quantity: currentMovement.quantity,
        source: currentMovement.source,
        destination: currentMovement.destination,
        user:currentMovement.user ,
        notes: currentMovement.notes,
        service_id : serviceId,
        date:currentMovement.date

        };
      const response = await movementService(payload);
      console.log('mouvement stock',payload)
      console.log('response',response)
      toast.success(t('toast.Sucess'));
    }

    closeModal();

  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    toast.error(t('toast.error'));
  }finally{
    isLoading.value=false
  }
};
const confirmDelete = async () => {
  if (selectedId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteMovement(selectedId.value)
      toast.success(t('toast.DeletedSuccess'))
      movements.value = movements.value.filter((r: any) => r.id !== selectedId.value);
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


// Export des données
const exportToExcel = () => {
  // Dans une vraie application, utilisez une bibliothèque comme xlsx ou exportez via le backend
  // alert("Fonctionnalité d'export à implémenter");
};


onMounted(async () => {
  const serviceId = serviceStore.serviceId;
  try {

     const response = await getMovementService( serviceId);
     movements.value = response.data;
     console.log('movement',movements.value)



  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
});

const getProductName = (id: number) => {
  const found = productData.value.find((s:any) => s.value === id);
  return found ? found.label : '';
};


</script>
