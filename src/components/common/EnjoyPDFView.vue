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
        :config="pdfViewerConfig"
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
  </div>
</template>

<script setup lang="ts">
/**
 * EnjoyPDFView Component
 * 
 * A standalone PDF viewer component for displaying PDF blobs without modal wrapper.
 * Based on PdfExporterNode but designed for direct page integration.
 * 
 * Features:
 * - PDF blob display with VuePdfApp
 * - Loading states
 * - Error handling
 * - Customizable PDF viewer configuration
 * - Theme support
 * 
 * Usage:
 * <EnjoyPDFView :pdf-url="pdfBlobUrl" :is-generating="loading" />
 * 
 * @author EnjoyAdmin Team
 * @version 1.0.0
 */

import { ref, computed } from 'vue'
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

// PDF Viewer Event Handlers
const onPdfViewerCreated = (pdfApp: any) => {
  console.log('📄 PDF Viewer created:', pdfApp)
  pdfDocument.value = pdfApp
}

const onPagesRendered = (pages: any) => {
  console.log('📄 Pages rendered:', pages)
  totalPages.value = pages.pagesCount || 0
}

const onPageRendered = (page: any) => {
  console.log('📄 Page rendered:', page.pageNumber)
  currentPage.value = page.pageNumber
}

const onPdfError = (error: any) => {
  console.error('❌ PDF Viewer Error:', error)
}
</script>

<style scoped>
.enjoy-pdf-view {
  width: 100%;
  height: 100%;
}

/* PDF Viewer Styles */
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

/* Styles to avoid page breaks */
.enjoy-pdf-view :deep(.page-break-avoid) {
  page-break-inside: avoid;
  break-inside: avoid;
}

.enjoy-pdf-view :deep(.page-break-before) {
  page-break-before: always;
  break-before: page;
}

.enjoy-pdf-view :deep(.page-break-after) {
  page-break-after: always;
  break-after: page;
}

/* Table styles */
.enjoy-pdf-view :deep(table) {
  page-break-inside: avoid;
  break-inside: avoid;
}

.enjoy-pdf-view :deep(tr) {
  page-break-inside: avoid;
  break-inside: avoid;
}

.enjoy-pdf-view :deep(.no-break) {
  page-break-inside: avoid;
  break-inside: avoid;
}
</style>