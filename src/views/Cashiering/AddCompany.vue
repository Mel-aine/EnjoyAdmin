<template>
  <AdminLayout>
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ isEditMode ? $t('Edit Company') : $t('Add Company') }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
            <!-- Company Name -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input v-model="formData.companyName" :lb="$t('Company Name')" inputType="text" :isRequired="true"
                  :placeholder="$t('Enter company name')" id="companyName" />
              </div>
              <InputTitleName v-model="formData.contactPerson" :lb="$t('Contact Person')" inputType="text"
                :isRequired="true" :placeholder="$t('Enter contact person name')" id="contactPerson" class="z-99999" />
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
              <Input v-model="formData.companyCode" :lb="$t('shortCode')" inputType="text" :isRequired="false"
                :placeholder="$t('Enter short code')" id="companyCode" />
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
              <InputCurrency v-model="formData.openingBalance" :lb="$t('Openning Balance')" :currency="selectedCurrency"
                :placeholder="$t('opening balance')" id="openingBalance" @update:currency="handleCurrencyChange"
                :showCurrencySelector="true" />
              <InputCurrency v-model="formData.creditLimit" :lb="$t('Credit Limit')" :currency="selectedCurrency"
                :placeholder="$t('credit limit')" id="creditLimit" @update:currency="handleCurrencyChange"
                :showCurrencySelector="true" />

            </div>
          </div>
          <h2 class="text-lg font-bold text-gray-900 mb-3">Address</h2>
          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('Address') }}
            </label>
            <textarea v-model="formData.address" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-purple-500 focus:border-purple-500"
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
            <InputCheckBox :label="$t('Add to Business Source')" id="addToBusinessSource"
              v-model="formData.addToBusinessSource" />
            <InputCheckBox :label="$t('Do not count as city ledger')" id="doNotCountAsCityLedger"
              v-model="formData.doNotCountAsCityLedger" />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('Notes') }}
            </label>
            <textarea v-model="formData.notes" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-purple-500 focus:border-purple-500"
              :placeholder="$t('Enter notes about this company')"></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4">
            <BasicButton variant="secondary" :label="$t('Cancel')" @click="handleCancel" :disabled="loading" />
            <BasicButton variant="primary" :label="isEditMode ? $t('Update Company') : $t('Save Company')" type="submit"
              :loading="loading" />
          </div>
        </form>
      </div>
    </div>
    <OverLoading v-if="isLoading" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from 'vue-router'
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
import { createCompany, updateCompany, getCompanyById } from '@/services/companyApi'
import { useServiceStore } from '../../composables/serviceStore'
import { isLoading } from '../../composables/spinner'
import OverLoading from '../../components/spinner/OverLoading.vue'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const currencyStore = useCurrencyStore()
const serviceStore = useServiceStore()
const loading = ref(false)
const selectedCurrency = ref('XAF')

// Check if we're in edit mode by looking for an ID in the route params
const companyId = computed(() => route.params.id as string | undefined)
const isEditMode = computed(() => !!companyId.value)

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
  companyCode: '',
  openingBalance: 0,
  creditLimit: "",
  country: "",
  state: "",
  city: "",
  postalCode: "",
  addToBusinessSource: false,
  doNotCountAsCityLedger: false,
  status: 'Active' // Default status for new companies
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
    // Prepare company data for API
    const companyData = {
      company_name: formData.companyName,
      contact_person_name: `${formData.contactPerson.title} ${formData.contactPerson.firstName} ${formData.contactPerson.lastName}`.trim(),
      contact_person_title: formData.contactPerson.title,
      primary_email: formData.email,
      primary_phone: formData.phone,
      registration_number: formData.registrationNumber,
      tax_id: formData.taxId,
      current_balance: parseFloat(formData.openingBalance.toString()),
      credit_limit: formData.creditLimit ? parseFloat(formData.creditLimit.toString()) : 0,
      preferred_currency: formData.currency || selectedCurrency.value,
      billing_address_line: formData.address,
      billing_country: formData.country,
      billing_state_province: formData.state,
      billing_city: formData.city,
      billing_postal_code: formData.postalCode,
      company_code: formData.companyCode,
      notes: formData.notes,
      status: formData.status,
      add_to_business_source: formData.addToBusinessSource,
      do_not_count_as_city_ledger: formData.doNotCountAsCityLedger,
      account_type: "Corporate",
      account_status: 'Active',
      credit_status: 'Good',
      hotel_id: serviceStore.serviceId,
    }
    console.log("companyData",companyData)

    let result
    if (isEditMode.value) {
      // Update existing company
      result = await updateCompany(Number(companyId.value), companyData)
      if (result) {
        toast.success(t('Company updated successfully'))
        router.push({ name: 'CompanyDatabase' }) // Adjust route name as needed

      } else {
        toast.error(t('Error updating company'))
      }
    } else {
      // Create new company
      result = await createCompany(companyData)
      if (result) {
        toast.success(t('Company added successfully'))
        router.push({ name: 'CompanyDatabase' }) // Adjust route name as needed
      } else {
        toast.error(t('Error creating company'))
      }
    }

  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} company:`, error)
    toast.error(t(`Error ${isEditMode.value ? 'updating' : 'creating'} company`))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.go(-1)
}

// Load company data if in edit mode
const loadCompanyData = async () => {
  if (!isEditMode.value || !companyId.value) return

  try {
    isLoading.value = true
    const company: any = await getCompanyById(Number(companyId.value))
    console.log('Loaded company:', company)

    if (company) {
      // Map API data to form fields
      formData.companyName = company.companyName

      // Parse contact person name into components
      const contactParts = (company.contactPersonName || '').split(' ')
      if (contactParts.length >= 3) {
        formData.contactPerson.firstName = contactParts[1] || ''
        formData.contactPerson.lastName = contactParts.slice(2).join(' ') || ''
      } else {
        formData.contactPerson.firstName = company.contactPersonName || ''
      }
      formData.contactPerson.title = company.contactPersonTitle || ''
      formData.email = company.primaryEmail || ''
      formData.phone = company.primaryPhone || ''
      formData.registrationNumber = company.registrationNumber || ''
      formData.taxId = company.taxId || ''
      formData.openingBalance = company.currentBalance || 0
      formData.creditLimit = company.creditLimit?.toString() || ''
      formData.currency = company.currency || 'XAF'
      formData.selectedCurrency = company.preferredCurrency || 'XAF'
      selectedCurrency.value = company.preferredCurrency || 'XAF'
      formData.address = company.billingAddressLine || ''
      formData.country = company.billingCountry || ''
      formData.state = company.billingStateProvince || ''
      formData.city = company.billingCity || ''
      formData.postalCode = company.billingPostalCode || ''
      formData.companyCode = company.companyCode || ''
      formData.notes = company.notes || ''
      formData.status = 'Active'
      formData.addToBusinessSource = company.addToBusinessSource || false
      formData.doNotCountAsCityLedger = company.doNotCountAsCityLedger || false

      // Update currency in store
      if (company.currency) {
        currencyStore.setSelectedCurrency(company.currency)
      }
    } else {
      toast.error(t('Company not found'))
    }
  } catch (error) {
    console.error('Error loading company:', error)
    toast.error(t('Error loading company data'))
  } finally {
    isLoading.value = false
  }
}

// Initialize currency store and fetch currencies if needed
onMounted(async () => {
  try {
    isLoading.value = true
    currencyStore.init()
    await currencyStore.fetchCurrencies()
    selectedCurrency.value = currencyStore.getSelectedCurrency
    formData.currency = selectedCurrency.value

    // Load company data if in edit mode
    if (isEditMode.value) {
      await loadCompanyData()
    }
  } catch (error) {
    console.error('Error initializing:', error)
    toast.error(t('Error loading data'))
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
