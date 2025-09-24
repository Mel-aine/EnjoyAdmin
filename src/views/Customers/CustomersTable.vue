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
            :rowClass="getRowClass"
            v-model="searchQuery"
            @search-change="onSearchChange"
            class="modern-table"
          >
            <template #header-actions="">
              <BasicButton
                :label="$t('AddGuest')"
                variant="primary"
                :icon="Plus"
                @click="goToCreatePage"
              />
              <BasicButton :label="$t('export')" variant="secondary" :icon="FileDown" @click="exportToCSV"/>
              <BasicButton :label="$t('audit_trial')" variant="secondary" :icon="FileTextIcon" @click="showAuditTrial"  />
              <GuestFilter @filter="handleFilterChange" />
            </template>
            <!-- Custom column templates -->
            <template #column-country="{ item }">
              <div class="font-medium text-gray-900">
                <span v-if="item.country">{{ $t(`countries_lists.${item.country.toLowerCase()}`) }} </span>
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
           <TablePagination
              v-if="paginationMeta"
              :meta="paginationMeta"
              @page-change="handlePageChange"
            />
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

    <BlackListGuestModal
      :isOpen="showBlacklistModal"
      :isLoading="blacklisting"
      :guestData="customerToBlacklist"
      @close="closeBlacklistModal"
      @confirm="confirmBlacklistCustomer"
    />

    <!-- Delete Confirmation Modal -->
    <ModalConfirmation
      v-if="showDeleteModal"
      :is-loading="deleting"
      :title="$t('guestDatabase.delete_title')"
      :message="
        $t('guestDatabase.delete_confirm_message', { name: customerToDelete?.userFullName })
      "
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
import type { ReservationType } from '@/types/option'
import { useI18n } from 'vue-i18n'
import { Plus, FileDown, FileTextIcon, CheckCircle } from 'lucide-vue-next'
import { getGuests } from '@/services/guestApi'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { useRouter } from 'vue-router'
import ModalCustomer from './ModalCustomer.vue'
import { useToast } from 'vue-toastification'
import BasicButton from '../../components/buttons/BasicButton.vue'
import GuestFilter from '@/components/filters/GuestFilter.vue'
import { createGuest, updateGuest, deleteGuest } from '@/services/guestApi'
import { Eye, Edit, Trash2, List, Ban } from 'lucide-vue-next'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import BlackListGuestModal from '@/components/customers/BlackListGuestModal.vue'
import { toggleGuestBlacklist } from '@/services/guestApi'
import TablePagination from '@/components/tables/TablePagination.vue'


const { t } = useI18n()
const serviceStore = useServiceStore()
const router = useRouter()
const showModal = ref(false)
const loading = ref(false)
const toast = useToast()
const selectedCustomer = ref<any>(null)
const customerToDelete = ref<any>(null)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const deleting = ref(false)
const customers = ref<ReservationType[]>([])
const showBlacklistModal = ref(false)
const blacklisting = ref(false)
const customerToBlacklist = ref<any>(null)
const activeFilters = ref({})
const paginationMeta = ref(null)
const showAuditTrial = () => {
  router.push({ name: 'AuditTrailEntity', params: { entityType: 'Guest', entityId: 'all' } })
}
const breadcrumb = [
  { label: t('navigation.frontOffice'), href: '#' },
  { label: t('guest_database'), href: '#' },
]

const columns = computed(() => [
  {
    key: 'userFullName',
    label: t('tooltip.guestName'),
    type: 'text' as const,
    sortable: true,
    translatable: false,
  },
  {
    key: 'country',
    label: t('country'),
    type: 'custom' as const,
    sortable: true,
    translatable: false,
  },
  {
    key: 'email',
    label: t('Email'),
    type: 'email' as const,
    sortable: true,
    translatable: false,
  },
  {
    key: 'phonePrimary',
    label: t('Phone'),
    type: 'text' as const,
    sortable: true,
    translatable: false,
  },
  {
    key: 'addressLine',
    label: t('address'),
    type: 'text' as const,
    sortable: true,
    translatable: true,
  },
  {
    key: 'vipStatus',
    label: t('StatutVIP'),
    type: 'custom' as const,
    sortable: true,
    dateFormat: 'short',
    translatable: false,
  },
])

const actions = computed(() => [
  {
    label: t('commons.view'),
    icon: Eye,
    handler: (item: any) => handleCustomerAction('view', item),
  },
  {
    label: t('commons.editGuest'),
    icon: Edit,
    handler: (item: any) => handleCustomerAction('edit', item),
  },
  {
    label: t('commons.deleteGuest'),
    icon: Trash2,
    variant: 'danger',
    handler: (item: any) => handleCustomerAction('delete', item),
  },
  {
    label: t('commons.detailLog'),
    icon: List,
    handler: (item: any) => handleCustomerAction('log', item),
  },
  {
    label: t('commons.blacklistGuest'),
    icon: Ban,
    variant: 'warning',
    // Condition : Ne s'affiche QUE si le client N'EST PAS blacklisté
    condition: (item: any) => !item.blacklisted,
    handler: (item: any) => handleCustomerAction('blacklist', item),
  },

  // Action pour "RETIRER de la liste noire"
  {
    label: t('commons.unblacklistGuest'),
    icon: CheckCircle,
    variant: 'secondary',
    // Condition : Ne s'affiche QUE si le client EST DÉJÀ blacklisté
    condition: (item: any) => item.blacklisted,
    handler: (item: any) => handleCustomerAction('blacklist', item),
  },
])

// Search functionality
const searchQuery = ref('')

const onSearchChange = (query: string) => {
  console.log('Search query changed:', query)
  // Add any additional search logic here if needed
}

//fonctions pour récupérer les clients

const fetchCustomers = async (page = 1) => {
  try {
    loading.value = true
    const serviceId = serviceStore.serviceId
     const allParams = {
      ...activeFilters.value,
      hotel_id: serviceId,
      page: page,
      limit: 10,
    };
    const response = await getGuests(allParams)
    console.log('@@@@@@22', response)
    customers.value = response.data.data.data.map((c: any) => {
      return {
        ...c,
        userFullName: `${c.firstName} ${c.lastName}`,
      }
    })
    paginationMeta.value = response.data.data.meta;
    console.log('customers', customers.value)
  } catch (error) {
    console.error('Failed to fetch fetchCustomers:', error)
  } finally {
    loading.value = false
  }
}

// Actions are now handled directly through handler functions in the actions configuration

const handlePageChange = (newPage: number) => {
  fetchCustomers(newPage);
};

const handleCustomerAction = async (action: string, c: any) => {
  console.log('Customer action:', action, c)

  const customerFromApi = customers.value.find((cu: any) => cu.id === parseInt(c.id))

  if (action === 'view') {
    if (customerFromApi) {
      await router.push({
        name: 'CustomerDetails',
        params: { id: c.id.toString() },
      })
    } else {
      console.error('Client introuvable pour ID:', c.id)
    }
  } else if (action === 'edit') {
    if (customerFromApi) {
      // selectedCustomer.value = mapApiCustomerToFormData(customerFromApi)
      router.push({ name: 'CustomerEdit', params: { id: c.id.toString() } })
      console.log('Données formatées pour le formulaire:', selectedCustomer.value)
      isEditMode.value = true
      showModal.value = true
    } else {
      console.error('Client introuvable pour ID:', c.id)
    }
  } else if (action === 'delete') {
    customerToDelete.value = c
    showDeleteModal.value = true
  } else if (action === 'log') {
    await router.push({
      name: 'CustomerAuditLog',
      params: { id: c.id.toString() },
    })
  } else if (action === 'blacklist') {
    customerToBlacklist.value = customers.value.find((cust) => cust.id === c.id)
    showBlacklistModal.value = true
  }
}

const handleCloseModal = () => {
  showModal.value = false
  isEditMode.value = false
  selectedCustomer.value = null
}

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = newFilters;
  fetchCustomers(1);
};



onMounted(async () => {
  await fetchCustomers(1)
})

const goToCreatePage = () => {
  router.push({ name: 'CustomerCreate' })
}

// Fonction pour gérer l'ajout d'un client (mise à jour)
const handleAddCustomer = async (payload: any) => {
  try {
    loading.value = true

    const { data } = payload
    console.log('Données client à sauvegarder:', {
      ...data,
      profilePhoto: data.profilePhoto,
      idPhoto: data.idPhoto,
    })

    const response = await createGuest({
      ...data,
      hotelId: serviceStore.serviceId!,
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
      hotelId: serviceStore.serviceId!,
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
  showDeleteModal.value = false
  customerToDelete.value = null
}

// Fonction appelée lorsque l'utilisateur clique sur "Confirmer" dans le modal

const confirmDeleteCustomer = async () => {
  if (!customerToDelete.value) return

  try {
    deleting.value = true
    await deleteGuest(customerToDelete.value.id)
    toast.success(t('toast.DeletedSuccess'))
    await fetchCustomers()
  } catch (error: any) {
    console.error('Erreur lors de la suppression du client:', error)
    if (error.response && error.response.status === 409) {
      toast.error(t('errors.deleteGuestConflict'))
    } else {
      toast.error(t('toast.deleteError'))
    }
  } finally {
    deleting.value = false
    closeDeleteModal()
  }
}

const closeBlacklistModal = () => {
  showBlacklistModal.value = false
  customerToBlacklist.value = null
}

// fonction pour confirmer le blacklist
const confirmBlacklistCustomer = async (data: { reason?: string; blacklisted: boolean }) => {
  if (!customerToBlacklist.value) return
  try {
    blacklisting.value = true
    const payload =
      data.reason || (data.blacklisted ? 'Raison non spécifiée' : 'Retiré de la liste noire')

    await toggleGuestBlacklist(customerToBlacklist.value.id, payload)

    console.log('Blacklisting guest:', customerToBlacklist.value.id, data)
    const successMessage = data.blacklisted
      ? t('toast.guestBlacklistedSuccess', { name: customerToBlacklist.value.userFullName })
      : t('toast.guestUnblacklistedSuccess', { name: customerToBlacklist.value.userFullName })

    toast.success(successMessage)

    // Rafraîchir la liste des clients
    await fetchCustomers()
  } catch (error: any) {
    console.error('Erreur lors de la mise en liste noire du client:', error)

    if (error.response && error.response.status === 409) {
      toast.error(t('errors.guestAlreadyBlacklisted'))
    } else {
      toast.error(t('toast.blacklistError'))
    }
  } finally {
    blacklisting.value = false
    closeBlacklistModal()
  }
}

const getRowClass = (item: any): string => {
  if (item.blacklisted) {
    return 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300';
  }
  return '';
};

const exportToCSV = () => {

  if (!customers.value || customers.value.length === 0) {
    toast.info(t('toast.noDataToExport'));
    return;
  }


  const headers = columns.value.map(col => col.label);


  const rows = customers.value.map(customer => {
    return columns.value.map(column => {

      const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
      };

      let value = getNestedValue(customer, column.key);

      // Gérer les valeurs nulles ou indéfinies
      if (value === null || value === undefined) {
        value = '';
      }

      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {

        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    }).join(',');
  });


  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const filename = `guests-export-${new Date().toISOString().split('T')[0]}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success(t('toast.exportSuccessful'));
};


</script>

<style scoped></style>
