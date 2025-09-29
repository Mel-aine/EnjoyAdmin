<template>
  <button 
    @click="handleExport"
    :class="[
      'inline-flex items-center px-4 py-2 border border-transparent',
      'text-sm font-medium rounded-md shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-colors duration-200',
      'min-w-32 justify-center',
      loading 
        ? 'bg-blue-400 cursor-not-allowed' 
        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
      $attrs.class
    ]"
    :disabled="loading"
  >
    <!-- Icône de chargement -->
    <svg 
      v-if="loading" 
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <!-- Icône Word quand pas en chargement -->
    <svg 
      v-else 
      class="w-5 h-5 mr-2 text-white" 
      fill="currentColor" 
      viewBox="0 0 20 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
    </svg>
    
    <!-- Texte du bouton -->
    <span class="whitespace-nowrap">
      {{ loading ? 'Génération...' : 'Exporter Rapport' }}
    </span>
  </button>
</template>

<script>
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export default {
  name: 'RapportExportButton',
  props: {
    filename: {
      type: String,
      default: 'rapport-chambres'
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async handleExport() {
      if (this.loading) return;
      
      this.loading = true;
      this.$emit('export:start');
      
      try {
        const doc = this.generateDocument();
        await this.exportDocument(doc);
        this.$emit('export:success');
        this.$toast.success('Rapport généré avec succès', {
          position: 'top-right',
          timeout: 3000
        });
      } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        this.$emit('export:error', error);
        this.$toast.error('Erreur lors de la génération du rapport', {
          position: 'top-right',
          timeout: 5000
        });
      } finally {
        this.loading = false;
        this.$emit('export:complete');
      }
    },

    generateDocument() {
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
                  text: 'STATUT DES CHAMBRES SUITA HOTEL 17 SEPTEMBRE 2025',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                  underline: true
                })
              ]
            }),

            // Tableau principal
            this.createStatusTable(),

            // Légende
            new Paragraph({
              spacing: { before: 800, after: 200 },
              children: [
                new TextRun({
                  text: 'OP : OCCUPE PROPRE..............................................................17',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                }),
                new TextRun({
                  text: 'OS : OCCUPER SALE........................................................................00',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 200 },
              children: [
                new TextRun({
                  text: 'LP : LIBRE PROPRE....................................................................18',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                }),
                new TextRun({
                  text: 'LS : LIBRE SALE......................................05',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 200 },
              children: [
                new TextRun({
                  text: 'AR : Arrivée...............................................................................04',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                }),
                new TextRun({
                  text: 'DP : Départ.............................................................................04',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 200 },
              children: [
                new TextRun({
                  text: 'DT : Départ tardif....................................................................00',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                }),
                new TextRun({
                  text: 'DL : Délogement :......................................................................00',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 200 },
              children: [
                new TextRun({
                  text: 'RS : Réservation...................................................................00',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                }),
                new TextRun({
                  text: 'HS : HORS SERVICE......................................................................01',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 400 },
              children: [
                new TextRun({
                  text: 'CN : CUMULE Nuitée.................................259',
                  bold: true,
                  size: 18,
                  font: 'Arial',
                  break: 1
                }),
                new TextRun({
                  text: 'HSH - LS 106 RM : Refus ménage................................04',
                  bold: true,
                  size: 18,
                  font: 'Arial'
                })
              ]
            })
          ]
        }]
      });
    },

    createStatusTable() {
      return new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        columnWidths: [1200, 1200, 1200, 2000, 1200, 1200, 1200, 2500],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 3, color: '000000' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
        },
        rows: [
          // En-tête du tableau
          new TableRow({
            children: [
              this.createCell('LS', true, 'center', 'D3D3D3'),
              this.createCell('ETAT MT', true, 'center', 'D3D3D3'),
              this.createCell('ETAT\nSOIR', true, 'center', 'D3D3D3'),
              this.createCell('OBS/ANOMALIES', true, 'center', 'D3D3D3'),
              this.createCell('HSH', true, 'center', 'D3D3D3'),
              this.createCell('ETAT MT', true, 'center', 'D3D3D3'),
              this.createCell('ETAT\nSOIR', true, 'center', 'D3D3D3'),
              this.createCell('OBSERVATIONS/ANOMALIES', true, 'center', 'D3D3D3')
            ]
          }),
          // Données des chambres
          this.createRoomRow('103', 'OS', 'OS', 'RM', '101 AB', 'OS/OS', 'OP/OP', ''),
          this.createRoomRow('104', 'OS', 'OP', '', '102 AB', 'LP/LP', 'AR/AR', 'Pas de table pour la salle à manger'),
          this.createRoomRow('', '', '', '', '105 AB', 'LP/OS', 'LP/OP', ''),
          this.createRoomRow('', '', '', '', '106 AB', 'OS/LS', 'OP/LS', ''),
          this.createRoomRow('203', 'DG', 'DG', 'Chauffe-eau en panne', '201 AB', 'LS/OS', 'LS/OP', ''),
          this.createRoomRow('204', 'OS', 'LP', '', '202 AB', 'OS/LS', 'OP/LS', ''),
          this.createRoomRow('', '', '', '', '205 AB', 'LS/OS', 'LP/OP', ''),
          this.createRoomRow('', '', '', '', '206 AB', 'OS/OS', 'OS/OS', 'RM'),
          this.createRoomRow('303', 'LP', 'LP', '', '301 AB', 'LP/OS', 'LP/AR', 'Moisissures à l\'entrée de la ch A'),
          this.createRoomRow('304', 'OS', 'OP', '', '302 AB', 'OS/HS', 'OP/HS', 'Plafond de la salle de bain ch B endommagée'),
          this.createRoomRow('', '', '', '', '305 BA', 'LS/OS', 'LS/OP', ''),
          this.createRoomRow('', '', '', '', '306 AB', 'OS/LS', 'OP/LS', ''),
          this.createRoomRow('403', 'OS', 'OP', '', '401 AB', 'LS/LP', 'LP/LP', ''),
          this.createRoomRow('404', 'OS', 'OP', '', '402 AB', 'OS/LP', 'OS/LP', 'RM'),
          this.createRoomRow('404 Vitre du chevet et porte du balcon fendues', '', '', '', '405 AB', 'LS/LP', 'LP/AR', 'Pas de salle à manger'),
          this.createRoomRow('', '', '', '', '406 AB', 'LP/LS', 'LP/LP', 'Décodeur du salon n\'est pas fixer'),
          this.createRoomRow('503', 'OS', 'OP', '', '501 AB', 'LP/LP', 'LP/LP', ''),
          this.createRoomRow('504', 'OS', 'OP', '', '502 AB', 'LS/OS', 'LP/LP', ''),
          this.createRoomRow('', '', '', '', '505 AB', 'OS/LS', 'OP/LP', ''),
          this.createRoomRow('', '', '', '', '506 AB', 'LS/OS', 'LP/LP', '')
        ]
      });
    },

    createRoomRow(ls, etatMatin, etatSoir, obs, hsh, etatMt, etatSoirHsh, observations) {
      return new TableRow({
        children: [
          this.createCell(ls, false, 'center'),
          this.createCell(etatMatin, false, 'center'),
          this.createCell(etatSoir, false, 'center'),
          this.createCell(obs, false, 'left'),
          this.createCell(hsh, false, 'center'),
          this.createCell(etatMt, false, 'center'),
          this.createCell(etatSoirHsh, false, 'center'),
          this.createCell(observations, false, 'left')
        ]
      });
    },

    createCell(text, isHeader = false, align = 'left', bgColor = 'FFFFFF') {
      return new TableCell({
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
            alignment: this.getAlignment(align),
            spacing: { line: 240 },
            children: [
              new TextRun({
                text: String(text),
                bold: isHeader,
                size: 16,
                font: 'Arial'
              })
            ]
          })
        ]
      });
    },

    getAlignment(align) {
      switch(align) {
        case 'center': return AlignmentType.CENTER;
        case 'right': return AlignmentType.RIGHT;
        default: return AlignmentType.LEFT;
      }
    },

    async exportDocument(doc) {
      const { Packer } = await import('docx');
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${this.filename}.docx`);
    }
  }
};
</script>