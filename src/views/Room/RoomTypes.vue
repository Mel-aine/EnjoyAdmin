<template>
  <div class="">
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5 ">
        <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <button
          class="border border-gray-300 bg-purple-400 rounded-lg relative"
          >
          <svg class="h-8 w-8 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
            </button>
          </template>
        </DropdownMenu>
    </div>
    <div class="h-screen">
    <ComponentCard :title="$t('AllRoomType')">
    <div class="space-y-5 sm:space-y-6 ">
      <ag-grid-vue class="ag-theme-quartz" :rowData="roomTypeData" :columnDefs="columnDefs" rowHeight="50"
      :rowSelection="'single'"  :domLayout="'autoHeight'" :autoSizeStrategy="autoSizeStrategy"
      :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady"
      ></ag-grid-vue>
    </div>
  </ComponentCard>
</div>
  </AdminLayout>

  <Modal v-if="modalOpen" @close="closeModal">
    <template #body>
      <div
      class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
      <!-- close btn -->
      <button
      @click="closeModal"
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
      {{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}
    </h4>

  </div>
  <form class="flex flex-col">
    <div class="custom-scrollbar h-[300px] overflow-y-auto p-2">
      <div>
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-6">
          <div>
            <Input :lb="$t('RoomName')"  :placeholder="$t('RoomName')" :id="'room'" :forLabel="'room'" v-model="form.name" />
          </div>
          <div>
            <Select :lb="$t('Status')" :options="status" v-model="form.status"/>
          </div>
        </div>
          <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('Description') }}
              </label>
              <textarea
              v-model="form.description"
                :placeholder="$t('Largetext')"
                rows="6"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              ></textarea>
            </div>

      </div>

    </div>
    <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
      <button
      @click="closeModal"
      type="button"
      class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
      >
      {{ $t('Cancel') }}
    </button>
    <button
    :disabled="isLoading"
    type="button"
    class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
    @click.prevent="handleSubmit"
    >
      <span v-if="!isLoading"> {{ isEditMode ? $t('EditRoomType') : $t('AddRoomType') }}</span>
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
</div>
</template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { createRoomType,getTypeProduct} from "@/services/api";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { useI18n } from "vue-i18n";
import { ref,onMounted,computed ,watch} from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent,ICellRendererParams} from 'ag-grid-community';
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'; // adapte le chemin
import type { RoomTypeData } from '@/types/option'
import { useServiceStore } from '@/composables/serviceStore'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import { updateRoomType,deleteRoomType} from "@/services/api";








const isLoading = ref(false);
const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const serviceStore = useServiceStore()
const modalOpen = ref(false)
const currentPageTitle = computed(()=>t("RoomTypes"));
const menuItems =computed(()=>[
  { label: t('AddRoomType'), onClick: () => OpenModal() },
])
const selectedRoomType = ref<any>(null);
const isEditMode = ref(false);
const status = ref([
{value: 'Active', label: t('Active')},
{value: 'Inactive', label: t('Inactive')},

])
const columnDefs = ref<ColDef[]>([
{ headerName: '#', field: 'id' ,
width: 120
},
{
  headerName: t('Name'),
  field: 'name',
},
{ headerName: t('Description'), field: 'description' },
{
  headerName: t('Status'),
  field: 'status',
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'Active') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;

    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Inactive</span>`;
    }
  }
},
{ headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) },

]);
watch(() => locale.value, () => {
  columnDefs.value = [ { headerName: '#', field: 'id' ,
width: 120
},
{
  headerName: t('Name'),
  field: 'name',
},
{ headerName: t('Description'), field: 'description' },
{
  headerName: t('Status'),
  field: 'status',
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'Active') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;

    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Inactive</span>`;
    }
  }
},
{ headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) },
  ];
}, { immediate: true });

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
const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}

const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};




const roomTypeData = ref<RoomTypeData[]>([])


const form = ref<RoomTypeData >({
  name: '',
  status: '',
  description: '',
})

const SaveRoomType = async () => {
  isLoading.value = true;
  try {
    const serviceId = serviceStore.serviceId;

    if (!serviceId) {
      throw new Error('Service ID is not defined');
    }
    const Payload = {
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
      service_id : serviceId
    };

    const roomResponse = await createRoomType(Payload);
    console.log('roomtype', roomResponse);
    modalOpen.value = false;
    form.value = {
      name: '',
      status: '',
      description: '',

    }
    toast.success('Chambre enregistrée avec succès !')
    console.log('Payload', Payload)

  } catch (error) {
    console.error('Erreur lors de la sauvegarde', error);
  }finally {
    isLoading.value = false;
  }
};

const fetchRoomType = async () => {
  try {
    const serviceId = serviceStore.serviceId;

    if (!serviceId) {
      throw new Error('Service ID is not defined');
    }
    const response = await getTypeProduct()

    roomTypeData.value = response.data.data.filter((el:any)=> el.serviceId === serviceId )

    console.log(";;;;",roomTypeData.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}

fetchRoomType()


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
    const roomTypeToEdit = roomTypeData.value.find((r: any) => r.id === Number(id));
    console.log("Editing reservation:",  roomTypeToEdit);

    if (roomTypeToEdit) {
      selectedRoomType.value = roomTypeToEdit;
      form.value.name = roomTypeToEdit.name;
      form.value.status = roomTypeToEdit.status;
      form.value.description = roomTypeToEdit.description;

      isEditMode.value = true;
      modalOpen.value = true;

    }
  } else if (action === 'delete') {
     handleDeleteUser(Number(id));
  }
};



const handleDeleteUser = async (id: number) => {
  try {
    console.log(`Suppression de la room avec ID: ${id}`);
     deleteRoomType(id)
    toast.success(t('toast.roomTypeDeleted'))
    roomTypeData.value = roomTypeData.value.filter((r: any) => r.id !== id);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    toast.error(t('toast.roomTypeDeleteError'))
  }
};



const updateFormData = async () => {
  isLoading.value = true;

  try {
    const serviceId = serviceStore.serviceId;
    const id = selectedRoomType.value?.id;

    if (!id) {
      toast.error(t('toast.selectError'));
      return;
    }

    const roomTypePayload = {
      service_id: serviceId,
      name: form.value.name,
      description: form.value.description,
      status: form.value.status,
    };

    console.log('Payload envoyé :', roomTypePayload);
    await updateRoomType(id, roomTypePayload);

    toast.success(t('toast.roomTypeUpdatedSuccess'));

    // Réinitialisation du formulaire
    form.value = {
      name: '',
      status: '',
      description: '',

    }
    selectedRoomType.value = null;
    isEditMode.value = false;
    modalOpen.value = false;

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error(t('toast.updateError'));
  } finally {
    isLoading.value = false;
  }
};




const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEditMode.value) {
      await updateFormData()
    } else {
      await SaveRoomType()
    }
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  form.value = {
      name: '',
      status: '',
      description: '',

    }
  isEditMode.value = false;
  modalOpen.value = false;

};

const OpenModal = () =>{
  modalOpen.value=true;
  isEditMode.value = false;
}



</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
