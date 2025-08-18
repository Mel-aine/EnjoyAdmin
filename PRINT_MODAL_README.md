# PrintModal Component Usage Guide

The `PrintModal` component is a reusable modal dialog that integrates with the `PdfExporter` component to provide a user-friendly interface for printing documents with various templates and options.

## Features

- **Template Selection**: Choose from multiple document templates
- **Filename Customization**: Set custom filenames for generated documents
- **Print Options**: Configure header, footer, and watermark display
- **PDF Theme Support**: Apply custom styling to the PDF viewer
- **Event Handling**: Track print process lifecycle events
- **Internationalization**: Full i18n support for multiple languages

## Basic Usage

### 1. Import the Component

```vue
<script setup lang="ts">
import PrintModal from '@/components/common/PrintModal.vue'
</script>
```

### 2. Add to Template

```vue
<template>
  <!-- Your trigger button -->
  <button @click="openPrintModal">Print Document</button>
  
  <!-- Print Modal -->
  <PrintModal
    :is-open="showPrintModal"
    :title="'Print Invoice'"
    :templates="availableTemplates"
    :document-data="documentData"
    :default-filename="'invoice-2024-001'"
    @close="closePrintModal"
    @print-completed="handlePrintCompleted"
  />
</template>
```

### 3. Setup Component Logic

```vue
<script setup lang="ts">
import { ref } from 'vue'
import PrintModal from '@/components/common/PrintModal.vue'
import InvoiceTemplate from '@/components/common/templates/InvoiceStandardTemplate.vue'

const showPrintModal = ref(false)

const availableTemplates = [
  {
    id: 'invoice-standard',
    name: 'Standard Invoice',
    description: 'Standard invoice template',
    component: InvoiceTemplate,
    options: {
      margin: [10, 10, 10, 10],
      jsPDF: { format: 'a4', orientation: 'portrait' }
    }
  }
]

const documentData = {
  // Your document data here
  company: { name: 'My Company' },
  customer: { name: 'Customer Name' },
  // ... other data
}

const openPrintModal = () => {
  showPrintModal.value = true
}

const closePrintModal = () => {
  showPrintModal.value = false
}

const handlePrintCompleted = (data) => {
  console.log('Print completed:', data)
  closePrintModal()
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `title` | `string` | `''` | Modal title (optional) |
| `templates` | `PrintTemplate[]` | `undefined` | Available document templates |
| `documentData` | `any` | `required` | Data to be used in document generation |
| `defaultFilename` | `string` | `'document'` | Default filename for generated PDF |
| `pdfTheme` | `Record<string, any>` | `undefined` | Custom PDF viewer theme |

### PrintTemplate Interface

```typescript
interface PrintTemplate {
  id: string
  name: string
  description?: string
  component: any // Vue component
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
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | `void` | Emitted when modal is closed |
| `print-started` | `{ template, filename, options }` | Emitted when print process starts |
| `print-completed` | `{ template, filename, blob }` | Emitted when PDF is generated successfully |
| `print-error` | `error` | Emitted when an error occurs during printing |

## Advanced Usage Examples

### Multiple Templates

```vue
<script setup lang="ts">
const templates = [
  {
    id: 'invoice-standard',
    name: 'Standard Invoice',
    component: InvoiceStandardTemplate,
    options: {
      margin: [10, 10, 10, 10],
      jsPDF: { format: 'a4', orientation: 'portrait' }
    }
  },
  {
    id: 'invoice-detailed',
    name: 'Detailed Invoice',
    component: InvoiceDetailedTemplate,
    options: {
      margin: [15, 15, 15, 15],
      jsPDF: { format: 'a4', orientation: 'portrait' }
    }
  }
]
</script>
```

### Custom PDF Theme

```vue
<script setup lang="ts">
const customTheme = {
  '--toolbar-icon-color': '#3b82f6',
  '--toolbar-bg-color': '#f8fafc',
  '--sidebar-bg-color': '#ffffff',
  '--button-hover-color': '#2563eb'
}
</script>

<template>
  <PrintModal
    :pdf-theme="customTheme"
    <!-- other props -->
  />
</template>
```

### Event Handling

```vue
<script setup lang="ts">
import { useToast } from 'vue-toastification'

const toast = useToast()

const handlePrintStarted = (data) => {
  console.log('Print started with template:', data.template.name)
  toast.info(`Generating ${data.template.name}...`)
}

const handlePrintCompleted = (data) => {
  console.log('Print completed:', data)
  toast.success(`${data.template.name} generated successfully!`)
  
  // Optionally save the blob or perform other actions
  if (data.blob) {
    // Handle the generated PDF blob
    const url = URL.createObjectURL(data.blob)
    // ... do something with the URL
  }
  
  closePrintModal()
}

const handlePrintError = (error) => {
  console.error('Print error:', error)
  toast.error('Failed to generate document')
}
</script>

<template>
  <PrintModal
    @print-started="handlePrintStarted"
    @print-completed="handlePrintCompleted"
    @print-error="handlePrintError"
    <!-- other props -->
  />
</template>
```

## Integration with Existing Components

### Following the CancelReservation Pattern

The `PrintModal` follows the same pattern as `CancelReservation.vue`:

1. **Modal Structure**: Same modal overlay and container styling
2. **Form Handling**: Similar form validation and submission patterns
3. **Event Emission**: Consistent event naming and payload structure
4. **Internationalization**: Uses the same i18n patterns

### Usage in Reservation Components

```vue
<!-- In ReservationCardItem.vue or similar -->
<template>
  <!-- Existing reservation card content -->
  
  <!-- Print button -->
  <button @click="openPrintModal" class="btn btn-primary">
    {{ $t('print') }}
  </button>
  
  <!-- Print Modal -->
  <PrintModal
    :is-open="showPrintModal"
    :title="$t('print_reservation')"
    :templates="reservationTemplates"
    :document-data="reservation"
    :default-filename="`reservation-${reservation.number}`"
    @close="showPrintModal = false"
    @print-completed="handlePrintCompleted"
  />
</template>

<script setup lang="ts">
import PrintModal from '@/components/common/PrintModal.vue'
import ReservationTemplate from '@/components/common/templates/ReservationTemplate.vue'

const showPrintModal = ref(false)

const reservationTemplates = [
  {
    id: 'reservation-confirmation',
    name: 'Reservation Confirmation',
    component: ReservationTemplate
  }
]

const openPrintModal = () => {
  showPrintModal.value = true
}

const handlePrintCompleted = (data) => {
  // Handle successful print
  showPrintModal.value = false
}
</script>
```

## Styling

The component uses the same styling patterns as other modals in the project:

- **Tailwind CSS**: Consistent with project styling
- **Modal Animations**: Fade in/out transitions
- **Focus Management**: Proper accessibility focus handling
- **Responsive Design**: Works on all screen sizes

## Translations

The component supports the following translation keys:

```json
{
  "print_document": "Print Document",
  "select_template": "Select Template",
  "filename": "Filename",
  "enter_filename": "Enter filename",
  "print_options": "Print Options",
  "show_header": "Show Header",
  "show_footer": "Show Footer",
  "show_watermark": "Show Watermark",
  "download_pdf": "Download PDF",
  "please_select_template": "Please select a template",
  "please_enter_filename": "Please enter a filename",
  "print_initiated": "Print process initiated",
  "error_initiating_print": "Error initiating print process",
  "pdf_generated_successfully": "PDF generated successfully",
  "error_generating_pdf": "Error generating PDF"
}
```

## Best Practices

1. **Template Organization**: Keep templates in `@/components/common/templates/`
2. **Data Validation**: Validate document data before opening the modal
3. **Error Handling**: Always handle print errors gracefully
4. **Performance**: Use lazy loading for large templates
5. **Accessibility**: Ensure proper ARIA labels and keyboard navigation

## Demo

See `PrintModalDemo.vue` for a complete working example with multiple document types and templates.

## Dependencies

- Vue 3 Composition API
- Vue i18n
- Vue Toastification
- Lucide Vue Next (for icons)
- PdfExporter component
- BasicButton component

## Browser Support

Same as PdfExporter component - supports all modern browsers with PDF.js compatibility.