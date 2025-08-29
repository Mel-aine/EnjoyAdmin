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
                    <InputDoubleDatePicker v-model:startDate="dateRange.start" v-model:endDate="dateRange.end"
                        class="w-64" :defaultToToday="true" />

                    <!-- Hide Void Checkbox -->
                    <InputCheckBox v-model="hideVoid" :label="$t('hide_void')" id="hide-void" />
                </div>

                <div class="flex items-center space-x-2">
                    <BasicButton :icon="PlusIcon" :label="$t('add_new')" @click="openAddInvoiceModal"
                        variant="primary" />
                </div>
            </div>
        </div>
        <div class="flex h-screen bg-gray-50">
            <!-- Left Sidebar - Invoice List -->
            <div class="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col mt-6">
                <div class="flex-1 overflow-y-auto">
                    <ReusableTable
                        :columns="invoiceColumns"
                        :data="filteredInvoices"
                        :searchable="false"
                        :show-header="false"
                        :selectable="false"
                        :rowClass="getRowClass"
                        class="invoice-table"
                        @row-click="onInvoiceRowClick"
                    >
                        <!-- Custom date column -->
                        <template #column-invoice_details="{ item }">
                                                         <div class="text-sm">{{ item.invoiceNumber }}</div>

                             <div class="text-xs text-gray-500">{{ item.customerName }}</div>
                            <div class="text-xs text-gray-500">{{ formatDate(item.date) }}</div>
                        </template>
                        
                        <!-- Custom amount column -->
                        <template #column-totalCharges="{ item }">
                            <div class="font-medium text-gray-900 text-right">Rs {{ item.totalCharges.toFixed(2) }}</div>
                        </template>
                    </ReusableTable>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col">
                <!-- Invoice Details -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <div v-if="selectedInvoice" class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <!-- Invoice Header -->
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-900">{{ selectedInvoice.invoiceNumber }}
                                    </h3>
                                    <div class="mt-2 space-y-1">
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('customer') }}:</span> {{
                                                selectedInvoice.customerName }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('voucher_date') }}:</span> {{
                                                formatDate(selectedInvoice.date) }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('prepared_by') }}:</span> {{
                                                selectedInvoice.preparedBy }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <span class="font-medium">{{ $t('total_charges') }}:</span> Rs {{
                                                selectedInvoice.totalCharges.toFixed(2) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex space-x-2">
                                    <BasicButton :icon="PrinterIcon" :label="$t('print')" variant="secondary"
                                        @click="printInvoice" />
                                    <BasicButton :label="$t('void')" variant="danger" @click="voidInvoice" />
                                    <BasicButton :icon="EditIcon" :label="$t('edit')" variant="primary"
                                        @click="editInvoice" />
                                </div>
                            </div>
                        </div>

                        <!-- Charges Section -->
                        <div class="p-6 border-b border-gray-200">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('charges') }}</h4>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('sr_no') }}</th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('ref_no') }}</th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('particular') }}</th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('comments') }}</th>
                                            <th
                                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('amount_rs') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="charge in selectedInvoice.charges" :key="charge.id">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ charge.srNo
                                            }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                                charge.refNo }}</td>
                                          
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                                                charge.comments }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                                Rs {{ charge.amount.toFixed(2) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Payments Section -->
                        <div class="p-6">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('payments') }}</h4>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('sr_no') }}</th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('ref_no') }}</th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('type') }}</th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('comments') }}</th>
                                            <th
                                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {{ $t('amount_rs') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="payment in selectedInvoice.payments" :key="payment.id">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                                payment.srNo }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                                payment.refNo }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                                payment.type }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                                                payment.comments }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">-{{
                                                payment.amount.toFixed(2) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import Input from '../../components/forms/FormElements/Input.vue'
import InputDoubleDatePicker from '../../components/forms/FormElements/InputDoubleDatePicker.vue'
import InputCheckBox from '../../components/forms/FormElements/InputCheckBox.vue'
import BasicButton from '../../components/buttons/BasicButton.vue'
import PlusIcon from '../../icons/PlusIcon.vue'
import { PrinterIcon, Edit as EditIcon, DollarSign, Coffee, Utensils, Car, Wifi, Phone } from 'lucide-vue-next'
import AddInvoiceIncidenPosc from './AddInvoiceIncidenPosc.vue'
import ReusableTable from '../../components/tables/ReusableTable.vue'
import type { Column } from '../../utils/models'

const { t } = useI18n()

// State
const selectedInvoice = <any>ref(null)
const searchQuery = ref('')
const hideVoid = ref(false)
const showAddInvoiceModal = ref(false)
const dateRange = ref({
    start: '',
    end: ''
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

// Sample invoice data
const invoices = ref<any>([])

// Methods
function selectInvoice(invoice:any) {
    selectedInvoice.value = invoice
}

function onInvoiceRowClick(invoice:any) {
    selectInvoice(invoice)
}

function getRowClass(invoice:any) {
    return selectedInvoice.value?.id === invoice.id ? 'bg-blue-50' : ''
}

function formatDate(dateString:any) {
    return new Date(dateString).toLocaleDateString('en-GB')
}

const filteredInvoices = ref(invoices.value)

function performSearch() {
    if (!searchQuery.value.trim()) {
        filteredInvoices.value = invoices.value
        return
    }

    const query = searchQuery.value.toLowerCase().trim()
    filteredInvoices.value = invoices.value.filter((invoice:any) =>
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.customerName.toLowerCase().includes(query)
    )
}

// Watch for search query changes
watch(searchQuery, () => {
    performSearch()
})

function openAddInvoiceModal() {
    showAddInvoiceModal.value = true
}

function closeAddInvoiceModal() {
    showAddInvoiceModal.value = false
}

function handleInvoiceCreated(newInvoice:any) {
    invoices.value.unshift(newInvoice)
    selectedInvoice.value = newInvoice
    closeAddInvoiceModal()
}

function printInvoice() {
    console.log('Printing invoice:', selectedInvoice.value)
    // Implement print functionality
}

function voidInvoice() {
    console.log('Voiding invoice:', selectedInvoice.value)
    // Implement void functionality
}

function editInvoice() {
    console.log('Editing invoice:', selectedInvoice.value)
    // Implement edit functionality
}

// Lifecycle
onMounted(() => {
   
})
</script>

<style scoped>
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