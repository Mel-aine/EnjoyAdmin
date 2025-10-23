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
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
              >1</span
            >
            <span>Guest Info</span>
          </div>
          <span class="opacity-60">→</span>
          <div class="flex items-center gap-2">
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
              >2</span
            >
            <span>Policies</span>
          </div>
          <span class="opacity-60">→</span>
          <div class="flex items-center gap-2">
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
              >3</span
            >
            <span>Review</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <!--  Guest info + policies -->
        <section class="bg-white rounded-xl shadow-sm border">
          <div class="p-5 border-b flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold">Guest Information</h1>
              <div class="text-[12px] text-gray-600 mt-1">
                Not ready to submit your reservation? You can save for later.
              </div>
            </div>
            <button
              type="button"
              class="hidden sm:inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded px-3 py-2 text-sm"
            >
              <span>Sign in to Book Faster</span>
            </button>
          </div>

          <div class="p-5 space-y-6">
            <!-- Guest form -->
            <form class="space-y-3" @submit.prevent>
              <div class="grid sm:grid-cols-3 gap-3">
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Title</label>
                  <select
                    v-model="guest.title"
                    class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">First Name</label>
                  <input
                    v-model="guest.firstName"
                    placeholder="e.g. John"
                    class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400"
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Last Name</label>
                  <input
                    v-model="guest.lastName"
                    placeholder="e.g. Doe"
                    class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400"
                  />
                </div>
              </div>

              <div class="grid sm:grid-cols-3 gap-3">
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Mobile</label>
                  <input
                    v-model="guest.mobile"
                    class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400"
                    placeholder="(+237)"
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Country</label>
                  <input
                    v-model="guest.country"
                    class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400"
                  />
                </div>
                <div class="flex flex-col">
                  <label class="text-xs font-medium">Email</label>
                  <input
                    v-model="guest.email"
                    type="email"
                    required
                    class="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-[11px] text-gray-500">
                  Your voucher will be sent to this email address
                </div>
                <button
                  type="button"
                  class="bg-gray-800 hover:bg-black text-white rounded px-4 py-2 text-sm"
                  @click="saveForLater"
                >
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
                  <p>
                    {{
                      bookingData?.policies ||
                      'Our hotel offers on-site dining, business facilities, spa and 24/7 front desk. Complimentary Wi‑Fi and secure parking are available.'
                    }}
                  </p>
                </div>
                <div class="text-sm text-gray-700">
                  <div class="font-semibold mb-1">Cancellation Policy</div>
                  <p>
                    {{
                      bookingData?.cancellationPolicy ||
                      'Free cancellation up to 24 hours before arrival on flexible rates. After that, one night may be charged depending on selected rate conditions.'
                    }}
                  </p>
                </div>
              </div>
              <div class="mt-3 flex items-start gap-2">
                <input type="checkbox" v-model="acceptPolicy" id="accept" class="mt-1" />
                <label for="accept" class="text-sm"
                  >I acknowledge and accept the Terms of Cancellation Policy & Hotel Policy.</label
                >
              </div>
              <div class="mt-3 flex gap-3">
                <button
                  class="bg-yellow-600 hover:bg-yellow-700 text-white rounded px-4 py-2 text-sm flex items-center justify-center gap-2 disabled:bg-gray-300"
                  :disabled="!acceptPolicy || isBooking"
                  @click="bookNow"
                >
                  <!-- Spinner -->
                  <svg
                    v-if="isBooking"
                    class="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>

                  <!-- Texte -->
                  <span>{{ isBooking ? 'Booking...' : 'Book Now' }}</span>
                </button>

                <button class="border rounded px-4 py-2 text-sm" @click="reviewBooking">
                  Review Your Booking
                </button>
              </div>
            </div>
          </div>
        </section>

        <!--  Booking summary -->
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

            <!-- Liste des chambres sélectionnées -->
            <div class="space-y-3 overflow-y-auto max-h-48 custom-scrollbar">
              <div
                v-for="(item, index) in bookingData?.items || []"
                :key="index"
                class="text-sm bg-gray-50 rounded border p-3"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="font-medium">{{ item.roomName }}</div>
                    <div class="text-gray-600 text-xs">{{ item.planName }}</div>

                    <!-- Badge si taxe incluse -->
                    <span
                      v-if="item.taxIncluded"
                      class="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded"
                    >
                      Tax Included
                    </span>
                  </div>
                </div>

                <div class="text-gray-500 text-xs mt-2">
                  {{ item.quantity }} room(s) × {{ nights }} night(s) ×
                  {{ formatCurrency(item.planPrice) }}/night
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

            <!-- Total avec gestion des taxes mixtes -->
            <div class="pt-1 space-y-2">
              <!-- Afficher séparément si on a des taxes mixtes -->
              <!-- <div v-if="hasMixedTaxStatus">
    <div class="flex justify-between text-sm text-gray-600">
      <div>Items with tax included</div>
      <div>{{ formatCurrency(totalWithTaxIncluded) }}</div>
    </div>
    <div class="flex justify-between text-sm text-gray-600">
      <div>Items without tax</div>
      <div>{{ formatCurrency(totalWithoutTax) }}</div>
    </div>
  </div> -->

              <!-- Total des chambres -->
              <div
                class="flex justify-between text-sm"
                :class="hasMixedTaxStatus ? 'font-semibold border-t pt-2' : ''"
              >
                <div class="text-gray-600">Room Charges</div>
                <div class="font-semibold">{{ formatCurrency(totalRoomCharges) }}</div>
              </div>

              <!-- Taxes -->
              <div
                class="flex justify-between text-sm"
                :class="taxDisplayInfo.isIncluded ? 'text-green-600' : 'text-gray-600'"
              >
                <div>{{ taxDisplayInfo.label }}</div>
                <div v-if="taxDisplayInfo.showAmount">{{ formatCurrency(taxes) }}</div>
                <div v-else>{{ formatCurrency(0) }}</div>
              </div>

              <!-- Note pour les taxes mixtes -->
              <div v-if="taxDisplayInfo.note" class="text-xs text-red-500 italic">
                * {{ taxDisplayInfo.note }}
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

            <button
              class="mt-2 text-blue-700 hover:underline text-sm"
              @click="showDetails = !showDetails"
            >
              {{ showDetails ? 'Hide' : 'Show' }} Price Breakdown
            </button>

            <div
              v-if="showDetails"
              class="mt-2 space-y-1 text-xs text-gray-700 bg-gray-50 p-2 rounded"
            >
              <div class="font-semibold mb-2">Detailed Breakdown:</div>

              <!-- Détail par chambre -->
              <!-- <div v-for="(item, index) in bookingData?.items || []" :key="index" class="mb-2 pb-2 border-b">
                <div class="font-medium">{{ item.roomName }} - {{ item.planName }}</div>
                <div class="ml-2 space-y-1">
                  <div class="flex justify-between">
                    <span>{{ item.quantity }} room × {{ nights }} nights</span>
                    <span>{{ formatCurrency(item.planPrice * item.quantity * nights) }}</span>
                  </div>
                </div>
              </div> -->

              <!-- Totaux -->
              <div class="flex justify-between font-medium">
                <span>Subtotal ({{ nights }} nights)</span>
                <span>{{ formatCurrency(totalRoomCharges) }}</span>
              </div>

              <div v-if="!isTaxIncluded" class="flex justify-between">
                <span>Taxes ({{ taxRate * 100 }}%)</span>
                <span>{{ formatCurrency(taxes) }}</span>
              </div>

              <div v-else class="flex justify-between text-green-700">
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
            <div class="text-xl font-bold text-blue-800">{{ formatCurrency(finalTotal) }}</div>
            <div v-if="isTaxIncluded" class="text-xs text-gray-600 mt-1">All taxes included</div>
          </div>

          <div class="mt-4">
            <div class="text-sm font-semibold">Offers</div>
            <div class="mt-1 flex gap-2">
              <input
                v-model="promo"
                class="flex-1 border rounded px-2 py-2 text-sm"
                placeholder="Enter promotional code"
              />
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm"
                @click="applyPromo"
              >
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
      :taxes="taxes"
      :discount="discount"
      :final-total="finalTotal"
      :tax-display-info="taxDisplayInfo"
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

// Vérifier si la taxe est incluse dans le prix
const isTaxIncluded = computed(() => {
  return bookingData.value?.taxIncluded === true
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

  // Validation email
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

    // Préparer les données finales pour l'API
    const bookingPayload: any = {
      hotelId: bookingData.value?.hotelId || '',
      arrivalDate: bookingData.value?.arrivalDate || '',
      departureDate: bookingData.value?.departureDate || '',
      nights: nights.value,
      guest: guest.value,
      items:
        bookingData.value?.items.map((item) => ({
          ...item,
          totalPrice: item.planPrice * item.quantity * nights.value,
        })) || [],
      subtotal: totalRoomCharges.value,
      taxes: taxes.value,
      taxIncluded: bookingData.value?.taxIncluded || false,
      taxRate: taxRate.value * 100,
      discount: discount.value,
      totalPrice: finalTotal.value,
      currency: selectedCurrency.value,
      promoCode: promoApplied.value ? promo.value : null,
    }

    console.log('Booking payload:', bookingPayload)

    // Créer la réservation
    const response = await createOTAReservation(
      bookingPayload,
      serviceStore.serviceId || parseInt(bookingPayload.hotelId),
    )

    if (response.success) {
      // alert(`Booking confirmed! Reservation ID: ${response.reservationId}\n\nA confirmation email has been sent to ${guest.value.email}`)

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
    alert(
      `Booking failed: ${error.message || 'An error occurred. Please try again or contact support.'}`,
    )
  } finally {
    isBooking.value = false
  }
}

// Taux de taxe
const taxRate = computed(() => {
  const rate = Number(bookingData.value?.taxe || 0) / 100
  return rate
})

// Séparer les items avec et sans taxe incluse
const itemsWithTaxIncluded = computed(() => {
  return (bookingData.value?.items || []).filter((item) => item.taxIncluded === true)
})

const itemsWithoutTax = computed(() => {
  return (bookingData.value?.items || []).filter((item) => item.taxIncluded !== true)
})

// Calculer le total des items AVEC taxe incluse
const totalWithTaxIncluded = computed(() => {
  return itemsWithTaxIncluded.value.reduce((sum, item) => {
    return sum + item.planPrice * item.quantity * nights.value
  }, 0)
})

// Calculer le total des items SANS taxe (on devra ajouter la taxe)
const totalWithoutTax = computed(() => {
  return itemsWithoutTax.value.reduce((sum, item) => {
    return sum + item.planPrice * item.quantity * nights.value
  }, 0)
})

// Total de toutes les chambres
const totalRoomCharges = computed(() => {
  return totalWithTaxIncluded.value + totalWithoutTax.value
})

// Calculer les taxes uniquement sur les items qui n'ont pas la taxe incluse
const taxes = computed(() => {
  if (bookingData.value?.taxIncluded === true) {
    // Si toutes les taxes sont incluses, pas de taxe supplémentaire
    return 0
  }
  // Sinon, calculer la taxe uniquement sur les items sans taxe incluse
  return Math.round(totalWithoutTax.value * taxRate.value)
})

// Grand total
const grandTotal = computed(() => totalRoomCharges.value + taxes.value)

// Vérifier si on a un mix d'items
const hasMixedTaxStatus = computed(() => {
  return itemsWithTaxIncluded.value.length > 0 && itemsWithoutTax.value.length > 0
})

// affichage dans le template
const taxDisplayInfo = computed(() => {
  if (bookingData.value?.taxIncluded === true) {
    return {
      label: `Taxes (${taxRate.value * 100}% included)`,
      isIncluded: true,
      showAmount: false,
    }
  } else if (hasMixedTaxStatus.value) {
    return {
      label: `Taxes (${taxRate.value * 100}% on ${itemsWithoutTax.value.length} item(s))`,
      isIncluded: false,
      showAmount: true,
      note: `${itemsWithTaxIncluded.value.length} item(s) already include tax`,
    }
  } else {
    return {
      label: `Taxes & Fees (${taxRate.value * 100}%)`,
      isIncluded: false,
      showAmount: true,
    }
  }
})

function reviewBooking() {
showReviewModal.value = true
  // router.push('/ota/web-booking')
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
