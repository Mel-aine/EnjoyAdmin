<template>
 <PdfExporter
 
 :template="{
              id: 'booking-confirmation',
              name: 'Confirmation de Réservation',
              description: 'Confirmation de réservation d\'hôtel',
              component: BookingConfirmationTemplate,
              options: {
                margin: [10, 10, 10, 10],
                jsPDF: { format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
              }
            }" :document-data="finalInvoiceData" :filename="`facture-${invoiceData.invoiceNumber}`"
              button-text="Exporter la facture" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PdfExporter from '@/components/common/PdfExporter.vue'
import InvoiceStandardTemplate from '@/components/common/templates/InvoiceStandardTemplate.vue'
import InvoiceDetailedTemplate from '@/components/common/templates/InvoiceDetailedTemplate.vue'
import BookingConfirmationTemplate from '@/components/common/templates/BookingConfirmationTemplate.vue'

// Données réactives pour la facture
const invoiceData = ref({
  // Type de document pour déterminer les données à utiliser
  documentType: 'invoice', // 'invoice' ou 'booking'
  company: {
    name: 'Ma Société SARL',
    address: '123 Rue de la République',
    city: 'Paris',
    postalCode: '75001',
    phone: '01 23 45 67 89',
    email: 'contact@masociete.fr',
    siret: '12345678901234',
    vatNumber: 'FR12345678901',
    tagline: 'Votre partenaire de confiance',
    website: 'www.masociete.fr',
    rcs: 'RCS Paris B 123 456 789',
    capital: 10000
  },
  customer: {
    name: 'Client Exemple SAS',
    address: '456 Avenue des Champs',
    city: 'Lyon',
    postalCode: '69000',
    email: 'client@exemple.fr',
    phone: '04 56 78 90 12',
    vatNumber: 'FR98765432109'
  },
  invoiceNumber: 'FAC-2024-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  orderNumber: 'CMD-2024-001',
  projectName: 'Projet de développement web',
  projectDescription: 'Développement d\'une application web moderne avec Vue.js et intégration d\'API REST.',
  taxRate: 20,
  items: [
    {
      code: 'DEV-001',
      description: 'Développement frontend Vue.js',
      details: 'Création de l\'interface utilisateur responsive',
      date: new Date().toISOString().split('T')[0],
      quantity: 40,
      unit: 'heures',
      unitPrice: 75,
      discount: 0
    },
    {
      code: 'DEV-002',
      description: 'Intégration API Backend',
      details: 'Connexion avec les services REST',
      date: new Date().toISOString().split('T')[0],
      quantity: 20,
      unit: 'heures',
      unitPrice: 85,
      discount: 5
    }
  ],
  paymentMethod: 'Virement bancaire',
  paymentTerms: 'Paiement à 30 jours par virement bancaire',
  deliveryTerms: 'Livraison sous 15 jours ouvrés',
  warrantyTerms: 'Garantie de 6 mois sur le développement',
  bankDetails: {
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPPXXX',
    bankName: 'BNP Paribas'
  },
  notes: 'Merci de mentionner le numéro de facture lors du paiement.'
})

// Configuration des modèles PDF
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
  },
  {
    id: 'detailed',
    name: 'Modèle Détaillé',
    description: 'Facture complète avec toutes les informations',
    component: InvoiceDetailedTemplate,
    options: {
      margin: [8, 8, 8, 8],
      jsPDF: { format: 'a4', orientation: 'portrait' }
    }
  },
  {
    id: 'booking-confirmation',
    name: 'Confirmation de Réservation',
    description: 'Confirmation de réservation d\'hôtel',
    component: BookingConfirmationTemplate,
    options: {
      margin: [10, 10, 10, 10],
      jsPDF: { format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
  }
]

// Calculs automatiques
const calculatedTotals = computed(() => {
  const subtotal = invoiceData.value.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice
    const discountAmount = item.discount ? (itemTotal * item.discount / 100) : 0
    return sum + (itemTotal - discountAmount)
  }, 0)

  const taxAmount = subtotal * (invoiceData.value.taxRate / 100)
  const total = subtotal + taxAmount

  return { subtotal, taxAmount, total }
})

// Données finales pour le PDF
const finalInvoiceData = computed(() => {
  const data = { ...invoiceData.value }

  // Calculer les totaux pour chaque article
  data.items = data.items.map(item => ({
    ...item,
    total: item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)
  }))

  // Ajouter les totaux calculés
  data.subtotal = calculatedTotals.value.subtotal
  data.taxAmount = calculatedTotals.value.taxAmount
  data.total = calculatedTotals.value.total
  data.totalHT = calculatedTotals.value.subtotal

  return data
})

// Méthodes
const addItem = () => {
  invoiceData.value.items.push({
    code: '',
    description: '',
    details: '',
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
    unit: 'unité',
    unitPrice: 0,
    discount: 0
  })
}

const removeItem = (index: number) => {
  invoiceData.value.items.splice(index, 1)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const loadExample = (type: string) => {
  switch (type) {
    case 'simple':
      invoiceData.value.documentType = 'invoice'
      invoiceData.value.items = [
        {
          code: 'PROD-001',
          description: 'Produit exemple',
          details: '',
          date: new Date().toISOString().split('T')[0],
          quantity: 2,
          unit: 'unité',
          unitPrice: 50,
          discount: 0
        }
      ]
      break
    case 'detailed':
      // Garder les données actuelles (déjà détaillées)
      invoiceData.value.documentType = 'invoice'
      break
    case 'service':
      invoiceData.value.documentType = 'invoice'
      invoiceData.value.items = [
        {
          code: 'SERV-001',
          description: 'Consultation stratégique',
          details: 'Analyse et recommandations pour l\'optimisation des processus',
          date: new Date().toISOString().split('T')[0],
          quantity: 8,
          unit: 'heures',
          unitPrice: 120,
          discount: 10
        },
        {
          code: 'SERV-002',
          description: 'Formation équipe',
          details: 'Formation sur les nouvelles méthodologies',
          date: new Date().toISOString().split('T')[0],
          quantity: 16,
          unit: 'heures',
          unitPrice: 90,
          discount: 0
        }
      ]
      break
    case 'booking':
      invoiceData.value = {
        documentType: 'booking',
        company: {
          name: 'FarmVillaScape.com (Network Gen Infotech Pvt Ltd)',
          address: 'Roselle Avenue Apartments and Villas, Near Julie Jolie Resorts',
          city: 'Vagator / 24 School Lane, New Delhi - 110024',
          postalCode: 'Goa - 403509',
          phone: '9650890085',
          email: 'santosh.mishra@chanpurgreen.com',
          siret: '',
          vatNumber: '',
          tagline: 'Your trusted accommodation partner',
          website: 'www.farmvillascape.com',
          rcs: '',
          capital: 0
        },
        customer: {
          name: 'Sounak Dey',
          address: '',
          city: '',
          postalCode: '',
          email: 'sounak@example.com',
          phone: '',
          vatNumber: ''
        },
        booking: {
          referenceNumber: '210',
          bookingDate: '2023-02-07',
          checkInDate: '2023-02-16',
          checkOutDate: '2023-02-17',
          checkOutTime: '11:00:00 AM',
          nights: 1,
          arrivalTime: '01:00:00 PM',
          specialRequest: ''
        },
        rooms: [
          {
            id: '1',
            type: 'Roselle Apt-EP',
            guests: '4 adult & 0 child',
            quantity: 1,
            package: 'None',
            promotion: 'None'
          }
        ],
        rates: {
          totalRoomCharges: 4464.28,
          roomChargesTax: 535.72,
          extrasIncludingTax: 0.00,
          roundOff: 0.00,
          grandTotal: 5000.00,
          totalPaid: 2000.00,
          amountDue: 3000.00
        },
        currency: 'Rs',
        policies: {
          cancellation: 'Cancellation must be made 24 hours before check-in to avoid charges.',
          additional: [
            'Check-in time is 2:00 PM and check-out time is 11:00 AM',
            'Valid ID proof is required at the time of check-in',
            'Smoking is not allowed in the rooms',
            'Pets are not allowed'
          ]
        },
        invoiceNumber: 'BOOK-2023-210',
        invoiceDate: '2023-02-07',
        dueDate: '2023-02-16',
        taxRate: 12,
        items: [],
        paymentMethod: 'Online Payment',
        paymentTerms: 'Payment due at check-in',
        deliveryTerms: 'Service delivery on arrival',
        warrantyTerms: 'Satisfaction guaranteed',
        bankDetails: {
          iban: '',
          bic: '',
          bankName: ''
        },
        notes: 'Thank you for choosing FarmVillaScape for your accommodation needs.'
      }
      break
  }
}
</script>

<style scoped>
.pdf-export-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.demo-title {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.demo-description {
  font-size: 16px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Configuration des données */
.data-configuration {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-configuration h2 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.config-section h3 {
  font-size: 18px;
  color: #374151;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 5px;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Gestion des articles */
.items-management {
  margin-top: 30px;
}

.items-management h3 {
  font-size: 18px;
  color: #374151;
  margin: 0 0 15px 0;
}

.items-list {
  margin-bottom: 15px;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 80px 100px 100px 40px;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 4px;
}

.item-input {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
}

.item-input-small {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
}

.item-total {
  font-weight: bold;
  color: #059669;
  text-align: right;
  font-size: 13px;
}

.btn-remove {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #dc2626;
}

.btn-add {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-add:hover {
  background: #1d4ed8;
}

/* Section d'exportation */
.export-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.export-section h2 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.export-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

.summary-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 20px;
}

.summary-card h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #374151;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item.total {
  border-top: 2px solid #2563eb;
  margin-top: 10px;
  padding-top: 15px;
  font-size: 16px;
}

.export-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Exemples prédéfinis */
.examples-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.examples-section h2 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.example-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.example-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.example-card h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #1f2937;
}

.example-card p {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.btn-example {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
}

.btn-example:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }

  .export-controls {
    grid-template-columns: 1fr;
  }

  .item-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }
}
</style>