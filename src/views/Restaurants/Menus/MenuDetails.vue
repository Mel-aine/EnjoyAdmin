<script setup lang="ts">
    import DefaultCard from '@/components/common/DefaultCard.vue';
    import DefaultCardSkeleton from '@/components/common/DefaultCardSkeleton.vue';
    const NewMenuForm = defineAsyncComponent(() => import('./NewMenuForm.vue'));
    const Spinner = defineAsyncComponent(() => import('@/components/spinner/Spinner.vue'));
    import { defineAsyncComponent, onBeforeMount, ref,computed } from 'vue';
    import TableOne from '@/components/tables/TableOne.vue';
    import router from '@/router';
    const PopupModal = defineAsyncComponent(() => import('@/components/modal/PopupModal.vue'));
    import { fetchSingleMenu, deleteMenu, deleteMenuItem } from '@/services/database';
    const InputGroup2 = defineAsyncComponent(() => import('@/components/forms/FormElements/InputGroup2.vue'));
    import type { MenuRequest, Plat } from '@/services/serviceInterface';
    import { isExpiry } from '@/components/utilities/UtilitiesFunction';
    import AdminLayout from '@/components/layout/AdminLayout.vue';
    import { useI18n } from 'vue-i18n';
    // import type ToastPayload from '@/types/Toast';
    // import EventBus from '@/EventBus';


    const emits = defineEmits(['cancel', "go-back"]);
    const {t} = useI18n()
    interface Param {
        action: string,
        menucode: string
    }
    const menuCode = ref('');
    const menuInfo = ref<MenuRequest>({
        Code: "",
        Title: "",
        Description: "",
        StartDate: "",
        EndDate: ""
    });
    const titles = computed(()=>([
        {
            label: t('Title'),
            name: "Title",
            type: 'url',
            event: "view",
            filterable: false,
        },
        {
            name: 'BasePrice',
            type: "text",
            label: t('price'),
            filterable: true,
        },
        {
            name: 'QuantityAvailable',
            type: "text",
            label: t('quantity'),
            filterable: true,
        },
        {
            name: 'description',
            type: "text-rich",
            label: t('Description'),
            filterable: true,
        },
        {
            name: 'Actions',
            type: 'action',
            label: t('Actions'),
            actions: [
                {
                    name: "View",
                    icone: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                            <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                            <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" />
                        </svg>
                    `,
                    event: 'view'

                },
                {
                    name: "Delete",
                    icone: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                            <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                        </svg>
                    `,
                    event: 'delete'
                },
            ]
        }
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
    const isloading = ref(true);
    const action = ref('view');
    const isEditing = ref<Boolean>(false);
    const isCloning = ref<Boolean>(false);
    const isModalOpen = ref(false);
    const isDeleting = ref(false);
    const plats = ref<Plat[]>([{
        Code: "",
        BasePrice: 0,
        CategoryCode: "",
        content: [],
        Currency: "",
        Likes: 0,
        Title: "",
    }]);


    const viewPlat = (ts: any) => {
        console.log("** viewPlat", ts);
        window.location.href = `/plates/${ts.api}/view`
    }
    const deleteItemAction = async (ts: any) => {
        try {
            isDeleting.value = true;
            await deleteMenuItem([{
                "PlateCode": ts.Code,
                "MenuCode": menuInfo.value.Code
            }])

            // const toastPayload: ToastPayload = {
            //     type: "success",
            //     message: `Item ${ts.Title} deleted successfully ! 🍕`
            // }
            // EventBus.emit('showToast', toastPayload);
            await fetchMenu();
        } catch (e) {
            console.log("MenuDetails.deleteItemAction.error", e)
            // const toastPayload: ToastPayload = {
            //     type: "danger",
            //     message: `Something went wrong during the process ! 🍕`
            // }
            // EventBus.emit('showToast', toastPayload);
        }
        finally {
            isDeleting.value = false;
        }
    }
    const handleEditMenu = (e: any) => {
        console.log("handleEditMenu", menuInfo.value);
        isEditing.value = true;
        isCloning.value = false;
    }
    const handleDeleteMenu = (e: any) => {
        isModalOpen.value = true;
    }
    const handleCloneMenu = (e: any) => {
        isCloning.value = true;
        isEditing.value = false;
    }
    const handleCloseModal = () => {
        console.log('handleCloseModal')
        isModalOpen.value = false;
    }

    const deleteAction = async () => {
        try {
            isDeleting.value = true;
            await deleteMenu([{Code: menuInfo.value.Code}])
            router.push({path: '/menus'})
        } catch (e) {
            console.log("MenuDetails.handleDeleteMenu.error", e)
        }
        finally {
            isDeleting.value = false;
        }
    }
    const cancel = () => {
        isEditing.value = false;
        isCloning.value = false;
        window.location.reload();
    }
    const goBack = () => {
        // window.location.href = '/menus';
        window.history.back();
    }
    const fetchMenu = async () => {
        isloading.value = true;
        try {
            const params = router.currentRoute.value.params as unknown as Param;
            action.value = params.action;
            menuCode.value = params.menucode;

            const result = await fetchSingleMenu(menuCode.value);
            menuInfo.value = result[0].Menu;
            console.log('result[0].Menu', result[0].Menu)
            plats.value = result.map((item:any) => {
                let temp = {
                    ...item.Plat,
                    QuantityAvailable: item.QuantityAvailable,
                    description: "",
                    api: item.PlateCode
                }
                item.Plat.content.forEach((c: any) =>{
                    if(c.Typex.Code = "DESC"){temp.description = c.Typex.Title}
                })
                return temp
            });
        } catch (er) {
            console.log('error', er);
        } finally {
            isloading.value = false;
        }
    }


    onBeforeMount(async () => {
        await fetchMenu();
    });
</script>

<template>
    <!-- ====== Form Elements Section Start -->
    <AdminLayout>
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-1 mt-10 h-screen">
        <div class="flex flex-col gap-9">
            <!-- Input Fields Start -->
            <template v-if="!isEditing && !isCloning">
            <DefaultCard :cardTitle="`${menuInfo.Title}`" v-if="!isloading">
                <template v-slot:button>
                    <button class="flex items-center" @click="goBack">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>&nbsp;&nbsp;
                        <span class="text-nowrap">{{ $t('Goback') }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </button>
                </template>
                <template v-slot:header>
                    <div class="flex items-center justify-center">
                        <button v-if="!isExpiry(menuInfo.EndDate)" @click='handleEditMenu' class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{{ $t('edit') }}</button>
                        <button @click="handleCloneMenu" class="text-slate-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{{ $t('Clone') }}</button>
                        <button @click="handleDeleteMenu" class="text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{{ $t('delete') }}</button>
                    </div>
                </template>
                <form @submit.prevent="">
                    <div class="p-6.5">
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <input-group2 :label="$t('MenuCode')" type="text" customClasses="w-full xl:w-1/2" disabled v-model="menuInfo.Code" />

                            <input-group2 :label="$t('Title')" type="text" customClasses="w-full xl:w-1/2" disabled v-model="menuInfo.Title" />
                        </div>
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <input-group2 :label="$t('StartDate')" type="text" customClasses="w-full xl:w-1/2" disabled v-model="menuInfo.StartDate" />

                            <input-group2 :label="$t('EndDate')" type="text" customClasses="w-full xl:w-1/2" disabled v-model="menuInfo.EndDate" />
                        </div>
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row pr-5">
                            <input-group2 :label="$t('Description')" type="textarea" customClasses="w-full xl:w-1/2" disabled v-model="menuInfo.Description" />
                        </div>
                    </div>
                </form>

                <div class="w-full px-6 font-bold gap-2.5 py-2 hover:bg-opacity-90 lg:px-6 xl:px-6 text-white bg-gradient-to-r from-rose-800 to-rose-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 text-sm me-2 mb-2">
                    {{ $t('PLATELIST') }}
                </div>
                <div>
                    <TableOne :items="titles" :datas="plats" :options="filterOptions" @view="viewPlat" @delete="deleteItemAction" :filterable="false"/>
                </div>
            </DefaultCard>
            </template>
            <template v-else-if="isEditing">
                <NewMenuForm  @cancel="cancel"  :action="'update'" :menu="menuInfo" :plats="plats"/>
            </template>
            <template v-else-if="isCloning">
            <NewMenuForm  @cancel="cancel"  :action="'clone'" :menu="menuInfo" :plats="plats"/>
            </template>
            <DefaultCardSkeleton v-if="isloading"/>
            <!-- Input Fields End -->
        </div>

        <PopupModal :message="$t('areyou')" :is-open="isModalOpen" v-if="isModalOpen" @close="handleCloseModal" :title="$t('Menudeletion')">
            <template v-slot:footer>
                <div class="bg-slate-50 px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                    <button @click="deleteAction" type="button" class="h-10 text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 text-center mb-2 flex justify-center items-center flex-nowrap">{{ $t('delete') }}<span v-if="isDeleting" class="flex items-center justify-center">&nbsp;&nbsp;&nbsp;<spinner/></span></button>
                    <button @click="handleCloseModal" class="h-10 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-slate-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-purple-500 dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                        <span class="h-9 relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-slate-900 rounded-md group-hover:bg-opacity-0">
                            {{ $t('Cancel') }}
                        </span>
                    </button>
                </div>
            </template>
        </PopupModal>
        <!-- <SpinnerOverPage v-if="isloading" /> -->
    </div>
    <!-- ====== Form Elements Section End -->
    </AdminLayout>
</template>
<style scoped></style>
