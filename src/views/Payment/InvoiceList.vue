<template>
  <div class="">
    <AdminLayout>
      <div class="min-h-screen">
          <PageBreadcrumb :pageTitle="currentPageTitle" />
          <ag-grid-vue
              class="ag-theme-quartz"
              :rowData="Payments"
              :columnDefs="columnDefs"
              :rowHeight="50"
              :rowSelection="'single'"
              :domLayout="'autoHeight'"
              :autoSizeStrategy="autoSizeStrategy"
              :pagination="true"
              @cellClicked="onCellClick"
              @gridReady="onGridReady"
            ></ag-grid-vue>
        </div>
  </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted,watch,computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent,ICellRendererParams} from 'ag-grid-community';
import {getPayment} from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification'


const router = useRouter()
const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const currentPageTitle = computed(()=>t("RoomTypes"));
const selectedPayment = ref<any>(null)
const Payments = ref<any[]>([])

const fetchPayment = async () => {
  try {
    const response = await getPayment();
    console.log("....", response.data);
    Payments.value = Array.isArray(response.data) ? response.data : response.data.data;

    console.log(".....Payments.value", Payments.value);
  } catch (error) {
    console.error('fetch failed:', error);
  }
};






onMounted(async () => {
  await fetchPayment()
});


const columnDefs = ref<ColDef[]>([
  { headerName: t('Payment ID'), field: 'id' },
  {
    headerName: t('Date'),
    field: 'date',
    valueFormatter: ({ value }) => new Date(value).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  },
  {
    headerName: t('Amount (FCFA)'),
    field: 'amountPaid',
  },
  {
    headerName: t('Status'),
    field: 'status',
    cellRenderer: (params: ICellRendererParams) => getStatusBadge(params.value)
  },
  {
    headerName: t('Actions'),
    cellRenderer: (params: any) => getActionButtons(params.data.id)
  }
])


watch(() => locale.value, () => {
      columnDefs.value = [
      { headerName: t('Payment ID'), field: 'id' },
  {
    headerName: t('Date'),
    field: 'date',
    valueFormatter: ({ value }: { value: string })=> new Date(value).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  },
  {
    headerName: t('Amount (FCFA)'),
    field: 'amountPaid',
  },
  {
    headerName: t('Status'),
    field: 'status',
    cellRenderer: (params: ICellRendererParams) => getStatusBadge(params.value)
  },
  {
    headerName: t('Actions'),
    cellRenderer: (params: any) => getActionButtons(params.data.id)
  }
      ];
    }, { immediate: true });


function getStatusBadge(value: string): string {
  const badgeMap: Record<string, string> = {
    succeeded: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500',
    pending: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400',
    unpaid: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500',
  };

  const badgeClass = badgeMap[value] || 'bg-gray-200 text-gray-700 dark:bg-gray-700/15 dark:text-gray-400';
  return `<span class="${badgeClass} px-2 rounded-full capitalize">${value}</span>`;
}


const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};



function getActionButtons(id: number): string {
  return `
    <div class="mt-2 space-x-4">
      <button class="action-btn" data-action="print" data-id="${id}">
        <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2-4h6m-6-4v8m6-4h-6" />
        </svg>
      </button>
      <button class="action-btn bg-purple-100 text-purple-500 rounded-lg mx-2 px-2" data-action="view" data-id="${id}">
       view
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
  const id = button.dataset.id;

  console.log('Action:', action, 'ID:', id);

  if (action === 'view') {
    selectedPayment.value = Payments.value.find((r: any) => r.id === Number(id));
    router.push({ name: 'ViewInvoice', params: { id: id } })
    console.log("view payment:", selectedPayment.value);
  } else if (action === 'print') {
    // handlePrint(Number(id));
  }
};







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
