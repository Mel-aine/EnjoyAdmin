<template>

    <div class="print-page p-4">

      <!-- Main Header Box -->
      <div class="border-classic p-4 mb-4">
        <div class="flex justify-between">
          <div>
            <h1 class="text-lg font-bold mb-2">CONFIRM BOOKING</h1>
            <div class="mb-2">
              <strong>BOOKING REFERENCE NO</strong><br>
              <span class="text-xl font-bold">: {{ bookingRef }}</span>
            </div>
            <div class="text-sm">
              Kindly print this confirmation and have it<br>
              ready upon check-in at the Hotel
            </div>
          </div>
          <div class="text-right">
            <h2 class="text-lg font-bold">TAMI SARL (SUITA HOTEL)</h2>
            <div class="text-sm mt-2">
              {{ hotelAddress }}<br>
              <u>{{ hotelEmail }}</u><br>
              Phone : {{ hotelPhone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Guest Information -->
      <div class="mb-4">
        <p class="text-sm">Dear {{ guestName }},</p>
        <p class="text-sm mt-2">
          Thank you for choosing TAMI SARL (SUITA HOTEL) for your stay. We are pleased to inform you that your
          reservation request is CONFIRMED and your reservation details are as follows.
        </p>
      </div>

      <!-- Booking Details -->
      <div class="mb-4">
        <h3 class="font-bold mb-2">Booking Details</h3>
        <div class="text-sm grid grid-cols-2 gap-2">
          <div>Booking Date : {{ booking.bookingDate }}</div>
          <div>Check In Date : {{ booking.checkInDate }}</div>
          <div>Check Out Date : {{ booking.checkOutDate }}</div>
          <div>Nights : {{ booking.nights }}</div>
          <div>Arrival Time : {{ booking.arrivalTime }}</div>
          <div>Special Request :</div>
        </div>
      </div>

      <!-- Your Details -->
      <div class="mb-4">
        <h3 class="font-bold mb-2">Your Details</h3>
        <div class="text-sm">
          {{ guestDetails.name }}<br>
          Email ID :
        </div>
      </div>

      <!-- Rooms Details -->
      <div class="mb-4">
        <h3 class="font-bold mb-2">Rooms Details</h3>
        <table class="w-full  text-sm">
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
            <tr>
              <td class="px-2 py-1">
                {{ roomDetails.type }}<br>
                <span class="text-xs">Description : {{ roomDetails.description }}</span>
              </td>
              <td class=" px-2 py-1">{{ roomDetails.guests }}</td>
              <td class="px-2 py-1">{{ roomDetails.numberOfRooms }}</td>
              <td class="px-2 py-1">{{ roomDetails.package }}</td>
              <td class="px-2 py-1">{{ roomDetails.promotion }}</td>
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
              <th class="px-2 py-1 text-right">Rates (XAF)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-2 py-1">Total Room Charges</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.totalRoomCharges) }}</td>
            </tr>
            <tr>
              <td class="px-2 py-1">Room Charges Tax</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.roomChargesTax) }}</td>
            </tr>
            <tr>
              <td class="px-2 py-1">Inclusions Including Tax</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.inclusionsIncludingTax) }}</td>
            </tr>
            <tr>
              <td class="px-2 py-1">Extra Charges Including Discount and Tax</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.extraCharges) }}</td>
            </tr>
            <tr>
              <td class="px-2 py-1">Round Off</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.roundOff) }}</td>
            </tr>
            <tr class="font-bold">
              <td class="px-2 py-1">Grand Total</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.grandTotal) }}</td>
            </tr>
            <tr>
              <td class="px-2 py-1">Total Paid</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.totalPaid) }}</td>
            </tr>
            <tr class="font-bold">
              <td class="px-2 py-1">Amount due at time of check in</td>
              <td class="px-2 py-1 text-right">{{ formatAmount(rates.amountDue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Booking Amount Box -->
      <div class="flex justify-between items-start mb-4">
        <div class="border-2 border-black p-3">
          <div class="text-center font-bold">
            BOOKING AMOUNT<br>
            XAF {{ formatAmount(rates.grandTotal) }} (XAF)
          </div>
        </div>
        <div class="text-right text-sm">
          <strong>Booked & Payable By</strong><br>
          {{ guestName }}<br>
          {{ guestDetails.country }}
        </div>
      </div>

      <!-- Conditions & Policies -->
      <div class="mb-4">
        <h3 class="font-bold mb-2 bg-gray-200 px-2 py-1 ">Conditions & Policies</h3>
        
        <!-- Page 2 Content -->
        <div class="text-xs leading-tight mt-4">
          <h4 class="font-bold mb-2">Cancellation Policy</h4>
          <p class="mb-2">
            La confirmation est effective lorsqu'un Bon de Commande est déposé dans nos services (SI accepté).
          </p>

          <h4 class="font-bold mb-2">Hotel Policy</h4>
          <p class="mb-2">
            SUITA Hôtel 4 étoiles vous propose : • Restaurant chez Madeleine ouvert de 6h30 au dernier client
          </p>

          <div class="mt-4">
            <strong>Hotel Check in Time : 12:00 PM</strong><br>
            <strong>Hotel Check out Time : 12:00 PM</strong>
          </div>

          <div class="mt-4 boder font-bold text-center">
            <em>This email has been sent from an automated system - please do not reply to it.</em>
          </div>

          <div class="mt-6 mb-4 pt-4 border-t border-black">
            <strong>**** FOR ANY FURTHER QUERY ****</strong><br>
            Contact us by Email Id {{ hotelEmail }}<br>
            Phone NO : {{ hotelPhone }}<br>
            {{ hotelAddress }}
          </div>
          <div class=" border-t  border-black"> </div>
        </div>
      </div>

    </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Interfaces TypeScript
interface BookingDetails {
  bookingDate: string
  checkInDate: string
  checkOutDate: string
  nights: string
  arrivalTime: string
}

interface GuestDetails {
  name: string
  country: string
}

interface RoomDetails {
  type: string
  description: string
  guests: string
  numberOfRooms: string
  package: string
  promotion: string
}

interface RatesDetails {
  totalRoomCharges: number
  roomChargesTax: number
  inclusionsIncludingTax: number
  extraCharges: number
  roundOff: number
  grandTotal: number
  totalPaid: number
  amountDue: number
}

// Données réactives avec types
const bookingRef = ref<string>('7256')
const guestName = ref<string>('XIAOMAOIIN // HUAWEI TECHNOLOGIES')

const hotelAddress = ref<string>('Carrefour Bastos,2723, Yaoundé, Yaoundé - 2723,Centre,Cameroon')
const hotelEmail = ref<string>('reservation@suita-hotel.com')
const hotelPhone = ref<string>('658858585')

const booking = ref<BookingDetails>({
  bookingDate: '07-08-2025',
  checkInDate: '11-08-2025',
  checkOutDate: '25-08-2025 12:00:00',
  nights: '14',
  arrivalTime: '12:00:00'
})

const guestDetails = ref<GuestDetails>({
  name: 'XIAOMAOIIN // HUAWEI TECHNOLOGIES,Cameroon',
  country: 'Cameroon'
})

const roomDetails = ref<RoomDetails>({
  type: 'Lifestyle Suite B&B',
  description: 'Lifestyle Suite B&B',
  guests: '1 adult & 0 child',
  numberOfRooms: '1',
  package: 'None',
  promotion: 'None'
})

const rates = ref<RatesDetails>({
  totalRoomCharges: 824502,
  roomChargesTax: 225498,
  inclusionsIncludingTax: 0,
  extraCharges: 0,
  roundOff: 0,
  grandTotal: 1050000,
  totalPaid: 0,
  amountDue: 1050000
})

// Méthodes
const formatAmount = (amount: number): string => {
  return amount.toLocaleString('fr-FR')
}
</script>

<style scoped>
.document-bg {
  background-color: #f5f5dc;
}

.border-classic {
  border: 2px solid #333;
}

.text-small {
  font-size: 0.75rem;
}

.print-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

@media print {
  .print-page {
    box-shadow: none;
    margin: 0;
  }
}
</style>