<template>
  <div>
    <OtaHeader :brand="brand" :currency="selectedCurrency" @currency-change="setCurrency" />

    <!-- Gradient banner and steps -->
    <div class="bg-gradient-to-r from-slate-900 via-blue-900 mt-10 to-slate-800 text-white">
      <div class="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <div class="text-xs uppercase tracking-wide opacity-80">Secure Checkout</div>
          <div class="text-2xl font-semibold">Complete Your Reservation</div>
        </div>
        <div class="hidden md:flex items-center gap-3 text-sm">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20">1</span>
            <span>Guest Info</span>
          </div>
          <span class="opacity-60">→</span>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20">2</span>
            <span>Policies</span>
          </div>
          <span class="opacity-60">→</span>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20">3</span>
            <span>Review</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <!-- Guest info + policies -->
        <section class="bg-white rounded-xl shadow-sm border">
          <div class="p-5 border-b flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold">Guest Information</h1>
              <div class="text-[12px] text-gray-600 mt-1">
                Not ready to submit your reservation? You can save for later.
              </div>
            </div>
            <button type="button" class="hidden sm:inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded px-3 py-2 text-sm">
              <span>Sign in to Book Faster</span>
            </button>
          </div>

          <div class="p-5 space-y-6">
            <!-- Guest form -->
            <form class="space-y-3" @submit.prevent>
              <div class="grid sm:grid-cols-3 gap-3">
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Title</label>
                  <select v-model="guest.title" class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">First Name</label>
                  <input v-model="guest.firstName" placeholder="e.g. John" class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400" />
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Last Name</label>
                  <input v-model="guest.lastName" placeholder="e.g. Doe" class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400" />
                </div>
              </div>

              <div class="grid sm:grid-cols-3 gap-3">
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Mobile</label>
                  <input v-model="guest.mobile" class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400" placeholder="(+237)" />
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Country</label>
                  <input v-model="guest.country" class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400" />
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Email</label>
                  <input v-model="guest.email" type="email" required class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400" />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-[11px] text-gray-500">
                  Your voucher will be sent to this email address
                </div>
                <button type="button" class="bg-gray-800 hover:bg-black text-white rounded px-4 py-2 text-sm" @click="saveForLater">
                  Save for Later
                </button>
              </div>
            </form>

            <!-- Policies -->
            <div>
              <div class="text-lg font-semibold">Hotel Policy & Booking Conditions</div>
              <div class="mt-2 space-y-4">
                <div class="text-sm text-gray-700">
                  <div class="font-semibold mb-1">Hotel Policy</div>
                  <p>{{ bookingData?.policies || 'Our hotel offers on-site dining, business facilities, spa and 24/7 front desk. Complimentary Wi‑Fi and secure parking are available.' }}</p>
                </div>
                <div class="text-sm text-gray-700">
                  <div class="font-semibold mb-1">Cancellation Policy</div>
                  <p>{{ bookingData?.cancellationPolicy || 'Free cancellation up to 24 hours before arrival on flexible rates. After that, one night may be charged depending on selected rate conditions.' }}</p>
                </div>
              </div>
              <div class="mt-3 flex items-start gap-2">
                <input type="checkbox" v-model="acceptPolicy" id="accept" class="mt-1" />
                <label for="accept" class="text-sm">I acknowledge and accept the Terms of Cancellation Policy & Hotel Policy.</label>
              </div>
              <div class="mt-3 flex gap-3">
                <button class="bg-yellow-600 hover:bg-yellow-700 text-white rounded px-4 py-2 text-sm flex items-center justify-center gap-2 disabled:bg-gray-300" :disabled="!acceptPolicy || isBooking" @click="bookNow">
                  <svg v-if="isBooking" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>{{ isBooking ? 'Booking...' : 'Book Now' }}</span>
                </button>
                <button class="border rounded px-4 py-2 text-sm" @click="reviewBooking">
                  Review Your Booking
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Booking summary -->
        <aside class="bg-white rounded-xl shadow-sm border p-5 lg:sticky lg:top-24">
          <div class="font-semibold">{{ brand }}</div>
          <div class="text-[12px] text-gray-600">{{ bookingData?.address }}</div>
          <div class="text-[12px] text-gray-600">
            {{ bookingData?.email }} • {{ bookingData?.phoneNumber }}
          </div>

          <div class="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-gray-600">Check-In</div>
              <div class="font-semibold">{{ formatDate(bookingData?.arrivalDate) }}</div>
            </div>
            <div>
              <div class="text-gray-600">Check-Out</div>
              <div class="font-semibold">{{ formatDate(bookingData?.departureDate) }}</div>
            </div>
            <div>
              <div class="text-gray-600">Nights</div>
              <div class="font-semibold">{{ nights }}</div>
            </div>
            <div>
              <div class="text-gray-600">Guests</div>
              <div class="font-semibold">
                {{ bookingData?.adults || 0 }} adults, {{ bookingData?.children || 0 }} children
              </div>
            </div>
          </div>

          <div class="mt-2 pt-2">
            <div class="text-sm font-semibold mb-3">Rooms & Rates</div>

            <!-- Liste des chambres -->
            <div class="space-y-3 overflow-y-auto max-h-48 custom-scrollbar">
              <div v-for="(item, index) in bookingData?.items || []" :key="index" class="text-sm bg-gray-50 rounded border p-3">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="font-medium">{{ item.roomName }}</div>
                    <div class="text-gray-600 text-xs">{{ item.planName }}</div>
                    <span v-if="item.taxIncluded" class="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Tax Included
                    </span>
                  </div>
                </div>
                <div class="text-gray-500 text-xs mt-2">
                  {{ item.quantity }} room(s) × {{ nights }} night(s) × {{ formatCurrency(item.planPrice) }}/night
                </div>
                <div class="text-gray-500 text-xs">
                  {{ item.adults }} adults, {{ item.children }} children per room
                </div>
                <div class="mt-2 flex justify-between">
                  <div class="text-gray-600">Subtotal</div>
                  <div class="font-semibold">
                    {{ formatCurrency(item.planPrice * item.quantity * nights) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Prix total section -->
            <div class="pt-3 space-y-2 border-t mt-3">
              <!-- Total des chambres -->
              <div class="flex justify-between text-sm">
                <div class="text-gray-600">Room Charges</div>
                <div class="font-semibold">{{ formatCurrency(totalRoomCharges) }}</div>
              </div>

              <!-- Affichage des taxes -->
              <div v-if="allTaxesIncluded" class="flex justify-between text-sm text-green-600">
                <div>Taxes (included in price)</div>
                <div>{{ formatCurrency(0) }}</div>
              </div>

              <div v-else-if="taxCalculation.breakdown.length > 0" class="space-y-1">
                <!-- Afficher chaque taxe individuellement -->
                <div v-for="tax in taxCalculation.breakdown" :key="tax.taxId" class="flex justify-between text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <span>{{ tax.taxName }}</span>
                    <span class="text-xs text-gray-400">
                      {{ tax.type === 'flat_percentage' ? `(${bookingData?.taxes?.find(t => t.id === tax.taxId)?.percent}%)` : '(per room/night)' }}
                    </span>
                  </div>
                  <div>{{ formatCurrency(tax.amount) }}</div>
                </div>

                <!-- Total des taxes -->
                <div class="flex justify-between text-sm font-semibold border-t pt-2">
                  <div>Total Taxes</div>
                  <div>{{ formatCurrency(taxCalculation.total) }}</div>
                </div>
              </div>

              <!-- Note pour les taxes mixtes -->
              <div v-if="hasMixedTaxStatus" class="flex items-start gap-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <span>Some rooms have taxes included in the price, others don't</span>
              </div>

              <!-- Réduction promo -->
              <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
                <div>Promo Discount</div>
                <div>-{{ formatCurrency(discount) }}</div>
              </div>

              <!-- Total final -->
              <div class="flex justify-between font-bold text-lg border-t pt-2">
                <div>Total Price</div>
                <div>{{ formatCurrency(finalTotal) }}</div>
              </div>
            </div>

            <button class="mt-2 text-blue-700 hover:underline text-sm" @click="showDetails = !showDetails">
              {{ showDetails ? 'Hide' : 'Show' }} Detailed Breakdown
            </button>

            <!-- Detailed Breakdown -->
            <div v-if="showDetails" class="mt-2 space-y-1 text-xs text-gray-700 bg-gray-50 p-2 rounded">
              <div class="font-semibold mb-2">Detailed Breakdown:</div>

              <!-- Détail par chambre -->
              <div v-for="(item, index) in bookingData?.items || []" :key="index" class="mb-2 pb-2 border-b last:border-b-0">
                <div class="font-medium">{{ item.roomName }} - {{ item.planName }}</div>
                <div class="ml-2 space-y-1">
                  <div class="flex justify-between">
                    <span>{{ item.quantity }} room × {{ nights }} nights × {{ formatCurrency(item.planPrice) }}</span>
                    <span>{{ formatCurrency(item.planPrice * item.quantity * nights) }}</span>
                  </div>
                  <div v-if="item.taxIncluded" class="text-green-600 text-[10px]">✓ Taxes included</div>
                </div>
              </div>

              <!-- Totaux -->
              <div class="flex justify-between font-medium pt-2 border-t">
                <span>Subtotal ({{ nights }} nights)</span>
                <span>{{ formatCurrency(totalRoomCharges) }}</span>
              </div>

              <!-- Détail des taxes -->
              <div v-if="!allTaxesIncluded && taxCalculation.breakdown.length > 0" class="space-y-1">
                <div v-for="tax in taxCalculation.breakdown" :key="tax.taxId" class="flex justify-between">
                  <span>{{ formatTaxLabel(bookingData?.taxes?.find(t => t.id === tax.taxId)) }}</span>
                  <span>{{ formatCurrency(tax.amount) }}</span>
                </div>
              </div>

              <div v-else-if="allTaxesIncluded" class="flex justify-between text-green-700">
                <span>Taxes (included in price)</span>
                <span>{{ formatCurrency(0) }}</span>
              </div>

              <div v-if="discount > 0" class="flex justify-between text-green-700">
                <span>Promo discount</span>
                <span>-{{ formatCurrency(discount) }}</span>
              </div>

              <div class="flex justify-between font-bold border-t pt-1 mt-1">
                <span>Total</span>
                <span>{{ formatCurrency(finalTotal) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 bg-yellow-50 border rounded p-3 flex justify-between items-center">
            <div class="text-sm">Pay at Hotel</div>
            <div>
              <div class="text-xl font-bold text-blue-800">{{ formatCurrency(finalTotal) }}</div>
              <div v-if="allTaxesIncluded" class="text-xs text-gray-600 mt-1">All taxes included</div>
            </div>
          </div>

          <div class="mt-4">
            <div class="text-sm font-semibold">Offers</div>
            <div class="mt-1 flex gap-2">
              <input v-model="promo" class="flex-1 border rounded px-2 py-2 text-sm" placeholder="Enter promotional code" />
              <button class="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm" @click="applyPromo">
                Apply
              </button>
            </div>
            <div v-if="promoApplied" class="mt-1 text-xs text-green-700">
              Promo applied: -{{ formatCurrency(discount) }}
            </div>
          </div>
        </aside>
      </div>
    </div>

    <BookingReviewModal
      :is-open="showReviewModal"
      :booking-data="bookingData"
      :guest="guest"
      :nights="nights"
      :brand="brand"
      :selected-currency="selectedCurrency"
      :total-room-charges="totalRoomCharges"
      :taxes="taxCalculation.total"
      :discount="discount"
      :final-total="finalTotal"
      :tax-calculation="taxCalculation"
      :accept-policy="acceptPolicy"
      @close="showReviewModal = false"
      @edit="editBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import OtaHeader from './components/OtaHeader.vue'
import { useBookingSummaryStore } from '@/views/ota/composables/bookingSummary'
import { createOTAReservation } from '@/views/ota/services/otaApi'
import { useServiceStore } from '@/composables/serviceStore'
import BookingReviewModal from '@/views/ota/components/ReviewBooking.vue'
import { calculateCartTaxes, formatTaxLabel } from '@/views/ota/utils/taxCalculation'

const router = useRouter()
const bookingStore = useBookingSummaryStore()
const serviceStore = useServiceStore()

const bookingData = computed(() => bookingStore.getBookingData())
const showReviewModal = ref(false)

// Vérifier si on a des données
onMounted(() => {
  if (!bookingData.value || !bookingData.value.items || bookingData.value.items.length === 0) {
    alert('No booking data found. Redirecting to booking page.')
    router.push('/ota/web-booking')
  }
})

const brand = computed(() => bookingData.value?.hotelName || '')
const selectedCurrency = ref<string>(bookingData.value?.currency || 'XAF')

function setCurrency(c: string) {
  selectedCurrency.value = c
}

// Nombre de nuits
const nights = computed(() => {
  return Number(bookingData.value?.nights || 1)
})

// Guest form
const guest = ref({
  title: 'Mr',
  firstName: '',
  lastName: '',
  mobile: '',
  country: 'Cameroon',
  email: '',
})

const acceptPolicy = ref<boolean>(false)

// Price breakdown & promo
const showDetails = ref<boolean>(false)
const promo = ref<string>('')
const promoApplied = ref<boolean>(false)

// Calculs financiers
const totalRoomCharges = computed(() => {
  return (bookingData.value?.items || []).reduce((sum, item) => {
    return sum + item.planPrice * item.quantity * nights.value
  }, 0)
})

// Vérifier si toutes les taxes sont incluses
const allTaxesIncluded = computed(() => {
  const items = bookingData.value?.items || []
  return items.length > 0 && items.every(item => item.taxIncluded === true)
})

// Vérifier si on a un mix
const hasMixedTaxStatus = computed(() => {
  const items = bookingData.value?.items || []
  const withTax = items.some(item => item.taxIncluded === true)
  const withoutTax = items.some(item => item.taxIncluded !== true)
  return withTax && withoutTax
})

// Calculer les taxes avec la fonction utilitaire
const taxCalculation = computed(() => {
  if (allTaxesIncluded.value) {
    return { total: 0, breakdown: [] }
  }

  const items = (bookingData.value?.items || []).map(item => ({
    roomId: item.roomId,
    roomName: item.roomName,
    planName: item.planName,
    planPrice: item.planPrice,
    quantity: item.quantity,
    nights: nights.value,
    subtotal: item.planPrice * item.quantity * nights.value,
    taxIncluded: item.taxIncluded || false
  }))

  const taxes = bookingData.value?.taxes || []

  return calculateCartTaxes(items, taxes, nights.value)
})

const grandTotal = computed(() => totalRoomCharges.value + taxCalculation.value.total)
const discount = computed(() => (promoApplied.value ? Math.round(grandTotal.value * 0.1) : 0))
const finalTotal = computed(() => Math.max(grandTotal.value - discount.value, 0))

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedCurrency.value,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function saveForLater() {
  alert('We saved your details locally. You can return later to finish.')
}

function applyPromo() {
  promoApplied.value = (promo.value || '').trim().toUpperCase() === 'PROMO10'
  if (!promoApplied.value) {
    alert('Invalid promo code')
  }
}

const isBooking = ref(false)

async function bookNow() {
  if (!acceptPolicy.value) {
    alert('Please accept the terms and conditions')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!guest.value.email || !emailRegex.test(guest.value.email)) {
    alert('Please enter a valid email address')
    return
  }

  if (!guest.value.firstName || !guest.value.lastName) {
    alert('Please fill in all required fields')
    return
  }

  if (!guest.value.mobile) {
    alert('Please enter your mobile number')
    return
  }

  try {
    isBooking.value = true

    const bookingPayload: any = {
      hotelId: bookingData.value?.hotelId || '',
      arrivalDate: bookingData.value?.arrivalDate || '',
      departureDate: bookingData.value?.departureDate || '',
      nights: nights.value,
      guest: guest.value,
      items: bookingData.value?.items.map((item) => ({
        ...item,
        totalPrice: item.planPrice * item.quantity * nights.value,
      })) || [],
      subtotal: totalRoomCharges.value,
      taxes: taxCalculation.value.total,
      taxBreakdown: taxCalculation.value.breakdown,
      discount: discount.value,
      totalPrice: finalTotal.value,
      currency: selectedCurrency.value,
      promoCode: promoApplied.value ? promo.value : null,
    }

    console.log('Booking payload:', bookingPayload)

    const response = await createOTAReservation(
      bookingPayload,
      serviceStore.serviceId || parseInt(bookingPayload.hotelId),
    )

    if (response.success) {
      bookingStore.clearBookingData()
      router.push({
        path: '/ota/confirmation',
        query: {
          reservationId: response.reservationId,
          email: guest.value.email,
        },
      })
    } else {
      throw new Error(response.error || 'Booking failed')
    }
  } catch (error: any) {
    console.error('Booking error:', error)
    alert(`Booking failed: ${error.message || 'An error occurred. Please try again or contact support.'}`)
  } finally {
    isBooking.value = false
  }
}

function reviewBooking() {
  showReviewModal.value = true
}

const editBooking = () => {
  showReviewModal.value = false
  router.push('/ota/web-booking')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: rgba(200, 200, 200, 0.2);
}
</style>
