<template>
  <FullScreenLayout>
    <OtaHeader :brand="brand" :currency="selectedCurrency" @currency-change="setCurrency" />
    <div class="max-w-6xl mx-auto px-4 pt-14 py-6">
      <div class="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h1 class="text-2xl font-semibold">Location</h1>
        <p class="text-sm text-gray-600 mt-1">See where we are and how to get here.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section class="bg-white rounded-xl shadow-sm border">
          <div class="p-4 flex items-center justify-between">
            <div class="font-semibold">Map</div>
            <a href="https://maps.google.com/?q=Suita+Hotel+Douala" target="_blank" rel="noopener" class="text-blue-700 text-sm hover:underline">Open on Google Maps</a>
          </div>
          <div class="aspect-video w-full overflow-hidden rounded-b-xl border-t">
            <iframe
              class="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.835114874171!2d9.704!3d4.051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNC4wNTExLCA5LjcwNA!5e0!3m2!1sen!2scm!4v1600000000000"
              style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <p class="text-sm text-gray-700 p-4">We are in Douala, conveniently located near key business and leisure hubs.</p>
        </section>

        <aside class="bg-white rounded-xl shadow-sm border p-5">
          <div class="font-semibold mb-2">Getting here & nearby</div>
          <div class="space-y-4">
            <div>
              <div class="text-sm text-gray-700">Address</div>
              <div class="text-sm font-medium">Douala, Cameroon</div>
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
          </div>
        </aside>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import OtaHeader from './components/OtaHeader.vue'

const brand = 'TAMI SARL (SUITA HOTEL)'
const selectedCurrency = ref<string>('XAF')
function setCurrency(c: string) { selectedCurrency.value = c }
</script>

<style scoped>
</style>