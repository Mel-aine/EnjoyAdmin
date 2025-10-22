<template>
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
        <!-- Left: Guest info + policies -->
        <section class="bg-white rounded-xl shadow-sm border">
          <div class="p-5 border-b flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold">Guest Information</h1>
              <div class="text-[12px] text-gray-600 mt-1">Not ready to submit your reservation? You can save for later.</div>
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
                <div class="text-[11px] text-gray-500">Your voucher will be sent to this email address</div>
                <button type="button" class="bg-gray-800 hover:bg-black text-white rounded px-4 py-2 text-sm" @click="saveForLater">Save for Later</button>
              </div>
            </form>

            <!-- Policies -->
            <div>
              <div class="text-lg font-semibold">Hotel Policy & Booking Conditions</div>
              <div class="mt-2 space-y-4">
                <div class="text-sm text-gray-700">
                  <div class="font-semibold mb-1">Hotel Policy</div>
                  <p>Our hotel offers on-site dining, business facilities, spa and 24/7 front desk. Complimentary Wi‑Fi and secure parking are available. Please see full policy at the property.</p>
                </div>
                <div class="text-sm text-gray-700">
                  <div class="font-semibold mb-1">Cancellation Policy</div>
                  <p>Free cancellation up to 24 hours before arrival on flexible rates. After that, one night may be charged depending on selected rate conditions.</p>
                </div>
              </div>
              <div class="mt-3 flex items-start gap-2">
                <input type="checkbox" v-model="acceptPolicy" id="accept" class="mt-1" />
                <label for="accept" class="text-sm">I acknowledge and accept the Terms of Cancellation Policy & Hotel Policy.</label>
              </div>
              <div class="mt-3 flex gap-3">
                <button class="bg-yellow-600 hover:bg-yellow-700 text-white rounded px-4 py-2 text-sm disabled:bg-gray-300" :disabled="!acceptPolicy" @click="bookNow">Book Now</button>
                <button class="border rounded px-4 py-2 text-sm" @click="reviewBooking">Review Your Booking</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Right: Booking summary -->
        <aside class="bg-white rounded-xl shadow-sm border p-5 lg:sticky lg:top-24">
          <div class="font-semibold">{{ brand }}</div>
          <div class="text-[12px] text-gray-600">Carrefour Bastos, 2723, Yaounde, Cameroon</div>
           <div class="text-[12px] text-gray-600">reservation@suita-hotel.com • (+237) 658885585</div>

          <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-gray-600">Check-In</div>
              <div class="font-semibold">{{ arrivalDate }}</div>
            </div>
            <div>
              <div class="text-gray-600">Check-Out</div>
              <div class="font-semibold">{{ departureDate }}</div>
            </div>
            <div>
              <div class="text-gray-600">Nights</div>
              <div class="font-semibold">{{ nights }}</div>
            </div>
          </div>

          <div class="mt-4 border-t pt-4">
            <div class="text-sm font-semibold">Rooms & Rates</div>
            <div class="mt-2 text-sm bg-gray-50 rounded border p-3">
              <div class="font-medium">Room: {{ room }}</div>
              <div class="text-gray-600">Rate plan: {{ plan }}</div>
              <div class="mt-2 flex justify-between">
                <div class="text-gray-600">Room Charges</div>
                <div class="font-semibold">{{ formatCurrency(total) }}</div>
              </div>
              <div class="mt-1 flex justify-between text-gray-600">
                <div>Taxes & Fees</div>
                <div>{{ formatCurrency(taxes) }}</div>
              </div>
              <div class="mt-2 flex justify-between font-bold">
                <div>Total Price (Incl. of Taxes)</div>
                <div>{{ formatCurrency(grandTotal) }}</div>
              </div>
              <button class="mt-2 text-blue-700 hover:underline" @click="showDetails = !showDetails">Price Breakdown / Rate Details</button>
              <div v-if="showDetails" class="mt-2 space-y-1 text-xs text-gray-700">
                <div class="flex justify-between"><span>Base ({{ nights }} nights)</span><span>{{ formatCurrency(total) }}</span></div>
                <div class="flex justify-between"><span>Taxes (18%)</span><span>{{ formatCurrency(taxes) }}</span></div>
                <div v-if="discount > 0" class="flex justify-between text-green-700"><span>Promo discount</span><span>-{{ formatCurrency(discount) }}</span></div>
                <div class="flex justify-between font-bold"><span>Total</span><span>{{ formatCurrency(finalTotal) }}</span></div>
              </div>
            </div>
          </div>

          <div class="mt-4 bg-yellow-50 border rounded p-3">
            <div class="text-sm">Pay at Hotel</div>
            <div class="text-xl font-bold text-blue-800">{{ formatCurrency(finalTotal) }}</div>
          </div>

          <div class="mt-4">
            <div class="text-sm font-semibold">Offers</div>
            <div class="mt-1 flex gap-2">
              <input v-model="promo" class="flex-1 border rounded px-2 py-2 text-sm" placeholder="Enter promotional code" />
              <button class="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm" @click="applyPromo">Apply</button>
            </div>
            <div v-if="promoApplied" class="mt-1 text-xs text-green-700">Promo applied: -{{ formatCurrency(discount) }}</div>
          </div>
        </aside>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import OtaHeader from './components/OtaHeader.vue'
import { useBookingSummaryStore } from '@/composables/bookingSummary'
const router = useRouter()
const route = useRoute()

const brand = 'TAMI SARL (SUITA HOTEL)'
const selectedCurrency = ref<string>('XAF')
function setCurrency(c: string) { selectedCurrency.value = c }


const bookingStore = useBookingSummaryStore()

console.log('Hotel ID :', bookingStore.hotelId)
console.log('Arrivée :', bookingStore.arrivalDate)
console.log('Départ :', bookingStore.departureDate)
console.log('Items :', bookingStore.items)

// Read booking info from query
const arrivalDate = ref<string>((route.query.arrivalDate as string) || (route.query.arrival as string) || new Date().toISOString().split('T')[0])
const departureDate = ref<string>((route.query.departureDate as string) || (route.query.departure as string) || new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0])
const nights = ref<number>(Number(route.query.nights || 1))
const room = ref<string>((route.query.room as string) || (route.query.roomName as string) || 'Room')
const plan = ref<string>((route.query.plan as string) || 'Plan')
const total = ref<number>(Number(route.query.total || route.query.price || 0))
const taxes = computed(() => Math.round(total.value * 0.18))
const grandTotal = computed(() => total.value + taxes.value)

// Guest form
const guest = ref({ title: 'Mr', firstName: '', lastName: '', mobile: '', country: 'Cameroon', email: '' })
const acceptPolicy = ref<boolean>(false)

// Price breakdown & promo
const showDetails = ref<boolean>(false)
const promo = ref<string>('')
const promoApplied = ref<boolean>(false)
const discount = computed(() => (promoApplied.value ? Math.round(grandTotal.value * 0.1) : 0))
const finalTotal = computed(() => Math.max(grandTotal.value - discount.value, 0))

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
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
function bookNow() {
  if (!acceptPolicy.value) return
  alert('Thanks! Your booking request has been submitted. We will contact you with confirmation.')
}
function reviewBooking() {
  router.push('/ota/web-booking')
}
</script>

<style scoped>
</style>
