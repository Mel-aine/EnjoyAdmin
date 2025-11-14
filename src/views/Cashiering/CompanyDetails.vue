<script setup lang="ts">
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import { useToast } from 'vue-toastification'
import { getCompanyById, deleteCompany } from '../../services/companyApi'
import ModalConfirmation from '../../components/modal/ModalConfirmation.vue'
import { ActionIcons } from '@/utils/ActionIcons'
import ButtomDropdownAction from '@/components/common/ButtomDropdownAction.vue'
import CashieringCenterInterface from './CashieringCenterInterface.vue'

// Simple Button component
const Button = {
  template:
    '<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"><slot /></button>',
}

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const company = ref<any>(null)
const isLoading = ref(false)
const hasLoadedOnce = ref(false)
const showDeleteModal = ref(false)
const deleting = ref(false)


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

const getCompanyDetailsById = async (silent = false) => {
  // Show skeleton only on first load; subsequent refreshes should rely on global overlay
  if (!silent && !hasLoadedOnce.value) {
    isLoading.value = true
  }
  try {
    const id = route.params.id
    console.log('company Id', route.params)
    const response = await getCompanyById(Number(id))
    if (response) {
      company.value = response
      console.log('company.value', company.value)
    } else {
      toast.error(t('Failed to load company details'))
    }
  } catch (error) {
    console.error('Error fetching company details:', error)
    toast.error(t('Failed to load company details'))
  } finally {
    isLoading.value = false
    hasLoadedOnce.value = true
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
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'pending':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}




const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

// Load company details on component mount
onMounted(() => {
  getCompanyDetailsById()
})

// Refresh company details without showing skeleton (used when CashieringCenter refreshes)
const refreshCompanyDetailsNoSkeleton = async () => {
  await getCompanyDetailsById(true)
}
</script>

<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Delete Confirmation Modal -->
      <ModalConfirmation v-if="showDeleteModal" :is-open="showDeleteModal" :is-loading="deleting"
        :title="t('Delete Company')" :message="t('Are you sure you want to delete this company?')" action="DANGER"
        @close="closeDeleteModal" @confirm="confirmDeleteCompany" />

      <!-- Skeleton while loading company details -->
      <div v-else-if="isLoading" class="space-y-6 animate-pulse">
        <!-- Header Skeleton -->
        <div class="shadow-sm px-4 py-2 bg-white dark:bg-gray-800 flex justify-between">
          <div class="flex gap-2 items-center">
            <div class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div class="flex gap-2">
            <div class="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <!-- Content Skeleton -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="w-40 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div class="space-y-3">
            <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>


      <!-- Company Details Content bg-white rounded-lg shadow-md -->
      <div v-else-if="company" class="border-b-2 border-gray-00 dark:border-gray-700">
        <!-- Header -->

        <div class="shadow-sm px-4 py-2  bg-white dark:bg-gray-800 flex justify-between">
          <div class="flex gap-2 align-middle self-center items-center">
            <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ company.companyName }}
              </h1>
              <div class="flex items-center mt-1 space-x-4">
                <!-- Statut du compte -->
                <span v-if="company.accountStatus" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(company.accountStatus)">
                  {{ $t(`companyDatabase.status.${company.accountStatus?.toLowerCase()}`) }}
                </span>

                <!-- ID interne -->
                <span class="text-sm text-gray-900 dark:text-gray-100">ID: {{ company.id }}</span>

                <!-- Numéro d'enregistrement -->
                <div class="flex items-center gap-1 text-base font-medium text-gray-900 dark:text-gray-100">

                  <span class="text-gray-500">{{ $t('configuration.business_source.registration_number') }} </span> : {{
                    company.registrationNumber || '-' }}
                </div>

                <!-- Numéro fiscal -->
                <div class="flex items-center gap-1 text-base font-medium text-gray-900 dark:text-gray-100">

                  <span class="text-gray-500">{{ $t('tax_id') }} </span> : {{ company.taxId || '-' }}
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-6 mt-2">
                <!-- Contact Person -->
                <div class="flex items-center gap-1">
                  <User class="text-gray-500 w-4 h-4" />
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{
                    company.contactPersonName || '-'
                  }}</span>
                </div>

                <!-- Email -->
                <div class="flex items-center gap-1">
                  <Mail class="text-gray-500 w-4 h-4" />
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{
                    company.primaryEmail || '-'
                  }}</span>
                </div>

                <!-- Phone -->
                <div class="flex items-center gap-1">
                  <Phone class="text-gray-500 w-4 h-4" />
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{
                    company.primaryPhone || '-'
                  }}</span>
                </div>
                <div class="flex items-start gap-1">
                  <MapPin class="text-gray-500 w-4 h-4 mt-1" />
                  <div class="flex flex-col text-sm font-medium text-gray-900 dark:text-gray-100">
                    <span>
                      {{
                        [
                          company.billingAddressLine,
                          company.billingCity,
                          company.billingStateProvince,
                          company.billingPostalCode,
                          company.billingCountry ? $t(`countries_lists.${company.billingCountry?.toLowerCase?.()}`) : ''
                        ]
                          .filter(Boolean)
                          .join(', ')
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex flex-col items-end mt-5">
              <ButtomDropdownAction :options="dropdownOptions" @option-selected="handleOptionSelected"
                button-class="bg-white dark:bg-gray-800 text-primary border-primary hover:bg-primary/25 w-full sm:w-auto"
                dropdown-class="w-64">
                <template #button>
                  <span class="flex items-center justify-center gap-2">
                    <span>{{ t('Actions') }}</span>
                  </span>
                </template>
              </ButtomDropdownAction>
            </div>
            <div class="flex flex-col items-end mt-5">

              <span class="text-sm text-gray-500 dark:text-gray-100">{{
                t('current_balance')
              }}</span>
              <span class="text-base font-semibold text-red-500 dark:text-red-500">
                {{ formatAmount(company.currentBalance || 0) }} FCFA
              </span>
            </div>

          </div>
        </div>
      </div>

     <template v-if="company">
       <CashieringCenterInterface v-if="company" :selected-company-id="company?.id" :isCashering="false"
        @refreshed="refreshCompanyDetailsNoSkeleton" />
     </template>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
