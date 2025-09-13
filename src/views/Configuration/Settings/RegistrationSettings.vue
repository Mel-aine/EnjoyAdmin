<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Registration Settings</h1>
          <p class="text-gray-600 mt-1">
            Configure guest registration requirements and mandatory fields.
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" label="Save Changes" @click="saveRegistrationSettings" :loading="isLoading" />
      </div>
      
      <div class="space-y-6">
        <!-- Guest Registration Requirements -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Guest Registration Requirements</h2>
            
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  id="requireIdProof"
                  v-model="registrationSettings.requireIdProof"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="requireIdProof" class="ml-2 block text-sm text-gray-900">
                  Require ID Proof for Registration
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="requireSignature"
                  v-model="registrationSettings.requireSignature"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="requireSignature" class="ml-2 block text-sm text-gray-900">
                  Require Guest Signature
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="requireAddress"
                  v-model="registrationSettings.requireAddress"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="requireAddress" class="ml-2 block text-sm text-gray-900">
                  Require Complete Address
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="requireEmergencyContact"
                  v-model="registrationSettings.requireEmergencyContact"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="requireEmergencyContact" class="ml-2 block text-sm text-gray-900">
                  Require Emergency Contact
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mandatory Fields -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Mandatory Fields</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center">
                <input
                  id="mandatoryPhone"
                  v-model="mandatoryFields.phone"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="mandatoryPhone" class="ml-2 block text-sm text-gray-900">
                  Phone Number
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="mandatoryEmail"
                  v-model="mandatoryFields.email"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="mandatoryEmail" class="ml-2 block text-sm text-gray-900">
                  Email Address
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="mandatoryNationality"
                  v-model="mandatoryFields.nationality"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="mandatoryNationality" class="ml-2 block text-sm text-gray-900">
                  Nationality
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="mandatoryDateOfBirth"
                  v-model="mandatoryFields.dateOfBirth"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="mandatoryDateOfBirth" class="ml-2 block text-sm text-gray-900">
                  Date of Birth
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="mandatoryGender"
                  v-model="mandatoryFields.gender"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="mandatoryGender" class="ml-2 block text-sm text-gray-900">
                  Gender
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="mandatoryOccupation"
                  v-model="mandatoryFields.occupation"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="mandatoryOccupation" class="ml-2 block text-sm text-gray-900">
                  Occupation
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Registration Card Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Registration Card Settings</h2>
            
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  id="printRegistrationCard"
                  v-model="cardSettings.printRegistrationCard"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="printRegistrationCard" class="ml-2 block text-sm text-gray-900">
                  Auto Print Registration Card on Check-in
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="includePhoto"
                  v-model="cardSettings.includePhoto"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="includePhoto" class="ml-2 block text-sm text-gray-900">
                  Include Guest Photo on Registration Card
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="includeSignature"
                  v-model="cardSettings.includeSignature"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="includeSignature" class="ml-2 block text-sm text-gray-900">
                  Include Signature Space on Registration Card
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateHotelRegistrationSettings } from '../../../services/hotelApi'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

const registrationSettings = ref({
  requireIdProof: true,
  requireSignature: true,
  requireAddress: true,
  requireEmergencyContact: false
})

const mandatoryFields = ref({
  phone: true,
  email: true,
  nationality: false,
  dateOfBirth: false,
  gender: false,
  occupation: false
})

const cardSettings = ref({
  printRegistrationCard: true,
  includePhoto: false,
  includeSignature: true
})

// Load registration settings from current service
const loadRegistrationSettingsFromService = () => {
  if (currentService.value && currentService.value.registrationSettings) {
    const serviceRegistrationSettings = currentService.value.registrationSettings
    
    if (serviceRegistrationSettings.registrationSettings) {
      registrationSettings.value = { ...registrationSettings.value, ...serviceRegistrationSettings.registrationSettings }
    }
    if (serviceRegistrationSettings.mandatoryFields) {
      mandatoryFields.value = { ...mandatoryFields.value, ...serviceRegistrationSettings.mandatoryFields }
    }
    if (serviceRegistrationSettings.cardSettings) {
      cardSettings.value = { ...cardSettings.value, ...serviceRegistrationSettings.cardSettings }
    }
  }
}

const saveRegistrationSettings = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.registrationSettingsUpdateError'))
    return
  }

  isLoading.value = true
  
  try {
    const settings = {
      registrationSettings: registrationSettings.value,
      mandatoryFields: mandatoryFields.value,
      cardSettings: cardSettings.value
    }
    
    // Call API to update registration settings
    await updateHotelRegistrationSettings(currentService.value.id, { registrationSettings: settings })
    
    // Update the service store with new registration settings
    const updatedService = {
      ...currentService.value,
      registrationSettings: settings
    }
    serviceStore.setCurrentService(updatedService)
    
    // Show success toast
    toast.success(t('toast.registrationSettingsUpdated'))
  } catch (error) {
    console.error('Error saving registration settings:', error)
    toast.error(t('toast.registrationSettingsUpdateError'))
  } finally {
    isLoading.value = false
  }
}

// Load registration settings when component mounts
onMounted(() => {
  loadRegistrationSettingsFromService()
})
</script>
