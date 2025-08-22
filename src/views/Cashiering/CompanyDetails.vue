<script setup lang="ts">
import { ArrowLeft, Building2Icon, PencilIcon, CheckCircle, CreditCard, Calendar, ArrowUpDown, StopCircle, List, X, Eye, Trash2, UserMinus, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonDropdown from '../../components/common/ButtonDropdown.vue';
import router from '../../router';
import AdminLayout from '../../components/layout/AdminLayout.vue';
import Spinner from '../../components/spinner/Spinner.vue';
import { useToast } from 'vue-toastification';
import { getCompanyById, deleteCompany, type Company } from '../../services/companyApi';
import ModalConfirmation from '../../components/modal/ModalConfirmation.vue';

// Simple Button component
const Button = {
    template: '<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"><slot /></button>'
};

const { t } = useI18n();
const toast = useToast();
const company = ref<Company | null>(null);
const isLoading = ref(false);
const showDeleteModal = ref(false);
const deleting = ref(false);

const tabs = computed(() => [
    { id: 'company_details', label: t('Company Details') },
    { id: 'contact_info', label: t('Contact Information') },
    { id: 'financial_info', label: t('Financial Information') },
    { id: 'booking_history', label: t('Booking History') },
]);

const activeTab = ref<string>('company_details');

// Icon mapping for different actions
const actionIconMap = {
    'edit_company': PencilIcon,
    'delete_company': Trash2,
    'add_booking': Calendar,
    'export_data': ArrowUpDown,
};

// Color mapping for different actions
const actionColorMap = {
    'edit_company': 'text-blue-600',
    'delete_company': 'text-red-600',
    'add_booking': 'text-green-600',
    'export_data': 'text-purple-600',
};

const dropdownOptions = computed(() => [
    {
        id: 'edit_company',
        label: t('Edit Company'),
        description: t('Edit company details'),
        icon: actionIconMap['edit_company'],
        color: actionColorMap['edit_company']
    },
    {
        id: 'delete_company',
        label: t('Delete Company'),
        description: t('Delete this company'),
        icon: actionIconMap['delete_company'],
        color: actionColorMap['delete_company']
    },
    {
        id: 'add_booking',
        label: t('Add Booking'),
        description: t('Create a new booking for this company'),
        icon: actionIconMap['add_booking'],
        color: actionColorMap['add_booking']
    },
    {
        id: 'export_data',
        label: t('Export Data'),
        description: t('Export company data'),
        icon: actionIconMap['export_data'],
        color: actionColorMap['export_data']
    },
]);

const handleOptionSelected = (option: any) => {
    console.log('Selected option:', option);

    switch (option.id) {
        case 'edit_company':
            router.push(`/new_booking?companyId=${company.value?.id}`);
            break;
        case 'delete_company':
            showDeleteModal.value = true;
            break;
        case 'add_booking':
            router.push(`/new_booking?companyId=${company.value?.id}`);
            break;
        case 'export_data':
            // Implement export functionality
            toast.info(t('Export functionality not implemented yet'));
            break;
        default:
            console.log('Action not implemented:', option.id);
    }
};

const getCompanyDetailsById = async () => {
    isLoading.value = true;
    try {
        const id = router.currentRoute.value.params.id;
        const response = await getCompanyById(Number(id));
        if (response) {
            company.value = response;
        } else {
            toast.error(t('Failed to load company details'));
        }
    } catch (error) {
        console.error('Error fetching company details:', error);
        toast.error(t('Failed to load company details'));
    } finally {
        isLoading.value = false;
    }
};

const confirmDeleteCompany = async () => {
    if (!company.value) return;
    
    try {
        deleting.value = true;
        const result = await deleteCompany(company.value.id);
        if (result) {
            toast.success(t('Company deleted successfully'));
            router.push('/Cashiering/company_database');
        } else {
            toast.error(t('Failed to delete company'));
        }
    } catch (error) {
        console.error('Error deleting company:', error);
        toast.error(t('Failed to delete company'));
    } finally {
        deleting.value = false;
        showDeleteModal.value = false;
    }
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
};

const getBalanceClass = (balance: number) => {
  if (balance > 0) {
    return 'text-green-600';
  } else if (balance < 0) {
    return 'text-red-600';
  }
  return 'text-gray-600';
};

// Load company details on component mount
onMounted(() => {
    getCompanyDetailsById();
});
</script>

<template>
    <AdminLayout>
        <div class="p-6">
            <!-- Delete Confirmation Modal -->
            <ModalConfirmation v-if="showDeleteModal" :is-open="showDeleteModal" :is-loading="deleting"
                :title="t('Delete Company')" :message="t('Are you sure you want to delete this company?')"
                action="DANGER" @close="closeDeleteModal" @confirm="confirmDeleteCompany" />

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

            <!-- Company Details Content -->
            <div v-else-if="company" class="bg-white rounded-lg shadow-md">
                <!-- Header -->
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center space-x-4">
                            <button @click="router.back()"
                                class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <ArrowLeft class="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900">{{ company.companyName }}</h1>
                                <div class="flex items-center mt-1 space-x-3">
                                    <span v-if="company.status" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                        :class="getStatusClass(company.status)">
                                        {{ t('companyDatabase.status_' + company.status?.toLowerCase()) }}
                                    </span>
                                    <span class="text-sm text-gray-500">ID: {{ company.id }}</span>
                                </div>
                            </div>
                        </div>
                        <ButtonDropdown :options="dropdownOptions" @option-selected="handleOptionSelected">
                            <template #button>
                                <span class="flex items-center gap-2">
                                    <span>{{ t('Actions') }}</span>
                                </span>
                            </template>
                        </ButtonDropdown>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6" aria-label="Tabs">
                        <button v-for="tab in tabs" :key="tab.id"
                            @click="activeTab = tab.id"
                            :class="[
                                'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]">
                            {{ tab.label }}
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="p-6">
                    <!-- Company Details Tab -->
                    <div v-if="activeTab === 'company_details'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">{{ t('Company Information') }}</h3>
                                    <div class="mt-2 space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Company Name') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.companyName }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Registration Number') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.registrationNumber || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Tax ID') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.taxId || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Status') }}</span>
                                            <span v-if="company.status" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                                :class="getStatusClass(company.status)">
                                                {{ t('companyDatabase.status_' + company.status?.toLowerCase()) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">{{ t('Address Information') }}</h3>
                                    <div class="mt-2 space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Address') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.address || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('City') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.city || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('State') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.state || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Country') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.country || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Postal Code') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.postalCode || '-' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information Tab -->
                    <div v-if="activeTab === 'contact_info'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">{{ t('Primary Contact') }}</h3>
                                    <div class="mt-2 space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Contact Person') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.contactPerson || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Email') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.email || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Phone') }}</span>
                                            <span class="text-sm font-medium text-gray-900">{{ company.phone || '-' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Financial Information Tab -->
                    <div v-if="activeTab === 'financial_info'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">{{ t('Balance Information') }}</h3>
                                    <div class="mt-2 space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Current Balance') }}</span>
                                            <span class="text-sm font-medium" :class="getBalanceClass(company.balance || 0)">
                                                {{ formatCurrency(company.balance || 0) }} {{ company.currency || 'XAF' }}
                                            </span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Credit Limit') }}</span>
                                            <span class="text-sm font-medium text-gray-900">
                                                {{ formatCurrency(company.creditLimit || 0) }} {{ company.currency || 'XAF' }}
                                            </span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('Business Source') }}</span>
                                            <span class="text-sm font-medium text-gray-900">
                                                {{ company.addToBusinessSource ? t('Yes') : t('No') }}
                                            </span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-sm text-gray-500">{{ t('City Ledger') }}</span>
                                            <span class="text-sm font-medium text-gray-900">
                                                {{ company.doNotCountAsCityLedger ? t('No') : t('Yes') }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Booking History Tab -->
                    <div v-if="activeTab === 'booking_history'" class="space-y-6">
                        <div class="text-center py-8">
                            <p class="text-gray-500">{{ t('Booking history will be implemented in a future update.') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Company Found -->
            <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
                <p class="text-gray-500">{{ t('Company not found or has been deleted.') }}</p>
                <button @click="router.push('/Cashiering/company_database')"
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    {{ t('Back to Company Database') }}
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>