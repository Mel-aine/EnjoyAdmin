<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('configuration.settings.print_and_email_settings.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            {{ $t('configuration.settings.print_and_email_settings.description') }}
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" :label="$t('configuration.settings.print_and_email_settings.save_changes')" @click="savePrintEmailSettings" :loading="isLoading" />
      </div>
      
      <div class="space-y-6">
        <!-- Print Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.print_and_email_settings.print_options') }}</h2>
            
            <!-- City Ledger Posting Option -->
            <div class="mb-6">
              <div class="flex items-center">
                <input
                  id="printCityLedger"
                  v-model="printSettings.printCityLedgerOnInvoice"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="printCityLedger" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {{ $t('configuration.settings.print_and_email_settings.print_city_ledger_on_invoice') }}
                </label>
              </div>
            </div>
            
            <!-- Print Templates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="template in printTemplates" :key="template.key" class="space-y-2">
                <Select
                  v-model="template.selectedTemplate"
                  :lb="$t(`configuration.settings.print_and_email_settings.${template.key}`)"
                  :options="availableTemplates"
                  :placeholder="$t('configuration.settings.print_and_email_settings.select_template')"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Email Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.print_and_email_settings.email_options') }}</h2>
            
            <!-- Email Templates -->
            <div class="space-y-6">
              <div v-for="emailOption in emailOptions" :key="emailOption.key" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="text-md font-medium text-gray-900 dark:text-gray-100">{{ $t(`configuration.settings.print_and_email_settings.${emailOption.key}.name`) }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ $t(`configuration.settings.print_and_email_settings.${emailOption.key}.description`) }}</p>
                  </div>
                  <div class="flex items-center">
                    <input
                      :id="emailOption.key"
                      v-model="emailOption.enabled"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                    >
                    <label :for="emailOption.key" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      {{ $t('configuration.settings.print_and_email_settings.enable') }}
                    </label>
                  </div>
                </div>
                
                <div v-if="emailOption.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      v-model="emailOption.template"
                      :lb="$t('configuration.settings.print_and_email_settings.email_template')"
                      :options="availableEmailTemplates"
                      :placeholder="$t('configuration.settings.print_and_email_settings.select_email_template')"
                    />
                  </div>
                  
                  <div>
                    <Input
                      v-model="emailOption.subject"
                      :lb="$t('configuration.settings.print_and_email_settings.subject_line')"
                      :placeholder="$t('configuration.settings.print_and_email_settings.enter_email_subject')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Email Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('configuration.settings.print_and_email_settings.additional_email_settings') }}</h2>
            
            <div class="space-y-6">
              <!-- Guest Review Settings -->
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.print_and_email_settings.guest_review_email') }}</h4>
                <div class="space-y-4">
                  <div>
                    <Select
                      v-model="additionalSettings.reviewEmailTarget"
                      :lb="$t('configuration.settings.print_and_email_settings.send_review_email_link_to')"
                      :options="reviewEmailTargetOptions"
                      :placeholder="$t('configuration.settings.print_and_email_settings.select_target_audience')"
                    />
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select
                        v-model="additionalSettings.reviewEmailTemplate"
                        :lb="$t('configuration.settings.print_and_email_settings.review_email_template')"
                        :options="availableEmailTemplates"
                        :placeholder="$t('configuration.settings.print_and_email_settings.select_review_email_template')"
                      />
                    </div>
                    
                    <div>
                      <Input
                        v-model="additionalSettings.reviewEmailDelay"
                        type="number"
                        :lb="$t('configuration.settings.print_and_email_settings.delay_hours_after_checkout')"
                        :placeholder="$t('configuration.settings.print_and_email_settings.enter_delay_in_hours')"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Reservation Voucher Settings -->
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('configuration.settings.print_and_email_settings.reservation_voucher_email') }}</h4>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center">
                      <input
                        id="voucherToGuest"
                        v-model="additionalSettings.sendVoucherToGuest"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                      >
                      <label for="voucherToGuest" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        {{ $t('configuration.settings.print_and_email_settings.send_to_guest') }}
                      </label>
                    </div>
                    
                    <div class="flex items-center">
                      <input
                        id="voucherToCompany"
                        v-model="additionalSettings.sendVoucherToCompany"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                      >
                      <label for="voucherToCompany" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        {{ $t('configuration.settings.print_and_email_settings.send_to_company') }}
                      </label>
                    </div>
                    
                    <div class="flex items-center">
                      <input
                        id="voucherToAgent"
                        v-model="additionalSettings.sendVoucherToTravelAgent"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                      >
                      <label for="voucherToAgent" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        {{ $t('configuration.settings.print_and_email_settings.send_to_travel_agent') }}
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <Select
                      v-model="additionalSettings.voucherEmailTemplate"
                      :lb="$t('configuration.settings.print_and_email_settings.voucher_email_template')"
                      :options="availableEmailTemplates"
                      :placeholder="$t('configuration.settings.print_and_email_settings.select_voucher_email_template')"
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
    selectedTemplate: 'standard_folio'
  },
  {
    key: 'receiptTemplate',
    selectedTemplate: 'standard_receipt'
  },
  {
    key: 'voucherTemplate',
    selectedTemplate: 'standard_voucher'
  },
  {
    key: 'registrationTemplate',
    selectedTemplate: 'standard_registration'
  }
])

const emailOptions = ref([
  {
    key: 'emailThanksCheckout',
    enabled: true,
    template: 'checkout_thanks',
    subject: ''
  },
  {
    key: 'emailGuestReview',
    enabled: true,
    template: 'review_request',
    subject: ''
  },
  {
    key: 'emailReservationReleased',
    enabled: false,
    template: 'reservation_released',
    subject: ''
  }
])

// Initialize default subjects if empty
const initializeDefaultSubjects = () => {
  emailOptions.value.forEach(option => {
    if (!option.subject) {
      option.subject = t(`configuration.settings.print_and_email_settings.${option.key}.default_subject`)
    }
  })
}

const additionalSettings = ref({
  reviewEmailTarget: 'all',
  reviewEmailTemplate: 'review_request',
  reviewEmailDelay: 24,
  sendVoucherToGuest: true,
  sendVoucherToCompany: false,
  sendVoucherToTravelAgent: false,
  voucherEmailTemplate: 'reservation_voucher'
})

const availableTemplates = computed(() => [
  { label: t('configuration.settings.print_and_email_settings.standard_template'), value: 'standard' },
  { label: t('configuration.settings.print_and_email_settings.modern_template'), value: 'modern' },
  { label: t('configuration.settings.print_and_email_settings.classic_template'), value: 'classic' },
  { label: t('configuration.settings.print_and_email_settings.minimal_template'), value: 'minimal' },
  { label: t('configuration.settings.print_and_email_settings.luxury_template'), value: 'luxury' }
])

const availableEmailTemplates = computed(() => [
  { label: t('configuration.settings.print_and_email_settings.standard_email_template'), value: 'standard_email' },
  { label: t('configuration.settings.print_and_email_settings.welcome_email_template'), value: 'welcome_email' },
  { label: t('configuration.settings.print_and_email_settings.thank_you_email_template'), value: 'thankyou_email' },
  { label: t('configuration.settings.print_and_email_settings.review_request_template'), value: 'review_request' },
  { label: t('configuration.settings.print_and_email_settings.reservation_confirmation_template'), value: 'reservation_confirmation' },
  { label: t('configuration.settings.print_and_email_settings.reservation_voucher_template'), value: 'reservation_voucher' },
  { label: t('configuration.settings.print_and_email_settings.checkout_thanks_template'), value: 'checkout_thanks' },
  { label: t('configuration.settings.print_and_email_settings.reservation_released_template'), value: 'reservation_released' }
])

const reviewEmailTargetOptions = computed(() => [
  { label: t('configuration.settings.print_and_email_settings.web_booker_only'), value: 'web_booker' },
  { label: t('configuration.settings.print_and_email_settings.all_guests'), value: 'all' }
])

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
  // Initialize default subjects if empty (for both new and loaded settings)
  initializeDefaultSubjects()
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
