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
      
      <!-- Légende des statuts (basée sur l'API) -->
      <div class="mt-4">
        <div class="grid grid-cols-1 gap-2 text-sm font-mono">
          <div v-for="(legendPair, index) in formattedLegend" :key="index" class="flex justify-between">
            <span class="font-semibold whitespace-nowrap">{{ legendPair }}</span>
          </div>
        </div>
      </div>

      <!-- Note RAS -->
      <div class="mt-4 pt-4 border-t border-gray-300">
        <div class="text-sm">
          <span class="font-medium">• RAS:</span>
          <span class="ml-2">Rien à signaler</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

// Computed - Légende des statuts basée sur l'API
const statusLegend = computed(() => {
  return props.apiData.statistics?.legend || [];
});

// Computed - Légende formatée avec pointillés étendus pour format A4
const formattedLegend = computed(() => {
  const legend = statusLegend.value;
  
  // Extraire les totaux des légendes existantes
  const totals = extractTotalsFromLegend(legend);
  
  // Format A4 - pointillés étendus pour occuper toute la largeur
  const formatted = [
    formatLegendLineA4('OP : OCCUPE PROPRE', totals.left[0] || '00', 'OS : OCCUPER SALE', totals.right[0] || '00'),
    formatLegendLineA4('LP : LIBRE PROPRE', totals.left[1] || '00', 'LS : LIBRE SALE', totals.right[1] || '00'),
    formatLegendLineA4('AR : Arrivée', totals.left[2] || '00', 'DP : Départ', totals.right[2] || '00'),
    formatLegendLineA4('DT : Départ tardif', totals.left[3] || '00', 'DL : Délogement', totals.right[3] || '00'),
    formatLegendLineA4('RS : Réservation', totals.left[4] || '00', 'HS : HORS SERVICE', totals.right[4] || '00'),
    formatLegendLineA4('CN : CUMULE Nuitée', totals.left[5] || '00', 'RM : Refus ménage', totals.right[5] || '00')
  ];
  
  return formatted;
});

// Fonction pour formater une ligne de légende avec pointillés étendus pour A4
const formatLegendLineA4 = (leftText, leftTotal, rightText, rightTotal) => {
  // Largeur cible pour format A4 (environ 80-90 caractères par ligne)
  const totalLineLength = 85;
  const partLength = 40; // Chaque partie occupe environ 40 caractères
  
  // Formater la partie gauche avec pointillés étendus
  const leftBase = leftText;
  const leftDotsNeeded = Math.max(10, partLength - leftBase.length - leftTotal.length);
  const leftDots = '.'.repeat(leftDotsNeeded);
  const leftFormatted = `${leftBase}${leftDots}${leftTotal.padStart(2, '0')}`;
  
  // Formater la partie droite avec pointillés étendus
  const rightBase = rightText;
  const rightDotsNeeded = Math.max(10, partLength - rightBase.length - rightTotal.length);
  const rightDots = '.'.repeat(rightDotsNeeded);
  const rightFormatted = `${rightBase}${rightDots}${rightTotal.padStart(2, '0')}`;
  
  return `${leftFormatted}      ${rightFormatted}`;
};

// Fonction pour extraire les totaux des légendes existantes
const extractTotalsFromLegend = (legend) => {
  const totals = { left: [], right: [] };
  
  legend.forEach((line, index) => {
    // Extraire les nombres à la fin de chaque partie
    const parts = line.split(/\s{2,}/);
    
    if (parts.length >= 2) {
      // Extraire le dernier nombre de chaque partie
      const leftMatch = parts[0].match(/(\d+)\s*$/);
      const rightMatch = parts[1].match(/(\d+)\s*$/);
      
      totals.left[index] = leftMatch ? leftMatch[1] : '00';
      totals.right[index] = rightMatch ? rightMatch[1] : '00';
    } else {
      totals.left[index] = '00';
      totals.right[index] = '00';
    }
  });
  
  return totals;
};

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
  if (roomTypes.value.length === 0) {
    console.log('Aucun type de chambre trouvé');
    return [];
  }

  const maxRooms = Math.max(...roomTypes.value.map(type => type.rooms.length));
  const formattedData = [];

  for (let i = 0; i < maxRooms; i++) {
    const row = [];
    
    roomTypes.value.forEach(roomType => {
      const room = roomType.rooms[i] || {};
      
      row.push(
        room.roomNumber || '',
        room.etatMatin || '',
        room.etatSoir || '',
        formatObservations(room.observations)
      );
    });
    
    formattedData.push(row);
  }

  return formattedData;
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
  const baseWidth = 1200;
  const observationWidth = 2500;
  
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
        4
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
      const isObservation = (index % 4 === 3);
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
      mainHeaderRow,
      subHeaderRow,
      ...dataRows
    ]
  });
};

const generateDocument = () => {
  const statusLegendParagraphs = formattedLegend.value.map((legendLine, index) => {
    return new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: index === 0 ? 600 : 100, after: 100 },
      children: [
        new TextRun({
          text: legendLine,
          bold: true,
          size: 16,
          font: 'Arial'
        })
      ]
    });
  });

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

        // Saut de ligne avant les légendes
        new Paragraph({
          spacing: { before: 600, after: 200 },
          children: [new TextRun({ text: '', size: 16 })]
        }),

        // Légende des statuts (format A4 avec pointillés étendus)
        ...statusLegendParagraphs,
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

/* Style pour la légende en police monospace */
.font-mono {
  font-family: 'Courier New', monospace;
}

.whitespace-nowrap {
  white-space: nowrap;
}
</style>