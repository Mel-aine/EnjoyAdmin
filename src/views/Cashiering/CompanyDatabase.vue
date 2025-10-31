<template>
  <AdminLayout>
    <div class="p-6">

      <ReusableTable :title="$t('companyDatabase.title')" :columns="columns" :data="filteredCompanies" @page-change="handlePageChange" :meta="paginationMeta"
        :actions="actions" :loading="loading" @action="onAction"
        :search-placeholder="$t('companyFilter.searchText')" :empty-title="$t('companyDatabase.empty_title')"
        :empty-description="$t('companyDatabase.noCompaniesMessage')">

        <template v-slot:header-actions>
          <div class="flex  align-middle self-center items-center gap-2">
            <BasicButton variant="primary" @click="navigateToAddCompany" :icon="Plus"
              :label="$t('companyDatabase.addCompany')"  />
            <BasicButton variant="secondary" @click="exportCompaniesData" :icon="Download"
              :label="$t('companyDatabase.export')" :loading="exporting" />
            <BasicButton variant="secondary" @click="auditCompaniesData" :icon="FileText"
              :label="$t('companyDatabase.audit')" :loading="auditing" />
            <div class="mt-3">
              <CompanyFilter @filter="handleFilter" />
            </div>
          </div>
        </template>



        <!-- Custom column for contact person -->
        <template #column-contactPerson="{ item }">
          <div>
            <div class="text-sm text-gray-900">{{ item.contactPerson }}</div>
            <div class="text-xs text-gray-400">{{ item.contactTitle || 'Contact Person' }}</div>
          </div>
        </template>

        <!-- Custom column for status -->
        <template #column-accountStatus="{ item }">
          <span v-if="item.accountStatus" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(item.accountStatus)">
            {{ $t(item.accountStatus?.toLowerCase() ?? '') }}
          </span>
        </template>

        <!-- Custom column for balances -->
        <template #column-balances="{ item }">
          <div class="text-right">
            <div class="text-sm font-medium" :class="getBalanceClass(item.currentBalance)">
              {{ formatCurrency(item.currentBalance) }}
            </div>
            <div class="text-xs text-gray-400">
              {{ item.currency || 'XAF' }}
            </div>
          </div>
        </template>
      </ReusableTable>
       <!-- Delete Confirmation Modal -->
        <ModalConfirmation
          v-if="showDeleteModal"
          :is-loading="deleting"
          :title="$t('companyDatabase.delete_title')"
          :message="$t('companyDatabase.delete_confirm_message', { name: companyToDelete?.companyName })"
          action="DANGER"
          @close="closeDeleteModal"
          @confirm="confirmDeleteCompany"
        />
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import ReusableTable from '@/components/tables/ReusableTable.vue'
import BasicButton from '@/components/buttons/BasicButton.vue'
import CompanyFilter from './CompanyFilter.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { Action, Column } from '@/utils/models'
import { Plus, Download, FileText, Eye, Edit, Trash2 } from 'lucide-vue-next'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import { getCompanies, getFilteredCompanies, deleteCompany, exportCompanies, auditCompanies, type Company, type CompanyFilter as CompanyFilterType } from '@/services/companyApi'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const exporting = ref(false)
const auditing = ref(false)
const deleting = ref(false)
const showDeleteModal = ref(false)
const companyToDelete = ref<Company | null>(null)
const paginationMeta = ref<any>(null)
const page = ref(1)
const activeFilters = ref<any>({})

// Companies data from API
const companies = ref<Company[]>([])
const filteredCompanies = ref<Company[]>([])

const columns = computed<Column[]>(() => [
  { key: 'companyName', label: t('companyDatabase.columns.name'), type: 'text' },
  { key: 'contactPersonName', label: t('companyDatabase.columns.contactPerson'), type: 'custom' },
  { key: 'billingCountry', label: t('companyDatabase.columns.country'), type: 'text' },
  { key: 'primaryEmail', label: t('companyDatabase.columns.email'), type: 'text' },
  { key: 'primaryPhone', label: t('companyDatabase.columns.contact'), type: 'text' },
  { key: 'accountStatus', label: t('companyDatabase.columns.status'), type: 'custom' },
  { key: 'balances', label: t('companyDatabase.columns.balances'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  { label: t('view'), handler: (item: any) => viewCompany(item), variant: 'primary', icon: Eye },
  { label: t('edit'), handler: (item: any) => editCompany(item), variant: 'primary', icon: Edit },
  { label: t('delete'), handler: (item: any) => deleteCompanyData(item), variant: 'danger', icon: Trash2 }
])

// Filter handling
const handleFilter = async (filterData: any, pageNumber = 1) => {
  try {
    loading.value = true
    activeFilters.value = filterData

    // Convert filter data to API filter format
    const apiFilter: CompanyFilterType = {
      searchText: filterData.searchText || undefined,
      status: filterData.status || undefined,
      country: filterData.country || undefined,
      email: filterData.email || undefined,
      minBalance: filterData.minBalance ? parseFloat(filterData.minBalance) : undefined,
      maxBalance: filterData.maxBalance ? parseFloat(filterData.maxBalance) : undefined,
      page: pageNumber,
      limit: 10,
    }


    // Call API with filters
    const result:any = await getFilteredCompanies(apiFilter)
    console.log('result', result)
    if (result) {
      filteredCompanies.value = result.data
      paginationMeta.value = result.meta
      page.value = pageNumber
    } else {
      filteredCompanies.value = []
      toast.error(t('companyDatabase.filter_error'))
    }
  } catch (error) {
    console.error('Error filtering companies:', error)
    toast.error(t('companyDatabase.filter_error'))
    filteredCompanies.value = []
  } finally {
    loading.value = false
  }
}

// Navigation and actions
const navigateToAddCompany = () => {
  router.push('/Cashiering/new_company')
}

const exportCompaniesData = async () => {
  try {
    exporting.value = true
    const result = await exportCompanies()
    if (result) {
      // Create a download link for the blob
      const url = window.URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'companies_export.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(t('companyDatabase.export_success'))
    } else {
      toast.error(t('companyDatabase.export_error'))
    }
  } catch (error) {
    console.error('Error exporting companies:', error)
    toast.error(t('companyDatabase.export_error'))
  } finally {
    exporting.value = false
  }
}

const auditCompaniesData = async () => {
  try {
    auditing.value = true
    // Navigate to audit trail page for companies
    router.push({ name: 'AuditTrailEntity', params: { entityType: 'CompanyAccount', entityId: 'all' } })
  } catch (error) {
    console.error('Error navigating to audit trail:', error)
    toast.error(t('companyDatabase.audit_error'))
  } finally {
    auditing.value = false
  }
}

const viewCompany = (company: any) => {
  router.push(`/Cashiering/company_details/${company.id}`)
}

const editCompany = (company: any) => {
  router.push(`/Cashiering/edit_company/${company.id}`)
}

const deleteCompanyData = (company: Company) => {
  companyToDelete.value = company
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  companyToDelete.value = null
}

const confirmDeleteCompany = async () => {
  if (!companyToDelete.value) return

  try {
    deleting.value = true
    const result = await deleteCompany(companyToDelete.value.id)
    if (result) {
      // Remove from local array
      const index = companies.value.findIndex(c => c.id === companyToDelete.value?.id)
      if (index > -1) {
        companies.value.splice(index, 1)
        filteredCompanies.value = filteredCompanies.value.filter(c => c.id !== companyToDelete.value?.id)
      }
      toast.success(t('companyDatabase.delete_success'))
      closeDeleteModal()
    } else {
      toast.error(t('companyDatabase.delete_error'))
    }
  } catch (error) {
    console.error('Error deleting company:', error)
    toast.error(t('companyDatabase.delete_error'))
  } finally {
    deleting.value = false
  }
}



const onAction = (action: string, item: Company) => {
  if (action === 'view') {
    viewCompany(item)
  } else if (action === 'edit') {
    editCompany(item)
  } else if (action === 'delete') {
    deleteCompanyData(item)
  }
}

// Utility functions
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

const getBalanceClass = (balance: number) => {
  if (balance > 0) {
    return 'text-green-600'
  } else if (balance < 0) {
    return 'text-red-600'
  }
  return 'text-gray-600'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

// Fetch companies from API
const fetchCompanies = async (pageNumber = 1) => {
  try {
    loading.value = true
    const result: any = await getCompanies({ page: pageNumber, limit: 10 })
    console.log('fetchCompanies', result)
    if (result) {
      companies.value = result.data
      filteredCompanies.value = result.data
      paginationMeta.value = result.meta

    } else {
      companies.value = []
      filteredCompanies.value = []
      toast.error(t('companyDatabase.fetch_error'))
    }
  } catch (error) {
    console.error('Error fetching companies:', error)
    toast.error(t('companyDatabase.fetch_error'))
    companies.value = []
    filteredCompanies.value = []
  } finally {
    loading.value = false
  }
}
const handlePageChange = (newPage: number) => {
  handleFilter(activeFilters.value, newPage)
}
// Load companies on component mount
onMounted(() => {
  fetchCompanies()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
