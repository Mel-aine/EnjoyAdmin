<template>

  <PdfModalPreview :title="template.name" :is-open="isModalOpen" @close="closeModal">
    <div>
      <!-- Modal de prévisualisation -->
      <div
        class="inline-block align-bottom bg-white h-full text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle sm:max-w-6xl sm:w-full">
        <!-- Contenu principal -->
        <div>
          <div class="flex space-x-4">
            <!-- Zone de prévisualisation PDF -->
            <div class="flex-1">
              <div v-if="isGenerating" class="flex items-center justify-center h-screen bg-gray-100 rounded-lg">
                <div class="text-center">
                  <div class="animate-spin  rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p class="text-gray-600">Génération du PDF...</p>
                </div>
              </div>
              <div v-else-if="pdfUrl" class="h-screen overflow-hidden">
                <div class="pdf-viewer-container">
                  <canvas ref="pdfCanvas" class="w-full border"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Template HTML pour la génération PDF -->
      <div id="data" v-if="template?.component && documentData" ref="pdfContent" class="pdf-content" style="position: absolute; top: -9999px; left: 0;">
        <component 
          :is="template.component" 
          :data="documentData" 
          :template-config="currentTemplate" 
        />
      </div>
    </div>
  </PdfModalPreview>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import html2pdf from 'html2pdf.js'
import * as pdfjsLib from 'pdfjs-dist'
import { watch } from 'vue'
import PdfModalPreview from '../modal/PdfModalPreview.vue'

// Configure PDF.js worker
//pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Types
interface Template {
  id: string
  name: string
  description: string
  component: any
  options?: any
}

interface PdfExporterProps {
  template: Template
  documentData: any
  buttonText?: string
  filename?: string
}

// Props
const props = withDefaults(defineProps<PdfExporterProps>(), {
  buttonText: 'Exporter PDF',
  filename: 'document'
})

// Reactive data
const isModalOpen = ref(false)
const isGenerating = ref(false)
const pdfUrl = ref('')
const pdfContent = ref<HTMLElement>()
const showHtml = ref(false)
const pdfCanvas = ref<HTMLCanvasElement>()
const currentPage = ref(1)
const totalPages = ref(0)
const pdfDocument = ref<any>(null)

// Computed
const currentTemplate = computed(() => {
  return props.template
})


watch(() => pdfContent.value, (val) => {
  generatePreview();
})
const closeModal = () => {
  isModalOpen.value = false
  pdfUrl.value = ''
}

const generatePreview = async () => {
  if (!pdfContent.value) {
    return
  }
  
  if (!currentTemplate.value) {
    return
  }
  
  isGenerating.value = true

  // Wait a bit for Vue to render the component
  await new Promise(resolve => setTimeout(resolve, 500))
  
  try {
    // Configuration similaire à HotelInvoice.vue
    const options = {
      margin: 0.5,
      filename: `${props.filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    // Fusionner avec les options du template si elles existent
    const finalOptions = { ...options, ...currentTemplate.value.options }
    
  
    
    // Utiliser la même approche que HotelInvoice.vue avec outputPdf('blob')
    const pdfBlob = await html2pdf()
      .set(finalOptions)
      .from(pdfContent.value)
      .outputPdf('blob')
    
    // Vérifier si le blob est valide
    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('PDF blob is empty or invalid')
    }
  
    // Créer une URL pour le blob
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }
    
    pdfUrl.value = URL.createObjectURL(pdfBlob)
    
    // Load the PDF document for viewing
    await loadPdfDocument(pdfUrl.value)

  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error)
  } finally {
    isGenerating.value = false
  }
}

/**
 * Converts a Blob object to a Base64 string.
 * @param {Blob} blob The Blob object to convert.
 * @returns {Promise<string>} A Promise that resolves with the Base64 string.
 */
function blobToBase64(blob:Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // The result property contains the data as a URL representing the file's data as a base64 encoded string.
      // It will look like "data:mime/type;base64,..."
      resolve(reader.result);
    };
    reader.onerror = error => {
      reject(error);
    };
    // Read the blob as a Data URL (Base64 encoded string)
    reader.readAsDataURL(blob);
  });
}


const loadPdfDocument = async (url: string) => {
  try {
    const loadingTask = pdfjsLib.getDocument(url)
    pdfDocument.value = await loadingTask.promise
    totalPages.value = pdfDocument.value.numPages
    currentPage.value = 1
    
    await nextTick()
  } catch (error) {
    console.error('Error loading PDF document:', error)
  }
}



const downloadPdf = () => {
  if (!pdfUrl.value) return
  
  const link = document.createElement('a')
  link.href = pdfUrl.value
  link.download = `${props.filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const printPdf = () => {
  if (!pdfUrl.value) return
  
  const printWindow = window.open(pdfUrl.value, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

// Cleanup
onMounted(() => {
  return () => {
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }
  }
})
</script>

<style scoped>
/* Styles pour éviter les coupures de page */
.pdf-content :deep(.page-break-avoid) {
  page-break-inside: avoid;
  break-inside: avoid;
}

.pdf-content :deep(.page-break-before) {
  page-break-before: always;
  break-before: page;
}

.pdf-content :deep(.page-break-after) {
  page-break-after: always;
  break-after: page;
}

/* Styles pour les tableaux */
.pdf-content :deep(table) {
  page-break-inside: avoid;
  break-inside: avoid;
}

.pdf-content :deep(tr) {
  page-break-inside: avoid;
  break-inside: avoid;
}

.pdf-content :deep(.no-break) {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* PDF Viewer Styles */
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100%;
}

.pdf-viewer-container canvas {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  margin-bottom: 10px;
}
</style>