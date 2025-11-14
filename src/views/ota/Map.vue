
<template>
  <FullScreenLayout>
    <OtaHeader :currency="selectedCurrency" :brand="brand" @currency-change="setCurrency" />
    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h1 class="text-2xl font-semibold">Location</h1>
        <p class="text-sm text-gray-600 mt-1">See where we are and how to get here.</p>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-500">
        Loading location information...
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section class="bg-white rounded-xl shadow-sm border">
          <div class="p-4 flex items-center justify-between">
            <div class="font-semibold">Map</div>
            <a :href="googleMapsLink" target="_blank" rel="noopener" class="text-blue-700 text-sm hover:underline">
              Open on Google Maps
            </a>
          </div>
          <div class="aspect-video w-full overflow-hidden rounded-b-xl border-t">
            <iframe
              class="w-full h-full"
              :src="mapEmbedUrl"
              style="border:0;"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p class="text-sm text-gray-700 p-4">
            {{ hotelDescription || `We are in ${hotelCity}, conveniently located near key business and leisure hubs.` }}
          </p>
        </section>

        <aside class="bg-white rounded-xl shadow-sm border p-5">
          <div class="font-semibold mb-2">Getting here & nearby</div>
          <div class="space-y-4">
            <div>
              <div class="text-sm text-gray-700">Address</div>
              <div class="text-sm font-medium">{{ fullAddress }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-700">Contact</div>
              <div class="text-sm space-y-1">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="font-medium">{{ hotelPhone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-gray-700">{{ hotelEmail }}</span>
                </div>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-700">Transport</div>
              <ul class="text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>10 min from the airport</li>
                <li>5 min to the business district</li>
                <li>Shops and restaurants nearby</li>
              </ul>
            </div>
            <div>
              <div class="text-sm text-gray-700">Distances</div>
              <div class="flex flex-wrap gap-2 mt-1">
                <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">City center 3 km</span>
                <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">Beach 6 km</span>
                <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">Port 4 km</span>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-700">Parking</div>
              <div class="text-sm text-gray-600">Free on-site parking, subject to availability.</div>
            </div>
            <div v-if="hotelWebsite">
              <div class="text-sm text-gray-700">Website</div>
              <a :href="hotelWebsite" target="_blank" rel="noopener" class="text-sm text-blue-600 hover:underline">
                {{ hotelWebsite }}
              </a>
            </div>
          </div>
        </aside>
      </div>

    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import OtaHeader from './components/OtaHeader.vue'
import { getHotelInfo } from '@/views/ota/services/otaApi'
import { useRoute } from 'vue-router'


const hotelData = ref<any>(null)
const loading = ref<boolean>(true)
const route = useRoute()
const hotelId:any = computed(()=> route.query.hotelId as string)

// Computed properties
const brand = computed(() => hotelData.value?.name || '')
const hotelDescription = computed(() => hotelData.value?.description || '')
const hotelCity = computed(() => hotelData.value?.address?.city || '')
const hotelPhone = computed(() => hotelData.value?.contacts?.phoneNumber || '+237 650 00 00 00')
const hotelEmail = computed(() => hotelData.value?.contacts?.email || 'info@hotel.com')
const hotelWebsite = computed(() => hotelData.value?.contacts?.website || '')

const fullAddress = computed(() => {
  const addr = hotelData.value?.address
  if (!addr) return 'Cameroon'

  const parts = [
    addr.address,
    addr.city,
    addr.stateProvince,
    addr.country?.toUpperCase()
  ].filter(Boolean)

  return parts.join(', ')
})

// Google Maps integration
const googleMapsLink = computed(() => {
  const addr = hotelData.value?.address
  const name = hotelData.value?.name || 'Suita Hotel Douala'

  if (!addr) return `https://maps.google.com/?q=${encodeURIComponent(name)}`

  const query = encodeURIComponent(`${name}, ${addr.address}, ${addr.city}, ${addr.country}`)
  console.log('Google Maps query:', query)
  return `https://maps.google.com/?q=${query}`
})


const mapEmbedUrl = computed(() => {
  const addr = hotelData.value?.address
  const apiKey = 'AIzaSyA-lwJ6PdCvZhcON_hdZph4O13rq9znXJE'

  if (!addr) {
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.835114874171!2d9.704!3d4.051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNC4wNTExLCA5LjcwNA!5e0!3m2!1sen!2scm!4v1600000000000'
  }

  const query = encodeURIComponent(`${addr.address}, ${addr.city}, ${addr.country}`)
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`
})




const selectedCurrency = ref<string>('XAF')
function setCurrency(c: string) {
  selectedCurrency.value = c
}

// Fetch hotel info
const fetchHotelInfo = async () => {
  try {
    loading.value = true
    const response = await getHotelInfo(hotelId.value)
    hotelData.value = response.data.data

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
  console.log('Google API Key:', import.meta.env.VITE_API_KEY)
})



</script>



<style scoped>
</style>
