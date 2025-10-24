<template>
  <FullScreenLayout>
    <OtaHeader  :currency="selectedCurrency" @currency-change="setCurrency" />
    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <section class="bg-white rounded-lg shadow-sm border p-4">
          <h1 class="text-xl font-bold">Contact Us</h1>
          <p class="text-sm text-gray-700 mt-1">We’d love to hear from you. Send us your message and our team will get back to you shortly.</p>

          <form class="mt-4 space-y-3" @submit.prevent="submit">
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-medium">Your Name</label>
                <input v-model.trim="form.name" type="text" class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" required />
              </div>
              <div>
                <label class="text-xs font-medium">Email</label>
                <input v-model.trim="form.email" type="email" class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" required />
              </div>
            </div>
            <div>
              <label class="text-xs font-medium">Message</label>
              <textarea v-model.trim="form.message" rows="5" class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" required></textarea>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-[11px] text-gray-500">We respond within 24 hours.</div>
              <button class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm">Send Message</button>
            </div>
          </form>
        </section>

        <aside class="space-y-4">
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <div class="font-semibold">Property Contact</div>
            <div class="text-sm text-gray-700 mt-1">Phone: {{ hotelPhone }}</div>
            <div class="text-sm text-gray-700">Email: {{ hotelEmail }}</div>
            <div class="text-sm text-gray-700">Address: {{ hotelAddress }}</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <div class="font-semibold">Need to cancel?</div>
            <div class="text-sm text-gray-700">Use our cancellation tool to void a booking.</div>
            <button class="mt-3 w-full bg-gray-800 hover:bg-black text-white rounded py-2 text-sm" @click="goCancel">Cancel Booking</button>
          </div>
        </aside>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref,computed,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import OtaHeader from './components/OtaHeader.vue'
import { getHotelInfo } from '@/views/ota/services/otaApi'
import { useServiceStore } from '@/composables/serviceStore'

const router = useRouter()
const brand = computed(() => hotelData.value?.name || '')
const hotelData = ref<any>(null)
const selectedCurrency = ref<string>('XAF')
const serviceStore = useServiceStore()
const loading = ref<boolean>(true)
function setCurrency(c: string) { selectedCurrency.value = c }
const hotelAddress = computed(() => {
  const addr = hotelData.value?.address
  if (!addr) return ''
  return `${addr.address}, ${addr.city}, ${addr.country.toUpperCase()}`
})
const hotelPhone = computed(() => hotelData.value?.contacts?.phoneNumber || '')
const hotelEmail = computed(() => hotelData.value?.contacts?.email || '')
const hotelWebsite = computed(() => hotelData.value?.contacts?.website || '')

const form = ref({ name: '', email: '', message: '' })
function submit() {
  if (!form.value.name || !form.value.email || !form.value.message) return
  alert(`Thanks, ${form.value.name}! We will reply to ${form.value.email}.`)
  form.value = { name: '', email: '', message: '' }
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
function goCancel() { router.push('/ota/cancel-booking') }
</script>

<style scoped>
</style>
