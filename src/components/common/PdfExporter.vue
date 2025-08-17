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
                <!-- Custom PDF Controls (Optional) -->
                
                <VuePdfApp 
                    :pdf="pdfUrl"
                    :config="pdfViewerConfig"
                    class="w-full h-full border-0"
                    @after-created="onPdfViewerCreated"
                    @pages-rendered="onPagesRendered"
                    @page-rendered="onPageRendered"
                    @error="onPdfError"
                  ></VuePdfApp>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Template HTML pour la génération PDF -->
      <div id="data" v-if="template?.component && documentData" ref="pdfContent" class="pdf-content"
        :style="{ position: 'absolute', top: isGenerating ? '0' : '-9999px', left: '0', zIndex: isGenerating ? '-1' : '-1', background: 'white', width: '210mm', minHeight: '297mm', padding: '20mm', visibility: isGenerating ? 'visible' : 'hidden' }">
        <component :is="template.component" :data="documentData" :template-config="currentTemplate" />
      </div>
    </div>
  </PdfModalPreview>
</template>

<script setup lang="ts">
/**
 * PdfExporter Component with VuePdfApp Configuration
 * 
 * This component provides a comprehensive PDF viewer and exporter with the following features:
 * 
 * VuePdfApp Configuration Options:
 * - Sidebar: Control thumbnail, outline, and attachment views
 * - Toolbar: Customize left, right, and middle toolbar sections
 * - Theme: Full CSS custom property theming support
 * - Events: Handle PDF viewer lifecycle events
 * - Controls: Optional custom control panel for enhanced interaction
 * 
 * Usage Examples:
 * 
 * Basic usage:
 * <PdfExporter :template="myTemplate" :document-data="data" />
 * 
 * With custom configuration:
 * <PdfExporter 
 *   :template="myTemplate" 
 *   :document-data="data"
 *   :pdf-viewer-config="{ sidebar: { viewThumbnail: false } }"
 *   :pdf-theme="{ '--main-color': '#ff6b6b' }"
 *   :show-controls="true"
 * />
 * 
 * @author EnjoyAdmin Team
 * @version 2.0.0
 */

import { ref, computed, onMounted, nextTick } from 'vue'
import html2pdf from 'html2pdf.js'
import { watch } from 'vue'
import PdfModalPreview from '../modal/PdfModalPreview.vue'
import VuePdfApp from "vue3-pdf-app"
import "vue3-pdf-app/dist/icons/main.css"
import fallbackPdfFile from '@/assets/livre-algebre-1.pdf'
import type { Template } from '../../utils/models'
// Types


interface PdfViewerConfig {
  sidebar?: {
    viewThumbnail?: boolean
    viewOutline?: boolean
    viewAttachments?: boolean
  }
  toolbar?: {
    toolbarViewerLeft?: {
      findbar?: boolean
      previous?: boolean
      next?: boolean
      pageNumber?: boolean
    }
    toolbarViewerRight?: {
      presentationMode?: boolean
      openFile?: boolean
      print?: boolean
      download?: boolean
      viewBookmark?: boolean
    }
    toolbarViewerMiddle?: {
      zoomOut?: boolean
      zoomIn?: boolean
      scaleSelectContainer?: boolean
    }
  }
  errorWrapper?: boolean
  loadingBar?: {
    show?: boolean
    color?: string
  }
}

interface PdfExporterProps {
  template: Template
  documentData: any
  buttonText?: string
  filename?: string
  pdfViewerConfig?: PdfViewerConfig
  pdfTheme?: Record<string, string>
  showControls?: boolean
}

// Props
const props = withDefaults(defineProps<PdfExporterProps>(), {
  buttonText: 'Exporter PDF',
  filename: 'document',
  showControls: false
})

// Reactive data
const isModalOpen = ref(true)
const isGenerating = ref(false)
const pdfUrl = ref('')
const pdfContent = ref<HTMLElement>()
const showHtml = ref(false)
const pdfCanvas = ref<HTMLCanvasElement>()
const currentPage = ref(1)
const totalPages = ref(0)
const pdfDocument = ref<any>(null)
const fallbackPdfUrl = ref(fallbackPdfFile)

// Default PDF Viewer Configuration
const defaultPdfViewerConfig = {
  sidebar: {
    viewThumbnail: true,
    viewOutline: true,
    viewAttachments: false
  },
  secondaryToolbar: {
    secondaryPresentationMode: false,
    secondaryOpenFile: false,
    secondaryPrint: true,
    secondaryDownload: true,
    secondaryViewBookmark: false,
    firstPage: true,
    lastPage: true,
    pageRotateCw: true,
    pageRotateCcw: true,
    cursorSelectTool: true,
    cursorHandTool: true,
    scrollVertical: true,
    scrollHorizontal: true,
    scrollWrapped: true,
    spreadNone: true,
    spreadOdd: true,
    spreadEven: true,
    documentProperties: true
  },
  toolbar: {
    toolbarViewerLeft: {
      findbar: true,
      previous: true,
      next: true,
      pageNumber: true
    },
    toolbarViewerRight: {
      presentationMode: false,
      openFile: false,
      print: true,
      download: true,
      viewBookmark: false
    },
    toolbarViewerMiddle: {
      zoomOut: true,
      zoomIn: true,
      scaleSelectContainer: true
    }
  },
  errorWrapper: true,
  loadingBar: {
    show: true,
    color: '#3b82f6'
  },
  // Custom print configuration
  printResolution: 150,
  printAutoRotate: true,
  printAnnotations: true
}

// Default PDF Viewer Theme
const defaultPdfTheme = {
  '--main-color': '#3b82f6',
  '--body-bg-color': '#f8fafc',
  '--progressBar-color': '#3b82f6',
  '--progressBar-bg-color': '#e2e8f0',
  '--progressBar-blend-color': '#1e40af',
  '--scrollbar-color': '#cbd5e1',
  '--scrollbar-bg-color': '#f1f5f9',
  '--toolbar-icon-bg-color': '#f8fafc',
  '--toolbar-icon-hover-bg-color': '#e2e8f0',
  '--button-hover-color': '#1e40af',
  '--toggled-btn-bg-color': '#dbeafe',
  '--toggled-hover-active-btn-color': '#1e40af',
  '--dropdown-btn-bg-color': '#ffffff',
  '--separator-color': '#e2e8f0',
  '--field-color': '#374151',
  '--field-bg-color': '#ffffff',
  '--field-border-color': '#d1d5db',
  '--findbar-nextprevious-btn-bg-color': '#f3f4f6',
  '--treeitem-color': '#374151',
  '--treeitem-hover-color': '#1f2937',
  '--treeitem-selected-color': '#1e40af',
  '--treeitem-selected-bg-color': '#dbeafe',
  '--sidebaritem-bg-color': '#f8fafc',
  '--doorhanger-bg-color': '#ffffff',
  '--doorhanger-border-color': '#e5e7eb',
  '--doorhanger-hover-color': '#f3f4f6',
  '--doorhanger-separator-color': '#e5e7eb',
  '--overlay-button-bg-color': '#ffffff',
  '--overlay-button-hover-color': '#f3f4f6'
}

// Computed
const currentTemplate = computed(() => {
  return props.template
})

// Merge user configuration with defaults
const pdfViewerConfig = computed(() => {
  if (!props.pdfViewerConfig) return defaultPdfViewerConfig
  
  return {
    ...defaultPdfViewerConfig,
    ...props.pdfViewerConfig,
    sidebar: {
      ...defaultPdfViewerConfig.sidebar,
      ...props.pdfViewerConfig.sidebar
    },
    toolbar: {
      ...defaultPdfViewerConfig.toolbar,
      ...props.pdfViewerConfig.toolbar,
      toolbarViewerLeft: {
        ...defaultPdfViewerConfig.toolbar.toolbarViewerLeft,
        ...props.pdfViewerConfig.toolbar?.toolbarViewerLeft
      },
      toolbarViewerRight: {
        ...defaultPdfViewerConfig.toolbar.toolbarViewerRight,
        ...props.pdfViewerConfig.toolbar?.toolbarViewerRight
      },
      toolbarViewerMiddle: {
        ...defaultPdfViewerConfig.toolbar.toolbarViewerMiddle,
        ...props.pdfViewerConfig.toolbar?.toolbarViewerMiddle
      }
    },
    loadingBar: {
      ...defaultPdfViewerConfig.loadingBar,
      ...props.pdfViewerConfig.loadingBar
    }
  }
})

// Merge user theme with defaults
const pdfTheme = computed(() => {
  return {
    ...defaultPdfTheme,
    ...props.pdfTheme
  }
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

  // Wait for Vue to render the component and make it visible
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 500))

  try {
    // Configuration optimisée pour éviter le PDF noir
    const options = {
      margin: 0.5,
      filename: `${props.filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: pdfContent.value?.offsetWidth,
        height: pdfContent.value?.offsetHeight
      },
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
    if (!pdfBlob || (pdfBlob instanceof Blob && pdfBlob.size === 0)) {
      throw new Error('PDF blob is empty or invalid')
    }

    // Créer une URL pour le blob
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }

    pdfUrl.value = URL.createObjectURL(pdfBlob as Blob)



  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error)
  } finally {
    isGenerating.value = false
  }
}

// PDF Viewer Event Handlers
const onPdfViewerCreated = (pdfApp: any) => {
  console.log('📄 PDF Viewer créé:', pdfApp)
  pdfDocument.value = pdfApp
}

const onPagesRendered = (pages: any) => {
  console.log('📄 Pages rendues:', pages)
  totalPages.value = pages.pagesCount || 0
}

const onPageRendered = (page: any) => {
  console.log('📄 Page rendue:', page.pageNumber)
  currentPage.value = page.pageNumber
}

const onPdfError = (error: any) => {
  console.error('❌ Erreur PDF Viewer:', error)
  // Optionally show user-friendly error message
}

// PDF Viewer Control Methods
const goToPage = (pageNumber: number) => {
  if (pdfDocument.value && pageNumber >= 1 && pageNumber <= totalPages.value) {
    pdfDocument.value.pdfViewer.currentPageNumber = pageNumber
    currentPage.value = pageNumber
  }
}

const zoomIn = () => {
  if (pdfDocument.value) {
    pdfDocument.value.pdfViewer.increaseScale()
  }
}

const zoomOut = () => {
  if (pdfDocument.value) {
    pdfDocument.value.pdfViewer.decreaseScale()
  }
}

const resetZoom = () => {
  if (pdfDocument.value) {
    pdfDocument.value.pdfViewer.currentScale = 1.0
  }
}

const toggleSidebar = () => {
  if (pdfDocument.value) {
    pdfDocument.value.pdfSidebar.toggle()
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
  background-color: #3b82f6;
  min-height: 100%;
}

.pdf-viewer-container.with-controls {
  height: calc(100% - 60px); /* Adjust for controls height */
}

.pdf-viewer-container canvas {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  margin-bottom: 10px;
}

/* PDF Controls Styles */
.pdf-controls {
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
}

.pdf-controls button {
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.pdf-controls button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pdf-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.pdf-controls button:active:not(:disabled) {
  transform: translateY(0);
}

/* Custom PDF Viewer Theme Overrides */
:deep(.vue-pdf-app) {
  --main-color: var(--pdf-main-color, #3b82f6);
  --body-bg-color: var(--pdf-body-bg-color, #f8fafc);
  --progressBar-color: var(--pdf-progressbar-color, #3b82f6);
}

/* Print Styles for VuePdfApp */
@media print {
  :deep(.vue-pdf-app) {
    width: 100% !important;
    height: auto !important;
    background: white !important;
  }
  
  :deep(.vue-pdf-app .toolbar) {
    display: none !important;
  }
  
  :deep(.vue-pdf-app .sidebar) {
    display: none !important;
  }
  
  :deep(.vue-pdf-app .viewer) {
    width: 100% !important;
    height: auto !important;
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  :deep(.vue-pdf-app .page) {
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
    page-break-after: always;
  }
  
  :deep(.vue-pdf-app .page:last-child) {
    page-break-after: avoid;
  }
  
  :deep(.vue-pdf-app canvas) {
    width: 100% !important;
    height: auto !important;
    max-width: none !important;
  }
  
  /* Hide all UI elements during print */
  .pdf-controls {
    display: none !important;
  }
  
  .pdf-viewer-container {
    background: white !important;
    padding: 0 !important;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pdf-controls {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
  }
  
  .pdf-controls > div {
    justify-content: center;
  }
  
  .pdf-viewer-container.with-controls {
    height: calc(100% - 120px); /* Adjust for mobile controls height */
  }
}
</style>