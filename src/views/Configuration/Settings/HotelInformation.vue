<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t('hotelInformation.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            {{ t('hotelInformation.subtitle') }}
          </p>
        </div>
        <BasicButton 
          variant="primary" 
          :icon="Save" 
          :label="isLoading ? t('Processing') + '...' : t('hotelInformation.saveChanges')" 
          @click="saveHotelInfo" 
          :disabled="isLoading"
        />
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
          <form @submit.prevent="saveHotelInfo" class="space-y-8">
            <!-- General Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t('hotelInformation.generalInformation') }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    v-model="hotelInfo.hotelName"
                    :lb="t('hotelInformation.fields.hotelName')"
                    :placeholder="t('hotelInformation.placeholders.hotelName')"
                    :is-required="true"
                  />
                </div>
                
                <div>
                  <InputEmail
                    v-model="hotelInfo.email"
                    :title="t('hotelInformation.fields.email')"
                    :placeholder="t('hotelInformation.placeholders.email')"
                  />
                </div>
                
                <div>
                  <InputPhone
                    v-model="hotelInfo.phoneNumber"
                    :placeholder="t('hotelInformation.placeholders.phone')"
                    :title="t('hotelInformation.fields.phone')"
                    :is-required="true"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="hotelInfo.fax"
                    :lb="t('hotelInformation.fields.fax')"
                    :placeholder="t('hotelInformation.placeholders.fax')"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="hotelInfo.website"
                    :lb="t('hotelInformation.fields.website')"
                    :placeholder="t('hotelInformation.placeholders.website')"
                  />
                </div>
                
                <div>
                  <InputCountries
                    v-model="hotelInfo.country"
                    :is-required="true"
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <Input
                  v-model="hotelInfo.address"
                  :lb="t('hotelInformation.fields.address1')"
                  :placeholder="t('hotelInformation.placeholders.address1')"
                  :is-required="true"
                />
              </div>
              
              <div class="mt-4">
                <Input
                  v-model="hotelInfo.address2"
                  :lb="t('hotelInformation.fields.address2')"
                  :placeholder="t('hotelInformation.placeholders.address2')"
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <Input
                    v-model="hotelInfo.city"
                    :lb="t('hotelInformation.fields.city')"
                    :placeholder="t('hotelInformation.placeholders.city')"
                    :is-required="true"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="hotelInfo.stateProvince"
                    :lb="t('hotelInformation.fields.stateProvince')"
                    :placeholder="t('hotelInformation.placeholders.stateProvince')"
                    :is-required="true"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="hotelInfo.postalCode"
                    :lb="t('hotelInformation.fields.zipPostalCode')"
                    :placeholder="t('hotelInformation.placeholders.zipPostalCode')"
                    :is-required="true"
                  />
                </div>
              </div>
            </div>
            
            <!-- Property Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t('hotelInformation.propertyInformation') }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Select
                    v-model="hotelInfo.propertyType"
                    :options="propertyTypeOptions"
                    :lb="t('hotelInformation.fields.propertyType')"
                    :placeholder="t('hotelInformation.placeholders.propertyType')"
                    :is-required="true"
                  />
                </div>
                
                <div>
                  <Select
                    v-model="hotelInfo.grade"
                    :options="gradeOptions"
                    :lb="t('hotelInformation.fields.gradeRating')"
                    :placeholder="t('hotelInformation.placeholders.gradeRating')"
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('hotelInformation.fields.hotelLogo') }}
                </label>
                <div class="flex items-center space-x-4">
                  <button
                    type="button"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                    @click="selectLogo"
                  >
                    {{ t('hotelInformation.buttons.chooseFile') }}
                  </button>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ hotelInfo.logoFileName || t('hotelInformation.messages.noFileSelected') }}
                  </span>
                  <button
                    v-if="hotelInfo.logoFileName"
                    type="button"
                    class="text-red-600 hover:text-red-800 text-sm"
                    @click="removeLogo"
                  >
                    {{ t('hotelInformation.buttons.remove') }}
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ t('hotelInformation.messages.logoUploadInfo') }}
                </p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <Input
                    v-model="hotelInfo.registrationNo1"
                    :lb="t('hotelInformation.fields.registrationNo1')"
                    :placeholder="t('hotelInformation.placeholders.registrationNo1')"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="hotelInfo.registrationNo2"
                    :lb="t('hotelInformation.fields.registrationNo2')"
                    :placeholder="t('hotelInformation.placeholders.registrationNo2')"
                  />
                </div>
                
                <div>
                  <Input
                    v-model="hotelInfo.registrationNo3"
                    :lb="t('hotelInformation.fields.registrationNo3')"
                    :placeholder="t('hotelInformation.placeholders.registrationNo3')"
                  />
                </div>
              </div>
              
              <!-- Description Section -->
              <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">{{ t('hotelInformation.descriptionPolicies') }}</h3>
                
                <!-- Cancellation Policy -->
                 <div class="mb-6">
                   <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                     {{ t('hotelInformation.fields.cancellationPolicy') }}
                   </label>
                   <textarea
                     v-model="hotelInfo.cancellationPolicy"
                     rows="4"
                     :placeholder="t('hotelInformation.placeholders.cancellationPolicy')"
                     class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                   ></textarea>
                 </div>
                 
                 <!-- Hotel Policy -->
                 <div class="mb-6">
                   <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                     {{ t('hotelInformation.fields.hotelPolicy') }}
                   </label>
                   <textarea
                     v-model="hotelInfo.hotelPolicy"
                     rows="4"
                     :placeholder="t('hotelInformation.placeholders.hotelPolicy')"
                     class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                   ></textarea>
                 </div>
              </div>
              
        
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'
import InputEmail from '../../../components/forms/FormElements/InputEmail.vue'
import InputPhone from '../../../components/forms/FormElements/InputPhone.vue'
import InputCountries from '../../../components/forms/FormElements/InputCountries.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateHotelInformation } from '../../../services/hotelApi'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { uploadToCloudinary } from '../../../utils'

// Import Save icon (you may need to adjust the path based on your icon structure)
const Save = null // Replace with actual Save icon import

const serviceStore = useServiceStore()
const toast = useToast()
const { t } = useI18n({ useScope: 'global' })
const isLoading = ref(false)

const hotelInfo = ref({
  "hotelName": "",
  "email": "",
  "phoneNumber": "",
  "fax": "",
  "website": "",
  "country": "",
  "address": "",
  "address2": "",
  "city": "",
  "stateProvince": "",
  "postalCode": " ",
  "propertyType": " ",
  "grade": 0,
  "logoUrl": "",
  "registrationNo1": "",
  "registrationNo2": "",
  "registrationNo3": "",
  "cancellationPolicy": "",
  "hotelPolicy": "",
  logoFile: null
})


const propertyTypeOptions = [
  { label: t('hotelInformation.propertyTypes.hotelAndResort'), value: 'Hotel and Resort' },
  { label: t('hotelInformation.propertyTypes.hotel'), value: 'Hotel' },
  { label: t('hotelInformation.propertyTypes.resort'), value: 'Resort' },
  { label: t('hotelInformation.propertyTypes.motel'), value: 'Motel' },
  { label: t('hotelInformation.propertyTypes.inn'), value: 'Inn' },
  { label: t('hotelInformation.propertyTypes.lodge'), value: 'Lodge' },
  { label: t('hotelInformation.propertyTypes.boutiqueHotel'), value: 'Boutique Hotel' },
  { label: t('hotelInformation.propertyTypes.businessHotel'), value: 'Business Hotel' },
  { label: t('hotelInformation.propertyTypes.extendedStay'), value: 'Extended Stay' },
  { label: t('hotelInformation.propertyTypes.bedAndBreakfast'), value: 'Bed & Breakfast' }
]

const gradeOptions = [
  { label: t('hotelInformation.grades.fiveStarsAndAbove'), value: 5 },
  { label: t('hotelInformation.grades.fourStars'), value: 4 },
  { label: t('hotelInformation.grades.threeStars'), value: 3 },
  { label: t('hotelInformation.grades.twoStars'), value: 2 },
  { label: t('hotelInformation.grades.oneStar'), value: 1 },
  { label: t('hotelInformation.grades.unrated'), value: 0 }
]

const selectLogo = () => {
  // TODO: Implement file selection
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      hotelInfo.value.logoFile = file
    }
  }
  input.click()
}

const removeLogo = () => {
  hotelInfo.value.logoFile = null
}

// Load hotel information from current service on component mount
const loadHotelInfo = async () => {
  const currentService = JSON.parse(serviceStore.currentService)

  if (currentService) {
    // Map service data to hotel info structure
    hotelInfo.value = {
      hotelName: currentService.hotelName,
      email: currentService.email,
      phoneNumber: currentService.phoneNumber,
      fax: currentService.fax,
      website: currentService.website,
      country: currentService.country,
      address: currentService.address,
      address2: currentService.address2,
      city: currentService.city,
      stateProvince:   currentService.stateProvince,
      postalCode: currentService.postalCode,
      propertyType: currentService.propertyType,
      grade: currentService.grade,
      logoUrl:   currentService.logoUrl || '',
      registrationNo1:   currentService.registrationNo1 || '',
      registrationNo2:  currentService.registrationNo2 || '',
      registrationNo3:  currentService.registrationNo3 || '',
      cancellationPolicy: currentService.cancellationPolicy || '',
      hotelPolicy: currentService.hotelPolicy || '',
    }
  }
}

onMounted(() => {
  loadHotelInfo()
})

const saveHotelInfo = async () => {
  if (!serviceStore.serviceId) {
    toast.error(t('toast.error'))
    return
  }

  isLoading.value = true

  try {
    try{
      if(hotelInfo.value.logoFile){
        const logoUrl = await uploadToCloudinary(hotelInfo.value.logoFile)
        hotelInfo.value.logoUrl = logoUrl
      }
    }catch(error){
      console.error('Error uploading logo to Cloudinary:', error)
      toast.error(t('toast.logoUploadError'))
    }
    const response = await updateHotelInformation(serviceStore.serviceId, hotelInfo.value)
    
    if (response.status === 200) {
      // Update the current service in the store with the new hotel information
      const currentService = serviceStore.getCurrentService
      if (currentService) {
        const updatedService = {
          ...currentService,
          ...hotelInfo.value
        }
        serviceStore.setCurrentService(updatedService)
      }
      
      toast.success(t('toast.hotelInfoUpdated'))
    } else {
      toast.error(t('toast.hotelInfoUpdateError'))
    }
  } catch (error) {
    console.error('Error updating hotel information:', error)
    toast.error(t('toast.hotelInfoUpdateError'))
  } finally {
    isLoading.value = false
  }
}
</script>