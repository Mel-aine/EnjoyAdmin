<script setup lang="ts">
import { CalendarIcon, ArrowLeft, Save, User, Shield, FileText, Percent } from 'lucide-vue-next'
import { ref, defineAsyncComponent, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import Spinner from '@/components/spinner/Spinner.vue'
import { useServiceStore } from '@/composables/serviceStore'
// import { createUser, updateUser, getRole, getDepartment } from '@/services/api'
import { createUser ,getRoles ,getUserById ,updateUser} from '@/services/userApi'
import {  getDepartment } from '@/services/departmentApi'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/composables/user'
import { defaultData, type Form } from '@/utils/models'
import InputDatePicker from '@/components/forms/FormElements/InputDatePicker.vue'
import InputEmail from '@/components/forms/FormElements/InputEmail.vue'
import InputPhone from '@/components/forms/FormElements/InputPhone.vue'
import InputCountries from '@/components/forms/FormElements/InputCountries.vue'
import ConfigurationLayout from '../ConfigurationLayout.vue'
import { getConfiguration } from '@/services/configrationApi'
import { ChevronDown } from 'lucide-vue-next'
import OverLoading from '@/components/spinner/OverLoading.vue'

const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))
const Input = defineAsyncComponent(() => import('@/components/forms/FormElements/Input.vue'))

// Reactive data
const isLoading = ref(false)
const serviceStore = useServiceStore()
const toast = useToast()
const userStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const showPassword = ref(false)
const role = ref<any[]>([])
const departments = ref<any[]>([])
const roles = ref<{ value: string; label: string }[]>([])
const permissions = ref<any[]>([])
const reports = ref<any[]>([])
const discounts = ref<any[]>([])

const isLoadingRole = ref(false)
const isLoadingDepartment = ref(false)
const isLoadingPermissions = ref(false)
const isLoadingUser = ref(false)

const isEditMode = ref(false)
const userId = ref<string | null>(null)

// Form data with extended fields
const form = ref<
  Form & {
    addressLine: string
    stateProvince: string
    postalCode: string
    nationality: string
    companyName: string
    fax: string
    registrationNumber: string
    selectedPrivileges: string[]
    selectedReports: string[]
    selectedDiscounts: string[]
  }
>({
  ...defaultData(),
  // Address fields
  addressLine: '',
  stateProvince: '',
  postalCode: '',
  nationality: '',
  companyName: '',
  fax: '',
  registrationNumber: '',
  // Permissions, reports, discounts
  selectedPrivileges: [],
  selectedReports: [],
  selectedDiscounts: [],
})

// Active tab for sections
const activeTab = ref('privileges')

const tabs = computed(() => [
  // { id: 'personal', label: t('Personal Information'), icon: User },
  { id: 'privileges', label: t('Privileges'), icon: Shield },
  { id: 'reports', label: t('Reports'), icon: FileText },
  { id: 'discounts', label: t('Discounts'), icon: Percent },
])

const genders = computed(()=>[
  { label: t('male'), value: 'male' },
  { label: t('female'), value: 'female' },
])

const Languages = computed(()=>[
  { label: t('english'), value: 'en' },
  { label: t('french'), value: 'fr' },
])

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Methods
const fetchRole = async () => {
  isLoadingRole.value = true
  try {
    const hotelId = serviceStore.serviceId
    const response = await getRoles(hotelId)
console.log("response",response)
    roles.value = response.data.map((r: any) => ({
      label: r.roleName,
      value: r.id,
    }))
  } catch (error) {
    console.error('fetch roles failed:', error)
  } finally {
    isLoadingRole.value = false
  }
}

const fetchDepartment = async () => {
  isLoadingDepartment.value = true
  try {
    const hotelId = serviceStore.serviceId
    const departmentsResponse = await getDepartment(hotelId)
    departments.value = departmentsResponse.data.data.data.map((d: any) => ({
      ...d,
      label: d.name,
      value: d.id,
    }))
  } catch (error) {
    console.error('fetch departments failed:', error)
  } finally {
    isLoadingDepartment.value = false
  }
}




// À ajouter dans vos variables réactives
const collapsedCategoriesPrivileges = ref<Record<string, boolean>>({})
const collapsedCategoriesReports = ref<Record<string, boolean>>({})

// Méthodes pour les privilèges
const toggleCategoryPrivileges = (categoryName: string) => {
  collapsedCategoriesPrivileges.value[categoryName] =
    !collapsedCategoriesPrivileges.value[categoryName]
}

const isCategoryFullySelectedPrivileges = (categoryName: string) => {
  const category = permissions.value.find((cat) => cat.category === categoryName)
  if (!category) return false
  return category.items.every((item: any) => form.value.selectedPrivileges.includes(item.id))
}

const isCategoryPartiallySelectedPrivileges = (categoryName: string) => {
  const category = permissions.value.find((cat) => cat.category === categoryName)
  if (!category) return false
  const selectedCount = category.items.filter((item: any) =>
    form.value.selectedPrivileges.includes(item.id),
  ).length
  return selectedCount > 0 && selectedCount < category.items.length
}

const toggleAllCategoryItemsPrivileges = (categoryName: string, e: Event) => {
  const checked = (e.target as HTMLInputElement)?.checked ?? false

  const category = permissions.value.find(cat => cat.category === categoryName)
  if (!category) return

  const categoryItemIds = category.items.map((item:any) => item.id)

  if (checked) {
    categoryItemIds.forEach((id:any) => {
      if (!form.value.selectedPrivileges.includes(id)) {
        form.value.selectedPrivileges.push(id)
      }
    })
  } else {
    form.value.selectedPrivileges = form.value.selectedPrivileges.filter(
      id => !categoryItemIds.includes(id)
    )
  }
}

const getSelectedCountPrivileges = (categoryName: string) => {
  const category = permissions.value.find((cat) => cat.category === categoryName)
  if (!category) return 0
  return category.items.filter((item: any) => form.value.selectedPrivileges.includes(item.id))
    .length
}

// Méthodes pour les rapports
const toggleCategoryReports = (categoryName: string) => {
  collapsedCategoriesReports.value[categoryName] = !collapsedCategoriesReports.value[categoryName]
}

const isCategoryFullySelectedReports = (categoryName: string) => {
  const category = reports.value.find((cat) => cat.category === categoryName)
  if (!category) return false
  return category.items.every((item: any) => form.value.selectedReports.includes(item.id))
}

const isCategoryPartiallySelectedReports = (categoryName: string) => {
  const category = reports.value.find((cat) => cat.category === categoryName)
  if (!category) return false
  const selectedCount = category.items.filter((item: any) =>
    form.value.selectedReports.includes(item.id),
  ).length
  return selectedCount > 0 && selectedCount < category.items.length
}

const toggleAllCategoryItemsReports = (categoryName: string, e: Event) => {
  const checked = (e.target as HTMLInputElement)?.checked ?? false

  const category = reports.value.find((cat) => cat.category === categoryName)
  if (!category) return

  const categoryItemIds = category.items.map((item: any) => item.id)

  if (checked) {
    categoryItemIds.forEach((id: any) => {
      if (!form.value.selectedReports.includes(id)) {
        form.value.selectedReports.push(id)
      }
    })
  } else {
    form.value.selectedReports = form.value.selectedReports.filter(
      (id) => !categoryItemIds.includes(id),
    )
  }
}

const getSelectedCountReports = (categoryName: string) => {
  const category = reports.value.find((cat) => cat.category === categoryName)
  if (!category) return 0
  return category.items.filter((item: any) => form.value.selectedReports.includes(item.id)).length
}

// Mise à jour de la méthode fetchPermissions
const fetchPermissions = async () => {
  isLoadingPermissions.value = true
  try {
    const hotelId = serviceStore.serviceId
    const response = await getConfiguration(hotelId!)
    console.log('fetchPermissions', response)

    // Traitement des privilèges avec catégories
    permissions.value = response.data.data.privileges || []

    // Traitement des rapports avec catégories
    reports.value = response.data.data.reports || []

    // Traitement des remises (pas de catégories pour les remises selon vos données)
    discounts.value = response.data.data.discounts || []

    // Initialiser l'état collapsed pour toutes les catégories (ouvertes par défaut)
    permissions.value.forEach((category) => {
      collapsedCategoriesPrivileges.value[category.category] = false
    })

    reports.value.forEach((category) => {
      collapsedCategoriesReports.value[category.category] = false
    })
  } catch (error) {
    console.error('fetch permissions failed:', error)
  } finally {
    isLoadingPermissions.value = false
  }
}

const fetchUserData = async (id: string) => {
  isLoadingUser.value = true
  try {
    const response = await getUserById(id)
    console.log("fetchUserData", response.data.data)
    const userData = response.data.data

    // Get department ID from serviceAssignments if available
    const departmentId = userData.serviceAssignments && userData.serviceAssignments.length > 0
      ? userData.serviceAssignments[0].departmentId
      : null

    // Parse JSON strings for permissions, reports, and discounts
    let selectedPrivileges = []
    let selectedReports = []
    let selectedDiscounts = []

    // Parse permisPrivileges
    if (userData.permisPrivileges) {
      try {
        selectedPrivileges = typeof userData.permisPrivileges === 'string'
          ? JSON.parse(userData.permisPrivileges)
          : userData.permisPrivileges
      } catch (error) {
        console.error('Error parsing permisPrivileges:', error)
        selectedPrivileges = []
      }
    }

    // Parse permisReports
    if (userData.permisReports) {
      try {
        selectedReports = typeof userData.permisReports === 'string'
          ? JSON.parse(userData.permisReports)
          : userData.permisReports
      } catch (error) {
        console.error('Error parsing permisReports:', error)
        selectedReports = []
      }
    }

    // Parse permisDiscounts
    if (userData.permisDiscounts) {
      try {
        selectedDiscounts = typeof userData.permisDiscounts === 'string'
          ? JSON.parse(userData.permisDiscounts)
          : userData.permisDiscounts
      } catch (error) {
        console.error('Error parsing permisDiscounts:', error)
        selectedDiscounts = []
      }
    }

    // Populate form with existing user data
    form.value = {
      ...form.value,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber || '',
      roleId: userData.roleId || '',
      department: departmentId || '',
      dateOfBirth: userData.dateOfBirth || '',
      placeOfBirth: userData.placeOfBirth || '',
      gender: userData.gender || '',
      city: userData.city || '',
      country: userData.country || '',
      nationalIdNumber: userData.nationalIdNumber || '',
      dataProcessingConsent: userData.dataProcessingConsent || false,
      consentDate: userData.consentDate || '',
      language:userData.language || '',

      addressLine: userData.address || '',
      stateProvince: userData.stateProvince || '',
      postalCode: userData.postalCode || '',
      nationality: userData.nationality || '',
      companyName: userData.companyName || '',
      fax: userData.fax || '',
      registrationNumber: userData.registrationNumber || '',

      // Permissions - use parsed arrays
      selectedPrivileges: selectedPrivileges,
      selectedReports: selectedReports,
      selectedDiscounts: selectedDiscounts,
    }

    console.log('Parsed permissions:', {
      selectedPrivileges,
      selectedReports,
      selectedDiscounts
    })

  } catch (error) {
    console.error('Error fetching user data:', error)
    toast.error(t('toast.errorFetchingUser'))
  } finally {
    isLoadingUser.value = false
  }
}
const saveUser = async () => {
  isLoading.value = true
  try {
    const hotelId = serviceStore.serviceId
    const selectedRole = roles.value.find((r) => r.value === form.value.roleId)
    const roleLabel = selectedRole ? selectedRole.label : ''

    const userPayload = {
      hotel_id: hotelId,
      first_name: form.value.firstName,
      last_name: form.value.lastName,
      email: form.value.email,
      phone_number: form.value.phoneNumber,
      role_id: form.value.roleId,
      password: form.value.password,
      department_id: form.value.department,
      created_by: userStore.UserId,
      last_modified_by: userStore.UserId,
      role: roleLabel,
      date_of_birth: form.value.dateOfBirth,
      place_of_birth: form.value.placeOfBirth,
      gender: form.value.gender,
      city: form.value.city,
      country: form.value.country,
      national_id_number: form.value.nationalIdNumber,
      data_processing_consent: form.value.dataProcessingConsent,
      consent_date: form.value.consentDate,
      language:form.value.language,
      // Address fields
      address: form.value.addressLine,
      state_province: form.value.stateProvince,
      postal_code: form.value.postalCode,
      nationality: form.value.nationality,
      company_name: form.value.companyName,
      fax: form.value.fax,
      registration_number: form.value.registrationNumber,
      // Permissions
      permis_privileges: form.value.selectedPrivileges,
      permis_reports: form.value.selectedReports,
      perms_discounts: form.value.selectedDiscounts,
    }
    console.log("payload final",userPayload)
    const response = await createUser(userPayload)
    if (response.status === 201 || response.status === 200) {
      toast.success(t('toast.userCreated'))
      router.push({ name: 'Staff Management' })
    } else {
      toast.error(t('toast.userErrorCreated'))
    }
  } catch (error: any) {
    toast.error(t('toast.userErrorCreated'))
    console.error('❌ Error while saving:', error.response?.data || error.message)
  } finally {
    isLoading.value = false
  }
}

const updateFormData = async () => {
  isLoading.value = true
  try {
    const hotelId = serviceStore.serviceId
    const selectedRole = roles.value.find((r: any) => r.value === form.value.roleId)
    const roleLabel = selectedRole ? selectedRole.label : ''

    if (!userId.value) {
      toast.error('Aucun utilisateur sélectionné pour la mise à jour.')
      return
    }

    const userPayload = {
      hotel_id: hotelId,
      first_name: form.value.firstName,
      last_name: form.value.lastName,
      email: form.value.email,
      phone_number: form.value.phoneNumber,
      role_id: form.value.roleId,
      created_by: userStore.UserId,
      last_modified_by: userStore.UserId,
      role: roleLabel,
      date_of_birth: form.value.dateOfBirth,
      place_of_birth: form.value.placeOfBirth,
      gender: form.value.gender,
      city: form.value.city,
      country: form.value.country,
      national_id_number: form.value.nationalIdNumber,
      data_processing_consent: form.value.dataProcessingConsent,
      consent_date: form.value.consentDate,
      department_id: form.value.department,
      language:form.value.language,
      // Address fields
      address_line: form.value.addressLine,
      state_province: form.value.stateProvince,
      postal_code: form.value.postalCode,
      nationality: form.value.nationality,
      company_name: form.value.companyName,
      fax: form.value.fax,
      registration_number: form.value.registrationNumber,
      // Permissions
      privileges: form.value.selectedPrivileges,
      reports: form.value.selectedReports,
      discounts: form.value.selectedDiscounts,
    }

    await updateUser(userId.value, userPayload)
    toast.success(t('toast.userUpdatedSuccess'))
    router.push({ name: 'Staff Management' })
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error(t('toast.updateError'))
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (isEditMode.value) {
    await updateFormData()
  } else {
    await saveUser()
  }
}

const goBack = () => {
  router.push({ name: 'Staff Management' })
}

// Initialize form data
const initializeForm = async () => {
  userId.value = (route.params.id as string) || null
  isEditMode.value = !!userId.value

  if (isEditMode.value && userId.value) {
    await fetchUserData(userId.value)
  }
}

onMounted(async () => {
  await Promise.all([initializeForm(), fetchRole(), fetchDepartment(), fetchPermissions()])
})
</script>

<template>
  <ConfigurationLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->

        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-15">
            <div class="flex items-center">
              <button
                @click="goBack"
                class="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft class="w-5 h-5 text-gray-600" />
              </button>
              <h1 class="text-xl font-semibold text-gray-900">
                {{ isEditMode ? t('EditUser') : t('NewUser') }}
              </h1>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="goBack"
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {{ t('Cancel') }}
              </button>
              <button
                @click="handleSubmit"
                :disabled="isLoading || isLoadingUser"
                class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                <Save class="w-4 h-4 mr-2" v-if="!isLoading" />
                <Spinner class="w-4 h-4 mr-2" v-else />
                {{ isLoading ? t('Processing') : t('Save') }}
              </button>
            </div>
          </div>
        </div>


      <!-- Loading overlay for user data -->
      <div v-if="isLoadingUser"  >
      <OverLoading/>

      </div>

      <div class="max-w-full px-4 sm:px-6 lg:px-8 py-4">
        <div class="bg-white rounded-lg shadow">
          <form @submit.prevent="handleSubmit">
            <div class="flex">
              <!-- Section des informations personnelles -->
              <div>
                <div class="flex-1">
                  <!-- Personal Information Tab -->
                  <div class="p-6">
                    <div class="space-y-8">
                      <!-- Basic Information -->
                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-6">
                          {{ t('Basic Information') }}
                        </h3>
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                          <Input
                            :lb="t('FirstName')"
                            :id="'firstName'"
                            :forLabel="'firstName'"
                            v-model="form.firstName"
                            :is-required="true"
                            :placeholder="$t('FirstName')"
                          />

                          <Input
                            :lb="t('LastName')"
                            :id="'lastName'"
                            :forLabel="'lastName'"
                            v-model="form.lastName"
                            :is-required="true"
                            :placeholder="$t('LastName')"
                          />

                          <Select
                            :is-required="true"
                            :lb="t('gender')"
                            v-model="form.gender"
                            :options="genders"
                            :placeholder="$t('selectGender')"
                          />

                          <InputPhone
                            :is-required="true"
                            v-model="form.phoneNumber"
                            :id="'phone'"
                            :title="t('Phone')"
                          />

                          <InputEmail
                            :is-required="true"
                            v-model="form.email"
                            placeholder="info@gmail.com"
                            :title="t('Email')"
                          />

                          <InputDatePicker
                            v-model="form.dateOfBirth"
                            :is-required="true"
                            :title="t('dateOfBirth')"
                            :placeholder="t('dateOfBirth')"
                          />

                          <Input
                            :lb="t('placeOfBirth')"
                            :id="'placeOfBirth'"
                            :forLabel="'placeOfBirth'"
                            v-model="form.placeOfBirth"
                            :placeholder="$t('placeOfBirth')"
                            :is-required="true"
                          />

                          <Input
                            :lb="t('nationalIdNumber')"
                            :id="'nationalIdNumber'"
                            :forLabel="'nationalIdNumber'"
                            :inputType="'text'"
                            :is-required="true"
                            :placeholder="$t('nationalIdNumber')"
                            v-model="form.nationalIdNumber"
                          />

                          <!-- Password field only for new users -->
                          <div v-if="!isEditMode" class="col-span-full md:col-span-1">
                            <label
                              for="password"
                              class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                              {{ t('Password') }} <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                              <input
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                id="password"
                                autocomplete="current-password"
                                required
                                :placeholder="t('Enteryourpassword')"
                                class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800  placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                              />
                              <span
                                @click="togglePasswordVisibility"
                                class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                              >
                                <svg
                                  v-if="!showPassword"
                                  class="fill-current"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                                    fill="#98A2B3"
                                  />
                                </svg>
                                <svg
                                  v-else
                                  class="fill-current"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                                    fill="#98A2B3"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>

                          <Select
                            :is-required="true"
                            :lb="t('Role')"
                            v-model="form.roleId"
                            :options="roles"
                            :is-Loading="isLoadingRole"
                            :placeholder="$t('selectRole')"
                          />

                          <Select
                            :is-required="true"
                            :lb="t('staffManager.department')"
                            :placeholder="$t('selectDepartment')"
                            v-model="form.department"
                            :is-Loading="isLoadingDepartment"
                            :options="departments"
                          />

                           <Select
                            :is-required="true"
                            :lb="t('Language')"
                            v-model="form.language"
                            :placeholder="$t('selectLanguage')"
                            :options="Languages"
                          />
                        </div>
                      </div>

                      <!-- Address Information -->
                      <div class="border-t pt-8">
                        <h3 class="text-lg font-medium text-gray-900 mb-6">
                          {{ t('Address Information') }}
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div class="col-span-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{
                              t('Address')
                            }}</label>
                            <textarea
                              v-model="form.addressLine"
                              rows="2"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 resize-none"
                              :placeholder="t('Address')"
                            ></textarea>
                          </div>
                          <div>
                            <InputCountries v-model="form.country" />
                          </div>
                          <div>
                            <Input
                              :lb="t('State/Province')"
                              v-model="form.stateProvince"
                              :placeholder="$t('State/Province')"
                            />
                          </div>
                          <div>
                            <Input :lb="t('city')" v-model="form.city" :placeholder="$t('city')" />
                          </div>
                          <div>
                            <Input
                              :lb="t('postalCode')"
                              v-model="form.postalCode"
                              :placeholder="$t('postalCode')"
                            />
                          </div>
                          <div>
                            <InputCountries v-model="form.nationality" :lb="t('nationality')" />
                          </div>
                          <div>
                            <Input
                              :lb="t('Company Name')"
                              v-model="form.companyName"
                              :placeholder="$t('Company Name')"
                            />
                          </div>
                          <div>
                            <Input v-model="form.fax" :lb="t('Fax')" :placeholder="t('Fax')" />
                          </div>
                          <div>
                            <Input
                              v-model="form.registrationNumber"
                              :lb="t('RegistrationNo')"
                              :placeholder="t('RegistrationNo')"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section des onglets (Privileges, Reports, Discounts) -->
              <div class="my-10 w-1/2 border-l border-b border-t h-[700px] border-gray-200">
                <!-- Tabs Navigation -->
                <div class="border-b border-gray-200">
                  <nav class="-mb-px flex space-x-8 px-6">
                    <button
                      v-for="tab in tabs"
                      :key="tab.id"
                      @click.prevent="activeTab = tab.id"
                      :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm flex items-center',
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      ]"
                    >
                      <component :is="tab.icon" class="w-5 h-5 mr-2" />
                      {{ tab.label }}
                    </button>
                  </nav>
                </div>

                <!-- Contenu des onglets -->
                <div class="h-[620px] overflow-y-auto">
                  <!-- Privileges Tab -->
                  <div v-show="activeTab === 'privileges'" class="p-6">
                    <div class="space-y-6">
                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                          {{ t('User Privileges') }}
                        </h3>
                        <p class="text-sm text-gray-600 mb-6">
                          {{ t('Select the privileges this user should have access to') }}
                        </p>
                      </div>

                      <div v-if="isLoadingPermissions" class="flex justify-center py-8">
                        <Spinner class="w-8 h-8" />
                      </div>

                      <div
                        v-else-if="permissions.length === 0"
                        class="text-center py-8 text-gray-500"
                      >
                        {{ t('No privileges available') }}
                      </div>

                      <div v-else class="space-y-4">
                        <div
                          v-for="category in permissions"
                          :key="category.category"
                          class="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <!-- Category Header -->
                          <div
                            @click="toggleCategoryPrivileges(category.category)"
                            class="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div class="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                :id="`category-privileges-${category.category}`"
                                :checked="isCategoryFullySelectedPrivileges(category.category)"
                                :indeterminate="
                                  isCategoryPartiallySelectedPrivileges(category.category)
                                "
                                @click.stop
                               @change="(e) => toggleAllCategoryItemsPrivileges(category.category, e)"
                                class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                              />
                              <h4 class="text-base font-medium text-gray-900">
                                {{ category.category }}
                              </h4>
                              <span class="text-sm text-gray-500"
                                >({{ category.items.length }} items)</span
                              >
                            </div>
                            <div class="flex items-center space-x-2">
                              <span class="text-sm text-gray-500">
                                {{ getSelectedCountPrivileges(category.category) }} /
                                {{ category.items.length }} selected
                              </span>
                              <ChevronDown
                                :class="[
                                  'w-5 h-5 text-gray-400 transition-transform duration-200',
                                  collapsedCategoriesPrivileges[category.category]
                                    ? '-rotate-90'
                                    : 'rotate-0',
                                ]"
                              />
                            </div>
                          </div>

                          <!-- Category Items -->
                          <div
                            v-show="!collapsedCategoriesPrivileges[category.category]"
                            class="divide-y divide-gray-100"
                          >
                            <div
                              v-for="privilege in category.items"
                              :key="privilege.id"
                              class="flex items-start p-3 hover:bg-gray-50 transition-colors"
                            >
                              <div class="flex items-center h-5">
                                <input
                                  :id="`privilege-${privilege.id}`"
                                  v-model="form.selectedPrivileges"
                                  :value="privilege.id"
                                  type="checkbox"
                                  class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                                />
                              </div>
                              <div class="ml-3 text-sm">
                                <label
                                  :for="`privilege-${privilege.id}`"
                                  class="font-medium text-gray-700 cursor-pointer"
                                >
                                  {{ privilege.name }}
                                </label>
                                <p v-if="privilege.description" class="text-gray-500 mt-1">
                                  {{ privilege.description }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Reports Tab -->
                  <div v-show="activeTab === 'reports'" class="p-6">
                    <div class="space-y-6">
                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                          {{ t('Report Access') }}
                        </h3>
                        <p class="text-sm text-gray-600 mb-6">
                          {{ t('Select which reports this user can access') }}
                        </p>
                      </div>

                      <div v-if="isLoadingPermissions" class="flex justify-center py-8">
                        <Spinner class="w-8 h-8" />
                      </div>

                      <div v-else-if="reports.length === 0" class="text-center py-8 text-gray-500">
                        {{ t('No reports available') }}
                      </div>

                      <div v-else class="space-y-4">
                        <div
                          v-for="category in reports"
                          :key="category.category"
                          class="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <!-- Category Header -->
                          <div
                            @click="toggleCategoryReports(category.category)"
                            class="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div class="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                :id="`category-reports-${category.category}`"
                                :checked="isCategoryFullySelectedReports(category.category)"
                                :indeterminate="
                                  isCategoryPartiallySelectedReports(category.category)
                                "
                                @click.stop
                                @change="(e) => toggleAllCategoryItemsReports(category.category, e)"

                                class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                              />
                              <h4 class="text-base font-medium text-gray-900">
                                {{ category.category }}
                              </h4>
                              <span class="text-sm text-gray-500 "
                                >({{ category.items.length }} items)</span
                              >
                            </div>
                            <div class="flex items-center space-x-2">
                              <span class="text-sm text-gray-500">
                                {{ getSelectedCountReports(category.category) }} /
                                {{ category.items.length }} selected
                              </span>
                              <ChevronDown
                                :class="[
                                  'w-5 h-5 text-gray-400 transition-transform duration-200',
                                  collapsedCategoriesReports[category.category]
                                    ? '-rotate-90'
                                    : 'rotate-0',
                                ]"
                              />
                            </div>
                          </div>

                          <!-- Category Items -->
                          <div
                            v-show="!collapsedCategoriesReports[category.category]"
                            class="divide-y divide-gray-100"
                          >
                            <div
                              v-for="report in category.items"
                              :key="report.id"
                              class="flex items-start p-3 hover:bg-gray-50 transition-colors"
                            >
                              <div class="flex items-center h-5">
                                <input
                                  :id="`report-${report.id}`"
                                  v-model="form.selectedReports"
                                  :value="report.id"
                                  type="checkbox"
                                  class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                                />
                              </div>
                              <div class="ml-3 text-sm">
                                <label
                                  :for="`report-${report.id}`"
                                  class="font-medium text-gray-700 cursor-pointer"
                                >
                                  {{ report.name }}
                                </label>
                                <p v-if="report.description" class="text-gray-500 mt-1">
                                  {{ report.description }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Discounts Tab -->
                  <div v-show="activeTab === 'discounts'" class="p-6">
                    <div class="space-y-6">
                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">
                          {{ t('Discount Management') }}
                        </h3>
                        <p class="text-sm text-gray-600 mb-6">
                          {{ t('Select which discounts this user can manage and apply') }}
                        </p>
                      </div>

                      <div v-if="isLoadingPermissions" class="flex justify-center py-8">
                        <Spinner class="w-8 h-8" />
                      </div>

                      <div
                        v-else-if="discounts.length === 0"
                        class="text-center py-8 text-gray-500"
                      >
                        {{ t('No discounts available') }}
                      </div>

                      <div v-else class="space-y-4">
                        <div
                          v-for="discount in discounts"
                          :key="discount.id"
                          class="relative flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div class="flex items-center h-5">
                            <input
                              :id="`discount-${discount.id}`"
                              v-model="form.selectedDiscounts"
                              :value="discount.id"
                              type="checkbox"
                              class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              :for="`discount-${discount.id}`"
                              class="font-medium text-gray-700 cursor-pointer"
                            >
                              {{ discount.name }}
                            </label>
                            <div class="mt-1">
                              <span
                                v-if="discount.type"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {{ discount.type }}
                              </span>
                              <span
                                v-if="discount.value"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2"
                              >
                                {{ discount.value }}{{ discount.unit || '%' }}
                              </span>
                            </div>
                            <p v-if="discount.description" class="text-gray-500 mt-1">
                              {{ discount.description }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ConfigurationLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
