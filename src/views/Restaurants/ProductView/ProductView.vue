<!-- <script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref,onMounted } from 'vue'
import TableOne from '@/components/Tables/TableOne.vue';
import router from '@/router';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { fetchProduct,fetchCategoriesProduct } from '@/services/database';
import { useServiceStore } from '@/composables/serviceStore'
import { useI18n } from "vue-i18n";
const NewProductForm = defineAsyncComponent(() => import('@/views/Restaurants/ProductView/NewProductForm.vue'));
const serviceStore = useServiceStore()
const Categories = ref<any[]>([])
const { t, locale } = useI18n({ useScope: "global" });
const isloading = ref(false);
const products = ref([]);
const rawProducts = ref([]);
const isViewing = ref(true)
const created = ref(false)
const selectedProduct = ref<any>();
// const viewProduct = (ts: any) => {
//         isViewing.value = true;
//         selectedProduct.value = rawProducts.value.filter((item:any) => item.Code == ts.Code)[0];
//         window.location.href = `/products/${selectedProduct.value.Code}/view`;
// }

const columnDefs = ref<ColDef[]>([
  { headerName: t('code'), field: 'code' },
  {
    headerName: t('Name'),
    field: 'name',
  },
  {
    headerName: t('Description'),
    field: 'description',
  },
  {
    headerName: t('Quantity'),
    field: 'quantity',
  },
  {
    headerName: t('Category'),
    field: 'categoryName',
  },
  {
    headerName: t('Actions'),sortable: false,filter: false,
    cellRenderer: (params: any) => getActionButtons(params.data.id)
  }
])

function getActionButtons(id: number): string {
  return `
    <div class="flex space-x-2 mt-2">
        <button class="p-1" data-action="edit" data-id="${id}">
          <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
            <line x1="16" y1="5" x2="19" y2="8" />
          </svg>
        </button>
        <button class="p-1" data-action="delete" data-id="${id}">
          <svg class="h-5 w-5 text-red-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </button>
      </div>
  `;
}

const getCategory = async () => {
        const result = await fetchCategoriesProduct();
           Categories.value = result;
        console.log('result: ', result)

}

const fetProduct = async () => {
    isloading.value = true;
    const serviceId = serviceStore.serviceId;
    try {
        const result = await fetchProduct(serviceId);
        const productList = result.map((product: any) => {
        const category = Categories.value.find((cat: any) => cat.id === product.categoryId);
        return {
            ...product,
            categoryName: category ? category.categoryName : 'Unknown'
          };
        });
        products.value = productList;

    } catch (er) {
        console.log('error', er);

    } finally {
        isloading.value = false;
    }
};

onMounted(async () => {
  await getCategory();
  await fetProduct();
});

    // onBeforeMount(async () => {
    //     await fetProduct();
    // });
    const cancel = () => {
        console.log("cancelled")
        isViewing.value = true;
        if(created.value == true){
            console.log('reload')
            location.reload()
        }
    }
    const handleCreate = () => {
        created.value = true;
    }
    const handleAddProduct = (e:any) => {
        isViewing.value = false;

    }



const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}
</script> -->

<script setup lang="ts">
    import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
    import TableOne from '@/components/Tables/TableOne.vue';
    import { fetchConfig, fetchProduct } from '@/services/database';
    import router from '@/router';
    import { useConfigStore } from '@/composables/config';
    import AdminLayout from '@/components/layout/AdminLayout.vue';

    const pageTitle = 'Product';

    const NewProductForm = defineAsyncComponent(() => import('@/views/Restaurants/ProductView/NewProductForm.vue'));
    const titles = ref([
        {
            name: 'Image',
            label: 'image',
            type: 'image',
            event: "view",
        },
        {
            name: 'Title',
            label: 'Title',
            type: 'url',
            event: "view",
            filterable: true,
        },
        {
            name: 'Description',
            type: "text",
            label: 'Description',
        },
        {
            name: 'Category',
            type: "text",
            label: 'Category',
            filterable: true,
        },
        {
            name: 'AvailableQuantity',
            type: "text",
            label: 'Quantity',
            filterable: false,
        }
    ]);
    const filterOptions = ref([
        {
            name: 'All',
            api: '',
        },
        {
            name: 'Name',
            api: 'name',
        },
        {
            name: 'Category',
            api: 'category',
        }

    ]);
    const isloading = ref(false);
    const products = ref([]);
    const rawProducts = ref([]);
    const configStore = useConfigStore();

    const fetProduct = async () => {
        isloading.value = true;
        try {

            const result = await fetchProduct();
            const productList = result.map((product: any) => {
                let img = "";
                product.content.forEach((ctn: any) =>{
                    if(ctn.typex.Code ==  "COVER"){
                        img = ctn.Body
                    }
                })



                return {
                    ...Object.fromEntries(Object.entries(product).filter(([key]) => key !== "content")),
                    Image: img,
                    AvailableQuantity: `${product.AvailableQuantity} ${product.QuantityUnitCode}`,
                    Category: configStore.productCategories.filter((cat: any) => cat.Code == product.CategoryCode)[0]?.Title
                }
            });
            console.log("** productList", productList);
            products.value = productList;
            rawProducts.value = result;

        } catch (er) {
            console.log('error', er);
        } finally {
            isloading.value = false
        }
    }
    const isViewing = ref(true)
    const created = ref(false)
    const selectedProduct = ref<any>();
    const viewProduct = (ts: any) => {
        isViewing.value = true;
        selectedProduct.value = rawProducts.value.filter((item:any) => item.Code == ts.Code)[0];
        window.location.href = `/products/${selectedProduct.value.Code}/view`;
    }
    onBeforeMount(async () => {
        await fetProduct();
    });
    const cancel = () => {
        console.log("cancelled")
        isViewing.value = true;
        if(created.value == true){
            console.log('reload')
            location.reload()
        }
    }
    const handleCreate = () => {
        created.value = true;
    }
    const handleAddProduct = (e:any) => {
        isViewing.value = false;

    }
</script>

<template>
    <div class="">
      <AdminLayout>
        <div class=" h-screen mt-10" v-if="isViewing">
            <TableOne :items="titles" :datas="products" :options="filterOptions" @view="viewProduct" :filterable="true" :pagination="true">
                <template v-slot:headerButton>
                    <button @click="handleAddProduct" class="text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Add Product
                    </button>
                </template>
            </TableOne>
            <!-- <div class="min-h-screen">
              <div class="flex justify-end mb-4">
                <button @click="handleAddProduct" class="text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                          Add Product
                </button>
              </div>
              <ag-grid-vue
              class="ag-theme-quartz h-[600px]"
              :rowData="products"
              :columnDefs="columnDefs"
              :defaultColDef="defaultColDef"
              rowHeight="60"
              :rowSelection="'multiple'"
              :pagination="true"
              :paginationPageSize="10"

              :autoSizeStrategy="autoSizeStrategy"

            />
            </div> -->
        </div>

        <template v-if="!isViewing">
            <new-product-form @cancel="cancel" @back="cancel" :action="'add'" :created="handleCreate"></new-product-form>
        </template>
      </AdminLayout>
    </div>
</template>
