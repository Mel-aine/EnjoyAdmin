<template>
  <!-- Print Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600/25 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
      <div class="mt-3">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ title || $t('print_document') }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
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
            <select 
              v-model="selectedTemplate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
            >
              <option v-for="template in templates" :key="template.id" :value="template">
                {{ template.name }}
              </option>
            </select>
          </div>

          <!-- Filename Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('filename') }}
            </label>
            <input 
              v-model="filename" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="$t('enter_filename')"
              :disabled="loading"
            />
          </div>

          <!-- Print Options -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('print_options') }}
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input 
                  v-model="printOptions.showHeader" 
                  type="checkbox" 
                  class="mr-2"
                  :disabled="loading"
                />
                {{ $t('show_header') }}
              </label>
              <label class="flex items-center">
                <input 
                  v-model="printOptions.showFooter" 
                  type="checkbox" 
                  class="mr-2"
                  :disabled="loading"
                />
                {{ $t('show_footer') }}
              </label>
              <label class="flex items-center">
                <input 
                  v-model="printOptions.showWatermark" 
                  type="checkbox" 
                  class="mr-2"
                  :disabled="loading"
                />
                {{ $t('show_watermark') }}
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3">
            <BasicButton 
              type="button" 
              variant="outline" 
              @click="closeModal" 
              :label="$t('cancel')"
              :disabled="loading" 
            />
            <BasicButton 
              type="submit" 
              variant="primary" 
              :label="$t('print')"
              :loading="loading" 
            />
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
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { X } from 'lucide-vue-next'
import BasicButton from '../buttons/BasicButton.vue'
import PdfExporter from './PdfExporter.vue'
import type { Template } from '../../utils/models'
import { printConfirmBookingPdf } from '../../services/foglioApi'
import PdfExporterNode from '../common/PdfExporterNode.vue'



const pdfurl=ref<string>('')
const currency = ref('xaf')

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

interface PrintOptions {
  showHeader: boolean
  showFooter: boolean
  showWatermark: boolean
}

interface Props {
  isOpen: boolean
  title?: string
  templates?: Template[]
  documentData: any
  defaultFilename?: string
  pdfTheme?: Record<string, any>,
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
const filename = ref('')

const printOptions = ref<PrintOptions>({
  showHeader: true,
  showFooter: true,
  showWatermark: false
})

// Computed properties
const currentTemplate = computed(() => {
  if (selectedTemplate.value) {
    return selectedTemplate.value
  }
  if (props.templates && props.templates.length > 0) {
    return props.templates[0]
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
watch(() => props.templates, (newTemplates) => {
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
  
  if (props.templates && props.templates.length > 0) {
    selectedTemplate.value = props.templates[0]
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
      console.log('reservationId', props.reservationId)
      console.log('currency', currency.value)
      const res =await printConfirmBookingPdf({reservationId: props.reservationId})
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
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>