<template>
  <div class="pdf-viewer-page">
    <!-- PDF Viewer Content -->
    <div class="pdf-content flex-1">
      <EnjoyPDFView 
        :pdf-url="pdfUrl" 
        :is-generating="isLoading" 
        :pdf-viewer-config="pdfViewerConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * PDFViewer Page Component
 * 
 * A standalone page for viewing PDF documents with full-screen display.
 * Accepts PDF URL as route parameter and provides navigation controls.
 * 
 * Features:
 * - Full-screen PDF viewing
 * - Navigation back button
 * - Download functionality
 * - Error handling and retry
 * - Loading states
 * 
 * Route Parameters:
 * - url: Base64 encoded PDF URL
 * - title: Optional PDF title
 * 
 * Usage:
 * Navigate to: /pdf-viewer?url=<encoded-url>&title=<title>
 * 
 * @author EnjoyAdmin Team
 * @version 1.0.0
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EnjoyPDFView from '@/components/common/EnjoyPDFView.vue'

// Router
const route = useRoute()
const router = useRouter()

// Reactive data
const isLoading = ref(false)
const error = ref('')
const pdfUrl = ref('')

// Computed properties
const pageTitle = computed(() => {
  return route.query.title as string || 'PDF Viewer'
})

// PDF Viewer Configuration
const pdfViewerConfig = {
  sidebar: {
    viewThumbnail: true,
    viewOutline: true,
    viewAttachments: false
  },
  toolbar: {
    toolbarViewerLeft: {
      findbar: true,
      previous: true,
      next: true,
      pageNumber: true
    },
    toolbarViewerRight: {
      presentationMode: true,
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
  }
}

// Methods
const loadPDF = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const encodedUrl = route.query.url as string
    if (!encodedUrl) {
      throw new Error('No PDF URL provided')
    }
    
    // Decode the URL
    const decodedUrl = decodeURIComponent(atob(encodedUrl))
    pdfUrl.value = decodedUrl
    
  } catch (err) {
    console.error('Error loading PDF:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load PDF'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

const downloadPDF = () => {
  if (pdfUrl.value) {
    const link = document.createElement('a')
    link.href = pdfUrl.value
    link.download = `${pageTitle.value}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const retry = () => {
  loadPDF()
}

// Lifecycle
onMounted(() => {
  loadPDF()
})

// Watch for route changes
watch(() => route.query.url, () => {
  if (route.query.url) {
    loadPDF()
  }
})
</script>

<style scoped>
.pdf-viewer-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
}

.pdf-header {
  flex-shrink: 0;
  z-index: 10;
}

.pdf-content {
  flex: 1;
  overflow: hidden;
}

/* Ensure full height for PDF viewer */
.pdf-content :deep(.enjoy-pdf-view) {
  height: 100%;
}
</style>