<template>
  <div>
    <AdminLayout>
      <FullScreenLayout>
        <PageBreadcrumb :pageTitle="$t('products')" />
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
              <li><button @click="modalOpen = true" class="block px-4 py-2 hover:text-purple-600">{{ $t('addProduct')
              }}</button></li>
              <li><button @click="importProducts" class="block px-4 py-2 hover:text-purple-600">{{ $t('importProduct')
              }}</button></li>
            </ul>
          </div>
        </div>

        <!-- Data Table -->
        <div class="space-y-5 sm:space-y-6 mt-10">

          <TableComponent :items="titles" :datas="filteredProductWithNames" :filterable="true" :pagination="true"
            :loading="loading" :showHeader="true" :title="$t('products')" :pageSize="15" :showButtonAllElement="true"
            @edit="onEditProduct" @delete="onDeleteProduct" class="modern-table" />
        </div>
      </FullScreenLayout>
    </AdminLayout>

    <!-- Modal Add Product -->
    <Modal v-if="modalOpen" @close="close">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <!-- Close button -->
          <button @click="close"
            class="absolute right-5 top-5 p-1 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700">
            <svg class="fill-current" width="30" height="30" viewBox="0 0 24 24">
              <path
                d="M6.04 16.54a1 1 0 1 0 1.42 1.42L12 13.41l4.54 4.55a1 1 0 0 0 1.42-1.42L13.41 12l4.55-4.54a1 1 0 0 0-1.42-1.42L12 10.59 7.46 6.04a1 1 0 0 0-1.42 1.42L10.59 12l-4.55 4.54Z" />
            </svg>
          </button>

          <h4 class="text-2xl font-semibold text-gray-800 mb-6">{{ isEditing ? $t('editProduct') :
            $t('addProductDetail') }}</h4>

          <form class="flex flex-col space-y-4" @submit.prevent="addProduct">
            <div class="custom-scrollbar h-[500px] overflow-y-auto p-2">
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-6">
                <Input :lb="$t('productCode')" :placeholder="$t('Code')" :id="'code'" :forLabel="'code'"
                  v-model="newProduct.code" />
                <Input :lb="$t('productName')" :placeholder="$t('Name')" :id="'name'" :forLabel="'name'"
                  v-model="newProduct.name" />
                <Input :lb="$t('quantity')" :placeholder="$t('quantity')" :id="'quantity'" :forLabel="'quantity'"
                  v-model.number="newProduct.quantity" />
                <Input :lb="$t('price')" :placeholder="'1000 FCFA'" :id="'price'" :forLabel="'price'"
                  v-model.number="newProduct.price" />
                <Select :lb="$t('Suppliers')" :options="suppliers" v-model.number="newProduct.supplier" />
                <Select :lb="$t('category')" :options="categories" v-model.number="newProduct.category" />
                <!-- <Select :lb="$t('Status')" :options="statusOptions" v-model="newProduct.status" /> -->
              </div>
            </div>
            <div class="flex items-center gap-3 justify-end pt-4">
              <button @click="close" type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                {{ $t('Cancel') }}
              </button>
              <button type="submit" class="rounded-lg bg-purple-500 px-4 py-2.5 text-sm text-white hover:bg-purple-600">

                <span v-if="!isLoading">{{ isEditing ? $t('edit') : $t('addProduct') }}</span>
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
  <ModalDelete v-if="show" @close="show = false" @delete="confirmDelete" :isLoading="loadingDelete" />
  <Spinner v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50">
    <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
  </Spinner>
</template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from "@/components/profile/Modal.vue";
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { createProduct, getCategory, getSupplier, getProduct, updateProduct, deleteProduct } from "@/services/api";
import Spinner from '@/components/spinner/Spinner.vue';
import { useServiceStore } from '@/composables/serviceStore';
import { useToast } from 'vue-toastification'
import { useI18n } from "vue-i18n";
import { ref, watch, onMounted, computed } from 'vue';
import TableComponent from "@/components/tables/TableComponent.vue";
import ModalDelete from "@/components/modal/ModalDelete.vue";
import { defaultProducts } from "@/assets/data/productCategories";
import FullScreenLayout from "@/components/layout/FullScreenLayout.vue";


const modalOpen = ref(false);
const isDropdownOpen = ref(false);
const loading = ref(false)
const isLoading = ref(false)
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

interface Product {
  name: string,
  code: string,
  quantity: string | number | undefined,
  supplier: string | number | undefined,
  status: string,
  category: string | number | undefined,
  price: string | number | undefined


}
const newProduct = ref<Product>({
  name: "",
  code: "",
  quantity: 0,
  supplier: '',
  status: "",
  category: '',
  price: 0
});

const suppliers = ref<any[]>([]);
const categories = ref<any[]>([]);
const productData = ref<any[]>([])
const statusOptions = computed(() => [
  { value: 'active', label: t('active') },
  { value: 'out_of_stock', label: t('outofstock') },
]);




const titles = computed(() => [
  {
    name: 'id',
    label: t('ID'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'code',
    label: t('Code'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'name',
    label: t('Name'),
    type: 'text',
    isTranslatable: true,
    filterable: false,
  },
  {
    name: 'quantityAvailable',
    label: t('quantity'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'price',
    label: t('price'),
    type: 'currency',
    filterable: true,
  },
  {
    name: 'supplierName',
    label: t('Suppliers'),
    type: 'text',
    filterable: true,
  },
  {
    name: 'categoryName',
    label: t('category'),
    type: 'text',
    filterable: true,
    isTranslatable: true

  },
  // {
  //   name: 'statusColor',
  //   label: t('Status'),
  //   type: 'badge',
  //   filterable: false,
  // },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'Edit',
        event: 'edit',
        icone: ` <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
            <line x1="16" y1="5" x2="19" y2="8" />
          </svg>`,
      },
      {
        name: 'Delete',
        event: 'delete',
        icone: `<svg class="h-5 w-5 text-red-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>`,
      },
    ],
  },
])

const onEditProduct = (product: any) => handleProductAction('edit', product)
const onDeleteProduct = (product: any) => handleProductAction('delete', product)

const handleProductAction = (action: string, product: any) => {
  if (action === 'edit') {
    const productEdit = productData.value.find((r: any) => r.id === Number(product.id));
    console.log("Editing :", productEdit);

    if (productEdit) {
      selected.value = productEdit;
      newProduct.value.name = productEdit.name
      newProduct.value.code = productEdit.code
      newProduct.value.quantity = productEdit.quantityAvailable
      newProduct.value.supplier = productEdit.supplierId
      newProduct.value.status = productEdit.status
      newProduct.value.category = productEdit.stockCategoryId
      newProduct.value.price = productEdit.price

      isEditing.value = true;
      modalOpen.value = true;

    }
  } else if (action === 'delete') {
    selectedId.value = product.id
    show.value = true
  }
}


const fetchSupplier = async () => {
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

const fetchCategorie = async () => {
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

onMounted(async () => {
  loading.value = true
  await fetchSupplier()
  await fetchCategorie()
  await new Promise(resolve => setTimeout(resolve, 500))
  await fetchProduct()
  loading.value = false
})


const addProduct = async () => {
  isLoading.value = true
  const serviceId = serviceStore.serviceId;

  try {
    if (isEditing.value) {
      await updateData()
      toast.success(t('toast.SucessUpdate'));

    } else {
      const payload = {
        code: newProduct.value.code,
        name: newProduct.value.name,
        quantity_available: newProduct.value.quantity,
        service_id: serviceId,
        stock_category_id: newProduct.value.category,
        price: newProduct.value.price,
        supplier_name: newProduct.value.supplier,
        // supplier_id : 1,
        status: 'active'

      };

      console.log("sup", payload)
      const response = await createProduct(payload);
      console.log('sup', response.data)

      if (response.status === 201) {
        toast.success(t('toast.Sucess'));
        fetchProduct()
        modalOpen.value = false;
        newProduct.value = {
          name: "",
          code: "",
          quantity: 0,
          supplier: '',
          status: "",
          category: '',
          price: 0
        }
      } else {
        toast.error(t('toast.error'));
      }
    }
  } catch (error) {
    console.error(error);
    toast.error(t('toast.error'));
  } finally {
    isLoading.value = false
  }
};

const fetchProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getProduct(serviceId);

    productData.value = response.data.map((p: any) => {
      const statusClasses = getStatusColor(p.status).split(' ');
      return {
        ...p,
        name: t(p.name),
        statusColor: {
          label: p.status,
          bg: statusClasses[0],
          text: statusClasses[1]
        },

      }
    });
    productData.value.sort((a: any, b: any) => a.name.localeCompare(b.name));
    console.log('prod:', productData.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  }

}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    case 'checked-in':
      return 'bg-purple-100 text-purple-700';
    case 'checked-out':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getSupplierName = (id: number) => {
  const found = suppliers.value.find((s: any) => s.value === Number(id));
  return found ? found.label : '';
};

const getCategoryName = (id: number) => {
  const found = categories.value.find((s: any) => s.value === id);
  return found ? found.label : '';
};

const filteredProductWithNames = computed(() => {
  return productData.value.map((prod: any) => ({

    ...prod,
    categoryName: getCategoryName(prod.stockCategoryId),

  }))
})


const close = () => {
  modalOpen.value = false;
  isEditing.value = false
  newProduct.value = {
    name: "",
    code: "",
    quantity: 0,
    supplier: '',
    status: "",
    category: '',
    price: 0
  }
}





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
      name: newProduct.value.name,
      code: newProduct.value.code,
      quantity_available: newProduct.value.quantity,
      supplier_name: newProduct.value.supplier,
      status: 'active',
      stock_category_id: newProduct.value.category,
      price: newProduct.value.price,
      // supplier_id : 1,
    };
    console.log("Payload", Payload)


    await updateProduct(id, Payload);
    newProduct.value = {
      name: "",
      code: "",
      quantity: 0,
      supplier: '',
      status: "",
      category: '',
      price: 0
    }
    selected.value = null;
    isEditing.value = false;
    modalOpen.value = false;
    fetchProduct()

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

const importProducts = () => {
  const productCategories = defaultProducts;
  isLoading.value = true
  try {
    const serviceId = serviceStore.serviceId;
    console.log('categories.value:', categories.value);
    productCategories.forEach(async (category: any) => {
      const categoryId = categories.value.find((s: any) => s.label === category.name)?.value;
      if (!categoryId) {
        console.error(`Category not found for name: ${category.name}`);
        return;
      }
      console.log('Category ID:', categoryId);
      for (const product of category.products) {
        const productPayload = {
          code: product.code,
          name: product.name,
          quantity_available: 0,
          service_id: serviceId,
          stock_category_id: categoryId,
          price: 0,
          supplier_name: null,
          status: 'active',
        };
        const productResponse = await createProduct(productPayload);
        console.log('Product created:', productResponse.data);
      }
      toast.success(t('toast.importSuccess'));
      fetchProduct();
      isLoading.value = false;

    });
  } catch (e: any) {
    console.error('Error importing products:', e);
    isLoading.value = false;
    toast.error(t('toast.importError'));
  }
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
