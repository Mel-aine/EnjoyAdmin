<script setup lang="ts">
    import DefaultCard from '@/components/common/DefaultCard.vue';
    import DefaultCardSkeleton from '@/components/common/DefaultCardSkeleton.vue';
    const NewProductForm = defineAsyncComponent(() => import('./NewProductForm.vue'));
    // const Spinner = defineAsyncComponent(() => import('@/components/Utilities/Spinner.vue'));
    import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue';
    import router from '@/router';
    import { fetchSingleProduct } from '@/services/database';
    const InputGroup2 = defineAsyncComponent(() => import('@/components/forms/FormElements/InputGroup2.vue'));
    import type { Content, Product } from '@/services/serviceInterface';
    import { useConfigStore } from '@/composables/config';
    import AdminLayout from '@/components/layout/AdminLayout.vue';

    const configStore = useConfigStore();
    const emits = defineEmits(['cancel', "go-back"]);

    interface Param {
        action: string,
        productcode: string
    }
    const productCode = ref('');
    const productInfo = ref<Product>({
        "Code": "",
        "Title": "",
        "Description": "",
        "QuantityUnitCode": "",
        "AvailableQuantity": 0,
        "image": "",
        "CategoryCode": ""
    });
    const contentList = ref<Content []>([])

    const isloading = ref(true);
    const action = ref('view');
    const isEditing = ref<Boolean>(false);
    const isModalOpen = ref(false);
    const isDeleting = ref(false);
    const created = ref(false);

    const handleEditProduct = (e: any) => {
        isEditing.value = true;
    }
    const handleDeleteProduct = (e: any) => {
        isModalOpen.value = true;
    }
    const handleCloseModal = () => {
        console.log('handleCloseModal')
        isModalOpen.value = false;
    }
    const category = computed(() => {
        const cat: any = configStore.productCategories.filter((p:any) => p.Code == productInfo.value.CategoryCode)
        if(cat[0]) {return cat[0].Title}

        return "";
    })
    const quantity = computed(() => {
        if(productInfo.value.AvailableQuantity && productInfo.value.QuantityUnitCode){
            return productInfo.value.AvailableQuantity + ' ' + productInfo.value.QuantityUnitCode;
        }
        return "N/A";
    })
    const cover = computed(() => {
        if(contentList.value.length > 0 && contentList.value.filter((c: any) => c.TypeCode == "COVER")){
            return contentList.value.filter((c: any) => c.TypeCode == "COVER")[0].Body;
        }
        return "N/A";
    })



    const deleteAction = async () => {
        // try {
        //     isDeleting.value = true;
        //     await deleteProduct([{Code: productInfo.value.Code}])
        //     router.push({path: '/products'})
        // } catch (e) {
        //     console.log("ProductDetails.handleDeleteProduct.error", e)
        // }
        // finally {
        //     isDeleting.value = false;
        // }
    }
    const cancel = () => {
        isEditing.value = false;
        if(created.value){
            location. reload()
        }
    }
    const goBack = () => {
        // window.location.href = '/products';
        window.history.back();
    }
    const fetchProduct = async () => {
        isloading.value = true;
        try {
            const params = router.currentRoute.value.params as unknown as Param;
            action.value = params.action;
            productCode.value = params.productcode;

            const result = await fetchSingleProduct(productCode.value);

            productInfo.value = result.filter((p:any) => p.Code === productCode.value)[0];
            contentList.value = result.filter((p:any) => p.Code === productCode.value)[0].content.map((c: any) => {
                return {
                    "ProductCode": productCode.value,
                    "Body": c.Body,
                    "DisplayOrder": 0,
                    "TypeCode": c.typex.Code
                }
            })

            // console.log('productInfo', productInfo.value);
            // console.log('contentList', contentList.value);
            // console.log('result', result);


        } catch (er) {
            console.log('error', er);
        } finally {
            isloading.value = false;
        }
    }

    const handleCreate = () => {
        created.value = true;
    }


    onBeforeMount(async () => {
        await fetchProduct();
    });
</script>

<template>
  <AdminLayout>
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-1 min-h-screen">
        <div class="flex flex-col gap-9 mt-10">
            <!-- Input Fields Start -->
            <template v-if="!isEditing">
            <DefaultCard :cardTitle="`${productInfo.Title}`" v-if="!isloading">
                <template v-slot:button>
                    <button class="flex items-center" @click="goBack">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>&nbsp;&nbsp;
                        <span class="text-nowrap">{{ 'Go back' }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </button>
                </template>
                <template v-slot:header>
                    <div class="flex items-center justify-between w-full">
                        <img :src="cover" :alt="productInfo.Title" class="mb-1 ml-3 w-11 h-11 object-cover aspect-square rounded-lg">
                        <span>
                            <button @click='handleEditProduct' class="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Edit</button>
                            <button @click="handleDeleteProduct" class="text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Delete</button>
                        </span>
                    </div>
                </template>
                <form @submit.prevent="">
                    <div class="p-6.5">
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <input-group2 label="Product Name" type="text" customClasses="w-full xl:w-1/2" disabled v-model="productInfo.Title" />

                            <input-group2 label="Product Category" type="text" customClasses="w-full xl:w-1/2" disabled v-model="category" />
                        </div>
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <input-group2 label="Available Quantity" type="text" customClasses="w-full xl:w-1/2" disabled v-model="quantity" />

                            <input-group2 label="Description" type="textarea" customClasses="w-full xl:w-1/2" disabled v-model="productInfo.Description" />
                        </div>

                    </div>
                </form>
            </DefaultCard>
            </template>

            <template v-else-if="isEditing">
                <NewProductForm  @cancel="cancel"  :action="'update'" :product="productInfo" @back="cancel" :created="handleCreate"/>
            </template>

            <!-- <template v-else-if="isCloning">
                <NewProductForm  @cancel="cancel"  :action="'clone'" :product="productInfo" :plats="plats"/>
            </template> -->
            <DefaultCardSkeleton v-if="isloading"/>
            <!-- Input Fields End -->
        </div>
    </div>
  </AdminLayout>
</template>
<style scoped></style>
