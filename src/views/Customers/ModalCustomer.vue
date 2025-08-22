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

          <!-- Contenu du formulaire -->
          <form @submit.prevent="handleSubmit" class="space-y-8 border-t pt-4 p-6 overflow-y-auto sidebar-scroll h-[560px]">
            <!-- Section Informations Générales -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div class="col-span-12 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                <!-- CORRIGÉ: v-model lié à customerForm.profilePhoto -->
                <ImageUploader v-model="customerForm.profilePhoto" />
              </div>

              <div class="col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">{{ $t('Name') }}</label>
                  <div class="flex items-center">
                    <div class="w-20">
                      <!-- CORRIGÉ: v-model lié à customerForm -->
                      <Select v-model="customerForm.title" :options="titleOptions" customClass="rounded-r-none" />
                    </div>
                    <div class="flex-1">
                      <Input v-model="customerForm.firstName" :placeholder="$t('FirstName')" custom-class="rounded-none" />
                    </div>
                    <div class="flex-1">
                      <Input v-model="customerForm.lastName" :placeholder="$t('LastName')" custom-class="rounded-l-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <InputPhone :title="$t('Phone')" v-model="customerForm.phone" :is-required="false" placeholder="Téléphone" />
                </div>
                <div>
                  <InputPhone :title="$t('mobile')" v-model="customerForm.mobile" :is-required="false" placeholder="Mobile" />
                </div>
                <div>
                  <InputEmail :title="'Email'" v-model="customerForm.email" placeholder="Email" />
                </div>
                <div>
                  <Select :lb="'Genre'" v-model="customerForm.gender" :options="genderOptions" />
                </div>
                <div>
                  <Select :lb="'Type de client'" v-model="customerForm.guestType" :options="guestTypeOptions" />
                </div>
                <div>
                  <Select :lb="'Statut VIP'" v-model="customerForm.vipStatus" :options="vipStatusOptions" />
                </div>
              </div>
            </div>

            <!-- Section Adresse -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 border-t pt-8">
              <div class="col-span-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Address') }}</label>

                 <textarea v-model="customerForm.address" rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 resize-none"
                  :placeholder="$t('Address')" ></textarea>

              </div>
              <div>

                <InputCountries v-model="customerForm.country" />
              </div>
              <div>
                <Input :lb="'State'" v-model="customerForm.state" placeholder="State" />
              </div>
              <div>
                <Input :lb="'Ville'" v-model="customerForm.city" placeholder="Ville" />
              </div>
              <div>
                <Input :lb="'Code Postal'" v-model="customerForm.zipCode" placeholder="Code Postal" />
              </div>
              <div>
                <InputCountries v-model="customerForm.nationality" :lb="$t('Nationality')" />
              </div>
              <div>
                <Input :lb="'Société'" v-model="customerForm.company" placeholder="Société" />
              </div>
              <div>
                 <!-- CORRIGÉ: Ajout du v-model -->
                <Input v-model="customerForm.fax" :lb="$t('Fax')" :placeholder="$t('Fax')" />
              </div>
              <div>
                 <!-- CORRIGÉ: Ajout du v-model -->
                <Input v-model="customerForm.registrationNo" :lb="$t('Registration No')" :placeholder="$t('Registration No')" />
              </div>
            </div>

            <!-- Section Informations d'identité -->
            <div class="border-t pt-8">
              <h3 @click="toggleSection('identity')" class="text-lg font-medium leading-6 text-gray-900 flex items-center cursor-pointer">
               <svg class="w-5 h-5 mr-2 text-gray-600 transition-transform" :class="{'rotate-180': !sections.identity}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                Informations d'identité
              </h3>
              <div v-if="sections.identity" class="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-4">
                <div class="col-span-12 md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Photo de la pièce</label>
                  <!-- CORRIGÉ: v-model lié à customerForm.idPhoto -->
                  <ImageUploader v-model="customerForm.idPhoto" />
                </div>
                <div class="col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div class="md:col-span-2">
                    <Input :lb="'Numéro de la pièce'" v-model="customerForm.idNumber" placeholder="Numéro de la pièce d'identité" />
                  </div>
                  <div>
                    <Select :lb="'Type de pièce'" v-model="customerForm.idType" :options="idTypeOptions" />
                  </div>
                  <div>

                    <InputDatePicker :title="'Date d\'expiration'" v-model="customerForm.idExpiryDate" />
                  </div>
                  <div class="md:col-span-2">
                    <InputCountries :lb="'Pays d\'émission'" v-model="customerForm.issuingCountry" />
                  </div>
                  <div class="md:col-span-2">
                    <Input :lb="'Ville d\'émission'" v-model="customerForm.issuingCity" placeholder="Ville d'émission" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex justify-end space-x-3 border-t pt-6">
              <button @click="emit('close')" type="button" class="bg-white py-2 px-4 border ...">Annuler</button>
              <button type="submit" class="inline-flex justify-center py-2 px-4 border ..." :disabled="isLoading">
                {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, watch } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import ImageUploader from './ImageUploader.vue'
import { useI18n } from 'vue-i18n'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))
const Modal = defineAsyncComponent(() => import('@/components/profile/Modal.vue'))
const { t } = useI18n()

// --- INTERFACE UNIFIÉE ---
// On fusionne CustomerForm et FormData en une seule interface complète
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
  vipStatus: string

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

  // Ajout des champs manquants de l'ancien CustomerForm pour la compatibilité
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

// --- ÉTAT DU FORMULAIRE UNIFIÉ ---
const getEmptyCustomerForm = (): CustomerForm => ({
  // Informations générales
  title: 'M.',
  firstName: '',
  lastName: '',
  profilePhoto: null,
  phone: '',
  mobile: '',
  email: '',
  gender: '',
  guestType: '',
  vipStatus: '',

  // Adresse
  address: '',
  country: 'CM', // Valeur par défaut
  state: '',
  city: '',
  zipCode: '',
  nationality: '',
  company: '',
  fax: '',
  registrationNo: '',

  // Identité
  idPhoto: null,
  idNumber: '',
  idType: '',
  idExpiryDate: '',
  issuingCountry: '',
  issuingCity: '',

  // Autres
  dateOfBirth: '',
  specialPreferences: '',
})

// On utilise maintenant `customerForm` partout
const customerForm = reactive<CustomerForm>(getEmptyCustomerForm())
const isLoading = ref(false) // On unifie isLoading et loading

interface Sections {
  identity: boolean
}
const sections = reactive<Sections>({
  identity: false,
})

// --- LOGIQUE DE GESTION (INCHANGÉE MAIS MAINTENANT CORRECTE) ---
const populateForm = (data: Partial<CustomerForm>) => {
  Object.keys(customerForm).forEach(key => {
    if (data[key as keyof CustomerForm] !== undefined) {
      (customerForm as any)[key] = data[key as keyof CustomerForm]
    }
  })
}

const resetForm = () => {
  Object.assign(customerForm, getEmptyCustomerForm())
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.isEditMode && props.customerData) {
        populateForm(props.customerData)
      } else {
        resetForm()
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  isLoading.value = true // On utilise la bonne variable
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    emit('submit', {
      data: { ...customerForm },
      isEdit: props.isEditMode
    })
    if (!props.isEditMode) {
      resetForm()
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du client:", error)
  } finally {
    isLoading.value = false
    emit('close')
  }
}

const toggleSection = (section: keyof Sections): void => {
  sections[section] = !sections[section]
}


// --- OPTIONS POUR LES SELECTS (INCHANGÉES) ---
interface SelectOption { value: string; label: string; }
const titleOptions: SelectOption[] = [ { value: 'M.', label: 'M.' }, { value: 'Mme', label: 'Mme' } ]
const genderOptions: SelectOption[] = [ { value: 'male', label: 'Homme' }, { value: 'female', label: 'Femme' } ]
const guestTypeOptions: SelectOption[] = [ { value: 'standard', label: 'Standard' }, { value: 'corporate', label: 'Corporate' } ]
const vipStatusOptions: SelectOption[] = [ { value: 'regular', label: 'Standard' }, { value: 'vip', label: 'VIP' } ]
const idTypeOptions: SelectOption[] = [ { value: 'passport', label: 'Passeport' }, { value: 'national_id', label: 'Carte d\'identité' } ]

</script>
<style scoped>
.sidebar-scroll {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style>
