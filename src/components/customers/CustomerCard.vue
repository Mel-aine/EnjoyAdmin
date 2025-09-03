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
import { getIdentityTypesByHotelId} from '@/services/configrationApi'
import ImageUploader from './ImageUploader.vue'
import { useToast } from 'vue-toastification'
// Ajout de l'import manquant
import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'


interface SelectOption {
  value: string
  label: string
  label_fr?:string
}


interface RichSelectOption extends SelectOption {
  numberField: string
  dateField: string
  label_fr: string
}

const props = defineProps({
  customer_id: String,
  modelValue: Object,
  customerType: {
    type: String,
    default: 'Individual',
  },
})
const emit = defineEmits<{
  (e: 'customerSelected', payload: any): void
  (e: 'update:modelValue', value: any): void
}>()

type ImageUploaderInstance = InstanceType<typeof ImageUploader>
const customers = ref<any[]>([])
const users = ref<any[]>([])
const serviceStore = useServiceStore()
const showIdentitySection = ref(false)
const showInfoSection = ref(false)
const selectedCustomer = ref<any>({ ...props.modelValue })
const idTypeOptions = ref<SelectOption[]>([])
const resetKey = ref(0)
const toast = useToast()
const globalError = ref('')
const pendingImages = ref<string[]>([])
const profilePhotoUploader = ref<ImageUploaderInstance | null>(null)
const idPhotoUploader = ref<ImageUploaderInstance | null>(null)

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
  { label: t('guestTitles.ms'), value: 'Ms' },
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
  // selectedCustomer.value.idNumber = customer.idNumber ?? selectedCustomer.value.idNumber
  // selectedCustomer.value.idExpiryDate = customer.idExpiryDate ?? selectedCustomer.value.idExpiryDate
  selectedCustomer.value.issuingCountry = customer.issuingCountry ?? selectedCustomer.value.issuingCountry
  selectedCustomer.value.issuingCity = customer.issuingCity ?? selectedCustomer.value.issuingCity
    if (customer.passportNumber) {
    selectedCustomer.value.idType = customer.idType || 'Passport'
    selectedCustomer.value.idNumber = customer.passportNumber
    selectedCustomer.value.idExpiryDate = customer.passportExpiry ? customer.passportExpiry.substring(0, 10) : ''
  } else if (customer.visaNumber) {
    selectedCustomer.value.idType = customer.idType || 'Visa'
    selectedCustomer.value.idNumber = customer.visaNumber
    selectedCustomer.value.idExpiryDate = customer.visaExpiry ? customer.visaExpiry.substring(0, 10) : ''
  } else if (customer.idNumber) {
    selectedCustomer.value.idType = customer.idType ?? selectedCustomer.value.idType
    selectedCustomer.value.idNumber = customer.idNumber
    selectedCustomer.value.idExpiryDate = customer.idExpiryDate ? customer.idExpiryDate.substring(0, 10) : ''
  } else {

    selectedCustomer.value.idType = customer.idType ?? selectedCustomer.value.idType
    selectedCustomer.value.idNumber = selectedCustomer.value.idNumber
    selectedCustomer.value.idExpiryDate = selectedCustomer.value.idExpiryDate
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
  return (idTypeOptions.value as RichSelectOption[]).find((opt) => opt.value === selectedCustomer.value.idType)
})

const idNumberLabel = computed(() => {
  // Retourne le label personnalisé, ou un label par défaut
  return selectedIdTypeInfo.value?.label_fr || t('identity.id_number')
})


const onProfilePhotoSuccess = (data: { url: string; file: File }) => {
  console.log('Photo de profil uploadée avec succès:', data.url)
   selectedCustomer.value.profilePhoto = data.url
  const index = pendingImages.value.indexOf('Photo de profil')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
}

const onIdPhotoSuccess = (data: { url: string; file: File }) => {
  console.log("Photo d'identité uploadée avec succès:", data.url)
   selectedCustomer.value.idPhoto = data.url
  const index = pendingImages.value.indexOf('Photo de la pièce')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
}


const onUploadError = (error: any) => {
  console.error('Upload error:', error)
  toast.error(t('Image upload failed'))
}

const cloudinaryConfig = {
  cloudName: CLOUDINARY_NAME || '',
  uploadPreset: CLOUDINARY_UPLOAD_PRESET || '',
}

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
  selectedCustomer.value.profilePhoto = null
}

const onIdPhotoRemoved = () => {
  console.log("Photo d'identité supprimée")
  const index = pendingImages.value.indexOf('Photo de la pièce')
  if (index > -1) {
    pendingImages.value.splice(index, 1)
  }
  selectedCustomer.value.idPhoto = null
}
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
       <button
        @click.prevent="toggleInfoSection"
        class="flex items-center justify-between w-full text-left group hover:bg-gray-50 -m-2 p-2 rounded-md transition-colors"
      >
        <h2 class="text-xl font-semibold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-2 5v3m0 0l-1-1m1 1l1-1"></path>
          </svg>
          {{ $t('personalInformation') }}
        </h2>

        <div class="flex items-center">

          <ChevronDownIcon
            :class="[
              'w-5 h-5 text-gray-500 transition-all duration-200 group-hover:text-gray-700',
              { 'rotate-180': !showInfoSection }
            ]"
          />
        </div>
      </button>

    <div
      v-show="!showInfoSection"
      class="mt-6 transition-all duration-300 ease-in-out"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div class="md:col-span-1">
          <ImageUploader
            ref="profilePhotoUploader"
            v-model="selectedCustomer.profilePhoto"
            :label="$t('ProfilePhoto')"
            :max-size-m-b="5"
            :cloudinary-config="cloudinaryConfig"
            @upload-success="onProfilePhotoSuccess"
            @upload-error="onUploadError"
          />
        </div>

        <div class="md:col-span-2 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-0">
            <div class="sm:col-span-1">
              <Select
                :lb="$t('Title')"
                :options="GuestTitles"
                v-model="selectedCustomer.title"
                :default-value="$t('guestTitles.mr')"
                custom-class="rounded-r-none"
              />
            </div>
            <div class="sm:col-span-2">
              <CustomerSarch
                @customer-selected="selectCustomer"
                v-model="selectedCustomer"
              />
            </div>
          </div>

          <div>
            <Input
              :lb="$t('LastName')"
              v-model="selectedCustomer.lastName"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputPhone
                :title="$t('Phone')"
                v-model="selectedCustomer.phoneNumber"
                :id="'phone'"
                :is-required="false"
              />
            </div>
            <div>
              <InputEmail
                v-model="selectedCustomer.email"
                placeholder="info@gmail.com"
                :title="$t('Email')"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <Input
          :inputType="'text'"
          :lb="$t('Address')"
          :id="'address'"
          forLabel="'address'"
          v-model="selectedCustomer.address"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div>
          <InputCountries
            :lb="'Country'"
            v-model="selectedCustomer.country"
          />
        </div>
        <div>
          <Input
            :inputType="'text'"
            :lb="$t('State')"
            :id="'State'"
            forLabel="'State'"
            v-model="selectedCustomer.state"
          />
        </div>
        <div>
          <Input
            :inputType="'text'"
            :lb="$t('City')"
            :id="'city'"
            forLabel="'city'"
            v-model="selectedCustomer.city"
          />
        </div>
        <div>
          <Input
            :inputType="'text'"
            :lb="$t('Zipcode')"
            :id="'zipcode'"
            forLabel="'zipcode'"
            v-model="selectedCustomer.zipcode"
          />
        </div>
      </div>
    </div>


    </div>

    <!-- Section Informations d'Identité -->
    <div class=" p-2">
      <button
        @click.prevent="toggleIdentitySection"
        class="flex items-center justify-between w-full text-left group hover:bg-gray-50 -m-2 p-2 rounded-md transition-colors"
      >
        <h2 class="text-xl font-semibold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-2 5v3m0 0l-1-1m1 1l1-1"></path>
          </svg>
          {{ $t('IdentityInformation') }}
        </h2>

        <div class="flex items-center">

          <ChevronDownIcon
            :class="[
              'w-5 h-5 text-gray-500 transition-all duration-200 group-hover:text-gray-700',
              { 'rotate-180': showIdentitySection }
            ]"
          />
        </div>
      </button>

      <div class="p-2">
    <div
      v-show="showIdentitySection"
      class="mt-6 transition-all duration-300 ease-in-out"
    >
      <div class=" space-y-6">
        </div>

      <div class=" md:grid md:grid-cols-12 gap-6 items-start">
        <div class="col-span-12 md:col-span-3 lg:col-span-2">
          <label class=" text-sm font-medium text-gray-700 mb-3">
            {{ $t('IDPhoto') }}
          </label>
          <div class="w-full max-w-xs">
            <ImageUploader
              ref="idPhotoUploader"
              v-model="selectedCustomer.idPhoto"
              :cloudinary-config="cloudinaryConfig"
              @upload-success="onIdPhotoSuccess"
              @upload-error="onUploadError"
              :key="`id-${resetKey}`"
              class="w-full aspect-square"
            />
          </div>
        </div>

        <div class="col-span-12 md:col-span-9 lg:col-span-10 space-y-4">
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputDatePicker
                :title="$t('ExpiryDate')"
                v-model="selectedCustomer.idExpiryDate"
                :placeholder="$t('Select Date')"
              />
            </div>
            <div>
              <InputCountries
                :lb="$t('Countryofissue')"
                v-model="selectedCustomer.issuingCountry"
              />
            </div>
          </div>

          <div>
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
  align-items: flex-start; /* Aligns items at the start of the container */
}
</style>
