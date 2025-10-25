<template>
  <div class="enjoy-pdf-view">
    <!-- Loading State -->
    <div v-if="isGenerating" class="flex items-center justify-center h-screen bg-gray-100 rounded-lg">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading PDF...</p>
      </div>
    </div>

    <!-- PDF Viewer -->
    <div v-else-if="pdfUrl" class="h-full overflow-hidden">
      <VuePdfApp 
        :pdf="pdfUrl"
        :config="mergedPdfViewerConfig"
        class=""
        @after-created="onPdfViewerCreated"
        @pages-rendered="onPagesRendered"
        @page-rendered="onPageRendered"
        @error="onPdfError"
      ></VuePdfApp>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center h-screen bg-gray-100 rounded-lg">
      <div class="text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <p class="text-gray-600">No PDF to display</p>
      </div>
    </div>

    <!-- Hidden iframe for blob printing - REUTILISATION de l'URL existante -->
    <iframe
      ref="printIframe"
      style="display: none;"
      :src="pdfUrl" 
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import VuePdfApp from "vue3-pdf-app"
import "vue3-pdf-app/dist/icons/main.css"

// Types (inchangés)
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

interface EnjoyPDFViewProps {
  pdfUrl?: string
  isGenerating?: boolean
  pdfViewerConfig?: PdfViewerConfig
  pdfTheme?: Record<string, string>
}

// Props
const props = withDefaults(defineProps<EnjoyPDFViewProps>(), {
  isGenerating: false
})

// Reactive data
const currentPage = ref(1)
const totalPages = ref(0)
const pdfDocument = ref<any>(null)
const printIframe = ref<HTMLIFrameElement | null>(null)

// Configuration par défaut (inchangée)
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

// Configuration fusionnée avec interception d'impression
const mergedPdfViewerConfig = computed(() => {
  return {
    ...defaultPdfViewerConfig,
    ...props.pdfViewerConfig,
    // Désactive le système d'impression par défaut pour utiliser le nôtre
    disableDefaultPrint: true
  }
})

// 🖨️ SYSTÈME D'IMPRESSION AMÉLIORÉ
// ================================

/**
 * NOUVELLE LOGIQUE : Utilisation directe de l'URL existante
 * 
 * Problème de l'ancienne version :
 * - Créait un nouveau Blob URL à chaque impression
 * - Risque de fuites mémoire avec URL.revokeObjectURL()
 * - Chargement inutile du PDF en mémoire
 * 
 * Solution améliorée :
 * - Réutilise l'URL déjà chargée dans VuePdfApp
 * - Pas de création de nouveaux Blob URLs
 * - Meilleures performances
 * - Pas de risque de fuites mémoire
 */
const printPdf = async () => {
  if (!props.pdfUrl) {
    console.error('❌ No PDF URL available for printing')
    alert('Unable to print PDF. No PDF available.')
    return
  }

  try {
    console.log('🖨️ Printing PDF using existing URL...')
    
    // APPROCHE 1: Utilisation directe de l'iframe avec l'URL existante
    if (printIframe.value) {
      // L'iframe utilise déjà l'URL via :src="pdfUrl"
      // On déclenche simplement l'impression
      await nextTick() // S'assurer que l'iframe est prêt
      
      printIframe.value.onload = () => {
        // Petit délai pour s'assurer que le PDF est chargé dans l'iframe
        setTimeout(() => {
          try {
            printIframe.value?.contentWindow?.print()
            console.log('✅ Print dialog opened via iframe')
          } catch (error) {
            console.error('❌ Error printing via iframe:', error)
            fallbackPrint()
          }
        }, 1000)
      }
      
      // Force le rechargement pour déclencher onload
      printIframe.value.src = props.pdfUrl
    } else {
      fallbackPrint()
    }
  } catch (error) {
    console.error('❌ Error in print process:', error)
    fallbackPrint()
  }
}

/**
 * Méthode de secours - ouvre dans une nouvelle fenêtre
 */
const fallbackPrint = () => {
  if (!props.pdfUrl) return
  
  console.log('🔄 Using fallback print method')
  const printWindow = window.open(props.pdfUrl, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  } else {
    alert('Please allow pop-ups to print the PDF.')
  }
}

/**
 * Interception des raccourcis clavier (Ctrl+P / Cmd+P)
 */
const handlePrintShortcut = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault()
    e.stopPropagation()
    printPdf()
    return false
  }
}

/**
 * Interception des clics sur le bouton d'impression du viewer PDF
 * 
 * IMPORTANT: Vue3-pdf-app utilise une structure DOM spécifique.
 * On intercepte les clics sur les éléments avec les sélecteurs connus.
 */
const interceptPdfViewerPrint = () => {
  const interceptClick = (e: Event) => {
    const target = e.target as HTMLElement
    
    // Sélecteurs spécifiques à vue3-pdf-app pour le bouton d'impression
    const printSelectors = [
      '#print',                           // ID direct
      '.print',                           // Classe directe
      '[title*="print" i]',               // Title contenant "print"
      '[title*="imprimer" i]',            // Title contenant "imprimer" (FR)
      'button[data-l10n-id="print"]',     // Bouton avec data attribute
      'button:has(> svg use[href*="print"])' // Bouton avec icône print
    ]
    
    const isPrintButton = printSelectors.some(selector => 
      target.matches?.(selector) || target.closest?.(selector)
    )
    
    if (isPrintButton) {
      e.preventDefault()
      e.stopPropagation()
      console.log('🖨️ Print button intercepted in PDF viewer')
      printPdf()
      return false
    }
  }

  // Écouteur en phase capture pour intercepter avant le handler par défaut
  document.addEventListener('click', interceptClick, true)
  
  // Retourne la fonction de nettoyage
  return () => document.removeEventListener('click', interceptClick, true)
}

// Gestionnaires d'événements PDF
const onPdfViewerCreated = async (pdfApp: any) => {
  console.log('📄 PDF Viewer created:', pdfApp)
  pdfDocument.value = pdfApp
  
  // Tentative d'override de la fonction print interne
  try {
    if (pdfApp && pdfApp.pdfViewer && typeof pdfApp.pdfViewer.print === 'function') {

      // Sauvegarde la fonction originale
      const originalPrint = pdfApp.pdfViewer.print

      // Remplace par notre propre fonction
      pdfApp.pdfViewer.print = () => {
        console.log('🖨️ Internal print function intercepted')
        printPdf()
      }
      
      console.log('✅ PDF viewer print function overridden')
    }
  } catch (error) {
    console.warn('⚠️ Could not override internal print function:', error)
  }
}

const onPagesRendered = (pages: any) => {
  console.log('📄 Pages rendered:', pages)
  totalPages.value = pages.pagesCount || 0
}

const onPageRendered = (page: any) => {
  currentPage.value = page.pageNumber
}

const onPdfError = (error: any) => {
  console.error('❌ PDF Viewer Error:', error)
}

// Lifecycle
let cleanupIntercept: (() => void) | null = null

onMounted(() => {
  // Raccourci clavier
  window.addEventListener('keydown', handlePrintShortcut)
  
  // Interception des clics sur le bouton d'impression
  cleanupIntercept = interceptPdfViewerPrint()
  
  console.log('✅ Enhanced print system initialized')
})

onUnmounted(() => {
  // Nettoyage
  window.removeEventListener('keydown', handlePrintShortcut)
  cleanupIntercept?.()
  
  console.log('🧹 Print system cleanup completed')
})

// Exposition de l'API
defineExpose({
  printPdf,
  currentPage,
  totalPages
})
</script>

<style scoped>
.enjoy-pdf-view {
  width: 100%;
  height: 100%;
}

.enjoy-pdf-view :deep(.pdf-viewer-container) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100%;
}

.enjoy-pdf-view :deep(.pdf-viewer-container canvas) {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  margin-bottom: 10px;
}
</style>