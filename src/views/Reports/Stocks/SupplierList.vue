<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="$t('Suppliers')" />

      <div class="flex justify-end my-10 pb-4">
        <button
          class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          @click="modalOpen = true"
        >
         {{ $t('addSupplier') }}
        </button>
      </div>
      <div class="h-screen">
      <ComponentCard title="" >
      <div class="ag-theme-quartz">
        <ag-grid-vue
          :rowData="suppliers"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          rowSelection="single"
          :pagination="true"
          :domLayout="'autoHeight'"
          @gridReady="onGridReady"
          @cellClicked="onCellClick"
        />
      </div>
      </ComponentCard>
    </div>
      <Modal v-if="modalOpen" @close="modalOpen = false">
        <template #body>
          <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <button
              @click="close"
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
            <h2 class="text-lg font-semibold mb-4">{{isEditing? $t('edit') : $t('newSupplier') }}</h2>
            <form @submit.prevent="addSupplier">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input :lb="t('Name')" v-model="newSupplier.name" :id="'name'" :forLabel="'name'" />
                <Input :lb="t('Email')" v-model="newSupplier.email" :id="'email'" :forLabel="'email'" />
                <Input :lb="t('Phone')" v-model="newSupplier.phone" :id="'phone'" :forLabel="'phone'" />
                <Input :lb="t('Address')" v-model="newSupplier.address" :id="'address'" :forLabel="'address'" />
              </div>
              <div class="flex justify-end mt-4">
                <button
                :disabled="isLoading"
                  type="submit"
                  class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                >
                <span v-if="!isLoading">{{ isEditing? $t('edit') : $t('Save') }}</span>
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
import { ref,onMounted,watch } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import Modal from "@/components/profile/Modal.vue";
import Input from "@/components/forms/FormElements/Input.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { createSupplier,getSupplier,deleteSupplier,updateSupplier} from "@/services/api";
import { useToast } from 'vue-toastification'
import { useI18n } from "vue-i18n";
import type { ColDef, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Spinner from '@/components/spinner/Spinner.vue';
import { useServiceStore } from '@/composables/serviceStore';
import ModalDelete from "@/components/modal/ModalDelete.vue";




const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const serviceStore = useServiceStore();
const isLoading = ref(false)
const suppliers = ref<any[]>([]);
const isEditing = ref(false)
const show=ref(false)
const selectedId = ref<number | null>(null)
const loadingDelete = ref(false)
const selected = ref<any>(null);



function getActionButtons(Id: number): string {
  return `
    <div class="mt-2 space-x-4">
      <button class="action-btn" data-action="edit" data-id="${Id}">
        <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>
      </button>
      <button class="action-btn" data-action="delete" data-id="${Id}">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `;
}

const columnDefs = ref<ColDef[]>([
  { headerName: t('ID'), field: "id" },
  { headerName: t('Name'), field: "name" },
  { headerName: t('Email'), field: "email" },
  { headerName: t('Phone'), field: "phone" },
  { headerName: t('Address'), field: "address" },
  { headerName: t('Actions') ,filter: false, sortable: false, cellRenderer: (params:any) => getActionButtons(params.data.id) }
]);

watch(() => locale.value, () => {
      columnDefs.value = [
      { headerName: t('ID'), field: "id" },
      { headerName: t('Name'), field: "name" },
      { headerName: t('Email'), field: "email" },
      { headerName: t('Phone'), field: "phone" },
      { headerName: t('Address'), field: "address" },
      { headerName: t('Actions'),filter: false, sortable: false , cellRenderer: (params:any) => getActionButtons(params.data.id) }
]})



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
    const supplierEdit = suppliers.value.find((r: any) => r.id === id);
    console.log("Editing :", supplierEdit);

    if (supplierEdit) {
      selected.value = supplierEdit;
      newSupplier.value.name = supplierEdit.name
      newSupplier.value.email = supplierEdit.email
      newSupplier.value.phone = supplierEdit.phone
      newSupplier.value.address = supplierEdit.address

      isEditing.value = true;
      modalOpen.value = true;
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
      name : newSupplier.value.name,
      email : newSupplier.value.email,
      phone : newSupplier.value.phone,
      address : newSupplier.value.address,
    };

    await updateSupplier(id, Payload);

    selected.value = null;
    isEditing.value = false;
    modalOpen.value = false;
    newSupplier.value = { name: "", email: "", phone: "", address: "" }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);

  } finally {
    isLoading.value = false;
  }
};


const addSupplier = async () => {
  isLoading.value=true
  const serviceId = serviceStore.serviceId;

  try {

    if(isEditing.value){
      await updateData ()
      toast.success(t('toast.SucessUpdate'));
    } else{

    const payload = {
      name: newSupplier.value.name ,
      email: newSupplier.value.email,
      phone: newSupplier.value.phone,
      address: newSupplier.value.address,
      service_id : serviceId

    };

    console.log("sup",payload)
    const response = await createSupplier(payload);
    console.log('sup',response.data)

    if (response.status === 201) {
      toast.success(t('toast.Sucess'));
      modalOpen.value = false;
      newSupplier.value = { name: "", email: "", phone: "", address: "" }
    } else {
      toast.error(t('toast.error'));
    }
    }
  }catch (error) {
    console.error(error);
    toast.error(t('toast.error'));
  }finally{
    isLoading.value=false
  }
};

const fetchSupplier = async() => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getSupplier(serviceId);

    suppliers.value = response.data;
    console.log('cate:', suppliers.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  }

}
onMounted(()=>{
  fetchSupplier()
})

const confirmDelete = async () => {
  if (selectedId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteSupplier(selectedId.value)
      toast.success(t('toast.DeletedSuccess'))
      suppliers.value = suppliers.value.filter((r: any) => r.id !== selectedId.value);
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

const onGridReady = (params: GridReadyEvent) => {
  console.log("Suppliers grid ready");
};

const close = () =>{
  isEditing.value = false
  modalOpen.value = false
  newSupplier.value = { name: "", email: "", phone: "", address: "" }
}
</script>
