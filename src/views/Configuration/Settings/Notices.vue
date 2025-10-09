<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('notices.title') }}</h1>
          <p class="text-gray-600 mt-1">
            {{ t('notices.subtitle') }}
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" :label="t('notices.saveChanges')" @click="saveNotices" :loading="isLoading" />
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-6">
           
              
              <!-- Folio -->
              <div>
                <InputTextArea
                  v-model="notices.folio"
                  :label="t('notices.fields.folio')"
                  :placeholder="t('notices.placeholders.folio')"
                  :rows="6"
                />
              </div>
            
              
              <!-- Registration Card -->
              <div>
                <InputTextArea
                  v-model="notices.registrationCard"
                  :label="t('notices.fields.registrationCard')"
                  :placeholder="t('notices.placeholders.registrationCard')"
                  :rows="6"
                />
              </div>
              
              <!-- T&C (Terms and Condition) -->
              <div>
                <InputTextArea
                  v-model="notices.termsAndConditions"
                  :label="t('notices.fields.termsAndConditions')"
                  :placeholder="t('notices.placeholders.termsAndConditions')"
                  :rows="6"
                />
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Cancellation -->
              <div>
                <InputTextArea
                  v-model="notices.cancellation"
                  :label="t('notices.fields.cancellation')"
                  :placeholder="t('notices.placeholders.cancellation')"
                  :rows="6"
                />
              </div>
              
              <!-- Group Reservation -->
              <div>
                <InputTextArea
                  v-model="notices.groupProformatInvoice"
                  :label="t('notices.fields.groupProformatInvoice')"
                  :placeholder="t('notices.placeholders.groupProformatInvoice')"
                  :rows="6"
                />
              </div>
              
              <!-- Receipt -->
              <div>
                <InputTextArea
                  v-model="notices.receipt"
                  :label="t('notices.fields.receipt')"
                  :placeholder="t('notices.placeholders.receipt')"
                  :rows="6"
                />
              </div>
              
              
            
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import BasicButton from '../../../components/buttons/BasicButton.vue'
import InputTextArea from '../../../components/forms/FormElements/InputTextArea.vue'
import { Save } from 'lucide-vue-next'
import { useServiceStore } from '../../../composables/serviceStore'
import { updateHotelNotices } from '../../../services/hotelApi'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

// Initialize notices from service store or with default values
const notices = ref({
  folio: '',
  registrationCard: '',
  termsAndConditions: '',
  cancellation: '',
  groupProformatInvoice: '',
  receipt: ''
})

// Load notices from current service
const loadNoticesFromService = () => {
  if (currentService.value && currentService.value.notices) {
    const serviceNotices = currentService.value.notices
    notices.value = {
      folio: serviceNotices.folio || '',
      registrationCard: serviceNotices.registrationCard || '',
      termsAndConditions: serviceNotices.termsAndConditions || '',
      cancellation: serviceNotices.cancellation || '',
      groupProformatInvoice: serviceNotices.groupProformatInvoice || '',
      receipt: serviceNotices.receipt || ''
    }
  }
}

const saveNotices = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.noticesUpdateError'))
    return
  }

  isLoading.value = true
  
  try {
    // Call API to update notices
    await updateHotelNotices(currentService.value.id, {notices:notices.value})
    
    // Update the service store with new notices
    const updatedService = {
      ...currentService.value,
      notices: notices.value
    }
    serviceStore.setCurrentService(updatedService)
    
    // Show success toast
    toast.success(t('toast.noticesUpdated'))
  } catch (error) {
    console.error('Error saving notices:', error)
    toast.error(t('toast.noticesUpdateError'))
  } finally {
    isLoading.value = false
  }
}

// Load notices when component mounts
onMounted(() => {
  loadNoticesFromService()
})
</script>
