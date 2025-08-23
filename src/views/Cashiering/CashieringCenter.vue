<template>
    <AdminLayout>    <div class="p-6">
        <div class="mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('cashiering.center') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $t('cashiering.centerDescription') }}</p>
            </div>
            <div class="flex space-x-2">
                <ButtonDropdown 
                    :options="[
                        { id: 'new-payment', label: $t('cashiering.addPayment'), icon: 'PlusIcon' }
                    ]"
                    buttonText="{{ $t('cashiering.addPayment') }}"
                    buttonClass="bg-blue-600 text-white hover:bg-blue-700"
                    @option-selected="openNewPaymentModal"
                />
                <ButtonDropdown 
                    :options="[
                        { id: 'export', label: $t('common.export'), icon: 'DownloadIcon' }
                    ]"
                    buttonText="{{ $t('common.export') }}"
                    buttonClass="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    @option-selected="exportData"
                />
                <ButtonDropdown 
                    :options="[
                        { id: 'email', label: $t('common.sendEmail'), icon: 'MailIcon' }
                    ]"
                    buttonText="{{ $t('common.sendEmail') }}"
                    buttonClass="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    @option-selected="sendEmail"
                />
                <ButtonDropdown 
                    :options="[
                        { id: 'print', label: $t('common.print'), icon: 'PrinterIcon' }
                    ]"
                    buttonText="{{ $t('common.print') }}"
                    buttonClass="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    @option-selected="printData"
                />
            </div>
        </div>

        <!-- Quick Search -->
        <div class="mb-4">
            <SearchBar 
                v-model="searchQuery" 
                :placeholder="$t('cashiering.searchPlaceholder', 'Quick Search by Folio No./Voucher No...')" 
                @search="handleSearchChange"
            />
        </div>

        <!-- Main Content -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <!-- City Ledger Selection -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div class="mr-4">
                    <Select
                        lb="City Ledger"
                        v-model="selectedCityLedger"
                        :options="[
                            { label: 'AGODA TRAVELERS', value: 'AGODA TRAVELERS' },
                            { label: 'Other ledgers...', value: 'other' }
                        ]"
                    />
                </div>
                <div class="mr-4">
                    <InputDoubleDatePicker
                        lb="Posting Date"
                        v-model:startDate="filters.startDate"
                        v-model:endDate="filters.endDate"
                    />
                </div>
                <div class="mr-4">
                    <InputDatePicker
                        lb="Departure Date"
                        v-model="departureDate"
                    />
                </div>
                <div class="flex items-end">
                    <div class="flex items-center h-10">
                        <CheckboxInput
                            id="pending-ledger"
                            v-model="showPendingLedger"
                            label="Pending Ledger Commission"
                        />
                    </div>
                </div>
                <div class="ml-4 flex items-end">
                    <div class="flex items-center h-10">
                        <CheckboxInput
                            id="display-void"
                            v-model="displayVoid"
                            label="Display Void"
                        />
                    </div>
                </div>
            </div>

            <!-- Summary Stats -->
            <div class="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 text-center">
                <DefaultCard class="bg-blue-50 dark:bg-blue-900/20">
                    <template #header>
                        <p class="text-sm font-medium text-blue-800 dark:text-blue-300">{{ $t('cashiering.cityLedgerTotal', 'City Ledger Total') }}</p>
                    </template>
                    <template #default>
                        <p class="text-xl font-bold text-blue-900 dark:text-blue-200">{{ formatCurrency(66931.00) }}</p>
                    </template>
                </DefaultCard>
                <DefaultCard class="bg-yellow-50 dark:bg-yellow-900/20">
                    <template #header>
                        <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">{{ $t('cashiering.unpaidInvoice', 'Unpaid Invoice') }}</p>
                    </template>
                    <template #default>
                        <p class="text-xl font-bold text-yellow-900 dark:text-yellow-200">{{ formatCurrency(16920.00) }}</p>
                    </template>
                </DefaultCard>
                <DefaultCard class="bg-green-50 dark:bg-green-900/20">
                    <template #header>
                        <p class="text-sm font-medium text-green-800 dark:text-green-300">{{ $t('cashiering.unassignedPayments', 'Unassigned Payments') }}</p>
                    </template>
                    <template #default>
                        <p class="text-xl font-bold text-green-900 dark:text-green-200">{{ formatCurrency(50011.00) }}</p>
                    </template>
                </DefaultCard>
                <DefaultCard class="bg-purple-50 dark:bg-purple-900/20">
                    <template #header>
                        <p class="text-sm font-medium text-purple-800 dark:text-purple-300">{{ $t('cashiering.assignedPayments', 'Assigned Payments') }}</p>
                    </template>
                    <template #default>
                        <p class="text-xl font-bold text-purple-900 dark:text-purple-200">{{ formatCurrency(0) }}</p>
                    </template>
                </DefaultCard>
            </div>

            <!-- Opening Balance -->
            <div class="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
                <DefaultCard class="text-right">
                    <template #header>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('cashiering.openingBalance', 'Opening Balance:') }}</p>
                    </template>
                    <template #default>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(0.00) }}</p>
                    </template>
                </DefaultCard>
            </div>

            <!-- Table Content -->
            <ReusableTable  :columns="columns" :data="filteredData" :actions="actions" :loading="loading"
                :selectable="true" @selection-change="handleSelectionChange" @action="handleTableAction">
                <!-- Custom cell for Description column -->
                <template #cell-description="{ item }">
                    <div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.description }}</span>
                        <p v-if="item.details" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.details }}
                        </p>
                    </div>
                </template>

                <!-- Custom cell for Credit column -->
                <template #cell-credit="{ item }">
                    <span class="text-sm"
                        :class="item.credit > 0 ? 'font-medium text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'">{{
                        formatCurrency(item.credit) }}</span>
                </template>

                <!-- Custom cell for Debit column -->
                <template #cell-debit="{ item }">
                    <span class="text-sm"
                        :class="item.debit > 0 ? 'font-medium text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'">{{
                        formatCurrency(item.debit) }}</span>
                </template>

                <!-- Custom cell for Balance column -->
                <template #cell-balance="{ item }">
                    <span class="text-sm font-medium"
                        :class="item.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">{{
                        formatCurrency(item.balance) }}</span>
                </template>
                <!-- The old table has been replaced with ReusableTable component above -->
                <!-- The old table has been completely replaced with ReusableTable component above -->

                <!-- Payment Entry Button -->
                <div class="p-4 flex justify-center space-x-2">
                    <ButtonDropdown
                        :options="[{ id: 'payment-entry', label: $t('cashiering.paymentEntry', 'Payment entry'), icon: 'CashIcon' }]"
                        buttonText="{{ $t('cashiering.paymentEntry', 'Payment entry') }}"
                        buttonClass="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        @option-selected="openPaymentEntryModal"
                    />
                    <ButtonDropdown
                        :options="[{ id: 'reset', label: $t('common.reset'), icon: 'RefreshIcon' }]"
                        buttonText="{{ $t('common.reset') }}"
                        buttonClass="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        @option-selected="resetFilters"
                    />
                </div>
            </ReusableTable>
        </div>
    </div>
    <!-- Closing Balance -->
    <div class="mt-6 flex justify-end">
        <DefaultCard class="text-right">
            <template #header>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('cashiering.closingBalance', 'Closing Balance:') }}</p>
            </template>
            <template #default>
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(closingBalance) }}</p>
            </template>
        </DefaultCard>
    </div>
</AdminLayout>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import ButtonDropdown from '../../components/common/ButtonDropdown.vue'
import SearchBar from '../../components/common/SearchBar.vue'
import DefaultCard from '../../components/common/DefaultCard.vue'
import Select from '../../components/forms/FormElements/Select.vue'
import InputDatePicker from '../../components/forms/FormElements/InputDatePicker.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import CheckboxInput from '../../components/forms/FormElements/CheckboxInput.vue'
const router = useRouter()
const { t } = useI18n()

// State
const activeTab = ref('pending')
const loading = ref(false)
const closingBalance = ref(35000)
const showFilters = ref(false)

// Filters
const filters = ref({
    startDate: '',
    endDate: '',
    user: ''
})

// Original data backup for filtering
const originalTransactions = ref([])

// Table columns
const columns = ref([
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
        details: 'Payments received from cityledger_ref1',
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
        details: 'Payments received from cityledger_ref1',
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
        description: 'Guest - Emile Simalundu, Room: 8102 #102, 208',
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
        description: 'Guest - Emile Simalundu, Room: 8102 #102',
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
        description: 'Payments received from cityledger',
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

// Methods
function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(value)
}

function handleSelectionChange(items) {
    selectedItems.value = items
    console.log('Selected items:', items)
}

function handleTableAction({ action, item }) {
    console.log(`Action ${action.name} performed on item:`, item)

    switch (action.name) {
        case 'view':
            viewDetails(item)
            break
        case 'edit':
            editTransaction(item)
            break
        case 'delete':
            deleteTransaction(item)
            break
        case 'void':
            voidTransaction(item)
            break
        case 'print':
            printReceipt(item)
            break
        case 'map':
            mapPayment(item)
            break
    }
}

function handleSearchChange(query) {
    console.log('Search query:', query)
    // Implement search functionality here
}

function viewDetails(item) {
    console.log('Viewing details for:', item)
    // Implement view details functionality
}

function editTransaction(item) {
    console.log('Editing transaction:', item)
    // Implement edit functionality
}

function deleteTransaction(item) {
    console.log('Deleting transaction:', item)
    // Implement delete functionality with confirmation
}

function voidTransaction(item) {
    console.log('Voiding transaction:', item)
    // Implement void functionality
}

function printReceipt(item) {
    console.log('Printing receipt for:', item)
    // Implement print functionality
}

function mapPayment(item) {
    console.log('Mapping payment for:', item)
    // Implement map payment functionality
}

function openNewPaymentModal() {
    router.push('/cashiering/new-payment')
}

function resetFilters() {
    filters.value = {
        startDate: '',
        endDate: '',
        user: ''
    }
    // Reset filtered data
}

// Then apply user filters
if (filters.value.startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.value.startDate))
}

if (filters.value.endDate) {
    filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.value.endDate))
}

if (filters.value.user) {
    filtered = filtered.filter(t => t.user === filters.value.user)
}


// Methods
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
}


 



const openPaymentEntryModal = () => {
    console.log('Open payment entry modal')
    // Implement payment entry modal logic
}

const exportData = () => {
    console.log('Exporting data...')
    // Implement export logic
}

const applyFilters = () => {
    console.log('Applying filters:', filters.value)
    // The computed filteredData will automatically update
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