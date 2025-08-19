<template>
  <div class="flex h-[calc(100vh-250px)] mx-4">
    <div class="w-2/12 border-r-2 border-s-1 border-gray-100 bg-gray-50">
      <div class="h-full flex flex-col justify-between">
        <div class="bg-white h-full">
          <div class="flex justify-between pt-2 px-2 pb-2">
            <span>Room/Guest</span>
            <PlusCircle class="text-primary cursor-pointer" @click="createNewGuest" />
          </div>

          <Accordion v-for="(fo, index) in reservation.reservationRooms" :key="index" :title="`${fo.room.roomNumber}`" class="mb-2">
            <div v-for="(guest, guestIndex) in guestList" :key="guestIndex">
              <div class="flex text-sm justify-between px-2 py-2 cursor-pointer hover:bg-gray-200 my-1"
                   :class="selectedGuest?.id === guest.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-100'"
                   @click="selectGuest(guest)">
                <span class="capitalize">{{ guest.displayName || guest.firstName + ' ' + guest.lastName }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </Accordion>
        </div>
        <div class="px-4">
        </div>
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
                  {{ isCreatingNewGuest ? $t('Create new guest information') : $t('Guest information and details') }}
                </p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button class="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                @click="editGuest">
                <svg v-if="!isEditing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{{ isEditing ? $t('Cancel') : $t('Edit') }}</span>
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                @click="uploadImage">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Guest Form -->
          <div class="space-y-6">
            <!-- Basic Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('Name') }}</label>
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

                  <!-- Display mode: Full name as read-only -->
                  <div v-if="!isEditing" class="flex-1">
                    <div class="h-11 w-full rounded-lg rounded-l-none border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white/90">
                      {{ fullName }}
                    </div>
                  </div>

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

              <!-- Phone -->
              <div>
                <InputPhone :title="$t('Phone')"  v-model="guestData.phone" :id="'phone'" :is-required="false" :disabled="!isEditing"/>
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

            <!-- Contact Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Email') }}</label>
                <Input v-model="guestData.email" type="email" :placeholder="$t('Email')" :disabled="!isEditing" />
              </div>

              <!-- Gender -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Gender') }}</label>
                <Select v-model="guestData.gender" :options="genderOptions" :placeholder="$t('Male')" :disabled="!isEditing" />
              </div>
            </div>

            <!-- Address Information -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Address') }}</label>
              <textarea v-model="guestData.address" rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none focus:outline-hidden focus:ring-3 focus:ring-purple-500/10 resize-none"
                :placeholder="$t('Address')" :disabled="!isEditing"></textarea>
            </div>

            <!-- Location Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('City') }}</label>
                <Input v-model="guestData.city" type="text" :placeholder="$t('City')" :disabled="!isEditing" />
              </div>

              <!-- Management -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Management') }}</label>
                <Input v-model="guestData.management" type="text" :placeholder="$t('Management')" :disabled="!isEditing" />
              </div>

              <!-- Country -->
              <div>
                <InputCountries v-model="guestData.country" :placeholder="$t('India')" :disabled="!isEditing" />
              </div>
            </div>

            <!-- Business Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Nationality -->
              <div>
                <InputCountries v-model="guestData.nationality" :placeholder="$t('India')" :lb="$t('Nationality')" :disabled="!isEditing" />
              </div>

              <!-- Company -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Company') }}</label>
                <Input v-model="guestData.company" type="text" :placeholder="$t('Company')" :disabled="!isEditing" />
              </div>

              <!-- Fax -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Fax') }}</label>
                <Input v-model="guestData.fax" type="text" :placeholder="$t('Fax')" :disabled="!isEditing" />
              </div>
            </div>

            <!-- Additional Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Registration No -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Registration No') }}</label>
                <Input v-model="guestData.registrationNo" type="text" :placeholder="$t('Registration No')" :disabled="!isEditing" />
              </div>

              <!-- VIP Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('VIP Status') }}</label>
                <Select v-model="guestData.vipStatus" :options="vipStatusOptions" :placeholder="$t('Select')" :disabled="!isEditing" />
              </div>
            </div>

            <!-- Identity Information Collapsible Section -->
            <div class="border-t pt-4">
              <button @click="toggleIdentitySection" class="flex items-center justify-between w-full text-left">
                <h3 class="text-sm font-medium text-gray-700">{{ $t('Identity Information') }}</h3>
                <ChevronDownIcon
                  :class="['w-4 h-4 text-gray-500 transition-transform', { 'rotate-180': showIdentitySection }]" />
              </button>

              <div v-show="showIdentitySection" class="mt-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- ID Type -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('ID Type') }}</label>
                    <Select v-model="guestData.idType" :options="idTypeOptions" :placeholder="$t('Select ID Type')" :disabled="!isEditing" />
                  </div>

                  <!-- ID Number -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('ID Number') }}</label>
                    <Input v-model="guestData.idNumber" type="text" :placeholder="$t('Enter ID Number')" :disabled="!isEditing" />
                  </div>
                </div>

                <!-- Date of Birth -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('Date of Birth') }}</label>
                    <InputDatePicker v-model="guestData.dateOfBirth" :placeholder="$t('Select Date')" :disabled="!isEditing" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="isEditing" class="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <BasicButton variant="secondary" :label="$t('Cancel')" @click="cancelEdit" />
            <BasicButton variant="primary" :label="$t('Save Changes')" @click="saveGuest" :loading="isSaving" />
          </div>
        </div>
        <div class="px-4">
          
        </div>
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
import UserCircleIcon from '@/icons/UserCircleIcon.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'
import Accordion from '../common/Accordion.vue'
import InputPhone from '../forms/FormElements/InputPhone.vue'
import { PlusCircle, ChevronRight } from 'lucide-vue-next'
import { createGuest, updateGuest, type GuestPayload } from '@/services/guestApi'
import { useServiceStore } from '@/composables/serviceStore'
import { useAuthStore } from '@/composables/user'

interface Props {
  guest?: any
  reservationId?: number
  readonly?: boolean
  reservation: any
}

interface GuestData {
  title: string
  name: string
  firstName: string
  lastName: string
  phone: string
  mobile: string
  email: string
  gender: string
  address: string
  city: string
  management: string
  country: string
  nationality: string
  company: string
  fax: string
  registrationNo: string
  vipStatus: string
  idType: string
  idNumber: string
  dateOfBirth: string
}

const props = defineProps<Props>()
const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const authStore = useAuthStore()

// State
const isSaving = ref(false)
const showIdentitySection = ref(false)
const isEditing = ref(false)
const selectedGuest = ref(props.guest || (props.reservation?.guests && props.reservation.guests[0]) || null)
const isCreatingNewGuest = ref(false)

// Guest data - initialize with selected guest or default values
const initializeGuestData = (guest: any = null) => ({
  title: guest?.title || 'Mr',
  name: guest?.name || '',
  firstName: guest?.firstName || '',
  lastName: guest?.lastName || '',
  phone: guest?.phone || '',
  mobile: guest?.mobile || '',
  email: guest?.email || '',
  gender: guest?.gender || 'Male',
  address: guest?.address || '',
  city: guest?.city || '',
  management: guest?.management || '',
  country: guest?.country || 'India',
  nationality: guest?.nationality || 'India',
  company: guest?.company || '',
  fax: guest?.fax || '',
  registrationNo: guest?.registrationNo || '',
  vipStatus: guest?.vipStatus || '',
  idType: guest?.idType || '',
  idNumber: guest?.idNumber || '',
  dateOfBirth: guest?.dateOfBirth || ''
})

const guestData = reactive<GuestData>(initializeGuestData(selectedGuest.value))

// Computed properties
const guestList = computed(() => {
  return props.reservation?.guests || []
})

const fullName = computed(() => {
  return (guestData.firstName + ' ' + guestData.lastName).trim() || guestData.name || ''
})

// Watch for changes in selected guest
watch(selectedGuest, (newGuest) => {
  Object.assign(guestData, initializeGuestData(newGuest))
}, { deep: true })

// Options
const titleOptions = computed(() => [
  { label: t('Mr'), value: 'Mr' },
  { label: t('Mrs'), value: 'Mrs' },
  { label: t('Ms'), value: 'Ms' },
  { label: t('Dr'), value: 'Dr' }
])

const genderOptions = computed(() => [
  { label: t('Male'), value: 'male' },
  { label: t('Female'), value: 'female' },
  { label: t('Other'), value: 'other' }
])

const vipStatusOptions = computed(() => [
  { label: t('Regular'), value: 'regular' },
  { label: t('VIP'), value: 'vip' },
  { label: t('VVIP'), value: 'vvip' },
  { label: t('Corporate'), value: 'corporate' }
])

const idTypeOptions = computed(() => [
  { label: t('Passport'), value: 'passport' },
  { label: t('National ID'), value: 'national_id' },
  { label: t('Driving License'), value: 'driving_license' },
  { label: t('Voter ID'), value: 'voter_id' },
  { label: t('Aadhaar'), value: 'aadhaar' }
])

// Methods
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

const editGuest = () => {
  isEditing.value = !isEditing.value
}

const uploadImage = () => {
  console.log('Upload image')
}



const prepareGuestPayload = (): GuestPayload => {
  const payload: GuestPayload = {
    title: guestData.title,
    firstName: guestData.firstName,
    lastName: guestData.lastName,
    phonePrimary: guestData.phone,
    hotelId:serviceStore.serviceId!,
    // mobile: guestData.mobile,
    email: guestData.email,
    gender: guestData.gender,
    address: guestData.address,
    city: guestData.city,
    // management: guestData.management,
    country: guestData.country,
    nationality: guestData.nationality,
    company: guestData.company,
    // fax: guestData.fax,
    // registrationNo: guestData.registrationNo,
    vipStatus: guestData.vipStatus,
    idType: guestData.idType,
    idNumber: guestData.idNumber,
    dateOfBirth: guestData.dateOfBirth,
    // reservationId: props.reservationId
  }

  // Remove empty/undefined values
  Object.keys(payload).forEach(key => {
    if (payload[key as keyof GuestPayload] === '' || payload[key as keyof GuestPayload] === undefined) {
      delete payload[key as keyof GuestPayload]
    }
  })

  return payload
}

const saveGuest = async () => {
  try {

    isSaving.value = true
    const payload = prepareGuestPayload()


    if (isCreatingNewGuest.value) {
     const response = await createGuest(payload)
     console.log('createGuest',response)
      toast.success(t('Guest created successfully'))
    } else {
      const guestId = selectedGuest.value?.id
      if (!guestId) {
        throw new Error('Guest ID is required for update')
      }
      console.log("payload",payload)
      console.log("guestId",guestId)
      const response = await updateGuest(guestId, payload)
      console.log('updateGuest',response)

      toast.success(t('Guest updated successfully'))

    }

    // Exit edit mode and creation mode
    isEditing.value = false
    isCreatingNewGuest.value = false

  } catch (error: any) {
    console.error('Error saving guest:', error)
    const errorMessage = isCreatingNewGuest.value
      ? t('Error creating guest: ') + (error.response?.data?.message || error.message)
      : t('Error updating guest: ') + (error.response?.data?.message || error.message)
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false

  if (isCreatingNewGuest.value) {
    isCreatingNewGuest.value = false
    const guestToSelect = props.guest || (guestList.value && guestList.value[0])
    if (guestToSelect) {
      selectGuest(guestToSelect)
    }
  } else {
    Object.assign(guestData, initializeGuestData(selectedGuest.value))
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
