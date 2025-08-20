<template>
  <AdminLayout>
    <div class="p-6">

     <ReusableTable :title="$t('companyDatabase.title')" :columns="columns" :data="filteredCompanies"
          :actions="actions" :loading="loading" @action="onAction" :selectable="true"
          :search-placeholder="$t('companyDatabase.search_placeholder')" :empty-title="$t('companyDatabase.empty_title')"
          :empty-description="$t('companyDatabase.noCompaniesMessage')">

          <template v-slot:header-actions>
            <div class="flex gap-2">
              <BasicButton variant="primary" @click="navigateToAddCompany" :icon="Plus"
                :label="$t('companyDatabase.addCompany')" :loading="loading" />
              <BasicButton variant="secondary" @click="exportCompanies" :icon="Download" :label="$t('companyDatabase.export')"
                :loading="exporting" />
              <BasicButton variant="secondary" @click="auditCompanies" :icon="FileText" :label="$t('companyDatabase.audit')"
                :loading="auditing" />
                <CompanyFilter @filter="handleFilter" />
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
          <template #column-status="{ item }">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(item.status)">
              {{ $t('companyDatabase.status_' + item.status.toLowerCase()) }}
            </span>
          </template>

          <!-- Custom column for balances -->
          <template #column-balances="{ item }">
            <div class="text-right">
              <div class="text-sm font-medium" :class="getBalanceClass(item.balance)">
                {{ formatCurrency(item.balance) }}
              </div>
              <div class="text-xs text-gray-400">
                {{ item.currency || 'XAF' }}
              </div>
            </div>
          </template>
        </ReusableTable>
    </div>

    <!-- View Company Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div
        class="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ $t('companyDatabase.view_company') }}
          </h3>

          <div v-if="selectedCompany" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.name') }}</label>
              <p class="text-sm text-gray-900">{{ selectedCompany.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.contact_person') }}</label>
              <p class="text-sm text-gray-900">{{ selectedCompany.contactPerson }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.country') }}</label>
              <p class="text-sm text-gray-900">{{ selectedCompany.country }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.email') }}</label>
              <p class="text-sm text-gray-900">{{ selectedCompany.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.contact') }}</label>
              <p class="text-sm text-gray-900">{{ selectedCompany.contact }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.status') }}</label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(selectedCompany.status)">
                {{ $t('companyDatabase.status_' + selectedCompany.status.toLowerCase()) }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.balance') }}</label>
              <p class="text-sm font-medium" :class="getBalanceClass(selectedCompany.balance)">
                {{ formatCurrency(selectedCompany.balance) }} {{ selectedCompany.currency || 'XAF' }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.address') }}</label>
              <p class="text-sm text-gray-900">{{ selectedCompany.address || 'N/A' }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('companyDatabase.notes') }}</label>
              <p class="text-sm text-gray-900">{{ selectedCompany.notes || 'N/A' }}</p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <BasicButton type="button" variant="outline" @click="closeViewModal" :label="$t('close')" />
          </div>
        </div>
      </div>
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
import type { Action, Column } from '@/utils/models'
import { Plus, Download, FileText, Eye, Edit, Trash2 } from 'lucide-vue-next'
import AdminLayout from '../../components/layout/AdminLayout.vue'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const exporting = ref(false)
const auditing = ref(false)
const showViewModal = ref(false)
const selectedCompany = ref<any>(null)

// Sample data - replace with actual API calls
const companies = ref<any[]>([
  {
    id: 1,
    name: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    contactTitle: 'CEO',
    country: 'United States',
    email: 'john@techsolutions.com',
    contact: '+1-555-0123',
    status: 'Active',
    balance: 15000,
    currency: 'USD',
    address: '123 Tech Street, Silicon Valley, CA',
    notes: 'Premium client with excellent payment history'
  },
  {
    id: 2,
    name: 'Global Trading Ltd.',
    contactPerson: 'Sarah Johnson',
    contactTitle: 'Manager',
    country: 'United Kingdom',
    email: 'sarah@globaltrading.co.uk',
    contact: '+44-20-7123-4567',
    status: 'Active',
    balance: -2500,
    currency: 'GBP',
    address: '456 Business Ave, London, UK',
    notes: 'Regular client, monthly billing cycle'
  },
  {
    id: 3,
    name: 'Innovation Corp',
    contactPerson: 'Michael Brown',
    contactTitle: 'Director',
    country: 'Canada',
    email: 'michael@innovation.ca',
    contact: '+1-416-555-0198',
    status: 'Inactive',
    balance: 0,
    currency: 'CAD',
    address: '789 Innovation Blvd, Toronto, ON',
    notes: 'Account suspended due to non-payment'
  }
])

const filteredCompanies = ref<any[]>(companies.value)

const columns = computed<Column[]>(() => [
  { key: 'name', label: t('companyDatabase.columns.name'), type: 'text' },
  { key: 'contactPerson', label: t('companyDatabase.columns.contactPerson'), type: 'custom' },
  { key: 'country', label: t('companyDatabase.columns.country'), type: 'text' },
  { key: 'email', label: t('companyDatabase.columns.email'), type: 'text' },
  { key: 'contact', label: t('companyDatabase.columns.contact'), type: 'text' },
  { key: 'status', label: t('companyDatabase.columns.status'), type: 'custom' },
  { key: 'balances', label: t('companyDatabase.columns.balances'), type: 'custom' }
])

const actions = computed<Action[]>(() => [
  { label: t('view'), handler: (item: any) => viewCompany(item), variant: 'primary', icon: Eye },
  { label: t('edit'), handler: (item: any) => editCompany(item), variant: 'primary', icon: Edit },
  { label: t('delete'), handler: (item: any) => deleteCompany(item), variant: 'danger', icon: Trash2 }
])

// Filter handling
const handleFilter = (filterData: any) => {
  let filtered = companies.value

  if (filterData.searchText) {
    const searchTerm = filterData.searchText.toLowerCase()
    filtered = filtered.filter(company =>
      company.name.toLowerCase().includes(searchTerm) ||
      company.contactPerson.toLowerCase().includes(searchTerm) ||
      company.email.toLowerCase().includes(searchTerm)
    )
  }

  if (filterData.status) {
    filtered = filtered.filter(company => company.status === filterData.status)
  }

  if (filterData.country) {
    filtered = filtered.filter(company => company.country === filterData.country)
  }

  if (filterData.email) {
    filtered = filtered.filter(company =>
      company.email.toLowerCase().includes(filterData.email.toLowerCase())
    )
  }

  if (filterData.minBalance) {
    filtered = filtered.filter(company => company.balance >= parseFloat(filterData.minBalance))
  }

  if (filterData.maxBalance) {
    filtered = filtered.filter(company => company.balance <= parseFloat(filterData.maxBalance))
  }

  filteredCompanies.value = filtered
}

// Navigation and actions
const navigateToAddCompany = () => {
  router.push('/Cashiering/new_company')
}

const exportCompanies = async () => {
  try {
    exporting.value = true
    // TODO: Implement export functionality
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toast.success(t('companyDatabase.export_success'))
  } catch (error) {
    console.error('Error exporting companies:', error)
    toast.error(t('companyDatabase.export_error'))
  } finally {
    exporting.value = false
  }
}

const auditCompanies = async () => {
  try {
    auditing.value = true
    // TODO: Implement audit functionality
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toast.success(t('companyDatabase.audit_success'))
  } catch (error) {
    console.error('Error auditing companies:', error)
    toast.error(t('companyDatabase.audit_error'))
  } finally {
    auditing.value = false
  }
}

const viewCompany = (company: any) => {
  selectedCompany.value = company
  showViewModal.value = true
}

const editCompany = (company: any) => {
  router.push(`/Cashiering/edit_company/${company.id}`)
}

const deleteCompany = async (company: any) => {
  if (confirm(t('companyDatabase.delete_confirm'))) {
    try {
      loading.value = true
      // TODO: Implement API call to delete company
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

      // Remove from local array
      const index = companies.value.findIndex(c => c.id === company.id)
      if (index > -1) {
        companies.value.splice(index, 1)
        filteredCompanies.value = companies.value
      }

      toast.success(t('companyDatabase.delete_success'))
    } catch (error) {
      console.error('Error deleting company:', error)
      toast.error(t('companyDatabase.delete_error'))
    } finally {
      loading.value = false
    }
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedCompany.value = null
}

const onAction = (action: string, item: any) => {
  if (action === 'view') {
    viewCompany(item)
  } else if (action === 'edit') {
    editCompany(item)
  } else if (action === 'delete') {
    deleteCompany(item)
  }
}

// Utility functions
const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
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

// Load companies on component mount
onMounted(() => {
  // TODO: Fetch companies from API
  // fetchCompanies()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>