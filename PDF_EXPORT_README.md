# Fonctionnalité d'Exportation PDF

Cette documentation explique comment utiliser la fonctionnalité d'exportation de documents PDF dans l'application Vue.js.

## Vue d'ensemble

La fonctionnalité d'exportation PDF permet de :
- **Prévisualiser** le document de manière interactive dans un modal
- **Gérer plusieurs modèles** de documents (standard et détaillé)
- **Générer un fichier PDF** à partir du modèle choisi et des données dynamiques
- **Télécharger ou imprimer** le PDF,,
- **Éviter les coupures de page** disgracieuses

## Technologies utilisées

### 1. html2pdf.js (Générateur de PDF)
- **Rôle** : Convertit un élément HTML en fichier PDF
- **Fonctionnement** : Prend une "photo" du composant Vue et la transforme en PDF
- **Point clé** : Utilise `page-break-inside: avoid;` pour éviter les coupures de page

### 2. @vue-pdf-viewer/viewer (Visualiseur de PDF)
- **Rôle** : Affiche le fichier PDF généré dans l'interface
- **Fonctionnement** : Prend le Blob PDF et l'affiche avec une interface complète
- **Avantages** : Interface de lecteur PDF professionnelle (zoom, pagination, etc.)

## Structure des fichiers

```
src/
├── components/
│   └── common/
│       ├── PdfExporter.vue              # Composant principal d'exportation
│       └── templates/
│           ├── InvoiceStandardTemplate.vue   # Modèle de facture standard
│           └── InvoiceDetailedTemplate.vue   # Modèle de facture détaillée
├── views/
│   └── Others/
│       └── PdfExportDemo.vue            # Page de démonstration
├── types/
│   └── html2pdf.d.ts                   # Déclarations TypeScript
└── router/
    └── index.ts                         # Route ajoutée
```

## Utilisation du composant PdfExporter

### Import et utilisation basique

```vue
<template>
  <div>
    <PdfExporter
      :templates="pdfTemplates"
      :document-data="invoiceData"
      :filename="'ma-facture'"
      button-text="Exporter PDF"
    />
  </div>
</template>

<script setup>
import PdfExporter from '@/components/common/PdfExporter.vue'
import InvoiceStandardTemplate from '@/components/common/templates/InvoiceStandardTemplate.vue'

const pdfTemplates = [
  {
    id: 'standard',
    name: 'Modèle Standard',
    description: 'Facture simple et épurée',
    component: InvoiceStandardTemplate,
    options: {
      margin: [10, 10, 10, 10],
      jsPDF: { format: 'a4', orientation: 'portrait' }
    }
  }
]

const invoiceData = {
  company: {
    name: 'Ma Société',
    address: '123 Rue Example',
    // ...
  },
  customer: {
    name: 'Client Example',
    // ...
  },
  items: [
    {
      description: 'Service 1',
      quantity: 2,
      unitPrice: 100,
      total: 200
    }
  ]
}
</script>
```

### Props du composant PdfExporter

| Prop | Type | Description | Défaut |
|------|------|-------------|---------|
| `templates` | `Template[]` | Liste des modèles disponibles | Requis |
| `documentData` | `any` | Données à injecter dans le template | Requis |
| `buttonText` | `string` | Texte du bouton d'ouverture | 'Exporter PDF' |
| `filename` | `string` | Nom du fichier PDF | 'document' |

### Interface Template

```typescript
interface Template {
  id: string                    // Identifiant unique
  name: string                  // Nom affiché à l'utilisateur
  description: string           // Description du modèle
  component: any                // Composant Vue du template
  options?: Html2PdfOptions     // Options spécifiques html2pdf
}
```

## Création d'un nouveau modèle

### 1. Créer le composant template

```vue
<template>
  <div class="my-template page-break-avoid">
    <!-- Contenu du template -->
    <div class="header page-break-avoid">
      <h1>{{ data.title }}</h1>
    </div>
    
    <div class="content">
      <!-- Utiliser page-break-avoid pour éviter les coupures -->
      <table class="no-break">
        <tr v-for="item in data.items" :key="item.id" class="page-break-avoid">
          <td>{{ item.name }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
interface Props {
  data: any
  templateConfig?: any
}

defineProps<Props>()
</script>

<style scoped>
/* Classes importantes pour éviter les coupures */
.page-break-avoid {
  page-break-inside: avoid;
  break-inside: avoid;
}

.no-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Styles pour l'impression */
@media print {
  .my-template {
    margin: 0;
    padding: 15mm;
  }
}
</style>
```

### 2. Ajouter le modèle à la configuration

```javascript
import MyTemplate from '@/components/common/templates/MyTemplate.vue'

const templates = [
  {
    id: 'my-template',
    name: 'Mon Modèle',
    description: 'Description de mon modèle',
    component: MyTemplate,
    options: {
      margin: [15, 15, 15, 15],
      jsPDF: { 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'] 
      }
    }
  }
]
```

## Bonnes pratiques

### 1. Éviter les coupures de page

```css
/* Appliquer sur les éléments qui ne doivent pas être coupés */
.page-break-avoid {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Pour les tableaux */
table {
  page-break-inside: avoid;
}

tr {
  page-break-inside: avoid;
}
```

### 2. Optimisation des performances

```javascript
// Utiliser des options optimisées
const options = {
  html2canvas: {
    scale: 2,              // Qualité d'image
    useCORS: true,         // Pour les images externes
    letterRendering: true  // Meilleur rendu du texte
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  }
}
```

### 3. Gestion des données

```javascript
// Structurer les données de manière cohérente
const documentData = {
  // Informations de base
  title: 'Mon Document',
  date: new Date().toISOString(),
  
  // Données métier
  items: [],
  totals: {},
  
  // Configuration
  options: {}
}
```

## Fonctionnalités avancées

### 1. Modèles conditionnels

```vue
<template>
  <div class="template">
    <!-- Affichage conditionnel selon le type -->
    <div v-if="templateConfig.showLogo" class="logo">
      <!-- Logo -->
    </div>
    
    <div v-if="data.type === 'invoice'" class="invoice-specific">
      <!-- Contenu spécifique aux factures -->
    </div>
  </div>
</template>
```

### 2. Formatage automatique

```javascript
// Fonctions utilitaires dans le template
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}
```

### 3. Validation des données

```javascript
// Valider les données avant génération
const validateData = (data) => {
  const required = ['title', 'items']
  return required.every(field => data[field] !== undefined)
}
```

## Démonstration

Pour voir la fonctionnalité en action :

1. Démarrer le serveur de développement : `npm run dev`
2. Naviguer vers : `http://localhost:5173/pdf-export-demo`
3. Configurer les données dans l'interface
4. Tester les différents modèles
5. Générer et télécharger le PDF

## Dépannage

### Problèmes courants

1. **Coupures de page** : Ajouter `page-break-inside: avoid;` aux éléments concernés
2. **Images manquantes** : Utiliser `useCORS: true` dans les options html2canvas
3. **Qualité faible** : Augmenter le `scale` dans html2canvas
4. **Erreurs TypeScript** : Vérifier les déclarations dans `html2pdf.d.ts`

### Logs de débogage

```javascript
// Activer les logs pour le débogage
const generatePdf = async () => {
  try {
    console.log('Données:', documentData)
    console.log('Options:', options)
    
    const pdf = await html2pdf()
      .set(options)
      .from(element)
      .outputPdf('blob')
      
    console.log('PDF généré:', pdf)
  } catch (error) {
    console.error('Erreur PDF:', error)
  }
}
```

## Conclusion

Cette fonctionnalité offre une solution complète pour l'exportation de documents PDF avec :
- Interface utilisateur intuitive
- Modèles personnalisables
- Prévisualisation en temps réel
- Gestion des coupures de page
- Support TypeScript complet

Pour toute question ou amélioration, consultez la documentation des bibliothèques utilisées ou créez un ticket dans le projet.
