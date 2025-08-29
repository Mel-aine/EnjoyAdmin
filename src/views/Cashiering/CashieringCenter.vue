<template>
    <AdminLayout>
        <div class=" bg-white shadow-sm">
            <div class="mb-0 p-3 flex justify-between items-center border-b border-gray-200">
                <div class="flex gap-5 align-middle items-center  dark:border-gray-700">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('cashiering_center') }}</h2>
                    <Input v-model="searchQuery" :placeholder="$t('cashiering_searchPlaceholder', '')" />
                </div>
                <div class="flex space-x-2">

                    <BasicButton :icon="PlusIcon" :label="$t('new_payment')" @click="openNewPaymentModal"/>
                    <BasicButton :label="$t('export')" variant="secondary" :icon="FileDown" />
                    <BasicButton :label="$t('send_email')" variant="secondary" :icon="Mail" />
                    <BasicButton :label="$t('print')" variant="secondary" :icon="PrinterIcon" />

                </div>
            </div>

            <!-- Main Content -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <!-- City Ledger Selection -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700">
                <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                    <div class="mr-4 w-52">
                        <InputSelectCityLeger v-model="selectCityLedger" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <div>
                            <RadioGroup v-model="activeTab" class="flex space-x-4" :options="[
                                { label: 'Posting date', value: 'posting' },
                                { label: 'Departure date', value: 'departure' },
                            ]" />

                        </div>
                        <div class="mr-4">
                            <InputDoubleDatePicker lb="Posting Date" v-model:startDate="filters.startDate"
                                v-model:endDate="filters.endDate" />
                        </div>
                    </div>

                    <div class="flex justify-between flex-col gap-6">
                        <InputCheckBox label="Pending Ledger Commission" id="pending" />
                        <InputCheckBox label="Display Void" id="display-void" />
                    </div>
                   
                </div>
                 <div class="flex gap-5 ms-4 justify-between self-center items-center align-top pe-3">
                        <div class="flex flex-col gap-2 items-center self-start justify-between content-start align-top h-full ">
                            <span>0</span>
                            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ $t('City Ledger Total') }}</span>
                        </div>
                        <div class="flex flex-col  gap-2 items-center justify-start align-top ">
                            <span>0</span>
                            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ $t('Unpaid Invoice') }}</span>
                        </div>
                        <div class="flex flex-col  gap-2 items-center justify-start align-top ">
                            <span>0</span>
                            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ $t('Unassigned Payments') }}</span>
                        </div>
                        <div class="flex flex-col  gap-2 items-center justify-start align-top ">
                            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">0</span>
                            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ $t('Assigned Payments') }}</span>
                        </div>
                         <div class="flex flex-col  gap-2 items-center justify-start align-top ">
                            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ $t('Opening Balance') }}</span>
                            <span class="text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400">{{ 0 }}</span>
                        </div>

                    </div>
                    </div>

              
                <!-- Table Content -->
                <ReusableTable :columns="columns" :data="filteredData" :actions="actions" :loading="loading" :searchable="false" :show-header="false"
                    :selectable="true" @selection-change="handleSelectionChange">
                    <!-- Custom cell for Description column -->
                    <template #column-description="{ item }">
                        <div>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.description
                            }}</span>
                            <p v-if="item.details" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{
                                item.details
                            }}
                            </p>
                        </div>
                    </template>

                    <!-- Custom cell for Credit column -->
                    <template #column-credit="{ item }">
                        <span class="text-sm"
                            :class="item.credit > 0 ? 'font-medium text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'">{{
                                formatCurrency(item.credit) }}</span>
                    </template>

                    <!-- Custom cell for Debit column -->
                    <template #column-debit="{ item }">
                        <span class="text-sm"
                            :class="item.debit > 0 ? 'font-medium text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'">{{
                                formatCurrency(item.debit) }}</span>
                    </template>

                    <!-- Custom cell for Balance column -->
                    <template #column-balance="{ item }">
                        <span class="text-sm font-medium"
                            :class="item.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">{{
                                formatCurrency(item.balance) }}</span>
                    </template>
                </ReusableTable>
            </div>
        </div>

        <template v-if="newPaymentVisible">
            <NewPaymentCityLedger v-if="newPaymentVisible" @close="newPaymentVisible = false"/>
        </template>
    </AdminLayout>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import AdminLayout from '../../components/layout/AdminLayout.vue'

import Select from '../../components/forms/FormElements/Select.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import PlusIcon from '../../icons/PlusIcon.vue'
import { FileDown, Mail, PrinterIcon } from 'lucide-vue-next'
import Input from '../../components/forms/FormElements/Input.vue'
import RadioGroup from '../../components/forms/FormElements/RadioGroup .vue'
import InputCheckBox from '../../components/forms/FormElements/InputCheckBox.vue'
import NewPaymentCityLedger from './NewPaymentCityLedger.vue'
import InputSelectCityLeger from '../../components/reservations/foglio/InputSelectCityLeger.vue'
import { type Column } from '../../utils/models'
import { formatCurrency } from '../../utils/numericUtils'
const router = useRouter()
const { t } = useI18n()
const searchQuery = ref('')
// State
const activeTab = ref('pending')
const loading = ref(false)
const closingBalance = ref(35000)
const showFilters = ref(false)
const newPaymentVisible = ref(false)
// Filters
const filters = ref({
    startDate: '',
    endDate: '',
    user: ''
})

// Original data backup for filtering
const originalTransactions = ref<any>([])
const selectCityLedger = ref<any>(null)
// Table columns
const columns = ref<Column[]>([
    { key: 'date', label: 'Date', type: 'custom' },
    { key: 'description', label: 'Description', type: 'custom' },
    { key: 'paymentType', label: 'Payment Type', type: 'custom' },
    { key: 'user', label: 'User', type: 'custom' },
    { key: 'credit', label: 'Credit', type: 'custom' },
    { key: 'debit', label: 'Debit', type: 'custom' },
    { key: 'assigned', label: 'Assigned', type: 'custom' },
    { key: 'unassigned', label: 'Unassigned', type: 'custom' },
    { key: 'balance', label: 'Balance', type: 'custom' },
])

// Sample data
const transactions = ref([
    {
        id: 1,
        date: '2023-11-01',
        description: 'Receipt for TIN',
        details: 'Payments received from',
        paymentType: 'cash',
        user: 'helpdesk/support',
        credit: 15.00,
        debit: 0.00,
        assigned: 0.00,
        unassigned: 0.00,
        balance: 15.00
    },
    {
        id: 2,
        date: '2023-10-31',
        description: 'Receipt for 123456',
        details: 'Payments received from ',
        paymentType: 'cash',
        user: 'helpdesk/support',
        credit: 4.00,
        debit: 0.00,
        assigned: 0.00,
        unassigned: 0.00,
        balance: 4.00
    },
    {
        id: 3,
        date: '2023-01-01',
        description: 'Guest - Emile Simalundu',
        details: null,
        paymentType: 'ADONIS TRAVELS&TOURS',
        user: 'helpdesk/support',
        credit: 0.00,
        debit: 12720.00,
        assigned: 0.00,
        unassigned: 0.00,
        balance: -12720.00
    },
    {
        id: 4,
        date: '2023-01-01',
        description: 'Guest -',
        details: null,
        paymentType: 'ADONIS TRAVELS&TOURS',
        user: 'helpdesk/support',
        credit: 0.00,
        debit: 12720.00,
        assigned: 12720.00,
        unassigned: 0.00,
        balance: 0.00
    },
    {
        id: 5,
        date: '2023-01-01',
        description: 'Payments ',
        details: null,
        paymentType: 'cash',
        user: 'helpdesk/support',
        credit: 40000.00,
        debit: 0.00,
        assigned: 0.00,
        unassigned: 40000.00,
        balance: 40000.00
    }
])

// Actions
const actions = ref([
    {
        name: 'view',
        label: 'View Details',
        icon: 'eye'
    },
    {
        name: 'edit',
        label: 'Edit',
        icon: 'pencil'
    },
    {
        name: 'delete',
        label: 'Delete',
        icon: 'trash',
        danger: true
    },
    {
        name: 'void',
        label: 'Void',
        icon: 'ban',
        danger: true
    },
    {
        name: 'print',
        label: 'Print Receipt',
        icon: 'printer'
    },
    {
        name: 'map',
        label: 'Map Payment',
        icon: 'map'
    }
])

// Selected items
const selectedItems = ref([])

// Computed
const filteredData = computed(() => {
    // First filter by tab
    let filtered = [];

    switch (activeTab.value) {
        case 'pending':
            filtered = transactions.value.filter(t => t.description.includes('cityledger'))
            break
        case 'payments':
            filtered = transactions.value.filter(t => t.credit > 0)
            break
        case 'unpaid':
            filtered = transactions.value.filter(t => t.debit > 0 && t.assigned === 0)
            break
        case 'unsettled':
            filtered = transactions.value.filter(t => t.balance !== 0)
            break
        case 'assigned':
            filtered = transactions.value.filter(t => t.assigned > 0)
            break
        default:
            filtered = transactions.value
    }

    return filtered
})


function handleSelectionChange(items:any) {
    selectedItems.value = items
    console.log('Selected items:', items)
}





function openNewPaymentModal() {
    newPaymentVisible.value = true
}




// Lifecycle hooks
onMounted(() => {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
        // Store original data for filtering
        originalTransactions.value = [...transactions.value]
        loading.value = false
    }, 1000)
})
</script>