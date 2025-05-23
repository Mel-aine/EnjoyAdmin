<template>

  <div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
  <ag-grid-vue
      class="ag-theme-quartz h-[600px] overflow-y-auto overflow-x-hidden "
      :rowData="reservations"
      :columnDefs="columnDefs"
      :rowHeight="50"
      :rowSelection="'single'"
      :autoSizeStrategy="autoSizeStrategy"
      :pagination="true"
      @cellClicked="onCellClick"

    ></ag-grid-vue>
  </div>

    <ModalDelete
      v-if="modalShow"
      @close="modalShow = false"
      @delete="confirmDelete"
      :isLoading="loadingDelete"
    />
  </div>

</template>

<script setup lang="ts">
import { ref,onMounted,watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent,ICellRendererParams} from 'ag-grid-community';
import { getReservation,getUser,getServiceProduct,deleteReservation} from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import type {ReservationType,userDataType,ServiceProductType} from '@/types/option'
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification'
import ModalDelete from '@/components/modal/ModalDelete.vue';



const router = useRouter()
const { t, locale } = useI18n({ useScope: "global" });
const serviceStore = useServiceStore();
const toast = useToast()
const modalShow = ref(false)
const users = ref<userDataType[]>([])
const selectedReservation = ref<any>(null);
const selectedReservationId = ref<number | null>(null)
const loadingDelete = ref(false)



const fetchUsers = async () => {
  const response = await getUser();
  users.value = response.data.data;
  console.log('userrr',users.value)
}


const serviceProducts = ref<ServiceProductType[]>([])
const fetchServiceProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId

    const response = await getServiceProduct(serviceId);
   serviceProducts.value = response.data;
     console.log("hhh", serviceProducts.value)

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};


const reservations = ref<ReservationType[]>([])

const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getReservation(serviceId);
    console.log("....",response.data);

    reservations.value = response.data.map((res: any) => {
      const user = users.value.find((u: any) => u.id === res.userId);
      // const product = serviceProducts.value.find((p: any) => p.id === res.reservationProduct);


      return {
        ...res,
        email : user? `${user.email}`: ' ',
        userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',

      };
    });
    reservations.value.sort((a:any, b:any) => a.userFullName.localeCompare(b.userFullName));

    console.log(".....reservation", reservations.value);
  } catch (error) {
    console.error('fetch failed:', error);
  }
};





onMounted(async () => {
  await fetchUsers();
  await fetchReservation();
  await fetchServiceProduct()
});


const columnDefs = ref<ColDef[]>([
{ headerName: t('ID'), field: 'id' ,
},
{
  headerName: t('Name'),
  field: 'userFullName',
},
 { headerName: t('Email'), field: 'email' },
{ headerName: t('CheckIn'), field: 'arrivedDate' },
{ headerName: t('CheckOut'), field: 'departDate' },
{
  headerName: t('Status'), field: 'status',
  cellRenderer: (params: ICellRendererParams) => getStatusBadge(params.value)

},
{ headerName: t('ReservationType'), field: 'reservationType',

},
// { headerName: t('Room'), field: 'reservationProduct'},
{
  headerName: t('Payment'), field: 'payment',
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'paid') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Paid</span>`;
    }
    else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">pending</span>`;
    }
  }

},

{ headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) },



]);

watch(() => locale.value, () => {
      columnDefs.value = [
      { headerName: t('ID'), field: 'id' ,},
      {
        headerName: t('Name'),
        field: 'userFullName',
      },
      { headerName: t('Email'), field: 'email' },
      { headerName: t('CheckIn'), field: 'arrivedDate' },
      { headerName: t('CheckOut'), field: 'departDate' },
      {
        headerName: t('Status'), field: 'status',
        cellRenderer: (params: ICellRendererParams) => getStatusBadge(params.value)

      },
      { headerName: t('ReservationType'), field: 'reservationType',

      },
      // { headerName: t('Room'), field: 'reservationProduct'},
      {
        headerName: t('Payment'), field: 'payment',
        cellRenderer: (params:ICellRendererParams) => {
          if (params.value === 'paid') {
            return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Paid</span>`;
          }
          else {
            return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Pending</span>`;
          }
        }

      },

      { headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) },
      ];
    }, { immediate: true });


function getStatusBadge(value: string): string {
  const badgeMap: Record<string, string> = {
    confirmed: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500',
    pending: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500',
  };

  const badgeClass = badgeMap[value] || 'bg-gray-200 text-gray-700 dark:bg-gray-700/15 dark:text-gray-400';
  return `<span class="${badgeClass} px-2 rounded-full capitalize">${value}</span>`;
}



// let gridApi: any;
// let gridColumnApi: any;

// const onGridReady = (params: any) => {
//   gridApi = params.api;
//   gridColumnApi = params.columnApi;

//   // Hide a specific column by updating and setting column state
//   const columnState = gridColumnApi.getColumnState().map((col: any) => {
//     if (col.colId === 'someColumnId') {
//       return { ...col, hide: true };
//     }
//     return col;
//   });
//   gridColumnApi.setColumnState(columnState);

//   // Auto size columns
//   gridApi?.sizeColumnsToFit();
// };


// window.addEventListener('resize', () => {
//   if (gridApi) {
//     gridApi.sizeColumnsToFit();
//   }
// });

// const observer = new ResizeObserver(() => {
//   if (gridApi) {
//     gridApi.sizeColumnsToFit();
//   }
// });

// onMounted(() => {
//   const gridContainer = document.querySelector('.ag-theme-quartz');
//   if (gridContainer) {
//     observer.observe(gridContainer);
//   }
// });



function getActionButtons(reservationId: number): string {
  return `
    <div class="mt-2 space-x-4">
      <button class="action-btn" data-action="edit" data-id="${reservationId}">
        <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>
      </button>
      <button class="action-btn" data-action="delete" data-id="${reservationId}">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `;
}


const onCellClick = (event: any) => {
  const button = event.event.target.closest('button');
  console.log('Button clicked:', button);

  if (!button) {
    console.error('No button found');
    return;
  }

  const action = button.dataset.action;
  const reservationId = button.dataset.id;

  console.log('Action:', action, 'Reservation ID:', reservationId);

  if (action === 'edit') {
    selectedReservation.value = reservations.value.find((r: any) => r.id === Number(reservationId));
    router.push({ name: 'EditBooking', params: { id: reservationId } })
    console.log("Editing reservation:", selectedReservation.value);
  } else if (action === 'delete') {
    selectedReservationId.value = reservationId
    modalShow.value = true

  }
};



// const handleDeleteReservation = async (reservationId: number) => {
//   try {

//     deleteReservation(reservationId)
//     toast.success(t('toast.reservationDelete'))
//     console.log(`Suppression de la réservation avec ID: ${reservationId}`);
//     reservations.value = reservations.value.filter((r:any )=> r.id !== reservationId);
//   } catch (error) {
//     console.error('Erreur lors de la suppression:', error);
//   }
// };


const confirmDelete = async () => {
  if (selectedReservationId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteReservation(selectedReservationId.value)
      toast.success(t('toast.reservationDelete'))
      reservations.value = reservations.value.filter((r:any ) => r.id !== selectedReservationId.value)
      console.log(`Suppression de la réservation ID: ${selectedReservationId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      loadingDelete.value = false
      modalShow.value = false
      selectedReservationId.value = null
    }
  }
}

// const getSelectedRows = (event: SelectionChangedEvent) => {
//   const selected = event.api.getSelectedRows();
//   console.log('Selected row:', selected);
// };
const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}



</script>

<style scoped>

</style>
