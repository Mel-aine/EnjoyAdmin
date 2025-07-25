<template>
  <div>
    <AdminLayout>
      <div class="min-h-screen">
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="flex justify-end pb-5">
          <DropdownMenu :menu-items="menuItems">
            <template #icon>
              <button class="border border-gray-300 bg-purple-400 rounded-lg relative">
                <svg
                  class="h-8 w-8 text-white"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </template>
          </DropdownMenu>
        </div>

        <TableComponent
          :items="titles"
          :datas="customers"
          :filterable="true"
          :pagination="true"
          :loading="loading"
          :showHeader="true"
          :title="$t('Customers')"
          :pageSize="15"
          :showButtonAllElement="true"
          @view="onView"
          class="modern-table"
        />
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
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
          <form class="flex flex-col" @submit.prevent="handleAddCustomer">
            <div class="custom-scrollbar h-[450px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input
                      :lb="$t('FirstName')"
                      :placeholder="$t('FirstName')"
                      :id="'firstName'"
                      :forLabel="'firstName'"
                      v-model="customerForm.firstName"
                    />
                  </div>

                  <div>
                    <Input
                      :lb="$t('LastName')"
                      :placeholder="$t('LastName')"
                      :id="'lastName'"
                      :forLabel="'lastName'"
                      v-model="customerForm.lastName"
                    />
                  </div>
                  <div>
                    <label
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
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
                        type="email"
                        placeholder="info@gmail.com"
                        v-model="customerForm.email"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      {{ $t('Phone') }}
                    </label>
                    <div class="relative">
                      <div class="absolute">
                        <select
                          v-model="selectedCountry"
                          @change="updatePhoneNumber"
                          class="appearance-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
                        >
                          <option
                            v-for="(code, country) in countryCodes"
                            :key="country"
                            :value="country"
                          >
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
                        v-model="customerForm.phoneNumber"
                        placeholder="+237 693774450"
                        type="tel"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-[84px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                  <div>
                    <Select
                      :lb="$t('LastPackage')"
                      :options="Package"
                      v-model="customerForm.package"
                    />
                  </div>
                  <div>
                    <Select
                      :lb="$t('Group')"
                      :options="Group"
                      v-model="customerForm.group"
                    />
                  </div>
                  <div>
                    <Input
                      :lb="$t('Address')"
                      :placeholder="$t('Address')"
                      :id="'address'"
                      :forLabel="'address'"
                      v-model="customerForm.address"
                    />
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
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50 sm:w-auto"
              >
                {{ loading ? $t('Loading') : $t('AddCustomer') }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/profile/Modal.vue'
import Input from '@/components/forms/FormElements/Input.vue'
import Select from '@/components/forms/FormElements/Select.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import {  getCustomersList } from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import type { userDataType, ReservationType } from '@/types/option'
import { useI18n } from 'vue-i18n'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'

const { t } = useI18n()
const serviceStore = useServiceStore()
const router = useRouter()
const showModal = ref(false)
const loading = ref(false)
const store = useBookingStore()

const menuItems = computed(() => [
  { label: t('AddCustomers'), onClick: () => (modalOpen.value = true) },
])

const modalOpen = ref(false)
const users = ref<userDataType[]>([])
const currentPageTitle = computed(() => t('CustomersLists'))

const Package = computed(() => [
  { value: 'Strater', label: t('StraterPackage') },
  { value: 'Honeymoon', label: t('HoneymoonPackage') },
  { value: 'Vacation', label: t('VacationPackage') },
  { value: 'Spring', label: t('SpringPackage') },
])

const Group = computed(() => [
  { value: 'Gold', label: t('Gold') },
  { value: 'Silver', label: t('Silver') },
  { value: 'Bronze', label: t('Bronze') },
  { value: 'Platinum', label: t('Platinum') },
])

// Form data for adding customer
const customerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  package: '',
  group: '',
  address: ''
})

const titles = computed(() => [
  {
    name: 'userFullName',
    label: t('User'),
    type: 'text',
    filterable: false,
  },
  {
    name: 'email',
    label: t('Email'),
    type: 'url',
    event: 'view',
    filterable: true,
  },
  {
    name: 'phoneNumber',
    label: t('Phone'),
    type: 'text',
    filterable: false,
  },
  // {
  //   name: 'comment',
  //   label: t('Comment'),
  //   type: 'text',
  //   filterable: true,
  // },
  {
    name: 'actions',
    label: t('Actions'),
    type: 'action',
    actions: [
      {
        name: 'View',
        event: 'view',
        icone: `<svg class="h-6 w-6 text-orange-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><circle cx="12" cy="12" r="2" /><path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" /><path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>`,
      },
    ],
  },
])

const onView = (c: any) => handleCustomerAction('view', c)

const handleCustomerAction = async (action: string, c: any) => {
  console.log('Customer action:', action, c)

  if (action === 'view') {
    // Trouver le customer dans la liste
    const customer = customers.value.find((cu: any) => cu.id === parseInt(c.id))

    if (customer) {
      selectedCustomer.value = customer

      store.setCustomer(selectedCustomer.value)
      console.log('Selected customer:', selectedCustomer.value)
      await router.push({
        name: 'CustomerDetails',
        params: { id: c.id.toString() }
      })

    } else {
      console.error('Client introuvable pour ID:', c.id)
    }
  }
}

const selectedCustomer = ref<any>(null)

const countryCodes = {
  CM: '+237',
  US: '+1',
  GB: '+44',
  AU: '+61',
}

const selectedCountry = ref('CM')

const updatePhoneNumber = () => {
  const countryCode = countryCodes[selectedCountry.value as keyof typeof countryCodes]
  customerForm.phoneNumber = countryCode
}



const customers = ref<ReservationType[]>([])

const fetchCustomers = async () => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId;
    const response = await getCustomersList(serviceId!);
    customers.value= response.data.map((c:any)=>{
      return{
        ...c,
        userFullName: `${c.firstName} ${c.lastName}`,
      }
    })
    console.log("customers",customers.value)

  } catch (error) {
    console.error('Failed to fetch reservations:', error);
  }finally {
    loading.value = false
  }
};



const handleAddCustomer = async () => {
  try {
    loading.value = true

    // Validation basique
    if (!customerForm.firstName || !customerForm.lastName || !customerForm.email) {
      console.error('Champs requis manquants')
      return
    }
    console.log('Adding customer:', customerForm)
    await fetchCustomers()

    // Fermer le modal et réinitialiser le formulaire
    modalOpen.value = false
    Object.assign(customerForm, {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      package: '',
      group: '',
      address: ''
    })

  } catch (error) {
    console.error('Failed to add customer:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  updatePhoneNumber()
  await fetchCustomers()
})

const formatDate = (date: any) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

const formatDateTime = (dateTime: any) =>
  new Date(dateTime).toLocaleString('fr-FR')
</script>

<style scoped>

</style>
