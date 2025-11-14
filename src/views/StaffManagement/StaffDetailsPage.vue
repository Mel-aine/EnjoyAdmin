<template>
    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="animate-pulse p-6 space-y-6">
        <EStaffDetailsSkeleton />
    </div>

    <!-- Actual Content -->
    <div v-else>
        <div class="p-6" v-if="user && user.id">
            <div
                class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    {{ $t('userProfile') }}
                </h3>
                <profile-card :full-name="fullName" :email="email">
                    <template v-slot:Setting>
                        <div class="flex items-center gap-2">
                            <span>{{ $t('status') }}: <span
                                    :class="`${getStatusColor(user.status)} px-1 rounded-2xl text-sm py-1`">{{
                                        t(user.status ?? '') }}</span></span>
                            <span>{{ $t('roles') }}: <span
                                    :class="`${getRoleBadge(user.role).bg} ${getRoleBadge(user.role).text} px-1 text-sm rounded-2xl py-1`">{{
                                        (user.role) }}</span></span>
                            <span>{{ $t('department') }}: <span
                                    :class="`${getRoleBadge(user.department?.name ?? '').bg} ${getRoleBadge(user.department?.name ?? '').text} px-1 text-sm rounded-2xl py-1`">{{
                                        (user.department?.name ?? '') }}</span></span>

                        </div>

                    </template>
                </profile-card>

                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200',
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        ]">
                            <div class="flex items-center space-x-2">
                                <component :is="tab.icon" class="w-5 h-5" />
                                <span>{{ tab.label }}</span>
                            </div>
                        </button>
                    </nav>
                </div>
                <!-- Content -->
                <div class="p-6">
                    <!-- Details Tab -->
                    <div v-if="activeTab === 'details'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                        <!-- Informations de base -->
                        <personal-info-card :user="user" @update-profile="editUser" />

                        <!-- contact info -->
                        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                        {{ $t('customerDetails.contactInfo.title') }}
                                    </h4>

                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-20">
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                {{
                                                    $t('customerDetails.contactInfo.email') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.email
                                                }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                {{
                                                    $t('personalEmail') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.personalEmail
                                                }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                {{
                                                    $t('customerDetails.contactInfo.phone') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.
                                                    phoneNumber
                                            }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                {{
                                                    $t('emergencyPhone') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.
                                                    emergencyPhone
                                            }}</p>
                                        </div>
                                        <div>
                                            <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                {{
                                                    $t('customerDetails.contactInfo.address') }}</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                                user.address ?? 'N/A'
                                                }}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- History Tab -->
                    <div v-if="activeTab === 'history'">
                        <template v-if="user.
                            activityLogs && user.activityLogs.length > 0">
                            <AuditLogsTable :expanded-changes="[]" :logs="user.activityLogs" :entity-ids="[parseInt(`${user_id}`)]" />
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center justify-center text-gray-500 py-10">
                                <FileSearch class="w-12 h-12 mb-3 text-gray-400" />
                                <p class="text-sm">{{ $t('no_recente_activity') }}</p>
                            </div>
                        </template>
                    </div>

                    <!-- Calendar Tab -->
                    <div v-if="activeTab === 'calendar'" class="bg-white rounded-xl border border-gray-200">

                    </div>

                    <!-- Payroll Tab -->
                    <div v-if="activeTab === 'payroll'">
                        <TableComponent :items="payrollTitles" :datas="payrollsForTable" :loading="payrollLoading"
                            :title="$t('payrolls')" :pagination="true" @downloadPayslip="downloadPayslip"
                            :showButtonAllElement="true">
                            <template v-slot:headerActions>
                                <div class="flex justify-end  gap-2">

                                    <button @click="openAddPayrollModal"
                                        class="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition flex items-center">
                                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        {{ $t('add') }}
                                    </button>
                                </div>

                            </template>
                        </TableComponent>
                    </div>
                </div>
                <!-- <address-card /> -->
                <OverLoading v-if="isLoading" />
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, onMounted, watch } from 'vue'
import { getEmployeesDetails } from '@/services/userApi'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import InfoIcon from '@/icons/InfoIcon.vue'
import { ClockIcon, FileSearch } from 'lucide-vue-next'
import type { IContract, IContractFormData, IPayroll, IPayrollFormData } from '@/types/type'
import { useToast } from 'vue-toastification';
import OverLoading from '@/components/spinner/OverLoading.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import EStaffDetailsSkeleton from '../../components/skeletons/EStaffDetailsSkeleton.vue'
import AuditLogsTable from '../../components/tables/AuditLogsTable.vue'
const ProfileCard = defineAsyncComponent(() => import('../../components/profile/ProfileCard.vue'))
const PersonalInfoCard = defineAsyncComponent(() => import('../../components/profile/PersonalInfoCard.vue'))

const props = defineProps({
    userId: {
        type: Number,
    }
})
const user_id = computed(() => (props.userId || router.currentRoute.value.params.id as string));
const tabs = computed(() => [
    { id: 'details', label: t('tab.details'), icon: InfoIcon },
    { id: 'history', label: t('auditTrail'), icon: ClockIcon },
])
const activeTab = ref<string>('details')
const modalOpen = ref(false);
const selectedUser = ref<any>(null)
const payrollsData = ref<IPayroll[]>([])
const payrollLoading = ref(false)
const contractFormAction = ref<"CREATE" | "UPDATE">("CREATE");
const isAddPayrollModalOpen = ref(false);
const isCreatingPayroll = ref(false);
const contractInfo = ref<IContract>({
    base_salary: 0,
    contract_end_date: "",
    is_cdi: false,
    contract_file_path: "",
    employee_id: 0,
    contract_start_date: "",
    probation_end_date: "",
    probation_start_date: "",
    special_conditions: "",
    status: 'Active',

})

const payrollForm = ref<IPayrollFormData>({
    payrollId: 0,
    payrollId_error: '',

    contractId: 0,
    contractId_error: '',

    monthYear: new Date().toISOString().split('T')[0],
    monthYear_error: '',

    grossSalary: contractInfo.value.base_salary,
    grossSalary_error: '',

    normalHours: 0,
    normalHours_error: '',

    overtimeHours: 0,
    overtimeHours_error: '',

    overtimePay: 0,
    overtimePay_error: '',

    bonuses: 0,
    bonuses_error: '',

    allowances: 0,
    allowances_error: '',

    cnpsContributions: 0,
    cnpsContributions_error: '',

    withheldTaxes: 0,
    withheldTaxes_error: '',

    netSalary: 0,
    netSalary_error: '',

    ribEmploye: '',
    ribEmploye_error: '',

    payslipFilePath: '',

    status: 'Pending',
    status_error: '',
})

watch(
    () => [
        payrollForm.value.grossSalary,
        payrollForm.value.overtimePay,
        payrollForm.value.bonuses,
        payrollForm.value.allowances,
        payrollForm.value.cnpsContributions,
        payrollForm.value.withheldTaxes,
    ],
    () => {
        const parse = (val: string | number) => Number(val) || 0

        const gross = parse(payrollForm.value.grossSalary)
        const overtime = parse(payrollForm.value.overtimePay)
        const bonuses = parse(payrollForm.value.bonuses)
        const allowances = parse(payrollForm.value.allowances)
        const cnps = parse(payrollForm.value.cnpsContributions)
        const taxes = parse(payrollForm.value.withheldTaxes)

        const net = gross + overtime + bonuses + allowances - cnps - taxes

        payrollForm.value.netSalary = Number(net.toFixed(2))
    },
    { immediate: true }
)

const payrollsForTable = computed(() => {
    return payrollsData.value.map((p: IPayroll) => ({
        ...p,
        statusColor: getPayrollStatusColor(p.status!)
    }));
});

const isCreateContractModalOpen = ref(false);
const isTerminating = ref(false);

const { t } = useI18n()
const user = ref<any>({})
const contractInfoFormData = ref<IContractFormData>({
    base_salary: 0,
    contract_end_date: "",
    is_cdi: false,
    contract_file_path: null,
    contract_start_date: "",
    probation_end_date: "",
    probation_start_date: "",
    special_conditions: "",
    status: 'Active',

})

const showTerminationModal = ref(false);
const editUser = () => {
    selectedUser.value = user.value
    modalOpen.value = true
}
const toast = useToast()
const isLoading = ref(false)
const closeModal = () => {
    modalOpen.value = false
}
const fullName = computed(() =>
    `${user.value?.firstName ?? ''} ${user.value?.lastName ?? ''}`.trim()
)
const email = computed(() => user.value.email ?? '')

const openAddPayrollModal = () => {
    payrollForm.value = {
        payrollId: 0,
        payrollId_error: '',

        contractId: 0,
        contractId_error: '',

        monthYear: new Date().toISOString().split('T')[0],
        monthYear_error: '',

        grossSalary: contractInfo.value.base_salary,
        grossSalary_error: '',

        normalHours: 0,
        normalHours_error: '',

        overtimeHours: 0,
        overtimeHours_error: '',

        overtimePay: 0,
        overtimePay_error: '',

        bonuses: 0,
        bonuses_error: '',

        allowances: 0,
        allowances_error: '',

        cnpsContributions: 0,
        cnpsContributions_error: '',

        withheldTaxes: 0,
        withheldTaxes_error: '',

        netSalary: 0,
        netSalary_error: '',

        ribEmploye: '',
        ribEmploye_error: '',

        payslipFilePath: '',
        payslipFilePath_error: '',

        status: 'Pending',
        status_error: '',
    };
    isAddPayrollModalOpen.value = true;
};





const downloadPayslip = (payroll: IPayroll) => {
    if (payroll.payslip_file_path) {
        window.open(payroll.payslip_file_path, '_blank');
    } else {
        toast.error(t('payslip_not_available'));
    }
}

const payrollTitles = computed(() => [
    { name: 'monthYear', label: t('monthYear'), type: 'text', sortable: true },
    { name: 'grossSalary', label: t('grossSalary'), type: 'currency', sortable: true },
    { name: 'overtimeHours', label: t('overtimeHours'), type: 'number' },
    { name: 'bonuses', label: t('bonuses'), type: 'currency' },
    { name: 'cnpsContributions', label: t('cnpsContributions'), type: 'currency' },
    { name: 'netSalary', label: t('netSalary'), type: 'currency', sortable: true },
    {
        name: 'actions',
        label: t('actions'),
        type: 'action',
        actions: [
            {
                name: 'Download Payslip',
                event: 'downloadPayslip',
                icone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download">
        <path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <path d="m7 10 5 5 5-5"/></svg>`,
            },
        ],
    },
]);


const getUserLocal = async () => {
    isLoading.value = true
    const response = await getEmployeesDetails(parseInt(`${user_id.value}`));
    console.log('-->response', response);
    user.value = response.data;
    if (response.data.recentContract) {
        console.log('-->response.data.recentContract', response.data.recentContract);
        payrollForm.value.netSalary = response.data.recentContract.baseSalary;
        contractInfo.value = {
            base_salary: response.data.recentContract.baseSalary,
            contract_end_date: response.data.recentContract.contractEndDate,
            is_cdi: response.data.recentContract.isCdi,
            contract_file_path: response.data.recentContract.contractFilePath,
            employee_id: response.data.recentContract.employeeId,
            contract_start_date: response.data.recentContract.contractStartDate,
            probation_end_date: response.data.recentContract.probationEndDate,
            probation_start_date: response.data.recentContract.probationStartDate,
            special_conditions: response.data.recentContract.specialConditions,
            status: response.data.recentContract.status,
            contract_id: response.data.recentContract.contractId,
        }
    }

    isLoading.value = false;
}


// On mount: fetch and update store + profile
onMounted(async () => {
    getUserLocal()
})

const refresh = () => {
    modalOpen.value = false;
    getUserLocal();
}

const getRoleBadge = (roleName: string) => {
    const roleMap: Record<string, { bg: string; text: string; label: string }> = {
        admin: {
            label: 'Administrator',
            bg: 'bg-red-100',
            text: 'text-red-800',
        },
        editor: {
            label: 'Editor',
            bg: 'bg-blue-100',
            text: 'text-blue-800',
        },
        viewer: {
            label: 'Viewer',
            bg: 'bg-green-100',
            text: 'text-green-800',
        },
        unknown: {
            label: 'Unknown',
            bg: 'bg-gray-100',
            text: 'text-gray-800',
        },
    }

    return (
        roleMap[roleName] || {
            label: roleName,
            bg: 'bg-purple-100',
            text: 'text-purple-800',
        }
    )
}
const getStatusColor = (_status: string) => {
    const status = _status.toLocaleLowerCase();
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700'
        default:
            return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-500'
    }
}

const getPayrollStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return { label: t('paid'), bg: 'bg-green-100', text: 'text-green-700' };
        case 'pending':
            return { label: t('pending'), bg: 'bg-yellow-100', text: 'text-yellow-700' };
        case 'failed':
            return { label: t('failed'), bg: 'bg-red-100', text: 'text-red-700' };
        default:
            return { label: t(status || 'unknown'), bg: 'bg-gray-100', text: 'text-gray-700' };
    }
}

</script>
