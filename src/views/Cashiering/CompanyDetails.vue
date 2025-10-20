<script setup lang="ts">
import {
  ArrowLeft,
  Building2Icon,
  PencilIcon,
  CheckCircle,
  CreditCard,
  Calendar,
  ArrowUpDown,
  StopCircle,
  List,
  X,
  Eye,
  Trash2,
  UserMinus,
  ChevronUp,
  ChevronDown,
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonDropdown from '../../components/common/ButtonDropdown.vue'
import router from '../../router'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import Spinner from '../../components/spinner/Spinner.vue'
import { useToast } from 'vue-toastification'
import { getCompanyById, deleteCompany, type Company } from '../../services/companyApi'
import ModalConfirmation from '../../components/modal/ModalConfirmation.vue'
import { ActionIcons } from '@/utils/ActionIcons'

// Simple Button component
const Button = {
  template:
    '<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"><slot /></button>',
}

const { t } = useI18n()
const toast = useToast()
const company = ref<any>(null)
const isLoading = ref(false)
const showDeleteModal = ref(false)
const deleting = ref(false)

const tabs = computed(() => [
  { id: 'company_details', label: t('Company Details') },
  { id: 'contact_info', label: t('Contact Information') },
  { id: 'financial_info', label: t('Financial Information') },
  { id: 'booking_history', label: t('Booking History') },
])

const activeTab = ref<string>('company_details')

// Icon mapping for different actions (centralized)
const actionIconMap = ActionIcons.getMap()

// Color mapping for different actions
const actionColorMap = {
  edit_company: 'text-blue-600',
  delete_company: 'text-red-600',
  add_booking: 'text-green-600',
  export_data: 'text-purple-600',
}

const dropdownOptions = computed(() => [
  {
    id: 'edit_company',
    label: t('Edit Company'),
    description: t('Edit company details'),
    icon: actionIconMap['edit_company'],
    color: actionColorMap['edit_company'],
  },
  {
    id: 'delete_company',
    label: t('Delete Company'),
    description: t('Delete this company'),
    icon: actionIconMap['delete_company'],
    color: actionColorMap['delete_company'],
  },
  {
    id: 'add_booking',
    label: t('Add Booking'),
    description: t('Create a new booking for this company'),
    icon: actionIconMap['add_booking'],
    color: actionColorMap['add_booking'],
  },
  {
    id: 'export_data',
    label: t('Export Data'),
    description: t('Export company data'),
    icon: actionIconMap['export_data'],
    color: actionColorMap['export_data'],
  },
])

const handleOptionSelected = (option: any) => {
  console.log('Selected option:', option)

  switch (option.id) {
    case 'edit_company':
      router.push(`/Cashiering/edit_company/${company.value?.id}`)
      break
    case 'delete_company':
      showDeleteModal.value = true
      break
    case 'add_booking':
      router.push(`/new_booking?companyId=${company.value?.id}`)
      break
    case 'export_data':
      // Implement export functionality
      toast.info(t('Export functionality not implemented yet'))
      break
    default:
      console.log('Action not implemented:', option.id)
  }
}

const getCompanyDetailsById = async () => {
  isLoading.value = true
  try {
    const id = router.currentRoute.value.params.id
    const response = await getCompanyById(Number(id))
    if (response) {
      company.value = response
    } else {
      toast.error(t('Failed to load company details'))
    }
  } catch (error) {
    console.error('Error fetching company details:', error)
    toast.error(t('Failed to load company details'))
  } finally {
    isLoading.value = false
  }
}

const confirmDeleteCompany = async () => {
  if (!company.value) return

  try {
    deleting.value = true
    const result = await deleteCompany(company.value.id)
    if (result) {
      toast.success(t('Company deleted successfully'))
      router.push('/Cashiering/company_database')
    } else {
      toast.error(t('Failed to delete company'))
    }
  } catch (error) {
    console.error('Error deleting company:', error)
    toast.error(t('Failed to delete company'))
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}

const getBalanceClass = (balance: number) => {
  if (balance > 0) {
    return 'text-green-600'
  } else if (balance < 0) {
    return 'text-red-600'
  }
  return 'text-gray-600'
}

// Load company details on component mount
onMounted(() => {
  getCompanyDetailsById()
})
</script>

<template>
  <AdminLayout>
    <div class="p-6 h-screen">
      <!-- Delete Confirmation Modal -->
      <ModalConfirmation
        v-if="showDeleteModal"
        :is-open="showDeleteModal"
        :is-loading="deleting"
        :title="t('Delete Company')"
        :message="t('Are you sure you want to delete this company?')"
        action="DANGER"
        @close="closeDeleteModal"
        @confirm="confirmDeleteCompany"
      />

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-md p-6">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        </div>
      </div>

      <!-- Company Details Content bg-white rounded-lg shadow-md -->
      <div v-else-if="company" class="">
        <!-- Header -->

        <div class="shadow-sm px-4 py-2 mx-4 bg-white flex justify-between">
          <div class="flex gap-2 align-middle self-center items-center">
            <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ company.companyName }}</h1>
              <div class="flex items-center mt-1 space-x-3">
                <span
                  v-if="company.accountStatus"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(company.accountStatus)"
                >
                  {{ $t(`companyDatabase.status.${company.accountStatus?.toLowerCase()}`) }}
                </span>
                <span class="text-sm text-gray-500">ID: {{ company.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->


        <div class="shadow-sm px-2 pt-1 mx-4 bg-white mt-5 flex flex-col md:flex-row md:justify-between">
          <div class="w-full border-b border-gray-200 overflow-x-auto">
            <nav class="flex space-x-4 sm:space-x-6 px-4 md:px-6 min-w-max">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ tab.label }}</span>
                </div>
              </button>
            </nav>
          </div>

          <div class="self-end md:self-center mt-3 md:mt-0 px-4">
            <ButtonDropdown
              :options="dropdownOptions"
              @option-selected="handleOptionSelected"
              button-class="bg-white text-primary border-primary hover:bg-primary/25 w-full sm:w-auto"
              dropdown-class="w-64"
            >
              <template #button>
                <span class="flex items-center justify-center gap-2">
                  <span>{{ t('Actions') }}</span>
                </span>
              </template>
            </ButtonDropdown>
          </div>
        </div>


        <!-- Tab Content -->
       <div class="p-5 mt-4 ">
          <!-- Company Details Tab -->
          <div v-if="activeTab === 'company_details'" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Company Information Card -->
              <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1m-1 4h1"
                    />
                  </svg>
                  {{ t('Company Information') }}
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Company Name') }}</span>
                    <span class="text-base font-medium text-gray-900">{{
                      company.companyName || '-'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Registration Number') }}</span>
                    <span class="text-base font-medium text-gray-900">{{
                      company.registrationNumber || '-'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Tax ID') }}</span>
                    <span class="text-base font-medium text-gray-900">{{ company.taxId || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="text-sm text-gray-500">{{ t('Status') }}</span>
                    <span
                      v-if="company.accountStatus"
                      class="inline-flex px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider"
                      :class="getStatusClass(company.accountStatus)"
                    >
                      {{ $t(`companyDatabase.status.${company.accountStatus?.toLowerCase()}`) }}
                    </span>
                    <span v-else class="text-base font-medium text-gray-400">-</span>
                  </div>
                </div>
              </div>

              <!-- Address Information Card -->
              <div class="bg-white p-6 rounded-lg  border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {{ t('Address Information') }}
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Address') }}</span>
                    <span class="text-base font-medium text-gray-900 text-right">{{
                      company.billingAddressLine || '-'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('City') }}</span>
                    <span class="text-base font-medium text-gray-900">{{ company.billingCity || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('State') }}</span>
                    <span class="text-base font-medium text-gray-900">{{ company.billingStateProvince || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Country') }}</span>
                    <span class="text-base font-medium text-gray-900">{{ $t(`countries_lists.${company.billingCountry.toLowerCase()}`) || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="text-sm text-gray-500">{{ t('Postal Code') }}</span>
                    <span class="text-base font-medium text-gray-900">{{
                      company.billingPostalCode || '-'
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information Tab -->
          <div v-if="activeTab === 'contact_info'" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
              <!-- Primary Contact Card -->
              <div class="bg-white p-6 rounded-lg  border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {{ t('Primary Contact') }}
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Contact Person') }}</span>
                    <span class="text-base font-medium text-gray-900">{{
                      company.contactPersonName || '-'
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Email') }}</span>
                    <span class="text-base font-medium text-gray-900">{{ company.primaryEmail || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="text-sm text-gray-500">{{ t('Phone') }}</span>
                    <span class="text-base font-medium text-gray-900">{{ company.primaryPhone || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Information Tab -->
          <div v-if="activeTab === 'financial_info'" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
              <!-- Balance Information Card -->
              <div class="bg-white p-6 rounded-lg  border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 12v-1m-4-6H9m6 0h1m-6.42 2.08l-.21.218m-.07.07a8 8 0 11-14.004-9.996C3.003 5.483 3 5.76 3 6v10a8 8 0 1114.821-4.909l.487-.487A8 8 0 1012 3c-1.333 0-2.6.288-3.754.802"
                    />
                  </svg>
                  {{ t('Balance Information') }}
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Current Balance') }}</span>
                    <span
                      class="text-base font-semibold"
                      :class="getBalanceClass(company.balance || 0)"
                    >
                      {{ formatCurrency(company.balance || 0) }} {{ company.currency || 'XAF' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Credit Limit') }}</span>
                    <span class="text-base font-medium text-gray-900">
                      {{ formatCurrency(company.creditLimit || 0) }}
                      {{ company.currency || 'XAF' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-sm text-gray-500">{{ t('Business Source') }}</span>
                    <span class="text-base font-medium text-gray-900">
                      {{ company.addToBusinessSource ? t('Yes') : t('No') }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="text-sm text-gray-500">{{ t('City Ledger') }}</span>
                    <span class="text-base font-medium text-gray-900">
                      {{ company.doNotCountAsCityLedger ? t('No') : t('Yes') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking History Tab -->
          <div v-if="activeTab === 'booking_history'" class="space-y-6">
            <div class="text-center py-12 bg-white rounded-lg  border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-lg text-gray-600 font-medium mb-2">
                {{ t('Booking history will be implemented in a future update.') }}
              </p>
              <p class="text-sm text-gray-500">
                {{ t('Please check back later for this feature.') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Company Found -->
      <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
        <p class="text-gray-500">{{ t('Company not found or has been deleted.') }}</p>
        <button
          @click="router.back()"
          class="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          {{ t('Back to Company Database') }}
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
