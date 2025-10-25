<template>
  <PdfModalPreview :title="title" :is-open="isModalOpen" @close="closeModal">
   <div
        class="inline-block align-bottom bg-white h-full text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-6xl sm:w-full">
        <!-- Contenu principal -->
         <div class="flex space-x-4 h-full">
            <!-- Zone de prévisualisation PDF -->
            <div class="flex-1 h-full">
              <div v-if="isGenerating" class="flex items-center justify-center h-full bg-gray-100">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p class="text-gray-600">Génération du PDF...</p>
                </div>
              </div>
              <div v-else-if="pdfUrl" class="h-full overflow-hidden">
                <!-- Custom PDF Controls (Optional) -->
                <VuePdfApp
                  :pdf="pdfUrl"
                  :config="mergedPdfViewerConfig"
                  @after-created="onPdfViewerCreated"
                  @pages-rendered="onPagesRendered"
                  @page-rendered="onPageRendered"
                  @error="onPdfError"
                ></VuePdfApp>
              </div>
            </div>
          </div>
      </div>

    <!-- Iframe caché pour l'impression -->
    <iframe
      ref="printIframe"
      style="display: none;"
      :src="pdfUrl"
    ></iframe>
  </PdfModalPreview>
</template>

<script setup lang="ts">
/**
 * PdfExporter Component with VuePdfApp Configuration
 * Enhanced with advanced printing system
 *
 * This component provides a comprehensive PDF viewer and exporter with the following features:
 *
 * VuePdfApp Configuration Options:
 * - Sidebar: Control thumbnail, outline, and attachment views
 * - Toolbar: Customize left, right, and middle toolbar sections
 * - Theme: Full CSS custom property theming support
 * - Events: Handle PDF viewer lifecycle events
 * - Advanced Printing: Custom print handling with blob management
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
 * @version 2.1.0
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import PdfModalPreview from '../modal/PdfModalPreview.vue'
import VuePdfApp from "vue3-pdf-app"
import "vue3-pdf-app/dist/icons/main.css"



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
  pdfUrl: string
  filename?: string
  pdfViewerConfig?: PdfViewerConfig
  pdfTheme?: Record<string, string>
  showControls?: boolean
  isGenerating: boolean
  isModalOpen: boolean
  title?: string
}

// Props
const props = withDefaults(defineProps<PdfExporterProps>(), {
  buttonText: 'Exporter PDF',
  filename: 'document',
  showControls: false,
})

const emit = defineEmits(['close'])

// Reactive data
const currentPage = ref(1)
const totalPages = ref(0)
const pdfDocument = ref<any>(null)
const printIframe = ref<HTMLIFrameElement | null>(null)
const pdfBlob = ref<Blob | null>(null)

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
  printResolution: 300,
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

// Configuration avec interception d'impression personnalisée
const mergedPdfViewerConfig = computed(() => {
  return {
    ...pdfViewerConfig.value,
    // Désactive l'impression par défaut pour utiliser notre système
    disableDefaultPrint: true
  }
})

const closeModal = () => {
  emit('close')
}

// Merge user theme with defaults
const pdfTheme = computed(() => {
  return {
    ...defaultPdfTheme,
    ...props.pdfTheme
  }
})

// 🖨️ SYSTÈME D'IMPRESSION AVANCÉ
// ===============================

/**
 * Charge le blob PDF depuis l'URL
 */
const loadPdfBlob = async (): Promise<void> => {
  if (!props.pdfUrl) return

  try {
    console.log('📥 Chargement du blob PDF depuis l URL...')
    const response = await fetch(props.pdfUrl)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    pdfBlob.value = await response.blob()
    console.log('✅ Blob PDF chargé:', pdfBlob.value.size, 'bytes')
  } catch (error) {
    console.error('❌ Erreur lors du chargement du blob PDF:', error)
    throw error
  }
}

/**
 * Impression optimisée avec gestion des timeouts adaptatifs
 */
const printPdfBlob = async (): Promise<void> => {
  try {
    // Charge le blob si pas déjà fait
    if (!pdfBlob.value) {
      await loadPdfBlob()
    }

    if (!pdfBlob.value) {
      throw new Error('Aucun blob PDF disponible pour l impression')
    }

    console.log('🖨️ Début de l impression PDF...')
    
    // Crée une URL blob temporaire
    const blobUrl = URL.createObjectURL(pdfBlob.value)
    
    // Méthode principale : impression via iframe
    if (printIframe.value) {
      await printViaIframe(blobUrl)
    } else {
      // Fallback : impression via nouvelle fenêtre
      await printViaNewWindow(blobUrl)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l impression PDF:', error)
    // Fallback ultime : impression directe de l'URL
    await ultimatePrintFallback()
  }
}

/**
 * Impression via iframe avec gestion de timeout intelligent
 */
const printViaIframe = (blobUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!printIframe.value) {
      reject(new Error('Iframe d impression non disponible'))
      return
    }

    const timeoutMs = calculatePrintTimeout(pdfBlob.value?.size || 0)
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout d impression dépassé (${timeoutMs}ms)`))
    }, timeoutMs)

    printIframe.value.onload = () => {
      clearTimeout(timeoutId)
      
      // Délai supplémentaire pour s'assurer du chargement complet
      setTimeout(() => {
        try {
          printIframe.value?.contentWindow?.print()
          
          // Nettoyage après impression
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl)
            resolve()
          }, 1000)
          
        } catch (error) {
          URL.revokeObjectURL(blobUrl)
          reject(error)
        }
      }, 500)
    }

    printIframe.value.src = blobUrl
  })
}

/**
 * Impression via nouvelle fenêtre (fallback)
 */
const printViaNewWindow = (blobUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const printWindow = window.open(blobUrl, '_blank')
    
    if (!printWindow) {
      URL.revokeObjectURL(blobUrl)
      reject(new Error('Impossible d ouvrir la fenêtre d impression. Autorisez les pop-ups.'))
      return
    }

    printWindow.onload = () => {
      setTimeout(() => {
        try {
          printWindow.print()
          
          // Nettoyage après impression
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl)
            printWindow.close()
            resolve()
          }, 1000)
          
        } catch (error) {
          URL.revokeObjectURL(blobUrl)
          printWindow.close()
          reject(error)
        }
      }, 1000)
    }
  })
}

/**
 * Fallback ultime - impression directe
 */
const ultimatePrintFallback = (): void => {
  if (!props.pdfUrl) return
  
  const printWindow = window.open(props.pdfUrl, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  } else {
    alert('Veuillez autoriser les pop-ups pour imprimer le PDF.')
  }
}

/**
 * Calcule un timeout adaptatif basé sur la taille du PDF
 */
const calculatePrintTimeout = (fileSize: number): number => {
  const baseTimeout = 30000 // 30 secondes de base
  const sizeInMB = fileSize / (1024 * 1024)
  const additionalTime = sizeInMB * 2000 // 2 secondes supplémentaires par MB
  
  return Math.min(baseTimeout + additionalTime, 120000) // Max 2 minutes
}

/**
 * Interception des raccourcis clavier (Ctrl+P / Cmd+P)
 */
const handlePrintShortcut = (e: KeyboardEvent): void => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault()
    e.stopPropagation()
    printPdfBlob()
  }
}

/**
 * Interception des clics sur le bouton d'impression du viewer PDF
 */
const interceptPdfViewerPrint = (): (() => void) => {
  const interceptClick = (e: Event) => {
    const target = e.target as HTMLElement
    
    // Sélecteurs pour détecter le bouton d'impression
    const printSelectors = [
      '#print',
      '.print',
      '[title*="print" i]',
      '[title*="imprimer" i]',
      'button[data-l10n-id="print"]',
      'button:has(> svg use[href*="print"])'
    ]
    
    const isPrintButton = printSelectors.some(selector => 
      target.matches?.(selector) || target.closest?.(selector)
    )
    
    if (isPrintButton) {
      e.preventDefault()
      e.stopPropagation()
      console.log('🖨️ Bouton d impression intercepté dans le viewer PDF')
      printPdfBlob()
    }
  }

  document.addEventListener('click', interceptClick, true)
  return () => document.removeEventListener('click', interceptClick, true)
}

// PDF Viewer Event Handlers
const onPdfViewerCreated = async (pdfApp: any) => {
  console.log('📄 PDF Viewer créé:', pdfApp)
  pdfDocument.value = pdfApp
  
  // Charge le blob dès que le viewer est créé
  try {
    await loadPdfBlob()
  } catch (error) {
    console.warn('⚠️ Impossible de précharger le blob PDF:', error)
  }
  
  // Tente de remplacer la fonction d'impression interne
  try {
    if (pdfApp && pdfApp.pdfViewer && typeof pdfApp.pdfViewer.print === 'function') {
      const originalPrint = pdfApp.pdfViewer.print
      pdfApp.pdfViewer.print = () => {
        console.log('🖨️ Fonction d impression interne interceptée')
        printPdfBlob()
      }
      console.log('✅ Fonction d impression du viewer remplacée')
    }
  } catch (error) {
    console.warn('⚠️ Impossible de remplacer la fonction d impression interne:', error)
  }
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
}

// Gestion du cycle de vie
let cleanupIntercept: (() => void) | null = null

onMounted(() => {
  // Écoute les raccourcis clavier
  window.addEventListener('keydown', handlePrintShortcut)
  
  // Intercepte les clics sur le bouton d'impression
  cleanupIntercept = interceptPdfViewerPrint()
  
  console.log('✅ Système d impression avancé initialisé')
})

onUnmounted(() => {
  // Nettoyage
  window.removeEventListener('keydown', handlePrintShortcut)
  cleanupIntercept?.()
  
  // Nettoie les URLs blob
  if (pdfBlob.value) {
    const blobUrl = URL.createObjectURL(pdfBlob.value)
    URL.revokeObjectURL(blobUrl)
  }
  
  console.log('🧹 Système d impression nettoyé')
})

// Exposition des méthodes au composant parent
defineExpose({
  printPdf: printPdfBlob,
  currentPage,
  totalPages,
  pdfBlob
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