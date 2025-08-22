<template>
  <AdminLayout>
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('Add Company') }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
            <!-- Company Name -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input v-model="formData.companyName" :lb="$t('Company Name')" inputType="text" :isRequired="true"
                  :placeholder="$t('Enter company name')" id="companyName" />
              </div>
              <InputTitleName v-model="formData.contactPerson" :lb="$t('Contact Person')" inputType="text"
                :isRequired="true" :placeholder="$t('Enter contact person name')" id="contactPerson" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Email -->
              <div>
                <InputEmail v-model="formData.email" :title="$t('Email')" :isRequired="true"
                  :placeholder="$t('Enter email address')" id="email" />
              </div>

              <!-- Phone -->
              <div>
                <InputPhone v-model="formData.phone" :title="$t('Phone')" inputType="tel" :isRequired="true"
                  :placeholder="$t('Enter phone number')" id="phone" />
              </div>
              <Input v-model="formData.shortCode" :lb="$t('shortCode')" inputType="text" :isRequired="false"
                :placeholder="$t('Enter short code')" id="shortCode" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900 mb-0">Account Details</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Registration Number -->
              <div>
                <Input v-model="formData.registrationNumber" :lb="$t('Registration Number')" 
                  :placeholder="$t('Enter registration number')" id="registrationNumber" />
              </div>

              <!-- Tax ID -->
              <div>
                <Input v-model="formData.taxId" :lb="$t('Tax ID')" inputType="text"
                  :placeholder="$t('Enter tax identification number')" id="taxId" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputCurrency v-model="formData.openingBalance" :lb="$t('Openning Balance')" 
                :currency="selectedCurrency" :placeholder="$t('opening balance')" id="openingBalance"
                @update:currency="handleCurrencyChange" :showCurrencySelector="true" />
              <InputCurrency v-model="formData.creditLimit" :lb="$t('Credit Limit')" 
                :currency="selectedCurrency" :placeholder="$t('credit limit')" id="creditLimit"
                @update:currency="handleCurrencyChange" :showCurrencySelector="true" />

            </div>
          </div>
          <h2 class="text-lg font-bold text-gray-900 mb-3">Address</h2>
          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('Address') }}
            </label>
            <textarea v-model="formData.address" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :placeholder="$t('Enter company address')"></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InputCountries v-model="formData.country" />

            <Input v-model="formData.state" :lb="$t('State')" inputType="text" :placeholder="$t('Enter state')"
              id="state" />
            <Input v-model="formData.city" :lb="$t('City')" inputType="text" :placeholder="$t('Enter city')"
              id="city" />
            <Input v-model="formData.postalCode" :lb="$t('Postal Code')" inputType="text"
              :placeholder="$t('Enter postal code')" id="postalCode" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InputCheckBox :label="$t('Add to Business Source')" id="addToBusinessSource" v-model="formData.addToBusinessSource" />
            <InputCheckBox :label="$t('Do not count as city ledger')" id="doNotCountAsCityLedger" v-model="formData.doNotCountAsCityLedger" />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4">
            <BasicButton variant="secondary" :label="$t('Cancel')" @click="handleCancel" :disabled="loading" />
            <BasicButton variant="primary" :label="$t('Save Company')" type="submit" :loading="loading" />
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
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
import InputTitleName from '../../components/forms/FormElements/InputTitleName.vue'
import InputEmail from '../../components/forms/FormElements/InputEmail.vue'
import InputPhone from '../../components/forms/FormElements/InputPhone.vue'
import InputCountries from '../../components/forms/FormElements/InputCountries.vue'
import InputCheckBox from '../../components/forms/FormElements/InputCheckBox.vue'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const currencyStore = useCurrencyStore()

const loading = ref(false)
const selectedCurrency = ref('XAF')

const formData = reactive({
  companyName: '',
  registrationNumber: "",
  contactPerson: {
    title: '',
    firstName: '',
    lastName: ''
  },
  email: '',
  phone: '',
  currency: '',
  selectedCurrency: 'XAF',
  taxId: '',
  address: '',
  notes: '',
  shortCode: '',
  openingBalance: 0,
  creditLimit: "",
  country: "",
  state: "",
  city: "",
  postalCode: "",
  addToBusinessSource: false,
  doNotCountAsCityLedger: false
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