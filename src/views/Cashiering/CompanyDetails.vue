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
  User,
  Mail,
  Phone,
  MapPin,
  Receipt,
  FileText,
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
import ReusableTable from '@/components/tables/ReusableTable.vue'
import { ActionIcons } from '@/utils/ActionIcons'
import { getCompanyTransaction } from '@/services/configrationApi'
import type { Column } from '@/utils/models'
import { formatCurrency } from '@/components/utilities/UtilitiesFunction'
import ButtomDropdownAction from '@/components/common/ButtomDropdownAction.vue'

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
const foglioData = ref([])
const loading = ref(false)
const searchQuery = ref('')

const columns = computed<Column[]>(() => [
  {
    key: 'day',
    label: t('Date'),
    type: 'custom',
    sortable: true,
  },
  {
    key: 'description',
    label: t('Description'),
    sortable: false,
  },
  {
    key: 'amount',
    label: t('Amount'),
    type: 'custom',
    sortable: true,
  },
  {
    key: 'particular',
    label: t('particular'),
    type: 'text',
    sortable: true,
  },
  {
    key: 'status',
    label: t('status'),
    type: 'custom',
    sortable: true,
  },
  {
    key: 'type',
    label: t('transactionType'),
    type: 'text',
    sortable: true,
  },
])



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
      console.log('company.value', company.value)
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

const getStatusClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'posted':
      return 'bg-green-100 text-green-800'
    case 'closed':
      return 'bg-orange-100 text-orange-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'voided':
      return 'bg-blue-100 text-blue-800'
    case 'transferred':
      return 'bg-purple-100 text-purple-800'
    case 'disputed':
      return 'bg-pink-100 text-pink-800'
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'correction':
      return 'bg-brand-100 text-brand-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}


const formatAmounts = (amount: number) => {
  return formatCurrency(amount)
}



// Fonction pour récupérer les transactions de l'entreprise
const fetchCompanyTransaction = async () => {
  loading.value = true
  try {
    const companyId = router.currentRoute.value.params.id

    console.log('Fetching transactions for company:', companyId)

    const response = await getCompanyTransaction(Number(companyId))

    console.log('fetchCompanyTransaction response:', response)

    if (response?.data?.success) {
      const folioData = response.data.data

      if (folioData?.transactions && Array.isArray(folioData.transactions)) {
        foglioData.value = folioData.transactions.map((transaction: any) => ({
          id: transaction.id,
          day: transaction.postingDate || transaction.date,
          description: transaction.description || transaction.reference || '-',
          totalAmount: transaction.amount || 0,
          particular: transaction.particular,
          type: transaction.transactionType || 'transaction',
          status: transaction.status,
        }))
      } else {
        foglioData.value = []
      }

      console.log('Processed transactions:', foglioData.value)
    } else {
      console.warn('No transactions found or invalid response')
      foglioData.value = []
    }
  } catch (error) {
    console.error('Error fetching company transactions:', error)
    foglioData.value = []
  } finally {
    loading.value = false
  }
}

const onSearchChange = (query: string) => {
  console.log('Search query changed:', query)
}

// Load company details on component mount
onMounted(() => {
  getCompanyDetailsById()
  fetchCompanyTransaction()
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
      <div v-if="isLoading" class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
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

        <div class="shadow-sm px-4 py-2 mx-4 bg-white dark:bg-gray-800 flex justify-between">
          <div class="flex gap-2 align-middle self-center items-center">
            <ArrowLeft @click="router.back()" class="cursor-pointer"></ArrowLeft>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ company.companyName }}
              </h1>
              <div class="flex items-center mt-1 space-x-4">
                <!-- Statut du compte -->
                <span
                  v-if="company.accountStatus"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(company.accountStatus)"
                >
                  {{ $t(`companyDatabase.status.${company.accountStatus?.toLowerCase()}`) }}
                </span>

                <!-- ID interne -->
                <span class="text-sm text-gray-900 dark:text-gray-100">ID: {{ company.id }}</span>

                <!-- Numéro d'enregistrement -->
                <div
                  class="flex items-center gap-1 text-base font-medium text-gray-900 dark:text-gray-100"
                >

                  <span class="text-gray-500">{{ $t('configuration.business_source.registration_number') }} </span> : {{ company.registrationNumber || '-' }}
                </div>

                <!-- Numéro fiscal -->
                <div
                  class="flex items-center gap-1 text-base font-medium text-gray-900 dark:text-gray-100"
                >

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
                          $t(`countries_lists.${company.billingCountry?.toLowerCase?.()}`),
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
            <ButtomDropdownAction
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
            </ButtomDropdownAction>
            </div>
            <div class="flex flex-col items-end mt-5">

              <span class="text-sm text-gray-500 dark:text-gray-100">{{
                t('current_balance')
              }}</span>
              <span class="text-base font-semibold text-red-500 dark:text-red-500">
                {{ formatAmounts(company.currentBalance || 0) }}
              </span>
            </div>

          </div>
        </div>
      </div>

      <!-- No Company Found -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p class="text-gray-500 dark:text-gray-100">{{ t('can_t_find') }}</p>
        <button
          @click="router.back()"
          class="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          {{ t('back_to') }}
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
