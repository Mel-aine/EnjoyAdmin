<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
        ></div>
        <p class="text-gray-600">Loading your reservation...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        <svg
          class="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Reservation</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="goBack"
          class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-semibold"
        >
          Back to Booking
        </button>
      </div>
    </div>

    <!-- Success State -->
    <div v-else class="printable">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span class="font-semibold text-lg">{{ reservation.hotelName }}</span>
          </div>
          <button
            @click="goBack"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 no-print"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span class="text-sm">Back to Booking</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-3xl mx-auto px-3 py-10">
        <div class="bg-white rounded-lg shadow p-8 mb-4">
          <div class="text-center mb-3">
            <div
              class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2"
            >
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
            <p class="text-gray-600 text-sm mb-2">Your reservation is confirmed</p>
            <div
              class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
            >
              <span>Confirmation:</span>
              <span class="font-bold">{{ reservation.confirmationNumber }}</span>
            </div>
          </div>

          <!-- Details -->
          <div class="border-t pt-3 text-sm">
            <h2 class="text-base font-semibold mb-2">Reservation Details</h2>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="bg-gray-50 rounded p-2">
                <p class="text-gray-600 text-xs">Check-in</p>
                <p class="font-semibold">{{ formatDate(reservation.checkIn) }}</p>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <p class="text-gray-600 text-xs">Check-out</p>
                <p class="font-semibold">{{ formatDate(reservation.checkOut) }}</p>
              </div>
            </div>

            <div class="bg-gray-50 rounded p-2 mb-3">
              <p class="text-gray-600 text-xs mb-1">Guest</p>
              <p class="font-semibold">{{ reservation.guestName }}</p>
              <p class="text-xs text-gray-600">{{ reservation.email }}</p>
            </div>

            <div class="mb-3">
              <h3 class="text-sm font-semibold mb-1">Rooms</h3>
              <div
                v-for="(room, index) in reservation.rooms"
                :key="index"
                class="bg-gray-50 rounded p-2 flex justify-between items-center mb-1"
              >
                <div>
                  <p class="font-medium">{{ room.name }}</p>
                  <p class="text-xs text-gray-600">{{ room.plan }} • {{ room.quantity }} room(s)</p>
                </div>
                <p class="font-semibold text-sm">{{ formatCurrency(room.price) }}</p>
              </div>
            </div>

            <div class="border-t pt-2 space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Subtotal</span><span>{{ formatCurrency(reservation.subtotal || 0) }}</span>
              </div>
              <div v-if="reservation.taxes" class="flex justify-between">
                <span>Taxes</span><span>{{ formatCurrency(reservation.taxes) }}</span>
              </div>
              <div class="flex justify-between font-bold border-t pt-1 text-blue-700">
                <span>Total</span><span>{{ formatCurrency(reservation.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="grid grid-cols-2 gap-2 no-print">
          <button
            @click="printConfirmation"
            class="flex items-center justify-center gap-1 border text-gray-700 rounded px-3 py-2 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
          <button
            @click="makeAnotherBooking"
            class="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm font-semibold"
          >
            New Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingSummaryStore } from '@/views/ota/composables/bookingSummary'
import { getReservationById } from '@/views/ota/services/otaApi'

interface Room {
  name: string
  plan: string
  quantity: number
  adults: number
  children: number
  price: number
}

interface Reservation {
  id: string
  confirmationNumber: string
  hotelName: string
  guestName: string
  email: string
  phone?: string
  checkIn: string
  checkOut: string
  nights: number
  rooms: Room[]
  subtotal?: number
  taxes: number
  discount: number
  total: number
  currency: string
}

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingSummaryStore()

// États
const isLoading = ref(false)
const error = ref<string | null>(null)

// Données de réservation
const reservation = ref<Reservation>({
  id: '',
  confirmationNumber: '',
  hotelName: '',
  guestName: '',
  email: '',
  phone: '',
  checkIn: '',
  checkOut: '',
  nights: 0,
  rooms: [],
  subtotal: 0,
  taxes: 0,
  discount: 0,
  total: 0,
  currency: 'XAF',
})

onMounted(async () => {
  // Récupérer les données depuis les query params
  const reservationId = route.query.reservationId as string
  const email = route.query.email as string

  if (!reservationId) {
    error.value = 'Missing reservation ID in URL.'
    return
  } else {
    await loadReservationFromAPI(reservationId)
  }
})

// Fonction pour charger depuis l'API
const loadReservationFromAPI = async (reservationId: string) => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getReservationById(reservationId)
    const data = response

    reservation.value = data
    console.log('Loaded reservation:', response)
  } catch (err: any) {
    console.error('Error loading reservation:', err)
    error.value = err.message || 'Failed to load reservation details'
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: reservation.value.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const printConfirmation = () => {
  window.print()
}

const goBack = () => {
  router.push('/ota/web-booking')
}

const makeAnotherBooking = () => {
  // Nettoyer le store avant de recommencer
  bookingStore.clearBookingData()
  router.push('/ota/web-booking')
}
</script>
<style scoped>
/* Cacher tout ce qui n'est pas le contenu principal pendant l'impression */
@media print {
  /* Cacher tout sauf le header et le contenu principal */
  body * {
    visibility: hidden;
  }

  /* Afficher uniquement le header du nom d'hôtel et le contenu principal */
  .printable, .printable * {
    visibility: visible;
  }

  /* Positionner correctement la partie imprimée */
  .printable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  /* Cacher explicitement les boutons */
  .no-print {
    display: none !important;
  }
}
</style>

