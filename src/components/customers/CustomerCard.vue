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

const customers = ref<any[]>([])
const users = ref<any[]>([])
const serviceStore = useServiceStore()
const showIdentitySection = ref(false)
const selectedCustomer = ref<any>({ ...props.modelValue })
const idTypeOptions = ref<SelectOption[]>([])
const resetKey = ref(0)
const toast = useToast()

const toggleIdentitySection = () => {
  showIdentitySection.value = !showIdentitySection.value
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
  // selectedCustomer.value.idType = customer.idType ?? selectedCustomer.value.idType
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

const idPhotoUploader = ref<InstanceType<typeof ImageUploader> | null>(null)

const onIdPhotoSuccess = async (result: any) => {
  try {
    if (idPhotoUploader.value?.hasSelectedFile()) {
      const uploadedUrl = await idPhotoUploader.value.uploadToCloudinary()
      selectedCustomer.value.idPhoto = uploadedUrl  // CORRECTION: Ajout de .value
    } else {
      selectedCustomer.value.idPhoto = result.url || result.info?.secure_url || result  // CORRECTION: Ajout de .value
    }
    toast.success(t('ID photo uploaded successfully'))
  } catch (error) {
    console.error('Error handling ID photo:', error)
    toast.error(t('ID photo upload failed'))
  }
}

const onUploadError = (error: any) => {
  console.error('Upload error:', error)
  toast.error(t('Image upload failed'))
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
      <h2 class="text-xl font-semibold text-gray-900 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        {{ $t('personalInformation') }}
      </h2>

      <!-- Première ligne : Titre et Recherche Client -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-0 mb-6">
        <div class="lg:col-span-2">
          <Select
            :lb="$t('Title')"
            :options="GuestTitles"
            v-model="selectedCustomer.title"
            :default-value="$t('guestTitles.mr')"
            customClass="rounded-r-none border-r-0"
          />
        </div>

        <div class="lg:col-span-5">
          <CustomerSarch
            @customer-selected="selectCustomer"
            v-model="selectedCustomer"

          />
        </div>

        <div class="lg:col-span-5 px-2">
          <Input
            :lb="$t('LastName')"
            v-model="selectedCustomer.lastName"

          />
        </div>
        </div>

      <!-- Informations de base -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-3">


        <div>
          <InputPhone
            :title="$t('Phone')"
            v-model="selectedCustomer.phoneNumber"
            :id="'phone'"
            :is-required="false"
            class="w-full"
          />
        </div>

        <div>
          <InputEmail
            v-model="selectedCustomer.email"
            placeholder="info@gmail.com"
            :title="$t('Email')"
            required
            class="w-full"
          />
        </div>
      </div>

      <!-- Adresse -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
        <div class="lg:col-span-2">
          <Input
            :inputType="'text'"
            :lb="$t('Address')"
            :id="'address'"
            forLabel="'address'"
            v-model="selectedCustomer.address"
            class="w-full"
          />
        </div>
      </div>

      <!-- Localisation -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <InputCountries
            :lb="'Country'"
            v-model="selectedCustomer.country"
            class="w-full"
          />
        </div>

        <div>
          <Input
            :inputType="'text'"
            :lb="$t('State')"
            :id="'State'"
            forLabel="'State'"
            v-model="selectedCustomer.state"
            class="w-full"
          />
        </div>

        <div>
          <Input
            :inputType="'text'"
            :lb="$t('City')"
            :id="'city'"
            forLabel="'city'"
            v-model="selectedCustomer.city"
            class="w-full"
          />
        </div>

        <div>
          <Input
            :inputType="'text'"
            :lb="$t('Zipcode')"
            :id="'zipcode'"
            forLabel="'zipcode'"
            v-model="selectedCustomer.zipcode"
            class="w-full"
          />
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

      <div
        v-show="showIdentitySection"
        class="mt-6 transition-all duration-300 ease-in-out"
      >
        <!-- Mobile: Photo en haut, puis informations -->
        <div class="block md:hidden space-y-6">
          <!-- Photo d'identité (Mobile) -->
          <div class="text-center">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              {{ $t('IDPhoto') }}
            </label>
            <div class="inline-block">
              <ImageUploader
                ref="idPhotoUploader"
                v-model="selectedCustomer.idPhoto"
                @upload-success="onIdPhotoSuccess"
                @upload-error="onUploadError"
                :key="`id-${resetKey}`"
                class="w-32 h-32 mx-auto"
              />
            </div>
          </div>

          <!-- Informations d'identité (Mobile) -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <Select
                  :lb="$t('IDType')"
                  v-model="selectedCustomer.idType"
                  :options="idTypeOptions"
                  :placeholder="$t('Select ID Type')"
                  class="w-full"
                />
              </div>

              <div>
                <Input
                  :lb="idNumberLabel"
                  v-model="selectedCustomer.idNumber"
                  type="text"
                  :placeholder="idNumberLabel"
                  class="w-full"
                />
              </div>

              <div>
                <InputDatePicker
                  :title="$t('ExpiryDate')"
                  v-model="selectedCustomer.idExpiryDate"
                  :placeholder="$t('Select Date')"
                  class="w-full"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <InputCountries
                  :lb="$t('Countryofissue')"
                  v-model="selectedCustomer.issuingCountry"
                  class="w-full"
                />
              </div>

              <div>
                <Input
                  :lb="$t('Cityofissue')"
                  v-model="selectedCustomer.issuingCity"
                  :placeholder="$t('Cityofissue')"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: Layout côte à côte -->
        <div class="hidden md:grid md:grid-cols-12 gap-6 items-start">
          <!-- Photo d'identité (Desktop) -->
          <div class="col-span-12 md:col-span-3 lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              {{ $t('IDPhoto') }}
            </label>
            <div class="w-full max-w-xs">
              <ImageUploader
                ref="idPhotoUploader"
                v-model="selectedCustomer.idPhoto"
                @upload-success="onIdPhotoSuccess"
                @upload-error="onUploadError"
                :key="`id-${resetKey}`"
                class="w-full aspect-square"
              />
            </div>
          </div>

          <!-- Informations d'identité (Desktop) -->
          <div class="col-span-12 md:col-span-9 lg:col-span-10 space-y-4">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <Select
                  :lb="$t('IDType')"
                  v-model="selectedCustomer.idType"
                  :options="idTypeOptions"
                  :placeholder="$t('Select ID Type')"
                  class="w-full"
                />
              </div>

              <div class="lg:col-span-2">
                <Input
                  :lb="idNumberLabel"
                  v-model="selectedCustomer.idNumber"
                  type="text"
                  :placeholder="idNumberLabel"
                  class="w-full"
                />
              </div>

              <div>
                <InputDatePicker
                  :title="$t('ExpiryDate')"
                  v-model="selectedCustomer.idExpiryDate"
                  :placeholder="$t('Select Date')"
                  class="w-full"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <InputCountries
                  :lb="$t('Countryofissue')"
                  v-model="selectedCustomer.issuingCountry"
                  class="w-full"
                />
              </div>

              <div class="md:col-span-2 lg:col-span-2">
                <Input
                  :lb="$t('Cityofissue')"
                  v-model="selectedCustomer.issuingCity"
                  :placeholder="$t('Cityofissue')"
                  class="w-full"
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
