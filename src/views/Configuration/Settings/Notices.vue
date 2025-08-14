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
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('notices.fields.folio') }}
                </label>
                <textarea
                  v-model="notices.folio"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :placeholder="t('notices.placeholders.folio')"
                ></textarea>
              </div>
            
              
              <!-- Registration Card -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('notices.fields.registrationCard') }}
                </label>
                <textarea
                  v-model="notices.registrationCard"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :placeholder="t('notices.placeholders.registrationCard')"
                ></textarea>
              </div>
              
              <!-- T&C (Terms and Condition) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('notices.fields.termsAndConditions') }}
                </label>
                <textarea
                  v-model="notices.termsAndConditions"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :placeholder="t('notices.placeholders.termsAndConditions')"
                ></textarea>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Cancellation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('notices.fields.cancellation') }}
                </label>
                <textarea
                  v-model="notices.cancellation"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :placeholder="t('notices.placeholders.cancellation')"
                ></textarea>
              </div>
              
              <!-- Group Reservation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('notices.fields.groupProformatInvoice') }}
                </label>
                <textarea
                  v-model="notices.groupProformatInvoice"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :placeholder="t('notices.placeholders.groupProformatInvoice')"
                ></textarea>
              </div>
              
              <!-- Receipt -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('notices.fields.receipt') }}
                </label>
                <textarea
                  v-model="notices.receipt"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :placeholder="t('notices.placeholders.receipt')"
                ></textarea>
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
  if (currentService.value && currentService.value.notice) {
    const serviceNotices = currentService.value.notice
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
    await updateHotelNotices(currentService.value.id, notices.value)
    
    // Update the service store with new notices
    const updatedService = {
      ...currentService.value,
      notice: notices.value
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
