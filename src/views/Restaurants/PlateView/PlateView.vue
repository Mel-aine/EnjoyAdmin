<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref, watch,computed } from 'vue';
import TableOne from '@/components/Tables/TableOne.vue';
import { fetchPlate } from '@/services/database';
import type { PlateOption } from '@/services/serviceInterface';
import { useConfigStore } from '@/composables/config';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useI18n } from 'vue-i18n';
const NewPlateForm = defineAsyncComponent(() => import('@/views/Restaurants/PlateView/NewPlateForm.vue'));

const pageTitle = ref('Plate');
const {t} = useI18n()
const plateList = ref<Array<PlateOption>>([]);
const rawPlateList = ref([]);
const isloading = ref(false);
const isViewing = ref(true);
const selectedPlate = ref<any>();

const titles = computed(()=>([
    {
        name: 'Image',
        label: t('images'),
        type: 'image',
        event: "view",
    },
    {
        name: 'Title',
        label: t('Title'),
        type: 'url',
        event: "view",
        filterable: true,
    },
    {
        name: 'Description',
        type: "text",
        label: t('Description'),
        filterable: false,
    },
    {
        name: 'Category',
        type: "text",
        label: t('category'),
        filterable: false,
        style: "text-nowrap"
    },
    {
        name: 'BasePrice',
        type: "text",
        label: t('price'),
        filterable: false,
        style: "text-nowrap"
    },
]));

const filterOptions = computed(()=>([
      {
          name: t('All'),
          api: '',
      },
      {
          name: t('today'),
          api: 'today',
      },
      {
          name: t('thisweek'),
          api: 'thisweek',
      },
      {
          name: t('lastweek'),
          api: 'lastweek',
      },
      {
          name: t('thismonth'),
          api: 'thismonth',
      }

  ]));

const router = useRouter();
const configStore = useConfigStore();

const viewPlate = (ts: any) => {
    isViewing.value = true;
    selectedPlate.value = rawPlateList.value.find((item: any) => item.Code == ts.Code);
    window.location.href = `/plates/${selectedPlate.value.Code}/view`;
};

const getPlate = async () => {
    isloading.value = true;
    const result = await fetchPlate();
    plateList.value = result.map((item: any) => {
        let img = item.content.find((ctn: any) => ctn.typex.Code == "COVER")?.Body || "";
        return {
            ...item,
            Image: img,
            BasePrice: `€ ${item.BasePrice}`,
            Category: configStore.plateCategories?.find((cat: any) => cat.Code == item.CategoryCode)?.Title,
        };
    });

    plateList.value.sort((a, b) => (a.Title || '').localeCompare(b.Title || ''));
    rawPlateList.value = result;
    isloading.value = false;
};

onBeforeMount(async () => {
    isloading.value = true;
    await getPlate();
    if (router.currentRoute.value.query.action==='add') {
        isViewing.value = false;

    }else{
        isViewing.value = true;
    }

});
watch(() => router.currentRoute.value.path, async (newPath) => {
    if (newPath === '/plates') {
        isloading
        await getPlate();
        isViewing.value = true;
    }
});
const cancel = (payload: any) => {
    console.log("cancel", payload);
    isloading.value = true;
    isViewing.value = true;
    getPlate();
    router.push({ path: '/plates' });
};

const handleAddPlate = () => {
    isViewing.value = false;
    router.push({ path: '/plates', query: { action: 'add' } });
};
</script>

<template>
    <div class="">
      <AdminLayout>
        <div class="">
        <div class="flex flex-col gap-10 mt-20 " v-if="isViewing">
            <TableOne
                :items="titles"
                :datas="plateList"
                :options="filterOptions"
                @view="viewPlate"
                :filterable="true"
                :pagination="true"
            >
                <template v-slot:headerButton>
                    <button
                        @click="handleAddPlate"
                        class="text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        {{ $t('addPlat') }}
                    </button>
                </template>
            </TableOne>

        </div>


        <template v-if="!isViewing">
            <NewPlateForm @cancel="cancel" :action="'add'" />
        </template>
      </div>
      </AdminLayout>
    </div>
</template>
