<template>
  <div class="">
    <AdminLayout>
      <div class="min-h-screen">
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <!-- <div ref="dropdownRef"> -->
        <div class="flex justify-end pb-5 ">
          <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <button
          class="border border-gray-300 bg-purple-400 rounded-lg relative"
          >
          <svg class="h-8 w-8 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
            </button>
          </template>
          </DropdownMenu>
        </div>
      <!-- </div> -->
    <ComponentCard title="">
    <div class="space-y-5 sm:space-y-6">
      <ag-grid-vue class="ag-theme-quartz" :rowData="flattenServiceProducts" :columnDefs="columnDefs" rowHeight="50"
      :rowSelection="'single'"  :domLayout="'autoHeight'" :autoSizeStrategy="autoSizeStrategy"
      :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady"
      ></ag-grid-vue>
    </div>
  </ComponentCard>
  </div>

    </AdminLayout>
  <Modal v-if="modalOpen" @close="closeModal()">
    <template #body>
      <div
      class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
      <!-- close btn -->
      <button
      @click="closeModal()"
      class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
      >
      <svg
      class="fill-current"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      >
      <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
      fill=""
      />
      </svg>
      </button>
  <div class="px-2 pr-14">
    <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
      {{ isEditMode ? $t('EditRoom') : $t('AddRoom') }}
    </h4>

  </div>
  <form @submit.prevent="handleSubmit" class="flex flex-col">
    <div class="custom-scrollbar h-[458px] overflow-y-auto p-2">
      <div class="space-y-8">
        <!-- Section principale -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('RoomInformation') }}</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Input
              :lb="$t('Name')"
              :id="'name'"
              :forLabel="'name'"
              v-model="formData.name"
            />

            <Input
              :lb="$t('Rent')"
              :placeholder="'Ex: 1000 FCFA'"
              :id="'rent'"
              :forLabel="'rent'"
              v-model="formData.rent"
            />
            <Select
              :lb="$t('Status')"
              :options="status"
              v-model="formData.status"
            />
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ $t('Description') }}
              </label>
              <textarea
                 v-model="formData.description"
                :placeholder="$t('Largetext')"
                rows="6"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"

              ></textarea>
            </div>

          </div>
        </div>

        <!-- Options par défaut -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('DefaultOptions') }}</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="option in defaultOptions" :key="option.id">
              <Select
                :lb="option.optionName"
                :options="option.values"
                v-model="formData.options[option.id]"
              />
            </div>
          </div>
        </div>

        <!--  Bouton options supplémentaires -->
        <div>
          <button
            @click.prevent="show = !show"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span v-if="!show">➕ {{ $t('Addotheroptions') }}</span>
            <span v-else>➖ {{ $t('Hideoptions') }}</span>
          </button>
        </div>

  <!--  Options supplémentaires -->
        <div v-if="show">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-4">{{ $t('AdditionalOptions') }}</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="option in hideOptions" :key="option.id">
              <Select
                :lb="option.optionName"
                :options="option.values"
                v-model="formData.options[option.id]"
              />
            </div>
          </div>
        </div>
      </div>


    </div>
    <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
    <!-- Bouton Cancel -->
    <button
      @click="closeModal()"
      type="button"
      class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
      :disabled="isLoading"
    >
      {{ $t('Cancel') }}
    </button>

    <!-- Bouton Add Room avec Spinner intégré -->
    <button
      type="submit"
      :disabled="isLoading"
      class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto"
    >
      <span v-if="!isLoading"> {{ isEditMode ? $t('EditRoom') : $t('AddRoom') }}</span>
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
<ModalDelete v-if="Show" @close="Show = false"
      @delete="confirmDelete"
      :isLoading="loadingDelete"/>
</template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { ref,onMounted,computed,nextTick ,watch} from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent,ICellRendererParams} from 'ag-grid-community';
import { getOptions,createRoom,createRoomOptions,getServiceProductWithOptions,getTypeProduct,updateRoom,updateRoomOptions,deleteServiceProduct} from "@/services/api";
import type { OptionType,ServiceProductType,ProductOptionType,RoomTypeData } from '@/types/option'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue';
import { useServiceStore } from '@/composables/serviceStore';
import { useAuthStore } from '@/composables/user';
import { useI18n } from "vue-i18n";
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import ModalDelete from "@/components/modal/ModalDelete.vue";


const { t, locale } = useI18n({ useScope: "global" });
const serviceStore = useServiceStore();
const userStore = useAuthStore();
const isLoading = ref(false);
const loadingDelete = ref(false)
const selectedRoomId = ref<number | null>(null)
const Show=ref(false)
const toast = useToast()
const modalOpen = ref(false)
const options = ref<OptionType[]>([])
const roomTypeData = ref<RoomTypeData[]>([])
const isDropdownOpen = ref(false);
const show = ref(false)
const ServiceProduct = ref<ServiceProductType[]>([]);
const currentPageTitle = computed(()=>t("RoomList"));
const selectedRoom = ref<any>(null);
const isEditMode = ref(false);
const menuItems = computed(()=> [
  { label: t('AddRoom'), onClick: () => OpenModal() },
])
const formData = ref({
  name: '',
  status: '',
  description: '',
  rent: '',
  options: {} as Record<number, any>,
})
const status = ref([
{value: 'available', label: t('Available')},
{value: 'maintenance', label: t('Maintenance')},
{value: 'occupied', label: t('Occupied')},
])


const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
const fetchOptions = async () => {
  try {
    const response = await getOptions()
    console.log(response.data.data)
    options.value = response.data.data.map((el:any)=>{
      return {
...el,        values: el.values.map((val: any) => ({value: val, label: val}))
      }
    })
    console.log(".....",options.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}

const fetchRoomType = async () => {
  try {
    const response = await getTypeProduct()

    roomTypeData.value = response.data.data
  .filter((type: any) => type.status === 'Active')
  .map((item: any) => ({
    ...item,
    value: item.id,
    label: item.name,
  }));


  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}





const defaultOptions = computed(() =>
  options.value.filter((option: OptionType) => option.isDefault === false)
)

const hideOptions = computed(() =>
  options.value.filter((option: OptionType) => option.isDefault === true)
)




// onMounted(() => {
//   fetchOptions()
//   fetchRoomType()
// })

const defaultOptionsMap = computed(() => {
  const map: Record<number, OptionType> = {};
    options.value.forEach((opt: OptionType) => {
    map[opt.id] = opt;
  });
  return map;
});


const saveFormData = async () => {
  isLoading.value = true;
  try {
    const roomPayload = {
      service_id: serviceStore.serviceId,
      product_name: formData.value.name,
      product_type: 'HotelSuite',
      description: formData.value.description,
      status: formData.value.status,
      price: formData.value.rent,
      created_by : userStore.UserId ,
      last_modified_by: userStore.UserId
    };
    console.log('roomId',  roomPayload);

    const roomResponse = await createRoom(roomPayload);
    const roomId = roomResponse.data.id;
    console.log('roomId', roomId);

    const optionsPayload = Object.entries(formData.value.options).map(
      ([id, value]: [string, any]) => {
        const optionMeta = defaultOptionsMap.value[Number(id)];
        return {
          service_product_id: roomId,
          option_id: Number(id),
          option_type: optionMeta?.type || null,
          value: value,
          created_by : userStore.UserId ,
          last_modified_by : userStore.UserId
        };
      }
    );

    console.log('optionsPayload', optionsPayload);

    const optionsResponse = await createRoomOptions({
      data: optionsPayload
    });
    closeModal()
    fetchServiceProduct()

    //renitialisation des champs
    formData.value = {
      name: '',
      status: '',
      description: '',
      rent: '',
      options: {}
    }

    toast.success(t('toast.roomCreated'))
    console.log('roomPayload', roomPayload);
    console.log('optionsResponse', optionsResponse);
    console.log('optionsPayload', optionsPayload);

  } catch (error) {
    console.error('Error while saving', error);
  }finally {
    isLoading.value = false;
  }
};



const fetchServiceProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getServiceProductWithOptions(serviceId);
    const serviceProducts = response.data;

          if (Array.isArray(serviceProducts)) {
        console.log('response.data est un tableau');
        const serviceProductWithOptions = serviceProducts.map((product: any) => {
          const associatedOptions = product.options.filter((option: any) => option.serviceProductId == product.id);
          return {
            ...product,
            options: associatedOptions
          };
        });
        ServiceProduct.value = serviceProductWithOptions;
      } else {
        console.error("response.data n'est pas un tableau.");
        console.log(response.data);
      }



    console.log("Service Products avec options (depuis backend):", ServiceProduct.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};

onMounted(async() => {
  await fetchOptions()
 await fetchServiceProduct()

})

const flattenServiceProducts = computed(() => {
  return ServiceProduct.value.map((product:any) => {
    const flatProduct:ProductOptionType = {
      ...product,
    }
    console.log("00000",flatProduct)

    product.options?.forEach((option:any) => {
      const key = `option_${option.optionId}`
      flatProduct[key] = option.value;
    });


    return flatProduct;
  });
});

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 140,
}
const columnDefs = ref<ColDef[]>([
{ headerName: t('Name'), field: 'productName' ,

},
// {
//   headerName: 'Room Type',
//   field: 'productTypeId',
//   valueFormatter: params => {
//       const type = roomTypeData.value.find((t:any) => t.id === params.value);
//       return type ? type.name : 'Unknown';
//     },

// },

{ headerName: t('Rent'), field: 'price' },
{
  headerName: t('Status'),
  field: 'status',

  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'available') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Available</span>`;
    } else if (params.value === 'booked') {
      return `<span class="bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 rounded-full px-2">Booked</span>`;
    }
    else if (params.value === 'occupied') {
      return `<span class="bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400 rounded-full px-2">Occupied</span>`;
    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Maintenance</span>`;
    }
  }
},

{
  headerName: t('AccommodationType'),
  field: 'option_1',

},
{ headerName: t('BedType'), field: 'option_2' },
{ headerName: t('View'), field: 'option_3' },
{ headerName: t('Balcony'), field: 'option_4' },
{ headerName: t('Terrace'), field: 'option_5' },
{ headerName: t('AirConditioning'), field: 'option_6' },
{ headerName: t('Wi-fi'), field: 'option_7' },
{ headerName: t('BreakfastIncluded'), field: 'option_8' },
{ headerName: t('PrivateBathroom'), field: 'option_9'},
{ headerName: t('Kitchen / Kitchenette'), field: 'option_10' },
{ headerName: t('WashingMachine'), field: 'option_11' },
{ headerName: t('RoomSize(sqm)'), field: 'option_12' },
{ headerName: t('NumberofRooms'), field: 'option_13' },
{ headerName: t('MaximumOccupancy'), field: 'option_14' },
{ headerName: t('TV'), field: 'option_15' },
{ headerName: t('MiniBar'), field: 'option_16' },
{ headerName: t('SafeDepositBox'), field: 'option_17' },
{ headerName: t('ExtraBed'), field: 'option_18' },
{ headerName: t('WheelchairAccessible'), field: 'option_19' },
{ headerName: t('PrivatePool'), field: 'option_20' },
{ headerName: t('Jacuzzi/Spa'), field: 'option_21' },
{ headerName: t('SmokingAllowed'), field: 'option_22' },
{ headerName: t('PetsAllowed'), field: 'option_23' },
{ headerName: t('Housekeeping'), field: 'option_24' },
{ headerName: t('Parking'), field: 'option_25' },
{ headerName: t('RoomService'), field: 'option_26' },
{ headerName: t('SelfCheck-in'), field: 'option_27' },
{ headerName: t('HouseRules'), field: 'option_30' },
{ headerName: t('Check-inTime'), field: 'option_28' },
{ headerName: t('Check-outTime'), field: 'option_29' },
{ headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) },

]);


watch(() => locale.value, () => {
      columnDefs.value = [

    { headerName: t('Name'), field: 'productName' ,

    },

    { headerName: t('Rent'), field: 'price' },
    {
      headerName: t('Status'),
      field: 'status',

      cellRenderer: (params:ICellRendererParams) => {
        if (params.value === 'available') {
          return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Available</span>`;
        }else if (params.value === 'booked') {
          return `<span class="bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 rounded-full px-2">Booked</span>`;
        }
         else if (params.value === 'occupied') {
          return `<span class="bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400 rounded-full px-2">Occupied</span>`;
        } else {
          return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Maintenance</span>`;
        }
      }
      },

      {
        headerName: t('AccommodationType'),
        field: 'option_1',

      },
      { headerName: t('BedType'), field: 'option_2' },
      { headerName: t('View'), field: 'option_3' },
      { headerName: t('Balcony'), field: 'option_4' },
      { headerName: t('Terrace'), field: 'option_5' },
      { headerName: t('AirConditioning'), field: 'option_6' },
      { headerName: t('Wi-fi'), field: 'option_7' },
      { headerName: t('BreakfastIncluded'), field: 'option_8' },
      { headerName: t('PrivateBathroom'), field: 'option_9'},
      { headerName: t('Kitchen / Kitchenette'), field: 'option_10' },
      { headerName: t('WashingMachine'), field: 'option_11' },
      { headerName: t('RoomSize(sqm)'), field: 'option_12' },
      { headerName: t('NumberofRooms'), field: 'option_13' },
      { headerName: t('MaximumOccupancy'), field: 'option_14' },
      { headerName: t('TV'), field: 'option_15' },
      { headerName: t('MiniBar'), field: 'option_16' },
      { headerName: t('SafeDepositBox'), field: 'option_17' },
      { headerName: t('ExtraBed'), field: 'option_18' },
      { headerName: t('WheelchairAccessible'), field: 'option_19' },
      { headerName: t('PrivatePool'), field: 'option_20' },
      { headerName: t('Jacuzzi/Spa'), field: 'option_21' },
      { headerName: t('SmokingAllowed'), field: 'option_22' },
      { headerName: t('PetsAllowed'), field: 'option_23' },
      { headerName: t('Housekeeping'), field: 'option_24' },
      { headerName: t('Parking'), field: 'option_25' },
      { headerName: t('RoomService'), field: 'option_26' },
      { headerName: t('SelfCheck-in'), field: 'option_27' },
      { headerName: t('HouseRules'), field: 'option_30' },
      { headerName: t('Check-inTime'), field: 'option_28' },
      { headerName: t('Check-outTime'), field: 'option_29' },
      { headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) }


      ];
    }, { immediate: true });


function getActionButtons(roomId: number): string {
  return `
    <div class="mt-2 space-x-4">
      <button class="action-btn" data-action="edit" data-id="${roomId}">
        <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
        </svg>
      </button>
      <button class="action-btn" data-action="delete" data-id="${roomId}">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `;
}

const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};
const onCellClick = (event: any) => {
  const button = event.event.target.closest('button');
  console.log('Button clicked:', button);

  if (!button) {
    console.error('No button found');
    return;
  }

  const action = button.dataset.action;
  const roomId = button.dataset.id;

  console.log('Action:', action, 'Room ID:', roomId);

  if (action === 'edit') {
    const roomToEdit = flattenServiceProducts.value.find((r: any) => r.id === Number(roomId));

    if (roomToEdit) {
      selectedRoom.value = roomToEdit;
      formData.value.name = roomToEdit.productName.toString();
      formData.value.description = roomToEdit.description.toString();
      formData.value.rent = roomToEdit.price.toString();
      formData.value.status = roomToEdit.status.toString();
      const optionsList: Record<number, string> = {};

        if (Array.isArray(roomToEdit.options)) {
          roomToEdit.options.forEach((opt: any) => {
            optionsList[opt.optionId] = opt.value;
          });
        }

        formData.value.options = optionsList;
      console.log("Editing reservation:",  formData.value.options);

      isEditMode.value = true;

      nextTick(() => {
        modalOpen.value = true;
      });
    }
  } else if (action === 'delete') {
    selectedRoomId.value = roomId
    Show.value=true
  }
};

const confirmDelete = async () => {
  if (selectedRoomId.value !== null) {
    loadingDelete.value = true
    try {
      await deleteServiceProduct(selectedRoomId.value)
      toast.success(t('toast.roomDelete'))
      ServiceProduct.value = ServiceProduct.value.filter((r: any) => r.id !== selectedRoomId.value);
      fetchServiceProduct()
      console.log(`Suppression du room  ID: ${selectedRoomId.value}`)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      loadingDelete.value = false
      Show.value = false
      selectedRoomId.value = null
    }
  }
}




const updateFormData = async () => {
  isLoading.value = true;
  try {
    const roomPayload = {
      service_id: serviceStore.serviceId,
      product_name: formData.value.name,
      product_type: 'HotelSuite',
      description: formData.value.description,
      status: formData.value.status,
      price: formData.value.rent
    };

    const roomId = selectedRoom.value?.id;
    if (!roomId) {
      throw new Error("Aucune chambre sélectionnée pour la mise à jour.");
    }

    console.log('Mise à jour de la chambre ID:', roomId);
    await updateRoom(roomId, roomPayload);

    const optionsPayload = Object.entries(formData.value.options).map(
      ([id, value]: [string, any]) => {
        const optionMeta = defaultOptionsMap.value[Number(id)];
        return {
          service_product_id: roomId,
          option_id: Number(id),
          option_type: optionMeta?.type || null,
          value: value
        };
      }
    );

    console.log('Payload des options à mettre à jour:', optionsPayload);
    await updateRoomOptions(roomId, optionsPayload);

    toast.success(t('toast.updateRoom'));

    // Réinitialisation du formulaire
    formData.value = {
      name: '',
      status: '',
      description: '',
      rent: '',
      options: {}
    };
    fetchServiceProduct()
    selectedRoom.value = null;
    isEditMode.value = false;
    modalOpen.value = false;

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error(t('toast.Error'));
  } finally {
    isLoading.value = false;
  }
};



const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEditMode.value) {
      await updateFormData()
    } else {
      await saveFormData()
    }
    // router.push('/reservations') // Redirige une fois terminé
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  formData.value = {
      name: '',
      status: '',
      description: '',
      rent: '',
      options: {}
    };
  isEditMode.value = false;
  modalOpen.value = false;

};

const OpenModal = () =>{
  modalOpen.value=true;
  isEditMode.value = false;
}

</script>

<style scoped>
/* Style amélioré pour le bouton */

</style>
