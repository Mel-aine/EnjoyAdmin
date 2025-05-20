<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5 relative">
        <!-- Add/Import Dropdown -->
        <button class="border border-gray-300 bg-purple-400 rounded-lg" @click="toggleDropdown">
          <svg class="h-8 w-8 text-white" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div v-if="isDropdownOpen" class="absolute right-0 mt-10 w-44 bg-white rounded-lg shadow z-50">
          <ul class="py-2 text-sm text-gray-700">
            <li><button @click="modalOpen = true" class="block px-4 py-2 hover:text-purple-600">{{ $t('addProduct') }}</button></li>
            <li><button class="block px-4 py-2 hover:text-purple-600">{{ $t('import') }}</button></li>
          </ul>
        </div>
      </div>

      <!-- Data Table -->
      <div class="space-y-5 sm:space-y-6 h-screen mt-10">
        <ComponentCard title="" >
        <ag-grid-vue
          class="ag-theme-quartz"
          :rowData="productData"
          :columnDefs="columnDefs"
          rowHeight="50"
          :rowSelection="'single'"
          :pagination="true"
          :domLayout="'autoHeight'"
          @cellClicked="onCellClick"
          @gridReady="onGridReady"
          :defaultColDef="defaultColDef"
          :autoSizeStrategy="autoSizeStrategy"
        />
      </ComponentCard>
      </div>
    </AdminLayout>

    <!-- Modal Add Product -->
    <Modal v-if="modalOpen" @close="close">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <!-- Close button -->
          <button
            @click="close"
            class="absolute right-5 top-5 p-1 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700"
          >
            <svg class="fill-current" width="30" height="30" viewBox="0 0 24 24">
              <path
                d="M6.04 16.54a1 1 0 1 0 1.42 1.42L12 13.41l4.54 4.55a1 1 0 0 0 1.42-1.42L13.41 12l4.55-4.54a1 1 0 0 0-1.42-1.42L12 10.59 7.46 6.04a1 1 0 0 0-1.42 1.42L10.59 12l-4.55 4.54Z"
              />
            </svg>
          </button>

          <h4 class="text-2xl font-semibold text-gray-800 mb-6">{{ isEditing ? $t('editProduct') : $t('addProductDetail') }}</h4>

          <form class="flex flex-col space-y-4" @submit.prevent = "addProduct">
            <div class="custom-scrollbar h-[500px] overflow-y-auto p-2">
            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-6">
              <Input :lb="$t('productCode')" :placeholder="$t('Code')" :id="'code'" :forLabel="'code'" v-model="newProduct.code" />
              <Input :lb="$t('productName')" :placeholder="$t('Name')" :id="'name'" :forLabel="'name'" v-model="newProduct.name" />
              <Input :lb="$t('quantity')" :placeholder="$t('quantity')" :id="'quantity'" :forLabel="'quantity'" v-model.number="newProduct.quantity" />
              <Input :lb="$t('price')" :placeholder="'1000 FCFA'" :id="'price'" :forLabel="'price'" v-model.number="newProduct.price"/>
              <Select :lb="$t('Suppliers')"  :options="suppliers" v-model.number="newProduct.supplier" />
              <Select :lb="$t('category')" :options="categories" v-model.number="newProduct.category" />
              <Select :lb="$t('Status')" :options="statusOptions" v-model="newProduct.status" />
            </div>
            </div>
            <div class="flex items-center gap-3 justify-end pt-4">
              <button
                @click="close"
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {{ $t('Cancel') }}
              </button>
              <button
                type="submit"
                class="rounded-lg bg-purple-500 px-4 py-2.5 text-sm text-white hover:bg-purple-600"
              >

                <span v-if="!isLoading">{{ isEditing ? $t('edit') : $t('addProduct')  }}</span>
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
  <ModalDelete v-if="show" @close="show = false"
      @delete="confirmDelete"
      :isLoading="loadingDelete"/>
</template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from "@/components/profile/Modal.vue";
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { createProduct,getCategory,getSupplier,getProduct,updateProduct,deleteProduct} from "@/services/api";
import Spinner from '@/components/spinner/Spinner.vue';
import { useServiceStore } from '@/composables/serviceStore';
import { useToast } from 'vue-toastification'
import { useI18n } from "vue-i18n";
import { ref,watch,onMounted,computed } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ComponentCard from "@/components/common/ComponentCard.vue";
import ModalDelete from "@/components/modal/ModalDelete.vue";
import type {
  ColDef,
  GridReadyEvent,
  ICellRendererParams
} from 'ag-grid-community';

const modalOpen = ref(false);
const isDropdownOpen = ref(false);
const currentPageTitle = ref("Product");
const isLoading= ref(false)
const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const serviceStore = useServiceStore();
const selected = ref<any>(null);
const selectedId = ref<number | null>(null);
const isEditing = ref(false)
const show = ref(false)
const loadingDelete = ref(false)
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
const newProduct = ref({
  name: "",
  code:"",
  quantity: null,
  supplier: null,
  status: "",
  category: null,
  price:null
});
const defaultColDef = {
  // sortable: true,
  // filter: true,
  // floatingFilter: true,
  // resizable: true,
};
const suppliers = ref<any[]>([]);
const categories = ref<any[]>([]);
const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
};

const productData = ref<any[]>([])
const statusOptions = computed(()=>[
  { value: 'coming_soon', label: t('coming_soon') },
  { value: 'active', label: t('active') },
  { value: 'out_of_stock', label:t('outofstock') },
]);



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
  { headerName: t('ID'), field: 'id'},
  { headerName: t('Code'), field: 'code' },
  { headerName: t('Name'), field: 'name' },
  { headerName: t('quantity'), field: 'quantityAvailable' },
  { headerName: t('price'), field: 'price' },
  // { headerName: t('Suppliers'), field: 'supplierId',valueGetter: (params: any) => getSupplierName(params.data.supplierId) },
  { headerName: t('Suppliers'), field: 'supplierName'},
  { headerName: t('category'), field: 'stockCategoryId',valueGetter: (params: any) => getCategoryName(params.data.stockCategoryId) },
  {
    headerName: t('Status'),
    field: 'status',
    cellRenderer: (params: ICellRendererParams) => {
      const val = params.value;
      const badge = val === 'In stock' ? 'bg-green-100 text-green-700' :
                    val === 'Faible Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-700';
      return `<span class="px-2 py-1 text-xs rounded-full ${badge}">${val}</span>`;
    }
  },
  { headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) }
]);

watch(() => locale.value, () => {
      columnDefs.value = [
      { headerName: t('ID'), field: 'id'},
      { headerName: t('Code'), field: 'code' },
      { headerName: t('Name'), field: 'name' },
      { headerName: t('quantity'), field: 'quantityAvailable' },
      { headerName: t('price'), field: 'price' },
      { headerName: t('Suppliers'), field: 'supplierName'},,
      { headerName: t('category'), field: 'stockCategoryId',valueGetter: (params: any) => getCategoryName(params.data.stockCategoryId) },
      {
        headerName: t('Status'),
        field: 'status',
        cellRenderer: (params: ICellRendererParams) => {
          const val = params.value;
          const badge = val === 'In stock' ? 'bg-green-100 text-green-700' :
                        val === 'Faible Stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-700';
          return `<span class="px-2 py-1 text-xs rounded-full ${badge}">${val}</span>`;
        }
      },
      { headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) }
]})

const fetchSupplier = async() => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getSupplier(serviceId);

    suppliers.value = response.data.map((item: any) => ({
      label: item.name,
      value: item.name
    }))

    console.log('cate:', suppliers.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  }

}

const fetchCategorie = async() => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getCategory(serviceId);

    categories.value = response.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }));
    console.log('cate:', categories.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  }

}
onMounted(async()=>{
  await fetchSupplier()
  await fetchCategorie ()
  await fetchProduct ()
})

const addProduct = async () => {
  isLoading.value=true
  const serviceId = serviceStore.serviceId;

  try {
    if (isEditing.value) {
      await updateData ()
      toast.success(t('toast.SucessUpdate'));

    }else{
    const payload = {
      code: newProduct.value.code,
      name:newProduct.value.name,
      quantity_available:newProduct.value.quantity,
      service_id : serviceId,
      stock_category_id : newProduct.value.category,
      price:newProduct.value.price,
      supplier_name : newProduct.value.supplier,
      // supplier_id : 1,
      status:newProduct.value.status

    };

    console.log("sup",payload)
    const response = await createProduct(payload);
    console.log('sup',response.data)

    if (response.status === 201) {
      toast.success(t('toast.Sucess'));
      modalOpen.value = false;
      newProduct.value = {
        name: "",
        code:"",
        quantity: null,
        supplier: null,
        status: "",
        category: null,
        price:null
       }
    } else {
      toast.error(t('toast.error'));
    }
  }
} catch (error) {
    console.error(error);
    toast.error(t('toast.error'));
  }finally{
    isLoading.value=false
  }
};

const fetchProduct = async() => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getProduct(serviceId);

    productData.value = response.data;
    productData.value.sort((a:any, b:any) => a.name.localeCompare(b.name));
    console.log('prod:', productData.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  }

}

const getSupplierName = (id: number) => {
  const found = suppliers.value.find((s:any) => s.value === Number(id));
  return found ? found.label : '';
};

const getCategoryName = (id: number) => {
  const found = categories.value.find((s:any) => s.value === id);
  return found ? found.label : '';
};

const close = () =>{
  modalOpen.value = false;
  isEditing.value = false
      newProduct.value = {
        name: "",
        code:"",
        quantity: null,
        supplier: null,
        status: "",
        category: null,
        price:null
       }
}

const onGridReady = (params: GridReadyEvent) => console.log('Grid Ready', params);
// const onCellClick = (event: CellClickedEvent) => console.log('Clicked', event.data);
// const getSelectedRows = (event: SelectionChangedEvent) => {
//   const selected = event.api.getSelectedRows();
//   console.log('Selected row:', selected);
// };



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
    const productEdit = productData.value.find((r: any) => r.id === Number(id));
    console.log("Editing :",  productEdit);

    if (productEdit) {
      selected.value = productEdit;
      newProduct.value.name =  productEdit.name
      newProduct.value.code =  productEdit.code
      newProduct.value.quantity =  productEdit.quantityAvailable
      newProduct.value.supplier=  productEdit.supplierId
      newProduct.value.status=  productEdit.status
      newProduct.value.category=  productEdit.stockCategoryId
      newProduct.value.price=  productEdit.price

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
      name:newProduct.value.name ,
      code:newProduct.value.code ,
      quantity:newProduct.value.quantity,
      supplier_id:newProduct.value.supplier,
      status:newProduct.value.status,
      stock_category_id:newProduct.value.category,
      price:newProduct.value.price,

    };

    await updateProduct(id, Payload);
    newProduct.value = {
        name: "",
        code:"",
        quantity: null,
        supplier: null,
        status: "",
        category: null,
        price:null
       }
    selected.value = null;
    isEditing.value = false;
    modalOpen.value = false;

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);

  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = async () => {
  if (selectedId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteProduct(selectedId.value)
      toast.success(t('toast.DeletedSuccess'))
      productData.value = productData.value.filter((r: any) => r.id !== selectedId.value);
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

</script>

<style scoped>
/* Custom styling if needed */
</style>
