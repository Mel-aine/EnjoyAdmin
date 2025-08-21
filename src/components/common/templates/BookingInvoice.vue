<template>
  <div class="print-page p-4">
    <!-- Main Header Box -->
    <div class="border-classic p-4 mb-4">
      <div class="flex justify-between">
        <div>
          <h1 class="text-lg font-bold mb-2">CONFIRM BOOKING</h1>
          <div class="mb-2">
            <strong>BOOKING REFERENCE NO</strong><br>
            <span class="text-xl font-bold">: {{ data.booking.referenceNumber }}</span>
          </div>
          <div class="text-sm">
            Kindly print this confirmation and have it<br>
            ready upon check-in at the Hotel
          </div>
        </div>
        <div class="text-right">
          <h2 class="text-lg font-bold">{{ data.company.name }}</h2>
          <div class="text-sm mt-2">
            {{ data.company.address }}<br>
            {{ data.company.city }}, {{ data.company.country }}<br>
            <u>{{ data.company.email }}</u><br>
            Phone : {{ data.company.phone }}
          </div>
        </div>
      </div>
    </div>

    <!-- Guest Information -->
    <div class="mb-4">
      <p class="text-sm">Dear {{ data.customer.name }},</p>
      <p class="text-sm mt-2">
        Thank you for choosing {{ data.company.name }} for your stay. We are pleased to inform you that your
        reservation request is CONFIRMED and your reservation details are as follows.
      </p>
    </div>

    <!-- Booking Details -->
    <div class="mb-4">
      <h3 class="font-bold mb-2">Booking Details</h3>
      <div class="text-sm grid grid-cols-2 gap-2">
        <div>Booking Date : {{ formatDate(data.booking.bookingDate) }}</div>
        <div>Check In Date : {{ formatDate(data.booking.checkInDate) }}</div>
        <div>Check Out Date : {{ formatDate(data.booking.checkOutDate) }} {{ data.booking.checkOutTime }}</div>
        <div>Nights : {{ data.booking.nights }}</div>
        <div>Arrival Time : {{ data.booking.arrivalTime }}</div>
        <div>Special Request : {{ data.booking.specialRequest || 'None' }}</div>
      </div>
    </div>

    <!-- Your Details -->
    <div class="mb-4">
      <h3 class="font-bold mb-2">Your Details</h3>
      <div class="text-sm">
        {{ data.customer.name }}<br>
        Email ID : {{ data.customer.email }}
      </div>
    </div>

    <!-- Rooms Details -->
    <div class="mb-4">
      <h3 class="font-bold mb-2">Rooms Details</h3>
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-200">
            <th class="border-gray-400 px-2 py-1 text-left">Room Type</th>
            <th class="border-gray-400 px-2 py-1 text-left">Guest(s)</th>
            <th class="border-gray-400 px-2 py-1 text-left">No of rooms</th>
            <th class="border-gray-400 px-2 py-1 text-left">Package if any</th>
            <th class="border-gray-400 px-2 py-1 text-left">Promotion if any</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in data.rooms" :key="index">
            <td class="px-2 py-1">{{ room.type }}</td>
            <td class="px-2 py-1">{{ room.guests }}</td>
            <td class="px-2 py-1">{{ room.quantity }}</td>
            <td class="px-2 py-1">{{ room.package || 'None' }}</td>
            <td class="px-2 py-1">{{ room.promotion || 'None' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rates Details -->
    <div class="mb-4">
      <h3 class="font-bold mb-2">Rates Details</h3>
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-2 py-1 text-left">Details</th>
            <th class="px-2 py-1 text-right">Rates ({{ data.currency }})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-2 py-1">Total Room Charges</td>
            <td class="px-2 py-1 text-right">{{ formatAmount(data.rates.totalRoomCharges) }}</td>
          </tr>
          <tr>
            <td class="px-2 py-1">Room Charges Tax</td>
            <td class="px-2 py-1 text-right">{{ formatAmount(data.rates.roomChargesTax) }}</td>
          </tr>
          <tr>
            <td class="px-2 py-1">Extras Including Tax</td>
            <td class="px-2 py-1 text-right">{{ formatAmount(data.rates.extrasIncludingTax) }}</td>
          </tr>
          <tr>
            <td class="px-2 py-1">Round Off</td>
            <td class="px-2 py-1 text-right">{{ formatAmount(data.rates.roundOff) }}</td>
          </tr>
          <tr class="font-bold">
            <td class="px-2 py-1">Grand Total</td>
            <td class="px-2 py-1 text-right">{{ formatAmount(data.rates.grandTotal) }}</td>
          </tr>
          <tr>
            <td class="px-2 py-1">Total Paid</td>
            <td class="px-2 py-1 text-right">{{ formatAmount(data.rates.totalPaid) }}</td>
          </tr>
          <tr class="font-bold">
            <td class="px-2 py-1">Amount due at time of check in</td>
            <td class="px-2 py-1 text-right">{{ formatAmount(data.rates.amountDue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Booking Amount Box -->
    <div class="flex justify-between items-start mb-4">
      <div class="border-2 border-black p-3">
        <div class="text-center font-bold">
          BOOKING AMOUNT<br>
          {{ data.currency }} {{ formatAmount(data.rates.grandTotal) }}
        </div>
      </div>
      <div class="text-right text-sm">
        <strong>Booked & Payable By</strong><br>
        {{ data.customer.name }}
      </div>
    </div>

    <!-- Conditions & Policies -->
    <div class="mb-4">
      <h3 class="font-bold mb-2 bg-gray-200 px-2 py-1">Conditions & Policies</h3>
      
      <div class="text-xs leading-tight mt-4">
        <h4 class="font-bold mb-2">Cancellation Policy</h4>
        <p class="mb-2">
          {{ data.policies?.cancellation || 'Please contact the hotel directly for cancellation policy details.' }}
        </p>

        <div v-if="data.policies?.additional" class="mt-2">
          <h4 class="font-bold mb-2">Additional Terms</h4>
          <ul class="list-disc pl-5">
            <li v-for="(term, index) in data.policies.additional" :key="index">{{ term }}</li>
          </ul>
        </div>

        <div class="mt-4">
          <strong>Hotel Check in Time : 12:00 PM</strong><br>
          <strong>Hotel Check out Time : 12:00 PM</strong>
        </div>

        <div class="mt-4 boder font-bold text-center">
          <em>This email has been sent from an automated system - please do not reply to it.</em>
        </div>

        <div class="mt-6 mb-4 pt-4 border-t border-black">
          <strong>**** FOR ANY FURTHER QUERY ****</strong><br>
          Contact us by Email Id {{ data.company.email }}<br>
          Phone NO : {{ data.company.phone }}<br>
          {{ data.company.address }}, {{ data.company.city }}, {{ data.company.country }}
        </div>
        <div class="border-t border-black"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

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
}

defineProps<Props>()

// Méthodes utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>

<style scoped>
.border-classic {
  border: 2px solid #333;
}

.print-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.4;
  color: #333;
}

@media print {
  .print-page {
    box-shadow: none;
    margin: 0;
    width: auto;
    min-height: auto;
  }
}
</style>