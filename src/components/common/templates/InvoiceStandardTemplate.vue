<template>
  <div class="invoice-template standard-template">
    <!-- En-tête de la facture -->
    <div class="header page-break-avoid">
      <div class="company-info">
        <h1 class="company-name">{{ data.company?.name || 'Nom de l\'entreprise' }}</h1>
        <div class="company-details">
          <p>{{ data.company?.address || 'Adresse de l\'entreprise' }}</p>
          <p>{{ data.company?.city || 'Ville' }}, {{ data.company?.postalCode || 'Code postal' }}</p>
          <p>Tél: {{ data.company?.phone || 'Téléphone' }}</p>
          <p>Email: {{ data.company?.email || 'email@entreprise.com' }}</p>
        </div>
      </div>
      
      <div class="invoice-info">
        <h2 class="invoice-title">FACTURE</h2>
        <div class="invoice-details">
          <p><strong>N° Facture:</strong> {{ data.invoiceNumber || 'INV-001' }}</p>
          <p><strong>Date:</strong> {{ formatDate(data.invoiceDate) }}</p>
          <p><strong>Date d'échéance:</strong> {{ formatDate(data.dueDate) }}</p>
        </div>
      </div>
    </div>

    <!-- Informations client -->
    <div class="customer-info page-break-avoid">
      <h3>Facturé à:</h3>
      <div class="customer-details">
        <p><strong>{{ data.customer?.name || 'Nom du client' }}</strong></p>
        <p>{{ data.customer?.address || 'Adresse du client' }}</p>
        <p>{{ data.customer?.city || 'Ville' }}, {{ data.customer?.postalCode || 'Code postal' }}</p>
        <p v-if="data.customer?.email">Email: {{ data.customer.email }}</p>
        <p v-if="data.customer?.phone">Tél: {{ data.customer.phone }}</p>
      </div>
    </div>

    <!-- Tableau des articles -->
    <div class="items-section">
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.items" :key="index" class="page-break-avoid">
            <td>{{ item.description }}</td>
            <td class="text-center">{{ item.quantity }}</td>
            <td class="text-right">{{ formatCurrency(item.unitPrice) }}</td>
            <td class="text-right">{{ formatCurrency(item.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totaux -->
    <div class="totals-section page-break-avoid">
      <div class="totals-table">
        <div class="total-row">
          <span>Sous-total:</span>
          <span>{{ formatCurrency(data.subtotal) }}</span>
        </div>
        <div class="total-row" v-if="data.taxRate">
          <span>TVA ({{ data.taxRate }}%):</span>
          <span>{{ formatCurrency(data.taxAmount) }}</span>
        </div>
        <div class="total-row total-final">
          <span><strong>Total:</strong></span>
          <span><strong>{{ formatCurrency(data.total) }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Conditions de paiement -->
    <div class="payment-terms page-break-avoid" v-if="data.paymentTerms">
      <h4>Conditions de paiement:</h4>
      <p>{{ data.paymentTerms }}</p>
    </div>

    <!-- Notes -->
    <div class="notes page-break-avoid" v-if="data.notes">
      <h4>Notes:</h4>
      <p>{{ data.notes }}</p>
    </div>

    <!-- Pied de page -->
    <div class="footer page-break-avoid">
      <p class="thank-you">Merci pour votre confiance!</p>
      <div class="footer-info">
        <p v-if="data.company?.siret">SIRET: {{ data.company.siret }}</p>
        <p v-if="data.company?.vatNumber">N° TVA: {{ data.company.vatNumber }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InvoiceData {
  company?: {
    name?: string
    address?: string
    city?: string
    postalCode?: string
    phone?: string
    email?: string
    siret?: string
    vatNumber?: string
  }
  customer?: {
    name?: string
    address?: string
    city?: string
    postalCode?: string
    email?: string
    phone?: string
  }
  invoiceNumber?: string
  invoiceDate?: string
  dueDate?: string
  items?: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal?: number
  taxRate?: number
  taxAmount?: number
  total?: number
  paymentTerms?: string
  notes?: string
}

interface Props {
  data: InvoiceData
  templateConfig?: any
}

defineProps<Props>()

// Fonctions utilitaires
const formatDate = (dateString?: string) => {
  if (!dateString) return new Date().toLocaleDateString('fr-FR')
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<style scoped>
.invoice-template {
  max-width: 210mm;
  margin: 0 auto;
  padding: 20mm;
  font-family: 'Arial', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #333;
  background: white;
}

/* En-tête */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e5e5;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 10px 0;
}

.company-details {
  font-size: 11px;
  line-height: 1.3;
}

.company-details p {
  margin: 2px 0;
}

.invoice-title {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 15px 0;
  text-align: right;
}

.invoice-details {
  text-align: right;
  font-size: 11px;
}

.invoice-details p {
  margin: 3px 0;
}

/* Informations client */
.customer-info {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8fafc;
  border-left: 4px solid #2563eb;
}

.customer-info h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #1f2937;
}

.customer-details p {
  margin: 2px 0;
  font-size: 11px;
}

/* Tableau des articles */
.items-section {
  margin-bottom: 30px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.items-table th {
  background-color: #2563eb;
  color: white;
  padding: 12px 8px;
  text-align: left;
  font-weight: bold;
  font-size: 11px;
}

.items-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #e5e5e5;
  font-size: 11px;
}

.items-table tr:nth-child(even) {
  background-color: #f8fafc;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* Totaux */
.totals-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

.totals-table {
  min-width: 250px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e5e5;
  font-size: 12px;
}

.total-final {
  border-bottom: 2px solid #2563eb;
  border-top: 2px solid #2563eb;
  font-size: 14px;
  margin-top: 5px;
  padding-top: 10px;
}

/* Conditions et notes */
.payment-terms,
.notes {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8fafc;
  border-radius: 4px;
}

.payment-terms h4,
.notes h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #1f2937;
}

.payment-terms p,
.notes p {
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
}

/* Pied de page */
.footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
  text-align: center;
}

.thank-you {
  font-size: 14px;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 10px 0;
}

.footer-info {
  font-size: 10px;
  color: #6b7280;
}

.footer-info p {
  margin: 2px 0;
}

/* Classes pour éviter les coupures de page */
.page-break-avoid {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Styles d'impression */
@media print {
  .invoice-template {
    margin: 0;
    padding: 15mm;
  }
  
  .page-break-avoid {
    page-break-inside: avoid;
  }
}
</style>