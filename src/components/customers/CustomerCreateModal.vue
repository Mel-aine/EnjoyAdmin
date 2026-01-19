<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/25 bg-opacity-50" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="absolute right-0 top-0 h-full w-full max-w-6xl bg-white dark:text-white text-gray-900 dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold ">{{ $t('add_new_customer') }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="handleSubmit" class="space-y-8">
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
                  <div class="flex-1 mt-1.5">
                    <Input
                      v-model="form.firstName"
                      :placeholder="$t('FirstName')"
                      custom-class="rounded-none"
                    />
                  </div>
                  <div class="flex-1 mt-1.5">
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
                <InputEmail :title="$t('Email')" v-model="form.email" :placeholder="'info@gmail.com'" />
              </div>
              <div>
                <Select
                  :lb="$t('gender')"
                  :placeholder="$t('selected_item')"
                  v-model="form.gender"
                  :options="genderOptions"
                />
              </div>
              <div>
                <Select
                  :lb="$t('guestType')"
                  :placeholder="$t('selected_item')"
                  v-model="form.guestType"
                  :options="guestTypeOptions"
                />
              </div>
              <div>
                <Select
                  :lb="$t('StatutVIP')"
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
              <Input :lb="$t('State/Province')" v-model="form.stateProvince" placeholder="State" />
            </div>
            <div>
              <Input :lb="$t('city')" v-model="form.city" placeholder="Ville" />
            </div>
            <div>
              <Input :lb="$t('postalCode')" v-model="form.postalCode" placeholder="Code Postal" />
            </div>
            <div>
              <InputNationalities v-model="form.nationality" :lb="$t('nationality')" />
            </div>
            <div>
              <Input :lb="$t('Company Name')" v-model="form.companyName" placeholder="Société" />
            </div>
            <div>
              <Input v-model="form.fax" :lb="$t('Fax')" :placeholder="$t('Fax')" />
            </div>
            <div>
              <Input
                v-model="form.registrationNumber"
                :lb="$t('Registration No')"
                :placeholder="$t('RegistrationNo')"
              />
            </div>
          </div>

          <!-- Section Informations d'identité -->
          <div class="border-t pt-8">
            <h3
              @click="toggleSection('identity')"
              class="text-lg font-medium leading-6  flex items-center cursor-pointer"
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
              {{ $t('IdentityInformation') }}
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
                    :lb="$t('IDType')"
                    :placeholder="$t('selected_items')"
                    v-model="form.idType"
                    :options="idTypeOptions"
                  />
                </div>
                <div class="md:col-span-2">
                  <Input :lb="idNumberLabel" v-model="form.idNumber" :placeholder="idNumberLabel" />
                </div>
                <div>
                  <InputDatePicker
                    :title="$t('ExpiryDate')"
                    :placeholder="$t('Selectdate')"
                    v-model="form.idExpiryDate"
                  />
                </div>

                <div class="md:col-span-">
                  <InputCountries :lb="$t('Countryofissue')" v-model="form.issuingCountry" />
                </div>
                <div class="md:col-span-2">
                  <Input
                    :lb="$t('Cityofissue')"
                    v-model="form.issuingCity"
                    :placeholder="$t('Countryofissue')"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="border-t pt-8">
            <h3
              @click="toggleSection('otherInformation')"
              class="text-lg font-medium leading-6  flex items-center cursor-pointer"
            >
              <svg
                class="w-5 h-5 mr-2 text-gray-600 transition-transform"
                :class="{ 'rotate-180': !sections.otherInformation }"
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
              {{ $t('OtherInformation') }}
            </h3>
            <div v-if="sections.otherInformation" class="mt-6 pt-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {{ $t('Preference') }}
                </label>
                <MultipleSelect
                  v-model="form.preferences"
                  :options="Preferences"
                  :placeholder="$t('SelectPreferences')"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-3 p-6 border-t border-gray-200">
        <BasicButton
          :label="$t('Cancel')"
          variant="light"
          @click="$emit('close')"
          :disabled="loading || isUploading"
          type="button"
        />
        <BasicButton
          :label="$t('save')"
          variant="secondary"
          :loading="loading || isUploading"
          :disabled="isUploading"
          @click="handleSubmit"
          type="button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useServiceStore } from '@/composables/serviceStore'
import { getIdentityTypesByHotelId, getPreferencesByHotelId } from '@/services/configrationApi'
import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import InputNationalities from '@/components/forms/FormElements/InputNationalities.vue'
import ImageUploader from '@/components/customers/ImageUploader.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'
import { createGuest } from '@/services/guestApi'
import { vipStatusApi } from '@/services/configrationApi'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))

const { t } = useI18n()
const toast = useToast()
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
  preferences: string[]
}

interface SelectOption {
  value: string
  label: string
  label_fr?: string
  numberField?:any
  dateField?:any
}

interface RichSelectOption extends SelectOption {
  numberField: string
  dateField: string
  label_fr: string

}

interface Sections {
  identity: boolean
  otherInformation: boolean
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  initialData: {
    type: Object as () => Partial<CustomerForm>,
    default: () => ({}),
  },
})

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
const Preferences = ref<SelectOption[]>([])
const idTypeOptions = ref<SelectOption[]>([])

const emit = defineEmits(['close', 'customerCreated'])

const loading = ref(false)

const getEmptyForm = (): CustomerForm => ({
  title: '',
  firstName: props.initialData.firstName || '',
  lastName: props.initialData.lastName || '',
  profilePhoto: null,
  phonePrimary: '',
  mobileNumber: '',
  email: '',
  gender: '',
  guestType: 'individual',
  vipStatus: '',
  addressLine: '',
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
  preferences: []
})

const sections = reactive<Sections>({
  identity: false,
  otherInformation: false,
})

const form = reactive<CustomerForm>(getEmptyForm())

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

const vipStatusOptions = ref<any[]>([])

const guestTypeOptions: SelectOption[] = [
  { value: 'travel_agent', label: t('GuestTypes.travel_agent') },
  { value: 'corporate', label: t('GuestTypes.corporate') },
  { value: 'individual', label: t('GuestTypes.individual') },
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

const toggleSection = (section: keyof Sections): void => {
  sections[section] = !sections[section]
}

const fetchIdentityTypes = async () => {
  try {
    const hotelId = serviceStore.serviceId
    if (!hotelId) return

    const res = await getIdentityTypesByHotelId(hotelId)

    idTypeOptions.value = res.data.data.data.map((type: any): RichSelectOption => {
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

const selectedIdTypeInfo = computed(() => {
  return idTypeOptions.value.find((opt) => opt.value === form.idType)
})

const idNumberLabel = computed(() => {
  return selectedIdTypeInfo.value?.label_fr || t('identity.id_number')
})

const loadPreferences = async () => {
  try {
    const hotelId = serviceStore.serviceId
    const response = await getPreferencesByHotelId(hotelId!)
    Preferences.value = response.data.data.data.map((i: any) => ({
      label: i.name,
      value: i.id
    }))
  } catch (error) {
    console.error('Error loading preferences:', error)
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!form.firstName.trim()) {
    toast.error(t('toast.required_fields'))
    return
  }

  try {
    globalError.value = ''
    isUploading.value = true
    loading.value = true

    let profilePhotoPromise = Promise.resolve(form.profilePhoto)
    let idPhotoPromise = Promise.resolve(form.idPhoto)

    if (profilePhotoUploader.value && profilePhotoUploader.value.hasSelectedFile()) {
      profilePhotoPromise = profilePhotoUploader.value.uploadToCloudinary().catch()
    }
    if (idPhotoUploader.value && idPhotoUploader.value.hasSelectedFile()) {
      idPhotoPromise = idPhotoUploader.value.uploadToCloudinary().catch()
    }

    const [profilePhotoUrl, idPhotoUrl] = await Promise.all([profilePhotoPromise, idPhotoPromise])

    const { idType, idNumber, idExpiryDate, preferences, ...baseFormData } = form

    let identityData = {}

    if (selectedIdTypeInfo.value && idNumber) {
      const { numberField, dateField } = selectedIdTypeInfo.value
      identityData = {
        [numberField]: idNumber,
        [dateField]: idExpiryDate,
        idType: idType,
      }
    } else {
      identityData = {
        idNumber: idNumber,
        idExpiryDate: idExpiryDate,
        idType: idType,
      }
    }

    const finalFormData = {
      ...baseFormData,
      ...identityData,
      profilePhoto: profilePhotoUrl || undefined,
      idPhoto: idPhotoUrl || undefined,
      preferences: JSON.stringify(form.preferences),
      hotelId: serviceStore.serviceId!,
    }

    const response = await createGuest(finalFormData)

    if (response.data) {
      const guestId = response.data.data?.id || response.data.id

      if (!guestId) {
        console.error('Aucun ID trouvé dans la réponse:', response.data)
        return
      }

      const createdCustomer = {
        id: guestId,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phonePrimary || form.mobileNumber || '',
        phonePrimary: form.phonePrimary,
        mobileNumber: form.mobileNumber,
        email: form.email,
        userFullName: `${form.firstName} ${form.lastName}`.trim(),
        title: form.title,
        gender: form.gender,
        guestType: form.guestType,
        vipStatus: form.vipStatus,
        country: form.country,
        nationality: form.nationality,
        profilePhoto: profilePhotoUrl,
      }

      toast.success(t('toast.SuccessCreated'))
      emit('customerCreated', createdCustomer)
      emit('close')
    }
  } catch (error: any) {
    console.error('Error creating customer:', error)
    globalError.value = error.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.'
    toast.error(t('toast.error'))
  } finally {
    loading.value = false
    isUploading.value = false
  }
}

const fetchVipStatuses = async () => {
  try {
    loading.value = true
    const response = await vipStatusApi.getVipStatuses(serviceStore.serviceId!)
    console.log('respinse', response)
    vipStatusOptions.value =
      response.data?.data.map((s: any) => {
        return {
          label: s.name,
          value: s.id,
        }
      }) || []
    console.log('vipStatusOptions', vipStatusOptions.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchIdentityTypes()
  fetchVipStatuses()
  loadPreferences()
})
</script>
