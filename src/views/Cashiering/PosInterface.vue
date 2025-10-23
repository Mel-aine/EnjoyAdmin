<template>
    <AdminLayout>
        <div class="bg-white shadow-sm border-b border-gray-200 p-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <h2 class="text-xl font-bold text-gray-900 me-16">{{ $t('incidental_invoices') }}</h2>

                    <!-- Search -->
                    <div class="relative flex">
                        <input v-model="searchQuery" :placeholder="$t('search_by_voucher_name_type')"
                            class="w-64 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-ring-primary rounded-r-none"
                            @keyup.enter="performSearch" />
                        <button @click="performSearch"
                            class="px-4 py-2 bg-white text-primary rounded-r-md hover:bg-primary/25 transition-colors border border-l-0 border-gray-300">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Date Range -->
                    <InputDoubleDatePicker v-model="dateRange" allow-past-dates class="w-64" />

                    <!-- Hide Void Checkbox -->
                    <InputCheckBox v-model="hideVoid" :label="$t('hide_void')" id="hide-void" />
                </div>

                <div class="flex items-center space-x-2">
                    <BasicButton :icon="PlusIcon" :label="$t('add_new')" @click="openAddInvoiceModal"
                        variant="primary" />
                </div>
            </div>
        </div>
        <div class="flex h-full bg-gray-50">
            <!-- Left Sidebar - Invoice List -->
            <div class="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col mt-6">
                <div class="flex-1 overflow-y-auto">

                    <!-- Invoice Table -->
                    <ReusableTable :columns="invoiceColumns" :data="filteredInvoices" :searchable="false"
                        :show-header="false" :selectable="false" :rowClass="getRowClass" class="invoice-table"
                        @row-click="onInvoiceRowClick" :loading="isLoading">
                        <!-- Custom date column -->
                        <template #column-invoice_details="{ item }">
                            <div :class="{ 'voided-invoice-details': item.status === 'voided' }">
                                <div class="text-sm">{{ item.invoiceNumber }}</div>

                                <div class="text-xs text-gray-500">{{ item.guest.fullName }}</div>
                                <div class="text-xs text-gray-500">{{ formatDate(item.createdAt) }}</div>
                            </div>

                        </template>

                        <!-- Custom amount column -->
                        <template #column-totalCharges="{ item }">
                            <div :class="{ 'voided-invoice-details': item.status === 'voided' }">
                                <div class="font-medium text-gray-900 text-right">{{ formatCurrency(item.amount) }}
                                </div>

                            </div>
                        </template>
                    </ReusableTable>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col">
                <!-- Invoice Details -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <div v-if="selectedInvoice" class="bg-white rounded-lg shadow-sm border border-gray-200"
                        :class="{ 'voided-invoice-details': selectedInvoice.status === 'voided' }">
                        <!-- Invoice Header -->
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-900">{{ selectedInvoice.invoiceNumber }}
                                    </h3>
                                    <div class="mt-2 space-y-1">
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('customer') }}:</span> {{
                                                selectedInvoice.guest.displayName }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('voucher_date') }}:</span> {{
                                                formatDate(selectedInvoice.createdAt) }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('prepared_by') }}:</span> {{
                                                selectedInvoice.creator.firstName + ' ' + selectedInvoice.creator.lastName
                                            }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('total_charges') }}:</span> {{
                                                formatCurrency(parseFloat(selectedInvoice.amount)) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div v-if="selectedInvoice.status !== 'voided'" class="flex space-x-2">
                                    <BasicButton :icon="PrinterIcon" :label="$t('print')" variant="secondary"
                                        @click="printInvoice" />
                                    <BasicButton :label="$t('void')" variant="danger" @click="voidInvoice" />
                                    <BasicButton :icon="EditIcon" :label="$t('edit')" variant="primary"
                                        @click="editInvoice" />
                                </div>
                                <!-- Voided Status Indicator -->
                                <div v-else class="flex items-center space-x-2">
                                    <span class="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                        {{ $t('voided') }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Charges Section -->
                        <div class="p-6 border-b border-gray-200">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('charges') }}</h4>
                            <ReusableTable :columns="chargesColumns" :data="chargesTableData" :loading="isLoadingFolio"
                                :searchable="false" :show-header="false" :selectable="false"
                                :empty-state-title="$t('no_charges_found')"
                                :empty-state-message="$t('no_charges_available')">
                                <!-- Custom amount column -->
                                <template #column-totalAmount="{ item }">
                                    <div class="text-right font-medium">
                                        {{ formatCurrency(parseFloat(item.totalAmount || 0)) }}
                                    </div>
                                </template>
                            </ReusableTable>
                        </div>

                        <!-- Payments Section -->
                        <div class="p-6">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('Payments') }}</h4>
                            <ReusableTable :columns="paymentsColumns" :data="paymentsTableData"
                                :loading="isLoadingFolio" :searchable="false" :show-header="false" :selectable="false"
                                :empty-state-title="$t('no_payments_found')"
                                :empty-state-message="$t('no_payments_available')">
                                <!-- Custom amount column -->
                                <template #column-totalAmount="{ item }">
                                    <div class="text-right font-medium text-green-600">
                                        {{ formatCurrency(parseFloat(item.totalAmount || 0)) }}
                                    </div>
                                </template>
                            </ReusableTable>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <div class="text-gray-400 text-6xl mb-4">📄</div>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('no_invoice_selected') }}</h3>
                            <p class="text-gray-500">{{ $t('select_invoice_from_sidebar') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Invoice Modal -->
        <AddInvoiceIncidenPosc v-if="showAddInvoiceModal" @close="closeAddInvoiceModal"
            @invoice-created="handleInvoiceCreated" />

        <!-- Void Invoice Modal -->
        <VoidInvoice :is-open="showVoidModal" :invoice-id="selectedInvoice?.id"
            :invoice-number="selectedInvoice?.invoiceNumber" @close="showVoidModal = false"
            @void-confirmed="handleVoidConfirmed" />
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import InputCheckBox from '../../components/forms/FormElements/InputCheckBox.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import PlusIcon from '../../icons/PlusIcon.vue'
import { PrinterIcon, Edit as EditIcon, DollarSign, Coffee, Utensils, Car, Wifi, Phone } from 'lucide-vue-next'
import AddInvoiceIncidenPosc from './AddInvoiceIncidenPosc.vue'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import VoidInvoice from '../../components/invoice/VoidInvoice.vue'
import type { Column } from '../../utils/models'
import { getIncidentalInvoices } from '../../services/configrationApi'
import { getFolioStatement } from '../../services/foglioApi'
import { formatCurrency } from '../../utils/numericUtils'

const { t } = useI18n()

// State
const selectedInvoice = <any>ref(null)
const searchQuery = ref('')
const hideVoid = ref(false)
const showAddInvoiceModal = ref(false)
const showVoidModal = ref(false)
const isLoading = ref(false)

// Set default date range: yesterday to today
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const today = new Date()

const dateRange = ref({
    start: yesterday.toISOString().split('T')[0],
    end: today.toISOString().split('T')[0]
})

// Table configuration
const invoiceColumns = ref<Column[]>([
    {
        key: 'invoice_details',
        label: t('invoice_details'),
        type: 'custom'
    },
    {
        key: 'totalCharges',
        label: t('Amount'),
        type: 'custom'
    }
])

// Charges table columns
const chargesColumns = ref<Column[]>([
    {
        key: 'srNo',
        label: t('sr_no'),
        type: 'text'
    },
    {
        key: 'transactionNumber',
        label: t('ref_no'),
        type: 'text'
    },
    {
        key: 'description',
        label: t('particular'),
        type: 'text'
    },
    {
        key: 'notes',
        label: t('comments'),
        type: 'text'
    },
    {
        key: 'totalAmount',
        label: t('amount'),
        type: 'custom'
    }
])

// Payments table columns
const paymentsColumns = ref<Column[]>([
    {
        key: 'srNo',
        label: t('sr_no'),
        type: 'text'
    },
    {
        key: 'transactionNumber',
        label: t('ref_no'),
        type: 'text'
    },
    {
        key: 'paymentMethodName',
        label: t('type'),
        type: 'text'
    },
    {
        key: 'notes',
        label: t('comments'),
        type: 'text'
    },
    {
        key: 'totalAmount',
        label: t('amount'),
        type: 'custom'
    }
])

// Invoice data
const invoices = ref<any>([])
const filteredInvoices = computed(() => invoices.value)

// Folio statement data
const folioCharges = ref<any>([])
const folioPayments = ref<any>([])
const isLoadingFolio = ref(false)

// Computed data for tables with serial numbers
const chargesTableData = computed(() => {
    return folioCharges.value.map((charge: any, index: number) => ({
        ...charge,
        srNo: index + 1,
        transactionNumber: charge.transactionNumber || charge.reference || '-',
        description: charge.description || charge.category || '-',
        notes: charge.notes || '-'
    }))
})

const paymentsTableData = computed(() => {
    return folioPayments.value.map((payment: any, index: number) => ({
        ...payment,
        srNo: index + 1,
        transactionNumber: payment.transactionNumber || payment.reference || '-',
        paymentMethodName: payment.paymentMethod?.methodName || payment.category || payment.transactionType || '-',
        notes: payment.notes || '-'
    }))
})

// API Methods
async function loadInvoices() {
    try {
        isLoading.value = true
        const params: any = {
            dateFrom: dateRange.value.start,
            dateTo: dateRange.value.end
        }

        // Add search filter if provided (folio number matching)
        if (searchQuery.value.trim()) {
            params.folioNumber = searchQuery.value.trim()
        }

        // Add status filter if hideVoid is checked
        if (hideVoid.value) {
            params.hideVoided =  hideVoid // or whatever status excludes void invoices
        }

        const response = await getIncidentalInvoices(params)
        invoices.value = response.data?.data?.data || []
        console.log('rservation', invoices.value)
        // Clear selected invoice if it's no longer in the list
        if (selectedInvoice.value && !invoices.value.find((inv: any) => inv.id === selectedInvoice.value.id)) {
            selectedInvoice.value = null
        }
    } catch (error) {
        console.error('Error loading invoices:', error)
        invoices.value = []
    } finally {
        isLoading.value = false
    }
}

// Load folio statement data
async function loadFolioStatement(folioId: number) {
    try {
        isLoadingFolio.value = true
        const response = await getFolioStatement(folioId)
        console.log('reservation', response)

        // Extract transactions from the response
        const transactions = response.data?.transactions || []

        // Filter charges and payments
        folioCharges.value = transactions.filter((transaction: any) =>
            transaction.transactionType !== 'payment'
        )

        folioPayments.value = transactions.filter((transaction: any) =>
            transaction.transactionType === 'payment'
        )

        console.log('Folio charges:', folioCharges.value)
        console.log('Folio payments:', folioPayments.value)
    } catch (error) {
        console.error('Error loading folio statement:', error)
        folioCharges.value = []
        folioPayments.value = []
    } finally {
        isLoadingFolio.value = false
    }
}

// Methods
function selectInvoice(invoice: any) {
    selectedInvoice.value = invoice

    // Load folio statement data if folioId is available
    if (invoice?.folioId) {
        loadFolioStatement(invoice.folioId)
    } else {
        // Clear folio data if no folioId
        folioCharges.value = []
        folioPayments.value = []
    }
}

function onInvoiceRowClick(invoice: any) {

    selectInvoice(invoice)
}

function getRowClass(invoice: any) {
    let classes = selectedInvoice.value?.id === invoice.id ? 'bg-blue-50' : ''
    if (invoice.status === 'voided') {
        classes += ' voided-invoice'
    }
    return classes
}

function formatDate(dateString: any) {
    return new Date(dateString).toLocaleDateString('en-GB')
}

function performSearch() {
    loadInvoices()
}

// Watch for changes that should trigger API calls
watch([dateRange, searchQuery, hideVoid], () => {
    loadInvoices()
}, { deep: true })

function openAddInvoiceModal() {
    showAddInvoiceModal.value = true
}

function closeAddInvoiceModal() {
    showAddInvoiceModal.value = false
}

function handleInvoiceCreated(newInvoice: any) {
    closeAddInvoiceModal()
    // Reload invoices to get the latest data from API
    loadInvoices()
}

function printInvoice() {
    console.log('Printing invoice:', selectedInvoice.value)
    // Implement print functionality
}

function voidInvoice() {
    showVoidModal.value = true
}

function handleVoidConfirmed() {
    showVoidModal.value = false
    // Reload invoices to get the latest data from API
    loadInvoices()
}

function editInvoice() {
    console.log('Editing invoice:', selectedInvoice.value)
    // Implement edit functionality
}

// Lifecycle
onMounted(() => {
    loadInvoices()
})
</script>

<style scoped>
/* Voided invoice styling */
.voided-invoice {
    opacity: 0.6;
    text-decoration: line-through;
    background-color: #fef2f2 !important;
    pointer-events: none;
}

.voided-invoice-details {
    opacity: 0.7;
}

.voided-invoice-details * {
    text-decoration: line-through;
    color: #6b7280 !important;
}

.voided-invoice-details .bg-red-100 {
    text-decoration: none;
}

/* Prevent interactions on voided invoices */
.voided-invoice:hover {
    cursor: not-allowed;
}

.invoice-table :deep(.min-w-full) {
    table-layout: fixed;
}

.invoice-table :deep(th),
.invoice-table :deep(td) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
}

.invoice-table :deep(th) {
    background-color: #f9fafb;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
}

.invoice-table :deep(tbody tr:hover) {
    background-color: #f9fafb;
}

.invoice-table :deep(.bg-blue-50) {
    background-color: #eff6ff !important;
}
</style>