<template>
  <div class="booking-confirmation page-break-avoid">
    <!-- Header avec logo et informations de l'entreprise -->
    <div class="header page-break-avoid">
      <div class="company-info">
        <h1 class="company-name">{{ data.company.name }}</h1>
        <div class="company-details">
          <p>{{ data.company.address }}</p>
          <p>{{ data.company.city }}, {{ data.company.country }}</p>
          <p>Email: {{ data.company.email }}</p>
          <p>Phone: {{ data.company.phone }}</p>
        </div>
      </div>
      <div class="confirmation-box">
        <h2>CONFIRM BOOKING</h2>
        <div class="booking-ref">
          <strong>BOOKING REFERENCE NO:</strong>
          <div class="ref-number">{{ data?.booking?.referenceNumber || 'N/A' }}</div>
        </div>
        <p class="print-notice">
          Kindly print this confirmation and have it ready upon check-in at the Hotel
        </p>
      </div>
    </div>

    <!-- Message de remerciement -->
    <div class="thank-you-message page-break-avoid">
      <p>Dear {{ data.customer.name }},</p>
      <p>
        Thank you for choosing {{ data.company.name }} for your stay. We are pleased
        to inform you that your reservation request is CONFIRMED and your reservation details are as follows.
      </p>
    </div>

    <!-- Détails de la réservation -->
    <div class="booking-details page-break-avoid">
      <h3>Booking Details</h3>
      <div class="details-grid">
        <div class="detail-item">
          <span class="label">Booking Date:</span>
          <span class="value">{{ formatDate(data.booking?.bookingDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Check In Date:</span>
          <span class="value">{{ formatDate(data.booking?.checkInDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Check Out Date:</span>
          <span class="value">{{ formatDate(data.booking?.checkOutDate) }} {{ data.booking?.checkOutTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Nights:</span>
          <span class="value">{{ data.booking?.nights }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Arrival Time:</span>
          <span class="value">{{ data.booking?.arrivalTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Special Request:</span>
          <span class="value">{{ data.booking?.specialRequest || 'None' }}</span>
        </div>
      </div>
    </div>

    <!-- Détails du client -->
    <div class="customer-details page-break-avoid">
      <h3>Your Details</h3>
      <div class="details-grid">
        <div class="detail-item">
          <span class="label">Name:</span>
          <span class="value">{{ data.customer.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Email ID:</span>
          <span class="value">{{ data.customer.email }}</span>
        </div>
      </div>
    </div>

    <!-- Détails des chambres -->
    <div class="rooms-details page-break-avoid">
      <h3>Rooms Details</h3>
      <table class="rooms-table no-break">
        <thead>
          <tr>
            <th>Room Type</th>
            <th>Guest(s)</th>
            <th>No of rooms</th>
            <th>Package if any</th>
            <th>Promotion if any</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in data.rooms" :key="room.id" class="page-break-avoid">
            <td>{{ room.type }}</td>
            <td>{{ room.guests }}</td>
            <td>{{ room.quantity }}</td>
            <td>{{ room.package || 'None' }}</td>
            <td>{{ room.promotion || 'None' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Détails des tarifs -->
    <div class="rates-details page-break-avoid">
      <h3>Rates Details</h3>
      <table class="rates-table no-break">
        <thead>
          <tr>
            <th>Details</th>
            <th>Rates ({{ data.currency }})</th>
          </tr>
        </thead>
        <tbody>
          <tr class="page-break-avoid">
            <td>Total Room Charges</td>
            <td class="amount">{{ formatCurrency(data.rates?.totalRoomCharges) }}</td>
          </tr>
          <tr class="page-break-avoid">
            <td>Room Charges Tax</td>
            <td class="amount">{{ formatCurrency(data.rates?.roomChargesTax) }}</td>
          </tr>
          <tr class="page-break-avoid">
            <td>Extras Including Tax</td>
            <td class="amount">{{ formatCurrency(data.rates?.extrasIncludingTax) }}</td>
          </tr>
          <tr class="page-break-avoid">
            <td>Round Off</td>
            <td class="amount">{{ formatCurrency(data.rates?.roundOff) }}</td>
          </tr>
          <tr class="page-break-avoid">
            <td><strong>Grand Total</strong></td>
            <td class="amount"><strong>{{ formatCurrency(data.rates?.grandTotal) }}</strong></td>
          </tr>
          <tr class="page-break-avoid">
            <td>Total Paid</td>
            <td class="amount">{{ formatCurrency(data.rates?.totalPaid) }}</td>
          </tr>
          <tr class="page-break-avoid">
            <td><strong>Amount due at time of check in</strong></td>
            <td class="amount"><strong>{{ formatCurrency(data.rates?.amountDue) }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Montant total dû -->
    <div class="total-amount-box page-break-avoid">
      <div class="total-box">
        <strong>TOTAL AMOUNT DUE</strong><br>
        <span class="total-amount">{{ data.currency }} {{ formatCurrency(data.rates?.amountDue) }}</span>
      </div>
      <div class="booked-by">
        <strong>Booked & Payable By</strong><br>
        {{ data.customer.name }}
      </div>
    </div>

    <!-- Conditions et politiques -->
    <div class="conditions page-break-avoid">
      <h3>Conditions & Policies</h3>
      <div class="policy-section">
        <h4>Cancellation Policy</h4>
        <p v-if="data.policies && data.policies?.cancellation">
          {{ data.policies?.cancellation }}
        </p>
        <p v-else>
          Please contact the hotel directly for cancellation policy details.
        </p>
      </div>
      
      <div class="policy-section" v-if="data.policies && data.policies?.additional">
        <h4>Additional Terms</h4>
        <ul>
          <li v-for="term in data.policies?.additional" :key="term">{{ term }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: {
    company: {
      name: string
      address: string
      city: string
      country: string
      email: string
      phone: string
    }
    booking: {
      referenceNumber: string
      bookingDate: string
      checkInDate: string
      checkOutDate: string
      checkOutTime: string
      nights: number
      arrivalTime: string
      specialRequest?: string
    }
    customer: {
      name: string
      email: string
    }
    rooms: Array<{
      id: string
      type: string
      guests: string
      quantity: number
      package?: string
      promotion?: string
    }>
    rates: {
      totalRoomCharges: number
      roomChargesTax: number
      extrasIncludingTax: number
      roundOff: number
      grandTotal: number
      totalPaid: number
      amountDue: number
    }
    currency: string
    policies?: {
      cancellation?: string
      additional?: string[]
    }
  }
  templateConfig?: any
}

defineProps<Props>()

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return amount?.toFixed(2)
}
</script>

<style scoped>
/* Classes importantes pour éviter les coupures de page */
.page-break-avoid {
  page-break-inside: avoid;
  break-inside: avoid;
}

.no-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

.booking-confirmation {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.4;
  color: #333;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border: 2px solid #000;
  padding: 15px;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.company-details {
  font-size: 12px;
  line-height: 1.3;
}

.company-details p {
  margin: 2px 0;
}

.confirmation-box {
  text-align: center;
  border-left: 2px solid #000;
  padding-left: 15px;
  max-width: 300px;
}

.confirmation-box h2 {
  font-size: 16px;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.booking-ref {
  margin: 10px 0;
}

.ref-number {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
}

.print-notice {
  font-size: 11px;
  margin: 10px 0 0 0;
  line-height: 1.3;
}

/* Message de remerciement */
.thank-you-message {
  margin: 20px 0;
  font-size: 14px;
}

.thank-you-message p {
  margin: 10px 0;
}

/* Sections de détails */
h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  font-size: 14px;
}

.label {
  font-weight: bold;
  min-width: 120px;
  margin-right: 10px;
}

.value {
  flex: 1;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 13px;
}

th, td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.amount {
  text-align: right;
}

/* Boîte du montant total */
.total-amount-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.total-box {
  border: 2px solid #000;
  padding: 15px;
  text-align: center;
  font-size: 14px;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
}

.booked-by {
  text-align: right;
  font-size: 14px;
}

/* Conditions et politiques */
.conditions {
  margin-top: 20px;
}

.policy-section {
  margin: 15px 0;
}

.policy-section h4 {
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0 5px 0;
  border: 1px solid #000;
  padding: 5px;
  background-color: #f5f5f5;
}

.policy-section p {
  font-size: 13px;
  margin: 5px 0;
}

.policy-section ul {
  font-size: 13px;
  margin: 5px 0;
  padding-left: 20px;
}

.policy-section li {
  margin: 3px 0;
}

/* Styles pour l'impression */
@media print {
  .booking-confirmation {
    margin: 0;
    padding: 15mm;
    max-width: none;
  }
  
  .header {
    border: 2px solid #000 !important;
  }
  
  table, th, td {
    border: 1px solid #000 !important;
  }
  
  .total-box {
    border: 2px solid #000 !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }
  
  .confirmation-box {
    border-left: none;
    border-top: 2px solid #000;
    padding-left: 0;
    padding-top: 15px;
    margin-top: 15px;
    max-width: none;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .total-amount-box {
    flex-direction: column;
    gap: 15px;
  }
  
  .booked-by {
    text-align: center;
  }
}
</style>