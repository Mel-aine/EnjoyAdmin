<!-- <script setup lang="ts">
import { ref, defineAsyncComponent, computed, onMounted,defineEmits,defineProps } from 'vue';
import InputGroup2 from '@/components/forms/FormElements/InputGroup2.vue';
import Spinner from '@/components/spinner/Spinner.vue';
const SelectGroupOne = defineAsyncComponent(() => import('@/components/forms/FormElements/SelectGroupOne.vue'));
import type { Content, Product } from '@/services/serviceInterface';
import type Option from '@/components/utilities/interfaceModel';
import { createProduct, generateCode, createContent, updateProduct, uploadContent,fetchCategoriesProduct } from '@/services/database';
import DefaultCard from '@/components/common/DefaultCard.vue';
import { useServiceStore } from '@/composables/serviceStore'
import { useToast } from 'vue-toastification'
import { useI18n } from "vue-i18n";

const Categories = ref<any []>([]);
const serviceStore = useServiceStore()
const isLoading = ref<Boolean>(false);
const { t } = useI18n();
const toast = useToast()
const emits = defineEmits(['cancel', "save", "back", "created"]);
const props = defineProps({
        action: {
            type: String,
        },
        product: {
            type: Object
        }
});
const productInfo = ref<any>({
        "Code": "",
        "Title": "",
        "Description": "",
        "QuantityUnitCode": "",
        "AvailableQuantity": 0,
        "CategoryCode": "",

});
const saveProduct = async () => {
       console.log('product', productInfo.value)
       isLoading.value = true
       const serviceId = serviceStore.serviceId;
       try {
            let result:any = null;
            let result2:any = null;
            if(productInfo.value.Title) {productInfo.value.Code = props.action == "add" ? generateCode(productInfo.value.Title) : productInfo.value.Code}
            const payload = {
                "code": productInfo.value.Code,
                "name": productInfo.value.Title,
                "description": productInfo.value.Description,
                // "QuantityUnitCode": productInfo.value.QuantityUnitCode,
                "quantity": productInfo.value.AvailableQuantity,
                "category_id": productInfo.value.CategoryCode,
                "status":"active",
                "service_id" : serviceId
            }

            if(props.action == "add"){
                //creation du product
                result = await createProduct(payload);

                // if(result[0] && result[0].success == true) {
                //     //upload de l'image vers le bucket
                //     if(productInfo.value.Image){
                //         const uploadDedImage = await uploadContent(productInfo.value.Image);
                //         //liaison de l'image avec le le produit (création du content)
                //         if(uploadDedImage){
                //             const payload2:Content [] = [{
                //                 "ProductCode": productInfo.value.Code,
                //                 "Body": productInfo.value.Description,
                //                 "TypeCode": "DESC",
                //                 "DisplayOrder": 1
                //             },{
                //                 "ProductCode": productInfo.value.Code,
                //                 "Body": uploadDedImage,
                //                 "TypeCode": "COVER",
                //                 "DisplayOrder": 2
                //             }]
                //             // result2 = await createContent(payload2);
                //             console.log("payload2",payload2)
                //         }
                //     }
                // }
                productInfo.value = {
                  "Code": "",
                  "Title": "",
                  "Description": "",
                  "QuantityUnitCode": "",
                  "AvailableQuantity": 0,
                  "CategoryCode": "",

                }
            } else if(props.action == "update") {
                result = await updateProduct(payload);
                if(result.success == true) {
                    const payload2:Content [] = [{
                        "ProductCode": productInfo.value.Code,
                        "Body": productInfo.value.Description,
                        "TypeCode": "DESC",
                        "DisplayOrder": 1
                    },{
                        "ProductCode": productInfo.value.Code,
                        "Body": "https://e7.pngegg.com/pngimages/319/935/png-clipart-yellow-onion-red-onion-pearl-onion-white-onion-onion-food-onion-thumbnail.png",
                        "TypeCode": "COVER",
                        "DisplayOrder": 2
                    }]
                    result2 = await createContent(payload2);
                    console.log("updateProduct", result);
                }
            }


            console.log("'NewProductForm.saveProduct.createProduct", result)
            console.log("'NewProductForm.saveProduct.createContent", result2)

            toast.success(t('toast.Sucess'))
            emits('created', true)
       } catch (error:any) {
            console.log('error: ', error);
            toast.success(t('toast.error'))

       } finally {
            isLoading.value = false;
       }
    }

    const getCategory = async () => {
        const result = await fetchCategoriesProduct();
           Categories.value = result;
        console.log('result: ', result)

    }
    onMounted(()=>{
      getCategory()
    })
    const categoryOption = computed(() => {
        const results = Categories.value.filter((plateCat: any) => plateCat.parentCategoryId === 121 )
        const result = results.map((plateCat: any) => {
            return {
                name: plateCat.categoryName,
                api: plateCat.id
            }
        }) as Option []

        return result;


    })



    const kitchenOption : Option[] = [
        { "name": "📏 Gram", "api": "G" },
        { "name": "⚖️ Kilogram", "api": "KG" },
        { "name": "📏 Milligram", "api": "MG" },
        { "name": "💧 Liter", "api": "L" },
        { "name": "💧 Milliliter", "api": "MD" },
        { "name": "💧 Centiliter", "api": "CL" },
        { "name": "🥄 Teaspoon", "api": "TSP" },
        { "name": "🥄 Tablespoon", "api": "TBSP" },
        { "name": "☕ Cup", "api": "CUP" },
        { "name": "🍺 Pint", "api": "PT" },
        { "name": "🥤 Fluid ounce", "api": "FLOZ" },
        { "name": "📏 Ounce", "api": "OZ" },
        { "name": "⚖️ Pound", "api": "LB" },
        { "name": "🛢️ Gallon", "api": "GAL" },
        { "name": "👌 Pinch", "api": "PINCH" },
        { "name": "👈 Dash", "api": "DASH" },
        { "name": "🍶 Quart", "api": "QT" },
        { "name": "🛢️ Barrel", "api": "BBL" }
    ]


    const stopAction = () => {
        emits('cancel');
    }
    const getAction = (act:string | undefined) => {
        switch (act) {
            case "edit":
                return "Update"
            case "clone":
                return "Clone"
            case "add":
                return "Save"
            default:
                return "Update"
        }
    }
    const goBack = () => {
        emits('back');
    }


    // onMounted(() => {
    //     if(props.action == "update"){
    //         if(props.product){
    //             productInfo.value = props.product
    //         }
    //     }
    //     console.log('props', props)
    // });
</script> -->
<script setup lang="ts">
    import { ref, defineAsyncComponent, computed, onMounted } from 'vue';
    import SelectGroupSearchable from '@/components/Forms/SelectGroup/SelectGroupSearchable.vue';
    import DefaultCard from '@/components/common/DefaultCard.vue';
    import InputGroup2 from '@/components/forms/FormElements/InputGroup2.vue';
    import type { Content, Product } from '@/services/serviceInterface';
    import { useConfigStore } from '@/composables/config';
    import Spinner from '@/components/spinner/Spinner.vue';
    import type Option from '@/components/utilities/interfaceModel';
    import { createProduct, generateCode, createContent, updateProduct, uploadContent } from '@/services/database';
    const SelectGroupOne = defineAsyncComponent(() => import('@/components/forms/FormElements/SelectGroupOne.vue'));
    import { useToast } from 'vue-toastification'
    import { useI18n } from "vue-i18n";





    const { t } = useI18n();
    const toast = useToast()


    const configStore = useConfigStore();
    const isSaving = ref<Boolean>(false);
    const emits = defineEmits(['cancel', "save", "back", "created"]);
    const props = defineProps({
        action: {
            type: String,
        },
        product: {
            type: Object
        }
    });
    const productInfo = ref<Product>({
        "Code": "",
        "Title": "",
        "Description": "",
        "QuantityUnitCode": "",
        "AvailableQuantity": 0,
        "CategoryCode": "",
        "Image": ""
    });
    const saveProduct = async () => {
       console.log('product', productInfo.value)
       try {
            let result:any = null;
            let result2:any = null;
            if(productInfo.value.Title) {productInfo.value.Code = props.action == "add" ? generateCode(productInfo.value.Title) : productInfo.value.Code}
            const payload = {
                "Code": productInfo.value.Code,
                "Title": productInfo.value.Title,
                "Description": productInfo.value.Description,
                "QuantityUnitCode": productInfo.value.QuantityUnitCode,
                "AvailableQuantity": productInfo.value.AvailableQuantity,
                "CategoryCode": productInfo.value.CategoryCode
            }

            isSaving.value = true;
            if(props.action == "add"){
                //creation du product
                result = await createProduct(payload);
                if(result[0] && result[0].success == true) {
                    //upload de l'image vers le bucket
                    if(productInfo.value.Image){
                        const uploadDedImage = await uploadContent(productInfo.value.Image);
                        //liaison de l'image avec le le produit (création du content)
                        if(uploadDedImage){
                            const payload2:Content [] = [{
                                "ProductCode": productInfo.value.Code,
                                "Body": productInfo.value.Description,
                                "TypeCode": "DESC",
                                "DisplayOrder": 1
                            },{
                                "ProductCode": productInfo.value.Code,
                                "Body": uploadDedImage,
                                "TypeCode": "COVER",
                                "DisplayOrder": 2
                            }]
                            result2 = await createContent(payload2);
                        }
                    }
                }
            } else if(props.action == "update") {
                result = await updateProduct(payload);
                if(result.success == true) {
                    const payload2:Content [] = [{
                        "ProductCode": productInfo.value.Code,
                        "Body": productInfo.value.Description,
                        "TypeCode": "DESC",
                        "DisplayOrder": 1
                    },{
                        "ProductCode": productInfo.value.Code,
                        "Body": "https://e7.pngegg.com/pngimages/319/935/png-clipart-yellow-onion-red-onion-pearl-onion-white-onion-onion-food-onion-thumbnail.png",
                        "TypeCode": "COVER",
                        "DisplayOrder": 2
                    }]
                    result2 = await createContent(payload2);
                    console.log("updateProduct", result);
                }
            }


            console.log("'NewProductForm.saveProduct.createProduct", result)
            console.log("'NewProductForm.saveProduct.createContent", result2)

            // const toastPayload: ToastPayload = {
            //     type: "success",
            //     message: `Product ${props.action == "update" ? "Updated" : "Created"} successfully. Happy meal 🍕`
            // }
            // EventBus.emit('showToast', toastPayload);
            // productInfo.value = {
            //     "Code": "",
            //     "Title": "",
            //     "Description": "",
            //     "QuantityUnitCode": "",
            //     "AvailableQuantity": 0,
            //     "CategoryCode": "",
            //     "Image": ""
            // }
            emits('created', true)
       } catch (error:any) {
            console.log('error: ', error);
            console.log('Trace', error.stack)
            // const errMsg = error.response.data.body ? error.response.data.body.errors[0].message : "Oups, something went wrong during the processing";
            // const payload: ToastPayload = {
            //     type: "danger",
            //     message: errMsg
            // }
            // EventBus.emit('showToast', payload);
       } finally {
            isSaving.value = false;
       }
    }

    const categoryOption = computed(() => {
        console.log("configStore.productCategories", configStore.productCategories)
        const result = configStore.productCategories.map((prodCat: any) => {
            return {
                name: prodCat.Title,
                api: prodCat.Code
            }
        }) as Option []

        return result;
    })

    const kitchenOption : Option[] = [
        { "name": "📏 Gram", "api": "G" },
        { "name": "⚖️ Kilogram", "api": "KG" },
        { "name": "📏 Milligram", "api": "MG" },
        { "name": "💧 Liter", "api": "L" },
        { "name": "💧 Milliliter", "api": "MD" },
        { "name": "💧 Centiliter", "api": "CL" },
        { "name": "🥄 Teaspoon", "api": "TSP" },
        { "name": "🥄 Tablespoon", "api": "TBSP" },
        { "name": "☕ Cup", "api": "CUP" },
        { "name": "🍺 Pint", "api": "PT" },
        { "name": "🥤 Fluid ounce", "api": "FLOZ" },
        { "name": "📏 Ounce", "api": "OZ" },
        { "name": "⚖️ Pound", "api": "LB" },
        { "name": "🛢️ Gallon", "api": "GAL" },
        { "name": "👌 Pinch", "api": "PINCH" },
        { "name": "👈 Dash", "api": "DASH" },
        { "name": "🍶 Quart", "api": "QT" },
        { "name": "🛢️ Barrel", "api": "BBL" }
    ]


    const stopAction = () => {
        emits('cancel');
    }
    const getAction = (act:string | undefined) => {
        switch (act) {
            case "edit":
                return "Update"
            case "clone":
                return "Clone"
            case "add":
                return "Save"
            default:
                return "Update"
        }
    }
    const goBack = () => {
        emits('back');
    }


    onMounted(() => {
        if(props.action == "update"){
            if(props.product){
                productInfo.value = props.product
            }
        }
        console.log('props', props)
    });
</script>

<template>
    <!-- ====== Form Elements Section Start -->
  <div class="pt-20 h-screen">
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-1 ">
        <div class="flex flex-col gap-9">
            <!-- Input Fields Start -->
            <DefaultCard :cardTitle="`${getAction(props.action)} Product`">
                <template v-slot:button>
                    <button class="flex items-center" @click="goBack">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>&nbsp;&nbsp;
                        <span class="text-nowrap">{{ 'Go back' }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </button>
                </template>

                <form @submit.prevent="saveProduct">
                    <div class="p-6.5">
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row items-start">
                            <input-group2 label="Title" type="text" placeholder="Enter the product title"
                                customClasses="w-full xl:w-1/2" v-model="productInfo.Title" required />
                            <select-group-one label="category" :options="categoryOption" :placeholder="'Select the category'"
                                class="w-full xl:w-1/2" v-model="productInfo.CategoryCode" required/>
                        </div>
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row items-start">

                              <input-group2 label="Quantity" type="number" min="1"
                                customClasses="w-full xl:w-1/2 md:w-full" v-model="productInfo.AvailableQuantity" required />

                            <select-group-one label="Unit" :options="kitchenOption" :placeholder="'Select the unit'"
                                    class="w-full xl:w-1/2" v-model="productInfo.QuantityUnitCode" required/>
                        </div>
                        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row items-start">
                            <input-group2 label="Image" type="file" placeholder=""
                                customClasses="w-full xl:w-1/2"  />
                            <input-group2 label="Describe the product" type="textarea" placeholder="Enter the description of your product"
                                customClasses="xl:w-1/2 md:w-full" v-model="productInfo.Description" required />
                        </div>

                         <!-- <template v-if="props.action != 'clone'">
                             <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <SelectGroupSearchable customClasses="w-full xl:w-1/2" :items="plateList" @item-selected="handleSelection" label="Select a plate" placeholder="Select a plate ..." :required="false" :resetTrigger="resetInput">
                                    <template v-slot:action>
                                        <input min="1" type="number" v-model="quantity" required class="w-15 h-10 rounded border-[1.5px] text-black border-stroke bg-transparent ml-2 py-1.5 px-1 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-slate-50 dark:disabled:bg-black  dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
                                        <button-action @click='handdleAddPlate' type="button" custom-classes=" mx-2 h-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm mr-0 py-2.5 text-center">
                                            add
                                        </button-action>
                                    </template>
                                </SelectGroupSearchable>
                            </div>



                             <div v-if="plateListToadd.length > 0">
                                <TableOne :items="titles" :datas="plateListToadd" :options="filterOptions" @remove="handleRemovePlace" @increment="handleIncrement" @decrement="handleDecrement" :filterable="false" :pagination="false"/>
                            </div>
                            <div v-else class="text-center py-4">
                                Please add a plate ;P
                            </div>
                        </template>  -->

                        <div class="flex justify-end mt-10">
                            <button @click="stopAction" type="button" class="text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                {{ 'Cancel' }}
                            </button>
                            <button type="submit" class="flex flex-nowrap text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">

                                <span v-if="!isSaving">{{ getAction(props.action)}} </span>
                                <span v-else class="flex items-center gap-2">
                                  <Spinner class="w-4 h-4" />
                                  {{ $t('Processing') }}...
                                </span>
                            </button>
                        </div>
                    </div>
                </form>

                </DefaultCard>
            <!-- Input Fields End -->
        </div>
    </div>
  </div>
    <!-- ====== Form Elements Section End -->
</template>
