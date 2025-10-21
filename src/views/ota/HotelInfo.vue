<template>
  <FullScreenLayout>
    <OtaHeader :brand="brand" :currency="selectedCurrency" @currency-change="setCurrency" />
    <div class="max-w-6xl mx-auto px-4 pt-14 py-6 space-y-6">
      <!-- Hero -->
      <section class="relative rounded-lg overflow-hidden shadow">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1280&q=60" alt="Hotel" class="absolute inset-0 w-full h-full object-cover" />
        <div class="relative p-6 md:p-8 bg-gradient-to-r from-black/60 to-black/20 text-white">
          <h1 class="text-2xl md:text-3xl font-bold">{{ brand }}</h1>
          <div class="mt-1 flex items-center gap-1">
            <StaredIcon v-for="n in 5" :key="n" class="w-4 h-4 text-yellow-300" />
            <span class="ml-2 text-xs">Excellent location • Free Wi‑Fi • 24/7 desk</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded px-4 py-2 text-sm" @click="goBooking">Check Availability</button>
            <button class="bg-white/20 hover:bg-white/30 text-white rounded px-4 py-2 text-sm border border-white/30" @click="goMap">View Map</button>
          </div>
        </div>
      </section>

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section class="space-y-6 bg-white rounded-lg shadow-sm border p-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <div class="font-semibold">Address</div>
              <div class="text-sm text-gray-700">123 Example Street, Douala, Cameroon</div>
            </div>
            <div>
              <div class="font-semibold">Phone</div>
              <div class="text-sm text-gray-700">(+237) 650 00 00 00</div>
            </div>
            <div>
              <div class="font-semibold">Email</div>
              <div class="text-sm text-gray-700">info@suita-hotel.example</div>
            </div>
            <div>
              <div class="font-semibold">Website</div>
              <div class="text-sm text-blue-600"><a href="#" target="_blank">www.suita-hotel.example</a></div>
            </div>
          </div>

          <div>
            <div class="font-semibold mb-2">Property highlights</div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <div class="text-[12px] bg-gray-50 rounded border p-2">Free high‑speed Wi‑Fi</div>
              <div class="text-[12px] bg-gray-50 rounded border p-2">On‑site restaurant & bar</div>
              <div class="text-[12px] bg-gray-50 rounded border p-2">Airport shuttle (on request)</div>
              <div class="text-[12px] bg-gray-50 rounded border p-2">Laundry service</div>
              <div class="text-[12px] bg-gray-50 rounded border p-2">Meeting rooms</div>
              <div class="text-[12px] bg-gray-50 rounded border p-2">Daily housekeeping</div>
            </div>
          </div>

          <div>
            <div class="font-semibold mb-2">Gallery</div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button v-for="(img, idx) in galleryImages" :key="idx" class="group relative rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500" @click="openLightbox(idx)">
                <img :src="img" :alt="`Gallery image ${idx+1}`" class="w-full h-28 md:h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </button>
            </div>
          </div>

          <div v-if="lightboxOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div class="relative max-w-3xl w-[90%]">
              <img :src="galleryImages[activeIndex]" alt="Gallery" class="w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
              <button class="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-900 rounded px-3 py-1 text-sm" @click="closeLightbox">Close</button>
              <button class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full w-9 h-9" @click="prevImage">‹</button>
              <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full w-9 h-9" @click="nextImage">›</button>
            </div>
          </div>

          <div>
            <div class="font-semibold mb-2">Policies</div>
            <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Check‑in: 14:00 — Check‑out: 12:00</li>
              <li>Free cancellation up to 24 hours before arrival on flexible rates</li>
              <li>No smoking in rooms; designated outdoor areas available</li>
            </ul>
          </div>
        </section>

        <aside class="space-y-4">
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <div class="font-semibold mb-2">Need help?</div>
            <div class="text-sm text-gray-700">Reach us anytime for special requests or group bookings.</div>
            <button class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm" @click="goContact">Contact Us</button>
          </div>
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <div class="font-semibold mb-2">Location</div>
            <div class="text-sm text-gray-700">See our exact location and nearby points of interest.</div>
            <button class="mt-3 w-full bg-gray-800 hover:bg-black text-white rounded py-2 text-sm" @click="goMap">Open Map</button>
          </div>
        </aside>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import OtaHeader from './components/OtaHeader.vue'
import StaredIcon from '@/icons/StaredIcon.vue'

const router = useRouter()
const brand = 'TAMI SARL (SUITA HOTEL)'
const selectedCurrency = ref<string>('XAF')
function setCurrency(c: string) { selectedCurrency.value = c }
function goContact() { router.push('/ota/contact-us') }
function goMap() { router.push('/ota/map') }
function goBooking() { router.push('/ota/web-booking') }

// Gallery state
const galleryImages = ref<string[]>([
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1501117716987-c8e2a0b1e102?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1560067174-894d3c964ae6?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b2776?auto=format&fit=crop&w=1200&q=60'
])
const lightboxOpen = ref<boolean>(false)
const activeIndex = ref<number>(0)
function openLightbox(idx: number) { activeIndex.value = idx; lightboxOpen.value = true }
function closeLightbox() { lightboxOpen.value = false }
function prevImage() { activeIndex.value = (activeIndex.value + galleryImages.value.length - 1) % galleryImages.value.length }
function nextImage() { activeIndex.value = (activeIndex.value + 1) % galleryImages.value.length }
</script>

<style scoped>
</style>