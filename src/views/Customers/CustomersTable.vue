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

    <ModalCustomer :isOpen="showModal"  :isEditMode="false" @close="handleCloseModal"
      @submit="handleAddCustomer"  />

  </div>
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import {  getCustomersList ,createCustomer } from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import type { userDataType, ReservationType } from '@/types/option'
import { useI18n } from 'vue-i18n'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import ModalCustomer from './ModalCustomer.vue'
import { useToast } from 'vue-toastification';

const { t } = useI18n()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const router = useRouter()
const showModal = ref(false)
const loading = ref(false)
const store = useBookingStore()
const toast = useToast();
const currentPageTitle = computed(() => t('CustomersLists'))
const selectedCustomer = ref<any>(null)
const customers = ref<ReservationType[]>([])
const menuItems = computed(() => [
  { label: t('AddCustomers'), onClick: () => (showModal.value = true) },
])

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

const handleCloseModal = () => {
  showModal.value = false
}

// Fonction pour gérer l'ajout d'un client
const handleAddCustomer = async (payload: any) => {
  try {
    loading.value = true

    const { data } = payload
    data.service_id = serviceStore.serviceId
    console.log('Add customer:', data)

    await createCustomer(data)
    toast.success(t('toast.Sucess'))

    // Rafraîchir la liste
    await fetchCustomers()
    showModal.value = false

  } catch (error: any) {
    if (error.response && error.response.status === 409) {
  const serverMessage = error.response.data?.message
      if (serverMessage === 'This email is already in use for this service') {
        toast.error(t('toast.emailAlreadyUsed'))
      } else {
        toast.error(serverMessage || t('toast.error'))
      }
    }
  } finally {
    loading.value = false
  }
}


onMounted(async () => {
  await fetchCustomers()
})


</script>

<style scoped>

</style>
