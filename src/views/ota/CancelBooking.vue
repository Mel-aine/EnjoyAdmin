<template>
  <FullScreenLayout>
    <OtaHeader  :currency="selectedCurrency" @currency-change="setCurrency" />
    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section class="bg-white rounded-xl shadow-sm border p-5">
          <div>
            <h1 class="text-2xl font-semibold">Cancel a Booking</h1>
            <p class="text-sm text-gray-600 mt-1">Enter your reservation ID to view the cancellation summary and confirm.</p>
          </div>

          <!-- Step 1 -->
          <div class="mt-4">
            <div class="text-xs uppercase font-semibold text-gray-500">Step 1</div>
            <div class="text-base font-medium mt-1">Find your reservation</div>
            <form class="mt-3 space-y-3" @submit.prevent="loadSummary">
              <div class="grid sm:grid-cols-[200px_1fr] gap-3 items-center">
                <label class="text-xs font-medium">Reservation ID</label>
                <input v-model.number="reservationId" type="number" class="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div class="grid sm:grid-cols-[200px_1fr] gap-3 items-center">
                <label class="text-xs font-medium">Reason</label>
                <input v-model="reason" type="text" class="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Optional" />
              </div>
              <div class="flex gap-3">
                <button class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm disabled:bg-gray-300" :disabled="loadingSummary">
                  {{ loadingSummary ? 'Loading…' : 'View Summary' }}
                </button>
                <button v-if="summary || error || success" type="button" class="border rounded px-4 py-2 text-sm" @click="resetForm">Reset</button>
              </div>
            </form>
          </div>

          <div v-if="error" class="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ error }}</div>
          <div v-if="success" class="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{{ success }}</div>

          <!-- Step 2 -->
          <div v-if="summary" class="mt-6">
            <div class="text-xs uppercase font-semibold text-gray-500">Step 2</div>
            <div class="text-base font-medium mt-1">Cancellation summary</div>
            <div class="mt-3 grid sm:grid-cols-2 gap-4">
              <div class="rounded-lg border p-4">
                <dl class="text-sm text-gray-700 space-y-2">
                  <div><dt class="font-medium">Guest</dt><dd>{{ summary.guestName || 'N/A' }}</dd></div>
                  <div><dt class="font-medium">Room</dt><dd>{{ summary.roomName || 'N/A' }}</dd></div>
                  <div><dt class="font-medium">Stay</dt><dd>{{ summary.arrivalDate || '-' }} – {{ summary.departureDate || '-' }}</dd></div>
                </dl>
              </div>
              <div class="rounded-lg border p-4">
                <div class="text-sm text-gray-700">Cancellation penalty</div>
                <div class="mt-2 text-2xl font-semibold text-blue-700">{{ summary.penalty ?? '0' }}</div>
                <p class="text-xs text-gray-500 mt-1">Exact amount depends on selected rate conditions.</p>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div v-if="summary" class="mt-6">
            <div class="text-xs uppercase font-semibold text-gray-500">Step 3</div>
            <div class="text-base font-medium mt-1">Confirm cancellation</div>
            <div class="mt-3 flex items-start gap-3">
              <input id="policy" type="checkbox" v-model="acceptPolicy" class="mt-1 rounded border-gray-300">
              <label for="policy" class="text-sm text-gray-700">I have read and accept the <span class="underline decoration-dotted">cancellation policy</span>.</label>
            </div>
            <button class="mt-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 text-white rounded px-4 py-2 text-sm" :disabled="!acceptPolicy || loadingCancel" @click="confirmCancel">
              {{ loadingCancel ? 'Cancelling…' : 'Confirm Cancellation' }}
            </button>
          </div>
        </section>

        <aside class="bg-white rounded-xl shadow-sm border p-5">
          <div class="font-semibold mb-2">Need help?</div>
          <p class="text-sm text-gray-700">Reach us via the <router-link to="/ota/contact-us" class="text-blue-700 hover:underline">Contact page</router-link>.</p>
          <div class="mt-4">
            <div class="font-semibold mb-1">Cancellation policy</div>
            <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>{{ cancellationPolicy }}</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref,computed ,onMounted} from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import OtaHeader from './components/OtaHeader.vue'
import { getCancellationSummary, cancelReservationById } from '@/views/ota/services/otaApi'
import { getHotelInfo } from '@/views/ota/services/otaApi'
import { useServiceStore } from '@/composables/serviceStore'

const selectedCurrency = ref<string>('XAF')
function setCurrency(c: string) { selectedCurrency.value = c }

const reservationId = ref<number | null>(null)
const reason = ref<string>('')
const summary = ref<any | null>(null)
const error = ref<string>('')
const success = ref<string>('')
const acceptPolicy = ref<boolean>(false)
const loadingSummary = ref<boolean>(false)
const loadingCancel = ref<boolean>(false)
const serviceStore = useServiceStore()
const hotelData = ref<any>(null)
const loading = ref<boolean>(true)
const cancellationPolicy = computed(() => hotelData.value?.policy?.cancellationPolicy || '')
async function loadSummary() {
  error.value = ''
  success.value = ''
  summary.value = null
  acceptPolicy.value = false
  loadingSummary.value = true
  try {
    if (!reservationId.value) throw new Error('Please enter a reservation ID.')
    const { data } = await getCancellationSummary(reservationId.value)
    summary.value = data || {}
    console.log('Loaded cancellation summary:', summary.value)
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Unable to load summary. Please try again.'
  } finally {
    loadingSummary.value = false
  }
}

async function confirmCancel() {
  error.value = ''
  success.value = ''
  loadingCancel.value = true
  try {
    if (!reservationId.value) throw new Error('Missing reservation ID.')
    const payload: any = { reason: reason.value } /// To be added
    await cancelReservationById(reservationId.value)
    success.value = 'Reservation cancelled successfully.'
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Cancellation failed. Please try again later.'
  } finally {
    loadingCancel.value = false
  }
}

function resetForm() {
  reservationId.value = null
  reason.value = ''
  summary.value = null
  error.value = ''
  success.value = ''
  acceptPolicy.value = false
}
const fetchHotelInfo = async () => {
  try {
    loading.value = true
    const hotelId = serviceStore.serviceId
    const response = await getHotelInfo(hotelId!)
    hotelData.value = response.data.data
    console.log('Fetched hotel info:', hotelData.value)

    // Update currency from API if available
    if (hotelData.value?.finance?.currencyCode) {
      selectedCurrency.value = hotelData.value.finance.currencyCode
    }
  } catch (error) {
    console.error('Error fetching hotel info:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHotelInfo()
})
</script>

<style scoped>
</style>
