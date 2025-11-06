<template>
  <div class="flex h-[calc(100vh-250px)] mx-4 mt-2 shadow-lg">
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50">
      <div class="h-full flex flex-col justify-between">
        <div class="bg-white dark:bg-gray-800 h-full">
          <div class="flex justify-between pt-2 px-2 pb-2">
            <span class="dark:text-gray-200">{{ $t('Room/Guest') }}</span>
            <PlusCircle class="text-primary cursor-pointer" @click="createNewGuest" />
          </div>

          <Accordion
            v-for="(fo, index) in reservation.reservationRooms"
            :key="index"
            :title="`${fo.room?.roomNumber || 'No Room Number'}`"
            class="mb-2"
          >
            <div v-for="(guest, guestIndex) in guestList" :key="guestIndex">
              <div
                class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 my-1"
                :class="
                  selectedGuest?.id === guest.id
                    ? 'bg-blue-100 border-l-4 border-blue-500 dark:bg-blue-900 dark:border-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800'
                "
                @click="selectGuest(guest)"
              >
                <span class="capitalize dark:text-gray-200">{{
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
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto custom-scrollbar">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <UserCircleIcon class="w-6 h-6 text-blue-600 dark:text-blue-200" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ isCreatingNewGuest ? $t('New Guest') : $t('Guest') }}
                </h2>
                <div
                  v-if="props.reservation.guest?.blacklisted && !isCreatingNewGuest"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-400"
                >
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 008.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ $t('Blacklisted') }}
                </div>

                <p class="text-sm text-gray-500 dark:text-gray-400">
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
                class="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            </div>
          </div>

          <!-- Guest Form -->
          <div class="space-y-6">
            <!-- Section Informations Générales avec Photo de Profil -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <!-- ImageUploader pour la Photo de Profil -->
              <div class="col-span-12 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{
                  $t('ProfilePhoto')
                }}</label>
                <ImageUploader
                  ref="profilePhotoUploader"
                  v-model="guestData.profilePhoto"
                  :disabled="!isEditing"
                  @upload-success="onProfilePhotoSuccess"
                  @upload-error="onUploadError"
                  :key="`profile-${resetKey}`"
                />
              </div>

              <!-- Champs d'information de base -->
              <div class="col-span-12 md:col-span-10 space-y-6">
                <!-- Ligne Nom, Téléphone, Mobile -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Nom -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{
                      $t('Name')
                    }}</label>
                    <div class="flex">
                      <div class="w-20 -translate-y-1/9">
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
                            class="h-11 w-full  rounded-l-none rounded-r-none border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :disabled="!isEditing"
                          />
                        </div>
                        <div class="flex-1">
                          <input
                            v-model="guestData.lastName"
                            type="text"
                            :placeholder="$t('LastName')"
                            class="h-11 w-full  rounded-l-none border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :disabled="!isEditing"
                          />
                        </div>
                         <div class="flex-1">
                          <input
                            v-model="guestData.maidenName"
                            type="text"
                            :placeholder="$t('MaidenName')"
                            class="h-11 w-full  rounded-r-lg border border-black/50 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-purple-500 focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-800"
                            :disabled="!isEditing"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                   <!--  Date de naissance -->
                    <div class="">
                      <InputDatePicker
                        :title="$t('DateOfBirth')"
                        v-model="guestData.dateOfBirth"
                        :placeholder="$t('select_date')"
                        :disabled="!isEditing"
                      />
                    </div>
                    <!-- Lieu de naissance -->
                    <div class="">
                      <Input
                        :lb="$t('PlaceOfBirth')"
                        :id="'placeOfBirth'"
                        v-model="guestData.placeOfBirth"
                        :placeholder="$t('PlaceOfBirth')"
                        :disabled="!isEditing"
                      />
                    </div>


                    </div>
                    <div :class="[
                      'mt-4 grid grid-cols-1 gap-4',
                      guestData.contactType ? 'md:grid-cols-4' : 'md:grid-cols-3',
                    ]">

                       <div>
                      <!-- <Input
                        :lb="$t('profession')"
                        :id="'profession'"
                        v-model="guestData.profession"
                        :placeholder="$t('profession')"
                        :disabled="!isEditing"
                      /> -->
                       <ProfessionAutocomplete
                          v-model="guestData.profession"
                          :lb="$t('profession')"
                          :placeholder="$t('profession')"
                          custom-class="w-20"
                          :disabled="!isEditing"
                        />
                    </div>
                    <!-- <div>
                       <Select
                          v-model="guestData.contactType"
                          :placeholder="$t('-select-')"
                          :lb="$t('contactType')"
                          :options="TypesOfContact"
                           :disabled="!isEditing"
                        />
                    </div> -->
                     <div>
                    <AutoCompleteSelect
                      v-model="guestData.contactType"
                      :options="TypesOfContact"
                      :defaultValue="$t('contact_type')"
                      :lb="$t('contact_type')"
                      :is-required="false"
                      :use-dropdown="useDropdownBooking"
                      @clear-error="emit('clear-error')"
                      custom-class="h-11"
                      :disabled="!isEditing"
                    />
                  </div>

                  <div v-if="guestData.contactType">
                    <InputPhone
                      v-if="contactInputComponent === 'InputPhone'"
                      :title="contactInputLabel"
                      v-model="contactValue"
                      :id="'contact-input'"
                      :is-required="false"
                      custom-class="h-11"
                      :disabled="!isEditing"
                    />

                    <InputEmail
                      v-else-if="contactInputComponent === 'InputEmail'"
                      v-model="contactValue"
                      :placeholder="contactInputLabel"
                      :title="contactInputLabel"
                      custom-class="h-11"
                      :disabled="!isEditing"
                    />

                    <Input
                      v-else-if="contactInputComponent === 'Input'"
                      :lb="contactInputLabel"
                      v-model="contactValue"
                      :placeholder="contactInputLabel"
                      custom-class="h-11"
                      :disabled="!isEditing"
                    />
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
                  <!-- <div>
                      <InputPhone
                      :title="$t('mobile')"
                      v-model="guestData.mobile"
                      :id="'tel'"
                      :is-required="false"
                      :disabled="!isEditing"
                    />

                  </div> -->
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
                      :lb="$t('gender')"
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
                      :lb="$t('StatutVIP')"
                      v-model="guestData.vipStatusId"
                      :options="vipStatusOptions"
                      :placeholder="$t('Select')"
                      :is-Loading="loading"
                      :disabled="!isEditing"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Adresse -->
            <div class="border-t dark:border-gray-700 pt-6 space-y-4">
              <!-- Champ Adresse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
                  $t('Address')
                }}</label>
                <textarea
                  v-model="guestData.address"
                  rows="2"
                  class="w-full px-3 py-2 border rounded-lg border-black/50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:border-purple-500 focus:outline-none focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 dark:focus:border-purple-800 resize-none"
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
                    :lb="$t('city')"
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
            <div class="border-t dark:border-gray-700 pt-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Nationalité -->
                <div>
                  <InputCountries
                    v-model="guestData.nationality"
                    :placeholder="$t('India')"
                    :lb="$t('nationality')"
                    :disabled="!isEditing"
                  />
                </div>
                <!-- Société -->
                <div>
                  <Select
                    :lb="$t('Company Name')"
                    v-model="guestData.company"
                    :options="companyOptions"
                    :placeholder="$t('-select-')"
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
                    :lb="$t('RegistrationNo')"
                    v-model="guestData.registrationNo"
                    type="text"
                    :placeholder="$t('RegistrationNo')"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
            </div>

            <!-- Section Informations d'Identité (Pliable) -->
            <div class="border-t dark:border-gray-700 pt-4">
              <button
                @click="toggleIdentitySection"
                class="flex items-center justify-between w-full text-left"
              >
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">{{ $t('IdentityInformation') }}</h3>
                <ChevronDownIcon
                  :class="[
                    'w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform',
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
                    $t('IDPhoto')
                  }}</label>
                  <ImageUploader
                    ref="idPhotoUploader"
                    v-model="guestData.idPhoto"
                    :disabled="!isEditing"
                    @upload-success="onIdPhotoSuccess"
                    @upload-error="onUploadError"
                    :key="`id-${resetKey}`"
                  />
                </div>

                <div class="col-span-12 md:col-span-10 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Type de Pièce d'Identité -->
                    <div>
                      <Select
                        :lb="$t('IDType')"
                        v-model="guestData.idType"
                        :options="idTypeOptions"
                        :placeholder="$t('select_id_type')"
                        :disabled="!isEditing"
                      />
                    </div>
                    <!-- Numéro de Pièce d'Identité -->
                    <div class="md:col-span-2">
                      <Input
                        :lb="idNumberLabel"
                        v-model="guestData.idNumber"
                        type="text"
                        :placeholder="idNumberLabel"
                        :disabled="!isEditing"
                      />
                    </div>
                    <div>
                      <InputDatePicker
                        :title="$t('ExpiryDate')"
                        v-model="guestData.idExpiryDate"
                        :placeholder="$t('select_date')"
                        :disabled="!isEditing"

                      />
                    </div>
                  </div>

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
            <div class="border-t dark:border-gray-700 pt-4">
              <button
                @click="toggleOtherInfoSection"
                class="flex items-center justify-between w-full text-left"
              >
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">{{ $t('OtherInformation') }}</h3>
                <ChevronDownIcon
                  :class="[
                    'w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform',
                    { 'rotate-180': showOtherInfoSection },
                  ]"
                />
              </button>
              <div v-show="showOtherInfoSection" class="mt-4 space-y-4">
               <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    {{ $t('Preference') }}
                  </label>
                  <MultipleSelect
                    v-model="guestData.preferences"
                    :options="Preferences"
                    :placeholder="$t('SelectPreferences')"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="isEditing" class="flex justify-end space-x-3 mt-6 pt-6 border-t dark:border-gray-700">
            <BasicButton variant="secondary" :label="$t('Cancel')" @click="cancelEdit" />
            <BasicButton
              variant="primary"
              :label="isCreatingNewGuest ? $t('Create Guest') : $t('Save Changes')"
              @click="saveGuest"
              :loading="isSaving"
            />
          </div>
        </div>
        <div class="px-4"></div>
           <!-- Footer summary -->
        <div class=" p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div class="flex justify-between items-center ">
            <div class="flex flex-row gap-4">
                   <BasicButton
                    :variant="props.reservation.guest?.blacklisted ? 'danger' : 'warning'"
                    :label="getBlacklistButtonLabel()"
                    @click="openBlackListModal()"

                  />

             <BasicButton
               variant="primary"
              :label="$t('printGuestCard')"
              @click="handlePrint()"
            />
            </div>
            <div>
            <BasicButton
               variant="primary"
              :label="$t('common.pickup/dropoff')"
              @click="handlePickupDropoff()"
            />
            </div>
          </div>
        </div>
      </div>

    </div>
      <!-- Pickup/Dropoff Modal -->
      <template v-if="showPickupModal">
        <PickupAndDropModal
          :isOpen="showPickupModal"
          :reservationId="reservationId"
          :guestId="guest.id"
          @close="showPickupModal = false"
        />
      </template>

        <div v-if="showPdfExporter || laodingPrint">
        <!-- Confirmation Template -->
        <PdfExporterNode v-if="pdfUrl || laodingPrint" @close="closePrint" :is-modal-open="showPdfExporter"
            :is-generating="laodingPrint" :pdf-url="pdfUrl" :title="documentTitle" />
        </div>

      <BlackListGuestModal
      :isOpen="showBlacklistModal"
      :isLoading="blacklisting"
      :guestData="props.reservation.guest"
      @close="closeBlacklistModal"
      @confirm="confirmBlacklistCustomer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
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
import { PlusCircle, ChevronRight}from 'lucide-vue-next'
import {ShieldCheck ,ShieldX  } from 'lucide-vue-next'
import UserCircleIcon from '@/icons/UserCircleIcon.vue'
import MultipleSelect from '../forms/FormElements/MultipleSelect.vue'
import { getPreferencesByHotelId ,getIdentityTypesByHotelId} from '@/services/configrationApi'
import PickupAndDropModal from '../customers/PickupAndDropModal.vue'
import { printConfirmBookingPdf, printHotelPdf } from '../../services/foglioApi'
import { printGuestReservationCard } from '../../services/reservation'
import PdfExporterNode from '../common/PdfExporterNode.vue'
import { toggleGuestBlacklist } from '@/services/guestApi'
import BlackListGuestModal from '../customers/BlackListGuestModal.vue'
import { vipStatusApi } from '@/services/configrationApi'
import { getCompanies } from '@/services/companyApi'
import ProfessionAutocomplete from '../forms/FormElements/ProfessionAutocomplete.vue'
import AutoCompleteSelect from '../forms/FormElements/AutoCompleteSelect.vue'

interface GuestData {
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
  address: string
  country: string
  stateProvince: string
  city: string
  postalCode: string
  nationality: string
  company: string
  fax: string
  registrationNo: string
  idPhoto: string | null
  idType: string
  idNumber: string
  dateOfBirth: string
  profession: string
  placeOfBirth: string
  idExpiryDate: string
  issuingCountry: string
  issuingCity: string
  preferences?: any;
  contactType?:string
  maidenName?:string
  contactTypeValue?:string
}

interface Props {
  guest?: any
  reservationId?: number
  readonly?: boolean
  reservation: any
}

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
const emit = defineEmits(['clear-error'])
const props = defineProps<Props>()
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const Preferences = ref<SelectOption[]>([])
const companyOptions = ref<Array<{ label: string; value: string }>>([])
const useDropdownBooking = ref(true)

// State
const isSaving = ref(false)
const isEditing = ref(false)
const resetKey = ref(0) // Clé pour forcer la réinitialisation des composants
const showPickupModal = ref(false)
// State pour les sections dépliantes
const showIdentitySection = ref(false)
const showOtherInfoSection = ref(false)
const loading = ref(false)
const vipStatusOptions = ref<any[]>([])
const idTypeOptions = ref<SelectOption[]>([])
const showPdfExporter = ref(false);
const TypesOfContact = computed(() => [
  { label: t('contactTypes.mobile'), value: 'Mobile' },
  { label: t('contactTypes.fix'), value: 'Fix' },
  { label: t('contactTypes.email'), value: 'Email' },
  { label: t('contactTypes.facebook'), value: 'Facebook' },
  { label: t('contactTypes.whatsapp'), value: 'Whatsapp' },
])


const selectedGuest = ref(
  props.guest || (props.reservation?.guests && props.reservation.guests[0]) || null,
)
const isCreatingNewGuest = ref(false)

// Refs pour les uploaders
const profilePhotoUploader = ref<InstanceType<typeof ImageUploader> | null>(null)
const idPhotoUploader = ref<InstanceType<typeof ImageUploader> | null>(null)

const parsePreferencesFromDB = (preferencesFromDB: any[] = []): { label: string; value: string }[] => {
  if (!Array.isArray(preferencesFromDB)) return []
  return preferencesFromDB.map(pref => ({
    label: pref.label || pref.name || pref.value || '',
    value: pref.value || pref.id || pref.label || ''
  })).filter(pref => pref.label && pref.value)
}

// Fonction pour convertir les préférences vers le format BD
const formatPreferencesForDB = (selectedPreferenceValues: string[] | undefined): string => {
  if (!selectedPreferenceValues || selectedPreferenceValues.length === 0) {

    return '[]'
  }
  return JSON.stringify(selectedPreferenceValues)
}

// Fonction d'initialisation mise à jour avec tous les nouveaux champs
const mapApiCustomerToFormData = (customer: any): GuestData => {
  const baseData: GuestData = {
    title: customer?.title || 'Mr',
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    profilePhoto: customer?.profilePhoto || null,
    phone: customer?.phone || customer?.phonePrimary || '',
    mobile: customer?.mobile || customer?.mobileNumber || '',
    email: customer?.email || '',
    gender: customer?.gender || 'male',
    guestType: customer?.guestType || '',
    vipStatusId: customer?.vipStatusId || '',
    address: customer?.addressLine || customer?.address || '',
    country: customer?.country || '',
    stateProvince: customer?.stateProvince || '',
    contactType :customer?.contactType || '',
    maidenName :customer?.maidenName || '',
    city: customer?.city || '',
    postalCode: customer?.postalCode || '',
    nationality: customer?.nationality || '',
    company: customer?.companyName || customer?.company || '',
    fax: customer?.fax || '',
    registrationNo: customer?.registrationNumber || customer?.registrationNo || '',
    idPhoto: customer?.idPhoto || null,
    idType: '',
    idNumber: '',
    dateOfBirth: customer?.dateOfBirth || '',
    profession: customer?.profession || '',
    placeOfBirth: customer?.placeOfBirth || '',
    idExpiryDate: '',
    issuingCountry: customer?.issuingCountry || '',
    issuingCity: customer?.issuingCity || '',
    contactTypeValue : customer?.contactTypeValue || '',
    preferences: parsePreferencesFromDB(customer?.preferences)
  }

  if (customer?.passportNumber) {
    baseData.idType = customer.idType
    baseData.idNumber = customer.passportNumber
    baseData.idExpiryDate = customer.passportExpiry
  } else if (customer?.visaNumber) {
    baseData.idType = customer.idType
    baseData.idNumber = customer.visaNumber
    baseData.idExpiryDate = customer.visaExpiry
  } else if (customer?.idNumber) {
    baseData.idType = customer.idType || 'ID National'
    baseData.idNumber = customer.idNumber
    baseData.idExpiryDate = customer.idExpiryDate
  }

  if (baseData.idExpiryDate && typeof baseData.idExpiryDate === 'string') {
    baseData.idExpiryDate = baseData.idExpiryDate.substring(0, 10)
  }

  return baseData
}

// Fonction d'initialisation mise à jour
const initializeGuestData = (guest: any = null): GuestData => {
  if (guest) {
    return mapApiCustomerToFormData(guest)
  }

  return {
    title: 'Mr',
    firstName: '',
    lastName: '',
    profilePhoto: null,
    phone: '',
    mobile: '',
    email: '',
    gender: 'male',
    guestType: '',
    vipStatusId: 0,
    address: '',
    country: '',
    stateProvince: '',
    city: '',
    postalCode: '',
    nationality: '',
    company: '',
    fax: '',
    registrationNo: '',
    idPhoto: null,
    idType: '',
    idNumber: '',
    dateOfBirth: '',
    profession: '',
    placeOfBirth: '',
    idExpiryDate: '',
    issuingCountry: '',
    issuingCity: '',
    contactType: '',
    maidenName: '',
    contactTypeValue: '',
    preferences: []
  }
}

const guestData = reactive<GuestData>(initializeGuestData(selectedGuest.value))

// Computed properties
const guestList = computed(() => props.reservation?.guests || [])
const fullName = computed(() => (guestData.firstName + ' ' + guestData.lastName + ' ' + guestData.maidenName).trim() || '')

// Watch for changes in selected guest
watch(
  selectedGuest,
  (newGuest) => {
    Object.assign(guestData, initializeGuestData(newGuest))
    resetKey.value++
  },
  { deep: true },
)

// Options pour les 'Select'
const titleOptions = computed(() => [
  { label: t('Mr'), value: 'Mr' },
  { label: t('Mrs'), value: 'Mrs' },
  { label: t('Miss'), value: 'Miss' },
  { label: t('Dr'), value: 'Dr' },
])
const genderOptions = computed(() => [
  { label: t('Male'), value: 'male' },
  { label: t('Female'), value: 'female' },
  { label: t('Other'), value: 'other' },
])
// Nouvelles options pour le type de client

const guestTypeOptions: SelectOption[] = [
  { value: 'travel_agent', label: t('GuestTypes.travel_agent') },
  { value: 'corporate', label: t('GuestTypes.corporate') },
  { value: 'individual', label: t('GuestTypes.individual') },
]



// --- Méthodes ---




const selectGuest = (guest: any) => {
  selectedGuest.value = guest
  isCreatingNewGuest.value = false
  Object.assign(guestData, initializeGuestData(guest))
  isEditing.value = false
  resetKey.value++
}

const createNewGuest = () => {
  console.log('Creating new guest')
  selectedGuest.value = null
  isCreatingNewGuest.value = true

  // Réinitialiser complètement les données
  Object.assign(guestData, initializeGuestData(null))

  // Forcer la réinitialisation des composants ImageUploader
  resetKey.value++

  // Passer en mode édition
  isEditing.value = true

  console.log('Guest data after reset:', guestData)
}

const toggleIdentitySection = () => {
  showIdentitySection.value = !showIdentitySection.value
}

// Nouvelle fonction pour la section "Autres informations"
const toggleOtherInfoSection = () => {
  showOtherInfoSection.value = !showOtherInfoSection.value
}

const contactInputComponent = computed(() => {
  if (!guestData.contactType) return null

  switch (guestData.contactType) {
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
  const type = guestData.contactType
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

watch(() => guestData.contactType, (newType, oldType) => {
  if (newType !== oldType) {
    guestData.contactTypeValue = ''
  }
})

// Créer un computed bidirectionnel
const contactValue = computed({
  get: () => guestData.contactTypeValue,
  set: (value) => {
    guestData.contactTypeValue = value
  }
})
const fetchVipStatuses = async () => {
  try {
    loading.value = true
    const response = await vipStatusApi.getVipStatuses(serviceStore.serviceId!);
    console.log("respinse",response)
    vipStatusOptions.value = response.data?.data.map((s:any)=>{
      return{
        label:s.name,
        value:s.id
      }
    }) || []
  } catch (error) {
    toast.error(t('vip_status.loadError'))
    console.error(error)
  } finally {
    loading.value = false
  }
}
const editGuest = () => {
  if (isEditing.value && isCreatingNewGuest.value) {

    cancelEdit()
  } else {
    isEditing.value = !isEditing.value
  }
}

// Fonctions pour gérer les uploads d'images
const onProfilePhotoSuccess = async (result: any) => {
  try {

    if (profilePhotoUploader.value?.hasSelectedFile()) {
      const uploadedUrl = await profilePhotoUploader.value.uploadToCloudinary()
      guestData.profilePhoto = uploadedUrl
    } else {
      guestData.profilePhoto = result.url || result.info?.secure_url || result
    }

  } catch (error) {
    console.error('Error handling profile photo:', error)
    toast.error(t('Profile photo upload failed'))
  }
}

const onIdPhotoSuccess = async (result: any) => {
  try {

    if (idPhotoUploader.value?.hasSelectedFile()) {
      const uploadedUrl = await idPhotoUploader.value.uploadToCloudinary()
      guestData.idPhoto = uploadedUrl
    } else {
      guestData.idPhoto = result.url || result.info?.secure_url || result
    }

  } catch (error) {
    console.error('Error handling ID photo:', error)
    toast.error(t('ID photo upload failed'))
  }
}

const onUploadError = (error: any) => {
  console.error('Upload error:', error)
  toast.error(t('Image upload failed'))
}


const handlePickupDropoff = () => {
  showPickupModal.value = true
}

// Fonction de préparation de la charge utile (payload) mise à jour
const prepareGuestPayload = (): GuestPayload => {
  const payload: GuestPayload = {
    hotelId: serviceStore.serviceId!,
    title: guestData.title,
    firstName: guestData.firstName,
    lastName: guestData.lastName,
    profilePhoto: guestData.profilePhoto?? undefined,
    phonePrimary: guestData.phone,
    mobileNumber: guestData.mobile,
    email: guestData.email,
    gender: guestData.gender,
    guestType: guestData.guestType,
    vipStatusId: guestData.vipStatusId,
    addressLine: guestData.address,
    country: guestData.country,
    stateProvince: guestData.stateProvince,
    city: guestData.city,
    postalCode: guestData.postalCode,
    nationality: guestData.nationality,
    companyName: guestData.company,
    fax: guestData.fax,
    registrationNumber: guestData.registrationNo,
    idPhoto: guestData.idPhoto ?? undefined,
    idType: guestData.idType,
    idNumber: guestData.idNumber,
    dateOfBirth: guestData.dateOfBirth,
    profession: guestData.profession,
    placeOfBirth: guestData.placeOfBirth,
    idExpiryDate: guestData.idExpiryDate,
    issuingCountry: guestData.issuingCountry,
    issuingCity: guestData.issuingCity,
    contactType : guestData.contactType,
    contactTypeValue : guestData.contactTypeValue,
    maidenName : guestData.maidenName,
    preferences: formatPreferencesForDB(guestData.preferences)
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
    // Upload des images si nécessaire
    if (profilePhotoUploader.value?.hasSelectedFile()) {
      guestData.profilePhoto = await profilePhotoUploader.value.uploadToCloudinary()
    }

    if (idPhotoUploader.value?.hasSelectedFile()) {
      guestData.idPhoto = await idPhotoUploader.value.uploadToCloudinary()
    }

    const payload = prepareGuestPayload()

    if (isCreatingNewGuest.value) {
      const response = await createGuest(payload)
      toast.success(t('Guest created successfully'))

      // Mettre à jour la liste des invités si possible
      if (response.data && props.reservation) {
        // Ajouter le nouvel invité à la liste
        props.reservation.guests = props.reservation.guests || []
        props.reservation.guests.push(response.data)

        // Sélectionner le nouvel invité
        selectedGuest.value = response.data
        Object.assign(guestData, initializeGuestData(response.data))
      }

      isCreatingNewGuest.value = false
    } else {
      const guestId = selectedGuest.value?.id
      if (!guestId) throw new Error('Guest ID is required for update')
      await updateGuest(guestId, payload)
      toast.success(t('Guest updated successfully'))

      // Mettre à jour les données de l'invité sélectionné
      if (selectedGuest.value) {
        Object.assign(selectedGuest.value, guestData)
      }
    }

    isEditing.value = false
    resetKey.value++

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
    } else {
      selectedGuest.value = null
      Object.assign(guestData, initializeGuestData(null))
    }
  } else {
    Object.assign(guestData, initializeGuestData(selectedGuest.value))
  }
  resetKey.value++
}

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

const selectedIdTypeInfo = computed(() => {
  return idTypeOptions.value.find((opt) => opt.value === guestData.idType)
})

const idNumberLabel = computed(() => {
  // Retourne le label personnalisé, ou un label par défaut
  return selectedIdTypeInfo.value?.label_fr || t('identity.id_number')
})

const laodingPrint = ref(false);
const pdfUrl = ref<any>(null);
const documentTitle = ref<string>('')
const showBlacklistModal = ref(false)
const blacklisting = ref(false)
const customerToBlacklist = ref<any>(null)

const handlePrint = async () => {
    try {
        laodingPrint.value = true

        // Show PDF exporter
        showPdfExporter.value = true

        // Generate PDF based on template type
        let pdfBlob: Blob
            pdfBlob = await printGuestReservationCard({
                reservationId: props.reservation?.id,
                guestId:props.reservation?.guestId
            })
            console.log('PDF Blob for confirmation:', pdfBlob)
            // Libérer l'ancienne URL si elle existe
            if (pdfUrl.value) {
                window.URL.revokeObjectURL(pdfUrl.value)
            }
            pdfUrl.value = window.URL.createObjectURL(pdfBlob)

    } catch (error) {

        showPdfExporter.value = false
    } finally {
        laodingPrint.value = false
    }
}



const closePrint = () => {
    showPdfExporter.value = false;
    pdfUrl.value = null
}

const openBlackListModal = () => {
    console.log('Blacklisting guest:', props.reservation)
   showBlacklistModal.value = true
}

const closeBlacklistModal = () => {
  showBlacklistModal.value = false
  customerToBlacklist.value = null
}



// Fonction pour obtenir le label du bouton blacklist
const getBlacklistButtonLabel = (): string => {
  if (props.reservation.guest?.blacklisted) {
    return t('actionsBlackList.removeFromBlacklist')
  } else {
    return t('actionsBlackList.addToBlacklist')
  }
}

// Améliorez aussi la fonction de confirmation du blacklist
const confirmBlacklistCustomer = async (data: { reason?: string; blacklisted: boolean }) => {
  if (!props.reservation?.guestId) return
  try {
    blacklisting.value = true
    const payload = data.reason || (data.blacklisted ? 'Raison non spécifiée' : 'Retiré de la liste noire')

    await toggleGuestBlacklist(props.reservation?.guestId, payload)

    const successMessage = data.blacklisted
      ? t('toast.guestBlacklistedSuccess', { name: props.reservation.guest.fullName })
      : t('toast.guestUnblacklistedSuccess', { name: props.reservation.guest.fullName })

    toast.success(successMessage)

    // Mettre à jour le statut blacklist localement pour refléter le changement immédiatement
    if (props.reservation.guest) {
      props.reservation.guest.blacklisted = data.blacklisted

      // Mettre à jour les notes si nécessaire
      if (data.blacklisted && data.reason) {
        const timestamp = new Date().toISOString()
        const blacklistNote = `\n[${timestamp}] Blacklisted: ${data.reason}`
        props.reservation.guest.notes = (props.reservation.guest.notes || '') + blacklistNote
      }
    }

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

const getCompaniesList = async () => {
  try {
    const resp: any = await getCompanies()
    console.log('Companies response:', resp)
    companyOptions.value = resp.data.map((c: any) => ({
      label: c.companyName,
      value: c.companyName
    }))
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
}


onMounted(() => {
  loadPreferences()
  fetchIdentityTypes()
  fetchVipStatuses()
  getCompaniesList()

})
</script>
<style scoped>
/* Scrollbar invisible mais toujours scrollable */
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
}
.custom-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
</style>
