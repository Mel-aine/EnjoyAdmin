<template>
  <div class="flex h-[calc(100vh-250px)] mx-4">
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50">
      <div class="h-full flex flex-col justify-between">
        <div class="bg-white h-full">
          <div class="flex justify-between pt-2 px-2 pb-2">
            <span>Room/Guest</span>
            <PlusCircle class="text-primary cursor-pointer" @click="createNewGuest" />
          </div>

          <Accordion
            v-for="(fo, index) in reservation.reservationRooms"
            :key="index"
            :title="`${fo.room.roomNumber}`"
            class="mb-2"
          >
            <div v-for="(guest, guestIndex) in guestList" :key="guestIndex">
              <div
                class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 my-1"
                :class="
                  selectedGuest?.id === guest.id
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'bg-gray-100'
                "
                @click="selectGuest(guest)"
              >
                <span class="capitalize">{{
                  guest.displayName || guest.firstName + ' ' + guest.lastName
                }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </Accordion>
        </div>
        <div class="px-4"></div>
      </div>
    </div>

    <div class="w-10/12">
      <div class="h-full flex flex-col justify-between">
        <div class="bg-white border border-gray-200 p-6 overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="bg-blue-100 p-2 rounded-lg">
                <UserCircleIcon class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  {{ isCreatingNewGuest ? $t('New Guest') : $t('Guest') }}
                </h2>
                <p class="text-sm text-gray-500">
                  {{
                    isCreatingNewGuest
                      ? $t('Create new guest information')
                      : $t('Guest information and details')
                  }}
                </p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                class="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                @click="editGuest"
              >
                <svg
                  v-if="!isEditing"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>{{ isEditing ? $t('Cancel') : $t('Edit') }}</span>
              </button>
              <button
                class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                @click="uploadImage"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Guest Form -->
          <div class="space-y-6">
            <!-- Section Informations Générales avec Photo de Profil -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <!-- ImageUploader pour la Photo de Profil -->
              <div class="col-span-12 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{
                  $t('Profile Photo')
                }}</label>
                <ImageUploader
                  ref="profilePhotoUploader"
                  v-model="guestData.profilePhoto"
                  :disabled="!isEditing"
                  @upload-success="onProfilePhotoSuccess"
                  @upload-error="onUploadError"
                />
              </div>

              <!-- Champs d'information de base -->
              <div class="col-span-12 md:col-span-10 space-y-6">
                <!-- Ligne Nom, Téléphone, Mobile -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Nom -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">{{
                      $t('Name')
                    }}</label>
                    <div class="flex">
                      <div class="w-20 -translate-y-1.5">
                        <Select
                          v-model="guestData.title"
                          :options="titleOptions"
                          customClass="rounded-r-none"
                          :placeholder="$t('Mr')"
                          :disabled="!isEditing"
                        />
                      </div>

                      <!-- Mode Affichage: Nom complet en lecture seule -->
                      <div v-if="!isEditing" class="flex-1">
                        <div
                          class="h-11 w-full rounded-lg rounded-l-none border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                        >
                          {{ fullName }}
                        </div>
                      </div>

                      <!-- Mode Édition: Prénom et Nom -->
                      <div v-if="isEditing" class="flex-1 flex gap-0">
                        <div class="flex-1">
                          <input
                            v-model="guestData.firstName"
                            type="text"
                            :placeholder="$t('FirstName')"
                            class="h-11 w-full rounded-lg rounded-l-none rounded-r-none border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :disabled="!isEditing"
                          />
                        </div>
                        <div class="flex-1">
                          <input
                            v-model="guestData.lastName"
                            type="text"
                            :placeholder="$t('LastName')"
                            class="h-11 w-full rounded-lg rounded-l-none border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :disabled="!isEditing"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Téléphone -->
                  <div>
                    <InputPhone
                      :title="$t('Phone')"
                      v-model="guestData.phone"
                      :id="'phone'"
                      :is-required="false"
                      :disabled="!isEditing"
                    />
                  </div>

                  <!-- Mobile -->
                  <div>
                    <Input
                      :lb="$t('Mobile')"
                      v-model="guestData.mobile"
                      type="tel"
                      :placeholder="$t('Mobile')"
                      :disabled="!isEditing"
                    />
                  </div>
                </div>

                <!-- Ligne Email, Genre, Type de client, Statut VIP -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <!-- Email -->
                  <div>
                    <InputEmail
                      :title="$t('Email')"
                      v-model="guestData.email"
                      :placeholder="$t('Email')"
                      :disabled="!isEditing"
                    />
                  </div>

                  <!-- Genre -->
                  <div>
                    <Select
                      :lb="$t('Gender')"
                      v-model="guestData.gender"
                      :options="genderOptions"
                      :placeholder="$t('Male')"
                      :disabled="!isEditing"
                    />
                  </div>

                  <!-- Type de client -->
                  <div>
                    <Select
                      :lb="$t('guestType')"
                      v-model="guestData.guestType"
                      :options="guestTypeOptions"
                      :placeholder="$t('selected_item')"
                      :disabled="!isEditing"
                    />
                  </div>

                  <!-- Statut VIP -->
                  <div>
                    <Select
                      :lb="$t('VIP Status')"
                      v-model="guestData.vipStatus"
                      :options="vipStatusOptions"
                      :placeholder="$t('Select')"
                      :disabled="!isEditing"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Adresse -->
            <div class="border-t pt-6 space-y-4">
              <!-- Champ Adresse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{
                  $t('Address')
                }}</label>
                <textarea
                  v-model="guestData.address"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 resize-none"
                  :placeholder="$t('Address')"
                  :disabled="!isEditing"
                ></textarea>
              </div>

              <!-- Ligne Localisation -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Pays -->
                <div>
                  <InputCountries
                    v-model="guestData.country"
                    :placeholder="$t('Country')"
                    :disabled="!isEditing"
                  />
                </div>

                <!-- État/Province -->
                <div>
                  <Input
                    :lb="$t('State/Province')"
                    v-model="guestData.stateProvince"
                    :placeholder="$t('State/Province')"
                    :disabled="!isEditing"
                  />
                </div>

                <!-- Ville -->
                <div>
                  <Input
                    :lb="$t('City')"
                    v-model="guestData.city"
                    type="text"
                    :placeholder="$t('City')"
                    :disabled="!isEditing"
                  />
                </div>

                <!-- Code Postal -->
                <div>
                  <Input
                    :lb="$t('postalCode')"
                    v-model="guestData.postalCode"
                    :placeholder="$t('postalCode')"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
            </div>

            <!-- Section Informations Professionnelles -->
            <div class="border-t pt-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Nationalité -->
                <div>
                  <InputCountries
                    v-model="guestData.nationality"
                    :placeholder="$t('India')"
                    :lb="$t('Nationality')"
                    :disabled="!isEditing"
                  />
                </div>
                <!-- Société -->
                <div>
                  <Input
                    :lb="$t('Company Name')"
                    v-model="guestData.company"
                    type="text"
                    :placeholder="$t('Company')"
                    :disabled="!isEditing"
                  />
                </div>
                <!-- Fax -->
                <div>
                  <Input
                    :lb="$t('Fax')"
                    v-model="guestData.fax"
                    type="text"
                    :placeholder="$t('Fax')"
                    :disabled="!isEditing"
                  />
                </div>
                <!-- Numéro d'enregistrement -->
                <div>
                  <Input
                    :lb="$t('Registration No')"
                    v-model="guestData.registrationNo"
                    type="text"
                    :placeholder="$t('Registration No')"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
            </div>

            <!-- Section Informations d'Identité (Pliable) -->
            <div class="border-t pt-4">
              <button
                @click="toggleIdentitySection"
                class="flex items-center justify-between w-full text-left"
              >
                <h3 class="text-lg font-medium text-gray-700">{{ $t('Identity Information') }}</h3>
                <ChevronDownIcon
                  :class="[
                    'w-5 h-5 text-gray-500 transition-transform',
                    { 'rotate-180': showIdentitySection },
                  ]"
                />
              </button>

              <div
                v-show="showIdentitySection"
                class="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                <!-- ImageUploader pour la Photo de la Pièce d'Identité -->
                <div class="col-span-12 md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">{{
                    $t('ID Photo')
                  }}</label>
                  <ImageUploader
                    ref="idPhotoUploader"
                    v-model="guestData.idPhoto"
                    :disabled="!isEditing"
                    @upload-success="onIdPhotoSuccess"
                    @upload-error="onUploadError"
                  />
                </div>

                <div class="col-span-12 md:col-span-10 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Type de Pièce d'Identité -->
                    <div>
                      <Select
                        :lb="$t('ID Type')"
                        v-model="guestData.idType"
                        :options="idTypeOptions"
                        :placeholder="$t('Select ID Type')"
                        :disabled="!isEditing"
                      />
                    </div>
                    <!-- Numéro de Pièce d'Identité -->
                    <div class="md:col-span-2">
                      <Input
                        :lb="$t('ID Number')"
                        v-model="guestData.idNumber"
                        type="text"
                        :placeholder="$t('Enter ID Number')"
                        :disabled="!isEditing"
                      />
                    </div>
                    <div>
                      <InputDatePicker
                        :title="$t('ExpiryDate')"
                        v-model="guestData.idExpiryDate"
                        :placeholder="$t('Select Date')"
                        :disabled="!isEditing"
                      />
                    </div>
                  </div>

                  <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> -->
                  <!-- Date de Naissance -->
                  <!-- <div>
            <InputDatePicker :title="$t('Date of Birth')" v-model="guestData.dateOfBirth" :placeholder="$t('Select Date')" :disabled="!isEditing" />
          </div> -->
                  <!-- Date d'Expiration -->

                  <!-- </div> -->

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Pays d'Émission -->
                    <div>
                      <InputCountries
                        :lb="$t('Countryofissue')"
                        v-model="guestData.issuingCountry"
                        :disabled="!isEditing"
                      />
                    </div>
                    <!-- Ville d'Émission -->
                    <div class="md:col-span-2">
                      <Input
                        :lb="$t('Cityofissue')"
                        v-model="guestData.issuingCity"
                        :placeholder="$t('Cityofissue')"
                        :disabled="!isEditing"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Autres Informations (Pliable) -->
            <div class="border-t pt-4">
              <button
                @click="toggleOtherInfoSection"
                class="flex items-center justify-between w-full text-left"
              >
                <h3 class="text-lg font-medium text-gray-700">{{ $t('OtherInformation') }}</h3>
                <ChevronDownIcon
                  :class="[
                    'w-5 h-5 text-gray-500 transition-transform',
                    { 'rotate-180': showOtherInfoSection },
                  ]"
                />
              </button>
              <div v-show="showOtherInfoSection" class="mt-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Préférence d'étage -->
                  <div>
                    <Input
                      v-model="guestData.preferences.floor"
                      :lb="$t('preferences.floor.label')"
                      :placeholder="$t('preferences.floor.placeholder')"
                      :disabled="!isEditing"
                    />
                  </div>
                  <!-- Préférence de vue -->
                  <div>
                    <Input
                      v-model="guestData.preferences.view"
                      :lb="$t('preferences.view.label')"
                      :placeholder="$t('preferences.view.placeholder')"
                      :disabled="!isEditing"
                    />
                  </div>
                  <!-- Type de lit -->
                  <div>
                    <Input
                      v-model="guestData.preferences.bed_type"
                      :lb="$t('preferences.bed_type.label')"
                      :placeholder="$t('preferences.bed_type.placeholder')"
                      :disabled="!isEditing"
                    />
                  </div>
                </div>
                <!-- Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">{{
                    $t('preferences.notes.label')
                  }}</label>
                  <textarea
                    v-model="guestData.preferences.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none focus:ring-3 focus:ring-purple-500/10 resize-vertical"
                    :placeholder="$t('preferences.notes.placeholder')"
                    :disabled="!isEditing"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="isEditing" class="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <BasicButton variant="secondary" :label="$t('Cancel')" @click="cancelEdit" />
            <BasicButton
              variant="primary"
              :label="$t('Save Changes')"
              @click="saveGuest"
              :loading="isSaving"
            />
          </div>
        </div>
        <div class="px-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import BasicButton from '../buttons/BasicButton.vue'
import Input from '../forms/FormElements/Input.vue'
import Select from '../forms/FormElements/Select.vue'
import InputCountries from '../forms/FormElements/InputCountries.vue'
import InputDatePicker from '../forms/FormElements/InputDatePicker.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'
import InputPhone from '../forms/FormElements/InputPhone.vue'
import InputEmail from '../forms/FormElements/InputEmail.vue'
import ImageUploader from '@/components/customers/ImageUploader.vue'
import { createGuest, updateGuest, type GuestPayload } from '@/services/guestApi'
import { useServiceStore } from '@/composables/serviceStore'
import { PlusCircle, ChevronRight } from 'lucide-vue-next'
import UserCircleIcon from '@/icons/UserCircleIcon.vue'

interface GuestData {
  title: string
  firstName: string
  lastName: string
  profilePhoto?: string | null
  phone: string
  mobile: string
  email: string
  gender: string
  guestType: string
  vipStatus: string
  address: string
  country: string
  stateProvince: string
  city: string
  postalCode: string
  nationality: string
  company: string
  fax: string
  registrationNo: string
  idPhoto?: string | null
  idType: string
  idNumber: string
  dateOfBirth: string
  idExpiryDate: string
  issuingCountry: string
  issuingCity: string
  preferences: {
    floor: string
    view: string
    bed_type: string
    notes: string
  }
}
interface Props {
  guest?: any
  reservationId?: number
  readonly?: boolean
  reservation: any
}

const props = defineProps<Props>()
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()

// State
const isSaving = ref(false)
const isEditing = ref(false)

// State pour les sections dépliantes
const showIdentitySection = ref(false)
const showOtherInfoSection = ref(false)

const selectedGuest = ref(
  props.guest || (props.reservation?.guests && props.reservation.guests[0]) || null,
)
const isCreatingNewGuest = ref(false)

// Fonction d'initialisation mise à jour avec tous les nouveaux champs
const initializeGuestData = (guest: any = null): GuestData => ({
  title: guest?.title || 'Mr',
  firstName: guest?.firstName || '',
  lastName: guest?.lastName || '',
  profilePhoto: guest?.profilePhoto || null,
  phone: guest?.phone || '',
  mobile: guest?.mobile || '',
  email: guest?.email || '',
  gender: guest?.gender || 'male',
  guestType: guest?.guestType || '',
  vipStatus: guest?.vipStatus || 'regular',
  address: guest?.addressLine || '',
  country: guest?.country || '',
  stateProvince: guest?.stateProvince || '',
  city: guest?.city || '',
  postalCode: guest?.postalCode || '',
  nationality: guest?.nationality || '',
  company: guest?.companyName || '',
  fax: guest?.fax || '',
  registrationNo: guest?.registrationNumber || '',
  idPhoto: guest?.idPhoto || null,
  idType: guest?.idType || '',
  idNumber: guest?.idNumber || '',
  dateOfBirth: guest?.dateOfBirth || '',
  idExpiryDate: guest?.idExpiryDate || '',
  issuingCountry: guest?.issuingCountry || '',
  issuingCity: guest?.issuingCity || '',
  preferences: {
    floor: guest?.preferences?.floor || '',
    view: guest?.preferences?.view || '',
    bed_type: guest?.preferences?.bed_type || '',
    notes: guest?.preferences?.notes || '',
  },
})

const guestData = reactive<GuestData>(initializeGuestData(selectedGuest.value))

// Computed properties
const guestList = computed(() => props.reservation?.guests || [])
const fullName = computed(() => (guestData.firstName + ' ' + guestData.lastName).trim() || '')

// Watch for changes in selected guest
watch(
  selectedGuest,
  (newGuest) => {
    Object.assign(guestData, initializeGuestData(newGuest))
  },
  { deep: true },
)

// Options pour les 'Select'
const titleOptions = computed(() => [
  { label: t('Mr'), value: 'Mr' },
  { label: t('Mrs'), value: 'Mrs' },
  { label: t('Ms'), value: 'Ms' },
])
const genderOptions = computed(() => [
  { label: t('Male'), value: 'male' },
  { label: t('Female'), value: 'female' },
  { label: t('Other'), value: 'other' },
])
// Nouvelles options pour le type de client
const guestTypeOptions = computed(() => [
  { label: t('Individual'), value: 'individual' },
  { label: t('Corporate'), value: 'corporate' },
  { label: t('Group'), value: 'group' },
])
const vipStatusOptions = computed(() => [
  { label: t('Regular'), value: 'regular' },
  { label: t('VIP'), value: 'vip' },
  { label: t('VVIP'), value: 'vvip' },
])
const idTypeOptions = computed(() => [
  { label: t('Passport'), value: 'passport' },
  { label: t('National ID'), value: 'national_id' },
])

// --- Méthodes ---

const selectGuest = (guest: any) => {
  selectedGuest.value = guest
  isCreatingNewGuest.value = false
  Object.assign(guestData, initializeGuestData(guest))
  isEditing.value = false
}

const createNewGuest = () => {
  selectedGuest.value = null
  isCreatingNewGuest.value = true
  Object.assign(guestData, initializeGuestData())
  isEditing.value = true
}

const toggleIdentitySection = () => {
  showIdentitySection.value = !showIdentitySection.value
}

// Nouvelle fonction pour la section "Autres informations"
const toggleOtherInfoSection = () => {
  showOtherInfoSection.value = !showOtherInfoSection.value
}

const editGuest = () => {
  isEditing.value = !isEditing.value
}

// Fonctions pour gérer les retours du composant ImageUploader
const onProfilePhotoSuccess = (result: any) => {
  guestData.profilePhoto = result.info.secure_url
  toast.success(t('Profile photo uploaded successfully'))
}

const onIdPhotoSuccess = (result: any) => {
  guestData.idPhoto = result.info.secure_url
  toast.success(t('ID photo uploaded successfully'))
}

const onUploadError = (error: any) => {
  console.error('Upload error:', error)
  toast.error(t('Image upload failed'))
}

// Fonction de préparation de la charge utile (payload) mise à jour
const prepareGuestPayload = (): GuestPayload => {
  const payload: GuestPayload = {
    hotelId: serviceStore.serviceId!,
    title: guestData.title,
    firstName: guestData.firstName,
    lastName: guestData.lastName,
    profilePhoto: guestData.profilePhoto,
    phonePrimary: guestData.phone,
    mobileNumber: guestData.mobile,
    email: guestData.email,
    gender: guestData.gender,
    guestType: guestData.guestType,
    vipStatus: guestData.vipStatus,
    addressLine: guestData.address,
    country: guestData.country,
    stateProvince: guestData.stateProvince,
    city: guestData.city,
    postalCode: guestData.postalCode,
    nationality: guestData.nationality,
    companyName: guestData.company,
    fax: guestData.fax,
    registrationNumber: guestData.registrationNo,
    idPhoto: guestData.idPhoto,
    idType: guestData.idType,
    idNumber: guestData.idNumber,
    dateOfBirth: guestData.dateOfBirth,
    idExpiryDate: guestData.idExpiryDate,
    issuingCountry: guestData.issuingCountry,
    issuingCity: guestData.issuingCity,
    // preferences: guestData.preferences
  }

  // Optionnel: Nettoyer les valeurs vides
  Object.keys(payload).forEach((key) => {
    const value = payload[key as keyof GuestPayload]
    if (value === '' || value === null || value === undefined) {
      delete payload[key as keyof GuestPayload]
    }
  })

  return payload
}

const saveGuest = async () => {
  isSaving.value = true
  try {
    const payload = prepareGuestPayload()

    if (isCreatingNewGuest.value) {
      await createGuest(payload)
      toast.success(t('Guest created successfully'))
    } else {
      const guestId = selectedGuest.value?.id
      if (!guestId) throw new Error('Guest ID is required for update')
      await updateGuest(guestId, payload)
      toast.success(t('Guest updated successfully'))
    }

    isEditing.value = false
    isCreatingNewGuest.value = false
    // Idéalement, rafraîchir la liste des clients ici
  } catch (error: any) {
    console.error('Error saving guest:', error)
    const errorMessage = error.response?.data?.message || error.message
    toast.error(`${t('Error saving guest')}: ${errorMessage}`)
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  if (isCreatingNewGuest.value) {
    isCreatingNewGuest.value = false
    const guestToSelect = props.guest || guestList.value?.[0]
    if (guestToSelect) {
      selectGuest(guestToSelect)
    }
  } else {
    Object.assign(guestData, initializeGuestData(selectedGuest.value))
  }
}
</script>
