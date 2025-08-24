<template>
  <div>
    <AdminLayout>
      <FullScreenLayout>
        <PageBreadcrumb :pageTitle="$t('guest_database')" :breadcrumb="breadcrumb" />
        <div class="mt-10">
          <ReusableTable
            :title="$t('guest_database')"
            :columns="columns"
            :data="customers"
            :actions="actions"
            :selectable="false"
            :loading="loading"
            v-model="searchQuery"
            @search-change="onSearchChange"
            class="modern-table"
          >
            <template #header-actions="">
              <BasicButton
                :label="$t('AddGuest')"
                variant="primary"
                :icon="Plus"
                @click="showModal = true"
              />
              <BasicButton :label="$t('export')" variant="secondary" :icon="FileDown" />
              <BasicButton :label="$t('audit_trial')" variant="secondary" :icon="FileTextIcon" />
              <UserFilters />
            </template>
            <!-- Custom column templates -->
            <template #column-country="{ item }">
              <div class="font-medium text-gray-900">
                {{ $t(`countries_lists.${item.country.toLowerCase()}`) }}
              </div>
            </template>
            <template #column-vipStatus="{ item }">
              <span
                :class="getVipStatusClass(item.vipStatus)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ $t(`vipStatus.${item.vipStatus}`) }}
              </span>
            </template>
          </ReusableTable>
        </div>
      </FullScreenLayout>
    </AdminLayout>

    <ModalCustomer
      :isOpen="showModal"
      :isEditMode="isEditMode"
      :customerData="selectedCustomer"
      @close="handleCloseModal"
      @submit="handleSubmitCustomer"
    />

     <!-- Delete Confirmation Modal -->
     <ModalConfirmation
      v-if="showDeleteModal"
      :is-loading="deleting"
      :title="$t('guestDatabase.delete_title')"
      :message="$t('guestDatabase.delete_confirm_message', { name: customerToDelete?.userFullName })"
      action="DANGER"
      @close="closeDeleteModal"
      @confirm="confirmDeleteCustomer"
    />
  </div>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'
import type {  ReservationType } from '@/types/option'
import { useI18n } from 'vue-i18n'
import { Plus, FileDown, FileTextIcon } from 'lucide-vue-next'
import { getCustomer } from '@/services/reservation'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/composables/booking'
import ModalCustomer from './ModalCustomer.vue'
import { useToast } from 'vue-toastification';
import BasicButton from '../../components/buttons/BasicButton.vue'
import UserFilters from '../../components/filters/UserFilters.vue'
import { createGuest,updateGuest,deleteGuest } from '@/services/guestApi'
import { Eye, Edit, Trash2, List, Ban } from 'lucide-vue-next'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'

const { t } = useI18n()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const router = useRouter()
const showModal = ref(false)
const loading = ref(false)
const store = useBookingStore()
const toast = useToast()
const selectedCustomer = ref<any>(null)
const customerToDelete = ref<any>(null)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const deleting = ref(false)
const customers = ref<ReservationType[]>([])
const breadcrumb = [
  { label: t('navigation.frontOffice'), href: '#' },
  { label: t('guest_database'), href: '#' }
]


const columns = computed(() => [
  {
    key: 'userFullName',
    label: t('GuestName'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'country',
    label: t('country'),
    type: 'custom' as const,
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
    key: 'phonePrimary',
    label: t('Phone'),
    type: 'text' as const,
    sortable: true,
    translatable: false
  },
  {
    key: 'addressLine',
    label: t('address'),
    type: 'text' as const,
    sortable: true,
    translatable: true
  },
  {
    key: 'vipStatus',
    label: t('vipStatus'),
    type: 'custom' as const,
    sortable: true,
    dateFormat: 'short',
    translatable: false
  }
])

const actions = computed(() => [
  {
    label: t('commons.view'),
    icon: Eye,
    handler: (item: any) => handleCustomerAction('view', item)
  },
  {
    label: t('commons.editGuest'),
    icon: Edit,
    handler: (item: any) => handleCustomerAction('edit', item)
  },
  {
    label: t('commons.deleteGuest'),
    icon: Trash2,
    variant: 'danger',
    handler: (item: any) => handleCustomerAction('delete', item)
  },
  {
    label: t('commons.detailLog'),
    icon: List,
    handler: (item: any) => handleCustomerAction('log', item)
  },
  {
    label: t('commons.blacklistGuest'),
    icon: Ban,
    handler: (item: any) => handleCustomerAction('blacklist', item)
  }
])


// Header actions are now handled through slots

// Search functionality
const searchQuery = ref('')

const onSearchChange = (query: string) => {
  console.log('Search query changed:', query)
  // Add any additional search logic here if needed
}


 const mapApiCustomerToFormData = (customer: any) => {
  const formData = { ...customer };
  formData.idNumber = '';
  formData.idExpiryDate = '';
  if (customer.passportNumber) {
    formData.idNumber = customer.passportNumber;
    formData.idExpiryDate = customer.passportExpiry;
  } else if (customer.visaNumber) {
    formData.idNumber = customer.visaNumber;
    formData.idExpiryDate = customer.visaExpiry;
  } else {
    formData.idNumber = customer.idNumber;
    formData.idExpiryDate = customer.idExpiryDate;
  }

  if (formData.idExpiryDate && typeof formData.idExpiryDate === 'string') {
      formData.idExpiryDate = formData.idExpiryDate.substring(0, 10);
  }

  return formData;
};


//fonctions pour récupérer les clients

const fetchCustomers = async () => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId;
    const response = await getCustomer(serviceId!);
    console.log("@@@@@@22",response)
    customers.value = response.data.map((c: any) => {
      return {
        ...c,
        userFullName: `${c.firstName} ${c.lastName}`,
      }
    })
    console.log("customers", customers.value)

  } catch (error) {
    console.error('Failed to fetch fetchCustomers:', error);
  } finally {
    loading.value = false
  }
};

// Actions are now handled directly through handler functions in the actions configuration

const handleCustomerAction = async (action: string, c: any) => {
  console.log('Customer action:', action, c)
  
  const customerFromApi = customers.value.find((cu: any) => cu.id === parseInt(c.id))

  if (action === 'view') {
    if (customerFromApi) {
      await router.push({
        name: 'CustomerDetails',
        params: { id: c.id.toString() }
      })
    } else {
      console.error('Client introuvable pour ID:', c.id)
    }
  } else if (action === 'edit') { 
    if (customerFromApi) {
      selectedCustomer.value = mapApiCustomerToFormData(customerFromApi)
      console.log('Données formatées pour le formulaire:', selectedCustomer.value)
      isEditMode.value = true
      showModal.value = true
    } else {
      console.error('Client introuvable pour ID:', c.id)
    }
  } else if (action === 'delete') { 
    customerToDelete.value = c;
    showDeleteModal.value = true;
  }
  // Vous pouvez ajouter d'autres 'else if' ici pour 'blacklist', 'log', etc.
}



const handleCloseModal = () => {
  showModal.value = false
  isEditMode.value = false
  selectedCustomer.value = null
}



onMounted(async () => {
  await fetchCustomers()
})



// Fonction pour gérer l'ajout d'un client (mise à jour)
const handleAddCustomer = async (payload: any) => {
  try {
    loading.value = true

    const { data } = payload
    console.log('Données client à sauvegarder:', {
      ...data,
      profilePhoto: data.profilePhoto,
      idPhoto: data.idPhoto
    })

    const response = await createGuest({
      ...data,
      hotelId: serviceStore.serviceId!
    })

    toast.success(t('toast.SuccessCreated'))
    console.log('Client créé avec succès:', response.data)

    // Rafraîchir la liste
    await fetchCustomers()
    showModal.value = false

  } catch (error: any) {
    console.error('Erreur lors de la création du client:', error)

    if (error.response && error.response.status === 409) {
      const serverMessage = error.response.data?.message
      if (serverMessage === 'This email is already in use for this service') {
        toast.error(t('toast.emailAlreadyUsed'))
      } else {
        toast.error(serverMessage || t('toast.error'))
      }
    } else {
      toast.error(t('toast.ErrorCreated'))
    }
  } finally {
    loading.value = false
  }
}

// Fonction pour gérer la modification d'un client
const handleEditCustomer = async (payload: any) => {
  try {
    loading.value = true
    const { data } = payload
    const customerId = selectedCustomer.value?.id

    if (!customerId) {
      throw new Error('ID du client manquant')
    }

    console.log('Mise à jour du client:', customerId, data)

    const response = await updateGuest(customerId, {
      ...data,
      hotelId: serviceStore.serviceId!
    })

    toast.success(t('toast.SucessUpdate'))
    console.log('Client mis à jour avec succès:', response.data)

    await fetchCustomers()
    handleCloseModal()

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du client:', error)
    toast.error(t('toast.Error'))
  } finally {
    loading.value = false
  }
}

// Gestionnaire unifié pour les soumissions
const handleSubmitCustomer = async (payload: any) => {
  if (payload.isEdit) {
    await handleEditCustomer(payload)
  } else {
    await handleAddCustomer(payload)
  }
}

const getVipStatusClass = (status: string) => {
  switch (status) {
    case 'bronze':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'silver':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    case 'gold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'platinum':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'diamond':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    case 'none':
      return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 italic'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Fonction pour fermer le modal de suppression et réinitialiser l'état
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  customerToDelete.value = null;
};

// Fonction appelée lorsque l'utilisateur clique sur "Confirmer" dans le modal

const confirmDeleteCustomer = async () => {
  if (!customerToDelete.value) return;

  try {
    deleting.value = true;
    await deleteGuest(customerToDelete.value.id);
    toast.success(t('toast.DeleteSuccess'));
    await fetchCustomers();
  } catch (error: any) { 
    console.error('Erreur lors de la suppression du client:', error);
    if (error.response && error.response.status === 409) {
      
      toast.error(t('errors.deleteGuestConflict'));
    } else {
      toast.error(t('toast.deleteError'));
    }
  } finally {
    deleting.value = false;
    closeDeleteModal();
  }
};
</script>

<style scoped></style>
