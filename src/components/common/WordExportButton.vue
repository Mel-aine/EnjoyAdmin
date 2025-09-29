<template>
  <div class="rapport-export-table">
    <!-- Tableau visible -->
    <div class="overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-200">
          <tr>
            <th 
              v-for="(header, index) in tableHeaders" 
              :key="index"
              class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase"
              :colspan="header.colspan"
            >
              {{ header.label }}
            </th>
          </tr>
          <tr v-if="hasSubHeaders">
            <th 
              v-for="(subHeader, index) in subHeaders" 
              :key="index"
              class="px-4 py-2 text-center text-xs font-medium text-gray-600"
            >
              {{ subHeader }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="hover:bg-gray-50">
            <td 
              v-for="(cell, cellIndex) in row" 
              :key="cellIndex"
              class="px-4 py-3 text-center text-sm"
              :class="{'text-left': cellIndex % 4 === 3}"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Légende -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-bold mb-3">Légende</h3>
      
      <!-- Légende des types de chambres -->
      <div class="mb-4">
        <h4 class="font-semibold mb-2">Types de chambres:</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div v-for="(legend, index) in legendData" :key="index">
            <span class="font-semibold">{{ legend.label }}:</span>
            <span class="ml-2">{{ legend.value }}</span>
          </div>
        </div>
      </div>
      
      <!-- Légende des statuts (basée sur l'API) -->
      <div class="mt-4 pt-4 border-t border-gray-300">
        <h4 class="font-semibold mb-2">Légende des statuts:</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div v-for="(description, code) in statusLegend" :key="code">
            <span class="font-medium">{{ code }}:</span>
            <span class="ml-2">{{ description }}</span>
          </div>
        </div>
      </div>

      <!-- Légende des états de propreté -->
      <div class="mt-4 pt-4 border-t border-gray-300">
        <h4 class="font-semibold mb-2">Légende des états de propreté:</h4>
        <div class="flex flex-wrap gap-4 text-sm">
          <div><span class="font-medium">clean:</span> Chambre nettoyée</div>
          <div><span class="font-medium">dirty:</span> Chambre à nettoyer</div>
          <div><span class="font-medium">RAS:</span> Rien à signaler</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';

// Props
const props = defineProps({
  apiData: {
    type: Object,
    required: true,
    default: () => ({})
  },
  title: {
    type: String,
    default: 'STATUT DES CHAMBRES SUITA HOTEL'
  },
  filename: {
    type: String,
    default: 'rapport-chambres'
  },
  autoExport: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['export:start', 'export:success', 'export:error', 'export:complete']);

// State
const loading = ref(false);

// Computed - Légende des statuts basée sur l'API - CORRECTION ICI
const statusLegend = computed(() => {
  return props.apiData.statistics?.legend || {};
});

// Computed - Types de chambres disponibles
const roomTypes = computed(() => {
  return props.apiData.roomsByType || [];
});

// Computed - En-têtes principaux du tableau
const tableHeaders = computed(() => {
  const headers = [];
  
  roomTypes.value.forEach(roomType => {
    headers.push({
      label: `${roomType.shortCode} (${roomType.roomTypeName})`,
      colspan: 4
    });
  });
  
  return headers;
});

// Computed - Sous-en-têtes (répétés pour chaque type de chambre)
const subHeaders = computed(() => {
  const subHeaders = [];
  
  roomTypes.value.forEach(() => {
    subHeaders.push('CHAMBRE', 'ETAT MT', 'ETAT SOIR', 'OBSERVATIONS');
  });
  
  return subHeaders;
});

// Computed - Vérifie si on a besoin de sous-en-têtes
const hasSubHeaders = computed(() => {
  return roomTypes.value.length > 0;
});

// Computed - Données du tableau formatées dynamiquement
const tableData = computed(() => {
  if (roomTypes.value.length === 0) return [];

  // Trouver le nombre maximum de chambres parmi tous les types
  const maxRooms = Math.max(...roomTypes.value.map(type => type.rooms.length));
  const formattedData = [];

  for (let i = 0; i < maxRooms; i++) {
    const row = [];
    
    roomTypes.value.forEach(roomType => {
      const room = roomType.rooms[i] || {};
      
      row.push(
        room.roomNumber || '',
        room.etatMatin || '', // Conserve l'état original en anglais
        room.etatSoir || '',  // Conserve l'état original en anglais
        formatObservations(room.observations)
      );
    });
    
    formattedData.push(row);
  }

  return formattedData;
});

// Computed - Légende basée sur les types de chambres
const legendData = computed(() => {
  return roomTypes.value.map(type => ({
    label: type.shortCode,
    value: type.roomTypeName
  }));
});

// Méthodes utilitaires
const formatObservations = (observations) => {
  return observations && observations.trim() !== '' ? observations : 'RAS';
};

// Méthodes d'export Word (dynamiques)
const createCell = (text, isHeader = false, align = 'left', bgColor = 'FFFFFF', columnSpan = 1) => {
  return new TableCell({
    columnSpan: columnSpan,
    shading: {
      fill: bgColor,
      color: 'auto',
    },
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },
    verticalAlign: 'center',
    children: [
      new Paragraph({
        alignment: getAlignment(align),
        spacing: { line: 240 },
        children: [
          new TextRun({
            text: String(text || ''),
            bold: isHeader,
            size: 16,
            font: 'Arial'
          })
        ]
      })
    ]
  });
};

const getAlignment = (align) => {
  switch(align) {
    case 'center': return AlignmentType.CENTER;
    case 'right': return AlignmentType.RIGHT;
    default: return AlignmentType.LEFT;
  }
};

// Calcul dynamique des largeurs de colonnes
const calculateColumnWidths = () => {
  const baseWidth = 1200; // Largeur de base pour chaque colonne
  const observationWidth = 2500; // Largeur pour les observations
  
  const widths = [];
  roomTypes.value.forEach(() => {
    widths.push(baseWidth, baseWidth, baseWidth, observationWidth);
  });
  
  return widths;
};

const createStatusTable = () => {
  const columnWidths = calculateColumnWidths();
  
  // En-tête principal (avec fusion de cellules)
  const mainHeaderRow = new TableRow({
    children: roomTypes.value.map(roomType => 
      createCell(
        `${roomType.shortCode} (${roomType.roomTypeName})`, 
        true, 
        'center', 
        'D3D3D3',
        4 // Fusion sur 4 colonnes
      )
    )
  });

  // Sous-en-têtes
  const subHeaderCells = [];
  roomTypes.value.forEach(() => {
    subHeaderCells.push(
      createCell('CHAMBRE', true, 'center', 'E8E8E8'),
      createCell('ETAT MT', true, 'center', 'E8E8E8'),
      createCell('ETAT SOIR', true, 'center', 'E8E8E8'),
      createCell('OBSERVATIONS', true, 'center', 'E8E8E8')
    );
  });
  const subHeaderRow = new TableRow({ children: subHeaderCells });

  // Données des chambres
  const dataRows = tableData.value.map(row => {
    const cells = [];
    row.forEach((cell, index) => {
      const isObservation = (index % 4 === 3); // Toutes les 4ème colonnes sont des observations
      cells.push(
        createCell(
          cell, 
          false, 
          isObservation ? 'left' : 'center'
        )
      );
    });
    return new TableRow({ children: cells });
  });

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    columnWidths: columnWidths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
    },
    rows: [
      // En-tête principal (fusionné)
      mainHeaderRow,
      // Sous-en-têtes
      subHeaderRow,
      // Données des chambres
      ...dataRows
    ]
  });
};

const generateDocument = () => {
  const legendParagraphs = [];
  
  legendData.value.forEach((legend, index) => {
    legendParagraphs.push(
      new Paragraph({
        spacing: { before: index === 0 ? 800 : 200, after: 200 },
        children: [
          new TextRun({
            text: `${legend.label}: ${legend.value}`,
            bold: true,
            size: 18,
            font: 'Arial',
            break: index > 0 ? 1 : 0
          })
        ]
      })
    );
  });

  // Paragraphes pour la légende des statuts - CORRECTION ICI AUSSI
  const statusLegendParagraphs = [];
  Object.entries(statusLegend.value).forEach(([code, description], index) => {
    statusLegendParagraphs.push(
      new Paragraph({
        spacing: { before: index === 0 ? 400 : 100, after: 100 },
        children: [
          new TextRun({
            text: `${code}: ${description}`,
            size: 16,
            font: 'Arial',
            break: index > 0 ? 1 : 0
          })
        ]
      })
    );
  });

  // Ajout d'un log pour déboguer
  console.log('Légende des statuts pour Word:', statusLegend.value);

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1000,
            right: 720,
            bottom: 1000,
            left: 720
          }
        }
      },
      children: [
        // Titre principal
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 600 },
          children: [
            new TextRun({
              text: `${props.title.toUpperCase()} ${props.apiData.dateFormatted || new Date().toLocaleDateString('fr-FR')}`,
              bold: true,
              size: 24,
              font: 'Arial',
              underline: true
            })
          ]
        }),

        // Informations de l'hôtel
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 400 },
          children: [
            new TextRun({
              text: `${props.apiData.hotelDetails?.hotelName || 'Suita Hotel'} - ${props.apiData.hotelDetails?.address || ''}`,
              bold: true,
              size: 18,
              font: 'Arial'
            })
          ]
        }),

        // Tableau principal (dynamique)
        createStatusTable(),

        // Légende des types de chambres
/*         new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 800, after: 400 },
          children: [
            new TextRun({
              text: 'LÉGENDE DES TYPES DE CHAMBRES:',
              bold: true,
              size: 20,
              font: 'Arial',
              underline: true
            })
          ]
        }),
        ...legendParagraphs, */

        // Légende des statuts (basée sur l'API)
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 600, after: 400 },
          children: [
            new TextRun({
              //text: 'LÉGENDE DES STATUTS:',
              bold: true,
              size: 20,
              font: 'Arial',
              underline: true
            })
          ]
        }),
        ...statusLegendParagraphs,

        // Légende des états de propreté
/*         new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 600, after: 200 },
          children: [
            new TextRun({
              text: 'LÉGENDE DES ÉTATS DE PROPRETÉ:',
              bold: true,
              size: 20,
              font: 'Arial',
              underline: true
            })
          ]
        }), */
 /*        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: '• clean: Chambre nettoyée et prête',
              size: 18,
              font: 'Arial'
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: '• dirty: Chambre à nettoyer',
              size: 18,
              font: 'Arial'
            })
          ]
        }), */
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: '• RAS: Rien à signaler',
              size: 18,
              font: 'Arial'
            })
          ]
        })
      ]
    }]
  });
};

const handleExport = async () => {
  if (loading.value) return;
  
  loading.value = true;
  emit('export:start');
  
  try {
    const doc = generateDocument();
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${props.filename}-${new Date().toISOString().split('T')[0]}.docx`);
    
    emit('export:success');
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    emit('export:error', error);
  } finally {
    loading.value = false;
    emit('export:complete');
  }
};

// Auto-export si activé
watch(() => props.autoExport, (newVal) => {
  if (newVal && tableData.value.length > 0) {
    handleExport();
  }
});

onMounted(() => {
  if (props.autoExport && tableData.value.length > 0) {
    handleExport();
  }
  console.log('WordExportButton monté avec succès');
  console.log('Données API reçues:', props.apiData);
  console.log('Légende des statuts disponible:', props.apiData.statistics?.legend);
});

// Exposer la méthode pour un appel manuel
defineExpose({
  handleExport
});
</script>

<style scoped>
.rapport-export-table {
  width: 100%;
}

/* Styles pour améliorer l'affichage du tableau */
table {
  border-collapse: collapse;
}

th, td {
  border: 1px solid #e5e7eb;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>