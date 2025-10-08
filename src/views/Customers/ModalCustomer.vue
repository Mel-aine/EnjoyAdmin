<template>
  <div>
    <Modal v-if="isOpen" @close="emit('close')">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-7xl overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <button @click="emit('close')" class="transition-color absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 ...">
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
              {{ isEditMode ? $t('EditCustomer') : $t('add_new_customer') }}
            </h4>
          </div>

          <CustomerForm
            v-model="customerFormData"
            :loading="isLoading"
            :is-edit-mode="isEditMode"
            @submit="handleSubmit"
            @cancel="emit('close')"
          />
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomerForm from '@/components/customers/CustomerFom.vue'

const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const { t } = useI18n()

interface CustomerForm {
  // Informations générales
  title: string
  firstName: string
  lastName: string
  profilePhoto: string | null
  phone: string
  mobile: string
  email: string
  gender: string
  guestType: string
  vipStatusId: any

  // Adresse
  address: string
  country: string
  state: string
  city: string
  zipCode: string
  nationality: string
  company: string
  fax: string
  registrationNo: string

  // Identité
  idPhoto: string | null
  idNumber: string
  idType: string
  idExpiryDate: string
  issuingCountry: string
  issuingCity: string

  dateOfBirth: string
  specialPreferences: string
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  customerData: {
    type: Object as () => Partial<CustomerForm>,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'submit'])

const customerFormData = ref<Partial<CustomerForm>>({})
const isLoading = ref(false)

// Watch pour mettre à jour les données du formulaire quand le modal s'ouvre
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.isEditMode && props.customerData) {
        customerFormData.value = { ...props.customerData }
      } else {
        customerFormData.value = {}
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async (formData: CustomerForm) => {
  isLoading.value = true
  try {
    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    emit('submit', {
      data: formData,
      isEdit: props.isEditMode
    })

    // Réinitialiser les données si c'est une création
    if (!props.isEditMode) {
      customerFormData.value = {}
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du client:", error)
  } finally {
    isLoading.value = false
    emit('close')
  }
}
</script>
