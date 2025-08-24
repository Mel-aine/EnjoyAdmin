<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-8 border-t pt-4 p-6 overflow-y-auto sidebar-scroll max-h-[580px]"
  >
    <!-- Section Informations Générales -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div class="col-span-12 md:col-span-2">
        <ImageUploader
          ref="profilePhotoUploader"
          v-model="form.profilePhoto"
          label="Photo de profil"
          :max-size-m-b="5"
          :cloudinary-config="cloudinaryConfig"
          @file-selected="onProfilePhotoSelected"
          @file-removed="onProfilePhotoRemoved"
          @upload-success="onProfilePhotoSuccess"
          @upload-error="onUploadError"
        />
      </div>

      <div class="col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">{{ $t('Name') }}</label>
          <div class="flex items-center">
            <div class="w-20">
              <Select
                v-model="form.title"
                :options="titleOptions"
                :placeholder="$t('Title')"
                customClass="rounded-r-none"
              />
            </div>
            <div class="flex-1">
              <Input
                v-model="form.firstName"
                :placeholder="$t('FirstName')"
                custom-class="rounded-none"
              />
            </div>
            <div class="flex-1">
              <Input
                v-model="form.lastName"
                :placeholder="$t('LastName')"
                custom-class="rounded-l-none"
              />
            </div>
          </div>
        </div>

        <div>
          <InputPhone
            :title="$t('Phone')"
            v-model="form.phonePrimary"
            :is-required="false"
            placeholder="Téléphone"
          />
        </div>
        <div>
          <InputPhone
            :title="$t('mobile')"
            v-model="form.mobileNumber"
            :is-required="false"
            placeholder="Mobile"
          />
        </div>
        <div>
          <InputEmail :title="'Email'" v-model="form.email" placeholder="Email" />
        </div>
        <div>
          <Select
            :lb="'Genre'"
            :placeholder="$t('selected_item')"
            v-model="form.gender"
            :options="genderOptions"
          />
        </div>
        <div>
          <Select
            :lb="'Type de client'"
            :placeholder="$t('selected_item')"
            v-model="form.guestType"
            :options="guestTypeOptions"
          />
        </div>
        <div>
          <Select
            :lb="'Statut VIP'"
            :placeholder="$t('selected_item')"
            v-model="form.vipStatus"
            :options="vipStatusOptions"
          />
        </div>
      </div>
    </div>

    <!-- Section Adresse -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 border-t pt-8">
      <div class="col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('Address') }}</label>
        <textarea
          v-model="form.addressLine"
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 resize-none"
          :placeholder="$t('Address')"
        ></textarea>
      </div>
      <div>
        <InputCountries v-model="form.country" />
      </div>
      <div>
        <Input :lb="'State/Province'" v-model="form.stateProvince" placeholder="State" />
      </div>
      <div>
        <Input :lb="'Ville'" v-model="form.city" placeholder="Ville" />
      </div>
      <div>
        <Input :lb="'Code Postal'" v-model="form.postalCode" placeholder="Code Postal" />
      </div>
      <div>
        <InputCountries v-model="form.nationality" :lb="$t('Nationality')" />
      </div>
      <div>
        <Input :lb="'Société'" v-model="form.companyName" placeholder="Société" />
      </div>
      <div>
        <Input v-model="form.fax" :lb="$t('Fax')" :placeholder="$t('Fax')" />
      </div>
      <div>
        <Input
          v-model="form.registrationNumber"
          :lb="$t('Registration No')"
          :placeholder="$t('Registration No')"
        />
      </div>
    </div>

    <!-- Section Informations d'identité -->
    <div class="border-t pt-8">
      <h3
        @click="toggleSection('identity')"
        class="text-lg font-medium leading-6 text-gray-900 flex items-center cursor-pointer"
      >
        <svg
          class="w-5 h-5 mr-2 text-gray-600 transition-transform"
          :class="{ 'rotate-180': !sections.identity }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
        Informations d'identité
      </h3>
      <div
        v-if="sections.identity"
        class="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-4"
      >
        <div class="col-span-12 md:col-span-2">
          <ImageUploader
            ref="idPhotoUploader"
            v-model="form.idPhoto"
            label="Photo de la pièce"
            :max-size-m-b="10"
            :cloudinary-config="cloudinaryConfig"
            @file-selected="onIdPhotoSelected"
            @file-removed="onIdPhotoRemoved"
            @upload-success="onIdPhotoSuccess"
            @upload-error="onUploadError"
          />
        </div>
        <div class="col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="">
            <Select
              :lb="'Type de pièce'"
              :placeholder="$t('selected_items')"
              v-model="form.idType"
              :options="idTypeOptions"
            />
            
          </div>
          <div class="md:col-span-2">
                <Input
                    :lb="idNumberLabel"
                    v-model="form.idNumber"
                    :placeholder="idNumberLabel"
                />
          </div>
          <div>
            <InputDatePicker
              :title="'Date d\'expiration'"
              :placeholder="$t('Selectdate')"
              v-model="form.idExpiryDate"
            />
          </div>
          <div class="md:col-span-2">
            <InputCountries :lb="'Pays d\'émission'" v-model="form.issuingCountry" />
          </div>
          <div class="md:col-span-2">
            <Input
              :lb="'Ville d\'émission'"
              v-model="form.issuingCity"
              placeholder="Ville d'émission"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-3 border-t pt-6">
      <BasicButton
        :label="$t('Cancel')"
        variant="light"
        @click="$emit('cancel')"
        :disabled="isUploading"
      />
      <BasicButton
        :label="saveButtonLabel"
        variant="secondary"
        :loading="loading || isUploading"
        :disabled="isUploading"
        type="submit"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, watch, onMounted, computed } from 'vue'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import ImageUploader from '../../components/customers/ImageUploader.vue'
import { useI18n } from 'vue-i18n'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { getIdentityTypesByHotelId } from '@/services/configrationApi'
import { useServiceStore } from '@/composables/serviceStore'
import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))

const { t } = useI18n()
const serviceStore = useServiceStore()

interface CustomerForm {
  title: string
  firstName: string
  lastName: string
  profilePhoto: string | null
  phonePrimary: string
  mobileNumber: string
  email: string
  gender: string
  guestType: string
  vipStatus: string
  addressLine: string
  country: string
  stateProvince: string
  city: string
  postalCode: string
  nationality: string
  companyName: string
  fax: string
  registrationNumber: string
  idPhoto: string | null
  idNumber: string
  idType: string
  idExpiryDate: string
  issuingCountry: string
  issuingCity: string
  dateOfBirth: string
  specialPreferences: string
}

interface SelectOption {
  value: string
  label: string
  label_fr?:string
}
interface Sections {
  identity: boolean
}

const props = defineProps({
  modelValue: {
    type: Object as () => Partial<CustomerForm>,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])


type ImageUploaderInstance = InstanceType<typeof ImageUploader>

const profilePhotoUploader = ref<ImageUploaderInstance | null>(null)
const idPhotoUploader = ref<ImageUploaderInstance | null>(null)


// Configuration Cloudinary
const cloudinaryConfig = {
  cloudName: CLOUDINARY_NAME || '',
  uploadPreset: CLOUDINARY_UPLOAD_PRESET || '',
}

// État pour gérer les uploads
const isUploading = ref(false)
const globalError = ref('')
const pendingImages = ref<string[]>([])

// CustomerFom.vue

const getEmptyCustomerForm = (): CustomerForm => ({
  title: '',
  firstName: '',
  lastName: '',
  profilePhoto: null,
  phonePrimary: '', // <-- CORRIGÉ
  mobileNumber: '', // <-- CORRIGÉ
  email: '',
  gender: '',
  guestType: '',
  vipStatus: '',
  addressLine: '', // <-- CORRIGÉ
  country: 'CM',
  stateProvince: '', 
  city: '',
  postalCode: '', 
  nationality: '',
  companyName: '', 
  fax: '',
  registrationNumber: '', 
  idPhoto: null,
  idNumber: '',
  idType: '',
  idExpiryDate: '',
  issuingCountry: '',
  issuingCity: '',
  dateOfBirth: '',
  specialPreferences: '',
})

const sections = reactive<Sections>({
  identity: false,
})

const form = reactive<CustomerForm>(getEmptyCustomerForm())
const idTypeOptions = ref<SelectOption[]>([])

// Options calculées
const titleOptions = computed(() => [
  { label: t('Mr'), value: 'Mr' },
  { label: t('Mrs'), value: 'Mrs' },
  { label: t('Ms'), value: 'Ms' },
  { label: t('Dr'), value: 'Dr' },
])

const genderOptions = computed(() => [
  { label: t('Male'), value: 'male' },
  { label: t('Female'), value: 'female' },
  { label: t('Other'), value: 'other' },
])

const vipStatusOptions = computed(() => [
  { label: t('vipStatus.bronze'), value: 'bronze' },
  { label: t('vipStatus.silver'), value: 'silver' },
  { label: t('vipStatus.gold'), value: 'gold' },
  { label: t('vipStatus.platinum'), value: 'platinum' },
  { label: t('vipStatus.diamond'), value: 'diamond' },
  { label: t('vipStatus.none'), value: 'none' },
])

const guestTypeOptions: SelectOption[] = [
  { value: 'travel_agent', label: 'travel agent' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'individual', label: 'Individual' }
]

// Gestionnaires d'événements pour la sélection de fichiers
const onProfilePhotoSelected = (data: { file: File; preview: string }) => {
  console.log('Photo de profil sélectionnée:', data.file.name)
  if (!pendingImages.value.includes('Photo de profil')) {
    pendingImages.value.push('Photo de profil')
  }
  globalError.value = ''
}

const onIdPhotoSelected = (data: { file: File; preview: string }) => {
  console.log("Photo d'identité sélectionnée:", data.file.name)
  if (!pendingImages.value.includes('Photo de la pièce')) {
    pendingImages.value.push('Photo de la pièce')
  }
  globalError.value = ''
}

// Gestionnaires pour la suppression de fichiers
const onProfilePhotoRemoved = () => {
  console.log('Photo de profil supprimée')
  const index = pendingImages.value.indexOf('Photo de profil')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
  form.profilePhoto = null
}

const onIdPhotoRemoved = () => {
  console.log("Photo d'identité supprimée")
  const index = pendingImages.value.indexOf('Photo de la pièce')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
  form.idPhoto = null
}

// Gestionnaires de succès d'upload
const onProfilePhotoSuccess = (data: { url: string; file: File }) => {
  console.log('Photo de profil uploadée avec succès:', data.url)
  form.profilePhoto = data.url
  const index = pendingImages.value.indexOf('Photo de profil')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
}

const onIdPhotoSuccess = (data: { url: string; file: File }) => {
  console.log("Photo d'identité uploadée avec succès:", data.url)
  form.idPhoto = data.url
  const index = pendingImages.value.indexOf('Photo de la pièce')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
}

const onUploadError = (error: any) => {
  console.error("Erreur d'upload:", error)
  globalError.value = "Erreur lors de l'upload des images. Veuillez réessayer."
  isUploading.value = false
  pendingImages.value = []
}


// Fonction principale de soumission

const handleSubmit = async () => {
  try {
    globalError.value = ''
    isUploading.value = true

    // ... (toute la logique d'upload reste identique) ...
    let profilePhotoPromise = Promise.resolve(form.profilePhoto) 
    let idPhotoPromise = Promise.resolve(form.idPhoto)       

    if (profilePhotoUploader.value && profilePhotoUploader.value.hasSelectedFile()) {
      profilePhotoPromise = profilePhotoUploader.value.uploadToCloudinary().catch()
    }
    if (idPhotoUploader.value && idPhotoUploader.value.hasSelectedFile()) {
      idPhotoPromise = idPhotoUploader.value.uploadToCloudinary().catch()
    }

    const [profilePhotoUrl, idPhotoUrl] = await Promise.all([
      profilePhotoPromise,
      idPhotoPromise,
    ])
    
   
    //  On sépare les champs génériques du reste du formulaire
    const { idType, idNumber, idExpiryDate, ...baseFormData } = form
    
    //  On prépare l'objet qui contiendra les champs d'identité spécifiques
    let identityData = {}

    // On utilise l'info qu'on a déjà dans notre computed property
    if (selectedIdTypeInfo.value && idNumber) {
        const { numberField, dateField } = selectedIdTypeInfo.value
        identityData = {
            [numberField]: idNumber,       
            [dateField]: idExpiryDate,
            idType: idType, 
        }
    } else {
        // Fallback si rien n'est sélectionné ou pour le cas "autre"
        identityData = {
            idNumber: idNumber,
            idExpiryDate: idExpiryDate,
            idType: idType,
        }
    }

    const finalFormData = {
      ...baseFormData,
      ...identityData,
      profilePhoto: profilePhotoUrl,
      idPhoto: idPhotoUrl,
    }


    console.log('Soumission du formulaire avec les données finales transformées:', finalFormData)
    emit('submit', finalFormData)

  } catch (error: any) {
    console.error('Erreur lors de la soumission:', error)
    globalError.value = error.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.'
  } finally {
    isUploading.value = false
  }
}

//  méthodes
const populateForm = (data: Partial<CustomerForm>) => {
  Object.keys(form).forEach((key) => {
    if (data[key as keyof CustomerForm] !== undefined) {
      ;(form as any)[key] = data[key as keyof CustomerForm]
    }
  })
}

const resetForm = () => {
  Object.assign(form, getEmptyCustomerForm())
  pendingImages.value = []
  globalError.value = ''
  isUploading.value = false
}

const toggleSection = (section: keyof Sections): void => {
  sections[section] = !sections[section]
}

interface RichSelectOption extends SelectOption {
  numberField: string // Nom du champ pour le numéro (ex: 'passportNumber')
  dateField: string // Nom du champ pour la date (ex: 'passportExpiryDate')
  label_fr: string // Label pour l'input (ex: 'Numéro de Passeport')
}



const fetchIdentityTypes = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) return

    const res = await getIdentityTypesByHotelId(hotelId)
    
    // On mappe la réponse de l'API vers notre nouvelle structure
    idTypeOptions.value = res.data.data.map((type: any): RichSelectOption => {
      // On normalise le nom pour le comparer (ex: "National ID Card" -> "nationalidcard")
      const normalizedName = type.name.toLowerCase().replace(/ /g, '')

      switch (normalizedName) {
        case 'passport':
        case 'passeport':
          return {
            label: type.name,
            value: type.name,
            numberField: 'passportNumber',
            dateField: 'passportExpiry',
            label_fr: 'Numéro de Passeport',
          }
        case 'visa':
          return {
            label: type.name,
            value: type.id,
            numberField: 'visaNumber',
            dateField: 'visaExpiry',
            label_fr: 'Numéro de Visa',
          }
        default:
          return {
            label: type.name,
            value: type.id,
            numberField: 'idNumber', 
            dateField: 'idExpiryDate',
            label_fr: 'Numéro de la pièce',
          }
      }
    })
  } catch (err) {
    console.error('Erreur lors de la récupération des types de pièces:', err)
  }
}

const selectedIdTypeInfo = computed(() => {
  // Trouve l'objet complet de l'option sélectionnée
  return idTypeOptions.value.find(opt => opt.value === form.idType)
})

const idNumberLabel = computed(() => {
  // Retourne le label personnalisé, ou un label par défaut
  return selectedIdTypeInfo.value?.label_fr || "Numéro de la pièce"
})

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
      populateForm(newValue)
    } else {
      resetForm()
    }
  },
  { immediate: true, deep: true },
)

watch(
  form,
  (newValue) => {
    emit('update:modelValue', { ...newValue })
  },
  { deep: true },
)

onMounted(() => {
  fetchIdentityTypes()
})

defineExpose({
  resetForm,
  populateForm,
})

const saveButtonLabel = computed(() => {
  return props.isEditMode ? t('SaveChanges') : t('Save');
});
</script>

<style scoped>
.sidebar-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;
}
</style>
