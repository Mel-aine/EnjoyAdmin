<template>
  <div>
    <AdminLayout>
      <div class="min-h-screen">
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5">
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
    <ComponentCard title=" ">
      <div class="space-y-5 sm:space-y-6 ">
    <ag-grid-vue class="ag-theme-quartz" :rowData="customers" :columnDefs="columnDefs" rowHeight="50"
            :rowSelection="'single'"  :domLayout="'autoHeight'"
            :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady" :autoSizeStrategy="autoSizeStrategy"
             :defaultColDef="defaultColDef"></ag-grid-vue>
      </div>
    </ComponentCard>
    </div>

    </AdminLayout>

    <Modal v-if="modalOpen" @close="modalOpen = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="modalOpen = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700  dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
              {{ $t('AddCustomers') }}
            </h4>

          </div>
          <form class="flex flex-col">
            <div class="custom-scrollbar h-[450px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input :lb="$t('FirstName')"  :placeholder="$t('FirstName')"  :id="'name'" :forLabel="'name'" />
                  </div>

                  <div>
                    <Input :lb="$t('LastName')"  :placeholder="$t('LastName')" :id="'last'" :forLabel="'last'" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      {{ $t('Email') }}
                    </label>
                    <div class="relative">
                      <span
                        class="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.04175 7.06206V14.375C3.04175 14.6511 3.26561 14.875 3.54175 14.875H16.4584C16.7346 14.875 16.9584 14.6511 16.9584 14.375V7.06245L11.1443 11.1168C10.457 11.5961 9.54373 11.5961 8.85638 11.1168L3.04175 7.06206ZM16.9584 5.19262C16.9584 5.19341 16.9584 5.1942 16.9584 5.19498V5.20026C16.9572 5.22216 16.946 5.24239 16.9279 5.25501L10.2864 9.88638C10.1145 10.0062 9.8862 10.0062 9.71437 9.88638L3.07255 5.25485C3.05342 5.24151 3.04202 5.21967 3.04202 5.19636C3.042 5.15695 3.07394 5.125 3.11335 5.125H16.8871C16.9253 5.125 16.9564 5.15494 16.9584 5.19262ZM18.4584 5.21428V14.375C18.4584 15.4796 17.563 16.375 16.4584 16.375H3.54175C2.43718 16.375 1.54175 15.4796 1.54175 14.375V5.19498C1.54175 5.1852 1.54194 5.17546 1.54231 5.16577C1.55858 4.31209 2.25571 3.625 3.11335 3.625H16.8871C17.7549 3.625 18.4584 4.32843 18.4585 5.19622C18.4585 5.20225 18.4585 5.20826 18.4584 5.21428Z"
                            fill="#667085"
                          />
                        </svg>
                      </span>
                      <input

                        type="text"
                        placeholder="info@gmail.com"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                  <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Phone') }}
                </label>
                <div class="relative">
                  <div class="absolute">
                    <select
                      v-model="selectedCountry"
                      @change="updatePhoneNumber"
                      class="appearance-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
                    >
                      <option v-for="(code, country) in countryCodes" :key="country" :value="country">
                        {{ country }}
                      </option>
                    </select>
                    <div
                      class="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400"
                    >
                      <svg
                        class="stroke-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                          stroke=""
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
              </div>
              <input
                v-model="phoneNumber"
                placeholder="+237 693774450"
                type="tel"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-[84px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
                  </div>
                  <div>
                    <Select :lb="$t('LastPackage')" :options="Package"/>
                  </div>
                  <div>
                    <Select :lb="$t('Group')" :options="Group"/>
                  </div>
                  <div>
                    <Input :lb="$t('Address')"  :placeholder="$t('Address')" :id="'code'" :forLabel="'code'" />
                  </div>
                </div>
              </div>

            </div>
            <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <button
                @click="modalOpen = false"
                type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                {{ $t('Cancel') }}
              </button>
              <button

                type="button"
                class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
              >
               {{ $t('AddCustomer') }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
    <Modal v-if="showModal" @close="showModal= false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="showModal = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700  dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
          <div v-if="selectedCustomer" class="space-y-3">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 px-2 pr-14">
              {{ $t('detailsCustomers') }} : {{ selectedCustomer.userFullName }}
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div><span class="font-medium">{{ $t('Email') }} :</span> {{ selectedCustomer.email }}</div>
              <div><span class="font-medium">{{ $t('Phone') }} :</span> {{ selectedCustomer.phoneNumber }}</div>
              <div><span class="font-medium">{{ $t('ArrivedDate') }} :</span> {{ formatDate(selectedCustomer.arrivedDate) }}</div>
              <div><span class="font-medium">{{ $t('DepartDate') }} :</span> {{ formatDate(selectedCustomer.departDate) }}</div>
              <div><span class="font-medium">{{ $t('reservationType') }} :</span> {{ selectedCustomer.reservationType }}</div>
              <div><span class="font-medium">{{ $t('personNumber') }} :</span> {{ selectedCustomer.totalPerson }}</div>
              <div><span class="font-medium">{{ $t('TotalPrice') }} :</span> {{ selectedCustomer.totalPrice }} FCFA</div>
              <div><span class="font-medium" >{{ $t('Payment') }} :</span> <span :class="statusClass1(selectedCustomer.payment)"> {{ selectedCustomer.payment }}</span></div>
              <div><span class="font-medium">{{ $t('Status') }} : </span>
                <span :class="statusClass(selectedCustomer.status)">
                  {{ selectedCustomer.status }}
                </span>
              </div>
              <div><span class="font-medium">{{ $t('Comment') }} :</span> {{ selectedCustomer.comment || '-' }}</div>
              <div><span class="font-medium">{{ $t('Createdon') }} :</span> {{ formatDateTime(selectedCustomer.createdAt) }}</div>
              <div><span class="font-medium">{{ $t('Modifiedon') }}:</span> {{ formatDateTime(selectedCustomer.updatedAt) }}</div>
            </div>
          </div>

        </div>
      </template>
    </Modal>
  </div>
  </template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { ref,onMounted,computed,watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';
import { getReservation,getUser} from "@/services/api";
import { useServiceStore } from '@/composables/serviceStore';
import type {userDataType,ReservationType} from '@/types/option'
import { useI18n } from "vue-i18n";
import DropdownMenu from '@/components/common/DropdownMenu.vue'




const { t, locale } = useI18n({ useScope: "global" });
const serviceStore = useServiceStore();
const showModal = ref(false)


const menuItems = computed(()=>[
  { label: t('AddCustomers'), onClick: () => modalOpen.value=true },
])
const modalOpen = ref(false)
const users = ref<userDataType[]>([])
const currentPageTitle = computed(()=>t("CustomersLists"));
const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};
const Package = computed(()=>[
  {value: 'Strater', label: t('StraterPackage')},
  {value: 'Honeymoon', label: t('HoneymoonPackage')},
  {value: 'Vacation', label: t('VacationPackage')},
  {value: 'Spring', label: t('SpringPackage')},
])
const Group = computed(()=>[
  {value: 'Gold', label: t('Gold')},
  {value: 'Silver', label: t('Silver')},
  {value: 'Bronze', label: t('Bronze')},
  {value: 'Platinum', label: t('Platinum')},
])

const columnDefs = ref<ColDef[]>([
  { headerName: t('User'), field: 'userFullName' ,

  },
  { headerName: t('Email'), field: 'email' },
  {
    headerName: t('LastPackage'),
    field: 'reservationType',
  },
  { headerName: t('Phone'), field: 'phoneNumber' },
  { headerName: t('Verified'),
  cellRenderer: () => `
                <div>
                    <span class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-green-500 inline-flex"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                          Email
                    </span>

                </div>
            `,
   },
  { headerName: t('Comment'), field: 'comment' },
  { headerName: t('Status'), field: 'status' ,
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'active') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;
    }
   else {

      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Inactive</span>`;
    }
  }
  },
  { headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) },

]);

watch(() => locale.value, () => {
  columnDefs.value = [
  { headerName: t('User'), field: 'userFullName' ,

},
{ headerName: t('Email'), field: 'email' },
{
  headerName: t('LastPackage'),
  field: 'reservationType',
},
{ headerName: t('Phone'), field: 'phoneNumber' },
{ headerName: t('Verified'),
cellRenderer: () => `
              <div>
                  <span class="flex items-center gap-2">
                      <svg class="h-5 w-5 text-green-500 inline-flex"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                        Email
                  </span>

              </div>
          `,
 },
{ headerName: t('Comment'), field: 'comment' },
{ headerName: t('Status'), field: 'status' ,
cellRenderer: (params:ICellRendererParams) => {
  if (params.value === 'active') {
    return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;
  }
 else {

    return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Inactive</span>`;
  }
}
},
{ headerName: t('Actions'), cellRenderer: (params:any) => getActionButtons(params.data.id) },
  ]},{ immediate: true })

  function getActionButtons(id: number): string {
  return `
    <div class="mt-2 ">
      <button class="action-btn" data-action="view" data-id="${id} ">
            <svg class="h-6 w-6 text-slate-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
      </button>

    </div>
  `;
}



const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};
const selectedCustomer = ref<any>(null)
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
  if (action === 'view') {
    const customer = customers.value.find((c:any) => c.id === parseInt(id));
    if (customer) {
      selectedCustomer.value = customer;
      console.log('selectedCustomer.value:', selectedCustomer.value);
      showModal.value = true;
    } else {
      console.error('Client introuvable pour ID:', id);
    }
  }
};



const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}


  const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const countryCodes = {
  CM: '+237',
  US: '+1',
  GB: '+44',
  AU: '+61',
}
const selectedCountry = ref('CM')
const phoneNumber = ref('')
const updatePhoneNumber = () => {
  phoneNumber.value = countryCodes[selectedCountry.value as keyof typeof countryCodes]
}
onMounted(() => {
  updatePhoneNumber()
})
const fetchUsers = async () => {
  const response = await getUser();
  users.value = response.data.data;
  console.log('userrr',users.value)
}

const customers = ref<ReservationType[]>([])
const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getReservation(serviceId);
    console.log(response.data);

    customers.value = response.data.map((res: any) => {
      const user = users.value.find((u: any) => u.id === res.userId);

      return {
        ...res,
        ...user,
        userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
        // productName: product ? product.productName : 'Inconnu'
      };
    });
    customers.value.sort((a:any, b:any) => a.userFullName.localeCompare(b.userFullName));
    console.log("////",customers.value)
  } catch (error) {
    console.error('fetch failed:', error);
  }
};
onMounted(async () => {
  await fetchUsers();
  await fetchReservation();
});
const formatDate = (date:any) =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const formatDateTime = (dateTime:any) =>
  new Date(dateTime).toLocaleString('fr-FR');

// const formatPrice = (price:any) =>
//   (price / 100).toFixed(2);

const statusClass = (status:any) => {
  switch (status) {
    case 'active':
      return 'text-green-600 font-semibold';
    case 'pending':
      return 'text-yellow-600 font-semibold';
    case 'cancelled':
      return 'text-red-600 font-semibold';
    default:
      return 'text-gray-600';
  }
};
const statusClass1 = (status:any) => {
  switch (status) {
    case 'paid':
      return 'text-green-600 font-semibold';
    case 'pending':
      return 'text-yellow-600 font-semibold';
    case 'cancelled':
      return 'text-red-600 font-semibold';
    default:
      return 'text-gray-600';
  }
};
  </script>

  <style scoped>
  /* Add any additional styles here if needed */
  </style>
