<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import Input from '@/components/forms/FormElements/Input.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import CustomerSarch from './CustomerSarch.vue'
import Select from '@/components/forms/FormElements/Select.vue'
// import { getCustomer } from '@/services/guestApi'
import { useServiceStore } from '@/composables/serviceStore'
import { defineEmits } from 'vue'
import { isEqual } from 'lodash'
import { useI18n } from 'vue-i18n'
import { getCustomer } from '../../services/reservation'
import InputCountries from '../forms/FormElements/InputCountries.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'
import { getIdentityTypesByHotelId } from '@/services/configrationApi'
import ImageUploader from './ImageUploader.vue'
import { useToast } from 'vue-toastification'
// Ajout de l'import manquant
import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import { useBooking } from '@/composables/useBooking2'
import ProfessionAutocomplete from '../forms/FormElements/ProfessionAutocomplete.vue'
import AutoCompleteSelect from '../forms/FormElements/AutoCompleteSelect.vue'

interface SelectOption {
  value: string
  label: string
  label_fr?: string
}

interface RichSelectOption extends SelectOption {
  numberField: string
  dateField: string
  label_fr: string
}

const props = defineProps({
  customer_id: String,
  modelValue: Object,
  showImage: {
    type: Boolean,
    default: true
  },
  customerType: {
    type: String,
    default: 'Individual',
  },
})
const emit = defineEmits<{
  (e: 'customerSelected', payload: any): void
  (e: 'update:modelValue', value: any): void
  (e:'clear-error'):void
}>()

type ImageUploaderInstance = InstanceType<typeof ImageUploader>
const customers = ref<any[]>([])
const users = ref<any[]>([])
const serviceStore = useServiceStore()
const showIdentitySection = ref(true)
const showInfoSection = ref(false)
const selectedCustomer = ref<any>({ ...props.modelValue })
const idTypeOptions = ref<SelectOption[]>([])
const resetKey = ref(0)
const toast = useToast()
const globalError = ref('')
const pendingImages = ref<string[]>([])
const profilePhotoUploader = ref<ImageUploaderInstance | null>(null)
const idPhotoUploader = ref<ImageUploaderInstance | null>(null)
const { trackUpload, completeUpload } = useBooking()
const useDropdownBooking = ref(true)
const toggleIdentitySection = () => {
  showIdentitySection.value = !showIdentitySection.value
}

const toggleInfoSection = () => {
  showInfoSection.value = !showInfoSection.value
}
const { t } = useI18n()
const GuestTitles = computed(() => [
  { label: t('guestTitles.mr'), value: 'Mr' },
  { label: t('guestTitles.mrs'), value: 'Mrs' },
  { label: t('guestTitles.miss'), value: 'Miss' },
  { label: t('guestTitles.dr'), value: 'Dr' },
])

watch(
  () => props.modelValue,
  (newVal) => {
    console.log('newVal', newVal)
    if (!isEqual(newVal, selectedCustomer.value)) {
      selectedCustomer.value = { ...newVal }
    }
  },
)

watch(
  selectedCustomer,
  (newVal) => {
    if (!isEqual(newVal, props.modelValue)) {
      emit('update:modelValue', newVal)
    }
  },
  { deep: true },
)

const selectCustomer = (customer: any) => {
  if (!customer) {
    return
  }
  selectedCustomer.value.firstName = customer.firstName ?? selectedCustomer.value.firstName
  selectedCustomer.value.lastName = customer.lastName ?? selectedCustomer.value.lastName
  selectedCustomer.value.email = customer.email ?? selectedCustomer.value.email
  selectedCustomer.value.phoneNumber = customer.phonePrimary ?? selectedCustomer.value.phonePrimary
  selectedCustomer.value.address = customer.addressLine ?? selectedCustomer.value.addressLine
  selectedCustomer.value.country = customer.country ?? selectedCustomer.value.country
  selectedCustomer.value.state = customer.stateProvince ?? selectedCustomer.value.stateProvince
  selectedCustomer.value.city = customer.city ?? selectedCustomer.value.city
  selectedCustomer.value.zipcode = customer.postalCode ?? selectedCustomer.value.postalCode
  selectedCustomer.value.title = customer.title ?? selectedCustomer.value.title
  selectedCustomer.value.idPhoto = customer.idPhoto ?? selectedCustomer.value.idPhoto
  selectedCustomer.value.profilePhoto = customer.profilePhoto ?? selectedCustomer.value.profilePhoto
  selectedCustomer.value.placeOfBirth = customer.placeOfBirth ?? selectedCustomer.value.placeOfBirth
  selectedCustomer.value.fax = customer.fax ?? selectedCustomer.value.fax
  selectedCustomer.value.profession = customer.profession ?? selectedCustomer.value.profession
  selectedCustomer.value.dateOfBirth = customer.dateOfBirth ?? selectedCustomer.value.dateOfBirth
  selectedCustomer.value.nationality = customer.nationality ?? selectedCustomer.value.nationality
  selectedCustomer.value.contactType = customer.contactType ?? selectedCustomer.value.contactType
  selectedCustomer.value.maidenName = customer.maidenName ?? selectedCustomer.value.maidenName
  // selectedCustomer.value.idExpiryDate = customer.idExpiryDate ?? selectedCustomer.value.idExpiryDate
  selectedCustomer.value.issuingCountry =
    customer.issuingCountry ?? selectedCustomer.value.issuingCountry
  selectedCustomer.value.issuingCity = customer.issuingCity ?? selectedCustomer.value.issuingCity
  if (customer.passportNumber) {
    selectedCustomer.value.idType = customer.idType || 'Passport'
    selectedCustomer.value.idNumber = customer.passportNumber
    selectedCustomer.value.idExpiryDate = customer.passportExpiry
      ? customer.passportExpiry.substring(0, 10)
      : ''
  } else if (customer.visaNumber) {
    selectedCustomer.value.idType = customer.idType || 'Visa'
    selectedCustomer.value.idNumber = customer.visaNumber
    selectedCustomer.value.idExpiryDate = customer.visaExpiry
      ? customer.visaExpiry.substring(0, 10)
      : ''
  } else if (customer.idNumber) {
    selectedCustomer.value.idType = customer.idType ?? selectedCustomer.value.idType
    selectedCustomer.value.idNumber = customer.idNumber
    selectedCustomer.value.idExpiryDate = customer.idExpiryDate
      ? customer.idExpiryDate.substring(0, 10)
      : ''
  } else {
    selectedCustomer.value.idType = customer.idType ?? selectedCustomer.value.idType
    selectedCustomer.value.idNumber = selectedCustomer.value.idNumber
    selectedCustomer.value.idExpiryDate = selectedCustomer.value.idExpiryDate
  }
  if (customer.contactTypeValue) {
    selectedCustomer.value.contactValue = customer.contactTypeValue
  }

  emit('customerSelected', selectedCustomer.value)
}

const fetchGuest = async () => {
  try {
    const hotelId = serviceStore.serviceId
    const response = await getCustomer(hotelId!)
    console.log('fetchGuest', response)
    customers.value = response.data.map((guest: any) => {
      return {
        ...guest,
        userFullName: guest ? `${guest.firstName} ${guest.lastName}` : 'Inconnu',
      }
    })
  } catch (error) {
    console.error('Failed to fetch reservations:', error)
  }
}

const fetchIdentityTypes = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) return

    const res = await getIdentityTypesByHotelId(hotelId)

    idTypeOptions.value = res.data.data.map((type: any): RichSelectOption => {
      const normalizedName = type.name.toLowerCase().replace(/ /g, '')

      switch (normalizedName) {
        case 'passport':
        case 'passeport':
          return {
            label: type.name,
            value: type.name,
            numberField: 'passportNumber',
            dateField: 'passportExpiry',
            label_fr: t('identity.passport_number'),
          }
        case 'visa':
          return {
            label: type.name,
            value: type.name,
            numberField: 'visaNumber',
            dateField: 'visaExpiry',
            label_fr: t('identity.visa_number'),
          }
        default:
          return {
            label: type.name,
            value: type.name,
            numberField: 'idNumber',
            dateField: 'idExpiryDate',
            label_fr: t('identity.id_number'),
          }
      }
    })
  } catch (err) {
    console.error('Erreur lors de la récupération des types de pièces:', err)
  }
}

// CORRECTION: Utilisation correcte de .value et cast vers RichSelectOption
const selectedIdTypeInfo = computed(() => {
  return (idTypeOptions.value as RichSelectOption[]).find(
    (opt) => opt.value === selectedCustomer.value.idType,
  )
})

const idNumberLabel = computed(() => {
  // Retourne le label personnalisé, ou un label par défaut
  return selectedIdTypeInfo.value?.label_fr || t('identity.id_number')
})

const cloudinaryConfig = {
  cloudName: CLOUDINARY_NAME || '',
  uploadPreset: CLOUDINARY_UPLOAD_PRESET || '',
}

// Modifiez vos handlers d'images :

const onProfilePhotoSuccess = (data: { url: string; file: File }) => {
  console.log('Photo de profil uploadée avec succès:', data.url)
  selectedCustomer.value.profilePhoto = data.url

  // Marquer l'upload comme terminé avec succès
  completeUpload('profilePhoto', true)

  const index = pendingImages.value.indexOf('Photo de profil')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
}

const onIdPhotoSuccess = (data: { url: string; file: File }) => {
  console.log("Photo d'identité uploadée avec succès:", data.url)
  selectedCustomer.value.idPhoto = data.url

  // Marquer l'upload comme terminé avec succès
  completeUpload('idPhoto', true)

  const index = pendingImages.value.indexOf('Photo de la pièce')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
}

const onUploadError = (error: any) => {
  console.error('Upload error:', error)

  // Marquer les uploads comme échoués
  completeUpload('profilePhoto', false, 'Profile photo upload failed')
  completeUpload('idPhoto', false, 'ID photo upload failed')

  toast.error(t('Image upload failed'))
}

// Gestionnaires d'événements pour la sélection de fichiers

const onProfilePhotoSelected = async (data: { file: File; preview: string }) => {
  console.log('Photo de profil sélectionnée:', data.file.name)

  // Commencer le suivi de l'upload
  trackUpload('profilePhoto')

  if (!pendingImages.value.includes('Photo de profil')) {
    pendingImages.value.push('Photo de profil')
  }
  globalError.value = ''

  // Déclencher l'upload automatiquement après sélection
  try {
    if (profilePhotoUploader.value?.hasSelectedFile()) {
      await profilePhotoUploader.value.uploadToCloudinary()
    }
  } catch (error) {
    console.error('Erreur upload photo de profil:', error)
    completeUpload('profilePhoto', false, 'Profile photo upload failed')
    toast.error("Erreur lors de l'upload de la photo de profil")
  }
}

const onIdPhotoSelected = async (data: { file: File; preview: string }) => {
  console.log("Photo d'identité sélectionnée:", data.file.name)

  // Commencer le suivi de l'upload
  trackUpload('idPhoto')

  if (!pendingImages.value.includes('Photo de la pièce')) {
    pendingImages.value.push('Photo de la pièce')
  }
  globalError.value = ''

  // Déclencher l'upload automatiquement après sélection
  try {
    if (idPhotoUploader.value?.hasSelectedFile()) {
      await idPhotoUploader.value.uploadToCloudinary()
    }
  } catch (error) {
    console.error('Erreur upload photo ID:', error)
    completeUpload('idPhoto', false, 'ID photo upload failed')
    toast.error("Erreur lors de l'upload de la photo d'identité")
  }
}

// Gestionnaires pour la suppression de fichiers
const onProfilePhotoRemoved = () => {
  console.log('Photo de profil supprimée')

  // Marquer l'upload comme terminé (supprimé)
  completeUpload('profilePhoto', true)

  const index = pendingImages.value.indexOf('Photo de profil')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
  selectedCustomer.value.profilePhoto = null
}

const onIdPhotoRemoved = () => {
  console.log("Photo d'identité supprimée")

  // Marquer l'upload comme terminé (supprimé)
  completeUpload('idPhoto', true)

  const index = pendingImages.value.indexOf('Photo de la pièce')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
  selectedCustomer.value.idPhoto = null
}

const TypesOfContact = computed(() => [
  { label: t('contactTypes.mobile'), value: 'Mobile' },
  { label: t('contactTypes.fix'), value: 'Fix' },
  { label: t('contactTypes.email'), value: 'Email' },
  { label: t('contactTypes.facebook'), value: 'Facebook' },
  { label: t('contactTypes.whatsapp'), value: 'Whatsapp' },
])



const contactInputComponent = computed(() => {
  if (!selectedCustomer.value.contactType) return null

  switch (selectedCustomer.value.contactType) {
    case 'Email':
      return 'InputEmail'
    case 'Mobile':
    case 'Fix':
    case 'Whatsapp':
      return 'InputPhone'
    case 'Facebook':
      return 'Input'
    default:
      return null
  }
})

const contactInputLabel = computed(() => {
  const type = selectedCustomer.value.contactType
  if (!type) return ''

  switch (type) {
    case 'Mobile':
      return t('contactTypes.mobile')
    case 'Fix':
      return t('contactTypes.fix')
    case 'Email':
      return t('Email')
    case 'Facebook':
      return t('contactTypes.facebook')
    case 'Whatsapp':
      return t('contactTypes.whatsapp')
    default:
      return type
  }
})




// Watcher pour synchroniser avec le type de contact sélectionné
watch(() => selectedCustomer.value.contactType, (newType, oldType) => {
  if (newType !== oldType) {
    selectedCustomer.value.contactValue = ''
  }
})

// Créer un computed bidirectionnel
const contactValue = computed({
  get: () => selectedCustomer.value.contactValue,
  set: (value) => {
    selectedCustomer.value.contactValue = value
  }
})

onMounted(() => {
  fetchGuest()
  fetchIdentityTypes()
})

console.log('modalevalue', props.modelValue)
</script>

<template>
  <div class="">
    <!-- Section Informations Personnelles -->
    <div class="p-2 mb-3">
      <button @click.prevent="toggleInfoSection"
        class="flex items-center justify-between w-full text-left group hover:bg-gray-50 -m-2 p-2 rounded-md transition-colors">
        <h2 class="text-md font-semibold text-gray-900 flex items-center dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-user-pen-icon lucide-user-pen w-5 h-5 mr-2 text-black dark:text-white">
            <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
            <path
              d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
            <circle cx="10" cy="7" r="4" />
          </svg>
          {{ $t('personalInformation') }}
        </h2>

        <div class="flex items-center">
          <ChevronDownIcon :class="[
            'w-5 h-5 text-gray-500 transition-all duration-200 group-hover:text-gray-700',
            { 'rotate-180': !showInfoSection },
          ]" />
        </div>
      </button>

      <div v-show="!showInfoSection" class="mt-6 transition-all duration-300 ease-in-out">
        <div class="p-2">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <!-- Photo - Conditionnelle -->
            <div v-if="showImage" class="md:col-span-2">
              <ImageUploader
                ref="profilePhotoUploader"
                v-model="selectedCustomer.profilePhoto"
                :label="$t('ProfilePhoto')"
                :max-size-m-b="5"
                :cloudinary-config="cloudinaryConfig"
                @file-selected="onProfilePhotoSelected"
                @file-removed="onProfilePhotoRemoved"
                @upload-success="onProfilePhotoSuccess"
                @upload-error="onUploadError"
              />
            </div>

            <!-- Informations principales - S'adapte selon showImage -->
            <div :class="[
              'grid grid-cols-1 md:grid-cols-12 gap-6',
              showImage ? 'md:col-span-10' : 'md:col-span-12'
            ]">
              <!-- Title + FirstName + LastName + Date + Place -->
              <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <!-- Bloc collé : Title + First + Last -->
                <div class="flex items-end w-full col-span-3 space-x-0">
                  <!-- Title -->
                  <div class="w-24">
                    <Select
                      :lb="$t('Title')"
                      :options="GuestTitles"
                      v-model="selectedCustomer.title"
                      :default-value="$t('guestTitles.mr')"
                      custom-class="rounded-r-none h-11"
                    />
                  </div>

                  <!-- First Name -->
                  <div class="flex-1">
                      <CustomerSarch @customer-selected="selectCustomer" v-model="selectedCustomer" />
                  </div>

                  <!-- Last Name -->
                  <div class="flex-1">
                    <Input
                      :lb="$t('LastName')"
                      v-model="selectedCustomer.lastName"
                      :placeholder="$t('LastName')"
                      custom-class="rounded-none h-11 border-l-0"
                    />
                  </div>
                  <!--Maiden Name-->
                   <div class="flex-1">
                    <Input
                      :lb="$t('MaidenName')"
                      v-model="selectedCustomer.maidenName"
                      :placeholder="$t('MaidenName')"
                      custom-class="rounded-l-none h-11 border-l-0"
                    />
                  </div>
                </div>

                <!-- Date de naissance -->
                <div>
                  <InputDatePicker
                    :title="$t('DateOfBirth')"
                    v-model="selectedCustomer.dateOfBirth"
                    :placeholder="$t('Select Date')"
                  />
                </div>

                <!-- Lieu de naissance -->
                <div>
                  <Input
                    :lb="$t('PlaceOfBirth')"
                    :id="'placeOfBirth'"
                    v-model="selectedCustomer.placeOfBirth"
                    :placeholder="$t('PlaceOfBirth')"
                  />
                </div>
              </div>

              <!-- Profession + Phone + Email -->

              <div :class="[
              'md:col-span-12 grid grid-cols-1  gap-4 items-end',
              selectedCustomer.contactType ? ' md:grid-cols-5' : ' md:grid-cols-4'
            ]"
              >
                <ProfessionAutocomplete
                  v-model="selectedCustomer.profession"
                  :lb="$t('profession')"
                  :placeholder="$t('profession')"
                  custom-class="h-11"
                />
                 <InputPhone
                  :title="$t('Phone')"
                  v-model="selectedCustomer.phoneNumber"
                  :id="'phone'"
                  :is-required="false"
                  custom-class="h-11"
                />

                <InputEmail
                  v-model="selectedCustomer.email"
                  placeholder="info@gmail.com"
                  :title="$t('Email')"
                  required
                  custom-class="h-11"
                />

                <AutoCompleteSelect
                  v-model="selectedCustomer.contactType"
                  :options="TypesOfContact"
                  :defaultValue="$t('contactType')"
                  :lb="$t('contactType')"
                  :is-required="false"
                  :use-dropdown="useDropdownBooking"
                  @clear-error="emit('clear-error')"
                  custom-class="h-11"
                />

                <!-- Input conditionnel basé sur le type de contact -->
                <div v-if="selectedCustomer.contactType">
                  <InputPhone
                    v-if="contactInputComponent === 'InputPhone'"
                    :title="contactInputLabel"
                    v-model="contactValue"
                    :id="'contact-input'"
                    :is-required="false"
                    custom-class="h-11"
                  />

                  <InputEmail
                    v-else-if="contactInputComponent === 'InputEmail'"
                    v-model="contactValue"
                    :placeholder="contactInputLabel"
                    :title="contactInputLabel"
                    custom-class="h-11"
                  />

                  <Input
                    v-else-if="contactInputComponent === 'Input'"
                    :lb="contactInputLabel"
                    v-model="contactValue"
                    :placeholder="contactInputLabel"
                    custom-class="h-11"
                  />
                </div>
              </div>
              <!-- <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                <ProfessionAutocomplete
                  v-model="selectedCustomer.profession"
                  :lb="$t('profession')"
                  :placeholder="$t('profession')"
                  custom-class="h-11"
                />


                <InputPhone
                  :title="$t('Phone')"
                  v-model="selectedCustomer.phoneNumber"
                  :id="'phone'"
                  :is-required="false"
                  custom-class="h-11"
                />

                <InputEmail
                  v-model="selectedCustomer.email"
                  placeholder="info@gmail.com"
                  :title="$t('Email')"
                  required
                  custom-class="h-11"
                />

                 <AutoCompleteSelect
                  v-model="selectedCustomer.contactType"
                  :options="TypesOfContact"
                  :defaultValue="$t('contactType')"
                  :lb="$t('contactType')"
                  :is-required="false"
                  :use-dropdown="useDropdownBooking"
                  @clear-error="emit('clear-error')"
                   custom-class="h-11"
                />



              </div> -->
            </div>
          </div>



          <!-- Informations complémentaires -->
          <div class="mt-3 pt-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <InputCountries :lb="$t('nationality')" v-model="selectedCustomer.nationality" :placeholder="$t('search_nationality')" />
              </div>
              <div>
                <InputCountries :lb="$t('countryOfPermanentResidence')" v-model="selectedCustomer.country" />
              </div>
              <div>
                <Input
                  :lb="$t('hotelInformation.fields.stateProvince')"
                  :id="'state'"
                  v-model="selectedCustomer.state"
                  :placeholder="$t('enterState')"
                />
              </div>
              <div>
                <Input
                  :lb="$t('postalCode')"
                  :id="'zipcode'"
                  v-model="selectedCustomer.zipcode"
                  :placeholder="$t('postalCode')"
                />
              </div>
            </div>
          </div>

           <div class="mt-4">
            <Input
              :inputType="'text'"
              :lb="$t('Address')"
              :id="'address'"
              :forLabel="'address'"
              :placeholder="$t('Address')"
              v-model="selectedCustomer.address"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Section Informations d'Identité -->
    <div class="p-2">
      <button @click.prevent="toggleIdentitySection"
        class="flex items-center justify-between w-full text-left group  hover:bg-gray-50 -m-2 p-2 rounded-md transition-colors ">
        <h2 class="text-md font-semibold text-gray-900 flex items-center dark:text-white">
          <svg class="w-5 h-5 mr-2 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-2 5v3m0 0l-1-1m1 1l1-1">
            </path>
          </svg>
          {{ $t('IdentityInformation') }}
        </h2>

        <div class="flex items-center">
          <ChevronDownIcon :class="[
            'w-5 h-5 text-gray-500 transition-all duration-200 group-hover:text-gray-700',
            { 'rotate-180': showIdentitySection },
          ]" />
        </div>
      </button>

      <div class="p-2">
        <div v-show="showIdentitySection" class="mt-6 transition-all duration-300 ease-in-out">
          <div class="md:grid md:grid-cols-12 gap-6 items-start">
            <!-- Photo ID - Conditionnelle -->
            <div v-if="showImage" class="col-span-12 md:col-span-3 lg:col-span-2">
              <label class="text-sm font-medium text-gray-700 mb-3">
                {{ $t('IDPhoto') }}
              </label>
              <div class="w-full max-w-xs">
                <ImageUploader
                  ref="idPhotoUploader"
                  v-model="selectedCustomer.idPhoto"
                  :cloudinary-config="cloudinaryConfig"
                  @upload-success="onIdPhotoSuccess"
                  @upload-error="onUploadError"
                  @file-selected="onIdPhotoSelected"
                  @file-removed="onIdPhotoRemoved"
                  :key="`id-${resetKey}`"
                  class="w-full aspect-square"
                />
              </div>
            </div>

            <!-- Champs d'identité - S'adapte selon showImage -->
            <div :class="[
              'space-y-4',
              showImage ? 'col-span-12 md:col-span-9 lg:col-span-10' : 'col-span-12'
            ]">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Select
                    :lb="$t('IDType')"
                    v-model="selectedCustomer.idType"
                    :options="idTypeOptions"
                    :placeholder="$t('Select ID Type')"
                  />
                </div>
                <div class="md:col-span-2">
                  <Input
                    :lb="idNumberLabel"
                    v-model="selectedCustomer.idNumber"
                    type="text"
                    :placeholder="idNumberLabel"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <InputDatePicker
                    :title="$t('ExpiryDate')"
                    v-model="selectedCustomer.idExpiryDate"
                    :placeholder="$t('Select Date')"
                  />
                </div>
                <div>
                  <InputCountries :lb="$t('Countryofissue')" v-model="selectedCustomer.issuingCountry" />
                </div>
                <Input
                  :lb="$t('Cityofissue')"
                  v-model="selectedCustomer.issuingCity"
                  :placeholder="$t('Cityofissue')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  align-items: flex-start;
  /* Aligns items at the start of the container */
}
</style>
