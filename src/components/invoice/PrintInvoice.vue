<template>
    <!-- Print Modal -->
    <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/50">
        <div
            class="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <div class="mt-3">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {{ title || $t('print_document') }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Print Options Form -->
                <form @submit.prevent="handlePrint" class="mb-6">
                    <!-- Template Selection -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ $t('select_template') }}
                        </label>
                        <select v-model="selectedTemplate"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                            :disabled="loading">
                            <option v-for="template in templates" :key="template.id" :value="template">
                                {{ template.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Folio -->
                    <div class="mb-4">
                        <InputFolioSelect :title="$t('folio')" v-model="folio"
                          :reservation-id="reservationId" :is-required="true" />
                    </div>
                    <!-- Currency -->
                    <div>
                        <Select v-model="currency" :options="currencyOptions" :lb="$t('Currency')"
                            :is-loading="isLoadingCurrencies" />
                    </div>
                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3 mt-8">
                        <BasicButton type="button" variant="outline" @click="closeModal" :label="$t('cancel')"
                            :disabled="loading" />
                        <BasicButton type="submit" variant="primary" :icon="Printer" :label="$t('print')" :loading="loading" />
                    </div>
                </form>

                <!-- PDF Exporter Component -->
                <div v-if="showPdfExporter">
                    <PdfExporterNode @close="showPdfExporter=false" :is-modal-open="showPdfExporter" :is-generating="loading" :pdf-url="pdfurl" :pdf-theme="pdfTheme" @pdf-generated="handlePdfGenerated"
                        @error="handlePdfError" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { Printer, X } from 'lucide-vue-next'
import type { Template } from '../../utils/models'
import { getReservationFolios, printFolioPdf } from '../../services/foglioApi'
import { getCurrencies } from '../../services/configrationApi'
import PdfExporter from '../common/PdfExporter.vue'
import Select from '../forms/FormElements/Select.vue'
import InputFolioSelect from '../reservations/foglio/InputFolioSelect.vue'
import BasicButton from '../buttons/BasicButton.vue'
const Invoicehotel = defineAsyncComponent(() => import('./Invoicehotel.vue'))
import PdfExporterNode from '../common/PdfExporterNode.vue'

interface PrintTemplate {
    id: string
    name: string
    description?: string
    component: any
    options?: {
        margin?: number[]
        jsPDF?: {
            format?: string
            orientation?: 'portrait' | 'landscape'
        }
        pagebreak?: {
            mode?: string[]
        }
    }
}
const folio = ref('');
const currency = ref('xaf');
interface PrintOptions {
    showHeader: boolean
    showFooter: boolean
    showWatermark: boolean
}

const pdfurl=ref<string>('')
interface Props {
    isOpen: boolean
    title?: string
    documentData: any
    defaultFilename?: string
    pdfTheme?: Record<string, any>
    reservationId: number
}

interface Emits {
    (e: 'close'): void
    (e: 'print-started', data: { template: Template; filename: string; options: PrintOptions }): void
    (e: 'print-completed', data: { template: Template; filename: string; blob?: Blob }): void
    (e: 'print-error', error: any): void
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    title: '',
    defaultFilename: 'document'
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const showPdfExporter = ref(false)
const selectedTemplate = ref<Template | null>(null)
const filename = ref('Default invoice template')

const printOptions = ref<PrintOptions>({
    showHeader: true,
    showFooter: true,
    showWatermark: false
})
const templates =ref<Template[]>([
    {
        component: Invoicehotel,
        id: '1',
        name: 'Invoice',
        description: 'Default invoice template',
        type: 'invoice',
    }
])

// Computed properties
const currentTemplate = computed(() => {
    if (selectedTemplate.value) {
        return selectedTemplate.value
    }
    if (templates.value && templates.value.length > 0) {
        return templates.value[0]
    }
    return null
})

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        resetForm()
    } else {
        showPdfExporter.value = false
    }
})

// Watch for templates change
watch(() =>templates.value, (newTemplates) => {
    if (newTemplates && newTemplates.length > 0) {
        selectedTemplate.value = newTemplates[0]
    }
}, { immediate: true })

const resetForm = () => {
    filename.value = props.defaultFilename || 'document'
    printOptions.value = {
        showHeader: true,
        showFooter: true,
        showWatermark: false
    }
    showPdfExporter.value = false
    loading.value = false

    if (templates.value && templates.value.length > 0) {
        selectedTemplate.value = templates.value[0]
    }
}

const closeModal = () => {
    emit('close')
}

const handlePrint = async () => {
    try {
        loading.value = true

        // Validate form
        if (!currentTemplate.value) {
            toast.error(t('please_select_template'))
            return
        }

        if (!filename.value.trim()) {
            toast.error(t('please_enter_filename'))
            return
        }

        // Emit print started event
        emit('print-started', {
            template: currentTemplate.value,
            filename: filename.value,
            options: printOptions.value
        })
        // Show PDF exporter
        showPdfExporter.value = true
        console.log('data.send:',folio.value,props.reservationId,currency.value)
        const res =await printFolioPdf({folioId: Number(folio.value),reservationId: props.reservationId,currencyId: Number(currency.value)})
        console.log(res)
        pdfurl.value = window.URL.createObjectURL(res)
        console.log(pdfurl.value)

       

        toast.success(t('print_initiated'))
    } catch (error) {
        console.error('Error initiating print:', error)
        toast.error(t('error_initiating_print'))
        emit('print-error', error)
    } finally {
        loading.value = false
    }
}

const handlePdfGenerated = (blob: Blob) => {
    emit('print-completed', {
        template: currentTemplate.value!,
        filename: filename.value,
        blob
    })
    toast.success(t('pdf_generated_successfully'))
}

const handlePdfError = (error: any) => {
    console.error('PDF generation error:', error)
    toast.error(t('error_generating_pdf'))
    emit('print-error', error)
}

// Options for dropdowns
const folioOptions = ref([
    { value: '', label: '-Select-' }
])
const isLoadingFolios = ref(false);
const isLoadingCurrencies = ref(false)
// Fetch currencies from API
const currencyOptions = ref([])
const fetchCurrencies = async () => {
    isLoadingCurrencies.value = true;
    try {
        const response = await getCurrencies()
        currencyOptions.value = currencyOptions.value.concat((response.data.data || []).map((currency: any) => {
            return { ...currency, label: `${currency.name} (${currency.symbol})`, value: currency.code }
        }))
    } catch (error) {
        console.error('Error fetching currencies:', error)
    } finally {
        isLoadingCurrencies.value = false
    }
}
// Fetch folios from API
const fetchFolios = async () => {
    try {
        isLoadingFolios.value = true
        const response = await getReservationFolios(props.reservationId)
        folioOptions.value = folioOptions.value.concat((response.data || [])?.map((folio: any) => {
            const guestName = folio.guest_name || `${folio.first_name || ''} ${folio.last_name || ''}`.trim() || 'Guest'
            return { ...folio, label: `${folio.id} - ${guestName}`, value: folio.id }
        }))
    } catch (error) {
        console.error('Error fetching folios:', error)
    } finally {
        isLoadingFolios.value = false
    }
}
fetchFolios();
fetchCurrencies();
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Focus styles for better accessibility */
input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state styles */
.error {
    border-color: #ef4444;
}

.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Print options styling */
.space-y-2>*+* {
    margin-top: 0.5rem;
}
</style>