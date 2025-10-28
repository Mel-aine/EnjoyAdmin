<template>
    <AdminLayout>
        <div class="bg-white dark:bg-gray-800 shadow-lg border-b border-black/30 dark:border-gray-700 p-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white me-16">{{ $t('incidental_invoices') }}</h2>

                    <!-- Search -->
                    <div class="relative flex">
                        <input v-model="searchQuery" :placeholder="$t('search_by_voucher_name_type')"
                            class="w-64 px-3 py-2 border border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-400 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-ring-primary rounded-r-none"
                            @keyup.enter="performSearch" />
                        <button @click="performSearch"
                            class="px-4 py-2 bg-white dark:bg-gray-900 text-primary rounded-r-md hover:bg-primary/25 dark:hover:bg-gray-700 transition-colors border border-l-0 border-gray-300 dark:border-gray-700">
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
        <div class="flex h-full bg-gray-50 dark:bg-gray-900">
            <!-- Left Sidebar - Invoice List -->
            <div class="w-80 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col ">
                <div class="flex-1 overflow-y-auto">

                    <!-- Invoice Table -->
                    <ReusableTable :columns="invoiceColumns" :data="filteredInvoices" :searchable="false"
                        :show-header="false" :selectable="false" :rowClass="getRowClass" class="invoice-table"
                        @row-click="onInvoiceRowClick" :loading="isLoading">
                        <!-- Custom date column -->
                        <template #column-invoice_details="{ item }" >
                            <div :class="{ 'voided-invoice-details': item.status === 'voided' }" >
                                <div class="text-sm">{{ item.invoiceNumber }}</div>

                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.guest.fullName }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(item.createdAt) }}</div>
                            </div>

                        </template>

                        <!-- Custom amount column -->
                        <template #column-totalCharges="{ item }">
                            <div :class="{ 'voided-invoice-details': item.status === 'voided' }" >
                                <div class="font-medium text-gray-900 dark:text-white text-right">{{ formatCurrency(item.amount) }}
                                </div>

                            </div>
                        </template>
                    </ReusableTable>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col">
                <!-- Invoice Details -->
                <div class="flex-1 p-0 overflow-y-auto">
                    <div v-if="selectedInvoice" class="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
                        :class="{ 'voided-invoice-details': selectedInvoice.status === 'voided' }">
                        <!-- Invoice Header -->
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedInvoice.guest.displayName }}
                                    </h3>
                                    <div class="mt-2 space-y-1">
                                        
                                        <div class="text-sm text-gray-600 dark:text-gray-300">
                                            <span class="font-medium">{{ $t('voucher_date') }}:</span> {{
                                                formatDate(selectedInvoice.createdAt) }}
                                        </div>
                                        <div class="text-sm text-gray-600 dark:text-gray-300">
                                            <span class="font-medium">{{ $t('prepared_by') }}:</span> {{
                                                selectedInvoice.creator.fullName
                                            }}
                                        </div>
                                        <div class="text-sm text-gray-600 dark:text-gray-300">
                                            <span class="font-medium">{{ $t('total_charges') }}:</span> 
                                            <span class="text-blue-500">{{
                                                formatCurrency(parseFloat(selectedInvoice.amount)) }}</span>
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
                                    <span class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-sm font-medium rounded-full">
                                        {{ $t('voided') }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Charges Section -->
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('charges') }}</h4>
                            <ReusableTable :columns="chargesColumns" :data="chargesTableData" :loading="isLoadingFolio"
                                :searchable="false" :show-header="false" :selectable="false"
                                :empty-state-title="$t('no_charges_found')"
                                :empty-state-message="$t('no_charges_available')">
                                <!-- Custom amount column -->
                                <template #column-totalAmount="{ item }">
                                    <div class="text-left font-medium text-blue-500">
                                        {{ formatCurrency(parseFloat(item.totalAmount || 0)) }}
                                    </div>
                                </template>
                            </ReusableTable>
                        </div>

                        <!-- Payments Section -->
                        <div class="p-6">
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('Payments') }}</h4>
                            <ReusableTable :columns="paymentsColumns" :data="paymentsTableData"
                                :loading="isLoadingFolio" :searchable="false" :show-header="false" :selectable="false"
                                :empty-state-title="$t('no_payments_found')"
                                :empty-state-message="$t('no_payments_available')">
                                <!-- Custom amount column -->
                                <template #column-totalAmount="{ item }">
                                    <div class="text-left font-medium text-green-600">
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
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('no_invoice_selected') }}</h3>
                            <p class="text-gray-500 dark:text-gray-400">{{ $t('select_invoice_from_sidebar') }}</p>
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

        <!-- Direct PDF Preview -->
        <div v-if="showPdfExporter">
            <PdfExporterNode 
                @close="showPdfExporter = false" 
                :is-modal-open="showPdfExporter" 
                :title="$t('printInvoice')"
                :is-generating="printLoading" 
                :pdf-url="pdfUrl" 
                :pdf-theme="pdfTheme" 
                @pdf-generated="handlePdfGenerated"
                @error="handlePdfError" 
            />
        </div>
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
import PdfExporterNode from '../../components/common/PdfExporterNode.vue'
import type { Column } from '../../utils/models'
import { getIncidentalInvoices } from '../../services/configrationApi'
import { getFolioStatement } from '../../services/foglioApi'
import { formatCurrency } from '../../utils/numericUtils'
import { generateIncidentalInvoice } from '../../services/reportsApi'

const { t } = useI18n()

// State
const selectedInvoice = ref<any>(null)
const searchQuery = ref('')
const hideVoid = ref(false)
const showAddInvoiceModal = ref(false)
const showVoidModal = ref(false)
const isLoading = ref(false)

// PDF States
const showPdfExporter = ref(false)
const printLoading = ref(false)
const pdfUrl = ref<string>('')
const pdfTheme = ref<Record<string, any>>({})

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
        key: 'particular',
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
const currentFolioData = ref<any>(null)

// Computed data for tables with serial numbers
const chargesTableData = computed(() => {
    return folioCharges.value.map((charge: any, index: number) => ({
        ...charge,
        srNo: index + 1,
        transactionNumber: charge.originalTransactionId?'-':(charge.transactionNumber || charge.reference || '-'),
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
            params.hideVoided = hideVoid.value
        }

        const response = await getIncidentalInvoices(params)
        invoices.value = response.data?.data?.data || []
        console.log('reservations', invoices.value)
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
        console.log('loadFolioStatement', response)

        // Store the complete folio data
        currentFolioData.value = response.data

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
        currentFolioData.value = null
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
        currentFolioData.value = null
    }
}

function onInvoiceRowClick(invoice: any) {
    selectInvoice(invoice)
}

function getRowClass(invoice: any) {
    let classes = selectedInvoice.value?.id === invoice.id ? 'bg-blue-50 dark:bg-gray-800 dark:text-black' : ''
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

// Print Invoice Function - MODIFIÉE
async function printInvoice() {
    // Vérification des données nécessaires
    if (!selectedInvoice.value?.id) {
        console.error('No invoice selected')
        return
    }

    if (!currentFolioData.value?.transactions || currentFolioData.value.transactions.length === 0) {
        console.error('No transactions available')
        return
    }

    try {
        printLoading.value = true
        showPdfExporter.value = true
        
        // Récupérer automatiquement tous les IDs de transactions du folio
        const transactionIds = currentFolioData.value.transactions.map((transaction: any) => transaction.id)
        
        console.log('Printing invoice with transaction IDs:', transactionIds)
        console.log('Total transactions:', transactionIds.length)
        
        // Appeler l'API pour générer le PDF avec la liste des transactionIds
        const url = await generateIncidentalInvoice(transactionIds)
        
        // S'assurer que l'URL est valide
        if (!url) {
            throw new Error('No PDF URL returned from API')
        }
        
        // Utiliser une URL absolue si nécessaire
        pdfUrl.value = url instanceof Blob
            ? URL.createObjectURL(url)
            : url   
        
        console.log('PDF URL set to:', pdfUrl.value)
        
    } catch (error) {
        console.error('Error printing invoice:', error)
        // Gérer l'erreur - peut-être afficher un message à l'utilisateur
        showPdfExporter.value = false
    } finally {
        printLoading.value = false
    }
}

// PDF Event Handlers
const handlePdfGenerated = (blob: Blob) => {
    console.log('PDF generated successfully', blob)
}

const handlePdfError = (err: any) => {
    console.error('PDF generation error:', err)
    showPdfExporter.value = false
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
    showAddInvoiceModal.value = true
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

/* Dark mode table adjustments */
.dark .invoice-table :deep(th) {
    background-color: #1f2937;
    color: #d1d5db;
}

.dark .invoice-table :deep(tbody tr:hover) {
    background-color: #1f2937;
}
</style>