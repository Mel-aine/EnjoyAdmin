<template>
  <div class="invoice-template detailed-template">
    <!-- En-tête avec logo et informations complètes -->
    <div class="header page-break-avoid">
      <div class="header-top">
        <div class="logo-section">
          <div class="logo-placeholder">
            <svg class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
            </svg>
          </div>
          <div class="company-info">
            <h1 class="company-name">{{ data.company?.name || 'Nom de l\'entreprise' }}</h1>
            <p class="company-tagline">{{ data.company?.tagline || 'Votre partenaire de confiance' }}</p>
          </div>
        </div>
        
        <div class="invoice-header-info">
          <h2 class="invoice-title">FACTURE DÉTAILLÉE</h2>
          <div class="invoice-number">{{ data.invoiceNumber || 'INV-001' }}</div>
        </div>
      </div>
      
      <div class="header-details">
        <div class="company-full-info">
          <h3>Informations de l'entreprise</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Adresse:</strong>
              <p>{{ data.company?.address || 'Adresse de l\'entreprise' }}</p>
              <p>{{ data.company?.city || 'Ville' }}, {{ data.company?.postalCode || 'Code postal' }}</p>
              <p>{{ data.company?.country || 'France' }}</p>
            </div>
            <div class="info-item">
              <strong>Contact:</strong>
              <p>Tél: {{ data.company?.phone || 'Téléphone' }}</p>
              <p>Email: {{ data.company?.email || 'email@entreprise.com' }}</p>
              <p v-if="data.company?.website">Web: {{ data.company.website }}</p>
            </div>
            <div class="info-item">
              <strong>Informations légales:</strong>
              <p v-if="data.company?.siret">SIRET: {{ data.company.siret }}</p>
              <p v-if="data.company?.vatNumber">N° TVA: {{ data.company.vatNumber }}</p>
              <p v-if="data.company?.rcs">RCS: {{ data.company.rcs }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Informations de facturation -->
    <div class="billing-section page-break-avoid">
      <div class="billing-grid">
        <div class="customer-info">
          <h3>Facturé à:</h3>
          <div class="customer-card">
            <h4>{{ data.customer?.name || 'Nom du client' }}</h4>
            <div class="customer-details">
              <p>{{ data.customer?.address || 'Adresse du client' }}</p>
              <p>{{ data.customer?.city || 'Ville' }}, {{ data.customer?.postalCode || 'Code postal' }}</p>
              <p>{{ data.customer?.country || 'France' }}</p>
              <div class="contact-info">
                <p v-if="data.customer?.email"><strong>Email:</strong> {{ data.customer.email }}</p>
                <p v-if="data.customer?.phone"><strong>Tél:</strong> {{ data.customer.phone }}</p>
                <p v-if="data.customer?.vatNumber"><strong>N° TVA:</strong> {{ data.customer.vatNumber }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="invoice-meta">
          <h3>Détails de la facture:</h3>
          <div class="meta-card">
            <div class="meta-item">
              <span class="label">Date de facture:</span>
              <span class="value">{{ formatDate(data.invoiceDate) }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Date d'échéance:</span>
              <span class="value">{{ formatDate(data.dueDate) }}</span>
            </div>
            <div class="meta-item" v-if="data.orderNumber">
              <span class="label">N° de commande:</span>
              <span class="value">{{ data.orderNumber }}</span>
            </div>
            <div class="meta-item" v-if="data.projectName">
              <span class="label">Projet:</span>
              <span class="value">{{ data.projectName }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Conditions de paiement:</span>
              <span class="value">{{ data.paymentTerms || '30 jours' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Description du projet/service -->
    <div class="project-description page-break-avoid" v-if="data.projectDescription">
      <h3>Description du projet/service:</h3>
      <div class="description-content">
        <p>{{ data.projectDescription }}</p>
      </div>
    </div>

    <!-- Tableau détaillé des articles -->
    <div class="items-section">
      <h3>Détail des prestations:</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th class="item-code">Réf.</th>
            <th class="item-description">Description</th>
            <th class="item-date">Date</th>
            <th class="item-quantity">Qté</th>
            <th class="item-unit">Unité</th>
            <th class="item-price">Prix unit.</th>
            <th class="item-discount">Remise</th>
            <th class="item-total">Total HT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.items" :key="index" class="page-break-avoid">
            <td class="item-code">{{ item.code || '-' }}</td>
            <td class="item-description">
              <div class="description-main">{{ item.description }}</div>
              <div class="description-detail" v-if="item.details">{{ item.details }}</div>
            </td>
            <td class="item-date">{{ formatDate(item.date) }}</td>
            <td class="item-quantity">{{ item.quantity }}</td>
            <td class="item-unit">{{ item.unit || 'unité' }}</td>
            <td class="item-price">{{ formatCurrency(item.unitPrice) }}</td>
            <td class="item-discount">{{ item.discount ? item.discount + '%' : '-' }}</td>
            <td class="item-total">{{ formatCurrency(item.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Récapitulatif détaillé -->
    <div class="summary-section page-break-avoid">
      <div class="summary-grid">
        <div class="payment-info">
          <h4>Informations de paiement:</h4>
          <div class="payment-details">
            <p><strong>Mode de paiement:</strong> {{ data.paymentMethod || 'Virement bancaire' }}</p>
            <div v-if="data.bankDetails" class="bank-details">
              <p><strong>Coordonnées bancaires:</strong></p>
              <p>IBAN: {{ data.bankDetails.iban }}</p>
              <p>BIC: {{ data.bankDetails.bic }}</p>
              <p>Banque: {{ data.bankDetails.bankName }}</p>
            </div>
          </div>
        </div>
        
        <div class="totals-section">
          <div class="totals-table">
            <div class="total-row">
              <span>Sous-total HT:</span>
              <span>{{ formatCurrency(data.subtotal) }}</span>
            </div>
            <div class="total-row" v-if="data.discountAmount">
              <span>Remise globale:</span>
              <span>-{{ formatCurrency(data.discountAmount) }}</span>
            </div>
            <div class="total-row" v-if="data.shippingCost">
              <span>Frais de port:</span>
              <span>{{ formatCurrency(data.shippingCost) }}</span>
            </div>
            <div class="total-row subtotal-line">
              <span>Total HT:</span>
              <span>{{ formatCurrency(data.totalHT || data.subtotal) }}</span>
            </div>
            <div class="total-row" v-if="data.taxRate">
              <span>TVA ({{ data.taxRate }}%):</span>
              <span>{{ formatCurrency(data.taxAmount) }}</span>
            </div>
            <div class="total-row total-final">
              <span><strong>Total TTC:</strong></span>
              <span><strong>{{ formatCurrency(data.total) }}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conditions générales -->
    <div class="terms-section page-break-avoid">
      <h4>Conditions générales:</h4>
      <div class="terms-content">
        <div class="terms-grid">
          <div class="term-item">
            <strong>Paiement:</strong>
            <p>{{ data.paymentTerms || 'Paiement à 30 jours par virement bancaire. Tout retard de paiement entraînera des pénalités de 3 fois le taux légal.' }}</p>
          </div>
          <div class="term-item">
            <strong>Livraison:</strong>
            <p>{{ data.deliveryTerms || 'Les délais de livraison sont donnés à titre indicatif et ne sont pas contractuels.' }}</p>
          </div>
          <div class="term-item">
            <strong>Garantie:</strong>
            <p>{{ data.warrantyTerms || 'Garantie légale selon les conditions générales de vente.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes et commentaires -->
    <div class="notes-section page-break-avoid" v-if="data.notes">
      <h4>Notes et commentaires:</h4>
      <div class="notes-content">
        <p>{{ data.notes }}</p>
      </div>
    </div>

    <!-- Pied de page détaillé -->
    <div class="footer page-break-avoid">
      <div class="footer-content">
        <div class="footer-left">
          <p class="thank-you">Merci pour votre confiance!</p>
          <p class="contact-footer">Pour toute question concernant cette facture, contactez-nous au {{ data.company?.phone || 'téléphone' }}</p>
        </div>
        <div class="footer-right">
          <div class="legal-info">
            <p v-if="data.company?.siret">SIRET: {{ data.company.siret }}</p>
            <p v-if="data.company?.vatNumber">N° TVA Intracommunautaire: {{ data.company.vatNumber }}</p>
            <p v-if="data.company?.rcs">{{ data.company.rcs }}</p>
            <p v-if="data.company?.capital">Capital social: {{ formatCurrency(data.company.capital) }}</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Document généré le {{ formatDate(new Date().toISOString()) }} - Page 1/1</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DetailedInvoiceData {
  company?: {
    name?: string
    tagline?: string
    address?: string
    city?: string
    postalCode?: string
    country?: string
    phone?: string
    email?: string
    website?: string
    siret?: string
    vatNumber?: string
    rcs?: string
    capital?: number
  }
  customer?: {
    name?: string
    address?: string
    city?: string
    postalCode?: string
    country?: string
    email?: string
    phone?: string
    vatNumber?: string
  }
  invoiceNumber?: string
  invoiceDate?: string
  dueDate?: string
  orderNumber?: string
  projectName?: string
  projectDescription?: string
  items?: Array<{
    code?: string
    description: string
    details?: string
    date?: string
    quantity: number
    unit?: string
    unitPrice: number
    discount?: number
    total: number
  }>
  subtotal?: number
  discountAmount?: number
  shippingCost?: number
  totalHT?: number
  taxRate?: number
  taxAmount?: number
  total?: number
  paymentMethod?: string
  paymentTerms?: string
  deliveryTerms?: string
  warrantyTerms?: string
  bankDetails?: {
    iban?: string
    bic?: string
    bankName?: string
  }
  notes?: string
}

interface Props {
  data: DetailedInvoiceData
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
  padding: 15mm;
  font-family: 'Arial', sans-serif;
  font-size: 11px;
  line-height: 1.4;
  color: #333;
  background: white;
}

/* En-tête détaillé */
.header {
  margin-bottom: 25px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 3px solid #2563eb;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-placeholder {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-name {
  font-size: 22px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 5px 0;
}

.company-tagline {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  font-style: italic;
}

.invoice-title {
  font-size: 24px;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 8px 0;
  text-align: right;
}

.invoice-number {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  text-align: right;
  padding: 8px 15px;
  background: #f3f4f6;
  border-radius: 4px;
}

.header-details {
  background: #f8fafc;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #2563eb;
}

.company-full-info h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1f2937;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.info-item strong {
  display: block;
  margin-bottom: 5px;
  color: #374151;
  font-size: 11px;
}

.info-item p {
  margin: 2px 0;
  font-size: 10px;
  color: #6b7280;
}

/* Section de facturation */
.billing-section {
  margin-bottom: 25px;
}

.billing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.customer-info h3,
.invoice-meta h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1f2937;
}

.customer-card,
.meta-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 15px;
}

.customer-card h4 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #2563eb;
  font-weight: bold;
}

.customer-details p {
  margin: 2px 0;
  font-size: 10px;
}

.contact-info {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-item .label {
  font-weight: 500;
  color: #374151;
  font-size: 10px;
}

.meta-item .value {
  font-weight: bold;
  color: #1f2937;
  font-size: 10px;
}

/* Description du projet */
.project-description {
  margin-bottom: 25px;
  padding: 15px;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 4px;
}

.project-description h3 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #92400e;
}

.description-content p {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
}

/* Tableau détaillé */
.items-section {
  margin-bottom: 25px;
}

.items-section h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1f2937;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9px;
}

.items-table th {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  padding: 10px 6px;
  text-align: left;
  font-weight: bold;
  font-size: 9px;
}

.items-table td {
  padding: 8px 6px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
}

.items-table tr:nth-child(even) {
  background-color: #f9fafb;
}

.item-code { width: 8%; text-align: center; }
.item-description { width: 30%; }
.item-date { width: 10%; text-align: center; }
.item-quantity { width: 8%; text-align: center; }
.item-unit { width: 8%; text-align: center; }
.item-price { width: 12%; text-align: right; }
.item-discount { width: 8%; text-align: center; }
.item-total { width: 12%; text-align: right; }

.description-main {
  font-weight: 500;
  margin-bottom: 2px;
}

.description-detail {
  font-size: 8px;
  color: #6b7280;
  font-style: italic;
}

/* Récapitulatif */
.summary-section {
  margin-bottom: 25px;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 25px;
}

.payment-info h4 {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #1f2937;
}

.payment-details {
  background: #f0f9ff;
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid #0ea5e9;
}

.payment-details p {
  margin: 3px 0;
  font-size: 10px;
}

.bank-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #bae6fd;
}

.totals-table {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 11px;
}

.total-row:last-child {
  border-bottom: none;
}

.subtotal-line {
  border-top: 1px solid #d1d5db;
  background: #f9fafb;
}

.total-final {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  font-size: 13px;
  font-weight: bold;
}

/* Conditions générales */
.terms-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 6px;
}

.terms-section h4 {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #1f2937;
}

.terms-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.term-item strong {
  display: block;
  margin-bottom: 3px;
  color: #374151;
  font-size: 10px;
}

.term-item p {
  margin: 0;
  font-size: 9px;
  color: #6b7280;
  line-height: 1.4;
}

/* Notes */
.notes-section {
  margin-bottom: 20px;
  padding: 12px;
  background: #fef7cd;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
}

.notes-section h4 {
  margin: 0 0 8px 0;
  font-size: 11px;
  color: #92400e;
}

.notes-content p {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
}

/* Pied de page */
.footer {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 2px solid #e5e7eb;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.thank-you {
  font-size: 13px;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 5px 0;
}

.contact-footer {
  font-size: 10px;
  color: #6b7280;
  margin: 0;
}

.legal-info {
  text-align: right;
}

.legal-info p {
  margin: 2px 0;
  font-size: 9px;
  color: #6b7280;
}

.footer-bottom {
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
}

.footer-bottom p {
  margin: 0;
  font-size: 8px;
  color: #9ca3af;
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
    padding: 10mm;
  }
  
  .page-break-avoid {
    page-break-inside: avoid;
  }
}
</style>