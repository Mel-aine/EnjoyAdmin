<template>
  <div>
    <AdminLayout>
      <div class="min-h-screen">
        <ReusableTable
          :title="$t('Customers')"
          :columns="columns"
          :data="customers"
          :actions="actions"
          :selectable="false"
          :loading="loading"
          v-model="searchQuery"
          @search-change="onSearchChange"
          class="modern-table"
        >
          <template #header-actions="{ searchQuery }">
            <BasicButton
              :label="$t('AddCustomers')"
              variant="primary"
              icon="user"
              @click="showModal = true"
            />
            <BasicButton
              :label="$t('export')"
              variant="secondary"
              icon="folder-output"
            />
            <BasicButton
              :label="$t('audit_trial')"
              variant="secondary"
              icon="id-card"
            />
            <UserFilters />
          </template>
        </ReusableTable>
      </div>
    </AdminLayout>

    <ModalCustomer :isOpen="showModal" :isEditMode="false" @close="handleCloseModal" @submit="handleAddCustomer" />

  </div>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import { getCustomersList, createCustomer } from '@/services/api'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import type {  ReservationType } from '@/types/option'
import { useI18n } from 'vue-i18n'
import { UserIcon, FolderOutputIcon, IdCard } from 'lucide-vue-next'
import { getReservatonCustomers } from '@/services/reservation'

import ReusableTable from '@/components/tables/ReusableTable.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import ModalCustomer from './ModalCustomer.vue'
import { useToast } from 'vue-toastification';
import BasicButton from '../../components/buttons/BasicButton.vue'
import UserFilters from '../../components/filters/UserFilters.vue'

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


const columns = computed(() => [
  {
    key: 'userFullName',
    label: t('User'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'email',
    label: t('Email'),
    type: 'email' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'phoneNumber',
    label: t('Phone'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'address',
    label: t('address'),
    type: 'text' as const,
    sortable: true,
    translatable: true
  },
  {
    key: 'createdAt',
    label: t('Created Date'),
    type: 'date' as const,
    sortable: true,
    dateFormat: 'short',
    translatable: false
  }
])

const actions = computed(() => [
  {
    label: 'View',
    handler: (item: any) => handleCustomerAction('view', item)
  },
  {
    label: 'Edit',
    handler: (item: any) => handleCustomerAction('edit', item)
  }
])

// Header actions are now handled through slots

// Search functionality
const searchQuery = ref('')

const onSearchChange = (query: string) => {
  console.log('Search query changed:', query)
  // Add any additional search logic here if needed
}

// Actions are now handled directly through handler functions in the actions configuration

const handleCustomerAction = async (action: string, c: any) => {
  console.log('Customer action:', action, c)

  if (action === 'view' || action === 'edit') {
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

//fonctions pour récupérer les clients

const fetchReservationsCustomers = async () => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId;
    const response = await getReservatonCustomers(serviceId!);
    customers.value = response.data.map((c:any) => {
      return {
        ...c,
        phoneNumber: c.phonePrimary, // Utiliser mobilePhone si phoneNumber est vide
        address: c.addressLine|| '', // Assurez-vous que l'adresse est définie
        userFullName: `${c.firstName} ${c.lastName}`,
      }
    })
    console.log("customers", response)

  } catch (error) {
    console.error('Failed to fetch reservations:', error);
  } finally {
    loading.value = false
  }
};

const fetchCustomers = async () => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId;
    const response = await getCustomersList(serviceId!);
    customers.value = response.data.map((c: any) => {
      return {
        ...c,
        userFullName: `${c.firstName} ${c.lastName}`,
      }
    })
    console.log("customers", customers.value)

  } catch (error) {
    console.error('Failed to fetch reservations:', error);
  } finally {
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
  await fetchReservationsCustomers()
})


</script>

<style scoped></style>
