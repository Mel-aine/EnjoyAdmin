
<template>
  <AdminLayout>
    <FullScreenLayout>
      <PageBreadcrumb :pageTitle="pageTitle" :breadcrumbs="breadcrumb" />

      <div v-if="!loadingInitialData" class="mt-10 bg-white border border-gray-200 rounded-lg">
        <CustomerForm

          :is-edit-mode="isEditMode"
          :loading="isSubmitting"
          :modelValue="customerFormData"
          @submit="handleSubmit"
          @cancel="goBack"
        />

      </div>
       <div v-else  class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </FullScreenLayout>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { getGuestById, createGuest, updateGuest } from '@/services/guestApi' // Assurez-vous d'avoir une fonction getGuestById
import { useServiceStore } from '@/composables/serviceStore'

// Importez vos composants de layout et de formulaire
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import CustomerForm from '@/components/customers/CustomerFom.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

const customerFormData = ref({})
const isSubmitting = ref(false)
const loadingInitialData = ref(false)

// Détermine si on est en mode édition en vérifiant la présence de l'ID dans l'URL
const isEditMode = computed(() => !!route.params.id)
const customerId = computed(() => Number(route.params.id))

// Titre de la page dynamique
const pageTitle = computed(() =>
  isEditMode.value ? t('EditCustomer') : t('add_new_customer')
)

// Breadcrumb dynamique
const breadcrumb = computed(() => [
  { label: t('guest_database'), href: { name: 'GuestDatabase' } },
  { label: pageTitle.value, href: '#' }
])

// Fonction pour mapper les données de l'API vers le formulaire (comme vous l'avez déjà)

const mapApiCustomerToFormData = (customer: any) => {

  const formData: { [key: string]: any } = { ...customer };

  formData.idNumber = '';
  formData.idExpiryDate = '';
  formData.idType = '';


  if (customer.passportNumber) {
    formData.idType = customer.idType;
    formData.idNumber = customer.passportNumber;
    formData.idExpiryDate = customer.passportExpiry;
  } else if (customer.visaNumber) {
    formData.idType = customer.idType;
    formData.idNumber = customer.visaNumber;
    formData.idExpiryDate = customer.visaExpiry;
  } else if (customer.idNumber) {
    formData.idType = customer.idType;
    formData.idNumber = customer.idNumber;
    formData.idExpiryDate = customer.idExpiryDate;
  }

  if (formData.idExpiryDate && typeof formData.idExpiryDate === 'string') {
      formData.idExpiryDate = formData.idExpiryDate.substring(0, 10);
  }


  return formData;
};

// Charge les données du client si on est en mode édition
onMounted(async () => {
  if (isEditMode.value) {
    loadingInitialData.value = true
    try {

      const response = await getGuestById(customerId.value)
      console.log("Données du client récupérées:", response.data.data)
      customerFormData.value = mapApiCustomerToFormData(response.data.data)
    } catch (error) {
      console.error("Erreur lors du chargement du client:", error)
      toast.error(t('toast.fetchError'))
      router.push({ name: 'GuestDatabase' })
    } finally {
      loadingInitialData.value = false
    }
  }
})

// Gère la soumission du formulaire (création ou mise à jour)
const handleSubmit = async (formData: any) => {
  isSubmitting.value = true
  try {
    if (isEditMode.value) {
      // Logique de mise à jour
      await updateGuest(customerId.value, { ...formData, hotelId: serviceStore.serviceId! })
      toast.success(t('toast.SucessUpdate'))
    } else {
      // Logique de création
      await createGuest({ ...formData, hotelId: serviceStore.serviceId! })
      toast.success(t('toast.SuccessCreated'))
    }
    router.push({ name: 'Customers' })
  } catch (error) {
    console.error("Erreur lors de la soumission:", error)
    toast.error(t('toast.error'))
  } finally {
    isSubmitting.value = false
  }
}


// Fonction pour le bouton "Annuler"
const goBack = () => {
  router.back()
}
</script>
