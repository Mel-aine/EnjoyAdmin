<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Print and Email Settings</h1>
          <p class="text-gray-600 mt-1">
            Configure print and email settings for Front Desk operations. Set templates and preferences for various documents and communications.
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" :label="t('save')" @click="savePrintEmailSettings" :loading="isLoading" />
      </div>
      
      <div class="space-y-6">
        <!-- Print Options -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Print Options</h2>
            
            <!-- City Ledger Posting Option -->
            <div class="mb-6">
              <div class="flex items-center">
                <input
                  id="printCityLedger"
                  v-model="printSettings.printCityLedgerOnInvoice"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="printCityLedger" class="ml-2 block text-sm text-gray-900">
                  Print City Ledger Posting on Invoice
                </label>
              </div>
            </div>
            
            <!-- Print Templates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="template in printTemplates" :key="template.key" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  {{ template.name }}
                </label>
                <Select
                  v-model="template.selectedTemplate"
                  :options="availableTemplates"
                  :placeholder="`Select ${template.name.toLowerCase()}`"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Email Options -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Email Options</h2>
            
            <!-- Email Templates -->
            <div class="space-y-6">
              <div v-for="emailOption in emailOptions" :key="emailOption.key" class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="text-md font-medium text-gray-900">{{ emailOption.name }}</h4>
                    <p class="text-sm text-gray-600">{{ emailOption.description }}</p>
                  </div>
                  <div class="flex items-center">
                    <input
                      :id="emailOption.key"
                      v-model="emailOption.enabled"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    >
                    <label :for="emailOption.key" class="ml-2 block text-sm text-gray-900">
                      Enable
                    </label>
                  </div>
                </div>
                
                <div v-if="emailOption.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email Template
                    </label>
                    <Select
                      v-model="emailOption.template"
                      :options="availableEmailTemplates"
                      placeholder="Select email template"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line
                    </label>
                    <Input
                      v-model="emailOption.subject"
                      placeholder="Enter email subject"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Email Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Additional Email Settings</h2>
            
            <div class="space-y-6">
              <!-- Guest Review Settings -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 mb-4">Guest Review Email</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Send Review Email Link To
                    </label>
                    <Select
                      v-model="additionalSettings.reviewEmailTarget"
                      :options="reviewEmailTargetOptions"
                      placeholder="Select target audience"
                    />
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Review Email Template
                      </label>
                      <Select
                        v-model="additionalSettings.reviewEmailTemplate"
                        :options="availableEmailTemplates"
                        placeholder="Select review email template"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Delay (hours after checkout)
                      </label>
                      <Input
                        v-model="additionalSettings.reviewEmailDelay"
                        type="number"
                        placeholder="Enter delay in hours"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Reservation Voucher Settings -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 mb-4">Reservation Voucher Email</h4>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center">
                      <input
                        id="voucherToGuest"
                        v-model="additionalSettings.sendVoucherToGuest"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      >
                      <label for="voucherToGuest" class="ml-2 block text-sm text-gray-900">
                        Send to Guest
                      </label>
                    </div>
                    
                    <div class="flex items-center">
                      <input
                        id="voucherToCompany"
                        v-model="additionalSettings.sendVoucherToCompany"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      >
                      <label for="voucherToCompany" class="ml-2 block text-sm text-gray-900">
                        Send to Company
                      </label>
                    </div>
                    
                    <div class="flex items-center">
                      <input
                        id="voucherToAgent"
                        v-model="additionalSettings.sendVoucherToTravelAgent"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      >
                      <label for="voucherToAgent" class="ml-2 block text-sm text-gray-900">
                        Send to Travel Agent
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Voucher Email Template
                    </label>
                    <Select
                      v-model="additionalSettings.voucherEmailTemplate"
                      :options="availableEmailTemplates"
                      placeholder="Select voucher email template"
                    />
                  </div>
                </div>
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
import Input from '../../../components/forms/FormElements/Input.vue'
import Select from '../../../components/forms/FormElements/Select.vue'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateHotelPrintEmailSettings } from '../../../services/hotelApi'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

const printSettings = ref({
  printCityLedgerOnInvoice: true
})

const printTemplates = ref([
  {
    key: 'folioTemplate',
    name: 'Folio Template',
    selectedTemplate: 'standard_folio'
  },
  {
    key: 'receiptTemplate',
    name: 'Receipt Template',
    selectedTemplate: 'standard_receipt'
  },
  {
    key: 'voucherTemplate',
    name: 'Voucher Template',
    selectedTemplate: 'standard_voucher'
  },
  {
    key: 'registrationTemplate',
    name: 'Guest Registration Card Template',
    selectedTemplate: 'standard_registration'
  }
])

const emailOptions = ref([
  {
    key: 'emailThanksCheckout',
    name: 'Email Thanks at Check Out',
    description: 'Send thank you email to guests upon checkout',
    enabled: true,
    template: 'checkout_thanks',
    subject: 'Thank you for staying with us!'
  },
  {
    key: 'emailGuestReview',
    name: 'Email Guest Review Request',
    description: 'Send review request email to guests after their stay',
    enabled: true,
    template: 'review_request',
    subject: 'How was your stay? Please share your feedback'
  },
  {
    key: 'emailReservationReleased',
    name: 'Email for Reservation Released',
    description: 'Send notification when reservation is released',
    enabled: false,
    template: 'reservation_released',
    subject: 'Your reservation has been released'
  }
])

const additionalSettings = ref({
  reviewEmailTarget: 'all',
  reviewEmailTemplate: 'review_request',
  reviewEmailDelay: 24,
  sendVoucherToGuest: true,
  sendVoucherToCompany: false,
  sendVoucherToTravelAgent: false,
  voucherEmailTemplate: 'reservation_voucher'
})

const availableTemplates = [
  { label: 'Standard Template', value: 'standard' },
  { label: 'Modern Template', value: 'modern' },
  { label: 'Classic Template', value: 'classic' },
  { label: 'Minimal Template', value: 'minimal' },
  { label: 'Luxury Template', value: 'luxury' }
]

const availableEmailTemplates = [
  { label: 'Standard Email Template', value: 'standard_email' },
  { label: 'Welcome Email Template', value: 'welcome_email' },
  { label: 'Thank You Email Template', value: 'thankyou_email' },
  { label: 'Review Request Template', value: 'review_request' },
  { label: 'Reservation Confirmation Template', value: 'reservation_confirmation' },
  { label: 'Reservation Voucher Template', value: 'reservation_voucher' },
  { label: 'Checkout Thanks Template', value: 'checkout_thanks' },
  { label: 'Reservation Released Template', value: 'reservation_released' }
]

const reviewEmailTargetOptions = [
  { label: 'Web Booker Only', value: 'web_booker' },
  { label: 'All Guests', value: 'all' }
]

// Load print email settings from current service
const loadPrintEmailSettingsFromService = () => {
  if (currentService.value && currentService.value.printEmailSettings) {
    const servicePrintEmailSettings = currentService.value.printEmailSettings
    
    if (servicePrintEmailSettings.printSettings) {
      printSettings.value = { ...printSettings.value, ...servicePrintEmailSettings.printSettings }
    }
    if (servicePrintEmailSettings.printTemplates) {
      printTemplates.value = servicePrintEmailSettings.printTemplates
    }
    if (servicePrintEmailSettings.emailOptions) {
      emailOptions.value = servicePrintEmailSettings.emailOptions
    }
    if (servicePrintEmailSettings.additionalSettings) {
      additionalSettings.value = { ...additionalSettings.value, ...servicePrintEmailSettings.additionalSettings }
    }
  }
}

const savePrintEmailSettings = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.printEmailSettingsUpdateError'))
    return
  }

  isLoading.value = true
  
  try {
    const settings = {
      printSettings: printSettings.value,
      printTemplates: printTemplates.value,
      emailOptions: emailOptions.value,
      additionalSettings: additionalSettings.value
    }
    
    // Call API to update print email settings
    await updateHotelPrintEmailSettings(currentService.value.id, { printEmailSettings: settings })
    
    // Update the service store with new print email settings
    const updatedService = {
      ...currentService.value,
      printEmailSettings: settings
    }
    serviceStore.setCurrentService(updatedService)
    
    // Show success toast
    toast.success(t('toast.printEmailSettingsUpdated'))
  } catch (error) {
    console.error('Error saving print email settings:', error)
    toast.error(t('toast.printEmailSettingsUpdateError'))
  } finally {
    isLoading.value = false
  }
}

// Load print email settings when component mounts
onMounted(() => {
  loadPrintEmailSettingsFromService()
})
</script>
