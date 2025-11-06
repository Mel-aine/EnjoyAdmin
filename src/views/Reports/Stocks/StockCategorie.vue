<template>
  <ReportsLayout>
    <div>
    <AdminLayout>
      <FullScreenLayout>
      <PageBreadcrumb :pageTitle="$t('StockCategory')" />

      <div class="flex justify-end my-10 gap-2">
        <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg" @click="modalOpen = true">
          {{ $t('addCategory') }}
        </button>
         <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg" @click="importDefault">
          {{ $t('importdefault') }}
        </button>
      </div>
      <div class=" mt-10">
        <TableComponent :items="titles" :datas="categories" :filterable="true" :pagination="true" :loading="loading"
          :showHeader="true" :title="$t('StockCategory')" :pageSize="15" :showButtonAllElement="true"
          @edit="onEditCategory" @delete="onDeleteCategory" class="modern-table" />
      </div>

      <Modal v-if="modalOpen" @close="modalOpen = false">
        <template #body>
          <div
            class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <!-- close btn -->
            <button @click="close"
              class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
              <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                  fill="" />
              </svg>
            </button>
            <h2 class="text-lg font-semibold mb-4">{{ isEditing ? $t('edit') : $t('NewCategory') }}</h2>
            <form @submit.prevent="addCategory">
              <Input :lb="t('Name')" v-model="newCategoryName" :id="'categoryName'" :forLabel="'categoryName'" />
              <div class="flex justify-end mt-4">
                <button :disabled="isLoading" type="submit"
                  class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">

                  <span v-if="!isLoading">{{ isEditing ? $t('edit') : $t('Save') }}</span>
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
      </FullScreenLayout>
    </AdminLayout>
    </div>
  </ReportsLayout>
  <ModalDelete v-if="show" @close="closed" @delete="confirmDelete" :isLoading="loadingDelete" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, defineAsyncComponent } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
const PageBreadcrumb = defineAsyncComponent(() => import("@/components/common/PageBreadcrumb.vue"));
import FullScreenLayout from "@/components/layout/FullScreenLayout.vue";
const Modal = defineAsyncComponent(() => import("@/components/profile/Modal.vue"));
import Input from "@/components/forms/FormElements/Input.vue";
import { createCategory, getCategory, deleteCategory, updateCategory } from "@/services/api";
import { useToast } from 'vue-toastification'
import { useI18n } from "vue-i18n";
import TableComponent from "@/components/tables/TableComponent.vue";
import Spinner from '@/components/spinner/Spinner.vue';
import { useServiceStore } from '@/composables/serviceStore';
const ModalDelete = defineAsyncComponent(() => import("@/components/modal/ModalDelete.vue"));
import { hotel_product_categories } from "@/assets/data/productCategories";
import ReportsLayout from '@/components/layout/ReportsLayout.vue';
// Données simulées
const categories = ref<any[]>([]);
const isLoading = ref(false)
const { t, locale } = useI18n({ useScope: "global" });
const toast = useToast()
const serviceStore = useServiceStore();
const modalOpen = ref(false);
const newCategoryName = ref("");
const isEditing = ref(false)
const show = ref(false)
const selectedId = ref<number | null>(null)
const loadingDelete = ref(false)
const loading = ref(false)

const selected = ref<any>(null);
const titles = computed(() => [
  {
    name: 'id',
    label: t('ID'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'name',
    label: t('Name'),
    type: 'text',
    filterable: true,
    isTranslatable:true
  },

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

const onEditCategory = (cat: any) => handleCategoryAction('edit', cat)
const onDeleteCategory = (cat: any) => handleCategoryAction('delete', cat)

const handleCategoryAction = (action: string, cat: any) => {
  if (action === 'edit') {
    const categorieEdit = categories.value.find((r: any) => r.id === Number(cat.id));
    console.log("Editing :", categorieEdit);

    if (categorieEdit) {
      selected.value = categorieEdit;
      newCategoryName.value = categorieEdit.name

      isEditing.value = true;
      modalOpen.value = true;

    }
  } else if (action === 'delete') {
    selectedId.value = cat.id
    show.value = true
  }
}

const importDefault = async () => {
  isLoading.value = true
  try {
    const serviceId = serviceStore.serviceId;
    const data = hotel_product_categories

    for (const category of data) {
      const payload = {
        name: category.name,
        service_id: serviceId,
        parent_category_id: 14
      };
      await createCategory(payload);
    }
    toast.success(t('toast.importSuccess'));
    fetchCategorie();
  } catch (error) {
    console.error('Erreur lors de l\'importation :', error);
    toast.error(t('toast.importError'));
  } finally {
    isLoading.value = false;
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
      name: newCategoryName.value,
      parent_category_id: 14
    };

    await updateCategory(id, Payload);
    newCategoryName.value = ''
    selected.value = null;
    isEditing.value = false;
    modalOpen.value = false;

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);

  } finally {
    isLoading.value = false;
  }
};

const closed = () => {
  modalOpen.value = false;
  newCategoryName.value = ''
}


const addCategory = async () => {
  isLoading.value = true
  const serviceId = serviceStore.serviceId;

  try {
    if (isEditing.value) {
      await updateData()
      fetchCategorie()
      toast.success(t('toast.SucessUpdate'));
    } else {
      const payload = {
        name: newCategoryName.value,
        service_id: serviceId,
        parent_category_id: 14

      };

      console.log("cate", payload)
      const response = await createCategory(payload);
      console.log('cat', response.data)

      if (response.status === 201) {
        newCategoryName.value = ''
        toast.success(t('toast.Sucess'));

        fetchCategorie()
        modalOpen.value = false;
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

const fetchCategorie = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getCategory(serviceId);

    categories.value = response.data;
    categories.value.sort((a: any, b: any) => a.name.localeCompare(b.name));
    console.log('cate:', categories.value);
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
  }

}

onMounted(async () => {
  loading.value = true
  await fetchCategorie()
  loading.value = false
})




const confirmDelete = async () => {
  if (selectedId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteCategory(selectedId.value)
      toast.success(t('toast.DeletedSuccess'))
      categories.value = categories.value.filter((r: any) => r.id !== selectedId.value);
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
const close = () => {
  modalOpen.value = false
  isEditing.value = false
  newCategoryName.value = ''
}

</script>
