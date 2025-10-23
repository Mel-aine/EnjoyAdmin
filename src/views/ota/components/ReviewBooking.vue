<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-blue-500 text-white p-3">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold">Review Your Booking</h2>
                <p class="text-xs text-blue-200 mt-0.5">Please verify all details before confirming</p>
              </div>
              <button
                @click="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4 text-sm sidebar-scroll">
            <!-- Hotel Information -->
            <section class="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-3 border border-blue-100">
              <h3 class="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Hotel Information
              </h3>
              <div class="space-y-1">
                <div class="font-semibold text-slate-900">{{ brand }}</div>
                <div class="text-slate-600">{{ bookingData?.address }}</div>
                <div class="text-slate-600 flex items-center gap-3 flex-wrap">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ bookingData?.email }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ bookingData?.phoneNumber }}
                  </span>
                </div>
              </div>
            </section>

            <!-- Stay Details -->
            <section class="bg-white rounded-lg p-2 border border-slate-200">
              <h3 class="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Stay Details
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-slate-50 rounded p-2 flex justify-between items-center">
                  <div class="text-xs text-slate-500 uppercase ">Check-In</div>
                  <div class="font-medium text-slate-900">{{ formatDate(bookingData?.arrivalDate) }}</div>
                </div>
                <div class="bg-slate-50 rounded p-2 flex justify-between items-center">
                  <div class="text-xs text-slate-500 uppercase mb-0.5">Check-Out</div>
                  <div class="font-medium text-slate-900">{{ formatDate(bookingData?.departureDate) }}</div>
                </div>
                <div class="bg-slate-50 rounded p-2 flex justify-between items-center">
                  <div class="text-xs text-slate-500 uppercase mb-0.5">Nights</div>
                  <div class="font-medium text-slate-900">{{ nights }}</div>
                </div>
                <div class="bg-slate-50 rounded p-2 flex justify-between items-center">
                  <div class="text-xs text-slate-500 uppercase mb-0.5">Guests</div>
                  <div class="font-medium text-slate-900">
                    {{ bookingData?.adults || 0 }}A, {{ bookingData?.children || 0 }}C
                  </div>
                </div>
              </div>
            </section>

            <!-- Guest Info -->
            <section class="bg-white rounded-lg p-3 border border-slate-200">
              <h3 class="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Guest Information
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div class="text-slate-500 text-xs mb-0.5">Name</div>
                  <div class="font-medium text-slate-900">
                    {{ guest.title }} {{ guest.firstName }} {{ guest.lastName }}
                  </div>
                </div>
                <div>
                  <div class="text-slate-500 text-xs mb-0.5">Email</div>
                  <div class="font-medium text-slate-900">{{ guest.email }}</div>
                </div>
                <div>
                  <div class="text-slate-500 text-xs mb-0.5">Mobile</div>
                  <div class="font-medium text-slate-900">{{ guest.mobile }}</div>
                </div>
                <div>
                  <div class="text-slate-500 text-xs mb-0.5">Country</div>
                  <div class="font-medium text-slate-900">{{ guest.country }}</div>
                </div>
              </div>
            </section>

            <!-- Rooms -->
            <section class="bg-white rounded-lg p-3 border border-slate-200">
              <h3 class="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Selected Rooms
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(item, index) in bookingData?.items || []"
                  :key="index"
                  class="bg-gradient-to-r from-slate-50 to-blue-50 rounded p-3 border border-slate-200"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="font-semibold text-slate-900">{{ item.roomName }}</div>
                      <div class="text-xs text-slate-600">{{ item.planName }}</div>
                      <!-- <span
                        v-if="item.taxIncluded"
                        class="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                      >
                        Tax Included
                      </span> -->
                    </div>
                    <div class="text-right text-xs">
                      <div class="text-slate-500">{{ item.quantity }} room(s)</div>
                      <div class="font-bold text-blue-700 text-sm">
                        {{ formatCurrency(item.planPrice * item.quantity * nights) }}
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span>{{ item.adults }} adults, {{ item.children }} children/room</span>
                    <span>{{ formatCurrency(item.planPrice) }}/night</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Price Summary -->
            <section class="bg-brand-50 rounded-lg p-3 text-gray-950">
              <h3 class="text-base font-semibold mb-2">Price Summary</h3>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-950">Room Charges</span>
                  <span class="font-semibold ">{{ formatCurrency(totalRoomCharges) }}</span>
                </div>
                <!-- <div
                  class="flex justify-between"
                  :class="taxDisplayInfo.isIncluded ? 'text-green-300' : 'text-gray-500'"
                >
                  <span>{{ taxDisplayInfo.label }}</span>
                  <span class="font-semibold">
                    {{ taxDisplayInfo.showAmount ? formatCurrency(taxes) : formatCurrency(0) }}
                  </span>
                </div> -->
                <div v-if="discount > 0" class="flex justify-between text-green-300">
                  <span>Promo Discount</span>
                  <span class="font-semibold">-{{ formatCurrency(discount) }}</span>
                </div>
                <div class="border-t border-white/20 pt-1 mt-1">
                  <div class="flex justify-between text-sm font-bold">
                    <span>Total Amount</span>
                    <span>{{ formatCurrency(finalTotal) }}</span>
                  </div>
                  <div class="text-[11px] text-gray-950 mt-0.5">Payment at hotel</div>
                </div>
              </div>
            </section>

            <!-- Policies -->
            <section class="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <h3 class="text-base font-semibold text-amber-900 mb-1 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Important Policies
              </h3>
              <div class="text-xs text-amber-900">
                <span class="font-semibold">Cancellation:</span>
                {{ bookingData?.cancellationPolicy || 'Please review hotel policy' }}
              </div>
            </section>
          </div>

          <!-- Footer -->
          <div class="border-t bg-slate-50 p-3 flex items-center justify-between gap-2">
            <button
              @click="closeModal"
              class="px-4 py-1 rounded-md border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition"
            >
              Close
            </button>
            <div class="flex gap-2">
              <button
                @click="editBooking"
                class="px-4 py-1 rounded-md bg-slate-700 text-white text-sm hover:bg-slate-800"
              >
                Edit
              </button>
              <!-- <button
                @click="confirmBooking"
                :disabled="!acceptPolicy"
                class="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50"
              >
                Confirm
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>


<script setup lang="ts">
import { computed } from 'vue'

// Props
const props = defineProps<{
  isOpen: boolean
  bookingData: any
  guest: any
  nights: number
  brand: string
  selectedCurrency: string
  totalRoomCharges: number
  taxes: number
  discount: number
  finalTotal: number
  taxDisplayInfo: any
  acceptPolicy: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
  confirm: []
  edit: []
}>()

// Methods
function closeModal() {
  emit('close')
}

function confirmBooking() {
  emit('confirm')
}

function editBooking() {
  emit('edit')
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.selectedCurrency,
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
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(20px);
}

.sidebar-scroll {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>
