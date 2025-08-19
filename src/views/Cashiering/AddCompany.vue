<template>
  <AdminLayout>
  <div class="p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('Add Company') }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Company Name -->
          <div>
            <Input
              v-model="formData.companyName"
              :lb="$t('Company Name')"
              inputType="text"
              :isRequired="true"
              :placeholder="$t('Enter company name')"
              id="companyName"
            />
          </div>

          <!-- Contact Person -->
          <div>
            <Input
              v-model="formData.contactPerson"
              :lb="$t('Contact Person')"
              inputType="text"
              :isRequired="true"
              :placeholder="$t('Enter contact person name')"
              id="contactPerson"
            />
          </div>

          <!-- Email -->
          <div>
            <Input
              v-model="formData.email"
              :lb="$t('Email')"
              inputType="email"
              :isRequired="true"
              :placeholder="$t('Enter email address')"
              id="email"
            />
          </div>

          <!-- Phone -->
          <div>
            <Input
              v-model="formData.phone"
              :lb="$t('Phone')"
              inputType="tel"
              :isRequired="true"
              :placeholder="$t('Enter phone number')"
              id="phone"
            />
          </div>

          <!-- Currency -->
          <div>
            <InputCurrency
              v-model="formData.currency"
              :lb="$t('Currency')"
              :isRequired="true"
              :currency="selectedCurrency"
              :placeholder="$t('Select currency')"
              id="currency"
              @update:currency="handleCurrencyChange"
              :showCurrencySelector="true"
            />
          </div>

          <!-- Tax ID -->
          <div>
            <Input
              v-model="formData.taxId"
              :lb="$t('Tax ID')"
              inputType="text"
              :placeholder="$t('Enter tax identification number')"
              id="taxId"
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('Address') }}
          </label>
          <textarea
            v-model="formData.address"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="$t('Enter company address')"
          ></textarea>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('Notes') }}
          </label>
          <textarea
            v-model="formData.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="$t('Additional notes about the company')"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <BasicButton
            variant="secondary"
            :label="$t('Cancel')"
            @click="handleCancel"
            :disabled="loading"
          />
          <BasicButton
            variant="primary"
            :label="$t('Save Company')"
            type="submit"
            :loading="loading"
          />
        </div>
      </form>
    </div>
  </div></AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import Input from '@/components/forms/FormElements/Input.vue'
import InputCurrency from '@/components/forms/FormElements/InputCurrency.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import { useCurrencyStore } from '@/composables/currencyStore'
import AdminLayout from '../../components/layout/AdminLayout.vue'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const currencyStore = useCurrencyStore()

const loading = ref(false)
const selectedCurrency = ref('XAF')

const formData = reactive({
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  currency: '',
  selectedCurrency: 'XAF',
  taxId: '',
  address: '',
  notes: ''
})

const handleCurrencyChange = (currencyCode: string) => {
  selectedCurrency.value = currencyCode
  formData.currency = currencyCode
  formData.selectedCurrency = currencyCode
  currencyStore.setSelectedCurrency(currencyCode)
  console.log('Currency changed to:', currencyCode)
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // TODO: Implement API call to save company
    console.log('Company data to save:', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success(t('Company added successfully'))
    router.push({ name: 'Companies' }) // Adjust route name as needed
  } catch (error) {
    console.error('Error saving company:', error)
    toast.error(t('Error saving company'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.go(-1)
}

// Initialize currency store and fetch currencies if needed
onMounted(async () => {
  try {
    currencyStore.init()
    await currencyStore.fetchCurrencies()
    selectedCurrency.value = currencyStore.getSelectedCurrency
    formData.currency = selectedCurrency.value
  } catch (error) {
    console.error('Error initializing currencies:', error)
    toast.error(t('Error loading currencies'))
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>