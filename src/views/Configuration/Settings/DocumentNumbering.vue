<template>
  <ConfigurationLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Document Numbering</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            Manage the numbering of different documents generated in the hotel. Set prefixes and reset options for various document types.
          </p>
        </div>
        <BasicButton variant="primary" :icon="Save" label="Save Changes" @click="saveDocumentNumbering" :loading="isLoading" />
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
          <div class="space-y-8">
            <!-- Document Types Configuration -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Document Types</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div v-for="document in documentTypes" :key="document.key" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">{{ document.name }}</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prefix
                      </label>
                      <Input
                        v-model="document.prefix"
                        placeholder="Enter prefix"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Next Number
                      </label>
                      <Input
                        v-model="document.nextNumber"
                        type="number"
                        placeholder="Enter next number"
                      />
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reset Frequency
                    </label>
                    <Select
                      v-model="document.resetFrequency"
                      :options="resetFrequencyOptions"
                      placeholder="Select reset frequency"
                    />
                  </div>
                  
                  <div class="mt-4 p-3 bg-gray-50 dark:bg-black rounded-md">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ document.prefix }}{{ String(document.nextNumber).padStart(4, '0') }}</p>
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
import { updateHotelDocumentNumberingSetting } from '../../../services/hotelApi'
import { Save } from 'lucide-vue-next'

const { t } = useI18n()
const toast = useToast()
const serviceStore = useServiceStore()
const isLoading = ref(false)

// Get current service from store
const currentService = computed(() => serviceStore.getCurrentService)

const documentTypes = ref([
  {
    key: 'guestRegistration',
    name: 'Guest Registration',
    prefix: 'GR',
    nextNumber: 1001,
    resetFrequency: 'yearly'
  },
  {
    key: 'guestFolio',
    name: 'Guest Folio',
    prefix: 'GF',
    nextNumber: 2001,
    resetFrequency: 'monthly'
  },
  {
    key: 'reservation',
    name: 'Reservation',
    prefix: 'RES',
    nextNumber: 3001,
    resetFrequency: 'yearly'
  },
  {
    key: 'cancelReservation',
    name: 'Cancel Reservation',
    prefix: 'CR',
    nextNumber: 4001,
    resetFrequency: 'yearly'
  },
  {
    key: 'extraChargeVoucher',
    name: 'Extra Charge Voucher',
    prefix: 'ECV',
    nextNumber: 5001,
    resetFrequency: 'monthly'
  },
  {
    key: 'receipt',
    name: 'Receipt',
    prefix: 'RCP',
    nextNumber: 6001,
    resetFrequency: 'daily'
  },
  {
    key: 'guestInvoice',
    name: 'Guest Invoice',
    prefix: 'INV',
    nextNumber: 7001,
    resetFrequency: 'monthly'
  },
  {
    key: 'workOrder',
    name: 'Work Order',
    prefix: 'WO',
    nextNumber: 8001,
    resetFrequency: 'monthly'
  },
  {
    key: 'incidentalInvoice',
    name: 'Incidental Invoice',
    prefix: 'II',
    nextNumber: 9001,
    resetFrequency: 'monthly'
  }
])

const resetFrequencyOptions = [
  { label: 'Never', value: 'never' },
  { label: 'Daily', value: 'daily' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]


// Load document numbering from current service
const loadDocumentNumberingFromService = () => {
  if (currentService.value && currentService.value.documentNumberingSetting) {
    const serviceDocumentNumbering = currentService.value.documentNumberingSetting
    if (Array.isArray(serviceDocumentNumbering)) {
      documentTypes.value = serviceDocumentNumbering
    }
  }
}

const saveDocumentNumbering = async () => {
  if (!currentService.value || !currentService.value.id) {
    toast.error(t('toast.documentNumberingUpdateError'))
    return
  }

  isLoading.value = true
  
  try {
    // Call API to update document numbering setting
    await updateHotelDocumentNumberingSetting(currentService.value.id, { documentNumberingSetting: documentTypes.value })
    
    // Update the service store with new document numbering setting
    const updatedService = {
      ...currentService.value,
      documentNumberingSetting: documentTypes.value
    }
    serviceStore.setCurrentService(updatedService)
    
    // Show success toast
    toast.success(t('toast.documentNumberingUpdated'))
  } catch (error) {
    console.error('Error saving document numbering:', error)
    toast.error(t('toast.documentNumberingUpdateError'))
  } finally {
    isLoading.value = false
  }
}

// Load document numbering when component mounts
onMounted(() => {
  loadDocumentNumberingFromService()
})
</script>
